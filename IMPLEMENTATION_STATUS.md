# Racing prototype — current implementation status

**Current simulation: 0.5.0-courses; package 0.5.0. Circuit and Rally expansion implemented and ready for owner review. No final owner acceptance is declared.**

One authoritative engine now supports Existing Oval, Technical Circuit, Fast Circuit, Mixed-Terrain Rally and Technical Rally. Pure/Combat remains independent of course type. Shared straight/arc definitions drive simulation travel, lane geometry and Canvas. Closed courses retain common-line lap accounting; open Rally uses terminal crossing, unwrapped clearance and three fractional swept activation checkpoints. Existing Combat AI refinement, component systems, damage/fatigue, signs, wrecks, developer tuning/configuration and replay remain integrated.

Verification: **203 tests passed**, retaining all 178 baseline cases plus 25 new course regressions. **80/80 final smoke races Ended, 640/640 finishers**, 20 races per new preset (10 Pure/10 Combat, five weathers), with no stalls, integrity failures, bounds/tool errors or invalidated attacks. Healthy/default drivers selected no offense in the smoke panel; positive-value Combat rams resolve on every new geometry in focused tests. No balance conclusion is implied.

**Four saved oval references retain exact full serialized events, RNG and classification. Seventeen exported replays reconstruct exactly.** Thirty browser functional checks pass (23 retained +7 new-format) with exact browser/Node parity. Managed direct-file navigation remains administrator-blocked; HTTP diagnostics do not independently establish offline double-click operation of this build.

[Implementation report and evidence](docs/circuit-rally/CIRCUIT_AND_RALLY_IMPLEMENTATION_REPORT.md). [Current standalone HTML](dist/Blood_and_Thunder.html): **190874 bytes**, SHA-256 `e39a60395e5346890fc41a2d80688640ec07bef90cc01ee5f2ae7dcd0e7e6177`.

Configuration is versioned 0.5.0; latest 0.4.3 oval configurations explicitly import. Old replays retain their original engine version/source archive; no silent checksum migration. Historical audits, corrective reports and Phase2/Combat AI evidence remain unchanged. Original B01–B04 fixes and Combat AI regressions remain covered.

Known limits: four lanes, piecewise straight/circular-arc tracks, static geometry/weather, short course preview, bounded custom geometry/numerical behavior, and existing explicit wreck-blocked clearance. Independent file launch and owner acceptance of the new hash remain outstanding. No stable management, progression, new physics/actions/signs, deployment, publication or push in this pass.
