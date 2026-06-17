import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SparksIcon } from '../assets/icons/SparksIcon';
import { getDemoMediaAsset, isDemoMediaUri } from '../data/demoMediaLibrary';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { Spark, SparkMedia } from '../types/spark';
import { getCategoryForSpark } from '../utils/category';
import { CategoryIcon } from './CategoryIcon';
import { DemoMediaArtwork } from './DemoMediaArtwork';

type SparkMediaGalleryProps = {
  spark: Spark;
  relatedMedia?: SparkMedia[];
  compact?: boolean;
  horizontalPadding?: number;
};

export function SparkMediaGallery({ spark, relatedMedia = [], compact = false, horizontalPadding = 16 }: SparkMediaGalleryProps) {
  const category = getCategoryForSpark(spark);
  const media = [...(spark.media || []), ...relatedMedia]
    .filter((item) => item?.url)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const cardStyle = compact ? styles.compactCard : styles.card;

  if (!media.length) {
    return (
      <View style={[cardStyle, compact ? styles.compactEmptyCard : styles.emptyCardSize, styles.emptyCard, { marginHorizontal: horizontalPadding }]}>
        <CategoryIcon categoryId={category.id} selected size={compact ? 42 : 56} />
        <Text style={styles.emptyText}>Saved location</Text>
      </View>
    );
  }

  if (media.length === 1) {
    return (
      <View style={[styles.singleRow, { paddingHorizontal: horizontalPadding }]}>
        <GalleryItem item={media[0]} style={cardStyle} categoryId={category.id} />
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.row, { paddingHorizontal: horizontalPadding }]}>
      {media.map((item) => (
        <GalleryItem key={item.id || item.url} item={item} style={cardStyle} categoryId={category.id} />
      ))}
    </ScrollView>
  );
}

function GalleryItem({ item, style, categoryId }: { item: SparkMedia; style: object; categoryId: string }) {
  const [failed, setFailed] = useState(false);
  const demoAsset = getDemoMediaAsset(item.url);

  if (demoAsset?.source) {
    return (
      <View style={style}>
        <Image source={demoAsset.source} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  if (isDemoMediaUri(item.url)) {
    return (
      <View style={style}>
        <DemoMediaArtwork categoryId={demoAsset?.categoryId || categoryId} label={demoAsset?.title} />
      </View>
    );
  }

  if (item.mediaType !== 'photo') {
    return (
      <View style={style}>
        <View style={styles.videoFallback}>
          <SparksIcon name="spark" color={colors.white} size={30} />
          <Text style={styles.videoText}>Video</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={style}>
      {!failed ? (
        <Image source={{ uri: item.url }} style={styles.image} resizeMode="cover" onError={() => setFailed(true)} />
      ) : (
        <View style={styles.invalidFallback}>
          <CategoryIcon categoryId={categoryId} selected size={44} />
          <Text style={styles.emptyText}>Saved location</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 6,
    paddingHorizontal: 16
  },
  singleRow: {
    width: '100%',
    alignItems: 'center'
  },
  card: {
    width: 198,
    height: 348,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.neutral,
    borderWidth: 1,
    borderColor: colors.borderMuted
  },
  compactCard: {
    width: 156,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.neutral,
    borderWidth: 1,
    borderColor: colors.borderMuted
  },
  image: {
    width: '100%',
    height: '100%'
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  emptyCardSize: {
    height: 348
  },
  compactEmptyCard: {
    height: 200
  },
  emptyText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12
  },
  videoFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.main
  },
  videoText: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12
  },
  invalidFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.neutral
  }
});
