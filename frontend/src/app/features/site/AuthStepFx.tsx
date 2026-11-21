/* The small animation between auth steps, drawn over the form inside the dialog: a loading screen while a request is in
   flight, then a success tick before the next step slides in. One DOM instance changes phase, so the ring can finish
   drawing instead of being swapped for a different picture. Styles: styles/intro.css (.ad-fx, .fx-*). */
import { Activity } from 'lucide-react';

export type FxPhase = 'loading' | 'success';

export function AuthStepFx({ phase, title, sub, leaving }: { phase: FxPhase; title: string; sub?: string; leaving?: boolean }) {
  return (
    <div className="ad-fx" role="status" aria-live="polite" data-phase={phase} data-leaving={leaving || undefined}>
      <div className="fx-seal">
        <svg className="fx-ring" viewBox="0 0 100 100" aria-hidden>
          <defs>
            <linearGradient id="fx-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2667ff" /><stop offset="1" stopColor="#22d3ee" /></linearGradient>
          </defs>
          <circle className="fx-track" cx="50" cy="50" r="44" />
          <circle className="fx-arc" cx="50" cy="50" r="44" pathLength={1} />
        </svg>
        <span className="fx-core" aria-hidden><Activity size={30} strokeWidth={2.2} /></span>
        <svg className="fx-check" viewBox="0 0 52 52" aria-hidden><path d="M14 27.5 L22.5 36 L38.5 17.5" pathLength={1} /></svg>
        <i className="fx-ripple" aria-hidden />
        <span className="fx-sparks" aria-hidden>{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ ['--a' as string]: `${i * 60}deg` }} />)}</span>
      </div>
      <svg className="fx-ecg" viewBox="0 0 160 28" aria-hidden><path d="M0 14 H52 L58 14 L64 22 L72 2 L80 26 L86 14 H160" pathLength={1} /></svg>
      <b className="fx-title" key={phase}>{title}</b>
      {sub && <small className="fx-sub" key={`s-${phase}`}>{sub}</small>}
    </div>
  );
}
