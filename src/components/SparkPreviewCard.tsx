import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getDemoMediaAsset, isDemoMediaUri } from '../data/demoMediaLibrary';
import { Spark } from '../types/spark';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { CategoryIcon } from './CategoryIcon';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { cardStyles } from './Card';
import { Avatar } from './Avatar';
import { DemoMediaArtwork } from './DemoMediaArtwork';
import { ThumbnailOverlay } from './ThumbnailOverlay';

type SparkPreviewCardProps = {
  spark?: Spark | null;
  onPress?: () => void;
  selected?: boolean;
  variant?: 'spark-card' | 'media';
  wide?: boolean;
};

export function SparkPreviewCard({ spark, onPress, selected = false, variant = 'spark-card', wide = true }: SparkPreviewCardProps) {
  if (!spark?.id) return null;
  const thumbnail = (spark.media || []).find((media) => media.mediaType === 'photo')?.url;
  const demoThumbnail = getDemoMediaAsset(thumbnail);
  const cardStyle = variant === 'media' ? styles.mediaCard : wide ? styles.wideCard : styles.card;

  const content = variant === 'media' ? (
    <View style={styles.mediaOnly}>
      {thumbnail ? (
        demoThumbnail?.source ? (
          <Image source={demoThumbnail.source} style={styles.coverImage} resizeMode="cover" />
        ) : isDemoMediaUri(thumbnail) ? (
          <DemoMediaArtwork categoryId={demoThumbnail?.categoryId || spark.categoryId} label={demoThumbnail?.title} style={styles.coverImage} />
        ) : (
          <Image source={{ uri: thumbnail }} style={styles.coverImage} resizeMode="cover" />
        )
      ) : <CategoryIcon categoryId={spark.categoryId} selected size={48} />}
      {thumbnail ? <ThumbnailOverlay /> : null}
    </View>
  ) : (
    <>
      <View style={styles.sparkImage}>
        {thumbnail ? (
          demoThumbnail?.source ? (
            <Image source={demoThumbnail.source} style={styles.coverImage} resizeMode="cover" />
          ) : isDemoMediaUri(thumbnail) ? (
            <DemoMediaArtwork categoryId={demoThumbnail?.categoryId || spark.categoryId} label={demoThumbnail?.title} style={styles.coverImage} />
          ) : (
            <Image source={{ uri: thumbnail }} style={styles.coverImage} resizeMode="cover" />
          )
        ) : null}
        {thumbnail ? <ThumbnailOverlay /> : null}
        {!thumbnail ? <View style={styles.emptyMedia}><CategoryIcon categoryId={spark.categoryId} selected size={30} /></View> : null}
        <View style={styles.topRow}>
          <View style={styles.avatarWrap}>
            <Avatar name={spark.createdBy === 'profile-ray' ? 'Raymond Zhang' : spark.createdBy} size={24} />
          </View>
          <View style={styles.typeTag}>
            <SparkbookIcon name="spark" color={colors.white} size={16} />
          </View>
        </View>
        <View style={styles.locationPill}>
          <SparkbookIcon name="location" color={colors.white} size={16} />
          <Text style={styles.locationPillText} numberOfLines={1}>{cityLabel(spark.addressLabel || spark.location)}</Text>
        </View>
      </View>
      <View style={styles.copy}>
        <Text style={styles.caption} numberOfLines={2}>{spark.description || spark.caption || 'Saved as a Sparkbook location.'}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        style={({ pressed }) => [cardStyle, selected ? styles.selected : null, pressed ? styles.pressed : null]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[cardStyle, selected ? styles.selected : null]}>
      {content}
    </View>
  );
}

function cityLabel(label?: string) {
  if (!label) return 'Toronto, CA';
  if (/toronto/i.test(label)) return 'Toronto, CA';
  const parts = label.split(',').map((part) => part.trim()).filter(Boolean);
  return parts[0] ? `${parts[0]}, CA` : label;
}

const styles = StyleSheet.create({
  card: {
    width: 124,
    height: 200,
    borderRadius: cardStyles.radius,
    overflow: 'hidden',
    backgroundColor: colors.neutral,
    borderWidth: 1,
    borderColor: cardStyles.borderColor
  },
  wideCard: {
    width: 156,
    height: 200,
    borderRadius: cardStyles.radius,
    overflow: 'hidden',
    backgroundColor: colors.neutral,
    borderWidth: 1,
    borderColor: cardStyles.borderColor
  },
  mediaCard: {
    width: 149,
    height: 261,
    borderRadius: cardStyles.radius,
    overflow: 'hidden',
    backgroundColor: cardStyles.previewBackground,
    borderWidth: 1,
    borderColor: colors.borderMuted
  },
  selected: {
    borderColor: colors.main,
    borderWidth: 2
  },
  pressed: { opacity: 0.78 },
  mediaOnly: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cardStyles.previewBackground
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%'
  },
  sparkImage: {
    height: 152,
    padding: 8,
    justifyContent: 'space-between',
    backgroundColor: cardStyles.previewBackground,
    borderBottomWidth: 1,
    borderBottomColor: cardStyles.dividerColor
  },
  emptyMedia: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatarWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  typeTag: {
    minWidth: 28,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6
  },
  locationPill: {
    alignSelf: 'flex-start',
    minHeight: 24,
    maxWidth: '92%',
    borderRadius: 8,
    backgroundColor: colors.main,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4
  },
  locationPillText: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16
  },
  copy: {
    height: 48,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: colors.neutral
  },
  caption: {
    color: colors.text,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16
  }
});
