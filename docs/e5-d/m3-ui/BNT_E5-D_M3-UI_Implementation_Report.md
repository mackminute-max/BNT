# Blood and Thunder — E5-D M3-UI Implementation Report

## Delivery and source

Headquarters and championship interface consolidation implemented. This is a candidate for owner Windows acceptance, not owner acceptance or deployment.

- Accepted P1 baseline HTML SHA-256: `5996a56df462c320374dc334501fc93781d4ed79f23cf845d2742b2e8629dbe8`. It remains unchanged.
- All553 entries of the supplied P1 source manifest matched before editing. The existing dirty working tree and prior evidence were preserved.
- Branch: `feat/e5-d-m1-startup-slots-options`; Git HEAD unchanged: `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`. HEAD alone does not identify this uncommitted candidate or the accepted P1 baseline.
- New HTML: `Blood-and-Thunder-E5-D-M3-UI-Playable.html`, **3,121,381 bytes**, SHA-256 `d6a2153249e2a0987d5f073e515f8e8f79ec764367bd7b130079f34bdcf89dc3`.
- Source manifest: `BNT_E5-D_M3-UI_Source_Manifest.json`, SHA-256 `648f8b47882447824a416f4a447d922ae7cedf814012af2f878459885005bcd6`. It records current source/test/script/content bytes; exact production/test freeze is also retained in `evidence/frozen-production.json`.
- No branch, commit, merge, push, release or deployment was created.

## Player-facing changes

### Home Stable

Prominent stable and owner names, two clearly labeled temporary illustrations with stable asset references, Gold, authoritative Reputation, championship victories and completed-championship count. Reputation is read from `championshipFoundation.facts.reputation`; victories from its existing `victories` records. Stable Progress retains capacity and facility information. Trophies and permanent Legacy ownership come from existing authoritative records. Go Race / Continue Championship only navigates to Championships.

The old Your Next Step, Who is Racing for You and Saving displays are absent on Home. The extra Home button beside Back is removed. Existing Options and Back navigation remain.

### Roster & Barn

Owned inspection cards and a four-part, text-readable active lineup replace the assignment dropdown panel and duplicate recruitment cards. Each driver, beast and chariot card exposes Activate/Deactivate, active highlighting, native eligibility explanations and keyboard-native buttons. Driver/chariot activation replaces that role. Beasts fill empty slots; a third beast requires Replace Beast Slot 1, Replace Beast Slot 2 or Cancel. Cancel changes nothing. No duplicate components or excess beast slots are permitted.

Selections persist after authoritative acceptance. Complete legal selections use existing protected `ru.assemble`; incomplete selections retain their ordered partial lineup and use existing `ru.disassemble` when needed. The two are published together, not as unrelated writes. Active/unsettled championship restrictions remain: Barn inspection is available, but edits are blocked; frozen registered composition cannot change.

### Championships

Selectable Events cards replace the championship dropdown. Qualified cards have green Select; unmet requirements are disabled with the actual Reputation shortfall or trophy reason. Selection only updates transient UI state and charges nothing.

Details discloses the selected native schedule, format, track, grid, entry fee, qualification and unchanged provisional award tables. Registration shows the current Barn lineup, legal/condition reasons, Register and Return to Barn. Incomplete, mismatched, unqualified, unaffordable or otherwise blocked selections cannot register. Confirmation still names the selected assets and frozen fee/schedule; the original E5 transaction remains the only registration authority.

An active championship replaces the unregistered offer form with its current lifecycle controls. Redundant ordinary Reopen Saved Championship and backup controls are removed from that flow; recovery keeps its valid reopen/retry actions and backups remain in Save/Load. A manual race-start click remains required; its redundant nonfinancial confirmation is removed in this candidate. Official publication, Run selection, next event, rivals’ continuation, settlement, Legacy selection and archive gates remain intact.

Last Event shows the latest completed official schedule/archive, player placement, final standings/results, available settlement summary and the actual Legacy selection. A pending Legacy choice explicitly says no reward has yet been received. Full history remains in Career Records.

### Ownership and navigation

Market owns recruitment/purchases; no recruitment panel remains in Barn or Staff. Workshop owns facility purchase cards; the duplicate Finances cards are removed. Existing care, training, personnel, engineering and financial operations remain reachable through their existing context/work-review paths. Read-only information and contextual navigation shortcuts are preserved.

Headquarters page transitions render from the loaded state without reload, migration, transaction or write. The packaged test performs200 page changes with zero IDB puts and exact state equality. A selected event remains selected when returning through Barn in the current session.

### Saving

Consequential decisions use the existing authority. Routine successful operation messages are suppressed in the consolidated management surface; pending changes and failures remain explicit. Save Game in Save/Load and Options validates the committed career rather than creating a second save authority or another generation. It cannot claim unfinished race progress was saved. Load Game uses the existing slot loader. Manual-storage mode retains its explicit export/checkpoint restrictions; it cannot be advertised as durable browser saving.

P1 race advancement, buffered Worker behavior, queued Signs and boundary publication are unchanged. Closing an unfinished attempt restarts the exact saved setup; officially committed results and career choices remain durable.

## Modules and contracts

| Module | Change |
|---|---|
| `src/management/headquarters/consolidated.js` / `.css` | Dashboard, placeholder references, Barn preview/cards, beast-slot dialog and Last Event rendering |
| `src/management/headquarters/active-team.js` | Pure ordered selection update, native component checks, existing complete-team preview |
| `src/management/playable.js` / `player-pages.js` | Consolidated page ownership, activation transport, navigation and status presentation |
| `src/management/career-race/flow.js` | Events/Details/Registration, current lifecycle display and contextual identity names |
| `src/management/headquarters/model.js` | Candidate route labels; prior build labels retained when the new flag is absent |
| `src/management/startup/entry.js` / `shell.js` | Candidate flag and Options Save Game verification |
| `src/persistence/active-team.js` | Isolated candidate using existing protected assignment commands; one authoritative envelope publish |
| `src/persistence/career-presentation.js` / `envelope.js` | Strict sidecar-v2 selection, ownership, revision, downgrade protection and historical recovery validation |
| `src/persistence/career-store.js` | `setActiveTeam(request)` boundary |
| `src/persistence/e4/worker-service.js` | Versioned selection preparation through existing worker/coordinator |
| `src/ui/durable-championships.js` | Existing coordinated selection and read-only Save Game verification |
| `src/career/component-eligibility.js`, `assembly.js`, `economy/reducers.js` | Extract existing component checks for reuse by complete assembly and partial selection; preserve schema-specific rules and reason ordering |

The changed-file CSV distinguishes actual changes relative to P1 from the substantial pre-existing uncommitted work. Source hashes and retained raw evidence accompany the candidate.

## Compatibility and limitations

Mechanical career schema remains6, envelope remains1/2, native checkpoints and P1 session-v1/v2 remain unchanged. Only an explicit Barn change creates career-presentation sidecar-v2; opening/navigating old saves does not rewrite them. New readers support older saves. Older P1 readers reject sidecar-v2 rather than silently discard it; keep the accepted HTML/backups. Immutable pack pins and independent commentary preferences remain preserved. See the separate compatibility note for exact serialized fields, rollback and import behavior.

Temporary art is intentionally provisional. No art registry, progression artwork stages, M4 reward effects, new reward content, financial formula, native simulation, AI, RNG, track, Sign or scoring change was implemented. Foundation-only schema-5 saves lack championship facts; the dashboard now handles that historical shape without adding or migrating facts. Necessary busy/error states remain; long protected validation/backup work is not eliminated by this interface milestone.

Managed Chromium blocks actual file launches. Owner testing of the supplied HTML in Windows Chrome and Edge remains required. Storage quotas/permanence and downloaded-file durability are not guaranteed. Stop after this candidate for owner acceptance.
