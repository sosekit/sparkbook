import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { SparksIcon } from '../../assets/icons/SparksIcon';
import { authService } from '../../services/authService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

type SignInOptionProps = {
  label: string;
  onPress: () => void;
};

export function SignInScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');

  async function continueWith(provider: 'apple' | 'google' | 'email' | 'demo') {
    if (provider === 'demo') {
      await authService.continueAsDemoUser();
    } else if (provider === 'email') {
      await authService.signIn('raymond@example.com', 'sparks-demo');
    } else {
      const result = await authService.signInWithProvider(provider);
      if (result.fallback) setMessage('OAuth is not configured here, so sparks opened the Ray demo profile.');
    }
    navigation.replace('CreateProfileOnboarding');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 20 }]}>
      <Pressable accessibilityRole="button" hitSlop={10} onPress={() => navigation.goBack()} style={styles.back}>
        <SparksIcon name="chevronLeft" color={colors.text} size={22} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <View style={styles.copyBlock}>
        <Text style={styles.title}>Sign in to sparks</Text>
        <Text style={styles.copy}>Keep your sparks, lists, and places to revisit with your profile.</Text>
      </View>
      <View style={styles.options}>
        <SignInOption label="Continue with Apple" onPress={() => continueWith('apple')} />
        <SignInOption label="Continue with Google" onPress={() => continueWith('google')} />
        <SignInOption label="Continue with Email" onPress={() => continueWith('email')} />
        <Button label="Continue as Demo User" variant="secondary" onPress={() => continueWith('demo')} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
}

function SignInOption({ label, onPress }: SignInOptionProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.option, pressed ? styles.optionPressed : null]}>
      <Text style={styles.optionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 22
  },
  back: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  backText: {
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 16
  },
  copyBlock: {
    marginTop: 54,
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
  options: {
    marginTop: 34,
    gap: spacing.sm
  },
  option: {
    minHeight: 48,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionPressed: {
    backgroundColor: colors.neutral,
    borderColor: colors.highlight
  },
  optionText: {
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 14
  },
  message: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 17
  }
});
