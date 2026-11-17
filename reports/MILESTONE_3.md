# Milestone 3 — Combat and Physical Consequences

**Status: implementation ready for owner review; acceptance remains blocked by T25 direct-file browser policy.** The owner authorized M3 after the M2 report. M4 has not begun. No environment configuration was edited or published.

## Implemented behavior

- One engine and physics path for both formats. Pure rejects deliberate attack/ram intents while retaining incidental damage. Combat adds autonomous close attacks, adjacent lateral rams, defense and disengagement, with legal candidates filtered from perceived state.
- Contested attack/defense effectiveness, bounded seeded noise, deterministic initiative/invalidation, cooldowns and a defensive reaction budget shared across the full tick. Engage Rivals now influences actual legal combat choices; it remains illegal in Pure.
- Separate energy-based physical impacts and margin-based attack damage. Directional exposure targets driver, chariot or an individual beast. Protection, toughness/durability, grip and condition-dependent resilience affect outcomes. Damage refreshes performance immediately.
- Normal/Unstable/Out of Control/Disabled consequences, chronological control recovery, braking while out of control and corner-loss crash escalation.
- Retirement produces a stationary persistent one-tile wreck at the final legal position. Registry anchors are checked on every subevent. Secondary impacts can damage wrecks and disable approaching RUs but never displace or despawn existing wrecks. Continuous stationary contact is deduplicated; renewed impacts receive unique IDs.
- Same-time physical contacts use shared pre-effect inputs. Conservative movement reservations are distinguished from physical impacts. Chain/event-budget overflow is an explicit integrity error.
- Weighted intermittent debris/animal/spectator incidents with eligible placement, duration, visibility, path obstruction and impact effects. Random clocks and expiration are integrated into the chronological resolver; scheduled scenarios use the same placement checks.
- Explicit blocked/stalled/time-limit safeguards retire unresolved racers with reasons rather than manufacturing finish times. All-retired classification works. Post-finish physical disablement preserves the already locked official result.
- Canvas wreck/incident markers, DNF rows, damage/control/condition diagnostics, consequence counters and new-race impact-scale/incident-rate controls. Exported setup/commands/events include consequence and incident configuration.

New modules: `src/sim/consequences.js`, `src/sim/incidents.js`. Updated: simulation/scheduler/invariants, AI/signs, event copying/provenance, viewer, fixtures and browser runner. Central coefficients and engineering assumptions are documented in `ASSUMPTIONS.md`; reproduction details are in `DEVELOPMENT.md`. Original numbered production specifications are unchanged.

## Executed validation

Node 24.22.1, npm 11.9.0, managed Chromium 156.0.8078.79; simulation version **0.3.0-m3**.

| Command / check | Result |
|---|---|
| `npm test` | **79 passed, 0 failed, 0 skipped** — 34 isolated foundation regressions, 17 autonomous regressions, 28 new M3 checks |
| `npm run build` | Passed; **100,586-byte** `dist/Blood_and_Thunder.html`, one embedded runtime artifact |
| `npm run test:browser` | **Exit 1 — T25 blocked**; **11 functional browser checks passed** through the labeled HTTP diagnostic fallback |
| Pure browser vs Node | Exact setup/command/event/checksum match for default seed 145 |
| Combat browser vs Node | Exact match for seed 145 with pre-race Engage Rivals |
| High-damage UI scenario | Seed 145, Clear, Pure, impact scale 1: **3 persistent wrecks**, 3 DNFs and 5 finishers; visible wreck crosses and DNF rows inspected |
| Browser errors/network | Zero page JavaScript errors, zero runtime network requests including initial document load |
| Controls/layout | Start/pause/step/reset, sign queue/activation/lowering, export, new-race tuning; 800 px viewport without horizontal overflow |

M3 acceptance cases T10–T15 pass. Additional tests cover repeated/new impacts, secondary wreck chains, all-retired races, full lane blockage, reaction budgets across separate subevents, defense effectiveness and invalidation, individual damage/impairment, chronological incident placement/expiry, physical finish/contact ordering, corner crash-to-wreck, control recovery, simultaneous contact groups, exact seeded reconstruction and entrant permutation invariance. E03–E08/E11/E13/E16 receive relevant full-consequence coverage. Full M4-only cases remain unclaimed.

The legacy M1 movement-only fixtures now explicitly set `consequences: false`; this preserves their isolated contract rather than pretending they exercise the new damage path. M2 regressions and all new M3 integration scenarios run with default consequences enabled. Reference drivers remain test scaffolding, never the application default.

## Reference evidence

Default seed **145**, no player commands, three laps:

| Format | Final clock | Attacks / successful | Damage events | Finishers / wrecks | Checksum |
|---|---:|---:|---:|---:|---|
| Pure | 142.8 s | 0 / 0 | 8 | 8 / 0 | `0d147813` |
| Combat | 142.8 s | 12 / 3 | 11 | 8 / 0 | `bb922447` |

Combat with pre-race Engage Rivals has checksum **`9640edfa`**, matching the browser exactly. No incidental hazard happens in these particular default runs; forced schedules and positive-rate repeatable scenarios verify incident behavior separately. Samples demonstrate correctness, not approved numerical balance.

Current evidence: `reports/milestone-3-reference.json`, `reports/milestone-3-browser.json`. Local screenshots: `artifacts/m3-grid.png`, `artifacts/m3-results.png`, `artifacts/m3-combat.png`, `artifacts/m3-wrecks.png`. Earlier reports are preserved as historical M1/M2 evidence and do not describe the current HTML checksum/size.

## Remaining gate and limitations

Direct offline launch remains **blocked**: the actual built file is rejected with `ERR_BLOCKED_BY_ADMINISTRATOR`. The installed managed Chromium policy excludes `file://`; the earlier official Playwright browser download was denied at `cdn.playwright.dev`. A permitted test browser (`BNT_BROWSER_PATH`) or access to install that browser is required to finish T25 here. HTTP diagnostic parity and offline-after-load behavior are useful evidence but do not satisfy direct-file acceptance.

Impact energies, exposure weights, ranges, control thresholds and lethality are provisional centralized engineering defaults. Discrete lane changes, single-tile occupancy and momentum retention are the documented prototype abstractions; no calibrated rigid-body dynamics or displacement of wrecks is claimed. The visible interface remains a development viewer.

Full commentary, replay UI/checkpoint verification, comprehensive developer editing/live overrides, portable persistence and final crowded-exit acceptance remain M4. Milestone 3 is not declared fully accepted while T25 remains blocked, and Milestone 4 will wait for owner authorization.

Review **`dist/Blood_and_Thunder.html`** and this report. To reproduce: `npm ci --cache /workspace/.npm-cache`, `npm test`, `npm run build`, `npm run test:browser`. The final command intentionally returns nonzero while the local-file gate is blocked.
