import {point} from '../track/oval.js';
import {hash} from '../core/determinism.js';
export const teamColor=id=>`hsl(${hash(id)%360} 75% 68%)`;
export function geometry(s){
 const {track:t,config:c}=s,open=t.course&&!t.closed,min=open?-6:0,max=t.cells+(open?c.exitTiles+2:0),samples=[];
 const sample=lane=>{const ps=[];for(let q=min;q<max;q+=.35)ps.push(point(q,lane,c,t));ps.push(point(max,lane,c,t));return ps;};
 const path=ps=>{const p=new Path2D();ps.forEach((v,i)=>i?p.lineTo(v.x,v.y):p.moveTo(v.x,v.y));return p;};
 const edges=[sample(-.5),sample(c.lanes-.5)];samples.push(...edges.flat());
 const road=path(edges[0]);for(const p of [...edges[1]].reverse())road.lineTo(p.x,p.y);road.closePath();
 const lanes=Array.from({length:c.lanes-1},(_,i)=>path(sample(i+.5)));
 const xs=samples.map(p=>p.x),ys=samples.map(p=>p.y);
 return {road,lanes,edges:edges.map(path),bounds:{minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)},samples:samples.length};
}
export function fit(bounds,width,height,pad=24){const scale=Math.min((width-pad*2)/Math.max(1,bounds.maxX-bounds.minX),(height-pad*2)/Math.max(1,bounds.maxY-bounds.minY));return {x:(bounds.minX+bounds.maxX)/2,y:(bounds.minY+bounds.maxY)/2,scale};}
export function cameraTarget(s){return s.entrants.find(r=>r.id===s.playerId&&r.status==='Racing')??s.entrants.filter(r=>r.status==='Racing').sort((a,b)=>b.q-a.q||a.id.localeCompare(b.id))[0]??s.entrants.find(r=>r.id===s.playerId)??s.entrants[0];}
function line(ctx,q,s,color,label,scale,labelSize=12){const a=point(q,-.5,s.config,s.track),b=point(q,s.config.lanes-.5,s.config,s.track);ctx.strokeStyle=color;ctx.lineWidth=2/scale;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();if(label){ctx.save();ctx.translate(b.x,b.y);ctx.scale(1/scale,1/scale);ctx.fillStyle=color;ctx.font=`bold ${labelSize}px sans-serif`;ctx.fillText(label,5,-4);ctx.restore();}}
export function drawCourse(canvas,s,g,{map=false,camera=null}={}){
 const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=map?'#09171d':'#101f29';ctx.fillRect(0,0,w,h);
 const v=map?fit(g.bounds,w,h):camera??{...point(cameraTarget(s).q,cameraTarget(s).lane,s.config,s.track),scale:3};
 ctx.translate(w/2,h/2);ctx.scale(v.scale,v.scale);ctx.translate(-v.x,-v.y);
 ctx.fillStyle='#3c3e42';ctx.fill(g.road);ctx.strokeStyle='#e1b964';ctx.lineWidth=(map?1:2)/v.scale;g.edges.forEach(p=>ctx.stroke(p));ctx.strokeStyle='#7a7971';ctx.lineWidth=1/v.scale;ctx.setLineDash([4,5]);g.lanes.forEach(p=>ctx.stroke(p));ctx.setLineDash([]);
 line(ctx,0,s,'#fff','START',v.scale,map?22:12);if(s.track.course&&!s.track.closed){line(ctx,s.track.cells,s,'#ffb591','FINISH',v.scale,map?22:12);for(const cp of s.track.checkpoints)line(ctx,cp.q,s,'#6df9cb',cp.id,v.scale,map?22:12);}
 for(const hazard of s.hazards){if(hazard.hidden)continue;const p=point(hazard.q,hazard.lane,s.config,s.track);ctx.fillStyle='#ffb643';ctx.fillRect(p.x-1.5,p.y-1.5,3,3);}
 for(const r of s.entrants){const p=point(r.q,r.lane,s.config,s.track),rsize=(map?7:8)/v.scale;ctx.fillStyle=r.id===s.playerId?'#fff':teamColor(r.id);ctx.strokeStyle=r.id===s.playerId?'#f4bd49':'#07131a';ctx.lineWidth=2/v.scale;ctx.beginPath();ctx.arc(p.x,p.y,rsize,0,Math.PI*2);ctx.fill();ctx.stroke();if(!map){ctx.save();ctx.translate(p.x,p.y);ctx.scale(1/v.scale,1/v.scale);ctx.font='bold 12px sans-serif';ctx.fillStyle=teamColor(r.id);ctx.fillText(r.id,11,-8);if(r.physical==='Wreck'){ctx.fillStyle='#fd766a';ctx.fillText('WRECK',11,7);}ctx.restore();}}
 // Heading cues use the same analytic geometry; no simulation changes.
 for(let q=1;q<s.track.cells;q+=Math.max(8,s.track.cells/10)){const a=point(q,1.5,s.config,s.track),b=point(q+.2,1.5,s.config,s.track),angle=Math.atan2(b.y-a.y,b.x-a.x);ctx.save();ctx.translate(a.x,a.y);ctx.rotate(angle);ctx.fillStyle='#c5c39a';ctx.beginPath();ctx.moveTo(3,0);ctx.lineTo(-2,-1.4);ctx.lineTo(-2,1.4);ctx.closePath();ctx.fill();ctx.restore();}
 ctx.setTransform(1,0,0,1,0,0);return v;
}
