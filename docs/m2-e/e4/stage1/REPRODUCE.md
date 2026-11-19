# Reproduce Stage 1 architecture evidence

Runtime revision: `1cde0b0a6d6f49fc3a87ca886e87fd79cd501948`; local branch `feat/m2-e-e4-persistence-recovery`. No remote push is authorized or performed.

Use the existing installed development dependencies. No runtime dependency is needed to play the HTML.

```sh
npm test
npm run build
node --test tests/m2-e-e4-worker.test.js
node scripts/m2-e/e4/stage1-browser.mjs
node scripts/m2-e/e4/stage1-faults.mjs
node scripts/m2-e/e4/stage1-standalone-smoke.mjs
node scripts/m2-e/e4/stage1-routine-benchmark.mjs
```

The browser scripts use installed `/usr/bin/chromium` and development-only isolated HTTP origins. They never bypass managed `file://` restrictions. The default output is `/workspace/deliverables/m2e-e4-stage1/`; the main browser runner accepts `BNT_E4_STAGE1_OUT`. Profiling fixtures are the immutable compressed Gate A snapshots in `docs/m2-e/e4/evidence/`. The default architecture runner includes the complete maximum retained set. `--publication-only` is a documented focused six-group fault rerun, not a replacement for that full retention/replay proof.

`stage1-faults.mjs` intentionally retains a nonzero result if the browser does not enforce the developer quota override. Do not change its assertion to claim native quota denial passed. Read the failure's details and distinguish it from passing error-injection checks.

The routine benchmark must run after other heavy tests to support a clean observational comparison. It records operation windows, worker preparation time, total durable-acknowledgment time and the longest observed main-thread Long Task in each window. Long Task threshold is 50 ms. Different workloads/load conditions do not establish a statistical speedup.

Existing browser and payroll scripts were run from an isolated copy at `/tmp/bnt-e4-stage1-regression`, because they write into historical documentation paths. Their exact commands and exits are in `evidence/regression-processes.json`. Do not overwrite historical accepted evidence when rerunning them in a source checkout.

For Windows direct-file compatibility, follow `BNT_M2-E_E4_Windows_Stage1_Proof.md`. Do not equate HTTP reload or the small empty diagnostic database with complete career/session recovery, Stage 2, or final E4 owner acceptance.
