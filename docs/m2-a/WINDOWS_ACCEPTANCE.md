# Windows review checklist — M2-A only

The canonical [Blood_and_Thunder.html](../../dist/Blood_and_Thunder.html) is a single self-contained file. Copy it to Windows and double-click it in a modern Chrome/Edge browser, with networking disabled. No Node, server, install or adjacent file is required to play. Keep its path/name stable during storage tests. Export a real career backup first; use disposable review data when injecting corruption.

**Managed Chromium blocked actual `file://` execution. These are outstanding owner checks, not previously verified Windows results.** Expected file: **267562 bytes**, SHA-256:

`0f91c4f04616387933eb6485eb542bb6344713319a8a6980b7abaa9aba747a11`

## 1. Preserve and inspect M1

1. Confirm the address is `file:///...`, and ordinary racing/pausing/results still function offline.
2. Expand **Developer tools → Career State / Save Management**. The existing tuning/configuration/replay controls remain available.
3. If your existing M1 profile loads, export its complete persistent state **before migration**. Save the JSON yourself. If testing a fresh file, use **Create empty M1 state** to create a disposable compatibility fixture, not a starter stable.
4. Record profile/career IDs, treasury, gameplay revision, developer-edited status and optional pending checkpoint. For an edited case, commit an explicit developer treasury adjustment with a reason and export the new M1 checkpoint. A clean migration must not become developer-edited merely from schema upgrade.
5. Reload: schema 1 should still load without silently migrating or creating assets. The existing developer **Export configuration** is a different file type and does not include the career.

## 2. Explicit migration and review

1. Click **Migrate loaded M1 to schema 2 (M2-A)**. Cancel once; data and stored checkpoint must remain unchanged.
2. Confirm migration. Check **Schema 2**, unchanged gameplay revision/Gold/IDs/receipts/provenance/pending record, maintenance revision 1, and `management.initialized:false` in the readonly metadata. All 16 management registries should be empty.
3. No Gold, starting package, personnel, beasts, chariot, facility, achievement or progress should appear. There is no initialization button or playable management loop in this stage.
4. Export the upgraded JSON and inspect its primary schema-2 state, old schema-1 recovery checkpoint, sealed protectedHistory and maintenanceClock. Reload the same HTML and verify they remain.
5. Open the **M2-A protected history / compaction preview**. It must show P0/P1/P2 descriptions and `canCompact:false`, with no removal/summary execution. Reopening it must not advance revision or alter finances.

## 3. Import, developer transaction and manual fallback

1. A developer treasury edit after migration should produce a versioned request with a separate effect ID and expected gameplay/maintenance revisions. The ordinary gameplay revision advances once; maintenance does not advance just for the financial edit. No invalid/negative/fractional/blank adjustment should apply.
2. Importing a valid schema-2 JSON is staged, then requires confirmation. Cancelling or selecting an invalid/wrong-type/future-schema file must preserve the current career.
3. Import an older M1 backup while schema 2 is active. **Upgrade schema-1 file on confirmed import** is selected and explained. If unchecked, downgrade must fail without changing data. If checked/confirmed, the backup is migrated without grants; known developer/protected identities are retained. Replacing loaded state can advance maintenance while restoring its saved gameplay revision/treasury deliberately.
4. With browser storage denied/unavailable, verify **MANUAL** mode. Export the checkpoint, save the file and use **I saved this checkpoint** before another change. Download alone must not remove the gate. Reload manual mode and explicitly import the saved file; further valid edits should work after the required export/acknowledgement.
5. For optional temporary quota fault injection, use the [M1 Windows instructions](../persistence-foundation/WINDOWS_TESTING.md). A failed write must roll back the attempted change before switching to manual. Export/ack and explicit retry are required; no automatic replay of a failed financial action.

## 4. Recovery test on disposable data

After preserving an external backup, optionally corrupt only the primary seal through Developer Console:

```js
const key = 'bnt.career.save.v1';
const envelope = JSON.parse(localStorage.getItem(key));
envelope.primary.digest = '00000000';
localStorage.setItem(key, JSON.stringify(envelope));
location.reload();
```

Expect **RECOVERY-REQUIRED**, original corrupt text retained for diagnostic export, and no automatic overwrite. Cancel once, then confirm **Recover previous valid checkpoint**. A retained M1 recovery checkpoint must be upgraded back to schema 2 explicitly; it must not silently downgrade the file, even if no transactions existed. The restored gameplay revision/treasury are the previous checkpoint's values, maintenance advances beyond the saved clock, and known provenance/protected identities remain. No invented reward or transaction appears.

If the complete transport, provenance registry, protected registry or clock is corrupt, recovery may be unavailable; import a validated external backup explicitly. Do not hand-edit version fields to force old checkpoint execution. Pending race records are inert; M2-A does not launch/resume them.

## Acceptance notes

Record Windows/browser version, exact artifact hash, file protocol, networking-off race result, clean/edited migration, reload/export/import, injected/manual storage behavior, recovery and any console errors. Use one active writer when Web Locks are unavailable. Browser storage can be erased, denied or change after moving/renaming the HTML; a download request/user acknowledgement does not prove durable saving.

M2-B–E and full M2 acceptance are outside this review. Missing detailed 3.59–3.62 specifications should be provided before approving later-stage domain implementation.
