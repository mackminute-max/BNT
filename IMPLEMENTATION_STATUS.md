# Current implementation status — M2-B review

M2-B implements the approved five starting packages, explicit pristine one-time initialization, typed owned assets, prospective RU assembly/disassembly and minimal save-panel UI. Racing engine/formulas/AI/track/replay and M1 compatibility source remain unchanged. M2-A passed owner-reported local testing; M2-B awaits owner review and merge approval.

Verification: **293 automated tests passed**, including all 265 previous tests and 28 new cases. **66 browser functional groups passed** (13 M2-B, 12 M2-A, 18 M1, 23 racing/workbench); direct file navigation remains administrator-blocked. Twelve complete reference/autonomous races matched M2-A captures and replay checksums exactly. HTTP/offline-after-load diagnostics do not establish Windows file-origin operation.

[Report](docs/m2-b/M2_B_IMPLEMENTATION_REPORT.md) · [API](docs/m2-b/SCHEMA_AND_TRANSACTION_API.md) · [Windows checklist](docs/m2-b/WINDOWS_ACCEPTANCE.md) · [Reproduction](docs/m2-b/README.md).

Standalone aliases: **295768 bytes**, SHA-256 `3f8c8e33acebe128c8b1f25e327c5feefdaf5900d120ff38d016db62a21bd83d`. Dedicated review branch: `feat/m2-b-stable-initialization`. No merge, deployment, final acceptance, M2-C/D/E or M3 implementation.

---

## Historical M2-A status (superseded by the M2-B record above)

# Current implementation status — M2-A foundation

**M2-A implemented; automated/managed-browser functional gate passed; stopped for owner review.** Racing simulation/package remain `0.6.0-tracks`/`0.6.0`. New career schema 2 coexists with the unchanged schema-1 compatibility implementation. The transport envelope/discovery key stay version 1 with explicit protected-history/maintenance-clock features for upgraded files.

Explicit confirmed migration preserves original Owner/career IDs, balances, gameplay revision, receipt payloads, developer provenance and valid pending data. It adds empty registries, `initialized:false`, protected command/effect identities and separate maintenance revision. It grants no Gold/assets/progress. Initialization is reserved for separately authorized M2-B. No M2-B–E gameplay or compaction execution was implemented.

Verification: **237 baseline tests passed; 265 final tests passed, zero failed**, including 28 new M2-A cases. All **25 original M1 persistence tests** remain unchanged and pass. Browser diagnostics pass **12 M2-A, 18 M1 and 23 retained racing/workbench groups**, with exact unchanged race parity and no runtime requests/page errors. Actual managed file navigation remains administrator-blocked; HTTP diagnostics do not verify Windows file-origin save durability.

[Implementation report](docs/m2-a/M2_A_IMPLEMENTATION_REPORT.md) · [Schema/API contract](docs/m2-a/SCHEMA_AND_TRANSACTION_API.md) · [Windows checklist](docs/m2-a/WINDOWS_ACCEPTANCE.md) · [Reproduction/evidence](docs/m2-a/README.md).

[Current standalone](dist/Blood_and_Thunder.html) and `dist/Blood-and-Thunder-Track-Test.html` are identical: **267562 bytes**, SHA-256 `0f91c4f04616387933eb6485eb542bb6344713319a8a6980b7abaa9aba747a11`. No runtime Node, server, external dependency or adjacent file required by the architecture. Direct-file acceptance of this new hash remains outstanding; no final owner acceptance declared.

Racing/AI/physics/track/sign/commentary/replay source, dependencies and build script are unchanged. Schema-1 M1 implementation was retained verbatim. Manual save gates, explicit import/recovery, original checkpoints and immutable isolated receipt views remain. P0 identity retention is active; P1/P2 compaction is preparation only. Legacy progression is never merged.

Limits: 2 MiB legacy /8 MiB protected file, finite receipt/history limits without pruning, browser quota/eviction/path risks, single-writer operation without Web Locks, diagnostic rather than cryptographic seals, inert incompatible schema-2 pending records, no M3 race bridge. Referenced detailed 3.59–3.62 documents were not supplied; later-stage gameplay must be reviewed against them before implementation. No remote push/deployment/publication in this pass.

[Previous M0/M1 report](docs/persistence-foundation/M0_M1_IMPLEMENTATION_REPORT.md), [track report](docs/track-expansion/TRACK_SYSTEM_EXPANSION_REPORT.md) and [architecture audit](docs/Blood-and-Thunder-Architecture-Audit.md) remain historical records at their stated revisions/checksums.
