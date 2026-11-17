# Blood and Thunder — Audit of M4 update 0.4.1-m4

**Verdict: the update fixes the original three counterexamples, but final acceptance is still not justified.** This review finds three additional requirement/behavior issues and one fixture coverage gap. The previously reported direct offline launch gate remains blocked by browser policy.

This is a fresh-perspective, evidence-based review by the same assistant, not a separately staffed external audit. No gameplay fixes are included. The numbered production documents, application sources, tests and historical audit evidence were not edited. Rebuilding produced the identical artifact.

## Authority and scope

The owner's current instruction requests an audit of the update, not another implementation pass. The ten numbered documents remain the requirements baseline: `00` establishes precedence; `01` defines the racing prototype/runtime contract; `02`–`07` define approved mechanics, numerical architecture, milestones, tests, UI/developer/replay and release gates. `08`/`09` remain subordinate vision references. No campaign, stable economy, final audio/art or persistent roguelite progression requirements are added to this prototype review.

Scope: verify the claimed A01–A05 remediation; review related movement, AI telemetry, editable state, statistics and fixtures; rerun automated/build/browser checks; extend race sampling across weather presets. Numerical balance is provisional and is not judged against an invented win or casualty target.

## Snapshot and verification

- Simulation `0.4.1-m4`; package `0.4.1`; Git HEAD `40810f3292fc29f04e2c397c616c81cc709e1c9e`. Application implementation remains untracked, so HEAD alone does not reproduce the reviewed working tree.
- The update's source/test/build/document manifest verified unchanged: [manifest verification](m4-update-evidence/update-snapshot-verification.log), against `reports/m4-update-evidence/snapshot.sha256`.
- Artifact: `dist/Blood_and_Thunder.html`, **158,915 bytes**; SHA-256 `5180387f5cb623e5ae920d8e307a9fd0244b61fb7a6580f0f44c1649dbf23e1d` before and after rebuilding.
- Environment: Node `24.22.1`, npm `11.9.0`, managed Chromium `156.0.8078.79`.

| Check actually run | Result | Evidence |
|---|---|---|
| `npm test` | **114 passed, 0 failed, 0 skipped** | [Test log](m4-update-evidence/tests.log) |
| `npm run build` | Passed; identical artifact | [Build log](m4-update-evidence/build.log) |
| `npm run test:browser` | **19 functional checks passed**; command exits 1 because local-file launch is blocked | [Browser report](m4-update-evidence/browser-report.json) |
| Browser errors/resources | Zero reported page errors or additional runtime resource requests | HTTP diagnostic mode, not an offline file pass |
| Original audit probes | A01, A02, A03 each `reproduced: false` | [Original counterexample rerun](m4-update-evidence/original-probes.json) |
| New targeted probes | B01/B03 reproduced; B02 schema omission and B04 fixture gap confirmed | [Results](m4-update-evidence/findings.json), [reproducer](m4-update-evidence/reproduce-findings.mjs) |
| Additional weather sample | **10/10 races Ended, eight finishers each, no integrity errors/stalls** | [Sample results](m4-update-evidence/weather-sample.json) |

The extra sample pairs Pure and Combat at seed 9/Clear, 10/Rain, 11/Heavy Rain/Mud, 12/Dust/Wind and 13/Extreme Heat, with checkpoint interval 1000. Seed 9/Clear/Pure also reconstructs from replay to the same checksum. This is ten sampled races, not a claim to have repeated the update's entire sixteen-race reference campaign or conducted a final balance study.

## Verification of the previous audit's fixes

| Original finding | Current assessment |
|---|---|
| A01 lateral hazard bypass | **Specific defect fixed.** Original probe now rejects the lane move and emits incident consequences; the 114-test run includes visible/hidden hazard, both-format, permutation and replay regressions. |
| A02 unsafe seed range hang | **Specific defect fixed.** Original unsafe range rejects rather than timing out. Safe endpoints, cumulative limits and browser responsiveness regressions pass. |
| A03 yield/disengage compliance | **Specific defect fixed.** Push candidate followed by actual Conserve now reports Overridden. Broader execution-compliance handling remains defective in B01 below. |
| A04 direct offline launch | **Still blocked, accurately disclosed.** Chromium returns ERR_BLOCKED_BY_ADMINISTRATOR; HTTP diagnostics do not satisfy T25. |
| A05 missing named fixtures | **Catalog/metadata gap fixed.** All twenty named definitions now exist with normalized setup and expected-invariant text. B04 identifies a narrower remaining problem with what the fixture catalog actually exercises. |

## Findings

### B01 — Medium: unrelated physical failure corrupts sign compliance and execution diagnostics

**Requirements:** `02` §6 says intentions are distinct from outcomes; §7 requires compliance categories. `06` §§3/5/7 requires accurate selected action, execution result, sign feedback and technical reporting.

**Locations:** `src/sim/race.js:865–873` unconditionally replaces active-sign compliance with Prevented after any rejected AI lane change. The subevent reaction path around lines 960–970 has the same policy. `src/ai/driver.js:349–350` records the selected position under `executed` before physical resolution and that position is not corrected after rejection. `src/reporting/results.js:15–16` propagates the generic execution result into sign totals.

**Reproduction:** seed 145; one autonomous entrant A, lane 0 at q=-0.5, Awareness=0, Aggression=100, Tactical Discipline=100 and other tendencies=0. Set visibility=.1, noise/judgment/execution/stress errors=0, utility laneBase=100, random incidents off. Schedule debris in lane 1/tile 79 at time 0. Queue Push the Pace before the signal and step once.

**Observed:** the unseen debris correctly rejects the outward lane change. A remains in lane 0 and actually executes **Push**. The decision initially reports the pace sign Followed, but the generic lane-failure handler rewrites compliance and technical totals to **Prevented**. Diagnostics simultaneously report `executed.position: outward`, despite no lane change occurring.

**Impact:** a successfully executed pace instruction is counted as prevented because a separate positional intention failed. The update's new executed-position field also conflates intent with outcome. This is a telemetry/feedback defect; the hazard-blocking physics in this example is correct.

**Recommended correction:** track outcomes per pace/position/combat intention; reconcile diagnostics after physical resolution, and compute sign compliance against the actions relevant to that sign. Preserve truthful immutable decision events and emit a linked final execution result. Cover boundary and subevent failures, pace signs alongside rejected positioning/combat, technical totals and authoritative replay. Do not grant sign obedience or alter the driver's legitimate autonomy.

### B02 — Medium: approved segment hazard modifiers are absent

**Requirement:** `02` §9 explicitly states: “Segment surfaces include grip, roughness, rolling resistance, hazard modifiers; tile hazards permitted.” `06` §3 requires the approved environment/surface tuning controls.

**Locations:** `src/track/oval.js:14` initializes only grip, roughness and rollingResistance. `src/sim/race.js:83–95` accepts only those three names. `src/sim/incidents.js:95–110` constructs uniformly eligible placement cells without consulting a surface hazard coefficient. The surface editor also exposes the same three fields.

**Verification:** default surface keys are exactly `grip`, `roughness`, `rollingResistance`; an illustrative `hazardModifier` patch rejects with Invalid surface modifier. The particular field name is not specified by the documents; the finding rests on the complete accepted schema and absence of any corresponding surface-hazard mechanism, not on that chosen spelling.

**Impact:** one explicitly approved surface dimension is missing rather than merely unbalanced. Existing grip/roughness/rolling and tile-incident tests do not establish surface hazard-modifier support. No documented owner-approved exception was found in the update or assumptions ledger.

**Recommended correction:** provide a centralized, validated, documented per-segment hazard modifier and its defined effect on the hazard model; expose it in setup/tuning and preserve it in configuration/replay. Document the provisional interpretation/default/range without silently dropping the requirement. Add neutral/nonneutral, validation and deterministic behavior tests. If deferral is desired instead, obtain an explicit scope exception.

### B03 — Medium: live edits rewrite a historical “fatigue at finish” statistic

**Requirements:** `05` “Batch statistics” explicitly requires fatigue at finish. `06` §§3/5 requires reliable live overrides and technical race outcomes.

**Locations:** `src/reporting/results.js:21–29` calculates fatigueAtFinish from finishers' **current** beast fatigue. `src/sim/race.js:445–449` locks the finish time but captures no fatigue snapshot at that crossing. `src/dev/overrides.js` permits validated beast fatigue edits for a finished RU while the race is still Running.

**Reproduction:** seed 145; A has attributes 80, lane 0/q=-0.5; B has attributes 20, lane 1/q=-0.5; one lap, random incidents disabled, checkpoint interval 1000. Step until the first finisher, then queue a paused live `beasts.*.fatigue=100` override for that finished entrant and step.

**Observed:** A finishes at **30.06830885492538 s**. At tick 602 the reported fatigue-at-finish average is **2.8272161057982124**. After the override, with the same official finish time and still exactly one finisher, the historical metric becomes **100**.

**Impact:** permitted tuning of current state changes a statistic labeled as a past race outcome. Ordinary no-override batches are not shown incorrect by this probe; the defect occurs when supported live editing and historical reporting are combined.

**Recommended correction:** capture per-beast fatigue at the qualifying finish crossing as authoritative historical data and derive the metric from it. Keep current editable fatigue separate. Include the captured data in replay/checksum state, test live edits after finish, and verify technical/batch reporting uses the historical measurement without blocking legitimate edits to current state.

### B04 — Low: the named photo-finish fixture does not exercise its declared case

**Requirement:** `05` “Test fixtures” requests reproducible named scenarios with expected invariants; T20 specifically requires actual same-time finishing/tie behavior.

**Locations:** `tests/fixtures.js:17–21` and line 78 define finish_photo and its tie invariant. There are no opening commands or associated catalog preparation steps for it. `tests/audit-regressions.test.js:92–105` only verifies that each invariant list exists, then steps each catalog setup once and checks state/determinism; it does not evaluate the declared final outcome.

**Observed:** running `scenario('finish_photo')` to completion yields A at **41.5557402640795 s**, B at **42.40616306718724 s**, places 1 and 2. The gap is **0.8504228031077408 s**, exceeding the configured **0.001 s** tolerance.

**Assessment:** the catalog entry does not reproduce a photo finish by itself. This is a fixture quality/coverage issue, **not** evidence that tie handling is broken: the separate existing T20 simultaneous-finish test passes. The update closes the old missing-name requirement but its catalog smoke test cannot support a claim that every advertised scenario outcome was exercised.

**Recommended correction:** encode the necessary setup/preparation/action trace for each named scenario and assert its defining outcome. Make finish_photo actually produce a same-time finish and tie. Reuse the existing focused T20 scenario instead of adding metadata-only duplicate coverage.

## Remaining release gate

**T25 remains BLOCKED / unverified.** The new browser run again rejects direct `file://` navigation and labels its fallback “http diagnostic only.” Nineteen successful functional checks, no extra runtime requests, a self-contained rebuild and exact artifact parity are positive evidence, but they do not replace actual offline file execution.

Run this exact artifact from a local file in a permitted modern desktop browser with network disabled, no server and no adjacent files. Record the browser/version, artifact hash, console/resource evidence and setup-through-results/replay/config flows. Do not bypass the managed policy. This is an environment verification limitation, not proof the HTML fails under an unrestricted browser.

## Coverage limits and recommendations

The passing suite and extra weather sample found no new occupancy/integrity failure, stall or core race-completion regression in the tested cases. They do not prove correctness for every configuration, contact graph, platform or live-edit sequence. The new probes are headless engine/reporting checks; no separate browser automation of B01/B03's exact adversarial setups is claimed. No cross-browser, mobile, prolonged memory/performance, full accessibility or final balancing certification was performed.

Recommended order:

1. Correct B01 execution-aware telemetry and B03 immutable finish measurements, with cross-feature replay/report regressions.
2. Implement/document the missing B02 surface hazard dimension within the approved model, or secure an explicit scope exception.
3. Strengthen B04's named fixture to exercise and assert its promised outcome; audit the remaining catalog entries the same way.
4. Re-run regressions/browser parity, rebuild after source changes, and record the new artifact hash/version compatibility.
5. Close T25 with real offline local-file evidence before final acceptance.

**Acceptance recommendation:** retain the current “implementation reviewable; final acceptance blocked” status. Credit the original fixes; do not treat those specific counterexamples or a green 114-test run as comprehensive proof of the update's completeness.

## Reproduction

From the project root:

```sh
npm test
npm run build
npm run test:browser
node docs/audits/evidence/reproduce-findings.mjs
node docs/audits/m4-update-evidence/reproduce-findings.mjs
sha256sum -c reports/m4-update-evidence/snapshot.sha256
```

The first probe script should report the original three defects no longer reproduced. The second prints this audit's new counterexamples and observations; it is audit evidence, not a game regression test or a proposed fix. Preserve these evidence files when implementing a later update.
