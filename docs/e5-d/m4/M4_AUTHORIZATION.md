# BLOOD AND THUNDER
# CODEX IMPLEMENTATION AUTHORIZATION
## M4 — Codebase Cleanup, Functional Run Rewards & Owner Legacy Progression

**Authorization:** Approved for implementation  
**Development package:** M4-A + M4-B + M4-C  
**Reference baseline:** E5-D M3-UI-P1, locally tested playable build  
**Delivery target:** Standalone, self-contained, offline HTML game

---

# 1. OBJECTIVE

Implement M4 as a single integrated development cycle consisting of:

- **M4-A:** Remove obsolete code, superseded UI, historical compatibility systems and unnecessary technical debt.
- **M4-B:** Replace placeholder Run Rewards with functional championship-scoped effects.
- **M4-C:** Implement functional Owner Legacy progression, Legacy Points currency, Legacy Upgrades in the Market, Legacy Management on Home Stable, and championship completion bonus choices.

These are components of one development package, not separate user acceptance milestones.

Complete the integration, regression testing, and delivery of the combined M4 package before requesting final acceptance.

Preserve all currently functional gameplay and accepted M3-UI-P1 workflows except where this authorization explicitly changes them.

Do not implement unrelated major gameplay systems.

# 2. SOURCE AUDIT AND IMPLEMENTATION AUTHORITY

Before modifying the game, inspect the actual current source and identify:

1. The authoritative career and stable state.
2. The current save schema and persistence transactions.
3. Championship registration, progression, conclusion and settlement.
4. Existing Run Reward offer generation, selection, publication and receipts.
5. Existing Legacy Reward offers and Owner Legacy progression.
6. Market categories, purchase commands, quotations and validation.
7. Home Stable Hero Panel, management sections and navigation.
8. Registered Racing Unit composition and attribute resolution.
9. Race simulation, deterministic RNG, AI, damage and condition systems.
10. Existing automated tests and development tooling.

Use the actual codebase contracts as implementation authority.

The numerical values and effect descriptions in this document are design targets. Map them to existing supported mechanics and attributes rather than inventing unsupported field names or bypassing authoritative systems.

Routine technical decisions, balance configuration, internal naming and implementation details are delegated to Codex.

If a proposed effect cannot be implemented without introducing an entirely new major gameplay subsystem, substitute the nearest meaningful supported effect and document the substitution.

Do not silently alter significant player-facing decisions, championship rules, or the approved progression structure.

# 3. M4-A — LEGACY CODE AND OBSOLETE SYSTEM CLEANUP

## 3.1 Development compatibility policy

Blood and Thunder is under active development.

**Backward compatibility with save files from previous development builds is not required.**

Codex is authorized to remove:

- Previous-version save migration and compatibility handlers.
- Historical schema adapters and obsolete persistence fields.
- Old initialization and upgrade workflows.
- Retired management interfaces and navigation routes.
- Duplicate transaction panels.
- Superseded event handlers and unused components.
- Unreachable code and abandoned configuration options.
- Tests that exclusively validate intentionally retired behavior.
- Historical compatibility warnings that no longer apply.

Do not maintain old-save compatibility solely for its own sake.

The current supported save format must remain reliable.

If the new implementation changes the current save schema incompatibly, use an explicit version boundary. Incompatible saves must fail clearly and safely rather than being misinterpreted or partially loaded.

No silent corruption, partial migration or unintended economic transactions.

## 3.2 Specific cleanup targets

Investigate remaining instances of:

- The former **Review Selected Work** interface.
- Old initialization warnings and manual activation requirements.
- Historical career upgrade controls.
- Redundant Market transaction routing.
- Duplicated management panels.
- Obsolete reward placeholders.
- Retired navigation and UI components.
- Compatibility-only code paths.

Remove confirmed obsolete functionality from the actual implementation, not merely from the visible interface.

Retain legitimate work and project management under Recovery & Services.

Retain necessary developer diagnostics in Developer Tools.

## 3.3 Cleanup boundaries

Preserve:

- Current deterministic racing simulation.
- Existing AI and racing behavior.
- Strategy Sign activation and accounting.
- Championship registration and settlement authority.
- Current economy, payroll and transaction validation.
- Recruitment, roster and asset ownership rules.
- Current-version save integrity.
- Accepted M3-UI navigation and player workflows.
- Current seeded race restart behavior.
- Existing content and metadata integrations.

Do not confuse obsolete technical legacy code with the active **Owner Legacy gameplay system**.

Do not prematurely remove functioning systems that are awaiting future replacements.

# 4. M4-B — FUNCTIONAL RUN REWARDS

## 4.1 General behavior

Replace placeholder Run Reward effects with functional rewards.

Preserve the existing deterministic three-choice Run Reward offer and selection lifecycle.

Rules:

- One reward is selected from each eligible offer.
- Effects apply to the current championship only.
- Persistent Run modifiers expire when the championship concludes.
- Run Rewards do not permanently modify base asset attributes.
- Rewards must not retroactively affect completed races.
- Reward selection and effect application must be authoritative and exactly-once.
- Existing eligibility, publication and settlement rules remain intact.

Do not introduce a separate Run Reward currency.

## 4.2 Reward stacking

**Identical rewards may be selected repeatedly and stack.**

Examples:

- Focused Training selected three times provides three instances of its Driving bonus.
- Different compatible rewards also stack.
- Existing attribute caps and mechanical limits remain authoritative.

Each selection must have its own durable receipt.

Do not exclude a reward from later offers merely because it was previously selected.

However, the same exact reward should not appear twice within one three-choice offer.

Stacking order must be deterministic.

## 4.3 Offer composition

Generate three distinct eligible choices using deterministic weighted selection across mixed reward categories.

Do not force every offer into a fixed performance/recovery/economy distribution.

The existing reward generator and seeded lifecycle should remain authoritative.

Eligibility must account for whether the reward can currently provide a valid benefit.

## 4.4 Reward scope

Performance rewards apply to the registered championship Racing Unit.

Use the authoritative registered driver, beasts, chariot and relevant equipment.

Do not permit temporary rewards to transfer freely between stable assets.

Apply persistent bonuses through effective-value resolution or another deterministic modifier mechanism.

Do not overwrite permanent base attributes.

## 4.5 Initial reward catalog

Implement the following 21 rewards across seven categories.

Values are provisional configuration targets.

### A. Driver Development

**Focused Training**
- +5 effective Driving for the registered driver.
- Persistent through the current championship.

**Combat Drills**
- +5 effective driver Combat.
- Persistent through the current championship.

**Iron Nerves**
- +5 effective driver Nerve or the nearest supported control/pressure attribute.
- Persistent through the current championship.

### B. Beast Conditioning

**Conditioning Regimen**
- +5 to the existing endurance or sustained-performance attribute.
- Applies to both registered beasts.
- Persistent through the championship.

**Veterinary Care**
- Immediately restore 15 condition to each registered beast.
- Respect maximum condition and existing recovery rules.

**Surefooted Team**
- +5 to an existing beast handling, traction or control attribute.
- Applies to both registered beasts.
- Persistent through the championship.

### C. Chariot Improvements

**Reinforced Frame**
- +10 effective structural durability or the nearest supported structural-protection benefit.
- Championship-scoped.

**Balanced Axles**
- +5 effective chariot handling or stability.
- Championship-scoped.

**Emergency Repairs**
- Immediately restore 20 chariot condition.
- Respect maximum condition and existing damage rules.

### D. Equipment

**Hardened Fittings**
- Reduce applicable equipment or component wear by approximately 10%.
- Championship-scoped.

**Sharpened Implements**
- +5 effective offensive equipment performance where applicable.
- Championship-scoped.

**Protective Harness**
- Modestly reduce applicable beast injury probability or severity.
- Championship-scoped.

### E. Racing Insights

**Track Familiarity**
- +5 effective Racing Unit handling.
- Championship-scoped.

**Aggressive Tactics**
- +5 effective offensive contest performance.
- Championship-scoped.
- Do not permanently alter AI personality.

**Defensive Formation**
- +5 effective defensive contest performance.
- Championship-scoped.

### F. Support and Recovery

**Rapid Recovery**
- Immediately restore 10 condition to the registered driver and both beasts, subject to existing recovery rules.

**Field Repairs**
- Immediately restore 15 chariot condition and eligible equipment wear, within existing repair mechanics.

**Emergency Medical Contract**
- Immediately execute an eligible treatment at 25% below its normal Gold cost.
- Display the exact treatment, original cost, discounted cost and result before selection.
- Use existing authoritative treatment and payment commands.

### G. Trading Opportunities

**Sponsor Purse**
- Immediately grant 100 Gold to the current championship's spendable budget.

**Supplier's Bargain**
- Immediately acquire eligible equipment at a 15% discount.
- Use existing purchase, inventory and payment authority.
- Display the exact item and price before selection.

**Prize Negotiation**
- Immediately grant 100 Gold to the current championship's spendable budget.
- This is a direct payment, not a conditional future prize modifier.

Sponsor Purse and Prize Negotiation may share a mechanical grant operation but remain separately identified catalog rewards.

## 4.6 Immediate discounted transactions

Conditional discounts that require an unspecified future opportunity are not permitted.

A discounted reward must execute its transaction immediately when selected.

Requirements:

- The target service or item must exist.
- The transaction must be currently legal.
- The player must be able to afford the discounted price.
- The complete effect and cost must be visible before confirmation.
- Selection, payment and delivery must be atomic.
- Failure must not consume the reward selection or charge Gold.
- No duplicate purchases or treatments may occur on retry or reload.

If no valid target exists, exclude that reward from the offer pool.

If the current reward interface cannot safely support target selection, extend it minimally with an embedded target picker and confirmation.

Do not route the player through an obsolete generic Review Selected Work screen.

## 4.7 Run Reward presentation

Each offer must show:

- Reward name and category.
- Exact numerical effect.
- Affected assets.
- Immediate or persistent application.
- Duration.
- Any Gold cost.
- Relevant eligibility or condition limitations.

Provide an **Active Run Rewards** summary in the championship management interface.

Repeated identical rewards should show their cumulative effective bonus while retaining individual receipt records.

Do not expose raw internal attribute keys or implementation terminology in ordinary player-facing text.

# 5. M4-C — OWNER LEGACY PROGRESSION

## 5.1 Core progression model

Legacy Points (LP) are a permanent, spendable progression currency belonging to the stable.

LP persists between championships.

LP is separate from Gold, Reputation and XP.

The player spends LP in the Market's new **Legacy Upgrades** category.

Legacy purchases should represent substantial, earned progression milestones rather than frequent minor improvements.

Preserve the approved distinction between:

1. **Permanent Legacy Upgrades:** Always-active unlocks or stable improvements that do not occupy loadout slots.
2. **Active Legacy Perks:** Purchased permanently but effective only when equipped in one of three Legacy slots.

Purchased upgrades and perks remain owned across championships.

Do not allow duplicate purchases of nonrepeatable upgrades.

## 5.2 Championship completion reward choices

Replace the previous automatic championship LP award model.

There is **no guaranteed LP for merely completing a championship**.

At an eligible championship conclusion, present a placement-based completion bonus choice.

### First place

The player chooses one:

- **2 Legacy Points**
- Bonus Gold
- Bonus Reputation

### Second or third place

The player chooses one:

- **1 Legacy Point**
- Bonus Gold
- Bonus Reputation

### Fourth place or lower

The player chooses one:

- Bonus Gold
- Bonus Reputation

Do not display a selectable zero-LP option.

### Withdrawal or elimination

No championship completion bonus is granted.

Preserve any ordinary race or championship awards already legitimately earned under existing rules.

### Important payout distinction

Bonus Gold and bonus Reputation are **additional to the normal awards** from the championship and its events.

Do not replace, deduct or suppress existing normal payouts.

The player selects only one completion bonus.

LP is granted only when the player selects the LP option.

## 5.3 Bonus Gold and Reputation scaling

Use configurable amounts based on:

- Championship difficulty or tier.
- Final placement.
- Existing authoritative championship characteristics.

Do not invent or replace existing championship eligibility thresholds.

Implement a bounded, transparent reward table or deterministic formula.

The completion interface must show the exact bonus amount before selection.

Gold must be credited to the appropriate persistent stable treasury, not a concluded championship's temporary budget.

Reputation must be credited through the existing authoritative Reputation system.

## 5.4 Achievement rewards

Preserve existing legitimate achievement-based rewards and unlocks.

Achievements may grant LP or permanent content unlocks independently when explicitly defined by the achievement.

Achievement awards require exactly-once receipts.

Do not create automatic LP grants for participation, podium finishes or wins outside the approved completion-bonus choice.

Do not allow overlapping legacy reward handlers to award LP twice for the same championship result.

## 5.5 Legacy reward offer integration

Reuse the existing authoritative post-championship Legacy reward selection lifecycle.

Replace the previous placeholder or randomized Legacy reward content with the approved placement-based completion bonus options.

Do not create a second mandatory reward-selection screen for the same championship conclusion.

Preserve:

- Eligible conclusion timing.
- Deterministic option amounts.
- Pending selection persistence.
- Exactly-once grants.
- Durable receipts.
- Safe reload and retry behavior.

A player must not receive multiple completion bonuses by reopening or replaying the conclusion interface.

# 6. LEGACY UPGRADES MARKET CATEGORY

## 6.1 Market integration

Add **Legacy Upgrades** as a selectable Market category.

Use the existing Market interface and authoritative transaction infrastructure.

Each upgrade card must display:

- Upgrade name.
- Permanent or Active classification.
- LP purchase cost.
- Exact functional effect.
- Unlock prerequisites.
- Ownership status.
- Affordability.
- Purchase action or reason unavailable.

Purchases deduct LP, not Gold.

Do not route Legacy purchases through obsolete generic transaction panels.

Purchased upgrades should be visibly marked as owned.

## 6.2 Initial Legacy upgrade catalog

The following is the initial target catalog.

Costs are deliberately substantial relative to championship LP earning rates.

### Permanent Legacy Upgrades

**Veteran Recruiters — 4 LP**
- Expand the eligible recruitment selection by one candidate where supported.

**Master Engineers — 4 LP**
- Unlock improved chariot construction or engineering options using the existing supported catalog.

**Beastmaster's Legacy — 4 LP**
- Unlock improved racing-stock recruitment options using the existing supported catalog.

**Distinguished Stable — 5 LP**
- Unlock an additional Owner Legacy starting-package option.

**Racing Dynasty — 8 LP**
- Unlock a premium starting-package option with a meaningful strategic identity.

### Active Legacy Perks

**Established Stable — 3 LP**
- +150 starting championship Gold when equipped at registration.

**Influential Patron — 5 LP**
- +10% eligible championship Gold prizes while equipped, subject to appropriate deterministic calculation and caps.

**Master Strategist — 6 LP**
- One additional Strategy Sign opportunity per race while equipped.
- Preserve existing Strategy Sign activation, queueing and accounting rules.

## 6.3 Functional destination requirement

Do not sell placeholder upgrades.

Every purchasable upgrade must have a real, observable gameplay effect.

Before implementation, inspect whether the target systems already support the proposed behavior.

If a proposed content unlock has no functional destination in the current build:

1. Prefer implementing a small, bounded extension using existing architecture.
2. Otherwise replace it with a comparably meaningful supported permanent benefit.
3. Document the substitution and its rationale.

Do not build a major new recruitment, engineering, staff project or starting-package subsystem solely to support one upgrade.

Do not silently sell a cosmetic or inert upgrade in place of an approved functional benefit.

## 6.4 Championship progression protection

Legacy purchases must not bypass existing championship qualifications, Reputation requirements, trophies or format unlock progression.

Unlocking an additional championship option or starting package must not grant unrestricted access to championships that remain otherwise locked.

# 7. HOME STABLE — LEGACY MANAGEMENT

## 7.1 New management section

Add **Legacy Management** directly to the Home Stable page.

The section must show:

- Current spendable LP.
- Lifetime LP earned, if supported by authoritative accounting.
- Owned permanent Legacy Upgrades.
- Purchased Active Legacy Perks.
- Three Legacy loadout slots.
- Current equipped perks and effects.
- Locked and available perks.
- Access to the Market's Legacy Upgrades category.

Use the existing Home Stable presentation and navigation patterns.

Do not introduce a redundant top-level page unless required by the current interface architecture.

## 7.2 Three-slot loadout

Exactly three Legacy perk slots are available.

Rules:

- Slots are available from the start.
- Empty slots are permitted.
- A perk must be purchased before equipping.
- The same perk cannot occupy multiple slots.
- Players may freely change equipped perks outside an active championship commitment.
- The loadout freezes at championship registration.
- Newly purchased perks cannot retroactively affect a registered championship.
- Frozen loadout effects persist for that championship according to their rules.
- After the championship concludes, the player may reconfigure the loadout.

The championship registration receipt must record the frozen loadout or an equivalent authoritative snapshot.

## 7.3 Hero Panel icons

Update the existing **Home Stable Hero Panel** to display icons for the three active Legacy perks.

Requirements:

- One icon per slot.
- Distinct icons for equipped perks.
- Clear empty-slot state.
- Hover or equivalent interaction reveals perk name and effect.
- Icons update when the loadout changes.
- Icons reflect the authoritative equipped state.
- Visual presentation matches the existing Hero Panel.
- Responsive layout must remain usable on narrow screens.

Use existing icon capabilities or simple self-contained assets.

Do not introduce external runtime dependencies.

Do not confuse permanent purchased upgrades with equipped perks: the Hero Panel's three active icons represent the loadout.

## 7.4 Championship registration display

At registration, display the selected Legacy loadout and its effects.

During an active championship, show the frozen active loadout as read-only.

Players must be able to inspect both:

- Active Legacy perks.
- Active Run Rewards.

Keep the two systems visually and mechanically distinct.

# 8. SHARED EFFECT SYSTEM

M4-B and M4-C must integrate with the same authoritative game mechanics.

Implement a coherent effect-resolution architecture that distinguishes:

1. Base asset statistics.
2. Existing native equipment and condition effects.
3. Frozen Owner Legacy perk effects.
4. Temporary championship Run Reward effects.
5. Immediate reward transactions.
6. Permanent stable unlocks and management modifiers.

## 8.1 Required behavior

- Deterministic effect resolution.
- Explicit effect scope and lifetime.
- Stable source identifiers.
- Configurable magnitudes.
- Additive stacking where approved.
- Mechanical caps preserved.
- No accidental permanent base-stat mutation.
- No duplicate grants.
- No stale effect leakage into later championships.
- No retroactive application to completed races.
- Consistent handling across race simulation and management displays.

The authoritative simulation must receive the effective values actually intended by the active rewards.

Do not implement cosmetic bonuses that appear in UI but do not affect the race engine.

## 8.2 Application order

Define and document a deterministic application order.

Recommended sequence:

1. Authoritative base values.
2. Existing native equipment and condition calculations.
3. Frozen Owner Legacy modifiers.
4. Active Run Reward modifiers.
5. Existing mechanical caps and final derived-stat resolution.

Where an existing engine contract requires a different order, preserve the engine's authoritative behavior and document the resulting order.

## 8.3 Immediate reward atomicity

Immediate grants, repairs, treatments, purchases and discounts must commit atomically with reward selection.

Use the existing transaction and receipt infrastructure.

A failed transaction must not:

- Deduct currency.
- Consume the reward choice.
- Duplicate an asset.
- Apply a partial repair.
- Create an inconsistent pending reward state.

# 9. UI AND PLAYER EXPERIENCE REQUIREMENTS

Preserve the M3-UI-P1 navigation consolidation.

Required updates:

### Market

- New Legacy Upgrades category.
- Direct LP purchases.
- Clear ownership and affordability.
- Functional effect descriptions.
- No obsolete Review Selected Work routing.

### Home Stable

- New Legacy Management section.
- LP balance.
- Three-slot perk management.
- Active perk icons in the Hero Panel.
- Clear distinction between permanent upgrades and equipped perks.

### Championship Management

- Active Run Rewards summary.
- Frozen Legacy loadout summary.
- Cumulative stacked reward effects.
- Correct registration and commitment restrictions.

### Run Reward Selection

- Functional effect descriptions.
- Immediate treatment or purchase target selection when required.
- Exact discounted prices.
- Duplicate reward stacking supported across offers.

### Championship Conclusion

- Placement-based LP/Gold/Reputation choice.
- Two choices when LP is unavailable.
- Exact displayed amounts.
- Clear distinction between normal payouts and additional bonuses.
- Exactly-once confirmation.

### General presentation

- Use player-facing terminology.
- Remove obsolete technical warnings.
- Avoid duplicate navigation and management panels.
- Preserve compact championship event tiles.
- Preserve Options-based Save & Load and Help.
- Keep ordinary race playback free of developer-only controls.

# 10. SAVE, PERSISTENCE AND RECOVERY

The current-version career schema must support:

- Spendable LP.
- LP earnings and spending receipts.
- Purchased Legacy Upgrades.
- Purchased Active Legacy Perks.
- Current three-slot loadout.
- Frozen championship loadout.
- Permanent upgrade effects.
- Active Run Reward instances.
- Stacked temporary modifiers.
- Immediate reward receipts.
- Pending championship completion choices.
- Final completion bonus receipts.

Preserve the established persistence model:

- Management decisions are durably committed.
- Ordinary race ticks remain in memory.
- Browser closure during a race may restart the seeded race from its beginning under the current accepted behavior.
- Completed results and committed selections must not be lost or duplicated.

Backward compatibility with previous development save formats is not required.

Current-version export/import must remain functional.

# 11. TESTING AND VALIDATION

## 11.1 M4-A cleanup tests

Verify:

- New career initialization works without manual activation.
- Obsolete initialization warnings are absent.
- Retired routes and transaction panels are removed.
- Current-version save/load works.
- Incompatible old saves fail safely.
- Existing economy and roster operations remain valid.

## 11.2 M4-B reward tests

Verify:

- Three distinct choices per eligible offer.
- Deterministic offer generation.
- Identical rewards can appear in later offers.
- Identical effects stack correctly.
- Persistent modifiers affect actual race calculations.
- Immediate repairs and recovery obey caps.
- Discounted transactions use exact displayed prices.
- Insufficient funds or invalid targets prevent atomic selection.
- Duplicate selection attempts do not duplicate effects.
- Rewards expire at championship conclusion.
- No temporary effect leaks into subsequent championships.

## 11.3 M4-C progression tests

Verify:

- First place offers 2 LP, Gold or Reputation.
- Second and third offer 1 LP, Gold or Reputation.
- Lower completed placements offer Gold or Reputation only.
- Withdrawal and elimination do not grant completion bonuses.
- Normal event payouts remain unchanged.
- Bonus Gold and Reputation are additional.
- Only the selected completion bonus is granted.
- LP purchases deduct the correct amount.
- Insufficient LP blocks purchases.
- Nonrepeatable upgrades cannot be purchased twice.
- Permanent unlocks persist.
- Equipped perks function correctly.
- Only three perks can be equipped.
- Duplicate perk slotting is rejected.
- Loadout freezes at registration.
- Active championships cannot be modified retroactively.
- Achievement rewards remain exactly-once.

## 11.4 Integration tests

Test combinations of:

- Legacy modifiers plus stacked Run Rewards.
- Starting Gold perks plus championship budgets.
- Prize bonuses plus normal payouts.
- Strategy Sign allowance perks plus existing sign accounting.
- Recruitment upgrades plus current market generation.
- Permanent unlocks plus championship eligibility.
- Reward selection followed by save, reload and retry.
- Championship conclusion followed by save and reload.
- Career export/import with active progression state.

## 11.5 Performance and regression

Preserve existing deterministic simulation behavior.

Run the existing Node regression suite and applicable browser functional tests.

Check for performance regressions in oval, circuit and rally simulations.

Preserve the established no-per-tick-durable-write policy.

Verify the built HTML remains self-contained and playable offline.

A Linux browser's inability to access file:// must be reported as an environment limitation, not falsely described as a successful Windows offline test.

# 12. IMPLEMENTATION SEQUENCE

Execute the following within one M4 development cycle:

**Phase 1 — Audit and cleanup**
- Inventory obsolete code.
- Remove retired systems and compatibility paths.
- Establish the current supported schema.

**Phase 2 — Shared progression and effect contracts**
- Implement authoritative LP accounting.
- Establish shared modifier and effect-resolution contracts.
- Integrate with existing transaction and settlement systems.

**Phase 3 — Functional Run Rewards**
- Implement reward catalog.
- Implement stacking.
- Implement immediate transactions.
- Integrate effects into actual racing and management calculations.

**Phase 4 — Owner Legacy**
- Implement completion bonus choices.
- Implement LP Market category and purchases.
- Implement permanent upgrades and equipped perks.
- Implement three-slot loadout and registration freeze.

**Phase 5 — UI integration**
- Home Stable Legacy Management.
- Hero Panel active perk icons.
- Market upgrade cards.
- Run Reward and championship conclusion displays.
- Active effects and frozen loadout summaries.

**Phase 6 — Regression and delivery**
- Automated tests.
- Browser workflow verification.
- Performance checks.
- Offline standalone build.
- Final implementation report.

These phases are internal implementation steps. Deliver M4-A/B/C together.

# 13. DELIVERY REQUIREMENTS

Provide:

1. Updated standalone playable HTML.
2. Source implementation changes.
3. Concise audit of removed obsolete systems.
4. Description of the current supported save schema and any breaking changes.
5. Functional Run Reward catalog with actual engine mappings.
6. Functional Legacy Upgrade catalog with actual effects.
7. LP earning, spending and settlement implementation summary.
8. Automated test results and browser verification results.
9. Known limitations and remaining technical debt.
10. Build artifact size and SHA-256 checksum.
11. Source revision and branch identification.

Clearly identify any substitutions from the proposed reward or upgrade catalog.

Do not claim tests passed unless they were actually executed.

Do not commit, merge or push changes unless separately authorized.

# 14. ACCEPTANCE STANDARD

M4 is complete when:

- Obsolete compatibility and superseded UI have been removed.
- Current-version saves and transactions remain reliable.
- Run Rewards provide real, observable gameplay effects.
- Identical Run Rewards stack correctly.
- Discounted rewards execute immediately and atomically.
- LP functions as a persistent spendable currency.
- Championship completion rewards follow the approved placement rules.
- Normal payouts remain intact.
- Legacy Upgrades can be purchased in the Market.
- Purchased upgrades provide meaningful permanent benefits.
- Three-slot Legacy loadouts function and freeze at registration.
- Home Stable provides Legacy Management.
- The Hero Panel displays active Legacy perk icons.
- All effects integrate with authoritative simulation and management systems.
- Regression tests pass.
- The standalone offline HTML is ready for local Windows acceptance testing.

**Development priority:** Deliver a complete, functional and maintainable M4 implementation. Avoid unnecessary architecture expansion, compatibility scaffolding and placeholder features.

**Guiding principle:** Do not let perfection be the enemy of good enough.