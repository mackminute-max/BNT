# Blood and Thunder — M2-E Compatibility Addendum v1.0

**Status:** Owner-approved design baseline, 2026-11-18  
**Applies to:** M2-E Championship Controller Implementation Specification v1.0  
**Authority:** D1–D5 compatibility decisions approved by owner; supplements, does not replace, the 58 previously approved M2-E policies.  
**Authorization boundary:** Documentation/design only. No code implementation, merge, deployment, or migration authorized.

## 1. Purpose and precedence

This addendum resolves five material compatibility issues identified during the M2-E readiness audit. All 58 existing M2-E policies remain binding. Apply this addendum when interpreting ambiguous or incomplete compatibility language in the M2-E specification; do not use it to override unrelated approved gameplay policies. If a new substantive conflict is discovered, stop and escalate that specific player-facing choice.

## 2. Decision register

| ID | Approved choice | Binding decision |
| --- | --- | --- |
| D1 | A — Existing Strategy Sign compatibility | Preserve existing pre-race/start signal, closed-loop start/finish crossing, and Rally checkpoint activation semantics. |
| D2 | B — Integrated racing and management condition | Introduce versioned deterministic mappings between racing damage/condition and management injuries, integrity, treatment, and repairs. |
| D3 | B — Dedicated player-only coaching | Add a deterministic, configurable pre-race tactical-priority context affecting player driver autonomous choices, not attributes or rival AI. |
| D4 | A — Shared placement/full awards | Each competitor officially tied at a race placement receives the full points, Gold, and applicable placement awards for that place. |
| D5 | B — Authoritative clearance | Persist permanent racing consequences only after validated authoritative clearance; failed clearance blocks advancement and remains recoverable. |

## 3. D1 — Strategy Sign activation compatibility

- Existing engine semantics take precedence over generalized wording in M2-E-23 and other summaries.
- A Sign queued before the race may activate at the starting signal under existing behavior.
- During closed-loop races, a queued Sign activates at the next qualifying start/finish crossing.
- Rally-specific checkpoint activation remains supported.
- Preserve existing rules for opportunities, queueing, replacement, cancellation, ordering, and race-start input handling. Default three Sign opportunities per race remains configurable as previously approved.
- Store all pending and active Sign state and opportunities in deterministic checkpoints and input journals; resume must not activate or consume a Sign twice.
- No new Sign mechanics are authorized by this clarification.

## 4. D2 — Versioned racing/management condition integration

### 4.1 Source of truth and continuity

- Racing simulation is authoritative for racing consequences; management is authoritative for available treatment, repairs, contracts, and career persistence.
- Define an explicit, versioned, deterministic adapter between native driver/beast/chariot fields and management injury/condition/integrity fields.
- Preserve native condition, fatigue, strain, and wear as distinct quantities; do not collapse them into a single health value.
- Carry all relevant driver, beast, and chariot damage and fatigue between championship races without automatic recovery, repairs, swaps, or replacements.
- Management injuries, availability, and chariot integrity must reflect racing consequences, including effects on legal eligibility.
- Existing medical treatment and repairs must meaningfully restore corresponding native racing condition as well as management status, without inventing free recovery.
- M2-D settlement recovery occurs once at championship settlement, not after each race. Preserve the existing ordering and economic safeguards.
- Per-item equipment durability remains out of scope under M2-E-35; existing aggregate chariot damage is in scope.
- Do not introduce new permanent-death or destruction thresholds without separate owner approval.

### 4.2 Implementation-contract requirements

- Version mapping rules and record the mapping version on affected authoritative records.
- Configure and test conversion thresholds and recovery amounts against actual existing treatment and repair behavior; balance numbers are provisional until verified.
- Apply consequences and treatments via durable idempotent transactions, with stable race/result and treatment identifiers.
- Preserve old saves through explicit migration or compatibility handling; never silently reinterpret historical injuries.
- Preserve existing deterministic replay checksums when the new adapter is not invoked.

## 5. D3 — Player-only coaching and tactical priorities

- Provide a pre-race coaching profile covering **aggression, conservation, positioning, and risk tolerance**.
- Coaching influences autonomous player-driver decision weights, not driver attributes or guaranteed results; personality remains meaningful.
- Active Strategy Signs override conflicting coaching directives.
- Coaching is free, does not consume Strategy Sign opportunities, and may be changed before each championship race; previous settings carry forward until edited.
- Freeze the profile at race start and preserve it in race setup, deterministic checkpoint, replay, and recovery records.
- No retroactive or mid-race coaching edits.
- Rival AI is not modified by this player-only feature. Existing races with no coaching context must retain prior deterministic behavior, including RNG draw order.
- Numeric weights and UI details are configurable technical/balance matters, subject to verification and testing.

## 6. D4 — Official ties and full race awards

- Preserve authoritative official race ties; do not manufacture ties by rounding displayed timing.
- Use competition ranking: e.g. `1, 2, 2, 4`, not `1, 2, 2, 3`.
- Every tied competitor receives the **full** points and Gold for the shared place, plus any applicable placement-based XP and reputation.
- If two or more competitors tie for first, each receives first-place race awards and an official race victory.
- The organizer funds all advertised awards; do not split pools or redistribute prizes from other places.
- Preserve the existing DNF/DQ/DNS classification and eligibility distinctions and the approved championship standings tie-break hierarchy. D4 concerns race placements, not championship tie-breaks.
- Award events must have stable idempotency identifiers and be credited exactly once at the applicable approved settlement boundary.

## 7. D5 — Authoritative clearance, condition capture, and recovery

### 7.1 Finalization boundary

A race reaching its terminal simulation tick does **not** by itself constitute an authoritative, committed result.

Required logical order:

1. Complete all pending simulation clearance work, including relevant incident/collision resolution and official classification.
2. Obtain a final authoritative result and driver/beast/chariot condition snapshot from the same resolved simulation state.
3. Validate classification, result identity, condition fields, and expected championship/race revision.
4. Commit the official result, condition consequences, and associated standings changes as one durable, idempotent transition, or via an equivalently safe recoverable transaction protocol.
5. Permit the next race or championship completion only after the result is durably committed.

Rewards continue to follow M2-E/M2-D settlement policy; clearance does not imply early wallet credit. Permanent race condition effects must not be duplicated by retries, reloads, or later settlement.

### 7.2 Clearance failure

- Enter a recoverable **RACE_CLEARANCE_BLOCKED** state (name illustrative; persisted semantics mandatory).
- Retain the latest valid checkpoint and input journal or an equivalent validated pre-commit recovery record; preserve original data on corrupt/incompatible recovery attempts.
- Do not advance the schedule, change official standings, issue awards, apply persistent consequences, or start the next race while blocked.
- Do not reinterpret clearance failure as a DNF, DNS, disqualification, withdrawal, or forfeiture.
- Expose an explicit diagnostic/recovery path; retry must be deterministic and idempotent.
- On successful clearance, commit once and exit blocked state. If recovery is impossible, surface a persistent explicit error without silently resetting the championship.

### 7.3 Determinism

- Preserve simulation/RNG state, tick, queued Strategy Signs, frozen coaching, input order, and relevant version/fingerprint data.
- Validate durable serialization for non-JSON-native values such as `Infinity`; never silently coerce values in ways that change replay outcomes.
- Test uninterrupted and resumed runs against the same authoritative final result and condition snapshot.

## 8. Cross-policy consistency

This addendum must be interpreted together with these existing policies:

- **M2-E-02/03/22/34/35:** Locked RU, forced withdrawal when unable to start, no between-race recovery, unified condition adapter, no per-item equipment durability.
- **M2-E-10/24/27:** DNF classifications, configurable scoring, and deterministic championship standings tie-breaks.
- **M2-E-15/17/32/36/40:** Settlement timing, organizer-funded prizes, final placement Gold, XP, and reputation.
- **M2-E-20/23/29/30:** Explicit race starts, pre-race tactical controls, immutable fields, and zero/single-starter handling.
- **M2-E-58:** Deterministic mid-race resume with versioned checkpoints and input journals.

No part of this addendum authorizes changing championship catalog scope: five standard championships plus one playable Iron Gauntlet invitational remain the initial content target.

## 9. Required acceptance tests

| ID | Required test |
| --- | --- |
| CA-D1-01 | Pre-race Sign, closed-loop crossing, and Rally checkpoint activation match existing semantics. |
| CA-D1-02 | Save/resume preserves queued/active Signs and opportunity counts exactly. |
| CA-D2-01 | Racing injury/damage maps to management state and eligibility deterministically. |
| CA-D2-02 | Existing treatments/repairs restore corresponding racing condition without free between-race recovery. |
| CA-D2-03 | Repeated settlement, reload, or transaction retry never duplicates damage or recovery. |
| CA-D2-04 | Existing saves/replays remain compatible; no unapproved death/destruction/equipment durability. |
| CA-D3-01 | Player coaching changes autonomous choices only within configured priorities; personality and Signs retain precedence. |
| CA-D3-02 | Coaching absent yields historical deterministic behavior; coaching frozen and restored on resume. |
| CA-D3-03 | Rival AI, driver attributes, and Sign opportunity counts remain unchanged. |
| CA-D4-01 | Shared second place yields `1,2,2,4` and full second-place awards for each tied entrant. |
| CA-D4-02 | Tied first place yields full first-place awards and race wins for all tied winners. |
| CA-D4-03 | No artificial ties from display rounding; no duplicate awards after retry. |
| CA-D5-01 | Post-terminal clearance effects appear in committed final condition and classification. |
| CA-D5-02 | Failed clearance blocks advancement, awards, and permanent condition commit; no false DNF/withdrawal. |
| CA-D5-03 | Recovery from valid checkpoint completes deterministically and commits exactly once. |
| CA-D5-04 | Corrupt/incompatible checkpoint remains explicit and non-destructive. |

These are required future tests, **not claims that tests have been run**.

## 10. Outstanding work and authorization

**Resolved:** D1–D5 player-facing compatibility choices.  
**Still pending:** Formal M2-D acceptance, repository-level interface validation, durable checkpoint codec, completion proof/persistence integration, verified condition-mapping thresholds, complete content configuration, and acceptance testing. These are technical implementation prerequisites, not automatic new player-choice decisions.

**Explicitly not authorized:** M2-E code implementation, repository edits, migration execution, commits, merging, pushing, or deployment. Future work requires separate explicit owner authorization.
