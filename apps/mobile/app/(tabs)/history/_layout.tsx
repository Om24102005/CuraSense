import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme';

// The list, and one analysis opened as its own screen with a back button.
export default function HistoryLayout() {
  const t = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: t.bg },
        headerTintColor: t.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: t.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'History' }} />
      <Stack.Screen name="[id]" options={{ title: 'Analysis' }} />
    </Stack>
  );
}
