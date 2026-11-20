# BNT — P1.2 Validation and Delivery

Branch: `feat/p1-2-competitive-feedback`. Source baseline `74d7e73458fc01abc43cfb8f193832c04a3b3b9b`; P1.1 runtime `fce3ae7e87ba4a6c3b0877431c6c890fe5ee0287` verified in ancestry. Gameplay commit `c5b2206`; viewer/runtime commit `200a907e04ea386abb6c52c821a1b641c061c6fb`; current source HEAD `53a0e4b122010ce44fee820a4b66e80cab060169` (includes measurement-only follow-ups). A later documentation commit changes reports/evidence only.

The working tree initially contained only the pre-existing untracked M2-E readiness document; it remains untouched and uncommitted. No protected branch, production career, database, migration, accepted reference or original production HTML was changed. No dependencies added. No merge, push, deployment or P2 work.

## Actual commands and exits

| Command | Result | Exit |
|---|---|---:|
| `node --test tests/p1-playable.test.js tests/p1-1.test.js` on baseline | 44 passed, zero failed | 0 |
| `node scripts/p1-2/competitive.mjs` | 20 P1.1 baseline races, all Ended/cleared | 0 |
| `BNT_P12_STAGE=candidate BNT_P12_PACING=competitive node scripts/p1-2/competitive.mjs` | 20 P1.2 candidate races, all Ended/cleared | 0 |
| `node scripts/p1-2/endurance-race.mjs` | Eight native multi-RU overexertion diagnostics completed | 0 |
| `node scripts/p1-2/sign-check.mjs` | 16 matched native four-RU Sign-response races | 0 |
| `node scripts/p1-2/contact-check.mjs` | Ten native 10-second defensive observations over five seeds; no winner assertions | 0 |
| `node scripts/p1-2/verify.mjs` | Six exact full-race repeats matched, including unchanged P1.1 baseline under new code | 0 |
| `node --test tests/p1-2.test.js tests/p1-1.test.js tests/p1-playable.test.js` | Initial integration 53 passed, zero failed | 0 |
| `npm test` | **578 passed, zero failed**, 360.98 seconds; all existing tests retained | 0 |
| `node --test tests/p1-2.test.js` final feedback guards | Nine passed, zero failed | 0 |
| `node scripts/p1-2/browser.mjs` | Six functional Chromium groups passed; real native hit/damage and honest seeking status | 0 |
| `BNT_P1_OUT=... node scripts/p1/browser.mjs` | Eight retained P1 functional groups passed | 0 |
| `BNT_P11_OUT=... node scripts/p1-1/browser.mjs` | Five retained P1.1 functional groups passed | 0 |
| `BNT_P1_OUT=... node scripts/p1/references.mjs` | 12 historical references and two payroll references matched | 0 |
| `BNT_P12_HTML=.../baseline.html BNT_P12_STAGE=baseline node scripts/p1-2/frame-profile.mjs` | Nine phase-aligned before windows, 1×/2×/4× | 0 |
| `BNT_P12_STAGE=candidate node scripts/p1-2/frame-profile.mjs` | Nine after windows on frozen P1.1 simulation inputs | 0 |
| `node scripts/p1/build.mjs` | Self-contained HTML, external-dependency guard passed | 0 |
| `node --check scripts/p1-2/competitive.mjs` | Provenance-only harness change parses | 0 |
| `git diff --check` | No whitespace errors | 0 |

Full Node coverage was run with the final native configuration/model/AI and gameplay settings. Follow-up presentation-only guards for retired actors/pre-activation attacks were verified by focused and browser checks; the read-only debt getter was exercised by final frame profiling. Native/AI code did not change after the full run. Specialist E4 browser runners were not rerun; native historical checks and the complete Node suite cover the unchanged paths. Do not interpret these scoped browser results as every historical runner passing.

## Reproducibility and compatibility

Historical native reference records were verified without writing goldens; payroll Pure `ad509187` and Combat `f191ca35`. P1.1 full-race baseline repeats: Oval `0f553f9a`, C01 `f943fdf3`, Long Rally `aa6f3a3f`. Corresponding P1.2 repeats matched their new explicit-policy checksums. There is no requirement that different approved tuning produces old outcomes. No accepted checksum was silently updated.

Optional exhaustion/urgency keys are absent from historical default objects and do no new arithmetic/utility work when absent. P1.1 `pacing:'endurance'` remains available; native `legacy` is retained. New P1.2 setups serialize explicit settings and require a compatible build; older validators may reject unknown optional settings rather than reinterpret them. Existing production persistence contracts/financial authority are unchanged.

## Changed source inventory

- Optional native hooks/validation: `src/model/ru.js`, `src/config/config.js`, `src/ai/driver.js`, `src/ai/weights.js`, new `src/ai/finish-utility.js`.
- Prototype policy/UI: `src/prototype/pacing.js`, `session.js`, `app.js`, `view.js`, `index.html`, new `interactions.js`.
- Diagnostics: new `scripts/p1-2/{fixtures,competitive,endurance-race,contact-check,sign-check,verify,frame-profile,browser}.mjs`.
- Tests: new `tests/p1-2.test.js`; no existing tests modified or removed.
- Build: updated only `dist/Blood-and-Thunder-P1-Playable.html`; existing build pipeline reused unchanged.

## Evidence limitations and corrections

The first frame-profiling calibration included setup/warm-up in its first frame interval. It was rejected as an explanation of gameplay jerkiness, retained under a clearly named warm-up-contaminated filename, and replaced by phase-aligned windows after two rendered warm-up frames. The final phase ensures a digest boundary is included at 1× as well. Earlier provisional profile files are retained separately, not represented as final acceptance data.

Competitive JSON initially used a generic source field for the baseline reference. Before delivery this was clarified into baseline versus execution/runtime-equivalent provenance, retaining the original metadata files and hashes. Numerical results were not altered. The script now records execution HEAD/working-tree state automatically.

No outstanding Node/functional UI failure remains in the executed scope. This does not mean every balance goal is conclusively solved: ordinary winner counts are unchanged, speed remains strong and contact has no matrix race wins. A targeted contact check shows defensive value, not general racing dominance. More seeds/grid rotations and owner playtesting remain appropriate.

## Browser, performance and file limits

Node 24.22.1, Chromium 156.0.8078.79, managed Linux. Offline interactions after loading passed with no page errors/runtime asset requests. Direct file navigation is blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`; no Windows Chrome/Edge acceptance is claimed. No server is required by the artifact.

Native periodic digest work remains enabled and is the principal observed long-frame source. UI submission work was reduced, but worst frame times remain mixed and no universal 60 FPS claim is made. See the performance report. Native dt, RNG, event order and race outcomes for fixed legacy input are not sacrificed for smoothness. No mid-race durable persistence was added; P1 still has no career saving.

## Artifact and owner instructions

Build command: `node scripts/p1/build.mjs`.

Source artifact: `dist/Blood-and-Thunder-P1-Playable.html` (header P1.2). Delivery copy: **Blood-and-Thunder-P1.2-Playable.html**. Size **200,297 bytes**; SHA-256 **`5a203c1f488d22640e1f9695ae46fe4f5c328cb0c4ef97abf6f36f141ee4ed18`**. Original production aliases retain 1,047,085 bytes and SHA-256 `8a9b73409a84517f2b0c72c265499434afcf14d94037a645bec553a6b1cba9a3`.

1. Download the P1.2 HTML, disconnect networking, and open it directly from disk in current Windows Chrome and Edge. No Node, npm, assets or local server needed. Optional PowerShell check: `Get-FileHash .\Blood-and-Thunder-P1.2-Playable.html -Algorithm SHA256`.
2. Prepare Oval, C01 and Short/Long Rally cases, Pure and Combat, with fixed seeds. Watch the gauge and native pace; compare early versus late Push under the existing queued Sign boundaries. Three uses, cancellation/no-refund and Rally fractions are unchanged.
3. Solo Combat: queue Engage Rivals before start and step. It should activate but show **Seeking Opportunity**, with no invented hit. In a multi-RU Combat field, look for actual HIT/DEFENDED/RESISTED/CONTACT/damage labels and matching radio events. Incoming hits must not become a claimed player attack.
4. Pause after an interaction, step, resume at 1×/2×/4×, then restart. Effects should freeze/prioritize new stepped events and reset without stale replay. Extreme bursts may be summarized; complete native event history remains.
5. Check follow zoom/terrain/map/standings and open diagnostics on demand. On circuits note any digest-associated hitch and record speed/native tick/browser version rather than assuming the track art caused it.
6. Export current race metrics when reporting an issue. Include artifact hash, browser/version, seed, course, field/laps, format/weather, selected build/coaching and tick-ordered Sign inputs. A seed alone is not sufficient to reproduce a race. No permanent progression/rewards are credited.

## Review disposition

P1.2 is delivered for owner review with explicit balance/performance limitations and pending Windows direct-file testing. Native competitive consequences, multiple viable specialties, authoritative interaction feedback and scoped UI overhead improvements are demonstrated; no rubber-banding, scripted results or new combat system. Stop before P2 and do not merge/push without further approval.
