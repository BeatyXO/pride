# PRIDE ✦ — promises deserve proof

**Public Record Integrity & Disclosure Engine** — an original GenLayer-oriented product for tracking published commitments and their changes. Created October 13, 2026.

PRIDE is **not FairDrop**: it does not flag wallets, administer airdrop appeals, hide Sybil rules, or copy FairDrop code. PRIDE is a voluntary commitment registry with source checkpoints, semantic contradictions and eventually independent evidence verification.

## What is implemented

- Complete responsive, dependency-free website in purple/yellow/red gradients with Comic Sans styling
- Searchable registry, filters, dashboards, project passports, timelines
- Working register-promise and checkpoint forms
- Baseline-versus-checkpoint word diff and numeric/percentage/deadline detection
- Local challenges, closed-question controls, toast notifications, export/import, SHA-256 hashes
- Four **fictional, explicitly labeled** example projects to demonstrate UX
- Pure comparison engine with Node.js tests
- Prototype GenLayer Intelligent Contract source with independent web reads and outcome comparison
- GitHub Actions smoke tests

## Important integrity boundary

The **frontend is a local-only showcase**. It stores data in `localStorage` and does not sign, send, stake, transfer, fetch external evidence, or issue on-chain judgments. User-entered URLs and text are unverified. All example projects are fictional. A local SHA-256 is not a blockchain anchor.

The `contracts/Pride.py` file is a **network-unverified prototype**. Python syntax and source checks do not prove GenVM compatibility, live validator consensus, or security. It holds **no assets**. Real network integration must only be claimed after successfully deployed and independently verified.

## Run

No `npm install` needed.

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

Alternatively serve these files from any static hosting provider or GitHub Pages. ES modules require an HTTP server (do not just open `index.html` directly in all browsers).

## Test

```sh
node --check assets/app.js
node --check assets/engine.mjs
node --test tests/engine.test.mjs
python3 -m unittest discover -s tests -p '*test.py' -v
python3 -m py_compile contracts/Pride.py
```

## Repo map

```
index.html                     The single-page app entry
assets/style.css               Responsive product visuals
assets/app.js                  UI views, forms, routing and events
assets/engine.mjs              Pure comparison/backup engine
assets/favicon.svg             Original PRIDE branding
contracts/Pride.py             Prototype GenLayer Intelligent Contract
contracts/README.md           Runtime assumptions and integration scope
tests/                         Unit + static tests
docs/PRODUCT_SPEC.md           UX/product scope and flow
docs/SECURITY.md               Honest security & trust model
docs/CODEX_AUTOPILOT_PROMPT.md Complete next-stage agent handoff
.github/workflows/checks.yml   GitHub CI
```

## The intended GenLayer-native architecture

1. Issuers **register** voluntary and specific commitments.
2. Source ownership is verified on chain or by an independently checkable signature/proof (not implemented).
3. Public document snapshots are captured and content-addressed.
4. Each validator independently retrieves an allowlisted stable source.
5. AI describes bounded semantic contradictions. Validators independently compare material outcomes, while code checks measurable terms and deadlines.
6. Inconclusive fetches or divergent verdicts cause **no adverse decision**.
7. Issuers can dispute provisional findings with new authenticated evidence.
8. Only after rigorous ledger/security testing may opt-in collateral and claimable payouts be considered.

See `docs/CODEX_AUTOPILOT_PROMPT.md` for the exact finish-to-submission work.

## Evaluation honesty

This repo contains a polished, working browser app and early contract scaffold. It is **not yet a deployed Intelligent Contract product**. No claim of independent audit, guaranteed competition ranking, or production financial safety is made.

## Sources / conceptual references

- [GenLayer intelligent contracts](https://docs.genlayer.com/developers/intelligent-contracts/first-intelligent-contract)
- [GenLayer Equivalence Principle](https://docs.genlayer.com/developers/intelligent-contracts/equivalence-principle)
- [GenLayer web access](https://docs.genlayer.com/developers/intelligent-contracts/features/web-access)

License: MIT. See `LICENSE`.
