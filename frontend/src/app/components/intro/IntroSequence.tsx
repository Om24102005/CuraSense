/* Big animation 1: the first visit, before the landing page. An ECG line draws across the screen, its spike sends out a
   pulse ring and the brand mark pops in, the name rises letter by letter, then the screen opens like an iris onto the
   landing page (the cell lights up as it opens). About 3.5 s, skippable (button, Esc, Enter, Space). The app skips it
   under reduced motion and on deep links. Styles: styles/intro.css (.in-*). */
import { useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { gsap, tweenIris } from '../../animations';

const ECG = 'M0 100 L430 100 L470 100 Q490 80 510 100 L540 100 L560 118 L600 10 L640 186 L670 100 L710 100 Q740 70 770 100 L1200 100';
const WORD = 'CuraSense';

interface Props {
  /** The iris is opening: start whatever sits behind it (the cell's own intro). */
  onReveal: () => void;
  /** Fully open: unmount. */
  onDone: () => void;
}

export default function IntroSequence({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const live = useRef({ onReveal, onDone });
  live.current = { onReveal, onDone };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = (s: string) => el.querySelectorAll<Element>(s);
    let alive = true, revealing = false, iris: gsap.core.Tween | undefined;

    const reveal = (fast: boolean) => {
      if (revealing || !alive) return;
      revealing = true;
      tl.kill();
      const d = fast ? 0.5 : 0.85;
      gsap.to(q('.in-stage, .in-skip'), { opacity: 0, scale: 1.06, duration: d * 0.45, ease: 'power2.in' });
      iris = tweenIris(el, 0, 100, { duration: d, delay: d * 0.15, ease: 'power2.inOut', onComplete: () => { if (alive) live.current.onDone(); } });
      gsap.delayedCall(d * 0.15 + d * 0.3, () => { if (alive) live.current.onReveal(); });   // a third of the way open
    };

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.fromTo(q('.in-ecg path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'none' }, 0.25)           // the spike (x = 600) lands at about 0.85 s
      .fromTo(q('.in-mark'), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' }, 0.85)
      .fromTo(q('.in-ring'), { scale: 0.7, opacity: 0.8 }, { scale: 3.4, opacity: 0, duration: 1.1, stagger: 0.18 }, 0.85)
      .to(q('.in-ecg'), { opacity: 0.28, duration: 0.7 }, 1.7)
      .fromTo(q('.in-word span'), { yPercent: 115, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.035, ease: 'expo.out' }, 1.2)
      .fromTo(q('.in-tag'), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1.85)
      .to(q('.in-skip'), { opacity: 1, duration: 0.4 }, 0.6)
      .add(() => reveal(false), 2.8);

    const key = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(true); } };
    addEventListener('keydown', key);
    const skip = el.querySelector<HTMLElement>('.in-skip');
    const onSkip = () => reveal(true);
    skip?.addEventListener('click', onSkip);
    const focusSkip = gsap.delayedCall(0.7, () => el.querySelector<HTMLElement>('.in-skip')?.focus({ preventScroll: true }));

    return () => {
      alive = false;
      removeEventListener('keydown', key);
      skip?.removeEventListener('click', onSkip);
      focusSkip.kill();
      tl.kill();
      iris?.kill();
      gsap.killTweensOf(el);
      gsap.killTweensOf(q('.in-stage, .in-skip'));
    };
  }, []);

  return (
    <div ref={root} className="in-root" data-intro data-no-cs-transition role="region" aria-label="Welcome to CuraSense">   {/* not role=dialog: index.css paints every dialog as a translucent card */}
      <div className="in-bg" aria-hidden />
      <div className="in-stage" aria-hidden>
        <svg className="in-ecg" viewBox="0 0 1200 200">
          <defs>
            <linearGradient id="in-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
              <stop offset="0" stopColor="#2667ff" stopOpacity="0" /><stop offset="0.3" stopColor="#2667ff" /><stop offset="0.6" stopColor="#22d3ee" /><stop offset="1" stopColor="#ec4899" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path className="in-ecg-glow" d={ECG} pathLength={1} />
          <path className="in-ecg-line" d={ECG} pathLength={1} />
        </svg>
        <i className="in-ring" /><i className="in-ring" />
        <div className="in-mark"><Activity size={46} strokeWidth={2.1} /></div>
        <div className="in-word">{[...WORD].map((c, i) => <span key={i}>{c}</span>)}</div>
        <p className="in-tag">Clinical precision, redefined.</p>
      </div>
      <button type="button" className="in-skip">Skip</button>
    </div>
  );
}
