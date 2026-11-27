// Home Stable: the trackside event waiting for an answer (Phase 4).
import {EVENTS,eventWords,choiceCost} from '../career/m6/events.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CSS=`<style>.bt-event{border:2px solid #c9a75a;background:linear-gradient(180deg,rgba(90,20,20,.55),rgba(0,0,0,.35));padding:12px 14px}.bt-event h3{margin:0 0 4px;font-size:1.3em}.bt-event-text{font-style:italic;margin:0 0 10px}.bt-event-choices{display:flex;flex-wrap:wrap;gap:8px}.bt-event-choices button small{display:block;font-size:.75em;opacity:.85;text-transform:none;letter-spacing:0}.bt-event-last{opacity:.85;font-size:.95em}</style>`;
export function m6EventPanel(s){
 const v=s.m6?.events;if(!v)return '';const p=v.pending;
 if(!p)return v.log.length?`<section class="hs-panel"><h2>Trackside Event</h2>${CSS}<p class="bt-event-last">${esc(v.log[0])}</p></section>`:'';
 const card=EVENTS[p.id],gold=s.career.treasury;
 const buttons=card.choices.map((c,i)=>{const cost=choiceCost(c),risk=c.risk?` · ${c.risk.chance}% chance it goes well`:'';return `<button data-bt-event-choice="${i}" ${gold<cost?'disabled title="Not enough Gold"':''}>${esc(c.label)}${risk?`<small>${esc(risk.slice(3))}</small>`:''}</button>`;}).join('');
 return `<section class="hs-panel" data-bt-focus="event-${p.sequence}-${esc(p.id)}"><h2>Trackside Event</h2>${CSS}<div class="bt-event"><h3>${esc(card.title)}</h3><p class="bt-event-text">${esc(eventWords(s,card.text,p.rival))}</p><div class="bt-event-choices">${buttons}</div></div>${v.log.length?`<p class="bt-event-last">Last time: ${esc(v.log[0])}</p>`:''}</section>`;
}
export function bindM6Events(root,s,port,run){for(const b of root.querySelectorAll('[data-bt-event-choice]'))b.onclick=()=>run(()=>port.e5('m6.eventChoose',{choice:Number(b.dataset.btEventChoice),confirmed:true}),'Decision made.');}
