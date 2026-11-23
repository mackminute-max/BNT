# Blood and Thunder — M3-BC-P1 Test Evidence

## Source and environment

Branch `feat/e5-d-m1-startup-slots-options`, unchanged HEAD `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`; candidate remains uncommitted. Exact frozen working-tree source is in `BNT_E5-D_M3-BC-P1_Source_Manifest.json`. Node24.22.1, npm11.9.0, managed Linux Chromium156.0.8078.79, esbuild0.28.2, playwright-core1.65.1. No dependencies installed/updated. Earlier accepted source changes and untracked documents were preserved.

## Final exact-source verification

Artifact SHA-256: `5996a56df462c320374dc334501fc93781d4ed79f23cf845d2742b2e8629dbe8`. Two candidate builds are byte-identical.

| Command executed | Raw exit | Outcome |
|---|---:|---|
| `npm test` | 0 | Final frozen-source full suite: **848 passed,0 failed** |
| `node scripts/e5-d/m3-bc-p1/build.mjs` (twice) | 0,0 | New self-contained HTML; accepted prior artifact hashes checked; embedded worker and offline references verified |
| `cmp dist/Blood-and-Thunder-E5-D-M3-BC-P1-Playable.html /workspace/deliverables/e5d-m3-bc-p1/evidence/first-build.html` | 0 | Exact reproducibility |
| `node scripts/e5-d/m3-bc-p1/browser.mjs` | 0 |17 packaged player-flow groups |
| `node scripts/e5-d/m3-bc-p1/delete-browser.mjs` | 0 |4 deletion/failure/isolation groups |
| `node scripts/e5-d/m3-bc-p1/run-browsers.mjs` | 0 | Wrapper completed; includes explicitly reported direct-file exit2 below |
| `node scripts/e5-d/m3-bc-p1/features-browser.mjs` | 0 | 8 groups passed |
| `node scripts/e5-d/m3-bc-p1/creation-browser.mjs` | 0 | 7 groups passed |
| `node scripts/e5-d/m3-bc-p1/faults-browser.mjs` | 0 | 7 groups passed |
| `node scripts/e5-d/m3-bc-p1/import-browser.mjs` | 0 | 3 groups passed |
| `node scripts/e5-d/m3-bc-p1/presentation-faults-browser.mjs` | 0 | 4 groups passed |
| `node scripts/e5-d/m3-bc-p1/hq-browser.mjs` | 0 | 10 groups passed |
| `node scripts/e5-d/m3-bc-p1/restart-browser.mjs` | 0 | 4 groups passed |
| `node scripts/e5-d/m3-bc-p1/file-browser.mjs` | 2 | BLOCKED: file:// ERR_BLOCKED_BY_ADMINISTRATOR; not Windows acceptance |

**64 candidate HTTP functional groups passed** across the nine successful player/feature/deletion/restart runners. These groups are not added to the848 Node test count. The browser wrapper permits the documented file-runner exit2; its0 exit must not be interpreted as every browser context passing.

Final Node summary:

```text
ℹ {"format":"Combat","course":"mixed-rally","checksum":"25aec856","tick":1761,"checkpointBytes":105676,"remaining":1}
ℹ {"defaultCombatRallySessionBytes":4094851,"tick":1485}
ℹ tests 848
ℹ suites 0
ℹ pass 848
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 543456.519103
```

`frozen-node.log/.exit`, `gameplay-current.log/.exit`, `delete-current-2.log/.exit`, `browser-runners-current.log/.exit`, individual `*-final.log`, JSON reports and `browser-exits.json` retain raw outcomes.

## Baseline and intermediate evidence

The preceding M3-BC report recorded835 Node tests. This candidate adds13 tests in `tests/e5-d-m3-bc-p1.test.js`; existing tests/fixtures are unchanged. An intermediate P1 run passed847/847 before the final manifest rejection test and final safeguards; it is preserved as `intermediate-node-847.log` and is not substituted for the final848 run. An earlier isolated12-test run passed; final full-suite evidence supersedes it.

## Additive native/protocol tests

- Oval, Combat Circuit and Combat Rally advances leave durable source bytes unchanged; same-worker re-entry retains tick20 and cold worker starts tick0 from exact frozen setup.
- Native terminal prepare and official result use two durable boundaries; final native digest equals direct existing engine; repeated official publication is idempotent.
- Unfinished and stale-source publication rejects without changing career/session authority.
- Valid historical partial sessions are validated then restarted; corrupt sessions reject rather than being ignored or rerolled.
- Native queue/replacement/cancel costs and starting activation remain exact; terminal transcript replay preserves full native state.
- Own acknowledged commentary/metadata changes can rebase only an unchanged mechanical career/source session; foreign revision changes reject.
- Real native Oval/Circuit/Rally crossing tests assert exact activation tick and no unrelated activation, followed by complete replay equality.
- Eight-entrant Pure Long Rally compares full terminal native state and retained record bounds.
- Cold manifest mismatch rejects before accepting an in-memory race.

## Browser fault and usability coverage

Deletion4groups cover named confirmation and keyboard cancellation; unconfirmed/foreign/stale request rejection; atomic retirement denial rollback; index cleanup failure quarantine; stale-writer prevention; idempotent cleanup retry; inactive and active deletion; accurate partial-failure messaging; safe title return; exact unrelated profile/Legacy/config preservation.

Restart4groups close/reopen actual browser contexts during unfinished Oval/Circuit/Rally, compare seed/setup and tick0 with no fee/career mutation, deny native preparation and verify rollback, retain native prepare across closure, inject official commit lost acknowledgment and retry exactly once, and restore finalized session-v2 complete backup into an empty destination.

Packaged gameplay17groups run two actual native races, queued Signs and pause/speed controls, alternate radio OFF/ON while paused without native-state/input mutation, explicit finalization, Run selection/reload, final settlement and Legacy selection, isolated careers, Options keyboard behavior,140management navigations and unique global controls. The existing MainM3/E4 feature runners retain legacy import/export, sidecar pin, radio default, all commentary templates, failure and recovery coverage. They do not replace official transactions with UI-calculated outcomes.

## Existing reference/browser inventory

Command: `node scripts/e5-d/m3-bc-p1/regressions.mjs`. Raw wrapper exit **1**; per-runner exits below. This evidence was gathered on an earlier P1 build before the final manifest/error-text safeguards; protected native/core source and corresponding golden data are unchanged. Final848 Node tests and64 candidate functional groups separately verify the final source/artifact. The wrapper redirects evidence and opens the accepted artifact appropriate to each historical runner; do not mislabel every historical-artifact test as a final-candidate UI test.

| Wrapped existing runner | Raw exit | Verified scope |
|---|---:|---|
| references |0|12historical+2payroll exact references |
| layout-browser |0|Accepted responsive layout regressions |
| interface-browser |0|Accepted in-race interface regressions |
| browser-native |0|100Node/Chromium championship-clock states,3full context captures, delayed replay/checkpoint |
| checkpoint-compat |0|18exact legacy checkpoint wire/restored-continuation comparisons |
| player |0|Accepted E5-C.1 player flows |
| e4 |0|9existing durability, backup/restore, corruption, quota, acknowledgment/restart groups on P1 artifact |
| legacy |1|23HTTP functional checks passed; actual file launch denied by managed policy |

Evidence: `evidence/regressions/all-exits.json`, per-runner `exit.json`, `process.log` and JSON. No expected checksum was edited.

### Reference values

| Kind | Fixture | Expected | Actual |
|---|---|---|---|
| historical | replay-reference-Pure-oval.json.gz | fe1bfab8 | fe1bfab8 |
| historical | replay-reference-Pure-C01.json.gz | 1e9d7e68 | 1e9d7e68 |
| historical | replay-reference-Pure-mixed-rally.json.gz | d13a8fdf | d13a8fdf |
| historical | replay-reference-Combat-oval.json.gz | 79dec048 | 79dec048 |
| historical | replay-reference-Combat-C01.json.gz | cd29b4b3 | cd29b4b3 |
| historical | replay-reference-Combat-mixed-rally.json.gz | 38fdb4e1 | 38fdb4e1 |
| historical | replay-autonomous-Pure-oval.json.gz | 821eca67 | 821eca67 |
| historical | replay-autonomous-Pure-C01.json.gz | c1730efa | c1730efa |
| historical | replay-autonomous-Pure-mixed-rally.json.gz | 4120f7c5 | 4120f7c5 |
| historical | replay-autonomous-Combat-oval.json.gz | c8fd3ca0 | c8fd3ca0 |
| historical | replay-autonomous-Combat-C01.json.gz | 3ef47ff6 | 3ef47ff6 |
| historical | replay-autonomous-Combat-mixed-rally.json.gz | fd015e71 | fd015e71 |
| payroll | payroll-Pure.json.gz | ad509187 | ad509187 |
| payroll | payroll-Combat.json.gz | f191ca35 | f191ca35 |

## Performance evidence and failed attempts

Controlled commands:

```sh
node scripts/e5-d/m3-bc-p1/profile.mjs baseline controlled-4x-
node scripts/e5-d/m3-bc-p1/profile.mjs after final-4x-
```

Both exited0. See the performance report and valid `profile-controlled-4x-baseline.json` / `profile-final-4x-after.json`. Earlier failed profiling attempts had fixture/harness problems: schema6 UI action availability, negative eight-field helper points, output naming and playback-rate units. The zero-row/unprefixed early report is not accepted measurement evidence. Timing is not claimed under concurrent verification load.

Earlier browser harness failures were retained: a selector initially matched both new Delete and existing Load buttons; deletion API tests initially passed a creation response with an extra field instead of the canonical stored slot; an asynchronous render assertion raced cleanup; HQ label checks expected older Run/Legacy wording. Harnesses now select the real intended control/canonical slot, await the operation and accept the authorized new exact labels while preserving state, identity, transaction, count and navigation assertions. Existing original runners and golden files were not weakened or edited. A genuine source issue in partial-deletion failure messaging was corrected before the final frozen run; it no longer falsely reports all data preserved.

## Limits and disposition

No new critical failure is observed in the supported managed HTTP test path. Actual file launch is blocked by environment policy; Windows Chrome/Edge offline acceptance remains pending. Native finalization may be slow for large histories; measured improvement is ordinary playback and Sign transport, not a claim of universal capacity or durable mid-race recovery. Storage permanence, browser quotas and successful download-to-disk are not guaranteed.

**Recommendation: owner Windows acceptance candidate. No later milestone, merge, commit or push is authorized by these results.**
