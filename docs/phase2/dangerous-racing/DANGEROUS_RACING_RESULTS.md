# Dangerous Racing: complete-race results

**Completed the planned 600 Combat cohort races, 120 matched Pure controls, and a separate 100 Combat personality races.** Cohort study 717 Ended/3 Stalled; personality 100 Ended. No integrity errors, tool errors, cancellations or tick-bound exceedances. Fifteen pilots and480 moving-start commanded diagnostic races (96 initial +384 niche follow-up) are excluded from these 820 study executions. Diagnostic command scenarios are not ordinary autonomous casualty evidence.

| Combat cohort | Races / seed blocks | Finished / entries | Damage retirements / races with one | New serious-damage entries / races | OOC emissions / entries affected | Wreck events / secondary impacts |
| --- | --- | --- | --- | --- | --- | --- |
| healthy | 200 / 40 | 1600 / 1600 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| mixed | 200 / 40 | 1595 / 1600 | 5 / 5 | 15 / 14 | 16 / 15 | 5 / 1 |
| high-risk | 200 / 40 | 1518 / 1600 | 82 / 67 | 201 / 129 | 20 / 17 | 82 / 11 |


No approved casualty/attack target was imposed. Full actual seeds/configurations/rosters, JSONL/events, CSV and terminal checksums are under [data](data/); the matched personality study is under [personality-control](personality-control/). Each cohort has 200 races but only 40 independent numerical seed blocks, shared across weather/cohorts; Pure controls use 8 blocks. Slots rotate evenly. Do not pool the three cohorts into a representative casualty estimate or assume all equipment/weather/skill combinations were tested.

## Cohort performance and uncertainty

| Combat cohort | Race duration s, mean [95% CI] | Damage/race, mean [95% CI] | Overtakes/race, mean [95% CI] | Finish fatigue, mean [95% CI] |
| --- | --- | --- | --- | --- |
| healthy | 183.61 [178.43, 188.87] | 5.28 [3.44, 7.57] | 31.11 [28.58, 33.85] | 19.71 [19.00, 20.43] |
| mixed | 231.90 [225.09, 238.84] | 70.90 [61.56, 80.40] | 20.42 [18.29, 22.53] | 20.80 [20.40, 21.21] |
| high-risk | 395.85 [385.27, 406.70] | 96.52 [83.41, 109.40] | 17.89 [15.41, 20.32] | 30.50 [29.66, 31.31] |


The standalone [figure](figures/dangerous-racing-summary.png) summarizes these conditional results. Descriptive medians, SD, p10/p90/p95 and seed-cluster bootstrap 95% intervals are exported in `analysis.json` for each race metric and subgroup. Duration includes clearance and safeguard waiting; official entrant times remain full precision. Fatigue is historical finish snapshot, survivor-conditional when retirements occur. Condition damage sums component points, not a calibrated injury-severity score.

| Cohort | Seeds with >=1 damage retirement /40 | 95% Wilson interval for that seed-block event | Zero-event one-sided upper bound |
| --- | --- | --- | --- |
| healthy | 0 / 40 | [0, 0.0876] | 0.07 |
| mixed | 5 / 40 | [0.0546, 0.2611] | — |
| high-risk | 31 / 40 | [0.625, 0.8768] | — |


Intervals describe any retirement across a seed's five weather races, not per-race or per-entry probability. The zero-event healthy bootstrap interval [0,0] is empirically degenerate and must not be read as certainty. The exact one-sided zero-event bound is 7.22% for that selected five-weather seed block; Wilson's two-sided upper bound is 8.76%. Cohort entry completion proportions are descriptive 100%,99.6875%,94.875%; correlated entries do not receive IID binomial intervals. Estimates are conditional on chosen legal configurations, one oval and default three laps.

## Matched format controls

| Combat−Pure:40 race pairs/cohort, 8 seed blocks | Damage/race [95% CI] | Finish-fraction delta [95% CI] | Both-finished time s [95% CI] | Entry pairs / Pure-only finishers |
| --- | --- | --- | --- | --- |
| healthy | 1.70 [0.16, 3.63] | 0.00 [0.00, 0.00] | -0.01 [-0.08, 0.04] | 320 / 0 |
| mixed | 63.80 [46.64, 80.89] | -0.00 [-0.01, 0.00] | 1.95 [1.02, 2.79] | 319 / 1 |
| high-risk | 96.18 [74.89, 117.57] | -0.05 [-0.08, -0.02] | 4.16 [2.54, 6.02] | 304 / 16 |


All 120 Pure controls finish, with no OOC or wrecks. Common-finisher time pairs are explicitly matched by RU identity within each seed/weather case, then averaged per race pair before seed-cluster resampling. Combat-only finishers are 0 in every cohort. Pure-only finishers remain outcome changes, never assigned time 0 or a timeout finish. `combatMinusPure.metrics.finishMean` in raw analysis also exports a difference of surviving-field mean times, labeled survivor-conditional; use `matchedFinisherTime` for the explicit same-entrant contrast above. No claim that all 200 Combat races have a Pure counterpart is made.

## Personality, skill and risk

| Aggressive − cautious (50 matched race pairs;10 seeds) | Mean [95% seed-cluster CI] |
| --- | --- |
| place | -2.75 [-2.83, -2.66] |
| time | -7.87 [-8.36, -7.38] |
| damage | -1.22 [-1.83, -0.61] |
| attacks | 4.23 [3.70, 4.82] |
| reactions | -2.54 [-2.90, -2.22] |
| pushSeconds | 46.65 [46.33, 46.95] |
| fatigue | 10.90 [10.83, 10.97] |


This panel uses four aggressive/four cautious drivers, identical 50-attribute components and default equipment; the paired arm swaps every identity's profile. It controls slot/equipment while also changing opponents' profiles, so it estimates that symmetric assignment, not an isolated one-driver causal effect. Aggressive drivers attack more, spend ~46.65 extra seconds in Push, finish ~7.87s faster/~2.75 places better and accumulate ~10.90 more fatigue. They receive fewer attacks/reactions and slightly less damage, plausibly because they escape traffic; aggression is not automatically higher casualty risk. All 800 entries finish, so no robust aggressive-versus-cautious retirement comparison is available. The mixed cohort's profile/equipment pairing is confounded and is not used for an isolated personality claim.

The separate 768 simultaneous-defense groups hold tactical state/skills/equipment constant. Profile labels alone do not change the reactive resolver; Driving/Combat/Control skill and active defending do. The five-second one-attribute panel also records direct skill/resistance dependencies. No skill/attribute formula was changed and no universal build budget is implied. Phase2 F02 Speed dominance and F03 Hold/Push interactions remain historical hypotheses; this investigation supplies equipment/contact context but does not rebalance either.

## Surface/traffic and environmental risk

| Cohort / stratum (100 races each) | Damage retirements | OOC emissions | Mean condition damage/race | Mean duration s |
| --- | --- | --- | --- | --- |
| healthy / neutral | 0 | 0 | 5.84 | 167.36 |
| healthy / degraded | 0 | 0 | 4.71 | 199.85 |
| healthy / standard-grid | 0 | 0 | 5.32 | 182.32 |
| healthy / spread-rows | 0 | 0 | 5.23 | 184.89 |
| mixed / neutral | 2 | 7 | 63.88 | 211.59 |
| mixed / degraded | 3 | 9 | 77.93 | 252.22 |
| mixed / standard-grid | 1 | 7 | 73.32 | 233.60 |
| mixed / spread-rows | 4 | 9 | 68.48 | 230.20 |
| high-risk / neutral | 33 | 2 | 84.25 | 362.67 |
| high-risk / degraded | 49 | 18 | 108.79 | 429.03 |
| high-risk / standard-grid | 41 | 14 | 103.21 | 388.43 |
| high-risk / spread-rows | 41 | 6 | 89.82 | 403.27 |


These are descriptive fixed-seed strata, not isolated paired interventions: neutral/degraded and row spread are tied to r, and identities rotate. Weather has full matched coverage within each seed; see the detailed weather/incident table in [damage analysis](DAMAGE_AND_SURVIVABILITY_ANALYSIS.md). Worn Mud has 35 retirements/40 races (entry count), versus 11 entries/40 Clear races. Different speed, exposure duration, grip resistance and AI opportunities interact; do not attribute the whole difference to one coefficient. Incident hits are rare; natural weapon damage dominates observed failures.

## Three clearance stalls: classified results preserved

`DR-high-risk-10-3-Combat`, `DR-high-risk-29-1-Combat`, `DR-high-risk-34-2-Combat` end Stalled with no tile progress. All competitors were already Finished or damage-Retired; no Racing entrant was administratively retired. In each, finished RU5 remains Clearing behind permanent RU4 wreck, at q~243/241/243 while the wreck occupies the same physical exit approach. All three replay exactly. See `evidence/clearance-stalls.json` and saved full replays.

These are actual incomplete physical-clearance outcomes, not integrity errors or silently counted Ended races. The required stationary wreck, no-teleport and locked-finish rules are honored; no confirmed simulation defect is established merely by safe blockage. A future exit-routing/administration policy needs owner review if every classified race must physically clear despite a wreck. They are a workflow limitation affecting deliberately stressed cases and remain visible in all totals.

## Explicit answers to the 12 investigation questions

1. **Why attacks dominate:** nominal `0.1+0.5×O/100` advantage, bounded noise, attack-goal persistence, wider eligibility; no mass/closing-speed/cost term distinguishes ram. O>=40 cannot initiate ram from noise alone under the stated defaults.
2. **Can ram be superior already:** physically useful closing/protection/wear niches exist. Some realized paired seeds produce better lead (e.g. protectedClosing32), and the worn-rival both-finisher subset averages +5.38s lead vs weapon. No extra wins were demonstrated; weapon caused 4 rival DNFs there, and the subset is censored. Broad expected competitive superiority is unresolved.
3. **Can AI recognize those niches:** no explicit expected-contact payoff or rival equipment/condition perception; it cannot reason from those features. Low-O noise can select ram, which is not niche recognition.
4. **Are weapon hits meaningful:** yes; all 87 cohort damage retirements follow weapon hits. Mixed/high-risk condition damage and controlled target-time penalties show competitive effects despite no direct hit speed penalty.
5. **What causes component failure:** repeated successful hits against lower condition/resistance, multiple attackers and low grip; driver/chariot<=5, all beasts<=10, or instability>=100 disable. Final disabling hits here were driver 55/chariot 32 across mixed+stressed fields.
6. **What causes OOC/retirements/wrecks:** shock accumulation exceeding recovery, compromised resistance/control and low starting condition. Natural mixed/high-risk OOC emissions 16/20; 5/82 retirements and persistent wrecks. Forced exposure confirms other physical routes separately.
7. **Do reactions suppress consequences:** substantially at immediate contest level (413 healthy same-state threshold flips), but no defense-off full-race causal estimate is made. Recovery and resistance also matter.
8. **Aggressive vs cautious:** controlled field assignments show more attacks/Push and better place/time but more fatigue for aggressive; fewer received attacks/slightly less damage. No retirement difference identified in that healthy panel.
9. **Heavy vs light:** mass increases energy and slows acceleration/speed; reduced-mass half-shares are symmetric. Durability/protection/stability create survivability niches; weight alone does not grant attacker-only momentum advantage. Light maneuverability/pace can avoid exposure. Mixed equipment associations are not an equal-budget causal comparison.
10. **Does current simulation support Dangerous Racing:** partially demonstrated. Most finish, worn/conditions create serious natural risks and wrecks, and racing remains central. Healthy ordinary serious risk remains unobserved and ram tactics are essentially absent. Full intended experience is not yet established or accepted.
11. **Responsible mechanisms/coefficients:** selection lacks contextual payoffs; shared contest gate, reaction 10/defending 12,5/s recovery vs resisted weapon shock, low closing-speed energy, symmetric ram recoil and speed loss, condition/resistance/grip attenuation. These are mechanisms and provisional defaults, not automatic defects or approved tuning instructions.
12. **Smallest likely change set:** first improve expected benefit/self-cost features within approved utility AI and re-evaluate, without changing physics/defenses. Decide whether healthy ordinary risk is insufficient before any narrow damage/shock/recovery coefficient trial. Preserve signs, rules, permanent wrecks and racing priorities. Detailed risks/tests/approval classification are in [recommendations](DANGEROUS_RACING_RECOMMENDATIONS.md).

**No gameplay tuning, source repair, deployment or publication performed. No new direct offline/browser launch is claimed.** Findings are recommendations; no final owner acceptance or universal correctness follows from passing tests.
