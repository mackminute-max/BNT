# BNT — P1 Playable Race Implementation Report

P1 is implemented for local review. The standalone prototype uses the existing headless deterministic engine directly in memory. It is isolated from production careers and E4 durable operations. Windows direct-file acceptance remains outstanding because this environment blocks file navigation.

Baseline: `de1bd66990a2bd390294a152f886b31e5bb8ac04`, accepted native runtime ancestor `b8c090057052ac03bbed73d9487093da61381451`. Branch: `feat/p1-playable-race`. Implementation commit: `bb39003c93d353cb35a8f4a853ab11ecca8b7976`. No merge, push, release or deployment. The pre-existing untracked M2-E readiness document remains untouched.

## Delivery

- Artifact: `dist/Blood-and-Thunder-P1-Playable.html` — 182,784 bytes.
- SHA-256: `58d0a152639fc54e675bd8aea0188c46f126dab34b3d18f14899fe31b4761da2`.
- Original production HTML aliases remain unchanged at 1,047,085 bytes and SHA-256 `8a9b73409a84517f2b0c72c265499434afcf14d94037a645bec553a6b1cba9a3`.
- Build: `node scripts/p1/build.mjs`. Development dependencies already installed; no dependency/configuration changes.

## Requirements and implementation

| Stage | Delivered | Evidence |
|---|---|---|
| P1-A native session | `PlayableSession` owns native state; direct `step`, native `issueSign`, frozen restart setup, seed/format/weather/base player selection; bounded whole-tick playback at 1×/2×/4× | `src/prototype/session.js`; new tests and browser controls |
| P1-B presentation | All-format top-down follow with active-rival fallback, separately fitted tactical map, live provisional order, official classification, condition/strain/fatigue/wear HUD, bounded event-driven radio, pause/step/restart | `src/prototype/view.js`, `app.js`, `index.html`; browser screenshots |
| P1-C Rally points | Opt-in `signPointPolicy: {version:1,category}`; short 1/2, medium 1/3 and 2/3, long quarter/half/three-quarter; exact reference-distance fractions and native sub-event crossing | `src/track/course.js`, `prototypeRally`; legacy parser tests and twelve historical replays |
| P1-D comparison | Immutable baseline compiler, two explicitly experimental presets, player-scoped coaching, same-rival controlled full-race pair, action/condition/contact/finish metrics | `src/prototype/builds.js`; 16 repeated complete comparisons |
| P1-E delivery | Distinct self-contained HTML, focused and full regressions, historical/payroll checks, HTTP/offline browser flows and reproducible performance scripts | `scripts/p1/`, test evidence and owner guide |

## Reuse and separation

Reused `src/sim/race.js` createRace/step/issueSign/classification/digest, `src/model/ru.js` validation/formulas, AI coaching and Sign utilities, track catalog/generator/analytic point conversion, `Commentary` and native clearance validator. These simulation/AI/formula modules were not modified. Existing native RNG, dt, event ordering, AI cadence, combat/weather/incidents, digest interval and collision geometry remain intact.

New modules: `src/prototype/session.js` (setup, bounded in-memory clock, native metrics), `builds.js` (pure experimental compiler), `view.js` (cached Path2D geometry and read-only camera/map), `app.js` (UI/controller), `index.html` (standalone presentation). New scripts: `scripts/p1/build.mjs`, `browser.mjs`, `profile.mjs`, `compare.mjs`, `references.mjs`. Tests: `tests/p1-playable.test.js`.

Only existing shared production module changed: `src/track/course.js`, to accept the explicitly versioned prototype marker policy. Legacy courses without that field retain exactly three checkpoints, unchanged normalization/output. New policies validate category/version/count and exact reference-distance fractions. Existing generated course geometry is cloned and adapted; generation algorithm is not changed.

The old workbench and production HTML are retained as a separate entry point. The P1 artifact does not import the durable coordinator, CareerStore or RaceSessionStore. Browser instrumentation observed no storage writes/IndexedDB opens while playing. No production database or save namespace is touched.

## Input and completion boundary

All UI Sign actions call native `issueSign` at resolved tick boundaries, including while paused. Native queue consumption, no-refund cancel, lowering, replacement, format legality and activation semantics are preserved. Session diagnostics retain tick/request order and acceptance; these are in-memory diagnostics, not durable journals. Rendering never controls sub-events, attributes or race outcomes.

The playback scheduler retains simulation-time debt and executes complete native ticks up to a bounded work budget. It never changes dt or skips owed ticks. Pausing stops advancement; stepping advances exactly one tick. Expensive native ticks cannot be interrupted mid-tick.

A stopped viewer is not automatically official. `clearedNativeResult` validates the same native state; unresolved/stalled/error results show blocked diagnostics without inventing DNF/DNS/rewards. Official placements use native finish tolerance/full precision. P1 applies no career consequences, rewards, condition conversions or settlement.

## Presentation and limits

Immutable course boundaries/lane paths are compiled once per prepared race, not per frame. DOM order/HUD/radio updates use a resolved-tick/Sign/status key; camera and canvas drawing remain read-only. Radio displays at most 160 DOM lines and retains at most 200 presentation lines; native event history is preserved. The tactical map is sticky on desktop and pinned on narrow screens.

Graphics are temporary procedural shapes and colors. Final Dark Deco artwork, animation, high-DPI art polish, stable assembly UI and complete championships are deferred. Late Long Rally native digest ticks still produce visible short stalls (see performance report); checkpoint frequency and diagnostics were not changed. Browser-memory observations are not peak/leak proofs. Direct-file Windows acceptance is required before owner acceptance.

## Scope and P2 decisions

No P2 saving/economy, P3 acquired upgrade drafts, P4 run progression, E4 replacement, E5/E6, magical triggers or permanent progression. Experimental presets do not mutate owned assets. Before P2, approve the isolated prototype save boundary and exact between-race service/roster/economy rules. Before P3, approve real upgrade definitions, stacking and balance; P1 values are development tools only.
