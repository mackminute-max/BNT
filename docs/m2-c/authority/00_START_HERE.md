# Blood and Thunder — M2-C Codex Handoff, Revision 2.1

**Status: CONSOLIDATED DESIGN HANDOFF — NOT IMPLEMENTATION AUTHORIZATION.**

Revision 2.1 supersedes the earlier M2-C handoff ZIPs. Revision 2.1 adds a targeted fixture correction and protected-history implementation gate without changing the approved design. It incorporates Codex's 2026-11-17 read-only preflight report, corrects a market-tier arithmetic conflict, resolves the seven identified design questions under the owner's advance design approval, and defines additional numeric fixtures. No repository code or tests have been changed by preparation of this package.

## Read in this order
0. `10_REVISION_2_1_ADDENDUM.md` — **new authoritative targeted correction and protected-history first gate**.
1. `06_REVISION_2_DECISION_REGISTER.md` — authoritative corrections, source observations vs selected design contracts, remaining implementation blockers.
2. `01_MASTER_IMPLEMENTATION_SPEC.md` — approved economy rules, amended by Revision 2.
3. `02_SCHEMA_MIGRATION_AND_NATIVE_ADAPTERS.md` — compatibility baseline, amended by Revision 2.
4. `07_DETERMINISTIC_GENERATION_AND_NUMERIC_FIXTURES.md` — concrete generation, calculation and edge-case contract.
5. `03_ACCEPTANCE_MATRIX_AND_TEST_FIXTURES.md` — original mandatory four gates, extended by Revision 2.
6. `04_CODEX_PREFLIGHT_AND_REPORTING.md` — preflight and reporting, plus new read-only follow-up instructions in `08_READ_ONLY_RECHECK_PROMPT.md`.
7. `05_SOURCE_TRACEABILITY.md` — initial provenance; `09_PREFLIGHT_REPORT_EXCERPT.md` — Codex's source-verified findings and limitations.

## Precedence
Owner-approved M2-C-01..36 remain controlling. The Revision 2.1 addendum `10` and corrected fixture `07`, followed by the specific Revision 2 reconciliations in `06` and `07`, supersede contradictory or underspecified language in earlier handoff files. Existing M2-B source behavior and protected history must remain intact; never silently edit old versions to accommodate new semantics. A verified source incompatibility is a **blocking report**, not permission to improvise.

## Authorization boundary
The owner's advance approval was **design approval only**. Codex may perform a **read-only second preflight** when asked. Codex must **not implement, modify source, migrate data, commit, or open a PR** until a new explicit owner instruction authorizes M2-C implementation. All four acceptance gates remain non-waivable.
