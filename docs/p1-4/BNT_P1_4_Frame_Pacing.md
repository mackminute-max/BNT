# BNT P1.4 — Frame-Pacing Results

## Method and scope

Reference and final candidate each have108 controlled observations: six course/format/field combinations × early/middle/late ×1×/2×/4× ×two repeats. Seed145, Clear, P1.3 tactical, native pre-start Push, two closed-loop laps. Each1600-ms observation restores the same validated native phase state before timing. Metrics reset before Start, retaining the first digest. Phases align at tick98 modulo100; Oval uses98/798/1398, C01 uses98/998/2198, Short Rally98/598/998, Long Rally98/1798/2998. All final108 windows in each run include a periodic digest. No regression or other benchmark jobs run concurrently with these final observations.

Quantiles use sorted[floor(n×p)], capped to n−1; median denotes p50 under that convention. Tables pool the two raw frame windows for each group. Values are milliseconds, threshold counts are strict greater-than, and each cell is **reference → final**. Frame intervals are distinct from native tick/digest CPU timings. Actual durations/start/end ticks and raw samples are retained. These deliberately digest-aligned stress windows overrepresent checkpoint boundaries; their pooled rates are not average whole-race rates. Managed headless Chromium156.0.8078.79 and two repeats do not establish Windows performance or statistical confidence bounds.

## Principal complete-playback result

One complete ordinary eight-entrant C01 Combat race at4× per implementation, without mid-race benchmark restoration:

| Measure | Before → after |
|---|---|
| Median | 16.7 → 16.7 |
| p95 | 16.8 → 16.8 |
| p99 | 133.4 → 50.1 |
| Worst | 316.7 → 150.0 |
| Frames >33.3ms | 38 → 29 |
| Frames >50ms | 30 → 24 |
| Frames >100ms | 25 → 12 |
| Frames >200ms | 13 → 0 |
| Measured frames | 2161 → 2325 |
| Full race wall time | 41.114 → 40.995 s |
| Peak sampled simulation debt | 0.9276 → 0.0664 native s |
| Sampled JS heap high-water | 134.2 → 33.7 MB |

Both runs end with checksum `51624d65` and exactly matching full-precision classification/times. Wall time is practically unchanged: this is smoother execution, not changed racing speed. Median/p95 remain about60Hz; the improvement is in rare long frames. Over50ms count falls20%, over100ms count52%, and observed over200ms frames13→0. This is one paired complete race, not a guarantee that every device/race eliminates200ms stalls. Heap is a sampled approximate Chromium JS-heap proxy, not a true in-call allocation peak or total OS memory measurement.

Per-quarter maximum debt is0.1492/0.0652/0.0632/0.9276 native seconds before, versus0.0664/0.0648/0.0632/0.0616 after. This run shows no progressively growing candidate backlog. The unchanged scheduler retains whole ticks and owed time; no tick dropping or digest skipping conceals work. A terminal residual accumulator is not unfinished racing after native Ended.

## All tested groups

`N` is frame count. `D max` is maximum digest-call CPU time. `Debt` is maximum end-of-window accumulator over the two repeats, in native seconds. It is not the same as peak within-window debt (retained in summary.json).

### oval / Pure

| Phase/speed | N | Median | p95 | p99 | Worst | >33.3 | >50 | >100 | >200 | D max | Debt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| early 1× | 202→201 | 16.7 → 16.7 | 16.8 → 16.8 | 16.8 → 16.8 | 16.8 → 16.8 | 0→0 | 0→0 | 0→0 | 0→0 | 6.8 → 4.5 | 0.033 → 0.033 |
| early 2× | 201→200 | 16.7 → 16.7 | 16.7 → 16.7 | 16.8 → 16.8 | 16.8 → 16.8 | 0→0 | 0→0 | 0→0 | 0→0 | 8.0 → 3.8 | 0.033 → 0.033 |
| early 4× | 200→202 | 16.7 → 16.7 | 16.8 → 16.8 | 16.8 → 16.8 | 16.8 → 16.8 | 0→0 | 0→0 | 0→0 | 0→0 | 7.0 → 4.4 | 0.016 → 0.033 |
| middle 1× | 200→200 | 16.7 → 16.7 | 16.8 → 16.8 | 16.8 → 16.8 | 16.8 → 16.8 | 0→0 | 0→0 | 0→0 | 0→0 | 18.8 → 12.0 | 0.017 → 0.017 |
| middle 2× | 200→200 | 16.7 → 16.7 | 16.7 → 16.7 | 16.8 → 16.8 | 16.8 → 16.8 | 0→0 | 0→0 | 0→0 | 0→0 | 18.6 → 10.3 | 0.033 → 0.033 |
| middle 4× | 200→200 | 16.7 → 16.7 | 16.8 → 16.8 | 16.8 → 16.8 | 16.8 → 16.8 | 0→0 | 0→0 | 0→0 | 0→0 | 21.4 → 15.8 | 0.017 → 0.016 |
| late 1× | 199→200 | 16.7 → 16.7 | 16.7 → 16.7 | 16.8 → 16.8 | 33.4 → 16.8 | 1→0 | 0→0 | 0→0 | 0→0 | 32.4 → 18.3 | 0.017 → 0.017 |
| late 2× | 198→200 | 16.7 → 16.7 | 16.8 → 16.7 | 33.2 → 16.8 | 33.3 → 16.8 | 0→0 | 0→0 | 0→0 | 0→0 | 32.4 → 19.8 | 0.033 → 0.033 |
| late 4× | 199→200 | 16.7 → 16.7 | 16.8 → 16.7 | 33.3 → 16.8 | 33.4 → 16.8 | 1→0 | 0→0 | 0→0 | 0→0 | 34.5 → 20.9 | 0.017 → 0.017 |

### oval / Combat

| Phase/speed | N | Median | p95 | p99 | Worst | >33.3 | >50 | >100 | >200 | D max | Debt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| early 1× | 203→200 | 16.7 → 16.7 | 16.7 → 16.8 | 16.8 → 16.8 | 16.8 → 16.8 | 0→0 | 0→0 | 0→0 | 0→0 | 27.2 → 14.1 | 0.033 → 0.017 |
| early 2× | 200→200 | 16.7 → 16.7 | 16.7 → 16.8 | 16.8 → 16.8 | 16.8 → 16.8 | 0→0 | 0→0 | 0→0 | 0→0 | 27.4 → 18.5 | 0.033 → 0.033 |
| early 4× | 198→200 | 16.7 → 16.7 | 16.7 → 16.7 | 33.3 → 16.8 | 50.0 → 16.8 | 1→0 | 0→0 | 0→0 | 0→0 | 46.0 → 20.6 | 0.033 → 0.016 |
| middle 1× | 194→197 | 16.7 → 16.7 | 16.8 → 16.8 | 66.7 → 33.3 | 66.8 → 33.4 | 2→2 | 2→0 | 0→0 | 0→0 | 74.7 → 40.2 | 0.017 → 0.017 |
| middle 2× | 194→195 | 16.7 → 16.7 | 16.8 → 16.8 | 66.6 → 50.0 | 66.7 → 66.7 | 2→2 | 2→1 | 0→0 | 0→0 | 78.1 → 64.7 | 0.033 → 0.033 |
| middle 4× | 186→194 | 16.7 → 16.7 | 16.7 → 16.7 | 83.4 → 50.0 | 83.4 → 50.1 | 4→4 | 4→1 | 0→0 | 0→0 | 89.3 → 51.1 | 0.016 → 0.016 |
| late 1× | 190→196 | 16.7 → 16.7 | 16.8 → 16.8 | 100.0 → 50.0 | 116.7 → 66.6 | 2→3 | 2→1 | 1→0 | 0→0 | 116.8 → 63.4 | 0.017 → 0.033 |
| late 2× | 188→194 | 16.7 → 16.7 | 16.8 → 16.8 | 116.6 → 50.0 | 116.7 → 66.7 | 2→3 | 2→1 | 2→0 | 0→0 | 122.1 → 65.6 | 0.033 → 0.033 |
| late 4× | 177→191 | 16.7 → 16.7 | 16.8 → 16.7 | 116.6 → 66.7 | 116.7 → 66.7 | 4→4 | 4→2 | 3→0 | 0→0 | 122.4 → 68.1 | 0.016 → 0.017 |

### C01 / Pure

| Phase/speed | N | Median | p95 | p99 | Worst | >33.3 | >50 | >100 | >200 | D max | Debt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| early 1× | 202→199 | 16.7 → 16.7 | 16.8 → 16.8 | 16.8 → 16.8 | 33.4 → 33.3 | 1→1 | 0→0 | 0→0 | 0→0 | 25.1 → 11.4 | 0.033 → 0.017 |
| early 2× | 201→201 | 16.7 → 16.7 | 16.7 → 16.8 | 16.8 → 16.8 | 16.8 → 33.3 | 0→1 | 0→0 | 0→0 | 0→0 | 23.3 → 13.1 | 0.033 → 0.017 |
| early 4× | 198→199 | 16.7 → 16.7 | 16.8 → 16.8 | 33.2 → 16.8 | 33.4 → 50.0 | 1→1 | 0→0 | 0→0 | 0→0 | 31.9 → 17.7 | 0.017 → 0.033 |
| middle 1× | 192→198 | 16.7 → 16.7 | 16.8 → 16.7 | 83.3 → 33.3 | 99.9 → 33.3 | 4→2 | 2→0 | 0→0 | 0→0 | 90.4 → 43.7 | 0.033 → 0.017 |
| middle 2× | 192→199 | 16.7 → 16.7 | 16.7 → 16.8 | 83.3 → 33.4 | 83.4 → 33.4 | 2→4 | 2→0 | 0→0 | 0→0 | 87.2 → 45.8 | 0.033 → 0.033 |
| middle 4× | 184→193 | 16.7 → 16.7 | 16.8 → 16.8 | 83.4 → 50.0 | 100.0 → 50.1 | 6→4 | 5→1 | 0→0 | 0→0 | 96.5 → 59.5 | 0.033 → 0.017 |
| late 1× | 181→193 | 16.7 → 16.7 | 16.8 → 16.7 | 183.3 → 83.3 | 200.1 → 83.4 | 2→2 | 2→2 | 2→0 | 1→0 | 205.9 → 92.8 | 0.033 → 0.017 |
| late 2× | 184→191 | 16.7 → 16.7 | 16.8 → 16.8 | 166.6 → 83.4 | 166.6 → 100.0 | 2→4 | 2→2 | 2→0 | 0→0 | 174.3 → 109.2 | 0.033 → 0.050 |
| late 4× | 162→184 | 16.7 → 16.7 | 16.8 → 16.8 | 166.7 → 83.3 | 166.7 → 100.1 | 6→5 | 4→4 | 4→1 | 0→0 | 169.2 → 99.2 | 0.016 → 0.033 |

### C01 / Combat

| Phase/speed | N | Median | p95 | p99 | Worst | >33.3 | >50 | >100 | >200 | D max | Debt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| early 1× | 201→199 | 16.7 → 16.7 | 16.8 → 16.7 | 16.8 → 16.8 | 33.3 → 50.0 | 1→1 | 0→0 | 0→0 | 0→0 | 23.2 → 18.1 | 0.033 → 0.033 |
| early 2× | 200→204 | 16.7 → 16.7 | 16.8 → 16.8 | 16.8 → 16.8 | 33.3 → 50.0 | 0→1 | 0→0 | 0→0 | 0→0 | 35.1 → 19.3 | 0.033 → 0.017 |
| early 4× | 195→202 | 16.7 → 16.7 | 16.8 → 16.7 | 33.4 → 16.8 | 49.9 → 16.8 | 3→0 | 0→0 | 0→0 | 0→0 | 35.5 → 22.3 | 0.016 → 0.017 |
| middle 1× | 191→194 | 16.7 → 16.7 | 16.7 → 16.8 | 100.0 → 50.0 | 100.0 → 50.1 | 3→3 | 2→1 | 0→0 | 0→0 | 103.0 → 61.3 | 0.033 → 0.033 |
| middle 2× | 190→195 | 16.7 → 16.7 | 16.8 → 16.8 | 99.9 → 50.0 | 133.3 → 50.1 | 4→5 | 2→1 | 1→0 | 0→0 | 116.8 → 62.0 | 0.050 → 0.017 |
| middle 4× | 178→193 | 16.7 → 16.7 | 16.8 → 16.8 | 100.0 → 50.1 | 116.7 → 66.6 | 5→4 | 4→2 | 1→0 | 0→0 | 117.5 → 67.6 | 0.017 → 0.033 |
| late 1× | 180→187 | 16.7 → 16.7 | 16.8 → 16.8 | 183.3 → 100.0 | 183.3 → 116.7 | 2→3 | 2→3 | 2→1 | 0→0 | 191.0 → 122.3 | 0.017 → 0.033 |
| late 2× | 178→189 | 16.7 → 16.7 | 16.8 → 16.7 | 183.3 → 100.0 | 199.9 → 116.6 | 2→2 | 2→2 | 2→1 | 0→0 | 196.0 → 115.0 | 0.033 → 0.033 |
| late 4× | 148→178 | 16.7 → 16.7 | 16.8 → 16.8 | 250.0 → 100.1 | 283.4 → 116.6 | 4→4 | 4→4 | 4→2 | 3→0 | 276.4 → 120.6 | 0.033 → 0.016 |

### rally-short / Combat

| Phase/speed | N | Median | p95 | p99 | Worst | >33.3 | >50 | >100 | >200 | D max | Debt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| early 1× | 199→203 | 16.7 → 16.7 | 16.8 → 16.8 | 16.8 → 16.8 | 33.4 → 16.8 | 1→0 | 0→0 | 0→0 | 0→0 | 28.9 → 20.9 | 0.017 → 0.033 |
| early 2× | 197→203 | 16.7 → 16.7 | 16.8 → 16.8 | 33.3 → 16.8 | 50.0 → 16.8 | 1→0 | 0→0 | 0→0 | 0→0 | 22.8 → 12.7 | 0.033 → 0.033 |
| early 4× | 199→194 | 16.7 → 16.7 | 16.8 → 16.7 | 33.3 → 50.0 | 33.3 → 66.7 | 0→3 | 0→1 | 0→0 | 0→0 | 37.7 → 23.2 | 0.033 → 0.016 |
| middle 1× | 194→197 | 16.7 → 16.7 | 16.8 → 16.8 | 66.6 → 33.4 | 66.7 → 33.4 | 2→2 | 2→0 | 0→0 | 0→0 | 72.7 → 38.6 | 0.017 → 0.017 |
| middle 2× | 196→200 | 16.7 → 16.7 | 16.8 → 16.8 | 49.9 → 33.3 | 66.7 → 66.7 | 2→2 | 1→1 | 0→0 | 0→0 | 62.9 → 46.4 | 0.033 → 0.050 |
| middle 4× | 189→195 | 16.7 → 16.7 | 16.8 → 16.8 | 66.6 → 33.5 | 66.6 → 50.0 | 4→4 | 4→0 | 0→0 | 0→0 | 74.4 → 42.4 | 0.033 → 0.033 |
| late 1× | 193→199 | 16.7 → 16.7 | 16.8 → 16.8 | 83.3 → 50.0 | 83.3 → 50.0 | 2→2 | 2→0 | 0→0 | 0→0 | 84.5 → 59.5 | 0.033 → 0.033 |
| late 2× | 189→198 | 16.7 → 16.7 | 16.8 → 16.8 | 83.3 → 50.1 | 83.3 → 50.1 | 5→2 | 2→2 | 0→0 | 0→0 | 87.6 → 56.0 | 0.017 → 0.017 |
| late 4× | 181→190 | 16.7 → 16.7 | 16.8 → 16.8 | 83.4 → 50.0 | 83.4 → 66.6 | 7→4 | 4→1 | 0→0 | 0→0 | 91.4 → 62.0 | 0.016 → 0.033 |

### rally-long / Combat

| Phase/speed | N | Median | p95 | p99 | Worst | >33.3 | >50 | >100 | >200 | D max | Debt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| early 1× | 199→201 | 16.7 → 16.7 | 16.8 → 16.7 | 49.9 → 16.8 | 50.0 → 16.8 | 2→0 | 0→0 | 0→0 | 0→0 | 30.8 → 16.9 | 0.033 → 0.017 |
| early 2× | 199→204 | 16.7 → 16.7 | 16.7 → 16.7 | 16.8 → 16.8 | 33.3 → 16.8 | 1→0 | 0→0 | 0→0 | 0→0 | 24.1 → 20.1 | 0.033 → 0.050 |
| early 4× | 196→197 | 16.7 → 16.7 | 16.7 → 16.8 | 33.4 → 33.4 | 33.4 → 66.6 | 4→2 | 0→1 | 0→0 | 0→0 | 43.4 → 25.4 | 0.017 → 0.017 |
| middle 1× | 186→194 | 16.7 → 16.7 | 16.7 → 16.8 | 133.3 → 83.3 | 150.0 → 99.9 | 2→2 | 2→2 | 2→0 | 0→0 | 153.4 → 102.6 | 0.017 → 0.033 |
| middle 2× | 184→192 | 16.7 → 16.7 | 16.8 → 16.7 | 149.9 → 83.3 | 166.6 → 83.3 | 2→3 | 2→2 | 2→0 | 0→0 | 163.0 → 88.4 | 0.050 → 0.033 |
| middle 4× | 161→184 | 16.7 → 16.7 | 16.8 → 16.8 | 166.6 → 83.3 | 166.7 → 83.4 | 6→5 | 5→4 | 4→0 | 0→0 | 169.9 → 90.7 | 0.017 → 0.016 |
| late 1× | 171→188 | 16.7 → 16.7 | 16.7 → 16.8 | 250.0 → 116.6 | 250.0 → 150.0 | 2→2 | 2→2 | 2→2 | 2→0 | 245.8 → 149.0 | 0.017 → 0.033 |
| late 2× | 173→188 | 16.7 → 16.7 | 16.8 → 16.7 | 233.3 → 116.6 | 266.6 → 116.6 | 3→2 | 2→2 | 2→2 | 2→0 | 266.9 → 124.5 | 0.033 → 0.033 |
| late 4× | 144→168 | 16.7 → 16.7 | 16.8 → 16.8 | 233.4 → 150.1 | 266.6 → 183.3 | 5→4 | 4→4 | 4→4 | 4→0 | 268.9 → 187.4 | 0.017 → 0.017 |

## Interpretation, regressions and limits

- Late eight-RU C01 Combat4×: pooled p99 **250.0→100.1ms**, worst283.4→116.6ms; maximum digest276.4→120.6ms. Main Canvas median is about0.2–0.3ms and DOM about0.2ms, supporting the decision not to rewrite the viewer.
- Late Long Rally Combat4×: pooled p99 **233.4→150.1ms**, worst266.6→183.3ms. It improves but still hitches; the sub50ms target is not met.
- Across54 groups, p99 improves by at least1ms in37, differs by under1ms in16, and worsens materially in one. The counterexample is early Short Rally Combat4×:33.3→50.0ms. Its cause is not established by two observations; it is retained as a regression/uncertainty, not deleted or automatically blamed on noise. Three additional raw worse comparisons are below0.00000001ms timestamp arithmetic and display as unchanged.
- Across all phase-stress samples, >50ms counts81→50, >100ms40→13, >200ms12→0; frame counts10,236→10,563. Median and p95 remain16.7/16.8ms; pooled p99 barely changes33.4→33.3ms because quiet groups dominate that mixture. The complete-race and scenario-specific p99 values are more informative than a misleading aggregate success headline.
- Native tick logs, digest/non-digest timings, long tasks, Canvas/map/DOM/effects, debt and heap proxies are retained separately. Renderer timers measure CPU submission, not GPU execution. A final no-op attempted tick may be logged when native Ended is reached; authoritative progress is start/end native tick, not wrapper-call count. Terminal clearance may occur within a late observation.
- The observer does not prove the cause of every individual long frame. GC/managed scheduling, phase restoration and short windows limit attribution. Phase long tasks exclude setup by timestamp; whole-run raw long-task arrays can include early test preparation, so reported frame counts use the independent full-run rAF stream instead.

The final implementation measurably improves the priority Circuit/Combat long-frame problem, but does not meet a universal sub50ms or sub100ms guarantee. The complete4× Circuit test keeps up without growing debt; it is not proof of every possible long-race/machine workload. No scheduler, variable-dt physics, interpolation authority or input timing rule changed. Remaining linear history traversal is quantified and requires separate approval for any larger architectural remedy. Owner Windows Chrome/Edge direct-file acceptance remains outstanding.

Reproduce with `scripts/p1-4/browser-profile.mjs`, `sustained.mjs`, then `summarize.mjs`, using the frozen reference root for baseline and the delivered root for candidate. Exact raw process exits and final artifact identity are in the delivery report.
