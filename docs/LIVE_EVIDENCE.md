# Deployment and live evidence

## V1 milestone status

V1 has not been deployed. No V1 contract address, deployment transaction, finalized receipt, deployed-source SHA-256, source parity readback, state readback, case lifecycle transactions, Reliance Gate deployment, browser wallet transaction, or Vercel URL is claimed. The `assets/deployment.json` manifest intentionally leaves the active V1 address unset; Vercel deployment validation therefore fails until real V1 deployment evidence and matching public environment variables are supplied.

## Historical V0.3 deployment

The following is retained for audit context only. It is not the V1 contract and its test lifecycle does not validate this milestone implementation.

- Network: GenLayer Studionet, chain `61999` (`0xF22F`)
- Address: `0xe20273aDaaDb19B6BE34Fa5C6CfDe3B59719d4C0`
- Deployment transaction: `0x77786b21af2621d46f7253ce481948994ca513cafcc1631391be9357c5b59608`
- Historical source SHA-256: `4594532457829e48fd57bd89a7adfaf7bfa20cb3f1f478d411606af33f84de77`
- Historical test activity and prior prototype records are represented in `assets/deployment.json`; do not interpret them as V1 evidence.

## Required V1 release evidence

After deploying the final source with the pinned CLI and an explicitly configured authorized account, record the finalized deployment transaction and result, fetch deployed source bytes and compare them byte-for-byte, compute source SHA-256, independently read the V1 config/state, then execute and verify publisher registration, commitment registration, permissionless observation, adjudication, amendment, rebuttal, expiry, unauthorized rejection, and Reliance Gate cross-contract read. Add each real transaction hash and finalized execution status here. Browser wallet integration should also be exercised with a user-controlled injected wallet; mocked EIP-1193 tests are not that evidence.
