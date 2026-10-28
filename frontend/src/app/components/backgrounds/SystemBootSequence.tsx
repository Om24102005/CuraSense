/* ═══════════════════════════════════════════════════════
   CuraSense — Boot Screen
   ───────────────────────────────────────────────────────
   First thing shown on a cold load, before WelcomeScreen. Apple Liquid
   Glass language: one glass panel, the app mark, a system-style
   spinner, done in well under 2s. No particle field, no scan-line HUD —
   that read as a sci-fi terminal, not a medical product. transform +
   opacity only.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { Activity } from 'lucide-react';
import { gsap } from '../../animations';
import { useTheme } from '../../App';
import AppleSpinner from '../shared/AppleSpinner';

interface SystemBootSequenceProps {
  onComplete?: () => void;
}

export default function SystemBootSequence({ onComplete }: SystemBootSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => { setVisible(false); onComplete?.(); },
        });
      },
    });

    tl.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    tl.fromTo(panelRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.4)' },
      0.1
    );
    tl.to({}, { duration: 0.7 }); // hold

    return () => { tl.kill(); };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{ opacity: 0, background: isDark ? '#000000' : '#f5f5f7' }}
    >
      <div
        ref={panelRef}
        className="glass-strong flex flex-col items-center"
        style={{
          opacity: 0,
          padding: '2.5rem 3rem',
          borderRadius: '28px',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
            boxShadow: '0 8px 24px color-mix(in srgb, var(--accent-cyan) 35%, transparent)',
          }}
        >
          <Activity style={{ width: 28, height: 28, color: '#fff' }} strokeWidth={2.25} />
        </div>
        <div
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, var(--font-display)",
            fontSize: '1.05rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
          }}
        >
          CuraSense
        </div>
        <AppleSpinner size={24} color="var(--text-muted)" />
      </div>
    </div>
  );
}
