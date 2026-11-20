# BNT P1.4 — Optimization Report

## Retained implementation

The delivered gameplay remains P1.3 tactical policy. Only native digest execution changes; no physics, AI, collision, combat, environment, resource, action-receipt, Sign or scheduling code was simplified speculatively.

1. **Canonical integer fold:** `src/core/determinism.js:foldCanonical/foldText/streamingChecksum` reads the same canonical character sequence directly into the same FNV/avalanche integer hash, without recursively allocating mapped/joined full snapshot strings. `src/sim/race.js:digest` invokes it on the unchanged snapshot. Punctuation character codes, key order, number formatting, non-finite values, undefined object values, sparse/undefined array slots and Unicode semantics are preserved. A local integer accumulator avoids the rejected captured-callback path.
2. **Verified key-shape preparation:** `streamingKeys` uses a bounded256-entry coarse lookup, verifies the complete current ordered key list on every hit, and stores only property names and their sorted order. It never caches object values, validation results, event payloads or caller authority. Shape changes cause fresh sorting; unknown/large/long-key shapes bypass it. The existing quote cache remains bounded and purely textual. Mutable event changes are read afresh on every digest.
3. **Local indexed character loop:** the integer fold uses indexed UTF-16 access with the exact historical for-of/charCodeAt behavior for valid surrogate pairs. It does not switch to UTF-8 hashing, process both halves of a historical pair, change floating-point simulation order, or replace the checksum algorithm.

`writeCanonical` exposes the matching fragment stream for input-equivalence tests; it is not a new replay format and is unused/tree-shaken from normal viewer execution. The existing `canonical`, `checksum` and `hash` interfaces remain available and unchanged for career validation and reference oracles. There is no mutable event cache or new durable authority.

## Before/after native measurements

Same fixed states, five digest samples each; all18 state checksums match. These are native Node diagnostic medians under the same CPU-profiler setup, not proof of browser frame pacing. Component benchmark calls also measure the retained original serialization path to explain cost.

| Case | Tick | Reference digest ms | Final digest ms | Reduction |
|---|---|---|---|---|
| oval/Pure | 100 | 7.3 | 2.3 | 68.9% |
| oval/Pure | 600 | 20.1 | 7.8 | 61.3% |
| oval/Pure | 1000 | 31.9 | 14.1 | 55.6% |
| oval/Combat | 100 | 26.2 | 11.0 | 58.1% |
| oval/Combat | 600 | 77.7 | 33.3 | 57.2% |
| oval/Combat | 1000 | 127.2 | 51.2 | 59.7% |
| C01/Pure | 100 | 21.5 | 8.4 | 61.0% |
| C01/Pure | 1000 | 121.0 | 49.3 | 59.3% |
| C01/Pure | 2200 | 222.2 | 91.3 | 58.9% |
| C01/Combat | 100 | 28.0 | 12.6 | 55.0% |
| C01/Combat | 1000 | 155.4 | 62.2 | 60.0% |
| C01/Combat | 2200 | 258.2 | 113.0 | 56.3% |
| rally-short/Combat | 100 | 25.9 | 11.2 | 56.7% |
| rally-short/Combat | 600 | 85.8 | 41.0 | 52.3% |
| rally-short/Combat | 1000 | 118.6 | 54.4 | 54.1% |
| rally-long/Combat | 100 | 28.3 | 11.7 | 58.7% |
| rally-long/Combat | 1800 | 210.2 | 96.3 | 54.2% |
| rally-long/Combat | 3000 | 337.8 | 135.4 | 59.9% |

## Rejected and revised experiments

- **Generic writer with a captured hash accumulator:** initially about2× faster in Node, but its actual Chromium phase benchmark regressed. It is rejected. Partial browser observations and the nonzero, intentionally terminated process are retained as `rejected-callback-frames.json`; no passing final benchmark claim uses them. Preliminary commit `eeaf64c` contains that experiment and is not the delivered runtime.
- **Local fold using for-of for every short scalar:** improved Chromium compared with the callback, but the same-page rotating comparison found the local indexed loop faster; superseded.
- **Flat canonical fragments joined before the original hash:** tested in the same Chromium page, retained full strings and extra fragment arrays, and was slower than the final fold in the late samples; rejected.
- The initial streaming key lookup reused the original full-key-list JSON signature. Isolated Node comparisons found an additional gain from verified coarse shape preparation; retained only with full-key equality and mutation/collision tests.

The same-page browser experiment compares all five implementations on identical native snapshots in rotating order, three warmups then five samples. Every result equals the original checksum. Source for rejected variants is isolated under `scripts/p1-4/experiments/`; it is not imported by the normal app. No accepted golden was regenerated.

## Preservation and scope

Every event, receipt, source ID, resource delta and authoritative field remains present and in the same order. Digest/checkpoint frequency is unchanged. Full checkpoint codecs, compression, restored descriptors and supported versions are unchanged. Generic career hashing/validation, financial/protected history and persistence limits are unchanged. No extra RNG draw, reduced precision, approximate geometry, new worker, durable event system or background authority exists.

Viewer changes are milestone identification only: P1.4 header/metrics identify optimized execution while the policy selector correctly retains P1.3 tactical behavior. Existing whole-tick debt handling, rendering budgets, camera, map, DOM guards, commentary and bounded effects are untouched. No unmeasured micro-optimization to combat target order or movement arithmetic was retained.

## Limits and escalation

The final fold still traverses the complete required snapshot/event history: cost remains O(history). It removes substantial construction/allocation work, not the authoritative workload. Full checkpoint compression/restoration and existing long histories can still block. No guarantee of sub50ms late digests, zero long frames or debt-free4× play is inferred from Node throughput. The Frame-Pacing report governs the browser result and reports regressions/inconclusive cases.

If owner testing requires eliminating the remaining longest stalls, a separate narrow proposal should first measure whether further serializer/allocation improvement is worthwhile, then evaluate exact-generation incremental preparation or an embedded worker as isolated experiments. Such changes need approval, exact byte/state equivalence, fixed input ordering, no false checkpoint acknowledgment, cold verification and standalone proof. None is implemented here, and a rewrite is not presented as the only option.
