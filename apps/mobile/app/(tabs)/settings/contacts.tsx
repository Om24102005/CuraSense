import { useState } from 'react';
import { Linking, View } from 'react-native';
import { contactProblem, emergencyNumberProblem, newId, telUrl } from '@curasense/shared/settings';
import { useSettings } from '../../../src/settings/SettingsContext';
import { AppText } from '../../../src/ui/AppText';
import { Banner } from '../../../src/ui/Banner';
import { Button } from '../../../src/ui/Button';
import { Card } from '../../../src/ui/Card';
import { Screen } from '../../../src/ui/Screen';
import { TextField } from '../../../src/ui/TextField';

export default function Contacts() {
  const { values, update } = useSettings();
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const [number, setNumber] = useState(values.emergencyNumber);
  const [numberError, setNumberError] = useState('');

  const add = async () => {
    const problem = contactProblem({ name, phone });
    setError(problem);
    if (problem) return;
    const saved = await update({ emergencyContacts: [...values.emergencyContacts, { id: newId(), name: name.trim(), relation: relation.trim(), phone: phone.trim() }] }, 'Emergency contact saved.');
    if (saved) { setName(''); setRelation(''); setPhone(''); }
  };
  const remove = async (id: string) => {
    setRemoving(null);
    await update({ emergencyContacts: values.emergencyContacts.filter((c) => c.id !== id) }, 'Contact removed.');
  };
  const saveNumber = async () => {
    const problem = emergencyNumberProblem(number);
    setNumberError(problem);
    if (!problem) await update({ emergencyNumber: number.trim() }, 'Emergency number saved.');
  };
  const call = (number: string) => Linking.openURL(telUrl(number)).catch(() => setError('This device cannot place calls.'));

  return (
    <Screen edges={[]}>
      <AppText variant="callout" tone="secondary">People to reach in an emergency. CuraSense never calls or texts for you: with the Emergency prompt on (in Settings), a result marked EMERGENCY shows Call and Message buttons, and you tap them.</AppText>

      <Card style={{ gap: 12 }}>
        <AppText variant="headline" accessibilityRole="header">Emergency services number</AppText>
        <AppText variant="caption" tone="muted">The Call emergency services button dials this. 112 works from mobile phones in most countries; use your local number if you prefer. It is kept on this phone only.</AppText>
        <TextField label="Number" testID="emergency-number" value={number} onChangeText={setNumber} keyboardType="phone-pad" maxLength={6} autoCorrect={false} />
        {numberError ? <Banner tone="error" testID="number-error">{numberError}</Banner> : null}
        <Button title="Save number" variant="secondary" testID="save-number" onPress={saveNumber} />
      </Card>

      {values.emergencyContacts.map((c) => (
        <Card key={c.id} testID={`contact-${c.id}`} style={{ gap: 4 }}>
          <AppText variant="headline">{c.name}</AppText>
          <AppText variant="callout" tone="secondary">{[c.relation, c.phone].filter(Boolean).join(' · ')}</AppText>
          {removing === c.id ? (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <Button title="Keep" variant="secondary" style={{ flex: 1 }} onPress={() => setRemoving(null)} />
              <Button title="Remove" variant="danger" testID="confirm-remove" style={{ flex: 1 }} onPress={() => remove(c.id)} />
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <Button title={`Call ${c.name}`} variant="secondary" testID={`call-${c.id}`} style={{ flex: 1 }} onPress={() => call(c.phone)} />
              <Button title="Remove" variant="link" testID={`remove-${c.id}`} accessibilityLabel={`Remove ${c.name}`} onPress={() => setRemoving(c.id)} />
            </View>
          )}
        </Card>
      ))}
      {!values.emergencyContacts.length ? <AppText tone="muted" testID="contacts-empty">No emergency contacts yet.</AppText> : null}

      <Card style={{ gap: 14 }}>
        <AppText variant="headline" accessibilityRole="header">Add an emergency contact</AppText>
        <TextField label="Name" testID="contact-name" value={name} onChangeText={setName} maxLength={80} autoCapitalize="words" />
        <TextField label="Relationship (optional)" testID="contact-relation" value={relation} onChangeText={setRelation} maxLength={40} autoCapitalize="words" />
        <TextField label="Phone number" testID="contact-phone" value={phone} onChangeText={setPhone} maxLength={24} keyboardType="phone-pad" autoCorrect={false} />
        {error ? <Banner tone="error" testID="form-error">{error}</Banner> : null}
        <Button title="Add contact" testID="contact-add" onPress={add} />
      </Card>
    </Screen>
  );
}
