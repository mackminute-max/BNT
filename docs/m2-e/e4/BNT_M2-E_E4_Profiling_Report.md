# BNT M2-E E4 — Gate A profiling report

Date: November18,2026 (America/Los_Angeles). Runtime source is unchanged accepted E3 `8d5abe9442e93cb318ef87d4ef47ee0de0e457e2`. Diagnostic tooling `0d8c061c9b32fce1fadde55469fac5dd3bbed012` runs outside the production bundle.

## Method

Baseline507-test execution finished before timing workloads. Fixtures ran sequentially, without a concurrently launched regression/benchmark process. Fixed instance `complete-instance`; race/grid seeds use the accepted E3 deterministic domains. Configuration and native roster/setup are retained in the complete storage snapshots. Pure/Combat, Oval/C01/mixed-rally and retained sessions are represented. No forced injury, outcome or balance adjustment.

Node inspector sampled CPU at its default approximately1ms interval. Delegating observers timed high-level store methods, JSON parsing, cloning and Map storage calls; they did not modify return values or simulation state. Ordinary JSON serialization is measured at explicit export boundaries and by sampled canonicalization stacks. A pilot's per-primitive JSON observer was removed because its millions of calls materially perturbed measurement. Pilot metrics are excluded; logs retained. A development fixture's negative eight-place test points were rejected by production validation; a new benchmark-only nonnegative table fixes that fixture, not the game.

Each native capture was replay-verified. Twelve one-entrant proof fingerprints match the previously accepted E3 measurement exactly; independent four-entrant repetitions have identical native checksums. Timings are single fixed-fixture observations, except repeated load/export/import and the independent four-entrant rerun. No statistical or universal hardware claims. Observer/profiler overhead remains; these are controlled development measurements, not claimed production speedups.

## Controlled workload results

| Run / fixture | Field | Actual events | Publication min–max ms | Longest start ms | Total retained bytes | Process peak RSS MiB |
|---|---:|---:|---:|---:|---:|---:|
|profile/one-new|1|1|4261.61–4261.61|966.51|540886|289.2|
|profile/four-two|4|2|8210.23–14462.15|1553.38|2012460|554.9|
|profile/eight-circuit|8|1|21712.71–21712.71|1238.40|3149607|875.2|
|profile/twelve-retained|1|12|8163.58–37355.39|9944.14|3365035|875.2|
|profile/eight-rally-retained|8|2|16764.86–19945.79|1891.99|4749984|884.3|
|profile-repeat/four-two|4|2|6854.94–11784.80|1669.03|2012460|558.7|
|profile-max/eight-twelve|8|12|16898.20–74199.90|15222.64|29962817|1379.9|

RSS is the process high-water mark, including profiler/replay/tool allocations and earlier fixtures in that process; it is not a measured per-operation browser or production-game peak. Backend timings in this table use an in-memory Map. Real Chromium writes/long tasks are measured separately. Full rows, reload/export/import timings and journal counts are in `evidence/operations.csv` and the results JSONs.

All32 capture/replay assertions passed:18 main-matrix events,2 independent four-field repeat events and12 maximum-field events. The latter actually started8 entrants in all12 events, allEnded. No retirement or casualty frequency conclusion is drawn. Every run ended SETTLEMENT_PENDING. Each event used one large durable advance request; automatic periodic cadence is not implemented or performance-verified by this benchmark.

The isolated accepted large-session test additionally produced4,094,851 bytes at tick1485 with8 default Combat Rally entrants, passed bound/reopen/idempotence checks, and took41,072.69ms including simulation/validation. Its1 test is a repeat of an existing baseline test, not an extra new E4 feature test.

## Dominant costs

| Sampled category | Active samples % | Interpretation |
|---|---:|---|
|Career reconstruction ancestry|80.35|Nested validation/reconstruction dominates; overlaps other rows|
|Protected validation ancestry|23.60|Repeated protected-entry validation/merging; overlaps reconstruction/hash|
|Session decode ancestry|26.43|Checkpoint/journal/native/anchor checks, including career validation|
|Checkpoint codec ancestry|10.63|Packing/compression/decompression|
|Canonicalization ancestry|41.44|Large repeated canonical strings/object traversal|
|Hash/fingerprint ancestry|60.55|Includes work beneath fingerprint callers; overlaps canonicalization|
|Garbage collection|2.68|Allocation/clone/string pressure|

Inclusive categories must not be summed. Exclusive SHA-25629.16%, canonical28.39% and its canonical-field callback13.06% together account for about70.6% of all samples. Exclusive structured-clone frames account for5.03%. CPU traces and the categorizer are retained; native simulation is present, but is not the principal sampled cost of this persistence workload.

For the primary one-new official operation, inclusive observations included3 session decodes,12 storage reads and2 writes. Those Map reads/writes totaled only a fraction of a millisecond. Their containing validation/serialization costs were seconds. Do not equate those Map timings with real disk durability.

Source growth explanation: `validateControllerState` reconstructs all receipts, merging/validating protected entries at each prefix; nested legacy origins are also reconstructed. Envelope creation validates then parses, and CareerStore publication parses again. Stored-anchor reads parse a career then validate it again. Session decoding invokes anchor validation and is repeated during load, proof publication and transfer. This explains growth with history/data size; it is not a formally fitted complexity model.

## Actual browser blocking and quota

Chromium156.0.8078.79, isolated HTTP origin, accepted standalone bundle plus a development-only source-built diagnostic namespace. Direct-file navigation was administrator-blocked. Four-field final snapshot writes were3.7ms,2.3ms and10.4ms; CareerStore.open693.2ms. Real protected publication measured12,237.3ms with one observed approximately12,245ms long task. The100ms target is not met. Storage writes and the protected computation are distinct measurements.

The final maximum-field data set has13 records and29,962,817 bytes. The fresh-origin write probe accepted the2,246,709-byte career and897,465-byte first session, then rejected the2,422,663-byte second session with QuotaExceededError. The complete pre-final set also failed capacity. No maximum-field browser resume/publication success is claimed. Headless completion in an unlimited Map is not browser capacity verification.

A separate quota probe retained19 ASCII chunks of262,144 code units then rejected the next; sentinel unchanged. This approximates5.24M ASCII code units including keys in this origin. It is not a universal quota or a physical-disk byte allowance. Current dataset strings are ASCII, so their UTF-8 byte counts and code-unit counts coincide. Application limits remain8MiB per career envelope/session and32MiB decoded codec graph, with existing identity/receipt/journal caps.

Whole final-set serialization30,302,360 bytes; gzip20,841,041 bytes; Brotli quality5:20,599,868 bytes. Hypothetical16-bit binary packing still needs about10.3M code units, beyond the tested quota, before metadata. These are diagnostic wrappers, not production codecs or a proof about every possible semantic compression scheme.

## Prioritized optimization plan and stop

1. Private exact-byte/identity/revision validated snapshots and immutable prepared candidates can remove redundant trusted work; retain fresh untrusted validation and stale-writer checks.
2. Reuse validated protected ID/effect indexes across reconstruction prefixes. Current mergeProtected already builds Maps, but repeatedly rebuilds and revalidates them; retain every fact and complete validation.
3. Move full cold validation/codec/replay preparation to an inline worker, with explicit durable coordination and truthful busy/progress state; avoid full history JSON in routine UI rendering.
4. Use a versioned transactional backend able to retain the measured records. The recommended IndexedDB coordinator is a major change requiring the Section14.8 owner gate. Caches do not add capacity.
5. Only after that proof, implement scheduler/recovery/bundle and their fault/capacity/browser acceptance gates.

No optimization or backend replacement was performed. There is no valid before/after speedup table. The old E3 concurrent timing reference and these controlled observations use different measurement conditions and must not be labeled a code improvement/regression. See the architecture proposal and stop report.
