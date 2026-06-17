import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { sampleProfiles } from '../../data/sampleProfiles';
import { followService } from '../../services/followService';
import { profileService } from '../../services/profileService';
import { storageService } from '../../services/storageService';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'FollowCreators'>;

const ray = sampleProfiles.find((profile) => profile.id === 'profile-ray') || sampleProfiles[0];

export function FollowCreatorsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [following, setFollowing] = useState<string[]>(['profile-ray']);

  useEffect(() => {
    followService.fetchFollowing().then((ids) => setFollowing(ids.length ? ids : ['profile-ray']));
  }, []);

  async function toggleRay() {
    const next = following.includes('profile-ray')
      ? following.filter((id) => id !== 'profile-ray')
      : ['profile-ray', ...following];
    setFollowing(next);
    if (next.includes('profile-ray')) await followService.follow('profile-ray');
    else await followService.unfollow('profile-ray');
  }

  async function finish() {
    const profile = await profileService.getProfile();
    await profileService.updateProfile({
      ...profile,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    });
    await storageService.saveOnboardingCompleted(true);
    if (following.includes('profile-ray')) await followService.follow('profile-ray');
    navigation.replace('HomeFeed');
  }

  const selected = following.includes('profile-ray');

  return (
    <View style={[styles.root, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Follow local creators</Text>
        <Text style={styles.copy}>Start with Ray’s Toronto sparks and curated routes.</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={toggleRay} style={({ pressed }) => [styles.creatorCard, selected ? styles.creatorCardSelected : null, pressed ? styles.creatorCardPressed : null]}>
        <Avatar name={ray.avatarInitials || ray.displayName} color={ray.avatarColor} size={58} initialsFontSize={19} />
        <View style={styles.creatorCopy}>
          <Text style={styles.creatorName}>{ray.displayName}</Text>
          <Text style={styles.creatorUsername}>@{ray.username}</Text>
          <Text style={styles.creatorBio}>{ray.bio}</Text>
        </View>
        <View style={[styles.followPill, selected ? styles.followPillSelected : null]}>
          <Text style={[styles.followText, selected ? styles.followTextSelected : null]}>{selected ? 'Following' : 'Follow'}</Text>
        </View>
      </Pressable>
      <View style={styles.footer}>
        <Button label="Continue to sparks" onPress={finish} rightIcon="arrowForward" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 22
  },
  header: {
    gap: spacing.sm
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 32,
    lineHeight: 38
  },
  copy: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 15,
    lineHeight: 22
  },
  creatorCard: {
    marginTop: 28,
    minHeight: 118,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md
  },
  creatorCardSelected: {
    borderColor: colors.main,
    backgroundColor: colors.neutral
  },
  creatorCardPressed: {
    borderColor: colors.highlight
  },
  creatorCopy: {
    flex: 1,
    gap: 2
  },
  creatorName: {
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 15
  },
  creatorUsername: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12
  },
  creatorBio: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 17
  },
  followPill: {
    minHeight: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.main,
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  followPillSelected: {
    backgroundColor: colors.main
  },
  followText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12
  },
  followTextSelected: {
    color: colors.white
  },
  footer: {
    marginTop: 'auto'
  }
});
