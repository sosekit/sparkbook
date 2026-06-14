import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.main} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs
  },
  label: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12
  }
});
