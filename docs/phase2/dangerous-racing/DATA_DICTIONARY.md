# Data and reproduction

All commands run from the repository root. Runtime has no dependency on these development tools. Preserve delivered evidence; use a different `--out` directory for exploratory reruns.

```sh
npm test
node scripts/dangerous-racing/diagnostics.mjs
node scripts/dangerous-racing/defenses.mjs
node scripts/dangerous-racing/contact-races.mjs
node scripts/dangerous-racing/run.mjs --pilot --out /tmp/dr-pilot
node scripts/dangerous-racing/run.mjs --out /tmp/dr-cohorts
node scripts/dangerous-racing/run.mjs --personalities --workers 2 --out /tmp/dr-personalities
node scripts/dangerous-racing/run.mjs --run-id DR-high-risk-1-2-Combat --replay > /tmp/dr-one.json
node scripts/dangerous-racing/niches.mjs
node scripts/dangerous-racing/extra-replays.mjs
node scripts/dangerous-racing/finish-condition.mjs
node scripts/dangerous-racing/analyze.mjs
node scripts/dangerous-racing/niche-analysis.mjs
node scripts/dangerous-racing/verify.mjs
python3 scripts/dangerous-racing/report.py
MPLCONFIGDIR=/tmp/bnt-dangerous-mpl python3 scripts/dangerous-racing/plot.py
npm run build
sha256sum -c docs/phase2/dangerous-racing/FILES.sha256
```

The analysis/report/verification scripts read delivered paths under docs/phase2/dangerous-racing; `/tmp` execution examples do not automatically replace those inputs. Default runner output is `.../data`; rerunning default would overwrite this new study evidence, so archive first. Mechanism scripts write only this investigation's outputs, never historical audits. Files.sha256 is a delivery manifest, generated after all outputs; regenerating plots/log wall times can change file hashes without changing deterministic race results.

`--workers 1..8`, `--limit N` support bounded testing. SIGINT/SIGTERM stops new dispatch, preserves completed rows and exits nonzero if incomplete. Races have a 30000-tick bound; the simulator's own 1200s limit/20s no-progress safeguard remains active. Worker watchdog is 180s; wall clock only cancels the tool, never changes simulation decisions. The study used four workers, personality panel two. Dispatch/completion order and wallSeconds are nondeterministic; ID-keyed inputs/events/results are deterministic. Worker limits do not create fake finishes.

## Artifacts

| Path | Schema / content |
|---|---|
| baseline/manifest.json | Git revision, simulation version, Node, exact HTML bytes/hash |
| baseline/default-configuration.json | Complete normalized default setup, including eight RU inputs and centralized AI/physics/consequence configuration |
| baseline/references.json | Two pre-instrumentation seed 145 result/checksum/eventSHA/RNG references |
| baseline/files.sha256 | Byte hashes of all existing source/artifact/package/engine tests/evaluation tools; validates no baseline modification |
| data/jobs.json.gz | All 720 exact scheduled setups/seeds/rosters/labels; job ID is stable reproduction key |
| data/configurations.json.gz | configId -> normalized full setup with seed placeholder 0; substitute the actual row seed; exact schedule (empty here) |
| data/races.jsonl.gz | One row per completed execution, including eight RU metrics, official full-precision classification, checksum, complete-event SHA256, RNG, danger diagnostics |
| data/events.jsonl.gz | Authoritative physical, attack/reaction, damage/control, incident, retirement, wreck, sign and finish events, joined with raceId. Full AI decisions/movement events are regenerated in replay; selected candidates are retained in row examples. |
| data/races.csv | Flat race-level outcome counts and checksums; statuses preserve three Stalled results |
| data/ru.csv.gz | Flat entrant rows, including identity/slot/profile/equipment, official time/place, damage kind, fatigue, condition, strain/wear, ram opportunities/selections and retirement cause |
| data/execution.json | Actual target/completed/status/error counts and execution index, worker/wall-time metadata |
| personality-control/ | Same cohort schema for separate 100-race role-swap panel; RU records nested in JSONL, no separate flat RU CSV |
| pilot/ | Fifteen excluded pilot races with identical schemas |
| mechanisms/ai.json.gz | 768 autonomous five-second probes: candidate terms/scores, legality, intended/effective/physical first decision, linked executions, subsequent contests/consequences, q/speed; forced-state flag |
| mechanisms/physical.json.gz | 1824 commanded five-second duels: full setup, initial derived stats, relevant actual events, final component/derived/q/speed/control |
| mechanisms/imposed-exposure.json.gz | 720 forced exposure series: explicit legal starting condition, imposed relative speed/contact schedule, exact event progression and terminal components; not races or selection evidence |
| mechanisms/defenses.json.gz | 768 same-tick two-attacker groups, actual contests/reactions/damage, skill/protection/personality/state factors and forced active-defense labels |
| mechanisms/contact-races.json.gz | 96 full reference-driver moving-start diagnostic races; explicit commanded initial action, setup/events/classification |
| mechanisms/ram-niches.json.gz | 384 additional full diagnostic races, disclosed asymmetric skill/condition/protection/relative speed; all action/control arms retained |
| analysis.json | Cohort/format/weather/strata statistics, n/mean/median/SD/percentiles, clustered CIs, rare-event intervals, AI/physical/defense summaries and flagged IDs |
| niche-analysis.json | Paired terminal lead effects; both-finished denominators plus explicit rival DNF and actor-win counts; no imputed nonfinish time |
| evidence/*.replay.json.gz | Real capture() records: configuration/seed/commands/events/checkpoints/checksum; every saved record verified by the authoritative replay module |
| evidence/verification.json | Two original references, observer/cadence/event/RNG parity, nine saved study-row reruns, two whole-dataset accounting validations and baseline-byte identity |
| evidence/clearance-stalls.json | All three reproduced stalls: physical q/lane/status, locked time, last blocked tiles, administrative reason |
| evidence/retirement-provenance.json | Final disabling damage source/component counts joined by actual cause/contact ID; also entry observations with OOC |

## Metric safeguards

`danger.ramOpportunities` counts AI_DECISION events with a legal ram candidate, not distinct opponents, opportunities per second, or independent trials. `ramSelected` is intention; actual ATTACK action/boolean success separates issued/physically contested/hit stages. Invalidated attacks are separate events. Candidates use perceived state; commanding a ram in diagnostics does not show AI preference.

`danger.contests` contains exact attacker/defender/attack/defense/margin/reacted/success plus linked actual damage. `reactiveBonus` is 10 plus 12 if a consumed reaction was actively defending. `noReactionMargin` adds that bonus back to the actual margin; a flip is a failed contest with positive adjusted margin. This is a same-state arithmetic contrast, not a counterfactual race or measured prevented damage. `unreacted` is not automatically budget exhaustion: OOC also prevents reaction. Controlled simultaneous groups isolate exhaustion. Profile labels duplicate resolver inputs there because reference drivers do not make AI decisions; 768 records are 384 unique physical seeded configurations.

`danger.perRU` contains competitive minimum conditions, newly crossing <=25, initially <=25, component/source damage, ram/attack selection, defense counts, control history and competitive stop time. Damage events are capped at that RU's finish/retirement for per-entry diagnostics. Race totals can include physical post-finish clearance; distinguish them from competitive entry damage. `endsSerious` is minimum/final condition during competition, not a claim that the component started healthy. Condition decreases monotonically in this no-override study. Out-of-Control metrics count emitted events; affected-entry counts are reported separately. All driver/beast/chariot live final states remain separate from immutable per-beast finish-fatigue snapshots.

Original Phase2 sampled speed/lane-time and blocked/overtake definitions apply unchanged. No exact path integral or unlogged reaction eligibility reason is invented. `knownPhysicalImpactCount` and energy summaries only cover logged consequences, in abstract model units. Attack direct damage has energy 0. Physical momentum transfer beyond this implemented reduced-mass energy model is unavailable.

Statistical unit: 40 shared seed blocks/cohort, five weathers each ; 8 for format controls, 10 for personality role swaps. Descriptive entry n is not an independent sample count. Bootstrap uses analysis-only deterministic RNG. Degenerate no-event intervals are supplemented by seed-block Wilson/exact bounds. Both-finished times are conditional, and nonfinisher counts remain explicit. No causal isolation is claimed for composite cohort or seed-assigned surface/traffic strata. Weapon exposure records with closing 0/10/25 are deliberately duplicated controls: speed does not affect weapon damage directly. Realized favorable ram seed examples were selected after inspecting outputs; frequency/mean inferences use their complete panels, not the examples alone.

`competitive-stop-condition.jsonl.gz` adds one exact derived component-condition snapshot per study entry (6560 total). It applies only DAMAGE events preceding that RU's actual finish/retirement event **by event ID**, so post-finish damage at the same timestamp cannot rewrite history. `finish-condition.mjs` regenerates it; `evidence/finish-condition.json` records accounting and the same-time exclusion check. Existing live final condition and immutable finish-fatigue data remain separate. To verify exported replay files themselves, run `node scripts/dangerous-racing/verify-saved-replays.mjs` (28 records).
