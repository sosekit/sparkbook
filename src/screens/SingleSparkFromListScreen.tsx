import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { BookmarkToggle } from '../components/BookmarkToggle';
import { BottomNav } from '../components/BottomNav';
import { CTAButton } from '../components/CTAButton';
import { SparkMediaGallery } from '../components/SparkMediaGallery';
import { useBookmarks } from '../hooks/useBookmarks';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { Spark } from '../types/spark';

type Props = NativeStackScreenProps<RootStackParamList, 'SingleSparkFromList'>;

export function SingleSparkFromListScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lists } = useLists();
  const { sparks } = useSparks();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const list = lists.find((item) => item.id === route.params.listId);
  const orderedIds = list?.items?.length ? [...list.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.sparkId) : list?.sparkIds || [];
  const listSparks = orderedIds
    .map((id) => sparks.find((spark) => spark.id === id && spark.status === 'active'))
    .filter((spark): spark is Spark => Boolean(spark));
  const spark = listSparks.find((item) => item.id === route.params.sparkId) || listSparks[0];
  const currentIndex = spark ? listSparks.findIndex((item) => item.id === spark.id) : -1;
  const previousSpark = currentIndex > 0 ? listSparks[currentIndex - 1] : null;
  const nextSpark = currentIndex >= 0 && currentIndex < listSparks.length - 1 ? listSparks[currentIndex + 1] : null;

  if (!spark || !list) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <SparkbookIcon name="chevronLeft" color={colors.text} size={24} />
        </Pressable>
        <Text style={styles.title}>Spark unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top, minHeight: insets.top + 56 }]}>
        <View style={styles.headerTitleWrap}>
          <Pressable onPress={() => navigation.navigate('SparkListPreview', { listId: list.id, selectedSparkId: spark.id })} style={styles.back}>
            <SparkbookIcon name="chevronLeft" color={colors.text} size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>Spark</Text>
        </View>
        <BookmarkToggle saved={bookmarks.includes(spark.id)} onPress={() => toggleBookmark(spark.id)} size={30} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 88 }]}>
        <View style={styles.details}>
          <Text style={styles.title}>{spark.title}</Text>
          <Text style={styles.caption}>{spark.reflectionNote || spark.description || spark.caption || 'Saved in this Spark List.'}</Text>
          <View style={styles.locationRow}>
            <SparkbookIcon name="location" color={colors.text} size={16} />
            <Text style={styles.location} numberOfLines={1}>{spark.addressLabel}</Text>
          </View>
        </View>
        <SparkMediaGallery spark={spark} />
        <View style={styles.stats}>
          <Metric icon="chat" label="35" />
          <Metric icon="bookmark" label="1128" />
          <Metric icon="arrowForward" label="18" />
        </View>
        <View style={styles.switcher}>
          <CTAButton label={previousSpark ? 'Previous spark' : 'Back to list'} onPress={() => previousSpark ? navigation.replace('SingleSparkFromList', { listId: list.id, sparkId: previousSpark.id }) : navigation.navigate('SparkListPreview', { listId: list.id, selectedSparkId: spark.id })} />
          <CTAButton label={nextSpark ? 'Next spark' : 'Start exploring'} onPress={() => nextSpark ? navigation.replace('SingleSparkFromList', { listId: list.id, sparkId: nextSpark.id }) : navigation.navigate('GuideRoute', { listId: list.id })} />
        </View>
      </ScrollView>
      <BottomNav active="lists" onHome={() => navigation.navigate('HomeFeed')} onBookmarks={() => navigation.navigate('Bookmarks')} onCreate={() => navigation.navigate('CreateSpark')} onLists={() => navigation.navigate('Lists')} onProfile={() => navigation.navigate('Profile')} />
    </View>
  );
}

function Metric({ icon, label }: { icon: 'chat' | 'bookmark' | 'arrowForward'; label: string }) {
  return (
    <View style={styles.metric}>
      <SparkbookIcon name={icon === 'chat' ? 'friends' : icon} color={colors.text} size={16} />
      <Text style={styles.metricText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#CACACA' },
  headerTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  back: { width: 24, height: 44, justifyContent: 'center' },
  headerTitle: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 22, lineHeight: 32 },
  content: { gap: 8 },
  details: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  title: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 22, lineHeight: 32 },
  caption: { color: colors.text, fontFamily: fontFamilies.secondary, fontSize: 16, lineHeight: 24, borderTopWidth: 1, borderTopColor: '#EDEDED', paddingTop: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 4 },
  location: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16 },
  stats: { flexDirection: 'row', gap: 4, paddingHorizontal: 16, paddingVertical: 12 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricText: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  switcher: { paddingHorizontal: 16, gap: 8, paddingTop: 4 }
});
