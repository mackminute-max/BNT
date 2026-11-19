# BNT M2-E E4 — bounded architecture proposal

**Proposal only. Major implementation awaits owner review under authorization Section14.8.** No new gameplay decision is requested.

## Measured problem

A valid eight-entrant12-event set needs29,962,817 bytes in its current representation, with every record below8MiB. The tested Chromium Web Storage origin cannot retain it. Ordinary whole-set gzip/Brotli diagnostics remain about20.6–20.8MB. A real four-entrant publication blocked the browser main thread for12.245s; the maximum-field Node publication reached74.2s. Sampled reconstruction, hashing and canonical serialization dominate.

A cache can reduce repeated trusted work, but untrusted cold-load validation still must execute. Moving only storage access does not remove CPU blocking. Raising limits, deleting journals, reducing the field/schedule or claiming multi-key Web Storage writes are atomic would not satisfy the current authorization.

## Recommended approval scope

Approve a **versioned native IndexedDB durable coordinator with an inline worker**, retaining the existing synchronous domain stores, record formats, numerical rules and per-record limits. No server, framework, runtime dependency, E5 authority or gameplay-rule change.

Suggested modules: `src/persistence/e4/{coordinator,indexeddb,discovery,worker,backup}.js`, targeted UI command bindings, standalone inline-worker packaging and new adversarial tests. Names are technical recommendations, not implemented interfaces.

## Authority and coordination

1. Keep original CareerStore/RaceSessionStore validators and reducers authoritative for their logical records. Their synchronous `setItem` contract must not be replaced with an unawaited Promise.
2. Use a private worker mirror only to prepare and validate candidates. Its in-memory results are not durable acknowledgments. Public controls remain pending until the durable coordinator commits.
3. Preserve E3 ordering: native proof is durably committed first; revalidate the committed bytes and bind the capability in the same trusted realm; then atomically commit the official CareerStore result using expected generation/read-set checks. Forward success only after transaction completion.
4. Keep full receipt/protected-history validation. Private caches require exact source identity/bytes/revisions, immutable contents and invalidation; no unverified reload cache or generic self-hash authority.
5. Coordinate all career and championship writers. A stale tab/worker must reject, not overwrite another committed input. Preserve Web Locks plus backend transaction checks; no unsafe automatic fallback.

## Backend and migration proof

Store existing complete logical career and session records as versioned entries, with a generation/head manifest and separately bounded operational import records. Retain8MiB career/session limits,1000 receipts,2000 protected identities and complete journals. Do not reinterpret these as larger per-session bounds through chunking.

Migration must be explicit, non-destructive and preserve exact accepted data/provenance. Use a recoverable discovery/witness protocol for the old-Web-Storage/new-database boundary. Never silently fall back to a stale legacy career after newer facts have committed to the new backend. Prove interruptions before/after copying, database commit, discovery publication and acknowledgment. Old data remains preserved until the protocol proves its status; no journals are deleted to make room.

## Worker and standalone compatibility

Embed the worker bundle in the HTML and create it from an internal Blob; no adjacent files/network. Transport typed wire data rather than losing Infinity, immutable finish/wreck descriptors or shared state through ordinary structured clone. Same seed/config/input order must retain native checksums, D2 effects and official identities. Test worker denial/crash and cross-tab contention.

Cold validation, encoding and replay run off the main thread. Measure main-thread message-transfer/commit tasks and total latency separately. Busy/progress UI must be truthful, duplicate controls disabled, and cancellation must distinguish pending work from an already committed result. Do not promise100ms or a particular speedup before the proof runs.

## Recovery and complete backup

After backend coordination passes, implement the authorized E4 scheduler/recovery/bundle workflow. A complete backup lists all required record identities, versions, generations and digests, then validates every career/session relationship and protected fact. Legacy career JSON stays a distinct format. Missing session evidence fails safely.

Use staged, validated imports and one durable backend activation transaction; partial preparation never becomes authoritative. Preserve unrelated data, require replacement confirmation, reject conflicting known facts and keep a prior valid generation. Define a bounded complete-container size from the measured data and supported record count; do not silently raise the old career-import or session bounds. Bring any necessary change to an existing approved bound back to the owner.

## Gates after approval

- **B1:** exact-byte/revision cache and worker validation proof; fresh-input/corruption validation remains mandatory; before/after timing.
- **B2:** backend/migration coordination proof, denial/quota/concurrent-writer tests, no false durable acknowledgment.
- **C:** bounded simulation-tick checkpoint cadence and input/pause/speed coordination; no frame-rate-dependent persistence semantics.
- **D/E:** complete lifecycle recovery, native-prepare/official-commit retries and coordinated backup/restore faults.
- **F/G:** full8×12 workload, large Combat Rally, practical quotas, browser restart, full regressions and Windows direct-file owner acceptance.

## Alternatives

A new lossless shared/delta or replay-derived storage representation may reduce data size, but needs proof that the complete original authority is reconstructed and validated, including old versions, checkpoints and journals. It is not permission to replace records with unverified summaries. This is a separate substantial compatibility effort, with uncertain capacity benefit and potentially increased restore cost.

Narrowing supported schedules/fields or deleting evidence changes the requested support/retention policy and is not recommended under the current scope. The IndexedDB/worker path is recommended because it preserves the existing logical records while addressing both measured bottlenecks.
