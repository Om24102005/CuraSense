import { useEffect, type RefObject } from 'react';
import { gsap } from '../engine/gsapEngine';
import { animate, stagger } from '../engine/animeEngine';
import { useDeviceTier } from '../deviceTier';
import { useReducedMotion } from './useReducedMotion';
import { getDuration, getStagger, animeEasings } from '../config';

/**
 * Circle-reveal open/close for the mobile nav drawer (GSAP, clip-path container)
 * with a staggered item entrance (anime.js) — the two engines split by what
 * each is better at: GSAP for the clip-path/opacity container tween, anime.js
 * for the per-item stagger.
 */
export function useMobileDrawerAnimation(drawerRef: RefObject<HTMLElement | null>, open: boolean) {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const openDuration  = getDuration('drawerOpen', tier, reducedMotion);
    const closeDuration = getDuration('drawerClose', tier, reducedMotion);

    let itemAnimation: ReturnType<typeof animate> | undefined;

    if (open) {
      gsap.set(drawer, { display: 'flex' });
      gsap.fromTo(drawer,
        { opacity: 0, clipPath: reducedMotion ? 'circle(150% at 95% 5%)' : 'circle(0% at 95% 5%)' },
        { opacity: 1, clipPath: 'circle(150% at 95% 5%)', duration: openDuration, ease: 'expo.out' }
      );

      const items = drawer.querySelectorAll('[data-drawer-item]');
      itemAnimation = animate(items, {
        y: reducedMotion ? [0, 0] : [28, 0],
        opacity: [0, 1],
        duration: getDuration('drawerStagger', tier, reducedMotion) * 1000,
        delay: stagger(getStagger(60, tier, reducedMotion), { start: getDuration('drawerDelay', tier, reducedMotion) * 1000 }),
        ease: animeEasings.out,
      });
    } else {
      gsap.to(drawer, {
        opacity: 0,
        clipPath: 'circle(0% at 95% 5%)',
        duration: closeDuration,
        ease: 'power3.in',
        onComplete: () => gsap.set(drawer, { display: 'none' }),
      });
    }

    return () => {
      itemAnimation?.pause();
    };
  }, [open, drawerRef, tier, reducedMotion]);
}
