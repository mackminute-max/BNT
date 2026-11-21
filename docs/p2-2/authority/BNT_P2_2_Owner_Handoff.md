# CODEX IMPLEMENTATION HANDOFF
# Blood and Thunder — P2.2: Full-Screen Race Interface Layout Revision

## 1. Mission

Implement P2.2 as a focused layout and control-organization revision of the existing P2.1 Player-Facing Race Interface.

**Primary objective:** Improve full-screen desktop readability and establish a race interface suitable for eventual use in a standalone desktop application.

This is not a new race presentation system. Reuse the accepted P2 rendering, P1.5 buffered playback, and P2.1 interface functionality.

**Scope is limited to:**
- Rearranging existing player-facing interface panels.
- Resizing panels to improve readability.
- Introducing a compact standings panel beside the Main Race View.
- Simplifying visible player-facing Race Controls.
- Preserving existing functionality through Developer Tools.
- Adjusting responsive layout behavior.
- Performing targeted regression and offline-deliverable testing.

Do not introduce new gameplay systems, art production, management mechanics, simulation changes, or a general performance optimization campaign.

---

## 2. Repository, Baseline, and Branch

Repository:

`https://github.com/mackminute-max/BNT.git`

P2.1 delivery branch:

`feat/p2-1-player-race-interface`

P2.1 final runtime commit:

`4a9e100d5ca068c99465860b94e8667c655443b7`

P2.1 initial UI implementation:

`53bdbc10e19d21bfd9ce618e7b4d6d4b7b23b97e`

P2 accepted runtime:

`ec25d77eea6523edba1cb1920d73c0dc7502b8c3`

P1.5 protected runtime:

`5d556f3adca146a6c17996234e34dcf4e98899db`

### Required preparation

1. Inspect the actual repository state.
2. Verify the P2.1 final commit and its ancestry.
3. Verify the P2.1 implementation and relevant tests are present.
4. Create a new local branch:

   `feat/p2-2-fullscreen-race-layout`

5. Preserve unrelated owner files and untracked work.
6. Record the verified baseline in the implementation report.

If the reported baseline cannot be established, stop and report the discrepancy rather than silently substituting another revision.

**Do not merge, push, publish, or release.**

---

## 3. Approved Full-Screen Layout

The interface must use a desktop-first two-column composition.

The overall screen is divided approximately:

- **Left primary column:** Two-thirds of available width.
- **Right supporting column:** One-third of available width.

These are target proportions, not mandatory fixed pixel percentages. Readability, correct canvas geometry, and the existing race viewport aspect ratio take precedence.

### Left column

Top section:

**Main Race View + Compact Standings**

The Main Race View remains the dominant visual element.

The compact Standings panel sits immediately to its right, inside the same left two-thirds column.

Below that combined row:

1. Strategy Signs
2. Driver & Team Profile

### Right column

From top to bottom:

1. Tactical Map
2. Race Radio
3. Race Controls

There is no separate full-width Standings panel in the right column.

### Layout diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ BLOOD AND THUNDER — RACE HEADER                                             │
├────────────────────────────────────────────────┬────────────────────────────┤
│ LEFT COLUMN — APPROX. 2/3                     │ RIGHT COLUMN — APPROX. 1/3│
│                                                │                            │
│ ┌──────────────────────────────┬─────────────┐ │ ┌────────────────────────┐ │
│ │                              │ POS. STABLE │ │ │                        │ │
│ │                              │  1  Stable  │ │ │      TACTICAL MAP      │ │
│ │       MAIN RACE VIEW         │  2  Stable  │ │ │                        │ │
│ │                              │  3  Stable  │ │ └────────────────────────┘ │
│ │                              │  ...        │ │                            │
│ └──────────────────────────────┴─────────────┘ │ ┌────────────────────────┐ │
│                                                │ │                        │ │
│ ┌────────────────────────────────────────────┐ │ │       RACE RADIO       │ │
│ │             STRATEGY SIGNS                 │ │ │   Scrollable content   │ │
│ │ [Sign][Sign][Sign][Sign][Sign][Sign]       │ │ │                        │ │
│ └────────────────────────────────────────────┘ │ └────────────────────────┘ │
│                                                │                            │
│ ┌────────────────────────────────────────────┐ │ ┌────────────────────────┐ │
│ │          DRIVER & TEAM PROFILE             │ │ │      RACE CONTROLS     │ │
│ │ Condition / Strain / Endurance / Effects   │ │ │ Start/Resume | Pause   │ │
│ └────────────────────────────────────────────┘ │ │      Follow Zoom       │ │
│                                                │ └────────────────────────┘ │
├────────────────────────────────────────────────┴────────────────────────────┤
│                       DEVELOPER TOOLS ACCESS                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

This diagram is conceptual. Do not implement the ASCII proportions literally.

---

## 4. Main Race View

Preserve the existing P2/P2.1 close-follow race presentation.

Requirements:

- Maintain the existing renderer and camera behavior.
- Preserve the correct viewport aspect ratio.
- Do not stretch or distort the canvas.
- Do not introduce cropping solely to satisfy a layout width.
- Preserve DPI handling, zoom behavior, resize handling, and camera follow behavior.
- Maintain the existing READY / SET / GO! presentation.
- Preserve the established rendering and buffered playback synchronization.

The Main Race View should occupy the remaining available width after the compact Standings panel is allocated space.

### Important sizing clarification

The previous design called for the Main Race View to retain its dominant width. The newly approved compact Standings panel must now fit within the left two-thirds column.

Therefore:

- Do not expand the left column beyond the intended overall composition merely to preserve the old exact canvas pixel width.
- Minimize the width sacrificed to Standings.
- Preserve the viewport's aspect ratio and visual readability.
- Avoid excessive empty margins.

The Main Race View must remain clearly dominant.

---

## 5. Compact Standings Panel

Replace the existing player-facing Standings presentation with a narrow vertical leaderboard immediately beside the Main Race View.

### Position

Inside the left primary column, directly to the right of the Main Race View.

### Width

Target approximately **140–180 CSS pixels** at standard desktop sizes, adjusted if necessary for stable-name readability.

Use a bounded width rather than allocating an unnecessarily large percentage of the primary column.

### Displayed information

Only:

1. Race position.
2. Stable name.

Example:

```text
POS.  STABLE
 1    Ironhold
 2    Red Banner
 3    Blackthorn
 4    Goldfang
 5    Stormkeep
 6    High Road
 7    Ashen Wheel
 8    Stoneforge
```

These are illustrative names only. Do not hardcode them into the game.

**The name must represent the racing stable/team organization, not an individual beast or driver.**

Do not include:

- Beast names.
- Driver names.
- Lap information.
- Health or damage indicators.
- Speed or timing metrics.
- Additional status columns.

### Data authority

Use existing authoritative presented race positions.

Standings must not update ahead of the currently presented race state.

Inspect existing roster, stable, team, and race-preparation data to identify the correct source for stable names.

If the existing presentation projection lacks stable names:

- Prefer a read-only mapping from already available race-entry or roster metadata.
- Preserve stable identity consistently across position changes.
- Do not invent stable names.
- Do not substitute beast names.
- Do not change the native simulation protocol solely to supply presentation labels.

If legitimate stable names are unavailable, display an explicitly neutral fallback such as `Stable name unavailable`, with a concise diagnostic note in the implementation report.

Do not create a new management naming system in P2.2.

### Behavior

- Support the existing maximum of eight racing units.
- Preserve existing race ordering semantics, including finishers and eliminated entrants.
- Visually distinguish the player's stable.
- Keep text readable at the intended narrow width.
- Handle long names using a controlled truncation or wrapping policy.
- Provide the full name through an accessible text label or tooltip when visually truncated.
- Avoid unnecessary animation or layout movement.

Do not replace authoritative race standings with a separately calculated ranking algorithm.

---

## 6. Strategy Signs

Place Strategy Signs immediately below the combined Main Race View / Standings row.

Preserve the P2.1 design:

- Six existing Sign buttons in a single horizontal row at normal full-screen desktop width.
- Existing Sign names.
- Available, unavailable, selected, queued, and active states.
- Remaining Sign opportunities.
- Existing Queue / Cancel / Lower controls as applicable.
- Existing native acknowledgment and activation behavior.

The Strategy Signs panel spans the width of the **left primary column**, not the entire screen.

Maintain a compact vertical footprint.

On narrower layouts, wrapping is acceptable.

### Protected behavior

The P2.1 final corrective commit repaired Sign availability after the comparison tool resets buttons.

That correction must remain effective.

Do not reintroduce the reset-state bug.

Do not clone interactive Sign elements or create parallel event handlers.

Reuse existing controls and their established command path.

---

## 7. Driver & Team Profile

Move the existing Driver & Team Profile below Strategy Signs.

It should span the left primary column.

Retain the P2.1 data contract:

- Driver portrait or existing fallback.
- Driver and team identity where legitimately available.
- Driver condition.
- Driver strain.
- Team endurance derived from existing beast fatigue presentation.
- Relevant current race status.
- Three neutral future-effects slots.

### Data integrity

Do not conflate:

- Driver condition with a management injury system.
- Driver strain with beast fatigue.
- Team endurance with driver health.
- Future effects placeholders with active buffs.

The three future-effects slots remain purely presentational.

No new buff mechanics, modifiers, persistence fields, or Worker data are authorized.

### Layout

Use the additional horizontal width to improve readability.

Favor a compact horizontal arrangement of identity, condition/strain, endurance, and future-effects indicators rather than a tall stack of separate cards.

The profile should not consume unnecessary vertical space.

---

## 8. Tactical Map

Place the existing full-course Tactical Map at the top of the right supporting column.

Preserve:

- Full-course geometry.
- Entrant markers.
- Player identification.
- Start/finish markers.
- Rally and Sign Point markers where applicable.
- Presented-state synchronization.
- Existing map scaling and redraw behavior.

Resize the map to use the right-column width effectively.

Maintain the map's correct aspect ratio and course visibility.

Do not replace the existing geometry or introduce a new map renderer.

---

## 9. Race Radio

Place Race Radio immediately below the Tactical Map.

Preserve all accepted P2.1 behavior:

- Fixed-height, independently scrollable transcript.
- Chronological native commentary.
- Bottom-follow when the reader is near the latest message.
- Preserved reading position when reviewing older commentary.
- Latest button.
- Actual unread count.
- Existing transcript retention limits.
- Continued commentary consumption while Developer Tools is displayed.

### Layout requirements

The radio panel must not grow vertically as messages accumulate.

At 1920×1080, provide a useful reading window without pushing Race Controls off-screen.

Retain the existing scrolling and reading-anchor logic rather than rebuilding the transcript every frame.

---

## 10. Simplified Player-Facing Race Controls

Place Race Controls below Race Radio in the right column.

The player-facing control panel must contain only the following functional controls:

### A. Start / Resume

One primary button.

Its label and enabled state must reflect actual race authority and playback state.

Reuse existing Start and Resume behavior.

Do not introduce a second race-start mechanism.

### B. Pause

One button using the existing authoritative pause behavior.

Preserve pending acknowledgment handling.

### C. Follow Zoom

Retain the existing player camera follow-zoom adjustment.

Keep the control compact and clearly labeled.

Do not confuse Follow Zoom with simulation speed or tactical-map zoom.

### Remove from the player-facing control panel

- Step One Tick.
- Playback speed selection.
- Restart / Replay.
- Tail controls.
- Debug playback commands.
- Other development-oriented buttons.

**These controls must not be deleted from the application if they remain necessary for testing or diagnostics.**

Relocate them to Developer Tools, preserving existing handlers and functionality.

Do not expose redundant controls in the normal player-facing Race Controls panel.

### Gameplay exceptions

Do not remove gameplay-essential Strategy Sign controls or existing necessary race-state feedback.

If a diagnostic control has a dependency on an existing player-facing state label, preserve the required feedback without retaining the unnecessary button.

---

## 11. Developer Tools

Retain the separate internal Developer Tools view introduced in P2.1.

The player-facing interface should provide access through a bottom link or button.

Developer Tools must retain the existing capabilities, including where present:

- Single-tick stepping.
- Playback speed adjustment.
- Restart / Replay.
- Tail controls.
- Existing race settings.
- Test and tuning controls.
- Comparison tools.
- Coaching and diagnostics.
- Export/import utilities.
- Build and technical information.

Do not invent new developer functionality merely to populate this view.

### Navigation behavior

Entering or leaving Developer Tools must not:

- Restart the race.
- Pause the race automatically.
- Advance simulation ticks.
- Reset Strategy Signs.
- Clear radio history.
- Reinitialize the Worker.
- Lose the current camera state.

Preserve P2.1 hidden/inert isolation and focus handling.

On return to the player view, redraw the current committed/presented state correctly.

---

## 12. Desktop-First Sizing and Responsive Behavior

The eventual target is a standalone desktop application, although the current deliverable remains browser-based.

Treat full-screen desktop presentation as the primary design target.

### Primary validation

**1920×1080**

This is the principal acceptance layout.

Requirements:

- Main Race View remains dominant.
- Compact Standings is readable.
- Six Strategy Sign buttons fit in one row.
- Driver & Team Profile is readable.
- Tactical Map, Race Radio, and Race Controls are all accessible.
- Avoid unnecessary page-level scrolling.
- No overlapping, clipped, or inaccessible interactive controls.

### Additional validation

**2560×1440**

Ensure the interface scales without excessively wide empty regions or disproportionate panels.

**1366×768**

Preserve usability without overlapping or hiding critical controls. Some page-level scrolling is acceptable if necessary.

**1024×768 and 390px mobile width**

Provide reasonable responsive fallback behavior.

For narrow windows:

- Allow the two main columns to stack.
- Allow Strategy Signs to wrap.
- Keep Standings associated with the Main Race View where practical.
- If the narrow standings panel cannot remain beside the viewport without compromising readability, move it immediately below the viewport within the same logical section.
- Preserve keyboard access and readable labels.

Do not optimize the primary desktop layout around mobile constraints.

### Full-screen resilience

Support browser resizing and full-screen transitions without requiring a race restart.

Use CSS layout constraints and existing resize handling.

Avoid hardcoded screen dimensions that assume browser chrome is absent.

---

## 13. Visual Direction

Continue the current **Dark Deco Retro Cartoon** visual direction.

Use the existing presentation styling:

- Smooth, non-pixelated graphics.
- Bold outlines and strong silhouettes.
- Angular Art Deco-inspired interface framing.
- Readable typography.
- Strong contrast.
- Clear hierarchy.
- Existing temporary P2 artwork.

This milestone does not authorize new image assets, font dependencies, or a visual-style redesign.

The goal is improved arrangement and readability, not additional decoration.

---

## 14. Protected Systems and Files

Do not modify the following unless a specific compatibility defect makes it unavoidable and is documented before proceeding:

- Native simulation rules.
- Driver AI.
- Combat, damage, fatigue, and weather mechanics.
- Strategy Sign mechanics.
- Worker protocol.
- P1.5 Worker runtime.
- Deterministic event chronology.
- Replay/checkpoint formats.
- Career and management state.
- Save persistence.
- P2 renderer geometry.
- Accepted E4 durable companion.
- Accepted P2/P2.1 deliverable artifacts.

Favor additive changes within the P2.1 presentation composition and styling modules.

Do not alter accepted historical build outputs in place.

The new deliverable must be a separately named P2.2 standalone HTML artifact.

---

## 15. Testing Requirements

Run the existing applicable test suites and add focused P2.2 regression coverage.

### Layout tests

Verify:

1. Correct desktop panel hierarchy.
2. Main Race View and compact Standings share the left-column top row.
3. Strategy Signs are directly below that row.
4. Driver & Team Profile is below Strategy Signs.
5. Tactical Map is at the top of the right column.
6. Race Radio is below Tactical Map.
7. Race Controls are below Race Radio.
8. Six Sign buttons fit in one row at the primary desktop resolution.
9. No player-facing duplicate controls remain.
10. Layout responds correctly to resize and full-screen transitions.

### Standings tests

Verify:

- Correct authoritative position ordering.
- Correct stable-name source.
- No substitution of beast or driver names.
- Player stable highlight.
- Long-name handling.
- Eight-entrant races.
- Correct finish/elimination ordering.
- No advance beyond the presented frame.

### Race Controls tests

Verify:

- Start / Resume uses the original command path.
- Pause uses the original command path.
- Follow Zoom adjusts the existing camera.
- Single-step and playback speed remain available through Developer Tools.
- Restart / Replay remains available through Developer Tools.
- Developer navigation preserves the active race.

### P2.1 regression tests

Preserve:

- READY / SET / GO! countdown behavior.
- Delayed initial Worker buffer handling.
- Sign availability after comparison resets.
- Queued Sign acknowledgment and activation.
- Driver condition/strain/endurance correctness.
- Radio scrolling, reading anchor, Latest, and unread count.
- Worker playback synchronization.
- Replay/checkpoint determinism.
- E4 committed-frame compatibility.

### Performance checks

Perform bounded smoke checks on:

- C01 circuit, eight racing units, Combat, 4×.
- Long Rally, eight racing units, Combat, 4×.

Look for material new layout, canvas, or main-thread regressions.

Do not launch a separate performance optimization campaign.

### Known inherited issues

Do not conceal or silently redefine:

- The inherited Long Rally seed145 Node/Chromium digest mismatch.
- The obsolete legacy browser assertion expecting zoom6 rather than accepted P2 zoom8.
- Previously reported intermittent Worker/frame hitches.
- Managed Chromium restrictions on direct `file://` acceptance testing.

Distinguish inherited failures from P2.2 regressions.

---

## 16. Offline Deliverable

Produce:

`Blood-and-Thunder-P2.2-Playable.html`

The file must:

- Be self-contained.
- Open without an external runtime dependency.
- Retain the existing embedded Worker approach.
- Include the existing presentation assets.
- Preserve the accepted offline architecture.
- Require no network access during gameplay.
- Avoid overwriting earlier P2 or P2.1 deliverables.

Use the existing build system and extend it only as necessary.

A Windows direct-double-click offline test may require owner verification if the managed test environment cannot perform it.

---

## 17. Required Deliverables

Provide:

1. **Playable standalone HTML**
   - `Blood-and-Thunder-P2.2-Playable.html`

2. **Updated local source**
   - P2.2 presentation layout and styles.
   - Any necessary additive build/test support.

3. **Implementation summary**
   - Exact files changed.
   - Layout changes.
   - Control relocations.
   - Standings stable-name source.
   - Any limitations or deviations.

4. **Test evidence**
   - `BNT_P2_2_Test_Evidence.md`
   - Actual test commands and exit codes.
   - Passed/failed/skipped counts.
   - Browser viewport checks.
   - Regression results.
   - Bounded performance observations.
   - Artifact size and SHA-256 checksum.

5. **Owner playtest guide**
   - `BNT_P2_2_Owner_Playtest_Guide.md`
   - Full-screen layout inspection.
   - Standings identity and ordering.
   - Race Controls.
   - Strategy Sign operation.
   - Radio scrolling.
   - Developer Tools navigation.
   - Windows offline verification.

6. **Git information**
   - Branch name.
   - Verified base commit.
   - Final local commit.
   - Working-tree status.
   - Confirmation that no merge or push occurred.

---

## 18. Acceptance Criteria

P2.2 is ready for owner review when:

- The 1920×1080 player interface follows the approved layout.
- Main Race View remains visually dominant.
- Compact Standings sits immediately beside Main Race View.
- Standings displays only position and stable name.
- Strategy Signs remain a single row at full-screen desktop width.
- Driver & Team Profile sits below Strategy Signs.
- Tactical Map, Race Radio, and simplified Race Controls occupy the right column in that order.
- Player-facing Race Controls contain only Start/Resume, Pause, and Follow Zoom.
- Removed player-facing diagnostic controls remain accessible in Developer Tools.
- All existing P2.1 gameplay and playback behavior is preserved.
- No new simulation, replay, persistence, or Worker regression is introduced.
- The standalone HTML builds and passes applicable offline tests.
- Test evidence and an owner playtest guide are supplied.

## 19. Stop Condition

Complete P2.2 implementation, testing, local commit, and delivery.

Then stop.

Do not proceed to P3, P4, management development, new artwork, or unrelated performance work.

Do not merge or push.

**Owner review and acceptance are required before further development.**