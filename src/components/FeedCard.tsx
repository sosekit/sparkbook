import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getDemoMediaAsset, isDemoMediaUri } from '../data/demoMediaLibrary';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { Spark } from '../types/spark';
import { getCategoryForSpark } from '../utils/category';
import { Avatar } from './Avatar';
import { BookmarkToggle } from './BookmarkToggle';
import { cardStyles } from './Card';
import { CategoryIcon } from './CategoryIcon';
import { DemoMediaArtwork } from './DemoMediaArtwork';

type FeedCardProps = {
  spark?: Spark | null;
  bookmarked?: boolean;
  onPress: () => void;
  onBookmark: () => void;
  onCreatorPress?: () => void;
  onCategoryPress?: () => void;
};

export function FeedCard({ spark, bookmarked, onPress, onBookmark, onCreatorPress, onCategoryPress }: FeedCardProps) {
  if (!spark?.id) return null;
  const category = getCategoryForSpark(spark);
  const thumbnail = (spark.media || []).find((media) => media.mediaType === 'photo')?.url;
  const demoThumbnail = getDemoMediaAsset(thumbnail);
  const isOwnSpark = spark.createdBy === 'profile-ray';
  const creatorName = getCreatorName(spark.createdBy, spark.recommendedBy);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
      <View style={styles.image}>
        {thumbnail ? (
          isDemoMediaUri(thumbnail) ? <DemoMediaArtwork categoryId={demoThumbnail?.categoryId || category.id} label={demoThumbnail?.title} style={styles.thumbnail} /> : <Image source={{ uri: thumbnail }} style={styles.thumbnail} resizeMode="cover" />
        ) : null}
        {!thumbnail ? <CategoryIcon categoryId={category.id} selected size={30} /> : null}
        <View style={styles.bookmarkOverlay}>
          <BookmarkToggle saved={bookmarked} onPress={onBookmark} size={36} variant="circle" />
        </View>
      </View>
      {!isOwnSpark ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${creatorName}'s profile`}
          onPress={(event) => {
            event.stopPropagation?.();
            onCreatorPress?.();
          }}
          style={styles.creator}
        >
          <Avatar name={creatorName} size={24} />
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={2}>{spark.title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 124,
    height: 200,
    borderRadius: 4,
    backgroundColor: colors.neutral,
    overflow: 'hidden',
    marginRight: 0
  },
  pressed: { opacity: 0.78 },
  image: {
    height: 152,
    backgroundColor: cardStyles.previewBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden'
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject
  },
  copy: {
    height: 48,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: cardStyles.contentBackground,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 13,
    lineHeight: 16
  },
  creator: {
    position: 'absolute',
    left: 4,
    top: 4,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bookmarkOverlay: {
    position: 'absolute',
    right: 8,
    top: 8
  }
});

function getCreatorName(createdBy: string, recommendedBy?: string) {
  if (recommendedBy) return recommendedBy;
  const names: Record<string, string> = {
    'profile-natalie': 'Natalie R.',
    'profile-maya': 'Maya C.',
    'profile-evan': 'Evan L.'
  };
  return names[createdBy] || 'Sparkbook user';
}
