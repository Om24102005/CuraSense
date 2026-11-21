import { Pressable } from 'react-native';
import { Ionicons } from '../../../src/ui/Icon';
import { useRouter } from 'expo-router';
import { LANGUAGES } from '@curasense/shared/settings';
import { tick } from '../../../src/haptics';
import { NOT_USED } from '../../../src/settings/parts';
import { useSettings } from '../../../src/settings/SettingsContext';
import { useTheme } from '../../../src/theme';
import { AppText } from '../../../src/ui/AppText';
import { Card } from '../../../src/ui/Card';
import { Screen } from '../../../src/ui/Screen';
import { MIN_TOUCH } from '../../../src/ui/tokens';

export default function Language() {
  const t = useTheme();
  const router = useRouter();
  const { values, update } = useSettings();
  return (
    <Screen edges={[]}>
      <AppText variant="callout" tone="secondary">The language you want AI answers written in. {NOT_USED}</AppText>
      <Card style={{ padding: 6, gap: 0 }}>
        {LANGUAGES.map((l) => {
          const selected = l.code === values.language;
          return (
            <Pressable
              key={l.code}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              testID={`language-${l.code}`}
              onPress={async () => { tick(); if (selected || (await update({ language: l.code }, `Language set to ${l.label}.`))) router.back(); }}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', minHeight: MIN_TOUCH + 4, paddingHorizontal: 12, opacity: pressed ? 0.7 : 1 })}
            >
              <AppText style={{ flex: 1, writingDirection: 'ltr', textAlign: 'left' }}>{l.label}</AppText>
              {selected ? <Ionicons name="checkmark" size={20} color={t.accent} /> : null}
            </Pressable>
          );
        })}
      </Card>
    </Screen>
  );
}
