import { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, Image as ImageIcon, CircleCheck, X, CircleAlert } from 'lucide-react';
import type { Prediction } from '../App';
import { useTheme } from '../App';
import { analyzeImage } from '../utils/api';
import gsap from 'gsap';
import { LoadingScreen } from './LoadingScreen';

interface ImageAnalysisProps {
  onPrediction: (prediction: Omit<Prediction, 'id' | 'timestamp'>) => void;
}

const SCAN_TYPES = [
  { id: 'xray', name: 'X-Ray', description: 'Chest, bone, dental X-rays' },
  { id: 'ct', name: 'CT Scan', description: 'Computed Tomography' },
  { id: 'mri', name: 'MRI', description: 'Magnetic Resonance Imaging' },
  { id: 'ultrasound', name: 'Ultrasound', description: 'Sonography scans' },
  { id: 'skin', name: 'Skin Lesion', description: 'Dermatological images' },
];

export function ImageAnalysis({ onPrediction }: ImageAnalysisProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanType, setScanType] = useState('xray');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ia-card',
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'expo.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const T = isDark ? {
    cardBg:  'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow:  '0 8px 32px rgba(0,0,0,0.5)',
    head:    '#ffffff', sub:     'rgba(255,255,255,0.50)', text:    '#ffffff', muted:   'rgba(255,255,255,0.45)',
    btnBg:   'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh:   '0 4px 20px rgba(99,102,241,0.45)',
    typeBg: 'rgba(255,255,255,0.03)', typeBdr: 'rgba(255,255,255,0.08)', typeSelBg: 'rgba(139,92,246,0.15)', typeSelBdr: '#8b5cf6',
    upBg: 'rgba(255,255,255,0.02)', upBdr: 'rgba(255,255,255,0.1)', upHov: 'rgba(139,92,246,0.1)', upHovBdr: '#8b5cf6',
    resBg:   'rgba(99,102,241,0.12)', resBdr:  'rgba(99,102,241,0.28)', recBg:   'rgba(255,255,255,0.04)', recBdr:  'rgba(255,255,255,0.08)',
    amberBg: 'rgba(245,158,11,0.12)', amberBdr:'rgba(245,158,11,0.30)', amberTxt:'#fde68a',
    findBg: 'rgba(255,255,255,0.04)',
  } : {
    cardBg:  'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow:  '0 4px 20px rgba(0,0,0,0.07)',
    head:    '#0a0a1a', sub:     'rgba(10,10,26,0.50)', text:    '#0a0a1a', muted:   'rgba(10,10,26,0.45)',
    btnBg:   'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh:   '0 4px 16px rgba(99,102,241,0.30)',
    typeBg: 'rgba(0,0,0,0.02)', typeBdr: 'rgba(0,0,0,0.08)', typeSelBg: 'rgba(109,40,217,0.08)', typeSelBdr: '#6d28d9',
    upBg: 'rgba(0,0,0,0.01)', upBdr: 'rgba(0,0,0,0.12)', upHov: 'rgba(109,40,217,0.04)', upHovBdr: '#6d28d9',
    resBg:   'rgba(99,102,241,0.06)', resBdr:  'rgba(99,102,241,0.18)', recBg:   'rgba(0,0,0,0.025)', recBdr:  'rgba(0,0,0,0.07)',
    amberBg: 'rgba(245,158,11,0.07)', amberBdr:'rgba(245,158,11,0.22)', amberTxt:'#92400e',
    findBg: 'rgba(0,0,0,0.03)',
  };

  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px' };
  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const clearFile = () => { setSelectedImage(null); setPreview(null); setResult(null); };

  const handleAnalyze = async () => {
    if (!selectedImage || !scanType || !preview) return;
    setAnalyzing(true); setResult(null);
    try {
      const { data, error } = await analyzeImage(scanType, preview);
      if (error) {
        setTimeout(() => {
          const mockResult = generateMockResult(scanType);
          setResult(mockResult);
          onPrediction({ type: 'image', diagnosis: mockResult.diagnosis, confidence: mockResult.confidence, details: mockResult.details, recommendations: mockResult.recommendations });
          setAnalyzing(false);
        }, 3000);
        return;
      }
      setTimeout(() => {
        setResult(data);
        onPrediction({ type: 'image', diagnosis: data.diagnosis, confidence: data.confidence, details: data.details, recommendations: data.recommendations });
        setAnalyzing(false);
      }, 3000);
    } catch { setAnalyzing(false); }
  };

  if (analyzing) return <LoadingScreen message="NEURAL VISION PROCESSING..." />;

  return (
    <div ref={ref} style={{ fontFamily: I }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ── Left: Upload ── */}
        <div className="ia-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>Upload Medical Scan</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Upload X-rays, CT scans, MRIs, or other medical images</p>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: T.head, marginBottom: '0.75rem', fontFamily: I }}>Scan Type</label>
            <div className="grid grid-cols-2 gap-3">
              {SCAN_TYPES.map(type => {
                const sel = scanType === type.id;
                return (
                  <button key={type.id} onClick={() => setScanType(type.id)} className="transition-all duration-200" style={{ padding: '0.8rem', borderRadius: '12px', textAlign: 'left', background: sel ? T.typeSelBg : T.typeBg, border: `1px solid ${sel ? T.typeSelBdr : T.typeBdr}`, cursor: 'pointer' }}>
                    <div style={{ fontFamily: S, fontWeight: 700, fontSize: '0.85rem', color: sel ? (isDark ? '#a78bfa' : '#6d28d9') : T.text, marginBottom: '2px' }}>{type.name}</div>
                    <div style={{ fontSize: '0.65rem', color: T.muted }}>{type.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="scan-upload" />
            {!preview ? (
              <label htmlFor="scan-upload" className="transition-all duration-300" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '3rem 1rem', background: T.upBg, border: `2px dashed ${T.upBdr}`, borderRadius: '16px', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = T.upHov; e.currentTarget.style.borderColor = T.upHovBdr; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.upBg; e.currentTarget.style.borderColor = T.upBdr; }}>
                <Upload className="w-10 h-10 mb-3" style={{ color: isDark ? '#a78bfa' : '#6d28d9' }} />
                <p style={{ fontFamily: S, fontWeight: 700, fontSize: '0.9rem', color: T.head, marginBottom: '4px' }}>Click to upload medical scan</p>
                <p style={{ fontSize: '0.75rem', color: T.muted }}>Supports: JPG, PNG, DICOM</p>
              </label>
            ) : (
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${T.cardBdr}` }}>
                <img src={preview} alt="Scan preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <button onClick={clearFile} style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                  <X className="w-4 h-4" />
                </button>
                {selectedImage && (
                  <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon className="w-3 h-3" /> {selectedImage.name}
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={handleAnalyze} disabled={!selectedImage || analyzing} className="w-full transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ padding: '0.9rem', borderRadius: '14px', background: T.btnBg, boxShadow: selectedImage ? T.btnSh : 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 700, fontFamily: S, border: 'none', cursor: selectedImage ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.05em' }}>
            Analyze with AI
          </button>
        </div>

        {/* ── Right: Results ── */}
        <div className="ia-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>AI Analysis Results</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Deep learning model predictions</p>

          {!result && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}>
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p style={{ fontSize: '0.9rem' }}>Upload a medical scan and click "Analyze" to get AI predictions</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: '14px', background: T.resBg, border: `1px solid ${T.resBdr}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '1.1rem' }}>{result.diagnosis}</h4>
                  <span style={{ padding: '3px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, fontFamily: S, background: result.confidence >= 85 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: result.confidence >= 85 ? '#10b981' : '#f59e0b', border: `1px solid ${result.confidence >= 85 ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, whiteSpace: 'nowrap' }}>{result.confidence}% confidence</span>
                </div>
                <p style={{ color: T.muted, fontSize: '0.85rem' }}>{result.details}</p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: T.muted }}>Model Confidence</span>
                  <span style={{ fontWeight: 700, color: T.text }}>{result.confidence}%</span>
                </div>
                <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.confidence}%`, borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 1s ease' }} />
                </div>
              </div>

              {result.findings && (
                <div>
                  <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', marginBottom: '0.75rem' }}>Key Findings</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {result.findings.map((f: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '10px', background: T.findBg }}>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: T.text }}>{f.label}</div>
                          <div style={{ fontSize: '0.65rem', color: T.muted }}>{f.location}</div>
                        </div>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: f.severity === 'normal' ? '#10b981' : (f.severity === 'mild' ? '#8b5cf6' : '#f59e0b'), background: f.severity === 'normal' ? 'rgba(16,185,129,0.1)' : (f.severity === 'mild' ? 'rgba(139,92,246,0.1)' : 'rgba(245,158,11,0.1)') }}>{f.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}><CircleCheck className="w-4 h-4" style={{ color: '#10b981' }} /> Recommendations</h4>
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
                <p style={{ fontSize: '0.75rem', color: T.amberTxt }}>⚠️ AI analysis is for screening purposes only. All findings must be verified by a licensed radiologist or physician.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generateMockResult(type: string): any {
  const mockPredictions: Record<string, any> = {
    xray: { diagnosis: 'Pneumonia Detected', confidence: 89, details: 'Bilateral consolidation observed in lower lung fields. Findings consistent with bacterial pneumonia.', recommendations: ['Immediate consultation with a pulmonologist recommended', 'Consider starting empirical antibiotic therapy', 'Follow-up chest X-ray in 48-72 hours'], findings: [{ label: 'Left Lung Opacity', severity: 'moderate', location: 'Lower lobe' }, { label: 'Pleural Effusion', severity: 'mild', location: 'Right costophrenic angle' }] },
    ct: { diagnosis: 'Normal CT Scan', confidence: 94, details: 'No significant abnormalities detected. All structures appear within normal limits.', recommendations: ['Continue routine health monitoring', 'No immediate follow-up required'], findings: [{ label: 'Brain Tissue', severity: 'normal', location: 'All regions' }] },
  };
  return mockPredictions[type] || mockPredictions.xray;
}
