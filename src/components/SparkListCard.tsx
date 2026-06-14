import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { SparkList } from '../types/list';
import { Spark } from '../types/spark';
import { cardStyles } from './Card';
import { CategoryIcon } from './CategoryIcon';
import { Avatar } from './Avatar';

export type SparkListCardProps = {
  list: SparkList;
  sparks?: Spark[];
  onPress: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SparkListCard({ list, sparks = [], onPress, selected = false, style }: SparkListCardProps) {
  const coverSpark = sparks.find((spark) => spark.id === list.coverSparkId) || sparks[0];
  const thumbnail = list.thumbnailUri || coverSpark?.media?.find((media) => media.mediaType === 'photo')?.url;
  const locationLabel = getListLocationLabel(sparks);
  const creatorName = list.createdBy === 'profile-ray' ? 'Raymond Zhang' : list.createdBy.replace(/^profile-/, '').replace(/-/g, ' ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected ? styles.selected : null, pressed ? styles.pressed : null, style]}
    >
      <View style={styles.preview}>
        {thumbnail ? <Image source={{ uri: thumbnail }} style={styles.thumbnail} resizeMode="cover" /> : null}
        {!thumbnail ? (
          <View style={styles.emptyPreview}>
            <CategoryIcon categoryId={list.thumbnailIconKey || coverSpark?.categoryId || 'custom'} size={36} selected />
          </View>
        ) : null}
        <View style={styles.topRow}>
          <View style={styles.avatarWrap}>
            <Avatar name={creatorName} size={24} />
          </View>
          <View style={styles.bookmarkIcon}>
            <SparkbookIcon name="bookmark" color={colors.main} size={20} />
          </View>
        </View>
        <View style={styles.locationPill}>
          <SparkbookIcon name="location" color={colors.white} size={16} />
          <Text style={styles.locationText} numberOfLines={1}>{locationLabel}</Text>
        </View>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={1}>{list.title}</Text>
        <Text style={styles.body} numberOfLines={2}>
          {list.description || `${sparks.length} saved ${sparks.length === 1 ? 'spark' : 'sparks'}`}
        </Text>
      </View>
    </Pressable>
  );
}

function getListLocationLabel(sparks: Spark[]) {
  const source = sparks.find((spark) => spark.addressLabel || spark.location);
  const label = source?.addressLabel || source?.location || '';
  if (/toronto/i.test(label)) return 'Toronto, CA';
  const parts = label.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 1) return `${parts[0]}, CA`;
  return parts[0] || `${sparks.length} sparks`;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 228,
    backgroundColor: colors.surface,
    borderRadius: cardStyles.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: cardStyles.borderColor
  },
  selected: {
    borderColor: colors.main,
    borderWidth: 2
  },
  pressed: {
    opacity: 0.78
  },
  preview: {
    height: 152,
    padding: 8,
    justifyContent: 'space-between',
    backgroundColor: cardStyles.previewBackground,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: cardStyles.dividerColor
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%'
  },
  emptyPreview: {
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
    borderWidth: 1,
    borderColor: colors.main,
    overflow: 'hidden'
  },
  bookmarkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationPill: {
    alignSelf: 'flex-start',
    minHeight: 24,
    maxWidth: '86%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.main,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4
  },
  locationText: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16
  },
  copy: {
    minHeight: 74,
    gap: 4,
    padding: 8,
    backgroundColor: colors.neutral
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 16,
    lineHeight: 24
  },
  body: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16
  }
});
