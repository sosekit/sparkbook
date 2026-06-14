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
  onCategoryPress?: () => void;
};

export function FeedCard({ spark, bookmarked, onPress, onBookmark, onCreatorPress, onCategoryPress }: FeedCardProps) {
  if (!spark?.id) return null;
  const category = getCategoryForSpark(spark);
  const thumbnail = (spark.media || []).find((media) => media.mediaType === 'photo')?.url;
  const isOwnSpark = spark.createdBy === 'profile-ray';
  const creatorName = getCreatorName(spark.createdBy, spark.recommendedBy);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
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
          <Avatar name={creatorName} size={24} />
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={2}>{spark.title}</Text>
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
          <BookmarkToggle saved={bookmarked} onPress={onBookmark} size={24} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 132,
    height: 218,
    borderRadius: cardStyles.radius,
    backgroundColor: colors.neutral,
    overflow: 'hidden',
    marginRight: 0,
    borderWidth: 1,
    borderColor: cardStyles.borderColor
  },
  pressed: { opacity: 0.78 },
  image: {
    height: 124,
    backgroundColor: cardStyles.previewBackground,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 5,
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
    paddingBottom: 10,
    gap: 4
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 12,
    lineHeight: 16,
    minHeight: 32
  },
  meta: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 11,
    lineHeight: 14
  },
  bottomRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5
  },
  tag: {
    maxWidth: 78,
    minHeight: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 6,
    justifyContent: 'center',
    backgroundColor: colors.surface
  },
  tagPressed: { backgroundColor: colors.neutral },
  tagText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 10,
    lineHeight: 12
  },
  creator: {
    position: 'absolute',
    left: 5,
    top: 5,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
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
