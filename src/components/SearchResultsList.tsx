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
};

export function SearchResultsList({ results, query, searching = false, onSelect }: SearchResultsListProps) {
  if (query.trim().length < 2) return null;

  return (
    <View style={styles.wrap}>
      {searching ? <Text style={styles.empty}>Searching Toronto places...</Text> : null}
      {!searching && !results.length ? <Text style={styles.empty}>No spark here yet. Start one for this place.</Text> : null}
      {results.map((result) => (
        <Pressable key={result.id} onPress={() => onSelect(result)} style={styles.row}>
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
    borderColor: 'rgba(46, 91, 173, 0.18)',
    borderRadius: 12,
    overflow: 'hidden'
  },
  row: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(46, 91, 173, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface
  },
  copy: { flex: 1, gap: 2 },
  title: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 13, lineHeight: 18 },
  subtitle: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 16 },
  empty: { color: colors.altText, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16, padding: spacing.sm }
});
