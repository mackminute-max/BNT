if(typeof BNT_M6_BUILD!=='undefined'&&BNT_M6_BUILD){globalThis.__BNT_M6__=true;globalThis.__BNT_M5__=true;}
if(typeof BNT_M5_BUILD!=='undefined'&&BNT_M5_BUILD)globalThis.__BNT_M5__=true;
if(typeof BNT_M4_BUILD!=='undefined'&&BNT_M4_BUILD)globalThis.__BNT_M4__=true;
if(typeof BNT_M3UIP1_BUILD!=='undefined'&&BNT_M3UIP1_BUILD)globalThis.__BNT_M3_UI_P1__=true;
if(typeof BNT_M3UI_BUILD!=='undefined'&&BNT_M3UI_BUILD)globalThis.__BNT_M3_UI__=true;
import {mountPlayableStable} from '../playable.js';
import {installTips} from '../../presentation/frame/tips.js';
import {startShell} from './shell.js';
import {installFrame} from '../../presentation/frame/frame.js';
globalThis.__BNT_E5_C__=true;
if(typeof BNT_M3BC_P1_BUILD!=='undefined'&&BNT_M3BC_P1_BUILD)globalThis.__BNT_BOUNDARY_RACES__=true;
if(typeof BNT_M2_BUILD!=='undefined'&&BNT_M2_BUILD)globalThis.__BNT_E5_D_M2__=true;
// Preserve original workbench nodes for the existing mounting code. The title
// does not initialize or mutate a career; the app mounts only after selection.
const legacy=document.createElement('div');legacy.id='legacyWorkbench';for(const n of [...document.body.children])legacy.append(n);document.body.append(legacy);legacy.style.display='none';
globalThis.__BNT_HOME_STABLE_MOUNT__=mountPlayableStable;
installFrame();
installTips(document);
startShell(()=>import('../../ui/app.js'));
