# Deployment and live evidence

## V1 deployment

- Network: GenLayer Studionet, chain `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`.
- CLI: GenLayer `0.39.1`; contract runner marker: `v0.2.16`.
- Pride: `0xB8e8013A25a61CC0deD62621AaCA116B8F7aD03d`; deployment transaction `0x3e409db1629e2ff4acb8b85c72557a84ce0350eb2605aa4ccfb25906df1a7a52`; receipt `FINALIZED`; leader execution `SUCCESS`; result `MAJORITY_AGREE`.
- Pride source SHA-256 (exact local file bytes): `6b5a466b87eb99def3a11d6c60e00cbb6524383c8b08b7f1dd6bd6b96c8b5b8c`. `genlayer code` returned a source string beginning with the exact local source bytes; only the CLI's two trailing output newlines followed it.
- Pride independent reads: `get_config` reported product `PRIDE`, version `1.0.0`, and `STUDIONET_MILESTONE`; initial `get_publishers` and `get_charters` returned empty lists before lifecycle writes.
- Reliance Gate: `0xab5c9eFb60bd75F71260d085b6b4002430214a4e`; deployment transaction `0x40e04e31f66d4b5533713628ce027c4a229cd7bd48c3cdf6036bbf776be8545a`; receipt `FINALIZED`; leader execution `SUCCESS`; result `MAJORITY_AGREE`.
- Gate source SHA-256 (exact local file bytes): `cd9772002cd95069f387f234ce2aa62cd999eb4bd83f87a3b4ffb82b0a42bb59`; deployed source matched the exact local source bytes.
- Gate independent `get_config`: bound to Pride above, charter `0`, expected version `2`, operator `0xD6423aE82a975d55C6CeaC222827A727325e0459`, required standing `OBSERVED`.

The initial Gate deployment attempt `0x6c2934ff58639d10a2b76da94c637d20e7f6bbb5fd73f241110d27afa3facb51` finalized with leader execution `ERROR` because the CLI passed the Pride address as an `Address` object while the constructor expected a string. That failed address, `0x1B219A2B45d667e03C1eE5E919d5667db1902f92`, is not an active contract. The Gate constructor was corrected to accept the typed address; Direct Mode and lint passed before the successful deployment above.

## Live Pride lifecycle evidence

- Publisher registration transaction `0xc6cdd555f25628ac4b41ccf28f67afaae2c664a4f35773a26cd78febd724b36f`: `FINALIZED`, read back publisher `0` with owner `0xD6423aE82a975d55C6CeaC222827A727325e0459`, asserted scope `BeatyXO/pride`.
- A first charter transaction `0x96d4154502c908c9da79e5d9cc8032b2b8df934e5c5e4e4b9ca193e5e71468ac` finalized but failed execution because the CLI call included one extra argument. No charter was written; `get_charters` remained empty.
- Corrected charter registration transaction `0xd5bede0b5459469c79eaa8bffb76cd12db310908ea22c6bd121f3bdb5be57a98`: `FINALIZED`, leader execution `SUCCESS`; charter `0` read back active at version `1`, terms `Community allocation remains 30%.`, source digest `2ba9dacb3032f97ca330ab7fc2954dda23ac613135bb98bf4f6bdcea45955701`.
- Baseline verification transaction `0x19fdc186d7b3da84078a53e22da7baea34035f15a10876f6fd76f4e02ce84718`: `FINALIZED`; checkpoint `0` read back as `MATCHES`, version `1`, with matching source digest.
- Changed-source transaction `0x26c4a9be7387a5d628c7fa44598715aadc1dbb5b64c203b54f5c36421f101f94`: `FINALIZED`; checkpoint `1` read back as `MATERIAL_CHANGE`, version `1`, because the pinned fixture changed the community allocation from `30%` to `15%`.
- An authorized amendment was proposed from the pinned `amended.txt` and `notice.txt` fixtures; amendment record `0` was read back as pending activation. Its transaction hash was not retained in the CLI output, so no hash is claimed here.
- Amendment activation transaction `0x1e384c07912b845bd9baf11d3a3ec4c913c1276d044f54001c9e124b6b626369`: `FINALIZED`, leader execution `SUCCESS`; `get_charters` and `get_versions` read back version `2` with amended terms `Community allocation is amended to 15%.`; `get_standing(0)` returned `OBSERVED`, active, version `2` before the Gate test.

## Remaining live lifecycle checks

- Gate authorization transaction `0x18f6b6c686cc3103e133edf2935dc7777ad837d3631882c5e570fc3ab3f8008b` is still `PROPOSING` with `NO_MAJORITY`, zero rounds, and no leader assigned. It is not counted as executed, finalized, or successful.
- A distinct funded challenger is required for the evidence-backed challenge, issuer rebuttal, adjudication or expiry, and unauthorized-action rejection. Auto-review rejected passing another wallet key as a process argument. Approval was requested to use the safer masked local CLI import path; no second signer key has been imported or used.
- The challenge, rebuttal, terminal resolution/expiry, unauthorized rejection, and a finalized Gate decision/readback remain unverified.
- No browser extension transaction was sent. The local browser loaded the active deployment and read the amended Pride charter and Gate config. The IAB tab had no injected provider; wallet-connect/account/network/write/readback behaviors are covered only by mocked EIP-1193 Node tests (22/22 passing), not by an injected browser wallet.

## Frontend and Vercel

`vercel.json` sets build command `npm run build` and output directory `public`. Local `npm run build` succeeds with the verified Pride/Gate manifest, and `node scripts/verify-deployment.mjs` confirms both source SHA-256 values. The Vercel project deployment and public URL have not yet been verified. Required build variables are listed in the repository README; never put a private key or seed phrase in Vercel.

## Historical deployments

V0.3 address `0xe20273aDaaDb19B6BE34Fa5C6CfDe3B59719d4C0` and its earlier prototype remain historical only. The `previousPrototype` and `previousV03Deployment` entries in `assets/deployment.json` are not the V1 release.
