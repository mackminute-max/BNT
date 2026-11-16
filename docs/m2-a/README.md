# M2-A review delivery

**Authorized scope: M2-A only, then stop for owner review.** The supplied draft's NOT AUTHORIZED header is superseded only for this stage by the owner's explicit request; it does not authorize M2-B–E.

- [Implementation and verification report](M2_A_IMPLEMENTATION_REPORT.md)
- [Schema/migration/transaction/reference contract](SCHEMA_AND_TRANSACTION_API.md)
- [Windows acceptance checklist](WINDOWS_ACCEPTANCE.md)
- [Original supplied draft](SUPPLIED_M2_REVIEW_DRAFT_1.md)
- [Standalone HTML](../../dist/Blood_and_Thunder.html)

## Reproduce verification

From the repository root, with the existing locked development dependencies installed:

```sh
node --test tests/persistence.test.js tests/m2-a.test.js
npm test
npm run build
node scripts/m2-a-browser.mjs
BNT_PERSISTENCE_EVIDENCE_DIR=docs/m2-a/evidence/m1-browser node scripts/persistence-browser.mjs
npm run test:browser
```

Browser commands intentionally return nonzero when managed policy denies the required actual direct-file launch, even when their separately labelled HTTP functional diagnostics pass. No policy bypass was attempted. The M1 evidence-directory override prevents overwriting historical M1 reports/screenshots; it changes no test assertions. Retained racing browser output goes to ignored `artifacts/`, with a copy under this evidence directory.

`evidence/` contains the baseline/final logs, 28 new and 25 retained focused cases, 12 new/18 M1/23 retained racing browser groups, representative synthetic original/migrated JSON saves and a migration-review screenshot. Those saves are developer test fixtures, not an approved starting package. `manifest.json` records source/version/hash scope and verification. `FILES.sha256` covers the implementation, tests, documents/evidence and standalone files; check it from the repository root with `sha256sum -c docs/m2-a/FILES.sha256`.

No historical audits or prior study evidence were rewritten. No M2-B initialization/asset grants, management gameplay, history-compaction executor, championship integration, publication, commit or push is included.
