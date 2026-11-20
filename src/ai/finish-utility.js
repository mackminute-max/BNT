// Optional, continuous utility from public own-race progress and remaining effort.
// No scripted phase, hidden opponent information, RNG draw or attribute bonus.
export function finishUtility(s,r,action,personality){
 const weight=s.autonomous.utility.finishUrgency??0;if(!weight)return 0;
 if(['Conserve Strength','Race Defensively','Hold Position'].includes(r.signs.active))return 0;
 const total=s.track.cells*(s.track.course&&!s.track.closed?1:s.config.laps);
 const progress=Math.max(0,Math.min(1,r.q/total));
 const fatigue=r.ru.beasts.reduce((sum,b)=>sum+b.fatigue,0)/r.ru.beasts.length/100;
 const intent={Push:1,Sprint:.8,Conserve:-.5}[action]??0;
 return weight*progress**4*(1-fatigue)*(.5+personality.opportunism/200)*intent;
}
