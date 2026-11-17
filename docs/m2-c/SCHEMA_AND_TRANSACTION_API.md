# M2-C schema, migration and transaction API

Authority: Revision 2.1 in [authority](authority/00_START_HERE.md), followed by the owner's explicit M2-C production authorization. M2-D/E and M3 are excluded.

## Versions

| Component | Current contract |
|---|---|
| Racing engine / package | Unchanged `0.6.0-tracks` / `0.6.0` |
| Career state | 1 and 2 remain readable unchanged; explicitly migrated economy state is 3 |
| Registry | 1 for empty foundations, 2 for M2-B, 3 for M2-C |
| Records | Changed owned/property/contract/market/upgrade records 2; unchanged prospective assignments/descriptive facilities 1 |
| Gameplay commands | Existing legacy/v1 preserved; economic actions v2 |
| Migration maintenance | Separate maintenance request version 1 and protected record version 1; not gameplay command v2 |
| Protected outer history / transport envelope | Both remain 1 |
| Save discovery | `bnt.career.save.v1` unchanged |
| Rules / migration | `m2c-economy-v1` / `m2c-migration-v1` |
| Valuation / generator | `valuation-health-v1` / `market-generator-v1` |
| Generator algorithm | `fnv1a32-utf8-mulberry32-rejection-v1` |

`createCareer` remains the original M1 factory; `createUninitializedCareer` remains explicit empty schema 2. New careers receive the approved M2-B package first, then explicitly preview/confirm economy migration. No factory, load, import, export or navigation silently initializes a market or grants resources.

## Additive protected registry

`src/career/history.js`, `legacy-state.js` and `schema2.js` are unchanged. New `economy/protected-registry.js` dispatches legacy entries to the original strict validator, economic v2 entries to their strict validator, and maintenance entries by an exact `kind:'migration-maintenance'` discriminator. Unknown shapes still reject.

Maintenance entries contain canonical request text, SHA-256 fingerprint, career/profile identity, stable migration effect, unchanged gameplay revision, resulting maintenance revision, manifest digest, optional acknowledgment and P0 retention. They are not appended to `transactions`. Original gameplay entries/receipts are never rewritten.

Global envelopes retain all known variants. A historical schema-2 checkpoint receives only compatible legacy gameplay history in its state projection; the full maintenance/economic registry remains protected at envelope level. This lets explicit import/recovery retain future facts without changing old validators. Owner conflicts still reject.

## Explicit migration

```js
const preview = store.previewEconomy(); // frozen, pure, no writes
store.migrateEconomy({
  id, profileId, careerId,
  type: 'career.migrate', maintenanceVersion: 1,
  expectedRevision: preview.expectedRevision,
  expectedMaintenanceRevision: preview.expectedMaintenanceRevision,
  sourceSchema: 2, targetSchema: 3,
  sourceFingerprint: preview.sourceFingerprint,
  migrationVersion: preview.migrationVersion,
  adapterVersion: preview.adapterVersion,
  generatorVersion: preview.generatorVersion,
  confirmed: true,
  effectId: migrationEffect(careerId)
});
```

The effect is `migrate-${careerId}-2-3`, independent of request ID/fingerprint. Thus a restored timeline with a different source fingerprint cannot regenerate the economy. Confirmation checks the complete canonical source SHA-256, ownership, both revisions and all versions. The deterministic target manifest is bound by a second SHA-256 digest.

Migration requires validated initialized M2-B assets, no pending checkpoint and Healthy legacy driver/beast injuries. Nonhealthy inputs return `UNSUPPORTED_LEGACY_INJURY`; no conversion or resurrection occurs. Consumed grants with absent assets cannot be reconstructed.

Success preserves Gold, native attributes, IDs, labels, assignments, original gameplay receipts, developer provenance and M1 migration lineage. It advances maintenance once, leaves gameplay revision/receipt count unchanged, adds metadata/contracts and creates the 23 offers once. The previous valid source is retained as recovery.

Exact retry returns the original maintenance acknowledgment without writing. If only the protected identity remains, it returns `ALREADY_COMMITTED` with null acknowledgment. Conflicting IDs/effects reject. There is no compaction executor or invented recovery transaction.

## Gameplay commands

All M2-C economic operations use:

```js
{
  id, profileId, careerId,
  expectedRevision, expectedMaintenanceRevision,
  commandVersion: 2,
  type, effectId, delta, reason,
  payload
}
```

Use `quoteEconomy(state,type,payload)` to obtain the authoritative cost, proceeds, XP requirement, delta, effect ID, affordability and detailed effects. Quotes are frozen and pure. `store.transaction(command)` validates the request, resolves exact retained retries, checks both revisions, recomputes the quote, stages effects and validates the entire aggregate before publication. Client-provided deltas/effects cannot override the quote.

| Type | Exact payload |
|---|---|
| `market.acquire` | `{offerId,term}`; term `short/standard/long` for personnel, `null` for owned assets |
| `asset.sell` | `{assetId}` |
| `personnel.terminate` | `{personId}` |
| `equipment.detach` | `{equipmentId}` |
| `facility.purchase` | `{propertyId,upgradeId}` |
| `service.apply` | `{assetId,service,amount}`; positive requested integrity for repair, otherwise `null` |
| `training.apply` | `{assetId,attribute,points}` |
| `engineering.apply` | `{assetId,attribute,points}` |

Payloads reject unknown fields, invalid IDs, nonfinite numbers, unsupported native attributes and out-of-range increments. Economic receipts include deterministic `{type,cost,delta,details}` results. Protected-result shape, target and debit/credit consistency are checked even if an active receipt was lost; active results are additionally reconstructed from their source state.

Acquisition, resale, termination, detach and permanent upgrades use once-only business identities. Repeatable service/training identities bind target/action and both revision tokens. Engineering binds the chariot's lifetime increment slot, preventing old-save restores from bypassing consumed engineering slots. IDs use a canonical SHA-256 domain key rather than the command ID. The existing M2-B assignment-slot effect remains unchanged for v1 RU commands.

## Owned state and validation

Schema 3 retains the complete validated schema-2 origin under `economy.origin`. This anchors grant/identity/financial lineage. Validation reconstructs migration and subsequent gameplay effects, checks immutable market/template/basis data, reconciles Gold/XP and permanent ledgers, and validates current reference/capacity integrity. Historical assignment validity is distinct from current injury eligibility.

- Personnel and beasts retain native ratings/condition and separate management injuries; drivers retain management fatigue distinct from native strain.
- Chariots retain native condition/wear, separate integrity/status and original base ratings plus engineering increments/spent-Gold ledger.
- Economics metadata records explicit tier/quality, original base ratings/health, acquisition basis, source offer and personnel wage facts.
- Training increments and engineering increments reconcile with native ratings; no training changes wages or resale quality.
- Installed equipment has neutral effects and reciprocal references. Detach clears both ends; installed-item or equipped-chariot sale rejects.
- Contracts bind one employee reciprocally. Termination requires an unassigned employee, pays the approved fee, removes current employment/roster records, and preserves its receipt/history. No wage accrual/expiry occurs.
- Property capacities equal Basic plus purchased upgrades. Descriptive starting facilities remain descriptive and cannot grant discounts/capacity.
- Acquired offers retain their explicit tier even if their rating mean belongs to a different starter-classification band.

Restoring an older schema-3 checkpoint retains known fulfilled offers as unavailable. This projects retained fulfillment facts only: it does not replay their Gold debit or recreate absent assets. Other retained once-only business effects likewise prevent duplicate benefits. A pre-migration recovery can leave a schema-2 career with migration already consumed; restore a valid post-migration external backup rather than regenerate its economy.

## Exact economics and native adapters

Prices use canonical decimal rationals and explicit half-up/ceiling/floor rules. Native ratings are not rounded to select training bands. Increment cost is summed per starting rating before final XP discount rounding. Arbitrary finite fractional inputs, including high-precision/subnormal inputs, are covered by numerical tests.

`valuation-health-v1`: driver/beast H is native condition; chariot H is management integrity. Invalid or absent H rejects. Repair changes integrity/status only; refurbishment changes native wear only; driver recovery changes management fatigue only; beast care changes native beast fatigue; treatment changes schema-3 management injury only.

Schema-3 `previewRU3` strips management metadata and calls the unchanged native validator/derivation. It is a baseline/no-weather/no-surface estimate, not race entry. Schema-2 `previewRU` remains unchanged. No stable-to-race entry or result bridge is added.

## Generator freeze

Seed material is UTF-8 `BNT|M2-C|market-generator-v1|<careerId>`. Standard FNV-1a-32 derives the unsigned seed; Mulberry32 generates unsigned words; rejection sampling maps uniformly into inclusive ranges. Offers use category/tier/ordinal order, ordinal starting at 1 within each category/tier. Draw order: native ratings in existing attribute-array order; native condition; chariot integrity; quality; personnel wage quality. Zero-valued defaults do not consume draws.

Four full golden manifests and raw-word vectors are checked in at `tests/data/m2-c-market-v1.json`, generated once with an independent Python unsigned-integer/Decimal reference. Tests never regenerate them. Python is optional development evidence tooling, not a runtime or test-suite dependency.

## Persistence limits

Keep 1000 active gameplay receipts, 2000 total protected identities including maintenance, and the 8 MiB complete-envelope import bound. No P0 pruning. Browser quota may be lower. Atomic publish/stale-byte checks, Web Locks where available, manual export acknowledgment and explicit recovery remain. Download requests are not proof of durable saving.

Checksums/fingerprints are integrity/identity diagnostics, not a backend authentication service. Full replay validation incurs growing work with history size; long-career compaction remains outside M2-C. A wholly older backup in a fresh installation cannot reveal later history absent from every available source.
