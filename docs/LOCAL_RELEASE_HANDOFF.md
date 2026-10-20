# Local release status

Pride and Reliance Gate V1 contracts have been deployed to Studionet and their deployed source bytes match the current local files. The Pride lifecycle completed through an evidence-backed challenge, issuer rebuttal, and `UPHELD` adjudication. See [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md) and [`live-lifecycle-case-v1.json`](live-lifecycle-case-v1.json).

The authorized Gate call finalized `NO_MAJORITY` after a 600-second leader execution timeout. Independent state readback shows no decisions. The frontend therefore disables Gate writes; do not represent Gate authorization as verified.

The static local real-network frontend read the amended v2 Pride commitment, adverse standing, and Gate configuration from Studionet. Its mocked EIP-1193 test coverage is not wallet signing. Local normal and production-mode builds pass; a public Vercel deployment has not been verified.

The user authorized use of throwaway test accounts for the release run. Secret material is intentionally excluded from repository files and this status note. Because account secrets were shared in chat, retire those test credentials and move any remaining test funds after the release run.
