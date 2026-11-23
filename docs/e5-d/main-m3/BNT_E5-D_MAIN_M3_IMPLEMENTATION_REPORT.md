# BNT E5-D Main M3 — Player-Facing Headquarters

November 22, 2026 (America/Los_Angeles). **Main M3 only; candidate for owner acceptance.**

## Authority and verified baseline

The current owner authorization supersedes the master brief's original M1-only execution limit solely for Main M3. Read the master brief, accepted M1/M2/M3-A reports, handoff authorization/scope/boundaries and actual UI/domain contracts. No M3-B/C/D or M4–M7 work is included.

Repository `/workspace/BNT`; branch `feat/e5-d-m1-startup-slots-options`; HEAD `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`. Accepted M2/M3-A remain uncommitted, as explicitly acknowledged by this authorization. Before editing, the complete prior M3-A delivery inventory matched its recorded hashes; its accepted HTML matched **2,367,872 bytes / `0cdf7c55300ea325f7b207770ded8cb58bfa94ffafa2487a4440643dbb5a7681`**. The supplied handoff manifest also verified. No reset, checkout substitution, branch, commit, push, merge or deployment occurred.

Baseline manifests cover 2,695 tracked/nonignored untracked files. Existing uncommitted work and the unrelated M2-E audit were preserved. The pre-edit route/native-action map is `/workspace/deliverables/e5d-main-m3/BNT_MAIN_M3_PREFLIGHT.md`. All reports and changed-file checksums distinguish this milestone from already accepted uncommitted work.

## What changed for the player

The existing headquarters is retained and organized into persistent destinations:

- Home Stable with an actual state-derived next step and direct domain shortcuts.
- Roster & Racing Units: existing composition, readiness, assembly/disassembly and owned cards.
- Recruitment & Markets: all current native offers, partial information, capacity and term review.
- Staff & Contracts: employed specialists, recruitment, wages, lifecycle and supported contract decisions.
- Workshop & Facilities: current occupancy/upgrades, chariots/equipment, engineering and immediate work.
- Recovery & Services: six existing service types, qualification/help and named-target review.
- Finances & Work Review: treasury, obligations, native quotes, all thirteen supported work types and explicit confirmation.
- Championships: existing selection, native phase continuation, results, pending choices and settlement.
- Career Records: actual frozen championship names, records, trophies and inert Legacy selections.
- Save & Recovery remains a contextual setup/recovery destination. Slot switching, backups/import, preferences, Help, Developer Tools and Return to Title stay in the global wheel.

These are logical routes using existing components, not new gameplay systems. Descriptive facilities remain descriptive. Long-term project scheduling and specialist-assignment editing do not have native player handlers and are explicitly unavailable; no fake buttons were introduced.

## Existing action exposure

The previous UI already had native handlers and form fields for engineering, refurbishment, arbitrary payment amounts, full contract decisions, driver-only emergency assistance and explicit career failure, but its work-type list was not rendered. Main M3 exposes that missing selector and contextual entry points rather than implementing another command layer.

All thirteen types still use **existing `actionQuote` / `actionCommand` → `port.perform` → `CareerStore.transaction`**. Supported field filtering selects named native targets, not new eligibility rules. Quote rejection, insufficient Gold/XP, required qualifications, assignment restrictions, debt gates and active/unsettled championship locks remain native. Quotes do not commit. Confirmations use the existing accessible game dialog; cancel/error never reports optimistic success.

Engineering can select existing chariot attributes/points; training can select current supported driver/beast attributes. Integrity repair and wear refurbishment are separate. Only repair exposes a variable restoration amount; other services keep their existing fixed payload. Contract release exposes the native explicit assignment-resolution checkbox. Emergency assistance remains driver-only. Career failure is a quoted, explicitly confirmed irreversible action, never a dashboard side effect.

Market cards distinguish a default standard-term preview from alternate supported terms. An unaffordable default term does not hide the route for reviewing another term. A review opens the existing work form; it does not acquire anything. Actual price/capacity/contract validation still occurs in the native quote and transaction.

The **37-row action reachability CSV** records domains, click paths, handlers, gates and verification, including setup, race/settlement, recovery and persistence actions beyond the thirteen generic work types.

## State-derived next step

The dashboard delegates active championship behavior to the accepted `championshipStep`, including queued race birth, actual racing/resume, publication, Run choice, recovery/blocked state, AI continuation, final settlement and pending Legacy selection. It does not infer completion or awards from animation.

Outside an active championship it prioritizes actual save/recovery/manual checkpoint needs, explicit setup/compatibility, ended-career inspection, native viability review, durable-save preparation, RU readiness and then championship offers. FailurePending routes to review, not automatic confirmation. Newly initialized careers still need the same explicitly confirmed existing service/controller compatibility steps; browsing never applies them.

## Route/back/focus model

`HeadquartersRoutes` holds only known-route scroll/focus memory. Native browser history carries transient route/career keys, not saved career state, authority or cache tokens. It cannot load another career. Unknown routes are ignored.

Back/Home breadcrumbs and page titles are explicit. Browser Back and Escape restore route/focus where applicable; existing modal Escape/Options behavior remains in charge while a dialog is open. Busy protected operations prevent unsafe route changes. Returning from the existing race host uses the original championship return callback. The accepted host, Worker bridge and publication protocol are untouched.

Leaving independent practice requires a game-styled confirmation. Cancel preserves practice and restores matching route/history; explicit return discards only that unsaved independent practice. No owned race is restarted or rerolled. After quote confirmations/cancellations, focus returns to the surviving control or status message; it is not stolen from the native race iframe.

## Player-facing disclosure

Normal result/condition tables use the existing stable/rival presentation labels instead of internal entrant IDs. Records use the retained frozen championship names; archived/completed and eliminated states are not mislabeled as merely registered. Unsupported/unknown historical identities use honest partial-information fallbacks.

Frozen points, purses, placement awards, XP and reputation are disclosed in readable tables rather than requiring raw JSON. Values come directly from the frozen native definitions. Nothing recalculates scoring, entitlement, title eligibility or reward effects. Pending versus credited awards and inert Run/Legacy choices retain M3-A's guards. Already initialized careers no longer show a redundant empty-career form or a selectable regrant path in normal recovery UI; existing protected initialization remains unchanged.

## Changed contracts and files

No mechanical/persistence contract changed. Relative to accepted M3-A, four existing source files changed:

| File | Main M3 change |
|---|---|
| `src/management/playable.js` | Grouped routes, transient history/back/focus, next-step dashboard, generic native work selector and applicable fields |
| `src/management/player-pages.js` | Market term review, existing engineering/refurbishment entry points with native reasons |
| `src/management/career-race/flow.js` | Display-only entrant/recipient labels and readable frozen-term disclosure; operation handlers unchanged |
| `src/management/championship-e5.js` | Display-only frozen archive/trophy names |

New files: `src/management/headquarters/model.js` (route/next-step/target helpers), `interface.css`, nine additive Node tests, Main M3 build/browser/evidence scripts, reports/CSVs and the new HTML. M3-A's 89-record lookup, compiler inputs and all previously accepted tests remain unchanged. See `BNT_E5-D_MAIN_M3_CHANGED_FILES.csv` for baseline/current checksums; the checksum CSV excludes itself to avoid a self-referential hash.

No simulation/AI/geometry/RNG/market generator, Sign accounting/radio, official result/scoring, financial formula, reward effect, ownership resolver, schema/migration, protected transaction, E4 journal/backend or race-host source was modified. The embedded career viewer stays **389,714 bytes**.

## Artifact and status

**`Blood-and-Thunder-E5-D-M3-Playable.html`** — **2,387,196 bytes**.

**SHA-256 `ffa0784406a0e2156a4bef2b9343a8b30bf1baf18a2336e40f86f2cf1ea0c16f`**.

Built twice identically with the existing Node/esbuild/inline-Worker pipeline; no new dependencies, server, artwork, fonts or runtime sidecars. All accepted predecessor artifacts remain byte-identical.

See Test Evidence for executed commands/results, including nonzero/blocked browser processes. Windows Chrome/Edge direct-file acceptance of this new artifact is still the owner's gate; accepted M3-A Windows testing is not claimed as Main M3 testing.

Known limits: existing compatibility transitions remain explicit; unsupported scheduling/staff assignment editing is not invented; route/focus memory is transient; existing large-history validation/storage costs and browser-origin/quota limitations remain. Download requests do not prove a backup exists on disk. No new rule decision is required for the delivered scope; later milestones require separate authorization.

**STOP — Await owner review and acceptance of E5-D Main M3. Do not begin M3-B, M3-C, M3-D or M4–M7.**
