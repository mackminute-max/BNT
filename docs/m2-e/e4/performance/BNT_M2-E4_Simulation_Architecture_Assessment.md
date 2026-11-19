# BNT M2-E4 — Simulation Architecture Assessment

Verified runtime: `b8c090057052ac03bbed73d9487093da61381451`. Recommendations below are proposals, not implemented behavior.

## Assessment

Keep the single deterministic headless simulator. Its authoritative event ordering is useful and the profiling does not establish that replacing it would solve the dominant persistence delays. Early eight-entrant 100-tick medians are about 55–66 ms; late Long Rally raw100 is about 190 ms, while the durable equivalent takes 5.6–6.4 seconds after optimization. These measurements have different runtime overheads and are not an exact additive decomposition, but clearly show substantial costs beyond raw simulation.

| Area | Verified implementation | Assessment / disposition |
| --- | --- | --- |
| Tick ordering | `src/sim/race.js:892 step`: paused Signs, condition/control, commands, race start, incidents, AI intents, attacks, lane changes, subevent movement | Preserve this order. Reordering changes RNG/contact/sign outcomes and requires owner approval. |
| Movement | `race.js:698 motion`, `race.js:946` subevent loop integrates to the earliest boundary/control/incident/checkpoint event | Allocations and repeated calculations are future candidates, but changing arithmetic grouping or skipping a boundary is behavioral. No such changes made. |
| Lane/tile collisions | `race.js:801 resolveForward`; ownership retained until simultaneous group resolution (`race.js:981`) | Eight entrants do not justify a new broad-phase engine. Stable deterministic tie/order behavior is more important than changing asymptotic complexity at this scale. |
| AI | `src/ai/driver.js:64 decide`, called at existing cadence from `race.js:932` | No cadence/personality/utility changes. Reducing cadence is a mechanical change, not a safe implementation optimization. |
| Combat | `race.js:439 attacks`, `src/sim/consequences.js` bilateral impacts and reactions | Preserve contact flush/derived-stat recalculation dependencies. Current observations do not show combat resolution as the multi-second bottleneck. |
| Events/incidents | `src/sim/incidents.js:74` scheduled incident boundary; keyed draws retain draw accounting | Do not batch/skip draws. Infinity and scheduler state remain in the native graph codec. |
| Weather/condition | `src/sim/environment.js:98 integrateCondition`; `race.js:415 deriveAt` applies current surface/environment/payroll | Values are mutable, so a broad derived-stat cache would need a complete invalidation contract. A cache keyed only by asset identity would be wrong. |
| Derived RU stats | `src/model/ru.js:114 derive`; invoked around impacts, environment and AI | Subsystem timings show meaningful millisecond work; defer cache redesign until precise dependencies are proven. |
| Native snapshots | `src/sim/foundation/codec.js:6 graphPack` preserves aliases, property flags, sentinels and nonextensibility | Plain JSON/structuredClone is not a drop-in equivalent. Exact numeric LZW and bounded byte-equality caches improve performance without a format change. |
| Journals/replay | `src/persistence/race/session-store.js:51 decode` validates complete journal, checkpoints, native state and head | Reused hashes only across unchanged local state. Every input remains validated/executed in authoritative order and all required comparisons remain. |
| Worker/backend | `src/persistence/e4/worker-service.js`, `indexeddb.js` | Warm operations now avoid repeated reconstruction, but cold validation, full-history backup and record transfer remain costly. Worker placement improves responsiveness, not necessarily total latency. |

## Maintainability and compatibility

The implementation changes six modules and retains existing APIs, codec/version identifiers, storage bounds, migration paths, replay formats and strict domain contracts. Small private caches are bounded and derived; persisted bytes and revisions remain authority. No cache token or digest supplied by the caller establishes trust. All cold loads take required validation paths. No protected identity or journal is pruned.

The new seven tests directly target codec bytes, dictionary resets, descriptors/aliasing, corruption, canonical/SHA compatibility, exact read sets, mutation of worker cache candidate arrays, and inverse-cache header rejection. Existing persistence/fault suites remain unchanged.

## Prioritized future technical work — requires a bounded follow-up review

1. Profile a versioned lossless representation that factors repeated immutable setup/track/provenance out of repeated full snapshots while retaining auditable reconstruction. Keep old reader/writer compatibility and logical bounds. No redesign was implemented here.
2. Prototype smaller revision-bound worker/backend messages, validated object-store references and bounded preparation. Preserve atomic read sets and proof authority; do not treat transfer completion as durability.
3. Investigate retained-history reconstruction indexes with exact-byte invalidation, validating cold authority once and retaining explicit proof of the validated revision. Any persistence-format or authority redesign requires approval.
4. Measure actual low-end Windows memory and event-loop delay before choosing larger caches. Current samples show memory pressure remains and do not establish a memory improvement.

These are significant architectural proposals, not permission to start them. Quantify response-time and memory benefits before changing accepted contracts.

## Mechanical simplification alternatives — NOT IMPLEMENTED

Profiling does not justify a mechanical simplification for the dominant durable delays. If considered later:

| Current mechanic / cost | Possible simplification | Potential gain and player consequence | Determinism / saves | Effort / alternative |
| --- | --- | --- | --- | --- |
| Earliest-event substeps within each tick | Coarser fixed movement steps | Could reduce motion/event work; changes collisions, passing, precise finishes, control and Sign boundaries. Cannot plausibly remove multi-second codec costs. | New simulator version, new goldens, historical replay support and mid-race compatibility strategy required. | High; prefer lossless snapshot/transfer optimization. |
| Frequent tactical evaluation | Less frequent AI decisions | Could reduce decision/derive cost; reduces reaction quality and changes personality/combat opportunities. | New behavior version/RNG analysis; old checkpoints/replays must retain old cadence. | Moderate; prefer narrow dependency-proven stat caching. |
| Continuous subevent condition integration | Batch fatigue/weather updates | Reduces calls, but changes numerical integration and eligibility/combat feedback. | New math/behavior version; historical results differ. | High correctness risk; prefer allocation reduction without reordered arithmetic. |

No numerical improvement percentages are promised: only controlled prototypes could establish them. Even eliminating the measured raw native workload would leave most late durable latency intact. Owner approval would be required for every option above.

## Why raw late-race work also grows

“Raw simulation” in the benchmark means the existing unmodified `step()` contract, including its native replay diagnostics. At `src/sim/race.js:1069`, every configured checkpoint interval (default 100 ticks) appends `digest(s)`. `snapshot()` at `race.js:312` includes the entire events array, commands, track and entrant state; `digest()` at `race.js:354` canonicalizes and hashes it. Therefore a 100-tick measurement crossing a checkpoint includes growing historical serialization, even without durable storage. The late raw target miss is not proof that movement/AI has become expensive.

A future exact-byte streaming canonical/hash implementation, or rigorously immutable-prefix reuse, may reduce allocation without changing the resulting hash. It must preserve key order, UTF-16/code-point behavior, getters where supported, mutable event semantics and final avalanche arithmetic. No such follow-up was implemented here. Do not reduce diagnostic frequency or exclude old events to manufacture faster raw timings.
