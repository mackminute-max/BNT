# P2.1 reproducible evidence

Final runtime4a9e100d5ca068c99465860b94e8667c655443b7; initial UI53bdbc1; accepted P2 base98423e5/ec25d77. Source and accepted artifacts are protected by build-verification.json. Raw process exits are in commands-and-exits.json.

Final whole-suite run is final-corrective-node.log:694/694, exit0. Baseline is674/674. The initial UI also passed694/694; its separate evidence is retained.

interface-browser-corrective.log has9 actual UI groups, including a real controlled comparison that cannot re-enable Pure Engage. Initial smoke.log is a real pre-freeze boot timeout caused by detached DOM lookup; fixed before delivery, not counted as a pass. Other smoke/keyboard/fault groups pass on the corrective artifact.

art-parity-fast.json is the final corrective12-race proof, including complete native replay hashes; art-parity-fast-53bdbc1.json retains the intermediate proof. Performance JSON/logs ending53bdbc1 preserve the initial short regression run; performance-windows.json and performance-windows-corrective.log are final-source bounded12-window data. summarize-performance.mjs validates fixture identity and produces the final summary. No verification job overlapped those performance windows.

Legacy browser aggregate deliberately remains exit1: P1.1 expects old default zoom6, while accepted P2/P2.1 use8. Original assertions retained; other three legacy children exit0. Its wrapper exposes both internal views only for old selectors; actual navigation is tested separately. Do not describe the browser inventory as entirely green.

file:// was attempted and blocked by managed policy. Windows Chrome/Edge owner acceptance remains pending. DPR/CSS zoom is not browser-toolbar-zoom proof. No owner saves were used; durable tests use fresh synthetic fixtures and the unchanged accepted companion.

See scripts/p2-1/README.md for commands and historical reference/fixture reconstruction. No old test, native golden, dependency, save schema, record or accepted P2 artifact was modified.
