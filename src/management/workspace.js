// Reparent existing nodes, retaining IDs, handlers, values and authority guards.
// Component and Bulk are two views of the original shared all-RU/wildcard editor.
export function createDeveloperWorkspace({root,onReturn}){
 const legacy=document.getElementById('legacyWorkbench'),existingControls=[...legacy.querySelectorAll('button,input,select,textarea')];
 const workspace=document.createElement('section');workspace.id='devWorkspace';workspace.hidden=true;
 workspace.innerHTML='<header><h1>Developer Tools</h1><button id="devReturn">Return to Stable</button></header><nav id="devNav" aria-label="Developer workspace"></nav><h2 id="devTitle"></h2><main id="devPages"></main>';
 root.after(workspace);const pages={},titles={overview:'Overview',component:'Component Editor',bulk:'Bulk Editor',career:'M2 Career Tools',race:'Race & Simulation',save:'Save & Recovery',logs:'Logs & Diagnostics'};
 for(const key of ['overview','component','career','race','save','logs']){pages[key]=document.createElement('section');pages[key].id='dev-'+key;pages[key].className='dev-page';workspace.querySelector('#devPages').append(pages[key]);}
 const developer=document.getElementById('developer');developer.open=true;
 let destination=pages.overview;
 for(const n of [...developer.children]){
  if(n.tagName==='SUMMARY')continue;
  if(n.tagName==='H2')destination=n.textContent.includes('Component')?pages.component:pages.race;
  if(n.id==='careerSaves')continue;
  destination.append(n);
 }
 const career=document.getElementById('careerSaves');career.open=true;
 // Keep career descendants under their original guard scope. Only presentation
 // visibility differs between the M2 and advanced save workspace pages.
 pages.career.append(career);
 const careerNodes=new Set(['stableFoundation','stableCycles','stableEconomy','championshipController']);
 const saveGroup=document.createElement('div');saveGroup.id='dev-save-controls';const careerGroup=document.createElement('div');careerGroup.id='dev-career-controls';
 for(const n of [...career.children]){if(n.tagName==='SUMMARY')continue;(careerNodes.has(n.id)?careerGroup:saveGroup).append(n);}
 career.append(saveGroup,careerGroup);
 const edit=document.getElementById('careerAdjust').closest('.controls');careerGroup.append(edit);
 careerGroup.append(document.getElementById('careerSaveInspect').closest('details'));
 career.prepend(document.getElementById('careerSaveStatus'),document.getElementById('careerSaveNotice'));
 workspace.querySelector('#devTitle').after(document.getElementById('developerStatus'));
 const summary=document.createElement('p');summary.id='devContext';pages.overview.prepend(summary);
 const main=legacy.querySelector('main');for(const child of [...main.children]){if(child.contains(developer))continue;pages.race.append(child);}
 // Remaining original wrappers/header remain available, not dropped.
 for(const n of [...legacy.children])if(n!==main)pages.overview.append(n);
 for(const id of ['log','aiDiagnostics','derivedDetails']){const el=document.getElementById(id);if(el){const panel=el.closest('.panel')??el;pages.logs.append(panel);}}
 const nav=workspace.querySelector('#devNav');let current='overview';
 function select(key){current=key;summary.textContent=['state','tick','careerSaveStatus'].map(id=>document.getElementById(id)?.textContent??'').join(' · ');for(const p of Object.values(pages))p.hidden=true;const target=key==='bulk'?'component':key;pages[target].hidden=false;workspace.querySelector('#devTitle').textContent=titles[key];if(key==='career'||key==='save'){pages.career.hidden=false;careerGroup.hidden=key!=='career';saveGroup.hidden=key!=='save';}for(const b of nav.children)b.setAttribute('aria-current',String(b.dataset.dev===key));}
 for(const [key,title]of Object.entries(titles)){const b=document.createElement('button');b.textContent=title;b.dataset.dev=key;b.onclick=()=>select(key);nav.append(b);}
 workspace.querySelector('#devReturn').onclick=()=>{workspace.hidden=true;root.hidden=false;onReturn();};
 const inventory=existingControls.map(el=>({id:el.id||null,label:el.textContent?.trim().slice(0,90)||el.getAttribute('aria-label')||el.type,element:el}));
 return {open(){root.hidden=true;workspace.hidden=false;select(current);},select,inventory:()=>inventory.map(({element,...row})=>({...row,connected:element.isConnected,page:element.closest('.dev-page')?.id??'unclassified'}))};
}
