import assert from 'node:assert/strict';import{writeFile}from'node:fs/promises';
import{createRace,step,digest,capture,issueSign}from'../../../src/sim/race.js';
import{raceSetup}from'../../../src/prototype/session.js';
import{Commentary,narrative}from'../../../src/reporting/commentary.js';
import{createRadioDisplay}from'../../../src/presentation/content/m3-bc.js';
const rows=[];
for(const options of [{course:'short-oval',format:'Pure',fieldSize:2,seed:145,laps:1},{course:'C01',format:'Combat',fieldSize:4,seed:145,laps:1},{course:'rally-long',format:'Combat',fieldSize:8,seed:146,laps:1}]){
 const setup=raceSetup(options).setup,states=[createRace(setup),createRace(setup)],nativeLines=[];
 for(const [i,s]of states.entries()){
  const reporter=new Commentary(),display=createRadioDisplay();let cursor=0,lines=0;
  while(!['Ended','Stalled','Error'].includes(s.status)){
   if(s.tick>30000)throw Error('Fixture did not reach native terminal boundary');
   if(s.tick===0)issueSign(s,'queue','Hold Position');if(s.tick===120)issueSign(s,'queue','Conserve Strength');
   step(s);const events=s.events.slice(cursor);cursor=s.events.length;const n=reporter.lines.length;reporter.consumeBatch(events);const added=reporter.lines.slice(n);const rendered=display.accept(added,events,i?{radio:{version:1,enabled:true}}:null);assert.equal(rendered.length,added.length);assert.deepEqual(rendered.map(({text,...rest})=>rest),added.map(({text,...rest})=>rest));lines+=rendered.length;
  }
  nativeLines.push(structuredClone(reporter.lines));assert.equal(display.size,Math.min(160,lines));assert.deepEqual(narrative(s.events),reporter.lines);
 }
 assert.equal(digest(states[0]),digest(states[1]));assert.deepEqual(capture(states[0]),capture(states[1]));assert.deepEqual(nativeLines[0],nativeLines[1]);rows.push({...options,ticks:states[0].tick,status:states[0].status,events:states[0].events.length,checksumOff:digest(states[0]),checksumOn:digest(states[1]),nativeLines:nativeLines[0].length});console.log(JSON.stringify(rows.at(-1)));
}
await writeFile('/workspace/deliverables/e5d-m3-bc/evidence/continuation/display-parity.json',JSON.stringify({rows,result:'PASS'},null,2));
