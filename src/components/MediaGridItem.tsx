import { Image, Pressable, StyleSheet, View } from 'react-native';
import { DemoMediaAsset, isDemoMediaUri } from '../data/demoMediaLibrary';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { DemoMediaArtwork } from './DemoMediaArtwork';
import { SelectionCheckmark } from './SelectionCheckmark';

export function MediaGridItem({ asset, selected, selectedOrder, onPress, size }: { asset: DemoMediaAsset; selected?: boolean; selectedOrder?: number; onPress: () => void; size: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${selected ? 'Remove' : 'Select'} ${asset.title}`}
      accessibilityState={{ selected }}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, { width: size, height: size }, selected ? styles.selected : null, pressed ? styles.pressed : null]}
    >
      {asset.source ? (
        <Image source={asset.source} style={styles.image} resizeMode="cover" />
      ) : isDemoMediaUri(asset.uri) ? (
        <DemoMediaArtwork categoryId={asset.categoryId} label={asset.title} />
      ) : (
        <Image source={{ uri: asset.uri }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.indicator}>
        <SelectionCheckmark selected={selected} order={selectedOrder} />
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
