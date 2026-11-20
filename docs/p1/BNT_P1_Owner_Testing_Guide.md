# BNT — P1 Owner Testing Guide

## Open on Windows

1. Download **Blood-and-Thunder-P1-Playable.html** from this delivery. Keep the existing production HTML separately for its career/workbench.
2. Optional integrity check in PowerShell: `Get-FileHash .\Blood-and-Thunder-P1-Playable.html -Algorithm SHA256`.
3. Expected SHA-256: `58d0a152639fc54e675bd8aea0188c46f126dab34b3d18f14899fe31b4761da2`; size 182,784 bytes.
4. Disconnect the network, double-click the HTML and open in modern Chrome or Edge. No Node, npm, server or adjacent files are needed.
5. The header should say **P1 · Deterministic playable race**. This build makes no career saves or rewards. Closing abandons the race. JSON metrics downloads are diagnostics, not resumable saves.

Managed Linux Chromium passed the UI over HTTP and then interacted offline, but `file://` was blocked by administrator policy. This does not establish Windows direct-file acceptance. Please test both Chrome and Edge directly from disk and report their versions.

## Prepare and race

- Select a course: three existing ovals, twelve circuits or generated Short/Medium/Long Rally.
- Select Pure/Combat, native weather, integer seed, base player rating, field size and laps. Player is RU1.
- Choose Unmodified baseline or an explicitly experimental specialist build. Optional coaching overrides are frozen when preparing.
- Click **Prepare / New race** to apply settings. Changing selectors alone does not alter the active race.
- Queue a pre-race Sign if desired, then **Start / Resume**. Use **Pause**, **One native tick**, and 1×/2×/4× playback. Restart identical setup reuses the prepared settings; Prepare applies newly selected settings.
- The main top-down camera follows RU1, switching to an active rival after player retirement. The separate tactical map shows the whole course, competitors, direction and Rally Sign Points. White/gold identifies RU1.

## Signs

All six native Signs are available; Engage Rivals is disabled in Pure. Accepted Queue/Replace spends one of three opportunities. Canceling gives no refund; lowering removes the active Sign under native rules. Activation spends no additional use.

A pre-race queued Sign waits for the starting signal. During oval/circuit racing it waits for the next start/finish crossing. Rally Short has SP1 at 1/2; Medium at 1/3 and 2/3; Long at 1/4, 1/2 and 3/4. Later commands cannot retroactively activate at a passed point. A queued Sign after the final Rally point may remain pending through the finish.

## Results and comparison

After native physical clearance, the order table displays official classification. Rounded times are display-only; native full precision and tie tolerance determine places. An unresolved/stalled/error race shows **blocked**, not a fabricated successful finish. No money, XP or career consequences are awarded.

Select course/seed/format and click **Run controlled pair A / B**. It runs both native builds with fixed rivals/grid/weather and no Sign inputs, showing finish/condition/action metrics. Controls lock while running. Current pending/race counters show progress. Experimental coaching/preset differences are intentional; no build is guaranteed to win. Switch the selected build and prepare for manual playtesting.

**Download current race metrics** exports setup, tick-ordered Sign requests, native checksum/results, preset changes and measured performance. Save the file yourself; the browser cannot prove a download was durably stored. It describes the current manually played race, not a resumable checkpoint or automatic comparison import.

## Acceptance checklist

- Open offline from disk in Chrome and Edge; no missing assets/errors.
- Play Pure and Combat on an oval and circuit; play all three Rally categories.
- Check the follow camera, separate map, arrows/markers, readable RU identities, live order/condition and chronological bounded radio feed.
- Queue before start; queue/replace/cancel/lower while paused and playing; confirm three-use accounting and correct delayed activation.
- Pause/step/resume and 2×/4×. No tick skipping or changed outcomes from presentation alone.
- Finish and inspect official results; restart an identical setup. Same seed **and all settings and same tick-ordered inputs** are required for reproducibility; seed alone is insufficient.
- Run the comparison on multiple courses/seeds. Observe action/fatigue differences, not just labels.
- Try Long Combat Rally early and late. Note short digest-related pauses; they remain a disclosed native performance limitation.
- Close/reopen: no P1 race or career persistence is promised. Existing production saves must remain untouched.

When reporting an issue include HTML hash, browser/version, course, seed, weather, format, field size, laps, base rating, build/coaching, tick, Sign request order, screenshot and downloaded metrics where available. Owner Windows acceptance is not claimed by this delivery.

## Developer reproduction

From the repository with existing development dependencies: `node scripts/p1/build.mjs`. Focused tests: `node --test tests/p1-playable.test.js`. Full suite: `npm test`. UI: `node scripts/p1/browser.mjs`; performance: `node scripts/p1/profile.mjs`; controlled pair evidence: `node scripts/p1/compare.mjs`; historical/payroll checks: `node scripts/p1/references.mjs`. Set `BNT_P1_OUT` to choose an evidence directory. These are development commands, not required to play the delivered HTML.
