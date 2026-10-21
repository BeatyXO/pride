# Local release status

Pride and Reliance Gate V1 contracts have been deployed to Studionet and their deployed source bytes match the current local files. The Pride lifecycle completed through an evidence-backed challenge, issuer rebuttal, and `UPHELD` adjudication. See [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md) and [`live-lifecycle-case-v1.json`](live-lifecycle-case-v1.json).

Historical failed Gate attempts using the old `LATEST_FINAL` selector finalized `NO_MAJORITY` after 600-second leader execution timeouts. This was corrected and the new source was redeployed. Live finalized Gate `REJECTED` and `PERMITTED` decisions with independent Pride readbacks are documented in `LIVE_EVIDENCE.md` and `live-gate-decisions-v1.json`.

The existing production site is https://pride-eta.vercel.app. Its public manifest was fetched after merge and reports current V1 addresses, source parity, and enabled writes. The page, history controls, and injected-wallet transaction flows on this alias remain to be verified. Current release status is maintained in `SUBMISSION_V1.md`, `REVIEWER_V1.md`, and `TEST_MATRIX_V1.md`.

The user authorized use of throwaway test accounts for the release run. Secret material is intentionally excluded from repository files and this status note. Because account secrets were shared in chat, retire those test credentials and move any remaining test funds after the release run.
