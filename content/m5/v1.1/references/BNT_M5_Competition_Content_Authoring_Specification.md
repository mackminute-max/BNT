# BNT M5 — Competition Content Authoring Specification

**M5 competition readiness audit • 24 November 2026 • Investigation/design only.** Accepted M4 source/artifact and M5 Content Candidate v1.0 unchanged. EXISTING denotes verified code; PROPOSED denotes unimplemented contracts. Examples are explicitly UNAPPROVED.

## Production scope

Author static/versioned competition catalogs against the proposed Draft2020-12 schema.11 families consolidate the requested logical list: geometry, environment(surface+weather), naming(venue/event/championship), venue(prestige+renewable), event, tier binding, championship(permanent/generated/prestige/special), rivals, locals, presentation and renewal. Do not create a new runtime engine/save schema from these records.

Target16 authored prestige venues,2 per N1–N8, plus regional generated venue profiles; all use existing3 ovals/12 circuits or existing rally generator. No complete production venue/championship catalog was created by this audit. Supplied21 records are small relationship examples, all `UNAPPROVED_EXAMPLE` and root `UNAPPROVED_EXAMPLES`.

## Existing catalogs and references

M5 Content Candidate v1.0 remains unchanged:16 catalogs/256 records,35 cultural profiles,30 visual profiles and40 rival birth recipes. Its canonical index maps N1–N8/A01–A13/B01–B09 and39 stock styles/lines. Original canon v1.0 files are centrally available in candidate/canon; original nation prose governs architecture/location associations, not numerical track bonuses. Missing separate prior World Identity Catalog/differently named Updated_2026-11-21 source remains disclosed; no replacement canon invented. The current source catalog, not a prose proposed venue name, decides what geometry exists.

External references: existing `culture.nX.rY`, `visual.nX`, `rival.nX.context` and `difficulty.context`; native qualification/fee/awards binding `native.context` resolves actual accepted e5 catalog. Region IDs are existing cultural-affinity keys, not falsely asserted native geographic IDs. Prestige names/concepts from nation prose may be explicitly provisional; cite them rather than promote them to established tracks silently.

## Shared contract

Profile id lowercase namespaced ASCII≤64, distinct from native instance IDs (native IDs disallow dots). Every record has version1, approval UNAPPROVED_EXAMPLE/DRAFT_FOR_REVIEW/APPROVED, label≤100 and1..8 sources. Source fields authority canon/native-contract/audit-proposal, file≤250, SHA25664hex, positive start/end lines. Actual file digest/range, source authority and approved canon associations must validate. Root declares format, catalogVersion, approval and records. All fields required unless noted; unknown keys reject. Optional null explicitly means inapplicable, never random hidden fallback.

Weights positive finite≤1e6, typed unique refs; no automatic demographic exclusion from missing profile. Use declared stable ordering/versioned domains. Naming pools must be nonempty, pronounceable, source-compatible, max100 characters; bounded retries≤64 and no generic fallback. Profiles describe factories; successful generated venue/event/championship gets a proper persisted name distinct from internal ID/template label.

### Native constraints authors must respect

- Geometry: preset IDs in inventory; four-lane Circuit/Rally, geometry-specific valid widths/corner radii; M5 contract conservatively permits width1..4, current controller only propagates laps, so nondefault width needs the proposed resolved-event adapter. Preset resolver has rallyOptions=null; generated resolver requires valid category/options and corresponding generated-* selection token. That token is **not** directly accepted as a native course string: call generateRally then pass resolved definition.
- Surface/environment: dirt/stone/gravel/sand/mud; Clear/Rain/Heavy Rain/Mud/Dust/Wind/Extreme Heat exact strings. Assignment selectors all/straights/corners/segment are compiler instructions, not native fields. Explicit segment must resolve; segmentId null for other selectors. Reject overlap/ambiguous assignments unless precedence is specified; recommended all base then disjoint scoped overrides, no order-dependent surprise. Native preset coefficient table governs values; no invented snow/ice/gusts.
- Rally seed/options/generator version and terrain weight order pin reproducibility. Prestige pinned seed retains resolved static course; renewable venue uses independent generation domain. Fixed route can host different weather/race RNG seeds. Category Sign Points are an existing explicit wrapper, not default native3 checkpoints; compile chosen policy once, never rewrite old courses.
- Event: Pure/Combat independent from topology; grid random/standings/reverse, laps1..100 for closed, exactly1 for new point-to-point. All candidate venue topologies must match distanceMode and supportedFormats. Native field count1..8/races1..12 are upper capabilities; economic binding must explicitly authorize selected values.
- Tier: use native five contexts; Iron Gauntlet remains an existing special exception, not a new progression tier. qualificationBinding/feeAndAwardBinding must match approved native catalog, field/race counts and Completion Bonus tier. Custom Gold/purse formula fields are forbidden. Generated named-trophy/victory credit cannot be left undecided in a production build.
- Rival population:3..5 per tier planning range; 2..3 per field planning target; actual selection leaves player/local slots where possible. Final birth attributes/personality/config never scale to player. Cross-champ condition policy must be approved, not silently selected from examples.
- Renewal: committed epochs; no page-open/reload/time RNG; purchase never automatically replaces a listing. Full Home and limited regional policy contexts distinct; regional permanent staff disabled for initial M5. Exact counts/triggers are configurable content, with zero-start withdrawal disposition requiring review. No roster substitution through purchases.

## Required / optional field reference

### geometry

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| kind | required | ['Oval', 'Circuit', 'Rally'] | local $defs /semantic checks |
| resolver | required | ['native-preset', 'rally-generator-v1'] | local $defs /semantic checks |
| nativeId | required | ['short-oval', 'oval', 'grand-oval', 'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'C11', 'C12', 'technical-circuit', 'fast-circuit', 'mixed-rally', 'technical-rally', 'generated-short', 'generated-medium', 'generated-long'] | local $defs /semantic checks |
| laneCount | required | 4 | local $defs /semantic checks |
| laneWidth | required | number | minimum=1, maximum=4 |
| rallyOptions | required | nullable/compound | local $defs /semantic checks |
| checkpointPolicy | required | ['native-three-v1', 'category-sign-points-v1'] | local $defs /semantic checks |
| freezeResolvedCourse | required | True | local $defs /semantic checks |

Example: `records.geometry[0]` in illustrative bundle. No example is approved production content.

### environment

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| assignments | required | array | minItems=1, maxItems=128 |
| weatherWeights | required | array | minItems=1, maxItems=5 |
| customPhysics | required | False | local $defs /semantic checks |
| terrainWeightOrder | required | ['dirt', 'stone', 'gravel', 'sand', 'mud'] | local $defs /semantic checks |

Example: `records.environment[0]` in illustrative bundle. No example is approved production content.

### naming

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| usage | required | ['venue', 'event', 'championship'] | local $defs /semantic checks |
| nationIds | required | array | minItems=1, maxItems=8 |
| culturalNamingProfileId | required | #/$defs/id | local $defs /semantic checks |
| roots | required | array | minItems=2, maxItems=512 |
| endings | required | array | minItems=2, maxItems=128 |
| grammar | required | ['place-ending', 'root-ending'] | local $defs /semantic checks |
| maxLength | required | integer | minimum=8, maximum=100 |
| maxRetries | required | integer | minimum=1, maximum=64 |
| genericFallback | required | False | local $defs /semantic checks |

Example: `records.naming[0]` in illustrative bundle. No example is approved production content.

### presentation

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| worldVisualProfileId | required | #/$defs/id | local $defs /semantic checks |
| style | required | dark-deco-retro-cartoon-v1 | local $defs /semantic checks |
| architectureTags | required | array | minItems=1, maxItems=20 |
| environmentTags | required | array | minItems=1, maxItems=20 |
| palette | required | array | minItems=2, maxItems=4 |
| motifs | required | array | minItems=1, maxItems=16 |
| assetRefs | required | array | minItems=1, maxItems=16 |
| uniqueArtRequired | required | False | local $defs /semantic checks |
| futureBrief | required | nullable/compound | local $defs /semantic checks |

Example: `records.presentation[0]` in illustrative bundle. No example is approved production content.

### venue

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| permanence | required | ['prestige', 'renewable-profile'] | local $defs /semantic checks |
| properName | required | nullable/compound | local $defs /semantic checks |
| nationId | required | ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8'] | local $defs /semantic checks |
| regionId | required | #/$defs/id | local $defs /semantic checks |
| geometryWeights | required | array | minItems=1, maxItems=128 |
| environmentId | required | #/$defs/id | local $defs /semantic checks |
| namingProfileId | required | #/$defs/id | local $defs /semantic checks |
| presentationId | required | #/$defs/id | local $defs /semantic checks |
| supportedFormats | required | array | minItems=1, maxItems=2 |
| seedPolicy | required | ['pinned', 'generation-domain'] | local $defs /semantic checks |
| pinnedSeed | required | nullable/compound | local $defs /semantic checks |
| description | required | string | maxLength=1200 |
| signatureTraits | required | array | minItems=1, maxItems=12 |

Example: `records.venue[0]` in illustrative bundle. No example is approved production content.

### event

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| venueWeights | required | array | minItems=1, maxItems=128 |
| namingProfileId | required | #/$defs/id | local $defs /semantic checks |
| format | required | ['Pure', 'Combat'] | local $defs /semantic checks |
| distanceMode | required | ['laps', 'point-to-point'] | local $defs /semantic checks |
| laps | required | object | local $defs /semantic checks |
| grid | required | ['random', 'standings', 'reverse'] | local $defs /semantic checks |
| eligibleContexts | required | array | minItems=1, maxItems=5 |
| rulesBinding | required | native-race-v1 | local $defs /semantic checks |
| rewardsFromChampionshipBinding | required | True | local $defs /semantic checks |

Example: `records.event[0]` in illustrative bundle. No example is approved production content.

### tier

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| contextId | required | ['dustroad', 'ironwheel', 'bannerfall', 'crownfire', 'thunder-crown'] | local $defs /semantic checks |
| nativeCatalogId | required | ['dustroad', 'ironwheel', 'bannerfall', 'crownfire', 'thunder-crown', 'iron-gauntlet'] | local $defs /semantic checks |
| qualificationBinding | required | ['native.dustroad', 'native.ironwheel', 'native.bannerfall', 'native.crownfire', 'native.thunder-crown', 'native.iron-gauntlet'] | local $defs /semantic checks |
| feeAndAwardBinding | required | ['native.dustroad', 'native.ironwheel', 'native.bannerfall', 'native.crownfire', 'native.thunder-crown', 'native.iron-gauntlet'] | local $defs /semantic checks |
| completionBonusTier | required | integer | minimum=1, maximum=5 |
| fieldSize | required | integer | minimum=1, maximum=8 |
| raceCount | required | integer | minimum=1, maximum=12 |
| generatedTrophyPolicy | required | ['named-only', 'context-shared', 'REQUIRES_OWNER_DISPOSITION'] | local $defs /semantic checks |
| strengthReference | required | #/$defs/id | local $defs /semantic checks |
| adaptiveScaling | required | False | local $defs /semantic checks |

Example: `records.tier[0]` in illustrative bundle. No example is approved production content.

### locals

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| contextId | required | ['dustroad', 'ironwheel', 'bannerfall', 'crownfire', 'thunder-crown'] | local $defs /semantic checks |
| nationWeights | required | array | minItems=1, maxItems=8 |
| existingRivalProfileWeights | required | array | minItems=1, maxItems=128 |
| importProbability | required | number | minimum=1e-06, maximum=1 |
| frozenForChampionship | required | True | local $defs /semantic checks |
| persistAsActiveAfterArchive | required | False | local $defs /semantic checks |
| historicalNamesRetained | required | True | local $defs /semantic checks |

Example: `records.locals[0]` in illustrative bundle. No example is approved production content.

### rivals

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| contextId | required | ['dustroad', 'ironwheel', 'bannerfall', 'crownfire', 'thunder-crown'] | local $defs /semantic checks |
| populationMin | required | integer | minimum=3, maximum=5 |
| populationMax | required | integer | minimum=3, maximum=5 |
| participantsMin | required | integer | minimum=0, maximum=3 |
| participantsMax | required | integer | minimum=0, maximum=3 |
| reserveLocalSlots | required | integer | minimum=0, maximum=7 |
| lazyBirth | required | True | local $defs /semantic checks |
| fixedAttributesAndPersonality | required | True | local $defs /semantic checks |
| birthProfileWeights | required | array | minItems=1, maxItems=128 |
| localProfileId | required | #/$defs/id | local $defs /semantic checks |
| betweenChampionshipCondition | required | ['fresh-native-baseline', 'carry-current-condition', 'REQUIRES_OWNER_DISPOSITION'] | local $defs /semantic checks |
| offscreenSimulation | required | False | local $defs /semantic checks |

Example: `records.rivals[0]` in illustrative bundle. No example is approved production content.

### renewal

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| resource | required | ['championship-opportunities', 'home-market', 'regional-market'] | local $defs /semantic checks |
| trigger | required | ['career-initialized-and-terminal-archived', 'official-intermission-after-run-choice'] | local $defs /semantic checks |
| count | required | object | local $defs /semantic checks |
| requiresCompletedFrozenSchedule | required | boolean | local $defs /semantic checks |
| zeroStartWithdrawalPolicy | required | ['retain-existing-batch', 'renew-after-terminal', 'REQUIRES_OWNER_DISPOSITION'] | local $defs /semantic checks |
| allowPageOpenRenewal | required | False | local $defs /semantic checks |
| replacementOnPurchase | required | False | local $defs /semantic checks |
| regionalPermanentStaff | required | False | local $defs /semantic checks |
| postGenerationCommitRequired | required | True | local $defs /semantic checks |
| registeredRUChangeAllowed | required | False | local $defs /semantic checks |

Example: `records.renewal[0]` in illustrative bundle. No example is approved production content.

### championship

| Field | Presence | Type/ref/exact enum | Bounds |
| --- | --- | --- | --- |
| id | required | #/$defs/id | local $defs /semantic checks |
| version | required | 1 | local $defs /semantic checks |
| approval | required | ['UNAPPROVED_EXAMPLE', 'DRAFT_FOR_REVIEW', 'APPROVED'] | local $defs /semantic checks |
| label | required | string | maxLength=100 |
| sources | required | array | minItems=1, maxItems=8 |
| category | required | ['permanent', 'generated', 'prestige', 'single-event-special'] | local $defs /semantic checks |
| properName | required | nullable/compound | local $defs /semantic checks |
| namingProfileId | required | #/$defs/id | local $defs /semantic checks |
| tierBindingId | required | #/$defs/id | local $defs /semantic checks |
| geographicScope | required | ['regional', 'national', 'international'] | local $defs /semantic checks |
| nationIds | required | array | minItems=1, maxItems=8 |
| regionIds | required | array | minItems=1, maxItems=35 |
| eventWeights | required | array | minItems=1, maxItems=128 |
| raceCount | required | object | local $defs /semantic checks |
| scheduleOrder | required | ['native-context-pattern', 'authored-order', 'seeded-weighted'] | local $defs /semantic checks |
| venueRepeatLimit | required | integer | minimum=1, maximum=12 |
| prestigeMin | required | integer | minimum=0, maximum=12 |
| maxAttempts | required | integer | minimum=1, maximum=64 |
| rivalPopulationPolicyId | required | #/$defs/id | local $defs /semantic checks |
| renewalPolicyId | required | #/$defs/id | local $defs /semantic checks |
| presentationId | required | #/$defs/id | local $defs /semantic checks |
| travelMechanics | required | False | local $defs /semantic checks |

Example: `records.championship[0]` in illustrative bundle. No example is approved production content.

## Typed dependencies and semantic validation

Build indexes before resolving references; reject duplicate IDs/JSON keys/nonfinite numbers and unknown versions. geometry nativeId/kind/resolver must agree with source catalog. environment references only native coefficients/weather and actual segment IDs after resolve. naming usage must match venue/event/championship consumer; culture belongs to intended nation/region without ancestry lock. venue nationality/region/environment/geometry/presentation must resolve. events reference compatible venues and native contexts. championships reference supported events/tier/rival/renewal/presentation, geographic scope and source-compatible regions. Local and persistent birth weights reference the unchanged M5 recipes of the correct context; permanent attributes are sampled once, not every race.

Compiler must additionally enforce ordered ranges, unique weights, group field capacity, scalar checks, corridor/grid validity, prestige count≤races, repetition limits, event format order, field+points/purses vector sizes, exact fee/qualification/tier mapping, no new unapproved unlocks, supported asset IDs and production approval status. These semantics are not guaranteed by JSON Schema alone. Example validation covers source/reference/type relationships, native context equality and topology, plus six invalid-input cases; it is not a complete future production compiler.

Production rejects REQUIRES_OWNER_DISPOSITION or unapproved examples. Missing expected content stops batch preparation without fees/epoch changes; it must not reroll repeatedly or substitute Generated Arena. Statically compile catalogs and source digests into single HTML; no network/schema fetch or runtime LLM.

## Proposed authoring order and outputs

1. Geometry references and environment patterns from inventory; native mechanics unchanged.
2. Venue/event/championship naming by all8 nations/35 regions; existing cultural pools can supply components, but supplier/team words are not automatically venue nouns.
3.16 prestige venues and regional renewable venue profiles; select authored proper names/geometry/weather/surface distinctions without bespoke physics.
4. Context bindings and schedule profiles after trophy/short-event economic decisions; preserve permanent signatures. National/regional baseline, higher-tier international variety as proposed weighted content policy, not mandatory travel/unlock mechanics.
5. Hybrid tier population/local competitor and renewal policies, tied to M5-A epochs and explicit intermission acquisition scope.
6. Presentation/brief metadata and compiler/statistical/native test fixture packs.

Content production can start now for identities, naming, geometry/surfaces, prestige concepts and provisional profiles. Mark unresolved gameplay-policy fields draft until owner dispositions. No blocker requires inventing absent native mechanics. Files should be separate versioned catalogs plus manifest/source/dependency reports, not a native-save dump.

## Visual metadata and briefs

Reuse `worldVisualProfileId` and existing architecture asset refs. Dark Deco silhouettes, reusable national materials/palettes, venue/environment framing and championship emblem parameters are sufficient before final art. No unique image for every generated venue/event/team. Any futureBrief must include id, SVG/PNG format, source≤8192px/runtime≤2048px dimensions, complete prompt and required licensing; art validation/source transparency/anchor/layer must follow accepted presentation contract. No image generated here.

Current manifest64 entries, existing11; AssetLibrary image24 entries/8MiB and composites16/4MiB. Do not combine55 candidate future art IDs +11 current into66 silently; stage/replace verified proof entries under separate art integration authorization. The competition metadata examples use existing proof architecture assets, with no new actual image dependency.

## Versioning / candidate amendment

Publish supplemental competition schema/catalog version separately. If changing M5 candidate metadata (fixed-tier lifecycle, regional Market context, difficulty/economic bindings), issue v1.1 with new hashes and explicit supersession; retain original v1.0 bytes. Most16 core profile shapes remain reusable, not a reason to rebuild world/personnel catalogs. New runtime/save contracts require implementation authorization and native regression; JSON validation is not implemented gameplay support.
