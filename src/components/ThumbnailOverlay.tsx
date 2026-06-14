import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export function ThumbnailOverlay() {
  return <View pointerEvents="none" style={styles.overlay} />;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.text,
    opacity: 0.14
  }
});
