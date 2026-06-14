import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../components/Avatar';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { SmallButton } from '../components/SmallButton';
import { SparkCard } from '../components/SparkCard';
import { useAuth } from '../hooks/useAuth';
import { useRevisit } from '../hooks/useRevisit';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { sparks } = useSparks();
  const revisitState = useRevisit();
  const [query, setQuery] = useState('');
  const created = sparks.filter((spark) => spark.createdBy === 'profile-ray' && spark.status === 'active');
  const timeline = useMemo(() => created
    .filter((spark) => {
      const text = `${spark.title} ${spark.addressLabel} ${spark.reflectionNote || ''} ${(spark.contextTags || []).join(' ')}`.toLowerCase();
      return text.includes(query.trim().toLowerCase());
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [created, query]);
  const revisitCount = created.filter((spark) => spark.wantToRevisit).length;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}>
        <View style={styles.profileCard}>
          <Avatar name={profile?.displayName} size={72} />
          <View style={styles.profileCopy}>
            <Text style={styles.title}>{profile?.displayName || 'Create profile'}</Text>
            <Text style={styles.subtitle}>@{profile?.username || 'sparkbook'}</Text>
            <Text style={styles.body}>{profile?.bio || 'Add a bio to tell people what you spark.'}</Text>
          </View>
        </View>
        <Button label="Edit profile" onPress={() => navigation.navigate('EditProfile')} />
        <View style={styles.stats}>
          <View style={styles.stat}><Text style={styles.statNumber}>{created.length}</Text><Text style={styles.statLabel}>Sparks</Text></View>
          <View style={styles.stat}><Text style={styles.statNumber}>{revisitCount}</Text><Text style={styles.statLabel}>To revisit</Text></View>
          <View style={styles.stat}><Text style={styles.statNumber}>{created.filter((spark) => spark.visibility === 'friends').length}</Text><Text style={styles.statLabel}>Shared</Text></View>
        </View>
        <Text style={styles.section}>Personal archive</Text>
        <Text style={styles.archiveCopy}>Recently saved places, notes for future you, and sparks you may want to revisit.</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search Locations" />
        <View style={styles.timeline}>
          <SmallButton label="Timeline" selected />
        </View>
        {revisitState.events.length ? (
          <>
            <Text style={styles.section}>Recent revisits</Text>
            {revisitState.events.slice(0, 3).map((event) => {
              const spark = sparks.find((item) => item.id === event.sparkId);
              if (!spark) return null;
              return <SparkCard key={event.id} spark={spark} onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })} />;
            })}
          </>
        ) : null}
        {timeline.map((spark) => (
          <SparkCard key={spark.id} spark={spark} onPress={() => navigation.navigate('SparkDetail', { sparkId: spark.id })} />
        ))}
      </ScrollView>
      <BottomNav active="profile" onHome={() => navigation.navigate('HomeFeed')} onBookmarks={() => navigation.navigate('Bookmarks')} onCreate={() => navigation.navigate('CreateSpark')} onLists={() => navigation.navigate('Lists')} onProfile={() => undefined} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingBottom: 58 },
  content: { padding: 14, gap: spacing.sm },
  profileCard: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg
  },
  profileCopy: {
    width: '100%',
    alignItems: 'center',
    gap: 2
  },
  title: { color: colors.text, fontFamily: fontFamilies.primaryBold, fontSize: 22, lineHeight: 28, textAlign: 'center' },
  subtitle: { color: colors.main, fontFamily: fontFamilies.secondary, fontWeight: '800', textAlign: 'center' },
  body: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 17, marginTop: 2, textAlign: 'center' },
  section: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 18 },
  stats: { flexDirection: 'row', gap: spacing.xs },
  stat: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.neutral, borderRadius: radius.md, padding: spacing.sm },
  statNumber: { color: colors.main, fontFamily: fontFamilies.primaryBold, fontSize: 20 },
  statLabel: { color: colors.altText, fontFamily: fontFamilies.secondaryBold, fontSize: 10 },
  archiveCopy: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 17 },
  timeline: { flexDirection: 'row', gap: spacing.xs }
});
