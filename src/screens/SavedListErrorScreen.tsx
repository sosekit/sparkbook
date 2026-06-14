import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { ListErrorState } from '../components/ListErrorState';
import { useSparks } from '../hooks/useSparks';
import { suggestionService } from '../services/suggestionService';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { SparkList } from '../types/list';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedListError'>;

export function SavedListErrorScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState<SparkList | null>(null);

  useEffect(() => {
    suggestionService.replacementForDeletedList().then(setSuggestion);
  }, []);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8, minHeight: insets.top + 64 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.close}>
          <SparkbookIcon name="close" color={colors.text} size={24} />
        </Pressable>
        <Text style={styles.title}>Saved Spark Lists</Text>
      </View>
      <View style={styles.content}>
        <ListErrorState
          query={query}
          onQuery={setQuery}
          suggestion={suggestion}
          sparks={sparks.filter((spark) => suggestion?.sparkIds.includes(spark.id))}
          onSuggestionPress={() => suggestion ? navigation.replace('SparkListPreview', { listId: suggestion.id }) : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 16 },
  close: { width: 24, height: 44, justifyContent: 'center' },
  title: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 24, lineHeight: 32 },
  content: { paddingHorizontal: 16, paddingTop: 0 }
});
