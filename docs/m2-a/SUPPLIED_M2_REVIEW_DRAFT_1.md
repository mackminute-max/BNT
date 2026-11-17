# BLOOD AND THUNDER
## M2 — Stable Management & Career Systems
### Codex Implementation Handoff — Review Draft 1

**Status:** Prepared for review. NOT AUTHORIZED FOR IMPLEMENTATION.

**Design authority:** Specifications 3.59, 3.60, 3.61 and 3.62, together with previously approved Blood and Thunder mechanics.

**Existing implementation:** M0/M1 persistence foundation, vanilla JavaScript ES modules, HTML/CSS/Canvas2D, esbuild standalone HTML, simulation `0.6.0-tracks`.

---

## 1. Mission

Extend the existing M1 career/persistence foundation into a playable M2 stable-management system.

Deliver a working stable-management interface, persistent domain model, validated transactions, configurable balance catalogs, progression infrastructure, financial management, recovery planning and Owner Legacy.

Do not implement championship racing integration, official race consequences, M4 events, venue services or outside specialist contracts.

Do not alter the existing racing engine or simulation behavior.

## 2. Execution authorization

This document is a design handoff only.

Do not begin repository modifications until the owner separately authorizes M2 implementation.

When authorized, execute stages M2-A through M2-E sequentially. Do not begin the next stage until the current stage's required tests pass.

Do not treat approval of the design as approval to code.

## 3. Initial repository inspection

Inspect the actual source tree, package scripts, M1 schema, career-store API, envelope validation, transaction handling, provenance registry, UI architecture and test suite.

Record the starting commit, working-tree state, versions and baseline tests.

Read the repository's architecture and implementation-readiness documents.

Identify any differences between the actual code and this handoff before changing source.

Do not overwrite unrelated changes.

## 4. Architecture

Maintain one authoritative persistent career aggregate.

Use independent domain modules for stable assets, employment, projects, finance, recovery, progression, Legacy and viability.

All mutations must use the existing career transaction coordinator and persistence adapter.

Do not write gameplay state directly to localStorage from individual UI components.

Use read-only selectors for derived statistics, availability, capacity, racing-unit legality and financial summaries.

Use strict validation and stable entity IDs.

## 5. M2-A — Persistence and domain foundation

### Required capabilities

- Implement a versioned schema 1 → schema 2 migration.
- Preserve existing Owner Profile and career IDs.
- Preserve treasury, revision lineage, transaction identities and developer provenance.
- Preserve valid M1 pending-race checkpoints as inert versioned records.
- Introduce empty management registries.
- Mark migrated Foundation careers as uninitialized.
- Require a separate explicit career-initialization transaction.
- Implement authoritative ownership and foreign-key validation.
- Introduce protected history identity retention.
- Prepare hybrid history-compaction interfaces.
- Maintain safe primary/recovery checkpoint behavior.
- Maintain manual-save fallback and export acknowledgment.
- Maintain duplicate transaction rejection and immutable receipts.

### Migration restrictions

Migration must not grant Gold, personnel, beasts, chariots, facilities, achievements or management progress.

If migration fails, preserve the previous valid save.

Do not silently discard incompatible pending checkpoints.

### Required gate

Existing M1 saves migrate without loss of identity, balances, provenance or checkpoint integrity.

All existing M1 persistence tests continue passing.

## 6. M2-B — Playable stable foundation

### Career initialization

Implement the approved starting packages:

- Traditional
- Beastmaster Yard
- Mechanist Workshop
- Veteran Outfit
- Scrappy Underdog

The Traditional package is the free baseline.

Each package must provide one property, one driver, two beasts, one chariot and appropriate starting equipment.

No paid specialist is mandatory.

Every starting package must pass the first-eligible-championship affordability invariant using configurable future championship requirements.

### Candidate selection

Generate a limited persistent driver candidate pool.

Generate five persistent beast candidates, from which the player chooses two.

Ensure at least two Fair-or-Good beast pairings.

Generation must be deterministic and cannot reroll on reload or menu reopening.

### Stable assets

Implement:

- Racing personnel
- Specialists
- Beasts
- Chariots
- Equipment
- Employment contracts
- Persistent recruitment offers
- Persistent asset-market offers
- Property ownership
- Stable capacity pools

Maintain separate racing-personnel, specialist, beast and chariot capacities.

Injured or unavailable owned entities continue occupying capacity.

### Racing-unit assembly

Validate exactly one driver, two distinct beasts and one chariot.

Validate eligibility, ownership, condition, equipment compatibility and exclusive assignments.

Support optional eligible chariot crew where appropriate.

Provide explicit legality diagnostics.

Do not lock a racing unit to a championship; M3 owns that operation.

### Required gate

A new career can initialize once, acquire and manage assets, assemble a legal racing unit, save, reload and export/import without changing the authoritative state.

## 7. M2-C — Development systems

Implement:

- Property tiers and traits
- Facilities and upgrades
- Specialist project assignments
- Training projects
- Technique retraining
- Driver advancement
- Beast advancement
- Fixed advancement-choice generation
- Banked advancement opportunities
- Natural recovery
- Ordinary repair
- Beast-pair compatibility and familiarity

### Advancement

Driver specialization tracks:

Precision Driving, Beast Mastery, Combat Technique, Racecraft, Mental Conditioning.

Beast specialization tracks:

Endurance, Pacing, Response, Desensitization, Pulling Coordination.

Generated advancement options are fixed and persisted.

Reloading cannot regenerate them.

### Projects

Use explicit available, active, paused, completed and applicable terminal states.

Exclusive assignments must prevent conflicting use.

Paused projects release specialist reservations but retain progress.

Resuming revalidates all requirements.

### Recovery

Use the approved injury and chariot condition models.

Dead personnel/beasts and Destroyed chariots remain terminal.

Natural recovery occurs only during a valid qualifying management cycle.

M4 exceptional between-race recovery is excluded.

### Required gate

Projects, training, recovery and advancement respond correctly to deterministic authorized test-cycle fixtures.

No menu, save or reload action advances progression.

## 8. M2-D — Economy, viability and Legacy

### Treasury

Use integer Gold.

Every economic operation must have one authorized source and an immutable effect record.

Prevent negative balances and duplicate purchases or proceeds.

### Obligations

Implement wages, contracts, property upkeep, arrears and partial payments.

Apply approved ordering:

1. Oldest assessment age.
2. Racing personnel wages.
3. Specialist wages.
4. Contracts.
5. Property upkeep.
6. Stable ID.
7. Obligation ID as final deterministic tie-break.

Partial payments retain original assessment age.

Apply available proceeds to arrears before discretionary treasury.

### Management cycles

A cycle requires a unique officially qualified token.

M2 may use explicitly labeled developer test fixtures, but must not invent official race results.

Approved cycle sequence:

1. Validate unused qualification.
2. Apply natural recovery.
3. Advance eligible projects.
4. Resolve completed projects.
5. Assess obligations.
6. Apply arrears allocator.
7. Expire eligible offers.
8. Generate next valid market offers.
9. Recompute availability and viability.
10. Commit once.

A zero-race withdrawal does not qualify a management cycle.

### Overcapacity

If a valid exceptional effect causes occupancy to exceed effective capacity, enter a restricted overcapacity state.

Preserve all owned assets.

Block additional acquisitions in the affected pool and incompatible new assignments.

Allow valid sales, releases and capacity-restoring upgrades.

### Viability

Implement Viable, Recoverable, Unresolved, Irrecoverable and Controlled Liquidation.

Use bounded, asset-preserving recovery search.

Provisional defaults: depth 8, maximum 5,000 explored states.

Exhausted search returns Unresolved.

Return one verified primary plan and up to two distinct alternatives.

Do not automatically execute recovery plans.

### Controlled Liquidation

Do not create new time-based obligations or management-cycle advancement from liquidation actions.

No loans, grants, bailouts or automatic liquidation.

### Owner Legacy

Implement achievement records, Legacy Point ledger, permanent unlocks, starting packages and three fixed perk slots.

Do not award placement-derived achievements without M3 official results.

Exclude prohibited developer-edited career progression.

Never transfer ordinary career assets or Gold into a new career.

### Required gate

Financial reconciliation, arrears priority, viability, liquidation and Legacy invariants pass deterministic tests.

## 9. M2-E — UI, compaction and acceptance

Build a player-facing stable-management UI containing:

- Career creation
- Stable overview
- Personnel and contracts
- Beasts and compatibility
- Chariots and equipment
- Property and facilities
- Markets and recruitment
- Training and projects
- Finances and obligations
- Racing-unit assembly
- Recovery and viability
- Controlled Liquidation
- Owner Legacy
- Save management

Maintain the existing developer panel separately.

Show transaction previews before consequential commitments.

Previews must not mutate state or advance RNG.

### Hybrid history compaction

Implement three retention classes:

P0: protected facts, identities and effects.

P1: historical detail that may be summarized with player confirmation.

P2: provably redundant data that may be removed automatically at safe checkpoints.

Retain protected transaction identities and request fingerprints after verbose receipt compaction.

A duplicate compacted transaction must never reapply effects.

Where exact result replay is unavailable, return a non-mutating `ALREADY_COMMITTED` acknowledgment.

Keep gameplay revision separate from persistence-maintenance revision; validate both for stale writes.

Do not compact during race execution, unresolved settlement, recovery-required state or unacknowledged manual-save state.

Preserve the previous valid recovery checkpoint.

Do not silently remove protected records to fit storage limits.

### Required gate

Complete M2 UI and persistence work in the standalone offline HTML.

Run all existing tests and new M2 tests.

Verify schema migration, save/load, import/export, corruption recovery, manual-save fallback, compaction and long-career stress behavior.

Provide a Windows direct-file acceptance checklist.

## 10. Balance-data policy

All unapproved numeric values must be centralized in versioned catalogs.

Do not hardcode balance coefficients in domain reducers.

Provisional stable capacity:

Basic: 2 racing personnel, 0 specialists, 4 beasts, 1 chariot.

Tier I: 3, 2, 6, 2.

Tier II: 5, 4, 10, 4.

Tier III: 8, 7, 16, 6.

Provisional natural injury recovery:

Minor +50 progress/cycle.

Moderate +20 progress/cycle.

Severe +10 progress/cycle.

Provisional basic treatment:

Minor +50, Moderate +40, Severe +30.

Provisional chariot integrity:

Functional 80–100, Light 60–79, Moderate 30–59, Critical 1–29, Destroyed 0 only by explicit terminal outcome.

Starting Gold, package bonuses, wages, upkeep, purchase prices, project costs, advancement costs, Legacy unlock costs and exact modifiers require configurable defaults.

All starter configurations must satisfy the first-entry affordability invariant.

Document every provisional default.

## 11. Transaction safety

Every command must include transaction identity, command version, career/profile targets and expected revision.

All mutations must validate ownership, eligibility, capacity, financial effects, assignments and lifecycle.

Commit the complete result or nothing.

Protect effect identities independently of command IDs.

Examples: initialization, offer fulfillment, project completion, obligation assessment, advancement selection and achievement award.

No unrestricted production JSON patch command.

Developer edits must preserve permanent provenance.

## 12. Determinism

All generated candidates, market offers, advancement choices and qualifying-cycle outcomes must use persisted deterministic generation contexts.

Preview operations must not consume RNG.

Reload, import/export and UI reopening must not reroll generated content.

## 13. Testing

Add unit, integration, persistence, fault-injection, deterministic-generation and browser tests.

Required scenarios include:

- Schema migration with and without developer edits.
- Failed migration and failed storage writes.
- Duplicate initialization and transaction replay.
- Capacity overflow and overcapacity resolution.
- Duplicate asset ownership and equipment installation.
- Employment contract conflicts.
- Candidate and market reroll prevention.
- Fixed advancement options after reload.
- Paused/resumed exclusive projects.
- Qualified and unqualified management cycles.
- Natural recovery and terminal-condition restrictions.
- Arrears ordering and partial payments.
- Controlled Liquidation without time advancement.
- Viability proof bounds.
- Legacy reward isolation.
- Protected transaction identity after compaction.
- Manual-save export acknowledgment.
- Primary/recovery checkpoint integrity.
- Long-career storage limits.
- Unchanged racing simulation behavior.
- Offline standalone HTML functionality.

Do not weaken or delete existing tests to obtain passing results.

## 14. Deliverables

Provide:

1. Updated source code, only after separate authorization.
2. Rebuilt standalone HTML artifacts.
3. Versioned schema and migration documentation.
4. Balance-data catalog with provisional values identified.
5. Transaction API and entity-reference documentation.
6. Automated test results and regression comparison.
7. Browser test evidence.
8. Windows acceptance checklist.
9. Known limitations and unresolved issues.
10. Final implementation report identifying exact completed and deferred scope.

## 15. Stop conditions

Stop and request clarification if:

- The repository contradicts a material design assumption.
- An approved rule cannot be implemented without changing another approved rule.
- A migration would discard valid existing data.
- A persistence limit requires dropping protected history.
- A transaction cannot be made atomic with the existing architecture.
- A feature requires modifying the racing engine.
- A requested operation crosses into unauthorized M3/M4 scope.
- A required numerical rule has no defensible provisional default and materially changes gameplay architecture.

Do not silently invent a workaround.

## 16. Completion definition

M2 is complete only when all five stage gates pass, the integrated management UI functions, authoritative saves remain valid, all existing racing regressions pass, and the owner completes the required standalone Windows acceptance.

Completion of automated tests alone does not establish final owner acceptance.

**Authorization state: NOT AUTHORIZED TO CODE.**
