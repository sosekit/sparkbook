import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { DemoMediaAsset } from '../data/demoMediaLibrary';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { InlineError } from './InlineError';
import { MediaGridItem } from './MediaGridItem';
import { SparksIcon } from '../assets/icons/SparksIcon';

type MediaGridProps = {
  assets: DemoMediaAsset[];
  selectedIds: string[];
  error?: string;
  onToggle: (asset: DemoMediaAsset) => void;
  onPickSystem?: () => void;
};

export function MediaGrid({ assets, selectedIds, error, onToggle, onPickSystem }: MediaGridProps) {
  const { width } = useWindowDimensions();
  const tileSize = Math.floor((width - 48) / 3);

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {onPickSystem ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose from photo library"
          onPress={onPickSystem}
          style={({ pressed }) => [styles.systemPicker, { width: tileSize, height: tileSize }, pressed ? styles.systemPickerPressed : null]}
        >
          <SparksIcon name="add" color={colors.main} size={24} />
          <Text style={styles.systemPickerText}>Library</Text>
        </Pressable>
      ) : null}
      {assets.map((asset) => {
        const selectedIndex = selectedIds.indexOf(asset.id);
        const selected = selectedIndex >= 0;
        return (
          <MediaGridItem key={asset.id} asset={asset} selected={selected} selectedOrder={selected ? selectedIndex + 1 : undefined} size={tileSize} onPress={() => onToggle(asset)} />
        );
      })}
      {!assets.length ? (
        <View style={styles.state}>
          <Text style={styles.title}>No demo media found</Text>
          <Text style={styles.stateText}>Add demo-library files or use the sparks fallback tiles.</Text>
        </View>
      ) : null}
      <InlineError message={error} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 104
  },
  systemPicker: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.neutral,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  systemPickerPressed: {
    borderColor: colors.highlight,
    backgroundColor: colors.surfaceMuted
  },
  systemPickerText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center'
  },
  stateText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center'
  },
});
