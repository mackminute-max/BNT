# Phase 2 tests and instrumentation report

## Scope and architecture

All new code is development-only under `scripts/evaluation/` plus `tests/evaluation.test.js`. No file under src/, no configuration default, package dependency/version, existing test or browser runtime was changed for Phase 2. The initial dirty working tree was preserved rather than reset or treated as an unknown legacy baseline. Historical audits/corrective evidence are unchanged.

The existing browser batch runner executes complete races without command/observer hooks. Altering that shared runtime loop would be unnecessary. The evaluator instead reuses the same createRace/step/classification/statistics/replay modules, with a development-only worker dispatcher, passive tick/event observation and deterministic sign schedules. It contains no alternate physics, damage, fatigue, AI or classification approximation. Approximate motion measurements are explicitly labeled as estimates; they never feed the engine.

## New files

| Tool | Responsibility |
|---|---|
| `scripts/evaluation/scenarios.mjs` | Frozen 1000-job primary matrix; equal budgets/grid rotations; separately declared 130-job rear-row follow-up; state/tick sign schedule |
| `measure.mjs` | Passive state/event collection, exact issued-pace timing, tick-sampled motion, linked decisions/compliance, authoritative reporter reuse and optional real replay export |
| `worker.mjs`, `run.mjs` | Four-worker orchestration, progress, bounded races/watchdog, cancellation and streamed JSONL/CSV/config export |
| `statistics.mjs` | Descriptive moments/percentiles, deterministic analysis-only seed-cluster bootstrap, complete-pair contrasts and Wilson bounds |
| `analyze.mjs`, `analyze-supplement.mjs` | Main/supplement subgroup analysis, actual attacker-to-damage linking and independent-context comparisons |
| `verify.mjs`, `verify-data.mjs`, `validate-data.mjs` | Baseline parity/replay, representative saved-data reruns and whole-dataset accounting validation |
| `plot.py`, `report.mjs` | Standalone matplotlib SVG/PNG research figure and data-derived Markdown reports |
| `tests/evaluation.test.js` | Ten evaluator regressions; no production tests removed or weakened |

Full requested documents, raw structured data, metadata, compressed real reference replays, logs and figures live under docs/phase2/.

## Measurement provenance

Existing structured events already provide official timing/classification, decisions/candidates, effective/physical outcomes, signs, combat, component damage/control, occupancy failures and finish fatigue. Extra instrumentation is outside the engine: incremental event aggregation plus tick-endpoint sampling. Decisions reconcile by event/decision ID. Score moments, initial/20-second fatigue traces and selected decision examples are retained. Offensive damage dealt is derived by joining actual attack IDs to damage parent/contact IDs; no combat damage is left unlinked.

The evaluation adds no simulation RNG draw, callback, state mutation or authoritative event. Analysis bootstrap RNG is isolated from simulation RNG. Each dataset row includes the actual engine checksum and SHA-256 of complete event JSON. Representative reruns additionally recompute the current post-observation checksum using a real capture, not just a cached checkpoint, and deeply compare all saved metrics after the same JSON export serialization, except wall time and the documented player metadata addition. No numeric tolerance is used.

Exact instantaneous maximum/path-integrated average speed and explicit strategic-versus-tactical phase remain unavailable without runtime hooks. Reported speed/lane-time estimates and timing proxies are documented in the data dictionary. All other derived metrics identify their actual state/event sources. Rare events are reported as counts, not invented samples.

## Baseline, parity and regression evidence

- Before tooling: **144 existing tests passed, 0 failed, 0 skipped**; baseline log and source/archive hashes were saved first.
- Final suite: **154 tests passed, 0 failed, 0 skipped**, comprising all 144 retained cases plus ten evaluation-tool cases.
- **Ten exact parity/reference cases pass**: four original default-cadence references, two pre-instrumentation study-cadence references, and four scheduled-sign/environment cases including the rear-row supplement. Selected real captures reconstruct with matching authoritative checksums.
- **Seven saved-data reruns pass deep metric/checksum/event comparisons**, one per primary experiment A/B/C/S/D/E and one supplemental case. Wall time is not deterministic and is excluded. Primary rows predate an explicit playerId metadata field; their full normalized configurations already specify RU1. Adding that known metadata does not alter any measured/authoritative value.
- **32 repeated primary controls** reproduce identical checksum/events; there are 968 distinct seeded primary configurations, not 1000 independent cases.
- Dataset accounting validates all **1130 races / 9040 entries**: unique execution IDs, resolved config references, finite competitive timing/blocked bounds, pace-duration accounting, finish snapshots, overtake/lost-position symmetry and telescoping component damage. Maximum timing/damage floating-point accounting discrepancy is about 2.84e-14.
- The worker cancellation test requests SIGINT and verifies a partial actual count and valid retained output. An intentionally canceled CLI exits nonzero; that is expected test behavior, not a failed race or a silently incomplete study.

Logs and machine evidence: `baseline/tests-before.log`, `evidence/tests-after.log`, `evidence/instrumentation-parity.json`, `evidence/independent-rerun-checks.json`, `evidence/dataset-validation.json`, `evidence/supplement-dataset-validation.json`, and the primary/supplement execution indexes.

## Execution and resource report

The available CPU quota is four cores; both panels used four workers. Primary: **1000/1000** executions in approximately **237.7 s**. Supplement: **130/130** in **34.1 s**. Combined race-execution wall time is about **271.8 s**, excluding baseline review, pilot, parity/replay, tests, analysis and plotting. This is observed host performance, not a general benchmark guarantee. Maximum 30000 ticks per evaluation and 180-second per-worker wall watchdog prevent unbounded work. Neither bound was reached.

The diagnostic checkpoint cadence is explicitly 10000 in study jobs; original defaults remain 100. Before instrumentation, full event SHA-256/RNG/physical outcomes match across cadences. Checksum metadata changes are explicit and separately recorded. Identical-cadence before/after instrumentation comparisons match exactly. No reference was silently updated to hide a change.

An eight-race pilot and verification/test executions are excluded from study counts. The pilot exposed a duplicate `completed` property in evaluation execution-summary construction (an array overwrote a numeric count). It was corrected before the primary run, tested via cancellation/count checks, and both delivered execution files contain explicit numeric completed plus a separate runs index. No core gameplay repair was made.

The first auxiliary deep-rerun comparison failed because raw JavaScript negative zero and JSON-round-tripped zero differ under strict object identity. The comparator now checks the same standard JSON serialization as the exported dataset, explicitly rejects nonfinite raw numbers, and still requires exact numeric/checksum/event agreement (no epsilon). Saved data and references were not changed. The focused regression also verifies exact serialized output reproduction. All seven reruns then pass. This was a tool representation issue, not a simulation difference. A nonfatal matplotlib cache-path warning was handled with a writable /tmp cache; plotting has no application dependency.

## Standalone and source integrity

`npm run build` still produces exactly **163579 bytes**, SHA-256 `30cea713001b2e1dfdc0b818605161ba5951d15a44e4b87b2210493451354002`, identical to the evaluation baseline. The existing embedding/dependency guard passes. No analysis tool or plotting dependency enters that file. Baseline file hashes and the initial tracked working-tree patch match after the work; new evaluator/tests/docs are additions only.

No new browser functional or direct offline launch test was performed in Phase 2 because browser/runtime source and delivered bytes did not change. The earlier 23 functional browser checks and owner offline statements remain historical evidence with their original scope. Do not present HTTP diagnostics or byte identity as a newly executed direct-file test.

## Remaining limitations

The study is not exhaustive and does not establish universal correctness, final balance, cross-browser certification or owner acceptance. Zero wrecks/retirements means no statistical evaluation of secondary wreck behavior, despite retained mechanical tests. Sensitivity has only four paired conditions. The post-primary follow-up has ten pairs per sign and must not be pooled into a preplanned result. Most component geometry/equipment/condition combinations remain untested. All source/runtime, instrumentation provenance, statistical and context limitations are listed in the methodology/analysis.

No balance change, approved-mechanics change, viewer redesign, progression system, push, deployment or publication was performed. Owner review of a specific proposed change is the next decision boundary.
