import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { EmptyState } from '../components/EmptyState';
import { SearchBar } from '../components/SearchBar';
import { SmallButton } from '../components/SmallButton';
import { SparkCard } from '../components/SparkCard';
import { useBookmarks } from '../hooks/useBookmarks';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Bookmarks'>;

export function BookmarksScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const { bookmarks } = useBookmarks();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'bookmarked' | 'revisit' | 'friends'>('all');
  const saved = useMemo(() => {
    const toRevisitIds = new Set(bookmarks);
    return sparks
      .filter(Boolean)
      .filter((spark) => spark.id && spark.status === 'active')
      .filter((spark) => bookmarks.includes(spark.id) || spark.wantToRevisit)
      .filter((spark) => filter === 'all' || (filter === 'bookmarked' ? bookmarks.includes(spark.id) : filter === 'revisit' ? toRevisitIds.has(spark.id) || spark.wantToRevisit : spark.visibility === 'friends' || spark.audience === 'friends'))
      .filter((spark) => {
      const text = `${spark.title} ${spark.addressLabel} ${spark.description || ''} ${spark.reflectionNote || ''} ${(spark.tags || []).join(' ')} ${(spark.contextTags || []).join(' ')}`.toLowerCase();
      return text.includes(query.trim().toLowerCase());
    });
  }, [bookmarks, filter, query, sparks]);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>Saved sparks</Text>
        <Text style={styles.subtitle}>Bookmarked places you want to come back to.</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search sparks, notes, tags" />
        <Text style={styles.section}>To revisit</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {[
            ['all', 'All'],
            ['bookmarked', 'Bookmarked'],
            ['revisit', 'Want to revisit'],
            ['friends', 'Close Friends']
          ].map(([id, label]) => (
            <SmallButton key={id} label={label} selected={filter === id} onPress={() => setFilter(id as typeof filter)} />
          ))}
        </ScrollView>
        {saved.length ? saved.map((spark) => <SparkCard key={spark.id} spark={spark} onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })} />) : <EmptyState title="No sparks found" message="Your places will appear here when they match this search." actionLabel="Explore sparks" onAction={() => navigation.navigate('HomeFeed')} />}
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
  filters: { gap: spacing.xs, paddingVertical: 0 }
});
