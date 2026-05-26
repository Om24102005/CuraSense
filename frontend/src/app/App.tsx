/* ═══════════════════════════════════════════════════════
   CuraSense — GOD-LEVEL App Shell  (UI/UX v2 — premium pass)
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { useTranslation, useAppSettings } from './contexts/AppSettingsContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { SymptomChecker } from './components/SymptomChecker';
import { ImageAnalysis } from './components/ImageAnalysis';
import { ReportAnalysis } from './components/ReportAnalysis';
import { PredictionHistory } from './components/PredictionHistory';
import { Dashboard } from './components/Dashboard';
import { ConsultationBooking } from './components/ConsultationBooking';
import { Settings } from './components/Settings';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AdminDashboard } from './components/AdminDashboard';
import {
  Activity, Brain, FileText, History, LayoutDashboard,
  Settings as SettingsIcon, ShieldAlert, Menu, X, CalendarPlus,
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
import SystemBootSequence from './components/effects/SystemBootSequence';
import { MagneticCard } from './components/effects/MagneticCard';
import ThreeBackground from './components/ThreeBackground';
import InteractionLayer from './components/effects/InteractionLayer';
import ElementTransitions from './components/effects/ElementTransitions';

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
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
  conditions?: { name: string; probability: number }[];
  biomarkers?: { name: string; value: number; unit?: string; status?: string; normal_min?: number; normal_max?: number }[];
  scanSections?: { title: string; findings: string[] }[];
}

/* ── Theme order for cycling ── */
const themeOrder: ThemeName[] = ['dark', 'light', 'cyberpunk', 'medical', 'aurora'];

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
  const [theme, setThemeState] = useState<ThemeName>('dark');
  const [cinematicDone, setCinematicDone] = useState(false);
  const [bootDone, setBootDone] = useState(false);
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
    gsap.to('body', { duration: 0.6, ease: 'power2.inOut' });
  }, []);

  const toggleTheme = useCallback(() => {
    const idx = themeOrder.indexOf(theme);
    setTheme(themeOrder[(idx + 1) % themeOrder.length]);
  }, [theme, setTheme]);

  const currentTheme = themes[theme];
  const themeVars = currentTheme.vars as React.CSSProperties;

  useEffect(() => {
    const saved = localStorage.getItem('curasense_theme') as ThemeName | null;
    if (saved && themes[saved]) setThemeState(saved);
  }, []);

  // ── On authentication: sync settings from DB then load predictions ─────────
  useEffect(() => {
    if (isAuthenticated) {
      const userRaw = localStorage.getItem('curasense_user');
      if (userRaw) setIsAdmin(JSON.parse(userRaw).role === 'admin');

      // Fetch user settings from MongoDB — overwrites localStorage L1 cache.
      // Non-blocking: predictions load in parallel.
      syncFromDB();

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
      });
    }
  }, [isAuthenticated, syncFromDB]);

  /* ── PAGE TRANSITION ── */
  useEffect(() => {
    if (!isAuthenticated || !cinematicDone) return;
    const main = document.getElementById('page-content');
    if (!main) return;

    const tween = gsap.fromTo(
      main,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out', clearProps: 'transform,opacity' }
    );

    return () => {
      tween.kill();
      gsap.set(main, { clearProps: 'transform,opacity,clipPath,filter' });
    };
  }, [activeTab, isAuthenticated, cinematicDone]);

  /* ── SCROLL PROGRESS RAIL ── */
  useEffect(() => {
    if (!isAuthenticated || !cinematicDone) return;
    const rail = scrollRailRef.current;
    if (!rail) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? doc.scrollTop / max : 0;
      gsap.to(rail, { scaleX: ratio, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAuthenticated, cinematicDone]);

  /* ── HEADER DENSIFICATION ── */
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

  /* ── NAV PILL INDICATOR (FLIP-style) ── */
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
    const btnBox  = active.getBoundingClientRect();

    gsap.to(pill, {
      x: btnBox.left - listBox.left,
      y: btnBox.top  - listBox.top,
      width: btnBox.width,
      height: btnBox.height,
      opacity: 1,
      duration: 0.55,
      ease: 'expo.out',
    });
  }, [activeTab, isAuthenticated, cinematicDone]);

  /* ── MOBILE DRAWER ── */
  useEffect(() => {
    const drawer = mobileDrawerRef.current;
    if (!drawer) return;

    if (mobileMenuOpen) {
      gsap.set(drawer, { display: 'flex' });
      gsap.fromTo(drawer,
        { opacity: 0, clipPath: 'circle(0% at 95% 5%)' },
        { opacity: 1, clipPath: 'circle(150% at 95% 5%)', duration: 0.7, ease: 'expo.out' }
      );
      gsap.fromTo(drawer.querySelectorAll('[data-drawer-item]'),
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
    setActiveTab('booking');
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
  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
        {!bootDone && <SystemBootSequence onComplete={() => setBootDone(true)} />}
        <div style={themeVars}>
          <ThreeBackground />
          <ParticleField count={typeof window !== 'undefined' && window.innerWidth < 768 ? 14 : 26} />
          <FluidGradient colors={[currentTheme.vars['--accent-cyan'], currentTheme.vars['--accent-violet'], '#ec4899', '#10b981']} />
          <CustomCursor />
          <InteractionLayer />
          <ElementTransitions />
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
      {!cinematicDone && <CinematicSequence onComplete={() => setCinematicDone(true)} />}

      <SmoothScroll>
        <div
          className="min-h-screen relative overflow-hidden transition-colors duration-500 text-[--text-primary]"
          style={themeVars}
        >
          <ParticleField count={typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 60} />
          <FluidGradient colors={[currentTheme.vars['--accent-cyan'], currentTheme.vars['--accent-violet'], '#ec4899', '#10b981']} />
          <CustomCursor />
          <InteractionLayer />
          <ElementTransitions />

          <div className="relative z-10" style={{ background: 'radial-gradient(ellipse 90% 45% at 20% -5%, rgba(139,92,246,0.18) 0%, rgba(34,211,238,0.06) 40%, transparent 65%)' }}>
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
              className="sticky top-0 z-50 backdrop-blur-2xl border-b transition-[padding] duration-300"
              style={{ background: 'var(--header-bg)', borderColor: 'var(--border-color)' }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-60"
                style={{ background: 'linear-gradient(90deg, transparent 0%, var(--accent-cyan) 30%, var(--accent-violet) 70%, transparent 100%)' }}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
                <MagneticCard intensity={6} perspective={600} onClick={() => setActiveTab('dashboard')}>
                  <div
                    role="button"
                    aria-label="Go to Dashboard"
                    tabIndex={0}
                    onKeyDown={(e: { key: string; preventDefault: () => void }) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab('dashboard'); }
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
                        style={{ fontFamily: "'Michroma', sans-serif", backgroundImage: 'linear-gradient(120deg, var(--text-primary) 0%, var(--accent-violet) 50%, var(--accent-cyan) 100%)' }}
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
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.5) 0%, rgba(34,211,238,0.22) 55%, rgba(139,92,246,0.18) 100%)',
                        border: '1px solid rgba(139,92,246,0.58)',
                        boxShadow: '0 0 30px -4px rgba(139,92,246,0.8),0 0 14px -4px rgba(34,211,238,0.5),inset 0 1px 0 rgba(255,255,255,0.22),inset 0 0 24px rgba(139,92,246,0.08)',
                      }}
                    />

                    {navItems.filter(n => !n.cta).map(({ id, label, icon: Icon }) => {
                      const isActive = activeTab === id;
                      const accent   = NAV_ACCENTS[id] ?? '#8b5cf6';
                      return (
                        <button
                          key={id}
                          data-nav-id={id}
                          onClick={() => setActiveTab(id)}
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
                        onClick={() => setActiveTab(id)}
                        onMouseEnter={e => gsap.to(e.currentTarget, { y: -2, scale: 1.03, duration: 0.2, ease: 'power2.out' })}
                        onMouseLeave={e => gsap.to(e.currentTarget, { y: 0,  scale: 1,    duration: 0.2, ease: 'power2.out' })}
                        className="relative flex items-center gap-1.5 px-4 py-2"
                        style={{
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 55%, #06b6d4 100%)',
                          border: isActive ? '1px solid rgba(34,211,238,0.65)' : '1px solid rgba(139,92,246,0.55)',
                          boxShadow: isActive
                            ? '0 0 32px -4px rgba(139,92,246,0.95), 0 0 18px -4px rgba(34,211,238,0.65), inset 0 1px 0 rgba(255,255,255,0.25)'
                            : '0 0 22px -6px rgba(139,92,246,0.65), 0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
                          color: '#fff', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.02em',
                          cursor: 'pointer', transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                        }}
                      >
                        <span aria-hidden className="animate-ping absolute inset-0 pointer-events-none" style={{ borderRadius: '14px', background: 'rgba(139,92,246,0.18)', animationDuration: '2.8s' }} />
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
                  <UserProfile predictionsCount={predictions.length} onNavigate={setActiveTab} onLogout={handleLogout} onMyBookings={handleMyBookings} />
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
              className="fixed inset-0 z-[55] flex-col items-center justify-center gap-2 px-6 hidden"
              style={{
                background: 'radial-gradient(120% 120% at 95% 5%, color-mix(in srgb, var(--accent-violet) 35%, transparent), color-mix(in srgb, var(--accent-cyan) 18%, transparent) 40%, var(--header-bg) 75%)',
                backdropFilter: 'blur(32px) saturate(180%)',
              }}
            >
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  data-drawer-item
                  onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
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
              <p data-drawer-item className="mt-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>
                CuraSense — {t('app.tagline')}
              </p>
            </div>

            {/* ── Main Content ── */}
            <main id="page-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {activeTab === 'dashboard' && (
                <Dashboard predictions={predictions} onNavigate={setActiveTab} />
              )}

              {activeTab === 'analyze' && (
                <div>
                  <div className="mb-8" data-reveal>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: "'Michroma', sans-serif" }}>
                      {t('page.analyze.title')}
                    </h2>
                    <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                      {t('page.analyze.subtitle')}
                    </p>
                  </div>
                  <Tabs defaultValue="symptoms" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid rounded-2xl p-1 glass">
                      {[
                        { value: 'symptoms', label: t('page.analyze.symptoms'), icon: Activity },
                        { value: 'image',    label: t('page.analyze.scans'),    icon: Brain    },
                        { value: 'report',   label: t('page.analyze.reports'),  icon: FileText },
                      ].map(({ value, label, icon: Icon }) => (
                        <TabsTrigger key={value} value={value} className="gap-2 text-[--text-secondary] data-[state=active]:text-white">
                          <Icon className="w-4 h-4" />{' '}
                          <span className="hidden sm:inline">{label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value="symptoms"><SymptomChecker onPrediction={addPrediction} /></TabsContent>
                    <TabsContent value="image"><ImageAnalysis onPrediction={addPrediction} /></TabsContent>
                    <TabsContent value="report"><ReportAnalysis onPrediction={addPrediction} /></TabsContent>
                  </Tabs>
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <div className="mb-8" data-reveal>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: "'Michroma', sans-serif" }}>
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
                  <ConsultationBooking predictions={predictions} onNavigate={setActiveTab} initialView={bookingInitialView} />
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <div className="mb-8" data-reveal>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: "'Michroma', sans-serif" }}>
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
      </SmoothScroll>
    </ThemeContext.Provider>
  );
}
