> **Revision 2:** Read `06_REVISION_2_DECISION_REGISTER.md` and `07_DETERMINISTIC_GENERATION_AND_NUMERIC_FIXTURES.md` first. Their explicit reconciliations supersede any conflicting older language in this document. No implementation authorization.

# M2-C — Mandatory Acceptance Gates and Numerical Fixtures

**No waived failures. No native adapter fallback. A successful build is not acceptance.** Evidence must include exact test commands, test counts, logs, native adapter mapping, before/after migration manifests for all five packages, browser persistence and deterministic racing checksums.

## Gate A — M2-B preservation
- All five approved packages, starting Gold/rosters/capacities/assignments, protected grant identities and descriptive facilities unchanged by ordinary load/import/inspection.
- Migration previews pure/read-only. Owner-confirmed migration once only. Both revision counters and canonical source fingerprint must match; any change blocks commit.
- Migrated starter drivers have Standard 8-cycle grandfathered contracts without debit; starter beasts/chariots receive deterministic immutable valuation basis without debit.
- No duplicate grants via repeated migration, alternate command IDs, old checkpoints, import/recovery or receipt pruning.
- Existing M2-B v1 commands and protected-history v1 remain supported; no silent M1 history rewrite.

## Gate B — Economic correctness
- Exactly 23 initial offers with category and tier counts (drivers 2/2/1, beasts 2/3/1, chariots 1/1/1, specialists 1/1/1, equipment 3/2/1); same snapshot+generator => same offer IDs/attributes/prices.
- Every purchase consumes only selected offer and obeys Gold, capacity and contracts. Staff Quarters required before specialist recruitment. Market never replenishes in M2-C.
- Facilities seven once-only purchases total 3050 G, correct capacities/discounts, no retroactive benefit from descriptive facilities.
- Contract surcharges, wages, early termination and term durations exact; no wages accrue or contracts expire in M2-C.
- Recovery: partial/fixed price, no-effect rejection, injury category eligibility, discounts and bounds.
- Training: incremental XP tier crossing, cap 100, max five/transaction, 10% XP discount ceil; engineering: Gold tiers, 10 lifetime increments and no resale refund.
- Resale: beasts/chariots half verified current reference valuation capped original basis; equipment 40% acquisition; no personnel resale or automatic unassignment.

### Exact arithmetic fixture examples
These are synthetic fixtures, not assertions about any generated offer.
| Case | Expected |
|---|---|
| Chariot repair restores 5 management integrity | `ceil(15×5/10)=8 G` before discounts |
| Beast treatment 80 G with Beast Handler 15% and Treatment Ward 10% | 60 G |
| Driver treatment 100 G with Physician 15% and Treatment Ward 10% | 75 G |
| Chariot refurbishment 100 G with Mechanic 15% and Workshop 10% | 75 G |
| Driver recovery fatigue 10→0 | 40 G (partial, fixed charge) |
| Driver recovery fatigue 0→0 | reject, 0 G |
| Training native rating 59→61 | 10+20 = 30 XP, or ceil(27)=27 XP with Training Grounds |
| Training rating 74→76 | 20+35 = 55 XP, or ceil(49.5)=50 XP with Training Grounds |
| Engineering chariot rating 59→61 | 75+125 = 200 G |
| Engineering rating 99→100 | 350 G |
| Standard Budget driver with base wage 20 G, quality 1.0 | 20 G contract wage, 50 G signing surcharge |
| Short Budget driver with base wage 20 G, quality 1.0 | 25 G contract wage, 0 G surcharge, termination fee 20 G |
| Long Budget driver with base wage 20 G, quality 1.0 | 17 G contract wage, 125 G surcharge, termination fee 60 G |
| Equipment purchased for 275 G, later resold | floor(0.4×275)=110 G |
| 50% asset valuation 375 G, original acquisition basis 150 G | resale min(floor(187.5),150)=150 G |

For repair discounts, **first** compute proportional base repair price for actual integrity restored, **then** apply additive discounts and round final Gold. Explicitly test fractional ties and rounding. Do not substitute 10-integrity blocks or charge for nonexistent repair.

## Gate C — Transaction integrity
- Exact retry returns identical original committed receipt while retained, no write; stale revision is ignored **only for verified exact committed retry**.
- Conflicting transaction ID/effect/ownership/payload rejects; protected committed identity without active receipt returns `ALREADY_COMMITTED` and null receipt, no mutation.
- New command stale gameplay or maintenance revision rejects; Gold/XP insufficiency, capacity overflow, unsupported native field, invalid target, zero-effect service and duplicate offer reject without mutation.
- Persistence failure/quota, interrupted migration, import failure and stale preview preserve original bytes/state/history.
- Reload after success preserves receipt, consumed offers, Gold, XP, contracts, facility and training ledger; duplicate retry after reload has no effect.
- No economy command bypasses atomic CareerStore transaction; deterministic receipt results validated.

## Gate D — Racing regression
- Compare M2-A/M2-B known deterministic fixture captures and checksums with M2-C for equivalent native racing inputs, including RU assembly, Strategy Signs, race events and commentary where covered by baseline.
- Native adapter must emit exact allowed driver/beast/chariot fields and neutral equipment aggregate; no management metadata, invented integrity, automatic fatigue→strain or modified race physics.
- Validate legal/illegal RU conditions, two distinct beasts, assignments and baseline `previewRU` semantics; existing race viewer, pause/step/replay unchanged.
- Run existing Node test suite, browser suites and build/standalone parity tests; report commands, versions, counts, checksums, runtime errors and any browser file-navigation limitation distinctly from test failures.

## Required fixture families
1. All five starter package migrations with precise before/after manifests, immutable valuation basis and contract wages.
2. 23-offer deterministic market across new career, migration, repeated preview, reload, purchase and exhaustion.
3. Each purchase/sale/contract/facility/service/training/engineering happy path and every boundary.
4. Revision/fingerprint mismatch matrix; preview cancel; two confirmations; rollback on write failure.
5. Protected ID replay/conflict/pruning; restore old checkpoint; mixed schema and invalid import.
6. Native allowlist, valuation-health adapter bounds, chariot condition/wear/integrity distinctions.
7. Replay parity and UI browser end-to-end with zero unexpected runtime requests.

## Reporting requirement
For each gate record PASS/FAIL/BLOCKED, test names and commands, exact output, baseline comparison, source revision and artifact location. **BLOCKED is not PASS**. Stop for owner decision on any unresolved source contract conflict.
