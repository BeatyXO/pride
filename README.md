# PRIDE — Proof matters

PRIDE is a public commitment registry built as GenLayer Intelligent Contracts. The local showcase contains fictional browser-local records; only the Real Network workspace reads or writes the configured Studionet contract. The colored identity and project artwork are preserved.

## V1 milestone implementation

- Wallet-bound publisher records with asserted repository scope (no claim of GitHub or domain ownership).
- Commit-pinned raw GitHub text snapshots, bounded full-body canonical SHA-256, validator-agreed comparisons, deterministic numeric-change signals, and immutable versions.
- Permissionless source observation within the publisher-declared repository, storing observer, source role, version, digest, snapshot, and timestamp.
- Evidence cases freeze the commitment version, checkpoint, digest identities, participant wallets, criteria, and case ID. Issuers may rebut; anyone may request consensus adjudication or expire a stalled case. Adverse outcomes require validator-agreed structured decisions and exact citations from the frozen publisher-declared checkpoint.
- `PrideRelianceGate` is a separate non-custodial consumer contract that reads PRIDE at `LATEST_FINAL`, checks active status, expected version, and `OBSERVED` standing, and stores bounded unique action decisions.

Review [the security model](docs/SECURITY.md), [product and architecture](docs/PRODUCT_SPEC.md), and [baseline comparison point](docs/MILESTONE_BASELINE.md). Model adjudication is a bounded evidence assessment, not a legal or fraud finding. Repository scope is self-asserted.

## Local checks

Required tools: GenLayer CLI `0.39.1`, GenVM baseline `v0.2.12`, GenVM lint `0.11.0`, and GenLayer Direct Mode test tooling listed in `requirements-dev.txt`.

```sh
npm ci
npm run build
npm test
python -m unittest discover -s tests -p '*test.py' -v
python -m py_compile contracts/Pride.py contracts/pride_reliance_gate.py
genvm-lint lint contracts/Pride.py
genvm-lint lint contracts/pride_reliance_gate.py
gltest -p no:cacheprovider tests/test_contract_direct.py tests/test_reliance_gate_direct.py -v
python -m http.server 8080
```

Direct Mode uses controlled source/model fixtures. It does not prove public-network source retrieval or live Studionet consensus. The Gate Direct Mode tests inject the cross-contract RPC response; live cross-contract behavior still requires Studionet integration evidence.

## Studionet and Vercel

Target network is Studionet, chain `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`. `assets/deployment.json` intentionally contains no active V1 contract address yet. V0.3 metadata is historical only. Configure the public Vercel build variables after V1 deployment:

| Variable | Value |
| --- | --- |
| `PRIDE_NETWORK` | `studionet` |
| `PRIDE_CHAIN_ID` | `61999` |
| `PRIDE_RPC_URL` | `https://studio.genlayer.com/api` |
| `PRIDE_EXPLORER_URL` | `https://explorer-studio.genlayer.com` |
| `PRIDE_CONTRACT_ADDRESS` | Final V1 Studionet contract address |
| `PRIDE_DEPLOYMENT_TRANSACTION` | Final V1 deployment transaction hash |
| `PRIDE_SOURCE_SHA256` | SHA-256 of the exact deployed `contracts/Pride.py` bytes |
| `PRIDE_RELIANCE_GATE_ADDRESS` | Optional deployed Reliance Gate address for its read/write panel |

The build deliberately fails on Vercel until the address, transaction, and final source hash are supplied. Never put a private key or seed phrase in Vercel. See [live evidence status](docs/LIVE_EVIDENCE.md).

## Release status

V1 is not yet deployed. No V1 address, deployment transaction, source parity, lifecycle transaction evidence, GitHub CI run, or Vercel URL is claimed. The previous V0.3 deployment is retained in the manifest and live evidence record as historical context only. The milestone branch is `milestone/pride-v1-adjudication`; no merge to `main` is implied.
