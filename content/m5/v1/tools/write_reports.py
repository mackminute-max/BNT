from pathlib import Path
import json,hashlib
O=Path(__file__).resolve().parents[1];P={p.stem:json.loads(p.read_text()) for p in (O/'catalogs').glob('*.json')};V=json.loads((O/'evidence/content-validation-results.json').read_text());ST=json.loads((O/'evidence/statistical-results.json').read_text());N=json.loads((O/'evidence/native-projection-results.json').read_text());EX=json.loads((O/'evidence/supplemental-schema-results.json').read_text())
def write(n,t):(O/n).write_text(t.strip()+'\n')
def table(h,rows):return '| '+' | '.join(h)+' |\n| '+' | '.join('---'for _ in h)+' |\n'+'\n'.join('| '+' | '.join(str(c).replace('|','/')for c in row)+' |'for row in rows)+'\n'
header='**24 November 2026 • Content production only • Accepted M4 gameplay and repository unchanged.** Mechanical numbers are provisional authoring candidates, not accepted balance. No native generation engine, persistence migration or art has been implemented.'
write('reports/CONTENT_PRODUCTION_REPORT.md',f'''# BNT — M5 Content Production Report v1.0

{header}

## Result

Complete initial **content candidate** delivered: **{V['coreRecordCount']} core records across16 schema-compatible catalogs**, plus16 supplemental metadata documents, central canonical mappings and55 reusable visual production briefs. All requested N1–N8/A01–A13/B01–B09 coverage is present. This package is ready for **Codex integration review**, not a claim that M5 is already playable or statistically balanced.

{table(['Core catalog','Records','File'],[[f,len(qs),'catalogs/'+f+'.json']for f,qs in sorted(P.items())])}

Staff content has24 national profession profiles, representing exactly **three native professions** across eight nations, not24 new jobs. Rival content has40 strength-context profiles (eight nations ×five existing championship contexts), not40 fixed teams or a new economy. Native existing template identity and runtime strengths remain unchanged until separately authorized integration.

## Source authority and availability

Reviewed the supplied M5 authorization and all eight requested audit reference deliverables, including strict JSON schemas, illustrative profiles and readiness matrix. Used source-qualified original v1.0 nation/ancestry/beast documents from the supplied AI Database; later-numbered M3 copies were previously byte-compared by the audit. Original bytes are retained centrally under `canon/` for local validation, never embedded wholesale into each generated asset. Current23 authored identity records are copied unchanged into preservation metadata with source SHA256.

No separate precompiled World Identity Catalog was available. `metadata/canonical-reference-mapping.json` supplies a **derived index**, not a new canon revision. The Ancestry Bible mentions a differently named national document ending Updated_2026-11-21; that separate filename is unavailable. The supplied, byte-matching v1.0 nation documents govern this candidate. No contradictory newer source was found or inferred.

Canonical facts and source associations are distinguished from authored names, demographic weights, AI probabilities, stat distributions and economic mixtures. Source references identify file/hash/line ranges. Provisional mechanical sources point to the versioned production utility; authority remains `proposed-mechanics`, not canon. No biological intelligence/aggression stereotypes or unsupported ancestry/species abilities were introduced.

## Content decisions

- All13 ancestries share a broad five-stat driver baseline. Zero-sum ancestry deltas are at most3 points, awareness/nerve ancestry delta0, and all eight backgrounds/all ten AI archetypes remain reachable. Professional experience and quality operate separately from age and ancestry.
- Nine beasts use existing six attributes, explicit zero-sum species tradeoffs and overlapping individual distributions.39 source stock entries preserve exact classifications:7 descriptive Horse styles,3 established Sunhorn lines and29 named v1 catalog bloodlines. No coat adjective becomes a new species.
- Eight temperaments are bounded stat tendencies only. Aggressive animals cannot independently attack; Nervous has no invented nerve field. All native-legal species pair projections remain permitted;45 unordered pair records document visual/harness review without adding physics or bans.
-35 regional cultural profiles use reviewed national phonetics, broad given/family/clan pools, optional nickname components and organization words. Shared national traditions are not ancestry locks. Native Zarashi High Elven identity remains distinct from non-A08 foreign residents/visitors.
- Preserved existing named recruits/stock/products and source-offer pins. Signature identities cannot be cloned under fresh IDs. Common names may recur outside the active relevance scope, with family/clan/stable distinctions.
- Staff supports Beast Handler, Mechanic and Physician only, native service associations and ordinary employment terms. Developing/practiced/veteran expertise descriptions do not scale service discounts or add project throughput.
- Chariot/equipment names reference existing mechanical factories/templates. Material/workshop/model text supplies identity only; neutral equipment stays mass0/combat0. No new starting grants, equipment effects, rewards, fees, market refresh or financial formulas are authored as runtime changes.

## Workflow completed

Pass1 established canonical/stock mapping and regional naming. Pass2 composed provisional driver/AI/beast/quality/staff profiles. Pass3 linked coherent national rival identities/generation and named existing products. Pass4 added anatomy constraints, visual briefs, strict schema checks, cross-reference validation, sampling and native projection diagnostics.

Actual checks: **{V['passedChecks']} core/semantic checks**, **{EX['documentsPassed']} supplemental documents structurally validated**, **39 native projection/personality/repeated100-tick diagnostic checks**; all commands exit0. Detailed raw evidence and limitations are in CONTENT_VALIDATION_REPORT.md. No full-race balance acceptance or historical replay certification is inferred from these diagnostics.

## Delivery boundary

All files are outside `/workspace/BNT`, under `/workspace/deliverables/bnt-m5-content-v1`. Pre-existing M4 source changes/artifact and untracked documentation are preserved byte for byte. No source edits, installs, builds, migrations, saves, branches, commits, pushes or deployment occurred. No image generation was performed. Catalogs contain no runtime network/LLM requirement.

Open integration gates are native metadata/species/personality acquisition, renewable batch authority/retention, difficulty/value calibration and art-manifest adoption. These are stated in CODEX_INTEGRATION.md and TECHNICAL_CONTRACT_NOTES.md, not bypassed by valid JSON. No further content-creation approval is needed for the routine authored values; final numerical balance remains provisional pending testing.
''')
write('reports/CONTENT_VALIDATION_REPORT.md',f'''# BNT — M5 Content Validation Evidence v1.0

{header}

## Commands actually executed

Working directory for tools is immaterial; they resolve paths relative to themselves. Current utilities use `/workspace/BNT` as a read-only source reference. Python3/jsonschema were already installed; no dependencies installed.

{table(['Command','Raw exit','Actual result'],[
['python /workspace/deliverables/bnt-m5-content-v1/tools/produce_catalogs.py',0,'16 core catalogs + source/identity/mechanical metadata written outside repository'],
['python /workspace/deliverables/bnt-m5-content-v1/tools/produce_visual_briefs.py',0,'55 briefs and30 visual profile bindings; no images'],
['python /workspace/deliverables/bnt-m5-content-v1/tools/validate_content.py',0,str(V['passedChecks'])+' checks passed,0 failed; 256 core records'],
['node /workspace/deliverables/bnt-m5-content-v1/tools/native_projection_check.mjs',0,'39 checks passed,0 failed;22 projected assets,10 AI vectors,6 repeated100-tick native fixtures, expected canonical-species rejection'],
['python /workspace/deliverables/bnt-m5-content-v1/tools/package_metadata.py',0,str(EX['documentsPassed'])+' supplemental documents pass structural schema; core/visual reference graph resolved']])}

Raw summaries: `evidence/validation-summary.txt`, `native-summary.txt`; full results: content-validation-results.json, statistical-results.json, native-projection-results.json, supplemental-schema-results.json and supplemental-semantic-results.json. The authoring scripts were run in dependency order, with production data regenerated after expanding staff into national profile variants; final checks cover that final candidate. Reproduce by running produce_catalogs, produce_visual_briefs, validate_content, native_projection_check, package_metadata, write_reports, then finalize_package. Metadata name reservations are a checked deliverable; preserve that file when rerunning generators.

## Structural, source and semantic coverage

Original audit JSON Schema Draft2020-12 is unchanged, copied under schemas/. Each modular array is validated with local `$defs` and the relevant core profile `$ref`, rather than falsely marking a combined root envelope owner-balance-approved. All required fields/types/ranges pass; unknown core fields and out-of-range trait values are rejected in negative checks. No remote schema loading.

Complete native identity coverage8/13/9; unique256 profile IDs; exact39 canonical stock labels/classifications; typed references across all16 families; positive/unique weighted references; distribution order/grid ranges; source SHA256/line ranges; same-species stock references; adult age intervals; supported role/service associations; anatomical constraints; original23 identity records unchanged; all current fallback assets resolve. Supplemental schemas are proposed compile-time metadata shapes, not native save schemas.

Every future visual asset reference resolves to a concrete production brief. Current core profiles deliberately use existing abstract builtin fallback IDs and empty optional actual-art arrays, so this content does not require nonexistent files. These are resolved presentation fallbacks, not unresolved gameplay identities. No generic successful character names are supplied.

## Sampling actually executed

Seed20261124, Python `random.Random`, isolated authoring diagnostics. **This is not the intended native runtime RNG implementation or cross-runtime reproducibility proof.** JSON values and composition are deterministic under the diagnostic harness; native generation must separately pin its own algorithm/draw schedule.

{table(['Workload','Samples'],[['Driver profiles','10,000 per ancestry =130,000'],['Beast profiles','10,000 per species =90,000'],['AI traits','10,000 per archetype =100,000'],['Resident ancestry weights','100,000 per nation =800,000'],['Resident species weights','100,000 per nation =800,000'],['Quality distributions','10,000 driver +10,000 Horse per quality =100,000'],['Visible person names','128 per nation =1,024; every name unique within its national sample']])}

Total2,020,000 numerical selection/profile samples plus1,024 names. Name retries peaked at2, well below32. All ancestry/species paths observed per nation; ancestry frequencies stayed within the declared five-sigma/one-percentage-point diagnostic bound. Structural positive weights do not certify desired player-facing rarity or balance. Cross-national origin/culture behavior is specified in metadata; the sampler did **not** implement a gameplay residency simulator. Beast pair-name themes, organization/product name variety and full curated-name active-scope collision resolution require integration acceptance beyond the person-name smoke sample.

## Native engine probes

22 generated stat vectors (13 driver +9 beast) validate as native RU inputs, derive finite performance and pass individual native acquisition-record factory validation using the existing generic beast projection.10 personality modal vectors validate the native six-key shape. These are isolated objects, not a protected CareerStore batch/acquisition transaction.

Expected negative result: assigning canonical `B01` directly to an owned native beast is rejected by `validateRecord3` with Unsupported species. The test passes by confirming the existing whitelist; it does **not** claim M5 species metadata is already integrated.

{table(['Format','Course','Tick','Checksum','Repeated exact'],[[c['format'],c['kind'],c['tick'],c['checksum'],c['repeatedExact']]for c in N['raceDiagnostics']])}

Each probe uses the unchanged native engine twice with identical8-entrant setup/seed and100 steps. Long Rally uses existing generateRally(category:long). These checks show provisional values can run and repeat for those fixtures. They do not establish complete-race balance, checkpoint parity, historical golden parity, player UI behavior or sustained-career persistence.

## Not executed / not claimed

No full888-test application regression rerun; no browser/Windows testing; no build; no gameplay integration; no long-career retention/market-refresh transaction test; no complete-race win-rate matrix; no historical golden update. These are integration gates, not content-production failures. The earlier audit's76 tests and accepted M4's888 tests are historical separate evidence, not counted here.

Repository preservation is checked by before/after full file hashes (excluding.git/node_modules) and exact porcelain status; unchanged. Provisional formulas, authoritative price/receipt preservation and native species/personality metadata seams remain technical review items. All numerical results must be interpreted with these scope limits.
''')
write('reports/PROVISIONAL_MECHANICAL_BALANCE.md',f'''# BNT — M5 Provisional Mechanical Balance v1.0

{header}

## Status and composition

All numerical tendencies/weights below are **provisional**. Canon supplies identity/anatomy, not these stats. Native five-driver and six-beast keys are unchanged; no physics, AI utility/cadence/error model, RNG, condition mapping, Sign opportunities or economy formula is modified. `metadata/provisional-balance-policy.json` states exact composition, single quality application, context selection and valuation projection.

Shared driver baseline per field: uniform42..68, mean55; one final individual uniform offset−7..7; source-capped0..100. Background adds a zero-sum specialization; developing/practiced/veteran experience contributes −3/0/+3 to all fields with25/60/15 weights, independent of biological age. Ancestry.experienceDelta explicitly0; no duplicate experience application. Quality adds one selected grade, not a second random baseline.

### Modest ancestry deltas

{table(['ID','Ancestry','driving','beastHandling','combat','awareness','nerve'],[[q['canonicalAncestryId'],q['label'],*q['ancestryDelta'].values()]for q in P['ancestryGameplay']])}

Each ancestry delta sums0 and has magnitude≤3, small relative to~9-point sampled per-stat standard deviation and professional/quality differences. Awareness/nerve have no ancestry bias; personality selection has no ancestry term. These small physical/ergonomic starting-point hypotheses are not fixed competence classes or approved biological advantages. Native driverMass remains configured, not the canonical body weight. Each ancestry supports every background and archetype.

### Background tradeoffs

{table(['Background',*['Driving','Handling','Combat','Awareness','Nerve']],[[q['label'],*q['attributeDelta'].values()]for q in P['driverBackground']])}

Specialization is supplied by this distribution plus behavior/context, not a fictional new skill. Raw equal point budgets do not imply equal real performance; native handling/control/combat are nonlinear and require race tests.

### AI centers (each trait has uniform±13, final variation±5)

{table(['Archetype','Aggression','Caution','Patience','Opportunism','Stamina','Discipline'],[[q['label'],*[x['mode']for x in q['traits'].values()]]for q in P['driverAI']])}

Showboat is a risk/opportunity persona with theatrical biography; there is no crowd-seeking utility. Front Runner has no new lead-conditional hook; Patient Pursuer has no new target-memory planner. High tacticalDiscipline affects existing Sign behavior, not general skill. National/background tables multiply selection probabilities and normalize in stable order; no trait is forced by nationality/ancestry.

### Beast baseline centers (uniform±12, final individual variation±7)

{table(['ID','Species','Speed','Power','Agility','Endurance','Discipline','Toughness'],[[q['canonicalSpeciesId'],q['label'],*[x['mode']for x in q['baseline'].values()]]for q in P['beastSpecies']])}

All six-center sums are330. Power-oriented Grun’Jho and low-center Crown Boar trade speed/agility/control tendencies; Meadowstrider/Dire Wolf favor motion at lower pulling/resilience budgets; Sunhorn favors endurance with tradeoffs. These are provisional game profiles, not copied numerical canon. Native summed power, minimum discipline, speed/agility bottleneck and mismatch remain decisive; equal stat sums cannot certify cross-species balance.39 stock modifiers are small zero-sum tradeoffs, not cumulative breed upgrades. Horse styles retain descriptive status. Species body size remains visual metadata, not additional collision mass.

### Temperament deltas

{table(['Temperament','Speed','Power','Agility','Endurance','Discipline','Toughness'],[[q['temperament'],*q['attributeDelta'].values()]for q in P['beastTemperament']])}

These adjectives change only supported statistical tendencies; no creature-controlled tactics, nerve field, infinite stamina, automatic calmness, breath weapon or magical immunity is implied. Age metadata has no decay/bonus effect. Positive partner compatibility is native stat-projection legality only; extreme visual size mismatch remains art layout review.

### Quality and observed ordinary sampling

{table(['Grade','Tier','Stat delta','Q','Personnel wageQ','Base weight','Sample driver mean','Sample Horse mean'],[[q['id'],q['tier'],next(iter(q['driverDelta'].values())),q['valuation']['quality'],q['valuation']['wageQuality'],q['weight'],ST['quality'][q['id']]['driverMean'],ST['quality'][q['id']]['horseMean']]for q in P['qualityRarity']])}

Only exceptional sampled grade hit100, at~0.0418% of pooled driver/Horse attribute values in this fixture; no other sampled grade saturated. Ordinary ancestry/species samples did not saturate. Affordable/ordinary/specialized/rare/exceptional demonstrate escalating input budgets, not final calibrated prices. Specialization also depends on selected background/stock/temperament. No new rarity-driven fee multiplier.

Illustrative same-seed comparison: exceptional Horse stats sum{sum(ST['contrastingExample']['exceptionalHorse'].values())}, affordable Wingless Drake sum{sum(ST['contrastingExample']['affordableDrake'].values())}. This shows possible input-budget superiority of common stock, **not** proof of winning a race or universal raw-stat superiority under every random draw. Full race outcomes remain untested for this comparison.

## Native economics and difficulty

Valuation inputs use existing Budget/Standard/Premium, Q.85–1.15 and personnel wageQuality.9–1.1. Nonpersonnel wageQuality projects to null. Keep native health/conditionFactor, nearest5 half-up pricing, term surcharge, wages, acquisition basis and protected receipts. Profile Q is a provisional within-band input, not permission to change financial formulas. Staff expertise uses only native terms/15-point role discount with existing cap; higher-price staff do not secretly repair better.

Five existing championship contexts reference increasingly strong quality mixtures in `championship-difficulty-bindings.json`; the same coherent team grade should inform member generation without summoning new offscreen finance. No qualification, schedule, fee, scoring, reward or catalog content changes are supplied. Iron Gauntlet is not expanded; its integration mapping requires explicit existing-event handling. Final budget→price/difficulty mapping must be checked by Codex against native quotations and matched races before shipping.

## Required next balancing work

10,000-per-profile diagnostics are complete. Next: at least30 matched seeds/scenario across Pure/Combat Oval/Circuit/Rally and tiers, escalating100+ for close decisions; compare finish/DNF, time distribution, contact/damage, late fatigue, maneuver diagnostics, input agency and cost per performance. Include all13 ancestries,9 species, mixed pairs, ten archetype approximations, eight temperaments, exceptional Horse, M4 Run/Legacy modifiers/caps and Sign compliance. Use pairwise coverage plus explicit extremes, not exhaustive Cartesian explosion.

No universal best ancestry/species, no market domination at one price band, no cap inflation and no knowingly overpriced inert staff should pass final acceptance. Quantitative win-rate/economic thresholds are not approved here. If substantive native mechanics or financial-formula changes are needed, request owner approval rather than silently editing profiles/code to conceal a conflict.
''')
write('reports/TECHNICAL_CONTRACT_NOTES.md',f'''# BNT — M5 Contract and Metadata Notes

{header}

## Unchanged core authoring contract

All16 core record shapes pass the exact original audit `$defs`. Files are modular arrays of version1 records. The version manifest supplies package-level version/status/hash information. No combined root object is falsely marked `owner-approved-candidate`: the original root authority enum cannot accurately distinguish authorized provisional content from final balance approval. Integration can validate each family as done here. Optional future root enum `provisional-content-candidate` is a **metadata-only proposal**, not adopted into the original schema.

No new native save schema, command version, market authority, species enum, reporter token, reward effect or persistence contract was implemented. The package must not be treated as a generic importer or native CareerStore patch.

## Supplemental compile-time metadata contracts

16 documents under metadata/ have proposed shape schemas under `schemas/M5_Supplemental_Metadata_Schemas.json`. Actual strict shape validation passed. They add:

- canonical/source/stock reference ledger, not a new canon;
- regional cultural affinity, explicit residency/origin semantics;
- physical stock variants, without promoting coats to breeds;
- sex-conditional anatomy and source adult/lifespan metadata;
-23 original authored identities and relevance-scoped name reservations;
- paired-beast naming themes, not harness mechanics;
- staff biographical experience, no skills/throughput;
- existing mechanical template/material name bindings;
- authored racing association flavor, explicitly non-governmental/noncanonical institutions;
- provisional composition/valuation/context-selection policy;
- existing championship-context difficulty references;
-55 visual production briefs and future asset/brief bindings;
- typed cross-catalog dependency graph;
-45 native-legal pair projections with art-review flags only.

These are authoring/compilation sidecars, **not saved per-entity catalogs or new native storage records**. Their shape schemas do not substitute for source/anatomy/ownership/balance validation. No extra fields were smuggled into the16 strict profile shapes. Codex must review how selected compact facts project to its authorized M5 identity state; no need to persist all briefs, name pools or canon text.

## Explicit adapter conventions needing integration review

`qualityProfileId` is ordinary fallback; nation/difficulty context selects one quality, applied exactly once. `driverAI` selection combines national and background weights; ancestry is excluded. Staff has24 national variants, each using its explicit national naming default; this avoids an unexplained N1 naming override for all professions. Rival generation has one national primary identity profile; national cultureWeights may select additional regional member origins without rewriting the team's national identity.

`nativeSpeciesAdapter:'generic_draft_beast-with-canonical-identity'` describes a required integration seam, not an already implemented canonical species field. Store canonical Bxx separately through an authorized versioned identity contract; projecting stats into generic native beast is compatible with current RU. Generated driver personality must persist through protected acquisition, not be appended directly to an old record. Current native graph/history validation must remain strict.

Old/current development save compatibility is a policy matter for the future implementation. This package neither migrates nor reinterprets existing records; do not preserve an obsolete generator at unlimited complexity merely to load every development save. Explicitly reject or version unsupported data without mutating accepted M4 saves.

## Questions / blockers for integration, not content completion

1. Native generation/renewal command, protected record version, canonical identity/personality adapter and compact provenance design are still to be implemented under separate authorization.
2. Renewable market refresh cadence/eligibility/cost has not been chosen. Content never selects a new refresh rule or scouting system.
3.1,000 receipts/8MiB career records bound sustained history; the audit's feasibility gate remains. No capacity increase/pruning assumed.
4. Numerical budget→valuation and rival difficulty remain provisional pending full native simulation and economy tests.
5. Reusing rival identity across championships does not define offscreen injury recovery/roster turnover. Maintain within-championship carryover unchanged; do not invent a persistent rival medical economy.
6. Current art-manifest limit64 and proof-only status need separately authorized art integration. All current fallback IDs already resolve; no art dependency blocks nonvisual content review.
7. No separate unified prior WIC or differently named Updated_2026-11-21 source was available. If supplied later, reconcile before changing approved identity labels; no missing numerical canon was guessed as fact.

No significant new gameplay functionality is proposed as required for these catalogs. Routine names/metadata/provisional starting numbers were authored under delegated authority. Final integration and balance approval remain distinct gates.
''')
briefs=json.loads((O/'metadata/visual-asset-production-briefs.json').read_text())['requirements']
write('reports/VISUAL_ASSET_REQUIREMENTS.md',f'''# BNT — M5 Visual Asset Requirements and Production Briefs

{header}

**55 complete nonvisual production briefs** are supplied in [visual-asset-production-briefs.json](../metadata/visual-asset-production-briefs.json). Every brief contains a GPT/image-artist prompt, canonical source references, source/runtime/display dimensions, format, anchor, variants, compositing and acceptance requirements. No image has been created. Future asset IDs are planned references to briefs, not falsely claimed existing files.

{table(['Type','Count','Source','Runtime','Delivery'],[['Ancestry person portraits',13,'1024×1024','256×256; display64/128CSSpx','transparent PNG; shared across generated people with metadata'],['Beast portraits',9,'1024×1024','256×256','transparent PNG; stock-style metadata variants'],['Complete species-based RU illustrations',9,'1024×512','128×64; anchor64,32','true top-down, facing right, two beasts +driver+chariot; livery mask'],['National-style independent team emblems',8,'SVG viewBox512×512','optional raster128×128; minimum24px','original non-governmental logo; sanitized actual SVG'],['Chariot illustrations',8,'1024×512','512×256','transparent PNG existing functional design'],['Equipment product illustrations',8,'512×512','128×128','transparent PNG; neutral existing product, no new weapon/effect']])}

## Asset-by-asset index

{table(['Brief','Planned asset','Category','Canon'],[[b['id'],b['intendedAssetId'],b['category'],b['canonicalId']]for b in briefs])}

## Reuse and constraints

`visualMetadata` uses current registered abstract builtin markers while optional actual-art lists remain empty. That is a valid nonvisual content package with no missing-file dependency; it is not a claim that these images exist. `visual-asset-bindings.json` provides future brief references. It must not automatically activate unavailable art.

Appearance layers: immutable anatomy → source-valid age/body/coat/hair → removable cultural clothing → profession accessory → team palette/livery. `visual-anatomy-rules.json` holds source constraints: female Hill Dwarves never facial hair; female Mountain Dwarves no full beard; Sea Elves subtle gills/webbing; Dragonkin five digits/tail/no wings/no default mammalian breasts; Tortles living shell/plastron/air breathing/partial retraction. Match stock changes through39 source physical variants; do not require39 additional unique portraits.

No nation is an ancestry. Mixed teams can share livery with different anatomy; recolor livery masks, never indiscriminately tint skin/coat. No unique AI image per generated entity, runtime image generation, external image API, network font or external SVG reference.

## Game-ready output QA

A prompt alone cannot guarantee a correct alpha channel, SVG paths, dimensions, anatomy, sprite count or licensing. Inspect actual outputs. Raster requires sRGB RGBA, clean alpha, no text/watermark, safe cropping and exact runtime exports. SVG requires valid viewBox/paths and no scripts/external assets/fonts/foreignObject/filter-heavy effects. An image-only model can provide a raster concept; SVG tracing/export must be separately verified. No false “game-ready SVG” promise from a raster preview.

RU sprites are visual only. Preserve native collision/lane geometry, true overhead viewpoint and anchor/direction. Static first pass is sufficient; additional gait frames require separately approved animation metadata and art integration. Never warp engine geometry to fit an illustration.

## Current renderer limits

`src/presentation/contracts.js` caps manifest assets64 and currently accepts proof status; existing manifest has11 entries. Loading all55 new IDs **in addition** would total66 and exceed the bound. Do not raise it silently. Stage at most53 additional entries while retaining all11, or replace/de-duplicate verified obsolete proof entries during separately authorized art integration. Existing hard-coded proof IDs and fallback references must be audited before replacement. No such change occurs in this content task.

AssetLibrary image cache24/8MiB and composites16/4MiB remain existing limits (`src/presentation/assets.js`). Future portraits should load by active screen/relevance with verified eviction; do not decode every hypothetical character image. All actual bytes embed through the accepted standalone build pipeline. Artist source files and these briefs need not be stored in career saves.
''')
write('reports/CODEX_INTEGRATION.md',f'''# BNT — M5 Codex Integration Instructions v1.0

{header}

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
''')
# Root index deliberately exposes individual files; ZIP download not required.
links='\n'.join(f'- [{f} ({len(qs)} records)](catalogs/{f}.json)'for f,qs in sorted(P.items()))
write('README.md',f'''# Blood and Thunder — M5 Procedural Content Candidate v1.0

Content production is complete for integration review. **No game implementation or final balance approval is claimed.** The repository and accepted M4 artifact remain unchanged. All files are available individually; no ZIP is required.

##16 core catalogs — {V['coreRecordCount']} records

{links}

## Reports

- [Production report](reports/CONTENT_PRODUCTION_REPORT.md)
- [Validation evidence and exact commands](reports/CONTENT_VALIDATION_REPORT.md)
- [Provisional mechanical balance](reports/PROVISIONAL_MECHANICAL_BALANCE.md)
- [Visual asset requirements and prompts](reports/VISUAL_ASSET_REQUIREMENTS.md)
- [Codex integration instructions](reports/CODEX_INTEGRATION.md)
- [Contracts, compatibility and outstanding questions](reports/TECHNICAL_CONTRACT_NOTES.md)

## Manifests and detailed metadata

- [Catalog version and hashes](CATALOG_VERSION_MANIFEST.json)
- [Canonical reference mapping](metadata/canonical-reference-mapping.json)
- [Cross-catalog dependencies](metadata/cross-catalog-dependencies.json)
- [Regional cultural affinities](metadata/regional-cultural-affinities.json)
- [Physical stock variants](metadata/physical-variants.json)
- [Anatomy constraints](metadata/visual-anatomy-rules.json)
- [Original23 identities preserved](metadata/authored-identity-preservation.json)
- [Name reservations](metadata/name-reservations.json)
- [Paired-beast naming](metadata/paired-beast-naming.json)
- [Native pair compatibility metadata](metadata/pair-compatibility.json)
- [Staff backgrounds](metadata/staff-biographies.json)
- [Native template bindings](metadata/mechanical-template-bindings.json)
- [Racing association flavor](metadata/racing-associations.json)
- [Provisional composition policy](metadata/provisional-balance-policy.json)
- [Existing championship strength contexts](metadata/championship-difficulty-bindings.json)
- [55 complete visual production briefs](metadata/visual-asset-production-briefs.json)
- [Visual brief/asset bindings](metadata/visual-asset-bindings.json)
- [Unchanged audit schemas](schemas/M5_Audit_Content_Schemas.json)
- [Proposed supplemental metadata schemas](schemas/M5_Supplemental_Metadata_Schemas.json)

## Evidence

- [Core validation results](evidence/content-validation-results.json)
- [Statistical samples](evidence/statistical-results.json)
- [Native projection and deterministic probes](evidence/native-projection-results.json)
- [Supplemental shape checks](evidence/supplemental-schema-results.json)
- [Supplemental reference checks](evidence/supplemental-semantic-results.json)
- [All deliverable SHA256 values](SHA256SUMS.txt)

Current checks pass: {V['passedChecks']} core checks,16 supplemental documents,39 native diagnostics. Numerical balance and full protected M5 integration remain future gates. No new mechanics, runtime dependencies, images or source commits were produced.
''')
print('Wrote six reports and individual-file delivery index')
