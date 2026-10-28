/* ═══════════════════════════════════════════════════════
   CuraSense — Cinematic Intro
   Three.js galaxy → DNA implosion → text reveal
   GSAP master timeline drives everything.
   (Theatre.js Studio was removed — no runtime value, just
    dev-panel clutter.)
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface CinematicSequenceProps {
  onComplete?: () => void;
}

const PARTICLE_COUNT = 90000;

function buildHelixTargets(): Float32Array {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = (i / PARTICLE_COUNT - 0.5) * 220;
    const strand = i % 4;
    const radius = 22 + Math.sin(t * 0.05) * 2;
    if (strand === 0) {
      const angle = t * 0.16;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = t;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    } else if (strand === 1) {
      const angle = t * 0.16 + Math.PI;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = t;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    } else if (strand === 2) {
      const baseT = (Math.floor(i / 20) * 20 / PARTICLE_COUNT - 0.5) * 220;
      const angle1 = baseT * 0.16;
      const angle2 = baseT * 0.16 + Math.PI;
      const mix = (i % 20) / 20;
      arr[i * 3] = Math.cos(angle1) * radius * (1 - mix) + Math.cos(angle2) * radius * mix;
      arr[i * 3 + 1] = baseT;
      arr[i * 3 + 2] = Math.sin(angle1) * radius * (1 - mix) + Math.sin(angle2) * radius * mix;
    } else {
      const r = 35 + Math.random() * 50;
      const phi = Math.acos(Math.random() * 2 - 1);
      const theta = Math.random() * Math.PI * 2;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) + (Math.random() - 0.5) * 100;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
  }
  return arr;
}

function buildRandomStart(): Float32Array {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
    arr[i] = (Math.random() - 0.5) * 800;
  }
  return arr;
}

export default function CinematicSequence({ onComplete }: CinematicSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    canvasRef.current.appendChild(renderer.domElement);

    const helixTargets = buildHelixTargets();
    const randomStart = buildRandomStart();

    const expansionDirs = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = helixTargets[i * 3], y = helixTargets[i * 3 + 1], z = helixTargets[i * 3 + 2];
      const len = Math.sqrt(x * x + y * y + z * z) || 1;
      expansionDirs[i * 3] = x / len;
      expansionDirs[i * 3 + 1] = y / len;
      expansionDirs[i * 3 + 2] = z / len;
    }

    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const cyan = new THREE.Color(0x00e5ff);
    const violet = new THREE.Color(0xa855f7);
    const pink = new THREE.Color(0xec4899);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = Math.random();
      const c = r < 0.4 ? cyan : r < 0.85 ? violet : pink;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const scales = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      scales[i] = 0.4 + Math.random() * 1.6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(randomStart.slice(), 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randomStart, 3));
    geo.setAttribute('aHelix', new THREE.BufferAttribute(helixTargets, 3));
    geo.setAttribute('aExpand', new THREE.BufferAttribute(expansionDirs, 3));
    geo.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uConvergence: { value: 0 },
        uExpansion: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uConvergence;
        uniform float uExpansion;
        uniform float uPixelRatio;
        attribute vec3 aRandom;
        attribute vec3 aHelix;
        attribute vec3 aExpand;
        attribute float aScale;
        attribute vec3 customColor;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vGlow;

        void main() {
          vColor = customColor;
          float drift = (1.0 - uConvergence);
          vec3 noiseOff = vec3(
            sin(uTime * 0.5 + aRandom.x * 0.04) * drift * 6.0,
            cos(uTime * 0.4 + aRandom.y * 0.04) * drift * 6.0,
            sin(uTime * 0.45 + aRandom.z * 0.04) * drift * 6.0
          );
          vec3 helixPos = aHelix + aExpand * uExpansion * 80.0;
          vec3 pos = mix(aRandom + noiseOff, helixPos, uConvergence);

          if (uConvergence > 0.5) {
            float shimmer = sin(uTime * 2.0 + pos.y * 0.1) * 0.5 + 0.5;
            pos += aExpand * shimmer * 0.6 * (uConvergence - 0.5) * 2.0;
          }

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          vAlpha = smoothstep(-300.0, 0.0, mvPos.z);
          vGlow = 1.0 + uConvergence * 1.5;
          float ps = aScale * uPixelRatio * (220.0 / -mvPos.z);
          gl_PointSize = clamp(ps, 0.5, 14.0);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vGlow;

        void main() {
          vec2 xy = gl_PointCoord.xy - 0.5;
          float d = length(xy);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          float glow = exp(-d * d * 14.0);
          float a = (core * 0.7 + glow * 0.5) * vAlpha * uOpacity;
          if (a < 0.005) discard;
          gl_FragColor = vec4(vColor * vGlow * (1.0 + glow * 0.6), a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    const beamGeo = new THREE.PlaneGeometry(800, 4);
    const beamMatProto = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float d = abs(vUv.y - 0.5) * 2.0;
          float falloff = 1.0 - d;
          float pulse = sin(vUv.x * 20.0 + uTime * 2.0) * 0.5 + 0.5;
          vec3 col = mix(vec3(0.13, 0.9, 1.0), vec3(0.66, 0.33, 0.97), vUv.x);
          gl_FragColor = vec4(col * falloff * pulse, falloff * pulse * uOpacity * 0.4);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const beams: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const beam = new THREE.Mesh(beamGeo, beamMatProto.clone());
      beam.rotation.z = (i / 5) * Math.PI;
      beam.position.z = -50;
      scene.add(beam);
      beams.push(beam);
    }

    const state = { convergence: 0, cameraZ: 220, opacity: 0, expansion: 0, rotationY: 0, beamOpacity: 0 };

    // Choreography below was authored at ~10s; we compress the entire
    // master timeline so the intro runs in ~4.5s INCLUDING the 0.6s
    // fadeout. Adjust TARGET_SECONDS to retune.
    const TARGET_SECONDS = 3.9;
    const ORIGINAL_END = 8.8;
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => { setVisible(false); onComplete?.(); }
        });
      }
    });
    tl.timeScale(ORIGINAL_END / TARGET_SECONDS);

    tl.to(state, { opacity: 1, duration: 1.4, ease: 'power1.out' });

    tl.fromTo(ringRef.current,
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 0.6, rotation: 0, duration: 1.8, ease: 'power3.out' },
      0.3
    );

    tl.to(state, { convergence: 1, duration: 3, ease: 'power3.inOut' }, 0.8);
    tl.to(state, { cameraZ: 80, duration: 2.5, ease: 'power2.inOut' }, 2);
    tl.to(state, { beamOpacity: 1, duration: 0.8, ease: 'power2.in' }, 3.5);

    tl.fromTo(tagRef.current,
      { opacity: 0, letterSpacing: '1em', filter: 'blur(10px)' },
      { opacity: 1, letterSpacing: '0.5em', filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
      4.2
    );

    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.cin-char');
      tl.fromTo(chars,
        { opacity: 0, y: 80, rotationX: -90, scale: 0.4, filter: 'blur(20px)' },
        { opacity: 1, y: 0, rotationX: 0, scale: 1, filter: 'blur(0px)', duration: 1, stagger: 0.06, ease: 'expo.out' },
        4.5
      );
    }

    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 30, letterSpacing: '0.8em', filter: 'blur(8px)' },
      { opacity: 1, y: 0, letterSpacing: '0.4em', filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
      5.2
    );

    tl.to(state, { expansion: 1, duration: 2.5, ease: 'power2.inOut' }, 5.5);

    tl.fromTo(progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.8, ease: 'power2.inOut' },
      5.5
    );

    tl.to({}, { duration: 0.8 });

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      mat.uniforms.uTime.value = time;
      mat.uniforms.uOpacity.value = state.opacity;
      mat.uniforms.uConvergence.value = state.convergence;
      mat.uniforms.uExpansion.value = state.expansion;

      camera.position.z = state.cameraZ;
      particles.rotation.y = time * 0.05 + state.rotationY;
      particles.rotation.x = Math.sin(time * 0.1) * 0.05;

      beams.forEach((b, i) => {
        const m = b.material as THREE.ShaderMaterial;
        m.uniforms.uTime.value = time;
        m.uniforms.uOpacity.value = state.beamOpacity;
        b.rotation.z = (i / 5) * Math.PI + time * 0.1;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      tl.kill();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current?.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      geo.dispose();
      mat.dispose();
      beamGeo.dispose();
      beams.forEach(b => (b.material as THREE.Material).dispose());
      renderer.dispose();
    };
  }, [onComplete]);

  if (!visible) return null;

  const title = 'CuraSense';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0118 0%, #000005 70%, #000000 100%)' }}
    >
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,5,0.65) 80%, rgba(0,0,5,1) 100%)' }}
      />

      <div ref={ringRef} className="absolute pointer-events-none flex items-center justify-center" style={{ opacity: 0 }}>
        <div
          className="rounded-full"
          style={{
            width: 'min(80vmin, 800px)',
            height: 'min(80vmin, 800px)',
            border: '1px solid rgba(168, 85, 247, 0.18)',
            boxShadow: 'inset 0 0 80px rgba(168, 85, 247, 0.08), 0 0 80px rgba(34, 211, 238, 0.08)',
            position: 'absolute',
          }}
        />
        <div
          className="rounded-full"
          style={{
            width: 'min(50vmin, 500px)',
            height: 'min(50vmin, 500px)',
            border: '1px solid rgba(34, 211, 238, 0.22)',
            position: 'absolute',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4">
        <div ref={tagRef} style={{ opacity: 0, marginBottom: '1.8rem' }}>
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              fontFamily: "'Michroma', sans-serif",
              fontSize: 'clamp(0.55rem, 1vw, 0.7rem)',
              fontWeight: 700,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: 'rgba(34, 211, 238, 0.85)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              background: 'rgba(34, 211, 238, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22d3ee' }} />
            Initializing Diagnostic Core
          </span>
        </div>

        <div ref={titleRef} className="flex" style={{ perspective: '900px', marginBottom: '1.5rem' }}>
          {title.split('').map((char, i) => (
            <span
              key={i}
              className="cin-char inline-block"
              style={{
                fontFamily: "'Michroma', sans-serif",
                fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                background: i < 4
                  ? 'linear-gradient(135deg, #22d3ee 0%, #67e8f9 50%, #a5f3fc 100%)'
                  : 'linear-gradient(135deg, #a855f7 0%, #d946ef 50%, #f0abfc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 60px rgba(168, 85, 247, 0.3))',
                opacity: 0,
                transformOrigin: '50% 80%',
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <p
          ref={subtitleRef}
          style={{
            opacity: 0,
            fontFamily: "'Michroma', sans-serif",
            fontSize: 'clamp(0.7rem, 1.2vw, 0.95rem)',
            fontWeight: 600,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '3.5rem',
          }}
        >
          AI-Powered Health Intelligence
        </p>

        <div className="relative w-64 h-[2px] overflow-hidden rounded-full" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
          <div
            ref={progressRef}
            className="h-full origin-left rounded-full"
            style={{
              background: 'linear-gradient(90deg, #22d3ee, #a855f7, #ec4899)',
              transform: 'scaleX(0)',
              boxShadow: '0 0 12px rgba(34, 211, 238, 0.8), 0 0 24px rgba(168, 85, 247, 0.5)',
            }}
          />
        </div>

        <div
          className="mt-8 flex items-center gap-2"
          style={{
            fontFamily: "'Michroma', sans-serif",
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.4em',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: '#22d3ee' }} />
          NEURAL NETWORK ONLINE
          <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: '#a855f7', animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
}
