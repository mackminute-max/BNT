# P2 static visual proof: asset contract v1

This is a local, temporary visual proof, not an approved production art catalog. All bundled images are original geometric proof graphics. Their author/source/license notice is embedded from `art-source/licenses/temporary-proof.md`; no third-party fonts or artwork are included. System fonts are deliberate fallbacks. No animation catalog, new racing mechanic, or gameplay livery bonus is introduced.

## Reproduce

- `npm run build:p2` validates and embeds the manifest, PNG/SVG bytes and credits. No downloads or runtime resources are required.
- `node scripts/p2/generate-proof.mjs` regenerates the three checked-in PNGs from SVG source using the already installed development Chromium. It is not required to play or build.
- `npm test` includes the P2 contracts and geometry tests.
- Browser harnesses in `scripts/p2` require existing Playwright and Chromium; outputs go to `/workspace/deliverables/bnt-p2/evidence`.

## Asset identity and geometry

`assets/presentation.manifest.json` is a versioned array of stable IDs, source/license attribution, SHA-256 payload identity, dimensions, fallback IDs and visual metadata. Duplicate identities, cycles, unknown versions, invalid dimensions, frames and paths reject the build. Actual bytes and decoded dimensions are validated, not merely trusted from metadata. Encoded payloads deduplicate by content hash.

The proof RU source is 512×256, runtime PNG 128×64, facing +X. Runtime anchor is (40,32). Driver anchor is (32,32), wheels (32,16)/(32,48), beast anchors (76,18)/(76,46). Anchors describe artwork only: native `point(q,lane)` and native collision geometry remain authoritative. The complete sprite represents two beasts; all other legal native compositions retain a labeled generic marker. At insufficient screen scale the marker also replaces detailed artwork.

The portrait source is 512×512 and runtime is 256×256, displayed at 64 CSS pixels. Emblem is vector viewBox 0 0 256 256, with a separate 24-unit compact mark. Corner art is a 48-unit responsive SVG decoration. Architecture assets use 512×256 viewBoxes. These are proof dimensions, not mandatory future catalog sizes.

## SVG and PNG restrictions

SVG is parsed by a restricted XML tokenizer and stack. Only allowed geometric elements/attributes, finite coordinates, flat colors, and valid local fragment references are accepted. Scripts, event handlers, styles, text/fonts, external resources, entities, DOCTYPE, filters, SMIL, embedded images, unknown namespaces, invalid paths, recursive references and excessive nesting reject. Limits are enforced in `scripts/p2/svg.mjs`; arbitrary user SVG import is not supported.

PNG runtime art is bounded RGBA8 with checked signature, chunk CRCs, inflate size, filters and dimensions. Browser decode is asynchronous, bounded by a timeout, and failures select documented fallbacks. No image parse/decode occurs inside the actor draw loop. Team recoloring changes the dedicated livery mask only; anatomy and ink are preserved. CSS color assignments do not modify native stats or teams.

## Runtime bounds

DPR is capped at 2, including fractional DPR. Canvas backing dimensions follow CSS content size, with logical geometry and pointer coordinates independent of backing pixels. Static world tiles are bounded at 28 MiB/32 entries; map cache at 4 MiB/2 entries; geometry at 4 MiB/4 entries; decoded images at 8 MiB/24 entries; derived livery composites at 4 MiB/16 entries. These are estimated surface bytes, not total browser/GPU memory guarantees. Evicted surfaces are disposed. A resize, course switch, failed asset or proof-art toggle never advances simulation or consumes a Sign.

## Build isolation

P2 aliases the buffered app's view adapter and applies one checked render-projection seam at build time; it does not rewrite the P1.5 Worker or control handlers. An upstream mismatch fails the build. The E4 companion enables an optional presentation hook; ordinary E4 rendering remains the default when the hook is absent. Both companion aliases are byte-identical; the P2 playable and E4 companion serve different applications and intentionally differ.
