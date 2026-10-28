

import { useState, useRef, useEffect, type CSSProperties, type ReactNode } from 'react';
import {
  Video, Building2, Star, Check, ChevronLeft, ChevronRight,
  Calendar, Clock, Mail, Stethoscope, Activity, FileText,
  MapPin, AlertTriangle, History, X, CalendarCheck, Wifi,
  BadgeCheck, Brain, Phone, Pencil, Save, Trash2, ChevronDown, User,
} from 'lucide-react';
import type { Prediction } from '../../App';
import { useTheme } from '../../App';
import MedicalAIOutput from '../../components/shared/MedicalAIOutput';
import gsap from 'gsap';

// ── Static data ────────────────────────────────────────────────────────────────

interface Doctor {
  id: string; name: string; specialty: string; rating: number;
  reviews: number; location: string; available: boolean;
  initials: string; color: string; experience: string; fee: number;
}

const DOCTORS: Doctor[] = [
  { id:'d1', name:'Dr. Sarah Chen',   specialty:'Internal Medicine', rating:4.9, reviews:312, location:'Apollo Hospital, New Delhi',   available:true,  initials:'SC', color:'#0ea5e9', experience:'14 yrs', fee:800  },
  { id:'d2', name:'Dr. Raj Patel',    specialty:'Cardiology',        rating:4.8, reviews:287, location:'Max Healthcare, Mumbai',       available:true,  initials:'RP', color:'#8b5cf6', experience:'18 yrs', fee:1200 },
  { id:'d3', name:'Dr. Priya Sharma', specialty:'Neurology',         rating:4.7, reviews:195, location:'Fortis Hospital, Bangalore',   available:true,  initials:'PS', color:'#ec4899', experience:'11 yrs', fee:1000 },
  { id:'d4', name:'Dr. Amir Hassan',  specialty:'Pulmonology',       rating:4.9, reviews:421, location:'AIIMS, New Delhi',             available:true,  initials:'AH', color:'#10b981', experience:'22 yrs', fee:1500 },
  { id:'d5', name:'Dr. Meera Nair',   specialty:'Oncology',          rating:4.6, reviews:163, location:'Tata Memorial, Mumbai',        available:false, initials:'MN', color:'#f59e0b', experience:'9 yrs',  fee:1800 },
  { id:'d6', name:'Dr. James Wright', specialty:'Orthopedics',       rating:4.8, reviews:344, location:'Medanta, Gurugram',            available:true,  initials:'JW', color:'#6366f1', experience:'16 yrs', fee:900  },
];

const TIME_SLOTS = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','02:00 PM','02:30 PM',
  '03:00 PM','03:30 PM','04:00 PM','04:30 PM',
];

function buildDates() {
  const out: { iso: string; day: string; num: string; mon: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      iso: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      num: String(d.getDate()),
      mon: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return out;
}

const DATES = buildDates();

function getBookedSlots(iso: string): Set<string> {
  const seed = iso.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return new Set(TIME_SLOTS.filter((_, i) => (seed + i * 7) % 5 === 0));
}

const TYPE_COLORS: Record<string, string> = { symptom:'#0ea5e9', image:'#8b5cf6', report:'#ec4899' };
const TYPE_LABELS: Record<string, string>  = { symptom:'Symptom Analysis', image:'Image Analysis', report:'Report Analysis' };
const TYPE_ICONS:  Record<string, ReactNode> = {
  symptom: <Stethoscope className="w-4 h-4" />,
  image:   <Activity className="w-4 h-4" />,
  report:  <FileText className="w-4 h-4" />,
};

const STEP_LABELS = ['Diagnosis', 'Doctor', 'Mode', 'Schedule', 'Review'];

function genRef() {
  return `CS-${Date.now().toString(36).toUpperCase().slice(-4)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface StoredBooking {
  reference: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorColor: string;
  doctorInitials: string;
  doctorFee: number;
  mode: 'online' | 'offline';
  date: string;
  time: string;
  diagnosisId: string | null;
  diagnosisLabel: string | null;
  diagnosisType: string | null;
  createdAt: string;
}

interface ContactInfo {
  name: string;
  phone: string;
  dob: string;
  notes: string;
}

export interface ConsultationBookingProps {
  predictions: Prediction[];
  onNavigate: (tab: string) => void;
  initialView?: 'new' | 'my-bookings';
}

// ── Shared urgency map ─────────────────────────────────────────────────────────

const URGENCY_MAP_CB = {
  low:       { label: 'ALL CLEAR',  color: '#10b981', emoji: '🟢', sub: 'Self-care is appropriate.' },
  medium:    { label: 'MONITOR',    color: '#f59e0b', emoji: '🟡', sub: 'See a doctor in the next day or two.' },
  high:      { label: 'CONCERNING', color: '#f97316', emoji: '🟠', sub: 'Consult a physician today.' },
  emergency: { label: 'EMERGENCY',  color: '#ef4444', emoji: '🚨', sub: 'Seek immediate medical attention.' },
} as const;

// ── DiagnosisSummary — urgency + conditions + confidence mini-panel ────────────

function DiagnosisSummary({ p, isDark }: { p: Prediction; isDark: boolean }) {
  const S = "'Michroma', sans-serif";
  const typeColor  = TYPE_COLORS[p.type] || '#8b5cf6';
  const urgencyKey = (p.urgency && p.urgency in URGENCY_MAP_CB) ? p.urgency as keyof typeof URGENCY_MAP_CB : null;
  const urgency    = urgencyKey ? URGENCY_MAP_CB[urgencyKey] : null;
  const rowBg  = isDark ? 'rgba(255,255,255,0.04)'  : 'rgba(0,0,0,0.025)';
  const rowBdr = isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(0,0,0,0.07)';
  const head   = isDark ? '#ffffff'                  : '#0a0a1a';
  const muted  = isDark ? 'rgba(255,255,255,0.42)'  : 'rgba(10,10,26,0.45)';
  const text   = isDark ? 'rgba(255,255,255,0.82)'  : 'rgba(10,10,26,0.80)';
  const track  = isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(0,0,0,0.07)';

  return (
    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
      {urgency && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: '12px',
          background: `${urgency.color}12`, border: `1px solid ${urgency.color}40`,
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{urgency.emoji}</span>
          <div>
            <div style={{ fontFamily: S, fontWeight: 700, fontSize: '0.72rem', color: urgency.color, letterSpacing: '0.08em' }}>
              URGENCY LEVEL — <strong>{urgency.label}</strong>
            </div>
            <div style={{ fontSize: '0.73rem', color: muted, marginTop: '2px' }}>{urgency.sub}</div>
          </div>
        </div>
      )}

      {p.details && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: rowBg, border: `1px solid ${rowBdr}` }}>
          <div style={{ fontSize: '0.6rem', fontFamily: S, letterSpacing: '0.12em', color: muted, textTransform: 'uppercase', marginBottom: '8px' }}>
            AI Analysis
          </div>
          <MedicalAIOutput text={p.details} isDark={isDark} textColor={text} mutedColor={muted} />
        </div>
      )}

      {p.conditions && p.conditions.length > 0 && (
        <div>
          <div style={{ fontSize: '0.6rem', fontFamily: S, letterSpacing: '0.12em', color: muted, textTransform: 'uppercase', marginBottom: '6px' }}>
            Potential Conditions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {p.conditions.slice(0, 3).map((c, i) => {
              const pct      = Math.max(0, Math.min(100, c.probability));
              const barColor = i === 0 ? (urgency?.color || typeColor) : '#6366f1';
              return (
                <div key={i} style={{ padding: '0.6rem 0.85rem', borderRadius: '10px', background: rowBg, border: `1px solid ${rowBdr}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.83rem', fontWeight: 600, color: head }}>{c.name}</span>
                    <span style={{ fontFamily: S, fontWeight: 800, fontSize: '0.83rem', color: barColor }}>{pct}%</span>
                  </div>
                  <div style={{ height: '5px', background: track, borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: '999px', background: `linear-gradient(90deg, ${barColor}, ${barColor}bb)`, boxShadow: `0 0 8px ${barColor}55` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', padding: '0.55rem 0.85rem', borderRadius: '10px', background: rowBg, border: `1px solid ${rowBdr}`, gap: '10px' }}>
        <span style={{ fontSize: '0.7rem', color: muted, flexShrink: 0 }}>Overall Confidence</span>
        <div style={{ flex: 1, height: '5px', background: track, borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${p.confidence}%`, borderRadius: '999px', background: `linear-gradient(90deg, ${typeColor}, ${typeColor}cc)`, boxShadow: `0 0 8px ${typeColor}55` }} />
        </div>
        <span style={{ fontFamily: S, fontWeight: 700, fontSize: '0.75rem', color: p.confidence >= 80 ? '#10b981' : '#f59e0b', flexShrink: 0 }}>{p.confidence}%</span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ConsultationBooking({ predictions, initialView = 'new' }: ConsultationBookingProps) {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  const [view,   setView]   = useState<'new' | 'my-bookings' | 'details'>(initialView === 'my-bookings' ? 'my-bookings' : 'new');
  const [step,   setStep]   = useState(1);

  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Prediction | null>(null);
  const [selectedDoctor,    setSelectedDoctor]    = useState<Doctor | null>(null);
  const [consultMode,       setConsultMode]       = useState<'online' | 'offline' | null>(null);
  const [selectedDate,      setSelectedDate]      = useState('');
  const [selectedTime,      setSelectedTime]      = useState('');

  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [showSuccess,      setShowSuccess]      = useState(false);
  const [emailStatus,      setEmailStatus]      = useState<'idle' | 'sending' | 'sent'>('idle');
  const [confirmedRef,     setConfirmedRef]     = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<StoredBooking | null>(null);
  const [pastBookings,     setPastBookings]     = useState<StoredBooking[]>([]);

  // My Bookings state
  const [expandedId,      setExpandedId]      = useState<string | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [contactInfo,     setContactInfo]     = useState<ContactInfo>({ name:'', phone:'', dob:'', notes:'' });
  const [contactDraft,    setContactDraft]    = useState<ContactInfo>({ name:'', phone:'', dob:'', notes:'' });
  const [editingContact,  setEditingContact]  = useState(false);

  const stepRef    = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const checkRef   = useRef<HTMLDivElement>(null);

  const userData  = JSON.parse(localStorage.getItem('curasense_user') || '{}');
  const userEmail = userData.email || '';

  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";

  const T = isDark ? {
    card:    'rgba(12,12,26,0.90)',
    cardBdr: 'rgba(255,255,255,0.09)',
    head:    '#ffffff',
    text:    '#e2e8f0',
    muted:   'rgba(255,255,255,0.42)',
    rowBg:   'rgba(255,255,255,0.04)',
    rowBdr:  'rgba(255,255,255,0.08)',
    divider: 'rgba(255,255,255,0.06)',
    shadow:  '0 24px 64px rgba(0,0,0,0.6)',
    input:   'rgba(255,255,255,0.07)',
  } : {
    card:    'rgba(255,255,255,0.98)',
    cardBdr: 'rgba(0,0,0,0.09)',
    head:    '#0a0a1a',
    text:    '#1e293b',
    muted:   'rgba(10,10,26,0.45)',
    rowBg:   'rgba(0,0,0,0.025)',
    rowBdr:  'rgba(0,0,0,0.07)',
    divider: 'rgba(0,0,0,0.06)',
    shadow:  '0 8px 32px rgba(0,0,0,0.10)',
    input:   'rgba(0,0,0,0.04)',
  };

  const glassCard = (extra?: CSSProperties): CSSProperties => ({
    background: T.card,
    border: `1px solid ${T.cardBdr}`,
    borderRadius: '20px',
    boxShadow: T.shadow,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    ...extra,
  });

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '0.55rem 0.78rem',
    borderRadius: '10px',
    background: T.input,
    border: `1px solid ${T.rowBdr}`,
    color: T.head,
    fontSize: '0.85rem',
    fontFamily: I,
    outline: 'none',
    boxSizing: 'border-box',
  };

  // Load past bookings when my-bookings view is active
  useEffect(() => {
    if (view === 'my-bookings') {
      try { setPastBookings(JSON.parse(localStorage.getItem('curasense_bookings') || '[]')); }
      catch { /* ignore */ }
    }
  }, [view]);

  // Load contact info from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem('curasense_contact_info');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setContactInfo(parsed);
        setContactDraft(parsed);
      } catch { /* ignore */ }
    } else {
      const ud = JSON.parse(localStorage.getItem('curasense_user') || '{}');
      const def: ContactInfo = { name: ud.name || '', phone: '', dob: '', notes: '' };
      setContactInfo(def);
      setContactDraft(def);
    }
  }, []);

  // Animate step content in
  useEffect(() => {
    if (!stepRef.current || view !== 'new') return;
    gsap.fromTo(stepRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }
    );
  }, [step, view]);

  // Animate success overlay
  useEffect(() => {
    if (!showSuccess || !successRef.current || !checkRef.current) return;
    gsap.fromTo(successRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(checkRef.current,
      { scale: 0, rotation: -30 },
      { scale: 1, rotation: 0, duration: 0.65, ease: 'back.out(1.8)', delay: 0.25 }
    );
  }, [showSuccess]);

  const saveContactInfo = () => {
    localStorage.setItem('curasense_contact_info', JSON.stringify(contactDraft));
    setContactInfo(contactDraft);
    setEditingContact(false);
  };

  const cancelBooking = (ref: string) => {
    const updated = pastBookings.filter(b => b.reference !== ref);
    localStorage.setItem('curasense_bookings', JSON.stringify(updated));
    setPastBookings(updated);
    if (expandedId === ref) setExpandedId(null);
    setCancelConfirmId(null);
  };

  const canAdvance = (): boolean => {
    if (step === 2) return selectedDoctor !== null;
    if (step === 3) return consultMode !== null;
    if (step === 4) return selectedDate !== '' && selectedTime !== '';
    return true;
  };

  const go = (dir: 1 | -1) => {
    const next = step + dir;
    if (next >= 1 && next <= 5) setStep(next);
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !consultMode || !selectedDate || !selectedTime) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 900));

    const ref = genRef();
    const booking: StoredBooking = {
      reference: ref,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      doctorColor: selectedDoctor.color,
      doctorInitials: selectedDoctor.initials,
      doctorFee: selectedDoctor.fee,
      mode: consultMode,
      date: selectedDate,
      time: selectedTime,
      diagnosisId: selectedDiagnosis?.id ?? null,
      diagnosisLabel: selectedDiagnosis?.diagnosis ?? null,
      diagnosisType: selectedDiagnosis?.type ?? null,
      createdAt: new Date().toISOString(),
    };

    const prev: StoredBooking[] = JSON.parse(localStorage.getItem('curasense_bookings') || '[]');
    localStorage.setItem('curasense_bookings', JSON.stringify([booking, ...prev]));

    setConfirmedRef(ref);
    setConfirmedBooking(booking);
    setIsSubmitting(false);
    setShowSuccess(true);
    setEmailStatus('sending');

    await new Promise(r => setTimeout(r, 1800));
    setEmailStatus('sent');
  };

  const goToDetails = () => {
    setShowSuccess(false);
    setView('details');
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedDiagnosis(null);
    setSelectedDoctor(null);
    setConsultMode(null);
    setSelectedDate('');
    setSelectedTime('');
    setConfirmedRef('');
    setConfirmedBooking(null);
    setEmailStatus('idle');
    setShowSuccess(false);
    setView('new');
  };

  const openMyBookings = () => {
    try { setPastBookings(JSON.parse(localStorage.getItem('curasense_bookings') || '[]')); }
    catch { /* ignore */ }
    setView('my-bookings');
  };

  // ── Progress bar ─────────────────────────────────────────────────────────────

  const renderProgress = () => (
    <div style={{ display:'flex', alignItems:'center', marginBottom:'2rem' }}>
      {STEP_LABELS.map((label, i) => {
        const num    = i + 1;
        const done   = step > num;
        const active = step === num;
        const c = active ? '#22d3ee' : done ? '#10b981' : T.muted;
        return (
          <div key={label} style={{ display:'flex', alignItems:'center', flex: i < STEP_LABELS.length - 1 ? 1 : 0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
              <div style={{
                width:30, height:30, borderRadius:'50%', flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center',
                background: done ? '#10b981' : active ? 'rgba(34,211,238,0.16)' : T.rowBg,
                border: `2px solid ${c}`,
                transition:'all 0.3s ease',
              }}>
                {done
                  ? <Check style={{ width:13, height:13, color:'#fff' }} />
                  : <span style={{ fontFamily:S, fontSize:'0.62rem', fontWeight:800, color:c }}>{num}</span>
                }
              </div>
              <span style={{ fontSize:'0.58rem', fontFamily:S, letterSpacing:'0.1em', color:c, textTransform:'uppercase', whiteSpace:'nowrap' }}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{ flex:1, height:2, background: done ? '#10b981' : T.divider, margin:'0 6px', marginBottom:'19px', transition:'background 0.4s ease' }} />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── Step 1: Diagnosis ─────────────────────────────────────────────────────────

  const renderStepDiagnosis = () => (
    <div>
      <div style={{ marginBottom:'1.25rem' }}>
        <h3 style={{ fontFamily:S, fontSize:'1rem', fontWeight:700, color:T.head, marginBottom:'5px' }}>Attach an AI Diagnosis</h3>
        <p style={{ fontSize:'0.82rem', color:T.muted }}>Select a previous analysis to share with your doctor — or skip.</p>
      </div>

      <div
        onClick={() => setSelectedDiagnosis(null)}
        style={{
          padding:'0.85rem 1rem', borderRadius:'13px', marginBottom:'0.65rem', cursor:'pointer',
          background: selectedDiagnosis === null ? 'rgba(34,211,238,0.10)' : T.rowBg,
          border: `1px solid ${selectedDiagnosis === null ? '#22d3ee' : T.rowBdr}`,
          display:'flex', alignItems:'center', gap:'12px', transition:'all 0.2s ease',
        }}
      >
        <div style={{ width:34, height:34, borderRadius:'9px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(34,211,238,0.12)', color:'#22d3ee' }}>
          <X style={{ width:15, height:15 }} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, color:T.head, fontSize:'0.86rem' }}>No diagnosis attached</div>
          <div style={{ fontSize:'0.73rem', color:T.muted }}>I'll describe symptoms during the consultation</div>
        </div>
        {selectedDiagnosis === null && <Check style={{ width:17, height:17, color:'#22d3ee', flexShrink:0 }} />}
      </div>

      {predictions.length === 0 ? (
        <div style={{ textAlign:'center', padding:'2rem', color:T.muted, fontSize:'0.83rem', borderRadius:'13px', border:`1px dashed ${T.rowBdr}` }}>
          No analyses yet — run an AI analysis first to attach a diagnosis.
        </div>
      ) : (
        <div
          data-lenis-prevent
          style={{ display:'flex', flexDirection:'column', gap:'0.55rem', maxHeight:'320px', overflowY:'auto', paddingRight:'4px', overscrollBehavior:'contain' }}
        >
          {[...predictions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(p => {
            const tc  = TYPE_COLORS[p.type] || '#8b5cf6';
            const sel = selectedDiagnosis?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedDiagnosis(p)}
                style={{
                  padding:'0.82rem 1rem', borderRadius:'13px', cursor:'pointer',
                  background: sel ? `${tc}12` : T.rowBg,
                  border: `1px solid ${sel ? tc : T.rowBdr}`,
                  boxShadow: sel ? `0 0 18px -8px ${tc}55` : 'none',
                  transition:'all 0.2s ease',
                }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:34, height:34, borderRadius:'9px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:`${tc}1a`, color:tc }}>
                    {TYPE_ICONS[p.type]}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'3px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.6rem', fontFamily:S, fontWeight:700, letterSpacing:'0.08em', padding:'1px 7px', borderRadius:'999px', background:`${tc}18`, color:tc, border:`1px solid ${tc}30`, textTransform:'uppercase' }}>
                        {TYPE_LABELS[p.type]}
                      </span>
                    </div>
                    <div style={{ fontWeight:700, color:T.head, fontSize:'0.86rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.diagnosis}</div>
                    <div style={{ fontSize:'0.71rem', color:T.muted }}>{new Date(p.timestamp).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</div>
                  </div>
                  {sel && <Check style={{ width:16, height:16, color:tc, flexShrink:0 }} />}
                </div>
                {sel && <DiagnosisSummary p={p} isDark={isDark} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Step 2: Doctor ────────────────────────────────────────────────────────────

  const renderStepDoctor = () => (
    <div>
      <div style={{ marginBottom:'1.25rem' }}>
        <h3 style={{ fontFamily:S, fontSize:'1rem', fontWeight:700, color:T.head, marginBottom:'5px' }}>Choose Your Doctor</h3>
        <p style={{ fontSize:'0.82rem', color:T.muted }}>Select a specialist for your consultation</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'0.8rem' }}>
        {DOCTORS.map(doc => {
          const isSel = selectedDoctor?.id === doc.id;
          return (
            <div
              key={doc.id}
              onClick={() => doc.available && setSelectedDoctor(doc)}
              style={{
                padding:'1rem', borderRadius:'15px', cursor: doc.available ? 'pointer' : 'not-allowed',
                background: isSel ? `${doc.color}12` : T.rowBg,
                border: `1px solid ${isSel ? doc.color : T.rowBdr}`,
                boxShadow: isSel ? `0 0 22px -8px ${doc.color}55` : 'none',
                opacity: doc.available ? 1 : 0.5,
                transition:'all 0.2s ease', position:'relative',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'9px' }}>
                <div style={{
                  width:46, height:46, borderRadius:'13px', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background:`linear-gradient(135deg, ${doc.color}, ${doc.color}88)`,
                  fontFamily:S, fontWeight:800, fontSize:'0.85rem', color:'#fff',
                  boxShadow:`0 5px 16px ${doc.color}44`,
                }}>
                  {doc.initials}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.82rem', color:T.head, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:'2px' }}>{doc.name}</div>
                  <div style={{ fontSize:'0.73rem', color:doc.color, fontWeight:600 }}>{doc.specialty}</div>
                </div>
                {isSel && <Check style={{ width:16, height:16, color:doc.color, flexShrink:0 }} />}
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:'3px', marginBottom:'5px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} style={{ width:10, height:10, fill: i < Math.floor(doc.rating) ? '#f59e0b' : 'transparent', color:'#f59e0b' }} />
                ))}
                <span style={{ fontSize:'0.7rem', fontWeight:700, color:T.text, marginLeft:'4px' }}>{doc.rating}</span>
                <span style={{ fontSize:'0.68rem', color:T.muted }}>({doc.reviews})</span>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'0.7rem', color:T.muted, marginBottom:'8px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                <MapPin style={{ width:10, height:10, flexShrink:0 }} />{doc.location}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.7rem', color:T.muted }}>{doc.experience} exp</span>
                <span style={{ fontFamily:S, fontWeight:800, fontSize:'0.82rem', color:T.head }}>₹{doc.fee}</span>
              </div>

              {!doc.available && (
                <div style={{
                  position:'absolute', top:'8px', right:'8px',
                  padding:'2px 7px', borderRadius:'999px',
                  fontSize:'0.58rem', fontFamily:S, fontWeight:700, letterSpacing:'0.08em',
                  background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)',
                }}>
                  UNAVAILABLE
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Step 3: Mode ──────────────────────────────────────────────────────────────

  const renderStepMode = () => (
    <div>
      <div style={{ marginBottom:'1.25rem' }}>
        <h3 style={{ fontFamily:S, fontSize:'1rem', fontWeight:700, color:T.head, marginBottom:'5px' }}>Consultation Type</h3>
        <p style={{ fontSize:'0.82rem', color:T.muted }}>How would you like to meet {selectedDoctor?.name.split(' ').slice(0, 2).join(' ')}?</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', maxWidth:'520px' }}>
        {([
          { mode:'online' as const, icon:<Video style={{ width:34, height:34 }} />,    title:'Online',   desc:'Video call from anywhere',        sub:'Secure encrypted video platform', color:'#22d3ee' },
          { mode:'offline' as const, icon:<Building2 style={{ width:34, height:34 }} />, title:'In-Clinic', desc:'Visit the doctor in person', sub: selectedDoctor?.location ?? 'At clinic location', color:'#8b5cf6' },
        ]).map(({ mode, icon, title, desc, sub, color }) => {
          const sel = consultMode === mode;
          return (
            <div
              key={mode}
              onClick={() => setConsultMode(mode)}
              style={{
                padding:'1.75rem 1.25rem', borderRadius:'17px', cursor:'pointer', textAlign:'center',
                background: sel ? `${color}12` : T.rowBg,
                border: `2px solid ${sel ? color : T.rowBdr}`,
                boxShadow: sel ? `0 0 30px -8px ${color}66` : 'none',
                transition:'all 0.25s ease',
              }}
            >
              <div style={{ color: sel ? color : T.muted, marginBottom:'0.85rem', transition:'color 0.25s ease' }}>{icon}</div>
              <div style={{ fontFamily:S, fontWeight:800, fontSize:'1.05rem', color:T.head, marginBottom:'6px' }}>{title}</div>
              <div style={{ fontSize:'0.78rem', color:T.text, marginBottom:'7px', lineHeight:1.5 }}>{desc}</div>
              <div style={{ fontSize:'0.68rem', color:T.muted, lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sub}</div>
              {sel && (
                <div style={{ marginTop:'1rem', display:'flex', justifyContent:'center' }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Check style={{ width:13, height:13, color:'#fff' }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Step 4: Schedule ──────────────────────────────────────────────────────────

  const renderStepSchedule = () => {
    const booked = selectedDate ? getBookedSlots(selectedDate) : new Set<string>();
    return (
      <div>
        <div style={{ marginBottom:'1.25rem' }}>
          <h3 style={{ fontFamily:S, fontSize:'1rem', fontWeight:700, color:T.head, marginBottom:'5px' }}>Schedule Appointment</h3>
          <p style={{ fontSize:'0.82rem', color:T.muted }}>Pick a date then choose an available time slot</p>
        </div>

        <div style={{ marginBottom:'1.35rem' }}>
          <div style={{ fontSize:'0.68rem', fontFamily:S, letterSpacing:'0.12em', color:T.muted, textTransform:'uppercase', marginBottom:'0.7rem' }}>Select Date</div>
          <div
            data-lenis-prevent
            style={{ display:'flex', gap:'0.55rem', overflowX:'auto', paddingBottom:'8px', overscrollBehavior:'contain' }}
          >
            {DATES.map(d => {
              const sel = selectedDate === d.iso;
              return (
                <div
                  key={d.iso}
                  onClick={() => { setSelectedDate(d.iso); setSelectedTime(''); }}
                  style={{
                    flexShrink:0, padding:'0.7rem 0.8rem', borderRadius:'12px', cursor:'pointer', textAlign:'center',
                    background: sel ? 'rgba(34,211,238,0.14)' : T.rowBg,
                    border: `1px solid ${sel ? '#22d3ee' : T.rowBdr}`,
                    minWidth:'52px', transition:'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize:'0.65rem', fontFamily:S, letterSpacing:'0.07em', color: sel?'#22d3ee':T.muted, textTransform:'uppercase', marginBottom:'4px' }}>{d.day}</div>
                  <div style={{ fontFamily:S, fontWeight:800, fontSize:'1.1rem', color: sel?'#22d3ee':T.head, lineHeight:1 }}>{d.num}</div>
                  <div style={{ fontSize:'0.63rem', color: sel?'#22d3ee':T.muted, marginTop:'3px' }}>{d.mon}</div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div>
            <div style={{ fontSize:'0.68rem', fontFamily:S, letterSpacing:'0.12em', color:T.muted, textTransform:'uppercase', marginBottom:'0.7rem' }}>Available Slots</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'0.55rem' }}>
              {TIME_SLOTS.map(slot => {
                const isBooked = booked.has(slot);
                const isSel    = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => !isBooked && setSelectedTime(slot)}
                    style={{
                      padding:'0.6rem 0.45rem', borderRadius:'10px',
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      fontFamily:S, fontWeight:700, fontSize:'0.67rem', letterSpacing:'0.03em',
                      background: isBooked ? T.rowBg : isSel ? 'rgba(34,211,238,0.18)' : T.rowBg,
                      border: `1px solid ${isBooked ? T.divider : isSel ? '#22d3ee' : T.rowBdr}`,
                      color: isBooked ? T.muted : isSel ? '#22d3ee' : T.text,
                      opacity: isBooked ? 0.35 : 1,
                      textDecoration: isBooked ? 'line-through' : 'none',
                      transition:'all 0.2s ease',
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Step 5: Review ────────────────────────────────────────────────────────────

  const renderStepReview = () => {
    if (!selectedDoctor || !consultMode || !selectedDate || !selectedTime) return null;
    const mc = consultMode === 'online' ? '#22d3ee' : '#8b5cf6';
    return (
      <div>
        <div style={{ marginBottom:'1.25rem' }}>
          <h3 style={{ fontFamily:S, fontSize:'1rem', fontWeight:700, color:T.head, marginBottom:'5px' }}>Review Your Booking</h3>
          <p style={{ fontSize:'0.82rem', color:T.muted }}>Confirm all details before submitting</p>
        </div>

        <div style={{ padding:'0.9rem 1rem', borderRadius:'13px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, marginBottom:'0.6rem', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:44, height:44, borderRadius:'12px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg, ${selectedDoctor.color}, ${selectedDoctor.color}88)`, fontFamily:S, fontWeight:800, fontSize:'0.82rem', color:'#fff', boxShadow:`0 4px 12px ${selectedDoctor.color}44` }}>
            {selectedDoctor.initials}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.88rem', color:T.head }}>{selectedDoctor.name}</div>
            <div style={{ fontSize:'0.76rem', color:selectedDoctor.color, fontWeight:600 }}>{selectedDoctor.specialty}</div>
            <div style={{ fontSize:'0.7rem', color:T.muted }}>{selectedDoctor.location}</div>
          </div>
          <div style={{ fontFamily:S, fontWeight:800, fontSize:'0.95rem', color:T.head, flexShrink:0 }}>₹{selectedDoctor.fee}</div>
        </div>

        <div style={{ padding:'0.8rem 1rem', borderRadius:'13px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, marginBottom:'0.6rem', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ color:mc }}>{consultMode === 'online' ? <Wifi style={{ width:18, height:18 }} /> : <Building2 style={{ width:18, height:18 }} />}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.8rem', color:T.head }}>{consultMode === 'online' ? 'Online Consultation' : 'In-Clinic Visit'}</div>
            <div style={{ fontSize:'0.7rem', color:T.muted }}>{consultMode === 'online' ? 'Secure video call' : selectedDoctor.location}</div>
          </div>
          <span style={{ padding:'2px 9px', borderRadius:'999px', fontSize:'0.62rem', fontFamily:S, fontWeight:700, background:`${mc}18`, color:mc, border:`1px solid ${mc}30` }}>
            {consultMode.toUpperCase()}
          </span>
        </div>

        <div style={{ padding:'0.8rem 1rem', borderRadius:'13px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, marginBottom:'0.6rem', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ color:'#f59e0b' }}><Calendar style={{ width:18, height:18 }} /></div>
          <div>
            <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.8rem', color:T.head }}>{fmtDate(selectedDate)}</div>
            <div style={{ fontSize:'0.7rem', color:T.muted, display:'flex', alignItems:'center', gap:'4px', marginTop:'2px' }}>
              <Clock style={{ width:11, height:11 }} />{selectedTime}
            </div>
          </div>
        </div>

        {selectedDiagnosis ? (
          <div style={{ padding:'0.8rem 1rem', borderRadius:'13px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, marginBottom:'0.6rem', display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ color: TYPE_COLORS[selectedDiagnosis.type] || '#8b5cf6' }}>{TYPE_ICONS[selectedDiagnosis.type]}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.6rem', fontFamily:S, letterSpacing:'0.08em', color: TYPE_COLORS[selectedDiagnosis.type], textTransform:'uppercase', marginBottom:'2px' }}>Attached Diagnosis</div>
              <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.8rem', color:T.head, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selectedDiagnosis.diagnosis}</div>
            </div>
          </div>
        ) : (
          <div style={{ padding:'0.8rem 1rem', borderRadius:'13px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, marginBottom:'0.6rem', display:'flex', alignItems:'center', gap:'10px', color:T.muted, fontSize:'0.79rem' }}>
            <X style={{ width:15, height:15 }} /> No diagnosis attached
          </div>
        )}

        {selectedDiagnosis && (
          <div style={{ marginBottom:'0.6rem' }}>
            <DiagnosisSummary p={selectedDiagnosis} isDark={isDark} />
          </div>
        )}

        <div style={{ padding:'0.8rem 1rem', borderRadius:'13px', background:'rgba(34,211,238,0.06)', border:'1px solid rgba(34,211,238,0.18)', display:'flex', alignItems:'center', gap:'10px', marginBottom:'0.25rem' }}>
          <Mail style={{ width:15, height:15, color:'#22d3ee', flexShrink:0 }} />
          <span style={{ fontSize:'0.77rem', color:T.text }}>
            Confirmation will be sent to <strong style={{ color:'#22d3ee' }}>{userEmail || 'your email'}</strong>
          </span>
        </div>
      </div>
    );
  };

  // ── Success Overlay ───────────────────────────────────────────────────────────

  const renderSuccess = () => (
    <div
      ref={successRef}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.38) 72%, rgba(0,0,0,0.10) 90%, rgba(0,0,0,0.00) 100%)',
        backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'1.5rem',
      }}
    >
      <div ref={checkRef} style={{ ...glassCard({ padding:'2.5rem 2rem', maxWidth:'420px', width:'100%', textAlign:'center', borderRadius:'24px' }) }}>
        <div style={{ width:78, height:78, borderRadius:'50%', background:'rgba(16,185,129,0.14)', border:'2px solid #10b981', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.35rem' }}>
          <Check style={{ width:36, height:36, color:'#10b981', strokeWidth:2.5 }} />
        </div>

        <h2 style={{ fontFamily:S, fontWeight:800, fontSize:'1.35rem', color:T.head, marginBottom:'5px' }}>Booking Confirmed!</h2>
        <div style={{ fontFamily:S, fontSize:'0.68rem', letterSpacing:'0.15em', color:'#22d3ee', marginBottom:'1.35rem' }}>
          REF: {confirmedRef}
        </div>

        <div style={{
          padding:'0.7rem 1rem', borderRadius:'12px', marginBottom:'1.35rem',
          background: emailStatus === 'sent' ? 'rgba(16,185,129,0.10)' : 'rgba(34,211,238,0.08)',
          border: `1px solid ${emailStatus === 'sent' ? 'rgba(16,185,129,0.30)' : 'rgba(34,211,238,0.20)'}`,
          display:'flex', alignItems:'center', gap:'10px', transition:'all 0.4s ease',
        }}>
          <Mail style={{ width:15, height:15, color: emailStatus === 'sent' ? '#10b981' : '#22d3ee', flexShrink:0 }} />
          <span style={{ fontSize:'0.79rem', color:T.text }}>
            {emailStatus === 'sending'
              ? <span>Sending confirmation to <strong>{userEmail}</strong>…</span>
              : <span>Confirmation sent to <strong style={{ color:'#10b981' }}>{userEmail}</strong> ✓</span>
            }
          </span>
        </div>

        <p style={{ fontSize:'0.79rem', color:T.muted, marginBottom:'1.75rem', lineHeight:1.65 }}>
          Your appointment with <strong style={{ color:T.text }}>{confirmedBooking?.doctorName}</strong> on{' '}
          <strong style={{ color:T.text }}>{confirmedBooking?.date ? fmtDate(confirmedBooking.date) : ''}</strong> at{' '}
          <strong style={{ color:T.text }}>{confirmedBooking?.time}</strong> is confirmed.
        </p>

        <button
          onClick={goToDetails}
          disabled={emailStatus === 'sending'}
          style={{
            width:'100%', padding:'0.88rem', borderRadius:'13px',
            cursor: emailStatus === 'sending' ? 'wait' : 'pointer',
            background: emailStatus === 'sending' ? T.rowBg : 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
            color: emailStatus === 'sending' ? T.muted : '#fff',
            fontFamily:S, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.06em',
            border: emailStatus === 'sending' ? `1px solid ${T.rowBdr}` : 'none',
            boxShadow: emailStatus !== 'sending' ? '0 8px 24px rgba(34,211,238,0.35)' : 'none',
            transition:'all 0.25s ease',
          }}
        >
          {emailStatus === 'sending' ? 'Sending email…' : 'View Booking Details →'}
        </button>
      </div>
    </div>
  );

  // ── Booking Details ───────────────────────────────────────────────────────────

  const renderBookingDetails = () => {
    const b = confirmedBooking;
    if (!b) return null;
    const doc         = DOCTORS.find(d => d.id === b.doctorId);
    const mc          = b.mode === 'online' ? '#22d3ee' : '#8b5cf6';
    const attachedPred = b.diagnosisId ? predictions.find(p => p.id === b.diagnosisId) ?? null : null;
    return (
      <div style={{ maxWidth:'680px', margin:'0 auto', fontFamily:I }}>
        <div style={{ marginBottom:'2rem', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h2 style={{ fontFamily:S, fontWeight:800, fontSize:'1.5rem', color:T.head, marginBottom:'5px' }}>Your Booking</h2>
            <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
              <BadgeCheck style={{ width:14, height:14, color:'#10b981' }} />
              <span style={{ fontFamily:S, fontSize:'0.65rem', letterSpacing:'0.12em', color:'#10b981' }}>CONFIRMED · {b.reference}</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
            <button onClick={openMyBookings} style={{ padding:'0.5rem 1rem', borderRadius:'10px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, color:T.text, fontFamily:S, fontWeight:700, fontSize:'0.68rem', cursor:'pointer', letterSpacing:'0.06em' }}>
              MY BOOKINGS
            </button>
            <button onClick={resetWizard} style={{ padding:'0.5rem 1rem', borderRadius:'10px', background:'linear-gradient(135deg,#22d3ee,#8b5cf6)', border:'none', color:'#fff', fontFamily:S, fontWeight:700, fontSize:'0.68rem', cursor:'pointer', letterSpacing:'0.06em', boxShadow:'0 4px 14px rgba(34,211,238,0.3)' }}>
              + NEW BOOKING
            </button>
          </div>
        </div>

        {doc && (
          <div style={{ ...glassCard({ padding:'1.25rem', marginBottom:'0.8rem' }) }}>
            <div style={{ fontSize:'0.6rem', fontFamily:S, letterSpacing:'0.14em', color:T.muted, textTransform:'uppercase', marginBottom:'0.8rem' }}>Consulting Doctor</div>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:54, height:54, borderRadius:'14px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg, ${doc.color}, ${doc.color}88)`, fontFamily:S, fontWeight:800, fontSize:'0.95rem', color:'#fff', boxShadow:`0 6px 18px ${doc.color}44` }}>
                {doc.initials}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.95rem', color:T.head, marginBottom:'4px' }}>{doc.name}</div>
                <div style={{ fontSize:'0.8rem', color:doc.color, fontWeight:600, marginBottom:'3px' }}>{doc.specialty}</div>
                <div style={{ fontSize:'0.72rem', color:T.muted, display:'flex', alignItems:'center', gap:'4px' }}><MapPin style={{ width:11, height:11 }} />{doc.location}</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:S, fontWeight:800, fontSize:'1.05rem', color:T.head }}>₹{doc.fee}</div>
                <div style={{ fontSize:'0.68rem', color:T.muted }}>consultation fee</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ ...glassCard({ padding:'1.25rem', marginBottom:'0.8rem' }) }}>
          <div style={{ fontSize:'0.6rem', fontFamily:S, letterSpacing:'0.14em', color:T.muted, textTransform:'uppercase', marginBottom:'0.8rem' }}>Appointment Details</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.85rem' }}>
            <div style={{ padding:'0.82rem', borderRadius:'12px', background:T.rowBg, border:`1px solid ${T.rowBdr}` }}>
              <div style={{ fontSize:'0.65rem', color:T.muted, marginBottom:'5px', display:'flex', alignItems:'center', gap:'4px' }}><Calendar style={{ width:11, height:11 }} /> Date</div>
              <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.8rem', color:T.head }}>{fmtDate(b.date)}</div>
            </div>
            <div style={{ padding:'0.82rem', borderRadius:'12px', background:T.rowBg, border:`1px solid ${T.rowBdr}` }}>
              <div style={{ fontSize:'0.65rem', color:T.muted, marginBottom:'5px', display:'flex', alignItems:'center', gap:'4px' }}><Clock style={{ width:11, height:11 }} /> Time</div>
              <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.8rem', color:T.head }}>{b.time}</div>
            </div>
            <div style={{ padding:'0.82rem', borderRadius:'12px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, gridColumn:'1/-1' }}>
              <div style={{ fontSize:'0.65rem', color:T.muted, marginBottom:'5px', display:'flex', alignItems:'center', gap:'4px' }}>
                {b.mode === 'online' ? <Wifi style={{ width:11, height:11 }} /> : <Building2 style={{ width:11, height:11 }} />} Mode
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontFamily:S, fontWeight:700, fontSize:'0.85rem', color:mc }}>{b.mode === 'online' ? 'Online Video Consultation' : 'In-Clinic Visit'}</span>
                <span style={{ padding:'2px 8px', borderRadius:'999px', fontSize:'0.58rem', fontFamily:S, fontWeight:700, background:`${mc}18`, color:mc, border:`1px solid ${mc}30` }}>{b.mode.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {b.diagnosisLabel && (
          <div style={{ ...glassCard({ padding:'1.25rem', marginBottom:'0.8rem' }) }}>
            <div style={{ fontSize:'0.6rem', fontFamily:S, letterSpacing:'0.14em', color:T.muted, textTransform:'uppercase', marginBottom:'0.8rem' }}>Attached AI Diagnosis</div>
            <div style={{ padding:'0.82rem 1rem', borderRadius:'12px', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.22)', display:'flex', alignItems:'center', gap:'10px' }}>
              <Brain style={{ width:17, height:17, color:'#8b5cf6', flexShrink:0 }} />
              <div>
                {b.diagnosisType && (
                  <div style={{ fontSize:'0.6rem', fontFamily:S, letterSpacing:'0.08em', color: TYPE_COLORS[b.diagnosisType] || '#8b5cf6', textTransform:'uppercase', marginBottom:'2px' }}>
                    {TYPE_LABELS[b.diagnosisType]}
                  </div>
                )}
                <span style={{ fontFamily:S, fontWeight:700, fontSize:'0.85rem', color:T.head }}>{b.diagnosisLabel}</span>
              </div>
            </div>
            {attachedPred && <DiagnosisSummary p={attachedPred} isDark={isDark} />}
          </div>
        )}

        <div style={{ padding:'0.82rem 1rem', borderRadius:'12px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.25)', display:'flex', alignItems:'center', gap:'10px', marginBottom:'1rem' }}>
          <Mail style={{ width:15, height:15, color:'#10b981', flexShrink:0 }} />
          <span style={{ fontSize:'0.77rem', color:T.text }}>Confirmation sent to <strong style={{ color:'#10b981' }}>{userEmail}</strong></span>
          <BadgeCheck style={{ width:15, height:15, color:'#10b981', marginLeft:'auto', flexShrink:0 }} />
        </div>

        <div style={{ padding:'0.82rem 1rem', borderRadius:'12px', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)', display:'flex', gap:'8px', alignItems:'flex-start' }}>
          <AlertTriangle style={{ width:13, height:13, color:'#ef4444', marginTop:2, flexShrink:0 }} />
          <p style={{ fontSize:'0.7rem', color: isDark ? '#fca5a5' : '#991b1b', lineHeight:1.55 }}>
            This booking is a simulation and does not constitute a real medical appointment. Always consult a licensed healthcare provider.
          </p>
        </div>
      </div>
    );
  };

  // ── My Bookings ───────────────────────────────────────────────────────────────

  const renderMyBookings = () => (
    <div style={{ maxWidth:'680px', margin:'0 auto', fontFamily:I }}>
      {/* Header */}
      <div style={{ marginBottom:'1.5rem', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h2 style={{ fontFamily:S, fontWeight:800, fontSize:'1.5rem', color:T.head, marginBottom:'5px' }}>My Bookings</h2>
          <p style={{ fontSize:'0.83rem', color:T.muted }}>Manage your consultation appointments</p>
        </div>
        <button
          onClick={resetWizard}
          style={{ padding:'0.55rem 1.1rem', borderRadius:'11px', background:'linear-gradient(135deg,#22d3ee,#8b5cf6)', border:'none', color:'#fff', fontFamily:S, fontWeight:700, fontSize:'0.68rem', cursor:'pointer', letterSpacing:'0.06em', boxShadow:'0 4px 14px rgba(34,211,238,0.3)' }}
        >
          + NEW BOOKING
        </button>
      </div>

      {/* Contact Info Card */}
      <div style={{ ...glassCard({ padding:'1.25rem', marginBottom:'1rem' }) }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.9rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
            <User style={{ width:13, height:13, color:'var(--accent-violet)' }} />
            <span style={{ fontFamily:S, fontSize:'0.6rem', letterSpacing:'0.14em', color:T.muted, textTransform:'uppercase' }}>Your Information</span>
          </div>
          {!editingContact ? (
            <button
              onClick={() => { setContactDraft(contactInfo); setEditingContact(true); }}
              style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'8px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, color:T.muted, fontFamily:S, fontWeight:700, fontSize:'0.6rem', cursor:'pointer', letterSpacing:'0.06em' }}
            >
              <Pencil style={{ width:9, height:9 }} /> EDIT
            </button>
          ) : (
            <div style={{ display:'flex', gap:'6px' }}>
              <button
                onClick={() => setEditingContact(false)}
                style={{ padding:'4px 10px', borderRadius:'8px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, color:T.muted, fontFamily:S, fontWeight:700, fontSize:'0.6rem', cursor:'pointer' }}
              >
                CANCEL
              </button>
              <button
                onClick={saveContactInfo}
                style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'8px', background:'linear-gradient(135deg,#22d3ee,#8b5cf6)', border:'none', color:'#fff', fontFamily:S, fontWeight:700, fontSize:'0.6rem', cursor:'pointer' }}
              >
                <Save style={{ width:9, height:9 }} /> SAVE
              </button>
            </div>
          )}
        </div>

        {editingContact ? (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem' }}>
            {[
              { key:'name',  label:'Full Name',     type:'text',  placeholder:'Your full name',         icon:<User style={{ width:10, height:10 }} /> },
              { key:'phone', label:'Phone',          type:'tel',   placeholder:'+91 00000 00000',        icon:<Phone style={{ width:10, height:10 }} /> },
              { key:'dob',   label:'Date of Birth',  type:'date',  placeholder:'',                       icon:<Calendar style={{ width:10, height:10 }} /> },
              { key:'notes', label:'Medical Notes',  type:'text',  placeholder:'Allergies, conditions…', icon:<FileText style={{ width:10, height:10 }} /> },
            ].map(({ key, label, type, placeholder, icon }) => (
              <div key={key}>
                <label style={{ fontSize:'0.6rem', color:T.muted, fontFamily:S, letterSpacing:'0.09em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:'4px', marginBottom:'5px' }}>
                  {icon} {label}
                </label>
                <input
                  type={type}
                  value={contactDraft[key as keyof ContactInfo]}
                  onChange={e => setContactDraft(d => ({ ...d, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.55rem' }}>
            {[
              { icon:<User style={{ width:10, height:10 }} />,     label:'Name',          value: contactInfo.name  || '—' },
              { icon:<Phone style={{ width:10, height:10 }} />,    label:'Phone',         value: contactInfo.phone || '—' },
              { icon:<Calendar style={{ width:10, height:10 }} />, label:'Date of Birth', value: contactInfo.dob ? new Date(contactInfo.dob + 'T00:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }) : '—' },
              { icon:<FileText style={{ width:10, height:10 }} />, label:'Medical Notes', value: contactInfo.notes || '—' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ padding:'0.65rem 0.8rem', borderRadius:'10px', background:T.rowBg, border:`1px solid ${T.rowBdr}` }}>
                <div style={{ fontSize:'0.59rem', color:T.muted, fontFamily:S, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
                  {icon} {label}
                </div>
                <div style={{ fontSize:'0.82rem', color:T.head, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookings list */}
      {pastBookings.length === 0 ? (
        <div style={{ ...glassCard({ padding:'3rem', textAlign:'center' }) }}>
          <CalendarCheck style={{ width:44, height:44, color:T.muted, display:'block', margin:'0 auto 1rem', opacity:0.35 }} />
          <p style={{ fontSize:'0.88rem', color:T.muted, marginBottom:'1.25rem' }}>No bookings yet</p>
          <button
            onClick={resetWizard}
            style={{ padding:'0.6rem 1.25rem', borderRadius:'11px', background:'rgba(34,211,238,0.12)', border:'1px solid rgba(34,211,238,0.30)', color:'#22d3ee', fontFamily:S, fontWeight:700, fontSize:'0.72rem', cursor:'pointer' }}
          >
            Book Your First Appointment
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
          {pastBookings.map(b => {
            const isExpanded   = expandedId === b.reference;
            const isConfirming = cancelConfirmId === b.reference;
            const doc          = DOCTORS.find(d => d.id === b.doctorId);
            const mc           = b.mode === 'online' ? '#22d3ee' : '#8b5cf6';
            const dc           = doc?.color ?? b.doctorColor ?? '#8b5cf6';
            const di           = doc?.initials ?? b.doctorInitials ?? '??';
            const attachedPred = b.diagnosisId ? predictions.find(p => p.id === b.diagnosisId) ?? null : null;

            return (
              <div key={b.reference} style={{ ...glassCard({ padding:'0', overflow:'hidden' }) }}>
                {/* Summary row — click to expand/collapse */}
                <div
                  onClick={() => { setExpandedId(isExpanded ? null : b.reference); setCancelConfirmId(null); }}
                  style={{ padding:'1rem 1.1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'12px', userSelect:'none' }}
                >
                  <div style={{ width:42, height:42, borderRadius:'11px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg, ${dc}, ${dc}88)`, fontFamily:S, fontWeight:800, fontSize:'0.78rem', color:'#fff', boxShadow:`0 4px 12px ${dc}33` }}>
                    {di}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.85rem', color:T.head, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.doctorName}</div>
                    <div style={{ fontSize:'0.72rem', color:dc, marginBottom:'3px' }}>{b.doctorSpecialty}</div>
                    <div style={{ display:'flex', gap:'0.85rem', fontSize:'0.7rem', color:T.muted, flexWrap:'wrap' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><Calendar style={{ width:10, height:10 }} />{fmtDate(b.date)}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><Clock style={{ width:10, height:10 }} />{b.time}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px', flexShrink:0 }}>
                    <div style={{ display:'flex', gap:'4px' }}>
                      <span style={{ padding:'2px 7px', borderRadius:'999px', fontSize:'0.57rem', fontFamily:S, fontWeight:700, background:`${mc}14`, color:mc, border:`1px solid ${mc}28` }}>{b.mode.toUpperCase()}</span>
                      <span style={{ padding:'2px 7px', borderRadius:'999px', fontSize:'0.57rem', fontFamily:S, fontWeight:700, background:'rgba(16,185,129,0.12)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)' }}>CONFIRMED</span>
                    </div>
                    <ChevronDown style={{ width:15, height:15, color: isExpanded ? T.head : T.muted, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.3s ease' }} />
                  </div>
                </div>

                {/* Accordion detail section */}
                <div style={{ maxHeight: isExpanded ? '9999px' : '0', overflow:'hidden', transition:'max-height 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
                  <div style={{ padding:'0 1.1rem 1.1rem', borderTop:`1px solid ${T.divider}` }}>

                    {/* ── 1. Appointment Meta: Date / Time / Mode ── */}
                    <div style={{ marginTop:'0.9rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.55rem', marginBottom:'0.6rem' }}>
                      <div style={{ padding:'0.7rem', borderRadius:'10px', background:T.rowBg, border:`1px solid ${T.rowBdr}` }}>
                        <div style={{ fontSize:'0.59rem', color:T.muted, fontFamily:S, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'4px', display:'flex', alignItems:'center', gap:'3px' }}><Calendar style={{ width:9, height:9 }} /> Date</div>
                        <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.76rem', color:T.head }}>{fmtDate(b.date)}</div>
                      </div>
                      <div style={{ padding:'0.7rem', borderRadius:'10px', background:T.rowBg, border:`1px solid ${T.rowBdr}` }}>
                        <div style={{ fontSize:'0.59rem', color:T.muted, fontFamily:S, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'4px', display:'flex', alignItems:'center', gap:'3px' }}><Clock style={{ width:9, height:9 }} /> Time</div>
                        <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.76rem', color:T.head }}>{b.time}</div>
                      </div>
                      <div style={{ padding:'0.7rem', borderRadius:'10px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, gridColumn:'1/-1' }}>
                        <div style={{ fontSize:'0.59rem', color:T.muted, fontFamily:S, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'4px', display:'flex', alignItems:'center', gap:'3px' }}>
                          {b.mode === 'online' ? <Wifi style={{ width:9, height:9 }} /> : <Building2 style={{ width:9, height:9 }} />} Mode
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                          <span style={{ fontFamily:S, fontWeight:700, fontSize:'0.78rem', color:mc }}>{b.mode === 'online' ? 'Online Video Consultation' : 'In-Clinic Visit'}</span>
                          {b.mode === 'offline' && doc && <span style={{ fontSize:'0.68rem', color:T.muted }}>{doc.location}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Fee */}
                    <div style={{ padding:'0.6rem 0.8rem', borderRadius:'10px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, marginBottom:'0.55rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:'0.72rem', color:T.muted }}>Consultation Fee</span>
                      <span style={{ fontFamily:S, fontWeight:800, fontSize:'0.88rem', color:T.head }}>₹{b.doctorFee}</span>
                    </div>

                    {/* ── 2. Symptom Diagnosed Header ── */}
                    {b.diagnosisLabel && (
                      <div style={{ padding:'0.6rem 0.8rem', borderRadius:'10px', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', display:'flex', alignItems:'center', gap:'8px', marginBottom:'0.45rem' }}>
                        <Brain style={{ width:12, height:12, color:'#8b5cf6', flexShrink:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          {b.diagnosisType && (
                            <div style={{ fontSize:'0.57rem', fontFamily:S, letterSpacing:'0.08em', color: TYPE_COLORS[b.diagnosisType] || '#8b5cf6', textTransform:'uppercase', marginBottom:'2px' }}>
                              {TYPE_LABELS[b.diagnosisType]}
                            </div>
                          )}
                          <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.76rem', color:T.head, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.diagnosisLabel}</div>
                        </div>
                      </div>
                    )}

                    {/* ── 3. Urgency Level — only when data exists ── */}
                    {attachedPred?.urgency && URGENCY_MAP_CB[attachedPred.urgency as keyof typeof URGENCY_MAP_CB] && (() => {
                      const urg = URGENCY_MAP_CB[attachedPred.urgency as keyof typeof URGENCY_MAP_CB];
                      return (
                        <div style={{ padding:'0.75rem 1rem', borderRadius:'12px', background:`${urg.color}12`, border:`1px solid ${urg.color}40`, display:'flex', alignItems:'center', gap:'10px', marginBottom:'0.45rem' }}>
                          <span style={{ fontSize:'1.5rem', lineHeight:1 }}>{urg.emoji}</span>
                          <div>
                            <div style={{ fontFamily:S, fontWeight:700, fontSize:'0.72rem', color:urg.color, letterSpacing:'0.08em' }}>
                              URGENCY LEVEL — <strong>{urg.label}</strong>
                            </div>
                            <div style={{ fontSize:'0.73rem', color:T.muted, marginTop:'2px' }}>{urg.sub}</div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* ── 4. AI Analysis Text — only when details exist ── */}
                    {attachedPred?.details && (
                      <div style={{ padding:'0.75rem 1rem', borderRadius:'12px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, marginBottom:'0.45rem' }}>
                        <div style={{ fontSize:'0.6rem', fontFamily:S, letterSpacing:'0.12em', color:T.muted, textTransform:'uppercase', marginBottom:'8px' }}>AI Analysis</div>
                        <MedicalAIOutput text={attachedPred.details} isDark={isDark} textColor={T.text} mutedColor={T.muted} />
                      </div>
                    )}

                    {/* ── 5. Potential Conditions — only when conditions exist ── */}
                    {attachedPred?.conditions && attachedPred.conditions.length > 0 && (() => {
                      const typeColor = TYPE_COLORS[attachedPred.type] || '#8b5cf6';
                      const urgKey    = attachedPred.urgency as keyof typeof URGENCY_MAP_CB | undefined;
                      const urgColor  = urgKey && URGENCY_MAP_CB[urgKey] ? URGENCY_MAP_CB[urgKey].color : typeColor;
                      const track     = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
                      return (
                        <div style={{ marginBottom:'0.45rem' }}>
                          <div style={{ fontSize:'0.6rem', fontFamily:S, letterSpacing:'0.12em', color:T.muted, textTransform:'uppercase', marginBottom:'6px' }}>Potential Conditions</div>
                          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                            {attachedPred.conditions.slice(0, 3).map((c, i) => {
                              const pct      = Math.max(0, Math.min(100, c.probability));
                              const barColor = i === 0 ? urgColor : '#6366f1';
                              return (
                                <div key={i} style={{ padding:'0.6rem 0.85rem', borderRadius:'10px', background:T.rowBg, border:`1px solid ${T.rowBdr}` }}>
                                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px' }}>
                                    <span style={{ fontSize:'0.83rem', fontWeight:600, color:T.head }}>{c.name}</span>
                                    <span style={{ fontFamily:S, fontWeight:800, fontSize:'0.83rem', color:barColor }}>{pct}%</span>
                                  </div>
                                  <div style={{ height:'5px', background:track, borderRadius:'999px', overflow:'hidden' }}>
                                    <div style={{ height:'100%', width:`${pct}%`, borderRadius:'999px', background:`linear-gradient(90deg, ${barColor}, ${barColor}bb)`, boxShadow:`0 0 8px ${barColor}55` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* ── 6. Overall Confidence Bar — always renders when pred is attached ── */}
                    {attachedPred && (() => {
                      const typeColor = TYPE_COLORS[attachedPred.type] || '#8b5cf6';
                      const track     = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
                      return (
                        <div style={{ display:'flex', alignItems:'center', padding:'0.55rem 0.85rem', borderRadius:'10px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, gap:'10px', marginBottom:'0.75rem' }}>
                          <span style={{ fontSize:'0.7rem', color:T.muted, flexShrink:0 }}>Overall Confidence</span>
                          <div style={{ flex:1, height:'5px', background:track, borderRadius:'999px', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${attachedPred.confidence}%`, borderRadius:'999px', background:`linear-gradient(90deg, ${typeColor}, ${typeColor}cc)`, boxShadow:`0 0 8px ${typeColor}55` }} />
                          </div>
                          <span style={{ fontFamily:S, fontWeight:700, fontSize:'0.75rem', color: attachedPred.confidence >= 80 ? '#10b981' : '#f59e0b', flexShrink:0 }}>{attachedPred.confidence}%</span>
                        </div>
                      );
                    })()}

                    {/* ── 7. Footer: Reference ID + Booked Date — ALWAYS renders ── */}
                    <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.85rem', flexWrap:'wrap' }}>
                      <span style={{ padding:'3px 8px', borderRadius:'7px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, fontSize:'0.6rem', fontFamily:S, letterSpacing:'0.1em', color:T.muted }}>REF: {b.reference}</span>
                      <span style={{ padding:'3px 8px', borderRadius:'7px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, fontSize:'0.6rem', color:T.muted }}>
                        Booked {new Date(b.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                      </span>
                    </div>

                    {/* ── Cancel with inline confirmation — ALWAYS renders ── */}
                    {isConfirming ? (
                      <div style={{ display:'flex', gap:'7px', alignItems:'center' }}>
                        <span style={{ fontSize:'0.72rem', color:T.muted, flex:1 }}>Cancel this appointment?</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setCancelConfirmId(null); }}
                          style={{ padding:'0.45rem 0.85rem', borderRadius:'9px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, color:T.muted, fontFamily:S, fontWeight:700, fontSize:'0.62rem', cursor:'pointer' }}
                        >
                          KEEP
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); cancelBooking(b.reference); }}
                          style={{ padding:'0.45rem 0.85rem', borderRadius:'9px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.35)', color:'#ef4444', fontFamily:S, fontWeight:700, fontSize:'0.62rem', cursor:'pointer' }}
                        >
                          YES, CANCEL
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setCancelConfirmId(b.reference); }}
                        style={{ display:'flex', alignItems:'center', gap:'6px', padding:'0.5rem 0.95rem', borderRadius:'10px', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)', color:'#ef4444', fontFamily:S, fontWeight:700, fontSize:'0.65rem', cursor:'pointer', letterSpacing:'0.05em' }}
                      >
                        <Trash2 style={{ width:11, height:11 }} /> CANCEL APPOINTMENT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Root render ───────────────────────────────────────────────────────────────

  if (view === 'my-bookings') return <div style={{ fontFamily:I }}>{renderMyBookings()}</div>;
  if (view === 'details')     return <div style={{ fontFamily:I }}>{renderBookingDetails()}</div>;

  // Wizard
  return (
    <div style={{ fontFamily:I }}>
      <div style={{ maxWidth:'860px', margin:'0 auto' }}>
      <div style={{ marginBottom:'2rem', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h2 style={{ fontFamily:S, fontWeight:800, fontSize:'1.75rem', color:T.head, marginBottom:'5px', letterSpacing:'-0.01em' }}>Book a Consultation</h2>
          <p style={{ fontSize:'0.85rem', color:T.muted }}>Schedule an appointment with a specialist in a few steps</p>
        </div>
        <button
          onClick={openMyBookings}
          style={{ display:'flex', alignItems:'center', gap:'7px', padding:'0.55rem 1rem', borderRadius:'11px', background:T.rowBg, border:`1px solid ${T.rowBdr}`, color:T.text, fontFamily:S, fontWeight:700, fontSize:'0.68rem', cursor:'pointer', letterSpacing:'0.06em' }}
        >
          <History style={{ width:13, height:13 }} />
          MY BOOKINGS
        </button>
      </div>

      <div style={{ ...glassCard({ padding:'2rem' }) }}>
        {renderProgress()}

        <div ref={stepRef}>
          {step === 1 && renderStepDiagnosis()}
          {step === 2 && renderStepDoctor()}
          {step === 3 && renderStepMode()}
          {step === 4 && renderStepSchedule()}
          {step === 5 && renderStepReview()}
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', paddingTop:'1.25rem', borderTop:`1px solid ${T.divider}` }}>
          <button
            onClick={() => go(-1)}
            disabled={step === 1}
            style={{
              display:'flex', alignItems:'center', gap:'7px',
              padding:'0.68rem 1.2rem', borderRadius:'12px',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              background:T.rowBg, border:`1px solid ${T.rowBdr}`,
              color: step === 1 ? T.muted : T.text,
              fontFamily:S, fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.06em',
              opacity: step === 1 ? 0.38 : 1,
            }}
          >
            <ChevronLeft style={{ width:15, height:15 }} /> BACK
          </button>

          {step < 5 ? (
            <button
              onClick={() => go(1)}
              disabled={!canAdvance()}
              style={{
                display:'flex', alignItems:'center', gap:'7px',
                padding:'0.68rem 1.4rem', borderRadius:'12px',
                cursor: canAdvance() ? 'pointer' : 'not-allowed',
                background: canAdvance() ? 'linear-gradient(135deg,#22d3ee,#8b5cf6)' : T.rowBg,
                border: canAdvance() ? 'none' : `1px solid ${T.rowBdr}`,
                color: canAdvance() ? '#fff' : T.muted,
                fontFamily:S, fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.06em',
                boxShadow: canAdvance() ? '0 6px 20px rgba(34,211,238,0.35)' : 'none',
                transition:'all 0.2s ease',
              }}
            >
              {step === 1 ? (selectedDiagnosis ? 'CONTINUE' : 'SKIP & CONTINUE') : 'CONTINUE'}
              <ChevronRight style={{ width:15, height:15 }} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                display:'flex', alignItems:'center', gap:'7px',
                padding:'0.68rem 1.6rem', borderRadius:'12px',
                cursor: isSubmitting ? 'wait' : 'pointer',
                background:'linear-gradient(135deg,#22d3ee,#8b5cf6)',
                border:'none', color:'#fff',
                fontFamily:S, fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.06em',
                boxShadow:'0 6px 20px rgba(34,211,238,0.35)',
                opacity: isSubmitting ? 0.72 : 1,
                transition:'all 0.2s ease',
              }}
            >
              <CalendarCheck style={{ width:15, height:15 }} />
              {isSubmitting ? 'CONFIRMING…' : 'CONFIRM BOOKING'}
            </button>
          )}
        </div>
      </div>
      </div>

      {showSuccess && renderSuccess()}
    </div>
  );
}
