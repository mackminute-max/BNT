# BNT P2 — Windows offline owner acceptance

Status: **pending owner execution**. Automated Linux Chromium HTTP/offline tests and emulated DPR do not establish Windows `file://` or Chrome/Edge toolbar-zoom acceptance. Managed Chromium refused direct-file navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`.

## Primary playable proof

1. Download **Blood-and-Thunder-P2-Playable.html** individually. No ZIP, adjacent files, Node, npm or server is required. Keep accepted P1.5 and existing saves separate.
2. On Windows, double-click the file in current Chrome, then Edge. Confirm the address starts `file:///`. Disconnect the network and reload. Confirm no missing assets or browser console errors. The page identifies itself as **P2 static visual proof**, **IN MEMORY / No career writes**.
3. Open **Race setup and preparation**. Prepare Short Oval, Broken Crown/C01 and each rally length. Exercise Pure and Combat, one/four/eight entrants, and the same seed on restart. Preparing alone must not spend Signs or start movement.
4. Confirm the close view is truly top-down, the camera follows the player's RU with fixed north/up, lane edges and heading are readable, and the separate tactical map always fits the entire course. Identify player by diamond/outline/number as well as color. Rally Sign Points should be visible on the map.
5. Click a Sign card: it selects an instruction only. Click **Queue / Replace** to issue it. Start the race; retain the native countdown. Check queued and active labels, uses remaining, and the separately labeled Worker acknowledgment. A future acknowledgment must not imply the presented RU has activated the Sign early.
6. Queue another Sign while racing. On closed courses it follows the existing next-crossing rule; on rallies it follows existing Sign Points. Pure mode must reject deliberate Engage Rivals behavior. No new refunds or uses should appear.
7. Pause, wait for acknowledgment, present the buffered tail, then step exactly one native tick. Resume and exercise 1×/2×/4× playback. Speed must affect viewing only. Restart should explicitly abandon the old race/commands, not transfer them to a new generation.
8. Check that radio, standings, endurance, condition, main view and map agree on the presented race. Finish a race, inspect classification and restart the identical setup. Also inspect congested starts, turns, contact and a long rally. Camera should not switch to another entrant merely because the player retires or finishes.
9. Toggle **Use proof artwork** off/on while paused and while racing. There should be no tick jump, Sign consumption, result change or controls lock. The generic two-beast artwork, portrait, emblem, borders and scenery are explicitly temporary, not final approved characters/teams.
10. Toggle **Reduced motion**. Confirm no new authoritative events or changes to race decisions. Camera/effects should become less animated.
11. Use keyboard Tab/Shift-Tab/Enter/Space for setup, Sign and playback controls. Verify visible focus, legible text, labeled queued/active states and readable condition/standings without relying on color alone.
12. Resize the window from desktop to narrow/mobile-like width. Check that the document does not scroll horizontally and that map/radio/controls remain reachable. On narrow screens the layout stacks vertically; a map may require page scrolling, rather than being a permanently pinned overlay.
13. Test Windows display scaling 100%,125%,150%,200% where available and browser toolbar zoom 100%,125%,200%. Confirm smooth antialiased outlines, undistorted geometry, correct Canvas size, pointer inspection alignment and no accumulated double scaling. Backing DPR intentionally caps at 2.
14. Compare smoothness against your accepted P1.5 artifact on the same machine, course, seed and speed. Record stalls, unreadable labels, excessive camera movement and subjective art/layout issues rather than assuming automated timing implies acceptance.

## Optional E4 visual companion — disposable data only

**Blood-and-Thunder-P2-Durable-Proof.html** is a separate developer proof of shared presentation in the existing management/E4 application. It is not the primary playable P2 file and is not a persistence upgrade. The two companion aliases under `p2-durable/` contain identical bytes.

Do not import/migrate an owner career merely to test P2. Use a disposable browser profile and disposable existing test career. Existing explicit migration/registration controls retain their accepted semantics. No automated P2 process migrates owner data.

Open Developer tools → Career State / Save Management → E4 durable championship persistence. With a valid disposable active test race, confirm the committed-tick label, close view and map advance only after the existing durable operation acknowledges. During a slow/pending operation they must hold the last committed frame; redraw, resizing and artwork decode must not reveal prepared Worker state. After a failed write they must retain that frame. The legacy main race viewer above this developer panel remains unchanged; the P2 shared proof is the lower E4 canvas/map pair.

## What to return

Report Chrome/Edge versions, Windows version, display/browser scaling, file name/hash, successful checks and any screenshots/console errors. Specifically approve or reject offline direct-file loading, camera readability, tactical-map identity, radio/Sign/control legibility and perceived smoothness. This checklist does not authorize P3/P4 or publication. No owner acceptance is claimed until you report it.
