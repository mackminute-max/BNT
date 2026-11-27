// Facilities page (systems phase): five buildings, three levels each.
import {FACILITIES,FACILITY_IDS,facilityLevels,levelInfo,upkeepOf} from '../career/m6/facilities.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const FACILITY_CSS=`.bt-fac-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.bt-fac{border:1px solid var(--bt-line,#6b5a3e);padding:12px;background:rgba(0,0,0,.25);display:flex;flex-direction:column;gap:6px}
.bt-fac h3{margin:0;display:flex;justify-content:space-between;align-items:center}
.bt-fac-pips{display:flex;gap:4px}.bt-fac-pips i{width:14px;height:14px;border:1px solid #c9a75a;transform:rotate(45deg);display:inline-block}.bt-fac-pips i.on{background:#c9a75a}
.bt-fac .bt-fac-now{color:#9fd18b}.bt-fac .bt-fac-next{color:#e8d9b8}.bt-fac .bt-fac-cost{font-weight:bold}
.bt-fac button{margin-top:auto}.bt-fac-report{border-left:3px solid #c9a75a;padding-left:10px}`;
export function m6FacilitiesPage(s){
 const levels=facilityLevels(s),active=!!s.championshipFoundation.activeId,report=s.m6.facilities?.report,upkeep=upkeepOf(levels);
 const cards=FACILITY_IDS.map(id=>{const f=FACILITIES[id],l=levels[id],now=levelInfo(id,l),next=l<3?f.levels[l]:null,afford=next&&s.career.treasury>=next.cost,why=active?'Build between Series':!next?'Top level':!afford?`Needs ${next.cost} Gold`:'';
  return `<article class="bt-fac" data-facility="${id}"><h3>${esc(f.name)}<span class="bt-fac-pips" aria-label="Level ${l} of 3">${[1,2,3].map(n=>`<i class="${n<=l?'on':''}"></i>`).join('')}</span></h3><p><em>${esc(f.job)}</em></p>
  <p class="bt-fac-now">${now?`<strong>Level ${l}:</strong> ${esc(now.effect)} Upkeep ${now.upkeep} Gold per Series.`:'Not built.'}</p>
  ${next?`<p class="bt-fac-next"><strong>Level ${l+1}:</strong> ${esc(next.effect)}</p><p class="bt-fac-cost">${next.cost} Gold to build · upkeep ${next.upkeep} Gold per Series</p>`:''}
  <button data-m6-build="${id}" ${why?'disabled':''}>${next?(l?'Upgrade to level '+(l+1):'Build'):'Fully built'}</button>${why&&next?`<p>${esc(why)}</p>`:''}</article>`;}).join('');
 const head=`<p>Your buildings work between Series, never during one. Upkeep is paid when each Series ends: <strong>${upkeep} Gold per Series</strong> right now. If you can't pay in full, the buildings give no care that time.</p>`;
 const last=report?`<div class="bt-fac-report"><h3>After ${esc(report.series)}</h3><p>Upkeep paid: ${report.paid} of ${report.upkeep} Gold.</p>${report.lines.map(l=>`<p>${esc(l)}</p>`).join('')}</div>`:'';
 return `<style>${FACILITY_CSS}</style><section class="hs-panel"><h2>Facilities</h2>${head}<div class="bt-fac-grid">${cards}</div>${last}</section>`;
}
export function bindM6Facilities(root,s,port,run){for(const b of root.querySelectorAll('[data-m6-build]'))b.onclick=()=>{const f=FACILITIES[b.dataset.m6Build];run(()=>port.e5('m6.buildFacility',{facilityId:b.dataset.m6Build,confirmed:true}),f.name+' built.');};}
