import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { SearchResult } from '../services/searchService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

type SearchResultsListProps = {
  results: SearchResult[];
  query: string;
  searching?: boolean;
  onSelect: (result: SearchResult) => void;
  onCreateFromQuery?: (query: string) => void;
};

export function SearchResultsList({ results, query, searching = false, onSelect, onCreateFromQuery }: SearchResultsListProps) {
  if (query.trim().length < 2) return null;

  return (
    <View style={styles.wrap}>
      {searching ? <Text style={styles.empty}>Searching locations</Text> : null}
      {!searching && !results.length ? (
        <Pressable accessibilityRole="button" onPress={() => onCreateFromQuery?.(query.trim())} disabled={!onCreateFromQuery} style={({ pressed }) => [styles.emptyAction, pressed ? styles.emptyPressed : null]}>
          <Text style={styles.empty}>No spark here yet. Tap to start one.</Text>
        </Pressable>
      ) : null}
      {results.map((result) => (
        <Pressable key={result.id} accessibilityRole="button" onPress={() => onSelect(result)} style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}>
          <View style={styles.icon}>
            <SparkbookIcon name={result.type === 'list' ? 'listInactive' : result.type === 'place' ? 'location' : 'spark'} color={colors.main} size={16} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title} numberOfLines={1}>{result.title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{result.subtitle}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: 12,
    overflow: 'hidden'
  },
  row: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerMuted
  },
  rowPressed: {
    backgroundColor: colors.neutral
  },
  icon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface
  },
  copy: { flex: 1, gap: 2 },
  title: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16 },
  subtitle: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 11, lineHeight: 14 },
  empty: { color: colors.altText, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16, padding: spacing.sm }
  ,
  emptyAction: { minHeight: 44, backgroundColor: colors.surface, justifyContent: 'center' },
  emptyPressed: { backgroundColor: colors.neutral }
});
