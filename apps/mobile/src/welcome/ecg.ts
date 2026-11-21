// One heartbeat as a polyline, for the welcome's ECG line: flat, a small bump (P), a dip, a tall spike (R), a deep dip (S), a bump (T), flat.
// x and y both run from 0 to 1 (y grows downwards).
export const ECG_X = [0, 0.3, 0.34, 0.38, 0.43, 0.47, 0.5, 0.53, 0.58, 0.65, 0.7, 0.75, 1];
export const ECG_Y = [0.5, 0.5, 0.4, 0.5, 0.5, 0.58, 0.02, 0.98, 0.5, 0.5, 0.34, 0.5, 0.5];

export interface Seg { cx: number; cy: number; length: number; angle: number }

/** The line as thin rotated rectangles (the centre, the length and the angle in radians of each), for a box of this size. */
export function ecgSegments(width: number, height: number): Seg[] {
  return ECG_X.slice(1).map((x1, i) => {
    const x0 = ECG_X[i] * width, y0 = ECG_Y[i] * height, x = x1 * width, y = ECG_Y[i + 1] * height;
    return { cx: (x0 + x) / 2, cy: (y0 + y) / 2, length: Math.hypot(x - x0, y - y0), angle: Math.atan2(y - y0, x - x0) };
  });
}
