# BNT — P2.1 Owner Playtest Guide

## Open the file

Download **Blood-and-Thunder-P2.1-Playable.html** individually. Keep your accepted P2 file. Double-click the new file in Windows Chrome, then Edge; confirm a `file:///` address. Disconnect the network and reload. No server, Node, npm or adjacent files are required to play.

This is an in-memory presentation prototype: closing/reloading abandons the race. It does not open or migrate career saves, grant rewards or implement buffs. Windows direct-file acceptance of this new artifact is pending your test; Linux managed HTTP/offline testing is not a substitute.

## Player controls

- **Start Race:** uses the existing Worker countdown. Watch READY → SET → GO! If preparation is slow, SET must honestly wait; GO must not appear while playback remains blocked.
- **Strategy Signs:** six choices sit directly beneath the main view, in one row on a full desktop. Selecting a card spends nothing. **Queue / Replace** submits the original command and can spend a use. Queued, Active and Selected are different states; the presented timeline decides Active. Default three opportunities and all existing boundary/refund rules remain unchanged.
- **Pause:** waits for native pause confirmation. **Present buffered tail** shows already prepared frames. **Single tick** becomes available only when that tail is drained. This preserves P1.5 behavior.
- **Playback:**1×/2×/4× changes viewing speed. **Restart identical setup** explicitly abandons the current in-memory race and pending command generation, returning to the same starting configuration.
- **Race Controls** also contain zoom, reduced motion, and expandable driver-response/Worker-acknowledgment details. Signs remain in their own bar.

## What to inspect

1. At1440px desktop width, confirm the main race view dominates, the six Signs are one horizontal row and the radio/profile/map/standings are useful without excessive scrolling.
2. Repeat at 1024,768 and390 CSS pixels. Signs may wrap; no horizontal page overflow or inaccessible controls should appear. Narrow views stack naturally.
3. Check the orthographic follow camera and separate full-course map. Identify the player by diamond/outline/number as well as color. Rally Sign Points must remain visible.
4. In Driver Profile, compare **Driver condition** and **Driver strain**. Team endurance is about beasts, not driver fatigue. Missing driver/team names are explicitly unavailable; the three future-effect slots must remain empty/reserved.
5. During an eventful race, scroll the fixed-height radio upward. New messages should not drag you back down. Click **Latest commentary** to return to live following. Timestamps should remain chronological. The existing bounded transcript is not an unlimited archive.
6. Pause during READY/SET, then resume. Restart and watch a fresh sequence. No duplicate tick, extra opportunity or premature Active/GO display should occur. GO is a playback indicator; it does not change the native starting-signal timing.
7. Use Tab, Shift-Tab, Enter and Space. Focus must be visible; selecting a Sign by keyboard must not spend a use until Queue is submitted. Reduced motion keeps the same start words without animations.

## Developer Tools

The button is at the bottom of the player page. It opens an internal view in the same HTML; **Return to Race** comes back to the same race. Navigation itself must not pause, restart or create a second session. An active race continues while tools are open.

Tools retain course, Pure/Combat format, weather, seed, entrant count, laps, player ratings/build/personality/pacing, optional coaching, Worker/synchronous execution, original comparison/export and diagnostics. Apply settings only with **Prepare / New race**. Switching views is not preparation.

Recommended scenarios: default Short Oval/Pure; C01 with8 entrants/Combat at4×; Generated Long Rally with8 entrants/Combat at4×. Use seed145 for comparison with prior evidence. Repeat a chosen seed/settings and the same input timing when checking deterministic results. The inherited Node-versus-browser Long Rally discrepancy is not a reason to change seeds or golden data.

Synchronous developer mode/fallback retains immediate native stepping and has no artificial timed Worker pre-roll. This is compatibility behavior, not a second countdown implementation.

## Acceptance to return

Report Windows/browser version, filename/hash, viewport/display scaling and whether you used direct-file offline play. Specifically report the one-row Sign bar, countdown timing/holds, profile labels, radio reading position, developer navigation, keyboard access and smoothness compared with accepted P2. Include console errors/screenshots for failures.

The E4 companion remains the accepted P2 developer visual proof; P2.1 does not replace it or require touching owner careers. Acceptance does not automatically authorize a merge, push or P3/P4.

## Artifact identity

Runtime `4a9e100d5ca068c99465860b94e8667c655443b7`. File size **554,672 bytes**. SHA-256:

`90bf1652ca2a63726476d93ee15163efb530b08e38d9a2cec9195450bc4d9e9f`
