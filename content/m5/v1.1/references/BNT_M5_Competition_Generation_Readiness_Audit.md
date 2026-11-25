# BNT M5 — Competition Generation Readiness Audit

**M5 competition readiness audit • 24 November 2026 • Investigation/design only.** Accepted M4 source/artifact and M5 Content Candidate v1.0 unchanged. EXISTING denotes verified code; PROPOSED denotes unimplemented contracts. Examples are explicitly UNAPPROVED.

## Verdict

**READY WITH IDENTIFIED PREREQUISITES** for supplemental content production and a bounded implementation authorization. Production integration remains blocked on M5-A implementation/current validators and explicit trophy/rival-condition/renewal/Recruiters policy dispositions. Existing native racing can support the geometry/format/environment scope; no engine replacement is justified.

M5-A was completed first (`../bnt-m5a-feasibility/evidence/completion.json`), with Option B recommended and prototype limitations carried into this audit. Its six reports/matrix, all eleven prior M5 audit deliverables and the complete256-record/16-catalog content candidate were reviewed. Original eight-nation/ancestry/beast canon remains the authority. Existing candidate source hashes and all accepted M4 source/artifact hashes remain unchanged; no production code, saves, builds or branches modified.

## Baseline

Branch `feat/e5-d-m1-startup-slots-options`; HEAD `27f9ecc086f27a1fb9fe593132308128ecd1249d` plus accepted uncommitted M4 source, manifest tree hash `e2bc429c8f27cea1edeb2d0c9dd0117f21527a16762f4da5394a4697fdc81c75`. HTML3,159,171 bytes/SHA256 `d77e49e40457c5de0255e3c95779941bec67023a4760248a69760f60b7a8d60c`. Current schema6/e5.version2/m4-progression-v1,21 functional Run Rewards/8 Legacy upgrades/3 Active slots. Historical accepted888 tests/Windows result not rerun here.

## Confirmed reusable systems

-3 oval/12 catalog circuits plus4 legacy presets, fixed four-lane course geometry, analytic lane/tile mapping and shared rendering point functions (`track/catalog.js:3–32`, course.js:17–126, oval.js).
-5 surfaces/5 weather presets; native segment patching and generator terrain distributions (`course.js:3–38`, surfaces.js, environment.js:4–44, race.js:96–108).
- Seeded Rally generation, bounded attempts/deterministic fallback, full resolved setup/recipe; explicit category SignPoint wrapper (`rally-generator.js`, prototype/session.js:9–11).
- Existing qualification, manual start, frozen lineup, D5 publication, D2, scoring/title/withdrawal/AI continuation/zero-starter, settlement and M4 progression. Reuse rules/reducers through explicit new bindings, not a second competition controller.
- Current Events/Details/Registration/Current/Last Event components; race/map/radio; shared art fallbacks. Extend data projection, not replace renderer/framework.

## Main integration blockers and limitations

1. **Static authority:** e5.register resolves catalogDefinition(templateId) and exact static board; arbitrary generated definitions cannot enter safely without a trusted versioned producer (`e5/schema6.js:27–33`).
2. **Event adapter:** freezeOffer schedule accepts only course/format/weather/laps/grid, so Oval surface override/custom width/location fields cannot simply be appended (`offers.js:11–20`). Native createRace supports patches; production controller bridge is missing.
3. **Reward identity:** trophy/victory/terms and M4 BONUS_TIERS depend on static template IDs, with fallback1 for unknown IDs. Separate generated identity from mechanics and approved trophy context. Do not reward tier5 as tier1 or grant signature unlocks accidentally.
4. **Rivals:** native fixed snapshots are championship-local with unnamed members and ordinal strength, not lazy recurring tier populations. Existing M5 recipes support birth inputs; lifecycle/identity storage required.
5. **Regional Market:** current policy blocks all active-run management. Approved intermission purchase exception must preserve frozen RU, native capacity/wages/financial anchors and no elimination rescue (`cycles/policy.js:8–9`).
6. **Persistence:** current full genesis replay/session retention cannot sustain target horizon. M5-A proposal requires production work, including physically safe GC and distinct prior-root retention not proven by sizing alone. No silent old save pruning.
7. **Missing policy:** generated trophy credit, rival between-run recovery, zero-start withdrawal renewal and Veteran Recruiters renewal frequency remain material decisions. Full and shorter generated schedules need explicitly approved economic bindings.

## Native geometry/environment findings

19 fixed preset entries and90 fresh generated Rally samples were probed;44 diagnostic groups pass. All current15 catalog tracks accept8 default starters and corridor validation. Native64 race ceiling differs from championship8 ceiling. Course lanes fixed4; Oval supports global1..8 but first M5 can stay4. Base generator emits3 checkpoints; category wrapper emits1/2/3; don’t reinterpret old tracks. Open Rally ignores lap multipliers (including current Iron Gauntlet laps2 disclosure); new profiles should declare one open traversal. Surfaces influence grip/rolling/fatigue and incident placement, not new weather physics or incident frequency. Full details/lengths/capacity tests in Track and Venue Contracts/CSV.

## Native lifecycle and policy findings

Five existing standard contexts align supplied difficulty files; Iron Gauntlet qualification is trophy-bannerfall and can reference top fixed strength context without new ladder. There is no separate native Combat/Circuit/Rally unlock. Shared ties use native finishTolerance/fullprecision, DNF ordering uses first-reached progress. Native disqualification action is not implemented merely because downstream filters mention DQ. Withdrawn/eliminated players leave AI schedule running; completing an event is not championship settlement.

## UI readiness map

| Surface | Existing seam | Missing integration data / bounded work |
| --- | --- | --- |
| Events/qualification | management/career-race/flow.js:27–31 | OpportunityId/epoch, proper competition names, tier/nation/region, eligibility; preserve read-only selection and confirmation. |
| Details/schedule | same flow;trackLabel and awardDisclosure | Venue vsgeometry label, surfaces/weather/point-to-point distance, previews and frozen reward context; avoid generic preset as venue identity. |
| Race/map/commentary | presentation/renderer.js:1–28;full-screen model;career-race/host.js | Frozen team/local/persistent name map and venue labels; native reporter untouched; graphics never affect RNG. |
| Current/Last Event/archive | headquarters/model.js:11–13;consolidated.js:21 | Current Rival RU/number fallbacks replaced by persisted proper org/member names; exact historical labels after compaction. |
| Market/services | player-pages.js;HQ context-actions;cycles/policy | Regional batch source/location/expiry/count, reserve-only acquisitions and native terms; no generic staff/search UI. |
| Trophies/rewards | M4 management +E5 archive | Explicit generated-vs-signature trophy credit; Completion Bonus context; existing Run/Legacy mechanics unchanged. |


## Performance / capacity evidence

Measured fresh Rally median0.64/1.56/4.16ms short/medium/long; long max20.29ms in90-seed sample. Resolved course3151–8945 bytes. Schedule-generation/offer/rival factory throughput is not measured because no production generator exists.3 opportunities×12 worst observed Rally generation samples implies~0.73s serial worker work as an **estimate**, not a UI target result. Cache static prestige courses; generation management-only.

M5-A synthetic set~11.7MB across437 records,228KB checkpoint; extra compact competition context~0.8–3MB estimate. Full historical courses would add34–45MB for5000 Long Rallies and are not required for compact history. Keep complete active setup/proofs; verify true native maximum aggregates before acceptance. Largest104ms browser task/worker memory concerns remain; no per-tick writes or bound increases.

## Final decision summary —18 required answers

1. **Yes:** existing template catalog supports renewable venue configuration/identity; no procedural circuit synthesis needed.
2. **Yes:** five native surfaces and weather profiles produce supported regional variation; explicit event bridge needed for oval patches.
3. **Yes:**16 prestige concepts can share geometry with fixed config and reusable art; no new mechanics required.
4. **Yes:** current Rally generator supports both; fixed prestige needs version/ordered recipe/resolved geometry, not seed alone.
5. **Yes, with adapter:** native race setup reusable; frozen controller event shape must be versioned for new metadata/config.
6. **Yes, with trusted definition/context binding:** retain qualification/registration/settlement formulas; static-ID assumptions need explicit integration.
7. Add committed opportunity epochs/batches/expiration/source revisions and idempotent renewal; preserve permanent signatures and no page/reload rerolls.
8. **Yes:** lazily birth fixed tier populations, no independent economics/training/player adaptation.
9. **Yes after new checkpoint authority:** locals freeze during championship, proper names/result refs survive compact history; current schema6 cannot simply delete them.
10. **Yes:** next venue location can scope limited intermission inventory; native active-management restriction needs narrow exception, not roster substitution.
11. **No material new backend direction:** Option B still fits; add validators/epochs/identities and measured historical metadata/GC tests.
12. Reuse16 core catalogs; amend/version rival birth/lifecycle, difficulty/valuation, regional policy and name/presentation bindings; do not alter v1.0 bytes silently.
13. Author geometry/environment/naming/venue/event/tier/championship/hybrid-rival/local/presentation/renewal catalogs (11 consolidated schema families).
14. Defer procedural circuits,new weather/physics/travel systems,offscreen rivals/adaptation,unique art and permanent replay telemetry.
15. Two dependent deliveries: protected persistence+asset/fixed-rival/Home foundation, then competitions/Regional workflow and integrated balance/standalone acceptance; content in parallel.
16. Owner dispositions: generated trophy/unlock credit/economic binding, rival between-run recovery, zero-start renewal, Veteran Recruiters semantics and concrete M5-A production format/transition authorization.
17. **No blocker to supplemental draft content production:** actual native contracts available; unresolved policy values must remain draft, not invented canon.
18. **Production has specific blockers:** M5-A current validators/record roots/GC/restore, trusted definition/event/market adapters and approved policies+balance. Catalog delivery alone is insufficient.

## Tests and scope

94 existing Node tests pass,44 diagnostic groups and172 schema/reference checks pass, all process exit0.13 requested files and raw evidence supplied individually. Complete test list/limits in Validation and Regression Plan. Accepted source/artifacts/content hashes preserved. No production implementation, images, migrations, builds, commits, merges, pushes or deployment occurred.
