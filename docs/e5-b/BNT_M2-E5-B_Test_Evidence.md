# BNT — E5-B Test Evidence

## Tested revision and environment

Runtime: `4322672749091d8f0c7121d7f2d14f3d5bba67a7`, branch `feat/m2-e5-b-championship-progression`. The final full test run used these unchanged production sources. Subsequent changes are reports/evidence and diagnostic runners only.

Node v24.22.1; npm 11.9.0; esbuild 0.28.2; playwright-core 1.65.1; managed Linux Chromium 156.0.8078.79. Evidence directory: `/workspace/deliverables/bnt-e5-b/evidence`. No dependencies were installed or changed.

## Executed commands and raw exits

Commands run from `/workspace/BNT` unless stated. Wrapper scripts redirect generated outputs to new evidence directories; original assertions and golden references are retained.

| Command | Result | Raw exit |
|---|---|---:|
| `npm test` before implementation | 733 passed, 0 failed | 0 |
| `npm test` working revision | 740 passed, 0 failed | 0 |
| `npm test` final runtime | **744 passed, 0 failed**, 0 skipped; 385,763.584095 ms under concurrent correctness workload | **0** |
| `node --test tests/e5-b-foundation.test.js tests/e5-b-lifecycle.test.js` | 9 passed, 0 failed | 0 |
| `node --test tests/e5-b-awards.test.js` | 2 passed, 0 failed | 0 |
| `node scripts/e5-b/native-lifecycle.mjs` | Real four-entrant, two-event native Dustroad run; pending-choice reload, advancement gate, duplicate/conflicting choice, terminal settlement, missing/corrupt proof, write rollback, lost-ack retry and archive assertions passed | 0 |
| `node scripts/e5-b/elimination-proof.mjs` | Synthetic native damage fixture: legitimate start → forced elimination → AI continuation → validated zero-starter finale; four-entry official standings, null champion, no Run offers, terminal Legacy eligibility and reload passed | 0 |
| `node scripts/e5-b/victory-proof.mjs` | Controlled native rival-failure fixture: two distinct full championships, two settlements, two trophy victories, two permanent Legacy selections/archives and earned Ironwheel qualification passed | 0 |
| `node scripts/e5-b/worker-proof.mjs` | Generic settlement rejection; dedicated lost-ack settlement retry; idempotent Legacy retry and conflicting Legacy rejection; worker preparation not durable; reset leaves source unchanged | 0 |
| `node scripts/e5-b/registration-proof.mjs` | Unqualified offer rejection, failed registration write rollback, insufficient entry fee rejection and persistent developer provenance | 0 |
| `node scripts/e5-b/rewards-browser.mjs` | 3 groups passed: explicit enable/register/reload; pending Run recovery/select/reload; pending Legacy recovery/select/archive/reload; no page errors | 0 |
| `node scripts/e5-b/browser.mjs` | 13 existing player/workbench groups; 162 preserved developer control IDs; 14 responsive page/viewport checks; independent offline P2.2 practice; no page errors | 0 |
| `node scripts/e5-b/e4-regression.mjs` | 9 E4 browser groups passed; no page errors | 0 |
| `node scripts/e5-b/existing-regressions.mjs` | Five original P2.2 verification runners all passed, individual exits below | 0 |
| `node scripts/e5-b/legacy-browser.mjs` | Historical artifact: 23 HTTP functional checks passed; direct-file launch blocked by managed policy; **runner not fully passing** | **1** |
| `node scripts/e5-b/build.mjs` (also `npm run build:e5-b`) | Self-contained embedded-worker build; dependency checks passed | 0 |
| Rebuild plus `git diff --exit-code -- dist/Blood-and-Thunder-E5-B-Playable.html` | Byte-identical | 0 |
| `git diff --check` | No whitespace errors | 0 |

The legacy runner uses its original historical HTML, not the new E5-B UI. Its generated evidence is redirected without changing assertions. Its exit 1 is explicitly reported and is not counted as a fully passing browser suite. The E5-B player browser runner separately attempted the new artifact via `file://` and received the same `ERR_BLOCKED_BY_ADMINISTRATOR` restriction.

## Replay and checkpoint verification

`existing-regressions.mjs` executes these original runners, with only output paths redirected:

| Original runner | Evidence | Exit |
|---|---|---:|
| `scripts/p2-2/references.mjs` | All **12 historical plus 2 payroll-context** checksums equal accepted values | 0 |
| `scripts/p2-2/layout-browser.mjs` | Accepted layout assertions passed | 0 |
| `scripts/p2-2/interface-browser.mjs` | Accepted interface assertions passed | 0 |
| `scripts/p2-2/browser-native.mjs` | 100 championship-clock states, 3 complete championship-context captures and delayed replay/checkpoint comparison passed | 0 |
| `scripts/p2-2/checkpoint-compat.mjs` | Historical checkpoint compatibility passed | 0 |

No simulator, AI, combat, physics, weather, Strategy Sign timing, D2 mapping or expected golden reference was changed. The final Node suite retains M1/M2-A/M2-B/M2-C/M2-D/E3/E4/P1/P2 regressions.

## E4 browser evidence

Nine passing groups cover explicit migration/manual start; paused Sign ordering and automatic checkpoint reload; coordinated complete backup/restore; interrupted restore; quota-denied activation without mixed authority; corrupt/incomplete backup rejection; exact journal-backed repair; current/previous-generation retention; lost durable acknowledgment; worker restart; full race publication and replay. Some related operations are grouped in one assertion case.

The tested one-event native replay checksum was `606b450a`. This is fixture evidence, not a replacement historical golden reference.

## Reward/lifecycle coverage

- Pure eligibility cases distinguish DNF continuation from DNS/DQ/withdrawal/elimination and final events.
- Terminal Legacy eligibility requires prior legitimate participation, complete schedule and no voluntary abandonment. DQ does not erase earned eligibility. Final DNF is eligible under these conditions.
- Schema-6 enable/export/import/refresh, ownership/shape/version rejection, stale revisions, old-save rewind protection and rollback are covered. Import increments the existing maintenance revision; serialized gameplay fields remain unchanged.
- Three distinct deterministic choices are generated without consuming native RNG. Wrong scope, altered definitions and offer tampering reject.
- Full shared-place per-race purses and win components are not split. DNF/DQ do not fabricate finish/podium/win components. Null champion earns no title award.
- Pending selections persist before presentation, block progression, accept one confirmed choice and survive reload. Conflicting choices reject. Run selections expire and remain historical; Legacy ownership remains permanent across championships.
- An arbitrary settlement object is rejected. Missing/corrupt native authority and an injected final write failure leave the prior career authoritative. Retry applies income/payroll/condition/history effects once.

## Actual accounting fixtures

The ordinary Dustroad fixture began with 1,200 Gold, paid 25 entry, earned 135 final income and paid 35 payroll: `1,200 − 25 + 135 − 35 = 1,275`. One cycle was settled. The driver and each registered beast earned 6 XP; reputation reached 65. The rival champion correctly meant no player trophy. One permanent Legacy selection and one archive survived reload.

The controlled victory fixture earned 240 income per championship. Reputation reached 110 after the first and 220 after the second; Ironwheel's 100-RP qualification became true. Trophy victory history contains two distinct instance identities, two archives and two permanent selections; no duplicate grant was inferred from repeated UI actions.

The elimination fixture deliberately damages native drivers through the existing test/override journal. It is synthetic casualty evidence, not a claim of naturally occurring elimination frequency. Native classification, D5 clearance, D2 publication, zero-starter proof and final settlement remain the production pathways. The victory fixture likewise uses explicitly synthetic rival failures to control title outcome.

## Storage and performance limits

The pending-Legacy ordinary fixture retained three current logical records totaling **2,228,756 UTF-8 bytes**, largest record **1,311,997 bytes**. The final archived career envelope was **1,333,793 bytes**. These are encoded fixture sizes, not total IndexedDB disk allocation or a maximum-capacity guarantee. Retained previous generations remain governed by E4.

No receipt, journal or protected identity was pruned; no 8 MiB record or other approved bound was raised. Long maximum-field schema-6 capacity and clean latency benchmarks were not measured here. Node/browser correctness runs overlapped, so their durations must not be interpreted as controlled performance comparisons.

## Artifact and acceptance limitation

Artifact: `dist/Blood-and-Thunder-E5-B-Playable.html`.

- Bytes: **1,800,945**.
- SHA-256: **`d9f909a59a78ad3c3a688ce15be6e6d77c2164fde2f16469ade9530cddbae6b8`**.
- Rebuild: identical.
- Accepted E5-A.1/P2.2 artifact hashes unchanged.
- HTTP/offline functional testing: executed as above.
- Windows Chrome/Edge `file://`: **not executed; owner acceptance required**.
- Managed Linux `file://`: blocked by browser policy, not claimed successful.

No merge, push, release or deployment was performed. E5-C integration, full reward mechanics, broader E5-D services and P3/P4 were not implemented.

## Reproduction order

Run the native lifecycle proof before the Worker and reward-browser proofs: it emits the valid pending Run/Legacy fixtures they consume. Then run elimination, victory, registration and Worker proofs, build the HTML, and run the three E5-B/E4 browser runners plus the existing-regression wrapper. The legacy wrapper is intentionally reported separately with its actual exit. All fixtures are isolated synthetic test careers; no owner career or accepted historical evidence is overwritten.
