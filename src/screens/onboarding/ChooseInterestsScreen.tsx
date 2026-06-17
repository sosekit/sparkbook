import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { CategoryIcon } from '../../components/CategoryIcon';
import { categories } from '../../data/categories';
import { profileService } from '../../services/profileService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseInterests'>;

const allowedIds = ['food', 'coffee', 'study', 'outdoors', 'art', 'nightlife'];

export function ChooseInterestsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const options = categories.filter((category) => allowedIds.includes(category.id));
  const [selected, setSelected] = useState<string[]>(['food', 'outdoors', 'art']);

  useEffect(() => {
    profileService.getProfile().then((profile) => {
      if (profile.interests?.length) setSelected(profile.interests.filter((id) => allowedIds.includes(id)));
    });
  }, []);

  async function continueToCreators() {
    const profile = await profileService.getProfile();
    await profileService.updateProfile({
      ...profile,
      interests: selected.length ? selected : ['food'],
      updatedAt: new Date().toISOString()
    });
    navigation.replace('FollowCreators');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose your interests</Text>
        <Text style={styles.copy}>Pick the kinds of sparks you want sparks to surface first.</Text>
      </View>
      <View style={styles.grid}>
        {options.map((category) => {
          const isSelected = selected.includes(category.id);
          return (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelected((current) => isSelected ? current.filter((id) => id !== category.id) : [...current, category.id])}
              style={({ pressed }) => [styles.chip, isSelected ? styles.chipSelected : null, pressed ? styles.chipPressed : null]}
            >
              <CategoryIcon categoryId={category.id} selected={isSelected} size={28} />
              <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : null]}>{category.name}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.footer}>
        <Button label="Continue" onPress={continueToCreators} rightIcon="arrowForward" />
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
  grid: {
    marginTop: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  chip: {
    minHeight: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 13
  },
  chipSelected: {
    backgroundColor: colors.main,
    borderColor: colors.main
  },
  chipPressed: {
    borderColor: colors.highlight
  },
  chipText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 13
  },
  chipTextSelected: {
    color: colors.white
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.sm
  }
});
