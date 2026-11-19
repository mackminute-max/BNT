# BNT M2-E4 — Stage 2 Implementation Report

## Source and scope

Repository: `https://github.com/mackminute-max/BNT`; local branch: `feat/m2-e-e4-persistence-recovery`.

Accepted Stage 1 runtime: `1cde0b0a6d6f49fc3a87ca886e87fd79cd501948`; accepted E3 ancestor: `8d5abe9442e93cb318ef87d4ef47ee0de0e457e2`. Both are ancestors of this work. The owner accepted Stage 1 Windows testing. This does not establish Windows acceptance of the new Stage 2 build.

Final runtime revision: `a07c3d2ef3a97d47f349440e0533706d24f4a50f`. Implementation starts at `51b8a58`, with corrective commits `cc03c1c`, `885a23c`, `cec9486`, and `a07c3d2`. A later evidence/documentation commit records the final reports and development scripts; it does not change application source. `7c77104` preserves the accepted Stage 1 diagnostic follow-up preceding implementation.

No merge, push, deployment, release, E5 settlement or E6 content is included. The pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` is preserved and excluded from commits.

## Delivered integration

The normal Career Save interface now mounts an E4 durable championship panel. Migration is explicit and confirmed. The IndexedDB migration marker and discovery witness prevent editing historical Web Storage after activation. A pending migration can be resumed; an established missing race is never recreated from a new setup.

Existing stable and economy controls remain available before championship registration and route their original domain commands through worker preparation and durable coordinator acknowledgment after migration. During an active or unsettled championship, Home Stable is read-only. Existing tuning/configuration exports remain separate from career saves and the new complete backup format.

The panel supports development offers, registration confirmation, frozen race creation, manual event starts, coaching, durable Strategy Signs, playback/pause/stepping, official publication, intermission standings/condition inspection, withdrawal, AI continuation, blocked/recovery diagnostics, complete backup and confirmed restore. These reuse the accepted E3 controller and E3 development templates. They do not add a production championship catalog.

## Checkpoints and accepted inputs

`src/persistence/e4/runtime.js` defines version-1 playback metadata: paused state, speed 0.25–16, and checkpoint cadence 25–1000 simulation ticks (default 100). Scheduling uses authoritative simulation tick boundaries. Playback speed changes the wall-clock delay only. Reload never starts playback automatically.

The worker executes bounded native batches. A displayed durable frame is returned only after the IndexedDB transaction commits. Input controls are disabled during pending work; pause cancels future scheduling immediately and queues its persisted metadata after pending work. Original Strategy Sign commands, activation, opportunities and journal ordering are reused.

`RaceSessionStore` retains its synchronous API and version-1 record format. Its legacy default fallback remains unchanged. The worker's durable runner selects a new optional birth-fallback representation: latest full checkpoint, a verified tick-zero checkpoint, and the **complete acknowledged journal**. The immediately preceding complete generation is separately retained in the same IndexedDB transaction. No inputs, events, protected records or precision are discarded.

This avoids retaining two near-terminal full simulation images inside one 8 MiB logical record. Birth recovery must replay and verify the entire journal against the original state hashes. It cannot supply missing acknowledged inputs. Existing per-record and graph bounds remain enforced.

## Durable publication and concurrency

The synchronous domain stores operate only inside a private worker mirror. Their `setItem` calls remain synchronous; they are not replaced with unawaited IndexedDB writes.

Each operation reads a durable generation, validates/prepares in the embedded worker, and commits with the existing Web Lock plus IndexedDB generation/read-set comparison. Worker preparation is not a durable acknowledgment. Failed commits discard the worker candidate. Cache reuse requires exact bytes and generation; cold persisted input receives full validation.

UI operations bind to the inspected generation. Publication also binds to the frozen race identity across its two phases. The protocol remains durable native prepare, then the original trusted clearance capability and single protected CareerStore official commit. Lost acknowledgment is recovered by reading durable authority; duplicate IDs do not duplicate consequences. No Gold, XP, reputation or trophies are credited.

The native running/ready state now rejects premature clearance before mutation. Legitimate stalled clearance uses the original blocked-controller path. Missing/corrupt authority remains visibly blocked until exact reconstruction or a matching complete backup is available; no financial state is invented to resolve it.

## Recovery

`src/persistence/e4/recovery.js` distinguishes legacy/empty authority, pending migration, pending restore, interrupted birth, paused/interrupted playback, native prepare, clearance pending, official publication, clearance/recovery blocks, zero-starter publication and `SETTLEMENT_PENDING`.

The UI shows the durable tick/input watermark, championship phase, reason, available action and elapsed pending work. Worker restart reloads durable authority. Provable checkpoint repair must reproduce the original record manifest exactly. Corrupt or missing journal data is not replaced with a fabricated history. Repaired generations retain a valid reconstructed previous head instead of preserving a corrupt head as the recovery fallback.

Read-only status inspection between frozen creation and native birth cannot poison the cached session: a failed session object is reconstructed before a legitimate birth retry. Established missing native sessions remain prohibited from restarting.

## Complete backup and restore

`src/persistence/e4/backup.js` defines a distinct `BNT-complete-championship-backup`, version 1. It contains exact career/session strings, current and previous generations, native checkpoints/journals/publication evidence, playback settings, ownership/version identities, migration-root provenance and protected restore identities. SHA-256 binds the payload and record manifests. This is integrity checking, not authentication against an owner deliberately editing their own files.

The new complete-container guard is 256 MiB, at most 2001 logical records and 2000 restore identities. It does not raise the existing **8 MiB per career/session record**, journal, receipt, protected-history or graph limits. Oversized containers reject without truncation. The old career-only JSON format is unchanged and explicitly warns when it excludes required session authority.

Backup validates a mutually compatible snapshot and previous generation, then rejects if the generation changed during export. Restoration validates ownership, domain envelopes, financial/protected history, all required native records, journal prefixes, immutable results and both manifests before activation. It refuses unrelated careers, discarded known sessions, rewound acknowledged input or conflicting official results.

Restore has a durable PREPARED stage, discovery intent, and one atomic IndexedDB activation containing all career/session records and restore receipts. Interruption before activation leaves the prior generation authoritative and normal writes blocked until validated resume. Interruption after activation is recognized through the consumed restore identity. Cold restoration retains the imported valid previous generation and establishes a compatible monotonic destination generation. Unrelated records are not silently overwritten.

Reported storage estimates are advisory and never claimed as guarantees. Actual transaction abort/quota errors preserve the last committed generation. Downloads are requested, not claimed to be durably saved to disk.

## File inventory

| Files | Responsibility |
|---|---|
| `src/persistence/e4/client.js` | Coordination, progress, generation/race binding, prepare/commit acknowledgment, backup/restore and capacity estimates |
| `src/persistence/e4/indexeddb.js` | Atomic heads, previous generation, staged restore, restore receipts and migration compatibility |
| `src/persistence/e4/worker-service.js` | Private validated mirrors/caches, original controller operations, input retries, exact repair and backup validation |
| `src/persistence/e4/backup.js`, `runtime.js`, `recovery.js` | New versioned operational contracts and recovery presentation |
| `src/persistence/race/session-store.js` | Optional complete-journal birth fallback; legacy default preserved |
| `src/ui/durable-championships.js` | Functional durable championship panel and authoritative-frame Canvas |
| `src/ui/career-saves.js`, `stable-foundation.js`, `stable-economy.js`, `stable-cycles.js` | Awaited durable routing while retaining legacy tools and domain APIs |
| `tests/m2-e-e4-stage2.test.js` | Six focused checkpoint, restore, input, recovery and premature-clearance regressions |
| `scripts/m2-e/e4/stage2-*.mjs` | Reproducible browser, restart, capacity, retained-fixture and timing diagnostics |
| `dist/*.html` | Identical embedded application/worker deliverables |

## Compatibility and deferred work

Career schema 5, controller command version 4, native simulation/replay versions, D2 Mapping v1 and original E3 reducers remain unchanged. No modification to native physics, combat, AI, track generation, Strategy Sign rules, scoring, payroll or settlement order is included. Legacy envelopes/session records remain readable; no silent save migration is introduced.

The final test evidence quantifies remaining blocking and operation latency. Worker execution improves responsiveness but does not eliminate native validation, hashing, cloning or protected-history reconstruction cost. Whole-generation IndexedDB reads and transfers can exceed the preferred 100 ms main-thread target for large retained sets. No unsafe cache shortcut, history deletion or lossy representation is used to meet that target.

Only managed Chromium is available here. Windows direct-file acceptance of the new artifact remains required; the acceptance procedure is [WINDOWS_ACCEPTANCE.md](WINDOWS_ACCEPTANCE.md). E5 trusted completion/settlement and permanent rewards, E6 catalog/presentation, and unrelated legacy runner maintenance remain deferred.
