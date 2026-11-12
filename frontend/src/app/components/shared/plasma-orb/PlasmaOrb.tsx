/* Plasma Orb, a free "Drop" from HorizonX (https://horizonx.so/tools/plasma-orb), used under the HorizonX Drops License
   (https://horizonx.so/licenses/drops). Fetched from https://horizonx.so/r/plasma-orb.json.
   Two changes for this app, which is on React 18: the Next.js 'use client' line is gone, and the React 19-only
   <style href precedence> tag is a CSS import instead. plasma-orb.engine.js is unchanged and keeps its HorizonX banner. */

import { useEffect, useRef, type CSSProperties } from 'react';
import { buildPlasmaOrb, DEFAULT_PLASMA_ORB_CONFIG, type PlasmaOrbConfig, type PlasmaOrbHandle } from './plasma-orb.engine.js';
import './plasma-orb.css';

/** What an AI agent is doing. Each state sets the orb's energy and swirl; the engine eases between them. */
export type PlasmaOrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

// Same looks as the Assistant Pill on horizonx.so.
const LOOK: Record<PlasmaOrbState, { energy: number; swirl: number }> = {
  idle: { energy: 0.38, swirl: 0 },
  listening: { energy: 0.62, swirl: 0 },
  thinking: { energy: 0.72, swirl: 1 },
  speaking: { energy: 0.58, swirl: 0.25 },
  error: { energy: 0.2, swirl: 0 }
};

export interface PlasmaOrbProps {
  /** Agent state. `energy` and `swirl` override it when set. */
  state?: PlasmaOrbState;
  /** Orb diameter as a share of the short side, 0.3 to 0.8. */
  size?: number;
  background?: string;
  center?: string;
  glass?: string;
  /** Rim and glow colour. */
  rim?: string;
  plasma?: string;
  /** Sparkle accent colour. */
  accent?: string;
  /** 0 to 1. */
  energy?: number;
  /** 0 to 1. */
  swirl?: number;
  /** Bloom strength, 0 to 1.2. */
  glow?: number;
  /** 0 to 2. */
  speed?: number;
  /** `balanced` halves the ray-march work for weaker GPUs. */
  detail?: 'high' | 'balanced';
  paused?: boolean;
  /** Hover lifts the plasma and a press sends a pulse. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
}

const clamp = (value: number | undefined, min: number, max: number, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

function toConfig(props: PlasmaOrbProps): Partial<PlasmaOrbConfig> {
  const d = DEFAULT_PLASMA_ORB_CONFIG;
  const look = props.state ? LOOK[props.state] : { energy: d.energy, swirl: d.swirl };
  return {
    size: clamp(props.size, 0.3, 0.8, d.size),
    background: props.background ?? d.background,
    center: props.center ?? d.center,
    glass: props.glass ?? d.glass,
    rim: props.rim ?? d.rim,
    plasma: props.plasma ?? d.plasma,
    accent: props.accent ?? d.accent,
    energy: clamp(props.energy, 0, 1, look.energy),
    swirl: clamp(props.swirl, 0, 1, look.swirl),
    glow: clamp(props.glow, 0, 1.2, d.glow),
    speed: clamp(props.speed, 0, 2, d.speed),
    detail: props.detail ?? d.detail,
    animate: !props.paused,
    interactive: props.interactive ?? true
  };
}

/** A glass sphere with a live plasma core, ray-traced per pixel in WebGL2. Fills its parent. */
export function PlasmaOrb({ className, style, ...props }: PlasmaOrbProps) {
  const root = useRef<HTMLDivElement>(null);
  const engine = useRef<PlasmaOrbHandle | null>(null);
  const config = toConfig(props);
  const latest = useRef(config);
  const key = JSON.stringify(config);

  // Declared before the mount effect so a remount always starts from the newest props.
  useEffect(() => {
    latest.current = config;
    engine.current?.update(config);
  }, [key]);

  useEffect(() => {
    const handle = buildPlasmaOrb(root.current!, latest.current);
    engine.current = handle;
    return () => { handle(); engine.current = null; };
  }, []);

  return (
    <div
      ref={root}
      className={className ? `pob-viewport ${className}` : 'pob-viewport'}
      style={{ background: config.background, ...style }}
    >
      <div className="pob-stage" />
      <span className="pob-status" role="status" />
    </div>
  );
}

export default PlasmaOrb;
