# M2-B — Starting Stable, Native Assets and Prospective Racing Units

**Implemented for owner review. Not merged; no owner acceptance claimed. Stopped after M2-B. M2-C/D/E and M3 not started.**

## Authority and baseline

The [final owner authorization](FINAL_CODEX_AUTHORIZATION.md) approves the complete Draft 3 catalog and strict pristine initialization. It supersedes historical pending labels in reproduced documents. Existing preflight, supplied draft, native inspection and all older audit reports remain historical evidence, unchanged.

Verified M2-A source: `5e93b2c23ed74000b42d4658c1232cdc10d0f0fb`. Starting checkout: `87e8141b3a451f2c5c67c24a243f616d2f8a14a4`, branch `work`; its only committed difference from M2-A is the native attribute inspection document. Pre-existing untracked M2-B preflight/package/evidence files were retained. No material source deviation was found before coding. Owner-reported M2-A local testing is recorded separately from current automated evidence.

Dedicated implementation/review branch: **`feat/m2-b-stable-initialization`**. The final delivery supplies its commit SHA and GitHub branch link. No merge, deployment or application publication is performed. A dedicated branch satisfies the requested branch-or-PR review delivery.

Before production changes: `npm test` passed **265/265**, and the existing standalone was 267562 bytes, SHA-256 `0f91c4f04616387933eb6485eb542bb6344713319a8a6980b7abaa9aba747a11`.

## Completed scope

- Versioned typed owned drivers, beasts, chariots, neutral equipment, Basic property, descriptive facility and prospective RU assignments, within the existing 16 registries.
- All five exact approved packages; deterministic names/IDs, all initial condition 100, Healthy/Functional, zero fatigue/strain/wear/XP, native weight 180 and capacity 400. Management integrity remains separate from native chariot condition.
- Explicit confirmed `career.initialize`, one career-derived protected initialization identity, atomic treasury/asset grant, canonical result manifest and immutable package identity.
- Strict eligibility: valid schema 2, uninitialized empty management, zero treasury, no active-career transactions/edits/protected history and no pending checkpoint. Other-career edits to the Owner Profile do not disqualify a pristine active career.
- Persisted, versioned, revision-checked `ru.assemble` / `ru.disassemble`, exclusive owned subjects and reciprocal references. No competition entry, lock or championship is created.
- Pure native adapter, distinct beasts, condition/availability diagnostics and unchanged-engine baseline derived preview. Metadata is stripped; management fatigue is not mapped to driver strain; no runtime 1–10 conversion.
- Minimal starting-stable UI inside the existing developer save panel. Existing racing, tuning, configuration, import/export, migration, recovery and manual-checkpoint tools remain.
- Both self-contained HTML aliases rebuilt with no new dependencies or runtime requests.

### Exact grants

| Package ID | Package | Treasury grant | Drivers | Beasts | Chariots | Equipment | Facility |
|---|---|---:|---:|---:|---:|---|---|
| traditional | Traditional | 1,200 | 1 | 2 | 1 | Standard harness / Standard wheels | Basic Stable |
| beastmaster | Beastmaster Yard | 850 | 1 | 3 | 1 | Standard harness / Standard wheels | Animal Yard |
| mechanist | Mechanist Workshop | 800 | 1 | 2 | 1 | Reinforced harness / Precision wheels | Workshop Shed |
| veteran | Veteran Outfit | 650 | 2 | 2 | 1 | Standard harness / Standard wheels | Veteran Quarters |
| scrappy | Scrappy Underdog | 750 | 2 | 3 | 1 | Patched harness / Worn wheels | Makeshift Yard |

Every package gets one Basic property with capacities **2 drivers / 0 specialists / 4 beasts / 1 chariot**, and one initially assembled RU using the primary driver, Lead A/B and sole chariot. Reserves are unassigned. Purchase price is zero. Equipment effects are zero; facilities confer no bonuses. The exact attribute tables are in the authorization and `src/career/packages.js`; tests compare emitted native arrays and grant counts. Asymmetric initial balance is owner-approved, not a claim of mathematical parity.

## Modules and schema/API changes

| File | Responsibility |
|---|---|
| `src/career/assets.js` | Exact typed record payloads, native bounds, status labels, Basic capacities, reciprocal RU validation, freeze helper |
| `src/career/packages.js` | Frozen Draft 3 templates, deterministic grant construction and canonical manifest |
| `src/career/domain-commands.js` | Narrow command validation, strict pristine policy, domain effect identities, pure reducers and result facts |
| `src/career/assembly.js` | Pure native adapter/eligibility/derived preview; explicit assignment/link changes |
| `src/career/registries.js` | Typed registry-schema-2 validation and RU backreferences; old empty schema-1 registry path and synthetic graph tests retained |
| `src/career/history.js` | Recognizes normal domain commands and binds their deterministic result facts without developer provenance |
| `src/career/schema2.js` | Domain-aware ledger/receipt checks, canonical grant/assignment reconstruction, command dispatch, frozen complete read views |
| `src/persistence/envelope.js` | Keeps developer provenance checks for developer operations; legitimate domain history does not require fabricated edit marks |
| `src/ui/stable-foundation.js` | Package preview/init, owned roster and capacities, assembly selectors, eligibility and baseline preview |
| `src/ui/career-saves.js`, `src/ui/index.html` | Stage-specific panel integration; existing save/workbench controls retained |
| `tests/m2-b.test.js` | 28 new focused regression cases |
| `scripts/m2-b-browser.mjs`, `scripts/m2-b-parity.mjs` | Browser acceptance, M2-A full-capture/replay parity and evidence export |
| `scripts/m2-a-browser.mjs` | Output-directory environment override only, preserving historical evidence |
| `dist/*.html`, current status/docs | Rebuilt standalone aliases, report/API/checklist/evidence and implementation indexes |

Career schema remains 2, envelope 1, discovery key unchanged. Initialized management uses `registrySchema:2`, typed records `recordVersion:1`. Old empty management remains `registrySchema:1`. Existing receipts/history remain unchanged; new domain entries add a validated deterministic `result`. See [API details](SCHEMA_AND_TRANSACTION_API.md).

`legacy-state.js`, racing/AI/physics/model/track/environment/sign/commentary/replay/configuration source, build script and dependency files are unchanged. No framework migration occurred.

## Transaction and restoration behavior

Initialization effect is `initialize-${careerId}`, independent of attempt ID or chosen package. Exact retries return the previous result without a write; conflicting request IDs or alternate commands/packages sharing the retained effect reject. Canonical receipt/protected result lists every granted record ID, package/catalog and treasury grant. Gameplay revision advances once; maintenance does not. No developer mark, package debit, XP or hidden grant is created.

Assembly effects use career plus both expected revisions. A single authoritative revision-token slot cannot be spent twice. After explicit import/recovery advances maintenance, a genuinely new assembly is allowed while the old command remains protected; exact old requests are acknowledgments, not repeated effects. Later disassembly/reassembly uses new tokens. Gold, time and fatigue are unchanged.

Full aggregates validate before the unchanged CareerStore atomic publish. Quota/denial failures retain original authoritative state, bytes and protected history; manual retry requires an explicit exported-checkpoint acknowledgment. Invalid import leaves the loaded career intact. Mixed-schema recovery, original M1 receipts and monotonic maintenance remain covered by old and new tests.

Restoring a pre-initialization checkpoint intentionally restores no assets or Gold, but retains the consumed initialization effect. It cannot receive another grant. No hypothetical recovery reward, asset reconstruction or replacement transaction is invented. A valid post-initialization external backup is the continuation option; this is distinct from creating a genuinely different pristine career.

## Verification executed

| Command / check | Actual result |
|---|---|
| Baseline `npm test` | **265 passed**, 0 failed |
| `node --test tests/persistence.test.js tests/m2-a.test.js` | **53 passed**, unchanged compatibility assertions |
| `node --test tests/m2-b.test.js` | **28 passed**, 0 failed |
| Final `npm test` | **293 passed**, 0 failed, 0 skipped |
| `npm run build` | Both embedded HTML aliases generated; existing external-runtime guard passed |
| `node scripts/m2-b-browser.mjs` | **13 functional groups passed**, zero page errors/runtime requests; exit 1 explicitly reports blocked file navigation |
| `BNT_M2A_EVIDENCE_DIR=docs/m2-b/evidence/implementation/m2-a-browser node scripts/m2-a-browser.mjs` | **12 retained groups passed**, zero errors/requests; exit 1 for file-policy block |
| `BNT_PERSISTENCE_EVIDENCE_DIR=docs/m2-b/evidence/implementation/m1-browser node scripts/persistence-browser.mjs` | **18 retained groups passed**, zero errors/requests; exit 1 for file-policy block |
| `node scripts/browser-test.mjs` (same runner as `npm run test:browser`) | **23 racing/workbench groups passed**, exact bundled/Node parity, zero errors/runtime requests; exit 1 for file-policy block |
| `BNT_M2A_REFERENCE_DIR=/tmp/bnt-m2a-reference node scripts/m2-b-parity.mjs` | **12 complete captures equal to M2-A**, all races Ended; all replay checksums equal |
| Scope/diff checks | No engine/legacy/dependency/build-script diff against M2-A; source/test/script/current-report whitespace checks clean; standalone aliases identical |
| Replay compression | 12 gzip exports decompressed byte-for-byte equal to original JSON; hashes in `replay-files.json` |

Copied owner-supplied Markdown and raw failure logs retain their original trailing whitespace/Markdown line breaks; the unrestricted staged whitespace check reports these, while the implementation source/test/script/current-report check is clean. They were preserved rather than rewritten.

Earlier development test failures are preserved in evidence: a new replay test initially imported from the wrong module, then two test fixtures used an absent selection after disassembly and an unsupported tuning key. Those harness errors were corrected using actual existing APIs; assertions were not suppressed or weakened. The first complete new suite passed 25 cases, then three additional adversarial cases were added. Final results above supersede earlier run counts, without overwriting historical project audits.

### Draft 3 acceptance coverage

| Approved test | Evidence / result |
|---|---|
| 1. Five exact packages, once each | Five package tests, exact grant/result arrays; browser five-package loop — pass |
| 2. Distinct initial beasts and owned references | Five package tests plus graph negatives — pass |
| 3. Basic capacities | Exact capacity checks and overflow rejection — pass |
| 4. Healthy/Functional and zero state/XP | Every starter record checked in five package tests — pass |
| 5. No hidden starter content | Every out-of-scope registry asserted empty — pass |
| 6. Neutral equipment | Zero effects checked; nonneutral typed payloads rejected — pass |
| 7. Descriptive facilities | No effect fields accepted; descriptive-only enforced — pass |
| 8. Failed initialization unchanged | Negative commands, failed publish, reload after failure, browser init quota test — pass |
| 9. No second grant via retry/alias/import/recovery | Same request, alternate command/package, restored and mixed-schema checkpoints — pass |
| 10. Other-career Owner Profile exception | Pure-domain and actual-store tests — pass |
| 11. Active-career contamination | Edit, zeroed prior balance, pending, revision/catalog/ownership negatives — pass |
| 12. Compatibility and racing checksums | All original 265 tests, retained browser groups and 12 exact M2-A captures — pass |
| 13. Native adapter, no conversion | Native emitted values, unknown metadata stripped, unchanged `derive`, explicit preview label — pass |
| 14. Standalone/persistence | Build and HTTP functional save/export/import/recovery pass; **real file-origin / Windows gate outstanding** |
| 15. Later stages absent | Unsupported command rejection, empty registries and reviewed diff — pass |

The original 26-item matrix is covered by these tests plus ownership/foreign-key/reciprocal/exclusivity negatives, immutable snapshots, persisted reassembly/disassembly, M1 migration, P0 result binding, dual revisions, old-save recovery, manual mode and bundled parity. Item 25 remains explicitly pending Windows execution. Branch/commit publication is a review delivery only, not merge or acceptance.

### Deterministic references

Each is seed 145, one configured lap for closed courses; Rally retains its existing terminal rules. Both reference and autonomous driver modes were tested.

| Driver mode | Format | Oval | C01 circuit | Mixed rally |
|---|---|---|---|---|
| Reference | Pure | fe1bfab8 | 1e9d7e68 | d13a8fdf |
| Reference | Combat | 79dec048 | cd29b4b3 | 38fdb4e1 |
| Autonomous | Pure | 821eca67 | c1730efa | 4120f7c5 |
| Autonomous | Combat | c8fd3ca0 | 3ef47ff6 | fd015e71 |

Full captures matched the isolated M2-A export, not just the short checksums. Compressed replay records, JSON summaries and configuration/seed metadata are in [evidence/implementation](evidence/implementation/). Existing browser regression also reproduced Node events/commands/checksum exactly. These tests establish the tested cases, not universal correctness or package balance.

## Standalone artifact

Both `dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html` are identical:

- Size: **295768 bytes**.
- SHA-256: **`3f8c8e33acebe128c8b1f25e327c5feefdaf5900d120ff38d016db62a21bd83d`**.
- Vanilla JavaScript, HTML/CSS, Canvas 2D, existing esbuild; no runtime Node/server/assets/network dependency.

Managed Chromium **156.0.8078.79** rejected actual `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. No policy bypass was attempted. Functional tests used an HTTP diagnostic document load, then went offline after each load. Quota/denial checks are labelled fault injection, not physical full-disk measurements. These results do not verify Windows file-origin storage or disk durability. Follow [Windows acceptance](WINDOWS_ACCEPTANCE.md).

## Limitations and review recommendation

- Ready for owner code and local Windows review, **not final acceptance**. Real double-click/offline persistence of this exact new artifact is still unverified here.
- Prospectively assembling an RU does not enter it into the viewer, a race or championship. Race entry/result application are deliberately outside M2-B.
- No markets, purchases, wages, repairs, treatments, training, advancement spending, facility bonuses, upkeep cycles, Legacy progression, compaction or AI careers are added. Reserve flexibility is implemented, not an invented future progression bonus.
- Existing storage/file/history limits, storage eviction/path behavior and one-writer limitation without Web Locks remain. A download request or acknowledgment is not independent proof that bytes reached disk.
- Protected known history survives imports/recovery in this installation/save envelope. A wholly older file in a fresh browser cannot reveal a later event absent from all available history; checksums do not provide tamper-resistant authentication.
- Starter IDs are deterministic career-derived identifiers with aggregate collision/ownership validation, not a backend global identity service. No assets or Legacy are merged between careers.
- Base asset changes outside the authorized package and assembly reducers fail closed. Later lifecycle stages must explicitly extend those validators/reducers; no hypothetical lifecycle commands were preimplemented.
- Native numerical balance remains provisional under the approved catalog. No racing coefficient or formula was changed, and no parity of package competitiveness is claimed.

There is no unresolved implementation/design blocker for this M2-B scope. Owner approval is required before merge and before any later stage.

**Stopped after M2-B. M2-C/D/E and M3 not started.**
