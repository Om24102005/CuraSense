import { gsap } from '../engine/gsapEngine';
import { durations } from '../config';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Brief crossfade cue on <body> when the theme changes. No-op under prefers-reduced-motion. */
export function playThemeBodyTransition() {
  if (prefersReducedMotion()) return;
  gsap.to('body', { duration: durations.themeBody, ease: 'power2.inOut' });
}

/**
 * Circular-reveal theme swap, centered on the toggle button's click point.
 * Uses the native View Transitions API where supported; falls back to the
 * plain crossfade above everywhere else (older Safari/Firefox, reduced motion).
 */
export function swapThemeWithReveal(originX: number, originY: number, apply: () => void) {
  const supportsViewTransitions =
    typeof document !== 'undefined' && typeof (document as any).startViewTransition === 'function';

  if (prefersReducedMotion() || !supportsViewTransitions) {
    apply();
    playThemeBodyTransition();
    return;
  }

  const root = document.documentElement;
  root.style.setProperty('--vt-x', `${originX}px`);
  root.style.setProperty('--vt-y', `${originY}px`);
  root.classList.add('vt-circle');

  const transition = (document as any).startViewTransition(() => {
    apply();
  });
  transition.finished.finally(() => root.classList.remove('vt-circle'));
}
