import { useState, useEffect, useRef, JSX } from 'react';
import { createPortal } from 'react-dom';
import {
  Stethoscope, Activity, FileText, Clock, TrendingUp,
  History as HistoryIcon, Heart, X, CircleCheck, AlertTriangle,
  ShieldAlert, FlaskConical, Microscope, Brain,
} from 'lucide-react';
import type { Prediction } from '../App';
import { useTheme } from '../App';
import gsap from 'gsap';
import MedicalAIOutput from './effects/MedicalAIOutput';

interface PredictionHistoryProps {
  predictions: Prediction[];
  onLike?: (id: string) => void;
}

const URGENCY_MAP = {
  low:       { label: 'ALL CLEAR',   color: '#10b981', emoji: '🟢', sub: 'Self-care is appropriate.' },
  medium:    { label: 'MONITOR',     color: '#f59e0b', emoji: '🟡', sub: 'See a doctor in the next day or two.' },
  high:      { label: 'CONCERNING',  color: '#f97316', emoji: '🟠', sub: 'Consult a physician today.' },
  emergency: { label: 'EMERGENCY',   color: '#ef4444', emoji: '🚨', sub: 'Seek immediate medical attention.' },
} as const;

const TYPE_COLORS: Record<string, string> = { symptom: '#0ea5e9', image: '#8b5cf6', report: '#ec4899' };
const TYPE_LABELS: Record<string, string>  = { symptom: 'Symptom Analysis', image: 'Image Analysis', report: 'Report Analysis' };
const TYPE_ICONS:  Record<string, JSX.Element> = {
  symptom: <Stethoscope className="w-4 h-4" />,
  image:   <Activity className="w-4 h-4" />,
  report:  <FileText className="w-4 h-4" />,
};

function formatDate(date: Date | string | number | null | undefined) {
  const d = date instanceof Date ? date : new Date(date as any);
  if (isNaN(d.getTime())) return '—';
  const now  = new Date(); const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24)  return `${hrs}h ago`;
  if (days < 7)  return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatAbsolute(date: Date | string | number | null | undefined) {
  const d = date instanceof Date ? date : new Date(date as any);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Full Report Modal ─────────────────────────────────────────────────────────

function FullReportModal({ p, onClose, isDark }: { p: Prediction; onClose: () => void; isDark: boolean }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";
  const typeColor = TYPE_COLORS[p.type] || '#8b5cf6';

  const T = isDark ? {
    panel:   'rgba(8,8,20,0.99)',
    bdr:     'rgba(255,255,255,0.09)',
    head:    '#ffffff',
    text:    '#e2e8f0',
    muted:   'rgba(255,255,255,0.42)',
    rowBg:   'rgba(255,255,255,0.04)',
    rowBdr:  'rgba(255,255,255,0.08)',
    divider: 'rgba(255,255,255,0.07)',
    track:   'rgba(255,255,255,0.08)',
  } : {
    panel:   'rgba(255,255,255,0.99)',
    bdr:     'rgba(0,0,0,0.09)',
    head:    '#0a0a1a',
    text:    '#1e293b',
    muted:   'rgba(10,10,26,0.45)',
    rowBg:   'rgba(0,0,0,0.025)',
    rowBdr:  'rgba(0,0,0,0.07)',
    divider: 'rgba(0,0,0,0.06)',
    track:   'rgba(0,0,0,0.08)',
  };

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'power3.out' }
    );
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const urgencyKey = p.urgency && URGENCY_MAP[p.urgency] ? p.urgency : null;
  const urgency    = urgencyKey ? URGENCY_MAP[urgencyKey] : null;

  const Sec = ({ icon, title, children }: { icon: JSX.Element; title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: '1.25rem', padding: '1.1rem 1.25rem', borderRadius: '16px', background: T.rowBg, border: `1px solid ${T.rowBdr}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.9rem', paddingBottom: '0.6rem', borderBottom: `1px solid ${T.divider}` }}>
        <span style={{ color: typeColor }}>{icon}</span>
        <span style={{ fontFamily: S, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em', color: T.muted, textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );

  return createPortal((
    <>
      <style>{`
        .fr-scroll::-webkit-scrollbar { width: 4px; }
        .fr-scroll::-webkit-scrollbar-track { background: transparent; }
        .fr-scroll::-webkit-scrollbar-thumb { background: ${typeColor}55; border-radius: 999px; }
        .fr-scroll::-webkit-scrollbar-thumb:hover { background: ${typeColor}99; }
        @keyframes frIn { from { opacity:0 } to { opacity:1 } }
        @keyframes frPulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.15) } }
      `}</style>

      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9200,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          animation: 'frIn 0.22s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.25rem',
        }}
      >
        <div
          ref={panelRef}
          onClick={e => e.stopPropagation()}
          style={{
            background: T.panel,
            border: `1px solid ${T.bdr}`,
            borderRadius: '22px',
            boxShadow: `0 36px 90px rgba(0,0,0,0.65), 0 0 0 1px ${typeColor}22`,
            backdropFilter: 'blur(36px)', WebkitBackdropFilter: 'blur(36px)',
            width: '100%', maxWidth: '820px',
            maxHeight: 'calc(100vh - 2.5rem)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden', fontFamily: I,
          }}
        >
          {/* ── Header ── */}
          <div style={{
            padding: '1.4rem 2rem', flexShrink: 0,
            borderBottom: `1px solid ${T.divider}`,
            background: `linear-gradient(135deg, ${typeColor}0a 0%, transparent 55%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <span style={{
                  display: 'inline-block', padding: '2px 10px', borderRadius: '999px', marginBottom: '7px',
                  fontSize: '0.59rem', fontWeight: 700, fontFamily: S, letterSpacing: '0.12em',
                  background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30`, textTransform: 'uppercase',
                }}>
                  {TYPE_LABELS[p.type]} · Full Report
                </span>
                <h2 style={{ fontFamily: S, fontWeight: 800, fontSize: '1.4rem', color: T.head, marginBottom: '5px', lineHeight: 1.2 }}>
                  {p.diagnosis}
                </h2>
                <div style={{ fontSize: '0.73rem', color: T.muted, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock style={{ width: 11, height: 11 }} />
                  {formatAbsolute(p.timestamp)}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: T.rowBg, border: `1px solid ${T.rowBdr}`, color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>

            {/* Confidence — prominent */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <span style={{ fontFamily: S, fontSize: '0.62rem', letterSpacing: '0.14em', color: T.muted }}>OVERALL CONFIDENCE</span>
                <span style={{ fontFamily: S, fontWeight: 800, fontSize: '1.1rem', color: p.confidence >= 80 ? '#10b981' : '#f59e0b' }}>
                  {p.confidence}%
                </span>
              </div>
              <div style={{ height: '9px', background: T.track, borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${p.confidence}%`, borderRadius: '999px',
                  background: `linear-gradient(90deg, ${typeColor}, ${typeColor}cc)`,
                  boxShadow: `0 0 16px ${typeColor}88`,
                  transition: 'width 1.1s cubic-bezier(0.34,1.56,0.64,1)',
                }} />
              </div>
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div
            data-lenis-prevent
            className="fr-scroll"
            style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', padding: '1.5rem 2rem' }}
          >
            {/* 1. Urgency */}
            <Sec icon={<ShieldAlert style={{ width: 14, height: 14 }} />} title="Urgency Assessment">
              {urgency ? (
                <div style={{ padding: '1rem 1.15rem', borderRadius: '14px', background: `${urgency.color}12`, border: `1px solid ${urgency.color}45`, boxShadow: `0 0 30px -10px ${urgency.color}55`, display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '2.4rem', lineHeight: 1, animation: urgencyKey === 'emergency' ? 'frPulse 1.2s ease-in-out infinite' : undefined }}>
                    {urgency.emoji}
                  </span>
                  <div>
                    <div style={{ fontFamily: S, fontWeight: 800, fontSize: '1.05rem', color: urgency.color, letterSpacing: '0.04em', marginBottom: '3px' }}>{urgency.label}</div>
                    <div style={{ fontSize: '0.83rem', color: T.text }}>{urgency.sub}</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '0.9rem 1rem', borderRadius: '12px', background: T.rowBg, border: `1px dashed ${T.rowBdr}`, fontSize: '0.8rem', color: T.muted, textAlign: 'center', lineHeight: 1.6 }}>
                  Urgency data not available for this record.<br />Run a new analysis to capture full triage information.
                </div>
              )}
            </Sec>

            {/* 2. Clinical Assessment */}
            {p.details && (
              <Sec icon={<Brain style={{ width: 14, height: 14 }} />} title="Clinical Assessment">
                <MedicalAIOutput text={p.details} isDark={isDark} textColor={T.text} mutedColor={T.muted} />
              </Sec>
            )}

            {/* 3. Differential Diagnosis */}
            <Sec icon={<Microscope style={{ width: 14, height: 14 }} />} title="Differential Diagnosis — Potential Conditions">
              {p.conditions && p.conditions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.conditions.map((c, i) => {
                    const pct      = Math.max(0, Math.min(100, c.probability));
                    const barColor = i === 0 ? (urgency?.color || typeColor) : (isDark ? '#6366f1' : '#4f46e5');
                    return (
                      <div key={i} style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${T.rowBdr}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {i === 0 && (
                              <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.59rem', fontWeight: 700, fontFamily: S, letterSpacing: '0.1em', background: `${barColor}22`, color: barColor, border: `1px solid ${barColor}40` }}>
                                TOP MATCH
                              </span>
                            )}
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: T.head }}>{c.name}</span>
                          </div>
                          <span style={{ fontFamily: S, fontWeight: 800, fontSize: '1rem', color: barColor }}>{pct}%</span>
                        </div>
                        <div style={{ height: '7px', background: T.track, borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: '999px', background: `linear-gradient(90deg, ${barColor}, ${barColor}bb)`, boxShadow: `0 0 10px ${barColor}77`, transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '0.9rem 1rem', borderRadius: '12px', background: T.rowBg, border: `1px dashed ${T.rowBdr}`, fontSize: '0.8rem', color: T.muted, textAlign: 'center', lineHeight: 1.6 }}>
                  Condition probability data not available for this record.<br />Run a new analysis for a full differential diagnosis.
                </div>
              )}
            </Sec>

            {/* 4. Blood Biomarkers */}
            {p.biomarkers && p.biomarkers.length > 0 && (
              <Sec icon={<FlaskConical style={{ width: 14, height: 14 }} />} title="Blood Biomarker Panel">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.biomarkers.map((b, i) => {
                    const ST: Record<string, { c: string; bg: string; border: string; label: string; arrow: string }> = {
                      critical: { c: '#f87171', bg: 'rgba(248,113,113,0.13)', border: 'rgba(248,113,113,0.35)', label: 'CRITICAL', arrow: '⚠' },
                      high:     { c: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)',  label: 'HIGH',     arrow: '↑' },
                      low:      { c: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.30)',  label: 'LOW',      arrow: '↓' },
                      normal:   { c: '#34d399', bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.25)',  label: 'NORMAL',   arrow: '✓' },
                    };
                    const key  = (b.status || 'normal').toLowerCase();
                    const st   = ST[key] || ST.normal;
                    const val  = typeof b.value === 'number' ? b.value : parseFloat(String(b.value)) || 0;
                    const nMin = b.normal_min ?? 0;
                    const nMax = b.normal_max ?? 0;
                    const hasRange   = nMax > 0;
                    const displayMax = hasRange ? Math.max(nMax * 1.5, val * 1.05) : val * 1.3 || 100;
                    const valPct     = Math.min(100, Math.max(0, (val / displayMax) * 100));
                    const nMinPct    = hasRange ? Math.min(100, (nMin / displayMax) * 100) : 0;
                    const nMaxPct    = hasRange ? Math.min(100, (nMax / displayMax) * 100) : 100;
                    const formattedVal = Number.isInteger(val) ? val : val.toFixed(1);
                    return (
                      <div key={i} style={{ padding: '0.9rem 1.1rem', borderRadius: '13px', background: T.rowBg, border: `1px solid ${st.border}`, boxShadow: key !== 'normal' ? `0 0 20px -8px ${st.c}55` : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: hasRange ? '10px' : 0 }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: T.head }}>{b.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: S, fontWeight: 800, fontSize: '1.05rem', color: st.c }}>
                              {formattedVal}
                              {b.unit && <span style={{ fontSize: '0.72rem', color: T.muted, marginLeft: '3px' }}>{b.unit}</span>}
                            </span>
                            <span style={{ padding: '2px 9px', borderRadius: '999px', fontSize: '0.64rem', fontWeight: 800, fontFamily: S, color: st.c, background: st.bg, border: `1px solid ${st.border}` }}>
                              {st.arrow} {st.label}
                            </span>
                          </div>
                        </div>
                        {hasRange && (
                          <>
                            <div style={{ position: 'relative', height: '10px', borderRadius: '999px', overflow: 'visible' }}>
                              <div style={{ position: 'absolute', inset: 0, background: T.track, borderRadius: '999px' }} />
                              <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${nMinPct}%`, width: `${nMaxPct - nMinPct}%`, background: 'rgba(52,211,153,0.22)', borderRadius: '4px' }} />
                              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${valPct}%`, background: `linear-gradient(90deg, ${st.c}55, ${st.c})`, borderRadius: '999px' }} />
                              <div style={{ position: 'absolute', top: '50%', left: `${valPct}%`, transform: 'translate(-50%, -50%)', width: 14, height: 14, borderRadius: '50%', background: st.c, boxShadow: `0 0 10px ${st.c}, 0 0 0 3px ${isDark ? '#06060f' : '#fff'}`, zIndex: 1 }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.67rem', color: T.muted }}>
                              <span>Normal: {nMin > 0 ? nMin : '0'} – {nMax} {b.unit}</span>
                              <span style={{ color: key === 'normal' ? '#34d399' : st.c }}>
                                {key === 'normal' ? '✓ Within range' : key === 'critical' ? `⚠ Dangerously ${val > nMax ? 'elevated' : 'low'}` : key === 'high' ? `↑ ${nMax > 0 ? '+' + (val - nMax).toFixed(1) : ''} above max` : `↓ ${nMin > 0 ? (nMin - val).toFixed(1) + ' below min' : 'below range'}`}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Sec>
            )}

            {/* 5. Scan Findings */}
            {p.scanSections && p.scanSections.length > 0 && (
              <Sec icon={<Activity style={{ width: 14, height: 14 }} />} title="Scan Findings">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.scanSections.map((sec, si) => (
                    <div key={si} style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${T.rowBdr}` }}>
                      {sec.title && <div style={{ fontFamily: S, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.12em', color: typeColor, textTransform: 'uppercase', marginBottom: '8px' }}>{sec.title}</div>}
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {sec.findings.map((f, fi) => (
                          <li key={fi} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.83rem', color: T.text }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: typeColor, marginTop: 7, flexShrink: 0 }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Sec>
            )}

            {/* 6. Recommendations */}
            {p.recommendations && p.recommendations.length > 0 && (
              <Sec icon={<CircleCheck style={{ width: 14, height: 14 }} />} title="Recommendations & Treatment Plan">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {p.recommendations.map((rec: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '0.82rem 1rem', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${T.rowBdr}` }}>
                      <div style={{ minWidth: 27, height: 27, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#fff', fontFamily: S, marginTop: 1 }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: T.text, lineHeight: 1.65 }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </Sec>
            )}

            {/* Disclaimer */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <AlertTriangle style={{ width: 13, height: 13, color: '#ef4444', marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: '0.71rem', color: isDark ? '#fca5a5' : '#991b1b', lineHeight: 1.55 }}>
                This AI-generated report is for informational purposes only and does not constitute medical advice.
                Always consult a licensed healthcare professional before making any clinical decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  ), document.body);
}

// ── Detail panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  p: Prediction;
  onClose: () => void;
  onLike?: (id: string) => void;
  onViewFullReport: () => void;
  isDark: boolean;
}

function DetailPanel({ p, onClose, onLike, onViewFullReport, isDark }: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";
  const typeColor = TYPE_COLORS[p.type] || '#8b5cf6';

  const T = isDark ? {
    bg:      '#06060f',
    panel:   'rgba(10,10,22,0.97)',
    bdr:     'rgba(255,255,255,0.09)',
    head:    '#ffffff',
    text:    '#e2e8f0',
    muted:   'rgba(255,255,255,0.42)',
    rowBg:   'rgba(255,255,255,0.04)',
    rowBdr:  'rgba(255,255,255,0.08)',
    divider: 'rgba(255,255,255,0.07)',
    secBg:   'rgba(255,255,255,0.03)',
  } : {
    bg:      '#f0f4ff',
    panel:   'rgba(255,255,255,0.98)',
    bdr:     'rgba(0,0,0,0.09)',
    head:    '#0a0a1a',
    text:    '#1e293b',
    muted:   'rgba(10,10,26,0.45)',
    rowBg:   'rgba(0,0,0,0.025)',
    rowBdr:  'rgba(0,0,0,0.07)',
    divider: 'rgba(0,0,0,0.06)',
    secBg:   'rgba(0,0,0,0.02)',
  };

  // Slide in on mount
  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
    );
  }, []);

  const urgencyKey = p.urgency && URGENCY_MAP[p.urgency] ? p.urgency : null;
  const urgency    = urgencyKey ? URGENCY_MAP[urgencyKey] : null;

  const Section = ({ icon, title, children }: { icon: JSX.Element; title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem', paddingBottom: '0.6rem', borderBottom: `1px solid ${T.divider}` }}>
        <span style={{ color: typeColor }}>{icon}</span>
        <span style={{ fontFamily: S, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', color: T.muted, textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );

  return createPortal((
    <>
      <style>{`
        .ph-scroll::-webkit-scrollbar { width: 4px; }
        .ph-scroll::-webkit-scrollbar-track { background: transparent; }
        .ph-scroll::-webkit-scrollbar-thumb { background: ${typeColor}55; border-radius: 999px; }
        .ph-scroll::-webkit-scrollbar-thumb:hover { background: ${typeColor}99; }
        @keyframes phFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes emergencyPulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.15) } }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          animation: 'phFadeIn 0.25s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.25rem',
        }}
      >
        {/* Panel */}
        <div
          ref={panelRef}
          onClick={e => e.stopPropagation()}
          style={{
            background: T.panel,
            border: `1px solid ${T.bdr}`,
            borderRadius: '20px',
            boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${typeColor}18`,
            backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
            width: '100%', maxWidth: '860px',
            maxHeight: 'calc(100vh - 2.5rem)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: I,
          }}
        >
          {/* ── Top bar ── */}
          <div style={{
            padding: '1.35rem 1.75rem 0',
            flexShrink: 0,
            borderBottom: `1px solid ${T.divider}`,
            paddingBottom: '1.1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              {/* Type icon */}
              <div style={{
                width: 48, height: 48, borderRadius: '13px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${typeColor}1a`, color: typeColor,
                border: `1px solid ${typeColor}30`,
              }}>
                {TYPE_ICONS[p.type]}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
                  fontSize: '0.62rem', fontWeight: 700, fontFamily: S, letterSpacing: '0.1em',
                  background: `${typeColor}18`, color: typeColor,
                  border: `1px solid ${typeColor}30`, marginBottom: '6px', textTransform: 'uppercase',
                }}>
                  {TYPE_LABELS[p.type]}
                </span>
                <h2 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.35rem', color: T.head, lineHeight: 1.25, marginBottom: '6px' }}>
                  {p.diagnosis}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: T.muted, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock style={{ width: 12, height: 12 }} />
                    {formatAbsolute(p.timestamp)}
                  </span>
                  {p.liked && (
                    <span style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Heart style={{ width: 12, height: 12, fill: '#ec4899' }} /> Liked
                    </span>
                  )}
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: T.rowBg, border: `1px solid ${T.rowBdr}`,
                  color: T.muted, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>

            {/* Confidence bar */}
            <div style={{ marginTop: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                <span style={{ color: T.muted }}>Confidence</span>
                <span style={{ fontWeight: 700, fontFamily: S, color: p.confidence >= 80 ? '#10b981' : '#f59e0b' }}>
                  {p.confidence}%
                </span>
              </div>
              <div style={{ height: '7px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${p.confidence}%`,
                  borderRadius: '999px',
                  background: `linear-gradient(90deg, ${typeColor}, ${typeColor}cc)`,
                  boxShadow: `0 0 12px ${typeColor}88`,
                  transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
                }} />
              </div>
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div
            data-lenis-prevent
            className="ph-scroll"
            style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', padding: '1.5rem 1.75rem' }}
          >
            {/* Urgency */}
            {urgency && (
              <Section icon={<ShieldAlert style={{ width: 14, height: 14 }} />} title="Urgency Level">
                <div style={{
                  padding: '1rem 1.1rem', borderRadius: '14px',
                  background: `${urgency.color}12`, border: `1px solid ${urgency.color}45`,
                  boxShadow: `0 0 28px -8px ${urgency.color}55`,
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}>
                  <span style={{
                    fontSize: '2.2rem', lineHeight: 1,
                    animation: urgencyKey === 'emergency' ? 'emergencyPulse 1.2s ease-in-out infinite' : undefined,
                  }}>
                    {urgency.emoji}
                  </span>
                  <div>
                    <div style={{ fontFamily: S, fontWeight: 800, fontSize: '1rem', color: urgency.color, letterSpacing: '0.04em', marginBottom: '3px' }}>
                      {urgency.label}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: T.text }}>{urgency.sub}</div>
                  </div>
                </div>
              </Section>
            )}

            {/* Assessment / Details */}
            {p.details && (
              <Section icon={<Brain style={{ width: 14, height: 14 }} />} title="Clinical Assessment">
                <div style={{ padding: '1rem 1.15rem', borderRadius: '12px', background: T.secBg, border: `1px solid ${T.divider}` }}>
                  <MedicalAIOutput
                    text={p.details}
                    isDark={isDark}
                    textColor={T.text}
                    mutedColor={T.muted}
                  />
                </div>
              </Section>
            )}

            {/* Conditions */}
            {p.conditions && p.conditions.length > 0 && (
              <Section icon={<Microscope style={{ width: 14, height: 14 }} />} title="Differential Diagnosis">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.conditions.map((c, i) => {
                    const pct = Math.max(0, Math.min(100, c.probability));
                    const barColor = i === 0 ? (urgency?.color || typeColor) : (isDark ? '#6366f1' : '#4f46e5');
                    return (
                      <div key={i} style={{
                        padding: '0.75rem 1rem', borderRadius: '12px',
                        background: T.rowBg, border: `1px solid ${T.rowBdr}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {i === 0 && (
                              <span style={{
                                padding: '1px 7px', borderRadius: '999px', fontSize: '0.6rem',
                                fontWeight: 700, fontFamily: S, letterSpacing: '0.1em',
                                background: `${barColor}22`, color: barColor,
                                border: `1px solid ${barColor}40`,
                              }}>
                                TOP MATCH
                              </span>
                            )}
                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: T.head }}>{c.name}</span>
                          </div>
                          <span style={{ fontFamily: S, fontWeight: 800, fontSize: '0.9rem', color: barColor }}>{pct}%</span>
                        </div>
                        <div style={{ height: '6px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${pct}%`, borderRadius: '999px',
                            background: `linear-gradient(90deg, ${barColor}, ${barColor}bb)`,
                            boxShadow: `0 0 10px ${barColor}77`,
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Biomarkers (reports) */}
            {p.biomarkers && p.biomarkers.length > 0 && (
              <Section icon={<FlaskConical style={{ width: 14, height: 14 }} />} title="Blood Biomarker Panel">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.biomarkers.map((b, i) => {
                    const ST: Record<string, { c: string; bg: string; border: string; label: string; arrow: string }> = {
                      critical: { c: '#f87171', bg: 'rgba(248,113,113,0.13)', border: 'rgba(248,113,113,0.35)', label: 'CRITICAL', arrow: '⚠' },
                      high:     { c: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)',  label: 'HIGH',     arrow: '↑' },
                      low:      { c: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.30)',  label: 'LOW',      arrow: '↓' },
                      normal:   { c: '#34d399', bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.25)',  label: 'NORMAL',   arrow: '✓' },
                    };
                    const key  = (b.status || 'normal').toLowerCase();
                    const st   = ST[key] || ST.normal;
                    const val  = typeof b.value === 'number' ? b.value : parseFloat(String(b.value)) || 0;
                    const nMin = b.normal_min ?? 0;
                    const nMax = b.normal_max ?? 0;
                    const hasRange = nMax > 0;

                    // Bar geometry — display from 0 to 150% of normal_max (or 130% of value if no range)
                    const displayMax = hasRange
                      ? Math.max(nMax * 1.5, val * 1.05)
                      : val * 1.3 || 100;
                    const valPct    = Math.min(100, Math.max(0, (val / displayMax) * 100));
                    const nMinPct   = hasRange ? Math.min(100, (nMin / displayMax) * 100) : 0;
                    const nMaxPct   = hasRange ? Math.min(100, (nMax / displayMax) * 100) : 100;

                    const formattedVal = Number.isInteger(val) ? val : val.toFixed(1);

                    return (
                      <div
                        key={i}
                        style={{
                          padding: '0.9rem 1.1rem',
                          borderRadius: '13px',
                          background: T.rowBg,
                          border: `1px solid ${st.border}`,
                          boxShadow: key !== 'normal' ? `0 0 20px -8px ${st.c}55` : 'none',
                        }}
                      >
                        {/* Top row: name + value + badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: hasRange ? '10px' : 0 }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: T.head, lineHeight: 1.3 }}>{b.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                            <span style={{ fontFamily: S, fontWeight: 800, fontSize: '1.05rem', color: st.c, letterSpacing: '0.02em' }}>
                              {formattedVal}
                              {b.unit && (
                                <span style={{ fontSize: '0.72rem', fontWeight: 400, color: T.muted, marginLeft: '3px' }}>
                                  {b.unit}
                                </span>
                              )}
                            </span>
                            <span style={{
                              padding: '2px 9px', borderRadius: '999px',
                              fontSize: '0.64rem', fontWeight: 800, fontFamily: S,
                              letterSpacing: '0.09em', textTransform: 'uppercase',
                              color: st.c, background: st.bg,
                              border: `1px solid ${st.border}`,
                            }}>
                              {st.arrow} {st.label}
                            </span>
                          </div>
                        </div>

                        {/* Range bar */}
                        {hasRange && (
                          <>
                            <div style={{ position: 'relative', height: '10px', borderRadius: '999px', overflow: 'visible' }}>
                              {/* Track */}
                              <div style={{
                                position: 'absolute', inset: 0,
                                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                                borderRadius: '999px',
                              }} />
                              {/* Normal zone (green highlight) */}
                              <div style={{
                                position: 'absolute', top: 0, bottom: 0,
                                left: `${nMinPct}%`,
                                width: `${nMaxPct - nMinPct}%`,
                                background: 'rgba(52,211,153,0.22)',
                                borderRadius: '4px',
                              }} />
                              {/* Filled bar up to value */}
                              <div style={{
                                position: 'absolute', top: 0, bottom: 0, left: 0,
                                width: `${valPct}%`,
                                background: `linear-gradient(90deg, ${st.c}55, ${st.c})`,
                                borderRadius: '999px',
                                transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                              }} />
                              {/* Value needle dot */}
                              <div style={{
                                position: 'absolute', top: '50%',
                                left: `${valPct}%`,
                                transform: 'translate(-50%, -50%)',
                                width: 14, height: 14, borderRadius: '50%',
                                background: st.c,
                                boxShadow: `0 0 10px ${st.c}, 0 0 0 3px ${isDark ? '#06060f' : '#fff'}`,
                                zIndex: 1,
                              }} />
                            </div>

                            {/* Axis labels */}
                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              marginTop: '8px', fontSize: '0.67rem', color: T.muted,
                            }}>
                              <span>
                                Normal: {nMin > 0 ? nMin : '0'} – {nMax} {b.unit}
                              </span>
                              <span style={{ color: key === 'normal' ? '#34d399' : st.c }}>
                                {key === 'normal'
                                  ? '✓ Within range'
                                  : key === 'critical'
                                    ? `⚠ Dangerously ${val > nMax ? 'elevated' : 'low'}`
                                    : key === 'high'
                                      ? `↑ ${nMax > 0 ? '+' + (val - nMax).toFixed(1) : ''} above max`
                                      : `↓ ${nMin > 0 ? (nMin - val).toFixed(1) + ' below min' : 'below range'}`}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Scan sections (image analysis) */}
            {p.scanSections && p.scanSections.length > 0 && (
              <Section icon={<Activity style={{ width: 14, height: 14 }} />} title="Scan Findings">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.scanSections.map((sec, si) => (
                    <div key={si} style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: T.secBg, border: `1px solid ${T.divider}` }}>
                      {sec.title && (
                        <div style={{ fontFamily: S, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: typeColor, textTransform: 'uppercase', marginBottom: '8px' }}>
                          {sec.title}
                        </div>
                      )}
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {sec.findings.map((f, fi) => (
                          <li key={fi} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.83rem', color: T.text }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: typeColor, marginTop: 7, flexShrink: 0 }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Recommendations */}
            {p.recommendations && p.recommendations.length > 0 && (
              <Section icon={<CircleCheck style={{ width: 14, height: 14 }} />} title="Recommendations & Treatment Plan">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {p.recommendations.map((rec: string, i: number) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px',
                      padding: '0.8rem 1rem', borderRadius: '12px',
                      background: T.rowBg, border: `1px solid ${T.rowBdr}`,
                    }}>
                      <div style={{
                        minWidth: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 800, color: '#fff', fontFamily: S,
                        marginTop: 1,
                      }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: T.text, lineHeight: 1.65 }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Footer row: View Full Report (left) + Like (right) + Disclaimer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                {/* Left — View Full Report */}
                <button
                  onClick={onViewFullReport}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '0.55rem 1.1rem', borderRadius: '10px',
                    fontSize: '0.76rem', fontWeight: 700, fontFamily: S, cursor: 'pointer',
                    background: `linear-gradient(135deg, ${typeColor}18, ${typeColor}08)`,
                    color: typeColor,
                    border: `1px solid ${typeColor}40`,
                    boxShadow: `0 0 18px -6px ${typeColor}55`,
                    transition: 'all 0.25s ease',
                    letterSpacing: '0.04em',
                  }}
                >
                  <FileText style={{ width: 13, height: 13 }} />
                  VIEW FULL REPORT
                </button>

                {/* Right — Like */}
                {onLike && (
                  <button
                    onClick={() => onLike(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0.55rem 1.1rem', borderRadius: '10px',
                      fontSize: '0.78rem', fontWeight: 700, fontFamily: S, cursor: 'pointer',
                      background: p.liked ? 'linear-gradient(135deg,#ec4899,#be185d)' : T.rowBg,
                      color: p.liked ? '#fff' : T.muted,
                      border: `1px solid ${p.liked ? 'transparent' : T.rowBdr}`,
                      boxShadow: p.liked ? '0 4px 14px rgba(236,72,153,0.4)' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <Heart style={{ width: 14, height: 14, fill: p.liked ? '#fff' : 'none' }} />
                    {p.liked ? 'Liked' : 'Like'}
                  </button>
                )}
              </div>

              <div style={{
                padding: '0.8rem 1rem', borderRadius: '12px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
                display: 'flex', gap: '8px', alignItems: 'flex-start',
              }}>
                <AlertTriangle style={{ width: 14, height: 14, color: '#ef4444', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: '0.72rem', color: isDark ? '#fca5a5' : '#991b1b', lineHeight: 1.55 }}>
                  This AI-generated report is for informational purposes only and does not constitute medical advice.
                  Always consult a licensed healthcare professional before making any clinical decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ), document.body);
}

// ── Main component ────────────────────────────────────────────────────────────

export function PredictionHistory({ predictions, onLike }: PredictionHistoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filterLiked, setFilterLiked] = useState(false);
  const [selected, setSelected] = useState<Prediction | null>(null);
  const [fullReport, setFullReport] = useState<Prediction | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [selected]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ph-item',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'expo.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, [theme, predictions]);

  const T = isDark ? {
    cardBg: 'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow: '0 8px 32px rgba(0,0,0,0.5)',
    head: '#ffffff', sub: 'rgba(255,255,255,0.50)', text: '#ffffff', muted: 'rgba(255,255,255,0.45)',
    rowBg: 'rgba(255,255,255,0.04)', rowBdr: 'rgba(255,255,255,0.08)',
    divider: 'rgba(255,255,255,0.06)',
    statGrad: ['rgba(14,165,233,0.15)', 'rgba(139,92,246,0.15)', 'rgba(16,185,129,0.15)'],
    statBdr:  ['rgba(14,165,233,0.25)', 'rgba(139,92,246,0.25)', 'rgba(16,185,129,0.25)'],
    statIcons: ['#0ea5e9', '#8b5cf6', '#10b981'],
  } : {
    cardBg: 'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow: '0 4px 20px rgba(0,0,0,0.07)',
    head: '#0a0a1a', sub: 'rgba(10,10,26,0.50)', text: '#0a0a1a', muted: 'rgba(10,10,26,0.45)',
    rowBg: 'rgba(0,0,0,0.02)', rowBdr: 'rgba(0,0,0,0.07)',
    divider: 'rgba(0,0,0,0.06)',
    statGrad: ['rgba(14,165,233,0.07)', 'rgba(139,92,246,0.07)', 'rgba(16,185,129,0.07)'],
    statBdr:  ['rgba(14,165,233,0.15)', 'rgba(139,92,246,0.15)', 'rgba(16,185,129,0.15)'],
    statIcons: ['#0ea5e9', '#8b5cf6', '#10b981'],
  };

  const S     = "'Michroma', sans-serif";
  const I     = "'Inter', sans-serif";
  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px' };

  const avgConfidence = predictions.length > 0 ? Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length) : 0;
  const typeBreakdown = predictions.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc; }, {} as Record<string, number>);
  const likedCount    = predictions.filter(p => p.liked).length;
  const mostUsed      = Object.entries(typeBreakdown).length > 0
    ? TYPE_LABELS[Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1])[0][0] as Prediction['type']]
    : 'N/A';
  const filtered = filterLiked ? predictions.filter(p => p.liked) : predictions;

  return (
    <div ref={ref} style={{ fontFamily: I, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stat cards */}
      {predictions.length > 0 && (
        <div className="ph-item grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'Total Analyses', value: predictions.length, icon: HistoryIcon, ci: 0 },
            { label: 'Avg Confidence', value: `${avgConfidence}%`,    icon: TrendingUp,   ci: 1 },
            { label: 'Most Used',      value: mostUsed,               icon: Activity,     ci: 2 },
          ].map(({ label, value, icon: Icon, ci }) => (
            <div key={label} style={{ ...glass, background: T.statGrad[ci], borderColor: T.statBdr[ci], padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${T.statIcons[ci]}22`, flexShrink: 0 }}>
                  <Icon className="w-5 h-5" style={{ color: T.statIcons[ci] }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: T.muted, marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontFamily: S, fontSize: '1.3rem', fontWeight: 800, color: T.head }}>{value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History list */}
      <div className="ph-item" style={{ ...glass, padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.05rem', color: T.head }}>Analysis History</h3>
            <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>View all your previous AI-powered medical analyses</p>
          </div>
          {likedCount > 0 && (
            <button
              onClick={() => setFilterLiked(!filterLiked)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem',
                fontWeight: 700, fontFamily: S, cursor: 'pointer',
                background: filterLiked ? 'linear-gradient(135deg,#ec4899,#be185d)' : T.rowBg,
                color: filterLiked ? '#fff' : T.muted,
                border: `1px solid ${filterLiked ? 'transparent' : T.rowBdr}`,
                boxShadow: filterLiked ? '0 4px 12px rgba(236,72,153,0.4)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <Heart className="w-4 h-4" style={{ fill: filterLiked ? '#fff' : 'none' }} />
              {filterLiked ? `Liked (${likedCount})` : `Show Liked (${likedCount})`}
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}>
            <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
              {filterLiked ? 'No liked analyses yet' : 'No analysis history yet'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map(p => {
              const typeColor  = TYPE_COLORS[p.type] || '#8b5cf6';
              const urgencyKey = p.urgency && URGENCY_MAP[p.urgency] ? p.urgency : null;
              const urgency    = urgencyKey ? URGENCY_MAP[urgencyKey] : null;
              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(p)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(p); } }}
                  className="transition-all duration-300 hover:scale-[1.01]"
                  style={{ padding: '1rem 1.25rem', borderRadius: '14px', background: T.rowBg, border: `1px solid ${T.rowBdr}`, cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${typeColor}22`, color: typeColor }}>
                      {TYPE_ICONS[p.type]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <div>
                          <span style={{ display: 'inline-block', padding: '1px 8px', borderRadius: '999px', fontSize: '0.62rem', fontWeight: 700, fontFamily: S, letterSpacing: '0.08em', background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30`, marginBottom: '4px', textTransform: 'uppercase' }}>
                            {TYPE_LABELS[p.type]}
                          </span>
                          <div style={{ fontWeight: 700, color: T.text, fontSize: '0.92rem' }}>{p.diagnosis}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {urgency && (
                            <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, fontFamily: S, background: `${urgency.color}18`, color: urgency.color, border: `1px solid ${urgency.color}35` }}>
                              {urgency.emoji} {urgency.label}
                            </span>
                          )}
                          <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, fontFamily: S, background: p.confidence >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: p.confidence >= 80 ? '#10b981' : '#f59e0b', border: `1px solid ${p.confidence >= 80 ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, whiteSpace: 'nowrap' }}>
                            {p.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${T.divider}` }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: T.muted }}>
                      <Clock className="w-3 h-3" />{formatDate(p.timestamp)}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: T.muted, opacity: 0.6 }}>Click to view full report →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <DetailPanel
          p={selected}
          onClose={() => setSelected(null)}
          onLike={onLike}
          onViewFullReport={() => setFullReport(selected)}
          isDark={isDark}
        />
      )}

      {/* Full Report overlay — sits above DetailPanel (z-9200 vs z-9000) */}
      {fullReport && (
        <FullReportModal
          p={fullReport}
          onClose={() => setFullReport(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}
