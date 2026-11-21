# BNT — P2.2 Full-Screen Race Interface

## Revision and scope

Local branch: `feat/p2-2-fullscreen-race-layout`.

Runtime: **`c235bf3ce0caed44a472cb0abd92104112f39586`**.

Verified base: `ab9c5c52d07bcd023fecc24f69035732c2f7db12`, a documentation/evidence-only successor to P2.1 final runtime `4a9e100d5ca068c99465860b94e8667c655443b7`. Its source/tests/artifacts matched that runtime. Accepted P2 `ec25d77` and protected P1.5 `5d556f3` remain ancestry. Baseline Node suite:694/694 passed before final verification.

The pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` is preserved and excluded. No merge, push, release, owner-save access/migration, dependency, artwork, font, gameplay, management or performance-architecture change is included.

## Delivered layout

The desktop layout uses a 2:1 primary/supporting grid. Within the left column, Main Race View and a bounded 140–180px standings strip share the top row. Strategy Signs span that column immediately below, followed by a horizontal Driver & Team Profile. The right column contains Tactical Map, fixed-height Race Radio, then simplified Race Controls.

At 1920×1080, the measured page height is 1080px and the controls end near 1005px, so the default interface does not require page scrolling. At 2560×1440, both columns scale across the available width. At 1366×768 scrolling is permitted; at 1024px the columns stack, and at 390px standings move directly below the viewport in the same logical section. All target layouts pass no-horizontal-overflow tests.

The P2 responsive Canvas contract is retained: CSS determines the available viewport and the existing Canvas helper derives matching logical/backing dimensions. This is not a stretched fixed1000×550 bitmap. The approved narrower main-view width changes visible world extent naturally; geometry, camera, zoom, uniform world scale and interpolation are unchanged. Browser tests verify equal X/Y scale, correct DPR sizing, camera continuity and the map's full-course fit. The map keeps its640:400 display ratio.

## Requirement-to-code mapping

| Requirement | Implementation |
|---|---|
| Two desktop columns and internal race/standings row | `src/presentation/fullscreen/interface.js`, `interface.css` |
| Position + organizational stable name only | `standings.js` projects original Native standings; `model.js` resolves explicit organization metadata |
| No new ranking algorithm or future positions | Exact row order/position strings copied after the original standings DOM update; no reads of Worker-head positions |
| Unknown/long names | Explicit neutral fallback; ellipsis and full title/ARIA label for supplied long organization names; player diamond/highlight and accessible RU identity |
| Six Signs across left column | Existing cards and original Queue/Cancel/Lower elements moved intact; P2.1 final availability correction reused unchanged |
| Horizontal profile below Signs | Existing portrait, identity, condition, strain, beast-derived team endurance, current status and three reserved effects grouped into four responsive regions |
| Right-side map/radio/controls | Existing panels moved without cloning; map key/help retained in Developer Tools; radio footer compacted without changing handlers |
| Exactly three player control inputs | Original Start/Resume button, Pause button and Follow Zoom range; no parallel start mechanism |
| Diagnostic control preservation | Original Step, Speed, Tail and Restart plus response/acknowledgment, reduced-motion and explanatory controls moved to `#advancedPlayback` in Developer Tools |
| Correct control feedback | Read-only playback-state labels; running/pending/terminal starts disabled while preserving original Native eligibility; failed Worker reason shown without claiming the Worker is still running |
| P2.1 behavior/navigation | Existing internal hidden/inert views, focus handling, countdown, card handlers, radio anchor/latest/unread logic and hidden-view renderer reused unchanged |
| Separate offline build | `scripts/p2-2/build.mjs`, additive `build:p2-2`; unique HTML/artifact report; identical embedded Native Worker |

## Standings identity and authority

Current P1.5/P2.1 race setup and Worker projection do **not** supply stable organization names. `src/prototype/session.js:raceSetup` produces Native entrants from default RUs; `src/model/ru.js:defaultRU` contains numeric components/equipment, not a named stable registry. `src/prototype/buffered/projection.js:frameView` supplies IDs, position/progress and condition rather than organizational names. The standalone race app does not load owner career/roster storage.

P2.2 therefore displays **Stable name unavailable** for the current generated field. It does not hardcode the illustrative roster, call RU IDs stable names, borrow driver/beast names or infer a stable from unrelated career data.

For legitimately available race-entry metadata, the read-only helper accepts explicit `stableName`, `teamName`, `stable.name`, `team.name` and explicit RU organization fields. Entries are matched by RU/entrant ID, never standings-array index. Generic entry/driver/beast names are ignored. Conflicting identity metadata stays unavailable. There is no naming editor, new naming system, save field or protocol field.

The original full Native standings table remains in Developer Tools. A narrowly checked build-time hook runs after the original app updates that table. `paintCompactStandings` copies its current order and position strings, including Native ties/nonfinishers, then resolves labels. It never sorts by progress, time, name or status. The compact table has exactly two cells per row; full names and RU identity are available to assistive labels/tooltips. Reused row nodes retain identity through order changes. A real test holds the presented countdown at tick0 while Worker head is ahead and verifies compact rows/tick match the presented original table only.

## Protected architecture

P2.2 entry imports the accepted P2.1 player entry once, then rearranges its existing nodes. It does not instantiate another engine. The new builder retains all P2.1 checked UI seams and adds one fail-closed, optional post-DOM projection call. Original buffered-app source remains unchanged. The hook supplies no simulation command or game-state mutation.

The same shared renderer, Native geometry, Canvas/DPR helpers, P2 assets/parser/caches, Worker/protocol, replay/checkpoint schemas, AI/combat/condition/weather, career state and persistence modules are unchanged. The accepted E4 companion is untouched and remains a separate developer proof, with its committed-frame behavior reverified on disposable synthetic data. No owner saves are read/migrated.

P2.1 countdown and radio logic are imported as-is. GO still requires actual presented playback; slow initial buffers hold SET. Driver condition and strain remain distinct from management injury and beast fatigue. Existing transcript retention and semantic event sources remain intact. New effects slots remain empty/reserved, not buffs.

## Files added/changed

- New `src/presentation/fullscreen/entry.js`, `interface.js`, `interface.css`, `model.js`, `standings.js`.
- New `tests/p2-2.test.js` and focused/adapted `scripts/p2-2/` build/regression tools.
- `package.json`: additive `build:p2-2` script only; no dependency changes.
- New `dist/Blood-and-Thunder-P2.2-Playable.html` and `dist/BNT-P2.2-Asset-Build.json`.
- New `docs/p2-2/` implementation/evidence/playtest documentation.

No accepted P2/P2.1 output is overwritten. Exact hashes, measured results and raw process exits are in `BNT_P2_2_Test_Evidence.md`.

## Limits and review gate

Real stable names require legitimate organizational metadata from an approved future roster integration; this milestone supplies only the read-only display/fallback. Names used in synthetic UI tests are fixtures, not new game content. The synchronous fallback still has immediate Native stepping rather than an invented timed Worker countdown. Windows direct-file/offline acceptance and subjective layout/readability remain owner checks. Inherited Long Rally cross-runtime mismatch, legacy zoom assertion and occasional Native hitches are not concealed or redesigned.

Stop after local delivery. No P3/P4, remote publication or management development is authorized.
