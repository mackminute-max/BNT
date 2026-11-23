# BNT E5-D M2 — Stable Creation, Package Comparison & Atomic Onboarding

## Scope and accepted source

M2 only. Owner accepted M1 after local Windows Chrome/Edge testing. Verified source HEAD is `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`, branch `feat/e5-d-m1-startup-slots-options`. No branch, commit, push, merge or deployment was performed. This delivery consists of uncommitted changes on that branch; there is no new implementation commit to claim. Changed source/tests/runner manifest SHA-256: `2f86b87c4f30b3701f8e2f716fe715d316d7106df2e794fc28b50ddf4c7b1267` (20 files; `evidence/source-manifest.json`).

Read the approved `E5D_MASTER_IMPLEMENTATION_BRIEF.md`, accepted M1 implementation/test reports, and current source before implementation. Current owner authorization supersedes the master brief's earlier M1-only execution boundary. No World Identity Catalog, reconciled content draft, nation mechanics, artwork, fonts or network service is required.

The accepted M1 artifact remains byte-identical: 2,312,158 bytes; SHA-256 `b634a6840a616c25f75d3e539e6ab25955daf5eca5385daaa60e33913eb195c0`. Earlier accepted artifacts are checked by the new builder and preserved.

## Delivered player workflow

New Game now opens three coherent steps: cosmetic identity; actual package comparison; explicit final review. Stable/owner names, three built-in emblems and two colors remain draft-only until confirmation. Back preserves choices. Cancel/Escape before confirmation allocates no slot or grant and returns focus to the global wheel. The existing wheel/dialog architecture remains available.

All five source packages are displayed from `src/career/packages.js` catalog version 3, including native attributes, reserve stock, both installed equipment records, chariot condition/weight/capacity, property capacities and descriptive facilities. Source Gold remains Traditional 1200, Beastmaster Yard 850, Mechanist Workshop 800, Veteran Outfit 650, Scrappy Underdog 750. Installed equipment mass and combat remain zero. No claim of new species or facility bonuses is made.

**Verified eligibility fact:** the current catalog has no locked package/unlock-state contract. All five existing packages are available. The UI explains this rather than inventing restrictions. Unknown/unapproved IDs reject in preview, request validation and the original package initializer. A genuinely locked-package positive fixture is therefore inapplicable to this baseline; future unlock rules require their own authority.

Successful activation opens the existing headquarters. Branding and a six-tip guide appear only for new M2 metadata. Guide links point to existing overview, explicit service compatibility, roster/assembly, finances, championship and save actions. Next/Previous/Skip/Reopen only save guide progress. They do not grant, migrate, register, spend, repair, recover or advance time. Existing compatibility steps remain explicit player decisions.

## Atomic creation and existing authority

`src/management/creation/model.js::prepareCreation(request)` prepares the existing `createUninitializedCareer` factory and actual `CareerStore.transaction` in isolated memory. It invokes the unchanged `career.initialize` command version 1, catalog version 3, with the original pristine guard and `initializationEffect(careerId)`. No new grant reducer or alternate initialization authority exists.

`CareerSlots.createInitialized(request, {confirmed, onBoundary})` requires explicit confirmation, validates the entire request before allocation, reserves a separate M1 slot, and uses the existing complete-backup staged restore/atomic IndexedDB head activation. The prepared candidate is already fully initialized; M2 never publishes an empty playable head before its grant. Fixed request/slot/profile/career/grant IDs survive retries. Repeated identical committed requests return duplicate success; conflicting requests reject. No two independent storage writes are described as one atomic transaction: the catalog reservation is separate and nonplayable until the existing authority activates successfully.

Before confirmation, cancellation is safe and has no persistent draft. During an in-flight or ambiguous confirmed save, Back/Cancel are disabled and the UI offers retry of the same request. Interrupted retained restore evidence can be explicitly resumed through the existing Load Game recovery action. A reservation with no retained authority cannot be reconstructed or treated as playable; it stays blocked rather than fabricating a career. A lost acknowledgment after activation is recognized without a second grant.

## Versioned presentation metadata

Career schema numbers, save envelope, starting records, financial history and protected transactions are unchanged. The existing separate runtime metadata gains **version 2**, containing the unchanged pause/speed/cadence fields plus:

```js
presentation: {
  kind: 'BNT-stable-presentation', version: 1,
  profileId, careerId, creationId, packageId,
  emblem: 'wheel', primary: '#203944', secondary: '#dfb863',
  onboarding: { version: 1, status: 'active', step: 0 }
}
```

`src/persistence/e4/presentation.js` strictly validates keys, versions, IDs, bounded emblem/color choices and six guide steps. Cold worker loads and restore validate ownership against the actual initialized career and protected original `creationId + '-grant'` command. The exact-byte snapshot cache already includes runtime; changed metadata cannot reuse a mismatched snapshot. Normal updates cannot replace/drop cosmetic creation identity or downgrade runtime2 to runtime1. Guide progress may change through the existing revision-checked metadata operation, leaving mechanical records identical.

Legacy runtime1 remains supported unchanged and receives no invented brand or tutorial. Existing complete backup outer format stays version1 because it already carries a separately versioned runtime and integrity metadata. Complete backup/export/import preserve the new fields. Historical career-only JSON remains its original mechanical format, explicitly labeled as excluding cosmetics/guide and separate live session authority. Older application builds do not support runtime2; use M2 to open newly created M2 careers, and retain the accepted M1 artifact/backups for historical workflows. No automatic historical save normalization occurs.

This metadata is cosmetic onboarding data, **not** a World Identity/content-pack activation marker. No mechanical content is activated by it.

## Changed-file inventory and interfaces

| Files | Responsibility |
|---|---|
| `src/management/creation/model.js` | Catalog preview, exact creation request, memory preparation through existing protected command |
| `src/management/creation/wizard.js` | Three-step creation, comparison/review, confirmation/retry and cosmetic SVG |
| `src/management/creation/onboarding.js` | Skippable metadata-only guide and HQ emblem |
| `src/management/creation/creation.css` | Responsive wizard, comparison/detail and guide styling |
| `src/management/startup/slots.js` | Initialized-only staged activation, duplicate/conflict handling, presentation inspection |
| `src/management/startup/shell.js` | M2 routing, cancellation/focus/pause handling, guide mount, truthful help/backup labels |
| `src/management/startup/entry.js` | Build-time M2 flag; historical M1 entry retained |
| `src/persistence/e4/presentation.js` | Versioned metadata/ownership/provenance validation |
| `src/persistence/e4/runtime.js` | Backward-compatible runtime1 + strict runtime2 validation |
| `src/persistence/e4/worker-service.js` | Ownership validation on cold load, operation and restore; identity preservation |
| `tests/e5-d-m2.test.js` | 12 additive contract/grant/metadata/backup tests |
| `scripts/e5-d/m2/*.mjs` | Separate deterministic builder and packaged browser/replay/legacy/fault runners |
| `docs/e5-d/m2/*.md` | Architecture note, implementation, evidence and Windows checklist |
| `dist/Blood-and-Thunder-E5-D-M2-Playable.html` | New standalone artifact; accepted predecessors preserved |

The pre-existing unrelated untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was preserved. Reproducible logs and screenshots are under `/workspace/deliverables/e5d-m2`; no dependency/configuration changes or installations were made.

## Artifact, verification and limits

Artifact: `dist/Blood-and-Thunder-E5-D-M2-Playable.html`; **2,341,979 bytes**; SHA-256 **`96adf582c830722c7e0298ca2a45b61ca2c7e1317ab96a730aa59b4d3dbed574`**. See the separate Test Evidence for executed commands/results and the Windows Acceptance document for direct-file testing.

No simulation, AI, track geometry, physics, economic formula, package content, championship progression, reward effect, D2 mapping or historical checksum was edited. Existing embedded race Worker and E4 durable authority are reused. No M3–M7 implementation occurred.

Remaining limitations: browser storage is not permanent; a requested download is not verified disk persistence; genuinely denied IndexedDB cannot create a durable career; reservations without retained evidence stay nonplayable; guide actions do not automate existing compatibility upgrades; cosmetics are stable-interface-only and not race livery. Managed HTTP tests cannot establish Windows `file://` acceptance. No unresolved gameplay decision was invented or requires approval for the delivered M2 scope.

**STOP — awaiting owner acceptance of M2.**
