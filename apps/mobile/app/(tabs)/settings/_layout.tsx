import { View } from 'react-native';
import { Stack } from 'expo-router';
import { SaveToast } from '../../../src/settings/parts';
import { useTheme } from '../../../src/theme';

// The list of settings, and the pages it opens (language, family members, emergency contacts) with a back button.
// Reloading or linking straight into one of those pages still keeps the list underneath it, so there is a way back.
export const unstable_settings = { initialRouteName: 'index' };

export default function SettingsLayout() {
  const t = useTheme();
  return (
    <View style={{ flex: 1 }}>
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
        <Stack.Screen name="index" options={{ title: 'Settings' }} />
        <Stack.Screen name="language" options={{ title: 'AI language' }} />
        <Stack.Screen name="dependents" options={{ title: 'Family members' }} />
        <Stack.Screen name="contacts" options={{ title: 'Emergency contacts' }} />
      </Stack>
      <SaveToast />
    </View>
  );
}
