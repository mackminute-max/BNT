# BNT — P2.2 Test Evidence

## Revision and environment

Final runtime **`c235bf3ce0caed44a472cb0abd92104112f39586`**, local branch `feat/p2-2-fullscreen-race-layout`. Verified base `ab9c5c5` is the documentation-only successor to accepted P2.1 runtime `4a9e100`. The source/tests/artifacts match that accepted runtime. Documentation and supplementary harnesses follow in a separate local evidence commit; no merge/push/release.

Node 24.22.1, Linux x64, managed Chromium 156.0.8078.79, existing esbuild 0.28.2 and Playwright-core 1.65.1. No dependency installation/update or new font/art dependency. No lint/typecheck command is configured.

## Commands actually executed

From repository root. Full logs/JSON/screenshots live under `docs/p2-2/evidence/`, mirrored in `/workspace/deliverables/bnt-p2-2/evidence/`. Machine-readable raw exits: `commands-and-exits.json`.

| Command | Raw exit | Result |
|---|---:|---|
| `npm test` | **0** | P2.1 base694/694;335299.985749ms |
| `node --test tests/p2-2.test.js` | **0** | 23/23 |
| `npm test` | **0** | Frozen c235bf3:717/717;348357.782676ms |
| `node scripts/p2-2/layout-browser.mjs` | **0** | 5 target viewports;1080p fit;hierarchy and control scope |
| `node scripts/p2-2/standings-browser.mjs` | **0** | Synthetic identity/long-name/status/tie projection +real Worker-head-ahead proof |
| `node scripts/p2-2/interface-browser.mjs` | **0** | 9 actual UI/native functional groups |
| `node scripts/p2-2/resize-browser.mjs` | **0** | 5 resize states,exact paused camera/session preservation,keyboard zoom,actual fullscreen enter/exit |
| `node scripts/p2-2/keyboard.mjs` | **0** | 2 keyboard/focus/Queue groups |
| `node scripts/p2-2/references.mjs` | **0** | 12 historical +2 payroll references |
| `node scripts/p2-2/native-equivalence.mjs` | **0** | 6 full Native Worker/reference captures |
| `node scripts/p2-2/checkpoint-compat.mjs` | **0** | 18 exact checkpoint wires and continuations |
| `node scripts/p2-2/browser-native.mjs` | **0** | 100 clocks,3 full captures,delayed Sign replay/restore |
| `node scripts/p2-2/art-parity-fast.mjs` | **0** | 12 full Worker races,replay/classification parity,compact order agrees with full original table |
| `node scripts/p2-2/assets-browser.mjs` | **0** | 15 DPR/CSS-zoom cases +4 asset/cache groups |
| `node scripts/p2-2/geometry-browser.mjs` | **0** | 20 geometry/DPR cases |
| `node scripts/p2-2/durable-browser.mjs` | **0** | 5 DPR contexts +4 unchanged durable-companion authority groups |
| `node scripts/p2-2/browser-faults.mjs` | **0** | 6 protocol/fallback/delayed-input/offline groups;file URL blocked separately |
| `node scripts/p2-2/legacy-browser-compat.mjs` | **1** | Child exits P1=0,P1.1=1,P1.2=0,P1.3=0;old zoom6 default |
| `node scripts/p2-2/performance.mjs` | **0** | 12 sequential4x windows;one candidate 75ms task;zero underruns |
| `node scripts/p2-2/performance-repeat.mjs` | **0** | 2 targeted repeat windows;no long tasks/underruns in either |
| `node scripts/p2-2/summarize-performance.mjs` | **0** | Row counts and checkpoint start identities verified |
| `node scripts/p2-2/build-verify.mjs` | **0** | Repeatable HTML,Worker parity,protected source and accepted outputs unchanged |

Final Node suite: **717 passed,0 failed/cancelled/skipped**, including all 694 earlier tests plus 23 new organization/order/control-state tests. Old tests, replay goldens and Native source were not weakened or changed.

## Viewport and layout evidence

| Viewport | Document height px | Horizontal overflow | Race Controls bottom px |
|---|---:|---|---:|
| 1920×1080 | 1080 | False | 1005.0 |
| 2560×1440 | 1440 | False | 1203.1 |
| 1366×768 | 1016 | False | 875.2 |
| 1024×768 | 2059 | False | 1985.8 |
| 390×844 | 2461 | False | 2360.1 |

Primary1920×1080 fits within the viewport: left1252px/right626px (exact 2:1 content allocation), compact standings172.8px, Main Canvas1045.2×432px, six cards in one row. Main/standings share the left top row; Signs and profile follow; right panels are map→radio→controls. Only `start`,`pause`,`zoom` remain interactive inside player Race Controls. Original diagnostic IDs remain in Developer Tools without duplicates. Narrow layouts stack and may scroll;390px standings sit immediately below the viewport.

Resize tests verify the same session object, generation, paused tick and camera target across all dimensions. Both canvases retain equal X/Y world-to-CSS scale through the unchanged P2 helper, including fractional DPR/CSS zoom. A separate paused navigation test preserves the full camera values exactly. Keyboard zoom changes the original range without advancing a Native tick. Actual managed Chromium fullscreen API entered and exited successfully without restarting the session; this is not a claim of Windows F11/file-origin acceptance.

## Standings data and identity

Current generated entries lack stable names, so all eight use the approved **Stable name unavailable** fallback. No illustrative roster or driver/beast name was substituted. Explicit organization metadata is read by entrant ID only; generic names and conflicting names are rejected as display identities. The original full table remains in tools.

The actual Worker test prepares head frames ahead of the viewer, then pauses the countdown with presented tick0. Compact rows and dataset tick remain exactly the presented full table, not Worker head. Full Native race completion fixtures compare compact `[id,position]` rows to the original full table and retain the same official classification/replay.

Synthetic UI-only fixtures supplement those races for long organization names, Native-style finish/tie/retirement/disqualification rows and source reordering. They verify exactly two cells per row, unchanged source positions/order (`1,2,2,4,—`), full tooltip/ARIA text despite ellipsis, player highlight and row/identity reuse. These fixture names/statuses are not new game content or a claim that a particular full-race seed generated every rare outcome.

## P2.1 functional preservation

Nine real UI/native groups pass after adapting diagnostic clicks to the new tools location: internal navigation and original control IDs, deterministic preparation, profile labels, three neutral slots, real delayed-buffer READY/SET/GO, restart/pre-start pause, active offline navigation plus tail/single-step, actual controlled-comparison availability repair, radio anchor/latest/unread/reset and portrait/reduced-motion fallback.

The run request is held beyond countdown expiry: SET remains visible at tick0; releasing the original packet permits GO only on actual presented playback. Selection alone spends no Sign; the original Queue accepts one use. Pending/active and delayed-ack behavior remain Native. The synchronous fallback retains immediate stepping rather than an invented timed Worker countdown.

Native commentary is consumed while tools are open. A retained message anchor survives new real messages and view switching; Latest restores bottom-following; timestamps remain monotonic; transcript height stays fixed. Existing160-visible/200-generator retention is unchanged. Old content that ages out of that bound is not an unlimited archive.

## Determinism and compatibility

Four variants per format below—frozen P1.5 reference and P2.2 artwork on/off/failed—complete actual embedded-Worker races with identical tick0 queued input. Complete replay bytes, classifications, ticks and checksums match. The accelerated test-driven presentation/credit driver is not a new player control or a performance benchmark.

| Combat8 course | Ticks | Chromium checksum | Complete replay-export SHA-256 |
|---|---:|---|---|
| oval | 1841 | `7b871ef5` | `aef89ec1ccc2ae3c1f7b4128e17d841b6fdf7a24341b35272928cb10b4bd4764` |
| C01 | 3260 | `51624d65` | `da98d75fa7adc0769a908224d9f36b2a842b47c602e18b232676e119265409f3` |
| rally-long | 4544 | `c5095aaa` | `583350666e278fa62d2f28e85cb7641a6d761ad38336d40968a794f065fae304` |

Separately: six complete Native Worker/reference races,18 byte-identical checkpoint wires/continuations,100 Node/Chromium championship-clock states,three full cross-runtime captures and delayed-Sign replay/restore passed.

| Historical kind | File | Expected = actual |
|---|---|---|
| historical | `replay-reference-Pure-oval.json.gz` | `fe1bfab8` |
| historical | `replay-reference-Pure-C01.json.gz` | `1e9d7e68` |
| historical | `replay-reference-Pure-mixed-rally.json.gz` | `d13a8fdf` |
| historical | `replay-reference-Combat-oval.json.gz` | `79dec048` |
| historical | `replay-reference-Combat-C01.json.gz` | `cd29b4b3` |
| historical | `replay-reference-Combat-mixed-rally.json.gz` | `38fdb4e1` |
| historical | `replay-autonomous-Pure-oval.json.gz` | `821eca67` |
| historical | `replay-autonomous-Pure-C01.json.gz` | `c1730efa` |
| historical | `replay-autonomous-Pure-mixed-rally.json.gz` | `4120f7c5` |
| historical | `replay-autonomous-Combat-oval.json.gz` | `c8fd3ca0` |
| historical | `replay-autonomous-Combat-C01.json.gz` | `3ef47ff6` |
| historical | `replay-autonomous-Combat-mixed-rally.json.gz` | `fd015e71` |
| payroll | `payroll-Pure.json.gz` | `ad509187` |
| payroll | `payroll-Combat.json.gz` | `f191ca35` |

The embedded Native Worker is byte-identical to P2.1: SHA-256 **`6e30c8cb43110f294c94cc3b02d58a841644a9efe9aefebb88c72925e9be99b8`**. Native simulation/AI/protocol/track/replay/career/persistence, original app source, P2 renderer/Canvas/geometry and accepted P2.1 composition files have no diff from the verified baseline. Only additive P2.2 UI/build modules are used.

The inherited tactical seed145 Long Rally difference remains: Node`2c2d30ab`, Chromium`c5095aaa`. No precision, RNG, event order or golden was altered to hide it.

## E4 and assets

Accepted E4/P2 companion files remain byte-identical. The actual coordinator test uses fresh disposable synthetic career data, not owner saves: prepared tick25 cannot appear before commit while view remains tick0; acknowledgment advances both views; artwork toggle changes no durable bytes; injected quota failure retains the committed frame/records. Five DPR contexts/four authority groups pass. P2.2 layout is not forced onto that companion.

The reused asset harness passes15 DPR/CSS-zoom combinations, livery-mask isolation, missing/corrupt/delayed-image fallbacks, bounded eviction/rewarm and Native no-mutation checks. Shared geometry passes20 cases. Existing images/fonts/parser/cache limits are unchanged; there is no art production or save migration.

## Bounded performance observations

Twelve sequential1.6-second windows, same checkpoints, early/middle/late C01 and Long Rally Combat8,4×,1920×1080: accepted P2.1 versus P2.2. No concurrent correctness jobs. Original restore/setup and initial buffer fill are excluded from playback windows but recorded. Tools navigation selects the relocated speed control before measurement.

| Variant | Median / worst window draw p95 ms | Worst draw ms | Frame p99 ms | Frames >50ms | Long tasks | Underruns |
|---|---:|---:|---:|---:|---:|---:|
| reference | 2.20 / 2.40 | 18.30 | 16.80 | 0 | 0 | 0 |
| candidate | 2.60 / 3.30 | 19.70 | 16.80 | 1 | 1 | 0 |

P2.2 worst per-window draw p95 is 3.3ms versus 2.4ms reference, within the existing provisional 8ms budget. DOM p95 worst is 1.4ms in both. Approximate page heap maxima81,341,899 bytes candidate /81,747,997 reference are not private Worker/GPU measurements or sustained memory bounds.

**One candidate 75ms task and 66.6ms frame interval were observed in early Long Rally.** It is not silently attributed to inherited behavior. A bounded two-window repeat of that case recorded no long tasks/underruns in either version, frame maxima16.8ms, draw p95 reference 3.4ms/candidate 3.2ms. The isolated task's cause is unestablished; a sustained new layout regression was not demonstrated. Both original and repeat evidence are retained. No optimization campaign or Native timing change was initiated. These short single observations do not prove every run hitch-free; owner smoothness review remains necessary.

## Standalone build

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `dist/Blood-and-Thunder-P2.2-Playable.html` | 570,516 | `24c393c19f7d8aa6f4e2bf6794d2e573d11be74508940e97b78a6330b6a203be` |

Two consecutive builds match; all assets/styles/main/Blob Worker are embedded and resource checks reject runtime externals. Earlier P2.1/P2/companion aliases/P1.5 match their accepted Git bytes. Original normal build outputs are not overwritten; use `npm run build:p2-2`.

Managed offline interaction/navigation/Worker playback pass. An actual new-file `file://` navigation attempt was blocked with **ERR_BLOCKED_BY_ADMINISTRATOR**, reported separately despite the fault runner's overall exit0. Windows Chrome/Edge direct-file/offline testing remains owner acceptance, as do actual toolbar zoom, assistive-technology and subjective readability checks.

## Failed/intermediate checks and dispositions

- Initial1080p layout assertion failed at 1220px document height: the right stack pushed controls offscreen. Radio/footer/control spacing was reduced while retaining logic and map aspect. Final1080p height1080 passes.
- An intermediate1024px right-support arrangement failed vertical-order checks. Responsive stacking was corrected; no assertion was weakened. Final five-viewport tests pass.
- The first resize harness used unsupported Playwright `fill` on a range input. It now uses actual keyboard arrows and retains the value/session assertions; final resize/fullscreen test passes.
- Legacy browser aggregate exits1: original P1/P1.2/P1.3 assertions pass; P1.1 stops at old default zoom6 versus accepted P2/P2.1/P2.2 zoom8. The test/goldens remain unchanged. Its post-failure assertions are not claimed as executed. Legacy wrapper exposes both views only for old selectors; default UI/navigation is tested independently.
- The single performance task is retained with repeat results, not labeled a clean zero-hitch suite.

## Verdict

Functional, Native determinism, layout, offline managed interaction and local standalone gates pass in the available environment. The legacy browser aggregate remains explicitly nonzero. P2.2 is ready for owner review, conditional on Windows direct-file and subjective readability/smoothness acceptance; no owner acceptance, merge/push/release or P3/P4 authorization is claimed.
