import { useEffect } from 'react';
import { gsap } from '../engine/gsapEngine';
import { useDeviceTier } from '../deviceTier';
import { useReducedMotion } from './useReducedMotion';
import { getDuration, easings } from '../config';

/** Fades/slides #page-content in whenever activeTab changes, while enabled. */
export function usePageTransition(enabled: boolean, activeTab: string) {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled) return;
    const main = document.getElementById('page-content');
    if (!main) return;

    const duration = getDuration('pageTransition', tier, reducedMotion);
    const tween = gsap.fromTo(
      main,
      { opacity: 0, y: reducedMotion ? 0 : 24 },
      { opacity: 1, y: 0, duration, ease: easings.out, clearProps: 'transform,opacity' }
    );

    return () => {
      tween.kill();
      gsap.set(main, { clearProps: 'transform,opacity,clipPath,filter' });
    };
  }, [activeTab, enabled, tier, reducedMotion]);
}
