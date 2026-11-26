# GitHub, repository and build setup

## Repository state

- Remote `origin`: https://github.com/mackminute-max/BNT.git
- Audited runtime/delivery source: `05e779f6eef0aa1f8117f1402d0841e83a9c7c80` (`Stabilize M6-P1 recruitment, race identities and spectator workflows`).
- Current branch: `feat/e5-d-m1-startup-slots-options`. Remote branch was verified at the same SHA during audit.
- Remote default `main`: `f66ec90a6659dd6bb675815bff4cc33e9850a643`, old accepted M2-C. It does not contain the delivered modern game.
- Previous delivery: `0c29a65a7cf8bdf0ced1821eb59da314981507f6` M6. `813f7b0aee8dbe58c7b53184934170b38a051a48` added M7 audit documentation. `41ed977` is the earlier M5 consolidated delivery.
- Numerous historical feature branches remain; `audit-checks/remote-branches.txt` records actual remote refs, while `local-branches.txt` records checkout refs. Milestone names and directory names do not necessarily match the active branch name.
- No GitHub release, merge or deployment is created by this package. Single-file playable artifacts are committed under `dist/`.

## Repository layout

`src/` implementation; `tests/` Node regressions; `scripts/` versioned builds, browser runners and diagnostics; `content/` catalogs and authoring sources; `docs/` authority, reports/raw evidence and historical milestone records; `reports/` older exports; `assets/` and `art-source/` existing art resources; `experiments/e4-architecture/` isolated nonproduction prototypes; `exports/` prior packaged data. `.gitignore` ignores `node_modules/` and `artifacts/`. Root numbered briefs/DEVELOPMENT/status files mostly precede current M6 and must be read with their historical context.

## Toolchain and actual commands

ES module package `blood-and-thunder`, declared version0.6.0. Development dependencies pinned in package-lock: esbuild0.28.2 and playwright-core1.65.1. No runtime npm dependency, framework or mandatory server. Observed Node v24.22.1 / npm11.9.0 on Linux. Browsers are separate system installations; playwright-core does not bundle one. Current M6-P1 scripts explicitly use `/usr/bin/chromium` and headless `--no-sandbox` in this managed environment.

Existing commands (descriptions, not a new development plan):

```sh
npm ci
npm test
node scripts/m6-p1/build.mjs
node scripts/m6-p1/references.mjs
node scripts/m6-p1/clock-parity.mjs
node scripts/m6-p1/run-checks.mjs
node scripts/m6-p1/accepted-regressions.mjs
```

`npm test` is `node --test tests/*.test.js`. `npm run build` invokes historical `scripts/build.mjs`, not the latest M6-P1 packaging. `npm run check` therefore also targets an older build/browser path; it is not synonymous with M6-P1 acceptance. `package.json` milestone aliases stop at older E5 builds. Exact current browser commands and raw exits are in the command ledger.

Latest build adapts `scripts/e5-d/m4/build.mjs` into `scripts/m6-p1/build.generated.mjs`; it invokes M3-A copy and M3-BC presentation compilation, adds M6 flags and `scripts/m6/viewer-presentation.mjs`, and embeds the inline persistence Worker. This script composition and source-string replacement is existing implementation, not a newly introduced architecture. It is brittle/version-coupled technical debt. Historical HTML files under `dist/` are checksum-guarded inputs, including P2.2 practice and accepted E5/M4/M5/M6 artifacts; a source-only checkout lacking those cannot reproduce this build. They are included in the source snapshot.

The HTML contains embedded viewer/practice markup and scripts, CSS and Worker source. Build offline checks reject external runtime assets/imports. Build twice/cmp was exit0 for the published runtime. This documentation audit verifies its exact artifact bytes instead of rebuilding or altering it.

## Environment coupling

Many diagnostics write to absolute `/workspace/deliverables/bnt-m6-p1/evidence` and some compare modules in `/tmp/bnt-m6-p1-baseline` or `/tmp/bnt-m6-p1-acceptance`. Those directories are test-run context, not installed runtime dependencies or GitHub paths. Frozen source hashes and logs are archived; transient /tmp checkouts are not required to play the HTML. Browser tests use ephemeral local HTTP servers; they do not establish Windows direct-file acceptance.

## Working-tree preservation

Four pre-existing modified evidence files, one untracked old M2-E audit and an untracked Python cache remain outside the runtime commit. Exact paths/status and hashes are recorded in audit-checks. They were not published as new implementation or silently reverted. Source snapshot is taken from Git's committed object tree, not by indiscriminately copying this dirty workspace. No credentials, .git, node_modules, browser profiles, IndexedDB databases or personal owner saves are included.
