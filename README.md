# PRIDE — Proof matters

PRIDE is a public commitment registry with two clearly separated experiences:

- **Local showcase** uses fictional examples and browser storage. It does not submit transactions or produce verified evidence.
- **Real network** reads the configured GenLayer Studionet contract and submits writes from an injected EIP-1193 wallet. It is the default route. A write is successful only after finalization and state readback.

The original colored PRIDE mark, hero treatment, and project illustrations are part of the identity. Metric cards omit their small decorative symbols.

## Contract capabilities

`contracts/Pride.py` contains the deployed implementation:

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

The current contract is deployed at `0xe20273aDaaDb19B6BE34Fa5C6CfDe3B59719d4C0` on Studionet (chain ID `61999`). Deployment transaction `0x77786b21af2621d46f7253ce481948994ca513cafcc1631391be9357c5b59608` finalized with majority agreement and successful execution. RPC source retrieval matched the local contract byte-for-byte; SHA-256 is `4594532457829e48fd57bd89a7adfaf7bfa20cb3f1f478d411606af33f84de77`. A public fixture lifecycle has also been executed and independently read back. See [live evidence](docs/LIVE_EVIDENCE.md).

## CI

GitHub Actions runs JavaScript syntax checks and unit tests, Python checks, GenVM lint, and GenVM Direct Mode contract tests. Browser automation and real Studionet wallet tests are not claimed by the current test suite.
