import * as Haptics from 'expo-haptics';

// A few small taps with a meaning: a tick when a choice changes, a pattern for success, for a warning and for a failure.
// iOS follows the person's System Haptics setting, and the web build does nothing.
const fire = (f: () => Promise<void>) => { f().catch(() => {}); };
export const tick = () => fire(() => Haptics.selectionAsync());
export const success = () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const warning = () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
export const failure = () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
