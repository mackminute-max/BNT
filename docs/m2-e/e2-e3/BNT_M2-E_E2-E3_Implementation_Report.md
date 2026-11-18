# BNT M2-E E2/E3 Implementation Report

Date: 2026-11-18. Status: bounded implementation; D2 approval hold. **Not complete E2/E3 acceptance.** No merge, push, release or deployment.

## Baseline and scope

Repository: mackminute-max/BNT. Local branch: `feat/m2-e-e2-e3`. Accepted foundation code: `5870d18c5fb6455767e918ad0df9e1e64cbecb2e`; development base: documentation-only `b742937d6b2411f3129ad3f5ee215c7cccc859e1`. Its source, tests and built artifacts matched the accepted implementation. Accepted M2-D ancestor: `06fd511170148caf744abf57449c4cc5d6c4e2c5`. Main/origin main inspected at `f66ec90a6659dd6bb675815bff4cc33e9850a643`; not used as the development base. Remote references were fetched; existing untracked pre-implementation audit was preserved and excluded from the implementation commit.

Authority reviewed: all 58 policies, D1–D5, reconciliation/plan/readiness, accepted foundation reports and applicable M2-D contracts. Owner's later clarification explicitly withholds authorization for proposed D2 numbers while authorizing independent E2/E3 work.

Implementation commit: 770d994a5c61dc0d3cf37a74d170fe654374e63b. Documentation commit is reported separately at delivery; a document cannot contain its own Git hash without changing that hash.

## Modules and interfaces

| Module | Responsibility |
|---|---|
| `src/career/championships/offers.js` | Versioned validated templates, canonical frozen offers, qualification expressions, bounded authorized catalog refresh |
| `controller-contracts.js` | Command v4 exact shape, revisions, protected operation/effect identities, strict protected history |
| `controller.js` | Explicit aggregate upgrade, atomic registration, locks, coaching, manual start, birth binding, staged clearance and confirmed voluntary withdrawal; reconstruction-based validation |
| `anchor.js` | Validated frozen financial/asset anchor across zero-Gold operational controller transitions |
| `orchestrator.js` | Native simulator/session orchestration, durable race birth, journaled advance/Sign commands, proof staging, coordinated Web Locks |
| `clearance-transfer.js` | Runtime-branded durable session-to-career birth/clearance capabilities |
| `scoring.js` | Pure authoritative classification/competition-ranking points, pending identity, standings and title eligibility helpers; not career-committed while D2 is blocked |
| `api.js` | Curated browser controller API |
| `src/ai/coaching.js` | Bounded optional player coaching utility, conflict masks for all six Signs |
| `src/ui/championships.js` | Minimal development panel, offers, registration, locked roster, native race canvas, manual controls, coaching, Sign controls, evidence/blocked status and read-only stable inspection |
| `src/sim/deterministic-log.js` | Versioned deterministic evaluation of the existing exponential incident-clock logarithm for opted-in championship races only |

Existing changes: schema5/state/history dispatch; additive M2-D candidate execution export; management quote/reducer guards; envelope command dispatch; optional race/checkpoint/proof metadata; AI optional coaching term; developer panel integration and schema5-compatible existing management panels. The existing esbuild pipeline emits both standalone HTML aliases. New regression file: `tests/m2-e-e2-e3.test.js`. Diagnostic scripts: E2/E3 browser, legacy clock reproducer, championship clock parity and size/timing measurement under `scripts/m2-e/`.

## E2 registration and persistence

Career schema remains **5**. Explicit controller enable upgrades the foundation aggregate from v1 to **v2**, retaining the complete validated origin. Rules: `m2e-controller-v1`; controller commands v4 coexist with historical v1/v2/v3 commands. Existing migration paths and native records remain intact. No automatic upgrade, grant, injury conversion or financial normalization.

Registration validates qualification, assets/contracts, ordered composition, capacities and every scheduled native setup before one career publish debits the disclosed fee and freezes the offer, schedule, player selection, installed equipment identities, payroll context and deterministic rivals. Repeats deduplicate; conflicting IDs, stale revisions and persistence failures reject. Known protected registration cannot be erased through an older imported checkpoint. Supported history/import limits remain 1,000 receipts, 2,000 protected identities and 8 MiB import.

The sole default board entry is a clearly labeled **Development Championship Fixture**, not the E6 catalog: 25 Gold, four entrants, two events (Pure Oval; Combat C01), one lap each, points 10/8/6/5, default DNF points zero. Definitions support 1–12 races and 1–8 entrants with existing tracks/weather. Catalog refresh requires a trusted capability and cannot mutate an active frozen offer. Arbitrary client-supplied cheaper offers are rejected. No production catalog authority or E6 content was added.

All mutation commands and quotes are rejected during active/unsettled championships; read-only stable inspection/export remains available. Full settlement/unlocking is deferred, so this is a **test career workflow**: do not register a valuable career expecting to finish its championship in this build.

## E3 native race orchestration

Lifecycle delivered: `INTERMISSION_READY → RACE_START_PENDING → RACE_ACTIVE`; clearance proof staging enters `RECOVERY_REQUIRED` with explicit D2 explanation. Confirmed initial voluntary withdrawal enters `AI_CONTINUATION`, with no refund and no player in the subsequent native field. Manual start is mandatory. Seed and grid are frozen by instance/event identity; established missing sessions cannot silently restart.

Birth coordination writes a valid initial RaceSession before binding the career reference. Retry can reuse that exact initial authority. The controller uses the existing career writer lock plus race lock; low-level methods require a single writer. Browser actions use the corresponding locks. Racing requires automatic durable storage; manual mode is explicitly unsupported for durable championship orchestration.

Clearance uses the accepted native finalization interface. The session commits its proof first; only then can a runtime-branded transfer stage an **uncommitted candidate** in CareerStore. The financial anchor detects career/asset changes but permits zero-financial controller revisions. This is **not** a claim of atomic publication of permanent consequences across two stores. Until approved D2 mapping is available, no official result, standings, eligibility, entitlement or condition is career-committed and the next race remains blocked. Fault tests verify rollback and safe retry of this staging boundary.

## D1–D5 compatibility

- **D1:** Existing native Sign implementation retained: starting signal, start/finish and Rally checkpoint activation; native usage, paused order and diagnostics. No competing Sign system.
- **D2:** Not implemented. See [source-backed compatibility analysis](BNT_M2-E_D2_Compatibility_Analysis.md). Driver management fatigue differs from native strain; beast fatigue, chariot wear, native condition and management integrity remain separate. Proposed condition bands/1:1 conversion/treatment/repair mappings require explicit owner approval, including continuous-value boundaries and pre-existing mismatches. No automatic intermission recovery.
- **D3:** Player-only bounded four-axis utility context; axes −1..1, weights 0..2 (central provisional defaults 0.5). No attribute bonuses, personality overwrite, rival context, cadence or RNG change. Coaching freezes in setup and checkpoints. Conflicting coaching channels are masked by active Signs. Absent context preserves legacy behavior.
- **D4:** Pure tested helpers preserve full-precision native shared places and full points, tied-first win credit, separate title eligibility and pending identity derivation. Native Retired maps to DNF; authoritative first-reached progress disambiguates equal progress. These helpers do not award Gold or commit standings in this build. Production DQ/no-starter orchestration is not claimed.
- **D5:** Only a cleared native proof can be staged. Stalled/uncleared sessions cannot publish official consequences. Permanent consequences remain blocked; repeat stages do not duplicate them. A session-level clearance failure currently retains outer `RACE_ACTIVE` with a UI explanation rather than committing an outer blocked transition; full recovery-state integration remains incomplete.

## Determinism correction and compatibility

A reproducible **accepted-baseline** Node/Chromium discrepancy was found at seed 1460515178: native `Math.log` produced next-incident time 313.0384349330031 versus 313.03843493300315, with initial checksums f9ba1205 versus b00ad2d3. This is retained as evidence, not hidden by rounding or changed checksum expectations.

New championship setups explicitly freeze `clockVersion: m2e-exponential-clock-v1`. The same exponential clock formula and incident-rate coefficient use deterministic power-of-two range reduction and a logarithm series. No incident-rate, collision, damage, fatigue or physics coefficients change. Legacy context-absent races retain native Math.log and historical outputs. New championship/coaching checkpoints use behavior `m2e-race-state-v2`; old checkpoints remain v1 and mismatched labels reject. Numeric constants are mathematical evaluation constants, not balance tuning. This narrow opt-in correction addresses the E2/E3 replay gate; legacy cross-runtime clock limitations remain disclosed.

## Delivered versus deferred

E2 independent registration/locking is functional. E3 first-event native setup, coaching, execution, proof staging and initial withdrawal continuation are functional. **Multi-event advancement, committed condition/standings, forced withdrawal, end-to-end AI-only remaining schedule, validated zero-starter controller outcome, repeat-entry after settlement and terminal pending-settlement orchestration are not delivered.** These must not be inferred from pure helper coverage.

Excluded: full E4 automatic scheduling/recovery UI, E5 completion authority/Gold/XP/reputation/trophies/settlement, E6 catalog/Iron Gauntlet/polish, D2 numeric rules, new permanent injuries/equipment durability, unrelated legacy browser maintenance. Existing M2-D reducers and trust boundary are preserved.

## Local testing instructions

Open `dist/Blood_and_Thunder.html` on Windows in a modern browser. Use a backed-up **test career**, Developer → Career State / Save Management → Championship Controller; explicitly migrate/enable if offered, inspect the development fee/schedule and register. Set coaching, manually start, queue native Signs and advance. Staging the cleared proof must show the D2 hold and prevent further progression. Do not expect final rewards or settlement. Export backups before testing. Browser downloads are not claimed durably saved.

Managed direct-file access is administrator-blocked; HTTP fallback tests are separately labeled. Owner Windows acceptance of the previous foundation is not acceptance of this new artifact. See the test evidence and next-gate report for counts, checksums and limitations.
