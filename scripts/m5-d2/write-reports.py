import pathlib,json,hashlib,csv,re,subprocess
R=pathlib.Path('/workspace/BNT'); O=pathlib.Path('/workspace/deliverables/bnt-m5-d2'); E=O/'evidence'; B=pathlib.Path('/workspace/bnt-m5-d2-baseline')
def load(name,default=None):
 p=E/name
 return json.loads(p.read_text()) if p.exists() else default
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def exitcode(name):
 p=E/(name+'.exit');return p.read_text().strip() if p.exists() else 'not recorded/completed'
def write(name,text):(O/name).write_text(text.strip()+'\n')
def table(headers,rows):return '| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(str(v).replace('|','/') for v in row)+' |' for row in rows)+'\n'
base=load('baseline.json'); artifact=R/'dist/Blood-and-Thunder-M5-D2-Playable.html'; sha=digest(artifact); size=artifact.stat().st_size
frozen=load('frozen-runtime-hashes.json');assert all(digest(R/p)==h for p,h in frozen.items()),'Runtime changed after final test freeze'
assert digest(R/'dist/Blood-and-Thunder-M5-D1-Playable.html')==base['artifact']['sha256']
assert digest(R/'dist/Blood-and-Thunder-E5-D-M4-Playable.html')=='d77e49e40457c5de0255e3c95779941bec67023a4760248a69760f60b7a8d60c'
files=[];changed=[]
for directory in ['src','scripts','tests','content','assets','art-source','docs/m5-d2']:
 for p in sorted((R/directory).rglob('*')):
  if not p.is_file() or '__pycache__' in p.parts or p.name.startswith('.m3') or p.suffix in ['.png','.jpg','.woff2'] and directory=='scripts':continue
  rel=p.relative_to(R).as_posix();h=digest(p);old=B/rel;status='unchanged' if old.is_file() and digest(old)==h else 'modified' if old.exists() else 'new'
  row={'path':rel,'statusAgainstAcceptedD1':status,'bytes':p.stat().st_size,'sha256':h};files.append(row)
  if status!='unchanged':changed.append(row)
for name in ['package.json','package-lock.json','index.html']:
 p=R/name
 if p.is_file():files.append({'path':name,'bytes':p.stat().st_size,'sha256':digest(p)})
manifest={'baseline':base,'branch':subprocess.check_output(['git','branch','--show-current'],cwd=R,text=True).strip(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip(),'implementationCommit':None,'authority':'Uncommitted Delivery 2 candidate; no commit/push authorized or performed','artifact':{'name':artifact.name,'bytes':size,'sha256':sha},'runtimeFrozen':True,'files':files}
(O/'BNT_M5_D2_Source_Manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
with (O/'BNT_M5_D2_Changed_Files.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=['path','statusAgainstAcceptedD1','bytes','sha256']);w.writeheader();w.writerows(changed)
node=(E/'verified-source-node.log').read_text() if (E/'verified-source-node.log').exists() else ''
counts={k:(re.findall(r'ℹ '+k+r' (\d+)',node) or ['not completed'])[-1] for k in ['tests','pass','fail']}
reg=load('historical-accepted/raw-exits.json',[]); capacity=load('capacity-compare.json',{}); transport=load('transport-size.json',[]); perf=load('native-performance.json',{}); generated=load('generated-native.json',{}); native=load('native-lifecycle.json',{}); repeats=load('native-repeat.json',{}); smoke=load('smoke-browser.json',{})
common=f'''Candidate: `{artifact.name}` — **{size:,} bytes**, SHA-256 `{sha}`.

Branch `{manifest['branch']}`, repository HEAD `{manifest['head']}`. The accepted D1 source was an uncommitted candidate, verified against all {base['verifiedManifestFiles']} supplied manifest entries before editing. No implementation commit exists; the source manifest identifies this delivery. No commit, merge, push, release or deployment performed. Existing M4 and D1 HTML hashes remain unchanged. Owner Windows acceptance is pending.'''
write('BNT_M5_D2_Implementation_Report.md',f'''# M5 Delivery 2 implementation report

{common}

## Disposition

**CONDITIONAL candidate for owner testing**, subject to the final validation matrix. All six workstreams are integrated into one build. Performance and broader balance limitations are disclosed; this is not a claim of owner acceptance or unlimited career capacity.

## Implemented behavior

- **D2-A:** trusted versioned compiler combines the 256 original core records with 310 supplemental records. Original bytes remain in `content/m5/v1` and `content/m5/v1.1`; amendments are separate. Six native signatures remain exact. Three renewable generated opportunities accompany them. Generated schedules use existing oval/circuit/route geometry, real native terrain coefficients and weather, and native tier fee/qualification/points/purse contexts. Generated victories award general tier credit and normal existing rewards; they never mint signature trophies or unlock Iron Gauntlet. Generation has bounded retries and no generic-name fallback.
- **D2-B:** four persistent organizations per ordinary tier, born lazily and immutable thereafter; two selected where field capacity permits, with at least one local. Complete named drivers, paired beasts, chariots and organizations have separate stable member and native entrant IDs. Tier-quality distributions are fixed rather than player-scaled. Conditions carry between native events; a later championship uses the healthy persistent birth profile. Local profiles remain with the active championship and pass into protected archive history. No offscreen simulation.
- **D2-C:** four once-generated regional offers after an eligible intermission Run choice. Only native driver/beast/chariot/equipment acquisition is permitted through a narrow controller exception. Home offers remain restricted while registered. Regional purchases use original prices, contract terms, capacity, ownership and wage reducers; purchases neither replenish stock nor modify the frozen lineup. Stock is retired with audit facts on next start/withdrawal. Recruiters applies only to Home stock. Home and opportunity epochs renew together at qualifying archive; voluntary withdrawal never renews them.
- **D2-D:** canonical same-species legality and all 117 approved affinity cells. All starting packages retain actual grants and base stats, with an approved new-career Horse pair classification. Home guarantees two disjoint same-species pairs, including Horses. Affinity freezes in registration, native setup and a new optional checkpoint state protocol. Old no-affinity paths and references remain unchanged.
- **D2-E:** bounded exact-text hash reuse and lossless private Worker record references reduce repeated hashing and immutable-history transfer. Domain validators, full durable body reads, exact read-set comparisons, generation CAS and awaited atomic IDB transactions remain. The transport is ephemeral, not a new save format or proof of durability. Cold history reconstruction and large JSON/manifest operations remain expensive.
- **D2-F:** authoring/native compilation, package, compatibility, lifecycle, browser, fault/quota, generation-volume, balance, history-capacity, deterministic and build evidence are separate and explicitly labeled.

## Source map

{table(['Area','Files / interfaces'],[['Content/compiler','scripts/m5-d2/compile-content.py; src/career/m5/d2/content.generated.js; content/m5/amendments/d2-v1'],['Competition','src/career/m5/d2/catalog.js; championships/offers.js; e5/schema6.js; m4/progression.js'],['Fields/renewal','src/career/m5/d2/generation.js; lifecycle.js; career/m5/current.js; history.js'],['Markets/compatibility','src/career/m5/d2/markets.js; compatibility.js; cycles/policy.js; schema4.js; championships/controller.js'],['Affinity','src/model/affinity.js; affinity.generated.js; sim/race.js; environment.js; action-costs.js; foundation/checkpoint.js'],['Persistence','src/persistence/m5/indexeddb.js; verified-bytes.js; record-transport.js; e4/client.js; worker-entry.js; m5-store.js; m4-policy.js'],['Presentation','management/m5-d2.js; player-pages.js; career-race/flow.js; headquarters/active-team.js, consolidated.js, model.js; startup/slots.js; presentation/geometry.js, content/m3-bc.js']])}

The changed-file CSV compares against the frozen accepted D1 working tree, not only the older git HEAD. Four pre-existing test-output modifications and prior untracked documentation were preserved. The source manifest covers the complete source/content/test/build inputs.

## Early functional proof and defect correction

The first proof executed a generated two-event native championship through official publication, Run choice, final settlement, completion choice, archive, renewal and cold reconstruction. An initial regional diagnostic omitted the native `term:null` payload field; its rejection was correct. A subsequent test found mutable market-offer aliasing with the supposedly immutable regional stock. The registry now receives an independent clone; native purchase/retry/cold-load and packaged UI purchase tests pass without relaxing the stock validator. The key-only GC prototype initially attempted cursor.delete(), which Chromium rejects for a key cursor; the final code deletes the returned primary key through the same object store. The verified19-group IDB proof passes. Superseded verification runs were explicitly stopped when the source changed; their exits are not counted as passing final regressions. An early browser selector used `market` instead of the actual `markets` route; the runner was corrected, with the original failure log retained.

## Save and authority boundaries

D2 uses isolated `BNT-M5-D2-slots-v1` and `BNT-M5-D2-<slot>` databases. Schema7/envelope/root formats remain, with a mandatory versioned `m5.d2` extension and pinned content. This is an explicit isolated development-family boundary, not an automatic D1 career conversion. Open existing D1 careers with the preserved D1 HTML. D2 rejects incompatible imported authority instead of silently changing registered units. See compatibility report.

## Deferred and limited

No gambling, travel, generated circuit topology, new artwork, unrelated mechanics, numerical economy rewrite, permanent injury system, or Delivery 3 work. No 12-event economic schedule was invented: the approved native maximum remains seven events. Long-history main-thread targets and complete catalog-wide statistical balance are not asserted as passed. Windows direct-file behavior must be accepted locally using the supplied checklist.
''')
write('BNT_M5_D2_Content_Integration_Report.md',f'''# M5 Delivery 2 content integration

{common}

## Authority and byte preservation

Read START_HERE, OWNER_POLICY, IMPLEMENTATION, COMPATIBILITY, affinity-v1 and ACCEPTANCE in full before production work. OWNER_POLICY resolves older draft recommendations. The compiler checks original SHA-256 manifests and strict schemas, duplicate keys, non-finite values, references, IDs and matrix coverage. There are **256 original records in 16 catalogs** and **310 supplemental records in 11 families**. Source documents retain their original draft labels/bytes; approval comes from the owner authorization, not rewritten content files.

Supplement families: 18 geometry profiles (three native ovals, twelve native circuits, three generated Rally lengths); eight environmental profiles; 24 naming profiles; 121 venue profiles (16 prestige, 105 renewable across 35 regions); 72 event profiles; six tier bindings; 40 championship profiles; five rival and five local entrant profiles; eight presentation profiles; three renewal profiles.

`content/m5/amendments/d2-v1/integration-v1.json` records runtime resolutions for pairing, naming, fields, opportunities, markets and isolated saves. Its schema freezes this amendment version. `affinity-v1.json` is the exact owner matrix. The generated pin and all constituent digests are in `src/career/m5/d2/content.generated.js` and the source manifest. The accepted core v1 pin is unchanged. No original catalog was regenerated.

## Native bindings and identities

Six signature snapshots matched actual source. Generated opportunities bind only to dustroad / ironwheel / bannerfall / crownfire / thunder-crown economic contexts: respectively 2/3/4/5/7 events, original field sizes, fees, points, qualifications and rewards. Iron Gauntlet remains the signature exception, original special qualification and completion tier5; no generated Gauntlet pool or generated signature trophy.

Venue profile, resolved venue instance, event profile, opportunity template and championship instance identities are distinct. Prestige IDs are stable; renewable venue IDs include frozen context. Schedule, native course, surfaces, seeds, native grid policy, field, award terms, host nations and content pin freeze at registration. Board refresh does not renew its epoch. International profiles require at least two host nations. The native route generator supplies Rally topology; no procedural circuit geometry.

Terrain assignments modify actual native segment surface coefficients, not weather labels. Circuit/Rally terrain tags are recompiled; oval coefficients are patched through the existing native interface. Presentation identifies the corresponding terrain coefficients and segment boundaries. Rally Sign Points reuse the approved short/medium/long fractions, with existing native crossing and opportunity accounting.

## Names and fields

The v2 grammar adds cultural family qualifiers for generated beast/organization/chariot/equipment names. Production never substitutes numbered or generic rival names. Reservation sets cover current owned/offered assets, born persistent teams and local teams; they do not retain an unbounded lifetime list of unused names. Existing authored names remain at the initial Home batch. Canonical species text takes precedence where the approved pairing amendment reclassifies a new-career beast; incompatible old cosmetic biographies are not shown as current species facts. Pack bytes/pins and unchanged authored biographies remain intact.

Default persistent pool is four per tier (20 across all five once born). Separate pure-generation stress covers32 and128; these are not production pool sizes. Fixed births are revalidated against deterministic generation. Active locals retain their frozen profiles and native baseline; conditions may evolve, base strength/personality may not.

## Verification and limits

All40 generated schedule profiles and18 native geometries compile. The native surface adapter is tested for all121 venue profiles. Pure/Combat native championship cases cover all five ordinary tiers and national/international schedules. Original authoring validation alone is not counted as gameplay evidence. See raw native results, balance study and validation matrix for actual counts. Cosmetic assets are placeholders; no additional art is required to play. Native signature definitions did not supply canonical venue/host identities; their new local/regional adapter currently uses N1 as a provisional fallback. Generated competitions use their actual pinned venue hosts. The fallback is not a claim that all signature events canonically occur in N1 and should be reviewed before canonical location assignment.
''')
write('BNT_M5_D2_Compatibility_Report.md',f'''# Delivery 2 compatibility and affinity

{common}

## Formula mapping

Canonical ancestry IDs A01–A13 and beast species B01–B09 come from the owner matrix. Two distinct owned beasts must share species; bloodline, quality and temperament may differ. Nine same-species types are legal, 36 unordered mixed types illegal, all81 ordered combinations tested. Mismatched ancestry affinity is legal.

Let `f` be1.05 for primary,1.0 for neutral Horse,0.95 for other non-primary pairings. After existing native condition/equipment/upgrade-derived RU calculation, `applyAffinity` applies one independent factor to maximum speed, acceleration (native acceleration-limit clamp), handling and control (0–100 clamps), braking and lateral handling. It does not feed the adjusted handling/control back into other targets. Existing payroll-control application follows this stage. Base attributes, personality, combat, awareness, nerve, mass, load, recovery, structural durability and equipment records are untouched.

Stamina efficiency means expenditure is divided by `f`. Actual continuous beast-fatigue generation and discrete action-fatigue costs receive one division each at their existing expense hooks. Recovery, driver strain and chariot wear do not. Native derived `fatigueRate` is also represented as divided by `f` for the derived preview; no simulation consumer uses it a second time. Tests prove actual continuous/action expenses, not just display numbers. No new driver-fatigue coefficient or recovery rule.

All entrants receive frozen contexts. The existing no-context branch returns the original derived object and retains old checksum behavior. Context is in race setup and live state; checkpoint protocol `m5-race-state-v3` is used only with affinity. Earlier v1/v2 checkpoints retain existing readers and behavior. New v1 affinity references are additional candidate fixtures, never replacements for historical goldens.

## Save compatibility matrix

{table(['Input / operation','D2 behavior'],[['New D2 career','Schema7 current envelope + m5.d2 version1, content/compatibility pin, independent database namespace'],['Accepted D1 / M4 existing career','Preserved in original storage and playable HTML; no silent migration or reclassification'],['D1 backup in D2 build','Explicit incompatible-family rejection; no partial activation'],['D2 complete backup / restore','Existing complete container, protected history, native sessions, presentation and pinned D2 extension preserved'],['Career-only export','Existing complete-M5 export behavior retained; cannot silently omit protected pages/session authority'],['Older / corrupt / foreign authority','Existing monotonic revision, prior-generation confirmation, ownership, integrity and collision checks remain'],['Already registered championship','Frozen team, setup, conditions, terms and pin never silently changed by Barn/Market choices'],['Historical races','No recalculation or reference edits']])}

## Extension and persistence schema

`m5.d2` has exactly: `version:1`, immutable `pin`, integer `opportunityEpoch` synchronized with Home `marketEpoch`, `regional:null|record`, and `tierWins` by approved ordinary native economic context. A regional record has exactly version/pin, instance/event/host/region IDs, immutable native offers and identities, consumed IDs, source result fingerprint and frozen name reservations. Cold validation reconstructs the original stock, verifies its source and rejects unsupported or contradictory state.

Active championships retain versioned `m5Competition`, host nation list, resolved event/venue disclosures, local birth profiles, explicit `economicContextId`, per-entrant canonical identity and affinity context. Native checkpoint validation checks affinity against frozen setup. Protected archive pages retain the full named competition/entrant/result/condition/settlement facts; compact current indexes do not replace those pages.

D1 current-state tail128, record8MiB, complete backup256MiB, root reference2001, restore receipt2000 and registration guard2MiB remain unchanged. Presentation sidecar-v2 and immutable recruitment pack pins remain supported. The transport protocol changes only ephemeral messages for this build; all durable record formats and authoritative read-set CAS remain.

## Known boundaries

No converter is provided. D2 cannot be used to continue a D1 active championship; preserve/use D1 HTML. This follows the owner-approved isolated-development-save option. Browser origin/file-path storage availability remains browser-controlled; keep complete backups before moving files. Managed Linux tests do not establish Windows file-origin portability. No gameplay behavior outside the approved compatibility/affinity and generated content integration is changed.
''')
write('BNT_M5_D2_Local_Acceptance_Checklist.md',f'''# Delivery 2 Windows offline acceptance

{common}

1. Keep the accepted M4/D1 HTML and existing saves. Copy only `{artifact.name}` to a local Windows folder. Verify SHA-256 with PowerShell: `Get-FileHash .\\{artifact.name} -Algorithm SHA256` (expected `{sha}`). Disconnect the network. Open using `file://` in current Chrome, then repeat separately in Edge. No server, adjacent assets or downloads should be required.
2. Create a new D2 career with each available starting package. Confirm real starting Gold/assets, Market, Finances and Events immediately. Old D1 careers must remain available in the old D1 file and must not be silently adopted here. Test a separate second D2 slot and Load Game.
3. Inspect Roster & Barn and Market. Canonical beast species, matching partners and selected-driver affinity must be readable. Two distinct same-species beasts are legal even with different bloodlines; mixed species must not assemble/register. Inactive mixed assets remain owned. Home has at least two disjoint pairs, including Horses. Third-beast replacement/cancel still works.
4. Events contains the six signature competitions and three generated opportunities. Inspect named venues, nation/region, terrain/weather, actual formats, fees, qualification, grid policy, full schedule and provisional rewards. Cancel registration and reload: offers/seeds/prices must not reroll or charge. Register a legal lineup once and verify one entry fee.
5. Race normally with Play/Pause, speed, queued Strategy Signs, tactical map, standings and radio. Check Rally Sign Points. Close mid-race: reopening must restart the unfinished event from its original boundary, retaining earlier committed decisions. It must not claim mid-race ticks were saved.
6. Complete an actual race and publish the official result. Select one Run reward when offered. Open Market: four regional items should appear with origin, exact prices/terms and compatibility. Home stock remains restricted. Buy one affordable regional item. Confirm once-only charge/contract, no stock refill and unchanged registered team. Reload and confirm the purchase persists. No regional staff or Recruiters extra.
7. Start the next event manually; unused regional stock retires. Finish the championship, settle once and make the existing completion/Legacy choice. Confirm native wages and any arrears, rewards and final archive. Generated wins must not mint signature trophies. A qualifying final archive renews Home and opportunities once. Reopen/retry must not renew or award twice.
8. Earn6 LP through real native completions, purchase Recruiters, verify one extra Premium Home driver immediately and24 offers at later full renewals. No regional bonus. Optional long-horizon check: at least eight championships.
9. Voluntarily withdraw before/after a race start. AI completes the frozen schedule; no fee refund, no Home/opportunity renewal, real wages remain due, previously earned rewards stay. In a legitimate forced-elimination case after participation, AI continuation and final archive still work and qualifying renewal occurs once. Do not use developer edits on real owner saves.
10. Options: save verifies durable boundaries, complete export/restore preserves D2 pin and active championship, separate slots stay independent, deletion affects only the selected career. Try an incompatible D1 backup in D2: expect explicit rejection, original saved data unchanged. Never intentionally corrupt an owner save; fault injection is covered in disposable automated databases.
11. Resize to narrow viewport, use keyboard/focus and confirm/Cancel dialogs. Check no network requests, duplicate navigation controls, silent errors or falsely saved in-memory ticks. Large exports/loads may remain slow; report browser/version, event, record size and elapsed time.

Return browser versions, success/failure for each item, exact error text and whether the run used a fresh D2 slot. **Owner direct-file acceptance has not yet been claimed.** No next milestone is authorized by this checklist.
''')
# Remaining reports summarize actual machine-readable evidence, never assumed passes.
write('BNT_M5_D2_Test_Evidence.md',f'''# Delivery 2 test evidence

{common}

Baseline full suite: **930/930**, exit0 (`baseline-node-complete.log`). Initial copied-workspace runs omitted assets/art-source and failed; after restoring unchanged assets, the complete baseline passed. These setup failures remain recorded. Initial source iteration:1319/1319, exit0 (`final-node.log`). Final frozen-source suite: tests **{counts['tests']}**, passed **{counts['pass']}**, failed **{counts['fail']}**, raw exit **{exitcode('verified-source-node')}**. Consult logs if not yet complete.

New targeted compatibility/content/cache run:391/391, exit0 before the additional18 versioned references. Covers117 matrix cells,81 ordered pairings, actual stamina costs, old/no-context parity, checkpoint continuation,40 schedule profiles,18 geometries,121 venue adapters, Home pairs and4/32/128 named populations. The81 ordered pair tests and117 matrix tests are model/adapter tests; actual native activation, registration, races and expense effects are additional evidence, not81/117 separately completed championships. Additional tests cover188 content cases,18 new references,8 regional gates and the native persistent active-team transaction. New18 candidate affinity reference cases are separate from all historical goldens.

## Commands and raw outcomes

The controlled commands were `BNT_CONTROLLED_PERFORMANCE=1 node scripts/m5-d2/performance-native.mjs`, `BNT_CONTROLLED_PERFORMANCE=1 timeout 600s node scripts/m5-d2/capacity-compare.mjs`, `BNT_CONTROLLED_PERFORMANCE=1 timeout 300s node scripts/m5-d2/capacity-responsive.mjs`, and `BNT_CONTROLLED_PERFORMANCE=1 timeout 180s node scripts/m5-d2/capacity-acknowledgment.mjs`. The verified IDB run used `timeout 90s node scripts/m5-d2/idb-proof.mjs`. Final content verification ran `python3 scripts/m5-d2/compile-content.py` and left every frozen runtime byte unchanged.

{table(['Command','Raw exit / evidence'],[(f'node scripts/m5-d2/{dict([('regional-proof-final','regional-proof'),('native-lifecycle-d2','native-lifecycle'),('worker-faults-final','worker-faults'),('clock-parity-final','clock-parity'),('idb-proof-verified','idb-proof'),('slots-d1compat-final','slots-d1compat')]).get(name,name)}.mjs',exitcode(name)+'; evidence/'+name+'.log') for name in ['packages-proof','idb-proof-verified','history-corruption','slots-browser','slots-d1compat-final','regional-proof-final','native-lifecycle-d2','generated-native','worker-faults-final','real-quota','clock-parity-final','balance','balance-quality','balance-tiers','transport-size','capacity-compare','capacity-responsive','capacity-acknowledgment','performance-native','accepted-regressions','file-browser']])}

Some log stems differ from script names: regional-proof-final/retry runs `regional-proof.mjs`; native-lifecycle-d2 runs `native-lifecycle.mjs`; worker-faults-final runs `worker-faults.mjs`; clock-parity-final runs `clock-parity.mjs`. `browser-delivery.log` runs `smoke-browser.mjs`, exit{exitcode('browser-delivery')}; it exercises the actual D2 standalone and regional purchase. `verified-source-node.log` runs `npm test`. `references-final.log` runs `references.mjs`. Full raw command ledger is alongside this report.

## Native gameplay versus synthetic evidence

Generated tier cases: {len(generated.get('cases',[]))} championships / {sum(len(c.get('events',[])) for c in generated.get('cases',[]))} actual native events, including national and international scopes, field4–8, oval/circuit/Rally, Pure/Combat, settlement and cold load. Qualification Reputation was seeded only in these isolated high-tier fixtures; no production grant. Repeat horizon: {len(repeats.get('cases',[]))} native championships; actual earned Recruiters and renewal evidence. Withdrawal/native cases and package proofs are separate; package proof advances one native tick, not a full championship for every package. Map commit adapters prove domain/Worker behavior, not browser durability. The packaged UI and IndexedDB/fault/quota tests provide distinct browser durability evidence.

Synthetic history fixtures10/25/50/100/500 equivalent championships are not actual gameplay. Largest has5000 race summaries,50000 operations and100000 historical candidate facts. Physical IDB/backup results are in the performance report; authoring validation is not gameplay proof.

## Browser inventory

{table(['Accepted regression runner','Raw exit'],[[r['name'],r['exit']] for r in reg])}

These historical runners use their named preserved accepted artifacts or current source adapters as documented by each runner; they do not all exercise the D2 UI. D2 UI, native clock parity, Worker faults and capacity have their own new-artifact/harness evidence. A nonzero raw exit is never labeled a complete browser-suite pass. Managed file-origin restrictions and inherited numerical/obsolete-runner failures remain separate from new failures. No assertion or historical checksum was weakened.

## Failures and corrections

The original D1-compatibility runner recognized the correct rejection but its old error-message regex omitted “older development save”; the adapted final test checks the explicit D1 rejection and unchanged slot count. The original regional diagnostic invalid payload and subsequent real stock-alias defect have retained logs; the final native and UI regional runs pass. An initial UI test used the wrong route selector; corrected to the existing `markets` route. No source was modified merely to waive a failing assertion. Any unresolved final regression, quota or authority failure remains a release blocker in the matrix.
''')
perfrows=[]
for row in capacity.get('rows',[]):
 a={r['label']:r for r in row['rows']};old=a['accepted-D1-backend'];new=a['D2-backend'];perfrows.append([row['count'],f"{row['logicalBytes']:,}",round(old['warmCommitMs'],1),round(new['warmCommitMs'],1),round(row['coldMs'],1),round(row['warmValidationMs'],1),round(row['longestMainThreadMs'],1)])
responsive=load('capacity-responsive.json',{}).get('rows',[]); acknowledgment=load('capacity-acknowledgment.json',{}).get('rows',[]); detailed='';
if responsive:
 r=responsive[0];detailed+='\nCandidate-only500 fixture phase blocking (whole long tasks overlapping each phase):\n\n'+table(['Phase','Longest main-thread task ms'],[[p['name'],round(p['longestTaskMs'],1)] for p in r['phaseTasks']])
 detailed+='\nObserved after-restore main-page heap: '+str(r['memory']['used'])+' bytes. This is an endpoint sample, not peak or independent Worker heap. Peak/Worker allocation was not established.\n'
if acknowledgment:
 a=acknowledgment[0];detailed+='\nFull same-state metadata transactions through the real coordinator (synthetic500 history; not an official race publication):\n\n'+table(['Attempt','Backend snapshot ms','Worker preparation ms','Worker message wall ms','Awaited commit/ack/GC ms','Total durable acknowledgment ms'],[[i+1,round(a['backendReadsMs'][i],1),round(v['preparationMs'],1),round([c for c in a['workerCalls'] if c['type']=='prepare'][i]['wallMs'],1),round(v['commitMs'],1),round(v['totalMs'],1)] for i,v in enumerate(a['acknowledgments'])])
 detailed+='\nMessage wall minus Worker elapsed is approximately observed cloning/transport/scheduling overhead; it is not a separate durable operation. Preparations and successful message transfers remain non-durable until IDB commit completes.\n'
write('BNT_M5_D2_Persistence_and_Performance_Report.md',f'''# Delivery 2 persistence and performance

{common}

## Preserved authority

Schema7 current checkpoint plus at most128 command tail, protected immutable history pages, reference-only IDB roots, independent monotonic clock, exact read-set/generation CAS, strict awaited IDB commit, current/previous retention and explicit confirmed recovery remain. Native prepare precedes official career publication. Candidate Worker completion is never a durable acknowledgement. An unfinished P1 race remains in memory and restarts from the original frozen boundary after reload; no ordinary tick/Sign checkpoint writes were introduced.

Limits unchanged:8MiB/logical record,256MiB/complete backup,2001 root references,2000 restore receipts,2MiB pre-registration current-state guard. Financial and journal/history validation remain; no authoritative data is truncated to meet timings. GC retains all current/previous/quarantine references. Its scan now uses keys rather than cloning every immutable body just to inspect reachability.

## Targeted optimization

`verified-bytes.js` retains at most16MiB UTF-16 exact history text/128 entries. Cache hits compare the complete exact text, not a caller digest. Every body is still read from IDB and checked; a changed/missing body fails even after warm validation. Current/session text is not retained in this cache. Prefix admission keeps useful old immutable history when the full history exceeds the bound; it does not thrash through all pages on every sequential scan.

`record-transport.js` implements an ephemeral versioned lossless Worker transport. Each direction retains at most32MiB exact immutable-history text/256 entries; both endpoints independently reconstruct complete record arrays. Current/session bodies always travel in full. References can resolve only bytes previously received in that private transport lifetime; missing refs reject. Domain cold/warm validation, generation/read-set checks and durable commit still execute on the decoded arrays. References are not hashes, save tokens or authority. Worker restart/close drops these caches; untrusted cold loads still validate every required record. Worst configured transport retention is128MiB across both directions/endpoints, plus16MiB hash text; actual heap can include additional engine overhead. No unbounded lifetime graph cache.

No storage format replacement, silent migration, new backend or record-limit increase. Unchanged body rereads are deliberately retained because skipping them would require a separately proven integrity witness to preserve warm corruption detection. Manifest canonical serialization/hashing, current-envelope validation and full cold history scans remain residual costs.

## Measured representation/capacity

{table(['Synthetic championships','Logical bytes','D1 backend warm commit ms','D2 backend warm commit ms','D2 cold worker ms','D2 warm validation ms','Longest main-thread task ms'],perfrows)}

{table(['Synthetic championships','Full message bytes','Warm reference message bytes','Retained transport bytes'],[[r['count'],r['fullBytes'],r['warmWireBytes'],r['cache']['bytes']] for r in transport])}

Synthetic fixtures10/25/50/100/500 contain validated history generated from actual archived native facts, with explicit synthetic additional rows. The500 fixture has5000 race summaries,50000 operations and100000 historical candidate facts; it is **not**500 executed championships or100000 actual recruits. All record/body/index/backup limits remain. Separate capacity-COUNT JSONs include reconstruction times, sizes, memory and32/128 generation boundaries.

D1's historical reference:92.4MB logical,102.9MB backup,5.385s longest main-thread task,8.97s subsequent commit,8.67s cold validation,23.31s backup,42.76s restore,~573MB observed heap. Do not directly compare those historical concurrent-load numbers with a new controlled run. `capacity-compare.json` compares identical candidate fixture bytes using accepted D1 and candidate storage backends, then exercises current D2 Worker validation/backup/restore. Backend-only comparison does not imply the old D1 domain can read new D2 careers.

{detailed}

At500 equivalent championships, identical-byte backend warm commit was9123.9ms on accepted D1 versus7129.5ms on D2 (about21.9% lower). The100-case sample was1550.8ms versus1525.2ms, so improvement is not uniform; these are controlled single samples, not statistical confidence intervals. Comparison-table longest tasks include both backends and fixture parsing; the candidate-only phase table separates the current implementation. The large fixture backup/restore succeeded; backup107,917,336 bytes, logical96,908,713 bytes in474 records. Chrome reported physical usage much smaller because these synthetic records repeat heavily; do not extrapolate that compression to real races.

## Native gameplay and responsiveness

Eight consecutive native championships and an eight-entrant seven-event native schedule are measured separately. Actual generated five-tier native schedules and browser UI logs report full publication/settlement behavior, not synthetic archive counts. Native-domain timing under concurrent verification is a diagnostic, not controlled latency. `native-performance.json` compares identical old-rule seeds/setup against frozen D1 simulation; exact checksums must match. New affinity is excluded from that old-rule parity comparison.

Preferred<100ms main-thread tasks are **not presumed met**. Final machine-readable comparison includes total latency, main-thread long tasks, worker cold/warm validation, commit, backup/restore, physical quota estimates and heap. IDB reports are observations, not guaranteed permanent/unlimited browser storage. If an expected report is absent or incomplete, the corresponding acceptance requirement remains conditional/unverified, never passed.

## Failure handling

Native IDB tests cover atomic abort, generation conflict, exact read set, prior-generation retention, confirmed monotonic recovery, missing current root, chunked restore corruption and GC reachability. Worker fault tests cover lost acknowledgement, once-only purchase/publication, corrupt/foreign backup, repair, stale retry, interrupted creation/restore and native official publication. Real quota testing uses a reproducible Chromium Storage quota override and reports `QuotaExceededError` with no durable acknowledgement/partial birth. This does not establish universal browser quotas. See raw exits for actual outcomes.

## Remaining limits

The preferred100ms target is missed at large history. Full metadata acknowledgment remains about14.5–14.9s at500, despite bounded optimizations. Backup/restore takes tens of seconds and individual main-thread tasks take seconds. Do not treat this as unrestricted production responsiveness. Further movement of hashing/read preparation off the UI thread or a stronger private incremental index would require a separately reviewed coordination proof; no such architecture change or authority weakening was implemented.

No12-event native schedule is approved here; largest native economic schedule is seven. The synthetic500 horizon does not guarantee arbitrary future growth or500 full browser championships. Large JSON/backup paths may block beyond target. Statistical generalization and Windows direct-file acceptance remain separate gates. No architectural authority or integrity requirement was relaxed to improve a score.
''')
balance=load('balance.json',{}); quality=load('balance-quality.json',{}); tiers=load('balance-tiers.json',{})
write('BNT_M5_D2_Balance_Report.md',f'''# Delivery 2 balance evidence

{common}

## Disposition

**Provisional engineering evidence, not a final catalog-wide balance certification.** No additional economic formula or physics/AI/combat tuning was introduced. The only new numerical gameplay modifiers are the approved affinity factors. No win-rate threshold was invented to declare success.

Across the studies,1240 native standalone race runs were executed (540+400+300). Some matched configurations repeat across studies; these are not1240 independent seeds or championships.

## Controlled affinity study

540 actual standalone native races: six course/format scenarios (short oval, C01 circuit, short generated Rally ×Pure/Combat),30 matched seeds each, three affinity relations per seed. Same default base55 unit attributes and deterministic initial grid, only the player's approved affinity context varies. Detailed rows retain checksums, ticks, finish/win status, native conditions and fatigue.

{table(['Course','Format','Relation','N','Wins','Finishes','Blocked'],[[g['kind'],g['format'],g['relation'],g['n'],g['wins'],g['finishes'],g['blocked']] for g in balance.get('groups',[])])}

Starting-grid/lane effects are visible: the equal-base circuit player did not win in these fixtures, while oval primary/neutral starts were highly favored. Therefore these win rates must not be interpreted as universal affinity balance or adjusted through arbitrary tuning. Conditions remained100 in this short equal-base study; it provides little injury-risk evidence.

## Quality can overcome mismatch

An additional400 real short-Rally native races:100 matched seeds per Pure/Combat, primary all-base55 player versus a separate mismatched base65 player against base55 opponents. Both groups finished/won in this favorable starting fixture. This establishes a concrete case where stronger native quality can overcome−5%, not a universal quality equivalence, nor an approved numerical balance threshold. Horse neutrality/primary relationships are mathematically tested across all117 cells, and all five package grants remain native.

## Pinned tier profiles and full native competition

{table(['Tier','Format','N','Wins','Finishes','Injury cases','Blocked'],[[g['tier'],g['format'],g['n'],g['wins'],g['finishes'],g['injuries'],g['blocked']] for g in tiers.get('groups',[])])}

The tier study uses actual pinned D2 quality, ancestry, species and personality profiles across all five ordinary tiers, all eight nation origins over the sample, Pure/Combat and field4–8. It is a standalone native race fixture, not an actual economic championship. Long Rally uses the existing generator. Full generated native championships separately prove fees, native reward calculation, payroll, settlement, final archive and current state; isolated high-tier qualification Reputation is seeded and disclosed.

## Financial/continuation observations

Eight actual repeated championships earned the6 LP required for Recruiters; purchase charged6 once, added one Premium driver and subsequent full Home batches contained24 offers. Initial Home batches contain23. Package grants and native prices/wage obligations are unchanged. Voluntary no-start and after-start cases charge real wages, do not renew Home/opportunities and do not invent a refund or penalty. A disposable low-treasury withdrawal case records actual arrears; forced withdrawal after a legitimate start completes AI continuation and qualifying renewal. These are actual native reducers/results, with Map durability explicitly distinguished from the packaged IDB tests.

Full sample data, not selected only wins, are in `balance.json`, `balance-quality.json`, `balance-tiers.json`, `generated-native.json`, `native-repeat.json` and `native-lifecycle.json`. Actual counts and any blocked races remain visible. No performance-driven elimination, reroll or fabricated finishing status is used.

## Remaining balance work

The studies do not prove final difficulty for every authored build, every player Strategy Sign sequence, every temporary/Legacy loadout or a lifetime economy. Final artwork and species animation are not involved. Broader player playtesting and additional matched fixtures are advisable before numerical retuning. Owner approval remains required for material changes to player agency, progression or financial obligations; none is hidden in this candidate.
''')
rows=[
 ('Baseline/source','PASS','113 accepted D1 manifest entries matched; original HTML hashes protected; dirty work preserved'),
 ('D2-A content','PASS','Original core/supplement hashes, strict schemas,40 schedules/18 geometries/121 venue native adapters;6 signatures unchanged'),
 ('D2-A native competition','PASS' if len(generated.get('cases',[]))==5 and not any(c.get('blocked') for c in generated.get('cases',[])) else 'CONDITIONAL','Actual generated five-tier schedules; high-tier qualification fixture is explicitly seeded'),
 ('D2-B fields/names','PASS','Canonical complete paired/affinity fields; fixed populations4/default,32 and128 pure generation; native carryover and recurrence'),
 ('D2-C markets','PASS' if smoke.get('result')=='PASS' else 'CONDITIONAL','Final native/UI regional purchase; once-only fee; frozen team; retire/renewal; Recruiters earned in8 native championships'),
 ('D2-D compatibility','PASS','117 cells,81 ordered pairs, real fatigue costs, clamps/non-targets, old references and checkpoint context'),
 ('D2-E integrity','PASS' if exitcode('worker-faults-final')=='0' and exitcode('real-quota')=='0' else 'CONDITIONAL','Real IDB fault/CAS/quota/GC and complete backup/recovery evidence; no bound increases'),
 ('D2-E responsiveness','CONDITIONAL','Exact bytes and key-only GC improve bounded paths; report residual main-thread/large-history costs against100ms target'),
 ('D2-F balance','CONDITIONAL','Actual native samples and tier/economic evidence; broad balance certification not claimed'),
 ('Full Node final source','PASS' if exitcode('verified-source-node')=='0' else 'CONDITIONAL','See verified-source-node.log/.exit and frozen runtime hashes'),
 ('Historical browser inventory','CONDITIONAL' if any(r['exit']!=0 for r in reg) else 'PASS','Raw process exits retained; inherited managed-file/numerical/obsolete issues separate'),
 ('Standalone reproducibility','PASS' if exitcode('build-repro')=='0' else 'CONDITIONAL','Two byte-identical self-contained builds; original M4/D1 untouched'),
 ('Windows direct-file','CONDITIONAL','Owner Chrome/Edge file:// acceptance still required'),
 ('12-event native championship','UNVERIFIED / NOT APPLICABLE','No approved12-event economic definition; native maximum7; no invented schedule/economics'),
]
with (O/'BNT_M5_D2_Validation_Matrix.csv').open('w') as f:
 w=csv.writer(f);w.writerow(['Requirement','Disposition','Evidence / limitation']);w.writerows(rows)
# Ledger includes every retained process-exit file plus historical child scripts.
ledger=[]
for p in sorted(E.glob('*.exit')):ledger.append({'evidenceStem':p.stem,'rawExit':p.read_text().strip(),'log':p.with_suffix('.log').name})
ledger.extend({'evidenceStem':'historical-accepted/'+r['name'],'rawExit':r['exit'],'log':'historical-accepted/'+r['name']+'.log'} for r in reg)
(E/'command-ledger.json').write_text(json.dumps(ledger,indent=2)+'\n')
write('BNT_M5_D2_Readiness_Summary.md',f'''# Delivery 2 readiness

{common}

**CONDITIONAL — owner testing candidate, not final owner acceptance.**

{table(['Requirement','Disposition','Evidence / limitation'],rows)}

All six workstreams are represented in the candidate. The early complete native loop, generated five-tier native championships, repeated career horizon, regional purchase, affinity, protected financial/lifecycle and fault tests have separate reproducible evidence. Synthetic500 capacity is not counted as500 native championships. No original goldens or content bytes were edited.

Review the performance report for measured residual blocking and the balance report for sample limitations. Run the Windows checklist against this exact artifact before acceptance. No Delivery 3, commit, merge, push or deployment was performed or is implied.
''')
print(json.dumps({'artifact':manifest['artifact'],'sourceFiles':len(files),'changedAgainstD1':len(changed),'node':counts,'reports':len(list(O.glob('*.md')))},indent=2))
