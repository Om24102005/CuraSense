/* Stands in front of the three analysis tools until the person has agreed to how their health data is processed.
   The server enforces the same rule; this is where the person actually reads it and answers. */
import { useCallback, useEffect, useId, useState, type ReactNode } from 'react';
import { getConsent, giveConsent } from '../../services/api';
import { PrivacyNotice } from './PrivacyNotice';

let accepted = false;   // for this page load: a sign-out reloads the page

export function ConsentGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<'checking' | 'needed' | 'failed' | 'ok'>(accepted ? 'ok' : 'checking');
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const box = useId();

  const check = useCallback(async () => {
    setState('checking');
    const r = await getConsent();
    if (r.error) return setState('failed');
    accepted = !!r.data?.accepted;
    setState(accepted ? 'ok' : 'needed');
  }, []);

  useEffect(() => { if (!accepted) void check(); }, [check]);

  const accept = async () => {
    setSaving(true);
    setError('');
    const r = await giveConsent();
    setSaving(false);
    if (r.error) return setError(r.error);
    accepted = true;
    setState('ok');
  };

  if (state === 'ok') return <>{children}</>;
  if (state === 'checking') return <div role="status" aria-busy="true" className="consent-wait">Checking your privacy choice…</div>;
  if (state === 'failed') {
    return (
      <div className="consent" data-lg="plate" role="alert">
        <h3>We could not check your privacy choice</h3>
        <p>Check your connection and try again.</p>
        <button type="button" className="lp-btn lp-btn-primary" onClick={() => void check()}>Try again</button>
      </div>
    );
  }

  return (
    <section className="consent" data-lg="plate" aria-labelledby={`${box}-title`} data-consent>
      <h3 id={`${box}-title`}>Before your first analysis</h3>
      <p>
        To produce a result, what you submit is sent to a third-party AI service provider and may be processed outside your country.
        That includes symptoms, scans, documents, report text and any saved wearable readings.
      </p>
      <details className="consent-more">
        <summary>Read the full privacy notice</summary>
        <PrivacyNotice />
      </details>
      <label className="consent-agree" htmlFor={box}>
        <input id={box} type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>I understand and agree to my health information being processed this way.</span>
      </label>
      {error && <p role="alert" className="consent-error">{error}</p>}
      <button type="button" className="lp-btn lp-btn-primary" disabled={!agreed || saving} onClick={() => void accept()}>
        {saving ? 'Saving…' : 'Agree and continue'}
      </button>
    </section>
  );
}
