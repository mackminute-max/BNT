# BNT — P1.2 Interaction Presentation

Branch `feat/p1-2-competitive-feedback`; baseline `74d7e73458fc01abc43cfb8f193832c04a3b3b9b` (P1.1 runtime `fce3ae7e87ba4a6c3b0877431c6c890fe5ee0287`). Implementation `53a0e4b122010ce44fee820a4b66e80cab060169`. No merge, push, release or deployment.

## Native evidence to presentation mapping

New `src/prototype/interactions.js` projects existing events. No native event schema was changed. `src/prototype/view.js` draws the projections after the native course/RU view. Radio commentary consumes the same original native stream independently.

| Native event | Visual / text | Meaning and limits |
|---|---|---|
| CONTACT | Amber CONTACT ring | Contact observed; does not assert damage. Native contactId retained. |
| DAMAGE with positive finite amount | Red amount/component flash | Exact native amount; no inferred injury severity or invented damage. |
| ATTACK success=true | HIT plus attacker→defender link | Actual native successful contest; physical damage still comes from DAMAGE. |
| ATTACK success=false, reacted=true | DEFENDED | Actual defense/reacted evidence. |
| ATTACK success=false, reacted=false | ATTACK RESISTED | Does not fabricate a literal miss subtype absent from the native event. |
| ATTACK_INVALIDATED | ATTACK NOT EXECUTED | Native execution invalidated; reason retained; not a completed attack. |
| WRECK_IMPACT | WRECK IMPACT warning | Actual source event only. |
| CONTROL_CHANGED | Control status / restored label | Exact recorded control state, no invented penalty. |

Effects follow the correct current RU identity. Existing contact events do not contain an exact historical world impulse normal/position, so no fake force-direction arrow is drawn. Attack links use actual attacker/defender identities at their current rendered positions, not an independently calculated hit. Effects do not mutate race state or consume RNG.

## Bounded playback handling

Every newly emitted native event is scanned once using a cursor, including multiple ticks between frames. Defaults: at most 128 pending projections, 12 visible effects, 900 ms presentation lifetime. Overflow/old paused backlog is explicitly summarized in the status/counts; the complete native history and radio are not deleted. Extreme bursts may be summarized rather than individually flashed; this is disclosed, not silent event loss.

Effect age uses presentation time only while playing. Pausing freezes visible effects. A single step prioritizes newly produced interactions; resuming does not rescan old native events. Restart creates a fresh cursor/feed. The bounded actor maps contain native race participants. Effects are secondary to track/units, with restrained colored rings, short labels and targeted attack links.

## Strategy Sign feedback

The existing controls/budget/activation system is untouched. The panel separately shows queued instruction, active instruction, current native pace and recorded decisions. Engage Rivals without a recent own attack says **Seeking Opportunity**. It only reports HIT/DEFENDED/RESISTED after a native attack by that player; incoming hits do not become a claimed player attack. Pre-activation attacks are excluded, and retired/finished RUs report that no further tactical actions are possible. Queuing alone cannot produce combat feedback.

Other Signs display actual current pace and explicitly labeled recorded decision/tick; an instruction is not falsely described as guaranteed compliance. No new target-selection mechanic, refund or additional Sign was introduced.

## Viewer/performance work

Static travel-arrow geometry is cached with the existing immutable track paths. Standings reuse rows/cells rather than replace all table DOM every tick. Expensive diagnostic text is refreshed only when its panel is open; opening it requests an immediate view refresh. Main camera, fatigue gauge, map, course selection, commentary and native controls are retained. Timing/queue counters are diagnostic presentation data, not persistence or race authority.

## Validation

Projection tests cover hit/defense/invalidated/contact/damage, no action from proximity/AI selection, bounded overflow, paused age, single-step priority and stream reset. A real native combat fixture drives the projections without changing its digest. Browser tests observed a real HIT and actual damage, correct solo Seeking Opportunity, 4×/pause/step behavior, reset, accurate fatigue, no JavaScript errors and no runtime network requests. Windows direct-file acceptance remains outstanding.
