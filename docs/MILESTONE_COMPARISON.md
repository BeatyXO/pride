# PRIDE V1 milestone comparison

## Comparison point

- Requested baseline commit: `1537599fa4bb68df6d1fbb07b47c028c4eff31bc` (verified as remote `main` before implementation)
- Baseline tree: `3145a55dfdc25b6bdabf9c9d29abf03a873ba702`
- Baseline `contracts/Pride.py` SHA-256: `4594532457829e48fd57bd89a7adfaf7bfa20cb3f1f478d411606af33f84de77`
- Milestone branch: `milestone/pride-v1-adjudication`

## Functional changes

| Area | Baseline | Milestone branch |
| --- | --- | --- |
| Observations | Issuer-only source checks | Permissionless immutable source observations with wallet, source role, version, digest, full snapshot and recorded time |
| Case resolution | Caller-selectable closure shim; no adjudication | Validator-consensus `UPHELD`, `REJECTED`, or `INCONCLUSIVE`; independent evidence re-fetch; digest and exact citation agreement; one open case per commitment; timeout recovery |
| History | Amendment records without independent version query | Append-only commitment version snapshots and bounded `get_versions` view |
| Standing | No canonical standing view | Finalized-derived standing with explicit precedence and preserved earlier adverse outcome |
| Composability | No consumer contract | Separate non-custodial Reliance Gate reading `LATEST_FINAL`, expected version, active status and standing |
| Frontend | Narrow read/write path for prototype contract | Displays standing, observations, provenance, version history, rebuttal/adjudication/expiry workflows and optional configured Gate decisions; checks finalized state |
| Deployment metadata | V0.3 marked active | Historical V0.3 preserved; V1 active address intentionally unset until actually deployed |

## Candidate source fingerprints

- `contracts/Pride.py`: SHA-256 `BD26C3193346B4DDF2B75DB5E66CC8241AC9E3A1F7EFA99ACED50DD8AC311F2B`
- `contracts/pride_reliance_gate.py`: SHA-256 `CCED84CC79E3C7595323FF2E6F0F2CDD41642609D16D9F8A41B5CF9925F7ACD2`

These are local candidate fingerprints, not deployed-source parity evidence. Recompute after any source edits and record remote parity only after actual deployment.

## Validation at handoff

The local validation commands and their final counts are reported in the release response. Direct Mode mocks source/model/network-return data; it does not prove live Studionet consensus or cross-contract execution. The browser inspection used local HTTP and no injected wallet transaction. No CI run or Vercel deployment is claimed until the branch is published and configured with real V1 deployment metadata.
