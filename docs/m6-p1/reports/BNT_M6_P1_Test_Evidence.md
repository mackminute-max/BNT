# M6-P1 test evidence

All reported results come from executed commands. Counts overlap between targeted and full suites; they are not added together. The `acceptance-node` complete suite uses the final frozen copy; earlier full suites are explicitly preceding iterations. It uses a frozen copy of source/tests; runtime source hashes are checked again at delivery.

| Run | Tests | Pass | Fail | Skipped | Raw exit |
|---|---:|---:|---:|---:|---:|
| baseline-frozen-node | 1394 | 1394 | 0 | 0 | 0 |
| final-node | 1415 | 1415 | 0 | 0 | 0 |
| final-frozen-node | 1435 | 1435 | 0 | 0 | 0 |
| acceptance-node | 1436 | 1436 | 0 | 0 | 0 |
| emergency-targeted | 16 | 16 | 0 | 0 | 0 |
| p1-targeted-final | 42 | 42 | 0 | 0 | 0 |
| p1-targeted | 25 | 25 | 0 | 0 | 0 |
| domain-regression | 42 | 42 | 0 | 0 | 0 |

## Determinism and compatibility

Historical/payroll references: 14 exact unchanged comparisons. Clock proof: 100 initial states, 14 full/ability comparisons, pass=True. See `references.json`, `championship-clock/parity.json`, and `legacy-continuity.json` for exact checksum pairs. The latter compares all nine frozen-v2 cases and old save/pending-offer reconstruction against the accepted archived runtime. Checkpoint/restart equality is also covered for every new-context ability. No expected checksum was changed.

## Actual packaged execution

| Command | Raw exit | Coverage |
|---|---:|---|
| `node scripts/m6-p1/recruitment-browser.mjs` | 0 | Original HTML failure; corrected Home hire, exact identity/sex, navigation without writes, cold reload |
| `node scripts/m6-p1/regional-hire-browser.mjs` | 0 | Ordinary registration/native race/reward followed by direct Regional driver Hire; frozen team unchanged |
| `node scripts/m6-p1/smoke-browser.mjs` | 0 | Owned Practice, frozen names in standings, native first event, Run choice, regional purchase, complete native championship, final selection/archival/reload |
| `node scripts/m6-p1/den-browser.mjs` | 0 | Fitted map/radio/table layout, named teams/wager, play/pause/reload and three actual native spectator settlements |
| `node scripts/m6-p1/creation-browser.mjs` | 0 | Owner nationality/ancestry/sex creation and initialized schema8 |
| `node scripts/m6-p1/barn-browser.mjs` | 0 | Original missing-control reproduction; restored driver/chariot/beast actions, reload and frozen registration |
| `node scripts/m6-p1/emergency-browser.mjs` | 0 | Ordinary paid purchases/termination, native emergency hire/activation, reload, registration and actual viewer race |

The smoke test first event uses ordinary viewer controls. Its accelerated second-event tail uses the public race/controller API with real native simulation and zero ordinary playback writes; it is not described as entirely ordinary UI execution. Home/Regional recruitment tests use ordinary controls; inspections read state without modifying it.

## Native and synthetic proof separation

- Generated Home acquisition matrix: 26 ancestry/sex cases. Epoch1 renewal is explicitly seeded diagnostically; every acquisition then uses native protected commands, exact-price checks, duplicate retries and cold reconstruction.
- Repeated native championships: 8; a subsequent native Prestige loss/retry verifies fixed-offer and fee behavior. No synthetic funding/unlocks in that sequence.
- Largest regular schedule: 7 real native events, field 8; prior unlock/funding is synthetic. Final current record: 438366 bytes / 1 record.
- Seven-national-victory Sundaran qualification is a synthetic prior-progress fixture followed by actual native registration/cold load; not an organically played seven-nation campaign.
- Zero/one-starter tests seed ineligibility privately and use real authoritative start/classification/publication.
- Rare ties, voids, DQ, invalidity, caps and arithmetic boundaries use identified unit/fault fixtures; no claim those all occurred organically.
- Rotated-grid comparison: 24 actual native races; affinity assessment: 117 paired100-tick native comparisons with equal synthetic RU stats.

## Faults, quotas, backup and retention

Worker faults, current/previous recovery, interrupted creation/restore, lost acknowledgments, stale revisions, official and terminal commit abort/retry, complete backup and corruption/ownership checks are in `worker-faults.json`. Real Chromium quota override denial and multi-chunk staging rollback are in `real-quota.json`; injected failures are preserved. Financial anchors and protected publication validators were not relaxed.

Large real-IDB proof: 14665443 logical bytes in 8 records; backup 29487819 bytes; restored exactly; compacted current record 438388 bytes. Current and previous roots/GC were checked. Timings under concurrent verification load: commit 1795.1000000005588ms, load 739.8999999994412ms, validation 12341.299999999814ms, backup 14063.800000000745ms, restore 55794.799999999814ms; longest main-thread task 1727ms. These are diagnostics, not controlled performance comparisons.

## Historical browser scripts: raw exits

| Script | Exit |
|---|---:|
| browser | 0 |
| features-browser | 0 |
| creation-browser | 0 |
| faults-browser | 0 |
| import-browser | 0 |
| presentation-faults-browser | 0 |
| hq-browser | 0 |
| restart-browser | 0 |
| delete-browser | 0 |
| file-browser | 2 |
| regressions | 1 |

A script with passing functional groups and a nonzero process exit is not a fully passing script. Candidate file-browser exits1 with `ERR_BLOCKED_BY_ADMINISTRATOR` in managed Chromium. Historical file-browser exits2 for the same environment policy; inspect the regression wrapper’s nested raw-exit files for its legacy sub-runner. Windows Chrome/Edge file-origin acceptance is not claimed.

## Intermediate failures and limitations

An initial in-place baseline overlapped edits and is superseded by the frozen1394-test baseline. Its synthetic Sundaran fixture lacked refreshed visual metadata after manually replacing Den inputs; the fixture now refreshes its derived projection before validation, retaining every guard. Initial frozen launch from the wrong directory exited254. Final source review additionally found that authored specialist ancestry must take precedence over generated fallback; this was corrected and explicitly tested before the last frozen suite and rebuilt packaged checks. Iterative new tests first exposed inadequate test capacity/funding, a reference driver mode that intentionally does not integrate fatigue, and one copied diagnostic import path. Those harness issues were corrected; no goldens or production authority were weakened. The original aggregate core-check command retains its exit1 from the copied Sundaran import path; the corrected individual Sundaran rerun is recorded separately.

The owner resolved the emergency gap with a versioned neutral-affinity policy. It is implemented and tested in emergency-native.json, emergency-idb.json, emergency-browser.json, emergency-employment.json and the emergency unit file. The ordinary-control test also exposed missing Barn bindings; these were restored and tested against original/corrected HTML. Large backup/restore blocking remains a documented technical limitation. No complete all-browser/Windows acceptance or exhaustive final balance is claimed.

## Build

`node scripts/m6-p1/build.mjs` twice; `cmp` raw exit 0. Artifact **Blood-and-Thunder-M6-P1-Playable.html**, **5869373 bytes**, SHA-256 **6f527a9809757c7a18be4fec354dd4da29db5e4e610ae1352d58decaef64030d**. Build-time offline/dependency checks reject external runtime assets/imports. The original M6 HTML remains byte-identical.
