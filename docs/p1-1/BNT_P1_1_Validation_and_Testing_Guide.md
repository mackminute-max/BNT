# BNT — P1.1 Validation and Owner Testing Guide

Implementation `fce3ae7e87ba4a6c3b0877431c6c890fe5ee0287`, branch `feat/p1-1-pacing-presentation`. No merge/push/deployment. Tested source is frozen; later report commit contains documentation/evidence only.

## Executed verification

| Command | Actual result | Exit |
|---|---|---:|
| `npm test` | **569 passed / 0 failed**, 370,182 ms; includes all original tests, P1 tests and 13 new P1.1 tests | 0 |
| `node --test tests/p1-1.test.js tests/p1-playable.test.js` | Initial candidate smoke: 44 passed / 0 failed; final profile subsequently covered by full suite | 0 |
| `node scripts/p1-1/pacing.mjs` | 120 matched native diagnostic races and 30 ordinary queued-Sign races, all Ended | 0 |
| `node scripts/p1-1/verify-pacing.mjs` | Three representative exact checksum repeats; 30 Sign-budget checks; non-dominant sustained-Push assertions | 0 |
| `node scripts/p1-1/lead-change.mjs` | Actual two-RU early lead and late reversal assertions passed | 0 |
| `node scripts/p1-1/field-check.mjs` | Eight-entrant Pure Oval, Combat Circuit and Long Combat Rally all Ended and cleared; ticks 992, 1624, 4096 | 0 |
| `node scripts/p1-1/browser.mjs` | Five Chromium presentation groups passed, no page errors; explicit file navigation blocked | 0, limitation recorded |
| `BNT_P1_OUT=.../p1-regression node scripts/p1/browser.mjs` | Eight existing P1 functional groups passed; offline interactions, no runtime requests, no career writes/IndexedDB opens; file blocked | 0, limitation recorded |
| `BNT_P1_OUT=.../p1-regression node scripts/p1/references.mjs` | 12 historical native references and two payroll references unchanged | 0 |
| `BNT_P1_OUT=.../p1-regression node scripts/p1/compare.mjs` | 16 complete native build-comparison races cleared, repeat checksums matched | 0 |
| `node scripts/p1/build.mjs` | Self-contained HTML built; no external runtime dependency; production aliases unchanged | 0 |
| `git diff --check` | Passed | 0 |

Environment: Node 24.22.1, Chromium 156.0.8078.79, managed Linux. Diagnostics ran with fixed simulation conditions; CPU timing under concurrent verification is not presented as a controlled performance benchmark. No dependencies were added or updated.

## Coverage

Native exertion/recovery/endurance/impairment checks, continuous fatigue display bands, mean-beast data/individual access, trend and paused-state behavior, fixed-input 1×/4× replay equality, native legacy-default isolation, full-format race clearance and historical Sign priorities remain covered. Browser tests check percentage against the native mean, fresh state, single-step, paused stability, 4× updates, zoom without checksum changes, terrain/camera/map rendering and page errors. Existing P1 tests cover all six Signs and all course types.

## Harness corrections and limits

An initial browser harness used Playwright `inputValue` on `<progress>` and exited 1; corrected to read its numeric DOM value. An initial diagnostic fixture placed `noise` under utility instead of autonomous scalar tuning and was rejected; corrected to the existing contract. Neither required an application fix or weaker assertion. Reference-driver measurements were discarded because that native mode intentionally skips fatigue integration; final experiments retain autonomous condition processing.

No outstanding test failures remain in the executed Node/P1 UI scopes. The file-opening check remains blocked by managed-browser `ERR_BLOCKED_BY_ADMINISTRATOR`; an HTTP/offline functional pass is not Windows acceptance. Other specialist E4 browser runners were not rerun; their application sources and production artifacts are unchanged. Historical production browser file restrictions are not represented as resolved.

Native digest stalls, platform floating-point differences and final art remain deferred. Balance observations cover representative fixtures, not all future content; more playtesting is appropriate. No new career saving is claimed. P1 remains in-memory and closing loses unfinished play; production persistence remains unchanged.

## Play the standalone on Windows

1. Download the supplied **Blood-and-Thunder-P1.1-Playable.html** (a delivery copy of `dist/Blood-and-Thunder-P1-Playable.html`). It contains all scripts and styles; no server, Node, npm or adjacent assets needed.
2. Optionally run `Get-FileHash .\Blood-and-Thunder-P1.1-Playable.html -Algorithm SHA256`. Expected `1cd2aa0ed8c4342509c1be72b1f02b6be09e9f7f812e93bcff90081e0912aeca`, 188,835 bytes.
3. Open directly from disk in current Chrome and Edge while offline. Header should identify P1.1.
4. Prepare a Short Oval, select a seed/build/weather, queue Push the Pace and start. Watch TEAM ENDURANCE, remaining percentage, text status and ↑/↓/→ trend. Raw per-beast fatigue remains in HUD/diagnostics. Pause: value should remain stable; step: value should update; 2×/4× preserve native tick logic.
5. Try Conserve Strength at the next eligible boundary. It should reduce fatigue when the AI uses Conserve; it is not instant healing. Cancel gives no Sign refund, default uses remain three, and queued Signs still wait for the starting signal/lap line/Rally point.
6. Check default closer framing and the 4–10 zoom slider, directional cart/wheels/beasts, player identification and separate full-course map. On C07 or Long Rally observe the native terrain colors and named legend.
7. Compare early aggression versus late aggression on longer events and different endurance builds; do not expect every strategy to win every race. The existing build comparison presets remain experimental.
8. Export diagnostic metrics when reporting issues, including seed, course, format, weather, laps/field, build/coaching, native tick, Sign order, browser/version and this artifact hash.

## Developer commands

Build: `node scripts/p1/build.mjs` → `dist/Blood-and-Thunder-P1-Playable.html`. Full suite: `npm test`. New checks: `node --test tests/p1-1.test.js`; browser: `node scripts/p1-1/browser.mjs`. Balance: `node scripts/p1-1/pacing.mjs`, then `node scripts/p1-1/verify-pacing.mjs`. Lead proof: `node scripts/p1-1/lead-change.mjs`. Full fields: `node scripts/p1-1/field-check.mjs`.

`BNT_P11_OUT` selects new experiment evidence location; use `BNT_P1_OUT` for the retained P1 scripts. Do not overwrite accepted evidence when rerunning experiments. The pacing/profile code is configurable centrally; `pacing:'legacy'` is available for old-prototype comparisons. Windows owner acceptance remains a separate review gate; stop before P2.
