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
import ThreeBackground from './components/ThreeBackground';
import { ThemeToggleButton } from './components/ThemeToggleButton';
import { CustomCursor } from './components/CustomCursor';
import { UserProfile } from './components/UserProfile';
import { getPredictions, savePrediction } from './utils/api';
import gsap from 'gsap';

export type Theme = 'dark' | 'light';
export const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

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
      if (userRaw) {
        const u = JSON.parse(userRaw);
        setIsAdmin(u.role === 'admin');
      }

      const fetchHistory = async () => {
        const response = await getPredictions();
        if (response.data && response.data.predictions) {
          const formattedData = response.data.predictions.map((p: any) => ({
            ...p,
            id: p._id || p.id
          }));
          setPredictions(formattedData);
        }
      };
      fetchHistory();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const main = document.getElementById('page-content');
    if (!main) return;
    gsap.fromTo(main,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }
    );
  }, [activeTab, isAuthenticated]);

  const addPrediction = async (prediction: Omit<Prediction, 'id' | 'timestamp'>) => {
    const response = await savePrediction(prediction);
    if (response.data) {
      const newPrediction = { ...response.data, id: response.data._id };
      setPredictions(prev => [newPrediction, ...prev]);
    }
  };

  const toggleLike = (id: string) => {
    setPredictions(predictions.map(p =>
      p.id === id ? { ...p, liked: !p.liked } : p
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('curasense_token');
    localStorage.removeItem('curasense_user');
    window.location.reload();
  };

  useEffect(() => {
    if (isAuthenticated) {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('header', { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, delay: 0.2 })
        .fromTo('.lucide', { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.8')
        .fromTo('main > div', { y: 60, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15 }, '-=0.6');

      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
        });
      });
    }
  }, [isAuthenticated, activeTab]);

  const darkVars: React.CSSProperties = {
    ['--bg-base' as string]: '#000005',
    ['--bg-surface' as string]: 'rgba(10,10,24,0.65)',
    ['--bg-card' as string]: 'rgba(14,14,30,0.75)',
    ['--border-color' as string]: 'rgba(255,255,255,0.10)',
    ['--text-primary' as string]: '#ffffff',
    ['--text-secondary' as string]: 'rgba(255,255,255,0.65)',
    ['--text-muted' as string]: 'rgba(255,255,255,0.38)',
    ['--accent-cyan' as string]: '#22d3ee',
    ['--accent-violet' as string]: '#8b5cf6',
    ['--accent-fuchsia' as string]: '#d946ef',
    ['--header-bg' as string]: 'rgba(5,5,14,0.80)',
    ['--footer-bg' as string]: 'rgba(5,5,14,0.88)',
    ['--nav-active-bg' as string]: 'rgba(139,92,246,0.20)',
    ['--input-bg' as string]: 'rgba(8,8,20,0.60)',
    ['--scrollbar-thumb' as string]: 'rgba(255,255,255,0.15)',
  };

  const lightVars: React.CSSProperties = {
    ['--bg-base' as string]: '#f8faff',
    ['--bg-surface' as string]: 'rgba(255,255,255,0.95)',
    ['--bg-card' as string]: 'rgba(255,255,255,0.98)',
    ['--border-color' as string]: 'rgba(0,0,0,0.10)',
    ['--text-primary' as string]: '#0a0a1a',
    ['--text-secondary' as string]: 'rgba(10,10,26,0.72)',
    ['--text-muted' as string]: 'rgba(10,10,26,0.48)',
    ['--accent-cyan' as string]: '#0284c7',
    ['--accent-violet' as string]: '#6d28d9',
    ['--accent-fuchsia' as string]: '#9333ea',
    ['--header-bg' as string]: 'rgba(255,255,255,0.95)',
    ['--footer-bg' as string]: 'rgba(248,250,255,0.97)',
    ['--nav-active-bg' as string]: 'rgba(109,40,217,0.10)',
    ['--input-bg' as string]: 'rgba(248,250,255,0.95)',
    ['--scrollbar-thumb' as string]: 'rgba(0,0,0,0.18)',
  };

  const themeVars = isDark ? darkVars : lightVars;
  const textPrimary = 'text-[--text-primary]';
  const borderColor = 'border-[--border-color]';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze',   label: 'Analyze',   icon: Activity },
    { id: 'history',   label: 'History',   icon: History },
    { id: 'settings',  label: 'Settings',  icon: SettingsIcon },
  ];
  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Overwatch', icon: ShieldAlert });
  }

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div style={themeVars as React.CSSProperties}>
          {!isDark && (
            <div
              className="fixed inset-0 z-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #dde8ff 0%, #f0f5ff 40%, #f5eeff 70%, #edf9f5 100%)', opacity: 0.95 }}
            />
          )}
          <CustomCursor />
          <ThreeBackground />
          <div className="relative z-10 min-h-screen">
            <WelcomeScreen onAuthenticate={() => setIsAuthenticated(true)} />
          </div>
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${textPrimary}`}
        style={themeVars as React.CSSProperties}
      >
        <CustomCursor />
        
        {!isDark && (
          <div
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #dde8ff 0%, #f5f9ff 35%, #f5eeff 70%, #e8f8f5 100%)', opacity: 0.92 }}
          />
        )}
        <ThreeBackground />

        <div className="relative z-10">
          <header
            className={`sticky top-0 z-50 backdrop-blur-2xl border-b ${borderColor}`}
            style={{
              background: 'var(--header-bg)',
              boxShadow: isDark ? '0 4px 30px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">

                <div className="flex items-center gap-3 cursor-pointer">
                  <div
                    className="p-3 rounded-xl transition-transform duration-300 hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
                      boxShadow: isDark ? '0 0 20px rgba(139,122,255,0.4)' : '0 4px 16px rgba(109,40,217,0.3)',
                    }}
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1
                      className="text-xl font-bold tracking-wide"
                      style={{ fontFamily: "'Michroma', sans-serif", color: 'var(--text-primary)', letterSpacing: '0.04em', fontWeight: 400 }}
                    >
                      CuraSense
                    </h1>
                    <p
                      className="text-[10px] uppercase tracking-[0.25em] hidden sm:block mt-0.5"
                      style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-muted)' }}
                    >
                      AI Diagnostic Suite
                    </p>
                  </div>
                </div>

                <nav className="hidden md:flex items-center gap-1">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                      style={{
                        background: activeTab === id ? (id === 'admin' ? 'rgba(217,70,239,0.15)' : 'var(--nav-active-bg)') : 'transparent',
                        color: activeTab === id ? (id === 'admin' ? '#d946ef' : 'var(--accent-violet)') : 'var(--text-secondary)',
                        border: activeTab === id ? `1px solid ${id === 'admin' ? '#d946ef' : 'var(--accent-violet)'}` : '1px solid transparent',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </nav>

                <div className="flex items-center gap-2">
                  <UserProfile 
                    predictionsCount={predictions.length} 
                    onNavigate={setActiveTab}
                    onLogout={handleLogout}
                  />
                  <ThemeToggleButton />

                  <button
                    className="md:hidden p-2 rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {mobileMenuOpen && (
                <div className={`md:hidden pb-4 border-t mt-2 pt-4 ${borderColor}`}>
                  <div className="flex flex-col gap-1">
                    {navItems.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: activeTab === id ? (id === 'admin' ? 'rgba(217,70,239,0.15)' : 'var(--nav-active-bg)') : 'transparent',
                          color: activeTab === id ? (id === 'admin' ? '#d946ef' : 'var(--text-secondary)') : 'var(--text-secondary)',
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          <main id="page-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {activeTab === 'admin' && isAdmin && (
              <AdminDashboard />
            )}

            {activeTab === 'analyze' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Michroma', sans-serif", color: 'var(--text-primary)', letterSpacing: '0.01em', fontWeight: 400 }}>
                    AI-Powered Analysis
                  </h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Choose an analysis method to get started</p>
                </div>
                <Tabs defaultValue="symptoms" className="space-y-6">
                  <TabsList
                    className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid rounded-2xl p-1"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {[
                      { value: 'symptoms', label: 'Symptoms', icon: Activity },
                      { value: 'image',    label: 'Scans',    icon: Brain },
                      { value: 'report',   label: 'Reports',  icon: FileText },
                    ].map(({ value, label, icon: Icon }) => (
                      <TabsTrigger
                        key={value}
                        value={value}
                        className="gap-2 data-[state=active]:text-white"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Icon className="w-4 h-4" />
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

            {activeTab === 'dashboard' && (
              <Dashboard predictions={predictions} onNavigate={setActiveTab} />
            )}

            {activeTab === 'history' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Michroma', sans-serif", color: 'var(--text-primary)', letterSpacing: '0.01em', fontWeight: 400 }}>
                    Analysis History
                  </h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Review all your previous medical analyses</p>
                </div>
                <PredictionHistory predictions={predictions} onLike={toggleLike} />
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Michroma', sans-serif", color: 'var(--text-primary)', letterSpacing: '0.01em', fontWeight: 400 }}>
                    Settings
                  </h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Manage your preferences and account</p>
                </div>
                <Settings />
              </div>
            )}
          </main>

          <footer
            className={`mt-16 border-t ${borderColor}`}
            style={{ background: 'var(--footer-bg)', backdropFilter: 'blur(20px)' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))' }}
                    >
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>CuraSense</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Advanced AI-powered disease prediction and medical analysis platform.
                  </p>
                </div>
                {[
                  { heading: 'Features', items: ['Symptom Analysis', 'Medical Scan Review', 'Lab Report Analysis', 'Prediction History'] },
                  { heading: 'Resources', items: ['Documentation', 'API Reference', 'Privacy Policy', 'Terms of Service'] },
                  { heading: 'Support',   items: ['Help Center', 'Contact Us', 'FAQ', 'Community'] },
                ].map(({ heading, items }) => (
                  <div key={heading}>
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{heading}</h4>
                    <ul className="space-y-2 text-sm">
                      {items.map(item => (
                        <li key={item} style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 cursor-pointer transition-opacity">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className={`border-t pt-6 ${borderColor}`}>
                <p className="text-center text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  ⚠️ <strong>Medical Disclaimer:</strong> This is an AI-powered diagnostic assistance tool for informational purposes only. Always consult with qualified healthcare professionals.
                </p>
                <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  © 2026 CuraSense. All rights reserved. | Powered by Advanced Machine Learning
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}