# BNT — P1 Performance Report

Baseline: `de1bd66990a2bd390294a152f886b31e5bb8ac04`, accepted native runtime ancestor `b8c090057052ac03bbed73d9487093da61381451`. Branch: `feat/p1-playable-race`. Implementation commit: `bb39003c93d353cb35a8f4a853ab11ecca8b7976`. No merge, push, release or deployment. The pre-existing untracked M2-E readiness document remains untouched.

## Method

`node scripts/p1/profile.mjs` measured one sequential observation per fixed-seed workload, first Node then Chromium; no concurrent regression/benchmark processes were intentionally run during this final profile. Node 24.22.1, Chromium 156.0.8078.79, Linux managed container. Results are observations, not statistical guarantees or low-end Windows evidence. Native checkpoint interval remains 100.

Node full-race time includes only native session ticks and timing instrumentation, excluding setup and final metrics/clearance. Chromium full-race batches call the native tick and render/yield each 25 ticks; these full-race timings are accelerated diagnostic throughput, not wall-clock 1× playback or 60 Hz proof. A separate 3-second actual 4× requestAnimationFrame sample is included. Raw evidence: `evidence/profile.json`.

## Native stepping and setup

| Fixture | Node setup ms | Node full race ms | Early raw100 ms | Late raw100 ms | Max native tick ms | Final tick / status |
|---|---:|---:|---:|---:|---:|---|
| one-short-Pure | 9.0 | 104.0 | 15.9 | not reached | 11.2 | 603 / Ended |
| four-circuit-Combat | 4.4 | 784.6 | 25.6 | not reached | 80.5 | 1594 / Ended |
| eight-oval-Pure | 2.3 | 644.6 | 44.6 | not reached | 60.8 | 978 / Ended |
| eight-long-Combat | 40.6 | 11080.8 | 125.1 | 231.90224399999715 | 339.2 | 4585 / Ended |

## Browser presentation

| Fixture | Browser full diagnostic race ms | Follow draw p95 ms | Map draw p95 ms | DOM p95 ms | Max native tick ms | Final clearance/metrics preparation ms |
|---|---:|---:|---:|---:|---:|---:|
| one-short-Pure | 234.4 | 0.90 | 0.20 | 1.40 | 6.8 | 6.5 |
| four-circuit-Combat | 1171.2 | 0.50 | 0.20 | 1.50 | 64.1 | 72.9 |
| eight-oval-Pure | 893.4 | 0.50 | 0.20 | 1.70 | 49.6 | 46.1 |
| eight-long-Combat | 10372.0 | 0.60 | 0.20 | 1.80 | 351.1 | 241.4 |

Canvas draw-call timings measure CPU submission, not total GPU/compositor/display latency. DOM timer excludes future layout/paint and includes current text/radio work. Long-task observation is reported separately; these low drawing values must not be interpreted as no main-thread stalls.

Actual 3-second 4× sample: 242 native ticks, 185 draw samples, 0 observed long tasks. No live Sign clicks were timed in this playback sample; a separate browser suite exercises Sign UI behavior.

## Responsiveness, memory and known limits

- Raw simulation is no longer gated on multi-second durable E4 advances. Native in-memory hashes/history remain and cause substantial late-race spikes; no checksum or diagnostic shortcut was used.
- Late Long Combat Rally native ticks exceeded the preferred 50–100 ms main-thread targets. This is a known inherited limitation, not a claim of stall-free 60 Hz gameplay. Full races remain playable; any digest optimization requires a separately gated proposal preserving behavior/references.
- Clearance/metrics preparation is a one-time validated native operation and may take hundreds of milliseconds on the large fixture. It is not financial publication and writes nothing.
- Profiling retained bounded timing samples (2000), long-task samples (1000), one current geometry/session and bounded radio presentation. Native authoritative events remain complete. There is no E4 retained-session archive on this path.
- Node heap and Chromium `performance.memory` are sampled process/runtime readings without forced GC, not isolated object-size, peak-memory or leak measurements. Earlier fixtures may not have been collected. No universal memory bound is claimed.

| Fixture | Browser heap before / after MiB | Node heap before / late / after MiB | Native event count |
|---|---|---|---:|
| one-short-Pure | 2.6 / 5.2 | 37.8 / n/a / 37.5 | 97 |
| four-circuit-Combat | 5.2 / 37.0 | 39.4 / n/a / 77.6 | 848 |
| eight-oval-Pure | 37.0 / 48.3 | 79.2 / n/a / 93.3 | 1496 |
| eight-long-Combat | 48.3 / 125.1 | 106.0 / 152.2 / 294.2 | 5484 |

## Determinism and performance disposition

All measured fixtures ended and passed native clearance in each runtime. Long Rally Node/Chromium checksums differ, consistent with the inherited cross-runtime geometry issue; supported-runtime reproducibility is the contract. No rounding/physics or accepted golden change was attempted. Fixed-input same-runtime repeatability is tested separately.

**Disposition: functional PASS with disclosed performance limitations.** Rendering is inexpensive in the measured workload; native digest spikes remain. Further optimization is not silently included in P1. Before claiming broad-device smoothness, run ordinary 1×/2×/4× Long Rally on owner Windows hardware, measure input-to-feedback during a digest tick and repeat memory sampling across races with controlled GC/device methods. P1 does not claim final P5 stabilization.
