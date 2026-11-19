# BNT M2-E4 — Performance Profiling and Safe Optimization Report

Date: November 19, 2026. This is a local implementation delivery, not owner acceptance or permission to merge.

## Revision and scope

Runtime baseline: `a07c3d2ef3a97d47f349440e0533706d24f4a50f`. Starting delivery HEAD: `6b3920037090ef1e74541fc29a5d5fb9df1c4832`, whose source/build match that runtime. Final tested runtime: `b8c090057052ac03bbed73d9487093da61381451`, branch `feat/m2-e-e4-persistence-recovery`. Source commits: `3d8f7c76b1fa83301a313927288881e9a8ba3a27`, `0334ecb94ad9beae6f2dd435978e63cde5f19e84`, `8334db6a64794e1184a0d7bfec052d933bcdb25f`, `b8c090057052ac03bbed73d9487093da61381451`.

Only six production modules changed: `src/sim/foundation/codec.js`, `src/core/determinism.js`, `src/career/economy/fingerprint.js`, `src/persistence/e4/indexeddb.js`, `src/persistence/e4/worker-service.js`, and `src/persistence/race/session-store.js`. Added profiling scripts, seven regression tests and frozen baseline byte fixtures; rebuilt both HTML aliases. No simulation movement, physics, AI, RNG, Strategy Sign, incident, payroll, condition mapping, scoring or reward rules changed. No dependencies, schema versions or record bounds changed. No merge, remote push, release or deployment.

## Method and limitations

Controlled baseline and final profiling ran separately, with one benchmark process at a time, before the concurrently executed regression inventory. Node 24.22.1; npm 11.9.0; Chromium 156.0.8078.79; Linux container with four-CPU quota and approximately 34 GB memory. This is not Windows or representative low-end hardware. Five fresh-state samples per raw 100-tick case; browser operations have one measured observation each. Late raw advances have three paired observations. Do not interpret these as confidence intervals or guaranteed speedups. V8 JIT and GC variability remain; the final early Long Rally raw median increased, rather than establishing a core simulation speedup.

Fixtures use the actual accepted championship setup factory: one-entrant Pure short oval; four-entrant Combat C01; eight-entrant Combat oval; eight-entrant Combat generated Long Rally (generator seed 145). A separate retained baseline eight-entrant twelve-event fixture retains thirteen logical records and reaches the final publication boundary. Its in-memory legacy adapter deliberately avoids pretending that this large fixture fits Web Storage; it exercises real IndexedDB retention, validation and worker operations. It is not a fresh twelve-event gameplay run in this pass. Prior baseline capacity evidence is preserved separately.

Node CPU sampling accompanies core timings and adds overhead. Separate source-observer bundles measure inclusive/exclusive subsystem times without production modifications; their checksums match the uninstrumented fixtures. Subsystem observers add timing overhead and are not used to judge targets. Memory figures are sampled RSS/heap and browser page heap, not complete process/worker peak memory. Browser Long Tasks observes tasks of at least 50 ms; absence of an observed long task is not an exhaustive frame-time guarantee.

## Raw simulation (milliseconds; median of five)

| Fixture | Baseline raw100 | Final raw100 | Full-race checksum | Final packed bytes |
| --- | --- | --- | --- | --- |
| one-short | 6.0 | 7.1 | 428bd803 | 86722 |
| four-circuit | 29.3 | 24.2 | 8a29f348 | 1084496 |
| eight-oval | 51.2 | 54.9 | 95ad74b4 | 1146184 |
| eight-long | 56.3 | 66.1 | 3cc91b8c | 6955742 |

All four full native race checksums and encoded byte counts match baseline. Full packed checksum fixtures additionally cover Unicode, non-finite sentinels, undefined, negative zero, aliasing, frozen property flags and dictionary resets. Raw timing excludes race setup and excludes durability.

At Long Rally tick 2000, raw ticks 2000–2100 take baseline median 228.1 ms and candidate median 190.0 ms (three pairs; checksum `5f24106f` throughout). The aspirational raw100 <100 ms target therefore holds for the early eight-entrant fixtures, not every race phase. No raw simulator algorithm was changed; allocation/GC and hash utility effects can influence these observations.

## End-to-end browser durable operations (milliseconds)

| Fixture | Operation | Baseline | Final | Observed ratio |
| --- | --- | --- | --- | --- |
| one-short | migration-cold-validation | 453.6 | 363.3 | 1.25× |
| one-short | start | 1493.6 | 1152.9 | 1.30× |
| one-short | birth | 1556.4 | 991.1 | 1.57× |
| one-short | advance-100 | 512.7 | 94.9 | 5.40× |
| one-short | advance-next-100 | 143.3 | 84.3 | 1.70× |
| one-short | warm-inspect | 18.2 | 17.2 | 1.06× |
| one-short | cold-reconstruction | 1481.2 | 379.7 | 3.90× |
| four-circuit | migration-cold-validation | 399.1 | 398.7 | 1.00× |
| four-circuit | start | 1510.9 | 1526.7 | 0.99× |
| four-circuit | birth | 1944.3 | 1134.9 | 1.71× |
| four-circuit | advance-100 | 925.0 | 145.3 | 6.37× |
| four-circuit | advance-next-100 | 960.0 | 296.5 | 3.24× |
| four-circuit | warm-inspect | 29.5 | 18.6 | 1.59× |
| four-circuit | cold-reconstruction | 2037.3 | 710.6 | 2.87× |
| eight-oval | migration-cold-validation | 389.1 | 343.0 | 1.13× |
| eight-oval | start | 1498.0 | 1173.9 | 1.28× |
| eight-oval | birth | 1792.6 | 982.2 | 1.83× |
| eight-oval | advance-100 | 1341.5 | 335.4 | 4.00× |
| eight-oval | advance-next-100 | 2168.6 | 583.1 | 3.72× |
| eight-oval | warm-inspect | 54.9 | 26.1 | 2.10× |
| eight-oval | cold-reconstruction | 3041.0 | 818.9 | 3.71× |
| eight-long | migration-cold-validation | 437.8 | 408.4 | 1.07× |
| eight-long | start | 1977.6 | 1623.3 | 1.22× |
| eight-long | birth | 2360.4 | 1367.7 | 1.73× |
| eight-long | advance-100 | 2135.4 | 416.5 | 5.13× |
| eight-long | advance-next-100 | 2868.9 | 732.2 | 3.92× |
| eight-long | warm-inspect | 57.6 | 35.6 | 1.62× |
| eight-long | cold-reconstruction | 3538.8 | 1022.8 | 3.46× |
| retained | migration-cold-validation | 71955.3 | 23521.2 | 3.06× |
| retained | nativePrepare | 92116.5 | 25473.7 | 3.62× |
| retained | official | 22673.5 | 15107.1 | 1.50× |
| retained | backup | 140509.0 | 21366.8 | 6.58× |
| retained | warm-inspect | 13073.3 | 528.1 | 24.76× |
| retained | cold-reconstruction | 77553.8 | 23354.6 | 3.32× |

The late Long Rally 100-tick durable advances at tick 2000 improved from 22,446.0 / 25,504.3 ms to 6,388.3 / 5,646.5 ms. This is substantial improvement and still fails the 500 ms target. The first eight-entrant advances meet 500 ms (335.4 oval; 416.5 Rally); the next advances miss it (583.1 and 732.2). Single observations show scale, not statistically stable latency claims.

## Codec, reconstruction and journal measurements (milliseconds)

| Fixture | Operation | Baseline | Final |
| --- | --- | --- | --- |
| one-short | pack-final | 56.2 | 27.7 |
| one-short | checkpoint-final | 56.3 | 12.2 |
| one-short | restore-final | 37.2 | 27.0 |
| one-short | decode-session | 22.7 | 11.1 |
| four-circuit | pack-final | 938.5 | 406.6 |
| four-circuit | checkpoint-final | 944.8 | 160.9 |
| four-circuit | restore-final | 541.2 | 341.6 |
| four-circuit | decode-session | 157.0 | 31.3 |
| eight-oval | pack-final | 1012.6 | 421.3 |
| eight-oval | checkpoint-final | 865.2 | 205.5 |
| eight-oval | restore-final | 539.3 | 376.0 |
| eight-oval | decode-session | 451.3 | 85.3 |
| eight-long | pack-final | 4479.4 | 1936.4 |
| eight-long | checkpoint-final | 4577.2 | 867.8 |
| eight-long | restore-final | 3185.8 | 1984.3 |
| eight-long | decode-session | 530.7 | 110.2 |

`pack-final` is the first timed pack in each case; checkpoint construction later in the same case may benefit from exact-content cache warmth. Restore/unpack always performs graph and native validation; cold worker loads still validate all untrusted data. Session recovery from a deliberately invalid latest checkpoint plus a complete three-request journal (advance, paused Conserve Strength, advance) improves from 1,982.8 to 402.4 ms. Both serialized sessions are byte-identical (576,443 bytes), watermark 3, tick 200, checksum `1afc6844`.

## Attribution: where the time goes

- Full native graph traversal, object descriptors, LZW transport, canonical encoding, SHA hashing and repeated session/career validation dominate durable workloads. The full Long Rally pack alone cost 4,479.4 ms baseline; native boundary validation cost 3.1 ms. This does not support blaming AI or collisions for multi-second durable latency.
- The separate subsystem observer reports movement, forward collision resolution, lane changes, driver decisions, attack resolution, incident updates, environment integration and derived model calculation independently, with inclusive/exclusive times in `evidence/subsystems/subsystems.json`. Nested costs must not be summed twice.
- Browser Long Rally first100: worker RPC 2,084.3→378.6 ms, snapshot/read 12.1→4.3 ms, durable commit 37.2→27.0 ms. RPC includes worker scheduling, preparation, message/clone and response overhead; it is not an isolated compute timer.
- Retained official publication: worker RPC 21,644.4→14,065.1 ms; IndexedDB commit wall 848.0→722.4 ms. Backup RPC 139,994.6→20,837.0 ms. Full-history checking is still expensive.
- Synchronous outbound `postMessage` clone is separately observed. Retained backup clone was 42.0→166.5 ms, an adverse observation; no clone improvement is claimed. The instrumentation is attached to the original worker, so clone timing after restart is unavailable. Return-clone and scheduling are not independently isolated.
- Main-thread worst observed task for retained operations: baseline 592 ms, final 525 ms (26 and 23 observed long tasks). The final late Rally has one 58 ms task. Thus the <50 ms target is not globally met, even though most processing is off-thread. No new progress UI changes were made; accepted pending/duplicate-submission handling remains.

## Retention and memory

Identical logical record bytes were retained in every paired browser fixture. Early Long Rally after two requests: 1,219,631 bytes. Retained twelve-event fixture after publication: 29,962,792 bytes; Chromium estimate reports 89,989,120 bytes IndexedDB usage including backend retention/overhead. Estimated quota was approximately 10.8 GB for that managed origin; this is neither a guarantee nor unlimited storage.

The core profile's largest sampled RSS increased from approximately 1.019 to 1.094 GB. Retained browser page heap sample increased from 182.8 to 213.2 MB. These are GC-dependent samples, not isolated peak-memory experiments; no memory reduction is claimed. The new graph cache retains at most one graph text (existing 32 MiB UTF-8 bound) plus its <=8 MiB transport, with potentially larger JavaScript string/object overhead. Existing full-state and history retention still drive growth. No evidence was discarded.

## Implemented safe changes and trust boundaries

1. Numeric prefix-code/byte LZW dictionary and direct little-endian 16-bit IO replace phrase concatenation and per-bit loops (`codec.js:56`). Code allocation, reset behavior and serialized `lzw16-v1` bytes remain exact.
2. Full graph text and UTF-8 bytes are generated once (`codec.js:29`). A private one-entry cache compares complete freshly traversed graph text; it never trusts mutable identity or a caller's hash (`codec.js:87`). Transport copies prevent callers mutating cached data. The exact inverse cache verifies all transport fields and own data descriptors; full graph and native validation still runs (`codec.js:75`). Cold or differing bytes use the complete decoder.
3. Bounded canonical quoting/shape caches (`determinism.js:20`) reuse only pure string encodings/sorted keys; every value is still traversed, preserving getter/order behavior. SHA-256 block updates avoid per-block arrays (`fingerprint.js:5`) without changing arithmetic/output.
4. Ordered exact string-pair comparisons avoid serializing entire read sets (`indexeddb.js:15`). Generation checks, read sets, checksums and strict IndexedDB transaction durability remain enforced.
5. Private worker reuse is bound to exact record strings and metadata; copied cache keys cannot be mutated through candidate arrays. Already fully validated CareerStore state is reused only while raw bytes match (`worker-service.js:23`). Cold loads retain every career/native validator. Backup preserves its verified current context while separately validating previous authority.
6. Local session decode carries a freshly computed state hash across boundaries where that local state does not change, recomputing after every journal execution (`session-store.js:69`). Every before/after/watermark/head comparison remains.

## Target disposition and next action

Raw initial100: PASS for measured early eight-entrant fixtures; late100: target missed. Durable100: CONDITIONAL, dependent on field/history. Main-thread <50 ms: NOT MET globally. No perceptible playback stalls: not established; multi-second acknowledgments remain. Backup/restore authority: regression-tested separately; large operations remain slow, even with responsive worker processing.

Recommend owner review of the remaining representation/history and message-transfer costs before further architecture work. No gameplay simplification is justified by this cost attribution. E5/E6 remain unauthorized. See the architecture, cross-runtime, test-evidence and readiness reports in this directory.

## Workload coverage caveat

The retained input fixture has 13 logical records (career plus 12 sessions), 29,885,318 bytes before final official publication, and 12 total accepted journal requests (one large advance per session); largest input session is 4,886,153 bytes. Publication grows it to the reported 29,962,792 bytes. The late Rally timing uses one 2,000-tick warmup request followed by two 100-tick requests, not a dense automatic journal with hundreds of inputs. Automatic-checkpoint correctness is exercised by the regression runners, but these timings do not establish worst-case dense-journal or twelve-Long-Rally capacity. Per-record limits remain enforced; no broad capacity guarantee is inferred from this fixture.

Raw timing includes the simulator's normal diagnostic digest at each 100-tick boundary (`race.js:1069`). That digest includes historical events via `snapshot()`/`digest()` (`race.js:312`, `:354`). Thus late raw growth includes replay-history canonicalization, not only motion/AI. Sampled CPU self-time totals across the complete profiled workload show baseline compression approximately 7,968 ms and canonicalization approximately 5,393 ms; final compression approximately 1,410 ms, canonicalization approximately 4,435 ms, plus approximately 1,777 ms in key-shape lookup. These sampled whole-workload self-times are diagnostic, not separately timed browser operations or a justification for removing diagnostics.

Compatibility identifiers and limits remain: career schema 5; controller command v4; native graph version 1 / `lzw16-v1`; 8 MiB logical record/checkpoint bound, 32 MiB decoded graph, 200,000 graph nodes; 1,000 journal requests, 1,000 retained receipts and 2,000 protected identities. No migration is required for these implementation-only changes. Old bytes remain readable; cold validation is not replaced by a cache token.

The separate final regression retained-backup test successfully exported a 60,528,192-byte complete container, restored it and verified all twelve native replays with `SETTLEMENT_PENDING` intact. Its approximately 33.6 s load, 67.0 s publication, 34.3 s backup and 87.2 s restore occurred under concurrent regression load and a different call sequence (combined publish rather than separately timed nativePrepare/official). These values are not controlled before/after benchmarks; they do demonstrate that user-visible latency can remain substantial. No claim of responsive worst-case restore is made.

Final-source large-wire verification was repeated after all regression jobs finished, serially in one process: three baseline/candidate pairs produced exactly identical 6,955,742-byte transports (exit 0). Candidate first encode 1,610.6 ms, subsequent exact-content warm encodes 468.5 / 443.5 ms versus baseline 5,424.8 / 5,431.3 / 5,261.4 ms. These warm numbers are not cold-load guarantees. That comparison process co-resides baseline and candidate states/caches and sampled up to 1.560 GB RSS; it does not isolate either implementation's peak memory. Memory pressure remains a material limitation. See `evidence/codec-final-comparison.json`.
