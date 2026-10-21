# PRIDE V1 milestone comparison

## Comparison points

- Baseline commit: `1537599fa4bb68df6d1fbb07b47c028c4eff31bc` (tree `1f771f2de05fd0fbeb63e95b864116ab59275bef`).
- User-selected milestone start: `f5f17ec1aedeb9542ba8cf6e0ee6b843abad1b88` on `milestone/pride-v1-adjudication`.
- Baseline Pride SHA-256: `4594532457829e48fd57bd89a7adfaf7bfa20cb3f1f478d411606af33f84de77`.
- Current Pride SHA-256: `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504`.
- Corrected Gate SHA-256: `08686bfdaf4fd79b938c280c8577b1b119cb35316fd74d14ac9fce1145d6a05a`.
- Source release commit `8084d4f045309abd09244477a5e045b9676dd5ca` passed GitHub Actions. The current exact PR head and baseline SHA-to-SHA compare URL are recorded in PR #1 after the documentation freeze update.

The baseline contains the earlier Pride implementation and no Reliance Gate. V1 adds bounded commit-pinned source capture, canonical publisher and charter state, append-only amendment history, frozen evidence capsules, rebuttal/adjudication/expiry controls, canonical standing, and an operator-bound consumer Gate. The Gate's original `LATEST_FINAL` state selector caused repeated live leader timeouts. Replacing it with GenLayer's documented current-block `view()` call now yields finalized decisions.

## Capability delta

| Capability | Baseline | Verified V1 result |
| --- | --- | --- |
| Publisher and source capture | Initial publisher-scoped checks | Wallet-bound publisher registration; repository-scoped immutable raw GitHub source snapshots with normalized content digests and independent observations |
| Versioning | Limited amendment records | Append-only charter versions with disclosure and source checks before activation |
| Challenge lifecycle | No verified live consensus case matrix | Evidence-backed live cases finalized as `UPHELD`, `REJECTED`, and `INCONCLUSIVE`; terminal case and standing readbacks recorded |
| Canonical standing | Absent | `get_standing` and fail-closed `get_reliance_status` views read independently after each adjudication |
| Consumer authorization | No separate Gate | Corrected source executes live IC-to-IC reads; finalized `REJECTED` and `PERMITTED` Gate decisions match Pride readbacks |
| Browser integration | Local browser showcase | Public Vercel frontend displays live Studionet records and the `UPHELD`, `REJECTED`, and `INCONCLUSIVE` case-history disclosures. Wallet interaction remains covered by mocked EIP-1193 tests; a real injected wallet was unavailable in the browser session used for production verification. |
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
- `vercel.json` configures `npm run build` with output directory `public`; the production-mode local build passed on 2026-10-21. Production is live at https://pride-coral.vercel.app (deployment `dpl_EN4YK8tc3TqLFpGNHJAr9zHi22Zk`, `READY`). HTTP manifest readback identifies the verified Studionet addresses and source hashes. The production browser rendered all three records and opened public evidence/case history for all three charters. The browser session had no injected EIP-1193 provider, so actual browser signing, wallet account/network transitions, and transaction readback remain unverified there; these flows are separately covered by mocked-provider tests.
- Both `static-and-unit` GitHub Actions runs passed on source release commit `8084d4f045309abd09244477a5e045b9676dd5ca`. They ran `npm ci`, build, JavaScript tests, Python tests, source syntax checks, manifest verification, Python compilation, both linters, and Direct Mode. The separate Vercel status check failed because it still targets the unavailable `beatycat/pride` integration; the manually deployed `ifem1s-projects/pride` production deployment is READY at the URL above. The final documentation freeze commit is followed by a fresh Actions check.

## Disposition

The live Studionet contract and adjudication capabilities listed above and the read-only production frontend are verified. The milestone remains **not ready for submission** until genuine injected-wallet browser flows are independently verified and the final comparison and artifact inventory are frozen.
