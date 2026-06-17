import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../components/Logo';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { storageService } from '../services/storageService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Entry'>;

export function EntryScreen({ navigation }: Props) {
  useEffect(() => {
    let mounted = true;

    async function route() {
      try {
        const [{ user }, onboardingCompleted] = await Promise.all([
          authService.getCurrentUser(),
          storageService.getOnboardingCompleted()
        ]);

        if (!mounted) return;
        if (!user) {
          navigation.replace('Welcome');
          return;
        }

        const profile = await profileService.getProfile(user.id || 'local-user');
        if (!mounted) return;
        if (!profile?.displayName || !profile.username) {
          navigation.replace('CreateProfileOnboarding');
          return;
        }
        if (!profile.interests?.length) {
          navigation.replace('ChooseInterests');
          return;
        }
        if (!onboardingCompleted && !profile.onboardingCompleted) {
          navigation.replace('FollowCreators');
          return;
        }
        navigation.replace('HomeFeed');
      } catch {
        if (mounted) navigation.replace('Welcome');
      }
    }

    route();
    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <Logo style={styles.logo} />
        <Text style={styles.line}>Save places worth coming back to.</Text>
        <ActivityIndicator color={colors.main} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 24
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm
  },
  logo: {
    fontSize: 34,
    lineHeight: 40
  },
  line: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 15,
    lineHeight: 22
  }
});
