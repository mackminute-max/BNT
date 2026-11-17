# Blood and Thunder — M2-D Production Authorization Handoff (Revision 1)

Date: 2026-11-17. Project: `mackminute-max/BNT`. Owner approved confirmed career failure (policy A), routine technical preflight resolutions, and requested this revised implementation-authorization handoff.

## Read order
1. `00_START_HERE.md` (this document)
2. `01_APPROVED_RULES.md`
3. `02_SCHEMA_AND_TRANSACTIONS.md`
4. `03_INTEGRATION_AND_IMPLEMENTATION.md`
5. `04_ACCEPTANCE_MATRIX.md`
6. `05_SOURCE_PREFLIGHT_RESOLUTION.md`
7. Repository `docs/m2-d/M2_D_PREFLIGHT_REPORT.md` and `PREFLIGHT_VERIFICATION.md`, M2-C implementation report, M2-C schema/API, M2-C Revision 2.1 authority, M2-B native contract and historical API.

## Authority and scope
This is an owner-approved **implementation authorization handoff**, not evidence that implementation has started or passed. The owner has approved M2-D design and directed preparation of an implementation authorization. Codex may begin M2-D production **after** verifying the exact accepted M2-C source and the gates below. Use a dedicated feature branch; do not merge, push, deploy, or claim owner acceptance without separate permission. Preserve existing source, historical evidence and accepted behavior. Do not overwrite prior reports.

Expected source: accepted `main` HEAD `f66ec90a6659dd6bb675815bff4cc33e9850a643`, tree `4173d9427b2c79d03ddd5ebd00bc0cb4b8c445f9`, same files as accepted M2-C `79447d84a73f4d95eb65974cc79c59d191b111e7`. Fresh preflight: 351 Node tests passed, 86 browser functional groups via documented HTTP diagnostics, 12/12 historical replay captures matched, two standalone HTML aliases each 380462 bytes SHA-256 `13b2b1e3898c5df30f5b97b9b37c2bb033fc01c5ae9f43fd64bd89a3fc3e938f`. These are BASELINE results, not M2-D test results. Recheck source before modifying.

## Hard scope boundaries
- No championship controller, championship schedule, reward schedule, race-result application or fabricated prize grants. Implement a strict future-completion boundary plus test-only fixtures. Do not make arbitrary completion/reward input available as a production UI action.
- No emergency beasts, chariots, specialists, gear, loans, Gold grants or automatic bailout. Failure is intended gameplay.
- No changes to M1/M2-A/M2-B/M2-C historical records/validators, existing native asset ratings, racing physics or old replay checksums. An additive, explicitly versioned payroll-control adapter is authorized.
- No automatic contract renewal or silently deleting assigned personnel.
- No hidden payroll charges per race, per departure, per day, or facility upkeep.
- Retain 1000 receipt / 2000 protected-identity / 8 MiB envelope limits; no silent pruning.

## Delivery
Implement in reviewable stages with a dedicated branch and commit(s), test evidence, source/API documentation, versioned fixture catalog, risk/limitation report, and identical offline HTML aliases. Stop and ask owner if a hard scope boundary or unresolved source conflict would require changing the approved gameplay contract. Owner will independently perform Windows `file://` acceptance; managed browser policy blocks direct-file navigation.
