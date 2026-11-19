> **Stage 1 continuation:** The Gate A snapshot below is retained as historical evidence. See [the architecture continuation](stage1/BNT_M2-E_E4_Test_Evidence.md) for the owner-authorized implementation proof and current status. Full E4 remains incomplete.

# BNT M2-E E4 Test Evidence — Gate A stop

Date: November18,2026 (America/Los_Angeles). Runtime source:accepted E3 `8d5abe9442e93cb318ef87d4ef47ee0de0e457e2`; initial documentation HEAD`56111653b7d97e2d16203968e397f305d4e0968f`. Tooling`0d8c061c9b32fce1fadde55469fac5dd3bbed012`, branch`feat/m2-e-e4-persistence-recovery`.

## Actual executions

| Command / check | Result |
|---|---|
|`git log/status`, accepted ancestry/source comparison|Verified; runtime/tests/dependencies unchanged; prior untracked audit retained|
|`npm test`|507 passed,0 failed,0 cancelled,0 skipped;461216.361ms|
|`node scripts/m2-d/verify.mjs` in isolated source copy|12 historical references,5 native adapters,5 payroll golden cycles,2 payroll replay checks passed; exit0|
|`node scripts/m2-e/e4/profile.mjs` first completed matrix|18 complete native events, replay assertions passed; CPU/operation/size evidence retained|
|Same script,`BNT_E4_CASE=four-two`, separate output directory|2 independent repeat events; native checksums equal first run|
|Same script,`BNT_E4_CASE=eight-twelve`, separate output directory|12/12 complete native events,8 actual entrants in every event, allEnded; SETTLEMENT_PENDING|
|`node scripts/m2-e/e4/browser-profile.mjs` against each output directory|Corrected diagnostics exit0; HTTP observations include quota failure, not a passing capacity acceptance claim|
|`node --test --test-name-pattern='default eight-entrant Combat Rally' tests/m2-e-foundation.test.js`|Existing test repeated in isolation:1 passed/0 failed,41,072.69ms;4,094,851-byte session, tick1485, bound/reopen/idempotence assertions passed|
|`node scripts/m2-e/e4/analyze.mjs`|Sampled inclusive CPU categories generated; no source/runtime mutation|
|`npm ls --depth=0`|Only esbuild0.28.2/playwright-core1.65.1; no install/update|
|`npm run build`|Succeeded; both accepted HTML aliases byte-identical|
|`git diff --check` and diff against accepted runtime|Clean; no source/tests/dependency/build difference|

The isolated1-test run repeats a case already included in507; it is not a508-test suite. Existing foundation tests containing “E4” in their names are earlier low-level proof tests, not a new periodic-viewer/recovery acceptance suite. No source expectation/checksum was weakened.

Environment:Node24.22.1/npm11.9.0, Chromium156.0.8078.79,5 visible logical CPUs with cgroup quota400000/100000 (four CPU-seconds per second). Timed fixtures ran sequentially without a simultaneously launched test/benchmark job. Memory rows are process high-water marks including profiler/tool allocations, not production browser peak memory.

## Determinism and retained data

32 real native capture/replay assertions passed across the completed main matrix, independent repeat and full8×12 run. All12 one-entrant proof fingerprints match the accepted E3 evidence exactly. The four-entrant repeat has identical native checksums. Detailed assertions are in `evidence/invariants.json`; complete logical stores are retained as lossless gzip snapshots with SHA256/uncompressed-byte manifest.

The maximum-field run's event checksums are:

| Event | Native checksum | Entrants |
|---:|---|---:|
|1|21d66ebd|8|
|2|4ab34797|8|
|3|673e5fd0|8|
|4|67240955|8|
|5|9877754d|8|
|6|24dcb7d5|8|
|7|e7f766c9|8|
|8|8748547c|8|
|9|13466edf|8|
|10|f86a8fc5|8|
|11|02f4b543|8|
|12|964e1d49|8|

No simulation approximation or forced casualty/result was used. Each benchmark event uses one large advance request/journal entry, then accepted native clearance/publication. This is not a periodic checkpoint cadence test. All original D2/scoring/withdrawal/zero-starter/fault cases remain in the507-test accepted suite; no new E4 feature coverage is claimed from them.

## Before/after and blocking

There is **no after-optimization result**, because the Section14.8 stop occurred before production changes. [Profiling Report](BNT_M2-E_E4_Profiling_Report.md) gives all controlled unchanged-source observations; `operations.csv` contains load/import/export/transition/publication/memory rows. The earlier E3 concurrent reference is historical, not a directly comparable optimized run.

Measured unchanged-source publication ranges:one entrant4.262s; four entrants8.210–14.462s (independent repeat6.855–11.785s); eight-entrant Circuit21.713s; one-entrant12 events8.164–37.355s; two eight-entrant Rallies16.765–19.946s; eight-entrant12 events16.898–74.200s. Maximum observed start transition15.223s in the latter. These are observations, not universal bounds.

Real Chromium four-field CareerStore.open693.2ms and official publication12,237.3ms; observed publication long task approximately12,245ms. Snapshot setItem calls were3.7/2.3/10.4ms. The100ms target is unachieved. No async workaround or validation bypass was introduced.

## Browser processes and capacity findings

| Process | Raw exit | Interpretation |
|---|---:|---|
|Initial primary capacity diagnostic|1|File-error-page navigation raced HTTP navigation; retained failure log; no capacity result claimed|
|Corrected primary diagnostic retry|0|All five smaller final sets stored/validated in the isolated HTTP origin; direct-file denied|
|Independent four-field diagnostic|0|Real official publication passed; long task recorded; direct-file denied|
|Maximum-field diagnostic|0|Diagnostic completed and **reported failed capacity**; not a restore/resume PASS|

The test page injects a separate source-built diagnostic namespace for actual store timing; it is not included in the shipped HTML. A separate page handles the denied file navigation before the HTTP page opens. No administrator restriction was bypassed. Page-error arrays in completed diagnostics were empty.

Maximum-field stored values total29,962,817 bytes across13 keys; final career2,246,709 bytes, largest session4,886,153 bytes. Every logical record is within8MiB. Chromium accepted the career and first897,465-byte session, then rejected the2,422,663-byte second session of the **final snapshot**. This is not a claim that the actual live second event failed: measured live-growth sizes reach6,640,590 bytes after event3, which already exceeds the observed capacity interval. The pre-final snapshot also failed to fit; maximum-field browser publication/resume was blocked, not tested successfully.

The independent probe retained19×262,144 ASCII code units plus keys/sentinel; the next chunk failed with QuotaExceededError; sentinel remained last-valid. Tested capacity is therefore bracketed by those observations. Do not equate logical UTF-8 file bytes with a universal browser/disk quota. No unlimited-storage flag or bound increase was used.

Whole maximum snapshot JSON30,302,360 bytes; diagnostic gzip20,841,041 and Brotli-quality5:20,599,868 bytes. Even optimistic16-bit packing of those binary payloads exceeds10.2M code units, before metadata. Neither is a production adapter; no universal impossibility claim is made about other lossless representations.

## Unexecuted E4 acceptance work

Automatic checkpoint/reload/pause/Sign-boundary scheduling, new stale-writer scheduler tests, coordinated restore partial-write tests, browser closure/reopen, backend migration, full-field durable browser completion and E4 recovery UI tests were **not executed**, because those features were not implemented after the major-architecture stop.

All available historical browser UI runners were **not rerun as a new E4 Gate G suite**. Their known obsolete selector and legacy native-log failures remain historical findings, not newly passing results. Championship Node/Chromium clock parity was not rerun in this stopped phase; runtime code is unchanged and native replay/reference tests passed. Firefox/Edge were unavailable/unverified. Do not report a completely passing browser suite or Windows acceptance.

Existing E3 fault tests executed within507 cover native prepare/official commit, lost acknowledgment, blocked/retry, missing/corrupt evidence and protective history. The isolated capacity probe only tests Web Storage behavior and sentinel preservation; it does not demonstrate a coordinated restore protocol.

## Development failures retained

A per-primitive JSON observer pilot was stopped because it materially perturbed timing; its results are excluded. An initial eight-entrant benchmark fixture generated negative test points and was correctly rejected; the new development-only factory uses nonnegative points. No production scoring or accepted test changed. The initial browser navigation-race failure is retained beside its corrected retry. These are tooling failures, not hidden product passes.

## Artifact and reproduction

Accepted E3 aliases rebuilt identically:553640 bytes each, SHA256 **`3de9bb977a50022f0bf9488b3922129aa09ee819f03e402638c4f68795d35a65`**. There is no new E4 feature build. Development tooling is not a runtime dependency.

To reproduce in the development checkout, run `npm test`, then choose distinct output directories using `BNT_E4_PROFILE_DIR` and optional `BNT_E4_CASE` before running the profiling script. Cases:one-new,four-two,eight-circuit,twelve-retained,eight-rally-retained,eight-twelve. Run the browser diagnostic and CPU analyzer against each directory. Do not overlap timed jobs. Full matrices can take many minutes. Session snapshots retain seeds/configuration/journals/native state; decompress `.gz` files to inspect or revalidate, using the included SHA256 manifest. The player needs none of these development tools to open the HTML.

No migrations, real save edits, source changes, merge, push or deployment occurred. See the readiness report for the explicit owner gate.
