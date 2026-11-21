/* Everything inside the cell: membrane, nucleus + chromatin, mitochondria, Golgi, vesicles, cilia,
   floating motes, and the story props (signal streams, mRNA strand, scan plane, receptor constellation). */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MEMBRANE_FN } from './glsl';
import { KEYS } from './stages';
import { instanced, rng, shader, type U } from './uniforms';

export interface Quality { seg: [number, number]; mito: number; vesicles: number; cilia: number; motes: number; nodes: number; rays: number; hq: boolean }

/** Dispose GPU resources when a part unmounts. */
export function useDispose(...items: ({ dispose(): void } | null | undefined)[]) {
  useEffect(() => () => items.forEach((i) => i?.dispose()), items); // eslint-disable-line react-hooks/exhaustive-deps
}

const TUBE_VS = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){
  vUv = uv;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

/* ───────────────────────────── membrane ───────────────────────────── */

/* Every noise field here varies slowly over the sphere (the finest, at 8 cycles, still spans four vertices), so it is
   evaluated per vertex and interpolated. Evaluated per pixel it was the single biggest GPU cost on the page. */
const MEMBRANE_VS = MEMBRANE_FN + /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vD; varying vec3 vL;
varying vec4 vF;   // x: base mottling, y: vein source (the veins are where this crosses 0), z: hole mask, w: patches
varying vec2 vG;   // neon only: x: pulse phase, y: glass-wall mottling
void main(){
  vec3 d = normalize(position);
  float t = uTime;
  vF = vec4(snoise(d * 2.1 + vec3(0., t * .04, 0.)), snoise(d * 3. + vec3(t * .03, 0., 0.)), snoise(d * 3.2 + 7.3) * .5 + .5,
  #ifdef HQ
            snoise(d * 8. - t * .05));
  #else
            0.);
  #endif
  vG = vec2(snoise(d * 2.), snoise(d * 2.3 + vec3(t * .16, 0., t * .1)) * .5 + .5);
  vec3 ref = abs(d.y) < .95 ? vec3(0., 1., 0.) : vec3(1., 0., 0.);
  vec3 T = normalize(cross(ref, d));
  vec3 B = cross(d, T);
  const float e = .012;
  vec3 p0 = membraneSurf(d);
  vec3 pT = membraneSurf(normalize(d + T * e));
  vec3 pB = membraneSurf(normalize(d + B * e));
  vec3 n = normalize(cross(pT - p0, pB - p0));
  vD = d; vL = p0;
  vN = normalize(mat3(modelMatrix) * n);
  vec4 w = modelMatrix * vec4(p0, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const MEMBRANE_FS = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vD; varying vec3 vL;
varying vec4 vF; varying vec2 vG;
void main(){
  float on = smoothstep(.2, .9, uScanOn);
  if (vL.y > mix(9., uScanY, on)) discard;
  float hole = vF.z;
  float thr = 1.02 - (1. - uHealth) * .62;
  if (hole > thr) discard;
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN);
  // three flips the winding for BackSide materials, so gl_FrontFacing is true there; use a define instead
  #ifdef BACKPASS
  bool back = true;
  #else
  bool back = !gl_FrontFacing;
  #endif
  if (back) N = -N;
  float ndv = clamp(dot(N, V), 0., 1.);
  float fres = pow(1. - ndv, 2.4);
  float t = uTime;
  float n1 = vF.x;
  // veins are where the noise crosses 0. exp(-k|s|) is the same profile as the old pow(1-|s|, 46) and cannot go NaN when the noise
  // overshoots 1 (it reaches 1.037). k is capped so a vein never gets thinner than ~1.3px (it would blink between pixels);
  // wider means dimmer by the same ratio, so the light stays put
  float rk = min(46., .533 / max(fwidth(vF.y), .0001));
  float ridge = exp(-rk * abs(vF.y)) * (rk / 46.);
  float patches = 0.;
  #ifdef HQ
  patches = smoothstep(.35, .9, vF.w);
  #endif
  float ph = ndv * 1.2 + n1 * .3 + t * .015 + (back ? .3 : 0.);
  vec3 irid = .5 + .5 * cos(6.28318 * (ph + vec3(0., .33, .67)));
  irid = mix(irid, CYAN, .35);
  vec3 tint = mix(CYAN, VIOLET, smoothstep(-.5, .7, n1));
  tint = mix(tint, PINK, ridge * .55 + patches * .25);
  tint = mix(SICK, tint, uHealth);
  irid = mix(SICK, irid, uHealth);
  vec3 env = envColor(reflect(-V, N));
  float band = on * exp(-abs(vL.y - uScanY) * 10.);
  float edge = clamp((1. - smoothstep(0., .08, thr - hole)) * (1. - uHealth) * 1.5, 0., 1.);
  vec3 col = tint * (.05 + fres * 1.15) + irid * fres * .6 + env * (.1 + fres * .85) * .55
           + tint * ridge * 1.4 + PINK * patches * .18
           + mix(CYAN, vec3(1.), .4) * band * 2.4 + SICK * edge * 2.6;
  float a = clamp(fres * .9 + .05 + ridge * .6 + patches * .12 + band * .6 + edge * .8, 0., 1.) * uOpacity;
  if (back) { col *= .55; a *= .7; }
  // dark theme: the dome lights from inside like a plasma globe: neon rim, veins carrying light, glass wall mottled by the rays
  float NE = NEON;   // (N is the surface normal here)
  if (NE > .001) {
    vec3 nc = mix(SICK, neonPal(.1 + .45 * (n1 * .5 + .5) + ridge * .25), uHealth);
    float pulse = .5 + .5 * sin(t * .7 + vD.y * 5. + vG.x * 3.);
    float wall = vG.y * vG.y;
    vec3 neon = nc * (fres * .8 + ridge * (.8 + .4 * pulse) + wall * (back ? .35 : .12)) + vec3(1.) * pow(fres, 3.) * .04;
    neon *= back ? .45 : 1.;   // from inside, the far wall must not fog the copy
    col = mix(col, col * .7 + neon, NE);
  }
  gl_FragColor = packOut(col, a);
}`;

export function Membrane({ u, q }: { u: U; q: Quality }) {
  const geo = useMemo(() => new THREE.SphereGeometry(1, q.seg[0], q.seg[1]), [q.seg]);
  const defines: Record<string, string | number> = q.hq ? { HQ: '' } : {};
  const back = useMemo(() => shader(u, MEMBRANE_VS, MEMBRANE_FS, { side: THREE.BackSide, defines: { ...defines, BACKPASS: '' } }), [u, q.hq]); // eslint-disable-line react-hooks/exhaustive-deps
  const front = useMemo(() => shader(u, MEMBRANE_VS, MEMBRANE_FS, { side: THREE.FrontSide, defines }), [u, q.hq]); // eslint-disable-line react-hooks/exhaustive-deps
  useDispose(geo, back, front);
  return (
    <>
      <mesh geometry={geo} material={back} renderOrder={2} frustumCulled={false} />
      <mesh geometry={geo} material={front} renderOrder={9} frustumCulled={false} />
    </>
  );
}

/* ───────────────────────────── nucleus + chromatin ───────────────────────────── */

const NUC_VS = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vD;
void main(){
  vec3 d = normalize(position);
  float t = uTime * .2;
  float k = snoise(d * 2. + t) * .07 + snoise(d * 5. - t) * .02;
  float beat = 1. + .02 * sin(uTime * 1.4) + uNuc * .03;
  vec3 p = d * (.82 + k) * beat;
  vec3 n = normalize(d + vec3(snoise(d * 4. + t), snoise(d * 4. + 7.), snoise(d * 4. + 13.)) * .18);
  vD = d;
  vN = normalize(mat3(modelMatrix) * n);
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const NUC_FS = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vD;
void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  float ndv = clamp(dot(N, V), 0., 1.);
  float fres = pow(1. - ndv, 2.2);
  float pores = smoothstep(.55, .85, snoise(vD * 13.));
  float mott = snoise(vD * 3. + uTime * .05) * .5 + .5;
  vec3 core = mix(vec3(.06, .12, .45), VIOLET * .8, mott * .6);
  vec3 col = core * (.45 + .9 * (1. - fres)) + CYAN * fres * 1.3 + pores * vec3(.6, .9, 1.) * .5
           + envColor(reflect(-V, N)) * .25 * fres;
  col *= .65 + uNuc * 1.1;
  col *= mix(vec3(1., .55, .5), vec3(1.), uHealth);
  // dark theme: the nucleus is the plasma globe's electrode, a hot filament core the rays leave from
  float NE = NEON;
  if (NE > .001) {
    vec3 nc = mix(SICK, neonPal(.62 + .25 * sin(uTime * .3)), uHealth);
    float hum = .88 + .12 * sin(uTime * 2.3) * sin(uTime * .7);
    col = mix(col, col * .5, NE) + NE * hum * (nc * (fres * .7 + .14 + pow(ndv, 2.2) * .5) + vec3(1., .9, 1.) * pow(ndv, 7.) * .1);
  }
  gl_FragColor = packOut(col, .72);
}`;

const CHROMA_FS = /* glsl */ `
uniform float uPhase;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){
  float u = vUv.x;
  float pulse = pow(max(.5 + .5 * sin(u * 80. - uTime * 2.2 + uPhase), 0.), 10.);
  vec3 col = mix(CYAN, VIOLET, u) * (.5 + pulse * 2.4) * (.55 + uNuc);
  col *= mix(vec3(1., .5, .45), vec3(1.), uHealth);
  gl_FragColor = packOut(col, .8);
}`;

export function Nucleus({ u, q }: { u: U; q: Quality }) {
  const shell = useMemo(() => new THREE.SphereGeometry(1, 64, 48), []);
  const knotA = useMemo(() => new THREE.TorusKnotGeometry(0.42, 0.014, q.hq ? 700 : 360, 5, 3, 8), [q.hq]);
  const knotB = useMemo(() => new THREE.TorusKnotGeometry(0.3, 0.012, q.hq ? 520 : 280, 5, 5, 3), [q.hq]);
  const mShell = useMemo(() => shader(u, NUC_VS, NUC_FS), [u]);
  const mA = useMemo(() => shader(u, TUBE_VS, CHROMA_FS, { extra: { uPhase: { value: 0 } } }), [u]);
  const mB = useMemo(() => shader(u, TUBE_VS, CHROMA_FS, { extra: { uPhase: { value: 2.4 } } }), [u]);
  useDispose(shell, knotA, knotB, mShell, mA, mB);
  const g = useRef<THREE.Group>(null);
  useFrame(() => { if (g.current) { g.current.rotation.y = u.uTime.value * 0.07; g.current.rotation.x = u.uTime.value * 0.04; } });
  return (
    <>
      <group ref={g}>
        <mesh geometry={knotA} material={mA} renderOrder={6} frustumCulled={false} />
        <mesh geometry={knotB} material={mB} renderOrder={6} frustumCulled={false} />
      </group>
      <mesh geometry={shell} material={mShell} renderOrder={7} frustumCulled={false} />
    </>
  );
}

/* ───────────────────────────── mitochondria ───────────────────────────── */

const MITO_VS = /* glsl */ `
attribute vec3 aC; attribute vec4 aR;
varying vec3 vN; varying vec3 vW; varying vec3 vP; varying float vFade;
void main(){
  float t = uTime * (.12 + aR.y * .18) + aR.x * 6.283;
  vec3 c = aC * (1. + (1. - uHealth) * .8);
  c += vec3(sin(t * 1.3 + c.y), cos(t * .9 + c.z), sin(t * 1.1 + c.x)) * .22;
  vec3 ax = normalize(vec3(sin(aR.x * 17.), cos(aR.x * 31.), sin(aR.x * 7. + 1.)));
  mat3 Rm = rotAxis(ax, aR.x * 6.283 + uTime * (.12 + aR.y * .2));
  vP = position;
  vec3 p = c + Rm * (position * aR.z);
  vN = normalize(mat3(modelMatrix) * (Rm * normal));
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz;
  vFade = smoothstep(.35, 1.7, distance(cameraPosition, w.xyz));
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const MITO_FS = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vP; varying float vFade;
void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  float ndv = clamp(dot(N, V), 0., 1.);
  float fres = pow(1. - ndv, 2.2);
  float cr = .5 + .5 * sin(vP.y * 36. + snoise(vP * 7.) * 1.6);
  vec3 base = mix(AMBER, PINK, .25 + .25 * sin(vP.y * 5.));
  base = mix(vec3(.55, .2, .22), base, uHealth);
  vec3 col = base * (.22 + .85 * cr * (1. - fres * .6)) + mix(AMBER, PINK, .4) * fres * 1.15
           + envColor(reflect(-V, N)) * .3 * fres;
  col *= .8 + uNuc * .4;
  gl_FragColor = packOut(col * vFade * uOrg, (.6 + fres * .35) * vFade * uOrg);
}`;

export function Mitochondria({ u, count }: { u: U; count: number }) {
  const geo = useMemo(() => {
    const r = rng(5), aC = new Float32Array(count * 3), aR = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const rad = 1.3 + Math.cbrt(r()) * 0.55, a = r() * Math.PI * 2, c = r() * 2 - 1, s = Math.sqrt(1 - c * c);
      aC.set([s * Math.cos(a) * rad, c * rad, s * Math.sin(a) * rad], i * 3);
      aR.set([r(), r(), 0.8 + r() * 0.65, r()], i * 4);
    }
    return instanced(new THREE.CapsuleGeometry(0.085, 0.32, 5, 14), count, { aC: [aC, 3], aR: [aR, 4] });
  }, [count]);
  const mat = useMemo(() => shader(u, MITO_VS, MITO_FS), [u]);
  useDispose(geo, mat);
  return <mesh geometry={geo} material={mat} renderOrder={4} frustumCulled={false} />;
}

/* ───────────────────────────── Golgi ───────────────────────────── */

const GOLGI_VS = /* glsl */ `
attribute float aIdx;
varying vec3 vN; varying vec3 vW; varying vec3 vP;
void main(){
  float k = aIdx;
  vec3 p = position * vec3(1. - k * .09, .075, .75 * (1. - k * .06));
  p.y += p.x * p.x * .5 + (k - 2.5) * .19;
  float a = .6; mat2 r = mat2(cos(a), -sin(a), sin(a), cos(a));
  p.xy = r * p.xy;
  p *= .62;
  p += vec3(1.25, -.5, .55) * (1. + (1. - uHealth) * .4);
  p += vec3(sin(uTime * .2 + k), cos(uTime * .17 + k * 2.), 0.) * .03;
  vec3 n = normalize(normal * vec3(1. / (1. - k * .09), 1. / .075, 1. / .75));
  n.xy = r * n.xy;
  vP = position;
  vN = normalize(mat3(modelMatrix) * n);
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const GOLGI_FS = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vP;
void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  float fres = pow(1. - clamp(dot(N, V), 0., 1.), 2.);
  float s = .5 + .5 * sin(vP.x * 18. + snoise(vP * 5.) * 2.);
  vec3 col = mix(VIOLET, PINK, .3) * (.25 + .6 * s) + VIOLET * fres * 1.2 + envColor(reflect(-V, N)) * .25 * fres;
  col *= mix(vec3(1., .6, .55), vec3(1.), uHealth) * (.8 + uNuc * .3);
  gl_FragColor = packOut(col * uOrg, (.55 + fres * .35) * uOrg);
}`;

export function Golgi({ u }: { u: U }) {
  const geo = useMemo(() => {
    const idx = new Float32Array([0, 1, 2, 3, 4, 5]);
    return instanced(new THREE.SphereGeometry(1, 28, 14), 6, { aIdx: [idx, 1] });
  }, []);
  const mat = useMemo(() => shader(u, GOLGI_VS, GOLGI_FS), [u]);
  useDispose(geo, mat);
  return <mesh geometry={geo} material={mat} renderOrder={3} frustumCulled={false} />;
}

/* ───────────────────────────── vesicles ───────────────────────────── */

const VES_VS = /* glsl */ `
attribute vec3 aC; attribute vec4 aR;
varying vec3 vN; varying vec3 vW; varying float vSel; varying float vFade;
void main(){
  float t = uTime * (.08 + aR.y * .12);
  vec3 c = aC * (1. + (1. - uHealth) * .9);
  c += vec3(sin(t * 5. + aR.x * 20.), cos(t * 4.3 + aR.x * 13.), sin(t * 3.7 + aR.x * 9.)) * .35;
  vec3 p = c + position * aR.z * (1. + .15 * sin(uTime * 2. + aR.x * 30.));
  vSel = aR.w;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz;
  vFade = smoothstep(.3, 1.5, distance(cameraPosition, w.xyz));
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const VES_FS = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying float vSel; varying float vFade;
void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN);
  float ndv = clamp(dot(N, V), 0., 1.);
  float fres = pow(1. - ndv, 2.);
  vec3 c = vSel < .4 ? CYAN : (vSel < .75 ? VIOLET : PINK);
  c = mix(SICK, c, uHealth);
  vec3 col = c * (.2 + fres * 1.4 + (1. - fres) * .25) + envColor(reflect(-V, N)) * fres * .6;
  gl_FragColor = packOut(col * vFade * uOrg, (.35 + fres * .5) * vFade * uOrg);
}`;

export function Vesicles({ u, count }: { u: U; count: number }) {
  const geo = useMemo(() => {
    const r = rng(9), aC = new Float32Array(count * 3), aR = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const rad = 1.0 + Math.cbrt(r()) * 0.9, a = r() * Math.PI * 2, c = r() * 2 - 1, s = Math.sqrt(1 - c * c);
      aC.set([s * Math.cos(a) * rad, c * rad, s * Math.sin(a) * rad], i * 3);
      aR.set([r(), r(), 0.04 + r() * r() * 0.1, r()], i * 4);
    }
    return instanced(new THREE.IcosahedronGeometry(1, 2), count, { aC: [aC, 3], aR: [aR, 4] });
  }, [count]);
  const mat = useMemo(() => shader(u, VES_VS, VES_FS), [u]);
  useDispose(geo, mat);
  return <mesh geometry={geo} material={mat} renderOrder={5} frustumCulled={false} />;
}

/* ───────────────────────────── cilia ───────────────────────────── */

/* A hair thinner than a pixel is only hit by the rasteriser on some frames, so it blinks in and out as it sways. Hairs are
   therefore never drawn thinner than MINPX pixels; the thinner part is faded by the same ratio, so the light stays the same
   and the blinking goes away. */
const CILIA_VS = MEMBRANE_FN + /* glsl */ `
attribute vec3 aDir; attribute vec4 aR;
varying float vY; varying float vSeed; varying float vLy; varying float vFade;
const float MINPX = .85;
void main(){
  vec3 d = aDir;
  vec3 base = membraneSurf(d);
  vec3 ref = abs(d.y) < .95 ? vec3(0., 1., 0.) : vec3(1., 0., 0.);
  vec3 T = normalize(cross(ref, d));
  vec3 B = cross(d, T);
  float h = position.y;
  float N = NEON;
  float len = aR.y * mix(.3, 1., uHealth) * (1. + N * .3);
  float sway = snoise(vec3(aR.x * 40., uTime * .2 + h * 1.2, aR.w * 10.)) * .3;
  vec3 off = (T * sway + B * sway * .6) * h * h;
  // plasma: fast electric jitter along each ray
  off += (T * snoise(vec3(aR.x * 70., uTime * .7 + h * 9., aR.w * 5.)) + B * snoise(vec3(aR.x * 70. + 3., uTime * .8 + h * 9., aR.w * 5. + 2.))) * N * .03 * h;
  vec3 c = base + d * (h * len) + off * len;
  vec3 r = (T * position.x + B * position.z) * aR.z * (1. + N * .7);
  vec4 cc = projectionMatrix * viewMatrix * modelMatrix * vec4(c, 1.);
  float pxr = length(mat3(modelMatrix) * r) * projectionMatrix[1][1] * uRes.y * .5 / max(cc.w, .001);   // radius in pixels
  vFade = min(1., pxr / MINPX);
  vec3 p = c + r * clamp(MINPX / max(pxr, .0001), 1., 8.);   // widen thin parts up to MINPX, never narrow thick ones
  vY = h; vSeed = aR.w; vLy = base.y;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.);
}`;

const CILIA_FS = /* glsl */ `
varying float vY; varying float vSeed; varying float vLy; varying float vFade;
void main(){
  float on = smoothstep(.2, .9, uScanOn);
  if (vLy > mix(9., uScanY, on)) discard;
  float g = pow(max(vY, 0.), 1.5);   // vY is interpolated and can land a hair below 0 at the roots: pow of a negative is NaN
  vec3 c = mix(CYAN, mix(VIOLET, PINK, vSeed), g);
  c = mix(SICK, c, uHealth);
  vec3 col = c * (.3 + g * 1.5);
  float a = .5 * (.3 + g);
  // dark theme: every cilium is a neon plasma ray with energy running base to tip and a white-hot end
  float N = NEON;
  if (N > .001) {
    vec3 nc = mix(SICK, neonPal(vSeed), uHealth);
    float travel = pow(max(.5 + .5 * sin(vY * 16. - uTime * (.6 + vSeed * .7) + vSeed * 60.), 0.), 4.);
    float fl = .97 + .03 * sin(uTime * (1.2 + vSeed * 1.2) + vSeed * 40.);
    vec3 plasma = nc * (.56 + g * .75 + travel * .1) * fl + vec3(1.) * pow(max(vY, 0.), 6.) * .28;
    col = mix(col, plasma, N);
    // Never let alpha reach ~0 beside bright colour: a colour-managed (Display P3) screen drops such pixels, and the bulb hum
    // (N .96-1) pushed alpha across that line every 2.7 s, so every hair vanished and came back.
    a = mix(a, .06, N);
  }
  gl_FragColor = packOut(col * vFade, a * vFade);
}`;

export function Cilia({ u, count }: { u: U; count: number }) {
  const geo = useMemo(() => {
    const r = rng(13), dir = new Float32Array(count * 3), aR = new Float32Array(count * 4);
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2, rad = Math.sqrt(1 - y * y), th = ga * i;
      dir.set([Math.cos(th) * rad, y, Math.sin(th) * rad], i * 3);
      aR.set([r(), 0.22 + r() * 0.34, 0.009 + r() * 0.006, r()], i * 4);
    }
    const cyl = new THREE.CylinderGeometry(0.28, 1, 1, 5, 6, true);
    cyl.translate(0, 0.5, 0);
    return instanced(cyl, count, { aDir: [dir, 3], aR: [aR, 4] });
  }, [count]);
  const mat = useMemo(() => shader(u, CILIA_VS, CILIA_FS, { side: THREE.DoubleSide }), [u]);
  useDispose(geo, mat);
  return <mesh geometry={geo} material={mat} renderOrder={10} frustumCulled={false} />;
}

/* ───────────────────────────── motes (bokeh dust) ───────────────────────────── */

const MOTE_VS = /* glsl */ `
attribute float aSeed;
varying float vA; varying float vCoc; varying float vSeed;
void main(){
  float y = mod(position.y - uFall * (.4 + aSeed * .9) + 8., 16.) - 8.;
  vec3 p = vec3(position.x + sin(uTime * .2 + aSeed * 30.) * .45, y, position.z + cos(uTime * .17 + aSeed * 21.) * .45);
  vec4 mv = viewMatrix * vec4(p, 1.);
  float depth = max(-mv.z, .1);
  float coc = abs(depth - uFocus) / depth * uBokeh;
  vCoc = coc; vSeed = aSeed;
  gl_PointSize = clamp((1.4 + aSeed * 2.0) * (1. + .35 * (1. - uLight)) * uPx * (8. / depth) * (1. + coc * 4.5), 1., 110.);
  vA = (.14 + aSeed * .4) / (1. + coc * 3.6) * smoothstep(.1, 1.2, depth) * step(0., -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const MOTE_FS = /* glsl */ `
varying float vA; varying float vCoc; varying float vSeed;
void main(){
  float r = length(gl_PointCoord - .5) * 2.;
  if (r > 1.) discard;
  float disc = smoothstep(1., .75, r);
  float ring = smoothstep(.62, .88, r) * smoothstep(1., .9, r);
  float f = clamp(vCoc * 1.5, 0., 1.);
  float dot_ = (1. - r) * (1. - r);
  float shape = mix(dot_, disc * .35 + ring * .65, f);
  vec3 col = mix(CYAN, mix(VIOLET, PINK, step(.7, vSeed)), step(.45, vSeed));
  float cov = shape * vA * 1.6;
  gl_FragColor = packOut(col * 1.4 * mix(clamp(cov * 7., 0., 1.), 1., uLight), cov);   // dark theme adds light, so the glow itself must fall off
}`;

export function Motes({ u, count }: { u: U; count: number }) {
  const geo = useMemo(() => {
    const r = rng(21), pos = new Float32Array(count * 3), seed = new Float32Array(count);
    for (let i = 0; i < count; i++) { pos.set([(r() - 0.5) * 24, (r() - 0.5) * 16, (r() - 0.5) * 16], i * 3); seed[i] = r(); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);
  const mat = useMemo(() => shader(u, MOTE_VS, MOTE_FS), [u]);
  useDispose(geo, mat);
  return <points geometry={geo} material={mat} renderOrder={0} frustumCulled={false} />;
}

/* ───────────────────────────── story: three signals ───────────────────────────── */

export function streamCurve(k: number) {
  const pts: THREE.Vector3[] = [];
  const phase = k * 2.094 + 0.4, turns = 1.5 + k * 0.25, tilt = (k - 1) * 0.55;
  for (let i = 0; i <= 90; i++) {
    const t = i / 90, rad = THREE.MathUtils.lerp(7.4, 0.9, Math.pow(t, 0.85)), a = phase + t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * rad, tilt * rad * 0.5 * (1 - t) + Math.sin(a * 1.3) * 0.4 * (1 - t), Math.sin(a) * rad));
  }
  return new THREE.CatmullRomCurve3(pts);
}

const STREAM_FS = /* glsl */ `
uniform vec3 uCol; uniform float uDelay;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){
  float u = vUv.x;
  float reveal = clamp(uStreams * 1.35 - uDelay, 0., 1.);
  if (u > reveal) discard;
  float head = smoothstep(reveal - .12, reveal, u);
  float pulse = pow(max(.5 + .5 * sin(u * 46. - uTime * 3. + uDelay * 9.), 0.), 8.);
  float flash = smoothstep(.93, 1., u) * smoothstep(.8, 1., uStreams) * (.6 + .4 * sin(uTime * 8.));
  float vis = smoothstep(0., .15, uStreams);
  vec3 col = uCol * (.3 + pulse * 1.2 + head * 1.5) + vec3(1.) * flash * .9;
  gl_FragColor = packStory(col * vis, .55 * vis);
}`;

export function Streams({ u }: { u: U }) {
  const items = useMemo(() => [CYAN_HEX, VIOLET_HEX, PINK_HEX].map((hex, k) => ({
    geo: new THREE.TubeGeometry(streamCurve(k), 260, 0.034, 6),
    mat: shader(u, TUBE_VS, STREAM_FS, { extra: { uCol: { value: new THREE.Color(hex) }, uDelay: { value: k * 0.12 } } }),
  })), [u]);
  useDispose(...items.flatMap((i) => [i.geo, i.mat]));
  return <>{items.map((i, k) => <mesh key={k} geometry={i.geo} material={i.mat} renderOrder={1} frustumCulled={false} />)}</>;
}
const CYAN_HEX = '#22d3ee', VIOLET_HEX = '#a855f7', PINK_HEX = '#ec4899';

/* ───────────────────────────── story: mRNA strand read by a ribosome ───────────────────────────── */

/** The strand lives in world space, framed against the stage-3 camera so it always lands in the free corner of the page. */
export function strandCurve() {
  const k = KEYS[3];
  const cam = new THREE.PerspectiveCamera(k.fov, 1.6);
  cam.position.set(k.cx, k.cy, k.cz);
  cam.lookAt(k.lx, k.ly, k.lz);
  cam.updateMatrixWorld(true);
  const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
  const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion);
  const c = cam.position.clone().addScaledVector(fwd, 2.6).addScaledVector(right, 0.9).addScaledVector(up, 0.78);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40 - 0.5) * 2.3;
    pts.push(c.clone().addScaledVector(right, t).addScaledVector(up, Math.sin(t * 3.2) * 0.22).addScaledVector(fwd, Math.cos(t * 2.4) * 0.25));
  }
  return new THREE.CatmullRomCurve3(pts);
}

const STRAND_FS = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){
  float u = vUv.x;
  float vis = smoothstep(0., .25, uStrand);
  float d = uHead - u;
  float trail = d > 0. ? exp(-d * 2.2) : 0.;
  float headG = exp(-(d * 22.) * (d * 22.));
  vec3 col = mix(CYAN, VIOLET, u) * (.22 + trail * .9) + mix(vec3(.9, 1., 1.), vec3(.4, .7, .75), NEON) * headG * 2.4;
  gl_FragColor = packStory(col * vis, .55 * vis);
}`;

const BEAD_VS = /* glsl */ `
attribute float aU;
varying float vU; varying vec3 vN; varying vec3 vW;
void main(){
  vU = aU;
  float near = exp(-((aU - uHead) * 24.) * ((aU - uHead) * 24.));
  vec3 p = position * (1. + near * 1.4);
  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const BEAD_FS = /* glsl */ `
varying float vU; varying vec3 vN; varying vec3 vW;
void main(){
  vec3 V = normalize(cameraPosition - vW);
  float fres = pow(1. - clamp(dot(normalize(vN), V), 0., 1.), 2.);
  float d = uHead - vU;
  float lit = d > 0. ? .35 + .65 * exp(-d * 2.6) : .12;
  float head = exp(-(d * 24.) * (d * 24.));
  vec3 base = mix(CYAN, mix(VIOLET, PINK, step(.66, fract(vU * 7.))), step(.33, fract(vU * 7.)));
  float vis = smoothstep(0., .25, uStrand);
  vec3 col = base * (.25 + lit * (.6 + fres)) + mix(vec3(1.), vec3(.42, .68, .72), NEON) * head * 1.6;   // neon: a cyan-hot head, not a flat white blob
  gl_FragColor = packStory(col * vis, (.4 + fres * .4) * vis);
}`;

const GLOW_VS = /* glsl */ `
void main(){
  vec4 mv = viewMatrix * modelMatrix * vec4(position, 1.);
  gl_PointSize = 54. * uPx * (2.6 / max(-mv.z, .2));
  gl_Position = projectionMatrix * mv;
}`;
const GLOW_FS = /* glsl */ `
void main(){
  float r = length(gl_PointCoord - .5) * 2.;
  float g = pow(max(1. - r, 0.), 3.);
  float vis = smoothstep(0., .25, uStrand);
  gl_FragColor = packStory(mix(CYAN, vec3(1.), .55) * g * 1.1 * vis, g * .35 * vis);
}`;

export function Strand({ u }: { u: U }) {
  const curve = useMemo(strandCurve, []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 220, 0.016, 6), [curve]);
  const tubeMat = useMemo(() => shader(u, TUBE_VS, STRAND_FS), [u]);
  const N = 84;
  const beadGeo = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 14, 10), us = new Float32Array(N);
    for (let i = 0; i < N; i++) us[i] = (i + 0.5) / N;
    g.setAttribute('aU', new THREE.InstancedBufferAttribute(us, 1));
    return g;
  }, []);
  const beadMat = useMemo(() => shader(u, BEAD_VS, BEAD_FS), [u]);
  const beads = useRef<THREE.InstancedMesh>(null);
  const glow = useMemo(() => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3)), []);
  const glowMat = useMemo(() => shader(u, GLOW_VS, GLOW_FS), [u]);
  const glowRef = useRef<THREE.Points>(null);
  useDispose(tube, tubeMat, beadGeo, beadMat, glow, glowMat);

  useEffect(() => {
    const m = beads.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      o.position.copy(curve.getPointAt((i + 0.5) / N));
      o.scale.setScalar(0.042 + (i % 3 === 0 ? 0.016 : 0));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [curve]);

  useFrame(() => {
    const p = glowRef.current;
    if (p) p.position.copy(curve.getPointAt(THREE.MathUtils.clamp(u.uHead.value, 0, 1)));
  });

  return (
    <>
      <mesh geometry={tube} material={tubeMat} renderOrder={2} frustumCulled={false} />
      <instancedMesh ref={beads} args={[beadGeo, beadMat, N]} renderOrder={2} frustumCulled={false} />
      <points ref={glowRef} geometry={glow} material={glowMat} renderOrder={3} frustumCulled={false} />
    </>
  );
}

/* ───────────────────────────── story: scan plane + region of interest ───────────────────────────── */

const SCAN_VS = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.); }`;
const SCAN_FS = /* glsl */ `
varying vec2 vUv;
void main(){
  float on = smoothstep(.2, .9, uScanOn);
  vec2 q = vUv * 2. - 1.;
  float r = length(q);
  float disc = smoothstep(1., .96, r) * (.05 + .25 * smoothstep(.2, 1., r));
  float ring = smoothstep(.04, 0., abs(r - .96));
  vec2 g = abs(fract(q * 9.) - .5);
  float grid = smoothstep(.47, .5, max(g.x, g.y)) * .25 * (1. - r) * step(r, 1.);
  vec3 col = mix(CYAN, vec3(1.), .5) * (disc + ring * 1.5 + grid);
  gl_FragColor = packStory(col * on, (disc * .3 + ring * .5 + grid * .3) * on);
}`;

const ROI_FS = /* glsl */ `
varying vec2 vUv;
void main(){
  float on = smoothstep(.45, .95, uScanOn);
  vec2 p = vUv - .5;
  float e = max(abs(p.x), abs(p.y));
  float outline = smoothstep(.5, .47, e) * smoothstep(.42, .45, e);
  float corners = outline * step(.27, min(abs(p.x), abs(p.y)));
  float pulse = .6 + .4 * sin(uTime * 3.);
  float core = exp(-dot(p, p) * 18.) * pulse;
  vec3 col = PINK * (corners * 2.2 + core * 1.4) + vec3(1.) * corners * .5;
  gl_FragColor = packStory(col * on, (corners * .8 + core * .35) * on);
}`;

export function Scan({ u }: { u: U }) {
  const plane = useMemo(() => new THREE.PlaneGeometry(6.6, 6.6), []);
  const mat = useMemo(() => shader(u, SCAN_VS, SCAN_FS, { side: THREE.DoubleSide }), [u]);
  const roiMat = useMemo(() => shader(u, SCAN_VS, ROI_FS, { side: THREE.DoubleSide }), [u]);
  const disc = useRef<THREE.Mesh>(null), roi = useRef<THREE.Mesh>(null);
  const q = useMemo(() => new THREE.Quaternion(), []);
  useDispose(plane, mat, roiMat);
  useFrame((state) => {
    if (disc.current) disc.current.position.y = u.uScanY.value;
    const m = roi.current;
    if (m?.parent) { m.parent.getWorldQuaternion(q).invert().multiply(state.camera.quaternion); m.quaternion.copy(q); }
  });
  return (
    <>
      <mesh ref={disc} geometry={plane} material={mat} rotation={[-Math.PI / 2, 0, 0]} renderOrder={11} frustumCulled={false} />
      <mesh ref={roi} geometry={plane} material={roiMat} position={ROI_POS} scale={0.17} renderOrder={12} frustumCulled={false} />
    </>
  );
}
export const ROI_POS: [number, number, number] = [0.95, -0.45, 0.8];

/* ───────────────────────────── story: receptor constellation ───────────────────────────── */

const CON_LINE_VS = /* glsl */ `
attribute float aT; attribute float aR; attribute float aPh;
varying float vT; varying float vR; varying float vPh;
void main(){ vT = aT; vR = aR; vPh = aPh; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.); }`;
const CON_LINE_FS = /* glsl */ `
varying float vT; varying float vR; varying float vPh;
void main(){
  float vis = smoothstep(vR * .7, vR * .7 + .3, uConst);
  float pulse = pow(max(.5 + .5 * sin(vT * 7. - uTime * 2.2 + vPh * 6.28), 0.), 8.);
  vec3 col = mix(CYAN, PINK, vPh) * (.4 + pulse * 2.4);
  gl_FragColor = packStory(col * vis, .6 * vis);
}`;
const CON_PT_VS = /* glsl */ `
attribute float aR; attribute float aSel;
varying float vR; varying float vSel;
void main(){
  vR = aR; vSel = aSel;
  vec4 mv = viewMatrix * modelMatrix * vec4(position, 1.);
  gl_PointSize = (18. + aSel * 18.) * uPx * (6. / max(-mv.z, .2)) * (.7 + .3 * sin(uTime * 2. + aR * 20.));
  gl_Position = projectionMatrix * mv;
}`;
const CON_PT_FS = /* glsl */ `
varying float vR; varying float vSel;
void main(){
  float r = length(gl_PointCoord - .5) * 2.;
  float g = pow(max(1. - r, 0.), 2.4);
  float vis = smoothstep(vR * .7, vR * .7 + .3, uConst);
  vec3 c = vSel > .8 ? PINK : (vSel > .6 ? AMBER : CYAN);
  gl_FragColor = packStory(mix(c, vec3(1.), g * .5) * g * 2.8 * vis, g * .7 * vis);
}`;

export function Constellation({ u, count }: { u: U; count: number }) {
  const built = useMemo(() => {
    const r = rng(33), nodes: THREE.Vector3[] = [], sel: number[] = [], reveal: number[] = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - ((i + 0.5) / count) * 2, rad = Math.sqrt(1 - y * y), th = ga * i, R = 2.1 + r() * 0.15;
      nodes.push(new THREE.Vector3(Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R));
      sel.push(r()); reveal.push(r());
    }
    const seen = new Set<string>(), lp: number[] = [], lt: number[] = [], lr: number[] = [], lph: number[] = [];
    nodes.forEach((a, i) => {
      nodes.map((b, j) => [j, a.distanceToSquared(b)] as const).filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, 3).forEach(([j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        const b = nodes[j], rv = Math.max(reveal[i], reveal[j]), ph = r();
        lp.push(a.x, a.y, a.z, b.x, b.y, b.z); lt.push(0, 1); lr.push(rv, rv); lph.push(ph, ph);
      });
    });
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lp), 3));
    lg.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(lt), 1));
    lg.setAttribute('aR', new THREE.BufferAttribute(new Float32Array(lr), 1));
    lg.setAttribute('aPh', new THREE.BufferAttribute(new Float32Array(lph), 1));
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z])), 3));
    pg.setAttribute('aR', new THREE.BufferAttribute(new Float32Array(reveal), 1));
    pg.setAttribute('aSel', new THREE.BufferAttribute(new Float32Array(sel), 1));
    return { lg, pg };
  }, [count]);
  const lm = useMemo(() => shader(u, CON_LINE_VS, CON_LINE_FS), [u]);
  const pm = useMemo(() => shader(u, CON_PT_VS, CON_PT_FS), [u]);
  useDispose(built.lg, built.pg, lm, pm);
  return (
    <>
      <lineSegments geometry={built.lg} material={lm} renderOrder={2} frustumCulled={false} />
      <points geometry={built.pg} material={pm} renderOrder={3} frustumCulled={false} />
    </>
  );
}
