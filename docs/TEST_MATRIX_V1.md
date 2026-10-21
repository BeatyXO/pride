# PRIDE V1 test and verification matrix

Latest local source checks were run on 2026-10-21 against the corrected Gate source and deployment manifest. Live chain actions, local simulations, mocked browser tests, and read-only production browser checks are recorded as separate evidence classes.

| Area | Command or method | Result | Limits |
| --- | --- | --- | --- |
| JavaScript unit and wallet SDK tests | `npm test` | 23/23 passed on final source and manifest | EIP-1193 behavior is mocked; this does not prove wallet extension signing. |
| Python suite | `python -m pytest -q` | 27/27 passed on final source | Does not prove GenLayer consensus behavior. |
| Direct Mode contracts | `gltest -p no:cacheprovider tests/test_contract_direct.py tests/test_reliance_gate_direct.py -v` | 21/21 passed after Gate current-block view change | Simulator results are not live-chain proof. |
| GenVM lint | `genvm-lint lint contracts/Pride.py`; `genvm-lint lint contracts/pride_reliance_gate.py` with UTF-8 console output | 3 checks passed per contract | AST lint is not full deployment validation. |
| Deployment manifest | `node scripts/verify-deployment.mjs` | Pride SHA `9518a7f7b31c015e6c406e4577768b8a6af9bbefa55b1de4439f61e85c3a3504` and Gate SHA `08686bfdaf4fd79b938c280c8577b1b119cb35316fd74d14ac9fce1145d6a05a` match manifest | Does not independently prove remote source; see source parity below. |
| Production build | `$env:VERCEL='1'; npm run build` | Passed; packaged `public/` output and deployment manifest | Local build does not by itself prove Vercel deployment. |
| Deployed source parity | `gen_getContractCode` exact-byte comparison | Pride and release/test Gate instances match local source bytes | Applies to Studionet addresses listed in `docs/LIVE_EVIDENCE.md`. |
| Callable schemas and ABI | Studionet schemas plus finalized IC calls | Pride `get_reliance_status(int)->string`; Gate `authorize(string)->any`, `get_config()->string`, `get_decisions(int,int)->string`; corrected Gate calls Pride view successfully | Live `PERMITTED` and `REJECTED` decisions below establish runtime interoperability. |
| Gate `REJECTED` | Finalized write plus independent Gate/Pride reads | Tx `0x5b48ded23660fc2537cc059e254653d8c133201f50d397511bac43c1751d2402`; `DISQUALIFYING_CASE` matches Pride `eligible:false`, `UPHELD` blocker | Release Gate bound to charter 0/version 2. |
| Gate `PERMITTED` | Finalized write plus independent Gate/Pride reads | Tx `0x2a2730d2f1dfd1f1a6e408eda9ad93f2bd52a44811891e5016b1c110cf17242e`; `POLICY_SATISFIED` matches Pride `eligible:true`, `QUALIFYING_FINALIZED_MATCH` | Second byte-matched Gate instance bound to test charter 1/version 1. |
| Pride adjudication matrix | Finalized writes and independent post-state reads | `UPHELD`, `REJECTED`, and `INCONCLUSIVE` evidence is recorded in the three live case JSON files | Test charters and test accounts are not production identity claims. |
| Historical Gate failure and fix | Three finalized old-source timeouts followed by corrected-source calls | Earlier `LATEST_FINAL` calls ended in 600-second `LEADER_EXEC_TIMEOUT`; standard `view()` calls yielded both Gate decisions | Cause is supported by one-line source delta and A/B calls; RPC execution trace was unavailable. |
| Production frontend and history | Browser opened https://pride-coral.vercel.app/#/network | HTTP deployment manifest fetched; all three live records rendered; history disclosures opened and showed `UPHELD`, `REJECTED`, and `INCONCLUSIVE` case details | Read-only browser session; it did not provide an injected EIP-1193 wallet. |
| Wallet behavior | `npm test` mocked EIP-1193 provider tests | Connect/disconnect, chain switching, wrong-chain blocking, account/chain event updates, rejection, write state and finalized readback assertions passed | No genuine extension-based public-site connect/sign/readback was completed. |
| GitHub Actions CI | PR #1 `static-and-unit` checks on source release commit `8084d4f045309abd09244477a5e045b9676dd5ca` | Both runs passed; the workflow ran build, JavaScript and Python suites, syntax, manifest, Python compilation, both lints, and Direct Mode. A fresh run is triggered by the documentation freeze commit. | The distinct Vercel status check is failing because it targets a legacy `beatycat/pride` project not available to the active Vercel account. The manually deployed production project is separately READY. |

### Production deployment

- Public URL: https://pride-coral.vercel.app
- Vercel deployment: `dpl_EN4YK8tc3TqLFpGNHJAr9zHi22Zk` (`READY`)
- Project: `ifem1s-projects/pride`
- Build command: `npm run build`; output directory: `public`.
- The public manifest reports Studionet chain 61999, Pride and Gate addresses, deployment transaction hashes, source fingerprints, and Gate live-verification flags. No private key is required in Vercel configuration.

The milestone remains **NOT READY FOR SUBMISSION** until genuine injected-wallet browser verification is complete. Final freeze commit and compare URL are linked from PR #1.
