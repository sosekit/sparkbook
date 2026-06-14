import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { profileService } from '../services/profileService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    profileService.getProfile().then((profile) => {
      setDisplayName(profile.displayName);
      setUsername(profile.username);
      setBio(profile.bio || '');
    });
  }, []);

  async function save() {
    const profile = await profileService.getProfile();
    await profileService.updateProfile({ ...profile, displayName, username, bio, avatarInitials: initials(displayName) });
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 24 }]}>
        <BackButton label="Cancel" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Edit profile</Text>
        <TextField label="Display name" value={displayName} onChangeText={setDisplayName} />
        <TextField label="Username" value={username} onChangeText={setUsername} />
        <TextField label="Bio" value={bio} onChangeText={setBio} multiline />
        <Button label="Save profile" onPress={save} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SB';
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 14, gap: spacing.sm },
  title: { color: colors.text, fontFamily: fontFamilies.primaryBold, fontSize: 24, lineHeight: 30 }
});
