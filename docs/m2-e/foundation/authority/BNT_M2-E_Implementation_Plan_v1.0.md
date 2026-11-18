# BNT M2-E Implementation Plan v1.0

**Status:** proposed implementation plan only. No E0–E6 code work is authorized by this document. Read with [Specification Reconciliation](BNT_M2-E_Specification_Reconciliation_v1.0.md).

**Date:** 2026-11-18. **Scope:** planning only; no implementation authorization.

## Verified baseline and authority

References were reviewed in order: the complete Championship Controller Specification v1.0, Compatibility Addendum v1.0, previous Implementation Readiness Audit, current source/tests, and M2-D contracts. The specification remains authoritative for E-01–E-58; the addendum supplements it with D1–D5.

Repository: `mackminute-max/BNT`, local `/workspace/BNT`. Branch `feat/m2-d-payroll-lifecycle`; HEAD `06fd511170148caf744abf57449c4cc5d6c4e2c5`; implementation commit `c8371a8e26115c04f86ff91e7f45f2cda4bafb13`. Local main/origin-main baseline is `f66ec90a6659dd6bb675815bff4cc33e9850a643`. This does **not** establish remote freshness or owner acceptance. A read-only remote verification attempt returned HTTP 503. M2-D acceptance and integration remain unestablished.

At inspection, tracked files were clean. The pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was left untouched. These deliverables are outside the repository. No source, tests, save files, dependencies, builds, branches or commits were changed.

The actual stack is vanilla JavaScript ES modules, Canvas 2D, esbuild and a headless simulator; no TypeScript/Phaser migration is proposed. `package.json` reports application 0.6.0, esbuild 0.28.2 and playwright-core 1.65.1. Node v24.22.1 and npm 11.9.0 were available.

Authority fingerprints (SHA-256):

- Specification: `9e73713b0f7e231fb469e5db390cd41a27ac7c34767cd2c9cebece409bf6e917`.
- Addendum: `2e5631622329259c5730b53bec5038784246cc482129882777eab2988a648780`.
- Existing standalone files `dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html`: each 436032 bytes, SHA-256 `d1a586a64066b40e40fb540e090c61d48b975d89cecca92e1377aa5b4af3a1a7`. Neither was rebuilt.

Prior audit: `/workspace/deliverables/BNT_M2-E_Implementation_Readiness_Audit.md`, preserved unchanged. Source references below use this local HEAD; proposed names, schemas, coefficients and tests are explicitly recommendations, not implemented APIs or passing evidence.

## Execution order and proof-first gate

Retain the specification's E0–E6 labels but execute **E0 → minimal E1 → early E4 resume/clearance proof → E2/E3 → full E4 fault tests → E5 → E6**. This is a dependency ordering, not a policy change. Do not build the full catalog before proving durable mid-race state and authoritative finalization. Minimal fixtures can test the proof; they are not a shipped substitute for the six championships.

## Module/interface architecture (all proposed)

| Module family | Responsibility | Existing seam |
|---|---|---|
| `src/career/championships/catalog.js`, `templates.js` | Versioned templates, qualification, full schedule validation | Existing track/config validation and deterministic generators |
| `state.js`, `validation.js`, `migration.js` | Strict aggregate, frozen instances, explicit migration | Career schema4/history/import/export conventions |
| `commands.js`, `reducers.js` | Registration, coaching, manual advancement, withdrawal, finalization | CareerStore atomic transaction/revision/receipt rules |
| `race-setup.js`, `entrants.js`, `condition.js` | Locked player/rivals, frozen payroll context, native setup and condition mapping | `commitEntrant`, economy RU preview, M2-D racing adapter |
| `scoring.js`, `classification.js`, `entitlements.js` | Official ranks, DNF first-reach evidence, standings, XP/RP/Gold claims | Native `classification`, authoritative telemetry |
| `clearance.js`, `completion-authority.js` | Validated cleared-race proof, terminal registry, capability rehydration | `createCompletionBoundary`, `quoteCycle`, store settlement option |
| `src/career/persistence/race-checkpoints.js` and codec | Full state, committed journal, recovery, versions | Existing persistence/manual-save adapter; existing replay reference |
| Optional AI coaching module | Bounded player-only utility contribution | Existing candidate scoring in `src/ai/driver.js:121–149` |
| Browser management integration | Board, intermission, risk, standings, blocked/recovery controls | Existing HTML/CSS UI and Canvas viewer; no business rules in UI |

Names are recommendations. Avoid a second simulation, second settlement authority, new runtime dependencies or a broad engine rewrite.

## Persistence and transaction plan

Recommend a new **career schema5**, with explicit schema4→5 migration and versioned championship/condition subrecords. Final numbering must be checked against the accepted baseline at E0. Preserve original schema1–4 import/migration and command execution paths; never reinterpret legacy records under new semantics.

Persist: board offers/seeds, career reputation/trophies, immutable instances/template snapshots, entrant asset identities and ordered beasts/equipment, rival identities and current condition, frozen payroll control, race setup/coaching, results/standings, claims, terminal registry, settlement status, operational checkpoint manifests and recovery errors. Owner Legacy is not a destination for career trophies; do not introduce cross-profile Legacy merges.

Proposed aggregate states: `REGISTERED → PRE_RACE → RACING → CLEARANCE_PENDING → INTERMISSION` for a valid nonfinal race; final/withdrawn schedules continue toward `CHAMPIONSHIP_COMPLETED → SETTLEMENT_PENDING → SETTLED`. `RACE_CLEARANCE_BLOCKED` and `RECOVERY_REQUIRED` suspend progression; no automatic withdrawal or career failure. Voluntary withdrawal is confirmed at an allowed intermission, retains earned entitlements, and completes remaining AI races. Forced withdrawal follows a cleared nonfinal eligibility failure; final-race eligibility follows the specification. State names are illustrative; validate every transition centrally.

Use an explicit new command envelope/version for new aggregate operations while preserving v1/v2/cycle commands, strict historical payload shapes, both revisions, protected IDs/effects and historical limits. Receipt lookup precedes mutation. Scope IDs by career+unique championship instance, not repeatable template. Do not spend a receipt per simulation tick. Test exhaustion of existing 1000 receipt/2000 protected-identity caps and preserve fail-closed behavior; any growth/compaction policy needs explicit integrity design, not discarded history. Current 8MiB import limit must be included in checkpoint sizing tests rather than silently bypassed.

Registration performs qualification, capacity/roster/fee validation and frozen snapshot creation in one atomic state publication. Reject stale revision or unaffordable entry without any debit/partial lock. Full stable mutation commands must reject while active or settlement-pending, while read-only stable inspection remains available. No separate championship wallet.

**Durability:** select backend after an E0/E4 storage spike. IndexedDB is a reasonable candidate for larger atomic checkpoint+journal transactions, but the existing synchronous CareerStore cannot simply be assigned an asynchronous storage API. Use a proven adapter/coordinator or a single authoritative commit manifest with recoverable cross-store publication. Do not acknowledge an accepted input until its journal commit is durable under the chosen mode. A checkpoint hash alone is not an authoritative result or an authentication mechanism.

Manual mode must remain playable with explicit export/checkpoint warnings, without claiming a browser download reached durable external storage. If full unattended crash recovery cannot be guaranteed in manual mode, disclose the last committed external generation and refuse unsafe resume rather than rerolling/restarting an interrupted race. No silent save replacement or lost financial commit on recovery.

## E0 — Accepted baseline, contracts and release fixtures

**Deliverables:** pin accepted M2-D SHA/tree and source/artifact/config hashes; confirm schema/command versions, limits, runtime, full Node/browser counts and representative legacy replay checksums. Verify source vs reports, storage behavior and treatment/settlement seam. Record current reference fixtures before changes.

**Files expected:** new development-only evidence/tests under a championship test area; no production changes until authorization. Reuse M2-D reports, cycle contracts, store and existing replay tests.

**Dependencies:** formal owner acceptance/exact M2-D source state; implementation authorization. Remote access failure does not justify reconstructing missing code.

**Acceptance/tests:** clean authorized baseline; full suite actually run; no unknown later-stage source; source-backed mapping table reviewed; storage/file-origin availability recorded. Establish no-coaching legacy replay references and preserve them immutably.

**Risk/rollback:** wrong baseline invalidates all comparisons. Stop rather than update references to hide drift. No automatic merge implied.

## E1 — Minimal aggregate, validation and migration

**Deliverables:** strict schema5 and subversions, command validation, protected operation identities, terminal-registry structure, checkpoint manifest references, explicit non-destructive migration preview/import/export. Initial empty aggregates do not invent rewards or starter grants.

**Interfaces/files:** championship state/validation/migration; career schema dispatcher, history/protected-registry, persistence validators. Reuse current transaction validation/publication semantics.

**Acceptance/tests:** all supported old saves round-trip; migrated native values and raw origin preserved; invalid references/versions/amounts rejected; failed migration/import leaves current career intact. Test dual revisions, conflicts/duplicates, capacity bounds, wrong profile/career, developer provenance and protected grants. No new known facts may be omitted from a supposedly valid save.

**Determinism/rollback:** legacy race config and replay checksums identical. Retain old export before confirmed migration; never downgrade an active new-format championship by dropping fields.

## Early E4 — Durable resume and D5 feasibility proof

**Deliverables:** full authoritative state codec, restore API, transactional checkpoint+journal prototype, candidate clearance validator and atomic commit proof using minimal fixtures. This gate precedes full E2/E3 implementation claims.

**Files:** new checkpoint codec/storage coordinator; narrow explicit restore seam in `src/sim/race.js`; checkpoint tests. Do not change default snapshot/digest/capture format or physics.

**Required state:** RNG seed/draw count, next incident time/IDs (including positive Infinity), tick/time, all native entrant state, AI cadence/goals/perception, contacts/cooldowns, track/environment state, progress/first-reach evidence, queued events and accepted commands, paused-phase ordering, sign state/checkpoint cursors, frozen payroll/coaching/setup, version references. Capture only resolved tick boundaries; reconstruct immutable finish/wreck descriptors and validate them. Current snapshot/capture is a digest/replay projection, not this complete payload.

**Acceptance/tests:** round-trip future-state equality and exact uninterrupted/resumed results, events, RNG and Sign uses; incident frequency zero remains zero; restart before/after paused commands; accepted-input acknowledgement ordering; incomplete/corrupt latest generation falls back only with a complete committed journal; missing tail/version mismatch enters RecoveryRequired. Exercise force-close at every commit boundary and stale checkpoint after a committed result.

**D5 proof:** genuine cleared result can commit once; Stalled/unfinished pending work cannot. A zero-starter proof is explicit. A wreck can remain while cleared; an uncleared finished RU cannot be ignored. Same-ID retry is idempotent; conflicting retry rejects. Simulate failed publication after candidate creation and after manifest writing.

**Risk/rollback:** Infinity→null in ordinary JSON, shared-reference omissions, asynchronous storage race, journal replay twice. If proof fails, stop before full catalog; preserve evidence and previous valid state. Do not alter old checksum serialization to mask codec failures.

## E2 — Offers, registration and locked lifecycle

**Deliverables:** persistent board, full frozen schedule/rules/rewards, qualification expressions, atomic entry fee, fixed entrants/opponents and stable access guards. Seed opponent generation and grid streams independently of race RNG.

**Files/interfaces:** catalog/templates, registration commands/reducers, entrants, career command guards, minimal board UI. Reuse native RU validators/commitEntrant and track capacities.

**Acceptance/tests:** all gates before debit; all scheduled capacities validated; immutable canonical offer fingerprint; repeated template creates a unique instance; no catalog refresh mutates active schedules; fixed ordered asset IDs/equipment and full roster context; no mid-championship transactions, substitutes or second championship; read-only stable works. Interrupted registration cannot double-charge. Native race setup remains equivalent when controller contexts are absent.

**Dependencies:** E1 and early E4 proof. **Rollback:** failed transaction publishes nothing; retain prior valid save. Risk is UI-only locks bypassable through developer/store commands, so enforce in domain commands too.

## E3 — Orchestration, condition, coaching and scoring

**Deliverables:** sequential manually started races, persistent player/rival condition, coaching seam, D1 signs, D4 official tied awards, standings, grids, authoritative DNF evidence and D5 cleared-race commit. Voluntary/forced withdrawal and opponent-only continuation use the same engine. One starter must race; zero starters produce a validated no-starter result with no invented performance awards.

**Files/interfaces:** race setup, condition adapter, coaching utility, scoring/classification, clearance proof and commit, existing race adapters; minimal intermission UI.

**Acceptance/tests:** D2 mapping table from reconciliation across all injury/integrity boundaries and services; no automatic recovery; equipment identity unchanged; player-only coaching effects, no-context exact legacy results; all six Sign priorities and failed physical maneuver diagnostics; competition ranks and full shared awards; first-reached-progress DNF ordering; seeded grid policies; eight entrants and smaller subsets; final DNF/DNS/DQ title distinctions; legal Pure/Combat actions and wreck persistence.

Condition updates must use the post-clearance native snapshot, not a reconstructed finish-health guess. Championship native inputs change only through approved persistent consequences/context. Opt-in first-reach instrumentation must not alter old default event/RNG/hash behavior.

**Dependencies:** E2 and early E4. **Risk/rollback:** partial condition/standings update, eligibility using stale labels, unconditional AI metadata changing old replays. Atomic commit protects prior state; blocked states remain recoverable without fabricated penalties.

## E4 — Complete resume/recovery and adversarial validation

**Deliverables:** integrate the proof with every E3 state and UI flow, periodic checkpoints, input journal lifecycle, earlier-checkpoint recovery and precise version errors.

**Tests:** every track format/weather and Pure/Combat; no incidents and pending incidents; long rally/multi-lap signs; collisions/control loss/wrecks, finish snapshots, DNF, post-finish clearance, withdrawn player with AI-only race, one/zero starter, queued coaching/setup state. Compare uninterrupted vs multiple reloads and earlier checkpoint+tail, not merely immediate digest equality. Corrupt data, storage denial/quota, duplicate/out-of-order inputs, wrong setup ID and version incompatibility must fail safely.

**Gate:** no unexplained resumed result/event/RNG differences; no stale generation can replay a committed race/reward. Verify no growing unbounded journal/transaction loop. Bound snapshot size, latency and race ticks with disclosed limits.

**Risk/rollback:** operational checkpoint recovery must not rewind committed financial state or protected history. Manual-mode limitations are explicit, never an implicit grid restart.

## E5 — Final classification, authority and M2-D settlement

**Deliverables:** separate points placement and eligible champion; null champion allowed; persistent immutable final registry; XP/RP/trophy and Gold entitlements; one trusted completion projection and exactly-once settlement; permanent career history and rival aggregates.

**Interfaces:** create/validate terminal result; `createCompletionBoundary(verifier)`; existing `quoteCycle(state,'cycle.settle',payload)` and `store.transaction(command,{completion})`; new versioned atomic wrapper only where necessary for aggregate/status/non-Gold claims. No second Gold ledger/authority.

Verifier must compare the entire expected completion against stored authoritative instance/result/claims, not return true for any self-consistent hash. Bind unique instance ID, ownership, frozen rules, outcome and all active home-stable contracts. `resultVersion:1` stays the existing completion schema literal; controller result versions live separately. Recreate WeakSet capability after validated reload. Bound reward IDs and totals, reject missing/extra rewards, preserve no-champion victory claims as unclaimed, retain legitimate withdrawn-player placement awards.

Native recovery integration must run at existing recovery position, before contract expiry/default-departure checks. Preserve settlement income→old debt→current wages→streak→recovery→expiry→departures→statement sequence. No per-race payroll. Do not auto-confirm career failure. All settlement and non-Gold entitlements/aggregate status must publish atomically or through a proven recoverable exactly-once coordinator, not separate unguarded writes.

**Tests:** complete/withdrawn/disqualified outcomes, no champion, title eligibility vs placement, tied race wins feeding universal tie comparator, reward ID reuse/conflict, full contract roster, stale revisions, reload before/after completion and every settlement step, repeated submission after receipt pruning, provenance/history preservation and debt restrictions. Repeated championships grant valid per-instance awards without duplicate trophies entries (increment victory count as specified).

**Risk/rollback:** capability cannot be serialized; trusted registry must be durable first. Failed settlement keeps a valid pending state and locks management/next registration until successful; no duplicate recovery or Gold.

## E6 — Six content templates, presentation and release verification

**Deliverables:** Dustroad Cup, Ironwheel Circuit, Bannerfall Series, Crownfire Grand Prix, Thunder Crown, playable Iron Gauntlet; data-driven future invitational framework only. Standard race-count targets2/3/4/5/7 and identity retained; other numeric values configurable/provisional. Iron Gauntlet requires authoritative Bannerfall trophy/victory, uses ordinary endurance mechanisms and no hidden fatigue multiplier. Resolve illustrative distance tables in concrete configurable schedules with fixtures, not another design vote.

**Files/interfaces:** catalog data, schedule fixtures, existing track selection/viewer and management UI, build script only if necessary, implementation/evidence docs. No framework changes, M2-F/G, new equipment durability, run wallet, full art replacement or new death thresholds.

**Acceptance/tests:** all schedules/capacities/qualification expressions valid; full disclosure and locked-event reasons; risk assessment grounded in current native/management state; standings/opponent condition visible; free pre-race coaching/signs; read-only stable; manual progression; blocked/recovery explanations; trophy history/qualification. Full automated/browser regressions and representative complete championships including withdrawal, zero starters, ties, repeats and Iron Gauntlet. Build both existing standalone outputs, inspect for runtime network dependencies, record hashes and sizes. Test actual file:// where permitted; report restrictions and keep owner Windows verification distinct.

**Rollback:** do not publish/merge without separate authorization. Report observed stalls and failures, do not weaken tests or tune unrelated physics/lethality.

## Addendum acceptance inventory — 16 required future cases

These are planned tests, not claims of execution. Labels correspond to the addendum acceptance families; implementation may split them into several tests.

| Case | Concrete test obligation | Gate |
|---|---|---|
| D1-01 | Starting signal, next closed-loop crossing and Rally checkpoint activation preserved | E3/E4 |
| D1-02 | Checkpoint/journal restores pending/active/use/cursor without duplicate activation | E4 |
| D2-01 | Cleared race native consequences mapped once into driver/beast/chariot career state | E3 |
| D2-02 | No between-race care/recovery; eligibility sees mapped consequences | E3 |
| D2-03 | Paid treatment/repair and once-only settlement recovery restore corresponding native state | E5 |
| D2-04 | Versioned mapping, legacy replay/save compatibility and no new equipment/permadeath rule | E1/E5 |
| D3-01 | Player coaching changes autonomous choices; preserves personality/no stat bonuses | E3 |
| D3-02 | Conflicting coaching yields to applicable active Sign; rivals unchanged | E3 |
| D3-03 | Frozen coaching survives resume; absent context preserves historical results | E4 |
| D4-01 | Competition ranks1,2,2,4 and full shared-place points/Gold/XP/RP | E3/E5 |
| D4-02 | Every officially tied first finisher receives win credit; no display-time tie inference | E3 |
| D4-03 | Scoped entitlement retries do not duplicate awards or split/redistribute prizes | E5 |
| D5-01 | Result and native condition derive from the same fully resolved clearance state | Early E4/E3 |
| D5-02 | Blocked clearance preserves recovery data and forbids advancement/settlement/consequences | E4 |
| D5-03 | Retry is deterministic/idempotent; conflict rejects without invented penalty | E4/E5 |
| D5-04 | Pending events, RNG, versions, journal, coaching/signs and non-finite sentinels survive recovery | E4 |

## Base-policy acceptance matrix

| Area | Required evidence beyond the 16 addendum cases |
|---|---|
| Registration | Eligibility, atomic fee, immutable schedule/roster, no substitutions, full capacity validation |
| Progression | Manual starts, fixed opponents, no management/recovery until settlement, deterministic grids |
| Classification | Full-precision finishes, DNF progress/first-reach, DQ/DNS, final actual participation, null champion |
| Standings/rewards | Points/wins/seconds/etc/last scheduled race/ID hierarchy; bonuses require authoritative telemetry; placement versus title separation |
| Withdrawal | Confirmed voluntary no refund, cleared nonfinal forced withdrawal, all remaining AI races, rewards retained |
| Persistence | M1/M2-A/B/C/D migrations, protected history/caps, corrupt save explicit recovery, exactly-once claims, manual mode |
| Career awards | Driver/beast participation/performance XP, no DNS participation, reputation thresholds, repeated trophies, Bannerfall qualification |
| Racing regression | Existing movement/AI/combat/weather/track/sign/replay suites unchanged in policy; no-context legacy checksum parity |
| Release | Full Node/browser tests, complete six-event content, self-contained HTML, direct-file verification or explicit limitation |

## Authorization and rollback boundary

This plan creates no APIs and authorizes no production work. After M2-D acceptance and explicit M2-E authorization, implement in gated stages; preserve baseline evidence and report failed proof gates rather than silently changing policies. Merge, push and deployment require separate authorization. No additional material gameplay choice is currently identified.
