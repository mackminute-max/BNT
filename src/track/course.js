import {surfaceDefaults, surfaceRules} from './surfaces.js';

export const terrainProfiles = Object.freeze({
  dirt: {grip:1,roughness:.12,rollingResistance:1,hazardModifier:1},
  stone: {grip:1.1,roughness:.03,rollingResistance:.95,hazardModifier:.7},
  gravel: {grip:.8,roughness:.3,rollingResistance:1.08,hazardModifier:1.3},
  sand: {grip:.7,roughness:.4,rollingResistance:1.2,hazardModifier:.9},
  mud: {grip:.6,roughness:.5,rollingResistance:1.25,hazardModifier:1.4},
});
const mod=(x,n)=>((x%n)+n)%n;
const finite=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max;
const identifier=x=>typeof x==='string'&&!['__proto__','prototype','constructor'].includes(x)&&/^[a-zA-Z0-9_-]{1,64}$/.test(x);
function advance(x,y,h,length,angle,fraction=1){
  if(!angle)return {x:x+Math.cos(h)*length*fraction,y:y+Math.sin(h)*length*fraction,heading:h};
  const signedRadius=length/angle,a=h+angle*fraction;
  return {x:x+signedRadius*(Math.sin(a)-Math.sin(h)),y:y-signedRadius*(Math.cos(a)-Math.cos(h)),heading:a};
}
export function normalizeCourse(input){
  if(typeof input==='string'){
    if(!Object.hasOwn(coursePresets,input))throw Error('Unknown track preset');
    input = structuredClone(coursePresets[input]);
  }
  if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['id','name','kind','closed','lanes','segments','checkpoints','generation'].includes(k)))throw Error('Invalid course definition');
  if(!identifier(input.id)||typeof input.name!=='string'||!input.name.length||input.name.length>100||!['Circuit','Rally'].includes(input.kind)||input.closed!==(input.kind==='Circuit')||input.lanes!==4)throw Error('Invalid course kind, topology or lanes');
  if(!Array.isArray(input.segments)||input.segments.length<2||input.segments.length>128)throw Error('Invalid course segments');
  const seen=new Set();
  const segments=input.segments.map((s,i)=>{
    if(!s||typeof s!=='object'||Object.keys(s).some(k=>!['id','length','tiles','turn','terrain','surface','next'].includes(k))||!identifier(s.id)||seen.has(s.id)||!finite(s.length,1,2000)||!Number.isInteger(s.tiles)||s.tiles<1||s.tiles>256||!finite(s.turn,-180,180))throw Error('Invalid course segment');
    seen.add(s.id);
    if(s.next!==(input.segments[i+1]?.id??(input.closed?input.segments[0].id:null)))throw Error('Invalid course connection');
    if(s.terrain!==undefined&&!Object.hasOwn(terrainProfiles,s.terrain))throw Error('Invalid terrain profile');
    const surface={...surfaceDefaults,...(terrainProfiles[s.terrain]??{}),...s.surface};
    if(s.surface!==undefined&&(!s.surface||typeof s.surface!=='object'||Array.isArray(s.surface)))throw Error('Invalid course surface');
    for(const [k,v] of Object.entries(surface))if(!Object.hasOwn(surfaceRules,k)||!finite(v,...surfaceRules[k]))throw Error('Invalid surface modifier');
    return {...s,terrain:s.terrain??'dirt',surface};
  });
  if(segments[0].turn!==0||segments[0].tiles<8)throw Error('Course needs a straight starting grid');
  if(!input.closed&&segments.at(-1).turn!==0)throw Error('Rally needs a straight terminal exit');
  const length=segments.reduce((n,s)=>n+s.length,0),cp=input.checkpoints??[];
  if(!Array.isArray(cp)||(input.closed?cp.length!==0:cp.length!==3))throw Error('Rally requires three ordered intermediate checkpoints');
  let previous=0;const ids=new Set();
  for(const p of cp){if(!p||Object.keys(p).some(k=>!['id','distance'].includes(k))||!identifier(p.id)||ids.has(p.id)||!finite(p.distance,Number.EPSILON,length-Number.EPSILON)||p.distance<=previous||p.distance>=length)throw Error('Invalid checkpoint position');previous=p.distance;ids.add(p.id);}
  return {id:input.id,name:input.name,kind:input.kind,closed:input.closed,lanes:4,segments,checkpoints:structuredClone(cp),...(input.generation ? {generation:validateGenerationMetadata(input.generation)} : {})};
}
export function compileCourse(input,c){
  const definition=normalizeCourse(input);
  if(c.lanes!==definition.lanes)throw Error('Course lane count must match four racing lanes');
  let x=0,y=0,heading=0,start=0,distance=0;
  const segments=definition.segments.map(s=>{
    const angle=s.turn*Math.PI/180,radius=angle?s.length/Math.abs(angle):Infinity;
    if(angle&&radius<=(c.lanes-1)*c.laneWidth+1)throw Error('Corner radius cannot fit lane geometry');
    const end=advance(x,y,heading,s.length,angle);
    const result={...s,type:angle?'turn':'straight',direction:Math.sign(angle),radius:angle?radius:null,angle,start,startDistance:distance,x,y,heading,endX:end.x,endY:end.y};
    x=end.x;y=end.y;heading=end.heading;start+=s.tiles;distance+=s.length;return result;
  });
  if(definition.closed&&(Math.hypot(x,y)>1e-6||Math.min(mod(heading,Math.PI*2),Math.PI*2-mod(heading,Math.PI*2))>1e-7))throw Error('Closed circuit geometry does not connect');
  const checkpoints=definition.checkpoints.map(p=>{
    const s=segments.find(s=>p.distance<s.startDistance+s.length)??segments.at(-1);
    return {...p,q:s.start+(p.distance-s.startDistance)/s.length*s.tiles};
  });
  return {course:true,id:definition.id,name:definition.name,raceType:definition.kind,closed:definition.closed,segments,cells:start,lanes:c.lanes,offset:definition.closed?Math.floor(segments[0].tiles/2):0,length:distance,checkpoints};
}
function segmentAt(q,t){
  const position=t.closed?mod(q+t.offset,t.cells):q;
  const segment=position<0?t.segments[0]:position>=t.cells?t.segments.at(-1):t.segments.find(s=>position<s.start+s.tiles);
  return {segment,position};
}
export function courseLocation(q,lane,c,t){
  const {segment:s,position}=segmentAt(q,t);
  const extension=!t.closed&&(q<0||q>=t.cells);
  const radius=s.angle? s.radius-Math.sign(s.angle)*lane*c.laneWidth:Infinity;
  return {tile:Math.floor(position),segment:s.id,type:extension?'straight':s.type,direction:extension?0:s.direction,radius:extension?Infinity:radius,length:(extension||!s.angle?s.length:Math.abs(s.angle)*radius)/s.tiles,surface:s.surface,terrain:s.terrain};
}
export function coursePoint(q,lane,c,t){
  const {segment:s,position}=segmentAt(q,t),fraction=(position-s.start)/s.tiles;
  const p=advance(s.x,s.y,s.heading,s.length,s.angle,fraction),offset=lane*c.laneWidth;
  return {x:p.x-Math.sin(p.heading)*offset,y:p.y+Math.cos(p.heading)*offset};
}
// Known course information only. Dynamic hazards/rivals remain perception-filtered.
export function routePreview(q,lane,c,t){
  let next=null;for(let i=0;i<=8;i++){const at=Math.floor(q)+i;if(!t.closed&&at>=t.cells)break;const loc=courseLocation(at,lane,c,t);if(loc.type==='turn'){next={...loc,tilesAhead:i};break;}}
  return {current:courseLocation(q,lane,c,t),corner:next};
}
function segment(id,length,turn=0,terrain='dirt'){
  return {id,length,turn,terrain,tiles:Math.max(2,Math.ceil(length/8)),next:null};
}
function connect(segments,closed){segments.forEach((s,i)=>s.next=segments[i+1]?.id??(closed?segments[0].id:null));return segments;}
function circuit(id,name,vertices,radii){
  const corners=vertices.map((v,i)=>{
    const previous=vertices[(i+vertices.length-1)%vertices.length],next=vertices[(i+1)%vertices.length];
    const incoming=Math.atan2(v[1]-previous[1],v[0]-previous[0]),outgoing=Math.atan2(next[1]-v[1],next[0]-v[0]);
    const turn=mod(outgoing-incoming+Math.PI,2*Math.PI)-Math.PI;
    return {v,incoming,outgoing,turn,trim:radii[i]*Math.tan(Math.abs(turn)/2),r:radii[i]};
  });
  const segments=[];for(let i=0;i<corners.length;i++){
    const a=corners[i],b=corners[(i+1)%corners.length],length=Math.hypot(b.v[0]-a.v[0],b.v[1]-a.v[1])-a.trim-b.trim;
    segments.push(segment('straight-'+i,length,0,i%3===0?'stone':'dirt'));
    segments.push(segment('corner-'+((i+1)%corners.length),b.r*Math.abs(b.turn),b.turn*180/Math.PI,'dirt'));
  }
  return {id,name,kind:'Circuit',closed:true,lanes:4,segments:connect(segments,true),checkpoints:[]};
}
function rally(id,name,items){const segments=connect(items.map((x,i)=>segment('sector-'+i,...x)),false),length=segments.reduce((n,s)=>n+s.length,0);return {id,name,kind:'Rally',closed:false,lanes:4,segments,checkpoints:[.25,.5,.75].map((p,i)=>({id:'CP'+(i+1),distance:p*length}))};}
export const coursePresets=Object.freeze({
  'technical-circuit':circuit('technical-circuit','Technical Circuit',[[0,0],[240,0],[240,160],[160,160],[160,90],[80,90],[80,200],[0,200]],[20,22,20,18,18,18,20,22]),
  'fast-circuit':circuit('fast-circuit','Fast Circuit',[[0,0],[500,0],[500,300],[300,300],[300,180],[0,180]],[50,70,60,35,35,45]),
  'mixed-rally':rally('mixed-rally','Mixed-Terrain Rally',[[120,0,'dirt'],[55,75,'gravel'],[140,0,'stone'],[70,-90,'sand'],[110,0,'sand'],[50,90,'mud'],[80,0,'mud'],[65,-70,'gravel'],[150,0,'stone']]),
  'technical-rally':rally('technical-rally','Technical Rally',[[80,0,'dirt'],[32,90,'gravel'],[36,-100,'mud'],[55,0,'sand'],[40,110,'gravel'],[38,-100,'mud'],[60,0,'stone'],[38,95,'sand'],[40,-100,'gravel'],[95,0,'dirt']]),
});

// Reference-lane metres for progress/checkpoint presentation. Occupancy/ranking
// remain in shared longitudinal cells; actual travel is lane-specific.
export function courseDistance(q,t){
  if(t.closed)throw Error('Use lap progress on a closed course');
  const {segment:s}=segmentAt(q,t);
  return s.startDistance+(q-s.start)/s.tiles*s.length;
}

// Shared deterministic authoring helpers; no separate movement implementation.
export { circuit as makeCircuit, rally as makeRally };

function validateGenerationMetadata(g){
  if(!g||typeof g!=='object'||g.version!==1||!Number.isSafeInteger(g.seed)||!['short','medium','long'].includes(g.category)||typeof g.fallback!=='boolean'||!Number.isInteger(g.attempt)||g.attempt<0||g.attempt>32||!g.options||typeof g.options!=='object')throw Error('Invalid generation metadata');
  // Geometry, rather than rerunning generation, remains authoritative on import.
  return structuredClone(g);
}
