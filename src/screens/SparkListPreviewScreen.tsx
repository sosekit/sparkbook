import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparksIcon } from '../assets/icons/SparksIcon';
import { BookmarkToggle } from '../components/BookmarkToggle';
import { CategoryIcon } from '../components/CategoryIcon';
import { CTAButton } from '../components/CTAButton';
import { EmptyState } from '../components/EmptyState';
import { ListMapPreview } from '../components/ListMapPreview';
import { SparkPreviewCard } from '../components/SparkPreviewCard';
import { useBookmarks } from '../hooks/useBookmarks';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { Spark } from '../types/spark';
import { getCategoryForSpark } from '../utils/category';

type Props = NativeStackScreenProps<RootStackParamList, 'SparkListPreview'>;

export function SparkListPreviewScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lists } = useLists();
  const { sparks } = useSparks();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const list = lists.find((item) => item.id === route.params.listId);
  const orderedIds = useMemo(
    () => list?.items?.length ? [...list.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.sparkId) : list?.sparkIds || [],
    [list]
  );
  const listSparks = useMemo(
    () => orderedIds.map((id) => sparks.find((spark) => spark.id === id && spark.status === 'active')).filter(Boolean) as Spark[],
    [orderedIds, sparks]
  );
  const routeSelectedSparkId = route.params.selectedSparkId || route.params.addedSparkId;
  const [selectedId, setSelectedId] = useState<string | undefined>(routeSelectedSparkId || listSparks[0]?.id);
  const selectedSpark = listSparks.find((spark) => spark.id === selectedId) || listSparks[0];
  const selectedCategory = selectedSpark ? getCategoryForSpark(selectedSpark) : null;

  useEffect(() => {
    if (routeSelectedSparkId && selectedId !== routeSelectedSparkId && listSparks.some((spark) => spark.id === routeSelectedSparkId)) {
      setSelectedId(routeSelectedSparkId);
      return;
    }
    if (!selectedId && listSparks[0]?.id) setSelectedId(listSparks[0].id);
    if (selectedId && !listSparks.some((spark) => spark.id === selectedId)) setSelectedId(listSparks[0]?.id);
  }, [listSparks, routeSelectedSparkId, selectedId]);

  useEffect(() => {
    if (!list || list.status === 'deleted') navigation.replace('SavedListError', { listId: route.params.listId });
  }, [list, navigation, route.params.listId]);

  if (!list || list.status === 'deleted') return null;
  const activeList = list;

  function handlePreviewPress(spark: Spark) {
    if (spark.id === selectedSpark?.id) {
      navigation.navigate('SingleSparkFromList', { listId: activeList.id, sparkId: spark.id });
      return;
    }
    setSelectedId(spark.id);
  }

  function startGuide() {
    if (!selectedSpark) return;
    navigation.navigate('GuideRoute', { listId: activeList.id, startSparkId: selectedSpark?.id });
  }

  return (
    <View style={styles.root}>
      <ListMapPreview sparks={listSparks} selectedId={selectedSpark?.id} onSelect={setSelectedId} />
      <View style={[styles.header, { top: insets.top }]}>
        <View style={styles.headerGroup}>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={() => navigation.goBack()} style={({ pressed }) => [styles.back, pressed ? styles.backPressed : null]}>
            <SparksIcon name="chevronLeft" color={colors.text} size={24} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>{activeList.title}</Text>
        </View>
        {selectedSpark ? <BookmarkToggle saved={bookmarks.includes(selectedSpark.id)} onPress={() => toggleBookmark(selectedSpark.id)} size={30} /> : null}
      </View>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.listSummary}>
          <Text style={styles.listTitle} numberOfLines={2}>{activeList.title}</Text>
          {activeList.description ? <Text style={styles.listDescription} numberOfLines={2}>{activeList.description}</Text> : null}
          <Text style={styles.listMeta}>{listSparks.length} {listSparks.length === 1 ? 'spark' : 'sparks'} · {visibilityLabel(activeList.visibility)}</Text>
        </View>
        {listSparks.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {listSparks.map((spark) => (
              <SparkPreviewCard
                key={spark.id}
                spark={spark}
                variant="media"
                selected={spark.id === selectedSpark?.id}
                onPress={() => handlePreviewPress(spark)}
              />
            ))}
          </ScrollView>
        ) : null}
        <ScrollView style={styles.detailsScroll} contentContainerStyle={styles.details}>
          {selectedSpark ? (
            <>
              <View style={styles.titleField}>
                <Text style={styles.title} numberOfLines={2}>{selectedSpark.title}</Text>
              </View>
              {selectedCategory ? (
                <View style={styles.categoryField}>
                  <CategoryIcon categoryId={selectedCategory.id} selected size={30} />
                  <Text style={styles.categoryText}>{selectedCategory.name}</Text>
                </View>
              ) : null}
              <View style={styles.captionField}>
                <Text style={styles.caption}>{selectedSpark.description || selectedSpark.caption || list.description || 'A saved sparks list.'}</Text>
              </View>
              <View style={styles.locationField}>
                <SparksIcon name="location" color={colors.text} size={16} />
                <Text style={styles.location} numberOfLines={1}>{selectedSpark.addressLabel}</Text>
              </View>
              <CTAButton label="Start Exploring" onPress={startGuide} />
            </>
          ) : (
            <View style={styles.emptyWrap}>
              <EmptyState title="No sparks in this list yet." message="Add sparks to this list before starting a guide." />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mapLand },
  header: { position: 'absolute', left: 16, right: 16, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerGroup: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  back: { width: 44, height: 44, justifyContent: 'center' },
  backPressed: { opacity: 0.62 },
  headerTitle: { flex: 1, color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 22, lineHeight: 32 },
  sheet: { position: 'absolute', left: 0, right: 0, top: 263, bottom: 0, backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingHorizontal: 16, paddingTop: 16 },
  handle: { alignSelf: 'center', width: 107, height: 6, borderRadius: 5, backgroundColor: colors.main },
  listSummary: { paddingTop: 8, gap: 4 },
  listTitle: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 22, lineHeight: 30 },
  listDescription: { color: colors.text, fontFamily: fontFamilies.secondary, fontSize: 13, lineHeight: 18 },
  listMeta: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16 },
  carousel: { paddingTop: 8, gap: 6 },
  detailsScroll: { flex: 1 },
  details: { paddingTop: 8, paddingBottom: 24, gap: spacing.sm },
  titleField: { padding: 8 },
  categoryField: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8 },
  categoryText: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16 },
  captionField: { padding: 8, borderTopWidth: 1, borderTopColor: colors.dividerMuted, borderRadius: 4 },
  locationField: { minHeight: 24, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 4 },
  title: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 16, lineHeight: 24 },
  caption: { color: colors.text, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 16 },
  location: { flex: 1, color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16 },
  emptyWrap: { paddingTop: spacing.lg }
});

function visibilityLabel(visibility: string) {
  if (visibility === 'friends') return 'Friends';
  if (visibility === 'private') return 'Private';
  return 'Public';
}
