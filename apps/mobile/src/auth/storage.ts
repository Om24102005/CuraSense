import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// The token lives in the Keychain (iPhone) or the Keystore (Android). The browser build used for testing has no secure store, so it uses localStorage.
const web = Platform.OS === 'web';

export const storage = {
  get: (key: string): Promise<string | null> => (web ? Promise.resolve(localStorage.getItem(key)) : SecureStore.getItemAsync(key)),
  set: (key: string, value: string): Promise<void> => (web ? Promise.resolve(localStorage.setItem(key, value)) : SecureStore.setItemAsync(key, value)),
  remove: (key: string): Promise<void> => (web ? Promise.resolve(localStorage.removeItem(key)) : SecureStore.deleteItemAsync(key)),
};
