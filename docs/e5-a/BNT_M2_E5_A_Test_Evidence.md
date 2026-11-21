# Blood and Thunder — E5-A Test Evidence

Tested source: **`4dad533211a88e0a1c36965ccf70d0d7459cb5c3`** on `feat/m2-e5-a-stable-management-ui`. Source files/artifact were frozen for final verification; later documentation commits do not change them. Baseline: `9dd40d40256d84447717a874b538181f527612b3`. Date: November21,2026. Node v24.22.1, npm11.9.0, managed Linux Chromium with playwright-core. No dependencies installed or updated. No owner career data was used.

## Executed commands and raw exits

| Command | Raw exit | Actual result |
|---|---:|---|
| `npm test` before implementation |0|**717/717**,0 failed/cancelled/skipped;325581.906214ms |
| `node --test tests/e5-a.test.js` |0|**8/8** focused model/domain/persistence tests;4413.259933ms |
| Final `npm test` |0|**725/725**,0 failed/cancelled/skipped;366973.86594ms |
| `npm run build:e5-a` |0|New self-contained Home Stable artifact |
| `node scripts/e5-a/browser.mjs` final run |0|**12 player workflow groups**,0 page errors; file navigation separately blocked |
| `node scripts/e5-a/existing-regressions.mjs` |0|Five original runner children, all exit0; details below |
| `node scripts/e5-a/e4-regression.mjs` |0|Original E4 runner against new HTML: **9/9 groups**,0 page errors |
| Original `node scripts/build.mjs` in isolated source/scripts/package copy, with existing node_modules symlink |0|Normal development workflow compiles; no accepted dist overwritten |
| `node scripts/e5-a/build.mjs` twice; `cmp` SHA output files |0|Identical1,705,666-byte artifact and SHA |
| `git diff --check` |0|No whitespace errors |
| `git diff --quiet 9dd40d4 -- src/sim src/ai src/career src/persistence src/prototype src/presentation` |0|Protected engine/domain/storage/accepted presentation source unchanged |

Full Node includes all configured M1/M2-A/B/C/D/E, E4 worker/recovery, P1.5 and P2.2 tests. No old test or golden changed. These concurrent correctness runs are **not** controlled performance benchmarks; baseline/final elapsed times do not establish a speedup or regression.

### Baseline inspection

Executed `git status --short --branch`, `git rev-parse HEAD`, and `git merge-base --is-ancestor` for M2-D06fd511, E4b8c090 and P2.2c235bf3 (all ancestor exits0). Created the authorized local feature branch from combined9dd40d4. Existing untracked readiness document preserved. No fetch/merge/rebase/push/release/deployment. Source revision recorded locally; no GitHub download link is claimed for unpushed work.

## New Node acceptance tests

1. View matches actual treasury, registries, capacity/native legality; preview does not mutate input.
2. Missing/blocked/recovery/manual-checkpoint views expose restrictions.
3. Legal assembly publishes through CareerStore; reload preserves ordered beasts; duplicate command idempotent.
4. Duplicate beasts, foreign driver, unavailable driver and Major injury reject; failed transactions preserve exported state.
5. Facility purchase uses existing exact quote/effect/delta, charges original cost, changes approved capacity only.
6. Injected storage write failure preserves old bytes and career state; no partial financial/roster publication.
7. Active championship remains inspectable but domain rejects assembly/economic changes; settlement/progression adapters explicitly unavailable.
8. Stale command rejects after a different valid revision; insufficient funds produces unavailable quote.

All use disposable in-memory careers and existing approved package/migration fixtures. Synthetic injury/unavailability records are pure-preview boundaries only, not save migrations or fabricated player data.

## Twelve new browser groups

- Empty career and exact approved one-time starting package through actual UI; no developer-edit marking.
- Explicit2→3→4 migrations, no automatic upgrade/cycle.
- Duplicate-beast selection disabled; legal owned assembly committed.
- Existing confirmed purchase charges quoted Gold and expands approved capacity.
- Explicit E4 activation and cold reload select durable authority.
- Actual IndexedDB `put` quota denial leaves generation/records/career identical and shows error; valid retry commits once.
- Insufficient Gold keeps commit disabled after authoritative quote.
- All seven sections reachable;1920×1080 overview fits;1366px viewport no horizontal overflow.
- Existing Component/Bulk/Career tools retained; exact P2.2 practice opens while network offline and does not change career records.
- Complete championship backup download requested through original coordinator; no claim of verified external disk durability.
- Disposable registered E3 fixture: read-only roster/finances and real schedule/history context; no cycle or progression caused by inspection.
- Storage denial activates manual mode: in-memory warning and required checkpoint block subsequent actions.

Fresh browser contexts and ephemeral localhost origin were used; no existing browser profile/owner save touched. Fixture inspection bundle is test-only and is not included in the production application.

## Existing regression runners, original assertions preserved

`existing-regressions.mjs` temporarily copies each original runner to a sibling location, redirects only `/workspace/deliverables/bnt-p2-2/evidence` to new E5-A output, executes it and removes the temporary script. Native imports/assertions/reference values remain unchanged. Old accepted evidence is not overwritten.

| Original runner under scripts/p2-2 | Child exit | Result |
|---|---:|---|
| references.mjs |0|**12 historical +2 payroll** retained replay checksums match |
| layout-browser.mjs |0|Five viewport cases; accepted layout, panel order, compact standings and controls preserved |
| interface-browser.mjs |0|Nine real interaction/native groups: navigation, preparation, metrics, countdown, pause/restart, actual Sign input, radio and fallbacks |
| browser-native.mjs |0|100 championship clock states,3 full championship-context native captures, delayed Sign replay/restore |
| checkpoint-compat.mjs |0|18 exact legacy checkpoint wire and10-tick restored continuation comparisons |

The exact accepted P2.2 HTML is unchanged and is the embedded practice source. Production native/AI/track/replay/checkpoint modules are unchanged. No expected checksum regenerated.

## Existing E4 runner against the new HTML

`e4-regression.mjs` runs `scripts/m2-e/e4/stage2-browser.mjs` with its original assertions, switching its HTML path to the E5-A artifact, revealing the retained original workbench for automation and redirecting evidence. Nine groups passed:

1. Explicit migration/manual frozen race start.
2. Paused Sign, full checkpoint and reload retain accepted journal order.
3. Complete backup/restore, consumed identity and interrupted restore.
4. Quota failure during restore activation cannot produce mixed authority; lost-ack recovery.
5. Corrupt/incomplete backups reject without replacing authority.
6. Exact journal-evidence checkpoint corruption repair.
7. Empty-destination restore atomically retains current and previous generations.
8. Lost durable acknowledgement reloads committed input without consuming it twice.
9. Worker restart/full native race publication deterministic and exactly once (replay606b450a; returns INTERMISSION_READY).

This is an existing accepted-fixture compatibility test, not implementation of new E5-B progression. It does not establish new maximum-field/long-schedule performance or final E4 acceptance.

## Artifact and offline evidence

File: `dist/Blood-and-Thunder-E5-A-Stable.html`.

- Bytes: **1,705,666**.
- SHA-256: **`4a74d60f47174ae6aa4c01f3f87b943ebae256d57e535fa638762d6a5c956f88`**.
- Embedded accepted P2.2 SHA: `24c393c19f7d8aa6f4e2bf6794d2e573d11be74508940e97b78a6330b6a203be`.
- E4 Blob Worker, practice Blob Worker, JS/CSS/assets all embedded. Build rejects external runtime resources/import/fetch/WebSocket dependencies in generated application code and rejects changed P2.2 bytes.
- Repeated build hashes match. Original source build also succeeds in isolated temporary directory, producing1,078,517-byte normal artifact; accepted repository dist files were not overwritten.
- Offline browser practice and management navigation passed after network denial. This is not Windows direct-file acceptance.

Direct-file attempt:

`file:///workspace/BNT/dist/Blood-and-Thunder-E5-A-Stable.html`

Managed Chromium returns **`net::ERR_BLOCKED_BY_ADMINISTRATOR`**. The browser runner exits0 because it records this limitation separately after all functional groups, **not because file:// passed**. Windows owner testing remains required. No final owner acceptance claimed.

## Earlier failures retained and resolved

- Initial UI smoke showed empty IndexedDB's “No career authority” as a blocking reason for a valid legacy/new career. Fixed by distinguishing absent authority from corrupt/migrated authority. Final migration/new-career tests pass.
- First workflow found duplicate `hs-quote` IDs. Output now has distinct `hs-quote-output`; final real financial tests pass.
- Next workflow could not invoke migration because retained original E4 control enablement had not refreshed after new legacy setup. Optional presentation port refreshes that original control before invoking it; original authority checks unchanged.
- Extended affordability test initially chose450-Gold upgrade with exactly450 Gold remaining: the test assumption was wrong. Switched to approved500-Gold Workshop; unchanged affordability assertion passes. No economy value changed.

Earlier logs remain in evidence. No assertions/goldens were weakened to conceal failures.

## Unexecuted/unavailable checks and inherited limits

- Windows Chrome/Edge file:// testing and owner acceptance unavailable here.
- Full historical browser-script inventory was not rerun. Relevant runners above were executed; do not call every browser runner passing.
- Known old circuit/rally browser-runner, numerical-diagnostic and P1.1 obsolete zoom assertion issues were not repaired or rerun by this task; their historical nonzero status is separate from current passes.
- E4 large retained-history latency, capacity ceilings and Long Rally cross-runtime issue unchanged. No new performance/memory/full-twelve-event claim.
- No real owner save import/migration or live-career fault injection.
- No E5-B settlement producer, permanent reward/XP/reputation/trophy awarding or E5-C integrated career-to-P2.2 race execution implemented/tested as new functionality.

**Result: E5-A automated correctness and relevant compatibility checks PASS. Owner acceptance remains conditional on the new Windows direct-file walkthrough.**
