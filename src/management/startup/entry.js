import {mountPlayableStable} from '../playable.js';
import {startShell} from './shell.js';
globalThis.__BNT_E5_C__=true;
// Preserve original workbench nodes for the existing mounting code. The title
// does not initialize or mutate a career; the app mounts only after selection.
const legacy=document.createElement('div');legacy.id='legacyWorkbench';for(const n of [...document.body.children])legacy.append(n);document.body.append(legacy);legacy.style.display='none';
globalThis.__BNT_HOME_STABLE_MOUNT__=mountPlayableStable;
startShell(()=>import('../../ui/app.js'));
