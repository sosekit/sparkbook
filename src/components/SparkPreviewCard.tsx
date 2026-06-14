import { Image, StyleSheet, Text, View } from 'react-native';
import { Spark } from '../types/spark';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { CategoryIcon } from './CategoryIcon';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { cardStyles } from './Card';

export function SparkPreviewCard({ spark }: { spark?: Spark | null }) {
  if (!spark?.id) return null;
  const thumbnail = (spark.media || []).find((media) => media.mediaType === 'photo')?.url;

  return (
    <View style={styles.card}>
      <View style={styles.media}>
        {thumbnail ? <Image source={{ uri: thumbnail }} style={styles.image} resizeMode="cover" /> : <CategoryIcon categoryId={spark.categoryId} selected size={52} />}
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={2}>{spark.title}</Text>
        <Text style={styles.caption} numberOfLines={2}>{spark.description || 'Saved as a Sparkbook location.'}</Text>
        <View style={styles.locationRow}>
          <SparkbookIcon name="location" color={colors.text} size={16} />
          <Text style={styles.location} numberOfLines={1}>{spark.addressLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 198,
    height: 348,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.neutral,
    marginRight: 6,
    borderWidth: 1,
    borderColor: cardStyles.borderColor
  },
  media: {
    height: 236,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cardStyles.previewBackground,
    borderBottomWidth: 1,
    borderBottomColor: cardStyles.dividerColor
  },
  image: {
    width: '100%',
    height: '100%'
  },
  copy: {
    padding: spacing.sm,
    gap: 5
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 18,
    lineHeight: 22
  },
  caption: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  location: {
    flex: 1,
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12
  }
});
