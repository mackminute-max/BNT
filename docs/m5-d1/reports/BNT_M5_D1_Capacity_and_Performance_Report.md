# M5 Delivery 1 — Capacity and performance

## Verdict and method

**CONDITIONAL.** Current-state correctness/retention can be demonstrated at the synthetic target horizon; large-history responsiveness is not certified to the preferred 100 ms main-thread target. This is not evidence of 500 played championships or unlimited persistence.

Fixed fixtures/scripts are retained under `scripts/m5-d1/`. Final command ledger uses sequential jobs; earlier concurrent-load logs are preserved separately. Linux/Chromium/Node timings are environment-specific. No mechanic, numerical precision or protected record was changed to improve a timing.

## Native M4 comparison

Same native setups/seeds run from frozen accepted M4 source and current source. Raw simulation, not durable E4 timings. Final benchmark concurrent-load flag: `False`. All four exact captures/digests match.

| Workload | M4 first 100 ticks ms | M5 first 100 ticks ms | Final tick | Checksums |
|---|---:|---:|---:|---|
| short-one | 11.27 | 11.35 | 601 | `c06381e1` / `c06381e1` |
| circuit-four | 14.87 | 15.47 | 1476 | `2cd928c1` / `2cd928c1` |
| oval-eight | 27.49 | 29.23 | 925 | `c0660c7c` / `c0660c7c` |
| long-rally-eight | 31.29 | 30.93 | 4335 | `7a46a247` / `7a46a247` |

See `native-performance.json` for creation, remaining-race duration, event counts and heap samples. Long Combat Rally uses eight actual entrants and runs to native clearance. These are small single-pair engineering measurements, not statistical speedup claims; no simulation implementation changed. P1 buffering/in-memory advancement remains intact and has zero ordinary durable writes.

## Executed native horizon

Eight consecutive two-event native championships, 16 actual races, real contract renewal, earned LP/Recruiters and cold archive reconstruction. Separate actual eight-entrant seven-event permanent competition covers Pure/Combat Oval/Circuit/Rally, largest logical native record **4,230,404 bytes**, archived current **420,862 bytes**. Earlier concurrent publication preparation/Map acknowledgment ~0.97–2.46 s in that full-field fixture; not a browser main-thread measurement. Regular packaged browser proof completes two events through actual durable IDB, not just isolated scoring helpers.

Current permanent catalog maximum is seven events. No real 12-event D1 competition is available; none was invented because generated definitions are Delivery 2. The 12-event active workload remains **unverified/not supported by current catalog**, not passed by substituting a smaller count.

## Synthetic long-career representation

Production current/history validators, page builder and real backend exercised with a fixture cloned from real completed native results, explicitly marked synthetic:

| Quantity | Measured |
|---|---:|
| Championship summaries | 500 |
| Race summaries | 5000 |
| Synthetic operations | 50000 |
| Synthetic historical candidate facts | 100000 |
| Protected pages | 473 |
| Logical records | 474 |
| Current/largest record bytes | 1,211,350 |
| Total logical record bytes | 92,410,303 |
| Complete deduplicated backup bytes | 102,901,448 |

No 50,000-command native economic replay is claimed. These neutral synthetic operations exercise page order/conservation and retained-state size; 500/5,000 synthetic summaries test protected archive/index storage, not results of 5,000 native races. **A separate actual factory run generated 100,004 identities** across all canonical paths; do not conflate that with the historical fixture.

## Actual browser retention, backup/restore and latency

Production IndexedDB coordinator, inline worker, cold validation, complete backup, complete restore and reachability GC result: `True`. Full current and previous roots retained; identical history bodies deduplicated. This synthetic test's second generation deliberately shares all unchanged records; separate IDB/fault tests exercise changed/current/previous recovery.

| Operation | Milliseconds |
|---|---:|
| fetchAndParseMs | 954.60 |
| firstCommitMs | 5,576.60 |
| secondCommitMs | 8,970.10 |
| fullWorkerColdValidationMs | 8,674.30 |
| completeBackupMs | 23,310.00 |
| completeRestoreMs | 42,758.60 |
| gcMs | 105.20 |

Longest observed uninterrupted main-thread task: **5,385 ms**. This misses the preferred 100 ms goal. Main causes are the remaining exact read-set expansion/hash/serialization and large-container staging preparation; worker domain preparation does not make those main-thread operations asynchronous. Cold validation and backup still read all protected history. Warm worker reuse is private/exact-byte/revision bound; no untrusted token is accepted. The change removes lifetime genesis replay and duplicate immutable bodies, not every full read/transfer cost. Further reference-message/chunk-processing optimization is a documented next concern, not a hidden correctness shortcut.

Logical immutable body bytes enumerated from actual IDB: `92410303`. This is **not physical disk occupancy**. `navigator.storage.estimate()` reported usage `3526656` and quota `10740944896` bytes. Synthetic repeated strings compress strongly in Chromium; that usage is not a reliable prediction for diverse real careers, nor a promise of persistent quota. Actual quotas differ by browser/context.

## Memory

Node stress-construction RSS sample before `63401984`, after `611733504` bytes; constructing the complete synthetic fixture itself retains rows/graphs and is not normal per-tick memory. Browser memory samples: `[{'phase': 'fixture', 'used': 201211503, 'total': 204847615}, {'phase': 'restored', 'used': 573393575, 'total': 584539011}]`. Values are highest-observed samples only, not exact peaks; isolated worker heap was not reliably measured. Backup/restore temporarily duplicates large strings/graphs and remains a substantial memory risk. No unbounded persistent generation cache was introduced; actual volume generation drops each previous batch.

## Capacity and safe failure policy

8 MiB logical record and 256 MiB complete backup bounds retained. Pre-registration current≤2 MiB reserves six MiB for active current-state growth; source snapshot/fees unchanged on denial. No unsupported 12-event guarantee. Root refs bounded to 2,001; current/previous plus one recovery quarantine determine body reachability. Completed session retirement requires native final settlement and completed reward selection; unpaid obligations stay live. Interrupted GC is atomic and only removes unreachable bodies.

The first large restore exposed a browser single structured-value ceiling (~133 MB serialized) even below the 256 MiB application container bound. Fixed with ≤1 Mi-character temporary restore chunks plus a full-text hash and one atomic staging transaction. This is lossless staging, not an increased logical-record limit, history deletion or partially authoritative restore. Missing chunk and real quota tests preserve the current generation and reject acknowledgment.

A real clean-origin 1 MiB CDP quota allowed native M5 birth and then produced actual `QuotaExceededError` for a pressure write and chunked restore, retaining exact current/previous authority with no partial stage. It is a reproducible test budget, not a production quota recommendation. 32 fixed rivals succeed; 128 safely exhaust names. Default four is verified. No generic fallback or catalog expansion was used.

## Practical disposition

Small/new careers and the observed native repeated horizon are playable candidates. The synthetic 500-history target is **retained/reconstructable**, but large-career responsiveness is **not** accepted to the target and memory remains high. Windows offline owner verification is still required. Do not promise indefinite growth, maximum-field 12-event support or acceptable latency on all hardware. Review these limitations before Delivery 2 or a further persistence performance scope.
