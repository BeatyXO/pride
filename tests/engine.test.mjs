import test from 'node:test';
import assert from 'node:assert/strict';
import {comparePromise,extractNumbers,safeUrl,charterStatus,makeInitial,summarize,wordDiff,validateSnapshot,sha256} from '../assets/engine.mjs';

test('unchanged after normalization',()=>assert.equal(comparePromise('Community  30%','Community 30%').classification,'UNCHANGED'));
test('percentage changes are caught',()=>assert.equal(comparePromise('30% will be distributed','15% will be distributed').classification,'MATERIAL_CHANGE'));
test('numeric deadline changes are caught',()=>assert.equal(comparePromise('Notice is 14 days','Notice is 7 days').classification,'MATERIAL_CHANGE'));
test('wording change never auto-condemns',()=>assert.equal(comparePromise('Refunds within seven days','Refunds within a week').classification,'NEEDS_REVIEW'));
test('invalid missing text rejected',()=>assert.throws(()=>comparePromise('', 'something')));
test('long text rejected',()=>assert.throws(()=>comparePromise('a'.repeat(4001),'hello')));
test('numeric extraction remains ordered',()=>assert.deepEqual(extractNumbers('20% and 12 months'),['20%','12months']));
test('safe links restricted to public https',()=>{for(const url of ['http://example.org','https://localhost','https://127.0.0.1','https://10.0.0.1/private','https://admin:pass@example.org','https://evil.local','javascript:alert(1)']) assert.equal(safeUrl(url),null,url);assert.equal(safeUrl('https://example.org/terms'),'https://example.org/terms');});
test('local records have expected seeded statuses',()=>{const s=makeInitial();assert.equal(summarize(s).total,4);assert.equal(summarize(s).challenged,1);assert.equal(charterStatus(s.charters.find(x=>x.id==='redwood')),'DISCLOSED');});
test('tampered backups rejected',()=>{const x=makeInitial();x.charters.push({...x.charters[0]});assert.throws(()=>validateSnapshot(x));});
test('backup can be restored safely',()=>assert.equal(validateSnapshot(makeInitial()).charters.length,4));
test('word diff identifies modification both directions',()=>{const x=wordDiff('Fees are 0%','Fees are 1%');assert.equal(x.before.find(x=>x.word==='0%').changed,true);assert.equal(x.after.find(x=>x.word==='1%').changed,true);});
test('sha256 matches standard vector',async()=>assert.equal(await sha256('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'));
