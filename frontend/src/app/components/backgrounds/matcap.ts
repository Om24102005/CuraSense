import * as THREE from 'three';

/* Procedural matcap textures: a sphere's lighting painted once into a canvas,
   so the material needs no lights, shadows or reflections at render time.
   Same idea as baked-lighting sites, but generated here, no external files. */

export type MatcapKind = 'gloss' | 'chrome' | 'soft';
const cache = new Map<string, THREE.CanvasTexture>();
const mix = (c: string, to: string, t: number) => new THREE.Color(c).lerp(new THREE.Color(to), t);
const rgba = (c: THREE.Color, a: number) => `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`;

export function matcap(base: string, rim: string, kind: MatcapKind = 'gloss'): THREE.CanvasTexture {
  const key = `${base}|${rim}|${kind}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const x = c.getContext('2d')!;
  const lit = mix(base, '#ffffff', kind === 'soft' ? 0.35 : 0.6);
  const dark = mix(base, '#000000', kind === 'soft' ? 0.55 : 0.8);

  const g = x.createRadialGradient(100, 88, 6, 128, 128, 132);
  g.addColorStop(0, rgba(lit, 1));
  g.addColorStop(0.5, rgba(new THREE.Color(base), 1));
  g.addColorStop(1, rgba(dark, 1));
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);

  if (kind === 'chrome') {
    // Horizon: bright sky over a dark ground with a hard edge, like a reflective studio.
    const h = x.createLinearGradient(0, 0, 0, S);
    h.addColorStop(0, rgba(mix(base, '#ffffff', 0.85), 0.95));
    h.addColorStop(0.5, rgba(mix(base, '#ffffff', 0.35), 0.9));
    h.addColorStop(0.52, rgba(mix(base, '#000000', 0.85), 1));
    h.addColorStop(1, rgba(mix(base, '#000000', 0.6), 1));
    x.globalCompositeOperation = 'overlay';
    x.fillStyle = h;
    x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'source-over';
  }

  // Coloured rim light from the lower right.
  const r = x.createRadialGradient(205, 205, 0, 205, 205, 120);
  r.addColorStop(0, rgba(new THREE.Color(rim), 0.85));
  r.addColorStop(1, rgba(new THREE.Color(rim), 0));
  x.globalCompositeOperation = 'screen';
  x.fillStyle = r;
  x.fillRect(0, 0, S, S);

  // Specular highlight.
  if (kind !== 'soft') {
    const sp = x.createRadialGradient(92, 74, 0, 92, 74, 40);
    sp.addColorStop(0, 'rgba(255,255,255,0.95)');
    sp.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = sp;
    x.fillRect(0, 0, S, S);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

let blob: THREE.CanvasTexture | null = null;
/** Baked contact shadow: a soft dark disc, drawn once. */
export function blobShadow(): THREE.CanvasTexture {
  if (blob) return blob;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,0.6)');
  g.addColorStop(0.6, 'rgba(0,0,0,0.2)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  blob = new THREE.CanvasTexture(c);
  return blob;
}
