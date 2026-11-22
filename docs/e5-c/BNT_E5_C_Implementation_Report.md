# BNT E5-C — Implementation Report

Verification date: November 21, 2026 (America/Los_Angeles). Branch: `feat/m2-e5-c-integrated-career-loop`. Frozen runtime: `646fad6b7a6dff3b10d9718286840cc7b3c3bc97`. Accepted E5-B delivery baseline: `ee6963c41accad23a09981007eb1daa78f56f912` (runtime `4322672749091d8f0c7121d7f2d14f3d5bba67a7`). Local delivery only; no merge, push, release or deployment.

## Delivered behavior

The normal Championship page now takes an explicitly selected owned assignment through registration, preparation/coaching, the actual P2.2 race viewer, authoritative publication, mandatory Run selection, further events, trusted final settlement, permanent Legacy choice and archive/Home Stable. Practice remains a separate exact accepted P2.2 artifact with no career rewards. The implementation integrates existing authorities; it does not create a second racing engine or settlement producer.

The race viewer shows the accepted follow camera, tactical map, standings, radio, queued/active Signs, pause, speed, step and tail controls. Returning to management preserves the committed race. Reopening presents the newest durable head paused, not a replacement race. Preparation discloses the locked participants, schedule, condition and existing coaching; editing coaching preserves continuous values and existing custom weights.

## Source inventory and responsibilities

| Files | Change |
|---|---|
| `src/career/championships/viewer.js` | Actual native tick/frame/event projections; strict channel, race, setup, revision and displayed-reference checks. |
| `src/management/career-race/{buffered-session,host,iframe-entry}.js` | Accepted buffered client over an E4 transport; source-checked iframe MessageChannel, ordered requests and bounded retry cache. Original renderer reused. |
| `src/management/career-race/flow.js` | Player lifecycle, explicit RU selection, prep, official results, reward gates, recovery, withdrawal and Home return. |
| `src/management/career-race/interface.css`, `src/management/bootstrap-c.js` | Minimal opt-in presentation integration. |
| `src/persistence/race/session-store.js` | Optional internal tick observer and native buffered-delay action in paused input journal. Existing physical execution and validation remain authoritative. |
| `src/persistence/e4/{worker-service,client}.js` | Ephemeral view projections returned only after durable commit/ack; typed official no-starter handling. |
| `src/ui/{career-saves,durable-championships}.js` | Queued player operation port and allowlist; existing recovery/settlement authority reused. |
| `src/management/{playable,championship-e5}.js` | Normal Continue/navigation integration and reusable existing reward panels. |
| `scripts/e5-c/` | Standalone build, viewer build, browser journeys and unchanged-assertion regression wrappers. |
| `tests/e5-c.test.js`, `tests/m2-e-e3-helpers.js` | Eleven integration cases; optional fixture points array for a valid eight-field test, preserving old defaults. |
| `package.json`, `dist/Blood-and-Thunder-E5-C-Playable.html` | Additive build command and new deliverable. |

The source commit sequence is `8b38a20`, `1c2d0c0`, `6e0d9f6`, `2057ad7`, `646fad6`. The final refinements correct typed no-starter recovery, credited-versus-pending captions, continuous coaching preservation, recovery priority while Legacy is pending, and rival radio/marker identity consistency. Full hashes are available in local Git history. No simulation, AI, model, track, D2 conversion, scoring, reward catalog or economic formula was changed.

## Authority and persistence

The viewer calls the existing RaceSessionStore through the IndexedDB coordinator. Worker preparation is not a durable acknowledgment. Packets are released to the client only after generation/read-set checked storage publication and worker acknowledgment. Native buffered Sign boundaries are reused, including versioned delay proof when the displayed boundary is behind the authoritative head. Duplicate client acknowledgments are bounded and do not reapply inputs.

D5 clearance and the existing protected E3 official commit remain separate from visual completion. Existing E5-B trusted final settlement applies M2-D finances/recovery/contracts exactly once; Run and Legacy remain placeholder selections without invented bonuses. Recovery takes precedence over reward actions. Typed official zero-starter results do not require a fictitious native session; a real missing session still blocks.

No new career schema, new external save envelope or migration was introduced. Existing checkpoints/imports remain supported. The paused journal accepts an additive existing native buffered-delay subtype; older readers are not promised forward compatibility with newly produced C records. Keep a complete pre-C backup before testing; do not downgrade an active C career into an old reader. Existing receipt/identity/journal and logical record limits remain intact.

## Artifact and scope

Standalone: `dist/Blood-and-Thunder-E5-C-Playable.html`, 2,242,856 bytes, SHA-256 `8b31d3ef8ae6c902184beb7c134fad7e25290515250318211dbcd863eff71c2c`. It embeds the worker, owned viewer and exact accepted independent practice; no adjacent assets or runtime network required. Build: `npm run build:e5-c`.

E5-D, P3/P4, mechanical Run/Legacy effects, new art, expanded services and balance changes are deferred. Existing E4 performance limitations remain visible as honest buffering. Managed HTTP/offline testing is not Windows direct-file acceptance. See the test evidence and outstanding register for exact coverage and limits.

## Exact implementation revisions

- `8b38a20e95321b1e16b2ca6234c4ec43c5543c0d` — Integrate E5-C owned championship play with durable P2.2 viewer
- `1c2d0c018493abd06014a34017675cabd4ab5307` — Recognize authoritative no-starter results without requiring native sessions
- `6e0d9f6d69a831320759f400a1d7c9fd45527d4f` — Distinguish credited settlement awards while Legacy selection is pending
- `2057ad76b5f25724ac1d291eb3e7d96dd9cdb34a` — Preserve exact native coaching values in career preparation
- `646fad6b7a6dff3b10d9718286840cc7b3c3bc97` — Keep recovery actionable during pending Legacy selection and align rival labels

## Delivery assessment

Implementation gates passed locally:755/755 Node tests, final frozen-artifact two-championship journey (8 groups/four native replay matches/zero Developer Tools clicks), final management browser13 groups. Owner Windows direct-file acceptance and performance usability review remain outstanding. E5-C is delivered for review, not represented as owner-accepted. Documentation/evidence commit follows the frozen runtime without source changes.
