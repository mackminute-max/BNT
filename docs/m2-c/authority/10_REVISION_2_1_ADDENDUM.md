# M2-C Handoff Revision 2.1 — Targeted Corrections and Implementation Gate

**Status: DOCUMENTATION CORRECTION ONLY — NOT CODEX IMPLEMENTATION AUTHORIZATION.**

This addendum follows Codex's **2026-11-17 Revision 2 read-only preflight** (`Pasted text(2).txt` supplied by the owner). Revision 2.1 changes **one erroneous numeric acceptance fixture** and clarifies the **first source-level implementation gate**. It does not change the approved economy, native racing formulas, schema-version strategy, or M2-B behavior.

## R2.1-01 — Corrected starter beast fixture (authoritative)

The prior `07_DETERMINISTIC_GENERATION_AND_NUMERIC_FIXTURES.md` described a starter beast with mean native rating **50** as **Budget**. This conflicts with the approved **starter** tier classification: Budget mean <45; Standard mean 45–<65; Premium mean ≥65. **Generated market offer tiers are separate explicit metadata and do not change starter classification.**

The valid **starter migration / resale fixture** is:

| Field | Expected |
|---|---:|
| Native base rating mean | 50 |
| Starter tier | Standard |
| Standard beast reference price | 325 G |
| Permanent quality `Q = clamp(0.85 + 0.003 × 50, 0.85, 1.15)` | 1.00 |
| Original valuation health `H` | 100 |
| Original condition factor `C(100)` | 1.00 |
| Immutable starting acquisition basis, nearest 5 G | 325 G |
| Current valuation health `H` | 50 |
| Current condition factor `C(50)` | 0.85 |
| Current reference valuation | 276.25 G |
| `floor(0.5 × currentReferenceValuation)` | 138 G |
| Resale cap (original basis) | 325 G |
| **Final resale proceeds** | **138 G** |

The corrected line is also applied directly to file `07`. The old **150 G basis / 63 G resale** result is **not** an acceptable starter fixture for mean 50. Do not reclassify mean 50 as Budget or modify the starter tier rule to preserve the old result.

Acceptance must include an assertion that mean 50 classifies as Standard and a separate arithmetic assertion for the 325 G / 138 G outcome.

## R2.1-02 — Protected maintenance history: first implementation-stage gate

Codex verified that the current M2-B helpers assume **gameplay** transactions:
- `src/career/history.js:17–32` validates gameplay-shaped protected entries, `resultRevision = expectedRevision + 1`, and v0/v1 command semantics.
- `src/career/legacy-state.js:60–68` requires gameplay revision to equal gameplay transaction count.
- `src/persistence/envelope.js:38–40` and `src/career/schema2.js:93–101` impose additional provenance and history-overlay assumptions.
- `src/career/history.js:70–74` looks up committed gameplay receipts; maintenance acknowledgments need their own typed lookup.

**Required first implementation gate, only after separate explicit authorization:** establish a strictly discriminated, additive protected **maintenance** record validator/dispatcher alongside unchanged legacy gameplay validation, using protected-history outer schema v1 **only if demonstrated compatible**.

Prove with focused automated tests before implementing persistent M2-C migration:
1. Original protected v0/v1 gameplay entries remain byte-for-byte unchanged and strictly validated; malformed legacy entries still reject.
2. A migration maintenance record is not appended to the gameplay `transactions` ledger and does not create a gameplay receipt.
3. Successful migration increments maintenance revision **once**, leaves gameplay revision and gameplay receipt count unchanged, and atomically protects the migration identity.
4. Maintenance identities count toward the shared **2000 protected identities** limit; gameplay receipts retain their **1000** limit; no history pruning.
5. Typed maintenance acknowledgments support exact retry (same acknowledgment when retained); if only protected identity remains, `ALREADY_COMMITTED` with null acknowledgment and **no replay**; conflicting reuse rejects.
6. Import/recovery/history overlay preserve maintenance protection and legacy gameplay history without inserting maintenance records into schema-2 gameplay projections; old checkpoints cannot re-grant.
7. Source career fingerprint and both revisions are revalidated at confirmation; a mismatch rejects without mutation.
8. Failure or storage denial preserves prior authoritative bytes, economic state and protected history. The **8 MiB** import envelope limit and manual fallback remain intact.

**Stop condition:** If a compatible additive record cannot be represented while preserving old protected-history schema v1 semantics, **stop implementation of this feature and request explicit owner approval for a protected-history schema increment**. Do not silently change outer schema version, relax old validators, forge a gameplay revision or fabricate a gameplay receipt.

This gate clarifies the existing R2-07 decision; it is **not** a claim that Codex has implemented or proven the extension. Existing command v1 behavior and future M2-C gameplay command v2 remain separate.

## Precedence and disposition

1. Owner-approved M2-C-01..36 and R2-01..R2-08 remain authoritative.
2. This R2.1 addendum and the corrected fixture in `07` supersede the single contradictory starter beast fixture in Revision 2.
3. No other Revision 2 mechanics or fixtures are changed.
4. The Revision 2 read-only preflight reported **293/293** M2-B tests passing at HEAD `105bce8a2a8f639b56c703cd75c56ce212471021`. Those results are **Codex-reported baseline evidence**, not newly executed Revision 2.1 tests.
5. The deterministic market PRNG, draw order and golden vectors still require implementation-stage freezing and cross-runtime acceptance as previously specified.
6. All four M2-C acceptance gates remain mandatory; no M2-C tests have been executed by preparing this package.

**Authorization boundary:** This handoff is ready for the owner to review or give to Codex. It **does not** authorize source edits, implementation, migrations, commits, PRs or deployment. Any implementation requires a separate explicit owner instruction.
