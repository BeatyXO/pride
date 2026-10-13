# PRIDE Intelligent Contract candidate

`Pride.py` is an intentionally asset-free standalone GenLayer contract prototype, not a deployed release. The direct-mode suite pins GenVM runner release `v0.2.12`; the contract's dependency hash is declared in its header.

## Calls

- `register(title, policy_type, source_url, promise)` — wallet-signed voluntary `TOKENOMICS` or `FEES` charter
- `check_source(charter_id)` — independently fetched source plus bounded four-way classification and an exact source excerpt
- `deactivate(charter_id)` — prevents subsequent checks; historical evidence remains inspectable
- `get_charters()` / `get_checks(id)` / `get_config()` — public reads

All publicly documented outcomes are provisional observations of a given source, not enforceable penalty judgments. `MATERIAL_CHANGE` is a review signal, not proof of breach or fraud. `INSUFFICIENT_EVIDENCE` and unavailable sources do not create checkpoints.

Successful checkpoints store the source URL, normalized text, SHA-256 digest, model outcome, and a short excerpt that must occur verbatim in the source text. Validators compare the full structured response. Storage uses the pinned SDK's `@allow_storage` decorator and web response `status` field.

## Audit flags before deployment

- Direct mode verifies the pinned dependency hash, `@allow_storage`, `DynArray`, `gl.nondet.web.get()` response shape, JSON model output, and `run_nondet_unsafe`. It does not prove live validator consensus or Studio compatibility.
- Source URL policy is a lightweight syntax filter; production requires explicit allowlisted host/path and egress restrictions, redirect validation, retrieval-window rules, and source authentication.
- `get` only supports accessible text; dynamic pages, non-200 statuses, big pages, content drift, CORS-cached sources, and model hallucinations still need adversarial Studio/network tests.
- Consensus compares the full normalized source text and structured result exactly. Dynamic pages may not settle. Prefer immutable text artifacts or content-addressed checkpoints.
- The AI judgement is conservative but not independently audited for prompt injection, paraphrase, model drift, or hostile content.
- `deactivate()` is not a substitute for a binding commitment; it is a voluntary public record. Production must not let an issuer escape an outstanding claim by deactivation.
- A wallet signature identifies the transaction sender, not their right to represent the publisher at the source URL. Domain or issuer authorization remains unimplemented; records must not be presented as issuer-verified.
- No bounded advance-disclosure window or authenticated amendment/counterevidence challenge lifecycle exists on chain. Challenges exist only in the local showcase.
- No events, transaction logs, chain deployments, fees, escrow or frontend RPC integration yet. The browser remains local-only.
- Direct-mode tests execute mocked GenVM behavior; they are not live multi-validator consensus tests.

Codex should harden rather than blindly trust this candidate. The final contract must be tested against the actual GenLayer version and documented with authentic chain evidence.
