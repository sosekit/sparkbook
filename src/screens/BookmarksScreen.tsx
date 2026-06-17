import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { EmptyState } from '../components/EmptyState';
import { ListCard } from '../components/ListCard';
import { SearchBar } from '../components/SearchBar';
import { SmallButton } from '../components/SmallButton';
import { SparkCard } from '../components/SparkCard';
import { useBookmarks } from '../hooks/useBookmarks';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Bookmarks'>;

export function BookmarksScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const { lists } = useLists();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'friends'>('all');
  const savedLists = useMemo(() => {
    const activeLists = lists.filter((list) => list.status === 'active');
    const createdLists = activeLists.filter((list) => list.createdBy === 'profile-ray' && list.listType === 'collected' && list.visibility !== 'private');
    const privateLists = activeLists.filter((list) => list.createdBy === 'profile-ray' && list.visibility === 'private');
    const createdIds = new Set([...createdLists, ...privateLists].map((list) => list.id));
    return activeLists
      .filter((list) => !createdIds.has(list.id) && list.visibility !== 'private')
      .filter((list) => filter === 'all' || list.visibility === 'friends' || list.audience === 'friends')
      .filter((list) => {
        const relatedSparkText = sparks
          .filter((spark) => list.sparkIds.includes(spark.id))
          .map((spark) => `${spark.title} ${spark.addressLabel}`)
          .join(' ');
        const text = `${list.title} ${list.description || ''} ${relatedSparkText}`.toLowerCase();
        return text.includes(query.trim().toLowerCase());
      });
  }, [filter, lists, query, sparks]);

  const saved = useMemo(() => {
    return sparks
      .filter(Boolean)
      .filter((spark) => spark.id && spark.status === 'active')
      .filter((spark) => bookmarks.includes(spark.id))
      .filter((spark) => filter === 'all' || spark.visibility === 'friends' || spark.audience === 'friends')
      .filter((spark) => {
      const text = `${spark.title} ${spark.addressLabel} ${spark.description || ''} ${spark.reflectionNote || ''} ${(spark.tags || []).join(' ')} ${(spark.contextTags || []).join(' ')}`.toLowerCase();
      return text.includes(query.trim().toLowerCase());
    });
  }, [bookmarks, filter, query, sparks]);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>Saved sparks</Text>
        <Text style={styles.subtitle}>Bookmarked places saved for later.</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search Locations" />
        {savedLists.length ? (
          <>
            <Text style={styles.section}>Saved Spark Lists</Text>
            <View style={styles.cardStack}>
              {savedLists.map((list) => (
                <ListCard
                  key={list.id}
                  list={list}
                  sparks={sparks.filter((spark) => list.sparkIds.includes(spark.id))}
                  onPress={() => navigation.navigate('SparkListPreview', { listId: list.id })}
                />
              ))}
            </View>
          </>
        ) : null}
        <Text style={styles.section}>Bookmarked</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {[
            ['all', 'All'],
            ['friends', 'Close Friends']
          ].map(([id, label]) => (
            <SmallButton key={id} label={label} selected={filter === id} onPress={() => setFilter(id as typeof filter)} />
          ))}
        </ScrollView>
        {saved.length ? saved.map((spark) => (
          <SparkCard
            key={spark.id}
            spark={spark}
            bookmarked={bookmarks.includes(spark.id)}
            onBookmark={() => toggleBookmark(spark.id)}
            onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })}
          />
        )) : !savedLists.length ? <EmptyState title="No sparks found" message="Your places will appear here when they match this search." actionLabel="Explore sparks" onAction={() => navigation.navigate('HomeFeed')} /> : null}
      </ScrollView>
      <BottomNav active="bookmarks" onHome={() => navigation.navigate('HomeFeed')} onBookmarks={() => undefined} onCreate={() => navigation.navigate('CreateSpark')} onLists={() => navigation.navigate('Lists')} onProfile={() => navigation.navigate('Profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingBottom: 58 },
  content: { padding: 14, gap: spacing.sm },
  title: { color: colors.text, fontFamily: fontFamilies.primaryBold, fontSize: 24, lineHeight: 30 },
  subtitle: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 13, lineHeight: 18 },
  section: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 16, lineHeight: 20 },
  filters: { gap: spacing.xs, paddingVertical: 0 },
  cardStack: { gap: spacing.sm }
});
