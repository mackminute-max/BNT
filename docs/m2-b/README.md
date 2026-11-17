# M2-B review package

- [Implementation report](M2_B_IMPLEMENTATION_REPORT.md)
- [Schema and transaction API](SCHEMA_AND_TRANSACTION_API.md)
- [Windows owner acceptance checklist](WINDOWS_ACCEPTANCE.md)
- [Final owner authorization and exact Draft 3 catalog](FINAL_CODEX_AUTHORIZATION.md)
- [Evidence](evidence/implementation/)
- [Standalone HTML](../../dist/Blood_and_Thunder.html)

Historical preflight, supplied draft and native attribute inspection remain unchanged. Their earlier pending/blocked status is superseded by the final authorization, not rewritten.

## Reproduce

From the repository root, using the existing installed development dependencies:

```sh
npm test
npm run build
node scripts/m2-b-browser.mjs
BNT_M2A_EVIDENCE_DIR=docs/m2-b/evidence/implementation/m2-a-browser node scripts/m2-a-browser.mjs
BNT_PERSISTENCE_EVIDENCE_DIR=docs/m2-b/evidence/implementation/m1-browser node scripts/persistence-browser.mjs
npm run test:browser
```

Browser runners exit 1 when direct file launch is blocked, even if all HTTP functional checks pass; inspect their JSON reports. Do not bypass administrator policy.

For exact M2-A parity, export commit `5e93b2c23ed74000b42d4658c1232cdc10d0f0fb` into an isolated temporary directory (not over the working source), then run:

```sh
BNT_M2A_REFERENCE_DIR=/path/to/exported-m2-a node scripts/m2-b-parity.mjs
```

This compares full captures for 12 completed races, verifies replay, writes reference metadata and gzip-compressed replay JSON. Decompress a `.json.gz` before importing it into the existing replay viewer. `replay-files.json` records compressed SHA-256 hashes. Compression was checked byte-for-byte against each original JSON; it is development evidence packaging, not an application runtime dependency.

Existing `npm run test:browser` writes its normal ignored `artifacts/` output. Retained M2-B racing browser evidence is copied into this directory; historical audit reports are not replaced.
