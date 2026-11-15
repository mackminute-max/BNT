# Blood and Thunder — Establishment Documents Audit

**Verdict: not ready for final prototype acceptance.** The implementation has substantial working coverage, but this review reproduces three defects, identifies an incomplete required fixture package, and independently confirms that the mandatory direct offline launch gate remains unverified.

This is a fresh-perspective review of the current working tree against the ten establishment/production documents, not an endorsement of earlier milestone reports. It is an engineering audit by the same assistant, not a separately staffed external review. No game source fixes are included.

## Scope, authority and snapshot

The owner's latest instructions authorize this audit and saving it within the project. Documents are evaluated as specifications, not as independent authorization to publish, change scope, or advance development.

- `00_README_START_HERE.md` establishes reading order and precedence.
- `01` defines prototype scope and the mandatory runtime contract; `02` defines approved rules; `03` defines numerical/simulation architecture; `04` defines milestone gates; `05` defines test/fixture acceptance; `06` defines UI/developer/replay requirements; `07` defines reporting and release acceptance.
- `08` and `09` supply broader vision/context. Their full stable-management/roguelite progression is not a missing feature of the explicitly narrower racing prototype. Superseded legacy instructions are not treated as current requirements.
- Configurable provisional coefficients are not defects merely because final balance is unapproved. Exceptions to mandatory mechanics require owner approval; passing a test does not create such an exception.

Audited Git HEAD: `40810f3292fc29f04e2c397c616c81cc709e1c9e`. The application, tests, reports and build were untracked at audit time; HEAD alone does not reproduce this working tree. [snapshot.sha256](evidence/snapshot.sha256) identifies the audited specifications, sources, tests, scripts, development records and artifact. No commit, push, publication or environment configuration change was made.

Runtime/build environment: Node `24.22.1`, npm `11.9.0`, managed Chromium `156.0.8078.79`; package `0.4.0`, simulation `0.4.0-m4`.

Artifact: `dist/Blood_and_Thunder.html`, **158,049 bytes**, SHA-256:

```text
162eba94b60fe70c617073d2e9e6c67aa113ba7b2e6b3f89951ed465320cad20
```

## Evidence actually collected

| Check | Audit result | Evidence / limit |
|---|---|---|
| `npm test` | 100 passed; 0 failed; 0 skipped | [Unit-test log](evidence/unit-tests.log). Existing regressions pass despite A01–A03. |
| `npm run build` | Passed | [Build log](evidence/build.log). Artifact hash before/after rebuild is identical. |
| `npm run test:browser` | Exit 1; direct launch BLOCKED | [Browser report](evidence/browser-report.json). `ERR_BLOCKED_BY_ADMINISTRATOR` for `file://`. |
| Browser diagnostic fallback | 18 functional checks passed | Explicit HTTP diagnostic mode; zero reported page errors or additional runtime resource requests. This is not T25. |
| Browser/headless parity | Matching reference checksums | Pure `2cbf0608`; Combat with pre-race Engage Rivals `c902bc37`. |
| Targeted adversarial probes | Three defects reproduced | [Results](evidence/findings.json), [executable reproducer](evidence/reproduce-findings.mjs). |
| Original numbered documents | No tracked changes | `git diff --name-only` was empty. |
| Existing sixteen-race seed report | Historical evidence only | `reports/milestone-4-reference.json` was not regenerated in this audit. No additional large balance campaign is claimed. |

The browser checks cover Canvas initialization, exact stepping/pause, signs, completed Pure/Combat races, high-damage wreck/DNF presentation, weather/tuning, live overrides, replay import/verification/restart, bulk edits, portable configuration and corrupt-input rejection, denied storage, responsive normal batches, diagnostics/results, and an 800px viewport. They do not establish usability across browsers or direct offline launch.

## Findings

### A01 — High: lateral movement bypasses active incident hazards

**Requirement:** `02` §§1/3/9 requires hazards in both formats and legal physical movement; `03` §3 requires swept-path legality and effects at subevent time; `04` M3 requires obstruction-aware movement without silent collision failures.

**Source:** `src/sim/race.js:478` (`laneChanges`), particularly target acceptance around lines 518–527 and the commit around lines 549–555. The lateral reservation checks RU occupancy and competing claims. It does not consult active hazards. Forward resolution does consult `hazardAt` at `src/sim/race.js:762` and queues the associated impact at line 792.

**Reproduction:** seed 145; one reference-driver entrant A in lane 0 at q=-0.5; incidents enabled, random incident rate zero. Schedule debris in empty lane 1, tile 79, at time 0 for 12 seconds. Step once to create it, then submit an adjacent lane-1 movement command and step again.

**Observed:** A ends in lane 1, tile 79, q=-0.49828642307418614, while debris remains active in the same tile. The engine logs `LANE_CHANGE_COMPLETED`; there is no hazard impact or damage event and no rejection. Race status remains Running.

**Impact:** an active physical obstruction is bypassed depending on approach direction. Filtering visible hazards out of AI choices is insufficient: physical legality must also hold for unperceived hazards and all legal movement requests. The probe deliberately exercises the headless kernel using its supported reference driver; it does not add a player steering control.

**Recommended correction:** include hazards in lateral swept-path validation and resolve contact/blocking consistently with longitudinal movement, at the correct simulation time. Add visible/hidden hazard, both-format, same-time movement and entrant-permutation regressions. Confirm an actor may neither silently enter nor phase through debris, animals or spectators.

### A02 — High: oversized seed ranges hang before batch yielding/cancellation

**Requirement:** `06` §3 requires validated batch input and responsive execution; `03` §10 requires explicit invalid-number handling rather than silent loops.

**Source:** `src/dev/batch.js:9–14`; invoked synchronously by `src/ui/workbench.js:304` before the abort controller is installed. Single seed tokens are checked with `Number.isSafeInteger`; range endpoints are not.

**Reproduction:** call `parseSeeds('9007199254740992-9007199254740992')` in a child process with a one-second timeout.

**Observed:** the child times out (`ETIMEDOUT`, SIGTERM). At this magnitude, `seed++` no longer advances the JavaScript Number, so the range loop never terminates and keeps appending values. The small range-length check does not protect it. Extremely long digit endpoints can also convert to Infinity.

**Impact:** user-entered batch input can freeze the page and grow memory before the responsive batch runner or Cancel button can act. The existing normal-range/cancellation tests do not cover this validation boundary.

**Recommended correction:** require safe-integer endpoints before arithmetic/iteration; enforce the total request limit before expanding ranges, including multiple tokens. Add endpoints beyond the safe-integer range, overflow-to-Infinity, cumulative oversized lists and valid boundary tests. Reject promptly with a useful diagnostic and preserve the current race.

### A03 — Medium: compliance says Followed when the executed pace contradicts the sign

**Requirement:** `03` §8 requires logging compliance outcomes; `06` §§3/5/7 requires accurate executed-action diagnostics and sign/compliance reporting.

**Source:** `src/ai/driver.js:301–303` forces actual pace to Conserve when the position action is yield/disengage. Lines 322–344 calculate compliance using the independently selected pace candidate instead of the executed pace. The resulting events feed `src/reporting/results.js:4–23`.

**Reproduction:** seed 145; A in lane 0 at q=-1.1, B ahead in lane 0 at q=-0.5, C blocking lane 1 at q=-1.1. A's personality is Aggression=100, Caution=100, Tactical Discipline=100 and the other tendencies=0. Disable judgment/execution/stress errors, queue Push the Pace before the signal, then step.

**Observed:** active sign is Push the Pace; diagnostics select `{pace: Push, position: yield}`; actual stored pace is **Conserve**; compliance is **Followed**.

**Impact:** race physics follows the conservative action but the player's feedback and batch/technical sign analysis claim successful obedience. This impairs the required ability to understand driver decisions and tune sign effects. Autonomous refusal/yielding is permitted; the incorrect report is the defect.

**Recommended correction:** compute compliance from the effective executed action combination, distinguishing candidate preference from actual action and reporting why context overrode it. Test conflicting pace/position choices, disengage, execution failure, and the downstream technical/batch totals. Do not force obedience to repair telemetry.

### A04 — Release gate: direct offline launch remains BLOCKED, not passed

**Requirement:** `01` output contract; `04` all milestone gates; `05` T25; `07` §§D/F require actual standalone offline execution.

**Observed:** a fresh Chromium run again rejects the local artifact with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. The harness transparently switches to an HTTP diagnostic fallback, completes 18 checks, and returns exit 1. Static bundling checks and the unchanged artifact hash support packaging integrity but cannot demonstrate `file://` behavior.

**Assessment:** this is an environment verification blocker, not evidence that the HTML itself cannot run offline. Existing `IMPLEMENTATION_STATUS.md` correctly labels final acceptance blocked. It would be incorrect to describe the complete milestone/release acceptance gate as passed.

**Closure:** test this exact artifact from a local file in a permitted modern desktop browser with network disabled, no server and no companion files. Exercise setup through results, replay/config import/export and denied storage; save browser/version, console/resource evidence and artifact hash. Do not bypass managed browser policy to create that evidence.

### A05 — Low: required reusable scenario fixture package is incomplete

**Requirement:** `05` “Test fixtures” explicitly requests twenty named reusable scenarios with seed, entrants, configuration snapshot and expected invariants.

**Source/observation:** `tests/fixtures.js:6–31` provides eight `fixtureDefinitions`: empty_track, grid_eight, lane_conflict, lane_swap, fast_corner, mismatched_team, finish_photo and rear_row_laps. Their expected invariants live in test bodies rather than fixture metadata. The other twelve required named reusable definitions are absent: fatigue_sprint, rain_turn, pure_contact, combat_duel, single_wreck, wreck_chain, four_lane_blockage, finish_exit_queue, sign_replace, sign_before_retirement, override_replay and all_retired.

**Assessment:** many corresponding behaviors are exercised by inline tests; this is a reproducibility/organization gap, not a claim that those mechanics are absent or their tests all fail. It makes a fresh reviewer do more work to reconstruct the specified scenario catalog.

**Recommended correction:** consolidate existing inline setups into the named catalog with explicit invariants and normalized setup snapshots. Add genuinely missing behavioral assertions rather than duplicating tests merely to satisfy naming.

## Requirement coverage assessment

“Supported” below means source structure plus executed existing tests provide positive evidence for the described scenarios. It does not mean exhaustive proof over every legal input. A01–A03 demonstrate why a green regression suite is not equivalent to complete acceptance.

| Area / documents | Evidence and assessment |
|---|---|
| Vanilla runtime and single HTML (`01`, `07`) | Modular vanilla JS; Canvas/HTML/CSS; development-only bundler/test dependencies; rebuilt embedded artifact. Packaging supported; actual direct offline runtime unverified (A04). |
| Headless authoritative architecture (`01`, `03`) | Model, geometry, AI, simulation, overrides, replay, reporting and UI separated. Browser/headless parity and presentation-isolation tests provide strong positive evidence. |
| RU composition and derived model (`02`, `03`) | Driver/beast/chariot/equipment schema, condition effects, aggregation/mismatch, load, primary/secondary derived values and exposed numeric tuning exist. Sanity/condition tests pass. No claim that provisional coefficients are finally balanced. |
| Motion, geometry and conflicts (`02`, `03`) | Continuous acceleration, lane-specific turns, fixed ticks/subevents, deterministic reservations, swept forward occupancy and braking covered. Lateral hazard legality is defective (A01). |
| Race administration (`02`, `04`) | Common-line entry/laps, full-precision finish/ties, retirement classification, locked results and physical clearing supported by current tests. |
| AI and signs (`02`, `03`, `06`) | Filtered perception, utility candidates/personality/errors/goals, six-sign accounting/activation and diagnostics supported. Compliance execution reporting has a confirmed counterexample (A03). |
| Fatigue, environment and incidents (`02`, `03`) | Individual conditions, exertion/recovery, strain/wear, five weather presets, surfaces and weighted/scheduled incidents present. Hazard placement is covered; hazard traversal is not uniformly correct (A01). |
| Pure/Combat, damage, wrecks (`02`, `04`) | Shared engine, offensive format legality, contested reactions, component damage/control, permanent anchored wrecks, new-impact deduplication and obstruction safeguards have passing focused tests. No timer-based wreck removal found in the reviewed mechanism. |
| Viewer, commentary and results (`06`) | Browser tests verify rendered flows, results and event-based commentary; headless tests verify commentary/state independence. Sign reporting is not fully trustworthy until A03 is fixed. |
| Developer editing/configuration (`06`) | Individual/bulk editing, derived/AI inspection, validated imports, paused boundary overrides with provenance/replay and storage failure fallback supported by tests. |
| Replay (`03`, `06`) | Initial setup/RNG, commands, events/checkpoints, reconstructed replay, restart and first-divergence diagnostics supported by tests and browser parity. |
| Batch analysis (`05`, `06`) | Normal batches yield/cancel and use the same simulator. Seed range parsing defeats responsiveness for invalid input (A02). Existing sample distributions are preliminary balance evidence only. |
| Tests, fixtures, reporting (`04`, `05`, `07`) | 100 existing tests pass; browser gate honestly remains blocked. Required reusable fixture catalog incomplete (A05). Existing earlier reports are historical evidence, not a replacement for current checks. |

### Acceptance matrix traceability

| IDs | Audited assessment |
|---|---|
| T01–T06 | Existing deterministic/configuration/model/movement tests pass. T03/T04's RU occupancy checks do not establish incident-hazard legality; A01 extends that boundary. |
| T07–T09 | Existing individual fatigue/recovery/weather tests pass. |
| T10–T15 | Existing legality, contest/reaction, permanent wreck, secondary impact and blocked-race tests pass. |
| T16–T18 | Existing queue/start/crossing/replacement/cancel tests pass. Compliance correctness is a separate unsatisfied diagnostic requirement (A03). |
| T19–T20 | Existing initial-entry/lap and fractional-finish/tie tests pass. |
| T21–T24 | Existing exit, override, replay and validation tests pass for their fixtures. A02 shows batch-input validation is not comprehensively safe. |
| T25 | **BLOCKED / not verified.** HTTP fallback is not a pass. |
| E01–E06 | Existing fast traversal, blocked-travel, simultaneous/mid-tick impact, persistent-contact and secondary-wreck tests pass. Include lateral hazard adversarial cases before claiming complete path safety. |
| E07–E13 | Existing retirement, sign legality/lowering, finish chronology, exit crowding and incident placement tests pass. E13 placement alone does not test subsequent lateral entry (A01). |
| E14–E15 | Storage-unavailable and corrupt-configuration tests pass, including browser flows. |
| E16 | Existing integrity-error tests pass; they do not protect the separate seed parser's unsafe range loop (A02). |
| E17–E20 | Existing render-rate, commentary separation, override replay and geometry tests pass. Browser/headless parity also passes for the reference cases. |

## What is not established by this audit

- No proof of universal fairness or determinism across every possible simultaneous-contact graph, floating-point platform, user configuration or future source revision.
- No fresh multi-weather/high-lethality statistical campaign, final balance approval, accessibility certification, prolonged memory/performance soak, or cross-browser/mobile compatibility claim.
- The default sample's low/no retirements is not itself a defect: there is no approved mandatory casualty rate. High-damage scenarios do produce wrecks and DNFs in the browser tests.
- Broader economy, persistent stable progression, multi-race roguelite runs, audio and final art remain explicitly outside this prototype's approved scope. Their absence is not scored as a failure.
- Historical milestone artifacts have not each been reopened and independently verified. The current direct-file limitation cannot retroactively establish earlier offline gates.

## Recommended work order and acceptance decision

1. Fix A01 physical hazard handling and A02 seed-range validation with focused regressions. These affect core movement legality and application responsiveness.
2. Fix A03 effective-action compliance and validate exported technical/batch telemetry.
3. Complete the reusable fixture catalog (A05), retaining existing behavior coverage and adding adversarial invariants from this audit.
4. Re-run the full unit/integration suite and browser parity checks; rebuild the one-file artifact after source changes and record its new hash.
5. Close T25/A04 with actual direct offline browser evidence in a permitted environment. Update implementation/release records against the evidence, then request owner review of the corrected milestone.

**Acceptance recommendation:** retain “implementation available for review; final acceptance blocked.” There are now three confirmed behavioral defects in addition to the already known offline verification blocker. No further gameplay design decision is needed to correct these defects within the approved rules.

## Reproduce this audit's new counterexamples

From the project root:

```sh
npm test
npm run build
npm run test:browser
node docs/audits/evidence/reproduce-findings.mjs
sha256sum -c docs/audits/evidence/snapshot.sha256
```

The reproducer prints whether each original defect still reproduces. `reproduced: true` is evidence of a defect, not a passing game acceptance test. It isolates the seed parser in a timed child process so the audit itself terminates. After fixes, update regression tests and retain this audit as the historical snapshot; do not silently overwrite its evidence with a new result.
