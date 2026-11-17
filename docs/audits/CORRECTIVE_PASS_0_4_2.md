# Blood and Thunder — v0.4.1 corrective pass

**Output version: 0.4.2-corrective (package 0.4.2). Status: corrections complete and ready for owner review; final owner acceptance is not declared.** This is maintenance of B01–B04, not a new milestone. No publication, deployment or remote push was performed.

## Baseline and authority

Read the ten establishment documents in the prescribed order, the two historical audits and their evidence, then the implementation/tests for B01–B04. The owner's current instructions authorize these corrections and take precedence over historical reporting. The working tree was clean at commit `2ce102181a33028c9497d3e365b389a48218226c` before changes.

Baseline: simulation 0.4.1-m4, package 0.4.1, 114 tests passed, development build command `npm run build`. Baseline standalone artifact was 158,915 bytes, SHA-256 `5180387f5cb623e5ae920d8e307a9fd0244b61fb7a6580f0f44c1649dbf23e1d`. Historical reports, audit scripts/logs and numbered production documents remain unchanged.

The owner confirms that the pre-corrective standalone HTML launches and operates offline on their local computer. This is **owner-verified offline operation**, not managed-browser verification. The owner did not supply a browser version or independently attested artifact hash. That confirmation is retained as [owner evidence](corrective-0.4.2-evidence/owner-offline-confirmation.json); it is not automatically extended to the newly rebuilt artifact or treated as final acceptance.

## B01 — action outcomes and sign compliance: corrected

**Defect/root cause:** generic lane/combat failure handlers overwrote sign compliance even when the failed action was unrelated to the instruction. Diagnostics labeled a selected positional intention as executed before physics resolved it. Technical statistics associated execution updates with the latest RU sample rather than an explicit decision identity.

**Changed:** `src/ai/telemetry.js` (new), `src/ai/driver.js`, `src/sim/race.js`, `src/sim/consequences.js`, `src/reporting/results.js`, `src/replay/replay.js`.

**Correction:** preserve intended candidate, effective issued action, and authoritative physical outcome separately. AI decisions carry a stable event/decision ID and the sign evaluated at that decision. Pending positional actions have no executed position. Lane and combat resolution emit linked execution results and update only their matching decision. Unrelated rejected positioning cannot invalidate an applied Push/Conserve pace; a blocked forward path or control loss is recorded as a relevant physical constraint. A valid contested attack remains an executed engagement even if defended. Invalidated attacks are unexecuted. Reports/batch summaries consume the linked final compliance, without mutating historical events or forcing obedience.

A pending positional compliance has no category until resolved; the existing five categories remain unchanged. The UI reads the same diagnostics as reporting; commentary continues to use physical events and does not infer successful maneuvers from intentions.

**Replay correction discovered by regression:** paused signs now record an explicit paused phase. During reconstruction, those commands apply before boundary retirement/condition events, matching their original timing. Raw boundary commands retain their existing phase. This fixes the B01 replay case involving a queued sign and an initially disabled obstruction.

**Regression coverage:** both formats; successful/failed lane moves; hidden hazards; unrelated pace compliance; relevant positional prevention; yield overrides; blocked forward movement; control loss; contested/invalidated combat; simultaneous lane claims/permutation; immutable decision events; interleaved execution links; technical and batch aggregation; authoritative replay.

## B02 — segment hazard modifier: corrected

**Defect/root cause:** the surface schema/editor only supported grip, roughness and rolling resistance; incident placement ignored any surface hazard coefficient.

**Changed:** `src/track/oval.js`, `src/sim/race.js`, `src/sim/incidents.js`, `src/ui/index.html`. Existing generic configuration, export/import and replay snapshot paths carry the new validated field.

**Correction/defaults:** per-segment `hazardModifier`, neutral **1**, provisional validated range **0..2**, dimensionless. The existing race-wide incident clock and type weights are unchanged. Each otherwise eligible placement cell has its segment's weight; a single existing seeded placement draw selects proportionally to those weights. Neutral weights reproduce uniform baseline placement and RNG consumption. A zero-weight segment is ineligible, including for explicitly scheduled requests. Nonzero scheduled requests retain their explicit tile rather than receiving probabilistic relocation.

Disabled consequences still disable all incidents. `incidentRate=0` still disables random generation; existing explicitly scheduled test incidents remain supported with a zero random rate, subject to placement eligibility. Increasing all segment weights equally does not increase the global frequency; the modifier changes relative placement probability, not that clock. No unrelated incident frequency or balance value changed.

The developer surface selector exposes the modifier and explains its neutral value, exclusion behavior and relation to frequency. Validation precedes replacement of the live setup, and serialization/import/export/replay preserve it.

**Regression coverage:** neutral vs default state/events/RNG parity; increased/decreased relative placement over fixed seeds in both formats; disabled consequences; zero random rate; zero-weight eligibility; nonneutral configuration round-trip and replay; invalid number/range/field/segment rejection and preserved valid configuration; browser tuning and rejection flow.

## B03 — historical fatigue at finish: corrected

**Defect/root cause:** fatigueAtFinish read mutable current beast fatigue for any finisher instead of a measurement taken at the finish event.

**Changed:** `src/sim/race.js`, `src/reporting/results.js`.

**Correction:** the qualifying common-line crossing captures a deeply frozen, nonreplaceable `finishSnapshot` containing the full-precision time and indexed individual-beast fatigue. It is part of authoritative entrant/checksum state and the immutable RU_FINISHED event. Results export a separate copy of the historical snapshot and continue exposing current editable fatigue separately. Technical/batch fatigueAtFinish uses historical snapshots. Live component overrides remain permitted, and physical clearance/result timing rules are unchanged.

**Regression coverage:** both formats; snapshot captured at actual finish; deep immutability; paused post-finish fatigue override; stable historical average; continuing clearance; unchanged official time; per-beast data in results export; partial and full authoritative replay; exported-copy isolation; actual batch measurements agree with reconstructed single races.

## B04 — named photo-finish fixture: corrected

**Defect/root cause:** the named fixture had equal teams in unequal-length lanes and no setup adjustment to create a close finish; its metadata smoke test did not assert the final tie.

**Changed:** `tests/fixtures.js`, `tests/corrective.test.js` (new). No production tie, movement or lap rule changed.

**Correction:** both entrants still start stationary behind the common line, enter lap one and complete a full circuit. The outer-lane fixture chariot has an explicit rollingEfficiency of **57.34996687475359**, compensating its longer physical path in this controlled reference-driver scenario. Random incidents are disabled for the fixture. The unrounded times are about **41.55574026407952** and **41.5562402640749** seconds, separated by **0.0004999999953838596 s**, inside the unchanged production tolerance of **0.001 s**.

This is fixture-specific calibration, not a global balance adjustment or hardcoded finish. A tighter configured tolerance of 0.0001 correctly yields distinct places without changing crossing timestamps. No progress, lap, timestamp or finish status is injected into the fixture.

**Regression coverage:** full runs in both formats; actual same-place classification; full precision; stationary start/initial entry/full-lap accounting; physical clearance; independent entrant permutations; exact deterministic replay; tighter tolerance preserves distinct timing/classification. Existing rear-row and simultaneous-finish tests remain in the full suite.

## Verification and evidence

Environment: Node 24.22.1, npm 11.9.0, managed Chromium 156.0.8078.79.

| Verification | Result |
|---|---|
| Before source changes: `npm test` | 114 passed, 0 failed, 0 skipped |
| Focused corrective tests | 30 passed, 0 failed, 0 skipped |
| Final `npm test` | 144 passed, 0 failed, 0 skipped |
| Standalone build | Passed; 163,579-byte embedded HTML |
| Managed browser functional/parity run | 23 functional checks; actual direct-file gate separately reported below |
| Full reference campaign | 16/16 default races (seeds 1..8, both formats) Ended; no integrity errors or stalls |
| Neutral baseline comparison | Winner distributions and all recorded batch means exactly match the 0.4.1 reference |
| Saved replay readback | Reconstructed from exported JSON; checksum matches the browser/headless reference |
| Original A01–A03 audit probes | No longer reproduce |
| B01/B03 audit probes | No longer reproduce; modifier accepted and photo fixture produces a real tie |

Evidence lives in [corrective-0.4.2-evidence](corrective-0.4.2-evidence/): baseline/final/focused test logs, build/browser results, original and updated counterexample results, owner offline statement, manifest and development-failure summary. See [the final evidence summary](corrective-0.4.2-evidence/summary.json) for exact counts, dependency-scan results, baseline comparison and checksums. Pure seed 145: `c232f54d`; Combat default: `4890b9c4`; Combat with pre-race Engage: `ee4a5415`. Separate current outputs are `reports/corrective-0.4.2-reference.json` and `reports/corrective-0.4.2-seed-145-replay.json`. Historical audit output has not been replaced.

Two initial B01 replay regressions and one invalid test setup failed during development; see the [failure summary](corrective-0.4.2-evidence/development-test-failures.md). Replay ordering was corrected and the invalid timeout fixture was replaced with a valid aggregation test. An auxiliary CSS dependency scan also produced a false positive on JavaScript ObjectURL calls; restricting it to actual CSS resolved the scanner issue without changing the artifact. No production validation bound or behavioral assertion was weakened. The final full suite passes. This evidence is not proof of universal correctness for every legal configuration or platform.

## Deliverable and compatibility

[dist/Blood_and_Thunder.html](../../dist/Blood_and_Thunder.html), **163,579 bytes**, one inline-script HTML with embedded CSS and Canvas graphics; no external runtime libraries, server, runtime Node or adjacent assets.

```text
SHA-256 30cea713001b2e1dfdc0b818605161ba5951d15a44e4b87b2210493451354002
```

The version advances to 0.4.2-corrective because authoritative events, paused-command metadata, surface state and finish snapshots change. Schema remains versioned; configuration and replay records remain simulation-version-specific and old-version records must be regenerated/validated for the new engine. No silent replay migration or fallback is introduced.

## Acceptance records and remaining qualifications

1. **Automated:** the full 144-test suite, new regression scenarios, rebuild and replay checks provide current-source evidence.
2. **Managed browser:** functional UI checks and headless/browser parity operate through the explicitly labeled HTTP diagnostic fallback. Direct file navigation remains denied by administrator policy; the browser command retains a nonzero blocked result rather than pretending T25 passed.
3. **Owner offline:** the owner has verified direct offline operation of the pre-corrective v0.4.1 file. This is distinct from managed-browser testing and from acceptance of this corrected build.
4. **Outstanding independent verification:** direct local-file operation of the newly hashed 0.4.2 artifact remains to be confirmed outside the managed restriction. No independent second-browser certification, final balance approval or final owner acceptance is claimed.

**Recommendation:** ready for owner review of the corrective build and evidence. B01–B04 are addressed within the approved prototype scope. Retain the local-file verification distinction, check the new artifact locally, and obtain owner acceptance separately. No new gameplay milestone, publication or remote push is implied.


## Change inventory and scope review

Runtime changes are limited to `src/ai/driver.js`, new `src/ai/telemetry.js`, `src/sim/race.js`, `src/sim/consequences.js`, `src/sim/incidents.js`, `src/track/oval.js`, `src/reporting/results.js`, `src/replay/replay.js`, `src/ui/index.html`, and the version constant in `src/config/config.js`. No AI utility, combat coefficient, fatigue-generation/recovery constant, production tie tolerance or movement integration formula was rebalanced.

Development/delivery changes: new `tests/corrective.test.js`, `tests/fixtures.js`, `scripts/browser-test.mjs`, package/lockfile patch versions, rebuilt `dist/Blood_and_Thunder.html`, the separate current reference/replay files, this report/evidence, `ASSUMPTIONS.md`, `DEVELOPMENT.md`, `IMPLEMENTATION_STATUS.md` and `RELEASE_CHECKLIST.md`. No dependency was added. The build script/vanilla single-file architecture is unchanged. Diff/whitespace review found no unrelated scope changes; numbered documents and historical audits/reports remain unchanged.

Reproduce with `npm test`, `npm run build`, `npm run test:browser`, and `BNT_REPORT_TAG=corrective-0.4.2 npm run reference`. The browser command still exits nonzero for managed direct-file blocking; consult its functional check list rather than treating that status as a functional failure or overriding it. Current file hashes are recorded in `corrective-0.4.2-evidence/snapshot.sha256`.
