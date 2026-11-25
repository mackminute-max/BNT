# BNT — M5 Content Validation Evidence v1.0

**24 November 2026 • Content production only • Accepted M4 gameplay and repository unchanged.** Mechanical numbers are provisional authoring candidates, not accepted balance. No native generation engine, persistence migration or art has been implemented.

## Commands actually executed

Working directory for tools is immaterial; they resolve paths relative to themselves. Current utilities use `/workspace/BNT` as a read-only source reference. Python3/jsonschema were already installed; no dependencies installed.

| Command | Raw exit | Actual result |
| --- | --- | --- |
| python /workspace/deliverables/bnt-m5-content-v1/tools/produce_catalogs.py | 0 | 16 core catalogs + source/identity/mechanical metadata written outside repository |
| python /workspace/deliverables/bnt-m5-content-v1/tools/produce_visual_briefs.py | 0 | 55 briefs and30 visual profile bindings; no images |
| python /workspace/deliverables/bnt-m5-content-v1/tools/validate_content.py | 0 | 6564 checks passed,0 failed; 256 core records |
| node /workspace/deliverables/bnt-m5-content-v1/tools/native_projection_check.mjs | 0 | 39 checks passed,0 failed;22 projected assets,10 AI vectors,6 repeated100-tick native fixtures, expected canonical-species rejection |
| python /workspace/deliverables/bnt-m5-content-v1/tools/package_metadata.py | 0 | 16 supplemental documents pass structural schema; core/visual reference graph resolved |


Raw summaries: `evidence/validation-summary.txt`, `native-summary.txt`; full results: content-validation-results.json, statistical-results.json, native-projection-results.json, supplemental-schema-results.json and supplemental-semantic-results.json. The authoring scripts were run in dependency order, with production data regenerated after expanding staff into national profile variants; final checks cover that final candidate. Reproduce by running produce_catalogs, produce_visual_briefs, validate_content, native_projection_check, package_metadata, write_reports, then finalize_package. Metadata name reservations are a checked deliverable; preserve that file when rerunning generators.

## Structural, source and semantic coverage

Original audit JSON Schema Draft2020-12 is unchanged, copied under schemas/. Each modular array is validated with local `$defs` and the relevant core profile `$ref`, rather than falsely marking a combined root envelope owner-balance-approved. All required fields/types/ranges pass; unknown core fields and out-of-range trait values are rejected in negative checks. No remote schema loading.

Complete native identity coverage8/13/9; unique256 profile IDs; exact39 canonical stock labels/classifications; typed references across all16 families; positive/unique weighted references; distribution order/grid ranges; source SHA256/line ranges; same-species stock references; adult age intervals; supported role/service associations; anatomical constraints; original23 identity records unchanged; all current fallback assets resolve. Supplemental schemas are proposed compile-time metadata shapes, not native save schemas.

Every future visual asset reference resolves to a concrete production brief. Current core profiles deliberately use existing abstract builtin fallback IDs and empty optional actual-art arrays, so this content does not require nonexistent files. These are resolved presentation fallbacks, not unresolved gameplay identities. No generic successful character names are supplied.

## Sampling actually executed

Seed20261124, Python `random.Random`, isolated authoring diagnostics. **This is not the intended native runtime RNG implementation or cross-runtime reproducibility proof.** JSON values and composition are deterministic under the diagnostic harness; native generation must separately pin its own algorithm/draw schedule.

| Workload | Samples |
| --- | --- |
| Driver profiles | 10,000 per ancestry =130,000 |
| Beast profiles | 10,000 per species =90,000 |
| AI traits | 10,000 per archetype =100,000 |
| Resident ancestry weights | 100,000 per nation =800,000 |
| Resident species weights | 100,000 per nation =800,000 |
| Quality distributions | 10,000 driver +10,000 Horse per quality =100,000 |
| Visible person names | 128 per nation =1,024; every name unique within its national sample |


Total2,020,000 numerical selection/profile samples plus1,024 names. Name retries peaked at2, well below32. All ancestry/species paths observed per nation; ancestry frequencies stayed within the declared five-sigma/one-percentage-point diagnostic bound. Structural positive weights do not certify desired player-facing rarity or balance. Cross-national origin/culture behavior is specified in metadata; the sampler did **not** implement a gameplay residency simulator. Beast pair-name themes, organization/product name variety and full curated-name active-scope collision resolution require integration acceptance beyond the person-name smoke sample.

## Native engine probes

22 generated stat vectors (13 driver +9 beast) validate as native RU inputs, derive finite performance and pass individual native acquisition-record factory validation using the existing generic beast projection.10 personality modal vectors validate the native six-key shape. These are isolated objects, not a protected CareerStore batch/acquisition transaction.

Expected negative result: assigning canonical `B01` directly to an owned native beast is rejected by `validateRecord3` with Unsupported species. The test passes by confirming the existing whitelist; it does **not** claim M5 species metadata is already integrated.

| Format | Course | Tick | Checksum | Repeated exact |
| --- | --- | --- | --- | --- |
| Pure | Oval | 100 | 8e6e6c7f | True |
| Pure | Circuit | 100 | a6d3ce8c | True |
| Pure | Rally | 100 | 711ae1cc | True |
| Combat | Oval | 100 | bebaa120 | True |
| Combat | Circuit | 100 | 7b6a1e2b | True |
| Combat | Rally | 100 | e360a469 | True |


Each probe uses the unchanged native engine twice with identical8-entrant setup/seed and100 steps. Long Rally uses existing generateRally(category:long). These checks show provisional values can run and repeat for those fixtures. They do not establish complete-race balance, checkpoint parity, historical golden parity, player UI behavior or sustained-career persistence.

## Not executed / not claimed

No full888-test application regression rerun; no browser/Windows testing; no build; no gameplay integration; no long-career retention/market-refresh transaction test; no complete-race win-rate matrix; no historical golden update. These are integration gates, not content-production failures. The earlier audit's76 tests and accepted M4's888 tests are historical separate evidence, not counted here.

Repository preservation is checked by before/after full file hashes (excluding.git/node_modules) and exact porcelain status; unchanged. Provisional formulas, authoritative price/receipt preservation and native species/personality metadata seams remain technical review items. All numerical results must be interpreted with these scope limits.
