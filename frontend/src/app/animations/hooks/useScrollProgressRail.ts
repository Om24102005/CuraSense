import { useEffect, type RefObject } from 'react';
import { gsap } from '../engine/gsapEngine';
import { useDeviceTier } from '../deviceTier';
import { useReducedMotion } from './useReducedMotion';
import { getDuration, easings } from '../config';

/** Scales the fixed top progress rail to the page's scroll ratio, while enabled. */
export function useScrollProgressRail(railRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled) return;
    const rail = railRef.current;
    if (!rail) return;

    const duration = getDuration('scrollRail', tier, reducedMotion);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? doc.scrollTop / max : 0;
      if (reducedMotion) {
        gsap.set(rail, { scaleX: ratio });
      } else {
        gsap.to(rail, { scaleX: ratio, duration, ease: easings.smooth, overwrite: 'auto' });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [railRef, enabled, tier, reducedMotion]);
}
