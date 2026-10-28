import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { matcap } from './matcap';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type SceneName = 'welcome' | 'dashboard' | 'analyze' | 'history' | 'booking' | 'settings' | 'admin';

/** a/b = theme accents, dark = theme mode, q = quality 0.3 (low-end) … 1, hi = GPU can afford real glass transmission. */
export interface SceneProps { a: string; b: string; dark: boolean; q: number; hi: boolean }

const damp = THREE.MathUtils.damp;

/** Click anywhere on the object → it swells and settles back. */
function Kick({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const k = useRef(0);
  useFrame((_, dt) => {
    k.current = damp(k.current, 0, 4, dt);
    g.current?.scale.setScalar(1 + k.current);
  });
  return <group ref={g} onClick={() => { k.current = 0.2; }}>{children}</group>;
}

/** Flat sprite glows are gone: light now comes from real emissive meshes plus bloom post-processing. */
function Glow(_p: { color: string; size: number; opacity?: number; dark: boolean }) { return null; }

/** Baked-lighting material: no lights needed, cheap on every GPU. */
function MC({ base, rim, kind = 'gloss', flat = false }: { base: string; rim: string; kind?: 'gloss' | 'chrome' | 'soft'; flat?: boolean }) {
  return <meshMatcapMaterial matcap={matcap(base, rim, kind)} flatShading={flat} />;
}


/** Medical "planets" orbiting the crystal: cells, viruses, pills and a DNA strand. */
function MedOrbit({ a, b, dark, q }: SceneProps) {
  const grp = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Group | null)[]>([]);
  const dna = useRef<THREE.InstancedMesh>(null);
  const items = useMemo(() => {
    const kinds = ['cell', 'virus', 'pill', 'cell', 'virus', 'pill', 'cell', 'virus'] as const;
    const n = Math.max(4, Math.round(kinds.length * (0.5 + q * 0.5)));
    return kinds.slice(0, n).map((kind, i) => ({ kind, r: 3.6 + (i % 3) * 0.9, sp: 0.12 + (i % 4) * 0.035, ph: (i / n) * 6.28, y: Math.sin(i * 2.1) * 1.1 }));
  }, [q]);
  const spikes = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const p = Math.acos(1 - (2 * (i + 0.5)) / 14), t = Math.PI * (1 + Math.sqrt(5)) * i;
    const d = new THREE.Vector3(Math.cos(t) * Math.sin(p), Math.cos(p), Math.sin(t) * Math.sin(p));
    return { d, qt: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d) };
  }), []);
  const cellGeo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.34, 4);
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const n = Math.sin(v.x * 9) * Math.sin(v.y * 8 + 1) * Math.sin(v.z * 10 + 2);
      v.multiplyScalar(1 + 0.07 * n);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const strands = Math.round(16 + 20 * q);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (grp.current) grp.current.rotation.y += dt * 0.05;
    items.forEach((it, i) => {
      const g = refs.current[i];
      if (!g) return;
      const ang = it.ph + t * it.sp;
      g.position.set(Math.cos(ang) * it.r, it.y + Math.sin(t * 0.6 + i) * 0.2, Math.sin(ang) * it.r);
      g.rotation.x += dt * 0.4; g.rotation.y += dt * 0.3;
    });
    if (dna.current) {
      for (let i = 0; i < strands * 2; i++) {
        const k = i >> 1, side = i & 1, y = (k / strands - 0.5) * 3.4, ang = k * 0.55 + t * 0.9 + side * Math.PI;
        dummy.position.set(Math.cos(ang) * 0.35, y, Math.sin(ang) * 0.35);
        dummy.scale.setScalar(0.06);
        dummy.updateMatrix();
        dna.current.setMatrixAt(i, dummy.matrix);
      }
      dna.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={grp}>
      {items.map((it, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }}>
          {it.kind === 'cell' && (<>
            <mesh geometry={cellGeo}><MC base={a} rim={b} kind="soft" /></mesh>
            <mesh position={[0.06, 0.04, 0]}><sphereGeometry args={[0.13, 20, 20]} /><meshBasicMaterial color={b} toneMapped={false} /></mesh>
          </>)}
          {it.kind === 'virus' && (<>
            <mesh><icosahedronGeometry args={[0.22, 1]} /><MC base={b} rim={a} /></mesh>
            {spikes.map((s, k) => (
              <mesh key={k} quaternion={s.qt} position={s.d.clone().multiplyScalar(0.27)}>
                <coneGeometry args={[0.03, 0.12, 6]} /><MC base={a} rim="#ffffff" />
              </mesh>
            ))}
          </>)}
          {it.kind === 'pill' && (
            <mesh rotation={[0, 0, 0.6]}><capsuleGeometry args={[0.1, 0.34, 6, 14]} /><MC base={a} rim={b} kind="chrome" /></mesh>
          )}
        </group>
      ))}
      <group position={[-5.6, 0.3, -1]} rotation={[0, 0, 0.35]}>
        <instancedMesh ref={dna} args={[undefined, undefined, strands * 2]} key={strands}>
          <sphereGeometry args={[1, 12, 12]} /><meshBasicMaterial color={dark ? '#ffffff' : b} toneMapped={false} />
        </instancedMesh>
      </group>
      <mesh rotation={[Math.PI / 2.2, 0, 0.2]}><torusGeometry args={[4.4, 0.012, 8, 160]} /><meshBasicMaterial color={a} transparent opacity={0.35} /></mesh>
      <mesh rotation={[Math.PI / 2.8, 0, -0.3]}><torusGeometry args={[5.4, 0.01, 8, 160]} /><meshBasicMaterial color={b} transparent opacity={0.3} /></mesh>
    </group>
  );
}

/* ── welcome: quartz crystal cluster — click to split it open ── */
function CrystalCore(p: SceneProps) {
  const { a, b, dark, q, hi } = p;
  const open = useRef(0);
  const target = useRef(0);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Group>(null);
  // One shared hexagonal prism + pointed tip, so every crystal reuses a single geometry and material.
  const geo = useMemo(() => {
    const prism = new THREE.CylinderGeometry(0.2, 0.24, 1.3, 6).translate(0, 0.65, 0);
    const tip = new THREE.ConeGeometry(0.2, 0.5, 6).translate(0, 1.55, 0);
    return mergeGeometries([prism.toNonIndexed(), tip.toNonIndexed()])!;
  }, []);
  const crystals = useMemo(() => {
    const n = Math.round(7 + 5 * q);
    const up = new THREE.Vector3(0, 1, 0);
    return Array.from({ length: n }, (_, i) => {
      const p = Math.acos(1 - (2 * (i + 0.5)) / n), t = Math.PI * (1 + Math.sqrt(5)) * i;
      const d = new THREE.Vector3(Math.cos(t) * Math.sin(p), Math.cos(p), Math.sin(t) * Math.sin(p));
      return { d, qt: new THREE.Quaternion().setFromUnitVectors(up, d), s: 0.75 + ((i * 37) % 10) / 22 };
    });
  }, [q]);

  useFrame(({ clock }, dt) => {
    open.current = damp(open.current, target.current, 3, dt);
    if (core.current) {
      core.current.rotation.y += dt * 0.4;
      core.current.scale.setScalar((1 + open.current * 0.5) * (1 + Math.sin(clock.elapsedTime * 1.4) * 0.03));
    }
    if (shell.current) {
      shell.current.rotation.y += dt * 0.1;
      shell.current.children.forEach((c, i) => c.position.copy(crystals[i].d).multiplyScalar(0.25 + open.current * 1.8));
    }
  });

  return (
    <group scale={0.8}>
      <MedOrbit {...p} />
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.5}>
        <group onClick={() => { target.current = target.current ? 0 : 1; }}>
          <mesh ref={core}>
            <icosahedronGeometry args={[0.55, 2]} />
            <meshBasicMaterial color={b} toneMapped={false} />
          </mesh>
          <group ref={shell}>
            {crystals.map((c, i) => (
              <mesh key={i} geometry={geo} quaternion={c.qt} scale={c.s}>
                <MC base={dark ? '#7fa8ff' : '#4d73d8'} rim={b} kind="chrome" flat />
              </mesh>
            ))}
          </group>
          <Sparkles count={Math.round(20 + 50 * q)} scale={6} size={2.5} speed={0.3} color={a} />
        </group>
      </Float>
    </group>
  );
}

/* ── dashboard: beating heart with vessels and blood cells ── */
function Heart({ a, b, dark, q }: SceneProps) {
  const heart = useRef<THREE.Group>(null);
  const cells = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.25, 0.25);
    s.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
    s.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
    s.bezierCurveTo(-0.3, 0.55, -0.15, 0.77, 0.25, 0.95);
    s.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
    s.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
    s.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.14, bevelSegments: 8, curveSegments: 32 });
    g.center();
    return g;
  }, []);
  const vessels = useMemo(() => [
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.15, 0.7, 0), new THREE.Vector3(0.3, 1.3, 0.1), new THREE.Vector3(-0.2, 1.9, 0.2), new THREE.Vector3(-0.9, 2.1, 0.1)]), 40, 0.14, 12),
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.35, 0.65, -0.1), new THREE.Vector3(-0.5, 1.2, -0.2), new THREE.Vector3(-0.2, 1.8, -0.3), new THREE.Vector3(0.5, 2.2, -0.2)]), 40, 0.1, 12),
  ], []);
  const n = Math.round(24 + 60 * q);
  const phase = useMemo(() => Array.from({ length: n }, () => ({ t: Math.random() * 6.28, r: 2.5 + Math.random() * 0.7, y: (Math.random() - 0.5) * 0.8, s: 0.25 + Math.random() * 0.35 })), [n]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }, dt) => {
    const ph = (clock.elapsedTime * 1.15) % 1;
    const beat = Math.exp(-(((ph - 0.08) * 14) ** 2)) + 0.6 * Math.exp(-(((ph - 0.3) * 14) ** 2));
    if (heart.current) {
      heart.current.scale.setScalar(1 + beat * 0.1);
      heart.current.rotation.y += dt * 0.3;
    }
    if (cells.current) {
      phase.forEach((p, i) => {
        const ang = p.t + clock.elapsedTime * p.s * (1 + beat * 0.8);
        dummy.position.set(Math.cos(ang) * p.r, p.y, Math.sin(ang) * p.r);
        dummy.rotation.set(ang * 2, ang, 0);
        dummy.updateMatrix();
        cells.current!.setMatrixAt(i, dummy.matrix);
      });
      cells.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <Kick>
      <group ref={heart}>
        <mesh geometry={geo} rotation={[0, 0, Math.PI]} scale={2.2}>
          <MC base="#c4162f" rim="#ff8a99" />
        </mesh>
        <mesh geometry={vessels[0]} position={[0, 0.2, 0]} scale={1.3}><MC base="#9a1128" rim="#ff6b7f" /></mesh>
        <mesh geometry={vessels[1]} position={[0, 0.2, 0]} scale={1.3}><MC base="#3a5aa8" rim={a} /></mesh>
        <Glow color="#ff2b4f" size={7} opacity={0.45} dark={dark} />
      </group>
      <instancedMesh ref={cells} args={[undefined, undefined, n]} key={n}>
        <cylinderGeometry args={[0.07, 0.07, 0.025, 14]} />
        <MC base="#d6203f" rim="#ff9aa8" />
      </instancedMesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[3.6, 0.01, 8, 140]} /><meshBasicMaterial color={b} transparent opacity={0.6} /></mesh>
      <Sparkles count={30} scale={7} size={2} speed={0.3} color={a} />
    </Kick>
  );
}

/* ── analyze: neural network with signals travelling along the edges ── */
function NeuralNet({ a, b, dark, q }: SceneProps) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const sigs = useRef<THREE.InstancedMesh>(null);
  const grp = useRef<THREE.Group>(null);
  const { pts, edges, lines, phase, state } = useMemo(() => {
    const n = Math.round(16 + 70 * q);
    const pts = Array.from({ length: n }, () => new THREE.Vector3().randomDirection().multiplyScalar(1.2 + Math.random() * 1.9));
    const edges: [number, number][] = [];
    const seg: number[] = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
      if (pts[i].distanceTo(pts[j]) < 1.5) { edges.push([i, j]); seg.push(...pts[i].toArray(), ...pts[j].toArray()); }
    const lines = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    const m = Math.round(10 + 30 * q);
    const state = Array.from({ length: m }, () => ({ e: Math.floor(Math.random() * Math.max(1, edges.length)), t: Math.random(), s: 0.4 + Math.random() * 0.6 }));
    return { pts, edges, lines, phase: pts.map(() => Math.random() * 6.28), state };
  }, [q]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => {
    const ca = new THREE.Color(a), cb = new THREE.Color(b);
    return pts.map((_, i) => (i % 2 ? ca : cb));
  }, [pts, a, b]);

  useLayoutEffect(() => {
    colors.forEach((c, i) => inst.current?.setColorAt(i, c));
    if (inst.current?.instanceColor) inst.current.instanceColor.needsUpdate = true;
  }, [colors]);

  useFrame(({ clock }, dt) => {
    if (grp.current) grp.current.rotation.y += dt * 0.12;
    if (inst.current) {
      pts.forEach((p, i) => {
        dummy.position.copy(p);
        dummy.scale.setScalar(0.07 * (1 + 0.9 * Math.max(0, Math.sin(clock.elapsedTime * 1.6 + phase[i]))));
        dummy.updateMatrix();
        inst.current!.setMatrixAt(i, dummy.matrix);
      });
      inst.current.instanceMatrix.needsUpdate = true;
    }
    if (sigs.current && edges.length) {
      state.forEach((s, i) => {
        s.t += dt * s.s;
        if (s.t > 1) { s.t = 0; s.e = Math.floor(Math.random() * edges.length); }
        const [x, y] = edges[s.e];
        dummy.position.lerpVectors(pts[x], pts[y], s.t);
        dummy.scale.setScalar(0.05);
        dummy.updateMatrix();
        sigs.current!.setMatrixAt(i, dummy.matrix);
      });
      sigs.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <Kick>
      <group ref={grp}>
        <instancedMesh ref={inst} args={[undefined, undefined, pts.length]} key={`n${pts.length}`}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshBasicMaterial />
        </instancedMesh>
        <instancedMesh ref={sigs} args={[undefined, undefined, state.length]} key={`s${state.length}`}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={dark ? '#ffffff' : '#0b2a55'} />
        </instancedMesh>
        <lineSegments geometry={lines}><lineBasicMaterial color={a} transparent opacity={0.4} /></lineSegments>
        <Glow color={b} size={6} opacity={0.35} dark={dark} />
      </group>
    </Kick>
  );
}

/* ── history: spiral galaxy with a bright core ── */
function Galaxy({ a, b, dark, q }: SceneProps) {
  const grp = useRef<THREE.Group>(null);
  const build = (n: number, bright: boolean) => {
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const ca = new THREE.Color(a), cb = new THREE.Color(b), warm = new THREE.Color('#ffd9a0'), c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const r = Math.pow(Math.random(), 0.65) * 4.4;
      const ang = r * 1.35 + (i % 3) * ((Math.PI * 2) / 3) + (Math.random() - 0.5) * (0.25 + r * 0.12);
      pos.set([Math.cos(ang) * r, (Math.random() - 0.5) * 0.4 * (1 - r / 5.5), Math.sin(ang) * r], i * 3);
      c.copy(ca).lerp(cb, r / 4.4).lerp(warm, bright ? 0.5 : Math.max(0, 0.6 - r / 3));
      col.set([c.r, c.g, c.b], i * 3);
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)).setAttribute('color', new THREE.BufferAttribute(col, 3));
  };
  const dust = useMemo(() => build(Math.round(1800 + 9000 * q), false), [a, b, q]);
  const stars = useMemo(() => build(Math.round(120 + 500 * q), true), [a, b, q]);
  const blend = dark ? THREE.AdditiveBlending : THREE.NormalBlending;

  useFrame((_, dt) => { if (grp.current) grp.current.rotation.y += dt * 0.07; });

  return (
    <Kick>
      <group rotation={[0.95, 0, 0.2]}>
        <group ref={grp}>
          <points geometry={dust}><pointsMaterial size={0.035} vertexColors sizeAttenuation transparent opacity={dark ? 0.85 : 0.7} depthWrite={false} blending={blend} /></points>
          <points geometry={stars}><pointsMaterial size={0.1} vertexColors sizeAttenuation transparent opacity={0.95} depthWrite={false} blending={blend} /></points>
        </group>
      </group>
      <Glow color="#ffd9a0" size={4.2} opacity={0.9} dark={dark} />
      <Glow color={a} size={9} opacity={0.25} dark={dark} />
    </Kick>
  );
}

/* ── booking: floating glass slabs ── */
function GlassShards({ a, b, hi, dark }: SceneProps) {
  const slabs = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const t = (i / 6 - 0.5) * 2;
    return { x: t * 3.2, y: Math.sin(i * 1.7) * 0.7, z: -Math.abs(t) * 1.4, r: t * -0.45, c: i % 2 ? a : b };
  }), [a, b]);
  return (
    <Kick>
      {slabs.map((s, i) => (
        <Float key={i} speed={1 + i * 0.12} floatIntensity={1.2} rotationIntensity={0.4}>
          <mesh position={[s.x, s.y, s.z]} rotation={[0.1, s.r, 0.08 * (i - 3)]}>
            <boxGeometry args={[1.2, 1.9, 0.12]} />
            <MC base={dark ? '#2a3f7a' : '#6f8fd8'} rim={s.c} kind="chrome" />
          </mesh>
          <mesh position={[s.x, s.y, s.z - 0.2]} rotation={[0.1, s.r, 0.08 * (i - 3)]}>
            <planeGeometry args={[0.9, 1.6]} />
            <meshBasicMaterial color={s.c} toneMapped={false} />
          </mesh>
        </Float>
      ))}
      <Glow color={b} size={9} opacity={0.3} dark={dark} />
    </Kick>
  );
}

/* ── settings: chrome orbit rings with satellites ── */
function OrbitRings({ a, b, dark }: SceneProps) {
  const rings = useRef<THREE.Group>(null);
  const spread = useRef(0);
  const target = useRef(0);
  useFrame((_, dt) => {
    spread.current = damp(spread.current, target.current, 3, dt);
    rings.current?.children.forEach((r, i) => {
      r.rotation.x += dt * (0.18 + i * 0.09);
      r.rotation.y += dt * (0.12 + i * 0.05);
      r.scale.setScalar(1 + i * 0.32 + spread.current * (i + 1) * 0.3);
    });
  });
  return (
    <group onClick={() => { target.current = target.current ? 0 : 1; }}>
      <mesh>
        <sphereGeometry args={[0.7, 48, 48]} />
        <meshBasicMaterial color={b} toneMapped={false} />
      </mesh>
      <Glow color={b} size={5} dark={dark} />
      <group ref={rings}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[i * 0.7, i * 0.4, 0]}>
            <mesh>
              <torusGeometry args={[1.4, 0.045, 24, 128]} />
              <MC base={i % 2 ? a : '#dfe6f5'} rim={b} kind="chrome" />
            </mesh>
            <mesh position={[1.4, 0, 0]}>
              <sphereGeometry args={[0.1, 20, 20]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ── admin: rolling terrain — displaced and shaded on the GPU, zero per-frame CPU work ── */
const TERRAIN_VERT = `
  uniform float uT; varying float vH; varying vec3 vPos;
  void main() {
    float h = sin(position.x*.5+uT)*.5 + cos(position.y*.55+uT*.8)*.5 + sin((position.x+position.y)*.3-uT*.6)*.3;
    vH = h;
    vec4 mv = modelViewMatrix * vec4(position.xy, h, 1.0);
    vPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`;
const TERRAIN_FRAG = `
  uniform vec3 uA; uniform vec3 uB; uniform float uWire; varying float vH; varying vec3 vPos;
  void main() {
    if (uWire > 0.5) { gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1); return; }
    vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
    float l = max(dot(n, normalize(vec3(0.4, 0.7, 0.6))), 0.0) * 0.75 + 0.3;
    gl_FragColor = vec4(mix(uB, uA, clamp((vH + 1.0) * 0.5, 0.0, 1.0)) * l, 1.0);
  }`;

function Terrain({ a, b, dark, q }: SceneProps) {
  const seg = Math.round(32 + 40 * q);
  const mats = useMemo(() => {
    const mk = (wire: number) => new THREE.ShaderMaterial({
      vertexShader: TERRAIN_VERT, fragmentShader: TERRAIN_FRAG, transparent: !!wire, wireframe: !!wire, depthWrite: !wire,
      uniforms: { uT: { value: 0 }, uA: { value: new THREE.Color(a) }, uB: { value: new THREE.Color(b) }, uWire: { value: wire } },
    });
    return [mk(0), mk(1)];
  }, [a, b]);
  useFrame(({ clock }) => { mats.forEach((m) => { m.uniforms.uT.value = clock.elapsedTime * 0.5; }); });
  return (
    <Kick>
      <group rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -1.6, -1]}>
        <mesh material={mats[0]} key={seg}><planeGeometry args={[16, 11, seg, seg]} /></mesh>
        <mesh material={mats[1]} position={[0, 0, 0.02]} key={`w${seg}`}><planeGeometry args={[16, 11, seg, seg]} /></mesh>
      </group>
      <Sparkles count={30} scale={[10, 4, 6]} size={2} speed={0.25} color={a} />
    </Kick>
  );
}

export const SCENES: Record<SceneName, (p: SceneProps) => JSX.Element> = {
  welcome: CrystalCore,
  dashboard: Heart,
  analyze: NeuralNet,
  history: Galaxy,
  booking: GlassShards,
  settings: OrbitRings,
  admin: Terrain,
};
