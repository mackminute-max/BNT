# P1.5 evidence index

Application runtime: `5d556f3adca146a6c17996234e34dcf4e98899db`.

- `full-node-final.log` / `full-node-final-exit.json`: final 630/630, process exit 0. Earlier `full-node` files are the preceding 629-test revision.
- `native-equivalence.json`: six complete frozen-P1.4/Worker comparisons, full replay signatures and exact outcomes.
- `checkpoint-compat.json`: 18 exact old/new checkpoint wires plus restored continuations.
- `references.json`, `tactical-references.json`, `prior-profile-parity/repeats.json`, `combat-equivalence.json`: preserved reference proofs. Inputs are copied originals, never regenerated expected values.
- `performance-final.json`: final 162-window matrix, measurement revision 636e5d3. `performance-windows.json` is an earlier development dataset with a disclosed initial-checkpoint lead counter defect; do not mix it into final bounds.
- `sustained.json`: complete P1.4 reference / intermediate P1.5 Worker / sync runs. `sustained-final-worker.json` is f36edc6; `sustained-underrun-trace-final.json` is final 5d556f3, with read-only hold/clearance tracing.
- `sustained-interim-completion-metrics-bug.json`: intentionally stopped intermediate probe, not a passing final race set.
- `browser-native.json`, `browser-smoke.json`, `browser-faults.json`, `compat-p*/browser.json`: actual browser evidence. Direct-file navigation is explicitly unavailable, not passed.
- `*-exit.json`: exact commands, raw process exit, source revision, environment overrides and elapsed correctness-test time. Files retain initial harness failures as well as successful reruns; use the reports to distinguish them.
- `artifact-verification.json`: two identical builds, dependency guard, final HTML SHA-256 and unchanged P1.4 artifact.
- `fixture-index.json` / `fixture-manifest.json`: the 18 deterministic native checkpoint inputs. Full originals remain in workspace `deliverables/bnt-p1-5/evidence/fixtures`; regenerate with `node scripts/p1-5/fixtures.mjs` and verify hashes. Repeated full graphs are not duplicated into Git.

Reference reconstruction in a fresh environment: create an empty `/tmp/bnt-p15-reference`, extract `git archive 3b0d043d0ca3b8e06bd0894ebff37d89be76e97e` into it, and make the existing development dependencies available. No dependency or server is needed to play the delivered HTML. Benchmarks require the existing development environment, Chromium and a localhost test server created by each script.

No accepted historical evidence outside this directory was overwritten. Performance runs were separate from concurrent correctness verification. Correctness-test elapsed time is not a controlled performance benchmark.
