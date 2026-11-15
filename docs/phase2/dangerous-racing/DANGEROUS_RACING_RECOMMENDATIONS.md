# Dangerous Racing recommendations

Investigation only. Existing mechanics already produce condition-dependent damage failures; do not treat the earlier healthy-field zero counts as evidence that the wreck system needs replacing. No tuning is implemented or authorized by this report.

## 1. Give combat selection a context-sensitive expected payoff — likely AI behavior issue

- **Observed problem/evidence:** zero ram selections across 600 Combat cohort races despite 359,121 ram-candidate decisions; standard aggressive both-legal probes64/64 attack; high-A/zero-O produces13/64 noise-driven ram initiations. Mass, equipment, relative speed and position-value do not distinguish combat utilities. Both-finished worn-rival diagnostics sometimes favor ram's delay, while healthy equal-speed cases favor weapons.
- **Proposed change:** after approval, score weapon and ram using a bounded expected rival-delay/condition benefit and self-damage/lost-progress cost, conditioned on legitimately perceived information. Evaluate uncertain opponent properties rather than granting omniscience. Preserve the shared legal/action framework and deterministic goals; do not force quotas or simply boost ramBase.
- **Expected effect:** a defensible contact niche, weapon preference when safer, disengage/pass when attacking harms racing. Could improve useful mass/protection choices without global lethality changes.
- **Unintended consequences:** excessive victim targeting, lost racing focus, new persistence loops, expensive scoring, replay changes; hidden-condition exploitation if perception is bypassed.
- **Implementation risk:** medium/high, affects action/contact graphs. **Authority classification:** extends feature use within approved utility/perception mechanics and adds provisional coefficients; not a change to combat legality/physics or sign rules. Owner approval of this specific algorithm is needed.
- **Regression coverage:** both/weapon/neither default legality and impossible ram-only; unforced ram niche and weapon/pass alternatives; damaged self/relative speed/protection/valuable place; Pure prohibition; no omniscience; intention/effect/physical linkage; cooldown/initiative/reaction budget; deterministic permutation/replay; paired full-race position, fatigue, condition and wreck outcomes. Require benefits to racing, not only counts.

## 2. Decide healthy-field risk before touching lethality — likely balance issue / incomplete design validation

- **Observed problem/evidence:**0/1600 healthy retirements or new serious threshold crossings; mixed5/1600 and high-risk82/1600 damage retirements, with87 weapon-caused failures total. Healthy no-event evidence has only 40 independent five-weather seed blocks. Existing damage is meaningful against worn competitors.
- **Proposed change:** first have owner judge saved healthy/mixed/stressed replays against the qualitative target, without approving a numerical casualty quota. If healthy ordinary danger is insufficient after selection improvement, test one narrowly bounded provisional parameter family at a time (weapon shock/physical shock or recovery, then damage only if warranted). Do not simultaneously increase damage and weaken defense.
- **Expected effect:** preserve most finishers and make reckless accumulation legible rather than a global casualty lottery.
- **Unintended consequences:** cascading wreck blockages, component sniping, start-line casualties, Pure contact lethality, excessive retirements, fatigue feedback and biased balance comparisons.
- **Implementation risk:** high for damage, moderate/high for shock/recovery; no production value proposed here. **Authority classification:** potential provisional-coefficient changes, no approved disable/finish/wreck rule change. Requires owner-approved experiment and later tuning decision.
- **Regression coverage:** healthy/mixed/stressed matched cohorts; new vs initially low condition; driver/chariot/team thresholds; chronological multi-hit effects and recovery; OOC braking; permanent/secondary wrecks; Pure incidental consequences; common-line locked results/clearance; rare-event seed uncertainty and replay.

## 3. Preserve defense while evaluating opportunity cost — inconclusive full-race causal effect

- **Observed problem/evidence:**413/838 healthy contests flip the success threshold when subtracting the actual reaction bonus; all 838 have reaction eligibility. One-tick budget refresh is much quicker than1.2s attacker cooldown. Controlled simultaneous groups expose the second attacker after budget exhaustion; skill/protection/state influence outcomes differently.
- **Proposed change:** no automatic defense nerf. If needed after selection changes, approve a matched study of reactive bonus and active-defense opportunity cost separately, using existing configuration knobs; evaluate position/time and subsequent exposure, not only hit count. Add precise eligibility-reason telemetry only if it can remain passive/parity-verified.
- **Expected effect:** identify whether defense protects racing or removes too much risk, keeping cautious driving a meaningful alternative.
- **Unintended consequences:** dogpiling, low-skill helplessness, too many start-line failures, unfair active-defense loss after budget exhaustion.
- **Implementation risk:** low for optional external telemetry, high for reaction rule changes. **Authority classification:** current suggestion is measurement; any bonus adjustment is provisional tuning, whereas budget refresh/eligibility rule changes alter approved mechanics and require explicit design approval. No rule change recommended as the first step.
- **Regression coverage:** simultaneous/serial/subevent attackers; exhausted vs OOC; defending flag and bonus; skill/equipment controls; no duplicate damage; Pure legality; exact replay/initiative/permutation and healthy-field finishing position.

## 4. Review wreck-blocked clearance outcomes — workflow limitation, no confirmed core defect

- **Observed problem/evidence:**3/200 high-risk Combat races reach Stalled after every entrant is classified; finished RU5 cannot clear a permanent wreck near exit. All three exact replays preserve times and anchored obstruction; no safeguard retirement is fabricated.
- **Proposed change:** agree whether explicit classified-but-clearance-blocked termination is acceptable. If not, specify legal safe-clearance routing/administration before implementation; preserve no teleport, no wreck removal/displacement, and locked official finish. Improve reporting of this distinction if approved, without a viewer redesign.
- **Expected effect:** understandable completion/clearance status in dangerous races.
- **Unintended consequences:** blocked exit rerouting can hit active competitors, create lane conflicts, or accidentally change official finish/order.
- **Implementation risk:** low for report labels, medium/high for routing. **Authority classification:** presentation clarification or implementation of already-approved safe movement; any automatic removal/teleport/wreck cleanup would change binding rules and is not proposed.
- **Regression coverage:** all three saved stalls; finished vs retired state; common exit obstruction, crowded finishers, lateral legality, simultaneous movers, unchanged finish snapshot/time, anchored wrecks, explicit bounded termination and replay.

## 5. Keep broader balance questions isolated — further investigation

- **Observed problem/evidence:** prior F02 Speed archetype advantage and F03 Hold-vs-Push pacing interactions can change time spent in combat range. Here aggressive drivers finish faster and take fewer hits despite more offense. Combat frequencies alone cannot identify useful combat.
- **Proposed change:** carry forward existing F02/F03 evidence and use paired competitive position/time/fatigue/damage endpoints when evaluating any approved combat change. Do not tune Speed, signs or fatigue in the same pass.
- **Expected effect:** attribution of improvements and protection of racing as primary objective.
- **Unintended consequences:** a narrow fixture can overfit if alternative weather/grid roles are omitted.
- **Implementation risk:** low for analysis, high if folded into simultaneous balance changes. **Authority classification:** analysis only; subsequent RU/sign coefficients require separate approval, while sign accounting/activation rules remain binding.
- **Regression coverage:** prior equal-budget and rear-row references, matched weather/grid, autonomous outcomes, all six signs, intended/effective/physical compliance, exact replay and current full suite.

## Owner decisions and defect status

Prioritize recommendation 1, then reassess the target before any risk tuning. Decide whether ordinary healthy races need more credible serious risk than observed, whether the current symmetric physical ram tradeoff matches the intended fantasy, and whether blocked post-finish clearance is acceptable. No approved mechanic needs to be silently changed to continue.

**No confirmed implementation defect requiring a corrective pass was established.** Ram scoring is a demonstrated AI limitation; casualty distribution is a conditional balance/design result; clearance stalls are reproducible workflow limitations. A stronger momentum-transfer or displacement model would change mechanics and needs separate design approval; it is not the minimal recommended fix. Do not implement these proposals until the owner approves specific changes.
