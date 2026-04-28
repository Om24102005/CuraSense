import { useEffect, useRef } from 'react';
import { Activity, Brain, FileText, TrendingUp, Calendar, Clock, CircleAlert, CircleCheck, Zap, Target, ArrowRight } from 'lucide-react';
import type { Prediction } from '../App';
import { useTheme } from '../App';
import gsap from 'gsap';

interface DashboardProps { predictions: Prediction[]; onNavigate: (tab: string) => void; }

export function Dashboard({ predictions, onNavigate }: DashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.dash-card', { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out', delay: 0.1 });
    }, ref);
    return () => ctx.revert();
  }, [theme]);

  const T = isDark ? {
    head: '#ffffff', sub: 'rgba(255,255,255,0.55)', cardBg: 'rgba(12,12,26,0.75)', cardBdr: 'rgba(255,255,255,0.10)',
    row: 'rgba(255,255,255,0.04)', rowBdr: 'rgba(255,255,255,0.07)', text: '#ffffff', muted: 'rgba(255,255,255,0.50)',
    trackBg: 'rgba(255,255,255,0.08)', statCards: [
      { from: '#0ea5e9', to: '#6366f1', label: 'Total Analyses', icon: Target, badge: 'All Time' },
      { from: '#10b981', to: '#059669', label: "Today's Analyses", icon: Calendar, badge: 'Today' },
      { from: '#8b5cf6', to: '#6d28d9', label: 'Avg Confidence', icon: TrendingUp, badge: 'Avg' },
      { from: '#f59e0b', to: '#d97706', label: 'Avg Response', icon: Zap, badge: 'Fast' },
    ],
  } : {
    head: '#0a0a1a', sub: 'rgba(10,10,26,0.55)', cardBg: 'rgba(255,255,255,0.96)', cardBdr: 'rgba(0,0,0,0.08)',
    row: 'rgba(0,0,0,0.025)', rowBdr: 'rgba(0,0,0,0.06)', text: '#0a0a1a', muted: 'rgba(10,10,26,0.50)',
    trackBg: 'rgba(0,0,0,0.08)', statCards: [
      { from: '#0ea5e9', to: '#6366f1', label: 'Total Analyses', icon: Target, badge: 'All Time' },
      { from: '#10b981', to: '#059669', label: "Today's Analyses", icon: Calendar, badge: 'Today' },
      { from: '#8b5cf6', to: '#6d28d9', label: 'Avg Confidence', icon: TrendingUp, badge: 'Avg' },
      { from: '#f59e0b', to: '#d97706', label: 'Avg Response', icon: Zap, badge: 'Fast' },
    ],
  };

  const totalAnalyses = predictions.length;
  const avgConfidence = totalAnalyses > 0 ? Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / totalAnalyses) : 0;
  const typeBreakdown = predictions.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc; }, {} as Record<string, number>);
  const recentPredictions = predictions.slice(0, 3);
  const todayAnalyses = predictions.filter(p => new Date(p.timestamp).toDateString() === new Date().toDateString()).length;
  const statValues = [totalAnalyses, todayAnalyses, `${avgConfidence}%`, '2.5s'];

  const typeColors: Record<string, string> = { symptom: '#0ea5e9', image: '#8b5cf6', report: '#ec4899' };
  const getIcon = (type: string) => ({ symptom: <Activity className="w-4 h-4" />, image: <Brain className="w-4 h-4" />, report: <FileText className="w-4 h-4" /> }[type]);

  const quickActions = [
    { label: 'Symptom Check', desc: 'Analyze your symptoms', icon: Activity, from: '#0ea5e9', to: '#6366f1' },
    { label: 'Upload Scan', desc: 'Analyze medical images', icon: Brain, from: '#8b5cf6', to: '#6d28d9' },
    { label: 'Lab Report', desc: 'Analyze test results', icon: FileText, from: '#ec4899', to: '#be185d' },
  ];

  const glassCard = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, backdropFilter: 'blur(24px)', borderRadius: '20px', padding: '1.5rem' };

  return (
    <div ref={ref} style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="dash-card mb-8">
        <h2 style={{ fontFamily: "'Michroma', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: T.head, marginBottom: '0.25rem' }}>Welcome Back 👋</h2>
        <p style={{ color: T.sub, fontSize: '0.95rem' }}>Here's your health analysis overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {T.statCards.map(({ from, to, label, icon: Icon, badge }, i) => (
          <div key={label} className="dash-card relative overflow-hidden transition-transform duration-300 hover:-translate-y-1" style={{ borderRadius: '20px', padding: '1.5rem', background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 8px 24px ${from}44` }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none bg-white/15 translate-x-1/3 -translate-y-1/3" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}><Icon className="w-5 h-5 text-white" /></div>
              <span style={{ fontFamily: "'Michroma', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.25)', color: '#fff', padding: '2px 8px', borderRadius: '999px' }}>{badge}</span>
            </div>
            <div style={{ fontFamily: "'Michroma', sans-serif", fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{statValues[i]}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.80)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="dash-card lg:col-span-2" style={glassCard}>
          <h3 style={{ fontFamily: "'Michroma', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: T.head, marginBottom: '0.25rem' }}>Quick Actions</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Start a new analysis</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map(({ label, desc, icon: Icon, from, to }) => (
              <button key={label} onClick={() => onNavigate('analyze')} className="group text-left transition-transform duration-300 hover:-translate-y-1" style={{ padding: '1.25rem', borderRadius: '16px', background: T.row, border: `1px solid ${T.rowBdr}` }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `linear-gradient(135deg,${from},${to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', boxShadow: `0 4px 12px ${from}55` }}><Icon className="w-5 h-5 text-white" /></div>
                <div style={{ fontFamily: "'Michroma', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: T.head, marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '0.72rem', color: T.muted }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="dash-card" style={glassCard}>
          <h3 style={{ fontFamily: "'Michroma', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: T.head, marginBottom: '0.25rem' }}>Analysis Types</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Breakdown by category</p>
          {Object.keys(typeBreakdown).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: T.muted }}><CircleAlert className="w-10 h-10 mx-auto mb-2 opacity-40" /><p style={{ fontSize: '0.82rem' }}>No analyses yet</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(typeBreakdown).map(([type, count]) => (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}><span style={{ color: T.muted, textTransform: 'capitalize' }}>{type}</span><span style={{ fontWeight: 700, color: T.text }}>{count}</span></div>
                  <div style={{ height: '6px', background: T.trackBg, borderRadius: '999px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${(count / totalAnalyses) * 100}%`, borderRadius: '999px', background: `linear-gradient(90deg, ${typeColors[type] || '#8b5cf6'}, ${typeColors[type] || '#8b5cf6'}88)` }} /></div>
                </div>
              ))}
              <button onClick={() => onNavigate('history')} style={{ marginTop: '0.5rem', padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${T.cardBdr}`, background: T.row, color: T.text, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Michroma', sans-serif" }}>View Full History</button>
            </div>
          )}
        </div>
      </div>

      <div className="dash-card mb-8" style={glassCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: "'Michroma', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: T.head }}>Recent Analyses</h3>
            <p style={{ color: T.sub, fontSize: '0.82rem', marginTop: '2px' }}>Your latest AI-powered predictions</p>
          </div>
        </div>
        {recentPredictions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}><p>No analyses yet</p></div>
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