# BNT E5-D Main M3 — Test Evidence

November 22, 2026 (America/Los_Angeles). Actual commands/results only; Windows owner acceptance remains pending.

## Baseline and environment

HEAD `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`, branch `feat/e5-d-m1-startup-slots-options`, with accepted M2/M3-A uncommitted. The accepted M3-A source inventory and artifact were checked before edits. Its prior 782-test result is historical baseline evidence, not a new baseline run claimed here.

Environment: Linux managed workspace, Node v24.22.1, npm11.9.0, existing esbuild0.28.2/playwright-core1.65.1, Chromium156.0.8078.79. No new dependencies/installations or configured lint/typecheck command. Evidence is under `/workspace/deliverables/e5d-main-m3/evidence/`.

Final candidate: **`Blood-and-Thunder-E5-D-M3-Playable.html`**, **2,387,196 bytes**, **SHA-256 `ffa0784406a0e2156a4bef2b9343a8b30bf1baf18a2336e40f86f2cf1ea0c16f`**. There is no new commit; the baseline-relative checksum CSV identifies the uncommitted delivery.

## Executed commands and process results

| Command | Actual result | Exit |
|---|---|---:|
| `node --test tests/e5-d-m1.test.js tests/e5-d-m2.test.js tests/e5-d-m3-a.test.js` | 25 passed, 0 failed | 0 |
| `node --test tests/e5-d-main-m3.test.js` | 9 passed, 0 failed after harness fixture correction | 0 |
| `npm test` | **791 passed, 0 failed, 0 skipped/cancelled** | 0 |
| `node --test tests/e5-d-m1.test.js tests/e5-d-m2.test.js tests/e5-d-m3-a.test.js tests/e5-d-main-m3.test.js` | **34 passed, 0 failed** | 0 |
| `node scripts/e5-d/main-m3/build.mjs` twice on final source | Byte-identical HTML/report, accepted-artifact guards and offline dependency validation pass | 0 each |
| `cmp /workspace/deliverables/e5d-main-m3/evidence/build-final.log /workspace/deliverables/e5d-main-m3/evidence/build-repeat.log` | Exact match | 0 |
| `node scripts/e5-d/main-m3/hq-browser.mjs` | **10 groups pass**, final artifact SHA recorded | 0 |
| `node scripts/e5-d/main-m3/browser.mjs` | **15 groups pass**, final artifact SHA recorded | 0 |
| `node scripts/e5-d/main-m3/creation-browser.mjs` | **7 groups pass** | 0 |
| `node scripts/e5-d/main-m3/faults-browser.mjs` | **7 groups pass** | 0 |
| `node scripts/e5-d/main-m3/import-browser.mjs` | **3 groups pass** | 0 |
| `node scripts/e5-d/main-m3/regressions.mjs` | Seven subgroups pass, legacy runner blocked at file launch | **1** |
| `node scripts/e5-d/main-m3/file-browser.mjs` | Managed offline `file://` blocked by `ERR_BLOCKED_BY_ADMINISTRATOR` | **2** |
| `node scripts/e5-d/main-m3/evidence.mjs` | Accepted files preserved except four authorized existing UI files; reachability/checksum CSVs generated | 0 |
| `git diff --check` | No whitespace errors | 0 |

Full Node duration was 746.633 seconds under concurrent verification load. This is test execution time, not a controlled gameplay performance benchmark. Existing tests/fixtures/golden expectations were not altered.

## New Node coverage — 9 tests

- Ten supported routes and thirteen existing native work types; schema-appropriate action listing.
- State-derived setup, recovery, manual checkpoint, ended-career, viability, RU and durable/progression next steps without state mutation.
- Active championship labels delegate to the accepted `championshipStep`, including blocked, no-starter, racing and settlement phases.
- All thirteen preview types match the native quote/error exactly and preserve complete store bytes.
- Training, engineering, six-service and contract target filtering preserves native records/order.
- Active championship management lock remains authoritative; route/preview cannot bypass it.
- Insufficient Gold and no-effect service cases remain native failures, not enabled commits.
- Known-route-only bounded focus/scroll memory and invalid-route rejection.
- Source-owned frozen championship names and existing rival presentation labels, without changing IDs.

## Final HQ browser coverage — 10 groups

The actual candidate reconstructs legacy fixtures and uses explicit existing durable migration. All ten routes and all thirteen work types are reachable. Opening routes and reviewing quotes preserve complete career state. A duplicate-beast selection disables assembly with the native reason and no mutation.

A real **facility purchase** through the normal work selector was canceled first, preserving state/focus, then confirmed. Its complete resulting career matched synchronous native replay of the exact UI-generated transaction and survived reload. A real **contract renewal** also matched exact native transaction replay.

The HQ run additionally proves:

1. Browser Back restores route/form/focus/scroll memory; Escape safely returns through HQ.
2. Keyboard next-step/Options/Escape and 414px layout work without horizontal overflow.
3. Canceling browser Back from independent practice preserves practice and matching history/route; explicit return changes no career data.
4. A valid expired-contract fixture exposes renewal/release; assigned release remains blocked until explicit assignment resolution is selected.
5. A valid zero-treasury fixture rejects unaffordable work without optimistic success.
6. A full beast-capacity fixture rejects another purchase and preserves frozen offers/draw order.
7. A forced-elimination fixture continues through the native AI phase without another Run choice or unlocked service.
8. Actual native official-event fixtures route pending Run, final settlement and pending Legacy correctly. The UI performs real final settlement; reload retains the already settled state and pending Legacy choice without another credit.

Rare/financial boundary fixtures are identified: zero treasury/capacity setup uses the existing test-only developer funding transaction; eight native cycle settlements prepare expiry; forced injury uses the existing test-only native override followed by actual race clearance. No production recovery/settlement authority was invented. Native quote previews of all thirteen actions are not claimed as successful mutations of every action; unavailable actions correctly reject. Inherited domain suites cover their supported transaction semantics.

## Final full player journey — 15 groups

Final artifact SHA is recorded in `browser.json`. Two real native races completed:

| Event | Seed | Terminal tick |
|---|---:|---:|
| 1 | 3445083641 | 701 |
| 2 | 4122107583 | 1152 |

The run covers two independent UI-created careers; protected initialization/explicit compatibility; legal registration; acknowledged running/paused Options behavior; retained Sign budget, activation, order and speed; paused Help leaving exact native state/radio/career unchanged; official publication; pending Run selection/reload; exactly-once final settlement; permanent inert Legacy choice; unchanged other career; pending protected queue preventing unsafe leaving; browser Back/focus; Developer/practice return; and **140 HQ navigation actions** retaining single Continue/wheel/menu nodes and handlers.

No native JS error, browser alert/confirm/prompt or external runtime request was observed in these final gameplay/HQ contexts.

## Persistence and accepted milestone regression

Creation/fault/import browser runs preserve all five package grants, Back/Cancel/draft interruption, repeated-confirmation protection, guide/cosmetic metadata, multi-career independence, initialized-only activation recovery, conflicting retries and lost acknowledgment handling.

Representative pre-M1 schema6 and active-race fixtures reconstruct exactly. Complete backup import retains original IDs and byte-exact session journals. Malformed/foreign/duplicate ownership imports reject; missing/corrupt independent slots stay isolated; atomic save/navigation failures roll back; IndexedDB denial cannot falsely create a durable career. Existing career-only format/ownership/provenance/session limitations are covered by the complete configured Node persistence/import suites and unchanged Options importer. No save schema/migration behavior was modified.

## Existing browser/replay inventory

Executed through `regressions.mjs`; each name can be reproduced as its argument. Only evidence destinations and established candidate-entry seams change in the wrapper, not assertions or expected data.

| Subgroup | Actual result | Exit |
|---|---|---:|
| `references` | **12 historical + 2 payroll checksums exact** | 0 |
| `layout-browser` | 5 responsive rows | 0 |
| `interface-browser` | 9 interface groups | 0 |
| `browser-native` | 100 championship-clock seed comparisons, 3 native fixtures and buffered Sign checks | 0 |
| `checkpoint-compat` | 18 historical checkpoint compatibility rows | 0 |
| `player` | 13 retained player-interface groups | 0 |
| `e4` | 9 checkpoint/Sign/reload, restore, quota/writer and recovery groups | 0 |
| `legacy` | 23 functional checks pass over HTTP; direct file launch denied | **1** |

The overall browser process inventory is **not fully passing**, because file policy causes nonzero exits. Nothing suppresses/relabels the legacy failure as a pass. Legacy checks use retained `dist/Blood_and_Thunder.html`; they are historical compatibility evidence, not proof of Main M3 file operation. Exact expected/actual reference digests are in `regressions/references/references.json`; payroll remains Pure `ad509187`, Combat `f191ca35`. No golden file/checksum was updated.

## Failures, corrections and remaining owner gate

- Initial new Node fixture omitted the mandatory factory ID arguments. The harness was corrected; production factory semantics were preserved. Final 9/34/full791 results pass.
- Initial forced-elimination browser expectation assumed a legacy session was already durably activated. The correct native next step was recovery. The harness now explicitly performs existing confirmed durable migration before testing AI continuation. No stale fallback or rule change was added.
- The practice/browser-Back cancel case led to a narrow presentation-history restoration guard. The final artifact passes its dedicated cancellation test and final full player journey.
- Early development artifacts were tested separately. Only the final SHA above is the owner-review candidate; `gameplay-final.log` / `browser.json` and `hq-final.log` / `hq-browser.json` identify it.
- Managed Chromium `file://` launch remains blocked. Windows Chrome/Edge direct-file testing of this new candidate is **not executed/claimed**; see the separate owner checklist. M3-A Windows acceptance does not imply Main M3 acceptance.

No unresolved new mechanical or persistence defect was found in executed checks. Unsupported long-term scheduling/assignment editing stays unavailable; route memory is transient, and inherited large-history/quotas/browser-origin limitations remain. No later milestone was implemented.

**STOP — Await owner review and acceptance of E5-D Main M3.**
