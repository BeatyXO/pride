import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  createClient,
  studionet,
  TransactionHashVariant,
  TransactionStatus,
} from '../assets/genlayer-client.js';
import { connectInjectedWallet, subscribeWallet } from '../assets/wallet.mjs';
import { EventEmitter } from 'node:events';

test('bundled GenLayerJS client exposes the Studionet read/write lifecycle API', () => {
  const client = createClient({ chain: studionet });
  assert.equal(studionet.id, 61999);
  assert.equal(typeof client.readContract, 'function');
  assert.equal(typeof client.writeContract, 'function');
  assert.equal(typeof client.waitForTransactionReceipt, 'function');
  assert.equal(TransactionHashVariant.LATEST_FINAL, 'latest-final');
  assert.equal(TransactionStatus.FINALIZED, 'FINALIZED');
});

test('real network manifest keeps the old prototype separate from the active deployment', async () => {
  const file = new URL('../assets/deployment.json', import.meta.url);
  const config = JSON.parse(await readFile(file, 'utf8'));
  const source = await readFile(new URL('../contracts/Pride.py', import.meta.url));
  const sourceHash = createHash('sha256').update(source).digest('hex');
  assert.equal(config.network, 'studionet');
  assert.equal(config.chainId, 61999);
  assert.match(config.contractAddress, /^0x[0-9a-fA-F]{40}$/);
  assert.match(config.deploymentTransaction, /^0x[0-9a-fA-F]{64}$/);
  assert.equal(config.sourceSha256, sourceHash);
  assert.equal(config.previousPrototype.contractAddress, '0x900B946995Cf1B8C8BcF0C6cb95B0DC0F34E6167');
  assert.equal(config.previousPrototype.lifecycleVerification.sourceCheckOutcome, 'MATCHES');
  assert.equal(config.previousPrototype.lifecycleVerification.finalActive, false);
});

test('real-network wallet path uses injected EIP-1193 without SDK Snap connect', async () => {
  const source = (await readFile(new URL('../assets/network.mjs', import.meta.url), 'utf8'))
    + (await readFile(new URL('../assets/wallet.mjs', import.meta.url), 'utf8'));
  assert.match(source, /eip6963:requestProvider/);
  assert.match(source, /eth_requestAccounts/);
  assert.match(source, /eth_chainId/);
  assert.match(source, /accountsChanged/);
  assert.match(source, /chainChanged/);
  assert.doesNotMatch(source, /\.connect\(['"]studionet['"]\)/);
});

test('injected EIP-1193 wallet accepts Studionet and blocks another chain', async () => {
  const wallet = { request: async ({ method }) => method === 'eth_requestAccounts'
    ? ['0x1111111111111111111111111111111111111111'] : '0xf22f' };
  assert.deepEqual(await connectInjectedWallet(wallet), {
    address: '0x1111111111111111111111111111111111111111', chainId: 61999, chainIdHex: '0xf22f',
  });
  await assert.rejects(connectInjectedWallet({ request: async ({ method }) => method === 'eth_requestAccounts'
    ? ['0x1111111111111111111111111111111111111111'] : '0x1' }), /Wrong wallet network/);
});

test('wallet rejection is surfaced and account/chain events update subscribers', async () => {
  await assert.rejects(connectInjectedWallet({ request: async () => { throw Object.assign(new Error('User rejected'), { code: 4001 }); } }), /User rejected/);
  const provider = new EventEmitter();
  let account = '';
  let chain = '';
  const remove = subscribeWallet(provider, { accountsChanged: (value) => { account = value; }, chainChanged: (value) => { chain = value; } });
  provider.emit('accountsChanged', ['0x2222222222222222222222222222222222222222']);
  provider.emit('chainChanged', '0xf22f');
  assert.equal(account, '0x2222222222222222222222222222222222222222');
  assert.equal(chain, '0xf22f');
  remove();
});
