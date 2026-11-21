import {mountHomeStable} from './home.js';
const legacy=document.createElement('div');legacy.id='legacyWorkbench';
for(const node of [...document.body.children])legacy.append(node);
document.body.append(legacy);
globalThis.__BNT_HOME_STABLE_MOUNT__=mountHomeStable;
