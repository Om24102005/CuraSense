import { flushSync } from 'react-dom';

/*
 * Tracks whether the *most recent* activeTab change was already animated by
 * the native View Transitions API, so usePageTransition's GSAP fallback
 * knows whether to run. A simple capability check isn't enough here: some
 * activeTab changes (e.g. the dashboard appearing right after the cinematic
 * intro finishes) never go through navigateWithViewTransition at all, so
 * native VT never actually ran for them even in a browser that supports it
 * — those still need the GSAP fallback regardless of browser support.
 */
let lastTransitionWasNative = false;

export function consumeNativeTransitionFlag(): boolean {
  const was = lastTransitionWasNative;
  lastTransitionWasNative = false;
  return was;
}

/** Wraps a state update (e.g. setActiveTab) in a native View Transition when available. */
export function navigateWithViewTransition(apply: () => void) {
  const supportsVT = typeof document !== 'undefined' && typeof (document as any).startViewTransition === 'function';
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsVT || reducedMotion) {
    lastTransitionWasNative = false;
    apply();
    return;
  }

  lastTransitionWasNative = true;
  (document as any).startViewTransition(() => {
    flushSync(() => apply());
  });
}
