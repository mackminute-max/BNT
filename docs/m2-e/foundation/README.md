# M2-E limited foundation delivery

Owner-authorized scope: **E0 + minimal E1 + early E4 only**. No championship controller, fees/rewards or later-phase implementation is included.

- [Implementation report](BNT_M2-E_Foundation_Implementation_Report.md)
- [Test evidence](BNT_M2-E_Foundation_Test_Evidence.md)
- [Next-gate readiness](BNT_M2-E_Next_Gate_Readiness.md)
- [Final machine-readable manifest](evidence/final/manifest.json)
- [Preserved specification, addendum and planning authority](authority/)

Verification commands from repository root:

```sh
npm test
npm run build
node scripts/m2-d/verify.mjs
node scripts/m2-e/browser.mjs
```

Evidence-writing scripts should be run in an isolated source copy to preserve existing historical outputs. The foundation browser runner supports `BNT_M2E_EVIDENCE_DIR` for isolated output. Managed Chromium's direct-file restriction causes exit1 even when its HTTP functional assertions pass; inspect the report instead of treating HTTP as file-origin verification.

Both existing `dist/*.html` aliases include the new programmatic `BNT.foundation` namespace. Existing gameplay menus remain unchanged. Browser automatic integration must wrap race-session open+operation in `withRaceSessionLock`; low-level synchronous store methods require single-writer tooling. Missing Web Locks must not silently fall back to uncoordinated automatic writes. No current viewer auto-save or championship UI is claimed.

Local commits only. Merge, push, deployment and later phases require separate owner authorization.
