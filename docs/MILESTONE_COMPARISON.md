# PRIDE V1 milestone comparison

## Comparison point

- Baseline commit: `1537599fa4bb68df6d1fbb07b47c028c4eff31bc`
- Verified baseline tree: `1f771f2de05fd0fbeb63e95b864116ab59275bef`
- Baseline `contracts/Pride.py` SHA-256: `4594532457829e48fd57bd89a7adfaf7bfa20cb3f1f478d411606af33f84de77`
- Milestone branch: `milestone/pride-v1-adjudication`

The baseline has no Reliance Gate contract. Its Pride source SHA-256 above was recomputed from the Git blob at the baseline commit. The requested comparison uses this exact commit, not the parent commit/tree.

## Scope delta

The milestone adds publisher-scoped observations, immutable source snapshots, append-only charter versions, case capsules and adjudication, expiry, canonical standing, transaction readback in the real-network frontend, and a separate Reliance Gate. Local tests exercise those behaviors, but simulator and Direct Mode results are not live Studionet proof.

## Current release disposition

The earlier Pride and Gate deployment receipts remain historical and valid for their deployed source fingerprints. This audit changes both contracts, so those addresses no longer represent the checked-out source. The current source requires new source-matched deployments. The frontend build now marks writes disabled on source mismatch and rejects Vercel production builds until both deployed contract fingerprints match.

Live Reliance Gate authorization is still unproven: two previous transactions finalized `NO_MAJORITY` after a leader execution timeout. Receipt inspection confirms `LEADER_EXEC_TIMEOUT`; the configured RPC does not implement `gen_dbg_traceTransaction`, so internal GenVM trace output could not be retrieved. The deployed schema and pinned v0.2.16 runtime interface were inspected; the typed address, method signature, string return, and `LATEST_FINAL` state value are supported by the cached runtime implementation. This narrows the issue but does not identify its exact root cause.

The final source fingerprints, deployment outcomes, tests, comparison and freeze package are maintained in `docs/MILESTONE_V1_COMPARISON.md`, `docs/MILESTONE_V1_FREEZE.md`, `docs/LIVE_EVIDENCE_V1.md`, and `artifacts/milestone-v1-*` after generation. No READY FOR SUBMISSION status is implied while live scenarios, production Vercel, final CI, and user-signed deployment transactions remain outstanding.
