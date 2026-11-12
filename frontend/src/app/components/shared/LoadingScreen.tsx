/* ═══════════════════════════════════════════════════════
   CuraSense — Analysis Loading Screen
   ───────────────────────────────────────────────────────
   Shown while a symptom/image/report analysis request is in flight.
   Previously a Three.js scene (icosahedron, fresnel sphere, 1600
   particles, HUD data panels with randomized number tickers, scan-line
   sweep) — replaced per the Apple Liquid Glass direction. Same `message`
   prop, plus a `variant` that picks the palette of the scene below.

   Quick answers see only the compact panel (a spinner and the message).
   After a short wait the panel gives way to LoadingStage, a full-screen
   page where the plasma orb glides across the user's own data (the
   scan, the report text, the symptoms) and lights it up like a lens,
   with the elapsed time, for the 20-60 s that large scans and reports
   can take. Reduced motion and browsers without WebGL 2 keep the panel
   for the whole wait.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { gsap, useReducedMotion } from '../../animations';
import { useTheme } from '../../App';
import { themes } from '../../themes';
import AppleSpinner from './AppleSpinner';

export type LoadingVariant = 'symptoms' | 'scans' | 'reports';

/** The user's own data, which the lens page shows being read. Everything is optional; the page has a stand-in for each tab. */
export interface LoadingSubject {
  /** Object URLs of pictures the browser can show (not HEIC or TIFF). */
  images?: string[];
  /** Lines of text, such as a pasted report. */
  lines?: string[];
  /** The user's own words, such as symptom names. */
  words?: string[];
}

// The scene starts this long after the screen appears (the panel's entrance takes about 0.45 s), so a quick answer,
// such as a refused file, never pays for loading the page and starting its orb.
const STAGE_AFTER_MS = 450;

interface LoadingScreenProps {
  message?: string;
  variant?: LoadingVariant;
  subject?: LoadingSubject;
}

export function LoadingScreen({ message = 'ANALYZING SYMPTOMS...', variant = 'symptoms', subject = {} }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const since = useRef(Date.now());
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // This screen is portalled to <body>, outside the themed wrapper in App, and the page only sets the paint-critical
  // variables on <html> until the theme is toggled once. Without this the spinner's var(--accent-cyan) is undefined and its ticks are transparent.
  const accentVar = { '--accent-cyan': themes[theme].vars['--accent-cyan'] } as CSSProperties;
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  // shortcut: only the WebGL 2 API is checked here, so a browser that has it but no usable GPU shows the stage's dark
  // backdrop with the caption and clock but none of the pieces; add a real capability probe if that proves ugly.
  const canStage = !reducedMotion && typeof WebGL2RenderingContext !== 'undefined';
  const [Stage, setStage] = useState<typeof import('./LoadingStage').LoadingStage | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!canStage) return;
    let live = true;
    const t = window.setTimeout(() => {
      // A failed download (offline, a stale chunk after a deploy) just leaves the panel on screen.
      import('./LoadingStage').then((m) => { if (live) setStage(() => m.LoadingStage); }).catch(() => {});
    }, STAGE_AFTER_MS);
    return () => { live = false; window.clearTimeout(t); };
  }, [canStage]);

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
      // The lens page is opaque, so the page behind it is neither seen nor blurred (the blur costs GPU every frame).
      style={{ ...accentVar, opacity: 0, background: Stage ? '#03050b' : isDark ? 'rgba(0,0,0,0.78)' : 'rgba(245,245,247,0.85)', backdropFilter: Stage ? 'none' : 'blur(8px)', WebkitBackdropFilter: Stage ? 'none' : 'blur(8px)', transition: 'background 0.6s ease' }}
    >
      {/* the compact panel fades out when the stage takes over (its own element, because GSAP owns the panel's opacity) */}
      <div style={{ opacity: Stage ? 0 : 1, transition: 'opacity 0.5s ease' }} aria-hidden={Stage ? true : undefined}>
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
      </div>
      {Stage && <Stage message={message} variant={variant} subject={subject} since={since.current} />}
    </div>,
    document.body
  );
}
