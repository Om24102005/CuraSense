import { ComingSoon } from '../../src/ui/ComingSoon';
import { Screen } from '../../src/ui/Screen';

export default function Book() {
  return (
    <Screen edges={[]}>
      <ComingSoon icon="calendar-outline" title="Book a consultation" body="Pick a doctor, a mode and a time slot in a few steps. Coming in a later stage." />
    </Screen>
  );
}
