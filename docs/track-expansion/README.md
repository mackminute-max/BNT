# Track system expansion — 0.6.0-tracks

Start with [implementation and test report](TRACK_SYSTEM_EXPANSION_REPORT.md) and [player instructions](USER_TESTING_INSTRUCTIONS.md). The playable file is [Blood-and-Thunder-Track-Test.html](../../dist/Blood-and-Thunder-Track-Test.html).

## Reproduce development verification

From the repository root with the locked development dependencies installed:

```sh
npm test
node scripts/track-expansion/validate.mjs
node scripts/track-expansion/smoke.mjs
node scripts/track-expansion/replays.mjs
npm run build
node scripts/track-expansion/browser.mjs
npm run test:browser
```

Run memory-heavy race/replay and browser workloads sequentially. Validation covers all fifteen fixed tracks and default generation seeds 1–100 in each length category. Smoke jobs use thirty fixed races (one Pure and one Combat per track) and thirty generated races (ten/category), balanced over five weather presets. `race-jobs.json` stores complete inputs; `race-results.json` includes resolved configurations, official results, state/event checksums, conditions and integrity/clearance status. Both smoke execution and replay verification have per-job wall limits; races have a 30,000-tick bound in addition to existing race administration limits. Three workers report progress; no unbounded execution is introduced.

`validated-routes.json.gz` stores all 300 tested route definitions. Thirty-six `.replay.json.gz` records preserve both formats for every fixed track and two races per Rally category. `replays.json` records exact event/checkpoint/final-checksum reconstruction plus per-tick finite/lane/monotonic-position checks. Original engine occupancy and wreck-integrity checks remain active on every race tick.

Baseline `source.tar.gz`, revision, previous standalone hash and test log are preserved under `baseline/`. To reproduce the three old/new event and classification comparisons:

```sh
mkdir -p /tmp/bnt-track-baseline
tar -xzf docs/track-expansion/baseline/source.tar.gz -C /tmp/bnt-track-baseline
node scripts/track-expansion/parity.mjs
```

Versioned capture hashes differ intentionally; baseline comparisons require exact full event streams, RNG states and classifications. Historical replay files remain version-specific and must use their original engine/archive. Latest 0.5.0 configurations import explicitly, retaining their actual geometry.

Browser evidence distinguishes functional success from blocked direct-file acceptance. The existing browser command intentionally exits nonzero when policy prevents direct-file testing, even if all functional checks pass. Nothing here changes that rule. Checksums are in `FILES.sha256`; historical audits and studies were not rewritten.
