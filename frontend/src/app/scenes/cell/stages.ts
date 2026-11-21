/* The landing page as one continuous shot. Seven stages, one per page section; scroll position
   gives a continuous stage index, and every parameter below is sampled with a Catmull-Rom spline
   so camera and cell never stop between chapters. */

export const STAGE_IDS = ['section-hero', 'reel-problem', 'reel-approach', 'reel-symptoms', 'reel-imaging', 'reel-labs', 'reel-finale'] as const;

export const STAGE_COPY = [
  { label: 'Signal',    text: 'One living cell stands in for one patient. Keep scrolling and watch how CuraSense reads it.' },
  { label: 'Problem',   text: 'Clinicians work with incomplete signal. Reports sit in queues, scans get under-read, labs go uncorrelated.' },
  { label: 'Approach',  text: 'Symptoms, imaging, and labs each tell a slice of the story. CuraSense reads all three and resolves them into one coherent assessment.' },
  { label: 'Symptoms',  text: 'Free-text histories and clinician notes are read word by word. Every extracted entity links back to the exact span in the source text.' },
  { label: 'Imaging',   text: 'See what radiologists see. The model returns region-of-interest annotations with confidence, to surface what they might miss.' },
  { label: 'Labs',      text: 'Values are normalized to patient-specific reference ranges, then read across panels for patterns.' },
  { label: 'Synthesis', text: 'Drop your inputs, read across modalities, get an auditable output. From signal to clinical clarity.' },
] as const;

/* Section centres in document space, measured only when layout may have moved. Reading them every frame forced a style and
   layout pass inside the render loop whenever anything animated. */
let centres: number[] | null = null;
let stale = true, watching = false;

function watch() {
  if (watching) return;
  watching = true;
  const mark = () => { stale = true; };
  addEventListener('resize', mark);
  addEventListener('load', mark);
  document.fonts?.ready.then(mark);
  new ResizeObserver(mark).observe(document.body);   // reflow of any section (images, fonts, copy) changes the page height
}

/** Continuous stage index (0..6): stage i is fully shown when section i is centred in the viewport. */
export function stageFromScroll(): number | null {
  watch();
  if (stale || !centres) {
    const m: number[] = [];
    for (const id of STAGE_IDS) {
      const el = document.getElementById(id);
      if (!el) { centres = null; return null; }
      const b = el.getBoundingClientRect();
      m.push(b.top + window.scrollY + b.height / 2);
    }
    centres = m; stale = false;
  }
  const c = centres;
  const y = window.scrollY + innerHeight * 0.5;
  if (y <= c[0]) return 0;
  for (let i = 0; i < c.length - 1; i++) if (y <= c[i + 1]) return i + (y - c[i]) / (c[i + 1] - c[i]);
  return c.length - 1;
}

export interface Key {
  cx: number; cy: number; cz: number;     // camera position
  lx: number; ly: number; lz: number;     // look-at target
  fov: number;
  px: number; py: number; pz: number;     // cell position (px is scaled down on narrow screens)
  sc: number; ry: number;                 // cell scale, base yaw
  amp: number;                            // membrane wobble
  hp: number;                             // health 1 = coherent, 0 = failing
  op: number;                             // membrane opacity
  st: number; sr: number; sn: number; co: number;   // streams, strand, scan, constellation
  nu: number;                             // nucleus glow
  gl: number; ca: number;                 // bloom, chromatic aberration
  fo: number; bk: number;                 // bokeh focus distance, bokeh amount
  ex: number;                             // exposure: calmer behind dense copy
  og: number;                             // organelle visibility
  vl: number;                             // dark/light veil behind the copy (0..1)
}

const K = (o: Partial<Key>): Key => ({
  cx: 0, cy: 0.15, cz: 10.5, lx: 0, ly: 0, lz: 0, fov: 38, px: 0, py: 0, pz: 0, sc: 1, ry: 0,
  amp: 0.17, hp: 1, op: 1, st: 0, sr: 0, sn: 0, co: 0, nu: 0.35, gl: 1, ca: 0.25, fo: 10.5, bk: 0.5, ex: 1, og: 1, vl: 0, ...o,
});

export const KEYS: Key[] = [
  // 0 Signal: whole cell beside the headline, breathing
  K({ px: 2.6, py: 0.15, ry: 0.2 }),
  // 1 Problem: coherence fails. Membrane shakes, goes red, organelles leak, focus is lost
  K({ cx: -0.3, cy: 0.1, cz: 9.6, lx: 0.6, fov: 42, px: 2.3, sc: 1.02, ry: 0.7, amp: 0.62, hp: 0.1, op: 0.95, nu: 0.1, gl: 0.55, ca: 0.9, fo: 5.5, bk: 1.7, ex: 0.95, vl: 0.25 }),
  // 2 Approach: the camera dives through the wall; three signals spiral into the nucleus
  K({ cx: 0, cy: 0.35, cz: 2.4, lz: -1.5, fov: 64, sc: 1.45, amp: 0.22, op: 0.5, st: 1, nu: 0.5, gl: 1.15, ca: 0.35, fo: 4, bk: 0.8, ex: 0.5, og: 0.7, vl: 0.45 }),
  // 3 Symptoms: close on the ribosomes reading an mRNA strand, word by word
  K({ cx: 0.4, cy: 0.25, cz: 3.0, lx: -0.2, ly: -0.35, lz: 0, fov: 52, sc: 1.45, ry: 0.5, amp: 0.2, op: 0.4, st: 0.2, sr: 1, nu: 0.3, gl: 1.1, ca: 0.2, fo: 3, bk: 0.7, ex: 0.5, og: 0.45, vl: 0.5 }),
  // 4 Imaging: pull out, slice the cell open, find the region of interest
  K({ cx: 0.2, cy: 1.1, cz: 8.6, fov: 40, sc: 1.15, ry: 0.9, amp: 0.14, op: 0.85, sn: 1, nu: 0.3, gl: 1, ca: 0.3, fo: 8.6, bk: 0.5, ex: 0.8, vl: 0.35 }),
  // 5 Labs: inside again, receptors light up and link into patterns
  K({ cy: 0.3, cz: 5.0, fov: 50, sc: 1.3, ry: -0.4, amp: 0.12, op: 0.45, co: 1, nu: 0.3, gl: 1.1, fo: 5, bk: 0.6, ex: 0.55, og: 0.3, vl: 0.5 }),
  // 6 Synthesis: out to a calm, sharp, luminous whole
  K({ cy: 0.1, cz: 10.2, ly: 0.1, fov: 36, py: 0.2, sc: 1.08, amp: 0.11, op: 1, nu: 0.5, gl: 1.5, ca: 0, fo: 10.2, bk: 0.15, vl: 0.12 }),
];

const FIELDS = Object.keys(KEYS[0]) as (keyof Key)[];

const crom = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

const out = {} as Key;
/** Samples every field at stage index s. Returns a shared object: read it, don't keep it. */
export function sampleKey(s: number): Key {
  const n = KEYS.length;
  const c = Math.min(Math.max(s, 0), n - 1);
  const i = Math.min(Math.floor(c), n - 2), t = c - i;
  const a = KEYS[Math.max(i - 1, 0)], b = KEYS[i], d = KEYS[i + 1], e = KEYS[Math.min(i + 2, n - 1)];
  for (const f of FIELDS) out[f] = crom(a[f], b[f], d[f], e[f], t);
  return out;
}
