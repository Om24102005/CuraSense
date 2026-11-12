import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme';

// Each analysis opens as its own screen with a back button, the way a phone app navigates (the website uses tabs here).
export default function AnalyzeLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Analyze' }} />
      <Stack.Screen name="symptoms" options={{ title: 'Check symptoms' }} />
      <Stack.Screen name="scans" options={{ title: 'Read a scan' }} />
      <Stack.Screen name="reports" options={{ title: 'Lab report' }} />
    </Stack>
  );
}
