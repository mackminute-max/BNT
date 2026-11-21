# BNT — E5-B Lifecycle and Authority Contract

This document describes the implemented versioned extension, not an authorization for E5-C or later work.

## Authorities and versions

- Existing native simulator, D2 Mapping v1 and E3 classification/publication remain authoritative for races.
- Existing E4 IndexedDB generation/read-set transaction is the durable publication boundary. A worker response alone is not durable.
- Career schema 6 is explicitly enabled from accepted schema 5/E3. Existing envelope version 1, schemas 1–5 and commands 1–4 retain their historical interpretation.
- E5 commands use commandVersion 5 and rules `m2-e5-b-v1`.
- Reward offers use `BNT-reward-offer` version 1 and catalog `e5b-placeholder-rewards-v1`.
- No new Legacy Point amount or mechanical reward effect is introduced. Three Legacy loadout slots are represented read-only; equip mechanics are not implemented.

## Lifecycle

`E5 enabled → offered → registered → manually prepared → native race → durable native clearance → protected official publication → intermission or AI continuation → complete frozen schedule → SETTLEMENT_PENDING → trusted final settlement → optional LEGACY_SELECTION_PENDING → COMPLETED_ARCHIVED`.

Official publication issues a Run offer only after a player-started, nonfinal trusted event when continued participation remains eligible. DNF may qualify; DNS, DQ, withdrawal and elimination do not. A pending Run choice blocks the next manual start. Each offer has three deterministic, distinct catalog choices. A confirmed selection records a placeholder; it changes no native statistics.

Hard elimination ends player participation. The frozen AI schedule continues, including one-starter and validated zero-starter events. No rescue, refund, fabricated player participation or subsequent Run offer is added.

No per-event Gold, wages, recovery, XP, reputation or trophies are applied. Intermission remains subject to accepted championship restrictions. Temporary Run selections expire at withdrawal or schedule completion and remain in history.

## Terminal settlement trust

`terminalPreview(state, instanceId)` is a pure derived preview, not a capability. `createSettlementCapability(careerStore, storage)` revalidates the durable envelope and every retained native official session, including identity and authority hash. The capability is process-local, bound to exact career/session bytes and the originating instance, and is never accepted from JSON or the player UI.

The dedicated worker operation `e5 / e5.settle` obtains that capability internally. Generic worker `career.transaction` rejects both `cycle.settle` and `e5.settle`. An arbitrary object cannot authorize settlement.

Within one candidate, `reduceCycle` executes the unchanged M2-D income → old claims → current all-personnel payroll → debt/streak → recovery → contract expiry → departures → immutable statement sequence. The active ID is cleared only in a private temporary projection and restored before publication; no intermediate unlock is written. Gold, XP, RP, trophies, terminal registry and pending Legacy offer are published in the same protected career commit. Failure leaves the preceding authority intact.

The old `officialFinal` is retained unchanged as the E3 terminal snapshot. Its historical `settled:false` flag is not the new settlement authority. `e5.terminalRegistry`, the protected receipt and M2-D statement establish settlement status.

## Owner-approved Legacy eligibility

A trusted terminal run qualifies after at least one legitimate player start, the entire frozen schedule, and no voluntary abandonment. Final DNF and elimination after prior participation qualify. DQ does not erase earlier participation under these rules. Registration alone, no-start elimination and voluntary withdrawal do not qualify.

Settlement persists the Legacy entitlement and offer before presentation. A mandatory pending choice keeps stable management and new registration locked. Confirmed selection appends permanent ownership to `profile.legacy.records`, records it in the archive, and unlocks stable preparation atomically. No automatic Legacy selection occurs.

## Commands

`makeE5Command(state, type, payload, id)` binds owner, career, gameplay/maintenance revisions, complete source fingerprint and protected business effect.

| Type | Payload |
|---|---|
| `e5.enable` | `{confirmed:true}` |
| `e5.refresh` | `{}` |
| `e5.register` | `{templateId,instanceId,selection:{assignmentId,driverId,beastIds,chariotId}}` |
| `e5.selectRun` | `{offerId,rewardId,confirmed:true}` |
| `e5.settle` | `{instanceId,confirmed:true}` plus internal settlement capability |
| `e5.selectLegacy` | `{offerId,rewardId,confirmed:true}` |

A repeated identical request ID uses existing protected lookup. Selection/settlement retries with a new request ID may return the prior receipt only when fully validated current history proves the same business payload. Conflicting choices reject. Retained history without the current receipt cannot authorize replay. Existing receipt/identity/import bounds remain unchanged.

## Persistence and compatibility

Schema 6 retains a complete schema-5 origin and reconstructs every subsequent receipt. It rejects unsupported versions, forged ownership, altered catalogs/offers, changed rewards, missing historical facts and inconsistent state. Failed imports leave current data intact. Import retains the existing maintenance-revision increment. Import replaces Owner Legacy explicitly; it does not merge progression from another profile.

Existing registered offers without reward terms receive no retroactive purses, XP, RP, trophies or selection entitlements. Their historical results and native condition are preserved; final M2-D payroll still applies. The enablement confirmation discloses this policy.

## E5-C integration seam

E5-C must use the frozen registered setup and accepted native producer, not a displayed placement or caller-generated result. Existing `ChampionshipRunner` birth/advance/sign/native-clearance/official publication and the E4 coordinator remain the tested E5-B pathway. E5-C must feed the P2.2 viewer through a separately authorized bridge, preserve input/Strategy Sign ordering, return through D5 authority, and retain pending selections. Independent P2.2 practice remains unchanged and awards nothing.
