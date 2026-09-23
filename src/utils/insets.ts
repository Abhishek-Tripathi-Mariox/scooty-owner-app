import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Real device insets for screens that draw their own headers/footers.
// - headerTop: replaces the old hardcoded `paddingTop: 40` header hack.
//   Never smaller than the designed 40dp, grows to clear the status bar /
//   camera cutout on edge-to-edge (Android 15+) devices.
//   On iOS the root SafeAreaView already insets the top, so keep 40.
// - bottom: gesture-nav / home-indicator inset (0 on devices without one).
export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  return {
    headerTop:
      Platform.OS === 'android' ? Math.max(insets.top + 12, 40) : 40,
    bottom: insets.bottom,
  };
}
