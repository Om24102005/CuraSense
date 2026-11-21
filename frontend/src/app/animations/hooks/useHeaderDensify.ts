import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '../engine/gsapEngine';
import { useDeviceTier } from '../deviceTier';
import { useReducedMotion } from './useReducedMotion';
import { getDuration, easings } from '../config';

/**
 * Tightens the header once the page scrolls past 40px, while enabled. The bar slides up and its content slides half as far
 * back down, so it reads shorter without changing layout: tweening padding or backdrop-filter here redid layout and blur mid-scroll.
 */
export function useHeaderDensify(headerRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled) return;
    const el = headerRef.current;
    if (!el) return;
    const inner = el.querySelector<HTMLElement>('[data-header-inner]');
    const targets = inner ? [el, inner] : [el];

    const duration = getDuration('headerDensify', tier, reducedMotion);

    const trigger = ScrollTrigger.create({
      start: 40,
      end: 99999,
      onToggle: ({ isActive }) => {
        gsap.to(el, { y: isActive ? -8 : 0, duration, ease: easings.outSoft, overwrite: 'auto' });
        if (inner) gsap.to(inner, { y: isActive ? 4 : 0, duration, ease: easings.outSoft, overwrite: 'auto' });
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: 'transform' });
    };
  }, [headerRef, enabled, tier, reducedMotion]);
}
