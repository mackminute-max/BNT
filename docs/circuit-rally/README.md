# Circuit and Rally expansion — 0.5.0

[Implementation report](CIRCUIT_AND_RALLY_IMPLEMENTATION_REPORT.md) · [Standalone HTML](../../dist/Blood_and_Thunder.html) · [Execution plan](PLAN.md) · [Smoke results](evidence/smoke-summary.json) · [Verification](evidence/verification.json)

The single simulator supports Existing Oval, two closed circuits and two point-to-point rallies. Pure/Combat is independent of course type. New course JSON and terrain defaults live in `src/track/course.js`; the original oval remains the default adapter.

Delivered evidence:

- `baseline/`: original revision/source archive/HTML hash, 178-test log, four old oval reference recordings and official/RNG results.
- `evidence/tests.log`: final 203 passing tests, retaining all prior cases; `focused-tests.log` is an earlier focused run, with all current cases covered by the final full log.
- `evidence/smoke-jobs.json`, `smoke-results.json`, `smoke-summary.json`: exact 80-job inputs, full per-race/per-RU outcomes/condition/fatigue, seed/version/checksum/event hash/RNG and summaries. All 640 entrants finish; no stalls/errors/invalidated offense. Ten Pure/ten Combat per preset, all five weather presets. Shared seeds are smoke coverage, not independent balance-study units.
- `evidence/*.replay.json.gz`: 17 real current captures, validated by file readback in isolated workers. Four rebuilt oval, eight campaign, five UI representations. Baseline old-version recordings remain separately under baseline/.
- `evidence/browser-report.json`: 23 retained functional checks; `course-browser.json`: 7 additional new-format checks. File navigation is administrator-blocked; HTTP diagnostics are expressly labeled. No new independent offline verification is claimed.
- `evidence/*-grid.png`, `*-results.png`: actual browser UI images for all five presets.
- `development/`: initial implementation notes, pre-final-context test log, excluded initial smoke results and verification memory-limit explanation. No historical audit is overwritten.
- `FILES.sha256`: byte manifest for final sources/tools/tests/artifact/docs/evidence, except the manifest itself.

## Reproduce

Run from repository root, preserving delivered outputs before regeneration:

```sh
npm test
node scripts/circuit-rally/smoke.mjs
node scripts/circuit-rally/summarize.mjs
npm run build
npm run test:browser
node scripts/circuit-rally/browser.mjs
node scripts/circuit-rally/verify.mjs
python3 scripts/circuit-rally/report.py
sha256sum -c docs/circuit-rally/FILES.sha256
```

The smoke runner uses four workers, a 30000-tick engine bound and 180s worker watchdog. Progress is logged every 10 races; no bound/cancellation was reached. Replay verification isolates each record in a sequential 1024MiB V8 child with 180s timeout to bound memory. Wall time is host/tooling-specific; compare individual event hashes/checksums by ID, not completion order.

The old executable baseline is available in `baseline/source.tar.gz`; extract into a separate directory to reconstruct 0.4.3 recordings. Current captures/configurations are 0.5.0-specific. Latest old **oval configurations** import explicitly; no old replay checksum is silently rewritten. Editor JSON accepts custom validated ordered courses; Rally checkpoint distance is reference-lane metres, not a lane-independent physical travel measurement. Occupancy/finish progress uses shared longitudinal cells; actual travel lengths remain lane-specific.

No deployment, publication, remote push or owner acceptance is implied.
