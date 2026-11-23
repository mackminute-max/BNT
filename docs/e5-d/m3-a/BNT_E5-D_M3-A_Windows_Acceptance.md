# BNT E5-D M3-A — Windows Chrome/Edge Acceptance

Owner testing required. This checklist is not a claim that Windows testing occurred. Managed Chromium blocks `file://` with `ERR_BLOCKED_BY_ADMINISTRATOR`; passing HTTP tests do not replace this gate.

## Artifact

Keep the accepted M2 HTML and complete backups. Download **`Blood-and-Thunder-E5-D-M3-A-Playable.html`**, not an earlier artifact. Expected size **2,367,872 bytes**; SHA-256 **`0cdf7c55300ea325f7b207770ded8cb58bfa94ffafa2487a4440643dbb5a7681`**.

```powershell
Get-FileHash .\Blood-and-Thunder-E5-D-M3-A-Playable.html -Algorithm SHA256
(Get-Item .\Blood-and-Thunder-E5-D-M3-A-Playable.html).Length
```

Open directly from disk, separately in Windows Chrome and Edge. No server, adjacent files, content import, fonts or network access should be needed. Use the same browser/profile/path when reopening; browser/file-location storage scopes can differ. Confirm actual backup files exist on disk rather than relying on a download notification.

## Copy and gameplay checks

1. Open global Options by mouse/keyboard. Help & Rules contains six Strategy Signs with activation notes, five weather states, three racing incidents, general incident help and nineteen exact primary/legacy track descriptions. Expand/collapse with keyboard and use Escape/back/focus normally. No native browser popup should appear.
2. Start New Game. The empty-roster explanation belongs only to the unconfirmed draft. Compare all five real packages and their native Gold/assets. The additional text must not replace names, contents or availability. Back/Cancel must create no career; explicit final confirmation must grant once and reach initialized Home Stable without an “empty career” claim.
3. Load another existing career. Names, roster, biographies, offers, equipment, Gold, condition and progress remain unchanged. No identity pack, new ancestry, nation selection or artwork appears.
4. Inspect Roster and Finance. All seven facility descriptions and six service explanations are readable. Workshop/Treatment Ward/Training Grounds do not grant service access. A healthy/ineligible asset remains ineligible; actual staff, cost and discount quotes remain authoritative. Repair and wear refurbishment remain distinct.
5. Inspect short/standard/long contract help against the actual 3/8/16-cycle definitions and native quotes. Expiry warning appears for a real expired-pending-decision contract, not every employee.
6. Select each available championship for inspection, without registration. Description, qualification, fee and frozen schedule agree. Short Oval is not mislabeled Standard Oval; legacy courses remain independent. Unknown/generated courses retain native fallback rather than another track's description.
7. During an actual race, open Options: existing acknowledged pause must stop progression. Inspect current selected Sign/weather help. It must not issue a command, consume an opportunity, activate a queued Sign or add a radio line. Close Options and verify the previous running/paused state, playback speed and queued/active Sign behavior remain intact.
8. Complete an actual race and publish using existing authority. Pending award explanation must not credit Gold. Run/Legacy choice cards explicitly remain placeholders, with no bonus, recovery, unlock or Legacy Points. Only existing final settlement credits earned awards; afterward the result can say credited, without another award on rereading/reload.
9. While a championship or final choice remains active, Finance's lock explanation does not enable treatment, repairs or management. No between-race recovery is introduced by browsing help.
10. Check Career Records and Save & Recovery. Existing schema6 Legacy slots remain three/deferred. Restoration warning distinguishes career-only JSON from complete championship backup. No new save requirements, migration or pack field is introduced.
11. Export a complete backup, verify the file, restore in an empty test browser/profile through existing confirmation, and check the same identities/progress. Also reopen a historical career and test a second independent slot. Do not overwrite your only backup to test errors.
12. Reopen the HTML offline, repeat important help/navigation steps at desktop and narrow-window widths, and verify no missing external resource, duplicated Continue control, script error or persistent career change from browsing.

Record Windows/browser versions, exact artifact SHA, each step's result and screenshots/errors. Any rule/text discrepancy should be returned for review rather than changing catalog values. No M3-B/C/D/main-M3 acceptance is implied.

**STOP — Await owner review and acceptance of E5-D M3-A.**
