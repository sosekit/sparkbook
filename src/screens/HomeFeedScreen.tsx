import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { DraggableHomePanel } from '../components/DraggableHomePanel';
import { FeedCard } from '../components/FeedCard';
import { HomeMapLayer } from '../components/HomeMapLayer';
import { ListCard } from '../components/ListCard';
import { SearchBar } from '../components/SearchBar';
import { SearchResultsList } from '../components/SearchResultsList';
import { SparkCard } from '../components/SparkCard';
import { SmallButton } from '../components/SmallButton';
import { useBookmarks } from '../hooks/useBookmarks';
import { useLists } from '../hooks/useLists';
import { useSearch } from '../hooks/useSearch';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { SearchResult } from '../services/searchService';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeFeed'>;

export function HomeFeedScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const { lists } = useLists();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [filter, setFilter] = useState<'all' | 'hidden' | 'friends'>('all');
  const [query, setQuery] = useState('');
  const [focusedSparkId, setFocusedSparkId] = useState<string | undefined>();
  const screenHeight = Dimensions.get('window').height;
  const expandedTop = insets.top + 82;
  const midTop = Math.max(insets.top + 250, Math.round(screenHeight * 0.5));
  const collapsedTop = Math.max(insets.top + 330, screenHeight - 260);
  const active = useMemo(
    () => sparks.filter(Boolean).filter((spark) => spark.id && spark.status === 'active'),
    [sparks]
  );
  const filtered = useMemo(
    () => filter === 'hidden'
      ? active.filter((spark) => spark.categoryId === 'hidden')
      : filter === 'friends'
        ? active.filter((spark) => spark.audience === 'friends' || spark.visibility === 'friends')
        : active,
    [active, filter]
  );
  const visibleLists = useMemo(
    () => lists.filter((list) => list.status === 'active'),
    [lists]
  );
  const following = useMemo(() => {
    const bookmarked = active.filter((spark) => bookmarks.includes(spark.id));
    return bookmarked.length ? bookmarked : active.slice(0, 3);
  }, [active, bookmarks]);
  const { results, searching } = useSearch(query, active, visibleLists);

  function selectSearchResult(result: SearchResult) {
    if (result.type === 'spark') {
      setFocusedSparkId(result.spark.id);
      navigation.navigate('SparkDetail', { sparkId: result.spark.id });
      return;
    }
    if (result.type === 'list') {
      navigation.navigate('SparkListPreview', { listId: result.list.id });
      return;
    }
    setFocusedSparkId(undefined);
    navigation.navigate('CreateSpark', { prefillLocation: result.place });
  }

  return (
    <View style={styles.root}>
      <HomeMapLayer
        sparks={active}
        selectedId={focusedSparkId}
        height={screenHeight}
        onSparkPress={(sparkId) => {
          setFocusedSparkId(sparkId);
          navigation.navigate('SparkDetail', { sparkId });
        }}
      />

      <DraggableHomePanel expandedTop={expandedTop} midTop={midTop} collapsedTop={collapsedTop} bottomInset={insets.bottom}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.feed}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search Toronto places" />
          <SearchResultsList results={results} query={query} searching={searching} onSelect={selectSearchResult} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
            {[
              { id: 'all' as const, label: 'Recs Nearby' },
              { id: 'hidden' as const, label: 'Trending' },
              { id: 'friends' as const, label: 'Friends' }
            ].map((item) => (
              <SmallButton key={item.id} label={item.label} selected={filter === item.id} onPress={() => setFilter(item.id)} />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Nearby Sparks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
            {(filtered.length ? filtered : active).slice(0, 5).map((spark) => (
              <FeedCard key={spark.id} spark={spark} bookmarked={bookmarks.includes(spark.id)} onBookmark={() => toggleBookmark(spark.id)} onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })} onCreatorPress={() => navigation.navigate('CreatorProfile', { profileId: spark.createdBy })} />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Spark Lists to explore around you</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listRow}>
            {visibleLists.map((list) => (
              <View key={list.id} style={styles.listPreview}>
                <ListCard list={list} sparks={active.filter((spark) => list.sparkIds.includes(spark.id))} onPress={() => navigation.navigate('ListDetail', { listId: list.id })} />
              </View>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>From your following list</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
            {following.slice(0, 4).map((spark) => (
              <FeedCard key={spark.id} spark={spark} bookmarked={bookmarks.includes(spark.id)} onBookmark={() => toggleBookmark(spark.id)} onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })} onCreatorPress={() => navigation.navigate('CreatorProfile', { profileId: spark.createdBy })} />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Trending in Toronto</Text>
          <View style={styles.verticalList}>
            {active.slice(0, 3).map((spark) => (
              <SparkCard key={spark.id} spark={spark} bookmarked={bookmarks.includes(spark.id)} onBookmark={() => toggleBookmark(spark.id)} onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })} />
            ))}
          </View>
        </ScrollView>
      </DraggableHomePanel>
      <BottomNav active="home" onHome={() => undefined} onBookmarks={() => navigation.navigate('Bookmarks')} onCreate={() => navigation.navigate('CreateSpark')} onLists={() => navigation.navigate('Lists')} onProfile={() => navigation.navigate('Profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mapLand },
  tags: { paddingVertical: 14, gap: 10 },
  feed: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 118, gap: 12 },
  sectionTitle: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 24, lineHeight: 32, marginTop: 2 },
  previewRow: { gap: 8, paddingRight: 16 },
  listRow: { gap: 8, paddingRight: 16 },
  listPreview: { width: 242 },
  verticalList: { gap: 8 }
});
