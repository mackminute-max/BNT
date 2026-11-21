# Blood and Thunder — E5-B Readiness and Presentation Contracts

Planning only. E5-A source `4dad533211a88e0a1c36965ccf70d0d7459cb5c3`; revised owner handoff defines E5-B as championship structure/progression/settlement. Earlier audit's “E5” was financial finalization; this report maps that work into the revised stages without claiming authorization.

## Verdict: CONDITIONALLY READY

Existing registration, real native event orchestration, D2 consequences, official standings, withdrawal, zero-starter handling and E4 durability are available. Production terminal/entitlement authority, actual settlement, permanent progression and six-template content are incomplete. The new Home Stable provides navigation and read-only data, not a second championship controller.

## Contracts for the next implementation

| UI responsibility | Existing authority | Remaining work |
|---|---|---|
| Offer selection/disclosure | `championships/offers.js`: `freezeOffer`, `validateOffer`, `qualifies`; `controllerOffers` | Versioned full production templates and readable unmet predicates/reward disclosure; current offer is a development fixture |
| Registration | `makeControllerCommand`, `championship.register`, `commitEntrant`; original E4 controller operation | Player selection/confirmation and exact owned ordered RU mapping; no new fee/scoring formula |
| Frozen schedule/current event | `activeChampionship`, instance.offer/raceIndex | Read-only presentation selectors and preparation screen |
| Race preparation | `prepareRace`; frozen payroll/coaching; existing E4 start/birth | Player workflow; preserve manual starts and one authoritative Worker |
| Native execution/Signs | Accepted E4 worker/session, P1.5 buffering and P2.2 presentation separately | Decide/implement narrow transport/presentation bridge under current policy. Do not regenerate career RUs through prototype `raceSetup` rating normalization |
| Official publication | `createClearanceTransfer`, `ChampionshipRunner.publish`, `E4Coordinator.publish`, `progression.publishOfficial` | Use durable D5 prepare/protected commit; no UI finish shortcut |
| Points/title | `championshipClassification`, `raceAwardEffects`, `standings`, `titleCandidate` | Pure existing rules reused; final terminal authority must validate them |
| Condition/personnel consequences | `m2e-condition-mapping-v1`, existing M2-D recovery/contracts/payroll | Do not reapply D2 on settlement; reconcile native restoration wording explicitly |
| Advancement/withdrawal | Existing manual start, INTERMISSION_READY/AI_CONTINUATION, confirmed withdrawal, forced eligibility, no-starter evidence | Player controls/feedback only; no between-race repair or payroll |
| Financial settlement | M2-D completion verifier seam, quoteCycle/cycle.settle, protected transactions | Trusted production producer, persistent terminal registry, frozen entitlement manifest, atomic cycle/awards/archive/unlock operation |
| Championship completion/history | E3 officialFinal settled:false; retained raceResults | Immutable completed registry, settlement claim/history and permanent RP/XP/trophy effects |
| Elimination/failure | Existing eligibility/withdrawal; explicit `career.confirmFailure` and viability assessment | No invented elimination penalty or automatic career failure |

## First-pass player presentation

- **Selection cards:** template name/category, qualification status and concrete unmet requirements, fee, field, event count. Disable registration with authoritative reason. Development fixtures must be labelled.
- **Details:** complete frozen schedule, course/format/laps/weather disclosure policy, grid, rules, scoring, purse/placement/title rewards and source/rule version. Show “not configured” for missing production values, never invented prizes.
- **Preparation:** locked driver/ordered beasts/chariot/equipment, actual condition/eligibility/risk, frozen payroll context, free approved coaching, permitted pre-start Signs; deliberate start.
- **Live race:** preserve accepted P2.2 layout and its presented-state/event-cursor contracts. Race transport remains one authority; no uncommitted display described as saved.
- **Intermission:** official event result, championship standings, persistent condition/withdrawal reason, earned-but-pending entitlements, next frozen event. No stable transactions or auto-start.
- **Completion:** points placement versus title eligibility, possible null champion, earned purses/placement versus title awards, pure payroll/net preview, explicit settlement confirmation and blocked/recovery explanation.
- **History:** settled statement and immutable instance/result references, actual awarded XP/RP/trophy history only. No fictitious Legacy gains.

## Settlement blockers and compatible direction

1. `src/career/championships/controller.js:18` and `cycles/policy.js:8` intentionally block ordinary management while an instance is active/unsettled. Do not clear activeId in a separate write to sneak cycle.settle through.
2. `cycles/completion.js` branding is process-local. Persist a validated terminal registry; recreate capability after cold verification. Include **all active contracts**, reserves and specialists, not just RU driver. `authority` string alone is not trust.
3. Current offer v1 exact shape freezes fee/points, not full Gold/XP/RP/title/trophy rules. Old pending championships lack authoritative award amounts. Do not attach fresh arbitrary awards retroactively.
4. Current E3 final result holds `SETTLEMENT_PENDING`, provisional champion and candidate claim IDs, not credited rewards. Keep Gold/XP/RP/trophy and one M2-D cycle inside a new atomic authoritative final settlement.
5. Preserve strict schema/readers, protected command/effect identity, receipt/reward/logical-record/container limits, historical anchors, complete backup and lost-ack recovery.

Proposed order: versioned terminal+entitlement registry and synthetic-fixture settlement proof; permanent progression/archive/qualification facts; player championship workflow/transport bridge; approved production content and full acceptance. No new framework/backend, controller rewrite or experimental persistence format is required by E5-A.

## Material owner decisions before affected E5-B behavior

- Approve frozen production purse/placement/finale/title/XP/RP formulas, or explicitly authorize a provisional versioned playtest catalog. Existing spec numerical tables are provisional; missing values cannot come from the alternate.
- Specify legacy rewardless pending-instance disposition if owner careers must settle under newly introduced rules. Safe default: preserve them unchanged until policy is explicit.
- Preserve existing M2-D management-only cycle recovery by default. Paid-treatment native floors are approved, but do not automatically authorize free native restoration at settlement. Any broader mapping needs explicit approval.
- Confirm final E4 acceptance/performance disposition before calling the whole milestone accepted. Stage1 acceptance does not waive Stage2 limitations.
- Default original M2-E race integration to approved durable-resume policy. If choosing the isolated prototype's between-race-only save policy for management careers, obtain an explicit compatibility decision rather than silently discarding E-58.
- Iron Gauntlet final schedule/field/economy and complete six-template content require approved configuration before production delivery; Bannerfall trophy gate is already approved.

Routine module/version naming, manifest serialization, strict validation order and narrow adapter mechanics do not require another broad audit or player-policy vote.

## Acceptance criteria

Real owned RU→qualified offer→one fee→frozen entrants→manual multi-event native races→D5 once-only results→withdrawal/AI continuation/no/one starter→terminal→confirmed atomic M2-D settlement→earned progression/history→unlocked stable→repeat championship. Test shared placements/full awards, final DNF/DNS/DQ/title/null champion, complete active contracts, preserved debt/recovery order and explicit failure. Inject faults before/after each durable boundary, stale revisions, conflicting IDs, lost acknowledgements, corruption, quota and old backups. Preserve all historical/payroll/native/checkpoint references and complete backup validation. Run full Node/browser inventory and new Windows offline acceptance on the eventual integrated artifact.

E5-A practice races are deliberately independent and cannot satisfy those career progression acceptance cases. **Stop after E5-A owner review; E5-B implementation needs separate authorization.**
