from pathlib import Path
import json, hashlib, subprocess, csv, shutil
root=Path('/workspace/BNT'); out=Path('/workspace/deliverables/bnt-m6'); ev=out/'evidence'; reports=out/'reports'
def load(n,default=None):
 try:return json.loads((ev/n).read_text())
 except:return default
def write(n,s):(reports/('BNT_M6_'+n+'.md')).write_text(s+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip();branch=subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip()
artifact=root/'dist/Blood-and-Thunder-M6-Playable.html'; digest=sha(artifact); size=artifact.stat().st_size;shutil.copy2(artifact,out/artifact.name)
exits={p.stem:int(p.read_text().strip()) for p in ev.glob('*.exit') if p.read_text().strip().lstrip('-').isdigit()}
ledger=[]
commands={'node-final':'npm test','node-frozen':'npm test','m6-protected-final':'node --test tests/m6-*.test.js','sundaran-registration':'node scripts/m6/sundaran-registration.mjs','frozen-targeted':'node --test tests/m6-*.test.js tests/e5-d-m3-ui.test.js tests/e5-d-m3-ui-p1.test.js','smoke-packaged-frozen':'node scripts/m6/smoke-browser.mjs','clock-m6':'node scripts/m6/clock-parity.mjs','retention-idb':'node scripts/m6/retention-idb.mjs','organic-prestige':'node scripts/m6/organic-prestige.mjs','prestige-retry':'node scripts/m6/prestige-retry.mjs','m6-current-final':'node --test tests/m6-*.test.js','references-frozen':'node scripts/m6/references.mjs','clock-final':'node scripts/m6/clock-parity.mjs','worker-faults-final':'node scripts/m6/worker-faults.mjs','idb-final':'node scripts/m6/idb-proof.mjs','real-quota':'node scripts/m6/real-quota.mjs','smoke-final':'node scripts/m6/smoke-browser.mjs','den-browser-final':'node scripts/m6/den-browser.mjs','file-browser':'node scripts/m6/file-browser.mjs','repeated-native-final':'node scripts/m6/repeated-native.mjs','largest-native-final':'node scripts/m6/largest-native.mjs','matched-balance':'node scripts/m6/matched-balance.mjs','capacity-current':'node scripts/m6/capacity-current.mjs','starter-boundaries':'node scripts/m6/starter-boundaries.mjs','accepted-regressions':'node scripts/m6/accepted-regressions.mjs','controlled-performance':'node scripts/m6/controlled-performance.mjs','build-repro-1':'node scripts/m6/build.mjs','build-repro-2':'node scripts/m6/build.mjs','build-byte-identity':'cmp /tmp/BNT-M6-build-1.html dist/Blood-and-Thunder-M6-Playable.html'}
for name,cmd in commands.items():ledger.append({'evidence':name,'command':cmd,'exit':exits.get(name),'status':'RUNNING / NOT RECORDED' if name not in exits else 'PASS' if exits[name]==0 else 'BLOCKED' if name=='file-browser' else 'NONZERO — inspect log'})
(ev/'command-ledger.json').write_text(json.dumps(ledger,indent=2));table='| Command | Raw exit |\n|---|---|\n'+'\n'.join('| `'+r['command']+'` | '+str(r['exit'] if r['exit'] is not None else 'not yet recorded')+' |' for r in ledger)
files=subprocess.check_output(['git','ls-files','-co','--exclude-standard','--','src','scripts','tests','content','package.json','package-lock.json'],cwd=root,text=True).splitlines();files=sorted(set(p for p in files if '__pycache__' not in p and (root/p).is_file()))
manifest={'kind':'BNT-M6-source-manifest','version':1,'baseCommit':head,'branch':branch,'implementationCommit':None,'note':'Uncommitted authorized working-tree candidate; hashes identify tested source. No commit, branch or push created.','artifact':{'path':str(artifact.relative_to(root)),'bytes':size,'sha256':digest},'files':[{'path':p,'bytes':(root/p).stat().st_size,'sha256':sha(root/p)} for p in files]};(reports/'BNT_M6_Source_Manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
status=subprocess.check_output(['git','status','--porcelain','--untracked-files=all'],cwd=root,text=True);(ev/'working-tree.txt').write_text(status)
changed=[line[3:] for line in status.splitlines() if line[3:].startswith(('src/','scripts/m6/','scripts/e5-d/m3-bc/practice-build.mjs','tests/m6-','content/m6/','docs/m6/')) and '__pycache__' not in line]
with (reports/'BNT_M6_Changed_Files.csv').open('w') as f:
 w=csv.writer(f);w.writerow(['path','sha256','bytes']);w.writerows((p,sha(root/p),(root/p).stat().st_size) for p in changed if (root/p).is_file())
for p in (root/'content/m6').iterdir():
 if p.is_file():shutil.copy2(p,out/'catalogs'/p.name)
write('Implementation_Report',f'''# Blood and Thunder M6 implementation candidate

Baseline `{head}` on `{branch}`. Implementation remains uncommitted as authorized. The accepted M5 D2 source manifest matched all 876 files before editing. M4, M5 D1 and M5 D2 artifacts are preserved and checked by the build. The source manifest identifies this working-tree candidate; HEAD alone does not.

Artifact: `{artifact.name}`, **{size:,} bytes**, SHA-256 `{digest}`.

## Delivered integration

1. Isolated schema8 current-state career family, native initialization producers, protected current financial totals, bounded acknowledgments and compact closed championship summaries. Embedded Worker preparation and revision/read-set checked IndexedDB publication retain existing authority boundaries.
2. Persistent Owner nationality, ancestry and Male/Female visual metadata; national first-entry progression, canonical World profiles, fixed rivals, current local boards, fixed Prestige challenges and Reputation-based market grades. Sundaran requires all seven ordinary Prestige victories through registration authority; no Bannerfall trophy is manufactured.
3. Versioned M6 next-tick Signs and one-charge Active Abilities, while legacy contexts keep their original behavior. Owned, isolated Practice uses the active Barn selection.
4. Participated own-team win wagers and a three-event AI-only Gambling Den. Actual native classifications settle wagers; final championship choice atomically publishes championship prizes, payroll, completion reward and participated wager payments.
5. Packaged management, World, named race presentation, eight race controls, market renewal, results, compact records and offline build.

## Authority and changed modules

`src/career/m6/` owns current-state domain validation, world, markets, rewards, bookmaker, gambling and Den. `src/persistence/m6/` owns the distinct envelope, synchronous Worker-local store and durable backend adapter. `src/sim/m6-interaction.js` defines explicit context-gated effects. Existing simulation modules contain narrow M6 branches; historical no-context references are unchanged. Management modules adapt the accepted UI rather than replacing its authority.

See `BNT_M6_Changed_Files.csv` for every changed/new implementation file and hash. Pre-existing evidence images, the M2-E readiness document and Python cache are listed separately in `evidence/working-tree.txt`; they were not implementation inputs or cleaned up.

## Discretionary decisions and limitations

The approved Sundaran clarification replaces the obsolete trophy prerequisite. An acceptance test found an unknown Iron Gauntlet renewable-strength key; the correction reuses the exact accepted M5 D2 `iron-gauntlet → thunder-crown` generator binding while preserving Iron Gauntlet economics. Cold validation now also binds each national rival pool to its authoritative first-entry tier, preventing an alternate strength key from becoming save authority. National venue naming is a versioned presentation amendment retaining original geometry, surfaces and economics. Unknown/ambiguous canonical population or capital facts remain explicit unknowns. Placeholders remain replaceable. Bounded bookmaker samples may use disclosed censored progress estimates; they are not an assertion of true win probabilities. Previous-root recovery never rolls back different financial/gameplay facts; a matching complete backup is required in that case.

Managed Chromium blocks direct-file navigation by administrator policy. Windows Chrome/Edge owner acceptance remains required. Native capacity fixtures and synthetic prior progress are distinguished in the test report. No M7, new artwork system, repeatable Sundaran endgame, commit, merge, push or deployment is included.

## Verification

The fresh full Node suite passed1394/1394, exit0; final M6 validation passed45/45, exit0. All14 historical/payroll references matched. The final packaged lifecycle passed and two builds were byte-identical. Windows direct-file testing remains owner work.

Read the regression report and raw evidence. A candidate is not owner-accepted merely because automated checks pass. Any missing command exit or unresolved gate remains explicitly incomplete.
''')
write('Persistence_Contract','''# M6 current-state persistence contract

## Serialized family

Mechanical career schema **8**, `m6.version=1`, with a separate envelope `{kind:"BNT-M6-current-save",version:1,base:{value:<schema8>,hash:<sha256 JSON value>},tail:[],currentHash:<same>,presentation:<validated presentation sidecar>}`. The hash is corruption detection; a caller-supplied digest is never sufficient authority. `validateM6` performs cold validation and all native graph/condition, financial, national, market, result and ownership checks. Handwritten source validators remain authoritative.

M6 contains immutable Owner identity and starting-package provenance; opening/credits/debits financial anchors; at most 64 recent acknowledgments; monotonic instance and closed-instance sequence; one compact summary per closed championship; significant milestones; current identities, driver visual sex metadata, market provenance, fixed national rivals, national progress and unresolved/aggregate gambling state. Active instances retain official results, D2 evidence, standings and reward state until settlement and completion selection. Closed state discards full individual race histories, obsolete sessions and expired offers only after native obligations and final effects are reconciled.

## Transaction boundary

Synchronous domain stores prepare in the embedded Worker. An IDB commit checks exact generation/read-set and activates one reference root atomically. A Worker response alone is not durable acknowledgment. Normal races run in memory, with no per-tick persistence. Native prepare replays the accepted input transcript and compares exact native state before durable preparation. Official publication requires the accepted D5 capability and one protected career commit. Final review does not pay; eligible final reward choice and all prizes/payroll/wagers publish together. Interrupted publication and lost acknowledgments are idempotent.

## Bounds and recovery

8 MiB logical records and256 MiB complete backup bounds are retained. Current and previous roots keep referenced bodies; GC removes unreachable bodies only. Restore is validated/staged and atomically activated. Old requests outside the bounded acknowledgment window fail absolute revision checks. No lifetime command replay is required.

Previous-root recovery is allowed only for the same gameplay witness with newer writer chronology. Different economic/gameplay facts fail closed instead of undoing committed purchases or rewards. Matching complete backup repair is available. Missing/corrupt records cannot become an empty new career. Existing M4/M5 careers and files are not migrated or silently imported into schema8; earlier HTML remains the reader for those saves.

## Compatibility

Owner sex is persistent visual metadata, validated and included in complete backup/restore, without influence on native attributes or random streams. Presentation sidecar-v2, immutable recruitment pack pin and radio preference remain separate from mechanical state. New saves do not reuse legacy storage namespaces. Unfinished M6 race closure restarts from frozen seed; unfinished ticks, Signs and ability inputs are intentionally not saved. Completed results and previously committed choices remain durable.
''')
write('Career_World_Report','''# Career and World integration

The source of national context is the unchanged Vaern eight-nation canon, compiled by `scripts/m6/compile-world.py`. The generated profile catalog and asset briefs are supplied individually. `national-venue-amendment-v1.json` records canonical naming bindings without altering source catalogs or native courses.

Owner fields are nationality N1–N8, ancestry A01–A13 and Male/Female visual metadata. Sundaran nationality chooses an ordinary starting nation. Native starting packages and initialization grants remain unchanged.

The two-event Dustroad introduction uses dirt short oval, three laps, clear weather. It is completed through legitimate participation, not a mandatory win. Subsequent boards have three locals until two local wins, then two locals plus the nation's fixed Prestige challenge. First home Prestige victory opens the other ordinary nations; all seven ordinary victories unlock Sundaran. First-entry tiers1,2,2,3,3,4,5 remain fixed. Reputation cannot bypass domain qualifications. Completed ordinary nations retain three repeatable locals with70% Gold/50% Reputation and no repeat completion LP; Run reward choices remain normal.

Four persistent rival organizations per nation supply two frozen rivals alongside generated locals. Opponent condition is fresh at championship registration, carried between that championship's races. National epochs reconstruct pinned boards deterministically. Current registration remains frozen despite later board/market activity.

Market grades unlock at Reputation0/100/350/900/2000. Current stock does not reroll merely because Reputation rises. The next qualifying home renewal includes the newly unlocked grade. Recruiters costs6LP and adds one highest-unlocked-grade driver. Regional opportunities appear only at the approved eligible intermission boundary and cannot change a frozen team. Native prices, contracts, capacity and eligibility remain the commitment authority.

World displays all eight canonical profiles, fixed rivals and committed regional counters. Compact records derive from closed summaries, not a second archive. Nation population or capital details missing or ambiguous in canon remain unknown. Refer to regression evidence for organic versus accelerated progression coverage; accelerated seven-win/Sundaran checks are not a played seven-nation campaign.
''')
write('Race_Interaction_Report','''# M6 race interaction

`progressionContext.version=2` plus `m6-immediate-signs-abilities-v1` opts only the player into M6 rules. Native historical context-v1/no-context paths remain intact.

Six Signs, No Sign and Active Ability are the eight ordinary controls. A selected Sign activates at the next native tick; budget is loop laps or Rally checkpoint count+1, plus Strategist once. All opportunities are available upfront, no crossing refill. Same active Sign is a no-op; No Sign clears pending/active instruction free even at zero. Pause and Worker buffering retain authoritative input order.

Eight effects use simulation ticks: Thunder Burst speed+10%/acceleration+15%5s; Second Wind beast continuous/action fatigue expenditure×0.5 for8s; Brace contact/collision damage×0.7 for6s; Perfect Line handling/lateral×1.15 for6s with existing handling clamp; Savage Assault offensive Combat contest×1.2 for5s; Absolute Focus existing error probabilities×0.5 for8s; Catch Breath removes10beast fatigue immediately, clamped; Steady Team eligible recovery rate×1.25 for6s. Native safety caps remain. No extra RNG stream or native attribute mutation is introduced. One slot/run, one charge/race, replacement confirmed, no permanent effect.

Nineteen additive native interaction tests cover all eight charges/checkpoint restoration, real movement/fatigue/damage/handling/combat/error/recovery effects, expiry and rival exclusion. Existing21 passive Run rewards remain. Practice clones selected owned assets/equipment/condition and affinity, with no Legacy/Run/ability bonuses or persistence effects.

The reference-driver test mode initially exposed a stale derived-attribute cache at an M6 ability boundary. The localized M6 refresh fixes that case; legacy reference digests remain unchanged. It does not change native dt, collisions, AI personality or old replay expectations.
''')
write('Practice_and_Gambling_Report','''# Practice and gambling

Practice is available between championships, uses the active legal Barn team as cloned native state, one entrant, fixed seed145, clear dirt short oval and three laps. No earnings, injuries, progression or ability charges are committed. Packaged test checks playback and exact unchanged career bytes/generation.

Participated betting is optional own-team win only, one stake per scheduled event, before native start. Stake limits are the smaller of tier cap100/250/500/1000/2500 and10% treasury. The quoted source revision/configuration must still match. Independent deterministic native samples plus a prior produce disclosed odds, target10% overround and bounded1.01–50 decimal odds. Samples that do not finish use explicitly disclosed progress estimates. No official seed/RNG position is leaked or consumed. Quotes are live source-bound capabilities, not caller-provided authority.

Stake debits once. D5 classification resolves the outcome; participated returns remain pending until atomic final championship settlement/choice. Dead heat divides the gross return across official tied winners, floor once using exact integer cents/BigInt arithmetic. DNF loses; no winner voids/refunds; withdrawal uses actual completed AI classification and does not automatically refund. Retry cannot duplicate stake or payment.

The Gambling Den creates three frozen AI-only events initially and after qualifying championship archival. Unused events do not accumulate; unresolved active stake remains preserved across refresh. Select a named team, wager or proceed without betting, watch/pause/change speed or skip the same actual native simulation. No player Signs or abilities are exposed. Native D5 completion capability authorizes the one financial settlement; no stable condition, XP, national progress or championship reward effects occur. Closure restarts the unresolved event's original seed with its already committed stake retained.

Evidence includes three real native Den events, packaged quote/stake/reload/play/skip workflow, actual participated two-race wager settlement and injected failed final commits. Synthetic tie/void fixtures supplement these races. Odds are engineering estimates, not guaranteed calibrated true probabilities; long-term return calibration remains a playtesting limitation.
''')
perf=load('controlled-performance.json',{})
capacity=load('capacity-current.json',{})
write('Balance_and_Performance_Report',f'''# M6 balance, capacity and performance

## Controlled raw simulation

`scripts/m6/controlled-performance.mjs` compares exact baseline source archived from `{head}` against current no-M6-context native races using identical setups. Five measured samples follow warm-up. Early100-tick medians were approximately6.0ms one entrant,16.5ms four Circuit,25.3ms eight Oval and26.8ms eight Long Rally. Late Long Rally tick2000–2100 measured103.7ms versus100.3ms baseline, exceeding the preferred100ms target. Exact native checksums match. Late checkpoint encode1247.6ms, hash322.2ms and cold restore843.5ms explain why ordinary M6 playback avoids durable interval reconstruction. Observed process RSS reached about516MB; this is process-level observation, not isolated browser Worker peak memory.

## Native and synthetic capacity

Eight sequential native championships use actual starting grants and ordinary services; the seven-event/eight-entrant fixture uses explicitly synthetic prior unlock/funding but actual native races, clearance and finalization. Neither is a500-championship gameplay claim. A separate legacy durable-every-200-tick diagnostic exceeded8 MiB at event6 and is retained as failure evidence; normal in-memory playback retains the authoritative prepared race only at boundaries.

Synthetic compact history10/25/50/100/500 championships reaches325,934bytes at500 (5,000race-summary equivalent),20.95ms validation,30.97ms encoding and57.63ms cold read in the recorded run. Those timings were obtained alongside other verification and are diagnostic, not a controlled performance guarantee. Logical8 MiB/complete256 MiB limits are unchanged. Actual IDB quota denial preserves current/previous roots and aborts staged restore.

## Balance and practical limitations

The matched native comparison script ran 30 seeds for each of Oval, Circuit and Long Rally, comparing baseline M6 interaction against starting Thunder Burst, with four entrants and Pure/Combat/weather variants. See its JSON for actual completed pair count, outcomes and condition; do not infer missing results or claim calibrated final tuning. Absolute Focus also has100 matched controlled first-decision fixtures. Native progression/financial proofs are separate from authoring and seeded progression tests.

The existing main-thread preferred100ms/ordinary-responsive targets remain targets. Worker total acknowledgment can be multi-second at result replay/validation boundaries; busy UI prevents duplicate submissions. This pass does not claim comprehensive isolated main-thread/Worker peak-memory or every browser hardware profile. Native seven-event capacity and synthetic retained-summary capacity are distinct. Windows responsiveness and true direct-file storage require owner testing.

The real IDB retained-record proof stored 14,663,715 bytes across eight actual native records, exported a29,483,815-byte complete backup, restored and settled to one435,351-byte current record. Under concurrent load it recorded commit6.75s, read2.27s, cold Worker validation31.35s, backup23.21s, restore70.32s and a6,506ms longest main-thread task. These are serious measured limitations, not a claim of meeting responsiveness targets. The origin estimate after compaction was135,168bytes; browser compression/quota accounting is not the logical serialized size. Main-thread JS heap observation was210MB, not an isolated Worker peak. Current/previous recovery roots were preserved and unreachable-body collection occurred through the coordinator; a second explicit collection correctly removed0 further records.
''')
write('Regression_Test_Report',f'''# M6 regression evidence

All commands below were actually launched. Baseline: **1349/1349, exit0**. The fresh full suite after the Sundaran registration correction passed **1394/1394, exit0**, without failures, skips or cancellations. Final M6 validation passed **45/45, exit0**, including the final cold rival-strength binding check. That validation check was tightened while the full suite was running and was then covered explicitly by the final M6 suite. The final standalone packaged workflow passed after the last source change. Earlier1383/1391 full-suite and67 targeted results are retained as intermediate evidence and are not added to these totals.

{table}

Detailed logs and machine-readable results are individual files in `../evidence`. `historical-accepted/raw-exits.json` records each legacy runner separately; do not treat a runner containing successful groups but exiting nonzero as fully passing. Historical12 plus payroll2 reference checks must all match unchanged expectations. Clock evidence contains100 initial states and six full captures plus eight M6 Sign/ability comparisons.

The packaged smoke test covers actual native race playback, Run choice, direct regional purchase, final native result, unpaid final review, final completion selection, market renewal and cold reload. The Worker fault test covers staged restoration, worker restart, lost acquisition acknowledgment, complete backup, corruption repair, exact current/previous recovery, native no-write playback, official/final commit aborts and retries. Zero/one-starter fixtures seed ineligibility privately and still use production proof/publication.

The 90 matched pairs completed 180 native races (all Ended); Circuit completion ticks changed in 8 pairs, and Long Rally winners changed in 2 pairs. These measure real consequences beyond ability metadata. An organic ninth championship reached a Prestige loss, and fixed-offer cold re-registration charged the entry fee exactly once.

Managed file navigation is blocked by Chromium administrator policy (`ERR_BLOCKED_BY_ADMINISTRATOR`), not verified Windows operation. The older compatibility runner inventory completed nine scripts with exit0; file-browser exited2 due administrator file policy. The regressions wrapper exited1: seven of its eight sub-runners exited0; its legacy sub-runner passed all23 functional HTTP groups but exited1 because actual file launch was blocked. These are explicit environmental nonzero outcomes, not a completely passing browser suite.

The old durable-every-interval largest-session diagnostic fails at the unchanged8 MiB bound; normal in-memory native fixture is separate. Earlier test-harness setup failures and the reference-mode M6 cache correction are dispositioned in the implementation report; no golden reference was changed.
''')
write('Local_Acceptance_Checklist',f'''# Windows offline owner acceptance — M6

Candidate `{artifact.name}` ({size:,}bytes), SHA-256 `{digest}`.

1. Keep accepted M4/M5 HTML and backups unchanged. Copy this HTML to its own folder. In PowerShell run `Get-FileHash .\\{artifact.name} -Algorithm SHA256` and compare the hash above.
2. Disconnect network. Open directly with Chrome, then Edge using separate fresh test careers. No server or adjacent files. This is owner acceptance; managed HTTP tests do not substitute.
3. Create each available starting package. Set Owner nationality, ancestry and Male/Female; for Sundaran choose an ordinary home nation. Verify identity survives Save/Load and complete backup/restore. Confirm no manual service enablement and no doubled grants.
4. Barn: activate legal driver/two same-species beasts/chariot. Practice: confirm one owned RU, dirt short oval, three laps/clear; play/pause/speed/Signs work. Close; verify Gold/condition/progression unchanged.
5. Championships: complete two intro events, select Run choice, verify only local board afterward. Check3laps shortoval/C01 and≥2otherloops, venue header, names, radio and standings. Pause before selecting Sign; it becomes active next tick and spends once. Same-active selection does not spend; No Sign works at zero. Exactlyeight normal controls.
6. Select an Active Ability through a legitimate reward offer; confirm slot replacement, charge once/race and visible native effect/expiry. Keep legacy passive rewards functional. Close an unfinished race: reopen at original seed with prior committed career choices intact and unfinished inputs discarded.
7. Try pre-race own-team wager. Inspect odds/stake limit; confirm Gold debit once. Finish race; verify outcome pending, then final choice publishes prizes/payroll/return exactlyonce. Reload/retry must not duplicate. Void/tie/DNF rare cases have automated supplemental fixtures.
8. Den fromHome ornavigation: inspect3events, teams, odds; bet thenclose/reopen. Stake remains once, event restartsseed. Watch/pause/speed/skipactualrace, settle, next parlor. No stable condition or national progression changes; unused stock does not accumulate.
9. Win two locals to expose Prestige; lose/retry without board reroll. First home Prestige win opens other ordinary nations. Worldprofiles/currenttiers/rivals/counters match. Sundaran remains locked until all seven ordinary Prestige victories, regardless of Reputation. Completed nation repeats give 70% Gold/50% Rep, no repeat LP.
10. Market: qualitythresholds0/100/350/900/2000; no immediate reroll on unlock, next qualifying renewal contains the new grade. Recruiters 6 LP, extra highest-grade driver. Regionalpurchase after eligible intermission preserves the frozen registered RU.
11. OptionsSave/Load, completebackup/export/restore, separatecareeridentity andradio/sidecarchoices. Legacyfiles remaininoldHTML; M6rejectsforeign/oldfamily importwithoutalteringcurrentcareer. Never test destructive restore against the only copy of an owner backup.
12. Finishmultiplechampionships, confirmcompactrecordsandcurrentGold/Rep/nationalprogress, no newfullracearchive. Inspect busy feedback during finalization and measure any long stalls. Record browser/OS, file location, action, expected/actual result and console error if needed.

Report acceptance or defects for both Chrome/Edge. Candidate delivery does not claim owner acceptance. No subsequent milestone is authorized by this checklist.
''')
write('Next_Gate_Readiness','''# M6 next gate

**CONDITIONAL candidate readiness — owner Windows acceptance pending.** This is not self-certification of owner acceptance.

The source implements all five checkpoint layers: current-state persistence; Owner/world/national markets; M6 Signs/abilities/Practice; native participated/Den gambling; integrated packaged validation. Consult command ledger for actual completed gates; any absent or nonzero mandatory correctness check prevents full acceptance.

Automated checkpoint disposition: persistence correctness PASS; national/world/market functional checks PASS (Sundaran prior victories accelerated); native Signs/abilities/Practice PASS; participated/Den gambling correctness PASS; integrated release acceptance CONDITIONAL because Windows acceptance and performance playtesting remain. Full Node1394/1394 and final M6 validation45/45 passed with exit0. The browser inventory has explicit environmental nonzero exits.

Remaining limitations: managed direct-file access is administrator-blocked; late Long Rally raw100ticks slightly exceeds preferred100ms and boundary encoding can take seconds; comprehensive isolated browser/Worker peak memory is not established; seven-event maximum-tier setup uses synthetic prior progress/funding; full organic seven-nation campaign and long-run odds/economy calibration need playtesting; actual native Prestige loss/retry was proven after eight organic championships; old legacy browser nonzero exits must remain separately reported; conservative previous-root financial recovery requires a matching complete backup.

No protected-history truncation, limit increase, old-save migration or golden replacement is used. Accepted old artifacts remain available. Review the standalone candidate, individual reports and Windows checklist. Do not begin further gameplay or architectural work, commit, push, merge or deploy without owner authorization.
''')
rows=[['Current-state atomic birth/cold restore','worker-faults-final'],['IDB CAS/previous/GC','idb-final'],['Real quota/restore abort','real-quota'],['Packaged career/Practice/region/full championship','smoke-final'],['Packaged AI-only Den','den-browser-final'],['Eight actual championships','repeated-native-final'],['Seven-event eight-field native fixture','largest-native-final'],['Zero/one starters','starter-boundaries'],['Historical/payroll references','references-frozen'],['Clock Node/Chromium parity','clock-final'],['Synthetic compact capacity','capacity-current'],['Matched native comparisons','matched-balance'],['Final UI/M6 targeted suite','frozen-targeted'],['Native retained records, real IDB backup/restore/compaction','retention-idb'],['Organic Prestige challenge','organic-prestige'],['Post-loss fixed challenge/retry fee','prestige-retry'],['M6 eight-ability browser parity','clock-m6'],['Final artifact packaged lifecycle','smoke-packaged-frozen'],['Complete regression suite','node-final'],['Fresh full suite after Sundaran correction','node-frozen'],['Final M6 validation suite','m6-protected-final'],['Seven-victory authoritative Sundaran registration','sundaran-registration'],['Offline managed file','file-browser'],['Reproducible build','build-byte-identity']]
with (reports/'BNT_M6_Validation_Matrix.csv').open('w') as f:
 w=csv.writer(f);w.writerow(['requirement','evidence','raw_exit','disposition']);w.writerows([name,key,exits.get(key,''),'PASS' if exits.get(key)==0 else 'BLOCKED' if key=='file-browser' else 'INCOMPLETE / inspect evidence'] for name,key in rows)
(out/'SHA256SUMS.txt').write_text(digest+'  '+artifact.name+'\n'+'\n'.join(sha(p)+'  reports/'+p.name for p in sorted(reports.iterdir()) if p.is_file())+'\n')
print(json.dumps({'artifact':artifact.name,'bytes':size,'sha256':digest,'reports':len(list(reports.iterdir())),'unfinishedCommands':[r['evidence'] for r in ledger if r['exit'] is None]},indent=2))
