# M0/M1 persistence foundation

Start with [implementation report](M0_M1_IMPLEMENTATION_REPORT.md) and [Windows verification instructions](WINDOWS_TESTING.md). The standalone is [Blood_and_Thunder.html](../../dist/Blood_and_Thunder.html); the retained Track-Test filename is identical.

From the repository root:

```sh
node --test tests/persistence.test.js
npm test
npm run build
node scripts/persistence-browser.mjs
npm run test:browser
```

Both browser commands deliberately return nonzero when the required actual file launch is denied, even when their labelled HTTP diagnostic functional checks pass. Inspect their JSON reports rather than calling that a passing offline launch. Run large browser/test workloads sequentially to make diagnostics easier to interpret.

`evidence/` preserves the 212-test baseline, 237-test final suite, 25 focused persistence cases, 18 new/23 retained browser check groups, screenshot, original development failures, source/artifact manifest and a synthetic example game-save JSON. The example is a valid developer-edited M1 fixture, not an approved starter package or real owner career. Existing historical audits/evidence were not replaced. `FILES.sha256` covers current modules, tests, UI, docs/evidence and built artifacts; run `sha256sum -c docs/persistence-foundation/FILES.sha256` from the repository root.

## API boundaries

- `createCareer` requires explicit different profile/career IDs and returns an empty, validated Foundation state. No automatic creation on load failure.
- `transact` accepts only `developer.treasury.adjust`; request IDs/profile/career/expectedRevision/reason/delta are validated, and accepted payloads remain in receipts. Repeated identical IDs do not apply twice. Unsupported future actions are rejected.
- `makeEnvelope` seals primary/recovery and a sticky provenance registry. `parseEnvelope` is strict external import; `inspectEnvelope` reports individual browser checkpoint damage without writing.
- `CareerStore` receives a storage adapter with `getItem`/`setItem`. Instantiate/open once per UI session. Read `state` for a copied view; do not mutate internal transport fields. `create`, `transaction`, `importSave` and `recover` validate and commit; imports/recovery require strict explicit confirmation flags. The UI supplies its own confirmation dialogs and serializes requests.
- `export()` returns the complete portable envelope and sets `store.exportToken` for the current checkpoint. `acknowledgeExport(token)` records an explicit user assertion; it is not a filesystem write or proof of durability. Manual changes remain gated between checkpoints.
- Only the UI obtains `window.localStorage`, requests downloads and uses Web Locks. The racing engine has no career/storage dependency. Optional complete pending starting data is stored/validated, not applied to the viewer or resumed mid-race.

M1 has no owned assets/roster, championship/economy, persistent injury or Legacy progression. These need separate authorization and explicit future schema/command extensions. No M2 work was undertaken.
