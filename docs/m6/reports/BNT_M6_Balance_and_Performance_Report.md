# M6 balance, capacity and performance

## Controlled raw simulation

`scripts/m6/controlled-performance.mjs` compares exact baseline source archived from `41ed977f56be53f690adc53622688dcb12609e38` against current no-M6-context native races using identical setups. Five measured samples follow warm-up. Early100-tick medians were approximately6.0ms one entrant,16.5ms four Circuit,25.3ms eight Oval and26.8ms eight Long Rally. Late Long Rally tick2000–2100 measured103.7ms versus100.3ms baseline, exceeding the preferred100ms target. Exact native checksums match. Late checkpoint encode1247.6ms, hash322.2ms and cold restore843.5ms explain why ordinary M6 playback avoids durable interval reconstruction. Observed process RSS reached about516MB; this is process-level observation, not isolated browser Worker peak memory.

## Native and synthetic capacity

Eight sequential native championships use actual starting grants and ordinary services; the seven-event/eight-entrant fixture uses explicitly synthetic prior unlock/funding but actual native races, clearance and finalization. Neither is a500-championship gameplay claim. A separate legacy durable-every-200-tick diagnostic exceeded8 MiB at event6 and is retained as failure evidence; normal in-memory playback retains the authoritative prepared race only at boundaries.

Synthetic compact history10/25/50/100/500 championships reaches325,934bytes at500 (5,000race-summary equivalent),20.95ms validation,30.97ms encoding and57.63ms cold read in the recorded run. Those timings were obtained alongside other verification and are diagnostic, not a controlled performance guarantee. Logical8 MiB/complete256 MiB limits are unchanged. Actual IDB quota denial preserves current/previous roots and aborts staged restore.

## Balance and practical limitations

The matched native comparison script ran 30 seeds for each of Oval, Circuit and Long Rally, comparing baseline M6 interaction against starting Thunder Burst, with four entrants and Pure/Combat/weather variants. See its JSON for actual completed pair count, outcomes and condition; do not infer missing results or claim calibrated final tuning. Absolute Focus also has100 matched controlled first-decision fixtures. Native progression/financial proofs are separate from authoring and seeded progression tests.

The existing main-thread preferred100ms/ordinary-responsive targets remain targets. Worker total acknowledgment can be multi-second at result replay/validation boundaries; busy UI prevents duplicate submissions. This pass does not claim comprehensive isolated main-thread/Worker peak-memory or every browser hardware profile. Native seven-event capacity and synthetic retained-summary capacity are distinct. Windows responsiveness and true direct-file storage require owner testing.

The real IDB retained-record proof stored 14,663,715 bytes across eight actual native records, exported a29,483,815-byte complete backup, restored and settled to one435,351-byte current record. Under concurrent load it recorded commit6.75s, read2.27s, cold Worker validation31.35s, backup23.21s, restore70.32s and a6,506ms longest main-thread task. These are serious measured limitations, not a claim of meeting responsiveness targets. The origin estimate after compaction was135,168bytes; browser compression/quota accounting is not the logical serialized size. Main-thread JS heap observation was210MB, not an isolated Worker peak. Current/previous recovery roots were preserved and unreachable-body collection occurred through the coordinator; a second explicit collection correctly removed0 further records.

