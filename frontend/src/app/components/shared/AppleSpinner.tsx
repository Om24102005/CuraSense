import { useReducedMotion } from '../../animations';

/* ═══════════════════════════════════════════════════════
   CuraSense — Apple-style activity spinner
   ───────────────────────────────────────────────────────
   The classic macOS/iOS system spinner: a ring of ticks that each fade
   in sequence. CSS-only (animation-delay stagger), transform+opacity
   only, no library. Shared by all three loading screens so they read
   as one consistent system instead of three different effects.
   ═══════════════════════════════════════════════════════ */

const TICKS = 12;

interface AppleSpinnerProps {
  size?: number;
  color?: string;
}

export default function AppleSpinner({ size = 32, color = 'currentColor' }: AppleSpinnerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      style={{ position: 'relative', width: size, height: size }}
    >
      {Array.from({ length: TICKS }).map((_, i) => {
        const rotation = (360 / TICKS) * i;
        const delay = (i / TICKS) * 1.2 - 1.2;
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: size * 0.09,
              height: size * 0.28,
              marginLeft: -(size * 0.045),
              marginTop: -(size * 0.5),
              borderRadius: size * 0.05,
              background: color,
              transformOrigin: `${size * 0.045}px ${size * 0.5}px`,
              transform: `rotate(${rotation}deg)`,
              opacity: reducedMotion ? 0.5 : 0.15,
              animation: reducedMotion ? 'none' : 'apple-spinner-tick 1.2s linear infinite',
              animationDelay: reducedMotion ? undefined : `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
