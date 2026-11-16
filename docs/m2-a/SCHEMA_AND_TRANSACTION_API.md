# M2-A schema, migration and protected-identity contract

## Versions and storage

- Racing engine: unchanged `0.6.0-tracks`.
- Discovery key: unchanged `bnt.career.save.v1`.
- Transport envelope: `kind: BNT-game-save`, `schema: 1` (not career schema).
- Legacy career payload: schema 1, supported through the verbatim compatibility module.
- Upgraded career payload: schema 2; registry schema 1, protected history schema 1, engineering-limit catalog version 1.

Legacy envelopes retain their original exact fields. An upgraded envelope additionally requires **sealed `protectedHistory` and `maintenanceClock`**. Primary may be schema 2 while recovery remains the exact original schema-1 checkpoint. The independently validated clock/registry survive primary corruption. Neither checkpoint is silently selected or overwritten on load.

A schema-2 payload retains all eight original top-level M1 fields and adds:

| Field | Meaning |
|---|---|
| `maintenanceRevision` | Positive safe integer for persistence maintenance; distinct from gameplay `revision` |
| `management` | `{initialized:false, registrySchema:1, registries:{...}}`; every live M2-A registry is empty |
| `history` | `{schema:1, commands:[protected records]}`; canonical unique P0 identities/effects, including known abandoned timeline markers |
| `migration` | Source/target schema, source profile/career IDs, source gameplay revision/treasury and source state/pending digests |

Migrating does not change original gameplay revision, financial history, conditions, names, profile/career IDs, edit flags or pending data. Initial maintenance revision is 1. Migration is maintenance, not a pseudo-economic transaction. It grants nothing and is idempotently gated by schema/revisions. Initialization is not enabled: `career.initialize` is reserved/rejected until M2-B.

## Public APIs

```js
migrateStateV1(validM1State)                  // pure builder, no writes/RNG/awards
createUninitializedCareer(explicitIdsNames) // empty schema2 foundation only
validateState(state)                        // dispatch schema1/schema2
revisionToken(state)                        // revision + maintenanceRevision (M1=0)
historyRetentionPlan(state)                 // read-only, canCompact:false
```

`createCareer(...)` remains the M1 compatibility factory so existing M1 callers/tests do not silently change format. New foundation creation after an upgraded session uses the explicit schema-2 factory. No factory initializes the starter stable.

```js
store.migrateSchema({
  confirmed: true,
  profileId, careerId,
  expectedRevision,
  expectedMaintenanceRevision // 0 for M1
});
```

This operation validates the source and candidate, then uses the existing atomic publish path. The old valid state becomes recovery. If storage fails, current gameplay state/bytes stay unchanged; manual mode requires export/ack before an explicit retry. No migration occurs merely from opening the developer panel or loading a save.

Only the existing developer treasury operation is executable in A. New schema-2 domain requests require:

```js
{
  id, commandVersion: 1, profileId, careerId,
  expectedRevision, expectedMaintenanceRevision,
  type: 'developer.treasury.adjust',
  effectId, delta, reason
}
```

`effectId` is independent of command `id`. Same command +same canonical request returns the original receipt without effects; changed payload with that ID rejects. Another command reusing a retained effect rejects. Both revision values are checked for a new request. Legacy original requests remain implicit command version 0 **only for existing identities/legacy mode**, preserving exact M1 receipt payloads. New schema-2 requests cannot omit version/maintenance/effect fields.

M2-B must derive effect identities from authorized domain sources (for example career initialization, offer fulfillment), not merely choose a new command ID to bypass a duplicate business effect. Those commands are not implemented here.

## Protected P0 records and future compaction

Each protected record retains:

- Command ID, profile/career target and command version.
- Full canonical original request and a diagnostic fingerprint. Canonical request comparison, not fingerprint equality alone, decides conflicts.
- Original result revision, independent effect ID, delta and known resulting balance (or null when no result was preserved).
- Retention class `P0`.

Original M1 receipts are unchanged. Known M1 provenance whose verbose receipt was already absent can reconstruct its exact legacy request fields; its result balance remains **null**, never guessed. Such records are tombstones, not newly executed financial transactions.

`lookupCommitted` returns a nonmutating `ALREADY_COMMITTED` acknowledgement with a null receipt where exact result replay is unavailable. It does not reapply the amount or create a replacement receipt. `assertProtectedRetention(before, after)` rejects losing identities or known effect facts. State getters expose frozen receipt/history/migration copies, and validators bind active receipts to protected request/effect facts.

- **P0:** protected identity/request/effect facts, never silently removed.
- **P1:** future summarizable detail requiring player confirmation.
- **P2:** future provably redundant detail removable only at safe maintenance checkpoints.

The current plan returns empty removal/summary lists and `canCompact:false`. M2-A performs no compaction, and active verbose receipts remain required for reconciliation. M2-E must implement its own safe eligibility/summary/maintenance protocol; do not bypass the validator by deleting receipts now.

## Ownership and foreign-key scaffold

There are 16 registries: personnel, specialists, beasts, chariots, equipment, contracts, candidates, recruitmentOffers, marketOffers, properties, facilities, projects, assignments, obligations, advancementChoices and achievements.

Foundation graph records have exactly `{id, ownerCareerId, references}`; the dictionary key must equal ID, all IDs must be unique across registries and ownership must target the active career. Only declared relations and target registry types are legal. Validators enforce no dangling targets, correct cardinalities, reciprocal installed equipment/property facilities/employment, and nonconflicting exclusive assignment references. Profile/career IDs are reserved in the live graph validation.

These are reference scaffolds, **not playable asset records**. Schema-2 M2-A careers reject nonempty registries or `initialized:true`. Typed statistics, contracts, lifecycle, capacity, asset payloads and initialization reducers must be added under M2-B authorization. Synthetic positive/negative graph tests establish the foundation contract without acquiring or granting assets.

## Import, recovery and maintenance clocks

- File selection validates/stages only; replacement still requires confirmation.
- In a protected session, schema-1 input requires the explicit migration option; downgrade is rejected. Owner Legacy is replaced in full, never merged. Known edit/P0 history remains protected by identity.
- A fresh-store import of a valid schema-2 envelope preserves all serialized values. Replacing an already loaded aggregate advances maintenance revision monotonically, while restoring the imported gameplay revision intentionally. This is not gameplay progression.
- Recovery of a retained M1 checkpoint in a protected session upgrades it explicitly back to schema 2, including the zero-command case. Maintenance advances beyond the independently sealed clock even if primary metadata is corrupt. No reward or transaction is invented.
- Mixed-schema recovery and original checkpoint seals are retained. Corrupt guards/clocks block rather than fabricate recovery facts.
- Manual exports preserve the full aggregate/registry/clock. User acknowledgement is not verification of filesystem durability.

Engineering limits are centralized or retained from M1: 2 MiB legacy file, 8 MiB protected file, 1,000 active receipts, 2,000 known provenance/protected records. No balance/package/wage/capacity coefficients were added in A. At limits, fail without pruning; use the existing manual fallback when browser quota is unavailable. The schema-2 file bound allows original large valid M1 checkpoints to be retained instead of discarded.
