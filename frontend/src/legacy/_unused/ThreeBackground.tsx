/* ═══════════════════════════════════════════════════════════════════
   CuraSense — Neural Web Background
   ───────────────────────────────────────────────────────────────────
   Design: "Health Intelligence" — a slow, dark, deep-space particle
   field where glowing nodes occasionally link up like a neural network.

   LAYERS
     1. Ambient star field  — 450 dim particles, pure GLSL drift, zero CPU
     2. Neural network nodes — 65 brighter nodes, slow drift, soft glow
     3. Connections         — hairline links between nearby nodes (max 30)
                              updated CPU-side each frame, O(n²) over 65 nodes
                              = 2080 pair checks/frame, ~0.01ms, negligible

   BUGS FIXED vs prior version
     ✓ try/catch on WebGLRenderer init (silent fail on unsupported GPUs)
     ✓ All geometries/materials disposed on unmount
     ✓ Own ScrollTrigger instance killed (no getAll().forEach nuclear option)
     ✓ animPos buffer allocated once outside render loop (no per-frame GC)
     ✓ Resize updates pixel-ratio uniform and camera aspect
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../App';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONN_DIST      = 18;

// Particle/node counts scale down on lower device tiers — see ../../animations/deviceTier.
const COUNTS_BY_TIER = {
  high: { bg: 450, node: 65, maxConnections: 30 },
  mid:  { bg: 250, node: 40, maxConnections: 20 },
  low:  { bg: 120, node: 24, maxConnections: 12 },
} as const;

interface ThreeBackgroundProps {
  quality?: keyof typeof COUNTS_BY_TIER;
}

export default function ThreeBackground({ quality = 'high' }: ThreeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { bg: BG_COUNT, node: NODE_COUNT, maxConnections: MAX_CONNECTIONS } = COUNTS_BY_TIER[quality];

  useEffect(() => {
    if (!mountRef.current) return;

    // ── RENDERER ──────────────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha:           true,
        antialias:       false,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const PR = Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(PR);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    mountRef.current.appendChild(renderer.domElement);

    // ── SCENE / CAMERA ─────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55, window.innerWidth / window.innerHeight, 0.1, 800
    );
    camera.position.z = 85;

    // Theme-aware palette
    const CYAN   = new THREE.Color(isDark ? 0x00e5ff : 0x0284c7);
    const VIOLET = new THREE.Color(isDark ? 0xa855f7 : 0x7c3aed);
    const BLEND  = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

    // ── 1. AMBIENT STAR FIELD ──────────────────────────────────────────
    // All animation in GLSL — zero CPU per frame after init.
    const bgPos   = new Float32Array(BG_COUNT * 3);
    const bgOff   = new Float32Array(BG_COUNT);
    const bgScale = new Float32Array(BG_COUNT);
    const bgCol   = new Float32Array(BG_COUNT * 3);

    for (let i = 0; i < BG_COUNT; i++) {
      bgPos[i * 3]     = (Math.random() - 0.5) * 200;
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 150;
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 90;
      bgOff[i]         = Math.random() * Math.PI * 2;
      bgScale[i]       = 0.2 + Math.random() * 0.65;
      const c          = Math.random() < 0.6 ? CYAN : VIOLET;
      bgCol[i * 3]     = c.r;
      bgCol[i * 3 + 1] = c.g;
      bgCol[i * 3 + 2] = c.b;
    }

    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    bgGeo.setAttribute('aOffset',  new THREE.BufferAttribute(bgOff, 1));
    bgGeo.setAttribute('aScale',   new THREE.BufferAttribute(bgScale, 1));
    bgGeo.setAttribute('aColor',   new THREE.BufferAttribute(bgCol, 3));

    const bgMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: PR } },
      vertexShader: /* glsl */`
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aOffset;
        attribute float aScale;
        attribute vec3  aColor;
        varying   vec3  vColor;
        varying   float vAlpha;
        void main() {
          vec3 p = position;
          p.x += sin(uTime * 0.10 + aOffset)        * 1.8;
          p.y += cos(uTime * 0.08 + aOffset * 1.31) * 1.4;
          p.z += sin(uTime * 0.06 + aOffset * 0.73) * 0.9;
          vec4 mv     = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aScale * uPixelRatio * (72.0 / max(1.0, -mv.z));
          float tw = 0.45 + 0.55 * sin(uTime * 0.65 + aOffset * 3.1);
          vAlpha = tw * 0.20 * aScale;
          vColor = aColor;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3  vColor;
        varying float vAlpha;
        void main() {
          vec2  uv = gl_PointCoord.xy - 0.5;
          float r  = length(uv);
          if (r > 0.5) discard;
          gl_FragColor = vec4(vColor, exp(-r * r * 10.0) * vAlpha);
        }
      `,
      transparent: true,
      blending:    BLEND,
      depthWrite:  false,
    });
    scene.add(new THREE.Points(bgGeo, bgMat));

    // ── 2. NEURAL NETWORK NODES ────────────────────────────────────────
    // Confined to a central ellipsoid — no side columns.
    const nodeBasePos  = new Float32Array(NODE_COUNT * 3);
    const nodeOff      = new Float32Array(NODE_COUNT);
    const nodeScaleArr = new Float32Array(NODE_COUNT);
    const nodeColorArr = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      const r     = 12 + Math.random() * 50;
      nodeBasePos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      nodeBasePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      nodeBasePos[i * 3 + 2] = (Math.random() - 0.5) * 28;
      nodeOff[i]             = Math.random() * Math.PI * 2;
      nodeScaleArr[i]        = 0.5 + Math.random() * 1.1;
      const c                = Math.random() < 0.55 ? CYAN : VIOLET;
      nodeColorArr[i * 3]     = c.r;
      nodeColorArr[i * 3 + 1] = c.g;
      nodeColorArr[i * 3 + 2] = c.b;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodeBasePos.slice(), 3));
    nodeGeo.setAttribute('aOffset',  new THREE.BufferAttribute(nodeOff, 1));
    nodeGeo.setAttribute('aScale',   new THREE.BufferAttribute(nodeScaleArr, 1));
    nodeGeo.setAttribute('aColor',   new THREE.BufferAttribute(nodeColorArr, 3));

    const nodeMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: PR } },
      vertexShader: /* glsl */`
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aOffset;
        attribute float aScale;
        attribute vec3  aColor;
        varying   vec3  vColor;
        varying   float vAlpha;
        void main() {
          vec3 p = position;
          p.x += sin(uTime * 0.13 + aOffset)        * 2.4;
          p.y += cos(uTime * 0.10 + aOffset * 1.42) * 2.0;
          p.z += sin(uTime * 0.07 + aOffset * 0.88) * 1.3;
          vec4 mv     = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aScale * uPixelRatio * (185.0 / max(1.0, -mv.z));
          float pulse = 0.62 + 0.38 * sin(uTime * 0.52 + aOffset * 2.4);
          vAlpha = pulse * (0.48 + 0.32 * aScale);
          vColor = aColor;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3  vColor;
        varying float vAlpha;
        void main() {
          vec2  uv   = gl_PointCoord.xy - 0.5;
          float r    = length(uv);
          if (r > 0.5) discard;
          float core = exp(-r * r * 16.0);
          float halo = exp(-r * r * 3.2) * 0.36;
          gl_FragColor = vec4(vColor, (core + halo) * vAlpha);
        }
      `,
      transparent: true,
      blending:    BLEND,
      depthWrite:  false,
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    // ── 3. NEURAL CONNECTIONS ──────────────────────────────────────────
    // Hairline links between nearby nodes. Very low opacity — structural
    // hint only, not a dominant visual element.
    const connPos = new Float32Array(MAX_CONNECTIONS * 6);
    const connCol = new Float32Array(MAX_CONNECTIONS * 6);
    const connGeo = new THREE.BufferGeometry();
    connGeo.setAttribute('position', new THREE.BufferAttribute(connPos, 3));
    connGeo.setAttribute('color',    new THREE.BufferAttribute(connCol, 3));

    const connMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent:  true,
      opacity:      isDark ? 0.10 : 0.06,
      blending:     BLEND,
      depthWrite:   false,
    });
    scene.add(new THREE.LineSegments(connGeo, connMat));

    // Reused per-frame — allocated once, no GC pressure.
    const animPos = new Float32Array(NODE_COUNT * 3);

    // ── INTRO ──────────────────────────────────────────────────────────
    // Fade scene in gently so it doesn't pop.
    scene.scale.setScalar(0.05);
    gsap.to(scene.scale, { x: 1, y: 1, z: 1, duration: 2.8, ease: 'expo.out' });

    // ── SCROLL ─────────────────────────────────────────────────────────
    let scrollProg = 0;
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start:   'top top',
      end:     'bottom bottom',
      onUpdate: (self) => { scrollProg = self.progress; },
    });

    // ── MOUSE PARALLAX ─────────────────────────────────────────────────
    const mouse   = { x: 0, y: 0 };
    const mTarget = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mTarget.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── RENDER LOOP ────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId  = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      bgMat.uniforms.uTime.value   = t;
      nodeMat.uniforms.uTime.value = t;

      // Smooth mouse damp
      mouse.x += (mTarget.x - mouse.x) * 0.04;
      mouse.y += (mTarget.y - mouse.y) * 0.04;

      // Scene rotation: idle sway + mouse parallax + scroll Y spin
      scene.rotation.y = mouse.x * 0.12 + Math.sin(t * 0.04) * 0.08 + scrollProg * 0.55;
      scene.rotation.x = mouse.y * 0.07 + Math.sin(t * 0.03) * 0.04;

      // Mirror vertex shader drift for CPU-side connection calculations.
      for (let i = 0; i < NODE_COUNT; i++) {
        const off = nodeOff[i];
        animPos[i * 3]     = nodeBasePos[i * 3]     + Math.sin(t * 0.13 + off)        * 2.4;
        animPos[i * 3 + 1] = nodeBasePos[i * 3 + 1] + Math.cos(t * 0.10 + off * 1.42) * 2.0;
        animPos[i * 3 + 2] = nodeBasePos[i * 3 + 2] + Math.sin(t * 0.07 + off * 0.88) * 1.3;
      }

      // O(n²) over 65 nodes = 2080 checks. ~0.01ms/frame at 60fps.
      let vi = 0, lc = 0;
      outer:
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = animPos[i * 3]     - animPos[j * 3];
          const dy = animPos[i * 3 + 1] - animPos[j * 3 + 1];
          const dz = animPos[i * 3 + 2] - animPos[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < CONN_DIST * CONN_DIST) {
            connPos[vi]   = animPos[i*3];   connPos[vi+1] = animPos[i*3+1]; connPos[vi+2] = animPos[i*3+2];
            connPos[vi+3] = animPos[j*3];   connPos[vi+4] = animPos[j*3+1]; connPos[vi+5] = animPos[j*3+2];
            connCol[vi]   = nodeColorArr[i*3]; connCol[vi+1] = nodeColorArr[i*3+1]; connCol[vi+2] = nodeColorArr[i*3+2];
            connCol[vi+3] = nodeColorArr[j*3]; connCol[vi+4] = nodeColorArr[j*3+1]; connCol[vi+5] = nodeColorArr[j*3+2];
            vi += 6;
            if (++lc >= MAX_CONNECTIONS) break outer;
          }
        }
      }
      connGeo.setDrawRange(0, lc * 2);
      connGeo.attributes.position.needsUpdate = true;
      connGeo.attributes.color.needsUpdate    = true;

      renderer.render(scene, camera);
    };
    animate();

    // ── RESIZE ─────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      const pr = Math.min(window.devicePixelRatio, 1.5);
      bgMat.uniforms.uPixelRatio.value   = pr;
      nodeMat.uniforms.uPixelRatio.value = pr;
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    // ── CLEANUP ────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      st.kill();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      bgGeo.dispose();
      bgMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      connGeo.dispose();
      connMat.dispose();
      renderer.dispose();
    };
  }, [isDark, BG_COUNT, NODE_COUNT, MAX_CONNECTIONS]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: isDark ? 'screen' : 'normal' }}
    />
  );
}
