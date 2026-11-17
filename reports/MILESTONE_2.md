# Milestone 2 — Autonomous Racing

**Status: implementation ready for review; acceptance blocked by T25 local-file browser policy.** The owner explicitly authorized M2 after the M1 report, so the existing file-launch blocker was carried forward. M3 has not begun. No environment configuration was changed or published.

## Delivered behavior

- Default races now use autonomous utility-scored drivers with six validated personality tendencies; explicit reference-driver mode remains available for M1 regression fixtures only.
- Awareness/weather-filtered perception, periodic strategy, per-tick tactical threat checks, and reconsideration after within-tick blockage/control/sign events. Decisions include candidate score breakdowns, perceived context, selected pace/racecraft, separate judgment/execution/stress errors, and physical failure reasons.
- Conserve/Maintain/Push/Sprint pace, hold/inward/outward/overtake/defend/yield/avoid intentions, goal persistence, lateral cooldown and clearance before returning into a passed driver's lane. Physical execution remains authoritative and may reject intentions.
- Individual beast fatigue generation/recovery, independent driver strain and chariot wear, bounded values and refreshed performance impairment. Actual elapsed subintervals are integrated once.
- Clear, Rain, Heavy Rain/Mud, Dust/Wind and Extreme Heat presets affect grip, visibility, rolling performance and exertion. Validated segment surface overrides affect grip/roughness/rolling resistance.
- Six Strategy Signs with successful queue/replacement accounting, separate Pending/Active state, next-crossing activation, pre-race starting-signal activation, cancellation without refund, free immediate lowering, Pure legality, and deterministic paused-command recording. Influence is additive utility, scaled by Tactical Discipline and configurable global/per-sign strength; physical stats are never directly boosted.
- UI: weather/format selectors, sign controls and allowance/compliance display, fatigue/strain/wear and perceived AI diagnostics, preliminary new-race fatigue/global sign/error/noise/per-sign tuning. Controls apply through validated setup or boundary commands.
- Captures include weather, surfaces, tuning, personality inputs and ordered sign commands; headless reconstruction reproduces events/checksum. Full replay UI/checkpoints/divergence diagnostics remain M4.

Centralized defaults and provisional decisions are documented in `ASSUMPTIONS.md`; development commands and APIs are in `DEVELOPMENT.md`. The numbered production specifications remain unchanged.

## Executed checks

Node 24.22.1, npm 11.9.0, Chromium 156.0.8078.79.

| Check | Result |
|---|---|
| `npm test` | **51 passed, 0 failed, 0 skipped**: 34 foundation regressions plus 17 autonomous-racing checks |
| `npm run build` | Passed; `dist/Blood_and_Thunder.html` is **71,261 bytes**, one inline-script HTML with embedded CSS/Canvas graphics |
| `npm run test:browser` | **Exit 1 — T25 file-launch blocked**; functional checks use explicitly labeled HTTP diagnostic fallback and offline execution after loading |
| Artifact vs Node | Default eight-entrant race matches setup, commands, events and final checksum exactly |
| Browser controls | Start/pause/step/reset, pre-race sign queue/activation/lowering, export and new-race weather/global/per-sign tuning verified |
| Browser errors/network | Zero page JavaScript errors and zero runtime requests, including initial document load |
| Layout | 1440 px screenshots reviewed; 800 px viewport has no horizontal overflow |

M2 tests cover T07/T08 fatigue/recovery, T09 weather, T16/T17/T18 sign lifecycle, E09 Pure sign rejection, separate error categories, hidden hazards, personality differentiation, stable entrant-order behavior, bounded lane switching, surface effects, elapsed-time partitioning, retirement sign protection, and exact replay of paused queue/replace/cancel/lower commands. Full prior M1 tests still run using explicit reference-driver fixtures. Every weather preset also completes a repeatable one-entrant race.

Issues found and corrected during testing: compliance incorrectly overwritten after an execution failure; repeated lane switching during overtakes; diagnostics causing narrow-screen overflow. All affected checks pass now.

## Deterministic reference

Default setup, seed **145**, no player commands, simulation **0.2.0-m2**. The exact current values are recorded in `reports/milestone-2-reference.json`; bundled-browser parity is recorded in `reports/milestone-2-browser.json`. These reports supersede the historical M1 checksum. The current build completes all eight entrants and legally clears them; this is deterministic engineering evidence, not final balance approval.

## Remaining limitations and review gate

- T25 remains **blocked**: managed Chromium rejects the actual built `file://` URL with `ERR_BLOCKED_BY_ADMINISTRATOR`. The previously attempted official test-browser download was denied for `cdn.playwright.dev`. A browser that permits local files, or access to install the official test browser, is required for actual offline file acceptance. HTTP diagnostics do not satisfy this gate.
- Combat actions, impact damage, disablement/wreck creation and incidents are M3. Engage Rivals is rejected without charge in Pure; in Combat it can be queued/activated but is explicitly **Inapplicable** because combat candidates do not exist yet. No attack or damage mechanic is claimed.
- Full developer editing/live overrides, persistence, comprehensive replay UI, commentary and final exit acceptance remain M4. Existing M1 contact/clearing limitations continue to apply.
- Visibility currently uses an omnidirectional bounded tile-distance model; coefficients and all utility/rate defaults are provisional and configurable. Tuning controls create a new race rather than modifying a running race.

Review `dist/Blood_and_Thunder.html` and the report. M2 is not declared fully accepted while T25 remains blocked, and M3 will wait for owner authorization. Historical M1 evidence is preserved in `reports/MILESTONE_1.md` and its JSON reports; its artifact size/checksum describe that earlier build, not the current HTML.
