# BNT M2-E E3 Completion Implementation Report

Date: 2026-11-18. Scope: approved E3 completion and D2 Mapping v1 only. No merge, push, release, deployment, full E4, E5 or E6.

## Baseline and revision

Repository: mackminute-max/BNT. Branch: `feat/m2-e-e3-completion`, created from `235b861aea46492f7aa1f32b808a9d1598283f88` (tree `c7f7d5c4fa8dd5d98fd89a85d0e81b71cd0f9f89`). This is documentation-only after E2/E3 source `770d994a5c61dc0d3cf37a74d170fe654374e63b`. Accepted foundation `5870d18c5fb6455767e918ad0df9e1e64cbecb2e` and M2-D `06fd511170148caf744abf57449c4cc5d6c4e2c5` ancestry verified. Main was not substituted. Initial tracked tree clean; pre-existing untracked pre-implementation audit preserved/excluded.

The approved specification, addendum, reconciliation, implementation plan/readiness, foundation reports, E2/E3 reports and D2 analysis were reviewed against the source. The current owner authorization supersedes the earlier numerical hold; historical reports were preserved unchanged. Baseline477 Node tests and12 historical replay references passed before production edits; both payroll replays matched. Baseline HTML529698 bytes, SHA256 `d7a6e145ddebe8085a98ac8b48e2251cf542badefb572e14e826b499597474b3`.

Implementation commit and exact final evidence: `evidence/revision.json`; documentation-only commit reported at delivery. See the test evidence for actual counts and qualifications.

## Versioned activation and compatibility

Career schema remains5, command envelope4, protected record/history/envelope versions unchanged. **Explicit `controller.enableE3`** upgrades aggregate2→3 with rules `m2e-controller-e3-v1`; legacy commands and aggregate1/2 histories reconstruct under their original behavior. No automatic load/import conversion or historical condition normalization. Accepted pending E2 clearance candidates remain retained; activation then validated retry can officially publish the original proof, without rerunning that race.

Old acquisition basis, assets, ordered references, contracts, financial receipts, protected identities and native condition/strain/fatigue/wear remain intact. Existing 1,000 receipt/2,000 protected identity/8MiB envelope and session limits remain; no history or journal pruning. Unsupported aggregate versions reject. Active/unsettled management restrictions also cover aggregate3, including treatment, repairs and payroll-cycle commands.

## D2 Mapping v1

New pure module: `src/career/championships/condition.js`. Adapter ID **`m2e-condition-mapping-v1`**. `mapCondition({version,instanceId,eventId,resultId,start,final,persistent,provenance})` returns absolute native state, persistent condition, eligibility and deterministic audit/effect identity without mutating preview inputs.

| Field | Rule / source compatibility |
|---|---|
| Driver/beast native C | Finite continuous0–100, source `model/ru.js`, `career/economy/validation.js` |
| Derived injury | C≥80 Healthy;60≤C<80 Minor;30≤C<60 Major;C<30 Critical. Worse of prior/current; no rounding/healing |
| Availability | Existing unavailable state retained. Existing `previewRU4` contracts/management restrictions and native disable thresholds remain authoritative |
| Chariot integrity | L=max(0,Cstart−Cfinal); Inew=max(0,Iold−L), clamp0–100. No wear or event-damage double subtraction |
| Chariot status | Existing `career/assets.js:integrityStatus`; no competing bands or deletion |
| Driver strain | Exact native cleared strain; management fatigue unchanged, no invented conversion |
| Beast fatigue | Exact cleared per-beast value, no second reduction |
| Chariot wear | Exact cleared wear, independently of integrity and condition |
| Paid treatment | Original quote/reducer/one-category improvement; then native C=max(old,result-category floor), capped100 |
| Paid repair | Original paid actual integrity restoration R; then native C=min(100,old+R); exact existing decimal arithmetic determines R, not requested overflow |
| Historical mismatch | Full integrity/low native C remains; original no-effect repair rejection remains; no free normalization/new service |

The original `economy/reducers.js` quote/price/service code and M2-D recovery reducers were not modified. The aggregate3 controller applies `restoreServiceNative` only **after** the original successful paid action, under the new activated reconstruction context. Historical pre-activation receipts keep their old effects. The existing v2 command and result shape/cost remain unchanged; activation history/rules identify the new restoration semantics. No treatment/repair/recovery can run during active/unsettled championships. M2-D end-cycle recovery is never invoked here.

Each officially cleared race retains mapping version, source state/setup fingerprints, checkpoint/journal reference and per-entrant stable effect ID. Current management fatigue, XP, availability, ownership and equipment records are not overwritten by native snapshots.

## Official publication and cross-store protocol

Modules: `clearance-transfer.js`, `anchor.js`, `orchestrator.js`, `controller.js`, new `progression.js`.

1. The real RaceSessionStore validates its full state/journal/checkpoint and persists an immutable D5-cleared native proof. This is a **prepare record**, not yet official career consequences.
2. A runtime-branded transfer re-reads/decodes exact durable bytes, verifies race/setup/owner/financial anchor and native identity, then binds the current career fingerprint and reference. The capability expires if durable bytes disappear/change before the career operation.
3. One protected `championship.publish` CareerStore transaction atomically publishes result, final native/management condition, per-entrant provenance, participation, standings, pending identities, next eligibility/withdrawal and lifecycle. CareerStore's single atomic value is the official commit point. No Gold/XP/reputation/trophy credit.
4. Before that write, failures leave all career effects unchanged. After it, reload/duplicate lookup returns the committed record; no second session acknowledgment write is required for authority. Lost acknowledgment cannot reapply condition or points. Different payload under an ID/effect/result identity rejects.
5. The official record retains the original race financial anchor; subsequent native condition commits do not make the previous immutable session unreadable. The next race receives the new validated condition/asset anchor. A missing uncommitted session causes recovery, not fabrication/reroll. A committed career result remains immutable if an old session is later unavailable.

This is an explicit prepare→single-career-commit protocol, **not** a claim that two Web Storage writes are atomic. Both existing writer locks are used in browser coordination; low-level APIs remain synchronous single-writer tools. No changes to RaceSessionStore's journal/codec authority or asynchronous store replacement.

## Multi-event progression and conditions

`championship.start` manually freezes the event's setup/grid/entrant subset. New E3 registration resolves native default personalities once with an isolated deterministic registration seed; later races reuse the exact registered profiles. For an already started E2 upgrade, the frozen setup's profiles are retained. No change to legacy races, AI coefficients or driver attributes.

After official publication, nonfinal events move to `INTERMISSION_READY` or `AI_CONTINUATION`; a deliberate next start is required. Player and rivals retain absolute cleared native condition, fatigue, strain, wear and mapped management injury/integrity. Fixed registered identities/equipment and payroll context are not replaced. Grid streams remain separate from simulation RNG. The approved1–12-event range remains validated.

A final event moves directly to **`SETTLEMENT_PENDING`** with immutable provisional final standings, champion eligibility evidence, source result IDs and pending entitlement IDs. Management and registration stay locked; no live M2-D completion producer or settlement button exists.

## Classification, standings and title

Native full-precision official places feed pure scoring helpers and now durable official records. Tied places receive full points and independent pending IDs; every tied first finisher gets race-win credit. DNF progress/first-reached telemetry remains authoritative; existing native non-DNF ordering is preserved. No new DQ-producing mechanic was invented. Classified DNF points remain separately gated; the representative fixture defaults them to zero and optional bonuses remain off.

Standings apply points, wins, seconds/thirds/etc., last **scheduled** race classification, then stable ID. Entrants absent from the last event do not retain an earlier event's last-race rank. Points placement is independent of title eligibility: authoritative final actual starters may qualify with a legitimate DNF; DNS/DQ/withdrawn nonstarters cannot. Null champion is valid. E3 stores pending identities only, not economic award amounts or E5 credits.

## Withdrawal and no starters

Confirmed voluntary withdrawal works at each eligible intermission without refund or erasing earned points/identities. Post-clearance nonfinal ineligibility forces withdrawal with recorded reason/result provenance, no extra penalty or career-failure confirmation. Ineligibility after the finale does not force withdrawal retroactively.

All remaining events continue manually through the same native simulator for the eligible rival subset. One starter runs normally. Zero starters enter `NO_STARTERS_PENDING`; a trusted controller eligibility capability and the foundation no-starter proof are recomputed from the fixed roster/current condition and withdrawal state. Only then may a protected no-starter operation advance. Empty classification/conditions/effects remain empty: no invented DNS, finish, participation, condition change or placement award. Existing earned standings/claims survive.

## Recoverable blocked states

A failed clearance precheck persists `RACE_CLEARANCE_BLOCKED`, or `RECOVERY_REQUIRED` for missing/corrupt authority, with original reason/reference/provenance. No official consequence or advancement occurs. The native session remains unchanged, so an unfinished valid race can retry/resume without changing journal order. A validated retry restores the appropriate bound/unbound race phase. Stalled physical clearance can remain blocked indefinitely; no wreck removal, teleportation or fabricated retirement. A storage failure that prevents writing is reported rather than claiming a durable blocked record.

## Minimal UI

The existing developer Championship Controller panel now offers explicit E3 activation, manual next start, official publish/no-starter action, validated retry, race-by-race records, standings, persistent condition and eligibility, withdrawal explanation and final pending-settlement display. Existing viewer/workbench/tools remain. Staged E2 evidence and official E3 records are distinct. UI explicitly says pending identities are not credited Gold/XP/reputation/trophies.

Windows review: back up a test career, double-click either standalone HTML offline, open Developer→Career State/Save Management→Championship Controller, explicitly enable foundation/controller/E3, inspect the development offer and register. Manually start, run, publish each event; inspect carryover/standings. Final status must be SETTLEMENT_PENDING with management locked and no reward credit. This is still a development fixture, not E6 content. Managed HTTP browser tests do not replace owner Windows direct-file testing.

## Deferred work

Full E4 automatic checkpoint cadence, scalable storage/backend/recovery UI redesign; E5 trusted terminal completion/settlement and permanent awards; E6 catalog/Iron Gauntlet/presentation; per-item durability/permadeath/progression. No new dependencies, framework, server, physics/AI balancing or incident-clock changes. Long synchronous validation and browser-origin quotas remain disclosed risks; actual measurements and failures are in the test report. No owner acceptance is asserted by this delivery.

## Frozen implementation

Source commit: **`8d5abe9442e93cb318ef87d4ef47ee0de0e457e2`**, tree`08cad062bf9e62f994f9a1cb6fa42d9946f78ff8`. Final suite507/507,0 failures. File inventory: `evidence/implementation-files.txt`. Documentation commit is separate; no merge or push.

### Export/recovery scope

Career JSON preserves championship aggregates, official records and checkpoint references. Live RaceSessionStore data is a separate authority; the career export alone is **not** a combined mid-race session backup. Low-level session export/import remains available through the accepted foundation API; full E4 must provide a coordinated recovery/export experience. Importing a career without its established session fails explicitly rather than silently restarting. Automatic racing requires browser storage and Web Locks; manual mode does not claim durable championship progression.
