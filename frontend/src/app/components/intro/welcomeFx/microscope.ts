/* 6. Microscope: a field of soft translucent cells at three depths. Far and near ones are out of focus (wide soft rims,
   bokeh-like), the middle ones are sharp with a membrane, a nucleus and a few organelles. Slow drift with parallax, a
   gentle breathing, and every fifteen seconds one cell divides. Sprites are pre-rendered at three focus levels, so a frame
   is about thirty stamps. */
import { type Layer, type Env, TAU, begin, calm, canvas, glowMode, palette, rgba, rng, smooth, type Pal } from './fx';

const S = 192;      // sprite size in CSS px
const RF = 0.34;    // the cell's radius as a fraction of the sprite: the rest is room for the widest soft rim (no square edges)

/** One cell drawn at a given focus (1 sharp .. 0 out of focus). The soft layers fade in as the crisp ones fade out. */
function cellSprite(e: Env, P: Pal, focus: number, seed: number) {
  const px = Math.ceil(S * e.sc), cv = canvas(px, px), g = cv.getContext('2d')!, c = px / 2, R = px * RF, r = rng(seed), bl = 1 - focus, memb = e.light ? P.a : P.b, nuc = e.light ? P.b : P.l, ink = e.light ? 0.7 : 1;
  g.translate(c, c);
  // translucent body, feathered past the rim so a defocused cell has no hard edge
  const w = px * (0.012 + 0.06 * bl), k = R / (R + w), body = g.createRadialGradient(0, 0, 0, 0, 0, R + w);
  body.addColorStop(0, rgba(memb, 0.04 + 0.03 * bl));
  body.addColorStop(k * 0.7, rgba(memb, 0.09 + 0.05 * bl));
  body.addColorStop(k, rgba(memb, 0.2 + 0.1 * bl));
  body.addColorStop(1, rgba(memb, 0));
  g.fillStyle = body;
  g.beginPath();
  g.arc(0, 0, R + w, 0, TAU);
  g.fill();
  // soft rim: wide and bokeh-bright when out of focus
  const rim = g.createRadialGradient(0, 0, Math.max(0, R - w), 0, 0, R + w);
  rim.addColorStop(0, rgba(memb, 0));
  rim.addColorStop(0.5, rgba(memb, 0.2 + 0.4 * bl));
  rim.addColorStop(1, rgba(memb, 0));
  g.fillStyle = rim;
  g.beginPath();
  g.arc(0, 0, R + w, 0, TAU);
  g.fill();
  // nucleus glow (always) and the crisp parts (only when in focus)
  const ox = (r() - 0.5) * R * 0.35, oy = (r() - 0.5) * R * 0.35, Rn = R * (0.3 + 0.07 * r());
  const nu = g.createRadialGradient(ox, oy, 0, ox, oy, Rn * (1.5 + bl));
  nu.addColorStop(0, rgba(nuc, 0.4 * ink));
  nu.addColorStop(0.55, rgba(nuc, 0.16));
  nu.addColorStop(1, rgba(nuc, 0));
  g.fillStyle = nu;
  g.beginPath();
  g.arc(ox, oy, Rn * (1.5 + bl), 0, TAU);
  g.fill();
  const sharp = smooth(0.35, 0.9, focus);
  if (sharp > 0) {
    g.globalAlpha = sharp;
    g.strokeStyle = rgba(memb, 0.85 * ink);
    g.lineWidth = 1.5 * e.sc;
    g.beginPath();
    g.arc(0, 0, R, 0, TAU);
    g.stroke();
    g.fillStyle = rgba(nuc, 0.22 * ink);
    g.strokeStyle = rgba(nuc, 0.7 * ink);
    g.lineWidth = 1.2 * e.sc;
    g.beginPath();
    g.arc(ox, oy, Rn, 0, TAU);
    g.fill();
    g.stroke();
    g.fillStyle = rgba(P.g, 0.55);
    for (let i = 0; i < 7; i++) {   // organelles
      const a = r() * TAU, d = R * (0.35 + 0.5 * r()), s = (1.4 + 2.2 * r()) * e.sc;
      g.beginPath();
      g.arc(Math.cos(a) * d, Math.sin(a) * d, s, 0, TAU);
      g.fill();
    }
    g.strokeStyle = rgba(memb, 0.16);
    g.lineWidth = 1 * e.sc;
    for (let i = 0; i < 4; i++) {   // a few faint cytoskeleton arcs
      const a = r() * TAU;
      g.beginPath();
      g.arc(0, 0, R * (0.55 + 0.3 * r()), a, a + 0.9 + r());
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  return cv;
}

interface Cell { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; lv: number; al: number; ph: number }
const CYC = 15;
const SPOTS: [number, number, number][] = [[0.78, 0.2, 0.5], [0.2, 0.74, 2.2], [0.84, 0.7, 1.1], [0.14, 0.22, 3.4]];   // x, y fractions and the division axis

let sprites: HTMLCanvasElement[][] = [];   // [level 0 soft, 1 mid, 2 sharp][variant]
let cells: Cell[] = [];

const microscope: Layer = {
  init(e) {
    const P = palette(e.light), r = rng(23);
    sprites = [0, 0.55, 1].map((f, li) => [0, 1, 2].map((v) => cellSprite(e, P, f, 100 + li * 10 + v)));
    cells = [];
    const add = (n: number, lv: number, r0: number, r1: number, v0: number, v1: number, al: number) => {
      for (let i = 0; i < n; i++) {
        const a = -0.9 + r() * 1.8, v = v0 + r() * (v1 - v0), rad = r0 + r() * (r1 - r0);
        cells.push({ x: r() * e.W, y: r() * e.H, vx: Math.cos(a) * v, vy: Math.sin(a) * v - v * 0.35, r: rad, rot: r() * TAU, vr: (r() - 0.5) * 0.05, lv, al, ph: r() * TAU });
      }
    };
    add(13, 0, 16, 30, 3, 6, 0.4);    // far, out of focus
    add(6, 1, 34, 52, 6, 10, 0.7);    // middle, soft
    add(8, 2, 40, 66, 7, 12, 0.85);   // middle, sharp
    add(4, 0, 92, 150, 14, 22, 0.17); // near, out of focus
  },
  draw(e, t, dt) {
    const g = e.g, sc = e.sc;
    begin(e);
    g.globalCompositeOperation = glowMode(e);
    const boost = e.light ? 1.25 : 1;
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rot += c.vr * dt;
      const m = c.r * 1.3 + 8;
      if (c.x < -m) c.x += e.W + 2 * m; else if (c.x > e.W + m) c.x -= e.W + 2 * m;
      if (c.y < -m) c.y += e.H + 2 * m; else if (c.y > e.H + m) c.y -= e.H + 2 * m;
      const f = c.r / (RF * S), br = 0.035 * Math.sin(0.5 * t + c.ph), cr = Math.cos(c.rot), sr = Math.sin(c.rot);
      g.setTransform(sc * f * (1 + br) * cr, sc * f * (1 + br) * sr, -sc * f * (1 - br) * sr, sc * f * (1 - br) * cr, c.x * sc, c.y * sc);
      g.globalAlpha = Math.min(1, c.al * boost);
      g.drawImage(sprites[c.lv][i % 3], -S / 2, -S / 2, S, S);
    }

    // the dividing cell: fade in, stretch into a dumbbell, split, drift apart, fade out
    const u = t / CYC, cyc = Math.floor(u), tau = (u - cyc) * CYC, sp = SPOTS[cyc % SPOTS.length];
    const R = 56, cx = sp[0] * e.W, cy = sp[1] * e.H, ax = Math.cos(sp[2]), ay = Math.sin(sp[2]);
    const a = smooth(0, 1.8, tau) * (1 - smooth(9, 12.5, tau)) * boost;
    if (a > 0.01) {
      const stretch = smooth(1.8, 4.8, tau), apart = smooth(4.8, 8.4, tau), d = R * (0.5 * stretch + 1.1 * apart + 0.5 * smooth(8.4, 12.5, tau)), s = 1 - 0.26 * smooth(2.4, 6, tau);
      for (let k = -1; k <= 1; k += 2) {
        const f = (R * s) / (RF * S), rot = sp[2];
        g.setTransform(sc * f * Math.cos(rot), sc * f * Math.sin(rot), -sc * f * Math.sin(rot), sc * f * Math.cos(rot), (cx + ax * d * k) * sc, (cy + ay * d * k) * sc);
        g.globalAlpha = Math.min(1, a * 0.9);
        g.drawImage(sprites[2][1], -S / 2, -S / 2, S, S);
      }
    }
    g.setTransform(sc, 0, 0, sc, 0, 0);
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
    calm(e, 0.86);
  },
};
export default microscope;
