import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { DEMO_MODE } from '../../config/demoMode';
import { authService } from '../../services/authService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  async function continueAsRay() {
    await authService.continueAsDemoUser();
    navigation.replace('CreateProfileOnboarding');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.hero}>
        <Logo style={styles.logo} />
        <Text style={styles.title}>Save places worth coming back to.</Text>
        <Text style={styles.copy}>Create sparks, build lists, and explore places shared by people you trust.</Text>
      </View>
      <View style={styles.actions}>
        <Button label="Get started" onPress={() => navigation.navigate('SignIn')} rightIcon="arrowForward" />
        <Button label="I already have an account" variant="secondary" onPress={() => navigation.navigate('SignIn')} />
        {DEMO_MODE ? (
          <Pressable accessibilityRole="button" hitSlop={10} onPress={continueAsRay} style={({ pressed }) => [styles.demoLink, pressed ? styles.pressed : null]}>
            <Text style={styles.demoText}>Continue as Ray</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: 22
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md
  },
  logo: {
    fontSize: 40,
    lineHeight: 46
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 34,
    lineHeight: 40,
    maxWidth: 320
  },
  copy: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320
  },
  actions: {
    gap: spacing.sm
  },
  demoLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  demoText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 14
  },
  pressed: {
    opacity: 0.62
  }
});
