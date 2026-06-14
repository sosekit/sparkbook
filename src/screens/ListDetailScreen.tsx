import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { Button } from '../components/Button';
import { CommentsSection } from '../components/CommentsSection';
import { DraggableSparkList } from '../components/DraggableSparkList';
import { EmptyState } from '../components/EmptyState';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ListDetail'>;

export function ListDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const { lists, reorderListSparks, refresh } = useLists();
  const list = lists.find((item) => item.id === route.params.listId);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const listSourceIds = useMemo(() => {
    if (!list) return [];
    return list.items?.length
      ? [...list.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.sparkId)
      : list.sparkIds;
  }, [list]);

  useEffect(() => {
    if (!list) return;
    setOrderedIds((current) => sameIds(current, listSourceIds) ? current : listSourceIds);
  }, [list, listSourceIds]);

  if (!list || list.status === 'deleted') {
    return (
      <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}>
        <BackButton label="Go back" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>This list is no longer available.</Text>
        <Text style={styles.subtitle}>Deleted lists stay private. Browse your available Sparkbook lists to keep going.</Text>
        <Button label="View suggestions" onPress={() => navigation.replace('SavedListError', { listId: route.params.listId })} />
      </ScrollView>
    );
  }

  const listSparks = orderedIds
    .map((id) => sparks.find((spark) => spark.id === id && spark.status === 'active'))
    .filter((spark): spark is NonNullable<typeof spark> => Boolean(spark));

  return (
    <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 96 }]}>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.hero}>
        <Text style={styles.title}>{list.title}</Text>
        {list.description ? <Text style={styles.subtitle}>{list.description}</Text> : null}
        <Text style={styles.meta}>{listSparks.length} {listSparks.length === 1 ? 'spark' : 'sparks'} · {list.visibility}</Text>
      </View>
      <Button label="Start guide" onPress={() => navigation.navigate('GuideRoute', { listId: list.id })} />
      <Text style={styles.reorderHint}>Hold to reorder</Text>
      {listSparks.length ? (
        <DraggableSparkList
          sparks={listSparks}
          orderedIds={orderedIds}
          onOrderPreview={setOrderedIds}
          onOrderCommit={async (next) => {
            await reorderListSparks(list.id, next);
            await refresh();
          }}
          onOpenSpark={(sparkId) => navigation.navigate('SingleSparkFromList', { listId: list.id, sparkId })}
        />
      ) : <EmptyState title="This list is empty" message="Add sparks to build a route you can save." />}
      <CommentsSection targetType="list" targetId={list.id} inputPlaceholder="Add a comment" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, gap: spacing.md },
  hero: { gap: spacing.xs },
  title: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 22, lineHeight: 32 },
  subtitle: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 14, lineHeight: 20 },
  meta: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16, textTransform: 'capitalize' },
  reorderHint: { color: colors.altText, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16 }
});

function sameIds(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  return a.every((id, index) => id === b[index]);
}
