# P2 evidence ledger

Runtime commit ec25d77eea6523edba1cb1920d73c0dc7502b8c3; prior P1.5 delivery04df5ef. See commands-and-exits.json for raw process exits and BNT_P2_Test_Evidence.md for disposition. Frozen-node.log is the final674/674 run after runtime commit. Baseline-node.log is630/630.

Performance windows are sequential and separate from concurrent correctness diagnostics. performance-summary.json validates108 cases and bounded caches. worker-timing-windows.json separately records12 late-stage cases using existing native timing packets. Both produced exit0. Approximate heap/cache figures are not private Worker/GPU measurements.

Early failed/canceled diagnostics are intentionally retained. art-parity.log contains an interrupted earlier invocation trace as well as successful output; art-parity.json records8 successful ordinary viewer races. Final-artifact authority evidence is art-parity-fast.json,12 complete Worker races with identical replay hashes across art states. Legacy-browser-compat-final.log exits1 only because P1.1 expects old zoom6 rather than P2 zoom8; its other child scripts exit0. Do not call all browser scripts green.

Windows direct-file navigation is blocked by the managed environment, not tested successfully. DPR/CSS zoom tests do not establish browser toolbar zoom. The accompanying Windows checklist remains pending owner execution.

Native fixtures can be regenerated with existing scripts/p1-5/fixtures.mjs; no accepted golden or owner career was changed. scripts/p2/prepare-references.mjs recreates immutable historical source/HTML references without checking out this tree. Asset integrity fixtures use a temporary directory and remove only their own temporary copies.
