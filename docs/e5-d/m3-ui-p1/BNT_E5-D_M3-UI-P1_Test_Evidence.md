# Blood and Thunder — M3-UI-P1 Test Evidence

## Verdict and exact candidate

Candidate workflow checks pass; Windows acceptance remains outstanding. Final HTML SHA-256: `77e96a6c3db3c3c5409f14d50f1f9dc6bd8fa69aa14524b9a8e3c47dab30adf4`, **3,152,213 bytes**. Test source is the uncommitted candidate recorded by the separate source manifest, on existing HEAD `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`. No commit was created. Environment: Linux, Node 24.22.1, npm 11.9.0, Chromium 156.0.8078.79, esbuild 0.28.2, playwright-core 1.65.1, 4 CPU quota cores. No dependencies were installed or changed.

**Full Node: 871/871 passed, 0 failed, 0 skipped, 0 cancelled.** Candidate browser coverage: **67 passing workflow groups** (44 new/corrective groups plus 23 adapted feature/import/restart/deletion groups). Earlier artifacts: **64 passing groups**, reported separately. Groups contain multiple assertions and must not be summed as equivalent Node test cases. The whole browser inventory is not reported as green: file runners exit 2 and the configured legacy runner exits 1 because managed file navigation is blocked.

## Commands actually executed

All commands ran from `/workspace/BNT`; raw logs and `.exit` files are in `evidence/`. Wrappers create temporary copies of established runners with redirected output paths and documented UI-selector/wording adaptations; they do not change goldens or production validation.

| Command | Raw exit | Result |
|---|---:|---|
| `node --test tests/e5-d-m3-ui-p1.test.js` | 0 | 11/11 additive Node tests; included again in the full suite |
| `npm test` | 0 | 871/871 Node tests, 0 skipped |
| `node scripts/e5-d/m3-ui-p1/creation-browser.mjs` | 0 | 5 package-to-native-race groups |
| `node scripts/e5-d/m3-ui-p1/creation-faults-browser.mjs` | 0 | 6 creation/cancellation/recovery groups |
| `node scripts/e5-d/m3-ui-p1/context-browser.mjs` | 0 | 11 contextual transaction groups |
| `node scripts/e5-d/m3-ui-p1/legacy-load-browser.mjs` | 0 | 8 unmodified historical/empty career groups |
| `node scripts/e5-d/m3-ui-p1/lifecycle-browser.mjs` | 0 | 10 actual Barn/registration/native championship/settlement/archive groups |
| `node scripts/e5-d/m3-ui-p1/layout-browser.mjs` | 0 | 4 responsive/keyboard groups |
| `node scripts/e5-d/m3-ui-p1/earned-fixtures.mjs` | 0 | 4 real native races, two genuine settlements; driver and beast XP 15 |
| `node scripts/e5-d/m3-ui-p1/service-fixture.mjs` | 0 | explicit synthetic native condition, followed by real official clearance/AI continuation/settlement |
| `node scripts/e5-d/m3-ui-p1/accepted-regressions.mjs` | 0 | 64 earlier-artifact groups; child browser exceptions listed below |
| `node scripts/e5-d/m3-ui-p1/candidate-regressions.mjs` | 1 | initial adapted inventory; import expectation corrected and rerun below |
| `node scripts/e5-d/m3-ui-p1/candidate-regressions.mjs import-browser` | 0 | 3 current-candidate import/corruption groups |
| `node scripts/e5-d/m3-ui-p1/build.mjs (first)` | 0 | offline build |
| `node scripts/e5-d/m3-ui-p1/build.mjs (second)` | 0 | byte-identical offline build |

`cmp /tmp/bnt-m3uip1-build-1.html dist/Blood-and-Thunder-E5-D-M3-UI-P1-Playable.html` returned **0**. Both build processes returned 0, `verifyOffline` passed and SHA-256 matched. Original accepted/candidate artifacts remained unchanged. Build/test wrappers are retained under `scripts/e5-d/m3-ui-p1/`.

## Fresh-career initialization evidence

Every case used the packaged real New Game wizard with final confirmation, no manual service upgrade, no backup export, no developer activation and no test funding. Each reached schema 6, payroll cycle 0, one starting grant, actual starting-driver wage/duration disclosures, 23 market offers and six events. Each registered a legal native Racing Unit for the existing 25-Gold fee and started an actual Worker race. All five had zero page errors, ordinary browser dialogs and external requests.

| Package | Starting Gold | After fee | Grants | Market offers | Events | Observed native tick | Race IDB puts |
|---|---:|---:|---:|---:|---:|---:|---:|
| traditional | 1200 | 1175 | 1 | 23 | 6 | 52 | 0 |
| beastmaster | 850 | 825 | 1 | 23 | 6 | 54 | 0 |
| mechanist | 800 | 775 | 1 | 23 | 6 | 55 | 0 |
| veteran | 650 | 625 | 1 | 23 | 6 | 54 | 0 |
| scrappy | 750 | 725 | 1 | 23 | 6 | 55 | 0 |

`creation-faults-browser.json` covers Back/Cancel at each unconfirmed step, reload of an unconfirmed draft, repeated confirmation, index denial, denied final head activation, validated retained-stage recovery, lost acknowledgment after activation, duplicate request, conflicting package request and missing confirmation. Recovery produced exactly one 750-Gold Scrappy grant, fully initialized schema 6; the original separate career remained unchanged. Complete backup restored package, identities and cosmetics into an independent context.

## Direct contextual transactions

`context-browser.json` passes 11 groups against the final HTML. Actual purchases: Staff Quarters, Driver Quarters, Expanded Stables and Chariot Bay; driver, beast, chariot, specialist and equipment acquisition. Hiring uses selected long terms and verifies exact native wages/cycles. Every confirmation includes the same native preview lines as the card/commit, and every actual debit equals the source quote. A stale confirmation was rejected without any state change, then required a fresh confirmation. Zero Gold disables unaffordable purchases. All receipts/assets/XP/contracts/engineering survive cold reload.

Training spends **naturally earned beast XP**, increasing Speed by one through the existing command. The fixture earned 15 XP from four actual native races and two real terminal settlements. Training cost bands remain unchanged: the fixture's driver's 80 Driving requires 35 XP and was correctly unavailable; no XP was fabricated. Engineering uses the existing Chariot Stability operation. Positive medical/repair coverage uses a **clearly synthetic native-condition fixture**, not a fabricated career record: accepted native override commands set driver condition 59.5, beast fatigue 80 and chariot condition 40; the native race is cleared, official effects committed, the remaining rival schedule completed and existing settlement applied. The resulting paid driver treatment, beast care and 10-point integrity repair use exact native costs/effects. The fixture records protected provenance. Test treasury funding is an explicit existing developer transaction, confined to isolated test careers.

The original healthy fixture correctly rejected no-effect care and repair; it was replaced by the damaged native fixture rather than changing those guards. Work Review is present in Recovery & Services and absent from Finances; Finances retains obligations, statements and the ledger without internal setup-command prose.

## Navigation, Barn and lifecycle

`browser.json` (final artifact) passes 10 groups: authoritative Home identity/stats/placeholders; 200 complete page changes with **zero IndexedDB puts** and unchanged career state; one continuation navigation control; durable driver/chariot activation, replacement and deactivation; ordered beast slot replacement and cancellation; exact 100-Reputation Ironwheel shortfall; free event selection; preserved Details on Return to Barn; illegal-team rejection; injected activation-write failure rollback; Save Game verification without generation change; 25-Gold single registration with frozen composition; two full real native races; mandatory Run choice; exactly-once terminal settlement; pending then selected Legacy reward; Last Event/archive; complete terminal backup roundtrip and responsive 390px Home/Barn.

`layout-browser.json` verifies Events grid columns **3 at 1366px, 2 at 800px, 1 at 390px**, without horizontal overflow. Keyboard opening of Options, six management Help sections, Escape closing and focus return pass. Normal pages have no guide, secondary header or main-navigation Save/Load. Normal race controls hide Single tick and Present buffered tail; those same nodes/functions remain under Developer Tools. Play/Pause/speed, map and radio remain available. Options Save Game explicitly excludes unfinished ticks/Signs.

## Compatibility, recovery and deterministic references

Eight final-candidate cases browse without mutations: empty schema 2, historical schemas 1/2/3/4, foundation-only schema 5, controller schema 5 and schema 6. Original Web Storage bytes and the complete loaded career compare exactly. The empty older career retains explicit package initialization under Options; no historical career is silently upgraded.

Current-candidate adapted runners pass M3-B pin/C preference behavior, new-career C ON versus legacy C OFF, live alternate/native radio restoration, career-only export, complete backup/import, unsupported/corrupt/foreign presentation rejection, interrupted activation, stale pin/backup rejection, unfinished-race restart, storage/writer failures and isolated deletion. Complete result/condition/standings/reward transactions remain the accepted implementations.

**14/14 checksum matches:** 12 historical native references plus two payroll-context references; see `BNT_E5-D_M3-UI-P1_Replay_Checksums.csv`. Browser parity passed **100 championship clock states and three full championship-context captures**, delayed replay/checkpoint verification, and **18 retained checkpoint/transcript compatibility cases**. Supplemental E4 tests passed nine fault/recovery groups; earlier packaged player lifecycle passed 13 groups. The final source preservation report independently verifies that simulation, core, career domain, persistence, reporter and replay source bytes remain equal to the verified M3-UI baseline.

## Raw browser process inventory

| Artifact/inventory | Runner | Raw exit |
|---|---|---:|
| Earlier artifact | browser | 0 |
| Earlier artifact | features-browser | 0 |
| Earlier artifact | creation-browser | 0 |
| Earlier artifact | faults-browser | 0 |
| Earlier artifact | import-browser | 0 |
| Earlier artifact | presentation-faults-browser | 0 |
| Earlier artifact | hq-browser | 0 |
| Earlier artifact | restart-browser | 0 |
| Earlier artifact | delete-browser | 0 |
| Earlier artifact | file-browser | 2 |
| Earlier artifact | regressions | 1 |
| Current candidate (latest import rerun) | features-browser | 0 |
| Current candidate (latest import rerun) | import-browser | 0 |
| Current candidate (latest import rerun) | presentation-faults-browser | 0 |
| Current candidate (latest import rerun) | restart-browser | 0 |
| Current candidate (latest import rerun) | delete-browser | 0 |
| Current candidate (latest import rerun) | file-browser | 2 |
| Native/configured supplemental | references | 0 |
| Native/configured supplemental | layout-browser | 0 |
| Native/configured supplemental | interface-browser | 0 |
| Native/configured supplemental | browser-native | 0 |
| Native/configured supplemental | checkpoint-compat | 0 |
| Native/configured supplemental | player | 0 |
| Native/configured supplemental | e4 | 0 |
| Native/configured supplemental | legacy | 1 |

The `accepted-regressions` wrapper's exit 0 intentionally does not reclassify nonzero child results. The nested regression wrapper exits 1 because its legacy child exits 1. That unchanged configured browser runner passed **23 functional HTTP checks**, no JavaScript errors or network requests, but reports `BLOCKED` for actual file launch. Both candidate and preserved P1 file runners exit **2**, with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. These are managed-environment limitations, not Windows acceptance. There were no newly observed native numerical/checksum failures in this inventory.

The initial candidate-wrapper import expectation used the former blanket error word “preserved” and exited 1. This UI now truthfully reports unconfirmed operations after possible lost acknowledgments. The adapted test checks the new message and retains exact-state/identity/no-allocation assertions; its explicit rerun exits 0. Initial raw exits remain in `candidate/raw-exits.json`; latest dispositions are in `candidate/final-exits.json`.

## Earlier diagnostic failures and disposition

The first full Node run executed 871 tests, **870 passed / 1 failed**, exit 1. The old M3-BC rejection vector treated request v3 as unsupported. M3-UI-P1 explicitly introduces v3; that vector now rejects v4, retaining all rejection assertions and the existing injected-field tests. Five additive v3 initialization/native-start cases prove the newly supported contract; v1/v2 remain unchanged. The complete suite was rerun, rather than presenting a focused rerun as full evidence. No golden checksum changed.

Early new-harness attempts also exited 1 for an incorrect `port.perform` call shape, the existing `aria-current=true` selector, waiting before Options finished drawing, counting native race-help headings as management-help sections, waiting for a deliberately closed dialog to be visible, full fixture capacity and insufficient/native no-effect service assumptions. These were corrected in diagnostics/fixtures, without relaxing production validation, and the relevant complete candidate runners passed afterward. Original logs with `harness` or `fixture` in their names are retained.

## Performance and remaining owner acceptance

Controlled performance comparison commands/results are in the separate Performance Comparison report and paired JSON files. Concurrent regression timing is not treated as a performance benchmark. Existing large-history validation costs and logical storage limits are preserved. Windows offline Chrome/Edge acceptance remains **not executed here**. Follow the separate checklist using the exact final HTML/hash; managed HTTP success does not substitute for that test.
