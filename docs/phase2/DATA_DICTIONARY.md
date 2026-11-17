# Dataset and reproduction guide

Primary data are in `data/`; the declared rear-row follow-up is in `supplement/` with the same schemas. JSON/CSV files are machine-readable. Gzip is standard compression, not an application dependency.

| Artifact | Content |
|---|---|
| `races.csv` | One flat row per actual execution: experiment/arm/block/format/weather/seed/configId, status/bounds, duration/gaps, outcomes and main event counts, final checksum and measured wall time. Standard quoted CSV. |
| `races.jsonl.gz` | One full evaluation row per execution, including official order/full-precision times, RNG/checksums, eight RU measurements, utility-score moments, fatigue traces, action/compliance distributions, actual commands and initial decision examples. |
| `events.jsonl.gz` | Relevant authoritative physical, sign, damage/control, attack/reaction and rejected-maneuver events, with raceId. AI_DECISION/AI_EXECUTION_RESULT are aggregated per decision, not all duplicated here; regenerate full replay for exact traces. |
| `jobs.json.gz` | Complete scheduled experimental jobs: exact input roster, seed, weather, setup patches, labels and deterministic sign schedule. |
| `configurations.json.gz` | configId → simulation version, complete normalized setup (seed placeholder 0) and schedule. Always substitute the row/job's actual seed. |
| `execution.json` | Target/completed counts, actual formats/statuses, worker count, wall time, cancellation/bounds/tool errors and per-run completion index. |
| `analysis.json` | Descriptive, seed-cluster interval, paired-comparison and subgroup results. Primary file additionally includes duplicate checksums, outlier IDs and all group summaries. |
| `ru.csv.gz` | Primary flat RU-level export including sampled speed, action/blocking counts, damage taken/dealt, condition burden, individual finish/final fatigue, rank/time. Full nested data remain in races.jsonl.gz. Supplement RU data are nested in its races file. |

## Reproduce

```sh
npm test
node scripts/evaluation/run.mjs
node scripts/evaluation/run.mjs --supplement --out docs/phase2/supplement
node scripts/evaluation/analyze.mjs
node scripts/evaluation/analyze-supplement.mjs
node scripts/evaluation/validate-data.mjs
node scripts/evaluation/validate-data.mjs --supplement
MPLCONFIGDIR=/tmp/bnt-phase2-mpl python3 scripts/evaluation/plot.py
node scripts/evaluation/report.mjs
```

Default runs overwrite only the Phase 2 output directory supplied, not historical audits or engine references. Preserve delivered data before regenerating. For isolated work, supply `--out /tmp/my-study`; report/analyze scripts currently read the documented Phase 2 paths. `--workers 1..8` controls parallelism; default is at most four. `--limit N` creates a clearly reduced execution target. SIGINT/SIGTERM cancels further dispatch, retains completed runs and reports an incomplete/nonzero result; each race is tick-bounded and each worker has a 180-second wall watchdog. Keep primary/supplement counts separate.

Inspect a single recorded ID without rerunning the study:

```sh
node scripts/evaluation/run.mjs --run-id 'A-Pure-0-0-default' > /tmp/one-evaluation.json
node scripts/evaluation/run.mjs --supplement --run-id 'Drear-Combat-0-0-Engage Rivals' --replay > /tmp/one-evaluation-and-replay.json
```

The output includes result/config/eventRows and, with --replay, the actual engine replay record under `replay`. `verifyReplay` from `src/replay/replay.js` verifies that record. Reconstructing with archived baseline source is possible without trusting Git HEAD: extract `baseline/source.tar.gz` into a separate directory, use the archived normalized input and schedule, and keep development tooling separate from the standalone file.

## Interpretation safeguards

- `id` identifies an execution, not an independent seed. Primary has 1000 executions but 968 distinct seeded configurations (32 repeated controls); all duplicates match. The 130-run supplement is a new context with fresh seeds, not pooled replication of the front-row panel.
- `block` is the pairing key within experiment/format/attribute; use the documented panel when joining. Matching merely by seed across all experiments is invalid. Weather comparison A joins by seed within a fixed format; format comparison A joins by block.
- Existing engine checksum is keyed to full authoritative state, including checkpoint cadence. `eventsSHA256` is SHA-256 of JSON-serialized complete authoritative events; neither metric includes evaluation aggregation state. Parallel completion/export order is nondeterministic; sort by execution ID for dataset comparison. Individual authoritative results are deterministic. Exact export comparisons use standard JSON representation, where -0 becomes 0, not a numeric tolerance.
- Primary raw rows predate the explicit output playerId field; their normalized configurations specify RU1. Supplemental rows explicitly record RU5. Current reruns add that known metadata while authoritative checksums and every measured outcome remain unchanged.
- Final rank/time is official; nonfinishers retain null place/time plus retirement progress/status. No timeout is substituted as a finish. All actual study entrants finish; logic for absent data remains tested.
- `maxObservedSpeed` is an observed lower bound (tick endpoints plus corner observations). `sampledAverageSpeed` uses trapezoidal tick integration, with left-endpoint holding for the terminal competitive fraction. `sampledLaneSeconds` uses tick-start occupancy. None is exact continuous trajectory integration.
- `paceSeconds` integrates issued pace-preference events until actual finish/retirement. It is not a target-speed achievement guarantee. `blockedSeconds` reconstructs the forward-blocked flag within each tick; `avoidanceIntentSeconds` is selected avoid/yield-goal duration. Lateral failure is counted separately.
- Decision timing fields are due/early/repeated-boundary/subevent proxies, not explicit strategic/tactical pipeline labels. Utility moments describe candidate-score distributions, not calibrated action probabilities. Effective/physical counts follow linked decision outcomes. Compliance is counted once per final decision; opportunities exclude Inapplicable, and unresolved nulls are exposed separately.
- Queue/replacement/cancel/lower counts are exact events; uses are initial allowance minus remaining. `activeSignAtTermination`/`pendingSignAtTermination` are actual stored state. Competitive instruction lifetime ends when the RU finishes/retires; there is no invented expiration event.
- Damage taken is total component-condition loss. Combat damage dealt is separately linked from ATTACK IDs to DAMAGE contact/parent IDs, excluding damage to the attacker itself; all links resolve. Raw physical energy is abstract and available only for logged consequences. Wreck impacts and control-state emissions are event counts, not evidence of unobserved incidents.
- Finish fatigue is immutable historical per-beast snapshot data. Current final fatigue, strain/wear and condition are separate. Trace samples occur at start and ~20-second boundaries while still racing; late trace averages would be survivor-conditioned, so do not mistake them for the original whole field.
- Means, medians, sample SD and percentiles are descriptive. 95% mean intervals use deterministic analysis-only seed-cluster bootstrap (1000 resamples). Shared controls/opponents/weather are correlated. Four-pair sensitivity intervals are flagged small-cluster and exploratory. No automatic statistical-significance claim or blanket balance target follows.
