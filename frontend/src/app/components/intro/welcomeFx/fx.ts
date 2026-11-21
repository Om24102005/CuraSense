/* Shared helpers for the welcome screen's animated background: plain Canvas2D, no framework. Each layer (cells, heartbeat lines,
   orbits) is one file exporting a `Layer`; index.ts mounts the three on their own canvases between .wl-bg and .wl-center. */

export type RGB = [number, number, number];

export interface Env {
  g: CanvasRenderingContext2D;
  /** canvas size in CSS px */
  W: number;
  H: number;
  /** backing-store pixels per CSS px, capped at 1.5 (the CSS upscales the rest) */
  sc: number;
  light: boolean;
  /** centre of the seal, CSS px */
  cx: number;
  cy: number;
  /** centre and size of the text block, CSS px */
  bx: number;
  by: number;
  bw: number;
  bh: number;
  /** checklist rows done, 0..3 (the only input a layer may read besides time) */
  progress: number;
}

export interface Layer {
  /** (re)build sprites and state for this size and theme; deterministic */
  init(e: Env): void;
  /** t: seconds of animation, dt: seconds since the previous frame (clamped to 50 ms) */
  draw(e: Env, t: number, dt: number): void;
}

export const TAU = Math.PI * 2;
export const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const bump = (x: number, m: number, s: number) => Math.exp(-((x - m) * (x - m)) / (2 * s * s));

/** Small seeded PRNG: a candidate looks the same on every run. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* The app's welcome tokens (intro.css): a #2667ff, b #87bfff, line #22d3ee, verified green #34d399; light overrides beside them. */
export interface Pal { a: RGB; b: RGB; l: RGB; g: RGB; k: RGB }
export const palette = (light: boolean): Pal => light
  ? { a: [10, 36, 114], b: [38, 103, 255], l: [8, 145, 178], g: [4, 120, 87], k: [190, 60, 140] }
  : { a: [38, 103, 255], b: [135, 191, 255], l: [34, 211, 238], g: [52, 211, 153], k: [236, 72, 153] };
export const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
export const rgb = (c: RGB) => `rgb(${c[0]},${c[1]},${c[2]})`;

export function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c;
}

/** Glows add up on a dark page; on a pale page they are drawn as plain translucent ink. */
export const glowMode = (e: Env): GlobalCompositeOperation => (e.light ? 'source-over' : 'lighter');

/** Reset the transform to CSS px and clear. Call first in every draw(). */
export function begin(e: Env) {
  const g = e.g;
  g.setTransform(e.sc, 0, 0, e.sc, 0, 0);
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'source-over';
  g.clearRect(0, 0, e.W, e.H);
}

/** A soft round glow, drawn once and stamped with drawImage(sprite, x - r, y - r, 2r, 2r). */
export function glow(radius: number, c: RGB, sc: number, peak = 1) {
  const s = Math.max(2, Math.ceil(radius * 2 * sc)), cv = canvas(s, s), g = cv.getContext('2d')!, h = s / 2;
  const gr = g.createRadialGradient(h, h, 0, h, h, h);
  gr.addColorStop(0, rgba(c, peak));
  gr.addColorStop(0.2, rgba(c, peak * 0.6));
  gr.addColorStop(0.48, rgba(c, peak * 0.2));
  gr.addColorStop(0.75, rgba(c, peak * 0.05));
  gr.addColorStop(1, rgba(c, 0));
  g.fillStyle = gr;
  g.fillRect(0, 0, s, s);
  return cv;
}

/** A tight bright dot with a short halo (nodes, particles). */
export function dot(radius: number, c: RGB, sc: number) {
  const s = Math.max(2, Math.ceil(radius * 2 * sc)), cv = canvas(s, s), g = cv.getContext('2d')!, h = s / 2;
  const gr = g.createRadialGradient(h, h, 0, h, h, h);
  gr.addColorStop(0, rgba(c, 1));
  gr.addColorStop(0.3, rgba(c, 0.95));
  gr.addColorStop(0.45, rgba(c, 0.35));
  gr.addColorStop(1, rgba(c, 0));
  g.fillStyle = gr;
  g.fillRect(0, 0, s, s);
  return cv;
}

/* The "calm" pass: knocks the picture back over the text block so the copy stays perfectly legible, and leaves the
   edges at full strength. One drawImage of a pre-rendered soft ellipse with destination-out. */
let calmSprite: HTMLCanvasElement | null = null;
export function calm(e: Env, strength: number) {
  if (!calmSprite) {
    calmSprite = canvas(128, 128);
    const g = calmSprite.getContext('2d')!, gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,1)');
    gr.addColorStop(0.68, 'rgba(0,0,0,0.96)');
    gr.addColorStop(0.86, 'rgba(0,0,0,0.42)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  }
  const g = e.g, rx = e.bw / 2 + 120, ry = e.bh / 2 + 100;
  g.globalCompositeOperation = 'destination-out';
  g.globalAlpha = strength;
  g.drawImage(calmSprite, e.bx - rx, e.by - ry, rx * 2, ry * 2);
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'source-over';
}
