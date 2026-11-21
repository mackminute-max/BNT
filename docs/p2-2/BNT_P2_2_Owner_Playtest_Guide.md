# BNT — P2.2 Owner Playtest Guide

## Open the standalone

Download **Blood-and-Thunder-P2.2-Playable.html** individually. Keep P2/P2.1. Double-click the new file in Windows Chrome, then Edge; verify a `file:///` address. Disconnect the network and reload. No Node, npm, server or adjacent assets are required to play.

This is still an in-memory race prototype. Closing/reloading abandons the race. No owner career is read/migrated and no rewards, buffs or management mechanics are introduced. Managed Chromium blocks direct-file navigation, so Windows offline acceptance of this new file is pending your execution.

## Principal 1920×1080 review

- Left roughly two-thirds: close-follow Main Race View with compact Standings immediately beside it; Strategy Signs below that row; Driver & Team Profile below Signs.
- Right roughly one-third: full-course Tactical Map, contained Race Radio, then Race Controls.
- All six Signs must fit one horizontal desktop row. Default1080p should not need page scrolling. No overlap or inaccessible input.
- Standings must show only position and stable organization name. Current generated entries lack names, so **Stable name unavailable** is intentional. The player's row has a diamond/highlight; accessible labels include RU identity. Do not expect the example design roster to appear.
- Driver condition, Driver strain and Team endurance are different Native values. Three future-effects slots remain neutral/reserved.

Repeat at 2560×1440,1366×768,1024×768 and 390px mobile width. Smaller windows may scroll/stack/wrap. On phones standings move immediately beneath the viewport. Check text, clipping, no horizontal overflow and camera/map geometry after resize or browser fullscreen entry/exit.

## Player controls

Race Controls contain only:

1. **Start Race / Resume Race:** original Native command path. The button is disabled and honestly labeled while starting/racing/waiting or stopped. READY→SET→GO uses the accepted Worker start sequence; SET must wait if the buffer is late.
2. **Pause:** original acknowledgment behavior. Do not expect Resume until the pending pause is confirmed.
3. **Follow Zoom:** changes camera view, not playback speed, simulation rules or tactical-map fit.

Strategy Signs retain their own Queue/Cancel/Lower controls. Choosing a card alone must not spend a use. Selected, Queued and Active remain distinct; no Active state may appear ahead of the presented timeline. Normal default is three opportunities; existing boundaries/refunds are unchanged.

## Radio and navigation

During an eventful race, scroll upward in the radio. New Native commentary should not pull you down. Latest returns to bottom-following, and the unread count reflects actual new messages. The transcript retains its existing bounded history, not an unlimited archive.

Open **Developer Tools** at the bottom. An active race continues; navigation itself must not restart, pause, advance a paused race, clear Signs/radio or create another Worker. Return to Race should show the current presented state with the correct camera.

Step, playback speed, buffered tail, restart/replay diagnostics, reduced motion and response/ack details now live in Developer Tools. Their original handlers remain. To step a Worker race: pause on the player page, wait for acknowledgment, enter tools, present the existing buffered tail, then single-step. These explicit diagnostic actions may change presentation or simulation as before; navigation alone must not.

Course, format, weather, seed, field, laps, build/personality/pacing, optional coaching, comparison and export remain available. Settings apply only through **Prepare / New race**. The comparison tool must not leave Engage Rivals available in Pure mode after it resets buttons.

## Recommended scenarios

Default Short Oval/Pure; C01 Combat with8 entrants; Generated Long Rally Combat with8 entrants. Use Developer Tools for4× and seed145 when comparing prior evidence, then return to the race view. Review all positions through finish/elimination; compact order must follow the original full Native order available in tools. Existing Node-versus-browser Long Rally differences are not solved or redefined here.

Test Tab/Shift-Tab/Enter/Space, visible focus, paused and active navigation, portrait fallback/reduced motion where appropriate, and actual Chrome/Edge toolbar zoom/Windows scaling. The managed tests cover keyboard, CSS zoom/DPR and Chromium fullscreen API, not every Windows assistive technology or browser context.

Return browser/Windows versions, artifact hash, screen size, direct-file/offline result and any screenshots/console errors. Owner acceptance does not automatically authorize merge/push or P3/P4.

## Artifact identity

Runtime `c235bf3ce0caed44a472cb0abd92104112f39586`. File size **570,516 bytes**. SHA-256:

`24c393c19f7d8aa6f4e2bf6794d2e573d11be74508940e97b78a6330b6a203be`
