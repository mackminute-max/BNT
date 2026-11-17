> **Revision 2:** Read `06_REVISION_2_DECISION_REGISTER.md` and `07_DETERMINISTIC_GENERATION_AND_NUMERIC_FIXTURES.md` first. Their explicit reconciliations supersede any conflicting older language in this document. No implementation authorization.

# M2-C — Approved Economy and Stable Management Specification

## Scope boundary
Implement **only after separate owner authorization**: one-time deterministic initial market; purchasing and resale; driver/specialist contracts; paid recovery; permanent facility upgrades; XP-funded driver/beast training; Gold-funded chariot engineering; versioned persistence and migration; minimal usable management UI and diagnostics. M2-D owns management-cycle progression, wages due/expiry, XP accrual and market replenishment. M2-E and later own additional progression and racing expansion. Racing simulation, Strategy Signs, weather, event logic, commentary and deterministic replay remain unchanged.

## 1. Market (M2-C-01,02,12,27,28)
Exactly 23 initial offers per career, generated once, persisted, never refreshed during M2-C. Each offer has stable identity, category, tier, native stats where applicable, immutable generation inputs, quality, condition, price, availability and generator version. No race RNG consumption. Same source career/generator version => identical offers. Generation is an atomic part of new-career economy initialization or explicitly confirmed migration, never read/preview side effect.

| Category | Budget | Standard | Premium | Total |
|---|---:|---:|---:|---:|
| Drivers | 2 | 2 | 1 | 5 |
| Beasts | 2 | 3 | 1 | 6 |
| Chariots | 1 | 1 | 1 | 3 |
| Specialists | 1 | 1 | 1 | 3 |
| Equipment | 3 | 3 | 0 | 6 |
| **Total** | **9** | **10** | **4** | **23** |

| Offer category | Budget G | Standard G | Premium G |
|---|---:|---:|---:|
| Driver recruitment | 200 | 400 | 800 |
| Beast | 150 | 325 | 650 |
| Chariot | 375 | 625 | 1150 |
| Specialist recruitment | 200 | 375 | 625 |
| Equipment | 100 | 275 | 425 |

Offer price = `round_to_nearest_5(referencePrice × marketQuality × conditionModifier)`, with persisted `marketQuality` in [0.85,1.15] and `conditionModifier` in [0.70,1.00] for driver/beast/chariot, **not specialists or equipment** (condition-neutral categories). Use positive decimal half-up rounding to nearest 5 G; see Revision 2 reconciliation for fixed rules and tests. New hires start XP=0. Acquisition is atomic and capacity-checked. An offer is consumed only once. No reroll/replenishment. New market entities must use verified native 0–100 fields and compatible weight/capacity bounds.

## 2. Personnel contracts (M2-C-03,05,06,07,13)
Drivers and specialists are hired personnel: recruitment fees and contracts, wages but **no resale**. Beasts, chariots and equipment are owned assets: purchase/resale, **no wages**.

| Term | Duration in future management cycles | Signing surcharge | Wage multiplier | Early termination fee |
|---|---:|---:|---:|---|
| Short | 3 | 0 G | 1.25 | 1 × base wage |
| Standard | 8 | 50 G | 1.00 | 2 × base wage |
| Long | 16 | 125 G | 0.85 | 3 × base wage |

Recruitment fee is separate from surcharge. Base wage = round-half-up(`tierReferenceWage × individualWageQualityModifier`); contract wage = round-half-up(`baseWage × termMultiplier`). Modifier fixed per person in [0.90,1.10]; persist both integer wages. Driver tier reference wages: Budget 20 G, Standard 35 G, Premium 60 G. Specialist: Budget 15 G, Standard 30 G, Premium 50 G. Training does not automatically increase wages. No wage payment, cycle tick, expiry, or automatic renewal in M2-C.

M2-B starter drivers receive grandfathered Standard contracts, 8 cycles remaining, zero recruitment and signing charges. Classify starter driver tier by arithmetic mean of native `driving`, `beastHandling`, `combat`, `awareness`, `nerve`: <45 Budget, 45 to <65 Standard, >=65 Premium. Ambiguous native values reject migration; do not guess. Grandfathered wage-quality modifier is exactly 1.00, persisted; no randomization.

## 3. Paid recovery and maintenance (M2-C-08,09,10)
Management injury severity: Healthy=0, Minor=1, Major=2, Critical=3. Minor is race-eligible subject to native restrictions; Major/Critical ineligible. Do not overwrite native injury/condition; flag invalid assigned RU rather than disassembling it silently. Services are immediate and repeatable up to validated healthy bounds. A service with no actual effect rejects without charging.

| Service | Base cost | Immediate effect |
|---|---:|---|
| Driver recovery | 40 G | Management fatigue −25 |
| Driver treatment | 100 G | Management injury −1 category |
| Beast care | 30 G | Beast fatigue −25 |
| Beast treatment | 80 G | Management injury −1 category |
| Chariot repair | 15 G per 10 integrity restored | Restore management integrity; charge proportional actual points, round up whole G |
| Chariot refurbishment | 100 G | Wear −25 |

For chariot repair, 5 integrity points cost ceil(15×5/10)=8 G. Partial recovery/refurbishment retains fixed base charge. Eligible active specialist discounts: Beast Handler 15% on beast care/treatment; Mechanic 15% on chariot repair/refurbishment; Physician 15% on driver treatment. Purchased Workshop 10% on chariot repair/refurbishment; Treatment Ward 10% on driver/beast medical treatment. Discounts additive, capped at 25%; final price nearest whole G, minimum 1 G. Validate actual specialist role, active contract and specialist capacity. No invented mapping from driver management fatigue to native strain, or from management injury to native condition.

## 4. Facilities (M2-C-04,11)
Exactly one permanent purchase of each upgrade per property; benefits immediate, no demolition/resale, additive to Basic capacities. Existing M2-B descriptive-only facilities are **not** purchased upgrades.

| Upgrade | Gold | Effect |
|---|---:|---|
| Staff Quarters | 300 | +2 specialist slots (Basic 0) |
| Expanded Stables | 400 | +2 beast capacity |
| Driver Quarters | 350 | +1 driver capacity |
| Additional Chariot Bay | 450 | +1 chariot capacity |
| Workshop | 500 | 10% chariot repair/refurbishment discount |
| Treatment Ward | 450 | 10% driver/beast medical treatment discount |
| Training Grounds | 600 | 10% XP training cost discount |

Total seven upgrade cost: 3050 G. Reject specialist recruitment at zero available specialist capacity; reject purchases exceeding other capacities. Capacity must respect assigned and unassigned owned records.

## 5. Training and engineering (M2-C-14,15)
Eligible **verified native rating fields only**. Native rating cap 100. Maximum five increments per transaction. Cost each increment from its **starting rating before that increment**, sum incremental costs, then apply any approved discount.

| Current rating before +1 | Driver/beast XP per point | Chariot engineering Gold per point |
|---|---:|---:|
| 0 ≤ rating < 60 | 10 | 75 |
| 60 ≤ rating < 75 | 20 | 125 |
| 75 ≤ rating < 90 | 35 | 200 |
| 90 ≤ rating < 100 | 60 | 350 |

Training Grounds discounts summed training XP cost by 10%; round **up** to whole XP after discount. Driver/beast XP cannot become negative. Chariot engineering lifetime cap **10 permanent increments across all chariot ratings**, with max five per transaction. Engineering is Gold-funded, no resale uplift/refund and no automatic repair. Persist permanent engineering increment ledger and validate total against native rating changes. No specialist progression, no equipment effect/slot system in M2-C.

## 6. Resale (M2-C-03,12,17–20)
Beasts/chariots: floor(50% of **current reference valuation** including tier, permanent quality and verified current condition), capped at original acquisition basis. Exclude permanent training/engineering expenditure. Equipment: floor(40% of original acquisition price), capped at original acquisition price. Personnel not resalable. Starting granted beasts/chariots and the **two source-verified equipment records in each starter package** receive deterministic immutable acquisition basis, never a fictitious purchase/debit.

Starting tier from mean verified native base rating: <45 Budget, 45–<65 Standard, >=65 Premium. Quality `Q = clamp(0.85 + 0.003×meanRating,0.85,1.15)`. Condition factor `C = 0.70 + 0.30×H/100`, H in [0,100] supplied by the **Revision 2 versioned per-asset valuation-health design contract**, subject to code compatibility verification. Persist original basis using original condition; current valuation uses current verified health. No averaging/fallback for H. Equipment is condition-neutral. Chariot integrity, condition and wear are distinct: never equate them without an explicitly verified adapter contract. Assigned assets must be explicitly unassigned first; never dismantle RU implicitly. No refund of engineering/training investment.

## 7. User interface (M2-C-33–36 integration)
Minimum usable browser UI: persisted market with prices/tier/capacity checks; owned roster and asset resale; personnel contracts and active specialist slots; facility purchases; recovery; training/engineering with per-increment cost preview; treasury/XP feedback; explicit confirmation of irreversible actions; transaction receipts and actionable failure diagnostics. M2-B RU assembly/disassembly and native baseline preview remain functional. All commands must go through the approved domain transaction store. Developer tuning panel and racing viewer unchanged.

## 8. Explicit exclusions
No management cycle progression, recurring wages, contracts expiring, XP rewards, market restock, loans, race prize payouts, repair timers, delayed treatment, automatic RU disassembly, race physics changes, species restrictions, equipment bonuses, specialist leveling, demolition, or unapproved attribute conversions.
