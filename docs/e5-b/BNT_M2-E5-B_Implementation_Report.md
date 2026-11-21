# BNT — E5-B Implementation Report

## Delivery and baseline

E5-B adds the authoritative championship/reward lifecycle. It does **not** implement the E5-C owned-career/P2.2 bridge or claim the whole career game is playable.

- Branch: `feat/m2-e5-b-championship-progression`.
- Verified delivery baseline: `479931d9bbbdd36a09dbb22475006808a871f683` (documentation after accepted E5-A.1 runtime `7e78f70cb707a58527ce5d989aa47ff5d79553d2`).
- Frozen implementation: `4322672749091d8f0c7121d7f2d14f3d5bba67a7`.
- Runtime/test/build tree: `2720274f5f33aa2fce372f3180bd97f67ad18c09`.
- A subsequent documentation/evidence commit is reported separately in delivery. It does not change the runtime.
- No merge, push, publication or deployment was performed.
- The pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was preserved and excluded.

## Requirement mapping

| Requirement | Implementation |
|---|---|
| Versioned catalog/qualification | `championships/e5/catalog.js`: six explicit provisional supported-track definitions; fixed IDs, qualification and award terms; frozen at registration. |
| Atomic entry/locks | `e5/schema6.js` delegates to accepted controller candidate validation in the same protected operation; no separate fee write. |
| Native results/standings/D2 | Existing `ChampionshipRunner`, RaceSessionStore and E3 official publication remain the authority. No simulator changes. |
| Run choices | `reward-offers.js`, `e5/rewards.js`, `schema6.js`: persisted deterministic three-choice offers; owner-approved start/status/continuation gates; advancement lock; confirmed scoped selection. |
| Final-only settlement | `e5/capabilities.js` verifies live durable career/native evidence; dedicated worker path invokes unchanged M2-D reducer and commits all final effects once. |
| Permanent Legacy | Versioned terminal entitlement and three-choice offer; confirmed ownership in `profile.legacy.records`; archive/unlock only after pending selection. No Legacy Points or effects invented. |
| Trophy/progression/history | Versioned terminal registry, per-instance entitlement IDs, trophy victory history, qualification facts and immutable archived result references. |
| Durable failure/retry | Existing E4 generation/read-set transactions and record limits preserved; E5 business retries require identical current reconstructed facts; corrupt/missing native evidence and conflicts reject. |
| Expanded Stables | Existing immediate +2 capacity effect and 400-Gold cost verified; player pages now display actual capacity and applied benefit. |
| Player UI | Actual offers, disclosure, registration, official results/standings, withdrawal status, Run/Legacy cards, final settlement review, permanent records and archives. |
| Standalone/compatibility | New single-file build embeds the accepted practice artifact and inline E4 worker; old artifacts and deterministic references unchanged. |

## Modules and interfaces

New domain files under `src/career/championships/e5/` separate contracts/protected effects, catalog, reward eligibility/accounting, terminal capabilities and schema-6 reconstruction. `src/career/championships/reward-offers.js` owns pure catalog/offer generation. `src/management/championship-e5.js` renders and binds player-facing controls through the existing queued persistence port.

Additive candidate/graph-validation seams were exported from the accepted controller and schema-4 module. Existing validators were not relaxed. Dispatch, heterogeneous protected registry and envelope provenance classification recognize the new schema/command kind. Worker `e5` operations use the accepted coordinator; arbitrary generic settlement is blocked. Player port methods preserve busy/error handling and durable generation checks.

Tests add reward/eligibility/roundtrip/fault/award fixtures and reproducible native, browser, Worker, elimination and repeat-victory scripts. The E3 helper gains only an optional unregistered fixture mode; old defaults and assertions remain intact. `npm run build:e5-b` creates the new deliverable without overwriting accepted HTML.

## Owner clarification applied

Hard elimination ends only player participation; AI completes the frozen schedule. No further Run offers occur after elimination. Intermission publication does not pay wages, Gold, recovery or permanent progression. Final M2-D settlement executes once.

Run offers require a trusted nonfinal player-started result and continued eligibility; DNF can qualify, DNS/DQ/withdrawal/elimination cannot. Legacy eligibility requires a legitimate start, complete schedule and no voluntary abandonment. Elimination after participation and final DNF qualify; DQ does not erase earned participation. Registration alone is insufficient. These gates are distinct from title eligibility.

## Persistence and integrity

Schema 6 is an explicit additive upgrade from schema 5/E3, with full origin and receipt reconstruction. There is no silent migration or retroactive reward grant. Historical offers without frozen reward terms receive no invented purses, XP/RP, trophies or reward choices. Existing financial/provenance/history records, condition data and native session evidence are preserved.

Final income, old debt, active personnel payroll, debt streak, recovery, contract processing and statements use the unchanged M2-D reducer. XP/RP/trophy effects, registry and Legacy entitlement publish within the same protected career transaction. Process-local capability branding is reconstructed from durable evidence, never imported as authority. Legacy selection/archival is a separate protected decision; pending selection keeps management locked.

The old E3 `officialFinal` snapshot remains unchanged; the new terminal registry and statement, not its historical `settled:false`, establish final settlement. Legacy profile replacement remains explicit and never merges another profile's progression.

Existing 1,000 receipt, 2,000 protected-identity, 8 MiB logical record and 256 MiB complete-backup bounds remain unchanged. No journals/history were pruned, and no E4 experimental representation was integrated.

## Artifact

`dist/Blood-and-Thunder-E5-B-Playable.html` — **1,800,945 bytes**.

SHA-256: `d9f909a59a78ad3c3a688ce15be6e6d77c2164fde2f16469ade9530cddbae6b8`.

A rebuild produced identical bytes with no tracked artifact diff. Dependencies remain esbuild 0.28.2 and playwright-core 1.65.1 as development tools; no runtime dependency, server, external asset or framework was added.

Accepted E5-A.1 and P2.2 artifacts retain hashes `e60d9e7ae55025d4aedb50b81629038051ae4262e4e73ce7f29b475c7b310cb1` and `24c393c19f7d8aa6f4e2bf6794d2e573d11be74508940e97b78a6330b6a203be` respectively.

## Limits and next gate

Reward effects and the six-template catalog are provisional. No numerical Legacy Point award, slot expansion, new recovery/service, physics/AI change or new economic formula was introduced. The fallback board does not invent procedural one/two/three-offer progression thresholds. Long schema-6 capacity/performance remains a disclosed risk under unchanged safe bounds; concurrent correctness runs are not benchmarks.

Windows direct-file acceptance remains owner work because managed Linux Chromium blocked `file://` navigation by policy. See the separate Windows checklist and test report. E5-C, E5-D and P3/P4 work remain unauthorized and unimplemented.
