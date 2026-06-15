import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useRef, useState } from 'react';
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
type HomeFilter = 'nearby' | 'trending' | 'friends';

const filterLabels: Record<HomeFilter, string> = {
  nearby: 'Nearby Sparks',
  trending: 'Trending Sparks',
  friends: 'Friends Only'
};

export function HomeFeedScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const { lists } = useLists();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [filter, setFilter] = useState<HomeFilter>('nearby');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [focusedSparkId, setFocusedSparkId] = useState<string | undefined>();
  const [panelScrollOffset, setPanelScrollOffset] = useState(0);
  const lastPanelOffset = useRef(0);
  const screenHeight = Dimensions.get('window').height;
  const expandedTop = insets.top + 70;
  const midTop = Math.max(insets.top + 280, Math.round(screenHeight * 0.54));
  const collapsedTop = Math.max(insets.top + 360, screenHeight - 230);
  const active = useMemo(
    () => sparks.filter(Boolean).filter((spark) => spark.id && spark.status === 'active'),
    [sparks]
  );
  const filtered = useMemo(
    () => {
      const filterBase = filter === 'trending'
        ? [...active].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : filter === 'friends'
          ? active.filter(isFriendSpark)
          : active;
      return categoryFilter ? filterBase.filter((spark) => spark.categoryId === categoryFilter) : filterBase;
    },
    [active, categoryFilter, filter]
  );
  const visibleLists = useMemo(
    () => lists.filter((list) => list.status === 'active' && list.visibility !== 'private'),
    [lists]
  );
  const filteredLists = useMemo(() => {
    const friendSparkIds = new Set(active.filter(isFriendSpark).map((spark) => spark.id));
    if (filter === 'friends') return visibleLists.filter((list) => list.audience === 'friends' || list.visibility === 'friends' || list.sparkIds.some((sparkId) => friendSparkIds.has(sparkId)));
    if (filter === 'trending') return [...visibleLists].sort((a, b) => b.sparkIds.length - a.sparkIds.length || b.updatedAt.localeCompare(a.updatedAt));
    return visibleLists;
  }, [active, filter, visibleLists]);
  const trendingSparks = useMemo(() => [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3), [filtered]);
  const { results, searching } = useSearch(query, active, visibleLists);

  function selectSearchResult(result: SearchResult) {
    if (result.type === 'spark') {
      setFocusedSparkId(result.spark.id);
      navigation.navigate('SparkDetail', { sparkId: result.spark.id });
      return;
    }
    if (result.type === 'list') {
      navigation.navigate('GuideRoute', { listId: result.list.id });
      return;
    }
    setFocusedSparkId(undefined);
    navigation.navigate('CreateSpark', { prefillLocation: result.place });
  }

  return (
    <View style={styles.root}>
      <HomeMapLayer
        sparks={filtered}
        selectedId={focusedSparkId}
        height={screenHeight}
        onSparkPress={(sparkId) => {
          setFocusedSparkId(sparkId);
          navigation.navigate('SparkDetail', { sparkId });
        }}
      />

      <DraggableHomePanel expandedTop={expandedTop} midTop={midTop} collapsedTop={collapsedTop} bottomInset={insets.bottom} scrollOffset={panelScrollOffset}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.feed, { paddingBottom: insets.bottom + 112 }]}
          scrollEventThrottle={16}
          onScroll={(event) => {
            const nextOffset = event.nativeEvent.contentOffset.y;
            if (Math.abs(nextOffset - lastPanelOffset.current) > 2) {
              lastPanelOffset.current = nextOffset;
              setPanelScrollOffset(nextOffset);
            }
          }}
        >
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search Locations" />
          <SearchResultsList
            results={results}
            query={query}
            searching={searching}
            onSelect={selectSearchResult}
            onCreateFromQuery={(term) => navigation.navigate('CreateSpark', {
              prefillLocation: {
                id: `custom-${Date.now()}`,
                displayName: term,
                addressLabel: 'Toronto, CA',
                latitude: 43.6532,
                longitude: -79.3832
              }
            })}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
            {[
              { id: 'nearby' as const, label: 'Nearby' },
              { id: 'trending' as const, label: 'Trending' },
              { id: 'friends' as const, label: 'Friends' }
            ].map((item) => (
              <SmallButton key={item.id} label={item.label} selected={filter === item.id} onPress={() => setFilter(item.id)} />
            ))}
            {categoryFilter ? <SmallButton label="Clear" onPress={() => setCategoryFilter(null)} /> : null}
          </ScrollView>

          <Text style={styles.sectionTitle}>{filterLabels[filter]}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
            {filtered.slice(0, 5).map((spark) => (
              <FeedCard key={spark.id} spark={spark} bookmarked={bookmarks.includes(spark.id)} onBookmark={() => toggleBookmark(spark.id)} onCategoryPress={() => setCategoryFilter(spark.categoryId)} onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })} onCreatorPress={() => navigation.navigate('CreatorProfile', { profileId: spark.createdBy })} />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Spark Lists to{'\n'}explore around you</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listRow}>
            {filteredLists.map((list) => (
              <View key={list.id} style={styles.listPreview}>
                <ListCard list={list} sparks={active.filter((spark) => list.sparkIds.includes(spark.id))} onPress={() => navigation.navigate('GuideRoute', { listId: list.id })} />
              </View>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Trending in Toronto</Text>
          <View style={styles.verticalList}>
            {trendingSparks.map((spark) => (
              <SparkCard key={spark.id} spark={spark} bookmarked={bookmarks.includes(spark.id)} onBookmark={() => toggleBookmark(spark.id)} onCategoryPress={() => setCategoryFilter(spark.categoryId)} onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })} tagMode="icon" />
            ))}
          </View>
        </ScrollView>
      </DraggableHomePanel>
      <BottomNav active="home" onHome={() => undefined} onBookmarks={() => navigation.navigate('Bookmarks')} onCreate={() => navigation.navigate('CreateSpark')} onLists={() => navigation.navigate('Lists')} onProfile={() => navigation.navigate('Profile')} />
    </View>
  );
}

function isFriendSpark(spark: { audience?: string; visibility?: string; moodTags?: string[]; contextTags?: string[] }) {
  if (spark.audience === 'friends' || spark.visibility === 'friends') return true;
  const tags = [...(spark.moodTags || []), ...(spark.contextTags || [])].join(' ').toLowerCase();
  return tags.includes('friend');
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mapLand },
  tags: { gap: 10 },
  feed: { paddingHorizontal: 16, paddingTop: 0, gap: 16 },
  sectionTitle: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 22, lineHeight: 32, marginTop: 0 },
  previewRow: { gap: 8, paddingRight: 16 },
  listRow: { gap: 8, paddingRight: 16 },
  listPreview: { width: 242 },
  verticalList: { gap: 6 }
});
