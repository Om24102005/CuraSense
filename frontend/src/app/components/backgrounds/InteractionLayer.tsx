/* ═══════════════════════════════════════════════════════════════════
   CuraSense — Global Interaction Layer
   ───────────────────────────────────────────────────────────────────
   Premium feedback for EVERY user input, app-wide. One mount, no
   per-component wiring needed.

     ✦ Click ripple    Two concentric expanding rings + a flash dot
                       at the click point on every document click.
                       Skipped inside text inputs/selects so it
                       doesn't fight typing.

     ✦ Edge flash      Hairline gradient ribbons on all four viewport
                       edges briefly pulse on every click — frames
                       the action like a film cut.

     ✦ Page curtain    A horizontal aurora bar wipes left→right
                       whenever fireCurtain() is called (tab changes,
                       major navigations). Triggered via the global
                       `window.__curasenseCurtain()` function so any
                       component can fire it without prop-drilling.

     ✦ Hover-link      Live updates a CSS var --pointer-x / --pointer-y
                       at document level so any element can reference
                       pointer position for radial gradient effects.

   Companion CSS (in styles/index.css) handles universal press scale
   and focus-visible glow — those need to apply to every button on
   the page, not just elements that import this layer.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

declare global {
  interface Window {
    __curasenseCurtain?: () => void;
  }
}

export default function InteractionLayer() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const curtainPrimaryRef = useRef<HTMLDivElement | null>(null);
  const curtainTrailRef = useRef<HTMLDivElement | null>(null);
  const edgesRef = useRef<HTMLDivElement | null>(null);

  /* ── CURTAIN ────────────────────────────────────────────────────────
     Exposed globally so any component can fire it (e.g. App.tsx when
     activeTab changes). Two layers — primary aurora bar and a softer
     trail — sweep left→right with overlap for depth. */
  useEffect(() => {
    const primary = curtainPrimaryRef.current;
    const trail = curtainTrailRef.current;
    if (!primary || !trail) return;

    const fire = () => {
      gsap.killTweensOf([primary, trail]);
      gsap.set(primary, { xPercent: -110, opacity: 1 });
      gsap.set(trail,   { xPercent: -130, opacity: 0.6 });

      gsap.to(primary, { xPercent: 110, duration: 0.85, ease: 'power3.inOut' });
      gsap.to(trail,   { xPercent: 110, duration: 1.05, ease: 'power3.inOut', delay: 0.06 });
      gsap.to([primary, trail], { opacity: 0, duration: 0.3, delay: 0.6 });
    };

    window.__curasenseCurtain = fire;
    return () => {
      delete window.__curasenseCurtain;
    };
  }, []);

  /* ── CLICK RIPPLE + EDGE FLASH ──────────────────────────────────── */
  useEffect(() => {
    const layer = layerRef.current;
    const edges = edgesRef.current;
    if (!layer || !edges) return;

    const onPointerMove = (e: PointerEvent) => {
      // Expose pointer position as CSS vars so any element can use
      // it for spotlight gradients, magnet zones, etc.
      document.documentElement.style.setProperty('--pointer-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${e.clientY}px`);
    };

    const onClick = (e: MouseEvent) => {
      // Skip inside form fields so the ripple never covers what the
      // user is typing into.
      const target = e.target as HTMLElement;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

      const x = e.clientX;
      const y = e.clientY;

      // Primary expanding ring — violet, large
      spawnRing(layer, x, y, {
        startSize: 0,
        endSize: 220,
        color: 'var(--accent-violet, #a855f7)',
        borderWidth: 2,
        opacity: 0.85,
        duration: 0.85,
        ease: 'expo.out',
      });

      // Secondary tighter ring — cyan, smaller, faster
      spawnRing(layer, x, y, {
        startSize: 0,
        endSize: 90,
        color: 'var(--accent-cyan, #00e5ff)',
        borderWidth: 1.5,
        opacity: 0.7,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.04,
      });

      // Center flash dot
      const dot = document.createElement('div');
      Object.assign(dot.style, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: '0px',
        height: '0px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(255,255,255,0.95), var(--accent-cyan, #00e5ff) 40%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        zIndex: '1',
      });
      layer.appendChild(dot);
      gsap.fromTo(
        dot,
        { width: 0, height: 0, opacity: 1 },
        {
          width: 28,
          height: 28,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => dot.remove(),
        }
      );

      // Edge flash — all four ribbons brighten together
      const ribbons = edges.querySelectorAll<HTMLElement>('[data-edge]');
      gsap.killTweensOf(ribbons);
      gsap.fromTo(
        ribbons,
        { opacity: 0 },
        {
          opacity: 0.55,
          duration: 0.12,
          ease: 'power3.out',
          onComplete: () => {
            gsap.to(ribbons, { opacity: 0, duration: 0.5, ease: 'power3.in' });
          },
        }
      );
    };

    document.addEventListener('click', onClick);
    document.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <>
      {/* Click ripple host — sits above the entire page but never
          intercepts pointer events so it doesn't break clicks. */}
      <div
        ref={layerRef}
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9998 }}
      />

      {/* Edge flash ribbons — invisible by default, pulse on click. */}
      <div
        ref={edgesRef}
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9997 }}
      >
        <div
          data-edge
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '2px',
            opacity: 0,
            background:
              'linear-gradient(90deg, transparent, var(--accent-cyan, #00e5ff), var(--accent-violet, #a855f7), transparent)',
            boxShadow: '0 0 12px var(--accent-violet, #a855f7)',
          }}
        />
        <div
          data-edge
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0, height: '2px',
            opacity: 0,
            background:
              'linear-gradient(90deg, transparent, var(--accent-violet, #a855f7), var(--accent-cyan, #00e5ff), transparent)',
            boxShadow: '0 0 12px var(--accent-cyan, #00e5ff)',
          }}
        />
        <div
          data-edge
          style={{
            position: 'absolute',
            top: 0, bottom: 0, left: 0, width: '2px',
            opacity: 0,
            background:
              'linear-gradient(180deg, transparent, var(--accent-cyan, #00e5ff), var(--accent-violet, #a855f7), transparent)',
          }}
        />
        <div
          data-edge
          style={{
            position: 'absolute',
            top: 0, bottom: 0, right: 0, width: '2px',
            opacity: 0,
            background:
              'linear-gradient(180deg, transparent, var(--accent-violet, #a855f7), var(--accent-cyan, #00e5ff), transparent)',
          }}
        />
      </div>

      {/* Page-transition curtain — two stacked aurora bars that wipe
          across the viewport on demand. Z above everything except
          the click rings (which feel "above" everything regardless). */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 9996 }}
      >
        <div
          ref={curtainTrailRef}
          style={{
            position: 'absolute',
            top: 0, bottom: 0, width: '60vw',
            left: 0,
            transform: 'translateX(-130%)',
            background:
              'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent-cyan, #00e5ff) 40%, transparent) 30%, color-mix(in srgb, var(--accent-violet, #a855f7) 60%, transparent) 50%, color-mix(in srgb, var(--accent-cyan, #00e5ff) 40%, transparent) 70%, transparent 100%)',
            filter: 'blur(40px)',
            opacity: 0,
            mixBlendMode: 'screen',
          }}
        />
        <div
          ref={curtainPrimaryRef}
          style={{
            position: 'absolute',
            top: 0, bottom: 0, width: '12vw',
            left: 0,
            transform: 'translateX(-110%)',
            background:
              'linear-gradient(90deg, transparent 0%, var(--accent-cyan, #00e5ff) 30%, var(--accent-violet, #a855f7) 70%, transparent 100%)',
            opacity: 0,
            boxShadow:
              '0 0 80px 20px color-mix(in srgb, var(--accent-violet, #a855f7) 40%, transparent)',
          }}
        />
      </div>
    </>
  );
}

/* ── helper: spawn one expanding ring ─────────────────────────────── */
function spawnRing(
  host: HTMLElement,
  x: number,
  y: number,
  opts: {
    startSize: number;
    endSize: number;
    color: string;
    borderWidth: number;
    opacity: number;
    duration: number;
    ease: string;
    delay?: number;
  }
) {
  const ring = document.createElement('div');
  Object.assign(ring.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: `${opts.startSize}px`,
    height: `${opts.startSize}px`,
    borderRadius: '50%',
    border: `${opts.borderWidth}px solid ${opts.color}`,
    boxShadow: `0 0 24px ${opts.color}`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    mixBlendMode: 'screen',
    opacity: '0',
  });
  host.appendChild(ring);

  gsap.fromTo(
    ring,
    { width: opts.startSize, height: opts.startSize, opacity: opts.opacity },
    {
      width: opts.endSize,
      height: opts.endSize,
      opacity: 0,
      duration: opts.duration,
      ease: opts.ease,
      delay: opts.delay ?? 0,
      onComplete: () => ring.remove(),
    }
  );
}
