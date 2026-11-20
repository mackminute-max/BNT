# BNT P1.4 — Baseline Performance

## Verified reference

Repository `mackminute-max/BNT`; accepted P1.3 runtime43928df and validation1c978ec are ancestors of the actual final delivery HEAD `f17c8bfd3edc6e7708df27c86aa7e371585f41f4`. The reference is an isolated `git archive` of that exact delivery in `/tmp/bnt-p14-reference`, using the existing node_modules. The accepted P1.3 HTML is 210,999 bytes, SHA-256 `da93655c5ff145afd4a5a0f092c03ae75019a5132cdf7a36c07cb488d202051e`. Fresh pre-change prototype regressions:76/76 pass; accepted full P1.3 evidence601/601 is historical, not misrepresented as a fresh baseline full run. Only the earlier untracked M2-E audit was present; it remains untouched.

Environment: managed Linux, Node24.22.1, npm11.9.0, Chromium156.0.8078.79, existing esbuild0.28.2/playwright-core1.65.1. No dependency installation, worker, storage migration or server requirement is introduced. The local HTTP server is test infrastructure only.

## Reproducible matrix

| Course | Format | Entrants | Native phase ticks | Viewer speeds |
|---|---|---|---|---|
| Standard Oval | Pure | 4 | 98/798/1398 | 1×/2×/4× |
| Standard Oval | Combat | 8 | 98/798/1398 | 1×/2×/4× |
| C01 Broken Crown | Pure | 8 | 98/998/2198 | 1×/2×/4× |
| C01 Broken Crown | Combat | 8 | 98/998/2198 | 1×/2×/4× |
| Short Rally | Combat | 8 | 98/598/998 | 1×/2×/4× |
| Long Rally | Combat | 8 | 98/1798/2998 | 1×/2×/4× |

Fixed seed145, Clear weather, P1.3 tactical policy, two closed-loop laps, one native pre-start Push Sign. Rally remains point-to-point. Each course/format/phase/speed has two1600-ms observations:108 windows per final implementation/reference. State setup/restoration is excluded; all phases are actual progressed native states, not newly warmed early races relabeled late. The final harness resets measurements **before** Start, so the first periodic digest cannot be lost while Playwright's click completes. Raw start/end ticks, actual wall durations, every tick duration, frame samples and native digest ticks are retained. Initial pilot/interim runs are separate evidence, not pooled into final before/after claims. Correctness-test overlap in pilot samples led to sequential reruns. Final Oval observations were refreshed at40/70s to sample genuinely later race progress; all raw earlier observations are retained separately. The final baseline combines the72 controlled non-Oval observations with36 controlled refreshed Oval observations; candidate uses the same final phase protocol. No concurrent regression/benchmark jobs run during these final observations.

Whole native digest/cold checkpoint profiling uses matching states at ticks100/600/1000, C01 100/1000/2200 and Long Rally100/1800/3000, five direct samples per state, V8 statistical CPU profiling and process memory observations. Benchmarking is sequential; CPU samples and wall timing are distinct. Two complete ordinary4× Circuit Combat viewer runs (reference/candidate) supplement phase stress windows.

## Baseline native breakdown

Times below are milliseconds; serialization/hash component medians are **not** summed as if sampled simultaneously. Event size is UTF-8 MB of full canonical text; historical hashing retains its original JavaScript character semantics. Checkpoint/restore values are single cold-operation observations, not periodic viewer writes.

| Case/course-format-field | Tick | Events | Event MB | Snapshot | Canonical text | Hash | Whole digest | Full checkpoint | Restore |
|---|---|---|---|---|---|---|---|---|---|
| oval/Pure/4 | 100 | 448 | 0.22 | 0.034 | 4.7 | 1.7 | 7.3 | 70.1 | 78.7 |
| oval/Pure/4 | 600 | 1070 | 0.84 | 0.012 | 13.4 | 5.0 | 20.1 | 192.3 | 140.4 |
| oval/Pure/4 | 1000 | 1552 | 1.33 | 0.010 | 20.9 | 8.2 | 31.9 | 182.3 | 138.8 |
| oval/Combat/8 | 100 | 1058 | 1.29 | 0.013 | 17.8 | 7.5 | 26.2 | 156.9 | 115.9 |
| oval/Combat/8 | 600 | 2747 | 3.76 | 0.019 | 54.5 | 22.4 | 77.7 | 547.6 | 384.2 |
| oval/Combat/8 | 1000 | 4148 | 5.74 | 0.021 | 86.9 | 37.8 | 127.2 | 856.6 | 557.2 |
| C01/Pure/8 | 100 | 1043 | 0.89 | 0.011 | 16.2 | 5.6 | 21.5 | 118.3 | 103.5 |
| C01/Pure/8 | 1000 | 5288 | 4.81 | 0.016 | 77.7 | 29.8 | 121.0 | 783.6 | 492.5 |
| C01/Pure/8 | 2200 | 11402 | 9.57 | 0.017 | 165.6 | 57.9 | 222.2 | 1211.6 | 1023.6 |
| C01/Combat/8 | 100 | 1043 | 1.31 | 0.012 | 20.4 | 8.3 | 28.0 | 141.6 | 116.0 |
| C01/Combat/8 | 1000 | 5288 | 5.94 | 0.018 | 109.2 | 40.8 | 155.4 | 771.3 | 645.0 |
| C01/Combat/8 | 2200 | 11402 | 11.27 | 0.021 | 188.3 | 69.7 | 258.2 | 1461.8 | 1343.8 |
| rally-short/Combat/8 | 100 | 1028 | 1.18 | 0.013 | 18.5 | 7.3 | 25.9 | 131.4 | 117.0 |
| rally-short/Combat/8 | 600 | 3045 | 3.74 | 0.019 | 63.3 | 24.8 | 85.8 | 420.0 | 369.0 |
| rally-short/Combat/8 | 1000 | 4387 | 5.26 | 0.020 | 90.2 | 32.4 | 118.6 | 625.2 | 694.4 |
| rally-long/Combat/8 | 100 | 1028 | 1.18 | 0.012 | 22.0 | 7.8 | 28.3 | 162.1 | 134.4 |
| rally-long/Combat/8 | 1800 | 8230 | 8.67 | 0.021 | 156.6 | 62.2 | 210.2 | 1227.0 | 907.5 |
| rally-long/Combat/8 | 3000 | 14177 | 13.53 | 0.020 | 226.5 | 96.7 | 337.8 | 1867.5 | 1576.4 |

## Measured bottleneck

`src/sim/race.js:digest` previously called `checksum(snapshot(s))`; `snapshot` contains the entire event history. `src/core/determinism.js:canonical` recursively creates mapped arrays, sorted-key signatures and nested joined strings before `hash` traverses the final full string. Snapshot construction itself is tiny relative to serialization and hashing. At late Long Rally, event canonical text is about13.53MB; traversal/string construction, not Canvas work, dominates periodic stalls.

The reference V8 sampling run estimates12,768.8ms in periodic native digest descendants, versus roughly3,129ms in other step descendants: about80% of sampled native-step time is digest work. AI is977.7ms, movement/other1161.9ms, derived attributes678.3ms, environment/condition136.0ms, geometry143.2ms, and consequences/combat/contact31.3ms. AI samples include combat candidate scoring; the consequences category is resolved contact/damage/attack processing, not all Combat-related work. These are sampled estimates for this workload, not exact instrumented subsystem timers, and explicit direct digest/checkpoint experiments are separately classified. The workload uses Push rather than forcing constant attacks; close-contact weapon/ram/defense/invalidation fixtures are separately checked.

The C01 eight-entrant Pure/Combat pair controls field, course, seed, weather and policy. At tick2200, Pure has9.57MB event text versus Combat11.27MB and whole digest medians222.2/258.2ms. Thus the Combat hitch includes more/different authoritative history; it is not evidence that attack range checks consume most CPU. Oval Pure4 vs Combat8 is confounded by field size and must not be used to isolate format cost.

## Inspected paths and disposition

- AI: `src/ai/driver.js:perceive/decide`, existing candidate order and cadence; unchanged.
- Movement/collision: `src/sim/race.js:step`, native subevent grouping, tile occupancy and reservations; unchanged.
- Geometry: `src/track/course.js:segmentAt/courseLocation/coursePoint`, existing immutable course access; unchanged.
- Resource integration: `src/sim/environment.js:integrateCondition`, `src/model/ru.js:derive`; unchanged.
- Combat/contact: `src/sim/consequences.js:eligibleCombat/resolveAttacks/queueImpact/flushImpacts`; unchanged.
- Events: `src/events/events.js:emit`, existing deep-cloned payloads and ordering; unchanged. ACTION_EXERTION receipts remain fully included.
- Presentation: `src/prototype/app.js` timing arrays and existing DOM guards; `view.js` geometry caching; `interactions.js` bounded effects/cursors; `commentary.js` incremental cursor. Normal drawing is much smaller than late periodic digest; no speculative viewer or scheduler rewrite was justified.

Full-state checkpoint packing/compression, wire hashing and cold restoration remain expensive but do not occur each native viewer interval in this in-memory prototype. Their format/limits are preserved. Event count is only a proxy: full nested payload size and repeated historical traversal determine cost.

## Limits and evidence

V8 CPU profiles include direct serialization/checkpoint experiments; only samples with a step ancestor support native-step percentages. Process heap values are point observations, not isolated main/worker peak memory or controlled GC measurements. Browser heap is approximate; no new worker exists. Managed headless frame intervals are quantized and host scheduling/GC vary. Two short phase observations are exploratory, not confidence bounds. Digest-aligned windows deliberately overrepresent digest boundaries; their long-frame rates are **not** whole-race average rates. See the separate complete-run observations and Frame-Pacing report. Windows Chrome/Edge and local-file acceptance require owner testing.

Commands: `BNT_P14_ROOT=/tmp/bnt-p14-reference BNT_P14_STAGE=baseline node scripts/p1-4/browser-profile.mjs`; the analogous `native-profile.mjs` with `--cpu-prof`; `cpu-summary.mjs <profile> <output>`; and `sustained.mjs`. Raw phase data, profiles, component samples, pilot disposition and exact commands/exits accompany delivery.
