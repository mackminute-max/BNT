# M5 Delivery 1 — Executed test evidence

Final source is the uncommitted manifest-bound candidate; HEAD `6f01da6d9cc0a79fecf9d38cd55989e17fb2651c` remains unchanged. No commit/push/merge/deployment occurred.

## Environment and inventory

Linux managed workspace, Node 24.22.1, Chromium 156.0.8078.79, Python 3.12.14; existing esbuild/playwright-core retained. Commands run from `/workspace/BNT`; absolute evidence destinations in the scripts match this workspace. No dependency installation/update.

Baseline frozen accepted M4: **888 pass, 0 fail, exit 0**, `evidence/frozen-baseline-node.log`. Final complete inventory: **930 pass**, raw process exit **0**. New M5 test file adds 42 tests; original 888 tests and golden data were not removed or weakened. Earlier intermediate full runs (926, 929 and 930) are not substituted for the final captured-exit verification.

## Final sequential command ledger

Actual process results are persisted in [verification-exits.json](evidence/verification-exits.json). A missing entry means not completed, never an assumed pass. Native timing and capacity comparisons in this final verification run are separate from earlier concurrent-load diagnostics.

| Command | Raw exit | Evidence |
|---|---:|---|
| `python3 scripts/m5-d1/compile-content.py` | 0 | [log](evidence/verify-content.log) |
| `node scripts/m5-d1/idb-proof.mjs` | 0 | [log](evidence/verify-idb.log) |
| `node scripts/m5-d1/worker-faults.mjs` | 0 | [log](evidence/verify-worker-faults.log) |
| `node scripts/m5-d1/real-quota.mjs` | 0 | [log](evidence/verify-quota.log) |
| `node scripts/m5-d1/packages-proof.mjs` | 0 | [log](evidence/verify-packages.log) |
| `node scripts/m5-d1/starter-boundaries.mjs` | 0 | [log](evidence/verify-starter-boundaries.log) |
| `node scripts/m5-d1/smoke-browser.mjs` | 0 | [log](evidence/verify-smoke.log) |
| `node scripts/m5-d1/references.mjs` | 0 | [log](evidence/verify-references.log) |
| `node scripts/m5-d1/clock-parity.mjs` | 0 | [log](evidence/verify-clock.log) |
| `node scripts/m5-d1/performance-native.mjs` | 0 | [log](evidence/verify-native-performance.log) |
| `node scripts/m5-d1/capacity-idb.mjs` | 0 | [log](evidence/verify-capacity-idb.log) |
| `npm test` | 0 | [log](evidence/verify-full-node.log) |

Build commands: `node scripts/m5-d1/build.mjs` twice, raw exits from [build-verification.json](evidence/build-verification.json); byte identity `True`. HTML size 4,363,707 bytes; SHA-256 `efd9c6c1a3d685173f06752931d666e1860795500685f20b8e235f9aac8352ad`. Accepted M4 SHA remains `d77e49e40457c5de0255e3c95779941bec67023a4760248a69760f60b7a8d60c`. Builder includes offline/external-dependency checks and embedded worker/viewer/practice integrity guards.

## Dedicated acceptance results

- IDB browser: **19 groups**, actual atomic birth abort, two-connection stale generation/read-set rejection, previous root, GC reachability, explicit monotonic recovery, missing-root detection/independent clock, exact multi-chunk restore staging, missing chunk rejection and no current-root mutation.
- Actual inline worker + actual M5 IDB: **25 groups**, interrupted creation/restore, worker failure/restart, native equipment acquisition lost acknowledgment/retry, protected caller-options rejection, export/restore/duplicate/foreign integrity checks, corrupt body rejection and exact-backup repair, confirmed prior recovery, active unfinished restart from tick0, zero playback writes, real native clearance, actual official-commit IDB abort and identical retry. No synthetic finish/result replaces this race.
- Real Chromium quota: **5 groups**, CDP quota set before first IDB open. 1 MiB permits actual M5 birth; legal-size pressure and multi-chunk restore produce actual `QuotaExceededError`. No acknowledgment/current/previous mutation, no partial stage. Pressure body is an isolated backend fixture, not claimed as a valid native race session. Initial 256 KiB budget also rejected birth; retained as diagnostic evidence, not a failed gameplay assertion concealed by changed data.
- All five packages: real M5 current initialization, 23 generated offers, exact package Gold, zero starting LP, native registration, one actual native tick and cold current reconstruction.
- Zero/one starter: eligibility is privately seeded in a clearly marked fixture; production start and typed no-starter/native result publication then cold-load. Zero awards/participation/condition effects for NoStarters; one starter runs real native simulation.
- Packaged UI: **6 groups**, actual new career/generated purchase/full native two-event cycle/reward/settlement/archive/Home renewal/cold page reopen, no page errors; result `PASS`.
- M5 slots: `node scripts/m5-d1/slots-browser.mjs`, raw exit 0 (`evidence/slots-browser.exit`), result `True`; [slots-browser.json](evidence/slots-browser.json) distinguishes candidate tests from historical artifact regressions.
- Six native lifecycle scenarios in [native-lifecycle.json](evidence/native-lifecycle.json): normal, voluntary before start, voluntary after one race, voluntary with native arrears, forced elimination after start, full eight-entrant seven-event championship. Production worker/domain/native simulation with an explicitly identified isolated Map acknowledgment adapter; browser durability is covered separately above.
- Eight consecutive native championships/16 races, normally earned LP, expired contract renewal, 6-LP Recruiters purchase, immediate and later-renewal 24-offer batches, every archive cold validated. [native-repeat.json](evidence/native-repeat.json). No synthetic LP grant.
- 100,004 actual generated identities in 4,348 batches, all 8/13/9 paths; 81 species-pair legality test; fixed rival recurrence/healthy clone reset; new factory goldens; no historical golden changed.

## Historical replay and cross-runtime checks

| Reference | Expected | Actual |
|---|---|---|
| replay-reference-Pure-oval.json.gz | `fe1bfab8` | `fe1bfab8` |
| replay-reference-Pure-C01.json.gz | `1e9d7e68` | `1e9d7e68` |
| replay-reference-Pure-mixed-rally.json.gz | `d13a8fdf` | `d13a8fdf` |
| replay-reference-Combat-oval.json.gz | `79dec048` | `79dec048` |
| replay-reference-Combat-C01.json.gz | `cd29b4b3` | `cd29b4b3` |
| replay-reference-Combat-mixed-rally.json.gz | `38fdb4e1` | `38fdb4e1` |
| replay-autonomous-Pure-oval.json.gz | `821eca67` | `821eca67` |
| replay-autonomous-Pure-C01.json.gz | `c1730efa` | `c1730efa` |
| replay-autonomous-Pure-mixed-rally.json.gz | `4120f7c5` | `4120f7c5` |
| replay-autonomous-Combat-oval.json.gz | `c8fd3ca0` | `c8fd3ca0` |
| replay-autonomous-Combat-C01.json.gz | `3ef47ff6` | `3ef47ff6` |
| replay-autonomous-Combat-mixed-rally.json.gz | `fd015e71` | `fd015e71` |
| payroll-Pure.json.gz | `ad509187` | `ad509187` |
| payroll-Combat.json.gz | `f191ca35` | `f191ca35` |

Clock diagnostic: **100 initial states** and 3 full Pure/Combat Oval/Circuit/Rally captures; result `True`. Exact Node/Chromium championship-clock parity is distinct from any unapproved claim of universal cross-browser numeric portability.

## Existing browser inventory — preserve nonzero exits

Executed configured `npm run test:browser`: **exit 1**, functional HTTP groups pass, direct-file launch denied by browser administrator policy. `node scripts/m2-a-browser.mjs`, `m2-b-browser.mjs`, `persistence-browser.mjs`: **each exit 1**, functional groups pass, file policy block. Logs are retained individually.

Executed `node scripts/m5-d1/accepted-regressions.mjs`: historical accepted-artifact compatibility inventory, not a claim that those old artifacts use M5 persistence. Nine primary scripts exit 0 (browser, features, creation, faults, import, presentation faults, HQ, restart, deletion); file-browser exits 2; nested regressions exits 1. Seven of eight nested scripts exit 0 (references, layout, interface, browser-native, checkpoint-compat, player, E4); legacy exits 1 due file launch policy after functional HTTP checks. Exact per-process exits in `evidence/historical-accepted/raw-exits.json` and nested `regressions/all-exits.json`. No completely passing browser-suite claim.

Candidate direct `file://` diagnostic exits **2** with `ERR_BLOCKED_BY_ADMINISTRATOR`, zero network requests. Windows Chrome/Edge offline acceptance is **not executed here**, and is required by the delivered owner checklist. HTTP tests do not substitute.

## Failed diagnostics, correction and disposition

- Acquisition fixture initially lacked native driver capacity. Fixed the fixture through the real paid quarters purchase; no capacity assertion removed.
- UI/clock polling initially referenced undeclared `BNT_M1` during reload/bootstrap. Corrected diagnostic polling to `globalThis.BNT_M1`; no production simulation behavior change.
- A recovery test initially expected rejection of a still-retained acknowledged purchase. Corrected it to require idempotent acknowledgment **and** reject a different unacknowledged stale command. Financial effects remain checked.
- Initial large-backup fixture used an invalid non-hash root witness. Replaced it with the real record digest; integrity assertion remains unchanged.
- Actual large restore then exposed Chromium's single-value structured serialization limit. Production staging now atomically chunks and hashes temporary restore data; original failure logs retained. Large complete restore and missing-chunk/quota rollback are rerun; no application bound was raised.
- 128-rival name exhaustion remains an explicit safe-rejection stress limitation, not reported as pass or repaired with generic names.
- Early performance runs overlapped verification and are labeled concurrent; final sequential benchmark results supersede them for controlled comparisons.

## Evidence limits

Synthetic 500-championship/5,000-race/50,000-operation storage stress is not native gameplay. Main heap values are samples, not exact peak or isolated worker-heap measurements. Browser quota estimates are estimates; highly repetitive synthetic history compresses unusually well. No indefinite lifetime, Windows owner acceptance or Delivery 2 balance acceptance is claimed.
