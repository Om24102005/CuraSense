import { useEffect, useState } from 'react';
import { AccessibilityInfo, Linking, Modal, Platform, ScrollView, View } from 'react-native';
import { Ionicons } from '../ui/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { URGENCY_LEVELS } from '@curasense/shared/analysis';
import { EMERGENCY_NOTE, smsUrl, telUrl } from '@curasense/shared/settings';
import { useSettings } from '../settings/SettingsContext';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { Banner } from '../ui/Banner';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/** Buttons to call for help. Every one of them only opens the phone or Messages: the person taps, the app never calls or sends. */
function Sheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const t = useTheme();
  const router = useRouter();
  const { values } = useSettings();
  const [error, setError] = useState('');
  const open = (url: string) => { setError(''); Linking.openURL(url).catch(() => setError('This device cannot do that. Dial the number yourself.')); };
  const contacts = values.emergencyContacts;
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: t.bg }}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View testID="emergency-sheet" style={{ gap: 8, alignItems: 'center', paddingTop: 4 }}>
            <Ionicons name="warning" size={44} color={t.error} />
            <AppText variant="title" accessibilityRole="header" style={{ textAlign: 'center', color: t.error }}>This result is marked EMERGENCY</AppText>
            <AppText tone="secondary" style={{ textAlign: 'center' }}>{URGENCY_LEVELS.emergency.sub}</AppText>
          </View>

          <Button variant="emergency" title={`Call emergency services (${values.emergencyNumber})`} testID="call-emergency" onPress={() => open(telUrl(values.emergencyNumber))} />

          {contacts.length ? contacts.map((c) => (
            <Card key={c.id} testID={`emergency-contact-${c.id}`} style={{ gap: 10 }}>
              <View>
                <AppText variant="headline">{c.name}</AppText>
                <AppText variant="caption" tone="muted">{[c.relation, c.phone].filter(Boolean).join(' · ')}</AppText>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                <Button title="Call" variant="secondary" accessibilityLabel={`Call ${c.name}`} testID={`emergency-call-${c.id}`} style={{ flexGrow: 1, flexBasis: 130 }} onPress={() => open(telUrl(c.phone))} />
                <Button title="Message" variant="secondary" accessibilityLabel={`Message ${c.name}`} testID={`emergency-message-${c.id}`} style={{ flexGrow: 1, flexBasis: 130 }} onPress={() => open(smsUrl(c.phone, EMERGENCY_NOTE, Platform.OS === 'android' ? 'android' : 'ios'))} />
              </View>
            </Card>
          )) : (
            <Card style={{ gap: 4 }}>
              <AppText testID="emergency-no-contacts">No emergency contacts yet.</AppText>
              <Button title="Add contacts in Settings" variant="link" testID="emergency-add-contacts" style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} onPress={() => { onClose(); router.push('/settings/contacts'); }} />
            </Card>
          )}

          {error ? <Banner tone="error" testID="emergency-error">{error}</Banner> : null}
          <AppText variant="caption" tone="muted">CuraSense cannot call for help or send messages by itself. If you are in danger, call your local emergency number now.</AppText>
          <Button title="Not now" variant="secondary" testID="emergency-dismiss" onPress={onClose} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

/**
 * Under the urgency banner of a fresh result: when the Emergency prompt is on and the result is an emergency, the sheet opens by
 * itself once, and a button reopens it. Renders nothing otherwise.
 */
export function EmergencyPrompt({ active }: { active: boolean }) {
  const { values } = useSettings();
  const show = active && values.autoAlertsEnabled;
  // Opens by itself only for the result being looked at when it appears. Turning the setting on later, from another tab, must not
  // throw a sheet over that tab about an old result: a tab keeps its screens mounted, and a Modal ignores which tab is showing.
  const [open, setOpen] = useState(show);
  useEffect(() => {
    if (open) AccessibilityInfo.announceForAccessibility('This result is marked emergency. Buttons to call for help are on screen.');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- once, when the result appears
  if (!show) return null;
  return (
    <>
      <Button title="Emergency contacts and services" variant="emergency" testID="emergency-open" onPress={() => setOpen(true)} />
      <Sheet visible={open} onClose={() => setOpen(false)} />
    </>
  );
}
