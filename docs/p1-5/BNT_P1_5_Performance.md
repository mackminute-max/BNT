# BNT P1.5 — Performance Evidence

## Result and measurement boundaries

Buffered Worker playback substantially reduces the observed digest-related presentation hitches. It does not make native digests cheaper, solve all Worker history growth, or establish universally hitch-free playback.

Environment: managed Linux x86_64, Node 24.22.1, Chromium 156.0.8078.79, five reported logical CPUs, headless 1440×1000 viewport. Fixed seed 145, Clear weather, tactical pacing, two laps where applicable. Measurements ran sequentially without the correctness suite running concurrently. These are single observations per phase/speed, not confidence intervals or Windows/Edge acceptance.

`performance-final.json` contains 162 windows: six scenarios × three stages × three speeds × three modes; 1,600 ms nominal observation each. All modes start from the same existing native checkpoint at each stage. Checkpoints were generated in Node and restored identically into all three Chromium paths; this is not a cross-runtime equivalence assertion. Native CP ticks: Oval 98/798/1398; Circuit 98/998/2198; Short Rally 98/598/998; Long Rally 98/1798/2998. Preparation and Worker initial refill are excluded from the frame window and recorded separately. Reference is P1.4 `3b0d043`; window candidate is `636e5d3`, artifact SHA-256 `45d8fdcfc35c153bf49646589e5be99f9f0ab9f13d352ea601fb5c18e87ced48`.

The final runtime `5d556f3` adds exact-time/stale-reference command checks, pause/step acknowledgment guards and preservation of a valid delay after rejected replacements. Those changes do not alter the measured ordinary command schedule. Final-runtime complete Worker races and functional regressions were rerun; do not mistake every earlier window for a final-revision run. `performance-windows.json` is a separately retained initial-development observation, not mixed into the tables below; its checkpoint-preparation lead statistic included an initial-time offset and must not be treated as actual lead.

## Aggregate frame intervals

A merged percentile can hide a single periodic hitch; phase-specific results follow. All values are milliseconds. Counts use strict `>` thresholds.

| Mode | Frames | Median | p95 | p99 | Worst | >33.3 | >50 | >100 | >200 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| reference | 5293 | 16.7 | 16.8 | 33.3 | 133.4 | 53 | 20 | 5 | 0 |
| worker | 5481 | 16.7 | 16.8 | 16.8 | 116.6 | 33 | 6 | 1 | 0 |
| sync | 5241 | 16.7 | 16.8 | 49.9 | 133.3 | 77 | 38 | 6 | 0 |

The final window set includes one 116.6 ms Worker frame interval (late Long Rally, 2×). There was no matching reported main-thread long task or buffer underrun in that window. Its cause is unestablished; it is retained, not filtered or attributed to GC without evidence. Occasional managed-browser scheduling/rendering delays remain.

## Complete phase/speed matrix

Each cell is that observation's p99; intervals are in ms. `oval` is the catalog's Standard Oval. Sync means the explicitly selectable P1.4-style synchronous path in the P1.5 UI, not a separate simulation policy.

| Course / format / field | Stage | Speed | P1.4 p99 | Worker p99 | P1.5 sync p99 | Worker underruns |
|---|---|---:|---:|---:|---:|---:|
| oval / Pure / 4 | early | 1× | 16.8 | 33.4 | 66.7 | 0 |
| oval / Pure / 4 | early | 2× | 16.8 | 16.8 | 116.8 | 0 |
| oval / Pure / 4 | early | 4× | 16.8 | 33.3 | 33.4 | 0 |
| oval / Pure / 4 | middle | 1× | 16.8 | 33.3 | 16.8 | 0 |
| oval / Pure / 4 | middle | 2× | 16.8 | 50.0 | 16.8 | 0 |
| oval / Pure / 4 | middle | 4× | 33.3 | 50.0 | 50.1 | 0 |
| oval / Pure / 4 | late | 1× | 16.8 | 50.0 | 83.4 | 0 |
| oval / Pure / 4 | late | 2× | 16.8 | 16.8 | 83.4 | 0 |
| oval / Pure / 4 | late | 4× | 16.8 | 50.0 | 66.7 | 0 |
| oval / Combat / 8 | early | 1× | 33.3 | 50.1 | 66.7 | 0 |
| oval / Combat / 8 | early | 2× | 16.8 | 16.8 | 66.7 | 0 |
| oval / Combat / 8 | early | 4× | 16.8 | 16.8 | 66.7 | 0 |
| oval / Combat / 8 | middle | 1× | 33.3 | 16.8 | 49.9 | 0 |
| oval / Combat / 8 | middle | 2× | 16.8 | 16.8 | 33.4 | 0 |
| oval / Combat / 8 | middle | 4× | 66.6 | 16.8 | 33.3 | 0 |
| oval / Combat / 8 | late | 1× | 50.0 | 16.8 | 66.7 | 0 |
| oval / Combat / 8 | late | 2× | 50.0 | 16.8 | 66.6 | 0 |
| oval / Combat / 8 | late | 4× | 66.7 | 16.8 | 83.3 | 0 |
| C01 / Pure / 8 | early | 1× | 16.8 | 50.0 | 66.6 | 0 |
| C01 / Pure / 8 | early | 2× | 16.8 | 16.8 | 33.3 | 0 |
| C01 / Pure / 8 | early | 4× | 16.8 | 16.8 | 33.3 | 0 |
| C01 / Pure / 8 | middle | 1× | 33.4 | 16.8 | 50.0 | 0 |
| C01 / Pure / 8 | middle | 2× | 33.2 | 16.8 | 66.6 | 0 |
| C01 / Pure / 8 | middle | 4× | 33.4 | 16.8 | 50.0 | 0 |
| C01 / Pure / 8 | late | 1× | 83.3 | 16.8 | 100.0 | 0 |
| C01 / Pure / 8 | late | 2× | 83.3 | 16.8 | 83.3 | 0 |
| C01 / Pure / 8 | late | 4× | 83.4 | 16.8 | 83.3 | 0 |
| C01 / Combat / 8 | early | 1× | 33.4 | 16.8 | 16.8 | 0 |
| C01 / Combat / 8 | early | 2× | 33.3 | 33.3 | 83.4 | 0 |
| C01 / Combat / 8 | early | 4× | 16.8 | 50.0 | 33.2 | 0 |
| C01 / Combat / 8 | middle | 1× | 49.9 | 16.8 | 50.0 | 0 |
| C01 / Combat / 8 | middle | 2× | 50.0 | 16.8 | 50.1 | 0 |
| C01 / Combat / 8 | middle | 4× | 66.7 | 16.8 | 50.1 | 0 |
| C01 / Combat / 8 | late | 1× | 100.0 | 16.8 | 100.0 | 0 |
| C01 / Combat / 8 | late | 2× | 99.9 | 16.8 | 116.7 | 0 |
| C01 / Combat / 8 | late | 4× | 133.4 | 16.8 | 100.0 | 0 |
| rally-short / Combat / 8 | early | 1× | 16.8 | 16.8 | 33.3 | 0 |
| rally-short / Combat / 8 | early | 2× | 16.8 | 33.4 | 50.0 | 0 |
| rally-short / Combat / 8 | early | 4× | 33.3 | 66.6 | 16.8 | 0 |
| rally-short / Combat / 8 | middle | 1× | 33.3 | 33.4 | 33.4 | 0 |
| rally-short / Combat / 8 | middle | 2× | 50.0 | 16.8 | 33.3 | 0 |
| rally-short / Combat / 8 | middle | 4× | 33.4 | 16.8 | 66.8 | 0 |
| rally-short / Combat / 8 | late | 1× | 50.0 | 16.8 | 49.9 | 0 |
| rally-short / Combat / 8 | late | 2× | 50.0 | 50.0 | 33.3 | 0 |
| rally-short / Combat / 8 | late | 4× | 50.0 | 16.8 | 50.0 | 0 |
| rally-long / Combat / 8 | early | 1× | 33.4 | 16.8 | 50.0 | 0 |
| rally-long / Combat / 8 | early | 2× | 33.3 | 16.8 | 16.8 | 0 |
| rally-long / Combat / 8 | early | 4× | 50.0 | 49.9 | 16.8 | 0 |
| rally-long / Combat / 8 | middle | 1× | 66.6 | 16.8 | 66.6 | 0 |
| rally-long / Combat / 8 | middle | 2× | 83.3 | 16.8 | 83.4 | 0 |
| rally-long / Combat / 8 | middle | 4× | 83.3 | 16.8 | 83.4 | 0 |
| rally-long / Combat / 8 | late | 1× | 116.6 | 16.8 | 116.6 | 0 |
| rally-long / Combat / 8 | late | 2× | 116.6 | 116.6 | 116.7 | 0 |
| rally-long / Combat / 8 | late | 4× | 116.7 | 16.8 | 133.3 | 0 |

## Complete 4× races

P1.4 reference and P1.5 sync rows come from `sustained.json` (candidate runtime `f8cf64a`, before later input/control hardening). Worker rows below are final `5d556f3` in `sustained-underrun-trace-final.json`, with a read-only trace around presentation/receipt. The earlier `f36edc6` repeat remains separately retained. All start from fresh browser-native setup, with Push queued before Start. They have matching full classification and checksum within Chromium. Node/Chromium numerical portability is not inferred.

Worker wall time includes the three-second countdown; synchronous modes do not have it. Comparing these wall times without that distinction would be misleading. These are ordinary complete viewer runs, not diagnostic teleports to late checkpoints.

| Course | Mode | Tick | Checksum | Wall ms | p99 ms | Worst ms | >50 | >100 | Reported page heap peak MiB |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|
| C01 | reference | 3260 | `51624d65` | 41154.7 | 50.0 | 150.1 | 23 | 10 | 31.76 |
| C01 | worker | 3260 | `51624d65` | 43893.9 | 16.8 | 16.8 | 0 | 0 | 20.30 |
| C01 | sync | 3260 | `51624d65` | 41108.8 | 50.0 | 149.9 | 23 | 11 | 31.16 |
| rally-long | reference | 4544 | `c5095aaa` | 57253.2 | 66.7 | 183.3 | 35 | 19 | 50.87 |
| rally-long | worker | 4544 | `c5095aaa` | 59979.2 | 16.8 | 49.9 | 0 | 0 | 17.50 |
| rally-long | sync | 4544 | `c5095aaa` | 57209.2 | 66.7 | 200.1 | 35 | 20 | 50.32 |

## Buffer, computation and communication

Final window observations: actual maximum lead approximately 1.0 native second (hard configured maximum 2.0), maximum 21 stored presentation frames and 269 pending events. There were zero window underruns and zero protocol/page errors. This demonstrates bounded default operation on these fixtures; configured bounds still reject safely under overflow tests.

Final complete Worker observations:

| Course | Underruns | Reported refill wait ms | Largest native tick ms | Cumulative Worker postMessage call ms | Worker output messages | Estimated JSON output bytes |
|---|---:|---:|---:|---:|---:|---:|
| C01 | 1 | 0.0 | 153.9 | 161.4 | 6406 | 26582673 |
| rally-long | 1 | 50.0 | 169.3 | 216.3 | 8895 | 37188224 |

The complete races each reported one short hold. Refill wait is accumulated at animation-frame resolution, not an exact kernel-level stall timer. Terminal native evidence may arrive before its expensive clearance/digest reply; presentation correctly refuses to expose that terminal frame until authoritative completion exists. The final trace independently timestamps the cause: Circuit held at presented tick 3259 with terminal head 3260, completion unknown, then received completion 4.7 ms later. Long Rally held at 4543 with terminal head 4544, then received completion 53.0 ms later. Both changed buffering→finished only after the authoritative reply. Thus these two complete-race holds are terminal-clearance waits, not missing events or invented future states. Circuit's sub-frame hold correctly quantizes to 0 ms in the RAF refill counter; Rally reports 50 ms. This trace does not establish a cause for the separate 116.6 ms window outlier.

Native tick time includes any digest performed inside that tick; it is not a standalone hash benchmark. Digest cadence and full native history remain unchanged. The main thread receives compact event/frame messages, rather than performing the digest. JSON byte counts estimate a representation; they are not measured structured-clone wire bytes. Worker `postMessage` timing measures the call/serialization side, and main receive timing measures validation/insertion, not native computation. Cross-context delivery latency includes scheduling delay. Raw samples are retained in each observation.

The deprecated Chromium `performance.memory` values are approximate page-reported JS heap high-water samples. They do not measure total process RSS, GPU allocation, or an independently isolated peak Worker heap. Repeated diagnostic checkpoint restores inflate short-window heap readings; complete fresh-race readings are more representative. No claim of zero Worker memory or a proven total-memory reduction is made.

## Remaining limitations and reproduction

- No universal 60 fps or zero-stall claim; the window outlier and short full-race holds remain disclosed.
- Worker native history/digest work still grows with race length. This is separation, not evidence deletion or a new approximate engine.
- Direct-file execution is blocked by managed policy here; final Windows Chrome/Edge testing is pending.
- One run per case/phase/speed provides engineering evidence, not broad statistical or device coverage.
- Runtime worker crashes stop the unfinished race; automatic persistent recovery remains out of scope.

Reproduce: freeze final P1.4 into `/tmp/bnt-p15-reference` with its dependencies available; run `node scripts/p1-5/fixtures.mjs`, `npm run build:p1-5`, `node scripts/p1-5/browser-performance.mjs`, and `node scripts/p1-5/sustained.mjs`. `BNT_P15_MODES=worker BNT_P15_REPORT=sustained-underrun-trace-final.json` selects the final Worker-only repeat. Keep performance measurements separate from heavy correctness jobs. Fixture hashes and raw command exits accompany the delivery.

## Measured command acknowledgment

Controlled final complete-race observations, pre-start Push queued once:

| Course | Acceptance acknowledgment ms | Native activation acknowledgment ms | Presented activation ms |
|---|---:|---:|---:|
| C01 | 2.1 | 119.4 | 3123.0 |
| rally-long | 3.0 | 80.6 | 3109.0 |

Presented activation deliberately includes the three-second countdown. Native activation acknowledgment may precede visible activation; UI diagnostics label that distinction. The separately injected browser delay-window fixture accepted at tick 20 and activated at natural tick 20, becoming visible at sample 21, with one opportunity spent. Its wall timing was collected during correctness verification and is not used as a controlled frame-pacing benchmark.
