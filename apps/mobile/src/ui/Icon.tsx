import type { ComponentProps } from 'react';
import { Ionicons as Glyphs } from '@expo/vector-icons';

/**
 * The icon font, hidden from screen readers. Every icon here is decoration next to text or inside a labelled control; left alone,
 * each one becomes an empty stop for VoiceOver to swipe through. Icons keep their size when the text size grows.
 */
function Icon(props: ComponentProps<typeof Glyphs>) {
  return <Glyphs accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" allowFontScaling={false} {...props} />;
}
export const Ionicons = Object.assign(Icon, { glyphMap: Glyphs.glyphMap });
