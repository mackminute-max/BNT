# E5-D M1 architecture note — before implementation

Baseline: branch `feat/m2-e5-c1-navigation-correction`, HEAD `a70ec6e836b765488dbe793606e8c103b8dad3da`; runtime `fd9cd96e3c8b13ac4ba391c7cf2f9651d923d10d`. Preserve the unrelated untracked M2-E audit and accepted C/C1/P2.2 HTML.

## Isolated slots, unchanged domain authority

Use native IndexedDB coordinator's existing `name` option. The legacy database remains `BNT-E4-v1`; new slots receive distinct random database names. No record copying with renamed owners, no domain-schema or Legacy-ownership changes. Each slot keeps its own head, previous generation, complete journals, migration/restore witnesses and worker. Existing global Web Lock remains conservatively shared: no weaker concurrent-writer contract.

A separate versioned native IndexedDB catalog records allocated slot IDs/database names BEFORE initialization. Reserved/failed rows remain visible, so an interrupted creation cannot silently orphan a valid database. The index is only a navigator; list/load must validate the actual coordinator authority. New slots initialize a confirmed, existing empty schema-2 career through the existing validated migration boundary from an isolated in-memory storage adapter, never through shared localStorage. Existing legacy authority is indexed nondestructively, not migrated on listing.

Committed save navigation metadata (timestamp plus local generation) is written atomically alongside the coordinator head. Missing historical timestamps remain unknown. Continue compares actual committed timestamps, never list/open time. An unavailable latest slot blocks automatic Continue and requires explicit selection. Index write failure precedes creation and cannot create an unindexed career; interruption after allocation is recoverable by reopening the listed pending slot. Read-only discovery never rewrites career bytes. Slot deletion deferred.

## Switching / presentation

A validated route selects the database before mounting the existing app. Switching uses a full document reload to discard workers, subscriptions, host connections, selections and listeners. UI guards wait for pending actions and obtain a durable race pause before switching. Active race/pending reward states remain saved, not settled or abandoned. A styled confirmation explains returning to saved progress. The title never creates a career.

Global parent wheel and native HTML dialog are outside the game mount and remain available over the embedded viewer. Options calls the existing viewer pause handler, waits for its worker pause acknowledgment and durable metadata, remembers prior playback, and resumes only if previously running. No simulation flag or second pause authority. Failure keeps the menu blocked and displays an actionable error. Scope-only confirmation adapter uses styled async dialogs for touched player actions; untouched developer browser popups are inventoried for M3.

## Existing actions to preserve

Seven stable pages; practice viewer; one Continue Championship control; empty creation; five protected packages; explicit economy/payroll/controller upgrades; RU assembly/disassembly; recruitment/sales/detach; facilities, treatment/repair/training/engineering; wages/contracts/emergency/failure; championship selection/registration/coaching/start/viewer/Signs/pause/step/speed/publication/withdrawal/AI continuation; Run and Legacy choices; final settlement; records; legacy/complete backup and confirmed restoration; all original workbench editors/diagnostics. Developer entry moves to Options; no player race controls removed. Unsupported preferences are explanations, not fake settings.

## Reference scope

Five supplied audits are snapshots, checked against source. Canon Nations and AI database are retained as references only. No world-content ingestion, M2 creation redesign, M3 HQ redesign, reward effects or M2–M7 work.
