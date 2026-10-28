import type { DeviceTier } from './deviceTier';

/** Base durations (seconds) — the "high tier" numbers, taken verbatim from the original App.tsx effects. */
export const durations = {
  pageTransition: 0.55,
  scrollRail:     0.25,
  headerDensify:  0.4,
  navPill:        0.55,
  navPillFade:    0.2,
  drawerOpen:     0.7,
  drawerClose:    0.45,
  drawerStagger:  0.5,
  drawerDelay:    0.18,
  themeBody:      0.6,
};

export const easings = {
  out:     'expo.out',
  smooth:  'power2.out',
  inOut:   'power2.inOut',
  in:      'power3.in',
  outSoft: 'power3.out',
};

/** anime.js uses its own easing string dialect — kept separate from the GSAP table above. */
export const animeEasings = {
  out:    'easeOutExpo',
  smooth: 'easeOutQuad',
  in:     'easeInCubic',
  inOut:  'easeInOutSine',
};

const TIER_MULTIPLIER: Record<DeviceTier, number> = {
  high: 1,
  mid:  0.75,
  low:  0.5,
};

/**
 * Scaled duration for a tier + reduced-motion state.
 * reducedMotion always wins: 0 means "skip the tween, jump to end state."
 */
export function getDuration(key: keyof typeof durations, tier: DeviceTier, reducedMotion: boolean): number {
  if (reducedMotion) return 0;
  return durations[key] * TIER_MULTIPLIER[tier];
}

/** Stagger step (seconds) scaled by tier — fewer/faster on low-end devices. */
export function getStagger(base: number, tier: DeviceTier, reducedMotion: boolean): number {
  if (reducedMotion) return 0;
  return base * TIER_MULTIPLIER[tier];
}
