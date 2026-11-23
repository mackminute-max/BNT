# BNT E5-D M2 — Test Evidence

## Source, environment and interpretation

Baseline HEAD `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`; branch `feat/e5-d-m1-startup-slots-options`. M2 changes are uncommitted by owner instruction. `scripts/e5-d/m2/source-manifest.mjs` fingerprints the changed source/tests/runners without creating a commit. Final standalone SHA-256: `96adf582c830722c7e0298ca2a45b61ca2c7e1317ab96a730aa59b4d3dbed574` (2,341,979 bytes).

Environment: Linux managed execution; Node v24.22.1, npm 11.9.0, existing esbuild 0.28.2, playwright-core 1.65.1, Chromium 156.0.8078.79. No dependencies were installed/updated. No lint/typecheck command is configured for this vanilla JavaScript repository. Tests use installed tools; browser HTTP checks do not substitute for Windows direct-file owner acceptance.

Evidence root: `/workspace/deliverables/e5d-m2/`; JSON/screenshots under `evidence/`. All results below refer to actually executed commands, not design promises. Representative historical saves are source-derived fixtures, not undisclosed owner save files.

## Node and build commands

| Command | Actual result | Exit |
|---|---|---:|
| `git archive 36b0048fac6d0b8c2e62f6c895ab624315e3f46f` extracted to `/tmp/bnt-m2-baseline-36b0048`, existing node_modules symlink; then `npm test` in that frozen copy | **761 tests passed, 0 failed** | 0 |
| `node --test tests/e5-d-m1.test.js tests/m2-e-e4-worker.test.js tests/m2-b.test.js` | **37 passed, 0 failed** | 0 |
| `node --test tests/e5-d-m2.test.js` | **12 passed, 0 failed** | 0 |
| `node --test tests/e5-d-m1.test.js tests/e5-d-m2.test.js` after final UI source/build | **16 passed, 0 failed** | 0 |
| `npm test` on M2 working source | **773 passed, 0 failed, 0 skipped/cancelled** (553.265 seconds) | 0 |
| `node scripts/e5-d/m2/build.mjs` twice | Byte-identical build reports and HTML; embedded Worker/offline dependency validation and accepted artifact guards pass | 0 each |
| `cmp /workspace/deliverables/e5d-m2/build-final.log /workspace/deliverables/e5d-m2/build-repeat.log` | Identical filename, bytes and SHA-256 | 0 |
| `git diff --check` | No whitespace errors | 0 |

The build preserves accepted M1 SHA `b634a6840a616c25f75d3e539e6ab25955daf5eca5385daaa60e33913eb195c0`, plus accepted C/C1/B/P2.2 artifact guards. No expected replay or fixture was altered.

### Additive M2 contract coverage

Twelve tests cover the exact five catalog packages; source-preview asset counts/native values/equipment neutrality; each real protected grant and duplicate retry; invalid names/unknown packages/cosmetic injection/unsupported fields; exact legacy runtime1; strict runtime2/guide versions; metadata-only guide operations preserving records; cosmetic replacement/downgrade rejection; cold/cache ownership and protected provenance checks; complete backup roundtrip; legacy outer backup compatibility; forged metadata ownership/proof rejection.

Existing Node coverage exercises career schemas 1–6, import/export/recovery, protected initialization and migrations, payroll/contract/recovery/settlement authority, native package adapters, D2 boundaries, controller publication, scoring, withdrawal, checkpoint/journal recovery and deterministic racing. No existing test was removed or weakened.

## Packaged browser commands

| Command | Actual final coverage/result | Exit |
|---|---|---:|
| `node scripts/e5-d/m2/creation-browser.mjs` | **7 groups pass**: wizard Back/Cancel; interrupted unconfirmed draft; all-five real comparison; 414px responsive comparison without document overflow; repeated confirmation once; Escape/focus over existing career; guide persistence; index/head/ack faults; exact complete backup in another browser context | 0 |
| `node scripts/e5-d/m2/browser.mjs` | **13 groups pass on the final SHA**: two UI careers, two native races, protected publication, Run/reload/Legacy, isolated progress, Options/Signs/speed, 140 navigation actions and practice/developer recovery | 0 |
| `node scripts/e5-d/m2/faults-browser.mjs` | **7 groups pass**: exact pre-M1 schema6 reconstruction/migration, index denial, retained legacy empty-slot recovery without grants, atomic save/navigation rollback, malformed/foreign backup, missing/corrupt independent slot isolation, IndexedDB denial | 0 |
| `node scripts/e5-d/m2/import-browser.mjs` | **3 groups pass**: complete pre-M1 active-race import with byte-exact records/journals, duplicate identity rejection, corrupt active checkpoint with recovery action still available through Options | 0 |
| `node scripts/e5-d/m2/final-native.mjs` | **1 group passes against the final SHA**: legacy migration, real native Worker race, running/paused Options behavior, exactly one official result and durable `SETTLEMENT_PENDING`; 878 ticks, seed1499551426 | 0 |
| `node scripts/e5-d/m2/file-browser.mjs` | **BLOCKED**, offline `file://` navigation denied by managed Chromium `ERR_BLOCKED_BY_ADMINISTRATOR`; no runtime network request | 2 |

The creation fault fixture interrupts the initialized career head after its restore stage: the reserved slot is nonplayable, explicit resume restores 750 Gold/one grant for Scrappy, duplicate retry returns already committed, a different package rejects. A second fixture loses acknowledgment after activation and retries successfully without regrant. Existing loaded career remains identical through all faults. Cancellation and guide tests compare the complete mechanical state, not only Gold.

Two initial development harness errors were corrected: the raw catalog represents driver ratings as arrays rather than named records, and the diagnostic `BNT` API is not initialized on the title screen until a career is mounted. Harnesses now inspect derived actual contents and mount before diagnostic inspection. Neither required modifying gameplay, grants, expected values or production behavior. Final reruns are the results tabulated above.

## Existing regression inventory

Executed `node scripts/e5-d/m2/regressions.mjs`. The wrapper redirects existing accepted runners' evidence and selects the M2 artifact only at established integration seams; assertions/golden data stay unchanged. Each subgroup can be reproduced with `node scripts/e5-d/m2/regressions.mjs <name>`.

| Existing subgroup | Result | Raw exit |
|---|---|---:|
| `references` | All **12 historical + 2 payroll** checksum comparisons exact | 0 |
| `layout-browser` | 5 responsive layout rows, no JS errors | 0 |
| `interface-browser` | 9 interface groups, no JS errors | 0 |
| `browser-native` | 100 championship-clock seed comparisons, 3 native races and buffered Sign/checkpoint verification | 0 |
| `checkpoint-compat` | 18 unchanged checkpoint compatibility rows | 0 |
| `player` | 13 existing player-interface groups | 0 |
| `e4` | 9 persistence groups: automatic checkpoint/Signs/reload, complete restore/idempotency/interruption, quota and writer/recovery paths | 0 |
| `legacy` | **23 functional checks pass over HTTP**, no JS/network errors; actual legacy file launch denied by browser policy | **1** |

The wrapper's overall exit is **1**, because the legacy runner deliberately reports its blocked file launch. Therefore this is **not** a completely passing browser suite. No legacy runner was altered to convert the restriction into a pass. Original legacy checks run the retained `dist/Blood_and_Thunder.html`; they are compatibility evidence, not proof of M2 direct-file operation.

Raw exits and results: `evidence/regressions/all-exits.json` and each subgroup's `exit.json`/`process.log`. Expected and actual individual replay digests are in `evidence/regressions/references/references.json`. Payroll references remain Pure `ad509187`, Combat `f191ca35`. No cross-runtime golden references changed.

## Acceptance matrix

| Required behavior | Evidence/disposition |
|---|---|
| Five real packages / contents / eligibility | Node source comparisons and packaged UI; all five genuinely available. No locked package exists in this source. Unknown unauthorized IDs reject. |
| Grant once / rapid clicks / conflicting retry | Existing initializer tests; triple UI confirmation; duplicate and postactivation lost-ack fault fixtures |
| Back, Cancel, draft reload | Packaged each step and existing-career Escape; no reserved slot/assets created before confirmation |
| Interrupted initialization not usable | Injected authoritative-head quota failure; invalid reserved slot until explicit validated restore |
| Independent identity/package/progress | Two real UI careers plus nondefault package/branding and recovery fixtures; complete-state isolation |
| Historical saves | Existing Node schemas/import/migration suites; packaged pre-M1 schema6 and active-race complete backup with exact original records |
| Existing Options/race behavior | Actual native race(s), acknowledged pause and original resume state; Signs/speed retained |
| Guide optional and nonmechanical | Skip/reopen/reload and complete mechanical-state equality |
| Cosmetic/guide complete backup | Independent browser-context restore preserves every serialized field/ID; career-only scope explicitly disclosed |
| Direct disk without server | Self-contained builder checks pass; managed `file://` blocked; Windows Chrome/Edge manual acceptance remains required |

## Remaining limitations

No M2 Windows/Edge owner acceptance is claimed. Missing retained authority cannot be recreated, storage denial is not a successful save, and browser download requests do not prove files exist on disk. Complete backup is required to preserve cosmetics/guide and active race authority; historical career-only JSON remains distinct. No package unlock policy, final art, World Identity integration or later E5-D milestone was invented.

**STOP — awaiting owner acceptance of M2.**
