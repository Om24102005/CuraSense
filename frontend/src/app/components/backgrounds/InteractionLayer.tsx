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

   Companion CSS (in styles/index.css) handles universal press scale
   and focus-visible glow — those need to apply to every button on
   the page, not just elements that import this layer.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function InteractionLayer() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const edgesRef = useRef<HTMLDivElement | null>(null);

  /* ── CLICK RIPPLE + EDGE FLASH ──────────────────────────────────── */
  useEffect(() => {
    const layer = layerRef.current;
    const edges = edgesRef.current;
    if (!layer || !edges) return;

    const onClick = (e: MouseEvent) => {
      // Skip inside form fields so the ripple never covers what the
      // user is typing into.
      const target = e.target as HTMLElement;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

      const x = e.clientX;
      const y = e.clientY;

      // Primary expanding ring — violet, large
      spawnRing(layer, x, y, {
        size: 220,
        color: 'var(--accent-violet, #a855f7)',
        borderWidth: 2,
        opacity: 0.85,
        duration: 0.85,
        ease: 'expo.out',
      });

      // Secondary tighter ring — cyan, smaller, faster
      spawnRing(layer, x, y, {
        size: 90,
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
        left: `${x - 14}px`,
        top: `${y - 14}px`,
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(255,255,255,0.95), var(--accent-cyan, #00e5ff) 40%, transparent 70%)',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        zIndex: '1',
      });
      layer.appendChild(dot);
      gsap.fromTo(
        dot,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
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

    return () => {
      document.removeEventListener('click', onClick);
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
    </>
  );
}

/* ── helper: spawn one expanding ring ─────────────────────────────── */
// The ring is built at its final size and grown with a transform: animating width/height would redo layout on every frame
// of a click, right when the page may be switching.
function spawnRing(
  host: HTMLElement,
  x: number,
  y: number,
  opts: {
    size: number;
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
    left: `${x - opts.size / 2}px`,
    top: `${y - opts.size / 2}px`,
    width: `${opts.size}px`,
    height: `${opts.size}px`,
    borderRadius: '50%',
    border: `${opts.borderWidth}px solid ${opts.color}`,
    boxShadow: `0 0 24px ${opts.color}`,
    pointerEvents: 'none',
    mixBlendMode: 'screen',
    opacity: '0',
  });
  host.appendChild(ring);

  gsap.fromTo(
    ring,
    { scale: 0.02, opacity: opts.opacity },
    {
      scale: 1,
      opacity: 0,
      duration: opts.duration,
      ease: opts.ease,
      delay: opts.delay ?? 0,
      onComplete: () => ring.remove(),
    }
  );
}
