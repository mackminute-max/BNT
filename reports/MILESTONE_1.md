# Milestone 1 — Simulation Foundation

**Status: Blocked at standalone file-launch acceptance.** M1 implementation and headless checks are prepared for review. T25 has not passed, so this milestone is not declared complete. Milestone 2 has not begun. No environment draft was edited or published during implementation.

## Implemented modules and behavior

- `src/config/`: versioned validated configuration, units/ranges, centralized scalar defaults and tunable numerical weights.
- `src/core/`: deterministic keyed draws, canonical serialization/checksums; no simulation dependency on DOM, storage, frame timing, wall-clock or global randomness.
- `src/model/`: independently represented driver, beast team, chariot and equipment; beast bottlenecks, summed power, coordination/mismatch, mass/load, single-application component impairment, inspectable primary/secondary performance.
- `src/track/`: four-segment/four-lane reference oval, lane-dependent distances and radii, tiles, aligned standing grid on the approach straight, shared physical start/finish line and exit mouths.
- `src/sim/`: acceleration, braking, constant-acceleration integration, fractional arrival times, every swept tile checked, adjacent lateral sweeps, simultaneous convoy/conflict resolution, corner overspeed risk and immediate speed consequence, explicit integrity errors.
- Race administration: first crossing marks entry only, subsequent full circuits complete laps, exact official timestamps, tolerance-based ties, retirement-progress/DNS classification support, basic legal post-finish clearing with locked time.
- `src/events/`, `src/ui/`: structured events, minimal readable Canvas/standings, pause/resume/speed/step, seed/reset, derived inspection, immutable input/event record export.
- `scripts/`, `tests/`: pinned development dependencies, single-inline-script HTML packaging, eight named M1 fixtures, deterministic tests, artifact/Node parity checks and browser report.

## Temporary scaffolding and limitations

Reference drivers hold lane and brake for corner geometry. They are explicitly labeled as temporary; utility AI, perception, signs, fatigue evolution, weather presets, combat, damage, disablement/wreck creation, full replay, persistence and complete developer tooling are not implemented. These remain M2–M4 work. Format is represented in one simulator, but Combat gameplay is not yet available.

M1 contact handling enforces occupancy and blocked-forward stopping, with structured contact provenance; it is not the M3 impact/damage model. Wreck and retirement states are used by test-only adapters to verify obstruction/classification contracts, not presented as playable crash mechanics. Lane changes are boundary-time adjacent sweeps; blocked forward travel retries the following tick. Basic exit behavior does not claim M4 crowded-exit acceptance.

All provisional decisions, configurable defaults/ranges, rationale, tests and gameplay effects are recorded in `ASSUMPTIONS.md`. Future balance work must preserve the authoritative event model and avoid changing golden behavior silently.

## Executed validation

Environment: Node **24.22.1**, npm **11.9.0**, managed Chromium **156.0.8078.79**, Linux.

| Command / check | Result |
|---|---|
| `npm test` | **34 passed, 0 failed, 0 skipped** |
| `npm run build` | Passed: `dist/Blood_and_Thunder.html`, **45,758 bytes**; inline bundled script, no external runtime dependency detected |
| `npm run test:browser` | **Exit 1: blocked T25**; seven functional browser checks passed through the explicitly labeled HTTP diagnostic fallback |
| Bundled browser vs Node | Exact match of setup, commands, events, classification and checksum for seed 145 |
| Browser runtime requests | Zero additional/runtime requests, including initial document load; no page JavaScript errors |
| Browser controls | Start/pause, one-tick step, reset, run to classification, valid JSON export verified |
| Layout | 1440 px screenshots inspected; 800 px viewport has no horizontal overflow |
| Production specifications | All original numbered Markdown files unchanged |

Acceptance coverage: T01, T02, T03, T04, T05, T06, T19, T20 and T24 pass their M1 scenarios. T25 passes static packaging and browser-functional portions but its actual offline file-launch portion remains blocked. Additional foundation checks cover E01/E02, simultaneous occupancy aspects of E03, remaining-subinterval stop behavior of E04, contact identity aspects of E05, contact/finish ordering aspects of E11, E16 and E20. These do not claim the future damage/sign/replay/weather/exit acceptance cases. Browser/headless exact parity is evidence of rendering separation; full frame-rate/renderer/commentary acceptance remains subject to later UI work.

The test-browser download attempt failed because the enforced outbound allowlist denies `cdn.playwright.dev` (HTTP 403 `Domain forbidden`). The installed Chromium independently rejects the actual built `file://` URL with `ERR_BLOCKED_BY_ADMINISTRATOR`. Browser policies and network restrictions were left intact. This is an environment blocker, not evidence that file execution works or fails in an unrestricted desktop browser.

## Deterministic reference evidence

Scenario: `grid_eight`; seed **145**; default config; no commands; schema 1; simulation `0.1.0-m1`.

- Eight finishers, each three completed laps after initial line entry, all physically exited.
- Order: RU4, RU3, RU2, RU1, RU8, RU7, RU6, RU5.
- Winning official time: **123.10388936163508 s**.
- Final clock: **128.75 s**, tick **2575**, **1064** authoritative events.
- Checksum: **`4b52be5b`** in Node and the bundled browser engine.
- Maximum chronological groups in any tick: **41**, below configured 1024.
- Eight one-lap seed-batch scenarios (seeds 1..8) finished without illegal occupancy or nonfinite state. These are integrity samples, not balance approval.

Persistent summaries: `reports/milestone-1-reference.json`, `reports/milestone-1-browser.json`. Generated local diagnostics: `artifacts/seed-145-run.json`, `artifacts/m1-grid.png`, `artifacts/m1-results.png`. Run the browser script to refresh evidence; it returns failure while T25 is blocked.

## Review artifact and remaining gate

Open **`dist/Blood_and_Thunder.html`** directly in a modern desktop browser with networking disabled. It contains all runtime code, CSS and graphics; Node and adjacent files are development materials only. See `DEVELOPMENT.md` for reproduction commands and APIs.

To finish T25 here, provide a test browser permitted to open local files (`BNT_BROWSER_PATH` can select it), or allow the official Playwright download host `cdn.playwright.dev` in environment settings so its test browser can be installed. Any additional redirect destination would be diagnosed before requesting access. A real offline `file://` check must then pass; the HTTP diagnostic is not a substitute.

After that gate and owner review, M2 can replace reference drivers with autonomous utility AI and add fatigue, weather and Strategy Signs. No M2 implementation is authorized by this report.
