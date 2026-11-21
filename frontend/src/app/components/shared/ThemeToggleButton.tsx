/* ═══════════════════════════════════════════════════════
   CuraSense — Theme Toggle Button (Dark ⇄ Light)
   ═══════════════════════════════════════════════════════ */

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../App';
import { themes } from '../../themes';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const current = themes[theme];
  const isDark = theme === 'dark';
  const Icon = isDark ? Moon : Sun;
  const next = isDark ? 'Light' : 'Dark';

  return (
    <button
      id="theme-toggle"
      onClick={(e) => toggleTheme(e.clientX, e.clientY)}
      aria-label={`Current theme: ${current.label}. Switch to ${next} mode.`}
      title={`${current.label} mode — Click for ${next}`}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition duration-300 hover:scale-105 active:scale-95"
      style={{
        fontFamily: "var(--font-body)",
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
        {current.label}
      </span>
    </button>
  );
}
