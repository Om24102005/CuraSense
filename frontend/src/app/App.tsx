import { useState, useEffect, createContext, useContext } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { SymptomChecker } from './components/SymptomChecker';
import { ImageAnalysis } from './components/ImageAnalysis';
import { ReportAnalysis } from './components/ReportAnalysis';
import { PredictionHistory } from './components/PredictionHistory';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { Activity, Brain, FileText, History, LayoutDashboard, Settings as SettingsIcon, ShieldAlert, Menu, X } from 'lucide-react';
import ScrollThreeBackground from './components/ScrollThreeBackground';
import { ThemeToggleButton } from './components/ThemeToggleButton';
import { CustomCursor } from './components/CustomCursor';
import { UserProfile } from './components/UserProfile';
import { getPredictions, savePrediction } from './utils/api';
import gsap from 'gsap';

export type Theme = 'dark' | 'light';
export const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export interface Prediction {
  id: string; type: 'symptom' | 'image' | 'report'; timestamp: Date;
  diagnosis: string; confidence: number; details: string; recommendations: string[]; liked?: boolean;
}

export default function App() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('curasense_token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      gsap.to('body', { duration: 0.4, ease: 'power2.inOut' });
      return next;
    });
  };

  const isDark = theme === 'dark';

  useEffect(() => {
    if (isAuthenticated) {
      const userRaw = localStorage.getItem('curasense_user');
      if (userRaw) setIsAdmin(JSON.parse(userRaw).role === 'admin');
      getPredictions().then(res => {
        if (res.data?.predictions) setPredictions(res.data.predictions.map((p: any) => ({ ...p, id: p._id || p.id })));
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const main = document.getElementById('page-content');
    if (!main) return;
    gsap.fromTo(main, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' });
  }, [activeTab, isAuthenticated]);

  const addPrediction = async (prediction: Omit<Prediction, 'id' | 'timestamp'>) => {
    const response = await savePrediction(prediction);
    if (response.data) setPredictions(prev => [{ ...response.data, id: response.data._id }, ...prev]);
  };

  const toggleLike = (id: string) => setPredictions(predictions.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  const handleLogout = () => { localStorage.clear(); window.location.reload(); };

  const darkVars: React.CSSProperties = {
    ['--bg-base' as string]: '#000005', ['--bg-surface' as string]: 'rgba(10,10,24,0.65)',
    ['--bg-card' as string]: 'rgba(14,14,30,0.75)', ['--border-color' as string]: 'rgba(255,255,255,0.10)',
    ['--text-primary' as string]: '#ffffff', ['--text-secondary' as string]: 'rgba(255,255,255,0.65)',
    ['--text-muted' as string]: 'rgba(255,255,255,0.38)', ['--accent-cyan' as string]: '#22d3ee',
    ['--accent-violet' as string]: '#8b5cf6', ['--header-bg' as string]: 'rgba(5,5,14,0.80)',
    ['--footer-bg' as string]: 'rgba(5,5,14,0.88)', ['--nav-active-bg' as string]: 'rgba(139,92,246,0.20)',
  };

  const lightVars: React.CSSProperties = {
    ['--bg-base' as string]: '#f8faff', ['--bg-surface' as string]: 'rgba(255,255,255,0.95)',
    ['--bg-card' as string]: 'rgba(255,255,255,0.98)', ['--border-color' as string]: 'rgba(0,0,0,0.10)',
    ['--text-primary' as string]: '#0a0a1a', ['--text-secondary' as string]: 'rgba(10,10,26,0.72)',
    ['--text-muted' as string]: 'rgba(10,10,26,0.48)', ['--accent-cyan' as string]: '#0284c7',
    ['--accent-violet' as string]: '#6d28d9', ['--header-bg' as string]: 'rgba(255,255,255,0.95)',
    ['--footer-bg' as string]: 'rgba(248,250,255,0.97)', ['--nav-active-bg' as string]: 'rgba(109,40,217,0.10)',
  };

  const themeVars = isDark ? darkVars : lightVars;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze',   label: 'Analyze',   icon: Activity },
    { id: 'history',   label: 'History',   icon: History },
    { id: 'settings',  label: 'Settings',  icon: SettingsIcon },
    ...(isAdmin ? [{ id: 'admin', label: 'Overwatch', icon: ShieldAlert }] : [])
  ];

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div style={themeVars as React.CSSProperties}>
          {!isDark && <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, #dde8ff 0%, #f0f5ff 40%, #f5eeff 70%, #edf9f5 100%)', opacity: 0.95 }} />}
          <CustomCursor />
          <ScrollThreeBackground />
          <div className="relative z-10 min-h-screen"><WelcomeScreen onAuthenticate={() => setIsAuthenticated(true)} /></div>
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen relative overflow-hidden transition-colors duration-500 text-[--text-primary]" style={themeVars as React.CSSProperties}>
        <CustomCursor />
        {!isDark && <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, #dde8ff 0%, #f5f9ff 35%, #f5eeff 70%, #e8f8f5 100%)', opacity: 0.92 }} />}
        <ScrollThreeBackground />

        <div className="relative z-10">
          <header className="sticky top-0 z-50 backdrop-blur-2xl border-b border-[--border-color]" style={{ background: 'var(--header-bg)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))' }}>
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-wide" style={{ fontFamily: "'Michroma', sans-serif", color: 'var(--text-primary)' }}>CuraSense</h1>
                  <p className="text-[10px] uppercase tracking-[0.25em] hidden sm:block mt-0.5" style={{ color: 'var(--text-muted)' }}>AI Diagnostic Suite</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id} onClick={() => setActiveTab(id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: activeTab === id ? 'var(--nav-active-bg)' : 'transparent',
                      color: activeTab === id ? 'var(--accent-violet)' : 'var(--text-secondary)',
                      border: activeTab === id ? '1px solid var(--accent-violet)' : '1px solid transparent',
                    }}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <UserProfile predictionsCount={predictions.length} onNavigate={setActiveTab} onLogout={handleLogout} />
                <ThemeToggleButton />
                <button className="md:hidden p-2 rounded-xl border border-[--border-color] text-[--text-primary]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </header>

          <main id="page-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {activeTab === 'dashboard' && <Dashboard predictions={predictions} onNavigate={setActiveTab} />}
            {activeTab === 'analyze' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-[--text-primary]" style={{ fontFamily: "'Michroma', sans-serif" }}>AI-Powered Analysis</h2>
                  <p className="text-[--text-secondary]">Choose an analysis method to get started</p>
                </div>
                <Tabs defaultValue="symptoms" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid rounded-2xl p-1 bg-[--bg-surface] border border-[--border-color]">
                    {[ { value: 'symptoms', label: 'Symptoms', icon: Activity }, { value: 'image', label: 'Scans', icon: Brain }, { value: 'report', label: 'Reports', icon: FileText } ].map(({ value, label, icon: Icon }) => (
                      <TabsTrigger key={value} value={value} className="gap-2 text-[--text-secondary] data-[state=active]:text-white">
                        <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{label}</span>
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
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-[--text-primary]" style={{ fontFamily: "'Michroma', sans-serif" }}>Analysis History</h2>
                  <p className="text-[--text-secondary]">Review all your previous medical analyses</p>
                </div>
                <PredictionHistory predictions={predictions} onLike={toggleLike} />
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-[--text-primary]" style={{ fontFamily: "'Michroma', sans-serif" }}>Settings</h2>
                  <p className="text-[--text-secondary]">Manage your preferences and account</p>
                </div>
                <Settings />
              </div>
            )}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}