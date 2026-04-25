import { useState, useEffect, useRef } from 'react';
import { Zap, ArrowRight, ActivitySquare, User, Lock, Mail, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from './ui/card';
import gsap from 'gsap';
import { ThemeToggleButton } from './ThemeToggleButton';
import { useTheme } from '../App';
import { LoadingScreen } from './LoadingScreen';
import { login, register, forgotPassword } from '../utils/api';
import * as THREE from 'three';

interface WelcomeScreenProps {
  onAuthenticate: () => void;
}

export function WelcomeScreen({ onAuthenticate }: WelcomeScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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
      tl.fromTo('.rtext', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, stagger: 0.1 })
        .fromTo('.gpanel', { y: 40, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.13 }, '-=0.9')
        .fromTo('.uline', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.9, ease: 'power4.inOut' }, '-=0.7')
        .fromTo('.fup', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07 }, '-=0.5');

      const magnets = document.querySelectorAll('.mag');
      magnets.forEach(mag => {
        mag.addEventListener('mousemove', (e: Event) => {
          const me = e as MouseEvent;
          const rect = (mag as HTMLElement).getBoundingClientRect();
          const x = me.clientX - rect.left - rect.width / 2;
          const y = me.clientY - rect.top - rect.height / 2;
          gsap.to(mag, { x: x * 0.22, y: y * 0.22, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        });
        mag.addEventListener('mouseleave', () => {
          gsap.to(mag, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.3)' });
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
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setAuthMode(mode);
        gsap.fromTo(panelRef.current,
          { rotateY: -90, opacity: 0 },
          { rotateY: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
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
      if (response.error) {
        setError(response.error);
      } else {
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
    statBg: 'rgba(255,255,255,0.04)', statBdr: 'rgba(255,255,255,0.07)', stat1Clr: '#22d3ee', stat2Clr: '#d946ef', statLblClr: 'rgba(255,255,255,0.35)',
    ftBdr: 'rgba(255,255,255,0.08)', ftNum: ['rgba(34,211,238,0.55)', 'rgba(217,70,239,0.55)', 'rgba(139,92,246,0.55)'], ftHead: '#f1f5f9', ftBody: 'rgba(241,245,249,0.45)', ghost: 'rgba(255,255,255,0.035)',
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
    statBg: 'rgba(255,255,255,0.92)', statBdr: 'rgba(0,0,0,0.08)', stat1Clr: '#0284c7', stat2Clr: '#9333ea', statLblClr: 'rgba(0,0,0,0.40)',
    ftBdr: 'rgba(0,0,0,0.09)', ftNum: ['rgba(2,132,199,0.60)', 'rgba(147,51,234,0.60)', 'rgba(109,40,217,0.60)'], ftHead: '#0a0a1a', ftBody: 'rgba(10,10,26,0.55)', ghost: 'rgba(0,0,0,0.04)',
  };

  const inpStyle = { width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: T.inpBg, border: `1px solid ${T.inpBdr}`, borderRadius: '12px', color: T.text, fontSize: '0.85rem', outline: 'none', transition: 'border 0.3s' };
  const iconStyle = { position: 'absolute' as any, left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.initClr };

  if (isAuthenticating) {
    return <LoadingScreen message="AUTHORIZING CONNECTION..." />;
  }

  if (isSuccess) {
    return <SuccessAnimation />;
  }

  return (
    <div ref={containerRef} className="min-h-screen relative" style={{ fontFamily: I, background: T.bg }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden" style={{ opacity: 1 }}>
        <div style={{ fontFamily: S, fontSize: '28vw', fontWeight: 900, lineHeight: 0.85, color: T.ghost, whiteSpace: 'nowrap' }}>DIAGNOSE</div>
        <div style={{ fontFamily: S, fontSize: '28vw', fontWeight: 900, lineHeight: 0.85, color: 'transparent', WebkitTextStroke: `3px ${T.ghost}`, whiteSpace: 'nowrap' }}>PREDICT</div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen" style={{ padding: '1.5rem 3rem 2rem' }}>
        <header className="flex justify-between items-center fup">
          <div className="flex items-center gap-3">
            <div className="mag p-3 rounded-2xl backdrop-blur-xl cursor-pointer" style={{ background: T.iconBg, border: `1px solid ${T.iconBdr}` }}>
              <ActivitySquare className="w-6 h-6" style={{ color: T.logoSub }} />
            </div>
            <div>
              <div style={{ fontFamily: S, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.logoName }}>CuraSense</div>
              <div style={{ fontFamily: S, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: T.logoSub }}>Protocol_v2</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl fup" style={{ fontFamily: S, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: T.onlineBg, color: T.onlineClr, border: `1px solid ${T.onlineBdr}` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.onlineClr }} /> System Online
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center">
          <div className="w-full flex flex-col lg:flex-row items-end gap-10 lg:gap-8 mt-8">
            <div className="w-full" style={{ flex: '0 1 560px' }}>
              <h1 className="rtext" style={{ fontFamily: S, fontSize: 'clamp(3.2rem, 6.5vw, 6.5rem)', fontWeight: 400, lineHeight: 0.9, letterSpacing: '0.02em', marginBottom: '0.1em', ...(isDark ? { background: `linear-gradient(100deg, ${T.h1a}, ${T.h1b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: T.h1a }) }}>CLINICAL</h1>
              <h1 className="rtext" style={{ fontFamily: S, fontSize: 'clamp(3.2rem, 6.5vw, 6.5rem)', fontWeight: 400, lineHeight: 0.9, letterSpacing: '0.02em', marginBottom: '0.1em', ...(isDark ? { background: `linear-gradient(100deg, ${T.h2a}, ${T.h2b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: T.h2a }) }}>PRECISION</h1>
              <h1 className="rtext" style={{
                fontFamily: S,
                fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '0.01em',
                marginBottom: '1rem', ...(isDark ? { background: `linear-gradient(100deg, ${T.h3a}, ${T.h3b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: T.h3a }) }}>REDEFINED.</h1>
              
              <div className="uline h-px mb-6 rounded-full" style={{ maxWidth: '200px', background: `linear-gradient(90deg, ${T.divider}, transparent)` }} />
              
              <p className="fup" style={{ fontFamily: I, fontSize: '1rem', fontWeight: 400, lineHeight: 1.65, color: T.body, maxWidth: '400px' }}>
                Harness the architecture of neural networks to process symptoms, radiological scans,
                and unstructured lab data — delivering absolute diagnostic clarity.
              </p>
              
              <div className="mt-8 pt-7 grid grid-cols-3 gap-5" style={{ borderTop: `1px solid ${T.ftBdr}`, maxWidth: '520px' }}>
                {[
                  { n: '01', c: T.ftNum[0], t: 'Symptom AI', d: 'Algorithmic analysis cross-referenced with clinical vectors.' },
                  { n: '02', c: T.ftNum[1], t: 'Radiology AI', d: 'Neural vision detects imaging anomalies in milliseconds.' },
                  { n: '03', c: T.ftNum[2], t: 'NLP Reports', d: 'Parse lab data to surface critical biomarkers instantly.' },
                ].map(({ n, c, t, d }) => (
                  <div key={n} className="fup">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontFamily: S, fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em', color: c }}>{n}</span>
                      <span style={{ fontFamily: S, fontSize: '0.72rem', fontWeight: 700, color: T.ftHead }}>{t}</span>
                    </div>
                    <p style={{ fontFamily: I, fontSize: '0.7rem', lineHeight: 1.5, color: T.ftBody }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full" style={{ flex: '0 0 320px', maxWidth: '320px', marginLeft: 'auto' }}>
              <Card ref={panelRef} className="gpanel relative overflow-visible p-7 rounded-3xl mb-4" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.cardShadow }}>
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[55px] pointer-events-none" style={{ background: T.cardGlow }} />
                
                {error && (
                  <div className="absolute -top-14 left-0 w-full p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center justify-center gap-2 backdrop-blur-md">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                {successMsg && (
                  <div className="absolute -top-14 left-0 w-full p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 backdrop-blur-md">
                    <ShieldCheck className="w-4 h-4" /> {successMsg}
                  </div>
                )}

                <div className="relative z-10">
                  {authMode === 'none' && (
                    <>
                      <div className="flex justify-between items-center mb-8">
                        <span style={{ fontFamily: S, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.initClr }}>Initialize</span>
                        <Zap className="w-4 h-4" style={{ color: T.zapClr }} />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.1, color: T.cardTitle, marginBottom: '1.75rem' }}>Access<br />Protocol</h3>
                      <div className="flex flex-col gap-3">
                        <button onClick={() => switchAuthMode('login')} className="mag w-full py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: S, fontSize: '0.76rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow }}>
                          Login
                        </button>
                        <button onClick={() => switchAuthMode('register')} className="mag w-full py-4 rounded-2xl font-bold transition-all hover:bg-opacity-80 hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: S, fontSize: '0.76rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: T.secBtnBg, border: `1px solid ${T.secBtnBdr}`, color: T.cardTitle }}>
                          Create Account
                        </button>
                      </div>
                    </>
                  )}

                  {authMode === 'login' && (
                    <form onSubmit={handleAuthSubmit}>
                      <div className="flex justify-between items-center mb-6">
                        <span style={{ fontFamily: S, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.initClr }}>Authentication</span>
                        <User className="w-4 h-4" style={{ color: T.zapClr }} />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '1.4rem', fontWeight: 800, color: T.cardTitle, marginBottom: '1.5rem' }}>Welcome Back</h3>
                      <div className="flex flex-col gap-4 mb-3">
                        <div style={{ position: 'relative' }}><Mail style={iconStyle} className="w-4 h-4" /><input type="text" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email or System ID" required style={inpStyle} /></div>
                        <div style={{ position: 'relative' }}><Lock style={iconStyle} className="w-4 h-4" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password" required style={inpStyle} /></div>
                      </div>
                      <div className="flex justify-end mb-4">
                        <button type="button" onClick={() => switchAuthMode('forgot')} style={{ fontSize: '0.7rem', color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>Forgot Protocol?</button>
                      </div>
                      <button type="submit" className="mag w-full py-4 rounded-xl text-white font-bold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] mb-3" style={{ fontFamily: S, fontSize: '0.76rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow }}>
                        Authenticate <ArrowRight className="inline w-4 h-4 ml-1" />
                      </button>
                      <div className="text-center">
                        <button type="button" onClick={() => switchAuthMode('none')} style={{ fontSize: '0.7rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I }}>← Back to Menu</button>
                      </div>
                    </form>
                  )}

                  {authMode === 'register' && (
                    <form onSubmit={handleAuthSubmit}>
                      <div className="flex justify-between items-center mb-6">
                        <span style={{ fontFamily: S, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.initClr }}>Registration</span>
                        <ShieldCheck className="w-4 h-4" style={{ color: T.zapClr }} />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '1.4rem', fontWeight: 800, color: T.cardTitle, marginBottom: '1.5rem' }}>Secure Access</h3>
                      <div className="flex flex-col gap-3 mb-6">
                        <div style={{ position: 'relative' }}><User style={iconStyle} className="w-4 h-4" /><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" required style={{...inpStyle, padding: '0.7rem 1rem 0.7rem 2.5rem'}} /></div>
                        <div style={{ position: 'relative' }}><Mail style={iconStyle} className="w-4 h-4" /><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email Address" required style={{...inpStyle, padding: '0.7rem 1rem 0.7rem 2.5rem'}} /></div>
                        <div style={{ position: 'relative' }}><Lock style={iconStyle} className="w-4 h-4" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password (Min 8 chars)" required style={{...inpStyle, padding: '0.7rem 1rem 0.7rem 2.5rem'}} /></div>
                      </div>
                      <button type="submit" className="mag w-full py-4 rounded-xl text-white font-bold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] mb-3" style={{ fontFamily: S, fontSize: '0.76rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow }}>
                        Initialize <ArrowRight className="inline w-4 h-4 ml-1" />
                      </button>
                      <div className="text-center">
                        <button type="button" onClick={() => switchAuthMode('none')} style={{ fontSize: '0.7rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I }}>← Back to Menu</button>
                      </div>
                    </form>
                  )}

                  {authMode === 'forgot' && (
                    <form onSubmit={handleAuthSubmit}>
                      <div className="flex justify-between items-center mb-6">
                        <span style={{ fontFamily: S, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.initClr }}>Recovery</span>
                        <RefreshCw className="w-4 h-4 text-emerald-500" />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '1.4rem', fontWeight: 800, color: T.cardTitle, marginBottom: '0.5rem' }}>Reset Protocol</h3>
                      <p style={{ fontSize: '0.75rem', color: T.muted, marginBottom: '1.5rem', lineHeight: 1.5 }}>Enter your registered email or System ID. We will transmit recovery details to your secure inbox.</p>
                      <div className="flex flex-col gap-4 mb-6">
                        <div style={{ position: 'relative' }}><Mail style={iconStyle} className="w-4 h-4" /><input type="text" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email or System ID" required style={inpStyle} /></div>
                      </div>
                      <button type="submit" className="mag w-full py-4 rounded-xl text-white font-bold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] mb-3" style={{ fontFamily: S, fontSize: '0.76rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                        Transmit Request <ArrowRight className="inline w-4 h-4 ml-1" />
                      </button>
                      <div className="text-center">
                        <button type="button" onClick={() => switchAuthMode('login')} style={{ fontSize: '0.7rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I }}>← Back to Login</button>
                      </div>
                    </form>
                  )}

                </div>
              </Card>

              <div className="gpanel grid grid-cols-2 gap-3">
                {[
                  { v: '94%', l: 'Accuracy', cl: T.stat1Clr },
                  { v: '2.5s', l: 'Latency', cl: T.stat2Clr },
                ].map(({ v, l, cl }) => (
                  <div key={l} className="p-4 rounded-2xl backdrop-blur-xl" style={{ background: T.statBg, border: `1px solid ${T.statBdr}` }}>
                    <div style={{ fontFamily: S, fontSize: '1.4rem', fontWeight: 800, color: cl, marginBottom: '3px' }}>{v}</div>
                    <div style={{ fontFamily: I, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.statLblClr }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
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