/* ═══════════════════════════════════════════════════════
   CuraSense — PREMIUM Lenis Smooth Scroll
   Buttery cinematic scroll with momentum + ScrollTrigger sync
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: ReactNode;
  lerp?: number;
  duration?: number;
  smoothWheel?: boolean;
}

export default function SmoothScroll({
  children,
  lerp = 0.075,
  duration = 1.6,
  smoothWheel = true,
}: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Premium easing curve — luxury car deceleration
    const lenis = new Lenis({
      lerp,
      duration,
      smoothWheel,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      infinite: false,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      syncTouch: true,
      syncTouchLerp: 0.075,
    });

    lenisRef.current = lenis;

    // Attach instance to window for ScrollTrigger.scrollerProxy + page-level access
    (window as any).__lenis = lenis;

    // Sync Lenis ↔ GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Velocity-driven blur on body for cinematic motion
    let velRaf = 0;
    const updateVelocity = () => {
      const v = Math.min(Math.abs((lenis as any).velocity || 0) * 0.3, 6);
      document.documentElement.style.setProperty('--scroll-vel', v.toFixed(2));
      velRaf = requestAnimationFrame(updateVelocity);
    };
    velRaf = requestAnimationFrame(updateVelocity);

    // Anchor link smooth scroll
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    };
    document.addEventListener('click', handleAnchorClick);

    // Refresh ScrollTrigger after Lenis is ready
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(velRaf);
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, [lerp, duration, smoothWheel]);

  return <>{children}</>;
}

// Public scroll-to helper for non-anchor JS callers
export function scrollToTarget(target: string | HTMLElement, opts?: { duration?: number; offset?: number }) {
  const lenis = (window as any).__lenis as Lenis | undefined;
  if (lenis) {
    lenis.scrollTo(target as any, {
      duration: opts?.duration ?? 1.6,
      offset: opts?.offset ?? 0,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
