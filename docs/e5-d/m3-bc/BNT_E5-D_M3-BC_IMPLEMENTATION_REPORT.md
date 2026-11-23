# Blood and Thunder — E5-D M3-BC implementation report

**Candidate delivered; STOP — awaiting owner Windows Chrome/Edge acceptance.** Both M3-B and M3-C are implemented. The separately approved presentation-envelope extension resolves the original preflight blocker. No M3-D/M4–M7 work, commits, branch creation, pushes, merges or deployment.

## Exact baseline and candidate

- Branch: `feat/e5-d-m1-startup-slots-options`; unchanged HEAD: `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`. The accepted Main M3 working tree included existing uncommitted M2/M3-A/Main M3 source; it was verified against the accepted changed-file inventory before editing. HEAD alone does not describe this uncommitted candidate.
- Accepted Main M3 HTML preserved: 2,387,196 bytes; SHA-256 `ffa0784406a0e2156a4bef2b9343a8b30bf1baf18a2336e40f86f2cf1ea0c16f`. All earlier artifacts retained.
- Candidate: `Blood-and-Thunder-E5-D-M3-BC-Playable.html`, **3,062,357 bytes**, SHA-256 **`ec2283def7e3b391bff520b3390bdafad7bdb2e9cab79b066da73df30ec206ae`**. Two builds are byte-identical.
- Exact source manifest digest: `a0ed104e9d1ef832af46588d18d157ea79739471955771be758bea1ca24586ee`; `evidence/continuation/candidate-source-manifest.json` records file hashes. No implementation commit exists because committing was prohibited.

## Requirement-to-implementation mapping

| Requirement | Implementation and verified boundary |
|---|---|
| Versioned, durable career identity | `src/persistence/career-presentation.js`; strict envelope v2 sidecar sealed by `src/persistence/envelope.js`. Mechanical schema remains 6. |
| Legacy compatibility | Envelope v1 remains readable and is still written for unmarked careers. No automatic opt-in, migration or new default inferred from old branding. Older Main M3 readers cannot read new envelope-v2 saves; retain original v1 backups for old-build rollback. |
| Atomic new creation | `src/management/creation/model.js` version2 request adds only recruitment opt-in. Original `career.initialize` runs unchanged in isolated memory. Sidecar is attached afterward, then existing `CareerSlots.createInitialized` stages and atomically activates the complete initialized record. Cancel/failure exposes no playable partial career. |
| Immutable B pack | Fixed `m3-b-identities-v1` and SHA-256 digest of compiled identity records; pack/cohort/ownership cannot change in preference updates, imports or recovery. B OFF by default; choice available only in New Game. |
| All 23 existing offers | `scripts/e5-d/m3-bc/compile-content.mjs` verifies exact source IDs/categories/names; whitelists reviewed display data from `content/e5-d/m3-bc/`. No runtime catalog importer. |
| Recruitment/owned continuity | `recruitIdentity` uses the immutable pin and native offer/acquired `sourceOfferId`, without renaming native records. `player-pages.js` shows biographies, cosmetic ancestry/origin/stock and disclaimers. Unknown/unmarked entries use the original resolver exactly. |
| C default and control | New v2 wizard careers start ON. Existing unmarked careers remain native until explicit opt-in in Options → Game Preferences. Radio preference is independently revisioned and preserved in both export formats. |
| Typed post-acceptance commentary | `src/presentation/content/m3-bc.js` joins already-emitted native lines to same-batch accepted events by ID/time/type. Explicit field/format mappings cover all 22 ordinary keys; missing/ambiguous context falls back. |
| Fixed resistance path | Only accepted AI_DECISION-derived DIRECTIVE_RESISTANCE lines qualify. Existing reporter gate/throttle remains authoritative; the fixed sentence is not a variant pool. |
| Native reporter unchanged | Build-only viewer hooks call the display adapter after `Commentary.consumeBatch/consume`. No reporter factory, priority, throttle, native selection, narrative or event changes. |
| Deterministic variant selection | Native presentation hash of `eventId + ':' + type` modulo fixed alternate variant count; no gameplay RNG. |
| Immediate OFF restoration | Bounded 160-line display cache retains accepted native lines and their source context. Turning C OFF updates visible text to original native wording, without creating lines or mutating native history. |
| Independent practice and owned races | New embedded practice presentation uses accepted P1.5/P2.2 source with the same display-only hook; original accepted practice HTML remains preserved. Career viewer uses the same hook plus existing participant-label projection. |
| Save/backup/recovery | CareerStore publication, commands, compatibility steps, career-only import/export and recovery preserve the sidecar. Complete backups keep their existing outer version and carry the complete envelope in the career record. E4 exact-byte/generation validation includes it. |
| Stale/failed writes | Expected sidecar revision plus existing raw-byte, Web Lock, generation/read-set and atomic IDB checks. Preparation is not durable acknowledgment. |

## Compatibility and rollback

The exact serialized schema and matrix are in `BNT_E5-D_M3-BC_SCHEMA_COMPATIBILITY.md`, documented before implementation. Unmarked old saves are never silently upgraded. Existing marked careers reject an unmarked, contradictory or older-preference backup; equal revisions must match the full sidecar. Old unmarked careers cannot be retrofitted into a new-career cohort through same-career restore. An empty destination can import a valid complete backup with its original identity; it has no external knowledge of later saves on another machine.

Recovery of a valid older mechanical checkpoint retains the current envelope-level pin and radio choice. It does not rewind them or merge incompatible identities. Unsupported/corrupt sidecars block automatic writes and preserve original bytes. Previous full generations retain their own exact records, with activation subject to compatibility checks. Career-only JSON includes the new sidecar but still excludes external race sessions and older M2 branding/guide runtime; this distinction is explained in Options.

## Contracts preserved and scope

237 existing simulation, AI, career-domain, reporter, replay, track, core, test and historical-reference files match baseline hashes. Original grants, native `generic_draft_beast`, economics, ownership, contracts, capacities, market RNG/order, player inputs, Strategy Signs, official results, E4 journals, settlement, rewards and replay references were not modified. No dependencies, art, fonts, networking or manual content-loading requirement added.

Changed files are listed relative to the accepted working-tree inventory, not just Git HEAD, in `BNT_E5-D_M3-BC_CHANGED_FILES.csv`. Baseline status and hashes remain in external evidence. Source changes are additive presentation and approved envelope-boundary changes.

## Verification and limitations

Frozen-source Node suite: **835/835**, including 44 additive M3-BC tests. Candidate browser functional groups: **54 passed**. Historical/payroll references: 14/14 match; three complete native race ON/OFF comparisons match exact capture/checksums. Detailed commands, raw exits, diagnostics and artifact evidence are in the test report.

Windows direct-file acceptance is pending. Managed Chromium blocks file navigation; no claim of Windows acceptance is made. Browser storage is not guaranteed permanent, and downloading a backup does not prove disk durability. Cosmetic fields do not promise native AI personality or species mechanics. Unknown future versions require explicit compatible readers; nothing is silently discarded.
