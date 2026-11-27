// Trackside events (Phase 4): a deck of short events with choices and risk.
// After each Series closes, one card is drawn. It waits on the Home Stable page
// until you answer it (or the next Series closes and replaces it). Outcomes move
// Gold, Reputation, faction favor, the condition of your stable, and your rivals.
import {fingerprint} from '../cycles/contracts.js';
import {addFavor} from './factions.js';
import {GRUDGES} from './rivalry.js';

export const EVENT_RULES = 'bnt-events-v1';
const roll = (...k) => parseInt(fingerprint([EVENT_RULES, ...k]).slice(0, 8), 16) % 100;
const SEEN = 20, LOG = 10;
// Effects: ['gold',n] ['rep',n] ['favor',faction|'house',n] ['beasts',n] ['drivers',n] ['chariots',n]
// ['injure','beast'|'driver',level] ['rivalForm',n] ['rivalOut'] ['grudge',n]
// A choice may have `cost` (Gold, paid first) and `risk` {chance, win, lose, winText, loseText}.
export const EVENTS = Object.freeze({
  fixer: {title: 'The Fixer', rival: true, text: 'A man in a good coat finds you behind the stands. For a price, {rival} will have a very bad week before your next meeting.', choices: [
    {label: 'Pay him (150 Gold)', cost: 150, risk: {chance: 70, win: [['rivalOut'], ['grudge', 1]], winText: 'Word comes that {driver} slipped on a stable stair. They will sit out the next Series.', lose: [['favor', 'authority', -20], ['rep', -5]], loseText: 'The man was an Authority informer. Your name is on a list now.'}},
    {label: 'Send him away', effects: [['favor', 'authority', 3]], text: 'He shrugs and walks off toward the {team} stables.'},
    {label: 'Report him to the stewards', effects: [['favor', 'authority', 6], ['favor', 'ring', -6]], text: 'The stewards thank you. The Ring will not.'}]},
  quack: {title: 'The Quack Healer', text: 'A traveling healer swears his green tonic will put fire back in your drivers.', choices: [
    {label: 'Buy the tonic (60 Gold)', cost: 60, risk: {chance: 50, win: [['drivers', 20]], winText: 'Astonishingly, it works. Your drivers feel ten years younger.', lose: [['injure', 'driver', 'Minor']], loseText: 'One of your drivers spends the night groaning. It was mostly turpentine.'}},
    {label: 'Run him off', text: 'He curses your stable in three languages and leaves.'}]},
  wild: {title: 'Beast Gone Wild', text: 'One of your beasts has smashed its stall and is loose in the yard, kicking anything that moves.', choices: [
    {label: 'Calm it yourself', risk: {chance: 60, win: [['rep', 2]], winText: 'You talk it down. The stable hands are impressed.', lose: [['injure', 'driver', 'Minor']], loseText: 'It calms down eventually, after flattening one of your drivers.'}},
    {label: 'Pay a handler (80 Gold)', cost: 80, text: 'The handler has it back in its stall in minutes.'},
    {label: 'Let it run itself out', effects: [['beasts', -15], ['rep', 2]], text: 'It runs through the market and the town talks of nothing else. Your beasts are rattled.'}]},
  sponsorBlood: {title: 'A Sponsor Wants Blood', rival: true, text: 'A wealthy sponsor will pay handsomely if you make an example of {team}. Publicly. Loudly.', choices: [
    {label: 'Take the money', effects: [['gold', 250], ['favor', 'authority', -8], ['grudge', 1]], text: 'The Gold is real. So is the look {driver} gives you at the next weigh-in.'},
    {label: 'Decline', effects: [['favor', 'authority', 2]], text: 'The sponsor finds someone less fussy.'}]},
  brawl: {title: 'Brawl in the Stands', text: 'Fans wearing your colours started a brawl. The constables want someone to pay for the benches.', choices: [
    {label: 'Pay the damages (100 Gold)', cost: 100, effects: [['favor', 'authority', 3]], text: 'The benches are mended and the stewards are pleased.'},
    {label: 'Claim them proudly', effects: [['rep', 4], ['favor', 'authority', -6]], text: 'The crowd loves you. The stewards do not.'}]},
  taunt: {title: 'A Rival’s Taunt', rival: true, text: '{driver} of {team} tells a tavern full of people that your stable races like old men on donkeys.', choices: [
    {label: 'Answer in kind', effects: [['grudge', 1], ['rep', 3]], text: 'Your reply is quoted all over town. {team} is not laughing.'},
    {label: 'Ignore it', text: 'You let your racing do the talking.'},
    {label: 'Buy them a drink', effects: [['grudge', -1], ['rep', -2]], text: 'Some call it gracious. Some call it soft.'}]},
  tip: {title: 'The Gambler’s Tip', text: 'A sweaty man swears he knows how tomorrow’s card will finish. Fifty Gold for the name.', choices: [
    {label: 'Pay for the tip (50 Gold)', cost: 50, risk: {chance: 40, win: [['gold', 200], ['favor', 'ring', 2]], winText: 'The tip comes in. You collect 200 Gold.', lose: [], loseText: 'The tip finishes last. So does your fifty Gold.'}},
    {label: 'Keep your purse shut', text: 'He tries the next stable down.'}]},
  oldChampion: {title: 'The Old Champion', text: 'A retired champion offers to spend a week with your drivers, for a fee and a bottle.', choices: [
    {label: 'Hire her (120 Gold)', cost: 120, effects: [['drivers', 15], ['rep', 3]], text: 'Your drivers come back sharper and full of stories.'},
    {label: 'No thank you', text: 'She tips her hat and heads for the next stable.'}]},
  feed: {title: 'Cheap Feed', text: 'A merchant has oats at half price. He won’t say where they came from.', choices: [
    {label: 'Buy it (40 Gold)', cost: 40, risk: {chance: 70, win: [['beasts', 15]], winText: 'The beasts love it. Coats shine.', lose: [['beasts', -10]], loseText: 'The oats were mouldy. Your beasts are off their food.'}},
    {label: 'Stick with your usual supplier', text: 'Safe and dull.'}]},
  wheelwright: {title: 'The Wheelwright’s Offer', text: 'A master wheelwright has a quiet week and offers to go over your chariots at a discount.', choices: [
    {label: 'Hire him (100 Gold)', cost: 100, effects: [['chariots', 25]], text: 'Every chariot comes back tighter and truer.'},
    {label: 'Not now', text: 'He shrugs. His loss.'}]},
  storm: {title: 'Storm Damage', text: 'A storm tears half the roof off your barn in the night.', choices: [
    {label: 'Repair it properly (120 Gold)', cost: 120, text: 'The barn is better than before.'},
    {label: 'Patch it with tarps', effects: [['beasts', -12]], text: 'The tarps leak. Your beasts spend a cold, wet week.'}]},
  journalist: {title: 'The Journalist', text: 'A writer from the racing sheets wants an interview about your season.', choices: [
    {label: 'Boast', effects: [['rep', 5], ['grudge', 1]], rival: true, text: 'Great copy. {team} pins it to their stable door.'},
    {label: 'Stay modest', effects: [['rep', 2]], text: 'A fair piece. Nobody is offended.'}]},
  dive: {title: 'The Bookie’s Offer', text: 'The Ring wants a quiet favor: an envelope of Gold, and you agree to have an off night sometime soon.', choices: [
    {label: 'Take the envelope', effects: [['gold', 200], ['favor', 'ring', 8], ['favor', 'authority', -10]], text: 'Nobody can prove a thing. Yet.'},
    {label: 'Refuse', effects: [['favor', 'ring', -3], ['favor', 'authority', 2]], text: 'The bookie’s smile does not reach his eyes.'}]},
  memorial: {title: 'A Memorial Ride', text: 'The local stables ride a slow lap for the drivers lost this year. They ask you to lead it.', choices: [
    {label: 'Lead the ride (50 Gold)', cost: 50, effects: [['rep', 4], ['favor', 'house', 5]], text: 'A solemn, proud afternoon. People remember who showed up.'},
    {label: 'Send flowers instead', effects: [['rep', 1]], text: 'Polite, if a little distant.'}]},
  thieves: {title: 'Stolen Tack', text: 'Thieves broke into the tack room. They are still in the lane outside with your best harness.', choices: [
    {label: 'Chase them', risk: {chance: 50, win: [['rep', 2]], winText: 'You catch them in the market square, to a round of applause.', lose: [['injure', 'driver', 'Minor']], loseText: 'They get away, and one of your drivers twists an ankle in the chase.'}},
    {label: 'Hire guards (70 Gold)', cost: 70, text: 'The guards recover most of it, and the tack room has a lock now.'},
    {label: 'Let it go', effects: [['gold', -60]], text: 'You buy new harness. Expensive lesson.'}]},
  hillHealer: {title: 'The Hill Healer', text: 'A real healer, with a real reputation, is passing through town.', choices: [
    {label: 'Hire her (100 Gold)', cost: 100, effects: [['beasts', 15], ['drivers', 15]], text: 'Aches fade, cuts close. Worth every coin.'},
    {label: 'You can’t spare it', text: 'She moves on.'}]},
  egg: {title: 'The Strange Egg', text: 'A trader sells a huge speckled egg he swears is from a thunderbird.', choices: [
    {label: 'Buy it (80 Gold)', cost: 80, risk: {chance: 30, win: [['gold', 300]], winText: 'A collector pays 300 Gold for it before you’ve even unpacked it.', lose: [], loseText: 'It was a painted rock. A very nice painted rock.'}},
    {label: 'Laugh at him', text: 'He sells it to the stable next door.'}]},
  inspection: {title: 'Stewards’ Inspection', text: 'The stewards arrive unannounced to inspect your chariots and books.', choices: [
    {label: 'Cooperate', risk: {chance: 50, win: [['favor', 'authority', 5]], winText: 'Everything in order. The stewards leave impressed.', lose: [['gold', -80], ['favor', 'authority', 2]], loseText: 'They find a cracked axle you missed. An 80 Gold fine.'}},
    {label: 'Slip them something (60 Gold)', cost: 60, risk: {chance: 70, win: [], winText: 'The inspection is very short.', lose: [['favor', 'authority', -15]], loseText: 'One of them was honest. The Authority is not amused.'}}]},
  charity: {title: 'The Charity Race', text: 'The town holds a race for the orphans of fallen drivers. They ask for a donation.', choices: [
    {label: 'Donate (100 Gold)', cost: 100, effects: [['rep', 6], ['favor', 'house', 6]], text: 'Your name is read out to cheers.'},
    {label: 'Decline', text: 'You have your own mouths to feed.'}]},
  fever: {title: 'Beast Fever', text: 'A fever is going round the stables. Two of your beasts are coughing.', choices: [
    {label: 'Quarantine and treat (90 Gold)', cost: 90, text: 'It burns out before it spreads.'},
    {label: 'Keep working them', effects: [['beasts', -20]], risk: {chance: 75, win: [], winText: 'They pull through, barely.', lose: [['injure', 'beast', 'Major']], loseText: 'One of them is seriously ill.'}}]},
  defector: {title: 'The Defector', rival: true, text: 'A mechanic from {team} wants to switch sides, and he’ll bring their secrets with him.', choices: [
    {label: 'Pay for the secrets (120 Gold)', cost: 120, effects: [['rivalForm', -2], ['grudge', 1]], text: 'You learn exactly where their chariots are weak. {team} finds out who told you.'},
    {label: 'Send him back', effects: [['favor', 'authority', 2]], text: 'Loyalty is worth something.'}]},
  drunk: {title: 'A Driver’s Night Out', text: 'One of your drivers started a fight in a tavern and broke a table over a constable.', choices: [
    {label: 'Pay the fine (70 Gold)', cost: 70, text: 'Quietly settled.'},
    {label: 'Defend your driver', effects: [['rep', 2], ['favor', 'authority', -5], ['drivers', -10]], text: 'The crowd cheers your loyalty. Your driver nurses a black eye.'}]},
  banquet: {title: 'The Patron’s Banquet', text: 'A rich patron invites you to a banquet. Fine wine, finer company, and a seating plan full of traps.', choices: [
    {label: 'Attend', risk: {chance: 60, win: [['rep', 4], ['gold', 100]], winText: 'You charm the room and leave with a purse.', lose: [['rep', -2]], loseText: 'You insult the host’s cousin. Loudly.'}},
    {label: 'Plead a sore throat', text: 'You eat bread at home. It’s fine.'}]},
  curse: {title: 'The Track Curse', text: 'An old priest says your stable has been cursed by a rival. A blessing costs forty Gold.', choices: [
    {label: 'Pay for the blessing (40 Gold)', cost: 40, effects: [['rep', 1]], text: 'He sings over your chariots. You feel nothing, but the stable hands sleep better.'},
    {label: 'Curses aren’t real', risk: {chance: 80, win: [], winText: 'Nothing happens. Probably.', lose: [['beasts', -10]], loseText: 'The beasts go skittish for a week. Coincidence, surely.'}}]},
  pit: {title: 'The Fight Pit', text: 'There’s an illegal beast fight under the old granary tonight. The purse is big.', choices: [
    {label: 'Enter a beast', risk: {chance: 50, win: [['gold', 250], ['favor', 'ring', 3]], winText: 'Your beast wins. 250 Gold.', lose: [['injure', 'beast', 'Major'], ['favor', 'authority', -5]], loseText: 'Your beast is badly hurt, and the stewards hear about it.'}},
    {label: 'Stay away', text: 'Probably for the best.'}]},
  package: {title: 'A Package for the Ring', text: 'The Ring needs a package carried across the border with your next shipment. Don’t open it.', choices: [
    {label: 'Carry it', risk: {chance: 75, win: [['gold', 100], ['favor', 'ring', 10]], winText: 'It arrives. The Ring pays and remembers.', lose: [['favor', 'authority', -15], ['favor', 'ring', 4]], loseText: 'Border guards open it. You talk your way out, barely.'}},
    {label: 'Refuse', effects: [['favor', 'ring', -4]], text: 'They find another mule.'}]},
  truce: {title: 'An Olive Branch', rival: true, grudge: true, text: '{driver} of {team} sends a note: the feud is bad for business. A truce?', choices: [
    {label: 'Accept the truce', effects: [['grudge', -1], ['rep', -1]], text: 'You shake hands. For now.'},
    {label: 'Tear up the note', effects: [['grudge', 1], ['rep', 2]], text: 'The feud goes on. The crowd is delighted.'}]},
  nightRun: {title: 'Night Training', text: 'Your drivers want to train on the track at night, by torchlight, to learn its moods.', choices: [
    {label: 'Allow it', effects: [['drivers', -10], ['rep', 2]], text: 'They come back tired but full of tales. The town talks.'},
    {label: 'Forbid it', text: 'Sleep is training too.'}]},
});
export const EVENT_IDS = Object.freeze(Object.keys(EVENTS));

export const initialEvents = () => ({version: 1, rules: EVENT_RULES, pending: null, seen: [], log: []});
function note(v, text) { v.log.unshift(text.slice(0, 240)); v.log = v.log.slice(0, LOG); }
// The rival a card is about: one from the current nation, the most hated first.
function pickRival(s, needGrudge, salt) {
  const faces = Object.entries(s.m6.rivalry?.faces ?? {}).filter(([, f]) => f.nationId === s.m6.world.currentNation && (!needGrudge || f.grudge > 0));
  if (!faces.length) return null;
  const top = Math.max(...faces.map(([, f]) => f.grudge)), best = faces.filter(([, f]) => f.grudge === top);
  return best[roll(salt, 'rival') % best.length][0];
}
// Called when a Series closes.
export function drawEvent(s, sequence) {
  const v = (s.m6.events ??= initialEvents());
  const salt = [s.career.id, sequence];
  const deck = EVENT_IDS.filter(id => !v.seen.includes(id) && (!EVENTS[id].rival || pickRival(s, EVENTS[id].grudge, salt)));
  const pool = deck.length ? deck : EVENT_IDS.filter(id => !EVENTS[id].rival);
  const id = pool[roll(...salt, 'draw') % pool.length];
  v.pending = {id, sequence, rival: EVENTS[id].rival ? pickRival(s, EVENTS[id].grudge, salt) : null};
  v.seen = [...v.seen.filter(x => x !== id), id].slice(-SEEN);
}
export function eventWords(s, text, rivalId) {
  const f = rivalId ? s.m6.rivalry?.faces?.[rivalId] : null;
  return text.replace(/\{team\}/g, f?.team ?? 'a rival stable').replace(/\{driver\}/g, f?.driver ?? 'their driver').replace(/\{rival\}/g, f ? `${f.driver} of ${f.team}` : 'a rival');
}
export const choiceCost = c => c.cost ?? 0;
export function chooseEvent(s, {choice}) {
  const v = s.m6.events, p = v?.pending;
  if (!p) throw Error('No event to answer');
  const card = EVENTS[p.id], c = card.choices[choice];
  if (!c) throw Error('Unknown choice');
  const cost = choiceCost(c);
  if (s.career.treasury < cost) throw Error(`Needs ${cost} Gold`);
  s.career.treasury -= cost;
  let effects = c.effects ?? [], text = c.text ?? '';
  if (c.risk) {
    const won = roll(s.career.id, p.sequence, p.id, choice, 'risk') < c.risk.chance;
    effects = [...effects, ...(won ? c.risk.win : c.risk.lose)];
    text = (text ? text + ' ' : '') + (won ? c.risk.winText : c.risk.loseText);
  }
  const lines = effects.map(e => apply(s, e, p, card.title)).filter(Boolean);
  const outcome = eventWords(s, text, p.rival);
  note(v, `${card.title}: ${outcome}${lines.length ? ' (' + lines.join(', ') + ')' : ''}`);
  v.pending = null;
  return {eventId: p.id, choice, outcome, effects: lines};
}
function apply(s, [kind, a, b], p, title) {
  const r = s.management.registries, cap = n => Math.max(0, Math.min(100, Math.round(n))), face = p.rival ? s.m6.rivalry?.faces?.[p.rival] : null;
  const live = o => Object.values(o).filter(x => x.available !== false && x.status !== 'Destroyed');
  switch (kind) {
    case 'gold': { const n = Math.max(-s.career.treasury, a); s.career.treasury += n; return `${n >= 0 ? '+' : ''}${n} Gold`; }
    case 'rep': { s.championshipFoundation.facts.reputation = Math.max(0, s.championshipFoundation.facts.reputation + a); return `${a >= 0 ? '+' : ''}${a} Reputation`; }
    case 'favor': { const id = a === 'house' ? 'house-' + s.m6.world.currentNation : a; addFavor(s, id, b, title); return `${b >= 0 ? '+' : ''}${b} favor`; }
    case 'beasts': for (const x of live(r.beasts)) x.condition = cap(x.condition + a); return `beasts ${a >= 0 ? '+' : ''}${a} condition`;
    case 'drivers': for (const x of live(r.personnel)) if (x.role === 'driver') x.condition = cap((x.condition ?? 100) + a); return `drivers ${a >= 0 ? '+' : ''}${a} condition`;
    case 'chariots': for (const x of live(r.chariots)) { x.condition = cap(x.condition + a); x.integrity = cap(x.integrity + a); x.status = x.integrity >= 80 ? 'Functional' : x.integrity >= 60 ? 'Light' : x.integrity >= 30 ? 'Moderate' : 'Critical'; } return `chariots +${a} condition`;
    case 'injure': {
      const pool = live(a === 'beast' ? r.beasts : r.personnel).filter(x => a === 'beast' || x.role === 'driver').sort((x, y) => x.id.localeCompare(y.id));
      if (!pool.length) return null;
      const x = pool[roll(s.career.id, p.sequence, p.id, 'victim') % pool.length], order = ['Healthy', 'Minor', 'Major', 'Critical'];
      if (order.indexOf(b) > order.indexOf(x.injury ?? 'Healthy')) x.injury = b;
      return `${a} hurt (${b})`;
    }
    case 'rivalForm': if (!face) return null; face.form = Math.max(-8, Math.min(10, face.form + a)); return `${face.team} form ${a}`;
    case 'rivalOut': if (!face) return null; face.out = Math.max(face.out, 1); return `${face.driver} sits out a Series`;
    case 'grudge': if (!face) return null; face.grudge = Math.max(0, Math.min(3, face.grudge + a)); return `${face.team}: ${GRUDGES[face.grudge]}`;
    default: return null;
  }
}
export function validateEvents(s) {
  const v = s.m6.events;
  if (v === undefined) return;
  if (!v || v.version !== 1 || v.rules !== EVENT_RULES || Object.keys(v).sort().join(',') !== 'log,pending,rules,seen,version' || !Array.isArray(v.seen) || v.seen.length > SEEN || v.seen.some(id => !EVENTS[id]) || !Array.isArray(v.log) || v.log.length > LOG) throw Error('Invalid trackside events');
  if (v.pending !== null && (!EVENTS[v.pending.id] || !Number.isInteger(v.pending.sequence) || (v.pending.rival !== null && typeof v.pending.rival !== 'string'))) throw Error('Invalid pending event');
}
