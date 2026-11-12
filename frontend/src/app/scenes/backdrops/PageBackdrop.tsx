/* Full-screen shader backdrop for the Platform / Approach / Access pages. Plain WebGL (no three.js): one triangle, one
   program, opaque output. Cheap on purpose: it renders below CSS resolution, pauses when the tab is hidden, draws a single
   static frame under reduced motion, frees its GPU context on unmount, and recovers from a lost context. */
import { useEffect, useRef } from 'react';
import { getDeviceTier } from '../../animations';
import { backdropBus } from './bus';
import { SCALE, SHADERS, type BackdropVariant } from './shaders';

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';

export default function PageBackdrop({ variant, light }: { variant: BackdropVariant; light: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef(light);
  const kick = useRef<() => void>(() => {});
  lightRef.current = light;
  useEffect(() => { kick.current(); }, [light]);   // under reduced motion nothing animates, so a theme change must ask for its own frame

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const tier = getDeviceTier();
    if (tier === 'low') return;   // the CSS aurora behind the page stays: a quiet page beats a stuttering one
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const quality = (tier === 'high' ? 1 : 0.7) * SCALE[variant];

    let gl: WebGLRenderingContext | null = null;
    let loc: Record<string, WebGLUniformLocation | null> = {};
    let raf = 0, alive = true, lightNow = lightRef.current ? 1 : 0, focusNow = backdropBus.focus;
    const t0 = performance.now();
    let prev = t0;
    const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const sh = (type: number, src: string) => {
      const s = gl!.createShader(type)!; gl!.shaderSource(s, src); gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) { console.warn('[backdrop]', gl!.getShaderInfoLog(s)); return null; }
      return s;
    };
    const init = () => {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
      if (!gl) return false;
      const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, SHADERS[variant]);
      if (!vs || !fs) return false;
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   // one triangle covers the screen
      const a = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      loc = Object.fromEntries(['uRes', 'uTime', 'uPtr', 'uLight', 'uFocus', 'uScroll'].map((n) => [n, gl!.getUniformLocation(prog, n)]));
      return true;
    };

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.25);
      const w = Math.max(2, Math.round(canvas.clientWidth * dpr * quality)), h = Math.max(2, Math.round(canvas.clientHeight * dpr * quality));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    };
    const draw = (now: number) => {
      if (!gl || gl.isContextLost()) return;
      size();
      gl.viewport(0, 0, canvas.width, canvas.height);
      const dt = Math.min(0.05, (now - prev) / 1000); prev = now;   // smoothing by elapsed time: the same look at 60, 120 or 144 Hz
      const k = (rate: number) => 1 - Math.exp(-dt * rate);
      ptr.x += (ptr.tx - ptr.x) * k(3.7); ptr.y += (ptr.ty - ptr.y) * k(3.7);
      const target = lightRef.current ? 1 : 0;
      lightNow = still ? target : lightNow + (target - lightNow) * k(7.7);
      gl.uniform2f(loc.uRes, canvas.width, canvas.height);
      gl.uniform1f(loc.uTime, still ? 3.2 : (now - t0) / 1000);
      gl.uniform2f(loc.uPtr, still ? 0.5 : ptr.x, still ? 0.5 : ptr.y);
      gl.uniform1f(loc.uLight, lightNow);
      focusNow += (backdropBus.focus - focusNow) * (still ? 1 : k(4.4));
      gl.uniform1f(loc.uFocus, focusNow);
      gl.uniform1f(loc.uScroll, still ? 0 : Math.min(scrollY / (innerHeight * 4), 1));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      if (!alive) return;
      if (!document.hidden) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const once = () => requestAnimationFrame(draw);
    if (!init()) return;
    if (still) { kick.current = once; once(); addEventListener('resize', once); }
    else raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => { ptr.tx = e.clientX / innerWidth; ptr.ty = 1 - e.clientY / innerHeight; };
    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); };
    const onRestored = () => { if (init() && alive) { if (still) requestAnimationFrame(draw); else raf = requestAnimationFrame(loop); } };
    addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      removeEventListener('resize', once);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      kick.current = () => {};
      gl?.getExtension('WEBGL_lose_context')?.loseContext();   // hand the GPU context back now, not at garbage collection
    };
  }, [variant]);

  return <canvas ref={ref} aria-hidden className="bd" data-variant={variant} />;
}
