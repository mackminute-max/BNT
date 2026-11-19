# BNT M2-E E4 — Stage 1 Architecture Implementation Report

Date: November 18, 2026 (America/Los_Angeles).

**Stage 1 delivered for review; full E4 is not complete. Stage 2 has not begun.** The owner approved the bounded IndexedDB/inline-worker architecture after Gate A. Production rollout remains gated by direct-file compatibility and the outstanding quota diagnostic. No E5/E6, merge, push, release or deployment.

## Baseline and revision

- Branch: `feat/m2-e-e4-persistence-recovery`.
- Accepted E3 runtime: `8d5abe9442e93cb318ef87d4ef47ee0de0e457e2`.
- Gate A diagnostics: `0d8c061c9b32fce1fadde55469fac5dd3bbed012`; report/evidence: `2bfce743355983150c94c7d9c93e93568da93a45`.
- Architecture implementation: `cddf219bb41c400cf1ee76cd9e017c63a4058873`; bundle update `80ce3f778acf5a17f079ef53d13ac8d43461bfac`.
- Validated-candidate cache: `005a43f93d99f925474e183042943a229cdb3272`.
- Orphaned-authority rejection and additional publication faults: `226c3577ee939681e69d237d95d7aad5a82612e8`.
- Migration staging/witness binding: `3301eb6fd3f924b3c7facfce422524b76882dceb`.
- Final canonical migration ordering and legacy/manual compatibility: `1cde0b0a6d6f49fc3a87ca886e87fd79cd501948`.
- Exact final evidence/documentation revision is recorded in `evidence/revision.json` and the delivery response. An unrelated pre-existing untracked audit remains untouched.

## Modules and interfaces

| Module | Responsibility |
|---|---|
|`src/persistence/e4/indexeddb.js`|Database version 1, atomic generation/read-set compare-and-swap, previous generation, explicit migration marker and discovery witness|
|`src/persistence/e4/worker-service.js`|Original CareerStore/RaceSessionStore/controller/clearance execution in a private synchronous mirror; complete cold validation; bounded exact-byte/generation cache|
|`src/persistence/e4/worker-entry.js`|Serialized worker requests, versioned errors and request correlation|
|`src/persistence/e4/client.js`|Embedded Blob worker lifecycle, timeout/restart, pending-operation suppression, durable coordinator|
|`scripts/build.mjs`|Builds and embeds the worker in the single HTML; no adjacent worker file or runtime dependency|
|`src/ui/app.js`|Exposes the staged diagnostic/integration API as `BNT.e4.open()`; does not switch ordinary championship play to it|
|`src/ui/career-saves.js`|Checks migration authority before legacy management writes, using the existing career writer lock; blocks editing historical Web Storage after migration|
|`tests/m2-e-e4-worker.test.js`|Five focused worker/cache/D2/boundary tests|
|`scripts/m2-e/e4/stage1-*.mjs`|Standalone/browser, capacity, publication and migration fault evidence|

No native race engine, AI, physics, D2 formula, scoring, payroll reducer, career schema, historical command, receipt, journal codec, dependency or logical record bound is changed.

## Worker authority and cache

Protocol version 1 supports validation, replay, typed D2 comparison, probe, prepare, acknowledgment and reset. A private synchronous storage mirror keeps the original store APIs synchronous. No Promise masquerades as `setItem`.

Cold loads run CareerStore's complete envelope/history validation and every supplied RaceSessionStore native/checkpoint/journal validation. Retained sessions must belong to the career's championship instances and match accepted official authority references. Missing official/current referenced records reject. Native state is reconstructed with the existing typed codec; ordinary structured clone is not used to transport authoritative native graphs.

The one-entry cache is keyed by the complete exact snapshot bytes and generation, including metadata. A revision/generation or byte change forces cold validation. Candidate preparation invalidates the source cache before mutation. A matching post-commit acknowledgment may promote the already validated candidate for the exact next snapshot. Failure resets it; reload/worker restart has no trusted cache. Cached state is private and never externally mutable. A worker response always reports `durable:false`.

## Durable protocol

The IndexedDB head owns the complete list of original logical string records, version and generation. One readwrite transaction validates the expected generation and full read set, retains the prior head, and publishes the next head. The coordinator waits for transaction completion. Strict durability is requested from the browser; this does not promise permanent retention or protection from disk/browser/OS failure.

Official publication remains:

1. Prepare/finalize native session using the original validators.
2. Commit native prepare durably through IndexedDB.
3. Load or exactly match the newly durable snapshot in the worker.
4. Recreate the original same-realm branded clearance capability.
5. Prepare the original single protected CareerStore official operation.
6. Atomically compare-and-swap the durable read set and commit.
7. Acknowledge only after transaction completion.

Two independent Web Storage writes are not treated as atomic. A lost worker acknowledgment after database commit surfaces an error requiring reload/retry; the already committed result is not undone or re-applied. Storage failure before the official commit leaves durable career consequences unchanged. Whole-snapshot generation/read-set checks serialize competing tabs even without relying on a worker's opinion about durability.

## Explicit migration and recovery scope

`E4Coordinator.migrate(legacy,{confirmed:true})` requires the existing career writer lock and full worker validation. The recoverable protocol is:

1. Compare exact legacy bytes; durably stage the validated source copy and SHA-256 binding without activating a career head.
2. Write a PREPARED discovery witness naming the database and source binding. If denied, do not activate; retain the pending stage for explicit retry.
3. Recheck source bytes; atomically activate head, migration marker and ACTIVATED stage with expected generation and stage digest.
4. Publish the final discovery witness; acknowledgment follows database transaction completion.

Original Web Storage saves remain unchanged. Interruption before activation can resume only from the retained matching PREPARED database stage. An activation marker makes IndexedDB canonical, even if the final witness write fails. A witness with a missing database cannot authorize re-import of stale legacy bytes. Foreign/corrupt witness identities and orphaned nonempty heads reject. This distinction covers database loss after newer facts: it cannot be mistaken for a never-started migration.

This is an architecture proof, **not** the completed player migration/recovery UI. The ordinary championship viewer still uses accepted E3 persistence until Stage 2 is approved by the proof gate. After an explicit diagnostic migration, the legacy management UI is blocked rather than silently editing stale bytes. There is no automatic migration or destructive rollback command. When no activation witness exists, the original unmigrated legacy/manual path remains available even if IndexedDB is unavailable. An existing witness always blocks legacy writes; IndexedDB denial cannot bypass it.

## Performance, capacity and limits

See test evidence for separate worker total latency, main-thread tasks, exact fixture sizes and raw observations. The full 29,962,817-byte accepted eight-entrant/twelve-event retained set fits IndexedDB and is replay-verified in the worker. This proves retention of the reference set, not a newly played twelve-event E4 viewer workflow.

The existing 8 MiB logical career/session bounds, 32 MiB decoded graph bound, receipt/protected identity and journal caps remain. IndexedDB is quota-limited and potentially evictable. Keeping the previous generation increases physical storage. No authoritative journal/history is truncated, summarized away, or discarded.

## Known limitations and deferred work

- Managed direct-file navigation is administrator-blocked. Windows direct-file IndexedDB/Blob-worker/reopen compatibility is unverified; HTTP is not a substitute.
- Chromium accepted a developer quota override and reported it active, yet allowed the tested write. The quota diagnostic exits nonzero. Injected QuotaExceededError/transaction-abort checks pass, but actual quota exhaustion is not established by that override.
- Worker total latency remains substantial. Main-thread transfer/serialization/IndexedDB tasks can exceed 100 ms; no universal responsiveness guarantee.
- Automatic periodic viewer checkpoints, full pause/input integration, comprehensive recovery UI, coordinated complete backups/restoration, and live full-field long-schedule E4 workflows are **not delivered**.
- No final owner acceptance is claimed. E3 acceptance remains historical; this is a new proof artifact.

## Scope disposition

Stage 2 is stopped at the B3 compatibility review boundary and the unresolved browser quota diagnostic. The architecture direction remains feasible; no further gameplay policy is needed. The next action is Windows direct-file proof and resolution/documented disposition of quota enforcement evidence, followed by explicit proof review. E5/E6 remain unauthorized.
