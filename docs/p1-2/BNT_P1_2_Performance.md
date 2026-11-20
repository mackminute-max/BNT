# BNT — P1.2 Frame-Pacing Performance

Baseline source `74d7e73458fc01abc43cfb8f193832c04a3b3b9b` plus timing/read-only debt instrumentation. Candidate viewer `200a907`, with provenance-only tooling follow-up `ccfb11e`. Final artifact SHA-256 `5a203c1f488d22640e1f9695ae46fe4f5c328cb0c4ef97abf6f36f141ee4ed18`.

## Method

Nine before and nine after windows: eight entrants, Combat, seed145, Oval/C01/Long Rally, 1×/2×/4×, four seconds measured per window. Warm-up 850 ticks on Oval/C01 and 2050 on Long Rally, followed by two rendered frames before clearing measurement arrays. This phase alignment includes a periodic native digest in the 1× window as well.

Both stages explicitly use the **same P1.1 endurance simulation profile**, so this comparison isolates renderer/UI changes rather than attributing new balance outcomes to performance. The baseline is an embedded copy of P1.1 plus diagnostic timers/debt getter, not a production source replacement. Candidate real-game balance is evaluated separately by the competitive fixtures. No native dt, order, RNG, precision, periodic digest frequency or checkpoint content was changed.

Chromium 156.0.8078.79 on managed Linux; Node24.22.1; one sequential observation per condition, after regression processes finished. No concurrent simulation benchmarks were intentionally run. Managed-host load, JIT, garbage collection and timing quantization remain limitations. These are observations, not confidence intervals or guaranteed hardware performance.

The initial calibration included setup in a first frame interval; it was retained under a warm-up-contaminated name and excluded from final tables. Phase-800 and other provisional traces are separately retained. The authoritative final files are `baseline-frames.json` and `candidate-frames.json`.

## Actual frame intervals (milliseconds)

| Course / speed | Before median / p95 / worst | After median / p95 / worst | Frames >50 ms before / after |
|---|---|---|---:|
| oval / 1× | 16.70 / 16.80 / 100.00 | 16.70 / 16.70 / 100.10 | 1 / 1 |
| oval / 2× | 16.70 / 16.70 / 83.30 | 16.70 / 16.80 / 83.30 | 2 / 2 |
| oval / 4× | 16.70 / 16.80 / 100.10 | 16.70 / 16.80 / 83.40 | 3 / 3 |
| C01 / 1× | 16.70 / 16.80 / 100.00 | 16.70 / 16.80 / 99.90 | 1 / 1 |
| C01 / 2× | 16.70 / 16.80 / 150.00 | 16.70 / 16.70 / 116.70 | 2 / 2 |
| C01 / 4× | 16.70 / 16.80 / 116.70 | 16.70 / 16.70 / 116.80 | 3 / 3 |
| rally-long / 1× | 16.70 / 16.80 / 233.30 | 16.70 / 16.70 / 250.00 | 1 / 1 |
| rally-long / 2× | 16.70 / 16.80 / 216.70 | 16.70 / 16.80 / 216.60 | 2 / 2 |
| rally-long / 4× | 16.70 / 16.80 / 183.30 | 16.70 / 16.80 / 183.30 | 3 / 3 |

## CPU contributions and catch-up

Numbers are mean CPU submission milliseconds per recorded sample, except digest maximum. Camera is also included in main draw and must not be added twice; HUD sampling occurs only when the resolved view changes. Canvas submission excludes later GPU/compositor/display work. Advance is the whole native-tick scheduling batch, not an isolated renderer cost. Effect timing includes ingestion, drawing and status text. Baseline effects were absent.

| Course / speed | Advance before / after | Main before / after | Map before / after | HUD before / after | Camera after | Effects after | Digest max before / after |
|---|---:|---:|---:|---:|---:|---:|---:|
| oval / 1× | 0.599 / 0.670 | 0.309 / 0.278 | 0.076 / 0.049 | 0.406 / 0.310 | 0.008 | 0.035 | 100.90 / 109.70 |
| oval / 2× | 1.049 / 0.977 | 0.254 / 0.219 | 0.052 / 0.034 | 0.362 / 0.246 | 0.012 | 0.034 | 82.60 / 85.50 |
| oval / 4× | 1.709 / 1.661 | 0.240 / 0.205 | 0.050 / 0.033 | 0.305 / 0.202 | 0.006 | 0.028 | 100.40 / 92.90 |
| C01 / 1× | 0.657 / 0.620 | 0.344 / 0.229 | 0.071 / 0.038 | 0.411 / 0.217 | 0.011 | 0.055 | 109.00 / 106.60 |
| C01 / 2× | 1.632 / 1.372 | 0.287 / 0.209 | 0.062 / 0.035 | 0.366 / 0.210 | 0.010 | 0.057 | 152.50 / 126.90 |
| C01 / 4× | 2.246 / 2.213 | 0.266 / 0.232 | 0.060 / 0.036 | 0.304 / 0.196 | 0.014 | 0.062 | 126.90 / 126.80 |
| rally-long / 1× | 1.265 / 1.314 | 0.326 / 0.269 | 0.107 / 0.071 | 0.387 / 0.286 | 0.011 | 0.037 | 231.70 / 252.30 |
| rally-long / 2× | 2.338 / 2.248 | 0.292 / 0.248 | 0.100 / 0.071 | 0.356 / 0.248 | 0.010 | 0.046 | 214.20 / 225.00 |
| rally-long / 4× | 3.178 / 3.153 | 0.275 / 0.291 | 0.094 / 0.078 | 0.321 / 0.224 | 0.008 | 0.045 | 191.00 / 187.60 |

| Course / speed | Exact end-of-frame simulation debt max before / after (seconds) | Non-digest native tick p95 before / after (ms) |
|---|---:|---:|
| oval / 1× | 0.04990 / 0.04990 | 1.000 / 1.200 |
| oval / 2× | 0.04980 / 0.04980 | 0.900 / 0.800 |
| oval / 4× | 0.04960 / 0.04960 | 0.800 / 0.800 |
| C01 / 1× | 0.04990 / 0.04990 | 1.000 / 0.800 |
| C01 / 2× | 0.04980 / 0.04980 | 1.000 / 0.900 |
| C01 / 4× | 0.04960 / 0.04960 | 0.900 / 0.800 |
| rally-long / 1× | 0.04990 / 0.04990 | 1.100 / 0.900 |
| rally-long / 2× | 0.04980 / 0.04980 | 0.900 / 0.800 |
| rally-long / 4× | 0.04960 / 0.04960 | 0.800 / 0.700 |

Debt is sampled through a read-only getter after normal rendering callbacks. It is not peak in-task latency; a long native tick can stall before the next frame accounts for elapsed time. In these observations end-of-frame debt stayed below approximately one .05s native tick because catch-up usually drained it quickly. This does not erase the perceptible long frame.

## Diagnosis

Native digest-boundary tick samples are far more expensive than main-view, map, HUD, camera or effects submission. The 1×/2×/4× windows contain one/two/three digest boundaries by design. This directly supports periodic native CPU work as the main hiccup source; complex circuit drawing is not the dominant measured cost. No evidence justified changing corner physics or simulation precision.

## Focused changes

- Cache the immutable direction-arrow path with existing track geometry; stop recalculating it every frame.
- Reuse standings rows/cells and move rows only when order changes; avoid replacing the table each native tick.
- Refresh diagnostic JSON only while its panel is open; on open, refresh immediately.
- Bound interaction processing to 128 queued/12 visible projections, and retain counts/summaries without deleting native history.
- Keep whole-tick scheduler and its budget unchanged; new instrumentation measures camera/advance/effects/frame/debt separately.

Main/HUD CPU work improved in the observed comparison, but the absolute savings are small relative to a digest stall. Effects add a small bounded cost. Median/p95 frame timing remains around a 60Hz display interval. Worst intervals and long-frame counts are mixed: include adverse/inconclusive rows above. A single observation cannot attribute every worst-frame difference to optimization.

## Disposition and future work

**Conditional performance result.** Routine presentation overhead is lower where measured; the main native digest hitch is not solved. No guarantee of 60 FPS, browser-to-browser parity or low-end device performance. The existing performance issue remains disclosed rather than hidden by skipping ticks/hashes.

A future separately authorized task could evaluate exact-output hash preparation or non-durable worker CPU offload with small presentation messages. It must preserve native snapshots/checksums, input ordering and offline single-file support, and must not reattach per-interval E4 durable transactions or integrate unapproved experimental formats. No such architecture work is implemented here.

Owner Windows playtesting should record native tick and playback speed when a hitch occurs. The managed environment blocks direct file navigation; HTTP/offline measurements do not substitute for owner acceptance.
