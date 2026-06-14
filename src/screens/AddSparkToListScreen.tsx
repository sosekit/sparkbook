import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { CTAButton } from '../components/CTAButton';
import { EmptyState } from '../components/EmptyState';
import { ListCard } from '../components/ListCard';
import { SearchBar } from '../components/SearchBar';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddSparkToList'>;

export function AddSparkToListScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lists, addSparkToList, refresh } = useLists();
  const { sparks } = useSparks();
  const [query, setQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const filtered = useMemo(() => lists.filter((list) => {
    if (list.status !== 'active' || list.listType === 'auto_generated') return false;
    const haystack = `${list.title} ${list.description || ''}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  }), [lists, query]);

  async function addToSelected() {
    if (!selectedListId) return;
    setSaving(true);
    await addSparkToList(selectedListId, route.params.sparkId);
    await refresh();
    setSaving(false);
    navigation.replace('SparkListPreview', { listId: selectedListId });
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 6, minHeight: insets.top + 56 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.close}>
          <SparkbookIcon name="close" color={colors.text} size={24} />
        </Pressable>
        <Text style={styles.title}>Add Spark to List</Text>
      </View>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search Lists" />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Created Lists</Text>
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('CreateSparkList', { initialSparkId: route.params.sparkId })} style={({ pressed }) => [styles.createListButton, pressed ? styles.createListButtonPressed : null]}>
            <SparkbookIcon name="add" color={colors.white} size={16} />
            <Text style={styles.createListText}>Create new list</Text>
          </Pressable>
        </View>
        {filtered.length ? filtered.map((list) => {
          const selected = selectedListId === list.id;
          return (
            <View key={list.id} style={[styles.listOption, selected ? styles.selected : null]}>
              <ListCard list={list} sparks={sparks.filter((spark) => list.sparkIds.includes(spark.id))} onPress={() => setSelectedListId(list.id)} />
            </View>
          );
        }) : <EmptyState title="No matching lists" message="Try another list name or create a new list." />}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <CTAButton label={saving ? 'Adding...' : 'Add to selected list'} onPress={addToSelected} disabled={!selectedListId || saving} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 12 },
  close: { width: 24, height: 44, justifyContent: 'center' },
  title: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 20, lineHeight: 26 },
  searchWrap: { paddingHorizontal: 14, paddingBottom: 6 },
  content: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 96, gap: spacing.sm },
  sectionHeader: { gap: 6 },
  sectionTitle: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 18, lineHeight: 23 },
  createListButton: { alignSelf: 'flex-start', height: 34, borderRadius: 17, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.main },
  createListButtonPressed: { backgroundColor: colors.highlight },
  createListText: { color: colors.white, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  listOption: { borderRadius: 6, padding: 2 },
  selected: { borderWidth: 2, borderColor: colors.main },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingTop: 8, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.neutral }
});
