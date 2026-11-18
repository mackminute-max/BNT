# D2 proposed mapping — source compatibility analysis

**Status: proposed rules only; NOT approved for implementation.** No proposed numerical mapping is implemented by this phase. Owner's current clarification supersedes earlier technical planning latitude for D2 numbers.

## Verified source contract

| Quantity | Source, units and bounds | Existing behavior / compatibility |
|---|---|---|
| Driver/beast/chariot native condition | `src/career/economy/validation.js:23–27`, `src/model/ru.js`; continuous finite rating0–100 | Native damage subtracts the actual resolved amount and clamps0–100 (`sim/consequences.js:392–405`) |
| Driver management fatigue | `economy/validation.js:27`;0–100 | Separate from native strain; no racing fatigue conversion currently exists |
| Driver native strain | `sim/environment.js:120–125`;0–100 | Carries independently; must not be relabeled as management fatigue |
| Beast fatigue | `sim/environment.js:104–118`;0–100 | Same named field in career/native RU adapter; direct lossless carryover requires no new coefficient |
| Chariot wear | `sim/environment.js:126–131`;0–100 | Separate from native condition and management integrity |
| Management injuries | `economy/catalog.js:21` | Schema3/4/5 use Healthy,Minor,Major,Critical; older schema2 labels are not the current injury contract |
| Native eligibility | `sim/consequences.js:41–42,172–185`; `economy/reducers.js:116` | Driver/chariot condition≤5 disables; both beasts≤10 disables the team; these are NOT injury-band boundaries |
| Management availability | `economy/reducers.js:104–118`, `cycles/policy.js:11–16` | Unavailable, Major/Critical or Critical/Destroyed chariot blocks entry; driver also needs an active nonexpired contract |
| Integrity/status | `career/assets.js:8` | Integrity0–100: ≥80 Functional,≥60 Light,≥30 Moderate,>0 Critical,0 Destroyed; these bands do not already define native-condition conversion |
| Medical service | `economy/reducers.js:57–68,95–96` | Improves injury exactly one category at existing price/qualification/discount; does not currently restore native condition |
| Repair | Same source | Restores requested actual integrity capped100; updates status; price based on actual restoration; native condition currently independent |
| Care/refurbishment | Same source | Fixed fatigue/wear reduction25, clamp0; no second reduction through an adapter |
| M2-D settlement recovery | `cycles/reducers.js:23,38–45` | Driver management fatigue−20; beast fatigue−20; Major→Minor,Minor→Healthy,Critical unchanged; no strain/integrity/wear changes; precedes expiry/departure |

## Assessment of the owner's proposed rules

1. **Condition bands are structurally compatible**, but native values are continuous. The literal integer ranges60–79/30–59/0–29 leave gaps at79.5,59.5 and29.5. Proposed interpretation for approval: Healthy[80,100],Minor[60,80),Major[30,60),Critical[0,30), without rounding. This interpretation is not implemented. Existing injury must retain the greater severity; a race cannot heal an older injury. Availability must not be automatically restored merely by a higher native value.
2. **One integrity point per native damage point is implementable**, independently of wear. Use resolved post-clearance actual chariot condition loss, with the approved basis specified explicitly; do not subtract both per-event DAMAGE amounts and the before/after delta. Native damage has already changed native condition, so only integrity receives the additional management translation. Preserve the prior worse injury/status semantics and clamp integrity0–100. A developer condition override could mask a net before/after loss; production controller inputs should not permit arbitrary condition edits and developer exceptions require explicit provenance.
3. **Treatment minimum floors are implementable as a new versioned adapter**, once approved: after the existing one-category improvement, raise native condition only to the resulting category's approved lower bound if below it. The floors depend on approving the continuous thresholds. Existing medical price, requirements and one-step effect must remain unchanged. Critical→Major treatment is distinct from passive M2-D recovery, where Critical remains unchanged.
4. **Repair's native restoration can use actual integrity restored**, not requested overflow: compute R from the existing quote, then cap native condition+R at100 once. Do not repair wear as part of that action or invent equipment durability. A native condition deficit with already-full integrity currently cannot buy an integrity repair (no-effect quote); the approved contract must state how such pre-existing mismatches are handled, rather than introducing a free reset/new service silently.
5. **No between-race care/recovery is compatible** with the frozen active-championship guards. This does not remove ordinary pace-related native beast-fatigue recovery already present inside racing physics. M2-D end-cycle recovery stays untouched in this phase; any future integrated native recovery must be versioned and cannot run twice or after departure eligibility has already been evaluated.

## Double-counting and historical-data safeguards

- Apply the approved conversion once per authoritative cleared result identity; never again at reload, retry, standings update or settlement.
- Transfer absolute native final values; do not subtract native damage a second time.
- Keep beast fatigue, driver strain, chariot wear and integrity separate; do not duplicate existing service/recovery reductions.
- Preserve acquisition basis, historical receipts and legacy raw fields; do not retroactively derive new injuries or normalize existing integrity/condition mismatches without an explicit approved migration policy.
- Condition0/Critical and existing integrity0/Destroyed do not authorize new permanent death, asset deletion or irreversible destruction rules.
- Until numerical approval, cleared evidence may be staged, but condition/standings/entitlements cannot be partially committed or the next race started.

## Approval still required

Approve the proposed mapping as an explicit versioned rule, including continuous interval boundaries, injury/availability retention, damage basis, and handling of pre-existing native-condition/integrity mismatches. If handling of native-only deficits should be deferred to a later service adapter, state that explicitly; no new healing service or free restoration will be invented here.

This document is compatibility analysis, not implementation of D2 or a request to reauthorize already-approved independent E2/E3 work.
