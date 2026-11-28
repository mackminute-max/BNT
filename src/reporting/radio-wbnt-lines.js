// WBNT network lines (Mack 2026-11-27): the WBNT channel carries the color
// commentary and the race highlights, with a network intro and pregame ads, and
// product and network plugs in long races after the halfway point.
// "WBNT radio, Home of the Sundaran Open Cup and the Founders' Cup."
// Tokens as in radio-lines.js. {sponsor} is a house sponsor.
export const NETWORK = Object.freeze({name: 'WBNT', short: 'WBNT', tagline: 'Home of the Sundaran Open Cup and the Founders’ Cup'});

export const WBNT_LINES = Object.freeze({
  // ---- Network intro (read before the booth comes on) -------------------------
  wbnt_intro: [
    'You’re listening to WBNT radio, Home of the Sundaran Open Cup and the Founders’ Cup!',
    'This is WBNT, the voice of the track. Home of the Sundaran Open Cup and the Founders’ Cup.',
    'WBNT radio, broadcasting live from {venue}. Home of the Sundaran Open Cup and the Founders’ Cup.',
    'Stay tuned to WBNT, where the wheels turn and the bones break. Home of the Sundaran Open Cup and the Founders’ Cup.',
    'From the high towers of the network to the cheap seats at {venue}: this is WBNT.',
    'WBNT presents live chariot racing, brought to you by {sponsor}.',
    'Tonight on WBNT: {series}, race {race} of {races}, live from {venue}.',
    'WBNT radio. If it bleeds on the track, you hear it here first.',
  ],
  // ---- Pregame ads (WBNT reads two before the booth comes on) -----------------
  wbnt_ad: [
    'Brannock’s Liniment: for aches, sprains and things you can’t explain to the healer. Rub it in and race on.',
    'Ironmane Axle Grease. Because a squealing wheel is a slow wheel, and a slow wheel is a dead driver.',
    'Old Corvid Stout. Dark as a winter track, thick as a bookie’s ledger. Ask for it by name.',
    'Saltmarsh Bandages. When you need them, you’ll know. Sold at every infirmary tent on the circuit.',
    'Thunderhoof Feed and Oats: what the champions eat. And what the champions’ beasts eat, too.',
    'Gallow & Daughters Wheelwrights. Three generations of spokes, and not one of them has come back.',
    'Mother Pell’s Bone-Setting. Walk in on a stretcher, walk out on a stretcher that’s been looked at.',
    'Red Lantern Insurance. We cover the chariot, the beasts and, for a small extra fee, the driver.',
    'Blackwater Tar Soap. Gets out blood, oil and regret. Mostly.',
    'Cinderjack Whetstones: if your blade isn’t sharp, someone else’s is.',
    'Feeling lucky? The Race Book is open now. Place your bets before the flag, and bet responsibly, or at least quietly.',
    'Visit the Gambling Den tonight for Bones, the Beast Pit and the finest watered-down stout in the province.',
    'Is your stable short a driver? The Home Market has fresh hands every Series. Some of them have all their fingers.',
    'Facilities falling apart? A new Infirmary pays for itself the first time it saves a life. Probably yours.',
    'This race is brought to you by {sponsor}. WBNT thanks our sponsors for keeping the lanterns lit.',
    'Coming soon to WBNT: the Founders’ Cup, where legends are made and some of them are buried.',
  ],
  // ---- Product plugs (long races, after the halfway point) --------------------
  plug_product: [
    'This lap brought to you by {sponsor}. When the going gets rough, the rough get {sponsor}.',
    'Rook, you know what this race needs? {sponsor}. You know what every race needs? {sponsor}.',
    'A quick word from {sponsor}, who’d like to remind every driver out there that they are not responsible for what happens next.',
    'Halfway home, and the {sponsor} tent is doing a roaring trade under the north stand.',
    'Speaking of hard knocks: {sponsor}. The official sponsor of hard knocks.',
    'If you’re listening from the infirmary tonight, {sponsor} wishes you a speedy recovery and a reasonable invoice.',
    'The {sponsor} lap leader bonus is on the line here. Somebody’s getting a free crate.',
    'Our friends at {sponsor} have the pit wall looking very shiny tonight. Shame about the track.',
    'Rook, I’m told I have to say {sponsor} three more times before the flag. {sponsor}. {sponsor}. There. Done.',
    'That collision earlier? Sponsored by {sponsor}. No, it wasn’t. Yes, it was. Ask accounting.',
    'Tired beasts? Thunderhoof Feed and Oats. Tired announcer? Old Corvid Stout. I’ll take the second.',
    'Red Lantern Insurance would like to remind everyone that “act of beast” is not covered.',
  ],
  // ---- Network plugs (long races, after the halfway point) --------------------
  plug_network: [
    'You’re listening to WBNT, Home of the Sundaran Open Cup and the Founders’ Cup.',
    'Stay with WBNT after the flag for the full results and the injury report.',
    'Don’t touch that dial. WBNT has every lap, every hit and every bad decision.',
    'This is WBNT radio, live from {venue}. If you’re just joining us, you’ve missed some blood.',
    'WBNT: the only network brave enough to put a booth this close to the turn.',
    'Next week on WBNT: more racing, more wrecks, and Mags explains the rules again.',
    'WBNT reminds listeners that the Sundaran Open Cup is coming. Start saving your Gold and your nerve.',
    'Tell your friends, tell your enemies: WBNT is on the air, and the race is far from over.',
    'You can hear Rook Calloway and Mags Varga every race night, only on WBNT.',
    'WBNT. Founders’ Cup coverage, all season long. Accept no imitations.',
  ],
});
export const WBNT_COLOR_KEYS = new Set(['plug_product']);
export const WBNT_NETWORK_KEYS = new Set(['wbnt_intro', 'wbnt_ad', 'plug_network']);
