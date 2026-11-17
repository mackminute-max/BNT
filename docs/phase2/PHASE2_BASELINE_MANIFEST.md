# Phase 2 immutable baseline manifest

The evaluated engine is **0.4.2-corrective**. HEAD is `2ce102181a33028c9497d3e365b389a48218226c`, but the working tree already contained the corrective pass. HEAD alone is not the evaluation revision. No baseline reference was replaced after instrumentation.

| Item | Recorded baseline |
|---|---|
| Source archive | [baseline/source.tar.gz](baseline/source.tar.gz), including untracked corrective source/tests, scripts, original docs, current implementation docs and standalone build |
| Archive SHA-256 | `39dc576fb195d82a96fba7a033abd62f3bd6b2fad8b7f5360d0a85a5b3556ffa` |
| File-level snapshot | [baseline/files.sha256](baseline/files.sha256); manifest SHA-256 `ab87a2726da267f2e4da683ef43e122bc9a0048db75d04334a8750f6fac56718` |
| Dirty-tree evidence | [Git status](baseline/git-status.txt), [working-tree patch](baseline/working-tree.patch). The patch alone omits untracked files; use the archive. |
| Simulation/package | 0.4.2-corrective / 0.4.2 |
| Complete defaults | [default-configuration.json](baseline/default-configuration.json): normalized setup, all coefficients, RU roster/positions, weather, surfaces and initial checksum |
| Original tests | 144 passed, 0 failed, 0 skipped; [log](baseline/tests-before.log) |
| Standalone artifact | 163,579 bytes, `dist/Blood_and_Thunder.html` |
| Artifact SHA-256 | `30cea713001b2e1dfdc0b818605161ba5951d15a44e4b87b2210493451354002` |

## References captured before instrumentation

| Format / intervention | Default cadence | Authoritative checksum | Event SHA-256 |
| --- | --- | --- | --- |
| Pure-none | 100 | c232f54d | `ea4dabf2822c8a4d793a31f8ccf100f4f2798999756bcc629691647570c304e9` |
| Pure-Push the Pace | 100 | 89be7a18 | `e5733f8d6a0208532e1866d380bfe711d300bb4041e4b500e4b2623b181b1de8` |
| Combat-none | 100 | 4890b9c4 | `f94adafff1b92e61c80f5c534d0231192066d178704fb9aa95eed37e995c8ca8` |
| Combat-Push the Pace | 100 | 11d74892 | `8c58c74c7e0935d14476a89f2546cc96b2df4dd88a34b04da5cd81cbaebf9681` |


Compressed full replay records for all four cases are in baseline/. Reference results/conditions are in [references.json](baseline/references.json).

## Diagnostic cadence variant, also captured before instrumentation

The 1000-race study uses checkpointInterval=10000 solely to avoid repeatedly hashing the entire event history. This does not change default runtime settings. The before-instrumentation variant has **exactly identical event SHA-256, RNG progression and physical outcomes** to the default-cadence case in each format. Whole-state checksums differ because the cadence itself is part of authoritative state; this metadata difference is explicit rather than hidden.

| Format | Cadence | Variant checksum | Default-cadence event/RNG parity |
| --- | --- | --- | --- |
| Pure | 10000 | 245466a9 | true |
| Combat | 10000 | 89931df4 | true |


[study-references.json](baseline/study-references.json) retains full setups. Final instrumentation verifies the original four default-cadence references, both study references, and four additional scheduled-sign/environment cases, including the supplemental rear-row context. See [instrumentation-parity.json](evidence/instrumentation-parity.json). No simulation source, configuration default, existing test, approved document or standalone byte changes as part of Phase 2.

This task did not perform a new direct offline browser verification. The preexisting owner/managed-browser evidence is preserved in the corrective report; Phase 2 does not extend or reinterpret it. The rebuilt file remains byte-identical and independent of all evaluation tooling.
