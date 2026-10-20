# PRIDE V1 milestone architecture

## User flows

The local showcase is fictional browser-local content. The real-network page reads finalized registry records and uses an injected EIP-1193 provider for writes. It includes publisher registration/revocation, commitment registration, issuer source checks, permissionless observations, amendments, evidence challenges, rebuttals, adjudication, expiry, history, transaction status, and state readback. All writes require Studionet chain ID `61999` and final success requires both successful execution and relevant finalized state.

## Contract state model

`Pride` stores publishers, commitments, bounded source checkpoints, amendment proposals, immutable commitment versions, and challenge capsules. Capacity constants bound publishers, records, per-publisher/per-record actions, checkpoints, cases, amendments, and page sizes. `get_checks`, `get_charters`, `get_publishers`, `get_amendments`, `get_challenges`, and `get_versions` expose bounded pages.

Observation is open to any wallet but source URLs must remain in the publisher's declared, commit-pinned GitHub repository scope. Each checkpoint freezes source URL, full bounded canonical text, digest, observer, source role, version, outcome, exact citation, and chain-derived transaction time. This is permissionless observation of the publisher-declared evidence scope; it does not establish an independent authority or domain identity.

## Evidence capsule and state machine

Opening a challenge freezes charter/version, issuer/challenger, original terms and baseline digest, checkpoint identity and outcome, challenge/rebuttal source URLs and digests, source roles, exact excerpts, policy, timestamps, expiry, and a deterministic case ID. Only one case may reference a checkpoint. A challenge source outside the declared repository is labeled `UNVERIFIED_THIRD_PARTY`; it may provide context but cannot alone support `UPHELD`.

```text
OPEN ── issuer rebuttal ──> REBUTTED
  │                            │
  ├── consensus adjudication ──┴──> UPHELD | REJECTED | INCONCLUSIVE
  └── expiry after 30 days ─────────> EXPIRED (INCONCLUSIVE standing)
```

The issuer has a one-hour rebuttal window before an unrebutted case may be adjudicated. A submitted rebuttal makes the case immediately eligible for adjudication. Terminal outcomes cannot be changed. Open cases prevent amendment activation, so amendments cannot evade a pending case. Adjudication re-fetches and re-hashes all frozen inputs, uses a structured semantic decision, requires exact stored checkpoint evidence, and compares every decision-critical field and digest across validators. Failed or changed evidence yields `INCONCLUSIVE`.

## Reliance Gate

`PrideRelianceGate` is a separate, non-custodial contract bound at construction to a PRIDE address, charter ID, and expected version. Only its operator may request an action decision. It performs a typed cross-contract `get_reliance_status` view at `LATEST_FINAL` and permits only an active commitment with the expected version, a current-version `MATCHES` checkpoint, source and captured-content integrity, publisher-repository scope, and no open, rebutted, upheld, inconclusive, or expired case. Missing evidence fails closed. `get_standing` remains a distinct adjudication view; `OBSERVED` alone never grants eligibility. The local simulator integration executes the actual Pride contract view, but does not establish Studionet compatibility.

Permissionless observations are independent wallet actions within the issuer's self-asserted repository scope. They improve reproducibility and expose disagreements, but do not create an independent authority registry or prove repository ownership. Third-party evidence remains labeled unverified and cannot alone support an upheld finding. A `MATCHES` checkpoint may be challenged when it has a verified exact citation, allowing adjudication of a cited false match; a match without a citation cannot be admitted as a challenge case.

The issuer can rebut only strictly before `opened_at + 3600` seconds. The opening timestamp and 30-day expiry are fixed by the challenge transaction and cannot be extended by the issuer. At the one-hour deadline the case is eligible for adjudication, not rebuttal.

## UI trust labels

UI separates local showcase data from chain records. It labels asserted publisher scope, source role, finalized state, observer, evidence digest, case outcome, and transaction state. It does not present local samples as consensus evidence or model outcomes as legal conclusions. The original colored PRIDE mark, hero color treatment, and project illustrations remain; small card symbols were removed by product request.
