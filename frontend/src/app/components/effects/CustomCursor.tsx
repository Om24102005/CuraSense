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
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[99999]"
        style={{
          transform: 'translate(0, 0)',
          left: 0,
          top: 0,
          width: isHovering ? 40 : 8,
          height: isHovering ? 40 : 8,
          borderRadius: '50%',
          background: isHovering
            ? 'var(--accent-violet)'
            : 'var(--accent-cyan)',
          mixBlendMode: 'difference',
          transition: 'width 0.2s, height 0.2s, background 0.3s',
          opacity: isClicking ? 0.3 : 0.8,
          boxShadow: isHovering
            ? '0 0 30px var(--accent-violet)'
            : '0 0 10px var(--accent-cyan)',
        }}
      />

      {/* Follower ring */}
      <div
        ref={followerRef}
        className="pointer-events-none fixed z-[99998]"
        style={{
          transform: 'translate(-50%, -50%)',
          left: 0,
          top: 0,
          width: isHovering ? 60 : 30,
          height: isHovering ? 60 : 30,
          borderRadius: '50%',
          border: `1.5px solid var(--accent-violet)`,
          opacity: 0.4,
          transition: 'width 0.3s, height 0.3s',
        }}
      />

      {/* Trail */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed z-[99997]"
        style={{
          transform: 'translate(-50%, -50%)',
          left: 0,
          top: 0,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'var(--accent-cyan)',
          opacity: 0.2,
          filter: 'blur(2px)',
        }}
      />
    </>
  );
}
