# BNT P1.4 — Determinism and Compatibility

## Three separate claims

1. **Determinism:** repeating identical native initial conditions and ordered tick inputs yields the same result within a supported runtime.
2. **Reference equivalence:** the optimized implementation matches the frozen P1.3 implementation's authoritative state, events, RNG, conditions, classifications and checkpoints.
3. **Historical compatibility:** accepted historical replay outputs and hashes remain unchanged.

A newly deterministic but different result is not accepted as equivalent. No reference file, expected checksum, tuning profile, race configuration, native clock or replay format is regenerated or weakened in this milestone.

## Exact canonical input and integer behavior

`tests/p1-4.test.js` compares the emitted canonical fragment text to the retained original `canonical`, and the final fold to the original `checksum`. It covers Unicode/valid and lone surrogates, control characters, quotes, non-finite numbers, negative zero, scientific notation, sparse arrays, undefined array versus object values, primitive undefined/functions/symbols, numeric-looking property names, inherited/non-enumerable behavior, frozen objects, mutation after prior hashing, key-list collisions and cache churn. BigInt rejection is retained. These checks concern the native/plain-state canonical contract, not a new promise to support monkey-patched host objects or cyclic checkpoints.

The historical hash iterates JavaScript string code points and uses charCodeAt(0); a valid surrogate pair contributes its high surrogate once. The indexed local loop explicitly preserves that behavior rather than silently changing to UTF-8 or hashing both UTF-16 units. Punctuation integer folds and final avalanche match the original operation sequence modulo32-bit arithmetic. Simulation floating-point expressions and ordering are untouched.

`streamingKeys` verifies all current own enumerable keys before reusing a sorted key order. Only bounded property-name/quote data is cached. No event, state object, external token, unverified digest, protected record or persisted validation result is trusted from that cache. Values are read afresh, including after mutation. `snapshot` contents and native checkpoint scheduling are unchanged.

## Reference-state proof design

`/tmp/bnt-p14-reference` is a frozen archive of P1.3 delivery `f17c8bfd3edc6e7708df27c86aa7e371585f41f4`. `scripts/p1-4/equivalence.mjs` imports reference and candidate as separate module graphs and advances both using the same setup and native tick inputs.

- Six full P1.3 tactical cases cover Oval Pure4, Oval Combat8, C01 Pure8, C01 Combat8, Short Rally Combat8 and Long Rally Combat8.
- Three additional full cases exercise legacy, P1.1 Endurance and P1.2 Competitive.
- C01 adds Rain and the Combat C01 case uses existing headstrong traits, exercising personality resistance without altering those traits during racing.
- One native pre-start Push and a queued Conserve at tick300 test unchanged activation and input ordering.
- Snapshot/event/RNG SHA-256 signatures and native digests are checked every tick1–30, every100th tick and at termination. Direct official classifications and full final replay signatures also match.
- At ticks100/500/1500 where reached, complete checkpoint wire JSON is compared byte-for-byte; ten-step restored continuations are compared. Checkpoint wire byte counts/SHA-256 are retained.
- Six close-contact autonomous native scenarios supplement full races; five explicit native boundary-command scenarios additionally cover weapon, ram, defended, invalidated and simultaneous contact cases, compared each of20 ticks.

The full history at each selected snapshot is included, not sampled away. Full tick-by-tick full-history encoding for every long-race tick would itself create prohibitive O(ticks×history) diagnostic work, so the stated selected-checkpoint/full-result strategy is deliberate and its limits are disclosed. The close-contact boundary fixtures use reference-driver mode and explicit valid native defensive/test setup, not new player controls or fabricated race outcomes.

## Executed results

- Nine full autonomous native races **all Ended**, with matching full final replay SHA-256, classifications, resources and RNG.
- Six autonomous close-contact120-tick diagnostic traces match; they deliberately remain Running and are not claimed as completed races.
- **718 selected snapshot/event/RNG comparisons** match, plus **32 complete checkpoint-wire byte comparisons and restored continuations**.
- Five explicit close-contact boundary fixtures match every tick (100 ticks total), covering native successful weapon, successful ram, defended attack, invalidated attack and simultaneous opportunities. Their source-linked events are retained.
- **12 historical native replay and2 payroll reference checksums** match. Payroll Pure `ad509187`, Combat `f191ca35`.
- Six accepted P1.1/P1.2 full-race hashes match: `0f553f9a`, `f943fdf3`, `aa6f3a3f`, `bedabe3d`, `8eb5150f`, `620a1529`.
- Three accepted P1.3 tactical full-race hashes match: Oval `d39b517d`, C01 `ec08b1b6`, Long Rally `0fa75952`; direct classification, full resource trajectories and Sign events match the accepted records.
- Complete4× Chromium Circuit Combat reference/candidate runs both produce `51624d65` and identical classification. This is same-browser equivalence, not a Node/Chromium cross-runtime assertion.
- Final full configured suite: **605/605 pass, zero failed/skipped; raw exit0; 376.53s**.

| Reference/candidate fixture | Tick | Status | Matching checksum |
|---|---|---|---|
| oval/Pure/tactical | 1775 | Ended | `fcd72489` |
| oval/Combat/tactical | 1841 | Ended | `883b8e6c` |
| C01/Pure/tactical | 3624 | Ended | `3c566453` |
| C01/Combat/tactical | 3582 | Ended | `73b3e0f4` |
| rally-short/Combat/tactical | 1421 | Ended | `e20fff25` |
| rally-long/Combat/tactical | 4175 | Ended | `376123c5` |
| oval/Pure/legacy | 1862 | Ended | `87342ee7` |
| C01/Combat/endurance | 3492 | Ended | `15c29f60` |
| rally-long/Pure/competitive | 4097 | Ended | `857f050c` |
| native close-contact weapon | 120 | Running | `71f0912a` |
| native close-contact ram | 120 | Running | `4d451c18` |
| native close-contact unsafe-ram | 120 | Running | `8c510e3e` |
| native close-contact damaged | 120 | Running | `82f3ae2f` |
| native close-contact cautious | 120 | Running | `b005d2c9` |
| native close-contact race-on | 120 | Running | `3b0ac93a` |


The fresh focused prototype suite passes80/80, including all accepted P1.3 obedience, physical constraint, queued Sign activation across course types, resource accounting, native replay and checkpoint restoration tests plus four new serializer/equivalence tests. The final full regression and reference results are listed above and in the delivery report; historical accepted evidence is not presented as a fresh execution.

## Authority and compatibility boundaries

Native `VERSION`, schema numbers, capture/replay formats, checkpoint wire versions/descriptors, RNG algorithm and draw ordering, event construction and payloads, configured digest intervals, D2 mappings, career transactions, protected financial history, storage limits and all historical profiles are preserved. No authoritative state field or descriptor is added. `PROTOTYPE_VERSION`/UI identification changes to P1.4 only; the gameplay policy version remains P1.3 tactical and earlier policies remain selectable.

Generic `canonical`, `checksum`, `hash`, financial validation and checkpoint codecs remain unchanged. Only `race.digest` selects the equivalent new fold. No required digest is skipped, deferred or acknowledged early. There is no asynchronous publication, new worker, periodic durable write, journal coalescing or deletion of ACTION_EXERTION receipts.

The inherited Node/Chromium Long Rally numerical portability limitation is not solved or hidden: no physics, math rounding, incidents or accepted checksum is changed. Same-Chromium reference/candidate whole-race comparison is a separate test from Node reference/candidate comparison. Windows Chrome/Edge direct-file testing remains owner acceptance, not a claim derived from managed HTTP tests.
