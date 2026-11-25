# Content delivery acceptance

Deliver one ZIP plus individual master manifest and review report. Required files (names may vary if manifest maps them):
- START_HERE.md: Codex integration instructions, dependency versions, load order, explicit not-runtime-imported status.
- competition-catalog-v1.1.json: actual 11-family bundle; optionally modular source files with deterministic assembly, no divergent duplicates.
- schemas/: exact original schema and proposed versioned amendments/sidecar schemas; schema diff and rationale.
- core-amendments/: only necessary v1.0 additions/amendments with stable IDs, original/new hashes, explicit replace/add operations and migration/reference mapping; never overwrite original candidate.
- manifest.json: counts, versions, file hashes, source pins, status, dependencies, consumer mapping, known blockers.
- native-binding-map.json or CSV: each geometry/event/tier/economic/qualification reference to verified native source; distinguish proposed adapters from existing consumers.
- regional-market-profiles.json and policy mapping if needed; strict schema and validation.
- visual-asset-briefs.md or JSON: actual production briefs, reuse and fallback mapping.
- validation/: runnable offline authoring validator, deterministic sample fixtures, logs and machine-readable results; no production code changes.
- REVIEW.md: coverage, decisions, provisional balance, schema gaps, missing inputs, integration blockers and deferred concepts.
- SHA256SUMS.txt: all package files except itself.

## Gates
1. Verify source hashes/ranges, original v1.0 unchanged, actual typed references, unique IDs and names, all 11 families, exactly 16 prestige venues (2 per nation), regional coverage all eight, five strength contexts and special Iron Gauntlet binding. Verify all native signatures retained.
2. Validate JSON Draft2020-12 strict schemas, enum/types/bounds, cross-family and external references, positive finite weights, min<=max, no duplicate weighted refs, geometry/topology/format/distance/grid compatibility, segment resolution and precedence, exact native economic and qualification contexts. No unsupported records in runnable candidate pools.
3. Verify naming capacity and bounded retries; propose at least 128 generated names per nation per usage where feasible, report collision/retry/exhaustion and actual tested sample sizes. Test representative schedules across all five contexts, every nation, all three topology types, fixed prestige seeds, renewable route domains, field composition, local slot reservation, no player scaling, no generic fallback. Use fixed test seeds and stable ordering; repeat samples for equality. Authoring harness is not native RNG parity proof.
4. Validate owner policy fixtures: normal completion, involuntary elimination after participation, zero-participation elimination, withdrawal before start and after several races, failed registration, reload/purchase; no unauthorized renewal; signature vs generated progression; persistent recovery; 6 LP Recruiters. These are content contract tests, not transaction or runtime acceptance.
5. Report actual executed tests and failures, not intended tests. No claims of native simulation, economy, persistence, Windows or full regression acceptance unless actually executed with exact source. Delivery 2 must independently validate native integration, full races, balance, protected settlement and long-career recovery. No unapproved numerical tuning or invented economics.

If required sources unavailable, deliver verified partial records and explicit blocked inventory, never stamp complete. Candidate remains DRAFT_FOR_REVIEW / provisional for technical integration; owner acceptance and Codex production authorization are separate. No production source edits, commits, pushes, deployments or art generation.
