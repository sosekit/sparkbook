import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getDemoMediaAsset, isDemoMediaUri } from '../data/demoMediaLibrary';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { Spark } from '../types/spark';
import { getCategoryForSpark } from '../utils/category';
import { BookmarkToggle } from './BookmarkToggle';
import { cardStyles } from './Card';
import { CategoryIcon } from './CategoryIcon';
import { DemoMediaArtwork } from './DemoMediaArtwork';
import { ThumbnailOverlay } from './ThumbnailOverlay';

type SparkCardProps = {
  spark?: Spark | null;
  onPress: () => void;
  bookmarked?: boolean;
  onBookmark?: () => void;
  onCategoryPress?: () => void;
};

export function SparkCard({ spark, onPress, bookmarked, onBookmark, onCategoryPress }: SparkCardProps) {
  if (!spark?.id) return null;
  const category = getCategoryForSpark(spark);
  const showBookmark = typeof bookmarked === 'boolean' && onBookmark;
  const thumbnail = (spark.media || []).find((media) => media.mediaType === 'photo')?.url;
  const demoThumbnail = getDemoMediaAsset(thumbnail);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
      <View style={styles.preview}>
        {thumbnail ? (
          demoThumbnail?.source ? (
            <Image source={demoThumbnail.source} style={styles.thumbnail} resizeMode="cover" />
          ) : isDemoMediaUri(thumbnail) ? (
            <DemoMediaArtwork categoryId={demoThumbnail?.categoryId || category.id} label={demoThumbnail?.title} style={styles.thumbnail} />
          ) : (
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} resizeMode="cover" />
          )
        ) : (
          <CategoryIcon categoryId={category.id} size={28} />
        )}
        {thumbnail ? <ThumbnailOverlay /> : null}
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={1}>{spark.title}</Text>
        <Text style={styles.meta} numberOfLines={1}>{formatCardLocation(spark.addressLabel)}</Text>
        <View style={styles.bottomRow}>
          {onCategoryPress ? (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation?.();
                onCategoryPress();
              }}
              style={({ pressed }) => [styles.tag, pressed ? styles.tagPressed : null]}
            >
              <Text style={styles.tagText} numberOfLines={1}>{category.name}</Text>
            </Pressable>
          ) : (
            <View style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>{category.name}</Text>
            </View>
          )}
          {showBookmark ? <BookmarkToggle saved={bookmarked} onPress={onBookmark} size={36} variant="circle" /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.neutral,
    borderWidth: 1,
    borderColor: cardStyles.borderColor,
    borderRadius: cardStyles.radius,
    minHeight: 72,
    alignItems: 'stretch',
    overflow: 'hidden'
  },
  pressed: { opacity: 0.78 },
  preview: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cardStyles.previewBackground,
    borderRightWidth: 1,
    borderRightColor: cardStyles.dividerColor
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%'
  },
  copy: { flex: 1, gap: 4, justifyContent: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  title: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 15, lineHeight: 20 },
  meta: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 16 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 },
  tag: {
    alignSelf: 'flex-start',
    minHeight: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 7,
    justifyContent: 'center',
    backgroundColor: colors.surface
  },
  tagPressed: { backgroundColor: colors.neutral },
  tagText: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 11, lineHeight: 14 }
});

function formatCardLocation(address: string) {
  if (address.toLowerCase().includes('toronto')) return 'Toronto, CA';
  const city = address.split(',').map((part) => part.trim()).find((part) => part.length > 1) || 'Toronto';
  return `${city}, CA`;
}
