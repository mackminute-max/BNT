# BNT P1.4 — Implementation and Delivery

## Assessment

**Conditional pass for owner review:** the bounded optimization preserves tested authoritative behavior and materially reduces the priority Circuit/Combat long frames. It does not guarantee sub50ms digests, eliminate every100ms frame, or establish Windows acceptance. A real early Short Rally4× p99 regression remains in the short-window sample. No E4 integration, P2, merge, push, release or deployment occurred.

In one complete ordinary eight-RU C01 Combat4× pair, p99 improves133.4→50.1ms, worst316.7→150.0ms, >100ms frames25→12 and >200ms13→0, with the same native checksum/classification. Across the two-repeat digest-aligned matrix, late C01 Combat4× p99 improves250.0→100.1ms; late Long Rally4×233.4→150.1ms. These are actual managed Chromium observations, not Windows claims or universal guarantees.

## Exact repository baseline and revisions

- Repository: `https://github.com/mackminute-max/BNT.git`.
- Branch: `feat/p1-4-performance-frame-pacing`.
- Verified base: `f17c8bfd3edc6e7708df27c86aa7e371585f41f4`, final P1.3 delivery; accepted runtime43928df and validation1c978ec are ancestors.
- Preliminary experimental commit: `eeaf64c1e3cb001cf786767f9aeb2b81e020f58e`. Its captured-callback browser regression was rejected; it is **not** the delivered runtime.
- Retained runtime/build commit: `34ef7233f1323001d86924f4845f6196b4b066d4`.
- Final validation/documentation commit: recorded in `delivery-manifest.json` and the final handoff, avoiding a self-referential committed hash here. Later changes concern diagnostic fixtures/protocol/reporting only, not the frozen runtime or artifact.

The initial tree had one unrelated untracked file, `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md`; it is preserved outside this work. No dependencies, accepted tests/goldens, production-career modules, storage schemas or old production HTML aliases were modified.

## Changed files and delivered implementation

| Files | Purpose |
|---|---|
| `src/core/determinism.js` | Add exact canonical integer folding and bounded, fully verified property-name shape preparation; original canonical/checksum/hash interfaces remain intact |
| `src/sim/race.js` | Route unchanged snapshot through the equivalent fold at the existing digest call site |
| `src/prototype/app.js`, `session.js`, `index.html` | Identify P1.4 execution/build; P1.3 gameplay policy/version and controls unchanged |
| `tests/p1-4.test.js` | Four new edge/mutation/cache/input/hash and native checkpoint-restoration tests |
| `scripts/p1-4/` | Reproducible native/V8/browser profiling, frame aggregation, full reference equivalence, close-contact proof, accepted tactical references and complete4× race measurements |
| `scripts/p1-4/experiments/` | Isolated rejected callback/for-of implementations for reproducible comparison; not imported by the game |
| `dist/Blood-and-Thunder-P1-Playable.html` | Self-contained optimized prototype |
| `docs/p1-4/` | Five reports, index, compressed raw evidence and logs |

The serializer optimization avoids repeatedly creating large mapped/joined snapshot strings. Key caches contain only names/order and verify every current key; mutable values are always read afresh. Local indexed integer folding preserves historical Unicode/undefined/non-finite/number/key ordering and checksum behavior. There is no mutable-event authority cache, event dropping/coalescing, deferred digest, lower frequency, new worker or new replay format. All physical/AI/condition/Sign/incident logic and existing whole-tick scheduling remain untouched.

## Tests and raw process exits

Environment: Node24.22.1, npm11.9.0, Chromium156.0.8078.79, existing esbuild0.28.2 and playwright-core1.65.1 on managed Linux. No install/update was necessary. Correctness jobs may run concurrently; **performance workloads run sequentially**, with final controlled data replacing pilot overlap. Correctness suite wall time is not used as an isolated throughput benchmark.

| Exact command / invocation | Actual result | Raw exit |
|---|---|---|
| `node --test tests/p1-playable.test.js tests/p1-1.test.js tests/p1-2.test.js tests/p1-3.test.js` before changes | 76/76 passed | 0 |
| Same command plus `tests/p1-4.test.js` on retained runtime | 80/80 passed | 0 |
| `npm test` | **605/605 passed; zero failed/skipped; 376.53s** | 0 |
| `node scripts/p1-4/equivalence.mjs` | Nine full races Ended; six120-tick autonomous traces;718 selected snapshot/event/RNG comparisons;32 checkpoint-wire/restore comparisons | 0 |
| `node scripts/p1-4/combat-equivalence.mjs` final fixtures | Five native boundary scenarios,100 exact per-tick comparisons; hit/ram/defended/invalidated/simultaneous coverage | 0 |
| `BNT_P1_OUT=/workspace/deliverables/bnt-p1-4/evidence node scripts/p1/references.mjs` | 12 historical native +2 payroll checksums match | 0 |
| `BNT_P12_OUT=/workspace/deliverables/bnt-p1-4/evidence/prior-profile-parity node scripts/p1-2/verify.mjs` | Six accepted earlier-profile full-race hashes match | 0 |
| `node scripts/p1-4/tactical-references.mjs` | Three accepted P1.3 full-race hashes/classification/resource trajectories/Sign streams match | 0 |
| `BNT_P14_ROOT=/tmp/bnt-p14-reference BNT_P14_STAGE=baseline node --cpu-prof --cpu-prof-dir=/workspace/deliverables/bnt-p1-4/evidence --cpu-prof-name=baseline.cpuprofile scripts/p1-4/native-profile.mjs` | 18 baseline native states, full component/cold-checkpoint data | 0 |
| `BNT_P14_STAGE=candidate node --cpu-prof --cpu-prof-dir=/workspace/deliverables/bnt-p1-4/evidence --cpu-prof-name=candidate.cpuprofile scripts/p1-4/native-profile.mjs` | 18 retained candidate states; matching checksums | 0 |
| `node scripts/p1-4/cpu-summary.mjs <profile> <output>` for both | Separate sampled native/explicit-work categories | 0 each |
| `node scripts/p1-4/digest-experiment.mjs` (initial variants) | Alternating same-snapshot Node comparisons, exact input/checksum proof | 0 each |
| `node scripts/p1-4/browser-digest-experiment.mjs` | Five implementations, four fixed native states, five samples after three warmups, all checksums match | 0 |
| `BNT_P14_ROOT=/tmp/bnt-p14-reference BNT_P14_STAGE=baseline node scripts/p1-4/browser-profile.mjs` plus final Oval refresh below | Final108 controlled reference observations | 0 each constituent run |
| `BNT_P14_ROOT=/tmp/bnt-p14-reference BNT_P14_STAGE=baseline-oval-final BNT_P14_CASES=oval:Pure,oval:Combat node scripts/p1-4/browser-profile.mjs` | 36 reference observations at refreshed later Oval phases, combined with72 controlled non-Oval observations | 0 |
| `BNT_P14_STAGE=candidate node scripts/p1-4/browser-profile.mjs` retained runtime | 108 controlled candidate observations | 0 |
| `BNT_P14_ROOT=/tmp/bnt-p14-reference BNT_P14_STAGE=baseline node scripts/p1-4/sustained.mjs` | Complete ordinary4× race; native checksum51624d65 | 0 |
| `BNT_P14_STAGE=candidate node scripts/p1-4/sustained.mjs` | Complete ordinary4× race; same checksum/classification | 0 |
| `node scripts/p1-4/summarize.mjs` | Validates54 paired groups, same start ticks, digest presence, complete race equality | 0 |
| P1/P1.1/P1.2/P1.3 functional browser commands below | 8/5/6/9 groups, zero page errors; direct-file navigation blocked | 0 each |
| `node scripts/p1/build.mjs` repeated | Dependency guard passes; identical213,241-byte artifact/hash | 0 |
| `git diff --check` | No whitespace errors | 0 |

Functional commands: `BNT_P1_OUT=.../evidence/p1-browser node scripts/p1/browser.mjs`; `BNT_P11_OUT=.../evidence/p11-browser node scripts/p1-1/browser.mjs`; `BNT_P12_OUT=.../evidence/p12-browser node scripts/p1-2/browser.mjs`; `BNT_P13_OUT=.../evidence/p13-browser node scripts/p1-3/browser.mjs`, where `...` is `/workspace/deliverables/bnt-p1-4`. These use the final generated HTML in managed HTTP, then offline gameplay, and exercise pause/resume/step/speeds, queued Signs, obedience/resistance, gauge, actual combat/Engage, camera/map, commentary and restart. P1.2/P1.3 report zero external runtime resource requests. They catch the managed `file://` policy denial, so exit0 does **not** mean direct-file testing passed.

The older production-career/E4/obsolete legacy browser runners were not re-executed for this isolated prototype; their unchanged HTML artifacts are not claimed newly accepted. Full configured Node regressions do include the earlier milestones.

### Non-final failures and corrections

- The initial callback candidate's browser run was intentionally terminated after55 observations because it regressed despite improving Node timing. Raw process exit1 and the partial data are retained separately. Its measurements are not mixed into final tables.
- Initial new combat diagnostics exited1: first the intended invalidated-attack fixture placed a racer illegally ahead of the grid; it was corrected to a legal distant lane. Then the purported defended fixture did not actually produce a defended attack; explicit weak-attacker/strong-defender native attributes made that boundary reproducible. The coverage assertions remain in place. No production balance or existing test was changed to obtain a pass.
- Early pilot frame samples overlapped focused correctness tests, and the old measurement reset could miss a digest while a click completed. Final runs reset before Start and rerun affected/control observations sequentially; all final windows include the aligned digest. Original pilot/interim data remain available. Oval's final phase was advanced to70s; final baseline36 refreshed Oval windows use the exact same phase settings as candidate.
- The five-implementation experiment originally described itself as three in its metadata; the count was corrected without changing numeric samples. Source/history and metadata note disclose it.

## Performance and remaining risks

Detailed samples and all54 before/after groups are in the Baseline, Optimization and Frame-Pacing reports. The final Node late C01 Combat digest median improves258.2→113.0ms; late Long Rally337.8→135.4ms. Same-page Chromium late Circuit reference/final medians are approximately203→103ms. These are different experiments, not interchangeable timings.

The phase-stress >50ms counts81→50, >100ms40→13, >200ms12→0 across10,236/10,563 frames. Thirty-seven groups improve p99 by at least1ms;16 are effectively unchanged; one early Short Rally4× group regresses33.3→50.0ms. Two short observations do not establish its cause or device-wide behavior. The complete4× Circuit pair corroborates smoother playback, with virtually unchanged total race wall time and lower debt, but is a single paired race.

Event/history growth remains linear in digest cost: no authoritative records were removed. Remaining100–187ms late digest samples are perceptible. Cold full-state checkpoint compression/restoration also remains expensive and outside normal P1 viewer intervals. The100% sub50ms/zero-hitch target is **not** achieved. Sampled JS heap high-water drops134.2→33.7MB in the complete pair, but this is an approximate sampled browser proxy, not true in-call peak/OS memory or a general guarantee.

If Windows testing finds the residual stalls unacceptable, seek separate approval for a narrow background/incremental digest feasibility proof. Measure snapshot-copy/main-thread cost first; preserve generation-bound byte inputs, native tick/input order, legacy checkpoint completion and cold verification. A worker might move100–180ms CPU off the UI but does not remove that processing, introduces copy/coordination costs and changes the wrapper architecture. An embedded Blob worker must remain self-contained. No such migration is implemented here; no durable E4 backend or P2 dependency should be introduced merely to improve playback.

Inherited Long Rally Node/Chromium numerical portability remains separate and unresolved. No physics, rounding, RNG behavior or golden checksum is changed to conceal it.

## Standalone artifact

- Built path: `dist/Blood-and-Thunder-P1-Playable.html`.
- Owner copy: **`Blood-and-Thunder-P1.4-Playable.html`**, identical bytes.
- Size: **213,241 bytes**.
- SHA-256: **`0ea8784671b473c9e95fe4eed4ba7379bf5cf06e966b2d16a3a383f1f1d2ad37`**.
- Embedded JavaScript/CSS; no CDN, adjacent assets, worker, normal-play server or installation required.
- Old production HTML aliases remain unchanged, each1,047,085 bytes, SHA-256 `8a9b73409a84517f2b0c72c265499434afcf14d94037a645bec553a6b1cba9a3`.

## Windows Chrome/Edge owner acceptance

1. Save `Blood-and-Thunder-P1.4-Playable.html` locally and double-click it. Confirm `file:///...`, P1.4 header, and P1.3 tactical gameplay policy. Disconnect network; no Node/npm/server is required.
2. Prepare C01/Combat/eight entrants/seed145/Clear/two laps/native personality. Queue Push before Start; activate at the starting signal, with two uses remaining. Run4× through the entire race, watching rare hitches, fatigue, real combat, radio, standings, follow camera and tactical map.
3. Compare the same setup/pre-start input with the preserved P1.3 HTML in the **same browser version**. Export metrics and compare native checksum/official times/classification; prototype version and performance fields should differ. The managed Chromium reference is51624d65; other runtime versions must be compared to their own reference rather than presumed cross-runtime equivalent.
4. Test1×/2×/4×, Pause, Resume and single native step. Paused gauge/state must not advance. Faster playback must not drop native ticks or inputs. Record input simulation ticks if comparing in-race decisions.
5. Queue Conserve while Push is active. It waits for the next closed-loop crossing; cancellation does not refund uses. Test Short/Medium/Long Rally map Sign Points1/2/3 and legal queued activation. No new opportunities are added.
6. Compare ordinary versus headstrong Conserve orders; retain genuine obedience/resistance/physical-constraint distinctions and native effort feedback. Check no invented immediate Sign activation.
7. Test Engage in Combat and solo/no-target situations: actual attacks and source effects only, no fabricated combat. Check driver strain/beast fatigue and real contact indicators.
8. Restart an identical setup and repeat identical pre-start inputs; confirm deterministic native results. Earlier pacing profiles remain selectable and preparation edits apply only on Prepare.
9. Include Long Rally late-race playback and early Short Rally4× when assessing the remaining performance risks. Record hardware, browser version, course/seed/field/weather/policy and observed tick/frame symptoms.
10. Closing/reloading still abandons this in-memory unfinished race. No career save/backend migration, permanent reward or new progression is part of P1.4. Keep the separate production HTML for career/tuning workflows.

Managed Chromium blocks file navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; Windows and Edge direct-file testing was **not performed here**. Earlier owner acceptance does not count as acceptance of this new artifact. Stop for owner review; P2 and larger architecture work remain unauthorized.
