import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudienceSelector } from '../components/AudienceSelector';
import { CTAButton } from '../components/CTAButton';
import { ProgressBar } from '../components/ProgressBar';
import { SearchBar } from '../components/SearchBar';
import { SparkGridItem } from '../components/SparkGridItem';
import { TextField } from '../components/TextField';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateSparkList'>;

export function CreateSparkListScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { createList, addSparkToList } = useLists();
  const { sparks } = useSparks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>();
  const [audience, setAudience] = useState<'public' | 'friends'>('public');
  const [selectedSparkIds, setSelectedSparkIds] = useState<string[]>(route.params?.initialSparkId ? [route.params.initialSparkId] : []);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const lastStep = useRef(0);

  const activeSparks = useMemo(() => sparks.filter((spark) => spark.status === 'active'), [sparks]);
  const filteredSparks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return activeSparks;
    return activeSparks.filter((spark) => `${spark.title} ${spark.placeName || ''} ${spark.addressLabel} ${(spark.contextTags || []).join(' ')}`.toLowerCase().includes(normalized));
  }, [activeSparks, query]);

  async function save() {
    if (!title.trim()) {
      setTitleError('Add a list title before posting.');
      return;
    }
    const list = await createList({
      title: title.trim(),
      description: description.trim() || undefined,
      visibility: audience
    });
    for (const sparkId of selectedSparkIds) {
      await addSparkToList(list.id, sparkId);
    }
    navigation.replace('ListDetail', { listId: list.id });
  }

  function toggleSpark(id: string) {
    setSelectedSparkIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      return next;
    });
  }

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !!draggingId,
    onPanResponderMove: (_, gesture) => {
      if (!draggingId) return;
      const rowShift = Math.trunc(gesture.dy / 216) * 2;
      const columnShift = Math.trunc(gesture.dx / 172);
      const step = rowShift + columnShift;
      if (step === lastStep.current) return;
      const delta = step - lastStep.current;
      lastStep.current = step;
      setSelectedSparkIds((current) => {
        const next = moveByStep(current, draggingId, delta);
        return next;
      });
    },
    onPanResponderRelease: () => {
      lastStep.current = 0;
      setDraggingId(null);
    }
  });

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 18, minHeight: insets.top + 82 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.close}>
          <SparkbookIcon name="close" color={colors.text} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>New List</Text>
      </View>
      <View style={styles.progressWrap}>
        <ProgressBar progress={selectedSparkIds.length ? 1 : 0.5} width="25%" />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleGroup}>
          <TextField label="" placeholder="Add a title for your list" value={title} onChangeText={(value) => { setTitle(value); setTitleError(undefined); }} variant="creationTitle" error={titleError} />
          <TextField label="" placeholder="Give this List a Description" value={description} onChangeText={setDescription} variant="creationCaption" />
        </View>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Add Sparks</Text>
        <Text style={styles.caption}>Hold and Drag to Reorder</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search sparks" />
        <View style={styles.sparkGrid}>
          {filteredSparks.map((spark) => {
            const selected = selectedSparkIds.includes(spark.id);
            const order = selected ? selectedSparkIds.indexOf(spark.id) + 1 : undefined;
            const dragging = draggingId === spark.id;
            return (
              <SparkGridItem
                key={spark.id}
                spark={spark}
                selected={selected}
                order={order}
                dragging={dragging}
                onPress={() => !draggingId ? toggleSpark(spark.id) : undefined}
                onLongPress={() => {
                  if (!selected) toggleSpark(spark.id);
                  lastStep.current = 0;
                  setDraggingId(spark.id);
                }}
                panHandlers={dragging ? panResponder.panHandlers : undefined}
              />
            );
          })}
        </View>
        <AudienceSelector value={audience} onChange={(value) => value !== 'private' ? setAudience(value) : undefined} options={['public', 'friends']} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <CTAButton label="Post List" onPress={save} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  close: { width: 28, height: 44, justifyContent: 'center' },
  headerTitle: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 24, lineHeight: 30 },
  progressWrap: { paddingHorizontal: 16, paddingBottom: 12 },
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 110, gap: 6 },
  titleGroup: { minHeight: 64 },
  divider: { height: 1, backgroundColor: colors.main, marginVertical: 4 },
  sectionTitle: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 24, lineHeight: 30 },
  caption: { color: colors.text, fontFamily: fontFamilies.secondary, fontSize: 14 },
  sparkGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingTop: 8, paddingBottom: 12 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.neutral },
});

function moveByStep(ids: string[], id: string, step: number) {
  const from = ids.indexOf(id);
  if (from < 0) return ids;
  const to = Math.max(0, Math.min(ids.length - 1, from + step));
  if (from === to) return ids;
  const next = [...ids];
  next.splice(from, 1);
  next.splice(to, 0, id);
  return next;
}
