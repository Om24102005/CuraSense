/* ═══════════════════════════════════════════════════════
   CuraSense — 5-Theme Toggle Button
   Cycles through: Void → Dawn → Cyber → Medic → Aurora
   ═══════════════════════════════════════════════════════ */

import { Sun, Moon, Sparkles, Heart, CloudMoon } from 'lucide-react';
import { useTheme } from '../App';
import { themes, ThemeName } from '../themes';

const themeIcons: Record<ThemeName, { icon: typeof Sun; label: string }> = {
  dark: { icon: Moon, label: 'Void' },
  light: { icon: Sun, label: 'Dawn' },
  cyberpunk: { icon: Sparkles, label: 'Cyber' },
  medical: { icon: Heart, label: 'Medic' },
  aurora: { icon: CloudMoon, label: 'Aurora' },
};

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const current = themes[theme];
  const meta = themeIcons[theme];
  const Icon = meta.icon;

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Current theme: ${meta.label}. Click to cycle.`}
      title={`${meta.label} — Click to cycle`}
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
