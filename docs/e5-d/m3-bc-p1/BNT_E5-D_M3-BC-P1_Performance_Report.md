# Blood and Thunder — M3-BC-P1 Performance Report

## Method and evidence

Controlled managed Chromium156.0.8078.79, identical fixed seed/configuration fixtures, same host and launch flags, tactical map and alternate radio enabled. Fixtures: one-entrant Pure Oval, four-entrant Combat Circuit, eight-entrant Combat short Rally. Dedicated old M3-BC artifact versus isolated P1 candidate. The 100-tick request benchmark and actual six-second4× viewer sample use separate fresh browser contexts. No concurrent regression load was intentionally used for these controlled samples.

Reproduction:

```sh
node scripts/e5-d/m3-bc-p1/profile.mjs baseline controlled-4x-
node scripts/e5-d/m3-bc-p1/profile.mjs after final-4x-
```

Raw evidence is retained in `evidence/profile-controlled-4x-baseline.json` and `evidence/profile-final-4x-after.json`, associated logs and exit files (both0). These performance samples preceded the final cold-manifest guard and deletion-error-message corrections; the per-tick/Sign fast path is unchanged. Final artifact behavior is independently covered by the frozen-source regression runs. Timings are samples, not cross-device guarantees or a universal speedup percentage.

## 100 native ticks through the player transport

| Fixture | Old wall ms | P1 wall ms | Old request throughput ticks/s | P1 ticks/s | IDB puts old→P1 | Career transactions old→P1 |
|---|---:|---:|---:|---:|---:|---:|
| oval | 402.6 | 27.8 | 248.4 | 3597.1 | 18→0 | 0→0 |
| circuit | 794.2 | 42.7 | 125.9 | 2341.9 | 18→0 | 0→0 |
| rally | 1405.5 | 90.3 | 71.1 | 1107.4 | 18→0 | 0→0 |

The old18 puts were six awaited generation commits with multiple records each, not18 separate financial operations. This benchmark excludes race birth/finalization. P1's zero writes are substantive: no snapshot/hash/journal encode/backend commit on ordinary advance or Sign. Both paths still use the same native engine.

## Actual4× playback, approximately6seconds

| Fixture | Old advanced ticks | P1 advanced ticks | IDB puts old→P1 | Buffer underruns old→P1 | Starved time ms old→P1 | Max buffered frames old→P1 |
|---|---:|---:|---:|---:|---:|---:|
| oval | 253 | 484 | 113→0 | 13→0 | 2800.1→0.0 | 21→21 |
| circuit | 189 | 484 | 63→0 | 10→0 | 3583.3→0.0 | 21→21 |
| rally | 116 | 483 | 42→0 | 6→0 | 4483.3→0.0 | 21→21 |

The viewer's lead remained bounded at approximately one simulated second and21frames. More commentary/events in an equal wall-clock P1 sample are expected because more simulation ticks are presented; no claim is made by comparing unequal-race-time event counts. Exact native replay and reporter regression tests protect event order and content.

## Component cost and responsiveness

| Fixture | Native100ticks old/P1 ms | Native Sign old/P1 ms | Full Sign request old/P1 ms | Native commentary old/P1 ms | Alternate wording old/P1 ms |
|---|---:|---:|---:|---:|---:|
| oval | 9.7/11.3 | 0.3/0.2 | 84.4/2.4 | 0.4/0.1 | 0.5/0.5 |
| circuit | 30.5/34.1 | 0.1/0.1 | 179.1/2.6 | 0.3/0.3 | 0.7/0.6 |
| rally | 65.4/80.4 | 0.2/0.2 | 493.9/4.6 | 0.5/0.5 | 0.8/1.5 |

| Fixture | Mean worker request old/P1 ms | Mean durable commit old/P1 ms | Main draw old/P1 ms | Map draw old/P1 ms | DOM old/P1 ms | Max observed viewer long task old/P1 ms |
|---|---:|---:|---:|---:|---:|---:|
| oval | 57.4/5.0 | 10.6/0.0 | 1.26/1.19 | 0.11/0.11 | 0.64/0.71 | 0.0/0.0 |
| circuit | 131.0/7.6 | 12.9/0.0 | 1.37/1.21 | 0.15/0.16 | 0.82/0.72 | 0.0/0.0 |
| rally | 247.9/16.5 | 16.1/0.0 | 1.41/1.23 | 0.19/0.17 | 0.94/0.84 | 0.0/0.0 |

A zero long-task measurement means none observed at the50ms observation threshold in this sample, not a promise of zero blocking. `maxTimerGapMs` in the raw request JSON also includes an intentionally main-thread raw-simulation benchmark and must not be presented as normal viewer rendering latency.

## Remaining costs

Final deterministic replay/validation and official durable publication are intentionally retained. Large terminal proof reconstruction, backups and long histories may still take noticeable time; the UI shows actual pending status. This milestone makes no claim that these operations meet a50ms target, that maximum storage is unlimited, or that every platform can run at4×. No physics/AI optimization was needed or performed.
