# P1.4 review index

Bounded performance optimization; no gameplay rebalance, worker migration, P2, merge, push or deployment.

Individual reports:

1. [Baseline Performance](BNT_P1_4_Baseline_Performance.md)
2. [Optimization Report](BNT_P1_4_Optimization_Report.md)
3. [Determinism and Compatibility](BNT_P1_4_Determinism_and_Compatibility.md)
4. [Frame Pacing](BNT_P1_4_Frame_Pacing.md)
5. [Implementation, Tests and Windows Instructions](BNT_P1_4_Implementation_and_Delivery.md)

Branch `feat/p1-4-performance-frame-pacing`; base `f17c8bfd3edc6e7708df27c86aa7e371585f41f4`; retained runtime `34ef7233f1323001d86924f4845f6196b4b066d4`. The preliminary callback implementation in `eeaf64c` was rejected based on Chromium measurements. The final documentation/diagnostic commit is identified in the external delivery manifest and handoff.

Final tests:605/605 configured Node tests;80/80 focused prototype tests; nine full reference-equivalent races, six autonomous short traces,718 selected state/event/RNG comparisons,32 checkpoint wire/restore comparisons and100 additional close-contact boundary ticks. Historical12+2 payroll, six earlier-profile and three accepted tactical references match. P1 functional browser scripts exit0 with28 functional groups; managed direct-file attempts are explicitly blocked, not passed.

Build `node scripts/p1/build.mjs`; output `dist/Blood-and-Thunder-P1-Playable.html`. Review copy `Blood-and-Thunder-P1.4-Playable.html`,213,241 bytes, SHA-256 `0ea8784671b473c9e95fe4eed4ba7379bf5cf06e966b2d16a3a383f1f1d2ad37`.

## Reproduce measurements

Create an isolated reference archive of the exact base (Linux shell example):

```sh
mkdir -p /tmp/bnt-p14-reference
git archive f17c8bfd3edc6e7708df27c86aa7e371585f41f4 | tar -x -C /tmp/bnt-p14-reference
ln -s /workspace/BNT/node_modules /tmp/bnt-p14-reference/node_modules
```

Use existing installed development dependencies; change paths for your checkout. Do not run the following benchmarks concurrently with regression jobs. Default evidence output is `/workspace/deliverables/bnt-p1-4/evidence`; most harnesses accept `BNT_P14_OUT`.

```sh
BNT_P14_ROOT=/tmp/bnt-p14-reference BNT_P14_STAGE=baseline node scripts/p1-4/browser-profile.mjs
BNT_P14_STAGE=candidate node scripts/p1-4/browser-profile.mjs
BNT_P14_ROOT=/tmp/bnt-p14-reference BNT_P14_STAGE=baseline node scripts/p1-4/sustained.mjs
BNT_P14_STAGE=candidate node scripts/p1-4/sustained.mjs
node scripts/p1-4/summarize.mjs
BNT_P14_ROOT=/tmp/bnt-p14-reference BNT_P14_STAGE=baseline node --cpu-prof --cpu-prof-dir=/workspace/deliverables/bnt-p1-4/evidence --cpu-prof-name=baseline.cpuprofile scripts/p1-4/native-profile.mjs
BNT_P14_STAGE=candidate node --cpu-prof --cpu-prof-dir=/workspace/deliverables/bnt-p1-4/evidence --cpu-prof-name=candidate.cpuprofile scripts/p1-4/native-profile.mjs
node scripts/p1-4/browser-digest-experiment.mjs
node scripts/p1-4/equivalence.mjs
node scripts/p1-4/combat-equivalence.mjs
node scripts/p1-4/tactical-references.mjs
npm test
```

The digest Node experiment defaults to the same `/tmp` reference. The browser variant experiment bundles the retained rejected implementations from `scripts/p1-4/experiments`; these are never imported by the normal game. Fresh baseline/candidate runs use the final Oval phase protocol directly, so historical pilot/refresh merging is unnecessary when reproducing from scratch. This delivery retains all pilot, rejected and final measurements separately, with a provenance manifest.

Raw evidence under `evidence/` is losslessly gzip-compressed with deterministic headers; JSON logs and source retain exact scenarios. Old accepted evidence is not overwritten. Browser profiles, per-group samples, whole-run traces, CPU profiles and all process logs remain available. Source reference hashes are unmodified, not regenerated targets.

Remaining acceptance: owner Windows Chrome/Edge `file://` tests, residual late100ms stalls, and the early Short Rally4× counterexample. See the delivery report before considering any architecture escalation. No new phase is authorized by this package.
