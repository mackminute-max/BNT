# Optional Windows direct-file architecture probe

This is a diagnostic-only probe in a **fresh disposable browser profile**, not owner acceptance or a new game release. Do not use the diagnostic HTML with a live career. Production game HTML remains unchanged.

1. Obtain the experimental HTML identified in `evidence/source-verification.json` under `exact-state/retained` (the original artifact path contains `e4-architecture-validation-retained`). Check its listed SHA-256. Keep networking disconnected and open it directly as `file:///...` in Windows Chrome or Edge.
2. Its normal game code is the unchanged baseline; do not create/import a career. Open Developer Tools Console and check `typeof EXPERIMENT_WORKER === 'string'`.
3. Create only a disposable embedded worker:

   ```js
   const u = URL.createObjectURL(new Blob([EXPERIMENT_WORKER], {type:'text/javascript'}));
   const w = new Worker(u);
   URL.revokeObjectURL(u);
   w.onmessage = e => console.log(e.data);
   w.onerror = e => console.error(e.message);
   w.postMessage({id:1,message:{type:'connect',name:'EXP-Windows-probe'}});
   ```

   `{connected:true,durable:false}` establishes that the worker could open an empty prefixed test database. It does not establish a saved career or durable gameplay.
4. To probe the worker's existing Web Lock path without granting any assets, send:

   ```js
   w.postMessage({id:2,message:{type:'seed',name:'EXP-Windows-probe',records:[]}});
   ```

   Expected: an error saying **No career authority**, after lock acquisition and database opening. **Existing Web Locks required**, a storage/security error, or worker failure is a compatibility limitation to report. An empty seed must never return a saved career or grant a starting package.
5. Terminate the diagnostic worker with `w.terminate()`. Do not clear real browser storage. Record Windows/browser versions, file path/hash, offline loading, console outputs and any error.

Managed Linux Chromium blocks file navigation, so this probe was **not** performed on Windows by Codex. It does not replace the future integrated gameplay/checkpoint/backup/restore acceptance checklist. The existing main-window lock could remain the sole lock owner in a future actor design; do not acquire the same lock on both sides of an awaited RPC.
