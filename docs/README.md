# Blood and Thunder project documentation

## Phase 2 — simulation evaluation and balance analysis

The [evaluation package](phase2/README.md) records 1,130 races: the planned 500 Pure/500 Combat runs plus a separately declared rear-row sign panel of 60 Pure/70 Combat runs. No Phase 2 gameplay tuning was applied.

- [Simulation analysis and charts](phase2/PHASE2_SIMULATION_ANALYSIS.md)
- [Findings and prioritized recommendations](phase2/PHASE2_FINDINGS_AND_RECOMMENDATIONS.md)
- [Methodology and experimental allocation](phase2/PHASE2_EVALUATION_PLAN.md)
- [Immutable baseline manifest](phase2/PHASE2_BASELINE_MANIFEST.md)
- [Dataset dictionary and reproduction instructions](phase2/DATA_DICTIONARY.md)
- [Tests, instrumentation and limitations](phase2/PHASE2_TEST_AND_INSTRUMENTATION_REPORT.md)
- [Results datasets](phase2/data/) and [supplemental results](phase2/supplement/)
- [Summary figure](phase2/figures/phase2-summary.png)

## Corrective pass and historical audits

- [v0.4.2 corrective-pass report](audits/CORRECTIVE_PASS_0_4_2.md)
- [Original establishment-document audit](audits/ESTABLISHMENT_DOCUMENTS_AUDIT.md)
- [M4 update audit](audits/M4_UPDATE_AUDIT.md)

The ten numbered establishment documents remain at the project root. Historical audit records and baseline manifests retain the revisions and verification scope applicable when they were written. Recommendations require owner review before gameplay tuning.

## Phase 2.1 — Dangerous Racing investigation

The investigation, raw datasets, deterministic replay evidence and recommendations are in [phase2/dangerous-racing](phase2/dangerous-racing/README.md). Start with [full-race results](phase2/dangerous-racing/DANGEROUS_RACING_RESULTS.md) and [recommendations](phase2/dangerous-racing/DANGEROUS_RACING_RECOMMENDATIONS.md). This evaluation changes no gameplay or standalone application bytes.
