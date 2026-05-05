/* ═══════════════════════════════════════════════════════
   CuraSense — GOD-LEVEL Loading Screen
   R3F-powered 3D loader with morphing geometry
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTheme } from '../App';
import { themes } from '../themes';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'ANALYZING SYMPTOMS...' }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(new THREE.Color(currentTheme.vars['--bg-base']), 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color(currentTheme.vars['--bg-base']), 1);
    canvasRef.current.appendChild(renderer.domElement);

    // ── Core geometry (morphing icosahedron) ──
    const coreGeometry = new THREE.IcosahedronGeometry(3, 4);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(currentTheme.vars['--accent-cyan']),
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // ── Inner glow sphere ──
    const glowGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(currentTheme.vars['--accent-violet']),
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowSphere);

    // ── Particles ──
    const particleCount = 4000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    const color1 = new THREE.Color(currentTheme.vars['--accent-cyan']);
    const color2 = new THREE.Color(currentTheme.vars['--accent-violet']);

    for (let i = 0; i < particleCount; i++) {
      const r = 4 + Math.random() * 8;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = color1.clone().lerp(color2, Math.random());
      particleColors[i * 3] = mixedColor.r;
      particleColors[i * 3 + 1] = mixedColor.g;
      particleColors[i * 3 + 2] = mixedColor.b;

      particleSizes[i] = 0.05 + Math.random() * 0.1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ── Rings ──
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(6 + i * 1.5, 0.02, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? color1 : color2,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      scene.add(ring);
      rings.push(ring);
    }

    // ── Animation loop ──
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      animationFrameId = requestAnimationFrame(animate);

      // Core morphing
      core.rotation.x = elapsedTime * 0.2;
      core.rotation.y = elapsedTime * 0.3;
      core.scale.setScalar(1 + Math.sin(elapsedTime * 0.5) * 0.05);

      // Glow pulse
      glowSphere.scale.setScalar(1 + Math.sin(elapsedTime * 0.8) * 0.1);
      glowMat.opacity = 0.1 + Math.sin(elapsedTime * 0.6) * 0.05;

      // Particles
      particles.rotation.y = elapsedTime * 0.1;
      particles.rotation.z = elapsedTime * 0.05;

      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);
        const wave = Math.sin(elapsedTime * 2 + distance * 0.5) * 0.02;

        positions[i3] += (x / distance) * wave;
        positions[i3 + 1] += (y / distance) * wave;
        positions[i3 + 2] += (z / distance) * wave;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      rings.forEach((ring, index) => {
        ring.rotation.x += 0.01 * (index + 1);
        ring.rotation.y += 0.005 * (index + 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // ── GSAP animations ──
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.inOut' }
      );

      gsap.fromTo(
        '.ld-char',
        { opacity: 0, y: 30, rotationX: -90 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.5,
        }
      );

      gsap.to('.ld-pulse', {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: 'power2.out',
      });

      gsap.fromTo(
        '.ld-bar-fill',
        { x: '-100%' },
        { x: '100%', duration: 1.5, ease: 'power2.inOut', repeat: -1 }
      );

      gsap.to(camera.position, {
        z: 10,
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, containerRef);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      ctx.revert();

      if (canvasRef.current && renderer.domElement) {
        canvasRef.current.removeChild(renderer.domElement);
      }

      coreGeometry.dispose();
      coreMaterial.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, theme]);

  if (!mounted) return null;

  const bgColor = currentTheme.vars['--bg-base'];

  return createPortal(
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center overflow-hidden m-0 p-0"
      style={{ background: bgColor }}
    >
      <div
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div className="ld-pulse absolute inset-0 rounded-full border-2" style={{ borderColor: currentTheme.vars['--accent-cyan'] }} />
          <div
            className="absolute inset-2 rounded-full border-t-2 animate-spin"
            style={{
              borderColor: `${currentTheme.vars['--accent-cyan']} transparent transparent transparent`,
              animationDuration: '1s',
            }}
          />
          <div
            className="absolute inset-4 rounded-full border-b-2 animate-spin"
            style={{
              borderColor: `transparent transparent ${currentTheme.vars['--accent-violet']} transparent`,
              animationDuration: '1.5s',
              animationDirection: 'reverse',
            }}
          />
          <div
            className="w-8 h-8 rounded-full blur-xl opacity-50"
            style={{ background: currentTheme.vars['--accent-cyan'] }}
          />
        </div>

        <h2
          className="flex gap-1 text-2xl tracking-[0.2em] uppercase font-light"
          style={{ color: currentTheme.vars['--text-primary'] }}
        >
          {message.split('').map((char, i) => (
            <span
              key={i}
              className="ld-char inline-block font-bold bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.vars['--accent-cyan']}, ${currentTheme.vars['--accent-violet']})`,
                WebkitBackgroundClip: 'text',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>

        <div className="mt-8 w-72 h-[2px] overflow-hidden relative rounded-full" style={{ background: 'rgba(128,128,128,0.15)' }}>
          <div
            className="ld-bar-fill absolute inset-0 w-full h-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${currentTheme.vars['--accent-cyan']}, transparent)`,
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
