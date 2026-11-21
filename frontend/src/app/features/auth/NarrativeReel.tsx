/* ═══════════════════════════════════════════════════════════════════
   CuraSense — Narrative Reel
   Full-viewport scenes, persistent backdrop manager, GSAP-scrubbed
   content choreography. Each section feels like a complete page.

   FLOW
     1. Problem   — diagnosis is slow + lossy
     2. Approach  — three signals, one synthesis
     3. Symptoms  — natural language
     4. Imaging   — vision on scans
     5. Labs      — biomarker patterns
     6. Synthesis — converge + CTA

   IMPLEMENTATION NOTES
     • Backgrounds live in a single fixed manager. Active scene is
       picked by IntersectionObserver, others fade out. This avoids
       per-section absolute layers stacking and gives smooth swaps.
     • Content uses GSAP ScrollTrigger with scrub for tight coupling
       between scroll position and animation progress.
     • CSS scroll-snap-type: y proximity gives the "page locks" feel
       without fighting Lenis hard.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Microscope, FlaskConical, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type SceneKey = 'problem' | 'approach' | 'symptoms' | 'imaging' | 'labs' | 'finale';

interface NarrativeReelProps {
  onPrimaryCta?: () => void;
  isDark: boolean;
}

const S = "var(--font-display)";
const I = "var(--font-body)";

/* Copy sits on glass plates (data-lg="plate"). Neon accents fail contrast on the light plate, so use their deep twins there. */
const DEEP: Record<string, string> = { '#22d3ee': '#0e7490', '#a855f7': '#7e22ce', '#ec4899': '#be185d', '#ef4444': '#b91c1c' };
const ink = (c: string, isDark: boolean) => (isDark ? c : DEEP[c] ?? c);
const bodyInk = (isDark: boolean) => (isDark ? 'rgba(255,255,255,0.84)' : 'rgba(10,10,26,0.82)');

/* ─────────────────────────────────────────────────────────────────────
   BACKDROP COMPONENTS — one per scene, CSS/SVG only.
   Each receives `active: boolean` and fades opacity accordingly.
   ───────────────────────────────────────────────────────────────────── */

function Backdrop({ active, children }: { active: boolean; children: ReactNode }) {
  // The backdrops are fixed to the viewport, so a scene that merely sat at opacity 0 kept its CSS and SVG animations restyling
  // the page for as long as it was open. Only the active scene (plus the fade-out) is mounted.
  const [live, setLive] = useState(active);
  useEffect(() => {
    if (active) { setLive(true); return; }
    const t = window.setTimeout(() => setLive(false), 1000);   // after the 0.9s fade
    return () => window.clearTimeout(t);
  }, [active]);
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.9s cubic-bezier(0.65, 0, 0.35, 1)',
        pointerEvents: 'none',
      }}
    >
      {(active || live) && children}
    </div>
  );
}

/* Scene 1 — Problem: dotted grid, several dots glow red */
function BgProblem({ active }: { active: boolean }) {
  return (
    <Backdrop active={active}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at center, rgba(168, 85, 247, 0.12) 1px, transparent 1.5px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 100%)',
        }}
      />
      {/* Error pulse dots */}
      {[
        { x: 18, y: 22, d: 0 },
        { x: 78, y: 30, d: 1.3 },
        { x: 32, y: 70, d: 2.1 },
        { x: 65, y: 78, d: 0.6 },
        { x: 50, y: 50, d: 1.8 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#ef4444',
            boxShadow: '0 0 14px #ef4444, 0 0 28px rgba(239, 68, 68, 0.5)',
            animation: `errorPulse 3s ease-in-out infinite`,
            animationDelay: `${p.d}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes errorPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(1.6); opacity: 1; }
        }
      `}</style>
    </Backdrop>
  );
}

/* Scene 2 — Approach: three concentric arcs converging */
function BgApproach({ active }: { active: boolean }) {
  return (
    <Backdrop active={active}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, opacity: 0.55 }}
      >
        <defs>
          <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ringGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform="translate(500 500)">
          <circle r="220" fill="none" stroke="url(#ringGrad1)" strokeWidth="1.5" strokeDasharray="6 14" style={{ transformOrigin: 'center', animation: 'ringSpin 30s linear infinite' }} />
          <circle r="320" fill="none" stroke="url(#ringGrad2)" strokeWidth="1.5" strokeDasharray="2 18" style={{ transformOrigin: 'center', animation: 'ringSpin 50s linear infinite reverse' }} />
          <circle r="420" fill="none" stroke="url(#ringGrad3)" strokeWidth="1" strokeDasharray="10 30" style={{ transformOrigin: 'center', animation: 'ringSpin 70s linear infinite' }} />
          <circle r="6" fill="#fff" style={{ filter: 'drop-shadow(0 0 16px #22d3ee) drop-shadow(0 0 32px #a855f7)' }} />
        </g>
      </svg>
      <style>{`
        @keyframes ringSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Backdrop>
  );
}

/* Scene 3 — Symptoms: floating word fragments */
function BgSymptoms({ active }: { active: boolean }) {
  const words = [
    'headache', 'fatigue', 'fever', 'cough', 'nausea',
    'dyspnea', 'palpitations', 'edema', 'tachycardia',
    'hypertension', 'arrhythmia', 'paresthesia', 'syncope',
    'jaundice', 'malaise', 'lymphadenopathy', 'tinnitus',
  ];
  return (
    <Backdrop active={active}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${(i * 53) % 90 + 5}%`,
            top: `${(i * 37) % 85 + 7}%`,
            fontFamily: I,
            fontSize: `${0.7 + ((i % 4) * 0.18)}rem`,
            fontWeight: 400,
            color: i % 5 === 0 ? 'rgba(34, 211, 238, 0.65)' : 'rgba(255, 255, 255, 0.18)',
            opacity: 0.8,
            transform: `translate(-50%, -50%)`,
            animation: `wordFloat ${8 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.3) % 5}s`,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {w}
        </span>
      ))}
      <style>{`
        @keyframes wordFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); opacity: 0.4; }
          50%      { transform: translate(-50%, -50%) translateY(-10px); opacity: 0.85; }
        }
      `}</style>
    </Backdrop>
  );
}

/* Scene 4 — Imaging: scanning grid with sweeping beam */
function BgImaging({ active }: { active: boolean }) {
  return (
    <Backdrop active={active}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(34, 211, 238, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000, transparent 95%)',
        }}
      />
      {/* Sweeping beam */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '60%',
          background:
            'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.18), rgba(34, 211, 238, 0.06), transparent)',
          animation: 'scanSweep 6s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />
      {/* Heatmap pulse */}
      <div
        style={{
          position: 'absolute',
          left: '60%',
          top: '40%',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(236, 72, 153, 0.35), rgba(168, 85, 247, 0.18) 40%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'heatmapPulse 4s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes scanSweep {
          0%   { transform: translateX(-50%); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(220%); opacity: 0; }
        }
        @keyframes heatmapPulse {
          0%, 100% { transform: scale(0.9); opacity: 0.5; }
          50%      { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </Backdrop>
  );
}

/* Scene 5 — Labs: animated bar chart pattern */
function BgLabs({ active }: { active: boolean }) {
  const bars = Array.from({ length: 24 });
  return (
    <Backdrop active={active}>
      <div
        style={{
          position: 'absolute',
          inset: '20%',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          opacity: 0.45,
          maskImage: 'linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)',
        }}
      >
        {bars.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minHeight: 6,
              borderRadius: 3,
              background: `linear-gradient(to top, ${i % 3 === 0 ? '#10b981' : i % 5 === 0 ? '#f59e0b' : '#22d3ee'} 0%, transparent 100%)`,
              animation: `barPulse 3s ease-in-out infinite`,
              animationDelay: `${(i % 8) * 0.15}s`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes barPulse {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50%      { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </Backdrop>
  );
}

/* Scene 6 — Finale: convergent gradient */
function BgFinale({ active }: { active: boolean }) {
  return (
    <Backdrop active={active}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 30% 40%, rgba(34, 211, 238, 0.18), transparent 50%), radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.18), transparent 50%), radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.14), transparent 50%)',
          filter: 'blur(20px)',
          animation: 'finaleBreath 8s ease-in-out infinite alternate',
        }}
      />
      <style>{`
        @keyframes finaleBreath {
          from { transform: scale(1) rotate(0deg); }
          to   { transform: scale(1.05) rotate(2deg); }
        }
      `}</style>
    </Backdrop>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   BACKDROP MANAGER — fixed full-viewport, picks active scene
   ───────────────────────────────────────────────────────────────────── */

function BackdropManager({ active, show }: { active: SceneKey; show: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.9s cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    >
      {([['problem', BgProblem], ['approach', BgApproach], ['symptoms', BgSymptoms], ['imaging', BgImaging], ['labs', BgLabs], ['finale', BgFinale]] as const).map(([key, Bg]) => (
        <div key={key} style={{ display: 'contents' }} data-reel-paused={!show || active !== key || undefined}><Bg active={show && active === key} /></div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SCENE LAYOUT — uniform shell so spacing is balanced everywhere
   ───────────────────────────────────────────────────────────────────── */

interface SceneProps {
  id: string;
  scene: SceneKey;
  onActivate: (scene: SceneKey) => void;
  children: ReactNode;
}

function Scene({ id, scene, onActivate, children }: SceneProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            onActivate(scene);
          }
        });
      },
      { threshold: [0.5, 0.7] }
    );
    io.observe(el);
    // Set on the element, not in state: scrolling past a scene must not re-render it.
    const near = new IntersectionObserver(([e]) => el.toggleAttribute('data-reel-paused', !e.isIntersecting), { rootMargin: '20% 0px' });
    near.observe(el);
    return () => { io.disconnect(); near.disconnect(); };
  }, [scene, onActivate]);

  return (
    <section
      ref={ref}
      id={id}
      className="reel-scene"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1280, position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SCENE 1 — Problem (3 stats)
   ───────────────────────────────────────────────────────────────────── */

function SceneProblem({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleClr = isDark ? '#ffffff' : '#0a0a1a';
  const textClr = bodyInk(isDark);
  const eyeClr = ink('#ef4444', isDark);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.problem-eyebrow', {
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
        y: 24, opacity: 0, duration: 0.8, ease: 'expo.out',
      });
      gsap.from('.problem-headline > *', {
        scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
        y: 60, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out',
      });
      gsap.from('.problem-stat', {
        scrollTrigger: { trigger: ref.current, start: 'top 55%', once: true },
        y: 80, opacity: 0, scale: 0.92, duration: 1, stagger: 0.15, ease: 'power3.out',
      });
      gsap.from('.problem-fact', {
        scrollTrigger: { trigger: ref.current, start: 'top 50%', once: true },
        y: 30, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out',
      });
      gsap.from('.problem-quote', {
        scrollTrigger: { trigger: ref.current, start: 'top 45%', once: true },
        y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
      });

      // Animated counters
      document.querySelectorAll<HTMLElement>('.problem-counter').forEach((el) => {
        const to = parseFloat(el.dataset.to || '0');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 75%', once: true },
          onUpdate: () => {
            const isFloat = to % 1 !== 0;
            el.textContent = isFloat ? obj.v.toFixed(1) : Math.round(obj.v).toString();
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div
        data-lg="plate"
        className="problem-eyebrow inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
        style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: eyeClr }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: eyeClr, animation: 'errorPulse 2s ease-in-out infinite' }} />
        The problem
      </div>

      <div className="problem-headline mb-4">
        <h2 style={{ fontFamily: S, fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, color: titleClr, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          Diagnosis is slow.
        </h2>
        <h2 style={{ fontFamily: S, fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, color: titleClr, lineHeight: 1.05, letterSpacing: '-0.02em', opacity: 0.6 }}>
          Errors are routine.
        </h2>
      </div>

      <p data-lg="plate" className="mt-8 mb-16 mx-auto max-w-2xl px-7 py-5 rounded-2xl" style={{ fontFamily: I, fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', color: textClr, lineHeight: 1.7 }}>
        Clinicians work with incomplete signal. Reports sit in queues, scans get under-read,
        labs go uncorrelated. Patients wait — and the picture stays partial.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { num: '12', unit: 'days', label: 'median diagnostic delay' },
          { num: '1', sep: 'in', secondary: '7', label: 'diagnoses contain errors' },
          { num: '33', unit: '%', label: 'relevant data missed' },
        ].map((s, i) => (
          <div key={i} data-lg="plate" className="problem-stat p-8 rounded-2xl">
            <div className="flex items-baseline gap-3 justify-center" style={{ fontFamily: S, fontWeight: 900, color: titleClr, lineHeight: 1 }}>
              <span className="problem-counter" data-to={s.num} style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', background: `linear-gradient(135deg, ${eyeClr}, #f59e0b)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                0
              </span>
              {s.unit && <span style={{ fontSize: '1.6rem', color: textClr }}>{s.unit}</span>}
              {s.sep && (
                <>
                  <span style={{ fontSize: '1.2rem', color: textClr, fontFamily: I, fontWeight: 500, alignSelf: 'center' }}>{s.sep}</span>
                  <span className="problem-counter" data-to={s.secondary} style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', background: `linear-gradient(135deg, ${eyeClr}, #f59e0b)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>0</span>
                </>
              )}
            </div>
            <div className="mt-3" style={{ fontFamily: I, fontSize: '0.95rem', color: textClr, lineHeight: 1.5 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Supporting facts strip ───────────────────────────────── */}
      <div className="problem-facts mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {[
          { v: '$750B',  k: 'global yearly cost of dx errors (BMJ 2023)' },
          { v: '63%',    k: 'of clinical records carry a coding error' },
          { v: '×4',     k: 'mortality on delayed sepsis recognition' },
          { v: 'Top-5',  k: 'WHO-listed source of patient harm' },
        ].map((f, i) => (
          <div key={i} data-lg="plate" className="problem-fact text-left p-4 rounded-xl">
            <div style={{ fontFamily: S, fontSize: '1.4rem', fontWeight: 800, color: '#fb923c', lineHeight: 1, marginBottom: '0.55rem' }}>{f.v}</div>
            <div style={{ fontFamily: I, fontSize: '0.78rem', color: textClr, lineHeight: 1.5 }}>{f.k}</div>
          </div>
        ))}
      </div>

      {/* ── Pull quote ───────────────────────────────────────────── */}
      <blockquote data-lg="plate" className="problem-quote mx-auto mt-14 max-w-3xl text-left p-6 pl-8 rounded-2xl">
        <span aria-hidden className="absolute left-3 top-5 bottom-5 w-[3px] rounded-full" style={{ background: eyeClr }} />
        <p style={{ fontFamily: I, fontSize: 'clamp(1rem, 1.3vw, 1.15rem)', color: titleClr, lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.75rem' }}>
          "Misdiagnosis remains the single largest source of preventable harm in modern medicine — yet
          most of the signal a clinician needs to avoid it already exists in the patient's record. It
          just isn't being read together."
        </p>
        <footer style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: eyeClr }}>
          — Society to Improve Diagnosis in Medicine, 2024
        </footer>
      </blockquote>

      <div data-lg="plate" className="mt-16 mx-auto w-fit flex flex-col items-center gap-2 px-6 py-3 rounded-full" style={{ color: textClr }}>
        <span style={{ fontFamily: S, fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Scroll · the approach</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SCENE 2 — Approach (three lenses converge)
   ───────────────────────────────────────────────────────────────────── */

function SceneApproach({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleClr = isDark ? '#ffffff' : '#0a0a1a';
  const textClr = bodyInk(isDark);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.approach-eyebrow', {
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
        y: 24, opacity: 0, duration: 0.8, ease: 'expo.out',
      });
      gsap.from('.approach-headline', {
        scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
        y: 60, opacity: 0, duration: 1.1, ease: 'expo.out',
      });
      gsap.from('.approach-sub', {
        scrollTrigger: { trigger: ref.current, start: 'top 60%', once: true },
        y: 30, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out',
      });
      gsap.from('.approach-node', {
        scrollTrigger: { trigger: ref.current, start: 'top 55%', once: true },
        y: 40, opacity: 0, scale: 0.9, duration: 1, stagger: 0.18, ease: 'back.out(1.4)',
      });
      gsap.from('.approach-line', {
        scrollTrigger: { trigger: ref.current, start: 'top 55%', once: true },
        scaleX: 0, duration: 1.2, stagger: 0.18, ease: 'power3.inOut',
      });
      gsap.from('.approach-panel', {
        scrollTrigger: { trigger: ref.current, start: 'top 45%', once: true },
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      });
      gsap.from('.approach-bullet', {
        scrollTrigger: { trigger: ref.current, start: 'top 40%', once: true },
        y: 18, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const accents = {
    cyan: '#22d3ee',
    violet: '#a855f7',
    pink: '#ec4899',
  };
  const cyanInk = ink(accents.cyan, isDark);
  const lenses = [
    { icon: Brain, label: 'SYMPTOMS', sub: 'natural language', clr: accents.cyan },
    { icon: Microscope, label: 'IMAGING', sub: 'computer vision', clr: accents.violet },
    { icon: FlaskConical, label: 'LABS', sub: 'biomarker patterns', clr: accents.pink },
  ];

  return (
    <div ref={ref} className="text-center">
      <div
        data-lg="plate"
        className="approach-eyebrow inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
        style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: cyanInk }}
      >
        <Sparkles className="w-3 h-3" />
        Our approach
      </div>

      <h2 className="approach-headline" style={{ fontFamily: S, fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, color: titleClr, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
        Three signals.<br />
        <span style={{ background: 'linear-gradient(135deg, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          One synthesis.
        </span>
      </h2>

      <p data-lg="plate" className="approach-sub mt-8 mb-20 mx-auto max-w-2xl px-7 py-5 rounded-2xl" style={{ fontFamily: I, fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', color: textClr, lineHeight: 1.7 }}>
        Symptoms, imaging, and labs each tell a slice of the story. CuraSense
        reads all three and resolves them into one coherent assessment.
      </p>

      {/* Three lenses */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 max-w-4xl mx-auto">
        {lenses.map((l, i) => {
          const Ic = l.icon;
          return (
            <div key={i} className="approach-node flex flex-col items-center gap-4">
              <div
                className="relative flex items-center justify-center rounded-full"
                style={{
                  width: 120, height: 120,
                  background: `radial-gradient(circle, ${l.clr}22, transparent 70%)`,
                  border: `1.5px solid ${l.clr}66`,
                  boxShadow: `0 0 40px ${l.clr}33, inset 0 0 24px ${l.clr}22`,
                }}
              >
                <Ic className="w-12 h-12" style={{ color: l.clr, filter: `drop-shadow(0 0 10px ${l.clr})` }} />
                {/* Outer rotating ring */}
                <div
                  className="absolute"
                  style={{
                    inset: -10,
                    borderRadius: '50%',
                    border: `1px dashed ${l.clr}44`,
                    animation: 'ringSpin 24s linear infinite',
                  }}
                />
              </div>
              <div data-lg="plate" className="px-5 py-3 rounded-2xl">
                <div style={{ fontFamily: S, fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.3em', color: titleClr }}>
                  {l.label}
                </div>
                <div className="mt-1" style={{ fontFamily: I, fontSize: '0.8rem', color: textClr, fontStyle: 'italic' }}>
                  {l.sub}
                </div>
              </div>
              {/* Connector line to next */}
              {i < lenses.length - 1 && (
                <div
                  className="approach-line hidden md:block absolute top-[60px] h-[1px]"
                  style={{
                    left: `${33.33 * (i + 1) - 8}%`,
                    width: '16%',
                    background: `linear-gradient(90deg, ${l.clr}, ${lenses[i + 1].clr})`,
                    boxShadow: `0 0 8px ${l.clr}`,
                    transformOrigin: 'left center',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── How it differs panel ──────────────────────────────────── */}
      <div data-lg="plate" className="approach-panel mt-20 mx-auto max-w-5xl text-left p-7 md:p-9 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="md:max-w-md">
            <div style={{ fontFamily: S, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: cyanInk, marginBottom: '0.5rem' }}>
              How this differs
            </div>
            <h3 style={{ fontFamily: S, fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 900, color: titleClr, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Cross-modal synthesis, not parallel scoring.
            </h3>
            <p className="mt-4" style={{ fontFamily: I, fontSize: '0.95rem', color: textClr, lineHeight: 1.7 }}>
              Most systems run separate models for each input type and stack the scores. CuraSense lets the
              modalities <em>condition</em> each other — a flag in the lab panel changes how the imaging
              model weighs equivocal regions; a phrase in the history changes how an HbA1c reading is read.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {[
              { t: 'Joint reasoning', d: 'cross-attention between modalities, not score averaging' },
              { t: 'Cited outputs',   d: 'every claim links to the source token / region / value' },
              { t: 'Temporal aware',  d: 'reads patient timeline as context, not a snapshot' },
              { t: 'Reversible',      d: 'edit any input, watch the assessment update live' },
            ].map((b, i) => (
              <li key={i} data-lg="inset" className="approach-bullet p-3.5 rounded-xl">
                <div style={{ fontFamily: S, fontSize: '0.78rem', fontWeight: 800, color: titleClr, letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                  {b.t}
                </div>
                <div style={{ fontFamily: I, fontSize: '0.78rem', color: textClr, lineHeight: 1.5 }}>
                  {b.d}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SCENE 3 — Symptoms (NLP)
   ───────────────────────────────────────────────────────────────────── */

function SceneSymptoms({ isDark }: { isDark: boolean }) {
  return (
    <SceneTemplate
      isDark={isDark}
      number="01"
      eyebrow="Symptoms · Natural language"
      eyebrowClr="#22d3ee"
      title={<>Read the patient.<br /><span style={{ color: ink('#22d3ee', isDark) }}>Word by word.</span></>}
      desc={
        <>
          <p>
            Free-text histories, intake forms, clinician notes, after-visit summaries — all parsed
            into <strong>clinical entities</strong>, severity, duration, anatomical location, and
            negation. Nothing has to be coded ahead of time. The model reads what was actually written.
          </p>
          <p className="mt-3">
            Output is structured, traceable, and auditable: every extracted entity links back to
            the exact span in the source text it came from.
          </p>
        </>
      }
      bullets={[
        { t: 'Entity recognition', d: 'symptoms · duration · severity · negation · location' },
        { t: 'Codified output',    d: 'auto-mapped to ICD-10, SNOMED-CT, and LOINC' },
        { t: 'Timeline aware',     d: 'reads onset / progression / resolution as one sequence' },
        { t: 'Traceable',          d: 'every claim cites the exact source span' },
      ]}
      stats={[
        { v: '128k tok',  k: 'context window' },
        { v: '40+ langs', k: 'multilingual intake' },
        { v: '0.91 F1',   k: 'on i2b2 entity recognition' },
      ]}
      demo={<DemoNLP />}
    />
  );
}

function DemoNLP() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.nlp-tag', {
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        opacity: 0, y: 14, duration: 0.6, stagger: 0.12, ease: 'power3.out', delay: 0.4,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl p-6 backdrop-blur-md" style={{ background: '#0a0e1a', border: '1px solid rgba(34, 211, 238, 0.18)', fontFamily: I }}>
      <div style={{ fontFamily: S, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase' }}>
        Patient intake (verbatim)
      </div>
      <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>
        "I've had a <Tag color="#22d3ee">persistent headache</Tag> for{' '}
        <Tag color="#a855f7">about six days</Tag>, mostly{' '}
        <Tag color="#22d3ee">behind my eyes</Tag>, with{' '}
        <Tag color="#ec4899">mild nausea</Tag> in the mornings and some{' '}
        <Tag color="#22d3ee">sensitivity to light</Tag>."
      </p>
      <div className="flex flex-wrap gap-2">
        {[
          { t: 'symptom · headache', c: '#22d3ee' },
          { t: 'duration · 6d', c: '#a855f7' },
          { t: 'location · retro-orbital', c: '#22d3ee' },
          { t: 'symptom · nausea', c: '#ec4899' },
          { t: 'symptom · photophobia', c: '#22d3ee' },
        ].map((x, i) => (
          <span
            key={i}
            className="nlp-tag inline-flex items-center px-2.5 py-1 rounded-md"
            style={{ fontFamily: S, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: x.c, background: `${x.c}15`, border: `1px solid ${x.c}44` }}
          >
            {x.t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Tag({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        background: `${color}22`,
        borderBottom: `1px solid ${color}88`,
        padding: '1px 4px',
        borderRadius: '2px',
        color,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SCENE 4 — Imaging (Vision)
   ───────────────────────────────────────────────────────────────────── */

function SceneImaging({ isDark }: { isDark: boolean }) {
  return (
    <SceneTemplate
      isDark={isDark}
      number="02"
      eyebrow="Imaging · Vision"
      eyebrowClr="#a855f7"
      title={<>See what radiologists see.<br /><span style={{ color: ink('#a855f7', isDark) }}>Surface what they might miss.</span></>}
      desc={
        <>
          <p>
            X-ray, CT, MRI, ultrasound, dermatology, retinal fundus. Drop a single study or a stack
            of 20 — the model returns <strong>region-of-interest annotations</strong> with confidence
            scores, differential reasoning, and references to comparable cases.
          </p>
          <p className="mt-3">
            It augments a radiologist's read; it doesn't replace it. Every flagged region is
            outlined and explained in plain language so the clinician can confirm or override.
          </p>
        </>
      }
      bullets={[
        { t: 'Multi-modality',       d: 'X-ray · CT · MRI · US · derm · fundus · DICOM-aware' },
        { t: 'ROI localization',     d: 'bounding boxes + heatmaps with calibrated confidence' },
        { t: 'Multi-file ingest',    d: 'compare priors automatically — change-over-time analysis' },
        { t: 'Differential reasoning', d: 'top-3 candidate findings with rule-out logic' },
      ]}
      stats={[
        { v: '0.94 AUC', k: 'on CheXpert-equivalent benchmark' },
        { v: '< 4 sec',  k: 'per single-frame inference' },
        { v: '20 files', k: 'parallel study upload' },
      ]}
      demo={<DemoImaging />}
      reverse
    />
  );
}

function DemoImaging() {
  return (
    <div className="rounded-2xl p-6 backdrop-blur-md" style={{ background: '#0e0a1a', border: '1px solid rgba(168, 85, 247, 0.18)', fontFamily: I }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontFamily: S, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Chest X-ray · PA view
        </span>
        <span className="px-2 py-0.5 rounded-md" style={{ fontFamily: S, fontSize: '0.6rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
          ANALYZED
        </span>
      </div>
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4" style={{ background: 'linear-gradient(135deg, #1a1828, #0d0d18)' }}>
        {/* Faux ribs */}
        <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          {[60, 90, 120, 150, 180, 210].map((y) => (
            <path key={y} d={`M 60 ${y} Q 200 ${y - 30} 340 ${y}`} stroke="#a8a8c8" strokeWidth="1.5" fill="none" />
          ))}
          <ellipse cx="160" cy="160" rx="65" ry="90" stroke="#a8a8c8" strokeWidth="1.5" fill="none" opacity="0.5" />
          <ellipse cx="240" cy="160" rx="65" ry="90" stroke="#a8a8c8" strokeWidth="1.5" fill="none" opacity="0.5" />
        </svg>
        {/* Heatmap region */}
        <div
          style={{
            position: 'absolute',
            top: '38%', left: '52%',
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6), rgba(236, 72, 153, 0.2) 40%, transparent 70%)',
            filter: 'blur(8px)',
            animation: 'heatmapPulse 2.6s ease-in-out infinite',
          }}
        />
        {/* Bounding box */}
        <div
          style={{
            position: 'absolute',
            top: '36%', left: '50%',
            width: 88, height: 88,
            border: '1.5px solid #ec4899',
            borderRadius: 4,
            boxShadow: '0 0 16px rgba(236, 72, 153, 0.6)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 'calc(36% + 92px)', left: '50%',
            fontFamily: S, fontSize: '0.6rem', fontWeight: 700, color: '#ec4899', letterSpacing: '0.1em',
            background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: 3, backdropFilter: 'blur(6px)',
          }}
        >
          ROI · 0.87
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { t: 'opacity · right mid-zone', c: '#ec4899' },
          { t: 'consider · pneumonia r/o', c: '#a855f7' },
          { t: 'no acute cardiomegaly', c: '#10b981' },
        ].map((x, i) => (
          <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md" style={{ fontFamily: S, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: x.c, background: `${x.c}15`, border: `1px solid ${x.c}44` }}>
            {x.t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SCENE 5 — Labs (biomarkers)
   ───────────────────────────────────────────────────────────────────── */

function SceneLabs({ isDark }: { isDark: boolean }) {
  return (
    <SceneTemplate
      isDark={isDark}
      number="03"
      eyebrow="Labs · Biomarker patterns"
      eyebrowClr="#ec4899"
      title={<>Numbers. In context.<br /><span style={{ color: ink('#ec4899', isDark) }}>Across panels.</span></>}
      desc={
        <>
          <p>
            CBC, lipid, HbA1c, comprehensive metabolic, liver, kidney, thyroid, iron, vitamin —
            values are normalized to <strong>patient-specific reference ranges</strong> (age, sex,
            ancestry, pregnancy, comorbidities) instead of one-size-fits-all bands.
          </p>
          <p className="mt-3">
            Then cross-panel pattern recognition kicks in: insulin-resistance signatures,
            inflammatory cascades, micronutrient deficiency clusters, early kidney decline
            patterns — surfaced before any single value is "out of range."
          </p>
        </>
      }
      bullets={[
        { t: 'Personalized ranges', d: 'age · sex · pregnancy · ancestry-aware reference bands' },
        { t: 'Cross-panel patterns', d: 'detects clusters that single markers would miss' },
        { t: 'Trend analysis',       d: 'compares against prior labs to flag drift early' },
        { t: 'Interaction-aware',    d: 'considers active medications + supplements' },
      ]}
      stats={[
        { v: '14k+',     k: 'biomarkers in scope' },
        { v: '120+',     k: 'pattern signatures recognized' },
        { v: '6 panels', k: 'cross-correlated per assessment' },
      ]}
      demo={<DemoLabs />}
    />
  );
}

function DemoLabs() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.lab-row', {
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        opacity: 0, x: -20, duration: 0.7, stagger: 0.1, ease: 'expo.out', delay: 0.3,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const rows = [
    { name: 'HbA1c',          val: 8.2, unit: '%',     min: 4.0, max: 5.6, status: 'high'   as const, clr: '#ef4444' },
    { name: 'LDL Cholesterol', val: 165, unit: 'mg/dL', min: 0,   max: 100, status: 'high'   as const, clr: '#f59e0b' },
    { name: 'HDL Cholesterol', val: 35,  unit: 'mg/dL', min: 40,  max: 90,  status: 'low'    as const, clr: '#f59e0b' },
    { name: 'Fasting Glucose', val: 165, unit: 'mg/dL', min: 70,  max: 100, status: 'high'   as const, clr: '#ef4444' },
    { name: 'Hemoglobin',      val: 14.2, unit: 'g/dL', min: 13,  max: 17,  status: 'normal' as const, clr: '#10b981' },
  ];

  return (
    <div ref={ref} className="rounded-2xl p-6 backdrop-blur-md" style={{ background: '#1a0a12', border: '1px solid rgba(236, 72, 153, 0.18)', fontFamily: I }}>
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontFamily: S, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Lab panel · 5 of 14 markers
        </span>
        <span className="px-2 py-0.5 rounded-md" style={{ fontFamily: S, fontSize: '0.6rem', fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
          PATTERN: PRE-DIABETIC + DYSLIPIDEMIA
        </span>
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => {
          const span = Math.max(1, r.max - r.min);
          const visMin = r.min - span * 0.5;
          const visMax = r.max + span * 0.5;
          const pct = Math.max(0, Math.min(100, ((r.val - visMin) / (visMax - visMin)) * 100));
          const nMin = ((r.min - visMin) / (visMax - visMin)) * 100;
          const nMax = ((r.max - visMin) / (visMax - visMin)) * 100;
          return (
            <div key={i} className="lab-row p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-baseline justify-between mb-2">
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{r.name}</span>
                <span style={{ fontFamily: S, fontWeight: 700, color: r.clr, fontSize: '1.05rem' }}>{r.val} <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{r.unit}</span></span>
              </div>
              <div className="relative h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="absolute h-full rounded-full" style={{ left: `${nMin}%`, width: `${nMax - nMin}%`, background: 'rgba(16,185,129,0.35)' }} />
                <div
                  className="absolute top-1/2 w-2.5 h-2.5 rounded-full -translate-y-1/2"
                  style={{ left: `${pct}%`, background: r.clr, boxShadow: `0 0 10px ${r.clr}, 0 0 0 2px rgba(0,0,0,0.5)` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SHARED — split layout for lens scenes
   ───────────────────────────────────────────────────────────────────── */

interface TplBullet { t: string; d: string; }
interface TplStat   { v: string; k: string; }

function SceneTemplate({
  isDark, number, eyebrow, eyebrowClr, title, desc, demo, reverse, bullets, stats,
}: {
  isDark: boolean; number: string; eyebrow: string; eyebrowClr: string;
  title: ReactNode; desc: ReactNode; demo: ReactNode; reverse?: boolean;
  bullets?: TplBullet[]; stats?: TplStat[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleClr = isDark ? '#ffffff' : '#0a0a1a';
  const textClr = bodyInk(isDark);
  const accent = ink(eyebrowClr, isDark);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.tpl-number', { scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true }, opacity: 0, x: -40, duration: 0.9, ease: 'expo.out', delay: 0.1 });
      gsap.from('.tpl-title', { scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true }, opacity: 0, y: 50, duration: 1, ease: 'expo.out', delay: 0.2 });
      gsap.from('.tpl-desc', { scrollTrigger: { trigger: ref.current, start: 'top 60%', once: true }, opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', delay: 0.35 });
      gsap.from('.tpl-demo', { scrollTrigger: { trigger: ref.current, start: 'top 60%', once: true }, opacity: 0, y: 50, scale: 0.96, duration: 1.1, ease: 'expo.out', delay: 0.4 });
      gsap.from('.tpl-bullet', { scrollTrigger: { trigger: ref.current, start: 'top 55%', once: true }, opacity: 0, y: 18, duration: 0.7, stagger: 0.07, ease: 'power3.out', delay: 0.5 });
      gsap.from('.tpl-stat',   { scrollTrigger: { trigger: ref.current, start: 'top 50%', once: true }, opacity: 0, y: 20, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.55 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
      <div className={reverse ? 'lg:col-start-2' : ''}>
        <div data-lg="plate" className="tpl-number mb-4 w-fit px-4 py-1.5 rounded-full" style={{ fontFamily: S, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5em', color: accent }}>
          {number} ·  {eyebrow}
        </div>
        <h2 className="tpl-title" style={{ fontFamily: S, fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', fontWeight: 900, color: titleClr, lineHeight: 1.1, letterSpacing: '-0.015em', marginBottom: '1.5rem' }}>
          {title}
        </h2>
        <div data-lg="plate" className="tpl-desc px-6 py-5 rounded-2xl" style={{ fontFamily: I, fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', color: textClr, lineHeight: 1.75, maxWidth: 540 }}>
          {desc}
        </div>

        {bullets && bullets.length > 0 && (
          <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl">
            {bullets.map((b, i) => (
              <li key={i} data-lg="plate" className="tpl-bullet p-3 rounded-xl">
                <div style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 800, color: titleClr, letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                  {b.t}
                </div>
                <div style={{ fontFamily: I, fontSize: '0.78rem', color: textClr, lineHeight: 1.5 }}>
                  {b.d}
                </div>
              </li>
            ))}
          </ul>
        )}

        {stats && stats.length > 0 && (
          <div data-lg="plate" className="mt-7 flex flex-wrap gap-x-7 gap-y-3 w-fit px-6 py-4 rounded-2xl">
            {stats.map((s, i) => (
              <div key={i} className="tpl-stat">
                <div style={{ fontFamily: S, fontSize: '1.4rem', fontWeight: 800, color: accent, lineHeight: 1 }}>
                  {s.v}
                </div>
                <div className="mt-1" style={{ fontFamily: S, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: textClr }}>
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={`tpl-demo ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
        {demo}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SCENE 6 — Finale + CTA
   ───────────────────────────────────────────────────────────────────── */

function SceneFinale({ isDark, onPrimaryCta }: { isDark: boolean; onPrimaryCta?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleClr = isDark ? '#ffffff' : '#0a0a1a';
  const textClr = bodyInk(isDark);
  const cyanInk = ink('#22d3ee', isDark);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.fin-eyebrow', { scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true }, opacity: 0, y: 16, duration: 0.7, ease: 'expo.out' });
      gsap.from('.fin-title > *', { scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true }, opacity: 0, y: 60, duration: 1.1, stagger: 0.08, ease: 'expo.out' });
      gsap.from('.fin-desc', { scrollTrigger: { trigger: ref.current, start: 'top 60%', once: true }, opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', delay: 0.4 });
      gsap.from('.fin-step', { scrollTrigger: { trigger: ref.current, start: 'top 55%', once: true }, opacity: 0, y: 40, duration: 0.9, stagger: 0.13, ease: 'power3.out', delay: 0.4 });
      gsap.from('.fin-pillar', { scrollTrigger: { trigger: ref.current, start: 'top 50%', once: true }, opacity: 0, y: 24, duration: 0.7, stagger: 0.06, ease: 'power3.out', delay: 0.55 });
      gsap.from('.fin-stat', { scrollTrigger: { trigger: ref.current, start: 'top 45%', once: true }, opacity: 0, y: 30, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.6 });
      gsap.from('.fin-cta', { scrollTrigger: { trigger: ref.current, start: 'top 55%', once: true }, opacity: 0, y: 40, scale: 0.95, duration: 1.1, ease: 'back.out(1.4)', delay: 0.7 });
    }, ref);
    return () => ctx.revert();
  }, []);

  const stats = [
    { val: 'seconds', label: 'time-to-assessment' },
    { val: '3 lenses', label: 'reasoned across' },
    { val: 'demo', label: 'no clinical use' },
  ];

  return (
    <div ref={ref} className="text-center">
      <div
        data-lg="plate"
        className="fin-eyebrow inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
        style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: cyanInk }}
      >
        <Sparkles className="w-3 h-3" />
        Synthesis
      </div>

      <div className="fin-title">
        <h2 style={{ fontFamily: S, fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 900, color: titleClr, lineHeight: 1.0, letterSpacing: '-0.02em' }}>
          From signal to
        </h2>
        <h2 style={{ fontFamily: S, fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.02em' }}>
          <span style={{ background: 'linear-gradient(135deg, #22d3ee, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            clinical clarity.
          </span>
        </h2>
      </div>

      <p data-lg="plate" className="fin-desc mt-8 mx-auto max-w-2xl px-7 py-5 rounded-2xl" style={{ fontFamily: I, fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', color: textClr, lineHeight: 1.7 }}>
        Three signals reasoned together — written history, imaging, and labs —
        resolved into a single citation-backed assessment a clinician can audit
        line by line. Built as an educational demo, not a medical device.
      </p>

      {/* ── Three-step recap ───────────────────────────────────────── */}
      <div className="fin-recap relative mt-14 mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
        {[
          { n: '01', t: 'Drop your inputs',  d: 'Notes, scan files, lab CSV/PDF — single panel, drag to drop.' },
          { n: '02', t: 'Cross-modal read',  d: 'Each modality conditions the others. Reasoning is joint, not parallel.' },
          { n: '03', t: 'Auditable output',  d: 'Plain-language summary, every claim cited to source, exportable.' },
        ].map((s, i) => (
          <div key={i} data-lg="plate" className="fin-step text-left p-5 rounded-2xl">
            <div style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.4em', color: cyanInk, marginBottom: '0.5rem' }}>{s.n}</div>
            <div style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 800, color: titleClr, lineHeight: 1.2, marginBottom: '0.5rem' }}>{s.t}</div>
            <div style={{ fontFamily: I, fontSize: '0.85rem', color: textClr, lineHeight: 1.6 }}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* ── Feature pillars row ────────────────────────────────────── */}
      <div className="fin-pillars mb-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {[
          { t: 'Cited',       d: 'every claim links to a source span' },
          { t: 'Editable',    d: 'change an input, output updates live' },
          { t: 'Multilingual', d: '40+ languages of free-text intake' },
          { t: 'Exportable',  d: 'JSON · PDF · FHIR R4 bundle' },
        ].map((p, i) => (
          <div key={i} data-lg="plate" className="fin-pillar text-left p-3.5 rounded-xl">
            <div style={{ fontFamily: S, fontSize: '0.78rem', fontWeight: 800, color: titleClr, letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              {p.t}
            </div>
            <div style={{ fontFamily: I, fontSize: '0.75rem', color: textClr, lineHeight: 1.5 }}>
              {p.d}
            </div>
          </div>
        ))}
      </div>

      {/* ── Original key stats row ─────────────────────────────────── */}
      <div data-lg="plate" className="grid grid-cols-3 gap-6 mb-14 max-w-2xl mx-auto px-6 py-5 rounded-2xl">
        {stats.map((s, i) => (
          <div key={i} className="fin-stat text-center">
            <div style={{ fontFamily: S, fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 800, color: titleClr, letterSpacing: '0.02em' }}>
              {s.val}
            </div>
            <div className="mt-2" style={{ fontFamily: S, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: textClr }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onPrimaryCta}
        className="fin-cta group relative inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold transition hover:scale-[1.03] active:scale-[0.97]"
        style={{
          fontFamily: I, fontSize: '1rem',
          background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
          color: '#fff',
          boxShadow: '0 12px 40px rgba(168, 85, 247, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Sign in to try the demo
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>

      <div data-lg="plate" className="mt-6 mx-auto w-fit px-6 py-3 rounded-2xl text-center" style={{ fontFamily: I, fontSize: '0.78rem', color: textClr, lineHeight: 1.7 }}>
        Not a medical device · educational preview only · all output for research and discussion<br />
        © CuraSense {new Date().getFullYear()} — built with React, Three.js, and a healthy respect for clinicians
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   ROOT — wires backdrop manager + scenes
   ───────────────────────────────────────────────────────────────────── */

export default function NarrativeReel({ onPrimaryCta, isDark }: NarrativeReelProps) {
  const [active, setActive] = useState<SceneKey>('problem');
  // the backdrops are fixed to the viewport: keep the Problem scene's red dots off the hero above the reel
  const root = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: '0px 0px -40% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Refresh ScrollTrigger on mount + after layout settles
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={root}
      className="narrative-reel relative"
      style={{
        scrollSnapType: 'y proximity',
      }}
    >
      <BackdropManager active={active} show={onScreen} />

      <Scene id="reel-problem"   scene="problem"   onActivate={setActive}><SceneProblem  isDark={isDark} /></Scene>
      <Scene id="reel-approach"  scene="approach"  onActivate={setActive}><SceneApproach isDark={isDark} /></Scene>
      <Scene id="reel-symptoms"  scene="symptoms"  onActivate={setActive}><SceneSymptoms isDark={isDark} /></Scene>
      <Scene id="reel-imaging"   scene="imaging"   onActivate={setActive}><SceneImaging  isDark={isDark} /></Scene>
      <Scene id="reel-labs"      scene="labs"      onActivate={setActive}><SceneLabs     isDark={isDark} /></Scene>
      <Scene id="reel-finale"    scene="finale"    onActivate={setActive}><SceneFinale   isDark={isDark} onPrimaryCta={onPrimaryCta} /></Scene>
    </div>
  );
}
