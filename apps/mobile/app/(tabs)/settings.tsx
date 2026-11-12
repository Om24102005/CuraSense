import { useAuth } from '../../src/auth/AuthContext';
import { AppText } from '../../src/ui/AppText';
import { Button } from '../../src/ui/Button';
import { Card } from '../../src/ui/Card';
import { Screen } from '../../src/ui/Screen';

export default function Settings() {
  const { user, signOut } = useAuth();
  return (
    <Screen edges={[]}>
      <Card>
        <AppText variant="callout" tone="secondary">Account</AppText>
        <AppText variant="headline" testID="account-name">{user?.name ?? 'Signed in'}</AppText>
        <AppText tone="secondary" testID="account-email">{user?.email ?? ''}</AppText>
      </Card>
      <Card>
        <AppText variant="callout" tone="secondary">Appearance</AppText>
        <AppText>Follows your phone's light or dark setting.</AppText>
      </Card>
      <Button title="Sign out" variant="danger" testID="sign-out-button" onPress={signOut} />
    </Screen>
  );
}
