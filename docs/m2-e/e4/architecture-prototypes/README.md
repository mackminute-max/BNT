# M2-E4 persistence architecture research

**Proposal only; no production architecture change.** Runtime remains `b8c090057052ac03bbed73d9487093da61381451` on `feat/m2-e-e4-persistence-recovery`.

- [Architecture analysis, risks, implementation and migration proposal](BNT_M2-E4_Persistence_Architecture_Proposal.md)
- [Prototype comparisons and performance results](BNT_M2-E4_Prototype_Results.md)
- [Memory and storage analysis](BNT_M2-E4_Memory_Storage_Analysis.md)
- [Save/replay compatibility and test evidence](BNT_M2-E4_Compatibility_and_Test_Evidence.md)
- [Optional Windows direct-file probe](WINDOWS_PROTOTYPE_PROBE.md)
- [Executable experiment documentation](../../../../experiments/e4-architecture/README.md)

Prototype source freeze: `e10e9a662e4d7f25a9f6c8a9aa63e92cc35ba193`. The recommended next gate is bounded private exact-state validation reuse; no format replacement is recommended yet.

Evidence is retained in `evidence/` with a hash manifest. Failed positional-page and preliminary diagnostic results remain visible; they are not replaced by selected positive results. Controlled timing runs are separate from inspector memory and fault tests. The experimental HTML is a diagnostic harness containing unmodified game code, not a new game release or an approved save format. Use only a disposable browser profile; do not use a live career.

No E5/E6 work, production integration, merge, push, release or deployment was performed. Owner authorization is required for any implementation of the proposed production changes.
