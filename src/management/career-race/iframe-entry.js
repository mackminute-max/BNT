import {paintCompactStandings} from '../../presentation/fullscreen/standings.js';
// App and layout are the accepted P2.2 modules. Only its data transport is adapted.
import '../../presentation/fullscreen/entry.js';
const $=id=>document.getElementById(id);
document.body.classList.add('career-viewer');
document.querySelector('header small').textContent='Championship race · Accepted P2.2 viewer · Durable Worker authority';
document.querySelector('header .badge').textContent='Career race · progress saved before acknowledgment';
const navigation=document.querySelector('.p21-navigation .hint');navigation.textContent='Saved championship race · Close/reopen restores committed progress; never restarts the race';
for(const id of ['prepare','restart','engine','course','format','weather','seed','value','build','personality','pacingPolicy','field','laps','customCoach','compare']){$(id).disabled=true;$(id).closest('section.panel')?.setAttribute('data-career-locked','true');}
// Make existing supported playback controls accessible without Developer Tools.
const controls=document.querySelector('.p21-race-controls');for(const id of ['step','speed','drain']){const e=$(id);controls.append(e.tagName==='SELECT'?e.closest('label'):e);}
$('restart').hidden=true;$('prepare').hidden=true;
const original=globalThis.P22.afterRender;globalThis.P22.afterRender=()=>{original();const session=globalThis.P1?.session,display=session?.display;if(display){paintCompactStandings($('standings'),$('compactStandings'),{entries:display.entries,playerId:session.state.playerId,tick:session.state.tick});$('p21DriverName').textContent=display.driverName;$('p21Team').textContent=display.stableName;$('p2Identity').textContent=display.stableName;}for(const id of ['prepare','restart','compare','engine'])$(id).disabled=true;const status=globalThis.P1?.session?.state?.status;if(['Ended','Stalled','Error'].includes(status))$('clearance').textContent='Native race resolved. Return to Championship and publish official results; no career effect is implied by this display.';};

const nativeOnFrame=globalThis.P2.onFrame;globalThis.P2.onFrame=s=>{nativeOnFrame(s);const d=globalThis.P1?.session?.display;if(d){$('p21DriverName').textContent=d.driverName;$('p21Team').textContent=d.stableName;$('p2Identity').textContent=d.stableName;}};
const updateFrame=globalThis.P2.onFrame;globalThis.P2.onFrame=s=>{updateFrame(s);const session=globalThis.P1?.session,c=[...(session?.commands?.values()??[])].at(-1);if(c){$('p2Ack').textContent=['sent','received'].includes(c.status)?'Instruction pending — not saved yet':c.status==='rejected'?'Instruction rejected by the native rules':'Instruction saved · '+c.status;}if(session?.phase==='buffering'||session?.phase==='initial-buffering')$('p22PlaybackState').textContent='Waiting for the next saved race frames…';};

const frameWithIdentity=globalThis.P2.onFrame;globalThis.P2.onFrame=s=>{frameWithIdentity(s);const d=globalThis.P1?.session?.display;if(!d)return;const inventory=$('p21Effects'),key=JSON.stringify(d.runRewards);if(inventory.dataset.inventory!==key){inventory.dataset.inventory=key;inventory.replaceChildren();const title=document.createElement('span');title.className='hint';title.textContent='Run inventory · placeholders, no bonuses';inventory.append(title);for(const name of d.runRewards??[]){const label=document.createElement('span');label.textContent=name;inventory.append(label);}}};
