import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { EmptyState } from '../components/EmptyState';
import { ListCard } from '../components/ListCard';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { SparkList } from '../types/list';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Lists'>;

export function ListsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lists } = useLists();
  const { sparks } = useSparks();
  const active = lists.filter((list) => list.status === 'active');
  const createdLists = active.filter((list) => list.createdBy === 'profile-ray' && list.listType === 'collected' && list.visibility !== 'private');
  const privateLists = active.filter((list) => list.createdBy === 'profile-ray' && list.visibility === 'private');
  const createdIds = new Set([...createdLists, ...privateLists].map((list) => list.id));
  const savedLists = active.filter((list) => !createdIds.has(list.id) && list.visibility !== 'private');

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top, height: insets.top + 56 }]}>
        <Text style={styles.title}>Your Lists</Text>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 88 }]}>
        <Pressable onPress={() => navigation.navigate('CreateSparkList')} style={({ pressed }) => [styles.createList, pressed ? styles.createListPressed : null]}>
          <Text style={styles.createText}>Create new list</Text>
          <SparkbookIcon name="add" color={colors.main} size={14} />
        </Pressable>
        <ListSection title="Recently Created Lists" lists={createdLists} sparks={sparks} onOpen={(listId) => navigation.navigate('SparkListPreview', { listId })} />
        <ListSection title="Private Lists" lists={privateLists} sparks={sparks} emptyMessage="Private routes you create will stay here." onOpen={(listId) => navigation.navigate('SparkListPreview', { listId })} />
        <ListSection title="Saved Lists" lists={savedLists} sparks={sparks} emptyMessage="Save a public or friends list to revisit it here." onOpen={(listId) => navigation.navigate('SparkListPreview', { listId })} />
        {!active.length ? <EmptyState title="No lists yet" message="Create or save lists to guide future exploration." /> : null}
      </ScrollView>
      <BottomNav active="lists" onHome={() => navigation.navigate('HomeFeed')} onBookmarks={() => navigation.navigate('Bookmarks')} onCreate={() => navigation.navigate('CreateSpark')} onLists={() => undefined} onProfile={() => navigation.navigate('Profile')} />
    </View>
  );
}

function ListSection({ title, lists, sparks, emptyMessage, onOpen }: { title: string; lists: SparkList[]; sparks: ReturnType<typeof useSparks>['sparks']; emptyMessage?: string; onOpen: (listId: string) => void }) {
  if (!lists.length && !emptyMessage) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {lists.length ? (
        <View style={styles.cardStack}>
          {lists.map((list) => (
            <ListCard key={list.id} list={list} sparks={sparks.filter((spark) => list.sparkIds.includes(spark.id))} onPress={() => onOpen(list.id)} />
          ))}
        </View>
      ) : (
        <Text style={styles.emptySectionText}>{emptyMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
    gap: 16
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 22,
    lineHeight: 32
  },
  createList: {
    width: '100%',
    height: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.main,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs
  },
  createListPressed: {
    backgroundColor: colors.neutral
  },
  createText: {
    color: colors.main,
    fontFamily: fontFamilies.secondary,
    fontSize: 14,
    lineHeight: 24
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 22,
    lineHeight: 32
  },
  cardStack: {
    gap: 16
  },
  emptySectionText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 17
  }
});
