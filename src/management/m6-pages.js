// Management restyle (Phase 4c, Mack 2026-11-27): each buying page splits into its
// own section tabs (Market: beasts, chariots, equipment, regional, sell; Staff: your
// staff, drivers, specialists; Workshops: facilities, workshop), and each ends with a
// Reputation upgrade tree (see career/m6/upgrades.js). The tabs come from the frame
// (presentation/frame/frame.js); playable.js tags each section with data-bt-tab.
import {UPGRADE_TREES,hasUpgrade,marketCut,signingCut,noSigningFee,buildCut,upkeepCut} from '../career/m6/upgrades.js';
import {wallet} from '../career/m6/factions.js';
import {MARKET_GRADES,marketGrade,reputationGrade} from '../career/m6/markets.js';
import {WORLD_CONTENT} from '../career/m6/world-content.generated.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nationName=id=>WORLD_CONTENT.profiles.find(p=>p.id===id)?.name??id;

export const PAGE_CSS=`<style>.bt-perks{display:flex;flex-wrap:wrap;gap:6px 16px;border-left:3px solid #c9a75a;padding:4px 10px;margin:0 0 10px;background:rgba(0,0,0,.2)}.bt-perks span{color:#9fd18b}
.bt-tree{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.bt-branch{border:1px solid #6b5a3e;background:rgba(0,0,0,.25);padding:10px;display:flex;flex-direction:column;gap:0}
.bt-node{position:relative;border:1px solid #6b5a3e;padding:8px 10px;margin-left:16px;background:rgba(0,0,0,.25)}
.bt-node+.bt-node{margin-top:14px}.bt-node+.bt-node::before{content:'';position:absolute;left:18px;top:-15px;height:14px;border-left:2px solid #6b5a3e}
.bt-node h4{margin:0 0 2px;display:flex;justify-content:space-between;gap:8px}.bt-node p{margin:2px 0}
.bt-node.bt-own{border-color:#9fd18b}.bt-node .bt-owned{color:#9fd18b;font-size:.75em;text-transform:uppercase;letter-spacing:.06em}
.bt-node.bt-next{border-color:#f0c96a;box-shadow:0 0 0 1px rgba(240,201,106,.35)}.bt-node.bt-lock{opacity:.55}
.bt-node .bt-rep{color:#f0c96a;font-weight:bold;white-space:nowrap}.bt-tier-n{display:inline-block;min-width:22px;text-align:center;border:1px solid #c9a75a;color:#f0c96a;margin-right:6px;font-size:.85em}
.bt-tree-head{display:flex;flex-wrap:wrap;gap:18px;align-items:baseline;border:1px solid #c9a75a;padding:8px 12px;background:rgba(0,0,0,.3);margin:0 0 10px}.bt-tree-head strong{font-size:1.4em;color:#f0c96a}</style>`;

// The perks a page's tree has given you so far, shown at the top of each sub-page.
export function perksLine(s,page){const p=[];
 if(page==='market'){const c=marketCut(s);if(c)p.push(`${c}% off beasts, chariots and equipment`);const g=marketGrade(s),r=reputationGrade(s);if(g!==r)p.push(`Stock up to ${g.name} grade`);}
 if(page==='staff'){const c=signingCut(s);if(c)p.push(`${c}% off signings`);if(noSigningFee(s))p.push('No signing fees');}
 if(page==='facilities'){const c=buildCut(s),u=upkeepCut(s);if(c)p.push(`${c}% off building`);if(u)p.push(`Upkeep ${u}% lower`);}
 return p.length?`<div class="bt-perks"><strong>Your upgrades:</strong>${p.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:'';}

export function marketGradeLine(s){const rep=s.championshipFoundation.facts.reputation,r=reputationGrade(s),g=marketGrade(s),next=MARKET_GRADES[MARKET_GRADES.indexOf(r)+1];
 return `<p><strong>Market quality: ${esc(g.name)}</strong>${g!==r?` (your Reputation alone gives ${esc(r.name)})`:''}${next?` · Next Reputation grade: ${esc(next.name)} at ${next.reputation} (${Math.max(0,next.reputation-rep)} more).`:' · All Reputation grades reached.'} New grades appear at the next market renewal.</p>`;}

export function regionalIntro(s){const r=s.m6.market.regional;if(!r)return `<p>The Regional Market opens in the host nation during a Series, once you have raced its first event. Its stock comes from that nation and is gone when the Series ends.</p>`;
 const nation=Object.values(r.identities??{})[0]?.residentNationId;
 return `<p><strong>Regional Market${nation?' · '+esc(nationName(nation)):''}</strong>. Local stock for this Series only. Anything you buy goes to your stable, not into the turnout you registered.</p>`;}

export function treePanel(s,page){const t=UPGRADE_TREES[page],w=wallet(s),active=!!s.championshipFoundation.activeId,branches=[...new Set(t.nodes.map(n=>n.branch))];
 const node=n=>{const own=hasUpgrade(s,n.id),open=!n.after||hasUpgrade(s,n.after),why=own?'':!open?'Buy the tier above first':active?'Spend Reputation between Series':w<n.cost?`Needs ${n.cost-w} more Reputation`:'';
  return `<div class="bt-node ${own?'bt-own':open?'bt-next':'bt-lock'}" data-upgrade="${n.id}"><h4><span><span class="bt-tier-n">${'I'.repeat(n.tier)}</span>${esc(n.name)}</span>${own?'<span class="bt-owned">Owned</span>':''}</h4><p>${esc(n.text)}</p>${own?'':`<p><span class="bt-rep">${n.cost} Reputation</span></p><button type="button" data-up-buy="${n.id}" ${why?'disabled':''}>Buy</button>${why?` <span class="bt-fx-small">${esc(why)}</span>`:''}`}</div>`;};
 return `<section class="hs-panel"><h2>${esc(t.name)}</h2><p><em>${esc(t.job)}</em></p><div class="bt-tree-head"><span>Reputation to spend <strong>${w}</strong></span><span>Shared with your faction unlocks. Spent Reputation is never refunded.</span></div><div class="bt-tree">${branches.map(b=>`<div class="bt-branch">${t.nodes.filter(n=>n.branch===b).map(node).join('')}</div>`).join('')}</div></section>`;}

export function bindM6Pages(root,s,port,run){
 for(const b of root.querySelectorAll('[data-up-buy]'))b.onclick=()=>{const id=b.dataset.upBuy;run(()=>port.e5('m6.buyUpgrade',{upgradeId:id,confirmed:true}),'Upgrade bought.');};
}
