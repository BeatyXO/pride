# Local Studionet signing handoff

The release automation must stop before signing or broadcasting. The test wallets supplied in the local wallet file are not installed in the GenLayer CLI account store; the CLI currently selects `coverageSealThrowaway`, which must not be used for this release.

1. Import the intended funded test accounts into the GenLayer CLI's encrypted local account store using a secure local workflow. Keep private keys out of shell history, chat, logs, and this repository. Assign clear local names for the Pride publisher, independent challenger, Gate operator, and unauthorized caller roles.
2. Confirm `genlayer --version` reports `0.39.1`, then select the intended publisher account with `genlayer account use <publisher-account>`.
3. In the local terminal, run `genlayer deploy --contract contracts/Pride.py --rpc https://studio.genlayer.com/api`. Review the CLI's account and contract details, then complete the signing prompt yourself. Return the deployment transaction hash and CLI-reported address for receipt verification before continuing.
4. After Pride's deployment is finalized and its source and state are verified, register the publisher and first charter. The Gate binds to a Pride address, charter ID, and expected version; deploy it with the verified Pride address and the live charter ID/version using `genlayer deploy --contract contracts/pride_reliance_gate.py --rpc https://studio.genlayer.com/api --args <pride-address> <charter-id> <expected-version>` from the designated Gate operator account. Complete the signing prompt yourself and return the transaction hash and address.
5. Before each lifecycle write, use the intended role account and review the arguments in the terminal. Send each transaction hash back for finalized-receipt, execution, contract-state, and independent readback verification before proceeding.

Useful read-only CLI checks after each deployment are `genlayer receipt <transaction-hash> --rpc https://studio.genlayer.com/api`, `genlayer code <contract-address> --rpc https://studio.genlayer.com/api`, and `genlayer call <contract-address> get_config --rpc https://studio.genlayer.com/api`. These do not replace byte-for-byte source comparison or independent state readback.

No V1 transaction has been broadcast or is represented as verified in the current evidence record.
