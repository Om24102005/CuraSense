import { useColorScheme } from 'react-native';
import { themes, type ThemeName } from '@curasense/shared/themes';

// Colours come from the theme tokens the website uses, and the phone follows its own light or dark setting.
const build = (name: ThemeName) => {
  const v = themes[name].vars;
  return {
    name,
    bg: v['--bg-base'],
    surface: v['--bg-surface'],
    card: v['--bg-card'],
    border: v['--border-color'],
    text: v['--text-primary'],
    textSecondary: v['--text-secondary'],
    textMuted: v['--text-muted'],
    accent: v['--accent-cyan'],
    // The brand blue (#2667ff) in both themes, as on the website's buttons.
    primary: name === 'dark' ? v['--accent-violet'] : v['--accent-cyan'],
    onPrimary: '#ffffff',
    success: v['--success'],
    successBg: v['--success-bg'],
    error: v['--error'],
    errorBg: v['--error-bg'],
  };
};

export type Palette = ReturnType<typeof build>;
const palettes: Record<ThemeName, Palette> = { dark: build('dark'), light: build('light') };

export function useTheme(): Palette {
  return palettes[useColorScheme() === 'light' ? 'light' : 'dark'];
}
