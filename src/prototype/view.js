import {point,location} from '../track/oval.js';
import {hash} from '../core/determinism.js';
export const terrainPalette=Object.freeze({dirt:'#70533c',gravel:'#69635d',sand:'#9b8150',mud:'#445c48',stone:'#52616d'});
export function heading(s,r){const a=point(r.q,r.lane,s.config,s.track),b=point(r.q+.001,r.lane,s.config,s.track);return Math.atan2(b.y-a.y,b.x-a.x);}
export const teamColor=id=>`hsl(${hash(id)%360} 75% 68%)`;
export function geometry(s){
 const {track:t,config:c}=s,open=t.course&&!t.closed,min=open?-6:0,max=t.cells+(open?c.exitTiles+2:0),samples=[];
 const sample=lane=>{const ps=[];for(let q=min;q<max;q+=.35)ps.push(point(q,lane,c,t));ps.push(point(max,lane,c,t));return ps;};
 const path=ps=>{const p=new Path2D();ps.forEach((v,i)=>i?p.lineTo(v.x,v.y):p.moveTo(v.x,v.y));return p;};
 const edges=[sample(-.5),sample(c.lanes-.5)];samples.push(...edges.flat());
 const road=path(edges[0]);for(const p of [...edges[1]].reverse())road.lineTo(p.x,p.y);road.closePath();
 const cuts=[min,max];if(t.course)for(const segment of t.segments){let q=segment.start-(t.offset??0);if(t.closed)q=((q%t.cells)+t.cells)%t.cells;if(q>min&&q<max)cuts.push(q);}cuts.sort((a,b)=>a-b);
 const surfaces=[];for(let i=0;i<cuts.length-1;i++){const a=cuts[i],b=cuts[i+1];if(b<=a)continue;const loc=location((a+b)/2,0,c,t),terrain=t.segments.find(x=>x.id===loc.segment)?.terrain??'dirt',left=[],right=[];for(let q=a;q<b;q+=.35){left.push(point(q,-.5,c,t));right.push(point(q,c.lanes-.5,c,t));}left.push(point(b,-.5,c,t));right.push(point(b,c.lanes-.5,c,t));const ribbon=path(left);for(const v of right.reverse())ribbon.lineTo(v.x,v.y);ribbon.closePath();surfaces.push({terrain,path:ribbon});}
 const lanes=Array.from({length:c.lanes-1},(_,i)=>path(sample(i+.5)));
 const xs=samples.map(p=>p.x),ys=samples.map(p=>p.y);
 return {road,surfaces,lanes,edges:edges.map(path),bounds:{minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)},samples:samples.length};
}
export function fit(bounds,width,height,pad=24){const scale=Math.min((width-pad*2)/Math.max(1,bounds.maxX-bounds.minX),(height-pad*2)/Math.max(1,bounds.maxY-bounds.minY));return {x:(bounds.minX+bounds.maxX)/2,y:(bounds.minY+bounds.maxY)/2,scale};}
export function cameraTarget(s){return s.entrants.find(r=>r.id===s.playerId&&r.status==='Racing')??s.entrants.filter(r=>r.status==='Racing').sort((a,b)=>b.q-a.q||a.id.localeCompare(b.id))[0]??s.entrants.find(r=>r.id===s.playerId)??s.entrants[0];}
function line(ctx,q,s,color,label,scale,labelSize=12){const a=point(q,-.5,s.config,s.track),b=point(q,s.config.lanes-.5,s.config,s.track);ctx.strokeStyle=color;ctx.lineWidth=2/scale;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();if(label){ctx.save();ctx.translate(b.x,b.y);ctx.scale(1/scale,1/scale);ctx.fillStyle=color;ctx.font=`bold ${labelSize}px sans-serif`;ctx.fillText(label,5,-4);ctx.restore();}}
export function drawCourse(canvas,s,g,{map=false,camera=null}={}){
 const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=map?'#09171d':'#101f29';ctx.fillRect(0,0,w,h);
 const v=map?fit(g.bounds,w,h):camera??{...point(cameraTarget(s).q,cameraTarget(s).lane,s.config,s.track),scale:6};
 ctx.translate(w/2,h/2);ctx.scale(v.scale,v.scale);ctx.translate(-v.x,-v.y);
 ctx.fillStyle='#3c3e42';ctx.fill(g.road);for(const surface of g.surfaces){ctx.fillStyle=terrainPalette[surface.terrain]??terrainPalette.dirt;ctx.fill(surface.path);}ctx.strokeStyle='#e1b964';ctx.lineWidth=(map?1:2)/v.scale;g.edges.forEach(p=>ctx.stroke(p));ctx.strokeStyle='#7a7971';ctx.lineWidth=1/v.scale;ctx.setLineDash([4,5]);g.lanes.forEach(p=>ctx.stroke(p));ctx.setLineDash([]);
 line(ctx,0,s,'#fff','START',v.scale,map?22:12);if(s.track.course&&!s.track.closed){line(ctx,s.track.cells,s,'#ffb591','FINISH',v.scale,map?22:12);for(const cp of s.track.checkpoints)line(ctx,cp.q,s,'#6df9cb',cp.id,v.scale,map?22:12);}
 for(const hazard of s.hazards){if(hazard.hidden)continue;const p=point(hazard.q,hazard.lane,s.config,s.track);ctx.fillStyle='#ffb643';ctx.fillRect(p.x-1.5,p.y-1.5,3,3);}
 for(const r of s.entrants){const p=point(r.q,r.lane,s.config,s.track),color=r.id===s.playerId?'#fff':teamColor(r.id);ctx.fillStyle=color;ctx.strokeStyle=r.id===s.playerId?'#f4bd49':'#07131a';ctx.lineWidth=2/v.scale;
  if(map){ctx.beginPath();ctx.arc(p.x,p.y,7/v.scale,0,Math.PI*2);ctx.fill();ctx.stroke();continue;}
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(heading(s,r));
  // Purely visual top-down cart: wheels, body, shafts, paired pulling beasts.
  ctx.fillStyle='#09121b';ctx.fillRect(-2,-1.65,1.9,.5);ctx.fillRect(-2,1.15,1.9,.5);ctx.fillStyle=color;ctx.fillRect(-2.4,-1.05,2.6,2.1);ctx.strokeRect(-2.4,-1.05,2.6,2.1);
  ctx.strokeStyle='#d5c697';ctx.lineWidth=.18;ctx.beginPath();ctx.moveTo(0,-.7);ctx.lineTo(3.4,-.7);ctx.moveTo(0,.7);ctx.lineTo(3.4,.7);ctx.stroke();
  const team=r.ru.beasts.length;for(let i=0;i<team;i++){const row=Math.floor(i/2),side=team===1?0:(i%2?1:-1)*.65;ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(2.8+row*2.2,side,.9,.42,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e9d8ab';ctx.beginPath();ctx.arc(3.7+row*2.2,side,.28,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#18232b';ctx.beginPath();ctx.arc(-1.2,0,.42,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(1/v.scale,1/v.scale);ctx.font='bold 12px sans-serif';ctx.fillStyle=color;ctx.fillText(r.id,12,-15);if(r.physical==='Wreck'){ctx.fillStyle='#fd766a';ctx.fillText('WRECK',12,5);}ctx.restore();}
 // Heading cues use the same analytic geometry; no simulation changes.
 for(let q=1;q<s.track.cells;q+=Math.max(8,s.track.cells/10)){const a=point(q,1.5,s.config,s.track),b=point(q+.2,1.5,s.config,s.track),angle=Math.atan2(b.y-a.y,b.x-a.x);ctx.save();ctx.translate(a.x,a.y);ctx.rotate(angle);ctx.fillStyle='#c5c39a';ctx.beginPath();ctx.moveTo(3,0);ctx.lineTo(-2,-1.4);ctx.lineTo(-2,1.4);ctx.closePath();ctx.fill();ctx.restore();}
 ctx.setTransform(1,0,0,1,0,0);return v;
}
