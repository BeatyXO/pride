# PRIDE ✦ — promises deserve proof

**Public Record Integrity & Disclosure Engine** — an original GenLayer-oriented product for tracking published commitments and their changes. Created October 13, 2026.

PRIDE is **not FairDrop**: it does not flag wallets, administer airdrop appeals, hide Sybil rules, or copy FairDrop code. PRIDE is a voluntary commitment registry with source checkpoints, semantic contradictions and eventually independent evidence verification.

## What is implemented

- Responsive static website in purple/yellow/red gradients with Comic Sans styling and a bundled optional GenLayerJS client
- Searchable registry, filters, dashboards, project passports, timelines
- Working register-promise and checkpoint forms
- Baseline-versus-checkpoint word diff and numeric/percentage/deadline detection
- Local challenges, closed-question controls, toast notifications, export/import, SHA-256 hashes
- Four **fictional, explicitly labeled** example projects to demonstrate UX
- Pure comparison engine with Node.js tests
- GenLayer direct-mode contract prototype for tokenomics and public fee-policy records, independent source retrieval, cited model output, and canonical SHA-256 snapshots
- Separate GenLayerJS Studionet view with finalized-state reads and receipt-based writes to the verified deployment
- GitHub Actions direct-mode contract tests pinned to the `genlayer-test` runner package
- GitHub Actions smoke tests

## Important integrity boundary

The **Local Showcase** stores data in `localStorage`; its forms do not sign, send, stake, transfer, fetch external evidence, or issue on-chain judgments. User-entered URLs and text are unverified. All example projects are fictional. A local SHA-256 is not a blockchain anchor. **Real Network** is an isolated GenLayerJS view connected to the verified Studionet deployment recorded in `assets/deployment.json`. It reads finalized chain data and asks the connected wallet to sign writes.

The `contracts/Pride.py` file is a prototype. It is deployed on Studionet and has completed a test-only register, source-check, authorization, and deactivation cycle. Direct-mode tests use mocked web/model responses. This does not establish issuer/domain authorization, source authenticity, production readiness, or security. The contract has no payable methods and holds no assets.

## Studionet deployment proof

- Chain: GenLayer Studionet, chain ID `61999`
- Contract: `0x900B946995Cf1B8C8BcF0C6cb95B0DC0F34E6167`
- Deployment transaction: `0x6dcbe0b63c1302ed433efb3110791cd0e1d5e7ef461401447fce67574da970b9`
- SHA-256 of deployed source: `ae6f5bf9d4a19e74d76fa55d5ae678a4e94b691bb2419d2b8565ae06e7ccf5d8` (verified byte-for-byte against the on-chain code)
- Test-only charter 0 was registered, checked against a public fixture, and recorded as `MATCHES` with checkpoint 0.
- A second funded wallet received `NOT_OWNER` when attempting deactivation; the owner then deactivated the charter. The final chain state is inactive with the checkpoint retained.

Two earlier deploy transactions finalized with `invalid_contract` and created no code while the runner header was being corrected. A small storage probe used to verify the Studionet SDK path also remains on the test network at `0x35e3B98a1CD38047531A4B429722897f2d92630d`; it is separate from PRIDE.

## Run

Build the optional GenLayerJS client once, then serve the static app:

```sh
npm ci
npm run build
python3 -m http.server 8080
# open http://localhost:8080
```

Alternatively serve these files from any static hosting provider or GitHub Pages. ES modules require an HTTP server (do not just open `index.html` directly in all browsers).

## Test

```sh
node --check assets/app.js
node --check assets/engine.mjs
node --test tests/engine.test.mjs tests/network-sdk.test.mjs
python3 -m unittest discover -s tests -p '*test.py' -v
python3 -m py_compile contracts/Pride.py
gltest -p no:cacheprovider tests/test_contract_direct.py -v
```

## Repo map

```
index.html                     The single-page app entry
assets/style.css               Responsive product visuals
assets/app.js                  UI views, forms, routing and events
assets/engine.mjs              Pure comparison/backup engine
assets/network.mjs             Isolated GenLayerJS reads and wallet writes
assets/deployment.json         Verified Studionet deployment and lifecycle proof
assets/genlayer-client.entry.mjs  GenLayerJS bundle entry
assets/genlayer-client.js      Generated browser bundle
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

## Current capability and remaining work

The contract accepts `TOKENOMICS` and `FEES` commitments and records a source snapshot only when a structured model response includes an exact supporting excerpt and validators agree on the full result. The Real Network client supports finalized reads, wallet connection, registration, source checks, and receipt tracking on Studionet. Authenticated issuer ownership, stable-source allowlists and redirect controls, advance disclosures, and authenticated challenge evidence remain unimplemented.

## Evaluation honesty

This repo contains a working browser app and a deployed Studionet prototype. No claim of independent audit, issuer verification, guaranteed competition ranking, or production financial safety is made.

## Sources / conceptual references

- [GenLayer intelligent contracts](https://docs.genlayer.com/developers/intelligent-contracts/first-intelligent-contract)
- [GenLayer Equivalence Principle](https://docs.genlayer.com/developers/intelligent-contracts/equivalence-principle)
- [GenLayer web access](https://docs.genlayer.com/developers/intelligent-contracts/features/web-access)

License: MIT. See `LICENSE`.
