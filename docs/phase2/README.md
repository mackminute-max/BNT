# Blood and Thunder — Phase 2 evaluation

**Complete: 1130 races, no gameplay tuning.** The predefined primary matrix contains 500 Pure/500 Combat races. A separately declared rear-row sign follow-up adds 60 Pure/70 Combat, for **560 Pure/570 Combat**. All 9040 entrants finish; no integrity errors, stalls or bounded/tool failures occur. The standalone application remains byte-identical.

Start with:

- [Simulation analysis](PHASE2_SIMULATION_ANALYSIS.md)
- [Findings and prioritized recommendations](PHASE2_FINDINGS_AND_RECOMMENDATIONS.md)
- [Summary figure](figures/phase2-summary.png)
- [Methodology and controls](PHASE2_EVALUATION_PLAN.md)
- [Immutable baseline manifest](PHASE2_BASELINE_MANIFEST.md)
- [Test/instrumentation/performance report](PHASE2_TEST_AND_INSTRUMENTATION_REPORT.md)
- [Dataset dictionary and reproduction commands](DATA_DICTIONARY.md)
- [Separately declared rear-row follow-up](SUPPLEMENT_REAR_ROW_PLAN.md)

Primary machine-readable data are in [data/](data/); supplemental data in [supplement/](supplement/). Flat race CSVs, compressed full JSONL/event data, normalized configs, seeds/schedules, per-entry data, statistical summaries, logs and genuine replay records support independent inspection.

Key conditional findings: rams are never selected among 2818 Combat contests; Speed wins 74/100 equal-beast-budget archetype races per format, with Endurance competitive in Mud/Heat; Hold Position outperforms sustained Push in this small rear-row panel with less fatigue. None authorizes tuning. No confirmed implementation defect requiring a separate corrective pass was established.

Final verification: **154 tests pass**, **10 parity/reference cases pass**, and **7 representative saved-data reruns match**. Existing audits/corrective records are preserved. No push or publication was performed. Stop here pending owner review of specific recommendations.

[File SHA-256 manifest](FILES.sha256) covers the evaluation reports, datasets, evidence, tools and new tests.
