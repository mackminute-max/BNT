# BNT M2-E4 — Cross-Runtime Determinism Investigation

Final tested runtime: `b8c090057052ac03bbed73d9487093da61381451`. No rounding, physics, geometry, checksum exclusions or golden references were changed.

## Earliest divergence — verified

For the accepted generated Long Combat Rally fixture, Node finishes with checksum `3cc91b8c`; Chromium finishes with `aebb513e`. The mismatch is already present at tick 0, before race progression.

Instrumenting the mathematical calls in creation identifies the first differing operation (index 22):

```js
Math.cos(-0.7853981633974482)
// Node:     0.7071067811865477
// Chromium: 0.7071067811865476
```

Actual stack: `src/track/course.js:16:77 advance` → `course.js:52`/`:49 compileCourse` → `src/track/oval.js:10 track` → `src/sim/race.js:79 createRace`. Node V8 is `13.6.233.17-node.58`; Chromium's JavaScript engine reports `15.6.75.27`. Chromium's inline Blob worker matches its main-thread cosine result.

The initial-state comparison contains 89 differences, all in compiled track coordinates. The final-state comparison contains the same 89 track-coordinate differences, with maximum absolute difference approximately `2.84e-14`. The comparator excludes only the root array of derived native checkpoint digests; track activation checkpoints remain compared. No other differences appear in the JSON-normalized comparison of this fixture. This comparison is not a descriptor/Infinity equivalence proof for every state: exact codec regressions and replay tests cover those separately.

Evidence: `evidence/cross-runtime/investigation.json`, `detail.json`; reproducible scripts `scripts/m2-e/performance/cross-runtime.mjs` and `cross-detail.mjs`.

## Full native checkpoint portability — tested in both directions

Using the real simulator, checkpoint at tick 100, restore in the other runtime, finish the race:

| Checkpoint origin → resumed runtime | Result | Original context reference |
| --- | --- | --- |
| Node → Chromium | `3cc91b8c` | `3cc91b8c` |
| Chromium → Node | `aebb513e` | `aebb513e` |

Both passed, process exit 0. The checkpoint carries the already compiled geometry, avoiding recomputation of the differing coordinates. This establishes this fixture's bidirectional checkpoint continuity; it does not repair fresh setup-only replay across runtimes or prove all platform/browser combinations.

## Compatibility disposition

The discrepancy predates these optimizations. Historical references, the approved championship incident clock, payroll-context replays and same-runtime results remain unchanged. The first divergent operation is trigonometric geometry compilation, not the incident clock, coaching, AI choice, combat or the new codec implementation.

Only one Linux Chromium build and one Node build were available. Windows Chrome/Edge, Firefox and Safari were not tested. Therefore it is **not established** that the discrepancy affects only Node-versus-Chromium. ECMAScript transcendental implementation differences can occur across engines/platforms; universal browser-to-browser setup-only portability remains unverified.

## Proposed alternatives — owner review required before implementation

1. A future versioned deterministic geometry math contract could make fresh setup identical, while preserving the old implementation for historical replay and save versions. This changes numerical behavior and accepted references: requires owner approval.
2. A future replay version could carry authoritative compiled geometry and validate its connection to setup. This is a format/validation design change requiring review; the existing full native checkpoint already preserves it.
3. Retain the current behavior and explicitly restrict exact setup-only replay verification to a matching runtime, while using validated native checkpoints for tested cross-runtime continuation. This is a product compatibility decision, not automatically approved here.

Do not round coordinates, exclude geometry from digests or update goldens to hide the discrepancy. No alternative above was implemented.
