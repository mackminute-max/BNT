# Milestone 4 update — audit remediation, 0.4.1-m4

**Status: audited defects fixed and implementation available for review; final acceptance BLOCKED by T25 direct offline launch verification.** This update stays within the approved racing prototype. No environment publication, Git push, or changes to the numbered specifications were made.

## Audit disposition

| Finding | Disposition | Change / evidence |
|---|---|---|
| A01: lateral incident bypass | Fixed | Lane reservations reject incident-occupied swept targets independently of AI perception, queue a side impact at the decision's simulation time, and flush the shared consequence group before further movement. Hazard-blocked entrants are not treated as vacating their tiles. |
| A02: unsafe seed range hangs | Fixed | Range endpoints must be safe integers before subtraction/iteration; cumulative request size is checked before expansion; offset iteration stays bounded even at Number.MAX_SAFE_INTEGER. Invalid input preserves the live race and leaves Step usable. |
| A03: incorrect sign compliance | Fixed | Compliance checks effective executed pace after yield/disengage, rather than the abandoned pace candidate. Diagnostics retain the chosen pace, expose executed pace and explain the override. Autonomous caution remains legal; no sign stat bonus or guaranteed obedience was added. |
| A04: direct offline launch | **Still blocked** | Managed Chromium rejects `file://` with ERR_BLOCKED_BY_ADMINISTRATOR. All functional checks passed in explicitly labeled HTTP diagnostic mode. No policy bypass or unsupported offline-success claim. |
| A05: incomplete named scenarios | Fixed | All twenty required scenario definitions now have version/seed, normalized configuration snapshots, opening commands where applicable, and expected invariants. New tests exercise the catalog and representative complete outcomes. |

Changed runtime modules: `src/sim/race.js`, `src/sim/consequences.js`, `src/dev/batch.js`, `src/ai/driver.js`, `src/config/config.js`. Package/simulation version is now 0.4.1 / 0.4.1-m4 because replay hashes/events and diagnostics change.

Changed development modules: `tests/fixtures.js`, new `tests/audit-regressions.test.js`, `scripts/browser-test.mjs`, and optional report naming in `scripts/reference.mjs`. `DEVELOPMENT.md`, `ASSUMPTIONS.md`, `RELEASE_CHECKLIST.md` and `IMPLEMENTATION_STATUS.md` describe the updated contract and evidence. The original audit and its evidence remain historical records.

## Executed validation

Environment: Node 24.22.1, npm 11.9.0, managed Chromium 156.0.8078.79.

| Command / check | Result |
|---|---|
| `npm test` | **114 passed, 0 failed, 0 skipped**: 100 retained tests plus 14 audit regressions. |
| `node --test tests/audit-regressions.test.js` | **14 passed** after the final fixture adjustment. |
| `npm run build` | Passed; single inline-script HTML, **158,915 bytes**. |
| `npm run test:browser` | **19 functional checks passed**, 0 page errors, 0 additional runtime requests; exit 1 because actual local-file navigation remains blocked. |
| `BNT_REPORT_TAG=milestone-4-update npm run reference` | **16/16 complete default races**, seeds 1..8 in both formats, no integrity errors or stalls; references reconstruct from replay. |
| Original audit reproducer | A01/A02/A03 each report `reproduced: false`; detailed outputs retained separately from the original evidence. |

New regression coverage includes all three incident types in Pure/Combat, visible and hidden hazards, simultaneous lateral attempts and entrant storage permutations, side-impact consequences, exact replay, expiry and unchanged-contact deduplication, unsafe/overflow/cumulative seed ranges, safe-integer limits, yield/disengage conflicting with Push, valid Conserve compliance, execution failures, event/technical totals, and the twenty-scenario catalog. Scenario outcome tests cover Sprint fatigue, all-retired classification, four-lane blockage, clearing exit, sign replacement/retirement and paused override reconstruction.

During targeted test development, permutation fixtures initially changed the default player by reversing entrants, and the Sprint fixture used reference mode (which deliberately omits condition integration). These harness issues were corrected by fixing player ID and using an autonomous Sprint-biased fixture; no physics changes were made to satisfy those incorrect test setups.

## Artifact and reproducibility

Deliverable: `dist/Blood_and_Thunder.html`, **158,915 bytes**.

```text
SHA-256: 5180387f5cb623e5ae920d8e307a9fd0244b61fb7a6580f0f44c1649dbf23e1d
```

Seed 145 reference checksums:

- Pure: `a56f5a14` (browser/headless match).
- Combat default: `7de55bb9` (headless replay verified).
- Combat with pre-race Engage Rivals: `dca3bfa4` (browser/headless match).

Evidence:

- `reports/m4-update-evidence/tests.log`, `targeted-tests.log`, `build.log`, `audit-probes.json` and `snapshot.sha256`.
- `reports/m4-update-browser.json`.
- `reports/milestone-4-update-reference.json`.
- `reports/milestone-4-update-seed-145-replay.json`.
- Historical pre-update report preserved as `reports/MILESTONE_4_ORIGINAL.md`; original reference/replay files were not overwritten by the update's reference run.

The new version intentionally rejects old-version replay records rather than silently playing them under changed rules. Re-export/re-run scenarios with 0.4.1-m4. This does not change the versioned configuration schema or require a runtime server/library.

## Remaining limitations and acceptance

T25 still requires this exact built file to be opened directly in a permitted desktop browser with network disabled, no server and no adjacent files, then exercised through results and portable replay/configuration flows. The managed browser's policy restriction cannot be repaired inside the game. This is a verification limitation, not proof of an HTML runtime failure.

Balance coefficients remain provisional. The reference batches have eight finishes per race and no default DNFs; the browser's separate high-damage scenario still exercises wrecks and DNF presentation. No new casualty-rate target, campaign, economy, audio or final art scope is introduced. Historical M1–M3 offline gates are not retroactively marked passed.

**Owner review outcome requested by the milestone process:** review this corrected M4 build and evidence. Final acceptance remains pending actual offline-launch evidence; no subsequent milestone or publication is assumed.
