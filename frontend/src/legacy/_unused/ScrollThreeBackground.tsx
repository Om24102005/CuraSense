import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

// Particle counts sized for clean 60fps on mid-tier GPUs.
// NODE_COUNT=80 → 3160 pair-checks/frame (negligible). No side columns.
const BG_COUNT       = 550;
const NODE_COUNT     = 80;
const MAX_CONNECTIONS = 35;
const CONN_DIST      = 18;

const ScrollThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ── RENDERER ────────────────────────────────────────────────────
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
    const PR = Math.min(window.devicePixelRatio, 1.5);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(PR);
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%', pointerEvents: 'none',
    });
    mountRef.current.appendChild(renderer.domElement);

    // ── SCENE / CAMERA ───────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 800
    );
    camera.position.z = 80;

    const CYAN   = new THREE.Color(0x00e5ff);
    const VIOLET = new THREE.Color(0xa855f7);

    // ── 1. AMBIENT STAR FIELD ────────────────────────────────────────
    // Pure GLSL drift — zero CPU per frame after init.
    const bgPos    = new Float32Array(BG_COUNT * 3);
    const bgOff    = new Float32Array(BG_COUNT);
    const bgScale  = new Float32Array(BG_COUNT);
    const bgCol    = new Float32Array(BG_COUNT * 3);

    for (let i = 0; i < BG_COUNT; i++) {
      bgPos[i * 3]     = (Math.random() - 0.5) * 180;
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 130;
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      bgOff[i]         = Math.random() * Math.PI * 2;
      bgScale[i]       = 0.2 + Math.random() * 0.6;
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
          gl_PointSize = aScale * uPixelRatio * (70.0 / max(1.0, -mv.z));
          float tw = 0.45 + 0.55 * sin(uTime * 0.7 + aOffset * 3.1);
          vAlpha = tw * 0.22 * aScale;
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
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    scene.add(new THREE.Points(bgGeo, bgMat));

    // ── 2. NEURAL NETWORK NODES ──────────────────────────────────────
    // Confined to a central ellipsoid — no side columns ever.
    const nodeBasePos  = new Float32Array(NODE_COUNT * 3);
    const nodeOff      = new Float32Array(NODE_COUNT);
    const nodeScale    = new Float32Array(NODE_COUNT);
    const nodeColorArr = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      const r     = 15 + Math.random() * 45;
      nodeBasePos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      nodeBasePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      nodeBasePos[i * 3 + 2] = (Math.random() - 0.5) * 25;
      nodeOff[i]             = Math.random() * Math.PI * 2;
      nodeScale[i]           = 0.5 + Math.random() * 1.1;
      const c                = Math.random() < 0.55 ? CYAN : VIOLET;
      nodeColorArr[i * 3]     = c.r;
      nodeColorArr[i * 3 + 1] = c.g;
      nodeColorArr[i * 3 + 2] = c.b;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodeBasePos.slice(), 3));
    nodeGeo.setAttribute('aOffset',  new THREE.BufferAttribute(nodeOff, 1));
    nodeGeo.setAttribute('aScale',   new THREE.BufferAttribute(nodeScale, 1));
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
          p.x += sin(uTime * 0.13 + aOffset)        * 2.2;
          p.y += cos(uTime * 0.10 + aOffset * 1.42) * 2.0;
          p.z += sin(uTime * 0.07 + aOffset * 0.88) * 1.3;
          vec4 mv     = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aScale * uPixelRatio * (180.0 / max(1.0, -mv.z));
          float pulse = 0.6 + 0.4 * sin(uTime * 0.55 + aOffset * 2.4);
          vAlpha = pulse * (0.5 + 0.35 * aScale);
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
          float halo = exp(-r * r * 3.2) * 0.38;
          gl_FragColor = vec4(vColor, (core + halo) * vAlpha);
        }
      `,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    // ── 3. NEURAL CONNECTIONS ────────────────────────────────────────
    // Hairline links between nearby nodes. Very low opacity — hint only.
    const connPos = new Float32Array(MAX_CONNECTIONS * 6);
    const connCol = new Float32Array(MAX_CONNECTIONS * 6);
    const connGeo = new THREE.BufferGeometry();
    connGeo.setAttribute('position', new THREE.BufferAttribute(connPos, 3));
    connGeo.setAttribute('color',    new THREE.BufferAttribute(connCol, 3));
    const connMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent:  true,
      opacity:      0.10,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false,
    });
    scene.add(new THREE.LineSegments(connGeo, connMat));

    // Allocated once — reused every frame to avoid GC pressure.
    const animPos = new Float32Array(NODE_COUNT * 3);

    // ── SCROLL ────────────────────────────────────────────────────────
    let scrollProg = 0;
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start:   'top top',
      end:     'bottom bottom',
      onUpdate: (self) => { scrollProg = self.progress; },
    });

    // ── MOUSE ─────────────────────────────────────────────────────────
    const mouse   = { x: 0, y: 0 };
    const mTarget = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mTarget.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── RENDER LOOP ───────────────────────────────────────────────────
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
      scene.rotation.y = mouse.x * 0.12 + Math.sin(t * 0.04) * 0.08 + scrollProg * 0.6;
      scene.rotation.x = mouse.y * 0.07 + Math.sin(t * 0.03) * 0.04;

      // Compute CPU-side animated positions to match vertex shader drift.
      // Must mirror shader math exactly so connection endpoints are accurate.
      for (let i = 0; i < NODE_COUNT; i++) {
        const off = nodeOff[i];
        animPos[i * 3]     = nodeBasePos[i * 3]     + Math.sin(t * 0.13 + off)        * 2.2;
        animPos[i * 3 + 1] = nodeBasePos[i * 3 + 1] + Math.cos(t * 0.10 + off * 1.42) * 2.0;
        animPos[i * 3 + 2] = nodeBasePos[i * 3 + 2] + Math.sin(t * 0.07 + off * 0.88) * 1.3;
      }

      // Connection pass — O(n²) on 80 nodes = 3160 checks, ~0.01ms/frame.
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

    // ── RESIZE ────────────────────────────────────────────────────────
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

    // ── CLEANUP ───────────────────────────────────────────────────────
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
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100vw',
        height:        '100vh',
        zIndex:        0,
        pointerEvents: 'none',
        overflow:      'hidden',
      }}
    />
  );
};

export default ScrollThreeBackground;
