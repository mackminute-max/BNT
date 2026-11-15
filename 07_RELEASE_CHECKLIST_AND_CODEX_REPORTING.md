# Blood and Thunder — Release Checklist and Codex Reporting Contract

**Status:** Mandatory release gates. Check boxes only after actual verification.

## A. Architecture and rules
- [ ] One authoritative headless simulator, independent of Canvas/DOM/storage/wall-clock.
- [ ] All approved RU attributes and derived characteristics affect outcomes.
- [ ] Both Pure Racing and Combat Racing run on same physics/simulation.
- [ ] Continuous kinematics, adjacent lane changes, swept-path legality, deterministic simultaneous conflicts.
- [ ] Correct aligned grid, common-line lap accounting, fractional finish timing and ties.
- [ ] Autonomous driver AI with personality, filtered perception, distinct error categories.
- [ ] Individual beast fatigue/recovery, driver strain, chariot wear, five weather presets, surfaces, weighted incidents.
- [ ] Six queued signs, three base uses, activation/cancel/replacement/lower rules and compliance telemetry.
- [ ] Contested combat, reactions, incidental contact, component damage and control states.
- [ ] **Wrecks persist as stationary one-tile obstacles until race end**; secondary impacts do not displace or despawn.
- [ ] **Finishers continue beyond finish to safe exit**, then clear; classification locked.
- [ ] Stalled/all-retired race termination explicit; integrity errors not hidden.

## B. UI, developer tools and replay
- [ ] Canvas viewer and readable eight-RU standings/status.
- [ ] Prominent authoritative event-driven radio-style commentary.
- [ ] Pause/resume, speed, one-tick step, player sign controls.
- [ ] Individual and bulk attribute editing; derived values and AI score breakdown.
- [ ] Global/per-sign tuning; movement/fatigue/weather/combat/incident/lethality parameters.
- [ ] Save/load/reset/import/export test configurations with validation.
- [ ] Paused live overrides with tick, old/new and deterministic replay.
- [ ] Batch simulation and statistics.
- [ ] Results: official classification, narrative, technical diagnostics.
- [ ] Seed/config/command replay reproduces authoritative events and checksum.

## C. Automated test evidence
- [ ] All T01–T25 tests in file 05 pass.
- [ ] All applicable E01–E20 edge tests pass.
- [ ] Repeatable seed fixture set is included in development source.
- [ ] Entrant permutation tests show no storage-order bias.
- [ ] No invalid overlapping occupancy, NaN/Infinity, or duplicated stationary contact damage.
- [ ] Same seed/config/commands yields identical results with viewer/commentary on or off.
- [ ] Batch tests run and anomalous outcomes are documented.
- [ ] Each of four milestone gates includes executed tests and a standalone build.

## D. Standalone distribution — critical
- [ ] Final release is **one `.html` file**; all JS, CSS and required assets embedded.
- [ ] File opens directly with `file://` by double-click in a modern desktop browser.
- [ ] Works with network disabled, no server, no runtime Node, no adjacent files.
- [ ] No external scripts/styles/fonts/images, CDN, runtime `fetch()`, or local ES module imports.
- [ ] No required TypeScript, Phaser, React, or external game engine.
- [ ] Browser console shows no blocking errors; gameplay operates from race setup to results.
- [ ] Storage unavailable/blocked does not prevent play; import/export backups work.
- [ ] HTML file rebuilt and verified after the last source change.
- [ ] If GUI/offline launch could not actually be tested, **do not check** those items; report the limitation.

## E. Codex implementation report template

### Milestone [1/2/3/4]
- **Status:** Complete / Incomplete / Blocked
- **Implemented modules and behavior:**
- **Temporary scaffolding still present:**
- **Engineering assumptions introduced or revised:**
- **Automated tests run:** command, passed/failed/skipped, relevant IDs
- **Deterministic seed/scenario evidence:**
- **Standalone HTML artifact:** exact path, size, build command
- **Offline `file://` browser verification:** browser, method, result, or not performed
- **Known limitations / regressions / risks:**
- **Next milestone prerequisites:**

### Final delivery
- **Standalone HTML path and size:**
- **Source/test directory or optional development archive:**
- **Test summary:**
- **Offline launch verified:** yes/no, with evidence
- **Unmet acceptance requirements:** explicit list, never concealed
- **Reproduction instructions:** launch HTML; run tests; run fixed seed; import replay
- **Final note:** distinguish functional features from planned/deferred content.

## F. Definition of acceptance
A release is acceptable only when the prototype is **mechanically complete** per the approved racing scope, the test evidence is truthful, and the delivered one-file HTML actually runs offline. A visual demo, partially simulated race, or framework-dependent development build is not a substitute.
