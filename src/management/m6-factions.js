// Racing Associations tab: Factions (Phase 4c rework, Mack 2026-11-27).
// An overview of every faction, then one page per faction (hidden from the tab
// bar until opened) with its unlocks and costs, quests, ways to earn Reputation
// and its signature Endowment.
import {FACTIONS,FACTION_IDS,QUESTS,STANDINGS,standing,factionsOf,unlocksFor,wallet,credit,factionDiscount} from '../career/m6/factions.js';
import {BOONS} from '../sim/endowments.js';
import {boonText} from '../career/p3/boons.js';
import {WORLD_CONTENT} from '../career/m6/world-content.generated.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nationName=id=>WORLD_CONTENT.profiles.find(p=>p.id===id)?.name??id;
const kindOf=id=>id.startsWith('house-')?'house':id;
const CSS=`<style>.bt-fx-wallet{display:flex;flex-wrap:wrap;gap:18px;align-items:baseline;border:1px solid #c9a75a;padding:8px 12px;background:rgba(0,0,0,.3);margin:6px 0 10px}.bt-fx-wallet strong{font-size:1.4em;color:#f0c96a}
.bt-fx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}.bt-fx{border:1px solid #c9a75a;padding:10px;background:rgba(0,0,0,.25);display:flex;flex-direction:column;gap:4px}.bt-fx h3{margin:0;display:flex;justify-content:space-between;gap:6px;align-items:baseline}.bt-fx p{margin:2px 0}
.bt-fx-bar{height:8px;background:#2a2116;border:1px solid #6b5a3e;position:relative}.bt-fx-bar i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#8a6a2a,#f0c96a)}
.bt-stand{font-size:.72em;text-transform:uppercase;letter-spacing:.06em;padding:1px 6px;border:1px solid currentColor;white-space:nowrap}.bt-st-Unknown{color:#aaa}.bt-st-Known{color:#ccc}.bt-st-Respected{color:#9fd18b}.bt-st-Honoured{color:#7fc0e0}.bt-st-Legend{color:#f0c96a}
.bt-fx-small{font-size:.85em;opacity:.9}.bt-fx-sections{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px}.bt-fx-sections>div{border:1px solid rgba(201,167,90,.5);padding:10px;background:rgba(0,0,0,.2)}.bt-fx-sections h3{margin:0 0 6px}
.bt-fx-ul{margin:0;padding-left:18px}.bt-fx-ul li{margin:3px 0}.bt-unlock{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:6px 0;border-bottom:1px solid rgba(201,167,90,.25)}.bt-unlock:last-child{border-bottom:0}.bt-unlock p{margin:0}.bt-unlock .bt-u-cost{text-align:right;white-space:nowrap}.bt-unlock.bt-owned{opacity:.75}.bt-unlock.bt-owned strong::after{content:' ✓';color:#9fd18b}
.bt-quest{border-left:3px solid #c9a75a;padding:4px 8px;margin:6px 0}.bt-quest.bt-q-active{border-color:#f0c96a;background:rgba(240,201,106,.08)}.bt-fx-log p{margin:2px 0;font-size:.9em}
.bt-tier{display:flex;gap:8px;align-items:flex-start;margin:4px 0}.bt-tier b{display:inline-block;min-width:26px;text-align:center;border:1px solid #c9a75a;color:#f0c96a}.bt-tier.bt-locked{opacity:.6}
.bt-banner{display:inline-block;padding:4px 12px;border:2px solid #f0c96a;background:linear-gradient(180deg,#5a1414,#2a0a0a);color:#f0c96a;font-weight:bold;letter-spacing:.05em}</style>`;
export function bannerChip(s){const id=s?.m6?.factions?.banner;return id&&FACTIONS[id]?`<span class="bt-banner" title="Faction banner">⚑ ${esc(FACTIONS[id].banner)}</span>`:'';}
const nextStanding=n=>STANDINGS.find(([at])=>at>n);
function bar(n){const next=nextStanding(n),prev=[...STANDINGS].reverse().find(([at])=>at<=n)?.[0]??0;const pct=next?Math.round(100*(n-prev)/(next[0]-prev)):100;return `<div class="bt-fx-bar" aria-label="${n} earned"><i style="width:${pct}%"></i></div><p class="bt-fx-small">${next?`${next[0]-n} more to ${esc(next[1])}`:'Highest standing'}</p>`;}
function prefers(id){const d=FACTIONS[id],p=d.prefers,what=[p.formats?.join(' or '),p.kinds?(p.kinds.length>1?p.kinds.join(', ')+' tracks':p.kinds[0]+' tracks'):''].filter(Boolean).join(' on ');return what||'any racing';}
function earnWays(id){const d=FACTIONS[id],k=kindOf(id),ways=[];
 if(k==='house')ways.push(`<strong>Race in ${esc(nationName(d.nationId))}.</strong> Every Series there shares its Reputation with them: half of it always, and the rest by how many races were ${esc(prefers(id))}.`,`Withdrawing from a Series in ${esc(nationName(d.nationId))} costs 2.`);
 else ways.push(`<strong>Race ${esc(prefers(id))}.</strong> Every Series shares its Reputation with them by how many of its races were ${esc(prefers(id))}.`);
 if(id==='authority')ways.push('+3 for every Series with no DNF and no one lost.','−25 if you are caught betting against your own turnout (35% chance when that bet wins).');
 if(id==='ring')ways.push('+1 to +3 for each Race Book bet of 20 Gold or more.','+5 when a bet against your own turnout pays off and the stewards hear of it.');
 ways.push('Complete their quests (below).','Trackside events: some choices earn or cost standing with them.');
 return ways;}
function questBlock(s,id,active){const f=factionsOf(s),q=f.quests[id],k=kindOf(id),offers=Object.entries(QUESTS).filter(([,x])=>x.faction===k);
 const reward=x=>`Reward: ${x.rep} Reputation with them and ${x.gold} Gold`;
 if(q){const d=QUESTS[q.questId];return `<div class="bt-quest bt-q-active"><p><strong>Active: ${esc(d.name)}</strong>${d.stages>1?` · step ${q.stage+1} of ${d.stages}`:''}</p><p>${esc(d.text)}${q.questId==='high-roller'?` (${q.staked} of 300 staked)`:''}</p><p class="bt-fx-small">${reward(d)}. Checked when each Series closes.</p><p><button data-fx-drop="${id}">Drop quest (−3 Reputation with them)</button></p></div>`+offers.filter(([qid])=>qid!==q.questId).map(([,x])=>`<div class="bt-quest"><p><strong>${esc(x.name)}</strong></p><p>${esc(x.text)}</p><p class="bt-fx-small">${reward(x)}. One quest per faction at a time.</p></div>`).join('');}
 return offers.map(([qid,x])=>`<div class="bt-quest"><p><strong>${esc(x.name)}</strong>${x.stages>1?` · ${x.stages} steps`:''}</p><p>${esc(x.text)}</p><p class="bt-fx-small">${reward(x)}.</p><p><button data-fx-quest="${qid}" data-fx-faction="${id}" ${active?'disabled title="Take quests between Series"':''}>Take quest</button></p></div>`).join('');}
function unlockRows(s,id,active){const f=factionsOf(s),owned=f.owned[id],earned=f.earned[id],cr=credit(s,id),w=wallet(s);
 return unlocksFor(id).filter(u=>!u.id.startsWith('boon-')).map(u=>{const has=!u.repeat&&owned.includes(u.id),waiting=u.pending&&f.pending.includes(u.pending);
  const why=has?'Unlocked':waiting?'Waiting to be used':active?'Between Series only':earned<u.need?`Needs ${u.need} earned`:u.after&&!owned.includes(u.after)?'Unlock the previous step first':cr<u.cost?`Only ${cr} spendable here`:w<u.cost?`Only ${w} Reputation to spend`:'';
  return `<div class="bt-unlock${has?' bt-owned':''}"><p><strong>${esc(u.name)}</strong>${u.repeat?' <span class="bt-fx-small">(repeatable)</span>':''}</p><p class="bt-u-cost">${u.cost} Rep · needs ${u.need} earned</p><p class="bt-fx-small">${esc(u.text)}</p><p class="bt-u-cost">${has?'':`<button data-fx-buy="${u.id}" data-fx-faction="${id}" ${why?'disabled':''}>${u.repeat?'Buy':'Unlock'}</button>`}${why&&!has&&!why.startsWith('Needs')?`<br><small>${esc(why)}</small>`:''}</p></div>`;}).join('');}
function boonBlock(s,id,active){const f=factionsOf(s),def=BOONS[FACTIONS[id].boon],owned=f.owned[id],earned=f.earned[id],cr=credit(s,id),w=wallet(s);
 const tiers=unlocksFor(id).filter(u=>u.id.startsWith('boon-'));
 return `<p><strong>${esc(def.name)}</strong> · Faction signature Boon. Once unlocked it can appear in your Endowment offers during a Series, up to the tier you hold.</p>`+tiers.map((u,i)=>{const has=owned.includes(u.id),why=has?'':active?'Between Series only':earned<u.need?`Needs ${u.need} earned`:u.after&&!owned.includes(u.after)?'Unlock the tier before':cr<u.cost?`Only ${cr} spendable here`:w<u.cost?`Only ${w} Reputation to spend`:'';
  return `<div class="bt-tier${has?'':' bt-locked'}"><b>${['I','II','III'][i]}</b><div><p>${esc(boonText(def,i+1,'Common'))}</p><p class="bt-fx-small">${u.cost} Rep · needs ${u.need} earned ${has?'· <strong>unlocked</strong>':`<button data-fx-buy="${u.id}" data-fx-faction="${id}" ${why?'disabled':''}>Unlock tier ${['I','II','III'][i]}</button>${why&&!why.startsWith('Needs')?' <small>'+esc(why)+'</small>':''}`}</p></div></div>`;}).join('');}
const PENDING_TEXT={authority:'Steward’s leniency: your next Series entry fee is refunded.',ring:'Bookie’s insurance: if your next Race Book race loses, your stakes come back.',ledger:'Clean ledger: your next time caught betting against your own turnout costs no standing.'};
const PENDING_OWNER={authority:'authority',ring:'ring',ledger:'authority'};
function factionPage(s,id,active){const d=FACTIONS[id],f=factionsOf(s),n=f.earned[id],st=standing(n),log=f.log.filter(l=>l.includes(d.name)).slice(0,6),pend=f.pending.filter(k=>PENDING_OWNER[k]===id);
 const perks=[];if(kindOf(id)==='house'){const pct=factionDiscount(s,d.nationId);if(pct)perks.push(`${pct}% off ${esc(nationName(d.nationId))} stock in your markets`);if(f.owned[id].includes('unique'))perks.push('House stock arrives at each market renewal');}if(id==='ring'&&f.owned.ring.includes('odds'))perks.push('Inside odds at the Race Book');
 return `<section class="hs-panel" data-bt-hidden-tab><h2>${esc(d.name)}</h2><p><button type="button" data-fx-back>← All factions</button></p><p><em>${esc(d.job)}</em></p>
 <div class="bt-fx-wallet"><span>Standing <span class="bt-stand bt-st-${st}">${st}</span></span><span>Earned with them <strong>${n}</strong></span><span>Spendable here <strong>${credit(s,id)}</strong></span><span>Your Reputation to spend <strong>${wallet(s)}</strong></span></div>${bar(n)}
 ${perks.length||pend.length||f.banner===id?`<p>${[...perks,...pend.map(k=>'Waiting: '+PENDING_TEXT[k]),...(f.banner===id?['Flying their banner '+bannerChip(s)]:[])].join(' · ')}</p>`:''}
 <div class="bt-fx-sections"><div><h3>Unlocks</h3><p class="bt-fx-small">Costs come from your Reputation. You can spend only as much here as you have earned with them; spending never lowers your standing.</p>${unlockRows(s,id,active)}${f.owned[id].includes('banner')?`<p><button data-fx-banner="${f.banner===id?'':id}">${f.banner===id?'Lower banner':'Fly banner'}</button></p>`:''}</div>
 <div><h3>Signature Endowment</h3>${boonBlock(s,id,active)}</div>
 <div><h3>Quests</h3>${questBlock(s,id,active)}</div>
 <div><h3>Ways to earn Reputation with them</h3><ul class="bt-fx-ul">${earnWays(id).map(w=>`<li>${w}</li>`).join('')}</ul></div></div>
 ${log.length?`<div class="bt-fx-log"><h3>Recent</h3>${log.map(l=>`<p>${esc(l)}</p>`).join('')}</div>`:''}</section>`;}
export function m6FactionsPage(s){const f=factionsOf(s),active=!!s.championshipFoundation.activeId,life=s.championshipFoundation.facts.reputation,w=s.m6.world;
 const card=id=>{const d=FACTIONS[id],n=f.earned[id],st=standing(n),q=f.quests[id],visited=!d.nationId||w.nations[d.nationId]?.entered||d.nationId===w.currentNation;
  return `<article class="bt-fx"><h3>${esc(d.name)}<span class="bt-stand bt-st-${st}">${st}</span></h3><p class="bt-fx-small">${d.nationId?esc(nationName(d.nationId))+' · ':''}Favours ${esc(prefers(id))}${visited?'':' · not yet visited'}</p>${bar(n)}<p>Earned <strong>${n}</strong> · Spendable <strong>${credit(s,id)}</strong> · ${f.owned[id].length} unlocked</p>${q?`<p class="bt-fx-small">Quest: ${esc(QUESTS[q.questId].name)}</p>`:''}<p class="bt-fx-small">Signature: ${esc(BOONS[d.boon].name)}</p><p style="margin-top:auto"><button data-fx-open="${esc(d.name)}">Open ${esc(d.name)} →</button></p></article>`;};
 const pending=f.pending.map(k=>`<p>Waiting to be used: ${esc(PENDING_TEXT[k])}</p>`).join('');
 return `<section class="hs-panel"><h2>Factions</h2>${CSS}<p>Reputation is a currency. You earn it by racing, and each faction remembers the Reputation you earned <em>their</em> way: at their kind of track, in their format, in their nation, and through their quests. Spend it on their favors, perks and signature Endowment. You can spend up to what you have earned with a faction, and spending never lowers your standing. Standings: ${STANDINGS.map(([at,name])=>`${esc(name)} ${at}`).join(' · ')}.${f.banner?' Flying: '+bannerChip(s):''}</p>
 <div class="bt-fx-wallet"><span>Reputation to spend <strong>${wallet(s)}</strong></span><span>Lifetime Reputation ${life}</span><span>Spent ${f.spent}</span>${active?'<span>Unlocks and quests open between Series.</span>':''}</div>${pending}<div class="bt-fx-grid">${FACTION_IDS.map(card).join('')}</div></section>`+FACTION_IDS.map(id=>factionPage(s,id,active)).join('');}
export function bindM6Factions(root,s,port,run){
 for(const b of root.querySelectorAll('[data-fx-open]'))b.onclick=()=>globalThis.__btShowTab?.(b.dataset.fxOpen);
 for(const b of root.querySelectorAll('[data-fx-back]'))b.onclick=()=>globalThis.__btShowTab?.('Factions');
 for(const b of root.querySelectorAll('[data-fx-quest]'))b.onclick=()=>run(()=>port.e5('m6.takeQuest',{questId:b.dataset.fxQuest,factionId:b.dataset.fxFaction,confirmed:true}),'Quest taken.');
 for(const b of root.querySelectorAll('[data-fx-drop]'))b.onclick=()=>run(()=>port.e5('m6.dropQuest',{factionId:b.dataset.fxDrop,confirmed:true}),'Quest dropped.');
 for(const b of root.querySelectorAll('[data-fx-buy]'))b.onclick=()=>run(()=>port.e5('m6.callFavor',{factionId:b.dataset.fxFaction,unlockId:b.dataset.fxBuy,confirmed:true}),'Unlocked.');
 for(const b of root.querySelectorAll('[data-fx-banner]'))b.onclick=()=>run(()=>port.e5('m6.setBanner',{factionId:b.dataset.fxBanner||null,confirmed:true}),'Banner changed.');
}
