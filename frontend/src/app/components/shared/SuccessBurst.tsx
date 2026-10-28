import { useMemo } from 'react';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

/* ═══════════════════════════════════════════════════════
   CuraSense — Success Burst
   ───────────────────────────────────────────────────────
   tsParticles' one genuinely distinct role in this app: a bounded,
   self-terminating confetti burst for a completed-analysis moment.
   NOT the ambient background (that's NeuralPulseField/anime.js) —
   a single emitter firing once (emitters.life.count: 1), particles
   die on their own shortly after, nothing left running in a loop.
   Mount only while `active` is true; unmounting tears the canvas down.
   ═══════════════════════════════════════════════════════ */

interface SuccessBurstProps {
  active: boolean;
  colors?: string[];
}

export default function SuccessBurst({ active, colors = ['#22d3ee', '#a78bfa', '#34d399'] }: SuccessBurstProps) {
  const options: ISourceOptions = useMemo(() => ({
    fullScreen: { enable: false },
    detectRetina: true,
    particles: {
      number: { value: 0 },
      color: { value: colors },
      shape: { type: 'circle' },
      opacity: {
        value: 1,
        animation: { enable: true, speed: 2.2, startValue: 'max', destroy: 'min' },
      },
      size: { value: { min: 2, max: 5 } },
      life: { duration: { sync: true, value: 1 }, count: 1 },
      move: {
        enable: true,
        speed: { min: 8, max: 18 },
        direction: 'none',
        outModes: { default: 'destroy' },
        gravity: { enable: true, acceleration: 9 },
      },
    },
    emitters: {
      position: { x: 50, y: 50 },
      rate: { quantity: 40, delay: 0 },
      life: { count: 1, duration: 0.1 },
    },
  }), [colors]);

  if (!active) return null;

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none z-10">
      <ParticlesProvider init={async (engine) => { await loadSlim(engine); }}>
        <Particles id="success-burst" options={options} style={{ width: '100%', height: '100%' }} />
      </ParticlesProvider>
    </div>
  );
}
