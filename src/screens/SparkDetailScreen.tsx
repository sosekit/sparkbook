import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparksIcon } from '../assets/icons/SparksIcon';
import { DEMO_MODE } from '../config/demoMode';
import { Avatar } from '../components/Avatar';
import { BackButton } from '../components/BackButton';
import { BookmarkToggle } from '../components/BookmarkToggle';
import { Button } from '../components/Button';
import { CategoryIcon } from '../components/CategoryIcon';
import { CTAButton } from '../components/CTAButton';
import { CommentsSection } from '../components/CommentsSection';
import { MapPreview } from '../components/MapPreview';
import { SmallButton } from '../components/SmallButton';
import { SparkMediaGallery } from '../components/SparkMediaGallery';
import { useBookmarks } from '../hooks/useBookmarks';
import { useFollows } from '../hooks/useFollows';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { formatSavedDate } from '../utils/date';
import { getCategoryForSpark } from '../utils/category';
import { canEditSpark } from '../utils/ownership';

type Props = NativeStackScreenProps<RootStackParamList, 'SparkDetail'>;

export function SparkDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks, softDeleteSpark } = useSparks();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const follows = useFollows();
  const spark = sparks.find((item) => item.id === route.params.sparkId);

  if (!spark || spark.status === 'deleted') {
    return <View style={styles.center}><Button label="Find a replacement" onPress={() => navigation.replace('DeletedContentSuggestion', { contentType: 'spark', contentId: route.params.sparkId })} /></View>;
  }

  const tags = spark.tags || [];
  const sparkId = spark.id;
  const category = getCategoryForSpark(spark);
  const isOwnSpark = canEditSpark(spark);
  const creatorName = getCreatorName(spark.createdBy, spark.recommendedBy);
  const contextTags = [...new Set([...(spark.moodTags || []), ...(spark.contextTags || [])])].slice(0, 8);
  const isFriendsSpark = spark.audience === 'friends' || spark.visibility === 'friends';
  const audienceLabel = isFriendsSpark
    ? 'Friends'
    : spark.audience === 'private' || spark.visibility === 'private'
      ? 'Private spark'
      : 'Public spark';

  async function removeSpark() {
    await softDeleteSpark(sparkId);
    navigation.replace('DeletedContentSuggestion', { contentType: 'spark', contentId: sparkId });
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.topBar}>
        <BackButton onPress={() => navigation.goBack()} />
        {isOwnSpark ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Edit spark" hitSlop={8} onPress={() => navigation.navigate('CreateSpark', { sparkId: spark.id })} style={({ pressed }) => [styles.editButton, pressed ? styles.editButtonPressed : null]}>
            <Text style={styles.editButtonText}>Edit Spark</Text>
          </Pressable>
        ) : null}
      </View>
      <SparkMediaGallery spark={spark} horizontalPadding={0} />
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{spark.title}</Text>
          <View style={styles.locationRow}>
            <SparksIcon name="location" color={colors.text} size={16} />
            <Text style={styles.location} numberOfLines={1}>{spark.addressLabel}</Text>
          </View>
          <Text style={styles.meta}>{formatSavedDate(spark.createdAt)}</Text>
        </View>
        <BookmarkToggle saved={bookmarks.includes(spark.id)} onPress={() => toggleBookmark(spark.id)} size={30} />
      </View>
      <View style={styles.metaRow}>
        <View style={styles.categoryMeta}>
          <CategoryIcon categoryId={category.id} selected size={30} />
          <SmallButton label={category.name} selected />
        </View>
        <SmallButton label={audienceLabel} icon={isFriendsSpark ? 'friends' : undefined} />
      </View>
      {!isOwnSpark ? (
        <View style={styles.creatorPanel}>
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('CreatorProfile', { profileId: spark.createdBy })} style={styles.creatorInfo}>
          <Avatar name={creatorName} size={36} />
          <View style={{ flex: 1 }}>
            <Text style={styles.creatorLabel}>Saved by</Text>
            <Text style={styles.creatorName}>{creatorName}</Text>
          </View>
          </Pressable>
          <Button label={follows.isFollowing(spark.createdBy) ? 'Following' : 'Follow'} onPress={() => follows.toggleFollow(spark.createdBy)} variant="secondary" />
        </View>
      ) : null}
      <View style={styles.panel}>
        <Text style={styles.body}>{spark.description || spark.caption || spark.reflectionNote || 'No description yet.'}</Text>
        {spark.recommendedBy ? <Text style={styles.source}>Recommended by {spark.recommendedBy}</Text> : null}
        <View style={styles.chips}>
          {contextTags.length ? contextTags.map((tag) => <SmallButton key={tag} label={tag} />) : <SmallButton label="No context yet" />}
        </View>
      </View>
      <Text style={styles.tags}>{tags.map((tag) => `#${tag}`).join(' ') || '#custom'}</Text>
      <View style={styles.locationPanel}>
        <Text style={styles.section}>Location</Text>
        <MapPreview locations={[spark]} selectedId={spark.id} height={188} />
      </View>
      <CTAButton label="Add to list" onPress={() => navigation.navigate('AddSparkToList', { sparkId: spark.id })} />
      <CommentsSection targetType="spark" targetId={spark.id} maxVisible={1} compact plain />
      {isOwnSpark && !DEMO_MODE ? (
        <View style={styles.secondaryActions}>
          <Button label="Delete spark" onPress={removeSpark} variant="ghost" />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 14, paddingBottom: 32, gap: spacing.sm },
  center: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editButton: { minHeight: 44, minWidth: 44, alignSelf: 'flex-start', justifyContent: 'center', paddingHorizontal: spacing.xs },
  editButtonPressed: { opacity: 0.62 },
  editButtonText: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 14, lineHeight: 18 },
  header: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  titleWrap: { flex: 1, gap: 5 },
  title: { color: colors.text, fontFamily: fontFamilies.primaryBold, fontSize: 22, lineHeight: 28 },
  meta: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  location: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 11, lineHeight: 14 },
  metaRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  categoryMeta: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  creatorPanel: { minHeight: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderSoft, backgroundColor: colors.surface, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  creatorInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  creatorLabel: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 11 },
  creatorName: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 15 },
  panel: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderSoft, padding: spacing.sm, gap: spacing.xs },
  section: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 16 },
  body: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 14, lineHeight: 20 },
  caption: { color: colors.text, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 17 },
  source: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tags: { color: colors.main, fontFamily: fontFamilies.secondary, fontWeight: '800', fontSize: 12 },
  locationPanel: { gap: spacing.xs, marginBottom: spacing.xs },
  secondaryActions: { gap: spacing.sm }
});

function getCreatorName(createdBy: string, recommendedBy?: string) {
  if (recommendedBy) return recommendedBy;
  const names: Record<string, string> = {
    'profile-natalie': 'Natalie R.',
    'profile-maya': 'Maya C.',
    'profile-evan': 'Evan L.'
  };
  return names[createdBy] || 'sparks user';
}
