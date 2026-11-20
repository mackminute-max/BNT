# BNT P1.3 — Implementation and Delivery

## Revision and scope

Local branch: `feat/p1-3-endurance-obedience`.

- Verified P1.2 delivery base: `eaf967ea7e6bfff363266316fb6eaaec66e729dc`.
- P1.2 reference source ancestor: `53a0e4b122010ce44fee820a4b66e80cab060169`.
- P1.3 runtime, initial tests, diagnostic harnesses and standalone artifact: `43928df0c1cfb7f5cb9c1ff903ef3db740b39983`.
- Validation supplement (five Sign-boundary tests and source-linked action measurement script; runtime/artifact unchanged): `1c978ec6f2ddfab7d674c6d67e8b184a32f1cf39`.
- Documentation/evidence commit is recorded in the final handoff/commit manifest, avoiding a self-referential hash in this committed file.

No merge, push, deployment, release, P2 work, E4 integration, career migration or dependency change occurred. The pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was preserved outside these commits.

## Delivered behavior

P1.3 policy is selected by default in the HTML. Active Push requests native Sprint, Conserve requests native Conserve; ordinary AI cannot optimize away a legal pace order. Exceptional refusal uses existing personality traits and deterministic candidate utility without extra RNG draws. Native restrictions/error handling remain distinguishable. Existing queue/activation/opportunity/refund rules and the other four tactical Signs are preserved.

Endurance tuning strengthens ordinary cumulative expenditure and the existing beast-only exhaustion curve. Actual positive acceleration, resolved weapon attempts and ram effort have resource-specific native costs with clamped actual-spend receipts. The HUD shows native exertion, fatigue trend, last additional costs and genuine compliance/refusal reasons. Radio refusal feedback is event-driven and throttled. Existing camera, tactical map, scenery, fatigue gauge, bounded combat effects and playback scheduling remain in place.

Native production defaults remain unchanged. P1.1/P1.2/legacy policies are selectable. Programmatic PlayableSession/raceSetup retain their P1.2 default; explicitly request `pacing:'tactical'` for P1.3. Presets change only preparation-time native personality fields, not permanent career assets or opponent traits.

## Files

| Area | Files and responsibilities |
|---|---|
| AI | `src/ai/directives.js` new opt-in directive/refusal policy; `driver.js` selection priority; `telemetry.js` compliance from real execution |
| Native resources | `src/sim/action-costs.js` transient aggregation and actual resource accounting; `race.js` actual positive acceleration; `consequences.js` validated attack/contact costs; `environment.js` validated optional configuration |
| Prototype policy/setup | `src/prototype/pacing.js` explicit P1.3 profile; `personalities.js` existing-trait presets; `session.js` preparation selection and metrics version |
| Presentation | `src/prototype/app.js`, `index.html`, `interactions.js` controls and source-backed diagnostics; `src/reporting/commentary.js` bounded refusal lines |
| Tests/diagnostics | New `tests/p1-3.test.js`; `scripts/p1-3/{competitive,verify,endurance,tortoise,obedience,actions,performance,browser}.mjs` |
| Build | `dist/Blood-and-Thunder-P1-Playable.html`; existing `scripts/p1/build.mjs` unchanged |
| Reports | Five reports, README and isolated evidence under `docs/p1-3/` |

Existing tests and golden files were not edited. Simulation movement/collision/corner/combat resolution, weather, incidents, native cadence and digest generation were not redesigned. P1.3 outcomes intentionally differ under the new explicit policy and costs; historical configurations retain their outputs.

## Test evidence

Environment: Linux, Node v24.22.1, npm11.9.0, Chromium156.0.8078.79, existing esbuild0.28.2/playwright-core1.65.1. No installation or dependency update was required. Raw logs and JSON evidence accompany this report.

| Command | Actual result | Exit |
|---|---|---|
| `node --test tests/p1-playable.test.js tests/p1-1.test.js tests/p1-2.test.js` before implementation | 53/53 passed, 3309.5 ms | 0 |
| `node --test tests/p1-playable.test.js tests/p1-1.test.js tests/p1-2.test.js tests/p1-3.test.js` during implementation | 68/68 at that revision | 0 |
| `node --test tests/p1-3.test.js` final focused | 23/23 passed, 541.6 ms | 0 |
| `npm test` first full run | 596/596 passed, zero failed, 411.75 s; includes the initial18 P1.3 tests | 0 |
| `npm test` frozen delivery revision | 601/601 passed, zero failed/skipped, 362.24 s; all23 P1.3 tests included | 0 |
| `BNT_P1_OUT=/workspace/deliverables/bnt-p1-3/evidence node scripts/p1/references.mjs` | 12 historical +2 payroll checksums match | 0 |
| `BNT_P12_OUT=/workspace/deliverables/bnt-p1-3/evidence/p12-parity node scripts/p1-2/verify.mjs` | Six accepted earlier-profile full-race hashes match | 0 |
| `BNT_P13_TAG=baseline BNT_P13_PACING=competitive node scripts/p1-3/competitive.mjs` | 56 native matched baseline races, all ended/cleared; verified by matrix verifier | Exit not retained |
| `BNT_P13_TAG=candidate BNT_P13_PACING=tactical node scripts/p1-3/competitive.mjs` | 56 native P1.3 races, all ended/cleared | 0 |
| `node scripts/p1-3/verify.mjs` | Validates112 rows,3 exact full-race repeats, native reversal and aggressive-win evidence | 0 |
| `node scripts/p1-3/endurance.mjs` | Four matched native four-RU Endurance/order comparisons | 0 |
| `node scripts/p1-3/tortoise.mjs` | Native two- and four-RU disciplined-opponent reversals | 0 |
| `node scripts/p1-3/obedience.mjs` | Ten native four-RU persona/order runs, factual decision counts | 0 |
| `node scripts/p1-3/actions.mjs` | Three explicit close-contact native Combat fixtures with source-linked receipts | 0 |
| `node scripts/p1-3/performance.mjs` | Five measured samples after two warmups per profile/course, sequential isolated benchmark process | 0 |
| P1/P1.1/P1.2/P1.3 browser scripts, commands below | 8/5/6/9 functional groups respectively, zero page errors; direct-file navigation blocked in each | 0 each |
| `node scripts/p1/build.mjs` repeated | Self-contained build, dependency guard passes; identical bytes/hash | 0 |
| `git diff --check` | No whitespace errors | 0 |

Browser commands: `BNT_P1_OUT=.../evidence/p1-browser node scripts/p1/browser.mjs`; `BNT_P11_OUT=.../evidence/p11-browser node scripts/p1-1/browser.mjs`; `BNT_P12_OUT=.../evidence/p12-browser node scripts/p1-2/browser.mjs`; `node scripts/p1-3/browser.mjs`. Here `...` means `/workspace/deliverables/bnt-p1-3`. These exercise the generated HTML served by a temporary local managed-test harness, then browser-network-disabled gameplay. P1.3/P1.2 record zero external runtime requests. They do not establish Windows direct-file acceptance. Production-career/E4 browser runners were not re-executed for this isolated prototype; their untouched artifacts are not claimed newly accepted.

During development, non-final focused runs exited1 when the new tests initially omitted explicit tactical-profile selection and when a new ram test used the wrong native contact-cause label. The new fixtures were corrected; existing assertions/goldens were not changed. The final saved focused log is green. No final unresolved functional test failure is concealed by the browser runner's caught file-navigation limitation.

Historical payroll: Pure `ad509187`, Combat `f191ca35`. Earlier-profile accepted repeats: P1.1 Oval `0f553f9a`, C01 `f943fdf3`, Long Rally `aa6f3a3f`; P1.2 Oval `bedabe3d`, C01 `8eb5150f`, Long Rally `620a1529`. New P1.3 sustained-Push full-race repeats: Oval `d39b517d`, C01 `ec08b1b6`, Long Rally `0fa75952`. See `references.json` for all12 historical expected/actual pairs. P1.3 partial native replay and checkpoint/restore comparisons also pass. No expected reference was updated.

## Performance and known limitations

| Course | P1.2 median /100 ticks | P1.3 median /100 ticks | Change | P1.2/P1.3 extra digest median |
|---|---|---|---|---|
| oval | 96.20 ms | 99.77 ms | +3.7% | 51.62/52.56 ms |
| C01 | 68.73 ms | 89.32 ms | +30.0% | 38.68/50.45 ms |
| rally-long | 72.74 ms | 92.17 ms | +26.7% | 40.86/56.89 ms |

These are whole-profile native Combat step batches at eight entrants/seed145, ticks101–200, with one built-in checkpoint digest in each batch; the separately timed extra digest is **not** added to the batch measurement. They are not pure movement-kernel timings. Different explicit policies produce different legal work, so this does not isolate every additional millisecond to receipts. The benchmark ran after the first full regression/matrix workers finished and before the final full regression began; host scheduling, JIT and CPU/memory instrumentation limitations remain. Raw samples are retained; no claim of statistically established performance equivalence is made.

There is a measured regression: about4–30% by course in this sample. First measured100-tick windows add approximately508/366/594 events (Oval/C01/Long Rally) under P1.3 compared with P1.2, reflecting actual-work receipts and changed decisions. Receipts aggregate physical subevents per actor/tick, rather than emitting for every movement subevent, and are not animated/narrated. Existing digest cost still grows with native history and can cause perceptible hitches. No worker, hash, scheduling or historical-log redesign was attempted. This is a disclosed owner-playtest/performance acceptance risk, not a claim of smooth late-race playback.

No exhaustive balance claim: the manageable matrix couples course, field, weather, seed and Endurance. Additional controlled-Endurance/personality/close-contact experiments isolate important factors but are not a full factorial sweep. No DNF occurs in the main112 races; no new DNF-rate claim follows. Extreme headstrong refusal is intentionally frequent in its narrow fixture. Contact/endurance-specialist rivals do not win this matrix; speed/handling/balanced do. Cross-runtime Long Rally numerical portability remains inherited/unresolved; this work proves exact repeats within the supported runtime, not new global portability.

## Standalone delivery

- Built path: `dist/Blood-and-Thunder-P1-Playable.html`.
- Review copy: `Blood-and-Thunder-P1.3-Playable.html` (same bytes).
- Size: **210,999 bytes**.
- SHA-256: **da93655c5ff145afd4a5a0f092c03ae75019a5132cdf7a36c07cb488d202051e**.
- Embedded JS/CSS; no CDN, runtime download, adjacent asset, server or installation required by the artifact.
- Existing production HTML aliases remain unchanged: 1,047,085 bytes each, SHA-256 `8a9b73409a84517f2b0c72c265499434afcf14d94037a645bec553a6b1cba9a3`.

## Windows Chrome/Edge owner checklist

1. Extract the review ZIP; double-click `Blood-and-Thunder-P1.3-Playable.html`. Confirm a local `file:///...` URL and P1.3 heading. Disconnect networking; no server/Node/npm is needed.
2. Keep P1.3 high-authority orders selected. Choose balanced personality, four entrants, Oval, seed17, Pure, two laps; click Prepare. All preparation edits apply only on Prepare.
3. Queue Push before starting. Confirm queued state and two opportunities left. Single-step: starting signal activates it; expect requested Sprint, actual pace and honest Following Orders/constrained feedback. No activation opportunity is spent.
4. Run1× then2×/4×. Watch fatigue increase and actual capability/positions change. Pause: gauge, native state and effects stop advancing; single-step advances one native tick.
5. Queue Conserve after starting. Push stays active until the next start/finish crossing. Confirm Conserve then activates, slows effort and can recover; opportunity count does not change on activation. Exhaustion or cancellation must not refund uses.
6. Repeat with short/medium/long Rally; check the tactical map's1/2/3 intermediate Sign Points and queued activation at the next point, not immediate selection. Pause/step near a point.
7. Prepare headstrong personality and queue Conserve before starting. Check explainable Resisting Orders feedback with existing trait evidence and occasional radio refusal; compare balanced/disciplined. A refusal must not masquerade as a fabricated physical attack.
8. Prepare Combat/C01/Contact Specialist/Extreme Heat/seed145/eight entrants; queue Engage. Native attacks show actual outcomes and driver strain; a solo/no-target Engage must instead report seeking opportunity with no invented attack.
9. Check fatigue gauge equals100 minus native mean fatigue; UI additional costs identify beasts versus driver. Inspect requested/actual pace and physical constraint reasons where blocked or out of control.
10. Select P1.2, P1.1 and legacy comparison policies, Prepare each, then return to P1.3. P1.3-specific hint text describes only that policy. Run an identical setup/input sequence twice and compare downloaded metrics/checksum, respecting identical tick timing of commands.
11. Inspect long-race hitches, readability and endurance tradeoffs. Report browser/version/hardware, course/seed/field/weather/persona/order schedule, tick and actual symptoms. Do not infer failures merely because a tactic loses.
12. Reload/close during the race: this in-memory prototype intentionally loses the unfinished race. It writes no career/progression. Keep the existing production HTML for career/tuning workflows.

Managed Linux Chromium rejected file navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; no Windows/Edge direct-file owner acceptance is claimed. Full owner playtesting and performance disposition remain outstanding. Recommended next action is review/test this P1.3 artifact; do not begin P2 or another implementation phase without authorization.
