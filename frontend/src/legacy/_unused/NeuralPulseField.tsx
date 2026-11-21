import { useEffect, useRef } from 'react';
import { animate, stagger, gsap, ScrollTrigger, useDeviceTier, useReducedMotion, animeEasings } from '../../animations';

/* ═══════════════════════════════════════════════════════════════════
   CuraSense — Neural Pulse Field
   ───────────────────────────────────────────────────────────────────
   Replaces the old fluid-marble AuroraField with something that reads
   as "clinical AI diagnostics" instead of a decorative gradient: a
   sparse node network that breathes, themed off the app's own accent
   colors. anime.js drives every per-node animation (entrance stagger,
   ambient pulse loop, edge draw-in); GSAP's only job is one scroll-tied
   parallax drift — the split the project settled on (anime.js heavy,
   GSAP a small supporting role).
   ═══════════════════════════════════════════════════════════════════ */

interface NeuralPulseFieldProps {
  colors?: [string, string];
  className?: string;
}

const NODE_COUNT_BY_TIER = { high: 36, mid: 22, low: 12 } as const;
const CONNECT_DIST = 20; // in the 0–100 viewBox unit space
const MAX_EDGES = 70;

export default function NeuralPulseField({
  colors = ['#22d3ee', '#8b5cf6'],
  className = '',
}: NeuralPulseFieldProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();
  const key = colors.join(',') + '|' + tier + '|' + (reducedMotion ? 1 : 0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const count = NODE_COUNT_BY_TIER[tier];
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: 0.35 + Math.random() * 0.45,
    }));

    const edges: { a: (typeof nodes)[number]; b: (typeof nodes)[number] }[] = [];
    outer: for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < CONNECT_DIST) {
          edges.push({ a: nodes[i], b: nodes[j] });
          if (edges.length >= MAX_EDGES) break outer;
        }
      }
    }

    const NS = 'http://www.w3.org/2000/svg';
    const frag = document.createDocumentFragment();

    const edgeEls = edges.map(({ a, b }) => {
      const line = document.createElementNS(NS, 'line') as SVGLineElement;
      line.setAttribute('x1', String(a.x)); line.setAttribute('y1', String(a.y));
      line.setAttribute('x2', String(b.x)); line.setAttribute('y2', String(b.y));
      line.setAttribute('stroke', colors[0]);
      line.setAttribute('stroke-width', '0.08');
      line.setAttribute('data-edge', '');
      frag.appendChild(line);
      return line;
    });

    const nodeEls = nodes.map((n, i) => {
      const circle = document.createElementNS(NS, 'circle') as SVGCircleElement;
      circle.setAttribute('cx', String(n.x)); circle.setAttribute('cy', String(n.y));
      circle.setAttribute('r', String(n.r));
      circle.setAttribute('fill', i % 3 === 0 ? colors[1] : colors[0]);
      circle.setAttribute('filter', 'url(#npf-glow)');
      circle.setAttribute('data-node', '');
      // CSS-transform scale on SVG shapes defaults to origin (0,0) of the
      // viewBox, not the shape's own center — fill-box fixes that so each
      // node pulses from its own center instead of drifting toward a corner.
      circle.style.transformBox = 'fill-box';
      circle.style.transformOrigin = 'center';
      frag.appendChild(circle);
      return circle;
    });

    svg.appendChild(frag);

    let entrance: ReturnType<typeof animate> | undefined;
    let pulse: ReturnType<typeof animate> | undefined;
    let drawIn: ReturnType<typeof animate> | undefined;
    let parallaxTween: ReturnType<typeof gsap.fromTo> | undefined;
    let trigger: ReturnType<typeof ScrollTrigger.create> | undefined;

    if (reducedMotion) {
      nodeEls.forEach(c => c.setAttribute('opacity', '0.85'));
      edgeEls.forEach(l => l.setAttribute('opacity', '0.22'));
    } else {
      edgeEls.forEach(line => {
        const len = line.getTotalLength();
        line.setAttribute('stroke-dasharray', String(len));
        line.setAttribute('stroke-dashoffset', String(len));
      });
      nodeEls.forEach(c => c.setAttribute('opacity', '0'));

      // ── anime.js (heavy use): entrance, edge draw-in, ambient pulse loop ──
      entrance = animate(nodeEls, {
        opacity: [0, 0.9],
        scale: [0, 1],
        duration: 900,
        delay: stagger(25, { start: 150 }),
        ease: animeEasings.out,
      });

      drawIn = animate(edgeEls, {
        strokeDashoffset: 0,
        opacity: [0, 0.22],
        duration: 1100,
        delay: stagger(12, { start: 300 }),
        ease: animeEasings.smooth,
      });

      pulse = animate(nodeEls, {
        scale: [1, 1.5, 1],
        opacity: [0.55, 0.95, 0.55],
        duration: 3200,
        delay: stagger(90, { start: 1200 }),
        loop: true,
        ease: animeEasings.inOut,
      });

      // ── GSAP (small supporting role): one scroll-tied parallax drift ──
      parallaxTween = gsap.fromTo(svg, { yPercent: 0 }, { yPercent: 6, ease: 'none' });
      trigger = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        animation: parallaxTween,
      });
    }

    return () => {
      entrance?.pause(); pulse?.pause(); drawIn?.pause();
      trigger?.kill(); parallaxTween?.kill();
      svg.innerHTML = '';
    };
  }, [key, tier, reducedMotion]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className={`fixed inset-0 z-0 pointer-events-none w-full h-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="npf-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
