# PRIDE — CODEX AUTOPILOT FINISH PROMPT

You are taking over an already implemented PRIDE repository at **https://github.com/BeatyXO/pride**. You are an engineer executing work, not a consultant returning only a plan. Inspect the entire existing codebase, run checks, fix issues, and make concrete commits to the `main` branch if permissions and repository state permit. Keep original user work and work inside this existing repo. Never copy from FairDrop.

## Mission
Turn **PRIDE — Public Record Integrity & Disclosure Engine** into a submission-quality standalone GenLayer Intelligent Contract application. PRIDE verifies whether an issuer's **public, voluntary, registered promises** are contradicted by changes to authorized public documentation. Its unit of analysis is **evolving public commitments**, not Sybil appeals, airdrop eligibility, agent escrow or reputation scoring. Originality matters: do not reuse FairDrop's code, UI, class names, rule structures or demo data. The user wants a simple workflow and a distinctive gradient purple/yellow/red Comic Sans design.

## Work already completed (do not overwrite blindly)
- `index.html` + `assets/style.css` + `assets/app.js`: responsive static SPA with full project UX, fake-example banners, cards, registry, registration, passports, comparison views, challenges and interactive forms.
- `assets/engine.mjs`: input safeguards, comparison and word diff, local persistence, SHA-256, backup import/export schema.
- `assets/favicon.svg`: custom PRIDE mark.
- `contracts/Pride.py`: GenLayer single-contract candidate that registers charters and independently reads+classifies public evidence, with entire source text and decision compared exactly. **Unverified on live GenVM**, no financial features.
- `tests/engine.test.mjs`, `tests/contract_static_test.py`, GitHub Actions, README and security docs.
- Four fictional demo charters; they must never be passed off as real endorsements or on-chain results.

## Non-negotiable requirements
1. **Actually execute** tasks; do not merely draft. First run all existing checks; preserve passing UX and tests.
2. Research the current official GenLayer SDK/runtime and adopt the exact compatible dependency pin with proof. Validate `@gl.storage.allow`, storage dataclasses, `DynArray`, web API response shape, JSON LLM response, and custom `run_nondet_unsafe` consensus in actual direct mode. Do not assume the starter compiles merely because Python AST tests pass.
3. Maintain **one standalone core Intelligent Contract** for PRIDE. Additional read-only views/adapters only if actually needed; no needless complexity.
4. Build a real auth/issuer ownership method: signed issuer authorization or verifiable domain ownership. Do not let arbitrary users register commitments under someone else's identity as verified.
5. Use **allowed, stable public evidence**; bind URL, host, path, record ID, issuer, evidence hash and retrieval window. Stop redirects/SSRF. Don't silently accept partial, stale, CORS-cached or rate-limited documents. Distinguish unavailable/insufficient from real contradiction. Authenticate change and disclosure sources separately.
6. The on-chain evidence record must be a **canonical snapshot**. Store content digest, normalized stable attributes, relevant excerpts, source URL, snapshot timestamp/height, and AI output. Validators fetch independently. Every decision-bearing field must be compared. If a one-bucket tolerance is used for non-decision language, a different material verdict must fail consensus.
7. AI may extract structured semantic differences but may never alone slash or convict. Use a strict schema with MATCHES / POSSIBLE_CHANGE / MATERIAL_CHANGE / INSUFFICIENT_EVIDENCE and clear evidence citations. Deterministically compare percentages and deadlines when explicitly present. An AI agreement alone does not prove truth.
8. The initial FULLY IMPLEMENTED module must be **tokenomics and public fee-policy commitments** with at least one verifiable source and a realistic change case. Resist adding dozens of unrelated categories.
9. Support issuer disclosures with bounded windows and an appeal/challenge with new authenticated evidence; explicitly distinguish self-disclosed material amendments from dishonest undisclosed changes. A stale missing fetch must not produce a condemnatory outcome.
10. Keep **financial custody disabled** until an independently tested accounting model exists. Only if it passes can a small opt-in bonded testnet demonstration be considered. Never enable irreversible financial penalties through an unreviewed LLM result. Document and prove escrow solvency/claimability if implemented.
11. Integrate the **existing frontend** with real GenLayer wallet and contract reads/writes; retain a prominent LOCAL SHOWCASE mode only for demo fixtures, and a separate REAL NETWORK mode for actually confirmed chain data. Never mix them. No hardcoded transaction success, fabricated deployed addresses, silently faked transactions or fake verdicts. Show pending/accepted/finalized/undetermined/error states based on receipts.
12. Add source/validator details to the passport, before-vs-after evidence, authenticated signature, dispute status, and local proof export. Keep the nav compact and the three-step workflow **Record → Compare → Question**. Preserve Comic Sans, bold gradients, responsiveness, keyboard access and ARIA labels.
13. Create a proper test suite with real genlayer-test direct mode and mocked web/model, a local integration suite, adversarial fixtures, and robust lifecycle coverage. Include malformed documents, source drift, injection text, dishonest leader, consensus disagreement, false-positive change, unproven owner, invalid redirects, website downtime, duplicate checks, issuer deactivation during dispute, challenge replay and reserve/finality accounting if money exists.
14. Deploy to a network that the GenLayer docs currently support; record **real** source hashes, chain IDs, addresses, deployment transaction IDs, finalized results and explorer links. If unable to deploy, leave deployment fields null and state the blocker. Do not invent proof.
15. Build a reproducible seeded demo with *genuine* accepted chain results, UI walkthrough screenshots/video, one meaningful integrity change and one inconclusive path, and explicit limitations.
16. Keep README clean: what PRIDE does, why GenLayer is essential, architecture, security, command-to-test, deployment proof, current capability versus planned features. Finish automated CI lint and tests, and perform browser smoke testing on desktop and mobile.
17. Security review: nondet closures must not access contract storage, validators independently fetch, result comparison must bind stored fields, no inconsistent mutation before refusal, no external arbitrary RPC secrets, bounded payloads, no broken URL parser, no permissionless harmful state transitions, no unauthenticated cause to penalize anyone, no funds locked forever.
18. Push concrete changes to `https://github.com/BeatyXO/pride`, avoid force pushes, and provide final report with commit SHA, verified command results, deployment URLs and blocked items. Do not claim completed work unless you actually ran it.

## Completion acceptance tests
- One real promise registered on GenLayer with authenticated issuer (not a synthetic seeded UI record).
- One independently read source checkpoint where validators agree on exact stored evidence and material-outcome fields.
- One source unavailable path proves no unsupported adverse verdict or money movement.
- One authorized and one unauthorized amendment; authenticated evidence used in both.
- One contested finding with independently verified counterevidence and valid finality windows.
- Frontend matches real chain record and does not say paid/final until chain receipt proves it.
- No Python/JS unit, GenVM direct-mode, integration, static security or frontend build/test failures.
- README lists all known gaps, even if outstanding.

## Start here
```
node --test tests/engine.test.mjs
python3 -m unittest discover -s tests -p '*test.py' -v
python3 -m py_compile contracts/Pride.py
```
Read README and docs, inspect `contracts/Pride.py` critically (it is prototype code), set up current GenLayer direct-mode tooling, then iterate toward verified chain evidence. Keep working until blocked by a real outside dependency. Do not stop after a plan.
