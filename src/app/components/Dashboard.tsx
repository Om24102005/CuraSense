import { useEffect, useRef } from 'react';
import { Activity, Brain, FileText, TrendingUp, Calendar, Clock,
  CircleAlert, CircleCheck, Zap, Target, ArrowRight } from 'lucide-react';
import type { Prediction } from '../App';
import { useTheme } from '../App';
import gsap from 'gsap';

interface DashboardProps {
  predictions: Prediction[];
  onNavigate: (tab: string) => void;
}

export function Dashboard({ predictions, onNavigate }: DashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── Entrance animations ────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.dash-card',
        { y: 40, opacity: 0, scale: 0.96 },
        { y: 0,  opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out', delay: 0.1 }
      );
      gsap.fromTo('.dash-stat',
        { y: 30, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.7, stagger: 0.08, ease: 'expo.out', delay: 0.2 }
      );
    }, ref);
    return () => ctx.revert();
  }, [theme]);

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const T = isDark ? {
    head:      '#ffffff',
    sub:       'rgba(255,255,255,0.55)',
    cardBg:    'rgba(12,12,26,0.75)',
    cardBdr:   'rgba(255,255,255,0.10)',
    cardShadow:'0 8px 32px rgba(0,0,0,0.5)',
    row:       'rgba(255,255,255,0.04)',
    rowBdr:    'rgba(255,255,255,0.07)',
    rowHov:    'rgba(255,255,255,0.08)',
    text:      '#ffffff',
    muted:     'rgba(255,255,255,0.50)',
    trackBg:   'rgba(255,255,255,0.08)',
    infoA:     'rgba(34,211,238,0.12)',
    infoABdr:  'rgba(34,211,238,0.25)',
    infoB:     'rgba(74,222,128,0.10)',
    infoBBdr:  'rgba(74,222,128,0.25)',
    amber:     'rgba(251,191,36,0.12)',
    amberBdr:  'rgba(251,191,36,0.30)',
    amberTxt:  '#fde68a',
    statCards: [
      { from: '#0ea5e9', to: '#6366f1', label: 'Total Analyses', icon: Target,     badge: 'All Time' },
      { from: '#10b981', to: '#059669', label: "Today's Analyses", icon: Calendar, badge: 'Today' },
      { from: '#8b5cf6', to: '#6d28d9', label: 'Avg Confidence', icon: TrendingUp, badge: 'Avg' },
      { from: '#f59e0b', to: '#d97706', label: 'Avg Response',   icon: Zap,        badge: 'Fast' },
    ],
  } : {
    head:      '#0a0a1a',
    sub:       'rgba(10,10,26,0.55)',
    cardBg:    'rgba(255,255,255,0.96)',
    cardBdr:   'rgba(0,0,0,0.08)',
    cardShadow:'0 4px 20px rgba(0,0,0,0.07)',
    row:       'rgba(0,0,0,0.025)',
    rowBdr:    'rgba(0,0,0,0.06)',
    rowHov:    'rgba(0,0,0,0.05)',
    text:      '#0a0a1a',
    muted:     'rgba(10,10,26,0.50)',
    trackBg:   'rgba(0,0,0,0.08)',
    infoA:     'rgba(14,165,233,0.08)',
    infoABdr:  'rgba(14,165,233,0.20)',
    infoB:     'rgba(16,185,129,0.07)',
    infoBBdr:  'rgba(16,185,129,0.20)',
    amber:     'rgba(245,158,11,0.08)',
    amberBdr:  'rgba(245,158,11,0.25)',
    amberTxt:  '#92400e',
    statCards: [
      { from: '#0ea5e9', to: '#6366f1', label: 'Total Analyses', icon: Target,     badge: 'All Time' },
      { from: '#10b981', to: '#059669', label: "Today's Analyses", icon: Calendar, badge: 'Today' },
      { from: '#8b5cf6', to: '#6d28d9', label: 'Avg Confidence', icon: TrendingUp, badge: 'Avg' },
      { from: '#f59e0b', to: '#d97706', label: 'Avg Response',   icon: Zap,        badge: 'Fast' },
    ],
  };

  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";

  const totalAnalyses = predictions.length;
  const avgConfidence = predictions.length > 0
    ? Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length) : 0;
  const typeBreakdown = predictions.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc; }, {} as Record<string, number>);
  const recentPredictions = predictions.slice(0, 3);
  const todayAnalyses = predictions.filter(p => new Date(p.timestamp).toDateString() === new Date().toDateString()).length;
  const statValues = [totalAnalyses, todayAnalyses, `${avgConfidence}%`, '2.5s'];

  const typeColors: Record<string, string> = { symptom: '#0ea5e9', image: '#8b5cf6', report: '#ec4899' };

  const getIcon = (type: Prediction['type']) => ({
    symptom: <Activity className="w-4 h-4" />,
    image:   <Brain   className="w-4 h-4" />,
    report:  <FileText className="w-4 h-4" />,
  }[type]);

  const quickActions = [
    { label: 'Symptom Check',  desc: 'Analyze your symptoms',   icon: Activity, from: '#0ea5e9', to: '#6366f1' },
    { label: 'Upload Scan',    desc: 'Analyze medical images',  icon: Brain,    from: '#8b5cf6', to: '#6d28d9' },
    { label: 'Lab Report',     desc: 'Analyze test results',    icon: FileText, from: '#ec4899', to: '#be185d' },
  ];

  const glassCard = {
    background:  T.cardBg,
    border:      `1px solid ${T.cardBdr}`,
    boxShadow:   T.cardShadow,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: '20px',
    padding: '1.5rem',
  };

  return (
    <div ref={ref} style={{ fontFamily: I }}>

      {/* ── Page header ── */}
      <div className="dash-card mb-8">
        <h2 style={{ fontFamily: S, fontSize: '1.75rem', fontWeight: 800, color: T.head, marginBottom: '0.25rem' }}>
          Welcome Back 👋
        </h2>
        <p style={{ color: T.sub, fontSize: '0.95rem' }}>Here's your health analysis overview</p>
      </div>

      {/* ── KPI stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {T.statCards.map(({ from, to, label, icon: Icon, badge }, i) => (
          <div key={label} className="dash-stat relative overflow-hidden" style={{ borderRadius: '20px', padding: '1.5rem', background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 8px 24px ${from}44` }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(255,255,255,0.15)', transform: 'translate(30%, -30%)' }} />
            <div className="flex items-center justify-between mb-4">
              <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span style={{ fontFamily: S, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.25)', color: '#fff', padding: '2px 8px', borderRadius: '999px' }}>{badge}</span>
            </div>
            <div style={{ fontFamily: S, fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{statValues[i]}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.80)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions + Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Quick Actions */}
        <div className="dash-card lg:col-span-2" style={glassCard}>
          <h3 style={{ fontFamily: S, fontSize: '1.05rem', fontWeight: 700, color: T.head, marginBottom: '0.25rem' }}>Quick Actions</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Start a new analysis</p>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map(({ label, desc, icon: Icon, from, to }) => (
              <button
                key={label}
                onClick={() => onNavigate('analyze')}
                className="group text-left transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
                style={{ padding: '1.25rem', borderRadius: '16px', background: isDark ? 'rgba(255,255,255,0.04)' : `${from}12`, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : `${from}30`}` }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `linear-gradient(135deg,${from},${to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', boxShadow: `0 4px 12px ${from}55` }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div style={{ fontFamily: S, fontSize: '0.82rem', fontWeight: 700, color: T.head, marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '0.72rem', color: T.muted }}>{desc}</div>
                <ArrowRight className="w-3.5 h-3.5 mt-2 transition-transform group-hover:translate-x-1" style={{ color: from }} />
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Types */}
        <div className="dash-card" style={glassCard}>
          <h3 style={{ fontFamily: S, fontSize: '1.05rem', fontWeight: 700, color: T.head, marginBottom: '0.25rem' }}>Analysis Types</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Breakdown by category</p>
          {Object.keys(typeBreakdown).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: T.muted }}>
              <CircleAlert className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p style={{ fontSize: '0.82rem' }}>No analyses yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(typeBreakdown).map(([type, count]) => (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: T.muted, textTransform: 'capitalize' }}>{type}</span>
                    <span style={{ fontWeight: 700, color: T.text }}>{count}</span>
                  </div>
                  <div style={{ height: '6px', background: T.trackBg, borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / totalAnalyses) * 100}%`, borderRadius: '999px', background: `linear-gradient(90deg, ${typeColors[type] || '#8b5cf6'}, ${typeColors[type] || '#8b5cf6'}88)`, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
              <button onClick={() => onNavigate('history')} style={{ marginTop: '0.5rem', padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${T.cardBdr}`, background: T.row, color: T.text, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: S }}>
                View Full History
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Analyses ── */}
      <div className="dash-card mb-8" style={glassCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: S, fontSize: '1.05rem', fontWeight: 700, color: T.head }}>Recent Analyses</h3>
            <p style={{ color: T.sub, fontSize: '0.82rem', marginTop: '2px' }}>Your latest AI-powered predictions</p>
          </div>
          <button onClick={() => onNavigate('history')} style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6366f1', fontFamily: S, cursor: 'pointer', background: 'none', border: 'none', padding: '4px 8px' }}>View All →</button>
        </div>

        {recentPredictions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}>
            <CircleAlert className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p style={{ marginBottom: '4px' }}>No analyses yet</p>
            <p style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>Start by analyzing symptoms, scans, or reports</p>
            <button onClick={() => onNavigate('analyze')} style={{ padding: '0.6rem 1.5rem', borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '0.85rem', fontWeight: 700, fontFamily: S, cursor: 'pointer', border: 'none', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
              Start Analysis
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentPredictions.map(p => (
              <div key={p.id} className="group transition-all duration-300 hover:scale-[1.01]" style={{ padding: '1rem 1.25rem', borderRadius: '14px', background: T.row, border: `1px solid ${T.rowBdr}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${typeColors[p.type] || '#8b5cf6'}22`, color: typeColors[p.type] || '#8b5cf6', flexShrink: 0 }}>
                      {getIcon(p.type)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: T.text, fontSize: '0.9rem' }}>{p.diagnosis}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: T.muted, marginTop: '2px' }}>
                        <Clock className="w-3 h-3" />{new Date(p.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, fontFamily: S, background: p.confidence >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: p.confidence >= 80 ? '#10b981' : '#f59e0b', border: `1px solid ${p.confidence >= 80 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                    {p.confidence}%
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: T.muted, marginBottom: '0.5rem' }}>{p.details}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981' }}>
                    <CircleCheck className="w-3.5 h-3.5" />{p.recommendations.length} recommendations
                  </span>
                  <button onClick={() => onNavigate('history')} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: S }}>Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Info cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="dash-card" style={{ ...glassCard, background: T.infoA, borderColor: T.infoABdr }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.7rem', background: 'rgba(14,165,233,0.2)', borderRadius: '12px', flexShrink: 0 }}>
              <CircleAlert className="w-5 h-5" style={{ color: '#0ea5e9' }} />
            </div>
            <div>
              <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, marginBottom: '0.35rem' }}>Medical Disclaimer</h4>
              <p style={{ fontSize: '0.82rem', color: T.muted, lineHeight: 1.55 }}>This tool provides AI-assisted preliminary analysis. Always consult healthcare professionals for diagnosis and treatment.</p>
            </div>
          </div>
        </div>
        <div className="dash-card" style={{ ...glassCard, background: T.infoB, borderColor: T.infoBBdr }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.7rem', background: 'rgba(16,185,129,0.2)', borderRadius: '12px', flexShrink: 0 }}>
              <CircleCheck className="w-5 h-5" style={{ color: '#10b981' }} />
            </div>
            <div>
              <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, marginBottom: '0.35rem' }}>Privacy & Security</h4>
              <p style={{ fontSize: '0.82rem', color: T.muted, lineHeight: 1.55 }}>Your data is encrypted and HIPAA compliant. We never share your medical information without consent.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
