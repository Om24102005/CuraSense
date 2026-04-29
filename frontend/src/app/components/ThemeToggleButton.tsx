import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../App';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle light/dark theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '0.06em',
        background: isDark
          ? 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.10))'
          : 'linear-gradient(135deg, rgba(109,40,217,0.12), rgba(15,15,40,0.08))',
        color: isDark ? '#fbbf24' : '#6d28d9',
        border: isDark
          ? '1px solid rgba(251,191,36,0.40)'
          : '1px solid rgba(109,40,217,0.30)',
        boxShadow: isDark
          ? '0 0 18px rgba(251,191,36,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 2px 14px rgba(109,40,217,0.15), inset 0 1px 0 rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline text-xs uppercase tracking-widest">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline text-xs uppercase tracking-widest">Dark</span>
        </>
      )}
    </button>
  );
}
