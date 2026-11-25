# Delivery 2 persistence and performance

Candidate: `Blood-and-Thunder-M5-D2-Playable.html` — **5,529,570 bytes**, SHA-256 `b1feae08d6af7ade30d2502d6c6a5daf12ac79a0172cdf59d220586a6c3fa30f`.

Branch `feat/e5-d-m1-startup-slots-options`, repository HEAD `6f01da6d9cc0a79fecf9d38cd55989e17fb2651c`. The accepted D1 source was an uncommitted candidate, verified against all 113 supplied manifest entries before editing. No implementation commit exists; the source manifest identifies this delivery. No commit, merge, push, release or deployment performed. Existing M4 and D1 HTML hashes remain unchanged. Owner Windows acceptance is pending.

## Preserved authority

Schema7 current checkpoint plus at most128 command tail, protected immutable history pages, reference-only IDB roots, independent monotonic clock, exact read-set/generation CAS, strict awaited IDB commit, current/previous retention and explicit confirmed recovery remain. Native prepare precedes official career publication. Candidate Worker completion is never a durable acknowledgement. An unfinished P1 race remains in memory and restarts from the original frozen boundary after reload; no ordinary tick/Sign checkpoint writes were introduced.

Limits unchanged:8MiB/logical record,256MiB/complete backup,2001 root references,2000 restore receipts,2MiB pre-registration current-state guard. Financial and journal/history validation remain; no authoritative data is truncated to meet timings. GC retains all current/previous/quarantine references. Its scan now uses keys rather than cloning every immutable body just to inspect reachability.

## Targeted optimization

`verified-bytes.js` retains at most16MiB UTF-16 exact history text/128 entries. Cache hits compare the complete exact text, not a caller digest. Every body is still read from IDB and checked; a changed/missing body fails even after warm validation. Current/session text is not retained in this cache. Prefix admission keeps useful old immutable history when the full history exceeds the bound; it does not thrash through all pages on every sequential scan.

`record-transport.js` implements an ephemeral versioned lossless Worker transport. Each direction retains at most32MiB exact immutable-history text/256 entries; both endpoints independently reconstruct complete record arrays. Current/session bodies always travel in full. References can resolve only bytes previously received in that private transport lifetime; missing refs reject. Domain cold/warm validation, generation/read-set checks and durable commit still execute on the decoded arrays. References are not hashes, save tokens or authority. Worker restart/close drops these caches; untrusted cold loads still validate every required record. Worst configured transport retention is128MiB across both directions/endpoints, plus16MiB hash text; actual heap can include additional engine overhead. No unbounded lifetime graph cache.

No storage format replacement, silent migration, new backend or record-limit increase. Unchanged body rereads are deliberately retained because skipping them would require a separately proven integrity witness to preserve warm corruption detection. Manifest canonical serialization/hashing, current-envelope validation and full cold history scans remain residual costs.

## Measured representation/capacity

| Synthetic championships | Logical bytes | D1 backend warm commit ms | D2 backend warm commit ms | D2 cold worker ms | D2 warm validation ms | Longest main-thread task ms |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | 2,445,996 | 242.9 | 162.3 | 566.4 | 115.3 | 193 |
| 25 | 5,328,465 | 471.8 | 307.2 | 726.7 | 282.4 | 213 |
| 50 | 10,132,785 | 729.6 | 595.5 | 1082.8 | 598.1 | 445 |
| 100 | 19,741,145 | 1525.2 | 1550.8 | 2119.8 | 1314.9 | 1184 |
| 500 | 96,908,713 | 9123.9 | 7129.5 | 8971.9 | 5928.4 | 5709 |


| Synthetic championships | Full message bytes | Warm reference message bytes | Retained transport bytes |
| --- | --- | --- | --- |
| 10 | 2731876 | 600183 | 3833336 |
| 25 | 5938369 | 707848 | 9409472 |
| 50 | 11282803 | 690050 | 19053652 |
| 100 | 21971280 | 3433662 | 33408364 |
| 500 | 107780117 | 89553313 | 33359496 |


Synthetic fixtures10/25/50/100/500 contain validated history generated from actual archived native facts, with explicit synthetic additional rows. The500 fixture has5000 race summaries,50000 operations and100000 historical candidate facts; it is **not**500 executed championships or100000 actual recruits. All record/body/index/backup limits remain. Separate capacity-COUNT JSONs include reconstruction times, sizes, memory and32/128 generation boundaries.

D1's historical reference:92.4MB logical,102.9MB backup,5.385s longest main-thread task,8.97s subsequent commit,8.67s cold validation,23.31s backup,42.76s restore,~573MB observed heap. Do not directly compare those historical concurrent-load numbers with a new controlled run. `capacity-compare.json` compares identical candidate fixture bytes using accepted D1 and candidate storage backends, then exercises current D2 Worker validation/backup/restore. Backend-only comparison does not imply the old D1 domain can read new D2 careers.


Candidate-only500 fixture phase blocking (whole long tasks overlapping each phase):

| Phase | Longest main-thread task ms |
| --- | --- |
| first-commit | 4631 |
| read | 3112 |
| warm-commit | 3112 |
| cold-worker-validation | 3006 |
| warm-validation | 3179 |
| backup | 2766 |
| restore | 3746 |

Observed after-restore main-page heap: 499912740 bytes. This is an endpoint sample, not peak or independent Worker heap. Peak/Worker allocation was not established.

Full same-state metadata transactions through the real coordinator (synthetic500 history; not an official race publication):

| Attempt | Backend snapshot ms | Worker preparation ms | Worker message wall ms | Awaited commit/ack/GC ms | Total durable acknowledgment ms |
| --- | --- | --- | --- | --- | --- |
| 1 | 3929.2 | 2512.4 | 2764.3 | 8188.3 | 14885.8 |
| 2 | 4488.2 | 1918.7 | 2133.5 | 7887.7 | 14512.1 |

Message wall minus Worker elapsed is approximately observed cloning/transport/scheduling overhead; it is not a separate durable operation. Preparations and successful message transfers remain non-durable until IDB commit completes.


At500 equivalent championships, identical-byte backend warm commit was9123.9ms on accepted D1 versus7129.5ms on D2 (about21.9% lower). The100-case sample was1550.8ms versus1525.2ms, so improvement is not uniform; these are controlled single samples, not statistical confidence intervals. Comparison-table longest tasks include both backends and fixture parsing; the candidate-only phase table separates the current implementation. The large fixture backup/restore succeeded; backup107,917,336 bytes, logical96,908,713 bytes in474 records. Chrome reported physical usage much smaller because these synthetic records repeat heavily; do not extrapolate that compression to real races.

## Native gameplay and responsiveness

Eight consecutive native championships and an eight-entrant seven-event native schedule are measured separately. Actual generated five-tier native schedules and browser UI logs report full publication/settlement behavior, not synthetic archive counts. Native-domain timing under concurrent verification is a diagnostic, not controlled latency. `native-performance.json` compares identical old-rule seeds/setup against frozen D1 simulation; exact checksums must match. New affinity is excluded from that old-rule parity comparison.

Preferred<100ms main-thread tasks are **not presumed met**. Final machine-readable comparison includes total latency, main-thread long tasks, worker cold/warm validation, commit, backup/restore, physical quota estimates and heap. IDB reports are observations, not guaranteed permanent/unlimited browser storage. If an expected report is absent or incomplete, the corresponding acceptance requirement remains conditional/unverified, never passed.

## Failure handling

Native IDB tests cover atomic abort, generation conflict, exact read set, prior-generation retention, confirmed monotonic recovery, missing current root, chunked restore corruption and GC reachability. Worker fault tests cover lost acknowledgement, once-only purchase/publication, corrupt/foreign backup, repair, stale retry, interrupted creation/restore and native official publication. Real quota testing uses a reproducible Chromium Storage quota override and reports `QuotaExceededError` with no durable acknowledgement/partial birth. This does not establish universal browser quotas. See raw exits for actual outcomes.

## Remaining limits

The preferred100ms target is missed at large history. Full metadata acknowledgment remains about14.5–14.9s at500, despite bounded optimizations. Backup/restore takes tens of seconds and individual main-thread tasks take seconds. Do not treat this as unrestricted production responsiveness. Further movement of hashing/read preparation off the UI thread or a stronger private incremental index would require a separately reviewed coordination proof; no such architecture change or authority weakening was implemented.

No12-event native schedule is approved here; largest native economic schedule is seven. The synthetic500 horizon does not guarantee arbitrary future growth or500 full browser championships. Large JSON/backup paths may block beyond target. Statistical generalization and Windows direct-file acceptance remain separate gates. No architectural authority or integrity requirement was relaxed to improve a score.
