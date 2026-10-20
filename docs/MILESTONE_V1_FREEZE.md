# PRIDE V1 source freeze and release evidence

## Frozen source checkpoint

This freeze records the audited contract code at milestone commit `f5f17ec1aedeb9542ba8cf6e0ee6b843abad1b88`, tree `d2f7cab4651daabe00a19a519046498f87bd9fb7`. Follow-on changes in this audit update release documentation and evidence only; the two contract source files remain unchanged. This manifest freezes the contract source bytes, while the final repository HEAD and baseline-to-final comparison are reported on PR #1.

| File | SHA-256 | Deployed address | Manifest source parity |
| --- | --- | --- | --- |
| `contracts/Pride.py` | `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504` | `0x1A232b6eb69484B29f9Fc9A0Fa06c927083726e9` | true |
| `contracts/pride_reliance_gate.py` | `0465495b95c2afb9a833496f40becbea91daaf907e7c50af77ca50084a218c3f` | `0x5cEeD74e1465da8D962C1DAe98903F72089E0A18` | true |

Network: Studionet, chain `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`.

## Deployment evidence

- Pride deployment transaction: `0x431f90c4dfa57aadbe38480df2fbfcdafffbe7777596391d1fac8ad225520302`.
- Gate deployment transaction: `0x796c3b7972a66045b806470362032a7b9f182a0820be6372a934dc1132eaaa60`.
- The deployment manifest marks Pride parity true and Gate source parity true. The independent active-address/schema/config/source inspections are described in `docs/LIVE_EVIDENCE.md`.
- Gate live authorization is not verified: two finalized calls timed out at the leader, with no decision state change.

## Freeze limitations

This freeze is a source and evidence record, not a release approval. The complete live matrix, hosted frontend, injected-wallet browser checks, and fresh green CI are incomplete. Do not label this checkpoint READY FOR SUBMISSION.
