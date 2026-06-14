import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export function LiveLocationMarker({ size = 28 }: { size?: number }) {
  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.inner, { width: size * 0.46, height: size * 0.46, borderRadius: size * 0.23 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(123, 163, 224, 0.28)',
    borderWidth: 1,
    borderColor: colors.highlight
  },
  inner: {
    backgroundColor: colors.main,
    borderWidth: 3,
    borderColor: colors.white
  }
});
