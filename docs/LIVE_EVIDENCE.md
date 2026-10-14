# Studionet evidence

## Current deployment

- Network: GenLayer Studionet, chain ID `61999` (`0xF22F`)
- RPC: `https://studio.genlayer.com/api`
- Contract: `0xe20273aDaaDb19B6BE34Fa5C6CfDe3B59719d4C0`
- Deployment transaction: `0x77786b21af2621d46f7253ce481948994ca513cafcc1631391be9357c5b59608`
- Receipt: `FINALIZED`, `MAJORITY_AGREE`; deployment execution result `SUCCESS`
- Source SHA-256: `4594532457829e48fd57bd89a7adfaf7bfa20cb3f1f478d411606af33f84de77`
- Source parity: `gen_getContractCode` returned 26,421 bytes, exactly matching `contracts/Pride.py` byte-for-byte.
- `get_config` reports PRIDE v0.3.0, money disabled, wallet-based publisher identity, and repository ownership unproven.

## Live test lifecycle

The following non-financial demonstration used public commit-pinned fixtures from `BeatyXO/pride` and funded throwaway test wallets. It proves these particular Studionet calls and resulting state, not production publisher identity or domain ownership.

- Publisher registration: `0xe77a991cb82468f8a6165ef120bff4e469dac097b1e2186a7b88245a1ca1342c` — `FINALIZED`, `MAJORITY_AGREE`, `SUCCESS`; `get_publishers` returns active publisher ID 0, wallet `0xD6423aE82a975d55C6CeaC222827A727325e0459`, label `PRIDE Live Publisher`, asserted scope `BeatyXO/pride`.
- Commitment registration: `0x367212bcc094cd0aca8adcc93c1f0e26beec10d618febb96fb4b73d3c738fb79` — `FINALIZED`, `MAJORITY_AGREE`, `SUCCESS`; `get_charters` returns charter ID 0, version 1, baseline terms `Community allocation remains 30%.`, digest `2ba9dacb3032f97ca330ab7fc2954dda23ac613135bb98bf4f6bdcea45955701`.
- Baseline verification: independent `get_checks(0)` readback returned checkpoint 0 as `MATCHES`, quote `Community allocation remains 30%.`, with the same digest. Its transaction hash was not recovered in this run and is omitted.
- Changed source verification: `0xc283c280e56367726a9774d76b02ab3dc6d9d91ece0f05bc538fbc8be5b98241` — `FINALIZED`, `MAJORITY_AGREE`; readback checkpoint 1 is `MATERIAL_CHANGE`, quote `Community allocation is now 15%.`, digest `f06bb2b09923a2a86b59cb212983a3faa29a2ac5849bc27c8aef1b00f5a2b309`, `measurements_changed: true`.
- Challenge opened by a separate wallet: `0xf81fc986c4a579ab524936efac0fc7befca0fd8e08ea5155f295ae09dfa7c8b3` — `FINALIZED`, `MAJORITY_AGREE`; evidence digest and exact quote match checkpoint 1.
- Issuer rebuttal: `0xf2b05daec31777a822bd3f79d1bd69f1b7f37dc201f0f2dffb81bc6ff671efc8` — `FINALIZED`, `MAJORITY_AGREE`; state records the rebuttal fixture digest `bc270a060bdaf97f9112946d24a46296f39d2308a572adc9891aa8556509e501` and its exact quote.
- Independent resolution: `0x71007e4146f0d67f5f65e69732a875bab0904dde3a5d6f341da0b484123127cc` — `FINALIZED`, `MAJORITY_AGREE`; `get_challenges(0)` returns terminal status `INCONCLUSIVE`.
- Authorized amendment proposal: `0x8616436a74fef0b958eee2dc2f246eeeead786a822c74c5e9e94e52746d2e27a` — `FINALIZED`, `MAJORITY_AGREE`; amendment ID 0 links version 1 digest to version 2 digest and records the separate disclosure digest.
- Amendment activation: `0x3a9f27b562e6de39cacc1ec627dee5d4995f9ffe3b352bdfbaa6d8bb63dad244` — `FINALIZED`, `MAJORITY_AGREE`; `get_charters` returns version 2 and the original version 1 check history remains unchanged.
- Unauthorized source check: `0xf336c8538bd166990f7b9e646e71452aaab1979e7ecb3dcb7c8bea2f90aa5079` — `FINALIZED`, `MAJORITY_AGREE` execution of the rejection path; transaction return data is `NOT_OWNER`. Independent `get_checks(0)` still returns only the two owner-created checkpoints.

Direct Mode exercises contract paths using controlled mocked source/model responses; it is not live network evidence. Node wallet tests use a controlled EIP-1193 provider. Browser automation with a real Studionet wallet was not run. The RPC readback tool independently queried state, but no third-party explorer indexing check was performed for each transaction.
