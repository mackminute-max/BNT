# M6 current-state persistence contract

## Serialized family

Mechanical career schema **8**, `m6.version=1`, with a separate envelope `{kind:"BNT-M6-current-save",version:1,base:{value:<schema8>,hash:<sha256 JSON value>},tail:[],currentHash:<same>,presentation:<validated presentation sidecar>}`. The hash is corruption detection; a caller-supplied digest is never sufficient authority. `validateM6` performs cold validation and all native graph/condition, financial, national, market, result and ownership checks. Handwritten source validators remain authoritative.

M6 contains immutable Owner identity and starting-package provenance; opening/credits/debits financial anchors; at most 64 recent acknowledgments; monotonic instance and closed-instance sequence; one compact summary per closed championship; significant milestones; current identities, driver visual sex metadata, market provenance, fixed national rivals, national progress and unresolved/aggregate gambling state. Active instances retain official results, D2 evidence, standings and reward state until settlement and completion selection. Closed state discards full individual race histories, obsolete sessions and expired offers only after native obligations and final effects are reconciled.

## Transaction boundary

Synchronous domain stores prepare in the embedded Worker. An IDB commit checks exact generation/read-set and activates one reference root atomically. A Worker response alone is not durable acknowledgment. Normal races run in memory, with no per-tick persistence. Native prepare replays the accepted input transcript and compares exact native state before durable preparation. Official publication requires the accepted D5 capability and one protected career commit. Final review does not pay; eligible final reward choice and all prizes/payroll/wagers publish together. Interrupted publication and lost acknowledgments are idempotent.

## Bounds and recovery

8 MiB logical records and256 MiB complete backup bounds are retained. Current and previous roots keep referenced bodies; GC removes unreachable bodies only. Restore is validated/staged and atomically activated. Old requests outside the bounded acknowledgment window fail absolute revision checks. No lifetime command replay is required.

Previous-root recovery is allowed only for the same gameplay witness with newer writer chronology. Different economic/gameplay facts fail closed instead of undoing committed purchases or rewards. Matching complete backup repair is available. Missing/corrupt records cannot become an empty new career. Existing M4/M5 careers and files are not migrated or silently imported into schema8; earlier HTML remains the reader for those saves.

## Compatibility

Owner sex is persistent visual metadata, validated and included in complete backup/restore, without influence on native attributes or random streams. Presentation sidecar-v2, immutable recruitment pack pin and radio preference remain separate from mechanical state. New saves do not reuse legacy storage namespaces. Unfinished M6 race closure restarts from frozen seed; unfinished ticks, Signs and ability inputs are intentionally not saved. Completed results and previously committed choices remain durable.

