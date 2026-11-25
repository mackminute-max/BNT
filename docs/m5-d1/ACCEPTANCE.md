# Acceptance and deliverables

Run full historical 888-test inventory (map any intentionally replaced persistence tests to equivalent or stronger tests), all existing browser workflows, deterministic historical/payroll checksums, M4 rewards (21), upgrades (8), starting packages (5), native economy/roster/registration/settlement and offline regression. Record actual commands, raw exits, failures and fixes. Do not present isolated model checks as native acceptance.

Production fault matrix: atomic IDB abort/quota, worker failure before/after commit, stale tabs/read sets, lost acknowledgment, duplicate/obsolete command across rollover, corrupt/missing pages, interrupted checkpoint/GC/restore, current and previous root recovery, unrelated slots, incompatible import, export roundtrip, frozen active championship and seeded race restart. Verify no duplicate Gold/assets/wages/rewards/settlements; no loss of acknowledged facts absent destroyed storage; no premature GC. Test actual full 12-event active championship capacity where supported. Test withdrawal before start and after multiple races, normal completion, involuntary elimination, already paid obligations, insufficient funds under native liability rules, failed registration, unchanged batches on withdrawal, exact once renewal and Veteran Recruiters purchase/renewal/reload. No invented debt policy; escalate if native authority cannot settle obligations.

Generation: all 8/13/9 paths, valid native stats and AI, reserved identities, collision/retry failure, deterministic golden vectors, catalog pin mismatch, native acquisition and identity persistence, quality/valuation/contract parity, fixed rival recurrence/healthy reset, no RNG interference. Sample full races and economy across Pure/Combat oval/circuit/rally; provisional balance findings not automatic redesign. Integrated full competition balancing remains Delivery 2.

Capacity targets from M5-A: 500 championships, 5,000 races, 100,000 historical candidates, 50,000 transactions, 32–128 rival stress population; engineering workloads not gameplay limits. Distinguish actual native gameplay/generation calls from synthetic counters. Exercise actual production compaction/GC, repeated renewals, long-career native loop and recovery, current/previous reachable retention, physical/logical storage, record/backup size, cold load, commit/checkpoint latency, worker heap and main-thread tasks. Investigate >100ms main tasks; no ordinary playback writes. Report practical verified horizon and any untested targets, not indefinite capacity. Preserve last valid state on capacity denial. Compare same-seed native race performance to M4; reproducible standalone build twice, report size/hash and offline dependencies. Windows file:// acceptance is owner gate; Linux HTTP tests not substitute.

Deliver individually:
- Blood-and-Thunder-M5-D1-Playable.html (new standalone artifact, do not overwrite prior HTML).
- BNT_M5_D1_Implementation_Report.md (scope, source baseline, changes, owner policy mapping, deviations, blockers, exact test results).
- BNT_M5_D1_Persistence_Contract.md (schema, authority, retention, recovery, backup, version boundary, GC).
- BNT_M5_D1_Generation_Integration_Report.md (catalog pins, factories, native bindings, renewal, rival seams, balance findings).
- BNT_M5_D1_Validation_Matrix.csv and BNT_M5_D1_Changed_Files.csv.
- BNT_M5_D1_Capacity_and_Performance_Report.md plus raw machine-readable evidence and reproducible test commands.
- BNT_M5_D1_Local_Acceptance_Checklist.md (Windows offline new career, market purchase, complete championship, withdrawal, Legacy, reload/export/import/recovery, mid-race restart).
- BNT_M5_D1_Delivery2_Handoff.md (verified interfaces, remaining integration work, content dependencies, known limitations).

Freeze tested source/artifact/evidence; report PASS / conditional / BLOCKED for each gate. Do not claim owner acceptance. Stop after delivery; no Delivery 2 implementation, commits/merges/pushes/deployment. If correctness proof fails, fix within scope or stop/report; do not bypass validators or hide failure. Routine engineering decisions document; material gameplay changes require owner approval.
