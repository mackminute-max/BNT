# BNT M2-E Readiness Update v1.0

## Updated verdict: CONDITIONALLY READY

All 58 specification policies and approved D1–D5 can be preserved in the proposed architecture. The five prior material compatibility choices are resolved **in design**, not implemented. No new unresolved material player-facing contradiction was identified. Implementation remains unauthorized, formal M2-D acceptance is not established, and durable resume/finalization must pass early proof gates.

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

## Conflict accounting

- Prior compatibility choices examined: **5** (D1–D5).
- Resolved by approved design: **5**.
- Newly unresolved material policy conflicts identified: **0**.
- Source fixes performed by this task: **0**.

Technical prerequisites are not counted as policy contradictions. No new owner decision is needed for routine schema/API names, provisional coefficients, storage architecture or concrete catalog fixtures. The owner must still accept/pin M2-D and explicitly authorize implementation. Merge/push/deployment remain separate gates.

## Reassessment of prior blockers against current source

| Issue | Current evidence | Updated disposition |
|---|---|---|
| M2-D source available | Local feature branch/HEAD and cycle modules present | Verified locally; formal acceptance/main integration not established; remote refresh failed503 |
| Sign activation ambiguity | `ai/signs.js:10–45`, `sim/race.js:436–441,472,900–905` | D1 resolved; existing format semantics reusable; controller/checkpoint preservation missing |
| Integrated care ambiguity | `economy/reducers.js:57–68,95–118`; `cycles/reducers.js:23,41` | D2 resolved; versioned native/management adapter and recovery-position integration still required |
| Coaching authority | `ai/driver.js:121–149` | D3 resolved; optional player-only scoring context absent |
| Shared-place awards | `sim/race.js:362–380` | Existing official competition places reusable; D4 defines new controller awards, not yet implemented |
| Clearance snapshot timing | `sim/race.js:855–875` | D5 resolved; atomic clearance/result/condition boundary missing; Stalled is not cleared |
| Aggregate/migration | Strict current schema4, current career/history validators | New explicit schema/command paths required; never inject unknown fields into old saves |
| Durable completion | `cycles/completion.js:4–19` | Trusted WeakSet capability is process-local; durable authoritative registry + revalidation required |
| Completion identity/retries | `cycles/reducers.js:9–10,26–48` | Existing per-instance settlement effect/statement safeguards reusable; outer aggregate/claims binding needed |
| Full contract roster | `cycles/completion.js:5`; reducer`:29,33–41` | All active home-stable contracts required; not just racing driver |
| Mid-race serialization | `sim/race.js:300–360`; `sim/incidents.js:30` | Capture/replay is not a full checkpoint; plain JSON loses Infinity; new codec/restore proof required |
| RNG/event state | `core/determinism.js:1–15`; incidents scheduler and race live state | Seed/draw cursor plus scheduler/AI/contact state must restore; no reinitialization or extra draws |
| Input/sign ordering | `sim/race.js:606–668,1092–1101` | Existing command ordering reusable; durable acknowledged journal and watermark absent |
| DNF order | `sim/race.js:382–400` | Progress then ID does not provide all required first-reach tie evidence; opt-in versioned telemetry adapter needed |
| Locked field/schedule | Existing commitEntrant/native setup and payroll adapter | Useful commitment primitives; persistent championship instance/controller missing |
| Gold/XP/RP/trophies | Existing cycle rewards are Gold-only; no championship aggregate | New entitlements/registry and atomic wrapper required; no second Gold authority |
| Catalog | Spec defines six identities, not source implementation | Five standard templates and playable Iron Gauntlet need concrete valid fixtures; illustrative numbers remain provisional |
| Zero/one starters | Native single entrant can simulate; empty-field championship meaning not established by a generic engine run | Explicit controller no-starter result and genuine single-starter tests required; never award automatic win for DNF |

## Verification performed and evidence limits

### Executed during this reconciliation

- Read-only local branch/HEAD/status/source inspection and document review.
- `node --test tests/m2-d-maintenance.test.js tests/m2-d-transactions.test.js tests/m2-d-racing.test.js`: **58 passed, 0 failed, 0 skipped**, approximately35.36s. This includes M2-D neutral-context replay behavior, payroll isolation, transactions and maintenance safeguards; it is not the complete project suite.
- In-memory native-state diagnostic: a created race's `nextIncidentAt` was **Infinity**, while ordinary JSON serialization/restoration produced **null**. No save or source file was written. This confirms a codec hazard, not an implemented checkpoint feature. Configuration-specific future divergence is documented in the prior audit; this task does not substitute an immediate digest match for future-state parity.
- Synthetic in-memory classification diagnostic: four manually finished entrants at full-precision times10,11,11,12 yielded places **1,2,2,4**. Remaining nonfinishers retained null places. This demonstrates the existing official ranking function, **not** a completed physical race or implemented reward distribution.
- `git ls-remote origin refs/heads/main refs/heads/feat/m2-d-payroll-lifecycle`: failed with upstream HTTP503. Remote source/acceptance status is unverified, not inferred from local tracking refs.

### Not executed or claimed

No full project Node run, browser suite, production build, new resume implementation, migration, treatment adapter, coaching integration, championship or direct-file browser test was performed. Historical audit/delivery totals are historical evidence, not newly passed tests. The original audit's full-suite/browser evidence must be re-established at implementation E0. Passing the focused suite does not establish universal correctness or M2-E acceptance.

Existing standalone artifacts were preserved. Owner-confirmed earlier Windows offline operation is historical owner evidence only; this reconciliation did not independently verify direct-file operation or a new build. No runtime dependencies were introduced.

## Remaining technical gates and priorities

1. **Pin accepted M2-D:** formal owner acceptance and exact source state before integration. Local source is accessible; remote refresh and merge status are not verified.
2. **Prove durable resume:** complete typed codec including non-finite sentinels, immutable snapshots, RNG/scheduler/AI state, acknowledged journal ordering and atomic checkpoint authority. Test crash windows, corruption and manual mode without grid restart/reroll.
3. **Prove D5 finalization:** same-state clearance/result/condition proof and one atomic result/standings/consequence commit; blocked states must preserve recovery and forbid awards/advance/settlement.
4. **Implement versioned D2 mapping:** explicit migration/provenance, configurable source-backed thresholds, paid treatment/repair effects and recovery before departure eligibility. No new irreversible death/destruction rule.
5. **Establish durable completion authority:** registry-backed capability rehydration after reload, complete active-contract roster, scoped rewards, exactly-once M2-D settlement and non-Gold awards in one proven publication boundary.
6. **Finish orchestration/content and release gates:** fixed entrants, DNF first-reach telemetry, one/zero starters, scoring/shared placements, withdrawal, six content templates, full Node/browser/standalone acceptance.

Technical risks include quota/8MiB sizing, synchronous-store versus asynchronous storage coordination, receipt/protected-identity limits, accidental legacy hash changes, stale checkpoint rewind, and confusing permanent wreck obstacles with failed clearance. Each has explicit tests and fail-closed behavior in the plan. None authorizes relaxing an approved policy.

## Recommended next owner gate

Review these planning deliverables, establish formal M2-D acceptance/exact integration baseline, then explicitly authorize gated M2-E work beginning with E0, minimal E1 and the early E4 resume/clearance proof. Continue full E2–E6 only after those technical gates pass. This recommendation is not permission to merge M2-D or implement M2-E now.

No further significant owner design choice is currently requested. If proof work later requires a new gameplay rule rather than a compatible technical extension, return the exact source conflict and options before changing behavior.

## Deliverables and stop condition

- [Specification reconciliation](BNT_M2-E_Specification_Reconciliation_v1.0.md): all63 decisions, D1–D5 source/interfaces/risks, condition proposal and conflict register.
- [Implementation plan](BNT_M2-E_Implementation_Plan_v1.0.md): E0–E6, proof-first ordering, schemas/interfaces, acceptance/rollback gates and16 addendum acceptance cases.
- This readiness update: verified baseline, evidence limits, unresolved technical gates and authorization boundary.

Planning is complete. No implementation, source/test/schema change, migration, branch, commit, merge, push or deployment was performed.
