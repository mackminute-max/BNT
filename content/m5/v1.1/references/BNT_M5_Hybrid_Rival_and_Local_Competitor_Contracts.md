# BNT M5 — Hybrid Rivals and Local Competitors

**M5 competition readiness audit • 24 November 2026 • Investigation/design only.** Accepted M4 source/artifact and M5 Content Candidate v1.0 unchanged. EXISTING denotes verified code; PROPOSED denotes unimplemented contracts. Examples are explicitly UNAPPROVED.

## Existing native foundation

`championships/controller.js:35` creates rivals **per championship**, using defaultRU(entrantId,46+2*i), same stat for every component, no independent driver/beast/chariot career records and assetIds:null. Strength follows field ordinal48..60, not the five proposed competitive tiers. `progression.js:16–17` normalizes/freezes personality at registration; :45–46 updates native condition and management conditionState after each official result. `prepareRace:69–77` uses same engine/native stats for players/rivals, deterministic grid/race seeds and eligibility. No offscreen finance/development or recurring identity population exists.

## Approved new model / proposed contract

Maintain3–5 persistent organizations per accessible competitive context, lazily generated once using a committed tier birth epoch and fixed final native member profiles. Five tiers yield15–25 teams at that planning scale; M5-A32–128 is a stress target/reserve, **not a required minimum population**. Exact counts remain configurable. Save org/member IDs, proper names, culture/nation, native attributes, six driver traits, native chariot/equipment configuration, presentation refs and lightweight result-keyed encounters. Do not resample quality/attributes after player wins, wealth, Legacy, years or reentry into a tier.

For each championship, select2–3 persistent entrants where field permits, then fill other nonplayer slots from location-weighted local generation. For field4,3 persistent would leave no locals: cap persistent participants to min(configured,fieldSize−2) when at least one local is required. Recommended starting default2 persistent for current4..8 fields. Smaller fields1/2/3 degrade explicitly; never fabricate entrants or alter current eligibility handling. Unavailable/rejected candidates need bounded selection from remaining valid profiles; failure must not debit fee or silently reroll an established batch.

Local teams use existing nation/culture/name/background/AI/species/stock/temperament/quality/chariot/equipment profiles, weighted toward championship venue region with nonzero imported competitors. A local is championship-scoped, named as completely as a persistent team, and frozen for the full schedule. All mixed-ancestry/national routes remain source-compatible; local does not mean ancestry-exclusive. No generic AI Team/Rival3/Driver4/Beast2 fallback.

## Identity and authority mapping

Separate `organizationId`/member IDs from native per-instance entrantId. Example future mapping: entrant e2-… →rival organization stableID or local(instanceID,ordinal); driver/beast/chariot identity refs+frozen final name map. Existing official proof/rows/effects continue referencing entrantId. Do not replace result keys or insert rival assets into player-owned registries. Native ownership graph requires player career owner for owned assets; it is the wrong container for rivals.

Persistent profile=current birth strength, active snapshot=mutable condition for this championship, history=compact encounter/source result references. No complete organization graph copied into every race; freeze display/roster once at registration and reference from results. Local active records leave after final settlement/Completion Bonus/archive checkpoint, **not** immediately after one race. History pages retain exact team/member/venue names and final outcomes even when active locals disappear. Updates to catalogs must not rename old results.

## Cross-championship condition policy — unresolved design

Native current rivals are newly initialized each championship; no permanent death/deletion is modeled by current D2 Critical/Destroyed. Recommend an abstract fresh-native-condition baseline at next championship while preserving fixed attributes/personality/configuration; this maintains fixed competitive strength without an offscreen hospital/repair simulation. It is a proposed player-facing reset policy and requires owner disposition. Carrying injuries indefinitely would change effective strength/deplete the small population and require an explicit replacement rule. Do not automatically infer permanent death or silently heal before approval. Within-championship carryover remains unchanged under either future boundary policy.

## Candidate v1.0 compatibility

Reuse all16 catalogs: identity/attributes/naming/AI/species/stock/staff/chariot/equipment/quality/visual records are factories/content inputs, not mature lifecycle code. Existing40 rival generation profiles already bind eight nations×five contexts and disable offscreenSimulation. Reuse them for **birth**, once per persistent organization, or once per local championship. The same profile does not imply reroll each registration.

Targeted candidate v1.1 companion additions: explicit tier birth/lazy population policy, immutable final strength/provenance, persistent-vs-local lifecycle, encounter history keys and regional input reference. Amend provisional-balance-policy/difficulty bindings and integration notes to describe fixed birth +location-weighted locals, not player adaptation; preserve v1.0 hashes. No wholesale factory rewrite or new rival economy needed. Iron Gauntlet can use existing tier5 strength binding rather than grow a parallel ladder, while its trophy qualification remains separate.

## Tests required

Same org/member names/traits/stats recur after save/reload/reenter; no player-relative changes; new tiers create distinct fixed populations; duplicate entrant selection rejected; field4 reserves a local; smaller fields and zero-starter proof; condition and personality persist within schedule; explicit between-run reset/carry policy; local names never generic; exact historical names survive compaction/catalog update; lost publication acknowledgment does not double encounter counters; no player-owned graph injection. Full native race/Sign/D2/reward regression after future integration. Audit probes validate native geometry and existing lifecycle tests, **not** an implemented hybrid field.
