/* Global sign-in / sign-up dialog, opened from any public page (nav buttons, hero doors, page CTAs).
   All the auth state and requests that used to live in the landing hero card live here now: login, register,
   password reset, and the Google Authenticator (TOTP) steps. Behind a Radix dialog for focus trapping, Esc, scroll lock. */
import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, ActivitySquare, AlertCircle, Check, Copy, Lock, Mail, ShieldCheck, User, X } from 'lucide-react';
import { gsap, useReducedMotion } from '../../animations';
import { useTheme } from '../../App';
import { AuthStepFx, type FxPhase } from './AuthStepFx';
import { CodeBoxes } from './CodeBoxes';
import { login, register, forgotPassword, verifyResetCode, resetPassword, totpSetup, totpVerify, loginTotp } from '../../services/api';

export type AuthMode = 'login' | 'register' | 'forgot';
/** What the visitor clicked on before signing up: after login the app opens that analysis tool. */
export type AuthIntent = 'symptoms' | 'image' | 'report';
export const INTENT_KEY = 'curasense_intent';

const INTENT_COPY: Record<AuthIntent, string> = { symptoms: 'Check symptoms', image: 'Read a scan', report: 'Explain a lab report' };
// Steps sit on a line, so moving between them slides in the direction of travel.
const ORDER: Record<AuthMode, number> = { forgot: 0, login: 1, register: 2 };
const TITLES: Record<AuthMode, string> = { login: 'Sign in to CuraSense', register: 'Create your CuraSense account', forgot: 'Reset your CuraSense password' };

interface AuthDialogProps {
  open: boolean;
  mode: AuthMode;
  intent?: AuthIntent;
  container?: HTMLElement | null;
  onClose: () => void;
  /** Called once the account is signed in. The arrival animation (App) takes over; this dialog stays locked under it. */
  onAuthenticate: (user: { name?: string }, kind: 'login' | 'signup') => void;
}

export function AuthDialog({ open, mode: initialMode, intent, container, onClose, onAuthenticate }: AuthDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fx, setFx] = useState<{ phase: FxPhase; title: string; sub?: string; leaving?: boolean } | null>(null);   // the small step animation over the form
  const reduced = useReducedMotion();
  /* ── Three-stage reset flow ──
     'idle'     → email input screen
     'code'     → code entry screen (after email submitted, code emailed)
     'password' → new password screen (after code verified). Skip is here.

     The code itself never leaves the backend; the user gets it via email.
     /verify-reset-code confirms the typed code before we reveal the
     password screen, so users can't skip ahead by guessing. */
  type ResetStage = 'idle' | 'code' | 'password';
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
  const [codeBad, setCodeBad] = useState(false);   // the last code was wrong: the boxes stay red and shake until the next digit
  const [secretCopied, setSecretCopied] = useState(false);

  const cancelTotp = () => {
    setTotpFlow(null);
    setTotpServerToken('');
    setTotpQR(null);
    setTotpCode('');
    setCodeBad(false);
    setSecretCopied(false);
    setError('');
    setSuccessMsg('');
  };

  const finishLogin = (token: string, user: any, kind: 'login' | 'signup') => {
    localStorage.setItem('curasense_token', token);
    localStorage.setItem('curasense_user', JSON.stringify(user));
    if (intent) sessionStorage.setItem(INTENT_KEY, intent);   // the app opens that analysis tool first
    // No tick here on purpose: the big arrival animation is the only thing that plays at this point.
    onAuthenticate(user, kind);
  };

  /** Runs when the sixth digit lands (the boxes pass the code in, so it never reads a stale one) and from the Verify button. */
  const submitTotpCode = async (code = totpCode) => {
    if (isAuthenticating) return;
    setError('');
    if (code.length !== 6) {
      setError('Enter the 6-digit code from Google Authenticator.');
      return;
    }
    setIsAuthenticating(true);
    const r = totpFlow === 'setup'
      ? await totpVerify(totpServerToken, code)
      : await loginTotp(totpServerToken, code);
    if (r.error || !r.data?.token) {
      setIsAuthenticating(false);
      setError(r.error || 'Verification failed.');
      setCodeBad(true);
      setTotpCode('');   // empty red boxes, caret back in the first one
      return;
    }
    finishLogin(r.data.token, r.data.user, totpFlow === 'setup' ? 'signup' : 'login');
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
    setCodeBad(false);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
  };

  // ── step animation ──
  // A request shows the loading screen for at least MIN_LOAD ms (a fast server must not make it flash), a success then holds
  // for HOLD ms, and only then does the next step appear. The last step (the authenticator code) uses neither: the big
  // arrival animation is the only thing that plays there.
  const MIN_LOAD = reduced ? 0 : 480, HOLD = reduced ? 120 : 720;
  const nap = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const withLoading = async <T,>(title: string, sub: string, work: () => Promise<T>): Promise<T> => {
    setFx({ phase: 'loading', title, sub });
    const [res] = await Promise.all([work(), nap(MIN_LOAD)]);
    return res;
  };
  const celebrate = async (title: string, sub: string) => { setFx({ phase: 'success', title, sub }); await nap(HOLD); };
  /** The new step is already mounted under the opaque overlay. Two frames later (committed and painted) its pieces are hidden and
      rise in while the overlay fades away: nothing is ever shown twice or flashes at full strength first. */
  const nextStep = () => {
    setIsAuthenticating(false);
    if (reduced) { setFx(null); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      riseIn();
      setFx((f) => f && { ...f, leaving: true });
      setTimeout(() => setFx(null), 260);
    }));
  };
  /** Rise-in for the pieces of the step on screen. CSS transitions are switched off on them for the length of the tween: the global
      button/input rule transitions every property, which would low-pass the tween and make buttons arrive late. */
  const riseIn = (dir = 0) => {
    const els = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('.ad-step > *') ?? []);
    if (!els.length) return;
    els.forEach((el) => { el.style.transition = 'none'; });
    gsap.fromTo(els, { opacity: 0, x: dir * 18, y: dir ? 0 : 8 }, { opacity: 1, x: 0, y: 0, duration: 0.32, stagger: { amount: 0.12 }, ease: 'expo.out', clearProps: 'opacity,transform,transition' });   // the same short stagger however many pieces the step has
  };
  const fail = (message: string) => { setFx(null); setIsAuthenticating(false); setError(message); };

  /** Sign-in, sign-up and reset swap places: the old step slides out one way and the new one's pieces follow from the other. Opacity and transform
      only: a blur or a shadow animated on the whole panel is repainted every frame. */
  const switchAuthMode = (next: AuthMode) => {
    setError('');
    setSuccessMsg('');
    const panel = panelRef.current;
    if (!panel || reduced) { setAuthMode(next); return; }
    const dir = Math.sign(ORDER[next] - ORDER[authMode]) || 1;
    gsap.to(panel, {
      opacity: 0, x: -dir * 14, duration: 0.12, ease: 'power2.in', overwrite: true,
      onComplete: () => {
        setAuthMode(next);
        // the new step is committed and painted (still hidden) two frames later: show the panel and let its pieces rise in together
        requestAnimationFrame(() => requestAnimationFrame(() => { gsap.set(panel, { clearProps: 'opacity,transform' }); riseIn(dir); }));
      },
    });
  };

  const handleAuthSubmit = async (e?: React.FormEvent) => {   // no event when the reset code's sixth digit submits it
    e?.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsAuthenticating(true);
    try {
      if (authMode === 'forgot') {
        /* Three steps: email -> /forgot-password -> 'code'; code -> /verify-reset-code -> 'password'; password -> /reset-password -> back to sign-in. */
        if (resetStage === 'idle') {
          const response = await withLoading('Sending your code', 'One moment', () => forgotPassword(formData.email));
          if (response.error) return fail(response.error);
          const data = response.data as any;
          await celebrate('Check your email', 'Enter the code on the next screen');
          setResetEmail(String(data?.email || formData.email));
          setResetMaskedEmail(String(data?.maskedEmail || ''));
          setResetCode(typeof data?.code === 'string' ? data.code : null);
          setResetStage('code');
          return nextStep();
        }
        if (resetStage === 'code') {
          if (!typedCode.trim() || typedCode.trim().length !== 6) return fail('Enter the 6-digit code from your email.');
          const v = await withLoading('Checking your code', 'One moment', () => verifyResetCode(resetEmail, typedCode.trim()));
          if (v.error) { setCodeBad(true); setTypedCode(''); return fail(v.error); }
          await celebrate('Code verified', 'Now choose a new password');
          setResetStage('password');
          return nextStep();
        }
        if (resetStage === 'password') {
          if (newPassword.length < 8) return fail('Password must be at least 8 characters.');
          if (newPassword !== confirmPassword) return fail('Passwords do not match.');
          const r = await withLoading('Updating your password', 'Almost there', () => resetPassword(resetEmail, typedCode.trim(), newPassword));
          if (r.error) return fail(r.error);
          await celebrate('Password updated', 'Taking you back to sign in');
          cancelReset();
          setAuthMode('login');
          setSuccessMsg('Password updated. Sign in with your new password.');
          return nextStep();
        }
        return fail('');
      }

      if (authMode === 'register') {
        const out = await withLoading('Creating your account', 'Setting up your secure sign-in', async () => {
          const r = await register(formData);
          if (r.error || !r.data?.setupToken) return { error: r.error || 'Registration failed.' };
          const qr = await totpSetup(r.data.setupToken);   // step 2 needs the QR
          if (qr.error || !qr.data?.qrDataUrl) return { error: qr.error || 'Failed to generate authenticator QR.' };
          return { setupToken: r.data.setupToken as string, qr: qr.data };
        });
        if ('error' in out) return fail(out.error ?? 'Registration failed.');
        await celebrate('Account created', 'Next: link your authenticator app');
        setTotpServerToken(out.setupToken);
        setTotpQR({ qrDataUrl: out.qr.qrDataUrl, manualSecret: out.qr.manualSecret, account: out.qr.account });
        setTotpFlow('setup');
        setTotpCode('');
        return nextStep();
      }

      // authMode === 'login'
      const r = await withLoading('Verifying your credentials', 'Checking your email and password', () => login({ email: formData.email, password: formData.password }));
      if (r.error) return fail(r.error);

      // 2FA gate: backend says we need a TOTP code before issuing the JWT.
      if (r.data?.requiresTotp && r.data.totpToken) {
        await celebrate('Password verified', 'One more step: your authenticator code');
        setTotpServerToken(r.data.totpToken);
        setTotpFlow('login');
        setTotpCode('');
        return nextStep();
      }

      // No authenticator yet (a sign-up left unfinished, or a new admin): the password opens the setup step, never the account.
      if (r.data?.requiresTotpSetup && r.data.setupToken) {
        const qr = await totpSetup(r.data.setupToken);
        if (qr.error || !qr.data?.qrDataUrl) return fail(qr.error || 'Failed to generate authenticator QR.');
        await celebrate('Password verified', 'Next: link your authenticator app');
        setTotpServerToken(r.data.setupToken);
        setTotpQR({ qrDataUrl: qr.data.qrDataUrl, manualSecret: qr.data.manualSecret, account: qr.data.account });
        setTotpFlow('setup');
        setTotpCode('');
        return nextStep();
      }

      // Legacy account (no 2FA): the full token comes straight back, so the loading screen hands over to the arrival animation.
      if (r.data?.token) return finishLogin(r.data.token, r.data.user, 'login');

      fail('Unexpected response from server.');
    } catch {
      fail('Something went wrong. Please try again.');
    }
  };

  const S = "var(--font-display)";
  const I = "var(--font-body)";

  const T = isDark ? {
    bg: 'transparent', logoName: '#dceaf4', logoSub: 'var(--accent-cyan)',
    iconBg: 'rgba(15,15,25,0.6)', iconBdr: 'rgba(255,255,255,0.10)',
    h1a: '#22d3ee', h1m: '#67e8f9', h1b: '#c4b5fd',
    h2a: '#2dd4bf', h2m: '#34d399', h2b: '#d1fae5',
    h3a: '#6ee7b7', h3m: '#ecfdf5', h3b: '#67e8f9',
    divider: 'rgba(38,103,255,0.35)', body: 'rgba(220,234,244,0.74)',
    cardBg: '#0a1022', cardBdr: 'rgba(135,191,255,0.18)', cardShadow: '0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)', cardGlow: 'rgba(38,103,255,0.12)',
    initClr: 'rgba(255,255,255,0.68)', zapClr: 'var(--accent-violet)', cardTitle: '#dceaf4',
    btnBg: 'var(--accent-violet)', btnShadow: '0 8px 30px rgba(38,103,255,0.5)',   // brand blue: the pale --accent-cyan fails white-text contrast
    secBtnBg: 'rgba(255,255,255,0.05)', secBtnBdr: 'rgba(255,255,255,0.15)',
    inpBg: 'rgba(255,255,255,0.05)', inpBdr: 'rgba(255,255,255,0.15)', text: '#ffffff',
    secTitle: '#ffffff', secText: 'rgba(255,255,255,0.78)',
  } : {
    bg: 'transparent', logoName: '#0a1230', logoSub: 'var(--accent-cyan)',
    iconBg: 'rgba(255,255,255,0.90)', iconBdr: 'rgba(0,0,0,0.10)',
    h1a: '#075985', h1m: '#0369a1', h1b: '#0891b2',
    h2a: '#115e59', h2m: '#0f766e', h2b: '#059669',
    h3a: '#064e3b', h3m: '#047857', h3b: '#0d9488',
    divider: 'rgba(2,132,199,0.30)', body: 'rgba(10,18,48,0.7)',
    cardBg: '#f4f7fd', cardBdr: 'rgba(0,0,0,0.06)', cardShadow: '0 30px 70px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)', cardGlow: 'rgba(2,132,199,0.15)',
    initClr: 'rgba(0,0,0,0.62)', zapClr: 'var(--accent-violet)', cardTitle: '#0a1230',
    btnBg: 'var(--accent-cyan)', btnShadow: '0 8px 24px rgba(38,103,255,0.32)',
    secBtnBg: 'rgba(0,0,0,0.03)', secBtnBdr: 'rgba(0,0,0,0.10)',
    inpBg: 'rgba(0,0,0,0.04)', inpBdr: 'rgba(0,0,0,0.12)', text: '#0a1230',
    secTitle: '#0a0a1a', secText: 'rgba(0,0,0,0.72)',
  };

  const inpStyle = { width: '100%', padding: '1rem 1rem 1rem 3rem', background: T.inpBg, border: `1px solid ${T.inpBdr}`, borderRadius: '16px', color: T.text, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease' };
  // z-index: the global input rule gives inputs a backdrop-filter, which paints them over an unstyled absolutely-positioned icon.
  const iconStyle = { position: 'absolute' as any, left: '16px', top: '50%', transform: 'translateY(-50%)', color: T.initClr, zIndex: 2, pointerEvents: 'none' as const };

  // A 2FA step or a request in flight must not be lost to a stray Esc or click outside.
  const locked = !!totpFlow || isAuthenticating;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o && !locked) onClose(); }}>
      <Dialog.Portal container={container ?? undefined}>
        <Dialog.Overlay className="ad-overlay" />
        <Dialog.Content
          className="ad-panel"
          data-mode={authMode}
          onOpenAutoFocus={(e) => { e.preventDefault(); panelRef.current?.querySelector<HTMLElement>('input')?.focus(); }}
          onEscapeKeyDown={(e) => { if (locked) e.preventDefault(); }}
          onInteractOutside={(e) => { if (locked) e.preventDefault(); }}
        >
          <Dialog.Title className="sr-only">{TITLES[authMode]}</Dialog.Title>
          <Dialog.Description className="sr-only">Sign in or create an account to use the CuraSense analysis tools.</Dialog.Description>

          <aside className="ad-aside">
            <span className="ad-mark" aria-hidden><ActivitySquare size={22} /></span>
            <p className="ad-kicker">CuraSense</p>
            <p className="ad-lede" key={authMode}>{authMode === 'register' ? 'One account for every analysis.' : authMode === 'forgot' ? 'Back in a minute.' : 'Welcome back.'}</p>
            <ul className="ad-points">
              <li><ShieldCheck size={16} aria-hidden />Authenticator-app two-factor sign-in, set up at sign-up</li>
              <li><ShieldCheck size={16} aria-hidden />AI keys stay on the server, never in your browser</li>
              <li><ShieldCheck size={16} aria-hidden />Decision support, not a diagnosis</li>
            </ul>
            {intent && <p className="ad-intent">Next up: <b>{INTENT_COPY[intent]}</b></p>}
          </aside>

          <div className="ad-col">
          <div ref={panelRef} className="ad-main lp-auth">
            {!totpFlow && (
              <Dialog.Close className="lp-close" aria-label="Close" disabled={isAuthenticating}><X size={16} aria-hidden /></Dialog.Close>
            )}
            {error && <div role="alert" className="ad-alert ad-alert-err"><AlertCircle className="w-5 h-5" /> {error}</div>}
            {successMsg && <div role="status" className="ad-alert ad-alert-ok"><ShieldCheck className="w-5 h-5" /> {successMsg}</div>}

            <div className="relative z-10">
          {totpFlow && (
            <div className="ad-step">
              <div className="flex justify-between items-center mb-6">
                <span style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.initClr }}>
                  {totpFlow === 'setup' ? 'Step 2 · Set up 2FA' : 'Two-factor sign-in'}
                </span>
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

              <div className="mb-5" onKeyDown={(e) => { if (e.key === 'Enter') submitTotpCode(); }}>
                <CodeBoxes
                  value={totpCode}
                  onChange={(v) => { setTotpCode(v); setCodeBad(false); setError(''); }}
                  onComplete={submitTotpCode}
                  disabled={isAuthenticating || !!fx}   // inert under the loading/tick overlay, so the big animation can never start beneath it
                  invalid={codeBad}
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={() => submitTotpCode()}
                disabled={isAuthenticating || totpCode.length !== 6}
                className="mag w-full py-4 rounded-full text-white font-semibold mb-3"
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

          {!totpFlow && authMode === 'login' && (
            <form className="ad-step" onSubmit={handleAuthSubmit}>
              <div className="auth-stagger flex justify-between items-center mb-8">
                <span style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.initClr }}>Sign in</span>
              </div>
              <h3 className="auth-stagger" style={{ fontFamily: I, fontSize: '1.6rem', fontWeight: 700, color: T.cardTitle, marginBottom: '2rem' }}>Welcome back</h3>
              <div className="flex flex-col gap-5 mb-4">
                <div className="auth-stagger" style={{ position: 'relative' }}><Mail style={iconStyle} className="w-5 h-5" /><input type="email" autoFocus value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" required style={inpStyle} /></div>
                <div className="auth-stagger" style={{ position: 'relative' }}><Lock style={iconStyle} className="w-5 h-5" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password" required style={inpStyle} /></div>
              </div>
              <div className="auth-stagger flex justify-end mb-6">
                <button type="button" onClick={() => switchAuthMode('forgot')} style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}>Forgot password?</button>
              </div>
              <button
                type="submit"
                disabled={isAuthenticating}
                className="auth-stagger mag w-full py-4 rounded-full text-white font-semibold mb-4"
                style={{ fontFamily: I, fontSize: '0.95rem', background: T.btnBg, boxShadow: T.btnShadow, opacity: isAuthenticating ? 0.7 : 1, cursor: isAuthenticating ? 'wait' : 'pointer' }}
              >
                {isAuthenticating ? 'Signing in…' : <>Sign in <ArrowRight className="inline w-5 h-5 ml-2" /></>}
              </button>
              <p className="auth-stagger lp-switch">New to CuraSense?<button type="button" onClick={() => switchAuthMode('register')}>Create an account</button></p>
            </form>
          )}

          {!totpFlow && authMode === 'register' && (
            <form className="ad-step" onSubmit={handleAuthSubmit}>
              <div className="auth-stagger flex justify-between items-center mb-8">
                <span style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.initClr }}>Step 1 · Account</span>
              </div>
              <h3 className="auth-stagger" style={{ fontFamily: I, fontSize: '1.6rem', fontWeight: 700, color: T.cardTitle, marginBottom: '2rem' }}>Create your account</h3>
              <div className="flex flex-col gap-5 mb-8">
                <div className="auth-stagger" style={{ position: 'relative' }}><User style={iconStyle} className="w-5 h-5" /><input type="text" autoFocus value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full name" required style={inpStyle} /></div>
                <div className="auth-stagger" style={{ position: 'relative' }}><Mail style={iconStyle} className="w-5 h-5" /><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" required style={inpStyle} /></div>
                <div className="auth-stagger" style={{ position: 'relative' }}><Lock style={iconStyle} className="w-5 h-5" /><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password (min 8 characters)" required style={inpStyle} /></div>
              </div>
              <button
                type="submit"
                disabled={isAuthenticating}
                className="auth-stagger mag w-full py-4 rounded-full text-white font-semibold mb-4"
                style={{ fontFamily: I, fontSize: '0.95rem', background: T.btnBg, boxShadow: T.btnShadow, opacity: isAuthenticating ? 0.7 : 1, cursor: isAuthenticating ? 'wait' : 'pointer' }}
              >
                {isAuthenticating ? 'Creating account…' : <>Continue <ArrowRight className="inline w-5 h-5 ml-2" /></>}
              </button>
              <p className="auth-stagger lp-switch">Already have an account?<button type="button" onClick={() => switchAuthMode('login')}>Sign in</button></p>
            </form>
          )}

          {!totpFlow && authMode === 'forgot' && (
            <form className="ad-step" onSubmit={handleAuthSubmit}>
              <div className="flex justify-between items-center mb-8">
                <span style={{ fontFamily: S, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.initClr }}>Reset password</span>
              </div>
              <h3 style={{ fontFamily: I, fontSize: '1.6rem', fontWeight: 700, color: T.cardTitle, marginBottom: '1rem' }}>Reset your password</h3>
              <p style={{ fontSize: '0.9rem', color: T.secText, marginBottom: '2rem', lineHeight: 1.6 }}>
                {resetStage === 'idle'     && "Enter your registered email and we'll send a 6-digit code."}
                {resetStage === 'code'     && `If ${resetMaskedEmail || 'that address'} has an account, a code is on its way. It works for 15 minutes.`}
                {resetStage === 'password' && "Code verified. Choose a new password — or skip to keep the old one."}
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
                  <button type="submit" disabled={isAuthenticating} className="mag w-full py-5 rounded-full text-white font-bold mb-4" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow, opacity: isAuthenticating ? 0.6 : 1 }}>
                    {isAuthenticating ? 'Sending…' : <>Send Code <ArrowRight className="inline w-5 h-5 ml-2" /></>}
                  </button>
                </>
              )}

              {/* ── STAGE 2 — CODE (no skip here) ── */}
              {resetStage === 'code' && (
                <>
                  {/* Only a development server returns the code; a live one emails it. */}
                  {resetCode && <div style={{
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
                      {resetMaskedEmail ? `${resetMaskedEmail} · ` : ''}valid for 15 minutes
                    </div>
                  </div>}

                  <div className="mb-6">
                    <CodeBoxes
                      value={typedCode}
                      onChange={(v) => { setTypedCode(v); setCodeBad(false); setError(''); }}
                      onComplete={() => handleAuthSubmit()}
                      disabled={isAuthenticating || !!fx}
                      invalid={codeBad}
                      autoFocus
                    />
                  </div>

                  <button type="submit" disabled={isAuthenticating || typedCode.length !== 6} className="mag w-full py-5 rounded-full text-white font-bold mb-3" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow, opacity: (isAuthenticating || typedCode.length !== 6) ? 0.5 : 1 }}>
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
                        placeholder="New Password (min 8)"
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

                  <button type="submit" disabled={isAuthenticating} className="mag w-full py-5 rounded-full text-white font-bold mb-3" style={{ fontFamily: S, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: T.btnBg, boxShadow: T.btnShadow, opacity: isAuthenticating ? 0.6 : 1 }}>
                    {isAuthenticating ? 'Updating…' : <>Reset Password <ArrowRight className="inline w-5 h-5 ml-2" /></>}
                  </button>

                  {/* Skip — only available on the password screen.
                      Drops the user back at login without changing the password. */}
                  <button
                    type="button"
                    onClick={() => { cancelReset(); switchAuthMode('login'); }}
                    className="w-full py-3 rounded-2xl font-bold"
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

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => { cancelReset(); switchAuthMode('login'); }}
                  style={{ fontSize: '0.8rem', color: T.initClr, background: 'none', border: 'none', cursor: 'pointer', fontFamily: I, fontWeight: 600 }}
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}
            </div>
          </div>
          {fx && <AuthStepFx phase={fx.phase} title={fx.title} sub={fx.sub} leaving={fx.leaving} />}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
