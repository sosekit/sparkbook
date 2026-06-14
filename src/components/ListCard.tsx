import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { SparkList } from '../types/list';
import { Spark } from '../types/spark';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { cardStyles } from './Card';
import { CategoryIcon } from './CategoryIcon';

type ListCardProps = {
  list: SparkList;
  sparks?: Spark[];
  onPress: () => void;
};

export function ListCard({ list, sparks = [], onPress }: ListCardProps) {
  const thumbnail = list.thumbnailUri || sparks.flatMap((spark) => spark.media || []).find((media) => media.mediaType === 'photo')?.url;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
      <View style={styles.preview}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <>
            {sparks.slice(0, 3).map((spark, index) => (
              <View key={spark.id} style={[styles.previewIcon, { left: 10 + index * 22 }]}>
                <CategoryIcon categoryId={spark.categoryId} size={30} selected={index === 0} />
              </View>
            ))}
            {!sparks.length ? <View style={styles.emptyPreview}><CategoryIcon categoryId={list.thumbnailIconKey || 'custom'} size={34} selected /></View> : null}
          </>
        )}
        <View style={styles.locationPill}>
          <SparkbookIcon name="location" color={colors.white} size={14} />
          <Text style={styles.locationText}>Toronto, CA</Text>
        </View>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={1}>{list.title}</Text>
        <Text style={styles.body} numberOfLines={2}>{list.description || 'A collected Sparkbook list.'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 190,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 0,
    borderWidth: 1,
    borderColor: cardStyles.borderColor
  },
  pressed: { opacity: 0.78 },
  preview: {
    height: 116,
    backgroundColor: cardStyles.previewBackground,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: cardStyles.dividerColor
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  emptyPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewIcon: {
    position: 'absolute',
    top: 8
  },
  locationPill: {
    position: 'absolute',
    left: 8,
    bottom: 7,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.main,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7
  },
  locationText: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 11
  },
  copy: {
    gap: 2,
    padding: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.neutral,
    minHeight: 72
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 15,
    lineHeight: 19
  },
  body: {
    color: colors.text,
    fontFamily: fontFamilies.secondary,
    fontSize: 11,
    lineHeight: 15,
    paddingBottom: 0
  },
});
