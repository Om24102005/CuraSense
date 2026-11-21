/* Dark theme only: the cell turns into a plasma globe. The nucleus is the electrode, the membrane is the
   glass dome, and neon filaments reach from one to the other, bend toward the cursor and land in bright feet.
   A soft halo lights the space around the cell like a bulb. Both fade out completely in the light theme (the controller hides them). */
import { useMemo } from 'react';
import * as THREE from 'three';
import { MEMBRANE_FN } from './glsl';
import { useDispose } from './parts';
import { instanced, rng, shader, type U } from './uniforms';

const RAY_SEGS = 40;

const RAY_VS = MEMBRANE_FN + /* glsl */ `
attribute vec3 aDir; attribute vec4 aR;   // aR: start radius, end factor on the wall, width, seed
varying float vX; varying float vT; varying float vSeed; varying float vLy;
vec3 ray(float t, vec3 d, vec3 wall, vec3 T, vec3 B){
  float seed = aR.w, tm = uTime;
  vec3 p = mix(d * aR.x, wall, t);
  float env = pow(max(sin(3.14159 * t), 0.), .7);
  // slow drift: a strand keeps its shape for several seconds instead of re-forming every second (that read as veins flickering in and out)
  vec3 off = (T * snoise(vec3(seed * 17., t * 5.5 - tm * .22, tm * .06)) + B * snoise(vec3(seed * 17. + 9., t * 5.5 - tm * .26, tm * .07))) * .24 * env;
  off += (T * snoise(vec3(seed * 5., t * 21. - tm * .6, 3.)) + B * snoise(vec3(seed * 5. + 4., t * 21. - tm * .7, 5.))) * .02 * env;
  return p + off;
}
void main(){
  float seed = aR.w;
  // touch points drift slowly over the dome and lean toward the cursor, like a finger on a plasma globe
  vec3 d = rotAxis(vec3(sin(seed * 40.), cos(seed * 23.), sin(seed * 11.) + .3) + vec3(.001), uTime * (.05 + seed * .09)) * aDir;
  float pl = length(uPoke);
  if (pl > .01) { vec3 pk = uPoke / pl; d = normalize(d + pk * pl * .55 * pow(max(dot(d, pk), 0.), 2.)); }
  vec3 ref = abs(d.y) < .95 ? vec3(0., 1., 0.) : vec3(1., 0., 0.);
  vec3 T = normalize(cross(ref, d));
  vec3 B = cross(d, T);
  vec3 wall = membraneSurf(d) * aR.y;
  float t = position.y;
  vec3 P = ray(t, d, wall, T, B);
  vec3 Pa = ray(min(t + .03, 1.), d, wall, T, B);
  vec3 Pb = ray(max(t - .03, 0.), d, wall, T, B);
  vec3 wp = (modelMatrix * vec4(P, 1.)).xyz;
  vec3 tn = normalize(mat3(modelMatrix) * (Pa - Pb) + vec3(1e-5));
  vec3 side = normalize(cross(tn, normalize(cameraPosition - wp)) + vec3(1e-5));
  float w = aR.z * (1. + smoothstep(.8, 1., t) * 1.2) * (.35 + .65 * smoothstep(0., .12, t));
  wp += side * position.x * w * length(modelMatrix[0].xyz);
  vX = position.x; vT = t; vSeed = seed; vLy = P.y;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`;

const RAY_FS = /* glsl */ `
varying float vX; varying float vT; varying float vSeed; varying float vLy;
void main(){
  float on = smoothstep(.2, .9, uScanOn);
  if (vLy > mix(9., uScanY, on)) discard;
  float ax = abs(vX);
  float core = exp(-ax * ax * 12.);
  float halo = exp(-ax * 2.8);
  float foot = smoothstep(.78, 1., vT);
  float root = smoothstep(.14, 0., vT);
  float life = smoothstep(0., .1, vT) * smoothstep(1.02, .9, vT);
  float tw = snoise(vec3(vSeed * 20., uTime * .3, vT * 2.)) * .5 + .5;
  float inten = (.55 + .25 * tw) * (.8 + foot * .6 + root * .5);
  vec3 nc = mix(SICK, neonPal(vSeed + vT * .1), uHealth);
  vec3 col = nc * halo * inten * .4 + mix(nc, vec3(1.), .25) * core * inten * .72;
  gl_FragColor = packOut(col * NEON * life * (.35 + .65 * uOrg), 0.);
}`;

export function Plasma({ u, count }: { u: U; count: number }) {
  const geo = useMemo(() => {
    const r = rng(31), dir = new Float32Array(count * 3), aR = new Float32Array(count * 4);
    const mains = Math.round(count / 3), ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - ((i + 0.5) / count) * 2, rad = Math.sqrt(1 - y * y), th = ga * i, main = i < mains;
      dir.set([Math.cos(th) * rad, y, Math.sin(th) * rad], i * 3);
      // mains leave the nucleus; satellites are shorter sparks that start out in the cytoplasm
      aR.set(main ? [0.84, 0.95 + r() * 0.03, 0.02 + r() * 0.008, r()] : [1.0 + r() * 0.9, 0.9 + r() * 0.08, 0.012 + r() * 0.006, r()], i * 4);
    }
    const ribbon = new THREE.PlaneGeometry(2, 1, 1, RAY_SEGS);
    ribbon.translate(0, 0.5, 0);
    return instanced(ribbon, count, { aDir: [dir, 3], aR: [aR, 4] });
  }, [count]);
  const mat = useMemo(() => shader(u, RAY_VS, RAY_FS, { side: THREE.DoubleSide }), [u]);
  useDispose(geo, mat);
  return <mesh geometry={geo} material={mat} renderOrder={8} frustumCulled={false} />;
}

/* Camera-facing glow sprite centred on the cell: the bulb's light spilling into the room. */
const HALO_VS = /* glsl */ `
varying vec2 vP; varying float vFade;
void main(){
  vP = position.xy;
  vec4 c = viewMatrix * modelMatrix * vec4(0., 0., 0., 1.);
  float sc = length(modelMatrix[0].xyz);
  vFade = smoothstep(2.4 * sc, 3.8 * sc, max(-c.z, 0.));   // gone once the camera is inside the cell
  c.xy += position.xy * sc * 3.9;
  gl_Position = projectionMatrix * c;
}`;

const HALO_FS = /* glsl */ `
varying vec2 vP; varying float vFade;
void main(){
  float r = length(vP), R = .615;
  float body = exp(-pow(max(r - R * .45, 0.) * 3., 2.));
  float rim = exp(-(r - R) * (r - R) * 42.25);
  float breathe = .93 + .07 * sin(uTime * 1.3);
  vec3 nc = mix(SICK, mix(N_CYAN, N_VIO, smoothstep(.2, 1., r)), uHealth);
  vec3 col = (nc * (body * .08 + rim * .18) + N_MAG * rim * body * .07) * breathe;
  gl_FragColor = packOut(col * NEON * vFade * smoothstep(1., .8, r), 0.);
}`;

export function Halo({ u }: { u: U }) {
  const geo = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
  const mat = useMemo(() => shader(u, HALO_VS, HALO_FS), [u]);
  useDispose(geo, mat);
  return <mesh geometry={geo} material={mat} renderOrder={0} frustumCulled={false} />;
}
