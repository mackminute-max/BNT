# BNT M2-E4 — Stage 2 Test Evidence

## Frozen revision and environment

Tested runtime: `a07c3d2ef3a97d47f349440e0533706d24f4a50f`; branch `feat/m2-e-e4-persistence-recovery`. Application source and built HTML remained unchanged after this revision. Subsequent changes are evidence, documentation and development-only scripts.

Node 24.22.1; npm 11.9.0; esbuild 0.28.2; playwright-core 1.65.1; Chromium 156.0.8078.79; Linux managed environment with four available CPUs. No dependencies were installed or upgraded. Source ancestry to accepted Stage 1 and E3 was verified. The existing untracked audit was preserved.

The fresh pre-implementation baseline passed **512/512**, exit 0, in 470,338.304 ms. The final frozen-source configured suite passed **518/518**, fail 0, cancelled/skipped 0, exit 0, in 1,037,698.690 ms. These elapsed times were collected under different concurrent workloads and are not a controlled performance comparison.

## Commands and actual results

Paths in this table are relative to the repository unless stated otherwise. Historical-report-generating commands and existing browser runners ran in `/tmp/bnt-e4-stage2-verification`, a source/artifact copy, to preserve accepted evidence. Final application source/artifacts were copied into that directory before its final browser inventory.

| Command | Result | Raw exit |
|---|---|---:|
| `npm test` — baseline | 512 passed, 0 failed | 0 |
| `npm test` — frozen `a07c3d2` | 518 passed, 0 failed | 0 |
| `node --test tests/m2-e-e4-stage2.test.js` | Six focused groups passed, including inspected pending birth and premature clearance | 0 |
| `node scripts/m2-d/verify.mjs` | 12 historical references, five native adapters, five numeric golden cycles, two payroll replays | 0 |
| `node scripts/m2-e/e4/acceptance/references.mjs /tmp/bnt-e4-stage2-verification/docs/m2-d/evidence/implementation/verification.json` | Fresh references equal accepted records; retained payroll artifacts replayed | 0 |
| `node scripts/m2-e/e4/stage2-browser.mjs` with isolated final output directory | 9/9 UI/restore/fault groups, no page errors | 0 |
| `node scripts/m2-e/e4/stage2-files.mjs` | 3/3 visible download/file-chooser/legacy-export groups | 0 |
| `node scripts/m2-e/e4/stage2-reopen.mjs` | 2/2 browser-close/automatic scheduling/replay groups | 0 |
| `node scripts/m2-e/e4/stage1-faults.mjs` | 4/4 concurrency/migration/real-quota groups | 0 |
| `node scripts/m2-e/e4/stage1-browser.mjs` | 7/7 architecture groups, including retained full-field data; file navigation separately blocked | 0 |
| `node scripts/m2-e/e4/stage2-retained.mjs` | Final-source final-event publication, large complete backup, cold restore, 12 replays | 0 |
| `node scripts/m2-e/e4/stage2-quota.mjs` | Actual quota-denied checkpoint preserves both heads; same input succeeds after capacity restoration | 0 |
| `node scripts/m2-e/e4/stage2-timing.mjs` | Clean timing sample completed | 0 |
| `npm run build` | Repeated build byte-identical; external-dependency guard passed | 0 |
| `node scripts/m2-e/e4/stage2-validate-evidence.mjs` | Assertions over completed capacity, reference, quota, UI and Node evidence | 0 |

`stage2-capacity.mjs` was executed for the live eight-entrant twelve-event fixture, four-entrant two-event fixture and eight-entrant Long Combat Rally. Their complete structured results contain no fatal/page errors, valid terminal phases and verified replays. Original raw process exits were not retained when tool sessions expired during interruption; **no recorded zero exit is claimed for those three processes**. The separate evidence-validation command above exited 0. The two preflight Long Rally configurations (track seeds 145 and 1) also completed before integration; they are capacity diagnostics, not additional live championships.

The live large runs began on earlier Stage 2 candidates. They are not labeled as fresh twelve-event executions on the final SHA. Final-source testing separately validates/publishes/restores/replays the entire retained full-field set and runs the corrected ordinary UI workflow. This is an explicit coverage limitation.

## Existing browser inventory — final source

All 14 accepted browser/clock runners executed. **Three exited 0; eleven exited 1. The complete browser inventory is not reported as passing.**

| Script | Exit | Disposition |
|---|---:|---|
| `scripts/m2-d/browser.mjs` | 1 | 14 functional HTTP groups; managed file launch blocked |
| `scripts/m2-c/browser.mjs` | 1 | 20 functional HTTP groups; file blocked |
| `scripts/m2-b-browser.mjs` | 1 | 13 functional HTTP groups; file blocked |
| `scripts/m2-a-browser.mjs` | 1 | 12 functional HTTP groups; file blocked |
| `scripts/persistence-browser.mjs` | 1 | 18 functional HTTP groups; file blocked |
| `scripts/browser-test.mjs` | 1 | 23 functional HTTP groups; file blocked |
| `scripts/track-expansion/browser.mjs` | 0 | 10 functional groups; separately records blocked file attempt |
| `scripts/circuit-rally/browser.mjs` | 1 | Known obsolete preset selector; only oval group completed; not modified |
| `scripts/combat-ai-refinement/browser.mjs` | 0 | 7 functional groups; separately records file limitation |
| `scripts/m2-e/browser.mjs` | 1 | 10 functional groups; file blocked |
| `scripts/m2-e/e2-e3-browser.mjs` | 1 | 8 functional groups; file blocked |
| `scripts/m2-e/e3-completion-browser.mjs` | 1 | 7 functional groups; file blocked |
| `scripts/m2-e/championship-clock-parity.mjs` | 0 | Versioned clock and three complete native races match Node |
| `scripts/m2-e/clock-parity.mjs` | 1 | Existing legacy numeric diagnostic: next incident 313.0384349330031 vs 313.03843493300315 |

No obsolete runner or legacy expected checksum was altered. Raw logs, process exits and functional-group summaries are retained in `evidence/browser-inventory-final/`. HTTP success does not substitute for Windows file acceptance.

## Determinism

All 12 historical references compare exactly with accepted evidence. Payroll replay checksums remain Pure `ad509187` and Combat `f191ca35`. Versioned championship-clock results match across 100 initial states and three complete races: Oval Pure `a74e4f71`, C01 Combat `005252df`, mixed Rally Combat `069e4340`.

The twelve-event live and final retained/restored sets reproduce the accepted championship references:

| Event | Checksum | Event | Checksum |
|---|---|---|---|
| 1 | `21d66ebd` | 7 | `e7f766c9` |
| 2 | `4ab34797` | 8 | `8748547c` |
| 3 | `673e5fd0` | 9 | `13466edf` |
| 4 | `67240955` | 10 | `f86a8fc5` |
| 5 | `9877754d` | 11 | `02f4b543` |
| 6 | `24dcb7d5` | 12 | `964e1d49` |

The long seed-145 Rally has an **inherited cross-runtime difference**. The original Node reference remains `3cc91b8c`. Independently executing the exact saved setup in the accepted Stage 1 HTML and current uninterrupted HTML produces `aebb513e` in Chromium, equal to the checkpointed browser race. All reach tick 4527 with 5962 events. `stage2-long-parity.mjs` reproduces this comparison. No Node golden was overwritten; the browser control is explicitly distinguished in the capacity script. This limitation is not a new checkpoint outcome change, but universal cross-browser/Node compatibility is not established.

## Checkpoints, publication and recovery

New tests verify latest periodic checkpoint plus verified birth fallback and complete journal, corruption recovery, identical uninterrupted/checkpointed native state, duplicate/conflicting input IDs, missing journal rejection, corrupt/incompatible backups, wrong ownership, session retention, runtime states and active-race clearance rejection.

Three additional file-UI groups read a real headless download (991,482 bytes), select that JSON through the actual file input, confirm restoration at tick 25/generation 5, and verify the distinct career-only export warning. This tests the small-file UI path, not Windows disk durability or the large-container file chooser.

The nine browser groups cover explicit normal UI migration/start, paused Sign ordering and reload, complete backup roundtrip and interrupted staging, quota failure during restore activation, lost restore acknowledgment, failed imports leaving authority intact, exact checkpoint repair, cold-destination previous generation, lost native-input acknowledgment and exactly-once official publication. The restarted browser retains tick 50, paused state, speed 16 and cadence 25; its queued Sign survives closure and its completed replay checksum is `61144d60`.

Original Stage 1 browser tests additionally exercise transaction abort, expected-generation/read-set conflict, concurrent writers, migration witness interruption, immutable cache behavior, worker failure, native prepare before career commit, official lost acknowledgment, D2/standings/financial-history parity and untrusted cold-load rejection.

Intermediate defects were found and corrected: repaired-head fallback validation, premature clearance, misleading already-published recovery status, and session cache poisoning after inspection before birth. The last defect was reproduced in a focused test and the ordinary UI rerun passed after correction. Earlier Playwright timeout-argument misuse and overlapping diagnostic output directories were also corrected in development scripts. Superseded/interrupted runs are not counted as final passing suites.

## Capacity and measured latency

All live fixtures use frozen E3 development configuration, Clear weather, existing eight-RU mechanics and unchanged provisional rules. The twelve-event schedule alternates Pure/Combat over Oval, C01 and mixed-terrain Rally. It is a capacity/regression workload, not a balance study or all-track/all-weather matrix.

| Workload | Observations |
|---|---|
| One entrant, short championship | Actual UI checkpoint/restart/full-race publication and replay |
| Four entrants, two events | Reached `SETTLEMENT_PENDING`; 4,153,340-byte backup; two replays |
| Eight entrants, twelve events | All 12 native events published, 24 advance batches at 1000 ticks, 13 retained records, pending settlement |
| Eight entrants, Long Combat Rally | 51 segments; track seed 145; 4527 ticks; 46 batches at cadence 100; pending settlement; replay exact within Chromium |
| Final-source large retained fixture | Final publication, 60,528,192-byte complete backup, cold restore and all twelve replays |

Live twelve-event values total 29,967,534 bytes (30,307,461 with outer JSON encoding); the career envelope is 2,247,239 bytes. Largest logical record is 4,886,550 bytes. Complete backup is 60,538,346 bytes. Reported IndexedDB usage is 60,026,880 bytes, including previous generation and retained metadata. Long Rally's largest record is 7,025,307 bytes; backup 15,607,193 bytes; reported usage 15,511,552 bytes. All remain within the unchanged 8,388,608-byte domain-record bound. The separate retained-plus-restored diagnostic used 210,575,360 bytes across both databases and staged imports; this is not ordinary per-championship usage.

The clean small sample measures different stages separately:

| Operation | Worker preparation ms | Durable commit ms | Total acknowledgment ms |
|---|---:|---:|---:|
| Start | 1392.3 | 18.7 | 1427.4 |
| Birth | 1439.5 | 16.6 | 1468.2 |
| 25-tick checkpoint | 432.5 | 16.4 | 462.1 |
| Playback metadata | 8.7 | 18.6 | 37.6 |

Warm inspection took 23.5 ms. No main-thread task at least 50 ms was observed in this small sample. Timing instrumentation is not a hard upper-bound proof.

Under concurrent verification load, the twelve-event operations totaled 2291.388 seconds. Event publication ranged 6.981–117.463 seconds; event 12 publication took 62.385 seconds. The Long Rally totaled 2864.481 seconds before backup, with advance acknowledgment median 56.258 seconds and maximum 183.465 seconds. Its 46 advances spent 2778.735 seconds in reported worker preparation versus 2796.243 seconds total acknowledgment. Large-workload processing remains expensive.

Observed main-thread task maxima: four-entrant fixture 2417 ms, twelve-event fixture 1518 ms, Long Rally 1392 ms. The preferred 100 ms target is **not met for large data**. Accepted Gate A reported a 12,245 ms four-entrant publication task; that and these measurements differ in load, operation and checkpoint representation, so no controlled speedup percentage is claimed. Worker relocation avoids the earlier multi-second domain work running directly in UI handlers, but whole-generation transfer/serialization still blocks.

Reported page-heap samples peaked at 200,512,986 bytes in the twelve-event run. These are sampled Chromium heap readings, not a measured global peak including every worker/process. Large retained-fixture operations took 225.803 s load, 317.596 s combined two-phase publication, 243.729 s backup and 236.139 s restore under concurrent load. That diagnostic used a 600 s worker timeout; normal default remains 300 s per worker request. Combined publication time is not one worker request.

## Quota and bounds

The corrected Stage 1 cold-origin quota test passes unchanged, preserving prior native quota/transaction-abort assertions. New actual gameplay testing applies a 4 MiB override before origin access, fills a separate non-authoritative pressure database, and receives `QuotaExceededError` on checkpoint `quota-input-0`. Current and previous snapshots remain byte-identical at generation 3/tick 0. After removing only diagnostic pressure, raising the test quota and respecting Chromium's approximately 30-second cached allowance, the same input commits at generation 4/tick 25.

An initial 500,000-byte test allowance denied bootstrap before the intended checkpoint experiment; that failed diagnostic is retained and was not treated as success. Increasing the experimental allowance to 4 MiB permits bootstrap and still requires actual native quota denial and exact rollback assertions. This does not change application bounds. Browser `storage.estimate()` can differ from the CDP override; estimates are never treated as guarantees. The reported 50 MiB CDP sample in the final quota artifact is taken after test capacity restoration, not at the initial denial.

## Standalone and limitations

Both HTML files are byte-identical, **1,042,502 bytes**, SHA-256 **`79a99ed587cef45c47f911bf59caf50c9f73bb9abb84f2f9fba2de6c73997ab5`**. Rebuilding the frozen source reproduces that hash. The esbuild external-dependency guard passes; application and Blob worker are embedded with no runtime server, CDN or adjacent assets.

Managed `file://` navigation returns `ERR_BLOCKED_BY_ADMINISTRATOR`. Windows owner acceptance of Stage 1 is acknowledged, but the new complete E4 build has not received owner acceptance. Follow [WINDOWS_ACCEPTANCE.md](WINDOWS_ACCEPTANCE.md).

Maximum-field live timings are single observations under concurrent verification, not controlled latency distributions. No Firefox/Edge/Windows execution was available here. Full from-scratch final-SHA twelve-event repetition was not performed; final retained-set/restore/replay coverage is separate and explicit. Cross-runtime numeric limits and maximum-field responsiveness remain review items. No E5/E6 or later development was undertaken.
