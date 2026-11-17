# Track System Expansion and Standalone HTML Test Build

## Implementation

Simulation `0.6.0-tracks`, package `0.6.0`, based on source revision `c97de28928935fdcecbc70b565ef7797ffa9aaa5`. The baseline passed 203 tests. Its source, tests and artifact hash are preserved in `baseline/`. Numbered establishment specifications and the corrected Circuit/Rally engine were reviewed before extending it. The repository is vanilla JavaScript/Canvas; its architecture and dependency choices remain intact.

The existing authoritative engine supplies movement, discrete lane/tile occupancy, lane-specific corner travel, collision ordering, AI, damage, fatigue, weather/surfaces, signs, timing, retirement and clearance. None of their rules or coefficients were changed. `createRace` resolves catalogue selections and applies configurable oval defaults before ordinary overrides. C01–C12 resolve to full course definitions in saved setup, so replay never depends on a mutable catalogue lookup. Legacy four course presets remain importable. Original oval geometry and behavior are preserved.

`src/track/catalog.js` defines three meaningfully different oval dimensions and twelve explicit authored layouts. Existing deterministic polygon filleting creates connected straight/arc geometry. Every circuit has meaningful turns in both directions, distinct geometry and configurable segment surfaces. Radius/length/tiles, laps and segment surfaces remain editable through the existing configuration JSON interface; changing arbitrary dimensions may require corresponding tile/radius edits to retain geometry validity. Distances use the engine's existing metre scale, not invented real-world distances.

| Track | Approximate inside-lane lap length (m) | Left/right turn segments |
|---|---:|---:|
| Short Oval | 331 | 0/2 |
| Standard Oval | 540 | 0/2 |
| Grand Oval | 937 | 0/2 |
| C01 Broken Crown | 952 | 2/6 |
| C02 Serpent's Coil | 1784 | 4/8 |
| C03 Ironhook | 1902 | 1/5 |
| C04 Blackstone Run | 1435 | 3/7 |
| C05 Thunder's Bend | 1473 | 1/5 |
| C06 Widowmaker | 1680 | 3/7 |
| C07 Ashen Ring | 1509 | 1/7 |
| C08 King's Gauntlet | 1837 | 4/8 |
| C09 Red Fang | 1694 | 2/7 |
| C10 The Labyrinth | 1803 | 5/9 |
| C11 Stormbreaker | 1788 | 2/6 |
| C12 Devil's Spine | 1820 | 3/8 |

Turn counts count connected arc segments, not subjective corner names. Circuit geometry includes linked left/right sequences, sweeping arcs, compound turns and tight returns. Terrain cycles add existing stone, dirt, gravel, sand and mud variation. No new terrain penalties or collision rules were added.

## Deterministic Rally generation

`src/track/rally-generator.js` supplies seventeen configurable reusable chunks: three straights, gentle/sharp/hairpin left/right, two S combinations, technical passage, passing straight, rough section, terrain transition, technical combination and fast open section. Chunks use the same analytic straight/arc course representation as fixed tracks. Defaults assemble 6/12/22 chunks for Short/Medium/Long, plus valid start/finish straights. Default seeds 1–100 produced lengths of 693–1025, 1224–1740 and 2283–2942 metres respectively. Individual configurable routes can differ; category is a generation budget, not a guaranteed exact distance.

Generator inputs include a safe-integer seed, category, bounded chunk count, turn frequency/severity, weighted terrain distribution, chunk library, width and retry bound. Profiles are balanced, road and rugged. Terrain uses existing surface profiles only. Seeded keyed draws are separate from simulation RNG and independent of time/global randomness. Generation avoids repeating the last two chunks where alternatives exist. Conservative turn filtering limits severity; eight-unit starting space and terminal clearance geometry are retained.

Each candidate is compiled/validated before use, including connections, radius, start/finish and road-corridor overlap. Bounded retries lead to an explicitly marked, valid straight fallback, retaining failure messages. All 300 default validation seeds succeeded on the first candidate; a separate adversarial regression exercises exhausted retries/fallback. The full definition, generator version, options, chunk list and seed survive configuration and replay export. Geometry remains authoritative on import; regeneration is an explicit UI action.

`src/track/validation.js` checks nonlocal road separation using samples from the same analytic geometry used for simulation and rendering. It reports useful overlap diagnostics and caches diagnostics for immutable compiled tracks. This is a conservative sampled corridor test, not an analytic proof for every possible custom geometry. Existing compile validation still handles continuity, legal turns and segment references.

## Integration and presentation

UI groups three ovals, twelve circuits and three generated Rally categories. Rally controls expose seed, length, terrain, frequency, complexity and Generate/preview. Ready state previews the actual selected course with terrain colours, direction arrows and start/finish. Long Rally Auto/Follow views keep the selected RU readable with an overview minimap; Overview fits the route. Track diagnostics expose ID, seed/recipe, segment count, length, turn counts, terrain distances, minimum/maximum width, validation, race status and tick count.

All tracks retain **four physical lanes of constant width**. “Narrow passage” means a technical passing window; “wide passing” means an open straight, without inventing lane merges or silently narrowing occupancy. Diagnostics explicitly show equal minimum/maximum width. This follows the task's compatibility qualification for variable widths.

Rally checkpoints reuse existing swept crossing logic at 25%, 50%, 75% of actual generated length. Each activates at most once/RU; pre-race activation, three sign opportunities, queue/replacement/cancellation/lowering and post-final-checkpoint behavior remain unchanged. Closed courses use the existing common line, precise timing and full-lap accounting. Rally terminates without wrapping and clears through the existing terminal extension. Permanent wrecks and explicit blocked clearance remain supported.

## Verification

- Existing baseline: **203 tests passed**. Final full suite: **212 passed, 0 failed**, including nine new regression groups. No existing test was deleted or weakened; the existing configuration-version assertion now uses the exported current version.
- Geometry: **15/15 fixed tracks and 300/300 generated routes passed**; all twelve circuit profiles are distinct, both turn directions present, three unique ordered checkpoints per generated route. Same inputs generate exact equal definitions.
- Complete-race smoke panel: **60/60 Ended, 480/480 finished**, no stalls, integrity errors, invalidated attacks, tool errors or tick-bound terminations. Thirty fixed races (Pure/Combat per track), thirty generated races (ten per category; five Pure/five Combat), representative five-weather rotation. Maximum 14,393 ticks; configured execution bound 30,000. These are compatibility smoke tests, not a balance/casualty study.
- Three baseline reference races (original oval, legacy circuit Combat, legacy Rally) preserve **exact serialized events, RNG state and official classification** against archived 0.5.0 source. Versioned replay checksums intentionally change with the version.
- New regression groups cover fixed catalogue geometry/uniqueness, original oval adapter, configuration round-trip, 300 seed repetition, length/terrain/turn controls, invalid settings and bounded fallback, RNG noninterference, exact generated recipe import/export, all checkpoint cursors/sign uses and seeded replay, plus crossing-corridor rejection. Existing tests cover combat, damage, fatigue, wrecks, precise ties, segment transitions and signs after final checkpoints.
- Replay and retained browser results are recorded in the evidence files; see the completion addendum below.

## Artifact and acceptance

`dist/Blood-and-Thunder-Track-Test.html` and the canonical `dist/Blood_and_Thunder.html` are identical self-contained builds, **210295 bytes** each. SHA-256:

`662829fdc640a42b9f8b9027d3e0670f1c72065a161c381abcd4fb9b396fb04c`

The existing build checks reject external runtime asset references and fetch/dynamic-import/WebSocket usage. All JS/CSS/track definitions are embedded; no runtime libraries, network or adjacent assets are required. Development-only scripts/dependencies are excluded.

Managed Chromium blocks direct `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. The named HTML was actually attempted; HTTP diagnostics followed with networking disabled after initial load. This is browser functional verification, **not independent double-click/offline verification**. Previous owner-confirmed offline operation belongs to an earlier build. Windows direct-file acceptance of this new checksum remains outstanding, as does final owner review. No browser policy was bypassed, and no push/deployment/publication was performed.

Other limits: four fixed lanes, piecewise straight/circular arcs, bounded route size, representative rather than exhaustive weather/roster coverage, sampled overlap detection and unchanged explicit wreck-blocked clearance. Arbitrary custom chunk libraries can exhaust retries and produce the identified fallback. No universal correctness or gameplay-balance claim follows from passing tests.

## Replay completion addendum

**36/36 exported replays passed** exact events, checkpoints and final digest reconstruction, covering every fixed track in both formats and two generated races per length category. Additional checks inspected **2,330,864 RU positions** across all ticks for finite coordinates/speed, legal lane indices and monotonic unwrapped progress (within numerical epsilon). No failures occurred. Event-level reconstruction also verifies that generation did not perturb RNG consumption or command ordering. Complete inputs, checksums, outcomes and validation logs are retained under `evidence/`.

Expanded browser checks: **10/10 check groups passed**, comprising all fifteen fixed selections/steps/previews, seed reproduction/variation in each Rally category, long-course follow/minimap rendering, exact full race browser/Node parity in all three formats, and no JavaScript errors/runtime network requests. Screenshots were visually inspected for course geometry and readable follow view. Direct-file navigation was attempted and blocked by administrator policy. This is not counted as a passing file launch.

Two initial retained browser executions were terminated (`Killed`); their original logs are preserved as `existing-browser-initial-resource-failure.log` and `existing-browser-second-resource-failure.log`. Bounded diagnostics subsequently exposed a real UI defect: repopulating an unspecified oval setup chose the first option (Short Oval), although the loaded race was Standard Oval. This changed a subsequent New race and invalidated the existing baseline parity assertion. The huge deep-equality failure diff exhausted resources before reporting the mismatch. Explicit Standard Oval selection now fixes that refresh path; the retained browser test asserts its initial selection. The failing diagnostic JSON/log is preserved as `existing-browser-selection-failure.*`.

The development browser harness now logs progress and checks a canonical SHA-256 before formatting full replay diffs; it retains the original deep-equality assertions for matching records. This bounds failure diagnostics without relaxing outcome comparison. The final separate retained run completed **23/23 functional checks**, with zero JavaScript errors and network requests, covering all previous viewer/configuration/storage/replay/override/batch/B01–B04 workflows and exact original default race parity. Its command exits **1 by design** because the mandatory file launch is administrator-blocked; `existing-browser.json` clearly reports BLOCKED, not PASS. No remaining functional assertion failed. The expanded browser panel was rerun against the rebuilt corrected selection UI.

Only the selector refresh path changed after the geometry/race/replay workload; authoritative simulation files and generated routes remained identical. The final full automated suite was rerun after the UI fix. Heavy verification should run sequentially.

## Changed-file map

- `src/track/catalog.js`: authored fixed track catalogue and selection data; `rally-generator.js`: bounded deterministic chunk authoring; `validation.js`: shared-geometry corridor validation/diagnostics.
- `src/track/course.js`: reuse existing authoring helpers and preserve generation metadata; `oval.js` / `src/sim/race.js`: catalogue resolution and oval dimension defaults only. Combat, driver AI, kinematics, incidents, damage, fatigue, signs, classification and replay implementations are unchanged.
- `src/config/config.js`, package metadata: version bump; `src/dev/configuration.js`: explicit previous-version configuration import.
- `src/ui/app.js` / `index.html`: selectors, procedural controls, preview arrows, follow/minimap and diagnostics; corrected Standard Oval selection on refresh.
- `tests/track-expansion.test.js`: nine focused regression groups; `tests/courses.test.js`: current version assertion. `scripts/track-expansion/*`: reproducible validation, race, baseline parity, replay and browser evaluation. The smoke harness reuses the existing course worker. `scripts/browser-test.mjs`: bounded failure diagnostics, progress logging and initial Standard Oval assertion.
- `scripts/build.mjs`: emit the requested named HTML alongside the canonical file; both checked-in HTML artifacts rebuilt. Current implementation/development/assumptions/acceptance indexes updated; all historical numbered specifications, audits and existing studies preserved.

The task is ready for owner review with the direct-file acceptance qualification above. No tuning, extra gameplay systems, remote push or deployment is included.
