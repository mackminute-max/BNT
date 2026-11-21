import {compactOrder} from './model.js';
export function paintCompactStandings(source, target, {entries = [], playerId, tick}) {
  const values = [...source.children].map(row => ({
    position: row.children[0]?.textContent ?? '—', id: row.children[1]?.textContent
  })).filter(row => typeof row.id === 'string' && row.id);
  const projected = compactOrder(values, entries, playerId);
  const existing = new Map([...target.children].map(row => [row.dataset.entryId, row]));
  for (const [index, value] of projected.entries()) {
    let row = existing.get(value.id);
    if (!row) { row = document.createElement('tr'); row.append(document.createElement('td'), document.createElement('td')); }
    row.dataset.entryId = value.id; row.dataset.player = String(value.player);
    row.className = value.player ? 'player' : '';
    const labels = [value.position, value.name];
    labels.forEach((text, i) => { if (row.children[i].textContent !== text) row.children[i].textContent = text; });
    row.children[1].title = value.name;
    row.children[1].setAttribute('aria-label', `${value.name}; racing unit ${value.id}${value.player ? '; player stable' : ''}`);
    row.dataset.identitySource = value.known ? 'race-entry-organization' : 'unavailable';
    if (target.children[index] !== row) target.insertBefore(row, target.children[index] ?? null);
    existing.delete(value.id);
  }
  for (const row of existing.values()) row.remove();
  target.dataset.presentedTick = String(tick);
  return projected;
}
