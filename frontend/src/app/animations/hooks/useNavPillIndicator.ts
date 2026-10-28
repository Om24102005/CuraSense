import { useEffect, type RefObject } from 'react';
import { gsap, Flip } from '../engine/gsapEngine';
import { useDeviceTier } from '../deviceTier';
import { useReducedMotion } from './useReducedMotion';
import { getDuration, easings } from '../config';

/**
 * FLIP-style pill that glides to the active nav item, while enabled.
 * Uses GSAP's real Flip plugin: capture the pill's current box, snap it to
 * the new tab's box, then let Flip animate the diff — this is exactly the
 * "measure before, apply after, animate the delta" case Flip exists for.
 */
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
    const state = Flip.getState(pill);

    gsap.set(pill, {
      left: btnBox.left - listBox.left,
      top: btnBox.top - listBox.top,
      width: btnBox.width,
      height: btnBox.height,
      opacity: 1,
    });

    Flip.from(state, { duration: moveDuration, ease: easings.out });
  }, [activeTab, navListRef, navPillRef, enabled, tier, reducedMotion]);
}
