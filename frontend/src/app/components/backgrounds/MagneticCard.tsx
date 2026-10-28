/* ═══════════════════════════════════════════════════════
   CuraSense — Magnetic 3D Tilt Card HOC
   Every card tilts on hover with elastic reset
   ═══════════════════════════════════════════════════════ */

import { useRef, useCallback, ReactNode } from 'react';
import gsap from 'gsap';

interface MagneticCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
  perspective?: number;
  onClick?: () => void;
}

export function MagneticCard({
  children,
  className = '',
  style = {},
  intensity = 8,
  perspective = 800,
  onClick,
}: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotationY: x * intensity,
      rotationX: -y * intensity,
      transformPerspective: perspective,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    // Glow follow
    const glowX = (e.clientX - rect.left) / rect.width * 100;
    const glowY = (e.clientY - rect.top) / rect.height * 100;
    cardRef.current.style.setProperty('--glow-x', `${glowX}%`);
    cardRef.current.style.setProperty('--glow-y', `${glowY}%`);
  }, [intensity, perspective]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`magnetic-card ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Dynamic glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), var(--glow-violet, rgba(139,92,246,0.15)), transparent 70%)`,
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
}
