import { DimensionValue, Pressable, StyleSheet, Text, View } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

export function MapClusterMarker({ count, left, top, onPress }: { count: number; left: DimensionValue; top: DimensionValue; onPress: () => void }) {
  const size = Math.min(64, 34 + count * 7);
  return (
    <Pressable onPress={onPress} style={[styles.cluster, { left, top, width: size, height: size, borderRadius: size / 2 }]}>
      <View style={styles.content}>
        <SparkbookIcon name="spark" color={colors.white} size={Math.max(10, size * 0.28)} />
        <Text style={styles.text}>{count}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cluster: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.main,
    borderWidth: 2,
    borderColor: colors.white
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: colors.white,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '900'
  }
});
