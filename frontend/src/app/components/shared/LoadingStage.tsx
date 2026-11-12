/* ═══════════════════════════════════════════════════════
   CuraSense — the analysis loading page: the reading lens
   ───────────────────────────────────────────────────────
   Full screen, dark. The plasma orb glides slowly across the user's OWN data and lights a halo of sharp detail beneath
   it, like an eye reading the file: a scan shows the uploaded picture, a report shows the pasted text (or a report sheet),
   the symptoms tab shows the user's own words. A dimmed copy of that content fills the page; a second, sharp copy sits in
   a circle that travels with the orb and moves exactly opposite to it, so the detail stays put while the lens passes over it.
   Everything moves by transform only (no per-frame script), and the orb is the only WebGL.
   Loaded on demand by LoadingScreen (its only user).
   ═══════════════════════════════════════════════════════ */

import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import { PlasmaOrb } from './plasma-orb/PlasmaOrb';
import type { LoadingSubject, LoadingVariant } from './LoadingScreen';
import './loading-stage.css';

const PLASMA = {
  blue: { center: '#1a4fe6', glass: '#4fa8ff', rim: '#92dcff', plasma: '#6fd0ff', accent: '#ff8fc8' },
  teal: { center: '#0e7490', glass: '#22d3ee', rim: '#a5f3fc', plasma: '#67e8f9', accent: '#fde68a' },
  violet: { center: '#5b21b6', glass: '#a78bfa', rim: '#ddd6fe', plasma: '#c4b5fd', accent: '#f9a8d4' },
};

const LOOKS: Record<LoadingVariant, { rgb: string; tag: string; plasma: typeof PLASMA.blue; words: string[] }> = {
  symptoms: { rgb: '79, 168, 255', tag: 'Symptom analysis', plasma: PLASMA.blue, words: ['Listening', 'Patterns', 'Signals'] },
  scans: { rgb: '34, 211, 238', tag: 'Scan analysis', plasma: PLASMA.teal, words: [] },
  reports: { rgb: '167, 139, 250', tag: 'Report analysis', plasma: PLASMA.violet, words: [] },
};

const BEAT_MS = 1400;     // the orb pulses once per ring the lens sends out (three rings share a 4.2 s cycle)
const PICTURE_MS = 7000;  // several uploaded pictures take turns under the lens

// A report sheet for when the text is not available (an uploaded file): rows with a name, a value, a range and a status dot.
const SHEET = Array.from({ length: 12 }, (_, i) => ({ name: 22 + ((i * 37) % 24), value: 8 + ((i * 11) % 6), range: 12 + ((i * 17) % 9), flag: i === 3 || i === 7 || i === 10 }));

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** What the lens reads. Rendered twice: dim for the page, sharp inside the lens. */
function Reading({ variant, subject, picture, onBroken }: { variant: LoadingVariant; subject: LoadingSubject; picture: string | undefined; onBroken: (src: string) => void }) {
  if (variant === 'scans') {
    return picture ? <img className="ls-img" src={picture} alt="" draggable={false} onError={() => onBroken(picture)} /> : <div className="ls-dots" />;
  }
  if (variant === 'reports') {
    const lines = (subject.lines ?? []).map((l) => l.trimEnd()).filter((l) => l.trim()).slice(0, 15).map((l) => l.slice(0, 74));
    if (lines.length) {
      return (
        <div className="ls-text"><div className="ls-lines">
          {lines.map((l, i) => <div key={i}>{l.split(/(\d+(?:\.\d+)?)/).map((part, j) => (j % 2 ? <b key={j}>{part}</b> : <Fragment key={j}>{part}</Fragment>))}</div>)}
        </div></div>
      );
    }
    return (
      <div className="ls-sheet">
        {SHEET.map((r, i) => (
          <div key={i} className={`ls-row${r.flag ? ' flag' : ''}`}>
            <i style={{ width: `${r.name * 2.6}%` }} /><i style={{ width: `${r.value * 6}%` }} /><i style={{ width: `${r.range * 6}%` }} /><b />
          </div>
        ))}
      </div>
    );
  }
  const words = (subject.words ?? []).filter(Boolean).slice(0, 10);
  const shown = words.length ? words : LOOKS.symptoms.words;
  return <div className={`ls-words${shown.length > 5 ? ' many' : ''}`}>{shown.map((w, i) => <span key={i} className="ls-word">{w}</span>)}</div>;
}

interface LoadingStageProps {
  message: string;
  variant: LoadingVariant;
  subject: LoadingSubject;
  /** Date.now() when the request started, for the elapsed clock. */
  since: number;
}

export function LoadingStage({ message, variant, subject, since }: LoadingStageProps) {
  const look = LOOKS[variant];
  const [seconds, setSeconds] = useState(() => Math.floor((Date.now() - since) / 1000));
  const [broken, setBroken] = useState<string[]>([]);
  const [turn, setTurn] = useState(0);
  const orb = useRef<HTMLDivElement>(null);
  const pictures = (subject.images ?? []).filter((src) => !broken.includes(src));
  const picture = pictures.length ? pictures[turn % pictures.length] : undefined;

  useEffect(() => {
    const t = window.setInterval(() => setSeconds(Math.floor((Date.now() - since) / 1000)), 1000);
    return () => window.clearInterval(t);
  }, [since]);

  useEffect(() => {  // the orb beats with the rings: a press on its stage is what makes it pulse
    const t = window.setInterval(() => orb.current?.querySelector('.pob-stage')?.dispatchEvent(new PointerEvent('pointerdown')), BEAT_MS);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (pictures.length < 2) return;
    const t = window.setInterval(() => setTurn((n) => n + 1), PICTURE_MS);
    return () => window.clearInterval(t);
  }, [pictures.length]);

  const reading = <Reading variant={variant} subject={subject} picture={picture} onBroken={(src) => setBroken((b) => (b.includes(src) ? b : [...b, src]))} />;

  return (
    <div className="loading-stage" data-loading-stage data-variant={variant} style={{ '--ls-rgb': look.rgb } as CSSProperties}>
      <div className="ls-dust" aria-hidden="true" />
      <div className="ls-tag" aria-hidden="true">CuraSense · {look.tag}</div>

      <div aria-hidden="true">
        <div className="ls-field ls-dim">{reading}</div>
        <div className="ls-sx"><div className="ls-sy">
          <div className="ls-lens"><div className="ls-ux"><div className="ls-uy"><div className="ls-field ls-bright">{reading}</div></div></div></div>
          <i className="ls-ring" /><i className="ls-ring r2" /><i className="ls-ring r3" />
          <div className="ls-orb" ref={orb}>
            <PlasmaOrb state="thinking" detail="balanced" size={0.7} background="#000000" style={{ background: 'transparent' }} {...look.plasma} />
          </div>
        </div></div>
      </div>

      <div className="ls-caption">
        <span className="ls-message">{message}</span>
        <span className="ls-meta" aria-hidden="true">{clock(seconds)} · This can take up to a minute</span>
      </div>
    </div>
  );
}
