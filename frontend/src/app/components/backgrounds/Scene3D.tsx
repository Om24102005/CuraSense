import { Component, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useDeviceTier, useDocumentVisible, useReducedMotion, type DeviceTier } from '../../animations';
import { SCENES, type SceneName } from './scenes';
import { blobShadow } from './matcap';

/* One persistent, opaque canvas. Scenes sit in a line along -Z and the camera
   flies down it, so a page change is one continuous move (the scene you leave
   streams past, the next swells out of the distance). Scrolling grows the
   scene a little.

   Look: baked-lighting "matcap" materials (painted once into a texture, see
   matcap.ts) plus a baked blob shadow under each scene. No live lights, no
   shadow maps, no reflection or refraction passes, so it is cheap on every GPU.

   Performance: only scenes within 1.3 steps of the camera are mounted. The
   terrain runs on the GPU, instance colours are set once, dpr is capped at 1.5.
   A PerformanceMonitor watches the real frame rate and steps quality down
   (bloom, density, antialiasing, dpr) if it dips. If WebGL is missing or a
   scene throws, the CSS aurora shows instead. */

const ORDER: SceneName[] = ['welcome', 'dashboard', 'analyze', 'history', 'booking', 'settings', 'admin'];
const SPACING = 30;
const CAM_Z = 7.5;
const DEPTH = 3.5;                       // scenes sit behind the page content, not on it
const STEPS: DeviceTier[] = ['high', 'mid', 'low'];
const QUALITY = { high: 1, mid: 0.6, low: 0.3 } as const;
const smooth = THREE.MathUtils.smoothstep;

class Quiet extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function hasWebGL() {
  try { return !!document.createElement('canvas').getContext('webgl'); } catch { return false; }
}

function Rig({ target, prog, scroll }: { target: number; prog: MutableRefObject<number>; scroll: MutableRefObject<number> }) {
  useFrame(({ camera, pointer }, dt) => {
    prog.current = THREE.MathUtils.damp(prog.current, target, 1.5, dt);
    const moving = Math.abs(prog.current - target) > 1e-3;
    const frac = moving ? prog.current % 1 : 0;
    const sway = Math.sin(frac * Math.PI);
    const dir = Math.sign(target - prog.current) || 1;
    camera.position.set(
      THREE.MathUtils.damp(camera.position.x, sway * 4.5 * dir + pointer.x * 0.5, 4, dt),
      THREE.MathUtils.damp(camera.position.y, pointer.y * 0.3 + sway * 1.2, 4, dt),
      CAM_Z - prog.current * SPACING - scroll.current * 0.6,
    );
    camera.rotation.z = sway * 0.07 * -dir;
    camera.lookAt(camera.position.x - pointer.x * 0.5, camera.position.y * 0.5, camera.position.z - 10);
  });
  return null;
}

interface StageProps { index: number; prog: MutableRefObject<number>; scroll: MutableRefObject<number>; a: string; b: string; dark: boolean; q: number; hi: boolean }

function Stage({ index, prog, scroll, a, b, dark, q, hi }: StageProps) {
  const g = useRef<THREE.Group>(null);
  const grow = useRef(1);
  const Scene = SCENES[ORDER[index]];
  useFrame(({ size }, dt) => {
    if (!g.current) return;
    // d = distance ahead of the camera. Leaving: shrinks as the camera passes. Arriving: swells out of the distance.
    const d = CAM_Z + (index - prog.current) * SPACING;
    const s = smooth(d, 1, 7) * (1 - smooth(d, 20, 42));
    grow.current = THREE.MathUtils.damp(grow.current, 1 + scroll.current * 0.25, 4, dt);
    g.current.scale.setScalar(s * grow.current * Math.min(1, Math.max(0.5, size.width / 1200)));
    g.current.visible = s > 0.002;
  });

  return (
    <group ref={g} position={[0, 0, -index * SPACING - DEPTH]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.55, 0]}>
        <planeGeometry args={[9, 9]} />
        <meshBasicMaterial map={blobShadow()} transparent depthWrite={false} opacity={dark ? 0.9 : 0.5} />
      </mesh>
      <Scene a={a} b={b} dark={dark} q={q} hi={hi} />
    </group>
  );
}

/** Mounts the scenes near the camera; re-renders only when that set changes. */
function Scenes(props: Omit<StageProps, 'index'> & { target: number }) {
  const [near, setNear] = useState<number[]>([props.target]);
  useFrame(() => {
    const set = ORDER.map((_, i) => i).filter((i) => Math.abs(i - props.prog.current) <= 1.3);
    if (set.join() !== near.join()) setNear(set);
    props.scroll.current = THREE.MathUtils.clamp(window.scrollY / (window.innerHeight * 2.5), 0, 1);
  });
  return <>{near.map((i) => <Stage key={i} index={i} {...props} />)}</>;
}

/** Dark floor that rides with the camera, carrying a real 3D ECG-paper grid. */
function Floor({ a, dark }: { a: string; dark: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ camera }) => { if (g.current) g.current.position.z = camera.position.z - 25; });
  return (
    <group ref={g} position={[0, -3.6, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshBasicMaterial color={dark ? '#060a16' : '#c9d5ea'} />
      </mesh>
      <Grid position={[0, 0.01, 0]} args={[160, 160]} cellSize={0.8} cellThickness={0.6} cellColor={dark ? '#16305c' : '#8aa3d6'} sectionSize={4} sectionThickness={1.2} sectionColor={a} fadeDistance={55} fadeStrength={1.6} infiniteGrid />
    </group>
  );
}

interface Scene3DProps { scene: SceneName; a: string; b: string; dark: boolean }

export default function Scene3D({ scene, a, b, dark }: Scene3DProps) {
  const base = useDeviceTier();
  const reduced = useReducedMotion();
  const visible = useDocumentVisible();
  const webgl = useMemo(hasWebGL, []);
  const [drop, setDrop] = useState(0);                 // steps the monitor has taken quality down
  const target = Math.max(0, ORDER.indexOf(scene));
  const prog = useRef(target);
  const scroll = useRef(0);

  if (reduced || !webgl) return null;
  const tier = STEPS[Math.min(2, STEPS.indexOf(base) + drop)];
  const q = QUALITY[tier];
  const bg = dark ? '#05070f' : '#eaf0f9';

  return (
    <Quiet>
      <Canvas
        aria-hidden
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        // Overlay UI sits above the canvas, so listen on the page root instead.
        eventSource={document.getElementById('root')!}
        eventPrefix="client"
        frameloop={visible ? 'always' : 'never'}
        dpr={tier === 'high' ? [1, 1.5] : 1}
        camera={{ position: [0, 0, CAM_Z - target * SPACING], fov: 45, far: 300 }}
        gl={{ antialias: tier !== 'low', powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <PerformanceMonitor onDecline={() => setDrop((d) => Math.min(2, d + 1))} flipflops={3} />
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, 22, 85]} />
        <Rig target={target} prog={prog} scroll={scroll} />
        <Floor a={a} dark={dark} />
        <Scenes target={target} prog={prog} scroll={scroll} a={a} b={b} dark={dark} q={q} hi={tier === 'high'} />
        {dark && tier === 'high' && (
          <EffectComposer multisampling={0} disableNormalPass>
            <Bloom mipmapBlur intensity={tier === 'high' ? 0.9 : 0.6} luminanceThreshold={0.6} luminanceSmoothing={0.2} />
          </EffectComposer>
        )}
      </Canvas>
    </Quiet>
  );
}
