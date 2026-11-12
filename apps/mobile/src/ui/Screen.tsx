import type { ReactElement, ReactNode } from 'react';
import { ScrollView, View, type RefreshControlProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

interface Props {
  children: ReactNode;
  /** Which screen edges to keep clear of the notch and the home indicator. Tab screens pass [] because the header and tab bar already do. */
  edges?: Edge[];
  /** Pull to refresh. */
  refreshControl?: ReactElement<RefreshControlProps>;
}

/** A scrolling page: safe areas, the keyboard pushes content up, and a tap outside a field does not swallow the button tap. */
export function Screen({ children, edges = ['top', 'bottom'], refreshControl }: Props) {
  const t = useTheme();
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        refreshControl={refreshControl}
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
      >
        <View style={{ width: '100%', maxWidth: 480, alignSelf: 'center', gap: 20 }}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
