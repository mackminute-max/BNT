import {freeze} from '../assets.js';
export const M4_RULES='m4-progression-v1';
// Attribute targets are native RU fields; source stats are never overwritten.
const row=(id,name,category,kind,target,amount,description,weight=10)=>({id,name,category,kind,target,amount,description,weight});
export const RUN_REWARDS=freeze([
 row('focused-training','Focused Training','Driver Development','stat','driver.driving',5,'+5 Driving for your driver.'),
 row('combat-drills','Combat Drills','Driver Development','stat','driver.combat',5,'+5 Combat for your driver.'),
 row('iron-nerves','Iron Nerves','Driver Development','stat','driver.nerve',5,'+5 Nerve for your driver.'),
 row('conditioning','Conditioning Regimen','Beast Conditioning','stat','beasts.endurance',5,'+5 Endurance for both beasts.'),
 row('veterinary','Veterinary Care','Beast Conditioning','heal','beasts',15,'Restore up to 15 condition to both beasts; injuries do not improve automatically.'),
 row('surefooted','Surefooted Team','Beast Conditioning','stat','beasts.agility',5,'+5 Agility for both beasts.'),
 row('reinforced','Reinforced Frame','Chariot Improvements','stat','chariot.durability',10,'+10 structural Durability.'),
 row('balanced','Balanced Axles','Chariot Improvements','stat','chariot.stability',5,'+5 Chariot Stability.'),
 row('emergency-repairs','Emergency Repairs','Chariot Improvements','repair','chariot',20,'Restore up to 20 repairable integrity and condition.'),
 row('fittings','Hardened Fittings','Equipment','wear','chariot',.9,'10% less chariot wear per selection; combines multiplicatively, minimum 10% of normal wear.'),
 row('implements','Sharpened Implements','Equipment','stat','equipment.combat',5,'+5 offensive equipment performance.'),
 row('harness','Protective Harness','Equipment','stat','beasts.toughness',5,'+5 Toughness for both beasts, improving existing injury resistance.'),
 row('familiarity','Track Familiarity','Racing Insights','stat','chariot.maneuverability',5,'+5 Chariot Maneuverability.'),
 row('aggressive','Aggressive Tactics','Racing Insights','stat','driver.combat',5,'+5 offensive Combat; personality remains unchanged.'),
 row('defensive','Defensive Formation','Racing Insights','stat','chariot.protection',5,'+5 Chariot Protection.'),
 row('rapid-recovery','Rapid Recovery','Support and Recovery','heal','team',10,'Restore up to 10 condition to your driver and both beasts; existing injuries remain.'),
 row('field-repairs','Field Repairs','Support and Recovery','field','chariot',15,'Restore up to 15 repairable integrity/condition and remove up to 15 chariot wear. Equipment has no individual wear.'),
 row('medical','Emergency Medical Contract','Support and Recovery','medical',null,25,'Immediately pay for an eligible treatment at 25% off the current price.',6),
 row('sponsor','Sponsor Purse','Trading Opportunities','gold',null,100,'Receive 100 spendable Gold immediately.'),
 row('supplier','Supplier’s Bargain','Trading Opportunities','purchase',null,15,'Immediately buy a disclosed available equipment item at 15% off.',6),
 row('negotiation','Prize Negotiation','Trading Opportunities','gold',null,100,'Receive 100 spendable Gold immediately; not a future prize multiplier.')
]);
export const LEGACY_UPGRADES=freeze([
 {id:'recruiters',name:'Veteran Recruiters',cost:typeof BNT_M5_BUILD!=='undefined'&&BNT_M5_BUILD?6:4,kind:'permanent',description:typeof BNT_M5_BUILD!=='undefined'&&BNT_M5_BUILD?'One extra Premium driver now and at each full Home Market renewal; normal hiring costs apply.':'Add one extra Premium driver candidate to this stable’s fixed market.',effects:[]},
 {id:'engineers',name:'Master Engineers',cost:4,kind:'permanent',description:'+5 Stability and +5 Maneuverability for every registered chariot.',effects:[['chariot.stability',5],['chariot.maneuverability',5]]},
 {id:'beastmaster',name:'Beastmaster’s Legacy',cost:4,kind:'permanent',description:'+5 Discipline and +5 Endurance for both registered beasts.',effects:[['beasts.discipline',5],['beasts.endurance',5]]},
 {id:'distinguished',name:'Distinguished Stable',cost:5,kind:'permanent',description:'+5 Awareness and +5 Nerve for every registered driver.',effects:[['driver.awareness',5],['driver.nerve',5]]},
 {id:'dynasty',name:'Racing Dynasty',cost:8,kind:'permanent',description:'+5 Driving and +5 Speed for both beasts in every registered team.',effects:[['driver.driving',5],['beasts.speed',5]]},
 {id:'established',name:'Established Stable',cost:3,kind:'active',icon:'◆',description:'+150 spendable Gold at registration after paying the entry fee.',effects:[]},
 {id:'patron',name:'Influential Patron',cost:5,kind:'active',icon:'✦',description:'+10% championship Gold prizes, rounded down once; maximum 1,000 bonus Gold per championship.',effects:[]},
 {id:'strategist',name:'Master Strategist',cost:6,kind:'active',icon:'⚑',description:'+1 Strategy Sign opportunity per race for your driver.',effects:[]}
]);
export function upgrade(id,state=null){const d=LEGACY_UPGRADES.find(d=>d.id===id);if(!d)throw Error('Unknown Legacy Upgrade');return [7,8].includes(state?.schema)&&id==='recruiters'?{...d,cost:6,...(state?.schema===8?{description:'One extra driver of your highest unlocked market grade now and at each qualifying Home Market renewal; normal hiring costs apply.'}:{})}:d;}
export const BONUS_TIERS=freeze({dustroad:1,ironwheel:2,bannerfall:3,crownfire:4,'thunder-crown':5,'iron-gauntlet':5});
