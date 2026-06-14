import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CTAButton } from '../components/CTAButton';
import { ProgressBar } from '../components/ProgressBar';
import { SparkPreviewCard } from '../components/SparkPreviewCard';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PostSparkOptions'>;

export function PostSparkOptionsScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const spark = sparks.find((item) => item.id === route.params.sparkId);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8, minHeight: insets.top + 64 }]}>
        <Text style={styles.headerText}>Your spark is saved.</Text>
        <ProgressBar progress={1} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {spark ? <SparkPreviewCard spark={spark} /> : null}
          {spark ? <SparkPreviewCard spark={spark} /> : null}
        </ScrollView>
        <View style={styles.details}>
          <Text style={styles.title}>{spark?.title || 'Spark published'}</Text>
          <Text style={styles.caption}>{spark?.description || 'Ready to keep as an individual spark or organize into a list.'}</Text>
          <Text style={styles.location}>{spark?.addressLabel || 'Saved location'}</Text>
        </View>
        <View style={styles.cta}>
          <CTAButton label="Add this spark to a list" onPress={() => navigation.navigate('AddSparkToList', { sparkId: route.params.sparkId })} />
          <Pressable onPress={() => navigation.replace('SparkDetail', { sparkId: route.params.sparkId })}>
            <Text style={styles.leave}>Save as an individual spark</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { justifyContent: 'center', gap: 8 },
  headerText: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 20, lineHeight: 25, textAlign: 'center' },
  content: { paddingTop: 8, paddingBottom: 40, gap: spacing.md },
  carousel: { paddingHorizontal: 16, gap: 6 },
  details: { paddingHorizontal: 16, gap: 8 },
  title: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 24, lineHeight: 32 },
  caption: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 14, lineHeight: 20 },
  location: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 13 },
  cta: { paddingHorizontal: 16, paddingTop: 8, gap: spacing.md },
  leave: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 13, lineHeight: 16, textAlign: 'center' }
});
