// Experimental index of ALREADY fully decoded records. No decoded history graphs
// are retained. Cold load always opens CareerStore and decodes every session.
import{CareerStore}from'../../src/persistence/career-store.js';import{RaceSessionStore}from'../../src/persistence/race/session-store.js';import{wireHash}from'../../src/sim/foundation/codec.js';import{checkRecords}from'../../src/persistence/e4/indexeddb.js';
export class HistoryIndex {
 constructor(){this.entries=new Map();this.raw=null;this.career=null;}
 reset(){this.entries.clear();this.raw=null;this.career=null;}
 validate(snapshot){
  if(!Number.isSafeInteger(snapshot.generation)||snapshot.generation<0)throw Error("Invalid generation");checkRecords(snapshot.records);const map=new Map(snapshot.records),storage={getItem:k=>map.get(k)??null,setItem(){throw Error('Read-only validation');}},raw=map.get('bnt.career.save.v1');if(!raw)throw Error('Missing career');
  if(raw!==this.raw){const c=new CareerStore(storage);c.open();if(c.mode!=='automatic'||!c.current)throw Error('Invalid protected career');this.career=c;this.raw=raw;}
  const state=this.career.current;let decoded=0,reused=0,total=0;
  for(const x of Object.values(state.championshipFoundation?.instances??{})){for(const r of x.raceResults??[])if(r.kind==='NativeCleared'&&!map.has(r.reference.storageKey))throw Error('Missing official session');if(x.checkpointRef?.storageKey&&!map.has(x.checkpointRef.storageKey))throw Error('Missing live session');}
  const next=new Map();for(const[k,text]of map){if(k==='bnt.career.save.v1')continue;total+=text.length*2;if(total>128*1024*1024||next.size>=20000)throw Error('Experimental index capacity');const r=JSON.parse(text),a=r.authority?.value,x=state.championshipFoundation.instances?.[a?.identity?.instanceId],official=x?.raceResults.find(v=>v.raceId===a.identity.raceId);
   if(!x||a.identity.profileId!==state.profile.id||a.identity.careerId!==state.career.id||!official&&x.raceId!==a.identity.raceId)throw Error('Foreign session');const anchor=official?.anchor??x.raceAnchor;if(!anchor)throw Error('Missing frozen anchor');
   const binding=JSON.stringify({identity:a.identity,anchor,authorityHash:official?.reference.authorityHash??null,storageKey:official?.reference.storageKey??x.checkpointRef?.storageKey??k});const old=this.entries.get(k);
   if(old?.text===text&&old.binding===binding){reused++;next.set(k,old);continue;}
   const session=new RaceSessionStore(storage,{identity:a.identity,getCareerAnchor:()=>anchor});if(session.key!==k)throw Error('Wrong session key');const d=session.decode(text);if(official&&official.reference.authorityHash!==wireHash(d.r.authority))throw Error('Official authority mismatch');decoded++;next.set(k,{text,binding});
  }
  this.entries=next;return {decoded,reused,retainedEntries:next.size,retainedNativeGraphs:0,generation:snapshot.generation};
 }
}
