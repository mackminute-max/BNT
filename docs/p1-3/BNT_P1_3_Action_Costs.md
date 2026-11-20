# BNT P1.3 — Action Costs and Resource Ownership

## Existing costs inspected

`src/sim/environment.js:integrateCondition` already integrates pace/load/terrain/weather/endurance/condition beast fatigue, recovery at low exertion, driver strain from exertion/control instability, and chariot wear. `src/sim/consequences.js` already resolves physical impacts, native driver/beast/chariot damage, control changes, attack legality/cooldowns and physical ram contact. Those costs were not replaced or charged again from commentary/Sign events.

## Added opt-in costs

| Executed work | Resource and configured cost | Native authority |
|---|---|---|
| Actual positive acceleration | Each beast: `.08 × positive native Δspeed × (1.5−Endurance/100)` fatigue | `src/sim/race.js:step`, after actual elapsed movement and speed limiting |
| Resolved weapon attempt, hit or defended | Attacking driver: .30 strain | `resolveAttacks`, only after range/control/cooldown checks and native ATTACK |
| Resolved ram steering attempt | Attacking driver: .15 strain | Same validated ATTACK boundary |
| Actual successful ram contact | Initiating beasts: `.35 × (1.5−Endurance/100)` fatigue each | `queueImpact`, actual CONTACT with ram=true |

All resources clamp to 0–100. Rates are validated finite nonnegative configurable values; malformed explicit charge requests reject before mutation. Actual resource deltas—not requested amounts beyond saturation—are recorded. Units are the engine's own native speed/resource scale, not real-world physical units.

Positive speed increase is acceleration/reacceleration work; constant-pace integration remains elapsed-time effort. It does not charge merely for selecting Sprint, queuing a Sign, a failed maneuver, decelerating or standing blocked. Damage/strain/wear consequences of ordinary contact remain native; no flat collision charge was added. No arbitrary lane-change charge was justified by an existing quantitative work measure. If contact/control loss causes actual later acceleration, that actual acceleration is charged once. Chariot wear is not charged as beast fatigue. Weapon effort taxes the driver; it is not invented beast fatigue. Ram steering and physical beast propulsion use different owners and source identities.

## Accounting and replay

`src/sim/action-costs.js` applies resource changes immediately in native simulation and aggregates receipts within the resolved tick. It emits at most one ACTION_EXERTION receipt per actor per tick with actual beast deltas, driver strain, action counts/magnitude and attack/contact source IDs. Receipts do not themselves apply costs. Their consumption by the viewer is read-only. A transient WeakMap collects only current-step accounting; it is flushed before the resolved boundary/checkpoint digest and removed on errors/finally. No future-authoritative state hides outside checkpoints. Repeated flush cannot spend twice.

Native ATTACK/CONTACT source identities distinguish an attempt, its successful contact, and later recovery acceleration. Invalidated attempts and out-of-range/no-target Engage do not create attack charges. No extra opportunity is consumed by an action, refusal or activation. No new persistent resource, injury, equipment durability, economic transaction, recovery rule or combat mechanic was introduced.

## Measurements

Player additional actual clamped fatigue spend, averaged over its beasts; this is a cumulative receipt total, not final fatigue. Pace fatigue and later recovery are separate. Large source counts are physical movement subevents aggregated into receipts, not Sign uses.

| Context | Schedule | Additional beast fatigue | Additional driver strain | Acceleration subevents |
|---|---|---|---|---|
| oval/17 | neutral | 3.4765 | 0.0000 | 1049 |
| oval/17 | sustained-push | 3.0206 | 0.0000 | 722 |
| C01/145 | neutral | 11.3833 | 0.0000 | 5716 |
| rally-long/145 | sustained-push | 1.3715 | 0.0000 | 9955 |

The close-contact native Combat diagnostics in `actions.json` provide explicit source-linked examples:

- Weapon fixture: attacker .30 additional driver strain; approximately .01136 fatigue per beast from actual acceleration, not from the weapon itself.
- Ram fixture: attacker .15 driver strain and approximately .36117 beast fatigue, comprising actual ram contact plus acceleration; the receipt contains both native attack and contact source IDs.
- Unsafe-ram fixture chooses a native weapon action instead: .30 strain. It is not reported as a successful ram.

Main schedule-matrix player costs are acceleration-only: those schedules do not force Engage or guarantee an attack. The separate attack fixtures and browser native Combat interaction test supplement, rather than replace, the multi-racer competition matrix.

## Tests and limitations

Unit tests cover actual positive movement, no cost on queuing, no legacy-cost events, saturation, one-time flush, negative/non-finite rejection, resolved weapon and ram source linkage, invalid/no-target actions, and exact replay/checkpoint restoration. Additional receipts enlarge event histories and therefore increase existing digest cost. They are not animated or narrated every tick; the HUD retains only the latest actor receipt. Measured CPU/event-growth regression is disclosed in Implementation and Delivery. Further digest/worker/tick-scheduling redesign is outside P1.3.
