# Blood and Thunder — Implementation Readiness Matrix

Source assessed: **`171ea008cebadcb183ba137c7d6f1bf887897aa0`**, simulation **`0.6.0-tracks`**. This matrix describes the actual code and proposed future work. No management implementation accompanies it.

Read with [the architecture audit](Blood-and-Thunder-Architecture-Audit.md), especially the recommended contracts/persistence (F–G), milestones (I) and owner decisions (L). Fresh evidence is in [architecture-audit/evidence](architecture-audit/evidence/).

## Decision and next action

**First production task after approval: M1—validated profile/career identity and transactional save/recovery.** First resolve M0 policies and file-origin persistence acceptance. Do not begin with a large stable dashboard, technique tree or economy inside `sim/race.js`.

Recommended approval sequence:

1. Approve the minimal championship/consequence/economic/save policies listed at the end of this matrix.
2. Authorize M1 alone, with fake-storage fault tests and a small save/recovery screen; obtain real target-browser file-origin evidence before declaring durable-career readiness.
3. Review that gate, then authorize assembly/ledger and the one-race bridge. Chain races only after result application and interruption are reliable.
4. Complete the six-stage championship, settlement/liquidation and one market category. Review the repeatable two-championship loop before advanced management content.

The architecture needs additions and a narrow UI/race adapter, **not a new simulation engine, TypeScript conversion, Phaser installation, framework replacement or backend**.

## Classification and milestone key

| Classification | Meaning |
|---|---|
| Existing and usable | Working code can be reused for its actual scope, with tests within stated coverage. |
| Existing but requires modification | Useful implementation exists, but a narrow adapter/extension/lifecycle boundary is needed. This does not mean its current racing behavior is defective. |
| Missing and required | No implementation found; essential to the minimum management loop. |
| Missing but deferrable | Planned functionality with no current implementation; can wait until the loop works. |
| Blocked by another dependency | Required work cannot be completed correctly until listed policy or foundation prerequisites exist. It is not secretly partially implemented. |

Risk: **LOW** limited additions; **MODERATE** meaningful integration; **HIGH** state integrity, irreversible consequences, transactions, compatibility or unverified platform behavior. Milestones are proposals, not existing modules or authorization.

| Milestone | Outcome | Primary gate |
|---|---|---|
| M0 | Policy/contracts and standalone storage proof | Owner choices recorded; file-origin capability/failure and writer policy demonstrated |
| M1 | Career/profile schema, IDs and safe saves | Validated round-trip, explicit recovery, migrations and failed-write rollback |
| M2 | Starter stable, assembly, treasury ledger | No missing/duplicate/nonowned asset use; deterministic numeric projection |
| M3 | One race into persistent consequences once | Saved start/restart, copied outcome, receipt/deduplication and error policy |
| M4 | Approximately six-race championship and isolated budget | Fixed entry/opening/finale, saved offers, points, services, no top-up |
| M5 | Settlement, obligations, liquidation and minimal Legacy | Atomic settlement/closure, no double rewards or free bailout |
| M6 | Small market and repeated playable loop | Asset purchase/change between two championships; save/resume throughout |
| M7+ | Later approved content | Advanced progression/staff/facilities only after M1–M6 work |

## 1. Existing racing/build capabilities

| System | Readiness | Verified evidence / integration work | Dependency | Earliest milestone | Risk |
|---|---|---|---|---|---|
| Headless seeded engine | Existing and usable | `sim/race.js:createRace,step,run`; explicit inputs and no DOM/Phaser dependency | Preserve current rules | M3 reuse | LOW |
| Numeric driver/beast/chariot attributes | Existing and usable | `model/ru.js:validateRU,derive`; current attributes all represented | Project only validated racing fields | M2 | LOW |
| Owned asset → race RU mapping | Missing and required | No component ID fields; nested `driver.id` is rejected by current validator | Entity registry and strict sidecar binding | M2 | MODERATE |
| Autonomous AI/personality/perception | Existing and usable | `ai/driver.js`, `combat-value.js`; tested contextual combat and hidden-rival constraints | No new technique behavior without approval | M3 reuse | LOW |
| Movement/lane geometry/occupancy | Existing and usable | `kinematics.js`, `race.js`, `track/`; continuous movement/discrete occupancy | Freeze validated course/config | M3 reuse | LOW |
| Pure/Combat, damage/fatigue/control/wrecks | Existing and usable | Current engine/consequences/environment and regression suite | Career consequences decided outside engine | M3 reuse | LOW for current rules |
| Long-term injury/death/repair meaning | Blocked by another dependency | Race condition/retirement exists; no persistent injury or destruction policy | Approved carryover/recovery rules | M3–M4 minimal | HIGH |
| Finish/ties/DNF classification | Existing and usable | `race.js:classification,crossing`; precise common-line/terminal logic | Championship points remain separate | M3 | LOW |
| DNS preparation | Existing but requires modification | Recognized in results/tests, not supported by a public setup transition | Decide whether championship needs DNS | M4 only if approved | MODERATE |
| Disqualification | Missing but deferrable | No DQ status/command/adjudication | Explicit rules if later required | M7+ | MODERATE |
| Race completion/error/blocked-clearance policy | Blocked by another dependency | Ended/Stalled/Error and maxTicks-running are distinct; not all Stalled means no official result | Owner decision + copied outcome contract | M0 then M3 | HIGH |
| Results handoff | Existing but requires modification | `reporting/results.js` structured output; some signs/diagnostics alias live state | Copy/validate and bind race ID/expected career revision | M3 adapter | MODERATE |
| Replay reconstruction | Existing and usable | `capture`, `startReplay`, `verifyReplay`; fresh reference checksums match | Exact matching engine version; replay never awards career rewards | M3 reuse | LOW |
| Cross-version pending-race resumption | Blocked by another dependency | Replay rejects other engine versions; career migrations absent | Approved compatibility policy and versioned start snapshot | M0–M3 | HIGH |
| Developer tuning/batches/config exports | Existing and usable | `dev/`, `ui/workbench.js`; cancellable/yielding batches and paused edit transport | Isolate scenario editing from ordinary career mode | M3/M6 reuse | MODERATE |
| Typechecking/linting/CI | Missing but deferrable | No configured scripts/config/CI workflow found | Separate tooling approval if desired | M1+ optional | MODERATE maintenance |
| Single-file HTML build | Existing and usable | `scripts/build.mjs`; two identical 210,295-byte artifacts, zero runtime dependencies | Keep new content/modules bundled | Every milestone | LOW |
| Real Windows direct-file save/load acceptance | Blocked by another dependency | Managed browser reports `ERR_BLOCKED_BY_ADMINISTRATOR`; HTTP is not file testing | Permitted browser/owner verification of current artifact | M0; every acceptance gate | HIGH |

## 2. Track-system readiness — source and tests verified

| System | Readiness | Evidence / gap | Dependency | Earliest milestone | Risk |
|---|---|---|---|---|---|
| Short/Standard/Grand Ovals | Existing and usable | `catalog.js:ovalPresets`; distinct dimensions, configurable laps; fresh tests | Approved championship track selection | M4 reuse | LOW |
| Twelve irregular circuits | Existing and usable | C01–C12 authored layouts, unique profiles/both turn directions; fresh validity and browser selection checks | Store actual definition/version | M4 reuse | LOW |
| Procedural Rally | Existing and usable | `generateRally`; Short/Medium/Long, 17 chunks, terrain and turn controls; 100 seeds/category tested | Generate offer once, persist full course | M4 reuse | LOW/MODERATE |
| Separate deterministic track seed | Existing and usable | Generator uses keyed namespace separate from race draws; configuration recipe survives round-trip | Pin generator version/recipe plus geometry | M4 | LOW |
| Terrain and weather interactions | Existing and usable | Existing dirt/stone/gravel/sand/mud profiles, grip/roughness/rolling/hazard modifiers | Do not invent new penalties | M3 reuse | LOW |
| Track validation | Existing and usable | Compile/connectivity/radius/start/finish checks; separate sampled footprint check and fallback tests | Offer preparation must explicitly call footprint validation; sampled limits disclosed | M3–M4 | MODERATE |
| Variable physical width/lane merges | Missing but deferrable | Four constant lanes; technical “narrow” windows do not merge lanes | Separate geometry/movement design if ever needed | M7+ | HIGH; defer |
| Lap and Rally terminal progress | Existing and usable | Closed common line, no Rally wrap, precise ties and exit | Saved topology/checkpoint definition | M3 | LOW |
| Rally checkpoints/Strategy Sign activation | Existing and usable | Swept 25/50/75% markers, one cursor/RU; pre-race and closed-line behavior retained | No career change to uses/effects without approval | M3 | LOW |
| Preview/selector/follow/minimap | Existing and usable | Fresh 10-group browser panel; all fixed selections + generated seed variation and topology parity | Mount/reset lifecycle during career navigation | M3 integration | MODERATE |
| Championship course-offer registry | Missing and required | Tracks exist; saved offers/choices do not | Controller/content template and persistent offers | M4 | MODERATE |

## 3. Minimum career, economy and championship foundations

| System | Readiness | Minimum addition | Dependency | Earliest milestone | Risk |
|---|---|---|---|---|---|
| Profile + active career state | Missing and required | Version/revision, IDs, legal phases, entity maps and separate Legacy domain record | M0 contract | M1 | HIGH |
| Persistent IDs/ownership/reference validation | Missing and required | Typed driver/beast/chariot/item IDs, no duplicate selection or fabricated missing asset | Schema and saved ID allocation | M1 | HIGH |
| Autosave after committed decisions | Missing and required | New career storage key/commit service; existing config Save is not autosave | Storage/write-failure policy | M1 | HIGH |
| Primary/recovery checkpoint + corruption UX | Missing and required | Validate both, preserve raw corruption, player-confirmed recovery, no silent overwrite | M0 storage choice and failure tests | M1 | HIGH |
| Manual career JSON import/export | Missing and required | Validate temporary model, explicit replacement, portable backup | Career schema/migration | M1 | MODERATE |
| Explicit career migrations | Missing and required | Ordered schema transforms, pre/post validation, backup, unknown-version rejection | Separate schema/content/engine versions | M1 | HIGH |
| Atomic career commit/single-writer protection | Missing and required | One validated aggregate/envelope write; serialize commands; approved writer restriction | File-origin capability and concurrency policy | M1 | HIGH |
| Starter stable/career creation | Missing and required | One driver, two selected beasts, basic chariot, Gold, basic property/facility capacity, no specialists | Approved starter data and M1 | M2 | MODERATE |
| Legal owned RU assembly | Missing and required | Resolve locked IDs, order beasts, enforce availability/capacity; whitelist numeric projection | Asset registry | M2 | MODERATE |
| Treasury account and transaction ledger | Missing and required | Safe-integer Gold, IDs/causes, validated debits/credits and conservation tests | M1 and economic policy | M2 | HIGH |
| Durable race-start checkpoint/restart | Missing and required | Save fully resolved input/seed/track/opening commands before launch; restart at start, never mid-race | M1–M2, engine-version policy | M3 | HIGH |
| Exactly-once race result application | Missing and required | Expected revision/race binding and durable receipt; copied authoritative outcome | M3 race adapter and ledger | M3 | HIGH |
| Between-race condition/fatigue updates | Blocked by another dependency | Map final engine components to owned IDs; explicit repair/recovery/availability | Approved condition policy and receipt | M3–M4 | HIGH |
| Championship controller | Missing and required | Approximately six stages, fixed opening/finale, saved middle offers, eight entrants | M3 reliable handoff + template rules | M4 | HIGH |
| One player entry/no substitutions | Missing and required | Freeze committed asset IDs, validate on every stage; no replacement of lost/unavailable asset by defaults | Assembly/availability and withdrawal rules | M4 | HIGH |
| Run-budget isolation | Missing and required | Initial transfer, only run rewards/service spending during championship; no treasury top-up | Ledger + entry/fee policy | M4 | HIGH |
| Race purses and event rewards | Blocked by another dependency | Configured run-account credits with result/event receipts | Award tables and M3/M4 | M4 | MODERATE |
| Championship points/standings | Blocked by another dependency | Configured scoring with official ties/DNF and placement tie handling | Owner-approved points policy | M4 | MODERATE |
| Basic between-race services | Blocked by another dependency | Minimal paid repair/recovery commands, no free hidden healing | Recovery costs/effects and budget model | M4 | MODERATE |
| Withdrawal/elimination | Blocked by another dependency | Explicit terminal paths and effect on settlement/qualification | Championship/consequence policy | M4 | HIGH |
| Atomic championship settlement | Blocked by another dependency | Unused budget return, prizes, obligations, cycle increment and one receipt in one commit | M4, approved ordering | M5 | HIGH |
| Recurring upkeep/financial forecast | Missing and required | One shared cycle-based liability calculator, configurable amounts, no wall-clock charging | Ledger/qualifying-cycle policy | M5 | HIGH |
| Controlled Liquidation | Missing and required | Restricted eligible sales/termination/cancellation rules; viability test, no spending/bailout loophole | Obligations and eligible-asset policy | M5 | HIGH |
| Career termination | Missing and required | Terminal phase and immutable compact record; no accidental “new career” on corruption | Liquidation/failure rules | M5 | HIGH |
| Minimal Owner Legacy persistence | Missing and required | Separate profile domain, exactly-once career record and minimal approved starting options | Career closure/save aggregate | M5 | MODERATE |
| Basic market/asset purchase | Missing and required | One category, generated-once saved offers, atomic ownership/fund/capacity transfer | M1/M2/M5 and approved content | M6 | MODERATE |
| Whole-loop headless evaluator | Missing and required | Controller/ledger scenarios with fixture outcomes + separately bounded real races | M3–M6 | M6 | MODERATE |
| Career navigation/save-state UI | Missing and required | Stable, roster, championship, small market, finance/records/save views using HTML/CSS | Implement incrementally with corresponding domains | M1–M6 | MODERATE |

**Atomicity qualification:** current code has no career atomicity. A proposed one-envelope localStorage commit provides one logical write for the whole career/profile update; it does not guarantee disk durability or concurrent-tab transactions. Single-writer MVP scope and capability testing are prerequisites. IndexedDB transactions are the lower-complexity alternative if concurrent writers become a requirement; do not create a backend or homemade distributed lock system.

## 4. Advanced management/progression content

These rows are intentionally **not** part of the minimum loop unless the owner changes scope. Starter property/capacity/upkeep records and a basic service are smaller prerequisites, not implementations of the complete systems below.

| System | Readiness | Missing data/interface | Dependency and first reasonable phase | Risk / treatment |
|---|---|---|---|---|
| Ordinary/professional personnel employment | Missing but deferrable | Role/contract/availability, recurring wages and termination | M7+ after ledger/obligations/roster | MODERATE; begin with one role |
| Mercenary contracts | Missing but deferrable | Temporary term, expiry/fees, championship lock and exit behavior | M7+ after employment and controller | HIGH; resolve availability edge cases first |
| Stable Hand | Missing but deferrable | Qualifications, capacity/service effects | M7+ employment/basic facilities | MODERATE |
| Beast Trainer | Missing but deferrable | Training qualification/service and project capacity | M7+ projects/potential rules | MODERATE |
| Mechanic/Chariot Builder | Missing but deferrable | Repair/build qualification, workshop/project interface | M7+ services and facilities | MODERATE |
| Equipment Manager | Missing but deferrable | Inventory/equipment service effect and qualification | M7+ item system | MODERATE |
| Driver Coach | Missing but deferrable | Driver project eligibility/training effect | M7+ progression/projects | MODERATE |
| Recruiter / Scout | Missing but deferrable | Offer/disclosure generation modifiers, qualification | M7+ saved markets and redacted projections | MODERATE |
| Doctor | Missing but deferrable | Treatment/recovery eligibility/cost and injury meaning | M7+ persistent injury rules | HIGH prerequisite policy |
| Mage / Alchemist | Missing but deferrable | Defined services/effects, qualifications and project costs | M7+ explicit effect design and laboratory content | HIGH; defer |
| Black Market Vendor | Missing but deferrable | Offers/access/risk rules | M7+ ordinary market/eligibility works | MODERATE/HIGH |
| Passengers | Missing but deferrable | Identity/ownership/seat/eligibility and approved racing effects | M7+ effect specification | MODERATE/HIGH |
| Beast Stables | Missing but deferrable | Full tiers/capacity/requirements/upkeep/construction | M7+ facility/project system; starter capacity M2 | MODERATE |
| Training Grounds | Missing but deferrable | Training capacity/tier effects | M7+ projects/training | MODERATE |
| Workshop | Missing but deferrable | Build/repair capacity and tier requirements | M7+ projects/services | MODERATE |
| Infirmary | Missing but deferrable | Treatment slots/qualification/tier/upkeep | M7+ injury/recovery services | MODERATE |
| Arcane Laboratory | Missing but deferrable | Research effects/projects/qualifications | M7+ magic design | HIGH; defer |
| Driver Training Hall | Missing but deferrable | Driver project capacity/tier effects | M7+ training/projects | MODERATE |
| Stable Office | Missing but deferrable | Administrative tier/capacity/service benefits | M7+ approved benefits | MODERATE |
| Plots/construction/expansion | Missing but deferrable | Abstract plot allocation, build costs/requirements/progress/cancel rules | M7+ facilities + economy/cycle clock | HIGH; prerequisite first |
| Property market/relocation | Missing but deferrable | Generated offers, capacities/upkeep, migration transaction | M7+ markets/facility capacity/obligations | HIGH; defer |
| Practical Experience/fixed advancement | Missing but deferrable | Awards, saved choices, caps and exactly-once progression | M7+ race/settlement receipts and approved award rules | MODERATE; numeric projection first |
| Techniques/specialization tiers | Missing but deferrable | Data definitions/eligibility/effects/stacking; later minimal engine hooks if needed | M7+ progression and specific effect approval | HIGH; simplify first |
| Inherent/latent/developed traits/potential | Missing but deferrable | Generated-once hidden metadata, reveal and effect rules | M7+ asset registry/disclosure | MODERATE |
| Hybrid formal training | Missing but deferrable | Guaranteed improvement + saved potential-based bonus resolution | M7+ qualifying cycles/projects/progression | MODERATE/HIGH |
| Tier I–III retraining and availability | Missing but deferrable | Tier I concurrent/reduced progress, II/III unavailable; retraining target/state | M7+ project/entry-lock rules | HIGH integration |
| Voluntary/involuntary project interruptions | Missing but deferrable | Explicit cause, saved progress, only voluntary pause penalty | M7+ projects/qualifying cycles | HIGH; do not conflate causes |
| Pair familiarity/compatibility | Missing but deferrable | Pair IDs/history and approved modifier; numeric mismatch formula alone is not familiarity | M7+ persistent beast identity and progression | MODERATE |
| Broad recruitment categories/expiry/gates | Missing but deferrable | Saved offers for staff/passengers/properties/underground/championship markets; Renown/performance gates | M7+ first category and ownership transactions | MODERATE |
| Extensive Legacy perks/unlock tree | Missing but deferrable | Unlock conditions, retained records, starting-choice effects | M7+ career closure and new-career creation | MODERATE; avoid large tree |

## 5. Required acceptance coverage for the next approved work

The existing 212 tests protect racing; they do not test any of the missing career systems. Add focused tests at the milestone that owns each invariant:

- **Identity/assembly:** unique IDs, no missing references, no substitute defaults, ownership/availability/capacity, no duplicate beasts, stable component ordering and copied projections.
- **Persistence:** kind/schema/version validation, primary/recovery checks, explicit recovery, malformed/missing assets, future schemas, migrations, quota/denied writes, no silent corruption overwrite, stale writers and approved manual-export fallback.
- **Race handoff:** saved complete input/route and opening signs; interruption restarts from start; Pure/Combat/all topologies; copied terminal summaries; callback/reload/replay duplicates cannot apply effects twice; Error/incomplete and classified-clearance-block policies.
- **Championship:** fixed opening/finale, saved offer choice, eight units/one player, no substitution/top-up, official ties/DNF scoring, purses, limited services and withdrawal/elimination; no recalculated offers/hidden values on load.
- **Money/settlement:** safe integers, budget/treasury isolation and conservation, fee source/order, liability forecast equals committed calculator, duplicate/failed settlement, exactly-once qualifying cycle, solvent/insolvent liquidation and no bailout.
- **Roguelite:** terminal careers cannot resume normal spending/racing, closure records Legacy once, new career retains approved Legacy and does not reuse active assets/IDs improperly.
- **Market:** deterministic saved candidates, redacted ordinary UI, fixed hidden data through expiry/purchase/reload, insufficient funds/capacity, duplicate purchase receipt and atomic ownership transfer.
- **End-to-end:** requested 13 steps across two championships with a purchase/change between; save/import/recovery at every committed boundary; existing full tests/build/browser parity retained. Actual new HTML direct-file/storage tests must be reported separately from HTTP diagnostics.

Minimum release gate is the working repeatable loop plus reliable failure/recovery, not the presence of fifteen management menu labels. A whole-career balance harness may use fixture outcomes for fast economy testing but must label those runs and retain a real-engine integration subset.

## 6. Decisions to resolve before implementation

| Decision | Why it blocks work | Dependent milestone |
|---|---|---|
| Six-race template, points/ties/DNF/DNS, withdrawal/elimination and qualifying completed-cycle definition | Avoid inventing awards/progression or scoring unavailable outcomes | M4–M5 |
| Locked entry scope for NPCs and persistent NPC consequences | No substitutions/field continuity must have an explicit interpretation | M3–M4 |
| Fatigue/condition/injury/asset-loss/recovery and post-finish damage carryover | A race condition number or wreck is not a permanent injury/death rule | M3 |
| Fully classified blocked-clearance settlement policy | Explicit Stalled can coexist with valid official classification | M3–M5 |
| Starter Gold/assets/capacity, fees/run allocation, prizes/services/obligation priority and liquidation viability | Finance semantics must be approved even when numbers remain provisional | M2–M5 |
| Target browser, single-writer policy, storage-unavailable UX and pending-race engine updates | Protect saves without unsupported file-origin/durability claims | M0–M3 |
| First market/improvement content and minimum Legacy starting options | Keep initial playable scope concrete and small | M5–M6 |

Until approval, the exact next activity is policy/contract review and a permitted file-origin persistence proof, followed by M1 when authorized. This matrix does not authorize implementation, dependency additions, tuning, publication or remote push.
