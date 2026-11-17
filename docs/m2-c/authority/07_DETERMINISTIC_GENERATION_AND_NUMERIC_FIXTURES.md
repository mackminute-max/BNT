# M2-C Revision 2 — Deterministic Generation and Numeric Acceptance Fixtures

These fixtures define **expected design results**, not executed tests. Codex must implement source-compatible algorithms, then run tests in Node and browser. No M2-C code has been run for this document.

## A. Initial market counts
| Category | Budget | Standard | Premium | Total |
|---|---:|---:|---:|---:|
| Driver | 2 | 2 | 1 | 5 |
| Beast | 2 | 3 | 1 | 6 |
| Chariot | 1 | 1 | 1 | 3 |
| Specialist | 1 | 1 | 1 | 3 |
| Equipment | 3 | 3 | 0 | 6 |
| **TOTAL** | **9** | **10** | **4** | **23** |

For identical `(careerId, generatorVersion)`, offer list, IDs, stats, role, Q, W, condition and prices must match byte-for-byte under canonical serialization across preview/reload/Node/browser. Career identity is the only career-specific entropy; no race RNG or wall clock. Persist offer price; never reprice consumed offers.

## B. Valuation and offer prices
- Driver Budget reference 200, Q=1.00, H=100: offer = **200 G**.
- Beast Standard reference 325, Q=1.00, H=50: C=0.85, raw 276.25, half-up nearest 5 = **275 G**.
- Chariot Standard reference 625, Q=1.00, H=80: C=0.94, raw 587.50, half-up nearest 5 = **590 G**.
- Specialist Standard reference 375, Q=1.00: **375 G**, independent of any condition.
- Equipment Standard reference 275, Q=1.00: **275 G**, independent of condition.
- Tie rounding: raw 102.5 to nearest 5 = **105**; raw 102.49 = **100**.
- **Corrected starter-migration fixture (R2.1):** Starter beast **Standard** reference 325, native rating mean=50 ⇒ Q=1.00, original H=100 ⇒ acquisition basis **325 G**; current H=50 ⇒ C=0.85, current reference `325 × 1.00 × 0.85 = 276.25 G` ⇒ resale `min(325, floor(0.50 × 276.25))` = **138 G**. A mean of 50 is Standard, not Budget. Preserve the original starter-tier thresholds.
- Starter chariot Standard reference 625, mean=50 ⇒ Q=1.00, H=100 ⇒ basis **625 G**; integrity 80 ⇒ current reference 587.50 ⇒ resale `floor(293.75)` = **293 G** (cap 625). Native condition=100/wear=0 remain unchanged by integrity repair.
- Starter equipment 100 G basis ⇒ **40 G** resale if detached; 10 starter equipment records across five separate careers, never added anew.
- Acquired equipment paid 265 G ⇒ resale `floor(106)` = **106 G**.

## C. Recovery and discounts
- Chariot integrity 95, repair to 100: `ceil(15×5/10)` = **8 G**; with active Mechanic 15% and Workshop 10% discount: 8×0.75=6 ⇒ **6 G**.
- Chariot integrity 80, repair 20: base 30 G; with Mechanic + Workshop: 22.5 G ⇒ **23 G** half-up.
- Driver fatigue 90, recover 25 ⇒ 65, **40 G**; driver fatigue 10 ⇒ 0, **40 G**; fatigue 0 ⇒ reject no effect, 0 charge.
- Beast fatigue 10, care ⇒ 0, **30 G**; active Beast Handler 15% discount: 25.5 ⇒ **26 G**.
- Driver injury Major(2) treatment ⇒ Minor(1), **100 G** base; Physician 15% + Treatment Ward 10% ⇒ **75 G**.
- Beast injury Critical(3) treatment ⇒ Major(2), Treatment Ward 10% ⇒ **72 G**; remains ineligible.
- Chariot wear 10, refurbish ⇒ 0, fixed **100 G** base; wear 0 ⇒ no-effect reject.
- Discount stack never exceeds 25%; final nonzero cost at least 1 G.

## D. Fractional training and engineering
- Driver rating **59.5**, +1 costs **10 XP** (pre-increment below 60); resulting 60.5. Next +1 costs **20 XP**.
- Driver rating 59.5, +2 total 30 XP; Training Grounds discount 10% ⇒ `ceil(27)` = **27 XP**.
- Beast rating 74.5, +2 costs 20+35 = **55 XP**; with Training Grounds ⇒ `ceil(49.5)` = **50 XP**.
- Chariot rating 89.5, +2 costs 200+350 = **550 G**; resulting 91.5; engineering ledger +2.
- Rating 99.5 +1 rejects (would exceed 100), no partial increment, debit or receipt.
- Engineering lifetime ledger at 9, request +2 rejects in full; +1 allowed if rating cap/funds permit.
- Training max 5 per transaction; +6 rejects in full.
- No M2-C XP accrual, wages due, contract expiry or market replenishment.

## E. Migration and transaction integrity
- All five starter packages retain original Gold 1200/850/800/650/750 respectively, their 1/1/1/2/2 drivers, 2/3/2/2/3 beasts, one chariot, two equipment records, one prospective RU and descriptive facility.
- Grandfathered wages by package: Traditional 35; Beastmaster 35; Mechanist 35; Veteran 60 and 35; Scrappy 35 and 20 G per future cycle. All contracts Standard, eight cycles remaining, zero signing/recruitment debit.
- Migration preview, repeated preview and cancellation do not write. Confirmation requires source fingerprint, both revisions and adapter/generator/migration version match; stale preview rejects.
- Migration maintenance revision increments **once**; gameplay revision and gameplay receipt count unchanged; new protected migration identity committed atomically.
- Exact retry with retained receipt returns same result without write; protected ID lacking active receipt yields `ALREADY_COMMITTED`, null receipt; ID conflict rejects. Both old and new histories remain valid.
- Installed equipment sale rejects; explicit detach updates both reciprocal references, then resale can succeed. Chariot resale rejects while RU assigned or equipment installed.
- Run all four mandatory gates with no waived failures, plus quota/import/failure-rollback and deterministic racing parity.
