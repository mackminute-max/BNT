# BNT — P1.1 Implementation and Presentation Summary

P1.1 implements a versioned prototype pacing profile plus fatigue/HUD and camera refinements. It reuses the existing native simulation and fatigue formulas. It does not introduce a second fatigue system, race engine, persistent mid-race saving, progression or upgrade catalog.

Branch: `feat/p1-1-pacing-presentation`. P1 baseline: `11fdec4f433850ac1272666b9fb4505cf18f8526` (runtime `bb39003c93d353cb35a8f4a853ab11ecca8b7976`). P1.1 implementation: `fce3ae7e87ba4a6c3b0877431c6c890fe5ee0287`. No merge, push or deployment.

## Architecture and changed files

- New `src/prototype/pacing.js`: deeply frozen configurable `p1.1-endurance-v1` profile, explicit legacy profile, pure mean-fatigue display adapter and presentation bands.
- `src/prototype/session.js`: supplies the profile through existing native `autonomous` and `config.tuning` inputs, records a previous native fatigue sample for presentation trend, exports pacing version. All racers in a prepared prototype race use the same profile; this is not a player-only advantage.
- `src/prototype/app.js`: gauge value/status/trend and per-beast diagnostics, zoom input and closer camera. Existing Sign controls, manual start/step/speed, commentary, standings and comparison remain.
- `src/prototype/view.js`: cached native-segment terrain ribbons, analytic heading, procedural cart/wheel/shaft/beast silhouettes in the main view. The tactical map retains colored competitor dots and Sign Points.
- `src/prototype/index.html`: horizontal accessible endurance gauge, text/arrows in addition to colors, zoom slider 4–10 (default 6 rather than 3), terrain legend.
- New `scripts/p1-1/`: controlled pacing matrix, replayable same-fixture checks, two-RU lead-reversal proof and Chromium presentation checks.
- New `tests/p1-1.test.js`: profile isolation, native exertion/endurance/impairment, display/trend/bands, fixed-tick repeatability, whole-race strategy comparison and analytic heading checks.
- Updated only the distinct playable prototype HTML. Production HTML aliases and native production defaults are untouched.

## Diagnosis and correction

Existing `sim/environment.js` integrates each beast's native fatigue using exertion, load, weather, terrain roughness, base endurance and condition. `model/ru.js` impairs effective beast attributes and driver/chariot function; movement uses those derived values. AI has existing fatigue-sensitive utility. These systems were present, not missing.

At baseline, impairment was modest and Push the Pace often selected Sprint for prolonged periods. Maintain/Push differences could be erased by shared corner speed caps. Sprint explicitly bypasses the normal safe-corner target limiter (`sim/race.js` motion), but still incurs native corner evaluation, risk/control loss and fatigue. That distinction is retained, not silently removed.

The prototype profile increases aggressive exertion, strengthens existing impairment/AI fatigue sensitivity, improves Conserve recovery and its pace, and leaves Maintain generation close to baseline. No arbitrary finish-time penalty or artificial winner is applied. See the numerical tuning and balance reports.

## Presentation and data integrity

Gauge = `100 − arithmetic mean(beast.fatigue)` on the native 0–100 scale. Individual values remain visible in HUD/diagnostics. Trend compares the current native sample with the immediately preceding native tick, not wall time. Pausing leaves it unchanged and labels it as the last native tick. Fresh/Working/Fatigued/Exhausted bands are configurable presentation labels only, not eligibility or injury rules.

The default camera scale doubles from 3 to 6; the slider changes only the rendering transform. Cart silhouettes rotate from the tangent between native analytic points at q and q+0.001. They show wheels, body, shafts and the pulling beasts. Visual bounds are not collision geometry. Camera fallback/easing remains intact.

Terrain colors come from actual compiled segment terrain via native location lookup; a legend identifies dirt/gravel/sand/mud/stone. No random decoration, false hazards, new grip effects or world-coordinate changes. Static ribbons are cached per prepared track, not rebuilt every frame.

## Compatibility, scope and limitations

Core `src/sim`, `src/ai`, `src/model`, `src/config`, `src/career`, `src/persistence` and historical references are unchanged. P1.1 deliberately changes outcomes for the new prototype profile through existing supported configuration. Legacy profile and production defaults retain their historical behavior/checksums. No goldens needed revision.

Queued Sign activation, three-use default, replacement/cancel/no-refund, lowering, Rally fractions and native event order remain. An active Sign influences utility; it cannot prevent fatigue or guarantee uninterrupted Sprint. No mid-race durability was added. P1 still has no career/between-race save implementation; existing production persistence remains untouched.

Native digest-related stalls and the inherited Node/Chromium numerical portability limitation remain outside this balance/presentation scope. Windows direct-file acceptance remains required. This is temporary procedural presentation, not final art. Stop before P2.

## Build

`node scripts/p1/build.mjs` produces `dist/Blood-and-Thunder-P1-Playable.html` (now labeled P1.1). No server, assets or Node installation is needed to play the supplied HTML. The previous P1 artifact remains recoverable at its baseline commit; historical accepted evidence was not overwritten.

Current artifact: 188,835 bytes; SHA-256 `1cd2aa0ed8c4342509c1be72b1f02b6be09e9f7f812e93bcff90081e0912aeca`.
