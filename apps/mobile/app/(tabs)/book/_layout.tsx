import { Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BookingsProvider } from '../../../src/book/BookingsContext';
import { Ionicons } from '../../../src/ui/Icon';
import { useTheme } from '../../../src/theme';

// Reloading or linking straight into My bookings or one booking still keeps the wizard underneath, so there is a way back.
export const unstable_settings = { initialRouteName: 'index' };

function MyBookingsLink() {
  const router = useRouter();
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="My bookings" testID="my-bookings-link" hitSlop={8} onPress={() => router.push('/book/mine')} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="list" size={24} color={t.accent} />
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
          headerBackButtonDisplayMode: 'minimal', // a chevron only: a back button that carries the previous title is wide, pushes the title off centre and differs from screen to screen
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
