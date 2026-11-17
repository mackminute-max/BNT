# Combat AI refinement — implementation report

**Implemented: simulation 0.4.3-combat-ai, package 0.4.3. Ready for owner review with the limitations below.** Weapon attacks, autonomous rams and declining combat have deterministic, defensible tactical scenarios. Physical mechanics and Strategy Sign rules are unchanged. No deployment, publication or remote push performed.

## Baseline and scope

Reference materials reviewed: establishment specifications and completed Dangerous Racing results/AI/damage/recommendations. The owner's current implementation authorization supersedes those reports' earlier investigation-only boundary. Baseline Git revision 091445def6f0c63b79fbcf130019a21545d0bf73, simulation 0.4.2-corrective,162 retained tests passed. `baseline/source.tar.gz` archives executable sources, tests, tools, packages and the prior standalone; `baseline/revision.txt` and `baseline/artifact.sha256` identify them. Historical investigations/audits are preserved unchanged.

Runtime changes: new `src/ai/combat-value.js`, `src/ai/driver.js` combat candidate scoring/target ranking, new bounded defaults in `src/ai/weights.js`, and the simulation version constant. Package/lock versions advance and the standalone is rebuilt. All existing non-AI runtime modules, including consequences, incidents, fatigue/environment, model, movement/race administration, signs, telemetry, reporting and replay, are byte-identical to baseline. No reaction/weapon/ram cooldown/range, contact energy, damage, fatigue, control threshold, retirement, wreck, weather, surface, attribute or sign coefficient changed.

Development changes:16 focused regressions; matched-run/scenario/analysis/replay/browser/report tools; existing browser Combat fixture now supplies a meaningful positive-value weapon opportunity while retaining its attack/sign/complete-event parity assertions. The default weak driver may legitimately decline combat even under Engage; that sign remains an influence rather than forced obedience. The fixture restores defaults before all following checks.

## Decision logic

The existing additive utility pipeline remains. For each currently perceived legal rival/action pair, add bounded expected-damage/disruption rewards and self-damage, component/control-loss, racing opportunity, retaliation, condition and low-success costs. Rank targets by that action's contextual value, stable-ID ties; then retain the existing action utility, personality, sign, persistence and seeded noise competition against noncombat choices. No new RNG draw, cadence change or persistence rule is introduced. No external attack command or guaranteed ram is inserted into normal AI. Combat legality and final physical execution remain independently authoritative.

The evaluator receives **only the actor and the existing perceived neighbor records** (ID/lane/gap/speed/status/physical). It does not read opponents from authoritative state. Unknown rival mass, skill, armor and condition use disclosed configurable priors. Assume a fresh defensive reaction; do not peek at hidden reaction budget, active defense, target attributes, damage or random rolls. Opponent conditions are not learned from old damage events in this pass; actual observed speed and local position are the vulnerability/disruption cues. This is intentionally less informed than an omniscient combat optimizer.

Success probability integrates the difference of two uniform contest-noise draws under those priors, with exact positive-margin tie semantics when noise is zero. Nominal resisted damage times that chance is a **utility estimate**, not a second authoritative damage implementation or perfectly calibrated real-world probability. Ram estimates use the existing symmetric reduced mass/half-energy consequences, relative speed and own actual resistance. No heavier-chariot attacker bonus is assumed. A slower protected actor may value slowing a faster adjacent rival; high recoil, weak condition, instability or loss of its own speed lowers the value. Own health and remaining instability margin contribute an explicit squared/capped component/control-risk cost, preventing huge energy benefits from hiding catastrophic recoil after saturation.

Racing cost uses perceived clear track/passing opportunities, whether already ahead of that rival and own final-lap eligibility. It is a local-position estimate, not access to hidden global rank. Caution and Patience increase costs; Aggression/Opportunism retain their offensive terms; Stamina Management retains fatigue/pace tradeoffs; Tactical Discipline retains sign responsiveness. Existing noncombat, pace and defensive candidates remain available and unmodified. Declining combat changes exposure graphs and therefore may change damage/retirement counts despite identical lethality settings.

## New configuration

| autonomous.utility key | Default | Meaning |
| --- | --- | --- |
| combatDamageValue | 4 | Resisted target-condition benefit |
| combatDisruptionValue | 4 | Relative speed disruption / damage-impairment proxy |
| combatSelfRisk | 4 | Expected resisted bilateral recoil cost |
| combatControlRisk | 8 | Squared component-failure/control-margin risk cost |
| combatProgressCost | 1 | Clear track, passing, local lead, final lap and own speed-loss cost |
| combatRetaliationCost | 1 | Estimated retaliation/exposure cost |
| combatConditionCost | 3 | Own weak components and current instability cost |
| combatFutilityCost | 3 | Low estimated chance-of-success cost |
| combatDamageUnit | 10 | Condition points per normalized damage unit (effective minimum1) |
| combatSpeedUnit | 2 | m/s per normalized relative speed-loss unit (effective minimum1) |
| combatUnknownSkill | 50 | Prior opponent Driving/Control/Combat-base score |
| combatUnknownProtection | 50 | Prior rival protection (%) |
| combatUnknownCondition | 100 | Prior rival healthy component condition (%) |
| combatUnknownMassRatio | 1 | Prior rival mass / configured referenceMass |


All keys use existing validated utility range **0..100**, rejecting unknown/nonfinite/out-of-range input. Each normalized reward/cost feature is bounded, principally 0..2 (signed disruption −2..2); futility is 0..1. Damage/speed units use effective floor 1 and mass estimate floor 1kg to remain finite even when an allowed configuration supplies zero. Defaults/priors are provisional, not final balance canon. The existing Utility developer selector automatically exposes them, generic versioned configuration export/import preserves them, and paused `utility.*` overrides are validated/logged/replayed.

Candidate diagnostics retain numeric feature contributions in `terms` and explicit assumption/probability/damage/recoil/risk metadata in `assessment`. Existing intended/effective/executed/physical outcome fields and decision-ID linkage remain unchanged; a selected attack is not mislabeled as a successful hit. The six signs retain their exact influences, queue/activation/accounting and compliance logic. The ordinary action distribution can change without changing sign semantics.

## Behavioral evidence

Unforced seeded scenario17: protected actor Combat90/equipment60, chariot protection/durability100/stability80, normal180 weight, beside a healthy rival. Equal10m/s selects weapon; actor5m/s vs rival18 selects ram; removing actor protection/durability selects weapon instead; compromised actor driver35/chariot20 condition selects hold; weak-payoff balanced actor selects hold; cautious profile with identical skills/equipment selects defensive combat. All use actual default AI noise/errors and physical resolution. No sign, goal injection, utility override or external ram command forces the favorable ram fixture. Slow actor represents a recoverable speed disadvantage; the rival remains within legal adjacent range.

The actual favorable ram produces a successful contest and two linked bilateral damage events; sign-assisted variant preserves pending→executed telemetry and Followed compliance. Replay files `weapon`, `ram`, `unsafe-ram`, `damaged`, `race-on` contain actual command/event/checkpoint records. Tests also cover unknown-opponent invariance, local lead/final-lap cost, Pure prohibition, all six signs, paused edits, config validation/roundtrip, RNG-free estimation, permutation, and legal extreme200m/s recoil risk. These controlled scenarios establish niche recognition, not an ordinary-field minimum frequency.

## Matched complete-race comparison

Frozen workload:100 healthy +100 mixed +100 high-risk Combat races per version, default three-lap/four-lane model, eight entrants, five weather presets,20 shared seed blocks4100..4119, representative existing equipment/personality/row/surface strata and grid rotations. Baseline is run from the archived executable tree; completed AI uses the **same raw input jobs**. New default utility metadata legitimately changes normalized configuration hashes. No signs in this panel. Configurations/seeds, per-RU official classification/time/condition/fatigue, AI, physical and diagnostic data are under `baseline/races/` and `current/`; `comparison.json` retains detailed descriptive moments/percentiles and paired seed-cluster intervals.

| Cohort (100 matched races /20 seeds) | Weapon selections before→after | Weapon contests/hits before→after | Ram contests before→after | Retirements / wrecks before→after | Completion before→after |
| --- | --- | --- | --- | --- | --- |
| healthy | 429→0 | 418/30→0/0 | 0→0 | 0→0 | {'Ended': 100}→{'Ended': 100} |
| mixed | 1460→1352 | 1436/569→1314/667 | 0→0 | 3→18 | {'Ended': 100}→{'Ended': 99, 'Stalled': 1} |
| high-risk | 4169→0 | 4030/819→0/0 | 0→0 | 51→0 | {'Ended': 99, 'Stalled': 1}→{'Ended': 100} |


| Cohort | Damage/race before→after | Overtakes/race before→after | Finish fatigue before→after | Same-entrant finish-time Δ s [95% CI] | Both-finished entry pairs |
| --- | --- | --- | --- | --- | --- |
| healthy | 4.322→1.952 | 32.330→32.130 | 19.688→19.692 | -0.065 [-0.147, 0.012] | 800 |
| mixed | 67.670→92.629 | 20.460→21.750 | 20.788→20.960 | 0.919 [0.082, 1.770] | 780 |
| high-risk | 105.726→1.173 | 18.540→20.340 | 30.522→30.346 | -4.759 [-6.350, -3.126] | 749 |


| Cohort | Noncombat decisions before→after | OOC events before→after | Max per-RU decisions (after) | Rapid reversals/race before→after | Official position changed / paired entries |
| --- | --- | --- | --- | --- | --- |
| healthy | 279712→280066 | 0→0 | 902 | 0.990→0.960 | 29 |
| mixed | 322237→316864 | 8→58 | 1063 | 0.640→0.530 | 203 |
| high-risk | 508255→539001 | 15→0 | 2041 | 0.960→1.340 | 282 |


**No ram was selected in these 300 ordinary cohort races.** The favorable autonomous niche is proven by controlled scenarios, but broad natural ram use is not demonstrated. No frequency quota was added and no utility was retuned to manufacture a batch count. This remains the main applicability limitation.

Healthy default skill/personality drivers stop attempting low-probability offense; overtaking/time remain close to baseline. Mixed-field attacks become more selective: fewer contests but more successful hits (569→667), damage retirements 3→18 and OOC 8→58. Damage/race mean increases about 24.96 points, but its paired95% seed interval spans approximately −0.81..52.19; do not overstate precision. High-risk drivers now prioritize preserving badly worn own components: offense and damage retirements 51→0, with faster surviving entrants and more overtakes. This is an AI-induced risk redistribution, not tuned damage and not proof that the Dangerous Racing risk target is now satisfied. It warrants owner review.

Official time comparisons match the same RU in each seed/weather race and average complete pairs per race before 20-seed cluster resampling. Nonfinishers retain null finish time and explicit retirement progress/cause; no timeout/zero substitute. Mixed transitions: 780 finish both, 17 newly retired, 2 newly finish, 1 retired both. High-risk 51 recover from former retirement to finish; no new retirements there. Finish fatigue is the immutable finish snapshot and survivor-conditional. Within-field finishing-place changes are exported per entry; average place across a complete field can hide redistribution.

Main after version: 299 Ended/1 Stalled, no errors, no bounded/tool failures, no invalidated attack. Baseline also299/1, but stall IDs differ. Old `DR-high-risk-10-3-Combat` clears under the refined AI; new `DR-mixed-13-2-Combat` has finished RU2 Clearing behind persistent wreck(s), all entrants already classified. Its full replay is saved. This is the existing wreck-blocked post-finish clearance limitation; no time/classification is rewritten and no wreck is moved/despawned to hide it.

Maximum rapid lane reversals per RU remains 5 in either version. All races are bounded and classify; no unbounded decision loop observed. High-risk average rapid reversals rises 0.96→1.34 per race, a bounded behavioral difference rather than a hidden guarantee of no future oscillation. Decision counts, rejected maneuvers, raw outcomes and full metadata remain available for independent inspection.

## Verification and compatibility

- Baseline 162 retained tests pass; final **178 tests pass,0 fail,0 skipped** (16 new focused cases).
- `evidence/verification.json`: 14 checks — five behavior replays, four saved study-row exact metric/observer/replay cases, two whole-dataset accounting checks, a byte-identity scope guard and two cross-version forced reference-driver comparisons with identical physical events. Expected autonomous event/checksum changes are not called nondeterminism.
- Fresh replay reconstruction under 0.4.3 matches full events/checkpoints/final checksums; observer-on/off full captures agree. Old 0.4.2 records/configs remain version-specific and must use archived baseline or be explicitly regenerated. No silent migration.
- Standalone build passes embedding/dependency checks; vanilla JS/HTML/CSS/Canvas remains self-contained.
- Five new browser/headless tactical scenarios match complete captures exactly; new coefficients are present in the existing developer editor; no page errors/additional runtime requests. The full retained campaign adds 23 passing functional checks, for 30 total. Both campaigns report administrator-blocked direct-file access separately. `evidence/browser-report.json` and `evidence/combat-browser.json` retain the actual results. Nine compressed exported replay files also reconstruct successfully after file readback (`saved-replay-readback.json`).

Artifact: **dist/Blood_and_Thunder.html**, **169883 bytes**, SHA-256:

`29d3b74f0503f7a0538e7e4ee16728af82f9f5f6cb9c93bc6eacbedd28e765ac`

Direct `file://` launch remains blocked by managed Chromium administrator policy. HTTP diagnostic functional/parity checks do not independently verify double-click offline execution. No bypass attempted. Owner verification of the old pre-corrective artifact does not establish direct-file operation or acceptance of this newly hashed build. Local-file confirmation of the new artifact remains outstanding.

## Development failures retained

One adversarial regression failed in the initial scorer: capped target/disruption benefit could outweigh capped self-damage even at extreme contact speeds. Added the configurable component/control-risk term; all 16 focused cases then pass. No physical tuning or weakened assertion. An initial 300-race development pass is preserved under `development/initial-races/` with its own pre-risk executable snapshot, excluded from the final 300-vs300 comparison. Those development 0.4.3 records belong to that snapshot, not the final candidate; they are not a second independent validation sample.

Browser tool failures were fixed transparently: the new parity comparator had normalized only Node's negative zero through JSON, so it now compares raw browser and raw Node captures exactly (no tolerance). Two UI test edits attempted to fill/select within collapsed Developer details; the scripts now open the panel through its normal control. The old default-Engage attack assertion needed a positive-value fixture under intentional new behavior; the attack assertion and all exact parity checks remain. Failure reports/logs are retained in `development/`. None of these failures was suppressed as a passing check.

## Assessment and limits

Implementation completion criteria are met at the controlled tactical level: weapon/ram/decline each have defensible choices, favorable ram is autonomous and physically resolved, existing rules remain intact, deterministic regression/build evidence passes. The ordinary 300-race panel does **not** establish widespread ram tactics, final balance, enjoyment or universal correctness. Conservative unknown-property priors can miss real opponent vulnerabilities and make low-skill drivers passive; these are explicit limitations for owner review. Clearance blockage remains reproducible. Do not tune damage, change signs, introduce equipment/progression or start another milestone from this result.

Next decision is owner review of the artifact, conservative combat preferences, absence of natural cohort rams and redistribution of worn-field risk. No final owner acceptance is declared.
