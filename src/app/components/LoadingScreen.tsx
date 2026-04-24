import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTheme } from '../App';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'PROCESSING DATA...' }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── SCENE SETUP ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.005);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      console.error("WebGL not supported in LoadingScreen", e);
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    // ── WORMHOLE TUNNEL ──
    const P_COUNT = 15000;
    const geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(P_COUNT * 3);
    const colors = new Float32Array(P_COUNT * 3);
    
    const color1 = isDark ? new THREE.Color(0x00e5ff) : new THREE.Color(0x2563eb);
    const color2 = isDark ? new THREE.Color(0xd946ef) : new THREE.Color(0xc026d3);

    for (let i = 0; i < P_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 20;
      const z = (Math.random() - 0.5) * 200;
      
      pos[i*3] = Math.cos(theta) * radius;
      pos[i*3+1] = Math.sin(theta) * radius;
      pos[i*3+2] = z;

      const c = Math.random() > 0.5 ? color1 : color2;
      colors[i*3] = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.8 : 0.9,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false
    });

    const tunnel = new THREE.Points(geometry, material);
    scene.add(tunnel);

    // ── ANIMATION ──
    const clock = new THREE.Clock();
    let id: number;

    const animate = () => {
      id = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      
      // Move camera through tunnel
      camera.position.z -= 0.5;
      camera.rotation.z = time * 0.5;
      
      // Loop tunnel positions
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < P_COUNT; i++) {
        if (positions[i*3+2] > camera.position.z + 50) {
          positions[i*3+2] -= 200;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    animate();

    // GSAP Text Animation
    const ctx = gsap.context(() => {
      gsap.fromTo('.ld-char', 
        { opacity: 0, y: 20, scale: 0.5 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(2)', repeat: -1, yoyo: true, repeatDelay: 1 }
      );
      gsap.fromTo('.ld-bar',
        { scaleX: 0 },
        { scaleX: 1, duration: 2, ease: 'expo.inOut', repeat: -1 }
      );
    }, containerRef);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', handleResize);
      ctx.revert();
      if (canvasRef.current?.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: isDark ? '#000005' : '#f0f5ff' }}>
      
      {/* 3D Tunnel */}
      <div ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '2rem' }}>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-500 animate-spin" style={{ animationDuration: '1s' }} />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-cyan-400 border-l-purple-500 animate-spin" style={{ animationDuration: '0.7s', animationDirection: 'reverse' }} />
        </div>
        
        <h2 style={{ fontFamily: "'Michroma', sans-serif", fontSize: '1.25rem', fontWeight: 400, color: isDark ? '#fff' : '#0a0a1a', letterSpacing: '0.02em', textTransform: 'uppercase', display: 'flex', gap: '4px' }}>
          {message.split('').map((char, i) => (
            <span key={i} className="ld-char" style={{ display: 'inline-block' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>
        
        <div className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <div className="ld-bar h-full rounded-full origin-left" style={{ background: 'linear-gradient(90deg, #00e5ff, #d946ef)' }} />
        </div>
      </div>
    </div>
  );
}
