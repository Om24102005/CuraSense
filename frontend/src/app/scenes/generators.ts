/* Point-cloud generators, one per page scene. Pure functions: same seed, same cloud.
   Each returns flat xyz positions plus per-point seed, colour mix and kind (0 body, 1 trace). */

export type SceneKey = 'welcome' | 'dashboard' | 'analyze' | 'history' | 'booking' | 'settings' | 'admin';

export interface Cloud {
  pos: Float32Array;
  seed: Float32Array;
  mix: Float32Array;
  kind: Float32Array;
  lines?: Cloud; // segment endpoints, two points per segment
}

export interface SceneSpec {
  mode: number;            // shader motion mode, see PageScene
  colA: string;
  colB: string;
  offset: [number, number, number];
  build: (n: number) => Cloud;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Builder {
  p: number[] = []; s: number[] = []; m: number[] = []; k: number[] = [];
  constructor(private r: () => number) {}
  add(x: number, y: number, z: number, mix = this.r(), kind = 0) {
    this.p.push(x, y, z); this.s.push(this.r()); this.m.push(mix); this.k.push(kind);
  }
  done(): Cloud {
    return { pos: new Float32Array(this.p), seed: new Float32Array(this.s), mix: new Float32Array(this.m), kind: new Float32Array(this.k) };
  }
}

/* Dashboard: beating heart volume with a travelling ECG trace beneath it. */
function heart(n: number): Cloud {
  const r = rng(11), b = new Builder(r);
  const body = Math.floor(n * 0.86);
  for (let i = 0; i < body; i++) {
    const t = r() * Math.PI * 2, k = Math.cbrt(r());
    const hx = 16 * Math.sin(t) ** 3;
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const thick = (1 - Math.abs(hx) / 17) * 4.2;
    b.add(hx * 0.24 * k, hy * 0.24 * k + 0.2, (r() - 0.5) * thick * k, r() < 0.3 ? 1 : r() * 0.5);
  }
  for (let i = 0; i < n - body; i++) {
    const x = -8 + (i / (n - body)) * 16, u = (x + 8) / 16;
    let y = 0;
    const c = (u - 0.5) * 24;
    y += 0.25 * Math.exp(-((c + 5) ** 2) / 1.2);
    y -= 0.35 * Math.exp(-((c + 0.9) ** 2) / 0.05);
    y += 1.9 * Math.exp(-(c ** 2) / 0.06);
    y -= 0.55 * Math.exp(-((c - 0.9) ** 2) / 0.05);
    y += 0.5 * Math.exp(-((c - 5) ** 2) / 1.6);
    b.add(x, -3.6 + y, 0.3, 0.9, 1);
  }
  return b.done();
}

/* Analyze: double helix with base-pair rungs. */
function helix(n: number): Cloud {
  const r = rng(23), b = new Builder(r), lb = new Builder(r);
  const turns = 4, H = 8, R = 1.9;
  const strand = Math.floor(n * 0.7);
  for (let i = 0; i < strand; i++) {
    const u = i / (strand / 2) % 1, s = i % 2 ? 0 : Math.PI;
    const a = u * turns * Math.PI * 2 + s;
    b.add(Math.cos(a) * R + (r() - 0.5) * 0.18, (u - 0.5) * H, Math.sin(a) * R + (r() - 0.5) * 0.18, i % 2 ? 0.1 : 0.85);
  }
  for (let i = 0; i < n - strand; i++) {
    const u = r(), a = u * turns * Math.PI * 2, t = r();
    b.add(Math.cos(a) * R * (2 * t - 1), (u - 0.5) * H, Math.sin(a) * R * (2 * t - 1), 0.5);
  }
  const rungs = 70;
  for (let i = 0; i < rungs; i++) {
    const u = (i + 0.5) / rungs, a = u * turns * Math.PI * 2, y = (u - 0.5) * H;
    lb.add(Math.cos(a) * R, y, Math.sin(a) * R, 0.2); lb.add(-Math.cos(a) * R, y, -Math.sin(a) * R, 0.8);
  }
  const c = b.done(); c.lines = lb.done();
  return c;
}

/* History: a vessel of corpuscles flowing left to right. */
function flow(n: number): Cloud {
  const r = rng(37), b = new Builder(r);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, rad = 1.9 * Math.sqrt(r()) * (0.35 + 0.65 * r());
    b.add(-8 + r() * 16, Math.cos(a) * rad, Math.sin(a) * rad, r() < 0.22 ? 0.05 : 0.9);
  }
  return b.done();
}

/* Booking: drifting medical crosses, the care network. */
function care(n: number): Cloud {
  const r = rng(41), b = new Builder(r);
  const crosses = 34, per = Math.floor(n / crosses);
  for (let c = 0; c < crosses; c++) {
    const cx = (r() - 0.5) * 17, cy = (r() - 0.5) * 9, cz = (r() - 0.5) * 5, sc = 0.55 + r() * 0.8, mx = r() < 0.4 ? 0.95 : 0.1;
    for (let i = 0; i < per; i++) {
      const arm = r() < 0.5, u = (r() - 0.5) * 2, w = (r() - 0.5) * 0.7;
      b.add(cx + (arm ? u : w) * sc * 1.6, cy + (arm ? w : u) * sc * 1.6, cz + (r() - 0.5) * 0.2, mx);
    }
  }
  return b.done();
}

/* Settings: a living cell, membrane shell, nucleus and organelles. */
function cell(n: number): Cloud {
  const r = rng(53), b = new Builder(r);
  const sph = (rad: number, jit: number) => {
    const u = r() * 2 - 1, a = r() * Math.PI * 2, q = Math.sqrt(1 - u * u), j = rad + (r() - 0.5) * jit;
    return [q * Math.cos(a) * j, u * j, q * Math.sin(a) * j] as const;
  };
  for (let i = 0; i < n; i++) {
    const w = r();
    if (w < 0.5) { const [x, y, z] = sph(3.6, 0.12); b.add(x, y, z, 0.1); }
    else if (w < 0.72) { const [x, y, z] = sph(1.15, 0.4); b.add(x, y, z, 0.95); }
    else { const [x, y, z] = sph(r() * 3, 0.1); b.add(x, y, z, 0.5); }
  }
  return b.done();
}

/* Admin: neural graph of nodes and nearest-neighbour edges. */
function neural(n: number): Cloud {
  const r = rng(67), b = new Builder(r), lb = new Builder(r);
  const N = 70, nodes: [number, number, number][] = [];
  for (let i = 0; i < N; i++) nodes.push([(r() - 0.5) * 15, (r() - 0.5) * 8, (r() - 0.5) * 5]);
  const pairs: [number, number][] = [];
  nodes.forEach((a, i) => {
    nodes.map((c, j) => [j, (a[0] - c[0]) ** 2 + (a[1] - c[1]) ** 2 + (a[2] - c[2]) ** 2] as const)
      .filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, 3)
      .forEach(([j]) => { if (i < j) pairs.push([i, j]); });
  });
  pairs.forEach(([i, j]) => { lb.add(...nodes[i], 0.2); lb.add(...nodes[j], 0.8); });
  nodes.forEach(([x, y, z]) => { for (let k = 0; k < 14; k++) b.add(x + (r() - 0.5) * 0.35, y + (r() - 0.5) * 0.35, z + (r() - 0.5) * 0.35, 0.9); });
  const rest = Math.max(0, n - N * 14);
  for (let i = 0; i < rest; i++) {
    const [a, c] = pairs[Math.floor(r() * pairs.length)], t = r();
    b.add(nodes[a][0] + (nodes[c][0] - nodes[a][0]) * t, nodes[a][1] + (nodes[c][1] - nodes[a][1]) * t, nodes[a][2] + (nodes[c][2] - nodes[a][2]) * t, 0.3);
  }
  const cl = b.done(); cl.lines = lb.done();
  return cl;
}


export const SCENES: Record<Exclude<SceneKey, 'welcome'>, SceneSpec> = {
  dashboard: { mode: 0, colA: '#ff5d7a', colB: '#ffd1da', offset: [3.6, 0.2, -1], build: heart },
  analyze:   { mode: 1, colA: '#2dd4bf', colB: '#38bdf8', offset: [4.2, -0.4, -1],  build: helix },
  history:   { mode: 2, colA: '#ff5d7a', colB: '#ffd1da', offset: [0, 0, -2],    build: flow },
  booking:   { mode: 3, colA: '#2dd4bf', colB: '#ffffff', offset: [0, 0, -3],    build: care },
  settings:  { mode: 4, colA: '#38bdf8', colB: '#2dd4bf', offset: [3.2, 0, -1],  build: cell },
  admin:     { mode: 5, colA: '#2dd4bf', colB: '#38bdf8', offset: [0, 0, -3],    build: neural },
};
