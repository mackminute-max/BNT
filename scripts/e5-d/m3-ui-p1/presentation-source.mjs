export const playerPresentation=`(()=>{
const $=id=>document.getElementById(id),dev=$('developerView');if(!dev)return;
const tools=document.createElement('section');tools.className='panel';tools.id='m3p-race-diagnostics';const title=document.createElement('h2');title.textContent='Diagnostic playback controls';tools.append(title);for(const id of ['step','drain'])if($(id))tools.append($(id));dev.append(tools);
for(const p of document.querySelectorAll('.p21-race-controls .hint'))if(/buffered tail|stepping/i.test(p.textContent))tools.append(p);
const speed=$('speed')?.closest('label');if(speed)document.querySelector('.p21-race-controls').append(speed);
const small=document.querySelector('header small'),badge=document.querySelector('header .badge'),hint=document.querySelector('.p21-navigation .hint');if(small)small.textContent=document.body.classList.contains('career-viewer')?'Championship race':'Practice race';if(badge)badge.textContent='Blood and Thunder';if(hint)hint.textContent=document.body.classList.contains('career-viewer')?'Your career saves between races. Closing restarts an unfinished race.':'Practice progress is not saved.';
const labels=()=>{const n=$('p2Ack');if(n)n.textContent=n.textContent.replace(/Instruction saved/g,'Instruction accepted — unsaved race').replace(/native rules/g,'racing rules');const p=$('p22PlaybackState');if(p)p.textContent=p.textContent.replace('Waiting for the next saved race frames…','Buffering race playback…');const c=$('clearance');if(c)c.textContent=c.textContent.replace('Native race resolved.','Race resolved.');};
const before=globalThis.P22.afterRender;globalThis.P22.afterRender=()=>{before();labels();};const onFrame=globalThis.P2.onFrame;globalThis.P2.onFrame=s=>{onFrame(s);labels();};labels();
})();`;
