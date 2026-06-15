import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { getDemoMediaAsset, isDemoMediaUri } from '../data/demoMediaLibrary';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { Spark } from '../types/spark';
import { getCategoryForSpark } from '../utils/category';
import { cardStyles } from './Card';
import { CategoryIcon } from './CategoryIcon';
import { DemoMediaArtwork } from './DemoMediaArtwork';
import { ThumbnailOverlay } from './ThumbnailOverlay';

type SparkListItemCardProps = {
  spark?: Spark | null;
  order: number;
  dragging?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
};

export function SparkListItemCard({ spark, order, dragging = false, onPress, onLongPress }: SparkListItemCardProps) {
  if (!spark?.id) return null;
  const category = getCategoryForSpark(spark);
  const thumbnail = (spark.media || []).find((media) => media.mediaType === 'photo')?.url;
  const demoThumbnail = getDemoMediaAsset(thumbnail);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={260}
      style={({ pressed }) => [styles.card, dragging ? styles.dragging : null, pressed ? styles.pressed : null]}
    >
      <View style={styles.preview}>
        {thumbnail ? (
          demoThumbnail?.source ? (
            <Image source={demoThumbnail.source} style={styles.image} resizeMode="cover" />
          ) : isDemoMediaUri(thumbnail) ? (
            <DemoMediaArtwork categoryId={demoThumbnail?.categoryId || category.id} label={demoThumbnail?.title} style={styles.image} />
          ) : (
            <Image source={{ uri: thumbnail }} style={styles.image} resizeMode="cover" />
          )
        ) : <CategoryIcon categoryId={category.id} selected size={38} />}
        {thumbnail ? <ThumbnailOverlay /> : null}
        <View style={styles.order}>
          <Text style={styles.orderText}>{order}</Text>
        </View>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={1}>{spark.title}</Text>
        <Text style={styles.meta} numberOfLines={1}>{category.name} · {spark.addressLabel}</Text>
      </View>
      <View style={styles.grip}>
        <SparkbookIcon name="listInactive" color={colors.altText} size={16} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.neutral,
    borderRadius: cardStyles.radius,
    borderWidth: 1,
    borderColor: cardStyles.borderColor,
    overflow: 'hidden'
  },
  dragging: {
    opacity: 0.92,
    transform: [{ scale: 1.015 }]
  },
  pressed: {
    opacity: 0.78
  },
  preview: {
    width: 88,
    backgroundColor: cardStyles.previewBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: cardStyles.dividerColor,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  order: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderText: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 11
  },
  copy: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 4
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 16,
    lineHeight: 24
  },
  meta: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16
  },
  grip: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
