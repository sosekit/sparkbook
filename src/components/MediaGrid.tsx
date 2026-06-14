import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { DemoMediaAsset } from '../data/demoMediaLibrary';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { InlineError } from './InlineError';
import { MediaGridItem } from './MediaGridItem';

type MediaGridProps = {
  assets: DemoMediaAsset[];
  selectedIds: string[];
  error?: string;
  onToggle: (asset: DemoMediaAsset) => void;
};

export function MediaGrid({ assets, selectedIds, error, onToggle }: MediaGridProps) {
  const { width } = useWindowDimensions();
  const tileSize = Math.floor((width - 48) / 3);

  return (
    <ScrollView contentContainerStyle={styles.grid}>
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
          <Text style={styles.stateText}>Add demo-library files or use the Sparkbook fallback tiles.</Text>
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
