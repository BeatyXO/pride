# PRIDE V1 milestone comparison

## Comparison points

- Baseline commit: `1537599fa4bb68df6d1fbb07b47c028c4eff31bc` (tree `1f771f2de05fd0fbeb63e95b864116ab59275bef`).
- Audited milestone commit: `f5f17ec1aedeb9542ba8cf6e0ee6b843abad1b88` on `milestone/pride-v1-adjudication`.
- Baseline Pride source SHA-256: `4594532457829e48fd57bd89a7adfaf7bfa20cb3f1f478d411606af33f84de77`.
- Audited Pride source SHA-256: `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504`.
- Audited Reliance Gate source SHA-256: `0465495b95c2afb9a833496f40becbea91daaf907e7c50af77ca50084a218c3f`.

The baseline has no separate Reliance Gate. The current Pride and Gate addresses in `assets/deployment.json` are the active V1 deployments, and their local source hashes match the recorded deployed source fingerprints. Historical prototype deployments are not treated as V1 evidence.

## Capability delta

| Capability | Baseline | V1 audited state |
| --- | --- | --- |
| Publisher/source capture | Publisher-scoped, commit-pinned source checks | Immutable bounded snapshots, digest checks, permissionless declared-scope observations |
| Versioning | Amendments recorded | Append-only versions with guarded activation |
| Challenge lifecycle | No live upheld/rejected adjudication | Case capsule, rebuttal boundary, adjudication and expiry code; live `UPHELD` case documented |
| Canonical standing | Absent | Standing and fail-closed reliance status views |
| Consumer authorization | No Gate | Separate operator-bound Gate deployed; live calls time out, so no authorization result is verified |
| Browser writes | Injected-wallet lifecycle and finalized readback | Expanded wallet/write states; mocked wallet tests pass, hosted production and wallet browser flow remain unverified |

## Live deployment and execution evidence

- Studionet chain ID `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`.
- Pride: `0x1A232b6eb69484B29f9Fc9A0Fa06c927083726e9`, deployment transaction `0x431f90c4dfa57aadbe38480df2fbfcdafffbe7777596391d1fac8ad225520302`.
- Gate: `0x5cEeD74e1465da8D962C1DAe98903F72089E0A18`, deployment transaction `0x796c3b7972a66045b806470362032a7b9f182a0820be6372a934dc1132eaaa60`.
- The live Pride lifecycle includes an evidence-backed `UPHELD` / `MATERIAL_DEVIATION` case and version-2 amendment. Transaction details are in `docs/live-lifecycle-case-v1.json`.
- Gate authorization transaction `0x6e67f5a18588a03fa0f563797542a17d5a4e8120816a920985967e1871acee98` finalized `NO_MAJORITY` with leader `ERROR` / `LEADER_EXEC_TIMEOUT` at 600 seconds.
- A second call, transaction `0x3b9d1ec683b4315a42bd7c7fc877548090551d2b60ebf0720afebd8fed3cf058`, was submitted for action `pride-v1-upheld-case-reject-20261020` from the configured operator. Its finalized receipt again reports `NO_MAJORITY`, leader execution `ERROR`, `Leader execution exceeded 600.000s`, and `LEADER_EXEC_TIMEOUT` (leader model `policy:prd-gpt-5-4`, provider `llm-router`). A subsequent independent `get_decisions(0,50)` read returned `[]`.
- The configured RPC does not expose `gen_dbg_traceTransaction`, so the internal GenVM trace could not be retrieved. Receipt evidence establishes a repeatable leader-timeout failure on the live Gate call path, but does not locate the exact failing internal operation or prove the timeout root cause.
- Deployed schemas/configuration and source parity have been checked. Direct Mode and simulator results are not evidence of live contract-to-contract success.

## Local checks observed in this audit

- `npm test`: 23/23 passed.
- `python -m pytest -q`: 27/27 passed.
- `VERCEL=1 npm run build`: passed and produced the configured `public` output directory. The un-elevated attempt was blocked by workspace access; the rerun with workspace access passed.
- These checks do not establish live Gate decisions, browser-wallet signing, a hosted Vercel production deployment, or fresh GitHub CI.
- Previously observed GitHub checks for the audited commit: `static-and-unit` passed and `Vercel Preview Comments` passed; the Vercel deployment context failed. The failure details and any later rerun have not been verified in this audit.

## Disposition

This milestone is **not ready for submission**. Live Gate `PERMITTED` and `REJECTED` decisions, live case `REJECTED` and `INCONCLUSIVE` outcomes, resolution of the live Gate timeout, a public Vercel production deployment with injected-wallet browser evidence, and a fresh green CI run remain outstanding. No release-ready claim is made.
