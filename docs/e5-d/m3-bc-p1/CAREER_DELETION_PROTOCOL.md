# Career deletion protocol

A confirmed deletion requires a fresh validated slot/profile/career/generation selection and the existing writer lock. The selected slot's IndexedDB authority is cleared in one strict transaction. A small `deleted-career` marker plus an empty advanced-generation head remain, so new readers forbid legacy fallback and both new and older stale writers fail their generation/read-set checks.

Only that database is cleared. No other slot/database, shared configuration or unrelated profile is traversed for deletion. Current profiles and Legacy ownership are embedded in individual careers; no shared Owner Legacy database exists in this source. This change does not introduce a new account/profile store or merge Legacy. Every other stored profile/Legacy copy remains unchanged.

For the legacy slot, only its validated career key, matching profile/career race-session keys and its own discovery witness are removed. Unrelated Web Storage keys remain. Unknown ownership or corruption is rejected rather than guessed.

The catalog entry is removed only after authority retirement and legacy cleanup commit. Cross-database writes are not claimed atomic. If cleanup/index removal fails after retirement, the slot is quarantined as “Finish deleting career”; its marker permits an idempotent, ownership-checked retry. It is never advertised as playable or successfully deleted before this completes. A failed retirement transaction leaves the original authority intact.

Deleting the active slot first pauses through the existing Options barrier, then returns to title after successful deletion. Other careers remain available. External backups are not deleted; restoring one intentionally uses an empty destination, not a stale write to the retired database.
