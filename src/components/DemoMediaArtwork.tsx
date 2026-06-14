import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { CategoryIcon } from './CategoryIcon';

type DemoMediaArtworkProps = {
  categoryId: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function DemoMediaArtwork({ categoryId, label, style }: DemoMediaArtworkProps) {
  return (
    <View style={[styles.artwork, style]}>
      <View style={styles.sky}>
        <View style={styles.sun} />
        <View style={styles.cloud} />
      </View>
      <View style={styles.ground}>
        <View style={styles.iconPlate}>
          <CategoryIcon categoryId={categoryId} selected size={36} />
        </View>
        {label ? <Text style={styles.label} numberOfLines={1}>{label}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  artwork: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.neutral
  },
  sky: {
    flex: 1,
    backgroundColor: colors.mapWater,
    padding: 14
  },
  sun: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.highlight,
    opacity: 0.8
  },
  cloud: {
    width: '64%',
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.surface,
    opacity: 0.72,
    marginTop: 18,
    alignSelf: 'flex-end'
  },
  ground: {
    minHeight: '42%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.mapLand,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingHorizontal: 12
  },
  iconPlate: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  label: {
    maxWidth: '100%',
    color: colors.altText,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center'
  }
});
