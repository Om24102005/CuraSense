import { forwardRef, useState, type ComponentRef } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from './Icon';
import { useTheme } from '../theme';
import { AppText } from './AppText';
import { radius } from './tokens';

/** What a ref to a text input points at (React Native's own instance type changed shape, so it is derived here once). */
export type TextInputRef = ComponentRef<typeof TextInput>;

interface Props extends TextInputProps {
  label: string;
  error?: string;
  /** Password field: hidden text with a show/hide button. */
  secure?: boolean;
}

export const TextField = forwardRef<TextInputRef, Props>(function TextField({ label, error, secure, style, ...rest }, ref) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);
  return (
    <View style={{ gap: 6 }}>
      <AppText variant="callout" tone="secondary">{label}</AppText>
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', minHeight: 52, borderRadius: radius.md, borderWidth: 1.5, paddingHorizontal: 14,
          backgroundColor: t.surface, borderColor: error ? t.error : focused ? t.accent : t.border,
        }}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={t.textMuted}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[{ flex: 1, color: t.text, fontSize: 17, paddingVertical: 12 }, style]}
          {...rest}
        />
        {secure ? (
          <Pressable accessibilityRole="button" accessibilityLabel={hidden ? 'Show password' : 'Hide password'} hitSlop={12} onPress={() => setHidden((h) => !h)}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={22} color={t.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <AppText variant="caption" tone="error">{error}</AppText> : null}
    </View>
  );
});
