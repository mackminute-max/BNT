import {createDenInterface} from './m6-den.js';
import {championshipBetting,bindChampionshipBetting} from './m6-betting.js';
import {practiceSetup} from '../career/m6/practice.js';
import {m6WorldPage,m6NationNavigation,m6MarketHeader,m6Records,bindM6World} from './m6-world.js';
import {isM4} from '../career/m4/progression.js';
import {legacyMarket,bindM4} from './m4.js';
import {UI_P1,contextQuote} from './headquarters/context-actions.js';
import {finances as playerFinances,services as playerServices,cleanPlayerCopy} from './headquarters/workflow.js';
import {M3UI,homeDashboard,barnDashboard,mountBarnControls,beastReplacement} from './headquarters/consolidated.js';
import {activeTeam} from './headquarters/active-team.js';
import {HQ_ENABLED,HQ_ROUTES,NAV_ORDER,HeadquartersRoutes,championshipName} from './headquarters/model.js';
import {confirmAction} from './startup/dialogs.js';
import {createCareerFlow,championshipStep} from './career-race/flow.js';
import {e5Records,bindE5} from './championship-e5.js';
import {identity,phaseName} from './content.js';
import {createDeveloperWorkspace} from './workspace.js';
import {rosterCards,recruitmentCards,improvements,capacitySummary} from './player-pages.js';
import {managementView} from './model.js';
const escape=value=>String(value??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const panel=(title,body)=>`<section class="hs-panel"><h2>${escape(title)}</h2>${body}</section>`;
const table=(headers,rows)=>rows.length?`<div class="hs-table"><table><thead><tr>${headers.map(h=>`<th>${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${escape(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<p>No records yet.</p>';
const button=(id,text,disabled=false)=>`<button id="hs-${id}" ${disabled?'disabled':''}>${escape(text)}</button>`;
const tabs=Object.fromEntries(Object.entries(HQ_ROUTES).filter(([key])=>key!=='saves').map(([key,name])=>[key,key==='finances'?'Finances':name]));
export function continuationNavigation(v,busy=false,durableView=null){
 const recovery=!v.active&&!!durableView?.hasAuthority&&!!durableView?.reason,visible=!!v.active||recovery;
 return {visible,disabled:busy||!visible,page:recovery?'saves':'championships',label:recovery?'Review saved-career recovery':visible?championshipStep(v.state,durableView).label:'No championship to continue'};
}
export function mountPlayableStable(port){
 const root=document.createElement('section');root.id='homeStable';document.body.prepend(root);
 let optionsSaveHost=null;const contextTerms={},contextParams={};let payAmount=null;let workspace;let page='overview',busy=false,notice='',error=false;
 root.innerHTML=`<header class="hs-header"><div><span class="hs-kicker">Blood and Thunder</span><h1>Home Stable</h1></div><div id="hs-resources"></div></header><nav id="hs-nav" aria-label="Stable navigation"></nav><p id="hs-feedback" role="status" aria-live="polite"></p><p id="hs-restriction" role="alert"></p><main id="hs-content"></main><section id="hs-practice" hidden><button id="hs-close-practice">Return to stable</button><p>Independent practice race · No career results or rewards. Close practice to discard it.</p><div id="hs-practice-frame"></div></section><footer class="a1-footer"><p>Blood and Thunder · Provisional playable stable</p><button id="hs-developer-bottom">Developer Tools</button></footer>`;
 const $=id=>document.getElementById('hs-'+id);
 const routes=new HeadquartersRoutes(),careerKey=()=>port.store.state?.career.id??'no-career';let skipOptionsPop=false;
 function rememberRoute(){if(HQ_ENABLED)routes.remember(window.scrollY,document.activeElement?.closest?.('#hs-content')?document.activeElement.id||routes.position().focus:routes.position().focus);}
 if(HQ_ENABLED)root.addEventListener('focusin',e=>{if(e.target.closest?.('#hs-content')&&e.target.id)routes.remember(window.scrollY,e.target.id);});
 function markHistory(push=false){if(!HQ_ENABLED)return;const {m1Options,...old}=history.state??{};const record={...old,hqRoute:page,hqCareer:careerKey(),hqIndex:push?(old.hqCareer===careerKey()?(old.hqIndex??0):0)+1:old.hqCareer===careerKey()?(old.hqIndex??0):0};history[push?'pushState':'replaceState'](record,'');}
 async function navigate(key,{record=true,restore=false,external=false}={}){if(UI_P1&&key==='saves'){await globalThis.BNT_M1?.openOptions('saves');return true;}if(!Object.hasOwn(tabs,key)||busy)return false;if(HQ_ENABLED&&$('practice-frame').children.length&&!$('practice').hidden){if(!await confirmAction('Leave this independent practice race? Its unsaved practice progress will be discarded; your career is unchanged.')){if(!record)markHistory(true);return false;}}
  if(key!=='gambling')denFlow?.stop();const changed=key!==page;if(HQ_ENABLED&&changed){rememberRoute();routes.select(key);}page=key;show();if(HQ_ENABLED){if(history.state?.m1Options&&external)skipOptionsPop=true;else if(changed)markHistory(record);requestAnimationFrame(()=>{const pos=restore?routes.position():{scroll:0,focus:null},target=pos.focus&&document.getElementById(pos.focus);const focus=target&&!target.disabled?target:$('page-title')??$('content').querySelector('h2')??$('content');focus.tabIndex=focus.tabIndex<0?-1:focus.tabIndex;focus.focus({preventScroll:true});window.scrollTo(0,pos.scroll);});}return true;}
 function goBack(){if(busy)return;if(HQ_ENABLED&&(history.state?.hqIndex??0)>0)history.back();else navigate('overview',{record:false});}
 if(HQ_ENABLED){markHistory();addEventListener('popstate',e=>{if(document.querySelector('#m1-options[open]'))return;if(skipOptionsPop){skipOptionsPop=false;markHistory();return;}if(e.state?.hqCareer!==careerKey())return;if(busy||port.pending){markHistory(true);notice='Wait for the current protected operation before leaving this page.';render();return;}if(e.state.hqRoute!==page)navigate(e.state.hqRoute,{record:false,restore:true});});root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&!document.querySelector('dialog[open]')&&page!=='overview'){e.preventDefault();goBack();}});}

 const careerFlow=globalThis.__BNT_E5_C__?createCareerFlow(port,{run,render,navigate}):null;const denFlow=createDenInterface(port,{run,render,navigate});
 $('nav').innerHTML=[...NAV_ORDER.filter(k=>k==='practice'||tabs[k]),...Object.keys(tabs).filter(k=>!NAV_ORDER.includes(k))].map(key=>key==='practice'?`<button id="hs-practice-button">Practice Track</button>`:`<button data-page="${key}">${escape(tabs[key])}</button>`).join('');
 if(careerFlow){const b=document.createElement('button');b.id='hs-continue-championship';b.textContent='Continue Series';b.hidden=true;b.disabled=true;b.setAttribute('aria-hidden','true');b.setAttribute('aria-disabled','true');b.onclick=()=>{const next=continuationNavigation(view(),busy,port.durableView);if(next.visible&&!next.disabled)navigate(next.page);};$('nav').append(b);}
 for(const b of $('nav').querySelectorAll('[data-page]'))b.onclick=()=>navigate(b.dataset.page);
 function show(){document.getElementById('legacyWorkbench').style.display='none';$('content').hidden=false;$('practice').hidden=true;$('practice-frame').replaceChildren();render();}
 $('practice-button').onclick=()=>{if(busy)return;let ownedPractice=null;if(port.store.state?.schema===8){try{const s=port.store.state,a=Object.values(s.management.registries.assignments)[0];if(!a)throw Error('Set up a turnout in the Barn first');const team=activeTeam(s,port.durableView?.presentation??port.store.presentation);ownedPractice=practiceSetup(s,{assignmentId:a.id,driverId:team.driverId,beastIds:team.beastIds,chariotId:team.chariotId});}catch(e){notice=e.message;error=true;render();return;}}document.getElementById('legacyWorkbench').style.display='none';$('content').hidden=true;$('practice').hidden=false;const iframe=document.createElement('iframe');iframe.title='Accepted P2.2 independent practice race';iframe.srcdoc=(globalThis.__BNT_M3BC_PRACTICE_HTML__??globalThis.__BNT_ACCEPTED_P22_HTML__).replace('<!-- M3BC PRESENTATION -->','<script>globalThis.__BNT_CAREER_PRESENTATION__='+JSON.stringify(port.durableView?.presentation??port.store.presentation??null)+';globalThis.__BNT_PRACTICE_SETUP__='+JSON.stringify(ownedPractice)+';<\/script>');iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-downloads');$('practice-frame').replaceChildren(iframe);};
 $('close-practice').onclick=show;
 function view(){return {contextPage:page,contextTerms,contextParams,payAmount,...managementView(port.store.state,{mode:port.store.mode,requiresCheckpoint:port.store.requiresCheckpoint,reason:(port.durable||port.durableView?.hasAuthority)?port.durableView?.reason??'':['blocked','recovery-required'].includes(port.store.mode)?port.store.problem:''}),presentation:port.durableView?.presentation??port.store.presentation??null};}
 async function run(operation,message){
  if(busy)return;const focusBefore=document.activeElement?.id;busy=true;notice='Waiting for authoritative confirmation…';error=false;render();
  try{const result=await operation();if(result===false){notice='Cancelled. Nothing changed.';}else notice=message+(port.store.mode==='manual'?' Manual mode: change is in memory only. Export and explicitly confirm your checkpoint.':'');}
  catch(e){error=true;notice=e.message.replaceAll('schema','save format').replaceAll('revision','save version').replaceAll('STALE_WRITER','Save changed in another window').replaceAll('RECOVERY_REQUIRED','Save recovery needed');}
  finally{busy=false;render();if(HQ_ENABLED&&!document.body.classList.contains('career-race-open'))requestAnimationFrame(()=>{const target=focusBefore&&document.getElementById(focusBefore);if(target&&!target.disabled)target.focus({preventScroll:true});else{$('feedback').tabIndex=-1;$('feedback').focus({preventScroll:true});}});}
 }
 function bind(id,handler){const el=$(id);if(el)el.onclick=handler;}

 function saveBody(v){return panel('Save recovery',`<p>${escape(port.durableView?.reason||'Career decisions save automatically. Use recovery only if a saved career needs attention.')}</p>${button('reopen','Recheck saved career')}${button('recover-previous','Recover previous checkpoint',!port.store.recoveryPending)}${button('raw-save','Export damaged save for diagnostics',!port.store.quarantine)}${button('acknowledge','Confirm manual checkpoint',!port.store.requiresCheckpoint)}${button('race-repair','Repair from verified race journal')}${button('race-retry','Retry race recovery')}${port.durableView?.restoreStage?.state==='PREPARED'?button('restore-resume','Resume confirmed restoration'):''}`);}

 function render(){
  const v=view(),s=v.state,r=v.registries,locked=v.blocked||busy;
  $('resources').textContent=s?`${s.career.name} · ${s.career.treasury} Gold · ${s.career.status}${s.career.developerEdited?' · Developer-edited':''}`:'Create or load a career';
  $('feedback').textContent=M3UI&&!error&&!notice.startsWith('Save Game')&&!(UI_P1&&notice.startsWith('Completed:'))?'':notice;$('feedback').dataset.error=error;
  $('restriction').textContent=(UI_P1&&v.active?'':v.restriction)|| (busy?'Operation pending. Changes are not acknowledged yet.':'');
 for(const b of $('nav').querySelectorAll('button')){b.disabled=busy;b.setAttribute('aria-current',String(b.dataset.page===page));}
  if(careerFlow){const b=$('continue-championship'),next=continuationNavigation(v,busy,port.durableView);b.hidden=!next.visible;b.disabled=next.disabled;b.title=next.label;b.setAttribute('aria-label','Continue Championship: '+next.label);b.setAttribute('aria-hidden',String(!next.visible));b.setAttribute('aria-disabled',String(next.disabled));b.setAttribute('aria-current',String(next.visible&&page===next.page));}
  root.setAttribute('aria-busy',String(busy));
  let body='';
  if(page==='overview')body=homeDashboard(v);if(page==='gambling'&&s?.schema===8)body=denFlow.html(s);
  if(page==='roster')body=barnDashboard(v);
  if(page==='markets')body=panel('Market',recruitmentCards(v,['driver','beast','chariot','specialist','equipment']))+panel('Capacity',capacitySummary(v));
  if(page==='championships'&&careerFlow)body=(s.schema===8&&!s.championshipFoundation.activeId&&typeof BNT_M3UI_BUILD==='undefined'?m6NationNavigation(s):'')+(()=>{const f=careerFlow.html(v),w=s.schema===8?championshipBetting(s):'';return f.includes('<!--bt-wager-->')?f.replace('<!--bt-wager-->',()=>w):f+w;})();if(page==='world'&&s.schema===8)body=m6WorldPage(s);
  if(page==='records')body=panel('Career records',table(['Championship','Outcome','Official events'],Object.values(s?.championshipFoundation?.instances??{}).map(x=>[x.offer.value.name,x.withdrawal?'Player '+x.withdrawal.kind.toLowerCase()+' withdrawal':phaseName(x.phase),x.raceResults.length])))+panel('Settlement history',table(['Championship','Cycle','Income','Closing treasury'],Object.values(s?.cycles?.statements??{}).map(x=>[championshipName(s,x.championshipId),x.cycle,x.income,x.treasuryAfter])))+e5Records(s);
  if(UI_P1&&page==='facilities')body=panel('Staff & Contracts',rosterCards(v,['personnel','specialists']))+contractTable(v);
  if(UI_P1&&page==='workshop')body=panel('Facilities',improvements(v))+panel('Workshop',rosterCards(v,['chariots','equipment']));
  if(UI_P1&&page==='services')body=playerServices(v);
  if(UI_P1&&page==='finances')body=playerFinances(v);
  if(UI_P1&&page==='markets'){body+=panel('Owned assets for sale',rosterCards(v,['beasts','chariots','equipment']));if(isM4(s))body='<div role="group" aria-label="Market categories"><button data-m4-category="ordinary">Recruits & Equipment</button><button data-m4-category="legacy">Legacy Upgrades</button></div><div id="m4-ordinary-market">'+body+'</div><div id="m4-legacy-market">'+legacyMarket(s)+'</div>';}
  if(s?.schema===8){if(page==='records')body=m6Records(s,Number(root.dataset.m6RecordPage??0));if(page==='markets')body=m6MarketHeader(s)+body;}$('content').innerHTML=body;if(s?.schema===8){bindM6World($('content'),s,port,run);bindChampionshipBetting($('content'),s,port,run);if(page==='gambling')denFlow.bind($('content'),s);for(const b of $('content').querySelectorAll('[data-m6-record-page]'))b.onclick=()=>{root.dataset.m6RecordPage=b.dataset.m6RecordPage;render();};}if(isM4(s)){bindM4($('content'),s,port,run,navigate);const show=kind=>{globalThis.__BNT_M4_MARKET__=kind;const ordinary=document.getElementById('m4-ordinary-market'),legacy=document.getElementById('m4-legacy-market');if(ordinary)ordinary.hidden=kind==='legacy';if(legacy)legacy.hidden=kind!=='legacy';};for(const b of $('content').querySelectorAll('[data-m4-category]'))b.onclick=()=>show(b.dataset.m4Category);show(globalThis.__BNT_M4_MARKET__??'ordinary');}
  if(UI_P1){cleanPlayerCopy($('content'));if(optionsSaveHost?.isConnected)optionsSaveHost.innerHTML=saveBody(v);}

  if(M3UI&&page==='roster'&&s?.management?.initialized)mountBarnControls($('content'),v,async(kind,key)=>{let slot=null;const team=activeTeam(port.store.state,v.presentation);if(kind==='beasts'&&!team.beastIds.includes(key)&&team.beastIds.every(Boolean)){slot=await beastReplacement();if(slot===null)return;}run(async()=>{const state=port.store.state,request={kind,assetId:key,slot,id:port.newId('active-team'),expectedRevision:state.revision,expectedMaintenanceRevision:state.maintenanceRevision,expectedPresentationRevision:(port.durableView?.presentation??port.store.presentation)?.revision??0};if(port.durable)return port.game('activeTeam',request);return port.perform(store=>store.setActiveTeam(request));},'Turnout selection saved.');});
  bind('recover-previous',()=>run(()=>port.invoke('careerRecover'),'Recovery checked.'));bind('raw-save',()=>run(()=>port.invoke('careerRawExport'),'Diagnostic download requested.'));bind('race-repair',()=>run(()=>port.game('repair'),'Verified repair checked.'));bind('race-retry',()=>run(()=>port.game('retry'),'Recovery retried.'));bind('restore-resume',()=>run(async()=>{if(await confirmAction('Resume the previously confirmed complete backup restoration?'))await port.game('resumeRestore');},'Restoration checked.'));
  bind('go-race',()=>navigate('championships'));bind('den',()=>navigate('gambling'));
  bindE5({s,port,bind,run});
  if(careerFlow)careerFlow.bind({v,bind});

  for(const key of ['roster','saves','championships','finances'])bind('to-'+key,()=>navigate(key));
  bind('reopen',()=>run(async()=>{await port.invoke('e4Reload');if(port.durableView?.hasAuthority&&port.durableView.reason)throw Error(port.durableView.reason);},'Saved career checked.'));
  for(const [id,target]of [['export','careerExport'],['complete','e4Backup']])bind(id,()=>run(()=>port.invoke(target),'Download requested. External disk durability cannot be verified.'));
  bind('acknowledge',()=>run(()=>port.invoke('careerAcknowledge'),'Manual checkpoint confirmation recorded.'));bind('preparation',()=>{$('event-detail').open=true;$('event-detail').scrollIntoView({block:'nearest'});});
  if(UI_P1){for(const el of $('content').querySelectorAll('[data-market-term]'))el.onchange=()=>{contextTerms[el.dataset.marketTerm]=el.value;render();};for(const el of $('content').querySelectorAll('[data-work-param]'))el.onchange=()=>{const id=el.dataset.workParam;contextParams[id]={...contextParams[id],[el.dataset.field]:el.dataset.field==='attribute'?el.value:el.dataset.field==='resolve'?el.checked:Number(el.value)};render();};if($('pay-amount'))$('pay-amount').onchange=()=>{payAmount=Number($('pay-amount').value);render();};}
  for(const el of $('content').querySelectorAll('[data-context-type]'))el.onclick=()=>{const type=el.dataset.contextType,payload=JSON.parse(el.dataset.contextPayload),signature=el.dataset.contextSignature,label=el.textContent;return run(async()=>{const preview=contextQuote(port.store.state,type,payload,port.newId('context'),port.durableView?.presentation??port.store.presentation);if(!preview.quote.canAfford)throw Error('Insufficient Gold or XP.');if(!await confirmAction((signature!==preview.signature?'The terms have changed. Review the updated terms before confirming.\n':'')+label+'?\n'+preview.lines.join('\n')))return false;try{return await port.perform(store=>store.transaction(preview.command));}catch(e){if(/stale|changed in another|source/i.test(e.message))throw Error('Terms changed before confirmation. Review the updated card and confirm again.');throw e;}},'Completed: '+label+'.');
  };
  if(busy){for(const el of $('content').querySelectorAll('button,input,select'))el.disabled=true;if(UI_P1&&optionsSaveHost?.isConnected)for(const el of optionsSaveHost.querySelectorAll('button,input,select'))el.disabled=true;}
 }
 function contractTable(v){const r=v.registries??{};return table(['Employee','Term','State','Cycles remaining','Wage'],Object.values(r.contracts??{}).map(c=>[identity(r.personnel?.[c.references.employee[0]]??r.specialists?.[c.references.employee[0]]).name,c.term,c.lifecycle,c.cyclesRemaining,c.wage+' Gold']));}
 workspace=createDeveloperWorkspace({root,onReturn:()=>render()});
 port.presentation={attachSave:host=>{optionsSaveHost=host;render();},navigate:key=>{const dev=document.getElementById('devWorkspace');if(dev&&!dev.hidden)document.getElementById('devReturn').click();root.hidden=false;navigate(key,{external:true});},isBusy:()=>busy,openDeveloper:()=>{if(!busy)workspace.open();}};
 $('developer-bottom').onclick=()=>{if(!busy)workspace.open();};
 if(UI_P1)root.querySelector('.a1-footer p').textContent='Blood and Thunder';
 port.subscribe(render);render();
 // Discover existing migrated authority with the original read-only workflow.
 // Failure remains visible; never selects or overwrites legacy saves silently.
 run(async()=>{await port.invoke('e4Reload');if(port.durableView?.hasAuthority&&port.durableView.reason)throw Error(port.durableView.reason);},'Your stable is ready.');
}
