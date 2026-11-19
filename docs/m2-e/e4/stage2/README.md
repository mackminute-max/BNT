# M2-E4 Stage 2 delivery

- [Implementation report](BNT_M2-E_E4_Implementation_Report.md)
- [Test evidence and limitations](BNT_M2-E_E4_Test_Evidence.md)
- [Next-gate readiness](BNT_M2-E_E4_Next_Gate_Readiness.md)
- [Windows offline owner checklist](WINDOWS_ACCEPTANCE.md)
- [Evidence manifest](evidence/MANIFEST.json)

Runtime `a07c3d2ef3a97d47f349440e0533706d24f4a50f`. Verdict: **CONDITIONAL PASS**. Final Node suite: 518/518. Large-workload responsiveness and new Windows acceptance remain review items. Historical evidence elsewhere is preserved.

Both `dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html` are 1,042,502 bytes, SHA-256 `79a99ed587cef45c47f911bf59caf50c9f73bb9abb84f2f9fba2de6c73997ab5`.

## Development reproduction

Use the existing repository dependencies and Node environment. No dependencies are needed to play the HTML. These scripts start temporary HTTP diagnostics; they do not establish Windows direct-file acceptance.

Run from the repository root. Set `BNT_E4_STAGE2_OUT` to a fresh directory to preserve prior evidence. Use separate output directories for simultaneous UI runs; never let an older failed diagnostic overwrite a newer result.

```sh
npm test
npm run build
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof/final-ui node scripts/m2-e/e4/stage2-browser.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof node scripts/m2-e/e4/stage2-files.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof node scripts/m2-e/e4/stage2-reopen.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof node scripts/m2-e/e4/stage2-capacity-preflight.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof node scripts/m2-e/e4/stage2-capacity.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof BNT_E4_CAPACITY_MODE=four node scripts/m2-e/e4/stage2-capacity.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof BNT_E4_CAPACITY_MODE=long node scripts/m2-e/e4/stage2-capacity.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof node scripts/m2-e/e4/stage2-long-parity.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof node scripts/m2-e/e4/stage2-retained.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof node scripts/m2-e/e4/stage2-quota.mjs
BNT_E4_STAGE2_OUT=/tmp/bnt-e4-proof node scripts/m2-e/e4/stage2-timing.mjs
```

Capture each raw process exit separately. Large fixtures can take many minutes, especially with concurrent verification. Timing and checkpoint overhead are not frame-rate benchmarks. `stage2-retained.mjs` intentionally consumes the accepted retained fixture and uses a 600-second diagnostic worker timeout; it is not another newly simulated twelve-event schedule.

`stage2-validate-evidence.mjs` verifies the retained result layout used in this delivery, including `node-a07c3d2.log/.exit` and `final-ui/browser.json`. Point it at this evidence directory to inspect delivered results:

```sh
BNT_E4_STAGE2_OUT=docs/m2-e/e4/stage2/evidence node scripts/m2-e/e4/stage2-validate-evidence.mjs
```

That command writes its own summary/log if redirected; use a copy to leave the recorded manifest unchanged. It does not rerun the original capacity simulations. The long-Rally Node reference and accepted-browser reference are explicitly separate; see the parity artifact before interpreting a cross-runtime checksum difference.

Existing browser runners can generate reports. Run them in an isolated project copy when preserving historical documentation. The exact final runner inventory and raw exits are in `evidence/browser-inventory-final/summary.json`. Known file-policy, obsolete selector and legacy numeric failures remain visible.

No merge, push, deployment or E5 implementation is included.
