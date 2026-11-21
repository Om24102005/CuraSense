import { useState } from 'react';
import { View } from 'react-native';
import { dependentProblem, newId, type Dependent } from '@curasense/shared/settings';
import { success } from '../../../src/haptics';
import { useSettings } from '../../../src/settings/SettingsContext';
import { AppText } from '../../../src/ui/AppText';
import { Banner } from '../../../src/ui/Banner';
import { Button } from '../../../src/ui/Button';
import { Card } from '../../../src/ui/Card';
import { Screen } from '../../../src/ui/Screen';
import { Segmented } from '../../../src/ui/Segmented';
import { TextField } from '../../../src/ui/TextField';

const SEX: Record<Dependent['sex'], string> = { male: 'Male', female: 'Female', other: 'Other', prefer_not: 'No answer' };

export default function Dependents() {
  const { values, update } = useSettings();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState<Dependent['sex']>('prefer_not');
  const [allergies, setAllergies] = useState('');
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);

  const add = async () => {
    const problem = dependentProblem({ name, dob });
    setError(problem);
    if (problem) return;
    const saved = await update({ dependents: [...values.dependents, { id: newId(), name: name.trim(), dob, sex, allergies: allergies.trim() }] }, 'Family member saved.');
    if (saved) { success(); setName(''); setDob(''); setSex('prefer_not'); setAllergies(''); }
  };
  const remove = async (id: string) => {
    setRemoving(null);
    await update({ dependents: values.dependents.filter((d) => d.id !== id) }, 'Family member removed.');
  };

  return (
    <Screen edges={[]}>
      <AppText variant="callout" tone="secondary">People you manage health records for, such as children or parents.</AppText>

      {values.dependents.map((d) => (
        <Card key={d.id} testID={`dependent-${d.id}`} style={{ gap: 4 }}>
          <AppText variant="headline">{d.name}</AppText>
          <AppText variant="caption" tone="muted">{[d.dob ? `Born ${d.dob}` : '', SEX[d.sex] ?? ''].filter(Boolean).join(' · ')}</AppText>
          {d.allergies ? <AppText variant="callout" tone="secondary">Allergies: {d.allergies}</AppText> : null}
          {removing === d.id ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
              <Button title="Keep" variant="secondary" style={{ flexGrow: 1, flexBasis: 130 }} onPress={() => setRemoving(null)} />
              <Button title="Remove" variant="danger" testID="confirm-remove" style={{ flexGrow: 1, flexBasis: 130 }} onPress={() => remove(d.id)} />
            </View>
          ) : <Button title="Remove" variant="link" testID={`remove-${d.id}`} accessibilityLabel={`Remove ${d.name}`} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} onPress={() => setRemoving(d.id)} />}
        </Card>
      ))}
      {!values.dependents.length ? <AppText tone="muted" testID="dependents-empty">No family members yet.</AppText> : null}

      <Card style={{ gap: 14 }}>
        <AppText variant="headline" accessibilityRole="header">Add a family member</AppText>
        <TextField label="Name" testID="dep-name" value={name} onChangeText={setName} maxLength={80} autoCapitalize="words" />
        <TextField label="Date of birth (optional)" testID="dep-dob" value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" maxLength={10} keyboardType="numbers-and-punctuation" autoCorrect={false} />
        <View style={{ gap: 6 }}>
          <AppText variant="callout" tone="secondary">Sex</AppText>
          <Segmented value={sex} onChange={setSex} options={(Object.keys(SEX) as Dependent['sex'][]).map((value) => ({ value, label: SEX[value] }))} />
        </View>
        <TextField label="Allergies (optional)" testID="dep-allergies" value={allergies} onChangeText={setAllergies} maxLength={300} multiline style={{ minHeight: 64, textAlignVertical: 'top' }} />
        {error ? <Banner tone="error" testID="form-error">{error}</Banner> : null}
        <Button title="Add family member" testID="dep-add" onPress={add} />
      </Card>
    </Screen>
  );
}
