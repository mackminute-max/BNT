# CODEX IMPLEMENTATION HANDOFF
# Blood and Thunder — P2.1 Player-Facing Race Interface

## 1. Mission

Implement **P2.1 — Player-Facing Race Interface**, a focused presentation and user-interface refinement of the completed P2 Static Visual Proof.

The owner has playtested P2 and reports that performance and readability are acceptable. Performance feels comparable to the previous accepted corrective pass. **Do not initiate another performance optimization effort unless a demonstrable new regression is introduced by P2.1.**

The objective is to transform the current development-oriented race page into a layout resembling the eventual player-facing Blood and Thunder racing experience.

Use the existing game's full-game presentation, where available in the repository, as the initial organizational reference. Adapt its layout to the current P2 renderer and controls rather than copying outdated code or reintroducing older rendering systems.

The current **BNT In-Race Presentation & Asset Guidelines v1** and P2 implementation remain governing technical references.

This is a UI/layout milestone, not a simulation, gameplay, animation, career-system, or art-production milestone.

## 2. Baseline and branch discipline

Repository: `https://github.com/mackminute-max/BNT.git`

P2 branch: `feat/p2-static-visual-proof`

P2 runtime commit: `ec25d77eea6523edba1cb1920d73c0dc7502b8c3`

P1.5 delivery baseline: `04df5efba874b5889bb1c8e8e6920918c8df00e1`

Protected P1.5 runtime: `5d556f3adca146a6c17996234e34dcf4e98899db`

Before modifying anything:

1. Inspect the actual repository state and identify the P2 implementation and any subsequent documentation/evidence commits.
2. Confirm the intended P2 source and tests are present.
3. Record the current HEAD and working-tree status.
4. Preserve unrelated, untracked, or owner-created files.
5. Create a local working branch named `feat/p2-1-player-race-interface` from the verified P2 baseline, unless the existing checkout already contains an appropriately named P2.1 branch.
6. Do not overwrite accepted P1.5 or P2 deliverables.

Do not assume the runtime commit is the current HEAD. Verify the checkout and report any unexpected divergence before making changes.

No merge, push, publication, release, or owner-save migration is authorized.

## 3. Non-negotiable architectural constraints

Preserve:

- Authoritative native simulation, AI, combat, fatigue, collision, RNG and race rules.
- P1.5 buffered Worker execution and chronological presentation.
- P1.5 Worker protocol, buffer credit, pause, step, restart, failure recovery and replay behavior.
- Existing Strategy Sign command acceptance, activation, opportunities, replacement, cancellation and acknowledgment semantics.
- P2 orthographic close-follow renderer and shared native geometry.
- Separate full-course tactical map.
- Existing asset manifest, safe SVG profile, asset fallbacks and bounded caches.
- Deterministic race results, replay exports and checkpoints.
- E4 durable championship authority and persistence semantics.
- Single-file offline HTML deliverables.
- Existing development/testing functionality.

No new runtime dependencies, external asset services, fonts, frameworks or rendering engines.

Do not modify native simulation to satisfy a presentation requirement.

All UI values must come from existing authoritative or chronologically presented data. Do not introduce fabricated race state.

## 4. Approved player-facing layout

The default desktop page must prioritize the racing experience over development controls.

Use this information hierarchy:

1. Compact game header and current race information.
2. Dominant Main Race View.
3. **Dedicated single-row Strategy Signs bar immediately beneath the Main Race View.**
4. Supporting race information: tactical map, standings, driver profile, and radio commentary.
5. Race Controls panel containing Start Race, pause, step, playback speed and replay/restart controls.
6. Developer Tools navigation at the bottom of the player page.

The Main Race View should remain the largest and most prominent visual component.

For desktop/full-screen layouts, organize supporting panels into adjacent columns or a sidebar when this improves space efficiency. Avoid forcing every secondary component into a long vertical stack.

Preserve the existing Dark Deco Retro Cartoon visual direction: confident silhouettes, strong contrast, angular framing, restrained decorative architecture and readable text.

This pass is about composition and functional hierarchy, not final art approval.

### Responsive layout

At the default desktop/full-screen resolution:

- Main Race View is visually dominant.
- All six Strategy Sign buttons fit in one horizontal row.
- Tactical map, standings, driver information and commentary are accessible without excessive scrolling.
- Race Controls are grouped coherently.
- No horizontal page overflow.

At narrower desktop/tablet widths:

- Supporting panels may rearrange or stack.
- Strategy Sign buttons may wrap to two rows if necessary.
- Preserve readable labels and usable hit targets.
- The main viewport must not be compressed into an unusable size.

At narrow/mobile widths:

- Prioritize functional access and no horizontal overflow.
- A stacked layout is acceptable.
- Do not sacrifice correctness for a desktop-only composition.

Test at minimum 1440, 1024, 768 and 390 CSS-pixel viewport widths.

## 5. Dedicated Strategy Signs bar

This is a specifically approved owner requirement.

Place the Strategy Signs bar **directly below the Main Race View**, aligned to the width of that viewport or its primary content column.

At the default full-screen desktop layout, display all six existing Strategy Sign options in **one single horizontal row**.

Use the actual existing Sign catalog and labels. Do not substitute the illustrative names used in earlier layout sketches.

### Layout

- Compact horizontal panel.
- Small title: STRATEGY SIGNS.
- Remaining opportunities clearly visible.
- Six evenly distributed buttons/cards in one row.
- Target button height approximately 40–48 CSS pixels where practical.
- Avoid oversized cards, unnecessary descriptions and excessive vertical padding.
- Queue Sign action integrated into the same bar, ideally in a compact adjacent action area or aligned beneath the row only if necessary.
- The bar must consume as little vertical space as practical while remaining readable and accessible.

The owner specifically rejected a default two-row desktop layout because it consumes too much vertical screen space.

### Functional states

Clearly distinguish:

- Available
- Selected
- Queued
- Active
- Unavailable

Use text, border, icon or shape distinctions rather than color alone.

Preserve the existing distinction between a locally selected Sign, a Worker-acknowledged queued Sign and a Sign that has actually become active in the presented race timeline.

Do not display a Sign as active before its activation is visible in the authoritative presented timeline.

Selecting a Sign must not automatically spend an opportunity.

The existing Queue action remains the authoritative command submission mechanism.

Do not change delayed acknowledgment, activation boundaries or pending-command behavior.

### Responsive behavior

At full-screen desktop width: six buttons, one row.

At smaller widths: wrapping to two rows is permitted when needed.

Do not introduce horizontal scrolling for the normal desktop layout.

## 6. READY / SET / GO! countdown

Replace the existing visible numeric countdown with:

**READY**

**SET**

**GO!**

The purpose is to give the player a clear visual start sequence while the existing P1.5 Worker prepares and fills its playback buffer.

### Requirements

- Use the existing countdown/pre-roll state machine.
- Do not alter simulation tick advancement or race-start authority.
- Display READY and SET prominently over the Main Race View.
- GO! must correspond to the actual beginning of presented race playback, not merely to an arbitrary timer expiring.
- If Worker preparation or buffering takes longer than expected, hold at SET or use an equivalent honest waiting indication.
- Never display GO! while playback remains blocked.
- Do not allow the visual countdown to skip or duplicate simulation ticks.
- Pause/restart/failure handling must remain consistent with existing P1.5 behavior.
- Ensure a restarted race displays the sequence correctly.
- The countdown must work offline.

Use simple DOM/CSS or existing Canvas presentation mechanisms. No animation framework is required.

For reduced-motion users, display the same words without unnecessary transitions.

## 7. Driver profile panel

Create a player-facing Driver Profile panel using existing available race data.

### Contents

- Driver portrait using the P2 asset system, with existing fallback behavior.
- Driver identity/name where available.
- Team or racing-unit identity where available.
- Health/condition indicator.
- Fatigue or exertion indicator.
- Relevant existing status information.
- Reserved space for future run-specific buffs and effects.

### Data authority

Inspect the actual available native and presentation-state fields before implementation.

Do not assume that driver health, driver strain, beast fatigue and overall RU condition are interchangeable.

Where separate authoritative values exist, label them accurately.

If a requested metric is not currently available through the approved presentation state, display an appropriate neutral placeholder or use the closest correctly labeled existing metric.

Do not invent numeric health or fatigue values.

Do not modify the Worker protocol, simulation schema or durable championship data merely to populate the panel.

### Buff/effect slots

Reserve a compact visual area for future between-race buffs, upgrades or temporary run effects.

For P2.1:

- Slots are presentation placeholders only.
- No new buff mechanics.
- No persistence.
- No fictional active effects.
- No invented stat modifiers.
- No new event authority.

Use neutral empty-slot visuals or a clear "No active effects" placeholder.

The structure should accommodate future data-driven indicators without requiring another complete panel redesign.

## 8. Radio commentary window

The existing race radio/commentary feed must be placed inside a **fixed-height, independently scrolling window**.

### Requirements

- The commentary panel must not grow indefinitely as new events arrive.
- New commentary remains in chronological presented order.
- The visible commentary window scrolls independently from the rest of the page.
- Auto-scroll to the newest commentary only when the player is already at or near the bottom.
- If the player scrolls upward to review older messages, preserve their scroll position as new commentary arrives.
- Provide a simple way to return to the latest commentary if useful.
- Maintain readable event timestamps/ticks and existing event-priority styling.
- Preserve combat and important-event emphasis without creating new event categories or simulation authority.
- Avoid unnecessary DOM rebuilds that reset scroll position.

The panel should resemble a contained race-radio transcript rather than an expanding development log.

Keep existing event chronology and Worker-buffer alignment intact.

## 9. Race Controls panel

Keep Race Controls in their existing general location in the approved revised layout.

This panel should contain the existing functional controls, including:

- Start Race.
- Pause/resume.
- Single-step.
- Playback speed selection.
- Replay/restart controls.
- Existing relevant playback state indicators.

**Do not place the six Strategy Sign selection buttons in Race Controls.**

The Strategy Signs have their own dedicated bar beneath the Main Race View.

Start Race and other race controls should be grouped in the same visual frame as the replay/playback controls, rather than scattered across separate preparation and playback sections.

Use existing handlers and protocol messages. Reorganize the DOM and styling without duplicating command paths.

Ensure disabled/loading/pending states remain accurate.

## 10. Separate Developer Tools view

Move development-only controls out of the default player-facing page.

Provide a clearly labeled **Developer Tools** button or link at the bottom of the player page.

This should open a separate tab/view within the same offline HTML application, or a separate internal page implemented without external resources.

A lightweight internal view is preferred over introducing a routing framework.

### Developer Tools contents

Retain all existing diagnostic and test controls, including those available in the current P2 build:

- Race seed.
- Course/format/weather configuration where currently diagnostic.
- Entrant count and lap settings.
- Worker versus synchronous execution.
- Player ratings and build presets.
- Driver personality.
- Pacing policy.
- Existing replay, diagnostic, test and state inspection tools.
- Any other current development-only settings.

Inspect the actual application and preserve functionality rather than relying solely on this list.

### Behavioral requirements

- The default player page should present a reasonable ready-to-race configuration.
- The Developer Tools view must permit the same reproducible testing as before.
- Changes to development settings must apply through the existing preparation flow.
- Navigating between views must not restart, pause or alter an active race unless explicitly requested by the player.
- Returning to the race page must preserve the current presented race state.
- Do not duplicate simulation or create a second race instance.
- The Developer Tools view must function from the single-file offline HTML.
- Provide a clear Return to Race control.

Avoid exposing developer diagnostics in the primary racing layout unless they are directly useful to the player.

## 11. Tactical map and standings

Retain the existing P2 full-course tactical map.

It must:

- Show the complete course rather than following the player.
- Display all entrants.
- Clearly distinguish the player.
- Preserve existing start/finish and Rally Sign Point markers.
- Remain synchronized with the presented race state.

Keep standings visible and readable.

Reorganize tactical map and standings panels as necessary for the new layout, but do not alter their authoritative data sources.

Do not introduce invented positions, distances, rankings or race events.

## 12. Presentation styling and accessibility

Apply the existing Dark Deco Retro Cartoon presentation language.

Use:

- Strong panel hierarchy.
- Angular or restrained Art Deco framing.
- Bold but readable typography.
- Clear status differentiation.
- Consistent spacing.
- Compact controls.
- Visible keyboard focus.
- Accessible labels.
- Adequate contrast.
- Reduced-motion compatibility.

Continue using existing system-font fallbacks unless approved licensed fonts are already available in the source.

Do not download or introduce third-party art or fonts.

Do not expand into final team branding, racer animation, equipment catalogs or new art-production systems.

## 13. P2/E4 compatibility

The P2 shared presentation layer also supports the isolated E4 durable championship companion.

Preserve this integration.

If layout changes are applied to the durable companion, ensure:

- The same shared renderer remains usable.
- The E4 viewer displays only committed frames.
- Prepared but unacknowledged state is not shown.
- Pending or failed durable writes do not advance the displayed race.
- No owner career save is accessed or migrated.
- Original fallback rendering remains available.
- No persistence or career schema changes are made.

Do not force new P2.1 UI requirements onto the durable companion where its available state cannot support them.

The companion is a developer visual proof, not a new management release.

## 14. Testing requirements

Run the existing test suite and relevant P2 harnesses.

At minimum verify:

### Simulation and deterministic integrity

- Historical replay checksums unchanged.
- Native Worker equivalence unchanged.
- Checkpoint compatibility unchanged.
- Full browser replay classifications and checksums unchanged.
- No new Worker protocol messages.
- No changes to authoritative Sign behavior.

### Countdown

- READY / SET / GO! order.
- Delayed Worker preparation.
- GO! synchronized with actual playback.
- Pause and restart behavior.
- No premature or duplicate race advancement.

### Strategy Signs

- Six buttons in one row at default desktop width.
- Correct selected/queued/active/unavailable states.
- Correct remaining opportunities.
- No spending on selection alone.
- Existing Queue action still works.
- Delayed acknowledgment and activation display correctly.
- Responsive wrapping only when required.

### Driver profile

- Correct authoritative values and labels.
- Graceful fallback for unavailable metrics.
- Portrait fallback.
- Empty buff slots.
- No fabricated status effects.

### Radio commentary

- Fixed-height scrolling container.
- Chronological order.
- Auto-scroll when at bottom.
- Preserved scroll position when reading older entries.
- Correct behavior through pause, restart and race completion.

### Developer Tools

- All existing controls remain available.
- Settings still reproduce deterministic test scenarios.
- Switching views does not restart or modify the race.
- Returning to Race restores the current display.
- No duplicate race initialization.

### Layout

Test at:

- 1440 CSS px.
- 1024 CSS px.
- 768 CSS px.
- 390 CSS px.

Verify no horizontal overflow, clipped critical controls or unusable Sign buttons.

### Performance

Perform a bounded regression check against the accepted P2 build.

Prioritize:

- C01, eight entrants, Combat, 4×.
- Long Rally, eight entrants, Combat, 4×.

Do not reopen P1.4/P1.5 optimization work for inherited hitches.

Report new regressions separately from known baseline behavior.

### Standalone

Build the P2.1 single-file playable HTML.

Verify:

- All CSS, JavaScript, images and Worker code are embedded.
- No runtime network dependency.
- Existing offline fallback behavior preserved.
- Windows direct-file behavior remains an owner acceptance item if the test environment cannot exercise it.

## 15. Existing known issues

The P2 test report identified:

1. An inherited Node/Chromium seed-145 Long Rally checksum discrepancy.
2. A legacy P1.1 browser assertion expecting zoom `6` while P2 uses `8`.
3. Windows direct-file acceptance not yet established in the managed Chromium environment.
4. Occasional inherited Worker/digest and frame-time spikes.

Do not silently change accepted reference data or native simulation to make these issues disappear.

For the legacy zoom assertion, determine whether it is testing a required behavior or merely an outdated presentation default. Preserve meaningful compatibility assertions and report the disposition.

Do not weaken tests to manufacture a green result.

## 16. Deliverables

Produce:

1. **P2.1 standalone playable HTML** with the revised player-facing race layout.
2. Updated source files on the local P2.1 branch.
3. Automated tests covering the new UI behavior.
4. A concise implementation report mapping requirements to code changes.
5. A test-evidence report containing actual commands, exit codes, failures and known limitations.
6. A short owner playtest guide describing the controls and the recommended acceptance scenarios.

Use a clearly identified P2.1 artifact filename, such as:

`Blood-and-Thunder-P2.1-Playable.html`

Do not overwrite the accepted P2 artifact.

Include commit identifiers, artifact sizes and checksums.

If any requested UI feature cannot be implemented without changing protected simulation or persistence code, stop that feature and report the conflict rather than crossing the boundary.

## 17. Completion and stop condition

The implementation is complete when:

- The page resembles a player-facing race interface rather than a developer harness.
- The Main Race View remains dominant.
- Six Strategy Signs appear in one compact row at default desktop width.
- Strategy Signs occupy their own bar directly beneath the Main Race View.
- Race Controls remain grouped separately.
- READY / SET / GO! replaces the visible numeric countdown.
- The driver profile displays correctly labeled existing health/condition and fatigue/exertion information.
- Future buff slots are reserved without implementing buff mechanics.
- Radio commentary is contained and independently scrollable.
- Developer Tools are accessible from the bottom of the player page.
- Existing P1.5/P2 functionality and deterministic behavior are preserved.
- The standalone build remains self-contained and offline-capable.
- Regression results and limitations are documented.

**Stop after implementation, testing and local delivery.**

Do not merge, push, publish, begin P3/P4, or make unrelated gameplay changes.

The owner will review the P2.1 playable build and provide the next acceptance decision.