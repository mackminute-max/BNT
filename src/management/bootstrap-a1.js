import {mountPlayableStable} from './playable.js';
const legacy=document.createElement('div');legacy.id='legacyWorkbench';for(const n of [...document.body.children])legacy.append(n);document.body.append(legacy);globalThis.__BNT_HOME_STABLE_MOUNT__=mountPlayableStable;
