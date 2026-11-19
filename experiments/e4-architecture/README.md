# Isolated E4 architecture experiments

These modules are not imported by `src/`, the application build, CareerStore, or production persistence. Experimental formats are not supported game save formats. Do not import them into a career. Do not use the generated diagnostic HTML with a live browser profile/career.

Run from the repository root with existing locked development dependencies. No new dependency is required. Use a fresh output directory and run benchmarks sequentially, not concurrently with tests.

```sh
BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture node experiments/e4-architecture/representation.mjs
BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture-templates node experiments/e4-architecture/template-comparison.mjs
BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture node experiments/e4-architecture/history-comparison.mjs
BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture-final node experiments/e4-architecture/browser.mjs
BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture node experiments/e4-architecture/memory.mjs
BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture node experiments/e4-architecture/faults.mjs
BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture node experiments/e4-architecture/replay-proof.mjs
BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture node experiments/e4-architecture/history-publication.mjs
BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture node --expose-gc experiments/e4-architecture/cache-memory.mjs
node --test experiments/e4-architecture/prototype.test.mjs
npm test
```

The default evidence directory is `/workspace/deliverables/e4-architecture`; override `BNT_EXPERIMENT_OUT` on another machine. `BNT_EXPERIMENT_CASE` optionally selects a browser fixture; `BNT_EXPERIMENT_FORMAT=Combat` selects an explicit Combat variant. Without an override the single-event cases use the factory’s first-event Pure format; the retained twelve-event fixture has mixed formats. Do not compare those Pure timings directly to the earlier Combat performance report. Browser diagnostics require the existing Playwright development dependency and `/usr/bin/chromium`; edit the executable path for another environment. They serve a temporary loopback page for measurement, not a runtime server requirement for the game. Output includes a self-contained experimental HTML, not a game release.

`graph-primitives.js` is an explicitly isolated copy of b8c0900 graph/LZW primitives, with inverse memoization disabled. It is not a new production codec API. `pages.js` intentionally retains the failed positional-page experiment; `templates.js` tests data templates plus exact per-snapshot alias layouts. Bounded experimental stores reject capacity exhaustion without evicting evidence; these bounds are test implementation budgets, not changes to approved game bounds.

`worker.js` uses unchanged production validators, reducers and IndexedDB transactions, but only opens `EXP-`, `MEM-` or `FAULT-` databases. Worker transfers never establish durability. Requests are serialized and writes use the existing Web Lock. It includes deliberate failure-injection commands solely for throwaway fixtures; it must never be bundled into the production application. `history.js` is a private exact-byte/binding index prototype, not an authority token or a replacement cold validator.

`memory.mjs` samples main/worker isolates with CDP and records renderer OS high-water marks. Sampling overhead makes its times unsuitable as controlled latency benchmarks; sampled isolate maxima are lower bounds. `representation`/`template-comparison` compare components, not complete production durable transactions. `history-comparison` uses a conservative generation-change fixture with identical record bytes and explicitly reports full cold validation after reset.

Refer to the proposal and evidence reports under `docs/m2-e/e4/architecture-prototypes/`. No migration or production format replacement is authorized by these experiments.
