# PRIDE V1 live evidence and release status

This document distinguishes finalized Studionet evidence from local tests and browser mocks. Every transaction listed here was submitted and its finalized receipt was retrieved; final application state was read independently from the contract.

## Network, deployed sources, and schema

- Network: GenLayer Studionet, chain `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`; CLI `0.39.1`; runner marker `v0.2.16`.
- Pride: `0x1A232b6eb69484B29f9Fc9A0Fa06c927083726e9`; deployment transaction `0x431f90c4dfa57aadbe38480df2fbfcdafffbe7777596391d1fac8ad225520302`; source SHA-256 `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504`.
- Corrected release Gate: `0x7eF1f14639e1F6DA28E4912Ec7D0C50DA0f8fB9a`; deployment transaction `0x9ccb5596afdd2460eb63cceae80895804d26b60059151f92557eec259c3a7e7a`; source SHA-256 `08686bfdaf4fd79b938c280c8577b1b119cb35316fd74d14ac9fce1145d6a05a`.
- Independent source retrieval used `gen_getContractCode`; Pride and Gate remote source bytes were compared with local files. Both corrected Gate instances byte-match the same local source.
- Fresh schemas expose Pride `get_reliance_status(charter_id:int) -> string` and Gate `authorize(action_id:string) -> any`, `get_config() -> string`, `get_decisions(offset:int,limit:int) -> string`. The typed IC interface matches the Pride view signature. Live calls below independently prove runtime interoperability.
- Release Gate config binds the Pride contract, charter `0`, expected version `2`, and operator `0xD6423aE82a975d55C6CeaC222827A727325e0459`.

## Gate timeout diagnosis and corrected decisions

Three transactions through the original `view(state=StorageType.LATEST_FINAL)` call finalized `NO_MAJORITY` with leader `LEADER_EXEC_TIMEOUT` at 600 seconds. Their decision readbacks remained empty. GenLayer's documented synchronous IC view syntax is `other.view().method()` and reads the target at the current block. Removing the nonstandard state selector produced live success on two Pride states; the one-line change and opposite state outcomes provide the on-chain A/B evidence. Detailed receipts, schemas, configs, readbacks, and old failure hashes are in `docs/live-gate-decisions-v1.json`.

- `REJECTED`: transaction `0x5b48ded23660fc2537cc059e254653d8c133201f50d397511bac43c1751d2402`, finalized `MAJORITY_AGREE`, leader `SUCCESS`. Gate readback records `permitted:false`, `DISQUALIFYING_CASE`, standing `MATERIAL_DEVIATION_ESTABLISHED`, checkpoint 2/version 2/digest `d12554e1…c0a0df`. Independent Pride read returned `eligible:false` with the same reason, standing, checkpoint digest, and blocking case `UPHELD`.
- `PERMITTED`: transaction `0x2a2730d2f1dfd1f1a6e408eda9ad93f2bd52a44811891e5016b1c110cf17242e` on byte-matched test Gate `0xa48F2775CD457Fa2F7b4bf31d81C635367726F65`, finalized `MAJORITY_AGREE`, leader `SUCCESS`. Gate readback records `permitted:true`, `POLICY_SATISFIED`, standing `NOT_ESTABLISHED`, checkpoint 3/version 1/digest `2ba9dacb…55701`. Independent Pride read returned `eligible:true`, `QUALIFYING_FINALIZED_MATCH`, and the same digest.

## Live Pride lifecycle

- Original lifecycle: `UPHELD` / `MATERIAL_DEVIATION`; case evidence and finalized transaction list are in `docs/live-lifecycle-case-v1.json`. Charter 0 version 2 has `MATERIAL_DEVIATION_ESTABLISHED` standing.
- Rejected challenge: `REJECTED` / `NO_MATERIAL_DEVIATION`; case ID `8af3d8f70287d9734749530b939bbc6e8471569dc2ea0fc17ce7026327ecfa68`; adjudication transaction `0x934c1d7138dbdcbb6e81ce2a412022d080c40df0517f00959f4cfbbee511fa3e`. Independent readback shows `NOT_ESTABLISHED` and qualifying checkpoint eligibility. Details: `docs/live-lifecycle-case-v2-rejected.json`.
- Inconclusive challenge: `INCONCLUSIVE` / `AMBIGUOUS_OR_CONFLICTING`; case ID `090b4325353e2b60a65bc4e7f253bab86ea453ce6cafd5b62a7f9128665001aa`; adjudication transaction `0x02be25703f9dbc1d14e5c6c7be8c34d2d59b693ce656a9488a7149222f6fdb43`. Independent readback shows `INCONCLUSIVE` standing and reliance blocked by the inconclusive case. The cited ambiguity fixture is pinned to commit `06fd2c1b42e4c53692cbf5a03f6b0bcb1a922cd3`. Details: `docs/live-lifecycle-case-v3-inconclusive.json`.

## Local checks and hosted frontend

The exact commands and outcomes for the latest source checks are summarized in `docs/TEST_MATRIX_V1.md`. The production-mode build emits the configured `public` directory. Production is live at https://pride-coral.vercel.app (deployment `dpl_EN4YK8tc3TqLFpGNHJAr9zHi22Zk`, `READY`); its public manifest identifies the deployed addresses and hashes. The page rendered all three live records, and history disclosures showed `UPHELD`, `REJECTED`, and `INCONCLUSIVE` with their finalized evidence. The browser session had no injected EIP-1193 provider, so real browser wallet transactions were not tested. Mocked EIP-1193 tests and live Studionet transactions are reported separately.

The final release remains **NOT READY FOR SUBMISSION** until a genuine injected-wallet browser run is complete. Both Actions runs passed on source release commit `8084d4f045309abd09244477a5e045b9676dd5ca`; final freeze commit CI is tracked in PR #1. The independent Vercel production deployment is READY, while its legacy GitHub status context remains failed.
