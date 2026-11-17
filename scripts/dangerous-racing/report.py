import json,gzip,collections,pathlib
R=pathlib.Path('docs/phase2/dangerous-racing'); A=json.loads((R/'analysis.json').read_text()); N=json.loads((R/'niche-analysis.json').read_text()); M=json.loads((R/'baseline/manifest.json').read_text())
def f(x):return '—' if x is None else f'{x:.2f}'
def ci(v):return f(v['mean'])+' ['+', '.join(map(f,v['ci95']))+']' if v['ci95'] else f(v['mean'])
def table(headers,rows):return '| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(map(str,row))+' |' for row in rows)+'\n'
def save(name,s):(R/name).write_text(s)
C=A['cohorts']
# Derive retirement provenance from authoritative damage/event links, not final mutable condition.
rows=[json.loads(l) for l in gzip.open(R/'data/races.jsonl.gz','rt')];by=collections.defaultdict(list)
for l in gzip.open(R/'data/events.jsonl.gz','rt'):
 e=json.loads(l);by[e['raceId']].append(e)
provenance={}
for cohort in C:
 rr=[r for r in rows if r['experiment']==cohort and r['format']=='Combat'];kind=collections.Counter();comp=collections.Counter()
 for r in rr:
  for u in r['ru']:
   rt=u['retirement']
   if not rt:continue
   d=[e for e in by[r['id']] if e['type']=='DAMAGE' and e['participants']==[u['id']] and e['time']<=rt['time']]
   exact=[e for e in d if e['effects']['contactId'] in (rt['cause'] or '').split(',')];hit=(exact or d)[-1];kind[hit['effects']['kind']]+=1;comp[hit['effects']['component']]+=1
 provenance[cohort]={'retirementLastDamageKind':dict(kind),'retirementLastComponentHit':dict(comp),'oocEntryObservations':sum(any(x['control']=='Out of Control' for x in v['controls']) for r in rr for v in r['danger']['perRU'].values())}
stops=[json.loads(l) for l in gzip.open(R/'competitive-stop-condition.jsonl.gz','rt')]
for cohort in C:
 ids={r['id'] for r in rows if r['experiment']==cohort and r['format']=='Combat'};triggers=collections.Counter()
 for stop in stops:
  if stop['raceId'] not in ids or stop['status']!='Retired':continue
  q=stop['condition'];trigger='driver<=5' if q['driver']<=5 else 'chariot<=5' if q['chariot']<=5 else 'team<=10' if all(v<=10 for k,v in q.items() if k.startswith('beast:')) else 'instability-only'
  triggers[trigger]+=1
 provenance[cohort]['conditionDisableTriggers']=dict(triggers)
(R/'evidence/retirement-provenance.json').write_text(json.dumps(provenance,indent=2))
cohortTable=table(['Combat cohort','Races / seed blocks','Finished / entries','Damage retirements / races with one','New serious-damage entries / races','OOC emissions / entries affected','Wreck events / secondary impacts'],[[k,f"200 / 40",f"{v['combat']['finishes']} / 1600",f"{v['combat']['naturalRetirements']} / {v['combat']['naturalRetirementRaces']}",f"{v['combat']['newSeriousEntries']} / {v['combat']['newSeriousRaces']}",f"{v['combat']['oocEvents']} / {provenance[k]['oocEntryObservations']}",f"{v['combat']['wreckEvents']} / {v['combat']['wreckImpacts']}"] for k,v in C.items()])
metricTable=table(['Combat cohort','Race duration s, mean [95% CI]','Damage/race, mean [95% CI]','Overtakes/race, mean [95% CI]','Finish fatigue, mean [95% CI]'],[[k,ci(v['combat']['metrics']['duration']),ci(v['combat']['metrics']['damage']),ci(v['combat']['metrics']['overtakes']),ci(v['combat']['metrics']['fatigue'])] for k,v in C.items()])
aiTable=table(['Initial context','n','Attack / ram legal','First chosen positional actions','Executed ram contests during 5 s'],[[k,v['n'],f"{v['attackLegal']} / {v['ramLegal']}",str(v['firstChoices']),v['executedRams']] for k,v in A['ai'].items()])
physTable=table(['Physical context (32 seeds/arm)','Weapon hits / target damage','Ram hits / target damage','Ram self damage'],[[k,f"{v['attack']['hits']} / {f(v['attack']['targetDamage']['mean'])}",f"{v['ram']['hits']} / {f(v['ram']['targetDamage']['mean'])}",f(v['ram']['selfDamage']['mean'])] for k,v in A['physical'].items()])
nicheTable=table(['Diagnostic context','Weapon / ram rival DNFs (32 each)','Weapon / ram actor wins','Both-finished pairs','Ram−weapon finishing lead s [95% CI]'],[[k,f"{v['arms']['attack']['retiredB']} / {v['arms']['ram']['retiredB']}",f"{v['arms']['attack']['winsA']} / {v['arms']['ram']['winsA']}",v['ramMinusWeaponLead']['n'],ci(v['ramMinusWeaponLead'])] for k,v in N.items()])
save('COMBAT_AI_DECISION_ANALYSIS.md',f'''# Combat AI decision analysis

**Finding: selection lacks a context-sensitive ram niche; the resolver is available.** No weight or mechanic changed. See [raw AI probes](mechanisms/ai.json.gz), [physical probes](mechanisms/physical.json.gz), [cohort results](DANGEROUS_RACING_RESULTS.md) and [analysis JSON](analysis.json).

## Why weapon attacks dominate

At the default coefficients, with both candidates legal:

`U(attack) − U(ram) = 0.1 + 0.5 × Opportunism/100 + persistenceDifference + noiseDifference`.

Aggression (3×A/100) and Caution (−2×C/100) cancel. All current signs have equal direct influence on these two candidates: Engage adds the same bonus; the other five add neither. Noise difference is bounded within ±0.3. Goal persistence adds +1.2 to the currently persistent candidate: an attack goal makes dominance stronger; an existing ram goal can reverse it. Thus O>=40 cannot initiate ram through default bounded noise without an existing ram goal. For O=0 a narrow noise-driven initiation niche remains. High aggression also must make offense beat hold, avoidance, overtake and defense; low aggression/high opportunism alone does not guarantee combat.

Source: `src/ai/driver.js` add()/combat candidates/selection; `src/sim/consequences.js` consequenceDefaults and eligibleCombat(); `src/ai/signs.js` signPreference(). The algebra is conditional on the current default coefficient set and candidates, not a theorem about all developer-configurable values. Attack and ram may refer to different rivals: attack uses closest perceived rival, ram uses the first qualifying stable-ID rival. Their scores still have no target-specific benefit or cost.

Default ram requires adjacent lanes and |gap|<=0.75; weapon permits same/adjacent lanes and |gap|<=1.25. **Ram-only is impossible with these default rules.** Both share Racing/Live/format/control/cooldown constraints. AI perception filters candidates further, but cannot create a ram-only case from these ranges. No illegal range override was used to manufacture one.

## Controlled autonomous decisions

{aiTable}

Each row uses seeds 1..64, close moving starts and actual AI/physics for five seconds. `compromisedControl`, `existingRamGoal`, `existingAttackGoal` are explicitly forced-state probes, outside natural-race counts. All other initial attributes and geometry are valid configurations; neither AI action nor utility was forced. `valuablePosition` starts A ahead of B, a local position-cost probe, not proof of championship-value reasoning. All candidates/terms, first intended/effective/physical state, linked execution events, subsequent contests, damage, speeds and progress are in the raw file.

The ordinary aggressive profile chose attack in all 64 both-legal cases; changing only mass/protection or damaging the actor did not create a ram preference. High-A/zero-O selected ram in **13/64** first decisions; a genuine seeded reconstruction is `evidence/AI-highAggressionLowOpportunity-5.replay.json.gz`. An existing ram goal selected ram in 64/64, but that is persistence availability, not naturally emerging initiation. Compromised control blocked offense and led to hold while braking/recovering.

Across the 600 Combat cohort races there were **{sum(v['combat']['ramOpportunities'] for v in C.values()):,} decisions containing legal ram candidates and zero ram selections/contests**. These repeated opportunities are highly correlated, not independent Bernoulli trials. The 100 additional controlled-personality races are separate and also contain no ram contests. No frequency floor or random forced ram is warranted by these results.

## What AI knows and what it uses

Perceived rivals expose ID, lane, gap, speed, physical/status. Their mass, protection, condition, combat skill and likely retaliation cost are absent. The actor has full own RU/derived state, but ram/attack utility uses only A/O/C, signs, persistence and noise. Relative speed, momentum, opponent condition, self damage, possible disablement, racing place and expected loss of progress do not enter this pair of scores.

Fatigue influences pace/disengage; low condition influences derived performance/perception/contest strength; instability contributes stress/error and OOC prohibits offense. Driving affects execution failure. Awareness affects perception/judgment, Nerve stress. Those pathways affect whether an action happens, but do not compare expected weapon-versus-ram payoff. DefendCombat competes for the positional goal and sets the active-defense flag; disengage/avoid/overtake compete rather than being free additions. Goal persistence can lock a previously chosen combat preference for 30 ticks. A decision command may later be invalidated by range/cooldown/state changes; raw ATTACK/AI_EXECUTION_RESULT distinguishes intention from execution and contest success.

## Physical advantage versus selection deficiency

{physTable}

Damage means include misses (32 trials/arm), measured over five seconds; none of these short runs created a wreck. At equal skill only 4/32 contests succeeded. Ram consumes the same contested gate as a weapon attack and cannot bypass a strong defense. Strong attacker (Combat90/equipment60 vs Combat/Driving25) succeeds 32/32, but equal-speed ram deals ~1 condition point to each participant versus ~7 to the weapon target alone.

At closing20 (30 vs10 m/s; a deliberately fast diagnostic, not ordinary field speed), successful ram severity rises sharply. At 18 vs8 in the separate physical-niche follow-up, asymmetric protection/wear can yield greater rival delay at a self cost:

{nicheTable}

Finishing lead is rival time minus actor time; positive ram−weapon means ram creates a larger lead. Nonfinishers are excluded from that time comparison and listed in the DNF column. In the worn-rival niche, **15/28 both-finished seeds** favor ram's lead, mean +{f(N['wornRivalClosing']['ramMinusWeaponLead']['mean'])} s, but weapon retires the rival in 4/32 while ram does not; that censoring matters. The actor already wins all 32 either way. In healthy protected closing, 14/32 seeds favor ram's lead, but mean effect is negative and no extra wins appear. A documented favorable realized case is protectedClosing/seed32: ram improves lead by ~2.76 s versus weapon; its actual replay triplet is exported. This is a conditional realized advantage, not evidence that ram is the superior expected winning policy. The first 96 moving-start diagnostic races are preserved separately; their initial eight-seed equal-skill panels had no successful contests and cannot resolve superiority.

**Answers on superiority:** realistic relative speed/protection/wear can make ram useful for delaying a rival, but universal or ordinary-field superiority is unproven. Its recoil, 10% bilateral speed reduction, shared defense gate and lack of displacement often favor weapon attacks or simply racing. The current AI cannot identify the demonstrated niches because the relevant features are unused/unperceived. This is an action-selection limitation distinct from a missing or broken physical resolver. No general pure-mass bully advantage is present: reduced mass and half-energy shares are symmetric. More mass raises both parties' exposure; protection/durability/condition create the asymmetric survivability benefit.
''')
# Defense and surface tables.
defTable=table(['Combat cohort','Contests / hits','Reactions / defended while reacting','Same-state reaction threshold flips','No reaction','Actively defending contests'],[[k,f"{v['combat']['attackContests']} / {v['combat']['successfulContests']}",f"{v['combat']['reactions']} / {v['combat']['successfulReactiveDefenses']}",v['combat']['reactionFlips'],v['combat']['unreacted'],v['combat']['activelyDefending']] for k,v in C.items()])
weatherTable=table(['Cohort / weather','Races','Retired entries','OOC emissions','Incident / encounters','Mean race duration'],[[k+' / '+w,t['n'],t['naturalRetirements'],t['oocEvents'],f"{t['incidents']} / {t['incidentImpacts']}",f(t['metrics']['duration']['mean'])] for k,v in C.items() for w,t in v['weather'].items()])
exTable=table(['Imposed exposure','Starting chariot condition','Closing speed','Series','New actor wrecks','Target wrecks*','Series with OOC'],[[r['kind'],r['condition'],r['closing'],r['n'],r['newWreckA'],r['wreckB'],r['oocSeries']] for r in A['exposure'] if r['kind'] in ['weapon','ram','rear','side','wreck'] and r['condition'] in [100,15] and r['closing'] in [0,25]])
# Controlled defense totals are duplicated across personality labels; report exact groups and conditional fractions.
dfTable=table(['Defender skill','Protection','Imposed active defense','Groups (two profile labels)','Reactive first attack resisted / 64','Unreacted second attack hit / 64','Mean condition damage'],[[r['skill'],r['protection'],r['defending'],r['n'],r['firstReactionSuccess'],r['secondUnreactedSuccess'],f(r['damage']['mean'])] for r in A['defenses']])
save('DAMAGE_AND_SURVIVABILITY_ANALYSIS.md',f'''# Damage, defense and survivability

**Existing mechanics create failures in worn fields without changing lethality. Healthy competitors remain highly safe in this study.** Keep the three cohorts separate.

{cohortTable}

Serious damage means a new crossing from >25 to <=25 component condition during competition, an analysis threshold only. Initially <=25 equipment is separately marked and never counted as a new crossing until another component actually crosses. OOC counts are authoritative event emissions; affected entry observations are also shown. A retired RU becomes a permanent stationary wreck. These are race-local component conditions, not persistent injury systems.

## Damage and control mechanism

Weapon damage uses attackDamage 7 × (1+bounded margin/100), divided by per-component resistance/protection/grip. Exposure favors driver 3, beast team1, chariot1. A weapon hit has no physical-energy term and default attackSpeedRetention=1, but condition loss impairs performance. Ram passes the same contest, then queues side energy `0.5 × reducedMass × (closing² + ramSpeed 5²)`. Each participant receives half energy, side geometry .6, damageScale .003, and its own resistance. Ram applies bilateral speed retention .9; it does not displace the target to a different lane. Front incidental contacts have different geometry and can stop the initiator; side incidental contact has only sideSpeed1.5. Wreck impact uses actor mass but retains half-share for the two participants; anchored wrecks do not move. These are abstract calculations, not a calibrated momentum-exchange solver or real-world joules.

Weight changes acceleration/speed/mass and energy; Stability/Maneuverability/Driving affect handling/control; Durability/Protection/Toughness and chariot condition affect resistance; Combat/condition/equipment affect contests. Awareness/Nerve influence perception/errors/control stress, not a direct damage divisor. Individual beast damage impairs its effective contribution. Chariot wear/condition impair speed, handling, control and resilience. Driver damage impairs combat/perception/control. The one-at-a-time physical panel retains actual derived stats, full input RU, post-action q/speed and condition; see `mechanisms/physical.json.gz` and analysis.physical.

Instability gain = damage ×1 plus physical energy ×geometry×.0002×share; recovery is **5/s**. Weapon strikes generally contribute only their resisted condition loss, often a few points. Their normal 1.2s attacker cooldown allows 6 instability points of recovery before that same attacker can act again. Other attackers and short intervals can overwhelm it. Thresholds: Unstable >15, OOC >40, Disabled >=100; driver/chariot condition <=5 or every beast<=10 also disables. Losing a single beast does not itself meet the whole-team disable condition. Gradual condition loss can still retire a unit without ever reaching OOC.

In the cohort study all **87 damage retirements** link to weapon-attack causes, not incident or ram causes. Mixed final disabling hits targeted driver 4/chariot 1; high-risk driver 51/chariot 31. The exact competitive-stop condition snapshots confirm all 87 retirements crossed component disable thresholds: driver 55/chariot 32, with no whole-team or instability-only disablements. Earlier accumulated damage still matters. No safeguard created a retirement. Full per-event provenance is in `evidence/retirement-provenance.json`; replay gives the exact damage/control sequence.

## Defensive effectiveness

The earlier Phase 2 primary workload recorded 2381 reactions and 2063 reactive defenses. These are retained historical counts, not pooled with this different workload.

{defTable}

For healthy contests, **413/838** switch from defended to successful when subtracting only the actual reactive bonus from the same logged defense score. Baseline success is 103/838; the arithmetic no-reaction threshold success would be 516/838. This is strong evidence the reaction bonus suppresses ordinary immediate hits. It is **not** a rerun with defense removed and does not estimate resulting race damage, deaths or causal full-race outcomes: component draws/state/next actions would change. The remaining failed contests may still be stopped by passive skill/control defense. No invented component-level damage-prevented amount is reported.

Reaction budget 1 refreshes per tick, not per 1.2s cooldown; isolated attacks usually receive a response. In healthy fields all 838 attacks received one; mixed 206 and high-risk 417 did not. Main logs do not uniquely distinguish exhaustion from OOC at every subevent. Controlled simultaneous tests isolate budget exhaustion:

{dfTable}

There are 768 groups / 1536 contests; profile labels duplicate physical resolver inputs, leaving 384 distinct seeded configurations. Two attackers target C in one tick: first eligible consumes its single reaction, second receives none, with initiative deterministic. Active defending=true is an imposed diagnostic state; false is the reference state. At fixed skill/equipment/state the two personality labels give identical resolver outputs, so caution affects decision/pace/positioning, not a free reactive stat buff. High skill improves passive defense; protection mitigates damage after successful hits, not the contest score. DefendCombat adds 12 only when an eligible reaction is actually available, and occupies the AI's positional action instead of attack/overtake. No stamina/reaction-resource cost beyond that budget is implemented; a persistent reaction bonus should not be described as expensive without evidence.

## Repeated exposure and downstream availability

{exTable}

*For wreck exposure the target is a deliberately retired initial obstacle, not a newly caused casualty. Thirty imposed exposures at 1.25s spacing use unchanged coefficients; condition and relative speed are explicit. Reference positions/speeds/contact identity are imposed between exposures to isolate resolution; these are **not races**. Weapon closing-speed labels duplicate the same weapon mechanics: weapon has no relative-speed damage term. Repeated contacts use intentional new-impact identity and recoverControl; they do not show a stationary contact damage bug. `mechanisms/imposed-exposure.json.gz` exports all 720 series, including intermediate 40-condition and 10-closing settings. Driver/chariot disablement, OOC, persistent wrecks and secondary damage are achievable without boosted damage constants. Their counts are not ordinary risk estimates.

Existing deterministic regressions additionally cover reaction exhaustion/invalidation, corner crash, chain bounds, duplicate stationary contacts, full blockage, finish-before-impact ordering and anchored wrecks. This investigation does not alter those tests or claim a broad natural chain-casualty distribution from the 12 observed cohort wreck-impact events.

## Environment and traffic

{weatherTable}

Weather comparisons share40 seed blocks and the same rosters/strata. Mud has lower grip and more resistance to motion; grip also appears in the damage denominator, so successful hits can be more damaging even when speed falls. The high-risk cohort has **zero corner-overspeed loss events** despite 20 OOC emissions: its low performance reduces corner speed; danger is principally weapon accumulation against worn entrants. Healthy has 11 corner-loss emissions but no OOC/retirement. More dangerous weather therefore does not monotonically imply more corner crashes. Heat chiefly changes fatigue/recovery; Dust visibility changes exposure and decisions.

Neutral/degraded and standard/spread-row summaries are in analysis.json. Their four strata are balanced but tied to seed indices; they are descriptive associations, not isolated randomized surface/traffic effects. Degraded is a composite of grip/roughness/rolling, not an independent hazard-frequency intervention (hazardModifier remains1). Default incidentRate .002 is never raised. Across all 600 Combat cohort races only 12 incident impacts occur, versus 11524 weapon contests; rare hazard casualties cannot be estimated precisely. Matched Pure controls have zero retirements/OOC and no incident impacts in their selected 120 runs. No claim is made that Pure Racing is incapable of damage.

## What survivability means for Dangerous Racing

Most entrants finish in every cohort: healthy 100%, mixed 99.6875%, high-risk 94.875%. Ordinary healthy retirement risk is not established as zero; no events across 40 five-weather seed blocks gives a one-sided95% upper bound **7.22% for any retirement in that selected five-race seed block**, not a per-RU or per-race bound. Mixed has 5/200 races with a retirement; high-risk 67/200. No approved target percentage follows.

Existing mechanics support increased exposure from accumulated damage, poor equipment, skill and conditions. Ordinary healthy serious risk remains unobserved, while worn-field failures are credible and naturally emerging. Sparse ram selection removes one important physical-energy route. Defensive strength, low weapon shock relative to5/s recovery, protection/resistance and lack of AI contact-payoff reasoning explain survivability more precisely than saying the wreck system is broken. Do not globally increase lethality before deciding whether healthy ordinary risk needs to change.
''')
personaTable=table(['Aggressive − cautious (50 matched race pairs;10 seeds)','Mean [95% seed-cluster CI]'],[[k,ci(v)] for k,v in A['personalities']['aggressiveMinusCautious'].items()])
rareTable=table(['Cohort','Seeds with >=1 damage retirement /40','95% Wilson interval for that seed-block event','Zero-event one-sided upper bound'],[[k,f"{v['combat']['naturalRetirementSeedIncidence']['k']} / 40",str([round(x,4) for x in v['combat']['naturalRetirementSeedIncidence']['wilson95']]),f(v['combat']['naturalRetirementSeedIncidence']['oneSidedZeroUpper'])] for k,v in C.items()])
pairTable=table(['Combat−Pure:40 race pairs/cohort, 8 seed blocks','Damage/race [95% CI]','Finish-fraction delta [95% CI]','Both-finished time s [95% CI]','Entry pairs / Pure-only finishers'],[[k,ci(v['combatMinusPure']['metrics']['damage']),ci(v['combatMinusPure']['metrics']['finishFraction']),ci(v['matchedFinisherTime']['pairedRaceMean']),f"{v['matchedFinisherTime']['entryPairs']} / {v['matchedFinisherTime']['pureOnlyFinish']}"] for k,v in C.items()])
strataTable=table(['Cohort / stratum (100 races each)','Damage retirements','OOC emissions','Mean condition damage/race','Mean duration s'],[[k+' / '+name,t['naturalRetirements'],t['oocEvents'],f(t['metrics']['damage']['mean']),f(t['metrics']['duration']['mean'])] for k,v in C.items() for group in ['surface','traffic'] for name,t in v[group].items()])
save('DANGEROUS_RACING_RESULTS.md',f'''# Dangerous Racing: complete-race results

**Completed the planned 600 Combat cohort races, 120 matched Pure controls, and a separate 100 Combat personality races.** Cohort study 717 Ended/3 Stalled; personality 100 Ended. No integrity errors, tool errors, cancellations or tick-bound exceedances. Fifteen pilots and480 moving-start commanded diagnostic races (96 initial +384 niche follow-up) are excluded from these 820 study executions. Diagnostic command scenarios are not ordinary autonomous casualty evidence.

{cohortTable}

No approved casualty/attack target was imposed. Full actual seeds/configurations/rosters, JSONL/events, CSV and terminal checksums are under [data](data/); the matched personality study is under [personality-control](personality-control/). Each cohort has 200 races but only 40 independent numerical seed blocks, shared across weather/cohorts; Pure controls use 8 blocks. Slots rotate evenly. Do not pool the three cohorts into a representative casualty estimate or assume all equipment/weather/skill combinations were tested.

## Cohort performance and uncertainty

{metricTable}

The standalone [figure](figures/dangerous-racing-summary.png) summarizes these conditional results. Descriptive medians, SD, p10/p90/p95 and seed-cluster bootstrap 95% intervals are exported in `analysis.json` for each race metric and subgroup. Duration includes clearance and safeguard waiting; official entrant times remain full precision. Fatigue is historical finish snapshot, survivor-conditional when retirements occur. Condition damage sums component points, not a calibrated injury-severity score.

{rareTable}

Intervals describe any retirement across a seed's five weather races, not per-race or per-entry probability. The zero-event healthy bootstrap interval [0,0] is empirically degenerate and must not be read as certainty. The exact one-sided zero-event bound is 7.22% for that selected five-weather seed block; Wilson's two-sided upper bound is 8.76%. Cohort entry completion proportions are descriptive 100%,99.6875%,94.875%; correlated entries do not receive IID binomial intervals. Estimates are conditional on chosen legal configurations, one oval and default three laps.

## Matched format controls

{pairTable}

All 120 Pure controls finish, with no OOC or wrecks. Common-finisher time pairs are explicitly matched by RU identity within each seed/weather case, then averaged per race pair before seed-cluster resampling. Combat-only finishers are 0 in every cohort. Pure-only finishers remain outcome changes, never assigned time 0 or a timeout finish. `combatMinusPure.metrics.finishMean` in raw analysis also exports a difference of surviving-field mean times, labeled survivor-conditional; use `matchedFinisherTime` for the explicit same-entrant contrast above. No claim that all 200 Combat races have a Pure counterpart is made.

## Personality, skill and risk

{personaTable}

This panel uses four aggressive/four cautious drivers, identical 50-attribute components and default equipment; the paired arm swaps every identity's profile. It controls slot/equipment while also changing opponents' profiles, so it estimates that symmetric assignment, not an isolated one-driver causal effect. Aggressive drivers attack more, spend ~46.65 extra seconds in Push, finish ~7.87s faster/~2.75 places better and accumulate ~10.90 more fatigue. They receive fewer attacks/reactions and slightly less damage, plausibly because they escape traffic; aggression is not automatically higher casualty risk. All 800 entries finish, so no robust aggressive-versus-cautious retirement comparison is available. The mixed cohort's profile/equipment pairing is confounded and is not used for an isolated personality claim.

The separate 768 simultaneous-defense groups hold tactical state/skills/equipment constant. Profile labels alone do not change the reactive resolver; Driving/Combat/Control skill and active defending do. The five-second one-attribute panel also records direct skill/resistance dependencies. No skill/attribute formula was changed and no universal build budget is implied. Phase2 F02 Speed dominance and F03 Hold/Push interactions remain historical hypotheses; this investigation supplies equipment/contact context but does not rebalance either.

## Surface/traffic and environmental risk

{strataTable}

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
''')
save('DANGEROUS_RACING_RECOMMENDATIONS.md','''# Dangerous Racing recommendations

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
''')
