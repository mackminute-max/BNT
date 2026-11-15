# Blood and Thunder — UI, Developer Tools, Commentary, Replay

**Status:** Mandatory prototype requirements. Visual polish is secondary to readable mechanical feedback.

## 1. Race screen
Use HTML/CSS panels and a top-down HTML5 Canvas 2D race viewer. Show four-lane oval with visible lane boundaries, RU positions and distinct identities, turn geometry, weather/surface cues, incidents, persistent wrecks, and clearing/exit behavior. Use simple silhouettes/shapes first. Animation may interpolate snapshots but never advance authoritative simulation. Default view must remain legible with eight RUs.

### Primary race UI
- Format selector: Pure Racing or Combat Racing before start.
- Configurable entrants/track/weather/seed and starting lineup.
- Play, Pause, Resume, speed controls, **Step one tick** (including while paused).
- Live race clock, current lap/crossing, positions/standings, and RU component condition.
- Player Strategy Sign controls: six-sign catalog (Engage Rivals unavailable in Pure), uses remaining, Pending/Active clearly separate, queue/replace/cancel/lower, next activation at start/finish crossing.
- Show retired RUs in standings and wrecks physically on track; finished RUs continue moving to exit.
- On player retirement, continue race viewing/fast-forward until remaining RUs finish/retire.

## 2. Commentary
Prominent scrolling **horse-race-radio-style** event-driven feed, comparable in importance to viewer. Generate from structured authoritative events, never from inferred positions alone. Prioritize start, lead changes, overtakes, aggressive maneuvers, collisions, crashes, component damage, sign activations, incidents, final lap, finish and DNF. Use variety with cooldowns/priority to avoid repetitive spam; allow full event log inspection. Commentary RNG, if any, must be independent of simulation RNG; commentary on/off cannot change outcomes. Distinguish observed event from commentator flourish without inventing factual game events.

## 3. Developer panel — required
**Component editor:** select any RU, beast, driver, chariot; edit all attributes, condition and supported equipment effects. Bulk action applies a selected attribute value to every eligible RU, clearly displaying scope and validation.

**Derived inspection:** show base values, normalized inputs, beast aggregation, coordination/mismatch, mass/load, derived Max Speed/Acceleration/Handling/Control/Endurance/Resilience/Combat Effectiveness, secondary braking/cornering/fatigue, and every active modifier. Label overrides explicitly.

**Simulation tuning:** edit validated configuration for tick/physics, lane geometry, AI utilities/personality/error rates, sign influence global/per-sign, fatigue/recovery, driver strain, chariot wear, weather/surface grip, incident weights, combat/reaction budget, damage/protection/impairment, lethality, finish tolerance, exit behavior, stall/timeouts. All defaults and ranges documented.

**AI diagnostics:** selected RU perceived state (not omniscient), strategic goal, legal candidates, feature contributions and utility scores, selected action, execution result, active/pending sign, compliance category. Show reason for inapplicable/prevented action.

**Live overrides:** allow only supported nonstructural parameters while **paused**; apply at next deterministic tick boundary. Log tick, simulation time, target, parameter, old/new, command ordering, and config version. Reject invalid edits and edits during unresolved subevents. Structural edits (track lanes, entrant count) require new race. Replay must reconstruct all approved live edits.

**Configuration management:** Save/load/reset test configurations; localStorage when possible, portable JSON import/export. Validate schema/version/ranges; never silently overwrite good state with corrupt input. Provide reproducible seed/scenario metadata.

**Batch testing:** run headless repeated races from panel, choose seed range/list and sample size; display tables/distributions for finishes, overtakes, collisions, attacks, damage, DNFs, wrecks, sign compliance, race duration. Keep UI responsive; do not change mechanics in batch mode.

## 4. Replay
Record immutable race setup/config snapshot, stable entrant IDs, seed and RNG state, track/weather, simulation version, ordered commands and live overrides, structured events, periodic checksums and final checksum. Re-run headless engine for authoritative replay; renderer uses replay states. Support pause, speed, step, reset/restart. Compare expected vs regenerated events and checksums; report first divergence (tick/event/state category), not silent fallback. If event-only viewing is offered, label it as such; deterministic reconstruction remains required.

## 5. Race results
Three views: **Official Classification** (finish time, tied position, DNF/DNS, reason, progress), **Race Narrative** (commentary timeline/major events), **Technical Report** (component condition, fatigue/strain, damage, passes, collisions, attacks, sign uses/compliance, incident and wreck counts, simulation diagnostics). Allow seed/config/replay export.

## 6. Persistence and usability
Use validated versioned browser storage only as an enhancement; `file://` localStorage behavior varies. A failed storage write must not prevent races or corrupt in-memory configuration. Provide import/export buttons for portable backups. Keep controls keyboard-accessible where practical, display concise errors, and make Pause and Step reliable regardless of rendering FPS.

## 7. Acceptance
UI must never mutate authoritative state directly outside validated commands. Signs queued while paused are deterministic. Commentary is subordinate to event log. Wrecks must remain visible after retirement. Finished entrants visibly clear exit. A user must be able to understand what happened, why, and which tunable parameter or decision contributed.
