# M4 audit remediation — 0.4.1-m4

This follow-up records changes against the historical [establishment documents audit](ESTABLISHMENT_DOCUMENTS_AUDIT.md). The original audit and evidence have not been rewritten.

| Finding | Current result |
|---|---|
| A01 — Lateral incident bypass | Fixed; visible/hidden incident paths reject and resolve side impacts in both formats; replay and permutation regressions pass. |
| A02 — Seed range hang | Fixed; unsafe endpoints and cumulative overflow reject before expansion; browser remains responsive and live state is preserved. |
| A03 — Sign-compliance reporting | Fixed; actual Conserve after yield/disengage reports Push as Overridden, with the reason recorded. |
| A04 — Actual offline launch | Open; managed browser policy still denies direct local-file navigation. HTTP diagnostic checks pass but do not close T25. |
| A05 — Required fixture catalog | Fixed; all twenty named scenarios have version/seed, normalized setup snapshots and expected invariants; catalog and workflow tests pass. |

See the [M4 update report](../../reports/MILESTONE_4_UPDATE.md) for exact changes, commands, build hash, browser/reference results, replay compatibility and remaining limitations. The updated [standalone HTML](../../dist/Blood_and_Thunder.html) is ready for review; final acceptance remains blocked pending actual direct offline verification.

New evidence is separate from the original audit: [counterexample results](../../reports/m4-update-evidence/audit-probes.json), [114-test regression log](../../reports/m4-update-evidence/tests.log), [browser report](../../reports/m4-update-browser.json), and [reference batches](../../reports/milestone-4-update-reference.json).
