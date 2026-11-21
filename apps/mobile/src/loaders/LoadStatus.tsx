import { View } from 'react-native';
import { AppText } from '../ui/AppText';
import { IndeterminateBar } from './bars';
import { BouncingBall, ChasingSquares } from './dots';
import { Skeleton, SkeletonGroup } from './shimmer';

/** The strip at the top of a list screen: chasing squares while it is pulled to refresh, a sliding bar while it first loads. */
export function LoadStatus({ loading, pulling }: { loading: boolean; pulling: boolean }) {
  if (pulling) {
    return (
      <View testID="refreshing" accessible accessibilityLabel="Refreshing" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <ChasingSquares size={20} label={null} />
        <AppText variant="caption" tone="muted" accessibilityElementsHidden importantForAccessibility="no">Refreshing…</AppText>
      </View>
    );
  }
  return loading ? <IndeterminateBar label="Loading your analyses" /> : null;
}

/** Stand-ins for list rows that have not arrived, with a bouncing ball and the words (which tests and screen readers read). */
export function RowsLoading({ rows = 3, testID, text = 'Loading your analyses…' }: { rows?: number; testID: string; text?: string }) {
  return (
    <View style={{ alignSelf: 'stretch', gap: 12 }}>
      <SkeletonGroup>
        {Array.from({ length: rows }, (_, i) => <Skeleton key={i} height={78} radius={16} />)}
      </SkeletonGroup>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <BouncingBall size={28} label={null} />
        <AppText tone="muted" testID={testID}>{text}</AppText>
      </View>
    </View>
  );
}
