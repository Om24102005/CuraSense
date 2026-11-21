import * as THREE from 'three';
import { FINISH, fs, vs } from './glsl';

/** One uniform bag shared by every material in the scene; the controller writes it once per frame. */
export function makeUniforms() {
  return {
    uTime: { value: 0 }, uLight: { value: 0 }, uPx: { value: 1 },
    uAmp: { value: 0.17 }, uStretch: { value: 0 },
    uPoke: { value: new THREE.Vector3() }, uEnv: { value: new THREE.Vector2() },
    uRipple: { value: new THREE.Vector4(0, 0, 1, 99) },
    uHealth: { value: 1 }, uOpacity: { value: 1 }, uNuc: { value: 0.35 },
    uScanOn: { value: 0 }, uScanY: { value: 0 },
    uStreams: { value: 0 }, uStrand: { value: 0 }, uConst: { value: 0 }, uHead: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },   // drawing-buffer size in device pixels
    uFall: { value: 0 }, uFocus: { value: 10 }, uBokeh: { value: 0.5 }, uQuality: { value: 1 }, uExposure: { value: 1 }, uOrg: { value: 1 }, uBulb: { value: 0 },
  };
}
export type U = ReturnType<typeof makeUniforms>;

/** Premultiplied-alpha material: additive glow in the dark theme, tinted ink in the light one. */
export function shader(
  u: U, vert: string, frag: string,
  opts: { extra?: Record<string, { value: unknown }>; side?: THREE.Side; defines?: Record<string, string | number> } = {},
) {
  return new THREE.ShaderMaterial({
    uniforms: { ...u, ...opts.extra } as unknown as Record<string, THREE.IUniform>,
    vertexShader: vs(vert),
    // every fragment shader ends by encoding for the active output (screen or linear composer buffer)
    fragmentShader: fs(frag.replace(/\}\s*$/, `${FINISH}}`)),
    defines: opts.defines ?? {},
    transparent: true, depthWrite: false, side: opts.side ?? THREE.FrontSide,
    blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
  });
}

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Clone a geometry into an instanced one and attach per-instance attributes. */
export function instanced(base: THREE.BufferGeometry, count: number, attrs: Record<string, [Float32Array, number]>) {
  const g = new THREE.InstancedBufferGeometry();
  g.copy(base as unknown as THREE.InstancedBufferGeometry);
  g.instanceCount = count;
  for (const [name, [arr, size]] of Object.entries(attrs)) g.setAttribute(name, new THREE.InstancedBufferAttribute(arr, size));
  return g;
}
