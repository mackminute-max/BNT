# Blood and Thunder — Simulation Architecture and Numerical Model

**Status:** Approved architecture; illustrative coefficients are *provisional engineering defaults*, not final balance canon.

## 1. Modules and boundaries
Recommended modular development structure:

- `config/`: versioned defaults, validation, scenario/track/RU schemas, migrations.
- `core/`: deterministic RNG streams, fixed-step clock, event scheduler, state invariants, serialization/checksums.
- `model/`: beasts, driver, chariot, RU, condition, aggregation, derived stats.
- `track/`: oval geometry, lane/tile occupancy, surfaces, start/finish and exit zone.
- `ai/`: perception, strategic goals, tactical utility, legality, execution errors, Strategy Sign influence.
- `sim/`: acceleration/movement, swept paths, simultaneous conflicts, contacts, combat, fatigue, weather, incidents, wrecks, race administration.
- `events/`: structured event emitter, event ordering, commentary adapters, replay logs.
- `ui/`: HTML/CSS, Canvas viewer, controls, results, developer panel.
- `tests/`: deterministic unit/integration/scenario/batch tests.
- `build/`: single-HTML packaging and verification.

Simulation functions accept state/config/commands and return next state/events/diagnostics; no DOM, Canvas, `Date.now()`, `Math.random()` or storage reads inside authoritative simulation. Render interpolation is non-authoritative. Keep rendering RNG separate from simulation RNG.

## 2. State model
Minimum authoritative race state: schema/version, seed and RNG state, tick and simulation time, format, race lifecycle status, track geometry, environment, entrants with stable IDs and component conditions, continuous speed/position, lane/tile occupancy, strategic intentions, AI perceived snapshots, signs and allowance, race crossing/lap/finish records, stationary wrecks, hazards, ordered event IDs, override/command log, diagnostic counters. Keep competitive state separate from physical occupancy state.

## 3. Fixed-step chronological resolver
Approved logical phases: (1) apply boundary commands and scheduled effects; (2) environment and perception; (3) strategic/tactical intentions; (4) generate physical trajectories; (5) resolve **earliest within-tick** crossing/contact/attack/movement event; (6) apply immediate consequences and recompute affected remaining trajectories; (7) integrate fatigue/strain/wear over elapsed time; (8) administer crossings, finishes, clearing, commit events/checksum.

These phases are **logical**, not a mandate to resolve all damage after all movement. Within one tick, repeatedly process earliest subevent(s), update impacted states, and advance remaining subinterval. Group events at equal timestamps within an explicit tolerance; resolve the group without entrant-array-order bias. Use stable IDs, documented mechanical priority and seeded ties when genuinely necessary. Record event time, tick, within-tick fraction, ID, participants, cause, effects. Bound subevents/tick; overflow is an explicit integrity error, not silently discarded work. Keep RNG consumption stable under entrant ordering, e.g. partition streams by subsystem and stable ID or deterministic event keys.

Movement must check all swept tiles and paths even if velocity crosses multiple tiles/tick; resolve simultaneous claims, swaps, rear blockage, lane-change conflicts, and wreck obstruction. No stored unusable travel after blockage. Re-evaluate contact and state changes at subevent time.

## 4. Attribute normalization and aggregation
For 0–100 attribute `x`, `N(x)=clamp(x,0,100)/100`. Neutral multiplier `M(x;k)=1+k*(N(x)-0.5)` where `k` is tunable and must keep outputs within validated bounds.

Two-beast reference team speed: `S_team=(1-b)*mean(S_i)+b*min(S_i)` with provisional `b=0.30`. Example Speed 90 and 60 → `70.5` (not 75). Team Power sums individual contributions and is adjusted by coordination/load; do not use simple average for all traits.

Illustrative coordination: `C=clamp(0.65+0.25*N(teamDiscipline)+0.20*N(driverHandling)-mismatchPenalty, 0.50,1.10)`; `P_team=C*sum(P_i)`. Mismatch penalty should be a documented bounded function of Speed/Agility/Discipline spread. Agility, Endurance, Discipline each use appropriate attribute-specific weighted aggregation. Individual beast fatigue and damage must affect individual contribution without repeated full-strength penalties downstream.

## 5. Derived performance dependency graph
Primary characteristics: Maximum Speed ← team Speed, Rolling Efficiency, load, condition; Acceleration ← coordinated Power, mass, traction, handling, condition; Handling ← Agility, Maneuverability, Driving, Stability; Control ← Discipline, Driving, Beast Handling, Stability; Endurance ← individual Endurance and fatigue/load; Resilience ← Toughness, Protection, Durability, component condition; Combat Effectiveness ← Combat skill, equipment, position, control. Secondary braking/cornering/fatigue/recovery/collision resistance.

Reference acceleration relationship:

`a_effective = a_reference * (teamPower/referencePower) * massFactor * tractionFactor * handlingFactor * conditionFactor`

Enforce traction and physical limits, with separately configurable acceleration/braking bounds. Reference speed update `v_next=clamp(v+a_net*dt,0,v_max)`; constant-acceleration travel `distance=v*dt+0.5*a_net*dt²`, subdivided/recomputed for impacts and state changes. Use lane-specific distance coordinates, not a universal lane distance.

Reference corner safe speed: `v_safe=sqrt(a_lateral_max*turnRadius)`; lateral capability depends on grip, stability and handling. **Safe speed is not a hard cap**: exceeding it raises instability/control-loss risk, with deterministic seeded evaluation. Inside lanes shorter/tighter; outer lanes longer/wider.

## 6. Fatigue, strain, wear
For each beast `F_next=clamp(F+generation*elapsed-recovery*elapsed,0,100)`; generation depends on pace, load, weather, Endurance; recovery only when exertion sufficiently low. Provisional exertion factors: Conserve 0.45, Maintain 1.00, Push 1.75, Sprint 3.00. Separate driver strain from tactical stress and control workload; separate chariot wear from impact damage. Use elapsed subinterval to avoid double-counting if a tick splits into multiple events. Explicitly document whether condition affects effective power, acceleration, or both; do not stack same penalty repeatedly.

## 7. Combat and impact
Attack score `A=weighted(driverCombat,equipment,position)+seededNoise`; defense `D=weighted(driverSkill,reaction,protection)+seededNoise`; margin `A-D` determines outcome. Reactions have configurable per-tick budget, deterministic priority, eligibility and invalidation. Only permitted actions in selected race format.

Physical impact severity uses `E=0.5*effectiveMass*relativeSpeed²` as an abstract measure (not calibrated joules), modified by geometry, direction, absorption and resistance. Apply weighted targeting to exposed driver, chariot, or individual beasts. Update condition, impairment and control state; generate unique contact ID and guard against duplicate damage for same continuous stationary contact. If disabled, preserve final resolved tile as stationary persistent wreck. Subsequent impacts can damage wreck but cannot displace/despawn it.

## 8. AI scoring
Candidate utility `U(a)=base(a)+Σ(weight_j*feature_j(a))+signInfluence(a)+boundedSeededNoise(a)`; personality adjusts weights. Filter candidate actions for legality **before** selecting. Separate perceived information from actual authoritative state. Preserve tactical goals and switching hysteresis to avoid lane oscillation. Driver error models: misjudgment of observable context, execution failure of a valid intent, and stress-related variability/delay.

Sign influence `I(a)=globalStrength*perSignActionWeight(a)*driverResponsiveness*contextApplicability`, with responsiveness substantially influenced by Tactical Discipline. Signs modify preferences, not speed/damage stats or direct steering. Log utility breakdown and compliance outcome.

## 9. Race crossing and exit semantics
Use **one physical start/finish line** and no grid-relative distance correction. Grid rows aligned, longitudinally spaced. For each entrant maintain `hasEnteredCourse`, `completedLaps`, `lastCrossingTime`, `finishTime`, and monotonic progress. The first valid forward crossing of the common line marks course entry/lap 1; each subsequent complete circuit increments completed laps. At configured target laps, the qualifying line crossing locks finish time. Reject backwards/jitter duplicate crossings. Test front and rear rows explicitly, including within-tick crossings.

After finish, switch to `Finished + Clearing` physical state, no tactical combat/overtaking, controlled forward travel to exit. Reserve sufficient exit capacity and avoid teleporting through occupancy; only remove after legal entry into exit/removal zone. Clearing does not change official finish. Disabled entrants become `Retired + Wreck`, stationary one tile for remainder of race. Stalled/all-blocked races terminate explicitly with reason; do not invent finishes.

## 10. Configuration, invariants, and precision
Central versioned validated configuration with defaults/ranges/units for tick/subevent epsilon, geometry, performance, fatigue, weather, AI, signs, combat, damage, incidents, finish tolerance, timeouts, exit capacity, batch testing. Choose provisional values based on stable numerical behavior, document them in development assumptions ledger and expose them to developer UI. Use full-precision numeric state; round only display. Reject NaN/Infinity, negative impossible mass/distance, invalid IDs, illegal overlapping tile occupancy, non-monotonic time, invalid sign uses, nonpersistent wreck removal. On invariant violation stop and report tick/event/participants/state excerpt; never silently repair core physics.

## 11. Recommended structured events
`RACE_STARTED`, `PACE_CHANGED`, `LANE_CHANGE_REQUESTED`, `LANE_CHANGE_COMPLETED`, `OVERTAKE`, `CONTACT`, `ATTACK`, `REACTION`, `DAMAGE`, `CONTROL_CHANGED`, `RU_RETIRED`, `WRECK_CREATED`, `WRECK_IMPACT`, `INCIDENT`, `SIGN_QUEUED`, `SIGN_ACTIVATED`, `SIGN_CANCELED`, `SIGN_LOWERED`, `LAP_ENTERED`, `LAP_COMPLETED`, `RU_FINISHED`, `RU_EXITED`, `RACE_STALLED`, `RACE_ENDED`, `OVERRIDE_APPLIED`, `INTEGRITY_ERROR`. Exact names may be adjusted consistently; all relevant effects must have structured, verifiable provenance.
