// Racing Nations landing page: the map of Vaern (Mack's art), with each nation a
// clickable region that opens its page. Nations not yet unlocked are greyed out
// under a lock. Region outlines are hand-traced in percent of the map image.
import {WORLD_CONTENT} from '../career/m6/world-content.generated.js';
import {nationUnlocked} from '../career/m6/world.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const MAP_REGIONS=Object.freeze({
 N1:{shape:[[14,30],[20,18],[30,8],[38,5],[43,12],[45,25],[44,38],[35,40],[25,38],[15,36]],label:[33,14]},
 N2:{shape:[[41,8],[48,3],[60,3],[64,12],[62,25],[59,36],[48,37],[44,30],[44,14]],label:[46,13]},
 N3:{shape:[[61,22],[66,10],[78,8],[92,10],[96,22],[92,38],[78,42],[66,40],[59,36]],label:[72,14]},
 N4:{shape:[[5,52],[10,42],[20,37],[30,40],[34,48],[33,58],[25,62],[15,62],[6,58]],label:[11,50]},
 N5:{shape:[[38,42],[44,36],[52,33],[60,38],[65,48],[62,58],[52,62],[40,58],[36,50]],label:[58,40]},
 N6:{shape:[[67,48],[72,42],[85,40],[97,44],[98,58],[90,65],[75,64],[66,58]],label:[89,57]},
 N7:{shape:[[16,72],[20,62],[30,59],[37,64],[38,78],[33,88],[22,90],[16,82]],label:[21,66]},
 N8:{shape:[[45,80],[55,68],[68,62],[82,63],[93,72],[90,88],[72,96],[55,97],[46,92]],label:[81,84]},
});
const CSS=`<style>.bt-map{position:relative;width:min(100%,calc((100vh - 330px) * 1.777));margin:0 auto;aspect-ratio:1672/941;border:2px solid #c9a75a;background:#1c2a2a}.bt-map img{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block}.bt-map svg{position:absolute;inset:0;width:100%;height:100%}
.bt-map polygon{fill:transparent;stroke:transparent;stroke-width:.4;cursor:pointer;transition:fill .15s,stroke .15s}.bt-map a:hover polygon,.bt-map a:focus polygon{fill:rgba(240,201,106,.18);stroke:#f0c96a}.bt-map a:focus{outline:none}
.bt-map .bt-locked polygon{fill:rgba(25,25,25,.62);stroke:rgba(0,0,0,.4)}.bt-map .bt-locked:hover polygon,.bt-map .bt-locked:focus polygon{fill:rgba(25,25,25,.5);stroke:#888}
.bt-map-lock{position:absolute;transform:translate(-50%,-50%);pointer-events:none;width:3.2em;height:3.2em;border-radius:50%;background:rgba(40,40,40,.85);border:2px solid #9a9a9a;display:grid;place-items:center;font-size:clamp(10px,1.2vw,16px);filter:grayscale(1)}.bt-map-lock span{font-size:1.6em}
.bt-map-here{position:absolute;transform:translate(-50%,-50%);pointer-events:none;background:#5a1414;color:#f0c96a;border:1px solid #f0c96a;padding:1px 8px;font-weight:bold;font-size:clamp(9px,1vw,14px);white-space:nowrap;letter-spacing:.04em}
.bt-map-key{display:flex;gap:16px;flex-wrap:wrap;margin:6px 0 0;font-size:.9em}</style>`;
export function m6MapPage(s){
 const w=s.m6.world,art=globalThis.__BNT_MEDIA__?.art?.BNT_ART_Map_Vaern;
 const nations=WORLD_CONTENT.profiles.filter(p=>MAP_REGIONS[p.id]);
 const state=p=>{const n=w.nations[p.id];return n?.entered||nationUnlocked(s,p.id)?'open':'locked';};
 const status=p=>{const n=w.nations[p.id];return n?.prestigeWon?'Prestige title won':n?.entered?`Tier ${n.tier} · ${n.localWins} local wins`:state(p)==='open'?'Ready to visit':p.id==='N5'?'Locked: win all seven national Prestige titles':'Locked: win your home Prestige title';};
 const regions=nations.map(p=>{const r=MAP_REGIONS[p.id],locked=state(p)==='locked';return `<a class="${locked?'bt-locked':'bt-open'}" data-bt-nation-tab="${esc(p.name)}" role="button" tabindex="0" aria-label="${esc(p.name)}: ${esc(status(p))}"><title>${esc(p.name)} · ${esc(status(p))}</title><polygon points="${r.shape.map(([x,y])=>x+','+y).join(' ')}"/></a>`;}).join('');
 const marks=nations.map(p=>{const [x,y]=MAP_REGIONS[p.id].label;return state(p)==='locked'?`<div class="bt-map-lock" style="left:${x}%;top:${y}%"><span>🔒</span></div>`:p.id===w.currentNation?`<div class="bt-map-here" style="left:${x}%;top:${y}%">★ You race here</div>`:'';}).join('');
 const body=art?`<div class="bt-map"><img src="${art}" alt="Map of the continent of Vaern"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${regions}</svg>${marks}</div>`:`<div class="m3p-event-grid">${nations.map(p=>`<article><h3><a href="#" data-bt-nation-tab="${esc(p.name)}">${esc(p.name)}</a></h3><p>${esc(status(p))}</p></article>`).join('')}</div>`;
 return `<section class="hs-panel"><h2>Racing Nations</h2>${CSS}<p>Choose a nation on the map to see its racing, rivals and history. ${s.championshipFoundation.activeId?'Finish your current Series before moving to another nation.':'Open a nation’s page to race there.'}</p>${body}<p class="bt-map-key"><span>★ Where you race now</span><span>🔒 Not unlocked yet</span></p></section>`;
}
