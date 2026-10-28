import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '../engine/gsapEngine';
import { useDeviceTier } from '../deviceTier';
import { useReducedMotion } from './useReducedMotion';
import { getDuration, easings } from '../config';

/** Shrinks header padding + increases blur once the page scrolls past 40px, while enabled. */
export function useHeaderDensify(headerRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();
  // backdrop-filter blur is one of the more expensive CSS properties to animate on
  // low-end mobile GPUs — skip the blur step there, keep the padding tween.
  const skipBlur = tier === 'low';

  useEffect(() => {
    if (!enabled) return;
    const el = headerRef.current;
    if (!el) return;

    const duration = getDuration('headerDensify', tier, reducedMotion);

    const trigger = ScrollTrigger.create({
      start: 40,
      end: 99999,
      onUpdate: (self) => {
        const condensed = self.scroll() > 40;
        gsap.to(el, {
          paddingTop: condensed ? 6 : 0,
          paddingBottom: condensed ? 6 : 0,
          ...(skipBlur ? null : {
            backdropFilter: condensed ? 'blur(28px) saturate(180%)' : 'blur(24px)',
          }),
          duration,
          ease: easings.outSoft,
        });
      },
    });

    return () => trigger.kill();
  }, [headerRef, enabled, tier, reducedMotion, skipBlur]);
}
