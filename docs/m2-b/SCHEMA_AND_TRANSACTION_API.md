# M2-B schema and transaction API

Authority: [FINAL_CODEX_AUTHORIZATION.md](FINAL_CODEX_AUTHORIZATION.md), owner-approved Draft 3. M2-B only.

## Compatibility boundary

Career schema remains **2**, transport envelope **1**, discovery key `bnt.career.save.v1`, command version **1**, protected history schema **1**. M1 `legacy-state.js` and its factory are unchanged. Old uninitialized schema-2 states retain `registrySchema:1`; successfully initialized stables use `registrySchema:2`. Typed records have `recordVersion:1`. No migration or grant runs implicitly on load/import/preview.

No existing M1 receipts or protected records are rewritten. New domain receipts and protected records additionally contain a validated deterministic `result`. Developer commands retain their old shape and provenance. Domain commands do not mark a career developer-edited. M1's ledger validator is reused through a local validation-only projection; synthetic validation marks are never saved, exposed, or added to real provenance.

## Typed records

Every owned record has `{id, ownerCareerId, references, recordVersion, name}`. The existing global-in-aggregate ID, owner, typed foreign-key, cardinality and reciprocal-reference checks remain enforced.

| Registry | Additional payload |
|---|---|
| personnel | `role:'driver'`, native `attributes`, `condition`, injury label, management `fatigue`, separate engine `strain`, `xp:0`, `available` |
| beasts | management-only `species:'generic_draft_beast'`, native `attributes`, `condition`, injury label, `fatigue`, `xp:0`, `available` |
| chariots | native `attributes`, `condition`, `wear`, separate management `integrity`/`status`, weight, capacity, `xp:0`, `available` |
| equipment | `mass:0`, `combat:0`; labels only, no slots or bonuses |
| properties | `tier:'Basic'`, exact Basic capacities, immutable `packageId`, `catalogVersion:3` |
| facilities | `descriptiveOnly:true`; reciprocal property reference, no numerical effects |
| assignments | `kind:'prospectiveRU'`, `driverId`, two distinct `beastIds`, `chariotId`; four subject references |

Personnel, beasts and chariots have at most one `references.assignment`; assignment subjects and these reverse links must agree. Installed equipment and property/facility links remain reciprocal. Other registries remain empty.

In M2-B, base assets must match their approved initialization grant, and assignment state must reproduce committed assembly commands. There is no general asset editing, damage/recovery lifecycle, grant/import bypass, or progression API. Condition-label and native-threshold previews are read-only; no automatic conversion between injury labels and native condition, management fatigue and strain, or management integrity and native chariot condition occurs.

## Commands

All three new commands use `store.transaction(command)` and require the common fields:

```js
{
  id, profileId, careerId,
  expectedRevision, expectedMaintenanceRevision,
  commandVersion: 1,
  type, effectId, delta, reason,
  // Type-specific fields below.
}
```

`career.initialize` adds `{packageId, catalogVersion:3, confirmed:true}`. `delta` must equal the approved package grant. `initializationEffect(careerId)` yields `initialize-${careerId}`, independent of attempt/package. Full source validation, zero treasury, uninitialized empty registries, no active-career transactions/edits/protected facts and no pending checkpoint are required. Only other-career Owner Profile provenance is permitted.

Initialization creates all approved records, their references and one prospective RU, advances gameplay revision once, leaves maintenance revision unchanged, and records a result containing package/catalog identity, explicit treasury grant and sorted granted record IDs. Validation reconstructs these facts from the fixed catalog. Package purchase price is zero; no debit or fictitious developer edit is recorded.

`ru.assemble` adds `{assignmentId, driverId, beastIds:[a,b], chariotId}` with `delta:0`. It creates/replaces a prospective assignment, validates ownership/availability/condition/exclusivity, and updates reciprocal subject links. `ru.disassemble` adds `{assignmentId}` with `delta:0` and releases links without removing assets. No competition entry occurs.

Assembly effect IDs use `assignmentEffect(careerId, expectedRevision, expectedMaintenanceRevision)`: `assembly-${careerId}-${revision}-${maintenanceRevision}`. One operation can occupy each authoritative revision-token slot. Retries retain the same canonical request and effect; changed IDs cannot reuse that slot. A later import/recovery advances maintenance, allowing a genuinely new operation on a restored timeline while old operations remain protected. Both commands return `{assignmentId, assembled}` in their result.

Exact duplicate requests return the original receipt without writing. When a protected operation's active receipt was lost through explicit restoration, the result is `ALREADY_COMMITTED` with null receipt; no result or grant is recreated. Conflicting IDs, effects, revisions, payloads and ownership reject before publish.

## Pure APIs

- `STARTING_PACKAGES`: deeply frozen approved catalog.
- `buildPackage(careerId, packageId)`: isolated deterministic template, no storage/RNG effects.
- `initializationResult(careerId, packageId)`: canonical grant manifest.
- `previewRU(state, selection, {assignmentId})`: frozen eligibility/native/derived view.
- `validateTypedRecord`, `validateManagement`: bounds and aggregate invariants.

`previewRU` distinguishes persisted assembly from eligibility. It strips management metadata and uses the unchanged native `validateRU`/`derive(config())`. Its result is explicitly a **baseline / no weather or surface adjustment**, not a racing prediction or competition commitment. Driver management fatigue is not mapped. Equipment is aggregated through the existing neutral engine fields only.

## Persistence guarantees and limits

Existing `CareerStore` atomic publish, stale-byte detection, manual export/acknowledgment, recovery confirmation, maintenance clocks and sealed global protected history are reused unchanged. Known initialization survives import/recovery, including schema-1 backups. Recovering a pre-grant checkpoint can leave an uninitialized career whose protected grant is already consumed: it is intentionally blocked from re-granting, without invented recovery assets or transactions. Use a valid post-initialization external backup when available.

Old applications do not understand the new typed registries/domain commands. Export backups before changing application versions. Checksums are corruption detection, not authentication. A wholly old file in a fresh browser with no retained later history cannot reveal facts absent from that file. Deterministic starter IDs are career-derived using the existing checksum and fixed tags, with aggregate collision/ownership validation; they are not cryptographic global identities. No backend authority is claimed.

Existing limits remain: 1,000 active receipts, 2,000 protected identities, 8 MiB schema-2 import bound, and browser-dependent storage quota. No history compaction, later-stage lifecycle or new dependencies are added.
