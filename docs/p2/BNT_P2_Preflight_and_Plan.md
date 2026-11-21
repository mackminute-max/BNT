# P2 preflight and implementation plan

Authority: approved In-Race Presentation & Asset Guidelines v1 (19 November 2026), P2 Implementation Handoff, and explicit owner instruction to proceed. Earlier technical audit is supporting context; its provisional numbers are not final art or gameplay rules.

Baseline: P1.5 runtime 5d556f3, delivery 04df5ef. Application tree and standalone hash match. Dedicated branch feat/p2-static-visual-proof. Preserve the pre-existing untracked M2-E audit. No merge, push, migration or P3/P4.

Existing: headless native engine and buffered Worker; bounded presented projections/events; camera/map Canvas drawing; DOM controls/radio; esbuild embedded Worker. No asset manifest, image cache, strict SVG ingestion or DPR-aware Canvas layer is present. E4 uses `ui.view.frame` from `coordinator.inspect()` after durable operations. While pending, render uses that last inspected committed frame. Its frame omits full native event history; do not invent combat event presentation.

Plan, in gate order:

1. Baseline: full configured Node suite, P1.5 build/hash and actual embedded-Worker smoke. Preserve accepted evidence by redirecting outputs.
2. P2-A: additive `src/presentation/geometry.js`, Canvas sizing/transform helpers and shared renderer; P2-specific view adapter selected only by the new esbuild target. Reuse native `point()` exactly; fixed north/up, bounded look-ahead, stable player/fallback target, open endpoints. No changes to simulation or P1.5 protocol/client.
3. P2-B: new P2 template/bootstrap: main follow viewport, full-route map/standings and substantial right radio; bottom identity, real Sign and playback controls. Reuse existing P1.5 app/control logic. Both Canvas views use one copied presentation snapshot. Accessibility/reduced-motion and explicit placeholder labeling.
4. P2-C: versioned manifest, reviewed source SVG/PNG temporary proof kit, strict restricted XML/SVG validation, PNG/hash/anchor/fallback checks, bounded decoded/composite/tile caches. System fonts until licensed originals are supplied. Single-file build embeds all runtime bytes.
5. Durable proof: a small optional presentation hook in `src/ui/durable-championships.js`, enabled only in isolated P2 companion builds. The adapter receives only `ui.view.frame`; no backend, journal, schema, operation, migration or acknowledgment changes. Reuse the same renderer/geometry/identities/DPR helpers. No E4 frame interpolation. Preserve ordinary production output files.
6. Verify unit/property tests, invalid asset fixtures, actual Worker/fallback/sign/pause/tail/step/restart paths, DPR/resize/pointers in both viewers, committed-frame hold, art on/off/failed exact native parity, historical/checkpoint probes, controlled P1.5/P2 performance and repeated build hashes. Build a separate P2 playable HTML and clearly named durable companion aliases, leaving accepted artifacts untouched.

Build-contract clarification: existing `scripts/build.mjs` produces two identical **E4 aliases**. It does not require P1.5 and E4 to be identical. The new isolated durable companion aliases will be compared byte-for-byte; the P2 playable entry has its own Worker and must differ. No authoritative contract conflict is inferred.

Missing approved artwork/fonts is handled by labeled temporary source-controlled proof graphics and generic fallbacks. Subjective art/legibility and Windows Chrome/Edge direct-file acceptance remain owner gates. No supplied production art will be invented or represented as approved.
