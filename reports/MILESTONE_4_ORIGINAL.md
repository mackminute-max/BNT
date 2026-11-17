# Milestone 4 — Complete racing prototype implementation

**Status: implementation delivered for review; final acceptance BLOCKED by T25 direct offline launch verification.** The owner authorized M4 after M3. No environment draft was changed or published. The original numbered production documents remain unchanged.

## Delivered

- Prominent trackside radio driven only by structured events, with independent text variation, cooldowns and source event IDs. Overtakes, lead changes, final laps, attacks, wrecks, signs, incidents and finishes have authoritative provenance.
- Readable Canvas viewer with adjacent standings/radio, primary sign controls, weather/format selection, condition/derived/AI inspection and reliable pause/speed/step. Race viewing continues after player retirement. Fast-forward yields, can be paused, and does not permit live edits while advancing.
- Official classification, narrative and technical result views; precise finish/tie/DNF/DNS/progress/reason data; condition/fatigue/strain/damage/sign/incident statistics and portable exports.
- Complete developer workbench: individual or eligible bulk driver/personality/beast/chariot/equipment edits, normalized/derived breakdowns and active modifiers, all supported physics/geometry/AI/sign/fatigue/environment/surface/combat/damage/incident/control parameters, lineup/team/player configuration and validated JSON editing.
- Supported live numeric overrides validate while paused at a resolved boundary, queue without immediately changing state, then record old/new values, tick/time, command order, version and revision at application. Structural settings require a new race. Wreck invariants prevent resurrection/removal.
- Versioned configuration save/load/reset/import/export. Storage failures preserve valid in-memory play and backups. Current components/tuning can be explicitly captured into a new test setup.
- Authoritative replay exports setup/initial RNG, ordered commands/overrides, events, periodic/final checksums and endpoint. Import reconstructs and verifies, rejects corrupt/missing checkpoint evidence and reports the first divergence. Playback supports pause, speed, step and restart; it is read-only, with no event-only fallback.
- Responsive headless batches using the same engine, seed lists/ranges, cancellation retaining completed samples, winner distributions, means, fatigue-at-finish and sign-compliance reports.
- Final clearing behavior brakes for occupied exit cells and preserves official results. Eight closely queued finishers and a blocked exit have full-consequence regression coverage.
- Tunable neutral crowd-morale performance effect buffered by Nerve; no direct crowd interference outside recorded incidents.

New areas: `src/dev/`, `src/replay/`, `src/reporting/`, `src/ui/workbench.js`, `src/ui/clock.js`. Existing engine/configuration/model/view modules were extended. See `DEVELOPMENT.md` for workflow/APIs and `ASSUMPTIONS.md` for provisional defaults, bounds, numerical choices and scoped test modes.

## Executed verification

Node **24.22.1**, npm **11.9.0**, managed Chromium **156.0.8078.79**, simulation **0.4.0-m4**.

| Check | Outcome |
|---|---|
| `npm test` | **100 passed, 0 failed, 0 skipped**: 79 retained regressions and 21 new M4 checks |
| `npm run build` | Passed; **158,049 bytes**, one inline-script HTML with embedded CSS/Canvas graphics |
| `npm run test:browser` | **Exit 1: T25 BLOCKED**; **18 functional browser checks passed** in the explicitly labeled HTTP diagnostic fallback |
| Browser/Node parity | Exact setup/commands/events/checksums for Pure and Combat with pre-race Engage Rivals |
| Browser flows | Signs, pause/step/reset, replay verification/import/restart, live and bulk edits, configuration round-trip/corruption, denied storage, new-race tuning and stepping during batch analysis |
| Runtime resources/errors | Zero additional/runtime requests including initial load; zero page JavaScript errors |
| Renderer separation | Shared presentation scheduler tested at 30 and 144 FPS with identical authoritative outcomes; commentary enabled/disabled does not change state/RNG |
| Exit/admin integrity | Closely queued finishers clear legally; blocked exits/wrecks preserve occupancy and locked results |
| `npm run reference` | **16 completed full default races**, seeds 1..8 in each format; **zero integrity errors and zero stalls** after the braking correction |
| Saved replay readback | `reports/seed-145-replay.json` read from disk, reconstructed and matched to the browser reference |
| Layout/review | 1440 px captures inspected; 800 px viewport has no horizontal overflow |

Tests cover the implemented contracts T01–T24 and applicable E01–E20. T25's static packaging and functional portions pass, but direct offline file execution remains blocked, so neither milestone nor final release acceptance is declared complete. Isolated M1 movement fixtures explicitly disable later consequences; M2–M4 integration scenarios exercise current full mechanics.

## Defect found and resolved

The first 16-race reference batch exposed a seed-3 integrity error in both formats: a moving corner-speed target generated a cascade of tiny velocity-limit events until the 1,024-group safety budget stopped the tick. This was not treated as a passing sample. The engine now schedules the analytic intersection with its braking envelope and then brakes toward the future safe speed. The budget and balance coefficients were not increased. A new full-race seed-3 regression passes in both formats; the repeated batches are clean.

`reports/milestone-4-before-braking-fix.json` preserves the earlier failed evidence and is explicitly historical. Other fixes include immutable event payloads, stale sign-compliance attribution, checkpoint evidence validation, eligible bulk component scope, and canceling old fast-forward transport on pause/new setup/replay import.

## Current reference evidence

Default seed **145**, three full laps, no player commands:

| Format | End clock / ticks | Events | Checkpoints | Finishers | Checksum |
|---|---:|---:|---:|---:|---|
| Pure | 142.8 s / 2856 | 4445 | 30 | 8 | `2cbf0608` |
| Combat | 142.8 s / 2856 | 4232 | 30 | 8 | `49d54817` |

Combat plus pre-race Engage Rivals matches browser checksum **`c902bc37`**. Full reference classifications, technical outcomes, sample rows, batch distributions and the artifact SHA-256 are in `reports/milestone-4-reference.json`; browser evidence is in `reports/milestone-4-browser.json`.

Across seeds 1..8, Pure averages 141.375 s, 64.25 overtakes and 10.625 contacts; Combat averages 141.525 s, 64.75 overtakes, 7.25 attacks and 0.625 successful attacks. All samples finish eight entrants. RU6 wins 5/8 Pure and 6/8 Combat samples. These fixed builds on one reference oval show concentration, not approved balance or a required target win rate. No balance coefficients were changed to conceal that distribution. Elevated-damage and scheduled-incident scenarios independently verify wreck/DNF/hazard behavior.

## Final delivery and remaining gate

- **Standalone:** `dist/Blood_and_Thunder.html` (**158,049 bytes**). Copy only this file for runtime review.
- **Source/tests:** this repository's `src/`, `tests/`, `scripts/`, pinned manifests and documentation.
- **Sample replay:** `reports/seed-145-replay.json` (full event/AI evidence; larger than the game HTML).
- **Checklist:** `RELEASE_CHECKLIST.md`.
- **Reproduce:** `npm ci --cache /workspace/.npm-cache`, `npm test`, `npm run build`, `npm run test:browser`, `npm run reference`.

Actual direct `file://` launch remains **unverified/blocked**. The managed browser returns `ERR_BLOCKED_BY_ADMINISTRATOR`; the earlier official test-browser download was denied at `cdn.playwright.dev`. The project did not alter or bypass either policy. A permitted installed browser (`BNT_BROWSER_PATH`) or independent desktop double-click with networking disabled is needed to finish T25. An HTTP diagnostic, even after taking the context offline, does not satisfy that requirement. A second browser was not tested here.

The racing mechanics, tools and review artifact are functional in the executed checks. Numerical balance remains provisional. Stable economy, hiring/shops, permanent injuries/progression, multi-race roguelite runs, expanded content and audio/art polish were expressly outside this racing prototype and are not represented as implemented.
