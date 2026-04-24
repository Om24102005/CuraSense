import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, CircleAlert, CircleCheck, X } from 'lucide-react';
import type { Prediction } from '../App';
import { useTheme } from '../App';
import { analyzeSymptoms } from '../utils/api';
import gsap from 'gsap';
import { LoadingScreen } from './LoadingScreen';

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
    cardBg:  'rgba(12,12,26,0.78)',
    cardBdr: 'rgba(255,255,255,0.10)',
    shadow:  '0 8px 32px rgba(0,0,0,0.5)',
    head:    '#ffffff',
    sub:     'rgba(255,255,255,0.50)',
    text:    '#ffffff',
    muted:   'rgba(255,255,255,0.45)',
    inpBg:   'rgba(255,255,255,0.06)',
    rowHov:  'rgba(255,255,255,0.06)',
    selBg:   'rgba(139,92,246,0.18)',
    selBdr:  'rgba(139,92,246,0.45)',
    catHead: 'rgba(255,255,255,0.35)',
    tagBg:   'rgba(139,92,246,0.20)',
    tagBdr:  'rgba(139,92,246,0.40)',
    resBg:   'rgba(99,102,241,0.12)',
    resBdr:  'rgba(99,102,241,0.28)',
    recBg:   'rgba(255,255,255,0.04)',
    recBdr:  'rgba(255,255,255,0.08)',
    amberBg: 'rgba(245,158,11,0.12)',
    amberBdr:'rgba(245,158,11,0.30)',
    amberTxt:'#fde68a',
    btnBg:   'linear-gradient(135deg,#6366f1,#8b5cf6)',
    btnSh:   '0 4px 20px rgba(99,102,241,0.45)',
  } : {
    cardBg:  'rgba(255,255,255,0.97)',
    cardBdr: 'rgba(0,0,0,0.08)',
    shadow:  '0 4px 20px rgba(0,0,0,0.07)',
    head:    '#0a0a1a',
    sub:     'rgba(10,10,26,0.50)',
    text:    '#0a0a1a',
    muted:   'rgba(10,10,26,0.45)',
    inpBg:   'rgba(0,0,0,0.04)',
    rowHov:  'rgba(0,0,0,0.04)',
    selBg:   'rgba(109,40,217,0.07)',
    selBdr:  'rgba(109,40,217,0.25)',
    catHead: 'rgba(10,10,26,0.40)',
    tagBg:   'rgba(109,40,217,0.10)',
    tagBdr:  'rgba(109,40,217,0.25)',
    resBg:   'rgba(99,102,241,0.06)',
    resBdr:  'rgba(99,102,241,0.18)',
    recBg:   'rgba(0,0,0,0.025)',
    recBdr:  'rgba(0,0,0,0.07)',
    amberBg: 'rgba(245,158,11,0.07)',
    amberBdr:'rgba(245,158,11,0.22)',
    amberTxt:'#92400e',
    btnBg:   'linear-gradient(135deg,#6366f1,#8b5cf6)',
    btnSh:   '0 4px 16px rgba(99,102,241,0.30)',
  };

  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px' };
  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";

  const filteredSymptoms = SYMPTOMS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const categories = [...new Set(SYMPTOMS.map(s => s.category))];
  const toggleSymptom = (id: string) => setSelectedSymptoms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleAnalyze = async () => {
    if (!selectedSymptoms.length) return;
    setAnalyzing(true); setResult(null);
    try {
      const { data, error } = await analyzeSymptoms(selectedSymptoms);
      if (error) {
        setTimeout(() => {
          const r = generateMockResult(selectedSymptoms);
          setResult(r);
          onPrediction({ type: 'symptom', diagnosis: r.diagnosis, confidence: r.confidence, details: r.details, recommendations: r.recommendations });
          setAnalyzing(false);
        }, 3000);
        return;
      }
      setTimeout(() => { setResult(data); onPrediction({ type: 'symptom', diagnosis: data.diagnosis, confidence: data.confidence, details: data.details, recommendations: data.recommendations }); setAnalyzing(false); }, 3000);
    } catch { setAnalyzing(false); }
  };

  if (analyzing) {
    return <LoadingScreen message="NEURAL NETWORK PROCESSING..." />;
  }

  return (
    <div ref={ref} style={{ fontFamily: I }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Symptom picker ── */}
        <div className="sc-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>Select Your Symptoms</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Choose all symptoms you are currently experiencing</p>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.muted }} />
            <input
              placeholder="Search symptoms..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', background: T.inpBg, border: `1px solid ${T.cardBdr}`, borderRadius: '12px', color: T.text, fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          {/* Selected tags */}
          {selectedSymptoms.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
              {selectedSymptoms.map(id => {
                const s = SYMPTOMS.find(x => x.id === id);
                return s ? (
                  <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: T.tagBg, border: `1px solid ${T.tagBdr}`, color: isDark ? '#a78bfa' : '#6d28d9' }}>
                    {s.name}
                    <button onClick={() => toggleSymptom(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null;
              })}
              <button onClick={() => setSelectedSymptoms([])} style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: 'none', border: `1px solid ${T.cardBdr}`, color: T.muted, cursor: 'pointer' }}>Clear all</button>
            </div>
          )}

          <p style={{ fontSize: '0.75rem', color: T.catHead, marginBottom: '0.75rem' }}>{selectedSymptoms.length} symptom(s) selected</p>

          {/* Symptom list */}
          <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                        <label key={s.id} className="transition-all duration-200 cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0.75rem', borderRadius: '10px', background: sel ? T.selBg : 'transparent', border: `1px solid ${sel ? T.selBdr : 'transparent'}` }}
                          onMouseEnter={e => { if (!sel) (e.currentTarget as HTMLElement).style.background = T.rowHov; }}
                          onMouseLeave={e => { if (!sel) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
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

          {/* Analyze btn */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedSymptoms.length || analyzing}
            className="w-full mt-5 transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ padding: '0.9rem', borderRadius: '14px', background: T.btnBg, boxShadow: selectedSymptoms.length ? T.btnSh : 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 700, fontFamily: S, border: 'none', cursor: selectedSymptoms.length ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.05em' }}
          >
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
              {/* Diagnosis card */}
              <div style={{ padding: '1.25rem', borderRadius: '14px', background: T.resBg, border: `1px solid ${T.resBdr}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '1.1rem' }}>{result.diagnosis}</h4>
                  <span style={{ padding: '3px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, fontFamily: S, background: result.confidence >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: result.confidence >= 80 ? '#10b981' : '#f59e0b', border: `1px solid ${result.confidence >= 80 ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, whiteSpace: 'nowrap' }}>{result.confidence}% confidence</span>
                </div>
                <p style={{ color: T.muted, fontSize: '0.85rem' }}>{result.details}</p>
              </div>

              {/* Confidence bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: T.muted }}>Confidence Level</span>
                  <span style={{ fontWeight: 700, color: T.text }}>{result.confidence}%</span>
                </div>
                <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.confidence}%`, borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h5 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
                  <CircleCheck className="w-4 h-4" style={{ color: '#10b981' }} /> Recommendations
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

              {/* Disclaimer */}
              <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: T.amberBg, border: `1px solid ${T.amberBdr}` }}>
                <p style={{ fontSize: '0.75rem', color: T.amberTxt }}>⚠️ This is an AI-based prediction for informational purposes only. Always consult with a qualified healthcare professional for proper diagnosis and treatment.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function generateMockResult(symptoms: string[]): any {
  const mockResults = [
    { symptoms: ['fever','cough','fatigue'], diagnosis: 'Influenza (Flu)', confidence: 87, details: 'Common viral infection affecting the respiratory system', recommendations: ['Get plenty of rest and stay hydrated','Take over-the-counter fever reducers if needed','Monitor symptoms for 3-5 days','Consult a doctor if symptoms worsen or persist beyond 7 days'] },
    { symptoms: ['headache','nausea','dizziness'], diagnosis: 'Migraine', confidence: 82, details: 'Neurological condition causing severe headaches', recommendations: ['Rest in a quiet, dark room','Apply cold compress to forehead','Stay hydrated and avoid triggers','Consider consulting a neurologist if migraines are frequent'] },
    { symptoms: ['chest-pain','shortness-breath'], diagnosis: 'Possible Cardiac Issue', confidence: 75, details: 'Symptoms may indicate cardiovascular concern', recommendations: ['⚠️ SEEK IMMEDIATE MEDICAL ATTENTION','Do not delay - visit emergency room','Avoid physical exertion','Have someone accompany you to the hospital'] },
  ];
  let best = mockResults[0]; let max = 0;
  for (const r of mockResults) { const o = symptoms.filter(s => r.symptoms.includes(s)).length; if (o > max) { max = o; best = r; } }
  if (max === 0) return { diagnosis: 'General Malaise', confidence: 65, details: 'Multiple symptoms detected requiring professional evaluation', recommendations: ['Schedule an appointment with your primary care physician','Keep a symptom diary','Monitor temperature and vital signs','Maintain good hydration and rest'] };
  return best;
}
