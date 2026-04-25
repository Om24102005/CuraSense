import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../App';

gsap.registerPlugin(ScrollTrigger);

const N = 12000;

function buildDNA(c1: THREE.Color, c2: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const t = (i / N - 0.5) * 360;
    const a = t * 0.09;
    const r = 28;
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
    p[i3] = cx + (Math.random() - .5) * 3;
    p[i3 + 1] = cy; p[i3 + 2] = cz + (Math.random() - .5) * 3;
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
    const r = 90 + (Math.random() - .5) * 15;
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
    const layer = Math.floor(i / (N / 5));
    const f = layer / 4;
    const cc = c1.clone().lerp(c2, f);
    p[i3] = (layer - 2) * 70 + (Math.random() - .5) * 15;
    p[i3 + 1] = ((i % (N / 5)) / (N / 5) - .5) * 220 + (Math.random() - .5) * 8;
    p[i3 + 2] = (Math.random() - .5) * 30;
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
    const x = (xi / sq - .5) * 280, z = (zi / sq - .5) * 280;
    const y = Math.sin(x * .04 + z * .04) * 35 + (Math.random() - .5) * 4;
    p[i3] = x; p[i3 + 1] = y; p[i3 + 2] = z;
    const f = (y + 35) / 70;
    const cc = c1.clone().lerp(c2, f);
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildRings(c1: THREE.Color, c3: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const ring = Math.floor(i / (N / 6));
    const r = 20 + ring * 22;
    const th = Math.random() * Math.PI * 2;
    p[i3] = Math.cos(th) * r + (Math.random() - .5) * 5;
    p[i3 + 1] = (Math.random() - .5) * 15;
    p[i3 + 2] = Math.sin(th) * r + (Math.random() - .5) * 5;
    const cc = c1.clone().lerp(c3, ring / 5);
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildGalaxy(c1: THREE.Color, c2: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const arm = i % 2;
    const t = Math.random();
    const r = 8 + t * 140;
    const spin = t * Math.PI * 5;
    const branch = (arm / 2) * Math.PI * 2;
    const rx = Math.pow(Math.random(), 3) * (Math.random() < .5 ? 1 : -1) * 18;
    const ry = Math.pow(Math.random(), 3) * (Math.random() < .5 ? 1 : -1) * 6;
    const rz = Math.pow(Math.random(), 3) * (Math.random() < .5 ? 1 : -1) * 18;
    p[i3] = Math.cos(branch + spin) * r + rx;
    p[i3 + 1] = ry;
    p[i3 + 2] = Math.sin(branch + spin) * r + rz;
    const cc = (arm === 0 ? c1 : c2).clone().lerp(new THREE.Color(0xffffff), t * .25);
    col[i3] = cc.r; col[i3 + 1] = cc.g; col[i3 + 2] = cc.b;
  }
  return { p, col };
}

function buildShield(c3: THREE.Color, cG: THREE.Color) {
  const p = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const layer = Math.floor(i / (N / 8));
    const r = 10 + layer * 15;
    const th = (i / N) * Math.PI * 2 * (layer + 1);
    p[i3] = Math.cos(th) * r + (Math.random() - .5) * 4;
    p[i3 + 1] = Math.sin(th) * r + (Math.random() - .5) * 4;
    p[i3 + 2] = (Math.random() - .5) * 20;
    const cc = cG.clone().lerp(c3, layer / 7);
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
    const r = 4 + Math.random() * 10;
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

    const c1 = new THREE.Color(isDark ? 0x00e5ff : 0x2563eb);
    const c2 = new THREE.Color(isDark ? 0xd946ef : 0xc026d3);
    const c3 = new THREE.Color(isDark ? 0x8b5cf6 : 0x7c3aed);
    const cG = new THREE.Color(0x10b981);

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
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 200;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch { return; }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Current working positions (start with DNA)
    const positions = new Float32Array(scenes[0].p);
    const colors = new Float32Array(scenes[0].col);
    const scales = new Float32Array(N);
    for (let i = 0; i < N; i++) scales[i] = 0.5 + Math.random() * 1.5;

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
          pos.x += sin(pos.y * 0.03 + uTime * 0.5) * 1.5;
          pos.z += cos(pos.x * 0.03 + uTime * 0.4) * 1.5;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = scale * uPixelRatio * (220.0 / vDist);
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
          float fade = smoothstep(500.0, 60.0, vDist);
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

    // Morph to a target scene
    const morphState = { progress: 0, fromScene: 0, toScene: 0 };
    let currentScene = 0;

    const morphTo = (idx: number) => {
      if (idx === currentScene) return;
      const from = scenes[currentScene].p;
      const to = scenes[idx].p;
      const toCol = scenes[idx].col;
      const obj = { t: 0 };
      gsap.to(obj, {
        t: 1,
        duration: 1.8,
        ease: 'power2.inOut',
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

    // ScrollTrigger per section
    const sectionIds = [
      '#section-hero', '#section-stats', '#section-features',
      '#section-howitworks', '#section-architecture', '#section-diseases',
      '#section-trust', '#section-cta'
    ];
    sectionIds.forEach((id, i) => {
      ScrollTrigger.create({
        trigger: id,
        start: 'top center',
        onEnter: () => morphTo(i),
        onEnterBack: () => morphTo(i),
      });
    });

    // Mouse parallax
    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - .5) * 2;
      my = (e.clientY / window.innerHeight - .5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    // Entrance
    gsap.fromTo(mat.uniforms.uOpacity, { value: 0 }, { value: isDark ? 0.9 : 0.6, duration: 2 });
    gsap.fromTo(points.scale, { x: .1, y: .1, z: .1 }, { x: 1, y: 1, z: 1, duration: 2.5, ease: 'expo.out' });

    const clock = new THREE.Clock();
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      mat.uniforms.uTime.value = clock.getElapsedTime();
      points.rotation.y += 0.0015;
      camera.position.x += (mx * 15 - camera.position.x) * 0.04;
      camera.position.y += (-my * 15 - camera.position.y) * 0.04;
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
      style={{ zIndex: 1, mixBlendMode: isDark ? 'screen' : 'multiply' }}
    />
  );
}
