/* ═══════════════════════════════════════════════════════
   CuraSense — GOD-LEVEL App Shell  (UI/UX v2 — premium pass)
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, createContext, useContext, useCallback, useRef, lazy, Suspense } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation, useAppSettings } from './state/AppSettingsContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { SymptomChecker } from './features/symptom-checker/SymptomChecker';
import { ImageAnalysis } from './features/image-analysis/ImageAnalysis';
import { ReportAnalysis } from './features/report-analysis/ReportAnalysis';
import { PredictionHistory } from './features/history/PredictionHistory';
import { Dashboard } from './features/dashboard/Dashboard';
import { ConsultationBooking } from './features/booking/ConsultationBooking';
import { Settings } from './features/settings/Settings';
import { PublicSite } from './features/site/PublicSite';
import { AdminDashboard } from './features/admin/AdminDashboard';
import {
  Activity, Brain, FileText, History, LayoutDashboard,
  Settings as SettingsIcon, ShieldAlert, Menu, X, CalendarPlus, LogOut,
} from 'lucide-react';
import { ThemeToggleButton } from './components/shared/ThemeToggleButton';
import { UserProfile } from './components/shared/UserProfile';
import { getPredictions, savePrediction } from './services/api';

import { syncNativeTheme, useBackHandler } from './native';

// ── Animations (dedicated module — see ./animations) ──
import {
  gsap,
  usePageTransition,
  useScrollProgressRail,
  useHeaderDensify,
  useNavPillIndicator,
  useMobileDrawerAnimation,
  swapThemeWithReveal,
} from './animations';

// ── Background effects ──
import AuroraBackdrop from './components/backgrounds/AuroraBackdrop';
// Per-page medical particle scene; code-split so the first load never pays for three.js.
const PageScene = lazy(() => import('./scenes/PageScene'));
import type { SceneKey } from './scenes/generators';
import LiquidFlow from './components/flow/LiquidFlow';
import IntroSequence from './components/intro/IntroSequence';
import WelcomeSequence, { type WelcomeKind } from './components/intro/WelcomeSequence';
import { MagneticCard } from './components/backgrounds/MagneticCard';
import InteractionLayer from './components/backgrounds/InteractionLayer';
import ElementTransitions from './components/backgrounds/ElementTransitions';

// ── Themes ──
import { themes, ThemeName } from './themes';

/* ── Arrival animations ── */
const firstName = (full?: string) => (full ?? '').trim().split(/\s+/)[0] ?? '';
const storedFirstName = () => { try { return firstName(JSON.parse(localStorage.getItem('curasense_user') || '{}').name); } catch { return ''; } };
/** The first-visit intro plays once per browser session, on the home page only, never under reduced motion or for a signed-in user. */
const introWanted = () =>
  !localStorage.getItem('curasense_token') && sessionStorage.getItem('cs_booted') !== '1' &&
  (location.pathname === '/' || location.pathname === '') && !matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Context ── */
export type Theme = ThemeName;
export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: (originX?: number, originY?: number) => void;
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
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
  conditions?: { name: string; probability: number }[];
  biomarkers?: { name: string; value: number; unit?: string; status?: string; normal_min?: number; normal_max?: number }[];
  scanSections?: { title: string; findings: string[] }[];
}

/* ── Prediction localStorage cache (keyed by userId so multi-user devices stay isolated) ── */
const predCacheKey = (userId: string) => `curasense_pred_${userId}`;

function loadPredCache(userId: string): Record<string, Prediction> {
  try {
    const raw = localStorage.getItem(predCacheKey(userId));
    if (!raw) return {};
    const arr: Prediction[] = JSON.parse(raw);
    return Object.fromEntries(arr.map(p => [p.id, p]));
  } catch { return {}; }
}

function savePredCache(userId: string, preds: Prediction[]) {
  try { localStorage.setItem(predCacheKey(userId), JSON.stringify(preds)); } catch { /* quota */ }
}

function currentUserId(): string {
  try { return JSON.parse(localStorage.getItem('curasense_user') || '{}')._id ?? ''; } catch { return ''; }
}

/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */
export default function App() {
  const { t } = useTranslation();
  // Pull sync/clear methods from the settings context — called on login and logout.
  const { syncFromDB, clearAll } = useAppSettings();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('curasense_token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyzeTab, setAnalyzeTab] = useState('symptoms');   // which analysis tool the Analyze page shows
  // The no-flash bootstrap script in index.html already picked dark/light
  // (saved choice, else system preference) and stamped it on <html> before
  // this ever runs — just read it back so there's no post-mount correction.
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const attr = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
    return attr === 'light' ? 'light' : 'dark';
  });
  const [cinematicDone, setCinematicDone] = useState(false);   // the arrival animation has started to open: the shell may animate and mount its scene
  const [sceneOn, setSceneOn] = useState(false);   // the page's 3D scene and flow layer mount behind the arrival animation, in its calm moment, not as it opens
  const [introOn, setIntroOn] = useState(introWanted);
  // After login / sign-up the arrival animation covers the screen first and only then is the page swapped underneath it;
  // a saved session that reloads gets the short version of the same animation.
  const [arrival, setArrival] = useState<{ name: string; kind: WelcomeKind } | null>(() => (localStorage.getItem('curasense_token') ? { name: storedFirstName(), kind: 'resume' } : null));
  const [historyReady, setHistoryReady] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);
  const [bootDone, setBootDone] = useState(() => !introWanted());   // gates the cell's own intro, which starts as the iris opens
  const [bookingKey, setBookingKey] = useState(0);
  const [bookingInitialView, setBookingInitialView] = useState<'new' | 'my-bookings'>('new');

  const scrollRailRef  = useRef<HTMLDivElement | null>(null);
  const headerRef      = useRef<HTMLElement | null>(null);
  const navListRef     = useRef<HTMLDivElement | null>(null);
  const navPillRef     = useRef<HTMLDivElement | null>(null);
  const mobileDrawerRef= useRef<HTMLDivElement | null>(null);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('curasense_theme', t);
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    root.style.colorScheme = t;
    Object.entries(themes[t].vars).forEach(([k, v]) => root.style.setProperty(k, v));
    syncNativeTheme(t);
  }, []);

  const toggleTheme = useCallback((originX?: number, originY?: number) => {
    const next: ThemeName = theme === 'dark' ? 'light' : 'dark';
    const x = originX ?? window.innerWidth / 2;
    const y = originY ?? window.innerHeight / 2;
    swapThemeWithReveal(x, y, () => setTheme(next));
  }, [theme, setTheme]);

  // usePageTransition fades the new tab in; no View Transition here (see its comment).
  const navigateTab = useCallback((tab: string) => setActiveTab(tab), []);

  // Android back button: close the open menu first, then go back to the dashboard, and only from there leave the app.
  useBackHandler(mobileMenuOpen, () => setMobileMenuOpen(false));
  useBackHandler(isAuthenticated && activeTab !== 'dashboard', () => setActiveTab('dashboard'));

  const currentTheme = themes[theme];
  const themeVars = currentTheme.vars as React.CSSProperties;

  // A visitor who picked a tool on the landing page ("Read a scan") lands on it right after signing in.
  useEffect(() => {
    if (!isAuthenticated) return;
    const intent = sessionStorage.getItem('curasense_intent');
    if (intent === 'symptoms' || intent === 'image' || intent === 'report') {
      sessionStorage.removeItem('curasense_intent');
      setAnalyzeTab(intent);
      setActiveTab('analyze');
    }
  }, [isAuthenticated]);

  // ── On authentication: sync settings from DB then load predictions ─────────
  useEffect(() => {
    if (isAuthenticated) {
      const userRaw = localStorage.getItem('curasense_user');
      if (userRaw) setIsAdmin(JSON.parse(userRaw).role === 'admin');

      // Fetch user settings from MongoDB — overwrites localStorage L1 cache.
      // Non-blocking: predictions load in parallel.
      syncFromDB().finally(() => setSettingsReady(true));

      getPredictions().then(res => {
        if (res.data?.predictions) {
          const uid = currentUserId();
          const cache = loadPredCache(uid);
          const merged: Prediction[] = res.data.predictions.map((p: any) => {
            const id = p._id || p.id;
            const cached = cache[id];
            return {
              ...p,
              id,
              urgency:      p.urgency      ?? cached?.urgency,
              conditions:   (p.conditions?.length   ? p.conditions   : cached?.conditions)   ?? [],
              biomarkers:   (p.biomarkers?.length   ? p.biomarkers   : cached?.biomarkers)   ?? [],
              scanSections: (p.scanSections?.length ? p.scanSections : cached?.scanSections) ?? [],
              details:      p.details || cached?.details || '',
            };
          });
          setPredictions(merged);
          savePredCache(uid, merged);
        }
      }).finally(() => setHistoryReady(true));
    }
  }, [isAuthenticated, syncFromDB]);

  // ── Shell animations (dedicated module — see ./animations) ──
  const transitionsEnabled = isAuthenticated && cinematicDone;

  usePageTransition(transitionsEnabled, activeTab);
  useScrollProgressRail(scrollRailRef, transitionsEnabled);
  useHeaderDensify(headerRef, transitionsEnabled);
  useNavPillIndicator(navListRef, navPillRef, activeTab, transitionsEnabled);
  useMobileDrawerAnimation(mobileDrawerRef, mobileMenuOpen);

  const addPrediction = async (prediction: Omit<Prediction, 'id' | 'timestamp'>) => {
    const response = await savePrediction(prediction);
    if (response.data) {
      const data = response.data as any;
      const merged: Prediction = { ...prediction, ...data, id: data._id || data.id };
      setPredictions(prev => {
        const next = [merged, ...prev];
        savePredCache(currentUserId(), next);
        return next;
      });
    }
  };

  const toggleLike = (id: string) =>
    setPredictions(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, liked: !p.liked } : p));
      savePredCache(currentUserId(), next);
      return next;
    });

  const handleLogout = () => {
    // Clear all user settings from context and localStorage.
    clearAll();
    // Clear auth credentials and theme.
    localStorage.removeItem('curasense_token');
    localStorage.removeItem('curasense_user');
    localStorage.removeItem('curasense_theme');
    window.location.reload();
  };

  const handleMyBookings = useCallback(() => {
    setBookingInitialView('my-bookings');
    setBookingKey((k: number) => k + 1);
    navigateTab('booking');
  }, []);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'),       icon: LayoutDashboard, cta: false },
    { id: 'analyze',   label: t('nav.analyze'),         icon: Activity,        cta: false },
    { id: 'history',   label: t('nav.history'),         icon: History,         cta: false },
    { id: 'booking',   label: t('nav.bookAppointment'), icon: CalendarPlus,    cta: true  },
    { id: 'settings',  label: t('nav.settings'),        icon: SettingsIcon,    cta: false },
    ...(isAdmin ? [{ id: 'admin', label: t('nav.overwatch'), icon: ShieldAlert, cta: false }] : []),
  ];

  const NAV_ACCENTS: Record<string, string> = {
    dashboard: '#22d3ee',
    analyze:   '#10b981',
    history:   '#f59e0b',
    settings:  '#94a3b8',
    admin:     '#ef4444',
  };

  /* ── Unauthenticated ── */
  // One arrival animation, mounted beside whichever tree is showing (keyed, so it survives the swap between them).
  const arrivalOverlay = arrival && (
    <WelcomeSequence
      key="arrival"
      name={arrival.name} kind={arrival.kind} ready={{ history: historyReady, settings: settingsReady }}
      onCovered={() => flushSync(() => setIsAuthenticated(true))}   // one synchronous commit, now, while the screen is covered and still
      onSettle={() => setSceneOn(true)}
      onReveal={() => { setSceneOn(true); setCinematicDone(true); }}
      onDone={() => setArrival(null)}
    />
  );

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
        <div style={themeVars}>
          <AuroraBackdrop />
          <InteractionLayer />
          <ElementTransitions />
          <PublicSite isDark={theme === 'dark'} bootDone={bootDone} onAuthenticate={(user, kind) => setArrival({ name: firstName(user?.name), kind })} />
        </div>
        {introOn && <IntroSequence key="intro" onReveal={() => { sessionStorage.setItem('cs_booted', '1'); setBootDone(true); }} onDone={() => setIntroOn(false)} />}
        {arrivalOverlay}
      </ThemeContext.Provider>
    );
  }

  /* ── Authenticated ── */
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <>
        <div
          className="min-h-dvh relative overflow-hidden transition-colors duration-500 text-[--text-primary]"
          style={themeVars}
        >
          <AuroraBackdrop />
          {sceneOn && <Suspense fallback={null}><PageScene scene={activeTab as SceneKey} light={theme === 'light'} /></Suspense>}
          {sceneOn && <LiquidFlow tabKey={activeTab} />}
          <InteractionLayer />
          <ElementTransitions />

          <div className="relative z-10" style={{ background: 'radial-gradient(ellipse 90% 45% at 20% -5%, rgba(135,191,255,0.18) 0%, rgba(38,103,255,0.06) 40%, transparent 65%)' }}>
            {/* ── SCROLL PROGRESS RAIL ── */}
            <div
              aria-hidden
              className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none origin-left scale-x-0"
              ref={scrollRailRef}
              style={{ background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet), #ec4899)', boxShadow: '0 0 12px var(--accent-violet)' }}
            />

            {/* ── Header ── */}
            <header
              ref={headerRef}
              className={`sticky top-0 ${mobileMenuOpen ? 'z-[56]' : 'z-50'} backdrop-blur-2xl border-b transition-[padding] duration-300`}   /* above the drawer (z-55) while it is open, so its close button stays tappable; z-50 otherwise, level with dialogs and popovers */
              style={{ background: 'var(--header-bg)', borderColor: 'var(--border-color)' }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-60"
                style={{ background: 'linear-gradient(90deg, transparent 0%, var(--accent-cyan) 30%, var(--accent-violet) 70%, transparent 100%)' }}
              />

              {/* the header's own background runs up under the notch / status bar; its content starts below it */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pb-4" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
                {/* index.css paints every class containing "card" (this one is "magnetic-card") as a card, and the wrapper clips the logo glow: both off here */}
                <MagneticCard className="overflow-visible! bg-transparent! backdrop-blur-none!" intensity={6} perspective={600} onClick={() => navigateTab('dashboard')}>
                  <div
                    role="button"
                    aria-label="Go to Dashboard"
                    tabIndex={0}
                    onKeyDown={(e: { key: string; preventDefault: () => void }) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTab('dashboard'); }
                    }}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                  >
                    <div className="relative">
                      <div
                        aria-hidden
                        className="absolute inset-0 rounded-xl blur-xl opacity-50 group-hover:opacity-90 transition-opacity duration-500"
                        style={{ background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))' }}
                      />
                      <div
                        className="relative p-3 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]"
                        style={{ background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))', boxShadow: '0 8px 32px -8px var(--accent-violet), inset 0 1px 0 rgba(255,255,255,0.25)' }}
                      >
                        <Brain className="w-8 h-8 text-white drop-shadow" />
                      </div>
                    </div>
                    <div>
                      <h1
                        className="text-xl font-bold tracking-[0.18em] leading-none bg-clip-text text-transparent"
                        style={{ fontFamily: "var(--font-display)", backgroundImage: 'linear-gradient(120deg, var(--text-primary) 0%, var(--accent-violet) 50%, var(--accent-cyan) 100%)' }}
                      >
                        CuraSense
                      </h1>
                      <p className="text-[10px] uppercase tracking-[0.32em] hidden sm:block mt-1.5" style={{ color: 'var(--text-muted)' }}>
                        {t('app.tagline')}
                        <span className="inline-block mx-2 opacity-40">·</span>
                        <span style={{ color: 'var(--accent-cyan)' }}>v2.0</span>
                      </p>
                    </div>
                  </div>
                </MagneticCard>

                {/* ── Nav ── */}
                <nav className="hidden md:flex items-center gap-2">
                  <div
                    ref={navListRef}
                    className="relative flex items-center"
                    style={{
                      padding: '4px', borderRadius: '18px',
                      background: 'rgba(4,4,14,0.82)', border: '1px solid rgba(255,255,255,0.09)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07),inset 0 -1px 0 rgba(0,0,0,0.35),0 8px 32px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div
                      ref={navPillRef}
                      aria-hidden
                      className="absolute top-0 left-0 pointer-events-none opacity-0"
                      style={{
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(135,191,255,0.5) 0%, rgba(38,103,255,0.22) 55%, rgba(135,191,255,0.18) 100%)',
                        border: '1px solid rgba(135,191,255,0.58)',
                        boxShadow: '0 0 30px -4px rgba(135,191,255,0.8),0 0 14px -4px rgba(38,103,255,0.5),inset 0 1px 0 rgba(255,255,255,0.22),inset 0 0 24px rgba(135,191,255,0.08)',
                      }}
                    />

                    {navItems.filter(n => !n.cta).map(({ id, label, icon: Icon }) => {
                      const isActive = activeTab === id;
                      const accent   = NAV_ACCENTS[id] ?? '#2dd4bf';
                      return (
                        <button
                          key={id}
                          data-nav-id={id}
                          onClick={() => navigateTab(id)}
                          onMouseEnter={e => gsap.to(e.currentTarget, { y: -2, duration: 0.2, ease: 'power2.out' })}
                          onMouseLeave={e => gsap.to(e.currentTarget, { y: 0,  duration: 0.2, ease: 'power2.out' })}
                          className="relative z-[1] flex items-center gap-1.5 px-3.5 py-2 rounded-[14px]"
                        >
                          <Icon style={{ width: 14, height: 14, flexShrink: 0, color: isActive ? accent : 'rgba(255,255,255,0.35)', filter: isActive ? `drop-shadow(0 0 5px ${accent}bb)` : 'none', transition: 'color 0.25s, filter 0.25s' }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'rgba(255,255,255,0.42)', textShadow: isActive ? `0 0 14px ${accent}99` : 'none', letterSpacing: isActive ? '0.015em' : '0', transition: 'all 0.25s ease' }}>
                            {label}
                          </span>
                          <span aria-hidden style={{
                            position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                            width: isActive ? '20px' : '0px', height: '2px', borderRadius: '999px',
                            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                            boxShadow: isActive ? `0 0 8px ${accent}` : 'none',
                            transition: 'width 0.3s ease, box-shadow 0.3s ease',
                          }} />
                        </button>
                      );
                    })}
                  </div>

                  {navItems.filter(n => n.cta).map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                      <button
                        key={id}
                        data-nav-id={id}
                        onClick={() => navigateTab(id)}
                        onMouseEnter={e => gsap.to(e.currentTarget, { y: -2, scale: 1.03, duration: 0.2, ease: 'power2.out' })}
                        onMouseLeave={e => gsap.to(e.currentTarget, { y: 0,  scale: 1,    duration: 0.2, ease: 'power2.out' })}
                        className="relative flex items-center gap-1.5 px-4 py-2"
                        style={{
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #0d9488 0%, #2563eb 55%, #06b6d4 100%)',
                          border: isActive ? '1px solid rgba(38,103,255,0.65)' : '1px solid rgba(135,191,255,0.55)',
                          boxShadow: isActive
                            ? '0 0 32px -4px rgba(135,191,255,0.95), 0 0 18px -4px rgba(38,103,255,0.65), inset 0 1px 0 rgba(255,255,255,0.25)'
                            : '0 0 22px -6px rgba(135,191,255,0.65), 0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
                          color: '#fff', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.02em',
                          cursor: 'pointer', transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                        }}
                      >
                        <span aria-hidden className="animate-ping absolute inset-0 pointer-events-none" style={{ borderRadius: '14px', background: 'rgba(135,191,255,0.18)', animationDuration: '2.8s' }} />
                        <span aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: '14px' }}>
                          <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)' }} />
                        </span>
                        <Icon style={{ width: 14, height: 14, flexShrink: 0, position: 'relative', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.7))' }} />
                        <span style={{ position: 'relative', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>{label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                  <div aria-hidden className="hidden md:block w-px h-5 mx-1 opacity-50" style={{ background: 'var(--border-color)' }} />
                  <UserProfile predictionsCount={predictions.length} onNavigate={navigateTab} onLogout={handleLogout} onMyBookings={handleMyBookings} />
                  <ThemeToggleButton />
                  <button
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    className="md:hidden p-2 rounded-xl border text-[--text-primary] hover:scale-105 transition-transform"
                    style={{ borderColor: 'var(--border-color)' }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </header>

            {/* ── MOBILE DRAWER ── */}
            <div
              ref={mobileDrawerRef}
              data-drawer
              className="fixed inset-0 z-[55] flex-col items-center justify-center gap-2 px-6 hidden"
              style={{
                background: 'radial-gradient(120% 120% at 95% 5%, color-mix(in srgb, var(--accent-violet) 35%, transparent), color-mix(in srgb, var(--accent-cyan) 18%, transparent) 40%, var(--header-bg) 75%)',
                backdropFilter: 'blur(32px) saturate(180%)',
                paddingTop: 'calc(5.5rem + env(safe-area-inset-top))',   /* the header (5.5rem tall) now stays visible above the drawer */
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
            >
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  data-drawer-item
                  onClick={() => { navigateTab(id); setMobileMenuOpen(false); }}
                  className="w-full max-w-xs flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-medium border"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: activeTab === id ? 'var(--accent-violet)' : 'var(--text-primary)',
                    background: activeTab === id ? 'var(--nav-active-bg)' : 'transparent',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="tracking-wide">{label}</span>
                </button>
              ))}
              {/* the profile menu is desktop-only, so on a phone this is where you sign out */}
              <button
                data-drawer-item
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full max-w-xs flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-medium border mt-2"
                style={{ borderColor: 'var(--border-color)', color: 'var(--error)', background: 'transparent' }}
              >
                <LogOut className="w-5 h-5" />
                <span className="tracking-wide">Sign out</span>
              </button>
              <p data-drawer-item className="mt-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>
                CuraSense — {t('app.tagline')}
              </p>
            </div>

            {/* ── Main Content ── */}
            <main id="page-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
              {activeTab === 'dashboard' && (
                <Dashboard predictions={predictions} onNavigate={navigateTab} />
              )}

              {activeTab === 'analyze' && (
                <div>
                  <div className="mb-8 w-full sm:w-fit px-7 py-5 rounded-2xl" data-lg="plate" data-reveal>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                      {t('page.analyze.title')}
                    </h2>
                    <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                      {t('page.analyze.subtitle')}
                    </p>
                  </div>
                  <Tabs value={analyzeTab} onValueChange={setAnalyzeTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid rounded-2xl p-1 glass">
                      {[
                        { value: 'symptoms', label: t('page.analyze.symptoms'), icon: Activity },
                        { value: 'image',    label: t('page.analyze.scans'),    icon: Brain    },
                        { value: 'report',   label: t('page.analyze.reports'),  icon: FileText },
                      ].map(({ value, label, icon: Icon }) => (
                        <TabsTrigger key={value} value={value} className="gap-2 text-[--text-secondary] data-[state=active]:text-white">
                          <Icon className="w-4 h-4" />{' '}
                          <span>{label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value="symptoms"><SymptomChecker onPrediction={addPrediction} onSwitchTab={setAnalyzeTab} /></TabsContent>
                    <TabsContent value="image"><ImageAnalysis onPrediction={addPrediction} onSwitchTab={setAnalyzeTab} /></TabsContent>
                    <TabsContent value="report"><ReportAnalysis onPrediction={addPrediction} onSwitchTab={setAnalyzeTab} /></TabsContent>
                  </Tabs>
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <div className="mb-8 w-full sm:w-fit px-7 py-5 rounded-2xl" data-lg="plate" data-reveal>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                      {t('page.history.title')}
                    </h2>
                    <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                      {t('page.history.subtitle')}
                    </p>
                  </div>
                  <div data-reveal>
                    <PredictionHistory predictions={predictions} onLike={toggleLike} />
                  </div>
                </div>
              )}

              {activeTab === 'booking' && (
                <div key={bookingKey}>
                  <ConsultationBooking predictions={predictions} onNavigate={navigateTab} initialView={bookingInitialView} />
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <div className="mb-8 w-full sm:w-fit px-7 py-5 rounded-2xl" data-lg="plate" data-reveal>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                      {t('page.settings.title')}
                    </h2>
                    <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                      {t('page.settings.subtitle')}
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
      </>
      {arrivalOverlay}
    </ThemeContext.Provider>
  );
}
