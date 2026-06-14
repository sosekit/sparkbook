import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { Spark } from '../types/spark';
import { getCategoryForSpark } from '../utils/category';
import { Avatar } from './Avatar';
import { BookmarkToggle } from './BookmarkToggle';
import { cardStyles } from './Card';
import { CategoryIcon } from './CategoryIcon';

type FeedCardProps = {
  spark?: Spark | null;
  bookmarked?: boolean;
  onPress: () => void;
  onBookmark: () => void;
  onCreatorPress?: () => void;
};

export function FeedCard({ spark, bookmarked, onPress, onBookmark, onCreatorPress }: FeedCardProps) {
  if (!spark?.id) return null;
  const category = getCategoryForSpark(spark);
  const thumbnail = (spark.media || []).find((media) => media.mediaType === 'photo')?.url;
  const isOwnSpark = spark.createdBy === 'profile-ray';
  const creatorName = getCreatorName(spark.createdBy, spark.recommendedBy);
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.image}>
        {thumbnail ? <Image source={{ uri: thumbnail }} style={styles.thumbnail} resizeMode="cover" /> : <CategoryIcon categoryId={category.id} selected size={30} />}
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
          <Avatar name={creatorName} size={28} />
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={2}>{spark.title}</Text>
        <Text style={styles.meta} numberOfLines={1}>{formatCardLocation(spark.addressLabel)}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText} numberOfLines={1}>{category.name}</Text>
          </View>
          <BookmarkToggle saved={bookmarked} onPress={onBookmark} size={26} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 124,
    height: 228,
    borderRadius: 4,
    backgroundColor: colors.neutral,
    overflow: 'hidden',
    marginRight: 0,
    borderWidth: 1,
    borderColor: cardStyles.borderColor
  },
  image: {
    height: 142,
    backgroundColor: cardStyles.previewBackground,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: cardStyles.dividerColor
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject
  },
  copy: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 4
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 11,
    lineHeight: 14,
    minHeight: 30
  },
  meta: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 9,
    lineHeight: 12
  },
  bottomRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6
  },
  tag: {
    maxWidth: 74,
    minHeight: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(46, 91, 173, 0.22)',
    paddingHorizontal: 6,
    justifyContent: 'center',
    backgroundColor: colors.surface
  },
  tagText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 8,
    lineHeight: 10
  },
  creator: {
    position: 'absolute',
    left: 6,
    top: 6
  }
});

function formatCardLocation(address: string) {
  if (address.toLowerCase().includes('toronto')) return 'Toronto, CA';
  const city = address.split(',').map((part) => part.trim()).find((part) => part.length > 1) || 'Toronto';
  return `${city}, CA`;
}

function getCreatorName(createdBy: string, recommendedBy?: string) {
  if (recommendedBy) return recommendedBy;
  const names: Record<string, string> = {
    'profile-natalie': 'Natalie R.',
    'profile-maya': 'Maya C.',
    'profile-evan': 'Evan L.'
  };
  return names[createdBy] || 'Sparkbook user';
}
