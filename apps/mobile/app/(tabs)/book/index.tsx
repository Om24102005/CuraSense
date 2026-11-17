import { useEffect, useMemo, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '../../../src/ui/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DOCTORS, TIME_SLOTS, buildDates, canAdvance, fmtDate, getBookedSlots, makeBooking, type ConsultMode, type Doctor, type StoredBooking } from '@curasense/shared/booking';
import { TYPE_COLORS, TYPE_LABELS, type Prediction } from '@curasense/shared/history';
import { Chip } from '../../../src/analyze/ResultView';
import { useBookings } from '../../../src/book/BookingsContext';
import { Choice, DemoNotice, DiagnosisSummary, DoctorAvatar, ModeChip, StepProgress, Stars, useModeColor } from '../../../src/book/parts';
import { success, tick } from '../../../src/haptics';
import { usePredictions } from '../../../src/history/PredictionsContext';
import { TypeBadge, TypeIcon } from '../../../src/history/parts';
import { useTheme } from '../../../src/theme';
import { AppText } from '../../../src/ui/AppText';
import { Button } from '../../../src/ui/Button';
import { Card } from '../../../src/ui/Card';
import { radius } from '../../../src/ui/tokens';

const Heading = ({ title, sub }: { title: string; sub: string }) => (
  <View style={{ gap: 4, marginBottom: 4 }}>
    <AppText variant="title" accessibilityRole="header">{title}</AppText>
    <AppText variant="callout" tone="secondary">{sub}</AppText>
  </View>
);
// A trailing chip, fee or tick drops below the text instead of squeezing it when the text is large.
const Row = ({ children, gap = 10 }: { children: ReactNode; gap?: number }) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap }}>{children}</View>;

function Tick() {
  return <Ionicons name="checkmark-circle" size={22} color={useTheme().accent} />;
}

function StepDiagnosis({ items, value, onChange }: { items: Prediction[]; value: Prediction | null; onChange: (p: Prediction | null) => void }) {
  const t = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <Heading title="Attach an AI diagnosis" sub="Pick an earlier analysis to share with your doctor, or skip." />
      <Choice testID="diag-none" selected={value === null} label="No diagnosis attached" onPress={() => onChange(null)}>
        <Row gap={12}>
          <Ionicons name="close-circle-outline" size={28} color={t.textMuted} />
          <View style={{ flex: 1, minWidth: 130 }}>
            <AppText variant="headline">No diagnosis attached</AppText>
            <AppText variant="caption" tone="muted">I will describe my symptoms during the consultation</AppText>
          </View>
          {value === null ? <Tick /> : null}
        </Row>
      </Choice>
      {items.length === 0 ? <AppText tone="muted" testID="no-analyses">No analyses yet. Run an analysis first to attach a diagnosis.</AppText> : items.map((p) => {
        const selected = value?.id === p.id;
        return (
          <View key={p.id}>
            <Choice testID={`diag-${p.id}`} selected={selected} color={TYPE_COLORS[p.type]} label={`${TYPE_LABELS[p.type]}: ${p.diagnosis}`} onPress={() => onChange(p)}>
              <Row gap={12}>
                <TypeIcon type={p.type} size={38} />
                <View style={{ flex: 1, minWidth: 130, gap: 3 }}>
                  <TypeBadge type={p.type} />
                  <AppText variant="headline" numberOfLines={2}>{p.diagnosis}</AppText>
                  <AppText variant="caption" tone="muted">{p.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</AppText>
                </View>
                {selected ? <Tick /> : null}
              </Row>
            </Choice>
            {selected ? <DiagnosisSummary p={p} /> : null}
          </View>
        );
      })}
    </View>
  );
}

function StepDoctor({ value, onChange }: { value: Doctor | null; onChange: (d: Doctor) => void }) {
  const t = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <Heading title="Choose your doctor" sub="Select a specialist for your consultation." />
      {DOCTORS.map((doc) => (
        <Choice key={doc.id} testID={`doctor-${doc.id}`} selected={value?.id === doc.id} disabled={!doc.available} color={doc.color} label={`${doc.name}, ${doc.specialty}, rated ${doc.rating}, ${doc.fee} rupees${doc.available ? '' : ', unavailable'}`} onPress={() => onChange(doc)}>
          <View style={{ gap: 8 }}>
            <Row gap={12}>
              <DoctorAvatar initials={doc.initials} color={doc.color} />
              <View style={{ flex: 1, minWidth: 130 }}>
                <AppText variant="headline">{doc.name}</AppText>
                <AppText variant="caption" tone="muted">{doc.specialty}</AppText>
              </View>
              {!doc.available ? <Chip text="UNAVAILABLE" color={t.error} /> : value?.id === doc.id ? <Tick /> : null}
            </Row>
            <Row gap={6}><Stars rating={doc.rating} /><AppText variant="caption" style={{ fontWeight: '800' }}>{doc.rating}</AppText><AppText variant="caption" tone="muted">({doc.reviews})</AppText></Row>
            <Row gap={6}><Ionicons name="location-outline" size={14} color={t.textMuted} /><AppText variant="caption" tone="muted" style={{ flex: 1 }}>{doc.location}</AppText></Row>
            <Row><AppText variant="caption" tone="muted" style={{ flex: 1 }}>{doc.experience} experience</AppText><AppText variant="headline">₹{doc.fee}</AppText></Row>
          </View>
        </Choice>
      ))}
    </View>
  );
}

function ModeCard({ mode, value, onChange, doctor }: { mode: ConsultMode; value: ConsultMode | null; onChange: (m: ConsultMode) => void; doctor: Doctor | null }) {
  const color = useModeColor(mode);
  const online = mode === 'online';
  return (
    <Choice testID={`mode-${mode}`} selected={value === mode} color={color} label={online ? 'Online. Video call from anywhere' : `In-clinic. Visit the doctor in person${doctor ? ` at ${doctor.location}` : ''}`} onPress={() => onChange(mode)}>
      <View style={{ alignItems: 'center', gap: 6, paddingVertical: 14 }}>
        <Ionicons name={online ? 'videocam-outline' : 'business-outline'} size={34} color={color} />
        <AppText variant="headline">{online ? 'Online' : 'In-clinic'}</AppText>
        <AppText variant="callout" tone="secondary">{online ? 'Video call from anywhere' : 'Visit the doctor in person'}</AppText>
        {!online && doctor ? <AppText variant="caption" tone="muted">{doctor.location}</AppText> : null}
      </View>
    </Choice>
  );
}

function StepMode({ doctor, value, onChange }: { doctor: Doctor | null; value: ConsultMode | null; onChange: (m: ConsultMode) => void }) {
  return (
    <View style={{ gap: 10 }}>
      <Heading title="Consultation type" sub={`How would you like to meet ${doctor?.name.split(' ').slice(0, 2).join(' ') ?? 'the doctor'}?`} />
      <ModeCard mode="online" value={value} onChange={onChange} doctor={doctor} />
      <ModeCard mode="offline" value={value} onChange={onChange} doctor={doctor} />
    </View>
  );
}

function StepSchedule({ date, time, onDate, onTime }: { date: string; time: string; onDate: (iso: string) => void; onTime: (slot: string) => void }) {
  const t = useTheme();
  const dates = useMemo(() => buildDates(), []);
  const booked = date ? getBookedSlots(date) : new Set<string>();
  const label = { letterSpacing: 1.2, fontWeight: '800', textTransform: 'uppercase' } as const;
  return (
    <View style={{ gap: 12 }}>
      <Heading title="Schedule appointment" sub="Pick a date, then an available time slot." />
      <AppText variant="caption" tone="muted" style={label}>Select date</AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {dates.map((d) => {
          const selected = date === d.iso;
          return (
            <Pressable
              key={d.iso}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${d.day} ${d.num} ${d.mon}`}
              testID={`date-${d.iso}`}
              onPress={() => { tick(); onDate(d.iso); }}
              style={{ minWidth: 58, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', borderRadius: radius.md, borderWidth: selected ? 2 : 1, borderColor: selected ? t.accent : t.border, backgroundColor: selected ? `${t.primary}29` : t.card }}
            >
              <AppText variant="caption" tone="muted" style={{ fontWeight: '700' }}>{d.day}</AppText>
              <AppText variant="headline">{d.num}</AppText>
              <AppText variant="caption" tone="muted">{d.mon}</AppText>
            </Pressable>
          );
        })}
      </ScrollView>
      {date ? (
        <View style={{ gap: 10 }}>
          <AppText variant="caption" tone="muted" style={label}>Available slots</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {TIME_SLOTS.map((slot, i) => {
              const taken = booked.has(slot);
              const selected = time === slot;
              return (
                <Pressable
                  key={slot}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: taken }}
                  accessibilityLabel={taken ? `${slot}, taken` : slot}
                  testID={`slot-${i}`}
                  disabled={taken}
                  onPress={() => { tick(); onTime(slot); }}
                  style={{ width: '31.5%', minHeight: 46, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: selected ? 2 : 1, borderColor: selected ? t.accent : t.border, backgroundColor: selected ? `${t.primary}29` : t.card, opacity: taken ? 0.4 : 1 }}
                >
                  <AppText variant="callout" style={{ fontWeight: '700', textDecorationLine: taken ? 'line-through' : 'none', color: selected ? t.accent : taken ? t.textMuted : t.text }}>{slot}</AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function StepReview({ doctor, mode, date, time, diagnosis }: { doctor: Doctor; mode: ConsultMode; date: string; time: string; diagnosis: Prediction | null }) {
  const t = useTheme();
  const modeColor = useModeColor(mode);
  return (
    <View style={{ gap: 10 }} testID="review">
      <Heading title="Review your booking" sub="Check the details before saving." />
      <Card>
        <Row gap={12}>
          <DoctorAvatar initials={doctor.initials} color={doctor.color} size={42} />
          <View style={{ flex: 1, minWidth: 130 }}>
            <AppText variant="headline">{doctor.name}</AppText>
            <AppText variant="caption" tone="muted">{doctor.specialty}</AppText>
            <AppText variant="caption" tone="muted">{doctor.location}</AppText>
          </View>
          <AppText variant="headline">₹{doctor.fee}</AppText>
        </Row>
      </Card>
      <Card>
        <Row gap={12}>
          <Ionicons name={mode === 'online' ? 'videocam-outline' : 'business-outline'} size={24} color={modeColor} />
          <View style={{ flex: 1, minWidth: 130 }}>
            <AppText variant="headline">{mode === 'online' ? 'Online consultation' : 'In-clinic visit'}</AppText>
            <AppText variant="caption" tone="muted">{mode === 'online' ? 'Video call' : doctor.location}</AppText>
          </View>
          <ModeChip mode={mode} />
        </Row>
      </Card>
      <Card>
        <Row gap={12}>
          <Ionicons name="calendar-outline" size={24} color={t.accent} />
          <View style={{ flex: 1, minWidth: 130 }}>
            <AppText variant="headline">{fmtDate(date)}</AppText>
            <AppText variant="caption" tone="muted">{time}</AppText>
          </View>
        </Row>
      </Card>
      {diagnosis ? (
        <View>
          <Card>
            <Row gap={12}>
              <TypeIcon type={diagnosis.type} size={38} />
              <View style={{ flex: 1, minWidth: 130 }}>
                <AppText variant="caption" tone="muted">Attached diagnosis</AppText>
                <AppText variant="headline">{diagnosis.diagnosis}</AppText>
              </View>
            </Row>
          </Card>
          <DiagnosisSummary p={diagnosis} />
        </View>
      ) : <Card><Row gap={12}><Ionicons name="close-circle-outline" size={24} color={t.textMuted} /><AppText tone="muted">No diagnosis attached</AppText></Row></Card>}
      <AppText variant="caption" tone="muted">Saving adds this to My bookings on this phone. Nothing is sent to anyone.</AppText>
    </View>
  );
}

function Saved({ booking, onView, onAnother }: { booking: StoredBooking; onView: () => void; onAnother: () => void }) {
  const t = useTheme();
  return (
    <View testID="booking-saved" style={{ alignItems: 'center', gap: 14, paddingTop: 12 }}>
      <Ionicons name="checkmark-circle" size={76} color={t.success} />
      <AppText variant="title" accessibilityRole="header">Booking saved</AppText>
      <Chip text={`REF ${booking.reference}`} color={t.accent} />
      <AppText tone="secondary" style={{ textAlign: 'center' }} testID="saved-text">
        Your demo appointment with <Text style={{ fontWeight: '700', color: t.text }}>{booking.doctorName}</Text> on <Text style={{ fontWeight: '700', color: t.text }}>{fmtDate(booking.date)}</Text> at <Text style={{ fontWeight: '700', color: t.text }}>{booking.time}</Text> is saved on this phone. No email was sent, and no doctor or hospital has been told.
      </AppText>
      <View style={{ alignSelf: 'stretch', gap: 10 }}>
        <Button title="View booking" testID="view-booking" onPress={onView} />
        <Button title="Book another" variant="secondary" testID="book-another" onPress={onAnother} />
      </View>
    </View>
  );
}

export default function Book() {
  const t = useTheme();
  const router = useRouter();
  const { items } = usePredictions();
  const { add, fresh } = useBookings();
  const [step, setStep] = useState(1);
  const [diagnosis, setDiagnosis] = useState<Prediction | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [mode, setMode] = useState<ConsultMode | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [saved, setSaved] = useState<StoredBooking | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  const reset = () => { setStep(1); setDiagnosis(null); setDoctor(null); setMode(null); setDate(''); setTime(''); setSaved(null); };
  useEffect(reset, [fresh]);
  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }); }, [step, saved]);

  const ready = canAdvance(step, { doctor, mode, date, time });
  const save = () => {
    if (!doctor || !mode || !date || !time) return;
    const booking = makeBooking({ doctor, mode, date, time }, diagnosis ? { id: diagnosis.id, diagnosis: diagnosis.diagnosis, type: diagnosis.type } : null);
    add(booking);
    setSaved(booking);
    success();
  };

  return (
    <SafeAreaView edges={[]} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: 28, gap: 18 }}>
        <View style={{ width: '100%', maxWidth: 480, alignSelf: 'center', gap: 18 }}>
          <DemoNotice />
          {saved ? <Saved booking={saved} onView={() => router.push(`/book/${saved.reference}`)} onAnother={reset} /> : (
            <>
              <StepProgress step={step} />
              {step === 1 ? <StepDiagnosis items={items} value={diagnosis} onChange={setDiagnosis} /> : null}
              {step === 2 ? <StepDoctor value={doctor} onChange={setDoctor} /> : null}
              {step === 3 ? <StepMode doctor={doctor} value={mode} onChange={setMode} /> : null}
              {step === 4 ? <StepSchedule date={date} time={time} onDate={(iso) => { setDate(iso); setTime(''); }} onTime={setTime} /> : null}
              {step === 5 && doctor && mode && date && time ? <StepReview doctor={doctor} mode={mode} date={date} time={time} diagnosis={diagnosis} /> : null}
            </>
          )}
        </View>
      </ScrollView>
      {saved ? null : (
        <View style={{ flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: t.border, backgroundColor: t.bg }}>
          <Button title="Back" variant="secondary" testID="back-button" disabled={step === 1} style={{ flex: 1 }} onPress={() => setStep((s) => s - 1)} />
          {step < 5
            ? <Button title={step === 1 && !diagnosis ? 'Skip and continue' : 'Continue'} testID="next-button" disabled={!ready} style={{ flex: 2 }} onPress={() => setStep((s) => s + 1)} />
            : <Button title="Save booking" testID="save-booking" style={{ flex: 2 }} onPress={save} />}
        </View>
      )}
    </SafeAreaView>
  );
}
