import {emit} from '../events/events.js';
export const M6_INTERACTION='m6-immediate-signs-abilities-v1';
export const M6_P1_INTERACTION='m6-p1-immediate-signs-abilities-v1';
export const p1Entrant=r=>r?.progressionContext?.version===3&&r.progressionContext.interactionRules===M6_P1_INTERACTION;
export const ABILITIES=Object.freeze({'thunder-burst':{name:'Thunder Burst',seconds:5},'second-wind':{name:'Second Wind',seconds:8},brace:{name:'Brace for Impact',seconds:6},'perfect-line':{name:'Perfect Line',seconds:6},'savage-assault':{name:'Savage Assault',seconds:5},'absolute-focus':{name:'Absolute Focus',seconds:8},'catch-breath':{name:'Catch Your Breath',seconds:0},'steady-team':{name:'Steady the Team',seconds:6}});
// Phase 3: up to 3 Active Abilities, each usable once per race, upgraded to II and III
// by picking them again. Higher levels last longer (and Catch Your Breath restores more).
export const ABILITY_SLOTS=3,ABILITY_LEVELS=Object.freeze([1,1.5,2]);
export const abilityList=r=>r?.progressionContext?.abilities??(r?.progressionContext?.abilityId?[{id:r.progressionContext.abilityId,level:1}]:[]);
export const abilityLevel=(r,id)=>abilityList(r).find(a=>a.id===id)?.level??1;
export const m6Entrant=r=>(r?.progressionContext?.version===2&&r.progressionContext.interactionRules===M6_INTERACTION)||p1Entrant(r);
export const activeAbility=(s,r,id)=>m6Entrant(r)&&r.m6?.activeAbility===id&&s.tick<r.m6.throughTick;
export function abilityRequest(s,r,requested){const list=r.m6?.spent?abilityList(r):null,id=list?(requested??list.find(a=>!r.m6.spent.includes(a.id))?.id):r.progressionContext?.abilityId;if(!m6Entrant(r)||!id||!r.m6?.charges||r.m6.pendingAbility||id==='savage-assault'&&s.format!=='Combat')return false;if(list&&(!list.some(a=>a.id===id)||r.m6.spent.includes(id)||r.m6.activeAbility))return false;if(!list&&requested!==undefined&&requested!==id)return false;r.m6.pendingAbility=id;emit(s,'ABILITY_QUEUED',[r.id],{abilityId:id});return true;}
export function m6Boundary(s,r){if(!m6Entrant(r))return;if(r.m6.activeAbility&&s.tick>=r.m6.throughTick){emit(s,'ABILITY_EXPIRED',[r.id],{abilityId:r.m6.activeAbility});r.m6.activeAbility=null;}const id=r.m6.pendingAbility;if(!id||r.status!=='Racing')return;r.m6.pendingAbility=null;r.m6.charges--;if(r.m6.spent)r.m6.spent.push(id);const lv=ABILITY_LEVELS[abilityLevel(r,id)-1];if(id==='catch-breath'){for(const b of r.ru.beasts)b.fatigue=Math.max(0,b.fatigue-10*lv);}else{r.m6.activeAbility=id;r.m6.throughTick=s.tick+Math.ceil(ABILITIES[id].seconds*lv/s.config.dt);}r.ai.nextDecision=s.tick;emit(s,'ABILITY_ACTIVATED',[r.id],{abilityId:id,throughTick:r.m6.throughTick,charges:r.m6.charges});}
export function abilityDerived(s,r,d){if(!m6Entrant(r))return d;if(activeAbility(s,r,'thunder-burst'))return {...d,maxSpeed:d.maxSpeed*1.1,acceleration:Math.min(s.config.accelerationLimit,d.acceleration*1.15)};if(activeAbility(s,r,'perfect-line'))return {...d,handling:Math.min(100,d.handling*1.15),lateral:d.lateral*1.15};return d;}
export function validateM6Entrant(s,r){if(!m6Entrant(r)){if(r.m6!==undefined)throw Error('M6 state without versioned interaction context');return;}const a=r.m6,id=r.progressionContext.abilityId;if(r.progressionContext.abilities){const list=abilityList(r),ids=list.map(x=>x.id);if(!a||Object.keys(a).sort().join(',')!=='activeAbility,charges,pendingAbility,spent,throughTick'||!Array.isArray(a.spent)||new Set(a.spent).size!==a.spent.length||a.spent.some(x=>!ids.includes(x))||a.charges!==list.length-a.spent.length||!Number.isSafeInteger(a.throughTick)||a.throughTick<0||a.pendingAbility!==null&&(!ids.includes(a.pendingAbility)||a.spent.includes(a.pendingAbility))||a.activeAbility!==null&&!a.spent.includes(a.activeAbility))throw Error('Invalid M6 ability state');return;}if(!a||Object.keys(a).sort().join(',')!=='activeAbility,charges,pendingAbility,throughTick'||![0,1].includes(a.charges)||!Number.isSafeInteger(a.throughTick)||a.throughTick<0||a.pendingAbility!==null&&(a.pendingAbility!==id||a.charges!==1)||a.activeAbility!==null&&(a.activeAbility!==id||a.charges!==0)||!id&&(a.charges||a.pendingAbility||a.activeAbility))throw Error('Invalid M6 ability state');}

export const controlRecoveryRate=(s,r)=>s.consequence.controlRecovery*(p1Entrant(r)&&activeAbility(s,r,'steady-team')?1.25:1);

// Phase 3 (Mack 2026-11-27): rivals earn Active Abilities too. A rival's coach
// fires each ability once per race when its moment comes. Deterministic: reads
// only race state, with a small per-team offset so rivals do not all fire at once.
const offset=id=>{let h=0;for(const c of String(id))h=(h*31+c.charCodeAt(0))>>>0;return (h%9)/100;};
const RIVAL_TRIGGERS={
 'thunder-burst':(s,r,f,o)=>f>=.78+o,
 'perfect-line':(s,r,f,o)=>f>=.4+o,
 'absolute-focus':(s,r,f,o)=>f>=.3+o,
 'steady-team':(s,r,f,o)=>f>=.55+o||r.control&&r.control!=='Normal',
 'savage-assault':(s,r,f,o)=>s.format==='Combat'&&f>=.12+o&&f<.75,
 brace:(s,r,f,o)=>s.format==='Combat'?(r.ru.chariot.condition<80||r.ru.driver.condition<75||f>=.6+o):f>=.65+o,
 'second-wind':(s,r,f)=>Math.max(...r.ru.beasts.map(b=>b.fatigue))>=55||f>=.85,
 'catch-breath':(s,r,f)=>Math.max(...r.ru.beasts.map(b=>b.fatigue))>=60||f>=.9,
};
export function rivalAbility(s,r){if(!m6Entrant(r)||r.id===s.playerId||r.status!=='Racing'||!r.m6?.spent||!r.m6.charges||r.m6.pendingAbility||r.m6.activeAbility)return;const cells=Math.max(1,(s.track?.cells??1)*(s.config?.laps??1)),f=Math.min(1,Math.max(0,(r.q??0)/cells)),o=offset(r.id);for(const a of abilityList(r)){if(r.m6.spent.includes(a.id))continue;if(RIVAL_TRIGGERS[a.id]?.(s,r,f,o)&&abilityRequest(s,r,a.id))return;}}
