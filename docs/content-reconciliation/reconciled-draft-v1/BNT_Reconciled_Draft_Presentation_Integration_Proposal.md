# Blood and Thunder — Reconciled Draft Presentation Integration Proposal

November 22, 2026. **Proposal only; no implementation authorization or runtime change.** Read alongside [Reconciled Draft Review](BNT_Reconciled_Draft_v1_Review.md).

## Recommended smallest slice

First authorize only **validated static description/help overlays** from Batch02 and the Sign/weather/incident help portions of Batch04, after correcting the primary-track metadata. Exclude recruitment-pack activation, alternate radio selection, art registration and any persistence extension from that first slice.

This makes the accurate copy useful without treating drafts as native import files or making a new save schema a prerequisite for simple help text. Leave the existing identity resolver and native reporter completely unchanged. The current code can support this additive vanilla-JavaScript/HTML path; no framework, server or dependency replacement is justified.

| Area | Existing contract | Proposed first-slice behavior |
|---|---|---|
| Packages | `career/packages.js:7–31`, protected one-time grant; current preview in `management/playable.js:53,88–91` | Additional description beside existing source-owned package numbers; no editing native name/grants/catalogVersion |
| Facilities/services | `economy/catalog.js`; `economy/reducers.js:17–20,57–75`; `management/player-pages.js` | Accurate descriptions next to existing cost/qualification quote; live quote stays authoritative |
| Tracks | `track/catalog.js:3–26`, `track/course.js:107–112` | Descriptions keyed by exact native ID. Remove the ambiguous draft alias flags before compilation; no redirects |
| Championships | `career/championships/e5/catalog.js`, `management/career-race/flow.js` | Help/disclosure only, never rewrite a frozen offer, schedule, trophy or reward terms |
| Rewards | `career/championships/reward-offers.js:7–21`; `management/championship-e5.js` | Explain placeholders and pending/credited status at their actual native state; no definition mutation or new effects |
| Signs/weather/incidents | `ai/signs.js:19–47`; `sim/environment.js:4–45`; `reporting/commentary.js:27–33` | Tooltip/help text only. No extra emitted radio line from `commentary_cue`; never infer activation from queued UI state |
| General UI | No generic string registry; current M1 shell and existing management modules | Explicit mapping of each of12 copy keys to a real guarded consumer; keep unrelated existing UI intact |

All listed additions are **proposed**, not present. Existing source records and source-owned display names remain the fallback. Descriptive mirror fields such as `native_cost` can be checked at build/test time, but must not feed economy, AI or race setup.

## Phase A — Small copy-only implementation, after separate authorization

### Deliverables

1. An immutable, reviewed subset of approved description/help strings.
2. A tiny read-only lookup adapter, conceptually `descriptionFor(category, exactKey, nativeFallback)`. This is a proposed interface, not a current API.
3. Explicit UI bindings in only the relevant management/help/preparation components. Render authored text as text content or through the existing HTML escaping helpers.
4. Build-time validation using existing Node/esbuild tooling; native JSON remains a different format.
5. Tests and a new standalone artifact for owner review. Preserve accepted HTML and historical evidence.

Possible files, **not created here**: `src/presentation/content/copy.js`, a reviewed/generated data module, a bounded build validator, and narrow call sites in `management/player-pages.js`, `playable.js`, `career-race/flow.js` and selected viewer help. Exact names are routine engineering choices for the authorized implementation.

### Compilation rules

- Whitelist known files/fields/IDs, reject duplicate keys and unsupported versions. Unknown file kinds do not become runtime assets.
- Validate source-owned key sets and numerical mirrors against current native exports. Fail the candidate build on drift rather than silently rebalance or remap it.
- Strip authoring-only mirrors, source excerpts, review claims and production briefs from the runtime text payload when not needed.
- Preserve dynamic native numbers, current quotes, contract lifecycle, ownership and conditional labels. Do not bake a nominal discount into an authoritative price display.
- Retain exact native fallback text when no optional description exists. Never fabricate a missing owned asset, race result or mechanic.
- Embed the approved data with the current bundle; no runtime fetch, external JSON selection, adjacent asset or mandatory server.

### Acceptance gate

- Before/after byte-equivalent career JSON and protected records after opening every changed page, including uninitialized/schema2/3/4/5/6, active championship, pending choices and recovery states.
- Quotes/grants/market draw order unchanged; no new transaction on browsing.
- All five packages remain eligible under the exact pristine initialization policy; no accidental initialization effect.
- All six Signs show the correct format/timing; pending, accepted and activated messages remain distinct. No added radio line, use, refund or event.
- Gross entitlements, credited final settlement and inert placeholder selection remain distinct.
- Current per-career Legacy ownership and M1 slot isolation unchanged.
- Existing native/legacy transcript,12 historical and2 payroll checksums remain exact.
- Full relevant Node/browser tests, offline build and Windows direct-file owner procedure. This audit did not perform those future integration tests.

## Phase B — Cosmetic identities, separately gated

### Existing obstacle

`management/content.js:29–31` resolves both recruitment offers and acquired assets from the same sourceOfferId lookup. Replacing that table globally would change old careers on reload even if their serialized names and finances remain untouched. The draft's `identity_binding_policy` string is not stored in any loaded career and cannot enforce “new careers only”.

M1 slots solve isolation, not content versioning. `management/startup/slots.js:7–20` contains navigator fields only; complete-backup payload construction at `persistence/e4/backup.js:6–13` does not persist arbitrary external slot metadata. Do not use a slot UUID, database prefix, timestamp, app version, current career schema or existence of sourceOfferId to infer opt-in.

### Required approved policy/proof before activation

- An explicit durable presentation-pack identity/version/digest bound to the correct profile and career, created only by an approved future creation/versioning path.
- Legacy/unmarked careers always call the existing resolver with its exact old table and fallback behavior. Never auto-upgrade them merely because the new build contains enriched copy.
- The pin must round-trip through ordinary save/reload, career-only export/import, complete backup/restore, recovery checkpoints and cross-slot validation. No browser-local-only preference masquerading as save authority.
- Strict current formats do not accept arbitrary extra fields: `persistence/envelope.js:25`, `career/championships/e5/schema6.js:36–38`, `economy/validation.js:13–30`. A future format/migration must be separately approved and tested. Do not implement a field or silently discard newer fields under this copy-only proposal.
- **Pristine initialization hazard:** `career/domain-commands.js:20–24` rejects prior active-career transactions/protected history. A new presentation “setup transaction” before the starting grant can make the career ineligible. The eventual pin design must prove the approved starting grant still works without relaxing `assertPristine`, duplicating initialization or retroactively rewriting history. If that compatible path is unavailable, do not enable the new pack for any career.
- No Owner Legacy merging, acquisition-value recalculation, market reseeding, grant reissue or retroactive trait generation.

Only after that proof should a context-aware display adapter be considered, conceptually `identityForPresentation(record, validatedCareerContext)`. It may project `presentation_identity.biography` to UI `bio`, separately show approved ancestry/origin/model metadata, and display the driver characterization disclaimer together with its prose. It must not write those fields into strict owned records or turn a string personality into the native six-axis object.

Native `generic_draft_beast`, mass/combat, strain, condition, injuries, eligibility, roles and payroll remain source-owned. National/ancestry/species identities are descriptive and nonexclusive; no additional mechanics or world generator is implied.

**Until approved durable pinning and its complete compatibility proof exist: retain the current identity resolver for every career, including newly created M1 slots.**

## Phase C — Optional radio-display transformation, not a reporter replacement

The 67 strings are authoring drafts. `reporting/commentary.js:79` calls native template functions; JSON arrays/strings cannot be dropped into that table. Preserving the hash function while changing pool size from two to three changes selected prose. It is not exact historical transcript preservation.

A separately authorized future display layer could operate as follows:

```text
Durably accepted native event/projection
  -> existing Commentary with unchanged cursor, priority, throttles and pools
  -> already accepted native line {eventId,time,type,text}
  -> optional version-gated display transformation
  -> existing radio DOM text output

Official results / exported narrative -> original native reporter path only
```

This is a proposal, not an implemented runtime interface or new native template factory.

Rules for the proposed layer:

1. Transform only a line the existing reporter actually emitted. Keep its eventId/time/type and one-to-one cardinality/order. Do not create a second line for a Sign cue or scan uncommitted worker state.
2. Resolve typed values from the *originating accepted event*, not a later mutable frame. Preserve the existing buffered presentation/event watermark (`career-race/buffered-session.js`), including delayed Sign activation diagnostics.
3. Use the already reviewed conversions: damage one decimal, finish time four decimals, lane plus1 numerically, actual control lowercasing, native participant order joined with “ and ”, attack outcome from its boolean, segment motion from actual type/direction, resistance fields from `effects.directive`. Preserve punctuation/escaping and do not recursively interpolate token-looking text inside a value.
4. Missing/invalid display context returns the original native line unchanged; no default zero, invented participant/status or silent entitlement.
5. Legacy/unmarked careers remain an exact pass-through, including their current name projection. If a separately approved presentation selector is introduced for marked careers, version it explicitly. It may reuse the existing pure hash algorithm without mutating it, but a different display pool cannot be claimed to preserve the old visible transcript. No simulation RNG, command, event or digest may depend on that choice.
6. `DIRECTIVE_RESISTANCE` stays on its fixed special branch (`commentary.js:71`), not a23rd native template. Keep the one fixed native-compatible sentence, all original guards and eight-unit throttle; **no selector**.
7. `results(s).narrative` remains byte-equivalent under the old reporter (`reporting/results.js:79–87`). A visual radio variation is not an authoritative result or settlement.
8. A native RACE_ENDED line must not be used to unlock championship advancement or credit rewards. Existing clearance/publication status remains authoritative; any explanatory caption belongs to UI status, not extra emitted radio events.

No new global reporter, template factory, clock, event, priority/throttle or native hash change is proposed. Without the approved marker/versioning proof, leave the alternate display strings disabled for every career. The initial Phase A can ship independently without this layer.

## Art stays outside the first implementation

All37 briefs are proposals; correct the heavy-rain cross-file ambiguity and visual/nonvisual kind label before a future compiler. Three-quarter portraits/product views cannot substitute for top-down RU sprites or alter collision geometry.

Future registration needs approved runtime IDs, actual files/hashes, dimensions/anchors/frames, source/license provenance, consumers, fallback and capacity tests. `presentation/contracts.js:3–12` currently accepts only its bounded proof formats/status. `presentation/assets.js:4–9` preloads images into a24-entry/8MiB cache. Registering all37 additional images alongside eight existing imported images would exceed its entry count even if compressed bytes and the64-entry manifest cap fit. No bound increase or eviction-policy change is authorized here.

## Proposed execution/review gates

| Gate | Work | Must pass before continuing |
|---|---|---|
| A0 | Author corrects fifteen track flags; clarifies rain brief and root kind | Exact key/source parity unchanged; no native edits |
| A1 | Owner separately authorizes static-copy subset | Explicit consumer list and no identity/radio/asset/persistence scope |
| A2 | Implement only immutable copy lookup + guarded UI descriptions | Read-only state/quote/replay/standalone tests and owner review |
| B0 | Separate durable cosmetic-version design | Starting-grant pristine compatibility; exact restore/export/import/legacy proof; approved scope |
| B1 | Optional identity display adapter | Old/unmarked identity exact; no cross-slot/native/economic changes; disclaimer visible |
| C0 | Separate marked-career radio-display proposal authorization | One-to-one accepted lines; native transcript and special path exact; no RNG/event changes |
| D0 | Actual art/consumer approval | File/license/manifest/cache/fallback/offline proof; no collision changes |

These are planning gates, not authorization to begin them. No new player-facing mechanics or numerical decisions are needed for A0–A2. Pinning/format compatibility and intentional visible-transcript changes need a separate explicit implementation instruction; neither is silently covered by the authoring waiver.

**STOP — Presentation-only proposal delivered; game source, saves, catalogs, reporter and assets remain unchanged.**
