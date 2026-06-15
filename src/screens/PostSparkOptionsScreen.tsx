import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
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
      <View style={[styles.header, { paddingTop: insets.top + 6, minHeight: insets.top + 56 }]}>
        <Text style={styles.headerText}>Your spark is saved.</Text>
        <ProgressBar progress={1} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 112 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {spark ? <SparkPreviewCard spark={spark} onPress={() => navigation.replace('SparkDetail', { sparkId: route.params.sparkId })} /> : null}
        </ScrollView>
        <View style={styles.details}>
          <Text style={styles.title}>{spark?.title || 'Spark published'}</Text>
          <Text style={styles.caption}>{spark?.description || 'Ready to keep as an individual spark or organize into a list.'}</Text>
          <Text style={styles.location}>{spark?.addressLabel || 'Saved location'}</Text>
        </View>
        <View style={styles.cta}>
          <CTAButton label="Add this spark to a list" onPress={() => navigation.navigate('AddSparkToList', { sparkId: route.params.sparkId })} />
          <CTAButton label="View Spark Post" onPress={() => navigation.replace('SparkDetail', { sparkId: route.params.sparkId })} />
        </View>
      </ScrollView>
      <BottomNav
        active="create"
        onHome={() => navigation.navigate('HomeFeed')}
        onBookmarks={() => navigation.navigate('Bookmarks')}
        onCreate={() => navigation.navigate('CreateSpark')}
        onLists={() => navigation.navigate('Lists')}
        onProfile={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { justifyContent: 'center', gap: 6 },
  headerText: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 18, lineHeight: 23, textAlign: 'center' },
  content: { paddingTop: 6, gap: spacing.sm },
  carousel: { paddingHorizontal: 14, gap: 5 },
  details: { paddingHorizontal: 14, gap: 5 },
  title: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 20, lineHeight: 26 },
  caption: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 17 },
  location: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  cta: { paddingHorizontal: 14, paddingTop: 4, gap: spacing.sm }
});
