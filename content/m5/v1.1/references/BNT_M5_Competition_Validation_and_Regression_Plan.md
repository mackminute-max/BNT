# BNT M5 — Competition Validation and Regression Plan

**M5 competition readiness audit • 24 November 2026 • Investigation/design only.** Accepted M4 source/artifact and M5 Content Candidate v1.0 unchanged. EXISTING denotes verified code; PROPOSED denotes unimplemented contracts. Examples are explicitly UNAPPROVED.

## Executed during this audit

| Command | Raw exit | Actual outcome |
| --- | --- | --- |
| node tools/native-inventory.mjs | 0 | 44 diagnostic groups,19 fixed preset entries;90 generated Rally recipes repeat/validate;6 repeated100-tick Pure/Combat cases |
| python tools/create-contracts.py | 0 | 11 strict authoring families;21 explicitly unapproved examples; no production catalog |
| python tools/validate-contracts.py | 0 | 172 schema/source/reference/native-context/candidate-preservation checks;6 invalid-input cases rejected |
| node --test tests/track-expansion.test.js tests/courses.test.js tests/m2-e-e2-e3.test.js tests/e5-b-foundation.test.js tests/e5-b-lifecycle.test.js tests/m4.test.js | 0 | 94 tests pass,0 fail/skipped/cancelled;96.9s managed-container run |


All command logs/JSON in evidence/. Existing tests include300 generated seeds in track-expansion plus three full native category races/replays and lifecycle/condition/reward cases. The separate audit diagnostic sample is90 seeds, not an additional300 claim. M5-A separately ran36 existing tests,25 model checks and9 HTTP temporary-IDB checks; do not describe these as a passing complete888-suite or a Windows acceptance run.

No full application/browser UI suite, build or Windows file acceptance executed here. Accepted888 tests/Windows success are historical baseline evidence. All187 source and53 changed-file hashes/artifact match; no golden references modified. Existing numerical/cross-runtime diagnostics were not “fixed” by updating expected values.

## Required native geometry matrix

-3 oval +12 catalog circuits, Pure/Combat, all supported context field sizes; validate corridor, start grid, lane lengths, closure, tile/turn bounds and initial footprints. Include legacy course aliases/fixed Rally to preserve old behavior. Each proposed surface pattern and weather preset resolves/freeze/reloads exactly.
- Generated short/medium/long: seed corpus including negative/large safe integer seeds, road/rugged/weighted terrain, corner settings, bounded retry/fallback and category SignPoint wrapper. Preserve native default-three legacy fixtures. Reject unknown surfaces/weather/lane count, bad grids, changed generator version, unsupported widths and invalid topology.
- Pause/step/speed and queued input at start/crossing/SignPoint; multi-marker/tick correctness, default3 opportunities/M4 modifier, no consumption merely from crossing. Replay setup and identical inputs exact in supported runtime. No new geometry, rounding, event-order or RNG consumption changes.

## Championship / economic matrix

Five contexts +Iron Gauntlet exception; exact qualificationRep/trophy/victory predicates, field/event count, fee, points/purses/title/XP/reputation/Completion tier and trophy policy. Same permanent venue hosts Pure/Combat/different weather without physical drift. Static signatures unchanged. Generated IDs cannot fall back to tier1 Completion Bonus or arbitrary UI awards.

Registration atomic fee+frozen roster/schedule; duplicate/lost ack/stale opportunity/invalid setup cannot charge or consume epoch. Native official publication only after D5; unresolved/stalled blocks. Shared placement fullprecision/finishTolerance/competition rank/full rewards; DNF first-reached progress; final start/title/null champion; DNS/disqualification restrictions preserved without inventing native DQ action.

Run choices, hard elimination, voluntary withdrawal, AI completion,1/0 starters, settlement/payroll/recovery once, Completion Bonus and archive. Rewards21/Legacy8/slots3/caps and authority unchanged. No unapproved travel, auto start, auto roster substitution, new fees or parallel economy.

## Hybrid rivals / markets

Lazy population3–5/context, fixed birth stats/personality;2–3 persistent selection constrained by field/local reserve. Local nationality/culture/import routes, coherent named members, collision bounds and frozen identities. Same team can recur without player-relative adaptation; higher contexts introduce new strength populations. Within-championship damage/fatigue persists; between-champ condition follows approved policy only. No permanent deletion rule inferred from Critical/Destroyed.

Home full renewal and regional limited batches: opening/reloading has zero renew effect; purchases don't refill; stale/failed writes preserve funds/epochs/remaining candidates. Full native acquisition/wage/capacity proof; regional staff excluded, purchases reserve/uninstalled only, registered lineup unaffected, no elimination rescue. Source previous/result financial anchors immutable; next race/terminal payroll includes correct accepted contracts. M4 Veteran Recruiters renewal frequency needs explicit policy: one lifetime extra candidate versus one extra Premium slot per renewed Home batch must not be guessed.

## M5-A / recovery / performance

Checkpoints: monotonic sequence/revision, complete current/native validators, tail/semantic once-only facts, missing/corrupt pages, stale tabs, worker death before/after commit, lost ack, quota denial, explicit previous recovery as new generation, staged import/restore and unrelated slot protection. Physically remove obsolete candidate/journal bodies only after two-root+pending-restore reachability proof; model state omission is not physical GC proof.

Accelerated500-champ/5000-race/50k-management/100k-candidate-history counters plus128 rival stress is sizing, not full native gameplay. Production must exercise real current validators/reducers/IDB across actual rollovers and representative full native maximum-field/long-schedule games. Label synthetic candidate counters/full-race executions distinctly. Preserve per-record8MiB and backup256MiB; no protected-data deletion shortcut.

Measure separate catalog/schedule/rally/preparation/durable commit/clone/cold verify/export/restore times, main-thread long tasks and sampled memory. Generation outside playback, zero ordinary tick writes. Preferred≤100ms main tasks; quantify residual synchronous commit/UI work rather than weakening validation. Bulk history/backup work in worker; chunk transfer safely. Repeat workloads under controlled load for release; this audit is feasibility evidence.

## Production release gate

Run full accepted Node/browser inventories with raw process exits and legacy-failure dispositions, historical12/payroll/clock references, all new integration/fault tests, double standalone build byte identity/dependency checks and owner Windows Chrome/Edge direct-file tests. No server/network/adjacent assets required. Audit completion is not that acceptance.
