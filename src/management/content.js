// Provisional Erf / Vaern identities: presentation metadata bound to REAL market
// slots and their acquired sourceOfferId. No ratings, prices, grants or RNG here.
export const CONTENT_VERSION='e5-a1-provisional-identities-v1';
const rows=[
 ['driver','budget',1,'Iona Reed','Human','A patient driver learning the racing trade.'],
 ['driver','budget',2,'Torren Flint','Dwarf','A practical driver looking for a stable berth.'],
 ['driver','standard',1,'Sael Willow','Elf','A composed racer seeking a dependable team.'],
 ['driver','standard',2,'Brakka Vale','Orc','A determined competitor ready for a new stable.'],
 ['driver','premium',1,'Mira Lark','Human','An experienced professional considering new offers.'],
 ['beast','budget',1,'Cinder',null,'A draft beast awaiting a racing team.'],
 ['beast','budget',2,'Pebble',null,'A sturdy individual with its own native strengths.'],
 ['beast','standard',1,'Copper',null,'An established draft beast offered for sale.'],
 ['beast','standard',2,'Juniper',null,'A racing beast awaiting its next pairing.'],
 ['beast','standard',3,'Slate',null,'A draft beast with a distinct native rating profile.'],
 ['beast','premium',1,'Comet',null,'A premium individual; inspect the actual condition before purchase.'],
 ['chariot','budget',1,'Wayfarer',null,'A budget racing chassis; existing condition and integrity apply.'],
 ['chariot','standard',1,'Copperline',null,'A standard racing chassis, with no unlisted class bonus.'],
 ['chariot','premium',1,'Nightglass',null,'A premium racing chassis; no invented equipment effects.'],
 ['specialist','budget',1,'Pella Moss','Human','A Beast Handler using the existing care qualifications.'],
 ['specialist','standard',1,'Dorrin Ash','Dwarf','A Mechanic using the existing workshop qualifications.'],
 ['specialist','premium',1,'Neris Fern','Elf','A Physician using the existing treatment qualifications.'],
 ['equipment','budget',1,'Plain Harness Kit',null,'Basic neutral equipment; mass and combat follow its actual record.'],
 ['equipment','budget',2,'Canvas Fittings',null,'Basic neutral fittings; no unlisted mechanical bonus.'],
 ['equipment','budget',3,'Spare Rigging',null,'Basic neutral equipment using existing detach and sale rules.'],
 ['equipment','standard',1,'Trimmed Harness Kit',null,'Standard neutral equipment; appearance does not add stats.'],
 ['equipment','standard',2,'Polished Fittings',null,'Standard neutral fittings, not a new equipment class.'],
 ['equipment','standard',3,'Bound Rigging',null,'Standard neutral equipment using the original acquisition path.'],
];
export const PROVISIONAL_CONTENT=Object.freeze(rows.map(([category,tier,ordinal,name,ancestry,bio])=>Object.freeze({id:`m2c-offer-${category}-${tier}-${ordinal}`,category,name,ancestry,bio,version:CONTENT_VERSION,provisional:true})));
const index=new Map(PROVISIONAL_CONTENT.map(x=>[x.id,x]));
export function identity(record){const source=record?.economics?.sourceOfferId??record?.id,meta=index.get(source);return {name:meta?.name??record?.name??'Unknown asset',ancestry:meta?.ancestry??null,bio:meta?.bio??'',provisional:!!meta,version:meta?.version??null,sourceOfferId:meta?.id??null};}
export function contentCounts(){return Object.fromEntries(['driver','beast','chariot','specialist','equipment'].map(k=>[k,PROVISIONAL_CONTENT.filter(x=>x.category===k).length]));}
export function attention(state){const r=state?.management?.registries;if(!r)return [];const list=[];for(const kind of ['personnel','beasts','chariots'])for(const a of Object.values(r[kind])){if(a.injury&&a.injury!=='Healthy')list.push({kind:'care',asset:a.id,text:`${identity(a).name}: ${a.injury} injury`});if(a.integrity!==undefined&&a.integrity<100)list.push({kind:'repair',asset:a.id,text:`${identity(a).name}: integrity ${a.integrity}/100`});if(a.available===false)list.push({kind:'unavailable',asset:a.id,text:`${identity(a).name} is unavailable`});if(a.xp>0)list.push({kind:'training',asset:a.id,text:`${identity(a).name}: ${a.xp} XP available`});}for(const c of Object.values(r.contracts)){if(c.lifecycle==='expired-pending-decision')list.push({kind:'contract',asset:c.references.employee[0],text:'An employment contract needs your decision'});}return list;}

export const phaseName=value=>({INTERMISSION_READY:'Between races',RACE_START_PENDING:'Preparing the current race',RACE_ACTIVE:'Race in progress',SETTLEMENT_PENDING:'Awaiting championship settlement',AI_CONTINUATION:'Opponents continue',RECOVERY_REQUIRED:'Save recovery required',RACE_CLEARANCE_BLOCKED:'Race validation blocked',NO_STARTERS_PENDING:'No eligible starters'})[value]??String(value??'No championship');
