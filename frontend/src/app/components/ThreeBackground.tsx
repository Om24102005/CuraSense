/* ═══════════════════════════════════════════════════════════════════
   CuraSense — DNA HELIX  (v4 :: form metamorphosis)
   ───────────────────────────────────────────────────────────────────
   Same particles. FIVE entirely different structures. As you scroll
   the page, the cloud morphs between them in sequence:

       0 ── DNA HELIX           (genetic data)
       1 ── BRAIN ELLIPSOID     (neural reasoning)
       2 ── ANATOMICAL HEART    (cardiac signal)
       3 ── CELL                (cellular health)
       4 ── SPIRAL GALAXY       (cosmic intelligence)

   HOW THE MORPH WORKS
     For every particle we pre-compute its position in ALL FIVE forms
     and store each form as its own BufferAttribute (position, pos1,
     pos2, pos3, pos4). The vertex shader receives a single uniform
     `uMorph` (range 0..4) and computes a triangular-hat weight for
     each form — at uMorph=2.0 only the heart contributes, at
     uMorph=2.5 the heart and the cell contribute equally. The final
     vertex position is the weighted blend.

     Memory: 5 forms × 80k particles × 3 floats = 4.8 MB on GPU.
     Shader cost: 5 multiply-adds per vertex. Negligible.

   PLATEAU CURVE
     Linear scroll → uMorph = scroll × 4 would smear forms together.
     Instead, `plateauMorph()` holds pure form for ~60% of each
     segment and transitions through the middle 40%. So the user
     SEES a clear DNA, then watches it flow into a clear brain,
     then sees a clear brain, then flow into the heart, etc.

   PRESERVED FROM v3
     ✓ Cardiac heartbeat (uPulse, GSAP timeline)
     ✓ Travelling energy pulses along Y axis
     ✓ Click ripple (uClickPulse)
     ✓ Damped peachweb-style mouse parallax
     ✓ Color phase aurora flow (uColorPhase)
     ✓ Cinematic intro (uIntro)
     ✓ Spline-soft fragment falloff
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../App';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Particle counts are device-tiered (chosen at mount).
   80k looked dense and busy — 28k reads as professional and clean
   while still defining every form. Mobile uses 11k for performance
   plus a lower pixel-ratio cap; the helix and organs remain
   recognisable but the GPU bill drops by ~80%. */
const FORM_COUNT = 5;
const isMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

/* ── FORM GENERATORS ───────────────────────────────────────────────────
   Each function returns [x, y, z] for a single particle in one form.
   They use Math.random() per call — there's no required correspondence
   between a particle's helix-slot and its brain-slot, which actually
   helps: morphs look organic ("particle weather") rather than 1:1
   linear interpolation lattices. */

function helixPos(): [number, number, number] {
  const r = Math.random();
  if (r < 0.34) {
    // Strand A
    const t = (Math.random() - 0.5) * 420;
    const a = t * 0.1;
    const rad = 25 + Math.random() * 1.5;
    return [Math.cos(a) * rad, t, Math.sin(a) * rad];
  } else if (r < 0.68) {
    // Strand B (PI offset)
    const t = (Math.random() - 0.5) * 420;
    const a = t * 0.1 + Math.PI;
    const rad = 25 + Math.random() * 1.5;
    return [Math.cos(a) * rad, t, Math.sin(a) * rad];
  } else if (r < 0.78) {
    // Inner helix
    const t = (Math.random() - 0.5) * 420;
    const a = t * 0.2 + (Math.random() < 0.5 ? 0 : Math.PI);
    const rad = 12 + Math.random() * 1.5;
    return [Math.cos(a) * rad, t, Math.sin(a) * rad];
  } else if (r < 0.88) {
    // Rungs (base pairs)
    const t = (Math.random() - 0.5) * 420;
    const f = Math.random();
    const a1 = t * 0.1, a2 = t * 0.1 + Math.PI;
    const x1 = Math.cos(a1) * 25, z1 = Math.sin(a1) * 25;
    const x2 = Math.cos(a2) * 25, z2 = Math.sin(a2) * 25;
    return [x1 + (x2 - x1) * f, t, z1 + (z2 - z1) * f];
  } else {
    // Surrounding nebula
    const rr = 40 + Math.random() * 180;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 2 - 1);
    return [
      rr * Math.sin(ph) * Math.cos(th),
      rr * Math.sin(ph) * Math.sin(th),
      rr * Math.cos(ph),
    ];
  }
}

function brainPos(): [number, number, number] {
  /* Anatomical brain — four regions:
       1. Cerebrum cortex (60%)  — folded surface ellipsoid, longitudinal
                                   fissure depressed down the middle on top
       2. Cerebrum interior (14%) — depth fill (white matter analogue)
       3. Cerebellum (18%)        — small densely-folded ball at the
                                   back-bottom (posterior-inferior)
       4. Brainstem (8%)          — narrow column descending below
     Axes: +X right, +Y up, +Z back. Camera looks from -Z. */
  const r = Math.random();

  // 2.5× larger so the brain reads as a presence, not a blob.
  const RX = 95;  // L-R width
  const RY = 80;  // I-S height
  const RZ = 115; // A-P depth

  if (r < 0.62) {
    // 1. CORTEX — folded ellipsoid surface
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    let x = RX * Math.sin(phi) * Math.cos(theta);
    let y = RY * Math.cos(phi);
    let z = RZ * Math.sin(phi) * Math.sin(theta);

    // Cortical folding — two strong frequencies for clear gyri,
    // one micro for fine texture. Amplitude scaled with size.
    const f1 = Math.sin(theta * 5 + phi * 3) * 7.5;  // major gyri (low freq, big)
    const f2 = Math.cos(theta * 10 + phi * 7) * 3.8; // medium folds
    const f3 = Math.sin(theta * 19 + phi * 14) * 1.5; // micro texture
    const fold = f1 + f2 + f3;
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    x += (x / len) * fold;
    y += (y / len) * fold;
    z += (z / len) * fold;

    // LONGITUDINAL FISSURE — deeper, longer trough on the top surface.
    // 16 unit depression near X=0 across the entire top.
    if (y > RY * 0.25) {
      const dent = 16 * Math.exp(-Math.pow(x / 8, 2));
      y -= dent;
    }

    // Frontal lobe (anterior) sits noticeably lower
    if (z < -RZ * 0.4) y -= 5;

    return [x, y, z];
  } else if (r < 0.78) {
    // 2. CEREBRUM INTERIOR (white-matter depth fill)
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radial = Math.pow(Math.random(), 0.55);
    return [
      RX * radial * Math.sin(phi) * Math.cos(theta),
      RY * radial * Math.cos(phi),
      RZ * radial * Math.sin(phi) * Math.sin(theta),
    ];
  } else if (r < 0.93) {
    // 3. CEREBELLUM — bigger and clearly separated (real gap from cerebrum).
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const baseR = 28; // 2× previous

    let cx = baseR * Math.sin(phi) * Math.cos(theta);
    let cy = baseR * Math.cos(phi) * 0.7;
    let cz = baseR * Math.sin(phi) * Math.sin(theta);

    // Tight cerebellar folds — two stacked frequencies
    const ff1 = Math.sin(theta * 18) * Math.cos(phi * 14) * 2.5;
    const ff2 = Math.sin(theta * 30) * 1.0;
    const ff = ff1 + ff2;
    const len = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1;
    cx += (cx / len) * ff;
    cy += (cy / len) * ff;
    cz += (cz / len) * ff;

    // Posterior-inferior — clear gap from cerebrum (z = +RZ*0.65)
    return [cx, -RY * 0.55 + cy, RZ * 0.65 + cz];
  } else {
    // 4. BRAINSTEM — thicker, longer column — clearly visible.
    const phi = Math.random() * Math.PI * 2;
    const tubeR = 8 * Math.pow(Math.random(), 0.5); // 2× previous
    const t = Math.random();
    return [
      Math.cos(phi) * tubeR,
      -RY * 0.65 - t * 42, // 2.3× longer
      RZ * 0.5 + Math.sin(phi) * tubeR * 0.7,
    ];
  }
}

function heartPos(): [number, number, number] {
  /* Anatomical heart — three regions:
       1. Pear body (70%)    — chambers (ventricles below, atria above),
                               with an atrioventricular groove and an
                               inter-ventricular sulcus on the front,
                               tilted ~25° so the apex points down-left
       2. Aortic arch (17%)  — the iconic curving tube emerging from
                               the top, arching up and to the right
       3. Vessel stubs (13%) — pulmonary trunk, SVC, aortic root —
                               cylindrical extensions at the base */
  const r = Math.random();

  if (r < 0.65) {
    // 1. PEAR BODY (chambers) — 2.6× larger, deeper grooves
    const t = Math.random();
    const phi = Math.random() * Math.PI * 2;
    const yy = -1 + 2 * t; // -1 (apex) → +1 (base/atria)

    // Pear radius profile (more pronounced ventricular bulge)
    let rad: number;
    if (yy < -0.55) {
      const apex_t = (yy + 1) / 0.45;
      rad = 0.45 * Math.pow(apex_t, 0.65);
    } else if (yy < 0.45) {
      const mid_t = (yy + 0.55) / 1.0;
      rad = 0.62 + 0.42 * Math.sin(mid_t * Math.PI); // wider middle
    } else {
      const top_t = (yy - 0.45) / 0.55;
      rad = 0.92 - 0.5 * top_t;
    }

    // Right-ventricle thinning (anatomical right is on +X side here)
    if (Math.cos(phi) > 0) rad *= 0.85;

    // ATRIOVENTRICULAR GROOVE — deeper, more visible chamber separation
    const av = 1 - 0.22 * Math.exp(-Math.pow((yy - 0.32) * 5, 2));
    rad *= av;

    // INTER-VENTRICULAR SULCUS — pronounced vertical furrow on front face
    if (yy < 0.3) {
      const ivsProx = Math.exp(-Math.pow((phi - Math.PI / 2) * 2.5, 2));
      rad *= 1 - 0.16 * ivsProx;
    }

    // Surface bias — most on chamber wall, fewer interior
    if (Math.random() < 0.22) rad *= 0.3 + 0.6 * Math.random();

    const SCALE = 78; // 2.6× previous
    let x = rad * Math.cos(phi) * SCALE;
    let y = yy * SCALE;
    const z = rad * Math.sin(phi) * SCALE * 0.78;

    // Tilt -25° around Z so apex points down-left (anatomical orientation)
    const tilt = (-25 * Math.PI) / 180;
    const tx = x * Math.cos(tilt) - y * Math.sin(tilt);
    const ty = x * Math.sin(tilt) + y * Math.cos(tilt);
    return [tx, ty, z];
  } else if (r < 0.84) {
    // 2. AORTIC ARCH — much larger and thicker; the iconic curved tube
    const t = Math.random();
    const arcAngle = Math.PI * 0.7 * t; // 0..126° sweep
    const arcRadius = 34;     // 2.4× previous
    const cx = -20;
    const cy = 78;            // 2.4× previous

    const ax = cx + Math.sin(arcAngle) * arcRadius;
    const ay = cy + Math.cos(arcAngle) * arcRadius;

    // Thicker tube cross-section
    const tubePhi = Math.random() * Math.PI * 2;
    const tubeR = 9 * Math.pow(Math.random(), 0.5); // 2.1× previous
    const off1 = Math.cos(tubePhi) * tubeR;
    const off2 = Math.sin(tubePhi) * tubeR;
    return [
      ax + Math.cos(arcAngle) * off1,
      ay - Math.sin(arcAngle) * off1,
      off2,
    ];
  } else {
    // 3. VESSEL STUBS — proportionally larger
    const stub = Math.floor(Math.random() * 3);
    const stubs = [
      { x: -8,  y: 92, z: -18, h: 28 }, // SVC ascending
      { x: 18,  y: 84, z: 13,  h: 24 }, // pulmonary trunk
      { x: -34, y: 72, z: 16,  h: 20 }, // aortic root before arch
    ];
    const sp = stubs[stub];
    const phi = Math.random() * Math.PI * 2;
    const tubeR = 7 * Math.pow(Math.random(), 0.5); // 2.2× previous
    const t = Math.random();
    return [
      sp.x + Math.cos(phi) * tubeR,
      sp.y + t * sp.h,
      sp.z + Math.sin(phi) * tubeR,
    ];
  }
}

function cellPos(): [number, number, number] {
  /* Cell — five distinct, structured regions instead of a fade:
       1. Nucleus (16%)      — dense central sphere, clearly bounded
       2. Nucleolus (4%)     — denser inner spot inside the nucleus
       3. Mitochondria (18%) — six bean-shaped clusters orbiting the nucleus
       4. Cytoplasm (52%)    — fills the cell body
       5. Membrane (10%)     — undulating shell at the boundary
     Each region is clearly readable instead of blending into the next. */
  const r = Math.random();
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 2 - 1);

  if (r < 0.16) {
    // 1. NUCLEUS — clearly defined dense sphere (2.3× previous)
    const radius = 26 * Math.pow(Math.random(), 0.4);
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    ];
  } else if (r < 0.20) {
    // 2. NUCLEOLUS — small dense spot, off-center inside the nucleus
    const radius = 9 * Math.pow(Math.random(), 0.3);
    return [
      9 + radius * Math.sin(phi) * Math.cos(theta),
      -5 + radius * Math.sin(phi) * Math.sin(theta),
      4 + radius * Math.cos(phi),
    ];
  } else if (r < 0.38) {
    // 3. MITOCHONDRIA — six bean-shaped clusters arranged around the nucleus.
    // Each bean has a long axis and a tube cross-section.
    const numMito = 6;
    const idx = Math.floor(Math.random() * numMito);
    const mAngle = (idx / numMito) * Math.PI * 2 + 0.4;
    const mDist = 75;
    const mcx = Math.cos(mAngle) * mDist;
    const mcy = Math.sin(mAngle) * mDist * 0.85;
    const mcz = (idx % 2 === 0 ? 1 : -1) * 38;

    // Position along the bean's long axis
    const along = (Math.random() - 0.5) * 22;
    const tubePhi = Math.random() * Math.PI * 2;
    const tubeR = 7 * Math.pow(Math.random(), 0.5);
    return [
      mcx + Math.cos(mAngle) * along + Math.cos(tubePhi) * tubeR,
      mcy + Math.sin(mAngle) * along + Math.sin(tubePhi) * tubeR,
      mcz + (Math.random() - 0.5) * tubeR * 1.5,
    ];
  } else if (r < 0.90) {
    // 4. CYTOPLASM — fills cell body (2.2× previous radius)
    const radius = Math.pow(Math.random(), 0.55) * 110;
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    ];
  } else {
    // 5. MEMBRANE — undulating outer shell (2.3× previous)
    const bump = Math.sin(theta * 5) * Math.cos(phi * 4) * 8;
    const radius = 130 + bump;
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    ];
  }
}

function galaxyPos(): [number, number, number] {
  // Spiral galaxy: bulge + 3 logarithmic arms in XZ plane, thin Y disk.
  const r = Math.random();
  if (r < 0.18) {
    // Central bulge
    const radius = 13 * Math.pow(Math.random(), 0.45);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi) * 0.4,
      radius * Math.sin(phi) * Math.sin(theta),
    ];
  } else {
    // Spiral arms
    const arm = Math.floor(Math.random() * 3);
    const armBase = (arm * Math.PI * 2) / 3;
    const dist = 18 + Math.random() * 65;
    const angle =
      armBase + Math.log(dist / 18) * 1.9 + (Math.random() - 0.5) * 0.45;
    const x = dist * Math.cos(angle);
    const z = dist * Math.sin(angle);
    const y = (Math.random() - 0.5) * 5 * Math.exp(-dist / 60);
    return [x, y, z];
  }
}

const FORMS = [helixPos, brainPos, heartPos, cellPos, galaxyPos];

/* ── PLATEAU MORPH CURVE ───────────────────────────────────────────────
   Linear scroll → smeared forms. We want the user to actually SEE
   each form. So we hold pure form for the first 40% and last 40% of
   each segment, transitioning only through the middle 20%.
   Result: ~70% of total scroll is "pure form", ~30% is "morphing". */
function plateauMorph(scroll: number): number {
  const segs = FORM_COUNT - 1; // 4 transitions
  const tot = Math.max(0, Math.min(1, scroll)) * segs;
  const idx = Math.min(segs - 1, Math.floor(tot));
  const t = tot - idx;
  let eased: number;
  if (t < 0.4) eased = 0;
  else if (t > 0.6) eased = 1;
  else {
    const lt = (t - 0.4) / 0.2;
    eased = lt * lt * (3 - 2 * lt); // smoothstep
  }
  return Math.min(segs, idx + eased);
}

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!mountRef.current) return;

    /* ── DEVICE TIERING ──
       Particle budget, pixel-ratio cap, and camera distance are all
       chosen at mount based on viewport width. Phones get a third
       of the desktop count and a tighter pixel-ratio so the GPU
       doesn't melt; camera dollies further back so wider organs
       (brain, heart, cell) fit in the narrower portrait FOV. */
    const isMobile = isMobileViewport();
    const PARTICLE_COUNT = isMobile ? 11000 : 28000;
    const PIXEL_RATIO_CAP = isMobile ? 1.5 : 2;
    const CAM_Z_BASE = isMobile ? 280 : 180;
    const CAM_Z_RANGE = isMobile ? 200 : 160; // dolly distance across full scroll
    const CAM_Z_INTRO = isMobile ? 460 : 320; // intro start position

    /* ── SCENE / CAMERA / RENDERER ─────────────────────────────────── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0009);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, CAM_Z_BASE);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile, // MSAA off on mobile — biggest perf win
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.error('WebGL not supported', e);
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
    mountRef.current.appendChild(renderer.domElement);

    /* ── GENERATE ALL FIVE FORMS ────────────────────────────────────── */
    const formArrays: Float32Array[] = Array.from(
      { length: FORM_COUNT },
      () => new Float32Array(PARTICLE_COUNT * 3)
    );
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const dirs = new Float32Array(PARTICLE_COUNT); // travelling-pulse direction (±1)

    const cCyan = isDark ? new THREE.Color(0x00e5ff) : new THREE.Color(0x2563eb);
    const cViolet = isDark ? new THREE.Color(0xa855f7) : new THREE.Color(0x7c3aed);
    const cMagenta = isDark ? new THREE.Color(0xec4899) : new THREE.Color(0xdb2777);
    const palette = [cCyan, cViolet, cMagenta];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Compute position in EACH form
      for (let f = 0; f < FORM_COUNT; f++) {
        const [x, y, z] = FORMS[f]();
        // tiny organic jitter so nothing reads as "stamped"
        formArrays[f][i3] = x + (Math.random() - 0.5) * 1.5;
        formArrays[f][i3 + 1] = y + (Math.random() - 0.5) * 1.5;
        formArrays[f][i3 + 2] = z + (Math.random() - 0.5) * 1.5;
      }

      // Color + scale + pulse direction (form-independent — assigned once)
      const c = palette[Math.floor(Math.random() * 3)];
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
      scales[i] = 0.7 + Math.random() * 1.3;
      dirs[i] = Math.random() < 0.5 ? -1 : 1;
    }

    /* ── GEOMETRY ─────────────────────────────────────────────────────
       Form 0 lives in `position` (the canonical attribute).
       Forms 1..4 live in `pos1..pos4`. */
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(formArrays[0], 3));
    geometry.setAttribute('pos1', new THREE.BufferAttribute(formArrays[1], 3));
    geometry.setAttribute('pos2', new THREE.BufferAttribute(formArrays[2], 3));
    geometry.setAttribute('pos3', new THREE.BufferAttribute(formArrays[3], 3));
    geometry.setAttribute('pos4', new THREE.BufferAttribute(formArrays[4], 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('pulseDir', new THREE.BufferAttribute(dirs, 1));

    /* ── SHADER ──────────────────────────────────────────────────────
       The vertex shader blends 5 form positions by triangular-hat
       weights derived from uMorph. Then it applies the v3 cohort of
       effects (heartbeat, energy pulse, organic flow, click ripple,
       intro scale). */
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uIsDark: { value: isDark ? 1.0 : 0.0 },
        uMorph: { value: 0 },        // 0..(FORM_COUNT - 1)
        uPulse: { value: 0 },        // cardiac heartbeat
        uClickPulse: { value: 0 },   // click ripple decay
        uColorPhase: { value: 0 },   // aurora hue rotation
        uIntro: { value: 0 },        // entrance scale 0..1
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uMorph;
        uniform float uPulse;
        uniform float uClickPulse;
        uniform float uIntro;

        attribute vec3  pos1;
        attribute vec3  pos2;
        attribute vec3  pos3;
        attribute vec3  pos4;
        attribute float scale;
        attribute vec3  customColor;
        attribute float pulseDir;

        varying vec3  vColor;
        varying float vZ;
        varying float vEnergy;

        void main() {
          // Triangular-hat weights for each form. Sum of weights = 1
          // for any uMorph in [0, FORM_COUNT-1].
          float w0 = max(0.0, 1.0 - abs(uMorph - 0.0));
          float w1 = max(0.0, 1.0 - abs(uMorph - 1.0));
          float w2 = max(0.0, 1.0 - abs(uMorph - 2.0));
          float w3 = max(0.0, 1.0 - abs(uMorph - 3.0));
          float w4 = max(0.0, 1.0 - abs(uMorph - 4.0));

          // Blend the five forms.
          vec3 pos =
            position * w0 +
            pos1     * w1 +
            pos2     * w2 +
            pos3     * w3 +
            pos4     * w4;

          // Travelling energy pulse along Y. pulseDir alternates sign
          // per particle so adjacent points seem to flow in opposite
          // directions — looks like a living signal.
          float wave  = sin(pos.y * 0.06 + uTime * 2.2 * pulseDir) * 0.5 + 0.5;
          float pulse = pow(wave, 9.0);
          vEnergy = pulse;

          // Cardiac heartbeat — drives a global radial bulge.
          float beat = pow(sin(uTime * 1.4) * 0.5 + 0.5, 4.0) * uPulse;

          // Organic flow noise (kept subtle so morph stays readable).
          float flow = sin(pos.y * 0.04 + uTime * 0.55) * 1.2;
          pos.x += cos(pos.y * 0.02 + uTime * 0.6) * flow;
          pos.z += sin(pos.y * 0.02 + uTime * 0.6) * flow;

          // Heartbeat radial bulge.
          pos.xz *= 1.0 + beat * 0.06;

          // Click shockwave — radial impulse that travels outward.
          float distFromCenter = length(pos);
          float shock = sin(distFromCenter * 0.06 - uTime * 6.0) *
                        exp(-distFromCenter * 0.005);
          pos += normalize(pos + vec3(0.0001)) * shock * uClickPulse * 8.0;

          // Intro scale — particles materialise from a tiny core.
          pos *= mix(0.05, 1.0, uIntro);

          vColor = customColor;
          vColor += vec3(pulse * 0.6 + beat * 0.15);

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vZ = -mv.z;
          gl_Position = projectionMatrix * mv;

          float sizeBoost = 1.0 + pulse * 1.6 + beat * 0.3 + uClickPulse * 1.0;
          gl_PointSize = scale * uPixelRatio * (260.0 / vZ) * sizeBoost;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uIsDark;
        uniform float uColorPhase;
        varying vec3  vColor;
        varying float vZ;
        varying float vEnergy;

        // Hue rotation matrix — drives the aurora color flow.
        vec3 shiftHue(vec3 c, float a) {
          float ang = a * 6.2831853;
          float s = sin(ang), co = cos(ang);
          mat3 m = mat3(
            0.299 + 0.701 * co + 0.168 * s,  0.587 - 0.587 * co + 0.330 * s,  0.114 - 0.114 * co - 0.497 * s,
            0.299 - 0.299 * co - 0.328 * s,  0.587 + 0.413 * co + 0.035 * s,  0.114 - 0.114 * co + 0.292 * s,
            0.299 - 0.300 * co + 1.250 * s,  0.587 - 0.588 * co - 1.050 * s,  0.114 + 0.886 * co - 0.203 * s
          );
          return clamp(m * c, 0.0, 1.0);
        }

        void main() {
          vec2 xy = gl_PointCoord.xy - 0.5;
          float l = length(xy);
          if (l > 0.5) discard;

          float core = pow(smoothstep(0.5, 0.0, l), 1.6);
          float depthFade = smoothstep(500.0, 40.0, vZ);
          float halo = exp(-l * 4.0) * vEnergy * 1.2;

          vec3 col = shiftHue(vColor, uColorPhase * 0.18);
          float baseOpacity = mix(0.6, 0.95, uIsDark);

          gl_FragColor = vec4(col * (1.0 + halo), (core + halo * 0.4) * depthFade * baseOpacity);
        }
      `,
      transparent: true,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const dna = new THREE.Points(geometry, material);
    scene.add(dna);
    dna.rotation.z = Math.PI * 0.1;
    dna.rotation.x = Math.PI * 0.08;

    /* ── MOUSE PARALLAX (peachweb damping) ─────────────────────────── */
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    /* ── CLICK RIPPLE ──────────────────────────────────────────────── */
    const onClick = () => {
      gsap.killTweensOf(material.uniforms.uClickPulse);
      material.uniforms.uClickPulse.value = 1;
      gsap.to(material.uniforms.uClickPulse, {
        value: 0,
        duration: 1.4,
        ease: 'expo.out',
      });
    };
    document.addEventListener('click', onClick);

    /* ── HEARTBEAT (lub-dub on loop) ───────────────────────────────── */
    const heartbeat = gsap.timeline({
      repeat: -1,
      defaults: { ease: 'power3.out' },
    });
    heartbeat
      .to(material.uniforms.uPulse, { value: 1.0, duration: 0.10 })
      .to(material.uniforms.uPulse, { value: 0.0, duration: 0.16, ease: 'power3.in' })
      .to(material.uniforms.uPulse, { value: 0.65, duration: 0.10 })
      .to(material.uniforms.uPulse, { value: 0.0, duration: 0.30, ease: 'power3.in' })
      .to({}, { duration: 0.55 });

    /* ── INTRO ─────────────────────────────────────────────────────── */
    gsap.fromTo(material.uniforms.uIntro, { value: 0 }, { value: 1, duration: 2.6, ease: 'expo.out' });
    gsap.fromTo(dna.rotation, { y: -Math.PI * 1.2 }, { y: 0, duration: 3.2, ease: 'power3.out' });
    gsap.fromTo(camera.position, { z: CAM_Z_INTRO }, { z: CAM_Z_BASE, duration: 3.2, ease: 'power3.out' });

    /* ── SCROLL → MORPH ─────────────────────────────────────────────
       Drives uMorph through the plateau curve so each form gets a
       moment to be seen clearly. Also dollies the camera back as
       later forms (heart, galaxy) span more space.
       Color phase rotates the palette across the full scroll.

       NOTE: We use ScrollTrigger.create + onUpdate (not a tween-on-
       timeline) because plateauMorph isn't a linear function — we
       want non-linear control over the scroll-to-morph mapping. */
    const scrollST = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const morph = plateauMorph(self.progress);
        // Tween toward target so even fast scrolls look fluid.
        gsap.to(material.uniforms.uMorph, {
          value: morph,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(material.uniforms.uColorPhase, {
          value: self.progress,
          duration: 0.6,
          overwrite: 'auto',
        });
        // Camera dolly: helix sits closer; galaxy needs distance.
        gsap.to(camera.position, {
          z: CAM_Z_BASE + self.progress * CAM_Z_RANGE,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      },
    });

    /* ── RENDER LOOP ───────────────────────────────────────────────── */
    const clock = new THREE.Clock();
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      material.uniforms.uTime.value = clock.getElapsedTime();

      // Damped pointer (peachweb feel)
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;

      // Slow idle Y rotation (camera-relative spin)
      dna.rotation.y += 0.0018;
      // Mouse-driven X tilt only — Y/Z owned by intro + scroll
      dna.rotation.x = Math.PI * 0.08 + current.y * 0.28;

      // Camera X/Y parallax (scroll owns Z)
      camera.position.x += (current.x * 22 - camera.position.x) * 0.04;
      camera.position.y += (-current.y * 22 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    /* ── RESIZE ────────────────────────────────────────────────────── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    /* ── CLEANUP ───────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(animId);
      heartbeat.kill();
      scrollST.kill();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('click', onClick);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: isDark ? 'screen' : 'normal' }}
    />
  );
}
