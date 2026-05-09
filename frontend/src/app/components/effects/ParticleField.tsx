/* ═══════════════════════════════════════════════════════════════════
   CuraSense — Edge Constellation Field
   Static, low-opacity SVG constellation pinned to the left + right
   edges of the viewport. Nodes don't drift — but they react to the
   cursor: dots and lines within a proximity radius brighten and
   bloom toward the pointer.

   The center of the screen is intentionally empty here — that's
   where the helix / morphing organs live (with their own internal
   wireframe in ThreeBackground). This component is decoration on
   the periphery only.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef } from 'react';

interface ParticleFieldProps {
  /** Approx node count per edge. Total = count * 2. Capped for sanity. */
  count?: number;
}

interface Node {
  x: number; // px from left of viewport
  y: number; // px from top of viewport
}
interface Edge { a: number; b: number; len: number; }

/* Generate a constellation pinned to one edge of the viewport.
   x is offset from edge inward; y is sprinkled top-to-bottom with
   slight horizontal jitter so the layout reads as a "spine" rather
   than a column. */
function generateNodes(side: 'left' | 'right', n: number, vw: number, vh: number): Node[] {
  const stripWidth = Math.min(180, vw * 0.16);
  const nodes: Node[] = [];
  // Distribute roughly along Y with low-discrepancy stagger
  for (let i = 0; i < n; i++) {
    const yJitter = (Math.random() - 0.5) * (vh / n) * 1.4;
    const y = (i + 0.5) * (vh / n) + yJitter;
    // X: bias inward but with curve so it isn't a straight column
    const t = i / (n - 1);
    const curve = Math.sin(t * Math.PI * 2.4) * 0.5 + 0.5;
    const xOffset = 18 + curve * (stripWidth - 22) + (Math.random() - 0.5) * 22;
    const x = side === 'left' ? xOffset : vw - xOffset;
    nodes.push({ x, y });
  }
  return nodes;
}

/* Connect each node to its k=2 nearest neighbors (in pixel space).
   Pre-computed once at mount; lines never get recomputed. */
function generateEdges(nodes: Node[], k = 2, maxLen = 200): Edge[] {
  const edges: Edge[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    // gather distances to others
    const cands: Array<{ j: number; d: number }> = [];
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      if (d <= maxLen) cands.push({ j, d });
    }
    cands.sort((a, b) => a.d - b.d);
    for (let p = 0; p < Math.min(k, cands.length); p++) {
      const j = cands[p].j;
      const lo = Math.min(i, j), hi = Math.max(i, j);
      const key = `${lo}-${hi}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a: lo, b: hi, len: cands[p].d });
    }
  }
  return edges;
}

const CURSOR_RADIUS = 220;       // px — proximity reach for highlighting
const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS;

function EdgeStrip({ side, n }: { side: 'left' | 'right'; n: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const sizeRef = useRef({ w: 0, h: 0 });

  /* Generate the layout once. Stays static across cursor moves +
     re-renders. Recomputes only on viewport size change. */
  const layout = useMemo(() => {
    if (typeof window === 'undefined') return { nodes: [] as Node[], edges: [] as Edge[] };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    sizeRef.current = { w: vw, h: vh };
    const nodes = generateNodes(side, n, vw, vh);
    const edges = generateEdges(nodes);
    return { nodes, edges };
  }, [side, n]);

  /* Cursor tracking + per-frame opacity update */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onLeave = () => { mouseRef.current.active = false; };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave);
    document.addEventListener('mouseleave', onLeave);

    let raf = 0;
    const tick = () => {
      const { x: mx, y: my, active } = mouseRef.current;
      const nodes = layout.nodes;
      const edges = layout.edges;

      // Update dots
      for (let i = 0; i < nodes.length; i++) {
        const el = dotRefs.current[i];
        if (!el) continue;
        const dx = nodes[i].x - mx;
        const dy = nodes[i].y - my;
        const d2 = dx * dx + dy * dy;
        const prox = active ? Math.max(0, 1 - d2 / CURSOR_RADIUS_SQ) : 0;
        // Base 22% → 95% with proximity
        const op = 0.22 + prox * 0.73;
        const r = 1.4 + prox * 1.6;
        el.setAttribute('opacity', op.toFixed(3));
        el.setAttribute('r', r.toFixed(2));
      }

      // Update lines — proximity uses the midpoint of each segment
      for (let i = 0; i < edges.length; i++) {
        const el = lineRefs.current[i];
        if (!el) continue;
        const a = nodes[edges[i].a];
        const b = nodes[edges[i].b];
        const cx = (a.x + b.x) * 0.5;
        const cy = (a.y + b.y) * 0.5;
        const dx = cx - mx;
        const dy = cy - my;
        const d2 = dx * dx + dy * dy;
        const prox = active ? Math.max(0, 1 - d2 / CURSOR_RADIUS_SQ) : 0;
        // Base 8% → 55% with proximity. Intentionally low so the
        // edges read as ambient, not the focal point.
        const op = 0.08 + prox * 0.47;
        const sw = 0.6 + prox * 0.9;
        el.setAttribute('opacity', op.toFixed(3));
        el.setAttribute('stroke-width', sw.toFixed(2));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [layout]);

  /* Resize → regenerate layout. Cheap; runs only on actual resize. */
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      sizeRef.current = { w: vw, h: vh };
      // Force a fresh memo by toggling key — simplest: replace SVG via parent.
      // Here we just translate existing nodes proportionally so it stays cheap.
      const sx = vw / sizeRef.current.w;
      const sy = vh / sizeRef.current.h;
      layout.nodes.forEach((nd: Node, i: number) => {
        nd.x *= sx;
        nd.y *= sy;
        const el = dotRefs.current[i];
        if (el) {
          el.setAttribute('cx', nd.x.toFixed(1));
          el.setAttribute('cy', nd.y.toFixed(1));
        }
      });
      layout.edges.forEach((eg: Edge, i: number) => {
        const el = lineRefs.current[i];
        if (!el) return;
        el.setAttribute('x1', layout.nodes[eg.a].x.toFixed(1));
        el.setAttribute('y1', layout.nodes[eg.a].y.toFixed(1));
        el.setAttribute('x2', layout.nodes[eg.b].x.toFixed(1));
        el.setAttribute('y2', layout.nodes[eg.b].y.toFixed(1));
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [layout]);

  // Side-specific accent color
  const accent = side === 'left' ? '#22d3ee' : '#a855f7';

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 z-0 pointer-events-none"
      width="100vw"
      height="100vh"
      style={{ width: '100vw', height: '100vh' }}
    >
      <defs>
        <radialGradient id={`pf-glow-${side}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={accent} stopOpacity="0.85" />
          <stop offset="60%"  stopColor={accent} stopOpacity="0.30" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <filter id={`pf-blur-${side}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      {/* Edges first so dots render on top */}
      <g>
        {layout.edges.map((e: Edge, i: number) => {
          const a = layout.nodes[e.a];
          const b = layout.nodes[e.b];
          return (
            <line
              key={`e-${side}-${i}`}
              ref={(el: SVGLineElement | null) => { lineRefs.current[i] = el; }}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={accent}
              strokeWidth={0.6}
              opacity={0.08}
            />
          );
        })}
      </g>
      <g>
        {layout.nodes.map((nd: Node, i: number) => (
          <circle
            key={`n-${side}-${i}`}
            ref={(el: SVGCircleElement | null) => { dotRefs.current[i] = el; }}
            cx={nd.x} cy={nd.y} r={1.4}
            fill={accent}
            opacity={0.22}
            filter={`url(#pf-blur-${side})`}
          />
        ))}
      </g>
    </svg>
  );
}

export default function ParticleField({ count = 26 }: ParticleFieldProps) {
  // Cap node count per side. Lines are O(n*k) so this stays cheap.
  const safe = Math.max(0, Math.min(count, 50));
  if (safe === 0) return null;
  return (
    <>
      <EdgeStrip side="left"  n={safe} />
      <EdgeStrip side="right" n={safe} />
    </>
  );
}
