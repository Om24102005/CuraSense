import { ComingSoon } from '../../src/ui/ComingSoon';
import { Screen } from '../../src/ui/Screen';

export default function Analyze() {
  return (
    <Screen edges={[]}>
      <ComingSoon icon="pulse-outline" title="Symptoms, scans and lab reports" body="The three analysis tools arrive in the next stage." />
    </Screen>
  );
}
