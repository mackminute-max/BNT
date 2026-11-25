from pathlib import Path
import json,csv,re
D=Path('/workspace/deliverables/bnt-m5-d1');E=D/'evidence'
def load(n,fallback={}):
 try:return json.loads((E/n).read_text())
 except:return fallback
def write(n,s):(D/n).write_text(s.strip()+'\n')
cap=load('capacity.json');real=load('capacity-idb.json');vol=load('generation-volume.json');perf=load('native-performance.json');native=load('native-lifecycle.json');repeat=load('native-repeat.json');exits=load('verification-exits.json',[]);build=load('build-verification.json');clock=load('championship-clock/parity.json');f=load('worker-faults.json');idb=load('idb-proof.json');quota=load('real-quota.json');slots=load('slots-browser.json');smoke=load('smoke-browser.json')
commands='\n'.join('| `'+ ' '.join(r['command'])+'` | '+str(r['exit'])+' | [log](evidence/verify-'+r['name']+'.log) |'for r in exits)
raw_node=(E/'verify-full-node.log').read_text()if(E/'verify-full-node.log').exists()else(E/'release-node.log').read_text();m=re.search(r'ℹ pass (\d+)',raw_node);passed=m[1]if m else 'not completed';full_exit=next((r['exit']for r in exits if r['name']=='full-node'),'pending')
refrows=load('references.json').get('rows',[]);refs='\n'.join('| '+r['file']+' | `'+r['expected']+'` | `'+r['actual']+'` |'for r in refrows)
write('BNT_M5_D1_Test_Evidence.md',f'''# M5 Delivery 1 — Executed test evidence

Final source is the uncommitted manifest-bound candidate; HEAD `6f01da6d9cc0a79fecf9d38cd55989e17fb2651c` remains unchanged. No commit/push/merge/deployment occurred.

## Environment and inventory

Linux managed workspace, Node 24.22.1, Chromium 156.0.8078.79, Python 3.12.14; existing esbuild/playwright-core retained. Commands run from `/workspace/BNT`; absolute evidence destinations in the scripts match this workspace. No dependency installation/update.

Baseline frozen accepted M4: **888 pass, 0 fail, exit 0**, `evidence/frozen-baseline-node.log`. Final complete inventory: **{passed} pass**, raw process exit **{full_exit}**. New M5 test file adds 42 tests; original 888 tests and golden data were not removed or weakened. Earlier intermediate full runs (926, 929 and 930) are not substituted for the final captured-exit verification.

## Final sequential command ledger

Actual process results are persisted in [verification-exits.json](evidence/verification-exits.json). A missing entry means not completed, never an assumed pass. Native timing and capacity comparisons in this final verification run are separate from earlier concurrent-load diagnostics.

| Command | Raw exit | Evidence |
|---|---:|---|
{commands}

Build commands: `node scripts/m5-d1/build.mjs` twice, raw exits from [build-verification.json](evidence/build-verification.json); byte identity `{build.get('byteIdentical','pending')}`. HTML size {build.get('bytes','pending'):,} bytes; SHA-256 `{(build.get('hashes')or['pending'])[0]}`. Accepted M4 SHA remains `{build.get('M4SHA256','pending')}`. Builder includes offline/external-dependency checks and embedded worker/viewer/practice integrity guards.

## Dedicated acceptance results

- IDB browser: **{idb.get('passed','pending')} groups**, actual atomic birth abort, two-connection stale generation/read-set rejection, previous root, GC reachability, explicit monotonic recovery, missing-root detection/independent clock, exact multi-chunk restore staging, missing chunk rejection and no current-root mutation.
- Actual inline worker + actual M5 IDB: **{f.get('passed','pending')} groups**, interrupted creation/restore, worker failure/restart, native equipment acquisition lost acknowledgment/retry, protected caller-options rejection, export/restore/duplicate/foreign integrity checks, corrupt body rejection and exact-backup repair, confirmed prior recovery, active unfinished restart from tick0, zero playback writes, real native clearance, actual official-commit IDB abort and identical retry. No synthetic finish/result replaces this race.
- Real Chromium quota: **{quota.get('passed','pending')} groups**, CDP quota set before first IDB open. 1 MiB permits actual M5 birth; legal-size pressure and multi-chunk restore produce actual `QuotaExceededError`. No acknowledgment/current/previous mutation, no partial stage. Pressure body is an isolated backend fixture, not claimed as a valid native race session. Initial 256 KiB budget also rejected birth; retained as diagnostic evidence, not a failed gameplay assertion concealed by changed data.
- All five packages: real M5 current initialization, 23 generated offers, exact package Gold, zero starting LP, native registration, one actual native tick and cold current reconstruction.
- Zero/one starter: eligibility is privately seeded in a clearly marked fixture; production start and typed no-starter/native result publication then cold-load. Zero awards/participation/condition effects for NoStarters; one starter runs real native simulation.
- Packaged UI: **{len(smoke.get('groups',[]))} groups**, actual new career/generated purchase/full native two-event cycle/reward/settlement/archive/Home renewal/cold page reopen, no page errors; result `{smoke.get('result','pending')}`.
- M5 slots: `node scripts/m5-d1/slots-browser.mjs`, raw exit 0 (`evidence/slots-browser.exit`), result `{slots.get('pass','pending')}`; [slots-browser.json](evidence/slots-browser.json) distinguishes candidate tests from historical artifact regressions.
- Six native lifecycle scenarios in [native-lifecycle.json](evidence/native-lifecycle.json): normal, voluntary before start, voluntary after one race, voluntary with native arrears, forced elimination after start, full eight-entrant seven-event championship. Production worker/domain/native simulation with an explicitly identified isolated Map acknowledgment adapter; browser durability is covered separately above.
- Eight consecutive native championships/16 races, normally earned LP, expired contract renewal, 6-LP Recruiters purchase, immediate and later-renewal 24-offer batches, every archive cold validated. [native-repeat.json](evidence/native-repeat.json). No synthetic LP grant.
- 100,004 actual generated identities in 4,348 batches, all 8/13/9 paths; 81 species-pair legality test; fixed rival recurrence/healthy clone reset; new factory goldens; no historical golden changed.

## Historical replay and cross-runtime checks

| Reference | Expected | Actual |
|---|---|---|
{refs}

Clock diagnostic: **{clock.get('actualInitialStates','pending')} initial states** and {len(clock.get('fullRaces',[]))} full Pure/Combat Oval/Circuit/Rally captures; result `{clock.get('pass','pending')}`. Exact Node/Chromium championship-clock parity is distinct from any unapproved claim of universal cross-browser numeric portability.

## Existing browser inventory — preserve nonzero exits

Executed configured `npm run test:browser`: **exit 1**, functional HTTP groups pass, direct-file launch denied by browser administrator policy. `node scripts/m2-a-browser.mjs`, `m2-b-browser.mjs`, `persistence-browser.mjs`: **each exit 1**, functional groups pass, file policy block. Logs are retained individually.

Executed `node scripts/m5-d1/accepted-regressions.mjs`: historical accepted-artifact compatibility inventory, not a claim that those old artifacts use M5 persistence. Nine primary scripts exit 0 (browser, features, creation, faults, import, presentation faults, HQ, restart, deletion); file-browser exits 2; nested regressions exits 1. Seven of eight nested scripts exit 0 (references, layout, interface, browser-native, checkpoint-compat, player, E4); legacy exits 1 due file launch policy after functional HTTP checks. Exact per-process exits in `evidence/historical-accepted/raw-exits.json` and nested `regressions/all-exits.json`. No completely passing browser-suite claim.

Candidate direct `file://` diagnostic exits **2** with `ERR_BLOCKED_BY_ADMINISTRATOR`, zero network requests. Windows Chrome/Edge offline acceptance is **not executed here**, and is required by the delivered owner checklist. HTTP tests do not substitute.

## Failed diagnostics, correction and disposition

- Acquisition fixture initially lacked native driver capacity. Fixed the fixture through the real paid quarters purchase; no capacity assertion removed.
- UI/clock polling initially referenced undeclared `BNT_M1` during reload/bootstrap. Corrected diagnostic polling to `globalThis.BNT_M1`; no production simulation behavior change.
- A recovery test initially expected rejection of a still-retained acknowledged purchase. Corrected it to require idempotent acknowledgment **and** reject a different unacknowledged stale command. Financial effects remain checked.
- Initial large-backup fixture used an invalid non-hash root witness. Replaced it with the real record digest; integrity assertion remains unchanged.
- Actual large restore then exposed Chromium's single-value structured serialization limit. Production staging now atomically chunks and hashes temporary restore data; original failure logs retained. Large complete restore and missing-chunk/quota rollback are rerun; no application bound was raised.
- 128-rival name exhaustion remains an explicit safe-rejection stress limitation, not reported as pass or repaired with generic names.
- Early performance runs overlapped verification and are labeled concurrent; final sequential benchmark results supersede them for controlled comparisons.

## Evidence limits

Synthetic 500-championship/5,000-race/50,000-operation storage stress is not native gameplay. Main heap values are samples, not exact peak or isolated worker-heap measurements. Browser quota estimates are estimates; highly repetitive synthetic history compresses unusually well. No indefinite lifetime, Windows owner acceptance or Delivery 2 balance acceptance is claimed.
''')
# Performance report: actual values, no fabricated target compliance.
perfrows=[]
for r in perf.get('rows',[]):
 a,b=r['measured'];perfrows.append(f"| {r['name']} | {a['first100Ms']:.2f} | {b['first100Ms']:.2f} | {a['tick']} | `{a['checksum']}` / `{b['checksum']}` |")
metrics='\n'.join('| '+k+' | '+f'{v:,.2f}'+' |'for k,v in real.get('measurements',{}).items())
write('BNT_M5_D1_Capacity_and_Performance_Report.md',f'''# M5 Delivery 1 — Capacity and performance

## Verdict and method

**CONDITIONAL.** Current-state correctness/retention can be demonstrated at the synthetic target horizon; large-history responsiveness is not certified to the preferred 100 ms main-thread target. This is not evidence of 500 played championships or unlimited persistence.

Fixed fixtures/scripts are retained under `scripts/m5-d1/`. Final command ledger uses sequential jobs; earlier concurrent-load logs are preserved separately. Linux/Chromium/Node timings are environment-specific. No mechanic, numerical precision or protected record was changed to improve a timing.

## Native M4 comparison

Same native setups/seeds run from frozen accepted M4 source and current source. Raw simulation, not durable E4 timings. Final benchmark concurrent-load flag: `{perf.get('concurrentLoad','pending')}`. All four exact captures/digests match.

| Workload | M4 first 100 ticks ms | M5 first 100 ticks ms | Final tick | Checksums |
|---|---:|---:|---:|---|
{chr(10).join(perfrows)}

See `native-performance.json` for creation, remaining-race duration, event counts and heap samples. Long Combat Rally uses eight actual entrants and runs to native clearance. These are small single-pair engineering measurements, not statistical speedup claims; no simulation implementation changed. P1 buffering/in-memory advancement remains intact and has zero ordinary durable writes.

## Executed native horizon

Eight consecutive two-event native championships, 16 actual races, real contract renewal, earned LP/Recruiters and cold archive reconstruction. Separate actual eight-entrant seven-event permanent competition covers Pure/Combat Oval/Circuit/Rally, largest logical native record **4,230,404 bytes**, archived current **420,862 bytes**. Earlier concurrent publication preparation/Map acknowledgment ~0.97–2.46 s in that full-field fixture; not a browser main-thread measurement. Regular packaged browser proof completes two events through actual durable IDB, not just isolated scoring helpers.

Current permanent catalog maximum is seven events. No real 12-event D1 competition is available; none was invented because generated definitions are Delivery 2. The 12-event active workload remains **unverified/not supported by current catalog**, not passed by substituting a smaller count.

## Synthetic long-career representation

Production current/history validators, page builder and real backend exercised with a fixture cloned from real completed native results, explicitly marked synthetic:

| Quantity | Measured |
|---|---:|
| Championship summaries | {cap.get('championshipSummaries')} |
| Race summaries | {cap.get('raceSummaries')} |
| Synthetic operations | {cap.get('syntheticOperations')} |
| Synthetic historical candidate facts | {cap.get('syntheticHistoricalCandidates')} |
| Protected pages | {cap.get('pages')} |
| Logical records | {cap.get('records')} |
| Current/largest record bytes | {cap.get('currentBytes'):,} |
| Total logical record bytes | {cap.get('totalLogicalBytes'):,} |
| Complete deduplicated backup bytes | {real.get('backupBytes',0):,} |

No 50,000-command native economic replay is claimed. These neutral synthetic operations exercise page order/conservation and retained-state size; 500/5,000 synthetic summaries test protected archive/index storage, not results of 5,000 native races. **A separate actual factory run generated {vol.get('actualFactoryIdentities',0):,} identities** across all canonical paths; do not conflate that with the historical fixture.

## Actual browser retention, backup/restore and latency

Production IndexedDB coordinator, inline worker, cold validation, complete backup, complete restore and reachability GC result: `{real.get('pass','pending')}`. Full current and previous roots retained; identical history bodies deduplicated. This synthetic test's second generation deliberately shares all unchanged records; separate IDB/fault tests exercise changed/current/previous recovery.

| Operation | Milliseconds |
|---|---:|
{metrics}

Longest observed uninterrupted main-thread task: **{real.get('longestMainThreadMs',0):,} ms**. This misses the preferred 100 ms goal. Main causes are the remaining exact read-set expansion/hash/serialization and large-container staging preparation; worker domain preparation does not make those main-thread operations asynchronous. Cold validation and backup still read all protected history. Warm worker reuse is private/exact-byte/revision bound; no untrusted token is accepted. The change removes lifetime genesis replay and duplicate immutable bodies, not every full read/transfer cost. Further reference-message/chunk-processing optimization is a documented next concern, not a hidden correctness shortcut.

Logical immutable body bytes enumerated from actual IDB: `{real.get('physical',{}).get('bodyBytes','pending')}`. This is **not physical disk occupancy**. `navigator.storage.estimate()` reported usage `{real.get('estimate',{}).get('usage','pending')}` and quota `{real.get('estimate',{}).get('quota','pending')}` bytes. Synthetic repeated strings compress strongly in Chromium; that usage is not a reliable prediction for diverse real careers, nor a promise of persistent quota. Actual quotas differ by browser/context.

## Memory

Node stress-construction RSS sample before `{cap.get('memoryBefore',{}).get('rss','pending')}`, after `{cap.get('memoryAfter',{}).get('rss','pending')}` bytes; constructing the complete synthetic fixture itself retains rows/graphs and is not normal per-tick memory. Browser memory samples: `{real.get('memory',[])}`. Values are highest-observed samples only, not exact peaks; isolated worker heap was not reliably measured. Backup/restore temporarily duplicates large strings/graphs and remains a substantial memory risk. No unbounded persistent generation cache was introduced; actual volume generation drops each previous batch.

## Capacity and safe failure policy

8 MiB logical record and 256 MiB complete backup bounds retained. Pre-registration current≤2 MiB reserves six MiB for active current-state growth; source snapshot/fees unchanged on denial. No unsupported 12-event guarantee. Root refs bounded to 2,001; current/previous plus one recovery quarantine determine body reachability. Completed session retirement requires native final settlement and completed reward selection; unpaid obligations stay live. Interrupted GC is atomic and only removes unreachable bodies.

The first large restore exposed a browser single structured-value ceiling (~133 MB serialized) even below the 256 MiB application container bound. Fixed with ≤1 Mi-character temporary restore chunks plus a full-text hash and one atomic staging transaction. This is lossless staging, not an increased logical-record limit, history deletion or partially authoritative restore. Missing chunk and real quota tests preserve the current generation and reject acknowledgment.

A real clean-origin 1 MiB CDP quota allowed native M5 birth and then produced actual `QuotaExceededError` for a pressure write and chunked restore, retaining exact current/previous authority with no partial stage. It is a reproducible test budget, not a production quota recommendation. 32 fixed rivals succeed; 128 safely exhaust names. Default four is verified. No generic fallback or catalog expansion was used.

## Practical disposition

Small/new careers and the observed native repeated horizon are playable candidates. The synthetic 500-history target is **retained/reconstructable**, but large-career responsiveness is **not** accepted to the target and memory remains high. Windows offline owner verification is still required. Do not promise indefinite growth, maximum-field 12-event support or acceptable latency on all hardware. Review these limitations before Delivery 2 or a further persistence performance scope.
''')
validation=[
('baseline','Accepted M4 source/artifact hashes and frozen 888 suite','PASS','baseline.json; frozen-baseline-node.log','240 hashes; 888/888'),
('new-family','Independent schema7 checkpoint; no old-save adoption','PASS','current tests; slots-browser; Persistence Contract','M4 untouched; no converter'),
('native-authority','Native quotes, reducers, graph/wage/condition/registration','PASS','42 additive tests; native lifecycle; full Node','No second economy'),
('init','Atomic new career and interrupted staging','PASS','worker-faults.json; packages-proof.json','No playable partial birth'),
('commands','Revision scoped IDs, duplicate/conflict/stale rejection','PASS','current tests; worker-faults; idb-proof','Ack64; tail128'),
('rollover','Actual128-op rollover, old request rejection, cold load','PASS','tests/m5-d1.test.js','130 real refresh commands'),
('corruption','Missing/corrupt pages/pins/foreign graph','PASS','current tests; worker-faults','No silent fallback'),
('recovery','Explicit prior recovery, monotonic clocks, missing root','PASS','idb-proof.json; worker-faults.json','Latest prior facts may be lost only with confirmation'),
('publication','Native prepare/official atomic abort/retry/idempotency','PASS','worker-faults.json','Actual IDB transaction abort'),
('backup','Complete M5 export/import and duplicate/foreign rejection','PASS','worker-faults.json; capacity-idb.json','Deduplicated current+previous'),
('restore-stage','Multi-chunk atomic stage; missing part/quota','PASS','idb-proof.json; real-quota.json','Fixes measured Chromium value limit'),
('gc','Current/previous reachability and unreachable-only removal','PASS','idb-proof.json; capacity-idb.json','Post-commit GC; one quarantine'),
('quota','Real denial preserves roots and no false acknowledgment','PASS','real-quota.json','Clean-origin pre-open CDP override'),
('content','Actual16 families/sourcehash/schema/provenance pin','PASS','content-compile-final.json; verify-content.log','256 records'),
('paths','8 nations/13 ancestries/9 species and81pairings','PASS','current tests; generation-volume.json','No new species physics'),
('generation-volume','Actual100k factory identities','PASS','generation-volume.json','100004; no lifetime batch retention'),
('home','Native generated acquisition/no reroll/retained identity','PASS','smoke-browser; current tests','Native price and contract'),
('renewal','Normal/forced once; no voluntary renewal','PASS','native-lifecycle.json; native-repeat.json','Native actual races'),
('withdrawal-liabilities','Before/after start, real wages, insufficient funds','PASS','native-lifecycle.json','95 assessed;65paid/30arrears'),
('recruiters','6LP immediate and renewal Premium driver','PASS','native-repeat.json','Earned6LP normally;24offers'),
('rivals','Fixed persistent4 +freeze/reset/native adapter','PASS','current tests; capacity.json','D1 factory seam; no hybrid injection'),
('rival-stress32','32-organization stress','PASS','capacity.json','Actual generated population'),
('rival-stress128','128-organization stress','BLOCKED','capacity.json','Bounded naming exhaustion; safe rejection'),
('playable','Packaged full2eventnativecycle/purchase/reload','PASS','smoke-browser.json','No ordinary playback writes'),
('native-fullfield','8 entrants7events pure/combat3formats','PASS','native-lifecycle.json','Qualification seeded fixture; races real'),
('native-repeat','8 consecutive championships/16 races/cold','PASS','native-repeat.json','Real renewal and earnedLP'),
('zero-one','Authoritative zero/one starter','PASS','starter-boundaries.json','Private synthetic eligibility; production outcomes'),
('500-history','500/5000/50k/100k storage horizon','CONDITIONAL','capacity.json; capacity-idb.json','Synthetic validated storage not played games; latency high'),
('12-events','12-event active native championship','UNVERIFIED','Capacity report','Current D1 catalog maximum7; no D2 definition invented'),
('responsiveness','Preferred100ms main-thread target','CONDITIONAL','capacity-idb.json','Large stress exceeds target; disclosed'),
('worker-memory','Isolated worker peak heap','UNVERIFIED','Capacity report','Only main/Node samples reliable'),
('replays','12historical+2payroll unchanged','PASS','references.json','Exact existing goldens'),
('clock','Node/Chromium championship clock and3fullraces','PASS'if clock.get('pass')else'PENDING','championship-clock/parity.json','100initialstates'),
('M3BC','Identity packs/radio/replay protected','PASS','Full Node; historical accepted inventory','Original reporter/physics untouched'),
('browser-suite','Existing configured/all accepted workflows','CONDITIONAL','historical-accepted raw-exits; browser logs','Functional HTTP pass; file-policy nonzero retained'),
('slots','Two new M5 slots/oldimport rejection/deletion','PASS'if slots.get('pass')else'PENDING','slots-browser.json','Actual packaged interface/slot authority'),
('build','Standalone twice byte-identical offline embed','PASS'if build.get('byteIdentical')else'PENDING','build-verification.json','Old M4 artifact unchanged'),
('Windows','Windows Chrome/Edge file offline acceptance','BLOCKED','Local acceptance checklist','Owner test pending; managedfile denied'),
('scope','No Delivery2/commit/push/deploy','PASS','git status; implementation report','Uncommitted candidate only')]
with(D/'BNT_M5_D1_Validation_Matrix.csv').open('w')as h:
 w=csv.writer(h);w.writerow(['gate','requirement','result','evidence','qualification']);w.writerows(validation)
print({'tests':passed,'exit':full_exit,'capacity':real.get('pass'),'mainThreadMs':real.get('longestMainThreadMs'),'clock':clock.get('pass'),'slots':slots.get('pass')})
