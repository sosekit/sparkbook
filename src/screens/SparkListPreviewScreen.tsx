import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { BookmarkToggle } from '../components/BookmarkToggle';
import { CommentsSection } from '../components/CommentsSection';
import { CTAButton } from '../components/CTAButton';
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
  const [selectedId, setSelectedId] = useState<string | undefined>(route.params.selectedSparkId || listSparks[0]?.id);
  const selectedSpark = listSparks.find((spark) => spark.id === selectedId) || listSparks[0];

  useEffect(() => {
    if (!selectedId && route.params.selectedSparkId && listSparks.some((spark) => spark.id === route.params.selectedSparkId)) {
      setSelectedId(route.params.selectedSparkId);
      return;
    }
    if (!selectedId && listSparks[0]?.id) setSelectedId(listSparks[0].id);
    if (selectedId && !listSparks.some((spark) => spark.id === selectedId)) setSelectedId(listSparks[0]?.id);
  }, [listSparks, route.params.selectedSparkId, selectedId]);

  useEffect(() => {
    if (!list || list.status === 'deleted') navigation.replace('SavedListError', { listId: route.params.listId });
  }, [list, navigation, route.params.listId]);

  if (!list || list.status === 'deleted') return null;

  return (
    <View style={styles.root}>
      <ListMapPreview sparks={listSparks} selectedId={selectedSpark?.id} onSelect={setSelectedId} />
      <View style={[styles.header, { top: insets.top + 8 }]}>
        <View style={styles.headerGroup}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <SparkbookIcon name="chevronLeft" color={colors.text} size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>Spark List</Text>
        </View>
        {selectedSpark ? <BookmarkToggle saved={bookmarks.includes(selectedSpark.id)} onPress={() => toggleBookmark(selectedSpark.id)} size={30} /> : null}
      </View>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {listSparks.map((spark) => (
            <SparkPreviewCard key={spark.id} spark={spark} onPress={() => navigation.navigate('SingleSparkFromList', { listId: list.id, sparkId: spark.id })} />
          ))}
        </ScrollView>
        <ScrollView style={styles.detailsScroll} contentContainerStyle={styles.details}>
          <Text style={styles.title}>{selectedSpark?.title || list.title}</Text>
          <Text style={styles.caption}>{selectedSpark?.description || list.description || 'A saved Sparkbook list.'}</Text>
          <Text style={styles.location}>{selectedSpark?.addressLabel || `${listSparks.length} saved sparks`}</Text>
          <CTAButton label="Start Exploring" onPress={() => navigation.navigate('GuideRoute', { listId: list.id })} disabled={!listSparks.length} />
          <CommentsSection targetType="list" targetId={list.id} inputPlaceholder="Share a thought about this list" />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mapLand },
  header: { position: 'absolute', left: 14, right: 14, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 24, height: 44, justifyContent: 'center' },
  headerTitle: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 20, lineHeight: 26 },
  sheet: { position: 'absolute', left: 0, right: 0, top: 260, bottom: 0, backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: 12 },
  handle: { alignSelf: 'center', marginTop: 8, width: 86, height: 5, borderRadius: 999, backgroundColor: colors.main },
  carousel: { paddingTop: 6, gap: 5 },
  detailsScroll: { flex: 1 },
  details: { paddingTop: 6, gap: spacing.xs },
  title: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 20, lineHeight: 26 },
  caption: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 16 },
  location: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 12 }
});
