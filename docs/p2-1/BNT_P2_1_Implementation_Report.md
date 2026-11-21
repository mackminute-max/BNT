# BNT — P2.1 Player-Facing Race Interface

## Delivery and baseline

Branch: `feat/p2-1-player-race-interface` (local only).

Final runtime: **`4a9e100d5ca068c99465860b94e8667c655443b7`**. Initial UI implementation: `53bdbc10e19d21bfd9ce618e7b4d6d4b7b23b97e`. The final corrective commit re-projects Sign availability after the original comparison tool resets all buttons; native rules and input handlers are unchanged.

Verified development base: `98423e54d6e4789b8cc4d9cb99ea7717572bbb68`, the documentation/evidence-only successor to accepted P2 runtime `ec25d77eea6523edba1cb1920d73c0dc7502b8c3`. Its application source, tests and built artifacts matched that P2 runtime. P1.5 delivery `04df5ef` / protected runtime `5d556f3` remain ancestry. Baseline Node suite passed 674/674 before P2.1 verification.

The working tree initially contained one unrelated untracked owner audit, `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md`; it is preserved and excluded. No merge, push, release, owner-save migration, new dependency, P3/P4, art production or performance optimization campaign occurred.

## Requirement mapping

| Requirement | Delivery | Source |
|---|---|---|
| Compact player-first hierarchy | Dominant close view, dedicated Sign bar immediately below, separate Race Controls, adjacent map/standings and profile/radio columns; responsive stacking | `src/presentation/player/interface.js`, `interface.css` |
| Six desktop Sign buttons in one row | Six equal grid columns above 1200 CSS px; three columns on smaller/tablet layouts, two on narrow phones;48px default target height with content growth for exceptional combined states | `interface.css` |
| Distinct Sign states | Presented Active/Queued, local Selected, Unavailable/Available; text plus existing borders/outline, Native remaining opportunities | `interface.js`, existing P2 card handlers |
| Original acceptance path | Cards only select/focus; existing dropdown and Queue/Cancel/Lower elements moved without cloning; original handlers and command flow remain | Existing buffered app and P2 bootstrap, unmodified source |
| READY / SET / GO! | Existing countdown maps to READY then SET; delayed initial buffer holds SET; GO requires actual presented progress and playing authority; failure/pause/terminal suppress it; per-session cosmetic state resets on restart | `player/model.js`, `interface.js` |
| Driver profile | Existing portrait/fallback; RU identity; explicit missing name/team; Native driver condition and strain independently; existing team-endurance indicator retained and clearly attributed to beasts | `playerProfile`, `interface.js` |
| Future effects | Three neutral reserved slots, no claimed active buffs, modifiers, persistence or mechanics | `interface.js` |
| Contained radio | Fixed270px window, independent scrolling, bottom-follow tolerance24px; reading anchor preserved across append/old-row trimming where retained, Latest button, real unread count, chronological Native transcript | `interface.js`, checked build-time radio hooks |
| Race controls together | Original Start/Pause/Step/Speed/Zoom/Tail/Restart controls grouped in one frame; response/ack details and reduced-motion option retained | `interface.js` |
| Separate Developer Tools | Internal hidden/inert view, bottom navigation, Return button/focus, all original settings/coaching/build/comparison/export/diagnostic controls reachable | `interface.js` |
| Navigation leaves race intact | No prepare/start/pause command on view changes; existing active race continues. Hidden Canvas work is skipped to preserve sizing/camera; Native event consumption and playback remain existing code. Return redraws current presented state | `player/view.js`, `showView` |
| Full-course map / standings | Existing P2 geometry, markers, start/finish/Sign Points and original table/rank sources reused unchanged | Existing `presentation/renderer.js`, original app |
| Accessibility | Dynamic text, six real buttons, selected ARIA state, focus outlines, hidden/inert view isolation, keyboard navigation, live radio and countdown labels; system fonts only | CSS/interface and browser tests |
| E4 companion | Accepted P2 companion, fallback hook, shared assets/renderer and persistence code untouched; no forced player-layout changes; repeated real committed-frame test | Protected source/artifact checks and durable browser harness |
| Offline standalone | New P2.1-only builder embeds existing assets/CSS/main/identical Blob Worker. Accepted P2/P1.5 files not overwritten | `scripts/p2-1/build.mjs` |

## Technical organization

`src/presentation/player/entry.js` imports the existing P2 bootstrap, then the new composition module, then the unchanged P1.5 buffered app. DOM reorganization moves the original nodes and listeners; it does not initialize a second race. Existing preparation still freezes selected settings through the original `prepare` function.

The new builder retains P2's checked immutable render-input seam and view alias. Additional exact-match, fail-closed presentation seams expose the private **read-only playing flag** and bracket the existing radio append operation. They do not modify the buffered app source, Worker protocol, native state, inputs, event order, replay or checkpoint formats. The radio hook replaces unconditional auto-scroll with an explicit reading-position policy; it does not replace the commentary generator or event authority.

`StartSequence` stores only cosmetic flags and a short wall-time GO visibility interval. It never increments a simulation tick, changes a countdown value, calls RNG, starts the Worker or consumes a Sign. READY/SET use native `countdownLeft`; an expired countdown with an empty buffer cannot produce GO. GO is displayed only once actual playback has progressed. Pausing or buffering during GO removes the word without flashing it again on resume. A new session receives a new sequence object.

The existing synchronous/fallback execution path has no P1.5 timed countdown. Its original immediate stepping and playback are preserved: it gets no invented three-second pre-roll, and GO may appear on actual running progress after Start, never on a paused single-step. The full READY/SET/GO sequence is the buffered Worker path. This is an explicit compatibility limit rather than a second invented start authority.

## Native profile contract

`src/prototype/buffered/projection.js` already supplies driver `condition` and `strain`, beast `condition`/`fatigue`, chariot `condition`/`wear`, RU ID, status/control/physical state. It does not supply driver or team names. `src/model/ru.js` bounds native condition/strain but does not make strain a management injury or driver fatigue value.

The panel therefore says **Driver condition**, **Driver strain**, and separately **Team endurance** (existing 100-minus-mean-beast-fatigue view). Missing identity is labeled unavailable. No new Worker fields, save fields, health conversions, buffs or management assumptions are introduced.

## Radio details

The existing generator, event chronology, priority styling and160-visible-message/200-generator-line retention are preserved. Native messages are appended, not rebuilt each frame. When the reader is within 24px of the bottom, new commentary follows the newest entry. Otherwise the first retained visible message and offset anchor the reading position; unread count and Latest provide a return path. This reading anchor is also retained when the Developer Tools view hides the transcript and messages continue arriving.

If an old message ages out of the existing160-message limit, that removed content cannot be preserved as an archive; the numeric scroll position is retained where possible. This milestone does not add historical replay storage or unbounded logs. Restart clears the transcript through the original preparation flow.

## Presentation reference and preservation

Reviewed organizational references were the repository's full-game vision documents (`08_REFERENCE_GAME_VISION_STANDALONE_HTML.md`, `09_REFERENCE_GAMEPLAY_VISION_AND_STRUCTURE.md`) and the existing full management/race UI in `src/ui/index.html`, together with the supplied P2.1 handoff and governing asset guidelines. No separate complete playable-experiment source was used or reconstructed. The new composition uses current P2/Canvas2D, not older rendering code.

Existing P2 artwork remains clearly temporary. No new images/fonts or asset-contract changes were needed. The source changes are additive under `src/presentation/player/`, new build/test harnesses and an additive package script `build:p2-1`. Native/protocol/persistence sources and accepted artifacts remain unchanged.

## Review disposition

See `BNT_P2_1_Test_Evidence.md` for actual exits, regressions, checksums and bounded performance results. See `BNT_P2_1_Owner_Playtest_Guide.md` for Windows offline and layout checks. Managed direct-file access remains blocked; owner acceptance of the new P2.1 artifact is pending. The legacy P1.1 browser test still expects an obsolete zoom6 default; P2.1 preserves accepted P2 zoom8 rather than altering a reference to conceal that failure.

Stop after local delivery. No P3/P4 or remote publication is authorized.
