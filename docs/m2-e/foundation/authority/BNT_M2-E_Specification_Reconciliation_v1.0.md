# BNT M2-E Specification Reconciliation v1.0

**Verdict: CONDITIONALLY READY.** The five previous design compatibility choices are resolved by approved D1–D5. Source implementation, proof gates and formal M2-D acceptance remain outstanding. All 63 approved decisions are retained.

**Date:** 2026-11-18. **Scope:** planning only; no implementation authorization.

## Verified baseline and authority

References were reviewed in order: the complete Championship Controller Specification v1.0, Compatibility Addendum v1.0, previous Implementation Readiness Audit, current source/tests, and M2-D contracts. The specification remains authoritative for E-01–E-58; the addendum supplements it with D1–D5.

Repository: `mackminute-max/BNT`, local `/workspace/BNT`. Branch `feat/m2-d-payroll-lifecycle`; HEAD `06fd511170148caf744abf57449c4cc5d6c4e2c5`; implementation commit `c8371a8e26115c04f86ff91e7f45f2cda4bafb13`. Local main/origin-main baseline is `f66ec90a6659dd6bb675815bff4cc33e9850a643`. This does **not** establish remote freshness or owner acceptance. A read-only remote verification attempt returned HTTP 503. M2-D acceptance and integration remain unestablished.

At inspection, tracked files were clean. The pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was left untouched. These deliverables are outside the repository. No source, tests, save files, dependencies, builds, branches or commits were changed.

The actual stack is vanilla JavaScript ES modules, Canvas 2D, esbuild and a headless simulator; no TypeScript/Phaser migration is proposed. `package.json` reports application 0.6.0, esbuild 0.28.2 and playwright-core 1.65.1. Node v24.22.1 and npm 11.9.0 were available.

Authority fingerprints (SHA-256):

- Specification: `9e73713b0f7e231fb469e5db390cd41a27ac7c34767cd2c9cebece409bf6e917`.
- Addendum: `2e5631622329259c5730b53bec5038784246cc482129882777eab2988a648780`.
- Existing standalone files `dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html`: each 436032 bytes, SHA-256 `d1a586a64066b40e40fb540e090c61d48b975d89cecca92e1377aa5b4af3a1a7`. Neither was rebuilt.

Prior audit: `/workspace/deliverables/BNT_M2-E_Implementation_Readiness_Audit.md`, preserved unchanged. Source references below use this local HEAD; proposed names, schemas, coefficients and tests are explicitly recommendations, not implemented APIs or passing evidence.

## Reconciliation count and disposition

There are **five previously identified compatibility choices, five resolved in design, zero newly identified unresolved material policy contradictions**. This count does not claim five code fixes. The technical gaps below remain open. No additional player-facing decision is presently required to prepare the plan. Formal M2-D acceptance and explicit M2-E implementation authorization are separate owner gates.

| Finding | Previous ambiguity | Approved resolution | Current disposition |
|---|---|---|---|
| R-01 / D1 | Universal versus format-specific activation | Preserve starting signal, closed-loop crossing and Rally checkpoints | Design resolved; orchestration/resume tests required |
| R-02 / D2 | Separate management labels versus integrated native condition | Versioned bidirectional treatment/recovery integration, without conflating distinct fields | Design resolved; mapping and versioned reducers required |
| R-03 / D3 | Whether/how coaching changes AI | Player-only frozen utility context; personality retained, conflicting Sign priority | Design resolved; optional AI seam required |
| R-04 / D4 | Distribution of tied placement awards | Full shared-place awards and race-victory credit; competition ranking | Design resolved; awards/controller absent |
| R-05 / D5 | Finish crossing, terminal tick or physical clearance as commitment | Validated authoritative clearance before atomic permanent consequences | Design resolved; finalization/recovery boundary absent |

## D1 — Strategy Signs

**Affected policies:** E-20, E-22, E-23, E-28, E-44, E-58, and immutable race setup under E-02/E-29.

Source: `src/ai/signs.js:10–45`; `src/sim/race.js:436–441` Rally activation, `:472` closed-loop crossing, `:900–905` starting signal, `:1092–1101` paused input recording, `:606–668` command resolution.

Queueing currently consumes a use; replacement/cancellation/lowering must retain existing exact behavior, including no invented cancellation refund. The controller must call existing commands rather than activate a sign itself. Persist pending/active signs, remaining uses, Rally checkpoint cursor, course-entry state, lap/crossing state and accepted input ordering. Restore them before continuing simulation; do not replay already-applied commands across the checkpoint watermark.

**Proposed interface:** immutable `RaceSetup.signContext` plus the existing sign command journal; a checkpoint codec captures the full authoritative live sign state. No new universal activation API. Coaching and intermission selection must not consume sign opportunities.

**Compatibility:** absence of controller metadata leaves old setup/replay behavior unchanged. Tests must cover pre-race activation, next closed-loop crossing, each eligible Rally checkpoint, post-final-checkpoint queue, paused commands, replacement/cancellation and reload on either side of activation. Principal risk is duplicate activation/use consumption after restoration.

## D2 — Integrated condition and recovery

**Affected policies:** E-02, E-03, E-08, E-22, E-34–E-36, E-48, E-58. Equipment durability remains excluded by E-35.

### Source-verified distinctions

| Field/system | Verified source behavior | Consequence for integration |
|---|---|---|
| Native condition | `src/sim/consequences.js:392–405` reduces component condition | Preserve exact final native values, not only a management injury label |
| Beast fatigue, driver strain, chariot wear | `src/sim/environment.js:98–131` evolves separate quantities | Never convert management fatigue directly into strain or wear into injury |
| Management injury | `src/career/economy/catalog.js:21` Healthy/Minor/Major/Critical | Existing categories, not native injury thresholds |
| Chariot integrity/status | `src/career/assets.js:8`: 80/60/30/0 bands | Distinct from native condition and wear |
| RU eligibility | `src/career/economy/reducers.js:104–118`; `src/career/cycles/policy.js:11–16` | Major/Critical management injury and native condition gates both matter |
| Treatment/repair | `src/career/economy/reducers.js:57–68,95–96` changes the quoted field | Existing treatment does not automatically heal native condition |
| Settlement recovery | `src/career/cycles/reducers.js:23,38–45` | Recovery precedes contract expiry and last-driver/default-departure checks |
| Valuation | `src/career/economy/records.js:10` | Driver/beast health uses condition; chariot valuation uses integrity; acquisition basis must remain immutable |

### Proposed versioned mapping contract

Create `championship-condition-v1` with explicit native-before/native-after snapshots, asset IDs, origin schema/rules, mapping version, race result ID and applied-effect identity. Values remain finite and bounded 0–100 under existing validators (`src/career/economy/validation.js:12–29`). Ordered beasts and equipment references remain fixed.

The following is a **candidate provisional mapping**, not an existing engine rule, approved final balance or an implemented conversion. It is specified here to make the technical plan testable; standing technical preapproval permits refining its configurable thresholds through fixtures without a new policy vote.

| Operation | Proposed deterministic rule | Safety/compatibility condition |
|---|---|---|
| Native condition transfer | Copy exact final C for driver/beasts/chariot | Do not apply collision damage a second time |
| Native fatigue/strain/wear | Copy each corresponding native field independently | No inferred fatigue-to-strain conversion |
| Driver/beast injury bands | Candidate C≥80 Healthy; ≥60 Minor; ≥30 Major; below30 Critical | These bands reuse existing chariot scale boundaries, **not** existing driver/beast validation thresholds; test eligibility and market fixtures before adopting |
| Existing worse injury | Preserve greater severity until legitimate treatment/recovery | Racing cannot silently heal a pre-existing injury |
| Chariot integrity | Candidate I′=max(0,I−max(0,Cbefore−Cafter)); retain exact Cafter | 1:1 factor is configurable; no duplicate native subtraction; retain wear separately |
| Medical treatment | Existing one-severity improvement; native C raised only to the configured floor of the resulting category when needed | Candidate floors Healthy80/Minor60/Major30; existing charge/qualification/discount logic retained; forbidden during championship |
| Paid integrity repair | Existing actual quoted restoration R; I′=min(100,I+R), C′=min(100,C+R) | Candidate 1:1 configurable; charge actual restoration, retain wear; no equipment repair subsystem |
| Beast care/refurbishment | Existing fatigue/wear reduction, once | Do not repeat via adapter |
| Driver recovery service | Existing management-fatigue reduction remains distinct | Do not invent strain recovery or zero strain |
| Settlement recovery | Existing allowed injury step plus corresponding native floor, in the existing recovery position; beast fatigue recovered once | Critical remains unchanged under current recovery; no automatic chariot repair or new strain reduction |

Existing service figures are source defaults, not new tuning: driver fatigue service40 Gold; driver injury100; beast fatigue30; beast injury80; refurbishment100; integrity repair base ceil(actual restoration×1.5), with existing qualified-staff/facility discounts. Preserve existing service amounts and economic rules while making their mapped native effects meaningful. Use existing quoted actual values rather than restating those formulas throughout the controller.

**Migration:** do not reinterpret old receipts or replay old commands with new semantics. A confirmed new-schema migration retains legacy raw injury/native/integrity values and provenance, previews effective eligibility and derived mapped values, and creates an explicit new mapping origin. Candidate initial effective injury is the worse of legacy injury and mapped native severity; initial effective integrity is min(legacy integrity,native condition). This is a disclosed new-version interpretation, never an invisible historical rewrite or free healing. Freeze immutable acquisition economics and grant identities.

C=0 means incapacity/Critical in this proposal, not a new permanent death rule. Existing integrity0 status is named Destroyed; current repair behavior must not be converted into irreversible destruction or asset deletion. If actual permanent death/destruction is later required, obtain separate owner approval.

**Required source extension:** a versioned recovery hook/kernel at `cycles/reducers.js:41`, before expiry/departure evaluation. Applying native recovery after the whole old settlement would give eligibility safeguards the wrong state. Keep legacy v4 execution unchanged; new-schema treatment/settlement paths use typed new receipts rather than injecting fields into strict historical command results.

**Exactly once:** race consequences transfer absolute final values under a protected race effect; treatment and settlement use distinct protected IDs. Receipt lookup occurs before effects. No routine between-race care, swaps, replacement or automatic recovery. Tests must exercise boundary fractions, worse legacy injury, Critical, native zero, integrity0 repair, repeated treatment, recovery before last-driver departure, stale revisions and failed persistence.

## D3 — Player-only pre-race coaching

**Affected policies:** E-02, E-09, E-12, E-20, E-23, E-29, E-42, E-58.

The smallest seam is `src/ai/driver.js:121–149`, the existing candidate `add()` scoring function. Existing Sign influence is at `:131–132`, goal persistence at `:133–134`; decision/noise order is established at `:77–96`. Do not mutate global utility weights, personality attributes, candidate legality, perception, cadence or rival state.

Propose an optional validated, bounded context containing aggression, conservation, positioning and risk tolerance; a pure `coachingUtility()` returns bounded score terms. Context is player-only, editable before each race, carries until edited, freezes at starting signal, and is included in setup/checkpoint/journal identity. No direct attribute bonuses, guaranteed compliance or mid-race edits.

For absent/neutral context use the exact legacy path, including unchanged candidate/noise ordering, RNG draws and diagnostic shape. Do not add zero-valued fields unconditionally to old digest inputs. Suppress coaching channels that conflict with the applicable active Sign; preserve orthogonal coaching. This priority concerns instruction biases, not forced obedience overriding driver judgment or physical constraints. Add an explicit six-Sign conflict mask and tests for both positive and opposing coaching biases.

Coefficient bounds, normalized axis representation and UI controls are routine technical/provisional choices. Risks: an additive-only scheme may fail Sign priority; storing coaching globally would modify rivals; extra RNG calls would break legacy results.

## D4 — Shared placements

**Affected policies:** E-10, E-15–E-17, E-24–E-27, E-32, E-36, E-40, E-45, E-50, E-52; race-win counts feed E-27 and E-53 indirectly.

`src/sim/race.js:362–380` already assigns official finish places using full-precision crossing timestamps, configured tolerance and competition ranking. Use that authoritative place directly, never array index or rounded display time. For ranks1,2,2,4 both second-place entrants receive the full second-place points/Gold/eligible XP/RP; no third-place award is redistributed. Every tied first-place finisher gains race-win credit. Do not introduce shared championship titles or change final championship tie-breakers.

Propose pure `awardForOfficialPlace()` and entitlement IDs scoped by instance/race/entrant/award-kind/rules, not by place alone. No fixed purse pool split; organizer guarantees frozen awards. Persist entitlements, not early Gold credits. Exactly-once settlement verifies scoped claims and bounds all aggregate integers. DNF/DQ/DNS and bonus eligibility remain template rules; classified DNF is not a finisher placement-stat entry.

Tests: tolerance boundaries, non-rounded near ties, tied firsts and seconds, independent claims, repeats/reloads, no redistribution, final standings unchanged, aggregate overflow rejection.

## D5 — Authoritative clearance finalization

**Affected policies:** E-01–E-03, E-08, E-10–E-11, E-15, E-20, E-22, E-27, E-29–E-34, E-36, E-40, E-48, E-52, E-58.

`src/sim/race.js:855–875` distinguishes actual Ended from Stalled. Ended requires no Racing entrants and no physical Clearing entrants. A safeguard can emit classification yet set Stalled. `step()` at `:878` onward will not make normal progress from a terminal Stalled state. Classification rows alone are insufficient clearance proof.

Propose `validateClearanceCandidate()` and atomic `commitClearedRace()` (new controller interfaces). A proof binds championship instance/race/start manifest, native final state, authoritative classification, condition mapping version, journal watermark, revisions and a canonical result fingerprint.

Acceptance requires resolved tick boundary, no pending applicable physical resolution, valid terminal classification and entrant identities, no Racing/Clearing units, bounded native condition, same-state condition/result snapshots and fresh revisions. Permanent stationary wrecks are allowed; clearance does not mean deleting obstacles. Future scheduled incidents beyond the legitimate terminal boundary do not invalidate an otherwise complete race. Zero-starter results require their own validated no-starter proof; do not fabricate simulator entrants.

The single commit publishes immutable race result, persistent condition, standings and pending reward entitlements. It does not credit Gold. Historical finish fatigue/timestamps remain locked while final native condition may include legitimate post-finish clearance consequences.

On failure publish only recoverable operational `RACE_CLEARANCE_BLOCKED` information/checkpoint+journal. Do not publish official standings, permanent condition, rewards, withdrawal, DNF/DNS/DQ, next race or settlement. Preserve diagnostic raw simulator safeguard retirements without treating a clearance failure as an official championship penalty.

Retry from a validated pre-stall checkpoint plus its committed input journal. The identical physical obstruction may recur: this is not a promise every wreck blockage can be escaped. Preserve explicit blocked/error state; no teleportation, forced withdrawal or invented retirement. Repeated same-ID same-payload finalization returns prior result; conflicting payload rejects. A post-clearance nonfinal eligibility failure can trigger approved forced withdrawal; blocked clearance cannot.

## Updated architecture and remaining engineering gaps

| Gap | Evidence | Compatible planned disposition |
|---|---|---|
| Durable completion authority | `cycles/completion.js:4–19` uses a WeakSet capability and callback | Persist terminal registry; revalidate/rebrand after load, never trust JSON flags or self-hash alone |
| Settlement binding | `cycles/reducers.js:9–10,26–48` binds current career/revisions and championship ID | Unique instance IDs, outer proof includes aggregate/result registry; reuse one M2-D authority |
| Full roster | `cycles/completion.js:5,29` counterpart in reducer | Completion snapshot includes **all active home-stable contracts**, not only racing driver |
| Checkpoint codec | `sim/race.js:300–360`; `sim/incidents.js:30` | Existing digest projection/capture is not a resumable live-state serializer; preserve Infinity explicitly |
| Input ordering | `sim/race.js:606–668,1092–1101` | Persist accepted input total order/phase/watermark before acknowledgement |
| DNF tie progress | `sim/race.js:382–400` | Add versioned championship progress-first-reach evidence; do not alter legacy classification unconditionally |
| New aggregate schema | `career/cycles/schema4.js`; strict existing career validators | Explicit validated migration, no unknown-field injection into schema4 |
| No championship catalog/controller | Existing source has cycle completion seam, not E-controller | New aggregate, board, instances, scoring, history, six templates |
| Storage/manual mode | `career/store.js:105–116`; existing persistence directory | Prove atomic journal/checkpoint authority, quota failures, previous checkpoints and manual-save limitations |

`createCompletionBoundary(verifier)` receives the complete completion record and requires strict true. `authority` is an ID whose meaning comes from the verifier; `resultVersion` is literal1, not a generic championship-result schema negotiator. Gold reward IDs are unique within the record, not globally deduplicated by that validator. Persistent registry verification must bind profile/career/instance, frozen roster/rules, final result and entitlement set. Recreate only the in-memory capability after validation; never serialize trust. Null champion and withdrawal are represented by terminal registry eligibility/outcome facts while the existing completion remains an authorized Gold projection.

## All 63 decisions: retained traceability

The following original-policy wording is copied from the supplied specification traceability matrix. Phase mapping is proposed; every row remains binding. D1–D5 are reconciled in the sections above, completing the 63-decision inventory.

| Policy | Approved rule retained | Primary implementation gate |
|---|---|---|
| E-01 | Configurable 1–12 races, complete championship lifecycle | E2/E3 |
| E-02 | Locked player RU for entire championship | E2/E3 |
| E-03 | Forced withdrawal on nonfinal RU ineligibility | E2/E3 |
| E-04 | Confirmed voluntary withdrawal, earned rewards retained | E2/E3 |
| E-05 | Nonrefundable, atomic Gold entry fee | E1/E2 |
| E-06 | Persistent selection board and unlocks | E1/E2 |
| E-07 | Career persistence, future run grouping deferred | E1/E2 |
| E-08 | Full stable management only after settlement | E2/E3 |
| E-09 | Grounded Normal/Elevated/High/Critical risk | E2/E3 |
| E-10 | Classified DNF reduced points, authoritative order | E2/E3 |
| E-11 | All remaining AI races after withdrawal | E2/E3 |
| E-12 | Fixed deterministic opponent tiers | E1/E2 |
| E-13 | Repeat championships, configurable one-time bonuses | E2/E3 |
| E-14 | Named rivals with persistent aggregate career stats | E2/E3 |
| E-15 | Race purses, final placement and optional specials | E2/E3 |
| E-16 | Configurable classified DNF purse | E2/E3 |
| E-17 | Organizer-guaranteed frozen prize pool | E2/E3 |
| E-18 | Full known schedule disclosure | E1/E2 |
| E-19 | Transparent standings/opponent RU state | E2/E3 |
| E-20 | Manual race start | E2/E3 |
| E-21 | Read-only stable and resume during championship | E1/E2 |
| E-22 | No between-race recovery | E2/E3 |
| E-23 | Free coaching/strategy and queued Strategy Signs | E2/E3 |
| E-24 | Configurable disclosed points tables | E2/E3 |
| E-25 | Telemetry-backed optional bonus categories | E2/E3 |
| E-26 | Configurable bonus classification eligibility | E2/E3 |
| E-27 | Universal championship tie comparator | E2/E3 |
| E-28 | Seeded, standings, reverse grids | E2/E3 |
| E-29 | Immutable registered field | E1/E2 |
| E-30 | Valid zero/one-starter races | E2/E3 |
| E-31 | Final race actual start required for title | E3/E5 |
| E-32 | Placement Gold follows points standings | E3/E5 |
| E-33 | Null champion permitted | E3/E5 |
| E-34 | Versioned native/management condition adapter | E3/E5 condition gate |
| E-35 | Defer individual equipment durability | E3/E5 condition gate |
| E-36 | Participation plus performance XP | E3/E5 condition gate |
| E-37 | Single persistent Gold economy | E3/E5 |
| E-38 | Five standard championship tiers | E6 content gate |
| E-39 | Reputation-based permanent standard unlocks | E6 content gate |
| E-40 | Started-race and placement reputation | E3/E5 |
| E-41 | Moderate financial risk | E6 content gate |
| E-42 | Legitimate progressive difficulty, steep elite tiers | E6 content gate |
| E-43 | Open standard competition, no victory prerequisites | E6 content gate |
| E-44 | Progressive format variety | E6 content gate |
| E-45 | Balanced tier scoring, victory premium increases | E6 content gate |
| E-46 | Increasing tier field sizes, capacity validation | E6 content gate |
| E-47 | Longer races at higher tiers | E6 content gate |
| E-48 | Meaningful fair attrition, no scripted damage | E3/E5 condition gate |
| E-49 | Varied schedules, demanding finale | E6 content gate |
| E-50 | Enhanced finale points and Gold | E6 content gate |
| E-51 | Finale allows plausible comeback | E6 content gate |
| E-52 | Separate champion victory Gold/reputation | E3/E5 |
| E-53 | Permanent prestige trophy collection | E3/E5 |
| E-54 | Hybrid standard reputation/invitational achievement access | E6 content gate |
| E-55 | Several themed invitationals, not parallel ladder | E6 content gate |
| E-56 | Specialized invitational formats using existing mechanics | E6 content gate |
| E-57 | Framework plus playable Iron Gauntlet | E6 content gate |
| E-58 | Deterministic mid-race checkpoint/resume | Early E4 proof, then full E4 |

| Addendum | Required retained clarification | Gate |
|---|---|---|
| D1 | Existing format-specific Sign activation | E4/E3 |
| D2 | Integrated versioned condition/treatment/recovery | E3/E5 |
| D3 | Player-only frozen coaching, Sign priority | E3/E4 |
| D4 | Full shared-place awards, competition ranks | E3/E5 |
| D5 | Validated clearance and atomic consequences; recoverable blocked state | Early E4/E3/E5 |

## Owner decisions and authorization

No new material unresolved player-facing decision was identified. Do not reopen D1–D5 as alternatives. Provisional mapping bands, coaching weights, content numbers, schema numbering and storage implementation are engineering/balance work under standing preapproval, subject to tests and scope. They are not already source-verified behavior.

The owner still must establish M2-D acceptance/exact integration baseline and separately authorize M2-E implementation. If proof work demonstrates that a new permanent death/destruction threshold, changed collision/Sign rule or another approved-policy change is necessary, stop and present that precise conflict. No such necessity is established by this audit.
