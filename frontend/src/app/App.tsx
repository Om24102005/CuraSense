/* ═══════════════════════════════════════════════════════
   CuraSense — GOD-LEVEL App Shell
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { SymptomChecker } from './components/SymptomChecker';
import { ImageAnalysis } from './components/ImageAnalysis';
import { ReportAnalysis } from './components/ReportAnalysis';
import { PredictionHistory } from './components/PredictionHistory';
import { Dashboard } from './components/Dashboard';
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

  useEffect(() => {
    if (!isAuthenticated || !cinematicDone) return;
    const main = document.getElementById('page-content');
    if (!main) return;
    gsap.fromTo(
      main,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }
    );
  }, [activeTab, isAuthenticated, cinematicDone]);

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
          <ParticleField count={4000} />
          <FluidGradient
            colors={[
              currentTheme.vars['--accent-cyan'],
              currentTheme.vars['--accent-violet'],
              '#ec4899',
              '#10b981',
            ]}
          />
          <CustomCursor />
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
          <ParticleField count={5000} />
          <FluidGradient
            colors={[
              currentTheme.vars['--accent-cyan'],
              currentTheme.vars['--accent-violet'],
              '#ec4899',
              '#10b981',
            ]}
          />
          <CustomCursor />

          <div className="relative z-10">
            {/* ── Header ── */}
            <header
              className="sticky top-0 z-50 backdrop-blur-2xl border-b"
              style={{
                background: 'var(--header-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
                {/* Logo */}
                <MagneticCard intensity={6} perspective={600}>
                  <div className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))`,
                      }}
                    >
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1
                        className="text-xl font-bold tracking-wide"
                        style={{ fontFamily: "'Michroma', sans-serif" }}
                      >
                        CuraSense
                      </h1>
                      <p
                        className="text-[10px] uppercase tracking-[0.25em] hidden sm:block mt-0.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        AI Diagnostic Suite
                      </p>
                    </div>
                  </div>
                </MagneticCard>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-1">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background:
                          activeTab === id
                            ? 'var(--nav-active-bg)'
                            : 'transparent',
                        color:
                          activeTab === id
                            ? 'var(--accent-violet)'
                            : 'var(--text-secondary)',
                        border:
                          activeTab === id
                            ? '1px solid var(--accent-violet)'
                            : '1px solid transparent',
                      }}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
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
                    className="md:hidden p-2 rounded-xl border text-[--text-primary]"
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
                  <div className="mb-8">
                    <ScrambleText
                      text="AI-Powered Analysis"
                      as="h2"
                      className="text-3xl font-bold mb-2"
                      style={{ fontFamily: "'Michroma', sans-serif" }}
                    />
                    <p style={{ color: 'var(--text-secondary)' }}>
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
                  <div className="mb-8">
                    <ScrambleText
                      text="Analysis History"
                      as="h2"
                      className="text-3xl font-bold mb-2"
                      style={{ fontFamily: "'Michroma', sans-serif" }}
                    />
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Review all your previous medical analyses
                    </p>
                  </div>
                  <PredictionHistory predictions={predictions} onLike={toggleLike} />
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <div className="mb-8">
                    <ScrambleText
                      text="Settings"
                      as="h2"
                      className="text-3xl font-bold mb-2"
                      style={{ fontFamily: "'Michroma', sans-serif" }}
                    />
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Manage your preferences and account
                    </p>
                  </div>
                  <Settings />
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
