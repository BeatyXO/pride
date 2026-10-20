# Security and trust model

## Identity and source authority

A publisher record binds a wallet sender to a label and self-asserted GitHub repository scope. The transaction demonstrates wallet control only; it does not authenticate a GitHub account, organization, project, or domain. No signed claim or external ownership proof is accepted. Sources are limited to public `raw.githubusercontent.com` text files pinned to a 40-character commit in that declared repository. The GenVM web interface used by this project does not expose a verified final redirect URL or content-type header, so redirects and response metadata cannot be independently checked in-contract.

## Evidence and consensus

The contract bounds UTF-8 response size to 8 KiB and stores the complete normalized text that it hashes. Canonicalization normalizes line endings and Unicode NFC before SHA-256. External content is untrusted prompt input. Semantic checkpoint decisions require validator agreement on full retrieved source, digest, outcome, and exact quote; numeric measurements are checked deterministically as an additional signal. A quote's presence does not prove the semantic conclusion is correct.

Permissionless observations accept only a new immutable source within the publisher-declared repository. They are recorded with observer, source role, source digest, captured text, version, and transaction time. This does not create an independent authority registry. Third-party evidence outside the declared repository is explicitly unverified. In dispute adjudication it cannot alone establish an adverse finding. The model must cite an exact quote from the frozen checkpoint; the contract re-fetches and verifies all frozen digests and validators compare structured outcome, finding, citation role, exact citation, and digest identities. Disagreement, source failure, malformed output, or unsupported citation produces an inconclusive result.

## Versions, challenges, and Gate

Commitment versions and amendments are append-only. Amendments cannot activate while a case remains open or rebutted. A case freezes its relevant version, evidence identities, criteria, parties, and lifecycle timestamps. A specific checkpoint may be challenged once; case and history capacities are bounded. The issuer may rebut during a one-hour window. Anyone may then invoke consensus adjudication; after 30 days, anyone may mark a stalled case expired. Terminal states cannot be replayed. These are contract transaction timestamps, not trusted evidence of when external material was originally published.

The separate Reliance Gate binds a PRIDE contract, charter, and expected version. It is operator-gated and reads the canonical `get_standing` through a typed view at `LATEST_FINAL`. It records unique, bounded allow/deny decisions but does not transfer assets or perform downstream actions. Current Direct Mode tests mock the cross-contract response; live Studionet cross-contract evidence is not yet available.

## Known limitations

- Publisher/repository identity is self-asserted. Wallet control is not organization or domain authentication.
- The web runtime does not expose redirect destination, TLS metadata, content type, or historical publication time for contract verification.
- A pinned source is immutable by Git commit reference but may become unavailable; missing evidence safely blocks or makes adjudication inconclusive.
- Semantic outcomes are consensus-model interpretations, not legal findings or proof of fraud.
- The authority model distinguishes repository-declared from third-party claims but does not curate an external authoritative-source registry.
- The one-hour rebuttal period and 30-day case expiration are fixed constants; there is no admin override or case reopening.
- Direct Mode source and model responses are controlled test fixtures. They do not prove live source retrieval or Studionet consensus.
- Reliance Gate cross-contract read is unit-integrated through Direct Mode's RPC hook only; live gate deployment and call are still required.
- V1 deployment, source parity, live lifecycle, GitHub Actions run, and Vercel release are not claimed. V0.3 deployment data is historical only.

The contracts have no payable entrypoints, asset transfers, bonds, slashing, or custody. Never put a private key or seed phrase in frontend or Vercel environment variables.

## Checks

```sh
npm ci
npm run build
npm test
python -m unittest discover -s tests -p '*test.py' -v
python -m py_compile contracts/Pride.py contracts/pride_reliance_gate.py
genvm-lint lint contracts/Pride.py
genvm-lint lint contracts/pride_reliance_gate.py
gltest -p no:cacheprovider tests/test_contract_direct.py tests/test_reliance_gate_direct.py -v
```
