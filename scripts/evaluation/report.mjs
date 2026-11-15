import {readFile,writeFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
const root='docs/phase2/',a=JSON.parse(await readFile(root+'data/analysis.json')),s=JSON.parse(await readFile(root+'supplement/analysis.json'));
const b=JSON.parse(await readFile(root+'baseline/manifest.json')),study=JSON.parse(await readFile(root+'baseline/study-references.json'));
const primary=gunzipSync(await readFile(root+'data/races.jsonl.gz')).toString().trim().split('\n').map(JSON.parse);
const supplement=gunzipSync(await readFile(root+'supplement/races.jsonl.gz')).toString().trim().split('\n').map(JSON.parse),all=[...primary,...supplement];
const n=(x,d=2)=>Number.isFinite(x)?(Math.abs(x)<1e-9?0:x).toFixed(d):'—';
const percent=x=>n(x*100,1)+'%';
const ci=(m,d=2)=>m?.ci95?'['+m.ci95.map(x=>n(x,d)).join(', ')+']':'—';
const table=(heads,rows)=>'| '+heads.join(' | ')+' |\n| '+heads.map(()=>'---').join(' | ')+' |\n'+rows.map(r=>'| '+r.join(' | ')+' |').join('\n')+'\n';
const total=(field)=>all.reduce((x,r)=>x+(r.race[field]??0),0);
const controls=f=>primary.filter(r=>r.experiment==='D'&&r.format===f&&r.arm==='none').map(r=>r.ru.find(u=>u.id==='RU1').finishPlace);
const baseline=`# Phase 2 immutable baseline manifest

The evaluated engine is **${b.version}**. HEAD is \`${b.gitHead}\`, but the working tree already contained the corrective pass. HEAD alone is not the evaluation revision. No baseline reference was replaced after instrumentation.

| Item | Recorded baseline |
|---|---|
| Source archive | [baseline/source.tar.gz](baseline/source.tar.gz), including untracked corrective source/tests, scripts, original docs, current implementation docs and standalone build |
| Archive SHA-256 | \`${b.sourceArchiveSHA256}\` |
| File-level snapshot | [baseline/files.sha256](baseline/files.sha256); manifest SHA-256 \`${b.filesManifestSHA256}\` |
| Dirty-tree evidence | [Git status](baseline/git-status.txt), [working-tree patch](baseline/working-tree.patch). The patch alone omits untracked files; use the archive. |
| Simulation/package | 0.4.2-corrective / 0.4.2 |
| Complete defaults | [default-configuration.json](baseline/default-configuration.json): normalized setup, all coefficients, RU roster/positions, weather, surfaces and initial checksum |
| Original tests | 144 passed, 0 failed, 0 skipped; [log](baseline/tests-before.log) |
| Standalone artifact | ${b.artifact.bytes.toLocaleString('en-US')} bytes, \`${b.artifact.path}\` |
| Artifact SHA-256 | \`${b.artifact.sha256}\` |

## References captured before instrumentation

${table(['Format / intervention','Default cadence','Authoritative checksum','Event SHA-256'],b.references.map(r=>[r.id,'100',r.checksum,'\`'+r.eventsChecksum+'\`']))}

Compressed full replay records for all four cases are in baseline/. Reference results/conditions are in [references.json](baseline/references.json).

## Diagnostic cadence variant, also captured before instrumentation

The 1000-race study uses checkpointInterval=10000 solely to avoid repeatedly hashing the entire event history. This does not change default runtime settings. The before-instrumentation variant has **exactly identical event SHA-256, RNG progression and physical outcomes** to the default-cadence case in each format. Whole-state checksums differ because the cadence itself is part of authoritative state; this metadata difference is explicit rather than hidden.

${table(['Format','Cadence','Variant checksum','Default-cadence event/RNG parity'],study.map(r=>[r.format,'10000',r.checksum,String(r.physicalParityWithDefault)]))}

[study-references.json](baseline/study-references.json) retains full setups. Final instrumentation verifies the original four default-cadence references, both study references, and four additional scheduled-sign/environment cases, including the supplemental rear-row context. See [instrumentation-parity.json](evidence/instrumentation-parity.json). No simulation source, configuration default, existing test, approved document or standalone byte changes as part of Phase 2.

This task did not perform a new direct offline browser verification. The preexisting owner/managed-browser evidence is preserved in the corrective report; Phase 2 does not extend or reinterpret it. The rebuilt file remains byte-identical and independent of all evaluation tooling.
`;
await writeFile(root+'PHASE2_BASELINE_MANIFEST.md',baseline);
let text=`# Phase 2 simulation analysis

**Completed ${all.length} races: 560 Pure and 570 Combat.** The frozen primary workload is 500 per format; a separately declared, data-informed rear-row sign follow-up adds 60 Pure/70 Combat. All ${all.length} ended, all ${total('finishes')} entries finished, and there were no integrity errors, stalls, bounded terminations, tool failures, DNFs or DNS outcomes. No gameplay coefficient, AI weight, formula or browser-runtime source changed.

Primary coverage: ${a.replications.uniqueConfigurations} configuration IDs, ${a.replications.uniqueSeededConfigurations} unique seeded configurations, and ${a.replications.duplicateExecutions} deliberate repeat control executions with identical checksums/events. The repeats are reproducibility checks, not independent samples. There are 104 distinct numerical seeds across the combined design, reused for matched conditions.

[Methodology](PHASE2_EVALUATION_PLAN.md) · [Baseline](PHASE2_BASELINE_MANIFEST.md) · [Supplement plan](SUPPLEMENT_REAR_ROW_PLAN.md) · [Recommendations](PHASE2_FINDINGS_AND_RECOMMENDATIONS.md) · [Instrumentation](PHASE2_TEST_AND_INSTRUMENTATION_REPORT.md)

## Workload and inference

${table(['Panel','Pure races','Combat races','Controls'],[['A: defaults','100','100','20 seeds × five weather presets'],['B: archetypes','100','100','20 rotations; equal beast budgets and grid exposure'],['C: personalities','100','100','Identical components; equal tendency sums'],['S: sensitivity','40','40','Five attributes; four matched control/+10 conditions each'],['D: primary signs','140','140','20 control blocks; Pure also includes lifecycle workflows'],['E: surfaces','20','20','Ten matched neutral/composite pairs'],['Rear-row supplement','60','70','Ten control blocks; player RU5'],['Total','560','570','Primary and supplemental panels remain separate']])}

Confidence intervals below are empirical 95% seed-cluster bootstrap intervals, conditional on this selected workload. Dispersion/percentiles describe observed cases, not independent sampling units. Fixed weather composition is retained in cluster resampling, so a narrow mean interval can coexist with a large across-weather SD. Nonfinish times are null; none occur here. Sensitivity has only four pairs and is explicitly exploratory. Multiple comparisons are not corrected into confirmatory significance claims.

![Evaluation summary](figures/phase2-summary.svg)

[PNG figure](figures/phase2-summary.png) and [full statistical JSON](data/analysis.json) support inspection/reanalysis.

## A — baseline behavior

${table(['Metric','Pure mean [95% CI]','Pure median / SD / p10–p90','Combat mean [95% CI]','Combat median / SD / p10–p90'],['duration','winnerGap','overtakes','damage','fatigueAtFinish'].map(k=>{const p=a.baseline.Pure[k],c=a.baseline.Combat[k];return[k,n(p.mean)+' '+ci(p),n(p.median)+' / '+n(p.sd)+' / '+n(p.p10)+'–'+n(p.p90),n(c.mean)+' '+ci(c),n(c.median)+' / '+n(c.sd)+' / '+n(c.p10)+'–'+n(c.p90)];}))}

Duration includes post-finish clearance; official times and gaps retain full precision. Damage is summed component-condition loss, not calibrated injury severity. There were ${a.baseline.Pure.incidents}/${a.baseline.Combat.incidents} incidents across the respective 100-race baseline panels. Exact complete finish order/times and ties are exported per race. No natural official ties were observed across either primary panel; separate retained regression tests exercise ties.

Baseline lane attempts/successes were ${a.baseline.Pure.laneAttempts}/${a.baseline.Pure.laneSuccesses} Pure and ${a.baseline.Combat.laneAttempts}/${a.baseline.Combat.laneSuccesses} Combat. Sampled mean competitive speed averaged ${n(a.baseline.Pure.entryMetrics.sampledAverageSpeed.mean)} / ${n(a.baseline.Combat.entryMetrics.sampledAverageSpeed.mean)} m/s per entry; mean observed maxima were ${n(a.baseline.Pure.entryMetrics.maxObservedSpeed.mean)} / ${n(a.baseline.Combat.entryMetrics.maxObservedSpeed.mean)} m/s. These endpoint/corner observations do not establish exact continuous peak or path-integrated speed.

${table(['Issued pace preference','Pure mean time share','Combat mean time share'],['Conserve','Maintain','Push','Sprint'].map(p=>[p,percent(a.baseline.Pure.entryMetrics.paceShares[p].mean),percent(a.baseline.Combat.entryMetrics.paceShares[p].mean)]))}

Forward-blocked time averaged ${n(a.baseline.Pure.meanBlockedSecondsPerEntry,3)} / ${n(a.baseline.Combat.meanBlockedSecondsPerEntry,3)} seconds per entry. Repeated occupancy checks total ${a.baseline.Pure.repeatedBlockedAttempts}/${a.baseline.Combat.repeatedBlockedAttempts}; these are not automatically repeated impossible steering decisions. The outlier C-Combat-0-17-mixed-personalities / RU5 has 98 rechecks over 4.94 blocked seconds, yet all four lateral attempts succeeded and it finished. Rapid lane reversals are at most four per RU in the primary data. Passing/returning can legitimately reverse direction, so counts alone do not prove an AI loop. Default races average about 50 overtakes, contradicting a blanket persistent-procession diagnosis.

## B — RU archetype effectiveness

Each type receives 300 points per beast; other components and personality are equal. Each has 160 entry observations per format, clustered over 20 seeds, with equal grid-slot exposure. In this panel Pure and Combat physical results are identical because neutral personalities select no offensive actions.

${table(['Archetype','Race wins / 100','Entry win rate [95% CI]','Mean finished position','Mean finish fatigue','Mean damage taken'],a.archetypes.Pure.map(r=>[r.name,String(Math.round(r.winRate.mean*r.n)),percent(r.winRate.mean)+' '+r.winRate.ci95.map(percent).join('–'),n(r.finishPosition.mean),n(r.fatigue.mean),n(r.damage.mean)]))}

Speed wins 74/100 races; Endurance wins 19, Handling 5, Power 2 and Balanced 0. This is strong conditional leverage under flat beast-point budgets, not proof of a universally best build or an approved cost model. Endurance wins 9/20 races in both Heavy Rain/Mud and Extreme Heat, versus Speed's 11/20 in each; the weather interaction provides a real competing niche. Power and Handling remain weak in this reference geometry/field. All chariots/equipment/team sizes are held fixed, so this is not a study of heavy chariots, weapon equipment or mixed team sizes.

${table(['Weather','Speed race wins /20','Endurance race wins /20','Handling race wins /20','Power race wins /20'],Object.keys(a.weather.Pure).map(w=>{const by=t=>Math.round(a.archetypes.Pure.find(r=>r.name===t).byWeather[w].winRate*32);return[w,by('speed'),by('endurance'),by('handling'),by('power')];}))}

### Individual sensitivity

+10 is applied to both beasts for beast attributes (+20 raw points), or to one driver's Driving (+10 raw points). These are marginal ceteris-paribus tests, not equal-cost cross-component purchases. The player is the same front-row RU1 in all pairs, creating a position ceiling; official time is the informative endpoint. Pure and Combat numerical effects are identical in this balanced field.

${table(['Attribute','Pairs / format','Mean time change (s)','95% paired CI','Mean position change'],a.sensitivity.Pure.map(r=>{const m=r.comparison.metrics;return[r.attribute,r.comparison.pairs,n(m.time.mean),ci(m.time),n(m.position.mean)];}))}

All five increments improve mean official time in these four selected conditions; none is shown inert or unexpectedly negative. Speed's ${n(a.sensitivity.Pure.find(r=>r.attribute==='beasts.speed').comparison.metrics.time.mean)} s effect exceeds the other tested beast increments. This small panel does not establish precise relative pricing or global monotonicity.

## C — personality and behavior

Profiles share driver skills/components/equipment and a 300-point tendency budget. Names denote six-dimensional profiles, not isolated single-tendency treatments. In particular the disciplined profile's wins cannot be attributed to Tactical Discipline alone when no signs are issued.

${table(['Profile','Pure win rate / entry','Combat win rate / entry','Conserve share (Pure)','Push share','Sprint share','Combat attacks / entry','Combat defensive selections / entry'],a.personalities.Pure.map(r=>{const c=a.personalities.Combat.find(x=>x.name===r.name);return[r.name,percent(r.winRate.mean),percent(c.winRate.mean),percent(r.paceShares.Conserve.mean),percent(r.paceShares.Push.mean),percent(r.paceShares.Sprint.mean),n(c.attacks.mean),n(c.defensiveDecisions.mean)];}))}

Aggressive profiles favor Push; opportunistic profiles uniquely sustain substantial Sprint time; cautious profiles conserve more and select defensive combat. Disciplined profiles predominantly Maintain and win 45/100 Pure and 43/100 Combat races. This is meaningful behavioral differentiation, not a guarantee that all profiles are competitively balanced. No casualties/control loss were observed to measure a safety payoff for cautious behavior.

## D — Strategy Signs

### Primary front-row panel

All 20 no-sign player RU1 controls per format finish first (${Math.min(...controls('Pure'))}–${Math.max(...controls('Pure'))}). Rank cannot improve from that ceiling. Each single-sign arm uses one queue/activation. Fatigue changes below are percentage-point changes in individual-beast fatigue averaged for that RU.

${table(['Sign','Format / pairs','Full compliance among applicable','Inapplicable decisions','Δ time (s) [95% CI]','Δ fatigue','Δ place'],[...a.signs.Pure.filter(r=>!r.arm.startsWith('lifecycle')),a.signs.Combat.find(r=>r.arm==='Engage Rivals')].map(r=>{const m=r.comparison.metrics;return[r.arm,(r.arm==='Engage Rivals'?'Combat':'Pure; same means in Combat')+' / '+r.n,percent(r.fullComplianceRate),percent(r.inapplicableRate),n(m.time.mean)+' '+ci(m.time),n(m.fatigue.mean),n(m.position.mean)];}))}

Conserve/Defensive instructions are followed but sacrifice time/position for fatigue reduction. Seek Open Track produces no changed race time, fatigue or place here; it is mostly overridden rather than followed. Engage is inapplicable for ${percent(a.signs.Combat.find(r=>r.arm==='Engage Rivals').inapplicableRate)} of decisions, but where applicable is usually followed. It adds ${n(a.signs.Combat.find(r=>r.arm==='Engage Rivals').comparison.metrics.attacks.mean)} attack contests and ${n(a.signs.Combat.find(r=>r.arm==='Engage Rivals').comparison.metrics.combatDamageDealt.mean)} condition points of damage dealt to other RUs without improving an already-first finishing position. That is context-limited opportunity, not proof the sign lacks a mechanical effect.

The Pure replacement/cancel lifecycle variants each have ten runs, consume all three permitted uses, activate the replacement at the next common-line crossing, and lower Active after lap one. Their mean place/time changes are ${n(a.signs.Pure.find(r=>r.arm==='lifecycle-replace').comparison.metrics.position.mean)} places / ${n(a.signs.Pure.find(r=>r.arm==='lifecycle-replace').comparison.metrics.time.mean)} s and ${n(a.signs.Pure.find(r=>r.arm==='lifecycle-cancel').comparison.metrics.position.mean)} places / ${n(a.signs.Pure.find(r=>r.arm==='lifecycle-cancel').comparison.metrics.time.mean)} s. Canceled/replaced uses are not refunded. No independent sign-expiration event exists; outstanding signs at termination are recorded, and competitive lifetime ends at finish/retirement.

### Separately declared rear-row follow-up

Player RU5 controls average position ${n(s.control.Pure.position.mean)}, range ${s.control.Pure.position.min}–${s.control.Pure.position.max}. Each sign has ten matched controls. This data-informed follow-up is not pooled into the primary estimates.

${table(['Sign','Format / pairs','Full compliance','Inapplicable','Δ place [95% CI]','Δ time (s) [95% CI]','Δ fatigue'],[...s.signs.Pure,s.signs.Combat.find(r=>r.arm==='Engage Rivals')].map(r=>{const m=r.comparison.metrics;return[r.arm,(r.arm==='Engage Rivals'?'Combat':'Pure; same means in Combat')+' / '+r.n,percent(r.fullComplianceRate),percent(r.inapplicableRate),n(m.position.mean)+' '+ci(m.position),n(m.time.mean)+' '+ci(m.time),n(m.fatigue.mean)];}))}

Hold Position beats Push in these rear-row cases by a paired ${n(s.holdVersusPush.Pure.metrics.position.mean)} places and ${n(s.holdVersusPush.Pure.metrics.time.mean)} s, with ${n(s.holdVersusPush.Pure.metrics.fatigue.mean)} less fatigue. Its Maintain bias and fewer lane changes are plausible mechanisms, not a hidden physical-stat bonus. This is an owner-review balance/semantics candidate, not authorization to weaken Hold or strengthen Push.

Seek Open Track is rarely classified fully followed, but changes lane behavior and yields a small mean rear-row benefit. Rarely followed does not necessarily mean no effect. Rear-row Engage adds ${n(s.signs.Combat.find(r=>r.arm==='Engage Rivals').comparison.metrics.attacks.mean)} attacks, ${n(s.signs.Combat.find(r=>r.arm==='Engage Rivals').comparison.metrics.combatDamageDealt.mean)} inflicted condition points, and improves mean place by ${n(s.signs.Combat.find(r=>r.arm==='Engage Rivals').comparison.metrics.position.mean)}. It remains often inapplicable; opportunity should be considered before a blanket strength adjustment.

## E — combat and environment

Across the primary 500 Combat races: ${Math.round(a.overall.Combat.attacks.mean*500)} valid attack contests, ${a.overall.Combat.successfulAttacks} successful attacks, ${a.overall.Combat.reactions} defensive reactions and ${a.overall.Combat.successfulDefenses} successful reactive defenses. With the supplement there are ${total('attacks')} valid contests, **zero rams**, and zero offensive actions in Pure. Zero rams is a specific coverage/AI-selection concern discussed in the recommendations; it does not show the physical ram resolver is absent.

Matched A Combat-minus-Pure differences (100 weather/seed pairs, 20 seed clusters):

${table(['Metric','Mean paired change','95% seed-cluster CI','SD of paired differences'],Object.entries(a.formatContrast.metrics).map(([k,m])=>[k,n(m.mean),ci(m),n(m.sd)]))}

Combat increases damage but has a small, uncertain average race-duration effect in this field; the duration interval spans zero. Damage/attack associations do not prove a desired injury rate. All ${all.length} races have zero DNFs/wrecks/control-loss emissions. The A panels each contain only 20 independent seed clusters; zero seeds with a retirement across five weather contexts has a Wilson upper bound of ${percent(a.baseline.Pure.retirementSeedContext.wilsonCI95[1])}. That bound describes the selected five-context seed event, not per-entry retirement probability. Do not apply an IID rule-of-three to 9,040 correlated entries or claim lethality is universally zero. Secondary wreck interactions cannot be evaluated statistically from this workload and remain covered only by retained deterministic regressions.

${table(['Weather','Pure duration mean (s)','Combat duration mean (s)','Pure fatigue at finish','Combat fatigue at finish'],Object.keys(a.weather.Pure).map(w=>[w,n(a.weather.Pure[w].summary.duration.mean),n(a.weather.Combat[w].summary.duration.mean),n(a.weather.Pure[w].summary.fatigueAtFinish.mean),n(a.weather.Combat[w].summary.fatigueAtFinish.mean)]))}

Heavy Rain/Mud increases duration materially; Heat raises fatigue despite less duration than Mud. Endurance's relative win share rises in both, consistent with the model. In E, degraded composite surfaces change mean duration by ${n(a.surface.Pure.metrics.duration.mean)} s ${ci(a.surface.Pure.metrics.duration)} and mean finish fatigue by ${n(a.surface.Pure.metrics.fatigue.mean)} ${ci(a.surface.Pure.metrics.fatigue)} across ten matched pairs. The same mean effects occur in Combat's neutral-personality field. These are effects of the declared composite, not separate causal estimates for grip, roughness, rolling resistance or hazard weighting.

## Interpretation and limitations

- Observations: all completed, explicit overtake/action/damage counts, exact outcomes and broad behavioral differences.
- Controlled conditional effects: matched sign, format, weather, surface and +10 sensitivity differences under the saved inputs; not universal design guarantees.
- Associations: a composite named personality or flat-budget build's win rate does not isolate a single skill/tendency or establish economic pricing.
- Hypotheses: Hold's Maintain bias, ram utility dominance and Speed's long-run leverage need owner-reviewed follow-up; no coefficient was changed here.
- Coverage: one reference oval/three laps, two-beast healthy teams, fixed chariots/equipment, five weather presets, one surface composite, four sensitivity conditions and ten rear-row pairs. No exhaustive factorial, wounded entrants, heavy ram specialist, long-run economy, persistent fatigue economy or final balance target is tested.
- Measurement limits: maximum/average speed and lane occupancy are sampled; tactical/strategic labels are timing proxies; control counts are structured emissions; complete no-damage impact energy is unavailable. Exact issued pace durations and finish fatigue use authoritative event times/snapshots. Metrics and definitions are in the methodology/data dictionary.

**No confirmed implementation defect requiring a corrective pass was established by this study.** That is not proof of universal correctness. Recommendations are proposals only; no tuning or publication follows from these results.
`;
await writeFile(root+'PHASE2_SIMULATION_ANALYSIS.md',text);
console.log('Baseline manifest and analysis report generated from saved datasets.');
