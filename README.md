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

Required tools: GenLayer CLI `0.39.1`, GenVM runner marker `v0.2.16` in both deployable contracts, GenVM lint `0.11.0`, and GenLayer Direct Mode test tooling listed in `requirements-dev.txt`.

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

Target network is Studionet, chain `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`. V0.3 metadata is historical only. Set these public Vercel build variables for the verified V1 deployment:

| Variable | Value |
| --- | --- |
| `PRIDE_NETWORK` | `studionet` |
| `PRIDE_CHAIN_ID` | `61999` |
| `PRIDE_RPC_URL` | `https://studio.genlayer.com/api` |
| `PRIDE_EXPLORER_URL` | `https://explorer-studio.genlayer.com` |
| `PRIDE_CONTRACT_ADDRESS` | `0xB8e8013A25a61CC0deD62621AaCA116B8F7aD03d` |
| `PRIDE_DEPLOYMENT_TRANSACTION` | `0x3e409db1629e2ff4acb8b85c72557a84ce0350eb2605aa4ccfb25906df1a7a52` |
| `PRIDE_SOURCE_SHA256` | `6b5a466b87eb99def3a11d6c60e00cbb6524383c8b08b7f1dd6bd6b96c8b5b8c` |
| `PRIDE_RELIANCE_GATE_ADDRESS` | `0xab5c9eFb60bd75F71260d085b6b4002430214a4e` |
| `PRIDE_RELIANCE_GATE_DEPLOYMENT_TRANSACTION` | `0x40e04e31f66d4b5533713628ce027c4a229cd7bd48c3cdf6036bbf776be8545a` |
| `PRIDE_RELIANCE_GATE_SOURCE_SHA256` | `cd9772002cd95069f387f234ce2aa62cd999eb4bd83f87a3b4ffb82b0a42bb59` |

The Vercel build writes the configured manifest into `public/assets/deployment.json` and requires verified metadata for both contracts. Set the build command to `npm run build` and output directory to `public` (both are recorded in `vercel.json`). Never put a private key or seed phrase in Vercel. See [live evidence status](docs/LIVE_EVIDENCE.md).

## Release status

Pride V1 and its Reliance Gate are deployed and finalized on Studionet. Their active addresses, deployment transactions, and exact local source hashes are recorded in `assets/deployment.json`; `docs/LIVE_EVIDENCE.md` records receipts and state readbacks. The live Pride lifecycle has verified publisher/charter registration, a matching baseline, material-change detection, an authorized version-2 amendment, an evidence-backed challenge and issuer rebuttal, and consensus adjudication (`UPHELD`, `MATERIAL_DEVIATION`). An unauthorized rebuttal transaction finalized without changing the open case. Two Gate authorization calls finalized without majority after leader timeouts; `get_decisions` remains empty, so Gate policy execution is not verified. Frontend and Vercel deployment status remain as described in the live evidence log. The previous V0.3 deployment is historical only. The milestone branch is `milestone/pride-v1-adjudication`; no merge to `main` is implied.
