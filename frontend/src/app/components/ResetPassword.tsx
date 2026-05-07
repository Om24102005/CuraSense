/* ═══════════════════════════════════════════════════════════════════
   CuraSense — Reset Password Screen
   ───────────────────────────────────────────────────────────────────
   Shown when the URL contains ?reset=<token>. The token is the JWT
   the backend mailed; we POST it to /reset-password along with the
   new password. On success the user is redirected to the regular
   login page (URL cleared, so reloading doesn't put them back here).

   Three states:
     • form     — pick + confirm a new password
     • success  — password updated, button to "Continue to Login"
     • expired  — token rejected by the server
   ═══════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { resetPassword } from '../utils/api';

interface ResetPasswordProps {
  token: string;
  /** Called after successful reset — App should clear ?reset= and show the login screen. */
  onDone: () => void;
}

export default function ResetPassword({ token, onDone }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<'form' | 'success' | 'expired'>('form');
  const [error, setError] = useState('');

  const submit = async (e: any) => {
    e?.preventDefault?.();
    setError('');

    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setBusy(true);
    const res = await resetPassword(token, password);
    setBusy(false);

    if (res.error) {
      // Server-side "expired/invalid/used" message → show expired UI so the
      // user knows to request a new link instead of retrying.
      if (/expired|invalid|already been used/i.test(res.error)) {
        setStage('expired');
      } else {
        setError(res.error);
      }
      return;
    }
    setStage('success');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.15), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(34,211,238,0.10), transparent 60%), #02020a',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(12,12,26,0.78)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '24px',
          padding: '2.25rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 8px 28px rgba(139,92,246,0.45)',
              marginBottom: '1rem',
            }}
          >
            {stage === 'success' ? <ShieldCheck size={28} /> : <Lock size={26} />}
          </div>
          <h1
            style={{
              fontFamily: "'Michroma', sans-serif",
              fontSize: '1.4rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              margin: 0,
              backgroundImage: 'linear-gradient(120deg, #fff, #a855f7, #22d3ee)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {stage === 'form' && 'Reset Password'}
            {stage === 'success' && 'Password Updated'}
            {stage === 'expired' && 'Link Expired'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginTop: '6px' }}>
            {stage === 'form' && 'Pick a new password for your CuraSense account.'}
            {stage === 'success' && 'You can now log in with your new password.'}
            {stage === 'expired' && 'This reset link is no longer valid.'}
          </p>
        </div>

        {/* FORM */}
        {stage === 'form' && (
          <form onSubmit={submit}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
              New password
            </label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 0.9rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
              Confirm password
            </label>
            <input
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={(e: any) => setConfirm(e.target.value)}
              placeholder="Repeat the same password"
              style={{
                width: '100%',
                padding: '0.75rem 0.9rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                marginBottom: '1rem',
              }}
            />

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(239,68,68,0.10)',
                  border: '1px solid rgba(239,68,68,0.30)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                border: 'none',
                fontFamily: "'Michroma', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                cursor: busy ? 'wait' : 'pointer',
                opacity: busy ? 0.6 : 1,
                boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {busy ? 'Updating…' : 'Set new password'}
              {!busy && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        {/* SUCCESS */}
        {stage === 'success' && (
          <button
            onClick={onDone}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              color: '#fff',
              border: 'none',
              fontFamily: "'Michroma', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Continue to login <ArrowRight size={16} />
          </button>
        )}

        {/* EXPIRED */}
        {stage === 'expired' && (
          <>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Reset links are single-use and expire 30 minutes after they're sent. Head back to the login page and request a new one.
            </p>
            <button
              onClick={onDone}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.12)',
                fontFamily: "'Michroma', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
