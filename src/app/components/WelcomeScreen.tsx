import { useState, useEffect, useRef } from 'react';
import { Zap, ArrowRight, ActivitySquare, User, Lock, Mail, ShieldCheck, AlertCircle, RefreshCw, Cpu, Database, Globe, Layers, Activity, Network, Fingerprint, ChevronDown } from 'lucide-react';
import { Card } from './ui/card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeToggleButton } from './ThemeToggleButton';
import { useTheme } from '../App';
import { LoadingScreen } from './LoadingScreen';
import { login, register, forgotPassword } from '../utils/api';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface WelcomeScreenProps {
  onAuthenticate: () => void;
}

export function WelcomeScreen({ onAuthenticate }: WelcomeScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [authMode, setAuthMode] = useState<'none' | 'login' | 'register' | 'forgot'>('none');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (isSuccess) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.hero-text', { y: 100, opacity: 0, rotateX: 45 }, { y: 0, opacity: 1, rotateX: 0, duration: 1.5, stagger: 0.1 })
        .fromTo('.gpanel', { x: 100, opacity: 0, scale: 0.9 }, { x: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.15 }, '-=1')
        .fromTo('.uline', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 1.2, ease: 'power4.inOut' }, '-=0.8')
        .fromTo('.fade-up', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, '-=0.6');

      const magnets = document.querySelectorAll('.mag');
      magnets.forEach(mag => {
        mag.addEventListener('mousemove', (e: Event) => {
          const me = e as MouseEvent;
          const rect = (mag as HTMLElement).getBoundingClientRect();
          const x = me.clientX - rect.left - rect.width / 2;
          const y = me.clientY - rect.top - rect.height / 2;
          gsap.to(mag, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
        });
        mag.addEventListener('mouseleave', () => {
          gsap.to(mag, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
        });
      });

      const sections = document.querySelectorAll('.scroll-section');
      sections.forEach((sec, i) => {
        if (i === 0) return;
        
        gsap.fromTo(sec.querySelectorAll('.sec-title'),
          { y: 100, opacity: 0 },
          { 
            y: 0, opacity: 1, duration: 1.5, ease: 'expo.out',
            scrollTrigger: { trigger: sec, start: 'top 75%' }
          }
        );

        gsap.fromTo(sec.querySelectorAll('.sec-card'),
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: sec, start: 'top 70%' }
          }
        );
      });

      document.querySelectorAll('.stat-number').forEach((el) => {
        const target = parseFloat(el.getAttribute('data-val') || '0');
        const isFloat = target % 1 !== 0;
        const obj = { v: 0 };
        
        gsap.to(obj, {
          v: target,
          duration: 3,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '#section-stats',
            start: 'top 60%',
            once: true
          },
          onUpdate: () => {
            el.innerHTML = isFloat ? obj.v.toFixed(1) : Math.round(obj.v).toString();
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isSuccess]);

  const switchAuthMode = (mode: 'none' | 'login' | 'register' | 'forgot') => {
    if (!panelRef.current) return;
    setError('');
    setSuccessMsg('');
    gsap.to(panelRef.current, {
      rotateY: 90,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setAuthMode(mode);
        gsap.fromTo(panelRef.current,
          { rotateY: -90, opacity: 0 },
          { rotateY: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }
        );
      }
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsAuthenticating(true);

    if (authMode === 'forgot') {
      const response = await forgotPassword(formData.email);
      setIsAuthenticating(false);
      if (response.error) setError(response.error);
      else {
        setSuccessMsg(response.data.message);
        setTimeout(() => switchAuthMode('login'), 3000);
      }
      return;
    }

    const response = authMode === 'login' 
      ? await login({ email: formData.email, password: formData.password }) 
      : await register(formData);

    if (response.error) {
      setError(response.error);
      setIsAuthenticating(false);
    } else {
      localStorage.setItem('curasense_token', response.data.token);
      localStorage.setItem('curasense_user', JSON.stringify(response.data.user));
      setIsAuthenticating(false);
      setIsSuccess(true);
      setTimeout(() => onAuthenticate(), 3500);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";

  const T = isDark ? {
    bg: 'transparent', logoName: '#f1f5f9', logoSub: '#22d3ee',
    iconBg: 'rgba(15,15,25,0.6)', iconBdr: 'rgba(255,255,255,0.10)',
    onlineBg: 'rgba(0,200,80,0.07)', onlineClr: '#4ade80', onlineBdr: 'rgba(74,222,128,0.20)',
    h1a: '#67e8f9', h1b: '#e0f2fe', h2a: '#a78bfa', h2b: '#f0abfc', h3a: '#f0abfc', h3b: '#fdf4ff',
    divider: 'rgba(34,211,238,0.35)', body: 'rgba(241,245,249,0.70)',
    cardBg: 'rgba(10,10,22,0.80)', cardBdr: 'rgba(255,255,255,0.10)', cardShadow: '0 24px 60px rgba(0,0,0,0.70)', cardGlow: 'rgba(34,211,238,0.12)',
    initClr: 'rgba(255,255,255,0.32)', zapClr: '#d946ef', cardTitle: '#ffffff',
    btnBg: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)', btnShadow: '0 0 32px rgba(34,211,238,0.25)',
    secBtnBg: 'rgba(255,255,255,0.05)', secBtnBdr: 'rgba(255,255,255,0.15)',
    inpBg: 'rgba(255,255,255,0.05)', inpBdr: 'rgba(255,255,255,0.15)', text: '#ffffff',
    secTitle: '#ffffff', secText: 'rgba(255,255,255,0.6)',
  } : {
    bg: 'transparent', logoName: '#0a0a1a', logoSub: '#0284c7',
    iconBg: 'rgba(255,255,255,0.90)', iconBdr: 'rgba(0,0,0,0.10)',
    onlineBg: 'rgba(0,140,50,0.07)', onlineClr: '#166534', onlineBdr: 'rgba(22,101,52,0.20)',
    h1a: '#075985', h1b: '#0369a1', h2a: '#4c1d95', h2b: '#6d28d9', h3a: '#86198f', h3b: '#a21caf',
    divider: 'rgba(2,132,199,0.30)', body: 'rgba(10,10,26,0.65)',
    cardBg: 'rgba(255,255,255,0.92)', cardBdr: 'rgba(0,0,0,0.08)', cardShadow: '0 24px 50px rgba(0,0,0,0.10)', cardGlow: 'rgba(2,132,199,0.15)',
    initClr: 'rgba(0,0,0,0.40)', zapClr: '#7c3aed', cardTitle: '#0a0a1a',
    btnBg: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)', btnShadow: '0 8px 24px rgba(2,132,199,0.30)',
    secBtnBg: 'rgba(0,0,0,0.03)', secBtnBdr: 'rgba(0,0,0,0.10)',
    inpBg: 'rgba(0,0,0,0.03)', inpBdr: 'rgba(0,0,0,0.15)', text: '#0a0a1a',
    secTitle: '#0a0a1a', secText: 'rgba(0,0,0,0.6)',
  };

  const inpStyle = { width: '100%', padding: '1rem 1rem 1rem 3rem', background: T.inpBg, border: `1px solid ${T.inpBdr}`, borderRadius: '16px', color: T.text, fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s' };
  const iconStyle = { position: 'absolute' as any, left: '16px', top: '50%', transform: 'translateY(-50%)', color: T.initClr };

  if (isAuthenticating) return <LoadingScreen message="AUTHORIZING CONNECTION..." />;
  if (isSuccess) return <SuccessAnimation />;

  return (
    <div ref={containerRef} className="relative w-full" style={{ fontFamily: I, background: T.bg }}>
      
      <div id="section-hero" className="scroll-section min-h-screen relative flex flex-col" style={{ padding: '2rem 4rem' }}>
        <header className="flex justify-between items-center fade-up w-full max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="mag p-4 rounded-2xl backdrop-blur-xl cursor-pointer" style={{ background: T.iconBg, border: `1px solid ${T.iconBdr}` }}>
              <ActivitySquare className="w-8 h-8" style={{ color: T.logoSub }} />
            </div>
            <div>
              <div style={{ fontFamily: S, fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.logoName }}>CuraSense</div>
              <div style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: T.logoSub }}>Protocol_v2</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggleButton />
            <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-xl" style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: T.onlineBg, color: T.onlineClr, border: `1px solid ${T.onlineBdr}` }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.onlineClr }} /> System Online
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center max-w-[1600px] mx-auto w-full mt-12">
          <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-16">
            <div className="w-full max-w-3xl" style={{ perspective: '1000px' }}>
              <h1 className="hero-text" style={{ fontFamily: S, fontSize: 'clamp(3.2rem, 6.5vw, 6.5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: '0.1em', ...(isDark ? { background: `linear-gradient(100deg, ${T.h1a}, ${T.h1b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: T.h1a }) }}>CLINICAL</h1>
              <h1 className="hero-text" style={{ fontFamily: S, fontSize: 'clamp(3.2rem, 6.5vw, 6.5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: '0.1em', ...(isDark ? { background: `linear-gradient(100deg, ${T.h2a}, ${T.h2b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: T.h2a }) }}>PRECISION</h1>
              <h1 className="hero-text" style={{ fontFamily: S, fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '0.01em', marginBottom: '1rem', ...(isDark ? { background: `linear-gradient(100deg, ${T.h3a}, ${T.h3b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: T.h3a }) }}>REDEFINED.</h1>
              
              <div className="uline h-[2px] mt-8 mb-8 rounded-full" style={{ maxWidth: '300px', background: `linear-gradient(90deg, ${T.divider}, transparent)` }} />
              
              <p className="fade-up text-xl" style={{ fontWeight: 400, lineHeight: 1.8, color: T.body, maxWidth: '600px' }}>
                Harness the architecture of neural networks to process symptoms, radiological scans,
                and unstructured lab data — delivering absolute diagnostic clarity.
              </p>
              
              <div className="fade-up mt-12 flex items-center gap-6">
                <button onClick={() => scrollToSection('section-features')} className="mag px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all" style={{ background: T.secBtnBg, border: `1px solid ${T.secBtnBdr}`, color: T.logoName, fontFamily: S }}>
                  Explore Framework <ChevronDown className="inline w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            <div className="w-full max-w-md">
              <Card ref={panelRef} className="gpanel relative p-10 rounded-[2rem] backdrop-blur-2xl" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.cardShadow }}>
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ background: T.cardGlow }} />
                
                {error && (
                  <div className="absolute -top-16 left-0 w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold flex items-center justify-center gap-2 backdrop-blur-md">
                    <AlertCircle className="w-5 h-5" /> {error}
                  </div>
                )}
                {successMsg && (
                  <div className="absolute -top-16 left-0 w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center justify-center gap-2 backdrop-blur-md">
                    <ShieldCheck className="w-5 h-5" /> {successMsg}
                  </div>
                )}

                <div className="relative z-10">
                  {authMode === 'none' && (
                    <>
                      <div className="flex justify-between items-center mb-10">
                        <span style={{ fontFamily: S, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.initClr }}>Terminal Access</span>
                        <Zap className="w-5 h-5" style={{ color: T.zapClr }} />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, color: T.cardTitle, marginBottom: '2.5rem' }}>Access<br />Protocol</h3>
                      <div className="flex flex-col gap-4">
                        <button onClick={() => switchAuthMode('login')} className="mag w-full py-5 rounded-2xl text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97]" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow }}>
                          Login
                        </button>
                        <button onClick={() => switchAuthMode('register')} className="mag w-full py-5 rounded-2xl font-bold transition-all hover:bg-opacity-80 hover:scale-[1.03] active:scale-[0.97]" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.secBtnBg, border: `1px solid ${T.secBtnBdr}`, color: T.cardTitle }}>
                          Create Account
                        </button>
                      </div>
                    </>
                  )}

                  {authMode === 'login' && (
                    <form onSubmit={handleAuthSubmit}>
                      <div className="flex justify-between items-center mb-8">
                        <span style={{ fontFamily: S, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.initClr }}>Authentication</span>
                        <User className="w-5 h-5" style={{ color: T.zapClr }} />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '1.8rem', fontWeight: 900, color: T.cardTitle, marginBottom: '2rem' }}>Welcome Back</h3>
                      <div className="flex flex-col gap-5 mb-4">
                        <div style={{ position: 'relative' }}><Mail style={iconStyle} className="w-5 h-5" /><input type="text" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email or System ID" required style={inpStyle} /></div>
                        <div style={{ position: 'relative' }}><Lock style={iconStyle} className="w-5 h-5" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password" required style={inpStyle} /></div>
                      </div>
                      <div className="flex justify-end mb-6">
                        <button type="button" onClick={() => switchAuthMode('forgot')} style={{ fontSize: '0.8rem', color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>Forgot Protocol?</button>
                      </div>
                      <button type="submit" className="mag w-full py-5 rounded-2xl text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97] mb-4" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow }}>
                        Authenticate <ArrowRight className="inline w-5 h-5 ml-2" />
                      </button>
                      <div className="text-center">
                        <button type="button" onClick={() => switchAuthMode('none')} style={{ fontSize: '0.8rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>← Back to Menu</button>
                      </div>
                    </form>
                  )}

                  {authMode === 'register' && (
                    <form onSubmit={handleAuthSubmit}>
                      <div className="flex justify-between items-center mb-8">
                        <span style={{ fontFamily: S, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.initClr }}>Registration</span>
                        <ShieldCheck className="w-5 h-5" style={{ color: T.zapClr }} />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '1.8rem', fontWeight: 900, color: T.cardTitle, marginBottom: '2rem' }}>Secure Access</h3>
                      <div className="flex flex-col gap-5 mb-8">
                        <div style={{ position: 'relative' }}><User style={iconStyle} className="w-5 h-5" /><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" required style={inpStyle} /></div>
                        <div style={{ position: 'relative' }}><Mail style={iconStyle} className="w-5 h-5" /><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email Address" required style={inpStyle} /></div>
                        <div style={{ position: 'relative' }}><Lock style={iconStyle} className="w-5 h-5" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password (Min 8)" required style={inpStyle} /></div>
                      </div>
                      <button type="submit" className="mag w-full py-5 rounded-2xl text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97] mb-4" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow }}>
                        Initialize <ArrowRight className="inline w-5 h-5 ml-2" />
                      </button>
                      <div className="text-center">
                        <button type="button" onClick={() => switchAuthMode('none')} style={{ fontSize: '0.8rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>← Back to Menu</button>
                      </div>
                    </form>
                  )}

                  {authMode === 'forgot' && (
                    <form onSubmit={handleAuthSubmit}>
                      <div className="flex justify-between items-center mb-8">
                        <span style={{ fontFamily: S, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.initClr }}>Recovery</span>
                        <RefreshCw className="w-5 h-5 text-emerald-500" />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '1.8rem', fontWeight: 900, color: T.cardTitle, marginBottom: '1rem' }}>Reset Protocol</h3>
                      <p style={{ fontSize: '0.9rem', color: T.secText, marginBottom: '2rem', lineHeight: 1.6 }}>Enter your registered email or System ID. We will transmit recovery details to your secure inbox.</p>
                      <div className="flex flex-col gap-5 mb-8">
                        <div style={{ position: 'relative' }}><Mail style={iconStyle} className="w-5 h-5" /><input type="text" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email or System ID" required style={inpStyle} /></div>
                      </div>
                      <button type="submit" className="mag w-full py-5 rounded-2xl text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97] mb-4" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                        Transmit Request <ArrowRight className="inline w-5 h-5 ml-2" />
                      </button>
                      <div className="text-center">
                        <button type="button" onClick={() => switchAuthMode('login')} style={{ fontSize: '0.8rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>← Back to Login</button>
                      </div>
                    </form>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div id="section-stats" className="scroll-section min-h-screen relative flex flex-col justify-center items-center py-32">
        <div ref={statsRef} className="max-w-[1600px] w-full px-8 mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { val: '99.9', label: 'DIAGNOSTIC ACCURACY %', icon: Activity },
            { val: '150', label: 'MILLION DATA POINTS', icon: Database },
            { val: '12', label: 'MILLISECOND LATENCY', icon: Zap }
          ].map((stat, i) => (
            <div key={i} className="sec-card flex flex-col items-center text-center p-12 rounded-[3rem] backdrop-blur-xl" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
              <stat.icon className="w-16 h-16 mb-8" style={{ color: T.logoSub }} />
              <div className="flex items-baseline gap-2 mb-4">
                <span className="stat-number" data-val={stat.val} style={{ fontFamily: S, fontSize: '6rem', fontWeight: 900, color: T.secTitle, lineHeight: 1 }}>0</span>
                {i === 0 && <span style={{ fontFamily: S, fontSize: '3rem', color: T.secTitle }}>%</span>}
                {i === 1 && <span style={{ fontFamily: S, fontSize: '3rem', color: T.secTitle }}>M+</span>}
                {i === 2 && <span style={{ fontFamily: S, fontSize: '3rem', color: T.secTitle }}>ms</span>}
              </div>
              <div style={{ fontFamily: S, fontSize: '1rem', fontWeight: 700, letterSpacing: '0.3em', color: T.secText }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div id="section-features" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto">
          <div className="sec-title mb-24 max-w-4xl">
            <h2 style={{ fontFamily: S, fontSize: '4.5rem', fontWeight: 900, color: T.secTitle, lineHeight: 1.1, marginBottom: '2rem' }}>TRIPLE VECTOR<br/>ANALYSIS</h2>
            <p style={{ fontSize: '1.5rem', color: T.secText, lineHeight: 1.6 }}>The CuraSense Protocol operates on three simultaneous modalities to ensure complete diagnostic superiority.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'SYMPTOMATICS', desc: 'NLP-driven contextual analysis of patient reported conditions mapped against global epidemiological databases.', icon: ActivitySquare },
              { title: 'RADIOLOGY', desc: 'Convolutional neural networks detecting micro-fractures, tumors, and anomalies in X-Ray, MRI, and CT scans.', icon: Layers },
              { title: 'PATHOLOGY', desc: 'Automated extraction and risk-assessment of complex blood work, genetic markers, and biochemical reports.', icon: Database }
            ].map((ft, i) => (
              <div key={i} className="sec-card p-12 rounded-[2.5rem] relative overflow-hidden group" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${T.cardGlow}, transparent 70%)` }} />
                <ft.icon className="w-16 h-16 mb-10 relative z-10" style={{ color: T.logoSub }} />
                <h3 className="relative z-10" style={{ fontFamily: S, fontSize: '1.8rem', fontWeight: 900, color: T.secTitle, marginBottom: '1.5rem', letterSpacing: '0.1em' }}>{ft.title}</h3>
                <p className="relative z-10" style={{ fontSize: '1.1rem', color: T.secText, lineHeight: 1.8 }}>{ft.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="section-howitworks" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto">
          <div className="sec-title text-center mb-24">
            <h2 style={{ fontFamily: S, fontSize: '4.5rem', fontWeight: 900, color: T.secTitle }}>EXECUTION PIPELINE</h2>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 hidden lg:block" style={{ background: `linear-gradient(90deg, transparent, ${T.divider}, transparent)` }} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {[
                { step: '01', title: 'INGESTION', desc: 'Secure upload of multi-format medical data into the encrypted CuraSense core.' },
                { step: '02', title: 'NORMALIZATION', desc: 'Data is standardized, artifacts removed, and tensors mapped for neural processing.' },
                { step: '03', title: 'INFERENCE', desc: 'Parallel processing across specialized models for instantaneous anomaly detection.' },
                { step: '04', title: 'SYNTHESIS', desc: 'Generation of a unified, comprehensive diagnostic report with confidence intervals.' }
              ].map((step, i) => (
                <div key={i} className="sec-card relative flex flex-col items-center text-center z-10">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 backdrop-blur-xl" style={{ background: T.cardBg, border: `2px solid ${T.logoSub}`, fontFamily: S, fontSize: '2rem', fontWeight: 900, color: T.secTitle }}>
                    {step.step}
                  </div>
                  <h4 style={{ fontFamily: S, fontSize: '1.4rem', fontWeight: 900, color: T.secTitle, marginBottom: '1rem', letterSpacing: '0.15em' }}>{step.title}</h4>
                  <p style={{ fontSize: '1.1rem', color: T.secText, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="section-architecture" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-1/2">
            <div className="sec-card aspect-square rounded-[3rem] w-full flex items-center justify-center relative overflow-hidden" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
              <Cpu className="w-48 h-48 absolute opacity-10" style={{ color: T.logoSub }} />
              <div className="grid grid-cols-3 gap-6 relative z-10 p-12">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-20 h-20 rounded-2xl animate-pulse" style={{ background: T.secBtnBg, border: `1px solid ${T.logoSub}`, animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="sec-title mb-8">
              <h2 style={{ fontFamily: S, fontSize: '4rem', fontWeight: 900, color: T.secTitle, lineHeight: 1.1 }}>TENSOR OPTIMIZED<br/>ARCHITECTURE</h2>
            </div>
            <p className="sec-card mb-10" style={{ fontSize: '1.3rem', color: T.secText, lineHeight: 1.8 }}>
              Built on proprietary transformer models, CuraSense utilizes quantum-resistant encryption protocols during inference. The distributed node network ensures zero downtime and absolute data sovereignty.
            </p>
            <ul className="space-y-6">
              {[
                'Distributed GPU clusters for zero-latency processing',
                'Continuous learning loop fed by verified clinical outcomes',
                'Advanced edge-computing capabilities for offline scenarios'
              ].map((item, i) => (
                <li key={i} className="sec-card flex items-center gap-6 p-6 rounded-2xl" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: T.logoSub, boxShadow: `0 0 10px ${T.logoSub}` }} />
                  <span style={{ fontSize: '1.2rem', color: T.secTitle, fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div id="section-diseases" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto text-center">
          <div className="sec-title mb-24">
            <h2 style={{ fontFamily: S, fontSize: '4.5rem', fontWeight: 900, color: T.secTitle }}>CLINICAL SCOPE</h2>
            <p className="mt-6" style={{ fontSize: '1.5rem', color: T.secText, maxWidth: '800px', margin: '2rem auto' }}>Comprehensive detection matrices covering thousands of pathologies.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'ONCOLOGY', 'NEUROLOGY', 'CARDIOLOGY', 'PULMONOLOGY',
              'DERMATOLOGY', 'ENDOCRINOLOGY', 'GASTROENTEROLOGY', 'IMMUNOLOGY'
            ].map((dept, i) => (
              <div key={i} className="sec-card mag py-10 px-6 rounded-3xl flex items-center justify-center cursor-pointer transition-all hover:bg-opacity-80" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
                <span style={{ fontFamily: S, fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.15em', color: T.secTitle }}>{dept}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="section-trust" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto">
          <div className="sec-title mb-20 text-center">
            <h2 style={{ fontFamily: S, fontSize: '4.5rem', fontWeight: 900, color: T.secTitle }}>MILITARY-GRADE<br/>SECURITY</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="sec-card p-16 rounded-[3rem]" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
              <Fingerprint className="w-20 h-20 mb-10" style={{ color: T.logoSub }} />
              <h3 style={{ fontFamily: S, fontSize: '2.5rem', fontWeight: 900, color: T.secTitle, mb: '2rem' }}>HIPAA & GDPR COMPLIANT</h3>
              <p className="mt-6" style={{ fontSize: '1.3rem', color: T.secText, lineHeight: 1.8 }}>
                Every data point processed by CuraSense undergoes AES-256 encryption at rest and TLS 1.3 in transit. Patient identity is irreversibly obfuscated prior to inference processing.
              </p>
            </div>
            <div className="sec-card p-16 rounded-[3rem]" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
              <Globe className="w-20 h-20 mb-10" style={{ color: T.logoSub }} />
              <h3 style={{ fontFamily: S, fontSize: '2.5rem', fontWeight: 900, color: T.secTitle, mb: '2rem' }}>DECENTRALIZED VAULTS</h3>
              <p className="mt-6" style={{ fontSize: '1.3rem', color: T.secText, lineHeight: 1.8 }}>
                Diagnostic records are fragmented and stored across geographically isolated, blockchain-verified nodes, eliminating any single point of failure and ensuring absolute data integrity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="section-cta" className="scroll-section min-h-screen relative flex flex-col justify-center items-center py-32 text-center">
        <div className="max-w-[1200px] w-full px-8 mx-auto">
          <div className="sec-title">
            <h2 style={{ fontFamily: S, fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: 900, color: T.secTitle, lineHeight: 1 }}>SYSTEM READY</h2>
            <p className="mt-10 mb-16" style={{ fontSize: '1.6rem', color: T.secText, lineHeight: 1.6 }}>Initiate sequence to deploy the most advanced diagnostic framework ever created.</p>
            <button onClick={() => scrollToSection('section-hero')} className="mag px-16 py-8 rounded-full font-bold transition-all hover:scale-[1.05]" style={{ fontFamily: S, fontSize: '1.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow, color: '#fff' }}>
              INITIALIZE SYSTEM
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}

function SuccessAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.89;
      colors[i * 3 + 2] = 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      particles.rotation.y += 0.005;
      particles.rotation.z += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.to(material, { opacity: 0.8, duration: 1 })
        .to(camera.position, { z: 4, duration: 2, ease: "power2.inOut" }, "-=1")
        .to(positions, {
          duration: 1.5,
          onUpdate: () => {
            for (let i = 0; i < particleCount; i++) {
              const i3 = i * 3;
              positions[i3] *= 0.95;
              positions[i3+1] *= 0.95;
              positions[i3+2] *= 0.95;
            }
            geometry.attributes.position.needsUpdate = true;
          },
          ease: "power3.in"
        }, "-=1")
        .to(material.color, { r: 0.06, g: 0.72, b: 0.5, duration: 0.5 })
        .fromTo('.auth-text', 
          { opacity: 0, scale: 0.5, y: 20 }, 
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
        )
        .to(material, { opacity: 0, duration: 0.5, delay: 0.5 })
        .to('.auth-text', { opacity: 0, y: -20, duration: 0.4 }, "-=0.5");
    }, containerRef);

    return () => {
      cancelAnimationFrame(animationId);
      ctx.revert();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000005] overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div className="auth-text relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 mb-6 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-emerald-400/10 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <ShieldCheck className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl tracking-[0.2em] uppercase font-bold text-emerald-400" style={{ fontFamily: "'Michroma', sans-serif" }}>
          AUTHENTICATED
        </h2>
        <p className="text-emerald-400/70 tracking-widest mt-2 text-sm">SECURE CONNECTION ESTABLISHED</p>
      </div>
    </div>
  );
}