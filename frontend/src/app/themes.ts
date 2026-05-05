/* ═══════════════════════════════════════════════════════
   CuraSense — 5 GOD-LEVEL THEMES
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
  dark: {
    name: 'dark',
    label: 'Void',
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
    label: 'Dawn',
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
  },
  cyberpunk: {
    name: 'cyberpunk',
    label: 'Cyber',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #22d3ee 100%)',
    accent: '#ec4899',
    vars: {
      '--bg-base': '#0a0015',
      '--bg-surface': 'rgba(20,0,40,0.70)',
      '--bg-card': 'rgba(30,0,50,0.80)',
      '--border-color': 'rgba(244,114,182,0.20)',
      '--text-primary': '#fce7f3',
      '--text-secondary': 'rgba(252,231,243,0.70)',
      '--text-muted': 'rgba(252,231,243,0.40)',
      '--accent-cyan': '#22d3ee',
      '--accent-violet': '#ec4899',
      '--header-bg': 'rgba(10,0,21,0.85)',
      '--footer-bg': 'rgba(10,0,21,0.90)',
      '--nav-active-bg': 'rgba(236,72,153,0.20)',
      '--scrollbar-thumb': 'rgba(236,72,153,0.5)',
      '--glass-edge': 'rgba(244,114,182,0.15)',
      '--glow-cyan': 'rgba(34,211,238,0.12)',
      '--glow-violet': 'rgba(236,72,153,0.15)',
    }
  },
  medical: {
    name: 'medical',
    label: 'Medic',
    gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    accent: '#10b981',
    vars: {
      '--bg-base': '#020f0a',
      '--bg-surface': 'rgba(5,25,18,0.70)',
      '--bg-card': 'rgba(8,30,20,0.80)',
      '--border-color': 'rgba(16,185,129,0.15)',
      '--text-primary': '#d1fae5',
      '--text-secondary': 'rgba(209,250,229,0.65)',
      '--text-muted': 'rgba(209,250,229,0.35)',
      '--accent-cyan': '#10b981',
      '--accent-violet': '#3b82f6',
      '--header-bg': 'rgba(2,15,10,0.85)',
      '--footer-bg': 'rgba(2,15,10,0.90)',
      '--nav-active-bg': 'rgba(16,185,129,0.20)',
      '--scrollbar-thumb': 'rgba(16,185,129,0.4)',
      '--glass-edge': 'rgba(16,185,129,0.12)',
      '--glow-cyan': 'rgba(16,185,129,0.12)',
      '--glow-violet': 'rgba(59,130,246,0.12)',
    }
  },
  aurora: {
    name: 'aurora',
    label: 'Aurora',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #34d399 100%)',
    accent: '#a78bfa',
    vars: {
      '--bg-base': '#050510',
      '--bg-surface': 'rgba(10,10,30,0.70)',
      '--bg-card': 'rgba(15,15,40,0.80)',
      '--border-color': 'rgba(167,139,250,0.15)',
      '--text-primary': '#ede9fe',
      '--text-secondary': 'rgba(237,233,254,0.65)',
      '--text-muted': 'rgba(237,233,254,0.35)',
      '--accent-cyan': '#34d399',
      '--accent-violet': '#a78bfa',
      '--header-bg': 'rgba(5,5,16,0.85)',
      '--footer-bg': 'rgba(5,5,16,0.90)',
      '--nav-active-bg': 'rgba(167,139,250,0.20)',
      '--scrollbar-thumb': 'rgba(167,139,250,0.4)',
      '--glass-edge': 'rgba(167,139,250,0.12)',
      '--glow-cyan': 'rgba(52,211,153,0.12)',
      '--glow-violet': 'rgba(167,139,250,0.15)',
    }
  }
};
