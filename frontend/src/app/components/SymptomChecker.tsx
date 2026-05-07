import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, CircleAlert, CircleCheck, X } from 'lucide-react';
import type { Prediction } from '../App';
import { useTheme } from '../App';
import gsap from 'gsap';
import { LoadingScreen } from './LoadingScreen';
import MarkdownText from './effects/MarkdownText';

const SYMPTOMS = [
  { id: 'fever',           name: 'Fever',              category: 'General' },
  { id: 'cough',           name: 'Cough',              category: 'Respiratory' },
  { id: 'fatigue',         name: 'Fatigue',            category: 'General' },
  { id: 'headache',        name: 'Headache',           category: 'Neurological' },
  { id: 'sore-throat',     name: 'Sore Throat',        category: 'Respiratory' },
  { id: 'nausea',          name: 'Nausea',             category: 'Digestive' },
  { id: 'vomiting',        name: 'Vomiting',           category: 'Digestive' },
  { id: 'diarrhea',        name: 'Diarrhea',           category: 'Digestive' },
  { id: 'shortness-breath',name: 'Shortness of Breath',category: 'Respiratory' },
  { id: 'chest-pain',      name: 'Chest Pain',         category: 'Cardiovascular' },
  { id: 'abdominal-pain',  name: 'Abdominal Pain',     category: 'Digestive' },
  { id: 'muscle-pain',     name: 'Muscle Pain',        category: 'Musculoskeletal' },
  { id: 'joint-pain',      name: 'Joint Pain',         category: 'Musculoskeletal' },
  { id: 'rash',            name: 'Rash',               category: 'Dermatological' },
  { id: 'dizziness',       name: 'Dizziness',          category: 'Neurological' },
  { id: 'loss-smell',      name: 'Loss of Smell',      category: 'Respiratory' },
  { id: 'loss-taste',      name: 'Loss of Taste',      category: 'Respiratory' },
  { id: 'chills',          name: 'Chills',             category: 'General' },
  { id: 'sweating',        name: 'Excessive Sweating', category: 'General' },
  { id: 'congestion',      name: 'Nasal Congestion',   category: 'Respiratory' },
];

interface SymptomCheckerProps {
  onPrediction: (prediction: Omit<Prediction, 'id' | 'timestamp'>) => void;
}

export function SymptomChecker({ onPrediction }: SymptomCheckerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sc-card',
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'expo.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const T = isDark ? {
    cardBg:  'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow:  '0 8px 32px rgba(0,0,0,0.5)',
    head:    '#ffffff', sub:     'rgba(255,255,255,0.50)', text:    '#ffffff', muted:   'rgba(255,255,255,0.45)',
    inpBg:   'rgba(255,255,255,0.06)', rowHov:  'rgba(255,255,255,0.06)', selBg:   'rgba(139,92,246,0.18)', selBdr:  'rgba(139,92,246,0.45)',
    catHead: 'rgba(255,255,255,0.35)', tagBg:   'rgba(139,92,246,0.20)', tagBdr:  'rgba(139,92,246,0.40)', resBg:   'rgba(99,102,241,0.12)',
    resBdr:  'rgba(99,102,241,0.28)', recBg:   'rgba(255,255,255,0.04)', recBdr:  'rgba(255,255,255,0.08)', amberBg: 'rgba(245,158,11,0.12)',
    amberBdr:'rgba(245,158,11,0.30)', amberTxt:'#fde68a', btnBg:   'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh:   '0 4px 20px rgba(99,102,241,0.45)',
  } : {
    cardBg:  'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow:  '0 4px 20px rgba(0,0,0,0.07)',
    head:    '#0a0a1a', sub:     'rgba(10,10,26,0.50)', text:    '#0a0a1a', muted:   'rgba(10,10,26,0.45)',
    inpBg:   'rgba(0,0,0,0.04)', rowHov:  'rgba(0,0,0,0.04)', selBg:   'rgba(109,40,217,0.07)', selBdr:  'rgba(109,40,217,0.25)',
    catHead: 'rgba(10,10,26,0.40)', tagBg:   'rgba(109,40,217,0.10)', tagBdr:  'rgba(109,40,217,0.25)', resBg:   'rgba(99,102,241,0.06)',
    resBdr:  'rgba(99,102,241,0.18)', recBg:   'rgba(0,0,0,0.025)', recBdr:  'rgba(0,0,0,0.07)', amberBg: 'rgba(245,158,11,0.07)',
    amberBdr:'rgba(245,158,11,0.22)', amberTxt:'#92400e', btnBg:   'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh:   '0 4px 16px rgba(99,102,241,0.30)',
  };

  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px' };
  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";

  const filteredSymptoms = SYMPTOMS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories = [...new Set(SYMPTOMS.map(s => s.category))];
  const toggleSymptom = (id: string) => setSelectedSymptoms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleAnalyze = async () => {
    if (!selectedSymptoms.length) return;
    setAnalyzing(true); setResult(null);

    try {
      const symptomString = selectedSymptoms.map(id => SYMPTOMS.find(s => s.id === id)?.name).join(", ");
      
      // LIVE API CALL TO FASTAPI BACKEND
      const response = await fetch("http://localhost:8000/api/v1/diagnostics/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}` },
        body: JSON.stringify({ patient_id: "demo-user", symptoms: symptomString })
      });

      if (!response.ok) throw new Error("API Gateway Offline");
      const data = await response.json();

      // Backend now returns structured triage:
      //   { analysis: { assessment, confidence, urgency, conditions[], recommendations[] }, result }
      const a = (data.analysis || {}) as any;
      const mappedResult = {
        diagnosis: 'AI Triage Assessment',
        confidence: typeof a.confidence === 'number' ? a.confidence : 80,
        details: a.assessment || data.result || '',
        urgency: (a.urgency || 'medium') as 'low' | 'medium' | 'high' | 'emergency',
        conditions: Array.isArray(a.conditions) ? a.conditions : [],
        recommendations: Array.isArray(a.recommendations) && a.recommendations.length
          ? a.recommendations
          : ['Review AI notes carefully.', 'Monitor vitals.', 'Consult a physician if symptoms worsen.'],
      };

      setResult(mappedResult);
      onPrediction({ type: 'symptom', ...mappedResult });

    } catch (error) {
      console.error(error);
      setResult({
        diagnosis: 'Connection Error',
        confidence: 0,
        details: 'Could not connect to AI Core. Ensure Python backend is running on port 8000.',
        urgency: 'low',
        conditions: [],
        recommendations: [],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Urgency display (emoji + color + label per level) ── */
  const URGENCY = {
    low:       { emoji: '🟢', label: 'ALL CLEAR',     color: '#10b981', sub: 'Self-care is appropriate.' },
    medium:    { emoji: '🟡', label: 'MONITOR',       color: '#f59e0b', sub: 'See a doctor in the next day or two.' },
    high:      { emoji: '🟠', label: 'CONCERNING',    color: '#f97316', sub: 'Consult a physician today.' },
    emergency: { emoji: '🚨', label: 'EMERGENCY',     color: '#ef4444', sub: 'Seek immediate medical attention.' },
  } as const;

  if (analyzing) return <LoadingScreen message="NEURAL NETWORK PROCESSING..." />;

  return (
    <div ref={ref} style={{ fontFamily: I }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Symptom picker ── */}
        <div className="sc-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>Select Your Symptoms</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Choose all symptoms you are currently experiencing</p>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.muted }} />
            <input placeholder="Search symptoms..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', background: T.inpBg, border: `1px solid ${T.cardBdr}`, borderRadius: '12px', color: T.text, fontSize: '0.875rem', outline: 'none' }} />
          </div>

          {selectedSymptoms.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
              {selectedSymptoms.map(id => {
                const s = SYMPTOMS.find(x => x.id === id);
                return s ? (
                  <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: T.tagBg, border: `1px solid ${T.tagBdr}`, color: isDark ? '#a78bfa' : '#6d28d9' }}>
                    {s.name}
                    <button onClick={() => toggleSymptom(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
              <button onClick={() => setSelectedSymptoms([])} style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: 'none', border: `1px solid ${T.cardBdr}`, color: T.muted, cursor: 'pointer' }}>Clear all</button>
            </div>
          )}

          <p style={{ fontSize: '0.75rem', color: T.catHead, marginBottom: '0.75rem' }}>{selectedSymptoms.length} symptom(s) selected</p>

          {/* data-lenis-prevent tells Lenis (smooth scroll) not to swallow
              wheel events inside this container, so the inner list scrolls
              instead of scrolling the whole page. */}
          <div data-lenis-prevent style={{ maxHeight: '380px', overflowY: 'auto', overscrollBehavior: 'contain', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categories.map(cat => {
              const catSymptoms = filteredSymptoms.filter(s => s.category === cat);
              if (!catSymptoms.length) return null;
              return (
                <div key={cat}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.catHead, fontFamily: S, marginBottom: '0.5rem' }}>{cat}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {catSymptoms.map(s => {
                      const sel = selectedSymptoms.includes(s.id);
                      return (
                        <label key={s.id} className="transition-all duration-200 cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0.75rem', borderRadius: '10px', background: sel ? T.selBg : 'transparent', border: `1px solid ${sel ? T.selBdr : 'transparent'}` }} onMouseEnter={e => { if (!sel) (e.currentTarget as HTMLElement).style.background = T.rowHov; }} onMouseLeave={e => { if (!sel) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '5px', border: `2px solid ${sel ? '#8b5cf6' : T.catHead}`, background: sel ? '#8b5cf6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                            {sel && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <input type="checkbox" checked={sel} onChange={() => toggleSymptom(s.id)} style={{ display: 'none' }} />
                          <span style={{ fontSize: '0.85rem', color: T.text }}>{s.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleAnalyze} disabled={!selectedSymptoms.length || analyzing} className="w-full mt-5 transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed" style={{ padding: '0.9rem', borderRadius: '14px', background: T.btnBg, boxShadow: selectedSymptoms.length ? T.btnSh : 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 700, fontFamily: S, border: 'none', cursor: selectedSymptoms.length ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.05em' }}>
            {analyzing ? (<><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...</>) : 'Analyze Symptoms'}
          </button>
        </div>

        {/* ── Right: Results ── */}
        <div className="sc-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>AI Analysis Results</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>AI-powered prediction based on your symptoms</p>

          {!result && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}>
              <CircleAlert className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p style={{ fontSize: '0.9rem' }}>Select symptoms and click "Analyze" to get AI predictions</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: '14px', background: T.resBg, border: `1px solid ${T.resBdr}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '1.1rem' }}>{result.diagnosis}</h4>
                  <span style={{ padding: '3px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, fontFamily: S, background: result.confidence >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: result.confidence >= 80 ? '#10b981' : '#f59e0b', border: `1px solid ${result.confidence >= 80 ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, whiteSpace: 'nowrap' }}>{result.confidence}% confidence</span>
                </div>
                <MarkdownText style={{ color: T.text, fontSize: '0.85rem' }}>
                  {result.details}
                </MarkdownText>
              </div>

              {/* ── URGENCY BADGE ──
                  Big, color-coded card with emoji indicator. The user
                  should be able to glance at this and know the severity
                  without reading prose. */}
              {result.urgency && URGENCY[result.urgency as keyof typeof URGENCY] && (() => {
                const u = URGENCY[result.urgency as keyof typeof URGENCY];
                return (
                  <div style={{
                    padding: '1rem 1.1rem',
                    borderRadius: '14px',
                    background: `${u.color}14`,
                    border: `1px solid ${u.color}55`,
                    boxShadow: `0 0 24px -8px ${u.color}66`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}>
                    <span style={{
                      fontSize: '2rem',
                      lineHeight: 1,
                      filter: result.urgency === 'emergency' ? `drop-shadow(0 0 8px ${u.color})` : 'none',
                      animation: result.urgency === 'emergency' ? 'sc-pulse 1.2s ease-in-out infinite' : undefined,
                    }}>{u.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.18em', color: T.muted, fontFamily: S }}>URGENCY LEVEL</span>
                        <span style={{
                          fontFamily: S,
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          color: u.color,
                          letterSpacing: '0.05em',
                        }}>{u.label}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: T.text }}>{u.sub}</span>
                    </div>
                  </div>
                );
              })()}
              {/* keyframes for the emergency pulse — injected once via a
                  style tag so we don't need a separate stylesheet entry */}
              <style>{`@keyframes sc-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }`}</style>

              {/* ── POTENTIAL CONDITIONS WITH PROBABILITY BARS ──
                  One row per condition: name on the left, probability bar
                  filling left→right, percentage on the right. The bar's
                  fill color matches the urgency color so the panel reads
                  as a single coherent visual. */}
              {result.conditions && result.conditions.length > 0 && (
                <div>
                  <h5 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                    Potential Conditions
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.conditions.map((c: { name: string; probability: number }, i: number) => {
                      const pct = Math.max(0, Math.min(100, c.probability));
                      // Highest-probability condition gets the urgency color; the rest dim.
                      const isTop = i === 0;
                      const u = URGENCY[(result.urgency as keyof typeof URGENCY) || 'medium'];
                      const barColor = isTop ? u.color : (isDark ? '#8b5cf6' : '#6366f1');
                      return (
                        <div key={i} style={{ background: T.recBg, border: `1px solid ${T.recBdr}`, borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: T.text }}>{c.name}</span>
                            <span style={{
                              fontFamily: S,
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              color: barColor,
                              tabularNums: 'tabular-nums' as any,
                            }}>{pct}%</span>
                          </div>
                          <div style={{ height: '6px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${pct}%`,
                              borderRadius: '999px',
                              background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
                              boxShadow: `0 0 10px ${barColor}88`,
                              transition: 'width 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: T.muted }}>Overall Confidence</span>
                  <span style={{ fontWeight: 700, color: T.text }}>{result.confidence}%</span>
                </div>
                <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.confidence}%`, borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 1s ease' }} />
                </div>
              </div>

              <div>
                <h5 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
                  <CircleCheck className="w-4 h-4" style={{ color: '#10b981' }} /> System Recommendations
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.recommendations.map((rec: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0.65rem 0.85rem', borderRadius: '10px', background: T.recBg, border: `1px solid ${T.recBdr}` }}>
                      <span style={{ fontFamily: S, fontWeight: 700, color: '#8b5cf6', fontSize: '0.75rem', marginTop: '1px', flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ fontSize: '0.82rem', color: T.text }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: T.amberBg, border: `1px solid ${T.amberBdr}` }}>
                <p style={{ fontSize: '0.75rem', color: T.amberTxt }}>⚠️ This is an AI-based prediction for informational purposes only. Always consult with a qualified healthcare professional.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}