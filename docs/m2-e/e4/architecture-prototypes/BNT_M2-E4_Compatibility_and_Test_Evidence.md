# BNT M2-E4 — Save/Replay Compatibility and Test Evidence

## Verified source boundary

Repository `https://github.com/mackminute-max/BNT.git`, branch `feat/m2-e-e4-persistence-recovery`. Production runtime remains `b8c090057052ac03bbed73d9487093da61381451`; starting documentation HEAD was `faf1cf5c93eab6dab01445157ef59133241b8c0b`. All executable changes are isolated in `experiments/e4-architecture/`. Production `src/`, existing `tests/`, dependency files and `dist/` are identical to the runtime baseline. Source/commit/file-hash verification and the complete experiment commit list are retained in evidence.

The prototype modules are not imported by application/build entry points. Optional esbuild plugins transform only in-memory experimental worker bundles, never the production source file. New prototypes are not supported game save formats; the actual CareerStore importer rejects them without replacing the previous career. No owner save, schema, migration, protected identity, financial history or accepted golden reference was changed.

## Actual tests executed in this task

| Command / check | Actual result | Raw exit |
| --- | --- | --- |
| `node --test tests/m2-e-performance.test.js tests/m2-e-e4-worker.test.js tests/m2-e-foundation.test.js tests/m2-e-e4-stage2.test.js` | 52 passed, 0 failed, 0 skipped | 0 |
| `node --test experiments/e4-architecture/prototype.test.mjs` | 8 passed, 0 failed, 0 skipped | 0 |
| `node experiments/e4-architecture/replay-proof.mjs` | 8 complete real native race/replay comparisons through two representation prototypes; Pure oval plus Combat circuit/oval/generated Long Rally; queued Sign carried | 0 |
| `node experiments/e4-architecture/cache-proof.mjs` | 3 groups: four frozen codec wire goldens, alias/descriptor/corruption/header parity, eviction/budget/cycle rejection | 0 |
| `node experiments/e4-architecture/validation-proof.mjs` (correct private-state fixture) | Valid exact private-state hit; 6 invalid treasury/receipt/ownership/undefined/NaN/revision cases agree with original validator; budget retained | 0 |
| `node experiments/e4-architecture/faults.mjs` | 10 current actor fault groups, HTTP | 0 |
| Same actor faults with `BNT_EXPERIMENT_CACHE=two` | Same 10 groups, HTTP | 0 |
| Same actor faults with `BNT_EXPERIMENT_VALIDATION=exact` | Same 10 groups, HTTP | 0 |
| `reference-check.mjs` retained in evidence | Fresh 12 historical native references plus 2 retained payroll-context replays match | 0 |
| `npm run build` | Existing offline dependency guard passes; both production HTML aliases reproduce baseline exactly | 0 |
| `git diff --exit-code b8c0900 -- src tests dist package.json package-lock.json` | Empty production/test/dependency/build diff | 0 |

The previous complete 525/525 configured Node-suite run is **historical evidence at the identical production runtime**, not a full-suite run repeated in this prototype task. This task freshly executed the 52-test relevant accepted subset and the separate prototype/native/fault proofs above. The older full browser-runner inventory (including its known file-policy, obsolete selector and native-log diagnostic failures) was not rerun in full; no maintenance change was made to those runners. Do not call this a completely passing full browser inventory.

## Current actor fault groups

1. Production database names are rejected: only disposable `EXP-`, `MEM-`, `FAULT-` names are allowed.
2. An aborted original IndexedDB transaction leaves the original generation and logical records unchanged.
3. An injected quota exception with an **empty message** rejects and leaves authority unchanged; no false success from a falsy error string.
4. Stale expected generation rejects before publication.
5. A commit with lost acknowledgment reloads the committed tick.
6. Retrying its input identity does not repeat logical consequences (backend metadata generation may still advance, matching existing behavior).
7. Conflicting input content under the same identity rejects.
8. Competing same-generation requests serialize; only one commits and the other is stale.
9. An interrupted staged restore retains the old head, retries safely and consumes its restore identity once.
10. Cold corruption is not accepted as a valid career/session inspection.

These use the original domain validators/reducers and strict IndexedDB transaction implementation. The actor awaits transaction completion before returning `durable:true`. Transfer and preparation replies are not durability evidence. Injected abort/quota tests supplement, not replace, previously established real-quota evidence; actual quota exhaustion was not newly run for every prototype variant.

## Native and representation proofs

Every sampled graph decode is compared to the **complete original legacy packed wire**, including node order, aliases, separate object identity, descriptors, array flags, Infinity/-Infinity, negative zero and undefined sentinels. Real racing-state comparisons additionally validate native boundaries and digests. Full continuation/replay tests use the original authoritative engine, not synthetic racing logic.

The graph/template comparisons do not implement a new authoritative session format, completion producer or reward economy. Original journal before/after fingerprints, setup/ownership checks, native proof publication, protected finance and exactly-once effects are reused unchanged in actual backend comparisons. Current and previous raw-record factoring reconstitutes every original string and order exactly. It does not drop journals, old sessions or receipt history.

The configured foundation subset includes checkpoint/restore, input ordering, zero-frequency incident sentinels, publication/idempotency, storage failures and accepted persistence protections. Dense browser comparisons include paused Conserve Strength and full checkpoint writes at 25-tick request boundaries. They are harness-driven equivalents, not a new automatic viewer scheduler.

Fresh historical checksums remain:

| Driver mode | Pure oval / C01 / mixed Rally | Combat oval / C01 / mixed Rally |
| --- | --- | --- |
| Reference | `fe1bfab8` / `1e9d7e68` / `d13a8fdf` | `79dec048` / `cd29b4b3` / `38fdb4e1` |
| Autonomous | `821eca67` / `c1730efa` / `4120f7c5` | `c8fd3ca0` / `3ef47ff6` / `fd015e71` |

Payroll Pure remains `ad509187`; Combat remains `f191ca35`. No new expected checksum was established to conceal a discrepancy.

The known fresh-setup Node/Chromium generated-Long-Rally geometry discrepancy remains outside this experiment's numerical scope. No trigonometry, geometry, physics, rounding, RNG, incident clock or native replay contract changed; no new cross-engine portability guarantee is claimed.

## Preliminary failures and disposition

- Positional graph pages are an actual negative optimization result. Exact reconstruction passes, but storage/cost regress. Reject that representation.
- The first fault harness tried HTTP navigation immediately after a policy-blocked file navigation; Chromium's pending error-page navigation interrupted it before the functional tests. A fresh page separates those actions; original failure and successful reruns are retained.
- The first exact-controller proof expected a hit between the public `CareerStore.state` deep-frozen view (`schema2.js:126–130`) and a mutable clone. The key intentionally preserves descriptors, so this expectation was wrong. The proof now uses the actual private `CareerStore.current`/structuredClone boundary; the equality and invalid-state assertions were not weakened.
- The actor originally serialized only `error.message`; a native quota error can have an empty message. The isolated protocol now uses a nonempty message/name fallback, and the explicit denial test passes. Production's existing structured-error protocol was not changed.
- The second compression-cache entry is byte-compatible but has no demonstrated reliable throughput win and retains more worker memory. It is not recommended for integration.

## Production and standalone artifact

Both `dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html` remain **1,047,085 bytes**, SHA-256:

`8a9b73409a84517f2b0c72c265499434afcf14d94037a645bec553a6b1cba9a3`

The production build still embeds application and worker, needs no runtime Node/server/network or adjacent files, and passes its external-runtime-dependency guard. No dependency was installed or changed. Experimental generated HTMLs also embed their worker, but are **diagnostic harnesses**, not a game release or supported save format. Their hashes are listed separately in artifact evidence.

Managed Linux Chromium rejects direct `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Actor fault scripts can exit 0 for their HTTP functional groups while recording this explicit file limitation. Windows Chrome/Edge, other browser engines, file-origin worker IndexedDB/lock scope and low-memory hardware remain unverified for the proposed actor. Do not claim owner acceptance or substitute HTTP testing for it.

## Reproduce

See `experiments/e4-architecture/README.md` and evidence `commands-and-exits.json`. Preserve existing development dependencies; run from the repository root. Use fresh `BNT_EXPERIMENT_OUT` directories and run controlled comparisons sequentially, separate from memory/fault tests. Do not import manifests into a real career or use a live browser profile with the experimental HTML.

No production integration, database-version upgrade, migration implementation, merge, push, deployment, E5 or E6 work was performed. Stop at owner review of the proposal.
