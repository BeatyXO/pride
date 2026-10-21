# PRIDE V1 reviewer evidence

## Review entry points

- Baseline scope and known limitations: `docs/MILESTONE_BASELINE.md`.
- Baseline-to-final capability comparison: `docs/MILESTONE_COMPARISON.md`.
- Verified Studionet deployment, Gate decisions, and RPC reads: `docs/LIVE_EVIDENCE.md` and `docs/live-gate-decisions-v1.json`.
- Pride `UPHELD`, `REJECTED`, and `INCONCLUSIVE` case evidence: `docs/live-lifecycle-case-v1.json`, `docs/live-lifecycle-case-v2-rejected.json`, and `docs/live-lifecycle-case-v3-inconclusive.json`.
- Source freeze and deployment map: `docs/MILESTONE_V1_FREEZE.md` and `assets/deployment.json`.
- Local, mocked, browser, and live evidence boundaries: `docs/TEST_MATRIX_V1.md`.
- Security model: `docs/SECURITY.md`.
- Final source and artifact hashes: `artifacts/milestone-v1-inventory.json`.

## Verified live capabilities

1. Pride's three case outcomes are finalized and independently read back from Studionet.
2. Corrected Gate source at `0x7eF1f14639e1F6DA28E4912Ec7D0C50DA0f8fB9a` was fetched with `gen_getContractCode`, exact-byte compared, and exercised live. Its finalized `REJECTED` transaction is `0x5b48ded23660fc2537cc059e254653d8c133201f50d397511bac43c1751d2402`.
3. The same source was deployed as a second test instance at `0xa48F2775CD457Fa2F7b4bf31d81C635367726F65`; its finalized `PERMITTED` transaction is `0x2a2730d2f1dfd1f1a6e408eda9ad93f2bd52a44811891e5016b1c110cf17242e`. Both decisions match independent Pride state reads.
4. The original Gate's `LATEST_FINAL` selector produced three finalized 600-second leader timeouts. The corrected standard `view()` call succeeded on both an adverse and an eligible Pride state.

## Remaining submission blockers

1. Production URL https://pride-coral.vercel.app is live; its fetched deployment manifest reports the verified Studionet deployment. The public page displayed all three records and the history views revealed the corresponding `UPHELD`, `REJECTED`, and `INCONCLUSIVE` cases.
2. The current browser session did not expose an injected EIP-1193 provider. Wallet connect/disconnect, wrong-network block, account change, real signing, transaction lifecycle, and readback therefore remain verified only by mocked-provider tests where applicable; a genuine wallet browser run is still required.
3. Both `static-and-unit` GitHub Actions runs passed on source release commit `8084d4f045309abd09244477a5e045b9676dd5ca`; a fresh run checks the documentation freeze commit. The separate Vercel status check fails because it targets an unavailable legacy project. PR #1 records the exact comparison for its current head.

Until those items are complete, the conclusion remains **NOT READY FOR SUBMISSION**.
