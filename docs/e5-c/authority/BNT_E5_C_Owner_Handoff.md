# Blood and Thunder — E5-C Implementation Authorization
## Integrated Career Gameplay Loop

**Status:** Authorized for E5-C only  
**Baseline:** Accepted E5-B  
**Branch:** `feat/m2-e5-b-championship-progression`  
**Frozen E5-B implementation:** `4322672749091d8f0c7121d7f2d14f3d5bba67a7`  
**Accepted artifact:** `Blood-and-Thunder-E5-B-Playable.html`  
**SHA-256:** `d9f909a59a78ad3c3a688ce15be6e6d77c2164fde2f16469ade9530cddbae6b8`

Do not merge, push, publish, deploy, implement E5-D, or begin P3/P4 without separate owner authorization.

## 1. Mission

Deliver the first complete, player-operable championship career loop.

The player must be able to enter a championship, prepare for a race, watch and interact with the actual authoritative race, receive official results, select Run Rewards, advance through the schedule, settle the championship, select an earned Legacy Reward, and return to the Home Stable.

The entire loop must operate through normal player-facing controls.

**Developer Tools must not be required to complete a championship.**

E5-C is an integration milestone. Reuse accepted controllers, native simulation, Worker execution, persistence, and settlement authority. Do not introduce competing systems.

## 2. Source authority and preflight

Before implementation, inspect the actual repository and reconcile the following:

- Accepted E5-B implementation and lifecycle/authority contract.
- `BNT_M2-E_Championship_Controller_Spec_v1.0.md`.
- `BNT_M2-E_Compatibility_Addendum_v1.0.md`.
- Accepted E4 persistence and recovery implementation.
- Accepted P2.2 Worker race viewer and input protocol.
- Existing E5-B Run/Legacy reward implementations.
- Existing M2-D financial and recovery settlement.
- Current in-race presentation guidelines where applicable.

Document the concrete interfaces, source modules, controller phases, and any integration conflicts before changing production code.

Preserve the accepted owner clarification concerning elimination, final-only settlement, and reward eligibility.

If an authority conflict cannot be resolved without changing accepted mechanics, stop that portion and report the conflict. Do not silently replace accepted behavior.

## 3. Required player journey

### Stage A — Home Stable and registration

The player must be able to:

1. Inspect the assembled Racing Unit.
2. Review championship eligibility, fees, schedules, and provisional awards.
3. Select an eligible championship.
4. Explicitly select the Racing Unit assignment to register.
5. Confirm the registration and fee.
6. See the registered championship and next scheduled event.

Correct the E5-B registration UX that implicitly selects the first available assignment. Display the actual chosen driver, beasts, chariot, and assignment before confirmation.

Use the existing registration authority. Do not add a separate entry-fee transaction.

### Stage B — Race preparation

Present the next scheduled championship race with:

- Championship and event identity.
- Track, format, laps, weather, and grid information.
- Registered player Racing Unit.
- Frozen opponent field and known starting eligibility.
- Current driver/beast/chariot condition.
- Applicable coaching and baseline AI strategy.
- Available Strategy Signs and their activation rules.
- Clear Start Race control.

The player must deliberately start each race.

Preserve frozen championship assets and approved coaching freedoms. Do not allow unauthorized between-race substitutions, repairs, purchases, personnel changes, recovery, or condition resets.

### Stage C — Owned-career race launch

Connect the accepted E5-B registered championship event to the accepted P2.2 Worker-authoritative race viewer.

Requirements:

1. Use the committed championship instance, event, frozen setup, and opponent identities.
2. Do not create a separate practice race or substitute new opponents.
3. Bind the Worker session to profile, career, championship, event, revisions, and configuration fingerprint.
4. Preserve existing native RNG, starting grid, AI, collision, damage, weather, fatigue, and condition rules.
5. Preserve deterministic Strategy Sign input ordering and checkpoint semantics.
6. Keep the native simulation authoritative.
7. Keep the renderer and UI presentation-only.
8. Never calculate official placements from displayed positions.

The existing independent Practice Race remains available and must continue to grant no career rewards.

### Stage D — Interactive race viewing

The player must be able to observe and interact with the real championship race.

Retain the accepted P2.2 functionality:

- Main race viewport.
- Tactical map.
- Live standings and Racing Unit status.
- Scrolling radio commentary.
- Strategy Sign controls.
- Pause, resume, and existing supported playback controls.
- Deterministic checkpoints and recovery.
- Visible completion or clearance status.

Use the current Dark Deco Retro Cartoon visual direction where practical, but do not turn E5-C into a broad art-system rewrite.

Do not implement outstanding P3 racing refinements as part of E5-C.

### Stage E — Official race completion

The visible end of the race is not sufficient to establish an official result.

Use the accepted D5 clearance and E3 publication pathway:

1. Finish all authoritative simulation and clearance work.
2. Obtain official classification and condition from the same resolved state.
3. Validate native session identity and expected revisions.
4. Durably publish result, condition consequences, and standings.
5. Confirm the protected write.
6. Only then show the event as officially complete.

A Worker completion message or animation must not be treated as durable settlement.

If clearance or publication fails, retain recoverable authoritative state and block advancement. Do not invent a DNF, DNS, forfeiture, or replacement result.

### Stage F — Official results screen

Show:

- Official finishing order and classifications.
- Player's result and relevant race statistics.
- Championship standings.
- Championship points earned.
- Driver/beast/chariot condition changes.
- Pending purses, XP, and reputation entitlements where authorized.
- Next available action.

Clearly distinguish pending championship entitlements from Gold or progression already credited.

Do not apply championship-level payroll, recovery, Gold payouts, XP, RP, or trophies between races.

### Stage G — Run Reward selection

For each eligible nonfinal player-started race, present the existing authoritative E5-B three-choice Run Reward offer.

The player must:

1. Review three distinct rewards.
2. Choose one.
3. Confirm the choice.
4. See the selected reward in the active run inventory.
5. Advance to the next race.

A pending mandatory choice blocks progression.

Offers must survive closing/reopening the HTML without rerolling.

Effects remain placeholders. Do not invent bonuses or imply that a nonmechanical selection changes performance.

### Stage H — Championship continuation

After Run Reward selection, return to the next-event preparation screen.

Preserve:

- Registered identities and equipment.
- Cumulative condition and damage.
- Official standings.
- Prior results.
- Selected Run Rewards.
- Championship schedule.
- Existing checkpoint and recovery records.

No between-race healing or unauthorized stable management.

If the player becomes ineligible, end their participation and continue the frozen remaining schedule through the accepted headless AI mechanism.

AI continuation must be resumable, with official records for every scheduled event, including validated zero-starter cases.

### Stage I — Terminal championship settlement

After the complete frozen schedule:

1. Display final official standings.
2. Determine champion and player outcome using accepted eligibility rules.
3. Present pending championship financial and progression entitlements.
4. Invoke the dedicated E5-B trusted settlement authority.
5. Apply M2-D financial, payroll, recovery, contract, and debt effects exactly once.
6. Publish authorized XP, RP, trophies, and historical records.
7. Determine Legacy Reward eligibility.

Do not use generic `cycle.settle`, a public settlement object, or an arbitrary UI-supplied final result.

Preserve the distinction between championship standings placement and championship title eligibility.

### Stage J — Legacy Reward selection

When the terminal run qualifies, present the existing E5-B three-choice permanent Legacy Reward offer.

The player must choose and confirm one reward.

The choice must:

- Be committed through protected E5-B authority.
- Persist permanently in Owner Legacy records.
- Survive save/reload and future championships.
- Appear in the completed championship archive.
- Remain distinct from temporary Run Rewards.

Placeholder Legacy Rewards must not grant invented Legacy Points, loadout slots, numerical bonuses, or other effects.

If the run is ineligible, complete archival without inventing an entitlement.

### Stage K — Return to Home Stable

After the required terminal steps:

- Archive the completed championship.
- Clear active-run ownership appropriately.
- Restore permitted stable management.
- Display final finances, condition, career records, and earned permanent progression.
- Permit registration for the next eligible championship.

A player must be able to complete at least two consecutive championships through this normal workflow without resetting the career.

## 4. Persistence and interruption recovery

Preserve E4 as the authoritative durable boundary.

Test interruption and restart during:

- Registration confirmation.
- Race preparation.
- Worker launch.
- Active race.
- Queued Strategy Sign.
- Paused race.
- Final simulation clearance.
- Official result publication.
- Pending Run Reward.
- AI continuation after elimination.
- Terminal settlement.
- Pending Legacy Reward.
- Archive/unlock.

The player must resume from the newest valid authoritative state.

Do not duplicate fees, race results, damage, rewards, payroll, recovery, trophies, or Legacy selections.

Do not silently restart races, reroll outcomes, replace opponents, or advance without a durable acknowledgment.

Retain the accepted backup/import/export and protected transaction bounds.

## 5. User interface requirements

The player should always understand:

- Which championship is active.
- Which race is next.
- Whether preparation is required.
- Whether a race is running, paused, complete, or awaiting durable publication.
- Whether a Run Reward selection is pending.
- Whether terminal settlement is pending.
- Whether a Legacy Reward selection is pending.
- What action is required to continue.

Implement a prominent **Continue Championship** action where appropriate.

Correct the accepted E5-B usability issue where disabled championship controls fail to explain prerequisites. Display specific reasons and direct the player to the relevant existing action.

Avoid unnecessary technical terminology in the normal player interface. Keep detailed fingerprints, revisions, and provenance diagnostics in Developer Tools.

Do not introduce a second competing navigation system.

## 6. Non-goals

Do not implement:

- New Run Reward mechanical effects.
- New Legacy Reward mechanical effects.
- New Legacy Point formulas.
- New Legacy loadout or equip mechanics.
- Expanded Stable Services or Economy systems.
- New championship balancing or procedural offer-count thresholds.
- P3 AI, speed-control, lane-visibility, or combat-strategy refinements.
- A replacement race simulator.
- New engine physics or damage formulas.
- Broad visual asset production.
- A new save format outside accepted E4/E5 compatibility contracts.

Small integration corrections are permitted where necessary to deliver the authorized loop, but must be documented and tested.

## 7. Required automated verification

### Core player flow

- Register an eligible Racing Unit.
- Prepare and launch an owned championship race.
- Interact with the race through the actual viewer.
- Complete authoritative race clearance.
- Return to official results.
- Select a Run Reward.
- Prepare and start the next race.
- Complete the championship.
- Perform exactly-once final settlement.
- Select a permanent Legacy Reward.
- Return to Home Stable.
- Start and complete a second championship.

### Failure and recovery

- Interrupted Worker launch.
- Reload during active race.
- Reload with queued Strategy Sign.
- Lost durable result acknowledgment.
- Duplicate completion message.
- Repeated settlement request.
- Invalid or stale race session.
- Corrupt checkpoint.
- Interrupted Run Reward selection.
- Interrupted Legacy Reward selection.
- Player elimination with AI continuation.
- No eligible starters.
- Save/reload after championship archive.

### Compatibility

- Existing P2.2 historical checksums.
- Accepted E3 official publication.
- Accepted E4 recovery and transaction tests.
- E5-B catalog, awards, and reward tests.
- Existing M2-D settlement tests.
- Independent Practice Race.
- Developer Tools controls and provenance.
- Standalone offline HTML generation.

Do not change accepted golden references merely to make tests pass.

## 8. Deliverables

Provide:

1. `Blood-and-Thunder-E5-C-Playable.html` — complete standalone offline HTML.
2. E5-C implementation report.
3. E5-C test evidence with exact commands, pass/fail counts, and raw exits.
4. E5-C lifecycle/authority integration contract.
5. Outstanding issues and deferred work register.
6. Windows direct-file acceptance checklist.
7. E5-D readiness assessment.

Include:

- Branch and exact commit hashes.
- Source and runtime/build revision.
- Artifact size and SHA-256.
- Deterministic rebuild verification.
- Explicit disclosure of any incomplete player-flow steps.
- Explicit distinction between independently tested behavior and deferred Windows owner acceptance.

Do not overwrite accepted E5-B or P2.2 deliverables.

## 9. E5-C acceptance criteria

E5-C is complete only if:

1. A player can complete a championship through normal player-facing controls.
2. The actual registered championship race runs in the accepted P2.2 viewer.
3. Race interaction remains authoritative and deterministic.
4. Official results are durably committed before advancement.
5. Run Reward selection is mandatory where eligible.
6. Final championship settlement occurs exactly once.
7. Legacy Reward selection is mandatory where eligible.
8. Permanent Legacy ownership survives subsequent championships.
9. The entire workflow survives supported interruptions and reloads.
10. Independent practice and historical deterministic behavior remain intact.
11. The standalone HTML functions offline.
12. Two consecutive championships can be completed without Developer Tools.

**Stop after E5-C delivery and await owner review and Windows acceptance. Do not automatically proceed to E5-D.**