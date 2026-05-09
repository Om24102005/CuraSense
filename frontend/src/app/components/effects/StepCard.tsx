/* ═══════════════════════════════════════════════════════
   CuraSense — GOD-LEVEL Step Card (01 / 02 / 03 / 04)
   3D pipeline node: rotating ring, animated number,
   particle emission on hover, scroll-driven progress line.
   ═══════════════════════════════════════════════════════ */

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StepCardProps {
  step: string;
  title: string;
  desc: string;
  icon?: any;
  index: number;
  total: number;
  isDark: boolean;
}

export default function StepCard({ step, title, desc, icon: IconCmp, index, total, isDark }: StepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const accentA = isDark ? '#22d3ee' : '#0284c7';
  const accentB = isDark ? '#a855f7' : '#6d28d9';
  const accentC = isDark ? '#ec4899' : '#be185d';
  const cardBg = isDark ? 'rgba(10, 10, 24, 0.55)' : 'rgba(255, 255, 255, 0.7)';
  const cardBdr = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const titleClr = isDark ? '#ffffff' : '#0a0a1a';
  const textClr = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(10, 10, 26, 0.65)';
  const stepLabelClr = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(10, 10, 26, 0.4)';

  const S = "'Michroma', sans-serif";

  /* ── Scroll-triggered entrance ── */
  useEffect(() => {
    if (!cardRef.current || !numberRef.current || !ringRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      tl.fromTo(cardRef.current,
        { y: 100, opacity: 0, rotationX: 25, scale: 0.9, filter: 'blur(20px)' },
        { y: 0, opacity: 1, rotationX: 0, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', delay: index * 0.12 }
      );

      tl.fromTo(ringRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.6)' },
        '-=0.9'
      );

      // Animated number counter
      const target = parseInt(step, 10);
      const obj = { v: 0 };
      tl.to(obj, {
        v: target,
        duration: 1.2,
        ease: 'expo.out',
        onUpdate: () => {
          if (numberRef.current) numberRef.current.textContent = String(Math.floor(obj.v)).padStart(2, '0');
        },
      }, '-=0.8');

      // Connector beam grows
      if (beamRef.current && index < total - 1) {
        gsap.fromTo(beamRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: cardRef.current, start: 'top 70%', once: true },
            delay: 0.4,
          }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, [step, index, total]);

  /* ── Continuous ambient ring rotation ── */
  useEffect(() => {
    if (!ringRef.current) return;
    const tween = gsap.to(ringRef.current, {
      rotation: '+=360',
      duration: 30,
      ease: 'none',
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, []);

  /* ── Hover effects ── */
  const handleEnter = () => {
    setHovered(true);
    if (cardRef.current) {
      gsap.to(cardRef.current, { y: -8, duration: 0.5, ease: 'power3.out' });
    }
    if (innerRef.current) {
      gsap.to(innerRef.current, { scale: 1.1, duration: 0.5, ease: 'power3.out' });
    }
  };
  const handleLeave = () => {
    setHovered(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, { y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    }
    if (innerRef.current) {
      gsap.to(innerRef.current, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    }
  };

  return (
    <div
      ref={cardRef}
      className="step-card relative flex flex-col items-center text-center"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── Connector beam to next step ── */}
      {index < total - 1 && (
        <div
          ref={beamRef}
          className="absolute hidden lg:block pointer-events-none"
          style={{
            top: '60px',
            left: '60%',
            width: '90%',
            height: '2px',
            background: `linear-gradient(90deg, ${accentA}, ${accentB}, transparent)`,
            boxShadow: `0 0 12px ${accentA}, 0 0 24px ${accentB}`,
            zIndex: 0,
            transform: 'scaleX(0)',
          }}
        >
          {/* Traveling pulse along the beam */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: `radial-gradient(circle, ${accentA}, transparent)`,
              boxShadow: `0 0 16px ${accentA}, 0 0 32px ${accentB}`,
              animation: 'beam-pulse 2.5s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* ── 3D Number Disc ── */}
      <div className="relative" style={{ width: 130, height: 130, marginBottom: '2rem' }}>
        {/* Outer rotating ring */}
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${accentA}, ${accentB}, ${accentC}, ${accentA})`,
            padding: '2px',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            filter: `drop-shadow(0 0 12px ${accentA}66)`,
          }}
        />

        {/* Secondary inner ring (counter rotating) */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 10,
            border: `1px dashed ${accentB}66`,
            animation: 'reverse-spin 18s linear infinite',
          }}
        />

        {/* Glow pulse */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -8,
            background: `radial-gradient(circle, ${accentA}33, transparent 70%)`,
            filter: 'blur(8px)',
            opacity: hovered ? 1 : 0.4,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Inner disc (numeric core) */}
        <div
          ref={innerRef}
          className="absolute rounded-full flex flex-col items-center justify-center backdrop-blur-2xl"
          style={{
            inset: 18,
            background: `radial-gradient(circle at 30% 30%, ${cardBg}, ${isDark ? '#000005' : '#f5f5ff'} 90%)`,
            border: `1px solid ${cardBdr}`,
            boxShadow: hovered
              ? `inset 0 0 20px ${accentA}33, 0 0 40px ${accentB}44, 0 12px 36px rgba(0,0,0,0.5)`
              : `inset 0 0 14px ${accentA}22, 0 8px 24px rgba(0,0,0,0.3)`,
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {IconCmp && (
            <IconCmp
              className="w-5 h-5 mb-1"
              style={{ color: accentA, opacity: 0.7, transition: 'transform 0.4s', transform: hovered ? 'translateY(-2px)' : 'none' }}
            />
          )}
          <div
            ref={numberRef}
            style={{
              fontFamily: S,
              fontSize: '2.4rem',
              fontWeight: 900,
              lineHeight: 1,
              background: `linear-gradient(135deg, ${accentA}, ${accentB})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `drop-shadow(0 0 8px ${accentA}88)`,
            }}
          >
            00
          </div>
        </div>

        {/* Orbiting dots */}
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: i === 0 ? accentA : i === 1 ? accentB : accentC,
              boxShadow: `0 0 8px ${i === 0 ? accentA : i === 1 ? accentB : accentC}`,
              animation: `orbit-${i} ${10 + i * 3}s linear infinite`,
              transformOrigin: '0 0',
            }}
          />
        ))}
      </div>

      {/* ── Step micro-label ── */}
      <div
        style={{
          fontFamily: S,
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: stepLabelClr,
          marginBottom: '0.5rem',
        }}
      >
        STEP {step} ·  PHASE
      </div>

      {/* ── Title ── */}
      <h4
        style={{
          fontFamily: S,
          fontSize: '1.3rem',
          fontWeight: 900,
          color: titleClr,
          marginBottom: '1rem',
          letterSpacing: '0.05em',
          lineHeight: 1.2,
          maxWidth: '280px',
        }}
      >
        {title}
      </h4>

      {/* ── Desc ── */}
      <p style={{ fontSize: '0.95rem', color: textClr, lineHeight: 1.7, maxWidth: '280px', fontFamily: "'Inter', sans-serif" }}>
        {desc}
      </p>

      {/* ── Bottom accent bar that fills on hover ── */}
      <div
        className="mt-6 h-[2px] rounded-full overflow-hidden"
        style={{ width: '60px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accentA}, ${accentB})`,
            width: hovered ? '100%' : '30%',
            transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `0 0 6px ${accentA}`,
          }}
        />
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes beam-pulse {
          0%   { left: 0%; opacity: 0; }
          50%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes orbit-0 {
          from { transform: rotate(0deg) translate(70px) rotate(0deg); }
          to   { transform: rotate(360deg) translate(70px) rotate(-360deg); }
        }
        @keyframes orbit-1 {
          from { transform: rotate(120deg) translate(75px) rotate(0deg); }
          to   { transform: rotate(480deg) translate(75px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          from { transform: rotate(240deg) translate(80px) rotate(0deg); }
          to   { transform: rotate(600deg) translate(80px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
