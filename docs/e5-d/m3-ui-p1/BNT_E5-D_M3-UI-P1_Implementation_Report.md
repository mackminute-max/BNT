# Blood and Thunder — E5-D M3-UI-P1 Implementation Report

## Candidate and baseline

This is the bounded workflow correction following M3-UI owner testing. It is a Windows acceptance candidate, not an owner-accepted release. No branch, commit, merge, push or deployment was created.

- Repository: `/workspace/BNT`; branch `feat/e5-d-m1-startup-slots-options`.
- Existing Git HEAD: `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`. The operative baseline is the supplied uncommitted M3-UI working tree, not this older HEAD.
- All 566 entries in the supplied M3-UI source manifest were verified before edits. Manifest SHA-256: `648f8b47882447824a416f4a447d922ae7cedf814012af2f878459885005bcd6`.
- Preserved M3-UI HTML: SHA-256 `d6a2153249e2a0987d5f073e515f8e8f79ec764367bd7b130079f34bdcf89dc3`.
- Preserved accepted M3-BC-P1 HTML: SHA-256 `5996a56df462c320374dc334501fc93781d4ed79f23cf845d2742b2e8629dbe8`.
- Candidate source is identified by the accompanying per-file source manifest; its changes are measured against the verified working-tree baseline. Pre-existing uncommitted source, documentation and HTMLs remain intact.

## Fully initialized creation

`src/management/creation/initialize-gameplay.js:8` orchestrates the existing commands on an unpublished isolated candidate: economy, payroll, championship foundation, controller, E3 and E5 catalog. `creation/model.js:18` invokes this only for new creation request v3, after the original package grant and immutable presentation activation. The wizard emits v3 only in this candidate (`creation/wizard.js`). The native package contents, acquisition values, Gold, initial contracts and facilities are unchanged. No championship cycle, payroll collection, recovery or reward occurs during initialization.

`startup/slots.js:48` retains the existing staged validated complete-restore protocol and atomic head activation. No intermediate schema becomes a playable slot. Reserved/interrupted slots remain explicit recovery cases. Duplicate confirmations/retries use the same identities; conflicting retries reject. Creation cannot replace an already committed older career. Package employment disclosures use native constructors (`creation/model.js:27`), including grandfathered starting obligations; they do not introduce pricing logic.

Existing creation request v1/v2 and existing career formats remain supported. Older careers are opened without automatic upgrade. Empty older careers retain their package-initialization action in Options; older schema upgrades and recovery remain explicit.

## Headquarters and Options

`playable.js:44` routes the old Save/Load destination into Options. The primary navigation excludes that page and renames Finances. Normal pages do not create the secondary Back/breadcrumb/title row. Options hosts the complete slot/save/export/import/delete UI and the recovery/older-career controls (`startup/shell.js`, `playable.js:68`). No new persistence authority is introduced. Save Game verifies accepted durable career decisions and explicitly excludes unfinished in-memory race progress.

`creation/onboarding.js` no longer mounts the guide on ordinary pages in this candidate. The six management topics and existing race guidance are available under Options → Help (`headquarters/workflow.js`, `startup/shell.js`). Existing branding and saved onboarding metadata are preserved.

Page ownership:

| Page | Responsibilities |
|---|---|
| Home Stable | Accepted identity, accomplishments, Stable Progress, Go Race/Continue shortcut |
| Roster & Barn | Accepted active-team cards, explicit beast-slot replacement, composition/condition |
| Market | Direct hiring/purchases and owned-asset sales |
| Staff & Contracts | Employment and expired-contract renewal/release, native assignment resolution where supported |
| Workshop | Facilities, engineering, equipment detachment |
| Recovery & Services | Treatment, care, repair, training and genuine Work Review information |
| Finances | Treasury, active contracts/wages, unpaid claims, settlement statements and financial ledger |
| Championships | Event tiles, full Details, Registration, existing lifecycle, Last Event |
| Options | Save & Load, Help, preferences, separated diagnostics |

The existing services are immediate transactions, not timed work queues. This candidate exposes that fact instead of inventing jobs, durations or staff-assignment mechanics.

## Contextual transactions

`headquarters/context-actions.js:7` calls the existing `actionQuote`/`actionCommand` interfaces. Native contract constructors/reducers supply hiring and renewal obligations. Cards disclose price, signing surcharge, wages/duration, actual effects, XP and applicable discounts. Facilities keep existing capacity/benefit descriptions. Services disclose immediate completion. Existing financial-history rules remain authoritative.

`player-pages.js:8` builds contextual actions; `playable.js:146` confirms and executes the exact prepared command. Source revision/maintenance checks remain attached. If persisted authority changes before commitment, the native transaction rejects; the player must review the refreshed card and confirm again. Rendering, selecting an event and navigation do not charge Gold. Existing pending-operation controls prevent duplicate submission. Active-team removal guards require deactivation in the Barn rather than violating saved ownership references.

The universal Review Selected Work routing is absent from the new primary pages. Financial history remains available, with player-facing ledger labels and actual balance deltas; zero-Gold setup commands are not presented as expenses. Underlying protected records are retained unchanged.

## Championships and race presentation

`career-race/flow.js` adds only the Events grid wrapper and contextual older-career upgrade route. `headquarters/consolidated.css` uses three, two or one columns according to available width. Full schedules, qualification, provisional awards, fee confirmation, frozen registration, official publication, Run/Legacy choices, final settlement and Last Event remain the accepted flow.

`scripts/e5-d/m3-ui-p1/presentation-source.mjs` relocates the existing Single tick/Present buffered tail controls to Developer Tools; their functions/listeners remain. Play/Pause, speed, Signs, tactical map, standings and radio stay in the normal viewer. Visible acknowledgments describe in-memory inputs accurately. No simulation, Worker buffering, native tick, reporter, journal, publication or settlement code is changed by this presentation patch.

The standalone build uses an opt-in `playerUi` argument to `scripts/e5-c/viewer-build.mjs`; historical callers retain the old output path. The new build embeds its worker/viewer/assets and verifies offline packaging. Previous artifacts are hash-checked and never overwritten.

## Scope and limitations

No changes to simulation/RNG/AI/physics, track geometry, Strategy Sign accounting, native reporting, D2 mapping, championship formulas, financial reducers, E4 authority formats or reward effects were made relative to the verified M3-UI baseline. There are no new runtime dependencies. Creation v3 is orchestration of existing domain operations, not a mechanical schema migration.

The candidate retains existing backend validation costs and logical record limits. Rendering cleanup is not an E4 performance redesign. Native service eligibility, capacity, affordability, XP and championship restrictions may correctly disable actions. Legacy explicit upgrades remain necessary for old careers. Browser storage remains browser/profile/file-context dependent. Closing an unfinished race still restarts it from the saved starting boundary. Owner Windows Chrome/Edge direct-file acceptance remains required.

The final full Node suite passes 871/871 tests. An existing unsupported-creation-version test now rejects v4, because v3 is the newly authorized initialization request; all rejection assertions remain, and no deterministic reference changed. Candidate browser checks pass 67 workflow groups; the managed file-navigation limitation remains explicit.

See the separate test evidence, compatibility note, source manifest, changed-file inventory, performance comparison and Windows checklist. Stop after this delivery; M4 and further gameplay changes remain unauthorized.
