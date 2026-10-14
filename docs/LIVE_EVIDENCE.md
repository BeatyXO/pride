# Studionet evidence

## Current deployment

- Network: GenLayer Studionet, chain ID `61999` (`0xF22F`)
- RPC: `https://studio.genlayer.com/api`
- Contract: `0xde82a7650E938D53df225fc25De61D3909Ce4393`
- Deployment transaction: `0x621ede8922db31a181ffe0f81569e962e70cf51025abdd758e3bc5d228a8974c`
- Receipt: `FINALIZED`, `MAJORITY_AGREE`; deployment execution result `SUCCESS`
- Source SHA-256: `b1f3a1df85ebebbc500bee3277826ca5e7e5491dad8b8766fd724ba5710f9083`
- Source parity: `gen_getContractCode` returned a base64 source string; decoding it yielded 25,216 bytes, exactly matching `contracts/Pride.py` byte-for-byte.
- Readbacks: `get_config` reported PRIDE v0.3.0 with money disabled and repository ownership unproven; `get_publishers` and `get_charters` both returned `[]` immediately after deployment.

The previous v0.2 prototype and its test transactions are not evidence for this contract.

## Lifecycle coverage status

Direct Mode tests exercise the lifecycle using mocked source and model responses. The current deployment has not yet been exercised through the public wallet flow for publisher registration, commitment registration, source checking, amendment, challenge, rebuttal, or resolution. Those live transactions must be added here only after finalized receipts and independent state readbacks are collected. The local Node wallet tests use a controlled injected provider; they are not browser automation with a real Studionet wallet.
