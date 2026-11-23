import {validatePresentation} from './presentation.js';
export const defaultRuntime=()=>({version:1,paused:true,speed:1,cadence:100});
export function validateRuntime(r){
 const keys=r?.version===2?'cadence,paused,presentation,speed,version':'cadence,paused,speed,version';
 if(!r||Object.keys(r).sort().join(',')!==keys||![1,2].includes(r.version)||typeof r.paused!=='boolean'||!Number.isFinite(r.speed)||r.speed<.25||r.speed>16||!Number.isInteger(r.cadence)||r.cadence<25||r.cadence>1000)throw Error('Invalid playback/checkpoint settings');
 if(r.version===2)validatePresentation(r.presentation);return r;
}
