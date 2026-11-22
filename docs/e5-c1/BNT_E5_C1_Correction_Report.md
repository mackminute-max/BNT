# Blood and Thunder — E5-C.1 Correction Report

Verification date: November 21, 2026 (America/Los_Angeles).

## Baseline and scope

Accepted runtime: `646fad6b7a6dff3b10d9718286840cc7b3c3bc97`. Started from its documentation-only successor `feff8287e6e9b69582861e3262b80e2cf73432cc` on the existing E5-C branch, then created local `feat/m2-e5-c1-navigation-correction`. Implementation commit: `fd9cd96e3c8b13ac4ba391c7cf2f9651d923d10d`.

Only application source changed: `src/management/playable.js`. No simulator, Worker, E4 storage, publication, settlement, rewards, finances, save schema or accepted replay reference changes. The pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` is preserved and excluded. No merge, push, release, deployment or E5-D work.

## Confirmed source-level root cause

At accepted revision `646fad6`, `src/management/playable.js:31` created `hs-continue-championship` during navigation initialization. Line56 created another in `render()` on every call. More precisely than the original diagnosis, the second creation is in `render()`, which `show()` invokes at line33; refreshes and operation feedback also invoke it. There was no deduplication or cleanup. The later `getElementById` lookup at line79 changed only the first matching button.

The original packaged artifact was tested unchanged. After normal registration, an actual native race in the owned viewer, authoritative publication and return to Home Stable, the common duplicate-ID assertion found **101 Continue controls /109 navigation buttons**. It failed with expected1/actual101, process exit1. No JavaScript error was needed to reproduce the defect. Evidence: `evidence/original-navigation.json`, `original-navigation.log`, `original-exit.json`.

## Correction

- `playable.js:35`: create the global control exactly once while initializing navigation. Initialize it hidden/disabled and attach one `onclick` handler.
- `playable.js:23–25`: pure `continuationNavigation` derives availability, busy state, destination and action label from the current authoritative view. Active championship includes pending Run, settlement, Legacy and recovery; it does not mean only actively racing. Fresh/archived careers hide and disable the control. If durable authority needs recovery without a reconstructed active instance, navigation reaches Save & Recovery instead of disappearing.
- `playable.js:60–62`: every render updates the same node's `hidden`, `disabled`, `title`, `aria-label`, `aria-hidden`, `aria-disabled` and `aria-current`, before any Developer Tools early return. It does not recreate the button or rebind its handler.
- The click handler checks the current view and busy state at click time, then uses the existing `navigate`/`show`/`careerFlow` route. It cannot start races or publish consequences itself.

## Changed-file inventory

| File | Purpose |
|---|---|
| `src/management/playable.js` | Single-node navigation correction and state/accessibility updates. |
| `tests/e5-c1-navigation.test.js` | Two tests covering active/reward/settlement/recovery, busy, fresh/archived and recovery-without-instance navigation. |
| `scripts/e5-c1/navigation-browser.mjs` | Same packaged duplicate-control assertion against original and corrected HTML; repeated navigation and full native race/lifecycle tests. |
| `scripts/e5-c1/player-regressions.mjs`, `references.mjs` | Original E5-C general player assertions and replay verifier, changing only artifact/evidence destinations. |
| `scripts/e5-c1/build.mjs`, `package.json` | Add `npm run build:e5-c1`; new output path; verify accepted E5-C/B/P2.2 artifacts before building. |
| `dist/Blood-and-Thunder-E5-C1-Playable.html` | New self-contained corrected artifact. |
| `docs/e5-c1/` | This report, test evidence, Windows checklist and retained evidence. |

## Artifact and reproducibility

`Blood-and-Thunder-E5-C1-Playable.html`: **2,243,624 bytes**.

SHA-256: `c508aea1093cbfd6758592866ce36a501d3034ef27c02f9ffab3bb6dc1558f3d`.

`npm run build:e5-c1` followed by `git diff --exit-code -- dist/Blood-and-Thunder-E5-C1-Playable.html dist/Blood-and-Thunder-E5-C-Playable.html` exits0. The original E5-C remains byte-identical, SHA-256 `8b31d3ef8ae6c902184beb7c134fad7e25290515250318211dbcd863eff71c2c`. Owned viewer payload remains389,714 bytes; its native/persistence source was not modified. The build retains original offline verification, inline Worker and exact accepted independent practice artifact. No dependency added.

## Acceptance disposition

**PASS for the bounded corrective implementation and local regression gate; Windows owner acceptance pending.** Full Node757/757; original artifact fails the duplicate-control assertion as expected; corrected packaged UI passes14 groups,280 complete cycles and1,705 action assertions, including two actual native races. General player browser13 groups and14 historical/payroll replay references pass. No known remaining duplication defect was found.

Windows direct-file owner acceptance remains separate. Existing E5-C durable buffering and maximum-field/long-schedule limitations are not addressed by this UI correction. See the accompanying test evidence for actual counts and the Windows checklist for owner testing. Stop after E5-C.1.
