# BNT — M5 Visual Asset Requirements and Production Briefs

**24 November 2026 • Content production only • Accepted M4 gameplay and repository unchanged.** Mechanical numbers are provisional authoring candidates, not accepted balance. No native generation engine, persistence migration or art has been implemented.

**55 complete nonvisual production briefs** are supplied in [visual-asset-production-briefs.json](../metadata/visual-asset-production-briefs.json). Every brief contains a GPT/image-artist prompt, canonical source references, source/runtime/display dimensions, format, anchor, variants, compositing and acceptance requirements. No image has been created. Future asset IDs are planned references to briefs, not falsely claimed existing files.

| Type | Count | Source | Runtime | Delivery |
| --- | --- | --- | --- | --- |
| Ancestry person portraits | 13 | 1024×1024 | 256×256; display64/128CSSpx | transparent PNG; shared across generated people with metadata |
| Beast portraits | 9 | 1024×1024 | 256×256 | transparent PNG; stock-style metadata variants |
| Complete species-based RU illustrations | 9 | 1024×512 | 128×64; anchor64,32 | true top-down, facing right, two beasts +driver+chariot; livery mask |
| National-style independent team emblems | 8 | SVG viewBox512×512 | optional raster128×128; minimum24px | original non-governmental logo; sanitized actual SVG |
| Chariot illustrations | 8 | 1024×512 | 512×256 | transparent PNG existing functional design |
| Equipment product illustrations | 8 | 512×512 | 128×128 | transparent PNG; neutral existing product, no new weapon/effect |


## Asset-by-asset index

| Brief | Planned asset | Category | Canon |
| --- | --- | --- | --- |
| brief.portrait.a01 | portrait.a01.v1 | person-portrait | A01 |
| brief.portrait.a02 | portrait.a02.v1 | person-portrait | A02 |
| brief.portrait.a03 | portrait.a03.v1 | person-portrait | A03 |
| brief.portrait.a04 | portrait.a04.v1 | person-portrait | A04 |
| brief.portrait.a05 | portrait.a05.v1 | person-portrait | A05 |
| brief.portrait.a06 | portrait.a06.v1 | person-portrait | A06 |
| brief.portrait.a07 | portrait.a07.v1 | person-portrait | A07 |
| brief.portrait.a08 | portrait.a08.v1 | person-portrait | A08 |
| brief.portrait.a09 | portrait.a09.v1 | person-portrait | A09 |
| brief.portrait.a10 | portrait.a10.v1 | person-portrait | A10 |
| brief.portrait.a11 | portrait.a11.v1 | person-portrait | A11 |
| brief.portrait.a12 | portrait.a12.v1 | person-portrait | A12 |
| brief.portrait.a13 | portrait.a13.v1 | person-portrait | A13 |
| brief.portrait.b01 | portrait.b01.v1 | beast-portrait | B01 |
| brief.ru.b01 | ru.b01.v1 | complete-racing-unit | B01 |
| brief.portrait.b02 | portrait.b02.v1 | beast-portrait | B02 |
| brief.ru.b02 | ru.b02.v1 | complete-racing-unit | B02 |
| brief.portrait.b03 | portrait.b03.v1 | beast-portrait | B03 |
| brief.ru.b03 | ru.b03.v1 | complete-racing-unit | B03 |
| brief.portrait.b04 | portrait.b04.v1 | beast-portrait | B04 |
| brief.ru.b04 | ru.b04.v1 | complete-racing-unit | B04 |
| brief.portrait.b05 | portrait.b05.v1 | beast-portrait | B05 |
| brief.ru.b05 | ru.b05.v1 | complete-racing-unit | B05 |
| brief.portrait.b06 | portrait.b06.v1 | beast-portrait | B06 |
| brief.ru.b06 | ru.b06.v1 | complete-racing-unit | B06 |
| brief.portrait.b07 | portrait.b07.v1 | beast-portrait | B07 |
| brief.ru.b07 | ru.b07.v1 | complete-racing-unit | B07 |
| brief.portrait.b08 | portrait.b08.v1 | beast-portrait | B08 |
| brief.ru.b08 | ru.b08.v1 | complete-racing-unit | B08 |
| brief.portrait.b09 | portrait.b09.v1 | beast-portrait | B09 |
| brief.ru.b09 | ru.b09.v1 | complete-racing-unit | B09 |
| brief.emblem.n1 | emblem.n1.v1 | team-emblem | N1 |
| brief.chariot.n1 | chariot.n1.v1 | chariot-illustration | N1 |
| brief.equipment.n1 | equipment.n1.v1 | equipment-product | N1 |
| brief.emblem.n2 | emblem.n2.v1 | team-emblem | N2 |
| brief.chariot.n2 | chariot.n2.v1 | chariot-illustration | N2 |
| brief.equipment.n2 | equipment.n2.v1 | equipment-product | N2 |
| brief.emblem.n3 | emblem.n3.v1 | team-emblem | N3 |
| brief.chariot.n3 | chariot.n3.v1 | chariot-illustration | N3 |
| brief.equipment.n3 | equipment.n3.v1 | equipment-product | N3 |
| brief.emblem.n4 | emblem.n4.v1 | team-emblem | N4 |
| brief.chariot.n4 | chariot.n4.v1 | chariot-illustration | N4 |
| brief.equipment.n4 | equipment.n4.v1 | equipment-product | N4 |
| brief.emblem.n5 | emblem.n5.v1 | team-emblem | N5 |
| brief.chariot.n5 | chariot.n5.v1 | chariot-illustration | N5 |
| brief.equipment.n5 | equipment.n5.v1 | equipment-product | N5 |
| brief.emblem.n6 | emblem.n6.v1 | team-emblem | N6 |
| brief.chariot.n6 | chariot.n6.v1 | chariot-illustration | N6 |
| brief.equipment.n6 | equipment.n6.v1 | equipment-product | N6 |
| brief.emblem.n7 | emblem.n7.v1 | team-emblem | N7 |
| brief.chariot.n7 | chariot.n7.v1 | chariot-illustration | N7 |
| brief.equipment.n7 | equipment.n7.v1 | equipment-product | N7 |
| brief.emblem.n8 | emblem.n8.v1 | team-emblem | N8 |
| brief.chariot.n8 | chariot.n8.v1 | chariot-illustration | N8 |
| brief.equipment.n8 | equipment.n8.v1 | equipment-product | N8 |


## Reuse and constraints

`visualMetadata` uses current registered abstract builtin markers while optional actual-art lists remain empty. That is a valid nonvisual content package with no missing-file dependency; it is not a claim that these images exist. `visual-asset-bindings.json` provides future brief references. It must not automatically activate unavailable art.

Appearance layers: immutable anatomy → source-valid age/body/coat/hair → removable cultural clothing → profession accessory → team palette/livery. `visual-anatomy-rules.json` holds source constraints: female Hill Dwarves never facial hair; female Mountain Dwarves no full beard; Sea Elves subtle gills/webbing; Dragonkin five digits/tail/no wings/no default mammalian breasts; Tortles living shell/plastron/air breathing/partial retraction. Match stock changes through39 source physical variants; do not require39 additional unique portraits.

No nation is an ancestry. Mixed teams can share livery with different anatomy; recolor livery masks, never indiscriminately tint skin/coat. No unique AI image per generated entity, runtime image generation, external image API, network font or external SVG reference.

## Game-ready output QA

A prompt alone cannot guarantee a correct alpha channel, SVG paths, dimensions, anatomy, sprite count or licensing. Inspect actual outputs. Raster requires sRGB RGBA, clean alpha, no text/watermark, safe cropping and exact runtime exports. SVG requires valid viewBox/paths and no scripts/external assets/fonts/foreignObject/filter-heavy effects. An image-only model can provide a raster concept; SVG tracing/export must be separately verified. No false “game-ready SVG” promise from a raster preview.

RU sprites are visual only. Preserve native collision/lane geometry, true overhead viewpoint and anchor/direction. Static first pass is sufficient; additional gait frames require separately approved animation metadata and art integration. Never warp engine geometry to fit an illustration.

## Current renderer limits

`src/presentation/contracts.js` caps manifest assets64 and currently accepts proof status; existing manifest has11 entries. Loading all55 new IDs **in addition** would total66 and exceed the bound. Do not raise it silently. Stage at most53 additional entries while retaining all11, or replace/de-duplicate verified obsolete proof entries during separately authorized art integration. Existing hard-coded proof IDs and fallback references must be audited before replacement. No such change occurs in this content task.

AssetLibrary image cache24/8MiB and composites16/4MiB remain existing limits (`src/presentation/assets.js`). Future portraits should load by active screen/relevance with verified eviction; do not decode every hypothetical character image. All actual bytes embed through the accepted standalone build pipeline. Artist source files and these briefs need not be stored in career saves.
