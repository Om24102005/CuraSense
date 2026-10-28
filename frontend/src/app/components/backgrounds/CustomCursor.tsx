/* ═══════════════════════════════════════════════════════
   CuraSense — GOD-LEVEL Custom Cursor
   Magnetic, reactive, trail, ripple on click
   ═══════════════════════════════════════════════════════ */

import { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const trailPositions = useRef<{ x: number; y: number }[]>([]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };

    // Main cursor - instant
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    // Follower - smooth GSAP
    if (followerRef.current) {
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // Trail
    trailPositions.current.push({ x: e.clientX, y: e.clientY });
    if (trailPositions.current.length > 8) {
      trailPositions.current.shift();
    }
    if (trailRef.current) {
      const trail = trailPositions.current;
      const avgX = trail.reduce((s, p) => s + p.x, 0) / trail.length;
      const avgY = trail.reduce((s, p) => s + p.y, 0) / trail.length;
      gsap.to(trailRef.current, {
        x: avgX,
        y: avgY,
        duration: 0.6,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    }
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickable =
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('[data-cursor="pointer"]') ||
      target.closest('.magnetic-card');

    setIsHovering(!!isClickable);
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    // Ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--accent-violet, #8b5cf6);
      pointer-events: none;
      z-index: 99999;
      left: ${e.clientX - 10}px;
      top: ${e.clientY - 10}px;
      opacity: 0.5;
    `;
    document.body.appendChild(ripple);

    gsap.to(ripple, {
      scale: 8,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove(),
    });

    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 150);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
      document.body.style.cursor = '';
    };
  }, [handleMouseMove, handleMouseOver, handleClick]);

  // Don't show on touch devices
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/*
        ── CURSOR REDESIGN ─────────────────────────────────────────────
        Three layers, all visible (no mixBlendMode: difference, which was
        what made the cursor disappear against the dark navy/violet bg):

          1. Core dot     — pure white, sharp, bright. Reads on any bg.
          2. Aurora halo  — radial cyan→violet glow ring around the core.
          3. Follower     — thin cyan ring with elastic damping.
          4. Trail        — soft cyan blur a few px behind the core.

        Click → core scales down, halo flashes brighter; hover on links
        → halo grows to ~3× and shifts violet.
      */}

      {/* 1+2. Core + aurora halo (translated as a single unit by JS) */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[99999]"
        style={{
          transform: 'translate(0, 0)',
          left: 0,
          top: 0,
          width: isHovering ? 38 : 14,
          height: isHovering ? 38 : 14,
          marginLeft: isHovering ? -19 : -7,
          marginTop: isHovering ? -19 : -7,
          borderRadius: '50%',
          // Layered radial: bright white core → cyan mid → violet edge → transparent
          background: isHovering
            ? 'radial-gradient(circle, #ffffff 0%, #ffffff 18%, var(--accent-violet, #a855f7) 55%, transparent 75%)'
            : 'radial-gradient(circle, #ffffff 0%, #ffffff 35%, var(--accent-cyan, #22d3ee) 60%, transparent 90%)',
          transition: 'width 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), margin 0.22s, background 0.3s',
          opacity: isClicking ? 1 : 0.95,
          boxShadow: isHovering
            ? '0 0 24px 4px var(--accent-violet, #a855f7), 0 0 80px 20px rgba(168, 85, 247, 0.45)'
            : '0 0 16px 3px var(--accent-cyan, #22d3ee), 0 0 48px 12px rgba(34, 211, 238, 0.35)',
          filter: isClicking ? 'brightness(1.4) saturate(1.4)' : 'brightness(1.1)',
        }}
      />

      {/* 3. Follower ring — thin chromatic outline that lags behind */}
      <div
        ref={followerRef}
        className="pointer-events-none fixed z-[99998]"
        style={{
          transform: 'translate(-50%, -50%)',
          left: 0,
          top: 0,
          width: isHovering ? 64 : 36,
          height: isHovering ? 64 : 36,
          borderRadius: '50%',
          border: `1.5px solid var(--accent-cyan, #22d3ee)`,
          opacity: isHovering ? 0.85 : 0.55,
          boxShadow: isHovering
            ? '0 0 24px var(--accent-violet, #a855f7), inset 0 0 12px rgba(168, 85, 247, 0.25)'
            : '0 0 12px var(--accent-cyan, #22d3ee), inset 0 0 6px rgba(34, 211, 238, 0.20)',
          transition: 'width 0.3s, height 0.3s, opacity 0.3s, box-shadow 0.3s, border-color 0.3s',
        }}
      />

      {/* 4. Soft cyan trail — a blurred dot a few px behind for motion smear */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed z-[99997]"
        style={{
          transform: 'translate(-50%, -50%)',
          left: 0,
          top: 0,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'var(--accent-cyan, #22d3ee)',
          opacity: 0.45,
          filter: 'blur(6px)',
        }}
      />
    </>
  );
}
