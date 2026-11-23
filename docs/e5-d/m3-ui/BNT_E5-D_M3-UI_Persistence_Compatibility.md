# M3-UI active selection compatibility contract

Before implementation: mechanical career schemas and protected command formats remain unchanged. The existing career-presentation envelope sidecar gains version2, retaining all version1 fields and adding `activeTeam:{version:1,driverId:string|null,beastIds:[string|null,string|null],chariotId:string|null}`. The sidecar profile/career identity, monotonic revision, immutable cohort/pack pin and independent radio preference remain enforced. Existing version1/unmarked saves remain readable and are not rewritten merely by navigation. Initial view derives the existing assignment until the first explicit Barn change.

An explicit Barn change validates selected ownership/component eligibility under the existing domain rules. A complete legal selection runs the existing protected `ru.assemble`; an incomplete selection removes the prior assignment with `ru.disassemble` and retains the partial lineup in the sidecar. Both changes publish in a single existing CareerStore envelope write / IndexedDB generation transaction. No fee or reward is introduced. Imported primary selection references must be owned; recovery state is historical and does not require newly acquired selection references. Recovery/import cannot silently remove a newer sidecar revision or immutable pin. A selected partial asset must be deactivated before selling/removing it; validation rejects dangling primary references.

Older readers reject sidecar-v2 rather than silently discard it. New readers preserve both versions in career-only export, complete backup, import and recovery paths. Active/unsettled championships lock Barn edits using the existing management policy. Registration consumes only the current existing legal assignment and snapshots its native composition through the accepted E5 registration command. No registration, native rules, financial-history or mechanical-schema migration is added.

## Exact sidecar example

```json
{
  "kind": "BNT-career-presentation",
  "version": 2,
  "profileId": "existing-profile-id",
  "careerId": "existing-career-id",
  "revision": 2,
  "cohort": "legacy",
  "identityPack": null,
  "radio": {"version": 1, "enabled": false},
  "activeTeam": {
    "version": 1,
    "driverId": null,
    "beastIds": ["owned-beast-1", "owned-beast-2"],
    "chariotId": "owned-chariot-id"
  }
}
```

Illustrative IDs only. The existing sealed envelope contains this sidecar; it is not an independent storage key. Unknown fields, unsupported versions, invalid/null array shapes, duplicate identities, foreign profile/career and missing/foreign primary asset references reject. New-career cohorts retain their existing immutable pack version/digest and radio default ON. An unmarked old career first edited in Barn becomes cohort `legacy` with radio OFF; it is not retrofitted into a new identity pack.

`setActiveTeam` accepts exactly `kind`, `assetId`, `slot`, `id`, `expectedRevision`, `expectedMaintenanceRevision`, `expectedPresentationRevision`. Kinds are personnel/beasts/chariots; slot is null/0/1. Existing revision checks, Web Locks, expected generation/read-set checks and storage publication apply. An identical stale retry rejects instead of toggling an asset a second time. No financial effect is duplicated.

A partial selection without an assignment changes the sidecar revision, not the mechanical career revision. A complete assembly/disassembly additionally uses the original protected receipt/effect semantics. No new command schema, receipt format, cap or financial authority is introduced.

## Atomicity

1. Validate current ownership, revisions, restrictions and component eligibility.
2. Build an isolated synchronous CareerStore candidate with the existing full validators.
3. Execute the existing assemble/disassemble command where required.
4. Validate the new sidecar and combined envelope.
5. Publish once through the existing selected authority; IndexedDB commits the career/session read-set and generation transaction.
6. Only then refresh the accepted lineup. Failure leaves the previous authoritative assignment/selection intact. Storage denial is reported; manual-mode changes cannot claim durability.

Selected partial components must be deactivated before selling/releasing them. Otherwise primary ownership validation rejects the operation before publication, preserving the old authority. No new price or economic effect is added.

## Format matrix

| Input/path | Candidate behavior |
|---|---|
| Envelope1, no sidecar | Remains readable; view derives existing assignment without writing |
| Envelope2, sidecar1 | Remains readable; immutable pack/radio semantics unchanged |
| Envelope2, sidecar2 | Strict ordered selection/ownership/revision validation |
| Career-only export/import without required external sessions | Retains sidecar2, IDs and protected history; tested against legacy/economy career formats |
| Career-only replacement with retained external sessions | Existing complete-backup requirement remains; no session evidence discarded |
| Complete backup/restore | Retains selection, pin, preference, runtime cosmetics, protected history, journals and native proof |
| Recovery checkpoint | Keeps historical mechanical state; the shared sidecar's selected ownership is checked against primary, not assumed present in a historical recovery snapshot |
| Older/missing sidecar rollback | Rejects loss/downgrade of newer selection or pack pin; no silent combination |
| Sidecar2 read by older P1 software | Unsupported version rejection; not forward-compatible |

Manual Save Game verifies the existing durable generation and full authority; it performs no financial transaction, reward, checkpoint or new generation commit. Pending operations must finish or the action rejects/waits safely. Race memory progress is explicitly excluded. Page navigation never creates a save operation.
