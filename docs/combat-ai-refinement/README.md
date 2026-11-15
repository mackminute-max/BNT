# Combat AI refinement — 0.4.3

Start with [COMBAT_AI_REFINEMENT_REPORT.md](COMBAT_AI_REFINEMENT_REPORT.md). The updated standalone is [../../dist/Blood_and_Thunder.html](../../dist/Blood_and_Thunder.html).

This directory preserves the executable 0.4.2 baseline, matched 300-vs-300 full-race inputs/results, coefficients, new regression/browser/replay evidence and development failures. Historical Phase2/2.1 reports remain unchanged. Implementation is limited to AI utility/target selection and versioning; physical rules and signs remain unchanged.

## Inputs and data

- `baseline/source.tar.gz`: committed 0.4.2 source, tests, tools, packages and prior HTML at revision 091445def6f0c63b79fbcf130019a21545d0bf73. Archive SHA256 is in FILES.sha256; original artifact hash/revision/test log are beside it.
- `baseline/races/`, `current/`: 300 records each. `jobs.json.gz` stores full raw setups/seeds/rosters/strata, exactly identical between versions. `configurations.json.gz` stores normalized full setup/defaults per version, keyed by configId. `races.jsonl.gz` stores official results, all eight RU measurements, fatigue/condition/strain/wear, overtakes/lanes, decisions/intended/effective/physical outcomes, complete attack contests, candidate examples, RNG and complete-event SHA256/checksum. The inherited sampled-speed/lane-time and reaction-threshold caveats from Phase2 remain applicable. No approximation feeds authoritative state.
- `comparison.json`: cohort summaries/descriptive moments/percentiles/seed-cluster bootstrap intervals; matched same-entrant finish-time contrasts and explicit status transitions; entry-level damage dealt/received and place/time/fatigue before/after. Nonfinish times stay null.
- `current/races.csv`: flat updated race metrics; `entry-comparison.csv`: 2400 paired entries, including weapon damage inflicted (linked actual attack IDs), total component damage received, full-precision times/place and individual finish fatigue. No natural ram occurs in either cohort panel, so inflicted combat damage here is weapon damage; bilateral ram attribution is demonstrated in diagnostic replays rather than invented in the CSV.
- `coefficients.json`: 14 configurable provisional utility values/priors, validated 0..100.
- `evidence/*.replay.json.gz`: 9 real version-specific records, five controlled behaviors plus four selected complete-study races including the clearance stall.
- `evidence/verification.json`: 14 executed parity/replay/data/scope checks, standalone bytes/hash.
- `evidence/tests.log`: 178 passing tests; `baseline/tests.log`: 162 before changes; `focused-tests.log`: 16 passing cases. `adversarial-initial.log` retains the real initial recoil-risk failure.
- `evidence/browser-report.json`: 23 retained functional checks and exact current artifact browser/headless parity; `combat-browser.json`: 7 new checks, including five tactical complete captures, existing developer-editor exposure and no extra requests/errors. Both clearly label managed direct-file blocking and HTTP fallback.
- `development/`:initial 300-race development pass and its exact prerelease source snapshot, plus browser fixture/comparator/visibility failures. Excluded from final 300-vs-300 comparison; initial 0.4.3 records require that particular initial source, not the final candidate. Not additional independent validation.

Seed units: 20 per cohort, repeated across five weathers and shared across cohorts/versions. Eight entrants per race are correlated ; 2400 entries are not independent trials. Surface/traffic/equipment profiles are inherited fixed strata, not exhaustive/randomized factorials. Time CIs use complete same-entrant pairs, averaged within race and bootstrapped by seed. Fatigue/time of finishers are survivor-conditional. Total noncombat decision counts include repeated strategic/tactical evaluations, not distinct situations. Race duration includes physical clearance/safeguard wait. Preserve Stalled status and retirement causes when reanalyzing.

## Reproduce

Run from repository root. These commands intentionally reproduce the new report directory; copy the delivered evidence first or choose another `--out` for race runs. Analysis/report scripts read their documented paths.

```sh
mkdir -p /tmp/bnt-combat-refinement-baseline
tar -xzf docs/combat-ai-refinement/baseline/source.tar.gz -C /tmp/bnt-combat-refinement-baseline
node scripts/combat-ai-refinement/run.mjs --engine /tmp/bnt-combat-refinement-baseline --out /tmp/old-combat-comparison
node scripts/combat-ai-refinement/run.mjs --out /tmp/new-combat-comparison
npm test
npm run build
npm run test:browser
node scripts/combat-ai-refinement/browser.mjs
node scripts/combat-ai-refinement/analyze.mjs
node scripts/combat-ai-refinement/verify.mjs
node scripts/combat-ai-refinement/read-replays.mjs
python3 scripts/combat-ai-refinement/report.py
sha256sum -c docs/combat-ai-refinement/FILES.sha256
```

The runner has four workers, 30000-tick race and 180s worker bounds. SIGINT/SIGTERM stops new dispatch and exports completed rows as incomplete/nonzero; no cancellation was needed in delivered runs. Final baseline/current wall times were 163.42/181.51 seconds on this host, with other checks overlapping. These are not comparable clean-host performance benchmarks. Completion order/wallSeconds are nondeterministic; compare by job ID, exact configuration and seed. Current observed/unobserved full state/events/RNG match. The report generator's coefficient metadata comes from the delivered coefficients.json and current source defaults.

Old configurations/replays use their engine version. 0.4.3 deliberately rejects 0.4.2 records rather than silently migrating checksums. No script requires new runtime assets, frameworks, network dependencies or a server for end-user execution. The browser's HTTP diagnostic server is only a test fallback, never a deliverable dependency. Managed file navigation remains blocked; independent offline launch of the updated HTML remains unverified.
