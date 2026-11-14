import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/auth/AuthContext';
import { SettingsProvider, useSettings } from '../src/settings/SettingsContext';
import { useTheme } from '../src/theme';

// The native splash stays up until the saved session has been read, so a signed-in user never sees the sign-in screen flash.
SplashScreen.preventAutoHideAsync().catch(() => {});

function Routes() {
  const { status } = useAuth();
  const { ready } = useSettings();
  const t = useTheme();
  const waiting = status === 'loading' || !ready;
  useEffect(() => {
    if (!waiting) SplashScreen.hideAsync().catch(() => {});
  }, [waiting]);
  // No navigator until the saved session and settings are known: a link that opens the app on a signed-in screen would otherwise be
  // resolved against empty guards and lost, and the first screen would flash in the wrong contrast. The splash screen covers this short wait.
  if (waiting) return null;
  return (
    <>
      <StatusBar style={t.name === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={status === 'signedIn'}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={status === 'signedOut'}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SettingsProvider>
          <Routes />
        </SettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
