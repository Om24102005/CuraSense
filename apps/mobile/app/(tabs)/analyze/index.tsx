import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../src/theme';
import { AppText } from '../../../src/ui/AppText';
import { Screen } from '../../../src/ui/Screen';
import { radius } from '../../../src/ui/tokens';

type Icon = keyof typeof Ionicons.glyphMap;
const DOORS: { href: '/analyze/symptoms' | '/analyze/scans' | '/analyze/reports'; icon: Icon; title: string; body: string }[] = [
  { href: '/analyze/symptoms', icon: 'medkit-outline', title: 'Check symptoms', body: 'Ranked conditions and an urgency level' },
  { href: '/analyze/scans', icon: 'scan-outline', title: 'Read a scan', body: 'AI-assisted read of a medical image' },
  { href: '/analyze/reports', icon: 'flask-outline', title: 'Explain a lab report', body: 'Every biomarker flagged against its range' },
];

export default function AnalyzeMenu() {
  const router = useRouter();
  const t = useTheme();
  return (
    <Screen edges={[]}>
      <View style={{ gap: 4 }}>
        <AppText variant="title" accessibilityRole="header">AI-Powered Analysis</AppText>
        <AppText variant="callout" tone="secondary">Choose an analysis method to get started.</AppText>
      </View>
      {DOORS.map((d) => (
        <Pressable
          key={d.href}
          accessibilityRole="button"
          accessibilityLabel={`${d.title}. ${d.body}`}
          testID={`door-${d.href.split('/').pop()}`}
          onPress={() => router.push(d.href)}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, minHeight: 76, borderRadius: radius.lg, borderWidth: 1,
            borderColor: t.border, backgroundColor: pressed ? t.surface : t.card, transform: [{ scale: pressed ? 0.99 : 1 }],
          })}
        >
          <View style={{ width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: `${t.primary}26` }}>
            <Ionicons name={d.icon} size={26} color={t.accent} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="headline">{d.title}</AppText>
            <AppText variant="callout" tone="secondary">{d.body}</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={t.textMuted} />
        </Pressable>
      ))}
    </Screen>
  );
}
