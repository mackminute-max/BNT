# Blood and Thunder — Four-Milestone Implementation Plan

**Status:** Approved milestone structure and mandatory gates. Codex should execute sequentially; no skipping tests or standalone build checks.

## Preflight — before Milestone 1
- Read every handoff file and both provided vision references when available.
- Identify conflicting legacy requirements; use precedence from `00_README_START_HERE.md`.
- Audit existing source if supplied; otherwise initialize clean modular vanilla-JS development structure.
- Establish deterministic test harness, schema validation, seed control, and **single-file HTML build script** immediately.
- Create `ASSUMPTIONS.md` for configurable engineering choices and `IMPLEMENTATION_STATUS.md` for evidence-based milestone progress.
- Establish automated smoke test for the built file's absence of external runtime dependencies; verify `file://` launch in a real browser when possible.

## Milestone 1 — Simulation Foundation
**Implement:** configuration schema/version, deterministic RNG and event clock; RU/component data and attribute aggregation; derived performance; track/segment/lane/tile geometry; aligned non-staggered standing grid; continuous kinematics, braking, corner risk, swept occupancy and adjacent lane changes; simultaneous conflict resolution; crossing/lap/finish timing; classification; minimal visible HTML/Canvas test harness and event output.

**Required tests:** config validation, derived stat sanity, multi-tile path, same-tile claim, lane swap, no array-order bias, blocked movement, lane-specific turns, rear-row initial crossing, three-lap common-line finish, fractional ties, identical-seed results.

**Gate:** 8 RUs can run to classification on a 4-lane oval; no illegal occupancy; deterministic replay inputs can be captured; offline single HTML builds and launches. AI may use temporary deterministic reference drivers at this stage, clearly identified as temporary scaffolding, not claimed as complete.

## Milestone 2 — Autonomous Racing
**Implement:** perception and visibility; utility-based driver AI with personality, strategic/tactical evaluations, judgment/execution/stress errors, goal persistence; pace/racecraft decisions; individual beast fatigue and recovery, driver strain, chariot wear; weather presets and surface modifiers; six queued Strategy Signs, activation at start/finish, allowance and compliance diagnostics; player signs UI and preliminary developer tuners.

**Required tests:** AI cannot see hidden hazards, legal actions only, personality differences, no systematic lane oscillation, fatigue under sprint and recovery under conserve, five weather presets, pending/active sign transitions, pre-race activation, sign replacement/cancellation/invalid Pure sign, deterministic sign replay.

**Gate:** Autonomous RUs exhibit distinguishable behavior and respond to signs without guaranteed obedience; races remain deterministic; offline HTML builds and launches.

## Milestone 3 — Combat and Physical Consequences
**Implement:** Pure/Combat mode legality; incidental contact, deliberate lateral rams/close attacks/defensive combat; contested resolution and limited reactions; component exposure and damage; control states, disablement; **permanent stationary one-tile wrecks**; secondary impacts without repeated-contact damage; intermittent weighted debris/animal/spectator incidents; full obstruction-aware AI and stalled-race safeguards.

**Required tests:** Pure mode forbids offensive actions, Combat mode supports them, reaction budget/invalidation, weighted component hits, condition effects, crash-to-wreck conversion, persistent occupancy, wreck avoidance and impact, chain reactions, complete four-lane blockage, all-retired race, event chain bounds, same-seed reproduction.

**Gate:** Both formats produce coherent racing and damage outcomes; no wreck cleanup timer, phasing, or silent collision failures; offline HTML builds and launches.

## Milestone 4 — Complete Playable Prototype
**Implement:** polished-enough top-down Canvas viewer; prominent scrolling horse-race-radio commentary driven by events; standings, lap/clock, RU status, sign Pending/Active UI; pause/resume, variable speed, single-tick stepping; post-finish clearing exit; complete race results and technical report; deterministic replay/verification; comprehensive developer tuning panel with individual/bulk edits, derived inspection, AI breakdowns, paused live overrides, configuration import/export, batch runs/statistics; localStorage fallback.

**Required tests:** finishers clear exit without blocking line, wrecks remain, results match simulation, commentary cannot invent outcomes, pause/step correctness, live overrides logged/replayed, config save/import validation, batch headless operation, replay checksums, HTML file opened offline without dependencies.

**Gate:** All acceptance cases in file 05 pass; one complete standalone `.html` delivered with transparent test evidence and known limitations.

## Milestone report required from Codex
For **each** milestone provide: changed modules; features implemented; tests actually run with command and pass/fail counts; test failures and fixes; standalone HTML output path and file size; `file://` browser verification result (or explicit inability to perform it); reproducible seed/scenario; outstanding limitations; updated assumptions and regression risks. Do not claim a milestone complete while mandatory gate tests fail.

## Design and development constraints
Do not defer mandatory mechanics to a hypothetical future milestone. Do not expand into stable economy or roguelite progression until racing prototype gates are complete. Keep all coefficients configurable and avoid broad balancing changes to disguise logic errors. Maintain one authoritative simulator and one code path for both racing formats.
