import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Entry'>;

export function EntryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('HomeFeed'), 900);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Pressable onPress={() => navigation.replace('HomeFeed')} style={[styles.root, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.center}>
        <Logo style={styles.logo} />
        <Text style={styles.line}>Save places worth finding again.</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.neutral,
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
