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
        headerBackButtonDisplayMode: 'minimal', // a chevron only: a back button that carries the previous title is wide, pushes the title off centre and differs from screen to screen
        contentStyle: { backgroundColor: t.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'History' }} />
      <Stack.Screen name="[id]" options={{ title: 'Analysis' }} />
    </Stack>
  );
}
