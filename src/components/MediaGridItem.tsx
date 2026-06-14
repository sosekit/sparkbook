import * as MediaLibrary from 'expo-media-library';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { SelectionCheckmark } from './SelectionCheckmark';

export function MediaGridItem({ asset, selected, onPress, size }: { asset: MediaLibrary.Asset; selected?: boolean; onPress: () => void; size: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, { width: size, height: size }, selected ? styles.selected : null, pressed ? styles.pressed : null]}
    >
      <Image source={{ uri: asset.uri }} style={styles.image} resizeMode="cover" />
      <View style={styles.indicator}>
        <SelectionCheckmark selected={selected} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.neutral,
    borderWidth: 1,
    borderColor: colors.dividerMuted
  },
  selected: {
    borderWidth: 3,
    borderColor: colors.main
  },
  pressed: {
    opacity: 0.78
  },
  image: {
    width: '100%',
    height: '100%'
  },
  indicator: {
    position: 'absolute',
    top: 7,
    right: 7
  }
});
