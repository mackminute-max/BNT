# M2-A — Persistence and Domain Foundation

**Status: M2-A implemented and its automated/managed-browser functional gate passed. Stopped for owner review. M2-B through M2-E are not implemented or authorized by this delivery.** Actual Windows `file://` verification remains outstanding because managed Chromium denies navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Full M2 completion and owner acceptance are not claimed.

## Authority and baseline

The owner's instruction, “Complete M2 A then stop for review,” authorizes this stage despite the supplied Review Draft 1's general NOT AUTHORIZED header. The supplied draft is preserved unchanged in [SUPPLIED_M2_REVIEW_DRAFT_1.md](SUPPLIED_M2_REVIEW_DRAFT_1.md). The referenced detailed specifications 3.59–3.62 were not supplied or found in the repository. No later-stage gameplay, balance or package rules were inferred from those missing documents; M2-A uses the draft's structural foundation requirements.

Baseline: clean source revision `ffb92fcc21966cc1853b2ff6adbdf81e7770e79c`, simulation `0.6.0-tracks`, package `0.6.0`, career schema 1, **237 passing tests**. The Architecture Audit/Readiness documents and actual M1 coordinator, envelopes, provenance, workbench, tests and build were inspected before modification.

The racing simulation, AI, physics, fatigue, signs, tracks, commentary, replay, configuration tools, dependency lockfile and build script are unchanged. Vanilla JS modules, HTML/CSS/Canvas and esbuild remain the architecture. No runtime dependency, framework, server, deployment, commit or push was added/performed. Existing historical audit/evaluation artifacts remain unchanged.

## Completed scope

| Requirement | Delivered behavior |
|---|---|
| Explicit schema 1 → 2 migration | Pure validated migration builder plus confirmed, revision-checked commit through the existing CareerStore. No migration-on-load write. |
| Identity/balance/lineage preservation | Owner/career IDs, names, treasury, gameplay revision, original transaction payloads/IDs, receipts, provenance and valid pending checkpoint retained. Source schema/revision/balance/identity/digests recorded. |
| No migration grants | Empty registries, `management.initialized: false`, Foundation status retained. No Gold, assets, facilities, achievements, generation or progression added. Clean migration stays unedited. |
| Initialization boundary | `career.initialize` is explicitly rejected in A; package initialization must be a separate approved M2-B transaction. Import cannot bypass this by setting initialized or populating assets. |
| Ownership/FK foundation | Typed registry scaffold, unique owned IDs, permitted target types, no dangling/cross-career refs, reciprocal equipment/property/employment links and exclusive-assignment reference checks. Positive/negative graph fixtures tested independently; live A careers remain empty. |
| Protected history | Original request canonical text plus fingerprint, identity, target IDs, independent effect ID and effect facts retained as P0. No pruning. Old M1 marks without receipts become protected identity tombstones without inventing a balance/result. |
| New command protocol | New schema-2 developer adjustments require `commandVersion: 1`, command/effect IDs, profile/career targets and expected gameplay + maintenance revisions. Exact migrated M1 requests remain replayable as legacy duplicate lookups. |
| Duplicate/conflicting effects | Same request returns prior receipt without a write. A protected identity whose verbose result is unavailable returns nonmutating `ALREADY_COMMITTED` with null receipt. Conflicting payload or alternate command ID reusing an effect is rejected. |
| Hybrid preparation | P0/P1/P2 retention definitions, readonly retention plan and protected-fact preservation assertion. `canCompact: false`; no history is summarized or removed. Execution belongs to M2-E. |
| Persistence safety | Original valid M1 checkpoint is retained as recovery on migration. Mixed schema 2 primary/schema 1 recovery supported. Invalid sources/candidate saves fail before writes. Existing denial/quota rollback, manual export/ack, confirmation and stale-byte checks retained. |
| Compatibility | All 25 original M1 persistence tests and all 237 baseline tests continue passing without deleting or weakening assertions. M1 compatibility paths remain available, not silently rewritten. |

## Files and interfaces

| Module | Responsibility |
|---|---|
| `src/career/legacy-state.js` | Verbatim copy of the baseline M1 `state.js` implementation. Preserves schema-1 behavior and historical validation/reducer rules. |
| `src/career/state.js` | Small schema-dispatch facade; existing `createCareer` remains the M1 compatibility factory. Exposes schema-aware validation/transaction/provenance plus explicit migration and uninitialized schema-2 factory. |
| `src/career/schema2.js` | `migrateStateV1`, `validateStateV2`, `transactV2`, `revisionToken`, `assertRevision`, combined history/provenance overlays and frozen receipt/history read views. |
| `src/career/registries.js` | Empty registry factory and strict reference graph validation. No asset statistics, acquisition, training, employment economics or management actions. |
| `src/career/history.js` | Protected canonical requests/effects, legacy tombstone conversion, merged identity registry, duplicate lookup, P0 preservation assertion and nonmutating retention plan. |
| `src/career/foundation-catalog.js` | Version-1 engineering file-size bounds: legacy 2 MiB, protected schema-2 8 MiB. No gameplay balance values. |
| `src/persistence/envelope.js` | Schema dispatch with sealed protected registry/maintenance clock for upgraded saves, mixed checkpoint validation and bounded import. |
| `src/persistence/career-store.js` | Explicit `migrateSchema`, versioned transaction coordination, protected import/recovery, monotonic maintenance clock, original manual fallback/atomic save behavior. |
| `src/ui/career-saves.js`, `src/ui/index.html` | Migration button/confirmation, schema/dual revision display, explicit legacy-import upgrade checkbox and readonly retention preview inside existing save panel. No M2-E management UI. |
| Tests/tooling | `tests/m2-a.test.js`: 28 new cases; `scripts/m2-a-browser.mjs`: 12 new browser groups. Existing persistence browser script gains only an evidence-directory environment override to avoid rewriting historical reports. |
| Build/docs | Both standalone HTML aliases rebuilt; schema/API notes, Windows checklist, evidence/manifest and current implementation/development/acceptance indexes updated. |

## Verification

Commands executed from `/workspace/BNT`:

| Command | Actual result |
|---|---|
| Baseline `npm test` | 237 passed, 0 failed |
| `node --test tests/persistence.test.js` during compatibility inspection | 25 passed, unchanged M1 assertions |
| `node --test tests/persistence.test.js tests/m2-a.test.js` | 53 passed: 25 retained M1 +28 M2-A |
| Final `npm test` | **265 passed, 0 failed, 0 skipped** |
| `npm run build` | Both embedded HTML artifacts built successfully; existing runtime dependency guard unchanged |
| `node scripts/m2-a-browser.mjs` | **12 functional groups passed**, zero page errors/runtime requests; exit 1 explicitly reports blocked direct-file launch |
| `BNT_PERSISTENCE_EVIDENCE_DIR=docs/m2-a/evidence/m1-browser node scripts/persistence-browser.mjs` | **18 retained M1 groups passed**; exit 1 for blocked direct-file launch, output isolated here |
| `npm run test:browser` | **23 retained racing/workbench groups passed**, exact bundled/Node parity; exit 1 for blocked direct-file launch |
| Source/checksum/diff checks | Original M1 implementation copy verified; racing/dependencies/build source unchanged; aliases identical; `git diff --check` clean |

Evidence: [evidence/](evidence/), especially `focused-tests.log`, `final-tests.log`, `browser.json`, `m1-browser/browser.json`, `racing-browser.json`, `manifest.json`, and representative original/migrated JSON saves. Browser: managed Chromium 156.0.8078.79, Node 24.22.1, npm 11.9.0. HTTP document navigation was used only after the actual file attempt was administrator-blocked; contexts were offline after each document load. Quota/getter-denial tests are labelled fault injection, not an actual full-disk measurement.

New regressions cover clean/edited migration, original pending data, rejected incompatible/damaged source, exact retained old seal, confirmation/ownership/dual revisions, rollback/manual retry, exact fresh-store round-trip, new command/effect protocol, stale maintenance token, imported/recovered-timeline idempotence, missing-receipt acknowledgement, legacy profile histories, corrupt protected registry/clock, immutable views/receipt binding, FK/ownership/reciprocal links/exclusive assignments, forbidden initialization/grants, inert foreign-version schema-2 data, large checkpoint preservation and unchanged independent race capture/RNG.

Two important edge cases received dedicated tests before the final gate: zero-command schema-2 saves must not downgrade during recovery, and a sealed maintenance clock must survive corrupt primary data. Another regression preserves protected M1 identities from previously replaced profiles, not merely the active profile. Large migrated files with damaged primary schema metadata still offer their valid backup rather than being misclassified as oversized legacy saves. No test was weakened to obtain these results.

## Standalone artifact

`dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html` are identical, **267562 bytes**, SHA-256:

`0f91c4f04616387933eb6485eb542bb6344713319a8a6980b7abaa9aba747a11`

No runtime Node, network, CDN, external imports or adjacent files are required by the architecture. Browser/headless races reproduce the unchanged default race checksum. That evidence does not substitute for the blocked Windows file-origin test; follow [WINDOWS_ACCEPTANCE.md](WINDOWS_ACCEPTANCE.md).

## Limits and deferred work

- This is **M2-A only**, not a playable stable. Initialization/package grants, candidate generation, owned asset payloads/acquisition, assembly, wages, recovery/training, management cycles, viability, liquidation, Legacy awards and full management UI remain B–E. Championship/race-result integration and M3/M4 systems are absent.
- The registry graph is an authoritative **foundation reference contract**, tested with synthetic graph records; it is not a full personnel/equipment/project data schema or lifecycle implementation. M2-B must extend typed payload validation against the detailed approved specifications before enabling initialization.
- Compaction is preparation only. Active verbose receipts are still required for financial reconciliation; no P1/P2 removal executor exists. The protected lookup already handles an earlier explicit recovery/import timeline without inventing missing results.
- Schema 1 still has its 2 MiB file bound. Schema 2 permits 8 MiB to retain original checkpoints plus protected facts instead of pruning them. Existing limits remain 1,000 active receipts and 2,000 known marks/protected command records. Limits reject without dropping P0; browser quota can be lower, invoking manual fallback. Long-career compaction/stress acceptance is M2-E, not claimed here.
- Unknown/invalid M1 sources, including a pending checkpoint incompatible with the original M1 validator, fail closed with prior bytes intact. Valid baseline M1 checkpoints migrate exactly. Already-schema-2 foreign-version pending records are retained as inert versioned data; execution compatibility is not asserted and no race-resume feature is added.
- The transport envelope remains version 1 and the discovery key remains `bnt.career.save.v1`; the migrated **career payload is schema 2**, with explicit additional sealed feature fields. Old HTML cannot open upgraded saves; export an M1 backup before migration. No silent downgrade is allowed.
- Checksums detect accidental corruption, not malicious offline edits. Full canonical request comparison protects ID conflicts independently of short fingerprint collisions. Local provenance cannot detect later history absent from a wholly older clean file opened in a fresh browser.
- Browser storage may be unavailable/path-specific/evicted. Web Locks protect cooperating windows when available; without them use one active writer. A download request or acknowledgement is not proof of durable saving. Whole-envelope/registry corruption can require an external backup.

**Review gate:** M2-A's required foundation is ready for owner review. No M2-B work will be started from this result. Detailed 3.59–3.62 documents and later-stage rules should be supplied/reviewed before any B–E implementation.
