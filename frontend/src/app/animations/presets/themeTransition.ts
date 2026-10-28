import { gsap } from '../engine/gsapEngine';
import { durations } from '../config';

/** Brief crossfade cue on <body> when the theme changes. No-op under prefers-reduced-motion. */
export function playThemeBodyTransition() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  gsap.to('body', { duration: durations.themeBody, ease: 'power2.inOut' });
}
