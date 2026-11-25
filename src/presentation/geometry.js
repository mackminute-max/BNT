import {point,location} from '../track/oval.js';
import {terrainProfiles} from '../track/course.js';
export const terrainPalette=Object.freeze({dirt:'#71533b',gravel:'#66676b',sand:'#96805a',mud:'#435247',stone:'#52616b'});
export function tangent(s,r){const p=point(r.q,r.lane,s.config,s.track),a=point(r.q+.001,r.lane,s.config,s.track);let dx=a.x-p.x,dy=a.y-p.y;if(Math.hypot(dx,dy)<1e-9){const b=point(r.q-.001,r.lane,s.config,s.track);dx=p.x-b.x;dy=p.y-b.y;}return Math.atan2(dy,dx);}
export function sampleCourse(s){
 const {track:t,config:c}=s,open=t.course&&!t.closed,min=open?-6:0,max=t.cells+(open?(c.exitTiles??0)+2:0);
 const sample=(lane,a=min,b=max)=>{const p=[];for(let q=a;q<b;q+=.35)p.push(point(q,lane,c,t));p.push(point(b,lane,c,t));return p;};
 const edges=[sample(-.5),sample(c.lanes-.5)],pts=edges.flat(),cuts=[min,max];
 for(const seg of t.segments){let q=seg.start-(t.course?(t.offset??0):Math.floor(c.straightTiles/2));if(!open)q=((q%t.cells)+t.cells)%t.cells;if(q>min&&q<max)cuts.push(q);}cuts.sort((a,b)=>a-b);
 const surfaces=[];for(let i=0;i<cuts.length-1;i++){const a=cuts[i],b=cuts[i+1];if(b<=a)continue;const l=location((a+b)/2,0,c,t);surfaces.push({terrain:t.segments.find(x=>x.id===l.segment)?.terrain??Object.entries(terrainProfiles).find(([,p])=>Object.entries(p).every(([k,v])=>l.surface[k]===v))?.[0]??'dirt',points:[...sample(-.5,a,b),...sample(c.lanes-.5,a,b).reverse()]});}
 const bounds={minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity};for(const p of pts){bounds.minX=Math.min(bounds.minX,p.x);bounds.maxX=Math.max(bounds.maxX,p.x);bounds.minY=Math.min(bounds.minY,p.y);bounds.maxY=Math.max(bounds.maxY,p.y);}
 const arrows=[];for(let q=1;q<t.cells;q+=Math.max(8,t.cells/10)){const p=point(q,(c.lanes-1)/2,c,t),h=tangent(s,{q,lane:(c.lanes-1)/2});arrows.push({p,h});}
 return {road:[...edges[0],...edges[1].slice().reverse()],edges,lanes:Array.from({length:c.lanes-1},(_,i)=>sample(i+.5)),surfaces,bounds,arrows,samples:pts.length};
}
export function fit(bounds,width,height,pad=24){return {x:(bounds.minX+bounds.maxX)/2,y:(bounds.minY+bounds.maxY)/2,scale:Math.max(.0001,Math.min((width-2*pad)/Math.max(1,bounds.maxX-bounds.minX),(height-2*pad)/Math.max(1,bounds.maxY-bounds.minY)))};}
export function worldToScreen(p,c,width,height){return {x:width/2+(p.x-c.x)*c.scale,y:height/2+(p.y-c.y)*c.scale};}
export function screenToWorld(p,c,width,height){return {x:c.x+(p.x-width/2)/c.scale,y:c.y+(p.y-height/2)/c.scale};}
export function cameraTarget(s){return s.entrants.find(r=>r.id===s.playerId)??s.entrants.slice().sort((a,b)=>a.id.localeCompare(b.id))[0]??null;}
export function followCamera(s,old,{scale=8,clock=s.time,reducedMotion=false,lookAhead=10,maxLag=8}={}){const r=cameraTarget(s);if(!r)return {...fit(sampleCourse(s).bounds,1000,550),clock,target:null};const p=point(r.q,r.lane,s.config,s.track),h=tangent(s,r),target={x:p.x+Math.cos(h)*lookAhead,y:p.y+Math.sin(h)*lookAhead};if(!old||old.target!==r.id)return {...target,scale,clock,target:r.id};if(clock===old.clock&&scale===old.scale)return old;const dt=Math.max(0,Math.min(.25,clock-old.clock)),alpha=reducedMotion?1:1-Math.exp(-dt/.15);const x=old.x+(target.x-old.x)*alpha,y=old.y+(target.y-old.y)*alpha,lag=Math.hypot(x-target.x,y-target.y),factor=lag>maxLag?maxLag/lag:1;return {x:target.x+(x-target.x)*factor,y:target.y+(y-target.y)*factor,scale,clock,target:r.id};}
export function presentationSnapshot(s){return Object.freeze({...s,entrants:Object.freeze(s.entrants.map(r=>Object.freeze({...r,signs:Object.freeze({...r.signs}),ru:Object.freeze({...r.ru,equipment:Object.freeze({...r.ru.equipment}),driver:Object.freeze({...r.ru.driver}),beasts:Object.freeze(r.ru.beasts.map(b=>Object.freeze({...b}))),chariot:Object.freeze({...r.ru.chariot})})}))),hazards:Object.freeze((s.hazards??[]).map(h=>Object.freeze({...h})))});}
