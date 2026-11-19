# BNT M2-E E4 Windows offline acceptance — deferred checklist

**E4 is not implemented. These feature tests cannot pass against the current E3 reference artifact.** Use this checklist only after the architecture gate and actual E4 implementation/build. No Windows acceptance is claimed by Codex.

1. Back up real saves and use an isolated test browser profile. Record Windows/browser versions and the supplied new HTML SHA256; copy the single HTML locally, disconnect the network and double-click it.
2. Verify standalone racing/workbench and legacy career JSON compatibility. Create a test championship without changing the approved fee/rules/registered RU.
3. Exercise automatic play at several speeds, pause and step. Confirm durable tick/checkpoint indicators, source identity and input ordering; rendering rate must not change checkpoint semantics or results.
4. Queue pre-race/closed-loop/Rally Signs near a checkpoint. Close the browser, reopen the same file/profile and use the validated resume action. Confirm queued/active Sign and remaining opportunities exactly.
5. Repeat interruption during birth, before native clearance, after native prepare and after official publication/lost acknowledgment using the approved fault-test harness. Confirm result/condition/points/entitlement effects once; no reroll or extra fee.
6. Export a complete active championship backup, physically confirm the file exists, then import into another isolated profile with explicit replacement confirmation. Resume and compare the supplied deterministic checksum. Career-only and complete files must be clearly distinguished; missing/corrupt required sessions must reject.
7. Test a completed-but-unsettled backup and interrupted/partial restore. Verify that mixed preparation is never displayed as a successful restore and unrelated data is not silently overwritten.
8. Run approved full-field/long-schedule and large Combat Rally fixtures. Inspect encoded sizes, quota warnings, denial/retry and blocked recovery. Never delete journals, wrecks or protected history to force completion.
9. Complete the schedule. SETTLEMENT_PENDING must remain locked; no E5 Gold/XP/reputation/trophy or payroll/recovery effect.
10. Record screenshots/logs, artifact hash, observed failures and explicit owner acceptance or rejection. A browser download is not proof of durable external storage.

Current unchanged E3 reference:553640 bytes, SHA256 `3de9bb977a50022f0bf9488b3922129aa09ee819f03e402638c4f68795d35a65`. Its previous owner acceptance does not accept future E4 changes. Current managed file:// testing was denied, not passed.
