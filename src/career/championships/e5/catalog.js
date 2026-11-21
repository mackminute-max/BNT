import {freezeOffer} from '../offers.js';import {freeze} from '../../assets.js';import {fingerprint} from '../../cycles/contracts.js';
// Explicit provisional playtest content, authorized by the E5-B handoff. Tables
// are frozen at registration; no future refresh rebalances an active instance.
export const CATALOG='e5b-provisional-catalog-v1';
const data=[
 ['dustroad','Dustroad Cup',0,25,4,['short-oval','oval'],[10,8,6,5],[25,15,10,5],[40,25,15,10],[150,100,70,40],25,10],
 ['ironwheel','Ironwheel Circuit',100,75,5,['short-oval','oval','grand-oval'],[12,9,7,5,4],[40,25,15,10,5],[60,40,25,15,10],[350,220,150,100,50],75,20],
 ['bannerfall','Bannerfall Series',300,175,6,['C01','C02','C03','C04'],[15,11,8,6,4,3],[60,40,25,15,10,5],[90,60,40,25,15,10],[750,500,350,220,140,70],150,35],
 ['crownfire','Crownfire Grand Prix',650,350,7,['mixed-rally','mixed-rally','mixed-rally','mixed-rally','mixed-rally'],[18,13,9,6,4,3,2],[90,60,40,25,15,10,5],[140,90,60,40,25,15,10],[1500,1000,650,450,300,180,90],300,60],
 ['thunder-crown','Thunder Crown',1100,750,8,['grand-oval','C01','mixed-rally','C03','oval','mixed-rally','C02'],[20,14,10,7,5,3,2,1],[150,100,70,45,30,20,10,5],[225,150,105,70,45,30,20,10],[3500,2300,1500,1000,650,400,250,125],750,100],
 ['iron-gauntlet','Iron Gauntlet',null,500,8,['grand-oval','C03','mixed-rally','mixed-rally'],[20,14,10,7,5,3,2,1],[150,100,70,45,30,20,10,5],[225,150,105,70,45,30,20,10],[2500,1600,1100,700,450,300,180,90],500,75],
];
let cached;
export function championshipCatalog(){return cached??=freeze(data.map(([id,name,rep,fee,field,courses,points,purse,finale,placement,titleGold,titleRep])=>{
 const offer=freezeOffer({kind:'BNT-championship-template',version:1,templateId:id,name,entryFee:fee,fieldSize:field,qualification:rep===null?{hasTrophy:'trophy-bannerfall'}:{reputationAtLeast:rep},schedule:courses.map((course,i)=>({course,format:i%2?'Combat':'Pure',weather:'Clear',laps:id==='iron-gauntlet'?2:1,grid:i===0?'random':'standings'})),points,dnfPoints:0});
 const terms={version:1,catalogVersion:CATALOG,provisional:true,purses:courses.map((_,i)=>[...(i===courses.length-1?finale:purse)]),dnfPurse:0,placement:[...placement],titleGold,titleRep,trophyId:'trophy-'+id,xp:{start:1,finish:1,podium:1,win:1},reputation:{start:10,finish:5,podium:10,win:15,placement:[20,15,10,5,0,0,0,0].slice(0,field)},bonuses:[],rulesVersion:'e5b-awards-v1'};
 return {id,catalogVersion:CATALOG,category:rep===null?'invitational':'standard',offer,terms,fingerprint:fingerprint({offer,terms})};
}));}
export function catalogDefinition(id){const d=championshipCatalog().find(d=>d.id===id);if(!d)throw Error('Unknown E5 championship template');return d;}
