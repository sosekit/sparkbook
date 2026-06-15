import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export function ThumbnailOverlay() {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(10,20,60,0.45)']}
      locations={[0, 0.4, 1]}
      style={styles.overlay}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject
  }
});
