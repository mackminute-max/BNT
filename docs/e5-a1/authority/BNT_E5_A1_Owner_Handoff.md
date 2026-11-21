# CODEX IMPLEMENTATION HANDOFF
## Blood and Thunder — M2-E5-A.1
### Playable Stable, Provisional Content & Developer Tools Separation

**Assignment:** Focused E5-A follow-up  
**Status:** Authorized for implementation  
**Baseline:** E5-A implementation `4dad533211a88e0a1c36965ccf70d0d7459cb5c3`  
**Suggested branch:** `feat/m2-e5-a1-playable-stable`

---

## 1. Mission

Improve the existing E5-A Home Stable into a more intuitive, player-facing management experience.

The current implementation successfully exposes much of BNT's management architecture, but it still feels like a development workbench and lacks sufficient game content to demonstrate normal gameplay.

This assignment has three objectives:

1. Introduce a limited, usable package of provisional game content.
2. Improve navigation and management interactions to prioritize player decisions rather than technical operations.
3. Separate Developer Tools into a dedicated interface, accessible exclusively through the existing bottom Developer Tools button.

**This is an interface and content pass, not authorization to redesign BNT's gameplay systems.**

## 2. Authoritative Baseline

Verify the latest E5-A source, its accepted ancestors, and the current working tree before implementation.

Preserve all existing:

- Native race simulation and deterministic behavior.
- M2-D economy, personnel, contracts, and lifecycle systems.
- M2-E championship controllers and restrictions.
- E4 IndexedDB persistence, migrations, and recovery.
- P2.2 race presentation and practice mode.
- Existing developer editors, diagnostics, and testing controls.

Do not replace any functionality with code from `Blood-and-Thunder Alternate.html`.

The alternate remains a visual and interaction reference only.

Do not copy its gameplay content, numerical rules, economic calculations, race mechanics, or save architecture.

---

## 3. Provisional Playable Content

### 3.1 Objective

Introduce enough content to populate the Home Stable and demonstrate the existing management systems.

Use existing registries, approved content schemas, and initialization pathways.

Do not generate display-only personnel or equipment that cannot participate in actual gameplay.

### 3.2 Initial content targets

These are provisional content-production targets, not automatic grants to the player's stable.

| Category | Target |
|---|---|
| Drivers | 12 |
| Racing beasts | 24 individual beasts |
| Chariots | 8 |
| Specialist staff | 8–12 |
| Opposing racing teams | 8 |
| Equipment | Populate approved existing categories |
| Facilities | Use existing approved facility definitions |

The exact counts may be adjusted to fit existing capacity, registry, and recruitment constraints. Report any adjustment.

The content should provide variation in strengths, weaknesses, personalities, condition, price, and eligibility where supported by existing BNT rules.

**Do not change attribute scales, formulas, recruitment rules, or capacity limits to accommodate these targets.**

### 3.3 Starting stable versus recruitment market

Maintain a distinction between:

- Assets included in an approved starting package.
- Assets available for recruitment or purchase.
- Opponent-controlled assets.
- Future unlockable content.

Do not grant the entire provisional catalog to a new career.

Preserve the existing five approved starting packages and their mechanical effects.

Any new content should be made available through existing approved acquisition mechanisms. Do not silently alter package contents, starting funds, or career progression.

### 3.4 Content identity and world consistency

Use the established setting:

- World: Erf.
- Continent: Vaern.
- Major playable ancestries include humans, dwarves, elves, and orcs.
- Racing traditions should reflect the existing World & Racing Bible.

Use existing canonical nations and cultures where their definitions are available.

Do not invent permanent national lore, historical events, political relationships, or championship canon.

New personnel and team names should be marked as **provisional content** in source documentation.

Content may have:

- Names and short biographies.
- Ancestry.
- Team affiliation.
- Racing specialty.
- Personality traits.
- Visual-description metadata.
- Mechanical attributes supported by existing schemas.

Use temporary portrait and equipment graphics where needed.

Do not require finalized artwork.

### 3.5 Content validation

All provisional content must:

- Pass existing schema validation.
- Use valid identifiers.
- Avoid duplicate asset identities.
- Respect legal attribute ranges.
- Use existing recruitment and acquisition pathways.
- Survive save/export/reload.
- Preserve deterministic race behavior.
- Avoid breaking existing career saves.

If a content category lacks an approved production registry or acquisition mechanism, report the limitation rather than creating a parallel subsystem.

---

## 4. Player-Facing Home Stable

### 4.1 Presentation goal

The player should feel like the owner of a fantasy chariot-racing stable, not an operator of an internal simulation console.

Preserve the Dark Deco Retro Cartoon visual direction.

Prioritize:

- Stable identity.
- Recognizable personnel.
- Racing-unit presentation.
- Upcoming competition.
- Financial condition.
- Asset readiness.
- Meaningful player choices.

### 4.2 Home dashboard

Reorganize the dashboard around four primary questions:

**What is my stable's current condition?**

Show funds, roster readiness, personnel/equipment condition, and active championship status.

**Who is racing for me?**

Show the currently assembled Racing Unit, with driver, two beasts, chariot, and supported passenger information.

**What needs attention?**

Surface injuries, repairs, contract issues, training opportunities, and other actionable conditions.

**What do I do next?**

Present a prominent contextual next-action control, such as:

- Assemble Racing Unit.
- Prepare for Championship.
- Review Active Championship.
- Continue Current Event.

Only offer actions that are legal and supported by existing controllers.

Do not fabricate progression or enable unauthorized actions.

### 4.3 Roster management

Make roster interactions more contextual.

Each asset card should display the information needed to make management decisions without exposing unnecessary internal fields.

Examples:

**Driver:** Name, ancestry, portrait placeholder, relevant attributes, personality, condition, availability, contract status, and available actions.

**Beast:** Name, type, relevant attributes, condition, availability, and assignment.

**Chariot:** Name/model, class, equipment, durability, condition, and availability.

**Staff:** Name, specialty, employment status, supported benefits, and availability.

Provide contextual actions such as Select, Inspect, Train, Treat, Repair, or Release only where existing BNT APIs support them.

Keep detailed numerical diagnostics available in Developer Tools.

### 4.4 Player-facing terminology

Use terminology appropriate to a fantasy racing management game.

Avoid prominently displaying:

- Raw command names.
- Internal schema versions.
- Transaction revisions.
- Persistence generation identifiers.
- Developer-only error codes.
- Internal registry names.

Technical details must remain available for diagnostics.

Normal players should receive understandable explanations of requirements, costs, restrictions, and outcomes.

Do not hide important financial or gameplay consequences.

### 4.5 Finances and workshop

Replace generic command-driven presentation with contextual management where feasible.

For example:

- Repair damaged equipment from its equipment card.
- Treat injured personnel from their roster card.
- Review available facility improvements from the Workshop.
- Review recruitment opportunities from the relevant recruitment screen.

Continue using existing quote → confirmation → authoritative transaction workflows.

Do not create new economic calculations.

### 4.6 Championship presentation

Improve existing championship information presentation without implementing E5-B.

Present:

- Available championship offers.
- Eligibility.
- Entry costs.
- Event schedules.
- Current standings.
- Next-event context.
- Existing registration/preparation actions.

Do not add new championship rewards, scoring, settlement, or progression rules.

---

## 5. Developer Tools — Navigation Separation

This section contains explicit owner-approved interface requirements.

### 5.1 Remove Developer Tools from top navigation

**Developer Tools must not appear as a primary top-menu item.**

The top navigation is reserved for player-facing gameplay sections.

### 5.2 Preserve the bottom Developer Tools button

Retain the existing **Developer Tools** button at the bottom of the interface.

This button becomes the designated entry point to the developer interface.

Do not remove it, hide it behind keyboard shortcuts, or require console commands to access developer functionality.

### 5.3 Dedicated Developer Tools interface

Clicking the bottom button should open a distinct developer workspace.

The workspace may use its own navigation and pages.

Suggested organization:

| Developer page | Contents |
|---|---|
| Overview | Diagnostic summary, runtime status, current career and race context |
| Component Editor | Existing individual asset and component editing controls |
| Bulk Editor | Existing bulk-editing functionality |
| M2 Career Tools | Existing career inspection, management diagnostics, and controlled development operations |
| Race & Simulation | Existing race testing, configuration, and simulation diagnostics |
| Save & Recovery | Existing advanced import, export, migration, restore, and checkpoint tools |
| Logs & Diagnostics | Existing event logs, errors, validation, and available diagnostic outputs |

These are organizational categories, not authorization to invent new editors or diagnostics.

Preserve existing tools and arrange them into the most appropriate pages.

If a category has no existing functionality, omit the empty page.

### 5.4 Developer workspace navigation

Requirements:

- Dedicated navigation within Developer Tools.
- Clear page titles.
- No need to scroll through unrelated tools to reach a specific editor.
- A prominent **Return to Stable** control.
- Returning to the stable preserves the current player-facing navigation state.
- Entering Developer Tools does not mutate career state.
- Opening or closing developer pages does not restart a race or change persistence authority.

### 5.5 Preserve existing functionality

Audit the complete existing developer tool inventory.

Verify that all existing tools remain reachable and operational.

Pay particular attention to:

- Component Editor.
- Bulk Editor.
- M2 tools.
- Career-state diagnostics.
- Native race configuration.
- Simulation parameters.
- Existing import/export.
- E4 migration/recovery controls.

If a tool was previously available but is now inaccessible, restore access through the new developer workspace.

Do not replace a functioning editor with a static placeholder.

### 5.6 Development actions and save integrity

Preserve existing authorization and validation boundaries.

Developer edits must not bypass existing transaction rules unless an already-approved developer override explicitly supports that behavior.

Keep development overrides distinguishable from normal player actions.

Maintain existing save, rollback, diagnostic, and logging behavior.

Do not introduce a new persistence system.

---

## 6. Player Navigation Structure

Suggested top-level gameplay navigation:

1. Home Stable
2. Roster
3. Staff
4. Workshop
5. Championships
6. Career Records

Save/recovery controls should remain available to the player where needed, but advanced technical recovery and migration controls belong in Developer Tools.

The exact arrangement may be refined for usability.

The bottom Developer Tools button remains separate from the main navigation.

Do not remove ordinary player save/export capabilities merely to simplify the menu.

---

## 7. Preserve the Five Approved P3 Refinements

The following refinements remain approved and outstanding:

1. Restore 1× / 2× / 4× playback controls.
2. Restore convenient access to Component Editor, Bulk Editor, and M2 tools.
3. Establish shortest-practical-route driver AI preference.
4. Differentiate Seek Open Track from Race Defensively.
5. Hide visible lane markings without changing simulation geometry.

**Do not implement the P3 racing changes in E5-A.1.**

This assignment may improve developer-tool access, but it does not constitute final P3 acceptance for refinement 2.

Carry all five requirements forward into P3.

Do not mark them completed merely because related navigation work was performed.

---

## 8. Testing Requirements

### Content

Verify that:

- Provisional entities pass approved schemas.
- Existing starting packages remain mechanically unchanged.
- Market and owned assets remain distinct.
- Recruitment and purchases use existing transactions.
- Legal Racing Units can be assembled.
- Invalid combinations are rejected.
- Existing saves remain compatible.

### Player interface

Verify that:

- Home Stable presents a meaningful racing-unit and management overview.
- Roster and staff screens display real entities.
- Contextual actions use existing APIs.
- Disabled actions explain their restrictions.
- Financial transactions apply exactly once.
- Navigation does not modify game state.
- Relevant player actions are discoverable.

### Developer Tools

Verify that:

- Developer Tools is absent from top navigation.
- The bottom Developer Tools button remains visible.
- The button opens the dedicated workspace.
- Component Editor works.
- Bulk Editor works.
- M2 tools work.
- All previously available developer controls remain accessible.
- Returning to the stable preserves player navigation.
- Opening Developer Tools causes no state mutation.

### Persistence and regression

Run:

- Full configured Node tests.
- E4 persistence/recovery regression tests.
- Existing M2-D/M2-E compatibility tests.
- P2.2 presentation regression tests.
- Deterministic native race references.
- Browser UI tests at 1920×1080 and 1366×768.

Do not regenerate accepted reference outputs.

Use disposable test careers.

Do not modify real owner saves.

---

## 9. Deliverables

Provide:

**A. Updated standalone HTML**

Suggested filename:

`Blood-and-Thunder-E5-A1-Playable-Stable.html`

It must operate offline without a local server or external runtime dependencies.

**B. Implementation report**

Document:

- Verified baseline.
- Branch and commit.
- Files changed.
- Content added.
- Existing APIs reused.
- UI changes.
- Developer Tools inventory.
- Known limitations.
- Test results.

**C. Provisional content catalog**

List each new entity, its category, gameplay role, and provisional status.

Identify which content is actually available to new careers and which is market/opponent content.

**D. Developer Tools accessibility audit**

Map every existing tool to its new location.

Explicitly identify any missing, unsupported, or deferred functionality.

**E. Windows acceptance checklist**

Include:

- Offline direct-file launch.
- Career initialization.
- Roster inspection.
- Racing Unit assembly.
- Recruitment and purchases.
- Workshop operations.
- Championship inspection.
- Developer Tools navigation.
- Component/Bulk/M2 editor access.
- Save/reload.
- P2.2 practice launch.

---

## 10. Scope Restrictions

Do not implement:

- E5-B championship settlement.
- E5-C integrated career-to-P2.2 racing.
- New economy formulas.
- New recruitment mechanics.
- New personnel capacity rules.
- New simulation systems.
- P3 AI changes.
- P3 playback changes.
- P3 lane-rendering changes.
- Final production art.
- Unapproved permanent world lore.

Do not merge, push, release, or deploy.

Do not modify accepted race-engine golden references.

Do not automatically proceed into E5-B.

---

## 11. Completion Criteria

E5-A.1 is ready for owner review when:

1. The Home Stable presents populated, meaningful gameplay information.
2. Provisional content operates through actual BNT systems.
3. Player navigation is centered on stable management decisions.
4. Technical controls no longer dominate normal gameplay.
5. Developer Tools is removed from the top navigation.
6. The bottom Developer Tools button opens a dedicated, organized workspace.
7. All previously available developer functionality remains accessible.
8. Existing economy, championship, and persistence authorities remain intact.
9. The offline HTML builds and relevant regression tests pass.
10. The five P3 refinements remain explicitly tracked.

**Stop after E5-A.1. Return the deliverables and await owner testing and acceptance.**