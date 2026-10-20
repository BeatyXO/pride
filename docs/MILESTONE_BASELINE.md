# PRIDE V1 Milestone Baseline Freeze

This record freezes the requested comparison point before V1 implementation. It describes what exists at baseline commit `1537599fa4bb68df6d1fbb07b47c028c4eff31bc`; it is not a claim about the new milestone.

## Git identity

- Baseline commit: `1537599fa4bb68df6d1fbb07b47c028c4eff31bc`
- Baseline tree: `3145a55dfdc25b6bdabf9c9d29abf03a873ba702`
- Local branch created from that exact commit: `milestone/pride-v1-adjudication`
- Remote `main` fetch was attempted before changes but could not be verified because GitHub was unreachable and the sandbox denied writing `.git/FETCH_HEAD`. The local commit identity matches the requested baseline exactly.
- Baseline contract: `contracts/Pride.py`, SHA-256 `4594532457829e48fd57bd89a7adfaf7bfa20cb3f1f478d411606af33f84de77`.

## Deployment at baseline

- Historical Studionet contract: `0xe20273aDaaDb19B6BE34Fa5C6CfDe3B59719d4C0`.
- Historical deployment transaction: `0x77786b21af2621d46f7253ce481948994ca513cafcc1631391be9357c5b59608`.
- Chain ID: `61999`; RPC: `https://studio.genlayer.com/api`.
- The baseline repository records finalized `MAJORITY_AGREE` / successful deployment and byte-for-byte RPC source parity. This V1 work preserves those historical claims as V0.3 evidence; they are not evidence for a V1 deployment.

## Architecture and feature inventory

The baseline uses one asset-free Intelligent Contract with wallet-bound publisher labels and asserted GitHub repository scopes, commit-pinned raw GitHub `.txt` evidence, NFC and line-ending canonicalization, bounded complete snapshots and SHA-256 digests, semantic source checks with exact quotations, numeric-change signals, append-only amendment history, and evidence-backed challenge/rebuttal records. The browser separates fictional local showcase data from Studionet reads and injected-wallet writes, with transaction finality plus finalized-state readback.

The public methods are `register_publisher`, `revoke_publisher`, `get_publishers`, `register`, `deactivate`, `check_source`, `propose_amendment`, `activate_amendment`, `open_challenge`, `rebut_challenge`, `resolve_challenge`, `get_charters`, `get_checks`, `get_amendments`, `get_challenges`, and `get_config`.

## Baseline tests observed locally

- `npm test`: 21 passed, 0 failed.
- `python -m unittest discover -s tests -p '*test.py' -v`: 5 passed, 0 failed.
- `python -m py_compile contracts/Pride.py`: passed.
- `genvm-lint lint contracts/Pride.py` with `PYTHONUTF8=1`: 3 checks passed. Without UTF-8 console output the Windows terminal raised `UnicodeEncodeError` while printing the success checkmark; this was an output-encoding issue, not a lint finding.
- `gltest -p no:cacheprovider tests/test_contract_direct.py -v`: 8 passed, 0 failed, using `genlayer-test 0.29.2`, local Direct Mode configuration, and the contract's pinned GenVM runner `v0.2.12`.
- GenLayer CLI reports version `0.39.1`.
- No V1 browser, cross-contract, or live Studionet test exists at baseline.

## Baseline limitations and security boundaries

- Wallet ownership proves the transaction sender controls the wallet; it does not prove GitHub, repository, organization, or domain ownership.
- Only the publisher can initiate source checks; an issuer can therefore decline to publish later observations.
- Challenge sources are constrained to the publisher's asserted GitHub scope. This preserves source provenance relative to the declaration but does not authenticate the repository owner.
- Challenges can end only as `INCONCLUSIVE`; no consensus adjudication produces `UPHELD` or `REJECTED`.
- No canonical standing view or separate consumer contract exists.
- The fetch interface exposes no verified final redirect URL or content type. Runtime redirect behavior is therefore not asserted as defended.
- Amendment notices have no trusted publication time or enforced advance-notice period.
- Contract storage uses append-only dynamic arrays and some views/duplicate checks scan historical entries; boundedness is limited by per-publisher/per-record guards and requires further explicit global accounting/pagination.
- There is no autonomous expiry/recovery for stalled challenges.
- Browser automation with a real wallet and live V0.3 contract interaction was not run as part of this baseline audit.

## Source references reviewed

- Official GenLayer docs for [IC-to-IC view calls and messages](https://docs.genlayer.com/developers/intelligent-contracts/features/interacting-with-intelligent-contracts), [deterministic versus nondeterministic operations](https://docs.genlayer.com/developers/intelligent-contracts/features/non-determinism), and [transaction timestamps](https://docs.genlayer.com/developers/intelligent-contracts/features/transaction-context).
- The two milestone benchmark URLs in the request were opened through the web reference tool but returned internal errors. They have not been locally fetched because GitHub network access is currently unavailable; no claims of having audited their diffs are made.
