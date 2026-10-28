/* ═══════════════════════════════════════════════════════
   CuraSense — Theme Toggle Button (Dark ⇄ Light)
   ═══════════════════════════════════════════════════════ */

import { Sun, Moon, Zap, Stethoscope, Sparkles } from 'lucide-react';
import { useTheme } from '../../App';
import { themes, ThemeName } from '../../themes';

const themeIcons: Record<ThemeName, { icon: typeof Sun; label: string }> = {
  dark:      { icon: Moon,        label: 'Dark' },
  light:     { icon: Sun,         label: 'Light' },
  cyberpunk: { icon: Zap,         label: 'Cyberpunk' },
  medical:   { icon: Stethoscope, label: 'Medical' },
  aurora:    { icon: Sparkles,    label: 'Aurora' },
};

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const t = theme as ThemeName;
  const current = themes[t];
  const meta = themeIcons[t];
  const Icon = meta.icon;
  const next = t === 'dark' ? 'Light' : 'Dark';

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Current theme: ${meta.label}. Switch to ${next} mode.`}
      title={`${meta.label} mode — Click for ${next}`}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '0.06em',
        background: `linear-gradient(135deg, ${current.accent}22, ${current.accent}11)`,
        color: current.accent,
        border: `1px solid ${current.accent}55`,
        boxShadow: `0 0 18px ${current.accent}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline text-xs uppercase tracking-widest">
        {meta.label}
      </span>
    </button>
  );
}
