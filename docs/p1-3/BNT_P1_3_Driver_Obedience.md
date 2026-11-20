# BNT P1.3 — Driver Obedience

## Source and priority

`src/ai/directives.js:paceDirective` is an opt-in deterministic policy. `src/ai/driver.js:decide` invokes it after native candidate generation and before execution-error processing. `src/ai/telemetry.js` maps the same decision and physical outcomes into compliance. Legacy configurations never enter the policy. Configuration version is `p1.3-tactical-v1`; directive metadata version `p1.3-directives-v1`.

1. Existing mandatory physical/legal restrictions remain authoritative.
2. Active Push requests Sprint; active Conserve requests Conserve.
3. Exceptional trait-gated independence may select another native pace.
4. Otherwise ordinary utility/coaching cannot overrule the pace directive.

Push does not add speed directly. It selects the native Sprint action; native acceleration, impairment, corners, blocking, collision, control loss and retirement decide what actually happens. For an obedient Sprint, voluntary yield/disengage cannot quietly overwrite the requested pace; the best other existing positioning candidate is used. Physical path blocking and control processing remain native. Queued Signs have no authority until native activation. Existing execution/stress failures remain possible and explicitly diagnosed.

| Existing Sign | P1.3 policy |
|---|---|
| Push the Pace | Binding Sprint request, subject to the hierarchy |
| Conserve Strength | Binding Conserve request, same hierarchy |
| Engage Rivals | Existing attack/opportunity utilities, range, control and cooldown checks |
| Seek Open Track | Existing positioning utility; no blanket Sprint override |
| Hold Position | Existing holding/lane behavior; no blanket pace override |
| Race Defensively | Existing defensive utilities; no blanket pace override |

Starting signal, next closed-loop start/finish crossing and category-specific Rally Sign Points are unchanged. Queue/replace still spends an opportunity; activation spends none. Cancel/lower do not create refunds. Default budget remains three. All six native Signs remain available under their original format/eligibility rules.

## Existing traits and exceptional refusal

No trait, random draw, independent RNG or mutable personality was added. Native traits are aggression, caution, patience, opportunism, staminaManagement and tacticalDiscipline. All six continue contributing to ordinary utility. Independence uses four of those existing traits:

`S=.45×(100−tacticalDiscipline)+.25×aggression+.15×(100−caution)+.15×(100−patience)`.

Refusal is eligible only when tacticalDiscipline≤30 **and** S≥80. An eligible driver deterministically compares native pace utilities after removing the Sign contribution and random-noise term. If its best own pace differs, it resists; otherwise it obeys. Existing candidate generation still consumes its established RNG draws. No refusal probability draw is introduced. New prototype personality presets merely copy six validated native fields into race setup; they do not add hiring/progression systems or alter rivals. The exceptional headstrong preset has S=91.25 and discipline10; ordinary aggressive has discipline60 and is not eligible.

This is a deliberately narrow explainable gate, not a population-frequency estimate. Extreme headstrong drivers often resist in the controlled fixture. Trait weights/thresholds are explicit prototype balance, not approved permanent career traits.

## Compliance interpretation

- **Obeying:** directive selected and attempted with matching effective pace.
- **Constrained:** native control/capability, movement block, or native execution/stress failure prevents the requested execution. Diagnostics preserve the specific cause; these are not personality refusals.
- **Resisting:** trait-qualified driver deliberately selects a different pace and is not being mislabeled from an execution failure.
- **Inapplicable:** non-racing/non-live RU cannot perform the order. Viewer terminal messages identify the actual native status.

`signFeedback` shows requested and actual pace, queued versus active state, personality refusal reason or physical blocking/control reason. `Commentary.consume` uses existing AI_DECISION evidence for refusal radio lines, throttled to eight simulation seconds per actor. No invented native action, animated attack or per-tick refusal spam is generated. Physical execution results can update decision compliance; aggregation uses the latest result for a decision ID rather than counting every reaction as independent obedience evidence.

## Measured personality sweep

Ten native four-RU Oval runs, seed145, first1200 ticks or terminal; one pre-race Sign each. These are decision counts, not probabilities or all-race population statistics.

| Persona | Order | Obeying | Constrained | Resisting | Obeying/all |
|---|---|---|---|---|---|
| balanced | Push the Pace | 121 | 0 | 0 | 100.0% |
| balanced | Conserve Strength | 117 | 3 | 0 | 97.5% |
| disciplined | Push the Pace | 121 | 0 | 0 | 100.0% |
| disciplined | Conserve Strength | 117 | 3 | 0 | 97.5% |
| aggressive | Push the Pace | 121 | 0 | 0 | 100.0% |
| aggressive | Conserve Strength | 117 | 3 | 0 | 97.5% |
| cautious | Push the Pace | 121 | 0 | 0 | 100.0% |
| cautious | Conserve Strength | 117 | 3 | 0 | 97.5% |
| headstrong | Push the Pace | 6 | 3 | 111 | 5.0% |
| headstrong | Conserve Strength | 4 | 3 | 113 | 3.3% |

Ordinary personas have zero deliberate refusals in the sweep. Constrained decisions are retained in denominators rather than relabeled obedience. Headstrong feedback shows actual trait score, discipline and chosen native pace. Tests also isolate loss of control, full fatigue with an otherwise valid order, inapplicable retirement, unchanged personality, no added RNG draw, and the absence of blanket overrides for the other four Signs.

## Compatibility and limits

P1.3 intentionally changes race outcomes only when its profile is explicitly enabled. Twelve historical native and two payroll checksums match; six earlier-profile full-race hashes match. New P1.3 replay/checkpoint and full-race repeat tests match within Node. Managed Chromium verifies displayed obedience/resistance and native Sprint. This does not establish full Long Rally Node/Chromium numerical portability, which was already a separate inherited limitation. No golden reference was changed.
