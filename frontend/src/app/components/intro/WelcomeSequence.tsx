/* Big animation 2: right after a successful login or sign-up, before the dashboard. It is the only animation at that
   moment (the dialog's small ones stop one step earlier). Sequence: the screen closes over the dialog like an iris
   (onCovered: the page underneath may now be swapped), a ring draws around the mark and a check ticks, "Welcome back,
   Om", a three-row checklist whose ticks wait for the data that is really loading, then the iris opens onto the
   dashboard. A saved-session reload (kind 'resume') gets a short version, about 1.2 s. Behind the greeting an animated background
   (welcomeFx: cells, heartbeat lines, orbits that lock in as the rows complete). Styles: styles/intro.css (.wl-*). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Activity, Check } from 'lucide-react';
import { gsap, setIris, tweenIris, useDeviceTier, useReducedMotion } from '../../animations';
import { mountWelcomeFx } from './welcomeFx';

export type WelcomeKind = 'login' | 'signup' | 'resume';
type Row = 'session' | 'history' | 'tools';
type RowState = 'wait' | 'active' | 'done';

const ROWS: [Row, string][] = [['session', 'Secure session'], ['history', 'Your history'], ['tools', 'Your tools']];
const SAFETY_MS = 15000;   // a stuck request must never trap the user behind this screen

interface Props {
  name: string;
  kind: WelcomeKind;
  ready: { history: boolean; settings: boolean };
  /** Fully covered: the page behind may change. */
  onCovered: () => void;
  /** The screen is calm (greeting shown, only waiting for data): the moment to mount the heavy parts behind it. */
  onSettle: () => void;
  /** The iris starts to open. */
  onReveal: () => void;
  onDone: () => void;
}

export default function WelcomeSequence({ name, kind, ready, onCovered, onSettle, onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const fxHost = useRef<HTMLDivElement>(null);
  const progress = useRef(0);   // checklist rows done: the background's orbits lock in as it grows
  const live = useRef({ ready, onCovered, onSettle, onReveal, onDone });
  live.current = { ready, onCovered, onSettle, onReveal, onDone };
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const [rows, setRows] = useState<Record<Row, RowState>>({ session: 'wait', history: 'wait', tools: 'wait' });
  const hello = (kind === 'signup' ? 'Welcome to CuraSense' : 'Welcome back') + (name ? `, ${name}` : '');

  // A sign-in starts fully open and closes over the dialog; a saved session and reduced motion start fully covered.
  useLayoutEffect(() => { if (root.current) setIris(root.current, kind === 'resume' || reduced ? 0 : 100); }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let alive = true, iris: gsap.core.Tween | undefined;
    const q = (s: string) => el.querySelectorAll<Element>(s);
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const until = (ok: () => boolean, maxMs: number) => new Promise<void>((r) => {
      const t = performance.now();
      const id = setInterval(() => { if (!alive || ok() || performance.now() - t > maxMs) { clearInterval(id); r(); } }, 40);
    });
    const frames = (n: number) => new Promise<void>((r) => { const f = () => (--n > 0 ? requestAnimationFrame(f) : r()); requestAnimationFrame(f); });
    let stopFx: (() => void) | undefined;
    const setRow = (k: Row, s: RowState) => { if (!alive) return; if (s === 'done') progress.current++; setRows((p) => ({ ...p, [k]: s })); };
    const dataReady = () => live.current.ready.history && live.current.ready.settings;
    const safety = setTimeout(() => { if (alive) { live.current.onCovered(); live.current.onSettle(); live.current.onReveal(); live.current.onDone(); } }, SAFETY_MS);

    const open = async (d: number) => {
      gsap.to(q('.wl-center'), { scale: 1.06, opacity: 0, duration: 0.35, ease: 'power2.in' });
      gsap.delayedCall(d * 0.15 + d * 0.3, () => { if (alive) live.current.onReveal(); });
      iris = tweenIris(el, 0, 100, { duration: d, delay: d * 0.15, ease: 'power2.inOut' });
      await iris;
      if (alive) live.current.onDone();
    };

    (async () => {
      // Reduced motion: the same screens, still and short. Nothing draws, spins or flies.
      if (reduced) {
        gsap.set(q('.wl-mark, .wl-hello .ch, .wl-sub, .wl-bar, .wl-list li, .wl-verified'), { opacity: 1 });
        if (kind !== 'resume') {
          await frames(1);   // not inside the effect's own tick: the page swap is a flushSync, which React refuses during a lifecycle
          if (!alive) return;
          live.current.onCovered();
        }
        live.current.onSettle();
        await wait(kind === 'resume' ? 200 : 450);
        await until(dataReady, 8000);
        if (!alive) return;
        live.current.onReveal();
        live.current.onDone();
        return;
      }

      if (kind === 'resume') {
        // saved session: opaque from the first frame, a mark, a greeting, a bar that fills as the data arrives
        gsap.fromTo(q('.wl-mark'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.6)' });
        gsap.fromTo(q('.wl-hello .ch'), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.018, ease: 'expo.out', delay: 0.15 });
        gsap.to(q('.wl-bar'), { opacity: 1, duration: 0.3, delay: 0.25 });
        gsap.to(q('.wl-bar i'), { scaleX: 0.85, duration: 0.9, ease: 'power1.out', delay: 0.25 });
        await wait(300);
        live.current.onSettle();
        await wait(250);
        await until(dataReady, 8000);
        if (!alive) return;
        gsap.to(q('.wl-bar i'), { scaleX: 1, duration: 0.18 });
        await wait(120);
        await open(0.45);
        return;
      }

      // 1. close over whatever is behind (the dialog), then let the app swap the page underneath
      iris = tweenIris(el, 100, 0, { duration: 0.42, ease: 'power2.inOut' });
      await iris;
      if (!alive) return;
      // The swap is one long synchronous commit (the dashboard mounts). It happens now, while the screen is covered and nothing
      // moves, and the animations start two frames after it, on a calm main thread, so none of their first frames is lost.
      live.current.onCovered();
      await frames(2);
      if (!alive) return;
      if (fxHost.current) stopFx = mountWelcomeFx(fxHost.current, progress);

      // 2. the seal: mark pops, ring draws, check ticks, ripple and sparks; 3. greeting; 4. checklist
      const t0 = performance.now();
      const at = (ms: number) => wait(Math.max(0, ms - (performance.now() - t0)));
      gsap.timeline()
        .fromTo(q('.wl-mark'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.6)' }, 0)
        .fromTo(q('.wl-arc'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, 0.15)
        .to(q('.wl-mark svg'), { opacity: 0, scale: 0.6, duration: 0.16 }, 0.62)
        .fromTo(q('.wl-check path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.32, ease: 'power2.out' }, 0.66)
        .fromTo(q('.wl-ripple'), { scale: 0.75, opacity: 0.7 }, { scale: 1.9, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.66)
        .fromTo(q('.wl-sparks i'), { x: 0, y: 0, opacity: 1, scale: 1 }, { x: (i) => Math.cos((i * Math.PI) / 3) * 78, y: (i) => Math.sin((i * Math.PI) / 3) * 78, opacity: 0, scale: 0.3, duration: 0.6, ease: 'power2.out' }, 0.68)
        .fromTo(q('.wl-verified'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, 0.78)
        .fromTo(q('.wl-hello .ch'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.022, ease: 'expo.out' }, 0.85)
        .fromTo(q('.wl-sub'), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 1.15)
        .fromTo(q('.wl-list li'), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.14 }, 1.2);

      // The ticks are honest: each waits for its minimum time AND for the data it stands for.
      await at(1250); setRow('session', 'active');
      await at(1550); setRow('session', 'done');
      live.current.onSettle();
      setRow('history', 'active'); setRow('tools', 'active');
      await Promise.all([
        (async () => { await at(1900); await until(() => live.current.ready.history, 9000); setRow('history', 'done'); })(),
        (async () => { await at(2300); await until(() => live.current.ready.settings, 9000); setRow('tools', 'done'); })(),
      ]);
      await wait(300);
      if (!alive) return;
      await open(0.85);   // 5. iris opens onto the dashboard
    })();

    return () => {
      alive = false;
      stopFx?.();
      clearTimeout(safety);
      iris?.kill();
      gsap.killTweensOf(el);
      gsap.killTweensOf(q('*'));
    };
  }, []);   // one run per mount; the values that change while it plays (data readiness, callbacks) come through `live`

  return (
    <div ref={root} className="wl-root" data-welcome data-no-cs-transition role="status" aria-live="polite" aria-label={hello}>
      <div className="wl-bg" aria-hidden />
      {kind !== 'resume' && !reduced && tier !== 'low' && <div className="wl-fx" ref={fxHost} aria-hidden><canvas /><canvas /><canvas /></div>}
      <div className="wl-center">
        <div className="wl-seal" aria-hidden>
          <svg className="wl-ring" viewBox="0 0 132 132">
            <defs><linearGradient id="wl-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2667ff" /><stop offset="0.6" stopColor="#22d3ee" /><stop offset="1" stopColor="#34d399" /></linearGradient></defs>
            <circle className="wl-track" cx="66" cy="66" r="60" />
            <circle className="wl-arc" cx="66" cy="66" r="60" pathLength={1} />
          </svg>
          <i className="wl-ripple" />
          <div className="wl-mark"><Activity size={40} strokeWidth={2.1} /></div>
          <svg className="wl-check" viewBox="0 0 52 52"><path d="M13 27.5 L22.5 37 L39.5 16.5" pathLength={1} /></svg>
          <span className="wl-sparks">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} />)}</span>
        </div>
        {kind !== 'resume' && <p className="wl-verified">{kind === 'signup' ? 'Account secured' : 'Identity verified'}</p>}
        <h2 className="wl-hello" aria-hidden>{[...hello].map((c, i) => <span className="ch" key={i}>{c === ' ' ? ' ' : c}</span>)}</h2>
        {kind !== 'resume' ? (
          <>
            <p className="wl-sub">Setting up your workspace</p>
            <ul className="wl-list" aria-hidden>
              {ROWS.map(([k, label]) => (
                <li key={k} data-s={rows[k]}><span className="wl-dot"><Check size={13} strokeWidth={3} /></span>{label}</li>
              ))}
            </ul>
          </>
        ) : (
          <div className="wl-bar" aria-hidden><i /></div>
        )}
      </div>
    </div>
  );
}
