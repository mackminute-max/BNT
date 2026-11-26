# Persistence and performance

No persistence backend, per-record limit, financial history rule or durable acknowledgment guarantee was replaced. Native ordinary playback retains zero durable writes; completed results and consequential decisions use existing commits. Visual metadata remains bounded by live scope, and last Den results retain at most8named rows.

Eight completed native championships retain one current record; the largest seven-event/eight-entrant fixture retained 14665443 bytes while unresolved and compacted to 438388 bytes. Real IndexedDB, Worker, previous generation, complete backup and restore were executed. Backup size 29487819 bytes. Concurrent-load measurements: backup 14063.800000000745ms, restore 55794.799999999814ms, validation 12341.299999999814ms, longest main-thread task 1727ms, observed JS heap 186527640 bytes. These show a significant remaining responsiveness limitation, not a passing50/100ms target. No larger architecture redesign was undertaken.

Synthetic compact history at10/25/50/100/500 championships measures representation scaling, not actual completed gameplay or a browser quota guarantee. Real quota denial and chunk staging aborts preserve the previous durable root; no history was deleted to manufacture capacity.

## Controlled same-fixture comparison

| Fixture | Baseline100ticks median ms | P1median ms | Checkpoint bytes | Cold restore ms |
|---|---:|---:|---:|---:|
| one-short | 5.584 | 5.672 | 25256 | 11.327 |
| four-circuit | 14.510 | 15.837 | 115014 | 68.876 |
| eight-oval | 24.474 | 26.743 | 195046 | 73.257 |
| eight-long-rally | 27.250 | 25.531 | 241182 | 65.802 |
| late-long-rally | 112.361 | 115.761 | 3806083 | 712.479 |

Raw native checksums and checkpoint/restart equality match the accepted baseline in every input-free fixture. Warmup is excluded; these measurements are separate from concurrent verification diagnostics. They do not measure durable-advance latency because ordinary racing does not use interval commits.
