// Clarity pass (Mack 2026-11-27): small "?" help tips that say what a stat does
// and how the systems fit together. Each tip is a focusable button; its text
// shows on hover, keyboard focus or tap (CSS in presentation/frame/theme.css).
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

const LABELS = {beastHandling: 'Beast Handling', rollingEfficiency: 'Rolling Efficiency'};
export const statLabel = k => LABELS[k] ?? String(k).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());

// What each rating does in a race (src/model/ru.js derives the race numbers).
export const STAT_HELP = Object.freeze({
  driver: {
    driving: 'Steering and control. Feeds cornering, braking and how well the turnout holds its line.',
    beastHandling: 'How well the driver keeps the two beasts pulling together. Raises control and teamwork.',
    combat: 'Skill with a weapon in Combat races: hits harder and lands more attacks.',
    awareness: 'Reading the race. Spots openings and danger sooner and makes fewer bad calls.',
    nerve: 'Steadiness under pressure. Less shaken by a loud crowd, close racing and hits.'
  },
  beast: {
    speed: 'Top speed. The pair runs at the pace of the slower beast, so match them.',
    power: 'Pulling strength: acceleration out of corners and off the start. The pair adds together.',
    agility: 'Quick turns. Helps cornering; the less agile beast sets the limit.',
    endurance: 'Stamina. Slows fatigue in long races and helps recovery.',
    discipline: 'Obeys the driver and keeps in step with its partner. The less disciplined beast sets the limit.',
    toughness: 'Takes hits and wrecks better, and is less likely to be injured or killed.'
  },
  chariot: {
    stability: 'Stays upright and steady. Adds to control and cornering.',
    durability: 'How much punishment the frame takes before it breaks.',
    protection: 'Armour for the driver and team. Cuts the damage from hits and wrecks.',
    rollingEfficiency: 'Light, smooth running gear. Raises top speed.',
    maneuverability: 'How sharply it turns. Adds to cornering.'
  },
  condition: {
    condition: 'Health from 0 to 100. Low condition weakens every rating in the race. Rest and Services restore it.',
    fatigue: 'Tiredness from racing. High fatigue slows a beast; Beast Care and rest bring it down.',
    strain: 'Wear on the driver. High strain weakens their driving.',
    integrity: 'How intact the chariot is. At 0 it is destroyed. Chariot Repair restores it.',
    wear: 'Worn parts that sap the chariot\'s performance until repaired.'
  }
});
const KIND = {personnel: 'driver', driver: 'driver', beasts: 'beast', beast: 'beast', chariots: 'chariot', chariot: 'chariot'};
export function statHelp(k, kind) {
  const set = STAT_HELP[KIND[kind] ?? kind];
  return set?.[k] ?? STAT_HELP.driver[k] ?? STAT_HELP.beast[k] ?? STAT_HELP.chariot[k] ?? STAT_HELP.condition[k] ?? '';
}

// How the systems work and connect.
export const SYSTEM_HELP = Object.freeze({
  turnout: 'Your Turnout is what races: one driver, two beasts and a chariot. Set it up in Barn and Bunk House.',
  series: 'A Series is a run of races. You pay an entry fee, race every event with the same Turnout, and earn Gold, Reputation and Legacy Points from your results.',
  endowments: 'After each race of a Series you pick one Endowment: a boost, an Active Ability or a reward. Endowments last until the Series ends.',
  treatment: 'Treatment heals an injury or repairs the chariot during a Series. You take it instead of an Endowment and pay Gold for it.',
  strategies: 'In a race, a Strategy changes how your driver races. Each one has a gain and a cost, and No Strategy is free.',
  abilities: 'An Active Ability is a one-use power in a race, such as a burst of speed. You earn them as Endowments.',
  reputation: 'Reputation is earned by racing well. It raises your Market grade, and you spend it on faction unlocks, upgrades and training. Spending it does not lower your grade.',
  wallet: 'Reputation to spend: your lifetime Reputation minus what you have spent on faction unlocks, upgrades and training.',
  marketGrade: 'Market quality sets how good the stock is in the Market and among drivers for hire. It rises with lifetime Reputation and with Trader\'s Eye upgrades.',
  factions: 'Factions are the powers of each nation. Earn Reputation with one by racing its events and finishing its quests; that unlocks discounts, unique stock and Invitationals.',
  quests: 'Quests are faction goals, like winning a Combat race on a short oval. You can hold 3 at a time; only active quests count. Finishing one pays Reputation with that faction.',
  legacy: 'Legacy Points come from finishing Series. Spend them on Legacy Boons: Core Boons always apply, and one Major Boon can be equipped at a time.',
  upgrades: 'Upgrades are bought with Reputation and last forever: cheaper prices, better stock, cheaper buildings.',
  facilities: 'Facilities are buildings at your stable. They add room for staff and assets and give care between Series. They cost Gold to build and Gold upkeep.',
  specialists: 'Specialists are staff who make Services cheaper. Each needs a room.',
  training: 'Training raises a driver\'s or beast\'s rating one point at a time, paid with Reputation or Gold.',
  services: 'Services heal drivers and beasts and repair chariots between Series, for Gold.',
  wages: 'Drivers and staff draw wages each Series, paid from your Gold.',
  affinity: 'Some peoples work best with certain beasts. A matching driver and beast species gives a bonus in races.',
  regional: 'The Regional Market opens in the host nation during a Series, after its first race. Its stock leaves when the Series ends.',
  den: 'The Gambling Den: bet Gold on races and play Bones and the Beast Pit. Winnings go to your treasury.',
  permadeath: 'Drivers and beasts can die in wrecks, mostly in Combat races. Chariots can be destroyed. Losses are permanent.'
});

export function helpTip(text, label = 'What is this?') {
  if (!text) return '';
  return `<button type="button" class="bt-help" aria-label="${esc(label)}: ${esc(text)}" data-help="${esc(text)}">?</button>`;
}
export const systemTip = key => helpTip(SYSTEM_HELP[key], 'Help');

// Plain-language versions of engine messages that reach the player.
const FRIENDLY = [
  [/Asset is assigned: explicitly disassemble the RU first\.?/g, 'This is part of your turnout. Swap it out in Barn and Bunk House first.'],
  [/EQUIPMENT_INSTALLED: explicitly detach first\.?/g, 'This equipment is fitted to a chariot. Detach it in Workshops first.'],
  [/explicitly disassemble the RU first/g, 'take it out of your turnout first (Barn and Bunk House)'],
  [/Changes are unavailable during an active championship\./g, 'This waits until your current Series ends.'],
  [/Insufficient Gold or XP\./g, 'Not enough Gold.'],
  [/\bRacing Unit\b/g, 'turnout'],
  [/\bRU\b/g, 'turnout']
];
export const friendly = text => FRIENDLY.reduce((t, [re, to]) => t.replace(re, to), String(text ?? ''));
