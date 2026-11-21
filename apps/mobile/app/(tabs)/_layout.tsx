import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '../../src/ui/Icon';
import { PredictionsProvider } from '../../src/history/PredictionsContext';
import { useTheme } from '../../src/theme';
import { Welcome } from '../../src/welcome/Welcome';

type Icon = keyof typeof Ionicons.glyphMap;
const TABS: { name: string; title: string; icon: Icon; active: Icon }[] = [
  { name: 'home', title: 'Home', icon: 'home-outline', active: 'home' },
  { name: 'analyze', title: 'Analyze', icon: 'pulse-outline', active: 'pulse' },
  { name: 'history', title: 'History', icon: 'time-outline', active: 'time' },
  { name: 'book', title: 'Book', icon: 'calendar-outline', active: 'calendar' },
  { name: 'settings', title: 'Settings', icon: 'settings-outline', active: 'settings' },
];

export default function TabsLayout() {
  const t = useTheme();
  return (
    <PredictionsProvider>
    <View style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: t.bg },
        headerTintColor: t.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        headerTitleAllowFontScaling: false,
        sceneStyle: { backgroundColor: t.bg },
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        tabBarLabelStyle: { fontSize: 11, lineHeight: 14, fontWeight: '600' },
        tabBarAllowFontScaling: false,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.textMuted,
      }}
    >
      {TABS.map(({ name, title, icon, active }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ title, headerShown: !['analyze', 'history', 'settings', 'book'].includes(name), tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? active : icon} size={size} color={color as string} /> }}
        />
      ))}
    </Tabs>
    <Welcome />
    </View>
    </PredictionsProvider>
  );
}
