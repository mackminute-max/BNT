// Mack 2026-11-27 playtest notes:
// - Training lives on the Staff page and is paid in Reputation or Gold (the
//   player picks). The old XP route had no way to earn XP, so it is gone from
//   Driver Care. Gold costs more than Reputation: GOLD_PER_REP Gold per 1 Rep.
// - Owned drivers, beasts, staff and chariots can be renamed.
import {exact} from '../legacy-state.js';
import {add, decimal} from '../economy/arithmetic.js';

export const TRAINING_RULES = 'm6-training-v1';
export const GOLD_PER_REP = 3;
export const MAX_POINTS = 5;
export const NAME_MAX = 40;

// Reputation price of one point, rising with the rating (rating 50 -> 10 Rep).
export const repPerPoint = rating => Math.max(5, Math.round(Number(rating) / 5));
export function trainingQuote(record, attribute, points, currency) {
  if (!record?.training || !Object.hasOwn(record.attributes ?? {}, attribute)) throw Error('Pick a rating to train');
  if (!Number.isSafeInteger(points) || points < 1 || points > MAX_POINTS) throw Error(`Train 1 to ${MAX_POINTS} points at a time`);
  if (!['rep', 'gold'].includes(currency)) throw Error('Pay with Reputation or Gold');
  const before = Number(record.attributes[attribute]);
  if (before + points > 100) throw Error('Ratings stop at 100');
  let rep = 0;
  for (let i = 0; i < points; i++) rep += repPerPoint(before + i);
  return {attribute, points, before, after: decimal(add(before, points)), currency, cost: currency === 'rep' ? rep : rep * GOLD_PER_REP, rep, gold: rep * GOLD_PER_REP};
}
export const trainingOf = s => s?.m6?.training ?? {version: 1, rules: TRAINING_RULES, spentRep: 0, spentGold: 0, sessions: 0};
export const trainingRepSpent = s => s?.m6?.training?.spentRep ?? 0;

const owned = (s, id) => {
  const r = s.management.registries;
  for (const kind of ['personnel', 'beasts', 'chariots', 'specialists']) if (r[kind]?.[id]) return {kind, record: r[kind][id]};
  return null;
};

export function trainAsset(s, {assetId, attribute, points, currency}, available) {
  if (s.championshipFoundation.activeId) throw Error('Train between Series');
  const a = owned(s, assetId);
  if (!a || !['personnel', 'beasts'].includes(a.kind)) throw Error('Only your own drivers and beasts can train');
  const q = trainingQuote(a.record, attribute, points, currency);
  if (currency === 'rep' && available < q.cost) throw Error(`Needs ${q.cost} Reputation to spend; you have ${available}`);
  if (currency === 'gold' && s.career.treasury < q.cost) throw Error(`Needs ${q.cost} Gold; you have ${s.career.treasury}`);
  s.m6.training ??= {version: 1, rules: TRAINING_RULES, spentRep: 0, spentGold: 0, sessions: 0};
  const t = s.m6.training;
  a.record.training[attribute] += points;
  a.record.attributes[attribute] = decimal(add(a.record.economics.baseAttributes[attribute], a.record.training[attribute]));
  if (currency === 'rep') t.spentRep += q.cost;
  else { t.spentGold += q.cost; s.career.treasury -= q.cost; }
  t.sessions += 1;
  return {assetId, ...q};
}

export function validateTraining(s) {
  const t = s.m6.training;
  if (t === undefined) return;
  exact(t, ['version', 'rules', 'spentRep', 'spentGold', 'sessions']);
  if (t.version !== 1 || t.rules !== TRAINING_RULES || ![t.spentRep, t.spentGold, t.sessions].every(n => Number.isSafeInteger(n) && n >= 0)) throw Error('Invalid training state');
}

export function cleanName(name) {
  const n = String(name ?? '').replace(/\s+/g, ' ').trim();
  if (!n) throw Error('Type a name');
  if (n.length > NAME_MAX) throw Error(`Names are at most ${NAME_MAX} characters`);
  if (/[<>{}\u0000-\u001f]/.test(n)) throw Error('Use letters, numbers and simple punctuation');
  return n;
}
export function renameAsset(s, {assetId, name}) {
  const a = owned(s, assetId);
  if (!a) throw Error('You can only rename your own drivers, beasts, staff and chariots');
  const n = cleanName(name), before = a.record.name;
  a.record.name = n;
  if (s.m6.identities?.[assetId]) s.m6.identities[assetId].name = n;
  const staff = s.m6.presentation?.staff?.[assetId];
  if (staff && 'name' in staff) staff.name = n;
  return {assetId, before, after: n};
}
