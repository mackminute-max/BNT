# Blood and Thunder — Approved Gameplay and Race Rules

**Status:** Binding game rules. Example balancing parameters elsewhere remain provisional.

## 1. Player and racing format
Player owns/manages one entered RU per race; no direct steering or attack button. Autonomous drivers race for position and finish. **Combat Racing:** deliberate lateral ramming, close-range attacks, defensive combat are legal. **Pure Racing:** deliberate attacks and offensive ramming prohibited; incidental collision, injury, weather, hazards, and wrecks still operate. Same engine and physical rules, format-controlled action legality.

## 2. Racing Unit
RU = driver + chariot + draft beast team + equipment + condition. Default **two beasts**, team size configurable. Beast attributes (0–100): Speed, Power, Agility, Endurance, Discipline, Toughness. Driver (0–100): Driving, Beast Handling, Combat, Awareness, Nerve. Chariot: Weight, Stability, Durability, Protection, Rolling Efficiency, Maneuverability, Capacity; Weight/Capacity retain suitable units. Independent beast condition/fatigue, driver condition/strain, chariot condition/wear/damage. Derived: Maximum Speed, Acceleration, Handling, Control, Endurance, Resilience, Combat Effectiveness; secondary braking, cornering, fatigue, recovery, collision resistance. All attributes must have testable impact.

## 3. Track, spatial motion, and starting grid
- Reference four-lane oval; track → segments (straight/turn, turn direction, surface) → lanes (lane-specific distance/curvature) → tiles.
- RU occupies one lane/tile at a time. One RU per tile. Numeric speed and acceleration continuous/fractional; fixed ticks, within-tick crossings and swept-path legality. Traversal over multiple tiles must inspect intervening occupancy.
- Adjacent lane changes only; no intrinsic speed penalty, but legality, geometry, and handling matter. Drivers may brake for turns or exceed safe cornering speed at risk of control loss. Inside turns shorter/tighter; outer turns longer/potentially faster.
- Simultaneous competing intents resolved without entrant-array-order bias, with deterministic seeded ties where necessary. Blocked travel does not accumulate deferred movement for a later burst.
- Standing, **non-staggered** grid: four aligned columns/lane positions per row; eight RUs default = two rows of four, all initially stationary, common starting signal and clock. Rows are longitudinally separated; rear row has a real distance disadvantage, accepted by design. No individual starting-distance credit.

## 4. Race laps and finish eligibility
- Default three completed laps; configurable.
- Every RU must complete the same required number of **full physical laps after its initial start/finish-line entry crossing**, then finish at that same physical line. A rear-row RU's first crossing begins lap 1; it is **not** a completed lap. Apply this initial-entry convention consistently to all grid rows. Count subsequent complete circuits/crossings as completed laps; when completed-lap count reaches target at the physical line, lock finish time. This is the recommended precise algorithm for the approved common-line intent; validate that all entrants make the same number of qualifying circuits and no rear-row shortcut exists.
- Preserve unrounded within-tick crossing time, displayed precision independent of simulation precision. Official ties allowed within configurable small tolerance. Standings must distinguish physical race progress, completed laps, and finish eligibility; use finish timestamps for finished order, not approximation from display.
- Finishers classified by official time; retired RUs by progress at retirement (document administrative tie handling); DNS separate. Race runs until all finish or retire, unless explicit safeguard terminates it. No fabricated finish for stalled entrants.

## 5. Finished RU versus disabled RU
**Finished:** result locked at finish crossing, no further competition/combat, continues forward under safe clearing behavior, remains a physical entity until safely entering designated exit/clearing zone beyond finish, then removed from occupancy. Exit must accommodate closely grouped finishers; no automatic stop on finish line. Clearing movement may collide or be blocked; never teleport through a live competitor. Finished RU's official classification does not change after crossing.

**Disabled / eliminated / crashed:** immediately classified Retired/DNF when administratively retired, and becomes a **stationary persistent one-tile wreck** at final legally resolved position. Wreck remains through race end, blocks tiles/paths, and is perceived/avoided by drivers subject to Awareness/visibility. It can cause new impacts, damage, and chain reactions. Wrecks **never despawn on a timer**, and secondary impacts do **not** move them in this prototype. Avoid repeated damage for unchanged stationary contact; require a new impact/renewed relative motion. Multiple wrecks can fully block track; explicit stall safeguards handle this.

## 6. Driver AI
- Additive weighted utility scoring; candidate actions legal under format, spatial and physical constraints. Strategic evaluation periodically, tactical reactions every tick and relevant subevents.
- Six separate 0–100 tendencies: Aggression, Caution, Patience, Opportunism, Stamina Management, Tactical Discipline.
- Awareness and visibility filter perceived state; simulator's authoritative state is not automatically known to drivers. Separate judgment, execution, and stress errors.
- Pace: Conserve, Maintain, Push, Sprint. Position: hold, inward, outward. Racecraft: overtake, defend, yield, avoid. Combat: attack, ram, defend, disengage, only when legal. Preserve persistent goals to prevent oscillation; resolve incompatible intents.
- Driver actions are intentions, not physical outcomes. Log candidate scores, perceived risks, chosen action, execution, and failures.

## 7. Strategy Signs
Six: **Push the Pace; Conserve Strength; Seek Open Track; Race Defensively; Engage Rivals (Combat Racing only); Hold Position.** Base **three successful sign queues/replacements** per race, configurable.

- Queueing a valid sign consumes one use immediately and creates Pending.
- Pending activates when player's RU **next crosses start/finish line**. Pre-race pending activates at starting signal.
- Active sign persists while replacement is Pending. Replacement activates at next crossing, replacing Active.
- Replacing an existing Pending sign costs another use; canceling Pending gives no refund.
- Lowering Active is free and immediate; absent Active, driver uses base autonomous AI.
- Player may issue sign controls while simulation is paused; command ordering and activation recorded deterministically.
- Invalid sign (e.g., Engage Rivals in Pure Racing) is rejected without charge.
- Signs alter AI utility through configurable sign strength, driver Tactical Discipline, context; **do not** directly alter physical stats or guarantee obedience.
- Compliance diagnostics: Followed, Partially Followed, Overridden, Inapplicable, Prevented.

## 8. Contact, combat, damage, control
- Distinguish movement conflict, incidental contact, deliberate attack/ram. Lateral rams primarily between adjacent lanes, since beasts lead chariot.
- Combat: attacker vs defender contested effectiveness, margin of success, bounded seeded variability. Limited defensive reaction budget per tick. Attack/defense priority and invalidation must be deterministic and logged.
- Impact: separate physical calculation from relative speed, effective mass, direction, traction, protection.
- Weighted component targeting by contact direction and attack; driver, chariot, and individual beasts can be damaged. Condition and injury impair performance.
- Control states: Normal, Unstable, Out of Control, Disabled. Disabled produces a persistent wreck.
- No duplicate damage from the same physical contact; bounded chain reactions, unique contact/event IDs.

## 9. Fatigue, weather, incidents
- Individual beast fatigue 0–100; limited recovery under lower exertion. Separate driver strain, gradual chariot wear. Pace, load, endurance, heat, weather, and condition influence effects.
- Weather presets: Clear, Rain, Heavy Rain/Mud, Dust/Wind, Extreme Heat. Static per race in prototype; dynamic weather deferred.
- Segment surfaces include grip, roughness, rolling resistance, hazard modifiers; tile hazards permitted.
- Weighted occasional incidents: debris, animal, spectator intrusion, etc., with eligibility, placement, duration, logging; not necessarily every race. Crowd affects morale/performance, not direct interference except explicitly generated track intrusion.

## 10. Race reporting
Show official classification, lap/finish/retirement cause and time, narrative commentary, technical race statistics, damage/fatigue outcomes, Strategy Sign activations/compliance, and event log. Replay and batch tests must use same authoritative mechanics.
