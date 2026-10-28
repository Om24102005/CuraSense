/* ═══════════════════════════════════════════════════════
   CuraSense — Analysis Loading Screen
   ───────────────────────────────────────────────────────
   Shown while a symptom/image/report analysis request is in flight.
   Previously a Three.js scene (icosahedron, fresnel sphere, 1600
   particles, HUD data panels with randomized number tickers, scan-line
   sweep) — replaced per the Apple Liquid Glass direction. Same prop
   API (`message`) so every call site (SymptomChecker, ImageAnalysis,
   ReportAnalysis) needed zero changes.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '../../animations';
import { useTheme } from '../../App';
import AppleSpinner from './AppleSpinner';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'ANALYZING SYMPTOMS...' }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(panelRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)', delay: 0.05 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ opacity: 0, background: isDark ? 'rgba(0,0,0,0.78)' : 'rgba(245,245,247,0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div
        ref={panelRef}
        className="glass-strong flex flex-col items-center"
        style={{ opacity: 0, padding: '2.25rem 2.75rem', borderRadius: '24px', gap: '1.1rem', minWidth: '240px' }}
      >
        <AppleSpinner size={30} color="var(--accent-cyan)" />
        <span
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, var(--font-body)",
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          {message}
        </span>
      </div>
    </div>,
    document.body
  );
}
