import { useState, useEffect, useRef, JSX } from 'react';
import { Stethoscope, Activity, FileText, Clock, TrendingUp, History as HistoryIcon, Heart } from 'lucide-react';
import type { Prediction } from '../App';
import { useTheme } from '../App';
import gsap from 'gsap';

interface PredictionHistoryProps {
  predictions: Prediction[];
  onLike?: (id: string) => void;
}

export function PredictionHistory({ predictions, onLike }: PredictionHistoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filterLiked, setFilterLiked] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ph-item',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'expo.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, [theme, predictions]); // Re-run anim when predictions array updates

  const T = isDark ? {
    cardBg: 'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow: '0 8px 32px rgba(0,0,0,0.5)',
    head: '#ffffff', sub: 'rgba(255,255,255,0.50)', text: '#ffffff', muted: 'rgba(255,255,255,0.45)',
    rowBg: 'rgba(255,255,255,0.04)', rowBdr: 'rgba(255,255,255,0.08)', iconBg: 'rgba(255,255,255,0.08)',
    divider: 'rgba(255,255,255,0.06)', expBg: 'rgba(255,255,255,0.04)',
    statGrad: ['rgba(14,165,233,0.15)', 'rgba(139,92,246,0.15)', 'rgba(16,185,129,0.15)'],
    statBdr: ['rgba(14,165,233,0.25)', 'rgba(139,92,246,0.25)', 'rgba(16,185,129,0.25)'],
    statIcons: ['#0ea5e9', '#8b5cf6', '#10b981'],
    btnBg: 'linear-gradient(135deg,#0ea5e9,#6366f1)', btnSh: '0 4px 14px rgba(99,102,241,0.4)',
  } : {
    cardBg: 'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow: '0 4px 20px rgba(0,0,0,0.07)',
    head: '#0a0a1a', sub: 'rgba(10,10,26,0.50)', text: '#0a0a1a', muted: 'rgba(10,10,26,0.45)',
    rowBg: 'rgba(0,0,0,0.02)', rowBdr: 'rgba(0,0,0,0.07)', iconBg: 'rgba(0,0,0,0.06)',
    divider: 'rgba(0,0,0,0.06)', expBg: 'rgba(0,0,0,0.025)',
    statGrad: ['rgba(14,165,233,0.07)', 'rgba(139,92,246,0.07)', 'rgba(16,185,129,0.07)'],
    statBdr: ['rgba(14,165,233,0.15)', 'rgba(139,92,246,0.15)', 'rgba(16,185,129,0.15)'],
    statIcons: ['#0ea5e9', '#8b5cf6', '#10b981'],
    btnBg: 'linear-gradient(135deg,#0ea5e9,#6366f1)', btnSh: '0 4px 12px rgba(99,102,241,0.25)',
  };

  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";
  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px' };

  const typeColors: Record<string, string> = { symptom: '#0ea5e9', image: '#8b5cf6', report: '#ec4899' };
  const typeLabels: Record<string, string> = { symptom: 'Symptom Analysis', image: 'Image Analysis', report: 'Report Analysis' };
  const typeIcons: Record<string, JSX.Element> = { symptom: <Stethoscope className="w-4 h-4" />, image: <Activity className="w-4 h-4" />, report: <FileText className="w-4 h-4" /> };

  const formatDate = (date: Date) => {
    const now = new Date(); const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000); const hrs = Math.floor(diff / 3600000); const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now'; if (mins < 60) return `${mins}m ago`; if (hrs < 24) return `${hrs}h ago`; if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const avgConfidence = predictions.length > 0 ? Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length) : 0;
  const typeBreakdown = predictions.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc; }, {} as Record<string, number>);
  const likedCount = predictions.filter(p => p.liked).length;
  const mostUsed = Object.entries(typeBreakdown).length > 0 ? typeLabels[Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1])[0][0] as Prediction['type']] : 'N/A';
  const filtered = filterLiked ? predictions.filter(p => p.liked) : predictions;

  return (
    <div ref={ref} style={{ fontFamily: I, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stat cards */}
      {predictions.length > 0 && (
        <div className="ph-item grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'Total Analyses', value: predictions.length, icon: HistoryIcon, ci: 0 },
            { label: 'Avg Confidence', value: `${avgConfidence}%`, icon: TrendingUp, ci: 1 },
            { label: 'Most Used', value: mostUsed, icon: Activity, ci: 2 },
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

      {/* History List */}
      <div className="ph-item" style={{ ...glass, padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.05rem', color: T.head }}>Analysis History</h3>
            <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>View all your previous AI-powered medical analyses</p>
          </div>
          {likedCount > 0 && (
            <button onClick={() => setFilterLiked(!filterLiked)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, fontFamily: S, cursor: 'pointer', background: filterLiked ? 'linear-gradient(135deg,#ec4899,#be185d)' : T.rowBg, color: filterLiked ? '#fff' : T.muted, border: `1px solid ${filterLiked ? 'transparent' : T.rowBdr}`, boxShadow: filterLiked ? '0 4px 12px rgba(236,72,153,0.4)' : 'none', transition: 'all 0.3s ease' }}>
              <Heart className="w-4 h-4" style={{ fill: filterLiked ? '#fff' : 'none' }} />
              {filterLiked ? `Liked (${likedCount})` : `Show Liked (${likedCount})`}
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}>
            <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{filterLiked ? 'No liked analyses yet' : 'No analysis history yet'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map(p => (
              <div key={p.id} className="transition-all duration-300 hover:scale-[1.01]" style={{ padding: '1rem 1.25rem', borderRadius: '14px', background: T.rowBg, border: `1px solid ${T.rowBdr}`, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingRight: '2.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${typeColors[p.type]}22`, color: typeColors[p.type] }}>
                    {typeIcons[p.type]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <div>
                        <span style={{ display: 'inline-block', padding: '1px 8px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, fontFamily: S, letterSpacing: '0.08em', background: `${typeColors[p.type]}18`, color: typeColors[p.type], border: `1px solid ${typeColors[p.type]}30`, marginBottom: '4px', textTransform: 'uppercase' }}>{typeLabels[p.type]}</span>
                        <div style={{ fontWeight: 700, color: T.text, fontSize: '0.92rem', textTransform: 'capitalize' }}>{p.diagnosis}</div>
                      </div>
                      <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, fontFamily: S, background: p.confidence >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: p.confidence >= 80 ? '#10b981' : '#f59e0b', border: `1px solid ${p.confidence >= 80 ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, whiteSpace: 'nowrap' }}>{p.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${T.divider}` }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: T.muted }}>
                    <Clock className="w-3 h-3" />{formatDate(p.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}