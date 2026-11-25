# M5 Delivery 2 implementation report

Candidate: `Blood-and-Thunder-M5-D2-Playable.html` — **5,529,570 bytes**, SHA-256 `b1feae08d6af7ade30d2502d6c6a5daf12ac79a0172cdf59d220586a6c3fa30f`.

Branch `feat/e5-d-m1-startup-slots-options`, repository HEAD `6f01da6d9cc0a79fecf9d38cd55989e17fb2651c`. The accepted D1 source was an uncommitted candidate, verified against all 113 supplied manifest entries before editing. No implementation commit exists; the source manifest identifies this delivery. No commit, merge, push, release or deployment performed. Existing M4 and D1 HTML hashes remain unchanged. Owner Windows acceptance is pending.

## Disposition

**CONDITIONAL candidate for owner testing**, subject to the final validation matrix. All six workstreams are integrated into one build. Performance and broader balance limitations are disclosed; this is not a claim of owner acceptance or unlimited career capacity.

## Implemented behavior

- **D2-A:** trusted versioned compiler combines the 256 original core records with 310 supplemental records. Original bytes remain in `content/m5/v1` and `content/m5/v1.1`; amendments are separate. Six native signatures remain exact. Three renewable generated opportunities accompany them. Generated schedules use existing oval/circuit/route geometry, real native terrain coefficients and weather, and native tier fee/qualification/points/purse contexts. Generated victories award general tier credit and normal existing rewards; they never mint signature trophies or unlock Iron Gauntlet. Generation has bounded retries and no generic-name fallback.
- **D2-B:** four persistent organizations per ordinary tier, born lazily and immutable thereafter; two selected where field capacity permits, with at least one local. Complete named drivers, paired beasts, chariots and organizations have separate stable member and native entrant IDs. Tier-quality distributions are fixed rather than player-scaled. Conditions carry between native events; a later championship uses the healthy persistent birth profile. Local profiles remain with the active championship and pass into protected archive history. No offscreen simulation.
- **D2-C:** four once-generated regional offers after an eligible intermission Run choice. Only native driver/beast/chariot/equipment acquisition is permitted through a narrow controller exception. Home offers remain restricted while registered. Regional purchases use original prices, contract terms, capacity, ownership and wage reducers; purchases neither replenish stock nor modify the frozen lineup. Stock is retired with audit facts on next start/withdrawal. Recruiters applies only to Home stock. Home and opportunity epochs renew together at qualifying archive; voluntary withdrawal never renews them.
- **D2-D:** canonical same-species legality and all 117 approved affinity cells. All starting packages retain actual grants and base stats, with an approved new-career Horse pair classification. Home guarantees two disjoint same-species pairs, including Horses. Affinity freezes in registration, native setup and a new optional checkpoint state protocol. Old no-affinity paths and references remain unchanged.
- **D2-E:** bounded exact-text hash reuse and lossless private Worker record references reduce repeated hashing and immutable-history transfer. Domain validators, full durable body reads, exact read-set comparisons, generation CAS and awaited atomic IDB transactions remain. The transport is ephemeral, not a new save format or proof of durability. Cold history reconstruction and large JSON/manifest operations remain expensive.
- **D2-F:** authoring/native compilation, package, compatibility, lifecycle, browser, fault/quota, generation-volume, balance, history-capacity, deterministic and build evidence are separate and explicitly labeled.

## Source map

| Area | Files / interfaces |
| --- | --- |
| Content/compiler | scripts/m5-d2/compile-content.py; src/career/m5/d2/content.generated.js; content/m5/amendments/d2-v1 |
| Competition | src/career/m5/d2/catalog.js; championships/offers.js; e5/schema6.js; m4/progression.js |
| Fields/renewal | src/career/m5/d2/generation.js; lifecycle.js; career/m5/current.js; history.js |
| Markets/compatibility | src/career/m5/d2/markets.js; compatibility.js; cycles/policy.js; schema4.js; championships/controller.js |
| Affinity | src/model/affinity.js; affinity.generated.js; sim/race.js; environment.js; action-costs.js; foundation/checkpoint.js |
| Persistence | src/persistence/m5/indexeddb.js; verified-bytes.js; record-transport.js; e4/client.js; worker-entry.js; m5-store.js; m4-policy.js |
| Presentation | management/m5-d2.js; player-pages.js; career-race/flow.js; headquarters/active-team.js, consolidated.js, model.js; startup/slots.js; presentation/geometry.js, content/m3-bc.js |


The changed-file CSV compares against the frozen accepted D1 working tree, not only the older git HEAD. Four pre-existing test-output modifications and prior untracked documentation were preserved. The source manifest covers the complete source/content/test/build inputs.

## Early functional proof and defect correction

The first proof executed a generated two-event native championship through official publication, Run choice, final settlement, completion choice, archive, renewal and cold reconstruction. An initial regional diagnostic omitted the native `term:null` payload field; its rejection was correct. A subsequent test found mutable market-offer aliasing with the supposedly immutable regional stock. The registry now receives an independent clone; native purchase/retry/cold-load and packaged UI purchase tests pass without relaxing the stock validator. The key-only GC prototype initially attempted cursor.delete(), which Chromium rejects for a key cursor; the final code deletes the returned primary key through the same object store. The verified19-group IDB proof passes. Superseded verification runs were explicitly stopped when the source changed; their exits are not counted as passing final regressions. An early browser selector used `market` instead of the actual `markets` route; the runner was corrected, with the original failure log retained.

## Save and authority boundaries

D2 uses isolated `BNT-M5-D2-slots-v1` and `BNT-M5-D2-<slot>` databases. Schema7/envelope/root formats remain, with a mandatory versioned `m5.d2` extension and pinned content. This is an explicit isolated development-family boundary, not an automatic D1 career conversion. Open existing D1 careers with the preserved D1 HTML. D2 rejects incompatible imported authority instead of silently changing registered units. See compatibility report.

## Deferred and limited

No gambling, travel, generated circuit topology, new artwork, unrelated mechanics, numerical economy rewrite, permanent injury system, or Delivery 3 work. No 12-event economic schedule was invented: the approved native maximum remains seven events. Long-history main-thread targets and complete catalog-wide statistical balance are not asserted as passed. Windows direct-file behavior must be accepted locally using the supplied checklist.
