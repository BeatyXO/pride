/** PRIDE's deterministic, dependency-free local comparison engine.
 * These results are hints, NOT AI rulings or on-chain judgments.
 */
export const STORAGE_KEY = 'pride-local-showcase-v1';
export const MAX_TEXT = 4000;
export const MAX_CHARTERS = 100;
export const MAX_CHECKPOINTS = 40;
const DEMO_DATE = '2026-10-01T12:00:00.000Z';
export const demoCharters = [
  { id: 'orbit-labs', name: 'Orbit Labs', issuer: 'Orbit Protocol', category: 'Tokenomics', url: 'https://example.org/orbit', promise: 'Community receives 30% of tokens. Team allocation unlocks after a 12-month cliff.', createdAt: DEMO_DATE, checkpoints: [{id:'orbit-change', at:'2026-10-03T15:10:00.000Z', source:'https://example.org/orbit', text:'Community receives 15% of tokens. Team allocation unlocks after a 6-month cliff.', disclosed:false, note:'Illustrative policy amendment', classification:'MATERIAL_CHANGE'}], challenges: [{id:'oc1',at:'2026-10-04T10:00:00.000Z',text:'The allocation and cliff changed without an associated disclosure in this example.',status:'OPEN'}], synthetic:true, tone:'#9f5ae9', icon:'🪐' },
  { id: 'solstice', name: 'Solstice DAO', issuer: 'Solstice Collective', category: 'Governance', url: 'https://example.org/solstice', promise:'Governance proposals remain open for at least 7 days before voting closes.', createdAt: DEMO_DATE, checkpoints: [], challenges:[], synthetic:true, tone:'#ffca52', icon:'☀️' },
  { id: 'redwood', name:'Redwood Finance', issuer:'Redwood', category:'Fees', url:'https://example.org/redwood', promise:'Platform withdrawal fees are 0%. Any future fee must be announced at least 14 days before activation.', createdAt: DEMO_DATE, checkpoints:[{id:'redwood-change',at:'2026-10-07T09:30:00.000Z',source:'https://example.org/redwood',text:'Platform withdrawal fees are 1%. Any future fee must be announced at least 14 days before activation.',disclosed:true,note:'Issuer reports advance notice; not independently checked',classification:'MATERIAL_CHANGE'}], challenges:[],synthetic:true,tone:'#f36a79',icon:'🌲'},
  { id:'bluebird', name:'Bluebird Commons',issuer:'Bluebird Foundation',category:'Community',url:'https://example.org/bluebird',promise:'Community treasury updates will be published every calendar month.',createdAt: DEMO_DATE,checkpoints:[],challenges:[],synthetic:true,tone:'#71b6ff',icon:'🕊️'}
];
export function normalize(text) { return String(text ?? '').normalize('NFKC').replace(/\s+/g,' ').trim(); }
export function meaningfulTokens(text) {return normalize(text).toLowerCase().match(/\b\d+(?:\.\d+)?%?|[a-z]+\b/g) || [];}
export function extractNumbers(text) {return (normalize(text).match(/\d+(?:\.\d+)?\s*(?:%|days?|months?|years?|hours?|weeks?)?/gi)||[]).map(x=>x.replace(/\s+/g,'').toLowerCase());}
export function comparePromise(original, updated) {
  const a=normalize(original), b=normalize(updated);
  if(!a||!b) throw new Error('Both promise texts are required.');
  if(a.length>MAX_TEXT||b.length>MAX_TEXT) throw new Error('Promise exceeds 4,000 characters.');
  if(a===b) return {classification:'UNCHANGED',changed:false,reason:'The normalized text is unchanged.',oldNumbers:extractNumbers(a),newNumbers:extractNumbers(b)};
  const x=extractNumbers(a),y=extractNumbers(b);
  if(x.join('|')!==y.join('|')) return {classification:'MATERIAL_CHANGE',changed:true,reason:'Numbers, percentages, or time periods changed. Human review is required to decide the impact.',oldNumbers:x,newNumbers:y};
  return {classification:'NEEDS_REVIEW',changed:true,reason:'Wording changed. A semantic impact determination requires independent review.',oldNumbers:x,newNumbers:y};
}
export function safeUrl(raw) {
  try {const u=new URL(String(raw).trim());if(u.protocol!=='https:'||u.username||u.password||!u.hostname.includes('.')||u.hostname==='localhost'||/^(?:127\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(u.hostname)||/\.(?:local|internal|test)$/.test(u.hostname)) return null;return u.href;}catch{return null;}
}
export function charterStatus(charter) {
 const last=charter.checkpoints?.at(-1);
 if(charter.challenges?.some(x=>x.status==='OPEN')) return 'CHALLENGED';
 if(!last||last.classification==='UNCHANGED') return 'TRACKED';
 if(last.disclosed) return 'DISCLOSED';
 return 'REVIEW';
}
export function makeInitial() {return {version:1,createdAt:new Date().toISOString(),charters:structuredClone(demoCharters),actions:[]};}
export function validateSnapshot(snapshot){
 if(!snapshot||snapshot.version!==1||!Array.isArray(snapshot.charters)||snapshot.charters.length>MAX_CHARTERS) throw new Error('Unsupported PRIDE backup.');
 const ids=new Set();
 const charters=snapshot.charters.map(c=>{
  if(!c||typeof c.id!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(c.id)||ids.has(c.id)) throw new Error('Invalid or repeated charter ID.');
  ids.add(c.id);
  if(![c.name,c.issuer,c.category,c.promise,c.url].every(x=>typeof x==='string')||c.name.length>90||c.issuer.length>90||c.category.length>60||c.promise.length>MAX_TEXT||!safeUrl(c.url)) throw new Error('Charter contains invalid data.');
  if(!Array.isArray(c.checkpoints)||c.checkpoints.length>MAX_CHECKPOINTS||!Array.isArray(c.challenges)||c.challenges.length>100) throw new Error('Too many records in charter.');
  for(const q of c.checkpoints){if(typeof q.text!=='string'||q.text.length>MAX_TEXT||!safeUrl(q.source)||typeof q.at!=='string') throw new Error('Invalid checkpoint.');}
  for(const q of c.challenges){if(typeof q.text!=='string'||q.text.length>MAX_TEXT||typeof q.at!=='string'||!['OPEN','CLOSED'].includes(q.status)) throw new Error('Invalid challenge.');}
  return {...c,synthetic:!!c.synthetic};
 });
 return {version:1,createdAt:typeof snapshot.createdAt==='string'?snapshot.createdAt:new Date().toISOString(),charters,actions:[]};
}
export async function sha256(text){ const bytes=new TextEncoder().encode(String(text)); const digest=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');}
export function summarize(state){const c=state.charters;return {total:c.length,tracked:c.filter(x=>charterStatus(x)==='TRACKED').length,review:c.filter(x=>charterStatus(x)==='REVIEW').length,challenged:c.filter(x=>charterStatus(x)==='CHALLENGED').length,checkpoints:c.reduce((n,x)=>n+x.checkpoints.length,0)};}
export function wordDiff(a,b){ // Bounded, readable text diff for local browser preview only.
 const aa=normalize(a).split(' '),bb=normalize(b).split(' ');
 if(aa.length>350||bb.length>350) return {before:[{word:a,changed:true}],after:[{word:b,changed:true}]};
 const grid=Array.from({length:aa.length+1},()=>new Uint16Array(bb.length+1));
 for(let i=aa.length-1;i>=0;i--) for(let j=bb.length-1;j>=0;j--) grid[i][j]=aa[i]===bb[j]?grid[i+1][j+1]+1:Math.max(grid[i+1][j],grid[i][j+1]);
 const unchangedA=new Set(), unchangedB=new Set();let i=0,j=0;
 while(i<aa.length&&j<bb.length){if(aa[i]===bb[j]){unchangedA.add(i);unchangedB.add(j);i++;j++;}else if(grid[i+1][j]>=grid[i][j+1])i++;else j++;}
 return {before:aa.map((word,n)=>({word,changed:!unchangedA.has(n)})),after:bb.map((word,n)=>({word,changed:!unchangedB.has(n)}))};
}
