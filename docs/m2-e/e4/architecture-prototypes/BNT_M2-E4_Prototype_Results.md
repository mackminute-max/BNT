# BNT M2-E4 — Prototype Comparisons and Performance Results

## Scope and method

Production runtime is `b8c090057052ac03bbed73d9487093da61381451`. Prototype source commit inventory is in the evidence manifest/source verification; no production file, accepted reference, dependency or stored owner save changed. Experiments compare actual source-domain fixtures and original validators; they are not an alternative racing engine.

Controlled latency runs were sequential, with no other test/benchmark job running. Node 24.22.1 and Linux Chromium 156.0.8078.79, approximately four-CPU managed environment. Browser comparisons pair baseline first and candidate second on identical input records/configuration in separate throwaway databases. Operations are single observations, not statistical estimates or service-level guarantees. JIT, GC and host variability remain. Inspector memory diagnostics run separately and their elapsed times are not latency benchmarks.

Default single-event fixtures are **Pure**, Clear weather, one lap: one entrant short oval, four C01 entrants, eight oval entrants, eight generated Long Rally entrants (generator seed 145), plus the same Long Rally at tick 2000. The factory defaults must not be mislabeled Combat. Explicit additional **Combat** Long Rally comparisons are shown below. Retained twelve-event data contains mixed Pure/Combat formats.

The graph dense workload has seventeen 25-tick snapshots through tick 425, with a paused Conserve Strength input at tick 100. The browser dense workload has twelve 25-tick advances plus a paused Conserve Strength input at tick 100, through tick 300. Both baseline/candidate use identical counts within each comparison; do not equate these different microbenchmarks.

## Lossless representation — total bytes across all snapshots

| Fixture | Snapshots | Legacy transports | Positional pages | Node templates | Template saving | Last legacy pack ms | Last template prepare ms |
| --- | --- | --- | --- | --- | --- | --- | --- |
| one-short | 2 | 61,133.0 | 87,675.0 | 47,582.0 | 22.2% | 4.8 | 7.3 |
| four-circuit | 2 | 200,440.0 | 514,722.0 | 155,836.0 | 22.3% | 24.8 | 25.0 |
| eight-oval | 2 | 447,505.0 | 1,311,490.0 | 352,650.0 | 21.2% | 66.8 | 87.1 |
| eight-long | 2 | 620,514.0 | 1,768,636.0 | 420,758.0 | 32.2% | 89.8 | 70.6 |
| late-long | 2 | 5,219,444.0 | 16,424,246.0 | 3,101,579.0 | 40.6% | 649.8 | 508.9 |
| dense-journal | 17 | 2,307,977.0 | 5,102,714.0 | 938,766.0 | 59.3% | 51.7 | 29.6 |

Positional pages fail: reference-index changes invalidate most pages, increase storage and often preparation cost. The failed implementation and results are retained.

Node templates reduce serialized snapshot-series storage, preserving separate object occurrences and original alias layouts. Example: the late Pure Rally series is 5,219,444→3,101,579 bytes; the dense series is 2,307,977→938,766 bytes. These are experimental archives including manifests and retained template chunks, not full production session/backup containers. Every decoded snapshot is compared with the complete original legacy wire and native digest; no event/journal pruning occurs.

The first late template encode is not faster (about 869 versus 859 ms); the later encode is about 509 versus 847 ms. Full graph traversal, archive reconstruction and descriptor validation remain. This does **not** demonstrate a faster complete durable transaction: the accepted session fingerprint still requires its legacy computations. Storage savings do not justify deploying a new native format without a version/integrity/migration design.

Raw simulation timing is separately recorded per row in `representation.json`/`templates.json`, and is the original `step()` including normal digest checkpoints. No simulation algorithm was optimized or changed. Candidate code encodes the same native state after stepping; a separate simulated engine was not introduced.

## Existing-format worker reference — milliseconds

| Fixture | Operation | Main-owned baseline total | Worker-owned total | Worker prepare | Worker IDB read | Worker IDB commit |
| --- | --- | --- | --- | --- | --- | --- |
| one-short | advance #1 | 78.5 | 66.7 | 55.7 | 2.6 | 5.9 |
| one-short | advance #2 | 76.2 | 82.1 | 67.3 | 2.7 | 9.7 |
| one-short | coldReconstruction | 368.5 | 370.1 | not isolated | not isolated | not isolated |
| four-circuit | advance #1 | 142.4 | 120.7 | 108.7 | 3.5 | 6.1 |
| four-circuit | advance #2 | 177.2 | 200.4 | 176.5 | 2.7 | 18.6 |
| four-circuit | coldReconstruction | 519.8 | 493.4 | not isolated | not isolated | not isolated |
| eight-oval | advance #1 | 197.6 | 263.5 | 236.4 | 2.7 | 21.0 |
| eight-oval | advance #2 | 446.4 | 461.8 | 441.4 | 3.1 | 15.1 |
| eight-oval | coldReconstruction | 717.6 | 763.4 | not isolated | not isolated | not isolated |
| eight-long | advance #1 | 307.2 | 289.9 | 265.4 | 3.6 | 15.8 |
| eight-long | advance #2 | 538.2 | 511.0 | 483.1 | 3.4 | 21.1 |
| eight-long | coldReconstruction | 861.0 | 793.8 | not isolated | not isolated | not isolated |
| late-long | advance #1 | 4,556.6 | 4,230.6 | 4,172.9 | 13.7 | 40.3 |
| late-long | advance #2 | 4,310.6 | 4,682.3 | 4,595.3 | 15.8 | 64.8 |
| late-long | coldReconstruction | 3,242.9 | 3,301.9 | not isolated | not isolated | not isolated |
| dense | advance #1 | 231.8 | 232.2 | 215.8 | 3.0 | 10.7 |
| dense | advance #2 | 269.0 | 256.6 | 237.5 | 3.4 | 12.9 |
| dense | coldReconstruction | 538.8 | 554.8 | not isolated | not isolated | not isolated |
| retained | official | 15,185.8 | 14,303.8 | 13,610.0 | 185.0 | 501.7 |
| retained | coldReconstruction | 22,026.7 | 22,580.9 | not isolated | not isolated | not isolated |
| retained | backup | 21,700.6 | 21,916.8 | not isolated | not isolated | not isolated |

Request messages are approximately 100 bytes for advance rather than 0.5–4.4 MB full-snapshot messages in active cases, or approximately 30.3 MB in the retained fixture. This removes main-thread data copies, not database reads or native validation. The complete logical records remain byte-identical in every paired case.

The reference's inspection response deliberately contains phase/tick rather than the complete current UI DTO. This is not a completed UI integration. Candidate backup timing generates/validates a complete backup but returns only a byte count; that row must not be called a fully equivalent download timing. The separate memory run transfers and restores actual complete backup text on both paths.

Main-thread Long Tasks were observed and associated with measured operation windows. Retained official publication had an observed 195 ms task in the baseline and no observed >=50 ms task in the reference. Absence of an observed task does not prove an exhaustive <50 ms bound. Full-record readback/JSON comparison is a test oracle outside the measured operation windows; whole-harness maxima include that work and must not be attributed to ordinary gameplay.

## Explicit late Long Combat Rally — last two 100-tick durable advances

| Isolated variant | Paired baseline ms | Candidate ms | Exact logical bytes |
| --- | --- | --- | --- |
| worker reference | 5,079.7 / 5,736.2 | 4,820.3 / 5,354.8 | True |
| two-entry codec | 5,504.3 / 5,122.2 | 4,924.5 / 5,017.9 | True |
| exact controller memo | 4,994.3 / 5,218.6 | 5,799.0 / 5,124.9 | True |

Late durable advances remain multiple seconds; the 500 ms aspirational target is not met. A second exact-byte compression entry shows no consistent benefit attributable to the extra cache. It passes wire/corruption/eviction tests but adds retained memory; retain the accepted production cache.

## Retained-history index

The unchanged-byte generation-change fixture performs all twelve decoders on first load: baseline about 20.6 s, indexed about 20.5 s. For subsequent generation changes with the exact same logical records, full baseline revalidation is about 20.1–20.4 s; the private index is about 26–32 ms and reuses all twelve validated record bindings. Reset returns to all twelve decoders and about 20 s. This is a conservative metadata/head-change fixture, not a claim that ordinary already-warm operations always revalidate all records today.

The **actual isolated final-publication** fixture changes the career and one session. Full baseline reconstruction: 20,098.7 ms. Indexed reconstruction: 4,946.5 ms, with one decoder and eleven exact-byte/binding reuses. Reset performs all twelve decoders again (20,475.4 ms). Career/protected-history validation is retained when the career bytes change; this is not a persisted validation stamp or faster first-open cold recovery.

## Repeated full controller-state validation — strongest bounded result

Source `controller.js:79–91` reconstructs the complete receipt lineage on validation. The private exact-state experiment avoids duplicate work only after the same complete data graph has passed that original validator; each distinct state still takes the full path. Keys include all fields, revisions, descriptors and alias topology, not just a caller digest. Changed/unsupported graphs and cold unique states are not trusted.

| Retained operation | Baseline ms | Exact-state worker memo ms |
| --- | --- | --- |
| coldSeed | 22,047.4 | 18,394.0 |
| nativePrepare | 23,961.6 | 21,436.8 |
| official | 15,258.3 | 6,600.0 |
| coldReconstruction | 21,968.8 | 20,481.6 |
| backup | 21,883.7 | 18,496.8 |

Official publication falls from about 15.3 to 6.6 seconds in this paired observation, while every logical record remains exact. It remains above a subsecond target. Late advancing does not materially improve because native session work still dominates. The byte-golden two-entry codec experiment and this domain-validation memo are distinct experiments; do not attribute one result to the other.

## Disposition

Recommend a bounded production-integration proposal for private exact-state validation reuse under unchanged formats, with full regression and memory gates. Worker ownership is useful for responsiveness; the private session index is useful for appropriate warm reconstruction misses. Neither is a demonstrated cure for all late-race latency. Reject positional pages; do not integrate the larger codec cache. Keep native-template transport and physical raw-record factoring behind explicit format/storage authorization.

## Separate transport-only measurement

Five paired structured-clone echo samples per real logical-record payload isolate synchronous main-thread outbound copy, worker response copy, and round-trip wall time. No domain validation, storage or durable acknowledgment occurs in this microbenchmark. RTT includes startup/scheduling and must not be summed as a pure copying cost. Cases are generated from the same source factory; exact payload sizes differ from the integrated actor harness because the domain session creation path is separate.

| Fixture | Payload | Bytes | Median main send ms | Median worker response send ms | Median RTT ms |
| --- | --- | --- | --- | --- | --- |
| one | full | 522977 | 0.20 | 1.20 | 3.40 |
| one | reference | 93 | 0.10 | 0.00 | 0.20 |
| four | full | 694104 | 0.40 | 2.00 | 4.50 |
| four | reference | 93 | 0.00 | 0.00 | 0.20 |
| eight-oval | full | 826281 | 0.30 | 2.00 | 4.60 |
| eight-oval | reference | 93 | 0.00 | 0.00 | 0.10 |
| eight-long | full | 1316427 | 0.30 | 0.60 | 1.80 |
| eight-long | reference | 93 | 0.00 | 0.00 | 0.10 |
| late | full | 4295207 | 1.80 | 11.30 | 25.60 |
| late | reference | 93 | 0.00 | 0.00 | 0.20 |
| retained | full | 30215567 | 19.90 | 20.80 | 64.40 |
| retained | reference | 93 | 0.00 | 0.00 | 0.10 |

These component results explain the benefit of smaller messages but do not account for the several seconds of native/session preparation. Larger whole-harness tasks also include IndexedDB cloning and other work. No echo reply is authority.
