# PRIDE product specification

## One sentence
PRIDE makes voluntarily published promises easier to record, independently verify, compare and challenge.

## Originality boundary
The unit of analysis is a **public commitment with evolving disclosure**, not wallet reputation, airdrop rights, arbitrary task settlement, or Sybil appeals. The evidence sources are issuer-authorized public statements, not wallet transaction histories. The future registry is an interoperable record of disclosures. Do not transfer FairDrop's screens, labels, contract logic, or financial mechanics into this repository.

## Core use case
A project publishes: “Community receives 30%; team tokens vest after 12 months.” Later it publishes: “Community receives 15%; team tokens vest after 6 months.” PRIDE records the original baseline, retrieves the new source, detects both numeric changes, and asks whether the changes were explicitly disclosed in advance. A material, undisclosed change may become a provisional finding; it can never be automatically described as fraud.

## Intentionally simple UI
1. **Record** a Promise Charter: title, issuer, category, HTTPS source, precise statement.
2. **Compare**: add new source content to the local view; later a contract retrieves it independently. Display what actually changed.
3. **Question**: submit an evidence-backed question; later a contract maintains a challenge window and validator outcomes.

Pages: overview / registry / register / passport / compare / guide. The local showcase is implemented. Every screen labels its trust level.

## Visual direction
Bright gradient accents of deep violet, lavender, warm yellow and coral red on a cosmic plum background. Warm rounded UI, large expressive Comic Sans headings/body, generous readable card spacing, mobile design. Do not reuse FairDrop's style or layout.

## Product integrity requirements
- Show source, time, previous statement, current statement, and reason.
- A numeric change is a **review signal**, not proof of breach.
- Distinguish: unchanged, changed with disclosure claim, changed without disclosure claim, insufficient, genuinely challenged, independently verified.
- For financial penalties, only use explicit issuer opt-in and preauthorized objective conditions.
- Never label a user-pasted URL as authenticated web evidence.
- Never label a synthetic demo as a real deployed protocol.

## Scope boundaries
MVP: tokenomics disclosures and simple fees/governance policies. Later: release commitments, open-source licenses, published security guarantees. Avoid universal free-form legal judgments and claims about fraud.
