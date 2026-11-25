import {D2_CONTENT as D,D2_PIN} from './content.generated.js';
import {d2Stream} from './generation.js';
import {weighted} from '../generation.js';
import {championshipCatalog,catalogDefinition} from '../../championships/e5/catalog.js';
import {freezeOffer,validateOffer} from '../../championships/offers.js';
import {fingerprint} from '../../cycles/contracts.js';
import {integerDraw} from '../../economy/market.js';
import {freeze} from '../../assets.js';
import {createRace} from '../../../sim/race.js';
import {generateRally} from '../../../track/rally-generator.js';
import {normalizeCourse,terrainProfiles} from '../../../track/course.js';
import {validateFootprint} from '../../../track/validation.js';
const records=D.competition,all=new Map(Object.values(records).flat().map(p=>[p.id,p]));
export const competitionProfile=id=>{const p=all.get(id);if(!p)throw Error('Unknown trusted competition profile '+id);return p;};
const choose=(next,rows)=>competitionProfile(weighted(next,rows));
function properName(next,profile,used){for(let n=0;n<profile.maxRetries;n++){const name=profile.roots[integerDraw(next,0,profile.roots.length-1)]+' '+profile.endings[integerDraw(next,0,profile.endings.length-1)];if(!used.has(name.toLowerCase())){used.add(name.toLowerCase());return name;}}throw Error('Competition naming exhausted; no generic fallback');}
export function resolveGeometry(profile,seed){let course;if(profile.resolver==='rally-generator-v1'){course=generateRally({...profile.rallyOptions,seed,laneWidth:profile.laneWidth});const category=profile.rallyOptions.category,fractions=({short:[1/2],medium:[1/3,2/3],long:[1/4,1/2,3/4]})[category],length=course.segments.reduce((n,s)=>n+s.length,0);course.signPointPolicy={version:1,category};course.checkpoints=fractions.map((f,i)=>({id:'SP'+(i+1),distance:length*f}));course=normalizeCourse(course);}else course=profile.nativeId;return course;}
export function resolveVenue(venue,context,{format='Pure',laps=1,grid='random',usedNames=new Set()}={}){
 const next=d2Stream(context,'venue'),geometry=choose(next,venue.geometryWeights),environment=competitionProfile(venue.environmentId),name=venue.properName??properName(next,competitionProfile(venue.namingProfileId),usedNames),seed=venue.seedPolicy==='pinned'?venue.pinnedSeed:integerDraw(next,0,2147483647);let course=resolveGeometry(geometry,seed),native=createRace({course,format,overrides:{laps}}),labels={};
 const matches=(a,s)=>a.selector==='all'||a.selector==='straights'&&s.type==='straight'||a.selector==='corners'&&s.type==='turn'||a.selector==='segment'&&a.segmentId===s.id;
 for(const selector of ['all','straights','corners','segment'])for(const a of environment.assignments.filter(a=>a.selector===selector))for(const s of native.track.segments)if(matches(a,s))labels[s.id]=a.terrain;
 // Always start from a fresh resolved definition; old normalized coefficients
 // must not override newly selected terrain. Oval uses native surface patches.
 if(native.track.course){course=structuredClone(native.setup.course);course.name=name;course.segments.forEach(s=>{if(labels[s.id]){s.terrain=labels[s.id];delete s.surface;}});native=createRace({course,format,overrides:{laps}});}
 const surfaces=Object.fromEntries(Object.entries(labels).map(([id,terrain])=>[id,{...terrainProfiles[terrain]}])),weather=(()=>{const id=weighted(next,environment.weatherWeights.map(r=>({id:r.weather,weight:r.weight})));return id;})(),result=createRace({seed,course,format,weather,surfaces,overrides:{laps}}),footprint=validateFootprint(result.track,result.config);if(!footprint.valid)throw Error('Resolved venue corridor invalid: '+footprint.message);
 return {schedule:{course,format,weather,laps,grid,surfaces},disclosure:{version:1,venueId:venue.permanence==='prestige'?venue.id:'m5-venue-'+fingerprint(context).slice(0,32),venueProfileId:venue.id,permanence:venue.permanence,venueName:name,nationId:venue.nationId,regionId:venue.regionId,geometryId:geometry.id,geometryKind:geometry.kind,environmentId:environment.id,presentationId:venue.presentationId,seed,surfaces:labels,weather,format,grid,laps,courseFingerprint:fingerprint(result.setup.course??result.config)}};
}
export function generatedDefinition(careerId,epoch,profileId,{usedNames=new Set()}={}){
 const profile=competitionProfile(profileId);if(profile.category!=='generated')throw Error('Unsupported generated competition category');const binding=competitionProfile(profile.tierBindingId),native=catalogDefinition(binding.nativeCatalogId),pattern=D.policy.scheduleResolution.patterns[binding.nativeCatalogId];if(binding.nativeCatalogId==='iron-gauntlet'||pattern.length!==binding.raceCount||profile.raceCount.min!==pattern.length||profile.raceCount.max!==pattern.length)throw Error('No approved generated economic schedule binding');
 const templateId='m5-opportunity-'+fingerprint([careerId,epoch,profileId,D2_PIN]).slice(0,40),name=properName(d2Stream([careerId,epoch,profileId],'championship-name'),competitionProfile(profile.namingProfileId),usedNames);let resolved=null;
 for(let attempt=0;attempt<profile.maxAttempts;attempt++){
  const next=d2Stream([careerId,epoch,profileId,attempt],'schedule'),events=[],counts=new Map();let failed=false;
  for(let i=0;i<pattern.length;i++){const p=pattern[i],candidates=profile.eventWeights.filter(row=>{const event=competitionProfile(row.id);return event.format===p.format&&event.grid===p.grid&&event.eligibleContexts.includes(binding.nativeCatalogId)&&event.venueWeights.some(v=>competitionProfile(competitionProfile(v.id).geometryWeights[0].id).kind===p.kind);});if(!candidates.length){failed=true;break;}const event=choose(next,candidates),venueRows=event.venueWeights.filter(v=>{const venue=competitionProfile(v.id);return (counts.get(venue.id)??0)<profile.venueRepeatLimit&&venue.supportedFormats.includes(p.format)&&venue.geometryWeights.some(g=>competitionProfile(g.id).kind===p.kind);});if(!venueRows.length){failed=true;break;}const venue=choose(next,venueRows);counts.set(venue.id,(counts.get(venue.id)??0)+1);const value=resolveVenue(venue,[careerId,epoch,profileId,attempt,i],{...p,usedNames});value.disclosure.eventId=event.id;value.disclosure.eventName=properName(next,competitionProfile(event.namingProfileId),usedNames);events.push(value);}
  if(failed||profile.geographicScope==='international'&&new Set(events.map(e=>e.disclosure.nationId)).size<2||events.filter(e=>e.disclosure.permanence==='prestige').length<profile.prestigeMin)continue;resolved=events;break;
 }
 if(!resolved)throw Error('Bounded generated schedule failed; no epoch or fee consumed');
 const base=native.offer.value,offer=freezeOffer({kind:base.kind,version:base.version,templateId,name,entryFee:base.entryFee,fieldSize:base.fieldSize,qualification:structuredClone(base.qualification),schedule:resolved.map(r=>r.schedule),points:[...base.points],dnfPoints:base.dnfPoints},{rulesVersion:'m5-competition-v1'}),terms={...structuredClone(native.terms),trophyId:null},d2={version:1,pin:D2_PIN,epoch,profileId,economicContextId:binding.nativeCatalogId,geographicScope:profile.geographicScope,events:resolved.map(r=>r.disclosure)};
 return freeze({id:templateId,catalogVersion:'m5-competition-v1.1-runtime-v1',category:'generated',offer,terms,d2,fingerprint:fingerprint({offer,terms,d2})});
}
const boardCache=new Map();
export function competitionBoard(careerId,epoch){const key=JSON.stringify([careerId,epoch,D2_PIN.digest]);if(boardCache.has(key))return boardCache.get(key);const next=d2Stream([careerId,epoch],'opportunities'),profiles=[...records.championship],usedNames=new Set(championshipCatalog().map(d=>d.offer.value.name.toLowerCase())),first=profiles.filter(p=>p.tierBindingId==='tier.dustroad'),selected=[first[integerDraw(next,0,first.length-1)]];while(selected.length<3){const p=profiles[integerDraw(next,0,profiles.length-1)];if(!selected.some(s=>s.id===p.id))selected.push(p);}const board=freeze([...championshipCatalog(),...selected.map(p=>generatedDefinition(careerId,epoch,p.id,{usedNames}))]);boardCache.set(key,board);if(boardCache.size>4)boardCache.delete(boardCache.keys().next().value);return board;}
export function trustedDefinition(state,id){const d=competitionBoard(state.career.id,state.m5.d2.opportunityEpoch).find(d=>d.id===id);if(!d||!state.e5.board.some(b=>b.fingerprint===d.fingerprint))throw Error('Unknown/stale trusted opportunity');validateOffer(d.offer);return d;}
