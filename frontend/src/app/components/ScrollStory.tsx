/* ═══════════════════════════════════════════════════════
   CuraSense — Scroll Narrative
   ───────────────────────────────────────────────────────
   A pinned scrollytelling section. The user scrolls, the
   scene changes, a caption explains what's happening.

   HOW IT WORKS
     • The outer <section> reserves SCENES.length × 100vh
       of vertical scroll space — that's the "reel".
     • The inner panel is sticky-pinned to the viewport
       for the entire span, so it appears stationary while
       scroll progress drives the animation.
     • A single GSAP timeline scrubs by scroll position.
       Each scene gets a window of the timeline:
         scene i  →  timeline label `scene-${i}`
       For each scene we cross-fade IN, hold, cross-fade OUT
       both the caption block and the corresponding visual.
     • A vertical rail on the right shows scene progress —
       active dot pulses in the scene's accent color.
     • Scrolling up reverses everything (scrub is bidirectional).

   WHY THIS PATTERN
     Scrub timelines + pinning is the canonical "scrollytelling"
     pattern used by peachweb, Apple, Stripe. It keeps the user
     anchored on a fixed visual stage while scroll drives time.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type GlyphKind = 'pulse' | 'mesh' | 'gauge' | 'timeline';

interface Scene {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  glyph: GlyphKind;
}

const SCENES: Scene[] = [
  {
    id: '01',
    eyebrow: 'Step One — Capture',
    title: 'You describe how you feel.',
    body: 'Type symptoms in plain language — fever, fatigue, chest tightness. CuraSense parses every word against a 12,000-node medical knowledge graph in real time.',
    accent: 'var(--accent-cyan)',
    glyph: 'pulse',
  },
  {
    id: '02',
    eyebrow: 'Step Two — Reason',
    title: 'AI weighs every signal.',
    body: 'Neural ensembles cross-reference your symptoms against age, history, and millions of clinical patterns. Confidence is computed live, never after the fact.',
    accent: 'var(--accent-violet)',
    glyph: 'mesh',
  },
  {
    id: '03',
    eyebrow: 'Step Three — Resolve',
    title: 'A diagnosis emerges.',
    body: 'You receive a ranked list with confidence scores, severity bands, and recommended next steps. Every prediction is explainable — never a black box.',
    accent: '#ec4899',
    glyph: 'gauge',
  },
  {
    id: '04',
    eyebrow: 'Step Four — Remember',
    title: 'Your timeline builds itself.',
    body: 'Every analysis lands in a personal history. Patterns surface. Your future doctor visits start informed — months of context already on file.',
    accent: '#10b981',
    glyph: 'timeline',
  },
];

/* ── Glyphs ──
   Each scene has a unique SVG illustration. They share the same
   bounding box and are stacked so cross-fades line up perfectly. */
function Glyph({ kind, accent }: { kind: GlyphKind; accent: string }) {
  switch (kind) {
    case 'pulse':
      // EKG line — strokeDashoffset will be animated by scene tween
      return (
        <svg viewBox="0 0 400 200" className="w-full h-full" aria-hidden>
          <defs>
            <linearGradient id="g-pulse" x1="0" x2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0" />
              <stop offset="50%" stopColor={accent} stopOpacity="1" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="100" x2="400" y2="100" stroke={accent} strokeOpacity="0.15" strokeWidth="1" />
          <path
            data-pulse-path
            d="M0 100 L80 100 L100 60 L120 140 L140 100 L240 100 L260 30 L280 170 L300 100 L400 100"
            stroke="url(#g-pulse)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'mesh':
      // 5×5 neural lattice — opacity per node animated per scene
      return (
        <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden>
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 5 }).map((_, c) => {
              const x = 60 + c * 70;
              const y = 60 + r * 70;
              return (
                <g key={`${r}-${c}`}>
                  {c < 4 && (
                    <line x1={x} y1={y} x2={x + 70} y2={y} stroke={accent} strokeOpacity="0.25" strokeWidth="1" />
                  )}
                  {r < 4 && (
                    <line x1={x} y1={y} x2={x} y2={y + 70} stroke={accent} strokeOpacity="0.25" strokeWidth="1" />
                  )}
                  {c < 4 && r < 4 && (
                    <line x1={x} y1={y} x2={x + 70} y2={y + 70} stroke={accent} strokeOpacity="0.1" strokeWidth="1" />
                  )}
                  <circle cx={x} cy={y} r={(r + c) % 3 === 0 ? 5 : 3} fill={accent} />
                </g>
              );
            })
          )}
        </svg>
      );

    case 'gauge':
      // Circular confidence ring — strokeDashoffset animates
      return (
        <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden>
          <circle cx="200" cy="200" r="150" stroke={accent} strokeOpacity="0.1" strokeWidth="22" fill="none" />
          <circle
            data-gauge-ring
            cx="200"
            cy="200"
            r="150"
            stroke={accent}
            strokeWidth="22"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 150}
            strokeDashoffset={2 * Math.PI * 150}
            transform="rotate(-90 200 200)"
            style={{ filter: `drop-shadow(0 0 20px ${accent})` }}
          />
          <text
            x="200"
            y="195"
            textAnchor="middle"
            fill="currentColor"
            style={{ fontFamily: "'Michroma', sans-serif", fontSize: 64, fontWeight: 700 }}
          >
            94
          </text>
          <text
            x="200"
            y="240"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.5"
            style={{ fontSize: 14, letterSpacing: 6 }}
          >
            CONFIDENCE
          </text>
        </svg>
      );

    case 'timeline':
      // Stacked horizontal cards — each rect's width animates
      return (
        <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} data-tl-row data-tl-index={i}>
              <rect
                x="40"
                y={70 + i * 56}
                width="320"
                height="38"
                rx="10"
                fill={accent}
                fillOpacity="0.08"
                stroke={accent}
                strokeOpacity="0.25"
                strokeWidth="1"
              />
              <rect
                x="40"
                y={70 + i * 56}
                width={120 + i * 36}
                height="38"
                rx="10"
                fill={accent}
                fillOpacity={0.18 + i * 0.08}
              />
              <circle cx="60" cy={89 + i * 56} r="6" fill={accent} />
            </g>
          ))}
        </svg>
      );
  }
}

export default function ScrollStory() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const captionsRef = useRef<HTMLDivElement | null>(null);
  const visualsRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const sticky = stickyRef.current;
    const captionsEl = captionsRef.current;
    const visualsEl = visualsRef.current;
    const railEl = railRef.current;
    const bgEl = bgRef.current;
    if (!root || !sticky || !captionsEl || !visualsEl || !railEl || !bgEl) return;

    const ctx = gsap.context(() => {
      const captions = gsap.utils.toArray<HTMLElement>('[data-caption]', captionsEl);
      const visuals = gsap.utils.toArray<HTMLElement>('[data-visual]', visualsEl);
      const dots = gsap.utils.toArray<HTMLElement>('[data-dot]', railEl);

      // Bail if any of the layered arrays are empty — without this guard
      // every rAF tick of the scrub timeline pushes a "GSAP target not
      // found" warning, which is what was flooding the console.
      if (!captions.length || !visuals.length) return;

      // Initial state — all hidden except scene 0
      gsap.set(captions, { opacity: 0, y: 40 });
      gsap.set(visuals, { opacity: 0, scale: 0.9, rotate: -2, filter: 'blur(8px)' });
      gsap.set(captions[0], { opacity: 1, y: 0 });
      gsap.set(visuals[0], { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' });

      /* ── MASTER SCRUB TIMELINE ──
         The trigger pins the sticky panel and gives us
         SCENES.length × 100% of scroll to play with.
         scrub: 0.6 adds inertia so transitions feel fluid
         instead of frame-locked. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${root.offsetHeight - window.innerHeight}`,
          pin: sticky,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Each scene occupies one "unit" on the timeline.
      // Transition windows live BETWEEN units (i + 0.65 → i + 1).
      SCENES.forEach((scene, i) => {
        if (i === SCENES.length - 1) return; // no outgoing for last scene

        // Outgoing caption + visual for scene i
        tl.to(
          captions[i],
          { opacity: 0, y: -40, duration: 0.4 },
          i + 0.65
        ).to(
          visuals[i],
          { opacity: 0, scale: 1.08, rotate: 2, filter: 'blur(8px)', duration: 0.4 },
          i + 0.65
        );

        // Incoming caption + visual for scene i+1
        tl.fromTo(
          captions[i + 1],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.4 },
          i + 0.7
        ).fromTo(
          visuals[i + 1],
          { opacity: 0, scale: 0.92, rotate: -2, filter: 'blur(8px)' },
          { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)', duration: 0.4 },
          i + 0.7
        );

        // Background accent shift — uses CSS var on the bg element
        tl.to(
          bgEl,
          {
            '--story-accent': SCENES[i + 1].accent,
            duration: 0.4,
            ease: 'none',
          } as gsap.TweenVars,
          i + 0.7
        );
      });

      /* ── PROGRESS RAIL ──
         Independent ScrollTrigger that snaps the active dot
         to whichever scene window the user is in. This is
         decoupled from the master timeline so the dot never
         lags behind the caption swap. */
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${root.offsetHeight - window.innerHeight}`,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(
            SCENES.length - 1,
            Math.floor(self.progress * SCENES.length + 0.001)
          );
          dots.forEach((d, i) => {
            gsap.to(d, {
              backgroundColor: i === idx ? SCENES[idx].accent : 'rgba(255,255,255,0.18)',
              scale: i === idx ? 1.6 : 1,
              boxShadow: i === idx ? `0 0 18px ${SCENES[idx].accent}` : '0 0 0 rgba(0,0,0,0)',
              duration: 0.35,
              overwrite: 'auto',
            });
          });
        },
      });

      /* ── PER-SCENE MICRO-ANIMATIONS ──
         Tied to each visual element so they "come alive"
         when their scene is active. Loop in place. */
      // Pulse: draw the EKG line on a loop
      const pulsePath = visualsEl.querySelector<SVGPathElement>('[data-pulse-path]');
      if (pulsePath) {
        const len = pulsePath.getTotalLength();
        gsap.set(pulsePath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(pulsePath, {
          strokeDashoffset: 0,
          duration: 2.4,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // Mesh: pulse opacity of dots in waves
      const meshDots = visualsEl.querySelectorAll('[data-visual="1"] circle');
      gsap.to(meshDots, {
        opacity: 0.3,
        duration: 1.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.04, from: 'random' },
      });

      // Gauge: fill ring on a loop
      const gaugeRing = visualsEl.querySelector<SVGCircleElement>('[data-gauge-ring]');
      if (gaugeRing) {
        const circumference = 2 * Math.PI * 150;
        gsap.to(gaugeRing, {
          strokeDashoffset: circumference * 0.06, // 94% filled
          duration: 2.2,
          ease: 'expo.out',
          repeat: -1,
          yoyo: true,
          yoyoEase: 'expo.in',
        });
      }

      // Timeline: width pulse on rows in sequence
      const tlRows = visualsEl.querySelectorAll('[data-tl-row] rect:nth-child(2)');
      gsap.fromTo(
        tlRows,
        { scaleX: 0.4, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.6,
          ease: 'expo.out',
          repeat: -1,
          yoyo: true,
          stagger: 0.15,
        }
      );
    }, root);

    // Recalc on resize so pin spans recompute
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full"
      style={{ height: `${SCENES.length * 100}vh` }}
      aria-label="How CuraSense works"
    >
      {/* ── PINNED STAGE ──
          Stays fixed in viewport while the section scrolls past.
          Everything visual lives inside this. */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* Animated radial backdrop — accent CSS var is tweened by GSAP */}
        <div
          ref={bgRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            ['--story-accent' as string]: SCENES[0].accent,
            background:
              'radial-gradient(60% 50% at 25% 50%, color-mix(in srgb, var(--story-accent) 22%, transparent), transparent 70%), radial-gradient(40% 40% at 80% 70%, color-mix(in srgb, var(--story-accent) 14%, transparent), transparent 70%)',
            transition: 'background 0.4s ease',
          }}
        />

        {/* Subtle grid — gives a "lab" depth */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
          {/* ── CAPTION COLUMN ──
              All four captions live here, absolutely stacked.
              GSAP cross-fades between them on scroll. */}
          <div className="relative min-h-[420px]">
            <div ref={captionsRef} className="absolute inset-0 flex flex-col justify-center">
              {SCENES.map((scene, i) => (
                <div
                  key={scene.id}
                  data-caption
                  data-caption-index={i}
                  className="absolute inset-0 flex flex-col justify-center will-change-transform"
                >
                  {/* Big numeral — anchors the eye */}
                  <div className="flex items-baseline gap-4 mb-6">
                    <span
                      className="text-7xl lg:text-8xl font-bold leading-none"
                      style={{
                        fontFamily: "'Michroma', sans-serif",
                        color: scene.accent,
                        textShadow: `0 0 40px ${scene.accent}`,
                      }}
                    >
                      {scene.id}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.4em]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {scene.eyebrow}
                    </span>
                  </div>

                  <h3
                    className="text-3xl lg:text-5xl font-bold leading-[1.05] mb-6 max-w-lg tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {scene.title}
                  </h3>

                  <p
                    className="text-base lg:text-lg leading-relaxed max-w-md"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {scene.body}
                  </p>

                  {/* Tiny "scroll to continue" hint on first scene only */}
                  {i === 0 && (
                    <div
                      className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span className="block w-8 h-px" style={{ background: 'var(--text-muted)' }} />
                      Scroll to continue
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── VISUAL COLUMN ──
              All four glyphs stacked. GSAP cross-fades and
              lightly rotates between them. Each glyph also runs
              its own micro-animation while it's active. */}
          <div className="relative aspect-square w-full max-w-[520px] mx-auto">
            <div ref={visualsRef} className="absolute inset-0">
              {SCENES.map((scene, i) => (
                <div
                  key={scene.id}
                  data-visual={i}
                  className="absolute inset-0 flex items-center justify-center will-change-transform"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Glyph kind={scene.glyph} accent={scene.accent} />
                </div>
              ))}
            </div>

            {/* Decorative frame — gives the visual area structure */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-[28px] border pointer-events-none"
              style={{
                borderColor: 'var(--border-color)',
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--text-primary) 4%, transparent), transparent 60%)',
                backdropFilter: 'blur(2px)',
              }}
            />
          </div>
        </div>

        {/* ── PROGRESS RAIL ──
            Right-edge vertical dots. Active dot grows + glows
            in the current scene's accent color. */}
        <div
          ref={railRef}
          className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-10"
          aria-hidden
        >
          {SCENES.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span
                className="text-[10px] tabular-nums tracking-widest opacity-50"
                style={{ color: 'var(--text-muted)' }}
              >
                {s.id}
              </span>
              <span data-dot className="block w-2 h-2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
