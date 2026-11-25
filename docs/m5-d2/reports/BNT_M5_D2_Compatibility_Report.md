# Delivery 2 compatibility and affinity

Candidate: `Blood-and-Thunder-M5-D2-Playable.html` — **5,529,570 bytes**, SHA-256 `b1feae08d6af7ade30d2502d6c6a5daf12ac79a0172cdf59d220586a6c3fa30f`.

Branch `feat/e5-d-m1-startup-slots-options`, repository HEAD `6f01da6d9cc0a79fecf9d38cd55989e17fb2651c`. The accepted D1 source was an uncommitted candidate, verified against all 113 supplied manifest entries before editing. No implementation commit exists; the source manifest identifies this delivery. No commit, merge, push, release or deployment performed. Existing M4 and D1 HTML hashes remain unchanged. Owner Windows acceptance is pending.

## Formula mapping

Canonical ancestry IDs A01–A13 and beast species B01–B09 come from the owner matrix. Two distinct owned beasts must share species; bloodline, quality and temperament may differ. Nine same-species types are legal, 36 unordered mixed types illegal, all81 ordered combinations tested. Mismatched ancestry affinity is legal.

Let `f` be1.05 for primary,1.0 for neutral Horse,0.95 for other non-primary pairings. After existing native condition/equipment/upgrade-derived RU calculation, `applyAffinity` applies one independent factor to maximum speed, acceleration (native acceleration-limit clamp), handling and control (0–100 clamps), braking and lateral handling. It does not feed the adjusted handling/control back into other targets. Existing payroll-control application follows this stage. Base attributes, personality, combat, awareness, nerve, mass, load, recovery, structural durability and equipment records are untouched.

Stamina efficiency means expenditure is divided by `f`. Actual continuous beast-fatigue generation and discrete action-fatigue costs receive one division each at their existing expense hooks. Recovery, driver strain and chariot wear do not. Native derived `fatigueRate` is also represented as divided by `f` for the derived preview; no simulation consumer uses it a second time. Tests prove actual continuous/action expenses, not just display numbers. No new driver-fatigue coefficient or recovery rule.

All entrants receive frozen contexts. The existing no-context branch returns the original derived object and retains old checksum behavior. Context is in race setup and live state; checkpoint protocol `m5-race-state-v3` is used only with affinity. Earlier v1/v2 checkpoints retain existing readers and behavior. New v1 affinity references are additional candidate fixtures, never replacements for historical goldens.

## Save compatibility matrix

| Input / operation | D2 behavior |
| --- | --- |
| New D2 career | Schema7 current envelope + m5.d2 version1, content/compatibility pin, independent database namespace |
| Accepted D1 / M4 existing career | Preserved in original storage and playable HTML; no silent migration or reclassification |
| D1 backup in D2 build | Explicit incompatible-family rejection; no partial activation |
| D2 complete backup / restore | Existing complete container, protected history, native sessions, presentation and pinned D2 extension preserved |
| Career-only export | Existing complete-M5 export behavior retained; cannot silently omit protected pages/session authority |
| Older / corrupt / foreign authority | Existing monotonic revision, prior-generation confirmation, ownership, integrity and collision checks remain |
| Already registered championship | Frozen team, setup, conditions, terms and pin never silently changed by Barn/Market choices |
| Historical races | No recalculation or reference edits |


## Extension and persistence schema

`m5.d2` has exactly: `version:1`, immutable `pin`, integer `opportunityEpoch` synchronized with Home `marketEpoch`, `regional:null|record`, and `tierWins` by approved ordinary native economic context. A regional record has exactly version/pin, instance/event/host/region IDs, immutable native offers and identities, consumed IDs, source result fingerprint and frozen name reservations. Cold validation reconstructs the original stock, verifies its source and rejects unsupported or contradictory state.

Active championships retain versioned `m5Competition`, host nation list, resolved event/venue disclosures, local birth profiles, explicit `economicContextId`, per-entrant canonical identity and affinity context. Native checkpoint validation checks affinity against frozen setup. Protected archive pages retain the full named competition/entrant/result/condition/settlement facts; compact current indexes do not replace those pages.

D1 current-state tail128, record8MiB, complete backup256MiB, root reference2001, restore receipt2000 and registration guard2MiB remain unchanged. Presentation sidecar-v2 and immutable recruitment pack pins remain supported. The transport protocol changes only ephemeral messages for this build; all durable record formats and authoritative read-set CAS remain.

## Known boundaries

No converter is provided. D2 cannot be used to continue a D1 active championship; preserve/use D1 HTML. This follows the owner-approved isolated-development-save option. Browser origin/file-path storage availability remains browser-controlled; keep complete backups before moving files. Managed Linux tests do not establish Windows file-origin portability. No gameplay behavior outside the approved compatibility/affinity and generated content integration is changed.
