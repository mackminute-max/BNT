# Blood and Thunder — M2-C Revision 2 Read-Only Preflight Report

Date: 2026-11-17

**Status: Second preflight complete. M2-C implementation remains unauthorized and has not begun.**

This document exports the findings already presented to the owner. The inspection did not change files, migrate saves, commit or create a PR. Creating this report is a separately requested documentation-only action. The earlier `M2_C_PREFLIGHT_REPORT.md` remains unchanged. No production source, tests, dependencies, save schemas or build artifacts are modified.

## 1. Executive assessment

Revision 2 resolves the earlier design questions and is largely compatible with the source. Two items remain: protected maintenance history needs an isolated additive extension, and one numerical fixture contradicts the starter-tier rule.

The native/management mappings can be implemented in new versioned paths without changing M2-B or racing formulas. This is a compatibility assessment, not evidence that M2-C features or acceptance tests have been implemented.

## 2. Baseline and provenance

| Item | Verified result |
|---|---|
| Repository | https://github.com/mackminute-max/BNT |
| Branch / remote branch | `main` |
| HEAD | `105bce8a2a8f639b56c703cd75c56ce212471021` |
| Accepted M2-B implementation | `bf36f5a8ad139eda4bb444c1ec56fa814574df88`; merged file tree matches exactly |
| Working tree at inspection | Tracked files clean; previously exported untracked `docs/m2-c/M2_C_PREFLIGHT_REPORT.md` untouched |
| Fresh `npm test` | **293 passed, 0 failed, 0 skipped** |
| Node / npm | 24.22.1 / 11.9.0 |
| esbuild / playwright-core | 0.28.2 / 1.65.1 |
| Chromium | 156.0.8078.79 |
| Revision 2 ZIP integrity | All **10** manifest entries matched |
| Prior report comparison | Revision 2's supplied excerpt matches the earlier exported preflight after normalizing line endings |

The Revision 2 ZIP was read in `00_START_HERE.md` order: decision register, master specification, schema/adapters, deterministic fixtures, acceptance matrix, preflight/recheck instructions, traceability and prior-report excerpt.

Existing standalone SHA-256 remained:

```text
3f8c8e33acebe128c8b1f25e327c5feefdaf5900d120ff38d016db62a21bd83d
```

Source paths and line numbers below refer to the inspected HEAD. They are repository-relative for portability of this export.

## 3. R2-01 through R2-08 matrix

`SOURCE_COMPATIBLE` means the design can be added through versioned paths without changing existing M2-B behavior. It does not mean M2-C is implemented or tested. `SOURCE_CONFLICT` identifies an incompatibility with current helper assumptions, not necessarily an impossible design.

| Decision | Status | Source evidence and assessment |
|---|---|---|
| **R2-01 — Market counts** | **SOURCE_COMPATIBLE** | Equipment changes to **3/3/0**, yielding **9 Budget / 10 Standard / 4 Premium**, 23 total. No existing market implementation conflicts with this. Registry scaffolding exists in `src/career/registries.js:5–14`. |
| **R2-02 — Health and services** | **SOURCE_COMPATIBLE** | Driver/beast `condition`, chariot `integrity`, separate fatigue/strain/wear already exist. Economic projections require no racing-formula changes. See `src/career/assets.js:11–30`, `src/career/assembly.js:25–27`. The fixture inconsistency in section 6 remains. |
| **R2-03 — Injuries** | **SOURCE_COMPATIBLE** | Preserve schema-2 labels/eligibility; add schema-3 validation and preview separately. Healthy-only migration avoids unsupported conversions. See `src/career/assets.js:4`, `src/career/assembly.js:19`. |
| **R2-04 — Equipment** | **SOURCE_COMPATIBLE** | Two actual records exist per package. Reciprocal references support explicit two-sided detach. Copied-record probes passed for all five packages. See `src/career/packages.js:26–27`, `src/career/registries.js:42–48`. |
| **R2-05 — Generation** | **DESIGN_SPECIFIED** | Counts, fields, ranges, roles, seed text and ordering are specified. Native boundaries fit existing validation. PRNG, byte-to-seed algorithm and complete draw order still need to be fixed as implementation details with golden vectors. `src/core/determinism.js:2–15` is not an implemented isolated market stream. |
| **R2-06 — Fractions/rounding** | **SOURCE_COMPATIBLE** | Native ratings permit fractions. Continuous cost bands and full rejection above 100 fit that contract. Exact decimal economic arithmetic must be added separately. See `src/model/ru.js:47–83`. |
| **R2-07 — Maintenance history** | **SOURCE_CONFLICT** | Current protected records are strictly gameplay-shaped and reject the new variant. An additive typed dispatcher is feasible in principle, but existing helpers cannot be reused unchanged. See `src/career/history.js:17–32`; details in section 5. |
| **R2-08 — Wages/preservation** | **SOURCE_COMPATIBLE** | Starter ratings support wages **35; 35; 35; 60+35; 35+20 G**. Metadata can be added during schema-3 migration without changing original grants or receipts. See `src/career/packages.js:7–12`, `:24`. |

### Corrected market distribution

| Category | Budget | Standard | Premium | Total |
|---|---:|---:|---:|---:|
| Driver | 2 | 2 | 1 | 5 |
| Beast | 2 | 3 | 1 | 6 |
| Chariot | 1 | 1 | 1 | 3 |
| Specialist | 1 | 1 | 1 | 3 |
| Equipment | 3 | 3 | 0 | 6 |
| **Total** | **9** | **10** | **4** | **23** |

The older equipment `3/2/1` wording retained in document `03` is explicitly superseded by Revision 2 precedence. It is not a remaining distribution decision.

## 4. Native/management mappings and services

The following are now explicit **design-selected economic/service contracts**, rather than inferred racing formulas. They are not yet implemented adapters.

| Operation | Approved field/effect | Source compatibility |
|---|---|---|
| Driver valuation | `H = native condition` | Existing 0–100 field; strain and management fatigue excluded |
| Beast valuation | `H = native condition` | Existing 0–100 field; fatigue excluded |
| Chariot valuation | `H = management integrity` | Separate from native condition/wear |
| Chariot repair | Increase management integrity only, maximum 100 | Update corresponding management status; leave native condition/wear unchanged |
| Chariot refurbishment | Reduce native wear only, minimum 0 | Existing native adapter passes wear through |
| Driver recovery | Reduce management fatigue only | Native strain remains unchanged |
| Beast care | Reduce beast fatigue | Existing adapter maps this field directly |
| Injury treatment | Reduce schema-3 management severity | No native-condition conversion; preserve assignments |

Version selected by the design: **`valuation-health-v1`**. Inputs must be finite and within [0,100]; missing/invalid values reject rather than being clamped or averaged.

The economic condition projection is:

```text
C(H) = 0.70 + 0.30 × H/100
```

Driver/beast/chariot offer pricing uses the selected H contract. Initial specialist and equipment offers are condition-neutral. Chariot H is integrity even when native condition differs.

The unchanged racing calculations remain:

```text
beast effective rating = rating × condition/100 × (1 − impairment × fatigue/100)
driver effective factor = condition/100 × (1 − impairment × strain/100)
chariot effective factor = condition/100 × (1 − impairment × wear/100)
```

Sources: `src/model/ru.js:120–127`, `:156–159`; native adapter: `src/career/assembly.js:25–27`.

Native chariot payloads must continue excluding `integrity`. Repairing integrity is not a native performance repair; refurbishment changes wear but does not restore integrity or condition. Treatment does not silently restore native condition, and driver recovery does not reduce strain.

### Versioned injury behavior

- Schema 2 retains Healthy / Minor / Moderate / Severe / Dead and its existing eligibility.
- Schema 3 uses Healthy=0 / Minor=1 / Major=2 / Critical=3.
- Migration accepts verified Healthy only. Unsupported legacy values return `UNSUPPORTED_LEGACY_INJURY`, preserving source.
- Schema-3 Major/Critical are ineligible; Minor remains subject to native checks.
- Existing assignments remain present when currently ineligible; preview reports the reason.
- Do not coerce Dead into Critical or revalidate historical assignment eligibility against newly changed current condition.

Current preview explicitly accepts schema 2 only (`src/career/assembly.js:8`), and the UI readiness check does likewise (`src/ui/stable-foundation.js:14`). Schema-3 preview/UI dispatch must be added without changing schema-2 behavior.

### Existing aggregate guards

Service effects, acquired assets, detached equipment and economic metadata cannot simply be inserted into existing schema-2 careers. `src/career/schema2.js:63–71` requires canonical starter asset data and reconstructs assignment state from M2-B commands. `src/career/assets.js:18–37` requires record version 1, zero XP, fixed Basic capacities and descriptive facilities.

These are intentional M2-B boundaries. New schema-3 validators/reducers must accept authorized changes while retaining the old guards for old versions.

## 5. Protected-history and command coexistence gate

Current source assumptions:

1. `protectTransaction()` sets `resultRevision = expectedRevision + 1` (`src/career/history.js:17–22`).
2. `validateProtected()` accepts only command versions 0/1 and an exact gameplay-record shape (`:24–32`).
3. The ledger requires `revision === transactions.length` (`src/career/legacy-state.js:60–68`).
4. Envelope validation treats non-domain protected requests as developer-provenance-bearing operations (`src/persistence/envelope.js:38–40`).
5. Versioned protected-command construction currently labels any versioned transaction as version 1 (`src/career/history.js:18`).

Read-only probes confirmed these current rejections:

| Probe on copied existing protected entry | Result |
|---|---|
| Add maintenance discriminator | `Invalid protected history identity fields` |
| Keep gameplay result revision unchanged | `Invalid protected result revision` |
| Mark command version 2 | `Invalid protected request` |

No maintenance record or migration was committed by these probes.

### Minimal compatible alternative

- Add a strictly discriminated maintenance-record validator beside the unchanged legacy validator.
- Preserve all old record bytes and strict rejection of malformed legacy records; do not reinterpret a maintenance action as a gameplay command.
- Keep migration acknowledgments outside `transactions`.
- Increment maintenance exactly once; leave gameplay revision/receipt count unchanged.
- Count maintenance identities toward the shared 2000 limit and retain ownership, request-conflict and effect-reuse protection.
- Add command-v2 dispatch separately; preserve old command-v1 serialization and assignment effect semantics.
- Make import/recovery overlays variant-aware. Preserve maintenance facts in the global protected registry without forcing them into a schema-2 gameplay-history projection.
- Preserve a once-per-career migration business effect so a changed source fingerprint after recovery cannot regenerate the economy.
- Resolve exact migration retries from the retained maintenance acknowledgment; return `ALREADY_COMMITTED` with null receipt where the acknowledgment is absent, without replaying effects.

Overlay handling is essential: `withKnownHistoryV2()` currently merges retained entries directly into schema-2 history and revalidates (`src/career/schema2.js:93–101`). Existing `lookupCommitted()` searches gameplay receipts (`src/career/history.js:70–74`), so maintenance acknowledgments need a typed path rather than being appended to that ledger.

This is a **current-helper incompatibility**, not proof that outer protected-history schema 1 is fundamentally incapable of an additive variant. No schema increment is justified yet. Future implementation must prove mixed-history validation and restore behavior. If that cannot preserve the old contracts, stop and request the separately required schema-change approval.

## 6. Remaining fixture inconsistency

`07_DETERMINISTIC_GENERATION_AND_NUMERIC_FIXTURES.md`, section B, line 24 specifies:

> Starter beast Budget reference 150, mean=50 …

The starter classification rule in the master specification makes mean 50 **Standard**, not Budget. R2-05's explicit generated-market tiers do not override the separate starter classification rule.

Minimal alternatives requiring clarification:

1. Label it explicitly as an **arithmetic-only synthetic fixture**, excluded from starter-tier validation; or
2. Use a valid Standard starter example: mean 50, reference 325, original H 100 gives basis **325 G**; current H 50 gives current reference 276.25 and resale **138 G**.

Do not change the tier rule or silently alter expected fixture results. The stated Budget arithmetic is not wrong in isolation; its claimed starter classification is inconsistent. It cannot be a valid starter-migration acceptance fixture as written.

## 7. Equipment and detach feasibility

`src/career/packages.js:26–27` creates **two actual owned equipment records per package**, with stable IDs and reciprocal `chariot.references.equipment` / `equipment.references.installedOn` links. They retain `mass:0`, `combat:0`; their labels imply no native effects.

R2-04 now specifies Budget valuation metadata, immutable starting basis **100 G per item**, and detached resale **40 G per item**, without debit or fabricated purchase. Existing IDs/labels must migrate in place.

Read-only probes on copied package templates for all five packages found:

- Clearing both installation references passed existing graph and typed-management validation.
- Clearing only one side was rejected with `Nonreciprocal ownership/assignment reference`.
- Two equipment records remained owned in each copy.

Reference validation: `src/career/registries.js:42–48`. These were structural probes, not executed detach transactions or accepted modified schema-2 careers.

Future `equipment.detach` must be explicit, versioned, idempotent and atomically clear both ends. Installed-item sale rejects until detach. Chariot sale requires RU unassignment and all equipment detached first. Detached equipment remains owned. No bundling, orphaning, new slots or bonuses are needed.

## 8. Native factory and deterministic generation feasibility

### Native field compatibility

Twelve copied-input boundary combinations passed existing `validateRU()` across Budget/Standard/Premium rating endpoints and native condition endpoints 70/100.

The proposed factory values fit existing contracts:

- Five driver, six beast and five chariot native rating names and ranges.
- Driver condition/strain, beast condition/fatigue, chariot condition/wear.
- Weight 180 and capacity 400 within validated bounds.
- Generic draft beast species as management metadata.
- Neutral native equipment aggregate.

Sources: `src/model/ru.js:2–44`, `:47–112`; `src/career/assets.js:11–30`.

Persistent factories must still supply owned identity/reference/version fields, use distinct offer and owned-record IDs, check reserved IDs/collisions, and keep specialist/economic metadata out of native components. A failed offer invalidates the whole market generation as specified. No actual market factory or generated market was implemented in preflight.

### Generator and golden-vector plan

Fixed design inputs include:

```text
Generator version: market-generator-v1
UTF-8 seed material: BNT|M2-C|market-generator-v1|<careerId>
Category order: driver, beast, chariot, specialist, equipment
Tier order: Budget, Standard, Premium
```

Counts, integer rating bands, specialist roles, quality/wage-quality bounds, conditions and neutral categories are now specified. The PRNG, seed-byte-to-integer mapping and complete field draw schedule remain implementation details to freeze before acceptance.

A feasible candidate is UTF-8 FNV-1a-32 seeding plus a documented unsigned PRNG. This is a proposal, not an implemented or accepted algorithm. Do not equate the existing `src/core/determinism.js:2–15` keyed random helper with the new isolated stream.

Freeze and test:

- Exact seed bytes and unsigned arithmetic semantics.
- Unbiased inclusive integer sampling.
- Field draw order, including independent chariot condition and integrity draws.
- Ordinal convention and rejection/retry consumption order.
- Seed state, raw draws and full canonical 23-offer manifests for several valid career IDs.
- Independent expected golden values plus Node/bundled-browser equality; no automatic rebaselining to hide differences.
- Reload/preview repeatability, consumed-offer immutability and no racing RNG consumption.

No golden-vector execution or algorithm implementation is claimed here.

## 9. Numerical and preservation test plan

After separate implementation authorization, acceptance must cover:

- R2-02 H bounds and rejection of missing/invalid values; no averaging or malformed-input clamping.
- Chariot integrity-only repair; wear-only refurbishment; no native condition changes.
- Driver fatigue-only recovery; beast native fatigue care; injury-only treatment.
- Starter/acquired basis and resale, with immutable base ratings/quality; no engineering/training uplift.
- Positive decimal half-up Gold rounding, proportional repair ceiling before discounts, XP ceiling and resale flooring.
- Fractional ratings 59.5, 74.5, 89.5 and 99.5; incremental bands, no partial over-cap application, max five increments and lifetime engineering cap ten.
- Two-record equipment migration and explicit detach/sale rejection paths.
- Schema-2 injury behavior unchanged; schema-3 injury behavior correct; unsupported legacy injury rejected without mutation.
- All five migration manifests and wages **35; 35; 35; 60+35; 35+20 G**, with Standard terms/eight remaining cycles and zero signing/recruitment debit.
- Pure preview and stale canonical source/revision/version rejection.
- Migration maintenance +1 exactly once, gameplay revision/receipt count unchanged.
- Mixed protected histories, old receipt bytes, exact retries, null acknowledgment, alternate IDs/effects, old checkpoints and retained consumed initialization.
- Atomic failure/rollback, quota/manual fallback, invalid imports and receipt/history/file limits without pruning.

## 10. Limits and browser/replay feasibility

Retain:

| Limit / invariant | Current contract |
|---|---|
| Active gameplay receipts | 1000 |
| Total protected identities | 2000; future maintenance variants must count |
| Imported envelope | 8 MiB |
| New gameplay command checks | Both gameplay and maintenance revisions |
| Publication | Fully validated candidate, single storage write, rollback/manual fallback |

Sources: `src/career/legacy-state.js:6`, `src/career/history.js:4`, `src/career/foundation-catalog.js:2`, `src/persistence/career-store.js:30–43`.

The 8 MiB bound is not a guarantee of available browser quota. M2-C expanded-save quota testing remains future acceptance work.

Existing tooling supports full-capture parity across reference/autonomous, Pure/Combat, Oval/Circuit/Rally (`scripts/m2-b-parity.mjs:14–18`). Browser tooling attempts direct file navigation and distinguishes policy-blocked HTTP fallback (`scripts/m2-b-browser.mjs:18–21`). New acceptance runs must use separate evidence outputs rather than overwrite historical reports.

No fresh browser, quota, standalone-build or M2-C replay test was run in this read-only preflight. Existing owner-confirmed M2-B Windows acceptance does not accept a future M2-C build. Historical managed browser file-policy limitations must remain distinct from actual local file-origin evidence.

## 11. Verification performed and disposition

Performed during the second preflight:

- Revision 2 package reading in prescribed order and all ten ZIP checksum checks.
- Comparison with actual source and the prior preflight.
- Local/remote branch and HEAD verification; accepted-tree comparison.
- Fresh `npm test`: **293 passed, 0 failed, 0 skipped**.
- Read-only copied-record probes: five package detach/reference checks, twelve native boundary cases and current history rejection checks.
- Existing artifact checksum and final working-tree inspection.

Test log was captured outside the repository at `/tmp/bnt-m2c-r2-tests.log`. Probe results are not additional automated-suite cases and do not establish M2-C acceptance.

**Disposition:** Revision 2 supplies compatible native/management design selections. Resolve the fixture interpretation, then prove the additive protected-history approach during an authorized implementation. No M2-C implementation has begun. Separate explicit owner authorization remains required; M2-D/E and M3 are outside this task.
