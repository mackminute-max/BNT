import {point,lapLength} from './oval.js';

// Validate a sampled road corridor, not merely segment connectivity. Samples
// use the same analytic lane geometry as simulation/rendering. Adjacent portions
// of one road are exempt; distant portions (including closed seams) must separate.
export function validateFootprint(t,c,{spacing=4,clearance=c.lanes*c.laneWidth+4}={}){
 if(!Number.isFinite(spacing)||spacing<=0||!Number.isFinite(clearance)||clearance<=0)throw Error('Invalid geometry validation parameters');
 const samples=[];let distance=0,previous=null;
 for(let q=0;q<=t.cells;q+=.25){const p=point(q,(c.lanes-1)/2,c,t);if(previous)distance+=Math.hypot(p.x-previous.x,p.y-previous.y);if(!samples.length||distance-samples.at(-1).distance>=spacing||q===t.cells)samples.push({...p,distance});previous=p;}
 const closed=!t.course||t.closed,total=distance;
 let minimum=Infinity;
 for(let i=0;i<samples.length;i++)for(let j=i+1;j<samples.length;j++){
   let apart=samples[j].distance-samples[i].distance;if(closed)apart=Math.min(apart,total-apart);
   if(apart<=clearance*1.7)continue;
   const separation=Math.hypot(samples[i].x-samples[j].x,samples[i].y-samples[j].y);minimum=Math.min(minimum,separation);
   if(separation<clearance)return {valid:false,message:`Road overlaps or approaches ambiguously near samples ${i}/${j} (${separation.toFixed(2)} < ${clearance} m)`,samples:samples.length};
 }
 return {valid:true,message:'Connected geometry and road corridor validated',samples:samples.length,minimumSeparation:Number.isFinite(minimum)?minimum:null};
}
const footprintCache = new WeakMap();
export function trackDiagnostics(s){
 const t=s.track,c=s.config,terrain={};
 if(!footprintCache.has(t))footprintCache.set(t,validateFootprint(t,c));for(const segment of t.segments){const length=segment.length??(segment.type==='turn'?Math.PI*c.innerRadius:c.straightLength);terrain[segment.terrain??'neutral']=(terrain[segment.terrain??'neutral']??0)+length;}
 return {id:t.id??t.ovalId??'oval',name:t.name??'Standard Oval',type:t.raceType??'Oval',seed:s.setup.course?.generation?.seed??null,generation:s.setup.course?.generation??null,segments:t.segments.length,distance:t.length??lapLength(0,c),leftTurns:t.segments.filter(x=>x.direction<0).length,rightTurns:t.segments.filter(x=>x.direction>0).length,terrainMetres:terrain,minWidth:c.lanes*c.laneWidth,maxWidth:c.lanes*c.laneWidth,validation:footprintCache.get(t),raceStatus:s.status,ticks:s.tick};
}
