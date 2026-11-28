// Reputation upgrade trees (Phase 4c, Mack 2026-11-27): every buying page (Market,
// Staff, Workshops) has its own tree, bought with Reputation from the same wallet
// the factions use. Each branch either cuts prices or opens higher tiers. They are
// meant to be expensive: a top branch is a long-term goal, not an impulse buy.
// Like faction unlocks, upgrades are bought between Series and never refunded.
import {exact} from '../legacy-state.js';

export const UPGRADE_RULES = 'bnt-upgrades-v1';
const u = (id, page, branch, tier, name, text, cost, value, after = null) => Object.freeze({id, page, branch, tier, name, text, cost, value, after});
export const UPGRADE_TREES = Object.freeze({
  market: {name: 'Market Connections', job: 'Better prices and better stock for beasts, chariots and equipment.', nodes: [
    u('haggle-1', 'market', 'haggle', 1, 'Haggler', '5% off every beast, chariot and piece of equipment you buy.', 60, 5),
    u('haggle-2', 'market', 'haggle', 2, 'Hard Bargainer', '10% off beasts, chariots and equipment (replaces Haggler).', 150, 10, 'haggle-1'),
    u('haggle-3', 'market', 'haggle', 3, 'Dealer’s Friend', '15% off beasts, chariots and equipment (replaces Hard Bargainer).', 300, 15, 'haggle-2'),
    u('eye-1', 'market', 'eye', 1, 'Trader’s Eye', 'The Market stocks one quality grade above what your Reputation alone allows, from the next renewal.', 150, 1),
    u('eye-2', 'market', 'eye', 2, 'Private Stockyards', 'Two quality grades above your Reputation grade, from the next renewal.', 400, 2, 'eye-1'),
  ]},
  staff: {name: 'Staff Network', job: 'Cheaper signings and kinder contracts for drivers and specialists.', nodes: [
    u('agent-1', 'staff', 'agent', 1, 'Agent’s Cut', '5% off signing drivers and specialists.', 60, 5),
    u('agent-2', 'staff', 'agent', 2, 'Trusted Agent', '10% off signing drivers and specialists (replaces Agent’s Cut).', 150, 10, 'agent-1'),
    u('agent-3', 'staff', 'agent', 3, 'Kingmaker', '15% off signing drivers and specialists (replaces Trusted Agent).', 300, 15, 'agent-2'),
    u('handshake', 'staff', 'terms', 1, 'Handshake Deals', 'No signing fee on standard or long contracts.', 120, 1),
  ]},
  facilities: {name: 'Builders’ Guild', job: 'Cheaper buildings and lower running costs for your facilities.', nodes: [
    u('guild-1', 'facilities', 'guild', 1, 'Guild Rates', '10% off building and upgrading facilities.', 80, 10),
    u('guild-2', 'facilities', 'guild', 2, 'Master Builder', '20% off building and upgrading facilities (replaces Guild Rates).', 200, 20, 'guild-1'),
    u('lean-1', 'facilities', 'lean', 1, 'Lean Upkeep', 'Facility upkeep 25% lower.', 80, 25),
    u('lean-2', 'facilities', 'lean', 2, 'Self-Sufficient', 'Facility upkeep 50% lower (replaces Lean Upkeep).', 200, 50, 'lean-1'),
  ]},
});
export const UPGRADE_PAGES = Object.freeze(Object.keys(UPGRADE_TREES));
export const UPGRADES_BY_ID = Object.freeze(Object.fromEntries(UPGRADE_PAGES.flatMap(p => UPGRADE_TREES[p].nodes.map(n => [n.id, n]))));

export const upgradesOf = s => s?.m6?.upgrades ?? {version: 1, rules: UPGRADE_RULES, owned: [], spent: 0};
export const upgradeSpent = s => s?.m6?.upgrades?.spent ?? 0;
export const hasUpgrade = (s, id) => !!s?.m6?.upgrades?.owned?.includes(id);
// The best tier owned in a branch, as that node's value (0 when none is owned).
export function branchValue(s, page, branch) {
  const owned = s?.m6?.upgrades?.owned ?? [];
  return UPGRADE_TREES[page].nodes.filter(n => n.branch === branch && owned.includes(n.id)).reduce((v, n) => Math.max(v, n.value), 0);
}
export const marketCut = s => branchValue(s, 'market', 'haggle');
export const gradeBonus = s => branchValue(s, 'market', 'eye');
export const signingCut = s => branchValue(s, 'staff', 'agent');
export const noSigningFee = s => hasUpgrade(s, 'handshake');
export const buildCut = s => branchValue(s, 'facilities', 'guild');
export const upkeepCut = s => branchValue(s, 'facilities', 'lean');
export const cut = (price, pct) => price - Math.floor(price * pct / 100);

export function buyUpgrade(s, {upgradeId}, available) {
  if (s.championshipFoundation.activeId) throw Error('Spend Reputation between Series');
  const n = UPGRADES_BY_ID[upgradeId];
  if (!n) throw Error('Unknown upgrade');
  s.m6.upgrades ??= {version: 1, rules: UPGRADE_RULES, owned: [], spent: 0};
  const g = s.m6.upgrades;
  if (g.owned.includes(n.id)) throw Error('Already owned');
  if (n.after && !g.owned.includes(n.after)) throw Error('Buy the previous tier first');
  if (available < n.cost) throw Error(`Needs ${n.cost} Reputation to spend`);
  g.owned.push(n.id);
  g.spent += n.cost;
  return {upgradeId: n.id, cost: n.cost, page: n.page};
}

export function validateUpgrades(s) {
  const g = s.m6.upgrades;
  if (g === undefined) return;
  exact(g, ['version', 'rules', 'owned', 'spent']);
  if (g.version !== 1 || g.rules !== UPGRADE_RULES || !Array.isArray(g.owned) || g.owned.length > Object.keys(UPGRADES_BY_ID).length) throw Error('Invalid upgrades state');
  if (new Set(g.owned).size !== g.owned.length || g.owned.some(id => !UPGRADES_BY_ID[id] || (UPGRADES_BY_ID[id].after && !g.owned.includes(UPGRADES_BY_ID[id].after)))) throw Error('Invalid upgrades owned');
  if (g.spent !== g.owned.reduce((t, id) => t + UPGRADES_BY_ID[id].cost, 0)) throw Error('Invalid upgrades spent');
}
