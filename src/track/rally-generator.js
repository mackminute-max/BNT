import {random} from '../core/determinism.js';
import {makeRally,compileCourse} from './course.js';
import {config} from '../config/config.js';
import {validateFootprint} from './validation.js';

const line=length=>({length,turn:0});
const arc=(turn,radius)=>({length:Math.abs(turn)*Math.PI/180*radius,turn});
const offset=(turn,radius,straight=20)=>[arc(turn,radius),line(straight),arc(-turn,radius)];
export const rallyChunks=Object.freeze({
  'short-straight':[line(55)],'medium-straight':[line(90)],'long-straight':[line(145)],
  'gentle-left':offset(-35,55,25),'gentle-right':offset(35,55,25),
  'sharp-left':offset(-65,36,25),'sharp-right':offset(65,36,25),
  'hairpin-left':offset(-150,38,40),'hairpin-right':offset(150,38,40),
  's-left-right':[arc(-45,38),arc(90,38),arc(-45,38)],
  's-right-left':[arc(45,38),arc(-90,38),arc(45,38)],
  'narrow-passage':[line(30),arc(-55,28),arc(55,28),line(20)],
  'wide-passing':[line(180)],'rough-section':[line(70)],
  'terrain-transition':[line(45),line(55)],
  'technical-combination':[arc(-60,30),arc(90,30),arc(-30,30),line(25)],
  'fast-open':[line(160),arc(20,70),arc(-20,70)],
});
export const rallyCategories=Object.freeze({short:{chunks:6},medium:{chunks:12},long:{chunks:22}});
export const rallyTerrainProfiles=Object.freeze({
 balanced:{dirt:4,stone:3,gravel:2,sand:1,mud:1},
 road:{dirt:2,stone:7,gravel:1,sand:0,mud:0},
 rugged:{dirt:2,stone:1,gravel:4,sand:2,mud:2},
});
export function generationOptions(input={}){
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['seed','category','terrainProfile','terrainWeights','turnFrequency','turnSeverity','chunks','maxAttempts','chunkLibrary','laneWidth'].includes(k)))throw Error('Invalid rally generator options');
 const seed=input.seed??1,category=input.category??'medium',terrainProfile=input.terrainProfile??'balanced';
 if(!Number.isSafeInteger(seed)||!Object.hasOwn(rallyCategories,category)||!Object.hasOwn(rallyTerrainProfiles,terrainProfile))throw Error('Invalid rally seed, category or terrain profile');
 const o={seed,category,terrainProfile,terrainWeights:{...(input.terrainWeights??rallyTerrainProfiles[terrainProfile])},turnFrequency:input.turnFrequency??.55,turnSeverity:input.turnSeverity??.5,chunks:input.chunks??rallyCategories[category].chunks,maxAttempts:input.maxAttempts??12,laneWidth:input.laneWidth??4};
 for(const k of ['turnFrequency','turnSeverity'])if(!Number.isFinite(o[k])||o[k]<0||o[k]>1)throw Error('Invalid '+k+' (0..1)');
 if(!Number.isInteger(o.chunks)||o.chunks<4||o.chunks>24||!Number.isInteger(o.maxAttempts)||o.maxAttempts<1||o.maxAttempts>32||!Number.isFinite(o.laneWidth)||o.laneWidth<1||o.laneWidth>4)throw Error('Invalid generation bounds or width');
 if(Object.keys(o.terrainWeights).some(k=>!Object.hasOwn(rallyTerrainProfiles.balanced,k))||Object.values(o.terrainWeights).some(v=>!Number.isFinite(v)||v<0||v>100)||!Object.values(o.terrainWeights).some(v=>v>0))throw Error('Invalid terrain distribution');
 const library=input.chunkLibrary??rallyChunks;
 if(!library||typeof library!=='object'||Array.isArray(library)||!Object.keys(library).length||Object.keys(library).length>64)throw Error('Invalid chunk library');
 for(const [id,items] of Object.entries(library))if(!/^[a-z0-9-]{1,40}$/.test(id)||!Array.isArray(items)||!items.length||items.length>5||items.some(s=>!s||Object.keys(s).some(k=>!['length','turn'].includes(k))||!Number.isFinite(s.length)||s.length<1||s.length>200||!Number.isFinite(s.turn)||Math.abs(s.turn)>170))throw Error('Invalid chunk '+id);
 return {...o,chunkLibrary:structuredClone(library)};
}
function pickTerrain(o,draw,key){const items=Object.entries(o.terrainWeights).filter(([,w])=>w>0);let n=draw('terrain',key)*items.reduce((a,[,w])=>a+w,0);return items.find(([,w])=>(n-=w)<0)?.[0]??items.at(-1)[0];}
export function generateRally(input={}){
 const o=generationOptions(input),c=config({laneWidth:o.laneWidth});
 const build=(attempt,fallback=false)=>{
   const draw=(...key)=>random(o.seed,'rally-generator-v1',attempt,...key),parts=[],used=[];
   for(let i=0;i<o.chunks;i++){
     const turning=!fallback&&draw('turn',i)<o.turnFrequency;
     let choices=Object.entries(o.chunkLibrary).filter(([id,items])=>{
       const hasTurn=items.some(s=>s.turn!==0),severe=items.some(s=>Math.abs(s.turn)>90);
       const peak=Math.max(...items.map(s=>Math.abs(s.turn)));
       return hasTurn===turning&&peak<=45+125*o.turnSeverity&&(!severe||draw('severity',i)<o.turnSeverity);
     });
     const fresh=choices.filter(([id])=>!used.slice(-2).includes(id));if(fresh.length)choices=fresh;
     let id,items;
     if(!choices.length){id=fallback?'fallback-straight':'safe-straight';items=[line(85)];}
     else [id,items]=choices[Math.floor(draw('chunk',i)*choices.length)];
     if(fallback){id='fallback-straight';items=[line(85)];}
     used.push(id);const terrain=pickTerrain(o,draw,i);
     for(let j=0;j<items.length;j++)parts.push([items[j].length,items[j].turn,id==='terrain-transition'?pickTerrain(o,draw,i+'-'+j):terrain]);
   }
   const course=makeRally('rally-'+o.category+'-'+String(o.seed).replace('-','n'),'Generated '+o.category+' Rally · '+o.seed,[[80,0,'dirt'],...parts,[80,0,'dirt']]);
   // Endpoints use the requested distribution as well; no forced forbidden terrain.
   course.segments[0].terrain=pickTerrain(o,draw,'start');course.segments.at(-1).terrain=pickTerrain(o,draw,'finish');
   course.generation={version:1,seed:o.seed,category:o.category,terrainProfile:o.terrainProfile,attempt,fallback,chunks:used,options:structuredClone(o)};
   const t=compileCourse(course,c),validation=validateFootprint(t,c);if(!validation.valid)throw Error(validation.message);
   return course;
 };
 const failures=[];for(let attempt=0;attempt<o.maxAttempts;attempt++)try{return build(attempt);}catch(e){failures.push(e.message);}
 const fallback=build(o.maxAttempts,true);fallback.generation.failures=failures;return fallback;
}
