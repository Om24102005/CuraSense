/* ═══════════════════════════════════════════════════════
   CuraSense — GOD-LEVEL Holographic Card
   3D tilt + prismatic foil + animated border + glow trail
   ═══════════════════════════════════════════════════════ */

import { useRef, useCallback, ReactNode, useEffect } from 'react';
import gsap from 'gsap';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
  borderAnimate?: boolean;
}

export default function HolographicCard({
  children,
  className = '',
  style = {},
  intensity = 14,
  borderAnimate = true,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const foilRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    const foil = foilRef.current;
    const glow = glowRef.current;
    if (!card || !foil || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotY = (x - 0.5) * intensity;
    const rotX = -(y - 0.5) * intensity;

    gsap.to(card, {
      rotationY: rotY,
      rotationX: rotX,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    // Prismatic holographic foil — rainbow gradient that follows cursor
    const hue = x * 360;
    const sat = 80 + y * 40;
    foil.style.backgroundImage = `
      radial-gradient(circle at ${x * 100}% ${y * 100}%,
        hsla(${hue}, ${sat}%, 70%, 0.45) 0%,
        hsla(${hue + 60}, ${sat}%, 65%, 0.30) 18%,
        hsla(${hue + 120}, ${sat}%, 65%, 0.22) 35%,
        hsla(${hue + 180}, ${sat}%, 65%, 0.16) 55%,
        hsla(${hue + 240}, ${sat}%, 65%, 0.10) 75%,
        transparent 100%)
    `;

    // Glow follows mouse position
    glow.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, var(--glow-violet, rgba(168,85,247,0.35)), transparent 60%)`;
    gsap.to([foil, glow], { opacity: 1, duration: 0.3 });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const foil = foilRef.current;
    const glow = glowRef.current;
    if (!card || !foil || !glow) return;

    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      duration: 1.1,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
    gsap.to([foil, glow], { opacity: 0, duration: 0.6 });
  }, []);

  // Animated rotating gradient border
  useEffect(() => {
    if (!borderAnimate || !borderRef.current) return;
    const tween = gsap.to(borderRef.current, {
      backgroundPosition: '400% 0%',
      duration: 6,
      ease: 'none',
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [borderAnimate]);

  return (
    <div
      ref={cardRef}
      className={`holographic-card relative ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated gradient border (1px ring) */}
      {borderAnimate && (
        <div
          ref={borderRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            padding: '1px',
            background: 'linear-gradient(90deg, #22d3ee, #a855f7, #ec4899, #22d3ee)',
            backgroundSize: '400% 100%',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            opacity: 0.45,
            zIndex: 5,
          }}
        />
      )}

      {/* Glow follows mouse */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ opacity: 0, mixBlendMode: 'screen', zIndex: 1 }}
      />

      {/* Holographic foil */}
      <div
        ref={foilRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ opacity: 0, mixBlendMode: 'overlay', zIndex: 6 }}
      />

      {/* Diagonal shimmer lines (always on, very subtle) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-30"
        style={{
          background: 'repeating-linear-gradient(115deg, transparent 0%, transparent 8%, rgba(255,255,255,0.03) 9%, transparent 10%, transparent 18%)',
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, transform: 'translateZ(40px)' }}>
        {children}
      </div>
    </div>
  );
}
