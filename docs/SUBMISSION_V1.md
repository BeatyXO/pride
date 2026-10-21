# PRIDE V1 submission status

Status: **NOT READY FOR SUBMISSION** while genuine browser-wallet verification and final-head CI remain outstanding.

The live Studionet portion is now verified. Pride and corrected Gate source parity were independently checked from deployed source. Gate `REJECTED` and `PERMITTED` transactions finalized successfully and their decision records match independent Pride readbacks. Live Pride cases now cover `UPHELD`, `REJECTED`, and `INCONCLUSIVE`; detailed receipts and final state are in the three case JSON files and `docs/live-gate-decisions-v1.json`.

Production is live at https://pride-coral.vercel.app. The production page served live Studionet records and opened the evidence/history views for `UPHELD`, `REJECTED`, and `INCONCLUSIVE`. The browser environment had no injected wallet; the actual wallet connect, account/network changes, signing, transaction lifecycle, and resulting readback still need a genuine browser session. Final-head CI, exact compare URL, and a refreshed inventory remain to be recorded after the release commit. See `docs/REVIEWER_V1.md` for current blockers.
