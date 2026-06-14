import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { DEMO_MODE } from '../config/demoMode';
import { Avatar } from '../components/Avatar';
import { BackButton } from '../components/BackButton';
import { BookmarkToggle } from '../components/BookmarkToggle';
import { Button } from '../components/Button';
import { CTAButton } from '../components/CTAButton';
import { CommentsSection } from '../components/CommentsSection';
import { MapPreview } from '../components/MapPreview';
import { SmallButton } from '../components/SmallButton';
import { SparkMediaGallery } from '../components/SparkMediaGallery';
import { useBookmarks } from '../hooks/useBookmarks';
import { useFollows } from '../hooks/useFollows';
import { useRevisit } from '../hooks/useRevisit';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { formatSavedDate } from '../utils/date';
import { getCategoryForSpark } from '../utils/category';

type Props = NativeStackScreenProps<RootStackParamList, 'SparkDetail'>;

export function SparkDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks, softDeleteSpark, refresh } = useSparks();
  const { bookmarks, toggleBookmark, refresh: refreshBookmarks } = useBookmarks();
  const follows = useFollows();
  const spark = sparks.find((item) => item.id === route.params.sparkId);
  const revisitState = useRevisit(route.params.sparkId);

  if (!spark || spark.status === 'deleted') {
    return <View style={styles.center}><Button label="Find a replacement" onPress={() => navigation.replace('DeletedContentSuggestion', { contentType: 'spark', contentId: route.params.sparkId })} /></View>;
  }

  const tags = spark.tags || [];
  const sparkId = spark.id;
  const category = getCategoryForSpark(spark);
  const isOwnSpark = spark.createdBy === 'profile-ray';
  const creatorName = getCreatorName(spark.createdBy, spark.recommendedBy);
  const contextTags = [...new Set([...(spark.moodTags || []), ...(spark.contextTags || [])])].slice(0, 8);
  const audienceLabel = spark.audience === 'friends' || spark.visibility === 'friends'
    ? 'Shared with Close Friends'
    : spark.audience === 'private' || spark.visibility === 'private'
      ? 'Private spark'
      : 'Public spark';

  async function revisit() {
    await revisitState.markRevisited('Marked from Sparkbook detail');
    await refresh();
    await refreshBookmarks();
  }

  async function removeSpark() {
    await softDeleteSpark(sparkId);
    navigation.replace('DeletedContentSuggestion', { contentType: 'spark', contentId: sparkId });
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.topBar}>
        <BackButton onPress={() => navigation.goBack()} />
        {isOwnSpark ? <Button label="Edit Spark" onPress={() => navigation.navigate('CreateSpark', { sparkId: spark.id })} variant="secondary" /> : null}
      </View>
      <SparkMediaGallery spark={spark} horizontalPadding={0} />
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{spark.title}</Text>
          <View style={styles.locationRow}>
            <SparkbookIcon name="location" color={colors.text} size={16} />
            <Text style={styles.location} numberOfLines={1}>{spark.addressLabel}</Text>
          </View>
          <Text style={styles.meta}>{formatSavedDate(spark.createdAt)}</Text>
        </View>
        <BookmarkToggle saved={bookmarks.includes(spark.id)} onPress={() => toggleBookmark(spark.id)} size={30} />
      </View>
      <View style={styles.metaRow}>
        <SmallButton label={category.name} selected />
        <SmallButton label={audienceLabel} />
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
        <Text style={styles.section}>Add a note</Text>
        <Text style={styles.body}>{spark.reflectionNote || spark.description || spark.caption || 'No note yet.'}</Text>
        {spark.caption ? <Text style={styles.caption}>{spark.caption}</Text> : null}
        {spark.recommendedBy ? <Text style={styles.source}>Recommended by {spark.recommendedBy}</Text> : null}
        <View style={styles.chips}>
          {contextTags.length ? contextTags.map((tag) => <SmallButton key={tag} label={tag} />) : <SmallButton label="No context yet" />}
        </View>
      </View>
      <View style={styles.actionsRow}>
        <View style={styles.revisitMeta}>
          <SparkbookIcon name="bookmark" color={colors.main} size={16} />
          <Text style={styles.revisitMetaText} numberOfLines={1}>
            {bookmarks.includes(spark.id)
              ? 'To revisit'
              : spark.lastVisitedAt
                ? `Last revisited ${formatSavedDate(spark.lastVisitedAt)}`
                : 'Not bookmarked'}
          </Text>
        </View>
        <Pressable accessibilityRole="button" onPress={revisit} style={({ pressed }) => [styles.revisitButton, pressed ? styles.revisitPressed : null]}>
          <Text style={styles.revisitText}>Mark as revisited</Text>
        </Pressable>
      </View>
      <Text style={styles.tags}>{tags.map((tag) => `#${tag}`).join(' ') || '#custom'}</Text>
      <View style={styles.locationPanel}>
        <Text style={styles.section}>Location</Text>
        <MapPreview locations={[spark]} selectedId={spark.id} height={156} />
      </View>
      <CommentsSection targetType="spark" targetId={spark.id} />
      <CTAButton label="Add to list" onPress={() => navigation.navigate('AddSparkToList', { sparkId: spark.id })} />
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
  header: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  titleWrap: { flex: 1, gap: 5 },
  title: { color: colors.text, fontFamily: fontFamilies.primaryBold, fontSize: 22, lineHeight: 28 },
  meta: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  location: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 11, lineHeight: 14 },
  metaRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
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
  actionsRow: { minHeight: 44, borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderSoft, backgroundColor: colors.surface, paddingHorizontal: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  revisitMeta: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  revisitMetaText: { color: colors.altText, fontFamily: fontFamilies.secondaryBold, fontSize: 11 },
  revisitButton: { minHeight: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.main, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm },
  revisitPressed: { backgroundColor: colors.neutral },
  revisitText: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  locationPanel: { gap: spacing.sm },
  secondaryActions: { gap: spacing.sm }
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
