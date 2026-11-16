import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { fmtDate, type ContactInfo } from '@curasense/shared/booking';
import { birthDateProblem } from '@curasense/shared/settings';
import { useBookings } from '../../../src/book/BookingsContext';
import { DemoNotice, DoctorAvatar, ModeChip } from '../../../src/book/parts';
import { useTheme } from '../../../src/theme';
import { AppText } from '../../../src/ui/AppText';
import { Banner } from '../../../src/ui/Banner';
import { Button } from '../../../src/ui/Button';
import { Card } from '../../../src/ui/Card';
import { Screen } from '../../../src/ui/Screen';
import { TextField } from '../../../src/ui/TextField';
import { radius } from '../../../src/ui/tokens';

const FIELDS: { key: keyof ContactInfo; label: string; placeholder: string }[] = [
  { key: 'name', label: 'Full name', placeholder: 'Your full name' },
  { key: 'phone', label: 'Phone', placeholder: '+91 00000 00000' },
  { key: 'dob', label: 'Date of birth (YYYY-MM-DD)', placeholder: 'YYYY-MM-DD' },
  { key: 'notes', label: 'Medical notes', placeholder: 'Allergies, conditions...' },
];

function YourInformation() {
  const { contact, saveContact } = useBookings();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(contact);
  const [error, setError] = useState('');
  const show = (k: keyof ContactInfo) => (k === 'dob' && contact.dob ? new Date(`${contact.dob}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : contact[k]) || '—';
  const save = () => {
    const problem = birthDateProblem(draft.dob.trim());
    setError(problem);
    if (problem) return;
    saveContact({ name: draft.name.trim(), phone: draft.phone.trim(), dob: draft.dob.trim(), notes: draft.notes.trim() });
    setEditing(false);
  };
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AppText variant="headline" accessibilityRole="header" style={{ flex: 1 }}>Your information</AppText>
        {editing ? (
          <>
            <Button title="Cancel" variant="link" testID="contact-cancel" onPress={() => { setEditing(false); setError(''); }} />
            <Button title="Save" variant="link" testID="contact-save" onPress={save} />
          </>
        ) : <Button title="Edit" variant="link" testID="contact-edit" onPress={() => { setDraft(contact); setEditing(true); }} />}
      </View>
      {editing ? (
        <>
          {FIELDS.map((f) => (
            <TextField key={f.key} label={f.label} testID={`contact-${f.key}`} value={draft[f.key]} placeholder={f.placeholder} maxLength={f.key === 'notes' ? 300 : 80} multiline={f.key === 'notes'}
              keyboardType={f.key === 'phone' ? 'phone-pad' : 'default'} autoCapitalize={f.key === 'name' ? 'words' : 'none'} autoCorrect={false}
              style={f.key === 'notes' ? { minHeight: 64, textAlignVertical: 'top' } : undefined} onChangeText={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
          ))}
          {error ? <Banner tone="error" testID="contact-error">{error}</Banner> : null}
        </>
      ) : FIELDS.map((f) => (
        <View key={f.key} style={{ gap: 1 }}>
          <AppText variant="caption" tone="muted">{f.label.replace(' (YYYY-MM-DD)', '')}</AppText>
          <AppText testID={`contact-value-${f.key}`}>{show(f.key)}</AppText>
        </View>
      ))}
    </Card>
  );
}

export default function MyBookings() {
  const t = useTheme();
  const router = useRouter();
  const { bookings, loaded, startNew } = useBookings();
  const bookAgain = () => { startNew(); router.navigate('/book'); };
  return (
    <Screen edges={[]}>
      <DemoNotice />
      <YourInformation />
      {loaded && !bookings.length ? (
        <View style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}>
          <Ionicons name="calendar-outline" size={40} color={t.textMuted} />
          <AppText tone="muted" testID="no-bookings">No bookings yet</AppText>
          <Button title="Book your first appointment" testID="book-first" onPress={bookAgain} />
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          {bookings.map((b) => (
            <Pressable
              key={b.reference}
              accessibilityRole="button"
              accessibilityLabel={`${b.doctorName}, ${fmtDate(b.date)} at ${b.time}`}
              testID={`booking-${b.reference}`}
              onPress={() => router.push(`/book/${b.reference}`)}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: t.border, backgroundColor: pressed ? t.surface : t.card })}
            >
              <DoctorAvatar initials={b.doctorInitials} color={b.doctorColor} size={42} />
              <View style={{ flex: 1, gap: 2 }}>
                <AppText variant="headline" numberOfLines={1}>{b.doctorName}</AppText>
                <AppText variant="caption" tone="muted" numberOfLines={1}>{b.doctorSpecialty}</AppText>
                <AppText variant="caption" tone="secondary">{fmtDate(b.date)}</AppText>
                <AppText variant="caption" tone="secondary">{b.time}</AppText>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <ModeChip mode={b.mode} />
                <AppText variant="caption" tone="muted" style={{ fontWeight: '700' }}>DEMO</AppText>
              </View>
            </Pressable>
          ))}
          {bookings.length ? <Button title="New booking" variant="secondary" testID="new-booking" onPress={bookAgain} /> : null}
        </View>
      )}
    </Screen>
  );
}
