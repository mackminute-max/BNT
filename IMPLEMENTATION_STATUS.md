# Racing prototype — current implementation status

**Current simulation: 0.4.3-combat-ai; package 0.4.3. Combat AI refinement implemented and ready for owner review. No final owner acceptance is declared.**

The existing utility AI now evaluates predicted target damage/disruption, bilateral ram recoil/control risk, racing opportunity cost, own condition and retaliation using perceived state and explicit unknown-opponent priors. It ranks legal target/action pairs while retaining personality, goals/cadence, seeded noise, Strategy Signs and authoritative outcome reporting. Weapon, autonomous favorable ram and declining combat have deterministic behavioral regressions. Physical/damage/reaction/movement/fatigue/weather/sign/retirement/wreck rules are unchanged.

Verification: **178 automated tests passed**, including 16 new combat-AI regressions. **23 retained and 7 new browser functional checks passed** through explicitly labeled HTTP diagnostics; managed direct-file navigation remains administrator-blocked. Exact browser/headless captures, replay reconstruction and unchanged-physics scope checks pass.

Matched study: 100 races/cohort/version (300 baseline +300 updated): healthy/mixed/high-risk damage retirements change 0→0 /3→18 /51→0. Updated version has 299 Ended/1 classified-but-clearance-blocked Stalled, no integrity or tool failures. No ram occurs in the ordinary 300-race sample; controlled favorable ram recognition/execution is verified without forcing. These limitations and risk redistribution require owner review, not unrelated tuning.

[Current report and evidence](docs/combat-ai-refinement/COMBAT_AI_REFINEMENT_REPORT.md). [Standalone HTML](dist/Blood_and_Thunder.html): **169883 bytes**, SHA-256 `29d3b74f0503f7a0538e7e4ee16728af82f9f5f6cb9c93bc6eacbedd28e765ac`.

Original B01–B04 corrections remain covered; [corrective-pass report](docs/audits/CORRECTIVE_PASS_0_4_2.md), original audits and [Phase 2.1 investigation](docs/phase2/dangerous-racing/README.md) remain unchanged historical evidence. Old-version configurations/replays require the archived engine; no automatic migration is claimed.

The owner verified offline launch of the old pre-corrective v0.4.1 file. That evidence does not certify this new hash. Independent direct-file verification of 0.4.3 and owner acceptance remain outstanding. No deployment, publication or push performed in this implementation pass.
