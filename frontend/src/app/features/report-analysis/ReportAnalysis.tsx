import { useState, useRef, useEffect } from 'react';
import { FileText, CircleCheck, AlertTriangle, Play, Upload, X, Image as ImageIcon } from 'lucide-react';
import type { Prediction } from '../../App';
import { useTheme } from '../../App';
import gsap from 'gsap';
import { LoadingScreen } from '../../components/shared/LoadingScreen';
import MedicalAIOutput from '../../components/shared/MedicalAIOutput';

interface ReportAnalysisProps {
  onPrediction: (prediction: Omit<Prediction, 'id' | 'timestamp'>) => void;
}

export function ReportAnalysis({ onPrediction }: ReportAnalysisProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [reportText, setReportText] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState<'paste' | 'upload'>('paste');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reports tab: ACCEPT lab/blood/biomarker reports — REJECT raw radiology scan images.
  // Allow PDFs/text/CSV/MD freely; for images, allow only if filename hints at lab/blood (otherwise route to Scans tab).
  const ACCEPTED = '.pdf,.txt,.csv,.md,image/*';
  const MAX_FILE_MB = 15;

  // Heuristics
  const SCAN_NAME_RE = /\b(x-?ray|xray|ct|mri|ultrasound|sonogram|dicom|scan|radiograph|mammogra|pet|tomograph|fluorosc|skin\s*lesion|dermatosc)\b/i;
  const SCAN_TEXT_RE = /\b(x-?ray|ct\s*scan|mri|ultrasound|sonograph|radiolog|imaging|dicom|tomograph|mammogra|pet\s*scan|fluorosc)\b/i;
  const LAB_TEXT_RE = /\b(cbc|lipid|hba1c|glucose|cholesterol|hemoglobin|wbc|rbc|platelet|biomarker|metabolic|liver\s*function|kidney|electrolyte|tsh|vitamin|albumin|creatinine|urea|ferritin|sodium|potassium|chloride|bilirubin|protein|enzyme|panel|blood)\b/i;

  const pickFile = async (f: File | null) => {
    if (!f) { setSelectedFile(null); return; }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setResult({ diagnosis: 'File Too Large', confidence: 0, details: `Max ${MAX_FILE_MB}MB. Please compress or split the file.`, urgency: 'low', recommendations: [], biomarkers: [] });
      return;
    }

    const name = f.name.toLowerCase();
    const type = f.type.toLowerCase();

    // 1) Block obvious DICOM
    if (name.endsWith('.dcm') || name.endsWith('.dicom') || type === 'application/dicom') {
      setResult({
        diagnosis: 'Wrong Section — Use Scans Tab',
        confidence: 0,
        details: '**This looks like a DICOM scan file.** The Reports tab is for **blood / lab / biomarker** reports only.\n\nPlease upload it under the **Scans** tab instead, which is built to read radiology imaging (X-ray, CT, MRI, ultrasound, etc.).',
        urgency: 'low',
        recommendations: ['Switch to the Scans tab and upload the DICOM there.'],
        biomarkers: [],
      });
      return;
    }

    // 2) Image filename heuristic — strong scan signal in name
    if (type.startsWith('image/') && SCAN_NAME_RE.test(name)) {
      setResult({
        diagnosis: 'Wrong Section — Use Scans Tab',
        confidence: 0,
        details: `**"${f.name}"** looks like a radiology scan image.\n\nThe **Reports** tab only accepts blood / lab / biomarker reports (CBC, lipid panel, HbA1c, etc.). Radiology images go in the **Scans** tab where the vision model is wired in.`,
        urgency: 'low',
        recommendations: ['Switch to the Scans tab and upload this image there.'],
        biomarkers: [],
      });
      return;
    }

    // 3) For text-like files, peek inside
    if (type.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.png') || name.endsWith('.csv')) {
      try {
        const text = await f.text();
        const isScan = SCAN_TEXT_RE.test(text);
        const isLab = LAB_TEXT_RE.test(text);
        if (isScan && !isLab) {
          setResult({
            diagnosis: 'Wrong Section — Use Scans Tab',
            confidence: 0,
            details: 'This document reads like a **radiology report**, not a blood / lab report.\n\nThe Reports tab is restricted to blood and biomarker tests. Please upload it under the **Scans** tab.',
            urgency: 'low',
            recommendations: ['Switch to the Scans tab and upload the report there.'],
            biomarkers: [],
          });
          return;
        }
      } catch { /* fall through */ }
    }

    setSelectedFile(f);
    setResult(null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files?.[0]) pickFile(e.dataTransfer.files[0]);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ra-card', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'expo.out' });
    }, ref);
    return () => ctx.revert();
  }, []);

  const T = isDark ? {
    cardBg: 'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow: '0 8px 32px rgba(0,0,0,0.5)',
    head: '#ffffff', sub: 'rgba(255,255,255,0.50)', text: '#ffffff', muted: 'rgba(255,255,255,0.45)',
    btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 20px rgba(99,102,241,0.45)',
    txtBg: 'rgba(255,255,255,0.03)', txtBdr: 'rgba(255,255,255,0.1)', txtFoc: '#8b5cf6',
    resBg: 'rgba(99,102,241,0.12)', resBdr: 'rgba(99,102,241,0.28)', recBg: 'rgba(255,255,255,0.04)', recBdr: 'rgba(255,255,255,0.08)',
    amberBg: 'rgba(245,158,11,0.12)', amberBdr: 'rgba(245,158,11,0.30)', amberTxt: '#fde68a',
    findBg: 'rgba(255,255,255,0.04)', tipBg: 'rgba(14,165,233,0.1)', tipTxt: '#38bdf8'
  } : {
    cardBg: 'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow: '0 4px 20px rgba(0,0,0,0.07)',
    head: '#0a0a1a', sub: 'rgba(10,10,26,0.50)', text: '#0a0a1a', muted: 'rgba(10,10,26,0.45)',
    btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 16px rgba(99,102,241,0.30)',
    txtBg: 'rgba(0,0,0,0.02)', txtBdr: 'rgba(0,0,0,0.12)', txtFoc: '#6d28d9',
    resBg: 'rgba(99,102,241,0.06)', resBdr: 'rgba(99,102,241,0.18)', recBg: 'rgba(0,0,0,0.025)', recBdr: 'rgba(0,0,0,0.07)',
    amberBg: 'rgba(245,158,11,0.07)', amberBdr: 'rgba(245,158,11,0.22)', amberTxt: '#92400e',
    findBg: 'rgba(0,0,0,0.03)', tipBg: 'rgba(14,165,233,0.08)', tipTxt: '#0284c7'
  };

  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px' };
  const S = "var(--font-display)";
  const I = "var(--font-body)";

  const handleAnalyze = async () => {
    const hasText = reportText.trim().length > 0;
    const hasFile = !!selectedFile;
    if (mode === 'paste' && !hasText) return;
    if (mode === 'upload' && !hasFile) return;
    setAnalyzing(true); setResult(null);

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const token = import.meta.env.VITE_API_TOKEN;

    try {
      let response: Response;
      if (mode === 'upload' && selectedFile) {
        const fd = new FormData();
        fd.append('patient_id', 'demo-user');
        if (customContext.trim()) fd.append('clinical_context', customContext.trim());
        fd.append('file', selectedFile);
        response = await fetch(`${apiBase}/api/v1/diagnostics/lab-report-file`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      } else {
        const contextNote = customContext.trim() ? `\n\n[CLINICAL CONTEXT: ${customContext.trim()}]` : '';
        response = await fetch(`${apiBase}/api/v1/diagnostics/lab-report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ patient_id: 'demo-user', report_text: reportText + contextNote }),
        });
      }

      if (!response.ok) {
        let detail = 'API Gateway Offline';
        try { const j = await response.json(); detail = j.detail || j.error || detail; } catch { /* ignore */ }
        throw new Error(detail);
      }
      const data = await response.json();
      console.log('[Reports] backend response:', data);

      let a = (data.analysis || {}) as any;
      // Same fallback as SymptomChecker: backend may return JSON string in data.result
      if (!a.assessment && data.result) {
        try {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          if (parsed && typeof parsed === 'object') a = parsed;
        } catch { /* plain text result — leave a as-is */ }
      }

      if (a.error) {
        setResult({
          diagnosis: 'Could Not Read Report',
          confidence: 0,
          details: typeof a.error === 'string' ? a.error : JSON.stringify(a.error),
          urgency: 'low',
          recommendations: ['Try re-uploading as a clear image (JPG/PNG) or paste the text directly.'],
          biomarkers: [],
        });
        return;
      }

      // Auto-routed: AI detected this is actually a radiology scan, not a lab report.
      const wasRedirected = a.redirected_to === 'radiology';
      const diagnosis = wasRedirected
        ? `AI Auto-Detected: ${(a.detected_kind || 'scan').toUpperCase()} (radiology read)`
        : 'CLINICAL LAB ANALYSIS';

      const urgencyRaw = String(a.urgency || 'medium').trim().toLowerCase();
      const urgency = (['low', 'medium', 'high', 'emergency'] as const).includes(urgencyRaw as any)
        ? (urgencyRaw as 'low' | 'medium' | 'high' | 'emergency')
        : 'medium';

      const mappedResult = {
        diagnosis,
        confidence: typeof a.confidence === 'number' ? a.confidence : 80,
        details: a.assessment || 'No assessment returned.',
        urgency,
        recommendations: Array.isArray(a.recommendations) && a.recommendations.length
          ? a.recommendations
          : ['Review extracted values with a physician.'],
        biomarkers: Array.isArray(a.biomarkers) ? a.biomarkers : [],
        detected_kind: a.detected_kind,
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
    normal: { color: '#10b981', label: 'NORMAL' },
    low: { color: '#f59e0b', label: 'LOW' },
    high: { color: '#f59e0b', label: 'HIGH' },
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
                status === 'low' ? `−${((normal_min - value) / Math.max(1, normal_min) * 100).toFixed(0)}% below` :
                  '⚠ critical'}
          </span>
        </div>
      </div>
    );
  };

  const loadSampleReport = () => {
    setReportText(`LABORATORY REPORT\n\nPatient: John Doe\nDate: December 20, 2025\n\nLIPID PANEL:\n- Total Cholesterol: 245 mg/dL (H)\n- LDL Cholesterol: 165 mg/dL (H)\n- HDL Cholesterol: 35 mg/dL (L)\n- Triglycerides: 225 mg/dL (H)\n\nGLUCOSE METABOLISM:\n- Fasting Glucose: 165 mg/dL (H)\n- HbA1c: 8.2% (H)`);
  };

  if (analyzing) return <LoadingScreen message="REPORT UNDER REVIEW..." />;

  return (
    <div ref={ref} style={{ fontFamily: I }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Side: Input UI */}
        <div className="ra-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>Upload Lab Report</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#10b981', fontWeight: 700 }}>Blood / lab / biomarker</span> reports only — CBC, lipid panel, HbA1c, etc.
          </p>
          <p style={{ color: T.muted, fontSize: '0.72rem', marginBottom: '1.25rem' }}>Radiology scans (X-ray, CT, MRI, ultrasound, DICOM) belong in the <strong>Scans</strong> tab.</p>

          {/* Mode toggle: Paste Text vs Upload File */}
          <div style={{ display: 'inline-flex', padding: '4px', borderRadius: '12px', background: T.txtBg, border: `1px solid ${T.txtBdr}`, marginBottom: '1.25rem' }}>
            {(['paste', 'upload'] as const).map(m => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => { setMode(m); setResult(null); }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: S,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    background: active ? T.btnBg : 'transparent',
                    color: active ? '#fff' : T.muted,
                    boxShadow: active ? T.btnSh : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.25s',
                  }}
                >
                  {m === 'paste' ? <FileText className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                  {m === 'paste' ? 'PASTE TEXT' : 'UPLOAD FILE'}
                </button>
              );
            })}
          </div>

          {mode === 'paste' ? (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: T.head, marginBottom: '0.75rem', fontFamily: I }}>Report Text</label>
              <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} placeholder="Paste your lab report here... Include parameter names and values." style={{ width: '100%', height: '240px', padding: '1rem', background: T.txtBg, border: `1px solid ${T.txtBdr}`, borderRadius: '12px', color: T.text, fontSize: '0.85rem', outline: 'none', resize: 'none', transition: 'border 0.3s', fontFamily: 'monospace' }} onFocus={e => e.target.style.borderColor = T.txtFoc} onBlur={e => e.target.style.borderColor = T.txtBdr} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: T.muted }}>{reportText.length} characters</span>
                <button onClick={loadSampleReport} style={{ background: 'none', border: 'none', color: isDark ? '#a855f7' : '#6d28d9', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Load Sample Report</button>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: T.head, marginBottom: '0.75rem', fontFamily: I }}>Lab Report File</label>
              <input ref={fileInputRef} type="file" accept={ACCEPTED} onChange={(e) => pickFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  style={{
                    height: '240px',
                    borderRadius: '12px',
                    border: `2px dashed ${dragOver ? T.txtFoc : T.txtBdr}`,
                    background: dragOver ? `${T.txtFoc}11` : T.txtBg,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Upload className="w-10 h-10" style={{ color: T.muted, opacity: 0.6 }} />
                  <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: T.text, marginBottom: '4px' }}>Drop blood/lab report here or click to browse</p>
                    <p style={{ fontSize: '0.72rem', color: T.muted }}>PDF, TXT, CSV (or photo of a printed lab report) · up to {MAX_FILE_MB}MB</p>
                    <p style={{ fontSize: '0.65rem', color: T.muted, marginTop: '6px', opacity: 0.7 }}>X-rays / CT / MRI / DICOM are auto-rejected here</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedFile.type.startsWith('image/') ? (
                    <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${T.txtBdr}`, background: T.txtBg, maxHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={URL.createObjectURL(selectedFile)} alt="preview" style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', borderRadius: '12px', background: T.txtBg, border: `1px solid ${T.txtBdr}` }}>
                      {selectedFile.type === 'application/pdf'
                        ? <FileText className="w-12 h-12" style={{ color: '#ef4444' }} />
                        : <FileText className="w-12 h-12" style={{ color: T.txtFoc }} />}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '0.65rem 0.85rem', borderRadius: '10px', background: T.recBg, border: `1px solid ${T.recBdr}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" style={{ color: T.txtFoc, flexShrink: 0 }} /> : <FileText className="w-4 h-4" style={{ color: T.txtFoc, flexShrink: 0 }} />}
                      <span style={{ fontSize: '0.8rem', color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</span>
                      <span style={{ fontSize: '0.7rem', color: T.muted, flexShrink: 0 }}>· {(selectedFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: '2px', display: 'flex', alignItems: 'center' }} title="Remove file">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Custom clinical context */}
          <div style={{ marginBottom: '1.25rem', padding: '0.9rem 1rem', borderRadius: '14px', background: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)', border: `1px dashed ${isDark ? 'rgba(99,102,241,0.30)' : 'rgba(99,102,241,0.25)'}` }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', fontFamily: S, color: isDark ? '#a78bfa' : '#6d28d9', marginBottom: '0.4rem' }}>
              ADDITIONAL CONTEXT (OPTIONAL)
            </label>
            <p style={{ fontSize: '0.7rem', color: T.muted, marginBottom: '0.5rem' }}>Describe your condition, what to focus on, or ask a specific question about the report</p>
            <textarea
              value={customContext}
              onChange={e => setCustomContext(e.target.value)}
              placeholder="e.g. 'Patient is diabetic, 52 years old. Please focus on kidney function and flag any early CKD markers.'"
              rows={3}
              style={{ width: '100%', padding: '0.6rem 0.8rem', background: T.txtBg, border: `1px solid ${T.txtBdr}`, borderRadius: '10px', color: T.text, fontSize: '0.8rem', fontFamily: I, outline: 'none', resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = T.txtFoc)}
              onBlur={e => (e.target.style.borderColor = T.txtBdr)}
            />
          </div>

          {(() => {
            const ready = mode === 'paste' ? !!reportText.trim() : !!selectedFile;
            return (
              <button onClick={handleAnalyze} disabled={!ready || analyzing} className="w-full transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mb-4" style={{ padding: '0.9rem', borderRadius: '14px', background: T.btnBg, boxShadow: ready ? T.btnSh : 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 700, fontFamily: S, border: 'none', cursor: ready ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.05em' }}>
                Analyze Report <Play className="w-4 h-4 ml-1" />
              </button>
            );
          })()}
        </div>

        {/* Right Side: Render Result */}
        <div
          className="ra-card ra-results-scroll"
          data-lenis-prevent
          style={{ ...glass, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain' }}
        >
          <style>{`
            .ra-results-scroll::-webkit-scrollbar { width: 5px; }
            .ra-results-scroll::-webkit-scrollbar-track { background: transparent; }
            .ra-results-scroll::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(139,92,246,0.35)' : 'rgba(109,40,217,0.25)'}; border-radius: 999px; }
            .ra-results-scroll::-webkit-scrollbar-thumb:hover { background: ${isDark ? 'rgba(139,92,246,0.6)' : 'rgba(109,40,217,0.45)'}; }
          `}</style>
          <div style={{ flexShrink: 0 }}>
            <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>AI Analysis Results</h3>
            <p style={{ color: T.sub, fontSize: '0.82rem' }}>Natural Language Processing insights</p>
          </div>

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
                <MedicalAIOutput text={result.details} isDark={isDark} textColor={T.text} mutedColor={T.muted} />
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

              {/* Loud disclaimer */}
              <div
                role="alert"
                style={{
                  padding: '1rem 1.1rem',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.10)',
                  border: '1.5px solid rgba(239, 68, 68, 0.5)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#ef4444', marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fca5a5', marginBottom: 4, letterSpacing: '0.02em' }}>
                    AI BASED DIAGNOSIS
                  </p>
                  <p style={{ fontSize: '0.78rem', color: T.amberTxt, lineHeight: 1.55 }}>
                    This is an experimental AI demo. Output may be wrong. Do not use it to make health decisions.
                    Always consult a qualified healthcare professional for actual lab interpretation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}