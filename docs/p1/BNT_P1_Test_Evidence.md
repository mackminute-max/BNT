# BNT — P1 Test Evidence

Runtime source commit: `bb39003c93d353cb35a8f4a853ab11ecca8b7976`; branch `feat/p1-playable-race`. Baseline `de1bd66990a2bd390294a152f886b31e5bb8ac04`. Existing golden/reference files were not changed. No tests were weakened.

## Commands actually executed

| Command | Result | Raw process exit |
|---|---|---:|
| `npm test` before P1 source edits | 525 passed, 0 failed; 379,050 ms | 0 |
| `npm test` final native/shared source | 556 passed, 0 failed; 381,185 ms; includes 31 P1 tests | 0 |
| `node --test tests/p1-playable.test.js` final commit | 31 passed, 0 failed | 0 |
| `node scripts/p1/references.mjs` | 12 historical native replays and 2 payroll references matched | 0 |
| `node scripts/p1/compare.mjs` | 16 full native races cleared; all within-build repeats matched | 0 |
| `node scripts/p1/browser.mjs` final artifact | 8 functional groups passed; no JS errors; offline interaction and no runtime requests; file navigation blocked | 0 (file limitation explicitly recorded) |
| `node /workspace/BNT/scripts/browser-test.mjs` from isolated `/tmp/bnt-p1-production-browser` with production dist symlink | 23 existing functional groups passed over HTTP; no JS errors or runtime requests; actual file launch blocked | **1** |
| `node scripts/p1/profile.mjs` | Four full Node and four full Chromium fixtures cleared; measurements in performance report | 0 |
| `node scripts/p1/build.mjs` repeated | Byte-identical P1 artifact; accepted production artifacts unchanged | 0 |
| `git diff --check` | No whitespace errors | 0 |

The full Node run was started with the final native/Sign-policy/test sources. A subsequent compare-panel-only control-lock fix was validated by the final browser run; it changes neither native modules nor Node-tested state. The final focused suite was rerun on the committed revision. No blanket Windows acceptance is claimed.

## Focused requirements coverage

- Explicit prototype policy versions/counts and exact reference-lane fractions; malformed/unknown versions/categories rejected; legacy three-marker behavior retained.
- Full native Pure and Combat clearance on oval, circuit and each Rally category; single-starter real races plus multi-entrant benchmark/comparison fixtures.
- Immutable build compilation, bounds/clamping, unchanged rivals/grid/personality, no modifier compounding or healing; native no-context parity.
- All six Signs, starting-signal activation, cancel/no refund, lower, replacement, exhaustion and Pure legality; multiple points within one native tick and checkpoint replay equivalence.
- Synthetic resolved checkpoint boundary (clearly labeled in test) verifies later commands wait for the next eligible point. Existing course tests cover adjacent segments and complete multi-boundary ticks.
- 1×/2×/4× command ordering and pause/step equivalence, retained scheduling debt and fixed dt.
- Camera player/rival fallback, fitted bounds, live browser canvases and marker counts, narrow layout; read-only geometry rendering uses native coordinates.
- In-memory play rejects storage access in tests; browser saw **0 Web Storage writes and 0 IndexedDB opens**.
- Stalled/unresolved native state never becomes a successful official result. No P1 permanent consequences/rewards exist to publish.

## Replay evidence

Historical replay details: `evidence/references.json`, freshly checked without rewriting retained records. Payroll Pure: `ad509187`; Combat: `f191ca35`. Repeated build outcomes are checked within the supported runtime. The inherited Node/Chromium Long Rally geometry difference remains; see performance report. No historical checksum was updated.

## Browser and direct-file limitations

Chromium 156.0.8078.79 on managed Linux was available. New P1 browser suite performs HTTP loading, goes offline for subsequent interaction, asserts no runtime requests and exercises normal controls. Its final explicit file navigation reports `ERR_BLOCKED_BY_ADMINISTRATOR`.

The existing production browser script intentionally exits nonzero when only HTTP diagnostics can run: raw exit **1**, despite its 23 functional groups passing. This is not a completely passing browser suite and not Windows acceptance. Other specialist historical E4 browser runners were not rerun because production E4 was not modified. No legacy browser runner was altered.

## Artifacts and reproducibility

P1: 182,784 bytes, SHA-256 `58d0a152639fc54e675bd8aea0188c46f126dab34b3d18f14899fe31b4761da2`. Both original aliases remain 1,047,085 bytes / `8a9b73409a84517f2b0c72c265499434afcf14d94037a645bec553a6b1cba9a3`. No normal production build was regenerated. `scripts/p1/build.mjs` creates only the distinct P1 artifact; static dependency checks and offline browser interaction passed.

Scripts retain the setup/seed definitions, and JSON/log evidence retains observations. New evidence is under `docs/p1/evidence`; no accepted historical evidence was overwritten. The standalone still needs owner Windows Chrome/Edge file-opening tests. P1 is delivered for review, not formally accepted or merged.
