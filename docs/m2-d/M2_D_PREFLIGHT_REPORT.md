# Blood and Thunder — M2-D Read-Only Preflight

Date: 2026-11-17 (America/Los_Angeles). **STOP: owner design decisions and separate production authorization are required.** No M2-D implementation, migration, branch change, commit, merge or push was performed. This report and its new evidence are the only intended repository additions.

## Authority and baseline

Read the supplied ZIP in order: `00_START_HERE.md`, `01_M2D_SPEC.md`, `02_PREFLIGHT_AND_ACCEPTANCE.md`; then the M2-C implementation report/API, Revision 2.1 addendum, and M2-B history/API and native-contract documentation. The package supplies design requirements; the owner's current request authorizes **read-only preflight**, not production. Recommendations below are proposals, not newly approved rules.

| Item | Verified value |
|---|---|
| Repository | https://github.com/mackminute-max/BNT |
| Branch / initial worktree | `main`; clean |
| HEAD / remote main | `f66ec90a6659dd6bb675815bff4cc33e9850a643` |
| Accepted implementation parent | `79447d84a73f4d95eb65974cc79c59d191b111e7` |
| Other merge parent | accepted M2-B `105bce8a2a8f639b56c703cd75c56ce212471021` |
| HEAD tree | `4173d9427b2c79d03ddd5ebd00bc0cb4b8c445f9` |
| Accepted implementation comparison | `git diff --exit-code 79447d8 HEAD`: empty, exit 0 |
| Provenance | Owner confirmed local M2-C testing/acceptance and authorized merge; merge message records that approval. Remote main independently matched HEAD through `git ls-remote`. No remote M2-C feature ref was returned. |
| Runtime | Node `v24.22.1`; npm `11.9.0`; managed Chromium `156.0.8078.79` |
| Simulation / package | `0.6.0-tracks` / `0.6.0` |
| Architecture | Vanilla JavaScript ES modules, Canvas 2D, esbuild; no TypeScript/Phaser or server runtime |
| Standalone aliases | `dist/Blood_and_Thunder.html`, `dist/Blood-and-Thunder-Track-Test.html`; each 380462 bytes |
| SHA-256, both aliases | `13b2b1e3898c5df30f5b97b9b37c2bb033fc01c5ae9f43fd64bd89a3fc3e938f` |

The ZIP's warning that GitHub main might still be M2-B is historical and **resolved** by the accepted merge and exact tree comparison. Historical M2-C reports still say acceptance/merge pending because they precede the owner's acceptance; they were preserved unchanged.

## Source integration matrix

Paths/lines below refer to the immutable HEAD above. `SOURCE_COMPATIBLE` means a usable existing contract, not that M2-D is implemented. `REQUIRES_ADAPTER` means additive implementation is needed. `BLOCKED` means a source/design gate must be resolved before shipping that behavior.

| Area | Classification | Verified evidence and disposition |
|---|---|---|
| M2-C source baseline | SOURCE_COMPATIBLE | `src/career/state.js:10` sets career schema 3; `economy/base.js:20` performs explicit migration. Accepted commit/tree/artifact match. |
| Championship completion/rewards | REQUIRES_ADAPTER; live integration BLOCKED | `src/reporting/results.js:79` exports one race's setup/classification/statistics, with no championship ID, completion record or authorized rewards. `src/ui/app.js:77` creates standalone races. `economy/schema3.js:25` requires `pendingRace === null`. No authoritative championship controller or completion producer exists. |
| Settlement state machine | REQUIRES_ADAPTER | No management-cycle transition exists; `src/ui/stable-economy.js:43,68` explicitly reports no cycle progression. Need accepted completion → pure preview → confirmed atomic commit → preparation, independent of race/next-departure counts. |
| Exact Gold/payroll arithmetic | SOURCE_COMPATIBLE arithmetic; REQUIRES_ADAPTER ledger | `economy/arithmetic.js:13` enforces nonnegative exact rounded safe-integer Gold; `reducers.js:101` bounds treasury. Existing wages/terms are in `catalog.js:4–5`, contracts built at `records.js:27–32`. No accrual, arrears or payment allocation exists. |
| Persistent obligations after departure | BLOCKED under existing records | `registries.js:13` requires liability references to existing personnel/contracts/properties. `validation.js:13` rejects obligation content outside M2-C; `validation.js:50` rejects dangling references. `reducers.js:91` removes employee and contract on termination. Need an immutable creditor identity/archive model, not a dangling foreign key or deleted wage claim. |
| Contract expiry/renewal | REQUIRES_ADAPTER | `validation.js:34` requires cyclesRemaining to equal the full original duration; zero/decremented cycles reject. `validation.js:59–60` requires reciprocal employment. `records.js:29` forbids reusing an existing contract identity. No renewal command exists (`commands.js:4–5`). Version new contract records and explicit lifecycle. |
| Assignment/entry legality | REQUIRES_ADAPTER | `reducers.js:104–118` checks ownership, assignment, availability, injuries and native thresholds but not contract expiry. `validation.js:54–60` requires reciprocal assignments/employment. Keep an expired assigned driver visible but entry-ineligible; don't silently delete assignments. |
| Default departure | BLOCKED policy edge | `reducers.js:19,50–52` rejects assigned personnel termination. Automatic departure cannot simply call it or delete an assigned driver. Need protection/decision handling for assigned staff and exact first-departure timing; see owner gates. |
| Morale | BLOCKED | `src/model/ru.js:174–182` implements crowd-derived control, not payroll morale. `sim/race.js:116–120,399–407` passes one weather/crowd value into derivation. There is no independent per-driver temporary multiplier. Reusing crowd morale changes the wrong population and its effect depends on Nerve; lowering native ratings/strain violates the handoff. |
| Passive recovery | SOURCE_COMPATIBLE meanings; REQUIRES_ADAPTER commit | `catalog.js:14–21` defines management driver fatigue, directly bridged beast fatigue, integrity/wear and ordered Healthy/Minor/Major/Critical. `reducers.js:59–68,95–96` applies separate treatment fields; `115` passes driver strain and beast fatigue independently. Add cycle recovery: -20 fatigue bounded at zero, Major→Minor, Minor→Healthy, Critical unchanged; never driver strain or chariot repair. |
| Financial restrictions | REQUIRES_ADAPTER | `reducers.js:31–81` authoritatively quotes actions but has no arrears gate. Apply restrictions in authoritative quotes/execution, not just disabled UI, while preserving old receipt replay. Existing prices/discounts remain unchanged. |
| Protected transactions | SOURCE_COMPATIBLE pattern; REQUIRES_ADAPTER dispatch | `protected-registry.js:8–23` strictly dispatches legacy, economic-v2 and maintenance records; `schema3.js:65–72` handles duplicate lookup before dual-revision validation and atomic candidate construction. Extend by a new strict variant, never reinterpret old records. |
| Debt restoration | BLOCKED under existing overlay | `schema3.js:61–63` overlays provenance and unavailable consumed offers, not payroll balances. `career-store.js:100–127` restores older primary/recovery state while retaining identities. A tombstone can prevent a second settlement but leave restored debt absent. Retaining an ID alone cannot meet “no debt erasure on restoring older state.” |
| Emergency driver | REQUIRES_ADAPTER; profile/eligibility gates | `market.js:23–25` has Budget driver native ranges 30–49, condition 70–100 and Healthy/zero strain/fatigue/XP defaults; no emergency template exists. `catalog.js:5` has minimum ordinary duration 3, so a one-cycle/20 G emergency contract cannot use an ordinary term. Respect capacity and assignment legality; no other rescue assets. |
| Stable failure | BLOCKED | `legacy-state.js:56–59` requires `career.status === 'Foundation'`; `schema3.js:57` protects career metadata against arbitrary changes. No failure predicate or terminal transition exists. “No currently legal RU” alone is insufficient: treatment, renewal, repayment, sale or ordinary recruitment may still restore viability. |
| Storage and packaging | SOURCE_COMPATIBLE with capacity risk | `career-store.js:33–47` validates and atomically publishes, rollback/manual fallback; `envelope.js:17–25,69–77` seals bounded envelopes; `scripts/build.mjs:15–24` rejects external dependencies and emits identical aliases. More retained records increase save and validation cost. |

## Critical owner/design gates

1. **Morale target and adapter:** approve which effective statistic(s) -5/-10/-15% modifies, whose arrears status applies (each employee or the whole stable), and when the snapshot is captured. Recommendation: an explicit per-entrant temporary context, default neutral, serialized in race setup/replay, applied consistently at initial and within-race derivation without changing native ratings. This requires a narrowly scoped racing adapter authorization; current crowd morale is not a safe substitute. Until resolved, do not silently ship display-only penalties as implemented gameplay.
2. **Terminal failure:** approve a precise viability predicate, recoverable/preparation state, explicit confirmation/terminal transition and treatment of outstanding claims/history. Recommendation: show an actionable blocked state and all permitted remedies; terminal failure only under an approved testable exhaustion rule. Do not infer permanent failure from zero Gold, debt, expiry, an injury, or an unassembled RU alone. Missing beasts/chariot must never trigger free replacement assets.
3. **Completion authority:** no live producer exists. Approve a narrow immutable completion input from a trusted future championship boundary, with profile/career/championship ID, terminal outcome, roster/contracts snapshot, rule version, earned reward breakdown, and source fingerprint. Reward amounts must come from an authoritative result/rules source, not a free-form UI credit. Diagnostic fixtures can validate the interface but are not playable championship orchestration. Decide how real completions enter M2-D before calling it end-to-end playable.
4. **Debt across restoration:** approve fail-closed restoration when a historical checkpoint lacks already-known settlement/payment/lifecycle facts, unless a complete validated newer checkpoint is available. This avoids inventing recovery transactions, replaying prizes or silently forgiving debt. An alternative full debt projection needs authenticated-in-the-local-integrity-sense source facts and a defined reconciliation policy for later payments/departures; existing availability overlay is not sufficient. No client-only scheme can know later facts absent from every supplied file/storage source.
5. **Default timing and assignments:** clarify whether first departure is at the fourth unpaid settlement (entry into Default) or the fifth (“each subsequent unpaid settlement”). Define whether assigned employees are excluded/deferred with an explicit decision, and whether “last eligible contracted driver” protects a future recoverable but currently ineligible driver. Recommendation: never remove an assigned employee implicitly; display the blocked departure and protect the last presently entry-eligible driver. These are proposals requiring confirmation, not implemented exclusions.
6. **Payroll allocation/renewal details:** confirm current-wage allocation ties after old arrears (propose stable employee ID), when new hires become liable, and treatment of early terminated/expired/departed employees. Old claims always survive. “Renew on M2-C terms” needs a choice of term and whether its signing surcharge applies; no renewal-price API exists today. Confirm clearing arrears removes restrictions immediately while the consecutive-settlement counter resets on the next debt-free settlement, as written.
7. **Emergency profile and trigger:** proposed deterministic profile for review: all five native driver ratings 40 (within existing Budget range), condition 100, Healthy, management fatigue 0, native strain 0, XP 0, available; no hidden bonuses/gear. A fixed personality policy must also be frozen: existing `src/ai/driver.js:16–19` defaults vary by entrant index, so they are not a fixed neutral profile. A proposal is six tendencies at 50, captured only in the native input context with no alteration of existing asset records. Explicitly freeze the approved profile under a versioned catalog, outside market RNG, with zero signing cost and a fixed 20 G wage. Clarify whether one currently active but ineligible driver counts as a shortage, what “normal recruitment blocked” covers (financial/capacity/exhausted offers), and handling at full driver capacity. Do not bypass ordinary capacity or replace/dismiss a driver automatically.

These gates do not dispute the approved possibility of failure or permit a bailout. Driver-only emergency assistance is optional and explicitly requested; it does not guarantee continuation.

## Proposed additive architecture and versions

**Recommendation only; not a migration performed or contract approval.** Preserve old validators/factories and migration manifests exactly. Adding payroll fields directly to current strict schema-3 records would break exact shape and origin replay checks.

| Component | Current | Proposed M2-D extension |
|---|---|---|
| Career / management registry | 3 / 3 | 4 / 4, explicitly previewed/confirmed 3→4 migration |
| Changed employee/contract records | 2 | 3 for lifecycle; unchanged owned records stay 2, assignments stay 1 |
| Obligation/completion/settlement records | absent | separately discriminated record version 1; frozen rules/mapping versions |
| Gameplay commands | legacy/v1, economy v2 | new strict command v3 for M2-D; preserve v1/v2 historical dispatch |
| Migration maintenance | strict 2→3 request/record v1 | new strict 3→4 variant; don't broaden old request semantics |
| Outer envelope / history | 1 / 1 | retain only if additive strict dispatch and mixed-checkpoint tests prove compatible; otherwise stop for explicit version approval |
| Limits | 1000 receipts; 2000 total protected identities; 8 MiB envelope | unchanged; reject before publish, no pruning or silent compaction |

Suggested modules: `career/cycles/{completion,settlement,payroll,contracts,recovery,eligibility,commands,schema4,migration}.js`, with persistence dispatch integration and a separate `ui/stable-cycles.js`. Names are proposals. Keep racing independent of storage. Any approved morale context belongs at the native race-input/derivation boundary, not in the treasury reducer or UI.

Completion record: strict identity, authoritative source/rules fingerprint, immutable outcome/reward inputs and participating contract identity snapshot. Store enough data to reproduce validation; a checksum alone does not make arbitrary supplied prize money authoritative. No six-race controller or invented prize schedule in M2-D.

Obligation record: stable obligation ID, source championship/cycle, immutable creditor ID/name/role snapshot, original assessed integer Gold, paid Gold and balance; sums reconcile against protected payments. Historic creditor snapshots are not live roster foreign keys. Keep live links only when valid; prevent ID reuse. Include contracts for drivers and specialists in payroll, not just the racing driver.

Settlement: pure repeated preview bound to full source fingerprint and both revision clocks; immutable statement; one confirmed atomic gameplay effect keyed by career+championship ID. Credit authorized rewards, allocate oldest existing claims first (cycle order, personnel ID, obligation ID as final deterministic tie), assess/pay current wages, update streak/status, lifecycle and recovery in one staged aggregate. Exact ordering of departure/recovery/expiry needs frozen acceptance fixtures. Voluntary payments and renewal/release are separate protected effects. No payroll or passive recovery at individual race finish or next departure.

Known protected state must survive import and recovery without replaying a historical settlement. New command types need proper protected-result validators and schema-aware overlays: current `state.js:18` filters legacy for schema 2, while schema-3 dispatch cannot understand a future command-v3 entry. Preserve global future facts while projecting only compatible facts into old validators; block unsafe continuation/restore rather than erase debt or fabricate current assets.

Financial policy: block all listed discretionary actions from Delinquent, including XP-funded training (the approved restriction names training, even though M2-C training spends XP). Essential treatment/repair/refurbishment, sales, debt payment and legal termination remain available. Determine classification of driver-recovery/beast-care explicitly in the frozen policy table; they are not named as precisely as medical care. Renewal restrictions start at Critical. UI should show Gold, arrears, status, individual claims and exact blocked reasons; execution remains authoritative.

## Implementation stages and test gates

| Stage | Scope after authorization | Exit gate |
|---|---|---|
| 0 | Owner resolves gates above; freeze failure, morale, completion, renewal and emergency contracts | Written policy/fixture decisions; no inferred prizes or rescue |
| 1 | Add strict schema-4 records, command-v3 and 3→4 maintenance variant; keep original source paths/validators compatible | Original 351 cases; old schemas byte-preserved; mixed history, shared limits, duplicate/tombstone/conflict and failed publication tests before persistent migration |
| 2 | Pure completion validation, deterministic payroll/settlement preview and confirmed atomic effect | A01–A04/A12/A14; source-fingerprint/stale revisions; exact cents-free Gold; repeated preview pure; no per-race/departure charge |
| 3 | Restriction policy, contracts/renewal/expiry, archived creditors, Default departure, emergency driver and recovery | A05/A07–A11; all threshold and assignment/capacity cases; no waived debts or last-driver deletion |
| 4 | Approved morale context and failure transition; minimal existing-panel UI | A06/A10; native ratings unchanged; neutral parity; per-entrant replay/browser parity; explicit terminal presentation/history retention |
| 5 | Full import/recovery/rollback, lifecycle UI, standalone build and owner review | A12/A13; all regression suites; deterministic fixtures/digests; aliases identical; Windows file-origin acceptance separately reported |

## Acceptance-test inventory

- **A01–A02:** repeated previews leave bytes/revisions/RNG untouched; one settlement per championship regardless of transaction ID; exact retry returns retained result or null-receipt tombstone; changed source/reward/payload rejects.
- **A03–A04:** zero reward/Gold, partial/full payroll, multiple driver and specialist claims, deterministic same-cycle ties, safe-integer overflow, oldest claims first, voluntary partial/full repayment, immediate restriction clearing and subsequent debt-free streak reset.
- **A05:** consecutive counts 0/1/2/3/4/5, exact temporary penalties and all blocked/allowed action classes; quote/execution agree; reject UI bypass; current prices/discounts unchanged.
- **A06:** effective morale only after approved adapter; no native attribute/strain mutation; all derivation paths; per-driver isolation; neutral fixture checksums unchanged; replay/browser parity.
- **A07–A08:** wage before term decrement, expiry pending decision, no entry while expired, explicit renewal/release, Critical/Default restrictions, wage claims after termination/expiry/departure; one deterministic departure, ties, protected minimum driver and no dangling assignment.
- **A09:** fixed emergency catalog; explicit request, driver-shortage/recruitment gate, one active, one cycle, exact 20 G next settlement, zero signing payment, no ordinary renewal, protected identity retry/restore, capacity and assignment validation, no additional resources.
- **A10:** missing/ineligible beasts/chariot/driver combinations; distinguish recoverable blockage from approved terminal failure; no automatic assets, no history deletion.
- **A11:** driver management fatigue/beast native fatigue floor at zero, Major→Minor and Minor→Healthy, Critical stays Critical, extinct/departed identities excluded, no strain/integrity/wear repair, no schema-2 changes.
- **A12:** read/write denial, stale bytes, invalid fingerprints/unknown fields/cross-owner IDs, dual revision mismatch, rollback of every partial stage; historical checkpoint with newer protected liabilities cannot clear debt or re-grant prizes/driver; 1000/2000/8 MiB boundaries; no compaction.
- **A13:** M1/M2-A/B/C compatibility, all five migration manifests, 23 fixed market offers and original native valuation/adapters, installed equipment links, retained developer provenance, external JSON round-trip, manual fallback, recovery confirmation, Windows direct-file persistence and identical standalone aliases.
- **A14:** withdrawing/disqualification settles only with authoritative terminal completion; no fabricated prize or reward, no per-race payroll, no extra cycle on departure, no market refresh or new progression.

Tests cannot be claimed for these future behaviors during read-only preflight. Use synthetic authoritative-interface fixtures explicitly labeled as such until a real completion producer is approved.

## Risk register and readiness

| Risk | Severity | Required mitigation |
|---|---|---|
| Old restore removes debts while blocking settlement retry | Critical | Fail closed or owner-approved complete reconciliation; test before production settlement |
| Wrong morale proxy changes everyone or mutates native ratings | High | Explicit approved per-driver effective context and replay coverage |
| False terminal failure or automatic bailout | High | Owner-defined viability/failure contract and explicit UI |
| Departures leave broken assignments or erase wage claims | High | Immutable creditor archives, reference validation, protected driver/assignment policies |
| Free-form completion creates arbitrary Gold | High | Validated authoritative completion boundary, frozen rewards source |
| New schema relaxes historical reconstruction | High | Additive strict versions; retain original validators/requests/results exactly |
| Save/history growth and browser quota | Moderate | Measure worst-case obligations and histories; unchanged limits; explicit manual fallback; no promise of unlimited careers |
| Fixed market can exhaust; emergency doesn't fix missing team/chariot | Intended design constraint | Report blocked/failure path honestly; no refresh, loan or rescue |

**Assessment:** M2-C is a verified usable foundation, and exact arithmetic/transaction/publication patterns are reusable. M2-D is **not ready for unconditional implementation**: morale and terminal failure are explicit handoff gates; completion authority, restoration safety and lifecycle edge policies must be frozen. A narrowly bounded implementation can proceed after those decisions and separate owner authorization. Full championship orchestration remains outside scope. Stop here for owner review.

## Verification evidence

Fresh command results and environment limitations are recorded in [PREFLIGHT_VERIFICATION.md](PREFLIGHT_VERIFICATION.md). Existing reports/evidence were not overwritten. Build/browser outputs were generated in `/tmp/bnt-m2d-preflight/checkout`, an isolated `git archive HEAD` export with the existing development dependencies linked, rather than the accepted checkout. No dependency installation or production build write occurred in `/workspace/BNT`.

Owner-confirmed local Windows M2-C acceptance is recorded as **owner verification**. Managed HTTP functional checks are not independent direct-file verification. Browser download events do not prove durable disk saves. This preflight does not claim owner acceptance of M2-D or universal correctness from regression results.
