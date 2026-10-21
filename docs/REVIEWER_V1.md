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

## Remaining production frontend checks

The release source tree `02b7ac592e5cbf7649e1d99af7707086253afc9b` passed both `static-and-unit` GitHub Actions checks and was merged to `main` at `856c1907062cce8fc92df08f90791bd189f5fdcc`. The existing production alias is https://pride-eta.vercel.app; its public manifest now reports the V1 Studionet deployments, matching source hashes, and enabled writes. The separate GitHub Vercel status context references an unavailable legacy integration; it does not reflect the verified production alias manifest.

The remaining work is frontend verification on that production alias: confirm page rendering and challenge-history controls; connect/disconnect an injected EIP-1193 wallet; test wrong-network blocking and account changes; submit an authorized wallet transaction; and verify transaction finality plus independent contract state readback. Existing mocked-provider tests do not count as real wallet execution. These checks have not yet been completed.
