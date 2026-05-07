import { useState, useRef, useEffect } from 'react';
import { FileText, CircleCheck, AlertTriangle, Play } from 'lucide-react';
import type { Prediction } from '../App';
import { useTheme } from '../App';
import gsap from 'gsap';
import { LoadingScreen } from './LoadingScreen';
import MarkdownText from './effects/MarkdownText';

interface ReportAnalysisProps {
  onPrediction: (prediction: Omit<Prediction, 'id' | 'timestamp'>) => void;
}

export function ReportAnalysis({ onPrediction }: ReportAnalysisProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [reportText, setReportText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ra-card', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'expo.out' });
    }, ref);
    return () => ctx.revert();
  }, []);

  const T = isDark ? {
    cardBg:  'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow:  '0 8px 32px rgba(0,0,0,0.5)',
    head:    '#ffffff', sub:     'rgba(255,255,255,0.50)', text:    '#ffffff', muted:   'rgba(255,255,255,0.45)',
    btnBg:   'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh:   '0 4px 20px rgba(99,102,241,0.45)',
    txtBg:   'rgba(255,255,255,0.03)', txtBdr:  'rgba(255,255,255,0.1)', txtFoc: '#8b5cf6',
    resBg:   'rgba(99,102,241,0.12)', resBdr:  'rgba(99,102,241,0.28)', recBg:   'rgba(255,255,255,0.04)', recBdr:  'rgba(255,255,255,0.08)',
    amberBg: 'rgba(245,158,11,0.12)', amberBdr:'rgba(245,158,11,0.30)', amberTxt:'#fde68a',
    findBg:  'rgba(255,255,255,0.04)', tipBg: 'rgba(14,165,233,0.1)', tipTxt: '#38bdf8'
  } : {
    cardBg:  'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow:  '0 4px 20px rgba(0,0,0,0.07)',
    head:    '#0a0a1a', sub:     'rgba(10,10,26,0.50)', text:    '#0a0a1a', muted:   'rgba(10,10,26,0.45)',
    btnBg:   'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh:   '0 4px 16px rgba(99,102,241,0.30)',
    txtBg:   'rgba(0,0,0,0.02)', txtBdr:  'rgba(0,0,0,0.12)', txtFoc: '#6d28d9',
    resBg:   'rgba(99,102,241,0.06)', resBdr:  'rgba(99,102,241,0.18)', recBg:   'rgba(0,0,0,0.025)', recBdr:  'rgba(0,0,0,0.07)',
    amberBg: 'rgba(245,158,11,0.07)', amberBdr:'rgba(245,158,11,0.22)', amberTxt:'#92400e',
    findBg:  'rgba(0,0,0,0.03)', tipBg: 'rgba(14,165,233,0.08)', tipTxt: '#0284c7'
  };

  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px' };
  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;
    setAnalyzing(true); setResult(null);

    try {
      // LIVE API CALL TO FASTAPI BACKEND
      const response = await fetch("http://localhost:8000/api/v1/diagnostics/lab-report", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}` },
        body: JSON.stringify({ patient_id: "demo-user", report_text: reportText })
      });

      if (!response.ok) throw new Error("API Gateway Offline");
      const data = await response.json();

      // New shape from /lab-report endpoint:
      //   { status, module, analysis: { assessment, confidence, urgency, biomarkers[], recommendations[] } }
      const a = (data.analysis || {}) as any;

      const mappedResult = {
        diagnosis: 'Clinical Lab Analysis',
        confidence: typeof a.confidence === 'number' ? a.confidence : 80,
        details: a.assessment || 'No assessment returned.',
        urgency: a.urgency || 'medium',
        recommendations: Array.isArray(a.recommendations) && a.recommendations.length
          ? a.recommendations
          : ['Review extracted values with a physician.'],
        biomarkers: Array.isArray(a.biomarkers) ? a.biomarkers : [],
      };

      setResult(mappedResult);
      onPrediction({ type: 'report', ...mappedResult });

    } catch (error) {
      console.error(error);
      setResult({
        diagnosis: 'Processing Error',
        confidence: 0,
        details: 'AI analyst offline. Ensure the Python backend is running on port 8000 and that MISTRAL_API_KEY or GROQ_API_KEY is set in backend/.env.',
        urgency: 'low',
        recommendations: [],
        biomarkers: [],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Color tokens for biomarker status ── */
  const STATUS = {
    normal:   { color: '#10b981', label: 'NORMAL'   },
    low:      { color: '#f59e0b', label: 'LOW'      },
    high:     { color: '#f59e0b', label: 'HIGH'     },
    critical: { color: '#ef4444', label: 'CRITICAL' },
  } as const;

  /* ── Health bar for one biomarker ──
     Visual range = normal_min/max ± one normal-range-width on each side,
     so the green "normal" zone always sits in the middle and the marker
     lands proportionally inside or outside it. */
  const renderBiomarker = (b: any, i: number) => {
    const { name, value, unit, normal_min, normal_max, status } = b;
    const span = Math.max(1, normal_max - normal_min);
    const visualMin = normal_min - span;
    const visualMax = normal_max + span;
    const clamp = (n: number) => Math.max(0, Math.min(100, n));
    const pos = clamp(((value - visualMin) / (visualMax - visualMin)) * 100);
    const normalStart = clamp(((normal_min - visualMin) / (visualMax - visualMin)) * 100);
    const normalEnd = clamp(((normal_max - visualMin) / (visualMax - visualMin)) * 100);
    const s = STATUS[status as keyof typeof STATUS] || STATUS.normal;

    return (
      <div key={i} style={{
        padding: '0.85rem 1rem',
        borderRadius: '12px',
        background: T.findBg,
        border: `1px solid ${s.color}22`,
      }}>
        {/* Header row: name + status pill */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: T.text }}>{name}</span>
          <span style={{
            padding: '2px 9px',
            borderRadius: '999px',
            fontSize: '0.65rem',
            fontWeight: 800,
            fontFamily: S,
            letterSpacing: '0.08em',
            background: `${s.color}22`,
            color: s.color,
            border: `1px solid ${s.color}55`,
          }}>{s.label}</span>
        </div>

        {/* Value */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '0.55rem' }}>
          <span style={{ fontFamily: S, fontSize: '1.4rem', fontWeight: 700, color: s.color }}>
            {Number.isInteger(value) ? value : Number(value).toFixed(1)}
          </span>
          <span style={{ fontSize: '0.75rem', color: T.muted }}>{unit}</span>
        </div>

        {/* Range bar */}
        <div style={{
          position: 'relative',
          height: '8px',
          borderRadius: '999px',
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          overflow: 'visible',
        }}>
          {/* Normal-zone highlight */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${normalStart}%`,
            width: `${normalEnd - normalStart}%`,
            background: 'linear-gradient(90deg, rgba(16,185,129,0.35), rgba(16,185,129,0.55), rgba(16,185,129,0.35))',
            borderRadius: '999px',
          }} />

          {/* Value marker */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `${pos}%`,
            transform: 'translate(-50%, -50%)',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 14px ${s.color}, 0 0 0 3px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)'}`,
            transition: 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} />
        </div>

        {/* Range labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.67rem',
          color: T.muted,
          marginTop: '6px',
        }}>
          <span>Normal: {normal_min}–{normal_max} {unit}</span>
          <span style={{ color: s.color, fontWeight: 600 }}>
            {status === 'normal' ? 'in range' :
             status === 'high' ? `+${((value - normal_max) / Math.max(1, normal_max) * 100).toFixed(0)}% above` :
             status === 'low'  ? `−${((normal_min - value) / Math.max(1, normal_min) * 100).toFixed(0)}% below` :
             '⚠ critical'}
          </span>
        </div>
      </div>
    );
  };

  const loadSampleReport = () => {
    setReportText(`LABORATORY REPORT\n\nPatient: John Doe\nDate: December 20, 2025\n\nLIPID PANEL:\n- Total Cholesterol: 245 mg/dL (H)\n- LDL Cholesterol: 165 mg/dL (H)\n- HDL Cholesterol: 35 mg/dL (L)\n- Triglycerides: 225 mg/dL (H)\n\nGLUCOSE METABOLISM:\n- Fasting Glucose: 165 mg/dL (H)\n- HbA1c: 8.2% (H)`);
  };

  if (analyzing) return <LoadingScreen message="NLP REPORT EXTRACTION..." />;

  return (
    <div ref={ref} style={{ fontFamily: I }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Input UI */}
        <div className="ra-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>Upload Lab Report</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Paste or type lab results, blood tests, or medical reports for AI analysis</p>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: T.head, marginBottom: '0.75rem', fontFamily: I }}>Report Text</label>
            <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} placeholder="Paste your lab report here... Include parameter names and values." style={{ width: '100%', height: '240px', padding: '1rem', background: T.txtBg, border: `1px solid ${T.txtBdr}`, borderRadius: '12px', color: T.text, fontSize: '0.85rem', outline: 'none', resize: 'none', transition: 'border 0.3s', fontFamily: 'monospace' }} onFocus={e => e.target.style.borderColor = T.txtFoc} onBlur={e => e.target.style.borderColor = T.txtBdr} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: T.muted }}>{reportText.length} characters</span>
              <button onClick={loadSampleReport} style={{ background: 'none', border: 'none', color: isDark ? '#a855f7' : '#6d28d9', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Load Sample Report</button>
            </div>
          </div>

          <button onClick={handleAnalyze} disabled={!reportText.trim() || analyzing} className="w-full transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mb-4" style={{ padding: '0.9rem', borderRadius: '14px', background: T.btnBg, boxShadow: reportText.trim() ? T.btnSh : 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 700, fontFamily: S, border: 'none', cursor: reportText.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.05em' }}>
            Analyze Report <Play className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Right Side: Render Result */}
        <div className="ra-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>AI Analysis Results</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Natural Language Processing insights</p>

          {!result && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}>
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p style={{ fontSize: '0.9rem' }}>Paste a lab report and click "Analyze" to get AI insights</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: '14px', background: T.resBg, border: `1px solid ${T.resBdr}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '1.1rem' }}>{result.diagnosis}</h4>
                  <span style={{ padding: '3px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, fontFamily: S, background: result.confidence >= 85 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: result.confidence >= 85 ? '#10b981' : '#f59e0b', border: `1px solid ${result.confidence >= 85 ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, whiteSpace: 'nowrap' }}>{result.confidence}% confidence</span>
                </div>
                <MarkdownText style={{ color: T.muted, fontSize: '0.85rem' }}>
                  {result.details}
                </MarkdownText>
              </div>

              {/* Confidence bar (parity with Symptoms tab) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: T.muted }}>Analysis Confidence</span>
                  <span style={{ fontWeight: 700, color: T.text }}>{result.confidence}%</span>
                </div>
                <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.confidence}%`, borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Biomarker health bars */}
              {result.biomarkers && result.biomarkers.length > 0 && (
                <div>
                  <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
                    <AlertTriangle className="w-4 h-4" style={{ color: '#f59e0b' }} /> Biomarker Health Status
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.biomarkers.map((b: any, i: number) => renderBiomarker(b, i))}
                  </div>
                </div>
              )}

              {/* Recommendations (same shape as Symptoms tab) */}
              {result.recommendations && result.recommendations.length > 0 && (
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
              )}

              {/* Disclaimer (parity with Symptoms tab) */}
              <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: T.amberBg, border: `1px solid ${T.amberBdr}` }}>
                <p style={{ fontSize: '0.75rem', color: T.amberTxt }}>⚠️ AI-generated analysis for informational purposes only. Always consult with a qualified healthcare professional.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}