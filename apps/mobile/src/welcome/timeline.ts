// When the welcome's checklist rows appear, when they may show their result, and when the whole welcome may end. Pure, so Node can test it.

export type Kind = 'signin' | 'signup' | 'resume';
/** What a real task has done so far. */
export type Real = 'pending' | 'ok' | 'failed';

/** A hung request cannot trap the person on this screen. */
export const MAX_MS = 15000;

/** A signed-in session picked up again at launch gets the short version. Reduce Motion shortens both. */
export const minDuration = (kind: Kind, reduce: boolean) => (kind === 'resume' ? (reduce ? 600 : 1200) : reduce ? 1000 : 3000);

/** When each of the three rows appears, and how long a row stays on screen before it may show its result, so a tick is never a flash. */
export const rowTiming = (reduce: boolean) => (reduce ? { appear: [200, 200, 200], minShow: 300 } : { appear: [1500, 1750, 2000], minShow: 600 });

/** What a row shows: the real result, but not before the row has been on screen long enough to be read. */
export const shown = (real: Real, t: number, appearAt: number, minShow: number): Real => (real !== 'pending' && t >= appearAt + minShow ? real : 'pending');

/** The welcome ends when it has run its minimum time and every row has its result (the short version only needs its minimum time). */
export function isFinished(kind: Kind, rows: Real[], t: number, reduce: boolean): boolean {
  if (t >= MAX_MS) return true;
  if (t < minDuration(kind, reduce)) return false;
  return kind === 'resume' || rows.every((r) => r !== 'pending');
}
