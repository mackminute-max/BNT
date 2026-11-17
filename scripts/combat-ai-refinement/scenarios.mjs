import {defaultRU} from '../../src/model/ru.js';
import {profile} from '../dangerous-racing/scenarios.mjs';
export function tacticalScenario(kind='weapon',seed=17){
 const a=profile(defaultRU('A'),'aggressive'),b=profile(defaultRU('B'),'cautious');
 Object.assign(a.driver,{combat:90});a.equipment.combat=60;
 Object.assign(a.chariot,{protection:100,durability:100,stability:80});
 let speed=kind==='ram'?5:10,otherSpeed=kind==='ram'?18:10;
 if(kind==='unsafe-ram'){speed=5;otherSpeed=18;Object.assign(a.chariot,{protection:0,durability:0});}
 if(kind==='damaged'){speed=5;otherSpeed=18;a.chariot.condition=20;a.driver.condition=35;}
 if(kind==='race-on'){
  profile(a,'balanced');a.driver.combat=50;a.equipment.combat=0;
 }
 if(kind==='cautious')profile(a,'cautious');
 return {seed,format:'Combat',checkpointInterval:10000,entrants:[{ru:a,lane:0,q:-2.5,speed},{ru:b,lane:1,q:-2.5,speed:otherSpeed}]};
}
