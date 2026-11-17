import {makeCircuit} from './course.js';

export const ovalPresets=Object.freeze({
  'short-oval':{id:'short-oval',name:'Short Oval',overrides:{straightLength:90,innerRadius:24,straightTiles:12,turnTiles:16}},
  oval:{id:'oval',name:'Standard Oval',overrides:{straightLength:160,innerRadius:35,straightTiles:20,turnTiles:20}},
  'grand-oval':{id:'grand-oval',name:'Grand Oval',overrides:{straightLength:280,innerRadius:60,straightTiles:35,turnTiles:28}},
});
const authored=[
 ['C01','Broken Crown',[[0,0],[240,0],[240,160],[160,160],[160,90],[80,90],[80,200],[0,200]],[20,22,20,18,18,18,20,22],['stone','dirt']],
 ['C02',"Serpent's Coil",[[0,0],[520,0],[520,300],[400,300],[400,120],[310,120],[310,340],[210,340],[210,140],[110,140],[110,300],[0,300]],[28,30,28,25,24,24,28,24,24,24,28,30],['dirt','gravel','stone']],
 ['C03','Ironhook',[[0,0],[650,0],[650,70],[150,70],[150,340],[0,340]],[30,24,24,28,40,35],['stone','dirt']],
 ['C04','Blackstone Run',[[0,0],[340,0],[340,260],[240,260],[240,160],[160,160],[160,330],[80,330],[80,250],[0,250]],[24,28,26,24,24,24,24,22,22,26],['stone','gravel','stone','dirt']],
 ['C05',"Thunder's Bend",[[0,0],[500,0],[500,300],[300,300],[300,180],[0,180]],[50,70,60,35,35,45],['stone','dirt']],
 ['C06','Widowmaker',[[0,0],[360,0],[360,330],[280,330],[280,130],[190,130],[190,250],[100,250],[100,330],[0,330]],[24,26,22,22,24,24,22,22,22,26],['dirt','gravel','mud']],
 ['C07','Ashen Ring',[[0,0],[360,0],[460,130],[340,300],[220,250],[140,360],[-80,260],[-100,100]],[30,28,32,26,24,24,28,26],['dirt','sand','mud','gravel','stone']],
 ['C08',"King's Gauntlet",[[0,0],[650,0],[650,350],[500,350],[500,210],[380,210],[380,380],[220,380],[220,150],[100,150],[100,310],[0,310]],[35,48,40,28,24,28,32,28,24,24,28,30],['stone','gravel','dirt','stone','sand']],
 ['C09','Red Fang',[[0,0],[420,0],[520,180],[320,340],[280,200],[180,220],[100,340],[-80,250],[-80,100]],[26,30,28,24,24,22,24,24,24],['dirt','stone','gravel']],
 ['C10','The Labyrinth',[[0,0],[600,0],[600,420],[490,420],[490,140],[390,140],[390,340],[280,340],[280,180],[180,180],[180,460],[80,460],[80,300],[0,300]],[24,28,26,24,24,24,26,24,24,24,24,24,22,24],['dirt','gravel','stone','sand']],
 ['C11','Stormbreaker',[[0,0],[620,0],[620,320],[470,320],[470,140],[320,140],[320,410],[0,410]],[45,55,45,35,30,35,45,55],['stone','dirt','gravel']],
 ['C12',"Devil's Spine",[[0,0],[500,0],[560,140],[430,280],[360,170],[280,210],[220,360],[90,340],[110,180],[-50,180],[-70,80]],[24,26,24,22,20,20,24,20,20,22,20],['gravel','dirt','sand','stone']],
];
export const circuitCatalog=Object.freeze(Object.fromEntries(authored.map(([id,name,vertices,radii,terrains])=>{
  const scale={C02:.8,C08:.75,C10:.65,C11:.8}[id]??1;
  const definition=makeCircuit(id,name,vertices.map(([x,y])=>[x*scale,y*scale]),radii);
  definition.segments.forEach((segment,i)=>segment.terrain=terrains[i%terrains.length]);
  return [id,definition];
})));
export function resolveCatalog(course){return typeof course==='string'&&Object.hasOwn(circuitCatalog,course)?structuredClone(circuitCatalog[course]):course;}
export function trackChoices(kind){
 if(kind==='Oval')return Object.values(ovalPresets).map(x=>[x.id,x.name]);
 if(kind==='Circuit')return Object.values(circuitCatalog).map(x=>[x.id,x.name]);
 return [['generated-short','Short Rally'],['generated-medium','Medium Rally'],['generated-long','Long Rally']];
}
