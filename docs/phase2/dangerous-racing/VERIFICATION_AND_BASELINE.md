# Baseline, instrumentation and verification

## Preserved baseline

- Git revision: `e8cb4bc53bca7052b9b05a788f5810e1f070b2b3` (clean tracked baseline before investigation additions).
- Simulation: **0.4.2-corrective**, package **0.4.2**; Node **v24.22.1**.
- Existing suite before instrumentation: **154 passed, 0 failed**, log `baseline/tests-before.log`.
- Complete normalized default input: `baseline/default-configuration.json`; byte hashes of existing source, artifact, package, tests and evaluation infrastructure: `baseline/files.sha256`.
- Pre-instrumentation references: seed145 Pure/Combat with full official outcomes, checksum, complete-event SHA256 and RNG, `baseline/references.json`.
- Standalone: `dist/Blood_and_Thunder.html`, **163579 bytes**, SHA-256 **`30cea713001b2e1dfdc0b818605161ba5951d15a44e4b87b2210493451354002`**.

The source is committed at the identified revision; immutable Git plus the byte manifest reproduces the baseline. No source reset or reference replacement was performed. Original numbered documents, audits/corrective evidence, Phase2 reports/data and existing evaluator/test files are unchanged; historical Phase2 FILES.sha256 and baseline file hashes pass in their entirety. The general docs/README index gains a Phase2.1 link; it is not historical evidence or a simulation change.

## Passive measurement architecture

New scripts under `scripts/dangerous-racing/` reuse the Phase2 `execute()` wrapper over the authoritative createRace/step/classification/statistics/capture/replay modules. Observation reads emitted events/captured state; it adds no engine RNG draw, command or event. The only commands in formal cohort/personality workloads are autonomous engine decisions, with no player signs. Diagnostic commanded actions and forced states are explicitly separate datasets. Imposed exposure series use the real resolver and documented artificial exposure resets; they are not replacement physics or ordinary-race samples.

The runner copies the established worker dispatcher into a development-only directory, keeping original tooling unchanged. Progress, cancellation, bounded execution and streamed compressed exports retain actual completed counts. Analysis-only bootstrap RNG is isolated from the simulator. No new npm dependency, runtime source, configuration default, coefficient, framework or standalone asset is introduced.

`diagnose()` joins attack/reaction/damage by authoritative IDs; it stores candidate scores/opportunities, selection, contest outcomes, same-state reactive-bonus threshold contrasts, component conditions and control/wreck provenance. Phase2 sampled motion limitations remain labeled. Damage-prevented component amounts and exact subevent eligibility reasons are unavailable and not invented.

`finish-condition.mjs` reconstructs exact competitive-stop component condition from authoritative DAMAGE events **before the actual RU_FINISHED/RU_RETIRED event ID**, preserving within-timestamp order. It exports all **6560 study entry snapshots**, including individual beasts, under `competitive-stop-condition.jsonl.gz`. No same-time post-stop damage was present in these actual datasets, but an adversarial regression verifies exclusion. Live final condition is kept separately; fatigue uses the existing immutable actual finish snapshot.

## Tests and parity

| Executed verification | Result |
|---|---|
| Pre-instrumentation `npm test` | 154 passed, 0 failed|
| Final `npm test` |**162 passed, 0 failed,0 skipped** (all 154 retained + 8 new evaluation cases)|
| Original baseline references | 2 match checksum/events/RNG/official outcomes|
| Observer-on/off parity |11 reference/study cases, exact full captured state/events/RNG/checksum agreement|
| Default100 vs study10000 checkpoint cadence |Pure and Combat complete-event SHA256/RNG match; full-state metadata checksums legitimately differ with cadence|
| Saved study-row reruns |9 rows match every exported metric after JSON serialization, except nondeterministic wallSeconds|
| Whole-dataset structural checks |820 races/6560 entries, unique IDs/config references/finite finish semantics; no fake nonfinish time or Pure offense|
| Saved compressed replay readback |**28/28** reconstruct through verifyReplay(), full events/checkpoints/final checksum|
| All three clearance stalls |Independently reconstructed; all entrants classified, locked times, persistent blocking wreck; saved geometry/events|
| Baseline file and historical Phase2 manifest |All hashes pass unchanged|
| `npm run build` |Passed embedding/dependency guard; byte-identical 163579-byte HTML|

Evidence: `evidence/verification.json` contains 13 checks (11 reference/study comparisons plus 2 dataset validations); `saved-replay-verification.json` records 28 actual file readbacks; `extra-replays.json`, `clearance-stalls.json`, baseline/historical integrity logs and final tests/build logs provide detail. No numerical tolerance, reference update or test weakening concealed a difference. Standard JSON export normalizes negative zero as in the original evaluator.

New `tests/dangerous-racing.test.js` cases verify frozen allocation/matched Pure setups, legal initially eligible cohorts, default ram-legality containment, exact observer/replay parity in each cohort, defense-threshold interpretation, initially worn versus new serious threshold crossing, balanced grid/surface/traffic assignment, and event-ID chronology for finish condition at identical timestamps.

One initial focused test failed because its same-lane geometry enumeration included overlapping starting tiles. Configuration correctly rejected that illegal state. The test now enumerates only distinct occupied cells; all actual adjacent-lane ram geometries remain covered, production validation is unchanged, and the original failure log is preserved (`focused-tests-initial-failure.log`). The corrected seven-case focus run passed; the added finish-condition case also passes in the final eight-case/full 162 suite. No simulation failure was suppressed.

## Actual workload and performance

- Main cohort target met: 600 Combat +120 Pure, **717 Ended/3 Stalled**, no tool/integrity/tick-bound failures; four workers, **375.34s** observed wall time.
- Separate personality assignment panel: 100 Combat, all Ended, no tool/integrity/tick-bound failures; two workers, **96.63s** observed wall time. It overlapped part of main execution; do not add these numbers as a sequential benchmark.
- Fifteen excluded pilots: all Ended, **9.59s**.
- Mechanism panels:768 short AI probes, 1824 short physical duels, 768 simultaneous groups / 1536 contests, 720 imposed exposure series.
- Full moving-start commanded diagnostics:96 initial +384 follow-up, all 480 Ended, no reported integrity errors. They do not enter ordinary casualty estimates.
- Each formal race bounded at 30000 ticks, 180s worker watchdog; engine default 1200s/20s no-progress safeguards retained. All three actual stalls were post-classification wreck-blocked clearance, with zero safeguard retirements. Neither tool bound was reached. Parallel wall time is host-specific, not a universal performance guarantee.

## Standalone, limitations and acceptance

No browser-runtime file or delivered byte changed. The evaluation did **not modify the standalone application**. Rebuilding confirms the same artifact and development/runtime separation; it does not constitute a new offline launch test. No new managed-browser functional or direct `file://` test was performed in this investigation. Historical managed Chromium file access was administrator-blocked; the earlier HTTP functional evidence is not direct-file verification. Owner-confirmed offline operation retains its original pre-corrective artifact scope and is not silently extended to this hash. Independent local-file verification of the corrected artifact and final owner acceptance remain separate.

One oval/three laps/eight entrants/two beasts, fixed legal input panels, limited independent seed clusters and no human enjoyment assessment limit generality. Forced/commanded diagnostics establish available mechanisms; they do not prove autonomous selection or representative risk. The full-study healthy cohort has zero serious events, not a proof of zero probability. Cohorts, composite surface/traffic strata and nonfinisher censoring must remain separate. The study supports recommendations, not universal correctness or an approved numerical casualty target.

No gameplay coefficient/mechanic was changed, no confirmed core defect was silently repaired, and no commit, push, publication or deployment was performed. Stop at owner review of the specific recommendations.
