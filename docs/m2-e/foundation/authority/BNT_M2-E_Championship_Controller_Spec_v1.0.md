# Blood and Thunder — M2-E Championship Controller
## Authoritative Implementation Specification — Revision 1.0

**Status:** Design consolidated; implementation NOT authorized.  
**Policy baseline:** M2-E-01 through M2-E-58, approved.  
**Dependencies:** M2-D career management/payroll lifecycle, pending formal acceptance; existing deterministic headless race engine.  
**Scope:** Five standard championships plus one playable Iron Gauntlet invitational, with extensible achievement-gated templates.

## 1. Normative conventions and authority

**MUST** denotes required behavior; **SHOULD** denotes an implementation recommendation subject to technical audit; **PROVISIONAL** denotes illustrative tuning that must remain configurable. If a conflict is discovered between this consolidation and an approved policy, the approved policy takes precedence and the discrepancy must be recorded before implementation. No code changes, merge or deployment are authorized by this document.

Architectural authority is divided as follows:
- **Headless race engine:** physics, movement, weather/events, AI, Strategy Signs, race telemetry, official race classification, deterministic RNG and replay.
- **M2-E controller:** championship offers, registration, frozen schedule and field, race orchestration, cumulative standings, championship eligibility, withdrawal, immutable terminal results, checkpoints, rewards and trophy entitlements.
- **M2-D career management:** authoritative Gold balance, contracts/payroll, career condition/recovery, failure state, atomic economic settlement.
- **M2-P presentation:** championship board, race and intermission UI, read-only stable, results/standings, trophy cabinet. No championship business logic in UI.
- **M2-F/M2-G:** future reward/upgrades and roguelite run grouping; must not be implemented implicitly by M2-E.

## 2. Initial deliverable and exclusions

MUST ship five standard championship templates: Dustroad Cup, Ironwheel Circuit, Bannerfall Series, Crownfire Grand Prix, Thunder Crown. MUST ship one playable prestige invitational: Iron Gauntlet, unlocked by an authoritative Bannerfall Series championship trophy/victory. MUST support additional achievement-gated invitations through data-driven qualification rules. Ashen Crucible and Sovereign Invitational are later content concepts, not M2-E deliverables.

No team racing, elimination formats, new sim mechanics, consumable invitations, individual equipment durability, separate run wallet, automatic between-race repair/recovery, or invitational-specific hidden fatigue/damage multipliers. Trophy collectibles confer no passive gameplay buffs. Complete visual art assets are M2-P work.

## 3. Championship templates and offer validation

A championship template MUST include: stable template ID and version, category (`standard` or `invitational`), display metadata, qualification expression, entry fee, field size, schedule of 1–12 races, track/geometry/laps/distance, known surface/hazards/weather, race-specific grid modes, explicit integer scoring and purse tables (including finale), optional telemetry-backed bonuses, DNF classification/award rules, opponent tier/configuration, reward and reputation/XP rules, trophy ID, and versioned deterministic rule references.

Qualification expression supports `all`, `any`, `reputationAtLeast`, `hasTrophy`, and `victoryCountAtLeast` (by template or catalog selection); unsupported predicates fail validation. Standard championships use cumulative, nonspendable reputation plus fee, eligible RU, no active championship and valid configuration, **without** a lower-tier victory requirement. Invitational achievements are permanent, nonconsumable and independently visible. All registration gates are checked BEFORE fee debit. Locked events display unmet requirements. Race schedules and known rules are fully disclosed before registration; random future weather/events are not revealed.

A validated offer MUST freeze a canonical template snapshot and fingerprint at registration; a catalog update cannot mutate an active instance. Validate all scheduled track capacities against full registered field and reject invalid schedules before charging. No fee refund on later withdrawal.

## 4. Initial catalog — provisional tuning

| Championship | Category | Races | Target field including player | Rep gate | Entry fee (G) | 1st placement Gold (G) |
|---|---|---:|---:|---:|---:|---:|
| Dustroad Cup | Standard I | 2 | 4 | 0 | 25 | 150 |
| Ironwheel Circuit | Standard II | 3 | 5 | 100 | 75 | 350 |
| Bannerfall Series | Standard III | 4 | 6 | 300 | 175 | 750 |
| Crownfire Grand Prix | Standard IV | 5 | 7 | 650 | 350 | 1500 |
| Thunder Crown | Standard V | 7 | 8 | 1100 | 750 | 3500 |
| Iron Gauntlet | Invitational | TBD (1–12) | TBD | Bannerfall trophy | TBD | TBD |

All numeric entries are PROVISIONAL, except the agreed catalog identity and the initial standard race counts as design targets. The Iron Gauntlet is endurance-focused using longer races, accumulated native fatigue/injury/damage, demanding finale, existing AI/track/grid/scoring mechanisms, and no special fatigue multiplier. Its final event schedule, field and economic values require balance fixtures before release.

Provisional ordinary scoring by finishing position 1–8:
- Tier I: 10,8,6,5,4,3,2,1
- Tier II: 12,9,7,5,4,3,2,1
- Tier III: 15,11,8,6,4,3,2,1
- Tier IV: 18,13,9,6,4,3,2,1
- Tier V: 20,14,10,7,5,3,2,1

Beyond eighth: zero by default. Classified DNF points are separately configurable, potentially reduced, never guaranteed. DQ/DNS zero by default. Finale points and Gold use explicit integer tables, not runtime multipliers. Previously discussed finale point multipliers of 1.25–1.50 and Gold multipliers of 1.25–2.00 are only tuning aids; round-down examples are not authoritative tables. Higher tiers use more varied schedules, longer aggregate distances and harder legitimate opposition, without scripted rubberbanding. The final race generally presents the most demanding challenge and meaningful comeback potential.

Provisional title-victory bonus Gold/reputation: Dustroad 25/10; Ironwheel 75/20; Bannerfall 150/35; Crownfire 300/60; Thunder Crown 750/100. These are separate from placement Gold and race purses; Iron Gauntlet TBD. Balance should aim for moderate economic risk, mid-field recovery of much (not necessarily all) entry fee, and meaningful winning upside before M2-D obligations.

## 5. State machine and transitions

Canonical controller phases:

```
NO_ACTIVE_CHAMPIONSHIP
    -> REGISTRATION_COMMIT
    -> INTERMISSION_READY (race 1 prepared; no race has started)
    -> RACE_ACTIVE
    -> RACE_RESULT_COMMIT
    -> INTERMISSION_READY (if races remain and player eligible)
    -> ...
    -> FINALIZATION_PENDING
    -> SETTLEMENT_PENDING
    -> COMPLETED_ARCHIVED
    -> NO_ACTIVE_CHAMPIONSHIP
```

An intermission can transition to `WITHDRAWAL_CONFIRMATION` and then `AI_CONTINUATION`, which runs all remaining races sequentially headless, or `FINALIZATION_PENDING` when no races remain. Forced ineligibility after a nonfinal race enters `AI_CONTINUATION` automatically after recording consequences. An ineligible RU after the **final** race still completes that championship. `RECOVERY_REQUIRED` is an explicit recoverable technical error state for invalid/incompatible checkpoints, incomplete atomic commits or failed settlement; it MUST NOT silently start a new championship.

`REGISTRATION_COMMIT`, `RACE_RESULT_COMMIT`, `FINALIZATION_PENDING` and `SETTLEMENT_PENDING` are durable logical commit boundaries; the implementation may encode these as states or transactional journal events, but may not expose half-applied transitions. No new registration while an active championship or pending settlement exists. Intermission progression requires a deliberate player `startRace` command; never auto-start the next race. Returning to Home Stable mid-championship is read-only and resumable. No passive time progression or healing.

## 6. Registered Racing Unit, opponents and race lifecycle

Registration freezes the player's driver, beasts, chariot, installed equipment, identity, and relevant configuration for the entire championship. The player may adjust free coaching, baseline AI strategy, priority and queued Strategy Signs before each race; these are frozen at race start. Strategy Signs are limited by current configuration (default three opportunities per race), and queued signs activate when the player's RU next crosses the start/finish line. No between-race substitutions, repairs, hires, purchases or other stable transactions.

Opponents are deterministically generated/selected at registration, with stable identity, team, livery, driver, personality, race style and championship-persistent native condition. They do not maintain an independent cross-championship wallet or injury career. Named rival career aggregates persist separately. The registered field is immutable; no new entrants or replacements. Race starter subset may shrink due to eligibility. Race grids may use seeded random, current standings or reverse standings; initial standings-based grids use seeded draw. Grid RNG MUST be separate from simulation RNG. AI and player obey the same eligibility, condition and race rules.

Zero-starter races produce an official no-starter record, no race win/purse/performance award, and deterministic advancement. A sole eligible starter runs a normal race; only an actual official finish awards a first-place victory. Sole-starter DNF/DQ/DNS does not auto-award victory. All official race results are immutable once committed. Withdrawal does not erase previously earned race rewards or standings points.

## 7. Classification, standings, champion and awards

Race results MUST derive from authoritative sim outputs, not UI calculations. Finisher ordering precedes DNF. Classified DNF ordering: laps/progress descending, then earliest tick/time at which that progress was reached, then stable entrant ID. DNF classification and reduced points/purse are separately configurable; unclassified DNF, DQ and DNS receive zero by default. Bonus categories (fastest lap, most laps led, clean race, positions gained, objectives) are OFF by default and require verifiable authoritative telemetry and frozen eligibility/tie policies. No awards for withdrawn nonstarters.

Final standings tie-break, applied universally: total championship points; most race wins; most seconds, then thirds, etc.; better official classification in the **last scheduled race**; stable entrant ID. Only official finishers count toward race-win and finishing-place tie-break statistics.

Champion is **not necessarily the points leader**. To qualify for the championship title, an entrant MUST actually start the final scheduled race according to authoritative race-start evidence. Final-race finishers and DNF entrants remain title-eligible; DNS and entrants withdrawn before the final race are not. Final-race DQ is title-ineligible by default. Highest-ranked eligible entrant in final standings wins; if none eligible, champion ID is null. Championship placement Gold follows final **points standings** even when a points leader is title-ineligible; it is never reassigned. Only actual champion receives the separate title-victory bonus and trophy. If no champion, no title bonus or trophy is awarded. Earned race awards and placement Gold remain payable after withdrawal.

## 8. Condition, fatigue, injury, equipment and XP

Native race fatigue/injury/chariot damage MUST carry from one race to the next without recovery, for player and opponents. No between-race healing, repair, equipment swaps or free condition reset. No extra individual equipment durability model in M2-E; installed equipment identities/effects remain frozen, and existing aggregate chariot damage remains operative.

Implement a **versioned condition adapter** between race-native state and M2-D management condition fields. Explicitly specify field ownership, units, clamping, conversion and timing. The adapter must be deterministic, idempotent and lossless for fields required to continue championship simulation. It must not silently apply M2-D end-of-cycle recovery between races. M2-D recovery applies only at final championship settlement. Source audit indicates native and management condition are not necessarily already synchronized: this is an integration blocker until verified in code.

XP accrues to participating driver and beasts (not chariot), with starting participation plus performance increments for finish/podium/win; DNF/DQ participation by default, DNS none. XP and reputation formula versions are frozen with the championship instance; accrual is exactly once. Reputation is nonnegative, nonspendable, cumulative and permanently unlocks standard tiers. Reputation is awarded for started races plus eligible performance, and for final standings placement independent of champion title; earned reputation survives withdrawal. Championship result/history includes final RU condition and settlement references.

## 9. Economy, settlement and durable trophy registry

One persistent career Gold balance. Registration charges an upfront nonnegative integer fee once, atomically with instance creation; insufficient Gold blocks. Organizer guarantees frozen advertised purses and placement awards irrespective of fee pool or starters. Unclaimed awards are not redistributed. Race purses, placement Gold, title-victory Gold and reputation/XP entitlements MUST be ledgered with stable unique IDs and credited exactly once at authoritative completion. Avoid double-crediting if M2-D expects all rewards to be committed only at final settlement.

M2-D settlement runs **once per championship**, including voluntary/forced withdrawal, after all scheduled race results (AI continuation where necessary) and authoritative finalization. Its preexisting payroll, creditor, recovery, contract decrement and career-failure rules remain authoritative. Do not change the M2-D settlement sequence without a separate compatibility review. A frozen completion roster must satisfy the M2-D contract: it may require **all active contracts**, not only the participating Racing Unit. The integration must reconcile this explicitly.

Existing M2-D completion-boundary branding is process-local and cannot itself establish authority after JSON serialization. M2-E MUST maintain a persistent, validated completion registry and transaction ledger, with an immutable terminal result fingerprint, durable completion ID, authoritative race evidence and an atomic settlement claim. Rehydrate/reverify through trusted application code; never trust a serialized branded object or arbitrary caller-supplied `completedOnce` flag. Retry of identical settlement is idempotent; mismatched payload under the same ID is rejected. Pending settlement is resumable and blocks further championship registration.

Trophies belong to the **stable career**, not the RU. Trophy catalog entry has immutable trophy ID, first-earned instance, victory count and per-victory history. Repeat victories increment count once per unique completed instance. Trophies cannot be sold, consumed, traded or lost and grant no passive mechanical buffs. Unlock eligibility derives from authoritative trophy/victory history, not a mutable invitation toggle.

## 10. Withdrawal and headless continuation

Voluntary withdrawal is permitted at intermission, including before the first race, after explicit irreversible confirmation. No refund or extra withdrawal penalty; all previously earned points, reputation and rewards retained. Forced withdrawal occurs after a nonfinal race when player RU cannot legally start the next race (e.g., incapacitated/dead driver, unavailable beasts, destroyed chariot). Withdrawal must not automatically trigger career failure.

After withdrawal, every remaining scheduled race is simulated in order through the normal deterministic headless engine with only eligible remaining AI starters. AI condition continues to accumulate; no between-race recovery. Each race result is committed idempotently, with checkpointed progress for interruption/restart. A race with no starters is still recorded and advances. After the last scheduled race, determine final standings, eligible champion, unclaimed title awards and final settlement. A withdrawn player remains in standings and may receive final placement Gold, but cannot be champion unless they satisfy final-race start eligibility.

## 11. Checkpoints, replay and recovery (M2-E-58 B)

Persist between-race boundaries and periodic authoritative mid-race checkpoints. A checkpoint includes championship ID, race ID, tick, schema and simulation versions, frozen config fingerprint, full required simulation state, RNG streams/states, Strategy Sign queue/activation and remaining opportunities, controller phase, and an integrity digest. Keep an append-only deterministic input journal with tick and total order for accepted player decisions. Use atomic/double-buffered writes or equivalent commit protocol so no partial checkpoint or journal becomes authoritative.

On resume: load the newest **valid** checkpoint; verify schema/version/fingerprint and integrity; restore deterministic state; replay all subsequent **committed** inputs in order; compare authoritative event/result fingerprints. If latest checkpoint is corrupt, use an earlier valid checkpoint plus complete committed journal. If no valid deterministic recovery exists, enter explicit `RECOVERY_REQUIRED` without resetting, changing seed, re-registering or charging again. If simulation-version migration cannot guarantee identical results, preserve original save and report incompatibility; never silently approximate.

The journal and checkpoint MUST be sufficient to reproduce all relevant state including queued sign crossing behavior, random events, AI, collisions, classification and rewards. Exact checkpoint interval and storage backend are technical tuning; do not write every tick unless benchmarking warrants it. Completed race commits are terminal; loading a prior race checkpoint must not reopen a settled race or permit outcome rerolls.

## 12. Suggested persistence schema and APIs (design contracts, not existing code)

**Versioned aggregate** (`championshipState`, proposed schema >= 5; actual number assigned after source audit):

```
{
  schemaVersion, profileId, careerId, revision,
  active: {
    instanceId, templateId, templateVersion, category, frozenOffer,
    registrationId, feeTransactionId, seedManifest,
    registeredEntrants, playerEntrantId, lockedRU,
    phase, raceIndex, raceResults[], standings,
    conditionSnapshots, raceCheckpointRef, inputJournalRef,
    withdrawal, finalization, settlementId
  } | null,
  history: { completedInstances[], trophyCatalog, rivalAggregates },
  settlementRegistry: { completionId -> fingerprint/status/transactionId },
  migrationMetadata
}
```

`frozenOffer` and authoritative race results may be stored separately and referenced by content hash; durable referential integrity is required. Trophy and settlement registries must share the same career authority as Gold and reputation, with atomic or recoverable commit semantics. Preserve old schema and command versions through explicit migrations.

**Command interface (proposed):**
- `listChampionshipOffers(career)` — pure, including locks and requirements.
- `quoteChampionshipRegistration(career, templateId, selection)` — pure eligibility/fee/capacity quote.
- `registerChampionship(command, expectedRevision, idempotencyKey)` — atomic fee + frozen instance + locked RU.
- `configureNextRace(instanceId, coachingAndSigns, expectedRevision)` — pre-race-only changes.
- `startChampionshipRace(instanceId, expectedRevision)` — deliberate transition and authoritative race start.
- `recordRaceCheckpoint(instanceId, raceId, checkpoint, journal)` — validated durable save.
- `commitOfficialRaceResult(instanceId, raceId, result, expectedRevision)` — authoritative once-only result and derived standings/condition.
- `requestWithdrawal` / `confirmWithdrawal` — irreversible explicit user flow.
- `continueWithdrawnChampionship(instanceId, budget)` — resumable deterministic AI continuation.
- `finalizeChampionship(instanceId)` — immutable final standings/champion/entitlements.
- `settleChampionship(instanceId, expectedRevision)` — trusted M2-D completion boundary and exactly-once career transaction.
- `getChampionshipView(instanceId)` — read-only UI projection.

The API names are illustrative. The implementation must adapt to existing M2-D transaction contracts and race-engine APIs rather than duplicating their logic. All commands require profile/career/instance scope, expected revision or equivalent concurrency protection, and stable idempotency IDs for side effects.

## 13. Determinism and security invariants

1. Registration fee debit and championship creation are atomic and exactly once.
2. Registered field and frozen schedule cannot change after registration.
3. All official race results are immutable and traceable to authoritative simulation evidence.
4. Sim RNG, grid RNG, opponent generation and event streams have isolated deterministic seeds.
5. No unauthorized stable management or recovery between races.
6. No duplicate race points, Gold, XP, reputation, trophy or M2-D cycle settlement.
7. No title awarded without final-race actual start; null champion is valid.
8. Withdrawal continues all remaining AI races and preserves earned rewards.
9. Resume cannot silently reroll a result or discard committed player input.
10. No championship command can bypass pending settlement, profile scope or career revision checks.
11. Replayed commands with identical IDs are idempotent; conflicting payloads fail closed.
12. Historical standalone-race replay hashes remain unchanged unless an explicit approved migration says otherwise.

## 14. Implementation work packages (not authorization)

**E0 — Baseline and integration audit:** Verify M2-D branch/acceptance, transaction API, completion trust, condition fields, native race outputs, current save/replay semantics, track capacities. Capture existing replay hashes and test results. Resolve incompatible assumptions before coding.

**E1 — Data and migrations:** Championship templates/validator, career schema and migration, achievement registry, immutable offers, transaction IDs.

**E2 — Registration and lifecycle:** Atomic fee/registration, locked RU, deterministic opponents, state machine, intermission and manual start.

**E3 — Race orchestration:** Grid modes, official results, classification, points/bonuses, standings, condition carryover, AI continuation and zero/one starter cases.

**E4 — Checkpoint/replay:** Mid-race authoritative checkpoint, input journal, recovery, compatibility tests.

**E5 — Finalization/settlement:** Champion eligibility, reward entitlements, trophy history, persistent completion authority and M2-D exactly-once settlement.

**E6 — Content, presentation contracts and acceptance:** Five standard templates, Iron Gauntlet, read-only M2-P selectors, end-to-end regression and balance fixtures.

Implementation order may be adjusted after repository audit; each package requires its own tests. M2-D acceptance is a dependency, not a permission to merge M2-E.

## 15. Acceptance test matrix

| Area | Mandatory scenarios |
|---|---|
| Registration | unlocked/locked, insufficient Gold, invalid capacity, concurrent duplicate command, template change after registration |
| RU/management | fixed roster, attempted mid-championship hire/repair, pre-race coaching, equipment identity persistence |
| Race | ordinary finish, classified/unclassified DNF, DNS, DQ, single starter win, single starter DNF, zero starters |
| Scoring | per-tier points, bonus telemetry absent/present, finale tables, all tie-break levels, stable entrant ID |
| Title | leader DNS finale, leader final DQ, leader final DNF, null champion, placement Gold independent of title |
| Withdrawal | before race 1, after multiple races, forced before finale, ineligible after finale, all AI races complete |
| Conditions | player and AI fatigue/injury/damage continuity, no between-race recovery, adapter idempotence |
| Economy | fee once, guaranteed purses, withdrawn placement payout, unclaimed title bonus, payroll/recovery once |
| Progression | XP/reputation once, permanent standard unlocks, Iron Gauntlet trophy gate, repeat trophy count/history |
| Resume | queued sign crossing, collision, RNG event, interrupted checkpoint write, corrupt latest checkpoint, committed journal replay, incompatible sim version |
| Determinism | uninterrupted vs restored identical result hashes; prior standalone race replay golden hashes unchanged |
| Security | forged completion, duplicate settlement, mismatched transaction fingerprint, cross-career IDs, stale revisions |
| Presentation | board lock reasons, full schedule disclosure, read-only stable, manual next race, final immutable report |

No acceptance claim is made until these tests run against the actual codebase. Simulation balance tests must sample conservative/aggressive coaching, RU strengths, tracks, weather, attrition, finish and withdrawal distributions, championship profitability and Iron Gauntlet completion viability; tuning values remain provisional until results exist.

## 16. Policy traceability matrix — all 58 approvals

| Policy | Approved rule | Primary section |
|---|---|---|
| E-01 | Configurable 1–12 races, complete championship lifecycle | 3,5 |
| E-02 | Locked player RU for entire championship | 6 |
| E-03 | Forced withdrawal on nonfinal RU ineligibility | 5,10 |
| E-04 | Confirmed voluntary withdrawal, earned rewards retained | 10 |
| E-05 | Nonrefundable, atomic Gold entry fee | 3,9 |
| E-06 | Persistent selection board and unlocks | 3,12 |
| E-07 | Career persistence, future run grouping deferred | 1,2 |
| E-08 | Full stable management only after settlement | 5,6 |
| E-09 | Grounded Normal/Elevated/High/Critical risk | 6,15 |
| E-10 | Classified DNF reduced points, authoritative order | 7 |
| E-11 | All remaining AI races after withdrawal | 10 |
| E-12 | Fixed deterministic opponent tiers | 6 |
| E-13 | Repeat championships, configurable one-time bonuses | 3,9 |
| E-14 | Named rivals with persistent aggregate career stats | 6,12 |
| E-15 | Race purses, final placement and optional specials | 7,9 |
| E-16 | Configurable classified DNF purse | 7 |
| E-17 | Organizer-guaranteed frozen prize pool | 9 |
| E-18 | Full known schedule disclosure | 3 |
| E-19 | Transparent standings/opponent RU state | 6,12 |
| E-20 | Manual race start | 5 |
| E-21 | Read-only stable and resume during championship | 5,6 |
| E-22 | No between-race recovery | 8 |
| E-23 | Free coaching/strategy and queued Strategy Signs | 6,11 |
| E-24 | Configurable disclosed points tables | 3,7 |
| E-25 | Telemetry-backed optional bonus categories | 7 |
| E-26 | Configurable bonus classification eligibility | 7 |
| E-27 | Universal championship tie comparator | 7 |
| E-28 | Seeded, standings, reverse grids | 6 |
| E-29 | Immutable registered field | 6 |
| E-30 | Valid zero/one-starter races | 6 |
| E-31 | Final race actual start required for title | 7 |
| E-32 | Placement Gold follows points standings | 7,9 |
| E-33 | Null champion permitted | 7 |
| E-34 | Versioned native/management condition adapter | 8 |
| E-35 | Defer individual equipment durability | 2,8 |
| E-36 | Participation plus performance XP | 8 |
| E-37 | Single persistent Gold economy | 9 |
| E-38 | Five standard championship tiers | 2,4 |
| E-39 | Reputation-based permanent standard unlocks | 3,8 |
| E-40 | Started-race and placement reputation | 8 |
| E-41 | Moderate financial risk | 4,9 |
| E-42 | Legitimate progressive difficulty, steep elite tiers | 4 |
| E-43 | Open standard competition, no victory prerequisites | 3 |
| E-44 | Progressive format variety | 3,4 |
| E-45 | Balanced tier scoring, victory premium increases | 4,7 |
| E-46 | Increasing tier field sizes, capacity validation | 4,6 |
| E-47 | Longer races at higher tiers | 4 |
| E-48 | Meaningful fair attrition, no scripted damage | 4,8 |
| E-49 | Varied schedules, demanding finale | 4 |
| E-50 | Enhanced finale points and Gold | 4,7 |
| E-51 | Finale allows plausible comeback | 4 |
| E-52 | Separate champion victory Gold/reputation | 4,9 |
| E-53 | Permanent prestige trophy collection | 9 |
| E-54 | Hybrid standard reputation/invitational achievement access | 3 |
| E-55 | Several themed invitationals, not parallel ladder | 2,3 |
| E-56 | Specialized invitational formats using existing mechanics | 2,4 |
| E-57 | Framework plus playable Iron Gauntlet | 2,4 |
| E-58 | Deterministic mid-race checkpoint/resume | 11 |

## 17. Open integration and release gates

**Not additional player-choice policies:**
1. Formal acceptance and exact code state of M2-D must be established before integrating against it.
2. M2-D persistent completion trust must be implemented without weakening its existing boundary.
3. Race-native to management condition mapping and authoritative start/finish telemetry must be verified in source.
4. Checkpoint serialization feasibility must be demonstrated against current race engine, including RNG and queued Strategy Signs.
5. Initial templates and Iron Gauntlet need concrete valid track/schedule data, capacity and balancing before a playable acceptance claim.
6. Previously proposed alternative distance schedules (E-47 versus E-49) must be reconciled in final data; neither illustrative table is immutable canon.
7. Exact migration version and API names must follow source inspection; this document intentionally does not claim those APIs already exist.

**Next gate:** Read-only repository audit and M2-D acceptance review, followed by a technical revision of this spec if source constraints require it. Implementation, merging and deployment each require separate explicit authorization.
