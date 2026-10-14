# Security and trust model

## Current implementation

The local showcase is illustrative browser storage. It makes no network requests and its evidence is not chain evidence. The Real Network page targets a configured GenLayer Studionet contract and uses an injected EIP-1193 wallet for writes. A transaction is shown as accepted while pending; final success requires a finalized receipt, successful execution, and a finalized-state readback.

The deployed contract binds a publisher label and one asserted GitHub repository scope to the transaction sender address. This proves control of that wallet for the transaction. It does **not** prove control of a GitHub account, organization, project, or domain. No off-chain signature authorization is accepted, so signature replay is not part of this identity mechanism. A publisher may revoke its record; revoked wallet identities cannot be registered again in the same contract.

## Evidence model

Sources are limited to public `raw.githubusercontent.com` text files whose path pins a 40-character Git commit and whose repository matches the publisher's registered scope. The full UTF-8 response is bounded to 8 KiB, line endings are normalized, Unicode is normalized to NFC, and SHA-256 covers the entire canonical body. Source text is stored without truncating the hashed content. Semantic comparison asks validators to return an allowed outcome and an exact quotation. Each validator repeats the read and comparison; decision fields, full text, digest, outcome, and quote must agree. Numeric figures are additionally extracted deterministically as a review signal.

The runtime interface used here does not provide a verified final URL or content-type header to the contract. The allowlist and immutable commit path reduce the source surface but do not prove that the runtime followed no redirect. Source unavailability produces no checkpoint. External documents are untrusted prompt data. Exact-quote validation prevents invented quotations from being recorded, but it does not prove that a model interpreted a quotation correctly.

## Amendments and challenges

The original terms, source text, digest, and version remain in the append-only amendment history. Follow-up checks must name a new immutable commit-pinned source URL in the same asserted repository scope; the full new snapshot is compared with the original terms and source. An issuer can propose a new source and terms with a separate immutable notice source, then activate the proposal in a later transaction. Activation rechecks both digests and appends a new version. The notice is only evidence that the submitted notice text contains an amendment/update marker; the contract has no trusted publication timestamp, minimum notice period, or proof that the notice was public before registration. It must not be described as independently verified advance notice.

Challenges must cite a particular stored checkpoint and provide an exact quotation that is present in a commit-pinned source. The issuer can submit a similarly verified rebuttal. The contract currently supports only a terminal `INCONCLUSIVE` close. It deliberately does not let any caller write an adverse or exonerating adjudication. There is no challenge deadline, expiry, or autonomous abandonment recovery in this version.

## Limits and risks

- The publisher label and repository scope are self-asserted wallet metadata, not identity or domain authentication.
- There is no registration expiry, renewal, trusted timestamp, or historical publication-time proof.
- The GenVM web API available to this contract does not expose redirect destination or content-type verification.
- Semantic outcomes remain model judgments. Exact citations and validator agreement do not eliminate interpretation errors.
- The contract's only challenge resolution is non-adverse and inconclusive; disputes are recorded but not adjudicated.
- Per-wallet, per-record, and per-record challenge limits bound repeated work. A source-check cooldown is not implemented.
- Direct Mode tests use controlled mocked web/model responses. They verify contract execution paths, not live web retrieval or Studionet consensus.
- The current Studionet source parity, deployment receipt, and tested lifecycle operations are documented in [LIVE_EVIDENCE.md](LIVE_EVIDENCE.md). Browser automation with a real wallet and independent explorer indexing remain unverified.

The contract has no payable functions, token transfers, bonds, slashing, or custody. Do not treat PRIDE records as legal findings, certification, or a determination of fraud.

## Reproducible local checks

```sh
npm ci
npm run build
npm test
python -m py_compile contracts/Pride.py
genvm-lint lint contracts/Pride.py
gltest -p no:cacheprovider tests/test_contract_direct.py -v
```

The semantic SDK validation additionally requires the exact `py-genlayer` runner artifact referenced by the contract header. If that artifact cannot be downloaded from the configured GenLayer registry, report semantic validation as blocked rather than passed.
