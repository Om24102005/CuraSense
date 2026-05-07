/* ═══════════════════════════════════════════════════════
   CuraSense — GOD-LEVEL App Shell  (UI/UX v2 — premium pass)
   ───────────────────────────────────────────────────────
   DESIGN LANGUAGE
     • Editorial typography — wide tracked display + tight sans body
     • Glass/holography — translucent surfaces with chromatic edges
     • Aurora glow — cyan ↔ violet gradients radiating from focal points
     • Motion-first — every state change is animated (no instant snaps)

   MOTION CHOREOGRAPHY  (top → bottom)
     1. Scroll progress rail   → GSAP scaleX driven by window scroll
     2. Header densification   → ScrollTrigger collapses padding & tightens logo
     3. Nav pill indicator     → FLIP-style GSAP animation between active items
     4. Magnetic nav hover     → translate + scale + glow on pointer proximity
     5. Page transitions       → masked clip-path + child stagger reveal
     6. Section reveals        → ScrollTrigger batch on [data-reveal] elements
     7. Mobile drawer          → fullscreen aurora overlay with stagger items

   3D / PREMIUM HOOKS  (slots — wire when assets ready)
     • <SplineScene />     for hero/empty-state interactive scenes (peachweb feel)
     • <ThreeBackground /> already mounted; can host threlte-style scenes
     • Theatre.js          can drive the Cinematic intro by wrapping
                           CinematicSequence's timeline (theatre-studio in dev)
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { SymptomChecker } from './components/SymptomChecker';
import { ImageAnalysis } from './components/ImageAnalysis';
import { ReportAnalysis } from './components/ReportAnalysis';
import { PredictionHistory } from './components/PredictionHistory';
import { Dashboard } from './components/Dashboard';
// ResetPassword (URL-based JWT flow) was removed — reset is now a code-based
// flow handled entirely inside the WelcomeScreen forgot-password panel.
// ScrollStory is mounted only inside WelcomeScreen (pre-login); the
// authenticated dashboard renders the actual Dashboard directly to
// avoid burying it behind a 400vh pinned scroll reel.
import { Settings } from './components/Settings';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AdminDashboard } from './components/AdminDashboard';
import {
  Activity, Brain, FileText, History, LayoutDashboard,
  Settings as SettingsIcon, ShieldAlert, Menu, X
} from 'lucide-react';
import { ThemeToggleButton } from './components/ThemeToggleButton';
import { UserProfile } from './components/UserProfile';
import { getPredictions, savePrediction } from './utils/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ── Effects ──
import ParticleField from './components/effects/ParticleField';
import FluidGradient from './components/effects/FluidGradient';
import CustomCursor from './components/effects/CustomCursor';
import SmoothScroll from './components/effects/SmoothScroll';
import CinematicSequence from './components/effects/CinematicSequence';
import { MagneticCard } from './components/effects/MagneticCard';
import ScrambleText from './components/effects/ScrambleText';
import ThreeBackground from './components/ThreeBackground';
import InteractionLayer from './components/effects/InteractionLayer';

// ── Themes ──
import { themes, ThemeName } from './themes';

gsap.registerPlugin(ScrollTrigger);

/* ── Context ── */
export type Theme = ThemeName;
export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}>({ theme: 'dark', setTheme: () => {}, toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

/* ── Types ── */
export interface Prediction {
  id: string;
  type: 'symptom' | 'image' | 'report';
  timestamp: Date;
  diagnosis: string;
  confidence: number;
  details: string;
  recommendations: string[];
  liked?: boolean;
}

/* ── Theme order for cycling ── */
const themeOrder: ThemeName[] = ['dark', 'light', 'cyberpunk', 'medical', 'aurora'];

/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */
export default function App() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('curasense_token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setThemeState] = useState<ThemeName>('dark');
  const [cinematicDone, setCinematicDone] = useState(false);

  /* ── Motion refs ──
     Held outside React render so GSAP can mutate without re-render storms.
     Each ref maps 1:1 with a discrete motion responsibility. */
  const scrollRailRef = useRef<HTMLDivElement | null>(null);   // top progress bar
  const headerRef = useRef<HTMLElement | null>(null);          // densify on scroll
  const navListRef = useRef<HTMLDivElement | null>(null);      // measures nav buttons
  const navPillRef = useRef<HTMLDivElement | null>(null);      // FLIP-animated indicator
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null); // fullscreen menu

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('curasense_theme', t);
    // Animate theme transition
    gsap.to('body', {
      duration: 0.6,
      ease: 'power2.inOut',
    });
  }, []);

  const toggleTheme = useCallback(() => {
    const idx = themeOrder.indexOf(theme);
    const next = themeOrder[(idx + 1) % themeOrder.length];
    setTheme(next);
  }, [theme, setTheme]);

  const currentTheme = themes[theme];
  const themeVars = currentTheme.vars as React.CSSProperties;

  useEffect(() => {
    // Restore saved theme
    const saved = localStorage.getItem('curasense_theme') as ThemeName | null;
    if (saved && themes[saved]) setThemeState(saved);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const userRaw = localStorage.getItem('curasense_user');
      if (userRaw) setIsAdmin(JSON.parse(userRaw).role === 'admin');
      getPredictions().then(res => {
        if (res.data?.predictions)
          setPredictions(res.data.predictions.map((p: any) => ({
            ...p,
            id: p._id || p.id,
          })));
      });
    }
  }, [isAuthenticated]);

  /* ── CURTAIN ON TAB CHANGE ──
     Fires the global aurora wipe defined in InteractionLayer every
     time activeTab changes. The curtain runs in parallel with the
     page-content reveal below, so the user sees: outgoing content
     dims → curtain wipes across → incoming content materializes. */
  useEffect(() => {
    if (!isAuthenticated || !cinematicDone) return;
    window.__curasenseCurtain?.();
  }, [activeTab, isAuthenticated, cinematicDone]);

  /* ── PAGE TRANSITION ──
     Simple opacity + y reveal on tab change. We deliberately do NOT
     use clipPath, filter:blur, or main.children stagger here — those
     can leave content invisible (clipped / blurred / opacity:0) if
     a tween is killed mid-flight by a fast tab switch or by React
     unmounting children. clearProps on completion guarantees no
     leftover inline styles. */
  useEffect(() => {
    if (!isAuthenticated || !cinematicDone) return;
    const main = document.getElementById('page-content');
    if (!main) return;

    const tween = gsap.fromTo(
      main,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'expo.out',
        clearProps: 'transform,opacity',
      }
    );

    return () => {
      tween.kill();
      // Hard reset in case the tween was interrupted before completion.
      gsap.set(main, { clearProps: 'transform,opacity,clipPath,filter' });
    };
  }, [activeTab, isAuthenticated, cinematicDone]);

  /* ── SCROLL PROGRESS RAIL ──
     Hairline bar pinned to viewport top. scaleX 0→1 maps directly to
     document scroll position. Costs near-zero (transform only). */
  useEffect(() => {
    if (!isAuthenticated || !cinematicDone) return;
    const rail = scrollRailRef.current;
    if (!rail) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? doc.scrollTop / max : 0;
      gsap.to(rail, {
        scaleX: ratio,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAuthenticated, cinematicDone]);

  /* ── HEADER DENSIFICATION ──
     ScrollTrigger compresses padding & shrinks logo block past 40px scroll.
     Creates the subtle "settling" effect premium sites use to gain real
     estate without abrupt layout jumps. */
  useEffect(() => {
    if (!isAuthenticated || !cinematicDone) return;
    const el = headerRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      start: 40,
      end: 99999,
      onUpdate: (self) => {
        const condensed = self.scroll() > 40;
        gsap.to(el, {
          paddingTop: condensed ? 6 : 0,
          paddingBottom: condensed ? 6 : 0,
          backdropFilter: condensed ? 'blur(28px) saturate(180%)' : 'blur(24px)',
          duration: 0.4,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, [isAuthenticated, cinematicDone]);

  /* ── NAV PILL INDICATOR (FLIP-style) ──
     Reads the active button's bounding rect and animates a glowing pill
     behind it. Width and x are tweened together → silky transition between
     tabs. The pill itself has a chromatic aurora gradient. */
  useEffect(() => {
    if (!isAuthenticated || !cinematicDone) return;
    const list = navListRef.current;
    const pill = navPillRef.current;
    if (!list || !pill) return;

    const active = list.querySelector<HTMLElement>(`[data-nav-id="${activeTab}"]`);
    if (!active) {
      gsap.to(pill, { opacity: 0, duration: 0.2 });
      return;
    }

    const listBox = list.getBoundingClientRect();
    const btnBox = active.getBoundingClientRect();

    gsap.to(pill, {
      x: btnBox.left - listBox.left,
      width: btnBox.width,
      height: btnBox.height,
      opacity: 1,
      duration: 0.55,
      ease: 'expo.out',
    });
  }, [activeTab, isAuthenticated, cinematicDone]);

  /* ── MOBILE DRAWER ──
     Fullscreen aurora overlay with stagger items. Toggled by mobileMenuOpen. */
  useEffect(() => {
    const drawer = mobileDrawerRef.current;
    if (!drawer) return;

    if (mobileMenuOpen) {
      gsap.set(drawer, { display: 'flex' });
      gsap.fromTo(
        drawer,
        { opacity: 0, clipPath: 'circle(0% at 95% 5%)' },
        { opacity: 1, clipPath: 'circle(150% at 95% 5%)', duration: 0.7, ease: 'expo.out' }
      );
      gsap.fromTo(
        drawer.querySelectorAll('[data-drawer-item]'),
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'expo.out', delay: 0.18 }
      );
    } else {
      gsap.to(drawer, {
        opacity: 0,
        clipPath: 'circle(0% at 95% 5%)',
        duration: 0.45,
        ease: 'power3.in',
        onComplete: () => gsap.set(drawer, { display: 'none' }),
      });
    }
  }, [mobileMenuOpen]);

  /* ── SCROLL BATCH REVEALS  (removed) ──
     Previously: ScrollTrigger.batch('[data-reveal]') with opacity 0 →
     1 + blur 6 → 0. Removed because elements already at the top of the
     viewport when a tab activates would briefly flash to opacity:0
     before fading back, which read as "the page is broken". The
     simpler page-transition above (opacity + y on #page-content) is
     enough. The data-reveal attributes in JSX are now harmless no-ops
     and can stay or be removed at leisure. */

  const addPrediction = async (prediction: Omit<Prediction, 'id' | 'timestamp'>) => {
    const response = await savePrediction(prediction);
    if (response.data) {
      const data = response.data as any;
      setPredictions(prev => [{ ...data, id: data._id || data.id }, ...prev]);
    }
  };

  const toggleLike = (id: string) =>
    setPredictions(predictions.map(p => (p.id === id ? { ...p, liked: !p.liked } : p)));

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze', icon: Activity },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ...(isAdmin ? [{ id: 'admin', label: 'Overwatch', icon: ShieldAlert }] : []),
  ];


  /* ── Unauthenticated ── */
  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
        <div style={themeVars}>
          <ThreeBackground />
          {/* Secondary particle field — 1200 desktop / 0 on phones.
              The helix already carries the visual weight; this layer
              just adds depth, so it can drop sharply without losing
              the look. */}
          <ParticleField
            count={typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 1200}
          />
          <FluidGradient
            colors={[
              currentTheme.vars['--accent-cyan'],
              currentTheme.vars['--accent-violet'],
              '#ec4899',
              '#10b981',
            ]}
          />
          <CustomCursor />
          <InteractionLayer />
          <div className="relative z-10 min-h-screen">
            <WelcomeScreen onAuthenticate={() => setIsAuthenticated(true)} />
          </div>
        </div>
      </ThemeContext.Provider>
    );
  }

  /* ── Authenticated ── */
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {/* Cinematic sequence on first load */}
      {!cinematicDone && (
        <CinematicSequence onComplete={() => setCinematicDone(true)} />
      )}

      <SmoothScroll>
        <div
          className="min-h-screen relative overflow-hidden transition-colors duration-500 text-[--text-primary]"
          style={themeVars}
        >
          <ParticleField
            count={typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 1500}
          />
          <FluidGradient
            colors={[
              currentTheme.vars['--accent-cyan'],
              currentTheme.vars['--accent-violet'],
              '#ec4899',
              '#10b981',
            ]}
          />
          <CustomCursor />
          <InteractionLayer />

          <div className="relative z-10">
            {/* ── SCROLL PROGRESS RAIL ──
                Hairline aurora gradient bar at the very top of the viewport.
                scaleX 0→1 driven by GSAP from window scroll. transform-origin
                left so it grows rightward. Z above the header. */}
            <div
              aria-hidden
              className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none origin-left scale-x-0"
              ref={scrollRailRef}
              style={{
                background:
                  'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet), #ec4899)',
                boxShadow: '0 0 12px var(--accent-violet)',
              }}
            />

            {/* ── Header ──
                Densifies on scroll (see useEffect: HEADER DENSIFICATION).
                The thin gradient hairline below it doubles as a luminous edge. */}
            <header
              ref={headerRef}
              className="sticky top-0 z-50 backdrop-blur-2xl border-b transition-[padding] duration-300"
              style={{
                background: 'var(--header-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Bottom edge aurora — purely decorative, gives header a "lit" base */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-60"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, var(--accent-cyan) 30%, var(--accent-violet) 70%, transparent 100%)',
                }}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
                {/* ── Logo (clickable → Dashboard) ──
                    MagneticCard provides 3D pointer tilt; its own onClick
                    prop handles navigation so the entire magnetic surface
                    is the click target (not just the inner flex row).
                    Hover: halo pulses, icon nudges with the magnet. */}
                <MagneticCard
                  intensity={6}
                  perspective={600}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <div
                    role="button"
                    aria-label="Go to Dashboard"
                    tabIndex={0}
                    onKeyDown={(e: { key: string; preventDefault: () => void }) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTab('dashboard');
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                  >
                    <div className="relative">
                      {/* Glow halo — animates on hover */}
                      <div
                        aria-hidden
                        className="absolute inset-0 rounded-xl blur-xl opacity-50 group-hover:opacity-90 transition-opacity duration-500"
                        style={{
                          background:
                            'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
                        }}
                      />
                      <div
                        className="relative p-3 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]"
                        style={{
                          background:
                            'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
                          boxShadow:
                            '0 8px 32px -8px var(--accent-violet), inset 0 1px 0 rgba(255,255,255,0.25)',
                        }}
                      >
                        <Brain className="w-8 h-8 text-white drop-shadow" />
                      </div>
                    </div>
                    <div>
                      <h1
                        className="text-xl font-bold tracking-[0.18em] leading-none bg-clip-text text-transparent"
                        style={{
                          fontFamily: "'Michroma', sans-serif",
                          backgroundImage:
                            'linear-gradient(120deg, var(--text-primary) 0%, var(--accent-violet) 50%, var(--accent-cyan) 100%)',
                        }}
                      >
                        CuraSense
                      </h1>
                      <p
                        className="text-[10px] uppercase tracking-[0.32em] hidden sm:block mt-1.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        AI Diagnostic Suite
                        {/* tiny separator dot + version pill */}
                        <span className="inline-block mx-2 opacity-40">·</span>
                        <span style={{ color: 'var(--accent-cyan)' }}>v2.0</span>
                      </p>
                    </div>
                  </div>
                </MagneticCard>

                {/* ── Nav ──
                    Pill indicator lives behind the buttons (absolute) and
                    FLIPs to the active button via GSAP (see useEffect: NAV PILL).
                    Each button: inline pointer-driven micro-translate on hover
                    (cheap — handled with CSS transform on hover state). */}
                <nav className="hidden md:flex items-center">
                  <div ref={navListRef} className="relative flex items-center gap-1 px-1">
                    {/* Animated pill — sits behind active button */}
                    <div
                      ref={navPillRef}
                      aria-hidden
                      className="absolute top-0 left-0 rounded-xl pointer-events-none opacity-0"
                      style={{
                        background:
                          'linear-gradient(135deg, color-mix(in srgb, var(--accent-violet) 22%, transparent), color-mix(in srgb, var(--accent-cyan) 22%, transparent))',
                        border: '1px solid var(--accent-violet)',
                        boxShadow:
                          '0 6px 24px -6px var(--accent-violet), inset 0 1px 0 rgba(255,255,255,0.08)',
                      }}
                    />
                    {navItems.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        data-nav-id={id}
                        onClick={() => setActiveTab(id)}
                        onMouseEnter={(e) =>
                          gsap.to(e.currentTarget, {
                            y: -2,
                            duration: 0.25,
                            ease: 'power2.out',
                          })
                        }
                        onMouseLeave={(e) =>
                          gsap.to(e.currentTarget, {
                            y: 0,
                            duration: 0.25,
                            ease: 'power2.out',
                          })
                        }
                        className="relative z-[1] flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        style={{
                          color:
                            activeTab === id
                              ? 'var(--accent-violet)'
                              : 'var(--text-secondary)',
                        }}
                      >
                        <Icon className="w-4 h-4" /> {label}
                      </button>
                    ))}
                  </div>
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                  <UserProfile
                    predictionsCount={predictions.length}
                    onNavigate={setActiveTab}
                    onLogout={handleLogout}
                  />
                  <ThemeToggleButton />
                  <button
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    className="md:hidden p-2 rounded-xl border text-[--text-primary] hover:scale-105 transition-transform"
                    style={{ borderColor: 'var(--border-color)' }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </header>

            {/* ── MOBILE DRAWER ──
                Fullscreen overlay revealed by an iris clip-path animation
                (see useEffect: MOBILE DRAWER). Stagger items on entry.
                Hidden by default (display:none until first toggle). */}
            <div
              ref={mobileDrawerRef}
              className="fixed inset-0 z-[55] flex-col items-center justify-center gap-2 px-6 hidden"
              style={{
                background:
                  'radial-gradient(120% 120% at 95% 5%, color-mix(in srgb, var(--accent-violet) 35%, transparent), color-mix(in srgb, var(--accent-cyan) 18%, transparent) 40%, var(--header-bg) 75%)',
                backdropFilter: 'blur(32px) saturate(180%)',
              }}
            >
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  data-drawer-item
                  onClick={() => {
                    setActiveTab(id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full max-w-xs flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-medium border"
                  style={{
                    borderColor: 'var(--border-color)',
                    color:
                      activeTab === id
                        ? 'var(--accent-violet)'
                        : 'var(--text-primary)',
                    background:
                      activeTab === id ? 'var(--nav-active-bg)' : 'transparent',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="tracking-wide">{label}</span>
                </button>
              ))}
              <p
                data-drawer-item
                className="mt-6 text-[10px] uppercase tracking-[0.3em]"
                style={{ color: 'var(--text-muted)' }}
              >
                CuraSense — AI Diagnostic Suite
              </p>
            </div>

            {/* ── Main Content ── */}
            <main
              id="page-content"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
              {activeTab === 'dashboard' && (
                <Dashboard predictions={predictions} onNavigate={setActiveTab} />
              )}

              {activeTab === 'analyze' && (
                <div>
                  {/* Section header — picked up by ScrollTrigger.batch
                      (see useEffect: SCROLL BATCH REVEALS).
                      Future: replace plain <p> with SplitText words for
                      individual word stagger (gsap-bonus). */}
                  <div className="mb-8" data-reveal>
                    <ScrambleText
                      text="AI-Powered Analysis"
                      as="h2"
                      className="text-3xl font-bold mb-2 tracking-tight"
                      style={{ fontFamily: "'Michroma', sans-serif" }}
                    />
                    <p
                      className="text-base leading-relaxed max-w-xl"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Choose an analysis method to get started
                    </p>
                  </div>
                  <Tabs defaultValue="symptoms" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid rounded-2xl p-1 glass">
                      {[
                        { value: 'symptoms', label: 'Symptoms', icon: Activity },
                        { value: 'image', label: 'Scans', icon: Brain },
                        { value: 'report', label: 'Reports', icon: FileText },
                      ].map(({ value, label, icon: Icon }) => (
                        <TabsTrigger
                          key={value}
                          value={value}
                          className="gap-2 text-[--text-secondary] data-[state=active]:text-white"
                        >
                          <Icon className="w-4 h-4" />{' '}
                          <span className="hidden sm:inline">{label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value="symptoms">
                      <SymptomChecker onPrediction={addPrediction} />
                    </TabsContent>
                    <TabsContent value="image">
                      <ImageAnalysis onPrediction={addPrediction} />
                    </TabsContent>
                    <TabsContent value="report">
                      <ReportAnalysis onPrediction={addPrediction} />
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <div className="mb-8" data-reveal>
                    <ScrambleText
                      text="Analysis History"
                      as="h2"
                      className="text-3xl font-bold mb-2 tracking-tight"
                      style={{ fontFamily: "'Michroma', sans-serif" }}
                    />
                    <p
                      className="text-base leading-relaxed max-w-xl"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Review all your previous medical analyses
                    </p>
                  </div>
                  <div data-reveal>
                    <PredictionHistory predictions={predictions} onLike={toggleLike} />
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <div className="mb-8" data-reveal>
                    <ScrambleText
                      text="Settings"
                      as="h2"
                      className="text-3xl font-bold mb-2 tracking-tight"
                      style={{ fontFamily: "'Michroma', sans-serif" }}
                    />
                    <p
                      className="text-base leading-relaxed max-w-xl"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Manage your preferences and account
                    </p>
                  </div>
                  <div data-reveal>
                    <Settings />
                  </div>
                </div>
              )}

              {activeTab === 'admin' && <AdminDashboard />}
            </main>
          </div>
        </div>
      </SmoothScroll>
    </ThemeContext.Provider>
  );
}
