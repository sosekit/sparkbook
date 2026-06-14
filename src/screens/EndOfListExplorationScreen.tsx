import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { CommentsSection } from '../components/CommentsSection';
import { ListCard } from '../components/ListCard';
import { SmallButton } from '../components/SmallButton';
import { useFollows } from '../hooks/useFollows';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { profileService } from '../services/profileService';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { Profile } from '../types/profile';

type Props = NativeStackScreenProps<RootStackParamList, 'EndOfListExploration'>;

export function EndOfListExplorationScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lists } = useLists();
  const { sparks } = useSparks();
  const follows = useFollows();
  const [creator, setCreator] = useState<Profile | null>(null);
  const list = lists.find((item) => item.id === route.params.listId);
  const activeLists = lists.filter((item) => item.status === 'active');
  const listSparks = list ? sparks.filter((spark) => list.sparkIds.includes(spark.id)) : [];
  const creatorId = list?.createdBy || 'profile-ray';
  const isOwnList = creatorId === 'profile-ray';

  useEffect(() => {
    profileService.getProfileById(creatorId).then(setCreator);
  }, [creatorId]);

  return (
    <View style={styles.root}>
      <View style={[styles.closeWrap, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => navigation.navigate('SparkListPreview', { listId: route.params.listId })} style={styles.close}>
          <SparkbookIcon name="close" color={colors.text} size={24} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.title}>How was your Spark List experience?</Text>
        {list ? (
          <ListCard list={list} sparks={listSparks} onPress={() => navigation.navigate('SparkListPreview', { listId: list.id })} />
        ) : null}
        <Text style={styles.copy}>Leave a comment or save it for later</Text>
        <View style={styles.metrics}>
          <Metric icon="friends" label="35" />
          <Metric icon="bookmark" label="1128" />
          <Metric icon="arrowForward" label="18" />
        </View>
        <View style={styles.creatorCard}>
          <View style={styles.creatorInfo}>
            <Avatar name={creator?.displayName || 'Sparkbook'} size={44} />
            <View>
              <Text style={styles.creatorName}>{creator?.displayName || 'Sparkbook'}</Text>
              <Text style={styles.creatorMeta}>{listSparks.length} Sparks | Creator</Text>
            </View>
          </View>
          {isOwnList ? <SmallButton label="Your list" selected /> : <SmallButton label={follows.isFollowing(creatorId) ? 'Following' : 'Follow'} selected={follows.isFollowing(creatorId)} onPress={() => follows.toggleFollow(creatorId)} />}
        </View>
        {list ? <CommentsSection targetType="list" targetId={list.id} inputPlaceholder="Share a thought about this list" /> : null}
        <Text style={styles.section}>Explore other Spark Lists</Text>
        {activeLists.filter((item) => item.id !== route.params.listId).slice(0, 2).map((item) => (
          <ListCard key={item.id} list={item} sparks={sparks.filter((spark) => item.sparkIds.includes(spark.id))} onPress={() => navigation.replace('SparkListPreview', { listId: item.id })} />
        ))}
        <View style={styles.actions}>
          <Button label="Back to list" onPress={() => navigation.navigate('SparkListPreview', { listId: route.params.listId })} />
          <Button label="Home" variant="secondary" onPress={() => navigation.navigate('HomeFeed')} />
          <Button label="Saved lists" variant="ghost" onPress={() => navigation.navigate('Lists')} />
        </View>
      </ScrollView>
    </View>
  );
}

function Metric({ icon, label }: { icon: 'friends' | 'bookmark' | 'arrowForward'; label: string }) {
  return (
    <View style={styles.metric}>
      <SparkbookIcon name={icon} color={colors.text} size={16} />
      <Text style={styles.metricText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  closeWrap: { minHeight: 68, paddingHorizontal: 16, justifyContent: 'center' },
  close: { width: 32, height: 44, justifyContent: 'center' },
  content: { paddingHorizontal: 16, gap: spacing.sm, alignItems: 'stretch' },
  title: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 22, lineHeight: 32, textAlign: 'center', paddingHorizontal: 24 },
  copy: { color: colors.text, fontFamily: fontFamilies.secondary, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  metrics: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, paddingVertical: 4 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricText: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  creatorCard: { borderWidth: 1, borderColor: '#CACACA', borderRadius: radius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  creatorInfo: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  creatorName: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 14, lineHeight: 24 },
  creatorMeta: { color: colors.text, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 16 },
  section: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 4 },
  actions: { gap: 8, paddingTop: 8 }
});
