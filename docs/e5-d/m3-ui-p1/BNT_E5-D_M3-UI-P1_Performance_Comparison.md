# M3-UI-P1 — Controlled Performance Comparison

## Scope and method

The original M3-UI artifact (`d6a2153249e2a0987d5f073e515f8e8f79ec764367bd7b130079f34bdcf89dc3`) and final M3-UI-P1 artifact (`77e96a6c3db3c3c5409f14d50f1f9dc6bd8fa69aa14524b9a8e3c47dab30adf4`) were tested sequentially **after the regression jobs ended**. Identical fixture code, seeds, native setups, Chromium version, six-second 4× playback interval and measurement procedure were used. No concurrent verification workloads were running. This is one controlled comparison per configuration, not a statistically powered benchmark. Ordinary host activity and browser/JIT variation remain.

Commands from `/workspace/BNT`, both raw exit **0**:

```
node scripts/e5-d/m3-ui-p1/profile.mjs baseline controlled-
node scripts/e5-d/m3-ui-p1/profile.mjs candidate controlled-
```

Evidence: `evidence/profile-controlled-baseline.json`, `profile-controlled-candidate.json`, matching logs and `.exit` files. `scripts/e5-d/m3-ui-p1/profile.mjs` retains the reproducible harness. Node 24.22.1 / Chromium 156.0.8078.79 / Linux / 4-core CPU quota. Measurements below are milliseconds, shown **M3-UI → M3-UI-P1**.

## Raw simulation and in-memory Worker requests

The 100-tick request comprises five successive 20-tick `attemptExecute` advances, from the same saved starting configuration. It uses the accepted P1 in-memory authority: **it is not a durable E4 advance**. Worker preparation/response timings for every chunk are in the raw JSON. No storage commit is implied by a successful message.

| Fixture / format / entrants | Raw 100 ticks | In-memory 100-tick requests | Sign request | Retained source record bytes (candidate) |
|---|---:|---:|---:|---:|
| oval / Pure / 1 | 12.2 → 12.6 | 20.6 → 25.1 | 1.7 → 2.0 | 796,148 |
| circuit / Combat / 4 | 37.6 → 36.0 | 46.7 → 64.6 | 3.1 → 4.9 | 891,667 |
| rally / Combat / 8 | 76.2 → 79.2 | 87.0 → 105.8 | 3.9 → 4.5 | 980,364 |

All three candidate raw 100-tick runs are under 100ms. All measured in-memory 100-tick batches are under 110ms. The candidate's Circuit/Rally request totals are higher in this single sample; the increase is reported rather than hidden. No persistence/simulation/Worker authority implementation changed, and these small absolute changes do not establish a statistically reliable throughput regression. No claim of a general performance improvement is made.

Both artifacts performed **zero IndexedDB puts and zero career transactions** during these advances. They retained identical source-record byte counts per fixture. Candidate real playback also performed zero IndexedDB puts. The separate five-package browser test independently observed zero ordinary race writes.

## Presented playback

| Fixture | Frame interval p95 | Main Canvas draw p95 | DOM update p95 | Observed long tasks | Buffer underruns |
|---|---:|---:|---:|---:|---:|
| oval | 16.8 → 16.8 | 1.6 → 2.3 | 1.0 → 1.1 | 0 → 0 | 0 → 0 |
| circuit | 16.8 → 16.8 | 2.3 → 3.4 | 1.4 → 1.6 | 0 → 0 | 0 → 0 |
| rally | 16.7 → 16.8 | 2.5 → 3.3 | 1.4 → 2.3 | 0 → 0 | 0 → 0 |

All sampled playback intervals had **zero buffer underruns** and **zero recorded long tasks**. Frame timing remains approximately 60Hz. These measurements support preserving responsive P1 playback for the tested cases; they are not a Windows acceptance result or a guarantee for every machine/race.

The diagnostic timer-gap proxy includes the deliberately synchronous raw-simulation benchmark, not just ordinary UI processing. It reached about 100ms for the candidate Rally fixture, versus about 90ms in the baseline. It must not be presented as a precise UI longest-task measurement. Actual sampled normal Worker playback reported no long tasks. Startup, cold protected-history reconstruction, transaction dialogs and all retained-history sizes were not assigned a new 50/100ms guarantee.

## Interpretation and limits

The intended workflow correction preserved the P1 performance boundary: ordinary racing remains in memory, with no new periodic or per-tick persistence, no buffer underruns in these samples and no authoritative changes. The full 14 historical/payroll checksum comparison and source-preservation inventory establish compatibility separately from timing.

The fixtures cover one-entrant Pure Oval, four-entrant Combat C01 and eight-entrant Combat generated Short Rally. They do not establish a new worst-case Long Rally/twelve-event capacity result. Existing large-history management validation costs, cold-load latency and backend record limits remain; this task did not authorize another persistence/physics optimization milestone. Concurrent full-suite elapsed times are intentionally excluded from this comparison.
