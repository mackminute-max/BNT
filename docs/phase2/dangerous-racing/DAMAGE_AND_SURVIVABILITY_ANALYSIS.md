# Damage, defense and survivability

**Existing mechanics create failures in worn fields without changing lethality. Healthy competitors remain highly safe in this study.** Keep the three cohorts separate.

| Combat cohort | Races / seed blocks | Finished / entries | Damage retirements / races with one | New serious-damage entries / races | OOC emissions / entries affected | Wreck events / secondary impacts |
| --- | --- | --- | --- | --- | --- | --- |
| healthy | 200 / 40 | 1600 / 1600 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| mixed | 200 / 40 | 1595 / 1600 | 5 / 5 | 15 / 14 | 16 / 15 | 5 / 1 |
| high-risk | 200 / 40 | 1518 / 1600 | 82 / 67 | 201 / 129 | 20 / 17 | 82 / 11 |


Serious damage means a new crossing from >25 to <=25 component condition during competition, an analysis threshold only. Initially <=25 equipment is separately marked and never counted as a new crossing until another component actually crosses. OOC counts are authoritative event emissions; affected entry observations are also shown. A retired RU becomes a permanent stationary wreck. These are race-local component conditions, not persistent injury systems.

## Damage and control mechanism

Weapon damage uses attackDamage 7 × (1+bounded margin/100), divided by per-component resistance/protection/grip. Exposure favors driver 3, beast team1, chariot1. A weapon hit has no physical-energy term and default attackSpeedRetention=1, but condition loss impairs performance. Ram passes the same contest, then queues side energy `0.5 × reducedMass × (closing² + ramSpeed 5²)`. Each participant receives half energy, side geometry .6, damageScale .003, and its own resistance. Ram applies bilateral speed retention .9; it does not displace the target to a different lane. Front incidental contacts have different geometry and can stop the initiator; side incidental contact has only sideSpeed1.5. Wreck impact uses actor mass but retains half-share for the two participants; anchored wrecks do not move. These are abstract calculations, not a calibrated momentum-exchange solver or real-world joules.

Weight changes acceleration/speed/mass and energy; Stability/Maneuverability/Driving affect handling/control; Durability/Protection/Toughness and chariot condition affect resistance; Combat/condition/equipment affect contests. Awareness/Nerve influence perception/errors/control stress, not a direct damage divisor. Individual beast damage impairs its effective contribution. Chariot wear/condition impair speed, handling, control and resilience. Driver damage impairs combat/perception/control. The one-at-a-time physical panel retains actual derived stats, full input RU, post-action q/speed and condition; see `mechanisms/physical.json.gz` and analysis.physical.

Instability gain = damage ×1 plus physical energy ×geometry×.0002×share; recovery is **5/s**. Weapon strikes generally contribute only their resisted condition loss, often a few points. Their normal 1.2s attacker cooldown allows 6 instability points of recovery before that same attacker can act again. Other attackers and short intervals can overwhelm it. Thresholds: Unstable >15, OOC >40, Disabled >=100; driver/chariot condition <=5 or every beast<=10 also disables. Losing a single beast does not itself meet the whole-team disable condition. Gradual condition loss can still retire a unit without ever reaching OOC.

In the cohort study all **87 damage retirements** link to weapon-attack causes, not incident or ram causes. Mixed final disabling hits targeted driver 4/chariot 1; high-risk driver 51/chariot 31. The exact competitive-stop condition snapshots confirm all 87 retirements crossed component disable thresholds: driver 55/chariot 32, with no whole-team or instability-only disablements. Earlier accumulated damage still matters. No safeguard created a retirement. Full per-event provenance is in `evidence/retirement-provenance.json`; replay gives the exact damage/control sequence.

## Defensive effectiveness

The earlier Phase 2 primary workload recorded 2381 reactions and 2063 reactive defenses. These are retained historical counts, not pooled with this different workload.

| Combat cohort | Contests / hits | Reactions / defended while reacting | Same-state reaction threshold flips | No reaction | Actively defending contests |
| --- | --- | --- | --- | --- | --- |
| healthy | 838 / 103 | 838 / 735 | 413 | 0 | 201 |
| mixed | 2960 / 1204 | 2754 / 1750 | 1528 | 206 | 1125 |
| high-risk | 7726 / 1525 | 7309 / 6042 | 2769 | 417 | 0 |


For healthy contests, **413/838** switch from defended to successful when subtracting only the actual reactive bonus from the same logged defense score. Baseline success is 103/838; the arithmetic no-reaction threshold success would be 516/838. This is strong evidence the reaction bonus suppresses ordinary immediate hits. It is **not** a rerun with defense removed and does not estimate resulting race damage, deaths or causal full-race outcomes: component draws/state/next actions would change. The remaining failed contests may still be stopped by passive skill/control defense. No invented component-level damage-prevented amount is reported.

Reaction budget 1 refreshes per tick, not per 1.2s cooldown; isolated attacks usually receive a response. In healthy fields all 838 attacks received one; mixed 206 and high-risk 417 did not. Main logs do not uniquely distinguish exhaustion from OOC at every subevent. Controlled simultaneous tests isolate budget exhaustion:

| Defender skill | Protection | Imposed active defense | Groups (two profile labels) | Reactive first attack resisted / 64 | Unreacted second attack hit / 64 | Mean condition damage |
| --- | --- | --- | --- | --- | --- | --- |
| 20 | 10 | False | 64 | 0 | 64 | 31.61 |
| 20 | 10 | True | 64 | 0 | 64 | 31.61 |
| 20 | 90 | False | 64 | 0 | 64 | 8.30 |
| 20 | 90 | True | 64 | 0 | 64 | 8.30 |
| 50 | 10 | False | 64 | 0 | 64 | 26.88 |
| 50 | 10 | True | 64 | 0 | 64 | 26.88 |
| 50 | 90 | False | 64 | 0 | 64 | 7.03 |
| 50 | 90 | True | 64 | 0 | 64 | 7.03 |
| 80 | 10 | False | 64 | 30 | 62 | 16.99 |
| 80 | 10 | True | 64 | 30 | 62 | 16.99 |
| 80 | 90 | False | 64 | 30 | 62 | 4.48 |
| 80 | 90 | True | 64 | 30 | 62 | 4.48 |


There are 768 groups / 1536 contests; profile labels duplicate physical resolver inputs, leaving 384 distinct seeded configurations. Two attackers target C in one tick: first eligible consumes its single reaction, second receives none, with initiative deterministic. Active defending=true is an imposed diagnostic state; false is the reference state. At fixed skill/equipment/state the two personality labels give identical resolver outputs, so caution affects decision/pace/positioning, not a free reactive stat buff. High skill improves passive defense; protection mitigates damage after successful hits, not the contest score. DefendCombat adds 12 only when an eligible reaction is actually available, and occupies the AI's positional action instead of attack/overtake. No stamina/reaction-resource cost beyond that budget is implemented; a persistent reaction bonus should not be described as expensive without evidence.

## Repeated exposure and downstream availability

| Imposed exposure | Starting chariot condition | Closing speed | Series | New actor wrecks | Target wrecks* | Series with OOC |
| --- | --- | --- | --- | --- | --- | --- |
| weapon | 100 | 0 | 16 | 0 | 16 | 7 |
| weapon | 100 | 25 | 16 | 0 | 16 | 7 |
| weapon | 15 | 0 | 16 | 0 | 16 | 5 |
| weapon | 15 | 25 | 16 | 0 | 16 | 5 |
| ram | 100 | 0 | 16 | 0 | 0 | 0 |
| ram | 100 | 25 | 16 | 16 | 15 | 16 |
| ram | 15 | 0 | 16 | 0 | 16 | 0 |
| ram | 15 | 25 | 16 | 0 | 16 | 7 |
| rear | 100 | 0 | 16 | 0 | 0 | 0 |
| rear | 100 | 25 | 16 | 16 | 9 | 16 |
| rear | 15 | 0 | 16 | 0 | 0 | 0 |
| rear | 15 | 25 | 16 | 0 | 16 | 16 |
| side | 100 | 0 | 16 | 0 | 0 | 0 |
| side | 100 | 25 | 16 | 15 | 14 | 16 |
| side | 15 | 0 | 16 | 0 | 0 | 0 |
| side | 15 | 25 | 16 | 0 | 16 | 7 |
| wreck | 100 | 0 | 16 | 0 | 16 | 0 |
| wreck | 100 | 25 | 16 | 16 | 16 | 16 |
| wreck | 15 | 0 | 16 | 0 | 16 | 0 |
| wreck | 15 | 25 | 16 | 16 | 16 | 16 |


*For wreck exposure the target is a deliberately retired initial obstacle, not a newly caused casualty. Thirty imposed exposures at 1.25s spacing use unchanged coefficients; condition and relative speed are explicit. Reference positions/speeds/contact identity are imposed between exposures to isolate resolution; these are **not races**. Weapon closing-speed labels duplicate the same weapon mechanics: weapon has no relative-speed damage term. Repeated contacts use intentional new-impact identity and recoverControl; they do not show a stationary contact damage bug. `mechanisms/imposed-exposure.json.gz` exports all 720 series, including intermediate 40-condition and 10-closing settings. Driver/chariot disablement, OOC, persistent wrecks and secondary damage are achievable without boosted damage constants. Their counts are not ordinary risk estimates.

Existing deterministic regressions additionally cover reaction exhaustion/invalidation, corner crash, chain bounds, duplicate stationary contacts, full blockage, finish-before-impact ordering and anchored wrecks. This investigation does not alter those tests or claim a broad natural chain-casualty distribution from the 12 observed cohort wreck-impact events.

## Environment and traffic

| Cohort / weather | Races | Retired entries | OOC emissions | Incident / encounters | Mean race duration |
| --- | --- | --- | --- | --- | --- |
| healthy / Clear | 40 | 0 | 0 | 16 / 1 | 157.39 |
| healthy / Rain | 40 | 0 | 0 | 17 / 0 | 172.59 |
| healthy / Heavy Rain/Mud | 40 | 0 | 0 | 20 / 0 | 227.76 |
| healthy / Dust/Wind | 40 | 0 | 0 | 19 / 1 | 176.86 |
| healthy / Extreme Heat | 40 | 0 | 0 | 19 / 2 | 183.42 |
| mixed / Clear | 40 | 1 | 0 | 19 / 1 | 198.95 |
| mixed / Rain | 40 | 0 | 1 | 19 / 0 | 217.94 |
| mixed / Heavy Rain/Mud | 40 | 4 | 15 | 26 / 1 | 287.28 |
| mixed / Dust/Wind | 40 | 0 | 0 | 20 / 0 | 224.89 |
| mixed / Extreme Heat | 40 | 0 | 0 | 22 / 0 | 230.44 |
| high-risk / Clear | 40 | 11 | 0 | 30 / 3 | 344.16 |
| high-risk / Rain | 40 | 15 | 3 | 34 / 0 | 372.60 |
| high-risk / Heavy Rain/Mud | 40 | 35 | 15 | 46 / 0 | 483.06 |
| high-risk / Dust/Wind | 40 | 9 | 0 | 35 / 0 | 387.77 |
| high-risk / Extreme Heat | 40 | 12 | 2 | 34 / 3 | 391.65 |


Weather comparisons share40 seed blocks and the same rosters/strata. Mud has lower grip and more resistance to motion; grip also appears in the damage denominator, so successful hits can be more damaging even when speed falls. The high-risk cohort has **zero corner-overspeed loss events** despite 20 OOC emissions: its low performance reduces corner speed; danger is principally weapon accumulation against worn entrants. Healthy has 11 corner-loss emissions but no OOC/retirement. More dangerous weather therefore does not monotonically imply more corner crashes. Heat chiefly changes fatigue/recovery; Dust visibility changes exposure and decisions.

Neutral/degraded and standard/spread-row summaries are in analysis.json. Their four strata are balanced but tied to seed indices; they are descriptive associations, not isolated randomized surface/traffic effects. Degraded is a composite of grip/roughness/rolling, not an independent hazard-frequency intervention (hazardModifier remains1). Default incidentRate .002 is never raised. Across all 600 Combat cohort races only 12 incident impacts occur, versus 11524 weapon contests; rare hazard casualties cannot be estimated precisely. Matched Pure controls have zero retirements/OOC and no incident impacts in their selected 120 runs. No claim is made that Pure Racing is incapable of damage.

## What survivability means for Dangerous Racing

Most entrants finish in every cohort: healthy 100%, mixed 99.6875%, high-risk 94.875%. Ordinary healthy retirement risk is not established as zero; no events across 40 five-weather seed blocks gives a one-sided95% upper bound **7.22% for any retirement in that selected five-race seed block**, not a per-RU or per-race bound. Mixed has 5/200 races with a retirement; high-risk 67/200. No approved target percentage follows.

Existing mechanics support increased exposure from accumulated damage, poor equipment, skill and conditions. Ordinary healthy serious risk remains unobserved, while worn-field failures are credible and naturally emerging. Sparse ram selection removes one important physical-energy route. Defensive strength, low weapon shock relative to5/s recovery, protection/resistance and lack of AI contact-payoff reasoning explain survivability more precisely than saying the wreck system is broken. Do not globally increase lethality before deciding whether healthy ordinary risk needs to change.
