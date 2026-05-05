/* ═══════════════════════════════════════════════════════
   CuraSense — Lenis Smooth Scroll Provider
   Butter-smooth scrolling with GSAP ScrollTrigger integration
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
  lerp = 0.08,
  duration = 1.2,
  smoothWheel = true,
}: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp,
      duration,
      smoothWheel,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.lagSmoothing(0);
    };
  }, [lerp, duration, smoothWheel]);

  return <>{children}</>;
}
