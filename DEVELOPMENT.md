# Blood and Thunder — racing prototype development

The numbered production specifications remain authoritative. Version `0.4.1-m4` implements the four racing-prototype milestones. Stable economy, campaigns and persistent roster progression remain outside this prototype. Final offline file-launch acceptance is still blocked by the managed test browser; see `IMPLEMENTATION_STATUS.md`.

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
