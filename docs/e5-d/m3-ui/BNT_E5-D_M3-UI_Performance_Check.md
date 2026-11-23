# Blood and Thunder — M3-UI P1 Performance Regression Check

Controlled samples ran after the Node/browser regression processes finished, using the same managed Chromium launch, fixed fixture setup and server harness. Baseline is the accepted P1 HTML, candidate is the final M3-UI HTML; both use the accepted in-memory attempt APIs. No E4 durable viewer advance was substituted for baseline. Fixtures: one-entrant Pure Oval, four-entrant Combat Circuit, eight-entrant Combat short Rally. Actual viewer samples use 4× playback for approximately 6 seconds, with commentary and tactical map enabled.

Reproduce with `node scripts/e5-d/m3-ui/profile.mjs baseline controlled-` and `node scripts/e5-d/m3-ui/profile.mjs after controlled-`; raw exits 0/0 and JSON retained. These are single controlled samples, not device-independent guarantees or a statistically established improvement percentage.

| Fixture |100 ticks P1/UI ms|IDB puts P1/UI|Career transactions P1/UI|Sign request P1/UI ms|4× viewer ticks P1/UI|Buffer underruns P1/UI|
|---|---:|---:|---:|---:|---:|---:|
|oval|19.4/28.3|0/0|0/0|1.8/1.7|484/484|0/0|
|circuit|42.2/42.9|0/0|0/0|3.2/2.9|482/484|0/0|
|rally|92.2/98.2|0/0|0/0|3.8/5.1|484/484|0/0|

|Fixture|Raw native 100 ticks P1/UI ms|Mean main draw P1/UI ms|Mean map draw P1/UI ms|Mean DOM P1/UI ms|Max observed viewer long task P1/UI ms|
|---|---:|---:|---:|---:|---:|
|oval|9.6/10.7|1.20/1.21|0.11/0.12|0.59/0.64|0.0/0.0|
|circuit|29.5/29.2|1.47/1.26|0.17/0.14|0.83/0.71|0.0/0.0|
|rally|68.9/71.5|1.22/1.23|0.15/0.16|0.80/0.82|0.0/0.0|

No new per-tick durable write or career transaction was introduced. Main/map/DOM timing and native raw-work noise are measured separately. Zero observed long task means none at the 50 ms observation threshold during this sample, not universally zero blocking. The raw benchmark's `maxTimerGapMs` includes deliberately executing a native test on the main thread and is not a clean ordinary-render measurement. Buffered telemetry retains bounded lead/frame counts and complete event delivery; more events over unequal simulated durations must not be called commentary loss or duplication.

The dedicated workflow test also measures 200 normal HQ navigation actions with zero IDB writes and exact state equality. It does not claim every page paints in zero milliseconds. Protected activation/publication/import/backup validation still requires real processing and may show a legitimate busy state. No general E4 history optimization, memory-capacity expansion or native engine simplification was performed.
