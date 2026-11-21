# P2 verification

Run from the repository root. Existing Node, esbuild, Playwright and `/usr/bin/chromium` are required for development. Playing the HTML requires none of them.

1. `node scripts/p2/prepare-references.mjs`
2. `npm run build:p2`
3. `npm test`
4. `node scripts/p2/asset-integrity.mjs` for isolated payload/source corruption and deduplication fixtures; then `node scripts/p2/references.mjs` (12 historical plus 2 payroll captures)
5. `node scripts/p2/native-equivalence.mjs` (six native full races vs frozen P1.4)
6. `node scripts/p1-5/fixtures.mjs` if the frozen 18 benchmark checkpoints are unavailable. This only writes isolated development fixtures, not career data.
7. `node scripts/p2/checkpoint-compat.mjs`
8. `node scripts/p2/browser-native.mjs` (Node/Chromium clock and exact native captures)
9. `node scripts/p2/geometry-browser.mjs`
10. `node scripts/p2/layout-browser.mjs`
11. `node scripts/p2/assets-browser.mjs`
12. `node scripts/p2/durable-browser.mjs` (temporary synthetic career, real coordinator; no owner saves)
13. `node scripts/p2/browser-faults.mjs`
14. `node scripts/p2/art-parity.mjs` (full actual Worker races with baseline/art/fallback variants)
15. `node scripts/p2/legacy-browser-compat.mjs` (original P1–P1.3 browser assertions, explicitly synchronous mode and opened presentation details)
16. `node scripts/p2/browser-performance.mjs` **alone after all other jobs finish**, same checkpoint for each sequential P1.5/P2 window, 1×/2×/4×.
17. `BNT_P2_WORKER_SAMPLE=1 node scripts/p2/browser-performance.mjs` for the separate 12-window controlled native timing sample.
18. `node scripts/p2/summarize-performance.mjs`
19. `node scripts/p2/build-verify.mjs`

Outputs go to `/workspace/deliverables/bnt-p2/evidence`. Browser results are managed Chromium observations, not Windows acceptance. A build is not a direct-file browser test. The file navigation test records the actual managed policy result separately. Browser toolbar zoom and Windows `file://` persistence remain owner checks; CSS zoom and emulated DPR tests do not establish those claims.
