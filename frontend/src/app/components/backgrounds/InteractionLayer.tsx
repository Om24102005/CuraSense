/* ═══════════════════════════════════════════════════════════════════
   CuraSense — Global Interaction Layer
   ───────────────────────────────────────────────────────────────────
   One small ring at the point of a tap or click on a control. A single
   reused element, moved with transform and faded with opacity, so a tap
   never creates DOM or repaints the page while a screen is switching.

   Companion CSS (in styles/index.css) handles universal press scale
   and focus-visible glow — those need to apply to every button on
   the page, not just elements that import this layer.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import { gsap, useReducedMotion } from '../../animations';

const CONTROLS = 'button, a[href], [role="button"], [role="tab"]';
const SKIP = 'input, textarea, select, [contenteditable="true"], [data-no-cs-transition]';
const SIZE = 72;

export default function InteractionLayer() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || reduced) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      // detail 0 is a keyboard click: it has no point on screen, and the focus ring already answers it.
      if (!e.detail || !target?.closest?.(CONTROLS) || target.closest(SKIP)) return;
      gsap.killTweensOf(ring);
      gsap.fromTo(ring,
        { x: e.clientX - SIZE / 2, y: e.clientY - SIZE / 2, scale: 0.25, autoAlpha: 0.5 },
        { scale: 1, autoAlpha: 0, duration: 0.32, ease: 'power2.out' });
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      gsap.killTweensOf(ring);
      gsap.set(ring, { autoAlpha: 0 });
    };
  }, [reduced]);

  return (
    <div
      ref={ringRef}
      aria-hidden
      data-tap-ring
      style={{
        position: 'fixed', left: 0, top: 0, width: SIZE, height: SIZE, borderRadius: '50%',
        border: '1.5px solid var(--accent-cyan, #00e5ff)', pointerEvents: 'none', visibility: 'hidden', zIndex: 9998,
      }}
    />
  );
}
