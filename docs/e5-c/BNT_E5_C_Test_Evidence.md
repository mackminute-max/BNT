# BNT E5-C — Test Evidence

Branch `feat/m2-e5-c-integrated-career-loop`; final frozen runtime `646fad6b7a6dff3b10d9718286840cc7b3c3bc97`. Baseline `ee6963c41accad23a09981007eb1daa78f56f912`. Node24.22.1, npm11.9.0, esbuild0.28.2, playwright-core1.65.1, Linux Chromium156.0.8078.79 (`/usr/bin/chromium`). No dependencies installed/updated for this integration. Verification date November21,2026 Pacific.

## Executed command inventory

| Command | Actual result / raw process exit | Scope |
|---|---|---|
| `npm test` at baseline | 744 passed,0 failed; exit0 | Before production changes. |
| `npm test` frozen final | 755 passed,0 failed,0 skipped; exit0;481,751ms total | Entire configured `tests/*.test.js`; see retained final log and exit record. |
| `node scripts/e5-c/journey.mjs` frozen final | 8 groups,4 native events,0 errors; exit0 | Two successive championships, four actual native races; no Developer Tools clicks. |
| `node scripts/e5-c/recovery-browser.mjs` | 5 groups,0 errors; exit0 | Interrupted birth; lost acknowledged input; corrupt checkpoint exact repair; forced elimination/AI continuation; legal sole-entrant withdrawal/typed no-starter. |
| `node scripts/e5-c/formats-browser.mjs` | 3 formats,0 errors; exit0 | Eight-field Standard Oval Pure; C01 Pure; mixed Rally Combat. Each validates actual viewer actors/follow target and single tick, not complete championship capacity. |
| `node scripts/e5-c/browser.mjs` | 13 groups,0 errors; exit0 | Ordinary management/fresh-career controls,162 retained developer IDs,14 page/viewport checks, exact offline practice. File navigation separately blocked. |
| `node scripts/e5-c/e4-regression.mjs` | 9 checks,0 errors; exit0 | Original assertions: migration, checkpoint/reload, complete backup/restore, quota/abort/lost ack, repair/recovery, official native publication. |
| `node scripts/e5-c/existing-regressions.mjs` | 5 child runners exit0; wrapper0 | Original references/layout/interface/native/checkpoint assertions, output redirected only. |
| `node scripts/e5-c/legacy-browser.mjs` | 23 HTTP functional groups pass; **exit1** | Historical runner explicitly reports blocked actual file launch. No JavaScript/network errors; not a fully passing browser suite. |
| `npm run build:e5-c` | exit0 | New HTML only; accepted B/P2.2 hashes checked. |
| `git diff --exit-code -- dist/Blood-and-Thunder-E5-C-Playable.html` after rebuild | exit0 | Repeated build bytes match committed artifact. |
| `git diff --check` | exit0 | No whitespace errors. |

The general management browser runner was also rerun successfully against the final frozen artifact (exit0,13 groups). Supplementary recovery/legacy-regression browser runs were executed during implementation; final Node and two-championship run specifically revalidate the frozen source/artifact. Do not relabel earlier browser runs as final-revision reruns. Superseded full runs (including754 tests before the eleventh new test) are excluded from final counts. Terminated exploratory runs are not passes.

## New tests and authority coverage

Eleven focused Node tests cover actual per-tick native digest parity; buffered Sign delay parity; forged/stale binding/reference rejection; latest committed head and Sign restore; prepared worker state not durable; player lifecycle/reward/recovery gates; no precommit input acknowledgment or frame exposure; interrupted race birth versus missing real session; official typed no-starter distinction; and exact continuous coaching/custom weights. The complete suite retains M1/M2-A/B/C/D, E3/D2, E4 cold validation, publication/faults, financial/protected history, E5-B reward/settlement and historical replay coverage. No expected checksum or old assertion was weakened.

## Player journey and fixture limits

The journey starts from an isolated valid accepted stable fixture (not owner data), explicitly migrates it, selects assignment, confirms the fee once, opens real viewer, accepts a Sign and reloads active state, publishes D5 results, reloads pending Run/Legacy choices, selects both rewards, settles once and returns Home. It repeats a second championship with prior Legacy retained. Final read-only reconstruction asserts two cycles/two archives/two Legacy records and replays all four native sessions exactly. Browser instrumentation inspects authoritative state but performs gameplay through ordinary controls; zero Developer Tools button clicks.

The normal management runner separately exercises ordinary fresh-career/starting-package paths. Rare forced elimination and sole-entrant no-starter paths use explicitly synthetic supported fixtures. They do not establish production catalog balance or full eight-field twelve-event capacity. Recovery fixtures never override physical outcomes to force a finish.

## Replay references actually checked

| Native reference | Expected = actual |
|---|---|
| Pure oval/C01/Rally reference | `fe1bfab8` / `1e9d7e68` / `d13a8fdf` |
| Combat oval/C01/Rally reference | `79dec048` / `cd29b4b3` / `38fdb4e1` |
| Pure oval/C01/Rally autonomous | `821eca67` / `c1730efa` / `4120f7c5` |
| Combat oval/C01/Rally autonomous | `c8fd3ca0` / `3ef47ff6` / `fd015e71` |
| Payroll Pure/Combat | `ad509187` / `f191ca35` |

The original browser-native runner also validates100 championship-clock states, three full native captures and delayed input/checkpoint behavior. The new final journey records four per-session native replay checks in `evidence/journey.json`; values must be read there, not substituted for historical references.

## Artifact, storage and performance

HTML2,242,856 bytes, SHA-256 `8b31d3ef8ae6c902184beb7c134fad7e25290515250318211dbcd863eff71c2c`. Embedded worker/viewer, no new runtime dependency. Accepted practice SHA `24c393c19f7d8aa6f4e2bf6794d2e573d11be74508940e97b78a6330b6a203be`; B SHA `d9f909a59a78ad3c3a688ce15be6e6d77c2164fde2f16469ade9530cddbae6b8` unchanged.

Final logical record bytes:3,440,606; generation428, two cycles/two archives/two permanent Legacy records. Per-race native replay checksums: `b7767aaa`, `1a6a6525`, `afb571a7`, `3abde1ef`. Native terminal ticks712,1177,790,1223; wall durations80,694/130,524/46,450/98,535ms under concurrent verification. Details are recorded in `journey-final-summary.json` and the final journey log. This is encoded logical content, not browser disk usage or a capacity guarantee. Wall times in `final-frozen-journey.log` include rendering, durable preparation/storage, polling and concurrent verification load. They are not controlled simulation benchmarks. Significant buffering remains, particularly late Combat; no smooth4× guarantee. Existing logical8MiB record, journal/receipt1000 and protected identity2000 limits are preserved; no authoritative history pruned.

## Environmental limits and failures

All managed browser work uses localhost transport; offline mode verifies runtime independence after load. Reload tests temporarily restore localhost navigation then disable networking again. Linux managed file navigation fails `ERR_BLOCKED_BY_ADMINISTRATOR`. Windows Chrome/Edge offline `file://` testing and owner acceptance remain outstanding. The historical browser runner exits1 for this policy block despite its functional HTTP groups passing. Browser suite is therefore not completely green. No owner acceptance is claimed.

No exhaustive simultaneous-tab stress, maximum-field long-schedule C journey, Safari/Firefox, or measured peak memory proof is claimed. Existing E4 faults and generation safeguards are reused; retained evidence identifies actual scenarios. See Outstanding Issues and Windows checklist before accepting delivery.
