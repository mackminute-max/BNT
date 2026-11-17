> **Revision 2:** Read `06_REVISION_2_DECISION_REGISTER.md` and `07_DETERMINISTIC_GENERATION_AND_NUMERIC_FIXTURES.md` first. Their explicit reconciliations supersede any conflicting older language in this document. No implementation authorization.

# M2-C — Persistence, Commands, Migration, Native Adapter Contract

## Approved version matrix (M2-C-23–26,29–32)
| Component | M2-B | M2-C approved |
|---|---|---|
| Career | 2 | 3 |
| Registry | 2 (initialized) | 3 **where structural changes require it** |
| Changed typed records | 1 | 2 |
| Unchanged typed records | 1 | 1 |
| Command protocol | 1 | 2 for M2-C; continue supporting M2-B v1 |
| Protected history | 1 | 1 unless separately approved incompatibility |
| Transport envelope | 1 | 1 unless separately approved incompatibility |
| Save discovery key | `bnt.career.save.v1` | retain |

Do not confuse commandVersion with career/registry/recordVersion. Inspect actual source for the precise location and semantics of each. Maintain ability to read M2-B v2 **without implicit migration**. Never rewrite existing M1/M2-B receipts, grants or protected identities.

## Command v2
Extend existing M2-B `store.transaction(command)` envelope:
```js
{
  id, profileId, careerId,
  expectedRevision, expectedMaintenanceRevision,
  commandVersion: 2,
  type, effectId, delta, reason,
  // strictly validated type-specific fields
}
```
Do not replace `id` with a new transaction ID or `type` with `operation`. Existing v1 commands `career.initialize`, `ru.assemble`, `ru.disassemble` continue to work. Proposed new types (final spellings to align with source conventions): `market.acquire`, `asset.sell`, `personnel.terminate`, `facility.purchase`, `service.apply`, `training.apply`, `engineering.apply`. Recruitment is part of `market.acquire` and requires contract term; no duplicate separate hire path. Define strict payload schemas and canonical effect IDs **after** auditing M2-B effect identity design; every state-changing command must have unique protected effect identity and ownership binding. Ensure no two distinct valid economic operations collide merely because they share the same revision slot; preserve M2-B's assignment slot behavior for v1 commands.

### Idempotent retry (M2-C-22)
Before stale-revision rejection, look up transaction ID and protected effect identity. Exact canonical committed retry with retained receipt returns original receipt, no write. Conflicting ID/effect/payload/ownership rejects. Protected committed identity without active receipt returns `ALREADY_COMMITTED`, receipt null, no re-execution. Unknown identity with stale revision rejects. Canonical fingerprint includes identity, ownership, versions, both revision tokens, type/effect, delta/reason if material to validated command, and all operation-specific parameters; exclude only explicitly designated presentation-only fields. Canonicalize object-key ordering, normalize numeric representation, and reject non-finite values. Preserve M2-B 1000 active receipts, 2000 protected identities and history maintenance semantics unless separately approved. Do not promise indefinite receipt recovery after pruning.

### Atomic execution
1. Validate envelope/version and canonical identity.
2. Resolve committed identity/retry/conflict before stale revision check.
3. Validate both expected revisions and ownership.
4. Validate source record versions, native allowlists, assignment/capacity and funds/XP.
5. Compute all costs and effects from approved versioned rules; stage state + receipt.
6. Validate complete aggregate including protected history and native adapter compatibility.
7. Commit once through existing CareerStore atomic publish. On failure preserve original authoritative bytes/state/history; no partial offer consumption, debit, XP, engineering or receipt.

## Explicit migration M2-B career v2 → M2-C career v3 (M2-C-16–20,24–26,29–30)
Migration is owner-confirmed, previewable, versioned, deterministic and atomic. Ordinary load, import preview, inspection, save export and read-only UI must never trigger it. Preflight export backup recommended. No new starter grant, no fictitious acquisition transaction, no history rewriting.

**Preview**: Pure function of validated source snapshot, explicit migration rules version, market-generator version and verified native adapter versions. Display source/target versions; current Gold; grandfathered contracts/wages; starting asset valuation/basis; descriptive facility preservation; market 23-offer manifest; diagnostics. Preview must not write, reserve offer IDs, advance RNG, or create receipts.

**Confirmation**: Require explicit owner action. Compare both `expectedRevision` and `expectedMaintenanceRevision` AND canonical fingerprint of migration-relevant source state (career ownership, schemas, Gold, records/native attributes/condition, assignments, capacities, protected history, receipts and grant identities). Also require matching migration/adapter/generator versions. If any mismatch, invalidate and require new preview. Revalidate complete source and staged target before atomic commit and protected migration receipt.

**Repeat behavior**: A migrated career never regenerates market, contracts, valuations or facilities. Exact migration retry follows protected identity semantics. Restored pre-grant checkpoints remain blocked from re-grant. Migration of a career whose protected grant is consumed but whose owned starting assets are absent must fail closed, not reconstruct assets. Migration cannot erase protected history. Verify import/recovery behavior against source's maintenance revision.

**Source packages**: Traditional 1200 G, 1 driver, 2 beasts, 1 chariot; Beastmaster 850 G, 1/3/1; Mechanist 800 G, 1/2/1; Veteran 650 G, 2/2/1; Scrappy 750 G, 2/3/1. All share Basic capacities 2 drivers, 0 specialists, 4 beasts, 1 chariot. M2-B descriptive facilities remain descriptive-only, including a facility named 'Workshop Shed'—it is not a purchased Workshop. M2-B has **two actual owned, installed equipment records per package**, source-verified by Codex. Preserve their stable IDs and reciprocal installation references; attach deterministic acquisition basis without creating additional items.

## Native field allowlists (M2-C-15,20,34)
- Driver ratings: `driving`, `beastHandling`, `combat`, `awareness`, `nerve` (0–100); native `condition` 0–100, `strain` 0–100. Management fatigue and injury separate.
- Beast ratings: `speed`, `power`, `agility`, `endurance`, `discipline`, `toughness` (0–100); native `condition`, `fatigue` 0–100; management injury separate.
- Chariot ratings: `stability`, `durability`, `protection`, `rollingEfficiency`, `maneuverability` (0–100); native `condition`, `wear` 0–100; `weight` 1–5000, `capacity` 1–10000; **NO native `integrity` field**. Management integrity/status separate.
- Native equipment aggregate `{mass:0, combat:0}`; no item slots or mechanical item bonuses approved.
- Native RU adapter strips management metadata and retains exact native values. No implicit driver fatigue→strain, injury→condition, chariot integrity→condition, or equipment-label→bonus conversion.

## Mandatory adapter evidence before implementation acceptance
For each asset type, implement the explicit **Revision 2 design-selected valuation-health H contract** (0–100), with source verification of fields, formula, bounds, version and tests. No inferred averaging or fallback. For chariot especially, document relationship of management integrity, native condition and native wear for repair/refurbishment and valuation. Do not silently change race engine behavior. If approved repair effect cannot be represented coherently in current management records and native adapter, report blocking discrepancy and request owner clarification **before** coding that behavior. Same rule for any recovery effect on condition/eligibility. These are technical dependencies, not permission to substitute new game mechanics.

## Open compatibility questions requiring source inspection
- Exact versioned record shapes, validators and mutation extension points.
- Current canonical command fingerprint/effect ID, receipt retention and history caps.
- How source records represent 'injury' and chariot management `integrity` and whether legal mutation exists.
- Starting equipment is itemized (two records per package); verify exact installation reference shape and preserve it.
- Source-specific original condition/quality valuation basis and deterministic market seed construction.
- Browser storage quota and 8 MiB import limit compatibility for expanded career state.

Do not treat this document as evidence that these mappings have already been verified against the current checkout.
