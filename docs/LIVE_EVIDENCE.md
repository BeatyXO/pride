# PRIDE V1 live evidence and release status

This document reports only transactions and checks that were actually verified. Detailed case readback is in [`live-lifecycle-case-v1.json`](live-lifecycle-case-v1.json). Local tests and mocked browser checks are not live-chain evidence.

## Network and deployments

- Network: GenLayer Studionet, chain ID `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`.
- CLI: `0.39.1`; deployed GenVM runner marker: `v0.2.16`.
- Pride: `0x1A232b6eb69484B29f9Fc9A0Fa06c927083726e9`; deployment transaction `0x431f90c4dfa57aadbe38480df2fbfcdafffbe7777596391d1fac8ad225520302`.
- Reliance Gate: `0x5cEeD74e1465da8D962C1DAe98903F72089E0A18`; deployment transaction `0x796c3b7972a66045b806470362032a7b9f182a0820be6372a934dc1132eaaa60`.
- Both deployment receipts finalized with `MAJORITY_AGREE` and leader execution `SUCCESS`. Independent config reads and deployed-source parity checks succeeded.
- Current local source SHA-256: Pride `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504`; Gate `0465495b95c2afb9a833496f40becbea91daaf907e7c50af77ca50084a218c3f`.
- Gate config binds to the new Pride address, charter `0`, expected version `2`, and operator `0xD6423aE82a975d55C6CeaC222827A727325e0459`.
- Fresh CLI schema reads show Pride `get_reliance_status(charter_id:int) -> string` and Gate `authorize(action_id:string) -> any`, `get_config() -> string`, and `get_decisions(offset:int,limit:int) -> string`. The declared Pride view signature in the Gate's typed interface matches. This callable-schema match does not prove successful on-chain internal-call execution.

## Verified Pride lifecycle

The live lifecycle registered a publisher and charter, observed a matching baseline, detected a material change from a 30% to 15% community allocation, activated an authorized version-2 amendment, and independently read back the version-2 current-source `MATCHES` state. The current charter is active at version `2`; its digest is `d12554e1c8982fba640fc75b96e2b19d0d0d6d819c3f7093bfd72ba768c0a0df`.

An evidence-backed challenge was opened against checkpoint `1`, rebutted by the issuer, and resolved by consensus as `UPHELD` / `MATERIAL_DEVIATION`. The case ID is `7cd18c05ea0c80dc9bc39007ff31c5b90bb4a4cc84eaae4a6f46839e685d5c29`. The challenge, rebuttal, and resolution transactions and independent reads are recorded in the JSON evidence file. Final standing reads `MATERIAL_DEVIATION_ESTABLISHED` at version `2`.

Unauthorized Gate-operator and unauthorized rebuttal submissions finalized successfully at the transaction-execution layer but did not change state: `get_decisions` remained empty and the case remained unchanged until the authorized issuer rebuttal. This is state-transition evidence; it does not claim the return payload was a particular authorization error code.

## Reliance Gate limitation

The authorized Gate call `0x6e67f5a18588a03fa0f563797542a17d5a4e8120816a920985967e1871acee98` finalized without majority (`NO_MAJORITY`) after leader execution timed out at 600 seconds (`LEADER_EXEC_TIMEOUT`). A second authorized call, transaction `0x3b9d1ec683b4315a42bd7c7fc877548090551d2b60ebf0720afebd8fed3cf058`, for action `pride-v1-upheld-case-reject-20261020`, also finalized `NO_MAJORITY` with leader `ERROR`, `Leader execution exceeded 600.000s`, and `LEADER_EXEC_TIMEOUT`. The receipt reports leader model `policy:prd-gpt-5-4` via provider `llm-router`. The configured RPC rejects `gen_dbg_traceTransaction` as unavailable, so the inner execution trace could not be retrieved. After the second finalized receipt, an independent `get_decisions(0,50)` call returned `[]`. The live cross-contract authorization path is therefore **not verified**; these attempts are failure evidence and produce neither `PERMITTED` nor `REJECTED` decisions. The frontend manifest keeps Gate writes disabled. No Gate decision is claimed.

## Frontend and build verification

The production-mode local build (`VERCEL=1 npm run build`) succeeded and emitted `public/index.html` and `public/assets/deployment.json`; `vercel.json` selects `npm run build` and output directory `public`. The local preview at `http://127.0.0.1:8080/#/network` loaded live Studionet data showing the amended v2 charter, `MATERIAL_DEVIATION_ESTABLISHED`, Gate config, and no Gate decisions. It showed Gate writes unavailable. This is a local frontend/RPC read, not a hosted Vercel deployment.

`npm test` covers mocked EIP-1193 connect, chain/account/disconnect events, wrong-network handling, write state, and readback assertions. These are mocked tests, not browser-wallet signing and not live transactions. No public Vercel URL or production deployment is verified here.

## Local checks at the verified checkpoint

- `npm test`: 23/23 passed.
- GenLayer Direct Mode Pride, Gate, and integration tests: 22/22 passed.
- `genvm-lint lint` on each contract: 3 checks passed per contract.
- `npm run build` and `VERCEL=1 npm run build`: passed.
- `node scripts/verify-deployment.mjs`: both local source hashes match the deployment manifest.
- `git diff --check`: passed.

These checks do not replace the blocked Gate live-call verification. Release status: **Pride V1 live lifecycle verified; Gate authorization and hosted Vercel deployment remain unverified. Not a complete release.**

## Historical deployments

Older prototype deployments are preserved as historical metadata in `assets/deployment.json`. They are not the active V1 deployments above.
