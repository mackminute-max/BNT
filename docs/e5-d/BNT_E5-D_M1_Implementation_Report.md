# Blood and Thunder — E5-D M1 Implementation Report

Date: November 22, 2026 (America/Los_Angeles). Scope: **M1 — startup, independent career slots and global Options only**. Owner acceptance remains separate.

## Source and authority

Repository: `mackminute-max/BNT`, local `/workspace/BNT`. Existing branch `feat/m2-e5-c1-navigation-correction`; baseline/HEAD `a70ec6e836b765488dbe793606e8c103b8dad3da`, accepted E5-C.1 application commit `fd9cd96e3c8b13ac4ba391c7cf2f9651d923d10d`. No branch, commit, merge, push, release or deployment was created. The M1 handoff does not separately authorize those repository operations. Delivery is a reviewable working-tree implementation; its exact file hashes accompany the evidence.

The pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was preserved. The accepted C, C.1, B and P2.2 artifacts were preserved and their checksums checked by the new build.

Read the handoff README, Master Brief, active M1 prompt, acceptance matrix and relevant five audit references. Actual source confirms the audits' E5-C.1 baseline. Nations canon and derived AI database remain supporting references; no World Bible content, bonuses, generators or new assets were ingested. No separately named Overall Vision document was located in the newly supplied package; M1 uses the approved presentation guidance and existing game, without reconstructing a different experiment.

## Delivered behavior

- Loading and title screens; New Game, Continue, Load Game; fixed accessible wheel.
- New Game explicitly creates a **separate empty schema-2 career**, then bridges to the existing starting-package/service workflow. No automatic grant, replacement, package redesign or new onboarding mechanics.
- Multiple native IndexedDB databases, one per new career slot, with independent owners, career records, protected history, sessions and Legacy ownership. Existing single-career authority stays at its original database/key/IDs.
- Continue uses actual durable commit metadata, not navigation time. An invalid slot, unknown competing historical time or equal latest timestamps requires explicit Load Game selection rather than invented ordering or silent substitution.
- Save & Load with real autosave status, independent slots, current-career exports/restoration, and complete-backup import into an isolated empty destination. Complete and career-only formats remain distinct. Unrelated or duplicate ownership cannot be merged through the new-slot import path.
- Global Options: Save & Load, scoped Preferences, Help & Rules, centralized Developer Tools, guarded Return to Title. Native dialog focus/Escape and presentation-history Back handling.
- Existing authoritative viewer pause, acknowledgment and prior-running-state restoration. No second simulation pause flag. Existing speed, step, radio, tactical map and queued Sign rules remain intact.
- Game-styled async confirmations in touched management, creation, package, championship/reward and supported save/import flows. Remaining untouched developer/practice historical sites are inventoried for M3.

## Persistence design and compatibility

### Navigator index

`BNT-E5D-slots-v1`, object store `slots`, version 1, stores only `{version,id,database,status}`. IDs map strictly to `BNT-E5D-slot-<uuid>`; the reserved `legacy` slot maps to `BNT-E4-v1`. It is a navigator, never a financial, roster, result or Legacy authority. Actual state must validate through the existing coordinator/worker before listing it as usable or opening it.

An index reservation is durably committed **before** any new career authority. A failure before allocation creates no database-backed career. A failure after reservation remains visible; a retained creation/import stage can be retried only after confirmation and existing validation. There is no post-save index write whose loss could silently orphan a valid authority.

### Save times

An optional `save-navigation` record is written in the **same strict IndexedDB transaction** as the existing head/previous generation. It records a generation-bound committed timestamp. A failed metadata write aborts the whole transaction. Once present it is maintained by the current coordinator's subsequent commits; an older application that leaves it stale makes the time unknown, not the career corrupt. This metadata is not added to career JSON or protected history. Missing or malformed timestamps never grant authority.

No domain schema version changes, owner-ID rewrites, altered receipt limits, journal pruning or new save migration format. Career schema remains 6 at the latest existing milestone; supported earlier schemas remain supported. New creation still uses the existing schema-2 factory and protected package initialization. New-slot import uses the existing complete-backup validator and atomic activation, retaining original identities. Duplicate profile/career IDs and uncertain existing-slot identities block duplicate import.

### Isolation and coordination

Each mounted slot uses its scoped coordinator database and isolated legacy adapter. New slots do not write a career into shared localStorage. Only the legacy slot can discover its original Web Storage. Existing migration witnesses, strict generations/read sets, Web Locks, financial anchors, previous generation, native prepare and exactly-once official publication stay authoritative. The existing shared writer lock is retained conservatively across slots.

Switching is guarded and reloads the document. Old workers, iframe connections, selections, listeners and UI references cannot remain attached to the new career. Protected pending operations block leaving; unfinished championships/reward states require an in-game confirmation and remain saved, not abandoned, withdrawn or settled. Practice discard is separately confirmed in touched navigation.

The synchronous CareerStore stays synchronous. Two existing **UI proxy preview** calls now use an explicitly awaited, read-only worker interface so early schema-2/3 careers can preview compatibility after durable creation. The worker whitelists only `previewEconomy` and `previewCycles`, using the existing CareerStore checks. No preview commits or bypasses protected migration history.

## Modules / changed files

New:

- `src/management/startup/slots.js`: strict catalog, isolated context, validated listing, latest-save choice, creation/staged recovery, complete-backup adoption.
- `src/management/startup/dialogs.js`: async accessible confirmation UI; unchanged native fallback outside M1.
- `src/management/startup/shell.js`: title, wheel, menu, guarded routing, viewer pause bridge and optional backups.
- `src/management/startup/entry.js`, `shell.css`: deferred app mounting and bounded presentation styles.
- `scripts/e5-d/m1/`: standalone builder and additive browser/regression/fault/import/native/direct-file verification.
- `tests/e5-d-m1.test.js`: slot mapping, committed-time selection, empty ownership and protected worker-preview checks.

Existing narrow integration changes:

- `src/persistence/e4/indexeddb.js`: optional atomic navigator metadata/read API; original domain bounds and publication transaction retained.
- `src/persistence/e4/client.js`, `worker-service.js`: read-only protected compatibility preview.
- `src/ui/career-saves.js`: scoped storage/database injection, explicit pending count, awaited confirmation and presentation port.
- `src/ui/durable-championships.js`: existing coordinator uses the selected database; touched confirmations use styled dialogs.
- `src/ui/stable-economy.js`, `stable-cycles.js`: await the durable UI preview result; original preview/domain logic unchanged.
- `src/management/playable.js`: narrow presentation API, readable package confirmation, await previews/dialogs; C.1 single Continue initialization retained.
- `src/management/career-race/flow.js`, `championship-e5.js`: async styled confirmations only; existing operation payloads and rules retained.

See the exact source manifest and final working-tree inventory in the evidence. No changes to `src/sim`, `src/ai`, `src/model`, `src/track`, or the career domain/economy/catalog/reward rules.

## Action preservation

The existing seven stable pages, RU composition and contextual services, recruitment, contracts/payroll, facilities, championship registration/coaching/manual start, Worker playback/Signs/step/speed, official publication, withdrawal and AI continuation, Run/Legacy selection, final settlement, history and supported backup/recovery remain available. The original workbench/control inventory remains connected; the normal bottom developer entry is hidden only in M1 and routed through Options. Complete cleanup/redesign remains M3.

## Known limitations and deferred work

- Windows direct-file acceptance is **not established by managed HTTP verification**. Follow the separate checklist with this exact artifact in Chrome/Edge offline.
- Current IndexedDB/Web Locks/Blob Worker browser support remains required. Storage denial blocks creation safely; this is not a new manual-only fallback pretending to autosave. Browser storage is not guaranteed permanent or unlimited.
- No slot deletion in M1. Pending/missing slots stay visible. An allocation without any retained authority cannot be recreated by recovery; use another slot or a valid external complete backup. Unknown existing identities conservatively block new-slot import.
- Listing cold-validates existing career/session authority in workers. Large accepted E4 histories retain their existing latency/storage costs. No performance-format replacement, pruning or new cache authority was introduced.
- Preferences are intentionally scoped: existing viewer controls, and connected-viewer Reduced motion; no global profile/audio setting is invented.
- Untouched advanced developer dialog sites remain for M3; the optional original practice artifact remains preserved. No content importer, World Identity system, reward effect, creation/HQ redesign or final art was added.
- A missing/corrupt slot cannot silently restart a race or synthesize recovery data. It may remain blocked pending valid evidence.

## Delivery / review boundary

Use the individual M1 HTML, test evidence and Windows checklist. The final artifact size/hash and executed test totals are in the test report. No owner acceptance is claimed. Stop after M1; M2–M7 require separate authorization.

## Exact intentional file inventory

- `dist/Blood-and-Thunder-E5-D-M1-Playable.html`
- `docs/e5-d/BNT_E5-D_M1_Implementation_Report.md`
- `docs/e5-d/BNT_E5-D_M1_Test_Evidence.md`
- `docs/e5-d/BNT_E5-D_M1_Windows_Acceptance.md`
- `docs/e5-d/M1_Architecture_Note.md`
- `scripts/e5-d/m1/browser.mjs`
- `scripts/e5-d/m1/build.mjs`
- `scripts/e5-d/m1/faults-browser.mjs`
- `scripts/e5-d/m1/file-browser.mjs`
- `scripts/e5-d/m1/final-native.mjs`
- `scripts/e5-d/m1/import-browser.mjs`
- `scripts/e5-d/m1/regressions.mjs`
- `scripts/e5-d/m1/report.mjs`
- `src/management/career-race/flow.js`
- `src/management/championship-e5.js`
- `src/management/playable.js`
- `src/management/startup/dialogs.js`
- `src/management/startup/entry.js`
- `src/management/startup/shell.css`
- `src/management/startup/shell.js`
- `src/management/startup/slots.js`
- `src/persistence/e4/client.js`
- `src/persistence/e4/indexeddb.js`
- `src/persistence/e4/worker-service.js`
- `src/ui/career-saves.js`
- `src/ui/durable-championships.js`
- `src/ui/stable-cycles.js`
- `src/ui/stable-economy.js`
- `tests/e5-d-m1.test.js`

The standalone HTML is an intentional generated deliverable. The Markdown reports and new verification scripts are intentional additions. The pre-existing untracked M2-E audit is excluded from this change inventory and remains untouched.
