import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { Button } from '../components/Button';
import { SparkCard } from '../components/SparkCard';
import { suggestionService } from '../services/suggestionService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { Spark } from '../types/spark';

type Props = NativeStackScreenProps<RootStackParamList, 'DeletedContentSuggestion'>;

export function DeletedContentSuggestionScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [suggestion, setSuggestion] = useState<Spark | null>(null);

  useEffect(() => {
    suggestionService.replacementForDeletedSpark().then(setSuggestion);
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <Text style={styles.title}>{route.params.contentType === 'spark' ? 'This spark is no longer available' : 'This list is no longer available'}</Text>
      <Text style={styles.body}>{suggestion ? 'Deleted content stays private. Here is a nearby place you might like instead.' : 'Deleted content stays private. Explore nearby sparks to keep going.'}</Text>
      {suggestion ? <SparkCard spark={suggestion} onPress={() => navigation.replace('SparkDetail', { sparkId: suggestion.id })} /> : null}
      {route.params.contentType === 'spark' ? <Button label="Explore nearby instead" onPress={() => suggestion ? navigation.replace('SparkDetail', { sparkId: suggestion.id }) : navigation.replace('HomeFeed')} /> : null}
      <BackButton label="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: 16, justifyContent: 'center', gap: spacing.sm },
  title: { color: colors.text, fontFamily: fontFamilies.primaryBold, fontSize: 24, lineHeight: 30 },
  body: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 13, lineHeight: 18 }
});
