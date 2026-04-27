// src/app/components/ScrollThreeBackground.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../App';

gsap.registerPlugin(ScrollTrigger);

const N = 15000;

function buildDNA(c1: THREE.Color, c2: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const t = (i / N - 0.5) * 400;
    const a = t * 0.1;
    const r = 35;
    let cx, cy, cz, cc: THREE.Color;
    if (i % 3 === 0) {
      cx = Math.cos(a) * r; cy = t; cz = Math.sin(a) * r; cc = c1;
    } else if (i % 3 === 1) {
      cx = Math.cos(a + Math.PI) * r; cy = t; cz = Math.sin(a + Math.PI) * r; cc = c2;
    } else {
      const f = Math.random();
      cx = Math.cos(a) * r * f + Math.cos(a + Math.PI) * r * (1 - f);
      cy = t; cz = Math.sin(a) * r * f + Math.sin(a + Math.PI) * r * (1 - f);
      cc = c1.clone().lerp(c2, f);
    }
    p[i3] = cx + (Math.random() - .5) * 4;
    p[i3 + 1] = cy; p[i3 + 2] = cz + (Math.random() - .5) * 4;
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildSphere(c1: THREE.Color, c2: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const phi = Math.acos(2 * Math.random() - 1);
    const th = Math.random() * Math.PI * 2;
    const r = 100 + (Math.random() - .5) * 20;
    p[i3] = r * Math.sin(phi) * Math.cos(th);
    p[i3 + 1] = r * Math.sin(phi) * Math.sin(th);
    p[i3 + 2] = r * Math.cos(phi);
    const cc = Math.random() > .5 ? c1 : c2;
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildGrid(c1: THREE.Color, c2: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const layer = Math.floor(i / (N / 6));
    const f = layer / 5;
    const cc = c1.clone().lerp(c2, f);
    p[i3] = (layer - 2.5) * 80 + (Math.random() - .5) * 20;
    p[i3 + 1] = ((i % (N / 6)) / (N / 6) - .5) * 250 + (Math.random() - .5) * 10;
    p[i3 + 2] = (Math.random() - .5) * 40;
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildWave(c1: THREE.Color, c2: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const sq = Math.floor(Math.sqrt(N));
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const xi = i % sq, zi = Math.floor(i / sq);
    const x = (xi / sq - .5) * 300, z = (zi / sq - .5) * 300;
    const y = Math.sin(x * .05 + z * .05) * 40 + (Math.random() - .5) * 5;
    p[i3] = x; p[i3 + 1] = y; p[i3 + 2] = z;
    const f = (y + 40) / 80;
    const cc = c1.clone().lerp(c2, f);
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildRings(c1: THREE.Color, c3: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const ring = Math.floor(i / (N / 7));
    const r = 25 + ring * 25;
    const th = Math.random() * Math.PI * 2;
    p[i3] = Math.cos(th) * r + (Math.random() - .5) * 6;
    p[i3 + 1] = (Math.random() - .5) * 20;
    p[i3 + 2] = Math.sin(th) * r + (Math.random() - .5) * 6;
    const cc = c1.clone().lerp(c3, ring / 6);
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildGalaxy(c1: THREE.Color, c2: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const arm = i % 3;
    const t = Math.pow(Math.random(), 1.5);
    const r = 10 + t * 160;
    const spin = t * Math.PI * 6;
    const branch = (arm / 3) * Math.PI * 2;
    const rx = Math.pow(Math.random(), 3) * (Math.random() < .5 ? 1 : -1) * 22;
    const ry = Math.pow(Math.random(), 3) * (Math.random() < .5 ? 1 : -1) * 8;
    const rz = Math.pow(Math.random(), 3) * (Math.random() < .5 ? 1 : -1) * 22;
    p[i3] = Math.cos(branch + spin) * r + rx;
    p[i3 + 1] = ry;
    p[i3 + 2] = Math.sin(branch + spin) * r + rz;
    const cc = (arm === 0 ? c1 : c2).clone().lerp(new THREE.Color(0xffffff), t * .3);
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildShield(c3: THREE.Color, cG: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const layer = Math.floor(i / (N / 10));
    const r = 15 + layer * 16;
    const th = (i / N) * Math.PI * 2 * (layer + 1);
    p[i3] = Math.cos(th) * r + (Math.random() - .5) * 5;
    p[i3 + 1] = Math.sin(th) * r + (Math.random() - .5) * 5;
    p[i3 + 2] = (Math.random() - .5) * 25;
    const cc = cG.clone().lerp(c3, layer / 9);
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildConverge(c1: THREE.Color, c2: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const phi = Math.acos(2 * Math.random() - 1);
    const th = Math.random() * Math.PI * 2;
    const r = 5 + Math.random() * 12;
    p[i3] = r * Math.sin(phi) * Math.cos(th);
    p[i3 + 1] = r * Math.sin(phi) * Math.sin(th);
    p[i3 + 2] = r * Math.cos(phi);
    const cc = c1.clone().lerp(c2, Math.random());
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

export default function ScrollThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!mountRef.current) return;

    const c1 = new THREE.Color(isDark ? 0x22d3ee : 0x0284c7);
    const c2 = new THREE.Color(isDark ? 0xd946ef : 0x9333ea);
    const c3 = new THREE.Color(isDark ? 0x8b5cf6 : 0x6d28d9);
    const cG = new THREE.Color(isDark ? 0x10b981 : 0x059669);

    const scenes = [
      buildDNA(c1, c2),
      buildSphere(c1, c3),
      buildGrid(c1, c2),
      buildWave(c1, c2),
      buildRings(c1, c3),
      buildGalaxy(c1, c2),
      buildShield(c3, cG),
      buildConverge(c1, c2),
    ];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
    camera.position.z = 250;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch { return; }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const positions = new Float32Array(scenes[0].p);
    const colors = new Float32Array(scenes[0].col);
    const scales = new Float32Array(N);
    for (let i = 0; i < N; i++) scales[i] = 0.5 + Math.random() * 2;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 0.9 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float scale;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDist;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.x += sin(pos.y * 0.04 + uTime * 0.6) * 2.0;
          pos.z += cos(pos.x * 0.04 + uTime * 0.5) * 2.0;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = scale * uPixelRatio * (250.0 / vDist);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vDist;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.05, d);
          float fade = smoothstep(600.0, 70.0, vDist);
          gl_FragColor = vec4(vColor, glow * fade * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let currentScene = 0;

    const morphTo = (idx: number) => {
      if (idx === currentScene || !scenes[idx]) return;
      const from = scenes[currentScene].p;
      const to = scenes[idx].p;
      const toCol = scenes[idx].col;
      const obj = { t: 0 };
      
      gsap.to(obj, {
        t: 1,
        duration: 2.2,
        ease: 'expo.inOut',
        onUpdate: () => {
          for (let i = 0; i < N * 3; i++) {
            positions[i] = from[i] + (to[i] - from[i]) * obj.t;
            colors[i] = colors[i] + (toCol[i] - colors[i]) * obj.t;
          }
          geo.attributes.position.needsUpdate = true;
          geo.attributes.color.needsUpdate = true;
        },
        onComplete: () => { currentScene = idx; }
      });
      currentScene = idx;
    };

    const sectionIds = [
      '#section-hero', '#section-stats', '#section-features',
      '#section-howitworks', '#section-architecture', '#section-diseases',
      '#section-trust', '#section-cta'
    ];
    
    setTimeout(() => {
      sectionIds.forEach((id, i) => {
        const el = document.querySelector(id);
        if (el) {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => morphTo(i),
            onEnterBack: () => morphTo(i),
          });
        }
      });
    }, 500);

    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - .5) * 2;
      my = (e.clientY / window.innerHeight - .5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    gsap.fromTo(mat.uniforms.uOpacity, { value: 0 }, { value: isDark ? 0.95 : 0.7, duration: 2.5 });
    gsap.fromTo(points.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, duration: 3, ease: 'expo.out' });

    const clock = new THREE.Clock();
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      mat.uniforms.uTime.value = clock.getElapsedTime();
      points.rotation.y += 0.002;
      camera.position.x += (mx * 20 - camera.position.x) * 0.05;
      camera.position.y += (-my * 20 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
      geo.dispose(); mat.dispose(); renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, mixBlendMode: isDark ? 'screen' : 'multiply' }}
    />
  );
}