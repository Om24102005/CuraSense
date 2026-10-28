import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTheme } from '../../App';
import { themes, type ThemeName } from '../../themes';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'ANALYZING SYMPTOMS...' }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLDivElement>(null);
  const { theme }   = useTheme();
  const currentTheme = themes[theme as ThemeName];
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const W = window.innerWidth, H = window.innerHeight;
    const CYAN   = currentTheme.vars['--accent-cyan']   || '#22d3ee';
    const VIOLET = currentTheme.vars['--accent-violet'] || '#a855f7';
    const cyanV   = new THREE.Color(CYAN);
    const violetV = new THREE.Color(VIOLET);

    // ── Scene ──────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000308, 1);
    canvasRef.current.appendChild(renderer.domElement);

    // ── Soft-circle particle texture (fixes the square-particle bug) ──
    const ptCanvas = document.createElement('canvas');
    ptCanvas.width = ptCanvas.height = 64;
    const ptCtx = ptCanvas.getContext('2d')!;
    const radGrad = ptCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    radGrad.addColorStop(0.0, 'rgba(255,255,255,1)');
    radGrad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    radGrad.addColorStop(1.0, 'rgba(255,255,255,0)');
    ptCtx.fillStyle = radGrad;
    ptCtx.fillRect(0, 0, 64, 64);
    const ptTex = new THREE.CanvasTexture(ptCanvas);

    // ── Particles ──────────────────────────────────────────────
    const N   = 1600;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    const pCol = new Float32Array(N * 3);

    for (let i = 0; i < N; i++) {
      // Reject particles that would be closer than 11 units to camera (camera at z=18)
      let x: number, y: number, z: number;
      do {
        const r     = 5 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      } while (z > 7);

      pPos[i * 3]     = x;
      pPos[i * 3 + 1] = y;
      pPos[i * 3 + 2] = z;

      const c = cyanV.clone().lerp(violetV, Math.random());
      pCol[i * 3]     = c.r;
      pCol[i * 3 + 1] = c.g;
      pCol[i * 3 + 2] = c.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.16,
      map: ptTex,
      alphaMap: ptTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    // ── Orbital rings — intentional angles, not random ──────────
    const makeRingGeo = (radius: number, segs: number) => {
      const verts: THREE.Vector3[] = [];
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        verts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
      }
      return new THREE.BufferGeometry().setFromPoints(verts);
    };

    // Ring 1 — equatorial (flat), cyan, r = 7.2
    const rg1  = makeRingGeo(7.2, 128);
    const rm1  = new THREE.LineBasicMaterial({ color: cyanV, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
    const ring1 = new THREE.LineLoop(rg1, rm1);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    // Ring 2 — tilted ~32° inward, violet, r = 5.2
    const rg2  = makeRingGeo(5.2, 128);
    const rm2  = new THREE.LineBasicMaterial({ color: violetV, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    const ring2 = new THREE.LineLoop(rg2, rm2);
    ring2.rotation.set(0.55, 0.2, 0);
    scene.add(ring2);

    // Ring 3 — outer, tilted opposite direction, mix, r = 9.5
    const rg3     = makeRingGeo(9.5, 128);
    const mixCol  = cyanV.clone().lerp(violetV, 0.4);
    const rm3     = new THREE.LineBasicMaterial({ color: mixCol, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending });
    const ring3   = new THREE.LineLoop(rg3, rm3);
    ring3.rotation.set(-0.9, 0.4, 0.15);
    scene.add(ring3);

    // ── Wireframe icosahedron ───────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(2.7, 3);
    const icoMat = new THREE.MeshBasicMaterial({
      color: cyanV,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // ── Fresnel glow sphere ─────────────────────────────────────
    const sphGeo = new THREE.SphereGeometry(2.0, 64, 64);
    const sphMat = new THREE.ShaderMaterial({
      uniforms: {
        uCyan:   { value: cyanV },
        uViolet: { value: violetV },
        uTime:   { value: 0.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvp = modelViewMatrix * vec4(position, 1.0);
          vView = normalize(-mvp.xyz);
          gl_Position = projectionMatrix * mvp;
        }
      `,
      fragmentShader: `
        uniform vec3  uCyan;
        uniform vec3  uViolet;
        uniform float uTime;
        varying vec3  vNormal;
        varying vec3  vView;
        void main() {
          float f     = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.8);
          float pulse = 0.5 + 0.5 * sin(uTime * 2.2);
          vec3  col   = mix(uViolet * 0.45, uCyan * 1.3, f);
          gl_FragColor = vec4(col, f * (0.72 + 0.28 * pulse));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    const sphere = new THREE.Mesh(sphGeo, sphMat);
    scene.add(sphere);

    // ── Render loop ─────────────────────────────────────────────
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      ico.rotation.x = t * 0.11;
      ico.rotation.y = t * 0.17;
      ico.scale.setScalar(1 + Math.sin(t * 0.65) * 0.03);

      sphMat.uniforms.uTime.value = t;
      sphere.scale.setScalar(1 + Math.sin(t * 0.9) * 0.05);

      // No per-particle position mutation — pure rotation only
      pts.rotation.y = t * 0.07;
      pts.rotation.x = t * 0.025;

      ring1.rotation.y  = t * 0.14;
      ring2.rotation.z  = t * 0.11;
      ring3.rotation.y  = 0.4 + t * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    // ── HUD / overlay animations ────────────────────────────────
    const intervals: ReturnType<typeof setInterval>[] = [];

    const gsapCtx = gsap.context(() => {
      // Fade in
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      // Corner brackets snap open
      const origins = { tl: 'top left', tr: 'top right', bl: 'bottom left', br: 'bottom right' };
      Object.entries(origins).forEach(([key, origin], i) => {
        gsap.fromTo(`.ld-b-${key}`,
          { scale: 0 },
          { scale: 1, duration: 0.45, delay: 0.08 + i * 0.06, ease: 'power3.out', transformOrigin: origin }
        );
      });

      // Message text
      gsap.fromTo('.ld-msg',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power2.out' }
      );

      // Progress sweep
      gsap.fromTo('.ld-bar-fill',
        { x: '-100%' },
        { x: '100%', duration: 1.8, ease: 'power2.inOut', repeat: -1 }
      );

      // Horizontal scan line sweep
      gsap.fromTo('.ld-scan',
        { top: '0%', opacity: 0.85 },
        { top: '100%', opacity: 0, duration: 2.2, ease: 'none', repeat: -1, repeatDelay: 0.8 }
      );
    }, containerRef);

    // Data value randomiser — plain intervals (not GSAP) so they update reliably
    containerRef.current?.querySelectorAll<HTMLElement>('.ld-dv').forEach((el: HTMLElement) => {
      const update = () => { el.textContent = (Math.random() * 99.99).toFixed(3); };
      update();
      intervals.push(setInterval(update, 280 + Math.random() * 480));
    });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      intervals.forEach(clearInterval);
      gsapCtx.revert();
      if (canvasRef.current?.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      [icoGeo, icoMat, sphGeo, sphMat, pGeo, pMat, ptTex, rg1, rm1, rg2, rm2, rg3, rm3].forEach(o => o.dispose());
      renderer.dispose();
    };
  }, [mounted, theme]);

  if (!mounted) return null;

  const cyan   = currentTheme.vars['--accent-cyan']   || '#22d3ee';
  const violet = currentTheme.vars['--accent-violet'] || '#a855f7';
  const text   = currentTheme.vars['--text-primary']  || '#e2e8f0';

  const leftData  = ['SIGNAL', 'LATENCY', 'NODES', 'FLUX'] as const;
  const rightData = ['ENTROPY', 'DENSITY', 'NEURAL', 'SYNC'] as const;

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] overflow-hidden"
      style={{ background: '#000308' }}
    >
      {/* Three.js canvas */}
      <div ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Horizontal scan sweep */}
      <div
        className="ld-scan absolute left-0 right-0 pointer-events-none"
        style={{
          top: '0%',
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${cyan}00 8%, ${cyan}99 40%, ${cyan} 50%, ${cyan}99 60%, ${cyan}00 92%, transparent 100%)`,
          boxShadow: `0 0 8px 1px ${cyan}55`,
          zIndex: 2,
        }}
      />

      {/* Corner brackets — TL */}
      <div className="ld-b-tl absolute top-5 left-5 w-7 h-7" style={{ zIndex: 3 }}>
        <div className="absolute top-0 left-0 right-0"  style={{ height: 1.5, background: cyan }} />
        <div className="absolute top-0 left-0 bottom-0" style={{ width:  1.5, background: cyan }} />
      </div>
      {/* TR */}
      <div className="ld-b-tr absolute top-5 right-5 w-7 h-7" style={{ zIndex: 3 }}>
        <div className="absolute top-0 left-0 right-0"   style={{ height: 1.5, background: cyan }} />
        <div className="absolute top-0 right-0 bottom-0" style={{ width:  1.5, background: cyan }} />
      </div>
      {/* BL */}
      <div className="ld-b-bl absolute bottom-5 left-5 w-7 h-7" style={{ zIndex: 3 }}>
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 1.5, background: cyan }} />
        <div className="absolute top-0 left-0 bottom-0"   style={{ width:  1.5, background: cyan }} />
      </div>
      {/* BR */}
      <div className="ld-b-br absolute bottom-5 right-5 w-7 h-7" style={{ zIndex: 3 }}>
        <div className="absolute bottom-0 left-0 right-0"  style={{ height: 1.5, background: cyan }} />
        <div className="absolute top-0 right-0 bottom-0"   style={{ width:  1.5, background: cyan }} />
      </div>

      {/* Left data panel */}
      <div
        className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4"
        style={{ fontFamily: 'ui-monospace, monospace', zIndex: 3 }}
      >
        {leftData.map((label, i) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span style={{ color: text, opacity: 0.3, fontSize: 8, letterSpacing: '0.18em' }}>
              {label}
            </span>
            <span
              className="ld-dv"
              style={{ color: i % 2 === 0 ? cyan : violet, fontSize: 11, letterSpacing: '0.06em', opacity: 0.65 }}
            >
              00.000
            </span>
          </div>
        ))}
      </div>

      {/* Right data panel */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 items-end"
        style={{ fontFamily: 'ui-monospace, monospace', zIndex: 3 }}
      >
        {rightData.map((label, i) => (
          <div key={label} className="flex flex-col gap-0.5 items-end">
            <span style={{ color: text, opacity: 0.3, fontSize: 8, letterSpacing: '0.18em' }}>
              {label}
            </span>
            <span
              className="ld-dv"
              style={{ color: i % 2 === 0 ? violet : cyan, fontSize: 11, letterSpacing: '0.06em', opacity: 0.65 }}
            >
              00.000
            </span>
          </div>
        ))}
      </div>

      {/* Centre bottom — message + bar + version */}
      <div
        className="ld-msg absolute inset-x-0 bottom-14 flex flex-col items-center gap-3 pointer-events-none"
        style={{ zIndex: 3 }}
      >
        <span
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11,
            letterSpacing: '0.35em',
            color: cyan,
            textTransform: 'uppercase',
            textShadow: `0 0 18px ${cyan}70`,
          }}
        >
          {message}
        </span>

        <div className="w-56 overflow-hidden relative" style={{ height: 1, background: `${cyan}20` }}>
          <div
            className="ld-bar-fill absolute inset-0 w-full h-full"
            style={{ background: `linear-gradient(90deg, transparent, ${cyan}, ${violet}, transparent)` }}
          />
        </div>

        <span style={{ color: text, opacity: 0.18, fontSize: 8, letterSpacing: '0.22em', fontFamily: 'ui-monospace, monospace' }}>
          CURASENSE · AI DIAGNOSTIC SUITE · v2.0
        </span>
      </div>
    </div>,
    document.body
  );
}
