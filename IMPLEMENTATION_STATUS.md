# Milestone 4 — audit-remediation update

**Current simulation: 0.4.1-m4. Implementation available for review; final acceptance remains BLOCKED by T25 direct offline launch verification.**

The three behavioral defects from the establishment-documents audit are fixed: lateral incident hazards now block movement and resolve consequences, unsafe seed ranges reject promptly, and sign compliance reflects effective executed pace. The required twenty named scenario fixtures now contain reproducible normalized setups and expected invariants.

Executed verification: **114 tests passed**, **19 functional browser checks passed**, and **16 full reference races completed without integrity errors or stalls**. The original defect probes no longer reproduce A01–A03. Chromium still denies actual `file://` navigation; HTTP diagnostic checks do not satisfy that release gate.

The rebuilt standalone artifact is [dist/Blood_and_Thunder.html](dist/Blood_and_Thunder.html), **158,915 bytes**, SHA-256 `5180387f5cb623e5ae920d8e307a9fd0244b61fb7a6580f0f44c1649dbf23e1d`.

See the [M4 update report](reports/MILESTONE_4_UPDATE.md) for changes, commands, test evidence, reference checksums and remaining limitations. The [original M4 report](reports/MILESTONE_4_ORIGINAL.md) and [audit](docs/audits/ESTABLISHMENT_DOCUMENTS_AUDIT.md) describe historical snapshots. Old-version replays must not be interpreted as current-engine acceptance evidence.

No original production specification was changed. No environment was published, no Git push was made, and broader stable/campaign progression remains outside this approved prototype.
