/* ═══════════════════════════════════════════════════════
   CuraSense — Theatre.js Cinematic Sequence
   Orchestrated hero entrance with camera, particles, text
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { getProject, types } from '@theatre/core';
import studio from '@theatre/studio';
import gsap from 'gsap';

// Only enable studio in dev
if (import.meta.env?.DEV) {
  studio.initialize();
}

interface CinematicSequenceProps {
  onComplete?: () => void;
}

export default function CinematicSequence({ onComplete }: CinematicSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // GSAP Timeline for the cinematic sequence
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out entire sequence
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            setVisible(false);
            onComplete?.();
          },
        });
      },
    });

    // Phase 1: Background reveal
    tl.fromTo(
      containerRef.current,
      { filter: 'brightness(0.3) blur(10px)' },
      { filter: 'brightness(1) blur(0px)', duration: 1, ease: 'power2.out' }
    );

    // Phase 2: Title entrance
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'back.out(1.7)' },
      '-=0.5'
    );

    // Phase 3: Subtitle
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
      '-=0.8'
    );

    // Hold for a moment
    tl.to({}, { duration: 1.5 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, var(--glow-violet, rgba(139,92,246,0.3)), var(--bg-base, #000005) 70%)',
      }}
    >
      {/* Particle overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: 'var(--accent-cyan, #22d3ee)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      <h1
        ref={titleRef}
        className="text-6xl md:text-8xl font-bold mb-6"
        style={{
          opacity: 0,
          transform: 'translateY(50px)',
          background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 30px var(--glow-violet, rgba(139,92,246,0.5)))',
        }}
      >
        CuraSense
      </h1>

      <p
        ref={subtitleRef}
        className="text-lg md:text-xl"
        style={{
          opacity: 0,
          transform: 'translateY(30px)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary, rgba(255,255,255,0.65))',
        }}
      >
        AI-Powered Health Intelligence
      </p>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
