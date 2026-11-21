# CODEX IMPLEMENTATION HANDOFF
## Blood and Thunder — M2-E5: Player-Facing Management and Championship Integration

**Assignment:** E5-A — Player-Facing Stable Management  
**Project:** Blood and Thunder (BNT)  
**Status:** Authorized to begin E5-A implementation, subject to repository verification  
**Development approach:** Preserve existing systems; build the player-facing experience around them.

---

# 1. Mission

We are resuming the M-series development roadmap to complete the stable-management and championship gameplay loop.

The immediate task is to implement **E5-A: Player-Facing Stable Management**.

This is the first stage of a revised four-stage M2-E5 plan:

| Stage | Scope |
|---|---|
| E5-A | Player-Facing Stable Management |
| E5-B | Championship Structure, Progression, and Settlement |
| E5-C | Integrated Career Gameplay Loop |
| E5-D | Acceptance and Stabilization |

**E5-A is the only implementation stage authorized by this prompt.**

Codex should establish the necessary navigation and interface contracts for E5-B, but must not implement championship settlement or independently redesign championship mechanics.

The objective is to replace the development-oriented management experience with a usable player-facing interface that connects directly to existing BNT career systems.

---

# 2. Critical Restriction: Alternate Prototype

The owner has provided:

**`Blood-and-Thunder Alternate.html`**

This file is provided **ONLY for visual inspiration, user-interface concepts, navigation ideas, and potential presentation patterns**.

It is not an authoritative BNT specification.

It is not a replacement implementation.

It is not an approved source of gameplay rules.

### Permitted uses

Codex may examine the alternate for:

- Stable dashboard organization.
- Navigation and screen hierarchy.
- Roster presentation.
- Asset selection cards.
- Championship selection presentation.
- Workshop presentation.
- Financial and career-statistic displays.
- Trophy and history presentation.
- General visual composition and usability ideas.

### Prohibited uses

Do not copy or integrate the alternate's:

- Race simulation.
- Driver AI.
- Combat mechanics.
- Racing-unit statistics or formulas.
- Economy calculations.
- Recruitment rules.
- Injury and recovery calculations.
- Upgrade mechanics.
- Championship scoring rules.
- Championship entry fees.
- Prize or reward values.
- Renown thresholds.
- Unlock requirements.
- Persistence or save system.
- Random-number generation.
- Strategy Sign behavior.
- Championship controller.
- Game-state authority.

**All gameplay functionality must use the existing BNT implementation and approved specifications.**

Do not transplant alternate JavaScript into the production application.

Do not create parallel controllers that compete with BNT's existing systems.

If an alternate UI element has no corresponding approved BNT functionality, it may be represented as a clearly labeled future feature, but it must not simulate or invent functionality.

The alternate's fictional locations and championship names are also not automatically canonical.

---

# 3. Authoritative Technical Foundation

Use the latest verified BNT repository state and the prior M2-E audit as the technical baseline.

Historical references to verify:

- M2-D payroll, lifecycle, economy, and stable viability.
- M2-E E1 championship-controller foundation.
- M2-E E2 championship setup and registration.
- M2-E E3 race orchestration and standings.
- M2-E E4 durable persistence and recovery.
- P1.5 buffered Worker playback.
- Accepted P2.2 race presentation.

The previously reported combined branch was:

`feat/p2-2-fullscreen-race-layout`

The previously reported accepted P2.2 runtime was:

`c235bf3ce0caed44a472cb0abd92104112f39586`

A subsequent audit reported a combined development HEAD of `9dd40d4`.

Verify these references before implementation. Do not assume they remain current.

### Required architecture

Preserve:

1. The native deterministic race engine as the authoritative race simulator.
2. The Worker as the owner of live race state and native race execution.
3. Existing race-event, replay, checkpoint, and digest contracts.
4. M2-D as the authority for established economy and personnel-lifecycle operations.
5. M2-E as the authority for championship state and orchestration.
6. E4 as the authority for durable career state, recovery, migration, and persistence.
7. P2.2 as the accepted race-presentation baseline.

The new interface must call the existing management APIs and validated transactions.

It must not directly mutate authoritative career-state objects.

---

# 4. Repository Preparation

Before editing code:

1. Inspect the working tree.
2. Verify the current branch and HEAD.
3. Identify the latest accepted combined baseline.
4. Confirm that M2-D and M2-E E4 modules are present.
5. Confirm that accepted P2.2 functionality is present.
6. Review existing management UI and API boundaries.
7. Review the E4 Career Save workflow.
8. Review approved management and championship specifications.

Preserve all existing local changes.

Create a dedicated E5-A feature branch from the verified baseline.

Suggested branch name:

`feat/m2-e5-a-stable-management-ui`

Do not merge, push, rebase, or alter unrelated branches.

If the expected baseline is missing, contradictory, or has uncommitted work that would be affected, stop and report the issue before implementation.

---

# 5. E5-A — Player-Facing Stable Management

## 5.1 Primary objective

Create a coherent, functional Home Stable interface that players use to manage their racing operation between championship events.

The interface should feel like the central management hub of Blood and Thunder, not a development console.

Use the established **Dark Deco Retro Cartoon** visual direction:

- Smooth, confident outlines.
- Strong silhouettes.
- Dark backgrounds.
- Angular Art Deco composition.
- Clear typography.
- Restrained high-contrast accents.
- Strong panel hierarchy.
- Readable status indicators.

Do not introduce pixel-art styling.

Do not require final character portraits, team logos, or animation assets.

Use simple temporary graphics and placeholders where necessary.

The interface must remain usable without external assets or network access.

## 5.2 Navigation structure

Use the alternate's broad organization as inspiration, but adapt it to BNT's actual systems.

Proposed primary sections:

### A. Stable Overview

The player's primary management dashboard.

Display available authoritative information such as:

- Stable identity.
- Current career status.
- Available funds.
- Personnel capacity.
- Racing-unit readiness.
- Active championship.
- Next scheduled event.
- Current championship standings.
- Personnel or equipment requiring attention.
- Pending management actions.
- Important restrictions or warnings.

Only display information supported by existing career state.

The dashboard should clearly distinguish permanent stable resources from temporary championship resources.

### B. Roster and Racing Units

Provide player-facing access to:

- Drivers.
- Racing beasts.
- Chariots.
- Eligible passengers, where supported.
- Current condition.
- Injuries.
- Fatigue.
- Equipment status.
- Assigned racing units.
- Available and unavailable assets.
- Racing-unit legality.

Use the existing racing-unit assembly and validation systems.

Preserve the approved requirement that a standard racing unit uses one driver, a two-beast team, and a chariot, with passenger roles dependent on unlocked classes and existing eligibility rules.

Provide clear explanations when a proposed racing unit is illegal.

Do not bypass roster capacity, injury restrictions, contract restrictions, or availability checks.

### C. Staff and Facilities

Expose existing functionality for:

- Employed specialists.
- Staff assignments.
- Facility availability.
- Approved projects.
- Training.
- Recovery services.
- Equipment services.
- Relevant staff capacity and scheduling.

Only make controls actionable where corresponding approved APIs exist.

If a system is planned but not implemented, do not invent a substitute.

### D. Finances and Operations

Present the existing economy in understandable player-facing terms.

Include supported information such as:

- Available funds.
- Wages and payroll obligations.
- Contract expenses.
- Upcoming liabilities.
- Stable viability.
- Approved purchases and services.
- Championship-specific budget allocations, where applicable.

All transactions must use the existing financial authority.

No direct balance edits or alternate-prototype economy logic.

### E. Championships

Create the navigation entry and initial player-facing championship context.

For E5-A, this may include read-only or existing-controller-backed information such as:

- Available championship offers.
- Active championship.
- Entry requirements.
- Current event.
- Schedule.
- Standings.
- Eligibility.
- Registration status.

Use the existing E2/E3/E4 championship APIs.

Do not implement new scoring, prize calculations, championship settlement, or progression rules in E5-A.

The complete championship experience belongs to E5-B.

### F. Career Records

Where supported by existing durable data, expose:

- Championship history.
- Previous results.
- Achievements.
- Trophies.
- Owner Legacy progress.

If authoritative data does not exist yet, reserve a navigation location without inventing historical records or progression.

---

# 6. Stable and Championship State Restrictions

The UI must enforce the existing distinction between:

**Home Stable:** Permanent management state, personnel, facilities, finances, and long-term development.

**Championship Run:** Registered competition, current event, standings, preparation restrictions, temporary resources, and run-specific progression.

Respect the existing E4 restrictions.

In particular:

- Management actions permitted before registration must remain available.
- Active-championship management restrictions must be enforced.
- Read-only management views must remain accessible where supported.
- Restricted actions must not be enabled merely because a UI control exists.
- UI disabling is not sufficient security or validation; the authoritative API must enforce the restriction.

Do not introduce new permissions or management windows without approval.

---

# 7. Functional UI Requirements

The interface must be functional, not merely a static mockup.

Where existing controllers support an action, connect the UI to them.

Examples include:

- Selecting available personnel.
- Assembling a legal racing unit.
- Viewing condition and equipment status.
- Accessing approved stable transactions.
- Reviewing championship eligibility.
- Inspecting active championship state.
- Viewing existing recovery or service options.
- Navigating to the current race-preparation workflow.

For every actionable control:

1. Identify the authoritative API.
2. Validate the action.
3. Execute through the existing transaction pathway.
4. Persist through the existing E4 coordinator where applicable.
5. Refresh the player-facing state.
6. Report success or failure accurately.

Do not optimistically display a transaction as completed before authoritative confirmation.

No decorative buttons that appear functional but do nothing.

For unsupported future functionality, use an explicit unavailable state rather than a fake implementation.

---

# 8. Presentation and User Experience

Design for desktop-first play, consistent with the accepted P2.2 interface.

Target the existing 1920×1080 desktop presentation while remaining usable at smaller desktop resolutions.

Requirements:

- Clear primary navigation.
- No unnecessary scrolling at the target resolution.
- Readable tables and asset cards.
- Consistent condition indicators.
- Clear financial information.
- Visible championship context.
- Explicit action confirmation where consequences are material.
- Useful explanations for disabled actions.
- Clear success and failure feedback.
- No accidental loss of player state during navigation.

The interface should visually belong to the same game as P2.2.

Do not redesign the accepted race interface as part of this assignment.

---

# 9. E5-B Interface Preparation

Although E5-B implementation is not authorized, E5-A must prepare the interface structure needed for it.

Document the required contracts for:

- Championship offer selection.
- Eligibility checks.
- Registration.
- Championship schedule.
- Race preparation.
- Official race publication.
- Championship points.
- Financial settlement.
- Personnel consequences.
- Event advancement.
- Championship completion.
- Elimination.
- Withdrawal.
- Persistent career records.

Identify which contracts already exist and which are missing.

Use the existing M2-E specifications as authority.

Do not adopt the alternate's numerical values or gameplay policies.

Produce a clear list of unresolved owner decisions needed before E5-B.

### Championship presentation design

Develop a first-pass player-facing presentation specification for:

- Championship selection cards.
- Championship details.
- Event schedules.
- Entry requirements.
- Prize and reward information.
- Standings.
- Event preparation.
- Results.
- Championship completion.

This can be a design specification or non-authoritative UI preview.

It must not introduce new production gameplay behavior.

---

# 10. Integration Boundaries

Do not change the following unless a narrowly scoped, necessary compatibility fix is identified and explicitly documented:

- Native race movement.
- Collision.
- Combat.
- AI utility.
- Personality.
- Weather.
- Fatigue formulas.
- Equipment wear.
- RNG.
- Native tick duration.
- Replay schema.
- Digest cadence.
- Strategy Sign semantics.
- Worker scheduling.
- P1.5 buffering rules.
- P2.2 race presentation.
- Championship settlement policy.
- Existing financial calculations.

Any necessary changes outside E5-A's scope must be reported rather than silently implemented.

Preserve deterministic compatibility and historical reference outputs.

---

# 11. Testing Requirements

Add focused tests for the new interface and its authoritative integration.

At minimum, verify:

### Stable management

- Stable state renders correctly.
- Roster and racing-unit information matches authoritative data.
- Legal racing-unit selections succeed.
- Illegal selections are rejected.
- Existing capacity and condition restrictions are respected.
- Financial operations use approved transaction pathways.
- Failed actions do not modify career state.

### Championship restrictions

- Pre-registration management works.
- Active-championship restrictions are enforced.
- Read-only management views remain available.
- Championship context is correctly displayed.
- No unauthorized settlement or championship progression occurs.

### Persistence

- Valid management changes survive save/reload.
- Failed transactions do not persist partial changes.
- Existing E4 migration and recovery behavior remains intact.
- Existing career saves remain compatible.

### Presentation

- Main navigation works.
- Relevant screens are reachable.
- Unsupported controls are visibly unavailable.
- No misleading success notifications occur.
- The layout remains usable at the target resolution.

### Regression

Run the existing relevant:

- M2-D tests.
- M2-E tests.
- E4 persistence and recovery tests.
- P1.5 deterministic compatibility tests.
- P2.2 presentation tests.
- Historical reference and checksum tests.

Report exact commands, counts, and exit codes.

Do not regenerate historical golden results.

Do not modify real owner career saves during testing.

---

# 12. Deliverables

Provide:

### A. Functional E5-A implementation

A working player-facing Stable Management interface integrated with existing BNT systems.

### B. Updated standalone playable HTML

Build the appropriate offline deliverable using the project's existing build process.

The artifact must not require a network connection, external runtime assets, or a local development server for ordinary play.

### C. E5-A implementation report

Include:

- Branch and commit.
- Verified baseline.
- Files changed.
- Features implemented.
- Existing APIs reused.
- Any newly introduced UI adapters.
- Known limitations.
- Test evidence.
- Offline build instructions.

### D. E5-B readiness report

Include:

- Proposed championship UI structure.
- Existing championship APIs.
- Missing integration contracts.
- Settlement dependencies.
- Required policy decisions.
- Recommended implementation order.
- Acceptance criteria.

### E. Owner testing checklist

Provide a practical Windows direct-file walkthrough covering:

- Opening the HTML.
- Stable overview.
- Roster inspection.
- Racing-unit assembly.
- Financial management.
- Championship inspection.
- Active-championship restrictions.
- Save/reload.
- Navigation and UI readability.

Clearly distinguish what can be tested in E5-A from features reserved for E5-B and E5-C.

---

# 13. Completion and Acceptance

E5-A is ready for owner review when:

1. The player can navigate a coherent Stable Management interface.
2. Implemented controls operate through existing authoritative BNT systems.
3. Existing management restrictions remain intact.
4. The interface distinguishes Home Stable from Championship Run state.
5. The interface provides a usable entry point for future championship integration.
6. Existing career persistence remains compatible.
7. The accepted P2.2 race interface is preserved.
8. Deterministic race and historical compatibility tests remain unchanged.
9. A standalone offline HTML artifact is produced.
10. An E5-B readiness report identifies the remaining championship and settlement requirements.

Passing automated tests does not constitute owner acceptance.

Windows direct-file testing must be reported separately from automated or HTTP-based browser testing.

---

# 14. Authorization Boundaries

**AUTHORIZED**

- E5-A Stable Management UI implementation.
- Necessary presentation adapters to existing approved management APIs.
- Focused E5-A tests.
- Offline HTML build.
- E5-B interface and requirements planning.

**NOT AUTHORIZED**

- E5-B championship progression implementation.
- E5-B race settlement implementation.
- E5-C integrated gameplay implementation.
- E5-D acceptance/stabilization work.
- Replacing any BNT system with alternate-prototype logic.
- New economy or progression formulas.
- Unapproved championship content.
- Changes to the native race engine.
- Changes to deterministic reference outputs.
- P3 Animation and Branding.
- P4 Visual and Performance Acceptance.
- Git merge, push, or release.

Do not automatically begin E5-B after completing E5-A.

---

# 15. Final Instruction

Implement **M2-E5-A** using the existing Blood and Thunder management architecture.

Use `Blood-and-Thunder Alternate.html` strictly as a **visual and interface inspiration source**.

Preserve all established BNT gameplay systems, deterministic simulation, career state, financial authority, and persistence.

The result should be a usable Home Stable management experience that prepares the game for E5-B's championship structure, progression, and settlement.

Return the implementation report, E5-B readiness findings, standalone HTML location, and Windows owner testing checklist.

**Stop after E5-A and await owner acceptance before proceeding.**