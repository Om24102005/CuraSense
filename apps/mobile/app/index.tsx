import { Redirect } from 'expo-router';
import { useAuth } from '../src/auth/AuthContext';

// The address "/" has no screen of its own: it sends a signed-in user home and everyone else to sign in.
// It is also where the router falls back to when the sign-in state changes under the current screen.
export default function Index() {
  const { status } = useAuth();
  if (status === 'loading') return null;
  return <Redirect href={status === 'signedIn' ? '/home' : '/sign-in'} />;
}
