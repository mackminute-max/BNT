# M2-D — Source Integration and Build Stages

## Verified source observations from Codex preflight (HEAD f66ec90a)
- `src/reporting/results.js` exports single-race results; no championship completion or prize producer. `src/ui/app.js` creates standalone races; `economy/schema3.js` expects no pending race.
- `economy/arithmetic.js` provides exact nonnegative Gold; `economy/catalog.js`, `records.js` contain wage and term definitions. No existing arrears or payroll ledger.
- `registries.js` currently requires live references for obligations, `economy/validation.js` rejects unsupported obligation records; employee termination removes live records. Need archived creditor identities.
- Existing contract validation fixes `cyclesRemaining` to original duration, and existing contract IDs cannot be reused. Need versioned lifecycle/renewal records.
- Existing crowd-derived control is not payroll morale; do not hijack it. Add per-entrant effective-control context at native derivation boundary, and serialize for deterministic replay.
- Current `career.status` validator requires `Foundation`, so add versioned terminal lifecycle rather than changing old schemas.
- `economy/protected-registry.js` strict variant dispatch and `career-store.js` atomic publication/recovery can be extended, but debt history needs fail-closed restore.

## Staged implementation gates
0. Verify accepted M2-C HEAD/tree, run fresh baseline; read local `docs/m2-d/` preflight report and compare this authority. If different source or incompatibility, STOP and report.
1. Implement additive schema 4 and explicit 3->4 maintenance migration. First run focused old/new mixed-history, duplicate, tombstone, stale revision, failed-publication and recovery tests **before enabling persistent migration**. All 351 original tests must remain green.
2. Implement strict completion boundary and pure settlement preview, exact accounting, atomic confirmation and permanent statement. Fixtures are explicitly synthetic and do not become UI-accessible reward actions.
3. Implement debt restrictions in quotes/reducers, contract expiry/renewal/release, immutable creditor archives, deferred default departures, emergency driver, passive recovery and state validation.
4. Add per-entrant control adapter, neutral replay parity, status snapshot, race/replay serialization, and explicit Blocked/FailurePending/Failed career lifecycle with confirmation.
5. Implement minimal UI: settlement preview/confirm when trusted completion exists, financial statement, arrears breakdown, debt status/restrictions, renewal/release, emergency driver request, blocked reasons and failure confirmation. Preserve existing M2-C tools and developer workbench.
6. Full tests, 12 historical replay comparisons, browser diagnostic suites, offline standalone aliases, source/API docs and review report. Windows `file://` acceptance remains owner-side and must not be claimed from managed Chromium HTTP fallback.

## Implementation safeguards
Use clean dedicated branch, no push/merge without owner approval. Never alter old accepted replay vectors or migration manifests to make tests pass. New fixtures may be added with independently computed expected amounts, IDs, debt streaks, and digests. Use test-only injection of completion authority; ensure production cannot call it as an arbitrary Gold grant. Keep versioned rule constants configurable but deterministic. For reachability/failure evaluation, prefer conservative Blocked status to any unproven terminal condition. Report any limitation rather than silently expanding rescue scope.

## Deliverables
- `docs/m2-d/M2_D_IMPLEMENTATION_REPORT.md` with exact commit, changes, test counts, outstanding limitations and owner Windows acceptance instructions.
- `docs/m2-d/SCHEMA_AND_TRANSACTION_API.md` with concrete command shapes, lifecycle and recovery contracts.
- Fixed versioned fixtures, tests and replay evidence isolated under `docs/m2-d/evidence/implementation/`.
- Built `dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html` with identical bytes and SHA-256.
- Explicit statement that M2-D is ready for owner review only, not merged/pushed/accepted.
