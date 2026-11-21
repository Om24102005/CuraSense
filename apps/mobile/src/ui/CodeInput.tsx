import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { AppText } from './AppText';
import { radius } from './tokens';

interface Props {
  value: string;
  onChange: (digits: string) => void;
  /** Called once with the full code as soon as the last digit lands. */
  onComplete?: (digits: string) => void;
  error?: boolean;
  disabled?: boolean;
  length?: number;
  testID?: string;
}

/** Six boxes backed by one invisible text field, so paste, the number pad and a screen reader all work as for a plain input. */
export function CodeInput({ value, onChange, onComplete, error, disabled, length = 6, testID }: Props) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);

  const handle = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length);   // "123 456" pasted from a message still works
    onChange(digits);
    if (digits.length === length) onComplete?.(digits);
  };

  return (
    <View>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', gap: 8 }}>
        {Array.from({ length }, (_, i) => (
          <View
            key={i}
            style={{
              flex: 1, height: 56, borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface,
              borderColor: error ? t.error : focused && i === Math.min(value.length, length - 1) ? t.accent : t.border,
            }}
          >
            <AppText variant="title">{value[i] ?? ''}</AppText>
          </View>
        ))}
      </View>
      <TextInput
        testID={testID}
        accessibilityLabel={`${length}-digit code`}
        value={value}
        onChangeText={handle}
        editable={!disabled}
        autoFocus
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        caretHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.01 }}
      />
    </View>
  );
}
