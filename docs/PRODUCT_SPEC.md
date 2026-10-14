# PRIDE product scope

PRIDE records public commitments, issuer-submitted source evidence, semantic checkpoints, amendments, and challenges. It does not label an organization as fraudulent or convert a model conclusion into a legal finding.

## Two separate workspaces

The local showcase uses synthetic examples and browser storage. It supports local comparison and backup, but does not fetch sources or write to a chain. The real-network page is the default route and displays only records read from the configured contract. It requires an injected EIP-1193 wallet for writes and gates transactions on Studionet chain ID `61999`.

## Real-network lifecycle supported by the contract candidate

1. A wallet registers a publisher label and asserted GitHub repository scope.
2. The same wallet registers a commitment against a commit-pinned raw text source in that repository.
3. The issuer can request bounded source checkpoints by submitting a new immutable commit-pinned text URL from the same repository scope. Each record includes that URL, full captured text, digest, semantic outcome, and exact quote, compared against the original baseline.
4. The issuer can propose and activate an append-only amendment with a separate notice source.
5. A user may challenge a material or possible-change checkpoint with a commit-pinned source and exact quote. The issuer can rebut with comparable evidence.
6. A challenge can be closed only as inconclusive. No adverse adjudication or expiry is implemented.

## Visual direction

The identity uses deep violet/plum surfaces with lavender, warm yellow, coral, and gradient accents. Preserve the colored PRIDE mark, hero art, and project illustrations. Small decorative icons inside the overview metric cards are intentionally omitted.

## Trust labels

Use “publisher wallet” rather than “verified organization.” An on-chain transaction proves the sender controlled the wallet for that transaction; it does not prove ownership of a third-party domain or GitHub project. Use “captured source” and “model-supported outcome” rather than “proof of breach.” A challenge is evidence-backed but not adjudicated. The detailed security limitations are in [SECURITY.md](SECURITY.md).
