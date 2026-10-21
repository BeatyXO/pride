# PRIDE V1 milestone comparison

## Comparison points

- Baseline commit: `1537599fa4bb68df6d1fbb07b47c028c4eff31bc` (tree `1f771f2de05fd0fbeb63e95b864116ab59275bef`).
- User-selected milestone start: `f5f17ec1aedeb9542ba8cf6e0ee6b843abad1b88` on `milestone/pride-v1-adjudication`.
- Baseline Pride SHA-256: `4594532457829e48fd57bd89a7adfaf7bfa20cb3f1f478d411606af33f84de77`.
- Current Pride SHA-256: `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504`.
- Corrected Gate SHA-256: `08686bfdaf4fd79b938c280c8577b1b119cb35316fd74d14ac9fce1145d6a05a`.
- Release tree `02b7ac592e5cbf7649e1d99af7707086253afc9b` passed both GitHub Actions checks and was merged to `main` by merge commit `856c1907062cce8fc92df08f90791bd189f5fdcc`. The baseline-to-merged-main comparison is [available on GitHub](https://github.com/BeatyXO/pride/compare/1537599fa4bb68df6d1fbb07b47c028c4eff31bc...856c1907062cce8fc92df08f90791bd189f5fdcc).

The baseline contains the earlier Pride implementation and no Reliance Gate. V1 adds bounded commit-pinned source capture, canonical publisher and charter state, append-only amendment history, frozen evidence capsules, rebuttal/adjudication/expiry controls, canonical standing, and an operator-bound consumer Gate. The Gate's original `LATEST_FINAL` state selector caused repeated live leader timeouts. Replacing it with GenLayer's documented current-block `view()` call now yields finalized decisions.

## Capability delta

| Capability | Baseline | Verified V1 result |
| --- | --- | --- |
| Publisher and source capture | Initial publisher-scoped checks | Wallet-bound publisher registration; repository-scoped immutable raw GitHub source snapshots with normalized content digests and independent observations |
| Versioning | Limited amendment records | Append-only charter versions with disclosure and source checks before activation |
| Challenge lifecycle | No verified live consensus case matrix | Evidence-backed live cases finalized as `UPHELD`, `REJECTED`, and `INCONCLUSIVE`; terminal case and standing readbacks recorded |
| Canonical standing | Absent | `get_standing` and fail-closed `get_reliance_status` views read independently after each adjudication |
| Consumer authorization | No separate Gate | Corrected source executes live IC-to-IC reads; finalized `REJECTED` and `PERMITTED` Gate decisions match Pride readbacks |
| Browser integration | Local browser showcase | Existing production alias `https://pride-eta.vercel.app` now serves a public manifest with V1 Pride/Gate addresses, source parity, and writes enabled. Production page/history interactions and injected-wallet transaction flows still require end-to-end verification on this alias. |
| Deployment evidence | Historical prototype deployment | Pride and corrected Gate deployments are source-byte matched against Studionet; old failed Gate deployment is kept as historical evidence. |

## Live network evidence

- Studionet chain ID `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`.
- Pride: `0x1A232b6eb69484B29f9Fc9A0Fa06c927083726e9`, deployment transaction `0x431f90c4dfa57aadbe38480df2fbfcdafffbe7777596391d1fac8ad225520302`, source SHA-256 `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504`.
- Corrected release Gate: `0x7eF1f14639e1F6DA28E4912Ec7D0C50DA0f8fB9a`, deployment transaction `0x9ccb5596afdd2460eb63cceae80895804d26b60059151f92557eec259c3a7e7a`, source SHA-256 `08686bfdaf4fd79b938c280c8577b1b119cb35316fd74d14ac9fce1145d6a05a`.
- Gate `REJECTED`: transaction `0x5b48ded23660fc2537cc059e254653d8c133201f50d397511bac43c1751d2402`; Gate readback reason `DISQUALIFYING_CASE` agrees with Pride's `eligible:false`, standing `MATERIAL_DEVIATION_ESTABLISHED`, and blocking `UPHELD` case.
- Gate `PERMITTED`: transaction `0x2a2730d2f1dfd1f1a6e408eda9ad93f2bd52a44811891e5016b1c110cf17242e` on a second instance of the same byte-matched Gate source; reason `POLICY_SATISFIED` agrees with Pride's `eligible:true`, `QUALIFYING_FINALIZED_MATCH`, and the same checkpoint ID/digest.
- Three earlier Gate calls through the state-selector version finalized `NO_MAJORITY` with `LEADER_EXEC_TIMEOUT`; decision reads were empty. The corrected cross-contract call succeeded on both adverse and eligible Pride states. Details and schemas are in `docs/live-gate-decisions-v1.json`.
- Pride case evidence: `UPHELD` is in `docs/live-lifecycle-case-v1.json`; `REJECTED` is in `docs/live-lifecycle-case-v2-rejected.json`; `INCONCLUSIVE` is in `docs/live-lifecycle-case-v3-inconclusive.json`.

## Build, browser, and CI disposition

- Local suite and final build results are maintained in `docs/TEST_MATRIX_V1.md` and `docs/LIVE_EVIDENCE.md` after the source and manifest freeze.
- `vercel.json` configures `npm run build` with output directory `public`; the production-mode local build passed on 2026-10-21. After merge, the public manifest at https://pride-eta.vercel.app/assets/deployment.json reported the verified Studionet addresses and matching source hashes. This confirms deployment configuration only; page rendering, history controls, wallet/network/account behavior, signing, finalized transaction state, and state readback remain to be checked on this existing production alias. EIP-1193 behavior currently has mocked-provider test coverage.
- Both `static-and-unit` GitHub Actions runs passed on release tree `02b7ac592e5cbf7649e1d99af7707086253afc9b`, which is now merged into `main`. They ran `npm ci`, build, JavaScript tests, Python tests, source syntax checks, manifest verification, Python compilation, both linters, and Direct Mode. A separate Vercel status context still points to the unavailable legacy `beatycat/pride` integration; it is distinct from the verified public production manifest.

## Disposition

The live Studionet contract and adjudication capabilities are verified, the release is merged, the comparison and artifact inventory are frozen, and the existing production alias reports the V1 manifest. The only remaining release gate is end-to-end verification of the production frontend, including history controls and genuine injected-wallet connect, network/account changes, transaction finality, and state readback. No such browser-wallet result is claimed yet.
