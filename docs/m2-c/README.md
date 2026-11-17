# M2-C review package

Production implementation uses the owner's explicit authorization and [Revision 2.1](authority/00_START_HERE.md). Historical preflight reports remain unchanged. Their earlier authorization/status wording is historical, not current implementation permission.

- [Implementation report](M2_C_IMPLEMENTATION_REPORT.md)
- [Schema/transaction API](SCHEMA_AND_TRANSACTION_API.md)
- [Windows owner checklist](WINDOWS_ACCEPTANCE.md)
- [Evidence](evidence/implementation/)
- [Standalone HTML](../../dist/Blood_and_Thunder.html)

## Reproduce development verification

```sh
npm test
npm run build
node scripts/m2-c/browser.mjs
BNT_M2B_EVIDENCE_DIR=docs/m2-c/evidence/implementation/m2-b-browser node scripts/m2-b-browser.mjs
BNT_M2A_EVIDENCE_DIR=docs/m2-c/evidence/implementation/m2-a-browser node scripts/m2-a-browser.mjs
BNT_PERSISTENCE_EVIDENCE_DIR=docs/m2-c/evidence/implementation/m1-browser node scripts/persistence-browser.mjs
npm run test:browser
```

Browser scripts intentionally exit 1 if direct file navigation is administrator-blocked even when every HTTP functional check passes. Inspect JSON results; do not bypass browser policy or call HTTP a file-origin test.

Export accepted commit `105bce8a2a8f639b56c703cd75c56ce212471021` into an isolated temporary directory and run:

```sh
BNT_M2B_REFERENCE_DIR=/path/to/exported-m2-b node scripts/m2-c/verify.mjs
```

This saves five full migration manifests/native-adapter comparisons and twelve exact race/replay comparisons with compressed replay evidence. Decompress `.json.gz` files before viewer import.

Golden vectors are frozen in `tests/data/m2-c-market-v1.json`. `scripts/m2-c/golden-reference.py` documents their independent Python reference; ordinary Node tests do not require Python and never regenerate expectations automatically. A deliberate future algorithm change needs a new version and explicit review, not replacement of failing vectors.

`npm run test:browser` writes its normal ignored `artifacts/` output; current review evidence is copied into this directory. Old M2-A/M2-B/audit evidence is not overwritten.
