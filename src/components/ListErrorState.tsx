import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { SparkList } from '../types/list';
import { Spark } from '../types/spark';
import { ListCard } from './ListCard';
import { SearchBar } from './SearchBar';

export function ListErrorState({ query, onQuery, suggestion, sparks, onSuggestionPress }: { query: string; onQuery: (value: string) => void; suggestion?: SparkList | null; sparks: Spark[]; onSuggestionPress: () => void }) {
  return (
    <View style={styles.root}>
      <SearchBar value={query} onChangeText={onQuery} placeholder="Search Locations" />
      <View style={styles.message}>
        <Text style={styles.title}>Uh oh!</Text>
        <Text style={styles.body}>List seems to be have been deleted by the creator</Text>
      </View>
      {suggestion ? (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionTitle}>Spark Lists to Explore</Text>
          <ListCard list={suggestion} sparks={sparks} onPress={onSuggestionPress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm
  },
  message: {
    paddingTop: 10,
    gap: 6
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 20,
    lineHeight: 26
  },
  body: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16
  },
  suggestions: {
    paddingTop: 6,
    gap: spacing.xs
  },
  suggestionTitle: {
    color: colors.text,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 18,
    lineHeight: 23,
    textAlign: 'center'
  }
});
