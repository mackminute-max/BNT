import {freeze} from '../assets.js';
export const PRICES=freeze({driver:{Budget:200,Standard:400,Premium:800},beast:{Budget:150,Standard:325,Premium:650},chariot:{Budget:375,Standard:625,Premium:1150},specialist:{Budget:200,Standard:375,Premium:625},equipment:{Budget:100,Standard:275,Premium:425}});
export const COUNTS=freeze({driver:[2,2,1],beast:[2,3,1],chariot:[1,1,1],specialist:[1,1,1],equipment:[3,3,0]});
export const WAGES=freeze({driver:{Budget:20,Standard:35,Premium:60},specialist:{Budget:15,Standard:30,Premium:50}});
export const TERMS=freeze({short:{duration:3,surcharge:0,multiplier:1.25,termination:1},standard:{duration:8,surcharge:50,multiplier:1,termination:2},long:{duration:16,surcharge:125,multiplier:0.85,termination:3}});
export const UPGRADES=freeze({
 'staff-quarters':{name:'Staff Quarters',cost:300,capacity:'specialists',amount:2},
 'expanded-stables':{name:'Expanded Stables',cost:400,capacity:'beasts',amount:2},
 'driver-quarters':{name:'Driver Quarters',cost:350,capacity:'drivers',amount:1},
 'chariot-bay':{name:'Additional Chariot Bay',cost:450,capacity:'chariots',amount:1},
 workshop:{name:'Workshop',cost:500},'treatment-ward':{name:'Treatment Ward',cost:450},'training-grounds':{name:'Training Grounds',cost:600},
});
export const SERVICES=freeze({
 'driver-recovery':{registry:'personnel',field:'fatigue',cost:40},
 'driver-treatment':{registry:'personnel',field:'injury',cost:100,role:'Physician',ward:true},
 'beast-care':{registry:'beasts',field:'fatigue',cost:30,role:'Beast Handler'},
 'beast-treatment':{registry:'beasts',field:'injury',cost:80,role:'Beast Handler',ward:true},
 'chariot-repair':{registry:'chariots',field:'integrity',role:'Mechanic',workshop:true},
 'chariot-refurbishment':{registry:'chariots',field:'wear',cost:100,role:'Mechanic',workshop:true},
});
export const INJURIES3=freeze(['Healthy','Minor','Major','Critical']);
export const TIERS=freeze(['Budget','Standard','Premium']);
