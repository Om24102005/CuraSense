// Types for plasma-orb.engine.js (the engine itself is plain JavaScript).
export interface PlasmaOrbConfig {
  viewportWidth: number;
  viewportHeight: number;
  size: number;
  background: string;
  center: string;
  glass: string;
  rim: string;
  plasma: string;
  accent: string;
  energy: number;
  swirl: number;
  glow: number;
  speed: number;
  detail: 'high' | 'balanced';
  animate: boolean;
  interactive: boolean;
}

export interface PlasmaOrbHandle {
  (): void;
  update(next: Partial<PlasmaOrbConfig>): void;
}

export const DEFAULT_PLASMA_ORB_CONFIG: PlasmaOrbConfig;
export function buildPlasmaOrb(root: HTMLElement, config: Partial<PlasmaOrbConfig>): PlasmaOrbHandle;
export function hexToRgb(hex: string): [number, number, number];
export function createRenderer(canvas: HTMLCanvasElement): unknown;
