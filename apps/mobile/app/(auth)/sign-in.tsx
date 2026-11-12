import { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { login, loginTotp } from '@curasense/shared/api/auth';
import { useAuth } from '../../src/auth/AuthContext';
import { AuthHeader } from '../../src/ui/AuthHeader';
import { Banner } from '../../src/ui/Banner';
import { Button } from '../../src/ui/Button';
import { CodeInput } from '../../src/ui/CodeInput';
import { Screen } from '../../src/ui/Screen';
import { TextField, type TextInputRef } from '../../src/ui/TextField';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { notice } = useLocalSearchParams<{ notice?: string }>();
  const passwordRef = useRef<TextInputRef>(null);
  const [step, setStep] = useState<'password' | 'code'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [code, setCode] = useState('');
  const [codeBad, setCodeBad] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submitPassword = async () => {
    if (busy) return;
    if (!email.trim() || !password) return setError('Enter your email and password.');
    setBusy(true);
    setError('');
    const r = await login({ email: email.trim(), password });
    if (r.error) { setBusy(false); return setError(r.error); }
    if (r.data?.requiresTotp && r.data.totpToken) { setTotpToken(r.data.totpToken); setStep('code'); return setBusy(false); }
    if (r.data?.token) return signIn(r.data.token, r.data.user ?? {});   // an older account without 2FA gets its token straight away
    setBusy(false);
    setError('Unexpected response from the server.');
  };

  const submitCode = async (digits: string) => {
    if (busy) return;
    setBusy(true);
    setError('');
    setCodeBad(false);
    const r = await loginTotp(totpToken, digits);
    if (r.error || !r.data?.token) { setBusy(false); setCodeBad(true); setCode(''); return setError(r.error || 'Verification failed.'); }
    await signIn(r.data.token, r.data.user ?? {});
  };

  if (step === 'code') {
    return (
      <Screen>
        <AuthHeader title="Enter your code" subtitle="Open your authenticator app and type the 6-digit code for CuraSense." />
        <CodeInput testID="code-input" value={code} onChange={(d) => { setCode(d); setCodeBad(false); }} onComplete={submitCode} error={codeBad} disabled={busy} />
        {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
        <Button title="Verify" testID="verify-button" loading={busy} disabled={code.length !== 6} onPress={() => submitCode(code)} />
        <Button title="Back to sign in" variant="link" onPress={() => { setStep('password'); setCode(''); setError(''); setCodeBad(false); }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AuthHeader title="Sign in to CuraSense" subtitle="Welcome back." />
      {notice ? <Banner tone="success" testID="notice">{notice}</Banner> : null}
      <TextField
        label="Email" testID="email-input" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" autoComplete="email"
        returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        ref={passwordRef} label="Password" secure testID="password-input" value={password} onChangeText={setPassword}
        autoCapitalize="none" autoCorrect={false} textContentType="password" autoComplete="current-password"
        returnKeyType="go" onSubmitEditing={submitPassword}
      />
      {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
      <Button title="Sign in" testID="sign-in-button" loading={busy} onPress={submitPassword} />
      <Button title="Forgot password?" variant="link" onPress={() => router.push('/forgot-password')} />
      <Button title="Create an account" variant="secondary" testID="to-sign-up" onPress={() => router.push('/sign-up')} />
    </Screen>
  );
}
