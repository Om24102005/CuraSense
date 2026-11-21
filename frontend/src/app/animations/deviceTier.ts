import { useState } from 'react';

export type DeviceTier = 'low' | 'mid' | 'high';

const isIOS = () =>
  typeof navigator !== 'undefined' &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));   // iPadOS says "Macintosh"

/** A phone: a touch screen whose short side is under 500 CSS px (an iPad or a desktop window is not). */
// shortcut: a foldable unfolded to a tablet-sized screen counts as a tablet, which is fine; revisit if one needs the phone profile.
export const isPhone = () =>
  typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 500;

/**
 * One-shot capability read: CPU core count, device memory, and network
 * effective-type are all the signals the platform actually exposes — there
 * is no direct "GPU speed" API. Treated as a rough triage, not a benchmark.
 */
export function getDeviceTier(): DeviceTier {
  if (typeof navigator === 'undefined') return 'high';

  // WebKit (every iPhone and iPad, in Safari and inside the app) reports at most 4 cores for privacy, whatever the chip,
  // so the core count says nothing about speed there: Apple devices start at 'mid' (the governors still trade pixels for frames).
  if (isIOS()) return 'mid';

  const cores  = navigator.hardwareConcurrency ?? 8;
  // deviceMemory/connection are non-standard (Chromium-only); absent elsewhere.
  const memory = (navigator as any).deviceMemory ?? 8;
  const conn   = (navigator as any).connection;
  const saveData      = !!conn?.saveData;
  const slowNetwork    = conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g';

  if (cores <= 4 || memory <= 2 || saveData || slowNetwork) return 'low';
  // A phone never gets 'high': the full cell (half-float post chain, bloom) and thousands of particles cost more battery and heat
  // than a phone should give, even when its 8 cores look strong on paper.
  if (cores <= 6 || memory <= 4 || isPhone()) return 'mid';
  return 'high';
}

/** React binding for getDeviceTier() — computed once per mount, not reactive to hardware changes. */
export function useDeviceTier(): DeviceTier {
  const [tier] = useState(getDeviceTier);
  return tier;
}
