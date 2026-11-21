# BNT — P2 In-Race Presentation / Static Visual Proof

## Scope and baseline

Local branch: `feat/p2-static-visual-proof`. P1.5 delivery base: `04df5efba874b5889bb1c8e8e6920918c8df00e1`; protected P1.5 runtime: `5d556f3adca146a6c17996234e34dcf4e98899db`. The supplied P2 handoff and corrected **BNT In-Race Presentation & Asset Guidelines v1** govern this proof. No P3/P4 work, merge, push, publishing, owner-save migration or new runtime dependencies is included.

Runtime commit: **`ec25d77eea6523edba1cb1920d73c0dc7502b8c3`**. Final evidence is recorded in the accompanying test report. This document describes implemented behavior, not owner visual acceptance.

## Requirement mapping

| Requirement | Status | Implementation / disposition |
|---|---|---|
| True orthographic close-follow, north/up | Implemented | `presentation/geometry.js`, `renderer.js`: native `point`/tangent; fixed world orientation, bounded native-clock smoothing/look-ahead and player-centered lag cap. No tilt/perspective or camera rotation. |
| Native road/lane/surface geometry | Implemented | `sampleCourse` samples native geometry including open-route grid/exit. Both viewers share the same pure transforms and bounded path cache. This is a rendering approximation, never collision authority. |
| Full-course map | Implemented | Separate cached fit-to-course map, every entrant, distinct player diamond/outline, start/finish and existing rally Sign Points. It never follows/crops to the player. |
| Chronological buffered presentation | Implemented | P2 receives one immutable per-render tuple: presented base state for HUD, safe coordinate-interpolated state for spatial graphics, same presented tick. No Worker-head result/event leakage. |
| Existing P1.5 controls and protocol | Reused unchanged | Embedded Worker bytes identical to P1.5. Original native input, countdown, credit, underrun, pause/tail/step, restart and failure handlers retained. Sign cards select the existing dropdown; the original Queue button performs acceptance. |
| Radio, standings and condition | Implemented | Existing chronological radio and standings moved into readable columns; player highlight, condition/exertion details and bottom endurance panel retained. Combat priority styling is cosmetic and uses existing text, not a new event authority. |
| Sign states | Implemented | Six text-labeled selection cards show presented Available/Queued/Active/Unavailable states. Separate Worker acknowledgment can say presentation pending. No new refunds, opportunities, cancellation semantics or activation boundaries. |
| Shared durable viewer | Implemented | Optional `mountDurableChampionships` presentation hook, enabled only in isolated P2 companion. Uses `ui.view.frame` after existing durable acknowledgment. No interpolation toward prepared Worker head. Original fallback renderer remains when hook is absent. |
| Manifest and validation | Implemented | `contracts.js`, `scripts/p2/assets.mjs`, `svg.mjs`; strict versions, stable IDs, hashes, dimensions, anchors, frame bounds, fallbacks, attribution and actual byte validation. |
| Original proof kit | Fallback / implemented | Static two-beast RU PNG, livery mask, portrait PNG, emblem/compact mark, corner SVG and two architecture silhouettes. All labeled temporary; not approved final art, teams, characters or production fonts. |
| Other legal beast compositions | Fallback | Native one-to-eight beast legality unchanged. Compositions other than two use numbered markers; too-small sprites also reduce to markers. No collision/footprint change. |
| Safe SVG | Implemented | Restricted XML parser/stack plus geometry grammar and budgets. No executable or external content, entities, fonts, filters, SMIL, recursive references or arbitrary user SVG import. |
| Decode/tint/cache | Implemented | Async load/decode timeout/failure paths, bounded image/composite caches; palette prewarm outside actor drawing; recolor dedicated livery mask only. Road tiles/map surfaces dispose on eviction. |
| DPI/resizing/pointer | Implemented | CSS-content sizing, fractional DPR with cap 2, backing/logical separation, uniform orthographic scaling and matching inverse pointer mapping. CSS zoom tested separately from untested browser toolbar zoom. |
| Accessibility/reduced motion | Implemented / owner review pending | Dynamic text, system-font fallback, visible keyboard focus, labels and shape/number identification. Reduced motion removes camera smoothing/effect growth. Subjective legibility and final contrast/art approval remain owner checks. |
| Single-file build | Implemented | `npm run build:p2`; all assets/CSS/main/Blob Worker embedded. Primary playable file and isolated E4 companion aliases; no runtime server/resources. Windows direct-file acceptance remains pending. |
| Animation/catalog/final fonts | Deferred | No new animation system or eight-direction catalog. No supplied approved WOFF2/license; no unapproved font dependency. |

Paths in this table are under `src/` unless explicitly prefixed `scripts/`.

## Integration design

The primary entry imports `presentation/bootstrap.js` followed by the unchanged buffered app. At build time, a narrow view-module alias supplies `presentation/view.js`. A checked, exact-match render-projection seam replaces only the buffered app's initial render inputs with the frozen P2 tuple. The source file and native/control code are not changed. The build fails if that upstream seam stops matching.

`RacePresenter` owns camera and visual caches. Native progress is converted with the existing track implementation. All road, actor, map and inverse pointer transforms share this coordinate system. Main view artwork rotates to the native tangent; its art anchor is independent of collision geometry. Labels/colors are local deterministic presentation identities, not nation/team gameplay records. Custom opaque IDs receive stable sorted display numbers; full IDs remain in native state and diagnostics.

Static road work uses 512-backing-pixel tiles, not an unbounded whole-rally bitmap. Map roads are cached separately. Bounded estimates: geometry 4 MiB/4 entries; world tiles 28 MiB/32; maps 4 MiB/2; decoded images 8 MiB/24; livery composites 4 MiB/16. Total budgets are 48 MiB of estimated cached surfaces, excluding transient decode, browser/GPU overhead and native Worker/history memory. No guarantee about total memory is implied.

The durable companion imports the optional presentation hook before the original management app. Both close view and map receive only the existing committed frame. While a durable operation is pending or failed, they hold that frame. Asset callbacks redraw the latest committed frame and never execute simulation. The E4 frame does not supply full combat/hazard events; the companion does not manufacture those graphics.

## Artwork and production boundary

Editable masters and a license ledger are under `art-source/`; runtime payloads and manifest are under `assets/`. RU source is 512×256, runtime 128×64, +X facing, anchor (40,32); portrait source 512²/runtime 256²/display 64 CSS px. Detailed anchors, SVG restrictions, cache limits and generation steps are in `ASSET_CONTRACT.md`. All proof artwork is original geometric temporary work under the included internal-review notice. Public release licensing/final branding requires owner review; no third-party character/logo reproduction or font download is involved.

## Files and build isolation

- New `src/presentation/`: geometry, Canvas/DPR, identity, bounded cache, asset library/contracts, renderer, buffered adapter/bootstrap/template/CSS, durable adapter and entry.
- New `scripts/p2/`: asset validation/generation, standalone builder and reproducible Node/browser/performance harnesses.
- New `assets/` and `art-source/`: proof manifest, runtime PNG/SVG, editable masters and attribution.
- New `tests/p2.test.js`, `docs/p2/` and isolated P2 artifacts.
- Existing `package.json`: additive `build:p2` command; dependency inventory unchanged.
- Existing `src/ui/durable-championships.js`: optional visual hook only; original rendering path retained when hook is absent.

No native simulation, AI, track generation, replay, career reducers, checkpoint schema, persistence Worker/backend or P1.5 protocol source was changed. Previously accepted standalone artifacts remain untouched. A pre-existing untracked M2-E audit document is preserved and excluded from P2 commits.

## Review disposition

Functional evidence and remaining test limitations are in `BNT_P2_Test_Evidence.md`. Windows direct-file behavior, browser toolbar zoom, final visual readability and final artwork remain owner checks. The E4 companion is a developer visual proof, not a new management release; it retains existing storage semantics and should only be exercised with disposable test data. P3/P4 and any remote publication require separate authorization.
