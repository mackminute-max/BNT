# Blood and Thunder — Master Codex Implementation Brief

**Specification:** v1.0 | **Status:** Approved baseline for implementation planning.

## Codex mission
Implement a deterministic, configurable, explainable, top-down **autonomous chariot-racing prototype**. The player manages a stable's entry rather than steering; enters one RU per race; queues limited Strategy Signs; observes the race and analyzes outcomes. Racing is the primary objective in both Pure and Combat Racing.

### Nonnegotiable output contract
- **Runtime:** vanilla JavaScript ES6+, HTML5, CSS3, HTML5 Canvas 2D.
- **Final end-user deliverable:** exactly **one self-contained `.html`** with inline CSS, JavaScript, and required assets; launch by double-click under `file://` without network, local server, runtime Node, adjacent files, external imports, CDN, or `fetch()`.
- **Development:** modular JS source, Node-based scripts/tests/bundler allowed **only during development**. No TypeScript, Phaser, React, game engine, or framework unless explicitly authorized.
- **Core architecture:** headless authoritative simulation isolated from DOM, Canvas, rendering, commentary, browser storage, and wall-clock/animation frame timing.
- **Quality:** seeded deterministic simulation and replay; mandatory automated tests; actual standalone HTML verification after every milestone; explicit errors rather than fabricated success.
- **Storage:** versioned validated localStorage when available, graceful failures, user-initiated import/export backups.

## Mandatory prototype features
1. RU composition: driver, configurable team of beasts (two by default), chariot, condition, and optional prototype equipment effects.
2. Attributes and derived performance with editable coefficients and transparent calculations.
3. Four-lane oval with segments, lane-specific length/curvature, surfaces, tiles, continuous movement quantities and discrete occupancy.
4. Autonomous utility-scored driver AI, perception, personality, judgment/execution/stress errors, overtaking, defending, pace control.
5. Pure Racing and Combat Racing as rule modes of **one simulator**.
6. Incidental collisions, deliberate attacks only when permitted, reaction budget, component damage, control states, and persistent wrecks.
7. Individual beast fatigue and recovery, driver strain, chariot wear, five weather presets, weighted intermittent incidents.
8. Six queued Strategy Signs with approved accounting and start/finish activation.
9. Common-line race administration, non-staggered standing grid, fractional finish timestamps, ties, finishers/retirees classification, safe post-finish exit.
10. Structured authoritative event log, deterministic replay and diagnostics.
11. Top-down Canvas viewer, prominent horse-race-radio commentary, standings, RU status, signs UI, pause/speed/step, results.
12. Mandatory developer panel: per-component edits, bulk edits, derived stats, AI/physics/combat/environment/sign tuning, paused live overrides, config import/export, batch statistics.

## Explicit boundaries
**In prototype:** configure → race → results → tune/replay, with eight entrants by default, four lanes, three laps (configurable). All race mechanics above must be present.

**Deferred:** stable economy, hiring, shops, repair economy, permanent injuries, persistent roster progression, multi-race runs, permanent upgrades, magic catalogs, additional tracks, full story/lore, audio and visual polish. Do not remove architectural extension points for these features, but do not present placeholders as implemented gameplay.

## Approved decisions
- Normalized 0–100 attributes with neutral multipliers.
- Attribute-specific beast aggregation, coordination, weaker-beast bottlenecks, summed pulling power.
- Continuous speed/acceleration, geometry-based cornering risk, discrete lane/tile occupancy.
- Net fatigue accumulation minus conditional recovery.
- Contested combat and separate physical impact calculation.
- Additive weighted AI utility with sign influence and bounded seeded noise.
- Centralized versioned validated configuration and developer overrides.
- Chronological within-tick events; simultaneous-group resolution.
- Stationary one-tile wrecks persist through the entire race.
- Mandatory tests and explicit diagnostics; selected paused overrides replay-logged.
- Four milestone delivery plan with a tested single-HTML build at every gate.

## Rules for ambiguity
- Prefer the exact rules in file 02, not approximate interpretation.
- Use file 03 for implementation guidance, but do not treat sample numeric coefficients as immutable balance.
- Record each open engineering assumption in an `ASSUMPTIONS.md` during development, including rationale, default, configurable range, test, and whether it affects gameplay.
- Escalate ambiguities that would change approved mechanics, race fairness, player control, or distribution. Routine reversible numeric defaults may be selected and documented.
- Do not replace physics/AI with animations, remove wrecks, skip AI perception, grant signs guaranteed obedience, or make Pure Racing damage-free.

## Definition of done
All mandatory acceptance cases in file 05 pass; milestone reports and known limitations are honest; developer controls and replay work; actual final HTML launches offline with zero external runtime dependencies; racing and damage outcomes match headless tests for the same seed and command log. Refer to file 07 for release checklist.
