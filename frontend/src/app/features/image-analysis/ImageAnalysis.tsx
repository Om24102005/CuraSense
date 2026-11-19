import { analyzeImage } from '../../services/api';
import { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, FileText, AlertTriangle, Plus, Layers as LayersIcon, ChevronDown } from 'lucide-react';
import type { Prediction } from '../../App';
import { useTheme } from '../../App';
import gsap from 'gsap';
import { LoadingScreen } from '../../components/shared/LoadingScreen';
import MedicalAIOutput from '../../components/shared/MedicalAIOutput';
import { EmergencyPrompt } from '../../components/shared/EmergencyPrompt';
import { isEmergency } from '@curasense/shared/emergency';
import { WrongPageNotice, type Redirect } from '../../components/shared/WrongPageNotice';
import { SCAN_TYPES, SCAN_GROUPS, modalityOf, regionsOf, studyLabel, extractUrgency, URGENCY_MAP, MAX_FILES, MAX_FILE_MB, MAX_ZIP_MB } from '@curasense/shared/scans';

interface ImageAnalysisProps {
  onPrediction: (prediction: Omit<Prediction, 'id' | 'timestamp'>) => void;
  onSwitchTab?: (tab: string) => void;
}


const ACCEPTED_SCAN_INPUTS =
  'image/jpeg,image/png,image/webp,image/tiff,image/bmp,application/dicom,.dcm,.dicom,application/zip,application/x-zip-compressed,.zip,application/pdf,.txt,.md';

const SCAN_KEYWORDS = /\b(x-?ray|ct\s*scan|mri|ultrasound|sonograph|radiolog|imaging|dicom|tomograph|mammogra|pet\s*scan|fluorosc|skin\s*lesion|dermatosc)\b/i;
const LAB_KEYWORDS = /\b(cbc|lipid\s*panel|hba1c|glucose|cholesterol|hemoglobin|wbc|rbc|platelet|biomarker|metabolic\s*panel|liver\s*function|kidney\s*function|electrolyte|tsh|vitamin\s*d|crp)\b/i;

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  kind: 'image' | 'pdf' | 'text' | 'other';
}

interface ScanSection {
  num: number;
  filename: string;
  content: string;
  detectedKind?: string;
  detectedConfidence?: number;
  refusal?: { message: string; redirect?: Redirect };
}

export function ImageAnalysis({ onPrediction, onSwitchTab }: ImageAnalysisProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [scanType, setScanType] = useState('xray-chest');
  const [customContext, setCustomContext] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ia-card', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'expo.out' });
    }, ref);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return () => { files.forEach((f: UploadedFile) => { try { URL.revokeObjectURL(f.preview); } catch { } }); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const T = isDark ? {
    cardBg: 'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow: '0 8px 32px rgba(0,0,0,0.5)',
    head: '#ffffff', sub: 'rgba(255,255,255,0.50)', text: '#ffffff', muted: 'rgba(255,255,255,0.45)',
    btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 20px rgba(99,102,241,0.45)',
    typeBg: 'rgba(255,255,255,0.03)', typeBdr: 'rgba(255,255,255,0.08)', typeSelBg: 'rgba(139,92,246,0.15)', typeSelBdr: '#8b5cf6',
    upBg: 'rgba(255,255,255,0.02)', upBdr: 'rgba(255,255,255,0.1)', upHov: 'rgba(139,92,246,0.1)', upHovBdr: '#8b5cf6',
    resBg: 'rgba(99,102,241,0.12)', resBdr: 'rgba(99,102,241,0.28)', recBg: 'rgba(255,255,255,0.04)', recBdr: 'rgba(255,255,255,0.08)',
    amberBg: 'rgba(245,158,11,0.12)', amberBdr: 'rgba(245,158,11,0.30)', amberTxt: '#fde68a', findBg: 'rgba(255,255,255,0.04)',
    dropBg: 'rgba(10,10,22,0.98)', dropHov: 'rgba(139,92,246,0.12)', dropGroupBg: 'rgba(139,92,246,0.06)',
    dropGroupTxt: 'rgba(167,139,250,0.9)', dropBorder: 'rgba(139,92,246,0.55)',
    scanCardBg: 'rgba(255,255,255,0.025)', scanCardHdr: 'rgba(99,102,241,0.10)', accentPurple: '#a78bfa',
  } : {
    cardBg: 'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow: '0 4px 20px rgba(0,0,0,0.07)',
    head: '#0a0a1a', sub: 'rgba(10,10,26,0.50)', text: '#0a0a1a', muted: 'rgba(10,10,26,0.45)',
    btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 16px rgba(99,102,241,0.30)',
    typeBg: 'rgba(0,0,0,0.02)', typeBdr: 'rgba(0,0,0,0.08)', typeSelBg: 'rgba(109,40,217,0.08)', typeSelBdr: '#6d28d9',
    upBg: 'rgba(0,0,0,0.01)', upBdr: 'rgba(0,0,0,0.12)', upHov: 'rgba(109,40,217,0.04)', upHovBdr: '#6d28d9',
    resBg: 'rgba(99,102,241,0.06)', resBdr: 'rgba(99,102,241,0.18)', recBg: 'rgba(0,0,0,0.025)', recBdr: 'rgba(0,0,0,0.07)',
    amberBg: 'rgba(245,158,11,0.07)', amberBdr: 'rgba(245,158,11,0.22)', amberTxt: '#92400e', findBg: 'rgba(0,0,0,0.03)',
    dropBg: 'rgba(255,255,255,0.99)', dropHov: 'rgba(109,40,217,0.07)', dropGroupBg: 'rgba(109,40,217,0.04)',
    dropGroupTxt: '#6d28d9', dropBorder: 'rgba(109,40,217,0.50)',
    scanCardBg: 'rgba(0,0,0,0.015)', scanCardHdr: 'rgba(99,102,241,0.06)', accentPurple: '#6d28d9',
  };

  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px' };
  const S = "var(--font-display)";
  const I = "var(--font-body)";

  const validateScanFile = async (file: File): Promise<{ ok: boolean; reason?: string; kind: UploadedFile['kind'] }> => {
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    const isZip = name.endsWith('.zip') || type === 'application/zip' || type === 'application/x-zip-compressed';
    const maxMb = isZip ? MAX_ZIP_MB : MAX_FILE_MB;
    if (file.size > maxMb * 1024 * 1024) return { ok: false, reason: `Too large (max ${maxMb}MB${isZip ? '' : `; zip several files together, up to ${MAX_ZIP_MB}MB`})`, kind: 'other' };
    if (isZip) return { ok: true, kind: 'other' };
    if (type.startsWith('image/')) return { ok: true, kind: 'image' };
    if (name.endsWith('.dcm') || name.endsWith('.dicom') || type === 'application/dicom') return { ok: true, kind: 'other' };
    if (type.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.md')) {
      try {
        const text = await file.text();
        if (LAB_KEYWORDS.test(text) && !SCAN_KEYWORDS.test(text)) return { ok: false, reason: 'Looks like a blood/lab report — use the Reports tab instead.', kind: 'text' };
        return { ok: true, kind: 'text' };
      } catch { return { ok: true, kind: 'text' }; }
    }
    if (type === 'application/pdf' || name.endsWith('.pdf')) return { ok: true, kind: 'pdf' };
    return { ok: false, reason: 'Unsupported file type for scan analysis.', kind: 'other' };
  };

  const ingestFiles = async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const slotsLeft = MAX_FILES - files.length;
    if (slotsLeft <= 0) { setValidationWarnings([`Maximum ${MAX_FILES} files allowed.`]); return; }
    const warnings: string[] = [];
    const accepted: UploadedFile[] = [];
    for (const file of arr.slice(0, slotsLeft)) {
      const v = await validateScanFile(file);
      if (!v.ok) { warnings.push(`✗ ${file.name}: ${v.reason}`); continue; }
      accepted.push({ id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`, file, preview: URL.createObjectURL(file), kind: v.kind });
    }
    if (arr.length > slotsLeft) warnings.push(`Only ${slotsLeft} of ${arr.length} files added — limit is ${MAX_FILES}.`);
    setValidationWarnings(warnings);
    if (accepted.length) { setFiles((prev: UploadedFile[]) => [...prev, ...accepted]); setResult(null); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) ingestFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files?.length) ingestFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev: UploadedFile[]) => {
      const target = prev.find((f: UploadedFile) => f.id === id);
      if (target) { try { URL.revokeObjectURL(target.preview); } catch { } }
      return prev.filter((f: UploadedFile) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f: UploadedFile) => { try { URL.revokeObjectURL(f.preview); } catch { } });
    setFiles([]); setResult(null); setValidationWarnings([]);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setAnalyzing(true); setResult(null);
    try {
      const requests = files.map(async (uf: UploadedFile) => {
        const res = await analyzeImage(uf.file, modalityOf(scanType), studyLabel(scanType), customContext.trim(), regionsOf(scanType));
        if (res.error || !res.data) throw new Error(res.error || `Gateway error on ${uf.file.name}`);
        return { name: uf.file.name, data: res.data };
      });

      const settled = await Promise.allSettled(requests);
      const ok = settled.filter((s: PromiseSettledResult<any>) => s.status === 'fulfilled') as PromiseFulfilledResult<{ name: string; data: any }>[];
      const failed = settled.filter((s: PromiseSettledResult<any>) => s.status === 'rejected') as PromiseRejectedResult[];

      if (ok.length === 0) throw new Error('All scans failed to analyze.');

      // Build per-scan structured sections
      const scanSections: ScanSection[] = ok.map(({ value }, i) => {
        const va = value.data?.vision_analysis || {};
        return {
          num: i + 1,
          filename: value.name,
          content: va.analysis || va.error || 'No analysis returned.',
          detectedKind: va.detected_kind,
          detectedConfidence: va.detected_confidence,
          // The AI service refuses files that are not the selected kind of scan (see WrongPageNotice).
          refusal: va.error ? { message: va.error, redirect: va.redirect } : undefined,
        };
      });
      const analysed = scanSections.filter(s => !s.refusal);

      const combined = scanSections.map(s => `### ${s.num}. ${s.filename}\n\n${s.content}`).join('\n\n---\n\n');
      const failureNote = failed.length ? `\n\n> ⚠ ${failed.length} file${failed.length > 1 ? 's' : ''} failed to analyze.` : '';

      // Confidence is how sure the AI was about what kind of scan this is. It is reported by the model, not made up.
      const confidence = analysed.length
        ? Math.round(analysed.reduce((sum, s) => sum + (s.detectedConfidence ?? 0), 0) / analysed.length)
        : null;

      const mappedResult = {
        diagnosis: analysed.length === 0
          ? 'Not Analysed'
          : files.length > 1
            ? `Multi-Scan Radiology Assessment (${analysed.length}/${files.length})`
            : 'AI Radiology Assessment',
        confidence,
        details: combined + failureNote,
        scanSections,
        recommendations: analysed.length === 0 ? [] : [
          'Review findings with a licensed radiologist.',
          'Cross-reference with patient medical history and clinical presentation.',
          files.length > 1 ? 'Compare findings across all submitted scans for temporal trends.' : 'Follow up as indicated by urgency level.',
        ],
        findings: [],
      };

      setResult(mappedResult);
      if (analysed.length) onPrediction({ type: 'image', ...mappedResult, confidence: confidence ?? 0, scanSections: mappedResult.scanSections as any });
    } catch (error) {
      console.error(error);
      setResult({
        diagnosis: 'Processing Error', confidence: null,
        details: 'Image Core Offline. Check that the API server and AI service are running, then try again.',
        scanSections: [], recommendations: [], findings: [],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (analyzing) return <LoadingScreen message="SCAN IS IN PROGRESS..." variant="scans" subject={{ images: files.filter((f) => /^image\/(jpeg|png|webp|gif|bmp|avif)$/.test(f.file.type)).map((f) => f.preview) }} />;

  const selectedScan = SCAN_TYPES.find(t => t.id === scanType);

  return (
    <div ref={ref} style={{ fontFamily: I }}>
      {/* Scrollbar styling */}
      <style>{`
        .ia-results-scroll::-webkit-scrollbar { width: 5px; }
        .ia-results-scroll::-webkit-scrollbar-track { background: transparent; }
        .ia-results-scroll::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(139,92,246,0.35)' : 'rgba(109,40,217,0.25)'}; border-radius: 999px; }
        .ia-results-scroll::-webkit-scrollbar-thumb:hover { background: ${isDark ? 'rgba(139,92,246,0.6)' : 'rgba(109,40,217,0.45)'}; }
        .ia-scan-item:hover { background: ${T.dropHov} !important; }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── LEFT: Upload panel ── */}
        <div className="ia-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>Upload Medical Scan</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Upload X-rays, CT scans, MRIs or other medical images: JPG, PNG, DICOM, ZIP (a whole study) or PDF</p>

          {/* ── Custom themed dropdown ── */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: T.head, marginBottom: '0.5rem', fontFamily: I }}>Scan Type</label>
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              {/* Trigger */}
              <button
                onClick={() => setDropdownOpen((v: boolean) => !v)}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  background: dropdownOpen ? (isDark ? 'rgba(139,92,246,0.12)' : 'rgba(109,40,217,0.07)') : T.typeBg,
                  border: `1.5px solid ${dropdownOpen ? T.dropBorder : T.typeBdr}`,
                  borderRadius: dropdownOpen ? '12px 12px 0 0' : '12px',
                  color: T.text,
                  fontFamily: I,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left',
                  transition: 'border-color 0.2s, background 0.2s',
                  outline: 'none',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedScan?.name ?? 'Select scan type'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: T.muted, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedScan?.description}
                  </div>
                </div>
                <ChevronDown
                  style={{
                    width: 16, height: 16, flexShrink: 0,
                    color: T.accentPurple,
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.22s ease',
                  }}
                />
              </button>

              {/* Dropdown list */}
              {dropdownOpen && (
                <div
                  data-lenis-prevent
                  style={{
                    position: 'absolute',
                    top: '100%', left: 0, right: 0,
                    zIndex: 200,
                    maxHeight: '320px',
                    overflowY: 'auto',
                    overscrollBehavior: 'contain',
                    background: T.dropBg,
                    border: `1.5px solid ${T.dropBorder}`,
                    borderTop: 'none',
                    borderRadius: '0 0 14px 14px',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 8px 28px rgba(0,0,0,0.14)',
                  }}
                >
                  {SCAN_GROUPS.map((group) => {
                    const items = SCAN_TYPES.filter(group.filter);
                    return (
                      <div key={group.label}>
                        <div style={{
                          padding: '5px 12px',
                          fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.18em', fontFamily: S,
                          color: T.dropGroupTxt,
                          background: T.dropGroupBg,
                          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                          userSelect: 'none',
                        }}>
                          {group.label.toUpperCase()}
                        </div>
                        {items.map(t => {
                          const selected = t.id === scanType;
                          return (
                            <div
                              key={t.id}
                              className="ia-scan-item"
                              onClick={() => { setScanType(t.id); setDropdownOpen(false); }}
                              style={{
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', gap: '1px',
                                background: selected ? (isDark ? 'rgba(139,92,246,0.18)' : 'rgba(109,40,217,0.1)') : 'transparent',
                                borderLeft: `3px solid ${selected ? T.accentPurple : 'transparent'}`,
                                transition: 'background 0.12s',
                              }}
                            >
                              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: selected ? T.accentPurple : T.text }}>
                                {t.name}
                              </span>
                              <span style={{ fontSize: '0.69rem', color: T.muted }}>
                                {t.description}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Custom clinical context */}
          <div style={{ marginBottom: '1.25rem', padding: '0.9rem 1rem', borderRadius: '14px', background: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)', border: `1px dashed ${isDark ? 'rgba(99,102,241,0.30)' : 'rgba(99,102,241,0.25)'}` }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', fontFamily: S, color: isDark ? '#a78bfa' : '#6d28d9', marginBottom: '0.4rem' }}>
              ADDITIONAL CLINICAL CONTEXT (OPTIONAL)
            </label>
            <p style={{ fontSize: '0.7rem', color: T.muted, marginBottom: '0.5rem' }}>Describe what you're looking for, patient history, or specific region of concern</p>
            <textarea
              value={customContext}
              onChange={e => setCustomContext(e.target.value)}
              placeholder="e.g. 'Patient has 3-week history of productive cough. Looking for infiltrates or consolidation in lower lobes.'"
              rows={3}
              style={{ width: '100%', padding: '0.6rem 0.8rem', background: T.upBg, border: `1px solid ${T.upBdr}`, borderRadius: '10px', color: T.text, fontSize: '0.8rem', fontFamily: I, outline: 'none', resize: 'vertical' }}
            />
          </div>

          {/* File upload area */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: T.head, fontFamily: I }}>
                Scan Files <span style={{ color: T.muted, fontWeight: 500 }}>· {files.length}/{MAX_FILES}</span>
              </label>
              {files.length > 0 && (
                <button onClick={clearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: '0.75rem', fontFamily: I, fontWeight: 600 }}>
                  Clear all
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept={ACCEPTED_SCAN_INPUTS} multiple onChange={handleFileSelect} className="hidden" id="scan-upload" />

            <label
              htmlFor="scan-upload"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="transition-all duration-300"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: '100%', padding: files.length === 0 ? '3rem 1rem' : '1.25rem',
                background: dragOver ? T.upHov : T.upBg,
                border: `2px dashed ${dragOver ? T.upHovBdr : T.upBdr}`,
                borderRadius: '16px', cursor: 'pointer',
                opacity: files.length >= MAX_FILES ? 0.5 : 1,
                pointerEvents: files.length >= MAX_FILES ? 'none' : 'auto',
              }}
            >
              {files.length === 0 ? (
                <>
                  <Upload className="w-10 h-10 mb-3" style={{ color: isDark ? '#a78bfa' : '#6d28d9' }} />
                  <p style={{ fontFamily: S, fontWeight: 700, fontSize: '0.9rem', color: T.head, marginBottom: '4px' }}>Drop or click to add scans</p>
                  <p style={{ fontSize: '0.72rem', color: T.muted, textAlign: 'center' }}>JPG · PNG · WEBP · TIFF · DICOM · ZIP · PDF · TXT &nbsp;·&nbsp; up to {MAX_FILES} files, {MAX_FILE_MB}MB each (ZIP {MAX_ZIP_MB}MB)</p>
                </>
              ) : (
                <>
                  <Plus className="w-7 h-7 mb-2" style={{ color: isDark ? '#a78bfa' : '#6d28d9', opacity: 0.7 }} />
                  <p style={{ fontFamily: I, fontSize: '0.78rem', color: T.muted }}>Click or drop to add more</p>
                </>
              )}
            </label>

            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {files.map((uf: UploadedFile, idx: number) => (
                  <div
                    key={uf.id}
                    style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${T.cardBdr}`, background: T.upBg, aspectRatio: '1', animation: 'fadeIn 0.3s ease' }}
                  >
                    {uf.kind === 'image' ? (
                      <img src={uf.preview} alt={uf.file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px' }}>
                        {uf.kind === 'pdf' ? <FileText className="w-8 h-8" style={{ color: '#ef4444' }} /> : <LayersIcon className="w-8 h-8" style={{ color: T.muted }} />}
                        <span style={{ fontSize: '0.65rem', color: T.muted, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{uf.file.name}</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: 6, left: 6, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S, fontSize: '0.65rem', fontWeight: 800, backdropFilter: 'blur(8px)' }}>{idx + 1}</div>
                    <button onClick={(e) => { e.preventDefault(); removeFile(uf.id); }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {validationWarnings.length > 0 && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', background: T.amberBg, border: `1px solid ${T.amberBdr}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <AlertTriangle className="w-3.5 h-3.5" style={{ color: T.amberTxt }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: T.amberTxt, fontFamily: S, letterSpacing: '0.1em' }}>VALIDATION</span>
                </div>
                {validationWarnings.map((w: string, i: number) => <div key={i} style={{ fontSize: '0.72rem', color: T.amberTxt, lineHeight: 1.5 }}>{w}</div>)}
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={files.length === 0 || analyzing}
            className="w-full transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ padding: '0.9rem', borderRadius: '14px', background: T.btnBg, boxShadow: files.length > 0 ? T.btnSh : 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 700, fontFamily: S, border: 'none', cursor: files.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.05em' }}
          >
            Analyze {files.length > 1 ? `${files.length} Scans` : 'with AI'}
          </button>
        </div>

        {/* ── RIGHT: Results panel ── */}
        <div
          className="ia-card ia-results-scroll"
          data-lenis-prevent
          style={{ ...glass, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain' }}
        >
          <div style={{ flexShrink: 0 }}>
            <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>AI Analysis Results</h3>
            <p style={{ color: T.sub, fontSize: '0.82rem' }}>Deep learning model predictions</p>
          </div>

          {!result && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}>
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p style={{ fontSize: '0.9rem' }}>Upload a medical scan and click "Analyze" to get AI predictions</p>
            </div>
          )}

          {result && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Overall header card */}
              <div style={{ padding: '1.1rem 1.25rem', borderRadius: '14px', background: T.resBg, border: `1px solid ${T.resBdr}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '0.7rem' }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', fontFamily: S, letterSpacing: '0.16em', color: T.accentPurple, marginBottom: '4px' }}>ASSESSMENT RESULT</div>
                    <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '1rem', lineHeight: 1.3 }}>{result.diagnosis}</h4>
                  </div>
                  {result.confidence != null && (
                  <span style={{ padding: '4px 14px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, fontFamily: S, whiteSpace: 'nowrap', flexShrink: 0, background: result.confidence >= 85 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: result.confidence >= 85 ? '#10b981' : '#f59e0b', border: `1px solid ${result.confidence >= 85 ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}` }}>
                    {result.confidence}% scan match
                  </span>
                  )}
                </div>
                {result.confidence != null && (
                  <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: T.muted }}>
                  <span>Scan-type recognition</span>
                  <span style={{ fontWeight: 700, color: T.text }}>{result.confidence}%</span>
                </div>
                <div style={{ height: '6px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.confidence}%`, borderRadius: '999px', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', boxShadow: '0 0 10px rgba(99,102,241,0.5)', transition: 'width 1s ease' }} />
                </div>
                  </>
                )}
              </div>

              <EmergencyPrompt active={isEmergency({ scanSections: result.scanSections })} isDark={isDark} />

              {/* Per-scan cards */}
              {result.scanSections && result.scanSections.length > 0 && result.scanSections.map((section: ScanSection, i: number) => {
                const urgency = extractUrgency(section.content);
                const cardBorder = section.refusal
                  ? T.amberBdr
                  : urgency?.color
                    ? `${urgency.color}44`
                    : T.cardBdr;

                return (
                  <div key={i} style={{ borderRadius: '14px', border: `1px solid ${cardBorder}`, overflow: 'hidden', background: T.scanCardBg }}>
                    {/* Card header bar */}
                    <div style={{ padding: '0.65rem 1rem', background: T.scanCardHdr, borderBottom: `1px solid ${cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      {/* Numbered badge */}
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: S, fontSize: '0.7rem', fontWeight: 800, color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.45)' }}>
                        {section.num}
                      </div>
                      <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                        {section.filename}
                      </span>
                      {/* Tags */}
                      {section.detectedKind && section.detectedKind !== 'other' && !section.refusal && (
                        <span style={{ padding: '2px 9px', borderRadius: '6px', background: isDark ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.10)', border: `1px solid ${isDark ? 'rgba(139,92,246,0.40)' : 'rgba(99,102,241,0.30)'}`, color: T.accentPurple, fontSize: '0.62rem', fontWeight: 800, fontFamily: S, whiteSpace: 'nowrap' }}>
                          {section.detectedKind.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      )}
                      {urgency && (
                        <span style={{ padding: '2px 9px', borderRadius: '6px', background: urgency.bg, border: `1px solid ${urgency.color}55`, color: urgency.color, fontSize: '0.62rem', fontWeight: 800, fontFamily: S, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                          {urgency.label.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Analysis content */}
                    <div style={{ padding: '1rem 1.1rem' }}>
                      {section.refusal
                        ? <WrongPageNotice message={section.refusal.message} redirect={section.refusal.redirect} onSwitchTab={onSwitchTab} isDark={isDark} T={T} S={S} />
                        : <MedicalAIOutput text={section.content} isDark={isDark} textColor={T.text} mutedColor={T.muted} />}
                    </div>
                  </div>
                );
              })}

              {/* Secondary findings */}
              {result.findings && result.findings.length > 0 && (
                <div>
                  <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', marginBottom: '0.75rem' }}>Secondary Matches</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {result.findings.map((f: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '10px', background: T.findBg }}>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: T.text, textTransform: 'capitalize' }}>{f.label}</div>
                          <div style={{ fontSize: '0.65rem', color: T.muted }}>{f.location}</div>
                        </div>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}>{f.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div>
                  <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', marginBottom: '0.75rem' }}>System Recommendations</h4>
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

              {/* Disclaimer */}
              <div role="alert" style={{ padding: '1rem 1.1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.10)', border: '1.5px solid rgba(239,68,68,0.5)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#ef4444', marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fca5a5', marginBottom: 4, letterSpacing: '0.02em' }}>AI BASED DIAGNOSIS</p>
                  <p style={{ fontSize: '0.78rem', color: T.amberTxt, lineHeight: 1.55 }}>
                    This is an experimental AI demo. Output may be wrong. Do not use it to make health decisions. Always consult a licensed radiologist or physician.
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
