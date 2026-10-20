# Local Studionet execution status

No private keys or keystore passwords belong in this repository, shell history, logs, or chat. The funded throwaway key explicitly supplied by the user matched the existing active address `0xD6423aE82a975d55C6CeaC222827A727325e0459`. It was imported through the CLI's masked prompt as `pride-v1-throwaway`, encrypted in the GenLayer CLI keystore, and unlocked in the OS keychain for this authorized release run.

The Pride and corrected Gate deployments are finalized and verified; details and transaction hashes are in `docs/LIVE_EVIDENCE.md`. Publisher registration, charter registration, source matching, material-change detection, and authorized amendment activation are also read back from Studionet.

The Gate authorization transaction `0x18f6b6c686cc3103e133edf2935dc7777ad837d3631882c5e570fc3ab3f8008b` remains in `PROPOSING` with `NO_MAJORITY` and no leader assigned. Do not resubmit this action while its status is pending.

The evidence challenge and unauthorized-action checks require a signer distinct from the charter owner. The local test-wallet file contains funded candidates, but auto-review rejected passing a second key as a process argument. A request is pending to use the safer masked CLI import flow, or the user can unlock an already-installed challenger account locally. No second signer key has been imported or used in this task. Continue only after that signer is safely available.
