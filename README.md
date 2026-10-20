# PRIDE — Proof matters

PRIDE is a public commitment registry built as GenLayer Intelligent Contracts. The local showcase contains fictional browser-local records; the Real Network workspace reads and writes the configured Studionet contract. Publisher names and repository scope are self-asserted; wallet control does not prove organization, domain, or repository ownership.

## V1 contract policy

- Source material is commit-pinned raw GitHub `.txt`, normalized and stored as a bounded snapshot with SHA-256.
- Permissionless observations are limited to the publisher's declared repository. This provides reproducible, independent wallet participation, not an independent authority registry.
- Challenge capsules bind the relevant version, source digests, exact evidence, parties, and lifecycle times. Third-party claims are labeled unverified and cannot alone support an upheld finding. A `MATCHES` checkpoint may be challenged only when it carries a verified exact citation.
- The issuer's rebuttal window closes strictly before `opened_at + 3600` seconds. Adjudication can begin at the deadline; an issuer cannot change that deadline.
- The separate `PrideRelianceGate` is intended to permit only an active commitment at the expected version with a current-version `MATCHES` checkpoint, matching publisher-repository scope and captured-content digest, and no unresolved or adverse case. Missing evidence fails closed. `OBSERVED` standing alone never permits. The Gate source is deployed with verified source parity, but live `authorize` transactions have twice finalized `NO_MAJORITY` after `LEADER_EXEC_TIMEOUT`; no live Gate decision is verified, and Gate writes remain disabled.

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

Current Pride and Reliance Gate deployments are recorded in `assets/deployment.json`, with finalized deployment transactions and matching local/deployed source hashes. Pride's live lifecycle includes one verified `UPHELD` case. Two authorized Gate calls finalized without majority after a 600-second leader timeout, and the independent Gate decision read remained empty. Production-mode build validates the deployment metadata and writes the manifest into `public/assets/deployment.json`; local build success does not prove a hosted Vercel deployment. No public production URL is verified.

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
| `PRIDE_RELIANCE_GATE_ADDRESS` | `0x5cEeD74e1465da8D962C1DAe98903F72089E0A18` |
| `PRIDE_RELIANCE_GATE_DEPLOYMENT_TRANSACTION` | `0x796c3b7972a66045b806470362032a7b9f182a0820be6372a934dc1132eaaa60` |
| `PRIDE_RELIANCE_GATE_SOURCE_SHA256` | `0465495b95c2afb9a833496f40becbea91daaf907e7c50af77ca50084a218c3f` |

`vercel.json` specifies `npm run build` and `public`. Never put a private key or seed phrase in Vercel.

## Release status

The Pride V1 deployment has a verified live lifecycle through an `UPHELD` challenge and version-2 amendment. The Gate deployment is source-matched, but two authorized cross-contract calls finalized `NO_MAJORITY` after leader timeouts; there is no Gate decision and frontend Gate writes are disabled. Local `VERCEL=1 npm run build` passes and emits the configured `public` directory. The observed hosted Vercel deployment check failed, and no public Vercel URL or production deployment is verified. Live `REJECTED`/`INCONCLUSIVE` adjudications, Gate `PERMITTED`/`REJECTED` results, injected-wallet browser verification, and fresh green CI remain outstanding. **Release is incomplete and not ready for submission.** See [live evidence](docs/LIVE_EVIDENCE.md) and [milestone comparison](docs/MILESTONE_COMPARISON.md).
