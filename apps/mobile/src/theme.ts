import { useColorScheme } from 'react-native';
import { themes, type ThemeName } from '@curasense/shared/themes';
import { useSettings } from './settings/SettingsContext';

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

// High contrast: solid borders and no faded text (the normal palette fades secondary text and borders with transparency).
const sharpen = (p: Palette): Palette => (p.name === 'dark'
  ? { ...p, border: '#b7c5db', textSecondary: p.text, textMuted: '#c1cfe0' }
  : { ...p, border: '#3b4a6b', textSecondary: p.text, textMuted: '#2c3a5c' });
const sharp: Record<ThemeName, Palette> = { dark: sharpen(palettes.dark), light: sharpen(palettes.light) };

export function useTheme(): Palette {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  return (useSettings().values.highContrast ? sharp : palettes)[scheme];
}
