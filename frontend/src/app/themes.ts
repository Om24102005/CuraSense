/* ═══════════════════════════════════════════════════════
   CuraSense — Theme palette
   ═══════════════════════════════════════════════════════ */

export type ThemeName = 'dark' | 'light' | 'cyberpunk' | 'medical' | 'aurora';

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  vars: Record<string, string>;
  gradient: string;
  accent: string;
}

export const themes: Record<ThemeName, ThemeConfig> = {
  cyberpunk: {
    name: 'cyberpunk',
    label: 'Cyberpunk',
    gradient: 'linear-gradient(135deg, #f0e040 0%, #ff2d78 100%)',
    accent: '#ff2d78',
    vars: {
      '--bg-base': '#050010',
      '--bg-surface': 'rgba(5,0,20,0.85)',
      '--bg-card': 'rgba(10,0,30,0.80)',
      '--border-color': 'rgba(255,45,120,0.25)',
      '--text-primary': '#f0e040',
      '--text-secondary': 'rgba(240,224,64,0.72)',
      '--text-muted': 'rgba(240,224,64,0.40)',
      '--accent-cyan': '#00f5ff',
      '--accent-violet': '#ff2d78',
      '--header-bg': 'rgba(5,0,16,0.90)',
      '--footer-bg': 'rgba(5,0,16,0.95)',
      '--nav-active-bg': 'rgba(255,45,120,0.20)',
      '--scrollbar-thumb': 'rgba(255,45,120,0.5)',
      '--glass-edge': 'rgba(255,45,120,0.15)',
      '--glow-cyan': 'rgba(0,245,255,0.15)',
      '--glow-violet': 'rgba(255,45,120,0.20)',
    }
  },
  medical: {
    name: 'medical',
    label: 'Medical',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
    accent: '#0ea5e9',
    vars: {
      '--bg-base': '#f0f9ff',
      '--bg-surface': 'rgba(240,249,255,0.97)',
      '--bg-card': 'rgba(255,255,255,0.99)',
      '--border-color': 'rgba(14,165,233,0.15)',
      '--text-primary': '#0c1a2e',
      '--text-secondary': 'rgba(12,26,46,0.70)',
      '--text-muted': 'rgba(12,26,46,0.45)',
      '--accent-cyan': '#0ea5e9',
      '--accent-violet': '#10b981',
      '--header-bg': 'rgba(240,249,255,0.97)',
      '--footer-bg': 'rgba(240,249,255,0.99)',
      '--nav-active-bg': 'rgba(14,165,233,0.10)',
      '--scrollbar-thumb': 'rgba(14,165,233,0.35)',
      '--glass-edge': 'rgba(14,165,233,0.08)',
      '--glow-cyan': 'rgba(14,165,233,0.12)',
      '--glow-violet': 'rgba(16,185,129,0.10)',
    }
  },
  aurora: {
    name: 'aurora',
    label: 'Aurora',
    gradient: 'linear-gradient(135deg, #34d399 0%, #818cf8 100%)',
    accent: '#818cf8',
    vars: {
      '--bg-base': '#010d10',
      '--bg-surface': 'rgba(1,13,16,0.88)',
      '--bg-card': 'rgba(2,18,22,0.82)',
      '--border-color': 'rgba(52,211,153,0.18)',
      '--text-primary': '#e0fff8',
      '--text-secondary': 'rgba(224,255,248,0.68)',
      '--text-muted': 'rgba(224,255,248,0.38)',
      '--accent-cyan': '#34d399',
      '--accent-violet': '#818cf8',
      '--header-bg': 'rgba(1,10,14,0.90)',
      '--footer-bg': 'rgba(1,10,14,0.95)',
      '--nav-active-bg': 'rgba(52,211,153,0.15)',
      '--scrollbar-thumb': 'rgba(52,211,153,0.40)',
      '--glass-edge': 'rgba(52,211,153,0.12)',
      '--glow-cyan': 'rgba(52,211,153,0.18)',
      '--glow-violet': 'rgba(129,140,248,0.15)',
    }
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
    accent: '#8b5cf6',
    vars: {
      '--bg-base': '#000005',
      '--bg-surface': 'rgba(10,10,24,0.65)',
      '--bg-card': 'rgba(14,14,30,0.75)',
      '--border-color': 'rgba(255,255,255,0.10)',
      '--text-primary': '#ffffff',
      '--text-secondary': 'rgba(255,255,255,0.65)',
      '--text-muted': 'rgba(255,255,255,0.38)',
      '--accent-cyan': '#22d3ee',
      '--accent-violet': '#8b5cf6',
      '--header-bg': 'rgba(5,5,14,0.80)',
      '--footer-bg': 'rgba(5,5,14,0.88)',
      '--nav-active-bg': 'rgba(139,92,246,0.20)',
      '--scrollbar-thumb': 'rgba(139,92,246,0.4)',
      '--glass-edge': 'rgba(255,255,255,0.08)',
      '--glow-cyan': 'rgba(34,211,238,0.15)',
      '--glow-violet': 'rgba(139,92,246,0.15)',
    }
  },
  light: {
    name: 'light',
    label: 'Light',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
    accent: '#6d28d9',
    vars: {
      '--bg-base': '#f8faff',
      '--bg-surface': 'rgba(255,255,255,0.95)',
      '--bg-card': 'rgba(255,255,255,0.98)',
      '--border-color': 'rgba(0,0,0,0.10)',
      '--text-primary': '#0a0a1a',
      '--text-secondary': 'rgba(10,10,26,0.72)',
      '--text-muted': 'rgba(10,10,26,0.48)',
      '--accent-cyan': '#0284c7',
      '--accent-violet': '#6d28d9',
      '--header-bg': 'rgba(255,255,255,0.95)',
      '--footer-bg': 'rgba(248,250,255,0.97)',
      '--nav-active-bg': 'rgba(109,40,217,0.10)',
      '--scrollbar-thumb': 'rgba(109,40,217,0.3)',
      '--glass-edge': 'rgba(0,0,0,0.06)',
      '--glow-cyan': 'rgba(2,132,199,0.10)',
      '--glow-violet': 'rgba(109,40,217,0.10)',
    }
  }
};
