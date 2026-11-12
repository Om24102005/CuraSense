import { ExpandCard } from '../../components/shared/ExpandCard';
import { useEffect, useRef } from 'react';
import { Activity, Brain, FileText, TrendingUp, Calendar, Clock, CircleAlert, Zap, Target } from 'lucide-react';
import type { Prediction } from '../../App';
import { useTheme } from '../../App';
import { useTranslation } from '../../state/AppSettingsContext';
import gsap from 'gsap';

interface DashboardProps { predictions: Prediction[]; onNavigate: (tab: string) => void; }

export function Dashboard({ predictions, onNavigate }: DashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.dash-card', { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out', delay: 0.1 });
    }, ref);
    return () => ctx.revert();
  }, [theme]);

  const statCards = [
    { from: '#0ea5e9', to: '#6366f1', label: t('dashboard.totalAnalyses'),  icon: Target,    badge: 'All Time' },
    { from: '#10b981', to: '#059669', label: t('dashboard.todayAnalyses'),  icon: Calendar,  badge: 'Today'    },
    { from: '#8b5cf6', to: '#6d28d9', label: t('dashboard.avgConfidence'),  icon: TrendingUp, badge: 'Avg'    },
    { from: '#f59e0b', to: '#d97706', label: t('dashboard.avgResponse'),    icon: Zap,        badge: 'Fast'   },
  ];

  const T = isDark ? {
    head: '#ffffff', sub: 'rgba(255,255,255,0.55)', cardBg: 'rgba(12,12,26,0.75)', cardBdr: 'rgba(255,255,255,0.10)',
    row: 'rgba(255,255,255,0.04)', rowBdr: 'rgba(255,255,255,0.07)', text: '#ffffff', muted: 'rgba(255,255,255,0.50)',
    trackBg: 'rgba(255,255,255,0.08)', statCards,
  } : {
    head: '#0a0a1a', sub: 'rgba(10,10,26,0.55)', cardBg: 'rgba(255,255,255,0.96)', cardBdr: 'rgba(0,0,0,0.08)',
    row: 'rgba(0,0,0,0.025)', rowBdr: 'rgba(0,0,0,0.06)', text: '#0a0a1a', muted: 'rgba(10,10,26,0.50)',
    trackBg: 'rgba(0,0,0,0.08)', statCards,
  };

  const totalAnalyses = predictions.length;
  const avgConfidence = totalAnalyses > 0 ? Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / totalAnalyses) : 0;
  const typeBreakdown = predictions.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc; }, {} as Record<string, number>);
  const recentPredictions = predictions.slice(0, 3);
  const todayAnalyses = predictions.filter(p => new Date(p.timestamp).toDateString() === new Date().toDateString()).length;
  const statValues = [totalAnalyses, todayAnalyses, `${avgConfidence}%`, '2.5s'];
  const statDetails = ['Every analysis you have run so far.', 'Analyses run today.', 'Average model confidence across all your analyses.', 'Typical time the AI takes to answer.'];

  const typeColors: Record<string, string> = { symptom: '#0ea5e9', image: '#8b5cf6', report: '#ec4899' };
  const getIcon = (type: string) => ({ symptom: <Activity className="w-4 h-4" />, image: <Brain className="w-4 h-4" />, report: <FileText className="w-4 h-4" /> }[type]);

  const quickActions = [
    { label: t('dashboard.symptomCheck'), desc: t('dashboard.analyzeSymptoms'),       icon: Activity,  from: '#0ea5e9', to: '#6366f1' },
    { label: t('dashboard.uploadScan'),   desc: t('dashboard.analyzeMedicalImages'),  icon: Brain,     from: '#8b5cf6', to: '#6d28d9' },
    { label: t('dashboard.labReport'),    desc: t('dashboard.analyzeTestResults'),    icon: FileText,  from: '#ec4899', to: '#be185d' },
  ];

  const glassCard = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, backdropFilter: 'blur(24px)', borderRadius: '16px', padding: '1.25rem' };

  return (
    <div ref={ref} style={{ fontFamily: "var(--font-body)" }}>
      <div data-lg="plate" className="mb-6 w-fit px-6 py-4 rounded-2xl">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: '1.35rem', fontWeight: 800, color: T.head, marginBottom: '0.2rem' }}>{t('dashboard.welcome')}</h2>
        <p style={{ color: T.sub, fontSize: '0.85rem' }}>{t('dashboard.overview')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {T.statCards.map(({ from, to, label, icon: Icon, badge }, i) => (
          <ExpandCard key={label} className="dash-card relative overflow-hidden transition-transform duration-300 hover:-translate-y-1" style={{ borderRadius: '14px', padding: '1.1rem', background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 6px 18px ${from}44` }} detail={<>{statDetails[i]} <button onClick={() => onNavigate('history')} style={{ textDecoration: 'underline', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>View history</button></>}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl pointer-events-none bg-white/15 translate-x-1/3 -translate-y-1/3" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div style={{ padding: '0.45rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}><Icon className="w-4 h-4 text-white" /></div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.25)', color: '#fff', padding: '2px 7px', borderRadius: '999px' }}>{badge}</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: '1.6rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{statValues[i]}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.80)', marginTop: '4px' }}>{label}</div>
          </ExpandCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="dash-card lg:col-span-2" style={glassCard}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: '0.9rem', fontWeight: 700, color: T.head, marginBottom: '0.2rem' }}>{t('dashboard.quickActions')}</h3>
          <p style={{ color: T.sub, fontSize: '0.75rem', marginBottom: '1rem' }}>{t('dashboard.startNewAnalysis')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map(({ label, desc, icon: Icon, from, to }) => (
              <button key={label} onClick={() => onNavigate('analyze')} className="group text-left transition-transform duration-300 hover:-translate-y-1" style={{ padding: '1rem', borderRadius: '12px', background: T.row, border: `1px solid ${T.rowBdr}` }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg,${from},${to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.6rem', boxShadow: `0 4px 12px ${from}55` }}><Icon className="w-4 h-4 text-white" /></div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: '0.75rem', fontWeight: 700, color: T.head, marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '0.68rem', color: T.muted }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="dash-card" style={glassCard}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: '0.9rem', fontWeight: 700, color: T.head, marginBottom: '0.2rem' }}>{t('dashboard.analysisTypes')}</h3>
          <p style={{ color: T.sub, fontSize: '0.75rem', marginBottom: '1rem' }}>{t('dashboard.breakdownByCategory')}</p>
          {Object.keys(typeBreakdown).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: T.muted }}><CircleAlert className="w-10 h-10 mx-auto mb-2 opacity-40" /><p style={{ fontSize: '0.82rem' }}>{t('dashboard.noAnalysesYet')}</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(typeBreakdown).map(([type, count]) => (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}><span style={{ color: T.muted, textTransform: 'capitalize' }}>{type}</span><span style={{ fontWeight: 700, color: T.text }}>{count}</span></div>
                  <div style={{ height: '6px', background: T.trackBg, borderRadius: '999px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${(count / totalAnalyses) * 100}%`, borderRadius: '999px', background: `linear-gradient(90deg, ${typeColors[type] || '#8b5cf6'}, ${typeColors[type] || '#8b5cf6'}88)` }} /></div>
                </div>
              ))}
              <button onClick={() => onNavigate('history')} style={{ marginTop: '0.5rem', padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${T.cardBdr}`, background: T.row, color: T.text, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: "var(--font-display)" }}>{t('dashboard.viewFullHistory')}</button>
            </div>
          )}
        </div>
      </div>

      <div className="dash-card mb-6" style={glassCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: '0.9rem', fontWeight: 700, color: T.head }}>{t('dashboard.recentAnalyses')}</h3>
            <p style={{ color: T.sub, fontSize: '0.75rem', marginTop: '2px' }}>{t('dashboard.latestPredictions')}</p>
          </div>
        </div>
        {recentPredictions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}><p>{t('dashboard.noAnalysesYet')}</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentPredictions.map(p => (
              <div key={p.id} style={{ padding: '1rem 1.25rem', borderRadius: '14px', background: T.row, border: `1px solid ${T.rowBdr}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${typeColors[p.type] || '#8b5cf6'}22`, color: typeColors[p.type] || '#8b5cf6' }}>{getIcon(p.type)}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: T.text, fontSize: '0.9rem' }}>{p.diagnosis}</div>
                      <div style={{ fontSize: '0.72rem', color: T.muted }}><Clock className="w-3 h-3 inline mr-1" />{new Date(p.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: T.muted, marginBottom: '0.5rem' }}>{p.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}