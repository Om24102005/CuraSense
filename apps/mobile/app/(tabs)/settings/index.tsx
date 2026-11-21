import { useRouter } from 'expo-router';
import { LANGUAGES } from '@curasense/shared/settings';
import { useAuth } from '../../../src/auth/AuthContext';
import { Choice, Group, NavRow, NOT_USED, SwitchRow } from '../../../src/settings/parts';
import { useSettings } from '../../../src/settings/SettingsContext';
import { AppText } from '../../../src/ui/AppText';
import { Button } from '../../../src/ui/Button';
import { Card } from '../../../src/ui/Card';
import { Screen } from '../../../src/ui/Screen';

const UNITS = { metric: 'kg, cm, °C, mmol/L, kPa', imperial: 'lbs, in, °F, mg/dL, psi' };

export default function Settings() {
  const { user, signOut } = useAuth();
  const { values, update } = useSettings();
  const router = useRouter();
  const people = (n: number) => (n ? String(n) : 'None');
  return (
    <Screen edges={[]}>
      <Card>
        <AppText variant="callout" tone="secondary">Account</AppText>
        <AppText variant="headline" testID="account-name">{user?.name ?? 'Signed in'}</AppText>
        <AppText tone="secondary" testID="account-email">{user?.email ?? ''}</AppText>
      </Card>

      <Group title="AI answers" note={NOT_USED}>
        <Choice label="Explanation style" value={values.explainLevel} onChange={(v) => update({ explainLevel: v }, 'Explanation style saved.')}
          options={[{ value: 'clinical', label: 'Clinical' }, { value: 'simple', label: 'Simple' }]} hint="Clinical and professional, or simple and empathetic." />
        <Choice label="Detail" value={values.outputDepth} onChange={(v) => update({ outputDepth: v }, 'Detail saved.')}
          options={[{ value: 'concise', label: 'Concise' }, { value: 'comprehensive', label: 'Deep dive' }]} hint="Short summaries, or the comprehensive version." />
      </Group>

      <Group title="Language and units" note={`${NOT_USED} The app itself is in English for now.`}>
        <NavRow testID="language-row" label="AI output language" value={LANGUAGES.find((l) => l.code === values.language)?.label ?? 'English'} onPress={() => router.push('/settings/language')} />
        <Choice label="Units" value={values.measurement} onChange={(v) => update({ measurement: v }, 'Units saved.')}
          options={[{ value: 'metric', label: 'Metric' }, { value: 'imperial', label: 'Imperial' }]} hint={UNITS[values.measurement]} />
      </Group>

      <Group title="Accessibility">
        <SwitchRow testID="switch-contrast" label="High contrast" hint="Stronger borders and text for easier reading." value={values.highContrast}
          onChange={(v) => update({ highContrast: v }, v ? 'High contrast on.' : 'High contrast off.')} />
        <SwitchRow testID="switch-large-text" label="Large clinical text" hint="Bigger text in answers, lab values and reports." value={values.largeText}
          onChange={(v) => update({ largeText: v }, v ? 'Large clinical text on.' : 'Large clinical text off.')} />
      </Group>

      <Group title="Emergency">
        <SwitchRow testID="switch-emergency" label="Emergency prompt" hint="When a result is marked EMERGENCY, show buttons to call emergency services and your contacts. The app never calls or texts for you." value={values.autoAlertsEnabled}
          onChange={(v) => update({ autoAlertsEnabled: v }, v ? 'Emergency prompt on.' : 'Emergency prompt off.')} />
        <NavRow testID="contacts-row" label="Emergency contacts" value={people(values.emergencyContacts.length)} onPress={() => router.push('/settings/contacts')} />
      </Group>

      <Group title="People">
        <NavRow testID="dependents-row" label="Family members" value={people(values.dependents.length)} onPress={() => router.push('/settings/dependents')} />
      </Group>

      <Group title="About">
        <NavRow testID="loaders-row" label="Loading animations" value="20" onPress={() => router.push('/settings/loaders')} />
      </Group>

      <Button title="Sign out" variant="danger" testID="sign-out-button" onPress={signOut} />
    </Screen>
  );
}
