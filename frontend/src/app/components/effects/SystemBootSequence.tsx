/* ═══════════════════════════════════════════════════════
   System-firing-up overlay — short bridge between the
   CuraSense landing intro and the authenticated dashboard.
   ~1.5s total: scan-line, status text, progress bar.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SystemBootSequenceProps {
  onComplete?: () => void;
}

const STATUS_LINES = [
  'Booting diagnostic core',
  'Linking neural mesh',
  'Calibrating sensors',
  'Ready',
];

export default function SystemBootSequence({ onComplete }: SystemBootSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => { setVisible(false); onComplete?.(); },
        });
      },
    });

    tl.fromTo(rootRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );

    tl.fromTo(barRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.0, ease: 'power2.inOut' },
      0
    );

    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(el,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.18, ease: 'power2.out' },
        0.15 + i * 0.22
      );
    });

    // Hold on the final "Ready" line briefly, then fade.
    tl.to({}, { duration: 0.15 });

    return () => { tl.kill(); };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{
        opacity: 0,
        background: 'radial-gradient(ellipse at center, #050018 0%, #000005 75%, #000000 100%)',
      }}
    >
      {/* Subtle scan-line texture */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(34,211,238,0.08) 0, rgba(34,211,238,0.08) 1px, transparent 1px, transparent 3px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6" style={{ width: 'min(92vw, 460px)' }}>
        <div
          style={{
            fontFamily: "'Michroma', sans-serif",
            fontSize: 'clamp(0.65rem, 1.1vw, 0.78rem)',
            fontWeight: 700,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'rgba(34, 211, 238, 0.85)',
            marginBottom: '1.4rem',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22d3ee' }} />
          System firing up
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#a855f7', animationDelay: '0.3s' }} />
        </div>

        {/* Status lines */}
        <div className="w-full mb-5" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {STATUS_LINES.map((line, i) => (
            <div
              key={line}
              ref={(el) => { lineRefs.current[i] = el; }}
              style={{
                opacity: 0,
                fontFamily: "'Michroma', sans-serif",
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: i === STATUS_LINES.length - 1 ? '#4ade80' : 'rgba(255,255,255,0.55)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{ color: i === STATUS_LINES.length - 1 ? '#4ade80' : '#22d3ee', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                {i === STATUS_LINES.length - 1 ? '✓' : '›'}
              </span>
              {line}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="relative w-full h-[2px] overflow-hidden rounded-full"
          style={{ background: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div
            ref={barRef}
            className="h-full origin-left rounded-full"
            style={{
              transform: 'scaleX(0)',
              background: 'linear-gradient(90deg, #22d3ee, #a855f7, #ec4899)',
              boxShadow: '0 0 10px rgba(34,211,238,0.7), 0 0 20px rgba(168,85,247,0.4)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
