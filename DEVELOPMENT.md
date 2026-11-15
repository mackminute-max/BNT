# Blood and Thunder — racing prototype development

The numbered production specifications remain authoritative. Current version `0.4.2-corrective` is maintenance of B01–B04 within the approved racing prototype, not a new milestone. Stable economy, campaigns and persistent roster progression remain outside this prototype. The owner confirms offline operation of the pre-corrective 0.4.1 file; managed direct-file navigation remains policy-blocked, and the new artifact requires its own local confirmation. See `IMPLEMENTATION_STATUS.md` and `docs/audits/CORRECTIVE_PASS_0_4_2.md`.

## Build and validate

Use the existing `/workspace/BNT` checkout; no additional worktree is needed. Node 24.22.1 and npm 11.9.0 were used.

```sh
npm ci --cache /workspace/.npm-cache
npm test
npm run build
npm run test:browser
npm run reference
```

`npm run check` combines tests, build and browser checks. `npm run test:browser` intentionally returns nonzero while mandatory direct-file acceptance is blocked, even when functional HTTP-fallback checks pass. `npm run reference` verifies the reference replays and runs seeds 1..8 in both formats, writing reports and a sample replay. It returns nonzero for an integrity error in those batches.

The only npm packages are development dependencies: esbuild bundles the source; playwright-core drives verification. Lockfile versions/integrity metadata are retained. Neither package is a distributed runtime dependency.

## Play and review

Copy only `dist/Blood_and_Thunder.html` and open it directly in a modern desktop browser with networking disabled. The file embeds JavaScript, CSS and Canvas graphics; no server, Node installation or adjacent files are runtime requirements. Actual direct-file execution has not been verified in this environment because of browser policy.

Choose seed, weather and format, then **New race**. Start/Pause, playback speed and one-tick Step are beside the viewer. Strategy Signs queue or replace instructions; Pending and Active remain separate. Queue/replacement consumes a use, cancellation does not refund, and lowering is free. No direct steering or attack controls are provided. Retired player entries remain visible as wrecks while the race continues.

Trackside radio reads authoritative events. Results offer official classification, race narrative and technical outcomes. **Run to classification** advances asynchronously; Pause can stop it. Replay/results/configuration exports are user-initiated JSON files.

For a high-damage review scenario, choose seed 145, Clear, Pure, impact damage scale `1`, default other settings, then create/run the race. This deliberately elevated test setting exercises persistent wrecks and DNF handling, not recommended final balance. Default physical damage scale is `0.003`. Combat plus a pre-race Engage Rivals sign exercises legal autonomous offensive decisions. Random incidents need not occur every race; increase incident rate or use a scheduled test scenario to inspect them.

## Developer tools

Open the developer section below the viewer. Component editing supports driver, personality, chariot, equipment, each beast and `beasts.*`. Bulk scope applies to every RU possessing the selected component. Individual component attributes, conditions, fatigue, strain, wear and supported equipment effects are editable. `all` is reserved as the bulk-scope RU identifier.

Parameter groups cover physics/track/administration, derived-model coefficients, AI/signs/fatigue, utility weights, weather modifiers and combat/damage/incidents/control. Segment surfaces have separate new-race controls. The complete versioned JSON editor supports entrant count/team size/lineup, player ID, geometry and all supported coefficients. Schema/range failures preserve the existing valid race. Unknown component attributes are rejected rather than displayed as inactive stats.

New-race edits rebuild from validated configuration. Supported live numeric edits require Pause at a resolved tick boundary, queue without immediately changing physical state, and apply at the next Step/Resume boundary. Structural geometry, clock/lap/exit layout and sign allowance require a new race. Normalized model weight groups must remain valid together; use complete configuration JSON for coordinated multi-field structural/group edits. A live healing edit never removes or reanimates an existing wreck.

Use **Capture current components & tuning** before saving if you want current damage/condition values and applied live tuning copied into a new scenario. Ordinary Save saves the configuration editor, not an implicit snapshot of a running race. Local storage is optional; failed/blocked writes leave the in-memory race and portable exports available. Load/import/reset are explicit actions.

Batch analysis accepts comma-separated seeds or ranges, up to 1000 requested samples. It uses the same simulator, yields between 100-tick chunks, supports cancellation, and retains completed samples. Reports include winner distributions (official ties may count multiple winners), finishes, DNFs, overtakes, collisions, attacks, defenses, damage, wrecks, incidents, duration, fatigue at finish and sign compliance. These are evidence, not approved balance targets.

## Replay

**Export replay & evidence** records version/schema, immutable initial setup and RNG state, ordered commands, live overrides, full authoritative events, periodic/final checksums and the captured endpoint. Import validates by reconstructing the race and comparing events/checkpoints. Corruption reports the first divergence; there is no event-only fallback. Replay playback re-runs that engine, with Pause/Speed/Step/Restart; gameplay/developer edits are disabled during playback.

The JSON replay schema is version 1 and simulation-version-specific. Earlier milestone/pre-release records are not automatically migrated. Partial captures preserve paused final sign commands and pending override transport without inventing extra ticks. Checkpoint interval defaults to 100 ticks and is configurable for new races (1..10000). Checksum hashes are diagnostics, not cryptographic authentication; full event comparison is also performed.

A sample current replay is generated at `reports/seed-145-replay.json`. To verify headlessly:

```sh
node --input-type=module - <<'JS'
import { readFile } from 'node:fs/promises';
import { verifyReplay } from './src/replay/replay.js';
const record = JSON.parse(await readFile('reports/seed-145-replay.json', 'utf8'));
console.log(verifyReplay(record).checksum);
JS
```

## Architecture

- `src/config/`, `src/model/`, `src/track/`: versioned configuration, component/derived models, shared lane geometry.
- `src/core/`, `src/events/`: deterministic keyed draws, canonical checksums, copied structured events.
- `src/sim/`: fixed-step chronological engine, analytic kinematics/braking envelopes, combat/impacts/control/wrecks/incidents, race/exit administration.
- `src/ai/`: filtered perception, utilities/personality/errors, sign preferences/accounting.
- `src/dev/`: validated component/configuration/live-edit commands and async batches.
- `src/replay/`: authoritative reconstruction and first-divergence verification.
- `src/reporting/`: read-only commentary, technical statistics and results.
- `src/ui/`: Canvas/HTML viewer, fixed-tick presentation scheduler and developer workbench.
- `tests/`: named fixtures and deterministic unit/integration/edge regressions.
- `scripts/`: build, browser tests and reproducible reference evidence.

`createRace(options)` validates setup; `step(state, commands)` mutates only engine-owned state; `run` uses the same path headlessly. `issueSign` acts at a resolved boundary without advancing time. `queueOverride(state, edit, {paused:true})` validates transport and queues a change. The engine also guards unresolved subevents. UI clock/pausing is presentation state, not an authoritative wall-clock input.

`driverMode:'reference'` and `consequences:false` are explicit controlled-test options, not application defaults. M1 movement-only fixtures use both to retain their isolated contract. M2/M3/M4 integration checks enable the full current mechanics. Internal pace/lane/attack commands are test/AI inputs, not player controls.

## Browser verification limitation

The runner first attempts the actual built HTML under `file://` with networking disabled. Installed managed Chromium rejects it with `ERR_BLOCKED_BY_ADMINISTRATOR`. The runner then performs explicitly labeled HTTP diagnostic checks and goes offline after the initial document load. All temporary browsers/servers close afterward. Zero runtime requests/errors and Node parity are verified, but this does not satisfy T25.

`BNT_BROWSER_PATH` can select an installed test browser permitted to open files. Installing the official Playwright test browser previously failed because outbound policy denied `cdn.playwright.dev`. Browser/network policies have not been bypassed or modified. A permitted browser or an independent desktop offline launch is needed to complete release acceptance. No environment draft was edited or published during these implementation milestones.


## M4 audit remediation and reusable scenarios

See `reports/MILESTONE_4_UPDATE.md` for the 0.4.1-m4 evidence. `tests/fixtures.js` exports all twenty named `fixtureDefinitions`, plus `fixtureCatalog` metadata with version, seed, normalized setup, opening commands and expected invariants. Use `scenario(name)` to construct an independent full-consequence race from that snapshot. `fixture(name, changes)` retains the earlier reference-driver, consequences-off helper for isolated foundation tests; these modes are intentional and distinct.

Apply the catalog's `openingCommands` with `step`. Sign replacement, retirement and live-override workflows are demonstrated in `tests/audit-regressions.test.js`; expected invariants are asserted there and in existing focused tests. The Sprint scenario uses an explicit autonomous Sprint bias so it exercises condition integration. Disabling component conditions are part of setup, not unlogged live fixture mutation.

Use `BNT_REPORT_TAG=milestone-4-update npm run reference` to write separate update reference/replay files without overwriting the original evidence. Run `node docs/audits/evidence/reproduce-findings.mjs` to inspect the original counterexamples against the current source; all three should now report `reproduced: false`. Preserve the original audit output as historical evidence. Replays are simulation-version-specific; 0.4.0-m4 records intentionally do not replay under 0.4.1-m4.


## Corrective pass — 0.4.2

`tests/corrective.test.js` contains 30 focused regressions; `npm test` runs these alongside all 114 retained tests. `scripts/browser-test.mjs` adds four corrective UI checks while retaining its explicit blocked `file://` result and labeled HTTP fallback. Use `BNT_REPORT_TAG=corrective-0.4.2 npm run reference` for separate reference/replay output; previous reports are historical and remain untouched.

AI diagnostics distinguish `intended`, `effective`, `executed` and `physicalOutcome`. AI_DECISION is an immutable snapshot with a decisionId; subsequent AI_EXECUTION_RESULT references that ID. Pending positional compliance is unresolved (null) until the physical outcome. Pace application is distinct from movement achievement: an unrelated lateral failure leaves an applied pace sign intact; forward blockage/control loss records a relevant constraint. Offensive actions resolved by a contest count as attempted engagement even when defended. Raw test commands without a decision link do not rewrite previous autonomous samples. Paused signs record phase=paused, so replay restores them before boundary retirement/condition events.

Surface hazardModifier is dimensionless, default 1, accepted 0..2. It weights each eligible placement tile on that segment; 0 excludes the segment, including scheduled requests. Random incident frequency/type weights stay unchanged, and no extra RNG draws are added. Nonzero scheduled requests retain their explicit placement. A zero random incidentRate still allows explicitly scheduled test requests, as before; consequences=false disables all incidents. Surface changes require a new setup through the existing surface editor/JSON; no structural live-edit workflow is added.

At the qualifying finish crossing, finishSnapshot stores the unrounded time and each beast's fatigue. It is deeply frozen and nonreplaceable in engine state, present in the RU_FINISHED event/checksums/replay, and copied into results export. Current mutable fatigue remains separate. Historical fatigueAtFinish averages finishSnapshot beasts, never later component values.

The finish_photo setup uses a fixture-only outer-lane rollingEfficiency of 57.34996687475359 and no random incidents to produce a roughly 0.0005 s gap within the unchanged 0.001 s tolerance. Both entrants start stationary and complete the physical common-line lap. No timestamp/lap/position injection is involved. Tightening tolerance changes classification without altering finish times.

The simulation/package version advances to 0.4.2-corrective / 0.4.2 because event/state/paused-command metadata change. Schema remains 1; configuration and replay records are version-specific. Validate/regenerate older setup payloads for the new engine rather than changing a replay version string or silently migrating history.

## Combat AI refinement 0.4.3

See [report and reproducible comparison](docs/combat-ai-refinement/COMBAT_AI_REFINEMENT_REPORT.md) and [dataset guide](docs/combat-ai-refinement/README.md). `npm test` retains all prior cases and adds combat-decision tests. `npm run build` creates the standalone; `npm run test:browser` retains a blocked/nonzero result when managed policy denies direct file navigation, even when HTTP functional tests pass. `node scripts/combat-ai-refinement/browser.mjs` adds five tactical parity and editor/dependency checks with the same policy distinction.

Historical Phase2/2.1 verification references belong to 0.4.2-corrective. Reconstruct them with their archived engine/source rather than replacing references or expecting new AI checksums to match. The current pass archives executable 0.4.2 at `docs/combat-ai-refinement/baseline/source.tar.gz`. New replays/configurations use 0.4.3-combat-ai with explicit version validation.

## Circuit and Rally formats — 0.5.0

[Implementation report](docs/circuit-rally/CIRCUIT_AND_RALLY_IMPLEMENTATION_REPORT.md) and [reproduction/data guide](docs/circuit-rally/README.md). Main controls select course kind, preset and closed-course laps; Rally disables laps and shows course percentage plus next sign checkpoint. Developer configuration JSON exposes segments/curvature/surfaces/checkpoints; invalid definitions preserve the valid race.

`npm test` runs all 203 cases; `node scripts/circuit-rally/smoke.mjs` executes the 80-race new-preset campaign, `summarize.mjs` summarizes it, and `verify.mjs` compares old oval references and reconstructs saved files in isolated bounded-memory workers. Build before `node scripts/circuit-rally/browser.mjs`. The existing browser campaign and new preset campaign both explicitly disclose blocked managed file navigation versus HTTP functional checks.

Direct `createRace({course:'mixed-rally', format:'Combat'})` uses the shared engine; omit course for legacy Oval. New track defaults are bundled into the standalone, never fetched. Old0.4.3 source/artifact is archived in `docs/circuit-rally/baseline/source.tar.gz` for historical replay reconstruction. No old checksum/reference should be overwritten to disguise an intentional version change.
