# Combat AI decision analysis

**Finding: selection lacks a context-sensitive ram niche; the resolver is available.** No weight or mechanic changed. See [raw AI probes](mechanisms/ai.json.gz), [physical probes](mechanisms/physical.json.gz), [cohort results](DANGEROUS_RACING_RESULTS.md) and [analysis JSON](analysis.json).

## Why weapon attacks dominate

At the default coefficients, with both candidates legal:

`U(attack) − U(ram) = 0.1 + 0.5 × Opportunism/100 + persistenceDifference + noiseDifference`.

Aggression (3×A/100) and Caution (−2×C/100) cancel. All current signs have equal direct influence on these two candidates: Engage adds the same bonus; the other five add neither. Noise difference is bounded within ±0.3. Goal persistence adds +1.2 to the currently persistent candidate: an attack goal makes dominance stronger; an existing ram goal can reverse it. Thus O>=40 cannot initiate ram through default bounded noise without an existing ram goal. For O=0 a narrow noise-driven initiation niche remains. High aggression also must make offense beat hold, avoidance, overtake and defense; low aggression/high opportunism alone does not guarantee combat.

Source: `src/ai/driver.js` add()/combat candidates/selection; `src/sim/consequences.js` consequenceDefaults and eligibleCombat(); `src/ai/signs.js` signPreference(). The algebra is conditional on the current default coefficient set and candidates, not a theorem about all developer-configurable values. Attack and ram may refer to different rivals: attack uses closest perceived rival, ram uses the first qualifying stable-ID rival. Their scores still have no target-specific benefit or cost.

Default ram requires adjacent lanes and |gap|<=0.75; weapon permits same/adjacent lanes and |gap|<=1.25. **Ram-only is impossible with these default rules.** Both share Racing/Live/format/control/cooldown constraints. AI perception filters candidates further, but cannot create a ram-only case from these ranges. No illegal range override was used to manufacture one.

## Controlled autonomous decisions

| Initial context | n | Attack / ram legal | First chosen positional actions | Executed ram contests during 5 s |
| --- | --- | --- | --- | --- |
| both | 64 | 64 / 64 | {'attack': 64} | 0 |
| weaponOnly | 64 | 64 / 0 | {'attack': 64} | 0 |
| neither | 64 | 0 / 0 | {'hold': 64} | 0 |
| heavyFavorable | 64 | 64 / 64 | {'attack': 64} | 0 |
| lightVsHeavy | 64 | 64 / 64 | {'attack': 64} | 0 |
| highAggressionLowOpportunity | 64 | 64 / 64 | {'attack': 51, 'ram': 13} | 41 |
| highOpportunityLowAggression | 64 | 64 / 64 | {'hold': 64} | 0 |
| damaged | 64 | 64 / 64 | {'attack': 64} | 0 |
| valuablePosition | 64 | 64 / 64 | {'attack': 64} | 0 |
| compromisedControl | 64 | 0 / 0 | {'hold': 64} | 0 |
| existingRamGoal | 64 | 64 / 64 | {'ram': 64} | 64 |
| existingAttackGoal | 64 | 64 / 64 | {'attack': 64} | 0 |


Each row uses seeds 1..64, close moving starts and actual AI/physics for five seconds. `compromisedControl`, `existingRamGoal`, `existingAttackGoal` are explicitly forced-state probes, outside natural-race counts. All other initial attributes and geometry are valid configurations; neither AI action nor utility was forced. `valuablePosition` starts A ahead of B, a local position-cost probe, not proof of championship-value reasoning. All candidates/terms, first intended/effective/physical state, linked execution events, subsequent contests, damage, speeds and progress are in the raw file.

The ordinary aggressive profile chose attack in all 64 both-legal cases; changing only mass/protection or damaging the actor did not create a ram preference. High-A/zero-O selected ram in **13/64** first decisions; a genuine seeded reconstruction is `evidence/AI-highAggressionLowOpportunity-5.replay.json.gz`. An existing ram goal selected ram in 64/64, but that is persistence availability, not naturally emerging initiation. Compromised control blocked offense and led to hold while braking/recovering.

Across the 600 Combat cohort races there were **359,121 decisions containing legal ram candidates and zero ram selections/contests**. These repeated opportunities are highly correlated, not independent Bernoulli trials. The 100 additional controlled-personality races are separate and also contain no ram contests. No frequency floor or random forced ram is warranted by these results.

## What AI knows and what it uses

Perceived rivals expose ID, lane, gap, speed, physical/status. Their mass, protection, condition, combat skill and likely retaliation cost are absent. The actor has full own RU/derived state, but ram/attack utility uses only A/O/C, signs, persistence and noise. Relative speed, momentum, opponent condition, self damage, possible disablement, racing place and expected loss of progress do not enter this pair of scores.

Fatigue influences pace/disengage; low condition influences derived performance/perception/contest strength; instability contributes stress/error and OOC prohibits offense. Driving affects execution failure. Awareness affects perception/judgment, Nerve stress. Those pathways affect whether an action happens, but do not compare expected weapon-versus-ram payoff. DefendCombat competes for the positional goal and sets the active-defense flag; disengage/avoid/overtake compete rather than being free additions. Goal persistence can lock a previously chosen combat preference for 30 ticks. A decision command may later be invalidated by range/cooldown/state changes; raw ATTACK/AI_EXECUTION_RESULT distinguishes intention from execution and contest success.

## Physical advantage versus selection deficiency

| Physical context (32 seeds/arm) | Weapon hits / target damage | Ram hits / target damage | Ram self damage |
| --- | --- | --- | --- |
| standard | 4 / 0.61 | 4 / 0.13 | 0.13 |
| heavyIntoLight | 4 / 0.61 | 4 / 0.13 | 0.13 |
| lightIntoHeavy | 4 / 0.61 | 4 / 0.13 | 0.13 |
| closing10 | 4 / 0.61 | 4 / 0.64 | 0.64 |
| closing20 | 4 / 0.61 | 4 / 2.19 | 2.19 |
| protected | 4 / 0.31 | 4 / 0.09 | 0.13 |
| unprotected | 4 / 1.54 | 4 / 0.23 | 0.13 |
| durable | 4 / 0.55 | 4 / 0.10 | 0.13 |
| stable | 3 / 0.45 | 3 / 0.10 | 0.10 |
| maneuverable | 4 / 0.61 | 4 / 0.13 | 0.13 |
| driverDriving | 0 / 0.00 | 0 / 0.00 | 0.00 |
| driverHandling | 3 / 0.45 | 3 / 0.10 | 0.10 |
| driverCombat | 0 / 0.00 | 0 / 0.00 | 0.00 |
| driverAwareness | 4 / 0.61 | 4 / 0.13 | 0.13 |
| driverNerve | 4 / 0.61 | 4 / 0.13 | 0.13 |
| strongAttacker | 32 / 7.15 | 32 / 1.03 | 1.03 |
| wornTarget | 23 / 5.25 | 23 / 1.09 | 0.74 |
| lowSkillTarget | 32 / 5.39 | 32 / 1.03 | 1.03 |
| mud | 4 / 1.10 | 4 / 0.23 | 0.23 |


Damage means include misses (32 trials/arm), measured over five seconds; none of these short runs created a wreck. At equal skill only 4/32 contests succeeded. Ram consumes the same contested gate as a weapon attack and cannot bypass a strong defense. Strong attacker (Combat90/equipment60 vs Combat/Driving25) succeeds 32/32, but equal-speed ram deals ~1 condition point to each participant versus ~7 to the weapon target alone.

At closing20 (30 vs10 m/s; a deliberately fast diagnostic, not ordinary field speed), successful ram severity rises sharply. At 18 vs8 in the separate physical-niche follow-up, asymmetric protection/wear can yield greater rival delay at a self cost:

| Diagnostic context | Weapon / ram rival DNFs (32 each) | Weapon / ram actor wins | Both-finished pairs | Ram−weapon finishing lead s [95% CI] |
| --- | --- | --- | --- | --- |
| healthyEqualSpeed | 0 / 0 | 31 / 31 | 32 | -1.26 [-1.65, -0.93] |
| protectedClosing | 0 / 0 | 31 / 31 | 32 | -0.38 [-1.15, 0.32] |
| exposedClosing | 0 / 0 | 31 / 31 | 32 | -1.70 [-2.37, -1.01] |
| wornRivalClosing | 4 / 0 | 32 / 32 | 28 | 5.38 [2.67, 8.09] |


Finishing lead is rival time minus actor time; positive ram−weapon means ram creates a larger lead. Nonfinishers are excluded from that time comparison and listed in the DNF column. In the worn-rival niche, **15/28 both-finished seeds** favor ram's lead, mean +5.38 s, but weapon retires the rival in 4/32 while ram does not; that censoring matters. The actor already wins all 32 either way. In healthy protected closing, 14/32 seeds favor ram's lead, but mean effect is negative and no extra wins appear. A documented favorable realized case is protectedClosing/seed32: ram improves lead by ~2.76 s versus weapon; its actual replay triplet is exported. This is a conditional realized advantage, not evidence that ram is the superior expected winning policy. The first 96 moving-start diagnostic races are preserved separately; their initial eight-seed equal-skill panels had no successful contests and cannot resolve superiority.

**Answers on superiority:** realistic relative speed/protection/wear can make ram useful for delaying a rival, but universal or ordinary-field superiority is unproven. Its recoil, 10% bilateral speed reduction, shared defense gate and lack of displacement often favor weapon attacks or simply racing. The current AI cannot identify the demonstrated niches because the relevant features are unused/unperceived. This is an action-selection limitation distinct from a missing or broken physical resolver. No general pure-mass bully advantage is present: reduced mass and half-energy shares are symmetric. More mass raises both parties' exposure; protection/durability/condition create the asymmetric survivability benefit.
