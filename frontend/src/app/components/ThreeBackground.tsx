import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../App';
import gsap from 'gsap';

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!mountRef.current) return;

    // ── SCENE SETUP ─────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 180);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true, 
        powerPreference: 'high-performance' 
      });
    } catch (e) {
      console.error("WebGL not supported", e);
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // ── GOD LEVEL DNA PARTICLE SYSTEM ───────────────────────────────────────
    const PARTICLE_COUNT = 80000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);

    // Color palettes
    const color1 = isDark ? new THREE.Color(0x00e5ff) : new THREE.Color(0x2563eb); // Cyan / Blue
    const color2 = isDark ? new THREE.Color(0xd946ef) : new THREE.Color(0xc026d3); // Fuchsia / Purple

    // Generate Double Helix structure with connecting rungs and surrounding nebula
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      let x = 0, y = 0, z = 0;
      let c = color1;

      const randomType = Math.random();

      if (randomType < 0.4) {
        // Helix Strand 1
        const t = (Math.random() - 0.5) * 400; // y-axis spread
        const angle = t * 0.1;
        const radius = 25 + Math.random() * 2;
        x = Math.cos(angle) * radius;
        y = t;
        z = Math.sin(angle) * radius;
        c = color1;
        scales[i] = 1.0 + Math.random() * 1.5;
      } else if (randomType < 0.8) {
        // Helix Strand 2 (Offset by PI)
        const t = (Math.random() - 0.5) * 400;
        const angle = t * 0.1 + Math.PI;
        const radius = 25 + Math.random() * 2;
        x = Math.cos(angle) * radius;
        y = t;
        z = Math.sin(angle) * radius;
        c = color2;
        scales[i] = 1.0 + Math.random() * 1.5;
      } else if (randomType < 0.9) {
        // Connecting Rungs (Base pairs)
        const t = (Math.random() - 0.5) * 400;
        const rFactor = Math.random();
        const angle1 = t * 0.1;
        const angle2 = t * 0.1 + Math.PI;
        
        const x1 = Math.cos(angle1) * 25;
        const z1 = Math.sin(angle1) * 25;
        const x2 = Math.cos(angle2) * 25;
        const z2 = Math.sin(angle2) * 25;

        x = x1 + (x2 - x1) * rFactor;
        y = t;
        z = z1 + (z2 - z1) * rFactor;
        
        c = color1.clone().lerp(color2, rFactor);
        scales[i] = 0.5 + Math.random();
      } else {
        // Nebula / Background field
        const r = 40 + Math.random() * 150;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        c = Math.random() > 0.5 ? color1 : color2;
        scales[i] = Math.random() * 2;
      }

      // Add a bit of organic noise to everything
      x += (Math.random() - 0.5) * 3;
      y += (Math.random() - 0.5) * 3;
      z += (Math.random() - 0.5) * 3;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Custom Shader Material for glowing, anti-aliased circular points
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uIsDark: { value: isDark ? 1.0 : 0.0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float scale;
        attribute vec3 customColor;
        varying vec3 vColor;
        varying float vZ;

        void main() {
          vColor = customColor;
          vec3 pos = position;

          // Organic flow animation
          float noise = sin(pos.y * 0.05 + uTime) * 2.0;
          pos.x += cos(pos.y * 0.02 + uTime) * noise;
          pos.z += sin(pos.y * 0.02 + uTime) * noise;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vZ = -mvPosition.z;
          
          gl_Position = projectionMatrix * mvPosition;
          
          // Point size based on depth and scale
          gl_PointSize = scale * uPixelRatio * (250.0 / vZ);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vZ;
        uniform float uIsDark;

        void main() {
          // Circular particle with soft edge
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if(ll > 0.5) discard;
          
          // Glow calculation
          float glow = smoothstep(0.5, 0.1, ll);
          
          // Depth fading
          float depthFade = smoothstep(400.0, 50.0, vZ);
          
          // Base opacity depends on theme
          float baseOpacity = mix(0.7, 0.9, uIsDark);
          
          gl_FragColor = vec4(vColor, glow * depthFade * baseOpacity);
        }
      `,
      transparent: true,
      vertexColors: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const dnaSystem = new THREE.Points(geometry, material);
    scene.add(dnaSystem);

    // Initial rotation
    dnaSystem.rotation.z = Math.PI * 0.1;
    dnaSystem.rotation.x = Math.PI * 0.1;

    // ── MOUSE INTERACTION ───────────────────────────────────────────────────
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2.0;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2.0;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Entrance animation
    gsap.fromTo(dnaSystem.scale, 
      { x: 0.1, y: 0.1, z: 0.1 }, 
      { x: 1, y: 1, z: 1, duration: 2.5, ease: 'expo.out' }
    );
    gsap.fromTo(dnaSystem.rotation,
      { y: -Math.PI },
      { y: 0, duration: 3, ease: 'power3.out' }
    );

    // ── ANIMATION LOOP ──────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      material.uniforms.uTime.value = time;

      // Smooth mouse interpolation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Rotate whole system based on mouse and time
      dnaSystem.rotation.y += 0.002;
      dnaSystem.rotation.x = Math.PI * 0.1 + currentY * 0.3;
      dnaSystem.rotation.z = Math.PI * 0.1 - currentX * 0.3;

      // Camera parallax
      camera.position.x += (currentX * 20 - camera.position.x) * 0.05;
      camera.position.y += (-currentY * 20 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // ── RESIZE HANDLER ──────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      // In light mode, multiply or normal blending works best on white background
      style={{ mixBlendMode: isDark ? 'screen' : 'normal' }}
    />
  );
}
