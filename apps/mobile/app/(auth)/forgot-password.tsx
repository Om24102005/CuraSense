import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { forgotPassword, resetPassword, verifyResetCode } from '@curasense/shared/api/password';
import { AuthHeader } from '../../src/ui/AuthHeader';
import { Banner } from '../../src/ui/Banner';
import { Button } from '../../src/ui/Button';
import { CodeInput } from '../../src/ui/CodeInput';
import { Screen } from '../../src/ui/Screen';
import { TextField, type TextInputRef } from '../../src/ui/TextField';

type Step = 'email' | 'code' | 'password';

export default function ForgotPassword() {
  const router = useRouter();
  const confirmRef = useRef<TextInputRef>(null);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState('');        // the address the server resolved, used for the next two calls
  const [masked, setMasked] = useState('');
  const [shownCode, setShownCode] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [codeBad, setCodeBad] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const sendCode = async () => {
    if (busy) return;
    if (!email.trim()) return setError('Enter your email.');
    setBusy(true);
    setError('');
    const r = await forgotPassword(email.trim());
    setBusy(false);
    if (r.error) return setError(r.error);
    const data = (r.data ?? {}) as { email?: string; maskedEmail?: string; code?: string };
    setAccount(String(data.email || email.trim()));
    setMasked(String(data.maskedEmail || ''));
    setShownCode(typeof data.code === 'string' ? data.code : null);   // the server shows the code until email delivery is set up
    setStep('code');
  };

  const checkCode = async (digits: string) => {
    if (busy) return;
    setBusy(true);
    setError('');
    setCodeBad(false);
    const r = await verifyResetCode(account, digits);
    setBusy(false);
    if (r.error) { setCodeBad(true); setCode(''); return setError(r.error); }
    setStep('password');
  };

  const saveNewPassword = async () => {
    if (busy) return;
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    setError('');
    const r = await resetPassword(account, code, password);
    setBusy(false);
    if (r.error) return setError(r.error);
    router.replace({ pathname: '/sign-in', params: { notice: 'Password updated. Sign in with your new password.' } });
  };

  const back = () => router.replace('/sign-in');

  if (step === 'code') {
    return (
      <Screen>
        <AuthHeader title="Check your code" subtitle={masked ? `Enter the 6-digit code for ${masked}.` : 'Enter the 6-digit code.'} />
        {shownCode ? <Banner tone="info" testID="shown-code">{`Your code: ${shownCode} (shown here because email delivery is not set up yet)`}</Banner> : null}
        <CodeInput testID="code-input" value={code} onChange={(d) => { setCode(d); setCodeBad(false); }} onComplete={checkCode} error={codeBad} disabled={busy} />
        {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
        <Button title="Continue" testID="continue-button" loading={busy} disabled={code.length !== 6} onPress={() => checkCode(code)} />
        <Button title="Back to sign in" variant="link" onPress={back} />
      </Screen>
    );
  }

  if (step === 'password') {
    return (
      <Screen>
        <AuthHeader title="Choose a new password" subtitle="At least 6 characters." />
        <TextField
          label="New password" secure testID="new-password-input" value={password} onChangeText={setPassword}
          autoCapitalize="none" autoCorrect={false} textContentType="newPassword" autoComplete="new-password"
          returnKeyType="next" onSubmitEditing={() => confirmRef.current?.focus()}
        />
        <TextField
          ref={confirmRef} label="Confirm new password" secure testID="confirm-password-input" value={confirm} onChangeText={setConfirm}
          autoCapitalize="none" autoCorrect={false} textContentType="newPassword" autoComplete="new-password"
          returnKeyType="go" onSubmitEditing={saveNewPassword}
        />
        {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
        <Button title="Update password" testID="update-button" loading={busy} onPress={saveNewPassword} />
        <Button title="Back to sign in" variant="link" onPress={back} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AuthHeader title="Reset your password" subtitle="Enter your account email and we will give you a code." />
      <TextField
        label="Email" testID="email-input" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" autoComplete="email"
        returnKeyType="go" onSubmitEditing={sendCode}
      />
      {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
      <Button title="Send code" testID="send-code-button" loading={busy} onPress={sendCode} />
      <Button title="Back to sign in" variant="link" onPress={back} />
    </Screen>
  );
}
