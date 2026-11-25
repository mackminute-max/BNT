# M6 persistence design — checkpoint 1

M6 is a new isolated save family; there is no M5 conversion or fallback. Schema8 is a separately validated authoritative current state, not a shortened schema7 save. Native reducers remain the only producers of existing economic, condition, payroll, standings and reward effects. Empty legacy adapter fields are explicitly constrained and carry no historical authority.

Persist current assets/ownership, native condition/injury/integrity, contracts, unpaid obligations, Gold/LP conservation totals, permanent upgrade ownership, current national boards/rivals, active championship and pending choices, compact completed-championship facts and significant milestones. Keep at most64 exact recent command acknowledgments. Absolute revisions and monotonic instance/closed-instance sequence prevent replay of evicted requests. Native detailed evidence exists only while necessary for the active championship; after successful settlement and final choice, atomically retain compact facts and remove finished instance/session references. GC follows durable activation, and previous recovery root remains reachable.

A versioned M6 envelope seals the current schema8 state and presentation sidecar. Existing strict IndexedDB root/CAS/clock/previous-generation/restore machinery is reused beneath the new family with explicit M6 ownership dispatch. Worker preparation never acknowledges durability. Same seeded race restart remains in-memory and does not save ordinary ticks or inputs. Full backup includes current/previous required authority; foreign, unsupported, corrupt or stale authority rejects before activation.

Owner identity: version1, canonical nationality N1–N8, ancestry A01–A13, sex male/female, ordinary starting nation. Owner sex/ancestry are visual-only. Driver visual sex is separate, versioned metadata (male/female/unspecified), with a separate deterministic identity domain. These fields do not enter mechanical generation or race/odds RNG seeds.

Sundaran clarification: retain Iron Gauntlet economics/strength, replace Bannerfall trophy requirement with authoritative victories in all seven ordinary national Prestige Championships. No fabricated Bannerfall trophy, Reputation unlock or repeatable final.

This document records the design before implementation; completed proof and limitations will be reported separately.
