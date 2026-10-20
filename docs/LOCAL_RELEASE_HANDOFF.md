# Local Studionet execution status

No private keys or keystore passwords belong in this repository, shell history, logs, or chat. The funded throwaway key explicitly supplied by the user matched the existing active address `0xD6423aE82a975d55C6CeaC222827A727325e0459`. It was imported through the CLI's masked prompt as `pride-v1-throwaway`, encrypted in the GenLayer CLI keystore, and unlocked in the OS keychain for this authorized release run.

The Pride and corrected Gate deployments are finalized and verified; details and transaction hashes are in `docs/LIVE_EVIDENCE.md`. Publisher registration, charter registration, source matching, material-change detection, and authorized amendment activation are also read back from Studionet.

Gate authorization transaction `0x18f6b6c686cc3103e133edf2935dc7777ad837d3631882c5e570fc3ab3f8008b` and follow-up `0xc77886ed49493510fb2f023bd9fb8f210bf41a23164bc7ab117a8f5d2efc9006` both finalized without majority after leader timeouts; independent readback shows no Gate decisions. Do not report a Gate authorization decision from these attempts.

The user authorized the supplied throwaway test wallet. It was entered only into the GenLayer CLI masked prompt and encrypted locally; the derived challenger address `0x77e2EdBb43277bf772e207C517dde731935ffbA5` was used for the finalized challenge and unauthorized rebuttal attempt. The issuer wallet submitted the rebuttal and adjudication. The test keys were not written to this repository or passed as command arguments. Because private keys were posted in chat, retire these throwaway keys and move any remaining funds after the release run.
