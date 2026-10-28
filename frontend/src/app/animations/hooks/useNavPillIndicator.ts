import { useEffect, type RefObject } from 'react';
import { gsap } from '../engine/gsapEngine';
import { useDeviceTier } from '../deviceTier';
import { useReducedMotion } from './useReducedMotion';
import { getDuration, easings } from '../config';

/** FLIP-style pill that glides to the active nav item, while enabled. */
export function useNavPillIndicator(
  navListRef: RefObject<HTMLElement | null>,
  navPillRef: RefObject<HTMLElement | null>,
  activeTab: string,
  enabled: boolean
) {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled) return;
    const list = navListRef.current;
    const pill = navPillRef.current;
    if (!list || !pill) return;

    const fadeDuration = getDuration('navPillFade', tier, reducedMotion);
    const moveDuration  = getDuration('navPill', tier, reducedMotion);

    const active = list.querySelector<HTMLElement>(`[data-nav-id="${activeTab}"]`);
    if (!active) {
      gsap.to(pill, { opacity: 0, duration: fadeDuration });
      return;
    }

    const listBox = list.getBoundingClientRect();
    const btnBox = active.getBoundingClientRect();

    gsap.to(pill, {
      x: btnBox.left - listBox.left,
      y: btnBox.top - listBox.top,
      width: btnBox.width,
      height: btnBox.height,
      opacity: 1,
      duration: moveDuration,
      ease: easings.out,
    });
  }, [activeTab, navListRef, navPillRef, enabled, tier, reducedMotion]);
}
