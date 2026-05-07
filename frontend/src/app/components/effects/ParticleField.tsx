/* ═══════════════════════════════════════════════════════
   CuraSense — GOD-LEVEL Particle Field (R3F)
   GPU-accelerated, scroll-driven morphing particle system
   ═══════════════════════════════════════════════════════ */

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll } from '@react-three/drei';

/* ── Shape Generators ───────────────────────────────── */
function createDNA(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count - 0.5) * 140;
    const angle = t * 0.12 + (i % 2 === 0 ? 0 : Math.PI);
    const rad = 16;
    arr[i * 3] = Math.cos(angle) * rad;
    arr[i * 3 + 1] = t;
    arr[i * 3 + 2] = Math.sin(angle) * rad;
  }
  return arr;
}

function createBrain(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const phi = Math.acos(1 - 2 * t);
    const theta = Math.PI * 2 * i / ((1 + Math.sqrt(5)) / 2);
    const rad = 28 + Math.sin(theta * 4) * 3;
    arr[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = rad * Math.cos(phi);
    arr[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
  }
  return arr;
}

function createHeart(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(theta), 3);
    const hy = 13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta);
    arr[i * 3] = hx * 1.8;
    arr[i * 3 + 1] = hy * 1.8;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  return arr;
}

function createLungs(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const isLeft = i % 2 === 0;
    const phi = Math.acos(1 - 2 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const rad = 18;
    let lx = rad * Math.sin(phi) * Math.cos(theta);
    let ly = rad * Math.cos(phi) * 2.0;
    let lz = rad * Math.sin(phi) * Math.sin(theta);
    lx += isLeft ? -16 : 16;
    arr[i * 3] = lx;
    arr[i * 3 + 1] = ly - 8;
    arr[i * 3 + 2] = lz * 0.8;
  }
  return arr;
}

/* ── Shader Material ─────────────────────────────────── */
const particleVert = `
  uniform float uTime;
  uniform float uMorph;
  uniform float uPixelRatio;
  attribute vec3 target0;
  attribute vec3 target1;
  attribute vec3 target2;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    pos = mix(pos, target0, uMorph);
    pos = mix(pos, target1, smoothstep(0.0, 1.0, uMorph - 1.0));
    pos = mix(pos, target2, smoothstep(1.0, 2.0, uMorph - 2.0));

    // Organic drift
    float drift = sin(uTime * 0.3 + position.x * 0.01) * 0.5;
    pos.x += drift;
    pos.y += cos(uTime * 0.2 + position.z * 0.01) * 0.5;
    pos.z += sin(uTime * 0.25 + position.y * 0.01) * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vColor = aColor;
    vAlpha = 0.6 + 0.4 * sin(uTime * 0.5 + position.x * 0.1);

    gl_PointSize = aSize * uPixelRatio * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFrag = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord.xy - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    float glow = exp(-d * d * 20.0);
    float core = smoothstep(0.5, 0.0, d);

    vec3 color = vColor * (1.0 + glow * 0.5);
    float alpha = (glow * 0.4 + core * 0.6) * vAlpha;

    gl_FragColor = vec4(color, alpha);
  }
`;

/* ── Particle System Component ───────────────────────── */
function ParticleSystem({ count = 6000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null!);
  const { viewport } = useThree();
  const scroll = useScroll();

  const { positions, targets, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const t0 = createDNA(count);
    const t1 = createBrain(count);
    const t2 = createHeart(count);
    const t3 = createLungs(count);
    const cols = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    const c1 = new THREE.Color(0x00f0ff);
    const c2 = new THREE.Color(0xff00aa);
    const c3 = new THREE.Color(0xff1133);
    const c4 = new THREE.Color(0x00ffa8);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = t0[i3] + (Math.random() - 0.5) * 8;
      pos[i3 + 1] = t0[i3 + 1] + (Math.random() - 0.5) * 8;
      pos[i3 + 2] = t0[i3 + 2] + (Math.random() - 0.5) * 8;

      const mixColor = c1.clone().lerp(c2, Math.random());
      cols[i3] = mixColor.r;
      cols[i3 + 1] = mixColor.g;
      cols[i3 + 2] = mixColor.b;

      siz[i] = 0.5 + Math.random() * 1.5;
    }

    return {
      positions: pos,
      targets: [t0, t1, t2, t3],
      colors: cols,
      sizes: siz,
    };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms,
    vertexShader: particleVert,
    fragmentShader: particleFrag,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [uniforms]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('target0', new THREE.BufferAttribute(targets[0], 3));
    geo.setAttribute('target1', new THREE.BufferAttribute(targets[1], 3));
    geo.setAttribute('target2', new THREE.BufferAttribute(targets[2], 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, targets, colors, sizes]);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    // Map scroll to morph (0-3 range).
    // useScroll() returns null when there's no <ScrollControls> parent —
    // this component is mounted standalone, so we fall back to a slow
    // time-driven cycle instead of crashing every frame.
    if (scroll && typeof scroll.range === 'function') {
      const scrollVal =
        scroll.range(0, 1 / 4) * 1 +
        scroll.range(1 / 4, 1 / 4) * 2 +
        scroll.range(2 / 4, 1 / 4) * 3 +
        scroll.range(3 / 4, 1 / 4) * 4;
      uniforms.uMorph.value += (scrollVal - uniforms.uMorph.value) * 0.05;
    } else {
      // Idle morph: gentle 30s cycle through the 4 forms.
      const cycleTarget = (state.clock.elapsedTime % 30) / 30 * 4;
      uniforms.uMorph.value += (cycleTarget - uniforms.uMorph.value) * 0.02;
    }

    // Slow rotation
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
  });

  return (
    <points ref={meshRef} geometry={geometry} material={material} />
  );
}

/* ── Background Stars ────────────────────────────────── */
function BackgroundStars() {
  const count = 3000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 600;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#888899"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Main Export ─────────────────────────────────────── */
export default function ParticleField({ count = 6000 }: { count?: number }) {
  // Bail out entirely when count<=0 (mobile path) — don't mount a
  // Canvas at all, so no WebGL context, no rAF, no GPU cost.
  if (count <= 0) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 85], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <fogExp2 attach="fog" args={['#020205', 0.005]} />
        <BackgroundStars />
        <ParticleSystem count={count} />
      </Canvas>
    </div>
  );
}
