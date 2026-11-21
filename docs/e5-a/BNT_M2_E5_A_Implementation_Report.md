# Blood and Thunder — E5-A Implementation Report

Date: November 21, 2026. Scope: **E5-A Player-Facing Stable Management only**, under the revised four-stage owner handoff. This is not the older roadmap's completed E5 settlement milestone.

## Source and delivery

- Branch: `feat/m2-e5-a-stable-management-ui`.
- Verified baseline: `9dd40d40256d84447717a874b538181f527612b3`, accepted P2.2 source `c235bf3ce0caed44a472cb0abd92104112f39586`.
- Implementation commit: **`4dad533211a88e0a1c36965ccf70d0d7459cb5c3`**.
- M2-D `06fd511`, M2-E optimized E4 `b8c090`, and accepted P2.2 `c235bf3` were verified ancestors before editing. Dedicated branch created from current combined delivery, not older main.
- Pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was preserved and excluded from commits.
- No merge, push, release or deployment performed. No owner acceptance claimed.

## Functional delivery

The new standalone opens to a Home Stable, with seven persistent navigation sections. UI composition takes broad inspiration from the alternate's dashboard/navigation organization: dark background, gold accents, restrained panels and resource header. No alternate JavaScript, economy, race logic, catalog, numerical values, locations, names, RNG or saves were copied into the application. Alternate input SHA-256: `9035217a7bef27fb4183da447e645a2d4268f6f2c117d523d9dc49deac445e68`.

| Section | Delivered functionality |
|---|---|
| Home Stable | Actual career identity/status, treasury, owned/capacity counts, native RU readiness, debt state, stable viability and active-event context |
| Roster & Racing Unit | Owned personnel/beasts/chariots/equipment/specialists; condition/injury/fatigue/strain/wear/availability; ordered driver/two-beast/chariot selection; pure legality preview; confirmed assemble/disassemble |
| Staff & Facilities | Actual specialists and existing facility records; descriptive versus functional facilities; link to approved service/purchase operations; unsupported scheduling/assignment editing explicitly identified |
| Finances & Operations | Authoritative quote→confirm→transaction for existing purchases/recruitment, sales, termination, equipment detach, facility upgrades, care/treatment/repairs, XP training, Gold engineering, arrears, renewal, release, driver-only emergency request and explicitly confirmed career failure where legal |
| Championships | Actual enabled offers/qualification/affordability, active frozen schedule and official standings; links to existing controller/preparation workflow; no new registration/progression/settlement implementation |
| Career Records | Existing instance/result counts and real settlement statements; trophies and Owner Legacy expansion explicitly unavailable, not fabricated |
| Save & Recovery | Create empty schema2 career; preview/confirm one of five approved starting packages through original initializer; explicit existing economy/payroll migrations; explicit durable migration/revalidation; career JSON and complete-backup download; original import/restore/manual checkpoint tools retained |

All seven views remain accessible during an active championship. Management changes disable with an explanation, and the original domain guards independently reject them. `SETTLEMENT_PENDING` stays locked. A confirmed Failed career stays inspectable/exportable; no new automatic failure rule exists.

### Existing APIs reused

- `src/career/state.js`: `createUninitializedCareer` and existing store schema dispatch.
- `src/career/packages.js`, `domain-commands.js`: approved starting packages, strict pristine gate, initialization and assignment effect IDs.
- `src/career/assembly.js:previewRU`, `economy/reducers.js:previewRU3`, `cycles/policy.js:previewRU4`: legality/ownership/condition/contracts and native derived stats.
- `quoteEconomy`, `quoteEconomy4`, `quoteCycle`: all cost/XP/credit/eligibility/financial effects. No replacement pricing formula.
- `CareerStore.transaction`: command versions1/2/3, gameplay and maintenance revisions, protected effect IDs and rollback.
- `src/ui/career-saves.js`: existing serialized action queue, legacy-authority discovery gate, store facade and migration/persistence routing.
- `E4Coordinator`: existing worker preparation, generation/read-set commit, durable acknowledgement, recovery, complete backup and restore.
- Existing `src/ui/workbench.js`, career, economy, cycles and durable controller panels retained for advanced workflows and developer tools.

## Presentation adapter and persistence safety

`src/management/model.js` provides pure view projections, version-appropriate legality/quotes and command construction. `home.js` owns DOM/navigation/local uncommitted selection only. It never changes a career object. Every new mutation calls the existing career queue and its real store facade. When migrated, that facade routes to the E4 worker/backend; it does not edit historical Web Storage.

A small optional presentation port in `career-saves.js` supplies state access, refresh subscription, original workflow invocation and queued operations. The queue retains a per-promise error outcome in a WeakMap so the new UI can distinguish failures at the authority-discovery gate and inside the operation. Old tools keep their existing error display. Before invoking an E4 control, its original render refreshes stale enablement against the current legacy career. No domain restriction is weakened.

The UI shows pending status, prevents duplicate button submissions, does not update balances optimistically, and reports success only after the original operation resolves. Quotes freeze an ordinary existing command and revisions; stale quotes reject through original validation. Quota failures leave the persisted generation and career unchanged. Cold load discovers durable authority without migrating automatically. Corrupt durable authority does not authorize fallback writes to a stale legacy save.

Manual mode remains supported through the original workflow: in-memory changes explicitly say they are not durable; export/confirmation is required before another mutation. Download messages state that external disk durability cannot be verified.

No save schema, command format, history cap, record bound, recovery order, payroll formula or numerical rule changed.

## P2.2 preservation

The accepted P2.2 HTML is embedded **byte-for-byte** as an independent practice race, opened on demand in an iframe and destroyed when closed. The build fails if its accepted SHA changes. This preserves its native Worker, buffering, Signs, camera/map/radio/standings/countdown/controls without editing accepted presentation code.

Practice uses demonstration entrants, not owned career assets. It cannot award rewards or publish championship results. Navigation labels explicitly distinguish it from the existing career preparation workflow. This is intentional E5-A scope, not a claim of E5-C integration. Existing E4 career races still use their original Worker/controller pathway. No second race result authority was created.

## File inventory

New:

- `src/management/bootstrap.js`: wraps existing workbench, mounts optional Home Stable presentation.
- `src/management/model.js`: pure projections and native command adapters.
- `src/management/home.js`: navigation, asset/operation screens, confirmations and original workflow handoffs.
- `src/management/home.css`: scoped Dark Deco desktop/responsive presentation.
- `scripts/e5-a/build.mjs`: additive self-contained build with original E4 Worker and exact accepted P2.2 practice.
- `scripts/e5-a/browser.mjs`: twelve player workflow/failure/layout groups on disposable browser contexts.
- `scripts/e5-a/existing-regressions.mjs`: original P2.2/native/reference assertions, output redirected without overwriting accepted evidence.
- `scripts/e5-a/e4-regression.mjs`: original nine-group E4 workflow runner against new HTML, original workbench made visible only by harness.
- `tests/e5-a.test.js`: eight focused authoritative integration tests.
- `dist/Blood-and-Thunder-E5-A-Stable.html`.

Modified: `src/ui/career-saves.js` optional presentation port/error propagation; `package.json` additive `build:e5-a` command. Dependencies/lockfile untouched. Reports/authority/evidence added under `docs/e5-a/` separately.

`git diff --quiet 9dd40d4 -- src/sim src/ai src/career src/persistence src/prototype src/presentation` exits0. Existing accepted HTML files were not replaced.

## Standalone build

```sh
npm run build:e5-a
```

Produces `dist/Blood-and-Thunder-E5-A-Stable.html`, **1,705,666 bytes**, SHA-256:

`4a74d60f47174ae6aa4c01f3f87b943ebae256d57e535fa638762d6a5c956f88`

Two repeated builds were byte-identical. JS/CSS, E4 Blob Worker and accepted practice assets/Worker are embedded. No runtime network or adjacent file required. System font fallbacks work offline; no new fonts/assets/dependencies installed. The original `scripts/build.mjs` workflow also compiled successfully in an isolated temporary copy without overwriting accepted dist outputs.

## Verification and limits

See [Test Evidence](BNT_M2_E5_A_Test_Evidence.md) for actual counts/exits, including first failing diagnostics and fixes. Managed Linux Chromium blocks file:// navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; HTTP/offline tests do not establish Windows file acceptance. Use the separate Windows checklist.

Remaining limits: existing E4 processing costs/capacity limits are unchanged; advanced import/restore/manual acknowledgement and existing controller preparation still use retained original tools; no passenger classes, scheduling projects, new staff-assignment API or production reward/trophy progression invented. UI refresh/serialization of very large owner histories has not been benchmarked in this bounded interface task. Prior E4 long-Rally cross-runtime and unrelated legacy runner issues were not changed.

**E5-A is ready for owner review, subject to Windows direct-file acceptance. E5-B/C/D were not implemented.**
