from pathlib import Path
import json,hashlib,subprocess,csv
R=Path('/workspace/BNT'); D=Path('/workspace/deliverables/bnt-m5-d1'); E=D/'evidence'
def load(name,default=None):
 try:return json.loads((E/name).read_text())
 except:return default
artifact=D/'Blood-and-Thunder-M5-D1-Playable.html';blob=artifact.read_bytes();sha=hashlib.sha256(blob).hexdigest()
base='6f01da6d9cc0a79fecf9d38cd55989e17fb2651c'; branch=subprocess.check_output(['git','branch','--show-current'],cwd=R,text=True).strip()
cap=load('capacity.json',{});real=load('capacity-idb.json',{});native=load('native-lifecycle.json',{});repeat=load('native-repeat.json',{});refs=load('references.json',{});volume=load('generation-volume.json',{});fault=load('worker-faults.json',{});idb=load('idb-proof.json',{});quota=load('real-quota.json',{});smoke=load('smoke-browser.json',{});clock=load('championship-clock/parity.json',{})
node=(E/'verify-full-node.log').read_text() if (E/'verify-full-node.log').exists() else (E/'release-node.log').read_text() if (E/'release-node.log').exists() else ''
import re
np=re.search(r'ℹ pass (\d+)',node);nf=re.search(r'ℹ fail (\d+)',node);node_result=f'{np[1]} passed, {nf[1]} failed' if np and nf else 'RUNNING: see release-node.log; no final pass claim yet'
header=f'''Baseline HEAD: `{base}`. Branch: `{branch}`. Implementation is an **uncommitted working-tree candidate**; no implementation/documentation commit was created. Source identity is the delivered `BNT_M5_D1_Source_Manifest.json`, not HEAD alone.\n\nArtifact: `{artifact.name}`; **{len(blob):,} bytes**; SHA-256 `{sha}`. Accepted M4 artifact remains unchanged (SHA-256 `d77e49e40457c5de0255e3c95779941bec67023a4760248a69760f60b7a8d60c`).\n'''
def write(name,text):(D/name).write_text(text.strip()+'\n')
write('BNT_M5_D1_Implementation_Report.md',f'''# M5 Delivery 1 — Implementation report

{header}
## Assessment

**CONDITIONAL — Delivery 1 candidate for owner testing; not owner acceptance.** The new current-state authority, renewable Home assets and fixed rival foundation are integrated. Actual native championship completion, withdrawal, forced elimination, settlement, archival checkpoint and cold reconstruction have been demonstrated. Remaining conditions are large-history responsiveness, the 128-rival naming stress boundary and Windows direct-file acceptance. See the capacity report for exact supported evidence; engineering stress fixtures are not claims of hundreds of played championships.

## Authority and baseline verification

Read START_HERE, OWNER_POLICY, IMPLEMENTATION and ACCEPTANCE before production edits, and the included M5-A/Competition Audit reports. OWNER_POLICY takes precedence. Verified 240 M4 source/changed-file hashes against the accepted manifest and the accepted playable hash. Baseline full suite was executed in a frozen `git archive` checkout: **888/888, exit 0**. Only the already-untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` existed before edits; preserved untouched. No branch, commit, merge, push or deployment occurred.

## Architecture and changed contracts

- `src/career/m5/current.js`: independent schema-7 current validator and native reducer boundary; no stripped-origin call to schema-6 validation. Native schema-6 validation is used only once for unpublished pristine starting-package creation. Retains native graph, wage-conservation, eligibility, economy and frozen championship rules.
- `src/career/m5/envelope.js`: hashed current checkpoint plus at most 128 native transition receipts; cold loads replay this tail and compare exact receipts/current hash.
- `src/career/m5/history.js`: immutable protected operation, settled championship and paid-wage pages; contiguous revisions, financial continuity and archive/index cross-links. Unpaid obligations stay live.
- `src/career/m5/recovery.js`: explicit previous-checkpoint recovery with newer absolute career and maintenance revisions and a zero-Gold maintenance record. Previous game progress can be lost only through the disclosed, confirmed recovery action.
- `src/persistence/m5-store.js`: synchronous Map **preparation**, not a replacement for awaited browser durability. Preserves native active-team, sidecar and command contracts.
- `src/persistence/m5/indexeddb.js`: new namespace, immutable content-addressed record bodies, reference-only current/previous roots, independent checksummed monotonic clock, generation/exact-read-set CAS, strict atomic transactions, reachability GC, chunked restore staging.
- Existing E4 inline worker/coordinator routes select the new store/backend only for the M5 build/family. Worker preparation is never durable acknowledgment. Generic caller-supplied historical options are rejected; protected official and settlement operations keep their capability checks.
- `src/career/m5/generation.js` and the compiled catalog: deterministic Home factory, separate identity/stat/personality streams and fixed per-tier rival factory. Native quotes/contracts/valuation and generic beast physics remain authoritative.
- Existing management, startup/slots and presentation adapters expose resolved identities and correct prices; the existing P1 in-memory race path is retained.

See `BNT_M5_D1_Changed_Files.csv` for the complete source, tests, build and content inventory with hashes. No simulation/physics/AI/track implementation or historical golden reference was modified. No dependencies were installed or updated.

## Owner policy implementation

| Policy | Delivered behavior and evidence |
|---|---|
| New save family | Namespaced schema 7; no converter, silent adoption or modification of M4 saves; clearly rejected old imports |
| Home renewal | One new batch only on final archive after qualifying participation; no page-open, purchase, reload or failed-operation reroll |
| Any voluntary withdrawal | No Home renewal, no Completion Bonus, no refund; AI completes schedule; native wages/liabilities still assessed |
| Insufficient funds | Native allocation remains in force: test paid 65 of 95 and retained 30 arrears, treasury 0; no new fine or fictional debt |
| Hard elimination | Native D2/eligibility and AI continuation; after actual participation terminal archive renews Home |
| Veteran Recruiters | Permanent/no slot; M5-only cost 6 LP; one extra native Premium driver immediately and once each full renewal, no replacement on acquisition |
| Generated identity | All 8 nations/13 ancestries/9 species; initial 23 authored source identities retained; starting package mechanical grants untouched |
| Fixed rivals | Lazy four-organization persistent tier factory, frozen native snapshots, healthy next-championship birth baseline; no scaling/development |
| Delivery 2 boundary | Generated competition definitions, local entrants, hybrid field injection, regional inventories, venues and generated progression remain deferred |

## Functional proof and validation

- Packaged browser: new career → native-priced generated equipment purchase → registration → two real native races → Run/Completion selections → settlement/archive/renewal → browser reload. {len(smoke.get('groups',[]))} groups; `{smoke.get('result','pending')}`. No ordinary playback writes.
- Native worker/domain: six policy scenarios, including an actual eight-entrant seven-event championship across Oval/Circuit/Rally. Synthetic qualification/condition inputs are explicitly tagged; races/results themselves are native.
- Eight consecutive two-event native championships, with real contract renewal and normally earned LP. Recruiters purchased at 6 LP, then 24 offers verified immediately, on later renewal and cold reload.
- Current final Node result: **{node_result}**. Dedicated IDB/fault/quota counts and raw process exits are in the test evidence.
- Native historical references and payroll references unchanged; no expected checksum edited. Two identical final builds; embedded worker/viewer, no external runtime dependencies.

## Limitations and follow-up

The 500/5,000/50,000/100,000 history workload is synthetic representation stress, not executed gameplay. A separate 100,004 identity factory run is actual generation. Actual repeated native horizon is eight consecutive championships; largest real field proof is eight entrants for seven events. No 12-event catalog fixture was invented: current permanent competition definitions top out at seven events.

A 128-organization stress factory exhausts approved name combinations and rejects safely; 4 and 32 work. This is not a gameplay cap or a request to invent new names. Full integrated competition balance is not claimed. Existing competition-only “Rival RU” labels remain a Delivery 2 field-adapter concern; player-owned/new market assets use resolved names.

Large-history main-thread and total latency are disclosed in the capacity report. Capacity denial leaves the last durable generation intact. Windows Chrome/Edge `file://` acceptance remains outstanding; managed Chromium blocks the URL by administrator policy. No Delivery 2 implementation is authorized by this candidate.
''')
write('BNT_M5_D1_Persistence_Contract.md',f'''# M5 Delivery 1 — Persistence contract

{header}
## Family and compatibility boundary

`BNT-M5-current-save`, envelope version 1, family `m5-current-v1`, mechanical current schema 7. This is Owner Option B, **not a schema-6 migration**. Old HTML and old storage remain untouched. M5 uses `BNT-M5-D1-*` databases/slot catalog, does not adopt legacy Web Storage, and rejects foreign/unsupported families. No old-save converter is shipped. Existing M3 presentation sidecar-v2, immutable identity-pack pin and mutable commentary preference are validated and transported intact within M5.

## Serialized records

```json
{{"kind":"BNT-M5-current-save","version":1,"family":"m5-current-v1",
 "base":{{"value":"<validated schema-7 checkpoint>","hash":"<canonical SHA-256>"}},
 "tail":["<native protected receipt, at most 128>"],
 "currentHash":"<reconstructed current SHA-256>","presentation":"<validated sidecar or null>"}}
```

Current `m5` fields: family, checkpoint, baseRevision, finance, acks, historyPages, historyTail, lastArchive, marketEpoch, rivals, catalogPin, identities, initialization, firstRevision, marketReservations, marketConsumed. Initialization retains the protected original starting grant. Finance retains opening plus net command credit/debit audit totals, with exact nonnegative native Gold conservation; native reducers remain the sole price/effect authority. The counters are **not** an alternative gross-income accounting system.

History page: `{{kind:"M5-protected-history-page",version:1,profileId,careerId,ordinal,previous,rows}}`; logical key `bnt.m5.history.<canonical fingerprint>`. Rows are typed operation, championship or paid-wage facts. Page sealing threshold: 128 rows or 512 KiB; every logical record must remain ≤8 MiB. Settled summaries retain exact official classifications/conditions/effects/provenance, participation, identities, settlement, wages and selection facts; no lossy result synthesis. Unsettled/native proof evidence is never compacted. Archive indexes are cross-checked against protected summaries.

Root: `{{format:"m5-record-root-v1",version:1,generation,profileId,careerId,careerRevision,maintenanceRevision,recordsHash,runtime,references:[[logicalKey,bodySHA256]]}}`. Bodies are immutable `m5-body-<SHA256>` strings. Head and previous are reference-only, not duplicated complete history graphs. `m5-clock` independently checksums the absolute writer chronology and root fingerprints, permitting detected current-root loss to use explicit valid-previous recovery. Hashes detect corruption; they are not anti-cheat signatures or substitutes for native validation.

## Command and publication authority

Native operation IDs are scoped to source revision (`m5-op-<revision>-<request fingerprint>`); championship births use `m5-run-<revision>-<request fingerprint>`. Recent acknowledged requests are retained up to 64 entries. Identical retained retries return the committed result; conflicting IDs reject. An evicted, obsolete request rejects on absolute revision, never becomes a new purchase. Ownership, maintenance revision, transaction type, native quote/effect, current/sidecar revisions and generation remain checked.

Protected transitions: prepare in worker → validate candidate → backend checks exact generation/read-set → one strict IDB transaction writes new bodies, roots and clock → await `oncomplete` → acknowledge worker. Web Locks coordinate where available; IDB CAS is the safety boundary even without them. No unawaited asynchronous `setItem`. Official races retain native durable prepare → capability validation → single official career commit. Gold, D2, points, entitlements, rewards and native settlement are not split into independent authoritative writes.

## Retention, cold validation and recovery

A checkpoint folds after 128 transition receipts or finalized archive. Current live assets, unpaid wage obligations, progression, identities and active championship remain current. Tail size never grants permission to delete semantic once-only facts. Protected history stays paged, with ordered financial continuity and current indexes checked on cold open. Worker reuse is private and exact-byte/generation bound, never a caller token.

Only a completed, settled, selection-complete archived championship can retire detailed native session records from the **new** current root. Previous root still retains its referenced bodies. GC runs after publication and marks current, previous and one quarantined recovery root; only unreachable bodies are deleted in its own atomic transaction. Interrupted GC cannot invalidate a reachable generation.

Cold corruption does not silently fall back or reroll. Valid previous is disclosed with identity/scope warning and explicit confirmation. Recovery restores prior game facts but publishes generation > discarded head, careerRevision > discarded head and maintenanceRevision > discarded head, recording the skipped branch as `m5.recover` with zero financial delta. Missing/corrupt required previous data or clock fails closed; external complete backup is then needed. Complete destruction of browser storage cannot be recovered without an external backup.

## Backup, restore and staging

Player exports use complete M5 backups; the old career-only JSON path is not falsely advertised as sufficient for paged history. Format: `BNT-M5-complete-backup`, version 1; payload includes owner IDs, source generation/hash, runtime, root digest, restore receipts, current references, optional previous root and deduplicated exact record bodies; SHA-256 protects the transport. Cold import validates both generations, all required pages/session authority, pins, protected financial history and identity links before staging.

Logical-record limit: **8 MiB unchanged**. Complete container limit: **256 MiB unchanged**. Root references are bounded at 2,001; restore receipts at existing 2,000. Temporary restore text is split into ≤1,048,576-character chunks, with total characters/count/full-text SHA in a small stage manifest. All chunks and manifest are staged atomically; no partial playable state. This avoids Chromium's observed ~133 MB single structured-value ceiling without raising a logical record limit. Resume requires every chunk and exact reconstructed hash. Activation writes one complete new generation and removes staging chunks in the same transaction. Failure/quota abort preserves source and retryable stage; interruption after activation is found through committed identity/receipt. Unrelated slots are never replaced. Older backup rollback is rejected; explicit prior-generation recovery is separate and disclosed. Same-backup retry is idempotent.

## Race and capacity policy

Ordinary native P1 race advancement and Signs stay in memory; no per-tick checkpoint or receipt. Closing loses unfinished ticks/Signs and restarts the exact frozen seed/configuration at tick 0. Completed official results and between-race decisions stay durable. Manual Save verifies committed boundaries, not unfinished playback.

Pre-registration current-state size must be ≤2 MiB, reserving 6 MiB of the 8 MiB current-record budget for active championship growth. Oversized preparation/backup/quota errors reject without fee/partial effects. This is a conservative engineering guard, not an unlimited-career promise. Large-history serialization/read-set work remains measurable; see capacity report.
''')
write('BNT_M5_D1_Generation_Integration_Report.md',f'''# M5 Delivery 1 — Generation integration

{header}
## Source catalog and pin

Copied the actual candidate v1.0 from `/workspace/deliverables/bnt-m5-content-v1` into `content/m5/v1`, preserving the original candidate. Compiler `python3 scripts/m5-d1/compile-content.py` validates strict JSON (duplicate keys/nonfinite values rejected), the supplied schemas, provenance/source hashes, IDs and weighted cross-references. **256 records, 16 families** compile into `src/career/m5/content.generated.js`.

Pin: version `1.0.0`, digest `4682637795352a0ae91b15eb67f686d48a032807244e65708cc1dce9940ca54b`. Unsupported/mismatched pins fail; no silent regeneration. All eight nations, thirteen ancestries and nine canonical beast species are supported. Species remain metadata on the accepted generic-beast native adapter, not nine new physics systems.

## Factories and native bindings

`generateIdentity(context, options)` uses separated deterministic naming/stat/personality domains and sorted weighted choices. Inputs include category, tier, native role, nation/ancestry/species constraints and used names. Candidate distributions/quality and modest ancestry deltas are combined then clamped to the native validated ranges. Ancestry is not a personality coefficient. Canonical origin and resident nation are distinct; nationality/ancestry restrictions and import metadata are preserved. Missing profiles/name exhaustion reject after bounded retries; no generic fallback or time/race-RNG dependency.

`homeBatch(careerId, epoch, {{recruiters,existingNames}})` resolves the existing 23 native market slots; Recruiters adds one Premium **driver**. Driver and beast candidate attributes/Q/wageQ feed native templates, `offerPrice`, contract terms and acquisition/capacity checks. Chariot/equipment/staff mechanical templates and pricing remain native. Only Handler, Mechanic and Physician roles are created; expertise is descriptive, with no unapproved skill surcharge or new effect. Authored initial identities retain their 23 source mappings and bios. Starter package assets gain resolved names while preserving actual grants, attributes, acquisition values and personality.

Market offers and resolved metadata are persisted together. `market.acquire` uses the same authoritative native preview/price/contract/financial effect and transfers the identity to the owned asset. Acquired offer is removed; no immediate replacement. Failures/reloads/page navigation do not reroll. Renewals commit a new epoch only at qualifying final archive, retaining current owned-name reservations and the protected old offer/acquisition history.

## Owner-specific renewal and Recruiters proof

Normal conclusion/forced elimination after participation renew once at archive, not at finish display or each event. **Any** voluntary withdrawal leaves epoch and Home batch unchanged, preserves earned entitlements, gives no Completion Bonus/refund and retains real wage commitments. Native insufficient-funds proof retained 30 arrears after paying available 65 of assessed 95.

M5 Recruiters costs 6 LP, permanent/no slot; ordinary acquisition still costs native Gold. Eight real consecutive championships earned LP normally; purchase at six LP added one Premium driver and later full renewals contained 24 offers, cold-validated. No regional-market benefit. All other upgrade prices/effects remain accepted M4.

## Fixed rivals and Delivery 2 seam

`rivalPopulation(careerId,tier,{{count:4}})` lazily creates stable organizations/member IDs and native configurations from pinned difficulty/identity recipes. No player-relative scaling or automatic development. `freezeRival(profile, entrantId)` deep-clones the healthy birth native state and maps persistent organization/member IDs to native race entrant ID. Tests confirm recurrence, personality/stat stability, isolation of a damaged active clone and healthy next snapshot.

The population is durable and validated in the career. **Existing native competition entrant fields are retained in D1**; the hybrid/local selection and frozen-field injection adapter belongs to Delivery 2, as explicitly permitted by OWNER_POLICY. Do not mistake the factory proof for already-generated production championships. Existing competition-only generic labels remain deferred; no generic newly owned/Home asset names are used.

## Validation and balance limits

- All 8/13/9 forced paths and all 81 species pairings use native two-beast legality.
- Actual volume run: **{volume.get('actualFactoryIdentities','pending'):,} identities**, {volume.get('homeBatches','pending')} complete batches; all canonical paths reached, no lifetime candidate cache retained.
- New M5 deterministic golden vectors: Home `b4e461e8b3af6d16b4e8d24482a0ebdc5f349fb9262c4b7778a22a33cd258466`; driver `1122bf75fb7b841b5cc466f01346ce612910b36b770d87185d563d58944cb56f`. These are additive M5 factory vectors, not replacements for historical native references.
- 32-organization stress succeeds; 128 safely fails approved-name capacity. Shipped count is four; expanding naming content or pools is not silently assumed.
- Real Pure/Combat Oval/Circuit/Rally outcomes and unchanged same-seed native captures are tested. Provisional distributions remain provisional balance; no integrated D2 full-field tuning claim or new surcharge/economy formula.
''')
write('BNT_M5_D1_Local_Acceptance_Checklist.md',f'''# M5 Delivery 1 — Windows offline owner acceptance

{header}
## Setup

1. Keep the accepted M4 HTML and backups. Use this **separately named** candidate in a new test folder; do not overwrite old HTML. No M4-save converter is included.
2. Verify the hash in PowerShell: `Get-FileHash .\\{artifact.name} -Algorithm SHA256` (must equal the SHA above). Disconnect network. Double-click in current Windows Chrome, then repeat in Edge. No adjacent files, server, installer or network is required.
3. This checklist is **pending owner execution**. Managed Linux Chromium returned `ERR_BLOCKED_BY_ADMINISTRATOR` for `file://`; HTTP/browser diagnostics do not certify Windows acceptance. If the browser denies IndexedDB/worker/local storage, retain the explicit error and report browser version/context; never treat a failed save as complete.

## New career, owned assets and persistence

- Create each of the five available starting packages in a separate test slot. Verify stable/owner names, package Gold/roster/facilities, initialized Market/Finances/Championships, Options/Help, no manual system activation.
- Market: 23 offers, proper names/identity labels, actual prices, condition, contracts/wages and eligibility. Buy one affordable item through its card; one debit and one owned asset, source offer disappears without replacement. Repeat confirmation/reload: no duplicate asset/debit or reroll.
- Roster & Barn: driver/chariot activation, both beast slots, third-beast explicit replacement and Cancel, reload selection persistence. Registered unit remains frozen.
- Create/load a second career; verify completely independent balances/IDs/selections. Existing M4 game still loads its own untouched careers. An M4 import into M5 is clearly rejected rather than modified.

## Complete native championship

- Select Dustroad or another eligible permanent event, inspect fee/schedule/awards and confirm once. Verify one fee. No change on cancel or invalid registration.
- Manually start, play/pause/change speed, queue Signs and observe approved start/finish or Rally activation. Check tactical map/radio/standings and unchanged three-opportunity accounting unless native upgrades alter it.
- During an unfinished race close/reopen the HTML. It must offer the same registered race from original tick-0 seed/config, not mid-race continuation or a reroll. Previously committed purchase/fee stays committed; unfinished Signs/ticks are lost by policy.
- Finish each actual race and publish once; make Run choices when offered. No skipping pending choice/uncleared result. Continue next event manually, then final settlement and eligible Completion choice. Verify wages/contracts/recovery, exact rewards and archive/Last Event.
- Home inventory renews once after qualifying archive; reload/navigate does not renew again. Permanent Legacy ownership and active loadout remain correct. Replay/repeated results clicks do not duplicate Gold, conditions, points or rewards.

## Withdrawal, obligations and Recruiters

- In a separate career withdraw before starting, explicitly confirm. Rivals complete the schedule. No refund/Completion Bonus/Home renewal; legitimate wages due at terminal settlement.
- Repeat after a completed nonfinal race: earned legitimate rewards remain, but no new renewal or termination bonus. Verify native insufficient-funds warning/arrears rather than invented fees or forgiven wages.
- In ordinary play earn at least 6 LP. Buy Veteran Recruiters in the Legacy Market: exactly six LP spent, permanent/no slot, one extra Premium driver now, native Gold cost. Reload and complete another qualifying championship: exactly 24 Home offers, no repeated bonus on page navigation/purchase.

## Backup, recovery, deletion

- Options → Save verifies committed state, without claiming unfinished playback is saved. Export complete M5 backup before and after a championship; keep both externally.
- Restore the current complete backup with explicit confirmation into the intended compatible slot; verify identities, batch, active team, protected history and official results. Test new empty-slot import as well. No unrelated slot changes.
- Retry same backup: no duplicate assets/awards; foreign/corrupt/unsupported/older rollback backup must reject safely. Never manually edit a real owner backup to test corruption—use a copied test file/profile.
- If current checkpoint becomes corrupt in a disposable test profile, recovery must disclose the valid previous identity/progress and require confirmation. Confirmed recovery activates newer writer chronology; no automatic silent fallback. Missing previous/clock requires an external complete backup.
- Delete only a disposable test career through the existing confirmed Options flow; other slots and old M4 storage remain intact.
- Close browser entirely and reopen offline; verify committed state survives. Record storage-denial/quota errors accurately. Browser eviction/private-window deletion cannot be prevented; external backup remains necessary.

## Acceptance record

Record Windows version, Chrome/Edge version, HTML hash, test slot/package, pass/fail per section, exact error text and any screenshots. Do not accept large-history responsiveness from the small test alone; synthetic capacity timings/limits are disclosed separately. Delivery 2 is not part of this candidate.
''')
write('BNT_M5_D1_Delivery2_Handoff.md',f'''# M5 Delivery 1 → Delivery 2 handoff

{header}
**Delivery 2 was not started. Owner review/acceptance and a separate authorization remain required.**

## Verified seams

- `generateIdentity`, `homeBatch`, `rivalPopulation`, `freezeRival`, `CONTENT_PIN` in `src/career/m5/generation.js`.
- Schema-7 current-state native transaction boundary, source-revision operation/instance IDs, history pages and explicit recovery chronology in `src/career/m5/`.
- Awaited IDB commit and complete backups through the existing coordinator/worker; old production-family saves not migrated.
- Existing permanent catalog, registration, D5, D2 Mapping v1, M4 Run/Completion/Legacy/native finance/payout authority remain the only gameplay paths. Ordinary P1 advancement stays in memory.

## Intentionally deferred

Generated championships/opportunity epochs, local location-weighted entrants, persistent-rival field selection/injection, regional market permission/stock, venues and generated economic progression contexts. No signature trophy/unlock equivalence was invented. Separate generated identity from native economic tier; do not fall back to entry-level prizes or grant signature trophies for generic wins. Preserve any-voluntary-withdrawal no-renewal/no-bonus/no-refund/native-liability policy.

## Capacity and testing prerequisites

Read the capacity report before promising a lifetime horizon. 500/5,000/50,000/100,000 history counts are synthetic validated storage stress; actual factory count exceeds 100,000, actual native repeat proof eight championships, full field proof seven events. 128-rival name capacity fails safely; default four and stress32 pass. No 12-event competition was invented to expand D1.

Large-history read-set hashing, cold reconstruction, backup/restore cloning and main-thread IDB preparation still have measurable costs. Do not drop pages/journals, raise 8 MiB/256 MiB bounds, or weaken checks to hide them. Chunked restore staging fixes the browser single-value ceiling, not all total-latency/memory issues. Future bounded reference-message optimizations require measured compatibility proof, not assumed cache authority.

Owner Windows offline acceptance remains a gate. Preserve previous HTML and M4 storage. No current implementation commit exists; use the source manifest/hash set when establishing a later base. Do not commit/push without separate authorization.
''')
# Generated inventories are deliberately independent of user legacy evidence.
paths=subprocess.check_output(['git','ls-files','-m','-o','--exclude-standard'],cwd=R,text=True).splitlines();paths=sorted(set(p for p in paths if p!='docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md' and not '/.m3ui-' in p))
rows=[]
for p in paths:
 f=R/p
 if f.is_file():
  b=f.read_bytes();rows.append({'path':p,'status':'modified' if subprocess.run(['git','ls-files','--error-unmatch',p],cwd=R,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0 else 'new','bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
with (D/'BNT_M5_D1_Changed_Files.csv').open('w')as f:
 w=csv.DictWriter(f,fieldnames=['path','status','bytes','sha256']);w.writeheader();w.writerows(rows)
manifest={'baseline':base,'branch':branch,'implementationCommit':None,'artifact':{'name':artifact.name,'bytes':len(blob),'sha256':sha},'preexistingPreserved':['docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md'],'files':rows}
(D/'BNT_M5_D1_Source_Manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print({'artifact':sha,'files':len(rows),'node':node_result})
