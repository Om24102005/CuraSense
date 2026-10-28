/* ═══════════════════════════════════════════════════════
   CuraSense — Post-Login Transition
   ───────────────────────────────────────────────────────
   Shown once, right after auth succeeds, before the dashboard appears.
   Previously a 90,000-particle Three.js DNA-helix/galaxy sequence with a
   custom shader pipeline — replaced entirely per the Apple Liquid Glass
   direction: restrained motion, one glass panel, transform + opacity
   only. Still lazy-loaded from App.tsx (now a much smaller chunk).
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { Activity } from 'lucide-react';
import { gsap } from '../../animations';
import { useTheme } from '../../App';
import AppleSpinner from '../shared/AppleSpinner';

interface CinematicSequenceProps {
  onComplete?: () => void;
}

export default function CinematicSequence({ onComplete }: CinematicSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => { setVisible(false); onComplete?.(); },
        });
      },
    });

    tl.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    tl.fromTo(iconRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 0.15);
    tl.fromTo(titleRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 }, 0.4);
    tl.fromTo(subtitleRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, 0.55);
    tl.fromTo(spinnerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7);
    tl.to({}, { duration: 0.9 }); // hold

    return () => { tl.kill(); };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ opacity: 0, background: isDark ? '#000000' : '#f5f5f7' }}
    >
      <div
        ref={iconRef}
        style={{
          opacity: 0,
          width: 84, height: 84, borderRadius: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.75rem',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
          boxShadow: '0 16px 40px color-mix(in srgb, var(--accent-cyan) 30%, transparent)',
        }}
      >
        <Activity style={{ width: 42, height: 42, color: '#fff' }} strokeWidth={2} />
      </div>

      <div
        ref={titleRef}
        style={{
          opacity: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, var(--font-display)",
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}
      >
        Welcome back
      </div>

      <p
        ref={subtitleRef}
        style={{
          opacity: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, var(--font-body)",
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          marginBottom: '2.25rem',
        }}
      >
        Preparing your health dashboard
      </p>

      <div ref={spinnerRef} style={{ opacity: 0 }}>
        <AppleSpinner size={26} color="var(--text-muted)" />
      </div>
    </div>
  );
}
