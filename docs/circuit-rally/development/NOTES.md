# Development notes

Historical audits/investigations are unchanged. The first four-preset probe found a normalization defect: string presets were cloned but bypassed surface default expansion. Corrected by resolving the preset then applying the same complete validator/normalizer as custom definitions; no coefficient changed. The next probe and focused suite passed.

The first 80-race smoke campaign finished all races without integrity/stall/tool failures. During integration review, Rally was found to inherit combat's closed-lap final-lap estimate. Corrected by passing the known final-checkpoint phase to the existing pure utility estimator, leaving its scoring/physical coefficients and all oval/circuit logic intact. Added an exact Rally lap-setting-invariance regression and reran the 80 races on final code. Initial smoke results are retained here for transparency and excluded from the final 80-race totals. Only final replay files under evidence are current-version evidence; previous working drafts are not release baselines.

The pre-change retained suite passed178 tests; the first implementation retained all178; focused course geometry/topology/sign tests passed14, then20 after edge-case coverage. The final suite includes the subsequent lap-invariance regression. A development test log from before the final Rally context correction is retained separately.
