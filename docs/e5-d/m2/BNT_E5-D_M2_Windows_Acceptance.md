# BNT E5-D M2 — Windows Chrome/Edge acceptance

Status: owner testing required. M1 Windows acceptance does not constitute M2 acceptance. This environment blocks `file://` with `ERR_BLOCKED_BY_ADMINISTRATOR`; the HTTP Chromium checks are separate evidence.

## Artifact and safety

Use `Blood-and-Thunder-E5-D-M2-Playable.html`. Keep the accepted M1 HTML and existing backups. Do not overwrite your only career backup. No server, extracted assets, external fonts, content pack or installation is required.

PowerShell verification:

```powershell
Get-FileHash .\Blood-and-Thunder-E5-D-M2-Playable.html -Algorithm SHA256
(Get-Item .\Blood-and-Thunder-E5-D-M2-Playable.html).Length
```

Expected: **2,341,979 bytes**, SHA-256 **96adf582c830722c7e0298ca2a45b61ca2c7e1317ab96a730aa59b4d3dbed574**.

Run the following separately in current Windows Chrome and Edge, with the HTML opened directly from disk. Disconnect networking after opening. Browsers and file locations can have separate storage scopes; use the same browser/profile and exact path for reopen checks. Private browsing is unsuitable for durable-save acceptance.

## Creation and comparison

1. Open the Options wheel using mouse and keyboard. Escape closes Options and returns focus. No browser-native alert/confirm/prompt should appear.
2. Choose New Game. Enter stable/owner names, choose one of three built-in cosmetic emblems and two colors. No nation, gameplay bonus or external art is required.
3. Cancel at step 1. Repeat and cancel at package comparison, then final review. Back must preserve choices. No new career should appear in Load Game before confirmation.
4. Compare every package. All five are available in the existing catalog; there is no approved implemented unlock requirement to fabricate. Expected starting Gold: Traditional 1200; Beastmaster Yard 850; Mechanist Workshop 800; Veteran Outfit 650; Scrappy Underdog 750. Compare reserve drivers/beasts, native ratings, both installed equipment items, chariot and property capacities. Equipment mass/combat are currently zero; facility labels are descriptive starter records.
5. Select a nondefault package. Check final review names, emblem, package and contents. Use Back, change selection, and review again.
6. Confirm once, then attempt rapid repeated clicks. Wait for durable confirmation. Exactly one separate, initialized stable should open in Home Stable; Gold/assets must match the selected package once.
7. Create a second career with a different package/branding. Load each explicitly and verify separate names, Gold, IDs/progress and guide status. From a loaded career choose New Game in Options, then cancel; the original career remains intact.

## Guide, existing gameplay and saves

8. Follow guide links, advance tips, Skip guide, close/reopen and Reopen guide. Following or skipping tips must not spend Gold, grant assets, assemble a unit, migrate services or start a championship automatically.
9. Use existing explicit Save & Recovery compatibility steps if required, assemble through Roster, and enable/register through Championships. These are existing player-confirmed operations, not automatic onboarding.
10. Run an actual native race. Open Options while playing: ticks must stop after the acknowledged pause. Close Options: prior playing state resumes; a previously paused race stays paused. Playback speed and queued/active Signs remain intact.
11. Complete and publish a race, resolve eligible pending choices using existing controls, close and reopen. Completed progress must remain. Navigate repeatedly among headquarters pages; there must be only one Continue Championship control and one global wheel.
12. Export a **complete championship backup**, verify the downloaded JSON exists yourself, and restore it into an empty browser/profile using Load Game's separate-career import. Confirm before replacement. Names, package, cosmetics, guide, mechanical state and any required sessions must survive. Reimporting the same ownership as another slot must reject.
13. Existing **career-only JSON** is the historical mechanical format. It excludes cosmetics/guide and cannot carry separate active-session authority. Do not use it as a cosmetic-preserving complete backup. Historical careers must still load without invented cosmetics or a fresh starting grant.

## Interruption and failure checks

14. Reload during the unconfirmed wizard: only the last committed career/list is present, with no draft grants.
15. If a final save is interrupted, open Load Game. A retained pending creation is not playable. Use **Recover interrupted creation or import** only when offered and explicitly confirm; it may activate only the already approved validated save. Do not create a second grant to repair it. A reservation without retained authority remains blocked, not fabricated.
16. If storage is denied or a save cannot be acknowledged, do not regard the operation as saved. Retry the same creation or review retained recovery evidence. Existing careers must remain available through explicit Load Game. Do not clear browser storage to test failure against your only saves.

Record browser/version, Windows version, file path, package chosen, each step's result, console errors and screenshots of any failure. Report owner acceptance separately after both browsers pass.

**STOP — awaiting owner acceptance of M2.**
