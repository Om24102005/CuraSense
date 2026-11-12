import { ComingSoon } from '../../src/ui/ComingSoon';
import { Screen } from '../../src/ui/Screen';

export default function History() {
  return (
    <Screen edges={[]}>
      <ComingSoon icon="time-outline" title="Your saved analyses" body="Every analysis you run will be listed here." />
    </Screen>
  );
}
