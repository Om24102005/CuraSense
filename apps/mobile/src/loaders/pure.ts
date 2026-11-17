// The loaders' pure helpers: no React Native import, so a Node test can load them.

/** A point on a figure eight as fractions of its half-width (x) and half-height (y), for t from 0 to 1. */
export const eight = (t: number): [number, number] => {
  const a = 2 * Math.PI * t;
  const s = Math.sin(a);
  const d = 1 + s * s;
  return [Math.cos(a) / d, (2.83 * s * Math.cos(a)) / d];
};

/** The same colour at another opacity, so a gradient fades through the colour itself and not through transparent black. */
export function withAlpha(color: string, a: number): string {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split('').map((c) => c + c).join('') : hex[1];
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
  const rgb = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i.exec(color);
  return rgb ? `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${a})` : color;
}
