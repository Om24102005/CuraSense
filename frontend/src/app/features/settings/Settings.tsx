import { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Shield, Zap, CheckCircle, AlertCircle, Eye, EyeOff, Save, Loader2, Sparkles,
  Brain, Sliders, Activity,
  Users, UserPlus, Calendar, FlaskConical, Trash2, Plus,
  HeartPulse, Phone, BellRing,
  Globe, Languages, Ruler, Contrast, Type,
  X, ChevronDown,
  Watch, RefreshCw, Wifi, Droplets, Moon, Clock,
} from 'lucide-react';
import { useTheme } from '../../App';
import {
  useAppSettings,
  type AppLanguage,
  type ExplainLevel,
  type OutputDepth,
  type Dependent,
  type EmergencyContact,
} from '../../state/AppSettingsContext';
import { getWearableStatus, syncAppleHealth, updateProfile, changePassword, type WearableData } from '../../services/api';
import gsap from 'gsap';
import { useTransition, animated } from '@react-spring/web';

// ─── CyberToast ───────────────────────────────────────────────────────────────
// Spring physics (tension/friction) for the pop-in/pop-out — distinct from the
// Motion-driven modal fades elsewhere: a toast's "pop" reads better as a spring
// than a duration/easing curve. useTransition also gives it a real exit
// animation on dismiss, which the old CSS-keyframe-only version never had.

interface ToastData {
  msg: string;
  type: 'success' | 'error';
}

interface CyberToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

function CyberToast({ toast, onClose }: CyberToastProps) {
  const transitions = useTransition(toast, {
    from: { opacity: 0, transform: 'translateX(-50%) translateY(14px) scale(0.94)' },
    enter: { opacity: 1, transform: 'translateX(-50%) translateY(0px) scale(1)' },
    leave: { opacity: 0, transform: 'translateX(-50%) translateY(10px) scale(0.96)' },
    config: { tension: 380, friction: 28 },
  });

  return transitions((style, item) => item && (
    <animated.div style={{
      position: 'fixed', bottom: '2rem', left: '50%',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '0.7rem 1.15rem',
      background: 'rgba(7,7,18,0.94)',
      border: `1px solid ${item.type === 'success' ? '#10b981' : '#ef4444'}55`,
      borderRadius: '999px',
      backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)',
      boxShadow: `0 0 36px ${item.type === 'success' ? 'rgba(16,185,129,0.22)' : 'rgba(239,68,68,0.22)'}, 0 10px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`,
      pointerEvents: 'all',
      opacity: style.opacity,
      transform: style.transform,
    }}>
      <div style={{
        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
        background: item.type === 'success' ? 'rgba(16,185,129,0.09)' : 'rgba(239,68,68,0.09)',
        border: `1px solid ${item.type === 'success' ? '#10b981' : '#ef4444'}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {item.type === 'success'
          ? <CheckCircle style={{ width: '13px', height: '13px', color: '#10b981' }} />
          : <AlertCircle style={{ width: '13px', height: '13px', color: '#ef4444' }} />
        }
      </div>
      <span style={{
        fontSize: '0.84rem', fontWeight: 600,
        color: '#eeeeff', letterSpacing: '0.01em',
        fontFamily: "var(--font-body)",
        whiteSpace: 'nowrap',
      }}>
        {item.msg}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.32)', padding: '2px',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          lineHeight: 0,
        }}
      >
        <X style={{ width: '13px', height: '13px' }} />
      </button>
    </animated.div>
  ));
}

// ─── ToggleSwitch ─────────────────────────────────────────────────────────────

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  accent?: string;
}

function ToggleSwitch({ enabled, onToggle, accent = '#22d3ee' }: ToggleSwitchProps) {
  return (
    <div
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      style={{
        width: '48px', height: '26px', borderRadius: '13px', flexShrink: 0,
        background: enabled ? accent : 'rgba(255,255,255,0.10)',
        border: `1px solid ${enabled ? accent + '60' : 'rgba(255,255,255,0.08)'}`,
        cursor: 'pointer', position: 'relative',
        transition: 'background 0.25s, box-shadow 0.25s',
        boxShadow: enabled ? `0 0 16px ${accent}55, 0 0 6px ${accent}33` : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: '3px',
        left: enabled ? '25px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 6px rgba(0,0,0,0.4)',
      }} />
    </div>
  );
}

// ─── MetricTile ───────────────────────────────────────────────────────────────

interface MetricTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status: string;
  accent: string;
  T: Record<string, string>;
}

function MetricTile({ icon, label, value, unit, status, accent, T }: MetricTileProps) {
  const hasData = value !== '—';
  const statusColors: Record<string, string> = {
    NORMAL: '#10b981', OPTIMAL: '#10b981', ADEQUATE: '#10b981',
    LOW: '#f59e0b', BORDERLINE: '#f59e0b', BRADYCARDIA: '#f59e0b',
    HIGH: '#f87171', TACHYCARDIA: '#f87171', INSUFFICIENT: '#f87171', CRITICAL: '#ef4444',
    'NO DATA': T.muted,
  };
  const statusColor = statusColors[status] ?? T.muted;

  return (
    <div style={{
      padding: '1rem 1.1rem', borderRadius: '16px',
      background: hasData ? `${accent}09` : T.rowBg,
      border: `1px solid ${hasData ? accent + '28' : T.cardBdr}`,
      transition: 'all 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.6rem' }}>
        {icon}
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '0.4rem' }}>
        <span style={{
          fontSize: '1.65rem', fontWeight: 800, color: hasData ? accent : T.muted,
          fontFamily: "var(--font-display)", lineHeight: 1,
          textShadow: hasData ? `0 0 20px ${accent}55` : 'none',
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: T.muted }}>{unit}</span>
        )}
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem',
        fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: '0.06em',
        background: `${statusColor}18`, color: statusColor,
        border: `1px solid ${statusColor}30`,
      }}>
        {status}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(isoString).toLocaleDateString();
}

function sleepLabel(mins: number): string {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function hrStatus(bpm: number): string {
  if (bpm < 60) return 'BRADYCARDIA';
  if (bpm > 100) return 'TACHYCARDIA';
  return 'NORMAL';
}

function hrvStatus(ms: number): string {
  if (ms >= 50) return 'OPTIMAL';
  if (ms >= 30) return 'NORMAL';
  return 'LOW';
}

function spo2Status(pct: number): string {
  if (pct >= 95) return 'NORMAL';
  if (pct >= 90) return 'LOW';
  return 'CRITICAL';
}

function sleepStatus(mins: number): string {
  if (mins >= 420) return 'ADEQUATE';
  if (mins >= 360) return 'BORDERLINE';
  return 'INSUFFICIENT';
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function Settings() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── Identity / Security local state (unchanged) ──────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [isSavingPw, setIsSavingPw] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', role: 'user' });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Add-form UI state (local only — not persisted) ────────────────────────
  const [newDependent, setNewDependent] = useState<Omit<Dependent, 'id'>>({
    name: '', dob: '', sex: 'male', allergies: '',
  });
  const [showAddDependent, setShowAddDependent] = useState(false);
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, 'id'>>({
    name: '', relation: '', phone: '',
  });
  const [showAddContact, setShowAddContact] = useState(false);

  // ── Per-section saving spinners ───────────────────────────────────────────
  const [isSavingAI, setIsSavingAI]             = useState(false);
  const [isSavingLocalization, setIsSavingLocal] = useState(false);

  // ── Wearable / Apple Health state ─────────────────────────────────────────
  const [wearableData, setWearableData]   = useState<WearableData | null>(null);
  const [wearableLoading, setWearableLoading] = useState(true);
  const [isSyncing, setIsSyncing]         = useState(false);

  // ── AppSettingsContext — the single source of truth ───────────────────────
  const {
    explainLevel,    setExplainLevel,
    outputDepth,     setOutputDepth,
    dependents,      setDependents,
    emergencyContacts, setEmergencyContacts,
    autoAlertsEnabled, setAutoAlertsEnabled,
    language,        setLanguage,
    highContrast,    setHighContrast,
    largeClinicalText, setLargeClinicalText,
    measurement,     setMeasurement,
    saveSettings,
    toast, showToast, clearToast,
  } = useAppSettings();

  // ── Avatar ────────────────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setAvatarError(null);
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file (PNG, JPG, GIF, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image is over 2 MB. Please pick a smaller one.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      localStorage.setItem('curasense_avatar', dataUrl);
      window.dispatchEvent(new CustomEvent('curasense:avatar', { detail: dataUrl }));
    };
    reader.onerror = () => setAvatarError('Could not read that file.');
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    localStorage.removeItem('curasense_avatar');
    window.dispatchEvent(new CustomEvent('curasense:avatar', { detail: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Dependents (auto-save on mutate) ─────────────────────────────────────
  const addDependent = async () => {
    if (!newDependent.name.trim()) return;
    const updated: Dependent[] = [
      ...dependents,
      { ...newDependent, id: crypto.randomUUID() },
    ];
    setDependents(updated);
    setNewDependent({ name: '', dob: '', sex: 'male', allergies: '' });
    setShowAddDependent(false);
    const res = await saveSettings({ dependents: updated });
    if (res.ok) showToast('Dependent profile saved.', 'success');
    else showToast(res.error ?? 'Saved locally — sync failed.', 'error');
  };

  const removeDependent = async (id: string) => {
    const updated = dependents.filter(d => d.id !== id);
    setDependents(updated);
    const res = await saveSettings({ dependents: updated });
    if (res.ok) showToast('Dependent removed.', 'success');
    else showToast(res.error ?? 'Removed locally — sync failed.', 'error');
  };

  // ── Emergency contacts (auto-save on mutate) ──────────────────────────────
  const addContact = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;
    const updated: EmergencyContact[] = [
      ...emergencyContacts,
      { ...newContact, id: crypto.randomUUID() },
    ];
    setEmergencyContacts(updated);
    setNewContact({ name: '', relation: '', phone: '' });
    setShowAddContact(false);
    const res = await saveSettings({
      emergencyProtocols: { contacts: updated, autoAlertsEnabled },
    });
    if (res.ok) showToast('Emergency contact saved.', 'success');
    else showToast(res.error ?? 'Saved locally — sync failed.', 'error');
  };

  const removeContact = async (id: string) => {
    const updated = emergencyContacts.filter(c => c.id !== id);
    setEmergencyContacts(updated);
    const res = await saveSettings({
      emergencyProtocols: { contacts: updated, autoAlertsEnabled },
    });
    if (res.ok) showToast('Contact removed.', 'success');
    else showToast(res.error ?? 'Removed locally — sync failed.', 'error');
  };

  // ── Auto-alerts toggle (auto-save) ────────────────────────────────────────
  const handleToggleAutoAlerts = async () => {
    const next = !autoAlertsEnabled;
    setAutoAlertsEnabled(next);
    const res = await saveSettings({
      emergencyProtocols: { contacts: emergencyContacts, autoAlertsEnabled: next },
    });
    if (res.ok) showToast(`Auto-Alerts ${next ? 'enabled' : 'disabled'}.`, 'success');
    else showToast(res.error ?? 'Saved locally — sync failed.', 'error');
  };

  // ── AI Preferences save ───────────────────────────────────────────────────
  const handleSaveAI = async () => {
    setIsSavingAI(true);
    const res = await saveSettings({ aiPreferences: { explainLevel, outputDepth } });
    setIsSavingAI(false);
    if (res.ok) showToast('AI preferences saved successfully.', 'success');
    else showToast(res.error ?? 'Failed to save preferences.', 'error');
  };

  // ── Localization save ─────────────────────────────────────────────────────
  const handleSaveLocalization = async () => {
    setIsSavingLocal(true);
    const res = await saveSettings({
      localization: {
        language,
        measurementStandard: measurement,
        highContrast,
        largeText: largeClinicalText,
      },
    });
    setIsSavingLocal(false);
    if (res.ok) showToast('Localization settings saved.', 'success');
    else showToast(res.error ?? 'Failed to save settings.', 'error');
  };

  // ── Wearable: fetch on mount ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setWearableLoading(true);
    getWearableStatus().then(res => {
      if (cancelled) return;
      setWearableData(res.data?.wearableData ?? null);
      setWearableLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // ── Wearable: force resync ────────────────────────────────────────────────
  // Simulates an incoming Apple Health aggregator webhook payload.
  // Values are generated within realistic physiological ranges to demonstrate
  // the full production pipeline: POST → MongoDB → DeepSeek context injection.
  const handleForceResync = async () => {
    setIsSyncing(true);
    const payload = {
      restingHeartRate:     58  + Math.floor(Math.random() * 16),
      heartRateVariability: 40  + Math.floor(Math.random() * 35),
      sleepDuration:        380 + Math.floor(Math.random() * 80),
      bloodOxygenAverage:   parseFloat((96.5 + Math.random() * 2.5).toFixed(1)),
    };
    const res = await syncAppleHealth(payload);
    setIsSyncing(false);
    if (res.data?.wearableData) {
      setWearableData(res.data.wearableData);
      showToast('Demo readings generated. They are added to your next symptom analysis.', 'success');
    } else {
      showToast(res.error ?? 'Could not save the readings. Check the server connection.', 'error');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('curasense_user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUserData(u);
      setNameDraft((d) => d || u.name || '');
    }

    const storedAvatar = localStorage.getItem('curasense_avatar');
    if (storedAvatar) setAvatar(storedAvatar);

    const ctx = gsap.context(() => {
      gsap.fromTo('.set-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'expo.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, [theme]);

  // ── Identity: change the display name (the email is the account's identity and stays read-only) ──
  const handleSaveName = async () => {
    const name = nameDraft.trim();
    if (!name || name === userData.name) return;
    setIsSavingName(true);
    const res = await updateProfile(name);
    setIsSavingName(false);
    if (res.error || !res.data?.user) return showToast(res.error ?? 'Could not save the name.', 'error');
    const next = { ...userData, name: res.data.user.name };
    localStorage.setItem('curasense_user', JSON.stringify({ ...JSON.parse(localStorage.getItem('curasense_user') || '{}'), name: next.name }));
    setUserData(next);
    setNameDraft(next.name);
    window.dispatchEvent(new Event('curasense:user'));   // the profile chip in the header re-reads it
    showToast('Name updated.', 'success');
  };

  // ── Security: change the password (the server checks the current one) ──
  const handleChangePassword = async () => {
    if (!currentPw || !newPw) return showToast('Enter your current and your new password.', 'error');
    if (newPw.length < 8) return showToast('The new password must be at least 8 characters.', 'error');
    setIsSavingPw(true);
    const res = await changePassword(currentPw, newPw);
    setIsSavingPw(false);
    if (res.error) return showToast(res.error, 'error');
    setCurrentPw('');
    setNewPw('');
    showToast('Password updated. Use it the next time you sign in.', 'success');
  };

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const T = isDark ? {
    cardBg: 'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow: '0 8px 32px rgba(0,0,0,0.5)',
    head: '#ffffff', sub: 'rgba(255,255,255,0.50)', text: '#ffffff', muted: 'rgba(255,255,255,0.45)',
    inpBg: 'rgba(255,255,255,0.06)', rowHov: 'rgba(255,255,255,0.06)', rowBg: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,255,255,0.06)',
    btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 14px rgba(99,102,241,0.4)',
    aiBg: 'rgba(139,92,246,0.06)', aiBdr: 'rgba(139,92,246,0.3)',
    succBg: 'rgba(16,185,129,0.1)', succTxt: '#34d399',
    errBg: 'rgba(239,68,68,0.1)', errTxt: '#f87171',
    infoBg: 'rgba(14,165,233,0.1)', infoTxt: '#38bdf8',
    warnBg: 'rgba(245,158,11,0.1)', warnTxt: '#fbbf24',
  } : {
    cardBg: 'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow: '0 4px 20px rgba(0,0,0,0.07)',
    head: '#0a0a1a', sub: 'rgba(10,10,26,0.50)', text: '#0a0a1a', muted: 'rgba(10,10,26,0.45)',
    inpBg: 'rgba(0,0,0,0.03)', rowHov: 'rgba(0,0,0,0.04)', rowBg: 'rgba(0,0,0,0.02)',
    divider: 'rgba(0,0,0,0.06)',
    btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 12px rgba(99,102,241,0.25)',
    aiBg: 'rgba(139,92,246,0.04)', aiBdr: 'rgba(139,92,246,0.25)',
    succBg: 'rgba(16,185,129,0.08)', succTxt: '#059669',
    errBg: 'rgba(239,68,68,0.08)', errTxt: '#dc2626',
    infoBg: 'rgba(14,165,233,0.08)', infoTxt: '#0284c7',
    warnBg: 'rgba(245,158,11,0.08)', warnTxt: '#d97706',
  };

  const S = "var(--font-display)";
  const I = "var(--font-body)";
  const glass = {
    background: T.cardBg, border: `1px solid ${T.cardBdr}`,
    boxShadow: T.shadow, backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px', padding: '1.75rem',
  };
  const inputStyle = {
    width: '100%', padding: '0.65rem 1rem', background: T.inpBg,
    border: `1px solid ${T.cardBdr}`, borderRadius: '12px',
    color: T.text, fontSize: '0.85rem', outline: 'none',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.8rem', fontWeight: 600,
    color: T.head, marginBottom: '0.4rem', fontFamily: I,
  };

  // ── Reusable helpers ──────────────────────────────────────────────────────
  const segmentCard = (
    active: boolean,
    accent: string,
    label: string,
    sub: string,
    onClick: () => void,
  ) => (
    <button
      onClick={onClick}
      style={{
        padding: '0.9rem 1rem', borderRadius: '14px', cursor: 'pointer',
        textAlign: 'left', transition: 'all 0.2s',
        border: `1px solid ${active ? accent + '55' : T.cardBdr}`,
        background: active ? `${accent}16` : T.rowBg,
        color: active ? accent : T.sub,
        boxShadow: active ? `0 0 22px ${accent}22` : 'none',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', fontFamily: S }}>{label}</div>
      <div style={{ fontSize: '0.72rem', color: active ? accent + 'bb' : T.muted, lineHeight: 1.4 }}>{sub}</div>
    </button>
  );

  const accessToggleRow = (
    enabled: boolean,
    onToggle: () => void,
    accent: string,
    icon: React.ReactNode,
    title: string,
    sub: string,
  ) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 1.25rem', borderRadius: '14px', transition: 'all 0.3s',
      background: enabled ? `${accent}0d` : T.rowBg,
      border: `1px solid ${enabled ? accent + '40' : T.cardBdr}`,
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ padding: '8px', borderRadius: '10px', flexShrink: 0, background: enabled ? `${accent}20` : 'rgba(255,255,255,0.04)' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: T.head }}>{title}</div>
          <div style={{ fontSize: '0.74rem', color: T.muted, marginTop: '2px' }}>{sub}</div>
        </div>
      </div>
      <ToggleSwitch enabled={enabled} onToggle={onToggle} accent={accent} />
    </div>
  );

  const SaveBtn = ({
    onClick, loading, label = 'Save', icon = <Save className="w-4 h-4" />, disabled = false,
  }: { onClick: () => void; loading: boolean; label?: string; icon?: React.ReactNode; disabled?: boolean }) => (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        padding: '0.65rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600,
        background: loading ? 'rgba(99,102,241,0.45)' : T.btnBg,
        color: '#fff', border: 'none',
        boxShadow: loading || disabled ? 'none' : T.btnSh,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.2s', opacity: loading ? 0.72 : disabled ? 0.5 : 1,
      }}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {loading ? 'Saving…' : label}
    </button>
  );

  const isLive = Boolean(wearableData?.lastSyncedAt);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div ref={ref} style={{ fontFamily: I, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Cyberpunk Toast ─────────────────────────────────────────────────── */}
      <CyberToast toast={toast} onClose={clearToast} />

      {/* ── Admin Global Controls ──────────────────────────────────────────── */}
      {userData.role === 'admin' && (
        <div className="set-card" style={{ ...glass, background: T.aiBg, border: `1px solid ${T.aiBdr}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Sparkles className="w-5 h-5 text-fuchsia-500" /> Admin Global Controls
              </h3>
              <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>Where the AI runs and who can see this page</p>
            </div>
            <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, fontFamily: S, background: 'linear-gradient(135deg,#d946ef,#8b5cf6)', color: '#fff', letterSpacing: '0.05em' }}>ADMIN ONLY</span>
          </div>

          <div style={{ padding: '1rem', background: T.rowBg, borderRadius: '12px', border: `1px dashed ${T.cardBdr}`, display: 'flex', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(139,92,246,0.15)', borderRadius: '8px', flexShrink: 0, alignSelf: 'flex-start' }}><Zap className="w-5 h-5 text-purple-500" /></div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: T.head, marginBottom: '4px' }}>Model pipeline</h4>
              <p style={{ fontSize: '0.75rem', color: T.muted, lineHeight: 1.55 }}>
                Every analysis is sent through the CuraSense server to the DeepSeek API. The keys for it are set on the server, in its environment file, and cannot be changed from the browser.
                The live status of the server, the AI service and the database is on the Access page.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Identity Information ──────────────────────────────────────────── */}
      <div className="set-card" style={glass}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}>
            <User className="w-5 h-5 text-blue-500" /> Identity Information
          </h3>
          <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>Manage your verified system identity</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
            background: userData.role === 'admin' ? 'linear-gradient(135deg,#d946ef,#8b5cf6)' : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1.75rem', fontWeight: 800, fontFamily: S,
            border: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {avatar ? (
              <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              userData.name.substring(0, 2).toUpperCase() || 'US'
            )}
          </div>

          <div>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handlePhotoChange} style={{ display: 'none' }} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <button onClick={() => fileInputRef.current?.click()} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, background: T.btnBg, color: '#fff', border: 'none', cursor: 'pointer', boxShadow: T.btnSh }}>
                {avatar ? 'Change Photo' : 'Upload Photo'}
              </button>
              {avatar && (
                <button onClick={handleRemovePhoto} style={{ padding: '0.5rem 0.85rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, background: 'transparent', border: `1px solid ${T.cardBdr}`, color: T.muted, cursor: 'pointer' }}>
                  Remove
                </button>
              )}
            </div>
            {avatarError ? (
              <p style={{ fontSize: '0.7rem', color: '#f87171' }}>{avatarError}</p>
            ) : (
              <p style={{ fontSize: '0.7rem', color: T.muted }}>Verified clearance: {userData.role.toUpperCase()} · PNG/JPG up to 2 MB</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
          <div><label htmlFor="settings-name" style={labelStyle}>Full Name / Handle</label><input id="settings-name" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); }} maxLength={80} autoComplete="name" style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>System Email</label>
            <div style={{ position: 'relative' }}><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.muted }}/><input type="email" defaultValue={userData.email} style={{ ...inputStyle, paddingLeft: '2.5rem' }} disabled /></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <SaveBtn onClick={handleSaveName} loading={isSavingName} label="Save name" disabled={!nameDraft.trim() || nameDraft.trim() === userData.name} />
        </div>
      </div>

      {/* ── Security & Privacy ────────────────────────────────────────────── */}
      <div className="set-card" style={glass}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}><Shield className="w-5 h-5 text-green-500" /> Security & Privacy</h3>
          <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>Change the password you sign in with. Your authenticator app stays as it is.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
          <div>
            <label htmlFor="settings-current-password" style={labelStyle}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input id="settings-current-password" type={showPassword ? 'text' : 'password'} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} autoComplete="current-password" placeholder="••••••••" style={{ ...inputStyle, paddingRight: '2.5rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide passwords' : 'Show passwords'} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: T.muted, cursor: 'pointer' }}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </div>
          <div>
            <label htmlFor="settings-new-password" style={labelStyle}>New Password</label>
            <input id="settings-new-password" type={showPassword ? 'text' : 'password'} value={newPw} onChange={(e) => setNewPw(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleChangePassword(); }} autoComplete="new-password" placeholder="At least 8 characters" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveBtn onClick={handleChangePassword} loading={isSavingPw} label="Update password" disabled={!currentPw || !newPw} />
        </div>
      </div>

      {/* ── AI Inference Preferences ──────────────────────────────────────── */}
      <div className="set-card" style={glass}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Brain className="w-5 h-5 text-cyan-400" /> AI Inference Preferences
          </h3>
          <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>
            Saved to your account. The AI does not use these choices yet, so they do not change its answers.
          </p>
        </div>

        {/* Explainability Level */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
            <Sliders className="w-4 h-4 text-cyan-400" style={{ flexShrink: 0 }} /> Explainability Level
          </label>
          <p style={{ fontSize: '0.75rem', color: T.muted, marginBottom: '0.85rem' }}>
            The vocabulary and tone you would like
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {segmentCard(explainLevel === 'clinical', '#22d3ee', 'Clinical & Professional', 'Full medical terminology and clinical reasoning, written for healthcare professionals', () => setExplainLevel('clinical'))}
            {segmentCard(explainLevel === 'simple',   '#a855f7', 'Simple & Empathetic',      'Plain-language summaries written for patients — no jargon, empathetic tone',             () => setExplainLevel('simple'))}
          </div>
        </div>

        {/* Output Depth */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
            <Activity className="w-4 h-4 text-violet-400" style={{ flexShrink: 0 }} /> Output Depth
          </label>
          <p style={{ fontSize: '0.75rem', color: T.muted, marginBottom: '0.85rem' }}>
            How much detail you would like
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {segmentCard(outputDepth === 'concise',       '#10b981', 'Concise Summaries',       'Key findings, urgency level, and top recommendation — optimised for speed',                              () => setOutputDepth('concise'))}
            {segmentCard(outputDepth === 'comprehensive', '#f59e0b', 'Comprehensive Deep-Dive', 'Full differential diagnosis, biomarker analysis, treatment plans, and specialist referral guidance', () => setOutputDepth('comprehensive'))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveBtn onClick={handleSaveAI} loading={isSavingAI} label="Save Preferences" />
        </div>
      </div>

      {/* ── Dependent & Family Management ─────────────────────────────────── */}
      <div className="set-card" style={glass}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Users className="w-5 h-5 text-sky-400" /> Dependent & Family Management
            </h3>
            <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>
              Manage linked profiles to analyse symptoms on behalf of family members
            </p>
          </div>
          <button
            onClick={() => setShowAddDependent(v => !v)}
            style={{
              padding: '0.45rem 0.9rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600,
              background: showAddDependent ? 'transparent' : 'rgba(38,103,255,0.10)',
              border: `1px solid ${showAddDependent ? T.cardBdr : 'rgba(38,103,255,0.30)'}`,
              color: showAddDependent ? T.muted : '#22d3ee',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
            }}
          >
            {showAddDependent ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddDependent ? 'Cancel' : 'Add Dependent'}
          </button>
        </div>

        {/* Dependent list */}
        {dependents.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1rem' }}>
            {dependents.map(dep => (
              <div key={dep.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '12px', background: T.rowBg, border: `1px solid ${T.cardBdr}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(38,103,255,0.15),rgba(139,92,246,0.15))', border: '1px solid rgba(38,103,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: T.head }}>{dep.name}</div>
                    <div style={{ fontSize: '0.72rem', color: T.muted, marginTop: '1px' }}>
                      {dep.dob && <>DOB: {dep.dob} · </>}
                      {dep.sex === 'prefer_not' ? 'Prefer not to say' : dep.sex.charAt(0).toUpperCase() + dep.sex.slice(1)}
                      {dep.allergies && <> · <span style={{ color: T.warnTxt }}>⚠ {dep.allergies}</span></>}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeDependent(dep.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: '6px', borderRadius: '8px' }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {dependents.length === 0 && !showAddDependent && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: T.rowBg, borderRadius: '14px', border: `1px dashed ${T.cardBdr}`, marginBottom: '0.25rem' }}>
            <Users className="w-8 h-8 text-cyan-400" style={{ opacity: 0.3, margin: '0 auto 10px', display: 'block' }} />
            <p style={{ fontSize: '0.82rem', color: T.muted }}>No dependents added yet.</p>
            <p style={{ fontSize: '0.75rem', color: T.muted, marginTop: '4px' }}>Add a family member or patient to run diagnostics on their behalf.</p>
          </div>
        )}

        {/* Add Dependent form */}
        {showAddDependent && (
          <div style={{ padding: '1.25rem', background: 'rgba(38,103,255,0.04)', border: '1px solid rgba(38,103,255,0.14)', borderRadius: '14px' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#22d3ee', marginBottom: '1rem', fontFamily: S }}>New Dependent Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}><UserPlus className="w-4 h-4 inline mr-1" style={{ verticalAlign: '-3px' }} /> Full Name</label>
                <input value={newDependent.name} onChange={e => setNewDependent(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sarah Johnson" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><Calendar className="w-4 h-4 inline mr-1" style={{ verticalAlign: '-3px' }} /> Date of Birth</label>
                <input type="date" value={newDependent.dob} onChange={e => setNewDependent(p => ({ ...p, dob: e.target.value }))} style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' } as React.CSSProperties} />
              </div>
              <div>
                <label style={labelStyle}>Biological Sex</label>
                <select value={newDependent.sex} onChange={e => setNewDependent(p => ({ ...p, sex: e.target.value as Dependent['sex'] }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}><FlaskConical className="w-4 h-4 inline mr-1" style={{ verticalAlign: '-3px' }} /> Known Allergies</label>
                <input value={newDependent.allergies} onChange={e => setNewDependent(p => ({ ...p, allergies: e.target.value }))} placeholder="e.g. Penicillin, Peanuts" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => { setShowAddDependent(false); setNewDependent({ name: '', dob: '', sex: 'male', allergies: '' }); }} style={{ padding: '0.55rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, background: 'transparent', border: `1px solid ${T.cardBdr}`, color: T.muted, cursor: 'pointer' }}>Cancel</button>
              <button onClick={addDependent} disabled={!newDependent.name.trim()} style={{ padding: '0.55rem 1.25rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#fff', border: 'none', cursor: newDependent.name.trim() ? 'pointer' : 'not-allowed', opacity: newDependent.name.trim() ? 1 : 0.45, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus className="w-4 h-4" /> Add Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Emergency Protocols ────────────────────────────────────────────── */}
      <div className="set-card" style={glass}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}>
            <HeartPulse className="w-5 h-5 text-red-400" /> Emergency Protocols
          </h3>
          <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>
            Configure contacts and automated alert actions for critical AI-flagged conditions
          </p>
        </div>

        {/* Emergency Contacts */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <label style={{ ...labelStyle, marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone className="w-4 h-4 text-red-400" style={{ flexShrink: 0 }} /> Emergency Contacts
            </label>
            <button
              onClick={() => setShowAddContact(v => !v)}
              style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, background: showAddContact ? 'transparent' : 'rgba(239,68,68,0.10)', border: `1px solid ${showAddContact ? T.cardBdr : 'rgba(239,68,68,0.30)'}`, color: showAddContact ? T.muted : '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
            >
              {showAddContact ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {showAddContact ? 'Cancel' : 'Add Contact'}
            </button>
          </div>

          {/* Contact list */}
          {emergencyContacts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: showAddContact ? '0.85rem' : 0 }}>
              {emergencyContacts.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '12px', background: T.rowBg, border: `1px solid ${T.cardBdr}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: T.head }}>
                        {c.name} {c.relation && <span style={{ fontWeight: 400, fontSize: '0.78rem', color: T.muted }}>· {c.relation}</span>}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: T.muted, marginTop: '1px' }}>{c.phone}</div>
                    </div>
                  </div>
                  <button onClick={() => removeContact(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: '6px', borderRadius: '8px' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {emergencyContacts.length === 0 && !showAddContact && (
            <div style={{ padding: '1rem', background: T.rowBg, borderRadius: '12px', border: `1px dashed ${T.cardBdr}`, marginBottom: '0.25rem' }}>
              <p style={{ fontSize: '0.8rem', color: T.muted, textAlign: 'center' }}>No emergency contacts added. Add at least one contact to enable Auto-Alerts.</p>
            </div>
          )}

          {/* Add Contact form */}
          {showAddContact && (
            <div style={{ padding: '1.25rem', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.14)', borderRadius: '14px' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3" style={{ marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Dr. Jane Smith" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Relation</label>
                  <input value={newContact.relation} onChange={e => setNewContact(p => ({ ...p, relation: e.target.value }))} placeholder="e.g. Mother, Cardiologist" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><Phone className="w-4 h-4 inline mr-1" style={{ verticalAlign: '-3px' }} /> Phone Number</label>
                  <input type="tel" value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => { setShowAddContact(false); setNewContact({ name: '', relation: '', phone: '' }); }} style={{ padding: '0.55rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, background: 'transparent', border: `1px solid ${T.cardBdr}`, color: T.muted, cursor: 'pointer' }}>Cancel</button>
                <button onClick={addContact} disabled={!newContact.name.trim() || !newContact.phone.trim()} style={{ padding: '0.55rem 1.25rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', border: 'none', cursor: (newContact.name.trim() && newContact.phone.trim()) ? 'pointer' : 'not-allowed', opacity: (newContact.name.trim() && newContact.phone.trim()) ? 1 : 0.45, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus className="w-4 h-4" /> Add Contact
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Auto-Alerts toggle */}
        <div style={{
          padding: '1.1rem 1.25rem', borderRadius: '14px', transition: 'all 0.3s',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: autoAlertsEnabled ? 'rgba(239,68,68,0.08)' : T.rowBg,
          border: `1px solid ${autoAlertsEnabled ? 'rgba(239,68,68,0.35)' : T.cardBdr}`,
          boxShadow: autoAlertsEnabled ? '0 0 28px rgba(239,68,68,0.10)' : 'none',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ padding: '8px', borderRadius: '10px', flexShrink: 0, background: autoAlertsEnabled ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)', transition: 'background 0.3s' }}>
              <BellRing className="w-5 h-5" style={{ color: autoAlertsEnabled ? '#f87171' : T.muted }} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: autoAlertsEnabled ? '#f87171' : T.head, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Enable Auto-Alerts
                {autoAlertsEnabled && (
                  <span style={{ fontSize: '0.62rem', fontFamily: S, padding: '2px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.18)', color: '#f87171', letterSpacing: '0.08em' }}>ACTIVE</span>
                )}
              </div>
              <div style={{ fontSize: '0.74rem', color: T.muted, marginTop: '3px', maxWidth: '480px', lineHeight: 1.5 }}>
                When a result is marked <strong style={{ color: '#f87171' }}>emergency</strong>, or a scan page <strong style={{ color: '#f87171' }}>critical</strong>, a panel under it offers Call and Message buttons for your contacts. CuraSense never calls or sends anything itself: you press the button.
              </div>
            </div>
          </div>
          <ToggleSwitch enabled={autoAlertsEnabled} onToggle={handleToggleAutoAlerts} accent="#ef4444" />
        </div>
      </div>

      {/* ── Localization & Accessibility ──────────────────────────────────── */}
      <div className="set-card" style={glass}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Globe className="w-5 h-5 text-emerald-400" /> Localization & Accessibility
          </h3>
          <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>
            Customise measurement units, AI output language, and visual accessibility options
          </p>
        </div>

        {/* Measurement Standard */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
            <Ruler className="w-4 h-4 text-emerald-400" style={{ flexShrink: 0 }} /> Measurement Standard
          </label>
          <p style={{ fontSize: '0.75rem', color: T.muted, marginBottom: '0.85rem' }}>
            Affects units shown in biomarker panels, dosage recommendations, and vital signs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {segmentCard(measurement === 'metric',   '#10b981', 'Metric System',   'kg · cm · °C · mmol/L · kPa', () => setMeasurement('metric'))}
            {segmentCard(measurement === 'imperial', '#f59e0b', 'Imperial System', 'lbs · in · °F · mg/dL · psi',  () => setMeasurement('imperial'))}
          </div>
        </div>

        {/* Language */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
            <Languages className="w-4 h-4 text-sky-400" style={{ flexShrink: 0 }} /> Default AI Output Language
          </label>
          <div style={{ position: 'relative' }}>
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#38bdf8', pointerEvents: 'none' }} />
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as AppLanguage)}
              className="appearance-none"
              style={{ ...inputStyle, paddingLeft: '2.5rem', paddingRight: '2.5rem', cursor: 'pointer' }}
            >
              <option value="en">English</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="de">Deutsch (German)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="zh">中文 (Chinese Simplified)</option>
              <option value="ja">日本語 (Japanese)</option>
              <option value="pt">Português (Portuguese)</option>
              <option value="ru">Русский (Russian)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.muted, pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Accessibility toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
          {accessToggleRow(
            highContrast,
            () => setHighContrast(!highContrast),
            '#94a3b8',
            <Contrast className="w-5 h-5" style={{ color: highContrast ? '#94a3b8' : T.muted }} />,
            'High Contrast Mode',
            'Increases border and text contrast for improved readability in clinical environments',
          )}
          {accessToggleRow(
            largeClinicalText,
            () => setLargeClinicalText(!largeClinicalText),
            '#0ea5e9',
            <Type className="w-5 h-5" style={{ color: largeClinicalText ? '#38bdf8' : T.muted }} />,
            'Large Clinical Text',
            'Increases font size inside lab reports, biomarker panels, and dense AI output sections',
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveBtn onClick={handleSaveLocalization} loading={isSavingLocalization} label="Save Settings" />
        </div>
      </div>

      {/* ── Connected Devices & Wearables ─────────────────────────────────── */}
      <div className="set-card" style={glass}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Watch className="w-5 h-5" style={{ color: '#22d3ee' }} /> Connected Devices & Wearables
            </h3>
            <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>
              Demonstration: these numbers are generated on this page, not read from a watch. Real Apple Health sync will come with the iPhone app.
            </p>
          </div>

          {/* Live / Not Connected pill */}
          <div style={{
            padding: '5px 13px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700,
            fontFamily: S, letterSpacing: '0.06em', flexShrink: 0,
            background: isLive
              ? 'linear-gradient(135deg,rgba(16,185,129,0.14),rgba(38,103,255,0.14))'
              : 'rgba(255,255,255,0.05)',
            border: isLive
              ? '1px solid rgba(16,185,129,0.35)'
              : `1px solid ${T.cardBdr}`,
            color: isLive ? '#34d399' : T.muted,
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
              background: isLive ? '#34d399' : T.muted,
              boxShadow: isLive ? '0 0 9px #34d399' : 'none',
              animation: isLive ? '_wPulse 2s ease-in-out infinite' : 'none',
            }} />
            {isLive ? 'DEMO DATA' : 'NO DATA'}
          </div>

          <style>{`
            @keyframes _wPulse {
              0%,100% { opacity:1; box-shadow:0 0 9px #34d399; }
              50%      { opacity:0.55; box-shadow:0 0 18px #34d39988; }
            }
          `}</style>
        </div>

        {/* Body */}
        {wearableLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', gap: '14px' }}>
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#22d3ee' }} />
            <span style={{ fontSize: '0.85rem', color: T.muted }}>Loading…</span>
          </div>
        ) : (
          <>
            {/* ── AI Injection Notice ─────────────────────────────────── */}
            {isLive && (
              <div style={{
                padding: '0.85rem 1.1rem', borderRadius: '12px', marginBottom: '1.25rem',
                background: 'rgba(38,103,255,0.06)', border: '1px solid rgba(38,103,255,0.18)',
                display: 'flex', gap: '10px', alignItems: 'flex-start',
              }}>
                <Wifi className="w-4 h-4" style={{ color: '#22d3ee', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.75rem', color: T.sub, lineHeight: 1.55 }}>
                  <strong style={{ color: '#22d3ee' }}>Demo readings in use.</strong>{' '}
                  These generated numbers are added to your symptom analyses as if a watch had measured them. They are not real measurements, so do not rely on them for your health.
                </div>
              </div>
            )}

            {/* ── Metric Grid ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '1.25rem' }}>
              <MetricTile
                icon={<HeartPulse className="w-4 h-4" style={{ color: '#f87171' }} />}
                label="Resting Heart Rate"
                value={wearableData?.restingHeartRate != null ? String(wearableData.restingHeartRate) : '—'}
                unit="BPM"
                status={wearableData?.restingHeartRate != null ? hrStatus(wearableData.restingHeartRate) : 'NO DATA'}
                accent="#f87171"
                T={T}
              />
              <MetricTile
                icon={<Activity className="w-4 h-4" style={{ color: '#a855f7' }} />}
                label="Heart Rate Variability"
                value={wearableData?.heartRateVariability != null ? String(wearableData.heartRateVariability) : '—'}
                unit="ms"
                status={wearableData?.heartRateVariability != null ? hrvStatus(wearableData.heartRateVariability) : 'NO DATA'}
                accent="#a855f7"
                T={T}
              />
              <MetricTile
                icon={<Droplets className="w-4 h-4" style={{ color: '#38bdf8' }} />}
                label="Blood Oxygen (SpO₂)"
                value={wearableData?.bloodOxygenAverage != null ? wearableData.bloodOxygenAverage.toFixed(1) : '—'}
                unit="%"
                status={wearableData?.bloodOxygenAverage != null ? spo2Status(wearableData.bloodOxygenAverage) : 'NO DATA'}
                accent="#38bdf8"
                T={T}
              />
              <MetricTile
                icon={<Moon className="w-4 h-4" style={{ color: '#818cf8' }} />}
                label="Sleep Duration"
                value={wearableData?.sleepDuration != null ? sleepLabel(wearableData.sleepDuration) : '—'}
                unit=""
                status={wearableData?.sleepDuration != null ? sleepStatus(wearableData.sleepDuration) : 'NO DATA'}
                accent="#818cf8"
                T={T}
              />
            </div>

            {/* ── Footer: last sync + resync ───────────────────────────── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingTop: '1rem', borderTop: `1px solid ${T.divider}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: T.muted }}>
                <Clock className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
                {isLive
                  ? `Generated: ${formatRelativeTime(wearableData!.lastSyncedAt!)}`
                  : 'No demo readings yet. Tap the button to generate some.'}
              </div>

              <button
                onClick={handleForceResync}
                disabled={isSyncing}
                style={{
                  padding: '0.55rem 1.1rem', borderRadius: '10px',
                  fontSize: '0.8rem', fontWeight: 600,
                  background: isSyncing ? 'rgba(38,103,255,0.08)' : 'rgba(38,103,255,0.10)',
                  border: '1px solid rgba(38,103,255,0.30)',
                  color: '#22d3ee', cursor: isSyncing ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s', opacity: isSyncing ? 0.65 : 1,
                  boxShadow: isSyncing ? 'none' : '0 0 18px rgba(38,103,255,0.12)',
                }}
              >
                {isSyncing
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <RefreshCw className="w-3.5 h-3.5" />}
                {isSyncing ? 'Generating…' : 'Generate demo readings'}
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
