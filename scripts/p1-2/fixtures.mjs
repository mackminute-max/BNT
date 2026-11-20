import {raceSetup} from '../../src/prototype/session.js';
import {validateRU} from '../../src/model/ru.js';
export const specialties=['balanced','speed','endurance','handling','contact'];
export function specialize(base,kind){const ru=structuredClone(base);for(const part of [ru.driver,...ru.beasts,ru.chariot])for(const key of Object.keys(part))if(!['condition','strain','fatigue','wear','weight','capacity','personality'].includes(key))part[key]=55;
 const b=ru.beasts;if(kind==='speed')b.forEach(x=>{x.speed=65;x.endurance=35;x.power=60;});
 if(kind==='endurance')b.forEach(x=>{x.speed=49;x.endurance=80;x.power=51;});
 if(kind==='handling'){b.forEach(x=>{x.agility=70;x.speed=51;x.power=50;});ru.chariot.maneuverability=70;ru.chariot.protection=47;}
 if(kind==='contact'){ru.driver.combat=75;ru.chariot.protection=70;ru.chariot.stability=65;ru.chariot.weight=200;b.forEach(x=>{x.speed=51;x.agility=48;});}
 validateRU(ru);return ru;
}
export function fixture({course='oval',format='Pure',seed=17,fieldSize=4,weather='Clear',roster='specialists',pacing='endurance',laps=2}={}){
 const {setup}=raceSetup({course,format,seed,fieldSize,weather,pacing,laps});const types={};
 if(roster==='specialists')setup.entrants=setup.entrants.map((e,i)=>{const kind=specialties[(i+seed)%specialties.length];types[e.ru.id]=kind;return {...e,ru:specialize(e.ru,kind)};});else setup.entrants.forEach(e=>types[e.ru.id]='native-'+e.ru.id);
 return {setup,types};
}
export const matrix=()=>['oval','C01','rally-short','rally-long'].flatMap(course=>[17,145].flatMap(seed=>['Pure','Combat'].map(format=>({course,seed,format,fieldSize:seed===17?4:8,weather:seed===17?'Clear':'Extreme Heat'}))));
