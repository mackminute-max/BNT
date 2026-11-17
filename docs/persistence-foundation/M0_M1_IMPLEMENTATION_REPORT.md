# M0 Storage Verification and M1 Persistence Foundation

## Completion assessment

**M1 implementation and managed-browser functional verification: complete within this foundation scope. M0 direct-file acceptance: blocked by the managed browser's administrator policy.** Both the new and retained browser runners attempted actual `file://` navigation and recorded `ERR_BLOCKED_BY_ADMINISTRATOR`. Their HTTP diagnostic fallback is not direct-file verification. A Windows/offline save/load/recovery check of this exact artifact remains outstanding; no final owner acceptance is declared.

Baseline: Git `503ea20ddc17f4dcf1801900d3dbd1cedc16bd6d`, clean working tree at entry, 212 passing tests, simulation `0.6.0-tracks`. Architecture Audit and Implementation Readiness documents were the baseline. The latest M0/M1 authorization governs this narrow implementation; championship/economy/injury policy decisions from the audit remain deferred to later milestones.

No racing engine, AI, Strategy Sign timing, track generation, commentary, numerical coefficients or existing test assertion was changed. Simulation/package versions remain 0.6.0-tracks/0.6.0 because simulation behavior and replay format are unchanged. Career state/envelope use their own **schema 1**. No dependency was added and the existing esbuild pipeline remains intact.

## Delivered behavior and files

| File | Interface / responsibility |
|---|---|
| `src/career/state.js` | `createCareer`, `validateState`, `transact`, provenance validation/union. Plain-data profile/career state, strict IDs/ownership/financial checks, safe-integer treasury adjustments, revision/receipt consistency and immutable returned copies. No browser storage access. |
| `src/persistence/envelope.js` | `makeEnvelope`, `inspectEnvelope`, `parseEnvelope`, `SAVE_KEY`, size limit. Typed/sealed primary/recovery checkpoints and independently sealed provenance registry. Strict external import versus diagnostic browser-load inspection. |
| `src/persistence/career-store.js` | Injected synchronous storage adapter: `open`, `create`, `transaction`, `importSave`, `recover`, `export`, `acknowledgeExport`, copied `state`. One-key commit, stale-save detection, failed-write rollback, manual checkpoint gating and explicit corruption recovery. |
| `src/ui/career-saves.js` | New developer panel controller; serialized UI actions, cooperating-window Web Locks where available, create/inspect/edit/import/export/recovery controls and explicit user confirmations. Uses the existing JSON download helper. |
| `src/ui/workbench.js` | Adds one import/mount call for the new section; existing editors, tuning, configuration, replay and batch tools retained. |
| `src/ui/index.html` | Adds **Career State / Save Management — M1 foundation** inside the existing developer panel. |
| `tests/persistence.test.js` | 25 focused persistence/domain/fault/compatibility tests. |
| `scripts/persistence-browser.mjs` | 18 browser check groups covering M0 capabilities, actual UI save/reload/import/recovery/manual fallback and unchanged race state; dedicated evidence path. |
| `dist/Blood_and_Thunder.html`, `dist/Blood-and-Thunder-Track-Test.html` | Identical rebuilt self-contained artifacts with the new panel embedded. |
| Documentation/current status | This report, Windows instructions, evidence/reproduction guide and current implementation/development/assumptions/acceptance indexes. Historical audits and previous study evidence unchanged. |

### Scope of a new foundation state

A user explicitly creates an **empty M1 foundation** with stable profile/career IDs, names, Foundation status, **0 Gold**, no assets, no championships and empty Owner Legacy records. Zero is an engineering fixture for persistence, not an approved M2 starting Gold amount. There is no automatic new-career creation on a corrupt/missing save. No roster, RU assembly, economy rewards, championship, injury, training or Legacy progression system was implemented.

The canonical persistent aggregate contains:

- `kind: BNT-career-state`, schema/revision;
- Owner Profile ID/name, developer-edited flag and an explicit empty Legacy record container;
- Career ID/owner-profile reference/name/Foundation status/treasury/developer-edited flag;
- optional `pendingRace` (null when absent), complete normalized starting setup, race ID/career reference and exact simulation version;
- accepted M1 transaction receipts and developer provenance.

The optional checkpoint can be imported/exported and is validated against the existing constructor/configuration model. Missing entrant/defaulted setup data and incompatible engine versions are rejected. It is **not connected to the live race viewer**, does not resume mid-race, and cannot apply results/rewards. A later authorized race bridge must decide its lifecycle. Full game-state export means the **complete persistent aggregate and envelope**, not a serialized current animation/tick/event log.

Strict schemas reject unknown entity fields and unsupported progression. Current entity references include career → Owner Profile, transaction → profile/career and pending checkpoint → career, plus existing engine validation of complete race entrants. Persistent owned asset registries/foreign keys belong to M2; no dummy assets are created here. Nonempty Owner Legacy progression is explicitly rejected by schema 1 rather than silently discarded or merged. Future asset/injury/championship/financial/Legacy commands require their own approved validators/reducers and explicit schema compatibility policy, not an unrestricted patch endpoint.

## Persistence and integrity protocol

Career key: **`bnt.career.save.v1`**. Existing developer scenarios continue using **`bnt.configuration.v1`**. Game-save files use **`BNT-game-save`**, separate from `BNT-configuration`, `BNT-replay` and corrupt-save diagnostic exports. There is no backend, adjacent asset or runtime Node requirement.

Each save is one JSON envelope containing primary state, previous valid recovery state (or null), and a separate provenance registry. The existing canonical diagnostic checksum seals each checkpoint and the registry. It detects ordinary accidental corruption; it is **not cryptographic authentication or anti-tamper protection**. Every payload is also validated structurally and semantically: kind/schema, exact fields, IDs, current entity ownership, safe nonnegative money, sequential revisions, unique transaction IDs, running balances, receipts, edit flags/provenance and optional checkpoint completeness/version.

A commit validates and serializes the entire next envelope before a single `localStorage.setItem`. Domain state is published only after that call succeeds. Recovery is the last valid state, not a generated reward or financial workaround. Logical single-write atomicity does not guarantee filesystem durability, browser retention or recovery after whole-envelope loss.

Automatic persistence runs on explicit foundation creation, accepted developer transaction, confirmed import and confirmed checkpoint selection. It does not save race ticks, previews or running simulation state. Duplicate accepted transactions return the prior receipt without a new revision/write; same-ID/different-payload conflicts are rejected. Stale expected revisions, wrong profile/career targets and changed browser save bytes are rejected without effects.

### Corruption, recovery and imports

Loading never writes or silently recovers. Corrupt primary with valid recovery enters **RECOVERY-REQUIRED**, exposes the previous valid checkpoint and retains original text. Explicit player confirmation selects that checkpoint, preserving known edit provenance without inventing a transaction or revision. A storage failure during that selection rolls back and permits a further explicit manual recovery retry.

If both usable checkpoints/outer JSON/registry are invalid or incompatible, normal writes are blocked. If only recovery is damaged, the valid primary remains available for export, while automatic writes remain blocked until explicit replacement. Original corrupt bytes can be requested as a separate diagnostic JSON download. They remain in memory for that session; exporting is necessary to keep them after closing. No silent replacement assets/state or automatic repair is attempted.

External imports are strictly validated before staging. File selection alone changes nothing. **Confirm replacement** prompts before replacing the entire loaded profile/career/checkpoint. Failed validation, cancellation or failed storage write leaves the prior loaded career intact. The imported file's recovery checkpoint is retained, not replaced with unrelated profile data. Export a current backup before intentionally replacing a different profile.

Owner Legacy is never merged. Only matching **developer provenance** is retained to prevent clearing an edited identity by importing an earlier checkpoint. Same-owner/different-career import retains the owner's edited status; the new active career is flagged only if it has matching career edits. Foreign career ownership and conflicting known transaction provenance are rejected. With an unchanged known registry, full export/import round-trips every serialized field and ID exactly. Where the running session knows additional edits, import intentionally extends the registry/flags rather than erasing them; the UI warns about this.

### Manual mode and truthful download semantics

Storage access denial activates **MANUAL** mode. A failed automatic write also switches to manual while **rolling back that attempted change**. It is not silently reapplied. The user can export the unchanged current checkpoint, confirm it, then retry the desired action manually. Manual commits modify memory only, retaining a previous checkpoint in the export envelope.

After each manual creation/import/transaction/recovery, further changes are gated until **Export complete persistent game state** and **I saved this checkpoint**. A download request alone never clears the gate. Confirmation is a user statement for the current session—not evidence of durable disk saving. Manual reload does not discover external files automatically; import the saved JSON explicitly. All warnings say when browser storage is not being updated.

UI actions are serialized. Web Locks serialize cooperating windows when available, and the store compares exact previously read browser bytes before writing. Without Web Locks, the documented operating constraint is **one active writer/window**: byte/revision checks are not an atomic cross-tab compare-and-swap. Noncooperating console writes and external save editing cannot be made secure by an offline HTML application.

## Controlled developer transactions

Only **`developer.treasury.adjust`** is supported. Each request includes a unique transaction ID, profile/career IDs, expected revision, whole-number delta and nonempty reason. Arithmetic uses safe integer checks/BigInt intermediate calculation; negative final balances, fractional/nonfinite/overflow values and invalid references fail before commit. Empty UI numeric input is rejected rather than converted to a zero-value edit. A valid zero adjustment is still an explicit developer action and is marked accordingly.

Accepted edits set profile/career flags and retain transaction ID, target IDs, revision, delta and reason. The independent sealed registry preserves this history when an earlier recovery/import checkpoint predates the edit. IDs already known on an abandoned/recovered timeline cannot be reused to create another effect. No UI clear/reset action removes the flag for the same known identity.

This supplies provenance for future Owner Legacy isolation but does not implement Legacy settlement or merging. A wholly older clean file opened in a fresh browser cannot reveal later edits never present in that file; deliberate save/JavaScript tampering is not prevented. Preserve/export the latest complete save to carry provenance between browsers.

There are no `race.reward`, `legacy.merge`, asset-edit or speculative `recovery.reward` operations. Such types are rejected. Actual duplicate race rewards cannot be tested because no reward system exists yet; the tested receipt/revision mechanism is the foundation that later commands must use.

## Verification actually executed

Environment: Node 24.22.1, npm 11.9.0, managed Chromium 156.0.8078.79. No dependency installation/configuration change was necessary.

| Command | Result | Evidence |
|---|---|---|
| `npm test` before edits | **212 passed, 0 failed** | `evidence/baseline-tests.log` |
| `node --test tests/persistence.test.js` | **25 passed, 0 failed** | `evidence/focused-tests.log` |
| Final `npm test` | **237 passed, 0 failed, 0 skipped** | `evidence/final-tests.log` |
| `npm run build` | Successful; two identical embedded HTMLs; existing dependency guard unchanged | `evidence/build.log` |
| `node scripts/persistence-browser.mjs` | **18/18 functional groups**, no page errors/network requests; exit 1 because actual file launch is blocked | `evidence/browser.log`, `browser.json` |
| `npm run test:browser` | **23/23 retained functional checks**, exact browser/Node racing parity and retained tuning/config/replay/storage fallback tests; exit 1 for blocked file launch | `evidence/existing-browser.log`, `existing-browser.json` |
| Source diff/scope/hash checks | Simulation/AI/config/track/model/reporting/replay source unchanged; complete checksums and artifact hashes recorded | `evidence/manifest.json`, `FILES.sha256` |

New automated tests cover exact round-trip and subsequent transaction; duplicate/conflicting IDs after reload; revision/entity constraints; safe financial bounds; sticky provenance; failed/cancelled/invalid imports; no Legacy merge; explicit corrupt-primary recovery without writes on load; bad outer envelope/guard/future schema; manual export/ack gates; failed write/import rollback and retry; stale writer; inconsistent sealed ledgers/flags; complete pending checkpoints; unknown action rejection; immutable returned copies; independent race/RNG invariance; same-owner provenance; recovery write failure; oversized/unknown data; valid-primary/damaged-backup handling; strict confirmations.

Browser tests additionally exercise actual DOM controls/download readback, automatic reload, separate config key, two windows, confirmation cancellation, corrupt original-text diagnostic export, **injected** quota errors/storage getter denial and a manual export/reload/import/subsequent edit. Normal HTTP-origin write/read/remove succeeds. Injected failures are labelled simulations, not claims that the machine's actual storage quota was exhausted. The browser reports the protocol/capabilities used. Full mid-race persistence, future championship outcomes, cross-browser durability and real Windows file-origin behavior were not verified.

### Development failures and fixes

- The initial build guard rejected a method named `import(...)` because its existing dynamic-import regex also matched that spelling. Renamed the API **`importSave`**; the guard was not relaxed. Original failure log retained.
- Initial new browser automation tried to acknowledge a manually imported checkpoint without exporting that newly loaded state. The disabled control correctly blocked it. The test now explicitly requests a fresh export before acknowledgement; failure report/log retained. No checkpoint restriction was removed.
- Source review added manual retry after recovery-write denial and export of a valid primary when only its backup is damaged, with dedicated regression tests. Final testing was repeated after these changes and UI validation/warning refinements.

## Standalone build and remaining limits

Both deliverables are **237,205 bytes**, SHA-256:

`e35c4b47647433ce62e1748012ec9c39ca9730012bc667a382f2fdb21cfc1e6c`

- `dist/Blood_and_Thunder.html` — canonical playable build.
- `dist/Blood-and-Thunder-Track-Test.html` — identical retained alias.

All required JS/CSS/data are embedded, with no new runtime dependencies, framework, server, service worker or network requirement. Existing tests and complete bundled browser races match the unchanged engine. Static guards and observed zero runtime requests support the offline architecture; they do not substitute for the administrator-blocked actual direct-file launch.

Engineering limits: 2 MiB JSON save envelope, 1,000 accepted transactions/state, 2,000 known provenance marks; limits reject rather than silently discard receipts. No old career save schema exists to migrate yet; schema 1 is the initial format, unknown versions reject explicitly. Later migrations/receipt compaction need an authorized design. Full envelope corruption can lose both nested checkpoints; manual external backups remain essential. localStorage can be path/profile-specific, denied, erased or evicted; moving/renaming an HTML file may change access. Download durability and OS crash/power-loss behavior remain unverified.

No M2 starter roster, assets, RU assembly, purchase/reward/upkeep logic, championship or new career gameplay loop was added. No push, publication or deployment was performed. Next action is owner review plus the [Windows file-origin checklist](WINDOWS_TESTING.md); later milestones require separate authorization.
