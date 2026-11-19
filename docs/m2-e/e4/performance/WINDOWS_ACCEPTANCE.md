# M2-E4 optimized runtime — Windows offline acceptance

This is the new complete E4 artifact, not the already accepted Stage 1 proof. Owner acceptance of this build is still required. Managed Chromium HTTP tests do not establish Windows direct-file behavior.

HTML: **1,047,085 bytes**, SHA-256 `8a9b73409a84517f2b0c72c265499434afcf14d94037a645bec553a6b1cba9a3`.

Runtime revision: `b8c090057052ac03bbed73d9487093da61381451`.

1. Back up the current HTML and career JSON. Keep the new HTML in a permanent folder; moving/renaming it may change browser file-origin storage behavior. Use a normal supported Windows browser profile, not private browsing.
2. Double-click `dist/Blood-and-Thunder-Track-Test.html` (identical to `dist/Blood_and_Thunder.html`). The address must begin `file:///`. Disconnect networking and confirm the game loads without missing assets.
3. Open Developer / Career State and Save Management / **E4 durable championship persistence**. For an existing accepted E3 career, choose **Move this career and sessions to IndexedDB** and confirm. Original Web Storage bytes remain historical. Never delete browser storage while a championship is in progress.
4. Confirm **IndexedDB generation** is displayed. Refresh or close/reopen the browser and confirm it still uses IndexedDB. It must not silently reopen the older Web Storage career.
5. If preparing an eligible existing stable, use the retained stable tools first. Enable the accepted E3 controller, refresh development offers, inspect the disclosed schedule/entry fee, and confirm registration. These remain development templates; E6 content is not included.
6. Click **Start next race manually**. Set checkpoint cadence (default 100 simulation ticks), speed, and save settings. Click **Resume playback**. Confirm progress shows pending work and then a committed durable tick. A displayed durable frame is already committed; pending work has not been acknowledged.
7. Pause, queue a Strategy Sign, resume, pause again and note the durable tick/input watermark. Close the browser completely, reopen the same HTML/profile, and verify the durable tick, queued/active Sign and remaining uses. Resume explicitly. Repeat at a different playback speed; speed must not change race results or activation boundaries.
8. After native processing ends, explicitly validate clearance/publish. Inspect the official result, persistent condition and standings. Start the next event manually. Intermission must not heal or repair assets or apply payroll.
9. Export **Complete championship backup** during an active paused race. Verify an actual JSON file exists on disk; a download request alone does not prove this. Also inspect the distinct **Career-only JSON copy** warning: it cannot resume the external session by itself.
10. On the same career (or an empty separate browser profile), select the complete backup, confirm replacement, and verify the exact durable race resumes. An unrelated existing career must be rejected. An older backup that would remove acknowledged inputs or protected history must be rejected. Keep the original backup until resumed gameplay is verified.
11. If restoration is interrupted after staging, reopen and use **Resume staged restore**. Until activation succeeds, the old generation must remain authoritative. A failed write must not be described as a successful restore. If storage is denied/full, free space or preserve an external backup and retry; do not clear authority or reroll.
12. Test worker restart with the supplied button while paused. If session data is missing/corrupt, expect an explicit recovery block; use only exact-byte provable checkpoint repair or a matching complete backup. No automatic restart, forced DNF or obstacle deletion is provided.
13. Finish the schedule. Expect **SETTLEMENT_PENDING**, retained official results and pending entitlements. Gold, XP, reputation, trophies and M2-D championship settlement are intentionally not credited. Management and second registration stay locked.

Record Windows version, browser/version, HTML SHA-256, file path, checkpoint ticks/input watermarks, backup size, any errors, and whether closure/reopen, restore and offline play passed. Do not include private career files in public bug reports unless intended.

The new build embeds both application and worker. No Node installation, local server, adjacent JavaScript file or network service is required. Browser storage is quota-limited and is not a permanent external backup.

Cross-runtime caution: the long seed-145 Rally already has different Node and Chromium checksums in the accepted baseline. Resume and restore must validate native evidence; an incompatible browser/runtime must reject instead of rerolling. Start with restore in the same browser/profile, and report any cross-browser refusal separately.

Performance acceptance: record the time from requested advance to durable acknowledgment for an eight-entrant race at early and late ticks, and for backup/restore after several events. Do not interpret worker activity as a durable save. Large historical saves can still take seconds. Check visual responsiveness and report any stalls; the <50 ms main-thread target is not universally achieved in managed measurements.
