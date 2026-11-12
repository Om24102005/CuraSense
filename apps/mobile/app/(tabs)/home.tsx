import { View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { AppText } from '../../src/ui/AppText';
import { ComingSoon } from '../../src/ui/ComingSoon';
import { Screen } from '../../src/ui/Screen';

export default function Home() {
  const { user } = useAuth();
  const first = user?.name?.split(' ')[0];
  return (
    <Screen edges={[]}>
      <View style={{ gap: 4 }}>
        <AppText variant="title" testID="greeting">{first ? `Welcome back, ${first}` : 'Welcome back'}</AppText>
        <AppText variant="callout" tone="secondary">Here is your health analysis overview.</AppText>
      </View>
      <ComingSoon icon="analytics-outline" title="Your overview is on its way" body="Totals, confidence and response times appear here once Analyze and History are connected in the next stages." />
    </Screen>
  );
}
