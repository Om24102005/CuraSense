/* Per-page medical particle scene. Fixed behind the UI, never takes pointer events.
   Lazy-loaded; renders nothing on low-tier devices or without WebGL (aurora backdrop remains). */
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENES, type Cloud, type SceneKey } from './generators';
import { isPhone, useDeviceTier } from '../animations/deviceTier';
import { useReducedMotion } from '../animations/hooks/useReducedMotion';
import CellFallback from './cell/CellFallback';

// The landing page's living cell is its own heavy chunk (post-processing, ~20 shaders).
const CellScene = lazy(() => import('./cell/CellScene'));

const VERT = /* glsl */ `
uniform float uTime, uMode, uBurst, uPx, uSize;
uniform vec2 uPointer, uBurstPos;
uniform vec3 uOffset;
attribute float aSeed, aMix, aKind;
varying float vA; varying float vM;
void main() {
  vec3 p = position; float t = uTime; float a = 1.0;
  if (uMode < 0.5) {
    float b = pow(max(0., sin(t * 2.6)), 8.) * 0.10 + pow(max(0., sin(t * 2.6 - 0.9)), 10.) * 0.05;
    if (aKind < 0.5) { p *= 1. + b; p += normalize(p + 1e-3) * sin(t * 1.3 + aSeed * 20.) * 0.03; }
    else { float d = abs((p.x + 8.) / 16. - fract(t * 0.18)); a *= smoothstep(.25, 0., d) * 1.4 + .08; }
  } else if (uMode < 1.5) {
    float ang = t * .25; float c = cos(ang), s = sin(ang);
    p.xz = mat2(c, -s, s, c) * p.xz; p.y += sin(t + aSeed * 6.) * .04;
  } else if (uMode < 2.5) {
    p.x = mod(p.x + 8. + t * (0.9 + aSeed * 0.8), 16.) - 8.;
    p.y += sin(p.x * .5) * 1.2;
    a *= smoothstep(-8., -6., p.x) * smoothstep(8., 6., p.x);
  } else if (uMode < 3.5) {
    p.y += sin(t * .6 + aSeed * 30.) * .35; p.x += cos(t * .4 + aSeed * 40.) * .2;
  } else if (uMode < 4.5) {
    p *= 1. + sin(t * .8) * .03 + .02 * sin(t * 3. + aSeed * 50.);
    float c = cos(t * .12), s = sin(t * .12); p.xz = mat2(c, -s, s, c) * p.xz;
  } else if (uMode < 5.5) {
    a *= .35 + .65 * pow(.5 + .5 * sin(t * 1.6 + aSeed * 6.28), 3.);
    p += vec3(sin(t * .5 + aSeed * 20.), cos(t * .4 + aSeed * 31.), 0.) * .05;
  }
  vec3 w = p + uOffset;
  vec2 d = w.xy - uPointer * vec2(7.5, 4.2);
  float f = exp(-dot(d, d) * .35);
  p.xy += normalize(d + 1e-4) * f * .9; p.z += f * .6;
  float bt = t - uBurst;
  if (bt > 0. && bt < 3.) {
    vec2 bd = w.xy - uBurstPos;
    float ring = exp(-pow(length(bd) - bt * 6., 2.) * .6) * exp(-bt * 1.1);
    p += normalize(vec3(bd, .4)) * ring * 1.3; a += ring * .8;
  }
  vec4 mv = modelViewMatrix * vec4(p + uOffset, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPx * (9. / -mv.z) * (.5 + aSeed);
  vA = a; vM = aMix;
}`;

const FRAG = /* glsl */ `
uniform vec3 uColA, uColB; uniform float uAlpha;
varying float vA; varying float vM;
void main() {
  #ifdef POINTS
    float d = length(gl_PointCoord - .5);
    float soft = smoothstep(.5, 0., d);
    float al = soft * soft * vA * uAlpha;
  #else
    float al = .16 * vA * uAlpha;
  #endif
  if (al < .003) discard;
  gl_FragColor = vec4(mix(uColA, uColB, vM), al);
}`;

function useMaterial(points: boolean, light: boolean) {
  return useMemo(() => {
    const m = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
      blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
      defines: points ? { POINTS: '' } : {},
      uniforms: {
        uTime: { value: 0 }, uMode: { value: 0 }, uBurst: { value: -10 }, uPx: { value: 1 }, uSize: { value: 2.6 },
        uPointer: { value: new THREE.Vector2() }, uBurstPos: { value: new THREE.Vector2() },
        uOffset: { value: new THREE.Vector3() }, uColA: { value: new THREE.Color() }, uColB: { value: new THREE.Color() },
        uAlpha: { value: 0 },
      },
    });
    return m;
  }, [points, light]);
}

function geometry(c: Cloud) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(c.pos, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(c.seed, 1));
  g.setAttribute('aMix', new THREE.BufferAttribute(c.mix, 1));
  g.setAttribute('aKind', new THREE.BufferAttribute(c.kind, 1));
  return g;
}

function Field({ scene, count, light, frozen }: { scene: Exclude<SceneKey, 'welcome'>; count: number; light: boolean; frozen: boolean }) {
  const spec = SCENES[scene];
  const cloud = useMemo(() => spec.build(count), [spec, count]);
  const pg = useMemo(() => geometry(cloud), [cloud]);
  const lg = useMemo(() => (cloud.lines ? geometry(cloud.lines) : null), [cloud]);
  const pm = useMaterial(true, light), lm = useMaterial(false, light);
  const group = useRef<THREE.Group>(null);
  const ptr = useRef({ x: 3, y: 3, tx: 3, ty: 3 });
  const burst = useRef<{ t: number; x: number; y: number } | null>(null);
  const clock = useRef(frozen ? 2.2 : 0);
  const age = useRef(frozen ? 1 : 0);

  useEffect(() => {
    const move = (e: PointerEvent) => { ptr.current.tx = (e.clientX / innerWidth) * 2 - 1; ptr.current.ty = -((e.clientY / innerHeight) * 2 - 1); };
    const down = (e: PointerEvent) => { burst.current = { t: clock.current, x: ((e.clientX / innerWidth) * 2 - 1) * 7.5, y: -((e.clientY / innerHeight) * 2 - 1) * 4.2 }; };
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerdown', down, { passive: true });
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerdown', down); };
  }, []);

  useEffect(() => () => { pg.dispose(); lg?.dispose(); pm.dispose(); lm.dispose(); }, [pg, lg, pm, lm]);

  useFrame((state, dt) => {
    const p = ptr.current;
    if (!frozen) clock.current += dt;
    age.current = Math.min(1, age.current + dt / 1.4);
    p.x += (p.tx - p.x) * Math.min(1, dt * 4); p.y += (p.ty - p.y) * Math.min(1, dt * 4);
    for (const m of [pm, lm]) {
      const u = m.uniforms;
      u.uTime.value = clock.current; u.uMode.value = spec.mode; u.uPx.value = state.gl.getPixelRatio();
      u.uSize.value = light ? 5.2 : 4.2;
      u.uPointer.value.set(p.x, p.y); u.uOffset.value.set(...spec.offset);
      u.uColA.value.set(light ? new THREE.Color(spec.colA).multiplyScalar(0.7) : spec.colA);
      u.uColB.value.set(light ? new THREE.Color(spec.colB).multiplyScalar(0.7) : spec.colB);
      u.uAlpha.value = (light ? 0.95 : 1) * (1 - Math.pow(1 - age.current, 3));
      if (burst.current) { u.uBurst.value = burst.current.t; u.uBurstPos.value.set(burst.current.x, burst.current.y); }
    }
    if (group.current) {
      const sy = window.scrollY || 0;
      group.current.position.y = sy * 0.0016;
      group.current.rotation.x = -p.y * 0.06 + sy * 0.00004;
      group.current.rotation.y = p.x * 0.1;
    }
  });

  return (
    <group ref={group}>
      <points geometry={pg} material={pm} frustumCulled={false} />
      {lg && <lineSegments geometry={lg} material={lm} frustumCulled={false} />}
    </group>
  );
}

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export default function PageScene({ scene, light, ready = true, paused = false, slow = false }: { scene: SceneKey; light: boolean; ready?: boolean; paused?: boolean; slow?: boolean }) {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(() => document.hidden);
  const [covered, setCovered] = useState(false);   // the opaque analysis page is over this scene: nothing here can be seen
  const ok = useMemo(() => tier !== 'low' && hasWebGL(), [tier]);

  // Stamped here (landing and app both mount PageScene) so liquid-glass.css can drop blur on low tier.
  useEffect(() => { document.documentElement.dataset.tier = tier; }, [tier]);

  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  useEffect(() => {
    const on = (e: Event) => setCovered((e as CustomEvent<boolean>).detail);
    addEventListener('cs:covered', on);
    return () => removeEventListener('cs:covered', on);
  }, []);

  if (scene === 'welcome') {
    return ok
      ? <Suspense fallback={null}><CellScene tier={tier} light={light} frozen={reduced} hidden={hidden || paused} slow={slow} ready={ready} /></Suspense>
      : <CellFallback />;
  }
  if (!ok) return null;
  const count = tier === 'high' ? 9000 : isPhone() ? 2600 : 4200;   // fewer points on a phone: the same picture, a lighter load on its GPU and battery
  return (
    <div aria-hidden data-page-scene={scene} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {/* one Canvas across tabs: remounting it made a new WebGL context on every switch, and iOS allows only a few */}
      <Canvas
        dpr={tier === 'high' ? [1, 1.5] : 1}
        frameloop={hidden || covered ? 'never' : reduced ? 'demand' : 'always'}
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <Field key={scene} scene={scene} count={count} light={light} frozen={reduced} />
      </Canvas>
    </div>
  );
}
