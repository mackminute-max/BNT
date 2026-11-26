import {COPY_DATA} from './copy.generated.js';
const freeze=o=>{for(const v of Object.values(o))if(v&&typeof v==='object')freeze(v);return Object.freeze(o);};
export const COPY=freeze(COPY_DATA);
export const COPY_ENABLED=typeof BNT_M3A_BUILD!=='undefined'&&BNT_M3A_BUILD;
export const escapeCopy=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const activationText=text=>(globalThis.BNT_M1?.port?.durableView?.state?.schema===8||globalThis.BNT_M1?.port?.store?.current?.schema===8||globalThis.P1?.session?.setup?.entrants?.some(e=>[2,3].includes(e.progressionContext?.version)))?'Select a Sign to activate it on the next simulation tick. The race-wide allowance is available from the start; No Sign is free. Selecting an already active Sign does not spend another use.':text;
export function descriptionFor(category,key,fallback=''){return Object.hasOwn(COPY,category)&&Object.hasOwn(COPY[category],key)?COPY[category][key].text:fallback;}
export function textParagraph(text,identity=''){return text?`<p class="m3-copy" data-m3-copy="${escapeCopy(identity)}">${escapeCopy(text)}</p>`:'';}
export function copyParagraph(category,key,enabled=COPY_ENABLED){return enabled?textParagraph(descriptionFor(category,key),category+':'+key):'';}
export function helpList(category,heading,enabled=COPY_ENABLED){if(!enabled||!Object.hasOwn(COPY,category))return '';return `<details class="m3-help" data-m3-help="${escapeCopy(category)}"><summary>${escapeCopy(heading)}</summary>${Object.entries(COPY[category]).map(([key,r])=>`<section><h4>${escapeCopy(r.label??key)}</h4>${copyParagraph(category,key,true)}${r.activation?textParagraph(activationText(r.activation),category+':'+key+':activation'):''}</section>`).join('')}</details>`;}
// Guards only decide whether explanatory text belongs in this UI context.
// They never authorize actions or mutate the supplied state.
export function uiAllowed(key,c={}){switch(key){
 case 'new_career_empty':return c.initialized===false&&['draft','uninitialized'].includes(c.kind);
 case 'package_commit':return c.kind==='package-review';
 case 'market_fixed':return c.kind==='market';
 case 'ru_composition':return c.kind==='roster';
 case 'service_locked':return c.locked===true;
 case 'contract_expiry':return c.expired===true;
 case 'reward_pending':return c.hasEntitlement===true&&c.entitlementState==='pending';
 case 'reward_credited':return c.hasEntitlement===true&&c.entitlementState==='credited';
 case 'reward_deferred':return c.placeholder===true;
 case 'legacy_slots':return c.schema===6;
 case 'race_results':return c.kind==='results';
 case 'load_warning':return c.kind==='saves';
 default:return false;}}
export function uiCopy(key,context={},enabled=COPY_ENABLED){return enabled&&uiAllowed(key,context)?copyParagraph('ui',key,true):'';}
export function raceHelp(state,{sign=null,enabled=COPY_ENABLED}={}){if(!enabled)return '';const weather=state?.weather,current=sign&&Object.hasOwn(COPY.signs,sign)?sign:null;return (current?`<h3>Selected Strategy Sign: ${escapeCopy(current)}</h3>${copyParagraph('signs',current,true)}${textParagraph(activationText(COPY.signs[current].activation),'signs:'+current+':activation')}`:'')+(weather&&Object.hasOwn(COPY.weather,weather)?`<h3>Current weather: ${escapeCopy(weather)}</h3>${copyParagraph('weather',weather,true)}`:'')+helpList('signs','Strategy Sign help',true)+helpList('weather','Weather help',true)+helpList('raceIncidents','Racing incident help',true);}

export function trackCopyKey(event){const c=event?.course;return typeof c==='string'?c:c?.id??(c==null?'oval':'');}
export function trackLabel(event){return event?.course?.name??(COPY_ENABLED?COPY.tracks[trackCopyKey(event)]?.label:null)??'Standard Oval';}
