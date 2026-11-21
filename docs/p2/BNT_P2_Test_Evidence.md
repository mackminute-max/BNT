# BNT — P2 Test Evidence

## Revision and environment

Runtime/source commit: **`ec25d77eea6523edba1cb1920d73c0dc7502b8c3`** on `feat/p2-static-visual-proof`, based on P1.5 delivery `04df5efba874b5889bb1c8e8e6920918c8df00e1`. Documentation/evidence follow in a separate local commit. No merge or push.

Node v24.22.1, Linux x64, Chromium 156.0.8078.79, AMD EPYC 9V74 (5 exposed logical CPUs), existing esbuild 0.28.2 and Playwright-core 1.65.1. No dependencies installed or updated. Raw environment is `evidence/environment.json`.

## Commands and actual results

Commands run from repository root. All evidence paths below are under `docs/p2/evidence/` in the source delivery, mirrored in `/workspace/deliverables/bnt-p2/evidence/`. `commands-and-exits.json` records raw exits.

| Command | Exit | Actual result |
|---|---:|---|
| `npm test` before implementation | 0 | 630/630, 0 failures/skips; 329.23 seconds |
| `npm test` during implementation verification | 0 | 674/674, 0 failures/skips; 433.65 seconds (concurrent correctness jobs; not performance baseline) |
| `npm test` frozen runtime | 0 | 674/674, no failures/skips; 345.16 seconds on frozen `ec25d77` |
| `node --test tests/p2.test.js` | 0 | 44/44 final targeted tests |
| `node scripts/p2/references.mjs` | 0 | 12 historical + 2 payroll replay checksums matched |
| `node scripts/p2/native-equivalence.mjs` | 0 | 6 full native Worker-vs-frozen-P1.4 race/replay comparisons |
| `node scripts/p2/checkpoint-compat.mjs` | 0 | 18 checkpoint files byte-identical and 10-tick restored continuations identical |
| `node scripts/p2/browser-native.mjs` | 0 | 100 Node/Chromium championship-clock states, 3 full captures, delayed-Sign replay/checkpoint |
| `node scripts/p2/geometry-browser.mjs` | 0 | 4 course configurations × 5 DPRs = 20 browser cases |
| `node scripts/p2/layout-browser.mjs` | 0 | Actual embedded Worker, countdown, pause acknowledgment, tail, exact step; widths1440/1024/768/390 without horizontal overflow |
| `node scripts/p2/assets-browser.mjs` | 0 | 15 DPR/CSS-zoom combinations plus mask/failure/eviction groups |
| `node scripts/p2/asset-integrity.mjs` | 0 | Missing bytes, payload hash, actual dimension and source hash rejection; encoded duplicate deduplication |
| `node scripts/p2/scene-browser.mjs` | 0 | 12 synthetic composition/wreck scenes: native digest unchanged, player target retained |
| `node scripts/p2/durable-browser.mjs` | 0 | 5 actual DPR contexts; real UI/coordinator delayed commit and failed-write authority checks |
| `node scripts/p2/browser-faults.mjs` | 0 | 6 failure/restart/Sign/offline groups; direct-file navigation recorded separately as unavailable |
| `node scripts/p2/art-parity.mjs` | 0 | 8 ordinary 4× full viewer races, early display-label-only build; exact classifications/checksums |
| `node scripts/p2/art-parity-fast.mjs` | 0 | 12 full final-artifact Worker races; complete replay-export hashes and classifications match |
| `node scripts/p2/legacy-browser-compat.mjs` | **1** | P1/P1.2/P1.3 child exits0; P1.1 child exit1 at obsolete default-zoom assertion (`6` vs P2 `8`) |
| `node scripts/p2/build-verify.mjs` | 0 | Two reproducible builds, E4 alias equality, embedded Worker byte parity and protected source diff check |
| `node scripts/p2/browser-performance.mjs` | 0 | 108 sequential controlled windows, no page/session errors; cache and fixture identity checks passed |

No existing test assertions or golden references were changed. The initial legacy wrapper also failed because P2 puts setup controls inside generated collapsed details; the wrapper now opens those details while retaining original assertions. It deliberately retains P1.1's old zoom assertion and reports its nonzero exit; the rest of that child does not run. Other endurance/Sign behavior is covered by existing Node and P1.3/browser tests. This is not an entirely green legacy browser suite.

## Historical/native determinism

All historical references below were re-executed, not inferred from documents.

| Kind | Reference | Expected = actual |
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

Six complete native Worker captures/replays matched the frozen reference; checkpoint wire compatibility is independently checked on 18 real checkpoint records.

| Course | Format | Entrants | Ticks | Native checksum |
|---|---|---:|---:|---|
| oval | Pure | 4 | 1775 | `fe2c019d` |
| oval | Combat | 8 | 1841 | `7b871ef5` |
| C01 | Pure | 8 | 3260 | `8101e90c` |
| C01 | Combat | 8 | 3260 | `51624d65` |
| rally-short | Combat | 8 | 1421 | `4d56ce44` |
| rally-long | Combat | 8 | 4544 | `2c2d30ab` |

Final HTML: four variants per course (P1.5 reference, P2 artwork on, off, forced decode failures). The accelerated harness drives the real embedded Worker/presentation-credit interface; it is not a synthetic outcome calculator or a timing benchmark. All four variants matched complete replay bytes, classification, tick and checksum:

| Course | Ticks | Browser checksum | Complete replay JSON SHA-256 |
|---|---:|---|---|
| oval | 1841 | `7b871ef5` | `aef89ec1ccc2ae3c1f7b4128e17d841b6fdf7a24341b35272928cb10b4bd4764` |
| C01 | 3260 | `51624d65` | `da98d75fa7adc0769a908224d9f36b2a842b47c602e18b232676e119265409f3` |
| rally-long | 4544 | `c5095aaa` | `583350666e278fa62d2f28e85cb7641a6d761ad38336d40968a794f065fae304` |

The inherited seed145 tactical Long Rally Node/Chromium discrepancy remains unchanged: Node `2c2d30ab`, Chromium `c5095aaa`. P2 compares within the supported runtime and does not update accepted references or claim general cross-runtime equivalence. The separate versioned championship-clock cross-runtime checks passed.

The embedded P1.5 Worker SHA-256 is **`6e30c8cb43110f294c94cc3b02d58a841644a9efe9aefebb88c72925e9be99b8`**, byte-identical to the frozen P1.5 HTML. `git diff 5d556f3 -- src/sim src/ai src/track src/replay src/core src/career src/persistence src/prototype` is empty at the runtime revision. No native input, RNG, collision, commentary, checkpoint, financial or protected-history source was changed.

## Geometry, assets and committed authority

- Actual Chromium contexts used DPR1/1.25/1.5/2/3; backing DPR caps at2. CSS zoom1/1.25/2 tested pointer inverse mapping, border/padding scaling, Canvas backing size and map/main transforms. Browser toolbar zoom and Windows display scaling remain unverified.
- Native road samples fit map bounds on oval, circuit and short/long rally. Eight competitors remain represented. Synthetic one/two/eight-beast and wreck/retired-player scenes leave native digests unchanged; these are presentation boundary tests, not claims that synthetic damage came from a full race.
- Dedicated livery-mask pixel test confirms visible recoloring inside the mask and byte-identical anatomy/ink outside it. Missing/corrupt/delayed images settle loading, report fallback and do not spend Signs or advance ticks. Repeated course swaps and explicit eviction/rewarm remain within all cache bounds.
- Build asset tests validate manifest/source/runtime hashes, PNG CRC/inflate/dimensions, XML/SVG structure, local references, forbidden content and budgets. Actual missing-file/hash/dimension/source-hash fixtures reject. Identical payloads deduplicate without losing separate IDs.
- Real E4 UI uses a disposable synthetic four-entrant career in fresh browser contexts. The existing explicit migration initializes only that test fixture. A test-only backend commit delay holds both Canvas views at committed tick0 while prepared tick25 exists. Acknowledgment advances both to25. Artwork toggle changes no durable bytes. Injected quota denial preserves committed frame/records. No owner career is read or migrated.
- `browser-faults.json` records successful offline Worker continuation after HTTP initial load and input/restart behavior. This establishes no runtime network dependency in that context; it does not establish Windows file-origin acceptance.

## Art/build size and reproducibility

Temporary proof payloads: **28,640 raw bytes**, **38,396 embedded data-URL bytes**, **1,649,920 estimated decoded bytes**, 8 image assets plus 3 built-in fallback definitions. No bundled fonts; system fallback is explicit. Initial art is well below the provisional4MiB budget. Cache byte accounting estimates surfaces and does not measure all GPU/browser overhead.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `dist/Blood-and-Thunder-P2-Playable.html` | 529,626 | `2cbdd511606a4a1131fd9168323d3100e12402c6efc6ccf91e9eeaa0041932fe` |
| `dist/Blood-and-Thunder-P2-Durable-Proof.html` | 1,169,226 | `dd30394daad0660bf5df8e056f25de6da2957ecbc742099c2cad1a036a05e698` |
| `dist/p2-durable/Blood_and_Thunder.html` | 1,169,226 | `dd30394daad0660bf5df8e056f25de6da2957ecbc742099c2cad1a036a05e698` |
| `dist/p2-durable/Blood-and-Thunder-Track-Test.html` | 1,169,226 | `dd30394daad0660bf5df8e056f25de6da2957ecbc742099c2cad1a036a05e698` |

Both P2 durable aliases and companion match; the primary playable HTML intentionally differs because it runs the P1.5 buffered application. Earlier accepted P1.5/production artifacts were not overwritten. Two consecutive P2 builds produce the same bytes. The original normal `npm run build` was not used to overwrite accepted normal artifacts; the P2 companion separately bundles the existing management entry and embedded E4 Worker with the same esbuild toolchain. No lint/typecheck command is configured.

## Controlled performance

| Variant | Speed | Median / worst window draw p95 (ms) | Worst draw (ms) | Frame p99 (ms) | Frames >50ms | Long tasks / maxms | Underruns |
|---|---:|---:|---:|---:|---:|---:|---:|
| reference | 1× | 0.30 / 0.80 | 6.30 | 16.80 | 0 | 2 / 50 | 0 |
| reference | 2× | 0.40 / 0.60 | 7.70 | 16.80 | 0 | 0 / 0 | 0 |
| reference | 4× | 0.40 / 0.70 | 6.50 | 16.80 | 4 | 4 / 98 | 0 |
| candidate | 1× | 1.40 / 3.60 | 31.20 | 16.80 | 2 | 2 / 69 | 0 |
| candidate | 2× | 1.50 / 2.60 | 16.90 | 16.80 | 2 | 2 / 71 | 0 |
| candidate | 4× | 2.00 / 3.50 | 9.10 | 16.80 | 1 | 0 / 0 | 0 |

P2 worst per-window main-draw p95 **3.60ms**, map p95 at most **0.40ms**; below the provisional8ms draw target. The richer renderer costs roughly1–2ms more per-frame than the simpler P1.5 view in these samples. P2 worst main draw was31.2ms (tile/cache work included), not a claim that every frame is under8ms. Both variants have occasional >50ms frame intervals/long tasks. P2 has5 intervals >50ms and4 long tasks (maximum71ms), versus reference4 intervals >50ms and6 long tasks (maximum98ms); neither has an interval >100ms or an underrun in these windows. This is acceptable engineering evidence for owner review, not proof of imperceptible hitches on every machine.

Maximum estimated P2 cache occupancy was **13,634,250 bytes** (budgets held). Maximum reported page heap: reference **111,856,796 bytes**, P2 **127,165,900 bytes**. These single-run high-water observations do not establish a leak or a precise private memory delta. Async asset decode wall samples ranged14.0–42.3ms (parallel tasks; do not sum them or interpret them as main-thread CPU blocking). Median checkpoint setup was0.65–0.73s; maximum P2 setup2.204s, reference2.208s. Setup is dominated by existing native restoration/preparation rather than an ongoing presentation cost; this audit does not redesign it.


Method: same native checkpoints from six configurations (oval Pure4/Combat8, C01 Pure8/Combat8, short/long rally Combat8), early/middle/late, 1×/2×/4×, 1.6-second sequential observation windows per variant; 108 windows total. No concurrent verification jobs. Native restore/setup and initial Worker fill excluded from playback windows but setup latency recorded. Actual HTMLs use the same1440×1000 viewport and their own intended presentation defaults. Native button handlers invoked without automation auto-scrolling; page remains at the race view. These are single observations per cell, not statistical repeated trials or a guarantee of zero hitches. Underlying shared-host load is not controlled.

Draw statistics come from the existing P1 measurements, not an invented frame estimator. Browser `performance.memory.usedJSHeapSize` is approximate page-reported heap, not a separate measurement of private Worker/GPU memory. Native history/buffer memory remains present. Full viewer runs under concurrent correctness load are parity evidence only, not controlled before/after performance results.

A separate controlled late-stage4× pass used `BNT_P2_WORKER_SAMPLE=1 node scripts/p2/browser-performance.mjs` (exit0): 12 windows, six native fixtures × P1.5/P2. A test-only receive observer records existing Worker packet timings without changing Worker source/protocol. Both variants yielded758 tick samples: median0.5ms and p951.1ms. Maximum native step sample was141.2ms reference /140.0ms P2; these include existing periodic digest work. This distinguishes Worker computation from presentation cost, not a pure-physics-only profiler. Raw samples and digest timings are in `worker-timing-windows.json` / `worker-timing-summary.json`.

## Failures, corrections and limits

- Initial new P2 snapshot tests found omitted RU identity/equipment fields. The snapshot was corrected to preserve them; final44/44 tests pass. Original tests were not weakened.
- Early build offline scanning falsely interpreted a JavaScript string containing `url(` as CSS. Scanner now separates script text from markup/CSS while retaining external-resource rejection tests. Final standalone validation passes.
- A diagnostic scene harness needed closing-script escaping; fixed before its final12-case pass. An early full-viewer run was deliberately restarted to correct the forced-failure asset IDs; the mixed original log retains that interrupted-run trace. Successful8-row viewer JSON and final12-row/hash proof are separate evidence, not a claim that the canceled invocation passed.
- Legacy P1.1 browser exit1 is explicitly retained for its old zoom-default assertion. Final new Worker/layout/asset/durable tests pass. No all-browser-green claim is made.
- Managed Chromium `file://` navigation failed with `ERR_BLOCKED_BY_ADMINISTRATOR`. Windows Chrome/Edge direct-file play, browser toolbar zoom, subjective legibility, final art approval and perceived smoothness remain owner acceptance checks. No Windows acceptance is claimed.
- No approved final artwork/WOFF2 supplied; temporary assets and system fonts are intentional. No animation catalog, equipment appearance catalog, final typography, P3/P4 management/upgrades or new persistence behavior is delivered.

See `BNT_P2_Windows_Acceptance.md` for the specific offline procedure. P2 stops for owner review; no remote action is authorized or performed.

## Gate disposition

- P2-A geometry/camera: PASS in available Node/Chromium tests.
- P2-B chronological layout/HUD/controls: PASS; exact native references and input behavior retained.
- P2-C embedded proof assets/validation/DPR/shared durable rendering: PASS in available tests, with labeled generic/art/font fallbacks.
- Performance: PASS against provisional draw budget in measured workloads; occasional long tasks remain, owner smoothness review pending.
- Standalone: reproducible single-file build and offline managed browser interaction PASS; Windows direct-file acceptance UNTESTED/PENDING.
- Legacy browser aggregate: NONZERO (one obsolete default-zoom assertion); not represented as a wholly passing suite.

**Disposition: ready for bounded owner review; conditional on Windows direct-file and subjective presentation acceptance.** Do not treat this as authorization to merge, push, publish or begin P3/P4.
