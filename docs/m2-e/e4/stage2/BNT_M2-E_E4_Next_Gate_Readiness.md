# BNT M2-E4 — Stage 2 Next-Gate Readiness

**Verdict: CONDITIONAL PASS. Owner acceptance is not claimed. E5 remains unauthorized.**

Runtime: `a07c3d2ef3a97d47f349440e0533706d24f4a50f`, local branch `feat/m2-e-e4-persistence-recovery`. No merge, push, deployment or release was performed.

| Gate | Result | Evidence and qualification |
|---|---|---|
| C — Gameplay and automatic checkpoints | PASS | Normal UI migration, generation-bound starts/inputs, automatic simulation-tick scheduling, pause/speed/Signs, worker restart, full browser close/reopen and exact replay; early clearance and inspected pending birth regressions fixed and tested |
| D — Recovery | PASS | Durable native prepare and official publication remain distinct; original publication fault suite, lost-ack retry, exact repair, missing/corrupt evidence rejection, stale generations and controller recovery paths tested |
| E — Complete backup/restore | PASS | Confirmed staged import and atomic activation, protected-history/ownership checks, current/previous generation, interruption before/after activation, quota fault, duplicate import, cold destination and large completed-but-unsettled restore tested |
| F — Capacity and responsiveness | CONDITIONAL PASS | Eight registered entrants ×12 live native events reached pending settlement; all 12 sessions retained. Long eight-entrant Combat Rally retained 46 advances/checkpoints within the 8 MiB domain-record bound. Large-data latency and the 100 ms target remain unsatisfactory; see measurements below |
| G — Regression and standalone | CONDITIONAL PASS | Frozen-source Node 518/518; historical/payroll references unchanged; versioned Node/Chromium clock parity; new browser workflows and original Stage 1 proofs passed. Known legacy runner exits remain nonzero, and new Windows file testing is outstanding |

## Functional acceptance evidence

The final source passed its complete configured Node suite, six focused E4 tests, nine durable browser workflow groups, three visible file-UI groups, two browser restart/replay groups, four migration/concurrency/quota groups and seven original Stage 1 architecture groups. The final large retained fixture was published, backed up, restored and replayed on this source. The original 12 historical replays and both payroll-context references remain unchanged.

The live twelve-event and Long Rally runs began on earlier Stage 2 candidates before the final UI/recovery corrections. They are not represented as additional from-scratch runs on the final SHA. Final-source verification separately covers the complete retained twelve-event set, final-event publication, full backup/restoration and all twelve native replays. The final ordinary UI/restart tests cover the corrected creation and recovery path. Raw capacity-process exits were not retained across the interrupted tool session; complete structured results and subsequent evidence-validation assertions are retained instead.

## Remaining performance limitations

The clean one-entrant checkpoint sample took 432.5 ms worker preparation, 16.4 ms durable commit and 462.1 ms total acknowledgment. No main-thread task at least 50 ms was observed in that small sample. This does not establish maximum-field responsiveness.

Under concurrent verification load, the twelve-event workload took approximately 38.2 minutes across its event operations; the Long Combat Rally took approximately 47.7 minutes with 46 checkpoint batches. Long-Rally advance acknowledgment median was 56.26 seconds and maximum 183.47 seconds. About 2,779 seconds of its 2,796 seconds of advance acknowledgment time were reported worker preparation. Moving work off the main thread has not solved this processing cost.

Observed main-thread task maxima were 2.417 seconds in the four-entrant fixture, 1.518 seconds in the twelve-event fixture and 1.392 seconds in the Long Rally. These exceed the preferred 100 ms target. They are measurements under concurrent load, not controlled speedup estimates or guarantees. Busy/progress UI remains accurate, and commits remain authoritative, but large-race playback is slow.

Next optimization should measure and reduce repeated worker reconstruction/canonical hashing/native validation using exact immutable intermediates and bounded caches. Whole-generation main-thread transfer/read-set work also needs profiling. Do not remove validation, journals or protected history. A larger architecture change still requires owner review.

## Capacity and recovery limits

- Final twelve-event encoded career envelope: 2,247,239 bytes.
- Thirteen logical career/session values: 29,967,534 bytes; complete current/previous backup: 60,538,346 bytes.
- Observed IndexedDB use for that live fixture: 60,026,880 bytes. This is one tested Chromium origin, not a browser-wide guaranteed capacity.
- Largest live twelve-event record: 4,886,550 bytes. Largest Long Rally record: 7,025,307 bytes, below 8,388,608.
- Separate final-source retained/restore diagnostic: 60,528,192-byte backup; both databases plus restore stages together used 210,575,360 bytes.
- A real cold-origin 4 MiB quota test rejected a native checkpoint with current and previous authority unchanged, then accepted the same input after capacity was restored.
- Application logical bounds are unchanged. Browser estimates are advisory; storage may be denied or evicted. Complete external backups remain necessary.

## Determinism qualification

The Long Rally exposes an inherited cross-runtime discrepancy: Node `3cc91b8c`; accepted Stage 1 HTML, current uninterrupted Chromium and checkpointed Chromium all `aebb513e`, at tick 4527 with 5962 events. This is not an E4 checkpoint regression. The original Node reference is preserved. A separate, scoped cross-runtime numeric investigation is recommended; it was not repaired by changing physics or rounding here. No universal cross-browser resume guarantee is claimed.

## Required owner review and next authorization

1. Test the new HTML directly on Windows using [WINDOWS_ACCEPTANCE.md](WINDOWS_ACCEPTANCE.md), including migration, close/reopen, Signs, complete backup/restore and terminal lock.
2. Review the measured large-workload delays and approve either conditional E4 acceptance or a bounded E4 performance follow-up. The 100 ms preference is not met for large data.
3. Review the inherited cross-runtime limitation separately; incompatible evidence must continue to reject safely.

After E4 acceptance, E5 would require a separately authorized trusted championship completion producer, exactly-once permanent entitlements, final settlement integration and interruption tests. E6 content and presentation remain separate. Neither is implemented or authorized by this report.
