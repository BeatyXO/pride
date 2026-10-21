# PRIDE — Proof matters

PRIDE is a public commitment registry built as GenLayer Intelligent Contracts. The local showcase contains fictional browser-local records; the Real Network workspace reads and writes the configured Studionet contract. Publisher names and repository scope are self-asserted; wallet control does not prove organization, domain, or repository ownership.

## V1 contract policy

- Source material is commit-pinned raw GitHub `.txt`, normalized and stored as a bounded snapshot with SHA-256.
- Permissionless observations are limited to the publisher's declared repository. This provides reproducible, independent wallet participation, not an independent authority registry.
- Challenge capsules bind the relevant version, source digests, exact evidence, parties, and lifecycle times. Third-party claims are labeled unverified and cannot alone support an upheld finding. A `MATCHES` checkpoint may be challenged only when it carries a verified exact citation.
- The issuer's rebuttal window closes strictly before `opened_at + 3600` seconds. Adjudication can begin at the deadline; an issuer cannot change that deadline.
- The separate `PrideRelianceGate` permits only an active commitment at the expected version with a current-version `MATCHES` checkpoint, matching publisher-repository scope and captured-content digest, and no unresolved or adverse case. Missing evidence fails closed. `OBSERVED` standing alone never permits. Corrected live Gate source uses the documented synchronous `view()` cross-contract call; finalized live `REJECTED` and `PERMITTED` decisions match independent Pride state readbacks.

See [security and trust model](docs/SECURITY.md), [product and architecture](docs/PRODUCT_SPEC.md), [baseline freeze](docs/MILESTONE_BASELINE.md), the [test matrix](docs/TEST_MATRIX_V1.md), and the [reviewer evidence](docs/REVIEWER_V1.md).

## Local validation

Required tools: GenLayer CLI `0.39.1`, pinned GenVM runner marker `v0.2.16`, GenVM lint `0.11.0`, and GenLayer Direct Mode tooling from `requirements-dev.txt`.

```sh
npm ci
npm test
python -m unittest discover -s tests -p '*test.py' -v
python -m py_compile contracts/Pride.py contracts/pride_reliance_gate.py
genvm-lint lint contracts/Pride.py
genvm-lint lint contracts/pride_reliance_gate.py
gltest -p no:cacheprovider tests/test_contract_direct.py tests/test_reliance_gate_direct.py tests/test_gate_integration.py -v
npm run build
```

Direct Mode and simulator runs use controlled source/model fixtures and do not prove live Studionet consensus. The cross-contract simulator test executes the real Pride view, but it is not network evidence. `genvm-lint lint` is AST lint; SDK validation is a separate check and must not be inferred from AST success.

## Studionet and Vercel

Target network: GenLayer Studionet, chain `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`, explorer `https://explorer-studio.genlayer.com`.

Current Pride and corrected Reliance Gate deployments are recorded in `assets/deployment.json`, with finalized deployment transactions and byte-for-byte deployed source parity. Live Pride adjudications now include `UPHELD`, `REJECTED`, and `INCONCLUSIVE`; live Gate `REJECTED` and `PERMITTED` decisions were independently read back and matched the corresponding Pride eligibility state. Earlier Gate deployments using a `LATEST_FINAL` state override timed out; the corrected `view()` call completed successfully. Production-mode build validates deployment metadata and writes the manifest into `public/assets/deployment.json`.

Supported public Vercel build variables:

| Variable | Required value |
| --- | --- |
| `PRIDE_NETWORK` | `studionet` |
| `PRIDE_CHAIN_ID` | `61999` |
| `PRIDE_RPC_URL` | `https://studio.genlayer.com/api` |
| `PRIDE_EXPLORER_URL` | `https://explorer-studio.genlayer.com` |
| `PRIDE_CONTRACT_ADDRESS` | `0x1A232b6eb69484B29f9Fc9A0Fa06c927083726e9` |
| `PRIDE_DEPLOYMENT_TRANSACTION` | `0x431f90c4dfa57aadbe38480df2fbfcdafffbe7777596391d1fac8ad225520302` |
| `PRIDE_SOURCE_SHA256` | `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504` |
| `PRIDE_RELIANCE_GATE_ADDRESS` | `0x7eF1f14639e1F6DA28E4912Ec7D0C50DA0f8fB9a` |
| `PRIDE_RELIANCE_GATE_DEPLOYMENT_TRANSACTION` | `0x9ccb5596afdd2460eb63cceae80895804d26b60059151f92557eec259c3a7e7a` |
| `PRIDE_RELIANCE_GATE_SOURCE_SHA256` | `08686bfdaf4fd79b938c280c8577b1b119cb35316fd74d14ac9fce1145d6a05a` |

`vercel.json` specifies `npm run build` and `public`. Never put a private key or seed phrase in Vercel.

## Release status

Live Studionet evidence now covers the complete Pride case outcome matrix and Gate `PERMITTED`/`REJECTED` decisions. See [live transaction evidence](docs/LIVE_EVIDENCE.md), [case evidence](docs/live-lifecycle-case-v1.json), [case evidence: REJECTED](docs/live-lifecycle-case-v2-rejected.json), [case evidence: INCONCLUSIVE](docs/live-lifecycle-case-v3-inconclusive.json), and [Gate evidence](docs/live-gate-decisions-v1.json). The release is merged to `main` at `856c1907062cce8fc92df08f90791bd189f5fdcc`; the baseline-to-final [comparison](docs/MILESTONE_COMPARISON.md) is preserved. The existing production frontend is https://pride-eta.vercel.app. Its public deployment manifest now reports the V1 Studionet addresses and matching source hashes. GitHub Actions passed on the exact release tree at `02b7ac592e5cbf7649e1d99af7707086253afc9b`. Mocked EIP-1193 tests pass, but genuine injected-wallet checks on the production site remain outstanding. The GitHub Vercel status context still points to the legacy `beatycat/pride` integration; it does not describe the verified public production manifest. Release readiness awaits the production frontend checks listed in [the test matrix](docs/TEST_MATRIX_V1.md).
