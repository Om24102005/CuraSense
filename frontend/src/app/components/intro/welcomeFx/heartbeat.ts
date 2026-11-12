/* 1. Heartbeat field: ECG traces scroll at different speeds and depths (parallax), a bright pulse runs along each one,
   and the glow behind the seal beats at 72 bpm. Same visual language as the first-visit intro. */
import { type Layer, begin, bump, calm, clamp, glow, glowMode, palette, rgb, rng } from './fx';

const LUT_N = 2048;
const LUT = (() => {
  const a = new Float32Array(LUT_N);
  for (let i = 0; i < LUT_N; i++) {
    const u = i / LUT_N;   // P wave, small Q dip, R spike, S dip, T wave
    a[i] = 0.13 * bump(u, 0.17, 0.032) - 0.12 * bump(u, 0.285, 0.007) + bump(u, 0.31, 0.0085) - 0.3 * bump(u, 0.337, 0.009) + 0.2 * bump(u, 0.58, 0.05);
  }
  return a;
})();
const wave = (u: number) => LUT[((u - Math.floor(u)) * LUT_N) | 0];

interface Trace { y: number; amp: number; lp: number; spd: number; al: number; lw: number; hv: number; hp: number; path: Path2D }
const BEAT = 60 / 72;
const pulse = (ph: number) => Math.min(1, bump(ph, 0, 0.05) + bump(ph, 1, 0.05) + 0.6 * bump(ph, 0.25, 0.06));
/** the bright window behind the pulse head: [from, to, alpha] in px */
const SEG: [number, number, number][] = [[0, 46, 1], [46, 120, 0.5], [120, 210, 0.2]];

let traces: Trace[] = [];
let spGlow: HTMLCanvasElement, spHot: HTMLCanvasElement, spBlip: HTMLCanvasElement;
let cLine = '', cBlip = '';

const heartbeat: Layer = {
  init(e) {
    const P = palette(e.light), r = rng(7), n = Math.round(clamp(e.H / 92, 6, 11));
    spGlow = glow(300, e.light ? P.b : P.a, e.sc);
    spHot = glow(120, P.b, e.sc);
    spBlip = glow(16, e.light ? P.b : P.l, e.sc);
    cLine = rgb(P.b);
    cBlip = rgb(e.light ? P.a : P.l);
    traces = [];
    for (let i = 0; i < n; i++) {
      const d = r();   // 0 far .. 1 near
      const lp = 340 + (1 - d) * 240, amp = 16 + d * 38, path = new Path2D();
      for (let x = 0, first = true; x <= lp; x += x / lp > 0.12 && x / lp < 0.42 ? 1.2 : 7) {
        const y = -amp * wave(x / lp);
        if (first) { path.moveTo(x, y); first = false; } else path.lineTo(x, y);
      }
      path.lineTo(lp, 0);
      traces.push({ y: e.H * (0.05 + (0.9 * (i + 0.2 + 0.6 * r())) / n), amp, lp, spd: 18 + d * 70, al: 0.08 + d * 0.15, lw: 0.8 + d * 0.8, hv: 210 + r() * 170, hp: r() * 2000, path });
    }
  },
  draw(e, t) {
    const g = e.g, sc = e.sc, W = e.W, boost = e.light ? 1.5 : 1;
    begin(e);
    g.lineJoin = 'round';
    g.lineCap = 'round';
    g.strokeStyle = cLine;
    for (let i = 0; i < traces.length; i++) {
      const k = traces[i], off = (t * k.spd) % k.lp;
      g.globalAlpha = k.al * boost;
      g.lineWidth = k.lw;
      for (let x = -off - k.lp; x < W; x += k.lp) {
        g.setTransform(sc, 0, 0, sc, x * sc, k.y * sc);
        g.stroke(k.path);
      }
    }
    g.setTransform(sc, 0, 0, sc, 0, 0);

    // the travelling pulse: a bright window of the same trace, fading out behind its head
    g.strokeStyle = cBlip;
    for (let i = 0; i < traces.length; i++) {
      const k = traces[i], off = (t * k.spd) % k.lp, hx = ((t * k.hv + k.hp) % (W + 420)) - 140;
      g.lineWidth = k.lw + 0.5;
      for (let s = 0; s < SEG.length; s++) {
        g.globalAlpha = Math.min(0.9, (k.al * 3.2 + 0.1) * SEG[s][2]) * (e.light ? 0.85 : 1);
        g.beginPath();
        for (let x = hx - SEG[s][1]; x <= hx - SEG[s][0]; x += 2) {
          const y = k.y - k.amp * wave((x + off) / k.lp);
          if (x === hx - SEG[s][1]) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.stroke();
      }
    }
    g.globalCompositeOperation = glowMode(e);
    for (let i = 0; i < traces.length; i++) {
      const k = traces[i], off = (t * k.spd) % k.lp, hx = ((t * k.hv + k.hp) % (W + 420)) - 140;
      g.globalAlpha = Math.min(1, k.al * 4 + 0.25);
      g.drawImage(spBlip, hx - 16, k.y - k.amp * wave((hx + off) / k.lp) - 16, 32, 32);
    }

    calm(e, 0.9);

    // the beat behind the seal, 72 bpm
    const p = pulse((t % BEAT) / BEAT), r1 = 230 + 36 * p, r2 = 104 + 34 * p;
    g.globalCompositeOperation = glowMode(e);
    g.globalAlpha = (e.light ? 0.3 : 0.5) * (0.55 + 0.45 * p);
    g.drawImage(spGlow, e.cx - r1, e.cy - r1, r1 * 2, r1 * 2);
    g.globalAlpha = (e.light ? 0.22 : 0.34) * p;
    g.drawImage(spHot, e.cx - r2, e.cy - r2, r2 * 2, r2 * 2);
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
  },
};
export default heartbeat;
