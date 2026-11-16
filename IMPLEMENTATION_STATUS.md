# Current implementation status — M0/M1 persistence foundation

**Racing simulation remains `0.6.0-tracks`; career/envelope schema 1 added. M1 foundation implemented and functionally verified. M0 actual direct-file acceptance remains blocked by managed-browser policy. No final owner acceptance is declared.**

The existing vanilla JS/Canvas racing prototype, three ovals, twelve circuits, procedural Rally, tuning, commentary, signs and deterministic replay remain intact. Racing/AI/config/track/model/reporting/replay source is unchanged. M1 adds a separate empty profile/career state, automatic browser checkpoints, explicit recovery/import replacement, complete persistent JSON export, manual-save checkpoint gating, strict transaction validation and persistent developer-edit provenance. It does not add M2 assets, assembly, economy rewards or championship gameplay.

Verification: baseline **212 tests passed**; final **237 passed, 0 failed**, including 25 focused persistence tests. **18 new browser groups and 23 retained functional checks pass**, including storage write/read/reload, copied export/import, explicit recovery, fault-injected denial/quota failure, stale-window rejection and existing exact bundled/Node race parity. Both browser runners return nonzero for the separately reported administrator-blocked file launch. HTTP diagnostic storage tests are not file-origin verification.

[Implementation report](docs/persistence-foundation/M0_M1_IMPLEMENTATION_REPORT.md) · [Windows testing](docs/persistence-foundation/WINDOWS_TESTING.md) · [APIs/evidence](docs/persistence-foundation/README.md).

[Current standalone HTML](dist/Blood_and_Thunder.html) and `dist/Blood-and-Thunder-Track-Test.html` are identical: **237205 bytes**, SHA-256 `e35c4b47647433ce62e1748012ec9c39ca9730012bc667a382f2fdb21cfc1e6c`. Download requests/explicit manual acknowledgement do not prove durable file saving. Prior owner-confirmed offline operation concerns an earlier artifact; this hash still requires Windows direct-file/storage confirmation.

Known limits: single-writer operation without Web Locks, browser/path-specific localStorage, diagnostic rather than cryptographic checksums, bounded save/history sizes, no migration of unknown future schemas, no detection of later edits absent from a wholly older file in a fresh browser. Owner Legacy is never merged. Complete game-save export excludes current race ticks/events; optional pending starting data is not yet connected to a career race bridge.

[Previous track implementation/evidence](docs/track-expansion/TRACK_SYSTEM_EXPANSION_REPORT.md) and [architecture audit](docs/Blood-and-Thunder-Architecture-Audit.md) remain historical records at their stated versions/checksums. No unrelated balance change, M2 milestone, deployment, publication, commit or push in this pass.
