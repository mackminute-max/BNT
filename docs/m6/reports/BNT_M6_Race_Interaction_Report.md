# M6 race interaction

`progressionContext.version=2` plus `m6-immediate-signs-abilities-v1` opts only the player into M6 rules. Native historical context-v1/no-context paths remain intact.

Six Signs, No Sign and Active Ability are the eight ordinary controls. A selected Sign activates at the next native tick; budget is loop laps or Rally checkpoint count+1, plus Strategist once. All opportunities are available upfront, no crossing refill. Same active Sign is a no-op; No Sign clears pending/active instruction free even at zero. Pause and Worker buffering retain authoritative input order.

Eight effects use simulation ticks: Thunder Burst speed+10%/acceleration+15%5s; Second Wind beast continuous/action fatigue expenditure×0.5 for8s; Brace contact/collision damage×0.7 for6s; Perfect Line handling/lateral×1.15 for6s with existing handling clamp; Savage Assault offensive Combat contest×1.2 for5s; Absolute Focus existing error probabilities×0.5 for8s; Catch Breath removes10beast fatigue immediately, clamped; Steady Team eligible recovery rate×1.25 for6s. Native safety caps remain. No extra RNG stream or native attribute mutation is introduced. One slot/run, one charge/race, replacement confirmed, no permanent effect.

Nineteen additive native interaction tests cover all eight charges/checkpoint restoration, real movement/fatigue/damage/handling/combat/error/recovery effects, expiry and rival exclusion. Existing21 passive Run rewards remain. Practice clones selected owned assets/equipment/condition and affinity, with no Legacy/Run/ability bonuses or persistence effects.

The reference-driver test mode initially exposed a stale derived-attribute cache at an M6 ability boundary. The localized M6 refresh fixes that case; legacy reference digests remain unchanged. It does not change native dt, collisions, AI personality or old replay expectations.

