> **Revision 2:** Read `06_REVISION_2_DECISION_REGISTER.md` and `07_DETERMINISTIC_GENERATION_AND_NUMERIC_FIXTURES.md` first. Their explicit reconciliations supersede any conflicting older language in this document. No implementation authorization.

# Source Traceability and Known Limitations

## Sources directly inspected for this handoff
These files were present in the current conversation's mounted workspace and read directly:
- `SCHEMA_AND_TRANSACTION_API (1).md` — M2-B schema 2, registry 2, command v1, typed record v1, protected history v1, transport v1, discovery key, common command fields, native adapter, receipt/history limits.
- `M2_B_NATIVE_ATTRIBUTE_CONTRACT_INSPECTION.md` — native rating field names/bounds, condition/strain/fatigue/wear, chariot weight/capacity, absent native integrity, neutral equipment aggregate and derived model constraints.
- `M2_B_IMPLEMENTATION_REPORT.md` — implemented M2-B packages, transaction behavior, modules, reported tests and replay parity (historical implementation report, not fresh test execution).
- `Blood_and_Thunder_M2-B_Starting_Package_Catalog_Draft_3.md` — package Gold/rosters/native ratings/capacities, descriptive facilities and neutral equipment; its historic pending approval language is superseded by later final authorization and M2-B implementation/owner acceptance.

Additional files exist in the workspace (including `Blood_and_Thunder_M2-B_FINAL_CODEX_AUTHORIZATION.md`), but this package is **not** a fresh audit of all repo code. The live repository was not mounted as source code and no current test suite was executed. Codex must recheck the actual checkout before any implementation.

## Approved design provenance
M2-C-01..20: market, offers, personnel, contracts, wages, recovery, facilities, pricing, training/engineering, native allowlists, atomicity, starting valuation and health adapter policy.
M2-C-21: four non-waivable acceptance gates.
M2-C-22: exact idempotent retries and protected history.
M2-C-23: extend M2-B command envelope.
M2-C-24: owner-confirmed previewable atomic migration.
M2-C-25: selective schema versions.
M2-C-26: dual revisions plus canonical source fingerprint.
M2-C-27..36: owner advance-approved remaining design package: fixed market tier distribution, generator, migration, command/receipt compatibility, economic calculations, strict adapters, race compatibility and acceptance.

## Explicit technical uncertainties, not silently resolved
- Valuation-health H per asset type and chariot integrity/condition/wear relationship.
- Whether management chariot integrity repairs alter any native condition (not assumed).
- Whether native beast fatigue and management beast fatigue are stored as one value in the current implementation; inspect before changing.
- Exact new-record shape, version dispatch and M2-C command effect identity construction.
- Deterministic grandfathered wage-quality default and rounding tie policy where earlier owner decisions specify bounds but not every edge.
- Whether installed starting equipment labels correspond to actual item records; no phantom itemization.
- Any conflict between existing source validators and approved economic changes.

The design specifies safe behavior and fail-closed boundaries. It does not falsely assert these implementation dependencies have been verified.

## Revision 2 additional source
`09_PREFLIGHT_REPORT_EXCERPT.md` is the Codex 2026-11-17 read-only report supplied by the owner, with source path/line claims and 293 passing tests **as reported by Codex**. The local repository was not re-inspected or retested in creating Revision 2. R2-01..R2-08 are explicit design selections in response to that report, not source-verified implementations.
