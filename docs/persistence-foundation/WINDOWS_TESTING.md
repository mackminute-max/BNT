# Windows standalone M0/M1 verification

Copy **only** `dist/Blood_and_Thunder.html` to a Windows folder. Keep its name/location stable during this test. It contains all required code/styles/tracks. No Node installation, commands, server, internet connection or adjacent files are needed to play. The retained `Blood-and-Thunder-Track-Test.html` is identical, but browser storage is not guaranteed to be shared between names/paths.

The managed test browser blocked actual `file://` launch. These steps are the outstanding independent acceptance check for this new file, not a claim already verified on Windows.

1. Turn networking off and double-click the HTML in a modern Chrome or Edge browser. Confirm its address starts with `file:///`. Record browser/version and any errors. Check an ordinary race still starts, pauses/steps and reaches results.
2. Scroll to and expand **Developer tools**, then **Career State / Save Management — M1 foundation**. Existing race configuration/tuning tools remain alongside it. Do not confuse **Export configuration** with **Export complete persistent game state**.
3. Enter names and click **Create empty M1 state**. This creates an empty foundation with 0 Gold, not the future starting stable. If status says **AUTOMATIC**, note the IDs in the read-only metadata panel. Reload the same file and verify the same IDs/revision return automatically.
4. Set treasury change to 100 and enter a reason. Click **Commit developer treasury edit**, confirm, and check revision 1, treasury 100 and persistent **DEVELOPER-EDITED** status. Try −101, a fractional value and a blank value; no change should commit. Reload and verify the accepted edit remains.
5. Click **Export complete persistent game state**. Save `BNT-game-save.json` somewhere outside the browser's storage. A download request is not proof that the file was saved; inspect its existence yourself. The game cannot verify disk durability.
6. Choose that file through **Import game save**. Selection only validates/stages it. Cancel the replacement prompt once and confirm the current state remains intact. Then confirm replacement and verify IDs/fields/provenance survive. Imported Owner Profile/Legacy is replaced in full, never merged.
7. Try a race configuration JSON, malformed JSON or an unsupported-schema game save as an import. Expect an error and the previous career to remain unchanged. Do not hand-edit real backups; use test copies.
8. If browser storage is unavailable, status must show **MANUAL**. Create/import a foundation, export its checkpoint and save the JSON yourself. **I saved this checkpoint** is enabled only after an export request; acknowledge only once you saved that exact file. The edit control then becomes available. Each new manual change requires another export/confirmation. Reloading a manual session requires importing its saved file; it cannot automatically find external downloads.

## Optional controlled failure tests

Use a disposable foundation and export a backup first. Browser storage controls differ; actual storage denial may be induced by browser policy. For a temporary **simulated write denial** in a normal test browser, the Developer Console can run:

```js
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function (key, value) {
  if (key === 'bnt.career.save.v1') throw new DOMException('Test quota denial', 'QuotaExceededError');
  return originalSetItem.call(this, key, value);
};
```

Attempt another developer edit. It must be rolled back, the previous treasury/revision retained and MANUAL mode shown. Export/confirm that checkpoint and retry the edit manually. This is fault injection, not proof the real disk is full. Reloading resets the temporary prototype patch and will reload the last browser checkpoint, **not unsaved manual changes**; export the latest manual state before doing so.

To test corrupt-primary recovery in a disposable state, make at least one accepted developer transaction first, then run:

```js
const key = 'bnt.career.save.v1';
const saved = JSON.parse(localStorage.getItem(key));
saved.primary.digest = '00000000';
localStorage.setItem(key, JSON.stringify(saved));
location.reload();
```

The panel must show **RECOVERY-REQUIRED**, without silently overwriting the bad text. Export the corrupt-save diagnostic if desired. Cancel recovery once, then explicitly confirm **Recover previous valid checkpoint**. Verify the previous treasury/revision/receipts return and developer provenance remains. Recovery does not grant Gold or create a new transaction. If the entire outer JSON or provenance registry is corrupt, recovery may be unavailable: use a valid external backup through explicit import, never an invented replacement.

Use only one active editor/window when Web Locks are unavailable. With two cooperating windows, a stale window's edit must fail rather than overwrite a newer browser save; reload it to inspect the newer state. The exact guarantees of your file-origin browser still need this check.

## Acceptance record

Record: exact artifact SHA-256, Windows/browser version, file address/protocol, networking-off launch/race result, automatic save/reload result, import/export result, injected/manual-denial result if performed, recovery result and any console errors. Test clearing/moving browser data only after making an external backup. No interface acknowledgement proves durable saving or survival of power failure.

Expected artifact: **237,205 bytes**, SHA-256

`e35c4b47647433ce62e1748012ec9c39ca9730012bc667a382f2fdb21cfc1e6c`
