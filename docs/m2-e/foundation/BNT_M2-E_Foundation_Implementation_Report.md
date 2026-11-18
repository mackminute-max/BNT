# BNT M2-E Foundation Implementation Report

**Date:** 2026-11-18 (America/Los_Angeles). **Scope:** E0 + minimal E1 + early E4 only.

- Branch: `feat/m2-e-foundation`.
- Accepted M2-D baseline: `06fd511170148caf744abf57449c4cc5d6c4e2c5` (implementation `c8371a8e26115c04f86ff91e7f45f2cda4bafb13`; tree `0123fcb6544ff08aa98c6b3de2140b8c05c35e87`).
- Foundation implementation commit: **`5870d18c5fb6455767e918ad0df9e1e64cbecb2e`**. A subsequent documentation-only commit contains these reports/evidence.
- Owner Windows acceptance of M2-D is established by the current authorization; historical reports were retained without rewriting their earlier pending-acceptance statements.
- Local main remains `f66ec90a6659dd6bb675815bff4cc33e9850a643`. `git fetch origin` was attempted before work; accepted ancestry/source was verified locally. No substitution of older main occurred.
- Initial tracked tree clean; pre-existing `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was preserved and excluded from commits.

## Delivered foundation

The accepted vanilla JavaScript/Canvas/esbuild architecture is preserved. No new dependency, framework, server, simulation engine or gameplay coefficient was introduced. All63 approved decisions remain constraints for future implementation; this delivery does not claim implementation of the full championship controller.

### Modules and interfaces

| Module | Delivered responsibility |
|---|---|
| `src/career/championships/contracts.js` | Strict schema4→5 maintenance request, protected migration identity/effect, frozen instance identity types and checkpoint-reference validation |
| `src/career/championships/schema5.js` | `previewFoundation`, `buildFoundation`, `validateStateV5`, legacy-command delegation and provenance integration |
| `src/persistence/career-store.js` | Explicit `previewFoundation()` / `migrateFoundation(request)` APIs, same validated atomic publication/manual-mode contract |
| `src/career/state.js`, `economy/protected-registry.js`, `persistence/envelope.js` | Additive schema5/maintenance dispatch; protected pre-foundation restore refusal; original versions remain strict |
| `src/sim/foundation/codec.js` | Lossless bounded object graph transport, shared references and descriptors, Infinity/undefined/-0, deterministic LZW16 compression and SHA-256 integrity |
| `src/sim/foundation/checkpoint.js` | `checkpointRace`, `restoreRace`, complete resolved-boundary validation and `clearedNativeResult` |
| `src/persistence/race/session-store.js` | `RaceSessionStore`: atomic checkpoint generations/journal/head/proof registry, revisions, idempotency, recovery/manual export; `careerAnchor`, `storedCareerAnchor`, `withRaceSessionLock` |
| `src/sim/foundation/no-starters.js` | Typed zero-starter evidence seam; no fabricated entrants/DNS or rewards |
| `src/sim/foundation/api.js`, `src/ui/app.js` | Additive `window.BNT.foundation` development integration; no new management screen, automatic migration or championship buttons |
| `tests/m2-e-foundation.test.js` | 34 new migration/codec/determinism/journal/fault/clearance/coordination tests |
| `scripts/m2-e/browser.mjs` | New bundled/Node-independent browser foundation checks and Web Lock proof |
| `dist/*.html` | Rebuilt identical standalone aliases using the unchanged build pipeline |

## Schema and migration

Career schema5 adds `championshipFoundation` to the accepted career state. Its version1 metadata retains the exact schema4 origin, confirmed migration request, condition mapping provenance (`UNMAPPED`, legacy fields preserved), and reserved instances/operations/terminal/checkpoint registries. Registries are deliberately empty and reject unsupported entries until their later authorized writers exist. `validateInstanceIdentity`, `frozenInstanceIdentity` and `validateCheckpointReference` define foundational structures without implementing registration.

Migration is explicit, non-destructive and protected by one career-scoped effect. It advances maintenance once, leaves gameplay revision/receipts unchanged, and preserves Gold, assets, acquisition basis, injuries, fatigue, integrity, native condition, strain, wear, contracts, cycle history and developer provenance. No proposed D2 conversion bands are applied. A failed publication changes neither career state nor persisted bytes. Repeated identical request returns already committed; conflicting ID/effect, stale source/revisions, ownership or version rejects. Known schema5 migration cannot be erased by importing an older career.

No new gameplay command version was necessary: original v1/v2/v3 commands remain delegated through the unchanged schema4 execution path. Existing envelope/history version1 and the1000 receipt/2000 identity/8MiB limits remain. The new independently discriminated `foundation-maintenance` record is version1 and counts toward the existing protected cap. Original M1/M2-A/B/C/D save formats/validators/receipts were not rewritten.

## Checkpoint and journal architecture

`checkpointRace` captures the full authoritative live race object at a resolved boundary, including setup, RNG, incident scheduler, AI, contacts, conditions, event history, pending processing, progress, Signs and prior native replay checkpoint records. `restoreRace` decodes that object rather than approximating it or replaying from the starting grid. A temporary `createRace(setup)` is used only for structural/version/identity validation; its RNG does not replace restored RNG or scheduler state.

The codec preserves shared references, property descriptors and frozen finish/wreck data. Positive/negative Infinity, undefined and negative zero have explicit tags; NaN/accessors/functions/cycles/unsafe keys are rejected. Wire codec1 uses `lzw16-v1`; decoded graphs are bounded at32MiB,200000 nodes and depth128, while each serialized session/checkpoint remains capped at8MiB. No limit was silently raised. SHA-256 is accidental-corruption/integrity evidence, not backend authentication or anti-save-editor security.

Race sessions use a **separate single atomic Web Storage value** keyed by profile/career/instance/race identity. It contains independently sealed authority, current/previous checkpoint, complete ordered journal, authoritative head hash and proof publication. Journal requests include persistent input ID, expected operational revision, tick, phase, commands and tick count; sequence and before/after hashes validate every replay step. Native command ordering is preserved by the engine, including paused Signs. No per-tick financial receipt is created. Inputs acknowledge `durable:true` only after successful atomic storage publication; manual operations acknowledge `durable:false`.

The previous generation is usable only with its matching identity/config/version and complete committed journal tail that reproduces the authoritative head. Missing/corrupt tail, both invalid generations, incompatible versions or identity produce explicit RecoveryRequired; no seed reset, grid restart, reroll or financial rewind. Known committed result authority cannot be rewound through manual import.

### Coordination and financial safety

The synchronous store requires a serialized single writer. Browser integration must hold `withRaceSessionLock()` around open+operation. The wrapper uses exclusive Web Locks and refuses an uncoordinated automatic fallback. Low-level synchronous methods remain available for explicit single-writer/headless tooling; their stale-byte check alone is not a multi-window CAS guarantee.

Every operation verifies a profile/career/revision/fingerprint anchor. `storedCareerAnchor(storage)` rereads and validates the actual career envelope, so another committed financial change invalidates the old race session rather than being undone. **This phase never writes CareerStore or Gold from the race store.** There is therefore no partial cross-store financial transaction to recover here. Later actual championship/settlement integration must provide its own proven same-authority transaction/coordinator; this proof is not that completed E5 integration.

Storage denial rolls back unacknowledged state and enters explicit manual mode/checkpoint warning. Manual exports/imports are explicit and validated; download acknowledgements are not claims of durable disk storage. No browser-only system can reconstruct unknown facts absent from every supplied copy.

## D5 clearance and atomic publication proof

A result candidate is generated from the session's validated native state. Clearance requires actual Ended, resolved processing, no pending impacts/overrides, no Racing/Clearing entrants, complete official classification and the same native condition snapshot. Permanent stationary wrecks may remain; future scheduled incidents beyond the terminal boundary do not themselves block clearance. Stalled/Error/unfinished processing is not an official result.

A successful publication atomically stores immutable classification, final native driver/beast/chariot condition, minimal classified-participant standings-effect records, reserved pending entitlement IDs and result identity bound to setup/head/watermark/revision. This is a **minimal proof aggregate**, not real championship points, rewards, XP or application to persistent management assets. No Gold is credited. The proof is not an M2-D completion capability and cannot authorize settlement.

Validation failure durably records `RACE_CLEARANCE_BLOCKED` with recovery evidence and no official consequences/awards/advancement/settlement. Storage failure publishes no partial result; rollback/manual warning preserves the prior authority. Same valid result retry is idempotent; conflicting identity rejects. A lost acknowledgement after an atomic commit reopens the committed result and returns duplicate. Repeated genuine physical blockage may remain blocked indefinitely; no teleportation, removed wreck or invented retirement resolves it.

The separate `noStarterProof` validates the shape of explicit ineligibility evidence and produces empty result/condition/award arrays. It is a foundational **synthetic eligibility seam**, not a new trusted roster/controller authority. Actual authoritative eligibility and championship advancement remain deferred.

## Scope and compatibility

No E2/E3/full E4/E5/E6 implementation: no selection board, fees, roster locks, schedule, championship scoring/reward economy, title/trophy progression, live completion producer, integrated D2 treatment/recovery, D3 coaching, D4 reward distribution, new damage/death/equipment rules or M2-F/G. No simulation/AI/track/replay/native formula/M2-D reducer changes. Existing UI remains intact; new APIs are programmatic foundation tools, not a playable championship feature.

## Known limitations

- Periodic writes are explicit operation boundaries; automatic viewer checkpoint scheduling/UI resume integration is not implemented.
- Storage quota can be lower than8MiB. Large/long configurations may hit encoded or decoded caps and reject safely; unlimited race/history storage is not claimed.
- Serialization/validation is synchronous and expensive for large logs; the measured full Combat Rally proof is not a recommended interactive save cadence. Responsiveness/off-thread or incremental storage work is a full-E4 prerequisite.
- Journal has a1000-operation bound and retains all committed operations. No silent compaction or financial-history pruning.
- Actual multi-race condition conversion, standings/reward logic, durable trusted completion and atomic M2-D settlement remain future work.
- Direct-file testing of this **new** artifact is blocked here; owner acceptance of the older M2-D artifact does not accept this build.
- Known legacy circuit/rally selector test remains unchanged and failing as separately approved maintenance work.

## Standalone artifact

Both `dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html` are **474374 bytes**, SHA-256 **`fe48c76f4a7e6988db88fd334a746b62513e497480bd7cffe2831e806c40299a`**. `npm run build` passed the existing runtime-dependency guard. No external runtime libraries/assets/server are required by the packaging. Managed HTTP functional checks are not independent Windows file-origin verification.

For Windows review: copy either HTML, verify hash with PowerShell `Get-FileHash`, double-click it offline, test existing race controls/workbench and career save reload/export/import. No new championship screen is expected. The foundation API is available under `BNT.foundation`; automated browser tests demonstrate its use without a live championship producer. Keep real career backups and use synthetic proof data separately.

No merge, push or deployment occurred. See the test evidence and next-gate report before further authorization.
