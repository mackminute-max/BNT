import {validateD2,expectedHome,beforeD2,afterD2,renewD2} from './d2/lifecycle.js';
import {fixedPopulation,homeBatchD2} from './d2/generation.js';
import {visibleRegional} from './d2/markets.js';
import {mergeProtected} from '../economy/protected-registry.js';
import {completionOffer} from '../m4/progression.js';
import {homeBatch,rivalPopulation,generateIdentity,CONTENT_PIN} from './generation.js';
import {pageHistory,compactArchived} from './history.js';
// M5 current-state authority. This is a NEW save family, not a shortened schema-6 save.
// Native reducers remain the only source of gameplay effects. This module validates
// current invariants and a bounded transition tail instead of replaying from genesis.
import {exact,id} from '../legacy-state.js';
import {canonical} from '../../core/determinism.js';
import {fingerprint,gold} from '../cycles/contracts.js';
import {validateCareerGraphV4} from '../cycles/schema4.js';
import {validateStateV6,executeE5Candidate} from '../championships/e5/schema6.js';
import {championshipCatalog} from '../championships/e5/catalog.js';
import {defaultRU,validateRU} from '../../model/ru.js';
import {validateOffer} from '../championships/offers.js';
import {standings,titleCandidate,championshipClassification} from '../championships/scoring.js';
import {validateProtected,validateCommandV1,protectTransaction} from '../history.js';
import {validateEconomyCommand,protectEconomic} from '../economy/commands.js';
import {validateCycleCommand,protectCycle} from '../cycles/contracts.js';
import {validateControllerCommand,protectController} from '../championships/controller-contracts.js';
import {validateE5Command,protectE5} from '../championships/e5/contracts.js';
import {LEGACY_UPGRADES,RUN_REWARDS,M4_RULES} from '../m4/catalog.js';
export const M5_FAMILY='m5-current-v1',M5_TAIL_LIMIT=128,M5_ACK_LIMIT=64;
const equal=(a,b,message)=>{if(canonical(a)!==canonical(b))throw Error(message);};
const object=o=>{if(!o||typeof o!=='object'||Array.isArray(o))throw Error('Expected record map');return o;};
const text=t=>{if(typeof t!=='string'||!t.trim()||t.length>100)throw Error('Invalid identity label');};
const fields=['kind','schema','revision','profile','career','pendingRace','transactions','provenance','maintenanceRevision','management','history','migration','economy','cycles','championshipFoundation','e5','m5'];
const phases=['INTERMISSION_READY','RACE_START_PENDING','RACE_ACTIVE','NO_STARTERS_PENDING','RACE_CLEARANCE_BLOCKED','RECOVERY_REQUIRED','AI_CONTINUATION','SETTLEMENT_PENDING','COMPLETED_ARCHIVED'];
function plainCurrent(value,depth=0){if(depth>128)throw Error('Current data nesting limit');if(typeof value==='number'&&!Number.isFinite(value)||value===undefined)throw Error('Non-finite/undefined current data is unsupported; native session sentinels use their unchanged codec');if(value&&typeof value==='object'){if(![Object.prototype,null,Array.prototype].includes(Object.getPrototypeOf(value)))throw Error('Unsupported current data type');for(const [key,v]of Object.entries(value)){if(['__proto__','constructor','prototype'].includes(key))throw Error('Unsafe current key');plainCurrent(v,depth+1);}}}
export function validateCurrent(s){
 plainCurrent(s);
 exact(s,fields,'M5 current state');if(s.kind!=='BNT-career-state'||s.schema!==7||s.pendingRace!==null)throw Error('Incompatible M5 current family');
 const m=s.m5;exact(m,['family','checkpoint','baseRevision','finance','acks','historyPages','historyTail','lastArchive','marketEpoch','rivals','catalogPin','identities','initialization','firstRevision','marketReservations','marketConsumed',...(m.d2?['d2']:[])],'M5 authority');
 validateProtected(m.initialization);const init=JSON.parse(m.initialization.request);if(init.type!=='career.initialize'||init.profileId!==s.profile.id||init.careerId!==s.career.id||init.delta!==m.finance.opening)throw Error('Starting grant authority mismatch');gold(m.firstRevision);
 if(m.family!==M5_FAMILY)throw Error('Unsupported M5 rules');for(const n of [s.revision,s.maintenanceRevision,m.checkpoint,m.baseRevision,m.marketEpoch])gold(n);
 if(m.baseRevision>s.revision||!Array.isArray(s.transactions)||s.transactions.length>M5_TAIL_LIMIT||s.revision!==m.baseRevision+s.transactions.length)throw Error('Invalid absolute revision/tail');
 exact(s.profile,['id','name','legacy','developerEdited']);exact(s.career,['id','ownerProfileId','name','status','treasury','developerEdited']);
 id(s.profile.id);id(s.career.id);text(s.profile.name);text(s.career.name);gold(s.career.treasury);
 if(s.profile.id===s.career.id||s.career.ownerProfileId!==s.profile.id||!['Foundation','Failed'].includes(s.career.status))throw Error('Invalid current ownership/status');
 if(!Array.isArray(s.provenance)||s.provenance.length||s.profile.developerEdited||s.career.developerEdited)throw Error('M5 development adjustments require an explicit future provenance contract');
 exact(m.finance,['opening','credits','debits']);for(const v of Object.values(m.finance))gold(v);
 if(BigInt(m.finance.opening)+BigInt(m.finance.credits)-BigInt(m.finance.debits)!==BigInt(s.career.treasury))throw Error('Financial checkpoint conservation failed');
 if(!Array.isArray(m.acks)||m.acks.length>M5_ACK_LIMIT||new Set(m.acks.map(a=>a.id)).size!==m.acks.length)throw Error('Invalid acknowledgement cache');
 for(const a of m.acks){exact(a,['id','requestHash','revision','balanceAfter']);id(a.id);gold(a.revision);gold(a.balanceAfter);if(a.revision>s.revision||!/^[a-f0-9]{64}$/.test(a.requestHash))throw Error('Invalid acknowledgement authority');}
 if(!Array.isArray(m.historyPages)||new Set(m.historyPages).size!==m.historyPages.length||m.historyPages.some(k=>!/^bnt\.m5\.history\.[a-f0-9]{64}$/.test(k))||!Array.isArray(m.historyTail)||m.historyTail.length>128)throw Error('Invalid paged history');
 equal(m.catalogPin,CONTENT_PIN,'Catalog pin mismatch; no regeneration');object(m.identities);if(!Array.isArray(m.marketReservations)||m.marketReservations.some(n=>typeof n!=='string')||m.marketReservations.length>10000||!Array.isArray(m.marketConsumed)||new Set(m.marketConsumed).size!==m.marketConsumed.length)throw Error('Invalid market batch provenance');const expected=m.d2?expectedHome(s):homeBatch(s.career.id,m.marketEpoch,{recruiters:!!s.e5.m4.owned.recruiters,existingNames:m.marketReservations});if(m.marketConsumed.some(k=>!expected.offers[k]))throw Error('Foreign consumed market identity');const offers={...Object.fromEntries(Object.entries(expected.offers).filter(([k])=>!m.marketConsumed.includes(k))),...visibleRegional(m.d2?.regional)};equal(s.management.registries.marketOffers,offers,'Generated offer/economic template differs from its pinned batch');for(const [key,profile]of Object.entries(m.identities)){if(profile.version!==1||canonical(profile.pin)!==canonical(CONTENT_PIN))throw Error('Invalid generated identity pin/version');if(offers[key])equal(profile,expected.identities[key]??m.d2?.regional?.identities[key],'Offer identity differs from pinned generation');}object(m.rivals);for(const [tier,p]of Object.entries(m.rivals)){if(p.tier!==tier||canonical(p)!==canonical(m.d2?fixedPopulation(s.career.id,tier,{count:p.organizations.length,existingNames:p.reservations}):rivalPopulation(s.career.id,tier,{count:p.organizations.length})))throw Error('Persistent rival birth changed');}
 equal(s.history,{schema:1,commands:s.history.commands},'Invalid bounded history fields');
 if(s.history.commands.length!==s.transactions.length)throw Error('Protected tail count mismatch');
 for(let i=0;i<s.transactions.length;i++){
  const r=s.transactions[i],t=r.transaction,validate=validator(t),fact=facts(t,r.balanceAfter,r.result);
  validate(t);mergeProtected([fact]);if(t.profileId!==s.profile.id||t.careerId!==s.career.id||t.expectedRevision!==m.baseRevision+i||r.resultRevision!==m.baseRevision+i+1)throw Error('Journal ownership/continuity mismatch');
  gold(r.balanceAfter);equal(fact,s.history.commands[i],'Protected native receipt mismatch');
 }
 exact(s.economy,['schema','rulesVersion','migrationRequest','manifestDigest']);if(s.economy.schema!==1||s.economy.rulesVersion!=='m2c-economy-v1')throw Error('Unsupported current economy');validateCareerGraphV4(s);for(const p of Object.values(s.management.registries.personnel))if(p.personality!==null){const native=defaultRU('validate-owned-personality');native.driver.personality=p.personality;validateRU(native);}
 validateCycles(s);validateProgression(s);validateChampionships(s);validateD2(s);
 return s;
}
function validateCycles(s){
 const c=s.cycles;exact(c,['version','rulesVersion','migrationRequest','manifestDigest','number','streak','phase','obligations','creditors','contractArchive','statements']);
 if(c.version!==1||c.rulesVersion!=='m2d-cycles-v1'||c.phase!=='STABLE_PREPARATION')throw Error('Invalid current payroll rules');gold(c.number);gold(c.streak);
 for(const [key,o]of Object.entries(object(c.obligations))){
  exact(o,['kind','version','id','careerId','championshipId','cycle','creditor','contractId','original','paid','balance','payments']);
  if(key!==o.id||o.careerId!==s.career.id||o.kind!=='wage-obligation'||o.version!==1||o.cycle>c.number)throw Error('Invalid current wage obligation');
  id(o.id);id(o.contractId);id(o.championshipId);gold(o.cycle);
 }
 for(const [key,st]of Object.entries(object(c.statements))){if(key!==st.championshipId||st.kind!=='settlement-statement'||st.version!==1||st.cycle>c.number)throw Error('Invalid settlement statement identity');gold(st.treasuryBefore);gold(st.treasuryAfter);gold(st.income);gold(st.arrears);}
}
function validateProgression(s){
 const e=s.e5;if(e.version!==2||e.rulesVersion!==M4_RULES)throw Error('M5 requires accepted M4 progression');
 exact(e,['version','rulesVersion','m4','enabledBy','board','instances','terminalRegistry','archives','trophies']);
 if(!s.m5.d2)equal(e.board,championshipCatalog(),'Untrusted permanent competition catalog');
 const m=e.m4;exact(m,['version','rulesVersion','balance','lifetime','owned','loadout','receipts']);
 if(m.version!==1||m.rulesVersion!==M4_RULES)throw Error('Invalid M4 current rules');gold(m.balance);gold(m.lifetime);
 let earned=0,spent=0;const ids=new Set();for(const r of m.receipts){id(r.id);if(ids.has(r.id))throw Error('Duplicate M4 receipt');ids.add(r.id);if(!Number.isSafeInteger(r.amount))throw Error('Invalid LP receipt');if(r.kind==='completion'){const source=s.profile.legacy.records.find(o=>o.selectedBy===r.id);if(!source||source.definition.kind!=='lp'||source.definition.amount!==r.amount)throw Error('LP receipt lacks an earned completion selection');if(r.amount<0)throw Error('Invalid completion LP');earned+=r.amount;}else if(r.kind==='purchase'){const d=LEGACY_UPGRADES.find(d=>d.id===r.upgradeId);if(!d||r.amount!==-(d.id==='recruiters'?6:d.cost)||!m.owned[d.id])throw Error('Invalid upgrade purchase');spent-=r.amount;}else throw Error('Unknown LP effect');}
 if(m.balance!==earned-spent||m.lifetime!==earned)throw Error('LP conservation failed');
 for(const [key,r]of Object.entries(m.owned)){const d=LEGACY_UPGRADES.find(d=>d.id===key);if(!d||r.id!==key||r.paid!==(d.id==='recruiters'?6:d.cost)||!m.receipts.some(a=>a.id===r.selectedBy&&a.upgradeId===key))throw Error('Invalid upgrade ownership');}
 if(!Array.isArray(m.loadout)||m.loadout.length!==3||new Set(m.loadout.filter(Boolean)).size!==m.loadout.filter(Boolean).length||m.loadout.filter(Boolean).some(k=>!m.owned[k]||LEGACY_UPGRADES.find(d=>d.id===k)?.kind!=='active'))throw Error('Illegal Legacy loadout');
 exact(s.profile.legacy,['records','rewardVersion','loadoutSlots']);if(s.profile.legacy.rewardVersion!==1||s.profile.legacy.loadoutSlots!==3||new Set(s.profile.legacy.records.map(r=>r.id)).size!==s.profile.legacy.records.length)throw Error('Invalid permanent selection identities');
 for(const r of s.profile.legacy.records){const archive=e.archives.find(a=>a.instanceId===r.instanceId),x=s.championshipFoundation.instances[r.instanceId]??(archive?.summary?{id:r.instanceId,economicContextId:archive.economicContextId,playerId:archive.summary.playerId,standings:archive.standings,offer:{value:{templateId:archive.templateId}}}:null);if(!x)throw Error('Missing completion selection context');const offered=completionOffer(s,x,archive?.settlementId??e.instances[x.id]?.settlementId).choices.find(d=>d.id===r.rewardId);equal(r.definition,offered,'Completion selection differs from native formula');if(r.profileId!==s.profile.id||r.careerId!==s.career.id||!e.archives.some(a=>a.instanceId===r.instanceId&&a.legacySelection?.id===r.id))throw Error('Unbacked permanent selection');}
}
function validateChampionships(s){
 const f=s.championshipFoundation;exact(f,['version','rulesVersion','enabledBy','activeId','instances','offers','facts']);
 if(f.version!==3||f.rulesVersion!=='m2e-controller-e3-v1')throw Error('Invalid current championship authority');
 equal(f.offers,s.e5.board.map(d=>d.offer),'Competition board mismatch');
 gold(f.facts.reputation);if(new Set(f.facts.trophies).size!==f.facts.trophies.length)throw Error('Duplicate trophy fact');
 for(const n of Object.values(f.facts.victories))gold(n);
 let active=0;const results=new Set();
 for(const [key,x]of Object.entries(object(f.instances))){
  if(key!==x.id||!phases.includes(x.phase)||x.version!==1)throw Error('Invalid instance identity/phase');id(x.id);gold(x.revision);validateOffer(x.offer);
  if(!s.e5.board.some(d=>d.offer.fingerprint===x.offer.fingerprint))throw Error('Untrusted frozen offer');
  if(x.phase!=='COMPLETED_ARCHIVED'){active++;if(f.activeId!==key)throw Error('Active championship mismatch');}
  if(!s.e5.instances[key]||x.entrants.length!==x.offer.value.fieldSize||new Set(x.entrants.map(e=>e.id)).size!==x.entrants.length||x.entrants.filter(e=>e.player).length!==1||!x.entrants.some(e=>e.player&&e.id===x.playerId))throw Error('Invalid frozen entrant roster');
  for(const e of x.entrants){validateRU(e.native);if(e.native.id!==e.id)throw Error('Entrant native identity mismatch');}
  if(!Number.isInteger(x.raceIndex)||x.raceIndex<0||x.raceIndex>=x.offer.value.schedule.length||x.raceResults.length>x.offer.value.schedule.length)throw Error('Invalid schedule progress');
  for(let i=0;i<x.raceResults.length;i++){
   const r=x.raceResults[i];if(r.eventIndex!==i||results.has(r.resultId))throw Error('Duplicate/nonsequential official result');results.add(r.resultId);
   if(r.proofFingerprint!==fingerprint(r.proof)||r.proof.identity.instanceId!==key||r.proof.identity.profileId!==s.profile.id||r.proof.identity.careerId!==s.career.id||r.proof.identity.raceId!==r.raceId)throw Error('Official proof identity mismatch');
   if(r.kind==='NativeCleared')equal(r.rows,championshipClassification(r.proof),'Official classification mismatch');
   else if(r.kind!=='NoStarters'||r.rows.length||r.effects.length||r.mappings.length)throw Error('Unproven no-starter result');
  }
  equal(x.standings,x.raceResults.length?standings(x.entrants.map(e=>e.id),x.raceResults):x.entrants.map(e=>({id:e.id,points:0})),'Official standings mismatch');
  if(['SETTLEMENT_PENDING','COMPLETED_ARCHIVED'].includes(x.phase)){
   if(x.raceResults.length!==x.offer.value.schedule.length||!x.officialFinal)throw Error('Premature terminal championship');
   equal(x.officialFinal.standings,x.standings,'Final standings mismatch');
   if(x.officialFinal.championId!==titleCandidate(x.standings,x.raceResults.at(-1).rows))throw Error('Invalid title eligibility');
  }
  const meta=s.e5.instances[key];for(const offer of meta.runOffers)for(const choice of offer.choices){const native=RUN_REWARDS.find(r=>r.id===choice.id);if(!native)throw Error('Unknown Run Reward');for(const field of Object.keys(native))equal(choice[field],native[field],'Run Reward differs from native definition');equal(choice.preview.definition,native,'Run Reward preview mismatch');if(choice.quoteFingerprint!==fingerprint(choice.preview))throw Error('Run Reward quote mismatch');}const terminal=meta.settlementId?s.e5.terminalRegistry[meta.settlementId]:null;if(terminal?.legacyOffer)equal(terminal.legacyOffer,completionOffer(s,x,terminal.id),'Pending completion offer differs from native formula');if(new Set(meta.runSelections.map(r=>r.offerId)).size!==meta.runSelections.length||meta.runSelections.some(r=>!meta.runOffers.some(o=>o.id===r.offerId&&o.choices.some(c=>c.id===r.rewardId))))throw Error('Invalid Run selection');
  if(x.phase==='COMPLETED_ARCHIVED'&&!s.e5.archives.some(a=>a.instanceId===key&&s.e5.terminalRegistry[a.settlementId]?.settled))throw Error('Unsettled archived instance');
 }
 if(active>1||(active===0)!==(f.activeId===null))throw Error('Invalid active championship count');
}
function validator(t){return t.commandVersion===5?validateE5Command:t.commandVersion===4?validateControllerCommand:t.commandVersion===3?validateCycleCommand:t.commandVersion===2?validateEconomyCommand:validateCommandV1;}
function facts(t,b,r){return t.commandVersion===5?protectE5(t,b,r):t.commandVersion===4?protectController(t,b,r):t.commandVersion===3?protectCycle(t,b,r):t.commandVersion===2?protectEconomic(t,b,r):protectTransaction(t,b);}
export function prepareNewCurrent(s){
 validateStateV6(s);if(s.transactions.some(r=>!['controller.enable','controller.enableE3','e5.enableM4','career.initialize'].includes(r.transaction.type))||s.championshipFoundation.activeId||s.e5.archives.length)throw Error('Only unpublished newly initialized careers can enter M5; no save conversion');
 const n=structuredClone(s);n.schema=7;
 for(const key of ['economy','cycles','championshipFoundation','e5'])delete n[key].origin;
 n.transactions=[];n.history.commands=[];
 n.m5={family:M5_FAMILY,checkpoint:0,baseRevision:n.revision,finance:{opening:n.career.treasury,credits:0,debits:0},acks:[],historyPages:[],historyTail:[],lastArchive:null,marketEpoch:0,rivals:{},catalogPin:CONTENT_PIN,identities:{},initialization:structuredClone(s.history.commands.find(e=>JSON.parse(e.request).type==='career.initialize')),firstRevision:s.revision,marketReservations:[],marketConsumed:[]};
 const batch=homeBatch(n.career.id,0);n.management.registries.marketOffers=batch.offers;n.m5.identities=batch.identities;
 const used=Object.values(batch.offers).map(o=>o.name);for(const [kind,category]of [['personnel','driver'],['beasts','beast'],['chariots','chariot'],['equipment','equipment'],['specialists','specialist']])for(const asset of Object.values(n.management.registries[kind])){const identity=generateIdentity([n.career.id,'starting-identity',asset.id],{category,tier:asset.economics.tier,usedNames:used,nativeRole:asset.role});identity.sourceName=asset.name;identity.attributeSource='accepted-starting-package';identity.backgroundLabel='Starting package';identity.aiLabel=null;identity.attributes=structuredClone(asset.economics.baseAttributes);identity.personality=structuredClone(asset.personality??null);asset.name=identity.name;used.push(asset.name);n.m5.identities[asset.id]=identity;for(const contractId of asset.references.contract??[])n.management.registries.contracts[contractId].name=asset.name+' contract';}
 return validateCurrent(n);
}
export function transactCurrent(s,t,options={}){
 validateCurrent(s);t=structuredClone(t);if(t.id.startsWith('m5-op-')&&!t.id.startsWith('m5-op-'+t.expectedRevision+'-'))throw Error('Operation identity is not scoped to its source revision');if(!t.id.startsWith('m5-op-'))t.id='m5-op-'+t.expectedRevision+'-'+fingerprint([t.id,t.type,t.payload??null]).slice(0,32);validator(t)(t);
 const ack=s.m5.acks.find(a=>a.id===t.id);if(ack){if(ack.requestHash!==fingerprint(t))throw Error('Conflicting acknowledged operation');return {state:structuredClone(s),duplicate:true,acknowledgment:structuredClone(ack)};}
 if(t.profileId!==s.profile.id||t.careerId!==s.career.id||t.expectedRevision!==s.revision||t.expectedMaintenanceRevision!==s.maintenanceRevision)throw Error('STALE_OR_OBSOLETE: refresh current authority; operation not reapplied');
 if(['e5.enable','e5.enableM4','controller.enable','controller.enableE3','championship.register','championship.refreshOffers','cycle.settle','developer.treasury.adjust'].includes(t.type))throw Error('Operation is not supported by the new current-state boundary');
 if(t.type==='e5.register'&&new TextEncoder().encode(canonical(s)).length>2*1024*1024)throw Error('CHAMPIONSHIP_CAPACITY: insufficient 6 MiB reserved active record budget; no fee charged');
 if(t.type==='e5.register'&&!t.payload.instanceId.startsWith('m5-run-'+s.revision+'-'))throw Error('Registration instance must be scoped to its birth revision');
 beforeD2(s,t);let n=structuredClone(s);const before=n.career.treasury,result=executeE5Candidate(n,t,options);n.schema=7;
 if(t.type==='e5.register'&&!n.m5.d2){const active=n.championshipFoundation.instances[t.payload.instanceId],r=n.management.registries,p=active.entrants.find(e=>e.player);active.m5Identities={[p.id]:{organization:n.career.name,driver:r.personnel[p.assetIds.driver].name,beasts:p.assetIds.beasts.map(id=>r.beasts[id].name),chariot:r.chariots[p.assetIds.chariot].name}};const tier=t.payload.templateId==='iron-gauntlet'?'thunder-crown':t.payload.templateId;if(!n.m5.rivals[tier])n.m5.rivals[tier]=rivalPopulation(n.career.id,tier);}
 for(const offer of Object.values(s.management.registries.marketOffers)){if(n.management.registries.marketOffers[offer.id]?.available===false){const owned=Object.values(n.management.registries).flatMap(r=>Object.values(r)).find(a=>a.economics?.sourceOfferId===offer.id);if(!owned||!n.m5.identities[offer.id])throw Error('Acquired identity metadata missing');n.m5.identities[owned.id]=structuredClone(n.m5.identities[offer.id]);if(offer.category==='driver')owned.personality=structuredClone(n.m5.identities[owned.id].personality);if(n.m5.d2?.regional?.offers[offer.id])n.m5.d2.regional.consumed.push(offer.id);else n.m5.marketConsumed.push(offer.id);delete n.m5.identities[offer.id];delete n.management.registries.marketOffers[offer.id];}}
 if(t.type==='m4.buyLegacy'&&t.payload.upgradeId==='recruiters'){const extra=(n.m5.d2?homeBatchD2:homeBatch)(n.career.id,n.m5.marketEpoch,{recruiters:true,existingNames:n.m5.marketReservations}),key=Object.keys(extra.offers).find(k=>extra.identities[k].sourceOfferId.endsWith('-recruiters'));for(const k of Object.keys(n.management.registries.marketOffers))if(k.startsWith('m4-recruit-'))delete n.management.registries.marketOffers[k];n.management.registries.marketOffers[key]=extra.offers[key];n.m5.identities[key]=extra.identities[key];}
 const d2Effects=afterD2(n,s,t);
 const retired=[];for(const [key,identity]of Object.entries(n.m5.identities)){if(n.management.registries.marketOffers[key])continue;const current=Object.values(n.management.registries).find(r=>r[key]);if(!current){const prior=Object.values(s.management.registries).find(r=>r[key])?.[key];if(prior)retired.push({asset:structuredClone(prior),identity:structuredClone(identity)});delete n.m5.identities[key];}}
 const delta=n.career.treasury-before;n.m5.finance[delta>=0?'credits':'debits']+=Math.abs(delta);gold(n.m5.finance.credits);gold(n.m5.finance.debits);
 const receipt={transaction:structuredClone(t),resultRevision:s.revision+1,balanceAfter:n.career.treasury,...(result===undefined?{}:{result})};
 n.revision++;n.transactions.push(receipt);n.history.commands.push(facts(t,n.career.treasury,result));n.m5.acks.push({id:t.id,requestHash:fingerprint(t),revision:n.revision,balanceAfter:n.career.treasury});n.m5.acks=n.m5.acks.slice(-M5_ACK_LIMIT);
 if(n.transactions.length>M5_TAIL_LIMIT)throw Error('CHECKPOINT_REQUIRED: protected tail capacity; no change committed');
 const summary={kind:'operation',id:t.id,revision:n.revision,type:t.type,effectId:t.effectId,requestHash:fingerprint(t),balanceBefore:before,balanceAfter:n.career.treasury,result:structuredClone(result??null),retired,...(n.m5.d2?{retiredMarket:d2Effects.retiredMarket}:{})};
 const paged=pageHistory(n,[summary]);n=paged.state;const compact=compactArchived(n);n=compact.state;
 if(compact.archived){const x=s.championshipFoundation.instances[compact.instanceIds.at(-1)];if(x&&x.withdrawal?.kind!=='Voluntary'&&x.raceResults.some(r=>r.rows.some(row=>row.id===x.playerId&&row.started))){const epoch=n.m5.marketEpoch+1,reservations=[...Object.values(n.management.registries).flatMap(r=>Object.values(r).map(a=>a.name)),...(n.m5.d2?Object.values(n.m5.rivals).flatMap(p=>p.organizations.flatMap(p=>[p.organization.name,p.driver.name,...p.beasts.map(b=>b.name),p.chariot.name])):[])],batch=(n.m5.d2?homeBatchD2:homeBatch)(n.career.id,epoch,{recruiters:!!n.e5.m4.owned.recruiters,existingNames:reservations});n.m5.marketEpoch=epoch;n.m5.marketReservations=reservations;n.m5.marketConsumed=[];for(const key of Object.keys(n.management.registries.marketOffers))delete n.m5.identities[key];n.management.registries.marketOffers=batch.offers;Object.assign(n.m5.identities,batch.identities);if(n.m5.d2)renewD2(n);}}
 return {state:validateCurrent(n),receipt,duplicate:false,pageRecords:[...paged.records,...compact.records],retiredKeys:compact.retiredKeys,archived:compact.archived};
}
