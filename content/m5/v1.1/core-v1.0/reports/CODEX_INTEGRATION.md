# BNT — M5 Codex Integration Instructions v1.0

**24 November 2026 • Content production only • Accepted M4 gameplay and repository unchanged.** Mechanical numbers are provisional authoring candidates, not accepted balance. No native generation engine, persistence migration or art has been implemented.

## Start here

Read the version manifest, CONTENT_PRODUCTION_REPORT.md, CONTENT_VALIDATION_REPORT.md, TECHNICAL_CONTRACT_NOTES.md and PROVISIONAL_MECHANICAL_BALANCE.md. Review the original M5 audit and current repository before coding. This package is **not implementation authorization**; it adds no runtime imports or migrations by itself.

The16 `catalogs/*.json` are actual content arrays matching original `$defs`; sources reference central `canon/` and the production tool. `metadata/` carries authored compile-time relationships, exact canon/anatomy qualifiers and explicit adapter conventions. Do not serialize entire catalogs, briefs, name pools or canonical prose into generated career records.

## Dependency order

1. Load exact schema/catalog versions and verify SHA256 from CATALOG_VERSION_MANIFEST.json. Strictly reject duplicate keys, unknown versions/fields, non-finite numbers and unresolved typed references. Validate source hashes, native canonical IDs, stock parent/classification and anatomy rules.
2. Build indexes for all profiles first: graph cycles such as nation →teamIdentity→culture are nonrecursive lookups. `cross-catalog-dependencies.json` lists record/family edges. No network/schema fetch or runtime LLM.
3. Pin approved generation algorithm/draw schedule, source catalog digest and context. The Python sampler is diagnostics only. Native generator should use independent content RNG substreams; do not consume race RNG for names/market refresh.
4. Generate stable identity plus approved composed native inputs. Keep nation/residence, origin, culture and ancestry separate. Select declared quality once, preserve final name/vector/provenance, enforce native caps and factory validation. Support local weighted pools and imports without exclusive ancestry/persona locks.
5. Produce one coherent rival team identity with named driver/two named beasts/chariot/product references and shared palette/culture. Existing per-instance native entrant/result IDs remain official keys; freeze the display/member map at registration. No rival finances, offscreen roster management, automatic condition reset or invented recovery.
6. Integrate candidates only through newly authorized protected batch/generation command and existing native acquisition/quotes/contracts/capacity. Directly assigning canonical Bxx to current beast.species fails; use the reviewed canonical identity adapter. Persist generated personality through authorized current-record extension, not arbitrary property injection. Keep M4 base/training economics, official condition, rewards and protected receipts intact.
7. Resolve display names across Barn, Market, championship pre-race/results/archive, commentary projection, tactical map, services and financial review using final persisted/frozen identity. Do not rewrite authoritative reporter events or historic financial names. Curated authored identities and current pack pins remain unchanged.
8. Persist an offer batch/epoch before claiming generation accepted. Reopening UI never rerolls it. Rejected/stale/failed transaction never consumes a new generation opportunity. Retention/renewal trigger is a native policy gate, not decided by content tables.
9. Integrate visual metadata without requiring new artwork: current builtin fallback IDs resolve. Future image activation needs licensed actual files, actual manifest validation and64-entry bound planning. Render choices cannot affect simulation or RNG.

## Required implementation gates

- Native generation factory →protected market commit →acquire →RU→frozen registration→official cleared result→reload, with ownership and price basis intact.
- Revision/effect/epoch conflict, duplicate/lost acknowledgment, quota/write failure, malformed content, cold corruption, missing catalog, deterministic bounded naming retries, authored-name collisions and unknown native species mapping must reject safely.
- Verify8/13/9 coverage,39 stock classes,3 supported staff roles,10 persona expressions and both ordinary/import paths. No generic successful entity fallback.
- Full native race/AI/Sign/Pure/Combat and M4 reward/Legacy tests, historical references unchanged, statistical race/cost balance and native price/wage quotes.100-tick authoring probes are not substitutes.
- Measure protected-state/session/backup growth and explicit remaining receipt horizon. Do not prune protected facts, increase bounds or redesign persistence based on this package.
- Build standalone twice, compare exact bytes/dependencies; Windows Chrome/Edge direct-file acceptance follows implementation, not content-only authoring.

## Pending decisions and safe defaults

No new refresh cadence/cost/scouting, rival offscreen recovery or profession skill mechanics is chosen. Existing eligibility/capacity/terms/discounts/condition physics remain native authority. Numerical content is provisional; use controlled balance testing before owner approval. Catalog version1.0 is not a save-schema migration. Previous development-save compatibility can be explicitly scoped, but accepted M4 histories must not be silently rewritten.

File hashes pin the delivered content candidate. If authors edit any data, revalidate references/sources/profiles/sampling, regenerate manifests and issue a new catalog version; never relabel changed bytes as the same approved bundle. No code from tools/ should be imported as the production generator.
