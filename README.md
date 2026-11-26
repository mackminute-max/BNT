# Blood and Thunder

A fantasy roguelite chariot-racing team management game. You own a racing stable, build Racing Units (a driver, two draft beasts and a chariot), and send them into autonomous, dangerous races across the eight nations of Vaern.

## Quick start

```sh
npm ci
npm run build   # writes dist/blood-and-thunder.html, a single offline file
npm test        # Node test suite
```

Open `dist/blood-and-thunder.html` in Chrome or Edge to play. The single HTML file is the prototyping build; the final release is planned as a desktop app wrapping the same code.

## Layout

| Path | What it holds |
| --- | --- |
| `src/sim/` | Race simulator: movement, contact, combat, damage, weather, incidents |
| `src/ai/` | Autonomous driver AI, Strategy Signs, coaching |
| `src/track/` | Ovals, authored circuits and generated rallies |
| `src/career/` | Stable, economy, markets, championships, rewards, Legacy |
| `src/management/` | Management screens and startup shell |
| `src/presentation/` | Race viewer, Race Radio presentation, content |
| `src/persistence/` | Saving and loading careers |
| `src/dev/batch.js` | Batch race runner used to measure and tune the simulator |
| `content/` | Canon, catalogs and authored content |
| `scripts/` | The build plus fixtures and measurement scripts used by tests |
| `tests/` | Node tests |

## History

Development before this point (milestones M2 through M6-P1) is preserved on the `archive/m6-p1-handoff` branch, including all milestone documents, reports and historical builds. The original `main` (M2-C) is on `archive/main-m2c`.
