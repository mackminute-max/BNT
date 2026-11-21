import {mountDurableChampionships} from './durable-championships.js';
import {IndexedRecords,E4_DISCOVERY} from '../persistence/e4/indexeddb.js';
import {mountChampionships} from './championships.js';
import {controllerActive} from '../career/championships/controller.js';
import {mountStableCycles} from './stable-cycles.js';
import { mountStableEconomy } from './stable-economy.js';
import { mountStableFoundation } from './stable-foundation.js';
import { createCareer, createUninitializedCareer } from '../career/state.js';
import { CareerStore } from '../persistence/career-store.js';
import { historyRetentionPlan } from '../career/economy/protected-registry.js';
import { SAVE_KEY, MAX_IMPORT_BYTES, parseEnvelope } from '../persistence/envelope.js';

const $ = id => document.getElementById(id);
let sequence = 0;
function newId(prefix) {
  // UI identity only; never consumes racing RNG or determines a racing outcome.
  let suffix;
  try { suffix = globalThis.crypto.randomUUID(); }
  catch { suffix = Date.now().toString(36) + '-' + (++sequence).toString(36); }
  return prefix + '-' + suffix;
}
export function mountCareerSaves({ download }) {
  let storage;
  try { storage = window.localStorage; } catch {}
  const legacyStore = new CareerStore(storage);legacyStore.open();let durableUI=null;
  const mutations=new Set(['transaction','migrateFoundation','migrateCycles','migrateEconomy','migrateSchema','create','importSave','recover']);
  const store=new Proxy(legacyStore,{get(target,key){if((durableUI?.coordinator&&durableUI.durable)){if(key==='state')return durableUI.view?.state??null;if(key==='mode')return durableUI.view?.reason?'blocked':'automatic';if(key==='problem')return durableUI.view?.reason??'';if(['requiresCheckpoint','recoveryPending'].includes(key))return false;if(key==='schema2Session')return (durableUI.view?.state?.schema??0)>=2;if(key==='exportToken')return null;if(key==='export')return ()=>durableUI.coordinator.legacyExport();if(mutations.has(key))return (...args)=>durableUI.career(key,args);}const v=target[key];return typeof v==='function'?v.bind(target):v;}});
  let staged = null, lastToken = null, notice = '', queue = Promise.resolve();
  let managementRefresh = () => {};
  let renderStable = () => {}, renderEconomy = () => {}, renderCycles = () => {}, renderChampionships = () => {};
  function render() {
    const state = store.state;
    managementRefresh();
    if((durableUI?.coordinator&&durableUI.durable)&&controllerActive(state)){for(const e of document.querySelectorAll('#careerSaves button,#careerSaves input,#careerSaves select'))if(!e.closest('#durableChampionships'))e.disabled=true;$('careerSaveStatus').textContent='IndexedDB authoritative career · Home Stable is read-only while active or unsettled';$('careerSaveInspect').textContent='Use the durable championship status and Home Stable inspector below.';durableUI.render();return;}
    $('careerSaveStatus').textContent = `${store.mode.toUpperCase()} · ${state ? `Schema ${state.schema} · Revision ${state.revision} · Maintenance ${state.maintenanceRevision ?? 0} · Treasury ${state.career.treasury} Gold · ${(state.profile.developerEdited || state.career.developerEdited) ? 'DEVELOPER-EDITED (persistent)' : 'Unedited foundation'}` : 'No career loaded'}${store.requiresCheckpoint ? ' · CHECKPOINT REQUIRED: export, save the file and confirm before another change.' : ''}`;
    $('careerSaveNotice').textContent = [store.problem, notice].filter(Boolean).join(' ');
    $('careerSaveInspect').textContent = JSON.stringify(state ?? { status: store.mode, recoveryAvailable: Boolean(store.recovery) }, null, 2);
    $('careerAdjust').disabled = !state || state.career.status==='Failed' || controllerActive(state) || ['blocked', 'recovery-required'].includes(store.mode) || store.requiresCheckpoint;
    $('careerExport').disabled = !state;
    $('careerMigrate').disabled = !state || state.schema !== 1 || ['blocked', 'recovery-required'].includes(store.mode) || store.requiresCheckpoint;
    $('careerCreate').textContent = store.schema2Session ? 'Create uninitialized schema-2 foundation' : 'Create empty M1 state';
    $('careerHistoryPlan').textContent = JSON.stringify(state ? historyRetentionPlan(state) : { scope: 'M2-A only', initialized: false }, null, 2);
    $('careerAcknowledge').disabled = !state || !lastToken;
    $('careerRecover').disabled = !store.recoveryPending;
    $('careerRawExport').disabled = !store.quarantine;
    $('careerImportApply').disabled = !staged;
    renderStable();
    renderEconomy();
    renderCycles();
    if(!(durableUI?.coordinator&&durableUI.durable))renderChampionships();else{document.getElementById('championshipController').hidden=true;durableUI.render();}
  }
  async function legacyAuthorityGate() {
    // Never edit historical Web Storage after a confirmed backend
    // migration. Only the coordinated durable path may write. Check the DB
    // marker even when the separate discovery-witness write was interrupted.
    let db, witness;
    const block = () => {
      store.mode = 'blocked';
      store.problem = 'IndexedDB migration authority exists. Legacy Web Storage is historical and cannot be edited. Open the durable championship recovery panel.';
      throw Error(store.problem);
    };
    try { witness = storage?.getItem(E4_DISCOVERY); }
    catch (error) { if (store.mode !== 'manual') throw error; }
    // Activation requires this durable witness. Never bypass it when IndexedDB
    // is denied. Without a witness, legacy/manual saves remain supported.
    if (witness) block();
    try {
      try { db = await IndexedRecords.open(); }
      catch (error) {
        if (store.mode === 'manual' || error.name === 'SecurityError' || error.name === 'InvalidStateError' || typeof globalThis.indexedDB === 'undefined') return;
        throw error;
      }
      const found = await db.discover(storage);
      if (found.migration || ['blocked','migration-pending'].includes(found.backend)) block();
    } finally { db?.close(); }
  }

  async function exclusive(fn) {
    if(fn.e4Operation||(durableUI?.coordinator&&durableUI.durable))return fn();
    const checked = async () => { await legacyAuthorityGate(); return fn(); };
    // Web Locks serialize cooperating windows when supported. The storage adapter
    // also rejects stale bytes. Without locks, use one active window only.
    if (navigator.locks?.request) return navigator.locks.request(SAVE_KEY + '.writer', checked);
    return checked();
  }
  legacyAuthorityGate().catch(e => { notice = 'Persistence authority check: ' + e.message; render(); });
  const actionResults = new WeakMap();
  const act = fn => () => {
    const outcome = {};
    queue = queue.catch(() => {}).then(() => exclusive(fn)).catch(e => { outcome.error = e; notice = e.message; }).finally(render);
    actionResults.set(queue, outcome);
    return queue;
  };
  $('careerCreate').onclick = act(async () => {
    const existing = store.state || store.raw !== null || store.quarantine;
    if (existing && !window.confirm('Replace the current Owner Profile and Career State with an empty foundation? Export a backup first. Owner Legacy will not be merged.')) return;
    const create = store.schema2Session ? createUninitializedCareer : createCareer;
    await store.create(create({ profileId: newId('profile'), careerId: newId('career'), ownerName: $('careerOwnerName').value, careerName: $('careerName').value }), { confirmed: Boolean(existing) });
    notice = 'Empty uninitialized foundation created: 0 Gold, no roster, championships or Legacy progression. Starting packages and explicit initialization require M2-B.'; lastToken = null;
  });
  $('careerMigrate').onclick = act(async () => {
    const state = store.state;
    if (!state) throw Error('No career loaded');
    if (!window.confirm('Upgrade this M1 career to schema 2? IDs, Gold, gameplay revision, receipts and provenance are preserved. No assets or progress are granted. The previous valid checkpoint is retained. Initialization requires M2-B.')) return;
    await store.migrateSchema({ confirmed: true, profileId: state.profile.id, careerId: state.career.id, expectedRevision: state.revision, expectedMaintenanceRevision: state.maintenanceRevision ?? 0 });
    notice = 'Schema 2 migration committed: management remains uninitialized, registries empty. No Gold, assets, achievements or gameplay revision awarded.'; lastToken = null;
  });
  $('careerAdjust').onclick = act(async () => {
    const state = store.state;
    if (!state) throw Error('No career loaded');
    const rawDelta = $('careerTreasuryDelta').value;
    if (!rawDelta.trim() || !Number.isSafeInteger(Number(rawDelta))) throw Error('Enter a whole-number treasury change');
    const delta = Number(rawDelta), reason = $('careerEditReason').value;
    if (!window.confirm('Apply this developer treasury transaction? It permanently marks this profile and career developer-edited.')) return;
    await store.transaction({ id: newId('tx'), profileId: state.profile.id, careerId: state.career.id, expectedRevision: state.revision, type: 'developer.treasury.adjust', delta, reason, ...(state.schema >= 2 ? { commandVersion: 1, expectedMaintenanceRevision: state.maintenanceRevision, effectId: newId('effect') } : {}) });
    notice = 'Developer transaction committed. This provenance cannot be cleared by ordinary actions.'; lastToken = null;
  });
  $('careerExport').onclick = act(async () => {
    const envelope = await store.export(); lastToken = store.exportToken;
    download(envelope, 'BNT-game-save.json');
    notice = 'Download requested. This exports the complete persistent state, not the running race. The browser cannot verify that you saved it durably. In manual mode, save the file before confirming the checkpoint.';
  });
  $('careerAcknowledge').onclick = act(async () => {
    if (!window.confirm('Have you saved this exact exported checkpoint? This records your confirmation only; the game cannot verify disk durability.')) return;
    store.acknowledgeExport(lastToken); notice = 'Checkpoint confirmed by you for this session; disk durability was not independently verified.';
  });
  $('careerImportFile').onchange = act(async () => {
    staged = null;
    const file = $('careerImportFile').files[0];
    $('careerImportFile').value = ''; // Allow selecting the same filename again after a replacement.
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.json') || file.size > MAX_IMPORT_BYTES) throw Error('Choose a career .json file within the 8 MiB import limit (schema 1 remains limited to 2 MiB)');
    const text = await file.text(), parsed = parseEnvelope(text);
    staged = text;
    $('careerImportMigrate').checked = parsed.primary.schema === 1 && store.schema2Session;
    notice = `Import validated: ${parsed.primary.profile.name} / ${parsed.primary.career.name}, schema ${parsed.primary.schema}, revision ${parsed.primary.revision}. ${$('careerImportMigrate').checked ? 'Schema-1 upgrade is selected; no grants or initialization. ' : ''}Nothing was replaced. Use Confirm replacement to proceed.`;
  });
  $('careerImportApply').onclick = act(async () => {
    if (!staged) throw Error('Select and validate an import first');
    if (!window.confirm('Replace the entire loaded Owner Profile, Career State and pending checkpoint with this file? Export your current state first. Owner Legacy is replaced, never merged; known matching developer provenance is retained. If the schema-1 upgrade checkbox is selected, the file is upgraded without grants.')) return;
    await store.importSave(staged, { confirmed: true, migrateLegacy: $('careerImportMigrate').checked }); staged = null; lastToken = null;
    notice = 'Complete persistent state imported. Owner Legacy was not merged. Retained developer provenance may keep an older imported checkpoint marked edited.';
  });
  $('careerRecover').onclick = act(async () => {
    if (!window.confirm('Recover the previous valid checkpoint? The current corrupt bytes remain available for diagnostic export. No financial recovery transaction or reward will be created.')) return;
    await store.recover({ confirmed: true }); lastToken = null; notice = 'Previous checkpoint selected explicitly. Known developer provenance retained; no transaction, reward or revision was invented.';
  });
  $('careerRawExport').onclick = act(async () => {
    download({ kind: 'BNT-corrupt-save-diagnostic', raw: store.quarantine }, 'BNT-corrupt-save-diagnostic.json');
    notice = 'Original corrupt bytes included in a diagnostic download request. This is not an importable game save or a verified durable backup.';
  });
  window.addEventListener('storage', e => {
    if (e.key === SAVE_KEY) { notice = 'Career storage changed in another window. Reload before further editing. Use only one active writer when Web Locks are unavailable.'; render(); }
  });
  renderStable = mountStableFoundation({store,act,newId,setNotice:message=>{notice=message;lastToken=null;}});
  renderEconomy = mountStableEconomy({store,act,newId,setNotice:message=>{notice=message;lastToken=null;},download});
  renderCycles = mountStableCycles({store,act,newId,setNotice:message=>{notice=message;lastToken=null;}});
  renderChampionships=mountChampionships({store,act,newId,setNotice:message=>{notice=message;lastToken=null;}});
  durableUI=mountDurableChampionships({legacyStorage:storage,getLegacyState:()=>legacyStore.state,act,renderParent:render,newId});
  render();
  // Optional presentation port: existing queue, discovery gate and persistence.
  const playerPort = {
    get store() { return store; },
    get durable() { return Boolean(durableUI?.durable); },
    get durableView() { return durableUI?.view ?? null; },
    newId,
    e5(command,payload) {
      let result;const operation=async()=>{if(!durableUI?.durable)throw Error('Enable durable saves before championship operations');result=await durableUI.e5(command,payload);};operation.e4Operation=true;
      const done=act(operation)();return done.then(()=>{const error=actionResults.get(done)?.error;if(error)throw error;return result;});
    },
    subscribe(refresh) { managementRefresh = refresh; refresh(); },
    perform(operation) {
      let result;
      const done = act(async () => { result = await operation(store); })();
      return done.then(() => { const error = actionResults.get(done)?.error; if (error) throw error; return result; });
    },
    async invoke(id) {
      if (id.startsWith('e4')) durableUI?.render();
      const control = $(id);
      if (!control || control.disabled) throw Error('This existing workflow is unavailable');
      const done = control.onclick?.(); await done;
      const error = actionResults.get(done)?.error; if (error) throw error;
    },
  };
  globalThis.__BNT_HOME_STABLE_MOUNT__?.(playerPort);
}
