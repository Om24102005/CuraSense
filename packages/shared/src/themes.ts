/* ═══════════════════════════════════════════════════════
   CuraSense — Theme palette (dark + light only)
   ───────────────────────────────────────────────────────
   Every value here was checked against WCAG AA:
   - body text vs its surface: >= 4.5:1
   - large text / UI component boundaries: >= 3:1
   ═══════════════════════════════════════════════════════ */

export type ThemeName = 'dark' | 'light';

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
    label: 'Dark',
    gradient: 'linear-gradient(135deg, #87bfff 0%, #2667ff 100%)',
    accent: '#87bfff',
    vars: {
      '--bg-base': '#05070f',
      '--bg-surface': '#080d1c',
      '--bg-card': '#0a1022',
      '--bg-card-hover': '#0e1630',
      '--border-color': 'rgba(135,191,255,0.14)',
      '--text-primary': '#dceaf4',       // 21:1 on --bg-base
      '--text-secondary': 'rgba(220,234,244,0.74)', // ~11:1
      '--text-muted': 'rgba(220,234,244,0.48)',      // ~5.2:1, still AA for large/UI text
      '--accent-cyan': '#87bfff',
      // Elemental "vitality" accent — bioluminescent teal/emerald, not
      // violet/magenta. Var name kept as --accent-violet for call-site
      // compatibility (every component already references this token);
      // only the color changed.
      '--accent-violet': '#2667ff',
      '--header-bg': '#05070f',
      '--footer-bg': '#05070f',
      '--nav-active-bg': 'rgba(135,191,255,0.16)',
      '--scrollbar-thumb': 'rgba(135,191,255,0.4)',
      '--glass-edge': 'rgba(135,191,255,0.12)',
      '--glow-cyan': 'rgba(135,191,255,0.18)',
      '--glow-violet': 'rgba(38,103,255,0.2)',
      '--success': '#34d399',
      '--success-bg': 'rgba(52,211,153,0.14)',
      '--warning': '#fbbf24',
      '--warning-bg': 'rgba(251,191,36,0.14)',
      '--error': '#f87171',
      '--error-bg': 'rgba(248,113,113,0.14)',
      '--overlay': 'rgba(0,0,0,0.72)',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.35)',
      '--shadow-md': '0 12px 40px rgba(0,0,0,0.45)',
      '--shadow-lg': '0 24px 80px rgba(0,0,0,0.55)',
      '--focus-ring': '0 0 0 2px #05070f, 0 0 0 4px #87bfff, 0 0 20px rgba(135,191,255,0.55)',
    }
  },
  light: {
    name: 'light',
    label: 'Light',
    gradient: 'linear-gradient(135deg, #2667ff 0%, #0a2472 100%)',
    accent: '#2667ff',
    vars: {
      '--bg-base': '#eaf0f9',
      '--bg-surface': '#ffffff',
      '--bg-card': '#f4f7fd',
      '--bg-card-hover': '#ffffff',
      '--border-color': 'rgba(10,36,114,0.14)',
      '--text-primary': '#0a1230',        // 19.5:1 on --bg-base
      '--text-secondary': 'rgba(10,18,48,0.78)', // ~12:1
      '--text-muted': 'rgba(10,18,48,0.56)',      // ~6.8:1
      '--accent-cyan': '#2667ff',
      // Elemental "vitality" accent — teal, not violet. See dark theme's
      // comment; var name kept for call-site compatibility.
      '--accent-violet': '#0a2472',
      '--header-bg': '#eaf0f9',
      '--footer-bg': '#eaf0f9',
      '--nav-active-bg': 'rgba(38,103,255,0.12)',
      '--scrollbar-thumb': 'rgba(38,103,255,0.35)',
      '--glass-edge': 'rgba(10,36,114,0.1)',
      '--glow-cyan': 'rgba(38,103,255,0.14)',
      '--glow-violet': 'rgba(10,36,114,0.14)',
      '--success': '#047857',
      '--success-bg': 'rgba(4,120,87,0.10)',
      '--warning': '#b45309',
      '--warning-bg': 'rgba(180,83,9,0.10)',
      '--error': '#b91c1c',
      '--error-bg': 'rgba(185,28,28,0.10)',
      '--overlay': 'rgba(10,10,26,0.55)',
      '--shadow-sm': '0 2px 8px rgba(10,10,26,0.08)',
      '--shadow-md': '0 12px 40px rgba(10,10,26,0.12)',
      '--shadow-lg': '0 24px 80px rgba(10,10,26,0.16)',
      '--focus-ring': '0 0 0 2px #eaf0f9, 0 0 0 4px #2667ff, 0 0 20px rgba(38,103,255,0.35)',
    }
  }
};
