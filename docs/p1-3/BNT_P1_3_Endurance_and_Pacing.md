# BNT P1.3 — Endurance and Tactical Pacing

## Result and boundaries

P1.3 makes active Push a maximum-effort Sprint order and Conserve an actual conserving order for ordinary drivers. Physical restrictions still win; fatigue alone does not authorize voluntary disobedience. Fatigue affects the existing derived attributes and physics, not a hidden Sign speed bonus. Neutral drivers keep the native autonomous utility, cadence, race awareness and P1.2 finishing utility.

Version `p1.3-tactical-v1` is explicitly selected by the new HTML preparation screen. The programmatic PlayableSession/raceSetup default remains P1.2 `competitive` for compatibility; request `pacing:'tactical'` for P1.3. Native production/career defaults, P1.1 `endurance`, P1.2 `competitive`, and `legacy` remain intact and selectable.

## Tuning inventory

| Parameter | P1.2 | P1.3 |
|---|---|---|
| exertionConserve | 0.15 | 0.15 |
| exertionMaintain | 0.4 | 0.6 |
| exertionPush | 2.5 | 2.8 |
| exertionSprint | 4.5 | 5 |
| beastExhaustionStart | 0.65 | 0.65 |
| beastExhaustionStrength | 0.5 | 0.65 |
| fatigueRate | 0.32 | 0.32 |
| recoveryRate | 0.7 | 0.7 |
| recoveryThreshold | 0.25 | 0.25 |
| global impairment | 0.85 | 0.85 |
| paceConserve / pacePush | .75 / .98 | .75 / .98 |

The new profile additionally enables directiveAuthority=1, obedienceDisciplineCeiling=30, obedienceResistanceThreshold=80, accelerationFatiguePerSpeed=.08, weaponStrainCost=.3, ramStrainCost=.15 and ramFatigueCost=.35. All are validated configurable scalar inputs. They are not inserted into historical default configuration shapes.

Native continuous fatigue generation in `src/sim/environment.js:integrateCondition` remains:

`fatigueRate × exertion × max(1, load) × weather.fatigue × (1 + roughness) × (1.5 − baseEndurance/100) × (1 + (100 − condition)/100)`.

Recovery remains available at exertion ≤ recoveryThreshold: `recoveryRate × weather.recovery × (.5 + Endurance/100)`. Integrate net rate over actual subevent elapsed time and clamp 0–100. Conserve can genuinely recover; Maintain has cumulative cost. At Clear/full-condition/load=1, Sprint generates 1.92 fatigue/s at Endurance 30, 1.52 at 55, 1.12 at 80, before incremental actual-action costs. Conserve net recovery is .5024/s at Endurance 30 and .8764/s at 80. Roughness, load, weather and condition retain their existing effects.

`src/model/ru.js:beastExhaustionFactor` already supplies a continuous smoothstep above 65 fatigue. P1.3 changes only its configuration strength: factor is `1 − .65 × x² × (3 − 2x)`, x clamped from (fatigue/100−.65)/.35. It multiplies existing beast effective attributes once; derived speed, power, acceleration and handling follow the native formulas. Global impairment is unchanged because it also couples driver strain and chariot wear. No phase-dependent scripted slowdown was added.

## Trajectories and outcomes

See the full matched 112-race table and raw trajectories in Competitive Validation. Four-RU Oval seed 17 sustained Push: mean fatigue approximately 21/41/61/80/99 at 10/20/30/40/50 seconds; player remains first through 70 s, second at 80 s. The stronger curve affects actual derived capability, not merely the gauge. Balanced neutral finishes with 17.9 fatigue, aggressive autonomous with 25.1, disciplined autonomous with 14.4: not every racer exhausts early.

Matched four-RU Clear Long Rally seed17: Endurance30 sustained Push finishes 229.465 s and loses its lead at 38.35 s; Endurance80 finishes 216.896 s and holds the lead until 94.15 s. Both eventually exhaust. Their Conserve times are effectively equal at 192.593/192.593 s, demonstrating that higher Endurance is not an unconditional speed bonus at zero fatigue. These are native outcomes; course and other ratings match.

Aggression wins favorable short/high-Endurance cases; mixed schedules and Conserve can win others. Early Push then recovery can still lose badly. Recovery does not rewind progress. Several rival specializations win, but contact/endurance specialists do not win this sampled matrix. No equal-win-rate target was imposed.

## Validation and limits

`tests/p1-3.test.js` checks ordinary obedience, native constraints, no additional refusal RNG, actual acceleration costs, resource clamps, ram/weapon source linkage, fatigue/recovery Endurance effects, exact replay and checkpoint restoration, and legal crossing activation across oval/circuit/three Rally lengths. The matrix is manageable and coupled, not exhaustive balance validation. All extra costs are opt-in and actual-work based. No physical corner/Sprint safety semantics, RNG/event ordering of existing processing, opportunities, refund rules, scheduler, digest strategy, persistence architecture or career rules were changed.
