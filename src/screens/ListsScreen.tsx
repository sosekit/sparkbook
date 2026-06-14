import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { EmptyState } from '../components/EmptyState';
import { ListCard } from '../components/ListCard';
import { SearchBar } from '../components/SearchBar';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Lists'>;

export function ListsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lists } = useLists();
  const { sparks } = useSparks();
  const [filter, setFilter] = useState<'all' | 'collected' | 'suggested'>('all');
  const [query, setQuery] = useState('');
  const active = lists
    .filter((list) => list.status === 'active')
    .filter((list) => filter === 'all' || list.listType === filter)
    .filter((list) => `${list.title} ${list.description || ''}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>Your lists</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search lists" />
        <Pressable onPress={() => navigation.navigate('CreateSparkList')} style={styles.createList}>
          <Text style={styles.createText}>Create new list</Text>
          <SparkbookIcon name="add" color={colors.main} size={22} />
        </Pressable>
        <View style={styles.filters}>
          {(['all', 'collected', 'suggested'] as const).map((item) => (
            <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item ? styles.activeFilter : null]}>
              <Text style={[styles.filterText, filter === item ? styles.activeFilterText : null]}>{item === 'all' ? 'All' : item[0].toUpperCase() + item.slice(1)}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.sectionTitle}>{filter === 'all' ? 'Recent lists' : `${filter[0].toUpperCase()}${filter.slice(1)} lists`}</Text>
        {active.length ? active.map((list) => (
          <ListCard key={list.id} list={list} sparks={sparks.filter((spark) => list.sparkIds.includes(spark.id))} onPress={() => navigation.navigate('SparkListPreview', { listId: list.id })} />
        )) : <EmptyState title="No lists yet" message="Create or save lists to guide future exploration." />}
      </ScrollView>
      <BottomNav active="lists" onHome={() => navigation.navigate('HomeFeed')} onBookmarks={() => navigation.navigate('Bookmarks')} onCreate={() => navigation.navigate('CreateSpark')} onLists={() => undefined} onProfile={() => navigation.navigate('Profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingBottom: 58 },
  content: { padding: 14, gap: spacing.sm },
  title: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 20, lineHeight: 25 },
  subtitle: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 15, lineHeight: 22 },
  createList: { height: 38, borderRadius: 9, borderWidth: 1, borderColor: colors.main, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  createText: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 13 },
  sectionTitle: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 18, lineHeight: 23 },
  filters: { flexDirection: 'row', gap: spacing.xs },
  filter: { height: 26, borderRadius: 13, borderWidth: 1, borderColor: colors.highlight, backgroundColor: colors.surface, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  activeFilter: { backgroundColor: colors.main, borderColor: colors.main },
  filterText: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  activeFilterText: { color: colors.white }
});
