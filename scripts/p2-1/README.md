# P2.1 local verification

Run from repository root using the existing Node/esbuild/Playwright development dependencies and `/usr/bin/chromium`. No packages are required to play the finished HTML.

- `npm run build:p2-1`: new standalone only; does not overwrite P2/P1.5 or the E4 companion.
- `npm test`: entire configured suite, including P2.1 model tests.
- `node scripts/p2-1/interface-browser.mjs`: real UI/Worker countdown hold, state/Sign/profile/navigation/radio/portrait/reduced-motion and comparison-reset tests.
- `node scripts/p2-1/smoke.mjs`:1440/1024/768/390px layout and desktop six-card row.
- `node scripts/p2-1/keyboard.mjs`: focus, internal navigation, local Sign selection and original Queue acceptance.
- `node scripts/p2-1/browser-faults.mjs`: Native Worker failure, fallback, delayed Signs, offline operation and actual file-navigation attempt.
- `node scripts/p2-1/references.mjs`, `native-equivalence.mjs`, `checkpoint-compat.mjs`, `browser-native.mjs`: protected replay/native/checkpoint/clock regressions. Frozen P1.4 source must be available at `/tmp/bnt-p15-reference`; reconstruct with `git archive 3b0d043 src package.json` in that disposable reference directory if absent. No source checkout/migration is needed.
- `node scripts/p2-1/art-parity-fast.mjs`:12 complete actual Worker race/replay comparisons. Historical P1.5 HTML reference is `/workspace/deliverables/bnt-p2/evidence/baseline/P1.5-reference.html`, recoverable from `git show 04df5ef:dist/Blood-and-Thunder-P1.5-Playable.html`.
- `node scripts/p2-1/assets-browser.mjs`, `geometry-browser.mjs`: reused P2 cache/fallback/DPR/native-geometry checks adapted to P2.1.
- `node scripts/p2-1/durable-browser.mjs`: unchanged accepted P2 companion, isolated disposable synthetic career, actual committed-frame authority. Never use owner saves for this harness.
- `node scripts/p2-1/legacy-browser-compat.mjs`: original legacy assertions, sync mode and both internal views exposed only by the wrapper. Expected aggregate exit1 at P1.1's obsolete zoom6 assertion; P1/P1.2/P1.3 child exits0. Actual player navigation is tested separately.
- `node scripts/p2-1/performance.mjs`: bounded12-window regression only, accepted P2 versus P2.1, C01 and Long Rally Combat8, three phases,4x. Run **alone after correctness jobs finish**. Existing native benchmark checkpoints are in `/workspace/deliverables/bnt-p1-5/evidence/fixtures`, reproducible with `node scripts/p1-5/fixtures.mjs` (writes only isolated diagnostic fixtures).
- `node scripts/p2-1/build-verify.mjs`: reproducibility, identical embedded Worker, protected-source diff and accepted-artifact byte preservation.

Outputs go to `/workspace/deliverables/bnt-p2-1/evidence`. These are managed Chromium tests; `file://` may be blocked by environment policy. Windows owner acceptance of the new file remains separate. No replay golden, save schema, protected record, original test or runtime dependency is changed by these harnesses.
