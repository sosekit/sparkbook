import * as MediaLibrary from 'expo-media-library';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { SelectionCheckmark } from './SelectionCheckmark';

export function MediaGridItem({ asset, selected, onPress }: { asset: MediaLibrary.Asset; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.tile}>
      <Image source={{ uri: asset.uri }} style={styles.image} resizeMode="cover" />
      <View style={styles.indicator}>
        <SelectionCheckmark selected={selected} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '32.6%',
    aspectRatio: 1,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.neutral
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
