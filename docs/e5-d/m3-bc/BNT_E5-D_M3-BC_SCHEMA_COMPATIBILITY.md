# M3-BC presentation envelope contract (design frozen before implementation)

Mechanical career schemas and commands remain unchanged. Unmarked envelopes continue to serialize as envelope v1. Explicit new creation or radio opt-in uses envelope v2, retaining all v1 fields plus `presentation: {value, digest}` sealed with the existing corruption checksum.

The sealed value has exactly:

```json
{"kind":"BNT-career-presentation","version":1,"profileId":"profile-id","careerId":"career-id","revision":1,"cohort":"m3-bc","identityPack":null,"radio":{"version":1,"enabled":true}}
```

`cohort` is `m3-bc` for new explicit v2 creation, `legacy` for explicit opt-in/out on an old career. `identityPack` is null or exactly `{version:"m3-b-identities-v1",digest:"<SHA-256 of pinned compiled identity data>"}`. Only new creation may set a non-null pin, after the original native package initialization succeeds in isolated memory. Legacy cohort cannot have a pin. Pin/cohort/ownership are immutable; radio is independent and mutable, requiring expected sidecar revision and full career storage/generation checks. A preference change increments only sidecar revision, not mechanical revisions or financial receipts. Unsupported fields/versions/digests reject. Checksums diagnose corruption, not malicious editing.

## Compatibility and rollback matrix

| Source → target | Behavior |
|---|---|
| v2 save opened in an older Main M3 build | Older code rejects the unsupported envelope rather than reading it. Retain original v1 backups for old-build rollback; no down-conversion is provided. |
| envelope v1 cold open/export | Read unchanged; no write or inferred cohort/default. Native identities/radio. |
| new v2 creation | B default OFF with explicit opt-in; radio ON. Initial grant unchanged. Activation includes sidecar atomically. |
| v1 explicit radio setting | Explicit v2 activation, legacy cohort, B null, selected radio state. |
| v2 ordinary mechanical command | Preserve sidecar exactly, including all migrations and export paths. |
| career-only JSON / complete backup | Retain full sealed sidecar inside the career record. Complete format stays v1. |
| same-career import/complete restore | Require equal immutable identity, incoming presentation revision >= loaded revision; equal revision requires byte-equivalent sidecar. Reject old unmarked or contradictory pin, stale preference and foreign ownership. |
| older backup into empty destination | Full validated original identity can load; no external cross-device rollback knowledge is claimed. |
| old checkpoint recovery within v2 envelope | Keep envelope-level current sidecar; require matching career/profile on valid recovered checkpoint. No pin or preference rollback. |
| v2 → v1 downgrade/older unmarked same-career backup | Reject without modification; no implicit merge of incompatible checkpoints. |
| corrupt sidecar / unsupported version | Block envelope; preserve bytes. Never infer pin from branding or reconstruct missing cosmetics. |
| failed/stale write or interrupted creation | Existing atomic CareerStore/IndexedDB activation and read-set checks; no acknowledged partial sidecar/grant. |

Each valid primary/recovery checkpoint under a sidecar must belong to its profile/career. The envelope-level sidecar intentionally does not rewind with a mechanical recovery checkpoint. Complete previous generations retain their own exact envelopes, but activation applies the same monotonic compatibility checks. An unrelated marked career cannot overwrite an existing marked career; use the existing empty-slot import workflow.

Native reporter is unchanged. C uses only accepted emitted lines and their same-batch originating events, retains line identity/time/type/order, selects ordinary variants with native hash(eventId + ':' + type) modulo frozen alternate variant count, and uses the fixed resistance sentence. Typed missing context falls back to the existing line. No gameplay RNG, stored narrative, reporter throttle or buffered timing changes.
