# PRIDE — Proof matters

PRIDE is a public commitment registry with two clearly separated experiences:

- **Local showcase** uses fictional examples and browser storage. It does not submit transactions or produce verified evidence.
- **Real network** reads the configured GenLayer Studionet contract and submits writes from an injected EIP-1193 wallet. It is the default route. A write is successful only after finalization and state readback.

The original colored PRIDE mark, hero treatment, and project illustrations are part of the identity. Metric cards omit their small decorative symbols.

## Contract capabilities

`contracts/Pride.py` contains the current implementation candidate:

- Wallet-bound publisher labels with one asserted GitHub repository scope and revocation.
- Commit-pinned raw GitHub text evidence, complete bounded source snapshots, canonical SHA-256 digests, and validator-agreed semantic checkpoints. Each follow-up check names a newer immutable source URL in the publisher's repository scope.
- Deterministic numeric comparison signals, per-publisher/per-commitment capacity limits, and duplicate snapshot protection.
- Append-only amendment proposals and activation with source and notice digests.
- Evidence-backed challenge and issuer-rebuttal records. The only supported terminal challenge result is `INCONCLUSIVE`.

This is not proof that the wallet controls the named project, GitHub repository, or any domain. The runtime does not expose a verified final redirect URL or content type. Amendments have no trusted publication time or required advance-notice period. Disputes are recorded, not adjudicated. Read [the security model](docs/SECURITY.md) before treating records as evidence.

## Local development

```sh
npm ci
npm run build
npm test
python -m py_compile contracts/Pride.py
genvm-lint lint contracts/Pride.py
gltest -p no:cacheprovider tests/test_contract_direct.py -v
python -m http.server 8080
```

Open `http://localhost:8080`. Direct Mode fixtures are mocked and are not proof of live network behavior. `genvm-lint validate contracts/Pride.py` also requires the exact GenLayer runner archive named in the contract header.

## Vercel configuration

The build reads these **public** variables and writes them to `assets/deployment.json`:

| Variable | Value |
| --- | --- |
| `PRIDE_NETWORK` | `studionet` |
| `PRIDE_CHAIN_ID` | `61999` |
| `PRIDE_RPC_URL` | `https://studio.genlayer.com/api` |
| `PRIDE_EXPLORER_URL` | `https://explorer-studio.genlayer.com` |
| `PRIDE_CONTRACT_ADDRESS` | The address of the final deployed contract |
| `PRIDE_DEPLOYMENT_TRANSACTION` | The final deployment transaction hash |
| `PRIDE_SOURCE_SHA256` | SHA-256 of the final contract source bytes |

Never put a wallet private key or seed phrase in Vercel. The manifest records the current Studionet deployment and its matching source hash. The earlier v0.2 address is retained only as historical metadata.

## Deployment status

The current contract is deployed at `0xde82a7650E938D53df225fc25De61D3909Ce4393` on Studionet. Its deployment transaction `0x621ede8922db31a181ffe0f81569e962e70cf51025abdd758e3bc5d228a8974c` finalized with majority agreement. The deployed source was fetched from RPC and matched byte-for-byte: `b1f3a1df85ebebbc500bee3277826ca5e7e5491dad8b8766fd724ba5710f9083`. Initial state reads returned no publishers and no charters. See [live evidence](docs/LIVE_EVIDENCE.md) for the scope and pending lifecycle checks.

## CI

GitHub Actions runs JavaScript syntax checks and unit tests, Python checks, GenVM lint, and GenVM Direct Mode contract tests. Browser automation and real Studionet wallet tests are not claimed by the current test suite.
