from pathlib import Path
import json,statistics,hashlib,subprocess,shutil
R=Path('/workspace/BNT');D=R/'docs/m2-e/e4/architecture-prototypes';O=Path('/workspace/deliverables');E=D/'evidence';E.mkdir(exist_ok=True)
def load(p):return json.loads((O/p).read_text())
def table(head,rows):return '| '+' | '.join(head)+' |\n| '+' | '.join(['---']*len(head))+' |\n'+'\n'.join('| '+' | '.join(str(v) for v in r)+' |' for r in rows)+'\n'
def num(x):return f'{x:,.1f}'
comm=load('e4-architecture-final/communication.json');pages=load('e4-architecture/representation.json');templates=load('e4-architecture-templates/templates.json');hist=load('e4-architecture/history.json');pub=load('e4-architecture-final/history-publication.json');val=load('e4-architecture-validation-retained/communication.json');mem=load('e4-architecture-final/memory.json');vmem=load('e4-architecture-validation-memory/memory.json');cachemem=load('e4-architecture-cache-memory/memory.json')
rows=[]
for p,t in zip(pages['cases'],templates['cases']):
 rows.append([p['id'],len(p['rows']),num(p['legacyTotalBytes']),num(p['prototypeTotalBytes']),num(t['prototypeTotalBytes']),f"{100*(1-t['prototypeTotalBytes']/t['legacyTotalBytes']):.1f}%",num(p['rows'][-1]['legacyPackMs']),num(t['rows'][-1]['prepareMs'])])
crows=[]
for c in comm['cases']:
 for op in ['advance','official','coldReconstruction','backup']:
  a=[m for m in c['metrics']if m['side']=='baseline' and m['operation']==op];b=[m for m in c['metrics']if m['side']=='reference'and m['operation']==op]
  if op=='advance':a=a[-2:];b=b[-2:]
  for i,(x,y)in enumerate(zip(a,b)):crows.append([c['id'],op+(' #'+str(i+1)if len(a)>1 else ''),num(x['ms']),num(y['ms']),num(y.get('preparationMs',0)) if 'preparationMs'in y else 'not isolated',num(y.get('readMs',0))if 'readMs'in y else 'not isolated',num(y.get('commitMs',0))if 'commitMs'in y else 'not isolated'])
variants=[]
for folder,title in [('e4-architecture-combat','worker reference'),('e4-architecture-cache-combat','two-entry codec'),('e4-architecture-validation-late','exact controller memo')]:
 c=load(folder+'/communication.json')['cases'][0];a=[m for m in c['metrics']if m['side']=='baseline'and m['operation']=='advance'][-2:];b=[m for m in c['metrics']if m['side']=='reference'and m['operation']=='advance'][-2:]
 variants.append([title,' / '.join(num(m['ms'])for m in a),' / '.join(num(m['ms'])for m in b),c['compare']['exactRecordBytes']])
vr=[]
for op in ['coldSeed','nativePrepare','official','coldReconstruction','backup']:
 a=next(m for m in val['cases'][0]['metrics']if m['side']=='baseline'and m['operation']==op);b=next(m for m in val['cases'][0]['metrics']if m['side']=='reference'and m['operation']==op);vr.append([op,num(a['ms']),num(b['ms'])])
text='''# BNT M2-E4 — Prototype Comparisons and Performance Results

## Scope and method

Production runtime is `b8c090057052ac03bbed73d9487093da61381451`. Prototype source commit inventory is in the evidence manifest/source verification; no production file, accepted reference, dependency or stored owner save changed. Experiments compare actual source-domain fixtures and original validators; they are not an alternative racing engine.

Controlled latency runs were sequential, with no other test/benchmark job running. Node 24.22.1 and Linux Chromium 156.0.8078.79, approximately four-CPU managed environment. Browser comparisons pair baseline first and candidate second on identical input records/configuration in separate throwaway databases. Operations are single observations, not statistical estimates or service-level guarantees. JIT, GC and host variability remain. Inspector memory diagnostics run separately and their elapsed times are not latency benchmarks.

Default single-event fixtures are **Pure**, Clear weather, one lap: one entrant short oval, four C01 entrants, eight oval entrants, eight generated Long Rally entrants (generator seed 145), plus the same Long Rally at tick 2000. The factory defaults must not be mislabeled Combat. Explicit additional **Combat** Long Rally comparisons are shown below. Retained twelve-event data contains mixed Pure/Combat formats.

The graph dense workload has seventeen 25-tick snapshots through tick 425, with a paused Conserve Strength input at tick 100. The browser dense workload has twelve 25-tick advances plus a paused Conserve Strength input at tick 100, through tick 300. Both baseline/candidate use identical counts within each comparison; do not equate these different microbenchmarks.

## Lossless representation — total bytes across all snapshots

'''+table(['Fixture','Snapshots','Legacy transports','Positional pages','Node templates','Template saving','Last legacy pack ms','Last template prepare ms'],rows)+'''
Positional pages fail: reference-index changes invalidate most pages, increase storage and often preparation cost. The failed implementation and results are retained.

Node templates reduce serialized snapshot-series storage, preserving separate object occurrences and original alias layouts. Example: the late Pure Rally series is 5,219,444→3,101,579 bytes; the dense series is 2,307,977→938,766 bytes. These are experimental archives including manifests and retained template chunks, not full production session/backup containers. Every decoded snapshot is compared with the complete original legacy wire and native digest; no event/journal pruning occurs.

The first late template encode is not faster (about 869 versus 859 ms); the later encode is about 509 versus 847 ms. Full graph traversal, archive reconstruction and descriptor validation remain. This does **not** demonstrate a faster complete durable transaction: the accepted session fingerprint still requires its legacy computations. Storage savings do not justify deploying a new native format without a version/integrity/migration design.

Raw simulation timing is separately recorded per row in `representation.json`/`templates.json`, and is the original `step()` including normal digest checkpoints. No simulation algorithm was optimized or changed. Candidate code encodes the same native state after stepping; a separate simulated engine was not introduced.

## Existing-format worker reference — milliseconds

'''+table(['Fixture','Operation','Main-owned baseline total','Worker-owned total','Worker prepare','Worker IDB read','Worker IDB commit'],crows)+'''
Request messages are approximately 100 bytes for advance rather than 0.5–4.4 MB full-snapshot messages in active cases, or approximately 30.3 MB in the retained fixture. This removes main-thread data copies, not database reads or native validation. The complete logical records remain byte-identical in every paired case.

The reference's inspection response deliberately contains phase/tick rather than the complete current UI DTO. This is not a completed UI integration. Candidate backup timing generates/validates a complete backup but returns only a byte count; that row must not be called a fully equivalent download timing. The separate memory run transfers and restores actual complete backup text on both paths.

Main-thread Long Tasks were observed and associated with measured operation windows. Retained official publication had an observed 195 ms task in the baseline and no observed >=50 ms task in the reference. Absence of an observed task does not prove an exhaustive <50 ms bound. Full-record readback/JSON comparison is a test oracle outside the measured operation windows; whole-harness maxima include that work and must not be attributed to ordinary gameplay.

## Explicit late Long Combat Rally — last two 100-tick durable advances

'''+table(['Isolated variant','Paired baseline ms','Candidate ms','Exact logical bytes'],variants)+'''
Late durable advances remain multiple seconds; the 500 ms aspirational target is not met. A second exact-byte compression entry shows no consistent benefit attributable to the extra cache. It passes wire/corruption/eviction tests but adds retained memory; retain the accepted production cache.

## Retained-history index

The unchanged-byte generation-change fixture performs all twelve decoders on first load: baseline about 20.6 s, indexed about 20.5 s. For subsequent generation changes with the exact same logical records, full baseline revalidation is about 20.1–20.4 s; the private index is about 26–32 ms and reuses all twelve validated record bindings. Reset returns to all twelve decoders and about 20 s. This is a conservative metadata/head-change fixture, not a claim that ordinary already-warm operations always revalidate all records today.

The **actual isolated final-publication** fixture changes the career and one session. Full baseline reconstruction: '''+num(pub['baselineReconstructionMs'])+' ms. Indexed reconstruction: '+num(pub['indexMs'])+''' ms, with one decoder and eleven exact-byte/binding reuses. Reset performs all twelve decoders again ('''+num(pub['coldIndexMs'])+''' ms). Career/protected-history validation is retained when the career bytes change; this is not a persisted validation stamp or faster first-open cold recovery.

## Repeated full controller-state validation — strongest bounded result

Source `controller.js:79–91` reconstructs the complete receipt lineage on validation. The private exact-state experiment avoids duplicate work only after the same complete data graph has passed that original validator; each distinct state still takes the full path. Keys include all fields, revisions, descriptors and alias topology, not just a caller digest. Changed/unsupported graphs and cold unique states are not trusted.

'''+table(['Retained operation','Baseline ms','Exact-state worker memo ms'],vr)+'''
Official publication falls from about 15.3 to 6.6 seconds in this paired observation, while every logical record remains exact. It remains above a subsecond target. Late advancing does not materially improve because native session work still dominates. The byte-golden two-entry codec experiment and this domain-validation memo are distinct experiments; do not attribute one result to the other.

## Disposition

Recommend a bounded production-integration proposal for private exact-state validation reuse under unchanged formats, with full regression and memory gates. Worker ownership is useful for responsiveness; the private session index is useful for appropriate warm reconstruction misses. Neither is a demonstrated cure for all late-race latency. Reject positional pages; do not integrate the larger codec cache. Keep native-template transport and physical raw-record factoring behind explicit format/storage authorization.
'''
(D/'BNT_M2-E4_Prototype_Results.md').write_text(text)
# Memory report
mrows=[]
for dataset,title in [(mem,'existing-format actor'),(vmem,'actor + exact-state memo'),(cachemem,'actor + two-entry codec')]:
 for c in dataset['cases']:
  for op in c['operations']:mrows.append([title,c['spec'],c['side'],op['operation'],num(op['peakMain']/1048576),num(op['peakWorker']/1048576)])
srows=[]
for c in comm['cases']:
 a=c['rawArchive'];srows.append([c['id'],a['heads'],a['legacyBytes'],a['factoredBytes'],f"{100*(1-a['factoredBytes']/a['legacyBytes']):.1f}%",a['uniqueRecords']])
text='''# BNT M2-E4 — Memory and Storage Analysis

## Measurement boundaries

Main and dedicated-worker isolates are measured separately with CDP `Runtime.getHeapUsage`, attempting samples every 100 ms during operations. Reported isolate peaks are **sampled lower bounds**, not exact instantaneous maxima. DevTools sampling and forced GC alter timing and possibly retention; do not use these runs as controlled latency comparisons.

OS renderer `VmHWM` is separately retained per PID: it covers the renderer process lifetime, combines main/worker/native allocations and cannot be attributed to one isolate or one individual operation. RSS, V8 heap, backing stores and logical encoded bytes are different measures and must not be added or substituted carelessly. Only Linux Chromium was available; no Windows/Edge/low-memory hardware peak is established.

## Sampled peaks — MiB

'''+table(['Variant','Workload','Side','Operation','Main isolate','Worker isolate'],mrows)+'''
Worker ownership consistently lowers the main-isolate burden in these fixtures, but can move pressure into the worker. In the original paired retained restore, sampled main falls about 260.7→117.1 MiB while worker rises about 533.0→631.6 MiB. In the separate exact-state-memo pair, retained restore samples are about 231.4/596.7 MiB baseline main/worker versus 117.1/432.5 MiB candidate. These are separate inspector runs; do not claim a statistically proven renderer-RAM reduction.

Large renderer process lifetime high-water marks remain around 1.6–1.8 GiB in the retained runs. Full-text backups/restores still duplicate substantial representations transiently. This is a material production acceptance risk; moving work off-thread is not a total-memory solution.

## Retention, eviction and repeated events

After service reset, release of harness-owned fixture/backup strings and explicit GC, retained-workload main heaps settle near 2 MiB and workers near 9–12 MiB. Operation `reset` *peak* rows above are not the post-GC retained heaps. The evidence contains both, avoiding a false leak claim based on a temporary high sample.

Three consecutive real one-entrant championship events use Oval/Circuit/Rally and the original native engine, publication and condition carryover. Worker peaks remain in roughly the 43–56 MiB range rather than retaining one complete decoded native history per event. This is limited evidence, not an indefinite-career leak proof.

The two-entry codec stress pair retains approximately 25.6 MiB worker heap after GC versus 14.1 MiB baseline and does not establish a reliable latency benefit. Do not integrate it. Both entries share a 32 MiB decoded-text accounting budget; accounting is not a total-JS-heap bound.

The private history index has twelve metadata/raw-string bindings and **zero decoded native-history graphs**. In the Node explicit-GC diagnostic, heap after cold validation is about 55.2 MB, after warm reuse about 55.2 MB and after index reset about 52.1 MB; harness-owned raw fixture strings and the original codec's bounded cache remain. RSS stays high after allocations and is not proof of live retained objects.

The template dictionary cache has about 12.86 MB accounted raw key text in the late fixture; eviction reduces sampled Node heap from about 78.45 to 69.02 MB while stored compressed chunks remain about 1.85 MB. Decode after eviction is exact; verified rebuilding is tested. The rebuild heap sample also holds a separately reconstructed proof state, so it is not an isolated cache delta.

Experimental data stores/dictionaries are bounded and fail explicitly at capacity. No source journal, receipt, protected identity or authoritative save is evicted. These research budgets are not new game policy or increases to approved logical limits. Memory-safe production keys should avoid holding unused transient graph objects through long validator calls; that improvement is proposed, not claimed as measured here.

## Lossless raw-record factoring across actual current/previous heads

'''+table(['Fixture','Heads','Existing body-array bytes','Factored body bytes','Saving','Unique bodies'],srows)+'''
The retained fixture reduces the record-body portion from 60,527,476 to 32,810,633 bytes (about 45.8%), preserving fourteen unique strings and both heads' ordered references exactly. This is not an implemented IndexedDB backend or a complete new backup container. Generation/runtime/witness/restore metadata must also be retained by any future design.

A separate identical-head fixture shows an approximately 50% upper bound on body reuse. It is explicitly not a simulated changed generation. Do not use it as the ordinary twelve-event saving.

Current per-record/checkpoint 8 MiB, decoded graph 32 MiB/200,000 nodes, journal 1,000, receipt 1,000, protected-identity 2,000 and complete-backup 256 MiB limits remain unchanged. No evidence is dropped and no limit is increased to obtain these figures.

Browser quota estimates in supplemental worker comparisons cover the **combined origin**, including both throwaway baseline/candidate databases. They are not per-database physical measurements, available-capacity guarantees or portable Windows quotas. Actual stored logical bytes and experimental factoring bytes are reported separately. The prototype does not establish unlimited storage or maximum-field twelve-Long-Rally capacity.

## Recommendation

Gate production integration on memory and direct-file tests as well as latency. Prefer bounded pure-data reuse over holding additional full decoded histories. Preserve the current format until physical factoring and writer-fencing/rollback are explicitly approved. Native-template archive size gains alone do not establish lower runtime peak memory.
'''
(D/'BNT_M2-E4_Memory_Storage_Analysis.md').write_text(text)
print('results and memory reports generated')
