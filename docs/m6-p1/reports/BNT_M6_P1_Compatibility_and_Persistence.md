# Compatibility and persistence

The pre-implementation design is `docs/m6-p1/reports/Compatibility_Design.md`. Mechanical schema remains8, M6 family `m6-career-current-v1`; no old save is automatically migrated.

## Serialized optional visual extension

```json
{"presentation":{"version":1,"drivers":{"immutable-driver-member-id":{"version":1,"ancestryId":"A01","sex":"female"}},"staff":{"owned-or-offer-id":{"version":1,"ancestryId":"A01","sex":"male"}}}}
```

This sits at `state.m6.presentation`, separately from the established envelope presentation sidecar and its immutable M3-B pack pin, radio preference and active-team-v2 selection. Driver entries cover persistent national members, live disposable championship members and current/active Den entrants. Local Den keys bind event+entrant; persistent Den members reuse their national key. Existing owned/market drivers retain `m6.driverVisuals = {id:{version:1,sex}}`; acquisition copies that record rather than rehashing an owned ID.

Existing canonical/authored staff ancestry and sex take precedence. Only missing values use the origin nation's existing ancestry pool, a separate hash domain and immutable source context. No native profile is regenerated or renamed. Staff acquisition preserves that source context. Visual sex is not inferred from names. Neither field affects attributes, wages, prices, generation probability, affinity or progression.

Validation regenerates the exact expected live projection, rejects unknown versions/fields/keys and orphan/contradictory values, and does not trust supplied cache tokens. Failed writes leave both indexes and financial state unchanged. Dismissal/sale and expired-market cleanup remove obsolete references; contract expiry without personnel deletion retains identity. A destroyed chariot remains an owned record under the existing rules.

| Save/source | New P1 reader | Mutation |
|---|---|---|
| Existing unextended M6 | Accepted and returned unchanged | Extension added with a subsequent accepted native operation, not navigation |
| New P1 M6 | Full strict validation | Preserves owner, pack pin, active team, radio and visual records |
| Older M4/M5 families | Existing compatibility paths retained | No M6 conversion/migration added |
| P1 save opened by old M6 executable | Old strict reader does not know the extension and may reject | No support for downgrading to an older executable is claimed |
| Missing/foreign/unsupported presentation data | Unknown or contradictory extended data rejects | Existing bytes preserved on failure |

Full exports/backups serialize complete career state, including the extension. Complete restores and previous-generation recovery retain the existing explicit confirmation, ownership, financial and revision checks. Unfinished race ticks are not included in a between-race save; reopening starts the frozen event again. Existing immutable identity-pack and active-team sidecar rules are unchanged.

## Versioned race behavior

New championships freeze `m6.interactionVersion=3`; their player context uses `version:3`, `interactionRules:"m6-p1-immediate-signs-abilities-v1"`. Old frozen contexts remain version2 with `m6-immediate-signs-abilities-v1`. IDs `catch-breath` and `steady-team` are stable. The old context-v2 fatigue interpretation remains solely to reproduce existing frozen races. The corrected version applies1.25× only to eligible native control recovery, at its native thresholds, for6seconds. Wrecks do not recover; zero clamps and tick expiry remain native. Nine frozen-v2 comparisons and old pending-offer regeneration were compared against the accepted archived runtime.

## Den display data

`den.last.race` is optional version1: venueName, format, backedTeam, accepted odds and at most8 official rows `{id,team,status,place}`. It is strictly validated and replaces only the prior compact last-result display. It contains no simulation history or replay. Fatigue observations are ephemeral `{id,type,time,tick,participants,effects}` packets; they are never authoritative events or persisted records.

The owner-approved emergency correction is documented separately: genuine native recruitment provenance gates a versioned1.00 context; canonical ancestry/sex are portrait-only. Optional protected `m6.emergencyRecruitments` version1 retains new birth facts through release/backup and cannot be dropped by publication/import. Native legacy emergency contracts are recognized without fabricating historical receipts. No other driver gains this exception.
