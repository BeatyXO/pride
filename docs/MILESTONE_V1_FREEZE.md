# PRIDE V1 source freeze and release evidence

## Source checkpoints

The milestone began at commit `f5f17ec1aedeb9542ba8cf6e0ee6b843abad1b88`, tree `d2f7cab4651daabe00a19a519046498f87bd9fb7`. Pride source remains unchanged from that reviewed checkpoint. The Gate source was corrected to call the Pride view through the documented synchronous API and redeployed after three live 600-second timeouts. The final repository HEAD, tree, source hashes, and baseline comparison URL are recorded here after final CI and deployment checks complete.

| File | Final SHA-256 | Studionet deployment | Exact deployed source parity |
| --- | --- | --- | --- |
| `contracts/Pride.py` | `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504` | `0x1A232b6eb69484B29f9Fc9A0Fa06c927083726e9` | Verified by `gen_getContractCode` |
| `contracts/pride_reliance_gate.py` | `08686bfdaf4fd79b938c280c8577b1b119cb35316fd74d14ac9fce1145d6a05a` | `0x7eF1f14639e1F6DA28E4912Ec7D0C50DA0f8fB9a` | Exact byte match via `gen_getContractCode` |

Network: GenLayer Studionet, chain `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`. The release Gate deploy transaction is `0x9ccb5596afdd2460eb63cceae80895804d26b60059151f92557eec259c3a7e7a`. A second instance at `0xa48F2775CD457Fa2F7b4bf31d81C635367726F65` (deploy transaction `0xed89fc1203310685c8a252c5f215dfb8f74ca3ab12c0771bf7c272e2b6ef07ac`) verifies the `PERMITTED` policy branch; both Gate sources byte-match the same local file.

## Finality and evidence references

- Pride deployment: `0x431f90c4dfa57aadbe38480df2fbfcdafffbe7777596391d1fac8ad225520302`.
- Gate `REJECTED`: `0x5b48ded23660fc2537cc059e254653d8c133201f50d397511bac43c1751d2402`; matching independent Pride status is in `docs/live-gate-decisions-v1.json`.
- Gate `PERMITTED`: `0x2a2730d2f1dfd1f1a6e408eda9ad93f2bd52a44811891e5016b1c110cf17242e`.
- Pride adjudications: `UPHELD` at `docs/live-lifecycle-case-v1.json`, `REJECTED` at `docs/live-lifecycle-case-v2-rejected.json`, and `INCONCLUSIVE` at `docs/live-lifecycle-case-v3-inconclusive.json`.
- Full test and production build results: `docs/TEST_MATRIX_V1.md` and `docs/LIVE_EVIDENCE.md`.
- Artifact inventory: `artifacts/milestone-v1-inventory.json`.

## Remaining release gates

Production is live at https://pride-coral.vercel.app (deployment `dpl_EN4YK8tc3TqLFpGNHJAr9zHi22Zk`, `READY`). The public deployment manifest was fetched and the live records and case-history disclosures were checked. The current browser session did not expose an injected wallet. Genuine browser wallet flows and final-head green CI are outstanding, so the release remains **NOT READY FOR SUBMISSION**. Final HEAD/tree and compare URL are to be recorded after pushing the release commit.
