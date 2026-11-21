import { gsap } from './engine/gsapEngine';

/** Cuts a centred round hole in a full-screen cover: 0 is fully covered, 100 is fully open. A clip path, because a radial
    mask-image repaints the whole screen on every frame, which an iPhone feels most at exactly these moments. */
export function setIris(el: HTMLElement, pct: number) {
  if (pct <= 0) { el.style.clipPath = 'none'; return; }
  const w = el.clientWidth, h = el.clientHeight, cx = w / 2, cy = h / 2;
  const r = +(Math.hypot(cx, cy) * Math.min(pct, 100) / 100).toFixed(1);
  el.style.clipPath = `path(evenodd, "M0 0H${w}V${h}H0Z M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z")`;
}

export function tweenIris(el: HTMLElement, from: number, to: number, vars: gsap.TweenVars) {
  const state = { pct: from };
  setIris(el, from);
  return gsap.to(state, { ...vars, pct: to, onUpdate: () => setIris(el, state.pct) });
}
