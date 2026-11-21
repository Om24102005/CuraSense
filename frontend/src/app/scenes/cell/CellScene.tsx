/* The landing page's living cell: one continuous shot driven by scroll.
   Fixed behind the page, never takes pointer events, paused when the tab is hidden. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { isPhone, type DeviceTier } from '../../animations/deviceTier';
import { Cilia, Constellation, Golgi, Membrane, Mitochondria, Motes, Nucleus, ROI_POS, Scan, Strand, Streams, Vesicles, type Quality } from './parts';
import { Halo, Plasma } from './neon';
import { sampleKey, stageFromScroll } from './stages';
import { makeUniforms, type U } from './uniforms';
import { frameBudgetMs } from '../../animations/frameRate';

const QUALITY: Record<'high' | 'mid' | 'phone', Quality & { dpr: [number, number]; post: boolean }> = {
  high:  { seg: [160, 110], mito: 22, vesicles: 140, cilia: 360, motes: 2200, nodes: 64, rays: 30, hq: true, dpr: [1, 1.75], post: true },
  mid:   { seg: [96, 64],   mito: 12, vesicles: 70,  cilia: 150, motes: 1100, nodes: 40, rays: 16, hq: false, dpr: [1, 1], post: false },
  // Same scene as 'mid' on a phone's sharper screen: up to 1.5x (the resolution governor below steps it down when frames run late).
  phone: { seg: [96, 64],   mito: 12, vesicles: 70,  cilia: 150, motes: 1100, nodes: 40, rays: 16, hq: false, dpr: [1, 1.5], post: false },
};

/* Labels pinned to 3D points. All text is the landing page's own copy. Anchors are cell-local. */
interface Callout { stage: number; at: () => THREE.Vector3; title: string; sub: string; color: string; side?: 'l' | 'r' }
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export const CALLOUTS: Callout[] = [
  { stage: 4, at: () => v3(...ROI_POS), title: 'ROI · 0.87', sub: 'region of interest', color: '#ec4899' },
];

type FxRefs = { bloom: { intensity: number } | null; ca: { offset: THREE.Vector2 } | null; composer: { setSize: (w?: number, h?: number) => void } | null };

/* Resolution governor. A busy GPU can't keep up with pixels, so under sustained load trade resolution, never the look, and win it
   back when there is room. Quality tiers used to flip at runtime: one transient hiccup (another app, a test run, a background tab)
   then left the cell without bloom and at 1x until reload. Mean of 60 frames minus the 3 worst, so one shader-compile hitch can't
   trip it but steady judder (every third frame late) does. */
const GOV_FRAMES = 60, GOV_MIN_DPR = 1, GOV_SLOW = 1.11, GOV_FAST = 1.03;   // as multiples of one frame at the screen's own refresh rate
const SLOW_MS = 50;   // slow mode: one frame per 50 ms

/* DEV ONLY (stripped from production): a rolling record of what drives the cell's shape and timing, so a glitch that only shows
   on one machine can be measured there. In the browser console: copy(JSON.stringify(__csReport(15))). The answer is one short line
   ([min, max] per driver) so a paste can't be cut off; ev counts what happened in the window (resize, focus, GPU context loss...). */
const REC = { n: 0, cap: 7200, d: new Float32Array(import.meta.env.DEV ? 7200 * 10 : 0), ev: [] as [number, string][] };
if (import.meta.env.DEV && typeof window !== 'undefined') {
  const note = (k: string) => () => { REC.ev.push([performance.now(), k]); if (REC.ev.length > 4000) REC.ev.splice(0, 1000); };
  for (const k of ['scroll', 'resize', 'focus', 'blur']) addEventListener(k, note(k), { passive: true });
  addEventListener('pointermove', note('move'), { passive: true });
  addEventListener('pointerdown', note('down'), { passive: true });
  document.addEventListener('visibilitychange', note('vis'));
  for (const k of ['webglcontextlost', 'webglcontextrestored']) addEventListener(k, note(k), true);   // these don't bubble: capture from window
  (window as unknown as { __csReport: (sec?: number) => unknown }).__csReport = (sec = 15) => {
    const now = performance.now(), from = REC.n - Math.min(REC.n, Math.round(sec * 60));
    const col = (j: number) => { const v: number[] = []; for (let i = from; i < REC.n; i++) v.push(REC.d[(i % REC.cap) * 10 + j]); return v; };
    const rng = (v: number[], p = 3) => [+Math.min(...v).toFixed(p), +Math.max(...v).toFixed(p)];
    const dts = col(1), tm = col(9), skew: number[] = [], ev: Record<string, number> = {};
    for (let i = 1; i < tm.length; i++) skew.push(tm[i] - tm[i - 1] - dts[i]);
    REC.ev.forEach(([tt, k]) => { if (now - tt < sec * 1000) ev[k] = (ev[k] || 0) + 1; });
    const c = document.querySelector('canvas');
    return {
      slow25: dts.filter((x) => x > 0.025).length, dt: rng(dts, 4), ev, skew: rng(skew, 4), s: rng(col(2)), hp: rng(col(5)), bulb: rng(col(7)),
      poke: rng(col(6)), stretch: rng(col(4)), dpr: rng(col(8)), scrollY: rng(col(3), 0), time: rng(tm, 1), w: c?.width, h: c?.height,
      tier: document.documentElement.dataset.tier, hidden: document.hidden, webdriver: navigator.webdriver,
    };
  };
}

/* Neon power-on for the dark theme: one smooth rise, no flashing (the stutter it used to have read as a glitch), then a steady hum. */
const IGNITE: [number, number][] = [[0, 0], [0.5, 0.5], [1.15, 1]];
function ignite(age: number) {
  if (age <= 0) return 0;
  if (age >= 1.15) return 0.98 + 0.02 * Math.sin(age * 2.3);
  for (let i = 1; i < IGNITE.length; i++) {
    if (age > IGNITE[i][0]) continue;
    const [a0, v0] = IGNITE[i - 1], [a1, v1] = IGNITE[i], k = (age - a0) / (a1 - a0);
    return v0 + (v1 - v0) * k * k * (3 - 2 * k);
  }
  return 1;
}

function World({ u, q, light, frozen, slow, ready, labels, fx, veil, onDpr }: {
  u: U; q: Quality & { post: boolean }; light: boolean; frozen: boolean; slow: boolean; ready: boolean; onDpr: (dpr: number) => void;
  labels: React.MutableRefObject<(HTMLDivElement | null)[]>; fx: React.MutableRefObject<FxRefs>; veil: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const group = useRef<THREE.Group>(null);
  const neon = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  const dprNow = useThree((st) => st.viewport.dpr);
  const S = useRef({ s: 0, dir: 1, vel: 0, time: frozen ? 3 : 0, fall: 0, px: 0, py: 0, tx: 0, ty: 0, ripple: 99, ready: false, introAt: -1, on: false, igniteAt: 0, first: true });
  const gov = useRef({ dts: [] as number[], cap: 0, changedAt: 0, wait: 10000, grew: false });
  const tmp = useMemo(() => ({ v: new THREE.Vector3(), fwd: new THREE.Vector3(), hit: new THREE.Vector3(), q: new THREE.Quaternion(), pk: new THREE.Vector3(), dir: new THREE.Vector3(0, 0, 1) }), []);
  const anchors = useMemo(() => CALLOUTS.map((c) => c.at()), []);

  // whoever changed the resolution (the governor, a window resize), point sizes and the composer's buffers must follow it
  useEffect(() => { u.uPx.value = dprNow; fx.current.composer?.setSize(); }, [dprNow, u, fx]);

  // Slow mode (the sign-in dialog's backdrop blur sits on top and is re-blurred for every frame drawn): the scene keeps moving, but
  // asks for about 20 frames a second instead of one per screen refresh.
  useEffect(() => {
    if (!slow || frozen) return;
    const id = setInterval(invalidate, SLOW_MS);
    return () => clearInterval(id);
  }, [slow, frozen, invalidate]);

  // Reduced motion renders on demand: a theme or readiness change must ask for its own frame,
  // otherwise the shaders keep the previous theme's uniforms until the next scroll.
  useEffect(() => { if (frozen) invalidate(); }, [frozen, light, ready, invalidate]);

  // Reduced motion renders on demand, so scrolling asks for the next frame.
  useEffect(() => {
    if (!frozen) return;
    const f = () => invalidate();
    addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, [frozen, invalidate]);

  useEffect(() => {
    if (frozen) return;
    const move = (e: PointerEvent) => { S.current.tx = (e.clientX / innerWidth) * 2 - 1; S.current.ty = -((e.clientY / innerHeight) * 2 - 1); };
    const down = () => { S.current.ripple = 0; u.uRipple.value.set(tmp.dir.x, tmp.dir.y, tmp.dir.z, 0); };
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerdown', down, { passive: true });
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerdown', down); };
  }, [frozen, u, tmp]);

  useFrame((state, rawDt) => {
    const st = S.current, cam = state.camera as THREE.PerspectiveCamera, g = group.current;
    if (!g) return;
    const dt = Math.min(rawDt, 0.05);
    if (!frozen) st.time += dt;

    // intro: once the boot sequence is done the camera glides in and the cell lights up.
    // Wall-clock, not frame time: a slow GPU must not leave the cell unlit for ten seconds.
    const now = performance.now();
    if (ready && st.introAt < 0) st.introAt = now;

    // resolution governor (off under automation, during the intro, and while the tab is hidden)
    const gv = gov.current, cur = state.viewport.dpr;
    if (!gv.cap) gv.cap = Math.min(Math.max(devicePixelRatio, q.dpr[0]), q.dpr[1]);   // the ceiling, not whatever it is right now
    if (!frozen && !slow && ready && gv.cap > GOV_MIN_DPR && !navigator.webdriver && !document.hidden && now - st.introAt > 4000) {
      gv.dts.push(rawDt);
      if (gv.dts.length >= GOV_FRAMES) {
        const kept = gv.dts.sort((a, b) => a - b).slice(0, GOV_FRAMES - 3);
        const avg = kept.reduce((t, d) => t + d, 0) / kept.length;
        gv.dts.length = 0;
        let next = cur;
        const frame = frameBudgetMs() / 1000;   // 16.7 ms on a 60 Hz screen, 8.3 ms on a 120 Hz one
        if (avg > frame * GOV_SLOW) next = Math.max(GOV_MIN_DPR, cur * 0.85);
        else if (avg < frame * GOV_FAST && now - gv.changedAt > gv.wait) next = Math.min(gv.cap, cur * 1.15);
        if (Math.abs(next - cur) > 0.01 && now - gv.changedAt > 2500) {
          if (next < cur && gv.grew) gv.wait = Math.min(gv.wait * 2, 240000);   // a step up that had to be undone: wait longer before trying again
          gv.grew = next > cur;
          gv.changedAt = now;
          onDpr(next);
        }
      }
    } else gv.dts.length = 0;
    const ip = frozen ? 1 : ready ? Math.min(1, (now - st.introAt) / 3400) : 0;
    const ie = 1 - Math.pow(1 - ip, 3);
    const aspect = state.size.width / state.size.height;

    // scroll → smoothed stage index, velocity, direction
    const target = stageFromScroll();
    if (target !== null) {
      const d = target - st.s;
      if (!st.ready) { st.s = target; st.ready = true; }
      else st.s = frozen ? target : st.s + d * (1 - Math.exp(-dt * 4.2));
      const v = frozen ? 0 : d * 2.2;
      st.vel += (v - st.vel) * Math.min(1, dt * 6);
      if (Math.abs(d) > 0.004) st.dir += (Math.sign(d) - st.dir) * Math.min(1, dt * 6);
    }
    const k = sampleKey(st.s);
    const af = THREE.MathUtils.clamp((aspect - 0.9) / 0.7, 0, 1);
    const fit = THREE.MathUtils.clamp((aspect + 0.35) / 1.35, 0.6, 1);

    st.px += (st.tx - st.px) * Math.min(1, dt * 3); st.py += (st.ty - st.py) * Math.min(1, dt * 3);

    // camera
    const dolly = (1 - ie) * 6 * (1 - Math.min(1, st.s));
    cam.position.set(k.cx + st.px * 0.35, k.cy + st.py * 0.22, k.cz + dolly);
    cam.lookAt(k.lx, k.ly, k.lz);
    if (Math.abs(cam.fov - k.fov) > 0.01) { cam.fov = k.fov; cam.updateProjectionMatrix(); }

    // cell transform
    const portraitLift = (1 - af) * 1.2 * (1 - THREE.MathUtils.smoothstep(st.s, 1, 2));
    g.position.set(k.px * af, k.py + portraitLift, k.pz);
    g.scale.setScalar(k.sc * fit);
    g.rotation.set(st.py * 0.1, k.ry + st.time * 0.045 + st.px * 0.2, 0);
    g.updateMatrixWorld(true); cam.updateMatrixWorld(true);

    // pointer → direction on the cell, for the membrane to reach toward the cursor
    tmp.v.set(st.px, st.py, 0.5).unproject(cam).sub(cam.position).normalize();
    cam.getWorldDirection(tmp.fwd);
    const denom = tmp.v.dot(tmp.fwd);
    if (Math.abs(denom) > 1e-4) {
      const t = tmp.hit.copy(g.position).sub(cam.position).dot(tmp.fwd) / denom;
      tmp.hit.copy(cam.position).addScaledVector(tmp.v, t).sub(g.position);
      const dist = tmp.hit.length() / (2.4 * g.scale.x);
      tmp.q.copy(g.quaternion).invert();
      tmp.hit.applyQuaternion(tmp.q).normalize();
      const strength = (dist < 1 ? 0.75 + 0.25 * dist : Math.exp(-Math.pow((dist - 1) * 1.6, 2))) * (frozen ? 0 : 1);
      tmp.dir.lerp(tmp.hit, Math.min(1, dt * 8)).normalize();
      tmp.pk.copy(tmp.dir).multiplyScalar(strength);
      u.uPoke.value.lerp(tmp.pk, Math.min(1, dt * 5));
    }
    if (st.ripple < 90) { st.ripple += dt; u.uRipple.value.w = st.ripple; }

    // uniforms
    const lt = light ? 1 : 0;
    u.uLight.value = frozen ? lt : u.uLight.value + (lt - u.uLight.value) * Math.min(1, dt * 5);   // on-demand frames can't ease
    // dark theme: the neon switches on like a bulb at load and again whenever the theme turns dark
    const lit = ready && !light;
    if (lit && !st.on) { st.igniteAt = now + (st.first ? 700 : 0); st.first = false; }
    st.on = lit;
    const bulb = !lit ? 0 : frozen ? 1 : ignite((now - st.igniteAt) / 1000);
    u.uBulb.value = frozen ? bulb : u.uBulb.value + (bulb - u.uBulb.value) * Math.min(1, dt * (bulb > u.uBulb.value ? 40 : 8));
    if (neon.current) neon.current.visible = (1 - u.uLight.value) * u.uBulb.value > 0.004;   // light theme pays nothing for the plasma
    u.uEnv.value.set(st.px * 0.7, st.py * 0.25);
    u.uRes.value.set(state.size.width * cur, state.size.height * cur);
    u.uTime.value = st.time;
    u.uAmp.value = k.amp; u.uHealth.value = THREE.MathUtils.clamp(k.hp, 0, 1); u.uOpacity.value = THREE.MathUtils.clamp(k.op, 0, 1);
    u.uNuc.value = k.nu + k.st * k.st * (0.25 + 0.25 * Math.sin(st.time * 3));
    u.uScanOn.value = THREE.MathUtils.clamp(k.sn, 0, 1); u.uScanY.value = Math.sin(st.time * 0.55) * 2.0;
    u.uStreams.value = THREE.MathUtils.clamp(k.st, 0, 1); u.uStrand.value = THREE.MathUtils.clamp(k.sr, 0, 1);
    u.uConst.value = THREE.MathUtils.clamp(k.co, 0, 1.05);
    u.uHead.value = (st.time * 0.04 + st.s * 0.35) % 1;
    u.uStretch.value = THREE.MathUtils.clamp(st.vel * 0.05, -0.12, 0.12);
    if (!frozen) st.fall += (st.vel * 3.4 + 0.15) * dt;
    u.uFall.value = st.fall;
    u.uExposure.value = Math.max(0.05, k.ex) * ie; u.uOrg.value = THREE.MathUtils.clamp(k.og, 0, 1);
    if (veil.current) veil.current.style.opacity = String(THREE.MathUtils.clamp(k.vl, 0, 1));
    u.uFocus.value = k.fo; u.uBokeh.value = Math.max(0, k.bk);

    if (import.meta.env.DEV) {
      const o = (REC.n % REC.cap) * 10; REC.d[o] = now; REC.d[o + 1] = rawDt; REC.d[o + 2] = st.s; REC.d[o + 3] = scrollY; REC.d[o + 4] = u.uStretch.value;
      REC.d[o + 5] = u.uHealth.value; REC.d[o + 6] = u.uPoke.value.length(); REC.d[o + 7] = u.uBulb.value; REC.d[o + 8] = cur; REC.d[o + 9] = st.time; REC.n++;
      // GL errors stick until read, so one read a second catches a draw or buffer upload that failed silently (1282 invalid op, 1285 out of memory)
      if (REC.n % 60 === 0) { const e = state.gl.getContext().getError(); if (e) REC.ev.push([now, `glerr${e}`]); }
    }

    const f = fx.current;
    if (f.bloom) f.bloom.intensity = (Math.max(0, k.gl) * Math.min(1, k.ex + 0.2) + (1 - ie) * 0.4) * (light ? 0.2 : 0.3 + 0.12 * u.uBulb.value);
    if (f.ca) f.ca.offset.set(0.0002 + Math.max(0, k.ca) * 0.001, 0.0003 + Math.max(0, k.ca) * 0.001);

    // callouts
    const w = state.size.width, h = state.size.height;
    for (let i = 0; i < CALLOUTS.length; i++) {
      const el = labels.current[i];
      if (!el) continue;
      const c = CALLOUTS[i];
      const bump = Math.max(0, 1 - Math.abs(st.s - c.stage) / 0.5);
      if (bump <= 0.01) { el.style.opacity = '0'; continue; }
      tmp.v.copy(anchors[i]).applyMatrix4(g.matrixWorld).project(cam);
      const vis = tmp.v.z < 1 && tmp.v.z > -1 && Math.abs(tmp.v.x) < 1.15 && Math.abs(tmp.v.y) < 1.15 ? 1 : 0;
      el.style.opacity = String(bump * vis * (1 - Math.min(1, Math.abs(st.vel) * 0.35)));
      el.style.transform = `translate3d(${(tmp.v.x * 0.5 + 0.5) * w}px, ${(-tmp.v.y * 0.5 + 0.5) * h}px, 0)`;
    }
  });

  return (
    <>
      <Motes u={u} count={q.motes} />
      <Strand u={u} />
      <group ref={group}>
        <group ref={neon} visible={false}>
          <Halo u={u} />
          <Plasma u={u} count={q.rays} />
        </group>
        <Streams u={u} />
        <Constellation u={u} count={q.nodes} />
        <Golgi u={u} />
        <Mitochondria u={u} count={q.mito} />
        <Vesicles u={u} count={q.vesicles} />
        <Nucleus u={u} q={q} />
        <Membrane u={u} q={q} />
        <Cilia u={u} count={q.cilia} />
        <Scan u={u} />
      </group>
      {/* multisampling must stay 0: an MSAA half-float buffer drops the additive glow on real GPUs (Apple/ANGLE Metal),
          leaving a dark silhouette and no particles. Software GL hides it, so check changes here on a real GPU. */}
      {q.post && (
        <EffectComposer multisampling={0} ref={(r) => { fx.current.composer = r as unknown as FxRefs['composer']; }}>
          <Bloom ref={(r) => { fx.current.bloom = r as unknown as FxRefs['bloom']; }} mipmapBlur intensity={0.9} luminanceThreshold={0.4} luminanceSmoothing={0.5} radius={0.72} />
          <ChromaticAberration ref={(r) => { fx.current.ca = r as unknown as FxRefs['ca']; }} offset={new THREE.Vector2(0.0002, 0.0003)} radialModulation modulationOffset={0.25} />
        </EffectComposer>
      )}
    </>
  );
}

function Callouts({ labels }: { labels: React.MutableRefObject<(HTMLDivElement | null)[]> }) {
  return (
    <div aria-hidden className="cs-inset" style={{ position: 'fixed', inset: 0, zIndex: 35, pointerEvents: 'none', overflow: 'hidden' }}>
      {CALLOUTS.map((c, i) => (
        <div key={i} ref={(el) => { labels.current[i] = el; }} className="cs-callout" style={{ position: 'absolute', left: 0, top: 0, opacity: 0, willChange: 'transform, opacity' }}>
          <i className="cs-callout-dot" style={{ background: c.color, boxShadow: `0 0 0 4px ${c.color}33, 0 0 18px ${c.color}` }} />
          <span className="cs-callout-line" style={{ background: `linear-gradient(${c.side === 'l' ? 270 : 90}deg, ${c.color}, transparent)`, [c.side === 'l' ? 'right' : 'left']: 6 }} />
          <div className="cs-callout-label" style={{ [c.side === 'l' ? 'right' : 'left']: 46, borderColor: `${c.color}66` }}>
            <b style={{ color: c.color }}>{c.title}</b>
            <small>{c.sub}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CellScene({ tier, light, frozen, hidden, slow = false, ready }: { tier: DeviceTier; light: boolean; frozen: boolean; hidden: boolean; slow?: boolean; ready: boolean }) {
  const q = QUALITY[tier === 'high' ? 'high' : isPhone() ? 'phone' : 'mid'];   // fixed for the session: the governor above only scales resolution
  const [dprMax, setDprMax] = useState(q.dpr[1]);
  const u = useMemo(makeUniforms, []);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const fx = useRef<FxRefs>({ bloom: null, ca: null, composer: null });
  const veil = useRef<HTMLDivElement | null>(null);
  return (
    <>
      {/* cs-inset: in the app the page content starts below the notch / status bar, so the cell moves down with it and keeps its composition (native.css) */}
      <div aria-hidden data-page-scene="welcome" className="cs-inset" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Canvas
          dpr={[q.dpr[0], dprMax]}
          frameloop={hidden ? 'never' : frozen || slow ? 'demand' : 'always'}
          camera={{ position: [0, 0.15, 10.5], fov: 38, near: 0.05, far: 60 }}
          gl={{ antialias: !q.post, alpha: true, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'none' }}
        >
          <World u={u} q={q} light={light} frozen={frozen} slow={slow} ready={ready} labels={labels} fx={fx} veil={veil} onDpr={setDprMax} />
        </Canvas>
        {/* calms the scene behind dense copy; colour follows the theme */}
        <div ref={veil} style={{ position: 'absolute', inset: 0, opacity: 0, background: light ? 'radial-gradient(ellipse at 50% 45%, rgba(240,246,255,.92), rgba(240,246,255,.55) 70%, rgba(240,246,255,.35))' : 'radial-gradient(ellipse at 50% 45%, rgba(4,8,20,.9), rgba(4,8,20,.55) 70%, rgba(4,8,20,.4))' }} />
      </div>
      <Callouts labels={labels} />
    </>
  );
}
