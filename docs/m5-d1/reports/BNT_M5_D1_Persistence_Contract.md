# M5 Delivery 1 — Persistence contract

Baseline HEAD: `6f01da6d9cc0a79fecf9d38cd55989e17fb2651c`. Branch: `feat/e5-d-m1-startup-slots-options`. Implementation is an **uncommitted working-tree candidate**; no implementation/documentation commit was created. Source identity is the delivered `BNT_M5_D1_Source_Manifest.json`, not HEAD alone.

Artifact: `Blood-and-Thunder-M5-D1-Playable.html`; **4,363,707 bytes**; SHA-256 `efd9c6c1a3d685173f06752931d666e1860795500685f20b8e235f9aac8352ad`. Accepted M4 artifact remains unchanged (SHA-256 `d77e49e40457c5de0255e3c95779941bec67023a4760248a69760f60b7a8d60c`).

## Family and compatibility boundary

`BNT-M5-current-save`, envelope version 1, family `m5-current-v1`, mechanical current schema 7. This is Owner Option B, **not a schema-6 migration**. Old HTML and old storage remain untouched. M5 uses `BNT-M5-D1-*` databases/slot catalog, does not adopt legacy Web Storage, and rejects foreign/unsupported families. No old-save converter is shipped. Existing M3 presentation sidecar-v2, immutable identity-pack pin and mutable commentary preference are validated and transported intact within M5.

## Serialized records

```json
{"kind":"BNT-M5-current-save","version":1,"family":"m5-current-v1",
 "base":{"value":"<validated schema-7 checkpoint>","hash":"<canonical SHA-256>"},
 "tail":["<native protected receipt, at most 128>"],
 "currentHash":"<reconstructed current SHA-256>","presentation":"<validated sidecar or null>"}
```

Current `m5` fields: family, checkpoint, baseRevision, finance, acks, historyPages, historyTail, lastArchive, marketEpoch, rivals, catalogPin, identities, initialization, firstRevision, marketReservations, marketConsumed. Initialization retains the protected original starting grant. Finance retains opening plus net command credit/debit audit totals, with exact nonnegative native Gold conservation; native reducers remain the sole price/effect authority. The counters are **not** an alternative gross-income accounting system.

History page: `{kind:"M5-protected-history-page",version:1,profileId,careerId,ordinal,previous,rows}`; logical key `bnt.m5.history.<canonical fingerprint>`. Rows are typed operation, championship or paid-wage facts. Page sealing threshold: 128 rows or 512 KiB; every logical record must remain ≤8 MiB. Settled summaries retain exact official classifications/conditions/effects/provenance, participation, identities, settlement, wages and selection facts; no lossy result synthesis. Unsettled/native proof evidence is never compacted. Archive indexes are cross-checked against protected summaries.

Root: `{format:"m5-record-root-v1",version:1,generation,profileId,careerId,careerRevision,maintenanceRevision,recordsHash,runtime,references:[[logicalKey,bodySHA256]]}`. Bodies are immutable `m5-body-<SHA256>` strings. Head and previous are reference-only, not duplicated complete history graphs. `m5-clock` independently checksums the absolute writer chronology and root fingerprints, permitting detected current-root loss to use explicit valid-previous recovery. Hashes detect corruption; they are not anti-cheat signatures or substitutes for native validation.

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
