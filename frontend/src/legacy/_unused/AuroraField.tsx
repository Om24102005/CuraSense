import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AuroraFieldProps {
  colors?: string[];
  base?: string;
  pulse?: boolean;
  opacity?: number;
  className?: string;
}

function hexToRGB(hex: string, fallback: [number, number, number]): [number, number, number] {
  if (!hex) return fallback;
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  if (h.length !== 6) return fallback;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return fallback;
  return [((n >> 16) & 255)/255, ((n >> 8) & 255)/255, (n & 255)/255];
}

const VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */`
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform float uMouseStr;
  uniform vec2  uMouseVel;   // mouse velocity (normalised)
  uniform vec3  uRipple;     // xy = click pos (0..1), z = ripple age (0..1, 0=fresh)
  uniform float uDark;
  uniform float uReduce;
  uniform float uPulse;
  uniform vec3  uC0, uC1, uC2, uC3, uBg;

  // ── noise primitives ──────────────────────────────────────────────────────
  float hash21(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(
      mix(hash21(i), hash21(i+vec2(1,0)), u.x),
      mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), u.x),
      u.y
    );
  }
  // curl noise from gradient of scalar field — gives true fluid-like rotation
  vec2 curl(vec2 p, float t) {
    const float eps = 0.01;
    float n0 = vnoise(p + vec2(0, eps) + t*0.3);
    float n1 = vnoise(p - vec2(0, eps) + t*0.3);
    float n2 = vnoise(p + vec2(eps, 0) + t*0.3);
    float n3 = vnoise(p - vec2(eps, 0) + t*0.3);
    return vec2((n0-n1)/(2.0*eps), -(n2-n3)/(2.0*eps)) * 0.8;
  }
  const mat2 ROT = mat2(0.8, 0.6, -0.6, 0.8);
  float fbm(vec2 p) {
    float v=0.0, a=0.5;
    for(int i=0;i<7;i++){ v+=a*vnoise(p); p=ROT*p*2.1+91.0; a*=0.5; }
    return v;
  }

  // ── cardiac pulse ─────────────────────────────────────────────────────────
  float cardiac(float t) {
    float ph = fract(t / 1.15);
    return exp(-pow((ph-0.10)/0.04, 2.0)) + exp(-pow((ph-0.26)/0.055, 2.0))*0.6;
  }
  float ecgWave(float x) {
    float p2 = fract(x);
    return exp(-pow((p2-0.32)/0.028,2.0))*0.18
         - exp(-pow((p2-0.47)/0.009,2.0))*0.35
         + exp(-pow((p2-0.50)/0.011,2.0))*1.0
         - exp(-pow((p2-0.53)/0.010,2.0))*0.45
         + exp(-pow((p2-0.70)/0.042,2.0))*0.28;
  }

  // ── tone mapping ──────────────────────────────────────────────────────────
  vec3 acesTone(vec3 x) {
    return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0);
  }

  void main() {
    float asp = uRes.x / uRes.y;
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(asp, 1.0);

    float spd = mix(1.0, 0.2, uReduce);
    float t = uTime * 0.18 * spd;

    // ── mouse in world space ───────────────────────────────────────────────
    vec2 mp = (uMouse - 0.5) * vec2(asp, 1.0);
    float md = length(p - mp);
    // wide soft glow + tight bright core
    float mGlow  = (exp(-md*md*1.8) * 0.7 + exp(-md*md*8.0) * 0.4) * uMouseStr;
    // mouse repels the flow field directionally (velocity drag)
    vec2 mDir = normalize(uMouseVel + vec2(0.001)) * uMouseStr * 0.35;

    // ── click ripple (expanding ring) ─────────────────────────────────────
    float ripple = 0.0;
    if (uRipple.z < 1.0) {
      vec2 rp = (uRipple.xy - 0.5) * vec2(asp, 1.0);
      float rd = length(p - rp);
      float age = uRipple.z; // 0 fresh → 1 gone
      float ring = age * 1.8; // ring radius grows
      float wave = exp(-pow((rd - ring)/0.08, 2.0)) * (1.0 - age);
      ripple = wave * 0.5;
    }

    // ── domain warp with curl + mouse drag ────────────────────────────────
    vec2 q = curl(p * 1.2, t) + mDir * exp(-md*md*2.0);
    q += vec2(fbm(p*0.9 + t*0.4), fbm(p*0.9 + vec2(3.1, 7.3) - t*0.35));

    vec2 r = curl(p*1.5 + q*1.6, t*0.7);
    r += vec2(fbm(p*1.2 + q*1.4 + vec2(1.7,9.2) + t*0.25),
              fbm(p*1.2 + q*1.4 + vec2(8.3,2.8) - t*0.22));

    // cursor bends flow toward itself
    r += normalize(p - mp + vec2(1e-5)) * (-0.45) * mGlow;
    // ripple distorts the warp field too
    r += normalize(p - ((uRipple.xy-0.5)*vec2(asp,1.0)) + vec2(1e-5)) * ripple * 0.3;

    float f = fbm(p*1.1 + 2.0*r + t*0.12);

    // ── color layers (dark and deep, not bright) ──────────────────────────
    float b1 = smoothstep(0.20, 1.00, f);
    float b2 = smoothstep(0.15, 1.05, length(q)*0.7);
    float b3 = smoothstep(0.30, 1.10, r.x*0.5+0.5);
    float b4 = smoothstep(0.55, 1.20, f*f);

    vec3 col = uBg;
    col = mix(col, uC0 * 0.55, b1 * 0.70);
    col = mix(col, uC1 * 0.50, b2 * 0.65);
    col = mix(col, uC2 * 0.40, b3 * 0.45);
    col = mix(col, uC3 * 0.45, b4 * 0.35);

    // aurora ridges (dark themes only)
    float ridge = 1.0 - abs(2.0*fbm(p*2.5 + r*1.2 + t*0.4) - 1.0);
    ridge = pow(max(ridge,0.0), 4.0);
    col += (uC0*0.4 + uC1*0.6) * ridge * 0.10 * uDark;

    // ── cursor: bright core light ─────────────────────────────────────────
    col += (uC0*0.6 + uC1*0.4) * mGlow * 0.80;
    col += uC1 * exp(-md*md*20.0) * uMouseStr * 0.5; // sharp core

    // ── ripple ring glow ──────────────────────────────────────────────────
    if (uRipple.z < 1.0) {
      vec2 rp = (uRipple.xy - 0.5) * vec2(asp, 1.0);
      float rd = length(p - rp);
      float age = uRipple.z;
      float ring = age * 1.8;
      float wave = exp(-pow((rd - ring)/0.06, 2.0)) * (1.0 - age);
      col += (uC0*0.5 + uC2*0.5) * wave * 0.6;
    }

    // ── cardiac breathing ─────────────────────────────────────────────────
    float beat = cardiac(uTime * 0.9);
    col *= 1.0 + beat * 0.04;

    // ── ECG trace ────────────────────────────────────────────────────────
    if (uPulse > 0.5) {
      float sw = uTime * 0.18;
      float wy = 0.14 + ecgWave(uv.x * 0.8 - sw) * 0.06;
      float dist = abs(uv.y - wy);
      float head = smoothstep(0.0, 0.07, 0.07 - abs(fract(uv.x*0.8-sw) - 0.5));
      float trace = exp(-pow(dist/0.0025, 2.0)) + exp(-pow(dist/0.018, 2.0))*0.15;
      col += uC0 * trace * (0.30 + 0.60*head) * uDark;
    }

    // ── grain dither ──────────────────────────────────────────────────────
    float g = hash21(uv*uRes + fract(uTime*73.1)) - 0.5;
    col += g * 0.018;

    // ── tone map (pull down highlights, add depth) ────────────────────────
    col = acesTone(col * 1.1);

    // ── vignette ─────────────────────────────────────────────────────────
    float vig = smoothstep(1.4, 0.25, length((uv-0.5)*vec2(asp,1.0)));
    col *= mix(0.40, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function AuroraField({
  colors = ['#22d3ee','#8b5cf6','#ec4899','#10b981'],
  base = '#05050e',
  pulse = true,
  opacity = 1,
  className = '',
}: AuroraFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const key = colors.join(',') + '|' + base + '|' + (pulse ? 1 : 0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    } catch { return; }

    const isMobile = window.innerWidth < 768;
    const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);
    renderer.setPixelRatio(DPR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    mount.appendChild(renderer.domElement);

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0;
    const [br, bg, bb] = hexToRGB(base, [0.02, 0.02, 0.055]);
    const lum = 0.2126*br + 0.7152*bg + 0.0722*bb;
    const dark = lum < 0.45 ? 1 : 0;

    const c0 = hexToRGB(colors[0], [0.13, 0.83, 0.93]);
    const c1 = hexToRGB(colors[1], [0.55, 0.36, 0.96]);
    const c2 = hexToRGB(colors[2] ?? colors[0], [0.93, 0.28, 0.6]);
    const c3 = hexToRGB(colors[3] ?? colors[1], [0.06, 0.73, 0.51]);

    const uniforms: Record<string, THREE.IUniform> = {
      uTime:     { value: 0 },
      uRes:      { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse:    { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStr: { value: 0 },
      uMouseVel: { value: new THREE.Vector2(0, 0) },
      uRipple:   { value: new THREE.Vector3(0.5, 0.5, 1.0) }, // z=1 = no ripple
      uDark:     { value: dark },
      uReduce:   { value: reduce },
      uPulse:    { value: pulse ? 1 : 0 },
      uC0: { value: new THREE.Vector3(...c0) },
      uC1: { value: new THREE.Vector3(...c1) },
      uC2: { value: new THREE.Vector3(...c2) },
      uC3: { value: new THREE.Vector3(...c3) },
      uBg: { value: new THREE.Vector3(br, bg, bb) },
    };

    const scene    = new THREE.Scene();
    const camera   = new THREE.Camera();
    const geo      = new THREE.PlaneGeometry(2, 2);
    const mat      = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, uniforms,
      depthTest: false, depthWrite: false,
    });
    scene.add(new THREE.Mesh(geo, mat));

    // ── pointer tracking with velocity ───────────────────────────────────
    const target   = new THREE.Vector2(0.5, 0.5);
    const curMouse = uniforms.uMouse.value as THREE.Vector2;
    const curVel   = uniforms.uMouseVel.value as THREE.Vector2;
    let presence   = 0;
    let lastPos    = new THREE.Vector2(0.5, 0.5);

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1 - e.clientY / window.innerHeight;
      // velocity = delta of normalised position
      curVel.set((nx - lastPos.x) * 8, (ny - lastPos.y) * 8);
      lastPos.set(nx, ny);
      target.set(nx, ny);
      presence = 1;
    };

    // ── click ripple ──────────────────────────────────────────────────────
    let rippleAge = 1.0;
    const rip = uniforms.uRipple.value as THREE.Vector3;
    const onClick = (e: MouseEvent) => {
      rip.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight, 0.0);
      rippleAge = 0;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick);

    // ── render loop ───────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      const dt = Math.min(clock.getDelta(), 0.05);

      // ease mouse position
      curMouse.x += (target.x - curMouse.x) * 0.10;
      curMouse.y += (target.y - curMouse.y) * 0.10;

      // decay velocity
      curVel.x *= 0.88;
      curVel.y *= 0.88;

      // decay presence
      presence = Math.max(0, presence - dt * 0.6);
      const ms = uniforms.uMouseStr;
      ms.value += (presence - ms.value) * 0.12;

      // advance ripple
      if (rippleAge < 1.0) {
        rippleAge = Math.min(1.0, rippleAge + dt * 0.55);
        rip.z = rippleAge;
      }

      uniforms.uTime.value += dt * (reduce ? 0.3 : 1.0);
      renderer.render(scene, camera);
    };
    render();

    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) { clock.getDelta(); render(); }
    };
    document.addEventListener('visibilitychange', onVis);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      (uniforms.uRes.value as THREE.Vector2).set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`fixed inset-0 z-0 pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
}
