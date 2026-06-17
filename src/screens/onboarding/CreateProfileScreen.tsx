import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { defaultProfile, profileService } from '../../services/profileService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateProfileOnboarding'>;

export function CreateProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState('Ray');
  const [username, setUsername] = useState('ray');
  const [initials, setInitials] = useState('RZ');
  const [bio, setBio] = useState('Toronto sparks, food walks, and places worth revisiting.');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileService.getProfile().then((profile) => {
      setDisplayName(profile.displayName || 'Ray');
      setUsername(profile.username || 'ray');
      setInitials(profile.avatarInitials || 'RZ');
      setBio(profile.bio || 'Toronto sparks, food walks, and places worth revisiting.');
    });
  }, []);

  async function saveProfile() {
    if (saving) return;
    setSaving(true);
    const now = new Date().toISOString();
    await profileService.updateProfile({
      ...defaultProfile,
      displayName: displayName.trim() || 'Ray',
      username: username.trim().replace(/^@/, '') || 'ray',
      bio: bio.trim() || undefined,
      avatarType: 'initials',
      avatarInitials: initials.trim().slice(0, 3).toUpperCase() || 'RZ',
      avatarColor: '#2E5BAD',
      updatedAt: now
    });
    setSaving(false);
    navigation.replace('ChooseInterests');
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Create your profile</Text>
          <Text style={styles.copy}>This is how your sparks and lists will show up to people you follow.</Text>
        </View>
        <View style={styles.avatarWrap}>
          <Avatar name={initials || displayName} color="#2E5BAD" size={84} initialsFontSize={26} />
        </View>
        <View style={styles.fields}>
          <TextField label="Display name" value={displayName} onChangeText={setDisplayName} placeholder="Ray" />
          <TextField label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="ray" />
          <TextField label="Avatar initials" value={initials} onChangeText={setInitials} autoCapitalize="characters" placeholder="RZ" />
          <TextField label="Bio" value={bio} onChangeText={setBio} multiline placeholder="A short note about your sparks" />
        </View>
        <Button label={saving ? 'Saving' : 'Continue'} onPress={saveProfile} rightIcon="arrowForward" disabled={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    paddingHorizontal: 22,
    gap: spacing.lg
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
  avatarWrap: {
    alignItems: 'center',
    gap: spacing.xs
  },
  fields: {
    gap: spacing.sm
  }
});
