# Blood and Thunder — M3-UI Test Evidence

## Exact source and artifact

Branch `feat/e5-d-m1-startup-slots-options`, unchanged HEAD `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`. Source remains uncommitted; use the supplied source manifest/frozen production hashes to identify this candidate. Accepted P1 artifact remains unchanged at SHA-256 `5996a56df462c320374dc334501fc93781d4ed79f23cf845d2742b2e8629dbe8`.

Final artifact: `Blood-and-Thunder-E5-D-M3-UI-Playable.html`, **3,121,381 bytes**, SHA-256 `d6a2153249e2a0987d5f073e515f8e8f79ec764367bd7b130079f34bdcf89dc3`. Two frozen builds are byte-identical. No dependency was installed or updated. Environment: Node 24.22.1, npm 11.9.0, managed Linux Chromium 156.0.8078.79, esbuild 0.28.2, playwright-core 1.65.1.

## Executed final commands

| Command | Raw exit | Actual result |
|---|---:|---|
| `npm test` |0|**860 passed, 0 failed**, final frozen source |
| `node --test tests/e5-d-m3-ui.test.js` |0|12 additive selection/compatibility tests |
| `node scripts/e5-d/m3-ui/browser.mjs` |0|10 final packaged workflow groups, including two native races |
| `node scripts/e5-d/m3-ui/keyboard-browser.mjs` |0|2 keyboard/legacy persistence groups |
| `node scripts/e5-d/m3-ui/legacy-load-browser.mjs` |0|7 historical save-generation load/browse groups |
| `node scripts/e5-d/m3-ui/candidate-regressions.mjs` |0|37 candidate HTTP groups; raw file-runner exit2 below |
| `node scripts/e5-d/m3-ui/regressions.mjs` |0|Accepted baseline browser inventory and historical runners; wrapper0does not erase nonzero child exits |
| `node scripts/e5-d/m3-ui/build.mjs` (twice) |0,0|Embedded Worker and offline dependency verification, accepted artifact preservation |
| `cmp dist/Blood-and-Thunder-E5-D-M3-UI-Playable.html /workspace/deliverables/e5d-m3-ui/evidence/first-frozen-build.html` |0|Exact byte identity |
| `node scripts/e5-d/m3-ui/profile.mjs baseline controlled-` |0|Controlled accepted-P1 performance sample |
| `node scripts/e5-d/m3-ui/profile.mjs after controlled-` |0|Controlled candidate sample, after regression load ended |

**56 candidate HTTP functional groups passed**, including schema 1/2/3/4, foundation-only schema 5, controller-enabled schema 5 and schema 6 loads with exact unchanged career bytes. These are separate from 860 Node tests. Actual direct-file execution remains blocked by managed browser policy and is not reported as a pass or Windows acceptance.

Final Node summary:

```text
ℹ tests 860
ℹ suites 0
ℹ pass 860
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 436378.62046
```

Raw logs: `node-delivery.log/.exit`, `candidate-frozen.log/.exit`, `browser-frozen.log/.exit`, `keyboard-frozen.log/.exit`, `candidate/raw-exits.json`, `accepted/raw-exits.json`, build logs and profile JSON/exit files.

## Candidate browser child exits

| Runner | Raw exit | Functional groups |
|---|---:|---:|
| features-browser |0|8|
| creation-browser |0|7|
| faults-browser |0|7|
| import-browser |0|3|
| presentation-faults-browser |0|4|
| restart-browser |0|4|
| delete-browser |0|4|
| file-browser |2|BLOCKED file://|

Candidate wrappers reuse the original P1 assertions against the new HTML and redirect evidence. One feature-test navigation target moves from Staff to Market because recruitment now belongs to Market; native identity, purchase, preference and state-equality assertions are retained. Original runner source and reference data remain unchanged.

## Required coverage

| Area | Evidence |
|---|---|
| Driver/chariot activation, replacement, deactivation | Pure tests use real purchased assets; packaged cards commit, reload and restore correct IDs |
| Ordered beasts and third replacement | Native two-slot limits; separate Slot 1/Slot 2 choices; Escape cancellation preserves exact lineup; no duplicates |
| Invalid/unavailable/occupied/expired assets | Shared native component rules, pure boundary tests, strict foreign-reference rejection |
| Frozen registered RU | Actual registration uses displayed driver/chariot/ordered beasts; active Barn controls disabled and frozen state exact |
| Qualified/unqualified events | Dustroad selection free; Ironwheel disabled with actual100 Reputation shortfall; native Details/awards present |
| Illegal/eligible registration | Incomplete lineup disables Register; legal composition confirms25 Gold once and hides redundant offer workflow |
| Navigation |200 HQ page changes, zero IDB puts, exact career equality; Return to Barn retains selected event |
| Home | Authoritative identity/stats, placeholder refs, removed panels/buttons, Stable Progress, Go Race / Continue navigation |
| Save Game | Both locations verify an existing committed generation without a new write; storage-denied activation rolls back |
| Real championship lifecycle | Two native races → official results → Run choice → final settlement → pending Legacy disclosure → owned Legacy / Last Event archive |
| Backup | Final sidecar-v2 team, preference, protected history and native session evidence restore exactly into an empty destination |
| Legacy and M3-BC | Envelope1/sidecar1 compatibility; new default radio ON, old native OFF, immutable pack and all presentation mappings retained |
| Keyboard/responsive | Enter activation/deactivation and reload; Escape Back/cancel; native focus targets;390px Home/Barn overflow checks and screenshots |
| P1 | In-memory advances and Signs; unchanged cold restart; native prepare/official commit; stale/quota/lost-ack safety; three-format restart runner |
| Deletion | Confirmation/cancel, active/inactive, stale/foreign, retirement failure/quarantine and unrelated profile/config protection |

## Additive Node cases

Twelve tests cover: partial deactivation/reload/reactivation and original pin/radio; ordered chariot/beast fill; explicit third-beast replacement; stale/denied write rollback; active championship locks; foreign references and career import round trip; real driver/chariot purchases/replacements; unavailable/Major/occupied/expired eligibility; unsupported fields/version/owner and rollback rejection; modern pack/default radio retention through sidecar2and cold import; selected-partial-asset sale rejection until deactivation; foundation-only historical schema-5 dashboard rendering without facts or mutation.

The original848-test baseline is historical accepted evidence, not a newly executed baseline command here. Initial implementation runs passed 857 tests before the final two additive cases and 859 before final UI-only polish; their logs are retained. The final 860 run uses the frozen source. No existing test or golden fixture was modified.

## Accepted baseline inventory / historical runner exits

The accepted P1 artifact is separately exercised to protect its retained behavior. Do not count those artifact checks as final-candidate UI tests. The outer wrapper runs all original P1 browser groups (64) and historical layout/interface/native/checkpoint/player/E4/legacy runners, redirecting their output only. Raw exits:

| Accepted wrapper child | Raw exit |
|---|---:|
| browser |0|
| features-browser |0|
| creation-browser |0|
| faults-browser |0|
| import-browser |0|
| presentation-faults-browser |0|
| hq-browser |0|
| restart-browser |0|
| delete-browser |0|
| file-browser |2|
| regressions |1|

| Historical runner | Raw exit |
|---|---:|
| references |0|
| layout-browser |0|
| interface-browser |0|
| browser-native |0|
| checkpoint-compat |0|
| player |0|
| e4 |0|
| legacy |1|

Historical reference runner matched12 historical + 2 payroll checksums. Browser-native verifies100 championship-clock states and3 full race-context captures plus delayed replay; checkpoint compatibility verifies18 exact wire/continuation comparisons. Existing E4 fault/recovery groups remain. The legacy browser runner's HTTP functional checks pass but its process exits1because actual file launch is denied. The direct-file runner exits2with `ERR_BLOCKED_BY_ADMINISTRATOR`. These are known environment limitations, not a completely passing browser suite.

### Historical checksum comparison

| Kind | Fixture | Expected | Actual |
|---|---|---|---|
| historical |replay-reference-Pure-oval.json.gz|fe1bfab8|fe1bfab8|
| historical |replay-reference-Pure-C01.json.gz|1e9d7e68|1e9d7e68|
| historical |replay-reference-Pure-mixed-rally.json.gz|d13a8fdf|d13a8fdf|
| historical |replay-reference-Combat-oval.json.gz|79dec048|79dec048|
| historical |replay-reference-Combat-C01.json.gz|cd29b4b3|cd29b4b3|
| historical |replay-reference-Combat-mixed-rally.json.gz|38fdb4e1|38fdb4e1|
| historical |replay-autonomous-Pure-oval.json.gz|821eca67|821eca67|
| historical |replay-autonomous-Pure-C01.json.gz|c1730efa|c1730efa|
| historical |replay-autonomous-Pure-mixed-rally.json.gz|4120f7c5|4120f7c5|
| historical |replay-autonomous-Combat-oval.json.gz|c8fd3ca0|c8fd3ca0|
| historical |replay-autonomous-Combat-C01.json.gz|3ef47ff6|3ef47ff6|
| historical |replay-autonomous-Combat-mixed-rally.json.gz|fd015e71|fd015e71|
| payroll |payroll-Pure.json.gz|ad509187|ad509187|
| payroll |payroll-Combat.json.gz|f191ca35|f191ca35|

## Failed development attempts and disposition

Initial additive test launch used the wrong helper module for `fund`; corrected the harness import. A real implementation issue passed sidecar `version` into the old exact assembly command; fixed by selecting only the native command's accepted fields. The first browser fixture tried buying a second chariot without capacity; the fixture now purchases the existing450Gold Chariot Bay before the native purchase, without altering capacity rules. These failures are retained in initial logs.

Visual review caught a persistent manual Save Game success toast covering the HQ header. Final source keeps that confirmation in Options. Stable Barn button IDs now let existing focus restoration return to the changed card. Full final regression/keyboard tests follow these fixes. A separate historical-shape regression reproduced a real dashboard crash on foundation-only schema 5, where facts do not yet exist (before-fix exit1, fixed exit0). Optional reads now preserve that state unchanged, and seven packaged historical-save load/browse cases are included. No expected result or native reference was changed to make a test pass.

## Limits and next action

No new critical failure was observed in the tested HTTP path. Windows Chrome/Edge file://acceptance remains pending. Selected partial assets must be deactivated before removal; unsupported old readers reject sidecar-v2 rather than discard it. Large protected commits/backup validation remain potentially expensive; ordinary race persistence was not reintroduced. Browser quotas and downloaded-file durability are not guaranteed.

Stop for owner Windows acceptance. No M4 reward effect, later milestone, commit, merge, push or deployment was performed.
