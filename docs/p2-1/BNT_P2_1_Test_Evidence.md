# BNT — P2.1 Test Evidence

## Tested revision and environment

Final runtime: **`4a9e100d5ca068c99465860b94e8667c655443b7`**, branch `feat/p2-1-player-race-interface`. Verified base `98423e5` has the same application tree as accepted P2 runtime `ec25d77`; it adds documentation/evidence only. Reports and supplementary harnesses follow in a separate local documentation/evidence commit. No remote actions.

Node24.22.1; Linux x64; managed Chromium156.0.8078.79; existing esbuild0.28.2/Playwright-core1.65.1. No dependencies installed/updated. No lint/typecheck script is configured. Original P2/P1.5/normal production outputs were not overwritten.

## Executed commands and raw exits

Run from repository root. Logs/JSON/screenshots are under `docs/p2-1/evidence/`, mirrored in `/workspace/deliverables/bnt-p2-1/evidence/`. The machine-readable ledger is `commands-and-exits.json`.

| Command | Exit | Actual result |
|---|---:|---|
| `npm test` (verified P2 baseline) | **0** | 674/674;325082.734472ms |
| `node --test tests/p2-1.test.js` | **0** | 20/20 UI projection/start-sequence tests |
| `npm test` (initial 53bdbc1) | **0** | 694/694;369443.579834ms |
| `npm test` (final4a9e100) | **0** | 694/694;394738.5636ms |
| `node scripts/p2-1/references.mjs` | **0** | 12 historical +2 payroll checksums |
| `node scripts/p2-1/native-equivalence.mjs` | **0** | 6 complete native Worker/reference races |
| `node scripts/p2-1/checkpoint-compat.mjs` | **0** | 18 byte-identical checkpoint wires and restored continuations |
| `node scripts/p2-1/browser-native.mjs` | **0** | 100 clock states,3 complete captures,delayed Sign replay/checkpoint |
| `node scripts/p2-1/smoke.mjs` | **0** | 4 widths;6-card desktop row;no horizontal overflow |
| `node scripts/p2-1/interface-browser.mjs` | **0** | 9 functional groups with real Worker/native commentary |
| `node scripts/p2-1/keyboard.mjs` | **0** | 2 keyboard/focus/native Queue groups |
| `node scripts/p2-1/browser-faults.mjs` | **0** | 6 fault/offline/restart/delayed-Sign groups;file navigation blocked separately |
| `node scripts/p2-1/assets-browser.mjs` | **0** | 15 DPR/CSS zoom cases +mask/fallback/cache groups |
| `node scripts/p2-1/geometry-browser.mjs` | **0** | 20 shared geometry/DPR cases |
| `node scripts/p2-1/durable-browser.mjs` | **0** | 5 DPR cases;4 real durable-authority groups on unchanged accepted companion |
| `node scripts/p2-1/art-parity-fast.mjs` | **0** | 12 full Worker races;classifications and complete replay-export hashes match |
| `node scripts/p2-1/legacy-browser-compat.mjs` | **1** | P1,P1.2,P1.3 child exits0;P1.1 exit1 at old zoom6 assertion |
| `node scripts/p2-1/build-verify.mjs` | **0** | reproducible build,identical Worker,protected source/artifacts unchanged |
| `node scripts/p2-1/performance.mjs` | **0** | 12 bounded sequential4x windows;no page/session errors |

The final frozen-revision Node suite passes **694/694**, zero failures/cancellations/skips. This includes all 674 previous tests plus 20 new UI-model tests. Existing tests and golden references were not changed.

## New UI behavior evidence

The final standalone HTML, real embedded Worker and original handlers are exercised by `interface-browser.mjs`; these are not only isolated scoring/model tests.

- Default race view and one instance of every original diagnostic input/control ID. Developer controls are moved, not cloned. Start/Pause/Step/Speed/Zoom/Tail/Restart share one Race Controls frame; the six Sign cards remain separate.
- Paused internal navigation preserves session object, generation, tick and Worker-construction count. Active offline navigation preserves the running session without implicit pause/preparation; the displayed main/map tick matches the current presentation on return.
- Repeated explicit Prepare through Developer Tools reproduces identical settings/setup. Course C01, Combat, field4 and seed515 are applied through the original handler.
- Driver condition and strain equal the presented native fields; missing names stay unavailable; reserved effect slots are exactly three neutral dashes. Failed portrait decode shows the original fallback rather than fabricated character information.
- Selecting Conserve by pointer or keyboard spends nothing. Only the original Queue action accepts one command/spends one use. Existing delayed acknowledgments, native activation boundaries, pause/tail/step, reset/abandon-generation and Worker failure behavior pass.
- A real Worker run request is held by the test harness past countdown expiry. READY then SET appear; presented tick remains0 and GO is absent. Releasing the original run packet yields GO only with presented tick>0, positive presentation clock and playing phase. Pause removes GO; pre-start pause preserves the actual countdown value; restart creates a clean sequence. No new protocol packet is introduced by the test or application.
- The original comparison tool globally re-enables buttons after its controlled pair. A corrective UI projection restores Native Pure/remaining/status eligibility instead of trusting stale DOM. An actual native controlled comparison now verifies Pure Engage remains Unavailable afterward; no new acceptance rule is introduced.
- Reduced-motion mode displays the same words without animations. The synchronous fallback has no existing timed countdown: immediate native stepping remains intact and no timed READY/SET delay is invented. GO requires actual running progress after Start, not a paused step.
- The real native commentary feed is loaded from a normal C01 checkpoint and advanced using the native engine. A 270px transcript retains its visible message/offset while new real messages arrive, including while tools are open. Latest restores bottom-following; later messages autoscroll only when pinned. Timestamps remain monotonic. Restart clears the existing bounded transcript.
- Keyboard Enter opens Developer Tools, Tab reaches Return with a3px focus outline, and Enter returns focus to the bottom navigation. Keyboard Sign selection focuses Queue without spending; Enter on Queue produces exactly one native acceptance.

Responsive smoke tests verify widths1440/1024/768/390, no horizontal overflow, and one desktop row of six Sign buttons aligned directly below the race column. At narrower widths cards wrap. Emulated DPR1/1.25/1.5/2/3 and CSS zoom1/1.25/2 preserve shared pointer/backing geometry. These do not establish Windows display scaling or browser toolbar zoom.

## Deterministic integrity

Four variants per course—frozen P1.5 Worker reference, P2.1 art on, art off and forced decode failures—complete actual native races with the same queued tick0 input. Full classifications, tick counts, checksums and complete replay JSON hashes match. Accelerated test-driven presentation/credit is not a new player control or a timing benchmark.

| Course (Combat8) | Ticks | Chromium checksum | Complete replay-export SHA-256 |
|---|---:|---|---|
| oval | 1841 | `7b871ef5` | `aef89ec1ccc2ae3c1f7b4128e17d841b6fdf7a24341b35272928cb10b4bd4764` |
| C01 | 3260 | `51624d65` | `da98d75fa7adc0769a908224d9f36b2a842b47c602e18b232676e119265409f3` |
| rally-long | 4544 | `c5095aaa` | `583350666e278fa62d2f28e85cb7641a6d761ad38336d40968a794f065fae304` |

Separately, six native Worker/reference full-race captures and18 legacy checkpoint files/restored continuations matched. The100-seed versioned championship-clock comparison, three cross-runtime full native captures and delayed-Sign replay/checkpoint also passed.

| Historical kind | File | Expected = actual |
|---|---|---|
| historical | `replay-reference-Pure-oval.json.gz` | `fe1bfab8` |
| historical | `replay-reference-Pure-C01.json.gz` | `1e9d7e68` |
| historical | `replay-reference-Pure-mixed-rally.json.gz` | `d13a8fdf` |
| historical | `replay-reference-Combat-oval.json.gz` | `79dec048` |
| historical | `replay-reference-Combat-C01.json.gz` | `cd29b4b3` |
| historical | `replay-reference-Combat-mixed-rally.json.gz` | `38fdb4e1` |
| historical | `replay-autonomous-Pure-oval.json.gz` | `821eca67` |
| historical | `replay-autonomous-Pure-C01.json.gz` | `c1730efa` |
| historical | `replay-autonomous-Pure-mixed-rally.json.gz` | `4120f7c5` |
| historical | `replay-autonomous-Combat-oval.json.gz` | `c8fd3ca0` |
| historical | `replay-autonomous-Combat-C01.json.gz` | `3ef47ff6` |
| historical | `replay-autonomous-Combat-mixed-rally.json.gz` | `fd015e71` |
| payroll | `payroll-Pure.json.gz` | `ad509187` |
| payroll | `payroll-Combat.json.gz` | `f191ca35` |

The embedded race Worker remains byte-identical to accepted P2: SHA-256 **`6e30c8cb43110f294c94cc3b02d58a841644a9efe9aefebb88c72925e9be99b8`**. Protected native/AI/track/replay/career/persistence/prototype sources, P2 renderer/assets/contracts/durable adapter and original UI have no source diff from98423e5. P2.1 build-time changes affect only UI projection/context and radio scroll behavior.

The inherited tactical seed145 Long Rally Node/Chromium discrepancy is unchanged: Node`2c2d30ab`, Chromium`c5095aaa`. No physics/rounding/reference was changed to conceal it; current supported-runtime comparisons pass. Existing periodic Worker/digest spikes are not redesigned in this milestone.

## E4 compatibility

The accepted P2 durable companion remains unchanged. Its real UI/coordinator harness uses a **disposable synthetic test career in fresh contexts**, not owner data. Delaying an actual backend commit leaves both views at committed tick0 while prepared tick25 exists. Acknowledgment advances both to25; artwork toggles change no durable records; injected quota failure retains the committed frame/records. Five DPR contexts and four authority groups passed. No production migration, schema or persistence code was changed.

## Bounded performance regression check

Exactly12 sequential1.6-second windows: C01 Combat8 and Long Rally Combat8, early/middle/late checkpoints,4× playback, accepted P2 versus P2.1. Native setup/prebuffer excluded from playback windows and separately recorded. Same viewport1440×1000, same initial checkpoints, no concurrent verification jobs. No optimization campaign, precision change or golden update.

| Variant | Median / worst window main-draw p95 ms | Worst draw ms | Frame p99 ms | Frames >50ms | Long tasks | Underruns |
|---|---:|---:|---:|---:|---:|---:|
| reference | 2.10 / 2.90 | 17.70 | 16.80 | 0 | 1 | 0 |
| candidate | 1.90 / 3.10 | 5.20 | 16.80 | 0 | 0 | 0 |

Final-corrective-source measurements show no demonstrable new processing-stall regression. P2.1 worst per-window main-draw p95 was 3.1 ms versus 2.9 ms reference; worst DOM p95 was 1.8 ms versus 1.2 ms. Both remain small compared with the prior provisional 8 ms draw budget. Candidate had no long tasks or underruns in these windows; reference recorded one 56 ms long task. Approximate maximum page-reported heap was 75,223,363 bytes candidate versus 81,294,467 reference. The initial 53bdbc1 measurements are preserved separately, not substituted for final-source evidence.

These short, single-observation-per-cell checks do not establish a sustained memory bound, prove every race hitch-free or replace owner judgment. Shared-host load, private Worker/GPU memory and Windows performance are not controlled/measured separately. No performance redesign was initiated.

## Standalone artifacts

All existing proof images, styles, JavaScript and Blob Worker are embedded. Build resource validation rejects external runtime references. Managed offline interaction, navigation, countdown and Worker continuation pass. The P2.1 builder does not rewrite accepted P2/P1.5 files.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `dist/Blood-and-Thunder-P2.1-Playable.html` | 554,672 | `90bf1652ca2a63726476d93ee15163efb530b08e38d9a2cec9195450bc4d9e9f` |

Two consecutive builds match. Accepted P2 playable/companion/alias and P1.5 hashes also match their98423e5 Git contents; exact hashes are in `build-verification.json`. The original normal `npm run build` was not run to overwrite its accepted outputs; use the new `npm run build:p2-1`.

Direct `file://` navigation was attempted against the new HTML and rejected by managed Chromium policy with **ERR_BLOCKED_BY_ADMINISTRATOR**. The browser fault runner still exits0 because this environmental limit is reported separately. Windows Chrome/Edge direct-file/offline operation remains owner acceptance, not a passing managed test.

## Nonzero results and dispositions

1. **Legacy browser aggregate exits1:** unchanged P1/P1.2/P1.3 assertions pass; P1.1 stops at its expectation of default zoom6. Accepted P2 and P2.1 use8 CSS pixels per world unit, so this is an obsolete presentation default, not required physics/replay behavior. The old test is not edited and no golden is weakened. Its assertions after that failure are not claimed to have run. The compatibility wrapper exposes both internal views and selects sync mode only for legacy selectors; actual default-view navigation is tested separately.
2. **Initial smoke boot timeout:** new layout temporarily detached a container before a later ID lookup. The integration was fixed by attaching the internal views before moving original nodes. Final smoke/interface/keyboard tests pass; no native/persistence fix or assertion weakening was needed. The original failing log is retained.
3. **Final availability correction:** a legacy comparison reset could leave an illegal Pure card visually enabled. Corrected from Native eligibility fields, verified with a full actual controlled-pair UI test, and the entire 694-test suite rerun on 4a9e100. This never made the native Queue rules permissive.
4. **Windows file/toolbar-zoom checks:** unavailable here; explicitly pending owner execution.
5. **Known numerical/hitch issues:** inherited Long Rally cross-runtime difference and occasional Native digest/frame spikes remain outside this UI scope. No new performance optimization was initiated.

## Final disposition

P2.1 functional and deterministic gates PASS in the available environment. The legacy browser aggregate remains explicitly nonzero. Delivery is ready for owner UI review, conditional on Windows direct-file and subjective layout/readability/smoothness acceptance. No final owner acceptance, merge, push or P3/P4 authorization is claimed.
