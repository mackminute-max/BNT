# Phase 2 findings and recommendations

**Measurement only: no tuning, mechanics change, push or publication has been performed.** The primary 1,000 races and separately declared 130-race rear-row follow-up support conditional recommendations, not final balance canon. See the [analysis](PHASE2_SIMULATION_ANALYSIS.md), [methodology](PHASE2_EVALUATION_PLAN.md), [data](data/) and [supplement](supplement/).

## Prioritized actionable findings

### F01 — Likely AI behavior issue: deliberate rams have no observed selection niche

**Evidence:** 2,818 valid Combat attack contests across the primary and supplemental workloads, all weapon attacks; zero rams. Offensive actions remain absent in Pure. The existing ram resolver and regressions are present; this is not evidence that collision mechanics are missing.

The default attack-versus-ram nominal utility difference is `0.1 + 0.5 * Opportunism/100`, from `src/sim/consequences.js` defaults and `src/ai/driver.js` candidate construction. Aggression and Caution contributions cancel, and Engage adds the same bonus to both. For an offensive driver with Opportunism >=40 and neither candidate benefiting from a preexisting goal, the difference is >=0.3, the entire possible difference between two default utility-noise draws. Attack range also contains the default ram range. Thus these profiles cannot initiate a ram purely through bounded noise when both candidates are legal. Existing attack-goal persistence strengthens that advantage. This algebra is conditional on the current candidate features/defaults, not a proof for all configurable personalities/goals.

**Gameplay impact:** an approved tactical action is mechanically available but absent from ordinary evaluated play. This limits combat variety and leaves mass/physical-ram tradeoffs unmeasured.

**Proposed correction for owner review:** first test a controlled mass/position/weapon/driver-skill panel with legal adjacent ram opportunities. If the absence persists and the owner wants a meaningful ram niche, give the two intents context-sensitive expected benefit/cost features rather than forcing a ram frequency or adding arbitrary random choice. Do not simply increase lethality to conceal selection dominance.

**Estimated risk:** medium/high; changes alter AI decision and contact graphs. No change is authorized by this finding.

**Suggested regression coverage:** deterministic legal ram selection in an explicitly chosen niche, weapon selection elsewhere, Pure prohibition, reaction-budget invalidation, seeded/permutation parity, physical energy/component damage, persistent wreck/chain handling and complete races.

### F02 — Likely balance issue: Speed has high leverage under the flat beast-point budget

**Evidence:** each archetype has the same 300 points per beast, identical drivers/chariots/equipment/personality and equal grid exposure. Per format, Speed wins 74/100 races, Endurance 19, Handling 5, Power 2, Balanced 0. Speed wins 46.25% of its 160 entry opportunities; multiple entries of each type explain the distinction from race-win share. +10 Speed on both beasts improves official time by 5.18 s in the small sensitivity panel, compared with 1.03 s Power, 0.81 s Agility and 1.43 s Endurance. Only four paired conditions support each sensitivity estimate.

**Counterevidence/limits:** Endurance wins 9/20 Mud and 9/20 Heat races, versus Speed's 11/20 in each. There is a meaningful environment-dependent niche. Flat raw points are a defensible experimental budget, not an approved economic price system. Chariot/driver synergies, alternative geometry, team size, weapon load and other tracks are not explored.

**Gameplay impact:** Power/Handling-focused teams may feel weak in the reference three-lap contest even though their attributes are functional. This is not a formula defect or a mandate for equal win rates.

**Proposed correction for owner review:** approve a target tradeoff and run a factorial Speed/Power/Handling sensitivity panel with matched grid roles and several approved geometry/traffic settings. Evaluate resource-budget weights or narrowly scoped performance contributions only after that panel; do not add economy/progression systems or silently nerf Speed here.

**Estimated risk:** high for global formulas; moderate for a later, explicitly approved localized balance change.

**Suggested regression coverage:** attribute monotonicity/sanity, equal-budget audit, weather interaction, corner risk rather than hard capping, launch-versus-distance effects, fatigue, common-line timing, replay and mixed-field matched-seed distributions.

### F03 — Likely balance/semantic issue: Hold Position can outperform sustained Push at lower fatigue cost

**Evidence:** the primary front-row controls all finish first, so rank improvements there are censored by a ceiling. The follow-up places the same balanced player in rear slot RU5, where controls average 6.6th (range 5–8). Hold improves mean rank by 4.3 places and time by 13.55 s; sustained Push improves rank by 1.8 places and time by 4.54 s. Hold adds 3.57 fatigue points versus Push's 12.95. The directly paired Hold-minus-Push comparison is retained in `supplement/analysis.json`, including intervals.

**Mechanism hypothesis:** `signPreference('Hold Position', 'Maintain')` supplies a pace preference as well as a positioning preference. Maintain has no direct fatigue penalty in its utility score, whereas Push's utility decreases with fatigue. Hold also causes fewer lane changes in these cases. These are legal preference changes, not a forbidden physical-stat bonus. The respective contribution of pace and path choice is not isolated by this experiment.

**Gameplay impact:** the instruction's plain-language positional meaning may hide a strong endurance-efficient pacing strategy. Current results do not prove Hold dominates for every profile, initial position, build or schedule.

**Proposed correction for owner review:** clarify whether Hold is intended to be a pace instruction. Compare transient Push/lowering, Hold, and mixed schedules across driver personalities and traffic. If the semantic coupling is unintended, consider narrowing the Maintain preference or otherwise separating pace and positioning intent after approval; preserve driver autonomy and do not force obedience.

**Estimated risk:** medium; sign/pace changes affect fatigue and overtaking distributions.

**Suggested regression coverage:** intended/effective/physical distinction, contextually overridden and prevented instructions, no direct stat buff, all sign accounting, matched traffic/clear-air comparisons, fatigue and official-time tradeoffs, deterministic replay and batch reporting.

### F04 — Presentation or telemetry issue: exact motion/planning metrics are not fully observable

**Evidence:** existing structured events do not expose every continuous trajectory segment or an explicit strategic/tactical phase. The evaluation therefore labels maximum speed as observed lower-bound samples, average speed/lane time as sampled estimates, and decision timing as due/early-boundary/subevent proxies. Damage events provide energy only for logged consequences; no-damage contact energy cannot be recovered reliably. No source mutation or inferred fake event fills these gaps.

**Gameplay impact:** misleading labels could turn measurement limitations into false claims of AI loops, physical maxima, or tactical-planning failures. The current report/dataset documents the limitations; it does not establish a gameplay defect.

**Proposed correction for owner review:** if exact telemetry is needed for the next approved study, add an optional non-authoritative subevent observer with explicit phase/outcome labels and no RNG/state writes. Define applicability for an instruction already satisfied by the current line before changing compliance semantics. Avoid interpreting raw Prevented/Overridden percentages as a measure of the driver's motivation.

**Estimated risk:** low if an observer is passive and parity-tested; otherwise potentially high if it changes event/RNG sequencing or batch performance.

**Suggested regression coverage:** observer on/off exact checksum/events/RNG parity, no callback state mutation, continuous-distance/time integration checks, paused inputs, first-divergence replay, and all existing offline/build checks.

## Context-sensitive or inconclusive observations

### F05 — Inconclusive observation: sign opportunity and benefit depend strongly on race context

Front-row Seek Open Track has 0% full compliance among applicable decisions and no changed result/time, while the rear-row panel has 3.78% full compliance and about 49.5% inapplicability but still improves mean position by 0.4 and time by 2.24 s. A small number of effective maneuvers can matter even when most decisions are not classified followed.

Front-row Engage is inapplicable on 93.35% of decisions but adds 17.05 attacks and 16.95 inflicted condition points per race. Rear-row Engage is inapplicable on 85.37%, adds 39.1 attacks/50.03 inflicted condition points and improves mean position by 1.2. This is a narrow-opportunity sign with a measurable conditional effect, not an inert mechanic.

Conserve and Defensive are usually followed and reduce fatigue substantially while worsening finish time/rank. That is an observed tradeoff, not automatically a defect. No approved rule says every sign must improve finishing position.

**Recommendation:** broaden traffic/skill/profile/schedule controls before any blanket sign-strength increase. These supplemental estimates have only ten pairs per arm and were designed after seeing the primary ceiling; they are exploratory, not confirmatory tests. Risk of tuning from a single context is medium/high. Preserve the existing sign rules and test accounting/replay for any later approved changes.

### F06 — Inconclusive observation: normal-field casualty/control-loss rates

All 1,130 races/9,040 correlated entries finish without retirement, permanent wreck creation or Out-of-Control emissions. This does not prove those systems are absent or broken; retained deterministic regressions exercise them. The field uses healthy teams, no heavy-ram specialization, standard offensive skill/equipment and unchanged damage coefficients. No target casualty rate is approved.

**Recommendation:** owner should first define the intended injury/risk experience, then approve controlled combat-skill/equipment/condition experiments. Report rare counts and uncertainty rather than manufacturing a casualty target or immediately increasing damage. Zero events also means secondary-wreck balance was not measured here. Damage-tuning risk is high because it changes retirement, obstruction and chain outcomes; retain all permanent-wreck/secondary-impact regressions if tuning is later approved.

## No issue identified within tested coverage

### F07 — No issue identified: deterministic stability, format legality and completed racing

All 1,130 races end, with no integrity error, stall, bounded execution or evaluation tool error. The nine-plus-one parity cases and 32 repeat primary executions match checksums/events. There are no offensive Pure actions. Both weather and composite surfaces have measurable effects, and individual tested attributes are not inert. This is bounded evidence, not universal correctness or final acceptance.

### F08 — No issue identified: persistent-procession or unbounded-oscillation claim

Default races average 51.77 Pure/50.38 Combat explicit overtakes. Average blocked time is only 0.287/0.274 s per entry. The largest repeated-check case is a 4.94-second obstruction, not an illegal-lane loop; its four lane attempts all succeed. At most four rapid reversals per entry occur in the primary data. These facts do not support a blanket procession or persistent-oscillation diagnosis.

**Recommendation:** retain the outlier IDs and regenerate/replay before changing switch-cost/hysteresis. Separate forward occupancy rechecks from actual rejected lateral commands. Risk of unnecessary retuning is medium. Regression should preserve legal avoidance, passing clearance, no blocked-travel bursts, occupancy and deterministic outcomes.

## Decision boundary

No confirmed implementation defect requiring a separate corrective pass was established. Any future defect found in focused reproductions should be isolated and corrected separately from balance experiments. Phase 2 ends with these measurements/recommendations. Owner approval of a specific subsequent change is required; no recommendation here implements or authorizes tuning.
