# BLOOD AND THUNDER — M2-B CODEX IMPLEMENTATION PACKAGE
**Version:** Review Draft 1 · 2026-11-16  
**Status:** Proposed implementation authorization document; owner must explicitly approve execution.  
**Stage:** M2-B only — initialized stable, starting packages, typed owned assets, Racing Unit assembly.  
**M3 implementation:** NOT AUTHORIZED. **M2-C/D/E implementation:** NOT AUTHORIZED.

## 0. COPY/PASTE TASK FOR CODEX (USE ONLY AFTER OWNER APPROVES M2-B)

> Implement **Blood and Thunder M2-B only** using this entire package, the current GitHub repository, `M2_A_IMPLEMENTATION_REPORT.md`, and `SCHEMA_AND_TRANSACTION_API.md`. Start from the pushed, verified M2-A revision. First audit actual code and tests against the contract; do not assume this package overrides code reality. Implement schema-2 typed stable assets, explicit one-time initialization with the selected starting package, deterministic starter asset construction, validated ownership and Racing Unit assembly/eligibility previews, and minimal UI for those tasks. Preserve all M1/M2-A tests, racing behavior, persistence guarantees, legacy migration, P0 history and offline standalone build. Do **not** implement M2-C/D/E, M3, races/championship integration, economic markets, recurring wages, management cycles, repair/treatment transactions, advancement spending, AI career simulation, or history compaction. Where an indispensable design choice is not specified, stop and report the decision required; do not invent a rule that changes the game economy or canon. Run regression and browser tests, push a dedicated M2-B branch/PR (or the owner's established push workflow), deliver an implementation report, and **stop for review**. Do not merge without explicit owner approval.

## 1. Authority, evidence, and precedence

1. Explicit owner decisions and approved Blood and Thunder specifications control gameplay. M2-A's implemented persistence/identity contract controls compatibility unless an explicit approved change supersedes it.
2. Read the actual repository files and the supplied M2-A report/API contract before editing. This handoff is a *stage-scoped translation* of known decisions, not a claim that the complete original design specs 3.59–3.62 were supplied.
3. The current M2-A report states: 265 Node tests passed; 12 new M2-A managed-browser functional groups passed; Windows `file://` acceptance was blocked by the managed browser and remains for owner testing. These are **reported**, not independently audited here.
4. If the owner's local M2-A test uncovers a defect, pause M2-B until the owner resolves whether to fix M2-A first.
5. Do not treat illustrative schemas, names, IDs, attribute values, or balances in this document as approved numerical balance coefficients.

### Baseline contracts to preserve

- Vanilla JavaScript ES modules, HTML/CSS/Canvas2D, esbuild producing a **single offline standalone HTML**. No runtime network, CDN, backend, or new framework.
- Racing engine `0.6.0-tracks` unchanged; no modification to AI, physics, collision, fatigue, Strategy Signs, commentary, tracks, deterministic race checksums or replay.
- Discovery key `bnt.career.save.v1`; transport envelope `kind: BNT-game-save`, `schema: 1`; career payload schema 1 (legacy) and schema 2 (M2). Do **not** confuse envelope schema with career schema.
- Preserve `src/career/legacy-state.js` verbatim M1 compatibility and the existing `createCareer` legacy factory. Use the explicit schema-2 creation/migration path.
- Schema-2 state currently has eight original M1 top-level fields plus `maintenanceRevision`, `management` (uninitialized empty registries), `history` protected P0 commands, and `migration` metadata.
- `revisionToken(state)` includes gameplay `revision` and `maintenanceRevision`; both must be validated for new versioned domain requests.
- New schema-2 domain requests require `id`, `commandVersion:1`, `profileId`, `careerId`, `expectedRevision`, `expectedMaintenanceRevision`, `type`, and independent domain-derived `effectId`. Duplicate canonical request = no-op original receipt/acknowledgment; conflicting reuse = reject. A new command ID must not bypass duplicate business effects.
- Protected P0 command/effect facts cannot be deleted, fabricated, silently rekeyed, or compacted. `historyRetentionPlan` currently reports `canCompact:false`; M2-B must not implement compaction.
- Schema-2 envelope includes sealed `protectedHistory` and `maintenanceClock`; preserve atomic publish, recovery, manual export fallback, confirmation on migration/import and mixed-schema checkpoints.
- 16 registry names: `personnel`, `specialists`, `beasts`, `chariots`, `equipment`, `contracts`, `candidates`, `recruitmentOffers`, `marketOffers`, `properties`, `facilities`, `projects`, `assignments`, `obligations`, `advancementChoices`, `achievements`.
- M2-A foundation graph records have exactly `{id, ownerCareerId, references}`. M2-B must **extend typed payload validation intentionally**, preserving the existing ownership/reference guarantees and old uninitialized saves; never bypass validation to allow asset data.
- M2-A engineering bounds: legacy 2 MiB, protected schema-2 8 MiB, 1,000 active receipts, 2,000 known provenance/protected records. Fail closed at limits; never prune P0 to make space.

## 2. Authorized M2-B deliverables

### B1 — Typed domain catalog and validation

Implement typed, versioned, validated records needed for a playable **starting stable foundation**:

- Owner/career/stable identity and stable home/property configuration.
- Driver (`personnel`) with persistent identity, name, condition, fatigue, development/XP placeholders and race-relevant attribute interface.
- Draft beast (`beasts`) with persistent identity, species/type, condition, fatigue, development/XP placeholders and race-relevant attribute interface.
- Chariot (`chariots`) with persistent identity, condition/integrity, equipment slots and race-relevant attribute interface.
- Equipment (`equipment`) only to the extent necessary for starter loadouts and installed/owned reference validation; no purchasing or upgrades.
- Stable property/capacity (`properties`, `facilities`) only to the extent required for starting packages and storage/roster caps; no construction or upgrade transactions.
- Optional personnel/crew/specialist fields only if necessary for a package and already supported by approved specifications. No invented crew economy.
- Registry relationships and exclusive assignments for assembled RU, with consistent forward/reverse references where the M2-A contract requires them.

Keep unused M2-A registries valid and empty unless a documented starter package explicitly requires a record. Do not create phantom obligations, contracts, offers, projects or achievements simply to populate registries.

**Required invariants:** globally unique IDs across registries; dictionary key equals record ID; `ownerCareerId` equals current career; no dangling/cross-career/wrong-type references; legal cardinality; reciprocal equipment/property/employment relationships; no asset assigned incompatibly to two exclusive RUs; valid enum/number bounds; stable capacity enforced; state snapshots and public read views immutable.

### B2 — Explicit one-time initialization

Enable a narrowly scoped `career.initialize` **only** for schema-2 `management.initialized:false` states. Initialization must be an authorized, atomic gameplay transaction, not migration, import, save-load, UI opening or implicit starter grant.

Initialization inputs: chosen approved starting-package ID, explicit owner/career targets, expected gameplay/maintenance revisions, command identity and independently derived initialization effect identity. The canonical domain effect identity must be stable for the career's *one permitted initialization*, not regenerated per click or request. A second attempt with another package, new command ID or restored timeline must not grant another starter stable.

Preconditions: valid schema-2 state, no previous initialization effect, valid package ID, required owner consent, no conflicting preexisting assets or inconsistent legacy state. If a migrated schema-1 career has nonzero treasury, edits, transactions or pending checkpoints, **do not silently overwrite its Gold or add a starter grant**. Apply an explicitly documented safe policy approved by owner or stop and flag the case. No default 'fresh start' loophole through import or recovery.

On success: atomically set initialized flag, create exactly the package-authorized owned assets and stable capacities, record starting treasury as an explicit auditable grant if one is approved, emit P0 command/effect history and receipt, advance gameplay revision once, preserve maintenance-clock rules, and publish via existing store. On storage failure: no partial state, no leaked assets/Gold, original bytes retained/manual fallback.

### B3 — Starting packages and starting stable

**Established package choices:**
1. **Traditional** — baseline/free starting package.
2. **Beastmaster Yard** — beast-focused starting orientation.
3. **Mechanist Workshop** — chariot/engineering-focused orientation.
4. **Veteran Outfit** — experienced-driver starting orientation.
5. **Scrappy Underdog** — constrained/resourceful starting orientation.

These package *names and concepts* are established. **Exact initial Gold, personnel count, beast/chariot stats, package costs, facility grants, and tradeoffs are not present in the inspected M2-A files and must not be invented as canon.** Before implementing concrete grants, locate the authoritative approved package table in the repository or request owner approval of an explicit versioned package catalog. The five choices must not become five arbitrary balance profiles.

**Known provisional capacity reference:** Basic stable = 2 drivers, 0 specialists, 4 beasts, 1 chariot; Tier I = 3/2/6/2; Tier II = 5/4/10/4; Tier III = 8/7/16/6. These are *provisional design references*, not authorization to grant upgraded facilities or set package-specific tiers. Use only if confirmed by owner/source. Each legal starter must be capable of forming at least one RU or explicitly disclose a design blocker.

Package selection must preview the assets/capacities and any known costs before committing. Do not allow repeated package switching after initialization. No randomized reroll exploit: if starter variation is authorized, derive deterministic seed/identities from stable inputs and record provenance; otherwise prefer fixed package templates with unique stable IDs.

### B4 — Racing Unit assembly and validation

The approved RU composition for this stage is **one driver + two distinct beasts + one chariot**; optional crew/equipment only if legal and already owned. One RU is entered per race. M2-B provides **assembly and eligibility preview**, not actual race/championship entry or race integration.

- Validate all four required components exist, are owned by the active career, and are distinct where required.
- Enforce exclusive assignment/reservation semantics; no driver, beast or chariot may be simultaneously committed to incompatible assignments.
- Enforce chariot/equipment compatibility only where defined by approved rules; no invented species/chariot restrictions.
- Reflect condition and availability accurately. Existing M3 championship rule reference: driver/beast Healthy, Minor, Moderate can start; Severe/Dead cannot. Chariot Functional, Light, Moderate can start; Critical/Destroyed cannot. **These are established for M3 championship start eligibility; reuse for M2-B preview only if consistent with approved M2 baseline.** Do not implement championship-specific no-substitution or decider rules here.
- Chariot integrity reference (provisional): Functional 80–100, Light 60–79, Moderate 30–59, Critical 1–29, Destroyed 0. Do not hardcode contrary values or create repairs.
- Provide a deterministic derived-RU-stat preview via an adapter that respects current simulation's actual input contract. Do not change simulation formulas to force compatibility. If mapping from management attributes to racing engine attributes is not approved, expose validated raw stats and flag mapping as a future integration requirement instead of guessing.
- Define clear distinction between **assembled**, **eligible**, and **committed to a competition**; M2-B may implement the first two, but must not claim the third.
- Assembly/disassembly persistence behavior and any assignment transaction must be documented, versioned and idempotent. A read-only preview must not consume Gold, time, fatigue or management actions.

### B5 — Minimal stage-specific UI

Add only enough interface to:
- Create/open/migrate a schema-2 career under existing explicit safeguards.
- Choose and preview a starting package and initialize once after confirmation.
- View owned drivers, beasts, chariots, starter equipment and capacity/condition.
- Assemble/disassemble or select a prospective RU; display legal/illegal reasons and derived stats where grounded.
- Inspect receipt/revision/initialization status and export/save/recover through existing controls.

Do **not** implement the complete M2-E stable-management UI, markets, contracts, repairs, treatment, training, building, championship entry, or an automated gameplay loop. Keep UI functional offline at `file://` and consistent with existing project styling.

## 3. Explicitly out of scope

**M2-C:** recruitment/markets, buying/selling, contracts, wages, paid treatments, repairs, upgrades, projects, equipment acquisition, advancement transactions.  
**M2-D:** management-cycle step orchestration, recurring expenses, recovery ticks, training resolution, insolvency, liquidation, viability, career/Legacy progression.  
**M2-E:** integrated stable UI, compaction executor, retention controls, full management acceptance/stress tests.  
**M3:** championship manifest, six-race schedules, purse settlement, deciders, AI stable ecosystem, scouting, persistent championship archive, debriefs and favorites.  
**M4:** any additional future milestone work.  
No change to current M1 racing engine, Strategy Sign queueing, developer tuning tools, deterministic replay or track handling.

## 4. Transaction and persistence requirements

- All gameplay mutations use the schema-2 versioned domain command coordinator, not direct UI state mutation.
- Initialization effect ID should represent the *business event* `initialization of this career`, not the attempt ID. Ensure same career cannot be initialized twice even after history recovery/import.
- For each command, validate profile/career, gameplay revision, maintenance revision, command version, canonical request and independent effect identity before mutation.
- Exact duplicate request returns prior receipt/acknowledgment without replaying effects; same ID with changed package/payload rejects; different command ID reusing initialization effect rejects.
- Any RU assignment command requires a stable domain effect identity tied to its intended operation; distinguish legitimate later reassignment from a duplicate retry without allowing stale-command bypass.
- Keep protected P0 history and original M1 receipts; no rekeying, dropping, rewriting or fabricated transaction results.
- Validate full resulting aggregate before atomic publish. On quota, serialization, invalid data, stale revision or write failure, preserve prior authoritative bytes and offer established manual export path.
- Maintain recovery/checkpoint semantics, including schema-2 primary/schema-1 recovery and sealed maintenance clocks.
- No cross-career assets or owner Legacy merging on import.
- No automatic schema migration or initialization on load.

## 5. Suggested internal design boundaries (nonbinding)

Prefer separate modules for versioned asset catalogs/validators, package catalog, initialization reducer, RU assembly/preview, and minimal UI wiring. Extend `src/career/schema2.js`, `registries.js`, `state.js`, `history.js` and `career-store.js` only where their current contracts require. Keep deterministic domain builders pure and independent of DOM/storage. Avoid coupling management domain to Canvas2D viewer.

Do not replace or refactor M1's `legacy-state.js` in the name of cleanup. Avoid broad dependency/build changes. If an unavoidable schema/envelope version change is required, stop and request owner review before implementing it.

## 6. Acceptance and regression matrix

**Initialization**
1. New uninitialized schema-2 career has no assets/Gold grants until explicit confirmed initialization.
2. Each approved package, once fully specified, creates exactly its catalog assets and legal capacities.
3. Initialization commits exactly once; duplicate identical command is a no-op.
4. Different command ID, changed package, stale revision or reused initialization effect cannot double-grant.
5. Migrated edited/nonzero-Gold careers are not silently reset or rewarded.
6. Failure during save/commit leaves original state/bytes and no partial assets.
7. Loading/importing/recovering does not trigger initialization or duplicate grant.

**Typed assets and ownership**
8. All starter assets have globally unique stable IDs, correct career ownership and valid references.
9. Invalid foreign keys, cross-career refs, wrong registry types and broken reciprocal links reject.
10. Capacity overflows, invalid stats/conditions, impossible assignment overlaps reject.
11. Starter property/facility references and installed equipment are reciprocal.
12. Public snapshots/receipts cannot be mutated to alter stored state.

**RU assembly**
13. Valid RU requires one driver, two different beasts and one chariot.
14. Duplicate beast, missing asset, foreign owner, unavailable asset or exclusive conflict rejects with reason.
15. Condition-based eligibility preview distinguishes legal vs ineligible without changing state.
16. Assembly preview is deterministic, pure, and has no Gold/fatigue/time side effects.
17. If assembly is persisted, save/load/export/import preserves assignments and their referential integrity.
18. Any derived stat preview is consistent with existing racing-engine contracts or explicitly labeled not yet integrated.

**Compatibility and delivery**
19. Original M1 237-test baseline and M2-A 265-test reported suite remain passing (plus new tests); no tests weakened/deleted.
20. Existing racing deterministic checksums and bundled/Node parity remain unchanged.
21. Original schema-1 saves and mixed-schema recovery still work under M2-A rules.
22. Protected P0 history, dual revision checks and maintenance clock survive migration/import/recovery.
23. Build outputs remain single-file offline HTML without runtime requests or new dependencies.
24. Browser functional checks include initialization, repeat-click/refresh, failed transaction, RU validation and save/reload.
25. Windows `file://` test must be requested/reported honestly if unavailable in managed cloud browser; do not report as passed using HTTP navigation.
26. Verify source branch, commit SHA, PR/push and changed-file manifest; no M2-C/D/E/M3 code is included.

## 7. Stop conditions / owner decisions needed

**STOP BEFORE IMPLEMENTING BALANCE-SENSITIVE CONTENT IF:**
- Exact starting package grants and initial treasury are not in approved source material.
- Driver/beast/chariot stat ranges or mapping into race engine cannot be grounded in approved rules.
- Migrated schema-1 career initialization would require overwriting/adding nonzero resources.
- Starter capacity and package contents cannot produce a legal RU without an invented exception.
- Existing registry scaffold cannot be extended safely without breaking migration/recovery or changing envelope schema.
- M2-A local acceptance identifies an unresolved defect.

Codex may complete noncontroversial typed scaffolding and tests while preparing a concise decision list, but must **not invent and commit unsupported gameplay grants**. If an essential blocker prevents a coherent B-stage delivery, report it and stop for owner decision.

## 8. Codex delivery report required

Provide:
1. Starting commit SHA/branch and final commit SHA/branch/PR URL.
2. Exact authorized M2-B scope completed and explicit unimplemented items.
3. Changed files/modules and schema/API changes.
4. Approved package catalog source and exact grant table (or clear blocked status).
5. New domain commands, their effect identity rules, and idempotency proof/tests.
6. Asset/RU schemas and ownership/condition/assignment invariants.
7. Test commands, pass/fail counts, unchanged race checksums and standalone build evidence.
8. Browser results separated into HTTP/offline simulation and real `file://` tests; list untested Windows acceptance.
9. Import/migration/recovery and rollback evidence.
10. Deviations, open design questions, risks, and exact next-stage boundaries.
11. Explicit statement: **Stopped after M2-B. M2-C/D/E and M3 not started.**

## 9. Owner review gate

M2-B is **not accepted** merely because Codex reports tests passed or pushes a branch. Owner verifies M2-A locally, reviews M2-B implementation report and unresolved design questions, and explicitly approves further work. No automatic transition to M2-C.

## 10. Source provenance for this package

**Directly inspected supplied artifacts:**
- `M2_A_IMPLEMENTATION_REPORT.md` — completed scope, architecture, reported tests, limits, deferred work.
- `SCHEMA_AND_TRANSACTION_API.md` — schema, versioned commands, protected P0 history, 16 registries, recovery and maintenance clock.
- `Blood_and_Thunder_Gameplay_Vision_and_Structure.md` — game identity, persistent stable, RU, autonomous race, strategy and scope.

**Established project design context, not contained in the two M2-A files:** five starting package names/orientations; provisional stable capacity tiers; RU's two distinct beasts; condition eligibility and integrity bands; existing M2 progression/management stage boundaries. These must be checked against full approved design source before Codex treats balance-sensitive details as implementation authority.

**Important:** The M2-A report expressly states detailed specifications 3.59–3.62 were not supplied or located in the repository. This handoff does not falsely represent those missing original documents as reviewed. Provide them if available; otherwise resolve the flagged choices before implementation of affected systems.
