# BNT — P1.1 Tuning Reference

Branch: `feat/p1-1-pacing-presentation`. P1 baseline: `11fdec4f433850ac1272666b9fb4505cf18f8526` (runtime `bb39003c93d353cb35a8f4a853ab11ecca8b7976`). P1.1 implementation: `fce3ae7e87ba4a6c3b0877431c6c890fe5ee0287`. No merge, push or deployment.

All changed numbers are centralized in `src/prototype/pacing.js`; `raceSetup` freezes them into native race configuration. Native defaults were not changed. Select legacy through `new PlayableSession({pacing:'legacy'})` or developer `P1.prepare({pacing:'legacy', ...settings})` for comparison. This is not a persisted production-career policy.

| Parameter | Native/P1 baseline | P1.1 | Reason |
|---|---:|---:|---|
| fatigueRate | 0.13 | 0.32 | Native per-time generation multiplier. |
| recoveryRate | 0.2 | 0.7 | Existing low-exertion recovery; no extra healing. |
| exertionConserve | 0.45 | 0.15 | Lower effort below recovery threshold. |
| exertionMaintain | 1 | 0.4 | Low generation; remains above new recovery threshold. |
| exertionPush | 1.75 | 2.5 | Meaningful cumulative generation. |
| exertionSprint | 3 | 4.5 | Rapid generation, preserves native Sprint risk. |
| recoveryThreshold | 0.6 | 0.25 | Only Conserve qualifies among the normal racing paces. |
| utility.pushFatigue | 5 | 8 | AI less willing to Push while tired. |
| utility.sprintFatigue | 8 | 14 | Stronger fatigue penalty for Sprint. |
| utility.conserveFatigueBase | 2 | 3 | Greater recovery preference when fatigued. |
| utility.conserveStamina | 6.666666666666667 | 8 | Existing stamina-management personality influence. |
| tuning.impairment | 0.5 | 0.85 | Stronger native effective-attribute impairment; also applies to driver strain/chariot wear in existing formulas. |
| tuning.paceConserve | 0.6 | 0.75 | Less severe speed cost makes recovery tactically viable. |
| tuning.pacePush | 0.95 | 0.98 | Retain an immediate straight-line benefit; normal corner constraints still apply. |

## Existing formulas retained

For each beast, generation is `fatigueRate × exertion × max(1,derived.load) × weather.fatigue × (1+surface.roughness) × (1.5−endurance/100) × (1+(100−condition)/100)`. Recovery applies only when exertion ≤ recoveryThreshold: `recoveryRate × weather.recovery × (0.5+endurance/100)`. Integrate `(generation−recovery) × elapsed`, clamp fatigue 0–100. No per-render-frame charge is added.

The baseline raw per-time factors fatigueRate×exertion were Conserve .0585, Maintain .13, Push .2275, Sprint .39. P1.1 factors are .048, .128, .8, 1.44 before existing endurance/load/weather/surface/condition effects. Maintain is almost unchanged; Push/Sprint now cost about 3.5–3.7× baseline. Conserve recovery is still conditional, not free treatment.

Native effective beast attributes use `attribute × condition/100 × (1−impairment×fatigue/100)`. This affects existing speed, power, agility, handling and acceleration. The single impairment weight also affects existing driver-strain and chariot-wear formulas; their accumulation rates are not changed. There is no additional hidden speed subtraction.

With all base ratings 55, full condition, default mass/load and no strain/wear, the native derived maximum-speed potential is 19.6817 at fatigue 0 in both profiles. At fatigue 50: baseline 17.6000 versus P1.1 16.1428. At fatigue 100: 15.5183 versus 12.6039. Corresponding acceleration is 3.2172 fresh, 2.2346/1.6206 at 50, and 1.3754/.3669 at 100. These are fixed-input derived values, not measured race speed on varying surfaces/corners.

## Unchanged controls

Native dt, RNG, physical/event order, lane/tile/collision/combat, weather/terrain coefficients, corner risk and Sprint corner-limiter exemption; personality/attribute schemas; Sign strength, priorities, three-use default and activation; driver strainRate .025, chariot wearRate .001; Maintain pace .85, Sprint pace 1; incident and damage rules. Tuning changes use existing validation bounds (autonomous scalars 0–100, utility/scalar contracts and tuning constraints), no expanded limits.

## Display-only rules

Remaining endurance is 100 minus mean beast fatigue. Status thresholds at mean fatigue 20/50/80, trend epsilon 1e−6, all configurable in `fatigueDisplayRules`. They do not change AI decisions, availability, injuries or condition. Default zoom 6, selectable 4–10; cart proportions and terrain palette are presentation only.
