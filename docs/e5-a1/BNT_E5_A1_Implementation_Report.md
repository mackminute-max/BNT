# Blood and Thunder — E5-A.1 Implementation Report

Date: November21,2026. **Focused playable-stable/content/UI pass only.** No E5-B settlement, E5-C integrated career racing, P3 racing changes, merge, push or release.

## Revision and baseline

- Branch: `feat/m2-e5-a1-playable-stable`.
- Source commit: **`7e78f70cb707a58527ce5d989aa47ff5d79553d2`**.
- Base: E5-A documentation delivery `eaf464259e2004010e31f442d7033f9afaa4b18b`, inheriting E5-A implementation `4dad533211a88e0a1c36965ccf70d0d7459cb5c3`, M2-D/E4 and accepted P2.2.
- Working tree began with only the pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md`; preserved/excluded from commits.
- Dedicated local branch created. No unrelated branch altered; no remote push, merge, rebase or deployment.

## Delivered player experience

The Home Stable now foregrounds the assembled driver/two beasts/chariot, actual condition/readiness, attention items and contextual next action. Roster/staff cards replace raw registry/derived-state dumps. Cards expose relevant native attributes, condition, injuries, contracts, assignments and real availability, using temporary initials portraits. Provisional names identify actual purchasable content, not decorative NPCs.

Contextual purchase/recruitment, treatment, recovery, training, chariot repairs, equipment detachment, legal sales, employment decisions, facility improvements and wage arrears route into the existing quote→confirm→protected transaction interface. Unavailable actions expand a reason rather than filling cards with opaque inactive commands. Prices, signing charges, prerequisites, fatigue/injury rules, capacity and effect IDs all come from existing authorities. Nothing grants XP or championship income.

Player tabs: Home Stable, Roster & Racing Unit, Staff, Workshop & Finances, Championships, Career Records, Save & Recovery, plus independent practice launch. Internal format/revision/generation labels no longer dominate the player screens. Technical state remains in the developer workspace. Basic career creation, approved package selection, explicit service migrations, durable activation, export/complete backup and manual acknowledgement remain supported; advanced restore/import/migration inspection is retained in Save & Recovery inside Developer Tools.

Championship views use actual offers, costs, schedules, official standings, current event and eligibility. Existing registration/preparation actions delegate to the original E4 controls and their confirmation/validation; they do not create a new progression/scoring/controller authority. These controls remain unavailable where the existing durable controller is not configured. Current-event review opens real eligibility details. No new championship catalog, prizes, settlement or career-to-P2.2 race bridge exists.

## Content: actual scope versus requested targets

The source generator has a fixed23-offer market and immutable reconstruction/golden contracts. Target counts were adjusted, as the handoff allows, rather than changing recruitment rules:

| Category | Target | Delivered market identities |
|---|---:|---:|
| Drivers |12|5|
| Individual beasts |24|6|
| Chariots |8|3|
| Specialists |8–12|3|
| Equipment |Existing categories|6 neutral equipment records|
| Opposing teams |8|0 new teams; no approved production team catalog|

All seven approved facility upgrades are reused. The existing five starting packages and their grants/funds/native effects remain byte-unchanged and separate from purchasable content. Existing rival entrants are preserved; they are not counted as newly authored teams.

`src/management/content.js` holds `e5-a1-provisional-identities-v1`: named biographies/cosmetic ancestry keyed by real offer ID and persisted acquired `economics.sourceOfferId`. Native/state records, stored names, attributes, condition, prices, RNG, qualification and schema fields are not rewritten. A save/export/reload resolves the same profile through the retained source ID; an older application still sees its original generic stored name. This deliberate compatibility approach adds identities, **not new mechanical templates or extra offers**.

The full catalog lists every entity/category/role/status. World Erf/Vaern follows the owner handoff. No finalized World & Racing Bible was found; available reference documents leave nations/cultures unresolved. No nations, political history, championship canon, ancestry modifiers, equipment classes or unsupported staff roles were invented. Alternate HTML gameplay code/content was not used.

## Developer Tools separation

The top player navigation has no Developer Tools entry. A visible fixed bottom button opens a dedicated workspace with its own pages and Return to Stable. No other stable control opens that workspace. Accepted P2.2's independent internal diagnostics remain unchanged inside practice.

The workspace reparents the **original live DOM controls**, preserving IDs, handlers, edited values and careerSaves guard ancestry. Component and Bulk tabs share the original single editor, retaining All RUs / beasts.* semantics. M2 tools, controlled developer treasury editing, configuration/lineup, native parameters, surfaces/tracks, replay/batch, logs/derived/AI, original save import/export and E4 migration/recovery/backup/restore remain accessible.

Fresh DOM comparison verifies all161 original legacy control IDs in the new workspace;162 current IDs include Return to Stable. Functional tests exercise Component, Bulk and protected M2 editing, with actual financial provenance. Opening/navigating/closing tools does not change the career or paused sandbox setup/tick. Returning from Developer Tools preserves the prior player section and the identical practice iframe/Worker, rather than restarting it.

See the complete per-control accessibility mapping. Conditional controls retain original eligibility/recovery restrictions; their disabled state is not replaced with a fake implementation.

## Architecture and APIs

Only additive presentation/content modules and a package build command changed. Existing E5-A source/HTML is preserved as a reference and remains usable.

- `bootstrap-a1.js`: alternate presentation entry using the existing optional career UI port.
- `playable.js`: E5-A-derived player view; no new domain/controller authority.
- `player-pages.js`: asset/recruitment/workshop cards and pure dashboard projection; quotes use original APIs.
- `content.js`: source-ID-bound provisional identity metadata and pure attention/status selectors.
- `workspace.js`: original-control organization, shared editor tabs, context/return handling.
- `a1.css`: scoped layout/card/workspace rules, bottom entry and workbench-grid isolation.
- `scripts/e5-a1/build.mjs`: additive self-contained build.
- `scripts/e5-a1/browser.mjs`, `existing-regressions.mjs`, `e4-regression.mjs`, `tests/e5-a1.test.js`: new/reused assertion harnesses with separate evidence paths.
- `package.json`: `build:e5-a1` only; no dependency/lockfile changes.

Reused: `managementView`, `selectionPreview`, `actionQuote/actionCommand`, existing `CareerStore` queue/authority gate, original E4 coordinator/worker/generation/read-set/restore operations, domain assembly/initializer, economy/cycle quotes and original workbench event handlers. No direct mutation of career state or asynchronous storage shim.

`git diff --quiet eaf4642 -- src/sim src/ai src/career src/persistence src/prototype src/presentation src/ui src/management/home.js src/management/home.css` exits0. Existing accepted gameplay/presentation/E5-A modules and historical record formats are untouched. All native mechanics, Worker scheduling, buffering, Signs and P3 refinements remain protected.

## Build and review

```sh
npm run build:e5-a1
```

Artifact: `dist/Blood-and-Thunder-E5-A1-Playable-Stable.html`.

- **1,727,933 bytes**.
- SHA-256 **`e60d9e7ae55025d4aedb50b81629038051ae4262e4e73ce7f29b475c7b310cb1`**.
- All JS/CSS, E4 Worker and accepted P2.2 practice HTML/assets/Worker embedded. Reproducible build and external-resource checks; no server/adjacent files/runtime network dependency.
- P2.2 accepted artifact SHA remains `24c393c19f7d8aa6f4e2bf6794d2e573d11be74508940e97b78a6330b6a203be`.

See Test Evidence for actual commands/counts/exits. The complete suite passed733/733 again on the frozen source (exit0); exact commands and raw evidence are recorded there. New browser workflow groups and old E4/native/P2.2 compatibility checks passed. Managed Linux blocks file:// navigation, so Windows owner acceptance is still required.

## Limitations and deferred work

Larger content targets and authored rival teams require approved registry/generator/content contracts; no expansion was smuggled into existing saves. Provisional metadata is not a replacement data-authority layer. Starting names remain their original approved package labels. Permanent trophies/Legacy, new long-term staff projects, passenger classes, per-item durability, new equipment bonuses, new championship rewards and final career racing integration remain absent/out of scope. Existing E4 performance/storage/runtime limits remain; this is not a new large-history capacity benchmark.

P3 backlog remains explicitly outstanding:1×/2×/4× player playback; convenient Component/Bulk/M2 access with final P3 acceptance; shortest-practical-route AI; Seek Open Track versus Race Defensively; hide visible lane marks. This pass improves developer access but does not declare P3 refinement2 accepted.

**Ready for E5-A.1 owner review with disclosed content-count adjustments and Windows acceptance outstanding. Stop here; E5-B is not authorized or started.**
