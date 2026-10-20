# PRIDE V1 test and verification matrix

| Area | Evidence run in this audit | Result | What it does not prove |
| --- | --- | --- | --- |
| JavaScript unit and SDK-client tests | `npm test` | 23/23 passed | Real wallet UI, live transaction finality, or hosted deployment |
| Python unit tests | `python -m pytest -q` | 27/27 passed | GenLayer consensus behavior |
| Production build | `VERCEL=1 npm run build` | Passed; output configured to `public` | Vercel deployment or public URL |
| Deployment manifest | `node scripts/verify-deployment.mjs` | Both local hashes match manifest | Independent RPC source parity by itself |
| Contract source parity | Recorded active deployments and local contract hashes | Pride and Gate hashes match `assets/deployment.json` | Successful Gate invocation |
| Deployed callable schema | `genlayer schema` read for both active Studionet addresses | Gate `authorize(string) -> any`; Pride `get_reliance_status(int) -> string`; typed interface signatures match | Runtime success of the cross-contract call |
| Pride lifecycle | `docs/live-lifecycle-case-v1.json` | Live `UPHELD` / `MATERIAL_DEVIATION` and version 2 evidence recorded | Live `REJECTED` or `INCONCLUSIVE` cases |
| Gate authorized call | Two finalized Studionet receipts | Both `NO_MAJORITY`, `LEADER_EXEC_TIMEOUT`; second readback `get_decisions(0,50) = []` | Any Gate `PERMITTED` or `REJECTED` decision |
| Direct Mode | `gltest -p no:cacheprovider tests/test_contract_direct.py tests/test_reliance_gate_direct.py -v` | 21/21 passed; `genvm-lint lint` reported 3 checks per contract | Live cross-contract ABI compatibility |
| Browser wallet | Existing `tests/network-sdk.test.mjs` injects a mocked EIP-1193 provider | Mocked provider behaviors covered in unit tests | Genuine DOM/browser wallet signing |
| Local frontend DOM | In-app browser at `http://127.0.0.1:8080/#/network`; opened “View evidence & cases” and expanded commitment version history | Live-read V2 commitment, both checkpoints, amendment, and `UPHELD` case appeared; disclosure control expanded | Wallet connection, signing, or public hosting |
| Vercel | Existing branch check context failed; local Vercel-mode build now succeeds | Hosted production is unverified | Public production URL and live browser flow |
| GitHub CI | On audited commit, earlier status showed `static-and-unit` pass; current documentation patch has not run CI | Fresh final commit status unknown | Final green CI |

The repository's simulator and EIP-1193 unit tests are identified as simulated evidence; neither is represented as a real-network or real-browser result.
