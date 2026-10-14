import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../assets/deployment.json', import.meta.url), 'utf8'));
const source = await readFile(new URL('../contracts/Pride.py', import.meta.url));
const actualHash = createHash('sha256').update(source).digest('hex');
if (manifest.network !== 'studionet' || manifest.chainId !== 61999) throw new Error('Manifest network/chain mismatch.');
if (!manifest.contractAddress) {
  if (manifest.deploymentTransaction || manifest.sourceSha256) throw new Error('Partial active deployment metadata is not allowed.');
  process.stdout.write('No active deployment recorded; previous prototype metadata is historical only.\n');
} else {
  if (!/^0x[0-9a-fA-F]{40}$/.test(manifest.contractAddress)) throw new Error('Invalid contract address.');
  if (!/^0x[0-9a-fA-F]{64}$/.test(manifest.deploymentTransaction)) throw new Error('Invalid deployment transaction hash.');
  if (manifest.sourceSha256 !== actualHash) throw new Error(`Source hash mismatch: expected ${manifest.sourceSha256}, actual ${actualHash}.`);
  process.stdout.write(`Manifest source hash matches local contract source: ${actualHash}\n`);
}
