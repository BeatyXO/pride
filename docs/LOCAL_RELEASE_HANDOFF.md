# Local release status

Pride and Reliance Gate V1 contracts have been deployed to Studionet and their deployed source bytes match the current local files. The Pride lifecycle completed through an evidence-backed challenge, issuer rebuttal, and `UPHELD` adjudication. See [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md) and [`live-lifecycle-case-v1.json`](live-lifecycle-case-v1.json).

The authorized Gate call finalized `NO_MAJORITY` after a 600-second leader execution timeout. Independent state readback shows no decisions. The frontend therefore disables Gate writes; do not represent Gate authorization as verified.

Historical handoff note: this was accurate before the Vercel deployment was created. The current public production site is https://pride-coral.vercel.app; its public manifest and live case-history views have since been verified. The browser session used for that check did not expose an injected EIP-1193 wallet, so genuine browser signing and wallet readback remain unverified. Current release status is maintained in `docs/SUBMISSION_V1.md` and `docs/REVIEWER_V1.md`.

The user authorized use of throwaway test accounts for the release run. Secret material is intentionally excluded from repository files and this status note. Because account secrets were shared in chat, retire those test credentials and move any remaining test funds after the release run.
