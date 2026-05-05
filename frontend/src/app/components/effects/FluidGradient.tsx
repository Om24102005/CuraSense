/* ═══════════════════════════════════════════════════════
   CuraSense — Fluid Gradient Background (PeachWeb-style)
   Reactive liquid gradient that follows cursor
   ═══════════════════════════════════════════════════════ */

import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

interface FluidGradientProps {
  colors?: string[];
  className?: string;
  speed?: number;
  interactive?: boolean;
}

export default function FluidGradient({
  colors = ['#22d3ee', '#8b5cf6', '#ec4899', '#10b981'],
  className = '',
  speed = 0.02,
  interactive = true,
}: FluidGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / w;
      mouseRef.current.y = e.clientY / h;
    };
    if (interactive) {
      window.addEventListener('mousemove', handleMouse);
    }

    const draw = () => {
      timeRef.current += speed;
      ctx.clearRect(0, 0, w, h);

      const gradient = ctx.createRadialGradient(
        w * mouseRef.current.x,
        h * mouseRef.current.y,
        0,
        w * mouseRef.current.x,
        h * mouseRef.current.y,
        w * 0.8,
      );

      const t = timeRef.current;
      const offsetColors = colors.map((c, i) => {
        const phase = (i / colors.length) * Math.PI * 2;
        const alpha = 0.3 + 0.2 * Math.sin(t + phase);
        return c + Math.round(alpha * 255).toString(16).padStart(2, '0');
      });

      gradient.addColorStop(0, offsetColors[0]);
      gradient.addColorStop(0.25, offsetColors[1]);
      gradient.addColorStop(0.5, offsetColors[2]);
      gradient.addColorStop(0.75, offsetColors[3]);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Second layer for depth
      const gradient2 = ctx.createRadialGradient(
        w * (1 - mouseRef.current.x),
        h * (1 - mouseRef.current.y),
        0,
        w * (1 - mouseRef.current.x),
        h * (1 - mouseRef.current.y),
        w * 0.6,
      );
      gradient2.addColorStop(0, offsetColors[2]);
      gradient2.addColorStop(0.5, offsetColors[0]);
      gradient2.addColorStop(1, 'transparent');

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [colors, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none ${className}`}
      style={{ opacity: 0.5 }}
    />
  );
}
