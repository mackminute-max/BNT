# Blood and Thunder — M2-C Read-Only Preflight Report

Date: 2026-11-17

**Status: Preflight complete; M2-C implementation is not authorized or started.**

This report exports the findings already presented to the owner. The preflight made no repository changes. Creating this Markdown document is a separately requested documentation-only action; no production code, tests, dependencies, save schemas or build artifacts are modified. No migration, commit or PR is performed.

## 1. Executive assessment

The accepted M2-B baseline is merged and intact, and its full automated suite passes. The existing architecture can support incremental M2-C work without replacing the racing engine. However, valuation-health rules and several economic/migration details require resolution before implementation. Proposed resolutions below are not implemented or silently treated as approved rules.

## 2. Verified baseline

| Item | Verified result |
|---|---|
| Repository | https://github.com/mackminute-max/BNT |
| Branch | `main` |
| Local and remote HEAD at inspection | `105bce8a2a8f639b56c703cd75c56ce212471021` |
| Accepted M2-B implementation | `bf36f5a8ad139eda4bb444c1ec56fa814574df88`; merged file tree matches exactly |
| Working tree during preflight | Clean before and after inspection |
| Node / npm | 24.22.1 / 11.9.0 |
| esbuild / playwright-core | 0.28.2 / 1.65.1 |
| Chromium | 156.0.8078.79 |
| Fresh `npm test` | **293 passed, 0 failed, 0 skipped** |
| Uploaded package integrity | All six Markdown files matched the ZIP SHA-256 manifest |

The existing standalone SHA-256 remained:

```text
3f8c8e33acebe128c8b1f25e327c5feefdaf5900d120ff38d016db62a21bd83d
```

The uploaded `Blood_and_Thunder_M2-C_Codex_Handoff.zip` was read in its prescribed order. Source was compared with:

- `docs/m2-b/SCHEMA_AND_TRANSACTION_API.md`
- `docs/m2-b/M2_B_NATIVE_ATTRIBUTE_CONTRACT_INSPECTION.md`
- `docs/m2-b/M2_B_IMPLEMENTATION_REPORT.md`

The specifically named `SCHEMA_AND_TRANSACTION_API (1).md` was not present; the repository API document was used. Historical pending/acceptance wording in prior reports was distinguished from the owner's subsequent acceptance and verified merge.

All source line references below refer to the inspected HEAD. Repository-relative paths remain meaningful when this report is exported.

## 3. Native mapping and valuation-health contract

The current implementation uses engine `0.6.0-tracks`, career schema 2, initialized registry schema 2 and typed record version 1. **The native adapter has no explicit adapter-version field, and no valuation-health adapter exists.** This table documents the current contract snapshot; it does not invent an implemented valuation-adapter version.

| Field / relationship | Source-verified mapping or formula | Bounds and source |
|---|---|---|
| Driver ratings | Five native ratings copied unchanged | Finite numbers, including decimals, 0–100; `src/model/ru.js:10`, `:47–83` |
| Driver native condition / strain | Effective factor = `(condition/100) × (1 − impairment × strain/100)` | Both 0–100; `src/model/ru.js:156–157` |
| Driver management fatigue | Stored separately; excluded from native payload | 0–100; `src/career/assets.js:11`, `src/career/assembly.js:25` |
| Beast ratings / condition / fatigue | Effective rating = `rating × condition/100 × (1 − impairment × fatigue/100)` | All 0–100; `src/model/ru.js:120–127` |
| Beast fatigue bridge | Management record fatigue is copied directly to native beast fatigue | `src/career/assembly.js:26` |
| Management injury | Label used for eligibility, with no conversion to native condition | Healthy, Minor, Moderate, Severe, Dead; `src/career/assets.js:4`, `src/career/assembly.js:19` |
| Chariot native condition / wear | Effective factor = `(condition/100) × (1 − impairment × wear/100)` | Both 0–100; `src/model/ru.js:158–159` |
| Chariot management integrity | Separate from native condition and wear | 0–100; `src/career/assets.js:13`, `:28–29` |
| Integrity status | Functional ≥80; Light ≥60; Moderate ≥30; Critical >0; Destroyed =0 | `src/career/assets.js:8` |
| Chariot weight / capacity | Copied unchanged to native payload | Weight 1–5000, capacity 1–10000; `src/model/ru.js:104–105`, `src/career/assembly.js:27` |
| Driver valuation health `H` | **Not defined** | M2-C requires a versioned authoritative formula producing 0–100 |
| Beast valuation health `H` | **Not defined** | Same blocker |
| Chariot valuation health `H` | **Not defined** | Integrity, condition and wear cannot be substituted or averaged without approval |

Default impairment is 0.5 (`src/config/config.js:82`), but it remains configurable. A racing impairment formula is not evidence of an approved valuation-health formula.

Read-only in-memory diagnostics on copies of an existing saved fixture confirmed:

- Changing driver management fatigue did not change native inputs or derived performance.
- Changing chariot integrity within an eligible band did not change native inputs or derived performance.
- Changing beast fatigue or chariot wear changed native inputs and derived performance.
- A native rating of 59.5 passes existing validation.

These probes did not run transactions, migrations or storage writes.

**BLOCKED:** authoritative valuation, condition-based pricing and acquisition-basis calculation require explicit per-asset `H` contracts. Chariot repair also needs confirmation of whether only management integrity changes, or whether a separately approved native-condition mapping is intended. Refurbishment can reduce the existing native wear field without changing engine formulas.

## 4. Exact starter grants and equipment itemization

Source: `src/career/packages.js:7–31`.

| Package | Gold | Drivers | Beasts | Chariots | Owned equipment records |
|---|---:|---:|---:|---:|---:|
| Traditional | 1200 | 1 | 2 | 1 | 2 |
| Beastmaster Yard | 850 | 1 | 3 | 1 | 2 |
| Mechanist Workshop | 800 | 1 | 2 | 1 | 2 |
| Veteran Outfit | 650 | 2 | 2 | 1 | 2 |
| Scrappy Underdog | 750 | 2 | 3 | 1 | 2 |

Every package has Basic capacities **2 drivers / 0 specialists / 4 beasts / 1 chariot**, one descriptive facility and one initial prospective RU. All initial drivers/beasts are Healthy, all chariots Functional, native condition 100, fatigue/strain/wear/XP zero, chariot weight 180 and capacity 400.

**VERIFIED:** equipment is itemized. `src/career/packages.js:26–27` creates two owned records with stable IDs, career ownership and reciprocal installation references. Every item has `mass:0`, `combat:0`. They are not merely UI labels or newly inferred inventory.

| Package | Item labels |
|---|---|
| Traditional / Beastmaster / Veteran | Standard harness; Standard wheels |
| Mechanist | Reinforced harness; Precision wheels |
| Scrappy | Patched harness; Worn wheels |

**REQUIRES_DESIGN_CLARIFICATION:** the source provides no acquisition basis or economic tier for these labels. Their names must not be interpreted as Budget/Standard/Premium pricing without approval.

Equipment/chariot resale also needs an installation policy. RU disassembly releases RU subjects but leaves equipment installed (`src/career/assembly.js:49–56`). Selling an item or chariot must preserve reciprocal references without silently deleting, bundling or detaching assets. Proposed compatible resolution: approve a narrow explicit detach policy using existing references, without introducing slots or bonuses.

## 5. Gap report

| Status | Finding | Proposed compatible resolution |
|---|---|---|
| **BLOCKED** | Market category rows total **9 Budget / 9 Standard / 5 Premium**, while the totals row specifies **9 / 10 / 4**. Both total 23. | Owner identifies the authoritative distribution; do not silently correct either table. |
| **BLOCKED** | Valuation-health `H` adapters are absent. | Approve versioned per-asset formulas and repair/refurbishment relationships before valuation work. |
| **REQUIRES_DESIGN_CLARIFICATION** | M2-C injury labels and eligibility differ from M2-B. | Keep schema-2 behavior unchanged; define schema-3 labels and eligibility explicitly. Valid starter migrations are Healthy and need no injury conversion. Reject unsupported inputs rather than invent mappings. |
| **REQUIRES_DESIGN_CLARIFICATION** | Starting equipment has real records but no acquisition basis/tier mapping; sale installation handling is unspecified. | Approve basis values/formula and explicit detach/sale semantics. |
| **VERIFIED GAP** | Market generation, market seed and economic rounding helpers are absent. | Add an isolated versioned generator keyed by persisted career identity, never race RNG; persist inputs/results once. |
| **REQUIRES_DESIGN_CLARIFICATION** | Market stat distributions, condition generation and specialist-role allocation are not fully specified. | Approve templates or bounded generation rules rather than invent balance-sensitive distributions. |
| **REQUIRES_DESIGN_CLARIFICATION** | Training tables use integer bands although native ratings allow fractions. Rating 59.5 has no literal table band. | Proposed continuous intervals: `<60`, `<75`, `<90`, then `<100`; reject any full increment exceeding 100. Requires confirmation. |
| **VERIFIED GAP** | Schema-2 validation requires base assets to remain equal to starter grants and reconstructs assignment state using M2-B commands. | Add separate schema-3 validation/reducers; preserve schema-2 checks and existing receipt bytes. |
| **REQUIRES_DESIGN_CLARIFICATION** | Protected migration receipt semantics must fit revision accounting. | Decide maintenance-only versus gameplay-revision migration before implementing its receipt representation. |

### Market arithmetic discrepancy

In uploaded `01_MASTER_IMPLEMENTATION_SPEC.md:11–16`:

```text
Budget:   2 + 2 + 1 + 1 + 3 = 9
Standard: 2 + 3 + 1 + 1 + 2 = 9
Premium:  1 + 1 + 1 + 1 + 1 = 5
```

The displayed total row is 9/10/4. No distribution was selected during preflight.

### Injury and eligibility boundary

M2-C specifies Healthy/Minor/Major/Critical, with Major/Critical ineligible. M2-B stores Healthy/Minor/Moderate/Severe/Dead and its preview rejects Severe/Dead, permitting Moderate subject to other checks. Sources: `src/career/assets.js:4`, `src/career/assembly.js:19–24`.

The approved new schema can have its own semantics, but old labels must not be passed through an incompatible preview or silently renamed. All currently valid canonical M2-B starter assets are Healthy, so their ordinary migration does not require guessing a nonhealthy conversion.

### Assigned but ineligible RUs

Current assignment reconstruction invokes eligibility checks. Reusing that mechanism against later damaged current assets could reject the aggregate instead of preserving the assignment and reporting it ineligible. Schema 3 must distinguish historical assignment validity from present eligibility.

Sources: `src/career/schema2.js:63–71`; `src/career/assembly.js:38–45`.

### Migration protection and revision accounting

Current migration advances maintenance without adding a gameplay receipt. Ordinary protected commands assume `resultRevision = expectedRevision + 1`; the ledger requires gameplay revision to equal active receipt count.

A maintenance-only protected migration therefore needs an explicit compatible record variant. Alternatively, a migration that consumes a gameplay revision needs an approved semantic decision. Neither was selected during preflight.

Sources: `src/career/history.js:17–32`; `src/career/legacy-state.js:60–73`; `src/persistence/career-store.js:54–64`.

## 6. Protected history, commands and persistence

The following are **VERIFIED**:

- Initialization effect: `initialize-${careerId}` (`src/career/domain-commands.js:5`).
- M2-B assignment effect: `assembly-${careerId}-${revision}-${maintenanceRevision}` (`:6`).
- Strict v1 command shape, ownership and both expected revisions (`src/career/domain-commands.js:7–17`, `src/career/schema2.js:103–110`).
- Exact committed retries resolve before stale-revision rejection. Conflicting canonical requests reject; missing active receipts yield `ALREADY_COMMITTED` with null receipt (`src/career/history.js:70–74`).
- Retained effects cannot be spent again across restored timelines (`src/persistence/career-store.js:66–76`).
- **1000 active receipts**, **2000 protected identities**, no pruning (`src/career/legacy-state.js:6`, `src/career/history.js:4`, `:50`).
- **8 MiB imported envelope bound**, including all serialized checkpoints/history (`src/career/foundation-catalog.js:2`, `src/persistence/envelope.js:16–24`).
- Full candidate validation before single storage write; prior state/bytes remain authoritative on failure; manual fallback and explicit checkpoint acknowledgment retained (`src/persistence/career-store.js:29–44`).
- Confirmed import/recovery preserve protected facts and advance maintenance as applicable (`src/persistence/career-store.js:79–107`).
- Canonical serialization sorts object keys; the short checksum is a corruption diagnostic, not authentication (`src/core/determinism.js:17–27`).

### Required v2 extension

`src/career/history.js:18` currently identifies any versioned command as protocol version 1. Its validators support protected command versions 0/1. M2-C must explicitly dispatch version 2 while preserving old entries byte-for-byte, keeping protected-history outer schema 1 if a compatible additive representation is used.

New economic effect identities should distinguish operation type and business target—offer, upgrade, asset or service operation—rather than indiscriminately reuse the M2-B assignment slot. M2-B v1 assignment behavior must remain unchanged.

### Source guards requiring schema-3 paths

- Career dispatch recognizes schema 2 or falls back to legacy schema 1: `src/career/state.js:10–15`.
- Registry dispatch permits only versions 1/2: `src/career/registries.js:67–75`.
- Typed records require version 1 and XP zero: `src/career/assets.js:18–32`.
- Property capacities and facilities are fixed to Basic/descriptive-only: `src/career/assets.js:34–45`.
- Asset state must match the canonical starting package: `src/career/schema2.js:58–71`.
- Store/envelope protection contains schema-2-specific dispatch: `src/persistence/career-store.js:68–104`, `src/persistence/envelope.js:50–54`.

These are intentional M2-B boundaries, not evidence of an M2-B defect. Extend them through new versioned contracts rather than weakening old validation.

### Storage capacity qualification

The 8 MiB application import limit is not guaranteed browser storage capacity. An existing M2-B example envelope measured 37180 bytes formatted, or 23122 bytes compact; this does not predict the size of an implemented M2-C market/history or establish available quota.

Expanded-save quota acceptance remains unverified. Tests must retain manual fallback, exact rollback and mixed-version recovery. One active writer is needed without Web Locks; stale-byte checking is not a general cross-process compare-and-swap guarantee. Browser cooperation is implemented in `src/ui/career-saves.js:39–46`.

## 7. Proposed deterministic defaults

These are proposals for future authorization, not implemented rules:

- Grandfathered starter wage-quality modifier **1.0**, persisted without randomization. The handoff explicitly requests documenting a deterministic default if source provides none.
- Positive nearest-five and nearest-Gold ties: explicit **half-up**.
- Explicit decimal/rational calculations at economic rounding boundaries; never round native attributes merely to fit a pricing/training table.
- Persist original base ratings, permanent quality and acquisition basis separately from training/engineering ledgers so engineering cannot increase resale valuation.
- Use persisted career identity and generator version as market-generation inputs, isolated from race RNG and timestamps. Exact generation distributions remain subject to the clarifications above.

With wage quality 1.0, verified native driver means and the approved M2-C wage table imply:

| Package | Driver tier and Standard-term wage |
|---|---|
| Traditional | Standard, 35 G |
| Beastmaster | Standard, 35 G |
| Mechanist | Standard, 35 G |
| Veteran | Primary Premium, 60 G; reserve Standard, 35 G |
| Scrappy | Primary Standard, 35 G; reserve Budget, 20 G |

All would receive eight remaining cycles and zero recruitment/signing debit. No wages would accrue during M2-C. These are calculated planning outcomes under the proposed modifier, not existing contracts or executed migrations.

## 8. Implementation plan after clarification and separate authorization

| Stage | Scope | Test gate |
|---|---|---|
| 1 | Versioned native/health contracts, schema-3 records and command-v2 validation; retain schema-1/2 readers | Original 293 tests pass; strict version, field, identity and mapping tests |
| 2 | Deterministic market, arithmetic, acquisition, resale and immutable basis | Approved 23-offer distribution; deterministic fixtures; funds/capacity/duplicate-sale tests |
| 3 | Contracts, seven upgrades, services, training and engineering ledgers | Every supplied numerical fixture; no-effect rejection; discount/cap boundaries; no wage or XP accrual |
| 4 | Pure five-package migration previews and confirmed atomic migration | Both revisions, full source comparison, protected receipt, cancellation, rollback and old-checkpoint tests |
| 5 | Minimal management UI, full regressions, replay parity and standalone build | Node/browser gates, zero runtime requests, unchanged equivalent-native captures, separate Windows file-origin acceptance |

Migration/history integration is the highest-risk stage. Build pure components and fixtures before enabling any persistent schema-3 path. No racing-engine rewrite, dependency migration or new runtime service is indicated.

## 9. Acceptance-test inventory

### Gate A — M2-B preservation

- All five exact grant manifests, native ratings, IDs, Gold, capacities, assignments and descriptive facilities.
- Pure migration preview, cancel and repeated inspection without writes or RNG use.
- Both revision counters, canonical source comparison and migration/adapter/generator versions match at confirmation.
- Grandfathered contracts and acquisition basis without debit or invented acquisition transactions.
- No duplicate initialization or migration via alternate IDs, old checkpoints, import/recovery or absent verbose receipts.
- Schema-1/2 readers, original M1 receipts and existing M2-B v1 commands retained.

### Gate B — Economic correctness

- Approved 23-offer category/tier counts and reproducible IDs/native fields/prices across preview, reload and purchase.
- Correct reference prices, quality/condition bounds and every explicit rounding tie.
- Purchase consumption, capacity, staff quarters prerequisite, funds and contract checks.
- Exact contract fees/wages/termination; no wage accrual or expiry.
- Seven once-only facility purchases, total 3050 G; descriptive starter facilities confer no upgrades.
- Partial/fixed recovery price, discounts, no-effect rejection, health bounds and injury eligibility.
- Fractional native ratings, incremental cost-band crossings, cap 100 and max five increments.
- Engineering lifetime ten-increment ledger, no repair or resale uplift.
- Personnel not resalable; assigned assets require explicit release; installed equipment references remain valid.

### Gate C — Transaction integrity

- Exact retry before stale rejection, no write, original receipt when retained.
- ID/effect/payload/ownership conflicts and stale gameplay/maintenance tokens reject.
- Protected identity without active receipt returns null-receipt acknowledgment without effects.
- Failed purchase/service/training/migration/import preserves prior authoritative bytes, state, history and offer availability.
- Reload preserves all economic records and ledgers.
- 1000 receipt / 2000 protected identity / 8 MiB envelope boundaries without compaction or pruning.
- Quota/denial/manual fallback and mixed-version recovery.

### Gate D — Racing regression

- Exact native allowlists and separate management fatigue/injury/integrity semantics.
- Two distinct beasts, assignment exclusivity, eligibility diagnostics and preserved invalid assignments.
- Equivalent native inputs reproduce known M2-A/M2-B captures, Strategy Sign events and replay checksums.
- Existing Node suites, browser suites, standalone packaging and bundled/Node parity.
- Distinguish genuine file-origin testing from HTTP diagnostics; do not bypass administrator restrictions.

All current assets have zero XP, and M2-C excludes XP accrual. Training may be tested using valid funded fixtures, but ordinary starter careers have no natural XP source until a separately authorized later system exists.

## 10. Verification performed and limits

Executed during this preflight:

- Repository/remote/branch/HEAD/merge-tree inspection and source/document review.
- Runtime/development-tool version queries.
- Uploaded ZIP checksum verification.
- `npm test`: **293 passed, 0 failed, 0 skipped**.
- Existing standalone SHA-256 check.
- Read-only diagnostics on copied saved records and native fractional-rating validation.
- Final working-tree check: clean.

Test output was captured outside the repository at `/tmp/bnt-m2c-preflight-tests.log`. No new browser test, storage-quota test or standalone rebuild was performed during preflight. Existing owner-confirmed M2-B Windows acceptance is distinct from historical managed Chromium file-policy limitations and from any future M2-C acceptance.

## 11. Owner decisions / next gate

Before implementation, resolve:

1. Authoritative market tier totals versus category rows.
2. Versioned valuation-health H formulas and chariot repair/refurbishment relationships.
3. Schema-3 injury/eligibility representation and any legacy-label boundary handling.
4. Starting equipment basis/tier rules and installation handling during resale.
5. Balance-sensitive market-generation templates/distributions and specialist-role allocation.
6. Fractional-rating cost bands and remaining rounding tie policies.
7. Protected migration receipt and gameplay/maintenance revision semantics.

Then provide separate explicit M2-C implementation authorization. No M2-C code has been started. M2-D, M2-E and M3 remain outside this task.
