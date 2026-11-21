/* Home: the living cell stays the hero. Left column = greeting, promise, two buttons and three doors into the tools;
   the right side is left clear for the cell. Below the hero, the scroll-driven narrative reel. */
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { ArrowRight, ChevronDown, FlaskConical, ScanLine, Stethoscope } from 'lucide-react';
import { gsap } from '../../animations';
import NarrativeReel from '../auth/NarrativeReel';
import type { AuthIntent, AuthMode } from './AuthDialog';
import type { RouteId } from './router';

const DOORS: { intent: AuthIntent; icon: typeof Stethoscope; title: string; sub: string }[] = [
  { intent: 'symptoms', icon: Stethoscope, title: 'Check symptoms', sub: 'Ranked conditions and an urgency level' },
  { intent: 'image', icon: ScanLine, title: 'Read a scan', sub: 'AI-assisted read of a medical image' },
  { intent: 'report', icon: FlaskConical, title: 'Explain a lab report', sub: 'Every biomarker flagged against its range' },
];

const greetingFor = (h = new Date().getHours()) => (h < 5 ? 'Working late' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');

interface HomePageProps {
  isDark: boolean;
  /** The intro has opened (or never ran): the hero may make its entrance. */
  bootDone: boolean;
  navigate: (to: RouteId, hash?: string) => void;
  onOpenAuth: (mode: AuthMode, intent?: AuthIntent) => void;
}

export default function HomePage({ isDark, bootDone, navigate, onOpenAuth }: HomePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTl = useRef<gsap.core.Timeline | null>(null);
  const greeting = useMemo(() => greetingFor(), []);
  const S = 'var(--font-display)';
  const ink = isDark ? '#dceaf4' : '#0a1230';

  // Built paused with the hero held behind its masks, and played as the intro's iris opens, so the first thing seen is the entrance.
  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      heroTl.current = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .fromTo('.hero-text', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.09 })
        .fromTo('.uline', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.7, ease: 'power4.inOut' }, '-=0.6')
        .fromTo('.fade-up', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 }, '-=0.5');
    }, containerRef);
    return () => { heroTl.current = null; ctx.revert(); };
  }, []);
  useEffect(() => { if (bootDone) heroTl.current?.play(); }, [bootDone]);

  const scrollTo = (id: string) => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' }); };

  return (
    <div ref={containerRef} className="relative w-full">
      <section id="section-hero" className="scroll-section hp-hero">
        <div className="hp-hero-in">
          <div className="hp-copy">
            <p className="hp-greet fade-up"><i aria-hidden />{greeting}. Welcome to CuraSense.</p>

            <div className="hp-mask"><h1 className="hero-text" style={{ fontFamily: S, fontSize: 'clamp(2.9rem, 5.6vw, 5.5rem)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.045em', color: ink }}>Clinical precision,</h1></div>
            <div className="hp-mask"><h1 className="hero-text hero-gradient-text" style={{ fontFamily: S, fontSize: 'clamp(2.9rem, 5.6vw, 5.5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.045em', marginBottom: '0.6rem', paddingBottom: '0.08em', background: 'linear-gradient(100deg, var(--accent-cyan), var(--accent-violet), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>redefined.</h1></div>

            <svg className="uline hp-ekg" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
              <path d="M0,12 L60,12 Q72,6 84,12 L96,12 L104,18 L114,0 L124,22 L136,12 L300,12" fill="none" stroke={isDark ? 'rgba(38,103,255,0.5)' : 'rgba(2,132,199,0.4)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <p data-lg="plate" className="fade-up hp-lede">
              CuraSense reads symptoms, medical images and lab reports with AI-assisted analysis, ranks what matters,
              explains every result, and leaves the decision with you.
            </p>

            <div className="fade-up hp-cta">
              <button type="button" className="lp-btn lp-btn-primary hp-btn" onClick={() => onOpenAuth('register')}>Get started <ArrowRight size={17} aria-hidden /></button>
              <button type="button" className="lp-btn lp-btn-ghost hp-btn" onClick={() => navigate('platform')}>Explore the platform</button>
            </div>

            <div className="fade-up hp-start">
              <p className="hp-start-label" id="doors-label">Or start with</p>
              <ul className="hp-doors" aria-labelledby="doors-label" data-no-cs-transition>
                {DOORS.map(({ intent, icon: Icon, title, sub }) => (
                  <li key={intent}>
                    <button type="button" className="door" onClick={() => onOpenAuth('register', intent)}>
                      <span className="door-ic" aria-hidden><Icon size={20} strokeWidth={2} /></span>
                      <span className="door-tx"><b>{title}</b><small>{sub}</small></span>
                      <ArrowRight className="door-ar" size={16} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <button type="button" className="hp-scroll fade-up" onClick={() => scrollTo('reel-problem')}>
          See how it reads a case <ChevronDown size={16} aria-hidden />
        </button>
      </section>

      {/* Six full-viewport scenes, Problem to Synthesis; each owns its background and choreography. */}
      <NarrativeReel isDark={isDark} onPrimaryCta={() => onOpenAuth('register')} />
    </div>
  );
}
