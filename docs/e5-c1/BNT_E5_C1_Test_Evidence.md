# Blood and Thunder — E5-C.1 Test Evidence

Runtime/source commit: `fd9cd96e3c8b13ac4ba391c7cf2f9651d923d10d` on local `feat/m2-e5-c1-navigation-correction`. Later documentation/diagnostic-harness commits do not change application code or HTML. Accepted E5-C baseline: `646fad6b7a6dff3b10d9718286840cc7b3c3bc97`; prior delivery `feff8287e6e9b69582861e3262b80e2cf73432cc` changes documentation only.

Environment: Linux, Node24.22.1, npm11.9.0, esbuild0.28.2, playwright-core1.65.1, Chromium156.0.8078.79 (`/usr/bin/chromium`). Verification date November21,2026 Pacific. No dependency installation/update.

## Commands actually executed

| Command | Result | Raw exit |
|---|---|---:|
| `node --test tests/e5-c1-navigation.test.js` | 2 passed,0 failed | 0 |
| `npm test` final application source | **757 passed,0 failed,0 skipped**;392,447ms | 0 |
| `node scripts/e5-c1/navigation-browser.mjs --original` | Expected regression failure on original artifact;101 controls rather than1 after actual native race and management return | **1, expected** |
| `node scripts/e5-c1/navigation-browser.mjs` final corrected build | 14 state/reload groups;280 complete cycles;1,705 action assertions;two real native races;0 JS errors | 0 |
| `node scripts/e5-c1/player-regressions.mjs` | 13 original player-interface groups,162 existing developer-control connections,14 page/viewport checks;0 JS errors | 0 |
| `node scripts/e5-c1/references.mjs` | All12 historical and2 payroll-context replay checksums equal their accepted references | 0 |
| `npm run build:e5-c1` | Self-contained HTML generation and existing offline/dependency verification | 0 |
| Repeated `npm run build:e5-c1`, then `git diff --exit-code -- dist/Blood-and-Thunder-E5-C1-Playable.html dist/Blood-and-Thunder-E5-C-Playable.html` | Exact repeated output; original C unchanged | 0 |
| `git diff --check` | No whitespace errors | 0 |

Raw logs and JSON are retained individually under `evidence/`. Superseded verification runs stopped while refining this harness are not counted as passing final runs. An initial harness attempt checked immediately after reload before asynchronous durable discovery completed; its failure is retained separately. The final test waits for discovery to finish, then applies the same visibility/uniqueness assertions. This is not a production workaround or relaxed assertion.

## Original artifact reproduction

The exact original SHA-256 `8b31d3ef8ae6c902184beb7c134fad7e25290515250318211dbcd863eff71c2c` was loaded unmodified. The test used ordinary confirmation/registration controls and ran the actual owned race through the native viewer. Race ended at tick703, seed2889133318. After authoritative publication and navigation to Home Stable, common assertion `count === 1` failed with count101; total navigation buttons109. The duplicate IDs and missing `aria-hidden`/`aria-disabled` were captured in JSON. The test stopped at this decisive failure instead of manufacturing a passing original result. Source inspection independently found two creation sites, versus one in corrected source.

## Corrected packaged-interface coverage

The test iterates Home Stable → Staff → Workshop & Finances → Championships → Career Records → Save & Recovery,20 complete cycles per state. It repeats each state after reload and completed durable discovery. Tested states:

1. Fresh eligible career without championship (hidden/disabled).
2. Registered active championship (visible/functioning).
3. Official native nonfinal result with mandatory Run choice pending.
4. Final schedule completed, settlement pending.
5. Settlement committed, mandatory Legacy choice pending.
6. Archived championship (hidden/disabled).
7. Explicit saved-session recovery state (visible/recovery reachable).

For every navigation action, assertions check globally exactly one Continue ID, exactly nine navigation buttons total, no other duplicate navigation IDs, stable original navigation-node references and `onclick` identity, matching visibility/disabled/accessibility attributes, and exactly one management content replacement from one click. Visible Continue is clicked in every state/reload group and must navigate to Championships through the original route. The recovery state checks that repair controls remain accessible. Each test uses isolated valid fixture storage and browser contexts; no owner save was loaded or migrated.

Native races occur in the actual packaged viewer. D5 official publication, mandatory Run selection, trusted final settlement, Legacy selection and archive use existing ordinary controls. Fixtures are integration fixtures, not new gameplay/catalog content. The fresh fixture is an initialized accepted stable without an active championship; ordinary empty-career creation and initial package flows are additionally exercised by the unchanged general player runner. The corruption scenario deliberately edits only disposable test storage to exercise recovery navigation, not engine outcomes.

Actual corrected race terminal records: tick702/seed635578185 and tick963/seed3383477182. Both ended natively; no synthetic finish override was applied. Original and corrected registered instances have their own saved seeds; these are UI/lifecycle regressions, not claims that different seeds have identical race outcomes. All14 historical/payroll replay comparisons separately use their exact accepted seeds and references.

Final corrected artifact hash in the browser report matches the delivered artifact. Completed280 cycles comprise20 cycles × seven states × before/after reload. The1,705 checks include initial/Continue/post-race assertions in addition to1,680 ordinary navigation actions. Each valid Continue action reached its expected destination; fresh and archived states remained hidden/disabled.

## Preserved behavior

The full configured Node suite retains simulation/replay, input ordering, E4 worker/cache/checkpoint/transaction/fault handling, D2, official publication, E5-B rewards/settlement and M2-D financial safeguards. The only application diff is `src/management/playable.js`; no accepted golden value was modified. Original independent practice SHA `24c393c19f7d8aa6f4e2bf6794d2e573d11be74508940e97b78a6330b6a203be` and accepted B artifact are verified unchanged by the build. The general browser runner verifies offline practice and all original workbench controls remain present.

The inherited original C performance/buffering and maximum-field/long-schedule limits remain separate. This correction does not claim a performance or full-capacity improvement.

## Artifact and environmental limits

New HTML:2,243,624 bytes, SHA-256 `c508aea1093cbfd6758592866ce36a501d3034ef27c02f9ffab3bb6dc1558f3d`. Worker and assets remain embedded; no mandatory server or new external dependency. The test server is diagnostic transport only.

Managed Linux Chromium file navigation reports `ERR_BLOCKED_BY_ADMINISTRATOR` in the general browser runner. That runner explicitly records the file limitation while its HTTP functional groups pass; no Windows file acceptance is claimed. Test the new exact artifact offline under Windows Chrome/Edge using the separate checklist. No unrelated legacy browser runner was modified or represented as newly passing.
