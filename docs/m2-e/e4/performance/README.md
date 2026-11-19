# E4 performance optimization delivery

Tested runtime: `b8c090057052ac03bbed73d9487093da61381451` on `feat/m2-e-e4-persistence-recovery`. Baseline runtime: `a07c3d2ef3a97d47f349440e0533706d24f4a50f`.

- [Profiling and changes](BNT_M2-E4_Performance_Profiling_Report.md)
- [Architecture and mechanical alternatives](BNT_M2-E4_Simulation_Architecture_Assessment.md)
- [Cross-runtime investigation](BNT_M2-E4_Cross_Runtime_Determinism.md)
- [Regression evidence](BNT_M2-E4_Optimization_Test_Evidence.md)
- [Next-gate recommendation](BNT_M2-E4_Performance_Next_Gate_Readiness.md)
- [Windows offline acceptance](WINDOWS_ACCEPTANCE.md)

## Reproduce controlled profiling

Use installed locked development dependencies and the same source revisions. Do not run concurrent builds/tests while collecting performance numbers. The scripts are development diagnostics, not runtime game dependencies. They currently use `/workspace/deliverables/e4-optimization` for default evidence and `/tmp/bnt-perf-baseline` for the archived baseline; adjust paths for another workspace. A fresh output directory preserves historical results.

```sh
mkdir -p /tmp/bnt-perf-baseline
git archive a07c3d2ef3a97d47f349440e0533706d24f4a50f | tar -x -C /tmp/bnt-perf-baseline
ln -s /workspace/BNT/node_modules /tmp/bnt-perf-baseline/node_modules
mkdir -p /tmp/bnt-perf-baseline/scripts/m2-e/performance
cp scripts/m2-e/performance/*.mjs /tmp/bnt-perf-baseline/scripts/m2-e/performance/
# Run the source-local Node profiler once in each checkout, sequentially:
BNT_PERF_OUT=/workspace/deliverables/e4-optimization/new-baseline node scripts/m2-e/performance/profile.mjs
BNT_PERF_LABEL=baseline BNT_PERF_OUT=/workspace/deliverables/e4-optimization/new-baseline-browser node scripts/m2-e/performance/browser.mjs
# Current checkout:
BNT_PERF_LABEL=candidate BNT_PERF_OUT=/workspace/deliverables/e4-optimization/new-candidate-browser node scripts/m2-e/performance/browser.mjs
BNT_PERF_LABEL=candidate BNT_PERF_CASE=eight-long-late BNT_PERF_OUT=/workspace/deliverables/e4-optimization/new-late node scripts/m2-e/performance/browser.mjs
node scripts/m2-e/performance/subsystems.mjs
node scripts/m2-e/performance/codec-compare.mjs
node scripts/m2-e/performance/raw-late.mjs
node scripts/m2-e/performance/journal.mjs
node scripts/m2-e/performance/cross-runtime.mjs
node scripts/m2-e/performance/cross-detail.mjs
node scripts/m2-e/performance/portability.mjs
```

In the first `profile.mjs` command, set the shell working directory to the archived baseline for baseline results, then run again in the candidate with a separate output. `browser.mjs` reads the archived HTML only when label is exactly `baseline`; all other labels read the current HTML. `subsystems.mjs` emits a temporary observation bundle and checks the archived reference. The archived setup/source/build are never modified for production by these diagnostics.

Run `npm test` and `npm run build` for final correctness. Exact browser inventory, exit codes and additional fault commands are in the test-evidence report. Regression timings collected concurrently are not performance benchmarks. Evidence `MANIFEST.json` lists retained files and hashes. No historical evidence/golden was overwritten.
