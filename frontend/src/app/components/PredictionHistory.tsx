import { useState, useEffect, useRef, JSX } from 'react';
import { Stethoscope, Activity, FileText, Clock, TrendingUp, History as HistoryIcon, Heart, X, CircleCheck, AlertTriangle } from 'lucide-react';
import type { Prediction } from '../App';
import { useTheme } from '../App';
import gsap from 'gsap';
import MarkdownText from './effects/MarkdownText';

interface PredictionHistoryProps {
  predictions: Prediction[];
  onLike?: (id: string) => void;
}

export function PredictionHistory({ predictions, onLike }: PredictionHistoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filterLiked, setFilterLiked] = useState(false);
  const [selected, setSelected] = useState<Prediction | null>(null);

  // Close detail modal on Escape.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    // Lock background scroll while modal is open.
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

  const formatDate = (date: Date | string | number | null | undefined) => {
    // MongoDB returns timestamps as ISO strings — coerce to Date here so
    // callers don't have to. Bail safely if the value is missing or unparseable.
    const d = date instanceof Date ? date : new Date(date as any);
    if (isNaN(d.getTime())) return '—';
    const now = new Date(); const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000); const hrs = Math.floor(diff / 3600000); const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now'; if (mins < 60) return `${mins}m ago`; if (hrs < 24) return `${hrs}h ago`; if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(p)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(p); } }}
                className="transition-all duration-300 hover:scale-[1.01]"
                style={{ padding: '1rem 1.25rem', borderRadius: '14px', background: T.rowBg, border: `1px solid ${T.rowBdr}`, position: 'relative', cursor: 'pointer' }}
              >
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
                  <span style={{ fontSize: '0.7rem', color: T.muted, opacity: 0.7 }}>Click to view full report →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail modal: full diagnosis, markdown details, recommendations ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem', overflowY: 'auto',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...glass,
              width: '100%', maxWidth: '720px', maxHeight: 'calc(100vh - 3rem)',
              overflowY: 'auto', padding: '1.75rem', position: 'relative',
            }}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: T.iconBg, border: `1px solid ${T.rowBdr}`, color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: type pill + title + confidence */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1rem', paddingRight: '2.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${typeColors[selected.type]}22`, color: typeColors[selected.type] }}>
                {typeIcons[selected.type]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, fontFamily: S, letterSpacing: '0.08em', background: `${typeColors[selected.type]}18`, color: typeColors[selected.type], border: `1px solid ${typeColors[selected.type]}30`, marginBottom: '6px', textTransform: 'uppercase' }}>
                  {typeLabels[selected.type]}
                </span>
                <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.2rem', color: T.head, lineHeight: 1.3 }}>{selected.diagnosis}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: T.muted, marginTop: '4px' }}>
                  <Clock className="w-3 h-3" /> {formatDate(selected.timestamp)}
                  {selected.liked && <span style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: 3 }}><Heart className="w-3 h-3" style={{ fill: '#ec4899' }} /> Liked</span>}
                </div>
              </div>
            </div>

            {/* Confidence bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: T.muted }}>Confidence</span>
                <span style={{ fontWeight: 700, color: T.text }}>{selected.confidence}%</span>
              </div>
              <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${selected.confidence}%`, borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
              </div>
            </div>

            {/* Full markdown details */}
            {selected.details && (
              <div style={{ padding: '1rem 1.15rem', borderRadius: '12px', background: T.expBg, border: `1px solid ${T.divider}`, marginBottom: '1.25rem' }}>
                <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Analysis</h4>
                <MarkdownText style={{ color: T.text, fontSize: '0.86rem' }}>
                  {selected.details}
                </MarkdownText>
              </div>
            )}

            {/* Recommendations */}
            {selected.recommendations && selected.recommendations.length > 0 && (
              <div>
                <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.65rem' }}>
                  <CircleCheck className="w-4 h-4" style={{ color: '#10b981' }} /> Recommendations
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selected.recommendations.map((rec: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0.65rem 0.85rem', borderRadius: '10px', background: T.rowBg, border: `1px solid ${T.rowBdr}` }}>
                      <span style={{ fontFamily: S, fontWeight: 700, color: '#8b5cf6', fontSize: '0.72rem', marginTop: '1px', flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ fontSize: '0.82rem', color: T.text }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Like toggle (only if onLike was provided) */}
            {onLike && (
              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => onLike(selected.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, fontFamily: S, cursor: 'pointer', background: selected.liked ? 'linear-gradient(135deg,#ec4899,#be185d)' : T.rowBg, color: selected.liked ? '#fff' : T.muted, border: `1px solid ${selected.liked ? 'transparent' : T.rowBdr}` }}
                >
                  <Heart className="w-4 h-4" style={{ fill: selected.liked ? '#fff' : 'none' }} />
                  {selected.liked ? 'Liked' : 'Like'}
                </button>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ marginTop: '1.25rem', padding: '0.75rem 0.95rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: '#ef4444', marginTop: 2 }} />
              <p style={{ fontSize: '0.72rem', color: isDark ? '#fca5a5' : '#991b1b', lineHeight: 1.5 }}>
                Experimental AI demo — not a medical diagnosis. Always consult a qualified healthcare professional.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}