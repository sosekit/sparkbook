import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../components/Avatar';
import { BackButton } from '../components/BackButton';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { ListCard } from '../components/ListCard';
import { SparkCard } from '../components/SparkCard';
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

type Props = NativeStackScreenProps<RootStackParamList, 'CreatorProfile'>;

export function CreatorProfileScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const { lists } = useLists();
  const follows = useFollows();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    profileService.getProfileById(route.params.profileId).then(setProfile);
  }, [route.params.profileId]);

  const creatorSparks = useMemo(() => sparks
    .filter((spark) => spark.status === 'active' && spark.createdBy === route.params.profileId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [route.params.profileId, sparks]);
  const creatorLists = useMemo(() => lists
    .filter((list) => list.status === 'active' && list.createdBy === route.params.profileId), [lists, route.params.profileId]);
  const following = follows.isFollowing(route.params.profileId);

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 24 }]}>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.profileCard}>
        <Avatar name={profile.displayName} size={52} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{profile.displayName}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
        </View>
      </View>
      <Button
        label={following ? 'Following' : 'Follow'}
        variant={following ? 'secondary' : 'primary'}
        onPress={() => follows.toggleFollow(profile.id)}
      />
      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statNumber}>{creatorSparks.length}</Text><Text style={styles.statLabel}>Sparks</Text></View>
        <View style={styles.stat}><Text style={styles.statNumber}>{creatorLists.length}</Text><Text style={styles.statLabel}>Lists</Text></View>
      </View>
      <Text style={styles.section}>Sparks</Text>
      {creatorSparks.length ? creatorSparks.map((spark) => (
        <SparkCard key={spark.id} spark={spark} onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })} />
      )) : <EmptyState title="No public sparks yet" message="Shared places from this creator will appear here." />}
      <Text style={styles.section}>Lists</Text>
      {creatorLists.length ? creatorLists.map((list) => (
        <ListCard key={list.id} list={list} sparks={sparks.filter((spark) => list.sparkIds.includes(spark.id))} onPress={() => navigation.navigate('SparkListPreview', { listId: list.id })} />
      )) : <EmptyState title="No public lists yet" message="Curated routes from this creator will appear here." />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 14, gap: spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  loading: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 14 },
  profileCard: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  title: { color: colors.text, fontFamily: fontFamilies.primaryBold, fontSize: 22, lineHeight: 28 },
  username: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  bio: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 17, marginTop: 2 },
  stats: { flexDirection: 'row', gap: spacing.xs },
  stat: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.neutral, borderRadius: radius.md, padding: spacing.sm },
  statNumber: { color: colors.main, fontFamily: fontFamilies.primaryBold, fontSize: 20 },
  statLabel: { color: colors.altText, fontFamily: fontFamilies.secondaryBold, fontSize: 10 },
  section: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 18 }
});
