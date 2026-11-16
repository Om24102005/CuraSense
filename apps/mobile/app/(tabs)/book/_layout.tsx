import { Pressable, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BookingsProvider } from '../../../src/book/BookingsContext';
import { useTheme } from '../../../src/theme';

// Reloading or linking straight into My bookings or one booking still keeps the wizard underneath, so there is a way back.
export const unstable_settings = { initialRouteName: 'index' };

function MyBookingsLink() {
  const router = useRouter();
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="My bookings" testID="my-bookings-link" hitSlop={12} onPress={() => router.push('/book/mine')} style={{ minHeight: 44, justifyContent: 'center' }}>
      <Text allowFontScaling={false} style={{ color: t.accent, fontSize: 17 }}>My bookings</Text>
    </Pressable>
  );
}

// The booking wizard, the list of the user's bookings, and one booking opened as its own screen.
export default function BookLayout() {
  const t = useTheme();
  return (
    <BookingsProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.bg },
          headerTintColor: t.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: t.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Book a consultation', headerRight: () => <MyBookingsLink /> }} />
        <Stack.Screen name="mine" options={{ title: 'My bookings' }} />
        <Stack.Screen name="[ref]" options={{ title: 'Booking' }} />
      </Stack>
    </BookingsProvider>
  );
}
