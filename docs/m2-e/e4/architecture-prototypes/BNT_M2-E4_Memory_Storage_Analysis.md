# BNT M2-E4 — Memory and Storage Analysis

## Measurement boundaries

Main and dedicated-worker isolates are measured separately with CDP `Runtime.getHeapUsage`, attempting samples every 100 ms during operations. Reported isolate peaks are **sampled lower bounds**, not exact instantaneous maxima. DevTools sampling and forced GC alter timing and possibly retention; do not use these runs as controlled latency comparisons.

OS renderer `VmHWM` is separately retained per PID: it covers the renderer process lifetime, combines main/worker/native allocations and cannot be attributed to one isolate or one individual operation. RSS, V8 heap, backing stores and logical encoded bytes are different measures and must not be added or substituted carelessly. Only Linux Chromium was available; no Windows/Edge/low-memory hardware peak is established.

## Sampled peaks — MiB

| Variant | Workload | Side | Operation | Main isolate | Worker isolate |
| --- | --- | --- | --- | --- | --- |
| existing-format actor | late-long | baseline | birth | 9.3 | 42.9 |
| existing-format actor | late-long | baseline | lateAdvance | 20.6 | 263.0 |
| existing-format actor | late-long | baseline | repeated | 15.6 | 277.4 |
| existing-format actor | late-long | baseline | backup | 20.0 | 151.5 |
| existing-format actor | late-long | baseline | restore | 23.5 | 240.9 |
| existing-format actor | late-long | baseline | reset | 22.6 | 12.6 |
| existing-format actor | late-long | reference | birth | 4.2 | 41.2 |
| existing-format actor | late-long | reference | lateAdvance | 4.3 | 277.0 |
| existing-format actor | late-long | reference | repeated | 4.3 | 317.1 |
| existing-format actor | late-long | reference | backup | 9.8 | 212.1 |
| existing-format actor | late-long | reference | restore | 9.8 | 213.4 |
| existing-format actor | late-long | reference | reset | 9.8 | 103.9 |
| existing-format actor | retained | baseline | retainedPublication | 88.0 | 289.3 |
| existing-format actor | retained | baseline | backup | 172.2 | 317.4 |
| existing-format actor | retained | baseline | restore | 260.7 | 533.0 |
| existing-format actor | retained | baseline | reset | 260.8 | 47.1 |
| existing-format actor | retained | reference | retainedPublication | 59.4 | 281.7 |
| existing-format actor | retained | reference | backup | 117.1 | 315.9 |
| existing-format actor | retained | reference | restore | 117.1 | 631.6 |
| existing-format actor | retained | reference | reset | 117.1 | 220.3 |
| existing-format actor | events | baseline | event-1 | 16.6 | 45.5 |
| existing-format actor | events | baseline | event-2 | 17.7 | 42.9 |
| existing-format actor | events | baseline | event-3 | 22.2 | 56.3 |
| existing-format actor | events | baseline | backup | 12.5 | 41.8 |
| existing-format actor | events | baseline | restore | 21.7 | 55.9 |
| existing-format actor | events | baseline | reset | 21.7 | 18.6 |
| existing-format actor | events | reference | event-1 | 4.1 | 42.8 |
| existing-format actor | events | reference | event-2 | 4.1 | 50.0 |
| existing-format actor | events | reference | event-3 | 4.1 | 51.1 |
| existing-format actor | events | reference | backup | 6.3 | 51.0 |
| existing-format actor | events | reference | restore | 6.4 | 54.7 |
| existing-format actor | events | reference | reset | 6.4 | 11.9 |
| actor + exact-state memo | retained | baseline | retainedPublication | 88.1 | 234.1 |
| actor + exact-state memo | retained | baseline | backup | 174.3 | 342.7 |
| actor + exact-state memo | retained | baseline | restore | 231.4 | 596.7 |
| actor + exact-state memo | retained | baseline | reset | 203.5 | 429.6 |
| actor + exact-state memo | retained | reference | retainedPublication | 59.4 | 261.5 |
| actor + exact-state memo | retained | reference | backup | 117.1 | 338.9 |
| actor + exact-state memo | retained | reference | restore | 117.1 | 432.5 |
| actor + exact-state memo | retained | reference | reset | 117.1 | 74.1 |
| actor + two-entry codec | late-long | baseline | birth | 9.3 | 42.4 |
| actor + two-entry codec | late-long | baseline | lateAdvance | 13.8 | 290.3 |
| actor + two-entry codec | late-long | baseline | repeated | 45.0 | 345.5 |
| actor + two-entry codec | late-long | baseline | backup | 23.9 | 326.1 |
| actor + two-entry codec | late-long | baseline | restore | 44.7 | 402.8 |
| actor + two-entry codec | late-long | baseline | reset | 44.7 | 110.7 |
| actor + two-entry codec | late-long | reference | birth | 4.6 | 37.3 |
| actor + two-entry codec | late-long | reference | lateAdvance | 4.6 | 296.0 |
| actor + two-entry codec | late-long | reference | repeated | 4.6 | 363.5 |
| actor + two-entry codec | late-long | reference | backup | 11.7 | 242.1 |
| actor + two-entry codec | late-long | reference | restore | 11.8 | 344.3 |
| actor + two-entry codec | late-long | reference | reset | 11.8 | 173.1 |

Worker ownership consistently lowers the main-isolate burden in these fixtures, but can move pressure into the worker. In the original paired retained restore, sampled main falls about 260.7→117.1 MiB while worker rises about 533.0→631.6 MiB. In the separate exact-state-memo pair, retained restore samples are about 231.4/596.7 MiB baseline main/worker versus 117.1/432.5 MiB candidate. These are separate inspector runs; do not claim a statistically proven renderer-RAM reduction.

Large renderer process lifetime high-water marks remain around 1.6–1.8 GiB in the retained runs. Full-text backups/restores still duplicate substantial representations transiently. This is a material production acceptance risk; moving work off-thread is not a total-memory solution.

## Retention, eviction and repeated events

After service reset, release of harness-owned fixture/backup strings and explicit GC, retained-workload main heaps settle near 2 MiB and workers near 9–12 MiB. Operation `reset` *peak* rows above are not the post-GC retained heaps. The evidence contains both, avoiding a false leak claim based on a temporary high sample.

Three consecutive real one-entrant championship events use Oval/Circuit/Rally and the original native engine, publication and condition carryover. Worker peaks remain in roughly the 43–56 MiB range rather than retaining one complete decoded native history per event. This is limited evidence, not an indefinite-career leak proof.

The two-entry codec stress pair retains approximately 25.6 MiB worker heap after GC versus 14.1 MiB baseline and does not establish a reliable latency benefit. Do not integrate it. Both entries share a 32 MiB decoded-text accounting budget; accounting is not a total-JS-heap bound.

The private history index has twelve metadata/raw-string bindings and **zero decoded native-history graphs**. In the Node explicit-GC diagnostic, heap after cold validation is about 55.2 MB, after warm reuse about 55.2 MB and after index reset about 52.1 MB; harness-owned raw fixture strings and the original codec's bounded cache remain. RSS stays high after allocations and is not proof of live retained objects.

The template dictionary cache has about 12.86 MB accounted raw key text in the late fixture; eviction reduces sampled Node heap from about 78.45 to 69.02 MB while stored compressed chunks remain about 1.85 MB. Decode after eviction is exact; verified rebuilding is tested. The rebuild heap sample also holds a separately reconstructed proof state, so it is not an isolated cache delta.

Experimental data stores/dictionaries are bounded and fail explicitly at capacity. No source journal, receipt, protected identity or authoritative save is evicted. These research budgets are not new game policy or increases to approved logical limits. Memory-safe production keys should avoid holding unused transient graph objects through long validator calls; that improvement is proposed, not claimed as measured here.

## Lossless raw-record factoring across actual current/previous heads

| Fixture | Heads | Existing body-array bytes | Factored body bytes | Saving | Unique bodies |
| --- | --- | --- | --- | --- | --- |
| one-short | 2 | 1035998 | 562874 | 45.7% | 3 |
| four-circuit | 2 | 1342125 | 796587 | 40.6% | 3 |
| eight-oval | 2 | 1502462 | 1000944 | 33.4% | 3 |
| eight-long | 2 | 2190625 | 1450827 | 33.8% | 3 |
| late-long | 2 | 6788592 | 6048794 | 10.9% | 3 |
| dense | 2 | 1466265 | 920727 | 37.2% | 3 |
| retained | 2 | 60527476 | 32810633 | 45.8% | 14 |

The retained fixture reduces the record-body portion from 60,527,476 to 32,810,633 bytes (about 45.8%), preserving fourteen unique strings and both heads' ordered references exactly. This is not an implemented IndexedDB backend or a complete new backup container. Generation/runtime/witness/restore metadata must also be retained by any future design.

A separate identical-head fixture shows an approximately 50% upper bound on body reuse. It is explicitly not a simulated changed generation. Do not use it as the ordinary twelve-event saving.

Current per-record/checkpoint 8 MiB, decoded graph 32 MiB/200,000 nodes, journal 1,000, receipt 1,000, protected-identity 2,000 and complete-backup 256 MiB limits remain unchanged. No evidence is dropped and no limit is increased to obtain these figures.

Browser quota estimates in supplemental worker comparisons cover the **combined origin**, including both throwaway baseline/candidate databases. They are not per-database physical measurements, available-capacity guarantees or portable Windows quotas. Actual stored logical bytes and experimental factoring bytes are reported separately. The prototype does not establish unlimited storage or maximum-field twelve-Long-Rally capacity.

## Recommendation

Gate production integration on memory and direct-file tests as well as latency. Prefer bounded pure-data reuse over holding additional full decoded histories. Preserve the current format until physical factoring and writer-fencing/rollback are explicitly approved. Native-template archive size gains alone do not establish lower runtime peak memory.

The original backend also retains the activated migration stage's **full source record set** (`indexeddb.js:33–35`, `:70–82`), not only its summary in `snapshot()`. The two-head factoring table does not include that additional retained generation or all physical database overhead. A future physical representation must account for and preserve those roots too. Combined-origin storage estimates from the supplemental runs are retained in `rawArchive.storageEstimate`; they are intentionally not presented as a per-database saving proof.
