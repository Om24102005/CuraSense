import { useState } from 'react';

export type DeviceTier = 'low' | 'mid' | 'high';

/**
 * One-shot capability read: CPU core count, device memory, and network
 * effective-type are all the signals the platform actually exposes — there
 * is no direct "GPU speed" API. Treated as a rough triage, not a benchmark.
 */
export function getDeviceTier(): DeviceTier {
  if (typeof navigator === 'undefined') return 'high';

  const cores  = navigator.hardwareConcurrency ?? 8;
  // deviceMemory/connection are non-standard (Chromium-only); absent elsewhere.
  const memory = (navigator as any).deviceMemory ?? 8;
  const conn   = (navigator as any).connection;
  const saveData      = !!conn?.saveData;
  const slowNetwork    = conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g';

  if (cores <= 4 || memory <= 2 || saveData || slowNetwork) return 'low';
  if (cores <= 6 || memory <= 4) return 'mid';
  return 'high';
}

/** React binding for getDeviceTier() — computed once per mount, not reactive to hardware changes. */
export function useDeviceTier(): DeviceTier {
  const [tier] = useState(getDeviceTier);
  return tier;
}
