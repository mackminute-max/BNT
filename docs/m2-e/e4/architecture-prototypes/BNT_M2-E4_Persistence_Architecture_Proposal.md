# BNT M2-E4 — Persistence Architecture Analysis and Implementation Proposal

Date: November 19, 2026. **Design and isolated prototypes only. No production integration is authorized or delivered. E4 remains open; E5/E6 remain unauthorized.**

## 1. Baseline and authorization boundary

Repository: `https://github.com/mackminute-max/BNT.git`; branch: `feat/m2-e-e4-persistence-recovery`. Production runtime: `b8c090057052ac03bbed73d9487093da61381451`; starting HEAD: documentation commit `faf1cf5c93eab6dab01445157ef59133241b8c0b`.

Prototype implementation: `92b2d60c49f44267fd118ee9c93f5fe8bab42d3e`; explicit format-selection extension: `da245aac8d91a13ccdca846649686458d5ec77c3`. Final prototype source freeze: `e10e9a662e4d7f25a9f6c8a9aa63e92cc35ba193`. Exact-state reuse was introduced in `5add217e1d7c3f187eb226b5492d6d2ece839a2d`; the corrected private-boundary proof is `9dc19c99a049ac9514cb06b472b13a18a44d1b16`. The complete incremental commit inventory is in `evidence/source-verification.json`. All executable experiments live under `experiments/e4-architecture/`. Neither production entry point nor build imports them. Source, existing tests, dependency files and both production HTML files remain identical to the runtime baseline. The pre-existing untracked technical-readiness audit was preserved.

No owner career was migrated or edited. Existing migration/restore APIs were used only to seed or exercise disposable `EXP-`, `MEM-` and `FAULT-` IndexedDB databases in isolated browser contexts. No new game save format is accepted by the application. No merge, remote push, release or deployment was performed.

## 2. Verified remaining costs

- `src/persistence/e4/client.js`, `E4Coordinator.operate()` reads a complete durable snapshot, sends it to the worker, receives complete candidate records and commits them. The synchronous domain stores correctly operate on an in-worker memory adapter; that adapter must not become an unawaited asynchronous storage shim.
- `src/persistence/e4/indexeddb.js:26–39` reads/writes complete `head` and `previous` generations. Exact read sets and generation checks protect the commit. Moving these reads into a worker does not eliminate the database's full-record cloning or write costs.
- `src/persistence/e4/worker-service.js:42–65` uses a private exact-snapshot cache. On a cache miss it opens/validates the career and decodes every retained session, verifying ownership, frozen anchors and official authority references. A different generation can invalidate this whole-snapshot cache even when most logical records are identical.
- `src/sim/foundation/codec.js:6–49` traverses all native graph properties and descriptors. Full alias layouts, sentinels, frozen records and original ordering are part of the state representation. The compiled track/setup cannot safely be treated as immutable merely because an object reference is unchanged: the native track/setup are not uniformly deep-frozen (`src/sim/race.js:79–108`, `:222–263`; `src/track/course.js:43–64`).
- `src/persistence/race/session-store.js:51–95` binds journal before/after states and publication to the existing state fingerprint. The accepted fingerprint incorporates legacy graph compression. A new representation does not automatically remove those legacy hash/validation computations.
- `src/sim/race.js:1069–1073` also computes normal native replay digests every configured interval. The snapshot includes historical events (`:312–355`). Reducing journal retention, digest frequency or numerical fidelity is not an acceptable shortcut.

See the results and memory reports for current, controlled measurements. Earlier performance-report timings are not interchangeable with this environment or with a different Pure/Combat fixture.

## 3. Isolated prototypes and disposition

### P-A: Positional graph pages — reject

`pages.js` stores compressed pages of the existing exact graph-node table. It preserves all values and alias indices, but growing/changing graph traversal shifts reference indices and invalidates most pages. The measured storage and encoding results are worse than the current codec. Do not integrate it or hide the negative result.

### P-B: Node templates plus exact alias layout — retain as research

`templates.js` interns exact node data after replacing graph references with local slots. Every snapshot separately retains the original node occurrences and reference-index layout. Identical data templates therefore do **not** merge distinct object identities. Descriptors, array length flags, sentinels, original node ordering and compiled track coordinates reconstruct exactly.

Templates are append-only in the experiment; historical evidence is not discarded. A bounded derived dictionary supports warm encoding; eviction removes only that dictionary, not stored chunks, and verified rebuilding is tested. Experimental capacity bounds are measurement safeguards, not changes to approved application limits.

Storage savings and some warm component improvements are promising. First encoding can be slower, recovery still reconstructs/validates the graph, and the full native graph is still traversed. The experiment is not a complete durable session codec and does not prove a sub-500 ms authoritative advance. Do not adopt a native format on these results alone.

### P-C: Worker-owned existing backend — recommend a bounded integration proposal

`worker.js` owns an isolated **unchanged** `IndexedRecords` backend and `createWorkerService`. Requests carry operation arguments and expected generation. The worker itself reads the durable source and retains the complete exact read set for the original commit validator. A private serialized queue and the existing Web Lock coordinate writers. No client-provided token or digest authorizes a write.

The actor awaits the actual strict IndexedDB transaction completion, then acknowledges worker preparation and responds. Lost responses recover from committed authority; aborted/stale/conflicting operations cannot claim durability. No async `setItem` substitution is introduced.

Smaller transfer messages reduce UI copying but do not remove native serialization, full-record database reads or cold verification. Minimal diagnostic inspection returns only phase/tick; a production UI still needs a versioned, complete presentation DTO. Count-only backup timing is not equivalent to downloading the complete backup; the memory experiment includes actual full-text transfer.

### P-D: Exact-byte retained-history index — recommend a bounded integration proposal

`history.js` retains no decoded native-history graphs. It reuses a session validation only when its **exact raw string** and source-verified identity/anchor/official-reference binding remain unchanged. A changed career envelope is reopened with the full CareerStore validator. Ownership and required-session presence are checked every time. Changed session data takes the full decoder. Reset/cold load takes all required decoders again.

The index is private derived state, not persisted authority. The standalone benchmark is a validation component; integration must keep the existing root record-manifest verification, authoritative backend reads and exact commit read-set checks. A caller's generation number, digest or “validated” flag is never sufficient.

### P-E: Exact raw-record content addressing — propose physical-storage research

`RecordArchive` factors identical exact logical-record strings across current/previous heads. Actual two-head reuse is measured separately from the deliberately identical-head upper-bound fixture. Reconstructed strings and ordering are byte-identical. This is an in-memory representation proof, **not** an implemented persistent content-addressed database or an approved backup format.

Physical record factoring can reduce duplicated retained bodies without changing CareerStore, session/journal formats or financial validation. A production implementation must preserve every generation's complete metadata, not just record arrays: runtime, migration/discovery evidence, recovery stages, restore receipts, generations and root integrity.

### P-F: Two-entry compression cache — do not integrate on current evidence

An optional esbuild plugin replaces only the experimental worker's private compression memo. Two exact-content entries share a 32 MiB decoded-text accounting budget; output bytes, decoder checks and logical limits remain unchanged. Byte goldens, corruption and eviction proofs pass, but the measured Long Combat Rally and retained publication costs do not show a reliable throughput improvement beyond worker relocation. Post-GC worker retention increases in the stress case. Retain the existing one-entry production cache.

### P-G: Exact-state controller validation reuse — strongest bounded candidate

`src/career/championships/controller.js:79–91` reconstructs the entire receipt lineage on validation. Transaction processing validates input and output, then envelope publication validates states again (`career-store.js:117–129`, `:38`). The experiment reuses only a complete, previously fully validated state data graph, including aliases, descriptors, revisions and all financial/history fields. It never trusts a caller hash. Every distinct graph executes the original full validator. Cache insertion additionally requires that the validator returns the same state and leaves its exact graph unchanged. Unsupported key shapes fall back to full validation.

The private worker-only budget is two entries / 16 MiB key-text accounting. Cold workers start empty; every distinct primary/recovery state and every required native session still receives its original verification. Native bytes, domain reducers, protected-history checks outside the pure state validator and actual IndexedDB commits are unchanged. The public read-only history view is not interchangeable with private mutable state for this descriptor-aware key; the proof uses the actual private worker boundary rather than relaxing equality.

Observed retained official publication: 15,258.3→6,600.0 ms in the paired run; exact logical records match. This does not solve active Long Rally advances, and is not a persistent validation certificate. The experimental helper currently generates a transient full graph key; production design must avoid retaining unused graph objects and must test memory, large-state cache misses and the supported closed JSON/structuredClone boundary. Do not expose this as a generic validator for arbitrary caller-owned JavaScript proxies or external mutable authority contexts.

## 4. Recommended production proposal — separate authorization required

| Stage | Scope | Acceptance gate | Rollback |
| --- | --- | --- | --- |
| 0 | Integrate private exact-state validation reuse into the accepted worker, under unchanged formats/backend | Full unique-state/cold validation; invalid treasury/receipt/ownership/undefined/NaN/revision rejection; exact domain bytes; memory/eviction tests; full regression | Disable/clear the derived cache; no data migration |
| A | Move existing backend orchestration into a dedicated worker actor; retain the existing physical/logical formats and synchronous domain stores | Exact logical records, full native replay, input/Sign ordering, all fault boundaries; complete UI DTO and progress behavior; no false durable acknowledgment | Revert orchestration code; unchanged database remains readable by current runtime |
| B | Add a bounded exact-byte/session-binding validation index inside that actor | Cold corruption and missing authority still fail; actual publication invalidates changed records; financial validator remains intact; eviction restores cold behavior; no decoded-history graph cache | Disable/clear derived index; no data migration |
| C | Prototype persistent raw-record factoring with immutable bodies and current/previous generation manifests | Exact read sets against actual stored bodies; atomic new bodies/root/previous activation; missing/corrupt body rejection; quota/abort/restart tests; no evidence pruning | Requires the explicit version/compatibility bridge below |
| D | Consider a versioned native template transport only if earlier stages are insufficient | Full end-to-end proof including state/journal integrity, logical bounds, source-context replay, recovery and conversion; quantify memory and first-encode cost | Explicit converter and supported old-format reader; not an automatic old-HTML rollback |

**Recommended next implementation authorization: Stage 0 only**, with full production regression, memory and Windows acceptance gates. A+B are separately useful candidates for responsiveness and warm record reuse, but actor relocation alone is not a late-advance throughput cure. C needs a migration/writer-fencing design review first. D remains research. Do not promise the 500 ms target from message-size or component-codec results.

## 5. Migration and rollback design for a future physical backend

### Confirmed old-writer risk

The current coordinator acquires the Web Lock and checks the backend generation, but `operate()` does not re-run `discover()` on every operation. Simply changing a discovery pointer to a parallel database could leave an already-open old tab writing its still-valid old head. A pointer switch alone is therefore not a safe writer fence.

A proposed same-database **version upgrade** is safer to evaluate: current connections close on `versionchange` (`indexeddb.js:22`), and an old runtime opening version 1 after a version-2 upgrade receives `VersionError`. The new adapter must preserve explicit errors and forbid stale Web Storage fallback. All supported old-client paths must be tested; do not assume a witness alone fences cached writers.

### Proposed migration sequence

1. Require explicit owner-approved migration confirmation and advise a verified complete external backup. Acquire the existing writer lock; validate the current head, previous generation and every required record using existing validators. Record exact source generation/read set.
2. Fence old database connections via the reviewed version-upgrade protocol. Preserve the old logical `head`/`previous` bytes as recovery material; create only versioned staging structures. No career gameplay transaction or reward is generated for migration.
3. Write and verify immutable record bodies and generation manifests. All logical records still obey the current 8 MiB limit; the complete-backup bound remains 256 MiB. A new physical representation must not silently raise those limits.
4. Atomically activate the validated current and previous manifests in a single database transaction. Do not describe multiple independent storage writes as atomic. An interrupted staged migration remains explicitly recoverable; no automatic new race or old-data fallback.
5. On cold load, verify root/manifest integrity, every required body and financial/ownership/session relationships. For authoritative commits, retain exact read-set validation against actual stored strings; a matching root hash must not hide a corrupt body behind a warm cache.
6. Retain the old-format reader and a compatibility/export bridge. Do not delete protected journals/history or prune old bodies merely to improve capacity. Any later garbage collection requires an approved liveness/retention policy.

### Rollback limitation

IndexedDB cannot simply downgrade its version. After any new acknowledged generation, selecting the old migration snapshot would rewind progress and is forbidden. A tested compatibility bridge must export the **latest** full logical v1 career/session authority, validate it, and restore it with confirmation into an appropriate clean v1 destination/profile. The bridge must retain protected identities and financial anchors and must not merge an unrelated career. A failure after upgrade but before activation requires the new recovery reader; the old HTML is not an automatic recovery tool.

Stage 0 and A+B do not need this data migration and have a substantially simpler rollback story.

## 6. Native-format compatibility decision still unresolved

The existing session fingerprint hashes the legacy packed state. Template storage alone cannot eliminate that computation. A future native format would need an explicitly approved integrity/version contract, while preserving old readers, old journal entries, old proofs and native replay results. No reference checksum should be updated to conceal a mismatch.

Changing only physical storage can retain exact logical bytes. Changing operational native fingerprints/journal epochs is a separate, larger compatibility project: an on-demand legacy export may require verified reconstruction/replay and cannot be promised as a free or instantaneous conversion. This proposal does not approve or implement that project.

## 7. Risk assessment

| Risk | Assessment | Required control |
| --- | --- | --- |
| A worker reply mistaken for durable storage | Critical | Await transaction completion; recover lost acknowledgment from authoritative generation |
| Old-tab split authority during migration | Critical | Explicit writer fence; version-change/old-client tests; no pointer-only migration |
| Untrusted/stale cache hit | Critical | Private exact bytes plus verified role binding; cold full validation; exact backend read set |
| New native codec bypasses old state fingerprint or bounds | High | Separate owner-approved version contract; old readers; no golden updates or hidden bound increases |
| Smaller messages simply move memory to worker | High | Main/worker/renderer measurements; bounded caches; real full-text backup/restore tests |
| Large backups duplicate current/previous heads | High | Evaluate lossless raw-record factoring while retaining all metadata/evidence |
| First-encode/cold recovery regressions | Moderate | Report both cold and warm costs; do not generalize warm savings |
| Inspector sampling understates/transforms memory peaks | Moderate | Label sampled lower bounds, forced-GC diagnostics and process high-water scope; Windows validation |
| Prototype accepted as production-complete | High | No application imports/build integration; production database prefixes rejected by prototype actor |

## 8. Recommendation and stop boundary

Proceed only after owner review of this proposal. The safest next production proposal is bounded private exact-state validation reuse in the already accepted worker, followed by remeasurement. Keep actor relocation and the record index separately gated. Reject positional graph pages. Keep node-template transport as research; review physical raw-record factoring and writer fencing separately.

No gameplay, numerical, scoring, condition-mapping, reward or payroll change is needed for Stage 0 or A+B. E5/E6 are not authorized. See the comparison, memory/storage and compatibility reports for actual evidence and limitations.

## 9. Standalone-specific integration gate

Managed Chromium blocks direct `file://` navigation. HTTP worker success does not establish Windows file-origin IndexedDB or WorkerNavigator Web Locks behavior. A+B must first prove the complete actor in the owner's Windows Chrome/Edge offline context.

There must be **one** Web Lock owner per operation. The experiment takes the lock inside the worker because its harness does not take an outer lock. Production could preserve the already accepted main-window lock across the awaited worker operation, avoiding a new dependency on worker-side lock availability. Taking the same lock on both sides would deadlock and is not proposed. Either design must prove cross-tab scope, generation checks and durability on direct-file operation before acceptance. If worker-owned IndexedDB cannot safely operate there, retain the accepted architecture and return the measured limitation; do not replace the game with an HTTP-only application.

## 10. Remaining cold-load and scaling limitations

Private caches do not turn persisted validation stamps into authority. The measured full cold load still decodes all required native sessions. The warm record-index gain is useful when a worker still has validated records across a changed head (including another writer); it is not a promise of faster first-open recovery. Likewise, current whole-snapshot promotion already avoids some warm loads, so the index's microbenchmark speedup is not an automatic speedup for every operation.

Longer active races still serialize/hash increasing event and graph history. A future source-equivalent serialized-graph validator, streaming key/backup encoder, or inductively validated immutable receipt-prefix design could reduce reconstruction/allocation costs, but none is implemented or proven here. They must preserve all cold checks and cannot rely on stored certificates or remove protected evidence. Changing operational session fingerprints/journal epochs would require a separate approved version contract.

A physical migration inventory must include the full activated `migration-stage` record and any prepared restore text/stage, not merely the projected metadata returned by `snapshot()`. The measured two-head content factoring is not a complete database-capacity result. All retained roots must remain represented until an explicit approved policy permits otherwise.
