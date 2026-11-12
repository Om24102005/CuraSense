import { useRef, useState } from 'react';
import { Image, Linking, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { register, totpSetup, totpVerify } from '@curasense/shared/api/auth';
import { useAuth } from '../../src/auth/AuthContext';
import { AppText } from '../../src/ui/AppText';
import { AuthHeader } from '../../src/ui/AuthHeader';
import { Banner } from '../../src/ui/Banner';
import { Button } from '../../src/ui/Button';
import { CodeInput } from '../../src/ui/CodeInput';
import { Screen } from '../../src/ui/Screen';
import { TextField, type TextInputRef } from '../../src/ui/TextField';
import { useTheme } from '../../src/theme';
import { radius } from '../../src/ui/tokens';

interface Setup { otpauthUrl: string; manualSecret: string; qrDataUrl: string }

export default function SignUp() {
  const router = useRouter();
  const t = useTheme();
  const { signIn } = useAuth();
  const emailRef = useRef<TextInputRef>(null);
  const passwordRef = useRef<TextInputRef>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupToken, setSetupToken] = useState('');   // kept so a failed authenticator step can be retried without registering twice
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState('');
  const [codeBad, setCodeBad] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submitDetails = async () => {
    if (busy) return;
    if (!setupToken) {
      if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Enter your name and a valid email.');
      if (password.length < 8) return setError('Password must be at least 8 characters.');
    }
    setBusy(true);
    setError('');
    let token = setupToken;
    if (!token) {
      const r = await register({ name: name.trim(), email: email.trim(), password });
      if (r.error || !r.data?.setupToken) { setBusy(false); return setError(r.error || 'Registration failed.'); }
      token = r.data.setupToken;
      setSetupToken(token);
    }
    const s = await totpSetup(token);
    setBusy(false);
    if (s.error || !s.data) return setError(s.error || 'Could not set up the authenticator. Try again.');
    setSetup({ otpauthUrl: s.data.otpauthUrl, manualSecret: s.data.manualSecret, qrDataUrl: s.data.qrDataUrl });
  };

  const submitCode = async (digits: string) => {
    if (busy) return;
    setBusy(true);
    setError('');
    setCodeBad(false);
    const r = await totpVerify(setupToken, digits);
    if (r.error || !r.data?.token) { setBusy(false); setCodeBad(true); setCode(''); return setError(r.error || 'Verification failed.'); }
    await signIn(r.data.token, r.data.user ?? {});
  };

  // The QR code only helps when scanning from another device; on this phone the otpauth link opens the authenticator app directly.
  const openAuthenticator = () => {
    if (setup) Linking.openURL(setup.otpauthUrl).catch(() => setError('No authenticator app found. Copy the key below into one instead.'));
  };
  const copyKey = async () => {
    if (!setup) return;
    await Clipboard.setStringAsync(setup.manualSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (setup) {
    return (
      <Screen>
        <AuthHeader title="Link your authenticator" subtitle="Two-step sign-in keeps your health data private." />
        <Button title="Open authenticator app" variant="secondary" testID="open-authenticator" onPress={openAuthenticator} />
        <View style={{ alignSelf: 'center', padding: 12, borderRadius: radius.md, backgroundColor: '#ffffff' }}>
          <Image source={{ uri: setup.qrDataUrl }} style={{ width: 160, height: 160 }} accessibilityLabel="QR code for your authenticator app" />
        </View>
        <View style={{ gap: 6 }}>
          <AppText variant="callout" tone="secondary">Or type this key into your authenticator app</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: t.border, backgroundColor: t.card }}>
            {/* groups of four, so the long key wraps inside the box instead of running off it */}
            <AppText selectable testID="manual-secret" style={{ flex: 1, fontVariant: ['tabular-nums'], letterSpacing: 1 }}>{setup.manualSecret.match(/.{1,4}/g)?.join(' ')}</AppText>
            <Button title={copied ? 'Copied' : 'Copy'} variant="link" onPress={copyKey} />
          </View>
        </View>
        <AppText variant="headline">Then enter the 6-digit code</AppText>
        <CodeInput testID="code-input" value={code} onChange={(d) => { setCode(d); setCodeBad(false); }} onComplete={submitCode} error={codeBad} disabled={busy} />
        {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
        <Button title="Verify and finish" testID="verify-button" loading={busy} disabled={code.length !== 6} onPress={() => submitCode(code)} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AuthHeader title="Create your account" subtitle="AI-assisted health analysis, protected by two-step sign-in." />
      <TextField
        label="Full name" testID="name-input" value={name} onChangeText={setName}
        autoCapitalize="words" textContentType="name" autoComplete="name" returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()}
      />
      <TextField
        ref={emailRef} label="Email" testID="email-input" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" autoComplete="email"
        returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        ref={passwordRef} label="Password (at least 8 characters)" secure testID="password-input" value={password} onChangeText={setPassword}
        autoCapitalize="none" autoCorrect={false} textContentType="newPassword" autoComplete="new-password"
        returnKeyType="go" onSubmitEditing={submitDetails}
      />
      {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
      <Button title={setupToken ? 'Try again' : 'Continue'} testID="continue-button" loading={busy} onPress={submitDetails} />
      <Button title="I already have an account" variant="link" onPress={() => router.replace('/sign-in')} />
    </Screen>
  );
}
