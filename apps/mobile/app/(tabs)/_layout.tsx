import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';

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
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: t.bg },
        headerTintColor: t.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        sceneStyle: { backgroundColor: t.bg },
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        tabBarLabelStyle: { fontSize: 11, lineHeight: 14, fontWeight: '600' },
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.textMuted,
      }}
    >
      {TABS.map(({ name, title, icon, active }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ title, headerShown: name !== 'analyze', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? active : icon} size={size} color={color as string} /> }}
        />
      ))}
    </Tabs>
  );
}
