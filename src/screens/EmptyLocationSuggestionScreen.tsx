import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { SparkCard } from '../components/SparkCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'EmptyLocationSuggestion'>;

export function EmptyLocationSuggestionScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const suggestion = route.params.suggestedSpark;
  return (
    <View style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <Text style={styles.title}>No spark here yet</Text>
      <Text style={styles.body}>Start one for this place or explore a nearby suggestion.</Text>
      {suggestion ? <SparkCard spark={suggestion} onPress={() => navigation.navigate('SparkDetail', { sparkId: suggestion.id })} /> : null}
      <Button label="Create spark here" onPress={() => navigation.navigate('CreateSpark')} />
      <Button label="Back to map" onPress={() => navigation.navigate('HomeMap')} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: 16, justifyContent: 'center', gap: spacing.sm },
  title: { color: colors.text, fontFamily: fontFamilies.primaryBold, fontSize: 24, lineHeight: 30 },
  body: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 13, lineHeight: 18 }
});
