import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DOCTORS, fmtDate } from '@curasense/shared/booking';
import { TYPE_LABELS, type PredictionType } from '@curasense/shared/history';
import { useBookings } from '../../../src/book/BookingsContext';
import { DemoNotice, DiagnosisSummary, DoctorAvatar, Fact, ModeChip } from '../../../src/book/parts';
import { usePredictions } from '../../../src/history/PredictionsContext';
import { TypeBadge } from '../../../src/history/parts';
import { AppText } from '../../../src/ui/AppText';
import { Button } from '../../../src/ui/Button';
import { Card } from '../../../src/ui/Card';
import { Screen } from '../../../src/ui/Screen';

export default function BookingDetail() {
  const router = useRouter();
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const { bookings, loaded, cancel } = useBookings();
  const { items } = usePredictions();
  const [confirming, setConfirming] = useState(false);
  const b = bookings.find((x) => x.reference === ref);

  if (!b) {
    return loaded ? (
      <Screen edges={[]}>
        <View style={{ gap: 14, alignItems: 'center', paddingVertical: 40 }}>
          <AppText tone="muted" testID="not-found">This booking could not be found.</AppText>
          <Button title="My bookings" variant="secondary" onPress={() => router.replace('/book/mine')} />
        </View>
      </Screen>
    ) : <Screen edges={[]}><View /></Screen>;
  }

  const doctor = DOCTORS.find((d) => d.id === b.doctorId);
  const attached = b.diagnosisId ? items.find((p) => p.id === b.diagnosisId) ?? null : null;
  const doCancel = () => { cancel(b.reference); if (router.canGoBack()) router.back(); else router.replace('/book/mine'); };

  return (
    <Screen edges={[]}>
      <DemoNotice />
      <View testID="booking-detail" style={{ gap: 16 }}>
        <View style={{ gap: 6 }}>
          <AppText variant="title" accessibilityRole="header">Your booking</AppText>
          <AppText variant="caption" tone="muted" style={{ fontWeight: '800', letterSpacing: 1 }}>SAVED ON THIS PHONE · {b.reference}</AppText>
        </View>

        <Card style={{ gap: 12 }}>
          <Fact icon="medkit-outline" label="Doctor">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <DoctorAvatar initials={b.doctorInitials} color={b.doctorColor} />
              <View style={{ flex: 1 }}>
                <AppText variant="headline">{b.doctorName}</AppText>
                <AppText variant="caption" tone="muted">{b.doctorSpecialty}</AppText>
                {doctor ? <AppText variant="caption" tone="muted">{doctor.location}</AppText> : null}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <AppText variant="headline">₹{b.doctorFee}</AppText>
                <AppText variant="caption" tone="muted">consultation fee</AppText>
              </View>
            </View>
          </Fact>
        </Card>

        <Card style={{ gap: 14 }}>
          <Fact icon="calendar-outline" label="Date"><AppText variant="headline">{fmtDate(b.date)}</AppText></Fact>
          <Fact icon="time-outline" label="Time"><AppText variant="headline">{b.time}</AppText></Fact>
          <Fact icon={b.mode === 'online' ? 'videocam-outline' : 'business-outline'} label="Mode">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <AppText variant="headline" style={{ flex: 1 }}>{b.mode === 'online' ? 'Online video consultation' : 'In-clinic visit'}</AppText>
              <ModeChip mode={b.mode} />
            </View>
            {b.mode === 'offline' && doctor ? <AppText variant="caption" tone="muted">{doctor.location}</AppText> : null}
          </Fact>
        </Card>

        {b.diagnosisLabel ? (
          <Card style={{ gap: 8 }}>
            <Fact icon="pulse-outline" label="Attached AI diagnosis">
              {b.diagnosisType && b.diagnosisType in TYPE_LABELS ? <TypeBadge type={b.diagnosisType as PredictionType} /> : null}
              <AppText variant="headline">{b.diagnosisLabel}</AppText>
            </Fact>
            {attached ? <DiagnosisSummary p={attached} /> : null}
          </Card>
        ) : null}

        <AppText variant="caption" tone="muted">Booked {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. This is a demonstration, not a real medical appointment. No email was sent and no doctor or hospital has been told. Always consult a licensed healthcare provider.</AppText>

        {confirming ? (
          <Card style={{ gap: 10 }}>
            <AppText variant="headline">Cancel this appointment?</AppText>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Keep" variant="secondary" testID="keep-booking" style={{ flex: 1 }} onPress={() => setConfirming(false)} />
              <Button title="Yes, cancel" variant="danger" testID="confirm-cancel" style={{ flex: 1 }} onPress={doCancel} />
            </View>
          </Card>
        ) : <Button title="Cancel appointment" variant="danger" testID="cancel-booking" onPress={() => setConfirming(true)} />}
      </View>
    </Screen>
  );
}
