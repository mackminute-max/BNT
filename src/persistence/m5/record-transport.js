// Ephemeral lossless transport compression only. References recover exact bytes;
// the existing domain validators and durable read-set CAS still run afterwards.
// Only immutable history pages are retained. Prefix admission avoids sequential
// scans evicting all useful entries when total history exceeds the cache bound.
// This is never a storage format, persisted cache token, or durable receipt.
export function recordTransport({maxBytes=32*1024*1024,maxEntries=256}={}){
 const byId=new Map(),byText=new Map();let sequence=0,bytes=0;
 function remember(id,text,key){if(byId.has(id))throw Error('Duplicate transport identity');const size=text.length*2;if(!key.startsWith('bnt.m5.history.')||bytes+size>maxBytes||byId.size>=maxEntries)return;byId.set(id,text);byText.set(text,id);bytes+=size;}
 function records(rows,decode){return rows.map(([key,v])=>{if(!decode){if(typeof key!=='string'||typeof v!=='string')throw Error('Invalid record transport input');const id=byText.get(v);if(id!==undefined)return [key,{ref:id}];const fresh=++sequence;remember(fresh,v,key);return [key,{id:fresh,text:v}];}if(!v||typeof v!=='object')throw Error('Invalid record transport row');if(Object.keys(v).length===1&&Number.isSafeInteger(v.ref)){if(!byId.has(v.ref))throw Error('Missing private transport reference; reload authority');return [key,byId.get(v.ref)];}if(Object.keys(v).sort().join(',')!=='id,text'||!Number.isSafeInteger(v.id)||v.id<1||typeof v.text!=='string')throw Error('Invalid record transport definition');remember(v.id,v.text,key);return [key,v.text];});}
 function visit(value,decode){if(!value||typeof value!=='object'||Array.isArray(value))return value;const out={...value};if(Array.isArray(value.records))out.records=records(value.records,decode);for(const k of ['snapshot','previous'])if(value[k])out[k]=visit(value[k],decode);return out;}
 return {encode:value=>({protocol:'m5-record-transport-v1',value:visit(value,false)}),decode:wire=>{if(wire?.protocol!=='m5-record-transport-v1')throw Error('Unsupported record transport');return visit(wire.value,true);},stats:()=>({bytes,entries:byId.size,maxBytes,maxEntries}),clear(){byId.clear();byText.clear();bytes=0;sequence=0;}};
}
