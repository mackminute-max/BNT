# BNT M2-E E4 — Stage 1 Test Evidence

**This is Stage 1 evidence, not complete E4 acceptance.** Final runtime revision: `1cde0b0a6d6f49fc3a87ca886e87fd79cd501948`; branch `feat/m2-e-e4-persistence-recovery`. Baseline E3: `8d5abe9442e93cb318ef87d4ef47ee0de0e457e2`.

## Environment and preservation

Node 24.22.1, npm 11.9.0, Chromium 156.0.8078.79, esbuild 0.28.2, playwright-core 1.65.1. No dependency installation/update. Only Chromium is installed; Firefox/Edge/Windows are unverified. User-facing date: November 18, 2026, America/Los_Angeles.

Existing audit/profiling datasets are preserved. Runners that generate historical documentation were executed in `/tmp/bnt-e4-stage1-regression`, an isolated source/build snapshot, to avoid overwriting accepted repository evidence. The raw process table records exact scripts, elapsed time and exit codes.

## Executed commands and meaning

| Command | Actual result / scope |
|---|---|
|`npm test` before architecture changes|507 passed, 0 failed, 0 skipped; 482186.026 ms|
|`node --test tests/m2-e-e4-worker.test.js`|5 passed, 0 failed on final focused run; these are included in the expanded full suite, not five extra unique tests|
|`npm test` initial architecture revision|512 passed, 0 failed, 0 skipped; 624450.830 ms; concurrent browser load, not a performance benchmark|
|`npm test` at `3301eb6`|512 passed, 0 failed, 0 skipped; 486488.856 ms, exit 0. Two later browser-only compatibility fixes have focused evidence as explained below|
|`node scripts/m2-e/e4/stage1-browser.mjs`|Seven architecture groups passed on the cache implementation: real worker validation/replay, storage, publication and complete retained set|
|`BNT_E4_STAGE1_OUT=… node scripts/m2-e/e4/stage1-browser.mjs --publication-only`|Six groups on final staged-migration code; includes actual pre-career-commit failure and lost worker acknowledgment after database commit. Capacity group is intentionally outside this focused rerun; default runner still includes it|
|`node scripts/m2-e/e4/stage1-faults.mjs`|Three groups passed, one failed (exit 1): tab CAS and migration boundaries pass; native quota override did not enforce the requested cap|
|`node scripts/m2-e/e4/stage1-standalone-smoke.mjs`|HTTP embedded worker, typed sentinels, generation/reload and migrated legacy-UI guard pass, exit 0|
|`node scripts/m2-e/e4/stage1-routine-benchmark.mjs`|Fixed four-entrant final-event routine timing; results in `routine-benchmark.json`. Measured separately after other heavy jobs finish|
|`npm run build`|Pass; worker embedded in one HTML, external-dependency scan passes|
|`node scripts/m2-d/verify.mjs` in isolated snapshot|12 historical replays, 5 native package adapters, 5 payroll golden cycles and 2 payroll-context replays pass, exit 0|

The frozen-run summary is generated from actual logs; no unexecuted test is assigned a pass. Interim diagnostic attempts and failed quota runs remain available. A passing HTTP functional group in a script with a nonzero exit is not a wholly passing script.

## B1 worker and condition proof

Five focused Node cases establish full cold career validation, exact-byte cache reuse, cache invalidation on generation change, corrupt-byte rejection, unsupported worker version rejection, pending-candidate rejection/reset, bounds/duplicate-record rejection and cache promotion only for the exact acknowledged candidate. The D2 typed-wire test compares the unmodified pure adapter result exactly, preserving fractional 59.5/29.5 condition and 7.5 chariot loss without mutating source input.

Real browser publication compares official race results, standings, native/persistent entrants, eligibility and management state with the accepted reference. Treasury remains 1175 Gold; no E5 award credit. The browser command uses its own protected operation ID, so whole receipt bytes are not expected to match a differently named original command; official consequences do match.

The worker restart proof terminates a worker with pending work, observes rejection rather than durable success, starts a fresh worker and cold-validates database authority. No worker result itself is a durable acknowledgment.

## Native replay evidence

Worker replay uses the original `capture`, `verifyReplay`, codec and native engine, not a second simulator. Four-field reference checksums: `bb5a9ce7`, `fa43a07a`.

Eight-field/twelve-event checksums, in frozen event order:

| Event | Checksum | Event | Checksum |
|---:|---|---:|---|
|1|`21d66ebd`|7|`e7f766c9`|
|2|`4ab34797`|8|`8748547c`|
|3|`673e5fd0`|9|`13466edf`|
|4|`67240955`|10|`f86a8fc5`|
|5|`9877754d`|11|`02f4b543`|
|6|`24dcb7d5`|12|`964e1d49`|

All match accepted Gate A native results. Pure/Combat and Oval/Circuit/Rally occur in that reference schedule. This is fourteen real native replay comparisons per full architecture run, not fourteen additional independent championship experiments. Repeated runs are repeats, not pooled unique samples. Existing 12 historical and 2 payroll replay references were freshly verified separately; expected values were not edited. Championship clock Node/Chromium parity script exits 0; the historical native logarithm diagnostic retains its known failure.

## B2 transaction and migration faults

Actual IndexedDB transactions demonstrate:

- Injected abort before transaction completion preserves generation 0.
- Competing expected-generation writes produce exactly one success.
- A wrong read set rejects even with the expected generation.
- Two distinct tabs cannot both commit generation 0.
- Injected QuotaExceededError aborts without changing the prior head.
- Native prepare is durably committed before official CareerStore preparation.
- A failure before the career commit leaves durable career/session records unchanged.
- Losing the worker acknowledgment after the career commit produces an error; a new snapshot/retry recovers identical official bytes, without duplicate conditions, standings, points or pending identities.
- Corrupt career bytes and missing required official sessions reject without altering durable data.

Final migration fault labels are **staged**, **witnessed**, **activated**, **discovered**. Each intentionally interrupts, closes/reopens the database, checks the correct pending/canonical state and retries. The activated result remains generation 1. Source save bytes remain unchanged. Denying the pre-activation intent leaves a resumable stage and no career head. Deleting the same-name database after activation does not permit stale legacy re-import. Foreign witness/database identities reject. These tests use low-level synthetic backend records for storage-boundary faults; the separate real career/session migration proof validates actual native records in the worker first.

### Failed real-quota diagnostic — retained

Chromium `Storage.overrideQuotaForOrigin` returns success and `Storage.getUsageAndQuota` reports `overrideActive:true`, quota 200000 bytes. A legal, under-8-MiB high-entropy logical-record write nevertheless succeeds; the observed Storage estimate remains around 10.7 GB. Therefore the assertion requiring QuotaExceededError fails and the script exits **1**. Earlier attempts using an incognito context and smaller/compressible payloads are retained as diagnostic history, not counted as successful quota tests.

This does not show a partially committed coordinator write: the browser accepted the transaction. It shows that this override did not establish native quota exhaustion in the managed browser. Passing injected abort/QuotaExceededError tests must not be represented as actual disk-quota exhaustion. Real capacity remains finite, and this gap is an explicit Stage 1 qualification.

## Capacity and performance observations

Original Gate A four-field browser publication: 12237.3 ms total and approximately 12245 ms uninterrupted main-thread task. New work moves validation/reconstruction into a worker; total preparation remains substantial. Measurements below are fixed-fixture observations, not a statistical speedup claim.

| Observation | Measured result |
|---|---:|
|Original retained maximum set rejected by Web Storage|29962817 logical bytes|
|Same set retained in IndexedDB|13 records, 29962817 logical bytes, exact byte readback|
|Observed IndexedDB usage after large set|34697216 bytes in cache-run snapshot|
|Large cold worker validation under concurrent regression load|137007.3 ms|
|Large head commit under that load|601.7 ms total acknowledgment|
|Large warm exact validation cache|352.2 ms worker time|
|Four-field cold worker validation in final publication-fault run|3896.2 ms|
|Four-field warm exact cache in that run|7.3 ms|
|Observed whole-page longest task, final focused fault run|186 ms|
|Observed whole-page longest task, large loaded run|530 ms|

Whole-page tasks include startup and diagnostic large-fixture transfer. They are not asserted to be a pure disk-commit duration. See `routine-benchmark.json` for scoped critical-operation windows, worker preparation and separate total acknowledgment times. Long Task API observations have a 50 ms reporting threshold; zero observed long tasks means none at or above that threshold, not literally zero CPU time.

The preferred 100 ms main-thread target is **not universally met**. Neither 67–137 second cold validation nor multi-second publication is acceptable to describe as instantaneous. No authoritative precision, validators, hashes, journals, protected records or native decisions were sacrificed. The large database test retains an already completed accepted set; it is not live E4 automatic-viewer championship capacity. Full-schedule growth with periodic journals, previous generations and staged imports remains Stage 2 work.

## Existing browser inventory — raw process exits

See `evidence/regression-summary.json` for exact times, functional group counts and raw logs. Inventory was run from an isolated snapshot at `005a43f`; final migration changes are covered by the final focused tests. Legacy source/native engine and dependencies are unchanged.

| Script | Exit | Disposition |
|---|---:|---|
|`scripts/m2-d/browser.mjs`|1|14 HTTP functional groups pass; file navigation blocked|
|`scripts/m2-c/browser.mjs`|1|20 HTTP functional groups pass; file navigation blocked|
|`scripts/m2-b-browser.mjs`|1|13 HTTP functional groups pass; file navigation blocked|
|`scripts/m2-a-browser.mjs`|1|12 HTTP functional groups pass; file navigation blocked|
|`scripts/persistence-browser.mjs`|1|18 HTTP functional groups pass; file navigation blocked|
|`scripts/browser-test.mjs`|1|23 HTTP functional groups pass; file navigation blocked|
|`scripts/track-expansion/browser.mjs`|0|10 groups pass|
|`scripts/circuit-rally/browser.mjs`|1|Known obsolete track selector; not altered|
|`scripts/combat-ai-refinement/browser.mjs`|0|7 groups pass|
|`scripts/m2-e/browser.mjs`|1|10 HTTP functional groups pass; file navigation blocked|
|`scripts/m2-e/e2-e3-browser.mjs`|1|8 HTTP functional groups pass; file navigation blocked|
|`scripts/m2-e/e3-completion-browser.mjs`|1|7 HTTP functional groups pass; file navigation blocked|
|`scripts/m2-e/championship-clock-parity.mjs`|0|Versioned championship clock Node/Chromium parity passes|
|`scripts/m2-e/clock-parity.mjs`|1|Known legacy native-log numerical diagnostic mismatch; not altered|

Thus 3 of 14 browser/clock processes exit 0; 11 exit nonzero. This is **not an all-passing browser suite**. There is no claim of Edge/Firefox or owner Windows acceptance.

## Build and unavailable tests

Final standalone alias: `dist/Blood_and_Thunder.html` (also `dist/Blood-and-Thunder-Track-Test.html`), **988319 bytes**, SHA-256 **`5d03542c2f7c45cf76a920a5a0591047b4c571535960864ea2d41bce84135a51`**. The downloadable Stage1-Proof copy has exactly these bytes. Build and external-runtime-dependency scan pass; no new runtime package, adjacent worker asset or server requirement.

Managed file navigation returns `ERR_BLOCKED_BY_ADMINISTRATOR`. Windows IndexedDB/Blob worker persistence through direct `file:///` and browser closure has not been performed. HTTP reload is tested, not represented as Windows close/reopen. Full Stage 2 checkpoint scheduling, player recovery/backup UI, complete restore fault protocol and new live eight-field/twelve-event workflows remain unexecuted because they are not implemented. The small Windows procedure is supplied separately.

## Final revision and focused follow-up

The complete 512-test run is pinned to `3301eb6`. Final runtime `1cde0b0a6d6f49fc3a87ca886e87fd79cd501948` adds canonical migration record ordering and the legacy/manual UI compatibility guard. These browser-specific changes are covered by the reversed-enumeration migration test, final standalone smoke (including IndexedDB absent, both storage APIs denied, and witness enforcement), a fresh legacy persistence runner with all 18 HTTP functional groups passing, and the clean real-career routine benchmark on the final HTML. The 512-test suite was not rerun after those two focused fixes; this distinction is explicit rather than assigning an unexecuted whole-suite pass to a later revision. The native simulation, career reducers, existing tests and replay references are unchanged.

An initial extension of the standalone smoke timed out because its developer panels were closed. The diagnostic was corrected to open the actual panels, as the established persistence runner does; the failed attempt is retained. It was not a production defect or a weakened assertion.

## Final clean routine measurements

Final artifact SHA-256: `5d03542c2f7c45cf76a920a5a0591047b4c571535960864ea2d41bce84135a51`. No concurrent heavy job was intentionally launched. Scoped Long Task threshold is 50 ms; zero means none observed at or above that threshold.

| Operation | Total acknowledgment ms | Worker preparation ms | Longest observed main-thread Long Task ms |
|---|---:|---:|---:|
|confirmed migration|4332.3|—|0|
|cold validation after migration|3467.6|—|0|
|warm exact cache|39.6|—|0|
|native prepare durable acknowledgment|7700.7|7641.1|0|
|official career commit durable acknowledgment|10487.4|10401.7|0|
|identical official retry|92.6|29.3|0|

Native prepare plus official acknowledgment totals 18188.1 ms. The earlier monolithic Gate A publication observation was 12237.3 ms; end-to-end total is not improved by this proof. The demonstrated gain is main-thread responsiveness and exact-cache reuse. Cold validation includes retained native sessions, unlike a career-only open. Busy duplicate submissions were rejected. Larger loaded transfers still produced a 530 ms whole-page task, so the 100 ms preference is not universally met.

Final legacy compatibility smoke additionally passes with IndexedDB absent, and with both IndexedDB and Web Storage unavailable: unmigrated legacy/manual behavior remains, while an existing migration witness still blocks legacy writes. A fresh final-artifact persistence runner passes all 18 HTTP functional groups and exits 1 solely for file-navigation policy.
