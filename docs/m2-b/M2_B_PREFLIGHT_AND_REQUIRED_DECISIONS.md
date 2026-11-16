# M2-B preflight — required design inputs

**Status: authorized M2-B inspected; blocked before balance-sensitive implementation.** No M2-B gameplay, grants, asset schemas, transaction changes or UI were committed to the application. This is not an M2-B completion report.

## Authorization and accepted baseline

The owner explicitly authorized M2-B and reports that **M2-A passed local testing**. This supersedes the supplied package's proposed-authorization header and M2-A's previous “stop before B” gate. It does not supersede the new package's own requirements not to invent grants or the numerical choices it explicitly reserves for owner approval.

Source: branch `work`, commit **`5e93b2c23ed74000b42d4658c1232cdc10d0f0fb`**, clean working tree at entry. Current engine/package `0.6.0-tracks` / `0.6.0`; career payload schemas 1/2, envelope schema 1. The original M2-A report, schema/API contract, actual career/history/registry/store modules, engine attribute model, UI and package scripts were inspected. There is no reported local M2-A defect to resolve first.

Owner-reported local M2-A success is recorded as such, not as independent managed-browser verification or a test of a new M2-B artifact. No new build was produced in this preflight.

## Blocking package requirements

The supplied [M2-B implementation package](SUPPLIED_M2_B_IMPLEMENTATION_PACKAGE.md), §B3, says:

> “Before implementing concrete grants, locate the authoritative approved package table in the repository or request owner approval of an explicit versioned package catalog.”

Section 7 explicitly requires a stop before balance-sensitive content when:

> “Exact starting package grants and initial treasury are not in approved source material.”

It also requires a decision where:

> “Migrated schema-1 career initialization would require overwriting/adding nonzero resources.”

Repository searches found the five names and orientations, the Traditional free-baseline statement, provisional capacity references and prior warnings that grant values are missing. No authoritative exact starter table or detailed 3.59–3.62 specifications were found. `src/career/foundation-catalog.js` contains only engineering file-size bounds; `src/track/catalog.js` contains tracks, not starting-stable packages. Race fixture/defaultRU numeric values and the empty Foundation's 0 Gold are **not** approved package grants.

Evidence: `evidence/catalog-search.txt`, `evidence/package-source-search.txt`, plus the actual source/file inventory examined. A five-package playable initialization cannot be delivered coherently without selecting the very Gold, asset and property values this package prohibits inventing. Optional typed scaffolding is permitted by the package but would not resolve that blocker; this preflight leaves production code untouched rather than introduce a half-integrated new aggregate contract.

## Required catalog decision

Please provide the approved source/table, or approve a concrete versioned catalog containing these fields. No values below are implemented or silently defaulted.

| Package | What is established | Required exact content |
|---|---|---|
| Traditional | Baseline/free orientation | Starting Gold; owned driver/two beasts/chariot templates and stats; equipment/loadout; property/facilities/capacities |
| Beastmaster Yard | Beast-focused orientation | Starting Gold and any cost; exact asset/stat/loadout/property/capacity differences |
| Mechanist Workshop | Engineering/chariot orientation | Starting Gold and any cost; exact asset/stat/loadout/property/capacity differences |
| Veteran Outfit | Experienced-driver orientation | Starting Gold and any cost; exact asset/stat/loadout/property/capacity differences |
| Scrappy Underdog | Constrained/resourceful orientation | Starting Gold and any cost; exact asset/stat/loadout/property/capacity differences |

The table should identify any optional extra personnel/assets, starter equipment effects/slots, species/type labels and package availability/cost funding rules. State whether all five are available in this stage or require an existing approved unlock policy. If fixed starter templates are approved, construction can be deterministic from career/package/asset-role IDs with no candidate reroll. No random starter variation will be added without specification.

The package's **provisional Basic capacities** (2 racing personnel, 0 specialists, 4 beasts, 1 chariot) are a candidate reference requiring confirmation—not an authorization to grant higher-tier properties or assume all five packages share them. No paid specialist is mandatory. The approved RU minimum is one driver, two distinct beasts and one chariot, so each package must make at least one eligible assembly possible without exceptions.

If a first-entry affordability assertion is still required from the earlier M2 brief, provide the future championship entry/run-budget requirement used by that assertion; no championship economy value or integration will be invented for M2-B.

## Required migrated-career initialization decision

The existing valid M2-A aggregate can have developer treasury transactions/provenance, nonzero Gold or an inert pending checkpoint. It is not safe to overwrite those values or silently layer a starting grant over them.

**Proposed conservative policy for approval (not implemented):** initialize only pristine uninitialized schema-2 careers: zero treasury, no prior transactions or initialization effect, no active-career edits/provenance, no pending checkpoint and empty registries. Reject all other cases with explicit diagnostics and preserve their full state. Decide explicitly whether an Owner Profile marked developer-edited due to a different career is eligible. No reset, transfer, conversion reward or invented recovery transaction would occur.

If those migrated diagnostic careers must be supported, specify their exact carry/replace/eligibility treatment. The independent one-per-career initialization effect must remain protected across import/recovery regardless of the chosen policy. Restoring an older uninitialized snapshot must never grant a second starting stable; a protected initialization fact cannot be deleted to make that snapshot usable again.

## Grounded interfaces and remaining mapping choice

Existing approved race attributes can be reused without changing formulas:

- Driver: Driving, Beast Handling, Combat, Awareness, Nerve; engine uses condition and **strain**.
- Beasts: Speed, Power, Agility, Endurance, Discipline, Toughness; individual condition/fatigue.
- Chariot: stability/durability/protection/rolling efficiency/maneuverability plus weight/capacity, condition and wear.
- Prototype equipment effects: aggregate mass/combat only.

The package's management driver **fatigue** is not automatically the engine's driver strain. Injury severity labels also are not a formula mapping arbitrary condition numbers to permanent injuries. A derived preview must use an approved mapping; otherwise the package explicitly allows raw-stat/eligibility previews labelled not yet integrated. Equipment slot/species compatibility must be specified or kept neutral; no invented restrictions or magical bonuses.

## Verified integration work once inputs are resolved

No unavoidable envelope or career-schema-version change was identified during inspection. The package-authorized typed extension can remain in schema-2 while retaining old uninitialized saves. Implementation will need:

1. Versioned typed asset/property/package validators and the approved catalog. Preserve base ownership/global-ID/reciprocal references.
2. A separate `career.initialize` reducer with a career-derived business effect ID, atomic grant facts/receipts and strict pristine/migrated policy. Do not reuse `developer.treasury.adjust` for normal initialization or mark every legitimate starter career developer-edited.
3. Intentional extension of command/history/financial validation. Current schema-2 validation assumes every command is a developer treasury edit, every protected record has developer provenance, and management stays empty. Those are expected M2-A gates, not M2-A defects; new normal commands must extend them without changing old receipts or `legacy-state.js`.
4. Pure RU assembly/eligibility/preview selectors and idempotent assignment commands; no race or championship entry.
5. Minimal package/roster/assembly UI and full persistence/recovery/fault/browser regressions, standalone rebuild and authorized dedicated branch/PR or established push workflow on completed delivery.

These are planned changes only. No prices/stats were selected and no partial production scaffolding was added in this preflight.

## Tests and working-tree effects

- **Fresh `npm test`: 265 passed, 0 failed, 0 skipped.** Log: `evidence/baseline-tests.log`.
- Existing canonical artifact unchanged: **267562 bytes**, SHA-256 `0f91c4f04616387933eb6485eb542bb6344713319a8a6980b7abaa9aba747a11`.
- No new browser/build tests were needed for unchanged source; none are claimed for M2-B. Earlier managed file-policy limitations remain historical, and owner-reported M2-A local success is recorded separately.
- Only this preflight documentation, supplied-package copy and search/test evidence were added under `docs/m2-b/`. No production source, existing tests, dependencies, artifacts or historical reports were modified. No new commit, branch, PR, push or merge was made.

**Next action:** obtain the approved package catalog and migrated-career policy, then resume the already authorized M2-B implementation. No routine engineering reapproval is needed after those inputs are settled. M2-C/D/E and M3 remain excluded. M2-B is not complete, and no acceptance is claimed.
