import {hash} from '../../core/determinism.js';
import {DATA,PACK_VERSION,PACK_DIGEST} from './m3-bc-data.js';
import {identity as nativeIdentity} from '../../management/content.js';
export const M3BC_ENABLED=typeof BNT_M3BC_BUILD!=='undefined'&&BNT_M3BC_BUILD;
function freeze(v){if(v&&typeof v==='object'){for(const x of Object.values(v))freeze(x);Object.freeze(v);}return v;}freeze(DATA);
const identities=new Map(DATA.identities.map(x=>[x.sourceOfferId,x.presentation_identity]));
const pools=new Map(DATA.radio.map(x=>[x.key,x]));
export function recruitIdentity(record,presentation,state=null){
 const generated=state?.schema===8?state.m6.identities[record?.id]:state?.schema===7?state.m5.identities[record?.id]:null,fallback={...nativeIdentity(record),...(generated?{ancestry:generated.ancestryLabel??null,nationalOrigin:generated.originNationLabel??null,cosmeticSpecies:generated.speciesLabel??null,stockStyle:generated.stockLabel??null,characterization:generated.aiLabel??null,bio:generated.backgroundLabel??'',sex:state?.schema===8?state.m6.driverVisuals[record?.id]?.sex??null:generated.authored?.sex??null}:{})},pin=presentation?.identityPack;
 if(state?.m5?.d2&&generated?.category==='beast'&&generated.authored&&generated.authored.species_id!==generated.speciesId)return fallback;
 if(pin?.version!==PACK_VERSION||pin.digest!==PACK_DIGEST)return fallback;
 const m=identities.get(generated?.authored?generated.sourceOfferId:record?.economics?.sourceOfferId??record?.id);if(!m)return fallback;
 return {...fallback,name:m.name??fallback.name,ancestry:m.ancestry??fallback.ancestry,bio:m.biography??fallback.bio,nationalOrigin:m.national_origin_name??m.stylistic_origin_name??null,cosmeticSpecies:m.species??null,stockStyle:m.stock_style??null,characterization:m.personality??null,disclaimer:m.characterization_disclaimer??null,provisional:false,version:pin.version,...((state?.m5?.d2||state?.schema===8)&&generated?{ancestry:generated.ancestryLabel??null,cosmeticSpecies:generated.speciesLabel??null}: {})};
}
const text=v=>typeof v==='string'&&v.length>0?v:null;
const numeric=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
export function commentaryTokens(type,e){
 const a=e.effects??{},subject=text(e.participants?.[0]);let result={};
 switch(type){
 case 'OVERTAKE':result={passer:text(a.passer),passed:text(a.passed)};break;
 case 'LEAD_CHANGED':result={leader:text(a.leader)};break;
 case 'CONTACT':result={participants:Array.isArray(e.participants)&&e.participants.length&&e.participants.every(x=>text(x)!==null)?e.participants.join(' and '):null};break;
 case 'ATTACK':result={attacker:text(a.attacker),defender:text(a.defender),action:text(a.action),attack_outcome:typeof a.success==='boolean'?(a.success?'connects':'is resisted'):null};break;
 case 'DAMAGE':result={subject,amount_1dp:numeric(a.amount)===null?null:a.amount.toFixed(1),component:text(a.component)};break;
 case 'CONTROL_CHANGED':result={subject,control_lower:text(a.control)?.toLowerCase()??null};break;
 case 'RU_RETIRED':result={subject,reason:text(a.reason)};break;
 case 'WRECK_CREATED':case 'FINAL_LAP':case 'RU_EXITED':result={subject};break;
 case 'WRECK_IMPACT':result={wreckId:text(a.wreckId)};break;
 case 'INCIDENT':result={incident_type:text(a.type),lane_1based:Number.isSafeInteger(a.lane)&&a.lane>=0?String(a.lane+1):null};break;
 case 'SIGN_ACTIVATED':result={subject,sign:text(a.sign)};break;
 case 'COURSE_ENTERED':result={subject,track:text(a.track)};break;
 case 'SEGMENT_ENTERED':result={subject,terrain:text(a.terrain),segment_motion:a.type==='turn'?(numeric(a.direction)===null?null:', turning '+(a.direction>0?'right':'left')):text(a.type)?' straightaway':null};break;
 case 'CHECKPOINT_CROSSED':result={subject,checkpoint:typeof a.checkpoint==='string'?text(a.checkpoint):numeric(a.checkpoint)===null?null:String(a.checkpoint)};break;
 case 'RU_FINISHED':result={subject,time_4dp:numeric(a.time)===null?null:a.time.toFixed(4)};break;
 case 'DIRECTIVE_RESISTANCE':{const d=a.directive;if(d?.decision!=='Resisting'||a.executionError||a.stressError)return null;result={subject,sign:text(d.sign),selected:text(d.selected),reason:text(d.reason)};break;}
 }
 return result;
}
// Called only for lines already emitted by the native reporter. It never emits
// events, calls the reporter or reads producer-ahead state. Missing data passes through.
export function alternateLine(line,event,presentation){
 if(presentation?.radio?.version!==1||presentation.radio.enabled!==true)return line;
 if(!event||line.eventId!==event.id||line.time!==event.time||event.type!==(line.type==='DIRECTIVE_RESISTANCE'?'AI_DECISION':line.type))return line;
 const pool=line.type==='DIRECTIVE_RESISTANCE'?DATA.special[0]:pools.get(line.type);if(!pool)return line;
 const tokens=commentaryTokens(line.type,event);if(!tokens||pool.allowed_tokens.some(k=>typeof tokens[k]!=='string'))return line;
 const template=pool.variants[line.type==='DIRECTIVE_RESISTANCE'?0:hash(`${line.eventId}:${line.type}`)%pool.variants.length];
 return {...line,text:template.replace(/\{([a-z_]+)\}/g,(_,k)=>tokens[k])};
}
export function projectAcceptedLines(lines,events,presentation){const byId=new Map();for(const e of events??[]){if(byId.has(e.id))byId.set(e.id,null);else byId.set(e.id,e);}return lines.map(line=>alternateLine(line,byId.get(line.eventId),presentation));}
// Bounded display history, independent of reporter history/journals. Supports
// immediately restoring native wording when the player turns alternate radio off.
export function createRadioDisplay(limit=160){
 if(!Number.isSafeInteger(limit)||limit<1||limit>200)throw Error('Invalid radio display bound');let history=[];
 return {reset(){history=[];},accept(lines,events,presentation){const byId=new Map();for(const e of events??[]){if(byId.has(e.id))byId.set(e.id,null);else byId.set(e.id,e);}for(const line of lines)history.push({line:structuredClone(line),event:byId.get(line.eventId)?structuredClone(byId.get(line.eventId)):null});history=history.slice(-limit);return lines.map(line=>alternateLine(line,byId.get(line.eventId),presentation));},refresh(presentation){return history.map(({line,event})=>alternateLine(line,event,presentation));},get size(){return history.length;}};
}
