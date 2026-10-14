import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const path = new URL('../assets/deployment.json', import.meta.url);
const manifest = JSON.parse(await readFile(path, 'utf8'));
const env = process.env;
const source = await readFile(new URL('../contracts/Pride.py', import.meta.url));
const sourceSha256 = createHash('sha256').update(source).digest('hex');
const stringOverrides = [
  ['PRIDE_NETWORK', 'network'],
  ['PRIDE_CONTRACT_ADDRESS', 'contractAddress'],
  ['PRIDE_RPC_URL', 'rpcUrl'],
  ['PRIDE_EXPLORER_URL', 'explorerUrl'],
  ['PRIDE_DEPLOYMENT_TRANSACTION', 'deploymentTransaction'],
  ['PRIDE_SOURCE_SHA256', 'sourceSha256'],
];
for (const [name, key] of stringOverrides) {
  if (env[name]?.trim()) manifest[key] = env[name].trim();
}
if (env.PRIDE_CHAIN_ID?.trim()) {
  const chainId = Number(env.PRIDE_CHAIN_ID);
  if (!Number.isSafeInteger(chainId)) throw new Error('PRIDE_CHAIN_ID must be a safe integer.');
  manifest.chainId = chainId;
}
if (manifest.network !== 'studionet' || manifest.chainId !== 61999) {
  throw new Error('PRIDE only builds for GenLayer Studionet (chain ID 61999).');
}
if (manifest.contractAddress && !/^0x[0-9a-fA-F]{40}$/.test(manifest.contractAddress)) {
  throw new Error('PRIDE_CONTRACT_ADDRESS must be a 20-byte hex address.');
}
if (env.VERCEL === '1' && !manifest.contractAddress) throw new Error('Set PRIDE_CONTRACT_ADDRESS to the deployed contract address before deploying to Vercel.');
if (env.VERCEL === '1' && !/^0x[0-9a-fA-F]{64}$/.test(manifest.deploymentTransaction || '')) {
  throw new Error('Set PRIDE_DEPLOYMENT_TRANSACTION to the finalized contract deployment transaction.');
}
if (manifest.rpcUrl && !manifest.rpcUrl.startsWith('https://')) throw new Error('PRIDE_RPC_URL must use HTTPS.');
if (manifest.explorerUrl && !manifest.explorerUrl.startsWith('https://')) throw new Error('PRIDE_EXPLORER_URL must use HTTPS.');
if (env.VERCEL === '1' && (!/^[0-9a-fA-F]{64}$/.test(manifest.sourceSha256 || '') || manifest.sourceSha256.toLowerCase() !== sourceSha256)) {
  throw new Error('PRIDE_SOURCE_SHA256 must match the deployed contracts/Pride.py bytes.');
}
await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`);
