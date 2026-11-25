import {m6Witness} from '../../career/m6/schema.js';
import {M5IndexedRecords} from '../m5/indexeddb.js';
import {readM6} from './envelope.js';
export class M6IndexedRecords extends M5IndexedRecords{
 static async open(options={}){const base=await M5IndexedRecords.open({...options,name:options.name??'BNT-M6-v1'});return new M6IndexedRecords(base.db,{navigation:options.navigation});}
 async snapshot(){const s=await super.snapshot();if(s.records.length)readM6(s.records.find(([k])=>k==='bnt.career.save.v1')?.[1]);return s;}
 async commit(args){readM6(args.records.find(([k])=>k==='bnt.career.save.v1')?.[1]);return super.commit(args);}
 async recoverySource(){const source=await super.recoverySource(),tx=this.db.transaction('authority','readonly'),q=tx.objectStore('authority').get('m5-clock'),clock=await new Promise((r,j)=>{q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error);});if(clock.hash!==source.clockHash||typeof clock.value.currentWitness!=='string')throw Error('STALE_WRITER: M6 recovery witness changed');return {...source,currentWitness:clock.value.currentWitness};}
 async activatePrevious(token,candidate){const actual=await this.recoverySource();if(candidate?.sourceToken.currentWitness!==token.currentWitness||actual.currentWitness!==token.currentWitness||m6Witness(readM6(candidate.records.find(([k])=>k==='bnt.career.save.v1')?.[1]).primary)!==actual.currentWitness)throw Error('Invalid M6 recovery witness');return super.activatePrevious(token,candidate);}
}
