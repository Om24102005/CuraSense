// The consultation booking flow's data and rules. Ported from the website's ConsultationBooking (which keeps its own copy).
// There is no booking backend: the doctors are sample data, the free slots are invented, and bookings are kept on the device.
// Self-contained: no imports, so Node can run its tests.

export interface Doctor {
  id: string; name: string; specialty: string; rating: number; reviews: number; location: string;
  available: boolean; initials: string; color: string; experience: string; fee: number;
}

export const DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Chen', specialty: 'Internal Medicine', rating: 4.9, reviews: 312, location: 'Apollo Hospital, New Delhi', available: true, initials: 'SC', color: '#0ea5e9', experience: '14 yrs', fee: 800 },
  { id: 'd2', name: 'Dr. Raj Patel', specialty: 'Cardiology', rating: 4.8, reviews: 287, location: 'Max Healthcare, Mumbai', available: true, initials: 'RP', color: '#8b5cf6', experience: '18 yrs', fee: 1200 },
  { id: 'd3', name: 'Dr. Priya Sharma', specialty: 'Neurology', rating: 4.7, reviews: 195, location: 'Fortis Hospital, Bangalore', available: true, initials: 'PS', color: '#ec4899', experience: '11 yrs', fee: 1000 },
  { id: 'd4', name: 'Dr. Amir Hassan', specialty: 'Pulmonology', rating: 4.9, reviews: 421, location: 'AIIMS, New Delhi', available: true, initials: 'AH', color: '#10b981', experience: '22 yrs', fee: 1500 },
  { id: 'd5', name: 'Dr. Meera Nair', specialty: 'Oncology', rating: 4.6, reviews: 163, location: 'Tata Memorial, Mumbai', available: false, initials: 'MN', color: '#f59e0b', experience: '9 yrs', fee: 1800 },
  { id: 'd6', name: 'Dr. James Wright', specialty: 'Orthopedics', rating: 4.8, reviews: 344, location: 'Medanta, Gurugram', available: true, initials: 'JW', color: '#6366f1', experience: '16 yrs', fee: 900 },
];

export const TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];
export const STEP_LABELS = ['Diagnosis', 'Doctor', 'Mode', 'Schedule', 'Review'];

export type ConsultMode = 'online' | 'offline';

export interface StoredBooking {
  reference: string; doctorId: string; doctorName: string; doctorSpecialty: string; doctorColor: string; doctorInitials: string; doctorFee: number;
  mode: ConsultMode; date: string; time: string;
  diagnosisId: string | null; diagnosisLabel: string | null; diagnosisType: string | null;
  createdAt: string;
}

export interface ContactInfo { name: string; phone: string; dob: string; notes: string }

const pad = (n: number) => String(n).padStart(2, '0');
/** The device's calendar day as YYYY-MM-DD. (The website used the UTC day, which is the wrong day for the first hours of the morning east of Greenwich.) */
export const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export interface DateTile { iso: string; day: string; num: string; mon: string }
/** The next 14 days, starting tomorrow. */
export function buildDates(now = new Date()): DateTile[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i + 1);
    return { iso: isoOf(d), day: d.toLocaleDateString('en-US', { weekday: 'short' }), num: String(d.getDate()), mon: d.toLocaleDateString('en-US', { month: 'short' }) };
  });
}

/** Which slots show as taken on a date. Invented from the date, the same way every time: there is no real calendar. */
export function getBookedSlots(iso: string): Set<string> {
  const seed = iso.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return new Set(TIME_SLOTS.filter((_, i) => (seed + i * 7) % 5 === 0));
}

export const genRef = () => `CS-${Date.now().toString(36).toUpperCase().slice(-4)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const fmtDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export interface Draft { doctor: Doctor | null; mode: ConsultMode | null; date: string; time: string }
/** Whether step 2, 3 or 4 has what it needs (steps 1 and 5 always can move on). */
export function canAdvance(step: number, d: Draft): boolean {
  if (step === 2) return d.doctor !== null;
  if (step === 3) return d.mode !== null;
  if (step === 4) return d.date !== '' && d.time !== '';
  return true;
}

export function makeBooking(d: { doctor: Doctor; mode: ConsultMode; date: string; time: string }, diagnosis: { id: string; diagnosis: string; type: string } | null, now = new Date()): StoredBooking {
  return {
    reference: genRef(), doctorId: d.doctor.id, doctorName: d.doctor.name, doctorSpecialty: d.doctor.specialty, doctorColor: d.doctor.color,
    doctorInitials: d.doctor.initials, doctorFee: d.doctor.fee, mode: d.mode, date: d.date, time: d.time,
    diagnosisId: diagnosis?.id ?? null, diagnosisLabel: diagnosis?.diagnosis ?? null, diagnosisType: diagnosis?.type ?? null, createdAt: now.toISOString(),
  };
}

/** The saved bookings from storage; anything that is not a booking is dropped, so one bad entry cannot break the list. */
export function parseBookings(raw: string | null | undefined): StoredBooking[] {
  try {
    const list = JSON.parse(raw ?? '[]');
    if (!Array.isArray(list)) return [];
    return list.filter((b) => b && typeof b.reference === 'string' && typeof b.doctorId === 'string' && typeof b.date === 'string' && typeof b.time === 'string' && (b.mode === 'online' || b.mode === 'offline'));
  } catch { return []; }
}

export function parseContact(raw: string | null | undefined, name = ''): ContactInfo {
  const empty = { name, phone: '', dob: '', notes: '' };
  try {
    const c = JSON.parse(raw ?? 'null');
    return c && typeof c === 'object' ? { name: String(c.name ?? ''), phone: String(c.phone ?? ''), dob: String(c.dob ?? ''), notes: String(c.notes ?? '') } : empty;
  } catch { return empty; }
}
