# Security and trust model

## Current status
Browser demo is functional and testable. GenLayer adapter is source-level only. There is **no live custody** and no live penalty mechanism.

## Trust assumptions and attacks

| Threat | Current defense | Required future defense |
|---|---|---|
| User lies about source text | Clearly labeled as local, unverified | Validators independently fetch allowlisted approved evidence |
| Issuer registers someone else's site | Explicitly not verified | Prove domain/repository ownership, scoped signatures |
| Source edited between validator reads | Candidate compares text exactly; unsettled reads commit nothing | Immutable content hashes, canonical snapshots, retrieval windows |
| External source blocks or rate-limits validators | Candidate returns unavailable, does not persist adverse claim | Bounded retries with evidence-completeness checks |
| LLM prompt injection from source text | Source marked untrusted; independent classification | Additional independent validator and adversarial fixture testing |
| LLM unanimous but incorrect classification | Narrow vocabulary; no slashing | Appeals, conservative acceptance rubric, human-readable support |
| Fake source redirect / SSRF | Basic HTTPS/hostname check in UI and candidate | Hard allowlist; disable or validate redirects at fetch layer |
| Browser HTML injection | All untrusted displayed strings encoded with escapeHTML | Content Security Policy, fuzz tests, DOM review |
| Local data tampering | Backup schema validation | Signed chain event records and source hash verification |
| Money trapped by pause/owner | No payable methods | Zero-lock funds invariant, safe pull claims and pause limitations |
| Infinite validation or expensive model calls | Candidate bounds source to 8KB, promise to 1600 | Authenticated rate limits, fees, budgets, hard size limits |

## Work required before contract settlement features
No deposits, bond slashing, transfer or escrow should be enabled without a tested deterministic ledger, owner withdrawal checks, claim-payout isolation, missed-deadline behavior, materiality criteria agreed before commitment, finality timing, cross-contract read security and real on-chain validation. Tests need to demonstrate that all balances drain after a completed round and that ambiguous evidence never penalizes an issuer.

## Known implementation limitations
- User-facing checks do not contact source URLs; they are illustrative manual checkpoints.
- `localStorage` is mutable and may be deleted; local evidence hashes are not anchored.
- Numeric token comparison can produce false positives and misses semantic changes with no numbers; these are explicitly marked for review.
- Demo data contains fictional projects and example.org links.
- `contracts/Pride.py` is unverified against any live GenVM deployment; it may require SDK pin, storage, ABI, and runtime fixes.
- Browser visual regression testing could not run in the creation environment; unit and static checks do pass locally.

## No production claims
PRIDE presently makes no certification, financial, investment, legal or on-chain truth claim. Claims about real projects require independent evidence and appropriate appeal mechanisms.
