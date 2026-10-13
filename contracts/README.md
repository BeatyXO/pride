# PRIDE Intelligent Contract candidate

`Pride.py` is an intentionally asset-free standalone GenLayer contract prototype, not a deployed release.

## Calls

- `register(title, source_url, promise)` — owner-signed voluntary charter
- `check_source(charter_id)` — independently fetched webpage/text evidence plus narrow three-way AI classification
- `deactivate(charter_id)` — prevents subsequent checks; historical evidence remains inspectable
- `get_charters()` / `get_checks(id)` / `get_config()` — public reads

All publicly documented outcomes are provisional observations of a given source, not enforceable penalty judgments.

## Audit flags before deployment

- Runner pin and `@gl.storage.allow` need verification against current Studio.
- Source URL policy is a lightweight filter; production requires explicit allowlisted host/path and egress restrictions, redirect validation and source authentication.
- `get` only supports accessible text; dynamic pages, non-200 statuses, big pages, content drift, missing expected obligation and model hallucinations require bounded tests and fail-closed responses.
- Consensus compares the **entire source text + status + decision** exactly. Dynamic pages may not settle. Prefer immutable text artifacts or content-addressed checkpoints.
- The 3-category AI judgement is conservative but not independently audited for prompt injection, paraphrase, model drift or hostile content.
- `deactivate()` is not a substitute for a binding commitment; it is a voluntary public record. Production must not let an issuer escape an outstanding claim by deactivation.
- No ownership verification of website/domain; registered owners only control the charter entry.
- No events, transaction logs, chain deployments, live testing, fees, escrow or frontend RPC integration yet.
- The existing static tests assert code shape only. They do not execute GenVM.

Codex should harden rather than blindly trust this candidate. The final contract must be tested against the actual GenLayer version and documented with authentic chain evidence.
