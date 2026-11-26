import {refreshPresentationMetadata} from '../../src/career/m6/presentation.js';
// Synthetic compact-history capacity; no claim that these races were simulated.
import {fixture} from '../e5-d/m4/fixture.mjs';
import {createM6} from '../../src/career/m6/current.js';
import {validateM6} from '../../src/career/m6/schema.js';
import {nationalBoard} from '../../src/career/m6/world.js';
import {denEvent} from '../../src/career/m6/den.js';
import {fingerprint} from '../../src/career/cycles/contracts.js';
import {envelopeM6,readM6} from '../../src/persistence/m6/envelope.js';
import {writeFile} from 'node:fs/promises';
const f=fixture('veteran','capacity-current'),base=createM6(f.store.state,{version:1,nationality:'N1',ancestry:'A01',sex:'female',startingNation:'N1'}),rows=[];
for(const count of [10,25,50,100,500]){const s=structuredClone(base),m=s.m6,w=m.world;m.summaries=Array.from({length:count},(_,i)=>({id:'m6-run-'+(i+1)+'-'+fingerprint([s.career.id,i+1]).slice(0,24),sequence:i+1,nationId:'N1',type:i?'local':'intro',name:'Synthetic retained championship '+(i+1),placement:4,won:false,starts:10,raceWins:0,raceLosses:10,dnf:0,podiums:0,grossGold:0,netGold:0,reputation:0,withdrawal:null}));m.closedThrough=m.instanceSequence=count;w.introCompleted=true;w.nations.N1.epoch=count;w.nations.N1.batchFingerprint=fingerprint(nationalBoard(s.career.id,'N1',w.nations.N1,true));s.e5.board=structuredClone(nationalBoard(s.career.id,'N1',w.nations.N1,true));s.championshipFoundation.offers=s.e5.board.map(d=>structuredClone(d.offer));m.gambling.den.epoch=count;m.gambling.den.events=m.gambling.den.events.map(e=>structuredClone(denEvent(s,{...e.source,epoch:count})));refreshPresentationMetadata(s);const start=performance.now();refreshPresentationMetadata(s);validateM6(s);const validated=performance.now(),text=envelopeM6(s,f.store.presentation).text,encoded=performance.now(),cold=readM6(text),end=performance.now();if(cold.primary.m6.closedThrough!==count)throw Error('Lost history');rows.push({synthetic:true,championships:count,raceSummaryEquivalent:count*10,bytes:Buffer.byteLength(text),logicalLimitBytes:8*1024*1024,validateMs:validated-start,encodeMs:encoded-validated,coldReadMs:end-encoded,memory:process.memoryUsage()});console.log(rows.at(-1));}
await writeFile('/workspace/deliverables/bnt-m6-p1/evidence/capacity-current.json',JSON.stringify({note:'Synthetic compact current-state summaries; no native gameplay, financial earning or browser quota claim',rows},null,2));
