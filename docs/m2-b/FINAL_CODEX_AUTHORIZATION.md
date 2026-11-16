# BLOOD AND THUNDER — M2-B FINAL CODEX IMPLEMENTATION AUTHORIZATION
**Owner approval:** 2026-11-16  
**Scope:** M2-B ONLY. **M2-C, M2-D, M2-E and M3 coding remain UNAUTHORIZED.**  
**Status:** Authorized to implement M2-B in a dedicated branch, test and report; **not authorized to merge without owner approval**.

## CODEX EXECUTION DIRECTIVE

Implement **Blood and Thunder M2-B only** from the current verified M2-A baseline. This file combines the prior M2-B implementation package, the owner-approved Draft 3 starting-package catalog, and the native engine inspection. The owner's approval **supersedes any earlier 'proposed', 'pending', 'blocked', or 'not an implementation authorization' status wording within the reproduced source documents**, but does **not** waive their technical constraints or authorize unrelated work.

**Order of authority:** (1) the owner's explicit decisions in this authorization, (2) the complete approved Draft 3 catalog reproduced below, (3) the M2-B implementation package reproduced below, (4) the native attribute inspection for factual code contracts, and (5) actual repository code/tests for compatibility. When an explicit conflict or unimplementable prerequisite remains, **stop and report it; do not invent mechanics**.

### Owner-approved decisions

- Asymmetric but balanced five-package design, Option B. The catalog's numbers are approved as initial balance values, not a guarantee of competitive parity.
- All Draft 3 native 0–100 driver, beast and chariot ratings, chariot weight **180** and capacity **400**, package Gold, roster counts, neutral equipment, facilities, and Basic property capacities are approved **exactly as written**.
- Starting Gold: Traditional **1,200**; Beastmaster Yard **850**; Mechanist Workshop **800**; Veteran Outfit **650**; Scrappy Underdog **750**.
- Each starts with **one Basic property**: **2 drivers, 0 specialists, 4 beasts, 1 chariot**; one initial assembled RU (one primary driver, two distinct lead beasts, sole chariot). Spare assets remain unassigned. Zero package purchase price.
- Native engine attribute contract is authoritative. **No runtime 1–10 conversion, new racing formulas, extra slot mechanics, species restrictions, equipment buffs or facility buffs.** Keep management metadata outside validated engine component payloads.
- **Strict pristine-career initialization:** valid schema-2, `management.initialized === false`, treasury exactly zero, empty management registries, no active-career financial/developer transactions or edits/provenance, no pending checkpoint, no prior initialization effect for that career, and valid identity/history integrity. Owner Profile developer edits solely for **other** careers do not disqualify this pristine career. Reject ineligible cases without mutation. Prior protected initialization remains authoritative across import/recovery/restored saves.
- All initial drivers and beasts Healthy, condition 100, racing driver strain 0, beast fatigue 0; all chariots Functional, native condition 100, wear 0; all XP 0. Do not conflate management driver fatigue with racing strain. The catalog's management integrity/Functional label must **not** be injected as an unknown native chariot `integrity` field.
- Initialization is an explicit, atomic, idempotent `career.initialize` domain command with a **career-derived protected effect identity**; no initialization on load/import/migration/preview. A second grant is impossible, including with a different command ID or package.

### Required implementation and verification

1. Audit the current repo and M2-A baseline; report commit hash and deviations before coding if any are material.
2. Implement typed validated owned records, deterministic package templates, references and exclusivity, property caps, explicit one-time initialization and treasury grant, native RU adapter and assembly/disassembly/eligibility preview, and minimal stage-specific UI.
3. Preserve schema-2 and protected history, M1 compatibility, both revisions, atomic persistence, recovery/import protections, deterministic racing behavior, and standalone offline HTML build.
4. Run the original M2-B acceptance matrix **plus all 15 tests in approved Draft 3**, and existing regressions. Include negative tests for cross-career provenance exception, active-career contamination, alternate package/command replay, old-save recovery and failed atomic publish.
5. Deliver code diff, tests/results, browser/manual test instructions, implementation report, any unresolved issues and branch/PR details. **Stop for owner review. Do not merge.**

### Scope exclusions (mandatory)

Do not implement M2-C/D/E or M3, markets, purchases, recurring wages/upkeep, repairs, treatments, progression spending, training, facility bonuses, race entry, championships, persistent AI careers, economy cycles, history compaction, or race-engine balance changes.

---

## APPROVED CATALOG — DRAFT 3 (FULL TEXT)

The text below is **owner approved in full**, including all tables. Any old draft status labels within it are historical and superseded by this authorization.

# BLOOD AND THUNDER — M2-B STARTING-PACKAGE CATALOG
**Design Addendum M2-B.3 · Native Attribute Review Draft 3 · 2026-11-16**

**Approval status:** Owner APPROVED *asymmetric but balanced* package philosophy (Option B). The asymmetric balance philosophy, Scrappy Underdog **750 Gold** adjustment, native-engine integration policy and strict pristine-career policy are **OWNER APPROVED**. Other numbers, loadouts, stat-scale assumptions, valuations, facilities and rules below are **PROPOSED FOR OWNER REVIEW**, **NOT YET APPROVED FOR CODEX IMPLEMENTATION**. M2-B remains blocked on the catalog. M2-C/D/E and M3 coding remain unauthorized.

## 1. Contract and prerequisites

- Each package grants a one-time, zero-cost starting stable with at least one legal RU (one driver, two **distinct** beasts, one chariot). No loans, wages due, obligations, contracts, starter purchases, hidden fees or randomized rerolls.
- Initial Gold is unrestricted **career treasury**. No championship-restricted funds or entry fees are created.
- Basic stable capacities are **2 drivers, 0 specialists, 4 beasts, 1 chariot** for every package; all five begin with the same Basic property tier. Starter facilities are **descriptive facility records only**, with no numerical economic, training, repair or racing modifiers until their M2-C/D contracts are approved. Facility records cannot override the Basic capacity ceilings.
- No starting specialists, contracts, candidates, market offers, projects, obligations, achievements, or advancement choices. No unapproved equipment combat/mass modifiers or compatibility restrictions.
- All starter assets are owned by the active career; names and IDs are deterministic templates/unique career-derived identities. Package selection is immutable after successful initialization.
- All driver/beast injuries are **Healthy**; driver engine strain = 0; beast fatigue = 0; chariot native condition = 100 and wear = 0. Management Functional status is separate. XP = 0 for all, even Veteran (its advantage is *starting competence*, not fictitious XP). No career developer-edited flag is set by legitimate initialization.
- **NATIVE ENGINE CONTRACT:** All driver, beast and chariot ratings in this catalog are explicit native 0–100 values; chariot weight 180 and capacity 400 are separately specified. This is an owner-review proposal, not an automatic conversion rule. Do not change simulation formulas.
- Engine component payloads exclude persistent management IDs and metadata; use an adapter. Driver management fatigue remains distinct from engine strain.


## 2. Package allocations

| Package | Gold | Drivers | Beasts | Chariots | Installed equipment | Descriptive starting facility | Main advantage / weakness |
|---|---:|---:|---:|---:|---|---|---|
| Traditional | **1,200** | 1 | 2 | 1 | Standard harness, standard wheels | Basic Stable | Liquid reserves and no major weakness / lacks specialty |
| Beastmaster Yard | **850** | 1 | 3 | 1 | Standard harness, standard wheels | Animal Yard | Stronger beasts and one reserve / less cash, ordinary chariot |
| Mechanist Workshop | **800** | 1 | 2 | 1 | Reinforced harness, precision wheels | Workshop Shed | Better chariot stats / less cash, ordinary beasts |
| Veteran Outfit | **650** | 2 | 2 | 1 | Standard harness, standard wheels | Veteran Quarters | Superior primary driver and reserve driver / lowest flexibility after Underdog |
| Scrappy Underdog | **750** | 2 | 3 | 1 | Patched harness, worn wheels | Makeshift Yard | More personnel/beast choices and growth-oriented underdog identity / weakest initial race stats and limited cash reserve |

**Equipment labels do not grant mechanics.** All equipment is neutral for M2-B, with **0** mass delta, **0** combat delta, **0** stat modifiers, and no durability/repair differences. Cosmetic labels are preserved for future design, but *reinforced*, *precision*, *patched* and *worn* are not claims of implemented effects. Mechanist's advantage is in its **chariot's base attributes**, not equipment bonuses.

**Package purchase price:** 0 Gold for all five (initialization is a grant, not a shop purchase). The Gold column is the opening treasury grant, not an amount deducted from a common purse.

## 3. Driver templates (proposed native ratings, 0–100)

**Order:** Driving / Beast Handling / Combat / Awareness / Nerve.

| Package | Driver role | Driving | Handling | Combat | Awareness | Nerve | Notes |
|---|---|---:|---:|---:|---:|---:|---|
| Traditional | Primary | 50 | 50 | 50 | 50 | 50 | Baseline generalist |
| Beastmaster Yard | Primary | 50 | 70 | 40 | 50 | 50 | Beast specialist |
| Mechanist Workshop | Primary | 50 | 40 | 50 | 60 | 50 | Machine-aware racer |
| Veteran Outfit | Primary | 80 | 60 | 60 | 70 | 80 | Strong primary driver |
| Veteran Outfit | Reserve | 40 | 50 | 40 | 50 | 50 | Available for later RU reassignment |
| Scrappy Underdog | Primary | 40 | 50 | 40 | 50 | 60 | Resilient but unpolished |
| Scrappy Underdog | Reserve | 30 | 40 | 40 | 40 | 50 | Spare driver, no free XP |

All listed drivers are Healthy and legally available for M2-B RU assembly. Reserve drivers do not form an additional RU without a second chariot.

## 4. Beast templates (proposed native ratings, 0–100)

**Order:** Speed / Power / Agility / Endurance / Discipline / Toughness.

| Package | Beast | Speed | Power | Agility | Endurance | Discipline | Toughness |
|---|---|---:|---:|---:|---:|---:|---:|
| Traditional | Lead A | 50 | 50 | 50 | 50 | 50 | 50 |
| Traditional | Lead B | 50 | 50 | 50 | 50 | 50 | 50 |
| Beastmaster Yard | Lead A | 70 | 60 | 60 | 70 | 70 | 60 |
| Beastmaster Yard | Lead B | 60 | 70 | 60 | 70 | 70 | 60 |
| Beastmaster Yard | Reserve | 50 | 50 | 60 | 60 | 60 | 50 |
| Mechanist Workshop | Lead A | 50 | 50 | 50 | 50 | 50 | 50 |
| Mechanist Workshop | Lead B | 50 | 50 | 50 | 50 | 50 | 50 |
| Veteran Outfit | Lead A | 50 | 50 | 50 | 50 | 50 | 50 |
| Veteran Outfit | Lead B | 50 | 50 | 50 | 50 | 50 | 50 |
| Scrappy Underdog | Lead A | 40 | 50 | 40 | 60 | 40 | 50 |
| Scrappy Underdog | Lead B | 50 | 40 | 40 | 60 | 40 | 50 |
| Scrappy Underdog | Reserve | 40 | 40 | 50 | 60 | 50 | 50 |

**Species/type:** use the engine's existing default draft-beast type if it is explicitly supported and nonrestrictive. If no canonical species is available, use `generic_draft_beast` as **management-only neutral type**, with no species-specific modifiers. Do not introduce horse/ox compatibility rules without approval.

## 5. Chariot templates (proposed native ratings, 0–100)

**Order:** Stability / Durability / Protection / Rolling Efficiency / Maneuverability. **Weight and capacity** must follow the current engine's actual dimensional contract; do not invent physical units or alter its formulas.

| Package | Stability | Durability | Protection | Rolling Efficiency | Maneuverability | Chariot identity |
|---|---:|---:|---:|---:|---:|---|
| Traditional | 50 | 50 | 50 | 50 | 50 | Standard racing chariot |
| Beastmaster Yard | 50 | 50 | 50 | 50 | 50 | Standard racing chariot |
| Mechanist Workshop | 70 | 70 | 60 | 70 | 70 | Workshop-tuned chariot |
| Veteran Outfit | 50 | 50 | 50 | 50 | 50 | Standard racing chariot |
| Scrappy Underdog | 40 | 40 | 40 | 40 | 40 | Salvaged racing chariot |

All chariots begin **Functional (integrity 100)**, regardless of descriptive names. This is intentional: a *salvaged* chariot is weaker in base attributes, not damaged or ineligible. Set native chariot `weight: 180` and `capacity: 400` in all five packages. These are explicit catalog proposals matching engine constructor defaults. Do not apply arbitrary weight penalties or capacity upgrades.

## 6. Facilities, capacity and property

All packages own **one Basic property**, with caps **2 personnel drivers / 0 specialists / 4 beasts / 1 chariot**. Facility names are flavor/record identity only in M2-B:

| Package | Facility label | Functional M2-B effects |
|---|---|---|
| Traditional | Basic Stable | None |
| Beastmaster Yard | Animal Yard | None |
| Mechanist Workshop | Workshop Shed | None |
| Veteran Outfit | Veteran Quarters | None |
| Scrappy Underdog | Makeshift Yard | None |

No starting facility can automatically heal, train, repair, improve stats, increase capacity, reduce upkeep or produce income. These effects belong to later M2 stages and require approval.

## 7. Initial RU and assignment

- Every package creates **one prospective assembled RU** with the package's primary driver, Lead A, Lead B, and sole chariot. Additional drivers/beasts remain unassigned reserves.
- Two distinct beast IDs are mandatory. No other racing unit is created, entered, locked or committed to a championship.
- Assignments must be represented by M2-A-compatible, versioned owned records with valid reciprocal references and exclusive ownership. Reassembly/disassembly must be explicit, atomic and idempotent.
- M2-B preview can show the proposed authoring attributes and **Healthy / Functional** eligibility. A derived performance preview is only permitted if the engine mapping is actually supported and approved.
- There are no starter injuries, debts, time advances, wages, XP awards, treatment actions, repairs, advancement credits, or extra management cycles.

## 8. Asymmetric balance assessment (not proof of numerical parity)

| Package | Opening-race advantage | Longer-term option | Exposure |
|---|---|---|---|
| Traditional | No stat weakness | 1,200 Gold liquidity | No specialist edge |
| Beastmaster Yard | Strong lead beasts | Reserve beast | 350 less Gold than Traditional |
| Mechanist Workshop | Strong chariot | Specialized chassis identity | 400 less Gold; no spare beasts |
| Veteran Outfit | Elite primary driver | Reserve driver | 550 less Gold; ordinary team/chariot |
| Scrappy Underdog | None; intentionally difficult early | Reserve driver + reserve beast, roster flexibility | 450 less Gold and weak primary RU |

**Balance caveat:** Scrappy Underdog remains an early-performance disadvantage in this draft, even though Option B calls for a compensating development opportunity. The spare driver and beast provide operational flexibility, but without future market, injury, recovery and advancement systems, they do not establish equivalent value. **Do not claim this catalog is mathematically balanced.** A future development bonus would require an approved, concrete progression mechanic; do not silently create one. Owner has approved increasing Scrappy Gold from 450 to 750; other catalog numbers remain proposed.

## 9. Catalog implementation invariants

1. Package ID and catalog version immutable on receipt; template fields must validate against actual schema-2 typed records.
2. Initialization is one atomic domain command with a **career-derived one-time initialization effect ID**, protected across import/recovery and abandoned timelines. Duplicate request returns prior receipt/acknowledgement; alternate command ID/package cannot grant twice.
3. **Pristine policy (OWNER APPROVED):** zero treasury, empty registries, no active-career transactions/edits/provenance, no pending checkpoint, no prior initialization effect. Owner Profile edited due solely to a different career does not disqualify a pristine active career. Invalid attempts reject without state mutation.
4. Initialization emits one auditable treasury grant equal to the package's Gold, with source package ID; no artificial debit for the package itself.
5. All starter asset grants are explicitly identified in a canonical receipt; no hidden RNG and no unowned or duplicate assets.
6. Legacy M1 receipts, protected P0 identities, dual revisions, mixed-checkpoint recovery and M1 racing checksums remain unchanged.
7. No initialization on load, import, migration, browser navigation or preview.
8. M2-B must not implement race entry, markets, wages, purchases, treatments, repairs, facilities effects, management cycles, advancement, championship rewards or compaction.

## 10. Native engine compatibility contract (inspection completed)

Codex inspected M2-A revision `5e93b2c23ed74000b42d4658c1232cdc10d0f0fb` in `M2_B_NATIVE_ATTRIBUTE_CONTRACT_INSPECTION.md` (2026-11-16). Driver, beast, chariot rating fields and condition/strain/fatigue/wear are native finite numbers in inclusive range 0–100. Chariot weight range is 1–5000 and capacity range is 1–10000. Starting weight/capacity are explicitly 180/400. Engine equipment aggregate is `mass:0`, `combat:0`. No native equipment slot or species compatibility contract exists. Native RU component payloads reject unknown fields; management ownership IDs and names must be adapted out. Exactly two distinct beasts is a management assembly requirement despite engine accepting 1–8. Preserve engine calculations and separate management fatigue from driver strain. Derived preview may use existing pure `derive()` only after validated adapter construction and must be labelled as baseline/no-weather preview; do not misrepresent it as a live weather-adjusted prediction.

All numerical starter ratings in sections 3–5 are **proposed native values**, selected explicitly for catalog review. Multiplication by ten was used as a design drafting convenience to preserve the prior relative shape, **not** as an authorized runtime conversion rule. Do not store the old 1–10 values.

## 11. Proposed acceptance tests

1. Each of five packages initializes a pristine career exactly once and yields precisely the tabled Gold/assets.
2. All package initial RUs are assembled with distinct beasts, valid ownership and valid assignment references.
3. Counts remain within Basic property capacities for all packages.
4. All drivers/beasts Healthy; strain/fatigue 0; chariots Functional/condition 100/wear 0; all XP 0.
5. No starting debts, contracts, specialists, jobs, market offers, progression credits or other hidden grants.
6. Equipment has no gameplay effects in M2-B and no fabricated compatibility restrictions.
7. Facility labels confer no unapproved mechanical effects.
8. Failed initialization leaves bytes, treasury, registries and protected history unchanged.
9. Retry, alternate package, alternate command ID, recovery and import cannot grant second initialization.
10. A pristine career under an Owner Profile edited only in another career remains eligible, provided protected initialization identity for this career is absent.
11. Active-career prior edits, transactions, pending checkpoint or nonzero treasury block initialization with diagnostics.
12. M1 and M2-A compatibility tests and deterministic racing checksums remain unchanged.
13. No runtime attribute conversion is invented; previews use native 0–100 values and label any derived baseline estimate accurately.
14. Offline standalone HTML build and save/export/import/recovery tests pass.
15. M2-C/D/E and M3 functionality remain absent.

## 12. Final owner decisions required before Codex resumes

- **D1 — PENDING:** Approve or revise native 0–100 asset ratings in sections 3–5, 180/400 chariot mass/capacity, four remaining Gold grants, facilities, neutral equipment, Basic property capacities and zero package price.
- **D2 — APPROVED:** Strict pristine migrated-career policy, with cross-career Owner Profile edit exception.
- **D3 — APPROVED:** Existing engine native attributes authoritative; no independent 1–10 management scale, no racing formula changes.
- **D4 — APPROVED:** Scrappy Underdog starts with 750 Gold and retains reserve driver/beast, no special progression bonus.

**NOT AN IMPLEMENTATION AUTHORIZATION.** All numerical catalog values other than Scrappy Underdog Gold remain proposed until owner sign-off. M2-C/D/E and M3 coding remain unauthorized.


---

## ORIGINAL M2-B IMPLEMENTATION PACKAGE (FULL TEXT)

The implementation scope and engineering requirements below remain in force. Its prior status statements and prior catalog-blocker language are superseded by this authorization and approved catalog above.

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


---

## CODEX NATIVE ATTRIBUTE INSPECTION (FULL TEXT)

This report documents the inspected M2-A source contract. It does not itself authorize new gameplay rules.

# Blood and Thunder — M2-B Native Attribute Contract Inspection

Date: 2026-11-16  
Inspected revision: `5e93b2c23ed74000b42d4658c1232cdc10d0f0fb` (M2-A)  
Purpose: document the native attribute contract for owner approval of the M2-B starting-package catalog.

## Scope and status

The owner approved Option B: the existing racing engine's attributes, ranges and formulas are authoritative. This report records the preceding read-only inspection. Exporting this report adds documentation only; production code, tests, dependencies, builds and save schemas remain unchanged. No tests or builds were executed for this inspection.

**Native ratings use a 0–100 scale, not a 1–10 scale.** Chariot weight and capacity have separate physical ranges. M2-B implementation remains paused pending the approved numerical catalog. M2-C, M2-D, M2-E and M3 remain unauthorized.

Source paths below are relative to the repository root. Line references refer to the inspected revision.

## 1. Driver attributes

| Native field | Type | Minimum | Maximum | Constructor default |
|---|---|---:|---:|---:|
| `driving` | Number | 0 | 100 | 50 |
| `beastHandling` | Number | 0 | 100 | 50 |
| `combat` | Number | 0 | 100 | 50 |
| `awareness` | Number | 0 | 100 | 50 |
| `nerve` | Number | 0 | 100 | 50 |
| `condition` | Number | 0 | 100 | 100 |
| `strain` | Number | 0 | 100 | 0 |

Definitions and defaults: `src/model/ru.js:10`, `driverAttributes`; `:24`, `component()`; `:30`, `defaultRU()`.

Optional `personality` contains `aggression`, `caution`, `patience`, `opportunism`, `staminaManagement`, and `tacticalDiscipline`. When supplied, all six must be finite numbers within 0–100, and unknown keys are rejected (`src/model/ru.js:85`, `validateRU()`).

`defaultRU()` does not assign personality. Race construction supplies a deterministic personality when absent, using the numeric portion of the RU ID (`src/sim/race.js:103`). `personality(index)` uses:

```js
25 + ((index * 23 + tendencyIndex * 17) % 61)
```

Source: `src/ai/driver.js:8–19`. At index zero the tendencies, in the order above, are 25, 42, 59, 76, 32 and 49. This is an algorithmic fallback, not a flat default of 50.

Driver **strain** is the native racing field. There is no native driver `fatigue` field. Management fatigue must remain distinct until an explicit mapping is approved.

## 2. Beast attributes

| Native field | Type | Minimum | Maximum | Constructor default |
|---|---|---:|---:|---:|
| `speed` | Number | 0 | 100 | 50 |
| `power` | Number | 0 | 100 | 50 |
| `agility` | Number | 0 | 100 | 50 |
| `endurance` | Number | 0 | 100 | 50 |
| `discipline` | Number | 0 | 100 | 50 |
| `toughness` | Number | 0 | 100 | 50 |
| `condition` | Number | 0 | 100 | 100 |
| `fatigue` | Number | 0 | 100 | 0 |

Source: `src/model/ru.js:2`, `beastAttributes`; `:30`, `defaultRU()`.

The engine validator permits **1–8 beasts** (`src/model/ru.js:59`). The factory creates two. Exactly two distinct owned beasts is therefore a management assembly requirement, not the engine's native team-size constraint.

There are no native species, breed, compatibility or familiarity fields in this component contract.

## 3. Chariot attributes and load semantics

| Native field | Type | Minimum | Maximum | Constructor default |
|---|---|---:|---:|---:|
| `stability` | Number | 0 | 100 | 50 |
| `durability` | Number | 0 | 100 | 50 |
| `protection` | Number | 0 | 100 | 50 |
| `rollingEfficiency` | Number | 0 | 100 | 50 |
| `maneuverability` | Number | 0 | 100 | 50 |
| `condition` | Number | 0 | 100 | 100 |
| `wear` | Number | 0 | 100 | 0 |
| `weight` | Number | 1 | 5,000 | 180 |
| `capacity` | Number | 1 | 10,000 | 400 |

Definitions: `src/model/ru.js:17`; defaults: `:30`; explicit weight/capacity validation: `:104–105`.

`derive()` defines:

```text
mass = chariot.weight + driverMass
       + beastCount × beastLoadMass + equipment.mass

load = (driverMass + equipment.mass) / chariot.capacity
```

Source: `src/model/ru.js:160–165`.

- Weight contributes to total movement mass.
- Capacity is a carried-load denominator, not a beast count, roster capacity or equipment-slot count.
- A load ratio above 1 is permitted. It incurs performance penalties through `max(1, load)`; it is not rejected as an incompatible assembly.
- Configuration explicitly labels mass inputs in kilograms (`src/config/config.js:23–26`). Capacity's interpretation as a comparable mass capacity follows from its use in the load formula; the component validator itself supplies no unit annotation.
- Default global allowances are `driverMass: 75` and `beastLoadMass: 10` per beast (`src/config/config.js:38–73`). There is no individual beast body-mass attribute or passenger mass field in this contract.
- `condition` and `wear` are separate numeric fields. A chariot `integrity` field is not accepted.

## 4. Shared validation contract

`src/model/ru.js:47–113`, `bounded()` and `validateRU()`, explicitly enforce:

- Finite JavaScript numbers. Strings, `NaN`, infinities and missing numeric fields fail.
- Inclusive numeric bounds. Fractional values are allowed; component ratings do not require integers.
- Required driver, chariot, beast and equipment fields.
- Rejection of unknown keys inside driver, beast, chariot and equipment components. This is not a blanket exact-key validation of the top-level RU object.
- An RU ID matching `[a-zA-Z0-9_-]{1,64}`, excluding the reserved ID `all`.
- A beast array containing 1–8 entries.

Defaults are supplied by constructors, not by `validateRU()`. Missing fields are not silently repaired.

The numeric validator accepts condition zero, but this does not establish race eligibility or continued operability. `updateControl()` has separate disablement/retirement checks (`src/sim/consequences.js:171`). Default thresholds include driver/chariot `disabledCondition: 5` and `minimumTeamCondition: 10` (`src/sim/consequences.js:41–42`). These are configurable consequence defaults, not alternative attribute bounds or management injury categories.

## 5. Equipment slots, effects and restrictions

The native engine consumes one aggregate equipment object:

| Field | Type | Enforced range | Default |
|---|---|---|---:|
| `equipment.mass` | Number | 0–10,000 | 0 |
| `equipment.combat` | Number | 0–100 | 0 |

Both fields are required; extra keys are rejected (`src/model/ru.js:106–112`).

Mass increases total mass and load. Combat contributes to derived combat effectiveness:

```text
combat = (driver.combat × combatSkill
          + equipment.combat × combatEquipment
          + control × combatControl) × driverCondition
```

Source: `src/model/ru.js:199–203`. Default weights are 0.6, 0.2 and 0.2 respectively (`src/config/config.js:75–102`).

**No native item-slot contract exists.** There are no item classes, weapon-slot requirements, species restrictions or equipment-count limits in this model. `eligibleCombat()` does not require an equipped weapon or a nonzero aggregate equipment Combat value (`src/sim/consequences.js:427`).

M2-A has reciprocal `chariots.equipment` / `equipment.installedOn` references (`src/career/registries.js:4–14`, `:44–45`). These are ownership-reference scaffolding, not implemented item slots, effect aggregation or compatibility rules. No additional restrictions or bonuses should be inferred from them.

## 6. Racing Unit construction and derived performance

`createRace()` (`src/sim/race.js:80–175`) clones supplied RU definitions, fills absent personality, derives validated statistics and creates runtime movement, AI, control and Strategy Sign state. RU IDs must be unique in the field (`:122–123`).

The native component payload contains a driver, a beast array, a chariot and aggregate equipment. Persistent component IDs, names and management metadata are not accepted inside those strictly validated component objects. Management integration needs an adapter rather than adding unrecognized fields to them.

`derive()` (`src/model/ru.js:114–229`) calculates:

| Stage | Existing relationship |
|---|---|
| Effective beast attributes | Each base rating multiplied by individual condition and fatigue impairment |
| Team Speed and Agility | Configurable blend of mean and minimum effective rating |
| Team Power | Sum of effective Power, multiplied by coordination |
| Team Endurance and Toughness | Mean effective rating |
| Team Discipline | Minimum effective Discipline |
| Coordination | Effective Discipline, driver Beast Handling and team mismatch |
| Handling | Agility, Maneuverability, Driving and Stability, with condition impairment |
| Control | Discipline, Driving, Beast Handling and Stability, with condition and morale effects |
| Maximum speed | Speed, Rolling Efficiency, mass and chariot condition/wear |
| Acceleration | Power, mass, grip and Handling, capped by acceleration limit |
| Endurance | Team Endurance divided by overload penalty |
| Resilience | Toughness, Protection and Durability, with chariot condition/wear |
| Combat | Driver Combat, equipment Combat and Control, with driver condition/strain |
| Other outputs | Braking, lateral movement, fatigue rate, recovery, collision resistance, effective Awareness and Nerve |

Key formulas include:

```text
effectiveBeastAttribute = base × condition/100 × (1 − impairment × fatigue/100)
driverCondition = condition/100 × (1 − impairment × strain/100)
chariotCondition = condition/100 × (1 − impairment × wear/100)

attributeMultiplier(x) = 1 + attributeStrength × (x/100 − 0.5)
massFactor = (referenceMass/mass)^massExponent / max(1, load)
```

See `src/model/ru.js:118–167`. Coefficients are centralized in `src/config/config.js`, including `tuningDefaults` at line 75; these remain configurable.

Weather and the current surface are applied by `deriveAt()` (`src/sim/race.js:399–408`), which adjusts grip and rolling resistance before deriving performance. A bare `derive()` call does not alone represent all live environmental effects.

Individual beast fatigue, driver strain and chariot wear evolve separately in `integrateCondition()` (`src/sim/environment.js:105–131`). No management fatigue, injury-category or equipment conversion has been approved or introduced.

## 7. Whether proposed 1–10 values can be used directly

**They pass numeric validation for rating fields, but do not preserve a conventional 1–10 scale meaning.** Native Speed 10 means 10 out of 100, substantially below the constructor benchmark of 50. There is no automatic normalization or multiplication by ten.

For example, with default `attributeStrength: 0.8`, the existing multiplier yields:

| Native rating | Multiplier |
|---:|---:|
| 1 | 0.608 |
| 5 | 0.640 |
| 10 | 0.680 |
| 50 | 1.000 |

Other relationships also use ratings directly, so this multiplier is illustrative rather than a complete performance conversion. Source: `src/model/ru.js:118`; default coefficient: `src/config/config.js:38–73`.

The owner-approved catalog must specify explicit native ratings. No automatic conversion is recommended as an implicit rule or implemented. Weight and capacity require separately chosen physical values.

## 8. Existing defaults and templates for catalog balancing

| Existing source | Values | Interpretation |
|---|---|---|
| `src/model/ru.js:30`, `defaultRU(id)` | Ratings 50; full condition; two beasts; weight 180; capacity 400; zero fatigue, strain, wear and equipment effects | Engine construction benchmark, not an approved career package |
| `src/sim/race.js:80–86`, default field | Eight RUs with uniform component ratings 46, 48, 50, 52, 54, 56, 58 and 60 | Default opponent-field template |
| `scripts/evaluation/scenarios.mjs:5–13` | Specialized beast archetypes using equal total attribute investment | Research fixtures, not approved starting assets or prices |
| `tests/fixtures.js:3–4` | General entrant helper defaults to rating 50 | Regression fixture benchmark |
| `tests/fixtures.js:53–66` | Specialized fractional ratings and deliberately damaged components | Diagnostic cases, not starter balance guidance |

The evaluation beast archetypes, in native order Speed / Power / Agility / Endurance / Discipline / Toughness, are:

| Archetype | Ratings | Total per beast |
|---|---|---:|
| Speed | 80 / 40 / 45 / 35 / 50 / 50 | 300 |
| Power | 45 / 85 / 40 / 35 / 45 / 50 | 300 |
| Handling | 45 / 40 / 80 / 40 / 60 / 35 | 300 |
| Endurance | 45 / 40 / 45 / 90 / 45 / 35 | 300 |
| Balanced | 50 / 50 / 50 / 50 / 50 / 50 | 300 |

Equal investment in these fixtures is an experimental control, not proof of equal competitive strength or a package-pricing rule.

**M2-A contains no approved persistent starting-asset catalog.** Foundation career creation supplies zero treasury (`src/career/legacy-state.js:92–96`), and `emptyManagement()` creates empty registries with `initialized: false` (`src/career/registries.js:16–17`). The registry module explicitly identifies itself as scaffolding without assets, prices or packages (`:3`).

## Owner review conclusion

The final package catalog should provide explicit native driver and beast ratings, chariot ratings plus weight/capacity, and any intended aggregate equipment effects. Constructor defaults and research fixtures provide comparison points only. They do not approve starting prices, package strength or equivalence.

The pristine-career initialization policy and protected initialization history remain applicable. No grants, conversions, management fatigue mappings, injury conversions, new equipment restrictions or production changes are implemented by this inspection or report export.
