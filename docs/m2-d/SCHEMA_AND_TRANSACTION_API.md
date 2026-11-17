# M2-D schema and transaction API

Authority: [Implementation Authorization Revision 1](authority/00_START_HERE.md). Dedicated branch `feat/m2-d-payroll-lifecycle`, based on accepted M2-C `f66ec90a6659dd6bb675815bff4cc33e9850a643`. Review delivery only; no owner acceptance, merge or push is claimed.

## Version boundaries

| Component | Contract |
|---|---|
| Career / management registry | New 4 / 4, original 1/2/3 still validated by their original code |
| Driver / contract record | New 3; driver adds explicit nullable personality; contract adds duration, lifecycle, emergency, previousContractId |
| Other owned records | Existing 2; prospective assignments/descriptive facilities retain 1; specialists keep unchanged owned shape 2 |
| Cycle aggregate / completion / obligation / statement | Independent version 1, rules `m2d-cycles-v1` |
| Gameplay command | New 3 alongside unchanged economic v2 / assembly and developer v1 / legacy |
| Protected migration | Distinct `kind:'cycle-migration-maintenance'`, record 1, explicit 3→4 only |
| Protected gameplay | `kind:'cycle-gameplay'`, record 1, commandVersion 3 |
| Outer transport envelope / history / discovery | Remain 1 / 1 / `bnt.career.save.v1` |
| Native payroll adapter / emergency catalog | `payroll-control-v1` / `m2d-emergency-driver-v1` |
| Engine/package/replay | Remain `0.6.0-tracks` / `0.6.0` / 1; new context is independently versioned, absent by default |
| Limits | 1000 receipts, 2000 total protected identities, 8 MiB envelope; no pruning |

No original M1 factory, M2-A/B schema validator, M2-C schema-3 validator, 2→3 migration, historical command or receipt was changed. The graph compatibility projection is validation-only: it never becomes a save, receipt, native race input or migration grant.

## Explicit migration

```js
const p = store.previewCycles(); // frozen, pure, schema-3 source only
store.migrateCycles({
  id: 'unique-migration-id',
  profileId: store.state.profile.id,
  careerId: store.state.career.id,
  type: 'career.cycles.migrate', maintenanceVersion: 1,
  expectedRevision: p.expectedRevision,
  expectedMaintenanceRevision: p.expectedMaintenanceRevision,
  sourceSchema: 3, targetSchema: 4,
  sourceFingerprint: p.sourceFingerprint,
  rulesVersion: 'm2d-cycles-v1',
  effectId: cycleMigrationEffect(store.state.career.id),
  confirmed: true
});
```

`cycleMigrationEffect` is exported from `src/career/cycles/contracts.js`. A domain-separated SHA-256-derived stable identity binds the career and 3→4 transition. Migration retains the complete validated schema-3 origin and source fingerprint, preserves Gold/assets/native ratings/current receipts, advances maintenance once, and adds lifecycle metadata. It creates no wages, cycle, income, recovery, market refresh or assets. Preview/load/import/export/navigation never migrate. Retained acknowledgment retry performs no write; a maintenance tombstone returns `ALREADY_COMMITTED`, null acknowledgment and no replay. Different request IDs cannot repeat the effect. Previous valid source is retained for recovery; after lifecycle effects, that older source cannot be restored over known effects.

## Cycle state

`state.cycles` has exact fields:

```js
{
  version: 1, rulesVersion: 'm2d-cycles-v1',
  origin, migrationRequest, manifestDigest,
  number: 0, streak: 0, phase: 'STABLE_PREPARATION',
  obligations: {}, creditors: {}, contractArchive: {}, statements: {}
}
```

Archives live under `cycles`, not in the old live-FK `management.registries.obligations`. Each wage obligation records `kind:'wage-obligation'`, version, ID/career/championship/cycle, immutable creditor ID/name/role, historical contract ID, original/paid/balance Gold, and payment allocations. Historic creditors/contracts are independent snapshots; deleting live employment never creates dangling live links or deletes claims. Aggregate reconstruction validates every effect, amount and archive from the immutable origin and receipts. No free-form saved-state mutation API exists.

Each schema-4 contract has `recordVersion:3`, original M2-C fields, `duration`, `lifecycle:'active'|'expired-pending-decision'`, `emergency:boolean`, and `previousContractId:null|id`. Renewal archives the former identity and creates a new identity. Expired assigned people stay visible and cannot be entered. Explicit release can disassemble the selected employee's assignment only after an explicit request/confirmation; automatic departure never does so.

## Commands and pure quotes

```js
const quote = quoteCycle(state, type, payload);
const command = {
  id, profileId: state.profile.id, careerId: state.career.id,
  expectedRevision: state.revision,
  expectedMaintenanceRevision: state.maintenanceRevision,
  commandVersion: 3, type,
  effectId: quote.effectId, delta: quote.delta,
  reason: 'Player-confirmed action', payload
};
store.transaction(command); // settlement additionally requires a trusted completion capability
```

| Type | Exact payload | Effect |
|---|---|---|
| `cycle.settle` | `{completion,sourceFingerprint}` | Once per career+championship; trusted capability required on initial execution |
| `payroll.pay` | `{amount}` | Positive exact Gold, not above available treasury or debt; oldest first |
| `contract.renew` | `{personId,term}` | Expired ordinary contract only; short/standard/long M2-C signing/wage terms; blocked at Critical/Default |
| `contract.release` | `{personId,resolveAssignment}` | Expired employee only; explicit assignment resolution; historical debt remains |
| `emergency.request` | `{}` | Explicit fixed-profile driver-only event; one active max; ordinary driver capacity and shortage/recruitment gates |
| `career.confirmFailure` | `{sourceFingerprint,confirmed:true}` | Proven FailurePending only; irreversible gameplay terminal state with retained history |

`sourceFingerprint(state)` from `cycles/reducers.js` binds profile/career, treasury/status, both revisions, management and cycle source state. Quotes stage isolated clones and are deeply frozen. Reducers recompute all costs/effects/eligibility. Canonical duplicate lookup precedes stale-revision rejection. Same ID/different payload rejects; settlement identity is independent of request ID; other actions bind career/action/dual revision. All receipts have `{transaction,resultRevision,balanceAfter,result}` except original developer commands, whose historical shape remains unchanged. `result` is `{type,cost,delta,details}` with strict action-specific protected detail validation; authoritative state validation additionally reconstructs exact results.

Use `quoteEconomy4` for existing v2 economic commands on schema 4. It retains M2-C quotes/prices/discounts and adds preparation/Failed/debt restrictions. The reducer checks again. Schema-3 callers still use the original `quoteEconomy`. Assembly/developer v1 remains compatible under schema 4, except expired drivers cannot assemble/enter and Failed careers reject new gameplay edits.

## Trusted completion boundary

There is **no live championship controller or production completion producer**. No completion/reward entry UI is shipped. Standalone races do not settle or advance cycles.

`createCompletionBoundary(verifyAuthoritativeResult)` is a future-controller source seam; it is not exported on `window.BNT` or imported by the UI. The verifier must match an immutable authoritative result registry, not blindly return true or trust user JSON. Its `accept(record)` returns a frozen object branded in a private WeakSet. The initial settlement requires that exact capability:

```js
const completion = futureBoundary.accept(authoritativeResult);
const payload = {completion, sourceFingerprint: sourceFingerprint(store.state)};
const quote = quoteCycle(store.state, 'cycle.settle', payload);
// Construct command above from quote and current dual revisions.
store.transaction(command, {completion});
```

A cloned/JSON-decoded record alone is not a runtime capability. A mismatched capability/command rejects. Historical receipt validation checks serialized strict data and reconstruction without re-crediting income or requiring a live producer. Checksums and local capabilities do not authenticate a maliciously edited complete client save; no backend/cross-device authority is claimed.

Completion exact fields:

```js
{
  kind: 'BNT-championship-completion', version: 1,
  profileId, careerId, championshipId,
  outcome: 'Completed', // or Withdrawn / Disqualified
  completedOnce: true, state: 'CHAMPIONSHIP_COMPLETED',
  roster: [{contractId, personId, wage, cyclesRemaining}],
  rulesVersion: 'm2d-cycles-v1', resultVersion: 1,
  rewards: [{id, amount}], authority,
  sourceFingerprint // SHA-256 canonical record with sourceFingerprint:null
}
```

`contractSnapshot(state)` returns ID-sorted active contract records. The completion must match the current active roster/terms and owner IDs; each reward ID is unique and amount is exact nonnegative safe-integer Gold. The future controller must bind this registry to championship entry/terminal results. `tests/m2-d-helpers.js` is the explicitly synthetic fixture producer; it is never included in production HTML. There is no invented reward schedule or race-result application.

## Frozen settlement order

1. Validate completion, source fingerprint and once-per-championship identity.
2. Credit validated income; overflow rejects.
3. Pay existing claims in originating-cycle/personnel-ID/obligation-ID order.
4. Assess all active contractual wages, including reserves and specialists; current wages paid in employee-ID order.
5. Update unpaid-settlement streak/status; zero debt resets immediately.
6. Recover extant driver management fatigue (-20), beast native fatigue (-20), and Major→Minor/Minor→Healthy injuries; Critical unchanged. No strain/integrity/wear changes.
7. Decrement active contracts once; final wage precedes zero-term expiry.
8. At streak 5+, consider at most one active unpaid employee for departure, greatest personal debt then ID. Assigned candidates are deferred; last currently entry-eligible contracted driver is protected. Eligibility sees post-recovery/post-expiry state. Deferred reasons are recorded.
9. Freeze the complete deterministic statement into the candidate and publish once atomically. UI derives preparation/viability from that committed state.

Old claims survive expiry, release, departure and failure. New hires are first charged on the next settlement. No payroll per race, day, UI refresh or departure; no facility upkeep. Full voluntary repayment resets streak immediately. All essential care/recovery/repair/refurbishment, lawful sales, repayment and existing legal termination remain available under debt; recruitment/purchases/upgrades/training/engineering are blocked from Delinquent onward. Ordinary renewal is blocked from Critical onward. Emergency contracts have no ordinary M2-C term/early-termination fee; they cannot use ordinary renewal/termination and can be explicitly released at one-cycle expiry. No unapproved fee was invented.

## Payroll control and entrant commitment

`commitEntrant(state,championshipId,selection,{assignmentId})` produces a frozen native RU plus versioned `payrollContext`. Reuse this championship commitment, not mutable preparation status, for the championship's race inputs. Context fields: `{version:1,rulesVersion:'payroll-control-v1',careerId,championshipId,status,multiplier}`. Current/Overdue use 1, Delinquent .95, Critical .90, Default .85. Emergency driver profile has five ratings 40, condition 100, Healthy, zero fatigue/strain/XP, six tendencies 50, zero signing Gold and one 20 G next-cycle wage.

The engine applies the multiplier only to native-derived effective control, clamped 0–100, at initial derivation, every dynamic derivation and paused overrides. Native ratings/condition/strain/personality and other entrants are unchanged. Crowd/weather derivation remains separate. Context is copied per entrant and serialized in race setup/replay/configuration. Missing context adds no properties and follows the original numerical path; 12 historical captures remain exact. No full career-to-race controller is implied.

## Failure and restoration

`assessViability` returns Operational, Blocked, FailurePending or Failed. Operational can be achieved by assembling owned legal components after explicitly resolving assignments. FailurePending is a derived/revalidated state, not an automatic terminal write. The proof uses an optimistic superset of all owned beasts/chariots and remaining offers, ignoring affordability/condition: if fewer than two possible beasts or zero possible chariots exist, no permitted action can supply a legal RU. Emergency assistance cannot supply those resources. All other unproven irrecoverability cases remain Blocked. No Gold/debt/injury/expiry-only failure inference or unsafe exhaustive search is used. Failure confirmation rechecks the proof and source fingerprint, then retains all assets/liabilities/history in a read-only Failed career.

Restoration retains protected identities globally. Any checkpoint missing a known post-3→4 gameplay/lifecycle effect is rejected with `UNSAFE_CYCLE_RESTORE`; identities alone never stand in for absent debt/renewal/grant/failure state. A corrupt primary may expose an older recovery checkpoint, but confirming unsafe recovery fails without writing/quarantine loss. Export current valid state/raw diagnostic, or explicitly import a complete validated newer backup. No synthetic recovery transaction, reward replay or implicit checkpoint selection occurs. A wholly older file in a fresh installation cannot disclose unknown future facts absent from every supplied source.
