import { useState, useEffect, useRef } from 'react';
import { Zap, ArrowRight, ActivitySquare, User, Lock, Mail, ShieldCheck, AlertCircle, RefreshCw, Cpu, Database, Globe, Layers, Activity, Network, Fingerprint, ChevronDown, TestTube, Crosshair, Dna } from 'lucide-react';
import { Card } from './ui/card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeToggleButton } from './ThemeToggleButton';
import { useTheme } from '../App';
import { LoadingScreen } from './LoadingScreen';
import { login, register, forgotPassword, verifyResetCode, resetPassword } from '../utils/api';
import * as THREE from 'three';
import ScrollStory from './ScrollStory';

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
  /* ── Three-stage reset flow ──
     'idle'     → email input screen
     'code'     → code entry screen (after email submitted, code emailed)
     'password' → new password screen (after code verified). Skip is here.
     'done'     → success card → auto-redirect to login

     The code itself never leaves the backend; the user gets it via email.
     /verify-reset-code confirms the typed code before we reveal the
     password screen, so users can't skip ahead by guessing. */
  type ResetStage = 'idle' | 'code' | 'password' | 'done';
  const [resetStage, setResetStage] = useState<ResetStage>('idle');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMaskedEmail, setResetMaskedEmail] = useState('');
  // Code returned from /forgot-password — displayed on the verify screen
  // since we don't ship an email service.
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [typedCode, setTypedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  /* Wipe the reset-flow state. Called by Skip-for-now (on the password
     screen) and Back-to-Login (on every screen). */
  const cancelReset = () => {
    setResetStage('idle');
    setResetEmail('');
    setResetMaskedEmail('');
    setResetCode(null);
    setTypedCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
  };

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

        // Some sections have no .sec-title or .sec-card (e.g. section-hero
        // is intentionally hand-built). Skip the tween if the selector
        // returns nothing — otherwise GSAP warns once per ScrollTrigger
        // refresh, which is on every rAF tick when scrub is active.
        const titles = sec.querySelectorAll('.sec-title');
        if (titles.length) {
          gsap.fromTo(titles,
            { y: 100, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1.5, ease: 'expo.out',
              scrollTrigger: { trigger: sec, start: 'top 75%' }
            }
          );
        }

        const cards = sec.querySelectorAll('.sec-card');
        if (cards.length) {
          gsap.fromTo(cards,
            { y: 60, opacity: 0, scale: 0.95 },
            {
              y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out',
              scrollTrigger: { trigger: sec, start: 'top 70%' }
            }
          );
        }
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
      /* Three-stage submit flow:
           idle    → call /forgot-password (emails the code) → advance to 'code'
           code    → call /verify-reset-code (checks the typed code) → advance to 'password'
           password→ call /reset-password (sets the new password) → advance to 'done' */

      // ── Stage 1 → 2: generate the code ───────────────────────────────
      if (resetStage === 'idle') {
        const response = await forgotPassword(formData.email);
        setIsAuthenticating(false);
        if (response.error) {
          setError(response.error);
          return;
        }
        const data = response.data as any;
        setResetEmail(String(data?.email || formData.email));
        setResetMaskedEmail(String(data?.maskedEmail || ''));
        setResetCode(typeof data?.code === 'string' ? data.code : null);
        setSuccessMsg('');
        setResetStage('code');
        return;
      }

      // ── Stage 2 → 3: verify the typed code ───────────────────────────
      if (resetStage === 'code') {
        if (!typedCode.trim() || typedCode.trim().length !== 6) {
          setIsAuthenticating(false);
          setError('Enter the 6-digit code from your email.');
          return;
        }
        const v = await verifyResetCode(resetEmail, typedCode.trim());
        setIsAuthenticating(false);
        if (v.error) {
          setError(v.error);
          return;
        }
        setSuccessMsg('');
        setResetStage('password');
        return;
      }

      // ── Stage 3 → done: set the new password ─────────────────────────
      if (resetStage === 'password') {
        if (newPassword.length < 6) {
          setIsAuthenticating(false);
          setError('Password must be at least 6 characters.');
          return;
        }
        if (newPassword !== confirmPassword) {
          setIsAuthenticating(false);
          setError('Passwords do not match.');
          return;
        }
        const r = await resetPassword(resetEmail, typedCode.trim(), newPassword);
        setIsAuthenticating(false);
        if (r.error) {
          setError(r.error);
          return;
        }
        setSuccessMsg('Password updated. Returning to login…');
        setResetStage('done');
        setTimeout(() => { cancelReset(); switchAuthMode('login'); }, 1800);
        return;
      }

      setIsAuthenticating(false);
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

  if (isAuthenticating) return <LoadingScreen message="AUTHORIZING CLINICAL CONNECTION..." />;
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
              <div style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: T.logoSub }}>Diagnostic_v2</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggleButton />
            <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-xl" style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: T.onlineBg, color: T.onlineClr, border: `1px solid ${T.onlineBdr}` }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.onlineClr }} /> Medical Servers Online
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center max-w-[1600px] mx-auto w-full mt-12">
          <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-16">
            <div className="w-full lg:flex-1 max-w-[900px]" style={{ perspective: '1000px' }}>
              <h1 className="hero-text" style={{ fontFamily: S, fontSize: 'clamp(3.2rem, 6.5vw, 6.5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: '0.1em', paddingRight: '0.2em', ...(isDark ? { background: `linear-gradient(100deg, ${T.h1a}, ${T.h1b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: T.h1a }) }}>CLINICAL</h1>
              <h1 className="hero-text" style={{ fontFamily: S, fontSize: 'clamp(3.2rem, 6.5vw, 6.5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: '0.1em', paddingRight: '0.2em', ...(isDark ? { background: `linear-gradient(100deg, ${T.h2a}, ${T.h2b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: T.h2a }) }}>PRECISION</h1>
              <h1 className="hero-text" style={{ fontFamily: S, fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '0.01em', marginBottom: '1rem', paddingRight: '0.2em', ...(isDark ? { background: `linear-gradient(100deg, ${T.h3a}, ${T.h3b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: T.h3a }) }}>REDEFINED.</h1>
              
              <div className="uline h-[2px] mt-8 mb-8 rounded-full" style={{ maxWidth: '300px', background: `linear-gradient(90deg, ${T.divider}, transparent)` }} />
              
              <p className="fade-up text-xl" style={{ fontWeight: 400, lineHeight: 1.8, color: T.body, maxWidth: '600px' }}>
                Harness the architecture of deep neural networks to process biomarker data, radiological scans,
                and genomic structures — delivering absolute diagnostic clarity for complex pathologies.
              </p>
              
              <div className="fade-up mt-12 flex items-center gap-6">
                <button onClick={() => scrollToSection('section-dna-analysis')} className="mag px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all" style={{ background: T.secBtnBg, border: `1px solid ${T.secBtnBdr}`, color: T.logoName, fontFamily: S }}>
                  Explore Medical Framework <ChevronDown className="inline w-4 h-4 ml-2" />
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
                        <span style={{ fontFamily: S, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.initClr }}>Provider Access</span>
                        <Zap className="w-5 h-5" style={{ color: T.zapClr }} />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, color: T.cardTitle, marginBottom: '2.5rem' }}>Access<br />Protocol</h3>
                      <div className="flex flex-col gap-4">
                        <button onClick={() => switchAuthMode('login')} className="mag w-full py-5 rounded-2xl text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97]" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow }}>
                          Clinical Login
                        </button>
                        <button onClick={() => switchAuthMode('register')} className="mag w-full py-5 rounded-2xl font-bold transition-all hover:bg-opacity-80 hover:scale-[1.03] active:scale-[0.97]" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.secBtnBg, border: `1px solid ${T.secBtnBdr}`, color: T.cardTitle }}>
                          Register Facility
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
                        <div style={{ position: 'relative' }}><Mail style={iconStyle} className="w-5 h-5" /><input type="text" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Provider Email or ID" required style={inpStyle} /></div>
                        <div style={{ position: 'relative' }}><Lock style={iconStyle} className="w-5 h-5" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Passkey" required style={inpStyle} /></div>
                      </div>
                      <div className="flex justify-end mb-6">
                        <button type="button" onClick={() => switchAuthMode('forgot')} style={{ fontSize: '0.8rem', color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>Forgot Credentials?</button>
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
                        <span style={{ fontFamily: S, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.initClr }}>Facility Registration</span>
                        <ShieldCheck className="w-5 h-5" style={{ color: T.zapClr }} />
                      </div>
                      <h3 style={{ fontFamily: S, fontSize: '1.8rem', fontWeight: 900, color: T.cardTitle, marginBottom: '2rem' }}>Secure Access</h3>
                      <div className="flex flex-col gap-5 mb-8">
                        <div style={{ position: 'relative' }}><User style={iconStyle} className="w-5 h-5" /><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Provider Name" required style={inpStyle} /></div>
                        <div style={{ position: 'relative' }}><Mail style={iconStyle} className="w-5 h-5" /><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Clinical Email" required style={inpStyle} /></div>
                        <div style={{ position: 'relative' }}><Lock style={iconStyle} className="w-5 h-5" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Passkey (Min 8)" required style={inpStyle} /></div>
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
                      <p style={{ fontSize: '0.9rem', color: T.secText, marginBottom: '2rem', lineHeight: 1.6 }}>
                        {resetStage === 'idle'     && "Enter your registered email and we'll send a 6-digit code."}
                        {resetStage === 'code'     && `Code sent to ${resetMaskedEmail || 'your inbox'}. Check your email and type it below.`}
                        {resetStage === 'password' && "Code verified. Choose a new password — or skip to keep the old one."}
                        {resetStage === 'done'     && "Password updated successfully."}
                      </p>

                      {/* ── STAGE 1 — EMAIL ── */}
                      {resetStage === 'idle' && (
                        <>
                          <div className="flex flex-col gap-5 mb-8">
                            <div style={{ position: 'relative' }}>
                              <Mail style={iconStyle} className="w-5 h-5" />
                              <input
                                type="text"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Registered Email"
                                required
                                style={inpStyle}
                              />
                            </div>
                          </div>
                          <button type="submit" disabled={isAuthenticating} className="mag w-full py-5 rounded-2xl text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97] mb-4" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)', opacity: isAuthenticating ? 0.6 : 1 }}>
                            {isAuthenticating ? 'Sending…' : <>Send Code <ArrowRight className="inline w-5 h-5 ml-2" /></>}
                          </button>
                        </>
                      )}

                      {/* ── STAGE 2 — CODE (no skip here) ── */}
                      {resetStage === 'code' && (
                        <>
                          {/* Single code-display card — shown to the user
                              since there's no email infrastructure. */}
                          <div style={{
                            padding: '1.1rem',
                            borderRadius: '14px',
                            background: 'rgba(16,185,129,0.08)',
                            border: '1px solid rgba(16,185,129,0.30)',
                            marginBottom: '1.25rem',
                            textAlign: 'center',
                          }}>
                            <div style={{ fontFamily: S, fontSize: '0.65rem', letterSpacing: '0.25em', color: '#10b981', marginBottom: '8px', fontWeight: 700 }}>
                              YOUR RESET CODE
                            </div>
                            <div style={{
                              fontFamily: S,
                              fontSize: '2.2rem',
                              fontWeight: 900,
                              letterSpacing: '0.4em',
                              color: '#fff',
                              textShadow: '0 0 20px rgba(16,185,129,0.5)',
                              userSelect: 'all',
                            }}>
                              {resetCode}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: T.secText, marginTop: '6px', opacity: 0.7 }}>
                              {resetMaskedEmail ? `${resetMaskedEmail} · ` : ''}valid for 30 minutes
                            </div>
                          </div>

                          <div className="flex flex-col gap-4 mb-6">
                            <div style={{ position: 'relative' }}>
                              <ShieldCheck style={iconStyle} className="w-5 h-5" />
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                autoFocus
                                value={typedCode}
                                onChange={(e) => setTypedCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="6-digit code from email"
                                required
                                style={{ ...inpStyle, letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.1rem' }}
                              />
                            </div>
                          </div>

                          <button type="submit" disabled={isAuthenticating || typedCode.length !== 6} className="mag w-full py-5 rounded-2xl text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97] mb-3" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)', opacity: (isAuthenticating || typedCode.length !== 6) ? 0.5 : 1 }}>
                            {isAuthenticating ? 'Verifying…' : <>Verify Code <ArrowRight className="inline w-5 h-5 ml-2" /></>}
                          </button>
                          {/* No skip on this screen — user must verify the code first */}
                        </>
                      )}

                      {/* ── STAGE 3 — PASSWORD (skip lives here) ── */}
                      {resetStage === 'password' && (
                        <>
                          <div className="flex flex-col gap-4 mb-6">
                            <div style={{ position: 'relative' }}>
                              <Lock style={iconStyle} className="w-5 h-5" />
                              <input
                                type="password"
                                autoFocus
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password (min 6)"
                                required
                                style={inpStyle}
                              />
                            </div>
                            <div style={{ position: 'relative' }}>
                              <Lock style={iconStyle} className="w-5 h-5" />
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                                style={inpStyle}
                              />
                            </div>
                          </div>

                          <button type="submit" disabled={isAuthenticating} className="mag w-full py-5 rounded-2xl text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97] mb-3" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)', opacity: isAuthenticating ? 0.6 : 1 }}>
                            {isAuthenticating ? 'Updating…' : <>Reset Password <ArrowRight className="inline w-5 h-5 ml-2" /></>}
                          </button>

                          {/* Skip — only available on the password screen.
                              Drops the user back at login without changing the password. */}
                          <button
                            type="button"
                            onClick={() => { cancelReset(); switchAuthMode('login'); }}
                            className="w-full py-3 rounded-2xl font-bold transition-all"
                            style={{
                              fontFamily: S,
                              fontSize: '0.75rem',
                              letterSpacing: '0.18em',
                              textTransform: 'uppercase',
                              color: T.initClr,
                              background: 'transparent',
                              border: `1px solid ${T.cardBdr || 'rgba(255,255,255,0.15)'}`,
                              cursor: 'pointer',
                            }}
                          >
                            Skip for now
                          </button>
                        </>
                      )}

                      {/* ── STAGE 4 — DONE ── */}
                      {resetStage === 'done' && (
                        <div style={{
                          padding: '1.4rem',
                          borderRadius: '14px',
                          background: 'rgba(16,185,129,0.10)',
                          border: '1px solid rgba(16,185,129,0.35)',
                          textAlign: 'center',
                          marginBottom: '1rem',
                        }}>
                          <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>✓</div>
                          <div style={{ fontFamily: S, fontSize: '0.9rem', fontWeight: 700, color: '#10b981', marginBottom: '6px' }}>
                            PASSWORD UPDATED
                          </div>
                          <p style={{ fontSize: '0.78rem', color: T.secText }}>
                            {successMsg || 'Returning to login…'}
                          </p>
                        </div>
                      )}

                      {/* Back-to-login link is always visible except on the success screen */}
                      {resetStage !== 'done' && (
                        <div className="text-center mt-2">
                          <button
                            type="button"
                            onClick={() => { cancelReset(); switchAuthMode('login'); }}
                            style={{ fontSize: '0.8rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}
                          >
                            ← Back to Login
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ── SCROLLYTELLING REEL ──
          Pinned narrative section. The visual stays fixed in the
          viewport while the user scrolls; each scroll-step swaps to
          the next scene (Capture → Reason → Resolve → Remember) with
          its own animation and a caption explaining what's happening.
          Lives between the hero and the DNA section so it's the first
          thing a visitor sees after the headline. */}
      <ScrollStory />

      <div id="section-dna-analysis" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-1/2">
            <div className="sec-title mb-8">
              <h2 style={{ fontFamily: S, fontSize: '4rem', fontWeight: 900, color: T.secTitle, lineHeight: 1.1 }}>GENOMIC &<br/>MOLECULAR SEQUENCING</h2>
            </div>
            <p className="sec-card mb-10" style={{ fontSize: '1.3rem', color: T.secText, lineHeight: 1.8 }}>
              At the core of CuraSense is an advanced biochemical mapping engine. By analyzing DNA degradation, telomere shortening, and transcriptomic profiles, the system identifies pre-symptomatic disease states years before physiological manifestation.
            </p>
            <ul className="space-y-6">
              {[
                'Automated Pharmacogenomic profiling for targeted treatments.',
                'Real-time protein misfolding detection using predictive structural algorithms.',
                'Microbiome taxonomy correlation with autoimmune disorders.'
              ].map((item, i) => (
                <li key={i} className="sec-card flex items-start gap-6 p-6 rounded-2xl" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
                  <TestTube className="w-8 h-8 shrink-0 mt-1" style={{ color: T.logoSub }} />
                  <span style={{ fontSize: '1.2rem', color: T.secTitle, fontWeight: 500, lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
             <div className="sec-card p-12 rounded-[3rem] text-center w-full max-w-lg relative overflow-hidden" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top right, ${T.cardGlow}, transparent 70%)` }} />
                <Activity className="w-24 h-24 mx-auto mb-8 relative z-10" style={{ color: T.logoSub }} />
                <h3 className="relative z-10" style={{ fontFamily: S, fontSize: '2rem', fontWeight: 900, color: T.secTitle, marginBottom: '1.5rem' }}>CRISPR DATA INGESTION</h3>
                <p className="relative z-10" style={{ fontSize: '1.1rem', color: T.secText, lineHeight: 1.8 }}>
                  The engine dynamically cross-references patient nucleotide sequences against global oncological databases, instantly flagging high-risk hereditary mutations (BRCA1/2, TP53, PTEN) with 99.8% specificity.
                </p>
             </div>
          </div>
        </div>
      </div>

      <div id="section-stats" className="scroll-section min-h-screen relative flex flex-col justify-center items-center py-32">
        <div ref={statsRef} className="max-w-[1600px] w-full px-8 mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { val: '99.9', label: 'CLINICAL SPECIFICITY %', icon: Activity },
            { val: '240', label: 'MILLION BIOMARKERS SCANNED', icon: Database },
            { val: '12', label: 'MILLISECOND INFERENCE', icon: Zap }
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
            <h2 style={{ fontFamily: S, fontSize: '4.5rem', fontWeight: 900, color: T.secTitle, lineHeight: 1.1, marginBottom: '2rem' }}>TRIPLE VECTOR<br/>DIAGNOSTICS</h2>
            <p style={{ fontSize: '1.5rem', color: T.secText, lineHeight: 1.6 }}>The CuraSense Protocol operates on three simultaneous clinical modalities to ensure complete diagnostic superiority and eliminate human observer error.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'SYMPTOMATICS & NLP', desc: 'Natural Language Processing algorithms parse patient histories, clinical notes, and physical symptoms, cross-referencing against real-time epidemiological tracking.', icon: ActivitySquare },
              { title: 'AI RADIOLOGY', desc: 'Deep convolutional neural networks process DICOM images, identifying micro-fractures, subtle hemorrhages, and early-stage neoplastic growth in MRI, CT, and PET scans.', icon: Layers },
              { title: 'DIGITAL PATHOLOGY', desc: 'Automated ingestion of comprehensive metabolic panels, CBCs, and immunohistochemistry reports, identifying critical threshold deviations.', icon: Database }
            ].map((ft, i) => (
              <div key={i} className="sec-card p-12 rounded-[2.5rem] relative overflow-hidden group" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${T.cardGlow}, transparent 70%)` }} />
                <ft.icon className="w-16 h-16 mb-10 relative z-10" style={{ color: T.logoSub }} />
                <h3 className="relative z-10" style={{ fontFamily: S, fontSize: '1.6rem', fontWeight: 900, color: T.secTitle, marginBottom: '1.5rem', letterSpacing: '0.1em' }}>{ft.title}</h3>
                <p className="relative z-10" style={{ fontSize: '1.1rem', color: T.secText, lineHeight: 1.8 }}>{ft.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="section-predictive" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto flex flex-col lg:flex-row-reverse items-center gap-20">
          <div className="w-full lg:w-1/2">
            <div className="sec-title mb-8">
              <h2 style={{ fontFamily: S, fontSize: '4rem', fontWeight: 900, color: T.secTitle, lineHeight: 1.1 }}>PREDICTIVE<br/>PATHOLOGY</h2>
            </div>
            <p className="sec-card mb-10" style={{ fontSize: '1.3rem', color: T.secText, lineHeight: 1.8 }}>
              Moving beyond reactive medicine, the platform utilizes longitudinal data tracking to forecast disease trajectory. By analyzing historical patient timelines, the AI projects physiological degradation and recommends preventative interventions.
            </p>
            <ul className="space-y-6">
              {[
                'Cardiovascular Event Prediction (Myocardial Infarction timelines).',
                'Metabolic Syndrome tracking and diabetic neuropathy forecasting.',
                'Neurodegenerative decline modeling (Alzheimer’s, Parkinson’s indicators).'
              ].map((item, i) => (
                <li key={i} className="sec-card flex items-start gap-6 p-6 rounded-2xl" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
                  <Crosshair className="w-8 h-8 shrink-0 mt-1" style={{ color: T.logoSub }} />
                  <span style={{ fontSize: '1.2rem', color: T.secTitle, fontWeight: 500, lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
             <div className="sec-card p-12 rounded-[3rem] text-center w-full max-w-lg relative overflow-hidden" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top left, ${T.cardGlow}, transparent 70%)` }} />
                <Network className="w-24 h-24 mx-auto mb-8 relative z-10" style={{ color: T.logoSub }} />
                <h3 className="relative z-10" style={{ fontFamily: S, fontSize: '2rem', fontWeight: 900, color: T.secTitle, marginBottom: '1.5rem' }}>LONGITUDINAL TENSORS</h3>
                <p className="relative z-10" style={{ fontSize: '1.1rem', color: T.secText, lineHeight: 1.8 }}>
                  Continuous state-space modeling continuously recalculates patient risk profiles based on ambient health data, wearable telemetry, and newly published clinical trials.
                </p>
             </div>
          </div>
        </div>
      </div>

      <div id="section-howitworks" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto">
          <div className="sec-title text-center mb-24">
            <h2 style={{ fontFamily: S, fontSize: '4.5rem', fontWeight: 900, color: T.secTitle }}>CLINICAL PIPELINE</h2>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 hidden lg:block" style={{ background: `linear-gradient(90deg, transparent, ${T.divider}, transparent)` }} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {[
                { step: '01', title: 'HL7 / FHIR INGESTION', desc: 'Secure upload of multi-format medical data, EHR records, and lab results into the encrypted core.' },
                { step: '02', title: 'DATA NORMALIZATION', desc: 'Biometric standardizing, artifact removal in scans, and tensor mapping for neural processing.' },
                { step: '03', title: 'DIAGNOSTIC INFERENCE', desc: 'Parallel processing across specialized oncological, neurological, and cardiovascular models.' },
                { step: '04', title: 'CLINICAL SYNTHESIS', desc: 'Generation of a unified diagnostic report with ICD-10 codes and evidence-based interventions.' }
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

      <div id="section-diseases" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto text-center">
          <div className="sec-title mb-24">
            <h2 style={{ fontFamily: S, fontSize: '4.5rem', fontWeight: 900, color: T.secTitle }}>SUBSPECIALTY SCOPE</h2>
            <p className="mt-6" style={{ fontSize: '1.5rem', color: T.secText, maxWidth: '800px', margin: '2rem auto' }}>Comprehensive diagnostic matrices covering over 14,000 distinct pathologies.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'ONCOLOGY', 'NEUROLOGY', 'CARDIOLOGY', 'PULMONOLOGY',
              'DERMATOLOGY', 'ENDOCRINOLOGY', 'GASTROENTEROLOGY', 'IMMUNOLOGY',
              'HEMATOLOGY', 'RHEUMATOLOGY', 'NEPHROLOGY', 'INFECTIOUS DISEASE'
            ].map((dept, i) => (
              <div key={i} className="sec-card mag py-10 px-6 rounded-3xl flex items-center justify-center cursor-pointer transition-all hover:bg-opacity-80" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
                <span style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.15em', color: T.secTitle }}>{dept}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="section-trust" className="scroll-section min-h-screen relative flex flex-col justify-center py-32">
        <div className="max-w-[1600px] w-full px-8 mx-auto">
          <div className="sec-title mb-20 text-center">
            <h2 style={{ fontFamily: S, fontSize: '4.5rem', fontWeight: 900, color: T.secTitle }}>MEDICAL-GRADE<br/>SECURITY</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="sec-card p-16 rounded-[3rem]" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
              <Fingerprint className="w-20 h-20 mb-10" style={{ color: T.logoSub }} />
              <h3 style={{ fontFamily: S, fontSize: '2.5rem', fontWeight: 900, color: T.secTitle, mb: '2rem' }}>HIPAA & GDPR COMPLIANT</h3>
              <p className="mt-6" style={{ fontSize: '1.3rem', color: T.secText, lineHeight: 1.8 }}>
                Every data point processed by CuraSense undergoes AES-256 encryption at rest and TLS 1.3 in transit. Patient identity (PHI) is irreversibly obfuscated and detached from biometric payloads prior to inference processing.
              </p>
            </div>
            <div className="sec-card p-16 rounded-[3rem]" style={{ background: T.cardBg, border: `1px solid ${T.cardBdr}` }}>
              <Globe className="w-20 h-20 mb-10" style={{ color: T.logoSub }} />
              <h3 style={{ fontFamily: S, fontSize: '2.5rem', fontWeight: 900, color: T.secTitle, mb: '2rem' }}>DECENTRALIZED HEALTH VAULTS</h3>
              <p className="mt-6" style={{ fontSize: '1.3rem', color: T.secText, lineHeight: 1.8 }}>
                Diagnostic records are fragmented and stored across geographically isolated, blockchain-verified clinical nodes, eliminating any single point of failure and ensuring absolute data sovereignty for healthcare providers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="section-cta" className="scroll-section min-h-screen relative flex flex-col justify-center items-center py-32 text-center">
        <div className="max-w-[1200px] w-full px-8 mx-auto">
          <div className="sec-title">
            <h2 style={{ fontFamily: S, fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: 900, color: T.secTitle, lineHeight: 1 }}>SYSTEM READY</h2>
            <p className="mt-10 mb-16" style={{ fontSize: '1.6rem', color: T.secText, lineHeight: 1.6 }}>Initiate sequence to deploy the most advanced clinical diagnostic framework.</p>
            <button onClick={() => scrollToSection('section-hero')} className="mag px-16 py-8 rounded-full font-bold transition-all hover:scale-[1.05]" style={{ fontFamily: S, fontSize: '1.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow, color: '#fff' }}>
              INITIALIZE MEDICAL AI
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
        <p className="text-emerald-400/70 tracking-widest mt-2 text-sm">SECURE CLINICAL CONNECTION ESTABLISHED</p>
      </div>
    </div>
  );
}