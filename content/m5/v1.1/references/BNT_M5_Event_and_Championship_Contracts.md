# BNT M5 — Event and Championship Contracts

**M5 competition readiness audit • 24 November 2026 • Investigation/design only.** Accepted M4 source/artifact and M5 Content Candidate v1.0 unchanged. EXISTING denotes verified code; PROPOSED denotes unimplemented contracts. Examples are explicitly UNAPPROVED.

## Native event / schedule boundary

A venue is identity+physical configuration; an event chooses that venue, format/distance/weather/grid and official competition context. EXISTING native race `createRace` accepts course, seed, overrides, entrants, Pure/Combat, weather, surfaces, environmentOverrides, player/coaching/payroll/progression contexts and consequences (`sim/race.js:45–108,235–263`). Track topology Oval/Circuit/Rally is **not** the Pure/Combat enum.

`championships/offers.js:11–20` template exact fields: kind/version/templateId/name/entryFee/fieldSize/qualification/schedule/points/dnfPoints. Field1..8; races1..12; points length=field size, nonnegative native Gold-safe integers. Schedule exact input keys **course,format,weather,laps,grid**. It resolves native course and full config, adds raceOrdinal, computes fingerprint, freezes. Grids random/standings/reverse. Native laps1..100; new open Rally authoring uses one traversal, not lap multiplication.

No event/venue ID, surface patch, arbitrary width override, location, reward binding or opportunity epoch is currently accepted in that schedule shape. Course-segment terrain can be authored inside a normalized Circuit/Rally definition; **oval surface overrides require an additive resolved-event adapter** because surfaces cannot be added directly to current freezeOffer rows.19 geometry probes prove native createRace surfaces roundtrip, not controller acceptance of arbitrary extra schedule keys. Corridor validation must be explicit. Do not route generated competitions around current validators.

PROPOSED event identity wrapper references venue/template version, native resolved setup fingerprint, format/distance and competition binding. Different events may share permanent venue definitions and differ in race seed/weather/laps/grid without copying a full static catalog. Freeze resolved per-event setup in active authority; use names/digests in compact history.

## Existing competition contexts and rewards

| ID | Competition | Qualification | Fee Gold | Field | Races | Pure/Combat order | Title Gold | Title Rep | Trophy |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dustroad | Dustroad Cup | {"reputationAtLeast": 0} | 25 | 4 | 2 | Pure / Combat | 25 | 10 | trophy-dustroad |
| ironwheel | Ironwheel Circuit | {"reputationAtLeast": 100} | 75 | 5 | 3 | Pure / Combat / Pure | 75 | 20 | trophy-ironwheel |
| bannerfall | Bannerfall Series | {"reputationAtLeast": 300} | 175 | 6 | 4 | Pure / Combat / Pure / Combat | 150 | 35 | trophy-bannerfall |
| crownfire | Crownfire Grand Prix | {"reputationAtLeast": 650} | 350 | 7 | 5 | Pure / Combat / Pure / Combat / Pure | 300 | 60 | trophy-crownfire |
| thunder-crown | Thunder Crown | {"reputationAtLeast": 1100} | 750 | 8 | 7 | Pure / Combat / Pure / Combat / Pure / Combat / Pure | 750 | 100 | trophy-thunder-crown |
| iron-gauntlet | Iron Gauntlet | {"hasTrophy": "trophy-bannerfall"} | 500 | 8 | 4 | Pure / Combat / Pure / Combat | 500 | 75 | trophy-iron-gauntlet |


Catalog `e5b-provisional-catalog-v1` (`e5/catalog.js:4–26`) is static playtest content. All events Clear; first random grid then standings; ordinary laps1, Iron Gauntlet laps2 (Rally ignores multipliers natively). Five standard contexts match supplied M5 difficulty bindings. Iron Gauntlet is a special Bannerfall-trophy-qualified competition; reuse existing top strength context if approved, not a new adaptive sixth ladder. No separate native Combat/Circuit/Rally unlock flag exists: qualify the championship, then its disclosed schedule may contain both Pure/Combat. Do not invent format-specific reputation gates.

| Context | Points | Ordinary purse | Final purse | Champ placement Gold |
| --- | --- | --- | --- | --- |
| dustroad | 10/8/6/5 | 25/15/10/5 | 40/25/15/10 | 150/100/70/40 |
| ironwheel | 12/9/7/5/4 | 40/25/15/10/5 | 60/40/25/15/10 | 350/220/150/100/50 |
| bannerfall | 15/11/8/6/4/3 | 60/40/25/15/10/5 | 90/60/40/25/15/10 | 750/500/350/220/140/70 |
| crownfire | 18/13/9/6/4/3/2 | 90/60/40/25/15/10/5 | 140/90/60/40/25/15/10 | 1500/1000/650/450/300/180/90 |
| thunder-crown | 20/14/10/7/5/3/2/1 | 150/100/70/45/30/20/10/5 | 225/150/105/70/45/30/20/10 | 3500/2300/1500/1000/650/400/250/125 |
| iron-gauntlet | 20/14/10/7/5/3/2/1 | 150/100/70/45/30/20/10/5 | 225/150/105/70/45/30/20/10 | 2500/1600/1100/700/450/300/180/90 |


All DNF points/purses0 in this catalog. XP each start/finish/podium/win1; player driver+both registered beasts receive applicable XP. Reputation start10/finish5/podium10/win15; final placement20/15/10/5 then0, truncated to field. Title values above and trophy/victory facts apply per current rules. Full native definitions/terms/fingerprints are preserved in evidence/native-inventory.json, not replaced by a parallel reward table.

## Qualification / registration / lifecycle

`offers.js:2–9` supports reputationAtLeast, hasTrophy, victoryCountAtLeast and nested all/any (≤32 each). `e5/schema6.js:27–33` e5.register resolves **catalogDefinition(templateId)** and demands exact board equality. `controller.js:30–40` validates qualification, one active/unsettled run, owned legal assignment, all event grids, revisions and funds before one fee debit. Frozen selection, ordered two beasts, chariot/equipment and player payroll context cannot be changed by generated content.

Manual start (`controller.js:45–48`) from INTERMISSION_READY/AI_CONTINUATION freezes raceSetup/race ID and binds durable birth. Race runs in memory through accepted P1 boundary. D5 clearance must resolve pending processing and validate classification/identity/final native condition; durable native prepare/capability precedes single protected official career commit (`foundation/checkpoint.js:48+`, `controller.js:49–55`, `progression.js:35–55`). D2 condition mapping, standings, participation, pending awards, eligibility and phase commit atomically. Failed clearance blocks and preserves evidence, never fabricates DNF/advance.

Nonfinal event: Run offer only after actual player start, official result and continuing eligibility, excluding DNS/DQ/withdrawal; selection blocks next preparation. Forced ineligibility/voluntary withdrawal ends player participation, **not** remaining frozen schedule. AI-only fields can shrink to1 starter (run normally) or0 (validated no-starter evidence). Final official event →SETTLEMENT_PENDING; one final settlement processes prize/XP/reputation/trophy/payroll/contracts/recovery; eligible Completion Bonus selection, then archive/unlock (`e5/schema6.js:12–38`, rewards.js:1–23).

## Scoring / eligibility details

Native finishTime and finishTolerance0.001 define official shared places, using full precision, not rounded display text (`race.js:378–419`). Competition ranking ties receive full points/purses and each shared first place counts as win. `scoring.js:3–39` adds authoritative first-reached DNF progress ordering, points→countback places→last rank→stable ID; title candidate must start final event, with legitimate DNF allowed, DNS/Disqualified/Withdrawn excluded. Native engine checkpoint statuses are Racing/Finished/Retired/DNS; DQ names in downstream filters do **not** prove an implemented native disqualification action. Do not author a new DQ mechanic under event metadata.

Legacy/Completion eligibility includes a legitimate start, full frozen schedule completion (including AI continuation) and no voluntary abandonment. M4 uses functional21 Run Rewards/8 Legacy upgrades/3 Active slots. `m4/progression.js:29` Completion Bonus uses **BONUS_TIERS[templateId] ??1**. That fallback is a generated-ID trap: new tier5 template IDs would silently receive tier1 completion Gold/reputation. Add explicit approved mechanics context binding; do not accept fallback as intended balancing.

## Static-ID dependencies and required changes

- e5.register/catalogDefinition and board validation accept only6 static IDs. Add a trusted generated-definition/opportunity producer, not an arbitrary UI offer object.
- Terms/trophy IDs/qualification facts/victory counts and Completion Bonus tier derive from native template IDs. Separate permanent competition identity, generated opportunity/instance identity and mechanics/qualification/reward context. Preserve native formulas and signature achievements.
- e5.refresh merely republishes the same static catalog; no generation epoch/expiration/market renewal exists. New batch authority required.
- Native offer cannot carry oval surfaces/environment customizations/venue identity; version the resolved-event contract and validators. Do not add permissive unknown keys or bypass setup checks.
- Current hard-coded generic rival generation must receive frozen persistent/local native profiles; official entrant/result keys remain unchanged.

## Schedule and opportunity proposal

Start with context-approved field size/event count/fee/award binding and native format pattern; generate locations/compatible geometry/surfaces from versioned profiles.1..12 races and1..8 fields are native capabilities, **not blanket approval** to pay a7-race purse/title for a1-race generated event. A single-event competition can reuse the lifecycle but needs an explicit supported economic binding. Avoid a separate special-event controller. No player-relative strength.

Seed schedule before fee, validate all venues/grids/format/distance/geo rules, bound retries, freeze entire selected schedule/roster once. On failure retain committed opportunity batch and Gold; no new epoch/reroll. Permanent signatures remain available independently of renewable opportunities; selecting/previewing is read-only. Persist opportunityId +batchEpoch +fingerprint/revision; source selection stale rejects. Exact counts/renewal criteria configurable, not hidden UI behavior.

## Owner-facing open decisions

Generated trophies/victory qualification credit must be explicit: do generated Bannerfall-context wins earn trophy-bannerfall and unlock Iron Gauntlet, or are named trophies reserved for permanent championships? Do not silently choose either. Recommend preserving signature-only unlock credit pending approval and explicitly binding generated Completion Bonus tier/fee/purse. Zero-start voluntary withdrawal renewal and cross-championship rival condition reset also need disposition. National→international weighting is a content proposal, not a new travel cost or qualification gate.
