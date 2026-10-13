import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  createClient,
  studionet,
  TransactionHashVariant,
  TransactionStatus,
} from '../assets/genlayer-client.js';

test('bundled GenLayerJS client exposes the Studionet read/write lifecycle API', () => {
  const client = createClient({ chain: studionet });
  assert.equal(studionet.id, 61999);
  assert.equal(typeof client.readContract, 'function');
  assert.equal(typeof client.writeContract, 'function');
  assert.equal(typeof client.waitForTransactionReceipt, 'function');
  assert.equal(TransactionHashVariant.LATEST_FINAL, 'latest-final');
  assert.equal(TransactionStatus.FINALIZED, 'FINALIZED');
});

test('real network manifest records the verified Studionet deployment', async () => {
  const file = new URL('../assets/deployment.json', import.meta.url);
  const config = JSON.parse(await readFile(file, 'utf8'));
  assert.equal(config.network, 'studionet');
  assert.equal(config.chainId, 61999);
  assert.equal(config.contractAddress, '0x900B946995Cf1B8C8BcF0C6cb95B0DC0F34E6167');
  assert.equal(config.deploymentTransaction, '0x6dcbe0b63c1302ed433efb3110791cd0e1d5e7ef461401447fce67574da970b9');
  assert.equal(config.sourceSha256, 'ae6f5bf9d4a19e74d76fa55d5ae678a4e94b691bb2419d2b8565ae06e7ccf5d8');
  assert.equal(config.lifecycleVerification.sourceCheckOutcome, 'MATCHES');
  assert.equal(config.lifecycleVerification.finalActive, false);
});
