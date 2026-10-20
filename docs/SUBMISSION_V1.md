# PRIDE V1 submission status

Status: **NOT READY FOR SUBMISSION**.

The Pride contract and Reliance Gate have active Studionet deployments with source hashes matching the local release manifest. A live Pride `UPHELD` case and the local test/build checks are documented. The Gate call failure has been reproduced twice on Studionet, but only as finalized leader timeouts with no recorded decisions. The available RPC does not provide an execution trace method.

The live Gate `PERMITTED`/`REJECTED` decision matrix, live Pride `REJECTED`/`INCONCLUSIVE` cases, public Vercel production URL with injected-wallet transaction evidence, final GitHub CI run, final pushed HEAD, and final SHA-to-SHA comparison are not verified. These items must be completed before status can change. See `docs/REVIEWER_V1.md` for the concrete blockers and `docs/TEST_MATRIX_V1.md` for the evidence boundaries.
