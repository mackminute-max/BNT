# Phase 2 evaluation methodology

This is a measurement-only study of 0.4.2-corrective. Original documents 00–09, implementation status, audits and corrective evidence were reviewed first. No simulation, AI utility, damage/fatigue formula, balance coefficient or browser-runtime source will change. Developer-only scripts wrap the existing engine and reuse its reporting; they do not approximate race outcomes.

## Baseline and resource control

`baseline/source.tar.gz`, `files.sha256`, `working-tree.patch` and Git status preserve the actual dirty working tree, not merely HEAD. Default complete setup/configuration, 144 pre-change tests, artifact SHA-256 and four default-cadence reference runs are recorded before instrumentation.

The study uses checkpointInterval=10000 to reduce diagnostic hashing cost; default application cadence remains 100. This is a diagnostic-only experimental setting. Before instrumentation, identical full event SHA-256 and RNG state at the two cadences are verified for both formats. Same-cadence observed/unobserved runs must match final checksum/events/RNG exactly. All gameplay defaults, eight-entry standing grid, four-lane oval and three full laps remain intact. No damage/incident frequency boost is used.

## Frozen allocation: 1000 actual executions

| Experiment | Pure | Combat | Design |
|---|---:|---:|---|
| A default race behavior | 100 | 100 | 20 matched seeds × five weather presets; default graded RU field |
| B equal-budget beast archetypes | 100 | 100 | 20 roster rotations × five weathers; mixed eight-entry field |
| C equal-skill personality profiles | 100 | 100 | 20 profile rotations × five weathers; identical underlying components |
| S individual-attribute sensitivity | 40 | 40 | Five attributes × four matched conditions × control/+10 pairs |
| D signs and controls | 140 | 140 | 20 matched seed/weather blocks; control + five Pure/six Combat signs; Pure additionally tests 20 replacement/cancel/lower lifecycles |
| E surface/combat/environment | 20 | 20 | Ten matched seed/weather blocks × neutral/degraded composite surfaces |
| **Total** | **500** | **500** | Reference/parity/test executions are excluded from these counts |

The complete jobs file records exact seeds, roster attributes, profiles, initial positions, schedules and setup patches. No assertion that the entire Cartesian product is covered is made. Four workers share the available four-CPU quota. Each race is bounded at 30000 ticks and each worker has a wall-time watchdog. SIGINT/SIGTERM cancellation preserves completed rows; actual completion counts and bounded/error outcomes are reported.

Archetypes invest exactly 300 points per beast across Speed/Power/Agility/Endurance/Discipline/Toughness, with identical drivers, chariots, equipment and six neutral personality values of 50. Vectors: speed [80,40,45,35,50,50], power [45,85,40,35,45,50], handling [45,40,80,40,60,35], endurance [45,40,45,90,45,35], balanced [50,50,50,50,50,50]. Each type appears equally often in each grid slot over the 20 rotations; types can have one or two entries per race. Attributes are experimental RU configurations, not changes to production coefficients.

Personality vectors sum to 300 across Aggression/Caution/Patience/Opportunism/StaminaManagement/TacticalDiscipline: aggressive [85,25,35,70,35,50], cautious [25,90,65,35,55,30], opportunistic [60,30,30,95,35,50], disciplined [40,45,50,40,35,90], balanced [50,50,50,50,50,50]. Components/skills remain identical. These are multi-tendency profiles, not isolated causal tests of each tendency.

Sensitivity changes only player RU1's beast Speed, Power, Agility, Endurance (both beasts) or driver Driving by +10. Other inputs stay matched. Four conditions are Clear/Rain/Heavy Rain-Mud/Extreme Heat; Dust-Wind is not included in this small sensitivity panel. Shared control configurations are deliberately re-executed for each attribute but are not treated as additional independent seeds. The panel is exploratory (four pairs per attribute/format).

Single-sign arms queue exactly once before the signal. Lifecycle arms queue Push at start, Conserve at the first resolved boundary after initial line entry, then replace Pending with Race Defensively one tick later (or cancel and requeue on the next two ticks). After the first completed lap they lower Active for free. Uses stay within three; activation remains controlled by the engine's common line. Pure never queues Engage Rivals. Controls share identical seed/weather/roster and no intervention. All schedules use simulation state/ticks, never wall time.

Degraded surfaces are a declared composite (grip .7, roughness .5, rolling resistance 1.1 on each segment; relative hazard weights north/east/south/west 2/1/.5/.5). Conclusions concern that composite, not isolated coefficients. Weather comparisons in A use the same 20 seeds across five presets; Pure/Combat use the same baseline inputs. E has ten distinct seed/weather paired blocks.

## Measurements and definitions

Official classification, full-precision time, retirements, control, condition, finish fatigue, decision/candidate scores, lane results, signs, combat, incidents and contact damage come from authoritative state/events. Existing statistics supply race counts and final compliance. Event-level physical/sign/finish records are exported, with full runs regenerable from job/configuration/seed/schedule metadata.

Speed is observed at tick endpoints (plus logged corner-speed observations). `maxObservedSpeed` is a lower bound on true within-tick peak. `sampledAverageSpeed` is trapezoidal tick-endpoint integration over competitive time, not exact path integration. On the last partial competitive tick the left endpoint is held rather than using a post-finish/retirement speed. No continuous trajectory hook or gameplay source edit is introduced. Finish/retirement fractions cap competitive measurement time; post-finish clearing is excluded from RU competitive metrics.

Pace durations reconstruct issued pace-preference transitions at AI_DECISION/command event times and end at finish/retirement; they are not proof that target speed was physically achieved. Avoidance time measures persistence of the selected avoid/yield goal, not a distinct physical avoidance mode. Blocked seconds reconstruct the engine's forward-blocked flag from MOVEMENT_BLOCKED until a successful same-tick lane escape or tick end. Lane occupancy durations are left-endpoint sampled (not exact within-tick lane-time). Failed lateral attempts have separate counts and do not automatically count as forward-blocked time.

Overtakes/lost positions use explicit passer/passed events (the engine already observes these at tick boundaries). Start slot is grid order; aligned front-row physical rank is tied. Do not interpret arbitrary front-row column order as a completed pass. Lane reversal means successive successful changes in opposite directions; rapid reversal additionally requires <=2 simulated seconds. Repeated blocked attempts mean the same requested lane (lateral) or explicit target tile (forward) within <=2 seconds, with no intervening successful change. Loop counts are symptoms, not automatic proof of irrationality.

AI periodic/strategic vs tactical evaluation has no explicit phase label. Report timing proxies: first boundary evaluation due according to prior nextDecision, early boundary evaluation, and subevent reaction. Sign-forced due evaluations can enter the first category. Do not assert that these are separate internal planning systems.

Compliance is counted once per decision ID after linked execution reconciliation, including unresolved/null as a separate measurement. Queue/activation/replacement/cancel/lower events are exact. Outstanding signs at competition/race termination are inferred lifetimes, not fabricated expiration events. Raw collision energy is exported per logged damage contact and deduplicated by contact ID for severity summaries; it is an abstract model energy, not calibrated joules. Unlogged no-damage impact energy is unavailable. Defensive contests attempted/successful are distinct from reaction-budget consumption.

## Statistics and inference

Report n, mean, median, sample SD, p10/p90/p95 and empirical 95% bootstrap intervals where useful. Paired comparisons use matched seed/condition blocks, only both-finished pairs for official-time differences, and separately report finish/retirement changes. Nonfinish time is null, never zero or a substituted timeout. For B/C, describe per-entry finish/win/podium rates and finishers-only position, then use seed-cluster resampling for uncertainty; within-race opponents and weather repetitions are correlated. A weather/format contrasts cluster by seed. D sign comparisons use 20 matched seed/weather blocks (four per weather); S has only four pairs and is explicitly underpowered.

Confidence intervals are descriptive Monte Carlo/resampling uncertainty conditional on this chosen workload, not universal significance claims. Rare-event counts and denominators are reported with appropriate bounds/limitations, including a warning about degenerate bootstrap intervals when no events occur. No hypothesis or balance target is assumed from low combat/casualty counts. Separate direct observations, controlled conditional effects, associations and engineering hypotheses. Findings are recommendations only; no tuning is authorized by a result.


## Declared follow-up after primary completion

The primary allocation above remained fixed. Its player RU1 won every sign-control race, exposing a rank ceiling. Before collecting follow-up data, [a rear-row plan](SUPPLEMENT_REAR_ROW_PLAN.md) declared 60 additional Pure/70 Combat races with player RU5. These are separately reported, not silently pooled into the primary design. Total actual executions are 1130; no coefficient changes occur between panels.

An explicit evaluation-output playerId field was added for this follow-up. Primary normalized configurations already record RU1; primary metrics/outcomes remain unchanged. The raw primary file is preserved, and independent reruns permit only this metadata addition and nondeterministic wall time when checking deep equality.
