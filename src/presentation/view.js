import {RacePresenter,geometry as buildGeometry} from './renderer.js';
import {cameraTarget} from './geometry.js';
export {cameraTarget};
export function geometry(s){const p=globalThis.P2?.renderer;if(p){p.reset();p.sceneKey=null;}return buildGeometry(s);}
export function drawCourse(canvas,s,g,{map=false}={}){const p=globalThis.P2.renderer;if(!map)globalThis.P2.onFrame?.(s);return p.draw(canvas,s,g,{map,scale:Number(document.getElementById('zoom')?.value??8),clock:globalThis.P1?.session?.clock??s.time,reducedMotion:p.reducedMotion});}
export function drawInteractions(canvas,s,effects,camera){globalThis.P2.renderer.effects(canvas,s,effects,camera);}
