# Racing prototype — corrective maintenance status

**Current simulation: 0.4.2-corrective; package 0.4.2. B01–B04 corrected and ready for owner review. No final owner acceptance is declared.**

- B01: decision-linked intended/effective/physical outcomes and sign-relevant compliance replace generic failure reporting; paused sign replay preserves event ordering.
- B02: validated segment hazardModifier (neutral 1, range 0..2) weights incident placement without changing global frequency; developer tuning/configuration/replay preserve it.
- B03: immutable per-beast fatigue snapshots are captured at the actual finish crossing and used for historical statistics; live overrides and physical clearance remain supported.
- B04: the named standing-start photo fixture now yields an actual official tie under the unchanged production tolerance, with full-run assertions.

Verification: **144 tests passed**, including **30 corrective regressions**; **23 functional managed-browser checks**, including corrective UI flows and exact browser/headless parity. The rebuilt HTML is **163,579 bytes**, SHA-256 `30cea713001b2e1dfdc0b818605161ba5951d15a44e4b87b2210493451354002`.

**Offline evidence is separated:** the owner confirms direct offline operation of the prior v0.4.1 standalone file. Managed Chromium still blocks file navigation, so its HTTP diagnostics are not direct-file verification. The newly rebuilt 0.4.2 file awaits independent local-file confirmation and owner acceptance; the baseline confirmation is not misrepresented as testing this new hash.

See the [corrective-pass report](docs/audits/CORRECTIVE_PASS_0_4_2.md), [current standalone HTML](dist/Blood_and_Thunder.html), and accompanying evidence. Previous audits and milestone reports remain unchanged historical records. Configuration/replay records are version-specific and must be regenerated/validated for the corrected engine.

This is maintenance within the approved scope, not a new milestone. No publication, deployment or remote push was performed.
