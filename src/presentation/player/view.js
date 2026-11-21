import * as view from '../view.js';
export const cameraTarget = view.cameraTarget;
export const geometry = view.geometry;
export function drawCourse(canvas, state, geometry, options = {}) {
  if (globalThis.P21?.view === 'developer') {
    if (!options.map) globalThis.P2.onFrame?.(state);
    return globalThis.P2.renderer.views.main?.camera ?? {x: 0, y: 0, scale: 8};
  }
  return view.drawCourse(canvas, state, geometry, options);
}
export function drawInteractions(...args) {
  if (globalThis.P21?.view !== 'developer') view.drawInteractions(...args);
}
