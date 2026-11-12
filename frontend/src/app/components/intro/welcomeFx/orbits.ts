/* 5. Orbits (progress-linked): three tilted orbits round the seal, one per checklist row. Until its row is done an orbit
   drifts loosely (particles wander, ring faint). When `e.progress` reaches the row's number the orbit locks in: particles
   ease to even spacing, the ring brightens and turns the done-green, and one soft ripple leaves it. The background shows
   the real loading. The only input beyond time is `e.progress` (0..3 rows done). */
import { type Layer, TAU, begin, calm, clamp, glow, glowMode, palette, rgb, rng } from './fx';

interface Orb { rx: number; ry: number; rot: number; n: number; spd: number; ci: number; lock: number; at: number; ph: Float32Array; wa: Float32Array; wf: Float32Array }
const DEF = [
  { rx: 150, ry: 58, rot: -0.36, n: 5, spd: 0.62, ci: 0 },
  { rx: 236, ry: 92, rot: 0.24, n: 7, spd: -0.44, ci: 1 },
  { rx: 336, ry: 132, rot: -0.09, n: 9, spd: 0.31, ci: 2 },
];

let orbs: Orb[] = [];
let sp: HTMLCanvasElement[] = [], spLock: HTMLCanvasElement, spCore: HTMLCanvasElement;
let cBase: string[] = [], cLock = '';
let prev = 0;

const orbits: Layer = {
  init(e) {
    const P = palette(e.light), r = rng(11), k = clamp(Math.min(e.W, e.H * 1.45) / 1100, 0.62, 1.15);
    spCore = glow(220, e.light ? P.b : P.a, e.sc);
    sp = [glow(9, P.l, e.sc), glow(9, P.b, e.sc), glow(9, P.b, e.sc)];
    spLock = glow(9, P.g, e.sc);
    cBase = [rgb(P.l), rgb(P.b), rgb(e.light ? P.a : P.b)];
    cLock = rgb(P.g);
    orbs = DEF.map((d) => {
      const ph = new Float32Array(d.n), wa = new Float32Array(d.n), wf = new Float32Array(d.n);
      for (let j = 0; j < d.n; j++) { ph[j] = r() * TAU; wa[j] = 0.6 + r() * 0.9; wf[j] = 0.35 + r() * 0.65; }
      return { ...d, rx: d.rx * k, ry: d.ry * k, lock: 0, at: -10, ph, wa, wf };
    });
    // rows already done when the candidate is selected start locked, with no ripple
    for (let i = 0; i < 3; i++) if (i < e.progress) orbs[i].lock = 1;
    prev = e.progress;
  },
  draw(e, t, dt) {
    const g = e.g, P = e.progress, boost = e.light ? 1.4 : 1;
    begin(e);
    if (P > prev) for (let i = prev; i < P; i++) orbs[i].at = t;
    prev = P;

    g.globalCompositeOperation = glowMode(e);
    g.globalAlpha = (e.light ? 0.2 : 0.3) + 0.06 * P;
    g.drawImage(spCore, e.cx - 210, e.cy - 210, 420, 420);
    g.globalCompositeOperation = 'source-over';

    for (let i = 0; i < 3; i++) {
      const o = orbs[i], L = (o.lock += ((i < P ? 1 : 0) - o.lock) * Math.min(1, dt * 2.2));
      const rot = o.rot + 0.03 * t * (i % 2 ? -1 : 1), cr = Math.cos(rot), sr = Math.sin(rot);

      // the ring: faint and in the base colour while loose, brighter and green once locked
      g.lineWidth = 1 + 0.7 * L;
      if (L < 0.99) {
        g.strokeStyle = cBase[i];
        g.globalAlpha = (1 - L) * 0.2 * boost;
        g.beginPath();
        g.ellipse(e.cx, e.cy, o.rx, o.ry, rot, 0, TAU);
        g.stroke();
      }
      if (L > 0.01) {
        g.strokeStyle = cLock;
        g.globalAlpha = L * 0.36 * boost;
        g.beginPath();
        g.ellipse(e.cx, e.cy, o.rx, o.ry, rot, 0, TAU);
        g.stroke();
      }
      // one soft ripple when it locks
      const age = t - o.at;
      if (age >= 0 && age < 1.4) {
        const q = age / 1.4, s = 1 + 0.4 * q;
        g.strokeStyle = cLock;
        g.lineWidth = 1.6;
        g.globalAlpha = 0.5 * (1 - q) * (1 - q) * boost;
        g.beginPath();
        g.ellipse(e.cx, e.cy, o.rx * s, o.ry * s, rot, 0, TAU);
        g.stroke();
      }

      // particles
      g.globalCompositeOperation = glowMode(e);
      for (let j = 0; j < o.n; j++) {
        const w = (1 - L) * o.wa[j] * Math.sin(o.wf[j] * t + o.ph[j]);
        const th = o.spd * t + (j * TAU) / o.n + w, rho = 1 + (1 - L) * 0.07 * Math.sin(0.9 * t + j * 2.1);
        const lx = o.rx * rho * Math.cos(th), ly = o.ry * rho * Math.sin(th);
        const x = e.cx + lx * cr - ly * sr, y = e.cy + lx * sr + ly * cr;
        const front = (Math.sin(th) + 1) / 2, size = (8.5 + 5.5 * front) * (1 + 0.25 * L), a = (0.45 + 0.55 * front) * boost;
        if (L < 0.99) { g.globalAlpha = a * (1 - L); g.drawImage(sp[o.ci], x - size, y - size, size * 2, size * 2); }
        if (L > 0.01) { g.globalAlpha = a * L; g.drawImage(spLock, x - size, y - size, size * 2, size * 2); }
      }
      g.globalCompositeOperation = 'source-over';
    }
    calm(e, 0.4);   // the orbits pass behind the copy at reduced strength
  },
};
export default orbits;
