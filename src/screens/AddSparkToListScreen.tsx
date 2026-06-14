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
import { ListServiceError } from '../services/listService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddSparkToList'>;

export function AddSparkToListScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lists, addSparkToList } = useLists();
  const { sparks } = useSparks();
  const [query, setQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtered = useMemo(() => lists.filter((list) => {
    if (list.status !== 'active' || list.listType === 'auto_generated') return false;
    const haystack = `${list.title} ${list.description || ''}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  }), [lists, query]);

  async function addToSelected() {
    if (saving) return;
    if (!route.params.sparkId) {
      setError('Couldn’t find this spark. Try again.');
      return;
    }
    if (!selectedListId) {
      setError('Choose a list first.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updatedList = await addSparkToList(selectedListId, route.params.sparkId);
      setSaving(false);
      navigation.replace('ListDetail', { listId: updatedList.id, addedSparkId: route.params.sparkId });
    } catch (err) {
      if (err instanceof ListServiceError && err.code === 'already-in-list') {
        setSaving(false);
        navigation.replace('ListDetail', { listId: selectedListId, addedSparkId: route.params.sparkId });
        return;
      }
      setError(addToListErrorMessage(err));
      setSaving(false);
    }
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
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search Locations" />
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
            <View key={list.id} style={styles.listOption}>
              <ListCard
                list={list}
                sparks={sparks.filter((spark) => list.sparkIds.includes(spark.id))}
                selected={selected}
                onPress={() => {
                  setSelectedListId(list.id);
                  setError(null);
                }}
              />
            </View>
          );
        }) : <EmptyState title="No matching lists" message="Try another list name or create a new list." />}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <Text style={[styles.inlineMessage, error ? styles.errorText : null]}>
          {error || (!selectedListId ? 'Choose a list first.' : 'Ready to add this spark.')}
        </Text>
        <CTAButton label={saving ? 'Adding...' : 'Add to selected list'} onPress={addToSelected} disabled={!selectedListId || saving} />
      </View>
    </View>
  );
}

function addToListErrorMessage(error: unknown) {
  if (error instanceof ListServiceError) {
    if (error.code === 'already-in-list') return 'This spark is already in that list.';
    if (error.code === 'list-not-found') return 'Selected list not found.';
    if (error.code === 'missing-spark' || error.code === 'spark-not-found') return 'Couldn’t find this spark. Try again.';
  }
  return 'Couldn’t add this spark. Try again.';
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
  listOption: { borderRadius: 6 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingTop: 8, gap: 6, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.neutral },
  inlineMessage: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 16 },
  errorText: { color: colors.danger, fontFamily: fontFamilies.secondaryBold }
});
