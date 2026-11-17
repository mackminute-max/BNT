# M2-C — Economy and Stable Management Implementation Report

**Implemented for owner review. No merge, push, deployment or owner acceptance claimed.** M2-D, M2-E and M3 are not started. Windows direct-file acceptance of this new build remains outstanding; the managed-browser limitation is not waived.

## Authorization and baseline

The owner explicitly authorized: **“M2-C is authorized to be begin production.”** This follows the Revision 2.1 readiness confirmation and supersedes the historical non-implementation status of the supplied design/preflight documents for this stage only. [Revision 2.1](authority/00_START_HERE.md), especially [the first-gate addendum](authority/10_REVISION_2_1_ADDENDUM.md), is authoritative.

Starting branch/HEAD: `main`, **`105bce8a2a8f639b56c703cd75c56ce212471021`**, the verified owner-accepted M2-B merge. The existing tree matched accepted `bf36f5a` exactly. Two previously exported untracked preflight documents were preserved unchanged. Fresh baseline: **293 tests passed, zero failed**; the baseline HTML was **295768 bytes**, SHA-256 `3f8c8e33acebe128c8b1f25e327c5feefdaf5900d120ff38d016db62a21bd83d`.

Dedicated local review branch: **`feat/m2-c-economy`**. The delivery response supplies its final commit SHA; `git log -1` identifies the committed report/source revision. This delivery does not push or merge the branch.

All earlier M2-A/M2-B/audit evidence and preflight reports remain historical records. New evidence is isolated under `docs/m2-c/evidence/implementation/`.

## Completed functionality

- Explicit read-only migration preview and owner-confirmed schema-2 → schema-3 commit. No migration on load, import preview, export or navigation.
- Strict additive protected-maintenance variant under outer history schema 1, outside gameplay receipts. Migration advances maintenance once; gameplay revision and Gold stay unchanged.
- All five starter migrations preserve IDs, labels, native ratings, assignments, descriptive facilities, Gold and original receipts. Grandfathered contracts and immutable valuation/basis metadata are added without debit.
- Fixed deterministic **23-offer market: 9 Budget / 10 Standard / 4 Premium**, persisted once, no refresh or replenishment.
- Atomic purchase/recruitment, resale, personnel termination, explicit equipment detach, seven once-only upgrades, immediate care/treatment, XP-funded training and Gold-funded engineering.
- Capacity/ownership/exclusivity/reciprocal references, contracts and active role discounts, exact decimal economics and native increment ledgers.
- Minimal functional market/roster/contract/facility/action UI with pure quotes, per-increment costs, confirmations, actionable failures and unchanged save/developer tools.
- Explicit manual fallback and previous-checkpoint recovery/import protections, including consumed migration and market effects on restored timelines.
- Both standalone HTML aliases rebuilt with the existing esbuild guard; no runtime dependency, server or new framework.

## First protected-maintenance gate

Before adding the persistent `migrateEconomy` method, the focused gate passed **92 tests**: 81 retained M1/M2-A/M2-B compatibility cases plus 11 new maintenance/fingerprint cases. The earlier 89-test gate run was expanded to include actual pure schema-3 targets, source-fingerprint/version/revision mismatches, and atomic publication/recovery tests before enabling persistent migration.

The following source modules remain unchanged:

- `src/career/history.js`: strict original v0/v1 validators and entry construction.
- `src/career/legacy-state.js`: verbatim M1 factory, validator and ledger.
- `src/career/schema2.js`: M2-A/M2-B validation, grant reconstruction and v1 command semantics.

New `economy/protected-registry.js` dispatches exact maintenance, economic-v2 and legacy record variants. Legacy records still use the original validator; unknown or malformed shapes reject. No protected-history schema increment or weakening was needed.

Maintenance records contain their own typed acknowledgment and manifest digest. They never masquerade as gameplay command v2 and never enter `transactions`. Their identities count toward the total 2000 cap. Exact retry returns the retained acknowledgment; a valid protected tombstone returns `ALREADY_COMMITTED` with null acknowledgment and performs no effects.

Import/recovery overlays retain all variants globally while excluding incompatible future variants from historical schema-2 gameplay projections. Original entries/receipts remain byte-for-byte unchanged. A stable once-per-career migration effect, independent of request/source-fingerprint changes, blocks regeneration on abandoned timelines.

## Versions and source/API changes

| Component | Delivered version |
|---|---|
| Racing engine / package | Unchanged `0.6.0-tracks` / `0.6.0` |
| Career / initialized registry | 3 / 3 for economy; old career 1/2 remain supported |
| Changed records | 2 |
| Unchanged assignment / descriptive facility records | 1 |
| Economic command / legacy command | 2 / original v0/v1 |
| Migration maintenance request / record | 1 / 1, separate from gameplay |
| Protected outer history / transport envelope | 1 / 1 |
| Discovery key | `bnt.career.save.v1` |
| Economy / migration rules | `m2c-economy-v1` / `m2c-migration-v1` |
| Valuation / market generator | `valuation-health-v1` / `market-generator-v1` |
| Generator algorithm | `fnv1a32-utf8-mulberry32-rejection-v1` |

| Module/file | Responsibility |
|---|---|
| `economy/fingerprint.js` | Portable synchronous SHA-256, independently checked against Node crypto |
| `economy/maintenance-history.js` | Exact migration request/record/acknowledgment contracts |
| `economy/protected-registry.js` | Additive mixed registry, shared limits, retention and duplicate lookup |
| `economy/arithmetic.js`, `catalog.js` | Exact decimal rationals, rounding and approved economic constants |
| `economy/market.js` | Frozen algorithm, isolated seed/draw schedule, deterministic offers |
| `economy/records.js`, `validation.js` | Owned metadata, basis, contracts, typed graph/capacity checks |
| `economy/base.js` | Validated pure migration, complete-source fingerprint and five-package manifest |
| `economy/commands.js`, `reducers.js` | Strict command-v2 payloads, business identities, pure quotes and authoritative effects |
| `economy/schema3.js` | Origin-anchored ledger/effect reconstruction, state validation, provenance and typed v3 transaction path |
| `career/state.js` | Adds schema-3 dispatch while preserving legacy factories and old validators |
| `persistence/envelope.js`, `career-store.js` | Variant-aware persistence/import/recovery; explicit preview/confirmation; atomic publication reused |
| `ui/stable-economy.js` | Stage-specific management UI |
| Existing save/stable UI and `ui/app.js` | v3 integration, retained v1 assembly, pure diagnostics for browser parity |
| Tests / scripts / docs / dist | New acceptance suites, independent reference vectors, browser/parity evidence, reports and HTML aliases |

Racing/AI/physics/model/track/sign/environment/commentary/replay/configuration/developer simulation source, dependency files and build script are unchanged. The only retained M2-B browser-runner change is an output-directory override so historical evidence is not overwritten.

See [SCHEMA_AND_TRANSACTION_API.md](SCHEMA_AND_TRANSACTION_API.md) for exact command shapes, record schemas and restoration semantics.

## Authoritative mappings and economics

`valuation-health-v1` uses **driver/beast native condition** and **chariot management integrity**. Invalid/missing H rejects. Native condition/wear are not inferred from integrity; no averaging or fallback occurs.

- Repair changes integrity/status only; refurbishment changes native wear only.
- Driver recovery changes management fatigue only; native strain stays separate.
- Beast care changes the directly bridged native fatigue field.
- Treatment changes schema-3 management injury only. Schema-2 strings/eligibility stay unchanged; migration accepts Healthy only.
- Assignments remain recorded when a copied/current condition becomes ineligible; historical assembly is not silently dismantled.
- Starter mean 50 classifies **Standard**. Corrected beast fixture has basis **325 G**, current H=50 valuation 276.25 G and resale **138 G**.
- Starter equipment records retain their real IDs/labels and acquire Budget basis **100 G each**, without purchase/debit; detached resale is **40 G** each.
- Acquired assets use actual paid acquisition price; personnel are not resalable. Engineering/training does not increase immutable resale quality/basis.
- Contract recruitment fees and signing surcharge are distinct; wages/termination use approved terms. No wages accrue.
- Costs use explicit half-up, ceiling or floor exactly where specified; fractions are not rounded to select a cost band. Full increments exceeding 100 reject atomically.

### Five migration manifests

[evidence/implementation/five-package-migrations.json](evidence/implementation/five-package-migrations.json) contains full source snapshots, pure previews, requests, acknowledgments, targets and native-adapter comparisons for every package. Browser evidence separately records all five migrations.

| Package | Gold unchanged | Drivers / beasts / chariots / equipment | Grandfathered Standard-term wage(s) |
|---|---:|---|---|
| Traditional | 1200 | 1 / 2 / 1 / 2 | 35 |
| Beastmaster | 850 | 1 / 3 / 1 / 2 | 35 |
| Mechanist | 800 | 1 / 2 / 1 / 2 | 35 |
| Veteran | 650 | 2 / 2 / 1 / 2 | 60, 35 |
| Scrappy | 750 | 2 / 3 / 1 / 2 | 35, 20 |

All contracts have eight remaining cycles and wage quality exactly 1.00; no recruitment/signing charge. Basic capacities remain 2 drivers / 0 specialists / 4 beasts / 1 chariot until approved upgrades are purchased.

## Generator freeze and golden evidence

Seed bytes are UTF-8 `BNT|M2-C|market-generator-v1|<careerId>`, with standard FNV-1a-32 seed mapping, Mulberry32 unsigned stream and rejection sampling for unbiased inclusive integer draws. Draw order and ordinal rules are documented in the API report and source. No clock, race RNG or implicit refresh is used.

An independent Python unsigned-arithmetic/Decimal reference generated four checked-in golden fixtures: `career`, `A`, `career_42`, and a 64-character valid ID. Both Node and bundled browser matched the seed, first eight stream words and complete 23-offer manifests. Tests do not regenerate expected fixtures. Python is development-only; ordinary tests/build/play do not require it.

Generated tiers remain explicit market metadata; rating means do not reclassify them. Initial specialists are condition-neutral, have no fabricated native ratings, and use the exact approved role/tier allocation. Equipment remains neutral; no Premium equipment is generated.

## Command, receipt and rollback evidence

Economic commands preserve the approved envelope:

```js
{
  id, profileId, careerId,
  expectedRevision, expectedMaintenanceRevision,
  commandVersion: 2,
  type: 'market.acquire',
  effectId, delta, reason,
  payload: { offerId, term: 'standard' }
}
```

`quoteEconomy` determines effect identity, delta, cost, XP, affordability and details. The store recomputes rather than trusts client deltas. Receipts retain the exact request plus result revision, balance and deterministic `{type,cost,delta,details}`. New result schemas validate cost/debit/credit/target consistency even for retained entries without active receipts.

Once-only acquisition/sale/upgrade/detach/termination identities cannot be bypassed with another command ID. Repeated services/training bind their operation, target and revision tokens; engineering binds its consumed lifetime slot. M2-B v1 assignment effect semantics remain intact. Canonical retry precedes stale rejection; unknown stale requests reject.

Publication failure preserves prior bytes, economic state and protected facts. Manual retry requires explicit export acknowledgment; it does not assert disk durability. Invalid import, stale preview, cross-owner references, insufficient funds/XP, duplicate offers, invalid attributes and capacity overflow reject without side effects.

Older schema-3 restore keeps known fulfilled offers unavailable without replaying debit or fabricating assets. Older pre-migration restore keeps migration consumed and cannot regenerate market/contracts/basis. A valid post-migration backup is required to resume that economy; no hypothetical recovery award is created.

## Tests and exact executed commands

Runtime: Node 24.22.1, npm 11.9.0, managed Chromium 156.0.8078.79, existing esbuild 0.28.2/playwright-core 1.65.1. No dependency installation/configuration mutation was necessary.

| Command / gate | Actual result |
|---|---|
| Baseline `npm test` | **293 passed**, zero failed |
| First focused compatibility/maintenance gate | **89 passed**, then expanded **92 passed**, before persistent migration method |
| Numeric focused runs | **17 cases** in the final numeric suite; included in full run |
| Transaction/maintenance suites | **30 transaction cases +11 maintenance cases** in final full run |
| First full `npm test` | **350 passed**, zero failed |
| Final `npm test` | **351 passed**, zero failed, zero skipped; includes 58 new M2-C cases |
| `npm run build` | Both identical single-file aliases generated; existing external-runtime guard passed |
| `node scripts/m2-c/browser.mjs` | **20 functional groups passed**, no page errors/runtime requests; exit 1 reports file-policy block |
| `BNT_M2B_EVIDENCE_DIR=docs/m2-c/evidence/implementation/m2-b-browser node scripts/m2-b-browser.mjs` | **13 retained groups passed**; file-policy exit 1 |
| `BNT_M2A_EVIDENCE_DIR=docs/m2-c/evidence/implementation/m2-a-browser node scripts/m2-a-browser.mjs` | **12 retained groups passed**; file-policy exit 1 |
| `BNT_PERSISTENCE_EVIDENCE_DIR=docs/m2-c/evidence/implementation/m1-browser node scripts/persistence-browser.mjs` | **18 retained groups passed**; file-policy exit 1 |
| `node scripts/browser-test.mjs` (runner for `npm run test:browser`) | **23 retained racing/workbench groups passed**, exact bundled/Node parity; file-policy exit 1 |
| `BNT_M2B_REFERENCE_DIR=/tmp/bnt-m2b-reference node scripts/m2-c/verify.mjs` | **12 complete captures and replays exactly matched M2-B; five owned native adapters matched** |
| Scope and artifact review | Old engine/legacy validator/dependency/build-script diff empty; aliases identical; implementation-source whitespace check clean |

Browser total: **86 functional groups**. Their file-navigation exit status is disclosed, not suppressed. No failed automated assertion remains. The final full run took about 127 seconds while other verification processes also ran; this is observed test-environment timing, not a gameplay latency guarantee. The market-exhaustion fixture explicitly consumed all 23 offers through capacity-safe acquisitions and releases without replenishment.

Original tests were not deleted or weakened. The first 350-test run passed; a final additional regression hardened malformed retained economic-result handling after a verbose receipt is lost. The final 351-test suite passed. The restored-offer availability assertion was strengthened while developing the new M2-C tests so the UI cannot falsely label known fulfilled offers available.

### Four required gates

| Gate | Disposition |
|---|---|
| A — M2-B preservation | **PASS in executed automated/managed-functional checks:** five packages, source snapshots/receipts, pure migration, v1 coexistence and protected history |
| B — Economic correctness | **PASS in executed tests:** all supplied numerical fixture families, deterministic market, capacities/contracts/upgrades, services, training/engineering and resale |
| C — Transaction integrity | **PASS in executed tests:** retry/conflict/stale/fingerprint/rollback/import/recovery/limits and manual mode |
| D — Racing regression and standalone | **Racing, bundled parity and browser functionality PASS; direct Windows file-origin acceptance OUTSTANDING** |

No gate is waived. A build/HTTP functional pass is not final acceptance. Independent Windows file-origin verification of this exact artifact remains an owner review requirement.

Service/injury/funded-XP unit cases are explicitly synthetic reducer fixtures, not persisted gameplay injuries or XP grants. Ordinary starter careers and new hires have zero XP; M2-C does not award XP. No normal saved career is made invalid to obtain desired test outcomes. Existing developer treasury edits fund broad economic/browser tests and permanently mark those test careers edited.

## Deterministic racing evidence

All references use seed 145, existing one-lap closed-course configuration, unchanged Rally terminal rules. Full capture equality was checked against an isolated export of accepted M2-B, not only short checksums. Compressed replay files and SHA-256 hashes are recorded in `parity.json`.

| Driver mode | Format | Oval | C01 circuit | Mixed rally |
|---|---|---|---|---|
| Reference | Pure | fe1bfab8 | 1e9d7e68 | d13a8fdf |
| Reference | Combat | 79dec048 | cd29b4b3 | 38fdb4e1 |
| Autonomous | Pure | 821eca67 | c1730efa | 4120f7c5 |
| Autonomous | Combat | c8fd3ca0 | 3ef47ff6 | fd015e71 |

All twelve ended and replayed exactly. Native adapter output for every starter package is identical before/after migration; management metadata does not enter simulation inputs. Approved engineering/training can intentionally change future native ratings, but the simulator formulas are unchanged.

## Standalone deliverable

`dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html` are byte-identical:

- **380462 bytes**.
- SHA-256 **`13b2b1e3898c5df30f5b97b9b37c2bb033fc01c5ae9f43fd64bd89a3fc3e938f`**.
- Existing vanilla JavaScript/HTML/CSS/Canvas 2D and esbuild; no runtime Node, server, network, adjacent assets or new dependencies.

Managed Chromium rejected actual `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. No administrator bypass was attempted. Browser evidence uses an HTTP document origin and goes offline after each document load. Quota/getter-denial evidence is fault injection, not actual full-disk measurement. Browser downloads/acknowledgments do not prove durable disk storage.

Follow [WINDOWS_ACCEPTANCE.md](WINDOWS_ACCEPTANCE.md) for this new artifact. M2-B's prior owner acceptance does not accept M2-C.

## Known limitations and boundaries

- Direct-file Windows/offline/persistence acceptance remains outstanding; no final owner acceptance is asserted.
- No race entry/result application, championship, wage accrual/expiry, XP accrual, market refresh, management cycle, training project, Legacy progression, loan or bailout is implemented. M2-D/E and M3 remain unauthorized.
- Training is implemented but ordinary zero-XP starter careers cannot use it until a later authorized XP source exists. Treatment/recovery normally reject healthy zero-fatigue starters; synthetic tests verify their downstream rules without adding artificial injury gameplay.
- Full origin/history reconstruction favors integrity and auditability over constant-time mutations. Work grows with history; all existing limits are retained and reject without pruning. Large-career performance/storage acceptance and compaction are not claimed.
- Limits remain 1000 active gameplay receipts, 2000 total protected identities and 8 MiB complete import envelope. Browser quota/eviction/path limits can be lower; manual fallback remains necessary.
- A wholly older file in a fresh browser cannot reveal later history absent from all available sources. Client-owned checksums/fingerprints are not backend authentication.
- Pre-migration restoration with a consumed migration effect intentionally does not reconstruct the economy. Restore a valid post-migration backup; no invented replacement data or recovery reward.
- Property capacities and records support only the approved M2-C upgrades/roles. No unapproved effects, equipment slots, species restrictions or optional progression systems were added.
- Numerical catalog values are owner-approved provisional design, not proof of balance or universal correctness. Tests establish their executed cases only.

**Stopped after M2-C implementation for owner review. No push, merge or later-stage implementation performed.**
