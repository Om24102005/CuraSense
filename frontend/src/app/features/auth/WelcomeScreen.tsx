import { useState, useEffect, useRef } from 'react';
import { Zap, ArrowRight, ActivitySquare, User, Lock, Mail, ShieldCheck, AlertCircle, RefreshCw, ChevronDown, Smartphone, Copy, Check } from 'lucide-react';
import { Card } from '../../components/ui/card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeToggleButton } from '../../components/shared/ThemeToggleButton';
import { useTheme } from '../../App';
import { login, register, forgotPassword, verifyResetCode, resetPassword, totpSetup, totpVerify, loginTotp } from '../../services/api';
import NarrativeReel from './NarrativeReel';

gsap.registerPlugin(ScrollTrigger);

interface WelcomeScreenProps {
  onAuthenticate: () => void;
}

export function WelcomeScreen({ onAuthenticate }: WelcomeScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Live medical-server health pill — polls Python (:8000) and Node (:5001).
  // 'checking' until the first probe resolves; 'offline' if EITHER service fails.
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let cancelled = false;
    const POLL_MS = 15000;
    const TIMEOUT_MS = 5000;

    const pyBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
    const nodeBase = (import.meta.env.VITE_NODE_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');

    const probe = async (url: string) => {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
      try {
        const r = await fetch(url, { method: 'GET', signal: ctl.signal, cache: 'no-store' });
        return r.ok;
      } catch {
        return false;
      } finally {
        clearTimeout(timer);
      }
    };

    const checkAll = async () => {
      const [py, node] = await Promise.all([
        probe(`${pyBase}/health`),
        probe(`${nodeBase}/health`),
      ]);
      if (!cancelled) setServerStatus(py && node ? 'online' : 'offline');
    };

    checkAll();
    const id = window.setInterval(checkAll, POLL_MS);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const [authMode, setAuthMode] = useState<'none' | 'login' | 'register' | 'forgot'>('none');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
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

  /* ── 2FA (Google Authenticator) flow ──
     'setup' → after /register: show QR + 6-digit verify
     'login' → after /login when totpEnabled=true: show 6-digit verify only
     null    → no 2FA in progress */
  type TotpFlow = 'setup' | 'login' | null;
  const [totpFlow, setTotpFlow] = useState<TotpFlow>(null);
  const [totpServerToken, setTotpServerToken] = useState('');         // setupToken or totpToken from backend
  const [totpQR, setTotpQR] = useState<{ qrDataUrl: string; manualSecret: string; account: string } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [secretCopied, setSecretCopied] = useState(false);

  const cancelTotp = () => {
    setTotpFlow(null);
    setTotpServerToken('');
    setTotpQR(null);
    setTotpCode('');
    setSecretCopied(false);
    setError('');
    setSuccessMsg('');
  };

  const finishLogin = (token: string, user: any) => {
    localStorage.setItem('curasense_token', token);
    localStorage.setItem('curasense_user', JSON.stringify(user));
    // Hand off straight to the cinematic intro — no 3.5s success
    // overlay in the middle. Keeps the perceived transition smooth.
    setIsAuthenticating(false);
    onAuthenticate();
  };

  const submitTotpCode = async () => {
    setError('');
    if (!totpCode.trim() || totpCode.trim().length !== 6) {
      setError('Enter the 6-digit code from Google Authenticator.');
      return;
    }
    setIsAuthenticating(true);
    const r = totpFlow === 'setup'
      ? await totpVerify(totpServerToken, totpCode.trim())
      : await loginTotp(totpServerToken, totpCode.trim());
    if (r.error || !r.data?.token) {
      setIsAuthenticating(false);
      setError(r.error || 'Verification failed.');
      return;
    }
    finishLogin(r.data.token, r.data.user);
  };

  const copyManualSecret = async () => {
    if (!totpQR?.manualSecret) return;
    try {
      await navigator.clipboard.writeText(totpQR.manualSecret);
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 1500);
    } catch { /* clipboard blocked — user can read it on screen */ }
  };

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
  }, []);

  const switchAuthMode = (mode: 'none' | 'login' | 'register' | 'forgot') => {
    if (!panelRef.current) return;
    setError('');
    setSuccessMsg('');

    const panel = panelRef.current;

    // Two-stage choreography:
    //   1. Panel exhales out: fade + soft scale-down + slight blur + lift.
    //   2. Mode swaps; panel inhales in: scale-up from 1.02 with a tiny
    //      back-out kick, blur clears.
    //   3. Inner content (.auth-stagger) re-enters in a quick stagger so
    //      the label / heading / fields / button cascade rather than
    //      flashing all at once.
    //   4. A short border-glow pulse runs in parallel to telegraph the
    //      transition without feeling busy.
    // Total ~0.55s — stylish without being slow.
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.to(panel, {
      opacity: 0,
      scale: 0.97,
      y: 4,
      filter: 'blur(6px)',
      duration: 0.18,
      ease: 'power2.in',
    })
    .add(() => { setAuthMode(mode); })
    .fromTo(panel,
      { opacity: 0, scale: 1.02, y: -4, filter: 'blur(6px)' },
      { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.32, ease: 'back.out(1.4)' }
    )
    .fromTo(panel.querySelectorAll('.auth-stagger'),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.32, stagger: 0.045, ease: 'expo.out' },
      '-=0.22'
    )
    // Border-glow pulse — pure box-shadow, no layout cost.
    .fromTo(panel,
      { boxShadow: '0 0 0 0 rgba(38,103,255,0)' },
      { boxShadow: '0 0 32px 6px rgba(38,103,255,0.30)', duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.inOut' },
      '-=0.34'
    )
    .set(panel, { clearProps: 'boxShadow,filter' });
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

    if (authMode === 'register') {
      const r = await register(formData);
      if (r.error || !r.data?.setupToken) {
        setError(r.error || 'Registration failed.');
        setIsAuthenticating(false);
        return;
      }
      // Step 1 done — fetch the QR for step 2.
      const setupToken = r.data.setupToken;
      const qr = await totpSetup(setupToken);
      if (qr.error || !qr.data?.qrDataUrl) {
        setError(qr.error || 'Failed to generate authenticator QR.');
        setIsAuthenticating(false);
        return;
      }
      setTotpServerToken(setupToken);
      setTotpQR({ qrDataUrl: qr.data.qrDataUrl, manualSecret: qr.data.manualSecret, account: qr.data.account });
      setTotpFlow('setup');
      setTotpCode('');
      setIsAuthenticating(false);
      return;
    }

    // authMode === 'login'
    const r = await login({ email: formData.email, password: formData.password });
    if (r.error) {
      setError(r.error);
      setIsAuthenticating(false);
      return;
    }

    // 2FA gate: backend says we need a TOTP code before issuing the JWT.
    if (r.data?.requiresTotp && r.data.totpToken) {
      setTotpServerToken(r.data.totpToken);
      setTotpFlow('login');
      setTotpCode('');
      setIsAuthenticating(false);
      return;
    }

    // Legacy account (no 2FA) — full token returned directly.
    if (r.data?.token) {
      finishLogin(r.data.token, r.data.user);
      return;
    }

    setError('Unexpected response from server.');
    setIsAuthenticating(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  const S = "var(--font-display)";
  const I = "var(--font-body)";

  const T = isDark ? {
    bg: 'transparent', logoName: '#dceaf4', logoSub: 'var(--accent-cyan)',
    iconBg: 'rgba(15,15,25,0.6)', iconBdr: 'rgba(255,255,255,0.10)',
    onlineBg: 'rgba(0,200,80,0.07)', onlineClr: '#4ade80', onlineBdr: 'rgba(74,222,128,0.20)',
    offlineBg: 'rgba(239,68,68,0.10)', offlineClr: '#f87171', offlineBdr: 'rgba(248,113,113,0.30)',
    checkingBg: 'rgba(245,158,11,0.10)', checkingClr: '#fbbf24', checkingBdr: 'rgba(251,191,36,0.30)',
    h1a: '#22d3ee', h1m: '#67e8f9', h1b: '#c4b5fd',
    h2a: '#2dd4bf', h2m: '#34d399', h2b: '#d1fae5',
    h3a: '#6ee7b7', h3m: '#ecfdf5', h3b: '#67e8f9',
    divider: 'rgba(38,103,255,0.35)', body: 'rgba(220,234,244,0.74)',
    cardBg: '#0a1022', cardBdr: 'rgba(135,191,255,0.18)', cardShadow: '0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)', cardGlow: 'rgba(38,103,255,0.12)',
    initClr: 'rgba(255,255,255,0.32)', zapClr: 'var(--accent-violet)', cardTitle: '#dceaf4',
    btnBg: 'var(--accent-cyan)', btnShadow: '0 8px 30px rgba(38,103,255,0.5)',
    secBtnBg: 'rgba(255,255,255,0.05)', secBtnBdr: 'rgba(255,255,255,0.15)',
    inpBg: 'rgba(255,255,255,0.05)', inpBdr: 'rgba(255,255,255,0.15)', text: '#ffffff',
    secTitle: '#ffffff', secText: 'rgba(255,255,255,0.6)',
  } : {
    bg: 'transparent', logoName: '#0a1230', logoSub: 'var(--accent-cyan)',
    iconBg: 'rgba(255,255,255,0.90)', iconBdr: 'rgba(0,0,0,0.10)',
    onlineBg: 'rgba(0,140,50,0.07)', onlineClr: '#166534', onlineBdr: 'rgba(22,101,52,0.20)',
    offlineBg: 'rgba(220,38,38,0.08)', offlineClr: '#991b1b', offlineBdr: 'rgba(153,27,27,0.25)',
    checkingBg: 'rgba(217,119,6,0.08)', checkingClr: '#92400e', checkingBdr: 'rgba(146,64,14,0.25)',
    h1a: '#075985', h1m: '#0369a1', h1b: '#0891b2',
    h2a: '#115e59', h2m: '#0f766e', h2b: '#059669',
    h3a: '#064e3b', h3m: '#047857', h3b: '#0d9488',
    divider: 'rgba(2,132,199,0.30)', body: 'rgba(10,18,48,0.7)',
    cardBg: '#f4f7fd', cardBdr: 'rgba(0,0,0,0.06)', cardShadow: '0 30px 70px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)', cardGlow: 'rgba(2,132,199,0.15)',
    initClr: 'rgba(0,0,0,0.40)', zapClr: 'var(--accent-violet)', cardTitle: '#0a1230',
    btnBg: 'var(--accent-cyan)', btnShadow: '0 8px 24px rgba(38,103,255,0.32)',
    secBtnBg: 'rgba(0,0,0,0.03)', secBtnBdr: 'rgba(0,0,0,0.10)',
    inpBg: 'rgba(0,0,0,0.04)', inpBdr: 'rgba(0,0,0,0.12)', text: '#0a1230',
    secTitle: '#0a0a1a', secText: 'rgba(0,0,0,0.6)',
  };

  const inpStyle = { width: '100%', padding: '1rem 1rem 1rem 3rem', background: T.inpBg, border: `1px solid ${T.inpBdr}`, borderRadius: '16px', color: T.text, fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s' };
  const iconStyle = { position: 'absolute' as any, left: '16px', top: '50%', transform: 'translateY(-50%)', color: T.initClr };

  // Note: previously this returned a full-page <LoadingScreen /> while
  // authenticating and a full-page <SuccessAnimation /> on success.
  // Both caused jarring page swaps right after the user clicked a
  // button. We now keep the form panel visible throughout — buttons
  // show their own inline state (e.g. "Signing in…"), and on success
  // we transition straight to the dashboard via onAuthenticate without
  // any intermediate full-screen overlay.

  return (
    <div ref={containerRef} className="relative w-full" style={{ fontFamily: I, background: T.bg }}>
      
      <div id="section-hero" className="scroll-section min-h-dvh relative flex flex-col" style={{ padding: '2rem 4rem' }}>
        <header className="grid grid-cols-3 items-center fade-up w-full max-w-[1600px] mx-auto">
          <div className="justify-self-start"><ThemeToggleButton /></div>
          <div className="flex items-center gap-3 justify-self-center">
            <div className="mag p-2.5 rounded-xl backdrop-blur-xl cursor-pointer" style={{ background: T.iconBg, border: `1px solid ${T.iconBdr}` }}>
              <ActivitySquare className="w-6 h-6" style={{ color: T.logoSub }} />
            </div>
            <div>
              <div style={{ fontFamily: S, fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em', color: T.logoName }}>CuraSense</div>
              <div style={{ fontFamily: I, fontSize: '0.7rem', fontWeight: 500, color: T.logoSub }}>Health intelligence · demo</div>
            </div>
          </div>
          <div className="justify-self-end">
            {(() => {
              const tone = serverStatus === 'online'
                ? { bg: T.onlineBg,  clr: T.onlineClr,  bdr: T.onlineBdr,  label: 'All systems online'  }
                : serverStatus === 'offline'
                ? { bg: T.offlineBg, clr: T.offlineClr, bdr: T.offlineBdr, label: 'Some systems offline' }
                : { bg: T.checkingBg, clr: T.checkingClr, bdr: T.checkingBdr, label: 'Checking Servers…'    };
              return (
                <div
                  title={serverStatus === 'offline' ? 'One or more backend services failed to respond.' : tone.label}
                  className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-xl"
                  style={{ fontFamily: S, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0', background: tone.bg, color: tone.clr, border: `1px solid ${tone.bdr}`, transition: 'background 0.3s, color 0.3s, border-color 0.3s' }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: tone.clr }} /> {tone.label}
                </div>
              );
            })()}
          </div>
        </header>

        <nav className="fade-up hidden md:flex justify-center gap-10 mt-5" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          {[['Platform', 'reel-problem'], ['Approach', 'reel-approach'], ['Access', 'section-hero']].map(([l, id]) => (
            <button key={l} onClick={() => scrollToSection(id)} style={{ color: T.body, background: 'none', border: 0, cursor: 'pointer' }}>{l}</button>
          ))}
        </nav>

        <div className="flex-1 flex items-center max-w-[1600px] mx-auto w-full mt-8">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
            <div className="w-full lg:col-span-5" style={{ perspective: '1000px' }}>
              <h1 className="hero-text" style={{ fontFamily: S, fontSize: 'clamp(3rem, 6vw, 5.75rem)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.045em', color: T.logoName }}>Clinical precision,</h1>
              <h1 className="hero-text hero-gradient-text" style={{ fontFamily: S, fontSize: 'clamp(3rem, 6vw, 5.75rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.045em', marginBottom: '1rem', paddingBottom: '0.08em', background: 'linear-gradient(100deg, var(--accent-cyan), var(--accent-violet), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>redefined.</h1>
              
              {/* EKG accent — same .uline class GSAP already scaleX-reveals, just
                  a heartbeat trace instead of a flat bar. Ties the headline
                  straight to the brand's actual heartbeat mark. */}
              <svg
                className="uline mt-8 mb-8"
                viewBox="0 0 300 24"
                preserveAspectRatio="none"
                style={{ width: '100%', maxWidth: '300px', height: '24px', display: 'block' }}
              >
                <path
                  d="M0,12 L60,12 Q72,6 84,12 L96,12 L104,18 L114,0 L124,22 L136,12 L300,12"
                  fill="none"
                  stroke={T.divider}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              
              <p className="fade-up text-xl" style={{ fontWeight: 400, lineHeight: 1.6, letterSpacing: '-0.01em', color: T.body, maxWidth: '600px' }}>
                Harness the architecture of deep neural networks to process biomarker data, radiological scans,
                and genomic structures — delivering absolute diagnostic clarity for complex pathologies.
              </p>
              
              <div className="fade-up mt-12 flex items-center gap-6">
                <button onClick={() => scrollToSection('reel-problem')} className="mag px-8 py-4 rounded-full font-semibold text-base transition-all" style={{ background: T.secBtnBg, border: `1px solid ${T.secBtnBdr}`, color: T.logoName, fontFamily: S }}>
                  Explore Medical Framework <ChevronDown className="inline w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-3" aria-hidden />
            <div className="w-full max-w-md lg:col-span-4 lg:justify-self-end">
              <Card ref={panelRef} className="gpanel relative p-10 rounded-[2rem]" style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.cardShadow }}>
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
                  {totpFlow && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.initClr }}>
                          {totpFlow === 'setup' ? 'Step 2 · Set up 2FA' : 'Two-factor sign-in'}
                        </span>
                        <Smartphone className="w-5 h-5" style={{ color: T.zapClr }} />
                      </div>
                      <h3 style={{ fontFamily: I, fontSize: '1.5rem', fontWeight: 700, color: T.cardTitle, marginBottom: '0.6rem' }}>
                        {totpFlow === 'setup' ? 'Scan with Google Authenticator' : 'Enter your 6-digit code'}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: T.secText, marginBottom: '1.4rem', lineHeight: 1.55 }}>
                        {totpFlow === 'setup'
                          ? 'Open the Google Authenticator app, tap +, and scan the QR code below. Then enter the 6-digit code the app shows.'
                          : 'Open Google Authenticator and type the 6-digit code currently shown for CuraSense.'}
                      </p>

                      {totpFlow === 'setup' && totpQR && (
                        <>
                          <div className="flex justify-center mb-3">
                            <div style={{ padding: '12px', borderRadius: '14px', background: '#ffffff', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
                              <img src={totpQR.qrDataUrl} alt="Google Authenticator QR" style={{ width: 200, height: 200, display: 'block' }} />
                            </div>
                          </div>
                          <div style={{ marginBottom: '1.2rem' }}>
                            <p style={{ fontSize: '0.7rem', color: T.initClr, marginBottom: 6, textAlign: 'center' }}>Can't scan? Enter this key manually:</p>
                            <button
                              type="button"
                              onClick={copyManualSecret}
                              className="mag w-full"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.7rem 1rem', borderRadius: '12px', background: T.inpBg, border: `1px solid ${T.inpBdr}`, color: T.text, fontFamily: 'monospace', fontSize: '0.78rem', letterSpacing: '0.08em', cursor: 'pointer' }}
                            >
                              {totpQR.manualSecret}
                              {secretCopied ? <Check className="w-4 h-4" style={{ color: '#10b981' }} /> : <Copy className="w-4 h-4" style={{ opacity: 0.6 }} />}
                            </button>
                          </div>
                        </>
                      )}

                      <div className="flex flex-col gap-4 mb-4">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="123 456"
                          autoFocus
                          style={{ ...inpStyle, paddingLeft: '1rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '1.4rem', letterSpacing: '0.4em', fontWeight: 700 }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={submitTotpCode}
                        disabled={isAuthenticating || totpCode.length !== 6}
                        className="mag w-full py-4 rounded-full text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mb-3"
                        style={{ fontFamily: I, fontSize: '0.95rem', background: T.btnBg, boxShadow: T.btnShadow, opacity: (isAuthenticating || totpCode.length !== 6) ? 0.5 : 1, cursor: (isAuthenticating || totpCode.length !== 6) ? 'not-allowed' : 'pointer' }}
                      >
                        {isAuthenticating ? 'Verifying…' : (totpFlow === 'setup' ? 'Verify & finish sign-up' : 'Verify & sign in')}
                        <ArrowRight className="inline w-5 h-5 ml-2" />
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => { cancelTotp(); switchAuthMode(totpFlow === 'setup' ? 'register' : 'login'); }}
                          style={{ fontSize: '0.8rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}
                        >
                          ← Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {!totpFlow && authMode === 'none' && (
                    <>
                      <div className="auth-stagger flex justify-between items-center mb-10">
                        <span style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.initClr }}>Get started</span>
                        <Zap className="w-5 h-5" style={{ color: T.zapClr }} />
                      </div>
                      <h3 className="auth-stagger" style={{ fontFamily: I, fontSize: '2rem', fontWeight: 700, lineHeight: 1.15, color: T.cardTitle, marginBottom: '2.5rem' }}>Sign in</h3>
                      <div className="flex flex-col gap-4">
                        <button onClick={() => switchAuthMode('login')} className="auth-stagger mag w-full py-4 rounded-full text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: I, fontSize: '0.95rem', background: T.btnBg, boxShadow: T.btnShadow }}>
                          Sign in
                        </button>
                        <button onClick={() => switchAuthMode('register')} className="auth-stagger mag w-full py-4 rounded-full font-semibold transition-all hover:bg-opacity-80 hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: I, fontSize: '0.95rem', background: T.secBtnBg, border: `1px solid ${T.secBtnBdr}`, color: T.cardTitle }}>
                          Create an account
                        </button>
                      </div>
                    </>
                  )}

                  {!totpFlow && authMode === 'login' && (
                    <form onSubmit={handleAuthSubmit}>
                      <div className="auth-stagger flex justify-between items-center mb-8">
                        <span style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.initClr }}>Sign in</span>
                        <User className="w-5 h-5" style={{ color: T.zapClr }} />
                      </div>
                      <h3 className="auth-stagger" style={{ fontFamily: I, fontSize: '1.6rem', fontWeight: 700, color: T.cardTitle, marginBottom: '2rem' }}>Welcome back</h3>
                      <div className="flex flex-col gap-5 mb-4">
                        <div className="auth-stagger" style={{ position: 'relative' }}><Mail style={iconStyle} className="w-5 h-5" /><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" required style={inpStyle} /></div>
                        <div className="auth-stagger" style={{ position: 'relative' }}><Lock style={iconStyle} className="w-5 h-5" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password" required style={inpStyle} /></div>
                      </div>
                      <div className="auth-stagger flex justify-end mb-6">
                        <button type="button" onClick={() => switchAuthMode('forgot')} style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>Forgot password?</button>
                      </div>
                      <button
                        type="submit"
                        disabled={isAuthenticating}
                        className="auth-stagger mag w-full py-4 rounded-full text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mb-4"
                        style={{ fontFamily: I, fontSize: '0.95rem', background: T.btnBg, boxShadow: T.btnShadow, opacity: isAuthenticating ? 0.7 : 1, cursor: isAuthenticating ? 'wait' : 'pointer' }}
                      >
                        {isAuthenticating ? 'Signing in…' : <>Sign in <ArrowRight className="inline w-5 h-5 ml-2" /></>}
                      </button>
                      <div className="auth-stagger text-center">
                        <button type="button" onClick={() => switchAuthMode('none')} style={{ fontSize: '0.8rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>← Back to Menu</button>
                      </div>
                    </form>
                  )}

                  {!totpFlow && authMode === 'register' && (
                    <form onSubmit={handleAuthSubmit}>
                      <div className="auth-stagger flex justify-between items-center mb-8">
                        <span style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.initClr }}>Step 1 · Account</span>
                        <ShieldCheck className="w-5 h-5" style={{ color: T.zapClr }} />
                      </div>
                      <h3 className="auth-stagger" style={{ fontFamily: I, fontSize: '1.6rem', fontWeight: 700, color: T.cardTitle, marginBottom: '2rem' }}>Create your account</h3>
                      <div className="flex flex-col gap-5 mb-8">
                        <div className="auth-stagger" style={{ position: 'relative' }}><User style={iconStyle} className="w-5 h-5" /><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full name" required style={inpStyle} /></div>
                        <div className="auth-stagger" style={{ position: 'relative' }}><Mail style={iconStyle} className="w-5 h-5" /><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" required style={inpStyle} /></div>
                        <div className="auth-stagger" style={{ position: 'relative' }}><Lock style={iconStyle} className="w-5 h-5" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password (min 8 characters)" required style={inpStyle} /></div>
                      </div>
                      <button
                        type="submit"
                        disabled={isAuthenticating}
                        className="auth-stagger mag w-full py-4 rounded-full text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mb-4"
                        style={{ fontFamily: I, fontSize: '0.95rem', background: T.btnBg, boxShadow: T.btnShadow, opacity: isAuthenticating ? 0.7 : 1, cursor: isAuthenticating ? 'wait' : 'pointer' }}
                      >
                        {isAuthenticating ? 'Creating account…' : <>Continue <ArrowRight className="inline w-5 h-5 ml-2" /></>}
                      </button>
                      <div className="auth-stagger text-center">
                        <button type="button" onClick={() => switchAuthMode('none')} style={{ fontSize: '0.8rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>← Back to Menu</button>
                      </div>
                    </form>
                  )}

                  {!totpFlow && authMode === 'forgot' && (
                    <form onSubmit={handleAuthSubmit}>
                      <div className="flex justify-between items-center mb-8">
                        <span style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.initClr }}>Reset password</span>
                        <RefreshCw className="w-5 h-5 text-emerald-500" />
                      </div>
                      <h3 style={{ fontFamily: I, fontSize: '1.6rem', fontWeight: 700, color: T.cardTitle, marginBottom: '1rem' }}>Reset your password</h3>
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
                          <button type="submit" disabled={isAuthenticating} className="mag w-full py-5 rounded-full text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97] mb-4" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow, opacity: isAuthenticating ? 0.6 : 1 }}>
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

                          <button type="submit" disabled={isAuthenticating || typedCode.length !== 6} className="mag w-full py-5 rounded-full text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97] mb-3" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow, opacity: (isAuthenticating || typedCode.length !== 6) ? 0.5 : 1 }}>
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

                          <button type="submit" disabled={isAuthenticating} className="mag w-full py-5 rounded-full text-white font-bold transition-all hover:scale-[1.03] active:scale-[0.97] mb-3" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow, opacity: isAuthenticating ? 0.6 : 1 }}>
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

      {/* ── NARRATIVE REEL ─────────────────────────────────
          Six full-viewport scenes — Problem → Approach →
          Symptoms → Imaging → Labs → Synthesis. Each scene
          owns its background visual and content choreography.
          Replaces the prior cluttered marketing stack. */}
      <NarrativeReel
        isDark={isDark}
        onPrimaryCta={() => {
          const hero = document.getElementById('section-hero');
          if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Open the login panel after the scroll lands.
          setTimeout(() => switchAuthMode('login'), 700);
        }}
      />
    </div>
  );
}

// SuccessAnimation removed — auth now hands off straight to the
// post-login cinematic, no full-page intermediate overlay.