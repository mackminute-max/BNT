# M3-BC test evidence

## Tested revision

Branch `feat/e5-d-m1-startup-slots-options`, HEAD `36b0048fac6d0b8c2e62f6c895ab624315e3f46f` plus delivered uncommitted changes. Final source manifest SHA-256 `a0ed104e9d1ef832af46588d18d157ea79739471955771be758bea1ca24586ee`. Production source and Node-test files were frozen for the final full run; the frozen manifest still matches. Additional browser/diagnostic harnesses do not alter runtime behavior. Node v24.22.1; esbuild 0.28.2; Playwright core 1.65.1; managed Chromium 156.0.8078.79, Linux. No installs or updates.

## Commands actually executed

Commands below ran from `/workspace/BNT`; logs are under `/workspace/deliverables/e5d-m3-bc/evidence/continuation/`.

| Command | Result | Raw exit |
|---|---|---:|
| `npm test` (initial existing-test integration run) | 791 passed, 0 failed; started before edits and overlapped integration, not a frozen pristine-source acceptance run | 0 |
| `node --test tests/e5-d-m2.test.js tests/e5-d-main-m3.test.js` | 21 passed, 0 failed (early integration) | 0 |
| `node --test tests/e5-d-m3-bc.test.js` | Final targeted run: 44 passed, 0 failed | 0 |
| `npm test` (frozen final source; `frozen-node.log`) | **835 passed, 0 failed, 0 skipped** | **0** |
| `node scripts/e5-d/m3-bc/build.mjs` twice, then `cmp` | Offline/dependency validation passed; identical bytes | 0 |
| `node scripts/e5-d/m3-bc/features-browser.mjs` | 8 groups passed, no JS errors/dialogs/network requests | 0 |
| `node scripts/e5-d/m3-bc/presentation-faults-browser.mjs` | 4 groups passed | 0 |
| `node scripts/e5-d/m3-bc/creation-browser.mjs` | 7 groups passed | 0 |
| `node scripts/e5-d/m3-bc/browser.mjs` | 15 groups passed; two real native owned races, official publication, rewards/settlement, reload, Options/Signs and 140 navigations | 0 |
| `node scripts/e5-d/m3-bc/hq-browser.mjs` | 10 groups passed on final candidate; all 10 routes and 13 native work types | 0 |
| `node scripts/e5-d/m3-bc/faults-browser.mjs` | 7 groups passed, including legacy migration and failures | 0 |
| `node scripts/e5-d/m3-bc/import-browser.mjs` | 3 groups passed, including full active-session import and corruption recovery | 0 |
| `node scripts/e5-d/m3-bc/display-parity.mjs` | Three full native races match exact OFF/ON capture, checksum and native narrative | 0 |
| `node scripts/e5-d/m3-bc/regressions.mjs` | See per-runner exits below; wrapper nonzero because legacy direct-file diagnostic is blocked | 1 |
| `node scripts/e5-d/m3-bc/file-browser.mjs` | File launch blocked by managed Chromium policy | 2 |
| `git diff --check` | No whitespace errors | 0 |

The seven candidate UI scripts total **54 passing functional groups**, separate from Node counts. Assertions from inherited Main M3 runners were retained; only candidate paths/output destinations were adapted. The final artifact is identified below. Earlier intermediate candidate runs are retained in process logs; final gameplay/HQ/creation/fault/import runs replace their JSON summaries.

## Regression wrapper raw exits

| Runner | Exit | Evidence |
|---|---:|---|
| references | 0 | 12 historical plus 2 payroll replay checksums match |
| layout-browser | 0 | Existing layout checks |
| interface-browser | 0 | Existing controls/Signs/interface checks |
| browser-native | 0 | Championship clock Node/Chromium and native race parity |
| checkpoint-compat | 0 | Existing replay/checkpoint compatibility |
| player | 0 | Accepted player-interface regression |
| e4 | 0 | Integrated E4 persistence/recovery checks |
| legacy | 1 | 23 functional checks passed via HTTP; actual file launch blocked by browser policy |

Raw per-runner logs and exits: `regressions/<name>/process.log` and `exit.json`. A nonzero wrapper is **not** a completely passing browser suite. No legacy runner, numerical reference or expected checksum was altered to hide failures.

## New acceptance coverage

- V1 stays unmarked/readable; explicit C opt-in creates a legacy-cohort sidecar without adding a B pin. New creation defaults B OFF/C ON and attaches the selected pin only after the unchanged grant.
- All 23 current source IDs/categories/names match; native acquisitions, costs, owned source IDs, species and both service migrations remain unchanged. Purchased cosmetics survive export/reload.
- Strict versions, fields, digest, ownership and revisions; invalid imports, contradictory pins, retrofitting and downgrade attempts reject without mutation.
- Career-only and complete-backup round trips; complete restoration into independent browser; cold worker validation/cache; corrupt primary recovery retains pin/latest preference; corrupt sidecar blocks instead of losing data.
- Node storage denial and IDB denial at previous/head/navigation publication boundaries; no partial generation. Lost acknowledgment recovers an already committed choice without false acknowledgment. Stale writer and older complete backup reject.
- All 22 ordinary keys and fixed resistance, exact event ID/time/type/order, typed formatting, missing-context fallback, throttle/priority/narrative preservation, bounded cache and native OFF restoration.
- Actual buffered practice shows alternate radio and live native-wording restoration. New-default ON is also exercised by the standard two-race owned championship journey.

## Exact full-race OFF/ON comparisons

| Fixture | Final ticks/status | OFF checksum | ON checksum |
|---|---|---|---|
| 2 entrants, short Oval Pure, seed145 | 676 / Ended | 896c30da | 896c30da |
| 4 entrants, C01 Circuit Combat, seed145 | 1620 / Ended | acae625d | acae625d |
| 8 entrants, Long Rally Combat, seed146 | 4618 / Ended | 678de71d | 678de71d |

Each fixture queues the same native Signs at identical simulation ticks; rendering alternates after accepted reporter batches leaves exact capture and stored narrative unchanged. No golden reference was updated. `display-parity.json` and `regressions/references/references.json` retain full comparison evidence.

## Diagnostics and limits

Initial additive Node run had one fixture error: an M2-C-only quote helper was called after schema4 migration. Corrected to the existing schema-aware `actionCommand`; final 44 tests pass. Initial feature-browser fixture waited for `paused` before first start; existing P1.5 correctly begins `ready`, and the harness was corrected. Initial preference-fault harness requested the developer coordinator API before mounting a career; it now mounts the career first. Original failure reports/logs are retained; no production contracts were changed for these corrections.

An intermediate full-suite run passed 834/834 before the final publication-boundary test was added; its log is retained but it is not the frozen acceptance run. Only the completed frozen run is final Node evidence. No controlled performance claims are made from concurrent verification.

Managed `file://` error: `ERR_BLOCKED_BY_ADMINISTRATOR`. This is not evidence that Windows succeeds or fails. Owner must test the new artifact in Chrome/Edge offline.

## Artifact

`Blood-and-Thunder-E5-D-M3-BC-Playable.html`: **3,062,357 bytes**; SHA-256 `ec2283def7e3b391bff520b3390bdafad7bdb2e9cab79b066da73df30ec206ae`. Two final builds match `build-first.html` exactly. Original Main M3 SHA-256 remains `ffa0784406a0e2156a4bef2b9343a8b30bf1baf18a2336e40f86f2cf1ea0c16f`. The dedicated build validates embedded assets, embedded Worker, offline packaging and preserved earlier artifacts.
